/**
 * 열산화 (Deal-Grove) 계산.
 *
 * Oxidation.js 컴포넌트에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 값 검증 결과는 src/physics/__tests__/oxidation.test.js 를 볼 것.
 */

/** 볼츠만 상수 (eV/K) */
export const K_EV = 8.617e-5;

/**
 * Deal-Grove 속도 상수 (Plummer, "Silicon VLSI Technology" Table 6.2, <100> Si).
 *
 *   포물선 상수      B    = B0  · exp(−EaB  / kT)   [μm²/hr]
 *   선형/포물선 비   B/A  = BA0 · exp(−EaBA / kT)   [μm/hr]
 *
 * A 는 이 둘의 비(A = B / (B/A))로 얻는다. 지수를 따로 곱하지 않는 게 핵심이다.
 * 예전 구현은 A 에 exp(−2.0/kT) 를 그대로 곱해서 A ≈ 0 이 되었고, 그 결과
 * 계면 반응 律速인 선형 영역이 사라져 두께가 항상 √t 로만 자랐다.
 */
const DEAL_GROVE = {
  dry: { B0: 7.72e2, EaB: 1.23, BA0: 6.23e6, EaBA: 2.0 },
  wet: { B0: 3.86e2, EaB: 0.78, BA0: 1.63e8, EaBA: 2.05 },
};

/** UI 가 닿을 수 있는 최대(wet 1200°C 180분 ≈ 1.55 μm)보다 넉넉한 상한. */
const MAX_THICKNESS_NM = 5000;

/**
 * Deal-Grove 산화막 두께: x² + A·x = B·t 를 x 에 대해 푼 것.
 *
 * ── 정확도 (교육용) ──
 * Deal-Grove 문헌식을 그대로 구현했으므로 문헌값과의 편차는 수치오차 수준이다.
 * 다만 모델 자체의 한계가 있다:
 *
 * - 초기 산화막 오프셋 τ 를 넣지 않았다(τ = 0, 맨 실리콘 기준). 그래서 **dry 산화
 *   30 nm 이하 박막은 실측보다 얇게** 나온다. 실제로는 초기 급속 성장 구간이 있다.
 * - Deal-Grove 자체가 20 nm 이하에서는 잘 맞지 않는 것으로 알려져 있다.
 * - 결정 방위·도핑·압력은 이 함수에 들어가지 않는다 ("영향 인자" 탭의 상대 배율 전용).
 *
 * 실제 장비의 계측 두께와는 더 크게 벌어질 수 있다.
 *
 * @param {number} temp 온도 (°C)
 * @param {number} time 시간 (분)
 * @param {'dry'|'wet'} atm 산화 분위기 ('dry' 외에는 wet 으로 처리)
 * @param {number} gasFlowRate 가스 유량 (100 = 기준)
 * @returns {number} 두께 (nm)
 */
export function calculateOxideGrowth(temp, time, atm, gasFlowRate = 100) {
  const tempK = temp + 273.15;
  // 시간이 0 이하거나 절대영도 이하면 산화가 일어나지 않는다.
  if (!(time > 0) || !(tempK > 0)) return 0;

  const { B0, EaB, BA0, EaBA } = atm === 'dry' ? DEAL_GROVE.dry : DEAL_GROVE.wet;
  const kT = K_EV * tempK;
  const B = B0 * Math.exp(-EaB / kT); // μm²/hr
  const BoverA = BA0 * Math.exp(-EaBA / kT); // μm/hr
  const A = B / BoverA; // μm

  // 가스 유량은 표면 산화종 농도 C* 를 통해 들어온다. B 와 B/A 가 **둘 다** C* 에
  // 비례하므로 A = B/(B/A) 는 그대로고, 결과적으로 시간이 f 배 되는 것과 같다.
  //
  // 예전에는 완성된 두께에 f 를 그냥 곱했다. 그러면 x² + A·x = B·t 관계가 깨져서
  // 유량이 낮을 때 선형/포물선 이행 지점까지 같이 밀린다.
  const flowFactor = Math.max(0, 0.5 + (gasFlowRate / 100) * 0.5);
  const timeHours = (time / 60) * flowFactor;
  const thicknessUm = (-A + Math.sqrt(A * A + 4 * B * timeHours)) / 2;
  const thickness = thicknessUm * 1000; // nm

  if (!Number.isFinite(thickness)) return 0;
  return Math.max(0, Math.min(thickness, MAX_THICKNESS_NM));
}

