import { describe, it, expect } from 'vitest';
import {
  calculateOxideGrowth,
  calculateOrientationRate,
  calculateDopingRate,
  calculateInitialOxideRate,
  calculateTempPressureRate,
  calculateTotalSimRate,
  evaluateOxideQuality,
} from '../oxidation.js';

/** Deal-Grove 문헌 상수 (Plummer, "Silicon VLSI Technology", <100> Si). */
const K = 8.617e-5;
function literatureThicknessNm(tempC, timeMin, atm) {
  const kT = K * (tempC + 273.15);
  const B = atm === 'dry' ? 7.72e2 * Math.exp(-1.23 / kT) : 3.86e2 * Math.exp(-0.78 / kT);
  const BA = atm === 'dry' ? 6.23e6 * Math.exp(-2.0 / kT) : 1.63e8 * Math.exp(-2.05 / kT);
  const A = B / BA; // μm
  const t = timeMin / 60; // hr
  return ((-A + Math.sqrt(A * A + 4 * B * t)) / 2) * 1000;
}

describe('calculateOxideGrowth — 정상 경로', () => {
  it('시간이 0이면 산화막이 자라지 않는다', () => {
    expect(calculateOxideGrowth(1000, 0, 'dry')).toBe(0);
    expect(calculateOxideGrowth(1000, 0, 'wet')).toBe(0);
  });

  it('온도가 오르면 같은 시간에 더 두껍게 자란다', () => {
    for (const atm of ['dry', 'wet']) {
      let prev = -Infinity;
      for (const T of [800, 900, 1000, 1100, 1200]) {
        const x = calculateOxideGrowth(T, 60, atm);
        expect(x).toBeGreaterThan(prev);
        prev = x;
      }
    }
  });

  it('시간이 길수록 두껍게 자란다 (단조 증가)', () => {
    let prev = -Infinity;
    for (const t of [1, 5, 15, 30, 60, 120, 240]) {
      const x = calculateOxideGrowth(1000, t, 'dry');
      expect(x).toBeGreaterThan(prev);
      prev = x;
    }
  });

  it('같은 조건에서 wet 이 dry 보다 빠르다', () => {
    for (const T of [900, 1000, 1100]) {
      expect(calculateOxideGrowth(T, 60, 'wet')).toBeGreaterThan(calculateOxideGrowth(T, 60, 'dry'));
    }
  });

  it('가스 유량이 많을수록 두껍다', () => {
    expect(calculateOxideGrowth(1000, 60, 'dry', 200)).toBeGreaterThan(
      calculateOxideGrowth(1000, 60, 'dry', 100)
    );
  });

  it('결정적이다 — 같은 입력이면 같은 출력', () => {
    const a = calculateOxideGrowth(1000, 60, 'dry', 100);
    const b = calculateOxideGrowth(1000, 60, 'dry', 100);
    expect(a).toBe(b);
  });
});

describe('calculateOxideGrowth — 경계값', () => {
  it('유량 0 이면 두께가 절반이 된다 (flowFactor 하한 0.5)', () => {
    const full = calculateOxideGrowth(1000, 60, 'dry', 100);
    const zero = calculateOxideGrowth(1000, 60, 'dry', 0);
    expect(zero).toBeCloseTo(full * 0.5, 9);
  });

  it('UI 슬라이더 전 범위(800~1200°C, 10~180분)에서 유한한 값만 나온다', () => {
    for (const atm of ['dry', 'wet']) {
      for (let T = 800; T <= 1200; T += 25) {
        for (let t = 10; t <= 180; t += 10) {
          const x = calculateOxideGrowth(T, t, atm);
          expect(Number.isFinite(x)).toBe(true);
          expect(x).toBeGreaterThan(0);
        }
      }
    }
  });

  /*
   * ── 방어 부족 (UI 로는 도달 불가) ──
   * 음수 시간이면 판별식이 음수가 되어 sqrt 가 NaN 을 낸다.
   * 절대영도 이하면 exp 인자가 뒤집혀 B, A 가 Infinity → Infinity−Infinity = NaN.
   * 현재 UI 슬라이더(800~1200°C, 10~180분)로는 닿지 않으므로 화면에는 안 보이지만,
   * 입력 가드가 없다는 사실을 여기 고정해 둔다. 가드를 넣으면 이 테스트가 깨진다.
   */
  it('현재 동작: 음수 시간은 NaN 을 낸다 (가드 없음)', () => {
    expect(Number.isNaN(calculateOxideGrowth(1000, -10, 'dry'))).toBe(true);
  });

  it('현재 동작: 절대영도 이하는 NaN 을 낸다 (가드 없음)', () => {
    expect(Number.isNaN(calculateOxideGrowth(-300, 60, 'dry'))).toBe(true);
  });

  it('극단적으로 긴 시간에서도 1000 nm 로 clamp 된다', () => {
    expect(calculateOxideGrowth(1200, 1e6, 'wet')).toBe(1000);
  });

  it('알 수 없는 분위기 문자열은 wet 으로 처리된다 (else 분기)', () => {
    expect(calculateOxideGrowth(1000, 60, 'plasma')).toBe(calculateOxideGrowth(1000, 60, 'wet'));
  });
});

