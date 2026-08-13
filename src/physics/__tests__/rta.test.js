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
   * 냉각은 뉴턴 냉각(지수 감쇠)이다. 예전의 (t/τ)^0.7 은 t = 0 에서 도함수가
   * 무한대라 soak 이 끝나는 순간 냉각 속도가 발산했다.
   */
  it('냉각 시작 순간의 냉각 속도가 유한하다', () => {
    const soakEnd = 10 + (recipe.targetTemp - 25) / recipe.rampRate + recipe.processTime;
    const slope = (dt) => (calculateTempProfile(soakEnd, recipe) - calculateTempProfile(soakEnd + dt, recipe)) / dt;
    // dt 를 100배 줄여도 기울기가 같은 값에 수렴한다 (도함수가 존재한다).
    expect(slope(1e-4) / slope(1e-2)).toBeCloseTo(1, 1);
    expect(Number.isFinite(slope(1e-6))).toBe(true);
  });

  it('냉각 초기 속도가 램프업 속도와 같은 자릿수다', () => {
    const soakEnd = 10 + (recipe.targetTemp - 25) / recipe.rampRate + recipe.processTime;
    const coolRate =
      (calculateTempProfile(soakEnd, recipe) - calculateTempProfile(soakEnd + 0.01, recipe)) / 0.01;
    // 냉각률을 램프업 속도에 묶어 검사하면 안 된다. 복사 방열은 사용자가 고른
    // 램프업 속도와 무관하다. 문헌 RTP 램프다운 실측 대역(80~150 °C/s)으로 본다.
    expect(coolRate).toBeGreaterThan(80);
    expect(coolRate).toBeLessThan(150);
  });

  it('램프 속도가 빠를수록 목표 온도에 빨리 도달한다', () => {
    const reachTime = (rate) => 10 + (recipe.targetTemp - 25) / rate;
    expect(reachTime(100)).toBeLessThan(reachTime(25));
    expect(calculateTempProfile(reachTime(100), { ...recipe, rampRate: 100 })).toBeCloseTo(1000, 6);
  });

  it('냉각 소요 시간이 램프업 속도와 무관하다', () => {
    // 예전 테스트는 calculateTempProfile 을 아예 호출하지 않고, 구현 상수 0.3 을
    // 다시 쓴 뒤 1/0.3 > 1 이라는 산술 항등식만 확인했다. 냉각 모델이 통째로
    // 바뀌어도 통과했다.
    //
    // 냉각은 램프를 끈 뒤의 복사 방열이라 램프업 속도와 무관해야 한다.
    // 예전 모델은 램프율에 비례시켜 25 °C/s 를 고르면 7.5, 300 을 고르면
    // 90 °C/s 로 12배가 달라졌다.
    const coolDuration = (rampRate) => {
      const r = { ...recipe, rampRate };
      const soakEnd = 10 + (r.targetTemp - 25) / rampRate + r.processTime;
      let t = soakEnd;
      while (calculateTempProfile(t, r) > 26 && t < soakEnd + 500) t += 0.1;
      return t - soakEnd;
    };
    const base = coolDuration(50);
    for (const rr of [25, 100, 200, 300]) {
      expect(coolDuration(rr)).toBeCloseTo(base, 1);
    }
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
  it('가장자리 존일수록 설정 온도가 높다 (에지 복사 손실 보상)', () => {
    // 웨이퍼 가장자리는 측면 복사로 온도가 떨어지므로 다구역 RTP 는 최외곽
    // 존을 더 뜨겁게 잡아 보상한다. 예전 구현은 정반대로 가장자리를 8°C 까지
    // 낮춰, 시뮬레이터 본문의 "존 독립 제어로 균일성 확보" 설명과 어긋났다.
    const sp = computeZoneSetpoints(1000, [100, 100, 100, 100, 100, 100]);
    expect(sp[5]).toBeGreaterThan(sp[4]);
    expect(sp[4]).toBeGreaterThan(sp[2]);
    expect(sp[2]).toBeGreaterThan(sp[0]);
  });

  it('설정 온도가 램프 출력의 함수가 아니다', () => {
    // 설정값은 제어의 입력이고 램프 출력은 그 결과다. 예전 식은 출력이 설정값을
    // 밀어 올리는 순환 구조라 hold 구간에서 모든 존이 목표보다 높았다.
    const low = computeZoneSetpoints(1000, [0, 0, 0, 0, 0, 0]);
    const high = computeZoneSetpoints(1000, [100, 100, 100, 100, 100, 100]);
    expect(high).toEqual(low);
  });

  it('중앙 존 설정 온도가 목표 온도와 같다', () => {
    expect(computeZoneSetpoints(1000, [100, 100, 100, 100, 100, 100])[0]).toBe(1000);
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
   * 해석해 T(t+Δt) = T_sp + (T − T_sp)·e^(−Δt/τ) 를 쓰므로 어떤 Δt 에서도
   * 설정 온도를 지나치지 않는다. 예전의 explicit Euler 는 Δt > 2τ 에서 발산했고,
   * 가장 작은 시정수가 0.5 초라 Δt ≥ 1.0 이면 바로 진동했다.
   */
  it('어떤 시간 간격에서도 설정 온도를 지나치지 않는다', () => {
    for (const dt of [0.1, 0.5, 1.0, 2.0, 10, 1000]) {
      const after = stepZoneTemperatures([25, 25, 25, 25, 25, 25], setpoints, dt);
      for (const t of after) {
        expect(t).toBeGreaterThanOrEqual(25);
        expect(t).toBeLessThanOrEqual(1000);
      }
    }
  });

  it('큰 시간 간격에서도 발산하지 않고 설정 온도로 수렴한다', () => {
    let temps = [25, 25, 25, 25, 25, 25];
    for (let i = 0; i < 20; i++) temps = stepZoneTemperatures(temps, setpoints, 2.0);
    for (const t of temps) expect(t).toBeCloseTo(1000, 3);
  });

  it('한 스텝이 지수 감쇠 해석해와 일치한다', () => {
    const dt = 0.3;
    const after = stepZoneTemperatures([25, 25, 25, 25, 25, 25], setpoints, dt);
    after.forEach((t, i) => {
      const expected = 1000 + (25 - 1000) * Math.exp(-dt / ZONE_TIME_CONSTANTS[i]);
      expect(t).toBeCloseTo(expected, 9);
    });
  });

  it('시간 간격 0 이면 온도가 그대로다', () => {
    const before = [25, 30, 28, 26, 27, 25];
    expect(stepZoneTemperatures(before, setpoints, 0)).toEqual(before);
  });
});
