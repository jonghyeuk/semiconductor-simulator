import { describe, it, expect } from 'vitest';
import {
  REACTION,
  COBURN_WINTERS,
  MODES,
  speciesOf,
  createSurface,
  drawCount,
  adsorb,
  removeAtom,
  ionStrike,
  desorbSpontaneous,
  scrollIfSunk,
  chlorination,
  depthLayers,
  simulateSurface,
} from '../surfaceReaction.js';

const fixed = (v) => () => v;

/* 결정적 난수원. 시드 고정 LCG 라 CI 에서 값이 흔들리지 않는다. */
function lcg(seed = 12345) {
  let x = seed >>> 0;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

describe('표면 상태', () => {
  it('초기 표면은 깨끗하고 평평하다', () => {
    const s = createSurface(10);
    expect(chlorination(s)).toBe(0);
    expect(depthLayers(s)).toBe(0);
    expect(s.removed).toBe(0);
  });

  it('흡착은 SiCl4 에서 멈춘다', () => {
    const s = createSurface(1);
    for (let i = 0; i < 20; i++) adsorb(s, 0);
    expect(s.cl[0]).toBe(REACTION.maxCl);
    expect(chlorination(s)).toBe(1);
  });

  it('원자를 떼면 새로 드러난 표면은 염소화가 0 이다', () => {
    // 이게 없으면 한 번 염소화된 열이 영원히 빠르게 깎인다.
    const s = createSurface(1);
    for (let i = 0; i < 4; i++) adsorb(s, 0);
    removeAtom(s, 0);
    expect(s.cl[0]).toBe(0);
    expect(s.top[0]).toBe(1);
  });

  it('모든 열이 한 층 내려가면 격자를 끌어올리고 깊이는 누적된다', () => {
    const s = createSurface(3);
    for (let c = 0; c < 3; c++) removeAtom(s, c);
    expect(scrollIfSunk(s)).toBe(true);
    expect(s.scrolled).toBe(1);
    expect(Array.from(s.top)).toEqual([0, 0, 0]);
    expect(depthLayers(s)).toBe(1);   // 되감긴 게 아니라 누적돼야 한다
  });

  it('한 열이라도 안 내려갔으면 끌어올리지 않는다', () => {
    const s = createSurface(3);
    removeAtom(s, 0);
    removeAtom(s, 1);
    expect(scrollIfSunk(s)).toBe(false);
    expect(s.scrolled).toBe(0);
  });

  it('drawCount 는 기대값을 지킨다', () => {
    expect(drawCount(2.0, fixed(0.99))).toBe(2);
    expect(drawCount(0.5, fixed(0.2))).toBe(1);
    expect(drawCount(0.5, fixed(0.9))).toBe(0);
  });

  it('모드별 투입 종이 이름과 맞는다', () => {
    expect(speciesOf('radical')).toEqual({ radical: true, ion: false });
    expect(speciesOf('ion')).toEqual({ radical: false, ion: true });
    expect(speciesOf('both')).toEqual({ radical: true, ion: true });
  });
});

describe('이온 충격 — 화학적 스퍼터링', () => {
  it('염소화되지 않은 표면에는 물리항만 남는다', () => {
    const s = createSurface(1);
    // 물리항(0.019) 바로 아래 난수면 떼어내지 못한다
    expect(ionStrike(s, 0, fixed(REACTION.physical - 0.001))).toBe(true);
    const s2 = createSurface(1);
    expect(ionStrike(s2, 0, fixed(REACTION.physical + 0.001))).toBe(false);
  });

  it('완전히 염소화되면 제거 확률이 physical + chemical 이다', () => {
    const s = createSurface(1);
    s.cl[0] = 4;
    const p = REACTION.physical + REACTION.chemical;
    expect(ionStrike(s, 0, fixed(p - 0.001))).toBe(true);
  });

  it('제거 확률은 염소화에 대해 단조 증가하고, 제곱이라 처음엔 완만하다', () => {
    /* 확률식을 여기 다시 쓰면 구현을 복사한 것이라 어떤 값이어도 통과한다
       (이 저장소가 RTA 존 시정수에서 이미 겪은 함정이다).
       ionStrike 가 v < p 일 때만 true 라는 성질만 쓰고, 이분법으로 p 를 되찾는다. */
    const thresholdAt = (cl) => {
      let lo = 0, hi = 1;
      for (let k = 0; k < 40; k++) {
        const mid = (lo + hi) / 2;
        const s = createSurface(1);
        s.cl[0] = cl;
        if (ionStrike(s, 0, fixed(mid))) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    };

    const p = [0, 1, 2, 3, 4].map(thresholdAt);
    for (let i = 1; i < p.length; i++) expect(p[i]).toBeGreaterThan(p[i - 1]);

    // 염소화가 0 이면 화학항이 통째로 사라지고 물리 스퍼터링만 남는다
    expect(p[0]).toBeCloseTo(REACTION.physical, 6);

    // (cl/4)² 이므로 절반 염소화에서는 화학항의 1/4 만 얻는다.
    // 지수가 1 이면 1/2 이 되어 여기서 걸린다.
    const chemAt = (cl) => p[cl] - p[0];
    expect(chemAt(2)).toBeCloseTo(chemAt(4) / 4, 6);
    expect(chemAt(1)).toBeCloseTo(chemAt(4) / 16, 6);
  });

  it('떼어내지 못한 이온은 표면 Cl 을 흩뜨릴 수 있다 — 이온은 결합을 만들지 않는다', () => {
    const s = createSurface(1);
    s.cl[0] = 3;
    // 첫 난수는 제거 실패, 둘째 난수는 strip 성공
    const seq = [0.99, 0.01];
    let i = 0;
    expect(ionStrike(s, 0, () => seq[i++])).toBe(false);
    expect(s.cl[0]).toBe(2);
  });
});

describe('자발 탈리 — 라디칼 단독 식각의 근원', () => {
  it('완전히 염소화된 원자만 스스로 떨어진다', () => {
    const s = createSurface(3);
    s.cl[0] = 4; s.cl[1] = 3; s.cl[2] = 0;
    const out = desorbSpontaneous(s, fixed(0));   // 확률 무조건 통과
    expect(out).toEqual([0]);
    expect(s.top[1]).toBe(0);
    expect(s.top[2]).toBe(0);
  });

  it('확률이 낮아 대부분의 프레임에서는 아무 일도 없다', () => {
    const s = createSurface(40);
    s.cl.fill(4);
    expect(desorbSpontaneous(s, fixed(0.5))).toEqual([]);
  });
});

/*
 * 여기가 이 모듈의 핵심 앵커다.
 *
 * 확률 상수를 감으로 잡았다가 세 모드의 속도가 거의 같아져 시너지가 1.0 배로
 * 나온 적이 있다. 화면에서는 그럴듯해 보였고, 눈으로는 못 잡았다.
 * 그래서 문헌 상대비를 테스트로 못박는다.
 */
describe('Coburn–Winters 상대비 재현', () => {
  const OBS = 90;   // 관측 시간(s). 느린 모드의 표본이 충분해야 비율이 안정된다

  const run = (mode, seed) => simulateSurface({ mode, seconds: OBS, rng: lcg(seed) }).rate;

  it('세 모드의 속도 순서가 문헌과 같다: 이온만 < 라디칼만 ≪ 동시', () => {
    const r = run('radical', 11), i = run('ion', 22), b = run('both', 33);
    expect(i).toBeGreaterThan(0);
    expect(r).toBeGreaterThan(i);
    expect(b).toBeGreaterThan(r * 5);
  });

  it('동시 ÷ 이온만 이 문헌의 27.5 배 근처다', () => {
    const i = run('ion', 22), b = run('both', 33);
    const ratio = b / i;
    const lit = COBURN_WINTERS.both / COBURN_WINTERS.ionOnly;   // 27.5
    expect(ratio).toBeGreaterThan(lit * 0.55);
    expect(ratio).toBeLessThan(lit * 1.6);
  });

  it('시너지 배수가 문헌의 7.9 배 근처다 — 합보다 크다', () => {
    const r = run('radical', 11), i = run('ion', 22), b = run('both', 33);
    const synergy = b / (r + i);
    expect(COBURN_WINTERS.synergy).toBeCloseTo(55 / 7, 10);
    expect(synergy).toBeGreaterThan(4);              // 확실히 "합보다 크다"
    expect(synergy).toBeGreaterThan(COBURN_WINTERS.synergy * 0.6);
    expect(synergy).toBeLessThan(COBURN_WINTERS.synergy * 1.7);
  });

  it('시드를 바꿔도 결론이 뒤집히지 않는다', () => {
    for (const seed of [1, 7, 101, 2024, 88888]) {
      const r = run('radical', seed), i = run('ion', seed + 1), b = run('both', seed + 2);
      expect(b).toBeGreaterThan(r + i);              // 시너지 > 1 은 항상
      expect(b / (r + i)).toBeGreaterThan(3.5);
    }
  });

  it('이온만 넣으면 표면이 염소화되지 않는다', () => {
    const out = simulateSurface({ mode: 'ion', seconds: 20, rng: lcg(5) });
    expect(out.chlorination).toBe(0);
  });

  it('라디칼만 넣으면 표면이 거의 포화한다 — 그런데도 잘 안 깎인다', () => {
    // 시너지의 정체가 여기 있다. 염소는 잔뜩 붙었는데 떼어낼 것이 없다.
    const out = simulateSurface({ mode: 'radical', seconds: 20, rng: lcg(6) });
    expect(out.chlorination).toBeGreaterThan(0.9);
    expect(out.rate).toBeLessThan(3);
  });

  it('동시 모드의 표면 염소화는 중간값이다 — 이온이 계속 소모한다', () => {
    const out = simulateSurface({ mode: 'both', seconds: 20, rng: lcg(7) });
    expect(out.chlorination).toBeGreaterThan(0.2);
    expect(out.chlorination).toBeLessThan(0.95);
  });

  it('모드 이름 목록이 실제로 도는 모드와 일치한다', () => {
    for (const m of MODES) {
      expect(simulateSurface({ mode: m, seconds: 3, rng: lcg(9) }).rate).toBeGreaterThanOrEqual(0);
    }
  });
});
