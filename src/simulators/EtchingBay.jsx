/**
 * 식각 베이 (Etching Bay) — 단일 장비 화면 프로토타입
 *
 * 기존 EtchingSimulator.js 의 대안 화면이다. 원본은 건드리지 않았고,
 * 물리 계산은 src/physics/etching.js 를 그대로 공유한다. 숫자는 한 자리도 다르지 않다.
 *
 * ── 무엇이 다른가 ──
 * 원본은 탭 6개(이론/개요/요소/원리/메커니즘/평가)로 화면을 **공간 분할** 한다.
 * 학습자는 어느 탭부터 봐야 하는지 스스로 정해야 하고, 여섯 개가 늘 옆에 떠 있다.
 *
 * 여기서는 같은 내용을 장비 시퀀스에 얹어 **시간 분할** 한다.
 *   IDLE → LOADING → PUMPING → READY → PROCESSING → ENDPOINT → VENTING → REPORT
 * 각 단계에서 화면에 나오는 것은 그 단계에 필요한 것뿐이고,
 * 주 액션 버튼은 언제나 딱 하나다. 정보량은 그대로인데 동시 노출만 줄어든다.
 *
 * 내용은 버리지 않고 시퀀스 위에 재배치했다.
 *   - 이론    → PUMPING 대기 시간에 (실제로 기다리는 구간이라 자연스럽다)
 *   - 원리/요소 → READY 단계에서 만지는 파라미터 옆 해설로
 *   - 평가    → REPORT 에서 "왜 이렇게 나왔나" 로
 *
 * ── 정확도 ──
 * 물리 모델의 한계는 src/physics/etching.js 주석과 동일하다. 경향은 맞지만
 * 절대 식각률·선택비는 장비마다 다르다. 실제 공정 조건 산출에 쓰면 안 된다.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  calculateEtchRate,
  calculateSelectivity,
  calculateUniformity,
  calculatePressureEffect,
} from '../physics/etching';

/* ────────────────────────── 상수 ────────────────────────── */

const ATM_MTORR = 760000;      // 대기압
const BASE_MTORR = 5;          // 도달 진공
const FILM_NM = 500;           // 식각할 막 두께
const TICK_MS = 100;           // 시뮬레이션 틱
const SIM_SPEED = 10;          // 실시간 대비 배속 (틱당 1초)

const TARGETS = [
  { id: 'Si',    label: 'Si',     desc: '폴리실리콘 게이트',  under: 'SiO2' },
  { id: 'SiO2',  label: 'SiO₂',   desc: '산화막 콘택홀',      under: 'Si' },
  { id: 'Si3N4', label: 'Si₃N₄',  desc: '질화막 스페이서',    under: 'SiO2' },
  { id: 'PR',    label: 'PR',     desc: '포토레지스트 애싱',  under: 'Si' },
];

const GASES = [
  { id: 'Cl2',  label: 'Cl₂',  max: 100, role: 'Si 주 식각종. 늘리면 식각률이 오르지만 선택비가 깎인다.' },
  { id: 'HBr',  label: 'HBr',  max: 100, role: '측벽 passivation. 이방성과 선택비를 올리지만 30 sccm을 넘으면 식각률을 되레 눌러버린다.' },
  { id: 'CF4',  label: 'CF₄',  max: 100, role: '산화막 주 식각종. F 라디칼이 많아지면 선택비가 떨어진다.' },
  { id: 'CHF3', label: 'CHF₃', max: 100, role: '폴리머 생성. 하부층을 덮어 선택비를 올리지만 과하면 etch stop.' },
  { id: 'O2',   label: 'O₂',   max: 50,  role: 'PR 애싱. 폴리머를 태워 없앤다.' },
  { id: 'Ar',   label: 'Ar',   max: 100, role: '물리 스퍼터. 이방성엔 도움, 선택비엔 손해.' },
];

/** 펌핑 대기 중 보여줄 이론 — 원본의 '이론' 탭 내용을 이 구간으로 옮겨왔다. */
const PUMPDOWN_NOTES = [
  {
    at: 0.0,
    head: '왜 진공부터인가',
    body: '대기압에서는 분자가 서로 계속 부딪혀서 이온이 웨이퍼까지 직진하지 못한다. 압력을 낮춰 평균 자유행정을 챔버 크기만큼 키워야 이방성 식각이 가능해진다.',
  },
  {
    at: 0.35,
    head: '건식 식각 = 화학 + 물리',
    body: '라디칼이 표면과 반응해 휘발성 생성물을 만들고(화학), 이온이 수직으로 때려 반응을 가속한다(물리). 둘이 함께 작용할 때 식각률이 각각의 합보다 커진다 — 시너지 효과.',
  },
  {
    at: 0.7,
    head: '이방성은 어디서 오나',
    body: '측벽에는 이온이 거의 닿지 않는다. 그래서 바닥만 파이고 옆은 남는다. 압력이 높아지면 이온이 산란돼 옆도 깎이기 시작하고, 프로파일이 무너진다.',
  },
];

/* ────────────────────────── 유틸 ────────────────────────── */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const fmt = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : '—');

/** 대기압 → 목표압 로그 스케일 하강 */
function pumpCurve(t) {
  const a = Math.log10(ATM_MTORR);
  const b = Math.log10(BASE_MTORR);
  return Math.pow(10, a + (b - a) * clamp(t, 0, 1));
}

/* ────────────────────────── 작은 부품들 ────────────────────────── */

function Lamp({ on, label, warn }) {
  const color = on ? (warn ? '#E0A24A' : '#6FBF8E') : '#4A443A';
  return (
    <div className="eb-lamp" title={label}>
      <span
        className="eb-lamp-dot"
        style={{
          background: color,
          boxShadow: on ? `0 0 8px ${color}` : 'none',
        }}
      />
      <span className="eb-lamp-txt" style={{ color: on ? '#C9BFA5' : '#6B6353' }}>
        {label}
      </span>
    </div>
  );
}

