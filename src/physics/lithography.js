/**
 * 포토레지스트 스핀 코팅 결과 계산.
 *
 * LithographySimulator.js 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 원본이 함수 안에서 직접 부르던 Math.random 만 인자로 주입받게 바꿨다.
 */

/**
 * 3단계 스핀 코팅 결과.
 * @param {object} processParams { step1_rpm, step1_time, step2_rpm, step2_time, step3_rpm, step3_time }
 * @param {() => number} rng 0~1 난수원
 * @returns {{prThickness:number, resolution:number, uniformity:number, defectDensity:number, cdUniformity:number}}
 */
export function calculateSpinCoatResults(processParams, rng = Math.random) {
  const { step1_rpm, step1_time, step2_rpm, step2_time, step3_rpm, step3_time } = processParams;

  // 두께: 스핀 코팅의 기본 관계는 Emslie–Bonner–Peck 해에서 나오는 t ∝ ω^(−1/2) 다.
  // 회전수를 4배로 올리면 두께가 절반이 된다.
  //
  // 예전 구현은 구간별 1차식이었고, 2000~4000 rpm 구간은 아예 난수만 돌려
  // 회전수와 무관했다 (2000 rpm 과 4000 rpm 의 두께가 같았다).
  //
  //
  // ── 정확도 (교육용) ──
  // 회전수만 반영한다. 실제 두께는 PR 점도·고형분·용매 증발 속도·스핀 시간에
  // 함께 좌우되므로 실제 장비 값과 다를 수 있다. 아래 정규화(3000 rpm = 1000 nm)도
  // 특정 PR 하나를 가정한 것이다. 회전수-두께의 지배 관계를 보는 용도다.
  //
  // REFERENCE_RPM 에서 REFERENCE_THICKNESS 가 나오도록 정규화한다.
  const REFERENCE_RPM = 3000;
  const REFERENCE_THICKNESS = 1000; // nm
  const rpm = Math.max(step2_rpm, 1); // 0 rpm 은 발산하므로 막는다
  const nominalThickness = REFERENCE_THICKNESS * Math.sqrt(REFERENCE_RPM / rpm);
  // 실제 코팅의 런투런 산포 (±1%)
  const thickness = Math.max(0, nominalThickness * (1 + (rng() - 0.5) * 0.02));

  // 균일도 계산 (기본 99%, 조건에 따라 감소)
  let uniformity = 99;

  // 1단계 영향: PR 분산 효과
  if (step1_rpm >= 400 && step1_rpm <= 600 && step1_time >= 4) {
    uniformity += 0; // 최적 조건 유지
  } else {
    if (step1_rpm < 300) uniformity -= 8;
    else if (step1_rpm > 800) uniformity -= 6;
    else uniformity -= 3;

    if (step1_time < 4) uniformity -= 4;
  }

  // 2단계 영향: 가장 중요한 단계
  if (step2_rpm >= 2500 && step2_rpm <= 3500 && step2_time >= 20) {
    uniformity += 0; // 최적 조건
  } else {
    if (step2_rpm < 1500) uniformity -= 15;
    else if (step2_rpm < 2000) uniformity -= 8;
    else if (step2_rpm > 5000) uniformity -= 12;
    else if (step2_rpm > 4500) uniformity -= 6;
    else uniformity -= 2;

    if (step2_time < 15) uniformity -= 5;
    else if (step2_time > 50) uniformity -= 3;
  }

  // 3단계 영향: 안정화
  if (step3_rpm === 0 && step3_time >= 2) {
    uniformity += 0; // 최적 조건
  } else {
    if (step3_rpm > 0) uniformity -= 2;
    if (step3_time < 2) uniformity -= 1;
  }

  uniformity = Math.min(99.5, Math.max(70, uniformity));

  // 해상도 (PR 코팅과 직접 관련 없으므로 고정값)
  const resolution = 88 + rng() * 4; // 88-92% 범위

  // 결함 밀도 (균일도와 반비례)
  const defectDensity = Math.max(0.1, (100 - uniformity) * 0.15);

  // CD 균일도
  const cdUniformity = Math.min(100, (uniformity + resolution) / 2);

  return { prThickness: thickness, resolution, uniformity, defectDensity, cdUniformity };
}
