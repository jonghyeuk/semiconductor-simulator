/**
 * 계산 로직 추출 전/후 동등성 대조.
 *
 * 아래 baseline 함수들은 추출 이전 컴포넌트 안에 있던 코드를 **그대로 복사**한 것이다.
 * 이 스크립트는 입력값을 촘촘한 격자로 훑으면서 baseline 과 src/physics/* 모듈의
 * 반환값을 비교하고, 비교 건수와 불일치 건수를 출력한다.
 *
 * 실행: node scripts/verify-extraction.mjs
 * 불일치가 1건이라도 있으면 exit code 1.
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

/** 두 값이 비트 단위로 같은지 비교 (NaN === NaN 을 같음으로 취급). */
function same(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Object.is(a, b) || (Number.isNaN(a) && Number.isNaN(b));
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(label, expected, actual) {
  compared++;
  if (!same(expected, actual)) {
    mismatched++;
    if (failures.length < 20) failures.push(`${label}\n    baseline=${JSON.stringify(expected)}\n    module  =${JSON.stringify(actual)}`);
  }
}

/** 결정적 난수원 (mulberry32). baseline/모듈에 같은 시퀀스를 먹인다. */
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

// ───────────────────────── 산화 ─────────────────────────
const baseOxideGrowth = (temp, time, atm, gasFlowRate = 100) => {
  const tempK = temp + 273.15;
  let B, A;
  if (atm === 'dry') {
    const B0 = 3.0e7;
    const Ea = 1.23;
    B = B0 * Math.exp(-Ea / (8.617e-5 * tempK));
    A = 165 * Math.exp(-2.0 / (8.617e-5 * tempK));
  } else {
    const B0 = 7.7e7;
    const Ea = 0.78;
    B = B0 * Math.exp(-Ea / (8.617e-5 * tempK));
    A = 226 * Math.exp(-2.0 / (8.617e-5 * tempK));
  }
  const flowFactor = 0.5 + (gasFlowRate / 100) * 0.5;
  const timeHours = time / 60;
  const discriminant = A * A + 4 * B * timeHours;
  let thickness = (-A + Math.sqrt(discriminant)) / 2;
  thickness = thickness * flowFactor;
  return Math.max(0, Math.min(thickness, 1000));
};
const baseOrientationRate = (orientation) => {
  const rates = { 100: 1.0, 110: 1.25, 111: 1.68 };
  return rates[orientation] || 1.0;
};
const baseDopingRate = (dopingLevel) => (dopingLevel === 0 ? 1.0 : 1.0 + (dopingLevel / 10) * 2.0);
const baseInitialOxideRate = (t) => (t === 0 ? 1.0 : 1.0 / (1.0 + t / 100));
const baseTempPressureRate = (temp, pressure) => {
  const tempBase = 1000;
  const tempEffect =
    Math.exp(-1.23 / (8.617e-5 * (temp + 273.15))) / Math.exp(-1.23 / (8.617e-5 * (tempBase + 273.15)));
  return tempEffect * pressure;
};

for (const atm of ['dry', 'wet']) {
  for (const T of range(700, 1250, 5)) {
    for (const t of [0, 1, 5, 15, 30, 60, 120, 240, 600]) {
      for (const f of [0, 50, 100, 150, 200]) {
        check(`oxide(${atm},${T},${t},${f})`, baseOxideGrowth(T, t, atm, f), ox.calculateOxideGrowth(T, t, atm, f));
      }
    }
  }
}
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

// ───────────────────────── 확산 / 이온주입 ─────────────────────────
const baseDopantProps = {
  B: { Qd: 3.69, D0: 0.76, mass: 10.8 },
  P: { Qd: 3.66, D0: 3.85, mass: 31.0 },
  As: { Qd: 4.08, D0: 0.32, mass: 74.9 },
  In: { Qd: 3.9, D0: 0.5, mass: 114.8 },
  Sb: { Qd: 4.0, D0: 0.4, mass: 121.8 },
};
const baseDiffCoef = (temp, dopant) => {
  const k = 8.617e-5;
  const T = temp + 273.15;
  const { Qd, D0 } = baseDopantProps[dopant];
  return D0 * Math.exp(-Qd / (k * T));
};
const baseErfc = (x) => {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return x >= 0 ? 1 - erf : 1 + erf;
};
const baseImplantParams = (energy, dopant, tilt) => {
  const mass = baseDopantProps[dopant].mass;
  const A_target = 28.1;
  const Z_target = 14;
  const Z_ion = dopant === 'B' ? 5 : dopant === 'P' ? 15 : dopant === 'As' ? 33 : dopant === 'In' ? 49 : 51;
  const epsilon = 32.5 * mass * energy / (Z_ion * Z_target * (mass + A_target) *
    (Math.pow(Z_ion, 0.23) + Math.pow(Z_target, 0.23)));
  let Rp = (mass / A_target) * Math.pow(epsilon, 0.8) * 100;
  if (tilt > 0) Rp = Rp / Math.cos(tilt * Math.PI / 180);
  const deltaRp = Rp * 0.5;
  Rp = Math.max(Rp, 1);
  return { Rp: Rp * 1e-3, deltaRp: deltaRp * 1e-3 };
};

const DOPANTS = ['B', 'P', 'As', 'In', 'Sb'];
for (const d of DOPANTS) {
  for (const T of range(700, 1300, 10)) check(`D(${d},${T})`, baseDiffCoef(T, d), dp.calculateDiffusionCoefficient(T, d));
  for (const E of range(5, 300, 2.5)) {
    for (const tilt of [0, 7, 15, 30, 45]) {
      check(`implant(${d},${E},${tilt})`, baseImplantParams(E, d, tilt), dp.calculateImplantParams(E, d, tilt));
    }
  }
}
for (const x of range(-4, 4, 0.02)) check(`erfc(${x})`, baseErfc(x), dp.erfc(x));

// 프로파일 배열 전체 대조
const baseDiffusionProfile = (currentTime, diffTemperature, diffDopantType, diffProcessType, diffSurfaceConc, diffBackgroundConc) => {
  const D = baseDiffCoef(diffTemperature, diffDopantType);
  const t = currentTime * 60;
  const profile = [];
  const maxDepth = 3;
  const points = 100;
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * maxDepth * 1e-4;
    let concentration;
    if (diffProcessType === 'predeposition') {
      concentration = diffSurfaceConc * baseErfc(x / (2 * Math.sqrt(D * t)));
    } else {
      const D_predep = baseDiffCoef(1000, diffDopantType);
      const Q = 2 * diffSurfaceConc * Math.sqrt(D_predep * (30 * 60) / Math.PI);
      concentration = (Q / Math.sqrt(Math.PI * D * t)) * Math.exp(-x * x / (4 * D * t));
    }
    concentration = Math.max(concentration, diffBackgroundConc);
    profile.push({ depth: (i / points) * maxDepth, concentration, logConcentration: Math.log10(concentration) });
  }
  return profile;
};
for (const d of DOPANTS) {
  for (const T of [900, 1000, 1100, 1200]) {
    for (const time of [1, 10, 30, 60, 120]) {
      for (const type of ['predeposition', 'drivein']) {
        check(
          `diffProfile(${d},${T},${time},${type})`,
          baseDiffusionProfile(time, T, d, type, 1e20, 1e15),
          dp.calculateDiffusionProfile({ currentTime: time, temperature: T, dopant: d, processType: type, surfaceConc: 1e20, backgroundConc: 1e15 })
        );
      }
    }
  }
}

