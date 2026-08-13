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

/**
 * Deal-Grove 문헌 상수 — <100> Si.
 *
 * Plummer Table 6.2 는 <111> 값이라 선형 상수 전인자를 1.68 로 나눠 <100> 으로
 * 맞췄다 (dry 6.23e6→3.71e6, wet 1.63e8→9.70e7). 포물선 상수는 방위 무관.
 *
 * 주의: 이 헬퍼는 구현과 같은 식·같은 상수를 쓰므로 "문헌 대조"가 아니라
 * 자기 자신과의 대조다. 실제 문헌값 검증은 아래 '절대 두께' 테스트가 한다.
 */
const K = 8.617e-5;
function literatureThicknessNm(tempC, timeMin, atm) {
  const kT = K * (tempC + 273.15);
  const B = atm === 'dry' ? 7.72e2 * Math.exp(-1.23 / kT) : 3.86e2 * Math.exp(-0.78 / kT);
  const BA = atm === 'dry' ? 3.71e6 * Math.exp(-2.0 / kT) : 9.7e7 * Math.exp(-2.05 / kT);
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
  it('유량 0 은 산화종 공급이 절반인 것과 같다 (= 시간 절반)', () => {
    // 유량은 표면 산화종 농도를 통해 들어오므로 B 와 B/A 가 함께 스케일되고,
    // 결과적으로 시간이 절반인 것과 같아진다. 두께 자체가 절반이 되는 게 아니다.
    const zeroFlow = calculateOxideGrowth(1000, 60, 'dry', 0);
    const halfTime = calculateOxideGrowth(1000, 30, 'dry', 100);
    expect(zeroFlow).toBeCloseTo(halfTime, 9);
  });

  it('유량을 줄여도 Deal-Grove 관계 x² + A·x = B·t 가 유지된다', () => {
    // 두께를 사후에 곱해 버리면 이 관계가 깨진다.
    const kT = 8.617e-5 * (1000 + 273.15);
    const B = 7.72e2 * Math.exp(-1.23 / kT);
    const BA = 3.71e6 * Math.exp(-2.0 / kT); // <100> (Table 6.2 <111> 값 ÷ 1.68)
    const A = B / BA;
    for (const flow of [0, 50, 100, 200]) {
      const f = 0.5 + (flow / 100) * 0.5;
      const x = calculateOxideGrowth(1000, 60, 'dry', flow) / 1000; // μm
      expect(x * x + A * x).toBeCloseTo(B * (1 * f), 9);
    }
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

  it('음수 시간이면 산화가 없다 (NaN 아님)', () => {
    expect(calculateOxideGrowth(1000, -10, 'dry')).toBe(0);
  });

  it('절대영도 이하이면 산화가 없다 (NaN 아님)', () => {
    expect(calculateOxideGrowth(-300, 60, 'dry')).toBe(0);
    expect(calculateOxideGrowth(-273.15, 60, 'dry')).toBe(0);
  });

  it('어떤 입력에서도 NaN 이나 음수가 나오지 않는다', () => {
    for (const T of [-500, -273.15, 0, 800, 1200, 5000]) {
      for (const t of [-100, 0, 1, 1e6]) {
        for (const f of [-50, 0, 100, 1e6]) {
          const x = calculateOxideGrowth(T, t, 'dry', f);
          expect(Number.isFinite(x)).toBe(true);
          expect(x).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('극단적으로 긴 시간에서도 상한으로 clamp 된다', () => {
    expect(calculateOxideGrowth(1200, 1e6, 'wet')).toBe(5000);
  });

  it('UI 로 닿을 수 있는 최대 두께가 상한에 걸리지 않는다', () => {
    // 상한이 실제 공정 범위를 잘라내면 안 된다.
    // 예전 상한 1000 nm 는 wet 1200°C 180분(≈1.5 μm)을 잘라먹었다.
    const maxReachable = calculateOxideGrowth(1200, 180, 'wet', 200);
    expect(maxReachable).toBeLessThan(5000);
    expect(maxReachable).toBeGreaterThan(1000);
  });

  it('알 수 없는 분위기 문자열은 wet 으로 처리된다 (else 분기)', () => {
    expect(calculateOxideGrowth(1000, 60, 'plasma')).toBe(calculateOxideGrowth(1000, 60, 'wet'));
  });
});

describe('calculateOxideGrowth — 문헌값 대조', () => {
  /*
   * Deal-Grove 는 초기에 계면 반응이 律速이라 x ∝ t (선형) 로 시작해
   * 산화막이 두꺼워지면 확산 律速이 되어 x ∝ √t (포물선) 로 넘어간다.
   * 두 영역이 다 살아 있는지가 이 모델이 제대로 섰는지를 가르는 지점이다.
   */

  /*
   * 아래 두 테스트는 상수를 다시 쓰지 않고 **절대 두께**를 공개된 <100> 산화
   * 곡선과 비교한다. 기존 '문헌 대조' 테스트는 구현과 같은 상수를 복사해 쓰는
   * 자기 대조라서, 상수가 통째로 <111> 값이어도 통과했다.
   */
  it('절대 두께가 공개된 <100> 산화 곡선과 맞는다', () => {
    // dry 는 30 nm 이하에서 Deal-Grove 가 실제보다 얇게 나오는 것으로 알려져 있어
    // (초기 산화 이상) 범위를 넓게 잡는다. wet 은 그 영향이 없어 좁게 잡을 수 있다.
    const cases = [
      // [온도, 분, 분위기, 하한 nm, 상한 nm]
      [1000, 60, 'dry', 30, 60],
      [1100, 60, 'dry', 80, 130],
      [1000, 60, 'wet', 350, 430],
      [1100, 60, 'wet', 550, 680],
    ];
    for (const [T, t, atm, lo, hi] of cases) {
      const x = calculateOxideGrowth(T, t, atm);
      expect(x).toBeGreaterThan(lo);
      expect(x).toBeLessThan(hi);
    }
  });

  it('선형 영역 성장률이 <111> 이 아니라 <100> 값이다', () => {
    // 짧은 시간에는 x ≈ (B/A)·t 이므로 선형 상수가 그대로 드러난다.
    // 1000°C dry: <100> B/A ≈ 0.0449 μm/hr → 6분에 ≈ 4.5 nm.
    // <111> 이면 1.68 배인 ≈ 7.5 nm 가 되어 이 범위를 벗어난다.
    const x6 = calculateOxideGrowth(1000, 6, 'dry');
    expect(x6).toBeGreaterThan(3.8);
    expect(x6).toBeLessThan(5.2);
  });

  it('초기 산화는 선형이다: 시간 4배면 두께가 거의 4배', () => {
    const ratio = calculateOxideGrowth(900, 4, 'dry') / calculateOxideGrowth(900, 1, 'dry');
    expect(ratio).toBeGreaterThan(3.8);
    expect(ratio).toBeLessThanOrEqual(4.0);
  });

  it('충분히 두꺼워지면 포물선으로 넘어간다: 시간 4배에 두께 2배 쪽으로 수렴', () => {
    // 상한 clamp 에 걸리지 않는 조건에서 본다 (dry 1000°C, 1000 → 4000분).
    const ratio = calculateOxideGrowth(1000, 4000, 'dry') / calculateOxideGrowth(1000, 1000, 'dry');
    expect(ratio).toBeLessThan(2.3);
    expect(ratio).toBeGreaterThan(1.9);
  });

  it('시간이 길어질수록 선형 → 포물선으로 단조롭게 이행한다', () => {
    let prev = Infinity;
    for (const t of [1, 10, 60, 240, 1000]) {
      const ratio = calculateOxideGrowth(1100, 4 * t, 'dry') / calculateOxideGrowth(1100, t, 'dry');
      expect(ratio).toBeLessThan(prev);
      prev = ratio;
    }
    expect(prev).toBeLessThan(2.5);
  });

  it('dry 두께가 Deal-Grove 문헌값의 ±5% 안에 든다', () => {
    for (const T of [900, 1000, 1100, 1200]) {
      for (const t of [10, 60, 180]) {
        const actual = calculateOxideGrowth(T, t, 'dry');
        const expected = literatureThicknessNm(T, t, 'dry');
        expect(Math.abs(actual / expected - 1)).toBeLessThan(0.05);
      }
    }
  });

  it('wet 두께가 Deal-Grove 문헌값의 ±5% 안에 든다', () => {
    for (const T of [900, 1000, 1100, 1200]) {
      for (const t of [10, 60, 180]) {
        const actual = calculateOxideGrowth(T, t, 'wet');
        const expected = literatureThicknessNm(T, t, 'wet');
        expect(Math.abs(actual / expected - 1)).toBeLessThan(0.05);
      }
    }
  });

  it('대표 조건의 출력이 고정돼 있다 (상수 변경 감지용)', () => {
    // <100> 기준. 예전에는 54.2 / 449.4 로 박아 두었는데, 그건 Table 6.2 의
    // <111> 상수를 그대로 쓴 값이었다. 문헌 대조는 위 '절대 두께' 테스트가 한다.
    expect(calculateOxideGrowth(1000, 60, 'dry')).toBeCloseTo(38.5, 0);
    expect(calculateOxideGrowth(1000, 60, 'wet')).toBeCloseTo(388.3, 0);
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

  it('음수 두께는 0 으로 막힌다 (−100 nm 면 분모가 0 이라 발산한다)', () => {
    expect(calculateInitialOxideRate(-100)).toBe(1.0);
    expect(calculateInitialOxideRate(-1000)).toBe(1.0);
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
