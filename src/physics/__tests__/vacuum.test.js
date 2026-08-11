import { describe, it, expect } from 'vitest';
import {
  calculateTurboSpeed,
  convertSccmToTorrLs,
  calculatePumpingSpeed,
  calculatePumpingTime,
  calculateConductance,
  calculateEffectivePumpingSpeed,
  pressureToSliderValue,
  getVacuumStage,
} from '../vacuum.js';

const PUMP_MODELS = [
  {
    maxSpeed: 300,
    data: [
      { pressure: 0.02, speed: 250 },
      { pressure: 1, speed: 300 },
      { pressure: 100, speed: 280 },
      { pressure: 760, speed: 200 },
    ],
  },
];

describe('calculateTurboSpeed', () => {
  it('압력이 낮을수록 회전 속도가 높다 (단조 비증가)', () => {
    let prev = Infinity;
    for (const e of [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2]) {
      const s = calculateTurboSpeed(Math.pow(10, e));
      expect(s).toBeLessThanOrEqual(prev);
      prev = s;
    }
  });

  it('정격 속도 300 rps 를 넘지 않고 0 아래로도 안 간다', () => {
    for (const e of [-9, -5, -1, 0, 3]) {
      const s = calculateTurboSpeed(Math.pow(10, e));
      expect(s).toBeGreaterThan(0);
      expect(s).toBeLessThanOrEqual(300);
    }
  });

  it('결정적이다', () => {
    expect(calculateTurboSpeed(1e-3)).toBe(calculateTurboSpeed(1e-3));
  });
});

describe('convertSccmToTorrLs', () => {
  it('선형이고 0 은 0 이다', () => {
    expect(convertSccmToTorrLs(0)).toBe(0);
    expect(convertSccmToTorrLs(200)).toBeCloseTo(2 * convertSccmToTorrLs(100), 12);
  });

  it('1 sccm ≈ 0.0127 Torr·L/s 라는 표준 환산과 같은 자릿수다', () => {
    // 표준값 0.01270 (0°C 기준) / 0.01268 (20°C 기준)
    expect(convertSccmToTorrLs(1)).toBeGreaterThan(0.005);
    expect(convertSccmToTorrLs(1)).toBeLessThan(0.02);
  });
});

describe('calculatePumpingSpeed', () => {
  it('곡선의 격자점 위에서는 표값 그대로 나온다', () => {
    expect(calculatePumpingSpeed(1, PUMP_MODELS, 0)).toBeCloseTo(300, 9);
    expect(calculatePumpingSpeed(100, PUMP_MODELS, 0)).toBeCloseTo(280, 9);
  });

  it('격자점 사이는 표값 사이에 들어간다 (보간이 튀지 않는다)', () => {
    for (let e = 0; e <= 2; e += 0.05) {
      const s = calculatePumpingSpeed(Math.pow(10, e), PUMP_MODELS, 0);
      expect(s).toBeLessThanOrEqual(300);
      expect(s).toBeGreaterThanOrEqual(280);
    }
  });

  it('경계값: 범위 밖은 양 끝값으로 clamp 된다', () => {
    expect(calculatePumpingSpeed(0.001, PUMP_MODELS, 0)).toBe(250);
    expect(calculatePumpingSpeed(10000, PUMP_MODELS, 0)).toBe(200);
  });

  it('경계값: 없는 모델 번호는 기본값 250 을 낸다', () => {
    expect(calculatePumpingSpeed(1, PUMP_MODELS, 99)).toBe(250);
  });
});

describe('calculatePumpingTime — 정상 경로', () => {
  it('부피에 비례한다', () => {
    const a = calculatePumpingTime(100, 760, 1, 250);
    const b = calculatePumpingTime(200, 760, 1, 250);
    expect(b).toBeCloseTo(2 * a, 9);
  });

  it('펌프 속도에 반비례한다', () => {
    const a = calculatePumpingTime(100, 760, 1, 250);
    const b = calculatePumpingTime(100, 760, 1, 500);
    expect(b).toBeCloseTo(a / 2, 9);
  });

  it('목표 압력이 낮을수록 오래 걸린다', () => {
    let prev = -Infinity;
    for (const pf of [10, 1, 0.1, 0.02]) {
      const t = calculatePumpingTime(100, 760, pf, 250);
      expect(t).toBeGreaterThan(prev);
      prev = t;
    }
  });

  it('결정적이다', () => {
    expect(calculatePumpingTime(100, 760, 1, 250)).toBe(calculatePumpingTime(100, 760, 1, 250));
  });
});