const baseImplantProfile = (implEnergy, implDopantType, implDose, implTilt, implAnnealing, annealTemp, annealTime) => {
  const { Rp, deltaRp } = baseImplantParams(implEnergy, implDopantType, implTilt);
  const profile = [];
  const maxDepth = Math.max((Rp + 4 * deltaRp), 0.05);
  const points = 100;
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * maxDepth;
    let concentration = (implDose / (Math.sqrt(2 * Math.PI) * deltaRp * 1e-4)) *
      Math.exp(-Math.pow(x * 1e-4 - Rp * 1e-4, 2) / (2 * Math.pow(deltaRp * 1e-4, 2)));
    if (implAnnealing) {
      const D = baseDiffCoef(annealTemp, implDopantType);
      const t = annealTime * 60;
      const diffusionBroadening = Math.sqrt(deltaRp * deltaRp * 1e-8 + 2 * D * t) * 1e4;
      concentration = (implDose / (Math.sqrt(2 * Math.PI) * diffusionBroadening * 1e-4)) *
        Math.exp(-Math.pow(x * 1e-4 - Rp * 1e-4, 2) / (2 * Math.pow(diffusionBroadening * 1e-4, 2)));
    }
    concentration = Math.max(concentration, 1e14);
    profile.push({ depth: x, concentration, logConcentration: Math.log10(concentration) });
  }
  return profile;
};
for (const d of DOPANTS) {
  for (const E of [15, 30, 50, 100, 180]) {
    for (const tilt of [0, 7]) {
      for (const ann of [false, true]) {
        check(
          `implProfile(${d},${E},${tilt},${ann})`,
          baseImplantProfile(E, d, 1e15, tilt, ann, 1000, 30),
          dp.calculateImplantationProfile({ energy: E, dopant: d, dose: 1e15, tilt, annealing: ann, annealTemp: 1000, annealTime: 30 })
        );
      }
    }
  }
}

