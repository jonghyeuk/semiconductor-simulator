/**
 * PECVD 막질 계산.
 *
 * PECVDSimulator.jsx 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 *
 * ── 정확도 (교육용) ──
 * 문헌 데이터에 맞춘 구간별 근사식이다. 가스비·온도에 따른 굴절률·H 함량·막 밀도의
 * **경향**을 보여 주는 용도이고, 절대값은 장비와 레시피에 따라 다르다.
 */

/**
 * SiO2 굴절률 (N2O/SiH4 비율 기준).
 * ratio 5 → n ≈ 1.55 (Si-rich), 14 → 1.46 (stoichiometric), 25 → 1.44 (O-rich)
 */
export function calculateRefractiveIndex(ratio) {
  // O-rich 쪽 하한 1.4. 화학량론 SiO2 가 1.46 이고 O 과잉·다공성으로 갈수록
  // 낮아지지만 산화막 굴절률이 1.4 아래로 내려가지는 않는다.
  // (하한이 없으면 비율이 커질수록 1 미만, 결국 음수까지 내려간다.)
  const SIO2_O_RICH_FLOOR = 1.4;
  let n;
  if (ratio < 10) n = 1.55 - (ratio - 5) * 0.012;
  else if (ratio < 14) n = 1.49 - (ratio - 10) * 0.0075;
  else if (ratio <= 18) n = 1.46 - (ratio - 14) * 0.003;
  else n = 1.448 - (ratio - 18) * 0.001;
  return Math.max(SIO2_O_RICH_FLOOR, n);
}

/** 기판 온도에 따른 H 함량 (at%). */
export function calculateHydrogenContent(temp) {
  return Math.max(5, 35 - temp * 0.07);
}

/** 기판 온도에 따른 막 밀도 (상대값 %). */
export function calculateFilmDensity(temp) {
  return Math.min(100, 60 + temp * 0.1);
}

/** a-Si:H — H2 희석비에 따른 댕글링 본드 밀도 (×10^15 cm^-3). */
export function calculateDanglingBondDensity(dilution) {
  if (dilution < 3) return 50 - dilution * 5;
  if (dilution < 10) return 35 - (dilution - 3) * 2.5;
  if (dilution < 20) return 17.5 - (dilution - 10) * 1.0;
  return Math.max(3, 7.5 - (dilution - 20) * 0.3);
}

/** a-Si:H — H2 희석비에 따른 H 함량 (at%). */
export function calculateaSiHContent(dilution) {
  if (dilution < 5) return 15 - dilution * 0.4;
  if (dilution < 15) return 13 - (dilution - 5) * 0.2;
  return Math.max(8, 11 - (dilution - 15) * 0.1);
}

/**
 * SiNx 굴절률 (NH3/SiH4 비율 기준).
 *
 * N-rich 쪽 하한은 1.8 이다. 화학량론 Si3N4 가 2.0 이고, N 과잉으로 갈수록
 * 낮아지지만 질화막의 굴절률이 1.8 아래로 내려가지는 않는다.
 * (예전에는 하한이 없어 비율 43 을 넘으면 n < 1 이라는 물리적으로 불가능한 값이 나왔다.)
 */
export function calculateSiNxRefractiveIndex(ratio) {
  const SI_NITRIDE_N_RICH_FLOOR = 1.8;
  let n;
  if (ratio < 5) n = 2.3 - (ratio - 2) * 0.06;
  else if (ratio < 10) n = 2.12 - (ratio - 5) * 0.024;
  else n = 2.0 - (ratio - 10) * 0.03;
  return Math.max(SI_NITRIDE_N_RICH_FLOOR, n);
}

/** SiNx N/Si 원자비. 원자비는 음수가 될 수 없다. */
export function calculateNSiRatio(ratio) {
  return Math.max(0, Math.min(1.6, 0.6 + ratio * 0.07));
}
