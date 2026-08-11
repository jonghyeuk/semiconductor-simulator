/**
 * PECVD 막질 계산.
 *
 * PECVDSimulator.jsx 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 */

/**
 * SiO2 굴절률 (N2O/SiH4 비율 기준).
 * ratio 5 → n ≈ 1.55 (Si-rich), 14 → 1.46 (stoichiometric), 25 → 1.44 (O-rich)
 */
export function calculateRefractiveIndex(ratio) {
  if (ratio < 10) return 1.55 - (ratio - 5) * 0.012;
  if (ratio < 14) return 1.49 - (ratio - 10) * 0.0075;
  if (ratio <= 18) return 1.46 - (ratio - 14) * 0.003;
  return 1.448 - (ratio - 18) * 0.001;
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

/** SiNx 굴절률 (NH3/SiH4 비율 기준). */
export function calculateSiNxRefractiveIndex(ratio) {
  if (ratio < 5) return 2.3 - (ratio - 2) * 0.06;
  if (ratio < 10) return 2.12 - (ratio - 5) * 0.024;
  return 2.0 - (ratio - 10) * 0.03;
}

/** SiNx N/Si 원자비. */
export function calculateNSiRatio(ratio) {
  return Math.min(1.6, 0.6 + ratio * 0.07);
}