// ───────────────────────── 진공 ─────────────────────────
const baseTurboSpeed = (pressure) => {
  if (pressure <= 1e-6) return 300;
  if (pressure <= 1e-5) return 300;
  if (pressure <= 1e-4) return 295;
  if (pressure <= 1e-3) return 280;
  if (pressure <= 1e-2) return 250;
  if (pressure <= 1e-1) return 180;
  if (pressure <= 1) return 80;
  return 20;
};
const basePumpingTime = (volume, initialPressure, finalPressure, pumpSpeed) => {
  if (finalPressure <= 0.02) finalPressure = 0.02;
  if (initialPressure <= finalPressure) return 0;
  return (volume * Math.log(initialPressure / finalPressure)) / (pumpSpeed * 60 / 1000);
};
const baseConductance = (diameter, length, pipeType) => {
  const D = diameter, L = length;
  const baseC = 3.27e-2 * Math.pow(D, 4) / L;
  switch (pipeType) {
    case 'straight': return baseC * 1000;
    case 'elbow': return baseC * 0.7 * 1000;
    case 'spiral': return baseC * 0.4 * 1000;
    default: return baseC * 1000;
  }
};
const baseEffSpeed = (s, c) => (s * c) / (s + c);
const basePressureToSlider = (pressure) => {
  const minLog = Math.log10(0.02), maxLog = Math.log10(760);
  return ((Math.log10(pressure) - minLog) / (maxLog - minLog)) * 100;
};

for (let e = -8; e <= 3; e += 0.1) {
  const p = Math.pow(10, e);
  check(`turbo(${p})`, baseTurboSpeed(p), vac.calculateTurboSpeed(p));
  check(`slider(${p})`, basePressureToSlider(p), vac.pressureToSliderValue(p));
}
for (const V of range(10, 1000, 10)) {
  for (const S of [50, 100, 250, 500, 1000]) {
    for (const [pi, pf] of [[760, 1], [760, 0.02], [760, 0.001], [1, 1], [0.5, 1]]) {
      check(`pumpTime(${V},${pi},${pf},${S})`, basePumpingTime(V, pi, pf, S), vac.calculatePumpingTime(V, pi, pf, S));
    }
  }
}
for (const D of range(1, 40, 0.5)) {
  for (const L of range(10, 300, 10)) {
    for (const type of ['straight', 'elbow', 'spiral', 'unknown']) {
      check(`cond(${D},${L},${type})`, baseConductance(D, L, type), vac.calculateConductance(D, L, type));
    }
  }
}
for (const s of range(50, 1000, 25)) {
  for (const c of range(50, 5000, 100)) check(`effS(${s},${c})`, baseEffSpeed(s, c), vac.calculateEffectivePumpingSpeed(s, c));
}
for (const sccm of range(0, 500, 5)) check(`sccm(${sccm})`, sccm * 0.00950, vac.convertSccmToTorrLs(sccm));

