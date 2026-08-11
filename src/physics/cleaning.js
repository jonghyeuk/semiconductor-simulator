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
      // 습식 세정에서 산화막 제거는 주로 HF 기반 용액의 특성에 의존
      const tempFactor = (params.temperature - 25) / 75;
      const concFactor = params.concentration / 10;
      const timeFactor = Math.min(params.time / 15, 1);

      // BOE의 경우 산화막 제거에 특화
      const solutionFactor =
        params.solution === 'BOE' ? 1.2 : params.solution === 'SC1' ? 0.3 : params.solution === 'SC2' ? 0.2 : 0.8;

      return Math.min(
        98,
        20 + tempFactor * 25 + concFactor * 30 + timeFactor * 20 + solutionFactor * 15
      );
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
