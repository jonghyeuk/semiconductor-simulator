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

  // 두께 계산 (2단계 RPM에 주로 의존, 기본 1000nm 목표)
  let thickness = 1000;

  if (step2_rpm < 2000) {
    thickness = 1000 + (2000 - step2_rpm) * 0.1; // 저속일 때 두꺼워짐 (최대 +100nm)
  } else if (step2_rpm > 4000) {
    thickness = 1000 - (step2_rpm - 4000) * 0.05; // 고속일 때 얇아짐 (최대 -100nm)
  } else {
    // 최적 범위(2000-4000)에서는 목표 두께 근처
    thickness = 1000 + (rng() - 0.5) * 20; // ±10nm 내외
  }

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
