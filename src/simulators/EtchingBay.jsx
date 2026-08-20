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
  sheathCollisionality,
  CCP_CONDUCTOR_CD_FLOOR,
} from '../physics/etching';

/* ────────────────────────── 상수 ────────────────────────── */

const ATM_MTORR = 760000;      // 대기압
const BASE_MTORR = 5;          // 도달 진공
/* 막 두께는 이제 모드가 정한다 (게이트 200 nm, 콘택 800 nm). 그림에서 막은 항상
   FILM_PX 픽셀로 그리므로, 나노미터당 배율은 모드마다 달라진다 — 같은 그림이지만
   눈금이 다르다. */
const TICK_MS = 100;           // 시뮬레이션 틱
const SIM_SPEED = 10;          // 실시간 대비 배속 (틱당 1초)

const TARGETS = [
  { id: 'Si',    label: 'Si',     desc: '폴리실리콘 게이트',  under: 'SiO2' },
  { id: 'SiO2',  label: 'SiO₂',   desc: '산화막 콘택홀',      under: 'Si' },
  { id: 'Si3N4', label: 'Si₃N₄',  desc: '질화막 스페이서',    under: 'SiO2' },
  { id: 'PR',    label: 'PR',     desc: '포토레지스트 애싱',  under: 'Si' },
];

/* 압력·파워·CD·시간의 조절 범위는 이제 상수가 아니라 **모드가 정한다** (MODES).
   ICP 게이트 식각의 바이어스 20~250 W 와 이중 주파수 CCP 콘택 식각의 300~3000 W 는
   겹치지도 않는 구간이라, 하나의 범위로 묶으면 어느 쪽도 제대로 못 돌린다.
   가스 스텝만 모든 모드가 공유한다. */
const G_STEP = 5;                               // sccm



const GASES = [
  { id: 'Cl2',  label: 'Cl₂',  role: 'Si 주 식각종. 늘리면 식각률이 오르지만 선택비가 깎인다.' },
  { id: 'HBr',  label: 'HBr',  role: '측벽 passivation. 이방성과 선택비를 올리지만 30 sccm을 넘으면 식각률을 되레 눌러버린다.' },
  { id: 'CF4',  label: 'CF₄',  role: '산화막 주 식각종. F 라디칼이 많아지면 선택비가 떨어진다.' },
  { id: 'CHF3', label: 'CHF₃', role: '폴리머 생성. 하부층을 덮어 선택비를 올리지만 과하면 etch stop.' },
  { id: 'C4F8', label: 'C₄F₈', role: '산화막 콘택의 주 식각종이자 폴리머 공급원. 두 몫을 동시에 한다 — 불소가 Si–O 를 끊고, 남은 탄소가 측벽과 하부 실리콘을 덮어 선택비를 만든다. CF₄ 보다 C:F 비가 높아 폴리머가 두껍고, 과하면 etch stop 으로 간다.' },
  { id: 'O2',   label: 'O₂',   role: 'PR 애싱. 폴리머를 태워 없앤다.' },
  { id: 'Ar',   label: 'Ar',   role: '물리 스퍼터. 이방성엔 도움, 선택비엔 손해.' },
];

/* ────────────────────────── 공정 모드 ──────────────────────────
   장비가 하나인데 타깃만 넷이었다. 그래서 "CCP 100 mTorr 로 100 nm 게이트" 처럼
   실제로는 존재하지 않는 조합을 만들 수 있었다. 공정마다 쓰는 장비가 다르므로
   모드가 장비를 고르고, 장비가 조절 범위를 고르게 한다.

   ① 도전막 게이트 — ICP/TCP. 소스와 바이어스가 분리된 고밀도 플라즈마.
      게이트 산화막이 2 nm 밖에 안 되므로 선택비가 전부다. 이온은 많이·약하게.
   ② 유전막 콘택 — 이중 주파수 CCP. 상부 60 MHz 가 밀도를, 하부 2 MHz 가 이온
      에너지를 맡는다. Si–O 결합을 끊어야 하니 수백 eV 가 필요하다. 이온은 적게·세게.

   범위는 리서치한 실제 레시피 구간이다. win 은 그 모드의 표준 공정 창으로,
   슬라이더 위에 띠로 표시된다 — 밖으로 나가도 계산은 되지만 표준이 아님을 알린다.

   ※ 실제 콘택 식각의 주 식각종은 C₄F₈·C₄F₆ 인데 이 물리 모델의 가스 목록에는
     없다. 있는 것 중 가장 가까운 CF₄/CHF₃ 로 대신하고 화면에 그렇게 적는다.
     없는 가스를 있는 척하는 것보다 낫다. */
const MODES = [
  {
    id: 'gate',
    name: '도전막 게이트',
    sub: '폴리실리콘 · Cl₂/HBr',
    equip: 'ICP / TCP',
    equipSub: '소스와 바이어스가 분리된 고밀도 플라즈마',
    model: 'TCP-9400',
    plate: 'Inductively Coupled (TCP) · Source + Bias · Bay 1',
    type: 'icp',
    targets: ['Si'],
    filmNm: 200,                       // 폴리실리콘 게이트 두께
    /* 게이트 식각에서 선택비가 전부인 **이유**가 이 숫자다. 하부층이 게이트 산화막
       2 nm 뿐이라, 뚫으면 그 아래 채널이 손상돼 소자가 죽는다. 선택비 112:1 이
       왜 좋은 값인지는 이 두께를 옆에 놓아야 답이 된다. */
    underNm: 2,
    underLabel: '게이트 산화막',
    breachMsg: '뚫렸습니다. 그 아래 채널이 손상되어 소자 불량입니다.',
    source: { label: '소스 (TCP 13.56 MHz)', min: 250, max: 1500, step: 50, def: 850, win: [500, 1150] },
    bias: { label: '바이어스 (13.56 MHz)', min: 20, max: 250, step: 10, def: 120, win: [60, 170] },
    pressure: { min: 4, max: 60, step: 2, def: 8, win: [4, 12], note: '메인 4~12 · 오버에치 55~65' },
    time: { min: 10, max: 300, step: 10, def: 60, win: [40, 90] },
    cd: { min: 30, max: 250, step: 10, def: 90, win: [30, 150] },
    gases: ['Cl2', 'HBr', 'O2'],
    gasMax: 200,
    gasDef: { Cl2: 70, HBr: 120, CF4: 0, C4F8: 0, CHF3: 0, O2: 5, Ar: 0 },
    gasWin: { Cl2: [50, 100], HBr: [100, 140], O2: [2, 10] },
    note: '게이트 산화막이 2 nm 라 선택비가 전부다. 이온을 많이·약하게 보낸다.',
  },
  {
    id: 'contact',
    name: '유전막 콘택',
    sub: '산화막 · 불소계 폴리머',
    equip: '이중 주파수 CCP',
    equipSub: '상부 60 MHz 로 밀도, 하부 2 MHz 로 이온 에너지',
    model: 'DFC-2300',
    plate: 'Dual-Frequency CCP · 60 MHz + 2 MHz · Bay 3',
    type: 'dfccp',
    targets: ['SiO2', 'Si3N4', 'PR'],
    /* 층간 절연막 두께. 800 nm 로 잡았더니 이 모델의 식각률(약 125 nm/min)로는
       관통에 486 초가 걸려 기본 레시피가 아예 안 뚫렸다. 500 nm 콘택도 실제 값이고
       종횡비 8.3 이면 ARDE 를 보여주기에 충분하다. */
    filmNm: 500,
    /* 콘택은 실리콘 기판/실리사이드에 닿는다. 두꺼우므로 조금 파여도 죽지 않지만,
       접합(junction) 깊이를 넘기면 누설이 난다. */
    underNm: 60,
    underLabel: '실리콘 기판',
    breachMsg: '접합을 뚫어 누설 전류가 납니다.',
    source: { label: '소스 HF (상부 60 MHz)', min: 300, max: 1500, step: 50, def: 300, win: [300, 720] },
    bias: { label: '바이어스 LF (하부 2 MHz)', min: 300, max: 3000, step: 100, def: 500, win: [440, 1500] },
    pressure: { min: 20, max: 80, step: 5, def: 20, win: [20, 47], note: '홀이 깊을수록 낮게' },
    time: { min: 30, max: 600, step: 10, def: 300, win: [240, 400] },
    cd: { min: 40, max: 200, step: 10, def: 60, win: [40, 120] },   // 종횡비 8.3
    gases: ['C4F8', 'CHF3', 'Ar', 'O2'],
    gasMax: 200,
    gasDef: { Cl2: 0, HBr: 0, CF4: 0, C4F8: 30, CHF3: 5, O2: 8, Ar: 60 },
    gasWin: { C4F8: [20, 40], CHF3: [0, 15], Ar: [40, 90], O2: [4, 14] },
    note: 'Si–O 결합을 끊어야 하니 수백 eV 가 필요하다. 이온을 적게·세게 보낸다.',
  },
];

const modeOf = (id) => MODES.find((m) => m.id === id) || MODES[0];

/** 그 모드의 기본 레시피. 모드를 바꾸면 조절값이 통째로 이 값으로 돌아간다. */
function modeDefaults(m) {
  return {
    target: m.targets[0],
    source: m.source.def,
    bias: m.bias.def,
    pressure: m.pressure.def,
    etchTime: m.time.def,
    cd: m.cd.def,
    gasFlows: { ...m.gasDef },
  };
}

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

/** 두 색을 섞는다. 단면에서 깊이에 따라 어두워지는 데 쓴다. */
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `rgb(${r},${g},${bl})`;
}
const fmt = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : '—');

/** 막을 관통하는 데 걸리는 시간(s). ARDE 때문에 깊이의 함수라 해석해가 없어
    충분히 긴 시간을 돌려 보고 관통 시각을 읽는다. 못 뚫으면 null. */
