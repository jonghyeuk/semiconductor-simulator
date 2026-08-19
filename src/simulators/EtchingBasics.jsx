/**
 * 식각 기초 — 이온·라디칼 시너지 관측창.
 *
 * 챔버 단면도(식각 베이)는 500 nm 스케일이다. 이 화면은 그 아래 1000 배 작은 곳에서
 * 실제로 벌어지는 일을 본다. Cl 라디칼이 Si 표면을 염소화하고, 수직으로 내리꽂힌
 * 이온이 그 약해진 결합을 때려 SiCl₄ 를 떼어낸다.
 *
 * 라디칼만 / 이온만 / 동시 세 모드를 각각 돌리면 왜 식각이 "화학 + 물리" 가 아니라
 * **화학 × 물리** 인지가 숫자로 나온다 — Coburn–Winters 실험(1979)의 재현이다.
 *
 * 반응 규칙과 확률은 src/physics/surfaceReaction.js 에 있다. 이 파일은 그리기만 한다.
 * 확률을 감으로 잡았다가 시너지가 1.0 배로 나온 적이 있어서, 문헌 상대비는
 * surfaceReaction.test.js 가 못박고 있다.
 *
 * ── 정확도 ──
 * 분자동역학이 아니라 확률 모사다. 한계는 physics 모듈 주석과 화면 하단에 적어 뒀다.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  REACTION,
  COBURN_WINTERS,
  speciesOf,
  createSurface,
  drawCount,
  adsorb,
  ionStrike,
  desorbSpontaneous,
  scrollIfSunk,
  chlorination,
  depthLayers,
} from '../physics/surfaceReaction';

/* ────────────────────────── 상수 ────────────────────────── */

/* 캔버스 비율. 16:9 로 두면 넓은 화면에서 캔버스 하나가 화면을 다 먹고
   모드 버튼·계기판이 스크롤 아래로 밀려난다. 조작부가 안 보이면 관측창이 아니다.
   기체 공간을 줄여 가로로 눕혔다. */
const VIEW_W = 960, VIEW_H = 400;
const A = 24;                                  // 원자 간격 (px)
const R = 7.2;                                 // 원자 반지름
const COLS = Math.floor(VIEW_W / A);           // 40 열
const SURF_Y = 176;                            // 초기 표면 y
const DEPTH = Math.floor((VIEW_H - SURF_Y) / A) - 1;
const NM_PER_LAYER = 0.15;                     // 격자 간격 ≈ Si 원자층 두께 규모
const SETTLE = 15;                             // 이 시간을 채워야 그 모드의 값을 인정한다 (s)

const MODE_INFO = {
  radical: { key: 'MODE A', name: '라디칼만', sub: '화학', label: '라디칼만 (화학)' },
  ion:     { key: 'MODE B', name: '이온만',   sub: '물리', label: '이온만 (물리)' },
  both:    { key: 'MODE C', name: '동시',     sub: '화학 × 물리', label: '라디칼 + 이온 동시' },
};
const MODE_LIST = ['radical', 'ion', 'both'];

const C = {
  void: '#100E09',
  si: '#99A1B4',
  siDeepest: '#2A2E36',
  siDeep: '#5A6070',
  siCl: ['#99A1B4', '#8FA39C', '#7FA394', '#6E9E88', '#5C7A6E'],
  radical: '#7FC8A9',
  ion: '#F0C464',
  product: '#9FD8C0',
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `rgb(${r},${g},${bl})`;
}

/* ────────────────────────── 본체 ────────────────────────── */