// 펌프 속도 곡선 보간
const PUMP_MODELS = [
  { maxSpeed: 300, data: [{ pressure: 0.02, speed: 250 }, { pressure: 1, speed: 300 }, { pressure: 100, speed: 280 }, { pressure: 760, speed: 200 }] },
  { maxSpeed: 600, data: [{ pressure: 0.02, speed: 500 }, { pressure: 1, speed: 600 }, { pressure: 100, speed: 560 }, { pressure: 760, speed: 400 }] },
];
const basePumpingSpeed = (pressure, modelNumber) => {
  const model = PUMP_MODELS[Math.round(modelNumber)];
  if (!model) return 250;
  if (pressure <= 0.02) return model.data[0].speed;
  if (pressure >= 760) return model.data[model.data.length - 1].speed;
  const logPressure = Math.log10(pressure);
  for (let i = 0; i < model.data.length - 1; i++) {
    const current = model.data[i], next = model.data[i + 1];
    if (logPressure >= Math.log10(current.pressure) && logPressure <= Math.log10(next.pressure)) {
      const ratio = (logPressure - Math.log10(current.pressure)) / (Math.log10(next.pressure) - Math.log10(current.pressure));
      return current.speed + (next.speed - current.speed) * ratio;
    }
  }
  return model.maxSpeed / 2;
};
for (let e = -3; e <= 3; e += 0.05) {
  const p = Math.pow(10, e);
  for (const m of [0, 1, 5]) {
    check(`pumpSpeed(${p},${m})`, basePumpingSpeed(p, m), vac.calculatePumpingSpeed(p, PUMP_MODELS, m));
  }
}

// ───────────────────────── 플라즈마 ─────────────────────────
const baseIonization = (basicGasPressure, basicPlasmaEnergy) => {
  const pressureFactor = Math.exp(-Math.pow((basicGasPressure - 3.0) / 2, 2));
  const energyFactor = basicPlasmaEnergy / (basicPlasmaEnergy + 50);
  return pressureFactor * energyFactor * 0.0018;
};
const baseProb = (basicGasPressure, basicPlasmaEnergy) => {
  const pressureFactor = Math.exp(-Math.pow((basicGasPressure - 3.0) / 2, 2));
  const energyFactor = basicPlasmaEnergy / (basicPlasmaEnergy + 50);
  return pressureFactor * energyFactor * 100;
};
const baseInputZ = (frequency, inductance, capacitance, loadImpedance) => {
  const omega = 2 * Math.PI * frequency * 1e6;
  const XL = omega * (inductance * 1e-9);
  const XC = 1 / (omega * (capacitance * 1e-12));
  const Z_load = loadImpedance;
  const Z_parallel_real = (Z_load * XC * XC) / (Z_load * Z_load + XC * XC);
  const Z_parallel_imag = -(Z_load * Z_load * XC) / (Z_load * Z_load + XC * XC);
  const Z_in_imag = XL + Z_parallel_imag;
  return Math.sqrt(Z_parallel_real * Z_parallel_real + Z_in_imag * Z_in_imag);
};
const baseOptimalLC = (frequency, loadImpedance) => {
  const omega = 2 * Math.PI * frequency * 1e6;
  const Z_load = loadImpedance, Z_source = 50;
  if (Z_load > Z_source) {
    const Q = Math.sqrt(Z_load / Z_source - 1);
    return { L: ((Q * Z_source / omega) * 1e9).toFixed(0), C: ((1 / (omega * (Z_load / Q))) * 1e12).toFixed(0), type: 'L-type (직렬L-병렬C)' };
  }
  const Q = Math.sqrt(Z_source / Z_load - 1);
  return { L: ((Q * Z_load / omega) * 1e9).toFixed(0), C: ((1 / (omega * (Z_source / Q))) * 1e12).toFixed(0), type: 'L-type (병렬C-직렬L)' };
};
const baseTownsend = (pd) => {
  let alpha;
  if (pd < 0.5) alpha = pd * 20;
  else if (pd <= 2.0) alpha = 10 + (pd - 0.5) * 20;
  else alpha = 40 * Math.exp(-(pd - 2) / 3);
  const isOptimal = pd >= 0.7 && pd <= 1.5;
  return { alpha, isOptimal, efficiency: isOptimal ? '최적' : pd < 0.7 ? '부족' : '과다' };
};