function estimatePunchTime(pv) {
  const run = simulateEtchRun({
    rate: pv.rate, seconds: 36000, filmThickness: pv.filmNm, trenchWidth: pv.trench,
    profile: pv.prof, selectivity: pv.sel, dt: 2,
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


/* ────────────────────────── 챔버 단면도 ────────────────────────── */

/* 단면 좌표계.
   막 두께(모드마다 다르다)가 FILM_PX 픽셀이므로 나노미터당 배율이 정해진다.
   패턴 폭(CD)도 **같은 배율**로 그린다. 예전에는 개구부가 64 px 로 고정이라
   화면에서 잰 종횡비와 계산에 쓰는 종횡비가 서로 달랐다. */
const VIEW_W = 320, VIEW_H = 210;
const TRENCH_TOP = 78;          // 막 상면 y
const FILM_PX = 62;             // 막 두께
const SUB_PX = 44;              // 그릴 수 있는 하부층 두께
const MASK_PX = 15;             // 마스크 두께
const CX = VIEW_W / 2;
const pxPerNmOf = (filmNm) => FILM_PX / Math.max(1, filmNm);

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
  none: '식각 없음',
};

const PRODUCTS = {
  Si: 'SiCl₄↑',
  SiO2: 'SiF₄↑',
  Si3N4: 'SiF₄↑',
  PR: 'CO₂↑',
};

function ChamberView({
  phase, pressure, source, bias, filmNm, underNm, underLabel, filmEtched, underlayerLoss,
  cd, profile, target, glowSeed, callouts,
}) {
  const plasmaOn = phase === 'PROCESSING' || phase === 'ENDPOINT';
  /* 플라즈마의 밝기는 밀도, 즉 소스 파워가 정한다. 바이어스를 올려도 더 밝아지지
     않는다 — 이온이 세게 때릴 뿐 많아지지 않는다. */
  const glow = plasmaOn ? clamp(0.25 + source / 900, 0.25, 0.95) : 0;

  const blanket = target === 'PR';                  // 애싱은 마스크 없이 전면이 깎인다
  const pxPerNm = pxPerNmOf(filmNm);
  const half = blanket ? (VIEW_W - 68) / 2 : clamp((cd * pxPerNm) / 2, 4, 110);
  const dFilm = clamp(filmEtched * pxPerNm, 0, FILM_PX);
  const dUnder = clamp(underlayerLoss * pxPerNm, 0, SUB_PX - 4);
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
    const n = plasmaOn ? Math.round(10 + (source / 800) * 26) : 0;
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
  }, [plasmaOn, source, glowSeed]);

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
  /* 마스크 파세팅.
     예전에는 조건만 맞으면 5 px 짜리 모따기가 통째로 튀어나와, 식각이 시작되는 순간
     마스크 모양이 갑자기 달라 보였다. 침식은 서서히 진행되는 일이므로 깊이에 따라
     자라게 한다 (0 → 5 px). 침식 속도 자체는 모델에 없고 표시는 여전히 정성적이다. */
  const facet = profile.maskDamage ? clamp(dFilm / FILM_PX, 0, 1) * 5 : 0;
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
        {/* 하부층 예산선. 게이트 산화막 2 nm 는 이 배율에서 0.6 px 라 그려도 안 보인다.
            두께를 정직하게 그리는 대신 "여기를 넘으면 소자가 죽는다" 는 한계선을
            긋고, 넘으면 빨갛게 바꾼다. 선택비가 지키는 것이 바로 이 선이다. */}
        {!blanket && underNm > 0 && (() => {
          const yLimit = TRENCH_TOP + FILM_PX + Math.max(2.5, underNm * pxPerNm);
          const over = underlayerLoss > underNm;
          return (
            <g>
              <line x1="34" y1={yLimit} x2={VIEW_W - 34} y2={yLimit}
                    stroke={over ? '#E06C5A' : '#6FBF8E'} strokeWidth="1"
                    strokeDasharray="4 3" opacity={over ? 0.95 : 0.65} />
              <text x={VIEW_W - 36} y={yLimit - 3} fontSize="7" textAnchor="end"
                    fill={over ? '#E06C5A' : '#6FBF8E'}
                    fontFamily="ui-monospace, Menlo, monospace">
                {underLabel} {underNm}nm {over ? '관통' : '한계'}
              </text>
            </g>
          );
        })()}

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
            잔막 {Math.round(filmNm - filmEtched)}nm
          </text>
        )}
        {underlayerLoss > 0.5 && (
          <text x={CX} y={TRENCH_TOP + FILM_PX + dUnder + 9} fontSize="7" fill="#E06C5A" textAnchor="middle"
                fontFamily="ui-monospace, Menlo, monospace">
            하부층 −{Math.round(underlayerLoss)}nm
          </text>
        )}

        {/* 확대 지점 표시.
            아래 원자 스케일 인셋이 **어디를** 확대한 것인지 그림으로 잇는다.
            이 표시가 없으면 인셋이 뜬금없는 그림으로 읽힌다. */}
        {callouts && !blanket && dFilm > 6 && (
          <g fontFamily="ui-monospace, Menlo, monospace" fontSize="6.5" fontWeight="600">
            {/* Ⓐ 바닥 — 이온이 쏟아지는 곳 */}
            <circle cx={CX + hBottom * 0.55} cy={TRENCH_TOP + dFilm - 5.5} r="5"
                    fill="#141209" stroke="#F0C464" strokeWidth="0.9" />
            <text x={CX + hBottom * 0.55} y={TRENCH_TOP + dFilm - 3.4} fill="#F0C464"
                  textAnchor="middle">A</text>
            {/* Ⓑ 측벽 — 라디칼만 닿는 곳 */}
            <circle cx={CX - halfWidthAt(0.5, half, U, T, B) - 7} cy={TRENCH_TOP + dFilm * 0.5} r="5"
                    fill="#141209" stroke="#7FC8A9" strokeWidth="0.9" />
            <text x={CX - halfWidthAt(0.5, half, U, T, B) - 7} y={TRENCH_TOP + dFilm * 0.5 + 2.1}
                  fill="#7FC8A9" textAnchor="middle">B</text>
          </g>
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
          {PROFILE_LABEL[profile.profileType]}
          {profile.hasEtchant ? ` · 측벽 ${profile.sidewallAngle.toFixed(0)}°` : ''}
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

/* ────────────────────── 원자 스케일 상세 ──────────────────────
   챔버 단면은 500 nm 스케일이라 프로파일의 **결과**만 보인다. 왜 그 모양인지는
   1000 배 아래에서 정해진다. 여기서는 그 자리를 두 군데 확대해 나란히 돌린다.

     Ⓐ 트렌치 바닥 — 시스 전기장에 가속된 이온이 수직으로 쏟아진다. 라디칼도 온다.
                     라디칼이 표면 Si 를 염소화해 결합을 약하게 만들어 두면
                     이온이 때려 SiCl₄ 로 떼어낸다. 빠르다.
     Ⓑ 측벽        — 이온은 수직으로 내려가므로 벽을 지나친다. 방향성 없는 라디칼만
                     닿고, 폴리머가 있으면 그마저 막힌다. 느리다.

   두 면이 물러나는 속도의 비가 곧 이방도다. A = 1 − (수평 식각률 / 수직 식각률).

   ── 왜 이렇게까지 그리나 ──
   처음에는 점만 흔들리는 그림이었고 "모션으로 뭔가 설명하는 것 같은데 뭔지 모르겠다"
   는 말을 들었다. 다음에는 면이 통째로 미끄러져 내려가게 했는데, 그것도 원자가 그냥
   이동할 뿐이어서 **들러붙고 떨어져 나가는 장면**이 없었다.
   지금은 「식각 기초」 카드와 같은 반응을 그대로 돌린다. 라디칼이 날아와 표면 원자에
   달라붙어 염소화가 쌓이고(껍질이 짙어진다), 이온이 때리면 그 원자가 SiCl₄ 로
   빠져나가면서 면이 한 칸 물러난다. 같은 장면을 두 지점에서 동시에 보여 준다.

   ⚠ 여기서 식각률을 따로 재지 않는다. 제거를 허용하는 총량은 프로파일을 그리는 그 값
     (바닥 = filmEtched, 측벽 = lateralRatio × filmEtched)에서 그대로 나온다. 반응은
     진짜로 돌지만 누적은 프로파일과 어긋날 수 없다. 재서 숫자를 또 만들면 화면에
     진실이 둘이 되고 언젠가 갈라진다. 직접 세어 보는 화면은 「식각 기초」 카드다. */

const DET_W = 640, DET_H = 168;
const DET_R = 8.4;                 // 원자 반지름
const NM_PER_ATOM = 2;             // 원자 하나가 나타내는 식각량 (그림 단위)
/* 패널 A(바닥)는 수평면이라 가로를 다 쓰고, B(측벽)는 수직면이라 세로를 다 쓴다.
   처음에는 A 를 좁게 잡아 오른쪽 절반이 비어 보였다. */
const A_COLS = 6, A_PITCH = 46, A_X0 = 36, A_Y0 = 52, A_DEPTH = 4;
const B_ROWS = 5, B_PITCH = 27, B_Y0 = 34, B_X0 = 486, B_DEPTH = 4;

const DET_C = {
  void: '#141209',
  si: '#8FA39C',
  siDeep: '#3A4048',
  siCl: ['#8FA39C', '#84A096', '#79A08E', '#6E9E88', '#5C7A6E'],
  radical: '#7FC8A9',
  ion: '#F0C464',
  product: '#9FD8C0',
  polymer: '#E2B45C',
};

/** 한 지점의 표면 상태. 열(또는 행)마다 원자가 쌓여 있고 최상단이 표면이다. */
function makeSite(n) {
  return { n, back: new Int16Array(n), cl: new Uint8Array(n), removed: 0, scrolled: 0 };
}

/**
 * 한 자리를 떼어낸다.
 *
 * **가장 덜 물러난 면들 중에서** 가장 염소화된 곳을 고른다. 염소화만 보고 고르면
 * 라디칼이 우연히 몰린 한 열만 계속 파여 표면이 계단처럼 무너지고, 모든 열이
 * 내려가야 걸리는 스크롤도 영영 안 걸려 격자가 화면 밖으로 행진한다.
 * 실제 평탄한 면의 식각도 대체로 층 단위로 진행된다.
 */
function detachOne(site) {
  let front = Infinity;
  for (let i = 0; i < site.n; i++) if (site.back[i] < front) front = site.back[i];
  let best = -1;
  for (let i = 0; i < site.n; i++) {
    if (site.back[i] !== front) continue;
    if (best < 0 || site.cl[i] > site.cl[best]) best = i;
  }
  const at = best;
  site.back[at] += 1;
  site.cl[at] = 0;                      // 새로 드러난 원자는 아직 깨끗하다
  site.removed += 1;
  let min = Infinity;
  for (let i = 0; i < site.n; i++) if (site.back[i] < min) min = site.back[i];
  if (min >= 1) {
    for (let i = 0; i < site.n; i++) site.back[i] -= 1;
    site.scrolled += 1;
  }
  return at;
}

function SurfaceDetail({ profile, filmEtched, live }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stRef = useRef(null);
  const propsRef = useRef({ profile, filmEtched, live });

  useEffect(() => { propsRef.current = { profile, filmEtched, live }; }, [profile, filmEtched, live]);

  if (stRef.current === null) {
    stRef.current = {
      a: makeSite(A_COLS),
      b: makeSite(B_ROWS),
      parts: [],      // 날아다니는 종
      prods: [],      // 빠져나가는 생성물
      hits: [],       // 충돌 섬광
    };
  }

  // 런이 새로 시작하면(깊이가 되감기면) 표면도 새로 깐다
  useEffect(() => {
    if (filmEtched < 1) {
      stRef.current = { a: makeSite(A_COLS), b: makeSite(B_ROWS), parts: [], prods: [], hits: [] };
    }
  }, [filmEtched]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    let last = performance.now();

    const rnd = () => Math.random();

    const step = (dt) => {
      const st = stRef.current;
      const { profile: prof, filmEtched: film, live: on } = propsRef.current;

      /* 런이 끝나거나 멈추면 **아무것도 하지 않는다.**
         예전에는 입자 생성만 끊고 제거·소멸은 계속 돌았다. 제거될 때마다 그 자리의
         염소화가 0 으로 초기화되는데 새 라디칼은 오지 않으니, 끝난 뒤에 붙어 있던
         염소가 하나씩 사라져 표면이 저절로 깨끗해졌다. 공정이 끝났는데 화면이
         계속 변하는 것 자체가 어색하다. 마지막 장면 그대로 세운다. */
      if (!on) return;

      /* 제거 허용량. 프로파일 값에서 그대로 나온다 — 여기서 새로 재지 않는다. */
      const targetA = film / NM_PER_ATOM;
      const targetB = (prof.lateralRatio * film) / NM_PER_ATOM;

      if (on) {
        // 라디칼은 양쪽 모두에 온다. 방향이 제멋대로라 측벽에도 닿는다.
        if (rnd() < 0.34) {
          st.parts.push({ k: 0, site: 'a', x: A_X0 - 14 + rnd() * (A_COLS * A_PITCH), y: -6,
                          vx: (rnd() - 0.5) * 1.6, vy: 1.8 + rnd() * 1.2 });
        }
        if (rnd() < 0.26) {
          st.parts.push({ k: 0, site: 'b', x: DET_W - 8, y: 16 + rnd() * 132,
                          vx: -(1.6 + rnd() * 1.2), vy: (rnd() - 0.5) * 1.4 });
        }
        // 이온은 바닥에만 꽂힌다. 측벽 쪽은 벽을 지나쳐 내려간다.
        if (rnd() < 0.30) {
          st.parts.push({ k: 1, site: 'a', x: A_X0 - 8 + rnd() * (A_COLS * A_PITCH), y: -6,
                          vx: 0, vy: 3.4 + rnd() * 1.0 });
        }
        if (rnd() < 0.12) {
          st.parts.push({ k: 1, site: 'pass', x: B_X0 + 26 + rnd() * 118, y: -6, vx: 0, vy: 3.4 });
        }
      }

      // 진행 · 도달 처리
      for (let i = st.parts.length - 1; i >= 0; i--) {
        const p = st.parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20 || p.x > DET_W + 20 || p.y > DET_H + 20) { st.parts.splice(i, 1); continue; }
        // 자기 패널을 벗어난 종은 버린다. 놔두면 반대쪽 그림 위로 날아가 지저분해진다.
        if (p.site === 'a' && p.x > DET_W / 2) { st.parts.splice(i, 1); continue; }
        if (p.site !== 'a' && p.x < DET_W / 2 + 12) { st.parts.splice(i, 1); continue; }

        if (p.site === 'a') {
          const c = Math.floor((p.x - A_X0 + A_PITCH / 2) / A_PITCH);
          if (c < 0 || c >= A_COLS) continue;
          const sy = A_Y0 + st.a.back[c] * A_PITCH;
          if (p.y < sy - DET_R) continue;
          if (p.k === 0 && st.a.cl[c] < 4) st.a.cl[c] += 1;   // 흡착
          st.hits.push({ x: p.x, y: sy - DET_R, life: 1, ion: p.k === 1 });
          st.parts.splice(i, 1);
        } else if (p.site === 'b') {
          const r = Math.floor((p.y - B_Y0 + B_PITCH / 2) / B_PITCH);
          if (r < 0 || r >= B_ROWS) continue;
          const sx = B_X0 - st.b.back[r] * B_PITCH;
          if (p.x > sx + DET_R) continue;
          if (st.b.cl[r] < 4) st.b.cl[r] += 1;
          st.hits.push({ x: sx + DET_R, y: p.y, life: 1, ion: false });
          st.parts.splice(i, 1);
        }
      }

      /* 떼어내기. 허용량을 넘지 않는 선에서 한 프레임에 하나씩.
         가장 염소화된 자리가 먼저 나가므로, 라디칼이 붙는 것과 원자가 사라지는 것이
         눈으로 이어진다 — 이것이 시너지의 장면이다. */
      if (st.a.removed < Math.floor(targetA)) {
        const at = detachOne(st.a);
        st.prods.push({ x: A_X0 + at * A_PITCH, y: A_Y0 + st.a.back[at] * A_PITCH - A_PITCH,
                        vx: (rnd() - 0.5) * 0.6, vy: -1.4, life: 1, tag: rnd() < 0.4 });
      }
      if (st.b.removed < Math.floor(targetB)) {
        const at = detachOne(st.b);
        st.prods.push({ x: B_X0 - st.b.back[at] * B_PITCH + B_PITCH, y: B_Y0 + at * B_PITCH,
                        vx: 1.3, vy: -(0.3 + rnd() * 0.5), life: 1, tag: false });
      }

      for (let i = st.prods.length - 1; i >= 0; i--) {
        const q = st.prods[i];
        q.x += q.vx; q.y += q.vy; q.life -= 0.02;
        if (q.life <= 0) st.prods.splice(i, 1);
      }
      for (let i = st.hits.length - 1; i >= 0; i--) {
        st.hits[i].life -= 0.10;
        if (st.hits[i].life <= 0) st.hits.splice(i, 1);
      }
    };

    const draw = () => {
      const st = stRef.current;
      const { profile: prof } = propsRef.current;
      const polymer = prof.polymerThickness > 0.5;

      ctx.fillStyle = DET_C.void;
      ctx.fillRect(0, 0, DET_W, DET_H);

      // 가운데 칸막이
      ctx.strokeStyle = '#2A261C';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(DET_W / 2 + 8, 8); ctx.lineTo(DET_W / 2 + 8, DET_H - 8); ctx.stroke();

      // ── Ⓐ 바닥 : 수평면이 아래로 물러난다 ──
      for (let c = 0; c < A_COLS; c++) {
        const cx = A_X0 + c * A_PITCH;
        for (let d = 0; d <= A_DEPTH; d++) {
          const y = A_Y0 + (st.a.back[c] + d) * A_PITCH;
          if (y > DET_H + A_PITCH) break;
          const shade = Math.pow(Math.max(0, 1 - d / 3.2), 1.4);
          ctx.beginPath();
          ctx.arc(cx, y, DET_R, 0, Math.PI * 2);
          ctx.fillStyle = d === 0 ? DET_C.siCl[st.a.cl[c]] : mix(DET_C.siDeep, DET_C.si, shade);
          ctx.fill();
          if (d === 0 && st.a.cl[c] > 0) {
            // 흡착한 Cl — 껍질이 짙어질수록 많이 붙은 것이다
            ctx.beginPath();
            ctx.arc(cx, y, DET_R + 2.4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(127,200,169,${0.25 + st.a.cl[c] * 0.18})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }
      }

      // ── Ⓑ 측벽 : 수직면이 왼쪽으로 물러난다 ──
      for (let r = 0; r < B_ROWS; r++) {
        const cy = B_Y0 + r * B_PITCH;
        for (let d = 0; d <= B_DEPTH; d++) {
          const x = B_X0 - (st.b.back[r] + d) * B_PITCH;
          if (x < DET_W / 2 + 4) break;
          const shade = Math.pow(Math.max(0, 1 - d / 3.2), 1.4);
          ctx.beginPath();
          ctx.arc(x, cy, DET_R, 0, Math.PI * 2);
          ctx.fillStyle = d === 0 ? DET_C.siCl[st.b.cl[r]] : mix(DET_C.siDeep, DET_C.si, shade);
          ctx.fill();
          if (d === 0 && st.b.cl[r] > 0) {
            ctx.beginPath();
            ctx.arc(x, cy, DET_R + 2.4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(127,200,169,${0.25 + st.b.cl[r] * 0.18})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }
      }
      // 측벽 폴리머 — 라디칼이 닿는 것마저 막는다
      if (polymer) {
        // 행마다 끊어 그린다. 이어 그리면 행 사이를 가로지르는 지그재그가 된다.
        ctx.strokeStyle = 'rgba(226,180,92,0.85)';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        for (let r = 0; r < B_ROWS; r++) {
          const x = B_X0 - st.b.back[r] * B_PITCH + DET_R + 2.8;
          const y = B_Y0 + r * B_PITCH;
          ctx.beginPath();
          ctx.moveTo(x, y - B_PITCH / 2 + 2);
          ctx.lineTo(x, y + B_PITCH / 2 - 2);
          ctx.stroke();
        }
      }

      // ── 날아다니는 종 ──
      for (const p of st.parts) {
        if (p.k === 1) {
          ctx.beginPath();
          ctx.moveTo(p.x - p.vx * 6, p.y - p.vy * 6);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = p.site === 'pass' ? 'rgba(240,196,100,0.30)' : 'rgba(240,196,100,0.55)';
          ctx.lineWidth = 1.1;
          ctx.stroke();
          ctx.fillStyle = DET_C.ion;
          ctx.globalAlpha = p.site === 'pass' ? 0.4 : 1;
          ctx.fillRect(p.x - 2.4, p.y - 2.4, 4.8, 4.8);
          ctx.globalAlpha = 1;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = DET_C.radical;
          ctx.fill();
        }
      }

      for (const h of st.hits) {
        ctx.beginPath();
        ctx.arc(h.x, h.y, (h.ion ? 6 : 4) * (2 - h.life), 0, Math.PI * 2);
        ctx.strokeStyle = h.ion
          ? `rgba(240,196,100,${h.life * 0.8})`
          : `rgba(127,200,169,${h.life * 0.5})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.font = "500 10px ui-monospace, Menlo, monospace";
      ctx.textAlign = 'center';
      for (const q of st.prods) {
        ctx.globalAlpha = Math.max(0, q.life);
        ctx.fillStyle = DET_C.product;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 3, 0, Math.PI * 2);
        ctx.fill();
        if (q.tag && q.life > 0.4) {
          ctx.fillStyle = `rgba(159,216,192,${(q.life - 0.4) * 1.5})`;
          ctx.fillText('SiCl₄↑', q.x, q.y - 8);
        }
        ctx.globalAlpha = 1;
      }
      ctx.textAlign = 'left';
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={DET_W}
      height={DET_H}
      className="eb-inset"
      role="img"
      aria-label={`원자 스케일 상세. 바닥은 이온과 라디칼이 함께 작용해 빠르게 물러나고, 측벽은 라디칼만 닿아 느리게 파인다. 이방도 ${profile.anisotropy.toFixed(2)}`}
    />
  );
}

/* ────────────────────── 런 비교 (최근 3개) ──────────────────────
   조건을 바꿔 가며 돌리다 보면 "2번은 뭘 바꿨더라" 가 된다. 앞 런의 최종 형상이
   화면에서 사라지기 때문이다. 런이 끝날 때마다 단면과 레시피를 한 장씩 남겨
   나란히 놓고 비교할 수 있게 한다.

   새로고침하면 사라진다. 저장소에 남기지 않는다 — 교육용 실습 기록이지 데이터가
   아니고, 브라우저에 쌓아 둘 이유가 없다. */

const MAX_RUNS = 3;

/* 저장된 단면을 펼쳤을 때의 폭. 열 폭에 맞춰 늘리면 한 개만 저장했을 때 패널 전체를
   덮어 버려서 "형상" 이 아니라 벽화가 된다. 화면에서 보던 크기 그대로 고정하고,
   개수가 늘면 옆으로 붙인다 — 나란히 놓여야 비교가 된다. */
const THUMB_W = 232;

/** 저장된 런의 단면. 챔버 그림에서 플라즈마·이온·계기를 뺀 형상만 그린다. */
function ProfileThumb({ run, w = 150, label = true }) {
  const h = Math.round((w * 118) / 200);
  const cx = 100;                       // 200×118 로 그리고 배율만 준다
  const top = 28, filmH = 44, subH = 30;
  const pxPerNm = filmH / Math.max(1, run.filmNm);

  const blanket = run.target === 'PR';
  const half = blanket ? 84 : clamp((run.cd * pxPerNm) / 2, 3, 78);
  const d = clamp(run.filmEtched * pxPerNm, 0, filmH);
  const u = clamp(run.underlayerLoss * pxPerNm, 0, subH - 3);

  const U = blanket ? 0 : run.prof.lateralRatio * d;
  const T = blanket ? 0 : run.prof.taperRatio * d;
  const B = blanket ? 0 : run.prof.bowRatio * d;
  const cr = blanket ? 0 : run.prof.lateralRatio * d * 0.6;

  const hb = halfWidthAt(1, half, U, T, B);
  const t = TARGETS.find((x) => x.id === run.target) || TARGETS[0];

  /* 같은 곡선 함수를 쓰되 좌표계가 다르므로 여기서 직접 만든다.
     cavityPath 는 챔버 좌표(CX/TRENCH_TOP)에 묶여 있다. */
  const cavity = (() => {
    if (d <= 0.4) return '';
    const N = 12;
    const r = Math.max(0, Math.min(cr, d * 0.5, hb * 0.9));
    const uEnd = 1 - r / d;
    const yb = top + d;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const uu = (uEnd * i) / N;
      pts.push([halfWidthAt(uu, half, U, T, B), top + uu * d]);
    }
    const seg = pts.map(([ww, y], i) => `${i === 0 ? 'M' : 'L'}${(cx - ww).toFixed(1)} ${y.toFixed(1)}`);
    const [wEnd, yEnd] = pts[N];
    seg.push(`Q${(cx - hb).toFixed(1)} ${yb.toFixed(1)} ${(cx - hb + r).toFixed(1)} ${yb.toFixed(1)}`);
    seg.push(`L${(cx + hb - r).toFixed(1)} ${yb.toFixed(1)}`);
    seg.push(`Q${(cx + hb).toFixed(1)} ${yb.toFixed(1)} ${(cx + wEnd).toFixed(1)} ${yEnd.toFixed(1)}`);
    for (let i = N; i >= 0; i--) seg.push(`L${(cx + pts[i][0]).toFixed(1)} ${pts[i][1].toFixed(1)}`);
    return `${seg.join(' ')} Z`;
  })();

  return (
    <svg viewBox="0 0 200 118" width={w} height={h} className="eb-thumb" aria-hidden="true">
      <rect x="0" y="0" width="200" height="118" fill="#100E09" />
      <rect x="8" y={top + filmH} width="184" height={subH} fill="#4A505E" />
      <rect x="8" y={top} width="184" height={filmH}
            fill={run.target === 'PR' ? '#7A5A9E' : run.target === 'Si' ? '#8A8F9E' : '#6E8FA8'} />
      {u > 0.3 && (
        <rect x={cx - hb} y={top + filmH} width={hb * 2} height={u} fill="#141209" stroke="#E06C5A" strokeWidth="0.6" />
      )}
      {cavity && <path d={cavity} fill="#141209" stroke="#2A2620" strokeWidth="0.5" />}
      {!blanket && (
        <>
          <rect x="8" y={top - 9} width={cx - half - 8} height="9" fill="#B98A4E" />
          <rect x={cx + half} y={top - 9} width={192 - cx - half} height="9" fill="#B98A4E" />
        </>
      )}
      {/* 탭의 미리보기(52px)에서는 글자가 뭉개진다. 형상만 보이면 된다. */}
      {label && (
        <>
          <text x="10" y={top + filmH - 4} fontSize="9" fill="#C9BFA5"
                fontFamily="ui-monospace, Menlo, monospace">{t.label}</text>
          <text x="192" y="15" fontSize="9.5" fill="#F0C464" textAnchor="end"
                fontFamily="ui-monospace, Menlo, monospace">
            측벽 {Math.round(run.prof.sidewallAngle)}°
          </text>
        </>
      )}
    </svg>
  );
}

/* ──────────────────── 조절값 한 줄 ────────────────────
   다이얼을 버렸다. 42px 짜리 원판은 값을 읽어 주지도 않으면서 자리만 차지했고,
   무엇보다 파워가 하나뿐이라 소스와 바이어스를 나눠 놓을 자리가 없었다.
   대신 트랙 위에 그 모드의 **공정 창**을 띠로 깔았다 — 밖으로 나가도 계산은
   되지만, 표준이 어디인지는 보인다. */
function Slider({ label, unit, value, min, max, step, win, note, onChange, hint, disabled }) {
  const [open, setOpen] = useState(false);
  const at = (v) => `${clamp(((v - min) / (max - min)) * 100, 0, 100)}%`;

  return (
    <div className={`eb-p-row ${disabled ? 'is-off' : ''}`}>
      <div className="eb-p-head">
        <span className="eb-p-label">
          {label}
          {hint && (
            <button
              type="button"
              className="eb-p-why"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={`${label} 설명`}
            >?</button>
          )}
        </span>
        <span className="eb-p-val">{value}<small>{unit}</small></span>
      </div>

      <div className="eb-p-track">
        {win && (
          <span
            className="eb-p-win"
            style={{ left: at(win[0]), width: `calc(${at(win[1])} - ${at(win[0])})` }}
          />
        )}
        <span className="eb-p-fill" style={{ width: at(value) }} />
        <input
          type="range" min={min} max={max} step={step} value={value} disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))} aria-label={label}
        />
      </div>

      <div className="eb-p-scale">
        <span>{min}</span>
        {note && <span className="eb-p-note">{note}</span>}
        <span>{max}</span>
      </div>

      {open && hint && <p className="eb-hint">{hint}</p>}
    </div>
  );
}

/** 공정 모드 — 모드가 장비를 고르고, 장비가 조절 범위를 고른다. */
function ModeBar({ value, onPick }) {
  const m = modeOf(value);
  return (
    <div className="eb-modes-wrap">
      <p className="eb-panel-k">공정 모드</p>
      <div className="eb-modes">
        {MODES.map((x) => (
          <button
            key={x.id}
            type="button"
            className={`eb-mode ${x.id === value ? 'is-on' : ''}`}
            onClick={() => onPick(x.id)}
            aria-pressed={x.id === value}
          >
            <span className="eb-mode-n">{x.name}</span>
            <span className="eb-mode-s">{x.sub}</span>
          </button>
        ))}
      </div>
      <p className="eb-equip">
        <b>{m.equip}</b>
        <span>{m.equipSub} · {m.pressure.min}~{m.pressure.max} mTorr</span>
      </p>
    </div>
  );
}

/* 10 의 거듭제곱을 위첨자로. 1.7×10¹¹ 처럼 읽히게 한다. */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function sci(v) {
  if (!(v > 0) || !Number.isFinite(v)) return '0';
  const e = Math.floor(Math.log10(v));
  const m = v / 10 ** e;
  const exp = String(e).split('').map((c) => (c === '-' ? '⁻' : SUP[Number(c)])).join('');
  return `${m.toFixed(1)}×10${exp}`;
}

/* ──────────────────── 계산 결과 ────────────────────
   이온 플럭스와 이온 에너지는 **넣는 값이 아니다.** 파워와 압력에서 나오는 결과다.
   그래서 이 구역에는 슬라이더가 하나도 없다 — 조절값 구역과 눈으로 갈라 놓는 것이
   이 화면이 가르쳐야 할 첫 번째 사실이다.

   지도는 두 축이 이온 플럭스(가로, 10¹⁰~10¹²)와 이온 에너지(세로, 0~1000 eV)다.
   게이트 식각과 콘택 식각이 이 평면의 정반대 구석에 앉는다 — 게이트는 많이·약하게,
   콘택은 적게·세게. 점은 지금 레시피의 운전점이고, 노브를 돌리면 점이 움직인다. */
const MAP = { x0: 38, y0: 8, w: 200, h: 160 };
const mapX = (density) => MAP.x0 + clamp((Math.log10(Math.max(1, density)) - 10) / 2, 0, 1) * MAP.w;
const mapY = (energy) => MAP.y0 + (1 - clamp(energy / 1000, 0, 1)) * MAP.h;

/** 지도 위 영역 상자. 두 공정의 표준 운전 구간을 옅게 깐다. */
const MAP_ZONES = [
  { id: 'contact', label: '콘택', color: '#E06C5A', d: [1e10, 8e10, 400, 900] },
  { id: 'gate', label: '게이트', color: '#6FBF8E', d: [8e10, 3.2e11, 50, 250] },
];

function Readout({ plasma, modeId }) {
  const px = mapX(plasma.density);
  const py = mapY(plasma.energy);

  const verdict = plasma.ratio < 1
    ? { t: '무충돌 시스 — 이온이 곧게 내리꽂힙니다', c: '#6FBF8E' }
    : plasma.ratio < 5
      ? { t: '충돌 시스 — 입사각이 조금 벌어집니다', c: '#F0C464' }
      : { t: '충돌 시스 — 입사각이 크게 벌어집니다', c: '#E06C5A' };

  return (
    <div className="eb-out">
      <div className="eb-out-head">
        <p className="eb-panel-k">계산 결과</p>
        <span>직접 넣는 값이 아닙니다 — 위 조절값에서 나옵니다</span>
      </div>

      <div className="eb-out-body">
        <svg className="eb-map" viewBox="0 0 252 212" role="img"
             aria-label={`이온 플럭스 ${sci(plasma.density)} cm⁻³, 이온 에너지 ${Math.round(plasma.energy)} eV 운전점`}>
          <rect x={MAP.x0} y={MAP.y0} width={MAP.w} height={MAP.h} fill="#141210" stroke="#332F27" />
          <g stroke="#241F19">
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={`v${f}`} x1={MAP.x0 + f * MAP.w} y1={MAP.y0}
                    x2={MAP.x0 + f * MAP.w} y2={MAP.y0 + MAP.h} />
            ))}
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={`h${f}`} x1={MAP.x0} y1={MAP.y0 + f * MAP.h}
                    x2={MAP.x0 + MAP.w} y2={MAP.y0 + f * MAP.h} />
            ))}
          </g>

          {MAP_ZONES.map((z) => {
            const [d0, d1, e0, e1] = z.d;
            const x = mapX(d0), y = mapY(e1);
            return (
              <g key={z.id}>
                <rect x={x} y={y} width={mapX(d1) - x} height={mapY(e0) - y}
                      fill={z.color} opacity={z.id === modeId ? 0.18 : 0.08} />
                <text x={x + 4} y={y + 13} fontSize="10" fill={z.color}
                      fontFamily="ui-monospace, Menlo, monospace"
                      opacity={z.id === modeId ? 0.95 : 0.5}>{z.label}</text>
              </g>
            );
          })}

          <line x1={px} y1={MAP.y0} x2={px} y2={MAP.y0 + MAP.h}
                stroke="#F0C464" strokeDasharray="3 3" opacity="0.45" />
          <line x1={MAP.x0} y1={py} x2={MAP.x0 + MAP.w} y2={py}
                stroke="#F0C464" strokeDasharray="3 3" opacity="0.45" />
          <circle cx={px} cy={py} r="9" fill="#F0C464" opacity="0.16" />
          <circle cx={px} cy={py} r="4" fill="#F0C464" />

          <text x={MAP.x0} y="184" fontSize="9.5" fill="#6B6353" fontFamily="ui-monospace, Menlo, monospace">10¹⁰</text>
          <text x={MAP.x0 + MAP.w - 26} y="184" fontSize="9.5" fill="#6B6353" fontFamily="ui-monospace, Menlo, monospace">10¹²</text>
          <text x={MAP.x0 + 50} y="200" fontSize="10.5" fill="#948A73" fontFamily="ui-monospace, Menlo, monospace">이온 플럭스</text>
          <text x={MAP.x0 - 6} y={MAP.y0 + MAP.h} fontSize="9.5" fill="#6B6353" textAnchor="end" fontFamily="ui-monospace, Menlo, monospace">0</text>
          <text x={MAP.x0 - 6} y={MAP.y0 + 8} fontSize="9.5" fill="#6B6353" textAnchor="end" fontFamily="ui-monospace, Menlo, monospace">1k</text>
          <text x="12" y="120" fontSize="10.5" fill="#948A73" transform="rotate(-90 12 120)" fontFamily="ui-monospace, Menlo, monospace">이온 에너지</text>
        </svg>

        <dl className="eb-out-vals">
          <div>
            <dt>이온 플럭스</dt>
            <dd>{sci(plasma.density)} cm⁻³</dd>
            <dfn>소스 파워와 압력이 정합니다</dfn>
          </div>
          <div>
            <dt>이온 에너지</dt>
            <dd style={{ color: plasma.energy > 400 ? '#E06C5A' : '#6FBF8E' }}>
              {Math.round(plasma.energy)} eV
            </dd>
            <dfn>바이어스 파워가 정합니다</dfn>
          </div>
          <div>
            <dt>시스 충돌도 s/λ</dt>
            <dd style={{ color: verdict.c }}>{plasma.ratio.toFixed(2)}</dd>
            <dfn>자유행로 {plasma.mfp.toFixed(2)} mm · 시스 {plasma.sheath.toFixed(2)} mm</dfn>
          </div>
        </dl>
      </div>

      <p className="eb-out-foot" style={{ color: verdict.c }}>{verdict.t}</p>
      <div className="eb-out-guide">
        <span>소스↑ · 압력↑ → 점이 <b>오른쪽</b></span>
        <span>바이어스↑ · 압력↓ → 점이 <b>위쪽</b></span>
      </div>
    </div>
  );
}

/** 두 런의 레시피에서 달라진 항목만 골라 낸다. "뭘 바꿨더라" 에 답하는 부분이다. */
function recipeDiff(a, b) {
  if (!a) return [];
  const out = [];
  const push = (k, x, y, unit = '') => { if (x !== y) out.push(`${k} ${x}${unit} → ${y}${unit}`); };
  push('재료', a.target, b.target);
  push('압력', a.pressure, b.pressure, ' mTorr');
  push('소스', a.source, b.source, ' W');
  push('바이어스', a.bias, b.bias, ' W');
  push('모드', modeOf(a.modeId).name, modeOf(b.modeId).name);
  push('시간', a.etchTime, b.etchTime, ' s');
  if (a.target !== 'PR' || b.target !== 'PR') push('CD', a.cd, b.cd, ' nm');
  GASES.forEach((g) => push(g.label, a.gas[g.id], b.gas[g.id], ' sccm'));
  return out;
}

function RunCompare({ runs, open, onToggle, onClear }) {
  if (runs.length === 0) return null;

  return (
    <div className={`eb-cmp ${open ? 'is-open' : ''}`}>
      <button type="button" className="eb-cmp-tab" onClick={onToggle} aria-expanded={open}>
        <span className="eb-cmp-tag">이전 공정</span>
        <span className="eb-cmp-dots">
          {runs.map((r) => <ProfileThumb key={r.id} run={r} w={52} label={false} />)}
        </span>
        <span className="eb-cmp-lbl">
          {open
            ? '닫기'
            : `${runs.length}개 저장됨 — 눌러서 나란히 비교`}
        </span>
      </button>

      {open && (
        <div className="eb-cmp-panel" role="dialog" aria-label="이전 공정 형상 비교">
          <div className="eb-cmp-head">
            <span>이전 공정 형상 — 최근 {MAX_RUNS}개까지 남습니다 (새로고침하면 사라집니다)</span>
            <button type="button" className="eb-cmp-x" onClick={onClear}>모두 지우기</button>
          </div>
          <div className="eb-cmp-grid" data-n={runs.length}>
            {runs.map((r, i) => {
              const diff = recipeDiff(runs[i - 1], r);
              return (
                <article className="eb-cmp-card" key={r.id}>
                  <header>
                    <b>{r.n}번 공정</b>
                    <span>{TARGETS.find((t) => t.id === r.target)?.label} · {r.pressure} mTorr · {r.source}/{r.bias} W · {r.etchTime}s</span>
                  </header>
                  <ProfileThumb run={r} w={THUMB_W} />
                  <dl>
                    <div><dt>측벽</dt><dd>{Math.round(r.prof.sidewallAngle)}°</dd></div>
                    <div><dt>깊이</dt><dd>{Math.round(r.filmEtched + r.underlayerLoss)} nm</dd></div>
                    <div>
                      <dt>{r.remainingFilm > 0.5 ? '잔막' : '하부층'}</dt>
                      <dd>{r.remainingFilm > 0.5
                        ? `${Math.round(r.remainingFilm)} nm`
                        : `−${Math.round(r.underlayerLoss)} nm`}</dd>
                    </div>
                    <div><dt>선택비</dt><dd>{r.sel.toFixed(1)}:1</dd></div>
                  </dl>
                  <p className="eb-cmp-diff">
                    {i === 0
                      ? <span className="is-dim">첫 런</span>
                      : diff.length === 0
                        ? <span className="is-dim">앞 런과 조건이 같습니다</span>
                        : <>앞 런에서 바꾼 것: <b>{diff.join(' · ')}</b></>}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
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

  // 레시피 — 모드가 장비를 고르고, 장비가 조절 범위와 기본값을 고른다.
  const [modeId, setModeId] = useState('gate');
  const mode = modeOf(modeId);
  const D0 = MODES[0];
  const [target, setTarget] = useState(D0.targets[0]);
  const [setPressure_, setSetPressure] = useState(D0.pressure.def);
  const [source, setSource] = useState(D0.source.def);
  const [bias, setBias] = useState(D0.bias.def);
  const [gasFlows, setGasFlows] = useState({ ...D0.gasDef });
  const [etchTime, setEtchTime] = useState(D0.time.def);   // s — 설정 시간이 깊이를 정한다
  const [cd, setCd] = useState(D0.cd.def);                  // nm — 패턴 폭

  const filmNm = mode.filmNm;
  /* 물리 모듈에 넘기는 방전 조건. 숫자 하나가 아니라 소스·바이어스·장비형이다. */
  const discharge = useMemo(
    () => ({ source, bias, type: mode.type }),
    [source, bias, mode.type],
  );

  /* 모드를 바꾸면 조절값이 그 모드의 기본 레시피로 통째로 돌아간다. 범위가 겹치지
     않기 때문이다 — ICP 의 바이어스 120 W 를 CCP 의 300~3000 W 슬라이더에 그대로
     남기면 범위 밖 값이 남는다. */
  const pickMode = useCallback((id) => {
    const m = modeOf(id);
    const d = modeDefaults(m);
    setModeId(id);
    setTarget(d.target);
    setSource(d.source);
    setBias(d.bias);
    setSetPressure(d.pressure);
    /* 진공에 이미 도달해 있으면 챔버 압력도 같이 옮긴다. 설정만 바꾸고 실제
       압력을 두면 챔버 배지가 옛 값을 계속 띄운다. */
    setPressure((cur) => (cur <= ATM_MTORR / 2 ? d.pressure : cur));
    setEtchTime(d.etchTime);
    setCd(d.cd);
    setGasFlows(d.gasFlows);
  }, []);

  // 런 상태
  // 런 상태 — 막을 깎은 양과 하부층을 깎은 양은 다른 값이다. 하나로 묶으면
  // 오버에치를 표시할 수 없다.
  const [filmEtched, setFilmEtched] = useState(0);
  const [underlayerLoss, setUnderlayerLoss] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [punched, setPunched] = useState(false);
  const [oes, setOes] = useState([]);
  const [result, setResult] = useState(null);
  // 지난 런 보관 (최근 MAX_RUNS 개). 새로고침하면 사라진다 — 실습 기록이지 데이터가 아니다.
  const [runs, setRuns] = useState([]);
  const [cmpOpen, setCmpOpen] = useState(false);
  const runSeq = useRef(0);
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
    const underNm = mode.underNm;
    const rate = calculateEtchRate(target, gasFlows, discharge, setPressure_, rng);
    const sel = calculateSelectivity(target, gasFlows, discharge, setPressure_, rng);
    const prof = calculateProfile(target, gasFlows, discharge, setPressure_);
    // 애싱은 전면 식각이라 종횡비가 없다 — ARDE 를 걸면 안 된다.
    const trench = target === 'PR' ? Infinity : cd;
    // 예상 결과는 실행 루프와 **같은 모델**로 뽑는다. 따로 계산하면 언젠가 갈라진다.
    const run = simulateEtchRun({
      rate, seconds: etchTime, filmThickness: filmNm, trenchWidth: trench,
      profile: prof, selectivity: sel,
    });
    return {
      rate, sel, prof, run, trench, filmNm,
      uni: calculateUniformity(setPressure_, discharge, gasFlows),
      /* 이온 플럭스와 이온 에너지는 넣는 값이 아니라 여기서 나오는 값이다. */
      plasma: sheathCollisionality(setPressure_, discharge),
      /* 하부층을 얼마나 남겼는가. 게이트 식각에서 이 한 줄이 선택비의 존재 이유다. */
      underBreach: run.underlayerLoss > underNm,
      underLeft: Math.max(0, underNm - run.underlayerLoss),
      // 가스 조건에 더해 식각률이 사실상 0 인 경우도 etch stop 으로 본다 (원본과 같은 규칙).
      etchStop: prof.etchStop || rate < 15,
    };
  }, [target, gasFlows, discharge, setPressure_, etchTime, cd, filmNm, mode.underNm]);

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
    source > 0 && bias > 0 && preview.rate > 0;

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
      const rate0 = calculateEtchRate(target, gasFlows, discharge, setPressure_);
      const depth = r.film + r.under;
      const ar = preview.trench === Infinity ? 0 : depth / preview.trench;
      const rate = rate0 * calculateArdeFactor(ar, preview.prof.ionShare);
      const perSec = rate / 60;

      r.rateSum += rate;
      r.rateN += 1;
      r.t = Math.min(r.t + dtSec, etchTime);

      if (r.film < filmNm) {
        const need = filmNm - r.film;
        const canDo = perSec * dtSec;
        if (canDo < need) {
          r.film += canDo;
        } else {
          // 이 틱 안에서 막을 뚫는다. 남은 시간은 하부층 쪽으로 넘긴다 —
          // 틱 경계에서 시간이 새면 오버에치가 과소평가된다.
          const left = dtSec - need / perSec;
          r.film = filmNm;
          r.under += (perSec / Math.max(1, preview.sel)) * left;
          if (!r.punched) { r.punched = true; r.punchAt = r.t; }
        }
      } else {
        r.under += (perSec / Math.max(1, preview.sel)) * dtSec;
      }

      // OES: 막이 남아있는 동안 신호 유지, 뚫리면 급락
      const frac = clamp(r.film / filmNm, 0, 1);
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
  }, [phase, target, gasFlows, discharge, setPressure_, etchTime, preview, stop, filmNm]);

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
        remainingFilm: Math.max(0, filmNm - r.film),
        underlayerLoss: r.under,
        punchThroughTime: r.punchAt,
        cd: preview.trench === Infinity ? null : cd,
        /* 리포트는 끝난 런을 설명한다. 현재 상태(벤팅 중이라 압력이 이미 올라가는
           중이다)가 아니라 이 런이 돌던 설정값을 실어야 한다. */
        pressure: setPressure_,
        source, bias, type: mode.type, modeId, filmNm,
        underNm: mode.underNm, underLabel: mode.underLabel, breachMsg: mode.breachMsg,
        target,
      });
      /* 이 런의 최종 형상을 한 장 남긴다. 조건을 바꿔 가며 돌릴 때
         "2번은 뭘 바꿨더라" 에 답할 수 있어야 비교가 된다. */
      runSeq.current += 1;
      setRuns((prev) => [...prev, {
        id: `run-${runSeq.current}`,
        n: runSeq.current,
        target,
        pressure: setPressure_,
        source, bias, type: mode.type, modeId, filmNm, underNm: mode.underNm,
        etchTime,
        cd,
        gas: { ...gasFlows },
        prof: preview.prof,
        filmEtched: r.film,
        remainingFilm: Math.max(0, filmNm - r.film),
        underlayerLoss: r.under,
        sel: preview.sel,
      }].slice(-MAX_RUNS));

      setPhase('VENTING');
    }, 1600);
    return () => clearTimeout(id);
  }, [phase, preview, cd, target, setPressure_, source, bias, mode, modeId, filmNm, etchTime, gasFlows]);

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
        d: `${fmt(result.time, 0)}초로는 ${result.filmNm} nm 를 다 뚫지 못했다. 시간을 늘리거나 식각률을 올려야 한다. 남은 막은 다음 공정에서 그대로 문제가 된다.`,
      });
    } else {
      const over = result.time - (result.punchThroughTime || result.time);
      const breach = result.underlayerLoss > result.underNm;
      lines.push({
        bad: breach,
        t: `관통 ${fmt(result.punchThroughTime, 0)}초 · 오버에치 ${fmt(over, 0)}초`,
        d: `막을 뚫은 뒤 ${fmt(over, 0)}초 동안 ${result.underLabel}이 ${fmt(result.underlayerLoss, 0)} nm 깎였다. 선택비 ${fmt(result.sel, 1)}:1 이 이 손실을 결정했다.`,
      });
      /* 선택비가 왜 중요한 값인지는 하부층 두께 옆에 놓아야 답이 된다.
         "하부층 −7 nm" 만 적으면 좋은 건지 나쁜 건지 알 수가 없다. */
      lines.push({
        bad: breach,
        t: breach
          ? `${result.underLabel} 관통 — ${fmt(result.underlayerLoss - result.underNm, 0)} nm 초과`
          : `${result.underLabel} ${fmt(result.underNm - result.underlayerLoss, 1)} nm 남음`,
        d: breach
          ? `${result.breachMsg} ${result.underLabel}은 ${result.underNm} nm 뿐이다. 오버에치를 줄이거나 선택비를 올려야 한다 — 지금 선택비 ${fmt(result.sel, 1)}:1 로는 ${fmt(result.underNm * result.sel, 0)} nm 만큼의 막을 더 파는 동안만 버틴다.`
          : `${result.underLabel}은 ${result.underNm} nm 뿐인데 ${fmt(result.underlayerLoss, 1)} nm 만 깎였다. 선택비 ${fmt(result.sel, 1)}:1 이 이걸 지켜 준 것이다 — 선택비가 1:1 이었다면 오버에치 ${fmt(over, 0)}초에 ${fmt((result.rate / 60) * over, 0)} nm 가 깎여 진작에 뚫렸다.`,
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
        d: `방향성 없는 라디칼이 측벽을 먹어 마스크 아래가 ${fmt(lateral, 0)} nm 파였다. 패턴 폭이 그만큼 벌어졌다는 뜻이다. ${
          target === 'Si' && gasFlows.CF4 > 0
            ? '가장 큰 원인은 가스다 — 불소는 실리콘을 이온 없이도 깎아서 측벽이 그대로 파인다. 실리콘을 수직으로 세우려면 Cl₂·HBr 로 바꿔야 한다.'
            : '압력을 낮추거나(이온 산란↓) HBr·CHF₃ 로 측벽을 덮으면 줄어든다.'
        }`,
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
        (result.filmEtched + result.underlayerLoss) / result.cd, prof.ionShare
      );
      lines.push({
        bad: ardeEnd < 0.7,
        t: `ARDE — 종료 시점 식각률이 초기의 ${fmt(ardeEnd * 100, 0)}%`,
        d: `CD ${result.cd} nm 에서 종횡비가 ${fmt((result.filmEtched + result.underlayerLoss) / result.cd, 1)} 까지 올라갔다. 방향성 없는 라디칼이 바닥에 닿기 어려워져 깊어질수록 느려진다. 같은 웨이퍼에 넓은 패턴과 좁은 패턴이 함께 있으면 깊이가 달라진다.`,
      });
    }

    /* 물리가 아니라 장비 선택의 문제다. 계산 결과는 멀쩡해 보여도 실제 팹에서는
       이 조합으로 이 CD 를 잡지 않는다 — 그걸 말해 주지 않으면 잘못 배운다. */
    if (result.target === 'Si' && result.cd && result.cd < CCP_CONDUCTOR_CD_FLOOR) {
      const sh = sheathCollisionality(result.pressure,
        { source: result.source, bias: result.bias, type: result.type });
      lines.push({
        bad: true,
        t: `장비 영역 밖 — CD ${result.cd} nm 를 CCP 로 잡고 있다`,
        d: `${result.pressure} mTorr 에서 시스 충돌도 s/λ 가 ${sh.ratio.toFixed(1)} 이다. 이온이 시스를 건너며 그만큼 충돌해 입사각이 벌어진다. CCP 는 압력을 낮춰도 밀도가 같이 떨어져 시스가 두꺼워지므로 이 값을 못 내린다. 0.25 µm 세대에 게이트 식각이 ICP/TCP·2~20 mTorr 로 넘어간 이유다. ※ 이 화면의 프로파일 계산은 그대로 유효하다 — 장비 선택이 어긋났다는 뜻이다.`,
      });
    }

    if (prof.maskDamage) {
      lines.push({
        bad: true,
        t: '마스크 스퍼터 손상',
        d: `Ar ${gasFlows.Ar} sccm · 바이어스 ${bias} W 조건에서 마스크 위 모서리가 깎인다(파세팅). 마스크가 물러나면 패턴 폭이 벌어진다. ※ 침식 속도는 모델에 없고 표시는 정성적이다.`,
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
  }, [result, activeGasTotal, gasFlows.Ar, bias, target]);

  /* 쓸 수 있는 가스는 타깃이 아니라 **모드**가 정한다. 게이트 식각 장비에 불소계를
     흘리지 않고, 콘택 식각 장비에 염소계를 흘리지 않는다 — 챔버가 오염된다. */
  const relevantGases = GASES.filter((g) => mode.gases.includes(g.id));

  /* ────────────────────────── 렌더 ────────────────────────── */

  return (
    <div className="eb-root">
      <style>{EB_CSS}</style>

      {/* 상단 : 장비 헤더 + 인터락 */}
      <header className="eb-top">
        <div className="eb-id">
          <span className="eb-id-name">{mode.model}</span>
          <span className="eb-id-sub">{mode.plate}</span>
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
            source={source}
            bias={bias}
            filmNm={filmNm}
            underNm={mode.underNm}
            underLabel={mode.underLabel}
            filmEtched={filmEtched}
            underlayerLoss={underlayerLoss}
            cd={cd}
            profile={preview.prof}
            target={target}
            glowSeed={tickCount}
            callouts={phase === 'PROCESSING' || phase === 'ENDPOINT' || phase === 'REPORT'}
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
              <span className="eb-g-k">Source / Bias</span>
              <span className="eb-g-v">
                {phase === 'PROCESSING' || phase === 'ENDPOINT' ? `${source}/${bias}` : '0/0'}
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

          {/* 레시피를 만지는 동안 그 결과가 **같이 보여야** 한다. 오른쪽 패널 맨 아래에
              두었더니 1000px 높이의 화면에서 스크롤을 내려야 보였다 — 슬라이더를 잡고
              있는 손과 움직이는 점이 한 화면에 없으면 "돌려 보고 결과를 본다" 가
              성립하지 않는다. 조절값은 오른쪽, 그 결과는 왼쪽 챔버 아래다. */}
          {phase === 'READY' && <Readout plasma={preview.plasma} modeId={modeId} />}

          {/* 프로파일이 왜 그 모양인지는 1000 배 아래에서 정해진다.
              바닥과 측벽에 도달하는 종이 다르다는 것 하나가 이방도를 만든다. */}
          {(phase === 'PROCESSING' || phase === 'ENDPOINT' || phase === 'REPORT') && target !== 'PR' && (
            <div className="eb-inset-wrap">
              <div className="eb-inset-head">
                <span>위 단면의 Ⓐ 바닥 · Ⓑ 측벽 확대 (약 100만 배)</span>
                <span className="eb-inset-a">
                  {preview.prof.hasEtchant ? `이방도 A ${fmt(preview.prof.anisotropy, 2)}` : '이 가스로는 식각되지 않음'}
                </span>
              </div>

              <div className="eb-inset-cols">
                <span className="is-a">Ⓐ 트렌치 바닥 · 이온 + 라디칼</span>
                <span className="is-b">Ⓑ 측벽 · 라디칼만</span>
              </div>

              <SurfaceDetail
                profile={preview.prof}
                filmEtched={filmEtched}
                live={phase === 'PROCESSING'}
              />

              <div className="eb-inset-cols is-foot">
                <span>
                  라디칼이 붙어 결합이 약해진 자리를 이온이 때려 낸다 —
                  <b> −{fmt(filmEtched, 0)} nm</b>
                </span>
                <span>
                  {preview.prof.polymerThickness > 0.5
                    ? '폴리머가 라디칼마저 막는다 — '
                    : '때려 줄 이온이 없다 — '}
                  <b>−{fmt(preview.prof.lateralRatio * filmEtched, 0)} nm</b>
                </span>
              </div>

              <p className="eb-inset-note">
                같은 반응인데 두 자리의 속도가 다르다. 바닥에는 이온이 수직으로 쏟아지고,
                측벽은 이온이 지나쳐 라디칼만 닿는다. 이 두 속도의 비가 곧 이방도다 —
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
              <ModeBar value={modeId} onPick={pickMode} />

              {mode.targets.length > 1 && (
                <div className="eb-targets">
                  {mode.targets.map((id) => {
                    const t = TARGETS.find((x) => x.id === id);
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`eb-target ${target === id ? 'is-on' : ''}`}
                        onClick={() => setTarget(id)}
                      >
                        <span className="eb-target-l">{t.label}</span>
                        <span className="eb-target-d">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="eb-sec-head">
                <p className="eb-panel-k is-on">조절값</p>
                <span>장비에서 직접 넣는 값</span>
              </div>

              <Slider
                label={mode.source.label} unit="W" value={source}
                min={mode.source.min} max={mode.source.max} step={mode.source.step}
                win={mode.source.win} note={`표준 ${mode.source.win[0]}~${mode.source.win[1]}`}
                onChange={setSource}
                hint="플라즈마를 만드는 파워다. 올리면 이온이 더 **많이** 온다 — 식각률이 오른다. 그런데 이온이 더 곧게 오지는 않으므로 이방도는 그대로고, 이온 에너지가 안 오르니 선택비도 깎이지 않는다. 소스와 바이어스를 나눠 놓은 장비에서만 이 조작이 가능하다. CCP 단일 RF 는 전극이 하나라 둘이 같이 움직인다."
              />
              <Slider
                label={mode.bias.label} unit="W" value={bias}
                min={mode.bias.min} max={mode.bias.max} step={mode.bias.step}
                win={mode.bias.win} note={`표준 ${mode.bias.win[0]}~${mode.bias.win[1]}`}
                onChange={setBias}
                hint="웨이퍼에 걸리는 파워다. 시스 전압을 올려 이온이 더 **세게** 때리게 한다 — 이방도가 오르고 프로파일이 선다. 대가가 있다: 하부층과 마스크도 같이 깎이므로 선택비가 떨어지고, 500 W 를 넘으면 물리 스퍼터가 우세해진다. 산화막은 Si–O 결합을 끊어야 해서 수백 eV 가 필요하고, 폴리실리콘은 100 eV 대면 충분하다 — 두 모드의 바이어스 범위가 다른 이유다."
              />
              <Slider
                label="챔버 압력" unit="mTorr" value={setPressure_}
                min={mode.pressure.min} max={mode.pressure.max} step={mode.pressure.step}
                win={mode.pressure.win} note={mode.pressure.note}
                onChange={(v) => { setSetPressure(v); setPressure(v); }}
                hint="낮추면 이온이 시스에서 덜 충돌해 더 수직으로 내리꽂힌다. 다만 압력은 양쪽에 다 걸린다 — 올리면 이온화가 늘어 플럭스는 오르지만, 시스가 충돌해져서 이온 에너지는 떨어진다. 그래서 지도의 점이 오른쪽 아래로 비스듬히 움직인다. CCP 단일 RF 에서는 압력을 낮춰도 밀도가 같이 떨어져 시스가 두꺼워지므로 무충돌 시스를 못 만든다. 그것이 도전막 식각이 ICP 로 넘어간 이유다."
              />
              <Slider
                label="식각 시간" unit="s" value={etchTime}
                min={mode.time.min} max={mode.time.max} step={10}
                win={mode.time.win} note={`관통 ${fmt(estimatePunchTime(preview), 0)}s + 오버에치`}
                onChange={setEtchTime}
                hint="식각은 깊이를 지정하는 공정이 아니라 시간을 지정하는 공정이다. 깊이는 식각률 × 시간의 결과다. 시간이 모자라면 막이 남고(언더에치), 남으면 하부층이 깎인다(오버에치). 실제로는 막을 뚫자마자 멈추지 않고 웨이퍼 전면이 확실히 뚫리도록 10~30% 를 더 준다 — 그 여유를 감당하는 게 선택비다."
              />
              {target !== 'PR' && (
                <Slider
                  label="패턴 CD" unit="nm" value={cd}
                  min={mode.cd.min} max={mode.cd.max} step={mode.cd.step}
                  win={mode.cd.win} note={`종횡비 ${fmt(filmNm / cd, 1)}`}
                  onChange={setCd}
                  hint="패턴이 좁을수록 종횡비(깊이/폭)가 커지고, 방향성 없는 라디칼이 바닥까지 들어가기 어려워져 식각이 느려진다 — ARDE(RIE lag). 같은 레시피·같은 시간이라도 좁은 패턴이 얕게 파이는 이유다. 이온은 수직으로 가속돼 들어가므로 영향이 훨씬 작다."
                />
              )}

              <div className="eb-gas-row">
                <span className="eb-gas-k">가스</span>
                <span className="eb-gas-tot">합 {activeGasTotal} sccm</span>
              </div>
              {relevantGases.map((g) => (
                <Slider
                  key={g.id}
                  label={g.label} unit="sccm" value={gasFlows[g.id]}
                  min={0} max={mode.gasMax} step={G_STEP}
                  win={mode.gasWin[g.id]}
                  note={mode.gasWin[g.id] ? `표준 ${mode.gasWin[g.id][0]}~${mode.gasWin[g.id][1]}` : null}
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
                  <>
                    <p className="eb-note-line">
                      {fmt(preview.run.punchThroughTime, 0)}초에 관통 →
                      남은 {fmt(etchTime - preview.run.punchThroughTime, 0)}초 동안 {mode.underLabel}이
                      {' '}{fmt(preview.run.underlayerLoss, 0)} nm 깎입니다 (오버에치
                      {' '}{fmt(((etchTime - preview.run.punchThroughTime) / Math.max(1, preview.run.punchThroughTime)) * 100, 0)}%).
                    </p>
                    {/* 선택비가 왜 중요한지는 하부층 두께를 옆에 놓아야 답이 된다. */}
                    <p className={preview.underBreach ? 'eb-alarm' : 'eb-note-line'}>
                      {preview.underBreach
                        ? `${mode.underLabel} ${mode.underNm} nm 를 ${fmt(preview.run.underlayerLoss - mode.underNm, 0)} nm 초과 — ${mode.breachMsg}`
                        : `${mode.underLabel} ${mode.underNm} nm 중 ${fmt(preview.underLeft, 1)} nm 가 남습니다. 이 여유를 만드는 것이 선택비 ${fmt(preview.sel, 1)}:1 입니다.`}
                    </p>
                  </>
                )}

                {target !== 'PR' && (
                  <p className="eb-note-line">
                    ARDE — 관통 시점 종횡비 {fmt(filmNm / cd, 1)} 에서 식각률이 초기의
                    {' '}{fmt(calculateArdeFactor(filmNm / cd, preview.prof.ionShare) * 100, 0)}% 로 떨어집니다.
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
                  <b>{punched ? `−${fmt(underlayerLoss, 0)} nm` : `${fmt(filmNm - filmEtched, 0)} nm`}</b></div>
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

      <RunCompare
        runs={runs}
        open={cmpOpen}
        onToggle={() => setCmpOpen((v) => !v)}
        onClear={() => { setRuns([]); setCmpOpen(false); }}
      />

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
.eb-id-sub{font-size:12.5px; color:var(--txt-dim); letter-spacing:.05em;}
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
.eb-lamp-txt{font-family:ui-monospace,Menlo,monospace; font-size:11.5px; letter-spacing:.08em;}

/* 스텝퍼 */
.eb-steps{display:flex; gap:3px; padding:10px 20px; background:var(--panel); border-bottom:1px solid var(--line);}
.eb-step{flex:1; min-width:0;}
.eb-step-bar{display:block; height:3px; border-radius:2px; background:#2A261F;}
.eb-step.is-done .eb-step-bar{background:var(--amber-dim);}
.eb-step.is-now .eb-step-bar{background:var(--amber); box-shadow:0 0 8px rgba(240,196,100,.5);}
.eb-step-txt{display:block; margin-top:5px; font-size:11.5px; letter-spacing:.03em; color:#6B6455; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.eb-step.is-now .eb-step-txt{color:var(--amber);}
.eb-step.is-done .eb-step-txt{color:var(--txt-dim);}

/* 본문 */
.eb-main{flex:1; min-height:0; display:grid; grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);}
@media (max-width:900px){.eb-main{grid-template-columns:1fr; overflow-y:auto;}}

.eb-view{padding:20px; border-right:1px solid var(--line); display:flex; flex-direction:column; gap:14px; min-height:0; overflow-y:auto;}
/* 이 열은 플렉스다. 기본 flex-shrink 를 두면 넘치는 높이를 **줄어들 수 있는 항목**이
   혼자 뒤집어쓴다. 원자 인셋을 추가한 뒤 챔버 단면(.eb-chamber)만 보호가 없어서
   공정 중에 썸네일만큼 눌렸다. 아무것도 줄이지 않고 열이 스크롤되게 한다. */
.eb-view > *{flex:0 0 auto;}
.eb-chamber{width:100%; height:auto; max-height:44vh; display:block;}

.eb-gauges{display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line); border:1px solid var(--line);}
.eb-gauge{background:var(--panel); padding:9px 11px; display:flex; flex-direction:column; gap:3px; min-width:0;}
.eb-g-k{font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--txt-dim);}
.eb-g-v{font-size:17px; color:var(--amber); text-shadow:0 0 12px rgba(240,196,100,.3); white-space:nowrap;}
.eb-g-v small{font-size:11.5px; color:var(--txt-dim); margin-left:3px; text-shadow:none;}


/* ── 공정 모드 ── */
.eb-modes-wrap{display:flex; flex-direction:column; gap:8px;}
.eb-modes{display:flex; border:1px solid var(--line); border-radius:2px; overflow:hidden;}
.eb-mode{flex:1; padding:11px 13px; text-align:left; background:none; border:0;
  border-right:1px solid var(--line); cursor:pointer; color:var(--txt-dim);}
.eb-mode:last-child{border-right:0;}
.eb-mode:hover{background:var(--panel2);}
.eb-mode:focus{outline:none;}
.eb-mode:focus-visible{outline:2px solid var(--amber); outline-offset:-2px;}
.eb-mode.is-on{background:var(--panel2);}
.eb-mode-n{display:block; font-family:ui-monospace,Menlo,monospace; font-size:13.5px; font-weight:700;}
.eb-mode.is-on .eb-mode-n{color:var(--amber);}
.eb-mode-s{display:block; font-size:12px; margin-top:3px; color:var(--txt-dim);}
.eb-equip{margin:0; padding:7px 11px; background:var(--panel); border-left:2px solid var(--amber-dim);
  display:flex; flex-wrap:wrap; align-items:baseline; gap:4px 9px;}
.eb-equip b{font-family:ui-monospace,Menlo,monospace; font-size:12.5px; letter-spacing:.04em;
  color:var(--amber); font-weight:700;}
.eb-equip span{font-size:12px; color:var(--txt-dim);}

/* ── 조절값 한 줄 ── */
.eb-sec-head{display:flex; align-items:baseline; justify-content:space-between; gap:10px;
  padding-bottom:8px; border-bottom:1px solid var(--line); margin-top:4px;}
.eb-sec-head span{font-size:12px; color:#6B6353;}
.eb-panel-k.is-on{color:var(--amber);}
.eb-p-row{display:flex; flex-direction:column;}
.eb-p-row.is-off{opacity:.4; pointer-events:none;}
.eb-p-head{display:flex; justify-content:space-between; align-items:baseline; gap:10px;}
.eb-p-label{font-size:12.5px; letter-spacing:.04em; color:var(--txt); display:flex;
  align-items:center; gap:6px; min-width:0;}
.eb-p-why{width:15px; height:15px; flex:0 0 auto; border-radius:50%; border:1px solid var(--line);
  background:none; color:var(--txt-dim); font-size:10px; line-height:1; cursor:pointer; padding:0;}
.eb-p-why:hover{color:var(--amber); border-color:var(--amber-dim);}
.eb-p-why:focus{outline:none;}
.eb-p-why:focus-visible{outline:2px solid var(--amber); outline-offset:1px;}
.eb-p-val{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace; font-variant-numeric:tabular-nums;
  font-size:18px; color:var(--amber); white-space:nowrap; line-height:1;}
.eb-p-val small{font-size:11.5px; color:var(--txt-dim); margin-left:4px;}
.eb-p-track{position:relative; height:3px; background:#332E25; border-radius:2px; margin:14px 0 0;}
.eb-p-win{position:absolute; top:-3px; height:9px; background:var(--ok); opacity:.14; border-radius:1px;}
.eb-p-fill{position:absolute; left:0; top:0; height:3px; border-radius:2px; background:var(--amber-dim);}
/* 실제 입력은 그 위에 겹친다. 트랙만 투명하게 해서 아래 띠와 채움이 비쳐 보이게 한다. */
.eb-p-track input[type=range]{position:absolute; left:0; top:-10px; width:100%; height:23px; margin:0;}
.eb-p-track input[type=range]::-webkit-slider-runnable-track{background:transparent;}
.eb-p-track input[type=range]::-moz-range-track{background:transparent;}
.eb-p-scale{display:flex; justify-content:space-between; align-items:baseline; gap:10px;
  margin-top:5px; font-family:ui-monospace,Menlo,monospace; font-size:11px; color:#6B6353;}
.eb-p-note{color:var(--txt-dim); text-align:center; min-width:0;}
.eb-gas-row{display:flex; align-items:baseline; justify-content:space-between; gap:10px; margin-top:4px;}
.eb-gas-k{font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--txt-dim); font-weight:600;}
.eb-gas-tot{font-family:ui-monospace,Menlo,monospace; font-size:12px; color:#6B6353;}
.eb-gas-note{margin:0; font-size:12px; line-height:1.65; color:#6B6353;
  border-left:1px solid var(--line); padding-left:10px;}

/* ── 계산 결과 ── */
.eb-out{border:1px dashed #3D3729; background:#191710; border-radius:2px;}
.eb-out-head{display:flex; align-items:baseline; justify-content:space-between; gap:10px;
  padding:10px 14px; border-bottom:1px dashed #3D3729;}
.eb-out-head span{font-size:12px; color:#6B6353; text-align:right;}
.eb-out-body{display:flex; align-items:stretch; gap:0; flex-wrap:wrap;}
.eb-map{flex:0 0 auto; width:252px; height:auto; padding:12px 6px 4px 12px; display:block;}
.eb-out-vals{flex:1; min-width:150px; margin:0; padding:14px 14px 12px 4px;
  display:flex; flex-direction:column; gap:12px; justify-content:center;}
.eb-out-vals > div{display:flex; flex-direction:column; gap:2px; min-width:0;}
.eb-out-vals dt{font-size:11px; letter-spacing:.05em; color:var(--txt-dim);}
.eb-out-vals dd{margin:0; font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  font-variant-numeric:tabular-nums; font-size:16px; color:var(--txt); line-height:1.15;}
.eb-out-vals dfn{font-style:normal; font-size:10.5px; color:#6B6353;}
.eb-out-foot{margin:0; padding:8px 14px; border-top:1px dashed #3D3729;
  font-family:ui-monospace,Menlo,monospace; font-size:12px; letter-spacing:.03em;}
.eb-out-guide{display:flex; flex-wrap:wrap; gap:5px 18px; padding:0 14px 10px;}
.eb-out-guide span{font-size:11.5px; color:#6B6353;}
.eb-out-guide b{color:var(--txt-dim); font-weight:600;}

/* ── 지난 런 비교 ── */
.eb-cmp{position:relative; flex:0 0 auto; border-top:1px solid var(--line); background:var(--panel);}
.eb-cmp-tab{display:flex; align-items:center; gap:12px; width:100%; padding:9px 14px;
  background:none; border:0; cursor:pointer; color:var(--txt-dim);
  font-family:ui-monospace,Menlo,monospace; font-size:12.5px; letter-spacing:.04em;}
.eb-cmp-tab:hover{color:var(--txt); background:var(--panel2);}
.eb-cmp-tab:focus{outline:none;}
.eb-cmp-tab:focus-visible{outline:2px solid var(--amber); outline-offset:-2px;}
.eb-cmp-tag{flex:0 0 auto; color:var(--amber); font-weight:700; letter-spacing:.1em;}
.eb-cmp-dots{display:flex; gap:6px;}
.eb-cmp-dots .eb-thumb{border:1px solid var(--line); border-radius:2px; display:block;}
.eb-cmp-lbl{margin-left:auto; text-align:right;}

.eb-cmp-panel{position:absolute; left:0; right:0; bottom:100%; z-index:40;
  background:var(--panel); border-top:1px solid var(--line); border-bottom:1px solid var(--line);
  box-shadow:0 -14px 34px rgba(0,0,0,.55); max-height:70vh; overflow-y:auto;}
.eb-cmp-head{display:flex; align-items:center; gap:12px; padding:8px 14px;
  border-bottom:1px solid var(--line); font-family:ui-monospace,Menlo,monospace;
  font-size:12px; letter-spacing:.04em; color:var(--txt-dim);}
.eb-cmp-x{margin-left:auto; background:none; border:1px solid var(--line); border-radius:2px;
  color:var(--txt-dim); font:inherit; padding:4px 10px; cursor:pointer;}
.eb-cmp-x:hover{color:var(--txt); border-color:var(--txt-dim);}

/* 카드 폭을 형상 폭에 고정한다. 열을 1fr 로 나누면 저장된 개수에 따라 같은 트렌치가
   커졌다 작아졌다 해서 개수가 다른 두 화면을 눈으로 비교할 수 없다. */
.eb-cmp-grid{display:flex; flex-wrap:wrap; align-items:flex-start; gap:10px; padding:12px 14px;}
.eb-cmp-card{flex:0 0 auto; width:266px; background:var(--panel2);
  border:1px solid var(--line); border-radius:2px; padding:12px 16px;}
.eb-cmp-card header{display:flex; flex-wrap:wrap; align-items:baseline; gap:8px; margin-bottom:8px;}
.eb-cmp-card header b{color:var(--amber); font-family:ui-monospace,Menlo,monospace; font-size:14px;}
.eb-cmp-card header span{font-family:ui-monospace,Menlo,monospace; font-size:11.5px; color:var(--txt-dim);}
.eb-cmp-card .eb-thumb{max-width:100%; height:auto; border:1px solid var(--line); border-radius:2px; display:block;}
.eb-cmp-card dl{display:grid; grid-template-columns:repeat(2,1fr); gap:7px 12px; margin:10px 0 0;}
.eb-cmp-card dt{font-family:ui-monospace,Menlo,monospace; font-size:11px; letter-spacing:.03em; color:var(--txt-dim);}
.eb-cmp-card dd{margin:2px 0 0; font-family:ui-monospace,Menlo,monospace; font-size:13.5px; color:var(--txt);}
.eb-cmp-diff{margin:10px 0 0; font-size:12.5px; line-height:1.6; color:var(--txt-dim);}
.eb-cmp-diff b{color:var(--amber); font-weight:600;}
.eb-cmp-diff .is-dim{opacity:.7;}
.eb-inset-wrap{flex:0 0 auto; border:1px solid var(--line); background:var(--panel); border-radius:2px; overflow:hidden;}
.eb-inset-head{display:flex; flex-wrap:wrap; justify-content:space-between; align-items:baseline; gap:4px 14px; padding:7px 10px; border-bottom:1px solid var(--line); font-family:ui-monospace,Menlo,monospace; font-size:11.5px; letter-spacing:.04em; color:var(--txt-dim);}
.eb-inset-a{color:var(--txt); letter-spacing:0; white-space:nowrap;}
.eb-inset{display:block; width:100%; height:auto; aspect-ratio:640/168; background:#141209;}
.eb-inset-cols{display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:8px 10px 6px; font-size:12.5px; color:var(--txt);}
.eb-inset-cols .is-a{color:#F0C464;}
.eb-inset-cols .is-b{color:#7FC8A9;}
.eb-inset-cols.is-foot{padding:7px 10px 9px; font-size:12px; color:var(--txt-dim); line-height:1.5;}
.eb-inset-cols.is-foot b{color:var(--txt); font-weight:600;}
.eb-inset-note{margin:0; padding:8px 10px 10px; border-top:1px solid var(--line); font-size:12.5px; line-height:1.65; color:var(--txt-dim);}
.eb-oes{border:1px solid var(--line); background:var(--panel); padding:8px 10px;}
.eb-oes svg{width:100%; height:auto; display:block;}
.eb-oes-cap{display:block; margin-top:5px; font-family:ui-monospace,Menlo,monospace; font-size:11px; letter-spacing:.06em; color:var(--txt-dim);}
.eb-oes--idle{color:var(--txt-dim); font-family:ui-monospace,Menlo,monospace; font-size:12px; padding:16px 10px; text-align:center;}

/* 우측 패널 */
.eb-panel{padding:20px; overflow-y:auto; min-height:0; display:flex; flex-direction:column; gap:14px;}
.eb-panel-k{margin:0; font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--txt-dim); font-weight:600;}
.eb-sub-k{margin:6px 0 0; font-size:11.5px; letter-spacing:.11em; text-transform:uppercase; color:var(--amber-dim); font-weight:600;}

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
.eb-note-k{margin:0 0 8px; font-size:11px; letter-spacing:.11em; text-transform:uppercase; color:var(--amber-dim);}
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
.eb-target-d{display:block; font-size:12px; margin-top:2px; color:var(--txt-dim);}

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

.eb-hint{margin:7px 0 0; font-size:12.5px; line-height:1.7; color:var(--txt-dim); border-left:1px solid var(--line); padding-left:10px;}

.eb-preview{border:1px solid var(--line); background:var(--panel); padding:13px; display:flex; flex-direction:column; gap:10px;}
.eb-preview-grid,.eb-run-grid,.eb-report-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
.eb-preview-grid div,.eb-run-grid div,.eb-report-grid div{display:flex; flex-direction:column; gap:2px; min-width:0;}
.eb-preview-grid span,.eb-run-grid span,.eb-report-grid span{font-size:11.5px; letter-spacing:.07em; text-transform:uppercase; color:var(--txt-dim);}
.eb-preview-grid b,.eb-run-grid b,.eb-report-grid b{
  font-family:ui-monospace,Menlo,monospace; font-variant-numeric:tabular-nums;
  font-size:15px; color:var(--amber); font-weight:600; white-space:nowrap;
}
.eb-report-grid b small{font-size:11.5px; color:var(--txt-dim); margin-left:3px; font-weight:400;}
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
