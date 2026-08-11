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
  // 에너지가 음수면 이온화가 없다. 가드가 없으면 −50 eV 에서 0 으로 나눠
  // 이온화도가 무한대가 된다 (물리적으로 불가능).
  if (!(plasmaEnergy > 0)) return 0;
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

/** 계통 특성 임피던스 (Ω). */
export const Z0 = 50;

/**
 * L-type 매칭망의 입력 임피던스 (복소수).
 *
 * 토폴로지는 부하에 따라 달라진다:
 *   - 승압 (R_L > Z₀): 부하와 **병렬**인 C + 입력 쪽 **직렬** L
 *       Z_in = jX_L + (R_L ∥ −jX_C)
 *   - 강압 (R_L < Z₀): 부하 쪽 **직렬** L + 입력 쪽 **병렬** C
 *       Z_in = (−jX_C) ∥ (R_L + jX_L)
 *
 * 예전 구현은 승압 토폴로지 하나만 모델링해 놓고 calculateOptimalLC 는 강압일 때
 * 뒤집힌 회로의 L·C 를 돌려줬다. 두 함수가 서로 다른 회로를 가정하는 바람에
 * 50 Ω 이하 부하에서는 "자동 매칭" 을 눌러도 정합이 되지 않았다.
 *
 * @param {number} frequency MHz
 * @param {number} inductance nH
 * @param {number} capacitance pF
 * @param {number} loadImpedance Ω (실수 부하로 가정)
 * @returns {{real: number, imag: number}} Ω
 */
export function calculateInputImpedanceComplex(frequency, inductance, capacitance, loadImpedance) {
  const omega = 2 * Math.PI * frequency * 1e6;
  const XL = omega * (inductance * 1e-9);
  // C = 0 은 개방(리액턴스 무한대)이다. 1/0 을 그대로 두면 NaN 이 번진다.
  const susceptance = omega * (capacitance * 1e-12); // B = ωC, C=0 이면 0 (개방)
  const R = loadImpedance;

  if (R >= Z0) {
    // 승압: 부하와 병렬인 C → 어드미턴스 Y = 1/R + jB, 그 뒤에 직렬 L
    const denom = 1 / (R * R) + susceptance * susceptance;
    if (!(denom > 0)) return { real: R, imag: XL };
    const real = 1 / R / denom;
    const imag = -susceptance / denom;
    return { real, imag: imag + XL };
  }

  // 강압: 부하와 직렬인 L (= R + jX_L), 그 앞에 병렬 C
  const sr = R;
  const si = XL;
  // Y_total = 1/(sr + j·si) + jB
  const mag2 = sr * sr + si * si;
  if (!(mag2 > 0)) return { real: 0, imag: 0 };
  const yr = sr / mag2;
  const yi = -si / mag2 + susceptance;
  const yMag2 = yr * yr + yi * yi;
  if (!(yMag2 > 0)) return { real: 0, imag: 0 };
  return { real: yr / yMag2, imag: -yi / yMag2 };
}

/**
 * L-type 매칭망의 입력 임피던스 크기 (Ω).
 * 화면에는 이 크기만 표시하지만, 반사 전력은 복소수 쪽을 써야 한다.
 */
export function calculateInputImpedance(frequency, inductance, capacitance, loadImpedance) {
  const { real, imag } = calculateInputImpedanceComplex(
    frequency,
    inductance,
    capacitance,
    loadImpedance
  );
  return Math.sqrt(real * real + imag * imag);
}

/** 50 Ω 정합을 위한 L, C 값. */
export function calculateOptimalLC(frequency, loadImpedance) {
  const omega = 2 * Math.PI * frequency * 1e6;
  const Z_load = loadImpedance;

  // 부하가 이미 50 Ω 이면 정합망이 필요 없다 (Q = 0).
  // 예전에는 여기서 X_C = 50/0 = ∞ 를 거쳐 L = C = 0 이 설정되고,
  // 그 C = 0 이 다시 입력 임피던스를 NaN 으로 만들었다. 슬라이더 기본값이 정확히
  // 50 Ω 이라 화면에 들어와 버튼만 눌러도 바로 걸리는 경로였다.
  if (Z_load === Z0) {
    return { L: '0', C: '0', type: '정합망 불필요 (부하 = 50 Ω)' };
  }

  if (Z_load > Z0) {
    const Q = Math.sqrt(Z_load / Z0 - 1);
    const X_L = Q * Z0;
    const X_C = Z_load / Q;
    return {
      L: ((X_L / omega) * 1e9).toFixed(0), // nH
      C: ((1 / (omega * X_C)) * 1e12).toFixed(0), // pF
      type: 'L-type (직렬L-병렬C)',
    };
  }

  const Q = Math.sqrt(Z0 / Z_load - 1);
  const X_C = Z0 / Q;
  const X_L = Q * Z_load;
  return {
    L: ((X_L / omega) * 1e9).toFixed(0), // nH
    C: ((1 / (omega * X_C)) * 1e12).toFixed(0), // pF
    type: 'L-type (병렬C-직렬L)',
  };
}

/**
 * 반사 전력 (W).
 *
 *   Γ = (Z_in − Z₀) / (Z_in + Z₀),   P_refl = P_in · |Γ|²
 *
 * |Γ| ≤ 1 이므로 반사 전력은 절대 입력 전력을 넘지 않는다. 예전 구현은 분모를
 * Z₀ 로 써서 |Z_in − 50| > 50 인 순간 반사 전력이 입력을 초과했다 (에너지 보존 위반).
 *
 * @param {{real:number, imag:number}|number} zIn 입력 임피던스 (복소수 또는 실수)
 * @param {number} rfPower 입력 전력 (W)
 */
export function calculateReflectedPower(zIn, rfPower) {
  const z = typeof zIn === 'number' ? { real: zIn, imag: 0 } : zIn;
  const numR = z.real - Z0;
  const numI = z.imag;
  const denR = z.real + Z0;
  const denI = z.imag;
  const denMag2 = denR * denR + denI * denI;
  if (!(denMag2 > 0)) return rfPower;
  const gammaMag2 = (numR * numR + numI * numI) / denMag2;
  return rfPower * Math.min(1, gammaMag2);
}

/**
 * 정재파비 VSWR = (1 + |Γ|) / (1 − |Γ|).
 * 완전 반사(|Γ| = 1) 면 무한대다.
 */
export function calculateVSWR(zIn) {
  const z = typeof zIn === 'number' ? { real: zIn, imag: 0 } : zIn;
  const gammaMag = Math.sqrt(calculateReflectedPower(z, 1));
  if (gammaMag >= 1) return Infinity;
  return (1 + gammaMag) / (1 - gammaMag);
}
