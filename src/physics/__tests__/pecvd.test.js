import { describe, it, expect } from 'vitest';
import {
  calculateRefractiveIndex,
  calculateHydrogenContent,
  calculateFilmDensity,
  calculateDanglingBondDensity,
  calculateaSiHContent,
  calculateSiNxRefractiveIndex,
  calculateNSiRatio,
} from '../pecvd.js';

/** 구간별 정의 함수가 이음매에서 튀지 않는지 확인한다. */
function assertContinuousAt(fn, breakpoints, tol = 1e-9) {
  for (const b of breakpoints) {
    const left = fn(b - 1e-7);
    const right = fn(b);
    expect(Math.abs(left - right)).toBeLessThan(tol);
  }
}

describe('calculateRefractiveIndex (SiO2)', () => {
  it('구간 경계 10 / 14 / 18 에서 값이 이어진다', () => {
    assertContinuousAt(calculateRefractiveIndex, [10, 14, 18], 1e-6);
  });

  it('N2O/SiH4 비가 커질수록(O-rich) 굴절률이 낮아진다', () => {
    let prev = Infinity;
    for (const r of [5, 8, 10, 12, 14, 16, 18, 25, 40]) {
      const n = calculateRefractiveIndex(r);
      expect(n).toBeLessThan(prev);
      prev = n;
    }
  });

  it('화학량론 SiO2 (ratio 14) 굴절률이 문헌값 1.46 이다', () => {
    expect(calculateRefractiveIndex(14)).toBeCloseTo(1.46, 6);
  });

  it('전 구간에서 SiO2 물리 범위(1.4~1.7) 안이다', () => {
    for (let r = 2; r <= 40; r += 0.1) {
      const n = calculateRefractiveIndex(r);
      expect(n).toBeGreaterThan(1.4);
      expect(n).toBeLessThan(1.7);
    }
  });

  it('결정적이다', () => {
    expect(calculateRefractiveIndex(12)).toBe(calculateRefractiveIndex(12));
  });

  it('경계값: 비율 0 에서도 유한하고 물리 범위 밖으로 안 나간다', () => {
    expect(Number.isFinite(calculateRefractiveIndex(0))).toBe(true);
    expect(calculateRefractiveIndex(0)).toBeLessThan(1.7);
  });

  it('O-rich 쪽 하한 1.4 로 clamp 된다 (하한이 없으면 결국 음수까지 내려간다)', () => {
    expect(calculateRefractiveIndex(1e6)).toBe(1.4);
    expect(calculateRefractiveIndex(500)).toBe(1.4);
  });
});

describe('calculateSiNxRefractiveIndex', () => {
  it('구간 경계 5 / 10 에서 값이 이어진다', () => {
    assertContinuousAt(calculateSiNxRefractiveIndex, [5, 10], 1e-6);
  });

  it('NH3/SiH4 비가 커질수록(N-rich) 굴절률이 낮아진다', () => {
    let prev = Infinity;
    for (const r of [2, 4, 5, 8, 10, 12]) {
      const n = calculateSiNxRefractiveIndex(r);
      expect(n).toBeLessThan(prev);
      prev = n;
    }
  });

  it('화학량론 Si3N4 (ratio 8) 굴절률이 문헌값 2.0 근처다', () => {
    expect(calculateSiNxRefractiveIndex(8)).toBeCloseTo(2.0, 1);
  });

  it('N-rich 쪽 하한 1.8 로 clamp 된다 (질화막 굴절률의 물리적 하한)', () => {
    expect(calculateSiNxRefractiveIndex(50)).toBe(1.8);
    expect(calculateSiNxRefractiveIndex(1000)).toBe(1.8);
  });

  it('전 구간에서 SiNx 물리 범위(1.8~2.5) 안이다', () => {
    for (let r = 0; r <= 100; r += 0.5) {
      const n = calculateSiNxRefractiveIndex(r);
      expect(n).toBeGreaterThanOrEqual(1.8);
      expect(n).toBeLessThan(2.5);
    }
  });
});

