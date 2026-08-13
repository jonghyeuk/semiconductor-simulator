import { describe, it, expect } from 'vitest';
import {
  calcLineResistance,
  calcElectromigrationMTTF,
  METAL_RESISTIVITY,
  METAL_EM,
  EM_VALID_TEMP_RANGE_K,
} from '../metallization.js';

const METALS = Object.keys(METAL_RESISTIVITY);

describe('calcLineResistance', () => {
  it('R = ρ_eff·L/A 를 따른다 (크기효과 포함)', () => {
    // Al, 45nm 정사각 단면, 1 μm 길이.
    // 벌크만 보면 13.09 Ω 이지만 크기효과 배율 (1 + 19/45) = 1.422 가 곱해진다.
    // 손계산: 2.65e-8 Ω·m × 1e-6 m / (45e-9 m)² × (1 + 19/45) = 18.62 Ω
    expect(calcLineResistance('aluminum', 45, 1000)).toBeCloseTo(18.62, 1);
  });

  it('길이에 비례한다', () => {
    const a = calcLineResistance('copper', 45, 1000);
    const b = calcLineResistance('copper', 45, 2000);
    expect(b / a).toBeCloseTo(2, 9);
  });

  it('선폭이 절반이면 저항이 4배보다 더 커진다 (단면적 ∝ w² + 크기효과)', () => {
    // 단면적만 보면 정확히 4배지만, 좁아질수록 유효 비저항도 올라가므로 더 커진다.
    const wide = calcLineResistance('copper', 90, 1000);
    const narrow = calcLineResistance('copper', 45, 1000);
    expect(narrow / wide).toBeGreaterThan(4);
    expect(narrow / wide).toBeLessThan(6);
  });

  it('넉넉한 선폭에서는 비저항 순서대로 저항이 낮다 (Cu < Al < W < Co)', () => {
    const r = (m) => calcLineResistance(m, 90, 1000);
    expect(r('copper')).toBeLessThan(r('aluminum'));
    expect(r('aluminum')).toBeLessThan(r('tungsten'));
    expect(r('tungsten')).toBeLessThan(r('cobalt'));
  });

  it('구리 비저항이 문헌값 1.68 μΩ·cm 다', () => {
    expect(METAL_RESISTIVITY.copper).toBeCloseTo(1.68, 6);
  });

  it('결정적이다', () => {
    expect(calcLineResistance('copper', 45, 1000)).toBe(calcLineResistance('copper', 45, 1000));
  });

  it('경계값: 선폭·길이 0 이하이거나 모르는 금속이면 0', () => {
    expect(calcLineResistance('copper', 0, 1000)).toBe(0);
    expect(calcLineResistance('copper', 45, 0)).toBe(0);
    expect(calcLineResistance('copper', -45, 1000)).toBe(0);
    expect(calcLineResistance('gold', 45, 1000)).toBe(0);
  });
});

describe('calcElectromigrationMTTF — Black 식', () => {
  it('전류밀도 2배면 수명이 1/4 이다 (J⁻²)', () => {
    for (const m of METALS) {
      const a = calcElectromigrationMTTF(m, 1);
      const b = calcElectromigrationMTTF(m, 2);
      expect(a / b).toBeCloseTo(4, 9);
    }
  });

  it('온도가 높을수록 수명이 짧아진다 (Arrhenius, 유효 범위 안)', () => {
    for (const m of METALS) {
      let prev = Infinity;
      for (const T of [300, 323, 373, 398]) {
        const v = calcElectromigrationMTTF(m, 1, T);
        expect(v).toBeLessThan(prev);
        prev = v;
      }
    }
  });

  it('기준 조건(1 MA/cm², 100°C)에서 기준 수명이 그대로 나온다', () => {
    for (const m of METALS) {
      expect(calcElectromigrationMTTF(m, 1, 373.15)).toBeCloseTo(METAL_EM[m].referenceMttfYears, 6);
    }
  });

  /*
   * 예전에는 Ea = (copper ? 0.9 : 0.7) 이라 W 와 Co 가 Al 의 활성화 에너지를 받았다.
   * 시뮬레이터 자체 표는 W 를 "Very High" 내성으로 적어 두고, 계산은 Cu 를 W 보다
   * 168배 좋게 내놓는 모순이 있었다.
   */
  it('내화금속일수록 활성화 에너지가 크다 (W > Co > Cu > Al)', () => {
    expect(METAL_EM.tungsten.ea).toBeGreaterThan(METAL_EM.cobalt.ea);
    expect(METAL_EM.cobalt.ea).toBeGreaterThan(METAL_EM.copper.ea);
    expect(METAL_EM.copper.ea).toBeGreaterThan(METAL_EM.aluminum.ea);
  });

  it('EM 수명 순서가 시뮬레이터의 EM 내성 등급과 일치한다 (W > Co > Cu > Al)', () => {
    const life = (m) => calcElectromigrationMTTF(m, 1);
    expect(life('tungsten')).toBeGreaterThan(life('cobalt'));
    expect(life('cobalt')).toBeGreaterThan(life('copper'));
    expect(life('copper')).toBeGreaterThan(life('aluminum'));
  });

  it('Cu 가 Al 보다 좋되 자릿수가 벌어지지는 않는다 (실제 10~100배)', () => {
    const ratio = calcElectromigrationMTTF('copper', 1) / calcElectromigrationMTTF('aluminum', 1);
    expect(ratio).toBeGreaterThan(2);
    expect(ratio).toBeLessThan(100);
  });

  it('UI 슬라이더 전 범위(0.5~3 MA/cm²)에서 수명이 교육적으로 말이 되는 범위다', () => {
    // 수백만 년 같은 값이 나오면 안 된다 (예전 Cu 는 145만 년이었다).
    for (const m of METALS) {
      for (let j = 0.5; j <= 3.001; j += 0.1) {
        const years = calcElectromigrationMTTF(m, j);
        expect(years).toBeGreaterThan(0.1);
        expect(years).toBeLessThan(1000);
      }
    }
  });

  it('결정적이다', () => {
    expect(calcElectromigrationMTTF('copper', 1.5)).toBe(calcElectromigrationMTTF('copper', 1.5));
  });

  it('경계값: 전류가 0 이면 EM 이 일어나지 않는다', () => {
    expect(calcElectromigrationMTTF('copper', 0)).toBe(Infinity);
    expect(calcElectromigrationMTTF('copper', -1)).toBe(Infinity);
  });

  it('경계값: 모르는 금속은 0', () => {
    expect(calcElectromigrationMTTF('gold', 1)).toBe(0);
  });
});

