import { describe, it, expect } from 'vitest';
import { calculateOxideRemovalEfficiency } from '../cleaning.js';

const wet = (over = {}) => ({ temperature: 50, concentration: 5, time: 10, solution: 'BOE', ...over });

describe('습식 세정', () => {
  it('BOE 가 산화막 제거에 가장 효율적이다', () => {
    const boe = calculateOxideRemovalEfficiency('wet', wet({ solution: 'BOE' }));
    for (const s of ['SC1', 'SC2', 'SPM']) {
      expect(calculateOxideRemovalEfficiency('wet', wet({ solution: s }))).toBeLessThan(boe);
    }
  });

  it('온도가 높을수록 제거율이 올라간다', () => {
    let prev = -Infinity;
    for (const T of [25, 40, 60, 80]) {
      const v = calculateOxideRemovalEfficiency('wet', wet({ temperature: T, concentration: 1, time: 1 }));
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it('농도가 높을수록 제거율이 올라간다', () => {
    const low = calculateOxideRemovalEfficiency('wet', wet({ concentration: 1 }));
    const high = calculateOxideRemovalEfficiency('wet', wet({ concentration: 8 }));
    expect(high).toBeGreaterThan(low);
  });

  it('시간이 길수록 제거율이 올라가고 15분에서 포화한다', () => {
    const t5 = calculateOxideRemovalEfficiency('wet', wet({ time: 5, concentration: 1 }));
    const t15 = calculateOxideRemovalEfficiency('wet', wet({ time: 15, concentration: 1 }));
    const t60 = calculateOxideRemovalEfficiency('wet', wet({ time: 60, concentration: 1 }));
    expect(t15).toBeGreaterThan(t5);
    expect(t60).toBe(t15); // timeFactor 가 1 로 clamp 된다
  });

  it('상한 98% 를 넘지 않는다', () => {
    expect(calculateOxideRemovalEfficiency('wet', wet({ temperature: 100, concentration: 49, time: 60 }))).toBe(98);
  });

  it('결정적이다', () => {
    expect(calculateOxideRemovalEfficiency('wet', wet())).toBe(calculateOxideRemovalEfficiency('wet', wet()));
  });

  it('경계값: 알 수 없는 용액은 SC1 계수로 떨어진다', () => {
    // 예전에는 SPM 이 분기 없이 "알 수 없는 용액" 기본값 0.8 로 떨어졌고,
    // 이 테스트가 `unknown === SPM` 을 단언해 그 버그를 사양으로 고정하고 있었다.
    // SPM 은 UI 4개 선택지 중 하나지 미지 용액이 아니다.
    const unknown = calculateOxideRemovalEfficiency('wet', wet({ solution: 'HF' }));
    const sc1 = calculateOxideRemovalEfficiency('wet', wet({ solution: 'SC1' }));
    const spm = calculateOxideRemovalEfficiency('wet', wet({ solution: 'SPM' }));
    expect(unknown).toBe(sc1);
    expect(spm).not.toBe(unknown);
  });

  /*
   * 문헌 앵커. 위 테스트들은 단조성만 보기 때문에 용액 계수를 통째로 바꿔도
   * 통과한다. 아래는 용액 간 **순서**를 못박는다.
   */
  it('산화막 제거 순서가 문헌과 같다: BOE ≫ SC1 > SC2 > SPM', () => {
    // BOE 6:1 은 SiO2 를 800 Å/min 대로 식각하고, SC1 은 1~2 Å/min,
    // SPM 은 오히려 화학 산화막을 성장시킨다.
    const at = (s, T) => calculateOxideRemovalEfficiency('wet', wet({ solution: s, temperature: T }));
    // (a) 같은 온도에서
    for (const T of [25, 50, 75]) {
      expect(at('BOE', T)).toBeGreaterThan(at('SC1', T));
      expect(at('SC1', T)).toBeGreaterThan(at('SC2', T));
      expect(at('SC2', T)).toBeGreaterThan(at('SPM', T));
    }
    // (b) 각 용액을 **권장 온도**로 돌렸을 때. 예전 모델은 여기서 순서가
    //     뒤집혔다 (SPM 95.3% > SC1 69.5% > SC2 68.0% > BOE 66.3%).
    expect(at('BOE', 25)).toBeGreaterThan(at('SPM', 130));
    expect(at('BOE', 25)).toBeGreaterThan(at('SC1', 75));
    expect(at('SC1', 75)).toBeGreaterThan(at('SPM', 130));
  });

  it('BOE 는 산화막 전용 용액답게 높은 제거율에 도달할 수 있다', () => {
    expect(calculateOxideRemovalEfficiency('wet', wet({ solution: 'BOE', concentration: 10, time: 15 }))).toBe(98);
  });

  it('SPM 의 산화막 제거율은 무시할 수준이다', () => {
    // SPM 은 유기물 제거용이고 산화막은 오히려 성장시킨다.
    expect(calculateOxideRemovalEfficiency('wet', wet({ solution: 'SPM', temperature: 130 }))).toBeLessThan(5);
  });
});

describe('건식 / 초음파 세정', () => {
  it('건식: 파워가 높을수록 제거율이 올라간다', () => {
    const low = calculateOxideRemovalEfficiency('dry', { power: 100, pressure: 0.3 });
    const high = calculateOxideRemovalEfficiency('dry', { power: 400, pressure: 0.3 });
    expect(high).toBeGreaterThan(low);
  });

  it('건식: 압력이 낮을수록 제거율이 올라간다', () => {
    const lowP = calculateOxideRemovalEfficiency('dry', { power: 300, pressure: 0.1 });
    const highP = calculateOxideRemovalEfficiency('dry', { power: 300, pressure: 0.45 });
    expect(lowP).toBeGreaterThan(highP);
  });

  it('건식: 상한 85% 를 넘지 않는다', () => {
    expect(calculateOxideRemovalEfficiency('dry', { power: 5000, pressure: 0 })).toBe(85);
  });

  it('초음파: 40 kHz 에서 가장 효율이 높다', () => {
    const peak = calculateOxideRemovalEfficiency('ultrasonic', { power: 100, frequency: 40 });
    expect(calculateOxideRemovalEfficiency('ultrasonic', { power: 100, frequency: 20 })).toBeLessThan(peak);
    expect(calculateOxideRemovalEfficiency('ultrasonic', { power: 100, frequency: 70 })).toBeLessThan(peak);
  });

  it('초음파: 산화막 제거 효율 상한이 60% 로 습식보다 낮다', () => {
    expect(calculateOxideRemovalEfficiency('ultrasonic', { power: 5000, frequency: 40 })).toBe(60);
  });

  it('세 방식의 상한 순서가 습식 > 건식 > 초음파 다', () => {
    const w = calculateOxideRemovalEfficiency('wet', wet({ temperature: 100, concentration: 49, time: 60 }));
    const d = calculateOxideRemovalEfficiency('dry', { power: 5000, pressure: 0 });
    const u = calculateOxideRemovalEfficiency('ultrasonic', { power: 5000, frequency: 40 });
    expect(w).toBeGreaterThan(d);
    expect(d).toBeGreaterThan(u);
  });

  it('경계값: 알 수 없는 방식은 0 을 낸다', () => {
    expect(calculateOxideRemovalEfficiency('supercritical', {})).toBe(0);
  });
});

describe('제거 효율의 하한', () => {
  /*
   * 세 분기 모두 Math.min 상한만 있고 Math.max 하한이 없다.
   * 입력이 정상 범위를 벗어나면 "제거 효율이 음수" 라는 말이 안 되는 값이 나온다.
   *
   *   건식 pressure = 2.0 Torr → (0.5 − 2.0)/0.4 = −3.75 → 35 − 75 = −40%
   *   습식 temperature = −50°C → tempFactor = −1 → 음의 기여
   *
   * UI 슬라이더 범위 안에서는 도달하지 않지만, 하한 가드가 없다는 사실을 고정해 둔다.
   */

  it('UI 범위 안(건식 압력 0~0.5 Torr)에서는 항상 0 이상이다', () => {
    for (let p = 0; p <= 0.5; p += 0.01) {
      for (const power of [0, 100, 300, 500]) {
        expect(calculateOxideRemovalEfficiency('dry', { power, pressure: p })).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('제거 효율은 어떤 입력에서도 0~100% 범위 안이다', () => {
    for (const p of [-5, 0, 0.5, 2.0, 100]) {
      for (const power of [-100, 0, 500, 1e6]) {
        const v = calculateOxideRemovalEfficiency('dry', { power, pressure: p });
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
    for (const T of [-200, 0, 25, 100, 500]) {
      for (const conc of [-10, 0, 10, 100]) {
        const v = calculateOxideRemovalEfficiency('wet', wet({ temperature: T, concentration: conc, time: 0, solution: 'SC2' }));
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  it('건식 압력이 UI 범위를 넘어도 0% 로 막힌다', () => {
    expect(calculateOxideRemovalEfficiency('dry', { power: 0, pressure: 2.0 })).toBe(0);
  });

  it('습식 온도가 빙점 아래여도 0% 아래로 안 간다', () => {
    expect(
      calculateOxideRemovalEfficiency('wet', wet({ temperature: -200, concentration: 0, time: 0, solution: 'SC2' }))
    ).toBe(0);
  });
});
