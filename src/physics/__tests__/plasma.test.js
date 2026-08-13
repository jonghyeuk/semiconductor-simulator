import { describe, it, expect } from 'vitest';
import {
  calculateBasicIonizationDegree,
  calculateBasicPlasmaGenerationProbability,
  calculateBreakdownVoltage,
  getTownsendInfo,
  calculateInputImpedance,
  calculateOptimalLC,
  calculateReflectedPower,
  calculateVSWR,
  calculateInputImpedanceComplex,
  PASCHEN_TABLE,
  PASCHEN_MINIMA,
} from '../plasma.js';

const GASES = Object.keys(PASCHEN_TABLE);

describe('이온화도 / 생성 확률', () => {
  it('생성 확률은 0~100% 범위 안이다', () => {
    for (let p = 0.1; p <= 10; p += 0.1) {
      for (const E of [10, 50, 100, 500, 5000]) {
        const prob = calculateBasicPlasmaGenerationProbability(p, E);
        expect(prob).toBeGreaterThanOrEqual(0);
        expect(prob).toBeLessThanOrEqual(100);
      }
    }
  });

  it('에너지가 높을수록 이온화가 잘 된다 (단조 증가, 포화)', () => {
    let prev = -Infinity;
    for (const E of [10, 50, 100, 200, 500]) {
      const v = calculateBasicIonizationDegree(3.0, E);
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
    // 포화: 에너지를 100배 해도 상한 0.0018 을 못 넘는다
    expect(calculateBasicIonizationDegree(3.0, 1e6)).toBeLessThan(0.0018);
  });

  it('최적 압력 3.0 Torr 에서 최대이고 양쪽으로 감소한다', () => {
    const peak = calculateBasicIonizationDegree(3.0, 100);
    expect(calculateBasicIonizationDegree(1.0, 100)).toBeLessThan(peak);
    expect(calculateBasicIonizationDegree(5.0, 100)).toBeLessThan(peak);
  });

  it('이온화도는 확률과 같은 형태이고 비율이 일정하다', () => {
    for (const p of [1, 3, 7]) {
      const ratio = calculateBasicIonizationDegree(p, 100) / calculateBasicPlasmaGenerationProbability(p, 100);
      expect(ratio).toBeCloseTo(0.0018 / 100, 12);
    }
  });

  it('결정적이다', () => {
    expect(calculateBasicIonizationDegree(3, 100)).toBe(calculateBasicIonizationDegree(3, 100));
  });

  it('경계값: 에너지 0 이면 이온화도 0', () => {
    expect(calculateBasicIonizationDegree(3.0, 0)).toBe(0);
  });

  it('경계값: 음수 에너지에서는 이온화가 없다 (발산하지 않는다)', () => {
    for (const E of [-1000, -50, -1, 0]) {
      expect(calculateBasicIonizationDegree(3.0, E)).toBe(0);
      expect(calculateBasicPlasmaGenerationProbability(3.0, E)).toBe(0);
    }
  });
});

describe('calculateBreakdownVoltage (Paschen)', () => {
  it('모든 가스에서 pd 최소점 근처가 실제 최소 전압이다', () => {
    for (const gas of GASES) {
      const min = PASCHEN_MINIMA[gas];
      const atMin = calculateBreakdownVoltage(min.pd, 1.0, gas);
      expect(atMin).toBe(min.voltage);
      for (const pd of [0.2, 0.5, 2.0, 5.0, 20, 50]) {
        expect(calculateBreakdownVoltage(pd, 1.0, gas)).toBeGreaterThanOrEqual(atMin);
      }
    }
  });

  it('최소점 왼쪽에서는 pd 가 줄수록 전압이 급등한다', () => {
    let prev = -Infinity;
    for (const pd of [0.9, 0.7, 0.5, 0.3, 0.1]) {
      const v = calculateBreakdownVoltage(pd, 1.0, 'argon');
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it('최소점 오른쪽에서는 pd 가 늘수록 전압이 올라간다', () => {
    let prev = -Infinity;
    for (const pd of [1.0, 2.0, 5.0, 10, 20, 50, 100]) {
      const v = calculateBreakdownVoltage(pd, 1.0, 'argon');
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it('희가스(Ar, He, Ne)의 파셴 최소 전압이 공기보다 낮다', () => {
    // 준안정 준위 때문에 희가스 절연 파괴 전압이 낮다는 것이 요점.
    //
    // 예전 테스트는 이것을 "같은 pd 에서 항상 공기보다 낮다" 로 적었는데 그건 과장이다.
    // 최소점 위치가 가스마다 달라서, 자기 최소점보다 한참 왼쪽에 있는 pd 에서는
    // 희가스가 오히려 더 높다 (네온 최소점은 pd=3 이라 pd=1 에서는 왼쪽 가지다).
    // 비교가 성립하는 건 각 가스의 최소점끼리다.
    for (const gas of ['argon', 'helium', 'neon']) {
      expect(PASCHEN_MINIMA[gas].voltage).toBeLessThan(PASCHEN_MINIMA.air.voltage);
    }
  });

  it('헬륨은 이온화 에너지가 가장 높지만 파셴 최소값은 공기·질소보다 낮다', () => {
    // 항복전압이 이온화 에너지에 단순 비례한다는 오해를 막는 앵커.
    // 예전 표는 헬륨을 400V 로 가장 높게 두어 정확히 그 오해를 가르쳤다.
    expect(PASCHEN_MINIMA.helium.voltage).toBeLessThan(PASCHEN_MINIMA.air.voltage);
    expect(PASCHEN_MINIMA.helium.voltage).toBeLessThan(PASCHEN_MINIMA.nitrogen.voltage);
  });

  it('최소점 위치(pd)가 가스마다 다르다 — 전부 같은 pd 면 곡선족이 틀린 것', () => {
    const pds = Object.values(PASCHEN_MINIMA).map((m) => m.pd);
    expect(new Set(pds).size).toBeGreaterThan(1);
    // 헬륨·네온은 공기·질소보다 최소점이 뚜렷하게 오른쪽에 있다.
    expect(PASCHEN_MINIMA.helium.pd).toBeGreaterThan(PASCHEN_MINIMA.air.pd);
    expect(PASCHEN_MINIMA.neon.pd).toBeGreaterThan(PASCHEN_MINIMA.nitrogen.pd);
  });

  it('압력과 간격의 곱(pd)만으로 결정된다 — Paschen 법칙', () => {
    // p=2, d=0.5 와 p=0.5, d=2 는 같은 pd=1 이므로 같은 전압이어야 한다.
    expect(calculateBreakdownVoltage(2, 0.5, 'argon')).toBe(calculateBreakdownVoltage(0.5, 2, 'argon'));
  });

  it('결정적이다', () => {
    expect(calculateBreakdownVoltage(1.5, 1.0, 'argon')).toBe(calculateBreakdownVoltage(1.5, 1.0, 'argon'));
  });

  it('경계값: 표 범위(0.1~100 Torr·cm) 밖은 null 을 낸다', () => {
    expect(calculateBreakdownVoltage(0.05, 1.0, 'argon')).toBeNull();
    expect(calculateBreakdownVoltage(200, 1.0, 'argon')).toBeNull();
  });

  it('경계값: 알 수 없는 가스는 argon 으로 대체된다', () => {
    expect(calculateBreakdownVoltage(1.0, 1.0, 'xenon')).toBe(calculateBreakdownVoltage(1.0, 1.0, 'argon'));
  });
});

describe('getTownsendInfo', () => {
  it('최적 구간(0.7~1.5)에서만 "최적" 판정이 나온다', () => {
    expect(getTownsendInfo(1.0).efficiency).toBe('최적');
    expect(getTownsendInfo(0.3).efficiency).toBe('부족');
    expect(getTownsendInfo(5.0).efficiency).toBe('과다');
  });

  it('pd 가 아주 커지면 전리계수가 0 으로 수렴한다', () => {
    expect(getTownsendInfo(100).alpha).toBeLessThan(getTownsendInfo(10).alpha);
    expect(getTownsendInfo(100).alpha).toBeGreaterThan(0);
  });

  it('경계값: pd = 0 이면 alpha = 0', () => {
    expect(getTownsendInfo(0).alpha).toBe(0);
  });
});

describe('RF 매칭', () => {
  it('부하가 50 Ω 보다 클 때는 자동 매칭이 50 Ω 으로 수렴한다', () => {
    for (const Zload of [60, 75, 100, 150, 200]) {
      const { L, C } = calculateOptimalLC(13.56, Zload);
      const Zin = calculateInputImpedance(13.56, Number(L), Number(C), Zload);
      // L, C 를 정수 nH/pF 로 반올림하므로 오차를 5% 허용한다.
      expect(Math.abs(Zin / 50 - 1)).toBeLessThan(0.05);
    }
  });

  /*
   * 매칭망 토폴로지는 부하에 따라 달라진다:
   *   승압 (R_L > 50): 부하와 병렬인 C + 입력 직렬 L
   *   강압 (R_L < 50): 부하 직렬 L + 입력 병렬 C
   * 예전에는 calculateInputImpedance 가 승압 하나만 모델링해서, 강압 구간에서는
   * calculateOptimalLC 가 준 L·C 를 넣어도 50 Ω 이 되지 않았다.
   */
  it('슬라이더 전 범위(10~200 Ω)에서 자동 매칭이 50 Ω 으로 수렴한다', () => {
    for (let Zload = 10; Zload <= 200; Zload += 10) {
      const { L, C } = calculateOptimalLC(13.56, Zload);
      const Zin = calculateInputImpedance(13.56, Number(L), Number(C), Zload);
      expect(Math.abs(Zin / 50 - 1)).toBeLessThan(0.05);
    }
  });

  it('자동 매칭 후 반사 전력이 입력의 1% 미만이다', () => {
    for (let Zload = 10; Zload <= 200; Zload += 10) {
      const { L, C } = calculateOptimalLC(13.56, Zload);
      const z = calculateInputImpedanceComplex(13.56, Number(L), Number(C), Zload);
      expect(calculateReflectedPower(z, 1000)).toBeLessThan(10);
    }
  });

  it('자동 매칭 후 VSWR 이 1.2 미만이다', () => {
    for (let Zload = 10; Zload <= 200; Zload += 10) {
      const { L, C } = calculateOptimalLC(13.56, Zload);
      const z = calculateInputImpedanceComplex(13.56, Number(L), Number(C), Zload);
      expect(calculateVSWR(z)).toBeLessThan(1.2);
    }
  });

  it('입력 임피던스는 항상 0 이상이고 유한하다', () => {
    for (const f of [2, 13.56, 27.12, 60]) {
      for (const L of [10, 100, 500]) {
        for (const C of [10, 100, 500]) {
          for (const Z of [10, 50, 200]) {
            const Zin = calculateInputImpedance(f, L, C, Z);
            expect(Zin).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(Zin)).toBe(true);
          }
        }
      }
    }
  });

  it('결정적이다', () => {
    expect(calculateInputImpedance(13.56, 100, 100, 50)).toBe(calculateInputImpedance(13.56, 100, 100, 50));
  });

  it('경계값: C = 0 은 개방으로 취급되어 NaN 이 안 나온다', () => {
    const z = calculateInputImpedance(13.56, 100, 0, 50);
    expect(Number.isFinite(z)).toBe(true);
    expect(z).toBeGreaterThan(0);
  });

  /*
   * 슬라이더 기본값이 정확히 50 Ω 이다. 이때는 정합망 자체가 필요 없다 (Q = 0).
   * 예전에는 여기서 L = C = 0 이 설정되고 C = 0 이 입력 임피던스를 NaN 으로 만들어,
   * 화면에 들어와 "자동 매칭" 만 눌러도 바로 NaN 이 떴다.
   */
  it('경계값: 부하가 정확히 50 Ω 이면 정합망이 불필요하다고 알려 준다', () => {
    const { L, C, type } = calculateOptimalLC(13.56, 50);
    expect(Number(L)).toBe(0);
    expect(Number(C)).toBe(0);
    expect(type).toContain('불필요');
  });

  it('경계값: 부하 50 Ω 에서 입력 임피던스가 그대로 50 Ω 이다 (NaN 아님)', () => {
    const { L, C } = calculateOptimalLC(13.56, 50);
    expect(calculateInputImpedance(13.56, Number(L), Number(C), 50)).toBeCloseTo(50, 9);
    expect(calculateReflectedPower(calculateInputImpedanceComplex(13.56, 0, 0, 50), 1000)).toBeCloseTo(0, 9);
  });
});

describe('calculateReflectedPower — 에너지 보존', () => {
  /*
   * ── 확인된 물리 오류 ⑤: 반사 전력이 입력 전력을 넘는다 ──
   *
   * 코드: mismatch = |Z_in − 50| / 50,  P_refl = P_in · mismatch²
   *
   * 반사계수는 Γ = (Z − Z₀)/(Z + Z₀) 이고 |Γ| ≤ 1 이므로 P_refl = P_in·|Γ|² ≤ P_in 이다.
   * 분모를 Z₀(=50) 으로 쓰면 |Z − 50| 이 50 을 넘는 순간 mismatch > 1 이 되어
   * **반사 전력이 입력 전력보다 커진다** — 에너지 보존 위반이다.
   *
   * 예: Z_in = 150 Ω, P_in = 1000 W
   *   현재 코드 → 4000 W 반사 (입력의 4배)
   *   올바른 값 → 250 W 반사 (Γ = 0.5)
   *
   * Z_in = 100 Ω 이면 정확히 입력 전력 전부가 반사된 것으로 나오고, 그 위로는 계속 커진다.
   * RF 매칭 탭에서 매칭을 일부러 틀어 보는 학습 동작에서 바로 드러난다.
   *
   * 계산식을 고치면 화면의 반사 전력·정재파비 표시가 전부 바뀌므로 임의로 고치지 않고
   * it.fails 로 올바른 기댓값만 남긴다.
   */

  /** 올바른 반사 전력: Γ = (Z − Z₀)/(Z + Z₀) */
  const correct = (Z, P) => P * Math.pow(Math.abs(Z - 50) / (Z + 50), 2);

  it('정합되면(50 Ω) 반사가 0 이다', () => {
    expect(calculateReflectedPower(50, 1000)).toBe(0);
  });

  it('부정합이 커질수록 반사 전력이 커진다 (단조 증가)', () => {
    let prev = -Infinity;
    for (const Z of [50, 60, 75, 100, 150, 200]) {
      const r = calculateReflectedPower(Z, 1000);
      expect(r).toBeGreaterThan(prev);
      prev = r;
    }
  });

  it('입력 전력에 비례한다', () => {
    expect(calculateReflectedPower(100, 2000)).toBeCloseTo(2 * calculateReflectedPower(100, 1000), 9);
  });

  it('반사 전력은 절대로 입력 전력을 넘지 않는다', () => {
    for (const Z of [0, 1, 75, 100, 150, 200, 300, 1000, 1e6]) {
      expect(calculateReflectedPower(Z, 1000)).toBeLessThanOrEqual(1000);
    }
  });

  it('반사계수 Γ = (Z−Z₀)/(Z+Z₀) 정의를 따른다', () => {
    for (const Z of [10, 75, 100, 150, 200, 300]) {
      expect(calculateReflectedPower(Z, 1000)).toBeCloseTo(correct(Z, 1000), 9);
    }
  });

  it('완전 반사(개방/단락)에서 입력 전력 전부가 반사된다', () => {
    expect(calculateReflectedPower(0, 1000)).toBeCloseTo(1000, 6);
    expect(calculateReflectedPower(1e12, 1000)).toBeCloseTo(1000, 0);
  });

  it('VSWR 은 정합에서 1 이고 부정합이 커질수록 증가한다', () => {
    expect(calculateVSWR(50)).toBeCloseTo(1, 9);
    let prev = 0;
    for (const Z of [50, 75, 100, 150, 200]) {
      const v = calculateVSWR(Z);
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
    // Z = 2·Z₀ 면 VSWR = 2
    expect(calculateVSWR(100)).toBeCloseTo(2, 9);
  });

  it('VSWR 은 완전 반사에서 무한대다', () => {
    expect(calculateVSWR(0)).toBe(Infinity);
  });
});
