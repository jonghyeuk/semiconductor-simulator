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

/**
 * 램프다운 구간의 **평균** 냉각률 (°C/s).
 *
 * 냉각은 램프를 끈 뒤의 복사 방열이라 사용자가 고른 램프업 속도와 무관하다.
 * 예전에는 rampDownTime = (T−25)/(rampRate × 0.3) 이라 램프업 속도에 비례시켰고,
 * 같은 1000°C 웨이퍼인데도 25 °C/s 를 고르면 7.5 °C/s, 300 °C/s 를 고르면
 * 90 °C/s 로 12배가 달라졌다.
 *
 * 아래 지수 감쇠 형상에서 초기 냉각률은 평균의 약 3.16배(= 3/(1−e⁻³))가 된다.
 * 문헌 RTP 램프다운 실측이 80~150 °C/s 대이므로 평균 40 을 잡으면 초기 ≈126 °C/s
 * 가 되어 그 대역에 들어온다. 양면 복사 웨이퍼(775 µm, ε≈0.7)의 1000°C 방열
 * 계산값 ≈125 °C/s 와도 맞는다.
 */
const COOLING_RATE_AVG = 40;
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
  const rampDownTime = (targetTemp - 25) / COOLING_RATE_AVG;

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

/**
 * 존별 설정 온도 (제어 목표값).
 *
 * 웨이퍼 가장자리는 측면 복사 손실 때문에 온도가 떨어진다. 그래서 다구역 RTP 는
 * 최외곽 존의 설정 온도와 램프 출력을 **더 높게** 잡아 이를 보상한다.
 *
 * 예전 구현은 정반대였다. 중앙(idx 0)을 기준으로 가장자리로 갈수록 설정 온도를
 * 8°C 까지 **빼고** 있었다. 시뮬레이터 본문이 "각 Zone 을 독립 제어해 온도
 * 균일성을 확보한다" 고 설명하는데 코드는 보상이 아니라 편차를 만들고 있었다.
 *
 * 램프 출력 항도 뺐다. 설정값은 제어의 **입력**이고 램프 출력은 그 **결과**인데,
 * 예전 식은 출력이 설정값을 밀어 올려 순환 구조였다. 그 결과 hold 구간에서
 * 모든 존의 설정 온도가 목표보다 항상 2°C 이상 높았다.
 *
 * @param {number} globalSetpoint 전체 목표 온도 (°C)
 * @param {number[]} lampPower 존별 램프 출력 (%). 길이만 쓴다.
 */
export function computeZoneSetpoints(globalSetpoint, lampPower) {
  return lampPower.map((_power, idx) => {
    // 가장자리로 갈수록 손실 보상분을 **더한다**.
    const edgeCompensation = idx === 0 ? 0 : idx < 3 ? 2 : idx < 5 ? 5 : 8;
    return Math.max(25, globalSetpoint + edgeCompensation);
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
