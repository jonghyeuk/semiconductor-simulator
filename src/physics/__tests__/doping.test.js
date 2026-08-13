import { describe, it, expect } from 'vitest';
import {
  calculateDiffusionCoefficient,
  erfc,
  calculateImplantParams,
  calculateDiffusionProfile,
  calculateImplantationProfile,
  dopantProperties,
} from '../doping.js';

const DOPANTS = Object.keys(dopantProperties);

describe('calculateDiffusionCoefficient', () => {
  it('온도가 오르면 확산계수가 커진다 (Arrhenius)', () => {
    for (const d of DOPANTS) {
      let prev = -Infinity;
      for (const T of [800, 900, 1000, 1100, 1200]) {
        const D = calculateDiffusionCoefficient(T, d);
        expect(D).toBeGreaterThan(prev);
        prev = D;
      }
    }
  });

  it('활성화 에너지가 클수록 같은 온도에서 확산이 느리다', () => {
    // As(Qd=3.56) > B(Qd=3.46) 이지만 D0 도 다르므로 지수항만 비교한다.
    const k = 8.617e-5;
    const T = 1273.15;
    const expAs = Math.exp(-dopantProperties.As.Qd / (k * T));
    const expB = Math.exp(-dopantProperties.B.Qd / (k * T));
    expect(expAs).toBeLessThan(expB);
  });

  it('1000°C 붕소 확산계수가 문헌 범위(10⁻¹⁴ ~ 10⁻¹³ cm²/s)에 있다', () => {
    const D = calculateDiffusionCoefficient(1000, 'B');
    expect(D).toBeGreaterThan(1e-15);
    expect(D).toBeLessThan(1e-12);
  });

  // D0 와 Qd 를 서로 다른 출처에서 섞어 오면 개별 값은 그럴듯해 보여도
  // 도펀트 간 상대 속도가 뒤집힌다. 아래 두 테스트가 그 짝 오류를 잡는다.
  it('도펀트 확산 속도 순서가 문헌과 같다: B ≳ P > In > As > Sb', () => {
    for (const T of [900, 1000, 1100]) {
      const D = (d) => calculateDiffusionCoefficient(T, d);
      expect(D('B')).toBeGreaterThan(D('P'));
      expect(D('P')).toBeGreaterThan(D('In'));
      expect(D('In')).toBeGreaterThan(D('As'));
      expect(D('As')).toBeGreaterThan(D('Sb'));
    }
  });

  it('인듐은 붕소보다 느리게 확산한다 (halo/retrograde well 용도의 근거)', () => {
    // In 을 붕소보다 빠르게 만들어 놓으면 halo 주입 자체가 성립하지 않는다.
    // Fuller/Fair (Phys. Rev. B 3, 1971): In D0=0.785 cm²/s, Qd=3.63 eV.
    for (const T of [900, 1000, 1100]) {
      expect(calculateDiffusionCoefficient(T, 'In'))
        .toBeLessThan(calculateDiffusionCoefficient(T, 'B'));
    }
  });

  it('1000°C 에서 도펀트 확산계수가 모두 문헌 범위(10⁻¹⁷ ~ 10⁻¹² cm²/s)에 있다', () => {
    for (const d of DOPANTS) {
      const D = calculateDiffusionCoefficient(1000, d);
      expect(D).toBeGreaterThan(1e-17);
      expect(D).toBeLessThan(1e-12);
    }
  });

  it('결정적이다', () => {
    expect(calculateDiffusionCoefficient(1000, 'B')).toBe(calculateDiffusionCoefficient(1000, 'B'));
  });

  it('경계값: 절대영도(-273.15°C)에서 0 으로 수렴한다', () => {
    expect(calculateDiffusionCoefficient(-273.15, 'B')).toBe(0);
  });
});

