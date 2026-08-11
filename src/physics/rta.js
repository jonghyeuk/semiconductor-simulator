/**
 * RTA 온도 프로파일 계산.
 *
 * RTASimulator.jsx 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 컴포넌트 state 로 읽던 값은 인자로 바꿨을 뿐 식은 동일하다.
 *
 * ── 정확도 (교육용) ──
 * 램프업은 선형, soak 은 일정, 냉각은 뉴턴 냉각으로 본 이상화된 프로파일이다.
 * 존별 열 지연은 1차 지연계로 근사했다. 실제 RTA 는 램프 출력 제어·웨이퍼
 * 방사율·가스 유동에 좌우되므로 실측 온도 곡선과 다르다.
 */

/** 존별 열 시정수 (초). */
export const ZONE_TIME_CONSTANTS = [0.5, 0.75, 0.75, 1.0, 1.0, 1.25];

/** 냉각 지수 감쇠 상수 (램프다운 구간에서 e^-3 ≈ 5% 까지 떨어진다). */
const COOLING_DECAY = 3;
const COOLING_END_VALUE = Math.exp(-COOLING_DECAY);

/**
 * 시간에 따른 이상적인 웨이퍼 온도.
 * @param {number} time 초
 * @param {object} p { targetTemp(°C), rampRate(°C/s), processTime(s) }
 * @returns {number} °C
 */
export function calculateTempProfile(time, { targetTemp, rampRate, processTime }) {
  const gasStabilizationTime = 10;
  const totalRampUpTime = (targetTemp - 25) / rampRate;
  const rampDownTime = (targetTemp - 25) / (rampRate * 0.3);

  if (time <= gasStabilizationTime) {
    return 25;
  } else if (time <= gasStabilizationTime + totalRampUpTime) {
    const rampTime = time - gasStabilizationTime;
    return 25 + rampRate * rampTime;
  } else if (time <= gasStabilizationTime + totalRampUpTime + processTime) {
    return targetTemp;
  } else if (time <= gasStabilizationTime + totalRampUpTime + processTime + rampDownTime) {
    const coolTime = time - (gasStabilizationTime + totalRampUpTime + processTime);
    const coolProgress = coolTime / rampDownTime;
    // 뉴턴 냉각(지수 감쇠). 예전의 (t/τ)^0.7 은 t = 0 에서 도함수가 무한대라
    // soak 이 끝나는 순간 냉각 속도가 발산했다. 지수형은 초기 기울기가 유한하다.
    // 구간 끝에서 정확히 상온이 되도록 정규화한다.
    const decay = Math.exp(-COOLING_DECAY * coolProgress);
    const normalized = (decay - COOLING_END_VALUE) / (1 - COOLING_END_VALUE);
    return 25 + (targetTemp - 25) * normalized;
  }
  return 25;
}

/** 램프 출력에 따른 존별 설정 온도. */
export function computeZoneSetpoints(globalSetpoint, lampPower) {
  return lampPower.map((power, idx) => {
    const powerFactor = power / 100;
    const positionOffset = idx === 0 ? 0 : idx < 3 ? 2 : idx < 5 ? 5 : 8;
    return Math.max(25, globalSetpoint - positionOffset + powerFactor * 10);
  });
}

/**
 * 존별 열 지연을 1차 지연계로 한 스텝 적분한다.
 *
 *   dT/dt = (T_sp − T) / τ   의 해석해   T(t+Δt) = T_sp + (T − T_sp)·e^(−Δt/τ)
 *
 * 예전에는 explicit Euler (T + (T_sp − T)/τ·Δt) 를 썼다. 이건 Δt > 2τ 에서
 * 발산한다. 가장 작은 시정수가 0.5 초라 Δt ≥ 1.0 초면 바로 진동했고, 앱이
 * Δt = 0.1 로 부르고 있어서 우연히 안전했을 뿐이다.
 * 해석해는 어떤 Δt 에서도 설정 온도를 지나치지 않는다.
 *
 * @param {number[]} zoneTemps 현재 존 온도
 * @param {number[]} setpoints 존 설정 온도
 * @param {number} deltaTime 시간 간격 (초)
 * @returns {number[]} 다음 스텝 존 온도
 */
export function stepZoneTemperatures(zoneTemps, setpoints, deltaTime) {
  return zoneTemps.map((currentTemp, idx) => {
    const setpoint = setpoints[idx];
    const timeConstant = ZONE_TIME_CONSTANTS[idx];
    if (!(timeConstant > 0) || !(deltaTime > 0)) return currentTemp;
    return setpoint + (currentTemp - setpoint) * Math.exp(-deltaTime / timeConstant);
  });
}