for (const p of range(0.1, 10, 0.1)) {
  for (const E of range(10, 500, 10)) {
    check(`ioniz(${p},${E})`, baseIonization(p, E), pl.calculateBasicIonizationDegree(p, E));
    check(`prob(${p},${E})`, baseProb(p, E), pl.calculateBasicPlasmaGenerationProbability(p, E));
  }
}
const GASES = ['argon', 'air', 'helium', 'nitrogen', 'neon', 'unknown'];
const basePaschen = (p, d, gasType) => {
  const pd = p * d;
  if (pd < 0.1 || pd > 100) return null;
  const table = {
    argon: pl.PASCHEN_TABLE.argon, air: pl.PASCHEN_TABLE.air, helium: pl.PASCHEN_TABLE.helium,
    nitrogen: pl.PASCHEN_TABLE.nitrogen, neon: pl.PASCHEN_TABLE.neon,
  };
  const data = table[gasType] || table.argon;
  for (let i = 0; i < data.length - 1; i++) {
    if (pd >= data[i].pd && pd <= data[i + 1].pd) {
      const ratio = (pd - data[i].pd) / (data[i + 1].pd - data[i].pd);
      return data[i].voltage + ratio * (data[i + 1].voltage - data[i].voltage);
    }
  }
  return data[data.length - 1].voltage;
};
for (const g of GASES) {
  for (const pd of range(0.05, 120, 0.25)) {
    check(`paschen(${g},${pd})`, basePaschen(pd, 1.0, g), pl.calculateBreakdownVoltage(pd, 1.0, g));
    check(`townsend(${pd})`, baseTownsend(pd), pl.getTownsendInfo(pd));
  }
}
for (const f of [2, 13.56, 27.12, 60]) {
  for (const Lh of range(10, 500, 25)) {
    for (const C of range(10, 500, 25)) {
      for (const Z of [10, 25, 50, 75, 100, 200]) {
        check(`Zin(${f},${Lh},${C},${Z})`, baseInputZ(f, Lh, C, Z), pl.calculateInputImpedance(f, Lh, C, Z));
      }
    }
  }
  for (const Z of range(5, 300, 5)) check(`optLC(${f},${Z})`, baseOptimalLC(f, Z), pl.calculateOptimalLC(f, Z));
}
for (const Z of range(0, 400, 2)) {
  for (const P of [100, 500, 1000, 2000]) {
    check(`refl(${Z},${P})`, P * Math.pow(Math.abs(Z - 50) / 50, 2), pl.calculateReflectedPower(Z, P));
  }
}

// ───────────────────────── 식각 ─────────────────────────
const baseEtchRate = (material, gasFlow, power, pressure) => {
  let baseRate = 0;
  switch (material) {
    case 'Si': {
      const cl2Effect = gasFlow.Cl2 * 4.5;
      const hbrPassivation = Math.max(0, (gasFlow.HBr - 30) * 1.8);
      baseRate = (cl2Effect - hbrPassivation) * (power / 300);
      break;
    }
    case 'SiO2': {
      const cf4Effect = gasFlow.CF4 * 5.0;
      const chf3Effect = gasFlow.CHF3 * 2.5;
      const polymerStop = Math.max(0, (gasFlow.CHF3 - 45) * 3.0);
      baseRate = (cf4Effect + chf3Effect - polymerStop) * (power / 400);
      break;
    }
    case 'Si3N4': {
      const chf3Effect = gasFlow.CHF3 * 4.0;
      const polymerStop = Math.max(0, (gasFlow.CHF3 - 50) * 2.5);
      baseRate = (chf3Effect - polymerStop) * (power / 400);
      break;
    }
    case 'PR': {
      baseRate = gasFlow.O2 * 5.0 * (power / 400);
      break;
    }
    default: baseRate = 50;
  }
  const pressureFactor = pressure < 80
    ? 0.75 + Math.max(0, pressure - 30) / 50 * 0.25
    : Math.max(0.5, 1 - (pressure - 80) / 240);
  const powerSaturation = power > 600 ? Math.max(0.7, 1 - (power - 600) / 800) : 1;
  baseRate = baseRate * pressureFactor * powerSaturation;
  return Math.max(5, baseRate * (0.9 + Math.random() * 0.2));
};
const baseSelectivity = (target, gasFlow, power, pressure) => {
  let sel = 5;
  switch (target) {
    case 'Si': {
      sel = 8 + (gasFlow.HBr / 10) * 8;
      sel -= Math.max(0, (gasFlow.Cl2 - 50) * 0.35) + Math.max(0, (gasFlow.Ar - 80) * 0.25);
      break;
    }
    case 'SiO2': {
      sel = 5 + (gasFlow.CHF3 / 10) * 4;
      sel -= Math.max(0, (gasFlow.CF4 - 30) * 0.3) + Math.max(0, (gasFlow.Ar - 70) * 0.25);
      break;
    }
    case 'Si3N4': {
      sel = 5 + (gasFlow.CHF3 / 10) * 3;
      sel -= Math.max(0, (gasFlow.O2 - 15) * 0.5);
      break;
    }
    case 'PR': { sel = 30 + Math.random() * 5; break; }
    default: sel = 5 + Math.random() * 5;
  }
  const powerPenalty = power > 500 ? (power - 500) / 150 : 0;
  const lowPressurePenalty = pressure < 40 ? (40 - pressure) / 20 : 0;
  return Math.max(1, sel - powerPenalty - lowPressurePenalty);
};
const baseUniformity = (pressure, power, gasFlow) => {
  const pressureEffect = Math.max(0, 100 - Math.abs(pressure - 100) / 1.5);
  const powerEffect = Math.max(0, 100 - Math.abs(power - 300) / 5);
  let uniformity = (pressureEffect + powerEffect) / 2;
  if (gasFlow) {
    const totalGas = Object.values(gasFlow).reduce((a, b) => a + b, 0);
    if (totalGas > 350) uniformity -= (totalGas - 350) / 6;
  }
  return Math.max(40, Math.min(100, uniformity));
};

