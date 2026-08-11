import { describe, it, expect } from 'vitest';
import {
  calculateTurboSpeed,
  convertSccmToTorrLs,
  convertM3hToLs,
  calculatePumpingSpeed,
  calculatePumpingTime,
  calculatePumpingTimeFromCurve,
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

  it('펌프 속도 0 이면 영원히 안 내려간다', () => {
    expect(calculatePumpingTime(100, 760, 1, 0)).toBe(Infinity);
    expect(calculatePumpingTime(100, 760, 1, -50)).toBe(Infinity);
  });

  it('배기 시간은 음수가 되지 않는다', () => {
    for (const V of [-1000, -1, 0, 100]) {
      expect(calculatePumpingTime(V, 760, 1, 250)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('calculatePumpingTime — 단위 검증', () => {
  /*
   * t = (V/S)·ln(Pi/Pf). V 를 L, S 를 L/s 로 넣으면 t 는 초다.
   * 예전 구현은 분모에 `/1000` 이 더 붙어 (부피를 m³ 로 받는 식) 값이 어긋났다.
   *
   * 주의: 펌프 모델 곡선은 m³/h 단위다. 화면도 "{pumpingSpeed} m³/h" 로 표시한다.
   * 그대로 넣으면 3.6배 틀리므로 convertM3hToLs 를 거쳐야 한다.
   */

  /** 이론식: V[L], S[L/s] → 분 */
  const theoretical = (V, Pi, Pf, S) => (V * Math.log(Pi / Pf)) / (S * 60);

  it('이론식과 정확히 일치한다', () => {
    for (const V of [10, 100, 500, 1000]) {
      for (const S of [50, 250, 500, 2000]) {
        for (const Pf of [1, 0.1, 0.02]) {
          expect(calculatePumpingTime(V, 760, Pf, S)).toBeCloseTo(theoretical(V, 760, Pf, S), 12);
        }
      }
    }
  });

  it('m³/h → L/s 환산이 맞는다', () => {
    // 1 m³/h = 1000 L / 3600 s
    expect(convertM3hToLs(3600)).toBeCloseTo(1000, 9);
    expect(convertM3hToLs(1800)).toBeCloseTo(500, 9);
    expect(convertM3hToLs(0)).toBe(0);
  });

  it('m³/h 를 그대로 넣으면 3.6배 빨라진다 — 환산을 거쳐야 한다', () => {
    const wrong = calculatePumpingTime(100, 760, 1, 1800); // m³/h 를 L/s 로 오인
    const right = calculatePumpingTime(100, 760, 1, convertM3hToLs(1800));
    expect(right / wrong).toBeCloseTo(3.6, 9);
  });
});

describe('calculatePumpingTimeFromCurve', () => {
  /*
   * 실제 러프 펌핑에서 배기 속도는 압력에 따라 크게 변한다 (모델 2 기준
   * 760 Torr 에서 250 m³/h, 10 Torr 에서 1720 m³/h — 7배). 한 점의 속도를
   * 전 구간 상수로 쓰면 시간이 2배 이상 어긋나므로
   *   t = ∫ V/S(P) · d(ln P)
   * 를 적분한다.
   */
  const model = (max) => ({
    maxSpeed: max,
    data: [
      [0.02, max / 18], [0.1, max / 7.2], [1.0, max / 1.64], [5.0, max],
      [10, max * 0.956], [50, max * 0.667], [100, max * 0.5], [300, max * 0.278],
      [760, max * 0.139],
    ].map(([pressure, speed]) => ({ pressure, speed })),
  });
  const MODELS = { 1: model(900), 2: model(1800), 3: model(3600), 4: model(7200) };

  it('부피에 비례한다', () => {
    const a = calculatePumpingTimeFromCurve(100, 760, 1, MODELS, 2);
    const b = calculatePumpingTimeFromCurve(200, 760, 1, MODELS, 2);
    expect(b / a).toBeCloseTo(2, 6);
  });

  it('펌프가 클수록 빠르다 (단조 감소)', () => {
    let prev = Infinity;
    for (const m of [1, 2, 3, 4]) {
      const t = calculatePumpingTimeFromCurve(100, 760, 1, MODELS, m);
      expect(t).toBeLessThan(prev);
      prev = t;
    }
  });

  it('목표 압력이 낮을수록 오래 걸린다', () => {
    let prev = -Infinity;
    for (const Pf of [100, 10, 1, 0.02]) {
      const t = calculatePumpingTimeFromCurve(100, 760, Pf, MODELS, 2);
      expect(t).toBeGreaterThan(prev);
      prev = t;
    }
  });

  it('속도가 일정한 가상 펌프에서는 상수 속도 해석해와 일치한다', () => {
    const flat = { 0: { maxSpeed: 1800, data: [{ pressure: 0.02, speed: 1800 }, { pressure: 760, speed: 1800 }] } };
    const curve = calculatePumpingTimeFromCurve(100, 760, 1, flat, 0);
    const exact = calculatePumpingTime(100, 760, 1, convertM3hToLs(1800));
    expect(curve).toBeCloseTo(exact, 6);
  });

  it('상수 속도 근사보다 느리다 — 대기압 근처에서 속도가 떨어지므로', () => {
    const curve = calculatePumpingTimeFromCurve(100, 760, 1, MODELS, 2);
    const atMaxSpeed = calculatePumpingTime(100, 760, 1, convertM3hToLs(1800));
    expect(curve).toBeGreaterThan(atMaxSpeed);
  });

  it('적분 분할 수를 늘려도 값이 수렴한다', () => {
    const coarse = calculatePumpingTimeFromCurve(100, 760, 1, MODELS, 2, 128);
    const fine = calculatePumpingTimeFromCurve(100, 760, 1, MODELS, 2, 8192);
    expect(Math.abs(coarse / fine - 1)).toBeLessThan(0.01);
  });

  it('UI 전 범위(10~1000 L × 모델 1~4)에서 1분을 넘지 않는다', () => {
    for (const V of [10, 100, 500, 1000]) {
      for (const m of [1, 2, 3, 4]) {
        const t = calculatePumpingTimeFromCurve(V, 760, 1, MODELS, m);
        expect(t).toBeGreaterThan(0);
        expect(t).toBeLessThan(1);
      }
    }
  });

  it('경계값: 목표 압력이 초기 압력보다 높으면 0', () => {
    expect(calculatePumpingTimeFromCurve(100, 1, 10, MODELS, 2)).toBe(0);
  });

  it('경계값: 부피가 0 이하면 0', () => {
    expect(calculatePumpingTimeFromCurve(0, 760, 1, MODELS, 2)).toBe(0);
    expect(calculatePumpingTimeFromCurve(-100, 760, 1, MODELS, 2)).toBe(0);
  });
});

describe('calculateConductance', () => {
  it('관이 길수록 conductance 가 작다 (단조 감소)', () => {
    let prev = Infinity;
    for (const L of [10, 50, 100, 200, 400]) {
      const c = calculateConductance(10, L, 'straight');
      expect(c).toBeLessThan(prev);
      prev = c;
    }
  });

  it('관이 충분히 길면 1/L 에 수렴한다 (입구 보정이 무시될 때)', () => {
    const ratio = calculateConductance(10, 2000, 'straight') / calculateConductance(10, 1000, 'straight');
    expect(ratio).toBeCloseTo(0.5, 2);
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

  it('경계값: 길이 0 (오리피스) 도 유한하다 — 입구 보정 덕분', () => {
    const c = calculateConductance(10, 0, 'straight');
    expect(Number.isFinite(c)).toBe(true);
    expect(c).toBeGreaterThan(0);
  });

  it('경계값: 음수 직경/길이에서 0 을 낸다', () => {
    expect(calculateConductance(-5, 100, 'straight')).toBe(0);
    expect(calculateConductance(10, -100, 'straight')).toBe(0);
  });

  it('경계값: 직경 0 이면 0 이다', () => {
    expect(calculateConductance(0, 100, 'straight')).toBe(0);
  });

  /*
   * 분자류(molecular flow) 영역의 긴 원통관 conductance:
   *   C[L/s] = 12.1 · D³ / L_eff  (공기 20°C, D·L 은 cm, L_eff = L + 4D/3)
   *
   * 예전 구현은 D⁴ (점성류 형태) 인데 압력 항이 없었다. 이 시뮬레이터는
   * 터보펌프로 1e-6 Torr 까지 내려가는 분자류 영역을 다루므로 D³ 가 맞다.
   */

  /** 분자류 긴 원통관 conductance (입구 보정 없음). */
  const molecularFlow = (D, L) => (12.1 * Math.pow(D, 3)) / L;

  it('직경 2배면 conductance 가 약 8배다 (D³)', () => {
    for (const D of [5, 10, 20]) {
      const ratio = calculateConductance(2 * D, 100, 'straight') / calculateConductance(D, 100, 'straight');
      // 입구 보정(L_eff = L + 4D/3) 때문에 정확히 8 보다 살짝 작다.
      expect(ratio).toBeGreaterThan(6.5);
      expect(ratio).toBeLessThanOrEqual(8);
    }
  });

  it('긴 관에서는 분자류 이론값의 ±10% 안에 든다', () => {
    for (const D of [2, 5, 10]) {
      const L = 500; // L >> D 라 입구 보정이 작다
      expect(Math.abs(calculateConductance(D, L, 'straight') / molecularFlow(D, L) - 1)).toBeLessThan(0.1);
    }
  });

  it('대표값이 문헌 자릿수와 맞는다 (D=10cm, L=100cm → 약 107 L/s)', () => {
    expect(calculateConductance(10, 100, 'straight')).toBeCloseTo(106.8, 0);
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
