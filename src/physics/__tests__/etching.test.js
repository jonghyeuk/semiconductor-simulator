import { describe, it, expect } from 'vitest';
import {
  calculateEtchRate,
  calculateSelectivity,
  calculateUniformity,
  calculatePressureEffect,
  calculatePowerEffect,
  calculateGasRatioEffect,
} from '../etching.js';

/** 난수를 고정해 결정적으로 검증한다 (원본은 Math.random 을 직접 불렀다). */
const fixed = (v) => () => v;
const mid = fixed(0.5);

const GAS = { Cl2: 50, HBr: 20, CF4: 40, CHF3: 30, O2: 10, Ar: 60 };

describe('calculateEtchRate — 정상 경로', () => {
  it('난수를 고정하면 결정적이다', () => {
    const a = calculateEtchRate('Si', GAS, 300, 80, mid);
    const b = calculateEtchRate('Si', GAS, 300, 80, mid);
    expect(a).toBe(b);
  });

  it('난수 기본값은 Math.random 이라 호출마다 값이 흔들린다 (화면 동작 유지)', () => {
    const vals = new Set(Array.from({ length: 50 }, () => calculateEtchRate('Si', GAS, 300, 80)));
    expect(vals.size).toBeGreaterThan(1);
  });

  it('난수 폭은 ±10% 안이다', () => {
    const lo = calculateEtchRate('Si', GAS, 300, 80, fixed(0));
    const hi = calculateEtchRate('Si', GAS, 300, 80, fixed(1));
    expect(hi / lo).toBeCloseTo(1.1 / 0.9, 6);
  });

  it('파워가 높을수록 식각률이 높다 (600 W 포화 전까지)', () => {
    let prev = -Infinity;
    for (const p of [100, 200, 300, 400, 500, 600]) {
      const r = calculateEtchRate('Si', GAS, p, 80, mid);
      expect(r).toBeGreaterThan(prev);
      prev = r;
    }
  });

  it('600 W 를 넘으면 식각률 증가가 둔해진다 (포화)', () => {
    const slopeBelow = calculateEtchRate('Si', GAS, 600, 80, mid) - calculateEtchRate('Si', GAS, 500, 80, mid);
    const slopeAbove = calculateEtchRate('Si', GAS, 900, 80, mid) - calculateEtchRate('Si', GAS, 800, 80, mid);
    expect(slopeAbove).toBeLessThan(slopeBelow);
  });

  it('Si: Cl2 가 많을수록 빠르다', () => {
    const low = calculateEtchRate('Si', { ...GAS, Cl2: 20 }, 300, 80, mid);
    const high = calculateEtchRate('Si', { ...GAS, Cl2: 90 }, 300, 80, mid);
    expect(high).toBeGreaterThan(low);
  });

  it('Si: HBr 이 30 sccm 을 넘으면 측벽 passivation 으로 느려진다', () => {
    const noPass = calculateEtchRate('Si', { ...GAS, HBr: 30 }, 300, 80, mid);
    const heavy = calculateEtchRate('Si', { ...GAS, HBr: 90 }, 300, 80, mid);
    expect(heavy).toBeLessThan(noPass);
  });

  it('SiO2: CHF3 가 45 sccm 을 넘으면 폴리머로 etch stop 이 걸린다', () => {
    const ok = calculateEtchRate('SiO2', { ...GAS, CHF3: 45 }, 400, 80, mid);
    const stopped = calculateEtchRate('SiO2', { ...GAS, CHF3: 100 }, 400, 80, mid);
    expect(stopped).toBeLessThan(ok);
  });

  it('압력 sweet spot 80 mTorr 근처에서 최대다', () => {
    const peak = calculateEtchRate('Si', GAS, 300, 80, mid);
    expect(calculateEtchRate('Si', GAS, 300, 20, mid)).toBeLessThan(peak);
    expect(calculateEtchRate('Si', GAS, 300, 250, mid)).toBeLessThan(peak);
  });
});

describe('calculateEtchRate — 경계값', () => {
  it('반응 가스가 없으면 식각도 없다', () => {
    const zeroGas = { Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0 };
    for (const m of ['Si', 'SiO2', 'Si3N4', 'PR']) {
      expect(calculateEtchRate(m, zeroGas, 300, 80, mid)).toBe(0);
    }
  });

  it('플라즈마 파워가 0 이면 식각이 일어나지 않는다', () => {
    for (const m of ['Si', 'SiO2', 'Si3N4', 'PR']) {
      expect(calculateEtchRate(m, GAS, 0, 80, mid)).toBe(0);
    }
  });

  it('식각률은 음수가 되지 않는다 (passivation 이 과할 때도 0 에서 멈춘다)', () => {
    // Si 에서 HBr 과다는 측벽 passivation 으로 baseRate 를 음수로 만든다.
    const heavyHBr = { ...GAS, Cl2: 5, HBr: 200 };
    expect(calculateEtchRate('Si', heavyHBr, 300, 80, mid)).toBe(0);
  });

  it('알 수 없는 재료는 기본 baseRate 50 을 쓴다', () => {
    const w = calculateEtchRate('W', GAS, 300, 80, mid);
    expect(w).toBeGreaterThan(0);
    expect(Number.isFinite(w)).toBe(true);
  });

  it('극단적으로 높은 압력에서도 유한하고 음수가 아니다', () => {
    const r = calculateEtchRate('Si', GAS, 300, 10000, mid);
    expect(Number.isFinite(r)).toBe(true);
    expect(r).toBeGreaterThan(0);
  });

  it('음수 압력에서도 NaN 이 아니다', () => {
    expect(Number.isNaN(calculateEtchRate('Si', GAS, 300, -50, mid))).toBe(false);
  });
});