describe('calculatePumpingTime — 경계값', () => {
  it('목표 압력이 초기 압력보다 높으면 0 을 낸다', () => {
    expect(calculatePumpingTime(100, 1, 10, 250)).toBe(0);
  });

  it('목표 압력이 0.02 아래면 0.02 로 clamp 된다', () => {
    expect(calculatePumpingTime(100, 760, 1e-6, 250)).toBe(calculatePumpingTime(100, 760, 0.02, 250));
  });

  it('펌프 속도 0 은 무한대가 된다 (가드 없음)', () => {
    expect(calculatePumpingTime(100, 760, 1, 0)).toBe(Infinity);
  });
});

describe('calculatePumpingTime — 단위 검증', () => {
  /*
   * ── 확인된 물리 오류 ③: 배기 시간이 1000배로 나온다 ──
   *
   * 코드: timeInMinutes = V·ln(Pi/Pf) / (S · 60 / 1000)
   *
   * 이론식은 t[s] = (V/S)·ln(Pi/Pf) 이고, V[L]·S[L/s] 이면
   *   t[분] = V·ln(Pi/Pf) / (S·60)
   * 이다. 분모에 있는 `/1000` 은 V 가 m³ 일 때 붙는 환산인데,
   * UI 는 chamberVolume 을 **L 로 표시**한다 (`{chamberVolume} L`).
   * 즉 표시 단위와 식이 어긋나 결과가 정확히 1000배로 나온다.
   *
   * 영향: 100 L 챔버 + 250 L/s 펌프로 760 → 1 Torr 배기가 실제로는 2.7초인데
   * 화면에는 "44.2분" 으로 표시된다. 게다가 펌프 성능 판정(getPumpEfficiencyAssessment)이
   * 10분/20분을 임계값으로 쓰기 때문에, 정상적인 펌프가 전부 "매우 느림 - 펌프 용량 부족"
   * 으로 뜬다.
   *
   * 계산식을 고치면 사용자에게 보이는 시간과 판정 문구가 모두 바뀌므로 임의로 고치지 않고
   * it.fails 로 올바른 기댓값만 남긴다.
   */

  /** 이론식: V[L], S[L/s] → 분 */
  const theoretical = (V, Pi, Pf, S) => (V * Math.log(Pi / Pf)) / (S * 60);

  it('현재 동작: 이론값의 정확히 1000배가 나온다', () => {
    for (const [V, S] of [[100, 250], [500, 250], [100, 1000]]) {
      const ratio = calculatePumpingTime(V, 760, 1, S) / theoretical(V, 760, 1, S);
      expect(ratio).toBeCloseTo(1000, 6);
    }
  });

  it.fails('100 L 챔버를 250 L/s 로 760→1 Torr 배기하면 1분 안에 끝나야 한다', () => {
    // 측정값 44.2분 / 이론값 0.044분 (2.7초)
    expect(calculatePumpingTime(100, 760, 1, 250)).toBeLessThan(1);
  });

  it.fails('배기 시간이 V·ln(Pi/Pf)/(S·60) 과 일치해야 한다', () => {
    expect(calculatePumpingTime(100, 760, 1, 250)).toBeCloseTo(theoretical(100, 760, 1, 250), 6);
  });
});