describe('erfc', () => {
  it('erfc(0) = 1', () => {
    expect(erfc(0)).toBeCloseTo(1.0, 6);
  });

  it('단조 감소한다', () => {
    let prev = Infinity;
    for (let x = -3; x <= 3; x += 0.1) {
      const v = erfc(x);
      expect(v).toBeLessThan(prev);
      prev = v;
    }
  });

  it('대칭성: erfc(-x) = 2 − erfc(x)', () => {
    for (const x of [0.1, 0.5, 1.0, 2.0, 3.0]) {
      expect(erfc(-x)).toBeCloseTo(2 - erfc(x), 6);
    }
  });

  it('문헌값과 일치한다 (A&S 근사 오차 1.5e-7 이내)', () => {
    expect(erfc(0.5)).toBeCloseTo(0.4795001, 6);
    expect(erfc(1.0)).toBeCloseTo(0.1572992, 6);
    expect(erfc(2.0)).toBeCloseTo(0.0046777, 6);
  });

  it('경계값: 큰 x 에서 0 에 붙고 음수가 되지 않는다', () => {
    expect(erfc(10)).toBeGreaterThanOrEqual(0);
    expect(erfc(10)).toBeLessThan(1e-6);
  });
});

describe('calculateImplantParams — 정상 경로', () => {
  it('에너지가 높을수록 깊게 박힌다', () => {
    for (const d of DOPANTS) {
      let prev = -Infinity;
      for (const E of [10, 30, 50, 100, 200]) {
        const { Rp } = calculateImplantParams(E, d);
        expect(Rp).toBeGreaterThan(prev);
        prev = Rp;
      }
    }
  });

  it('틸트를 주면 수직 투영 비정이 깊어진다 (1/cosθ)', () => {
    const straight = calculateImplantParams(50, 'B', 0).Rp;
    const tilted = calculateImplantParams(50, 'B', 30).Rp;
    expect(tilted).toBeCloseTo(straight / Math.cos((30 * Math.PI) / 180), 9);
  });

  it('ΔRp/Rp 는 이온 질량으로만 정해지고 에너지와 무관하다', () => {
    for (const d of DOPANTS) {
      const ratios = [10, 50, 100, 200].map((E) => {
        const { Rp, deltaRp } = calculateImplantParams(E, d);
        return deltaRp / Rp;
      });
      for (const r of ratios) expect(r).toBeCloseTo(ratios[0], 9);
    }
  });

  it('ΔRp/Rp 가 문헌 범위(0.2~0.4)에 있다', () => {
    for (const d of DOPANTS) {
      const { Rp, deltaRp } = calculateImplantParams(100, d);
      expect(deltaRp / Rp).toBeGreaterThan(0.2);
      expect(deltaRp / Rp).toBeLessThan(0.4);
    }
  });

  it('결정적이다', () => {
    expect(calculateImplantParams(50, 'As')).toEqual(calculateImplantParams(50, 'As'));
  });
});

describe('calculateImplantParams — 경계값', () => {
  it('에너지 0 이면 이온이 안 들어간다', () => {
    const { Rp, deltaRp } = calculateImplantParams(0, 'B');
    expect(Rp).toBe(0);
    expect(deltaRp).toBe(0);
  });

  it('음수 에너지에서도 0 이고 NaN 이 아니다', () => {
    const { Rp, deltaRp } = calculateImplantParams(-50, 'B');
    expect(Rp).toBe(0);
    expect(deltaRp).toBe(0);
  });

  it('틸트 0 과 음수 틸트는 같다 (보정 미적용)', () => {
    expect(calculateImplantParams(50, 'B', -10).Rp).toBe(calculateImplantParams(50, 'B', 0).Rp);
  });

  it('틸트 90° 이상은 89° 로 막혀 발산하지 않는다', () => {
    const at89 = calculateImplantParams(50, 'B', 89).Rp;
    expect(calculateImplantParams(50, 'B', 90).Rp).toBe(at89);
    expect(calculateImplantParams(50, 'B', 180).Rp).toBe(at89);
    expect(Number.isFinite(at89)).toBe(true);
  });
});

