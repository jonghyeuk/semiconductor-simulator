/**
 * 물리 계산 모듈 검증.
 *
 * 두 가지를 한다.
 *
 * 1) 회귀 대조 — 물리 수정 대상이 **아니었던** 함수들은 컴포넌트에서 모듈로 옮기기
 *    이전 코드와 값이 한 자리도 달라지면 안 된다. 아래 baseline 은 추출 이전
 *    컴포넌트 안에 있던 코드를 그대로 복사한 것이다.
 *
 * 2) 변경 보고 — 물리 오류를 고친 함수들은 값이 **의도적으로** 바뀌었다.
 *    화면에 보이는 숫자가 얼마나 움직였는지 대표 입력에서 옛 식과 새 식을 나란히 찍는다.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠ 이 스크립트가 검증하지 **않는** 것
 *
 * 여기의 baseline 은 구현을 그대로 복사한 것이다. 따라서 이 스크립트는
 * "리팩터링으로 값이 안 변했는가" 만 본다. **상수가 물리적으로 맞는지는 전혀
 * 보지 않는다.** 상수가 통째로 틀려 있어도 구현과 baseline 이 같기만 하면 통과한다.
 *
 * 실제로 그 일이 있었다. Deal-Grove 상수가 <111> 값인데 <100> 이라고 적혀 있던
 * 것, 세정 용액 순서가 뒤집혀 있던 것, Si3N4 에 CF4 항이 없던 것 모두 이 게이트를
 * 통과한 채로 배포됐다. 더 나쁜 것은, 그 상수를 고치려 하면 baseline 과 어긋나
 * **게이트가 수정을 막았다는 점**이다.
 *
 * 물리적 타당성은 src/physics/__tests__ 의 "문헌 앵커" 계열 테스트가 본다.
 * 상수를 고칠 때는 여기 baseline 도 회귀 대조에서 변경 보고로 함께 옮겨야 한다.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 실행: node scripts/verify-physics.mjs
 * 회귀 대조에 불일치가 1건이라도 있으면 exit code 1.
 */
import * as ox from '../src/physics/oxidation.js';
import * as dp from '../src/physics/doping.js';
import * as vac from '../src/physics/vacuum.js';
import * as pl from '../src/physics/plasma.js';
import * as et from '../src/physics/etching.js';
import * as li from '../src/physics/lithography.js';
import * as pe from '../src/physics/pecvd.js';
import * as rta from '../src/physics/rta.js';
import * as cl from '../src/physics/cleaning.js';

let compared = 0;
let mismatched = 0;
const failures = [];

