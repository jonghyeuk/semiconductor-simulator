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
    // As(Qd=4.08) > B(Qd=3.69) 이지만 D0 도 다르므로 지수항만 비교한다.
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

  it('ΔRp 는 Rp 의 절반이다', () => {
    const { Rp, deltaRp } = calculateImplantParams(100, 'P');
    expect(deltaRp).toBeCloseTo(Rp * 0.5, 12);
  });

  it('결정적이다', () => {
    expect(calculateImplantParams(50, 'As')).toEqual(calculateImplantParams(50, 'As'));
  });
});

describe('calculateImplantParams — 경계값', () => {
  it('에너지 0 이면 Rp 가 하한 1 nm 로 clamp 된다', () => {
    const { Rp } = calculateImplantParams(0, 'B');
    expect(Rp).toBe(1e-3); // 1 nm = 0.001 μm
  });

  it('Rp 하한 clamp 가 걸리면 ΔRp 는 함께 clamp 되지 않는다 (현재 동작)', () => {
    // deltaRp 는 Math.max(Rp, 1) 이전 값으로 계산되므로 clamp 구간에서
    // deltaRp > Rp/2 관계가 깨진다. 에너지 0 근처에서만 발생한다.
    const { Rp, deltaRp } = calculateImplantParams(0, 'B');
    expect(deltaRp).toBe(0);
    expect(Rp).toBe(1e-3);
  });

  it('틸트 0 과 음수 틸트는 같다 (보정 미적용)', () => {
    expect(calculateImplantParams(50, 'B', -10).Rp).toBe(calculateImplantParams(50, 'B', 0).Rp);
  });

  it('틸트 90° 는 물리적으로 말이 안 되는 값으로 발산한다 (가드 없음)', () => {
    // cos(90°) 는 부동소수점상 정확히 0 이 아니라 6.1e-17 이라 Infinity 대신
    // 1e15 μm 급 값이 나온다. 어느 쪽이든 UI 로 흘러가면 그래프가 깨진다.
    const { Rp } = calculateImplantParams(50, 'B', 90);
    expect(Rp).toBeGreaterThan(1e12);
  });
});

describe('calculateImplantParams — 문헌값 대조', () => {
  /*
   * ── 확인된 물리 오류 ②: 이온 질량에 따른 비정 순서가 뒤집혔다 ──
   *
   * 코드: Rp = (m/28.1) · ε^0.8 · 100,  ε ∝ m·E / (Z₁·Z₂·(m+28.1)·(Z₁^0.23+Z₂^0.23))
   *
   * 앞의 (m/28.1) 인자가 질량에 선형으로 커져서, ε^0.8 이 줄어드는 것보다 빠르다.
   * 결과적으로 무거운 이온일수록 **깊게** 박히는 것으로 계산된다.
   *
   * 실제로는 무거운 이온일수록 핵 저지능(nuclear stopping)이 커서 얕게 박힌다.
   * 50 keV 기준 문헌값: B 160 nm > P 62 nm > As 33 nm.
   * 현재 코드:          B  66 nm < P 119 nm < As 184 nm  ← 순서가 정반대.
   *
   * 이걸 고치면 이온주입 탭의 깊이·프로파일 숫자가 전부 바뀌므로 임의로 고치지
   * 않고 it.fails 로 올바른 기댓값만 남긴다.
   */

  it('현재 동작: 무거운 이온일수록 깊게 박힌다 (뒤집힘)', () => {
    const B = calculateImplantParams(50, 'B').Rp;
    const P = calculateImplantParams(50, 'P').Rp;
    const As = calculateImplantParams(50, 'As').Rp;
    expect(B).toBeLessThan(P);
    expect(P).toBeLessThan(As);
  });

  it.fails('같은 에너지에서 무거운 이온일수록 얕게 박혀야 한다', () => {
    // 측정값 (50 keV): B 65.9 nm, P 118.8 nm, As 183.8 nm
    // 문헌값 (50 keV): B 160 nm,  P 62 nm,   As 33 nm
    const B = calculateImplantParams(50, 'B').Rp;
    const P = calculateImplantParams(50, 'P').Rp;
    const As = calculateImplantParams(50, 'As').Rp;
    expect(B).toBeGreaterThan(P);
    expect(P).toBeGreaterThan(As);
  });

  it.fails('B 50 keV 의 Rp 가 문헌값 160 nm 의 ±40% 안에 들어야 한다', () => {
    // 측정값 65.9 nm (문헌 대비 0.41배)
    const Rp = calculateImplantParams(50, 'B').Rp * 1000; // nm
    expect(Math.abs(Rp / 160 - 1)).toBeLessThan(0.4);
  });

  it.fails('As 50 keV 의 Rp 가 문헌값 33 nm 의 ±40% 안에 들어야 한다', () => {
    // 측정값 183.8 nm (문헌 대비 5.57배)
    const Rp = calculateImplantParams(50, 'As').Rp * 1000; // nm
    expect(Math.abs(Rp / 33 - 1)).toBeLessThan(0.4);
  });

  it.fails('ΔRp/Rp 는 이온마다 달라야 한다 (지금은 전부 0.5 고정)', () => {
    // 문헌: B 는 ΔRp/Rp ≈ 0.3, As 는 ≈ 0.25 로 이온·에너지에 따라 다르다.
    const ratios = DOPANTS.map((d) => {
      const { Rp, deltaRp } = calculateImplantParams(100, d);
      return deltaRp / Rp;
    });
    expect(new Set(ratios.map((r) => r.toFixed(4))).size).toBeGreaterThan(1);
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

  /*
   * ── 방어 부족 ──
   * 시간 0 이면 √(Dt)=0 이라 predeposition 은 표면에서 0/0, drive-in 은 전 구간 0/0 이
   * 되어 NaN 이 나온다. "시간 0 이면 확산이 없다" 라는 당연한 성질이 성립하지 않는다.
   * UI 슬라이더 하한이 0 보다 크면 화면에는 안 보이지만, 가드가 없다는 사실을 고정해 둔다.
   */
  it('현재 동작: 시간 0 인 predeposition 은 표면에서 NaN 을 낸다', () => {
    const p = calculateDiffusionProfile({ ...base, currentTime: 0 });
    expect(Number.isNaN(p[0].concentration)).toBe(true);
    // 표면 밖은 0/0 이 아니라 x/0 = Infinity → erfc(∞)=0 → 배경 농도로 떨어진다.
    expect(p[10].concentration).toBe(1e15);
  });

  it('현재 동작: 시간 0 인 drive-in 은 전 구간 NaN 을 낸다', () => {
    const p = calculateDiffusionProfile({ ...base, processType: 'drivein', currentTime: 0 });
    expect(Number.isNaN(p[10].concentration)).toBe(true);
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
    expect(b[50].concentration).toBeCloseTo(a[50].concentration, 6);
  });
});