const realRandom = Math.random;
const MATERIALS = ['Si', 'SiO2', 'Si3N4', 'PR', 'W'];
let seed = 1;
for (const m of MATERIALS) {
  for (const power of range(50, 1200, 50)) {
    for (const pressure of range(5, 300, 15)) {
      for (const gf of [
        { Cl2: 50, HBr: 20, CF4: 40, CHF3: 30, O2: 10, Ar: 60 },
        { Cl2: 80, HBr: 60, CF4: 20, CHF3: 60, O2: 30, Ar: 120 },
        { Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0 },
      ]) {
        seed++;
        // baseline 은 Math.random 을 직접 부르므로 같은 시퀀스로 stub 한다.
        Math.random = makeRng(seed);
        const expected = baseEtchRate(m, gf, power, pressure);
        Math.random = realRandom;
        check(`etchRate(${m},${power},${pressure},${seed})`, expected, et.calculateEtchRate(m, gf, power, pressure, makeRng(seed)));

        Math.random = makeRng(seed);
        const expSel = baseSelectivity(m, gf, power, pressure);
        Math.random = realRandom;
        check(`selectivity(${m},${power},${pressure},${seed})`, expSel, et.calculateSelectivity(m, gf, power, pressure, makeRng(seed)));

        check(`uniformity(${power},${pressure})`, baseUniformity(pressure, power, gf), et.calculateUniformity(pressure, power, gf));
      }
    }
  }
}
for (const p of range(0, 300, 5)) check(`pEff(${p})`, Math.min(2.0, 0.5 + (p / 100)), et.calculatePressureEffect(p));
for (const p of range(0, 1200, 25)) check(`powEff(${p})`, Math.min(3.0, 0.5 + (p / 200)), et.calculatePowerEffect(p));
for (const r of range(0, 200, 2)) check(`gasEff(${r})`, Math.min(2.0, 0.8 + (r / 50)), et.calculateGasRatioEffect(r));

