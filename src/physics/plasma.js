/**
 * 플라즈마 발생 / Paschen / RF 매칭 계산.
 *
 * PlasmaSimulator.js 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 컴포넌트 state (gasType 등) 로 읽던 값은 인자로 바꿨을 뿐 식은 동일하다.
 */

/** 가스별 Paschen 곡선 테이블 (pd: Torr·cm, voltage: V). */
export const PASCHEN_TABLE = {
  argon: [
    { pd: 0.1, voltage: 4000 }, { pd: 0.3, voltage: 500 }, { pd: 0.5, voltage: 300 },
    { pd: 1.0, voltage: 200 }, { pd: 2.0, voltage: 280 }, { pd: 5.0, voltage: 400 },
    { pd: 10, voltage: 500 }, { pd: 20, voltage: 1200 }, { pd: 50, voltage: 3000 },
    { pd: 100, voltage: 4000 },
  ],
  air: [
    { pd: 0.1, voltage: 5000 }, { pd: 0.3, voltage: 700 }, { pd: 0.5, voltage: 400 },
    { pd: 1.0, voltage: 350 }, { pd: 2.0, voltage: 450 }, { pd: 5.0, voltage: 700 },
    { pd: 10, voltage: 800 }, { pd: 20, voltage: 1800 }, { pd: 50, voltage: 4500 },
    { pd: 100, voltage: 5000 },
  ],
  helium: [
    { pd: 0.1, voltage: 6000 }, { pd: 0.3, voltage: 1000 }, { pd: 0.5, voltage: 600 },
    { pd: 1.0, voltage: 400 }, { pd: 2.0, voltage: 500 }, { pd: 5.0, voltage: 800 },
    { pd: 10, voltage: 1000 }, { pd: 20, voltage: 2000 }, { pd: 50, voltage: 4800 },
    { pd: 100, voltage: 6000 },
  ],
  nitrogen: [
    { pd: 0.1, voltage: 4500 }, { pd: 0.3, voltage: 600 }, { pd: 0.5, voltage: 350 },
    { pd: 1.0, voltage: 250 }, { pd: 2.0, voltage: 320 }, { pd: 5.0, voltage: 500 },
    { pd: 10, voltage: 650 }, { pd: 20, voltage: 1400 }, { pd: 50, voltage: 3500 },
    { pd: 100, voltage: 4500 },
  ],
  neon: [
    { pd: 0.1, voltage: 5500 }, { pd: 0.3, voltage: 800 }, { pd: 0.5, voltage: 450 },
    { pd: 1.0, voltage: 300 }, { pd: 2.0, voltage: 380 }, { pd: 5.0, voltage: 600 },
    { pd: 10, voltage: 750 }, { pd: 20, voltage: 1600 }, { pd: 50, voltage: 4000 },
    { pd: 100, voltage: 5500 },
  ],
};

/** 가스별 Paschen 최소점. */
export const PASCHEN_MINIMA = {
  argon: { pd: 1.0, voltage: 200 },
  air: { pd: 1.0, voltage: 350 },
  helium: { pd: 1.0, voltage: 400 },
  nitrogen: { pd: 1.0, voltage: 250 },
  neon: { pd: 1.0, voltage: 300 },
};

/** 압력·에너지에 따른 상대 이온화 인자 (0~1). */
export function plasmaFactor(gasPressure, plasmaEnergy) {
  const optimalPressure = 3.0;
  const pressureFactor = Math.exp(-Math.pow((gasPressure - optimalPressure) / 2, 2));
  const energyFactor = plasmaEnergy / (plasmaEnergy + 50);
  return pressureFactor * energyFactor;
}

/** 이온화도 (분율). */
export function calculateBasicIonizationDegree(gasPressure, plasmaEnergy) {
  return plasmaFactor(gasPressure, plasmaEnergy) * 0.0018;
}

/** 플라즈마 생성 확률 (%). */
export function calculateBasicPlasmaGenerationProbability(gasPressure, plasmaEnergy) {
  return plasmaFactor(gasPressure, plasmaEnergy) * 100;
}

