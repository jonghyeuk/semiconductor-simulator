import { describe, it, expect } from 'vitest';
import {
  calcLineResistance,
  calcElectromigrationMTTF,
  METAL_RESISTIVITY,
  METAL_EM,
} from '../metallization.js';

const METALS = Object.keys(METAL_RESISTIVITY);

describe('calcLineResistance', () => {
  it('R = ρL/A 를 따른다', () => {
    // Al, 45nm 정사각 단면, 1 μm 길이 → 약 13 Ω
    expect(calcLineResistance('aluminum', 45, 1000)).toBeCloseTo(13.09, 1);
  });

  it('길이에 비례한다', () => {
    const a = calcLineResistance('copper', 45, 1000);
    const b = calcLineResistance('copper', 45, 2000);
    expect(b / a).toBeCloseTo(2, 9);
  });

  it('선폭이 절반이면 저항이 4배다 (단면적 ∝ w²)', () => {
    const wide = calcLineResistance('copper', 90, 1000);
    const narrow = calcLineResistance('copper', 45, 1000);
    expect(narrow / wide).toBeCloseTo(4, 9);
  });

  it('비저항이 낮은 금속일수록 저항이 낮다 (Cu < Al < W < Co)', () => {
    const r = (m) => calcLineResistance(m, 45, 1000);
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

  it('온도가 높을수록 수명이 짧아진다 (Arrhenius)', () => {
    for (const m of METALS) {
      let prev = Infinity;
      for (const T of [323, 373, 423, 473]) {
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
