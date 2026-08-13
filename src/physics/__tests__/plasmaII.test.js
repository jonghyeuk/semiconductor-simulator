import { describe, it, expect } from 'vitest';
import {
  calculateEtchRate,
  calculateSelectivity,
  ETCH_GAS_FACTORS,
  ETCH_GAS_SELECTIVITY,
} from '../plasmaII.js';

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

/*
 * 문헌·손계산 앵커.
 *
 * 기존 테스트는 순서와 단조성만 보기 때문에 상수를 통째로 바꿔도 통과한다.
 * 실제로 Cl2 계수를 1.2 → 4.0 으로 세 배 넘게 키워도 전 테스트가 통과하는 것을
 * 확인했다. 아래는 대표 조건의 절대값을 손계산 리터럴로 못박는다.
 */
describe('plasmaII — 절대값 앵커', () => {
  const BASE = { power: 200, pressure: 10, substrateTemp: 20, patternDensity: 50 };

  it('가스별 상대 식각 계수가 고정돼 있다', () => {
    expect(ETCH_GAS_FACTORS.CF4).toBeCloseTo(1.0, 6);
    expect(ETCH_GAS_FACTORS.Cl2).toBeCloseTo(1.2, 6);
    expect(ETCH_GAS_FACTORS.Ar).toBeCloseTo(0.3, 6);
    expect(ETCH_GAS_FACTORS.O2).toBeCloseTo(0.8, 6);
  });

  it('가스별 기준 선택비가 고정돼 있다', () => {
    expect(ETCH_GAS_SELECTIVITY.CF4).toBe(15);
    expect(ETCH_GAS_SELECTIVITY.Cl2).toBe(8);
    expect(ETCH_GAS_SELECTIVITY.Ar).toBe(2);
    expect(ETCH_GAS_SELECTIVITY.O2).toBe(25);
  });

  it('대표 조건 식각률이 ICP 문헌 대역(수십~수백 nm/min) 안이다', () => {
    for (const g of Object.keys(ETCH_GAS_FACTORS)) {
      const r = calculateEtchRate({ gasType: g, ...BASE });
      expect(r).toBeGreaterThan(10);
      expect(r).toBeLessThan(600);
    }
  });

  it('CF4 200W/10mTorr/20°C/패턴50% 에서 식각률이 고정값이다', () => {
    // 상수가 바뀌면 이 값이 움직인다 (변경 감지용 앵커).
    expect(calculateEtchRate({ gasType: 'CF4', ...BASE })).toBeCloseTo(120, 0);
  });

  it('물리 식각(Ar)이 화학 식각(CF4/Cl2)보다 선택비가 낮다', () => {
    // Ar 은 물리 스퍼터링이라 재료를 가리지 않는다.
    expect(ETCH_GAS_SELECTIVITY.Ar).toBeLessThan(ETCH_GAS_SELECTIVITY.CF4);
    expect(ETCH_GAS_SELECTIVITY.Ar).toBeLessThan(ETCH_GAS_SELECTIVITY.Cl2);
    expect(calculateSelectivity('Ar', 200)).toBeLessThan(calculateSelectivity('CF4', 200));
  });
});
