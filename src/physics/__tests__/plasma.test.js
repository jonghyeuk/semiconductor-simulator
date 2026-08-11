import { describe, it, expect } from 'vitest';
import {
  calculateBasicIonizationDegree,
  calculateBasicPlasmaGenerationProbability,
  calculateBreakdownVoltage,
  getTownsendInfo,
  calculateInputImpedance,
  calculateOptimalLC,
  calculateReflectedPower,
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

  it('경계값: 에너지 −50 이면 0 으로 나눠 무한대가 된다 (가드 없음)', () => {
    expect(Number.isFinite(calculateBasicIonizationDegree(3.0, -50))).toBe(false);
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

  it('희가스(Ar, Ne, He)는 같은 pd 에서 공기보다 낮은 전압에서 방전된다', () => {
    // Penning/준안정 준위 때문에 희가스 절연 파괴 전압이 낮다는 것이 요점.
    expect(calculateBreakdownVoltage(1.0, 1.0, 'argon')).toBeLessThan(
      calculateBreakdownVoltage(1.0, 1.0, 'air')
    );
    expect(calculateBreakdownVoltage(1.0, 1.0, 'neon')).toBeLessThan(
      calculateBreakdownVoltage(1.0, 1.0, 'air')
    );
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
   * ── 확인된 물리 오류 ⑥: 자동 매칭이 50 Ω 이하 부하에서 동작하지 않는다 ──
   *
   * calculateOptimalLC 는 Z_load < 50 일 때 회로를 뒤집어(입력 쪽 병렬 C, 부하 쪽 직렬 L)
   * L·C 를 계산하는데, calculateInputImpedance 는 언제나 한 가지 토폴로지
   * (부하와 병렬인 C + 입력 직렬 L)만 모델링한다. 두 함수가 서로 다른 회로를 가정한다.
   *
   * 그래서 "자동 매칭" 버튼을 누른 뒤 표시되는 입력 임피던스가 50 Ω 에서 크게 벗어난다:
   *   Z_load = 10 Ω → Z_in 18.7 Ω (−63%)
   *   Z_load = 25 Ω → Z_in 25.0 Ω (−50%)
   *   Z_load = 40 Ω → Z_in 35.1 Ω (−30%)
   *
   * 슬라이더 범위가 10~200 Ω 이므로 절반 구간이 여기 해당한다.
   * 실제 플라즈마 부하는 대개 50 Ω 이하라 학습상 중요한 구간이기도 하다.
   */
  it('현재 동작: 50 Ω 이하 부하에서는 자동 매칭 후에도 50 Ω 에 못 맞춘다', () => {
    for (const Zload of [10, 25, 40]) {
      const { L, C } = calculateOptimalLC(13.56, Zload);
      const Zin = calculateInputImpedance(13.56, Number(L), Number(C), Zload);
      expect(Math.abs(Zin / 50 - 1)).toBeGreaterThan(0.25);
    }
  });

  it.fails('슬라이더 전 범위(10~200 Ω)에서 자동 매칭이 50 Ω 으로 수렴해야 한다', () => {
    // 측정값: 10 Ω → 18.7 Ω, 25 Ω → 25.0 Ω, 40 Ω → 35.1 Ω, 50 Ω → NaN
    for (let Zload = 10; Zload <= 200; Zload += 10) {
      const { L, C } = calculateOptimalLC(13.56, Zload);
      const Zin = calculateInputImpedance(13.56, Number(L), Number(C), Zload);
      expect(Math.abs(Zin / 50 - 1)).toBeLessThan(0.05);
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

  it('경계값: C = 0 이면 XC 가 무한대라 NaN 이 된다 (가드 없음)', () => {
    expect(Number.isNaN(calculateInputImpedance(13.56, 100, 0, 50))).toBe(true);
  });

  /*
   * 슬라이더 기본값이 정확히 50 Ω 이라, 화면에 처음 들어와서 "자동 매칭" 을 누르면
   * 바로 이 경로를 탄다: Q = √(50/50 − 1) = 0 → L = 0 nH, C = 0 pF 가 설정되고,
   * C = 0 이면 X_C = 1/0 = ∞ 라 입력 임피던스가 NaN 으로 표시된다.
   */
  it('경계값: 부하가 정확히 50 Ω 이면 자동 매칭이 L = C = 0 을 내놓는다', () => {
    const { L, C } = calculateOptimalLC(13.56, 50);
    expect(Number(L)).toBe(0);
    expect(Number(C)).toBe(0);
  });

  it('경계값: 그 L = C = 0 을 되먹이면 입력 임피던스가 NaN 이 된다', () => {
    const { L, C } = calculateOptimalLC(13.56, 50);
    expect(Number.isNaN(calculateInputImpedance(13.56, Number(L), Number(C), 50))).toBe(true);
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

  it('현재 동작: Z_in = 150 Ω 에서 입력의 4배가 반사된다', () => {
    expect(calculateReflectedPower(150, 1000)).toBeCloseTo(4000, 6);
  });

  it.fails('반사 전력은 절대로 입력 전력을 넘을 수 없다', () => {
    // 측정값: Z=100 → 1000 W, Z=150 → 4000 W, Z=200 → 9000 W (입력 1000 W)
    for (const Z of [75, 100, 150, 200, 300]) {
      expect(calculateReflectedPower(Z, 1000)).toBeLessThanOrEqual(1000);
    }
  });

  it.fails('반사계수 Γ = (Z−Z₀)/(Z+Z₀) 정의를 따라야 한다', () => {
    // 측정값 (Z=150, P=1000): 4000 W / 이론값 250 W
    for (const Z of [75, 100, 150, 200, 300]) {
      expect(calculateReflectedPower(Z, 1000)).toBeCloseTo(correct(Z, 1000), 6);
    }
  });
});