// ───────────────────────── 리소 ─────────────────────────
const baseSpinCoat = (processParams) => {
  const { step1_rpm, step1_time, step2_rpm, step2_time, step3_rpm, step3_time } = processParams;
  let thickness = 1000;
  if (step2_rpm < 2000) thickness = 1000 + (2000 - step2_rpm) * 0.1;
  else if (step2_rpm > 4000) thickness = 1000 - (step2_rpm - 4000) * 0.05;
  else thickness = 1000 + (Math.random() - 0.5) * 20;
  let uniformity = 99;
  if (step1_rpm >= 400 && step1_rpm <= 600 && step1_time >= 4) uniformity += 0;
  else {
    if (step1_rpm < 300) uniformity -= 8;
    else if (step1_rpm > 800) uniformity -= 6;
    else uniformity -= 3;
    if (step1_time < 4) uniformity -= 4;
  }
  if (step2_rpm >= 2500 && step2_rpm <= 3500 && step2_time >= 20) uniformity += 0;
  else {
    if (step2_rpm < 1500) uniformity -= 15;
    else if (step2_rpm < 2000) uniformity -= 8;
    else if (step2_rpm > 5000) uniformity -= 12;
    else if (step2_rpm > 4500) uniformity -= 6;
    else uniformity -= 2;
    if (step2_time < 15) uniformity -= 5;
    else if (step2_time > 50) uniformity -= 3;
  }
  if (step3_rpm === 0 && step3_time >= 2) uniformity += 0;
  else {
    if (step3_rpm > 0) uniformity -= 2;
    if (step3_time < 2) uniformity -= 1;
  }
  uniformity = Math.min(99.5, Math.max(70, uniformity));
  const resolution = 88 + Math.random() * 4;
  const defectDensity = Math.max(0.1, (100 - uniformity) * 0.15);
  const cdUniformity = Math.min(100, (uniformity + resolution) / 2);
  return { prThickness: thickness, resolution, uniformity, defectDensity, cdUniformity };
};
for (const r1 of [200, 500, 900]) {
  for (const t1 of [2, 5]) {
    for (const r2 of range(1000, 6000, 250)) {
      for (const t2 of [10, 25, 60]) {
        for (const r3 of [0, 500]) {
          for (const t3 of [1, 3]) {
            seed++;
            const params = { step1_rpm: r1, step1_time: t1, step2_rpm: r2, step2_time: t2, step3_rpm: r3, step3_time: t3 };
            Math.random = makeRng(seed);
            const expected = baseSpinCoat(params);
            Math.random = realRandom;
            check(`spinCoat(${r1},${t1},${r2},${t2},${r3},${t3},${seed})`, expected, li.calculateSpinCoatResults(params, makeRng(seed)));
          }
        }
      }
    }
  }
}

// ───────────────────────── PECVD ─────────────────────────
const baseN = (ratio) => {
  if (ratio < 10) return 1.55 - (ratio - 5) * 0.012;
  if (ratio < 14) return 1.49 - (ratio - 10) * 0.0075;
  if (ratio <= 18) return 1.46 - (ratio - 14) * 0.003;
  return 1.448 - (ratio - 18) * 0.001;
};
const baseSiNxN = (ratio) => {
  if (ratio < 5) return 2.3 - (ratio - 2) * 0.06;
  if (ratio < 10) return 2.12 - (ratio - 5) * 0.024;
  return 2.0 - (ratio - 10) * 0.03;
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
  check(`n(${r})`, baseN(r), pe.calculateRefractiveIndex(r));
  check(`siNxN(${r})`, baseSiNxN(r), pe.calculateSiNxRefractiveIndex(r));
  check(`nSi(${r})`, Math.min(1.6, 0.6 + r * 0.07), pe.calculateNSiRatio(r));
  check(`db(${r})`, baseDB(r), pe.calculateDanglingBondDensity(r));
  check(`aSiH(${r})`, baseASiH(r), pe.calculateaSiHContent(r));
}
for (const T of range(100, 600, 2)) {
  check(`H(${T})`, Math.max(5, 35 - T * 0.07), pe.calculateHydrogenContent(T));
  check(`dens(${T})`, Math.min(100, 60 + T * 0.1), pe.calculateFilmDensity(T));
}

