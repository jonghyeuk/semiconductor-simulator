import { describe, it, expect } from 'vitest';
import {
  calculateEtchRate,
  calculateSelectivity,
  calculateUniformity,
  calculatePressureEffect,
  calculatePowerEffect,
  calculateGasRatioEffect,
  calculateProfile,
  calculateArdeFactor,
  simulateEtchRun,
} from '../etching.js';

/** 난수를 고정해 결정적으로 검증한다 (원본은 Math.random 을 직접 불렀다). */
const fixed = (v) => () => v;
const mid = fixed(0.5);

const GAS = { Cl2: 50, HBr: 20, CF4: 40, CHF3: 30, O2: 10, Ar: 60 };

describe('calculateEtchRate — 정상 경로', () => {
  it('난수를 고정하면 결정적이다', () => {
    const a = calculateEtchRate('Si', GAS, 300, 80, mid);
    const b = calculateEtchRate('Si', GAS, 300, 80, mid);
    expect(a).toBe(b);
  });

  it('난수 기본값은 Math.random 이라 호출마다 값이 흔들린다 (화면 동작 유지)', () => {
    const vals = new Set(Array.from({ length: 50 }, () => calculateEtchRate('Si', GAS, 300, 80)));
    expect(vals.size).toBeGreaterThan(1);
  });

  it('난수 폭은 ±10% 안이다', () => {
    const lo = calculateEtchRate('Si', GAS, 300, 80, fixed(0));
    const hi = calculateEtchRate('Si', GAS, 300, 80, fixed(1));
    expect(hi / lo).toBeCloseTo(1.1 / 0.9, 6);
  });

  it('파워가 높을수록 식각률이 높다 (600 W 포화 전까지)', () => {
    let prev = -Infinity;
    for (const p of [100, 200, 300, 400, 500, 600]) {
      const r = calculateEtchRate('Si', GAS, p, 80, mid);
      expect(r).toBeGreaterThan(prev);
      prev = r;
    }
  });

  it('600 W 를 넘으면 식각률 증가가 둔해진다 (포화)', () => {
    const slopeBelow = calculateEtchRate('Si', GAS, 600, 80, mid) - calculateEtchRate('Si', GAS, 500, 80, mid);
    const slopeAbove = calculateEtchRate('Si', GAS, 900, 80, mid) - calculateEtchRate('Si', GAS, 800, 80, mid);
    expect(slopeAbove).toBeLessThan(slopeBelow);
  });

  it('Si: Cl2 가 많을수록 빠르다', () => {
    const low = calculateEtchRate('Si', { ...GAS, Cl2: 20 }, 300, 80, mid);
    const high = calculateEtchRate('Si', { ...GAS, Cl2: 90 }, 300, 80, mid);
    expect(high).toBeGreaterThan(low);
  });

  it('Si: HBr 이 30 sccm 을 넘으면 측벽 passivation 으로 느려진다', () => {
    const noPass = calculateEtchRate('Si', { ...GAS, HBr: 30 }, 300, 80, mid);
    const heavy = calculateEtchRate('Si', { ...GAS, HBr: 90 }, 300, 80, mid);
    expect(heavy).toBeLessThan(noPass);
  });

  it('SiO2: CHF3 가 45 sccm 을 넘으면 폴리머로 etch stop 이 걸린다', () => {
    const ok = calculateEtchRate('SiO2', { ...GAS, CHF3: 45 }, 400, 80, mid);
    const stopped = calculateEtchRate('SiO2', { ...GAS, CHF3: 100 }, 400, 80, mid);
    expect(stopped).toBeLessThan(ok);
  });

  it('압력 sweet spot 80 mTorr 근처에서 최대다', () => {
    const peak = calculateEtchRate('Si', GAS, 300, 80, mid);
    expect(calculateEtchRate('Si', GAS, 300, 20, mid)).toBeLessThan(peak);
    expect(calculateEtchRate('Si', GAS, 300, 250, mid)).toBeLessThan(peak);
  });
});