export default function EtchingBasics() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const [mode, setMode] = useState('both');
  const [paused, setPaused] = useState(false);
  const [readout, setReadout] = useState({
    clock: 0, removed: 0, time: 0, rate: null, cl: 0, layers: 0,
  });
  const [tally, setTally] = useState({
    radical: { removed: 0, time: 0 },
    ion: { removed: 0, time: 0 },
    both: { removed: 0, time: 0 },
  });

  /* 초당 60 회 도는 값을 React state 로 올리면 렌더가 따라오지 못한다.
     시뮬레이션 상태는 전부 ref 에 두고, 화면 숫자만 초당 10 회 밀어 올린다. */
  const sim = useRef(null);
  const modeRef = useRef(mode);
  const pausedRef = useRef(paused);
  const tallyRef = useRef(tally);

  const boot = useCallback(() => {
    sim.current = {
      surface: createSurface(COLS),
      particles: [],
      products: [],
      flashes: [],
      clock: 0,
      lastPush: 0,
    };
  }, []);

  if (sim.current === null) boot();

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { tallyRef.current = tally; }, [tally]);

  // 결정적이지 않아도 되는 장식용 지터. 매 렌더 새로 뽑으면 격자가 떨린다.
  const jitter = useMemo(() => {
    const out = new Float32Array(COLS * (DEPTH + 6));
    for (let i = 0; i < out.length; i++) out[i] = (Math.random() - 0.5) * 1.6;
    return out;
  }, []);

  /* ── 모드 전환 ──
     표면을 새로 깐다. 앞 모드가 남긴 염소가 그대로 있으면 다음 모드의 첫 몇 초가
     공짜로 빨라져 비교가 망가진다. Coburn–Winters 도 기체를 끊고 기다렸다. */
  const changeMode = (m) => {
    boot();
    setMode(m);
    setReadout((r) => ({ ...r, clock: 0, cl: 0, layers: 0 }));
  };

  const resetAll = () => {
    boot();
    setTally({
      radical: { removed: 0, time: 0 },
      ion: { removed: 0, time: 0 },
      both: { removed: 0, time: 0 },
    });
    setReadout({ clock: 0, removed: 0, time: 0, rate: null, cl: 0, layers: 0 });
  };

  /* ── 한 프레임 ── */
  const step = useCallback((dt) => {
    const st = sim.current;
    const s = st.surface;
    const use = speciesOf(modeRef.current);
    st.clock += dt;

    // 입자 생성. 라디칼은 등방으로, 이온은 시스 전기장을 따라 수직으로 들어온다.
    if (use.radical) {
      const n = drawCount(REACTION.radicalFlux);
      for (let i = 0; i < n; i++) {
        const ang = (Math.random() * 0.7 + 0.15) * Math.PI;
        const sp = 4.2 + Math.random() * 2.0;
        st.particles.push({
          k: 0,
          x: Math.random() * VIEW_W,
          y: -6 - Math.random() * 26,
          vx: Math.cos(ang) * sp,
          vy: Math.abs(Math.sin(ang)) * sp,
        });
      }
    }
    if (use.ion) {
      const n = drawCount(REACTION.ionFlux);
      for (let i = 0; i < n; i++) {
        st.particles.push({
          k: 1,
          x: Math.random() * VIEW_W,
          y: -6 - Math.random() * 40,
          vx: (Math.random() - 0.5) * 0.18,
          vy: 5.4 + Math.random() * 1.6,
        });
      }
    }

    // 입자 진행 · 표면 도달 처리
    for (let i = st.particles.length - 1; i >= 0; i--) {
      const p = st.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20 || p.x > VIEW_W + 20 || p.y > VIEW_H + 20 || p.y < -90) {
        st.particles.splice(i, 1);
        continue;
      }
      const c = clamp(Math.floor(p.x / A), 0, COLS - 1);
      const sy = SURF_Y + s.top[c] * A;
      if (p.y < sy - R) continue;

      if (p.k === 0) {
        adsorb(s, c);
        st.flashes.push({ x: p.x, y: sy - R, r: 3, life: 1, ion: false });
      } else {
        const chlorinated = s.cl[c] >= 2;
        st.flashes.push({ x: p.x, y: sy - R, r: 5, life: 1, ion: true });
        if (ionStrike(s, c)) emit(st, c, sy, chlorinated);
      }
      st.particles.splice(i, 1);
    }

    // 자발 탈리 — 라디칼 단독 식각이 여기서 나온다
    for (const c of desorbSpontaneous(s)) {
      emit(st, c, SURF_Y + (s.top[c] - 1) * A, true);
    }

    // 표면이 시야 아래로 내려가면 격자를 통째로 끌어올린다.
    // 이미 떠 있는 것들도 같이 올라가야 지난 흔적이 표면 아래에 박히지 않는다.
    if (scrollIfSunk(s)) {
      for (const q of st.products) q.y -= A;
      for (const f of st.flashes) f.y -= A;
    }

    for (let i = st.products.length - 1; i >= 0; i--) {
      const q = st.products[i];
      q.x += q.vx; q.y += q.vy; q.vy *= 0.985; q.life -= 0.016;
      if (q.life <= 0) st.products.splice(i, 1);
    }
    for (let i = st.flashes.length - 1; i >= 0; i--) {
      st.flashes[i].life -= 0.09;
      if (st.flashes[i].life <= 0) st.flashes.splice(i, 1);
    }
  }, []);

  function emit(st, c, y, chlorinated) {
    st.products.push({
      x: c * A + A / 2, y,
      vx: (Math.random() - 0.5) * 0.9,
      vy: -(1.5 + Math.random() * 1.2),
      life: 1,
      // 전부에 글자를 달면 표면이 글자로 덮인다. 넷 중 하나만 단다.
      tag: chlorinated && Math.random() < 0.25,
    });
  }

  /* ── 그리기 ── */
  const draw = useCallback((ctx) => {
    const st = sim.current;
    const s = st.surface;

    ctx.fillStyle = C.void;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const glow = ctx.createLinearGradient(0, 0, 0, SURF_Y);
    glow.addColorStop(0, 'rgba(240,196,100,0.10)');
    glow.addColorStop(1, 'rgba(240,196,100,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, VIEW_W, SURF_Y);

    // Si 격자
    for (let c = 0; c < COLS; c++) {
      const t = s.top[c];
      const cx = c * A + A / 2;
      for (let d = 0; d <= DEPTH; d++) {
        const y = SURF_Y + (t + d) * A;
        if (y > VIEW_H + A) break;
        const j = jitter[(c * (DEPTH + 6) + d) % jitter.length];
        // 표면에서 두세 층 안에 빠르게 어두워져야 시선이 반응면에 머문다
        const shade = Math.pow(Math.max(0, 1 - d / 5), 1.5);
        ctx.beginPath();
        ctx.arc(cx + j, y + j, R, 0, Math.PI * 2);
        ctx.fillStyle = d === 0 ? C.siCl[s.cl[c]] : mix(C.siDeepest, C.siDeep, shade);
        ctx.fill();

        if (c < COLS - 1) {
          const y2 = SURF_Y + (s.top[c + 1] + d) * A;
          if (Math.abs(y2 - y) < A * 0.6) {
            ctx.beginPath();
            ctx.moveTo(cx + R, y);
            ctx.lineTo((c + 1) * A + A / 2 - R, y2);
            ctx.strokeStyle = `rgba(153,161,180,${(0.20 * Math.max(0, 1 - d / 4)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 표면 원자에 붙은 Cl
      if (s.cl[c] > 0) {
        const y = SURF_Y + s.top[c] * A;
        for (let k = 0; k < s.cl[c]; k++) {
          const ang = -Math.PI * 0.85 + (k / 3) * Math.PI * 0.7;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang) * (R + 3.6), y + Math.sin(ang) * (R + 3.6), 2.1, 0, Math.PI * 2);
          ctx.fillStyle = C.radical;
          ctx.fill();
        }
      }
    }

    // 아래쪽은 관심 대상이 아니다. 어둠으로 녹여 시선을 표면에 묶는다.
    const fade = ctx.createLinearGradient(0, VIEW_H - 140, 0, VIEW_H);
    fade.addColorStop(0, 'rgba(16,14,9,0)');
    fade.addColorStop(1, 'rgba(16,14,9,1)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, VIEW_H - 140, VIEW_W, 140);

    // 표면선
    ctx.beginPath();
    for (let c = 0; c < COLS; c++) {
      const x = c * A + A / 2, y = SURF_Y + s.top[c] * A - R - 1.5;
      if (c === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(216,207,180,0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 입자
    for (const p of st.particles) {
      if (p.k === 1) {
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = 'rgba(240,196,100,0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = C.ion;
        ctx.fillRect(p.x - 2.6, p.y - 2.6, 5.2, 5.2);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.7, 0, Math.PI * 2);
        ctx.fillStyle = C.radical;
        ctx.fill();
      }
    }

    for (const f of st.flashes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * (2 - f.life), 0, Math.PI * 2);
      ctx.strokeStyle = f.ion
        ? `rgba(240,196,100,${f.life * 0.8})`
        : `rgba(127,200,169,${f.life * 0.55})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    ctx.font = "500 11px ui-monospace, Menlo, monospace";
    ctx.textAlign = 'center';
    for (const q of st.products) {
      ctx.globalAlpha = Math.max(0, q.life);
      ctx.fillStyle = C.product;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      if (q.tag && q.life > 0.35) {
        ctx.fillStyle = `rgba(159,216,192,${(q.life - 0.35) * 1.2})`;
        ctx.fillText('SiCl₄↑', q.x, q.y - 10);
      }
      ctx.globalAlpha = 1;
    }
    ctx.textAlign = 'left';
  }, [jitter]);

  /* ── 루프 ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    let last = performance.now();

    const push = () => {
      const st = sim.current;
      const s = st.surface;
      const m = modeRef.current;
      const t = tallyRef.current[m];
      setReadout({
        clock: st.clock,
        removed: t.removed,
        time: t.time,
        rate: t.time >= SETTLE ? t.removed / t.time : null,
        cl: chlorination(s),
        layers: depthLayers(s),
      });
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!pausedRef.current) {
        const before = sim.current.surface.removed;
        step(dt);
        const gained = sim.current.surface.removed - before;
        const m = modeRef.current;
        // 누적은 ref 에 먼저 반영하고 state 는 아래 push 주기에 맞춰 올린다
        tallyRef.current[m].removed += gained;
        tallyRef.current[m].time += dt;
      }
      draw(ctx);
      if (now - sim.current.lastPush > 100) {
        sim.current.lastPush = now;
        setTally({ ...tallyRef.current });
        push();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [step, draw]);

  // 모션 최소화 설정을 존중한다. 자동 재생 대신 한 걸음씩 관찰하게 둔다.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setReduced(true); setPaused(true); }
  }, []);

  const stepOneSecond = () => {
    const m = modeRef.current;
    for (let i = 0; i < 60; i++) {
      const before = sim.current.surface.removed;
      step(1 / 60);
      tallyRef.current[m].removed += sim.current.surface.removed - before;
      tallyRef.current[m].time += 1 / 60;
    }
    setTally({ ...tallyRef.current });
  };

  /* ── 시너지 판정 ── */
  const rates = MODE_LIST.reduce((acc, m) => {
    acc[m] = tally[m].time >= SETTLE ? tally[m].removed / tally[m].time : null;
    return acc;
  }, {});
  const allDone = MODE_LIST.every((m) => rates[m] !== null);
  const maxRate = Math.max(0.001, ...MODE_LIST.map((m) => rates[m] || 0));
  const synergy = allDone ? rates.both / Math.max(0.0001, rates.radical + rates.ion) : null;

  return (
    <div className="sr-root">
      <style>{SR_CSS}</style>

      <header className="sr-top">
        <div>
          <h2 className="sr-h">식각 시너지 관측창</h2>
          <p className="sr-sub">
            챔버 단면도는 500 nm 스케일이다. 그 아래에서 실제로 벌어지는 일은 1000 배 작은 곳에 있다.
          </p>
        </div>
        <span className="sr-scale">시야 6 nm · 격자 0.15 nm · 배율 1:10⁶</span>
      </header>

      <p className="sr-lede">
        <b>Cl 라디칼이 Si 표면을 염소화하고, 수직으로 내리꽂힌 이온이 그 약해진 결합을 때려
        SiCl₄ 를 떼어낸다.</b> 아래 세 버튼으로 라디칼만·이온만·둘 다를 각각 돌려 보면
        왜 식각이 “화학 + 물리”가 아니라 <b>화학 × 물리</b>인지 숫자로 나온다.
      </p>

      <div className="sr-viewport">
        {/* 조작부는 관측창과 같은 시야 안에 있어야 한다. 캔버스 아래에 두면
            넓은 화면에서 스크롤 밑으로 내려가 "버튼이 없는 화면" 이 된다. */}
        <div className="sr-bar">
          <span className={`sr-live ${paused ? 'is-off' : ''}`} aria-hidden="true" />
          <span className="sr-bar-clock">{readout.clock.toFixed(1)} s</span>
          <div className="sr-seg" role="group" aria-label="반응 모드 선택">
            {MODE_LIST.map((m) => (
              <button
                key={m}
                type="button"
                className="sr-seg-btn"
                data-m={m}
                aria-pressed={mode === m}
                onClick={() => changeMode(m)}
                title={MODE_INFO[m].sub}
              >
                {MODE_INFO[m].name}
              </button>
            ))}
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={VIEW_W}
          height={VIEW_H}
          className="sr-canvas"
          role="img"
          aria-label={`Si 표면의 원자 스케일 모사. 현재 모드 ${MODE_INFO[mode].label}. 실시간 수치는 아래 계기판에 있다.`}
        />

        <div className="sr-legend">
          <span><i style={{ background: C.si }} />Si 원자</span>
          <span><i style={{ background: C.radical }} />Cl 라디칼 (등방 입사)</span>
          <span><i className="sq" style={{ background: C.ion }} />이온 (수직 입사)</span>
          <span><i style={{ background: C.siCl[4] }} />염소화된 표면 SiClₓ</span>
          <span><i style={{ background: C.product }} />SiCl₄ 휘발</span>
        </div>

        <dl className="sr-gauges">
          <div><dt>이 모드 누적</dt><dd>{Math.round(readout.removed)}<small>원자</small></dd></div>
          <div><dt>이 모드 시간</dt><dd>{readout.time.toFixed(1)}<small>s</small></dd></div>
          <div>
            <dt>제거 속도</dt>
            <dd>{readout.rate === null ? '—' : readout.rate.toFixed(1)}<small>원자/s</small></dd>
          </div>
          <div><dt>표면 염소화</dt><dd>{Math.round(readout.cl * 100)}<small>%</small></dd></div>
          <div>
            <dt>식각 깊이</dt>
            <dd>
              {readout.layers.toFixed(1)}
              <small>원자층 · {(readout.layers * NM_PER_LAYER).toFixed(2)} nm</small>
            </dd>
          </div>
        </dl>

        <div className="sr-controls">
          <button type="button" className="sr-btn" onClick={() => setPaused((v) => !v)}>
            {paused ? '재생' : '일시정지'}
          </button>
          <button type="button" className="sr-btn" onClick={stepOneSecond}>1초 진행</button>
          <button type="button" className="sr-btn" onClick={resetAll}>전체 초기화</button>
          <span className="sr-hint">
            {reduced
              ? '모션 최소화 설정이 켜져 있어 자동 재생을 멈춰 뒀습니다. ‘1초 진행’으로 관찰하세요.'
              : '모드를 바꾸면 표면이 초기화됩니다 — 앞 조건이 남긴 염소가 다음 측정을 오염시키기 때문입니다.'}
          </span>
        </div>
      </div>

      {/* ── 시너지 ── */}
      <section className="sr-sec">
        <p className="sr-eyebrow">관측 결과</p>
        <h3 className="sr-h3">합보다 크다</h3>
        <p className="sr-dim">
          아래 막대는 <i>지금 이 화면에서 실제로 세고 있는</i> 값이다. 모드별로 따로 누적되므로
          세 모드를 모두 돌려야 세 막대가 다 찬다.
        </p>

        <div className="sr-bars">
          {MODE_LIST.map((m) => (
            <div className="sr-bar-row" data-m={m} data-pending={rates[m] === null} key={m}>
              <span className="sr-bar-l">{MODE_INFO[m].name}</span>
              <div className="sr-track">
                <div
                  className="sr-fill"
                  style={{ width: rates[m] === null ? '0%' : `${Math.max(1.5, (rates[m] / maxRate) * 100)}%` }}
                />
              </div>
              <span className="sr-bar-v">
                {rates[m] === null ? '—' : <>{rates[m].toFixed(1)} <em>원자/s</em></>}
              </span>
            </div>
          ))}
        </div>

        <p className="sr-verdict">
          {allDone ? (
            <>
              동시 조건의 제거 속도가 <b>라디칼만 + 이온만 을 합친 것의 {synergy.toFixed(1)} 배</b>다.
              두 종을 따로 넣으면 각각 느리고, 같이 넣으면 갑자기 빨라진다. 라디칼이 Si–Si 결합을
              Si–Cl 로 바꿔 약하게 만들어 두면 같은 에너지의 이온이 훨씬 쉽게 떼어내기 때문이다.
              식각이 “화학 + 물리”가 아니라 <b>화학 × 물리</b>인 이유다.
            </>
          ) : (
            <>
              느린 조건은 오래 세야 값이 안정됩니다. 각 모드를 {SETTLE} 초씩 채우면 배수가 여기 나옵니다 —
              남은 시간:{' '}
              <b>
                {MODE_LIST
                  .filter((m) => rates[m] === null)
                  .map((m) => `${MODE_INFO[m].name} ${Math.max(0, SETTLE - tally[m].time).toFixed(0)}초`)
                  .join(' · ')}
              </b>.
            </>
          )}
        </p>
      </section>

      {/* ── 대조군 ── */}
      <section className="sr-sec">
        <p className="sr-eyebrow">대조군</p>
        <h3 className="sr-h3">Coburn–Winters 실험</h3>
        <p className="sr-dim">
          이 현상은 1979 년에 측정됐다. XeF₂ 기체와 Ar⁺ 빔을 Si 에 각각 쪼이고, 그다음 동시에 쪼인
          유명한 실험이다. 이 관측창의 반응 확률은 아래 비율에 맞춰 잡았고, 그 재현 여부는
          테스트가 지키고 있다.
        </p>

        <div className="sr-tablewrap">
          <table className="sr-table">
            <thead>
              <tr>
                <th>조건</th>
                <th>보고된 식각률</th>
                <th>상대비</th>
                <th>표면에서 일어나는 일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>XeF₂ 기체만</td>
                <td className="sr-num">약 {COBURN_WINTERS.radicalOnly} Å/min</td>
                <td className="sr-num">{(COBURN_WINTERS.radicalOnly / COBURN_WINTERS.ionOnly).toFixed(1)}</td>
                <td>불소화는 되지만 생성물이 잘 안 떨어진다</td>
              </tr>
              <tr>
                <td>Ar⁺ 빔만</td>
                <td className="sr-num">약 {COBURN_WINTERS.ionOnly} Å/min</td>
                <td className="sr-num">1.0</td>
                <td>순수 물리 스퍼터링. 결합을 때려 뜯을 뿐이다</td>
              </tr>
              <tr>
                <td>XeF₂ + Ar⁺</td>
                <td className="sr-num">약 {COBURN_WINTERS.both} Å/min</td>
                <td className="sr-num">{(COBURN_WINTERS.both / COBURN_WINTERS.ionOnly).toFixed(1)}</td>
                <td>약해진 Si–F 결합을 이온이 때려 SiF₄ 로 날린다</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="sr-cite">
          J. W. Coburn &amp; H. F. Winters, <i>J. Appl. Phys.</i> <b>50</b>, 3189 (1979).
          값은 논문 그래프에서 읽은 근사치다. 문헌 시너지는 {COBURN_WINTERS.synergy.toFixed(1)} 배다.
        </p>
      </section>

      <div className="sr-caveat">
        <b>이 모사가 하지 않는 것</b>
        <ul>
          <li>분자동역학 계산이 아니다. 흡착·스퍼터링 확률을 Coburn–Winters 의 상대비에 맞춰 잡은 <b>확률 모사</b>이고, 원자 간 힘을 풀지 않는다.</li>
          <li>격자는 실제 Si 결정면 (100)/(111) 이 아니라 정사각 배열이다. 결정 방향에 따른 식각 이방성은 담기지 않았다.</li>
          <li>이온 에너지·입사각 분포, 표면 전하 축적, 재증착은 넣지 않았다.</li>
          <li>화면의 “원자/s”는 이 모사 안에서만 의미가 있는 상대 지표다. 실제 식각률(nm/min)로 환산해 인용하면 안 된다.</li>
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────── 스타일 ──────────────────────────
   식각 베이(EtchingBay)와 같은 장비 콘솔 팔레트를 쓴다.
   두 화면의 스케일은 1000 배 다르지만, 색이 같은 뜻을 갖는다 —
   이온 골드, 라디칼 그린, 생성물 민트. */

const SR_CSS = `
.sr-root {
  --ground:#14120C; --panel:#1C1913; --panel-hi:#241F16;
  --rule:#3B362C; --rule-soft:#2A261C;
  --ink:#D8CFB4; --ink-mid:#A69B7F; --ink-dim:#8A8069;
  --ion:#F0C464; --radical:#7FC8A9; --product:#9FD8C0;
  --mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: var(--ground);
  color: var(--ink);
  font-family: 'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif;
  line-height: 1.7;
  padding: 28px 22px 64px;
  min-height: 100%;
  /* 이 카드는 h-screen 플렉스 컨테이너(App.js) 안의 플렉스 아이템이다.
     기본 flex-shrink 를 두면 높이가 뷰포트(900px)로 눌리는데 내용은 그보다 길어서,
     어두운 배경이 눌린 높이까지만 칠해지고 그 아래는 앱의 밝은 배경이 드러났다.
     밝은 글씨가 흰 바탕 위에 올라가 거의 안 보였다. 내용 높이를 지키게 한다. */
  flex: 0 0 auto;
}
.sr-root * { box-sizing: border-box; }

.sr-top { display:flex; flex-wrap:wrap; align-items:baseline; gap:10px 20px;
  padding-bottom:12px; border-bottom:1px solid var(--rule); }
.sr-h { margin:0; font-size:1.5rem; font-weight:700; letter-spacing:-0.02em; color:var(--ink); }
.sr-sub { margin:4px 0 0; font-size:0.86rem; color:var(--ink-dim); }
.sr-scale { margin-left:auto; font-family:var(--mono); font-size:0.72rem; color:var(--ink-dim); }
.sr-lede { margin:18px 0 0; max-width:66ch; color:var(--ink-mid); font-size:0.95rem; }
.sr-lede b { color:var(--ink); font-weight:600; }

.sr-viewport { margin-top:26px; border:1px solid var(--rule); border-radius:3px;
  background:var(--panel); overflow:hidden; }
.sr-bar { display:flex; align-items:center; gap:10px; padding:8px 12px;
  border-bottom:1px solid var(--rule-soft); background:var(--panel-hi);
  font-family:var(--mono); font-size:0.7rem; letter-spacing:0.06em; color:var(--ink-dim); }
.sr-live { width:6px; height:6px; border-radius:50%; background:var(--radical);
  box-shadow:0 0 6px var(--radical); flex:0 0 auto; }
.sr-live.is-off { background:var(--ink-dim); box-shadow:none; }
.sr-bar-r { margin-left:auto; }
.sr-canvas {
  display:block; width:100%; height:auto; aspect-ratio:960/400; background:#100E09;
  /* 넓은 화면에서 캔버스만 커져 계기판이 밀려나는 것을 막는다 */
  max-height:46vh; margin:0 auto;
}

.sr-legend { display:flex; flex-wrap:wrap; gap:10px 20px; padding:10px 16px;
  border-top:1px solid var(--rule-soft); background:var(--panel);
  font-family:var(--mono); font-size:0.72rem; color:var(--ink-mid); }
.sr-legend span { display:inline-flex; align-items:center; gap:7px; }
.sr-legend i { width:9px; height:9px; border-radius:50%; display:inline-block; flex:0 0 auto; }
.sr-legend i.sq { border-radius:1px; width:10px; height:10px; }

.sr-bar-clock { font-variant-numeric:tabular-nums; }

/* 모드 선택 — 관측창 상단 바 오른쪽에 붙인 세그먼트 컨트롤 */
.sr-seg { display:flex; margin-left:auto; gap:1px; background:var(--rule); border:1px solid var(--rule); border-radius:3px; overflow:hidden; }
.sr-seg-btn {
  appearance:none; border:0; background:var(--panel); color:var(--ink-mid);
  font-family:inherit; font-size:0.78rem; font-weight:600; letter-spacing:0;
  text-transform:none; padding:5px 13px; cursor:pointer; white-space:nowrap;
  transition:background 140ms ease, color 140ms ease;
}
.sr-seg-btn:hover { background:var(--panel-hi); color:var(--ink); }
.sr-seg-btn:focus { outline:none; }   /* 앱 전역 포커스 링이 파랗게 튀어나온다 */
.sr-seg-btn:focus-visible { outline:2px solid var(--ion); outline-offset:-2px; }
.sr-seg-btn[aria-pressed="true"] { color:#14120C; }
.sr-seg-btn[data-m="radical"][aria-pressed="true"] { background:var(--radical); }
.sr-seg-btn[data-m="ion"][aria-pressed="true"] { background:var(--ion); }
.sr-seg-btn[data-m="both"][aria-pressed="true"] { background:var(--product); }

.sr-gauges { display:grid; grid-template-columns:repeat(auto-fit,minmax(148px,1fr)); gap:1px;
  background:var(--rule-soft); border-top:1px solid var(--rule-soft); margin:0; }
.sr-gauges > div { background:var(--panel); padding:11px 18px; }
.sr-gauges dt { font-family:var(--mono); font-size:0.63rem; letter-spacing:0.09em; color:var(--ink-dim); }
.sr-gauges dd { margin:2px 0 0; font-family:var(--mono); font-size:1.3rem; font-weight:500;
  font-variant-numeric:tabular-nums; color:var(--ink); }
.sr-gauges dd small { font-size:0.66rem; color:var(--ink-dim); margin-left:3px; font-weight:400; }

.sr-controls { display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding:11px 18px;
  border-top:1px solid var(--rule-soft); background:var(--panel); }
.sr-btn { appearance:none; font-family:var(--mono); font-size:0.74rem; letter-spacing:0.05em;
  color:var(--ink-mid); background:transparent; border:1px solid var(--rule); border-radius:2px;
  padding:5px 11px; cursor:pointer; transition:border-color 140ms ease, color 140ms ease; }
.sr-btn:hover { color:var(--ink); border-color:var(--ink-dim); }
.sr-btn:focus-visible { outline:2px solid var(--ion); outline-offset:2px; }
.sr-hint { font-size:0.78rem; color:var(--ink-dim); margin-left:auto; max-width:52ch; }

.sr-sec { margin-top:46px; }
.sr-eyebrow { margin:0 0 5px; font-family:var(--mono); font-size:0.65rem; letter-spacing:0.12em;
  text-transform:uppercase; color:var(--ink-dim); }
.sr-h3 { margin:0 0 10px; font-size:1.1rem; font-weight:600; color:var(--ink); }
.sr-dim { margin:0; color:var(--ink-mid); font-size:0.92rem; max-width:66ch; }

/* 값 칸이 화면 밖으로 밀려 "12.6 원자/s" 가 잘려 보였다.
   1fr 는 내용에 따라 최소 너비를 갖기 때문에 셋을 합친 폭이 컨테이너를 넘길 수 있다.
   가운데를 minmax(0,1fr) 로 눌러 줄이 넘치지 않게 한다. */
.sr-bars { margin-top:18px; display:grid; gap:11px; max-width:760px; }
.sr-bar-row { display:grid; grid-template-columns:76px minmax(0,1fr) 96px; align-items:center; gap:12px; }
.sr-bar-l { font-size:0.85rem; color:var(--ink-mid); }
.sr-track { height:20px; min-width:0; background:var(--panel); border:1px solid var(--rule-soft);
  border-radius:2px; overflow:hidden; }
.sr-fill { height:100%; width:0; transition:width 320ms cubic-bezier(.2,.7,.3,1);
  border-right:1px solid rgba(255,255,255,0.14); }
/* 아직 15 초를 못 채운 모드는 빈 검은 띠로 보여 "고장" 처럼 읽힌다.
   빗금을 깔아 "측정 전" 임을 표시한다. */
.sr-bar-row[data-pending="true"] .sr-track {
  background:repeating-linear-gradient(135deg,var(--panel),var(--panel) 5px,var(--panel-hi) 5px,var(--panel-hi) 10px);
}
.sr-bar-row[data-m="radical"] .sr-fill { background:#4A7A66; }
.sr-bar-row[data-m="ion"] .sr-fill { background:#8A7238; }
.sr-bar-row[data-m="both"] .sr-fill { background:#6BA790; }
.sr-bar-v { font-family:var(--mono); font-size:0.82rem; font-variant-numeric:tabular-nums;
  text-align:right; color:var(--ink); white-space:nowrap; }
.sr-bar-v em { font-style:normal; color:var(--ink-dim); font-size:0.72rem; }

.sr-verdict { margin:18px 0 0; padding:12px 18px; border-left:2px solid var(--product);
  background:var(--panel); font-size:0.93rem; color:var(--ink-mid); max-width:none; }
.sr-verdict b { color:var(--product); font-weight:600; }

.sr-tablewrap { overflow-x:auto; margin-top:18px; }
.sr-table { border-collapse:collapse; width:100%; min-width:520px; font-size:0.87rem; }
.sr-table th, .sr-table td { text-align:left; padding:9px 12px;
  border-bottom:1px solid var(--rule-soft); vertical-align:top; color:var(--ink-mid); }
.sr-table th { font-family:var(--mono); font-size:0.65rem; letter-spacing:0.09em;
  text-transform:uppercase; color:var(--ink-dim); font-weight:500; border-bottom-color:var(--rule); }
.sr-table td:first-child { color:var(--ink); }
.sr-num { font-family:var(--mono); font-variant-numeric:tabular-nums; white-space:nowrap; }
.sr-cite { margin:12px 0 0; font-size:0.8rem; color:var(--ink-dim); }

.sr-caveat { margin-top:46px; padding-top:18px; border-top:1px solid var(--rule);
  font-size:0.83rem; color:var(--ink-dim); }
.sr-caveat b { color:var(--ink-mid); font-weight:600; }
.sr-caveat ul { margin:10px 0 0; padding-left:1.1em; }
.sr-caveat li { margin-bottom:6px; max-width:74ch; }

@media (max-width:640px) {
  .sr-bar-row { grid-template-columns:72px 1fr 86px; }
  .sr-scale { margin-left:0; width:100%; }
  .sr-hint { margin-left:0; }
}
@media (prefers-reduced-motion: reduce) { .sr-fill { transition:none; } }
`;
