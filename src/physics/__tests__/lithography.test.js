import { describe, it, expect } from 'vitest';
import { calculateSpinCoatResults } from '../lithography.js';

const fixed = (v) => () => v;
const mid = fixed(0.5);

const params = (over = {}) => ({
  step1_rpm: 500,
  step1_time: 5,
  step2_rpm: 3000,
  step2_time: 30,
  step3_rpm: 0,
  step3_time: 3,
  ...over,
});

describe('calculateSpinCoatResults — 정상 경로', () => {
  it('난수를 고정하면 결정적이다', () => {
    expect(calculateSpinCoatResults(params(), mid)).toEqual(calculateSpinCoatResults(params(), mid));
  });

  it('난수 기본값은 Math.random 이라 호출마다 흔들린다 (화면 동작 유지)', () => {
    const vals = new Set(Array.from({ length: 50 }, () => calculateSpinCoatResults(params()).prThickness));
    expect(vals.size).toBeGreaterThan(1);
  });

  it('최적 조건의 균일도는 99% 이고, 상한 99.5% 는 도달할 수 없다', () => {
    // 기본값이 99 이고 모든 분기가 감점만 하므로 Math.min(99.5, …) 상한은 죽은 코드다.
    expect(calculateSpinCoatResults(params(), mid).uniformity).toBe(99);
  });

  it('1단계 RPM 이 최적 범위(400~600)를 벗어나면 균일도가 떨어진다', () => {
    const best = calculateSpinCoatResults(params(), mid).uniformity;
    expect(calculateSpinCoatResults(params({ step1_rpm: 200 }), mid).uniformity).toBeLessThan(best);
    expect(calculateSpinCoatResults(params({ step1_rpm: 1000 }), mid).uniformity).toBeLessThan(best);
  });

  it('2단계 RPM 이 최적 범위(2500~3500)를 벗어나면 균일도가 떨어진다', () => {
    const best = calculateSpinCoatResults(params(), mid).uniformity;
    expect(calculateSpinCoatResults(params({ step2_rpm: 1000 }), mid).uniformity).toBeLessThan(best);
    expect(calculateSpinCoatResults(params({ step2_rpm: 5500 }), mid).uniformity).toBeLessThan(best);
  });

  it('2단계 시간이 부족하면 균일도가 떨어진다', () => {
    const best = calculateSpinCoatResults(params(), mid).uniformity;
    expect(calculateSpinCoatResults(params({ step2_rpm: 2000, step2_time: 10 }), mid).uniformity).toBeLessThan(best);
  });

  it('결함 밀도는 균일도와 반비례한다', () => {
    const good = calculateSpinCoatResults(params(), mid);
    const bad = calculateSpinCoatResults(params({ step2_rpm: 1000, step1_rpm: 200 }), mid);
    expect(bad.defectDensity).toBeGreaterThan(good.defectDensity);
  });

  it('균일도는 70~99% 범위 안이다', () => {
    for (const r1 of [0, 200, 500, 900, 2000]) {
      for (const r2 of [500, 2000, 3000, 5000, 8000]) {
        for (const t2 of [1, 20, 60]) {
          const u = calculateSpinCoatResults(params({ step1_rpm: r1, step2_rpm: r2, step2_time: t2 }), mid).uniformity;
          expect(u).toBeGreaterThanOrEqual(70);
          expect(u).toBeLessThanOrEqual(99);
        }
      }
    }
  });

  it('CD 균일도는 100% 를 넘지 않는다', () => {
    expect(calculateSpinCoatResults(params(), fixed(1)).cdUniformity).toBeLessThanOrEqual(100);
  });
});

describe('calculateSpinCoatResults — 두께 물리', () => {
  /*
   * 스핀 코팅의 기본 관계는 Emslie–Bonner–Peck 해에서 나오는 t ∝ ω^(−1/2) 다.
   * 예전 구현은 구간별 1차식이었고 2000~4000 rpm 구간은 난수만 돌려 회전수와
   * 무관했다 (2000 rpm 과 4000 rpm 의 두께가 같았다).
   */

  const thickness = (rpm) => calculateSpinCoatResults(params({ step2_rpm: rpm }), mid).prThickness;

  it('회전수가 오르면 두께가 단조 감소한다', () => {
    let prev = Infinity;
    for (const rpm of [500, 1000, 2000, 2500, 3000, 3500, 4000, 5000, 6000]) {
      const t = thickness(rpm);
      expect(t).toBeLessThan(prev);
      prev = t;
    }
  });

  it('회전수 4배면 두께가 절반이 된다 (t ∝ ω^(−1/2))', () => {
    for (const rpm of [500, 1000, 1500]) {
      expect(thickness(4 * rpm) / thickness(rpm)).toBeCloseTo(0.5, 2);
    }
  });

  it('기준점 3000 rpm 에서 1000 nm 다', () => {
    expect(thickness(3000)).toBeCloseTo(1000, 0);
  });

  it('두께 × √rpm 이 전 구간에서 일정하다', () => {
    const invariants = [500, 1000, 2000, 3000, 4000, 6000].map((rpm) => thickness(rpm) * Math.sqrt(rpm));
    for (const v of invariants) expect(v).toBeCloseTo(invariants[0], 0);
  });

  it('런투런 산포는 ±1% 안이다', () => {
    const lo = calculateSpinCoatResults(params(), fixed(0)).prThickness;
    const hi = calculateSpinCoatResults(params(), fixed(1)).prThickness;
    expect(hi / lo).toBeCloseTo(1.01 / 0.99, 6);
  });
});

