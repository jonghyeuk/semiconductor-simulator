/**
 * ICP 고급 식각 계산 (Plasma Simulation II).
 *
 * PlasmaSimulatorII.js 에서 옮겨왔다. 식은 그대로이고 입력 가드만 추가했다.
 *
 * ── 정확도 (교육용) ──
 * 1차 원리 계산이 아니라 경향을 보여 주는 경험식이다. 파워·압력의 거듭제곱 지수와
 * 가스별 계수는 실측 fitting 이 아니라 교육용으로 잡은 값이다.
 * 절대 식각률·선택비는 장비와 챔버 형상에 따라 크게 다르다.
 */

/** 가스별 상대 식각 계수. */
export const ETCH_GAS_FACTORS = { CF4: 1.0, Cl2: 1.2, Ar: 0.3, O2: 0.8 };

/** 가스별 기준 선택비. */
export const ETCH_GAS_SELECTIVITY = { CF4: 15, Cl2: 8, Ar: 2, O2: 25 };

/**
 * 식각률 (nm/min).
 *
 *   rate ∝ (P/100)^0.5 · (p/10)^0.3 · f_gas · f_temp · f_density
 *
 * @param {object} p
 * @param {string} p.gasType 'CF4' | 'Cl2' | 'Ar' | 'O2'
 * @param {number} p.power W (UI 50~500)
 * @param {number} p.pressure mTorr (UI 1~100)
 * @param {number} p.substrateTemp °C (UI 0~300)
 * @param {number} p.patternDensity % (UI 0~100)
 */
export function calculateEtchRate({ gasType, power, pressure, substrateTemp, patternDensity }) {
  const gasFactor = ETCH_GAS_FACTORS[gasType] || 1.0;
  const safePower = Math.max(0, power);
  const safePressure = Math.max(0, pressure);

  // 기판 온도가 낮으면 반응이 느려지지만 식각이 역방향으로 진행될 수는 없다.
  // UI 범위(0~300°C)에서는 걸리지 않지만, −100°C 를 넣으면 음수 식각률이 나왔다.
  const tempFactor = Math.max(0, 1 + (substrateTemp - 20) * 0.01);
  // 패턴 밀도가 높을수록 로딩 효과로 느려진다. 0 아래로는 내려가지 않는다.
  const densityFactor = Math.max(0, 1 - (Math.max(0, patternDensity) / 100) * 0.3);

  const baseRate = Math.pow(safePower / 100, 0.5) * Math.pow(safePressure / 10, 0.3);
  const rate = baseRate * gasFactor * tempFactor * densityFactor * 100;
  return Number.isFinite(rate) ? Math.max(0, rate) : 0;
}

/**
 * 선택비 (타겟 : 하부층).
 *
 * 고전력일수록 물리 충격이 우세해져 선택비가 떨어진다.
 *
 * @param {string} gasType
 * @param {number} power W
 */
export function calculateSelectivity(gasType, power) {
  const baseSelectivity = ETCH_GAS_SELECTIVITY[gasType] || 10;
  const powerEffect = 1 - (Math.max(0, power) - 100) / 1000;
  return baseSelectivity * Math.max(0.2, powerEffect);
}
