/**
 * 세정 공정 계산.
 *
 * CleaningSimulator.js 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * case 블록에 중괄호만 추가했다 (원본은 no-case-declarations 위반이었고,
 * 이는 선언이 형제 case 로 새는 스코프 문제라 계산값에는 영향이 없다).
 *
 * ── 정확도 (교육용) ──
 * 제거 효율은 1차 원리 계산이 아니라 교육용 경험식이다. 용액·온도·농도·시간의
 * 상대적 영향을 보여 주는 용도이고, 실제 세정 결과는 오염 종류와 표면 상태에
 * 따라 크게 다르다.
 */

/**
 * 산화막 제거 효율 (%).
 * @param {'wet'|'dry'|'ultrasonic'} method
 * @param {object} params 방식별 공정 파라미터
 */
export function calculateOxideRemovalEfficiency(method, params) {
  // 제거 효율은 백분율이라 0% 아래로 내려갈 수 없다. 각 분기에 상한(Math.min)만
  // 있고 하한이 없어서, 입력이 정상 범위를 벗어나면 음수 효율이 나왔다.
  return Math.max(0, rawOxideRemovalEfficiency(method, params));
}

function rawOxideRemovalEfficiency(method, params) {
  switch (method) {
    case 'wet': {
      // 산화막을 실제로 벗기는 건 HF 계열(BOE)뿐이다. BOE 6:1 의 SiO2 식각률은
      // 800 Å/min 대인 반면 SC1 은 1~2 Å/min 수준이고, SPM 은 오히려 10~15 Å 의
      // 화학 산화막을 **성장**시켜 제거 능력이 사실상 없다.
      //
      // 예전 식에는 두 가지 오류가 있어서 이 순서가 통째로 뒤집혀 있었다.
      //   1. SPM 에 분기가 없어 "알 수 없는 용액" 기본값 0.8 로 떨어졌다.
      //      SC1(0.3)·SC2(0.2)보다 높은 값이다.
      //   2. 온도항이 (T−25)/75 라는 **절대** 온도였다. 그래서 130°C 에서 쓰는
      //      SPM 이 뜨겁다는 이유만으로 가산점을 받아, 상온에서 쓰는 BOE 를
      //      앞질렀다. 각 용액을 권장 온도로 돌렸을 때 산화막 제거율이
      //      SPM 95.3% > SC1 69.5% > SC2 68.0% > BOE 66.3% 로 나왔다.
      //
      // 온도는 용액별 권장 온도 기준의 **상대**값으로 바꾸고, 용액 계수는
      // 가산이 아니라 곱셈으로 두어 용액 선택이 결과를 지배하게 한다.
      const SOLUTIONS = {
        BOE: { weight: 1.0, refTemp: 25 },
        SC1: { weight: 0.12, refTemp: 75 },
        SC2: { weight: 0.08, refTemp: 75 },
        SPM: { weight: 0.02, refTemp: 130 },
      };
      const s = SOLUTIONS[params.solution] || SOLUTIONS.SC1;

      const tempFactor = Math.max(0, 1 + (params.temperature - s.refTemp) / 100);
      const concFactor = 0.4 + 0.6 * (params.concentration / 10);
      const timeFactor = 0.3 + 0.7 * Math.min(params.time / 15, 1);

      return Math.min(98, 100 * s.weight * tempFactor * concFactor * timeFactor);
    }

    case 'dry': {
      const powerFactor = params.power / 500;
      const pressureFactor = (0.5 - params.pressure) / 0.4;
      return Math.min(85, 35 + powerFactor * 30 + pressureFactor * 20);
    }

    case 'ultrasonic': {
      // 초음파는 물리적 제거에 특화, 산화막 제거 효율은 제한적
      const freqFactor = Math.abs(params.frequency - 40) / 40;
      const powerUsFactor = params.power / 150;
      return Math.min(60, 30 + (1 - freqFactor) * 15 + powerUsFactor * 15);
    }

    default:
      return 0;
  }
}