describe('calculateSelectivity', () => {
  it('난수를 고정하면 결정적이다', () => {
    expect(calculateSelectivity('Si', GAS, 300, 80, mid)).toBe(calculateSelectivity('Si', GAS, 300, 80, mid));
  });

  it('Si: HBr 이 많을수록 선택비가 높다', () => {
    const low = calculateSelectivity('Si', { ...GAS, HBr: 10 }, 300, 80, mid);
    const high = calculateSelectivity('Si', { ...GAS, HBr: 60 }, 300, 80, mid);
    expect(high).toBeGreaterThan(low);
  });

  it('SiO2: CHF3 폴리머가 많을수록 선택비가 높다', () => {
    const low = calculateSelectivity('SiO2', { ...GAS, CHF3: 10 }, 300, 80, mid);
    const high = calculateSelectivity('SiO2', { ...GAS, CHF3: 60 }, 300, 80, mid);
    expect(high).toBeGreaterThan(low);
  });

  it('고전력에서는 물리 충격이 우세해져 선택비가 떨어진다', () => {
    const low = calculateSelectivity('Si', GAS, 500, 80, mid);
    const high = calculateSelectivity('Si', GAS, 1000, 80, mid);
    expect(high).toBeLessThan(low);
  });

  it('선택비는 항상 1 이상이다 (하한)', () => {
    for (const m of ['Si', 'SiO2', 'Si3N4', 'PR', 'W']) {
      for (const p of [100, 600, 1500]) {
        expect(calculateSelectivity(m, GAS, p, 80, mid)).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('경계값: 가스 0, 초고전력이면 하한 1 로 clamp 된다', () => {
    const zeroGas = { Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0 };
    expect(calculateSelectivity('Si', zeroGas, 5000, 80, mid)).toBe(1);
  });
});

describe('calculateUniformity', () => {
  it('압력 100 mTorr, 파워 300 W 에서 최대 100% 다', () => {
    expect(calculateUniformity(100, 300, null)).toBe(100);
  });

  it('최적점에서 멀어질수록 균일도가 떨어진다', () => {
    const peak = calculateUniformity(100, 300, null);
    expect(calculateUniformity(300, 300, null)).toBeLessThan(peak);
    expect(calculateUniformity(100, 800, null)).toBeLessThan(peak);
  });

  it('총 가스 유량이 350 sccm 을 넘으면 균일도가 떨어진다', () => {
    const ok = calculateUniformity(100, 300, { a: 100, b: 100, c: 100 });
    const heavy = calculateUniformity(100, 300, { a: 300, b: 300, c: 300 });
    expect(heavy).toBeLessThan(ok);
  });

  it('항상 40~100% 범위 안이다', () => {
    for (const p of [0, 50, 100, 500, 2000]) {
      for (const w of [0, 300, 1000, 5000]) {
        const u = calculateUniformity(p, w, { a: 1000 });
        expect(u).toBeGreaterThanOrEqual(40);
        expect(u).toBeLessThanOrEqual(100);
      }
    }
  });

  it('결정적이다', () => {
    expect(calculateUniformity(100, 300, GAS)).toBe(calculateUniformity(100, 300, GAS));
  });
});

describe('보조 인자들', () => {
  it('압력 효과는 단조 증가하고 2.0 에서 포화한다', () => {
    expect(calculatePressureEffect(50)).toBeLessThan(calculatePressureEffect(100));
    expect(calculatePressureEffect(10000)).toBe(2.0);
  });

  it('파워 효과는 단조 증가하고 3.0 에서 포화한다', () => {
    expect(calculatePowerEffect(200)).toBeLessThan(calculatePowerEffect(400));
    expect(calculatePowerEffect(10000)).toBe(3.0);
  });

  it('가스비 효과는 단조 증가하고 2.0 에서 포화한다', () => {
    expect(calculateGasRatioEffect(10)).toBeLessThan(calculateGasRatioEffect(50));
    expect(calculateGasRatioEffect(10000)).toBe(2.0);
  });

  it('경계값: 0 입력에서도 하한값이 나온다', () => {
    expect(calculatePressureEffect(0)).toBe(0.5);
    expect(calculatePowerEffect(0)).toBe(0.5);
    expect(calculateGasRatioEffect(0)).toBe(0.8);
  });
});
