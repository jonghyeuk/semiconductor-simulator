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
  calculateProfile,
  calculateArdeFactor,
  simulateEtchRun,
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

/* 조작 범위는 전부 원본 EtchingSimulator.js 와 같다.
   압력 30~200 mTorr / RF 100~800 W / 가스 0~100 sccm.
   (원본의 10~300 은 압력이 아니라 시간(sec) 슬라이더 범위다.) */
const P_MIN = 30,  P_MAX = 200,  P_STEP = 10;   // mTorr — CCP RIE 상용 운전 구간
const W_MIN = 100, W_MAX = 800,  W_STEP = 50;   // W
const G_MAX = 100, G_STEP = 5;                  // sccm

/* 예전 이 화면은 시간을 아예 받지 않고 막을 뚫으면 무조건 멈췄다 — 언더에치도
   오버에치도 만들 수 없었고, "시간을 정하면 깊이가 나온다" 는 식각의 기본을 보여줄
   수가 없었다.
   범위는 원본 슬라이더(10~300 s)보다 넓게 잡았다. 이 화면은 500 nm 막을 끝까지
   뚫는 것이 기본 시나리오인데, 대표 레시피의 관통 시간이 이미 285 초라 300 초가
   상한이면 오버에치를 만들 여지가 거의 없다. */
const T_MIN = 10,  T_MAX = 600,  T_STEP = 10;   // s
/* 패턴 폭(CD). 종횡비가 깊이/폭이므로 CD 없이는 ARDE 를 말할 수 없다. */
const CD_MIN = 100, CD_MAX = 1000, CD_STEP = 50; // nm

