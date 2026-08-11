/**
 * 진공 배기 계산.
 *
 * VacuumSimulator.js 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 */

/** 압력(Torr)에 따른 터보펌프 회전 속도 단계. */
export function calculateTurboSpeed(pressure) {
  if (pressure <= 1e-6) return 300;
  if (pressure <= 1e-5) return 300;
  if (pressure <= 1e-4) return 295;
  if (pressure <= 1e-3) return 280;
  if (pressure <= 1e-2) return 250;
  if (pressure <= 1e-1) return 180;
  if (pressure <= 1) return 80;
  return 20;
}

/** sccm → Torr·L/s 환산. */
export function convertSccmToTorrLs(sccm) {
  return sccm * 0.0095;
}

/**
 * 배기 속도 m³/h → L/s.
 * 이 시뮬레이터의 펌프 모델 곡선(pumpModels)은 m³/h 단위이고 화면도 그렇게 표시한다.
 * 반면 배기 시간 식은 L/s 를 쓰므로 반드시 여기를 거쳐야 한다.
 * 1 m³/h = 1000 L / 3600 s
 */
export function convertM3hToLs(speedM3h) {
  return speedM3h / 3.6;
}

/**
 * 펌프 모델의 속도 곡선을 log(압력)으로 선형 보간한다.
 * @param {number} pressure Torr
 * @param {Array<{data: Array<{pressure:number, speed:number}>, maxSpeed:number}>} pumpModels
 * @param {number} modelNumber 모델 인덱스
 */
export function calculatePumpingSpeed(pressure, pumpModels, modelNumber) {
  const model = pumpModels[Math.round(modelNumber)];
  if (!model) return 250;

  if (pressure <= 0.02) return model.data[0].speed;
  if (pressure >= 760) return model.data[model.data.length - 1].speed;

  const logPressure = Math.log10(pressure);

  for (let i = 0; i < model.data.length - 1; i++) {
    const current = model.data[i];
    const next = model.data[i + 1];

    if (
      logPressure >= Math.log10(current.pressure) &&
      logPressure <= Math.log10(next.pressure)
    ) {
      const ratio =
        (logPressure - Math.log10(current.pressure)) /
        (Math.log10(next.pressure) - Math.log10(current.pressure));
      return current.speed + (next.speed - current.speed) * ratio;
    }
  }

  return model.maxSpeed / 2;
}

/** 압력을 0~100 슬라이더 값으로 (log 스케일). */
export function pressureToSliderValue(pressure) {
  const minLog = Math.log10(0.02);
  const maxLog = Math.log10(760);
  const currentLog = Math.log10(pressure);
  return ((currentLog - minLog) / (maxLog - minLog)) * 100;
}

/**
 * 배기 속도가 일정하다고 볼 때의 배기 시간.
 *
 *   t = (V / S) · ln(Pi / Pf)
 *
 * V 를 L, S 를 **L/s** 로 넣으면 t 는 초다. 분으로 바꾸려면 60 으로 나눈다.
 *
 * 주의: 펌프 모델 곡선은 m³/h 단위이므로 그대로 넣으면 안 된다.
 * convertM3hToLs 를 거치거나, 압력에 따라 속도가 변하는 실제 상황에서는
 * calculatePumpingTimeFromCurve 를 쓸 것.
 *
 * @param {number} volume 챔버 부피 (L)
 * @param {number} initialPressure Torr
 * @param {number} finalPressure Torr
 * @param {number} pumpSpeed L/s
 * @returns {number} 분
 */
export function calculatePumpingTime(volume, initialPressure, finalPressure, pumpSpeed) {
  if (finalPressure <= 0.02) finalPressure = 0.02;
  if (initialPressure <= finalPressure) return 0;
  if (!(volume > 0)) return 0; // 부피가 없으면 뺄 기체도 없다 (음수 부피는 성립 불가)
  if (!(pumpSpeed > 0)) return Infinity; // 펌프가 안 돌면 영원히 안 내려간다
  return (volume * Math.log(initialPressure / finalPressure)) / (pumpSpeed * 60);
}

