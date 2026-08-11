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
 *
 *   t = (V / S) · ln(Pi / Pf)
 *
 * V 를 L, S 를 L/s 로 넣으면 t 는 초다. UI 가 챔버 부피를 L 로 표시하므로
 * 분으로 바꾸려면 60 으로만 나누면 된다. 예전 구현은 분모에 `/1000` 이 더 붙어
 * (부피를 m³ 로 받는 식) 결과가 1000배로 나왔다.
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