/** 결정 방위별 상대 산화 속도. */
export function calculateOrientationRate(orientation) {
  const rates = { 100: 1.0, 110: 1.25, 111: 1.68 };
  return rates[orientation] || 1.0;
}

/** 도핑 농도에 따른 상대 산화 속도. */
export function calculateDopingRate(dopingLevel) {
  if (dopingLevel === 0) return 1.0;
  return 1.0 + (dopingLevel / 10) * 2.0;
}

/**
 * 초기 산화막이 있을 때의 상대 성장 속도.
 * 두께는 음수가 될 수 없다 (−100 nm 면 분모가 0 이 되어 발산한다).
 */
export function calculateInitialOxideRate(initialThickness) {
  const thickness = Math.max(0, initialThickness);
  if (thickness === 0) return 1.0;
  return 1.0 / (1.0 + thickness / 100);
}

/** 온도·압력에 따른 상대 산화 속도 (1000°C, 1 atm 기준). */
export function calculateTempPressureRate(temp, pressure) {
  const tempBase = 1000;
  const tempEffect =
    Math.exp(-1.23 / (K_EV * (temp + 273.15))) /
    Math.exp(-1.23 / (K_EV * (tempBase + 273.15)));
  const pressureEffect = pressure;
  return tempEffect * pressureEffect;
}

/** 네 인자를 곱한 종합 상대 속도. */
export function calculateTotalSimRate(orientation, dopingLevel, initialThickness, temp, pressure) {
  return (
    calculateOrientationRate(orientation) *
    calculateDopingRate(dopingLevel) *
    calculateInitialOxideRate(initialThickness) *
    calculateTempPressureRate(temp, pressure)
  );
}

/**
 * 공정 조건으로 산화막 품질 등급을 매긴다.
 * @returns {{grade: string, score: number, issues: string[]}}
 */
export function evaluateOxideQuality(mode, temp, gasFlowState) {
  let score = 100;
  const issues = [];

  // --- Gas ratio issues ---
  if (mode === 'wet' && gasFlowState.H2O > 200) {
    const penalty = Math.min(((gasFlowState.H2O - 200) / 100) * 25, 30);
    score -= penalty;
    issues.push('H₂O 과다: 산화막 밀도 저하, 누설전류 증가 우려');
  }
  if (mode === 'pyrogenic') {
    const ratio = gasFlowState.O2 > 0 ? gasFlowState.H2 / gasFlowState.O2 : 0;
    if (ratio > 0.6) {
      score -= 20;
      issues.push('H₂/O₂ 비율 과다: 불완전 연소 → 잔류 H₂ → 막질 불량');
    } else if (ratio < 0.3 && gasFlowState.H2 > 0) {
      score -= 10;
      issues.push('H₂/O₂ 비율 부족: 수증기 생성량 저하');
    }
  }
  if (gasFlowState.HCl > 0 && gasFlowState.HCl <= 5) {
    score += 5; // small bonus for proper HCl gettering
    issues.push('HCl 게터링 적용: 금속 불순물 제거 → 품질 향상');
  } else if (gasFlowState.HCl > 5) {
    const penalty = Math.min(((gasFlowState.HCl - 5) / 10) * 20, 25);
    score -= penalty;
    issues.push('HCl 과다 (>' + gasFlowState.HCl + ' sccm): 산화막 식각 및 장비 부식 위험');
  }
  if (gasFlowState.N2 < 80) {
    score -= 10;
    issues.push('N₂ 퍼지 부족: 대기 오염 유입, 불순물 혼입 우려');
  }

  // --- Temperature appropriateness ---
  if (mode === 'dry' && temp > 1100) {
    score -= 10;
    issues.push('Dry 고온 (>1100°C): 급속 성장 → 계면 거칠기 증가, 응력 상승');
  }
  if (mode === 'dry' && temp >= 900 && temp <= 1000) {
    score += 5; // optimal range for gate oxide
  }
  if ((mode === 'wet' || mode === 'pyrogenic') && temp < 900) {
    score -= 10;
    issues.push('Wet 저온 (<900°C): 성장 속도 매우 느리고 막질 불균일');
  }

  // --- Dry + low flow ---
  if (mode === 'dry' && gasFlowState.O2 > 0 && gasFlowState.O2 < 50) {
    score -= 10;
    issues.push('O₂ 유량 부족: 불균일 산화 우려');
  }

  score = Math.max(0, Math.min(100, score));
  const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D';
  if (issues.length === 0) issues.push('양호한 공정 조건');
  return { grade, score, issues };
}