// ───────────────────────── RTA ─────────────────────────
const baseTempProfile = (time, targetTemp, rampRate, processTime) => {
  const gasStabilizationTime = 10;
  const totalRampUpTime = (targetTemp - 25) / rampRate;
  const rampDownTime = (targetTemp - 25) / (rampRate * 0.3);
  if (time <= gasStabilizationTime) return 25;
  else if (time <= gasStabilizationTime + totalRampUpTime) return 25 + (rampRate * (time - gasStabilizationTime));
  else if (time <= gasStabilizationTime + totalRampUpTime + processTime) return targetTemp;
  else if (time <= gasStabilizationTime + totalRampUpTime + processTime + rampDownTime) {
    const coolTime = time - (gasStabilizationTime + totalRampUpTime + processTime);
    return targetTemp - (targetTemp - 25) * Math.pow(coolTime / rampDownTime, 0.7);
  }
  return 25;
};
const baseZoneSetpoints = (globalSetpoint, lampPower) => lampPower.map((_, idx) => {
  const powerFactor = lampPower[idx] / 100;
  const positionOffset = idx === 0 ? 0 : (idx < 3 ? 2 : idx < 5 ? 5 : 8);
  return Math.max(25, globalSetpoint - positionOffset + (powerFactor * 10));
});
const baseStepZones = (zoneTemps, setpoints, deltaTime) => {
  const timeConstants = [0.5, 0.75, 0.75, 1.0, 1.0, 1.25];
  return zoneTemps.map((currentTemp, idx) => currentTemp + (setpoints[idx] - currentTemp) / timeConstants[idx] * deltaTime);
};
for (const target of [400, 700, 1000, 1100]) {
  for (const ramp of [10, 50, 100, 200]) {
    for (const pt of [5, 30, 60]) {
      for (const t of range(0, 200, 0.5)) {
        check(`rtaT(${target},${ramp},${pt},${t})`, baseTempProfile(t, target, ramp, pt), rta.calculateTempProfile(t, { targetTemp: target, rampRate: ramp, processTime: pt }));
      }
    }
  }
}
for (const gsp of range(100, 1200, 50)) {
  for (const lp of [[100, 100, 100, 100, 100, 100], [80, 90, 100, 70, 60, 50], [0, 0, 0, 0, 0, 0]]) {
    const sp = baseZoneSetpoints(gsp, lp);
    check(`zoneSp(${gsp})`, sp, rta.computeZoneSetpoints(gsp, lp));
    const zt = [25, 30, 28, 26, 27, 25];
    check(`zoneStep(${gsp})`, baseStepZones(zt, sp, 0.1), rta.stepZoneTemperatures(zt, sp, 0.1));
  }
}

// ───────────────────────── 세정 ─────────────────────────
// baseline: 원본은 case 에 중괄호가 없었을 뿐 계산식은 동일하다.
const baseCleaning = (method, params) => {
  switch (method) {
    case 'wet': {
      const tempFactor = (params.temperature - 25) / 75;
      const concFactor = params.concentration / 10;
      const timeFactor = Math.min(params.time / 15, 1);
      const solutionFactor = params.solution === 'BOE' ? 1.2 : params.solution === 'SC1' ? 0.3 : params.solution === 'SC2' ? 0.2 : 0.8;
      return Math.min(98, 20 + tempFactor * 25 + concFactor * 30 + timeFactor * 20 + solutionFactor * 15);
    }
    case 'dry': {
      const powerFactor = params.power / 500;
      const pressureFactor = (0.5 - params.pressure) / 0.4;
      return Math.min(85, 35 + powerFactor * 30 + pressureFactor * 20);
    }
    case 'ultrasonic': {
      const freqFactor = Math.abs(params.frequency - 40) / 40;
      const powerUsFactor = params.power / 150;
      return Math.min(60, 30 + (1 - freqFactor) * 15 + powerUsFactor * 15);
    }
    default: return 0;
  }
};
for (const sol of ['BOE', 'SC1', 'SC2', 'SPM']) {
  for (const T of range(20, 100, 2)) {
    for (const conc of range(0, 20, 1)) {
      for (const time of [1, 10, 30]) {
        const p = { temperature: T, concentration: conc, time, solution: sol };
        check(`clean(wet,${sol},${T},${conc},${time})`, baseCleaning('wet', p), cl.calculateOxideRemovalEfficiency('wet', p));
      }
    }
  }
}
for (const power of range(0, 1000, 25)) {
  for (const pressure of range(0, 1, 0.05)) {
    const p = { power, pressure };
    check(`clean(dry,${power},${pressure})`, baseCleaning('dry', p), cl.calculateOxideRemovalEfficiency('dry', p));
  }
  for (const freq of range(10, 100, 5)) {
    const p = { power, frequency: freq };
    check(`clean(us,${power},${freq})`, baseCleaning('ultrasonic', p), cl.calculateOxideRemovalEfficiency('ultrasonic', p));
  }
}
check('clean(unknown)', baseCleaning('nope', {}), cl.calculateOxideRemovalEfficiency('nope', {}));

// ───────────────────────── 결과 ─────────────────────────
console.log('');
console.log('추출 전/후 동등성 대조');
console.log('─'.repeat(46));
console.log(`  비교한 값   : ${compared.toLocaleString()} 개`);
console.log(`  불일치      : ${mismatched.toLocaleString()} 개`);
if (failures.length) {
  console.log('\n  불일치 상세 (최대 20건):');
  failures.forEach((f) => console.log('  - ' + f));
}
console.log('');
process.exit(mismatched === 0 ? 0 : 1);
