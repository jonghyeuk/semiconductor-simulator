/**
 * 금속 배선 계산 (선 저항 · 일렉트로마이그레이션 수명).
 *
 * MetallizationEDSPackagingSimulator.jsx 에서 옮겨왔다.
 *
 * ── 정확도 (교육용) ──
 * 선 저항은 벌크 비저항 기준이다. 실제 나노 스케일 배선은 표면·결정립계 산란으로
 * 유효 비저항이 벌크보다 크게 올라가므로 실제 저항은 이보다 높다.
 * 일렉트로마이그레이션 수명은 기준 조건에 맞춘 교육용 값이라 실제 소자의
 * 신뢰성 수명과 다르다. 금속 간 상대 비교와 전류밀도 의존성(J⁻²)을 보는 용도다.
 */

/** 벌크 비저항 (μΩ·cm). */
export const METAL_RESISTIVITY = {
  aluminum: 2.65,
  copper: 1.68,
  tungsten: 5.6,
  cobalt: 6.24,
};

/**
 * 일렉트로마이그레이션 파라미터.
 *
 * ea: 활성화 에너지 (eV). 내화금속(W, Co)일수록 원자 이동이 어려워 크다.
 * referenceMttfYears: 기준 조건(1 MA/cm², 100°C)에서의 수명 (년).
 *
 * 예전 구현은 `Ea = metalType === 'copper' ? 0.9 : 0.7` 이라 W 와 Co 가 Al 의
 * 활성화 에너지를 그대로 받았다. 그 결과 시뮬레이터 자체 표에는 W 가
 * "Very High" 내성으로 적혀 있는데 계산은 Cu 를 W 보다 168배 좋게 내놓았다.
 */
export const METAL_EM = {
  aluminum: { ea: 0.7, referenceMttfYears: 5 },
  copper: { ea: 0.9, referenceMttfYears: 50 },
  cobalt: { ea: 1.2, referenceMttfYears: 100 },
  tungsten: { ea: 1.5, referenceMttfYears: 200 },
};

/** 볼츠만 상수 (eV/K). */
const K_EV = 8.617e-5;
/** 기준 전류밀도 (MA/cm²) · 기준 온도 (K). */
const J_REF = 1.0;
const T_REF = 373.15; // 100°C

/**
 * 배선 선 저항.
 *
 *   R = ρ·L / A,  정사각 단면이라 A = w²
 *
 * @param {string} metal 'aluminum' | 'copper' | 'tungsten' | 'cobalt'
 * @param {number} lineWidthNm 선폭 (nm) — 단면은 정사각으로 본다
 * @param {number} lineLengthNm 선 길이 (nm)
 * @returns {number} 저항 (Ω)
 */
export function calcLineResistance(metal, lineWidthNm, lineLengthNm) {
  const rho = METAL_RESISTIVITY[metal];
  if (rho === undefined) return 0;
  if (!(lineWidthNm > 0) || !(lineLengthNm > 0)) return 0;

  const rhoOhmM = rho * 1e-8; // μΩ·cm → Ω·m
  const lengthM = lineLengthNm * 1e-9;
  const areaM2 = Math.pow(lineWidthNm * 1e-9, 2);
  return (rhoOhmM * lengthM) / areaM2;
}

/**
 * 일렉트로마이그레이션 평균 고장 시간 (Black 식).
 *
 *   MTTF = A · j⁻ⁿ · exp(Ea / kT),   n = 2
 *
 * 절대 전인자 A 는 공정마다 달라 추정할 수 없으므로, 기준 조건
 * (1 MA/cm², 100°C)의 수명에 맞춰 정규화한 형태로 쓴다:
 *
 *   MTTF = MTTF_ref · (j_ref / j)² · exp[(Ea/k)·(1/T − 1/T_ref)]
 *
 * 이렇게 하면 J⁻² 의존성과 온도 의존성(Arrhenius)이 그대로 살아 있으면서
 * 절대값이 교육적으로 말이 되는 범위(년 단위)에 들어온다.
 *
 * @param {string} metal
 * @param {number} currentDensityMAcm2 전류밀도 (MA/cm²)
 * @param {number} temperatureK 온도 (K). 기본값 373.15 K (100°C)
 * @returns {number} 평균 고장 시간 (년)
 */
export function calcElectromigrationMTTF(metal, currentDensityMAcm2, temperatureK = T_REF) {
  const em = METAL_EM[metal];
  if (!em) return 0;
  if (!(currentDensityMAcm2 > 0)) return Infinity; // 전류가 없으면 EM 도 없다
  if (!(temperatureK > 0)) return Infinity;

  const currentTerm = Math.pow(J_REF / currentDensityMAcm2, 2);
  const arrhenius = Math.exp((em.ea / K_EV) * (1 / temperatureK - 1 / T_REF));
  return em.referenceMttfYears * currentTerm * arrhenius;
}