/**
 * 압력에 따라 배기 속도가 변하는 실제 펌프의 배기 시간.
 *
 *   V·dP/dt = −S(P)·P   →   t = ∫ V / S(P) · dP/P = ∫ V / S(P) · d(ln P)
 *
 * 러프 펌핑 구간에서 배기 속도는 대기압 근처에서 크게 떨어진다 (모델 2 기준
 * 760 Torr 에서 250 m³/h, 10 Torr 에서 1720 m³/h — 7배 차이). 한 점의 속도를
 * 전 구간에 상수로 쓰면 시간이 2배 이상 어긋난다.
 *
 * ── 정확도 (교육용) ──
 * 적분 자체는 512 분할에서 0.001% 이내로 수렴한다. 다만 **아웃가싱과 가스 부하가
 * 없는 이상적 배기**다. 실제로는 1e-3 Torr 아래에서 아웃가싱이 지배해 훨씬 오래
 * 걸리고 결국 도달 압력이 한계에 걸린다. 등온을 가정했고 챔버-펌프 사이 배관
 * conductance 제약도 반영하지 않았다. 실제 장비의 배기 시간은 이보다 길다.
 *
 * @param {number} volume 챔버 부피 (L)
 * @param {number} initialPressure Torr
 * @param {number} finalPressure Torr
 * @param {Array} pumpModels 펌프 모델 배열 (속도 단위 m³/h)
 * @param {number} modelNumber 모델 인덱스
 * @param {number} steps 적분 분할 수
 * @returns {number} 분
 */
export function calculatePumpingTimeFromCurve(
  volume,
  initialPressure,
  finalPressure,
  pumpModels,
  modelNumber,
  steps = 512
) {
  if (finalPressure <= 0.02) finalPressure = 0.02;
  if (initialPressure <= finalPressure) return 0;
  if (!(volume > 0)) return 0;

  const lnLo = Math.log(finalPressure);
  const lnHi = Math.log(initialPressure);
  const dlnP = (lnHi - lnLo) / steps;

  let seconds = 0;
  for (let i = 0; i < steps; i++) {
    // 각 구간의 기하평균 압력에서 속도를 읽는다 (중점법).
    const P = Math.exp(lnLo + dlnP * (i + 0.5));
    const speedLs = convertM3hToLs(calculatePumpingSpeed(P, pumpModels, modelNumber));
    if (!(speedLs > 0)) return Infinity;
    seconds += (volume / speedLs) * dlnP;
  }
  return seconds / 60;
}

/**
 * 분자류(molecular flow) 영역의 긴 원통관 conductance.
 *
 *   C[L/s] = 3.81 · √(T/M) · D³ / L_eff      (D, L 은 cm)
 *
 * 공기(M = 29 g/mol), 20°C 에서 계수는 12.1 이다. L_eff = L + 4D/3 은 관 입구
 * 효과(Clausing 보정)를 대략 반영해 짧은 관에서 과대평가되는 걸 막아 준다.
 *
 * 예전 구현은 D⁴ (점성류 형태) 이면서 압력 항이 없었다. 이 시뮬레이터는
 * 터보펌프로 1e-6 Torr 까지 내려가는 분자류 영역을 다루므로 D³ 가 맞다.
 *
 * ── 정확도 (교육용) ──
 * 입구 보정 때문에 교과서의 긴 관 근사(12.1·D³/L)보다 1~35% 낮게 나온다.
 * 짧고 굵은 관일수록 차이가 크다 (D=20cm·L=50cm 에서 −35%). 이건 오차가 아니라
 * 짧은 관에서 더 맞는 값이다.
 *
 * 담지 않은 물리: 점성류·전이류 구간(이 시뮬레이터가 훑는 대기압~1 Torr 영역)은
 * 식이 다르다. 엘보 0.7, 스파이럴 0.4 계수는 실측이 아니라 교육용으로 잡은 값이라
 * 실제 배관과 다를 수 있다.
 *
 * @param {number} diameter 관 안지름 (cm)
 * @param {number} length 관 길이 (cm)
 * @param {'straight'|'elbow'|'spiral'} pipeType
 * @returns {number} L/s
 */
export function calculateConductance(diameter, length, pipeType) {
  const D = diameter; // cm
  const L = length; // cm
  if (!(D > 0)) return 0;
  if (!(L >= 0)) return 0;

  const effectiveLength = L + (4 * D) / 3;
  const baseConductance = (12.1 * Math.pow(D, 3)) / effectiveLength;

  switch (pipeType) {
    case 'elbow':
      return baseConductance * 0.7; // 엘보로 인한 손실
    case 'spiral':
      return baseConductance * 0.4; // 스파이럴로 인한 큰 손실
    case 'straight':
    default:
      return baseConductance;
  }
}

/** 1/S_eff = 1/S_pump + 1/C */
export function calculateEffectivePumpingSpeed(pumpSpeed, conductance) {
  return (pumpSpeed * conductance) / (pumpSpeed + conductance);
}

/** 압력 구간 이름. */
export function getVacuumStage(pressure) {
  if (pressure > 100) return '대기압/초기배기';
  if (pressure > 1) return '저진공';
  if (pressure > 1e-3) return '중진공';
  if (pressure > 1e-6) return '고진공';
  return '초고진공';
}