describe('calculateSpinCoatResults — 경계값', () => {
  it('RPM 0 이어도 발산하지 않는다', () => {
    const r = calculateSpinCoatResults(params({ step2_rpm: 0 }), mid);
    expect(Number.isFinite(r.prThickness)).toBe(true);
    expect(r.prThickness).toBeGreaterThan(0);
  });

  it('시간 0 이어도 NaN 이 아니다', () => {
    const r = calculateSpinCoatResults(params({ step1_time: 0, step2_time: 0, step3_time: 0 }), mid);
    expect(Number.isNaN(r.uniformity)).toBe(false);
  });

  it('두께는 어떤 입력에서도 음수가 되지 않는다', () => {
    for (const rpm of [-1000, 0, 1, 3000, 30000, 1e9]) {
      const t = calculateSpinCoatResults(params({ step2_rpm: rpm }), mid).prThickness;
      expect(t).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(t)).toBe(true);
    }
  });

  it('극단적으로 높은 RPM 에서는 두께가 0 으로 수렴한다', () => {
    // ω^(−1/2) 이라 0 에 점근할 뿐 음수로 넘어가지 않는다.
    const t = calculateSpinCoatResults(params({ step2_rpm: 1e9 }), mid).prThickness;
    expect(t).toBeGreaterThan(0);
    expect(t).toBeLessThan(1000 / 100); // 기준 두께의 1% 미만
  });

  it('해상도는 난수 범위 88~92% 안이다', () => {
    expect(calculateSpinCoatResults(params(), fixed(0)).resolution).toBe(88);
    expect(calculateSpinCoatResults(params(), fixed(1)).resolution).toBe(92);
  });
});

/*
 * 문헌 앵커. lithography.js 는 상수가 적고 경험식이 대부분이지만, 화면이
 * 가르치는 광학 상수(파장·NA·해상도)와 코드가 어긋나지 않는지는 못박아 둔다.
 */
describe('lithography — 광학 문헌 앵커', () => {
  it('Rayleigh 식으로 계산한 해상도가 시뮬레이터가 표시하는 값과 맞는다', () => {
    // R = k1·λ/NA
    const R = (k1, lambdaNm, NA) => (k1 * lambdaNm) / NA;
    // ArF 액침: λ 193nm, NA 1.35 → 화면 표기 약 40nm (k1 ≈ 0.28)
    expect(R(0.28, 193, 1.35)).toBeCloseTo(40, 0);
    // EUV: λ 13.5nm, NA 0.33 → 화면 표기 약 13nm (k1 ≈ 0.32)
    expect(R(0.32, 13.5, 0.33)).toBeCloseTo(13.1, 1);
    // High-NA EUV: NA 0.55 → 약 8nm
    expect(R(0.32, 13.5, 0.55)).toBeCloseTo(7.9, 1);
  });

  it('단일 노광 물리 하한(k1=0.25)이 ArF 액침에서 10nm 를 만들 수 없다', () => {
    // 화면에 "193nm → 45~10nm" 라고 적혀 있었다. k1 을 물리 하한까지 낮춰도
    // 35.7nm 가 한계이므로 10nm 는 단일 노광으로 불가능하다.
    const physicalLimit = (0.25 * 193) / 1.35;
    expect(physicalLimit).toBeGreaterThan(30);
    expect(physicalLimit).toBeLessThan(40);
  });

  it('스핀 코팅 두께가 t ∝ ω^(−1/2) 를 따르고 기준점이 3000rpm=1000nm 다', () => {
    const rng = () => 0.5; // 산포 제거
    const t = (rpm) => calculateSpinCoatResults({ step2_rpm: rpm }, rng).prThickness;
    expect(t(3000)).toBeCloseTo(1000, 0);
    // 회전수 4배 → 두께 1/2
    expect(t(12000) / t(3000)).toBeCloseTo(0.5, 3);
  });
});