/** 노브형 컨트롤. 값 조절은 슬라이더로 하되, 시각은 장비 노브를 따른다. */
function Knob({ label, unit, value, min, max, step, onChange, disabled, hint }) {
  const pct = (value - min) / (max - min);
  const sweep = Math.round(pct * 270);
  const [open, setOpen] = useState(false);

  return (
    <div className={`eb-knob-row ${disabled ? 'is-off' : ''}`}>
      <div
        className="eb-knob"
        style={{ '--sweep': `${sweep}deg` }}
        aria-hidden="true"
      >
        <span className="eb-knob-cap" />
      </div>

      <div className="eb-knob-main">
        <div className="eb-knob-head">
          <span className="eb-knob-label">{label}</span>
          <span className="eb-knob-val">
            {value}
            <small>{unit}</small>
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label} (${unit})`}
        />
        {hint && (
          <button
            type="button"
            className="eb-why"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? '닫기' : '이 값이 하는 일'}
          </button>
        )}
        {open && hint && <p className="eb-hint">{hint}</p>}
      </div>
    </div>
  );
}

/* ────────────────────────── 챔버 단면도 ────────────────────────── */

function ChamberView({ phase, pressure, power, depth, isotropy, target, glowSeed }) {
  const plasmaOn = phase === 'PROCESSING' || phase === 'ENDPOINT';
  const glow = plasmaOn ? clamp(0.25 + power / 900, 0.25, 0.95) : 0;

  // 단면 좌표
  const W = 320, H = 210;
  const trenchTop = 78;              // 막 상면 y
  const filmH = 62;                  // 막 두께 픽셀
  const maxDepth = filmH;
  const d = clamp(depth / FILM_NM, 0, 1) * maxDepth;

  // 압력이 높을수록 등방성 → 언더컷 폭
  const under = (isotropy - 0.5) * 9 * clamp(depth / FILM_NM, 0, 1);

  const openL = 128, openR = 192;    // 마스크 개구부

  // 플라즈마 입자 (렌더 시드로 고정 — 매 프레임 튀지 않게)
  const parts = useMemo(() => {
    const n = plasmaOn ? Math.round(10 + (power / 800) * 26) : 0;
    const out = [];
    for (let i = 0; i < n; i++) {
      const s = (i * 9301 + glowSeed * 49297) % 233280;
      out.push({
        x: 34 + ((s / 233280) * 252),
        y: 16 + (((s * 7) % 233280) / 233280) * 52,
        r: 1.2 + (((s * 13) % 100) / 100) * 1.3,
      });
    }
    return out;
  }, [plasmaOn, power, glowSeed]);

  const t = TARGETS.find((x) => x.id === target) || TARGETS[0];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="eb-chamber" role="img"
         aria-label={`챔버 단면. ${t.label} 식각 깊이 ${Math.round(depth)} 나노미터`}>
      <defs>
        <radialGradient id="eb-plasma" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F0C464" stopOpacity={glow} />
          <stop offset="60%" stopColor="#C98A2E" stopOpacity={glow * 0.35} />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eb-si" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A6070" />
          <stop offset="100%" stopColor="#3A3F4C" />
        </linearGradient>
        <clipPath id="eb-clip">
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>

      <g clipPath="url(#eb-clip)">
        {/* 챔버 벽 */}
        <rect x="18" y="8" width={W - 36} height={H - 30} rx="6"
              fill="#191710" stroke="#3B362C" strokeWidth="1" />

        {/* 플라즈마 */}
        {plasmaOn && (
          <rect x="19" y="9" width={W - 38} height="66" fill="url(#eb-plasma)" />
        )}
        {parts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#F5D082" opacity="0.75" />
        ))}

        {/* 이온 궤적 — 압력이 낮을수록 수직 */}
        {plasmaOn &&
          [0, 1, 2, 3, 4].map((i) => {
            const x = openL + 8 + i * 12;
            const spread = (isotropy - 0.5) * 7;
            return (
              <line
                key={i}
                x1={x}
                y1="70"
                x2={x + (i - 2) * spread}
                y2={trenchTop + d - 2}
                stroke="#F0C464"
                strokeWidth="0.8"
                opacity="0.5"
              />
            );
          })}

        {/* 하부층 (기판) */}
        <rect x="34" y={trenchTop + filmH} width={W - 68} height="44" fill="url(#eb-si)" />

        {/* 식각 대상 막 */}
        <path
          d={[
            `M34 ${trenchTop}`,
            `H${openL - under}`,
            `V${trenchTop + d}`,
            `H${openR + under}`,
            `V${trenchTop}`,
            `H${W - 34}`,
            `V${trenchTop + filmH}`,
            `H34 Z`,
          ].join(' ')}
          fill={target === 'PR' ? '#7A5A9E' : target === 'Si' ? '#8A8F9E' : '#6E8FA8'}
          stroke="#2A2620"
          strokeWidth="1"
        />

        {/* 마스크 (PR) */}
        {target !== 'PR' && (
          <>
            <rect x="34" y={trenchTop - 15} width={openL - 34} height="15" fill="#B98A4E" />
            <rect x={openR} y={trenchTop - 15} width={W - 34 - openR} height="15" fill="#B98A4E" />
          </>
        )}

        {/* 웨이퍼 척 */}
        <rect x="26" y={trenchTop + filmH + 44} width={W - 52} height="9" fill="#2E2A22" />

        {/* 깊이 눈금 */}
        <line x1={openR + 34} y1={trenchTop} x2={openR + 34} y2={trenchTop + maxDepth}
              stroke="#4A443A" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1={openR + 30} y1={trenchTop + d} x2={openR + 38} y2={trenchTop + d}
              stroke="#F0C464" strokeWidth="1.2" />
        <text x={openR + 42} y={trenchTop + d + 3.5} fontSize="8" fill="#F0C464"
              fontFamily="ui-monospace, Menlo, monospace">
          {Math.round(depth)}nm
        </text>

        {/* 라벨 */}
        <text x="38" y={trenchTop - 20} fontSize="7.5" fill="#8A8069"
              fontFamily="ui-monospace, Menlo, monospace">MASK</text>
        <text x="38" y={trenchTop + filmH - 5} fontSize="7.5" fill="#C9BFA5"
              fontFamily="ui-monospace, Menlo, monospace">{t.label}</text>
        <text x="38" y={trenchTop + filmH + 16} fontSize="7.5" fill="#9AA0AE"
              fontFamily="ui-monospace, Menlo, monospace">{t.under}</text>

        {/* 압력 표시 */}
        <text x={W - 34} y="24" fontSize="8" fill="#8A8069" textAnchor="end"
              fontFamily="ui-monospace, Menlo, monospace">
          {pressure >= 1000 ? `${(pressure / 1000).toFixed(0)}k` : fmt(pressure, 0)} mTorr
        </text>
      </g>
    </svg>
  );
}

/* ────────────────────────── OES 엔드포인트 신호 ────────────────────────── */

function OesTrace({ samples, detected }) {
  const W = 320, H = 56;
  if (samples.length < 2) {
    return (
      <div className="eb-oes eb-oes--idle">
        <span>OES · 신호 없음</span>
      </div>
    );
  }
  const n = samples.length;
  const pts = samples
    .map((v, i) => `${(i / (n - 1)) * W},${H - 6 - v * (H - 14)}`)
    .join(' ');

  return (
    <div className="eb-oes">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="광학 발광 분광 신호">
        <line x1="0" y1={H - 6} x2={W} y2={H - 6} stroke="#332F27" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke={detected ? '#E06C5A' : '#6FBF8E'}
                  strokeWidth="1.4" />
      </svg>
      <span className="eb-oes-cap">
        OES 405nm · {detected ? '엔드포인트 검출' : '식각 진행 중'}
      </span>
    </div>
  );
}

/* ────────────────────────── 본체 ────────────────────────── */

const PHASES = {
  IDLE:       { label: '대기',       step: 0, action: '웨이퍼 로드' },
  LOADING:    { label: '로드 중',    step: 1, action: null },
  PUMPING:    { label: '펌핑 중',    step: 2, action: null },
  READY:      { label: '준비 완료',  step: 3, action: '플라즈마 점화' },
  PROCESSING: { label: '식각 중',    step: 4, action: '긴급 정지' },
  ENDPOINT:   { label: '엔드포인트', step: 5, action: null },
  VENTING:    { label: '벤팅 중',    step: 6, action: null },
  REPORT:     { label: '완료',       step: 7, action: '새 런 시작' },
};

const STEP_NAMES = ['대기', '로드', '펌핑', '레시피', '식각', '검출', '벤팅', '리포트'];

export default function EtchingBay() {
  const [phase, setPhase] = useState('IDLE');
  const [pressure, setPressure] = useState(ATM_MTORR);
  const [pumpT, setPumpT] = useState(0);

  // 레시피
  const [target, setTarget] = useState('Si');
  const [setPressure_, setSetPressure] = useState(80);
  const [power, setPower] = useState(300);
  const [gasFlows, setGasFlows] = useState({
    Cl2: 50, HBr: 30, CF4: 0, CHF3: 0, O2: 0, Ar: 20,
  });

  // 런 상태
  const [depth, setDepth] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [oes, setOes] = useState([]);
  const [result, setResult] = useState(null);
  const [tickCount, setTickCount] = useState(0);

  const timer = useRef(null);
  const rateRef = useRef(0);

  /* ── 파생값 ── */
  const activeGasTotal = useMemo(
    () => Object.values(gasFlows).reduce((a, b) => a + b, 0),
    [gasFlows]
  );

  const preview = useMemo(() => {
    // 미리보기는 난수 없이 (rng = 0.5 고정) 계산해야 슬라이더가 흔들리지 않는다.
    const rng = () => 0.5;
    return {
      rate: calculateEtchRate(target, gasFlows, power, setPressure_, rng),
      sel: calculateSelectivity(target, gasFlows, power, setPressure_, rng),
      uni: calculateUniformity(setPressure_, power, gasFlows),
      iso: calculatePressureEffect(setPressure_),
    };
  }, [target, gasFlows, power, setPressure_]);

  /* ── 인터락 ── */
  const interlocks = useMemo(() => {
    const waferIn = ['PUMPING', 'READY', 'PROCESSING', 'ENDPOINT', 'VENTING', 'REPORT'].includes(phase)
      || phase === 'LOADING';
    return {
      wafer: waferIn,
      door: phase !== 'IDLE' && phase !== 'LOADING',
      vacuum: pressure <= setPressure_ * 1.5,
      gas: activeGasTotal > 0,
    };
  }, [phase, pressure, setPressure_, activeGasTotal]);

  const canIgnite =
    phase === 'READY' &&
    interlocks.wafer && interlocks.door && interlocks.vacuum && interlocks.gas &&
    power > 0 && preview.rate > 0;

  /* ── 시퀀스 진행 ── */
  const stop = useCallback(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  }, []);

  // 로드
  useEffect(() => {
    if (phase !== 'LOADING') return;
    const id = setTimeout(() => { setPhase('PUMPING'); setPumpT(0); }, 1200);
    return () => clearTimeout(id);
  }, [phase]);

  // 펌핑
  useEffect(() => {
    if (phase !== 'PUMPING') return;
    const id = setInterval(() => {
      setPumpT((t) => {
        const nt = t + 0.016;
        if (nt >= 1) {
          clearInterval(id);
          setPressure(setPressure_);
          setPhase('READY');
          return 1;
        }
        setPressure(Math.max(setPressure_, pumpCurve(nt)));
        return nt;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [phase, setPressure_]);

  // 식각
  useEffect(() => {
    if (phase !== 'PROCESSING') return;
    timer.current = setInterval(() => {
      setTickCount((c) => c + 1);
      setElapsed((e) => e + TICK_MS / 1000 * SIM_SPEED);

      const rate = calculateEtchRate(target, gasFlows, power, setPressure_);
      rateRef.current = rate;
      const dz = (rate / 60) * (TICK_MS / 1000) * SIM_SPEED; // nm/min → nm/tick

      setDepth((prev) => {
        const next = prev + dz;
        // OES: 막이 남아있는 동안 신호 유지, 뚫리면 급락
        const frac = clamp(next / FILM_NM, 0, 1);
        const sig = frac < 0.92
          ? 0.72 + Math.sin(next / 9) * 0.05
          : clamp(0.72 - (frac - 0.92) * 8, 0.06, 0.72);
        setOes((o) => [...o.slice(-118), sig]);

        if (next >= FILM_NM) {
          stop();
          setPhase('ENDPOINT');
          return FILM_NM;
        }
        return next;
      });
    }, TICK_MS);
    return stop;
  }, [phase, target, gasFlows, power, setPressure_, stop]);

  // 엔드포인트 → 벤팅 → 리포트
  useEffect(() => {
    if (phase !== 'ENDPOINT') return;
    const id = setTimeout(() => {
      const sel = calculateSelectivity(target, gasFlows, power, setPressure_);
      const uni = calculateUniformity(setPressure_, power, gasFlows);
      const iso = calculatePressureEffect(setPressure_);
      setResult({
        rate: rateRef.current,
        sel,
        uni,
        iso,
        time: elapsed,
        overEtch: (FILM_NM / Math.max(sel, 1)),
      });
      setPhase('VENTING');
    }, 1600);
    return () => clearTimeout(id);
  }, [phase, target, gasFlows, power, setPressure_, elapsed]);

  useEffect(() => {
    if (phase !== 'VENTING') return;
    const id = setInterval(() => {
      setPressure((p) => {
        const np = p * 2.6 + 60;
        if (np >= ATM_MTORR) { clearInterval(id); setPhase('REPORT'); return ATM_MTORR; }
        return np;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [phase]);

  /* ── 주 액션 (언제나 하나) ── */
  const primary = () => {
    if (phase === 'IDLE') { setPhase('LOADING'); return; }
    if (phase === 'READY' && canIgnite) {
      setDepth(0); setElapsed(0); setOes([]); setResult(null);
      setPhase('PROCESSING');
      return;
    }
    if (phase === 'PROCESSING') { stop(); setPhase('VENTING'); return; }
    if (phase === 'REPORT') {
      setPhase('IDLE'); setPressure(ATM_MTORR); setPumpT(0);
      setDepth(0); setElapsed(0); setOes([]); setResult(null);
    }
  };

  const primaryLabel = PHASES[phase].action;
  const primaryDisabled = phase === 'READY' && !canIgnite;

  /* ── 펌핑 중 이론 카드 ── */
  const note = useMemo(() => {
    let cur = PUMPDOWN_NOTES[0];
    PUMPDOWN_NOTES.forEach((n) => { if (pumpT >= n.at) cur = n; });
    return cur;
  }, [pumpT]);

  /* ── 리포트 해설 ── */
  const verdict = useMemo(() => {
    if (!result) return null;
    const lines = [];
    if (result.iso > 1.4) {
      lines.push({
        bad: true,
        t: '프로파일이 무너졌다',
        d: `압력 ${setPressure_} mTorr는 이온 산란이 커지는 영역이다. 측벽까지 깎여 언더컷이 생겼다. 80 mTorr 아래로 내리면 수직에 가까워진다.`,
      });
    } else {
      lines.push({
        bad: false,
        t: '프로파일이 수직에 가깝다',
        d: `압력 ${setPressure_} mTorr에서 이온이 직진해 바닥만 파였다. 측벽은 거의 손상되지 않았다.`,
      });
    }
    if (result.sel < 5) {
      lines.push({
        bad: true,
        t: `선택비 ${fmt(result.sel, 1)} : 1 — 낮다`,
        d: '하부층이 같이 깎인다. 막을 뚫는 순간 아래층이 손상된다. 폴리머 생성 가스(HBr/CHF₃)를 늘리거나 파워를 낮춰야 한다.',
      });
    } else {
      lines.push({
        bad: false,
        t: `선택비 ${fmt(result.sel, 1)} : 1 — 충분하다`,
        d: `막을 다 뚫은 뒤에도 하부층은 분당 ${fmt(result.rate / result.sel, 1)} nm 정도만 깎인다. 오버에치 여유가 있다.`,
      });
    }
    if (result.uni < 80) {
      lines.push({
        bad: true,
        t: `균일도 ${fmt(result.uni, 0)}% — 부족하다`,
        d: `총 가스 유량 ${activeGasTotal} sccm과 현재 압력·파워 조합에서 웨이퍼 가장자리와 중심의 식각량 차이가 커진다.`,
      });
    } else {
      lines.push({
        bad: false,
        t: `균일도 ${fmt(result.uni, 0)}% — 양호하다`,
        d: '웨이퍼 전면에서 식각량 편차가 작다. 압력과 파워가 균일도 sweet spot 근처에 있다.',
      });
    }
    return lines;
  }, [result, setPressure_, activeGasTotal]);

  const tgt = TARGETS.find((t) => t.id === target);
  const relevantGases = GASES.filter((g) => {
    if (target === 'Si') return ['Cl2', 'HBr', 'Ar'].includes(g.id);
    if (target === 'SiO2') return ['CF4', 'CHF3', 'Ar'].includes(g.id);
    if (target === 'Si3N4') return ['CHF3', 'CF4', 'O2'].includes(g.id);
    return ['O2', 'Ar'].includes(g.id);
  });

  /* ────────────────────────── 렌더 ────────────────────────── */

  return (
    <div className="eb-root">
      <style>{EB_CSS}</style>

      {/* 상단 : 장비 헤더 + 인터락 */}
      <header className="eb-top">
        <div className="eb-id">
          <span className="eb-id-name">RIE-2400</span>
          <span className="eb-id-sub">Reactive Ion Etcher · Bay 3</span>
        </div>

        <div className="eb-status" data-phase={phase}>
          <span className="eb-status-dot" />
          {PHASES[phase].label}
        </div>

        <div className="eb-lamps">
          <Lamp on={interlocks.wafer} label="WAFER" />
          <Lamp on={interlocks.door} label="DOOR" />
          <Lamp on={interlocks.vacuum} label="VACUUM" warn={!interlocks.vacuum && phase === 'PUMPING'} />
          <Lamp on={interlocks.gas} label="GAS" />
        </div>
      </header>

      {/* 시퀀스 스텝퍼 */}
      <div className="eb-steps">
        {STEP_NAMES.map((s, i) => (
          <div
            key={s}
            className={`eb-step ${i === PHASES[phase].step ? 'is-now' : ''} ${
              i < PHASES[phase].step ? 'is-done' : ''
            }`}
          >
            <span className="eb-step-bar" />
            <span className="eb-step-txt">{s}</span>
          </div>
        ))}
      </div>

      <main className="eb-main">
        {/* 좌 : 챔버 */}
        <section className="eb-view">
          <ChamberView
            phase={phase}
            pressure={pressure}
            power={power}
            depth={depth}
            isotropy={preview.iso}
            target={target}
            glowSeed={tickCount}
          />

          <div className="eb-gauges">
            <div className="eb-gauge">
              <span className="eb-g-k">Pressure</span>
              <span className="eb-g-v">
                {pressure >= 1000 ? (pressure / 1000).toFixed(1) + 'k' : fmt(pressure, 0)}
                <small>mTorr</small>
              </span>
            </div>
            <div className="eb-gauge">
              <span className="eb-g-k">RF Power</span>
              <span className="eb-g-v">
                {phase === 'PROCESSING' || phase === 'ENDPOINT' ? power : 0}
                <small>W</small>
              </span>
            </div>
            <div className="eb-gauge">
              <span className="eb-g-k">Depth</span>
              <span className="eb-g-v">{fmt(depth, 0)}<small>nm</small></span>
            </div>
            <div className="eb-gauge">
              <span className="eb-g-k">Elapsed</span>
              <span className="eb-g-v">{fmt(elapsed, 0)}<small>s</small></span>
            </div>
          </div>

          {(phase === 'PROCESSING' || phase === 'ENDPOINT' || phase === 'VENTING') && (
            <OesTrace samples={oes} detected={phase !== 'PROCESSING'} />
          )}
        </section>

        {/* 우 : 상태별 단일 패널 */}
        <section className="eb-panel">
          {phase === 'IDLE' && (
            <div className="eb-blank">
              <p className="eb-blank-h">챔버가 비어 있습니다</p>
              <p className="eb-blank-b">
                웨이퍼를 로드하면 도어가 닫히고 펌핑이 시작됩니다.
                레시피는 진공에 도달한 뒤에 설정할 수 있습니다.
              </p>
            </div>
          )}

          {phase === 'LOADING' && (
            <div className="eb-blank">
              <p className="eb-blank-h">로봇 암 동작 중</p>
              <p className="eb-blank-b">로드락 → 트랜스퍼 챔버 → 척.</p>
            </div>
          )}

          {phase === 'PUMPING' && (
            <div className="eb-pump">
              <div className="eb-pump-head">
                <span>목표 진공까지</span>
                <span className="eb-pump-pct">{Math.round(pumpT * 100)}%</span>
              </div>
              <div className="eb-pump-track">
                <div className="eb-pump-fill" style={{ width: `${pumpT * 100}%` }} />
              </div>

              {/* 원본의 '이론' 탭 — 실제로 기다리는 이 구간에 배치 */}
              <article className="eb-note">
                <p className="eb-note-k">펌핑 대기 · 알아둘 것</p>
                <h4>{note.head}</h4>
                <p>{note.body}</p>
              </article>
            </div>
          )}

          {phase === 'READY' && (
            <div className="eb-recipe">
              <p className="eb-panel-k">레시피 설정</p>

              <div className="eb-targets">
                {TARGETS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`eb-target ${target === t.id ? 'is-on' : ''}`}
                    onClick={() => setTarget(t.id)}
                  >
                    <span className="eb-target-l">{t.label}</span>
                    <span className="eb-target-d">{t.desc}</span>
                  </button>
                ))}
              </div>

              <Knob
                label="Chamber Pressure" unit="mTorr" value={setPressure_}
                min={10} max={300} step={5}
                onChange={(v) => { setSetPressure(v); setPressure(v); }}
                hint="낮으면 이온이 직진해 프로파일이 수직해진다. 80 mTorr 부근이 식각률 sweet spot이고, 그보다 높으면 가스상 재결합으로 오히려 느려진다."
              />
              <Knob
                label="RF Power" unit="W" value={power}
                min={0} max={800} step={25}
                onChange={setPower}
                hint="이온 에너지를 올려 식각률을 높인다. 다만 500 W를 넘으면 물리 충격이 우세해져 선택비가 깎이고, 600 W 위에서는 식각률도 포화된다."
              />

              <p className="eb-sub-k">가스 유량 · {tgt.label} 식각</p>
              {relevantGases.map((g) => (
                <Knob
                  key={g.id}
                  label={g.label} unit="sccm" value={gasFlows[g.id]}
                  min={0} max={g.max} step={5}
                  onChange={(v) => setGasFlows((f) => ({ ...f, [g.id]: v }))}
                  hint={g.role}
                />
              ))}

              <div className="eb-preview">
                <p className="eb-panel-k">예상 결과</p>
                <div className="eb-preview-grid">
                  <div><span>식각률</span><b>{fmt(preview.rate, 0)} nm/min</b></div>
                  <div><span>선택비</span><b>{fmt(preview.sel, 1)} : 1</b></div>
                  <div><span>균일도</span><b>{fmt(preview.uni, 0)} %</b></div>
                  <div><span>프로파일</span><b>{preview.iso > 1.4 ? '등방성 경향' : '이방성'}</b></div>
                </div>
                {preview.rate <= 0 && (
                  <p className="eb-alarm">
                    식각률 0 — 반응 가스나 RF 파워가 없습니다. 플라즈마를 점화할 수 없습니다.
                  </p>
                )}
              </div>
            </div>
          )}

          {(phase === 'PROCESSING' || phase === 'ENDPOINT') && (
            <div className="eb-run">
              <p className="eb-panel-k">실시간 계측</p>

              <div className="eb-run-big">
                <span>{fmt((depth / FILM_NM) * 100, 0)}<small>%</small></span>
                <span className="eb-run-sub">
                  {fmt(depth, 0)} / {FILM_NM} nm
                </span>
              </div>
              <div className="eb-pump-track">
                <div className="eb-pump-fill" style={{ width: `${(depth / FILM_NM) * 100}%` }} />
              </div>

              <div className="eb-run-grid">
                <div><span>식각률</span><b>{fmt(rateRef.current, 0)} nm/min</b></div>
                <div><span>선택비</span><b>{fmt(preview.sel, 1)} : 1</b></div>
                <div><span>균일도</span><b>{fmt(preview.uni, 0)} %</b></div>
                <div><span>이방성</span><b>{preview.iso > 1.4 ? '저하' : '양호'}</b></div>
              </div>

              {phase === 'ENDPOINT' && (
                <p className="eb-endpoint">
                  OES 신호 급락 — 막이 뚫렸습니다. 하부층 노출.
                </p>
              )}

              <p className="eb-run-note">
                레시피는 런 중에 잠깁니다. 실제 장비와 같습니다 — 조건을 바꾸려면
                런을 끝내고 다시 설정해야 합니다.
              </p>
            </div>
          )}

          {phase === 'VENTING' && (
            <div className="eb-blank">
              <p className="eb-blank-h">벤팅 중</p>
              <p className="eb-blank-b">챔버를 대기압으로 되돌리고 웨이퍼를 꺼냅니다.</p>
            </div>
          )}

          {phase === 'REPORT' && result && (
            <div className="eb-report">
              <p className="eb-panel-k">런 리포트</p>

              <div className="eb-report-grid">
                <div><span>식각률</span><b>{fmt(result.rate, 0)}<small>nm/min</small></b></div>
                <div><span>소요 시간</span><b>{fmt(result.time, 0)}<small>s</small></b></div>
                <div><span>선택비</span><b>{fmt(result.sel, 1)}<small>: 1</small></b></div>
                <div><span>균일도</span><b>{fmt(result.uni, 0)}<small>%</small></b></div>
              </div>

              {/* 원본의 '평가' 탭 — 퀴즈 대신 이번 런에 대한 해설 */}
              <p className="eb-sub-k">왜 이렇게 나왔나</p>
              {verdict.map((v, i) => (
                <div key={i} className={`eb-verdict ${v.bad ? 'is-bad' : 'is-ok'}`}>
                  <h5>{v.t}</h5>
                  <p>{v.d}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 하단 : 주 액션 하나 */}
      <footer className="eb-foot">
        <div className="eb-foot-info">
          {phase === 'READY' && !canIgnite && (
            <span className="eb-foot-warn">
              인터락 미충족 — {!interlocks.gas ? '가스 유량이 0입니다' :
                             !interlocks.vacuum ? '목표 진공에 도달하지 않았습니다' :
                             preview.rate <= 0 ? '현재 레시피의 식각률이 0입니다' :
                             'RF 파워가 0입니다'}
            </span>
          )}
          {phase === 'READY' && canIgnite && (
            <span className="eb-foot-ok">인터락 전부 충족 · 점화 가능</span>
          )}
          {!primaryLabel && <span className="eb-foot-dim">장비 동작 중 — 대기하세요</span>}
        </div>

        {primaryLabel && (
          <button
            type="button"
            className={`eb-primary ${phase === 'PROCESSING' ? 'is-abort' : ''}`}
            onClick={primary}
            disabled={primaryDisabled}
          >
            {primaryLabel}
          </button>
        )}
      </footer>
    </div>
  );
}

/* ────────────────────────── 스타일 ────────────────────────── */
/* 이 화면은 장비실 조명을 전제로 한 단일 테마다 (샘플북 D · 옐로우 룸).
   전역 Tailwind 와 섞이지 않도록 eb- 접두사로 스코프를 닫아둔다. */

const EB_CSS = `
.eb-root{
  --bg:#141210; --panel:#1C1A15; --panel2:#232019; --line:#332F27;
  --amber:#F0C464; --amber-dim:#C99A3E;
  --txt:#E4DAC2; --txt-dim:#948A73; --ok:#6FBF8E; --bad:#E06C5A;
  /* App.js 의 메인 영역이 flex-col 이라 flex:1 로 늘린다.
     absolute inset:0 을 쓰면 모바일 상단 헤더(pt-12) 밑으로 파고든다. */
  flex:1; min-height:0;
  display:flex; flex-direction:column;
  background:var(--bg); color:var(--txt);
  font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI","Malgun Gothic",sans-serif;
  overflow:hidden; word-break:keep-all;
}
.eb-root *{box-sizing:border-box;}
.eb-root .mono,.eb-g-v,.eb-knob-val,.eb-run-big span{
  font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace; font-variant-numeric:tabular-nums;
}

/* 헤더 */
.eb-top{
  display:flex; align-items:center; gap:20px; flex-wrap:wrap;
  padding:12px 20px; border-bottom:1px solid var(--line); background:var(--panel);
}
.eb-id{display:flex; flex-direction:column; line-height:1.25;}
.eb-id-name{font-family:ui-monospace,Menlo,monospace; font-size:15px; font-weight:700; letter-spacing:.06em; color:var(--amber);}
.eb-id-sub{font-size:11px; color:var(--txt-dim); letter-spacing:.05em;}
.eb-status{
  display:inline-flex; align-items:center; gap:8px;
  font-size:12px; font-weight:700; letter-spacing:.12em;
  padding:5px 12px; border-radius:3px; border:1px solid var(--line); background:var(--panel2);
}
.eb-status-dot{width:7px;height:7px;border-radius:50%;background:var(--txt-dim);}
.eb-status[data-phase="PROCESSING"]{border-color:var(--amber); color:var(--amber);}
.eb-status[data-phase="PROCESSING"] .eb-status-dot{background:var(--amber); box-shadow:0 0 8px var(--amber); animation:eb-blink 1.1s infinite;}
.eb-status[data-phase="ENDPOINT"]{border-color:var(--bad); color:var(--bad);}
.eb-status[data-phase="ENDPOINT"] .eb-status-dot{background:var(--bad); box-shadow:0 0 8px var(--bad);}
.eb-status[data-phase="READY"]{border-color:var(--ok); color:var(--ok);}
.eb-status[data-phase="READY"] .eb-status-dot{background:var(--ok); box-shadow:0 0 8px var(--ok);}
@keyframes eb-blink{50%{opacity:.35;}}

.eb-lamps{display:flex; gap:14px; margin-left:auto; flex-wrap:wrap;}
.eb-lamp{display:flex; align-items:center; gap:6px;}
.eb-lamp-dot{width:8px;height:8px;border-radius:50%;flex:0 0 auto;}
.eb-lamp-txt{font-family:ui-monospace,Menlo,monospace; font-size:10px; letter-spacing:.1em;}

/* 스텝퍼 */
.eb-steps{display:flex; gap:3px; padding:10px 20px; background:var(--panel); border-bottom:1px solid var(--line);}
.eb-step{flex:1; min-width:0;}
.eb-step-bar{display:block; height:3px; border-radius:2px; background:#2A261F;}
.eb-step.is-done .eb-step-bar{background:var(--amber-dim);}
.eb-step.is-now .eb-step-bar{background:var(--amber); box-shadow:0 0 8px rgba(240,196,100,.5);}
.eb-step-txt{display:block; margin-top:5px; font-size:10px; letter-spacing:.04em; color:#5F594B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.eb-step.is-now .eb-step-txt{color:var(--amber);}
.eb-step.is-done .eb-step-txt{color:var(--txt-dim);}

/* 본문 */
.eb-main{flex:1; min-height:0; display:grid; grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);}
@media (max-width:900px){.eb-main{grid-template-columns:1fr; overflow-y:auto;}}

.eb-view{padding:20px; border-right:1px solid var(--line); display:flex; flex-direction:column; gap:14px; min-height:0; overflow-y:auto;}
.eb-chamber{width:100%; height:auto; max-height:44vh; display:block;}

.eb-gauges{display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line); border:1px solid var(--line);}
.eb-gauge{background:var(--panel); padding:9px 11px; display:flex; flex-direction:column; gap:3px; min-width:0;}
.eb-g-k{font-size:9.5px; letter-spacing:.13em; text-transform:uppercase; color:var(--txt-dim);}
.eb-g-v{font-size:17px; color:var(--amber); text-shadow:0 0 12px rgba(240,196,100,.3); white-space:nowrap;}
.eb-g-v small{font-size:10px; color:var(--txt-dim); margin-left:3px; text-shadow:none;}

.eb-oes{border:1px solid var(--line); background:var(--panel); padding:8px 10px;}
.eb-oes svg{width:100%; height:auto; display:block;}
.eb-oes-cap{display:block; margin-top:5px; font-family:ui-monospace,Menlo,monospace; font-size:9.5px; letter-spacing:.08em; color:var(--txt-dim);}
.eb-oes--idle{color:var(--txt-dim); font-family:ui-monospace,Menlo,monospace; font-size:10px; padding:16px 10px; text-align:center;}

/* 우측 패널 */
.eb-panel{padding:20px; overflow-y:auto; min-height:0; display:flex; flex-direction:column; gap:14px;}
.eb-panel-k{margin:0; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--txt-dim); font-weight:600;}
.eb-sub-k{margin:6px 0 0; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--amber-dim); font-weight:600;}

