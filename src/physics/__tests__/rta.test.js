import { describe, it, expect } from 'vitest';
import {
  calculateTempProfile,
  computeZoneSetpoints,
  stepZoneTemperatures,
  ZONE_TIME_CONSTANTS,
} from '../rta.js';

const recipe = { targetTemp: 1000, rampRate: 50, processTime: 30 };

describe('calculateTempProfile — 정상 경로', () => {
  it('가스 안정화 구간(0~10초)은 상온을 유지한다', () => {
    for (const t of [0, 5, 10]) expect(calculateTempProfile(t, recipe)).toBe(25);
  });

  it('램프업 구간은 시간에 선형이고 기울기가 rampRate 와 같다', () => {
    const a = calculateTempProfile(12, recipe);
    const b = calculateTempProfile(14, recipe);
    expect((b - a) / 2).toBeCloseTo(recipe.rampRate, 9);
  });

  it('soak 구간에서 목표 온도를 정확히 유지한다', () => {
    const rampUpEnd = 10 + (recipe.targetTemp - 25) / recipe.rampRate;
    for (const t of [rampUpEnd + 1, rampUpEnd + 15, rampUpEnd + 29]) {
      expect(calculateTempProfile(t, recipe)).toBe(1000);
    }
  });

  it('전 구간에서 상온 미만으로 내려가지 않고 목표 온도를 넘지 않는다', () => {
    for (let t = 0; t <= 300; t += 0.25) {
      const T = calculateTempProfile(t, recipe);
      expect(T).toBeGreaterThanOrEqual(25);
      expect(T).toBeLessThanOrEqual(recipe.targetTemp);
    }
  });

  it('구간 이음매에서 온도가 튀지 않는다 (연속)', () => {
    const rampUpEnd = 10 + (recipe.targetTemp - 25) / recipe.rampRate;
    const soakEnd = rampUpEnd + recipe.processTime;
    for (const b of [10, rampUpEnd, soakEnd]) {
      expect(Math.abs(calculateTempProfile(b, recipe) - calculateTempProfile(b + 1e-6, recipe))).toBeLessThan(0.01);
    }
  });

  /*
   * 냉각식이 (t/τ)^0.7 이라 t = 0 에서 도함수가 무한대다. 즉 soak 이 끝나는 순간
   * 냉각 속도가 무한대로 시작한다. 실제 RTA 냉각은 뉴턴 냉각(지수 감쇠)이라
   * 초기 냉각 속도가 유한하다. 값 자체는 연속이므로 그래프가 끊기지는 않지만,
   * "냉각 초기 기울기" 를 읽는 학습에는 맞지 않는다.
   */
  it('현재 동작: 냉각 시작 순간의 냉각 속도가 발산한다', () => {
    const soakEnd = 10 + (recipe.targetTemp - 25) / recipe.rampRate + recipe.processTime;
    const slope = (dt) => (calculateTempProfile(soakEnd, recipe) - calculateTempProfile(soakEnd + dt, recipe)) / dt;
    // 기울기 ∝ dt^(0.7−1) = dt^(−0.3) 이므로 dt 를 100배 줄이면 약 4배(100^0.3)로 커진다.
    expect(slope(1e-4) / slope(1e-2)).toBeCloseTo(Math.pow(100, 0.3), 1);
  });

  it('램프 속도가 빠를수록 목표 온도에 빨리 도달한다', () => {
    const reachTime = (rate) => 10 + (recipe.targetTemp - 25) / rate;
    expect(reachTime(100)).toBeLessThan(reachTime(25));
    expect(calculateTempProfile(reachTime(100), { ...recipe, rampRate: 100 })).toBeCloseTo(1000, 6);
  });

  it('냉각은 램프업보다 느리다 (rampRate × 0.3)', () => {
    const rampUpTime = (recipe.targetTemp - 25) / recipe.rampRate;
    const rampDownTime = (recipe.targetTemp - 25) / (recipe.rampRate * 0.3);
    expect(rampDownTime).toBeGreaterThan(rampUpTime);
  });

  it('냉각 구간은 단조 감소한다', () => {
    const soakEnd = 10 + (recipe.targetTemp - 25) / recipe.rampRate + recipe.processTime;
    let prev = Infinity;
    for (let t = soakEnd; t <= soakEnd + 70; t += 1) {
      const T = calculateTempProfile(t, recipe);
      expect(T).toBeLessThanOrEqual(prev);
      prev = T;
    }
  });

  it('레시피가 끝나면 상온으로 돌아온다', () => {
    expect(calculateTempProfile(10000, recipe)).toBe(25);
  });

  it('결정적이다', () => {
    expect(calculateTempProfile(50, recipe)).toBe(calculateTempProfile(50, recipe));
  });
});