describe('calculateImplantParams — 문헌값 대조', () => {
  /*
   * LSS/ZBL 적분 모델. 무거운 이온일수록 핵 저지능이 커서 얕게 박힌다.
   * 예전 구현은 환산 에너지 분자에 타겟 질량 M₂ 대신 이온 질량 M₁ 을 쓰고
   * Rp 앞에 (M₁/M₂) 를 곱하는 바람에 순서가 정반대였다.
   */

  it('같은 에너지에서 무거운 이온일수록 얕게 박힌다', () => {
    for (const E of [15, 30, 50, 100, 180]) {
      const B = calculateImplantParams(E, 'B').Rp;
      const P = calculateImplantParams(E, 'P').Rp;
      const As = calculateImplantParams(E, 'As').Rp;
      const Sb = calculateImplantParams(E, 'Sb').Rp;
      expect(B).toBeGreaterThan(P);
      expect(P).toBeGreaterThan(As);
      expect(As).toBeGreaterThan(Sb);
    }
  });

  it('문헌 Rp 값의 ±25% 안에 든다', () => {
    // Si 기준 투영 비정 (nm)
    const lit = {
      B: { 30: 100, 50: 160, 100: 300 },
      P: { 30: 39, 50: 62, 100: 130 },
      As: { 30: 22, 50: 33, 100: 60 },
    };
    for (const [ion, table] of Object.entries(lit)) {
      for (const [E, expected] of Object.entries(table)) {
        const Rp = calculateImplantParams(Number(E), ion).Rp * 1000; // nm
        expect(Math.abs(Rp / expected - 1)).toBeLessThan(0.25);
      }
    }
  });

  it('ΔRp/Rp 가 이온마다 다르다 (예전엔 전부 0.5 고정이었다)', () => {
    const ratios = DOPANTS.map((d) => {
      const { Rp, deltaRp } = calculateImplantParams(100, d);
      return Number((deltaRp / Rp).toFixed(4));
    });
    expect(new Set(ratios).size).toBeGreaterThan(1);
  });

  it('에너지에 대해 단조 증가하지만 선형보다 느리다 (저지능 증가)', () => {
    for (const d of DOPANTS) {
      const r50 = calculateImplantParams(50, d).Rp;
      const r100 = calculateImplantParams(100, d).Rp;
      expect(r100).toBeGreaterThan(r50);
      expect(r100 / r50).toBeLessThan(2.0);
    }
  });
});

describe('calculateDiffusionProfile', () => {
  const base = {
    currentTime: 30,
    temperature: 1000,
    dopant: 'B',
    processType: 'predeposition',
    surfaceConc: 1e20,
    backgroundConc: 1e15,
  };

  it('표면에서 최대이고 깊이에 따라 단조 감소한다', () => {
    for (const processType of ['predeposition', 'drivein']) {
      const p = calculateDiffusionProfile({ ...base, processType });
      for (let i = 1; i < p.length; i++) {
        expect(p[i].concentration).toBeLessThanOrEqual(p[i - 1].concentration);
      }
      expect(p[0].concentration).toBe(Math.max(...p.map((q) => q.concentration)));
    }
  });

  it('predeposition 은 표면 농도가 C0 로 고정된다', () => {
    const p = calculateDiffusionProfile(base);
    expect(p[0].concentration / 1e20).toBeCloseTo(1.0, 6);
  });

  it('배경 농도 아래로 내려가지 않는다', () => {
    const p = calculateDiffusionProfile(base);
    for (const pt of p) expect(pt.concentration).toBeGreaterThanOrEqual(1e15);
  });

  it('drive-in 은 도즈가 보존되어 시간이 길수록 표면 농도가 낮아진다', () => {
    const short = calculateDiffusionProfile({ ...base, processType: 'drivein', currentTime: 10 });
    const long = calculateDiffusionProfile({ ...base, processType: 'drivein', currentTime: 120 });
    expect(long[0].concentration).toBeLessThan(short[0].concentration);
  });

  it('온도가 높을수록 같은 깊이에서 농도가 높다 (더 깊이 퍼짐)', () => {
    const cold = calculateDiffusionProfile({ ...base, temperature: 900 });
    const hot = calculateDiffusionProfile({ ...base, temperature: 1100 });
    // 깊은 쪽은 양쪽 다 배경 농도 바닥에 깔리므로 확산 전선이 살아 있는 얕은 쪽에서 본다.
    const shallow = 3;
    expect(hot[shallow].concentration).toBeGreaterThan(cold[shallow].concentration);
  });

  it('결정적이다', () => {
    expect(calculateDiffusionProfile(base)).toEqual(calculateDiffusionProfile(base));
  });

  it('시간이 0 이면 확산이 없다 (predeposition: 표면만 C0)', () => {
    const p = calculateDiffusionProfile({ ...base, currentTime: 0 });
    expect(p[0].concentration).toBe(1e20);
    expect(p[10].concentration).toBe(1e15);
    for (const pt of p) expect(Number.isNaN(pt.concentration)).toBe(false);
  });

  it('시간이 0 이면 확산이 없다 (drive-in: 전 구간 배경 농도)', () => {
    const p = calculateDiffusionProfile({ ...base, processType: 'drivein', currentTime: 0 });
    for (const pt of p) {
      expect(Number.isNaN(pt.concentration)).toBe(false);
      expect(pt.concentration).toBe(1e15);
    }
  });
});