.eb-blank{margin:auto; text-align:center; max-width:34ch;}
.eb-blank-h{margin:0 0 8px; font-size:16px; font-weight:700; color:var(--txt);}
.eb-blank-b{margin:0; font-size:13.5px; line-height:1.7; color:var(--txt-dim);}

/* 펌핑 */
.eb-pump{display:flex; flex-direction:column; gap:12px;}
.eb-pump-head{display:flex; justify-content:space-between; align-items:baseline; font-size:12px; color:var(--txt-dim); letter-spacing:.05em;}
.eb-pump-pct{font-family:ui-monospace,Menlo,monospace; font-size:16px; color:var(--amber);}
.eb-pump-track{height:4px; background:#2A261F; border-radius:2px; overflow:hidden;}
.eb-pump-fill{height:100%; background:var(--amber); box-shadow:0 0 10px rgba(240,196,100,.55); transition:width .12s linear;}
.eb-note{border-left:2px solid var(--amber-dim); padding:2px 0 2px 14px; margin-top:10px;}
.eb-note-k{margin:0 0 8px; font-size:9.5px; letter-spacing:.15em; text-transform:uppercase; color:var(--amber-dim);}
.eb-note h4{margin:0 0 7px; font-size:15px; font-weight:700; color:var(--txt);}
.eb-note p{margin:0; font-size:13.5px; line-height:1.75; color:var(--txt-dim);}

/* 레시피 */
.eb-recipe{display:flex; flex-direction:column; gap:14px;}
.eb-targets{display:grid; grid-template-columns:repeat(2,1fr); gap:6px;}
.eb-target{
  text-align:left; padding:9px 11px; background:var(--panel); border:1px solid var(--line);
  border-radius:3px; cursor:pointer; color:var(--txt-dim); transition:border-color .12s, color .12s;
}
.eb-target:hover{border-color:var(--amber-dim);}
.eb-target.is-on{border-color:var(--amber); color:var(--amber); background:var(--panel2);}
.eb-target-l{display:block; font-family:ui-monospace,Menlo,monospace; font-size:13px; font-weight:700;}
.eb-target-d{display:block; font-size:10.5px; margin-top:2px; color:var(--txt-dim);}

.eb-knob-row{display:flex; gap:13px; align-items:flex-start;}
.eb-knob-row.is-off{opacity:.4;}
.eb-knob{
  width:42px; height:42px; border-radius:50%; flex:0 0 auto; position:relative; margin-top:3px;
  background:
    conic-gradient(from 225deg, var(--amber) 0deg, var(--amber) var(--sweep,0deg),
                   #2E2A23 var(--sweep,0deg), #2E2A23 270deg, transparent 270deg),
    radial-gradient(circle, #383226 0 62%, transparent 63%);
  box-shadow:inset 0 0 0 1px #423B2E;
}
.eb-knob-cap{
  position:absolute; inset:7px; border-radius:50%;
  background:linear-gradient(160deg,#4C4536,#26221A); box-shadow:0 2px 5px rgba(0,0,0,.6);
}
.eb-knob-main{flex:1; min-width:0;}
.eb-knob-head{display:flex; justify-content:space-between; align-items:baseline; gap:8px; margin-bottom:6px;}
.eb-knob-label{font-size:11.5px; letter-spacing:.06em; color:var(--txt-dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.eb-knob-val{font-size:15px; color:var(--amber); white-space:nowrap;}
.eb-knob-val small{font-size:10px; color:var(--txt-dim); margin-left:3px;}

.eb-root input[type=range]{-webkit-appearance:none; appearance:none; width:100%; background:transparent; display:block; margin:0;}
.eb-root input[type=range]:focus{outline:none;}
.eb-root input[type=range]::-webkit-slider-runnable-track{height:3px; background:#332E25; border-radius:2px;}
.eb-root input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none; width:14px; height:24px; border-radius:2px; margin-top:-10px; cursor:ns-resize;
  background:linear-gradient(180deg,#6A6250,#332E25); border:1px solid #7E7560;
}
.eb-root input[type=range]::-moz-range-track{height:3px; background:#332E25; border-radius:2px;}
.eb-root input[type=range]::-moz-range-thumb{
  width:14px; height:24px; border-radius:2px; cursor:ns-resize;
  background:linear-gradient(180deg,#6A6250,#332E25); border:1px solid #7E7560;
}
.eb-root input[type=range]:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 3px rgba(240,196,100,.45);}
.eb-root input[type=range]:focus-visible::-moz-range-thumb{box-shadow:0 0 0 3px rgba(240,196,100,.45);}

.eb-why{
  margin-top:7px; background:none; border:none; padding:0; cursor:pointer;
  font-size:10.5px; letter-spacing:.05em; color:var(--amber-dim); text-decoration:underline; text-underline-offset:2px;
}
.eb-why:hover{color:var(--amber);}
.eb-hint{margin:7px 0 0; font-size:12.5px; line-height:1.7; color:var(--txt-dim); border-left:1px solid var(--line); padding-left:10px;}

.eb-preview{border:1px solid var(--line); background:var(--panel); padding:13px; display:flex; flex-direction:column; gap:10px;}
.eb-preview-grid,.eb-run-grid,.eb-report-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
.eb-preview-grid div,.eb-run-grid div,.eb-report-grid div{display:flex; flex-direction:column; gap:2px; min-width:0;}
.eb-preview-grid span,.eb-run-grid span,.eb-report-grid span{font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--txt-dim);}
.eb-preview-grid b,.eb-run-grid b,.eb-report-grid b{
  font-family:ui-monospace,Menlo,monospace; font-variant-numeric:tabular-nums;
  font-size:15px; color:var(--amber); font-weight:600; white-space:nowrap;
}
.eb-report-grid b small{font-size:10px; color:var(--txt-dim); margin-left:3px; font-weight:400;}
.eb-alarm{margin:0; font-size:12px; color:var(--bad); line-height:1.6;}

/* 런 */
.eb-run{display:flex; flex-direction:column; gap:13px;}
.eb-run-big{display:flex; align-items:baseline; gap:11px;}
.eb-run-big > span:first-child{font-size:40px; color:var(--amber); line-height:1; text-shadow:0 0 20px rgba(240,196,100,.3);}
.eb-run-big > span:first-child small{font-size:17px; color:var(--txt-dim); margin-left:2px;}
.eb-run-sub{font-family:ui-monospace,Menlo,monospace; font-size:12px; color:var(--txt-dim);}
.eb-endpoint{margin:0; padding:10px 12px; border:1px solid var(--bad); color:var(--bad); font-size:12.5px; background:rgba(224,108,90,.08);}
.eb-run-note{margin:0; font-size:12px; line-height:1.7; color:#6B6353; border-top:1px solid var(--line); padding-top:11px;}

/* 리포트 */
.eb-report{display:flex; flex-direction:column; gap:13px;}
.eb-verdict{border-left:2px solid var(--line); padding:2px 0 2px 12px;}
.eb-verdict.is-ok{border-left-color:var(--ok);}
.eb-verdict.is-bad{border-left-color:var(--bad);}
.eb-verdict h5{margin:0 0 5px; font-size:13.5px; font-weight:700; color:var(--txt);}
.eb-verdict p{margin:0; font-size:12.5px; line-height:1.7; color:var(--txt-dim);}

/* 하단 */
.eb-foot{
  display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  padding:12px 20px; border-top:1px solid var(--line); background:var(--panel);
}
/* App.js 가 우하단에 ModelAccuracyBadge 를 fixed 로 띄운다 (데스크톱 전용).
   주 액션 버튼이 그 아래 깔려 클릭이 막히므로 오른쪽에 자리를 비워 둔다. */
@media (min-width:768px){ .eb-foot{ padding-right:210px; } }
.eb-foot-info{flex:1; min-width:180px; font-size:12px;}
.eb-foot-warn{color:var(--bad);}
.eb-foot-ok{color:var(--ok);}
.eb-foot-dim{color:#5F594B;}
.eb-primary{
  padding:12px 34px; border-radius:3px; cursor:pointer;
  font-size:13.5px; font-weight:700; letter-spacing:.08em;
  background:var(--amber); color:#1A1610; border:1px solid var(--amber);
  transition:filter .12s;
}
.eb-primary:hover:not(:disabled){filter:brightness(1.12);}
.eb-primary:disabled{background:#2E2A23; border-color:var(--line); color:#5F594B; cursor:not-allowed;}
.eb-primary.is-abort{background:transparent; color:var(--bad); border-color:var(--bad);}
.eb-primary:focus-visible{outline:2px solid var(--amber); outline-offset:2px;}

@media (prefers-reduced-motion:reduce){
  .eb-root *{animation:none !important; transition:none !important;}
}
`;