/**
 * 절연 파괴 전압 (Paschen 테이블 선형 보간).
 * @returns {number|null} pd 가 0.1~100 Torr·cm 밖이면 null
 */
export function calculateBreakdownVoltage(p, d, gasType = 'argon') {
  const pd = p * d;
  if (pd < 0.1 || pd > 100) return null;
  const data = PASCHEN_TABLE[gasType] || PASCHEN_TABLE.argon;
  for (let i = 0; i < data.length - 1; i++) {
    if (pd >= data[i].pd && pd <= data[i + 1].pd) {
      const ratio = (pd - data[i].pd) / (data[i + 1].pd - data[i].pd);
      return data[i].voltage + ratio * (data[i + 1].voltage - data[i].voltage);
    }
  }
  return data[data.length - 1].voltage;
}

/** Townsend 1차 전리계수 근사와 최적 구간 판정. */
export function getTownsendInfo(pd) {
  let alpha;
  if (pd < 0.5) alpha = pd * 20;
  else if (pd <= 2.0) alpha = 10 + (pd - 0.5) * 20;
  else alpha = 40 * Math.exp(-(pd - 2) / 3);
  const isOptimal = pd >= 0.7 && pd <= 1.5;
  return {
    alpha,
    isOptimal,
    efficiency: isOptimal ? '최적' : pd < 0.7 ? '부족' : '과다',
  };
}

/**
 * L-type 매칭망의 입력 임피던스 크기 (Ω).
 * @param {number} frequency MHz
 * @param {number} inductance nH
 * @param {number} capacitance pF
 * @param {number} loadImpedance Ω
 */
export function calculateInputImpedance(frequency, inductance, capacitance, loadImpedance) {
  const omega = 2 * Math.PI * frequency * 1e6;
  const L = inductance * 1e-9;
  const C = capacitance * 1e-12;
  const XL = omega * L;
  const XC = 1 / (omega * C);

  const Z_load = loadImpedance;

  // 병렬 C와 부하의 합성 임피던스
  const Z_parallel_real = (Z_load * XC * XC) / (Z_load * Z_load + XC * XC);
  const Z_parallel_imag = -(Z_load * Z_load * XC) / (Z_load * Z_load + XC * XC);

  // 직렬 L 추가
  const Z_in_imag = XL + Z_parallel_imag;

  return Math.sqrt(Z_parallel_real * Z_parallel_real + Z_in_imag * Z_in_imag);
}

/** 50 Ω 정합을 위한 L, C 값. */
export function calculateOptimalLC(frequency, loadImpedance) {
  const f = frequency * 1e6;
  const omega = 2 * Math.PI * f;
  const Z_load = loadImpedance;
  const Z_source = 50;

  if (Z_load > Z_source) {
    const Q = Math.sqrt(Z_load / Z_source - 1);
    const X_L = Q * Z_source;
    const X_C = Z_load / Q;
    return {
      L: ((X_L / omega) * 1e9).toFixed(0), // nH
      C: ((1 / (omega * X_C)) * 1e12).toFixed(0), // pF
      type: 'L-type (직렬L-병렬C)',
    };
  }
  const Q = Math.sqrt(Z_source / Z_load - 1);
  const X_C = Z_source / Q;
  const X_L = Q * Z_load;
  return {
    L: ((X_L / omega) * 1e9).toFixed(0), // nH
    C: ((1 / (omega * X_C)) * 1e12).toFixed(0), // pF
    type: 'L-type (병렬C-직렬L)',
  };
}

/**
 * 반사 전력 (W).
 * @param {number} zIn 입력 임피던스 크기 (Ω)
 * @param {number} rfPower 입력 전력 (W)
 */
export function calculateReflectedPower(zIn, rfPower) {
  const impedanceMismatch = Math.abs(zIn - 50) / 50;
  return rfPower * Math.pow(impedanceMismatch, 2);
}