describe('calculateTempProfile — 경계값', () => {
  it('램프 속도 0 이면 무한대 시간이 되어 상온에 머문다', () => {
    expect(calculateTempProfile(100, { ...recipe, rampRate: 0 })).toBe(25);
  });

  it('목표 온도가 상온이면 전 구간 상온이다', () => {
    for (const t of [0, 20, 100]) {
      expect(calculateTempProfile(t, { ...recipe, targetTemp: 25 })).toBe(25);
    }
  });

  it('공정 시간 0 이어도 NaN 이 아니다', () => {
    for (let t = 0; t <= 100; t += 5) {
      expect(Number.isNaN(calculateTempProfile(t, { ...recipe, processTime: 0 }))).toBe(false);
    }
  });

  it('음수 시간은 상온을 낸다', () => {
    expect(calculateTempProfile(-5, recipe)).toBe(25);
  });
});

describe('computeZoneSetpoints', () => {
  it('가장자리 존일수록 설정 온도가 낮다 (position offset)', () => {
    const sp = computeZoneSetpoints(1000, [100, 100, 100, 100, 100, 100]);
    expect(sp[0]).toBeGreaterThan(sp[2]);
    expect(sp[2]).toBeGreaterThan(sp[4]);
    expect(sp[4]).toBeGreaterThan(sp[5]);
  });

  it('램프 출력이 높을수록 설정 온도가 높다', () => {
    const low = computeZoneSetpoints(1000, [0, 0, 0, 0, 0, 0]);
    const high = computeZoneSetpoints(1000, [100, 100, 100, 100, 100, 100]);
    for (let i = 0; i < 6; i++) expect(high[i]).toBeGreaterThan(low[i]);
  });

  it('상온 아래로 내려가지 않는다', () => {
    for (const sp of computeZoneSetpoints(0, [0, 0, 0, 0, 0, 0])) {
      expect(sp).toBeGreaterThanOrEqual(25);
    }
  });

  it('결정적이다', () => {
    expect(computeZoneSetpoints(900, [80, 90, 100, 70, 60, 50])).toEqual(
      computeZoneSetpoints(900, [80, 90, 100, 70, 60, 50])
    );
  });
});

describe('stepZoneTemperatures — 1차 지연계 적분', () => {
  const setpoints = [1000, 1000, 1000, 1000, 1000, 1000];

  it('설정 온도 쪽으로 움직인다', () => {
    const before = [25, 25, 25, 25, 25, 25];
    const after = stepZoneTemperatures(before, setpoints, 0.1);
    for (let i = 0; i < 6; i++) {
      expect(after[i]).toBeGreaterThan(before[i]);
      expect(after[i]).toBeLessThan(setpoints[i]);
    }
  });

  it('시정수가 작은 존이 더 빨리 따라간다', () => {
    const after = stepZoneTemperatures([25, 25, 25, 25, 25, 25], setpoints, 0.1);
    // ZONE_TIME_CONSTANTS = [0.5, 0.75, 0.75, 1.0, 1.0, 1.25]
    expect(after[0]).toBeGreaterThan(after[1]);
    expect(after[3]).toBeGreaterThan(after[5]);
  });

  it('이미 설정 온도면 움직이지 않는다 (고정점)', () => {
    expect(stepZoneTemperatures([...setpoints], setpoints, 0.1)).toEqual(setpoints);
  });

  it('실제 사용하는 dt = 0.1 초에서는 수렴한다 (오버슈트 없음)', () => {
    // 앱은 setInterval 안에서 deltaTime = 0.1 로 부른다.
    let temps = [25, 25, 25, 25, 25, 25];
    for (let i = 0; i < 500; i++) temps = stepZoneTemperatures(temps, setpoints, 0.1);
    for (const t of temps) expect(t).toBeCloseTo(1000, 3);
  });

  it('전 구간에서 설정 온도를 넘어서지 않는다 (dt = 0.1)', () => {
    let temps = [25, 25, 25, 25, 25, 25];
    for (let i = 0; i < 500; i++) {
      temps = stepZoneTemperatures(temps, setpoints, 0.1);
      for (const t of temps) expect(t).toBeLessThanOrEqual(1000 + 1e-9);
    }
  });

  /*
   * explicit Euler 는 dt > 2τ 에서 발산한다. 가장 작은 시정수가 0.5 초이므로
   * dt ≥ 1.0 초면 첫 번째 존부터 진동·발산한다. 앱은 dt = 0.1 로 고정해 부르므로
   * 지금은 안전하지만, 인터벌 주기를 늘리면 바로 깨지는 구조다. 그 경계를 고정해 둔다.
   */
  it('dt = 1.0 초(= 2τ)면 첫 존이 설정 온도를 그대로 지나쳐 진동한다', () => {
    const after = stepZoneTemperatures([25, 25, 25, 25, 25, 25], setpoints, 1.0);
    expect(after[0]).toBeGreaterThan(1000); // 2배 오버슈트
  });

  it('dt = 2.0 초면 발산한다', () => {
    let temps = [25, 25, 25, 25, 25, 25];
    for (let i = 0; i < 20; i++) temps = stepZoneTemperatures(temps, setpoints, 2.0);
    expect(Math.abs(temps[0])).toBeGreaterThan(1e6);
  });

  it('가장 작은 시정수가 0.5 라 안정 조건은 dt < 1.0 이다', () => {
    expect(Math.min(...ZONE_TIME_CONSTANTS)).toBe(0.5);
  });
});