describe('calculateEtchRate — 경계값', () => {
  it('반응 가스가 없으면 식각도 없다', () => {
    const zeroGas = { Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0 };
    for (const m of ['Si', 'SiO2', 'Si3N4', 'PR']) {
      expect(calculateEtchRate(m, zeroGas, 300, 80, mid)).toBe(0);
    }
  });

  it('플라즈마 파워가 0 이면 식각이 일어나지 않는다', () => {
    for (const m of ['Si', 'SiO2', 'Si3N4', 'PR']) {
      expect(calculateEtchRate(m, GAS, 0, 80, mid)).toBe(0);
    }
  });

  it('식각률은 음수가 되지 않는다 (passivation 이 과할 때도 0 에서 멈춘다)', () => {
    // Si 에서 HBr 과다는 측벽 passivation 으로 baseRate 를 음수로 만든다.
    const heavyHBr = { ...GAS, Cl2: 5, HBr: 200 };
    expect(calculateEtchRate('Si', heavyHBr, 300, 80, mid)).toBe(0);
  });

  it('알 수 없는 재료는 기본 baseRate 50 을 쓴다', () => {
    const w = calculateEtchRate('W', GAS, 300, 80, mid);
    expect(w).toBeGreaterThan(0);
    expect(Number.isFinite(w)).toBe(true);
  });

  it('극단적으로 높은 압력에서도 유한하고 음수가 아니다', () => {
    const r = calculateEtchRate('Si', GAS, 300, 10000, mid);
    expect(Number.isFinite(r)).toBe(true);
    expect(r).toBeGreaterThan(0);
  });

  it('음수 압력에서도 NaN 이 아니다', () => {
    expect(Number.isNaN(calculateEtchRate('Si', GAS, 300, -50, mid))).toBe(false);
  });
});

