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
  // 18:1 위에서 기울기가 0.001/step 이라 슬라이더 최대(25:1, 화면 라벨 "O-rich")
  // 에서도 n=1.441 이 나와 목표 1.46±0.02 를 통과했다. 화면은 O-rich 라고 하면서
  // "성공! 이상적인 화학량론적 SiO2 막" 팝업을 띄우고 있었다.
  // 같은 화면 이론이 말하는 "n < 1.45 = O-rich" 와 맞도록 기울기를 세운다.
  else n = 1.448 - (ratio - 18) * 0.003;
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
  // 굴절률을 조성(N/Si)에서 직접 유도한다. 예전에는 굴절률과 N/Si 가 서로
  // 독립된 구간 함수라, 같은 화면에 띄우면서 **서로 다른 화학량론 지점**을
  // 가리켰다. n = 2.0 은 비율 10 에서, N/Si = 1.333 은 비율 10.47 에서 지났고,
  // UI 는 그와 무관하게 8:1 을 "화학양론"이라고 표시했다 (실제 N/Si 는 1.16).
  //
  // 문헌 앵커 두 개로 직선을 잡는다.
  //   - 굴절률은 N 함량에 대해 선형으로 감소한다.
  //   - 화학량론 조성 N/Si = 1.333 에서 n = 2.00 ± 0.02 (633 nm).
  // 기울기는 비정질 실리콘 극한 n ≈ 3.3 (x = 0) 을 두 번째 점으로 잡아
  // (3.3 − 2.0) / 1.333 ≈ 0.975 로 둔다. 이 기울기의 출처는 원문으로 확인하지
  // 못했고, 선형성과 화학량론 지점만 확인했다.
  const n = 3.3 - 0.975 * calculateNSiRatio(ratio);
  return Math.max(SI_NITRIDE_N_RICH_FLOOR, n);
}

/** SiNx N/Si 원자비. 원자비는 음수가 될 수 없다. */
export function calculateNSiRatio(ratio) {
  return Math.max(0, Math.min(1.6, 0.6 + ratio * 0.07));
}

/** 화학량론 Si3N4 (N/Si = 4/3) 가 되는 NH3/SiH4 비. */
export const SINX_STOICHIOMETRIC_RATIO = (4 / 3 - 0.6) / 0.07;