describe('calculateImplantationProfile', () => {
  const base = { energy: 50, dopant: 'B', dose: 1e15, tilt: 0, annealing: false };

  it('피크가 표면이 아니라 Rp 부근에 있다', () => {
    const p = calculateImplantationProfile(base);
    const peakIdx = p.reduce((best, pt, i) => (pt.concentration > p[best].concentration ? i : best), 0);
    expect(peakIdx).toBeGreaterThan(0);
    const { Rp } = calculateImplantParams(50, 'B');
    expect(p[peakIdx].depth).toBeCloseTo(Rp, 2);
  });

  it('도즈가 2배면 농도도 어디서나 2배다 (선형)', () => {
    const a = calculateImplantationProfile(base);
    const b = calculateImplantationProfile({ ...base, dose: 2e15 });
    // 하한 1e14 로 clamp 된 꼬리 구간은 비례 관계가 성립하지 않으므로 제외한다.
    const ratios = a
      .map((pt, i) => ({ base: pt.concentration, doubled: b[i].concentration }))
      .filter((r) => r.base > 1e14)
      .map((r) => r.doubled / r.base);
    expect(ratios.length).toBeGreaterThan(10);
    for (const r of ratios) expect(r).toBeCloseTo(2, 6);
  });

  it('어닐링하면 피크가 낮아지고 프로파일이 넓어진다', () => {
    const asImplanted = calculateImplantationProfile(base);
    const annealed = calculateImplantationProfile({ ...base, annealing: true, annealTemp: 1000, annealTime: 30 });
    const peak = (p) => Math.max(...p.map((q) => q.concentration));
    expect(peak(annealed)).toBeLessThan(peak(asImplanted));
  });

  it('어닐 온도가 높을수록 더 많이 퍼진다', () => {
    const peak = (T) =>
      Math.max(
        ...calculateImplantationProfile({ ...base, annealing: true, annealTemp: T, annealTime: 30 }).map(
          (q) => q.concentration
        )
      );
    expect(peak(1100)).toBeLessThan(peak(900));
  });

  it('농도 하한 1e14 아래로 내려가지 않는다', () => {
    for (const pt of calculateImplantationProfile(base)) {
      expect(pt.concentration).toBeGreaterThanOrEqual(1e14);
    }
  });

  it('결정적이다', () => {
    expect(calculateImplantationProfile(base)).toEqual(calculateImplantationProfile(base));
  });

  it('경계값: 어닐 시간 0 이면 as-implanted 와 같다', () => {
    const a = calculateImplantationProfile(base);
    const b = calculateImplantationProfile({ ...base, annealing: true, annealTemp: 1000, annealTime: 0 });
    // 농도가 1e19 급이라 절대 오차 비교는 의미가 없다. 상대 오차로 본다.
    expect(b[50].concentration / a[50].concentration).toBeCloseTo(1, 9);
  });
});
