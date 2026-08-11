/**
 * 건식 식각 계산.
 *
 * EtchingSimulator.js 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 원본이 함수 안에서 직접 부르던 Math.random 만 인자로 주입받게 바꿨다.
 * 기본값이 Math.random 이라 화면 동작은 그대로이고, 테스트에서는 고정값을 넣어
 * 결정적으로 검증할 수 있다.
 *
 * ── 정확도 (교육용) ──
 * 1차 원리 계산이 아니라 문헌 데이터에 맞춘 경험식이다. 가스·파워·압력을 올리면
 * 무엇이 오르고 내리는지(경향)는 맞지만 **절대 식각률과 선택비는 장비·챔버 형상·
 * 웨이퍼 이력에 따라 크게 달라진다.** 실제 공정 조건 산출에 쓰면 안 된다.
 */

/**
 * 식각률 (nm/min).
 * @param {string} material 'Si' | 'SiO2' | 'Si3N4' | 'PR'
 * @param {object} gasFlow { Cl2, HBr, CF4, CHF3, O2, Ar } sccm
 * @param {number} power W
 * @param {number} pressure mTorr
 * @param {() => number} rng 0~1 난수원
 */
export function calculateEtchRate(material, gasFlow, power, pressure, rng = Math.random) {
  // 압력과 파워는 음수가 될 수 없다. 가드가 없으면 음압에서도 식각률이 나온다.
  pressure = Math.max(0, pressure);
  power = Math.max(0, power);
  let baseRate = 0;

  switch (material) {
    case 'Si': {
      // Cl2가 식각률을 올리지만, 과도한 HBr은 측벽 passivation으로 식각률 저하
      const cl2Effect = gasFlow.Cl2 * 4.5;
      const hbrPassivation = Math.max(0, (gasFlow.HBr - 30) * 1.8);
      baseRate = (cl2Effect - hbrPassivation) * (power / 300);
      break;
    }
    case 'SiO2': {
      // CF4/CHF3가 식각률에 기여하지만, 과도한 CHF3는 폴리머 누적으로 etch stop
      const cf4Effect = gasFlow.CF4 * 5.0;
      const chf3Effect = gasFlow.CHF3 * 2.5;
      const polymerStop = Math.max(0, (gasFlow.CHF3 - 45) * 3.0);
      baseRate = (cf4Effect + chf3Effect - polymerStop) * (power / 400);
      break;
    }
    case 'Si3N4': {
      const chf3Effect = gasFlow.CHF3 * 4.0;
      const polymerStop = Math.max(0, (gasFlow.CHF3 - 50) * 2.5);
      baseRate = (chf3Effect - polymerStop) * (power / 400);
      break;
    }
    case 'PR': {
      baseRate = gasFlow.O2 * 5.0 * (power / 400);
      break;
    }
    default:
      baseRate = 50;
  }

  // 압력 sweet spot ~80mTorr — ICP 저압 운전(<30)에서도 rate 유지, 고압은 가스상 재결합으로 감소
  const pressureFactor =
    pressure < 80
      ? 0.75 + (Math.max(0, pressure - 30) / 50) * 0.25
      : Math.max(0.5, 1 - (pressure - 80) / 240);

  // 파워 600W 초과 시 마스크/하부층 손상이 누적되며 유효 식각률 saturation
  const powerSaturation = power > 600 ? Math.max(0.7, 1 - (power - 600) / 800) : 1;

  baseRate = baseRate * pressureFactor * powerSaturation;
  // 파워나 반응 가스가 없으면 식각도 없다. 예전에는 Math.max(5, …) 하한 때문에
  // 플라즈마 파워 0 에서도 5 nm/min 이 나왔다.
  return Math.max(0, baseRate * (0.9 + rng() * 0.2));
}

/**
 * 선택비 (target : 하부층).
 * @param {() => number} rng 0~1 난수원
 */
export function calculateSelectivity(target, gasFlow, power, pressure, rng = Math.random) {
  let sel = 5;

  switch (target) {
    case 'Si': {
      // HBr이 선택비를 올리지만 Cl2/Ar 과다 시 PR/oxide 손상으로 선택비 저하
      sel = 8 + (gasFlow.HBr / 10) * 8;
      const cl2Penalty = Math.max(0, (gasFlow.Cl2 - 50) * 0.35);
      const arPenalty = Math.max(0, (gasFlow.Ar - 80) * 0.25);
      sel -= cl2Penalty + arPenalty;
      break;
    }
    case 'SiO2': {
      // CHF3 폴리머가 Si 표면 보호 → 선택비↑, CF4 과다는 F 라디칼 증가로 선택비↓
      sel = 5 + (gasFlow.CHF3 / 10) * 4;
      const cf4Penalty = Math.max(0, (gasFlow.CF4 - 30) * 0.3);
      const arPenalty = Math.max(0, (gasFlow.Ar - 70) * 0.25);
      sel -= cf4Penalty + arPenalty;
      break;
    }
    case 'Si3N4': {
      sel = 5 + (gasFlow.CHF3 / 10) * 3;
      const o2Penalty = Math.max(0, (gasFlow.O2 - 15) * 0.5);
      sel -= o2Penalty;
      break;
    }
    case 'PR': {
      sel = 30 + rng() * 5;
      break;
    }
    default:
      sel = 5 + rng() * 5;
  }

  // 고전력에서는 물리 충격이 우세해져 선택비 저하
  const powerPenalty = power > 500 ? (power - 500) / 150 : 0;
  // 저압은 이방성 좋지만 sputter 비중 증가 → 선택비 약간 저하
  const lowPressurePenalty = pressure < 40 ? (40 - pressure) / 20 : 0;
  sel = sel - powerPenalty - lowPressurePenalty;

  return Math.max(1, sel);
}

/** 식각 균일도 (%). */
export function calculateUniformity(pressure, power, gasFlow) {
  const pressureEffect = Math.max(0, 100 - Math.abs(pressure - 100) / 1.5);
  const powerEffect = Math.max(0, 100 - Math.abs(power - 300) / 5);
  let uniformity = (pressureEffect + powerEffect) / 2;

  // 총 가스 유량이 과도하면 흐름 분포가 어긋나 균일성 저하
  if (gasFlow) {
    const totalGas = Object.values(gasFlow).reduce((a, b) => a + b, 0);
    if (totalGas > 350) uniformity -= (totalGas - 350) / 6;
  }

  return Math.max(40, Math.min(100, uniformity));
}

/** 압력이 높을수록 등방성 식각 증가. */
export function calculatePressureEffect(pressure) {
  return Math.min(2.0, 0.5 + pressure / 100);
}

/** 파워가 높을수록 식각속도 증가. */
export function calculatePowerEffect(power) {
  return Math.min(3.0, 0.5 + power / 200);
}

/** 가스 비율에 따른 선택비 변화. */
export function calculateGasRatioEffect(ratio) {
  return Math.min(2.0, 0.8 + ratio / 50);
}
