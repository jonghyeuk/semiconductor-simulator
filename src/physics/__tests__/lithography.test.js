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
   * ── 확인된 물리 오류 ⑦: 스핀 코팅 두께가 회전수를 거의 안 따라간다 ──
   *
   * 스핀 코팅의 기본 관계는 Emslie–Bonner–Peck 해에서 나오는
   *   t ∝ ω^(−1/2)
   * 즉 회전수를 4배로 올리면 두께가 절반이 된다. 이건 리소 공정 교육의 핵심 관계다.
   *
   * 코드는 대신 구간별 1차식을 쓰고, 심지어 2000~4000 rpm 구간은
   *   thickness = 1000 + (random() − 0.5) * 20
   * 이라 **회전수와 아무 상관이 없다**. 2000 rpm 과 4000 rpm 의 기대 두께가 똑같다.
   *
   *   rpm    코드 두께   ω^(−1/2) 기준(3000 rpm=1000 nm)
   *   1000   1100 nm     1732 nm
   *   2000   1000 nm     1225 nm
   *   3000   1000 nm     1000 nm
   *   4000   1000 nm      866 nm
   *   6000    900 nm      707 nm
   *
   * 전 구간을 통틀어 6배 회전수 변화에 두께는 18% 밖에 안 변한다 (실제 2.4배).
   *
   * 계산식을 고치면 화면의 PR 두께가 전부 바뀌므로 임의로 고치지 않고
   * it.fails 로 올바른 기댓값만 남긴다.
   */

  const thickness = (rpm) => calculateSpinCoatResults(params({ step2_rpm: rpm }), mid).prThickness;

  it('현재 동작: 2000~4000 rpm 구간에서 두께가 회전수와 무관하다', () => {
    expect(thickness(2000)).toBe(thickness(4000));
    expect(thickness(2500)).toBe(thickness(3500));
  });

  it('현재 동작: 회전수를 6배 해도 두께가 20% 도 안 변한다', () => {
    expect(thickness(6000) / thickness(1000)).toBeGreaterThan(0.8);
  });

  it.fails('회전수가 오르면 두께는 반드시 얇아져야 한다 (구간 무관하게 단조 감소)', () => {
    // 측정값: 2000 rpm 과 4000 rpm 이 둘 다 1000 nm 로 동일
    let prev = Infinity;
    for (const rpm of [1000, 2000, 3000, 4000, 5000, 6000]) {
      expect(thickness(rpm)).toBeLessThan(prev);
      prev = thickness(rpm);
    }
  });

  it.fails('회전수 4배면 두께가 절반이 되어야 한다 (t ∝ ω^-1/2)', () => {
    // 측정값: 1000→4000 rpm 두께비 0.909 / 이론값 0.5
    expect(thickness(4000) / thickness(1000)).toBeCloseTo(0.5, 1);
  });
});

describe('calculateSpinCoatResults — 경계값', () => {
  it('RPM 0 이어도 유한한 값이 나온다', () => {
    const r = calculateSpinCoatResults(params({ step2_rpm: 0 }), mid);
    expect(Number.isFinite(r.prThickness)).toBe(true);
    expect(r.prThickness).toBe(1200); // 1000 + 2000*0.1
  });

  it('시간 0 이어도 NaN 이 아니다', () => {
    const r = calculateSpinCoatResults(params({ step1_time: 0, step2_time: 0, step3_time: 0 }), mid);
    expect(Number.isNaN(r.uniformity)).toBe(false);
  });

  it('극단적으로 높은 RPM 에서는 두께가 음수가 된다 (하한 없음, 현재 동작)', () => {
    // 1000 − (rpm − 4000)*0.05 이므로 24000 rpm 을 넘으면 음수 두께가 나온다.
    expect(calculateSpinCoatResults(params({ step2_rpm: 30000 }), mid).prThickness).toBeLessThan(0);
  });

  it.fails('두께는 어떤 입력에서도 음수가 될 수 없다', () => {
    // 측정값: 30000 rpm → −300 nm
    expect(calculateSpinCoatResults(params({ step2_rpm: 30000 }), mid).prThickness).toBeGreaterThanOrEqual(0);
  });

  it('해상도는 난수 범위 88~92% 안이다', () => {
    expect(calculateSpinCoatResults(params(), fixed(0)).resolution).toBe(88);
    expect(calculateSpinCoatResults(params(), fixed(1)).resolution).toBe(92);
  });
});