describe('calculateConductance', () => {
  it('관이 길수록 conductance 가 작다 (1/L)', () => {
    expect(calculateConductance(10, 200, 'straight')).toBeCloseTo(
      calculateConductance(10, 100, 'straight') / 2,
      9
    );
  });

  it('굽은 배관일수록 conductance 가 작다', () => {
    const straight = calculateConductance(10, 100, 'straight');
    const elbow = calculateConductance(10, 100, 'elbow');
    const spiral = calculateConductance(10, 100, 'spiral');
    expect(elbow).toBeLessThan(straight);
    expect(spiral).toBeLessThan(elbow);
  });

  it('알 수 없는 타입은 직관과 같다', () => {
    expect(calculateConductance(10, 100, 'zigzag')).toBe(calculateConductance(10, 100, 'straight'));
  });

  it('경계값: 길이 0 은 무한대가 된다 (가드 없음)', () => {
    expect(calculateConductance(10, 0, 'straight')).toBe(Infinity);
  });

  it('경계값: 직경 0 이면 0 이다', () => {
    expect(calculateConductance(0, 100, 'straight')).toBe(0);
  });

  /*
   * ── 확인된 물리 오류 ④: 분자류 영역인데 점성류 식을 쓴다 ──
   *
   * 코드: C = 3.27e-2 · D⁴ / L · 1000
   *
   * D⁴ 의존성은 **점성류(viscous flow)** 형태다. 점성류 conductance 는
   * 평균 압력 P̄ 에 비례하는데(C ≈ 180·D⁴·P̄/L, L/s·cm·Torr), 이 식에는 압력 항이 아예 없다.
   *
   * 이 시뮬레이터는 터보펌프로 1e-6 Torr 까지 내려가는 **분자류(molecular flow)** 영역을
   * 다루고, 분자류의 긴 원통관 conductance 는 D³ 에 비례한다:
   *   C[L/s] ≈ 12.1 · D³ / L   (공기, 20°C, D·L 은 cm)
   *
   * 결과적으로 직경이 커질수록 오차가 벌어진다 (D=5cm 13배 → D=20cm 54배).
   * 게다가 D 의 거듭제곱이 틀렸으므로 "배관 직경을 2배로 하면 conductance 가 몇 배"
   * 라는 교육적 결론 자체가 잘못 전달된다 (실제 8배, 이 코드 16배).
   */

  /** 분자류 긴 원통관 conductance (공기, 20°C). */
  const molecularFlow = (D, L) => (12.1 * Math.pow(D, 3)) / L;

  it('현재 동작: 직경 2배면 conductance 가 16배 (D⁴)', () => {
    expect(calculateConductance(20, 100, 'straight') / calculateConductance(10, 100, 'straight')).toBeCloseTo(16, 6);
  });

  it.fails('분자류에서는 직경 2배면 conductance 가 8배여야 한다 (D³)', () => {
    // 측정값 16배 / 이론값 8배
    const ratio = calculateConductance(20, 100, 'straight') / calculateConductance(10, 100, 'straight');
    expect(ratio).toBeCloseTo(8, 1);
  });

  it.fails('D=10cm, L=100cm 배관의 conductance 가 분자류 이론값의 ±50% 안이어야 한다', () => {
    // 측정값 3270 L/s / 이론값 121 L/s (27배)
    const actual = calculateConductance(10, 100, 'straight');
    expect(Math.abs(actual / molecularFlow(10, 100) - 1)).toBeLessThan(0.5);
  });
});

describe('calculateEffectivePumpingSpeed', () => {
  it('유효 속도는 펌프 속도와 conductance 중 작은 쪽보다 작다', () => {
    for (const S of [100, 250, 500]) {
      for (const C of [50, 250, 5000]) {
        const eff = calculateEffectivePumpingSpeed(S, C);
        expect(eff).toBeLessThanOrEqual(Math.min(S, C));
      }
    }
  });

  it('conductance 가 무한대면 펌프 속도에 수렴한다', () => {
    expect(calculateEffectivePumpingSpeed(250, 1e12)).toBeCloseTo(250, 3);
  });

  it('둘이 같으면 절반이 된다', () => {
    expect(calculateEffectivePumpingSpeed(250, 250)).toBeCloseTo(125, 9);
  });

  it('경계값: 둘 다 0 이면 NaN 이다 (가드 없음)', () => {
    expect(Number.isNaN(calculateEffectivePumpingSpeed(0, 0))).toBe(true);
  });
});

describe('pressureToSliderValue / getVacuumStage', () => {
  it('슬라이더 값은 압력에 대해 단조 증가한다', () => {
    let prev = -Infinity;
    for (let e = -2; e <= 2.88; e += 0.1) {
      const v = pressureToSliderValue(Math.pow(10, e));
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it('양 끝에서 0 과 100 이다', () => {
    expect(pressureToSliderValue(0.02)).toBeCloseTo(0, 9);
    expect(pressureToSliderValue(760)).toBeCloseTo(100, 9);
  });

  it('진공 등급 경계가 겹치지 않고 순서대로 바뀐다', () => {
    expect(getVacuumStage(760)).toBe('대기압/초기배기');
    expect(getVacuumStage(10)).toBe('저진공');
    expect(getVacuumStage(1e-2)).toBe('중진공');
    expect(getVacuumStage(1e-5)).toBe('고진공');
    expect(getVacuumStage(1e-8)).toBe('초고진공');
  });
});
