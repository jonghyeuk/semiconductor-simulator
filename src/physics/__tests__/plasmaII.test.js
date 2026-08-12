import { describe, it, expect } from 'vitest';
import { calculateEtchRate, calculateSelectivity, ETCH_GAS_FACTORS } from '../plasmaII.js';

const base = { gasType: 'CF4', power: 200, pressure: 10, substrateTemp: 20, patternDensity: 50 };
const GASES = Object.keys(ETCH_GAS_FACTORS);

describe('calculateEtchRate — 정상 경로', () => {
  it('파워가 높을수록 빠르다 (√P)', () => {
    let prev = -Infinity;
    for (const power of [50, 100, 200, 350, 500]) {
      const r = calculateEtchRate({ ...base, power });
      expect(r).toBeGreaterThan(prev);
      prev = r;
    }
  });

  it('파워 4배면 식각률이 2배다', () => {
    const a = calculateEtchRate({ ...base, power: 100 });
    const b = calculateEtchRate({ ...base, power: 400 });
    expect(b / a).toBeCloseTo(2, 9);
  });

  it('압력이 높을수록 빠르다', () => {
    let prev = -Infinity;
    for (const pressure of [1, 5, 10, 50, 100]) {
      const r = calculateEtchRate({ ...base, pressure });
      expect(r).toBeGreaterThan(prev);
      prev = r;
    }
  });

  it('기판 온도가 높을수록 빠르다', () => {
    let prev = -Infinity;
    for (const substrateTemp of [0, 50, 150, 300]) {
      const r = calculateEtchRate({ ...base, substrateTemp });
      expect(r).toBeGreaterThan(prev);
      prev = r;
    }
  });

  it('패턴 밀도가 높을수록 느려진다 (로딩 효과)', () => {
    const sparse = calculateEtchRate({ ...base, patternDensity: 0 });
    const dense = calculateEtchRate({ ...base, patternDensity: 100 });
    expect(dense).toBeLessThan(sparse);
  });

  it('반응성 가스가 Ar 보다 빠르다 (Ar 은 물리 스퍼터링만)', () => {
    const ar = calculateEtchRate({ ...base, gasType: 'Ar' });
    for (const g of ['CF4', 'Cl2', 'O2']) {
      expect(calculateEtchRate({ ...base, gasType: g })).toBeGreaterThan(ar);
    }
  });

  it('결정적이다', () => {
    expect(calculateEtchRate(base)).toBe(calculateEtchRate(base));
  });
});

describe('calculateEtchRate — 경계값', () => {
  it('파워 0 이면 식각이 없다', () => {
    expect(calculateEtchRate({ ...base, power: 0 })).toBe(0);
  });

  it('압력 0 이면 식각이 없다', () => {
    expect(calculateEtchRate({ ...base, pressure: 0 })).toBe(0);
  });

  /*
   * 예전에는 tempFactor = 1 + (T − 20)·0.01 에 하한이 없어서 −100°C 를 넣으면
   * 식각률이 −24 nm/min 으로 나왔다. UI 범위(0~300°C)로는 닿지 않지만 막아 둔다.
   */
  it('극저온에서도 식각률이 음수가 되지 않는다', () => {
    for (const substrateTemp of [-273, -100, -80, 0]) {
      expect(calculateEtchRate({ ...base, substrateTemp })).toBeGreaterThanOrEqual(0);
    }
  });

  it('어떤 입력에서도 유한하고 음수가 아니다', () => {
    for (const power of [-100, 0, 500, 1e6]) {
      for (const pressure of [-10, 0, 100, 1e6]) {
        for (const patternDensity of [-50, 0, 100, 500]) {
          const r = calculateEtchRate({ ...base, power, pressure, patternDensity });
          expect(Number.isFinite(r)).toBe(true);
          expect(r).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('모르는 가스는 기본 계수 1.0 을 쓴다', () => {
    expect(calculateEtchRate({ ...base, gasType: 'SF6' })).toBe(
      calculateEtchRate({ ...base, gasType: 'CF4' })
    );
  });

  it('UI 슬라이더 전 범위에서 유한한 양수다', () => {
    for (const g of GASES) {
      for (let power = 50; power <= 500; power += 50) {
        for (let pressure = 1; pressure <= 100; pressure += 20) {
          const r = calculateEtchRate({ ...base, gasType: g, power, pressure });
          expect(r).toBeGreaterThan(0);
          expect(Number.isFinite(r)).toBe(true);
        }
      }
    }
  });
});

describe('calculateSelectivity', () => {
  it('O2 가 가장 선택비가 높고 Ar 이 가장 낮다', () => {
    const sel = (g) => calculateSelectivity(g, 200);
    expect(sel('O2')).toBeGreaterThan(sel('CF4'));
    expect(sel('CF4')).toBeGreaterThan(sel('Cl2'));
    expect(sel('Cl2')).toBeGreaterThan(sel('Ar'));
  });

  it('파워가 높을수록 선택비가 떨어진다', () => {
    let prev = Infinity;
    for (const power of [50, 100, 200, 350, 500]) {
      const s = calculateSelectivity('CF4', power);
      expect(s).toBeLessThan(prev);
      prev = s;
    }
  });

  it('선택비는 항상 양수다 (하한 계수 0.2)', () => {
    for (const g of GASES) {
      for (const power of [0, 500, 5000, 1e6]) {
        expect(calculateSelectivity(g, power)).toBeGreaterThan(0);
      }
    }
  });

  it('극단적 고전력에서 기준값의 20% 로 clamp 된다', () => {
    expect(calculateSelectivity('CF4', 1e6)).toBeCloseTo(15 * 0.2, 9);
  });

  it('결정적이다', () => {
    expect(calculateSelectivity('CF4', 200)).toBe(calculateSelectivity('CF4', 200));
  });
});