describe('calculateNSiRatio', () => {
  it('NH3 비가 커질수록 N/Si 비가 커지고 1.6 에서 포화한다', () => {
    expect(calculateNSiRatio(2)).toBeLessThan(calculateNSiRatio(8));
    expect(calculateNSiRatio(100)).toBe(1.6);
  });

  it('원자비는 음수가 되지 않는다', () => {
    for (const r of [-1000, -100, -8.6, 0, 10]) {
      expect(calculateNSiRatio(r)).toBeGreaterThanOrEqual(0);
    }
  });

  it('화학량론 Si3N4 의 N/Si = 1.33 을 ratio 8 부근에서 지난다', () => {
    expect(calculateNSiRatio(8)).toBeCloseTo(1.16, 1);
    expect(calculateNSiRatio(11)).toBeGreaterThan(1.33);
  });
});

describe('calculateHydrogenContent / calculateFilmDensity', () => {
  it('온도가 높을수록 H 함량이 줄어든다', () => {
    let prev = Infinity;
    for (const T of [200, 250, 300, 350, 400]) {
      const h = calculateHydrogenContent(T);
      expect(h).toBeLessThan(prev);
      prev = h;
    }
  });

  it('온도가 높을수록 막 밀도가 올라간다', () => {
    let prev = -Infinity;
    for (const T of [200, 250, 300, 350]) {
      const d = calculateFilmDensity(T);
      expect(d).toBeGreaterThan(prev);
      prev = d;
    }
  });

  it('H 함량과 막 밀도는 서로 반대로 움직인다 (물리적으로 맞는 방향)', () => {
    expect(calculateHydrogenContent(400)).toBeLessThan(calculateHydrogenContent(200));
    expect(calculateFilmDensity(400)).toBeGreaterThan(calculateFilmDensity(200));
  });

  it('경계값: H 함량 하한 5%, 밀도 상한 100% 로 clamp 된다', () => {
    expect(calculateHydrogenContent(1000)).toBe(5);
    expect(calculateFilmDensity(1000)).toBe(100);
  });

  it('경계값: 온도 0 에서도 물리적으로 말이 되는 값이다', () => {
    expect(calculateHydrogenContent(0)).toBe(35);
    expect(calculateFilmDensity(0)).toBe(60);
  });
});

describe('a-Si:H — 댕글링 본드 / H 함량', () => {
  it('구간 경계 3 / 10 / 20 에서 값이 이어진다', () => {
    assertContinuousAt(calculateDanglingBondDensity, [3, 10, 20], 1e-6);
  });

  it('구간 경계 5 / 15 에서 값이 이어진다', () => {
    assertContinuousAt(calculateaSiHContent, [5, 15], 1e-6);
  });

  it('H2 희석이 커질수록 댕글링 본드가 줄어든다 (막질 개선)', () => {
    let prev = Infinity;
    for (const d of [0, 2, 5, 10, 15, 20, 30]) {
      const v = calculateDanglingBondDensity(d);
      expect(v).toBeLessThan(prev);
      prev = v;
    }
  });

  it('희석이 클수록 H 함량이 줄어든다 (etching 효과)', () => {
    let prev = Infinity;
    for (const d of [0, 3, 5, 10, 15, 25]) {
      const v = calculateaSiHContent(d);
      expect(v).toBeLessThan(prev);
      prev = v;
    }
  });

  it('디바이스급 희석(20~30)에서 댕글링 본드가 10 이하로 내려간다', () => {
    expect(calculateDanglingBondDensity(25)).toBeLessThan(10);
  });

  it('경계값: 댕글링 본드 하한 3, H 함량 하한 8 로 clamp 된다', () => {
    expect(calculateDanglingBondDensity(1000)).toBe(3);
    expect(calculateaSiHContent(1000)).toBe(8);
  });

  it('경계값: 희석 0 에서 각각 50, 15 로 시작한다', () => {
    expect(calculateDanglingBondDensity(0)).toBe(50);
    expect(calculateaSiHContent(0)).toBe(15);
  });

  it('결정적이다', () => {
    expect(calculateDanglingBondDensity(12)).toBe(calculateDanglingBondDensity(12));
    expect(calculateaSiHContent(12)).toBe(calculateaSiHContent(12));
  });
});
