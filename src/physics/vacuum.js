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
 * 챔버를 initialPressure → finalPressure 까지 배기하는 시간.
 * @param {number} volume 챔버 부피 (UI 는 L 로 표시)
 * @param {number} initialPressure Torr
 * @param {number} finalPressure Torr
 * @param {number} pumpSpeed L/s
 * @returns {number} 분
 */
export function calculatePumpingTime(volume, initialPressure, finalPressure, pumpSpeed) {
  if (finalPressure <= 0.02) finalPressure = 0.02;
  if (initialPressure <= finalPressure) return 0;
  const timeInMinutes =
    (volume * Math.log(initialPressure / finalPressure)) / ((pumpSpeed * 60) / 1000);
  return timeInMinutes;
}

/** 배관 형태별 conductance (L/s). */
export function calculateConductance(diameter, length, pipeType) {
  // 기본 원통형 배관의 conductance (L/s)
  const D = diameter; // cm
  const L = length; // cm
  const baseConductance = (3.27e-2 * Math.pow(D, 4)) / L;

  switch (pipeType) {
    case 'straight':
      return baseConductance * 1000;
    case 'elbow':
      return baseConductance * 0.7 * 1000; // 엘보로 인한 손실
    case 'spiral':
      return baseConductance * 0.4 * 1000; // 스파이럴로 인한 큰 손실
    default:
      return baseConductance * 1000;
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