const GASES = [
  { id: 'Cl2',  label: 'Cl₂',  role: 'Si 주 식각종. 늘리면 식각률이 오르지만 선택비가 깎인다.' },
  { id: 'HBr',  label: 'HBr',  role: '측벽 passivation. 이방성과 선택비를 올리지만 30 sccm을 넘으면 식각률을 되레 눌러버린다.' },
  { id: 'CF4',  label: 'CF₄',  role: '산화막 주 식각종. F 라디칼이 많아지면 선택비가 떨어진다.' },
  { id: 'CHF3', label: 'CHF₃', role: '폴리머 생성. 하부층을 덮어 선택비를 올리지만 과하면 etch stop.' },
  { id: 'O2',   label: 'O₂',   role: 'PR 애싱. 폴리머를 태워 없앤다.' },
  { id: 'Ar',   label: 'Ar',   role: '물리 스퍼터. 이방성엔 도움, 선택비엔 손해.' },
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

/** 막을 관통하는 데 걸리는 시간(s). ARDE 때문에 깊이의 함수라 해석해가 없어
    충분히 긴 시간을 돌려 보고 관통 시각을 읽는다. 못 뚫으면 null. */
function estimatePunchTime(pv) {
  const run = simulateEtchRun({
    rate: pv.rate, seconds: 36000, filmThickness: FILM_NM, trenchWidth: pv.trench,
    anisotropy: pv.prof.anisotropy, selectivity: pv.sel, dt: 2,
  });
  return run.punchThroughTime;
}

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

/* 단면 좌표계.
   막 두께 FILM_NM 이 FILM_PX 픽셀이므로 나노미터당 배율이 하나로 정해진다.
   패턴 폭(CD)도 **같은 배율**로 그린다. 예전에는 개구부가 64 px 로 고정이라
   화면에서 잰 종횡비와 계산에 쓰는 종횡비가 서로 달랐다. */
const VIEW_W = 320, VIEW_H = 210;
const TRENCH_TOP = 78;          // 막 상면 y
const FILM_PX = 62;             // 막 두께
const SUB_PX = 44;              // 그릴 수 있는 하부층 두께
const MASK_PX = 15;             // 마스크 두께
const CX = VIEW_W / 2;
const PX_PER_NM = FILM_PX / FILM_NM;

/**
 * 측벽의 반폭(px). u = 0 (막 상면) ~ 1 (식각 바닥).
 *
 * 측벽은 직선이 아니다. 위쪽일수록 오래 노출돼 옆으로 더 깎이고(U), 깊어질수록
 * 폴리머가 쌓여 좁아지며(T), 시스 안에서 산란된 이온이 중간을 부풀린다(B).
 * 세 항의 합이 실제 단면에서 보는 활 모양·테이퍼·보잉을 만든다.
 */
function halfWidthAt(u, half, U, T, B) {
  return Math.max(0.6, half + U * (1 - u) - T * u + B * Math.sin(Math.PI * u));
}

/** 캐비티 외곽선. 바닥 모서리는 등방 성분만큼 둥글게 깎인다. */
function cavityPath(half, d, U, T, B, cr) {
  if (d <= 0.4) return '';
  const hb = halfWidthAt(1, half, U, T, B);
  const r = Math.max(0, Math.min(cr, d * 0.5, hb * 0.9));
  const uEnd = 1 - r / d;
  const N = 16;
  const yb = TRENCH_TOP + d;
  const xs = [];
  for (let i = 0; i <= N; i++) {
    const u = (uEnd * i) / N;
    xs.push([halfWidthAt(u, half, U, T, B), TRENCH_TOP + u * d]);
  }
  const seg = xs.map(([w, y], i) => `${i === 0 ? 'M' : 'L'}${(CX - w).toFixed(2)} ${y.toFixed(2)}`);
  // 모서리 곡선은 측벽 폴리라인이 **끝난 그 점**으로 돌아와야 한다. 가상의 뾰족한
  // 모서리(hb)를 끝점으로 쓰면 폴리라인 시작점과 어긋나 한쪽 벽에만 단차가 생긴다.
  const [wEnd, yEnd] = xs[N];
  seg.push(`Q${(CX - hb).toFixed(2)} ${yb.toFixed(2)} ${(CX - hb + r).toFixed(2)} ${yb.toFixed(2)}`);
  seg.push(`L${(CX + hb - r).toFixed(2)} ${yb.toFixed(2)}`);
  seg.push(`Q${(CX + hb).toFixed(2)} ${yb.toFixed(2)} ${(CX + wEnd).toFixed(2)} ${yEnd.toFixed(2)}`);
  for (let i = N; i >= 0; i--) {
    const [w, y] = xs[i];
    seg.push(`L${(CX + w).toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${seg.join(' ')} Z`;
}

/** 마스크 한 쪽. 스퍼터 손상이 있으면 개구부 쪽 위 모서리가 45°로 깎인다 (파세팅). */
function maskPath(side, half, facet) {
  const top = TRENCH_TOP - MASK_PX;
  const inner = CX + side * half;
  const outer = side < 0 ? 34 : VIEW_W - 34;
  const f = Math.max(0, Math.min(facet, MASK_PX * 0.8));
  return [
    `M${outer} ${top}`,
    `L${inner - side * f} ${top}`,
    `L${inner} ${top + f}`,
    `L${inner} ${TRENCH_TOP}`,
    `L${outer} ${TRENCH_TOP}`,
    'Z',
  ].join(' ');
}

const PROFILE_LABEL = {
  vertical: '수직 (이방성)',
  tapered: '테이퍼',
  undercut: '언더컷',
  isotropic: '등방성',
  'etch-stop': 'Etch Stop',
};

const PRODUCTS = {
  Si: 'SiCl₄↑',
  SiO2: 'SiF₄↑',
  Si3N4: 'SiF₄↑',
  PR: 'CO₂↑',
};

function ChamberView({
  phase, pressure, power, filmEtched, underlayerLoss, cd, profile, target, glowSeed,
}) {
  const plasmaOn = phase === 'PROCESSING' || phase === 'ENDPOINT';
  const glow = plasmaOn ? clamp(0.25 + power / 900, 0.25, 0.95) : 0;

  const blanket = target === 'PR';                  // 애싱은 마스크 없이 전면이 깎인다
  const half = blanket ? (VIEW_W - 68) / 2 : clamp((cd * PX_PER_NM) / 2, 4, 110);
  const dFilm = clamp(filmEtched * PX_PER_NM, 0, FILM_PX);
  const dUnder = clamp(underlayerLoss * PX_PER_NM, 0, SUB_PX - 4);
  const depth = filmEtched + underlayerLoss;

  /* 형상 인자를 픽셀로 환산한다. 전면 식각(애싱)에는 측벽이 없으므로 전부 0 이다. */
  const U = blanket ? 0 : profile.lateralRatio * dFilm;
  const T = blanket ? 0 : profile.taperRatio * dFilm;
  const B = blanket ? 0 : profile.bowRatio * dFilm;
  const cr = blanket ? 0 : profile.lateralRatio * dFilm * 0.6;

  const cavity = cavityPath(half, dFilm, U, T, B, cr);
  const hBottom = halfWidthAt(1, half, U, T, B);

  /* 오버에치 — 막을 뚫은 뒤 하부층이 선택비만큼 느리게 깎인다.
     마스크도 폴리머도 하부층 표면에는 도움이 안 되므로 옆으로 더 퍼진다. */
  const overPath = dUnder > 0.3
    ? cavityPath(hBottom, dUnder + FILM_PX - dFilm, 0, 0, 0, Math.min(dUnder, hBottom) * 0.8)
    : '';

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

  /* 이온 궤적.
     RIE 에서 이온은 플라즈마와 웨이퍼 사이 시스(sheath)의 전위차로 가속된다.
     전기장이 웨이퍼 면에 수직이므로 이온도 수직으로 내리꽂힌다 — 이 수직성이
     이방성 식각의 원인이다. 한 점에서 부챗살로 퍼지게 그리면 기구를 잘못 가르친다.

     궤적은 실제로 부딪히는 면에서 멈춘다. 마스크 위면 마스크에서, 개구부 안이면
     그 x 에서 측벽이 만나는 깊이에서. 테이퍼가 심하면 이온이 바닥에 닿기 전에
     측벽에 먼저 부딪히는데, 그것이 바로 고종횡비에서 식각이 멈추는 이유다. */
  const ionTracks = useMemo(() => {
    if (!plasmaOn) return [];
    const maxTilt = profile.lateralRatio * 3.4;   // 산란이 많을수록 입사각이 흐트러진다
    const yTop = 42;
    const out = [];
    for (let i = 0; i < 13; i++) {
      const x = 44 + i * 19;
      const off = Math.abs(x - CX);
      const j = (((i * 9301 + 49297) % 233280) / 233280) - 0.5;
      const blocked = !blanket && off > half;
      let yEnd;
      if (blocked) {
        yEnd = TRENCH_TOP - MASK_PX;
      } else if (dFilm <= 0.4) {
        yEnd = TRENCH_TOP;
      } else {
        // 이 x 에서 측벽과 처음 만나는 깊이를 찾는다 (없으면 바닥까지).
        let u = 1;
        for (let k = 1; k <= 12; k++) {
          const uu = k / 12;
          if (halfWidthAt(uu, half, U, T, B) < off) { u = uu; break; }
        }
        yEnd = TRENCH_TOP + u * dFilm + (u >= 1 ? dUnder : 0);
      }
      out.push({
        x,
        y1: yTop,
        x2: x + j * 2 * maxTilt * ((yEnd - yTop) / 70),
        y2: yEnd,
        blocked,
      });
    }
    return out;
  }, [plasmaOn, profile.lateralRatio, blanket, half, dFilm, dUnder, U, T, B]);

  /* 라디칼.
     측벽이 깎이는 건 이온이 옆으로 날아가서가 아니라, 방향성이 없는 중성 라디칼이
     화학 반응을 일으키기 때문이다. 이방성이 낮을수록 이쪽 비중이 커지고 언더컷이
     생긴다. 그래서 개수를 압력이 아니라 lateralRatio 에 비례시킨다 — 압력만 보던
     예전 코드는 HBr 을 아무리 넣어도 라디칼이 그대로였다. */
  const radicals = useMemo(() => {
    if (!plasmaOn || dFilm <= 1) return [];
    const n = Math.round(profile.lateralRatio * 16);
    const out = [];
    for (let i = 0; i < n; i++) {
      const s = ((i * 7717 + 3121 + glowSeed * 131) % 233280) / 233280;
      const s2 = ((i * 4363 + 9871 + glowSeed * 197) % 233280) / 233280;
      const where = i % 3;
      const u = 0.08 + s2 * 0.9;
      if (blanket || where === 2) {
        out.push({ x: CX + (s - 0.5) * 2 * hBottom * 0.9, y: TRENCH_TOP + dFilm - 1.4, r: 1.1 });
      } else {
        const w = halfWidthAt(u, half, U, T, B);
        const side = where === 0 ? -1 : 1;
        out.push({ x: CX + side * (w - 1.2 - s * 1.6), y: TRENCH_TOP + u * dFilm, r: 1.1 });
      }
    }
    return out;
  }, [plasmaOn, profile.lateralRatio, blanket, dFilm, half, hBottom, U, T, B, glowSeed]);

  /* 휘발성 생성물. 식각은 "깎아내는" 게 아니라 표면에서 기체를 만들어 뽑아내는
     것이다. 생성물이 휘발하지 않으면(예: Cu 할로겐화물) 건식 식각 자체가 안 된다. */
  const productY = TRENCH_TOP - 6 - (glowSeed % 10) * 1.6;

  const t = TARGETS.find((x) => x.id === target) || TARGETS[0];
  // 파세팅은 식각이 시작된 뒤의 결과다. 레시피 화면에서 마스크가 미리 깎여 보이면 안 된다.
  const facet = profile.maskDamage && dFilm > 0.5 ? 5 : 0;
  const polyW = plasmaOn || dFilm > 1 ? Math.min(2.6, profile.polymerThickness * 0.6) : 0;

  /* 측벽 폴리머 띠 — 왜 HBr/CHF₃ 가 프로파일을 세우는지 눈에 보여야 한다. */
  const polyLine = (side) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      const w = halfWidthAt(u, half, U, T, B) - polyW / 2;
      pts.push(`${(CX + side * w).toFixed(2)},${(TRENCH_TOP + u * dFilm).toFixed(2)}`);
    }
    return pts.join(' ');
  };

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="eb-chamber" role="img"
         aria-label={`챔버 단면. ${t.label} 식각 깊이 ${Math.round(depth)} 나노미터, 프로파일 ${PROFILE_LABEL[profile.profileType]}`}>
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
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} />
        </clipPath>
      </defs>

      <g clipPath="url(#eb-clip)">
        {/* 챔버 벽 */}
        <rect x="18" y="8" width={VIEW_W - 36} height={VIEW_H - 30} rx="6"
              fill="#191710" stroke="#3B362C" strokeWidth="1" />

        {/* 플라즈마 */}
        {plasmaOn && (
          <rect x="19" y="9" width={VIEW_W - 38} height="66" fill="url(#eb-plasma)" />
        )}
        {parts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#F5D082" opacity="0.75" />
        ))}

        {/* 하부층 (기판) */}
        <rect x="34" y={TRENCH_TOP + FILM_PX} width={VIEW_W - 68} height={SUB_PX} fill="url(#eb-si)" />

        {/* 식각 대상 막 */}
        <rect x="34" y={TRENCH_TOP} width={VIEW_W - 68} height={FILM_PX}
              fill={target === 'PR' ? '#7A5A9E' : target === 'Si' ? '#8A8F9E' : '#6E8FA8'}
              stroke="#2A2620" strokeWidth="1" />

        {/* 오버에치로 파인 하부층 — 막을 뚫은 뒤에도 시간이 남으면 여기가 깎인다 */}
        {overPath && <path d={overPath} fill="#141209" stroke="#E06C5A" strokeWidth="0.7" />}

        {/* 캐비티 (식각으로 없어진 부분) */}
        {cavity && <path d={cavity} fill="#141209" stroke="#2A2620" strokeWidth="0.6" />}

        {/* 측벽 폴리머 (passivation) */}
        {polyW > 0.4 && dFilm > 2 && !blanket && (
          <g opacity="0.8">
            <polyline points={polyLine(-1)} fill="none" stroke="#E2B45C" strokeWidth={polyW} strokeLinecap="round" />
            <polyline points={polyLine(1)} fill="none" stroke="#E2B45C" strokeWidth={polyW} strokeLinecap="round" />
          </g>
        )}

        {/* 이온 (수직 · 물리) */}
        {ionTracks.map((k, i) => (
          <line
            key={`ion${i}`}
            x1={k.x} y1={k.y1} x2={k.x2} y2={k.y2}
            stroke="#F0C464"
            strokeWidth="0.8"
            opacity={k.blocked ? 0.3 : 0.6}
          />
        ))}
        {ionTracks.filter((k) => !k.blocked).map((k, i) => (
          <path
            key={`tip${i}`}
            d={`M${k.x2} ${k.y2} l-1.6 -3 h3.2 z`}
            fill="#F0C464"
            opacity="0.7"
          />
        ))}

        {/* 라디칼 (등방 · 화학) */}
        {radicals.map((r, i) => (
          <circle key={`rad${i}`} cx={r.x} cy={r.y} r={r.r} fill="#7FC8A9" opacity="0.7" />
        ))}

        {/* 휘발성 생성물이 빠져나간다 */}
        {plasmaOn && dFilm > 1 && (
          <text x={CX} y={productY} fontSize="7" fill="#9FD8C0" textAnchor="middle"
                opacity={0.85 - (glowSeed % 10) * 0.06}
                fontFamily="ui-monospace, Menlo, monospace">
            {PRODUCTS[target]}
          </text>
        )}

        {/* 마스크 (PR) — 스퍼터 손상 시 위 모서리가 깎인다 */}
        {!blanket && (
          <>
            <path d={maskPath(-1, half, facet)} fill="#B98A4E" />
            <path d={maskPath(1, half, facet)} fill="#B98A4E" />
            {facet > 0 && (
              <text x={VIEW_W - 34} y={TRENCH_TOP - 20} fontSize="6.5" fill="#E08A6E" textAnchor="end"
                    fontFamily="ui-monospace, Menlo, monospace">
                마스크 파세팅 (정성)
              </text>
            )}
          </>
        )}

        {/* 웨이퍼 척 */}
        <rect x="26" y={TRENCH_TOP + FILM_PX + SUB_PX} width={VIEW_W - 52} height="9" fill="#2E2A22" />

        {/* 깊이 눈금 */}
        <line x1={VIEW_W - 44} y1={TRENCH_TOP} x2={VIEW_W - 44} y2={TRENCH_TOP + FILM_PX}
              stroke="#4A443A" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1={VIEW_W - 48} y1={TRENCH_TOP + dFilm + dUnder} x2={VIEW_W - 40} y2={TRENCH_TOP + dFilm + dUnder}
              stroke="#F0C464" strokeWidth="1.2" />
        <text x={VIEW_W - 52} y={TRENCH_TOP + dFilm + dUnder + 3.5} fontSize="8" fill="#F0C464"
              textAnchor="end" fontFamily="ui-monospace, Menlo, monospace">
          {Math.round(depth)}nm
        </text>

        {/* 잔막 / 하부층 손실 */}
        {dFilm < FILM_PX - 0.5 && filmEtched > 0 && (
          <text x="38" y={TRENCH_TOP + FILM_PX - 16} fontSize="7" fill="#F0C464"
                fontFamily="ui-monospace, Menlo, monospace">
            잔막 {Math.round(FILM_NM - filmEtched)}nm
          </text>
        )}
        {underlayerLoss > 0.5 && (
          <text x={CX} y={TRENCH_TOP + FILM_PX + dUnder + 9} fontSize="7" fill="#E06C5A" textAnchor="middle"
                fontFamily="ui-monospace, Menlo, monospace">
            하부층 −{Math.round(underlayerLoss)}nm
          </text>
        )}

        {/* 라벨 */}
        {!blanket && (
          <text x="38" y={TRENCH_TOP - 20} fontSize="7.5" fill="#8A8069"
                fontFamily="ui-monospace, Menlo, monospace">MASK</text>
        )}
        <text x="38" y={TRENCH_TOP + FILM_PX - 5} fontSize="7.5" fill="#C9BFA5"
              fontFamily="ui-monospace, Menlo, monospace">{t.label}</text>
        <text x="38" y={TRENCH_TOP + FILM_PX + 16} fontSize="7.5" fill="#9AA0AE"
              fontFamily="ui-monospace, Menlo, monospace">{t.under}</text>

        {/* 압력 · 프로파일 판정 */}
        <text x={VIEW_W - 34} y="24" fontSize="8" fill="#8A8069" textAnchor="end"
              fontFamily="ui-monospace, Menlo, monospace">
          {pressure >= 1000 ? `${(pressure / 1000).toFixed(0)}k` : fmt(pressure, 0)} mTorr
        </text>
        <text x={VIEW_W - 34} y="36" fontSize="7.5" textAnchor="end"
              fill={profile.profileType === 'vertical' ? '#7FC8A9' : profile.profileType === 'etch-stop' ? '#E06C5A' : '#E0A24A'}
              fontFamily="ui-monospace, Menlo, monospace">
          {PROFILE_LABEL[profile.profileType]} · 측벽 {profile.sidewallAngle.toFixed(0)}°
        </text>
        {!blanket && (
          <text x={VIEW_W - 34} y="47" fontSize="7" fill="#8A8069" textAnchor="end"
                fontFamily="ui-monospace, Menlo, monospace">
            CD {cd}nm · AR {(depth / cd).toFixed(1)}
          </text>
        )}

        {/* 범례 — 이온과 라디칼은 다른 종이고 하는 일도 다르다 */}
        {plasmaOn && (
          <g fontFamily="ui-monospace, Menlo, monospace" fontSize="7">
            <line x1="26" y1="18" x2="26" y2="26" stroke="#F0C464" strokeWidth="0.9" />
            <path d="M26 26 l-1.4 -2.6 h2.8 z" fill="#F0C464" />
            <text x="32" y="25" fill="#9A9078">이온 · 수직 · 물리</text>
            <circle cx="26" cy="37" r="1.4" fill="#7FC8A9" />
            <text x="32" y="40" fill="#9A9078">라디칼 · 등방 · 화학</text>
            {polyW > 0.4 && !blanket && (
              <>
                <line x1="23" y1="50" x2="29" y2="50" stroke="#E2B45C" strokeWidth="2" strokeLinecap="round" />
                <text x="32" y="52" fill="#9A9078">측벽 폴리머</text>
              </>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}

/* ────────────────────── 원자 스케일 인셋 ──────────────────────
   챔버 단면은 500 nm 스케일이라 "왜" 가 안 보인다. 프로파일이 왜 그 모양인지는
   1000 배 아래에서 결정된다.

   바닥과 측벽은 **같은 표면인데 도달하는 종이 다르다.**
     바닥 — 시스 전기장에 가속된 이온이 수직으로 쏟아진다. 라디칼도 온다.
            염소화된 결합을 이온이 때려 SiCl₄ 로 날린다 (시너지).
     측벽 — 이온은 수직으로 내려가므로 거의 닿지 않는다. 방향성 없는 라디칼만
            도달하고, 폴리머가 있으면 그마저 막힌다.
   그래서 측벽이 바닥보다 느리게 깎이고, 그 비가 곧 이방도다.
     이방도 A = 1 − (수평 식각률 / 수직 식각률)

   ⚠ 이 인셋은 **설명용 그림**이다. 여기서 따로 식각률을 재지 않는다. 재서 숫자를
     내놓으면 화면에 진실이 둘이 되고, 언젠가 서로 어긋난다. 숫자는 프로파일을
     그리는 그 A 하나에서만 나온다. 직접 세어 보는 화면은 「식각 기초」 카드다. */

function SurfaceInset({ profile, filmEtched, glowSeed }) {
  const W = 320, H = 104;
  const midX = W / 2;

  /* 결정적 유사난수 — 프레임마다 점이 튀지 않게 한다.
     선형합동식(i*9301+…)%233280 은 i 를 1 씩 올리면 결과도 일정하게 움직여서,
     점 대여섯 개를 찍으면 가지런한 대각선으로 늘어선다. 흩뿌린 것처럼 보이려면
     비선형 해시가 필요하다. */
  const rnd = (i, salt) => {
    const v = Math.sin(i * 12.9898 + salt * 78.233 + glowSeed * 0.37) * 43758.5453;
    return v - Math.floor(v);
  };

  const polymer = profile.polymerThickness > 0.5;
  const lateralNm = profile.lateralRatio * filmEtched;

  // 바닥: 이온이 쏟아진다. 측벽: 이온이 스쳐 지나간다.
  const bottomIons = [0, 1, 2, 3].map((i) => 22 + i * 26);
  const sideRadicals = [0, 1, 2, 3, 4, 5].map((i) => ({
    x: 182 + rnd(i, 7) * 88,
    y: 30 + rnd(i, 13) * 52,
  }));
  const bottomRadicals = [0, 1, 2, 3, 4].map((i) => ({
    x: 18 + rnd(i, 3) * 116,
    y: 26 + rnd(i, 11) * 40,
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="eb-inset" role="img"
         aria-label={`원자 스케일 설명. 바닥에는 이온과 라디칼이 모두 도달하고 측벽에는 라디칼만 도달한다. 이방도 ${profile.anisotropy.toFixed(2)}`}>
      <rect x="0" y="0" width={W} height={H} fill="#141209" />
      <line x1={midX} y1="6" x2={midX} y2={H - 6} stroke="#2A261C" strokeWidth="1" />

      {/* ── 왼쪽: 트렌치 바닥 ── */}
      <text x="12" y="15" fontSize="7" fill="#F0C464"
            fontFamily="ui-monospace, Menlo, monospace">바닥 · 이온 + 라디칼</text>

      {bottomIons.map((x, i) => (
        <g key={`bi${i}`}>
          <line x1={x} y1="22" x2={x} y2="68" stroke="#F0C464" strokeWidth="0.9" opacity="0.6" />
          <path d={`M${x} 70.5 l-1.6 -3.4 h3.2 z`} fill="#F0C464" opacity="0.85" />
        </g>
      ))}
      {bottomRadicals.map((r, i) => (
        <circle key={`br${i}`} cx={r.x} cy={r.y} r="1.5" fill="#7FC8A9" opacity="0.75" />
      ))}
      {/* 바닥 원자열 — 염소화돼 초록빛이 돈다 */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const cx = 16 + i * 22;
        return (
          <g key={`ba${i}`}>
            <circle cx={cx} cy="76" r="5.4" fill="#6E9E88" />
            {/* 흡착한 Cl 은 껍질로 그린다. 점을 위에 얹으면 이 크기에서는
                눈·귀처럼 보여 원자가 아니라 얼굴로 읽힌다. */}
            <circle cx={cx} cy="76" r="7.4" fill="none" stroke="#7FC8A9"
                    strokeWidth="1.3" opacity="0.85" />
          </g>
        );
      })}
      <text x={16 + 2.2 * 22} y="60" fontSize="6.5" fill="#9FD8C0" textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace">SiCl₄↑</text>
      <text x="12" y="97" fontSize="6.5" fill="#8A8069"
            fontFamily="ui-monospace, Menlo, monospace">빠르다 — 결합이 약해진 자리를 이온이 때린다</text>

      {/* ── 오른쪽: 측벽 ── */}
      <text x={midX + 12} y="15" fontSize="7" fill="#7FC8A9"
            fontFamily="ui-monospace, Menlo, monospace">측벽 · 라디칼만</text>

      {/* 이온은 측벽을 스쳐 내려간다 — 수직 입사라 벽에 닿지 않는다 */}
      <line x1={midX + 26} y1="22" x2={midX + 26} y2="84" stroke="#F0C464"
            strokeWidth="0.9" opacity="0.35" strokeDasharray="2 2" />
      <path d={`M${midX + 26} 86 l-1.6 -3.4 h3.2 z`} fill="#F0C464" opacity="0.35" />
      <text x={midX + 32} y="30" fontSize="6" fill="#8A8069"
            fontFamily="ui-monospace, Menlo, monospace">이온은 지나친다</text>

      {/* 측벽 원자기둥 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={`sa${i}`} cx={midX + 14} cy={26 + i * 13} r="5.4"
                fill={polymer ? '#7FA394' : '#8FA39C'} />
      ))}
      {polymer && (
        <line x1={midX + 20.5} y1="22" x2={midX + 20.5} y2="82"
              stroke="#E2B45C" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      )}
      {/* 라디칼은 방향이 제멋대로라 벽에도 닿는다. 짧은 꼬리를 달아
          "옆에서 들어온다" 는 것이 보이게 한다. */}
      {sideRadicals.map((r, i) => (
        <g key={`sr${i}`}>
          <line x1={r.x + 7} y1={r.y + (i % 2 ? 3 : -3)} x2={r.x} y2={r.y}
                stroke="#7FC8A9" strokeWidth="0.7" opacity="0.35" />
          <circle cx={r.x} cy={r.y} r="1.5" fill="#7FC8A9" opacity="0.8" />
        </g>
      ))}
      <text x={midX + 12} y="97" fontSize="6.5" fill="#8A8069"
            fontFamily="ui-monospace, Menlo, monospace">
        {polymer ? '느리다 — 폴리머가 라디칼마저 막는다' : '느리다 — 때려 줄 이온이 없다'}
      </text>
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
  // 초기 레시피도 원본과 동일하게 둔다.
  const [setPressure_, setSetPressure] = useState(100);
  const [power, setPower] = useState(300);
  const [gasFlows, setGasFlows] = useState({
    Cl2: 30, HBr: 15, CF4: 0, CHF3: 0, O2: 0, Ar: 90,
  });
  // 기본 시간은 대표 레시피의 관통 시간(285 s)에 15% 오버에치를 더한 값이다.
  const [etchTime, setEtchTime] = useState(330);  // s — 설정 시간이 깊이를 정한다
  const [cd, setCd] = useState(500);               // nm — 패턴 폭

  // 런 상태
  // 런 상태 — 막을 깎은 양과 하부층을 깎은 양은 다른 값이다. 하나로 묶으면
  // 오버에치를 표시할 수 없다.
  const [filmEtched, setFilmEtched] = useState(0);
  const [underlayerLoss, setUnderlayerLoss] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [punched, setPunched] = useState(false);
  const [oes, setOes] = useState([]);
  const [result, setResult] = useState(null);
  const [tickCount, setTickCount] = useState(0);

  const timer = useRef(null);
  const rateRef = useRef(0);
  // 리포트에 쓸 식각률은 마지막 틱의 난수 표본이 아니라 런 전체 평균이어야 한다.
  // 예전에는 한 틱 값을 그대로 실었고, 학습자가 깊이/시간으로 검산하면 최대 10%
  // 어긋났다.
  // 진행 상태 원본. 화면 state 는 이걸 비추기만 한다.
  const runRef = useRef({ film: 0, under: 0, t: 0, punched: false, punchAt: null, rateSum: 0, rateN: 0 });

  /* ── 파생값 ── */
  const depth = filmEtched + underlayerLoss;

  const activeGasTotal = useMemo(
    () => Object.values(gasFlows).reduce((a, b) => a + b, 0),
    [gasFlows]
  );

  const preview = useMemo(() => {
    // 미리보기는 난수 없이 (rng = 0.5 고정) 계산해야 슬라이더가 흔들리지 않는다.
    const rng = () => 0.5;
    const rate = calculateEtchRate(target, gasFlows, power, setPressure_, rng);
    const sel = calculateSelectivity(target, gasFlows, power, setPressure_, rng);
    const prof = calculateProfile(target, gasFlows, power, setPressure_);
    // 애싱은 전면 식각이라 종횡비가 없다 — ARDE 를 걸면 안 된다.
    const trench = target === 'PR' ? Infinity : cd;
    // 예상 결과는 실행 루프와 **같은 모델**로 뽑는다. 따로 계산하면 언젠가 갈라진다.
    const run = simulateEtchRun({
      rate, seconds: etchTime, filmThickness: FILM_NM, trenchWidth: trench,
      anisotropy: prof.anisotropy, selectivity: sel,
    });
    return {
      rate, sel, prof, run, trench,
      uni: calculateUniformity(setPressure_, power, gasFlows),
      // 가스 조건에 더해 식각률이 사실상 0 인 경우도 etch stop 으로 본다 (원본과 같은 규칙).
      etchStop: prof.etchStop || rate < 15,
    };
  }, [target, gasFlows, power, setPressure_, etchTime, cd]);

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

  /* 식각.
     한 틱은 SIM_SPEED 초에 해당한다. 매 틱마다
       1) 지금 깊이에서의 종횡비로 ARDE 감속을 먹인 식각률을 구하고
       2) 막이 남았으면 막을, 다 뚫었으면 하부층을 선택비만큼 느리게 깎고
       3) 설정 시간이 다 되면 멈춘다.
     예전에는 식각률이 시간에 대해 상수였고 막을 뚫는 순간 무조건 끝났다.
     그래서 깊이-시간이 직선이었고 오버에치·언더에치가 존재하지 않았다.

     진행 상태는 ref 한 곳에 모아 두고 틱마다 화면 state 로 한 번만 밀어 넣는다.
     setState 갱신 함수 안에서 다른 state 를 건드리면 StrictMode 의 이중 호출에서
     같은 틱이 두 번 적분된다. */
  useEffect(() => {
    if (phase !== 'PROCESSING') return;
    timer.current = setInterval(() => {
      const dtSec = (TICK_MS / 1000) * SIM_SPEED;
      const r = runRef.current;

      // 산포가 붙은 식각률 (화면 계측값). ARDE 감속은 지금 깊이에서 건다.
      const rate0 = calculateEtchRate(target, gasFlows, power, setPressure_);
      const depth = r.film + r.under;
      const ar = preview.trench === Infinity ? 0 : depth / preview.trench;
      const rate = rate0 * calculateArdeFactor(ar, preview.prof.anisotropy);
      const perSec = rate / 60;

      r.rateSum += rate;
      r.rateN += 1;
      r.t = Math.min(r.t + dtSec, etchTime);

      if (r.film < FILM_NM) {
        const need = FILM_NM - r.film;
        const canDo = perSec * dtSec;
        if (canDo < need) {
          r.film += canDo;
        } else {
          // 이 틱 안에서 막을 뚫는다. 남은 시간은 하부층 쪽으로 넘긴다 —
          // 틱 경계에서 시간이 새면 오버에치가 과소평가된다.
          const left = dtSec - need / perSec;
          r.film = FILM_NM;
          r.under += (perSec / Math.max(1, preview.sel)) * left;
          if (!r.punched) { r.punched = true; r.punchAt = r.t; }
        }
      } else {
        r.under += (perSec / Math.max(1, preview.sel)) * dtSec;
      }

      // OES: 막이 남아있는 동안 신호 유지, 뚫리면 급락
      const frac = clamp(r.film / FILM_NM, 0, 1);
      const sig = frac < 0.92
        ? 0.72 + Math.sin(r.film / 9) * 0.05
        : clamp(0.72 - (frac - 0.92) * 8, 0.06, 0.72);

      rateRef.current = rate;
      setTickCount((c) => c + 1);
      setElapsed(r.t);
      setFilmEtched(r.film);
      setUnderlayerLoss(r.under);
      setPunched(r.punched);
      setOes((o) => [...o.slice(-118), sig]);

      if (r.t >= etchTime) {
        stop();
        setPhase('ENDPOINT');
      }
    }, TICK_MS);
    return stop;
  }, [phase, target, gasFlows, power, setPressure_, etchTime, preview, stop]);

  // 엔드포인트 → 벤팅 → 리포트
  useEffect(() => {
    if (phase !== 'ENDPOINT') return;
    const id = setTimeout(() => {
      const r = runRef.current;
      setResult({
        // 런 전체 평균. 마지막 틱 표본을 실으면 깊이/시간 검산과 어긋난다.
        rate: r.rateN > 0 ? r.rateSum / r.rateN : 0,
        sel: preview.sel,
        uni: preview.uni,
        prof: preview.prof,
        time: r.t,
        filmEtched: r.film,
        remainingFilm: Math.max(0, FILM_NM - r.film),
        underlayerLoss: r.under,
        punchThroughTime: r.punchAt,
        cd: preview.trench === Infinity ? null : cd,
      });
      setPhase('VENTING');
    }, 1600);
    return () => clearTimeout(id);
  }, [phase, preview, cd]);

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

  const resetRun = useCallback(() => {
    runRef.current = { film: 0, under: 0, t: 0, punched: false, punchAt: null, rateSum: 0, rateN: 0 };
    rateRef.current = 0;
    setFilmEtched(0); setUnderlayerLoss(0); setElapsed(0);
    setPunched(false); setOes([]); setResult(null);
  }, []);

  /* ── 주 액션 (언제나 하나) ── */
  const primary = () => {
    if (phase === 'IDLE') { setPhase('LOADING'); return; }
    if (phase === 'READY' && canIgnite) {
      resetRun();
      setPhase('PROCESSING');
      return;
    }
    // 긴급 정지도 하나의 런이다. 여기까지 판 결과를 리포트로 넘긴다.
    if (phase === 'PROCESSING') { stop(); setPhase('ENDPOINT'); return; }
    if (phase === 'REPORT') {
      setPhase('IDLE'); setPressure(ATM_MTORR); setPumpT(0);
      resetRun();
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
    const prof = result.prof;
    const lateral = prof.lateralRatio * result.filmEtched;   // 마스크 아래 언더컷 (nm)

    // 시간을 정하면 깊이가 나온다. 그 결과부터 말한다.
    if (result.remainingFilm > 0.5) {
      lines.push({
        bad: true,
        t: `언더에치 — 막이 ${fmt(result.remainingFilm, 0)} nm 남았다`,
        d: `${fmt(result.time, 0)}초로는 ${FILM_NM} nm 를 다 뚫지 못했다. 시간을 늘리거나 식각률을 올려야 한다. 남은 막은 다음 공정에서 그대로 문제가 된다.`,
      });
    } else {
      const over = result.time - (result.punchThroughTime || result.time);
      lines.push({
        bad: result.underlayerLoss > 30,
        t: `관통 ${fmt(result.punchThroughTime, 0)}초 · 오버에치 ${fmt(over, 0)}초`,
        d: `막을 뚫은 뒤 ${fmt(over, 0)}초 동안 하부층이 ${fmt(result.underlayerLoss, 0)} nm 깎였다. 선택비 ${fmt(result.sel, 1)}:1 이 이 손실을 결정했다. ${
          result.underlayerLoss > 30
            ? '하부층 손실이 크다 — 오버에치를 줄이거나 선택비를 올려야 한다.'
            : '균일도 편차를 덮으려면 이 정도 오버에치는 필요하다.'
        }`,
      });
    }

    if (prof.profileType === 'vertical') {
      lines.push({
        bad: false,
        t: `프로파일 수직 · 측벽 ${fmt(prof.sidewallAngle, 0)}° · 이방도 ${fmt(prof.anisotropy, 2)}`,
        d: `이온이 직진해 바닥만 파였다. 마스크 아래 측면 손실은 ${fmt(lateral, 0)} nm 수준이다.`,
      });
    } else if (prof.profileType === 'undercut' || prof.profileType === 'isotropic') {
      lines.push({
        bad: true,
        t: `프로파일 ${PROFILE_LABEL[prof.profileType]} · 측벽 ${fmt(prof.sidewallAngle, 0)}° · 이방도 ${fmt(prof.anisotropy, 2)}`,
        d: `방향성 없는 라디칼이 측벽을 먹어 마스크 아래가 ${fmt(lateral, 0)} nm 파였다. 패턴 폭이 그만큼 벌어졌다는 뜻이다. 압력을 낮추거나(이온 산란↓) HBr·CHF₃ 로 측벽을 덮으면 줄어든다.`,
      });
    } else if (prof.profileType === 'tapered') {
      lines.push({
        bad: false,
        t: `프로파일 테이퍼 · 측벽 ${fmt(prof.sidewallAngle, 0)}° · 이방도 ${fmt(prof.anisotropy, 2)}`,
        d: '측벽 폴리머가 진행 중인 식각면을 조금씩 좁혀 아래로 갈수록 가늘어졌다. 콘택홀에서는 바닥 CD 가 작아지므로 저항이 올라간다.',
      });
    } else {
      lines.push({
        bad: true,
        t: 'Etch stop',
        d: '폴리머 생성이 식각종을 압도해 식각이 사실상 멈췄다. CHF₃/HBr 을 줄이거나 CF₄/Cl₂ 를 늘려야 한다.',
      });
    }

    if (result.cd) {
      const ardeEnd = calculateArdeFactor(
        (result.filmEtched + result.underlayerLoss) / result.cd, prof.anisotropy
      );
      lines.push({
        bad: ardeEnd < 0.7,
        t: `ARDE — 종료 시점 식각률이 초기의 ${fmt(ardeEnd * 100, 0)}%`,
        d: `CD ${result.cd} nm 에서 종횡비가 ${fmt((result.filmEtched + result.underlayerLoss) / result.cd, 1)} 까지 올라갔다. 방향성 없는 라디칼이 바닥에 닿기 어려워져 깊어질수록 느려진다. 같은 웨이퍼에 넓은 패턴과 좁은 패턴이 함께 있으면 깊이가 달라진다.`,
      });
    }

    if (prof.maskDamage) {
      lines.push({
        bad: true,
        t: '마스크 스퍼터 손상',
        d: `Ar ${gasFlows.Ar} sccm · RF ${power} W 조건에서 마스크 위 모서리가 깎인다(파세팅). 마스크가 물러나면 패턴 폭이 벌어진다. ※ 침식 속도는 모델에 없고 표시는 정성적이다.`,
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
  }, [result, activeGasTotal, gasFlows.Ar, power]);

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
          <span className="eb-id-sub">Capacitively Coupled (CCP) · Single RF · Bay 3</span>
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
            filmEtched={filmEtched}
            underlayerLoss={underlayerLoss}
            cd={cd}
            profile={preview.prof}
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

          {/* 프로파일이 왜 그 모양인지는 1000 배 아래에서 정해진다.
              바닥과 측벽에 도달하는 종이 다르다는 것 하나가 이방도를 만든다. */}
          {(phase === 'PROCESSING' || phase === 'ENDPOINT' || phase === 'REPORT') && target !== 'PR' && (
            <div className="eb-inset-wrap">
              <div className="eb-inset-head">
                <span>원자 스케일 · 왜 측벽은 덜 깎이나</span>
                {/* space-between 이 띄우므로 margin-left:auto 는 쓰지 않는다 */}
                <span className="eb-inset-a">
                  이방도 A {fmt(preview.prof.anisotropy, 2)} · 측면 손실 {fmt(preview.prof.lateralRatio * filmEtched, 0)} nm
                </span>
              </div>
              <SurfaceInset
                profile={preview.prof}
                filmEtched={filmEtched}
                glowSeed={tickCount}
              />
              <p className="eb-inset-note">
                A = 1 − (수평 식각률 / 수직 식각률). 위 단면에서 마스크 아래가 파인 폭이
                (1 − A) × 깊이인 이유가 이것이다. 직접 세어 보려면 「식각 기초」 카드로.
              </p>
            </div>
          )}

          {(phase === 'PROCESSING' || phase === 'ENDPOINT' || phase === 'VENTING') && (
            <OesTrace samples={oes} detected={punched} />
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
                min={P_MIN} max={P_MAX} step={P_STEP}
                onChange={(v) => { setSetPressure(v); setPressure(v); }}
                hint="낮으면 시스에서 이온이 덜 충돌해 더 수직으로 내리꽂히고, 프로파일이 수직해진다. 80 mTorr 부근이 식각률 sweet spot이고 그보다 높으면 가스상 재결합으로 오히려 느려진다. 30 mTorr 를 하한으로 둔 것은 방전 한계가 아니라 모델의 유효 범위 때문이다 — 그 아래는 계산식이 평평해져 압력을 더 내려도 달라지는 게 없다."
              />
              <Knob
                label="RF Power" unit="W" value={power}
                min={W_MIN} max={W_MAX} step={W_STEP}
                onChange={setPower}
                hint="시스 전압을 올려 이온 에너지를 키운다. 다만 500 W를 넘으면 물리 충격이 우세해져 선택비가 깎이고, 600 W 위에서는 식각률도 포화된다. CCP 는 RF 하나로 플라즈마 밀도와 이온 에너지가 같이 움직인다 — 둘을 따로 돌리려면 ICP 처럼 Source/Bias 를 분리한 장비가 필요하다."
              />

              <Knob
                label="Etch Time" unit="s" value={etchTime}
                min={T_MIN} max={T_MAX} step={T_STEP}
                onChange={setEtchTime}
                hint="식각은 깊이를 지정하는 공정이 아니라 시간을 지정하는 공정이다. 깊이는 식각률 × 시간의 결과다. 시간이 모자라면 막이 남고(언더에치), 남으면 하부층이 깎인다(오버에치). 실제로는 막을 뚫자마자 멈추지 않고 웨이퍼 전면이 확실히 뚫리도록 10~30% 를 더 준다 — 그 여유를 감당하는 게 선택비다."
              />
              {target !== 'PR' && (
                <Knob
                  label="Pattern CD" unit="nm" value={cd}
                  min={CD_MIN} max={CD_MAX} step={CD_STEP}
                  onChange={setCd}
                  hint="패턴이 좁을수록 종횡비(깊이/폭)가 커지고, 방향성 없는 라디칼이 바닥까지 들어가기 어려워져 식각이 느려진다 — ARDE(RIE lag). 같은 레시피·같은 시간이라도 좁은 패턴이 얕게 파이는 이유다. 이온은 수직으로 가속돼 들어가므로 영향이 훨씬 작다."
                />
              )}

              <p className="eb-sub-k">가스 유량 · {tgt.label} 식각</p>
              {relevantGases.map((g) => (
                <Knob
                  key={g.id}
                  label={g.label} unit="sccm" value={gasFlows[g.id]}
                  min={0} max={G_MAX} step={G_STEP}
                  onChange={(v) => setGasFlows((f) => ({ ...f, [g.id]: v }))}
                  hint={g.role}
                />
              ))}

              <div className="eb-preview">
                <p className="eb-panel-k">예상 결과 · {etchTime}초 후</p>
                <div className="eb-preview-grid">
                  <div><span>식각률</span><b>{fmt(preview.rate, 0)} nm/min</b></div>
                  <div><span>선택비</span><b>{fmt(preview.sel, 1)} : 1</b></div>
                  <div><span>균일도</span><b>{fmt(preview.uni, 0)} %</b></div>
                  <div><span>프로파일</span><b>{PROFILE_LABEL[preview.etchStop ? 'etch-stop' : preview.prof.profileType]}</b></div>
                  <div><span>예상 깊이</span><b>{fmt(preview.run.depth, 0)} nm</b></div>
                  <div>
                    <span>{preview.run.remainingFilm > 0 ? '잔막' : '하부층 손실'}</span>
                    <b>
                      {preview.run.remainingFilm > 0
                        ? `${fmt(preview.run.remainingFilm, 0)} nm`
                        : `−${fmt(preview.run.underlayerLoss, 0)} nm`}
                    </b>
                  </div>
                </div>

                {/* 시간을 정하면 깊이가 나온다 — 그 결과가 세 갈래 중 어디인지 먼저 알려준다. */}
                {preview.run.remainingFilm > 0 ? (
                  <p className="eb-alarm">
                    언더에치 — {etchTime}초로는 막을 못 뚫습니다. {fmt(preview.run.remainingFilm, 0)} nm 가 남습니다.
                    관통에 필요한 시간은 약 {fmt(estimatePunchTime(preview), 0)}초입니다.
                  </p>
                ) : (
                  <p className="eb-note-line">
                    {fmt(preview.run.punchThroughTime, 0)}초에 관통 →
                    남은 {fmt(etchTime - preview.run.punchThroughTime, 0)}초 동안 하부층이
                    {' '}{fmt(preview.run.underlayerLoss, 0)} nm 깎입니다 (오버에치
                    {' '}{fmt(((etchTime - preview.run.punchThroughTime) / Math.max(1, preview.run.punchThroughTime)) * 100, 0)}%).
                  </p>
                )}

                {target !== 'PR' && (
                  <p className="eb-note-line">
                    ARDE — 관통 시점 종횡비 {fmt(FILM_NM / cd, 1)} 에서 식각률이 초기의
                    {' '}{fmt(calculateArdeFactor(FILM_NM / cd, preview.prof.anisotropy) * 100, 0)}% 로 떨어집니다.
                  </p>
                )}

                {preview.etchStop && preview.rate > 0 && (
                  <p className="eb-alarm">
                    Etch stop 영역 — 폴리머 생성이 식각종을 압도합니다. 식각이 사실상 멈춥니다.
                  </p>
                )}
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

              {/* 진행률은 막 기준이다. 관통 뒤에는 남은 시간이 곧 오버에치다. */}
              <div className="eb-run-big">
                <span>{fmt((elapsed / etchTime) * 100, 0)}<small>%</small></span>
                <span className="eb-run-sub">
                  {fmt(elapsed, 0)} / {etchTime} s · 깊이 {fmt(depth, 0)} nm
                </span>
              </div>
              <div className="eb-pump-track">
                <div className="eb-pump-fill" style={{ width: `${clamp((elapsed / etchTime) * 100, 0, 100)}%` }} />
              </div>

              <div className="eb-run-grid">
                <div><span>식각률</span><b>{fmt(rateRef.current, 0)} nm/min</b></div>
                <div><span>선택비</span><b>{fmt(preview.sel, 1)} : 1</b></div>
                <div><span>{punched ? '하부층 손실' : '잔막'}</span>
                  <b>{punched ? `−${fmt(underlayerLoss, 0)} nm` : `${fmt(FILM_NM - filmEtched, 0)} nm`}</b></div>
                <div><span>종횡비</span>
                  <b>{target === 'PR' ? '—' : fmt(depth / cd, 2)}</b></div>
              </div>

              {punched ? (
                <p className="eb-endpoint">
                  OES 신호 급락 — 막이 뚫렸습니다. 지금부터는 하부층이 깎입니다.
                </p>
              ) : (
                <p className="eb-run-note">
                  ARDE 로 식각률이 초기 {fmt(preview.rate, 0)} nm/min 에서
                  {' '}{fmt(rateRef.current, 0)} nm/min 로 떨어져 있습니다.
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
                <div><span>평균 식각률</span><b>{fmt(result.rate, 0)}<small>nm/min</small></b></div>
                <div><span>소요 시간</span><b>{fmt(result.time, 0)}<small>s</small></b></div>
                <div><span>총 깊이</span><b>{fmt(result.filmEtched + result.underlayerLoss, 0)}<small>nm</small></b></div>
                <div><span>선택비</span><b>{fmt(result.sel, 1)}<small>: 1</small></b></div>
                <div><span>균일도</span><b>{fmt(result.uni, 0)}<small>%</small></b></div>
                <div>
                  <span>{result.remainingFilm > 0.5 ? '잔막' : '하부층 손실'}</span>
                  <b>
                    {result.remainingFilm > 0.5
                      ? <>{fmt(result.remainingFilm, 0)}<small>nm</small></>
                      : <>−{fmt(result.underlayerLoss, 0)}<small>nm</small></>}
                  </b>
                </div>
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
                             preview.rate <= 0 ? '이 가스 조합으로는 식각이 일어나지 않습니다' :
                             '레시피를 확인하세요'}
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

.eb-inset-wrap{flex:0 0 auto; border:1px solid var(--line); background:var(--panel); border-radius:2px; overflow:hidden;}
.eb-inset-head{display:flex; flex-wrap:wrap; justify-content:space-between; align-items:baseline; gap:4px 14px; padding:7px 10px; border-bottom:1px solid var(--line); font-family:ui-monospace,Menlo,monospace; font-size:9.5px; letter-spacing:.06em; color:var(--txt-dim);}
.eb-inset-a{color:var(--txt); letter-spacing:0; white-space:nowrap;}
.eb-inset{display:block; width:100%; height:auto; aspect-ratio:320/104;}
.eb-inset-note{margin:0; padding:7px 10px 9px; border-top:1px solid var(--line); font-size:11px; line-height:1.65; color:var(--txt-dim);}
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