/*
 * 문헌 앵커. 기존 테스트는 Cu 비저항 하나만 리터럴로 박혀 있었고, Al·W·Co 값은
 * 어떤 테스트도 확인하지 않았다. 실제로 W 5.6 → 56, Co 6.24 → 62.4 로 10배씩
 * 망가뜨려도 전체 테스트가 통과하는 것을 확인했다.
 */
describe('metallization — 문헌 앵커', () => {
  it('벌크 비저항 4종이 문헌값이다 (µΩ·cm)', () => {
    expect(METAL_RESISTIVITY.copper).toBeCloseTo(1.68, 2);
    expect(METAL_RESISTIVITY.aluminum).toBeCloseTo(2.65, 2);
    expect(METAL_RESISTIVITY.tungsten).toBeCloseTo(5.6, 1);
    expect(METAL_RESISTIVITY.cobalt).toBeCloseTo(6.24, 2);
  });

  it('비저항 순서가 Cu < Al < W < Co 다', () => {
    expect(METAL_RESISTIVITY.copper).toBeLessThan(METAL_RESISTIVITY.aluminum);
    expect(METAL_RESISTIVITY.aluminum).toBeLessThan(METAL_RESISTIVITY.tungsten);
    expect(METAL_RESISTIVITY.tungsten).toBeLessThan(METAL_RESISTIVITY.cobalt);
  });

  it('EM 내성 순서가 온도와 무관하게 W > Co > Cu > Al 이다', () => {
    // 예전에는 약 130°C 를 넘으면 Cu > Co > W 로 뒤집혔고 200°C 에서는
    // Cu > Al > Co > W 까지 갔다. 시뮬레이터 자체 표(W = Very High)와 정반대다.
    // EM 가속시험이 250~350°C 에서 이뤄지므로 그 범위까지 확인한다.
    for (const T of [298, 323, 373, 398, 473, 573, 623]) {
      const y = (m) => calcElectromigrationMTTF(m, 1, T);
      expect(y('tungsten')).toBeGreaterThan(y('cobalt'));
      expect(y('cobalt')).toBeGreaterThan(y('copper'));
      expect(y('copper')).toBeGreaterThan(y('aluminum'));
    }
  });

  it('활성화 에너지 순서가 Al < Cu < Co < W 다', () => {
    expect(METAL_EM.aluminum.ea).toBeLessThan(METAL_EM.copper.ea);
    expect(METAL_EM.copper.ea).toBeLessThan(METAL_EM.cobalt.ea);
    expect(METAL_EM.cobalt.ea).toBeLessThan(METAL_EM.tungsten.ea);
  });

  it('유효 온도 범위 밖에서는 경계값으로 묶인다', () => {
    const [tMin, tMax] = EM_VALID_TEMP_RANGE_K;
    expect(calcElectromigrationMTTF('copper', 1, tMax + 200)).toBe(
      calcElectromigrationMTTF('copper', 1, tMax)
    );
    expect(calcElectromigrationMTTF('copper', 1, tMin - 50)).toBe(
      calcElectromigrationMTTF('copper', 1, tMin)
    );
  });

  it('나노스케일 크기효과가 들어 있다', () => {
    // 예전에는 벌크 비저항만 써서 선폭 10 nm 에서도 Cu 가 항상 유리하게 나왔고,
    // 같은 화면이 가르치는 "7 nm 이하에서 Cu 저항 증가가 심각하다" 가
    // 슬라이더로 재현되지 않았다.
    //
    // (a) 좁아질수록 벌크 대비 배율이 커진다
    const bulkR = (m, w) => (METAL_RESISTIVITY[m] * 1e-8 * 1e-6) / Math.pow(w * 1e-9, 2);
    let prev = 1;
    for (const w of [180, 90, 45, 20, 10]) {
      const factor = calcLineResistance('copper', w, 1000) / bulkR('copper', w);
      expect(factor).toBeGreaterThan(prev);
      prev = factor;
    }
    // (b) 평균자유행로가 긴 Cu 가 미세화에서 더 크게 손해본다
    const penalty = (m, w) => calcLineResistance(m, w, 1000) / bulkR(m, w);
    expect(penalty('copper', 10)).toBeGreaterThan(penalty('cobalt', 10));
    // (c) 그래서 10 nm 에서는 Cu 가 Al 을 역전당한다
    expect(calcLineResistance('copper', 10, 1000)).toBeGreaterThan(
      calcLineResistance('aluminum', 10, 1000)
    );
    // 넉넉한 선폭에서는 여전히 Cu 가 가장 낮다
    expect(calcLineResistance('copper', 180, 1000)).toBeLessThan(
      calcLineResistance('aluminum', 180, 1000)
    );
  });
});
