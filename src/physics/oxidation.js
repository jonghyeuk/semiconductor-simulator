/**
 * 열산화 (Deal-Grove) 계산.
 *
 * Oxidation.js 컴포넌트에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 값 검증 결과는 src/physics/__tests__/oxidation.test.js 를 볼 것.
 */

/** 볼츠만 상수 (eV/K) */
export const K_EV = 8.617e-5;

/**
 * Deal-Grove 산화막 두께.
 * @param {number} temp 온도 (°C)
 * @param {number} time 시간 (분)
 * @param {'dry'|'wet'} atm 산화 분위기
 * @param {number} gasFlowRate 가스 유량 (sccm 기준 상대값, 100 = 기준)
 * @returns {number} 두께 (nm), 0~1000 으로 clamp
 */
export function calculateOxideGrowth(temp, time, atm, gasFlowRate = 100) {
  const tempK = temp + 273.15;
  let B, A;

  if (atm === 'dry') {
    const B0 = 3.0e7;
    const Ea = 1.23;
    B = B0 * Math.exp(-Ea / (K_EV * tempK));
    A = 165 * Math.exp(-2.0 / (K_EV * tempK));
  } else {
    const B0 = 7.7e7;
    const Ea = 0.78;
    B = B0 * Math.exp(-Ea / (K_EV * tempK));
    A = 226 * Math.exp(-2.0 / (K_EV * tempK));
  }

  const flowFactor = 0.5 + (gasFlowRate / 100) * 0.5;
  const timeHours = time / 60;
  const discriminant = A * A + 4 * B * timeHours;
  let thickness = (-A + Math.sqrt(discriminant)) / 2;
  thickness = thickness * flowFactor;

  return Math.max(0, Math.min(thickness, 1000));
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

/** 초기 산화막이 있을 때의 상대 성장 속도. */
export function calculateInitialOxideRate(initialThickness) {
  if (initialThickness === 0) return 1.0;
  return 1.0 / (1.0 + initialThickness / 100);
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
