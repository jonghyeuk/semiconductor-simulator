/**
 * 금속 배선 계산 (선 저항 · 일렉트로마이그레이션 수명).
 *
 * MetallizationEDSPackagingSimulator.jsx 에서 옮겨왔다.
 *
 * ── 정확도 (교육용) ──
 * 선 저항에는 나노스케일 크기효과(ρ_eff = ρ_bulk·(1 + λ/w))를 넣었다. 다만 이는
 * 표면·결정립계 산란을 한 항으로 줄인 근사이고, 배리어·라이너가 차지하는 단면
 * 비중은 담지 않았다. 단면도 정사각으로 보므로 종횡비 2 인 실제 배선보다 저항을
 * 높게 잡는다.
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
 * 전자 평균자유행로 (nm, 300 K).
 *
 * 선폭이 이 값에 가까워지면 표면·결정립계 산란으로 유효 비저항이 벌크보다
 * 크게 올라간다. 평균자유행로가 긴 금속(Cu 39 nm)일수록 미세화에서 손해가 크고,
 * 짧은 금속(Co ~11 nm)은 상대적으로 덜 나빠진다. 이것이 7 nm 이하 노드에서
 * Co·Ru 가 검토되는 이유다.
 */
export const ELECTRON_MEAN_FREE_PATH_NM = {
  aluminum: 19,
  copper: 39,
  tungsten: 15,
  cobalt: 11.8,
};

/**
 * 나노스케일 유효 비저항 배율.
 *
 *   ρ_eff / ρ_bulk ≈ 1 + λ / w
 *
 * Fuchs–Sondheimer(표면 산란)와 Mayadas–Shatzkes(결정립계 산란)를 합친 거동을
 * 한 항으로 줄인 교육용 근사다. 계수 1 은 두 기여를 뭉뚱그린 값이라 실제
 * 배선의 유효 비저항과 정확히 맞지는 않는다.
 *
 * 예전에는 이 항이 아예 없어 벌크 비저항만 썼다. 그래서 선폭 10 nm 에서도
 * Cu 가 Co 보다 항상 3.71배 유리하게 나왔고, 같은 화면이 네 군데에서 가르치는
 * "7 nm 이하에서 Cu 의 저항 증가가 심각하다" 는 설명이 슬라이더로 재현되지 않았다.
 *
 * 다만 이 항만으로는 Cu↔Co 역전이 나오지 않는다. 실제 역전은 배리어·라이너가
 * 차지하는 단면 비중까지 함께 봐야 하는데(Cu 는 더 두꺼운 배리어가 필요하다)
 * 이 모델에는 담지 않았다.
 */
export function sizeEffectFactor(metal, lineWidthNm) {
  const lambda = ELECTRON_MEAN_FREE_PATH_NM[metal];
  if (lambda === undefined || !(lineWidthNm > 0)) return 1;
  return 1 + lambda / lineWidthNm;
}

/**
 * 일렉트로마이그레이션 파라미터.
 *
 * ea: 활성화 에너지 (eV). 내화금속(W, Co)일수록 원자 이동이 어려워 크다.
 *   Al 0.7 은 순 Al 이 아니라 실제 배선에 쓰는 Al(Cu) 합금 기준이다.
 *   Cu 0.9 는 표면확산 지배, Co 1.2 는 Co/low-k 계면 보고값 대역이다.
 *   W 1.5 는 배선 EM 문헌에서 수치를 찾지 못했고, 융점·자기확산으로 보아
 *   가장 크다는 방향만 확인했다.
 * referenceMttfYears: 기준 조건(1 MA/cm², 100°C)에서의 수명 (년).
 *
 * 예전 구현은 `Ea = metalType === 'copper' ? 0.9 : 0.7` 이라 W 와 Co 가 Al 의
 * 활성화 에너지를 그대로 받았다. 그 결과 시뮬레이터 자체 표에는 W 가
 * "Very High" 내성으로 적혀 있는데 계산은 Cu 를 W 보다 168배 좋게 내놓았다.
 *
 * 그 뒤 Ea 는 금속별로 갈랐지만 referenceMttfYears 를 5/50/100/200 으로 **따로**
 * 손으로 잡아 두는 바람에, 두 값이 서로 다른 근거에서 온 상태가 됐다.
 * 정규화 형태 MTTF_ref·exp[(Ea/k)(1/T − 1/T_ref)] 에서는 Ea 가 클수록 T_ref
 * 위에서 더 급격히 짧아지므로 교차가 필연이다. 실제로 약 130°C 를 넘으면
 * 순서가 Cu > Co > W 로 뒤집혔고, 200°C 에서는 Cu > Al > Co > W 까지 갔다.
 * EM 가속시험이 250~350°C 에서 이뤄지는 것을 생각하면 쓰기 곤란한 상태였다.
 *
 * 공통 전인자에서 기준 수명을 유도해 보면 Cu/Al 이 503배가 되는데, 실제 Cu 배선의
 * EM 이점은 Al 대비 10~100배로 보고된다. 즉 전인자도 금속마다 다르다 — Cu 의
 * 이점은 Ea 만이 아니라 미세조직·계면에서도 온다. 그래서 공통 전인자 가정은 쓰지
 * 않고, 실제 상대 성능에 맞춘 기준 수명을 그대로 둔다.
 *
 * 대신 이 모델이 **기준 온도 근방에서만 금속 간 비교가 유효**하다는 것을 명시하고
 * 온도 인자를 그 범위로 제한한다. Ea 와 기준 수명이 서로 다른 근거에서 온 이상
 * 교차는 피할 수 없고, 억지로 없애려면 둘 중 하나를 문헌과 어긋나게 만들어야 한다.
 */
export const METAL_EM = {
  aluminum: { ea: 0.7, referenceMttfYears: 5 },
  copper: { ea: 0.9, referenceMttfYears: 50 },
  cobalt: { ea: 1.2, referenceMttfYears: 100 },
  tungsten: { ea: 1.5, referenceMttfYears: 200 },
};

/**
 * 금속 간 비교가 유효한 온도 범위 (K). 25~125°C.
 *
 * 이 위로 올라가면 Ea 가 큰 금속이 더 급격히 짧아져 순서가 뒤집힌다.
 * 실제로 약 130°C 에서 Cu 가 Co·W 를 앞지르고, 200°C 에서는 Cu > Al > Co > W
 * 까지 간다. 시뮬레이터 자체 표(W = Very High 내성)와 정반대다.
 */
export const EM_VALID_TEMP_RANGE_K = [298.15, 398.15];

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

  const rhoEff = rho * sizeEffectFactor(metal, lineWidthNm);
  const rhoOhmM = rhoEff * 1e-8; // μΩ·cm → Ω·m
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

  // 유효 범위 밖에서는 금속 간 순서가 뒤집히므로 온도를 범위 안으로 묶는다.
  // 절대 수명을 예측하는 모델이 아니라 상대 비교용이므로, 범위 밖 외삽을
  // 그대로 내보내는 것보다 경계값을 주는 편이 오해가 적다.
  const [tMin, tMax] = EM_VALID_TEMP_RANGE_K;
  const tClamped = Math.min(tMax, Math.max(tMin, temperatureK));

  const currentTerm = Math.pow(J_REF / currentDensityMAcm2, 2);
  const arrhenius = Math.exp((em.ea / K_EV) * (1 / tClamped - 1 / T_REF));
  return em.referenceMttfYears * currentTerm * arrhenius;
}