function same(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return Object.is(a, b) || (Number.isNaN(a) && Number.isNaN(b));
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(label, expected, actual) {
  compared++;
  if (!same(expected, actual)) {
    mismatched++;
    if (failures.length < 20) {
      failures.push(`${label}\n    baseline=${JSON.stringify(expected)}\n    module  =${JSON.stringify(actual)}`);
    }
  }
}

/** 결정적 난수원 (mulberry32). */
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const range = (from, to, step) => {
  const out = [];
  for (let v = from; v <= to + 1e-12; v += step) out.push(Number(v.toFixed(10)));
  return out;
};

// ═════════════════════ 1) 회귀 대조 ═════════════════════
// 물리 수정 대상이 아니었던 함수들. 추출 이전 코드와 값이 같아야 한다.

// ── 산화: 상대 속도 인자들 + 품질 평가 ──
const baseOrientationRate = (orientation) => {
  const rates = { 100: 1.0, 110: 1.25, 111: 1.68 };
  return rates[orientation] || 1.0;
};
const baseDopingRate = (d) => (d === 0 ? 1.0 : 1.0 + (d / 10) * 2.0);
const baseInitialOxideRate = (t) => (t === 0 ? 1.0 : 1.0 / (1.0 + t / 100));
const baseTempPressureRate = (temp, pressure) => {
  const tempEffect =
    Math.exp(-1.23 / (8.617e-5 * (temp + 273.15))) / Math.exp(-1.23 / (8.617e-5 * (1000 + 273.15)));
  return tempEffect * pressure;
};

for (const o of ['100', '110', '111', '211', 100, 110, 111]) {
  check(`orient(${o})`, baseOrientationRate(o), ox.calculateOrientationRate(o));
}
for (const d of range(0, 20, 0.25)) check(`dopingRate(${d})`, baseDopingRate(d), ox.calculateDopingRate(d));
for (const t of range(0, 500, 5)) check(`initOx(${t})`, baseInitialOxideRate(t), ox.calculateInitialOxideRate(t));
for (const T of range(700, 1250, 5)) {
  for (const p of range(0.5, 5, 0.25)) {
    check(`tempPress(${T},${p})`, baseTempPressureRate(T, p), ox.calculateTempPressureRate(T, p));
  }
}

// ── 확산: 확산계수 / erfc / 확산 프로파일 (시간 > 0 구간) ──
const baseDopantProps = {
  B: { Qd: 3.69, D0: 0.76 },
  P: { Qd: 3.66, D0: 3.85 },
  As: { Qd: 4.08, D0: 0.32 },
  In: { Qd: 3.9, D0: 0.5 },
  Sb: { Qd: 4.0, D0: 0.4 },
};
const baseDiffCoef = (temp, dopant) => {
  const { Qd, D0 } = baseDopantProps[dopant];
  return D0 * Math.exp(-Qd / (8.617e-5 * (temp + 273.15)));
};
const baseErfc = (x) => {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return x >= 0 ? 1 - erf : 1 + erf;
};

for (const x of range(-4, 4, 0.02)) check(`erfc(${x})`, baseErfc(x), dp.erfc(x));

// ── 진공: 터보 속도 / sccm / 펌프 곡선 / 슬라이더 / 유효 속도 / 등급 ──
const baseTurboSpeed = (p) => {
  if (p <= 1e-6) return 300;
  if (p <= 1e-5) return 300;
  if (p <= 1e-4) return 295;
  if (p <= 1e-3) return 280;
  if (p <= 1e-2) return 250;
  if (p <= 1e-1) return 180;
  if (p <= 1) return 80;
  return 20;
};
const basePressureToSlider = (p) =>
  ((Math.log10(p) - Math.log10(0.02)) / (Math.log10(760) - Math.log10(0.02))) * 100;
const baseEffSpeed = (s, c) => (s * c) / (s + c);
const baseVacuumStage = (p) => {
  if (p > 100) return '대기압/초기배기';
  if (p > 1) return '저진공';
  if (p > 1e-3) return '중진공';
  if (p > 1e-9) return '고진공';
  return '초고진공';
};

for (let e = -8; e <= 3; e += 0.1) {
  const p = Math.pow(10, e);
  check(`turbo(${p})`, baseTurboSpeed(p), vac.calculateTurboSpeed(p));
  check(`slider(${p})`, basePressureToSlider(p), vac.pressureToSliderValue(p));
  check(`stage(${p})`, baseVacuumStage(p), vac.getVacuumStage(p));
}
for (const s of range(50, 1000, 25)) {
  for (const c of range(50, 5000, 100)) check(`effS(${s},${c})`, baseEffSpeed(s, c), vac.calculateEffectivePumpingSpeed(s, c));
}

const PUMP_MODELS = [
  { maxSpeed: 300, data: [{ pressure: 0.02, speed: 250 }, { pressure: 1, speed: 300 }, { pressure: 100, speed: 280 }, { pressure: 760, speed: 200 }] },
  { maxSpeed: 600, data: [{ pressure: 0.02, speed: 500 }, { pressure: 1, speed: 600 }, { pressure: 100, speed: 560 }, { pressure: 760, speed: 400 }] },
];
const basePumpingSpeed = (pressure, modelNumber) => {
  const model = PUMP_MODELS[Math.round(modelNumber)];
  if (!model) return 250;
  if (pressure <= 0.02) return model.data[0].speed;
  if (pressure >= 760) return model.data[model.data.length - 1].speed;
  const lp = Math.log10(pressure);
  for (let i = 0; i < model.data.length - 1; i++) {
    const cur = model.data[i], next = model.data[i + 1];
    if (lp >= Math.log10(cur.pressure) && lp <= Math.log10(next.pressure)) {
      const r = (lp - Math.log10(cur.pressure)) / (Math.log10(next.pressure) - Math.log10(cur.pressure));
      return cur.speed + (next.speed - cur.speed) * r;
    }
  }
  return model.maxSpeed / 2;
};
for (let e = -3; e <= 3; e += 0.05) {
  const p = Math.pow(10, e);
  for (const m of [0, 1, 5]) check(`pumpSpeed(${p},${m})`, basePumpingSpeed(p, m), vac.calculatePumpingSpeed(p, PUMP_MODELS, m));
}

// ── 플라즈마: Paschen / Townsend / 이온화도 (에너지 > 0 구간) ──
const baseIonization = (p, E) => {
  const pf = Math.exp(-Math.pow((p - 3.0) / 2, 2));
  return pf * (E / (E + 50)) * 0.0018;
};
const baseProb = (p, E) => {
  const pf = Math.exp(-Math.pow((p - 3.0) / 2, 2));
  return pf * (E / (E + 50)) * 100;
};
const baseTownsend = (pd) => {
  let alpha;
  if (pd < 0.5) alpha = pd * 20;
  else if (pd <= 2.0) alpha = 10 + (pd - 0.5) * 20;
  else alpha = 40 * Math.exp(-(pd - 2) / 3);
  const isOptimal = pd >= 0.7 && pd <= 1.5;
  return { alpha, isOptimal, efficiency: isOptimal ? '최적' : pd < 0.7 ? '부족' : '과다' };
};
const basePaschen = (p, d, gasType) => {
  const pd = p * d;
  if (pd < 0.1 || pd > 100) return null;
  // 왼쪽 점근선 아래는 파셴 법칙에 해가 없어 null 이다. 이 baseline 은 보간 로직을
  // 검증하는 용도이므로 같은 규칙을 그대로 반영한다 (상수 검증은 문헌 앵커 테스트 몫).
  const leftLimit = pl.PASCHEN_LEFT_LIMIT[gasType] ?? pl.PASCHEN_LEFT_LIMIT.argon;
  if (pd < leftLimit) return null;
  const data = pl.PASCHEN_TABLE[gasType] || pl.PASCHEN_TABLE.argon;
  for (let i = 0; i < data.length - 1; i++) {
    if (pd >= data[i].pd && pd <= data[i + 1].pd) {
      const r = (pd - data[i].pd) / (data[i + 1].pd - data[i].pd);
      return data[i].voltage + r * (data[i + 1].voltage - data[i].voltage);
    }
  }
  return data[data.length - 1].voltage;
};

for (const p of range(0.1, 10, 0.1)) {
  for (const E of range(10, 500, 10)) {
    check(`ioniz(${p},${E})`, baseIonization(p, E), pl.calculateBasicIonizationDegree(p, E));
    check(`prob(${p},${E})`, baseProb(p, E), pl.calculateBasicPlasmaGenerationProbability(p, E));
  }
}
for (const g of ['argon', 'air', 'helium', 'nitrogen', 'neon', 'unknown']) {
  for (const pd of range(0.05, 120, 0.25)) {
    check(`paschen(${g},${pd})`, basePaschen(pd, 1.0, g), pl.calculateBreakdownVoltage(pd, 1.0, g));
    check(`townsend(${pd})`, baseTownsend(pd), pl.getTownsendInfo(pd));
  }
}

// ── 식각: 선택비 / 균일도 / 보조 인자 ──
const baseSelectivity = (target, gasFlow, power, pressure) => {
  let sel = 5;
  switch (target) {
    case 'Si':
      sel = 8 + (gasFlow.HBr / 10) * 8 - Math.max(0, (gasFlow.Cl2 - 50) * 0.35) - Math.max(0, (gasFlow.Ar - 80) * 0.25);
      break;
    case 'SiO2':
      sel = 5 + (gasFlow.CHF3 / 10) * 4 - Math.max(0, (gasFlow.CF4 - 30) * 0.3) - Math.max(0, (gasFlow.Ar - 70) * 0.25);
      break;
    case 'Si3N4':
      sel = 5 + (gasFlow.CHF3 / 10) * 3 - Math.max(0, (gasFlow.O2 - 15) * 0.5);
      break;
    case 'PR': sel = 30 + Math.random() * 5; break;
    default: sel = 5 + Math.random() * 5;
  }
  sel -= power > 500 ? (power - 500) / 150 : 0;
  sel -= pressure < 40 ? (40 - pressure) / 20 : 0;
  return Math.max(1, sel);
};
const baseUniformity = (pressure, power, gasFlow) => {
  const pe2 = Math.max(0, 100 - Math.abs(pressure - 100) / 1.5);
  const pw = Math.max(0, 100 - Math.abs(power - 300) / 5);
  let u = (pe2 + pw) / 2;
  if (gasFlow) {
    const total = Object.values(gasFlow).reduce((a, b) => a + b, 0);
    if (total > 350) u -= (total - 350) / 6;
  }
  return Math.max(40, Math.min(100, u));
};

const realRandom = Math.random;
let seed = 1;
for (const m of ['Si', 'SiO2', 'Si3N4', 'PR', 'W']) {
  for (const power of range(50, 1200, 50)) {
    for (const pressure of range(5, 300, 15)) {
      for (const gf of [
        { Cl2: 50, HBr: 20, CF4: 40, CHF3: 30, O2: 10, Ar: 60 },
        { Cl2: 80, HBr: 60, CF4: 20, CHF3: 60, O2: 30, Ar: 120 },
        { Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0 },
      ]) {
        seed++;
        Math.random = makeRng(seed);
        const expSel = baseSelectivity(m, gf, power, pressure);
        Math.random = realRandom;
        check(`selectivity(${m},${power},${pressure},${seed})`, expSel, et.calculateSelectivity(m, gf, power, pressure, makeRng(seed)));
        check(`uniformity(${power},${pressure})`, baseUniformity(pressure, power, gf), et.calculateUniformity(pressure, power, gf));
      }
    }
  }
}
for (const p of range(0, 300, 5)) check(`pEff(${p})`, Math.min(2.0, 0.5 + p / 100), et.calculatePressureEffect(p));
for (const p of range(0, 1200, 25)) check(`powEff(${p})`, Math.min(3.0, 0.5 + p / 200), et.calculatePowerEffect(p));
for (const r of range(0, 200, 2)) check(`gasEff(${r})`, Math.min(2.0, 0.8 + r / 50), et.calculateGasRatioEffect(r));

// ── 리소: 균일도 / 해상도 / 결함 밀도 (두께 외 항목) ──
const baseSpinCoatUniformity = (pp) => {
  const { step1_rpm, step1_time, step2_rpm, step2_time, step3_rpm, step3_time } = pp;
  let u = 99;
  if (step1_rpm >= 400 && step1_rpm <= 600 && step1_time >= 4) u += 0;
  else {
    if (step1_rpm < 300) u -= 8;
    else if (step1_rpm > 800) u -= 6;
    else u -= 3;
    if (step1_time < 4) u -= 4;
  }
  if (step2_rpm >= 2500 && step2_rpm <= 3500 && step2_time >= 20) u += 0;
  else {
    if (step2_rpm < 1500) u -= 15;
    else if (step2_rpm < 2000) u -= 8;
    else if (step2_rpm > 5000) u -= 12;
    else if (step2_rpm > 4500) u -= 6;
    else u -= 2;
    if (step2_time < 15) u -= 5;
    else if (step2_time > 50) u -= 3;
  }
  if (step3_rpm === 0 && step3_time >= 2) u += 0;
  else {
    if (step3_rpm > 0) u -= 2;
    if (step3_time < 2) u -= 1;
  }
  return Math.min(99.5, Math.max(70, u));
};
for (const r1 of [200, 500, 900]) {
  for (const t1 of [2, 5]) {
    for (const r2 of range(1000, 6000, 250)) {
      for (const t2 of [10, 25, 60]) {
        for (const r3 of [0, 500]) {
          for (const t3 of [1, 3]) {
            const pp = { step1_rpm: r1, step1_time: t1, step2_rpm: r2, step2_time: t2, step3_rpm: r3, step3_time: t3 };
            const expectedU = baseSpinCoatUniformity(pp);
            const actual = li.calculateSpinCoatResults(pp, makeRng(++seed));
            check(`spinUniformity(${r1},${t1},${r2},${t2},${r3},${t3})`, expectedU, actual.uniformity);
            check(`spinDefect(${r1},${t1},${r2},${t2},${r3},${t3})`, Math.max(0.1, (100 - expectedU) * 0.15), actual.defectDensity);
          }
        }
      }
    }
  }
}

// ── PECVD: SiNx 하한 밖 구간 제외한 전부 ──
const baseN = (r) => {
  if (r < 10) return 1.55 - (r - 5) * 0.012;
  if (r < 14) return 1.49 - (r - 10) * 0.0075;
  if (r <= 18) return 1.46 - (r - 14) * 0.003;
  return 1.448 - (r - 18) * 0.001;
};
// SiO2 굴절률의 18:1 초과 구간은 기울기를 세워 값이 의도적으로 바뀌었다.
const baseSiNxN = (r) => {
  if (r < 5) return 2.3 - (r - 2) * 0.06;
  if (r < 10) return 2.12 - (r - 5) * 0.024;
  return 2.0 - (r - 10) * 0.03;
};
const baseDB = (d) => {
  if (d < 3) return 50 - d * 5;
  if (d < 10) return 35 - (d - 3) * 2.5;
  if (d < 20) return 17.5 - (d - 10) * 1.0;
  return Math.max(3, 7.5 - (d - 20) * 0.3);
};
const baseASiH = (d) => {
  if (d < 5) return 15 - d * 0.4;
  if (d < 15) return 13 - (d - 5) * 0.2;
  return Math.max(8, 11 - (d - 15) * 0.1);
};
for (const r of range(0, 40, 0.1)) {
  // SiO2 굴절률은 18:1 이하 구간만 회귀 대조 대상이다. 그 위는 O-rich 끝에서
  // 목표 톨러런스를 통과하던 문제 때문에 기울기를 세워 값이 의도적으로 바뀌었다.
  if (r <= 18) check(`n(${r})`, baseN(r), pe.calculateRefractiveIndex(r));
  check(`nSi(${r})`, Math.min(1.6, 0.6 + r * 0.07), pe.calculateNSiRatio(r));
  check(`db(${r})`, baseDB(r), pe.calculateDanglingBondDensity(r));
  check(`aSiH(${r})`, baseASiH(r), pe.calculateaSiHContent(r));
  // SiNx 굴절률은 물리 오류를 고쳐 값이 의도적으로 바뀌었다 (굴절률과 N/Si 가
  // 서로 다른 화학량론 지점을 가리키던 문제). 회귀 대조에서 빼고 변경 보고로 옮겼다.
}
for (const T of range(100, 600, 2)) {
  check(`H(${T})`, Math.max(5, 35 - T * 0.07), pe.calculateHydrogenContent(T));
  check(`dens(${T})`, Math.min(100, 60 + T * 0.1), pe.calculateFilmDensity(T));
}

// ── RTA: 존 설정 온도 + 온도 프로파일의 램프업/soak 구간 ──
const baseZoneSetpoints = (gsp, lampPower) =>
  lampPower.map((_, idx) => {
    const pf = lampPower[idx] / 100;
    const offset = idx === 0 ? 0 : idx < 3 ? 2 : idx < 5 ? 5 : 8;
    return Math.max(25, gsp - offset + pf * 10);
  });
// 존 설정 온도는 물리 오류를 고쳐 값이 의도적으로 바뀌었다 (가장자리 보상 방향
// 반전 + 램프 출력이 설정값을 밀어 올리던 순환 구조 제거). 변경 보고로 옮겼다.
const baseRampAndSoak = (time, targetTemp, rampRate, processTime) => {
  const gas = 10;
  const up = (targetTemp - 25) / rampRate;
  if (time <= gas) return 25;
  if (time <= gas + up) return 25 + rampRate * (time - gas);
  if (time <= gas + up + processTime) return targetTemp;
  return null; // 냉각 구간은 의도적으로 바뀌었으므로 제외
};
for (const target of [400, 700, 1000, 1100]) {
  for (const ramp of [10, 50, 100, 200]) {
    for (const pt of [5, 30, 60]) {
      for (const t of range(0, 200, 0.5)) {
        const expected = baseRampAndSoak(t, target, ramp, pt);
        if (expected !== null) {
          check(`rtaT(${target},${ramp},${pt},${t})`, expected, rta.calculateTempProfile(t, { targetTemp: target, rampRate: ramp, processTime: pt }));
        }
      }
    }
  }
}

// ── 세정: 하한 clamp 가 걸리지 않는 정상 범위 ──
const baseCleaning = (method, params) => {
  switch (method) {
    case 'wet': {
      const tf = (params.temperature - 25) / 75;
      const cf = params.concentration / 10;
      const timef = Math.min(params.time / 15, 1);
      const sf = params.solution === 'BOE' ? 1.2 : params.solution === 'SC1' ? 0.3 : params.solution === 'SC2' ? 0.2 : 0.8;
      return Math.min(98, 20 + tf * 25 + cf * 30 + timef * 20 + sf * 15);
    }
    case 'dry': {
      return Math.min(85, 35 + (params.power / 500) * 30 + ((0.5 - params.pressure) / 0.4) * 20);
    }
    case 'ultrasonic': {
      const ff = Math.abs(params.frequency - 40) / 40;
      return Math.min(60, 30 + (1 - ff) * 15 + (params.power / 150) * 15);
    }
    default: return 0;
  }
};
// 습식 세정은 물리 오류를 고쳐 값이 의도적으로 바뀌었다 (용액 간 순서 반전).
// 회귀 대조 대상에서 빼고 아래 '변경 보고' 로 옮겼다.
for (const power of range(0, 1000, 25)) {
  for (const pressure of range(0, 0.5, 0.05)) {
    const p = { power, pressure };
    check(`clean(dry,${power},${pressure})`, baseCleaning('dry', p), cl.calculateOxideRemovalEfficiency('dry', p));
  }
  for (const freq of range(10, 80, 5)) {
    const p = { power, frequency: freq };
    check(`clean(us,${power},${freq})`, baseCleaning('ultrasonic', p), cl.calculateOxideRemovalEfficiency('ultrasonic', p));
  }
}

// ═════════════════════ 2) 변경 보고 ═════════════════════
// 물리 오류를 고친 함수들. 값이 의도적으로 바뀌었으므로 변화량을 보여 준다.

const oldOxide = (temp, time, atm, flow = 100) => {
  const tempK = temp + 273.15;
  let B, A;
  if (atm === 'dry') {
    B = 3.0e7 * Math.exp(-1.23 / (8.617e-5 * tempK));
    A = 165 * Math.exp(-2.0 / (8.617e-5 * tempK));
  } else {
    B = 7.7e7 * Math.exp(-0.78 / (8.617e-5 * tempK));
    A = 226 * Math.exp(-2.0 / (8.617e-5 * tempK));
  }
  const th = ((-A + Math.sqrt(A * A + 4 * B * (time / 60))) / 2) * (0.5 + (flow / 100) * 0.5);
  return Math.max(0, Math.min(th, 1000));
};
const oldImplantRp = (energy, dopant) => {
  const masses = { B: 10.8, P: 31.0, As: 74.9, In: 114.8, Sb: 121.8 };
  const zs = { B: 5, P: 15, As: 33, In: 49, Sb: 51 };
  const m = masses[dopant], Z1 = zs[dopant];
  const eps = (32.5 * m * energy) / (Z1 * 14 * (m + 28.1) * (Math.pow(Z1, 0.23) + Math.pow(14, 0.23)));
  return Math.max((m / 28.1) * Math.pow(eps, 0.8) * 100, 1);
};
// 예전 식. S 는 펌프 모델 곡선 단위(m³/h)로 들어왔다.
const oldPumpTime = (V, Pi, Pf, S) => {
  if (Pf <= 0.02) Pf = 0.02;
  if (Pi <= Pf) return 0;
  return (V * Math.log(Pi / Pf)) / ((S * 60) / 1000);
};

// 펌프 모델 곡선 (m³/h). 실제 컴포넌트의 pumpModels 와 같은 형태.
const PUMP_CURVE = (max) => ({
  maxSpeed: max,
  data: [
    [0.02, max / 18], [0.05, max / 12], [0.1, max / 7.2], [0.2, max / 4.5],
    [0.5, max / 2.57], [1.0, max / 1.64], [2.0, max / 1.24], [3.0, max / 1.09],
    [5.0, max], [7.0, max * 0.989], [10, max * 0.956], [15, max * 0.9],
    [25, max * 0.822], [50, max * 0.667], [100, max * 0.5], [200, max * 0.361],
    [300, max * 0.278], [400, max * 0.222], [500, max * 0.194], [600, max * 0.167],
    [700, max * 0.15], [760, max * 0.139],
  ].map(([pressure, speed]) => ({ pressure, speed })),
});
const UI_MODELS = { 1: PUMP_CURVE(900), 2: PUMP_CURVE(1800), 3: PUMP_CURVE(3600), 4: PUMP_CURVE(7200) };
const oldConductance = (D, L) => ((3.27e-2 * Math.pow(D, 4)) / L) * 1000;
const oldReflected = (Z, P) => P * Math.pow(Math.abs(Z - 50) / 50, 2);
const oldSpinThickness = (rpm) => {
  if (rpm < 2000) return 1000 + (2000 - rpm) * 0.1;
  if (rpm > 4000) return 1000 - (rpm - 4000) * 0.05;
  return 1000;
};

// 습식 세정 (수정 전): 용액 계수가 가산이고 온도가 절대값이었다.
const oldCleaningWet = (params) => {
  const tempFactor = (params.temperature - 25) / 75;
  const concFactor = params.concentration / 10;
  const timeFactor = Math.min(params.time / 15, 1);
  const sf =
    params.solution === 'BOE' ? 1.2 : params.solution === 'SC1' ? 0.3 : params.solution === 'SC2' ? 0.2 : 0.8;
  return Math.max(0, Math.min(98, 20 + tempFactor * 25 + concFactor * 30 + timeFactor * 20 + sf * 15));
};

const rows = [];
const pct = (o, n) => (o === 0 ? '—' : `${(((n - o) / o) * 100).toFixed(0)}%`);
// 이방도처럼 0~1 스케일인 값은 소수 첫째 자리로 끊으면 변화가 안 보인다.
const fx = (v) => (typeof v !== 'number' ? v : Math.abs(v) < 10 ? v.toFixed(3) : v.toFixed(1));
const push = (item, cond, o, n, unit) =>
  rows.push([item, cond, fx(o), fx(n), unit, pct(o, n)]);

// ⑪ 습식 세정 — 각 용액을 권장 온도로 돌렸을 때의 산화막 제거율.
// 수정 전에는 BOE 가 꼴찌였다 (SPM 95.3 > SC1 69.5 > SC2 68.0 > BOE 66.3).
for (const [sol, T] of [['BOE', 25], ['SC1', 75], ['SC2', 75], ['SPM', 130]]) {
  const p = { temperature: T, concentration: 5, time: 10, solution: sol };
  push('⑪ 세정 제거율', `${sol} ${T}°C 농도5 10분`, oldCleaningWet(p), cl.calculateOxideRemovalEfficiency('wet', p), '%');
}

// ⑭ RTA 존 설정 온도 — 가장자리 보상 방향이 반대였고, 출력이 설정값을 밀어 올렸다.
{
  const lp = [100, 95, 95, 90, 90, 85];
  const before = baseZoneSetpoints(1000, lp);
  const after = rta.computeZoneSetpoints(1000, lp);
  for (const idx of [0, 2, 5]) {
    push('⑭ 존 설정온도', `목표1000 Zone${idx + 1}`, before[idx], after[idx], '°C');
  }
}

// ⑮ RTA 냉각 — 램프업 속도에 비례시키던 것을 복사 방열 기준 고정값으로.
for (const rr of [25, 100, 300]) {
  const oldDown = (1000 - 25) / (rr * 0.3);
  push('⑮ 냉각 소요', `1000°C 램프${rr}`, oldDown, 975 / 40, 's');
}

// ⑬ SiO2 굴절률 (O-rich 구간) — 슬라이더 최대 25:1 이 "성공" 으로 판정되던 문제.
for (const r of [20, 22, 25]) {
  push('⑬ SiO2 굴절률', `N2O/SiH4 ${r}`, baseN(r), pe.calculateRefractiveIndex(r), '');
}

// ⑫ SiNx 굴절률 — 굴절률을 N/Si 에서 직접 유도하도록 바꿨다.
// 수정 전에는 n = 2.0 이 비율 10, N/Si = 1.333 이 비율 10.47 로 어긋나 있었고
// UI 는 그와 무관하게 8:1 을 화학양론이라고 표시했다.
for (const r of [2, 5, 8, 10.48, 12]) {
  push('⑫ SiNx 굴절률', `NH3/SiH4 ${r}`, baseSiNxN(r), pe.calculateSiNxRefractiveIndex(r), '');
}

/* ⑯ 이방도 — 단면 프로파일 형상.
   두 번 고쳤다. 두 번째 수정이 더 중요하다.

   (2차) 자발 반응성이 빠져 있었다.
   측벽에는 이온이 거의 닿지 않으므로, 측벽이 깎이려면 라디칼이 **혼자** 반응해야 한다.
   염소는 상온에서 실리콘을 저절로 깎지 못하고 불소는 깎는다 — 게이트 식각이 Cl2/HBr 를
   쓰는 첫 번째 이유이고, SF6/CF4 로 실리콘을 깎으면 등방이 되는 이유다. 이 사실이
   모델에 없어서, Cl2/HBr 게이트 프리셋이 500 nm 를 파면 한쪽에 150 nm 언더컷이 나는
   것으로 계산됐다 (실제 CD 손실은 수 nm 수준).
     측면/수직 = (1 − 폴리머 피복) × S ÷ (이온 비중 + (1 − 이온 비중) × S)
   또 이온이 하나도 없는데 폴리머만으로 A 가 0.86 까지 올라가던 것도 함께 고쳤다.
   폴리머는 스스로 방향을 만들지 못한다.

   (1차) 예전 식은 EtchingSimulator.js 안에 인라인으로 있던 선형 합이다.
     A = 0.25 + 0.005·(Ar + W/25) + 0.003·(CHF3 + HBr/2) − 0.005·max(0, p−30)
   압력 항의 계수가 커서, 이 시뮬레이터가 스스로 "이상적인 조건" 이라고 알려 주는
   프리셋 3 종이 전부 A ≈ 0.4 (측면이 수직의 60% 속도) 로 나왔다. 그림을 개구부 대비
   픽셀로만 그리던 동안에는 이 모순이 드러나지 않았는데, 프로파일을 A 의 정의
   (A = 1 − 수평/수직) 대로 그리기 시작하니 "이상적" 이라 적힌 조건이 뭉개진 그릇으로
   그려졌다. 이 값은 이제 두 화면이 공유한다. */
const oldAnisotropy = (gas, w, p) => {
  const ion = (gas.Ar || 0) + w / 25;
  const poly = (gas.CHF3 || 0) + (gas.HBr || 0) * 0.5;
  const a = 0.25 + 0.005 * ion + 0.003 * poly - 0.005 * Math.max(0, p - 30);
  return Math.max(0.05, Math.min(1, a));
};
const G16 = (o) => ({ Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0, ...o });
for (const [name, tgt, gas, w, p] of [
  ['Si 프리셋 100mT', 'Si', { Cl2: 30, HBr: 15, Ar: 78 }, 300, 100],
  ['SiO2 프리셋 100mT', 'SiO2', { CF4: 25, CHF3: 30, Ar: 65 }, 400, 100],
  ['Si3N4 프리셋 100mT', 'Si3N4', { CHF3: 25, O2: 10, Ar: 70 }, 400, 100],
  ['저압 30mT HBr30', 'Si', { Cl2: 30, HBr: 30, Ar: 75 }, 300, 30],
  ['고압 200mT Ar0', 'Si', { Cl2: 30 }, 300, 200],
  ['Si 를 CF4 로(불소계)', 'Si', { CF4: 50, Ar: 20 }, 300, 50],
  ['이온 0 · 폴리머만', 'Si', { Cl2: 30, HBr: 90 }, 0, 30],
]) {
  push('⑯ 이방도', name, oldAnisotropy(G16(gas), w, p), et.calculateProfile(tgt, G16(gas), w, p).anisotropy, '');
}

push('① 산화 두께', 'dry 1000°C 60분', oldOxide(1000, 60, 'dry'), ox.calculateOxideGrowth(1000, 60, 'dry'), 'nm');
push('① 산화 두께', 'dry 1100°C 60분', oldOxide(1100, 60, 'dry'), ox.calculateOxideGrowth(1100, 60, 'dry'), 'nm');
push('① 산화 두께', 'wet 1000°C 60분', oldOxide(1000, 60, 'wet'), ox.calculateOxideGrowth(1000, 60, 'wet'), 'nm');
push('① 산화 두께', 'wet 1100°C 120분', oldOxide(1100, 120, 'wet'), ox.calculateOxideGrowth(1100, 120, 'wet'), 'nm');
push('② 이온주입 Rp', 'B 50 keV', oldImplantRp(50, 'B'), dp.calculateImplantParams(50, 'B').Rp * 1000, 'nm');
push('② 이온주입 Rp', 'P 50 keV', oldImplantRp(50, 'P'), dp.calculateImplantParams(50, 'P').Rp * 1000, 'nm');
push('② 이온주입 Rp', 'As 50 keV', oldImplantRp(50, 'As'), dp.calculateImplantParams(50, 'As').Rp * 1000, 'nm');
push('② 이온주입 Rp', 'As 30 keV (S/D)', oldImplantRp(30, 'As'), dp.calculateImplantParams(30, 'As').Rp * 1000, 'nm');
// 배기 시간은 분 단위로 재면 전부 0.0 으로 뭉개져서 초로 보고한다.
push('③ 배기 시간', 'V=100L 모델2 760→1', oldPumpTime(100, 760, 1, 1800) * 60, vac.calculatePumpingTimeFromCurve(100, 760, 1, UI_MODELS, 2) * 60, '초');
push('③ 배기 시간', 'V=1000L 모델1 760→1', oldPumpTime(1000, 760, 1, 900) * 60, vac.calculatePumpingTimeFromCurve(1000, 760, 1, UI_MODELS, 1) * 60, '초');
push('③ 배기 시간', 'V=10L 모델4 760→1', oldPumpTime(10, 760, 1, 7200) * 60, vac.calculatePumpingTimeFromCurve(10, 760, 1, UI_MODELS, 4) * 60, '초');
push('⑧ sccm 환산', '100 sccm', 100 * 0.0095, vac.convertSccmToTorrLs(100), 'Torr·L/s');
push('⑨ 확산계수 D', 'B 1000°C', baseDiffCoef(1000, 'B') * 1e15, dp.calculateDiffusionCoefficient(1000, 'B') * 1e15, '1e-15');
push('⑨ 확산계수 D', 'P 1000°C', baseDiffCoef(1000, 'P') * 1e15, dp.calculateDiffusionCoefficient(1000, 'P') * 1e15, '1e-15');
push('⑨ 확산계수 D', 'As 1000°C', baseDiffCoef(1000, 'As') * 1e15, dp.calculateDiffusionCoefficient(1000, 'As') * 1e15, '1e-15');
push('④ Conductance', 'D=10cm L=100cm', oldConductance(10, 100), vac.calculateConductance(10, 100, 'straight'), 'L/s');
push('④ Conductance', 'D=20cm L=100cm', oldConductance(20, 100), vac.calculateConductance(20, 100, 'straight'), 'L/s');
push('⑤ 반사 전력', 'Z=100Ω, 1000W', oldReflected(100, 1000), pl.calculateReflectedPower(100, 1000), 'W');
push('⑤ 반사 전력', 'Z=150Ω, 1000W', oldReflected(150, 1000), pl.calculateReflectedPower(150, 1000), 'W');
push('⑤ 반사 전력', 'Z=200Ω, 1000W', oldReflected(200, 1000), pl.calculateReflectedPower(200, 1000), 'W');
push('⑦ PR 두께', '2000 rpm', oldSpinThickness(2000), li.calculateSpinCoatResults({ step1_rpm: 500, step1_time: 5, step2_rpm: 2000, step2_time: 30, step3_rpm: 0, step3_time: 3 }, () => 0.5).prThickness, 'nm');
push('⑦ PR 두께', '3000 rpm', oldSpinThickness(3000), li.calculateSpinCoatResults({ step1_rpm: 500, step1_time: 5, step2_rpm: 3000, step2_time: 30, step3_rpm: 0, step3_time: 3 }, () => 0.5).prThickness, 'nm');
push('⑦ PR 두께', '5000 rpm', oldSpinThickness(5000), li.calculateSpinCoatResults({ step1_rpm: 500, step1_time: 5, step2_rpm: 5000, step2_time: 30, step3_rpm: 0, step3_time: 3 }, () => 0.5).prThickness, 'nm');

// ⑥ 자동 매칭: 부하별 정합 후 입력 임피던스
const matchRows = [];
for (const Z of [10, 25, 40, 50, 100, 200]) {
  const o = pl.calculateOptimalLC(13.56, Z);
  const after = pl.calculateInputImpedance(13.56, Number(o.L), Number(o.C), Z);
  matchRows.push([`${Z} Ω`, after.toFixed(1), `${(((after - 50) / 50) * 100).toFixed(1)}%`]);
}

// ═════════════════════ 출력 ═════════════════════
const pad = (v, w) => String(v).padEnd(w);
const padS = (v, w) => String(v).padStart(w);

console.log('');
console.log('1) 회귀 대조 — 물리 수정 대상이 아닌 함수는 추출 이전과 값이 같아야 한다');
console.log('─'.repeat(72));
console.log(`  비교한 값   : ${compared.toLocaleString()} 개`);
console.log(`  불일치      : ${mismatched.toLocaleString()} 개`);
if (failures.length) {
  console.log('\n  불일치 상세 (최대 20건):');
  failures.forEach((f) => console.log('  - ' + f));
}

console.log('');
console.log('2) 변경 보고 — 물리 오류를 고쳐 값이 의도적으로 바뀐 항목');
console.log('─'.repeat(72));
console.log(`  ${pad('항목', 16)} ${pad('조건', 24)} ${padS('수정 전', 10)} ${padS('수정 후', 10)} ${pad('', 5)} 변화`);
for (const [item, cond, o, n, unit, p] of rows) {
  console.log(`  ${pad(item, 16)} ${pad(cond, 24)} ${padS(o, 10)} ${padS(n, 10)} ${pad(unit, 5)} ${p}`);
}
console.log('');
console.log('  ⑥ RF 자동 매칭 후 입력 임피던스 (목표 50 Ω)');
console.log(`     ${pad('부하', 10)} ${padS('Z_in', 10)}  오차`);
for (const [z, after, err] of matchRows) {
  console.log(`     ${pad(z, 10)} ${padS(after, 10)}  ${err}`);
}
console.log('');

process.exit(mismatched === 0 ? 0 : 1);