describe('calculateOxideGrowth — 문헌값 대조', () => {
  /*
   * ── 확인된 물리 오류 ①: Deal-Grove 선형 영역이 사라졌다 ──
   *
   * 코드: A = 165 * exp(-2.0/kT)  (dry), 226 * exp(-2.0/kT) (wet)
   *
   * A 는 B 와 B/A 의 비이므로 지수는 (E_B − E_B/A) = 1.23 − 2.0 = −0.77 eV,
   * 즉 A ∝ exp(+0.77/kT) 여야 한다. 지금처럼 exp(−2.0/kT) 를 곱하면
   * 1000°C 에서 A ≈ 2.0e-6 nm 로 사실상 0이 되고, 두께식이
   *   x = (−A + √(A² + 4Bt))/2  →  √(Bt)
   * 즉 **모든 시간에서 순수 포물선**이 된다. 실제 열산화는 초기에 계면 반응이
   * 律速이라 x ∝ t (선형) 로 시작해 나중에 x ∝ √t 로 넘어간다.
   *
   * 아래 두 테스트가 그 증거다. 계산식을 고치면 사용자에게 보이는 두께가
   * 전부 달라지므로 임의로 고치지 않고 it.fails 로 올바른 기댓값만 남긴다.
   */

  it('현재 동작: 시간을 4배 하면 두께가 정확히 2배 — 즉 항상 포물선', () => {
    for (const t of [1, 5, 30, 120]) {
      const ratio = calculateOxideGrowth(1000, 4 * t, 'dry') / calculateOxideGrowth(1000, t, 'dry');
      expect(ratio).toBeCloseTo(2.0, 6);
    }
  });

  it.fails('초기 산화는 선형이어야 한다: 시간 4배면 두께가 2배보다 뚜렷이 커야 함', () => {
    // 측정값: 1분→4분 두께비 = 2.000 (순수 포물선)
    // 문헌값: 같은 조건에서 3.899 (거의 선형, x ∝ t)
    const ratio = calculateOxideGrowth(1000, 4, 'dry') / calculateOxideGrowth(1000, 1, 'dry');
    expect(ratio).toBeGreaterThan(3.0);
  });

  it.fails('dry 1000°C 60분 두께가 Deal-Grove 문헌값의 ±30% 안에 들어야 한다', () => {
    // 측정값 20.1 nm / 문헌값 54.2 nm (비율 0.37)
    const actual = calculateOxideGrowth(1000, 60, 'dry');
    const expected = literatureThicknessNm(1000, 60, 'dry');
    expect(Math.abs(actual / expected - 1)).toBeLessThan(0.3);
  });

  it.fails('wet 1000°C 60분 두께가 Deal-Grove 문헌값의 ±30% 안에 들어야 한다', () => {
    // 측정값 250.8 nm / 문헌값 449.4 nm (비율 0.56)
    const actual = calculateOxideGrowth(1000, 60, 'wet');
    const expected = literatureThicknessNm(1000, 60, 'wet');
    expect(Math.abs(actual / expected - 1)).toBeLessThan(0.3);
  });
});

