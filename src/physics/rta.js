/**
 * RTA 온도 프로파일 계산.
 *
 * RTASimulator.jsx 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 컴포넌트 state 로 읽던 값은 인자로 바꿨을 뿐 식은 동일하다.
 */

/** 존별 열 시정수 (초). */
export const ZONE_TIME_CONSTANTS = [0.5, 0.75, 0.75, 1.0, 1.0, 1.25];

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
    return targetTemp - (targetTemp - 25) * Math.pow(coolProgress, 0.7);
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
 * 존별 열 지연을 1차 지연계로 한 스텝 적분한다 (explicit Euler).
 * @param {number[]} zoneTemps 현재 존 온도
 * @param {number[]} setpoints 존 설정 온도
 * @param {number} deltaTime 시간 간격 (초)
 * @returns {number[]} 다음 스텝 존 온도
 */
export function stepZoneTemperatures(zoneTemps, setpoints, deltaTime) {
  return zoneTemps.map((currentTemp, idx) => {
    const setpoint = setpoints[idx];
    const timeConstant = ZONE_TIME_CONSTANTS[idx];
    const tempChange = ((setpoint - currentTemp) / timeConstant) * deltaTime;
    return currentTemp + tempChange;
  });
}