describe('calculateSelectivity', () => {
  it('난수를 고정하면 결정적이다', () => {
    expect(calculateSelectivity('Si', GAS, 300, 80, mid)).toBe(calculateSelectivity('Si', GAS, 300, 80, mid));
  });

  it('Si: HBr 이 많을수록 선택비가 높다', () => {
    const low = calculateSelectivity('Si', { ...GAS, HBr: 10 }, 300, 80, mid);
    const high = calculateSelectivity('Si', { ...GAS, HBr: 60 }, 300, 80, mid);
    expect(high).toBeGreaterThan(low);
  });

  it('SiO2: CHF3 폴리머가 많을수록 선택비가 높다', () => {
    const low = calculateSelectivity('SiO2', { ...GAS, CHF3: 10 }, 300, 80, mid);
    const high = calculateSelectivity('SiO2', { ...GAS, CHF3: 60 }, 300, 80, mid);
    expect(high).toBeGreaterThan(low);
  });

  it('고전력에서는 물리 충격이 우세해져 선택비가 떨어진다', () => {
    const low = calculateSelectivity('Si', GAS, 500, 80, mid);
    const high = calculateSelectivity('Si', GAS, 1000, 80, mid);
    expect(high).toBeLessThan(low);
  });

  it('선택비는 항상 1 이상이다 (하한)', () => {
    for (const m of ['Si', 'SiO2', 'Si3N4', 'PR', 'W']) {
      for (const p of [100, 600, 1500]) {
        expect(calculateSelectivity(m, GAS, p, 80, mid)).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('경계값: 가스 0, 초고전력이면 하한 1 로 clamp 된다', () => {
    const zeroGas = { Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0 };
    expect(calculateSelectivity('Si', zeroGas, 5000, 80, mid)).toBe(1);
  });
});

describe('calculateUniformity', () => {
  it('압력 100 mTorr, 파워 300 W 에서 최대 100% 다', () => {
    expect(calculateUniformity(100, 300, null)).toBe(100);
  });

  it('최적점에서 멀어질수록 균일도가 떨어진다', () => {
    const peak = calculateUniformity(100, 300, null);
    expect(calculateUniformity(300, 300, null)).toBeLessThan(peak);
    expect(calculateUniformity(100, 800, null)).toBeLessThan(peak);
  });

  it('총 가스 유량이 350 sccm 을 넘으면 균일도가 떨어진다', () => {
    const ok = calculateUniformity(100, 300, { a: 100, b: 100, c: 100 });
    const heavy = calculateUniformity(100, 300, { a: 300, b: 300, c: 300 });
    expect(heavy).toBeLessThan(ok);
  });

  it('항상 40~100% 범위 안이다', () => {
    for (const p of [0, 50, 100, 500, 2000]) {
      for (const w of [0, 300, 1000, 5000]) {
        const u = calculateUniformity(p, w, { a: 1000 });
        expect(u).toBeGreaterThanOrEqual(40);
        expect(u).toBeLessThanOrEqual(100);
      }
    }
  });

  it('결정적이다', () => {
    expect(calculateUniformity(100, 300, GAS)).toBe(calculateUniformity(100, 300, GAS));
  });
});

describe('보조 인자들', () => {
  it('압력 효과는 단조 증가하고 2.0 에서 포화한다', () => {
    expect(calculatePressureEffect(50)).toBeLessThan(calculatePressureEffect(100));
    expect(calculatePressureEffect(10000)).toBe(2.0);
  });

  it('파워 효과는 단조 증가하고 3.0 에서 포화한다', () => {
    expect(calculatePowerEffect(200)).toBeLessThan(calculatePowerEffect(400));
    expect(calculatePowerEffect(10000)).toBe(3.0);
  });

  it('가스비 효과는 단조 증가하고 2.0 에서 포화한다', () => {
    expect(calculateGasRatioEffect(10)).toBeLessThan(calculateGasRatioEffect(50));
    expect(calculateGasRatioEffect(10000)).toBe(2.0);
  });

  it('경계값: 0 입력에서도 하한값이 나온다', () => {
    expect(calculatePressureEffect(0)).toBe(0.5);
    expect(calculatePowerEffect(0)).toBe(0.5);
    expect(calculateGasRatioEffect(0)).toBe(0.8);
  });
});

/*
 * 아래는 문헌 앵커다. 기존 테스트는 단조성·경계만 보기 때문에 상수를 통째로
 * 바꿔도 전부 통과한다 (실제로 계수를 4배로 바꿔 확인했다). 여기서는 값 자체와
 * 재료 간 관계를 못박는다.
 */
describe('calculateEtchRate — 문헌 앵커', () => {
  const R = () => 0.5; // 난수 고정
  const G = (o = {}) => ({ Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0, ...o });

  it('질화막은 CF4 에 반응하고, 불소계에서 산화막보다 빠르다', () => {
    // 예전 Si3N4 분기에는 CF4 항이 아예 없어 CF4 100 sccm 에서도 0 이 나왔다.
    for (const cf4 of [25, 50, 100]) {
      const sin = calculateEtchRate('Si3N4', G({ CF4: cf4 }), 400, 80, R);
      const sio = calculateEtchRate('SiO2', G({ CF4: cf4 }), 400, 80, R);
      expect(sin).toBeGreaterThan(0);
      expect(sin).toBeGreaterThan(sio);
    }
  });

  it('파워가 실제로 포화한다 — 증분이 계속 줄어든다', () => {
    // 예전 식은 1160 W 에서 하한 0.7 에 닿은 뒤 다시 완전한 선형이었다.
    const rate = (p) => calculateEtchRate('Si', G({ Cl2: 30 }), p, 100, R);
    let prevStep = Infinity;
    for (const [a, b] of [[600, 1000], [1000, 1400], [1400, 2000], [2000, 3000]]) {
      const step = (rate(b) - rate(a)) / (b - a); // W 당 증분
      expect(step).toBeLessThan(prevStep);
      expect(step).toBeGreaterThan(0);
      prevStep = step;
    }
  });

  it('압력이 0 이면 방전이 없으므로 식각도 없다', () => {
    expect(calculateEtchRate('Si', G({ Cl2: 30 }), 300, 0, R)).toBe(0);
  });

  it('미지 재료도 파워·가스가 0 이면 식각이 없다', () => {
    // 예전에는 default 분기가 상수 50 이라 파워 0 에서도 50 nm/min 이 나왔다.
    expect(calculateEtchRate('W', G({ CF4: 50 }), 0, 80, R)).toBe(0);
    expect(calculateEtchRate('W', G(), 400, 80, R)).toBe(0);
  });

  it('대표 프리셋 절대값이 시뮬레이터 이론표 범위 안에 있다', () => {
    // EtchingSimulator 의 재료별 식각률 표와 대조한다.
    const cases = [
      ['Si', { Cl2: 30, HBr: 15, Ar: 90 }, 100, 300],
      ['SiO2', { CF4: 5, CHF3: 30, Ar: 90 }, 50, 150],
      ['Si3N4', { CHF3: 25, O2: 5, Ar: 70 }, 40, 120],
      ['PR', { O2: 100 }, 200, 500],
    ];
    for (const [m, gas, lo, hi] of cases) {
      const v = calculateEtchRate(m, G(gas), 300, 100, R);
      expect(v).toBeGreaterThanOrEqual(lo);
      expect(v).toBeLessThanOrEqual(hi);
    }
  });
});


/* ────────────────────────── 단면 프로파일 ────────────────────────── */

describe('calculateProfile — 형상', () => {
  const G = (o = {}) => ({ Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0, ...o });

  it('이방도는 0~1 을 벗어나지 않는다', () => {
    for (const p of [0, 30, 100, 200, 1000]) {
      for (const w of [0, 300, 800, 5000]) {
        const a = calculateProfile('Si', G({ Cl2: 30, HBr: 50, Ar: 100 }), w, p).anisotropy;
        expect(a).toBeGreaterThanOrEqual(0.05);
        expect(a).toBeLessThanOrEqual(1);
      }
    }
  });

  it('압력이 오르면 이방도가 떨어진다 (시스 내 이온 산란)', () => {
    let prev = Infinity;
    for (const p of [30, 60, 100, 150, 200]) {
      const a = calculateProfile('Si', G({ Cl2: 30, Ar: 80 }), 300, p).anisotropy;
      expect(a).toBeLessThan(prev);
      prev = a;
    }
  });

  it('측벽 passivation 가스가 이방도를 올린다 — 예전 베이 화면은 이걸 무시했다', () => {
    // 식각 베이는 압력만 보고 프로파일을 그렸다. HBr 을 0 → 100 으로 올려도
    // 그림이 한 픽셀도 바뀌지 않았고, 같은 화면의 설명문과 정면으로 어긋났다.
    const none = calculateProfile('Si', G({ Cl2: 30, Ar: 80 }), 300, 100);
    const heavy = calculateProfile('Si', G({ Cl2: 30, HBr: 100, Ar: 80 }), 300, 100);
    expect(heavy.anisotropy).toBeGreaterThan(none.anisotropy);
    expect(heavy.lateralRatio).toBeLessThan(none.lateralRatio);
  });

  it('이온 충격(Ar·RF)이 이방도를 올린다', () => {
    const low = calculateProfile('Si', G({ Cl2: 30, Ar: 10 }), 150, 100).anisotropy;
    const high = calculateProfile('Si', G({ Cl2: 30, Ar: 100 }), 700, 100).anisotropy;
    expect(high).toBeGreaterThan(low);
  });

  it('lateralRatio 는 이방도의 교과서 정의와 맞물린다: A = 1 − 수평/수직', () => {
    const r = calculateProfile('Si', G({ Cl2: 30, HBr: 20, Ar: 80 }), 300, 80);
    expect(r.lateralRatio).toBeCloseTo(1 - r.anisotropy, 12);
  });

  it('측벽 각은 깊이당 순 변위의 아크탄젠트다', () => {
    const r = calculateProfile('Si', G({ Cl2: 30, HBr: 20, Ar: 80 }), 300, 80);
    const net = r.lateralRatio - r.taperRatio;
    expect(r.sidewallAngle).toBeCloseTo(90 - (Math.atan(Math.abs(net)) * 180) / Math.PI, 10);
    expect(r.sidewallAngle).toBeLessThanOrEqual(90);
  });

  it('권장 프리셋 3 종이 등방성으로 판정되지 않는다', () => {
    // 예전 이방도 식에서는 셋 다 A ≈ 0.4 (측면이 수직의 60% 속도) 였다.
    // 화면은 "이상적인 조건" 이라 말하면서 그림은 뭉개진 그릇을 보여 줬다.
    const presets = [
      ['Si', { Cl2: 30, HBr: 15, Ar: 78 }, 300],
      ['SiO2', { CF4: 25, CHF3: 30, Ar: 65 }, 400],
      ['Si3N4', { CHF3: 25, O2: 10, Ar: 70 }, 400],
    ];
    for (const [t, gas, w] of presets) {
      const r = calculateProfile(t, G(gas), w, 100);
      expect(r.anisotropy).toBeGreaterThan(0.6);
      expect(r.profileType).not.toBe('isotropic');
    }
  });

  it('이방도 앵커 — 이온 포화 반값점이 30 이다', () => {
    // Ar 18 + 300W/25 = 30 → directional = 0.5, 폴리머 0, 30 mTorr → scatter = 1
    // ionShare = 0.5. Cl2 단독이므로 자발 반응성 S = 0.10.
    //   vertical = 0.5 + 0.5×0.10 = 0.55,  lateral = 1×0.10 = 0.10
    //   lateralRatio = 0.10/0.55 = 0.1818…  → A = 0.8181…
    const r = calculateProfile('Si', G({ Cl2: 30, Ar: 18 }), 300, 30);
    expect(r.ionShare).toBeCloseTo(0.5, 10);
    expect(r.lateralRatio).toBeCloseTo(0.1 / 0.55, 10);
    expect(r.anisotropy).toBeCloseTo(1 - 0.1 / 0.55, 10);
  });

  it('이방도 앵커 — 산란 항의 압력 스케일이 400 mTorr 다', () => {
    // 같은 조건에서 압력만 430 mTorr → scatter = 1/(1 + 400/400) = 0.5
    // ionShare = 0.5 × 0.5 = 0.25
    const r = calculateProfile('Si', G({ Cl2: 30, Ar: 18 }), 300, 430);
    expect(r.ionShare).toBeCloseTo(0.25, 10);
  });

  it('자발 반응성 — 염소는 실리콘을 저절로 못 깎고, 불소는 깎는다', () => {
    /* 이것이 프로파일의 운명을 정한다. 측벽에는 이온이 안 닿으므로 측벽이 깎이려면
       라디칼이 혼자 반응해야 한다. 게이트 식각이 Cl2/HBr 를 쓰는 첫 번째 이유다.
       앞선 판에는 이 물리가 없어서 Cl2/HBr 프리셋이 500 nm 당 한쪽 150 nm 언더컷으로
       계산됐다 — 실제 CD 손실은 수 nm 수준이다. */
    const ion = { Ar: 78 };
    const cl = calculateProfile('Si', G({ Cl2: 50, ...ion }), 300, 50);
    const f = calculateProfile('Si', G({ CF4: 50, ...ion }), 300, 50);
    expect(f.lateralRatio).toBeGreaterThan(cl.lateralRatio * 5);
    expect(f.profileType).toBe('isotropic');
    expect(cl.anisotropy).toBeGreaterThan(0.85);
  });

  it('HBr 는 Cl2 보다도 자발 반응성이 낮아 프로파일을 더 세운다', () => {
    const cl = calculateProfile('Si', G({ Cl2: 60, Ar: 78 }), 300, 50);
    const br = calculateProfile('Si', G({ HBr: 60, Ar: 78 }), 300, 50);
    expect(br.lateralRatio).toBeLessThan(cl.lateralRatio);
  });

  it('산화막은 자발 반응이 거의 없어 고압에서도 수직에 가깝다', () => {
    // F + SiO2 는 이온 주도다. 그래서 CCP 산화막 식각이 100 mTorr 에서도 선다.
    const r = calculateProfile('SiO2', G({ CF4: 25, CHF3: 30, Ar: 65 }), 400, 100);
    expect(r.anisotropy).toBeGreaterThan(0.9);
  });

  it('이온이 전혀 없으면 방향성도 없다', () => {
    // 폴리머만 잔뜩 넣어도 이온이 없으면 프로파일이 서지 않는다.
    // (앞선 판은 여기서 A=0.86 이 나왔다 — 폴리머가 방향을 만들어 낸 셈이었다.)
    const r = calculateProfile('Si', G({ Cl2: 30, HBr: 90 }), 0, 30);
    expect(r.ionShare).toBe(0);
    expect(r.anisotropy).toBeLessThan(0.75);
  });

  it('언더컷 판정 경계는 측벽 80° 다', () => {
    // 이름과 각도가 따로 놀면 안 된다. 등방·테이퍼·etch stop 이 아닌 한
    // 'undercut' 은 80° 미만, 'vertical' 은 80° 이상이어야 한다.
    const undercutAngles = [];
    const verticalAngles = [];
    for (let p = 30; p <= 200; p += 10) {
      for (const ar of [20, 50, 80, 100]) {
        for (const hbr of [0, 20, 60]) {
          const r = calculateProfile('Si', G({ Cl2: 30, HBr: hbr, Ar: ar }), 400, p);
          if (r.profileType === 'undercut') undercutAngles.push(r.sidewallAngle);
          if (r.profileType === 'vertical') verticalAngles.push(r.sidewallAngle);
        }
      }
    }
    expect(undercutAngles.length).toBeGreaterThan(0);
    expect(verticalAngles.length).toBeGreaterThan(0);
    expect(Math.max(...undercutAngles)).toBeLessThan(80);
    expect(Math.min(...verticalAngles)).toBeGreaterThanOrEqual(80);
  });

  it('Ar 없이 고압이면 프로파일이 무너진다', () => {
    // Cl 계는 자발 반응성이 낮아 완전한 등방까지는 안 가지만, 이온 비중이 떨어져
    // 측벽이 눈에 띄게 파인다. 완전 등방은 불소계에서 나온다 (위 자발 반응성 테스트).
    const r = calculateProfile('Si', G({ Cl2: 30 }), 300, 200);
    expect(r.profileType).toBe('undercut');
    expect(r.lateralRatio).toBeGreaterThan(0.25);
    const f = calculateProfile('Si', G({ CF4: 30 }), 300, 200);
    expect(f.profileType).toBe('isotropic');
  });

  it('폴리머가 식각종을 압도하면 etch stop', () => {
    expect(calculateProfile('SiO2', G({ CHF3: 70, CF4: 5 }), 400, 60).etchStop).toBe(true);
    // PR 애싱에는 폴리머 etch stop 개념이 없다
    expect(calculateProfile('PR', G({ CHF3: 70, O2: 100 }), 400, 60).etchStop).toBe(false);
  });

  it('마스크 손상 문턱은 화면 경고문과 같다 (Ar>80 · RF>500)', () => {
    expect(calculateProfile('Si', G({ Ar: 80 }), 500, 100).maskDamage).toBe(false);
    expect(calculateProfile('Si', G({ Ar: 85 }), 500, 100).maskDamage).toBe(true);
    expect(calculateProfile('Si', G({ Ar: 50 }), 550, 100).maskDamage).toBe(true);
  });
});

describe('calculateArdeFactor — 종횡비 의존 식각', () => {
  // G 는 위 describe 안에 있어서 여기서는 안 보인다
  const G = (o = {}) => ({ Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0, ...o });

  it('종횡비 0 에서는 감속이 없다', () => {
    for (const a of [0, 0.5, 1]) expect(calculateArdeFactor(0, a)).toBe(1);
  });

  it('깊어질수록 단조 감소한다', () => {
    let prev = Infinity;
    for (const ar of [0, 1, 2, 5, 10, 20]) {
      const f = calculateArdeFactor(ar, 0.6);
      expect(f).toBeLessThan(prev);
      prev = f;
    }
  });

  it('이온 주도 식각일수록 RIE lag 이 작다', () => {
    // 이온은 수직으로 가속돼 들어가므로 깊이의 영향을 덜 받는다.
    expect(calculateArdeFactor(5, 0.95)).toBeGreaterThan(calculateArdeFactor(5, 0.3));
  });

  it('이방도가 아니라 이온 비중을 받아야 한다', () => {
    /* 이방도에는 측벽 폴리머의 몫이 섞여 있다. 폴리머로 이방성을 얻은 저이온 공정과
       이온 주도 공정이 이방도로는 구분되지 않아, ARDE 를 이방도로 근사했을 때
       둘 다 0.8 대가 나왔다. 폴리머는 라디칼을 트렌치 바닥까지 실어 나르지 못한다. */
    const poly = calculateProfile('SiO2', G({ CF4: 10, CHF3: 90, Ar: 5 }), 200, 60);
    const ionic = calculateProfile('Si', G({ Cl2: 30, Ar: 100 }), 800, 30);
    expect(poly.ionShare).toBeLessThan(ionic.ionShare * 0.6);
    // 실측 0.43 대 0.85 — 이방도로 근사했을 때는 0.89 대 0.83 으로 거의 같았다.
    expect(calculateArdeFactor(5, poly.ionShare))
      .toBeLessThan(calculateArdeFactor(5, ionic.ionShare) * 0.6);
  });

  it('완전 이온 주도면 감속이 없고, 완전 중성 주도면 도관 투과확률 그대로다', () => {
    expect(calculateArdeFactor(8, 1)).toBe(1);
    expect(calculateArdeFactor(4, 0)).toBeCloseTo(1 / (1 + 0.75 * 4), 12);
  });
});

describe('simulateEtchRun — 시간이 깊이를 정한다', () => {
  // ARDE 에 쓰이는 것은 이방도가 아니라 이온 비중이다. 그래서 profile 객체를 받는다.
  const prof = (ionShare) => ({ ionShare });
  const base = {
    rate: 120, filmThickness: 500, trenchWidth: 500, profile: prof(0.8), selectivity: 20,
  };

  it('profile 을 빠뜨리면 조용히 넘어가지 않고 터진다', () => {
    /* 예전에는 anisotropy 를 이름으로 받아서, 호출부가 옛 이름을 계속 넘기면
       기본값 1 이 적용돼 ARDE 가 통째로 꺼진 채 조용히 돌았다. 실제로 이름을 바꾼 뒤
       화면 호출부 5 곳이 그대로 남아 있었고, 아무 데서도 티가 나지 않았다. */
    expect(() => simulateEtchRun({ ...base, profile: undefined, seconds: 10 })).toThrow();
    expect(() => simulateEtchRun({ ...base, profile: { anisotropy: 0.8 }, seconds: 10 })).toThrow();
  });

  it('시간이 길수록 깊어진다', () => {
    let prev = -1;
    for (const s of [10, 60, 120, 300, 600]) {
      const d = simulateEtchRun({ ...base, seconds: s }).depth;
      expect(d).toBeGreaterThan(prev);
      prev = d;
    }
  });

  it('시간이 모자라면 막이 남는다 (언더에치)', () => {
    const r = simulateEtchRun({ ...base, seconds: 60 });
    expect(r.remainingFilm).toBeGreaterThan(0);
    expect(r.underlayerLoss).toBe(0);
    expect(r.punchThroughTime).toBeNull();
  });

  it('막을 뚫은 뒤에는 하부층이 선택비만큼 느리게 깎인다', () => {
    const hi = simulateEtchRun({ ...base, seconds: 600, selectivity: 50 });
    const lo = simulateEtchRun({ ...base, seconds: 600, selectivity: 5 });
    expect(hi.remainingFilm).toBe(0);
    expect(lo.underlayerLoss).toBeGreaterThan(hi.underlayerLoss);
  });

  it('관통 시각 전후로 시간이 새지 않는다', () => {
    // 틱 경계에서 남은 시간을 버리면 오버에치가 과소평가된다.
    const r = simulateEtchRun({ ...base, seconds: 400, dt: 0.25 });
    const coarse = simulateEtchRun({ ...base, seconds: 400, dt: 4 });
    expect(r.punchThroughTime).toBeGreaterThan(0);
    expect(coarse.depth).toBeCloseTo(r.depth, 0);
  });

  it('ARDE 때문에 깊이는 시간에 대해 선형이 아니다 — 뒤로 갈수록 느려진다', () => {
    const t1 = simulateEtchRun({ ...base, seconds: 60, trenchWidth: 100 }).depth;
    const t2 = simulateEtchRun({ ...base, seconds: 120, trenchWidth: 100 }).depth;
    expect(t2).toBeLessThan(2 * t1);
  });

  it('좁은 패턴이 넓은 패턴보다 얕게 파인다 (RIE lag)', () => {
    const wide = simulateEtchRun({ ...base, seconds: 150, trenchWidth: 1000 }).depth;
    const narrow = simulateEtchRun({ ...base, seconds: 150, trenchWidth: 100 }).depth;
    expect(narrow).toBeLessThan(wide);
  });

  it('식각률 0 이면 아무것도 깎이지 않는다', () => {
    const r = simulateEtchRun({ ...base, rate: 0, seconds: 600 });
    expect(r.depth).toBe(0);
    expect(r.remainingFilm).toBe(500);
  });

  it('선택비 1 미만은 1 로 눌러 하부층이 막보다 빨리 깎이는 일이 없게 한다', () => {
    const a = simulateEtchRun({ ...base, seconds: 600, selectivity: 0 });
    const b = simulateEtchRun({ ...base, seconds: 600, selectivity: 1 });
    expect(a.underlayerLoss).toBe(b.underlayerLoss);
  });
});