describe('상대 속도 인자들', () => {
  it('결정 방위 산화 속도는 (111) > (110) > (100)', () => {
    expect(calculateOrientationRate('111')).toBeGreaterThan(calculateOrientationRate('110'));
    expect(calculateOrientationRate('110')).toBeGreaterThan(calculateOrientationRate('100'));
  });

  it('알 수 없는 방위는 1.0 으로 떨어진다', () => {
    expect(calculateOrientationRate('211')).toBe(1.0);
    expect(calculateOrientationRate(undefined)).toBe(1.0);
  });

  it('도핑이 높을수록 산화가 빨라지고, 0 이면 기준값 1.0', () => {
    expect(calculateDopingRate(0)).toBe(1.0);
    expect(calculateDopingRate(5)).toBeGreaterThan(calculateDopingRate(1));
  });

  it('초기 산화막이 두꺼울수록 성장 속도가 느려지고, 0 이면 1.0', () => {
    expect(calculateInitialOxideRate(0)).toBe(1.0);
    expect(calculateInitialOxideRate(200)).toBeLessThan(calculateInitialOxideRate(50));
    expect(calculateInitialOxideRate(50)).toBeGreaterThan(0);
  });

  it('1000°C, 1 atm 이 기준점이라 상대 속도가 정확히 1.0', () => {
    expect(calculateTempPressureRate(1000, 1)).toBeCloseTo(1.0, 12);
  });

  it('압력에 비례한다', () => {
    expect(calculateTempPressureRate(1000, 2)).toBeCloseTo(2 * calculateTempPressureRate(1000, 1), 12);
  });

  it('종합 속도는 네 인자의 곱이다', () => {
    const total = calculateTotalSimRate('111', 5, 100, 1100, 2);
    const expected =
      calculateOrientationRate('111') *
      calculateDopingRate(5) *
      calculateInitialOxideRate(100) *
      calculateTempPressureRate(1100, 2);
    expect(total).toBeCloseTo(expected, 12);
  });
});

describe('evaluateOxideQuality', () => {
  const goodFlow = { O2: 100, H2O: 100, H2: 0, HCl: 3, N2: 100 };

  it('점수는 항상 0~100 이고 등급이 붙는다', () => {
    for (const mode of ['dry', 'wet', 'pyrogenic']) {
      for (const temp of [700, 900, 1000, 1200]) {
        for (const HCl of [0, 3, 50]) {
          const r = evaluateOxideQuality(mode, temp, { ...goodFlow, HCl });
          expect(r.score).toBeGreaterThanOrEqual(0);
          expect(r.score).toBeLessThanOrEqual(100);
          expect(['A', 'B', 'C', 'D']).toContain(r.grade);
          expect(r.issues.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('HCl 과다는 점수를 떨어뜨린다', () => {
    const ok = evaluateOxideQuality('dry', 950, { ...goodFlow, HCl: 3 });
    const bad = evaluateOxideQuality('dry', 950, { ...goodFlow, HCl: 50 });
    expect(bad.score).toBeLessThan(ok.score);
  });

  it('N2 퍼지 부족은 점수를 떨어뜨린다', () => {
    // dry 950°C + HCl 보너스 조합은 이미 100점 천장에 걸려 차이가 안 보인다.
    // 보너스가 없는 wet 조건에서 비교한다.
    const base = { O2: 100, H2O: 100, H2: 0, HCl: 0, N2: 100 };
    const ok = evaluateOxideQuality('wet', 1000, base);
    const bad = evaluateOxideQuality('wet', 1000, { ...base, N2: 10 });
    expect(ok.score).toBe(100);
    expect(bad.score).toBe(90);
  });

  it('점수 상한 100 때문에 보너스가 겹치면 차이가 가려진다 (현재 동작)', () => {
    const withBonus = evaluateOxideQuality('dry', 950, { ...goodFlow, N2: 100 });
    const lowN2 = evaluateOxideQuality('dry', 950, { ...goodFlow, N2: 10 });
    expect(withBonus.score).toBe(100);
    expect(lowN2.score).toBe(100); // 110 − 10 = 100 → clamp 로 동일
  });

  it('O2 가 0 이면 "유량 부족" 경고를 내지 않는다 (경계값)', () => {
    const r = evaluateOxideQuality('dry', 950, { ...goodFlow, O2: 0 });
    expect(r.issues.some((i) => i.includes('O₂ 유량 부족'))).toBe(false);
  });

  it('pyrogenic 에서 O2 가 0 이면 나눗셈이 터지지 않는다', () => {
    const r = evaluateOxideQuality('pyrogenic', 1000, { O2: 0, H2: 100, H2O: 0, HCl: 0, N2: 100 });
    expect(Number.isNaN(r.score)).toBe(false);
  });

  it('결정적이다', () => {
    const a = evaluateOxideQuality('wet', 1000, goodFlow);
    const b = evaluateOxideQuality('wet', 1000, goodFlow);
    expect(a).toEqual(b);
  });
});
