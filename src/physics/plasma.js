/**
 * 플라즈마 발생 / Paschen / RF 매칭 계산.
 *
 * PlasmaSimulator.js 에서 옮겨온 것이고, 컴포넌트 state (gasType 등) 로 읽던 값은
 * 인자로 바꿨을 뿐 식은 동일하다.
 *
 * 예외: PASCHEN_TABLE / PASCHEN_MINIMA 는 물리 오류라 값을 고쳤다. 사유는 해당
 * 상수 주석에 적었다. 나머지는 추출 당시 값 그대로다.
 */

/**
 * 가스별 Paschen 곡선 테이블 (pd: Torr·cm, voltage: V).
 *
 * 예전 표는 다섯 가스의 최소점을 **전부 pd = 1.0** 에 두고, 헬륨을 400 V 로
 * 가장 높게 잡고 있었다. 둘 다 틀렸다.
 *   - 최소점 위치는 가스마다 다르다. 그 차이가 파셴 곡선 학습의 핵심이다.
 *   - 헬륨은 이온화 에너지가 가장 높지만 파셴 최소값은 낮은 축이다.
 *     예전 표는 이 점을 정반대로 가르쳤고, 같은 시뮬레이터의 설명문과도 어긋났다.
 *
 * 지금 값은 널리 인용되는 최소점을 기준으로 파셴 법칙에서 생성했다.
 *   argon 137 V @ 0.9 · helium 156 V @ 4.0 · neon 245 V @ 3.0
 *   nitrogen 251 V @ 0.67 · air 327 V @ 0.567   (Torr·cm)
 *
 * 최소점 하나만 알면 곡선 전체가 정해진다. 파셴 법칙
 *   V = B·pd / (ln(A·pd) − ln L)
 * 은 최소점에서 ln(A·pd_min/L) = 1 이므로 환산형이 된다.
 *   V(pd) = V_min · (pd/pd_min) / (1 + ln(pd/pd_min))
 * 이 식은 pd = pd_min/e 에서 발산한다(왼쪽 점근선). 그 아래로는 방전이 서지
 * 않는 영역이라 파셴 법칙에 해가 없다. 다만 이 시뮬레이터는 pd 0.1~100 을
 * 계약으로 쓰므로, 점근선 왼쪽은 1/pd 로 매끄럽게 이어 8000 V 에서 끊었다.
 * 그 구간의 절대값은 물리값이 아니라 "여기서는 안 터진다"는 표시로 읽어야 한다.
 *
 * 표 사이는 선형 보간한다. 파셴 최소 전압은 전극 재질·표면 상태·가스 순도에
 * 크게 좌우돼 문헌 편차가 크다 (헬륨만 해도 음극에 따라 127~152 V 와 360 V 대가
 * 함께 보고된다). 위 값은 그중 한 세트다.
 */
export const PASCHEN_TABLE = {
  argon: [
    { pd: 0.1, voltage: 3771 }, { pd: 0.3, voltage: 1257 }, { pd: 0.5, voltage: 185 },
    { pd: 0.68, voltage: 144 }, { pd: 0.9, voltage: 137 }, { pd: 1, voltage: 138 },
    { pd: 1.35, voltage: 146 }, { pd: 2, voltage: 169 }, { pd: 5, voltage: 280 },
    { pd: 10, voltage: 447 }, { pd: 20, voltage: 742 }, { pd: 50, voltage: 1517 },
    { pd: 100, voltage: 2666 },
  ],
  air: [
    { pd: 0.1, voltage: 5670 }, { pd: 0.3, voltage: 476 }, { pd: 0.43, voltage: 343 },
    { pd: 0.5, voltage: 330 }, { pd: 0.567, voltage: 327 }, { pd: 0.85, voltage: 349 },
    { pd: 1, voltage: 368 }, { pd: 2, voltage: 510 }, { pd: 5, voltage: 908 },
    { pd: 10, voltage: 1490 }, { pd: 20, voltage: 2528 }, { pd: 50, voltage: 5263 },
    { pd: 100, voltage: 8000 },
  ],
  helium: [
    { pd: 0.1, voltage: 8000 }, { pd: 0.3, voltage: 6361 }, { pd: 0.5, voltage: 3817 },
    { pd: 1, voltage: 1908 }, { pd: 2, voltage: 254 }, { pd: 3, voltage: 164 },
    { pd: 4, voltage: 156 }, { pd: 5, voltage: 159 }, { pd: 6, voltage: 166 },
    { pd: 10, voltage: 204 }, { pd: 20, voltage: 299 }, { pd: 50, voltage: 553 },
    { pd: 100, voltage: 924 },
  ],
  nitrogen: [
    { pd: 0.1, voltage: 5143 }, { pd: 0.3, voltage: 572 }, { pd: 0.5, voltage: 265 },
    { pd: 0.67, voltage: 251 }, { pd: 1, voltage: 267 }, { pd: 1.35, voltage: 292 },
    { pd: 2, voltage: 358 }, { pd: 5, voltage: 622 }, { pd: 10, voltage: 1012 },
    { pd: 20, voltage: 1704 }, { pd: 50, voltage: 3526 }, { pd: 100, voltage: 6238 },
  ],
  neon: [
    { pd: 0.1, voltage: 8000 }, { pd: 0.3, voltage: 7492 }, { pd: 0.5, voltage: 4495 },
    { pd: 1, voltage: 2248 }, { pd: 2, voltage: 275 }, { pd: 2.25, voltage: 258 },
    { pd: 3, voltage: 245 }, { pd: 4.5, voltage: 261 }, { pd: 5, voltage: 270 },
    { pd: 10, voltage: 371 }, { pd: 20, voltage: 564 }, { pd: 50, voltage: 1071 },
    { pd: 100, voltage: 1812 },
  ],
};

/** 가스별 Paschen 최소점 (위 표와 같은 출처 세트). */
export const PASCHEN_MINIMA = {
  argon: { pd: 0.9, voltage: 137 },
  air: { pd: 0.567, voltage: 327 },
  helium: { pd: 4.0, voltage: 156 },
  nitrogen: { pd: 0.67, voltage: 251 },
  neon: { pd: 3.0, voltage: 245 },
};

/**
 * 압력·에너지에 따른 상대 이온화 인자 (0~1).
 *
 * 교육용 현상론 모델이다. 최적 압력 3 Torr 를 중심으로 한 가우시안이며
 * 물리 모델(볼츠만 방정식·충돌 단면적)이 아니다. 압력·에너지에 대한 경향만
 * 보여 주는 용도이고 절대 이온화도는 실제 플라즈마와 다르다.
 */
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
 * ── 정확도 (교육용) ──
 * 자동 매칭 후 50 Ω 대비 편차는 13.56 MHz(실제 공정 주파수)에서 최대 0.7%,
 * 100 MHz 에서 최대 4.7% 다. 필요한 L·C 가 작아질수록 정수 nH/pF 반올림 영향이
 * 커지기 때문이며 계산식 문제가 아니다.
 *
 * 담지 않은 물리: 부하를 **순수 저항**으로 본다. 실제 플라즈마 부하는 복소
 * 임피던스이고 전력·압력·가스에 따라 변하므로 실제 장비의 매칭 지점과 다르다.
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
