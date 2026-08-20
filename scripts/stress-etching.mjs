/**
 * 무작위 파라미터 물리 불변식 검사 (식각).
 *
 *   node scripts/stress-etching.mjs
 *
 * 단위 테스트는 사람이 미리 생각한 경우만 본다. 이 스크립트는 가스 6종·파워·압력·재료를
 * 무작위로 뽑아 4 만 건을 돌리면서, 조건과 무관하게 반드시 성립해야 하는 성질만 본다.
 * 실제로 여기서 "식각종이 하나도 없는 조건에서 이방도를 1(완벽히 수직)로 보고한다" 를
 * 잡았다 — 0/0 을 1 로 답하고 있었고, 단위 테스트로는 떠오르지 않던 경우다.
 *
 * 값이 "그럴듯한가" 는 보지 않는다. 그건 문헌 앵커 테스트의 몫이다.
 *
 * 가스 6종·파워·압력·재료를 무작위로 뽑아 수만 건을 돌리면서, 조건과 무관하게
 * 반드시 성립해야 하는 성질들을 확인한다. 값이 "그럴듯한가" 가 아니라
 * "물리적으로 불가능한 일이 일어나지 않는가" 를 본다.
 */
import * as et from '../src/physics/etching.js';

const TARGETS = ['Si', 'SiO2', 'Si3N4', 'PR'];
const GASES = ['Cl2', 'HBr', 'CF4', 'C4F8', 'CHF3', 'O2', 'Ar'];

/* 기본 시드는 고정이다 — CI 에서 같은 결과가 나와야 하기 때문이다.
   `npm run stress:etching -- --seed 7` 처럼 주면 다른 표본으로 다시 돌릴 수 있다. */
const seedArg = process.argv.indexOf('--seed');
let seed = seedArg > 0 ? Number(process.argv[seedArg + 1]) >>> 0 : 20260819;
const SEED0 = seed;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];

const TYPES = ['ccp', 'dfccp', 'icp'];

function randomCase(extreme = false) {
  const g = {};
  for (const k of GASES) g[k] = rnd() < 0.45 ? 0 : Math.round(rnd() * (extreme ? 300 : 100));
  /* 절반은 숫자(CCP 단일 RF), 절반은 소스/바이어스가 갈린 객체로 뽑는다.
     불변식은 어느 쪽이든 똑같이 성립해야 한다. */
  const scalar = extreme ? Math.round(rnd() * 3000) : 100 + Math.round(rnd() * 700);
  const power = rnd() < 0.5 ? scalar : {
    source: extreme ? Math.round(rnd() * 4000) : 200 + Math.round(rnd() * 1300),
    bias: extreme ? Math.round(rnd() * 5000) : 20 + Math.round(rnd() * 1500),
    type: pick(TYPES),
  };
  return {
    target: pick(TARGETS),
    gas: g,
    power,
    pressure: extreme ? Math.round(rnd() * 2000) : 30 + Math.round(rnd() * 170),
  };
}

/** 실패 보고에 파워를 사람이 읽을 수 있게 적는다. */
const powerLabel = (w) =>
  typeof w === 'number' ? `W=${w}` : `${w.type} src=${w.source} bias=${w.bias}`;

const fails = new Map();
const fail = (rule, c, extra = '') => {
  if (!fails.has(rule)) fails.set(rule, []);
  if (fails.get(rule).length < 3) {
    fails.get(rule).push(`${c.target} P=${c.pressure} ${powerLabel(c.power)} ` +
      GASES.filter((k) => c.gas[k]).map((k) => `${k}${c.gas[k]}`).join(',') + (extra ? ` | ${extra}` : ''));
  }
};
const finite = (v) => Number.isFinite(v);
const half = () => 0.5;   // 난수를 고정해 결정적으로 본다

const N = 40000;
for (let i = 0; i < N; i++) {
  const c = randomCase(i % 5 === 0);
  const { target, gas, power, pressure } = c;

  const rate = et.calculateEtchRate(target, gas, power, pressure, half);
  const sel = et.calculateSelectivity(target, gas, power, pressure, half);
  const uni = et.calculateUniformity(pressure, power, gas);
  const p = et.calculateProfile(target, gas, power, pressure);

  // ── 유한성 ──
  if (![rate, sel, uni, p.anisotropy, p.lateralRatio, p.taperRatio, p.bowRatio,
        p.ionShare, p.sidewallAngle, p.undercut, p.polymerThickness].every(finite)) {
    fail('유한하지 않은 값', c);
  }

  // ── 범위 ──
  if (rate < 0) fail('식각률 음수', c, `rate=${rate}`);
  if (sel < 1) fail('선택비 < 1', c, `sel=${sel}`);
  if (uni < 40 || uni > 100) fail('균일도 범위', c, `uni=${uni}`);
  if (p.anisotropy < 0 || p.anisotropy > 1) fail('이방도 범위', c, `A=${p.anisotropy}`);
  if (p.lateralRatio < 0 || p.lateralRatio > 1) fail('lateralRatio 범위', c);
  if (p.ionShare < 0 || p.ionShare > 1) fail('ionShare 범위', c);
  if (p.sidewallAngle <= 0 || p.sidewallAngle > 90) fail('측벽각 범위', c, `${p.sidewallAngle}`);
  if (p.taperRatio < 0) fail('테이퍼 음수', c);
  if (p.bowRatio < 0) fail('보잉 음수', c);

  // ── 정의 일관성 ──
  if (Math.abs(p.anisotropy - (1 - p.lateralRatio)) > 1e-12) fail('A ≠ 1 − lateralRatio', c);
  const net = p.lateralRatio - p.taperRatio;
  const ang = 90 - (Math.atan(Math.abs(net)) * 180) / Math.PI;
  if (Math.abs(p.sidewallAngle - ang) > 1e-9) fail('측벽각이 정의와 불일치', c);

  // ── 시스 ──
  const sh = et.sheathCollisionality(pressure, power);
  for (const [k, v] of Object.entries(sh)) {
    if (k === 'collisional') continue;
    if (!finite(v) || v <= 0) fail(`시스 ${k} 비정상`, c, `${k}=${v}`);
  }
  if (sh.collisional !== (sh.ratio > 1)) fail('collisional 플래그가 비와 어긋남', c);
  /* CCP 단일 RF 는 어떤 조건에서도 무충돌 시스를 못 만든다 — 이 화면의 핵심 주장이다.
     압력이 모델 범위(30~200)를 벗어난 극단 입력은 제외한다. */
  if (typeof power === 'number' && pressure >= 30 && pressure <= 200 && sh.ratio < 3) {
    fail('CCP 인데 시스가 거의 무충돌', c, `s/λ=${sh.ratio.toFixed(2)}`);
  }

  // ── 소스/바이어스 분리 ──
  if (typeof power === 'object') {
    const onlySource = { ...power, source: power.source + 400 };
    const onlyBias = { ...power, bias: power.bias + 400 };
    // 소스를 올려도 이방도는 그대로여야 한다 (이온이 많아질 뿐 곧아지지 않는다)
    const a0 = et.calculateProfile(target, gas, power, pressure).anisotropy;
    const aS = et.calculateProfile(target, gas, onlySource, pressure).anisotropy;
    if (Math.abs(aS - a0) > 1e-12) fail('소스가 이방도를 바꿈', c);
    // 바이어스를 올리면 이방도는 오르거나 같아야 한다
    const aB = et.calculateProfile(target, gas, onlyBias, pressure).anisotropy;
    if (aB < a0 - 1e-9 && et.calculateProfile(target, gas, power, pressure).hasEtchant) {
      fail('바이어스↑ 인데 이방도↓', c);
    }
    // 소스를 올려도 선택비는 그대로여야 한다
    const s0 = et.calculateSelectivity(target, gas, power, pressure, half);
    const sS = et.calculateSelectivity(target, gas, onlySource, pressure, half);
    if (Math.abs(sS - s0) > 1e-12) fail('소스가 선택비를 바꿈', c);
    // 소스=바이어스인 객체는 같은 숫자와 완전히 같아야 한다
    const w = power.source;
    const same = { source: w, bias: w, type: 'ccp' };
    if (Math.abs(et.calculateEtchRate(target, gas, same, pressure, half)
                 - et.calculateEtchRate(target, gas, w, pressure, half)) > 1e-9) {
      fail('소스=바이어스 객체가 숫자와 다름', c);
    }
  }

  // ── ARDE ──
  if (et.calculateArdeFactor(0, p.ionShare) !== 1) fail('AR=0 에서 감속', c);
  let prev = Infinity;
  for (const ar of [0, 0.5, 1, 3, 10, 50]) {
    const f = et.calculateArdeFactor(ar, p.ionShare);
    if (!finite(f) || f <= 0 || f > 1) fail('ARDE 범위', c, `AR=${ar} f=${f}`);
    if (f > prev + 1e-12) fail('ARDE 단조성', c, `AR=${ar}`);
    prev = f;
  }

  // ── 런 적분 ──
  const secs = 30 + Math.round(rnd() * 900);
  const cd = target === 'PR' ? Infinity : 50 + Math.round(rnd() * 950);
  const r = et.simulateEtchRun({ rate, seconds: secs, filmThickness: 500,
                                 trenchWidth: cd, profile: p, selectivity: sel });
  if (![r.depth, r.filmEtched, r.underlayerLoss, r.remainingFilm, r.endRate].every(finite)) {
    fail('런 결과 비유한', c);
  }
  if (Math.abs(r.depth - (r.filmEtched + r.underlayerLoss)) > 1e-9) fail('깊이 = 막 + 하부층 위배', c);
  if (r.filmEtched < 0 || r.filmEtched > 500 + 1e-9) fail('막 식각량 범위', c, `${r.filmEtched}`);
  if (r.underlayerLoss < 0) fail('하부층 손실 음수', c);
  if (r.remainingFilm < 0) fail('잔막 음수', c);
  if (r.punchThroughTime === null && r.underlayerLoss > 1e-9) fail('관통 전인데 하부층이 깎임', c);
  if (r.punchThroughTime !== null && r.remainingFilm > 1e-9) fail('관통했는데 잔막이 남음', c);
  if (r.punchThroughTime !== null && (r.punchThroughTime < 0 || r.punchThroughTime > secs + 1e-6)) {
    fail('관통 시각이 런 구간 밖', c, `${r.punchThroughTime}/${secs}`);
  }
  if (rate === 0 && r.depth !== 0) fail('식각률 0 인데 깎임', c);
  if (!p.hasEtchant && p.profileType !== 'none') fail('식각종이 없는데 프로파일을 판정함', c, p.profileType);
  if (!p.hasEtchant && rate > 0) fail('식각종이 없는데 식각률이 있음', c, `rate=${rate}`);
  if (r.endRate > rate + 1e-9) fail('종료 식각률이 초기보다 큼', c);

  // 시간 단조성
  const r2 = et.simulateEtchRun({ rate, seconds: secs * 2, filmThickness: 500,
                                  trenchWidth: cd, profile: p, selectivity: sel });
  if (r2.depth < r.depth - 1e-9) fail('시간을 늘렸는데 얕아짐', c);

  // 하부층은 막보다 빨리 깎이면 안 된다 (선택비 ≥ 1)
  if (r.punchThroughTime !== null) {
    const overT = secs - r.punchThroughTime;
    if (overT > 1 && r.underlayerLoss > (rate / 60) * overT + 1e-6) {
      fail('하부층이 막보다 빨리 깎임', c);
    }
  }
}

// ── 파라미터별 단조성 (다른 값 고정) ──
console.log('■ 무작위', N.toLocaleString(), '건 불변식 검사  (시드', SEED0 + ')');
const mono = [];
for (let k = 0; k < 3000; k++) {
  const c = randomCase();
  const g = { ...c.gas };

  // 압력 ↑ → 이방도 ↓ (다른 조건 고정)
  let prevA = Infinity;
  for (const P of [30, 60, 100, 150, 200, 400]) {
    const pr = et.calculateProfile(c.target, g, c.power, P);
    if (!pr.hasEtchant) continue;
    const a = pr.anisotropy;
    if (a > prevA + 1e-9) { mono.push(`압력↑ 인데 이방도↑ (${c.target} W=${c.power} P=${P})`); break; }
    prevA = a;
  }
  // Ar ↑ → 이방도 ↑
  let prevB = -Infinity;
  for (const Ar of [0, 20, 50, 80, 120]) {
    const pb = et.calculateProfile(c.target, { ...g, Ar }, c.power, c.pressure);
    if (!pb.hasEtchant) continue;
    const a = pb.anisotropy;
    if (a < prevB - 1e-9) { mono.push(`Ar↑ 인데 이방도↓ (${c.target} P=${c.pressure})`); break; }
    prevB = a;
  }
  /* 폴리머 가스 ↑ → 이방도 ↑.
     이방도는 수평/수직 식각률의 비이므로 **식각이 일어날 때만** 정의된다.
     식각종이 없는 조건은 0/0 이라 비교 대상이 아니다. */
  let prevC = -Infinity;
  for (const HBr of [0, 20, 50, 90]) {
    const pr = et.calculateProfile(c.target, { ...g, HBr }, c.power, c.pressure);
    if (!pr.hasEtchant) { if (pr.profileType !== 'none') mono.push(`식각종 없는데 판정이 ${pr.profileType}`); continue; }
    if (pr.anisotropy < prevC - 1e-9) { mono.push(`HBr↑ 인데 이방도↓ (${c.target} P=${c.pressure})`); break; }
    prevC = pr.anisotropy;
  }
  // 파워 ↑ → 이방도 ↑ (이온 비중이 커지므로)
  let prevD = -Infinity;
  for (const W of [50, 150, 400, 800, 1500]) {
    const pd = et.calculateProfile(c.target, g, W, c.pressure);
    if (!pd.hasEtchant) continue;
    const a = pd.anisotropy;
    if (a < prevD - 1e-9) { mono.push(`파워↑ 인데 이방도↓ (${c.target} P=${c.pressure})`); break; }
    prevD = a;
  }
  if (mono.length > 6) break;
}

// ── 화학 상식 ──
const chem = [];
const G = (o) => ({ Cl2: 0, HBr: 0, CF4: 0, CHF3: 0, O2: 0, Ar: 0, ...o });
for (const P of [30, 60, 100, 150, 200]) {
  for (const Ar of [0, 40, 80]) {
    const cl = et.calculateProfile('Si', G({ Cl2: 40, Ar }), 400, P);
    const f = et.calculateProfile('Si', G({ CF4: 40, Ar }), 400, P);
    if (f.lateralRatio <= cl.lateralRatio) chem.push(`불소가 염소보다 측면을 덜 깎음 (P=${P} Ar=${Ar})`);
    const ox = et.calculateProfile('SiO2', G({ CF4: 40, Ar }), 400, P);
    if (ox.lateralRatio >= f.lateralRatio) chem.push(`산화막이 실리콘보다 불소에 더 등방 (P=${P} Ar=${Ar})`);
  }
}

// ── 트렌치 형상이 스스로 닫히는가 ──
const geom = [];
for (let k = 0; k < 5000; k++) {
  const c = randomCase();
  if (c.target === 'PR') continue;
  const p = et.calculateProfile(c.target, c.gas, c.power, c.pressure);
  /* 화면이 그리는 측벽 반폭:
       halfWidthAt(u) = 개구부반폭 + U·(1−u) − T·u + B·sin(πu)
     바닥(u=1)에서는 언더컷도 보잉도 0 이 되어 개구부반폭 − T 만 남는다.
     그 값이 0 이하면 트렌치가 스스로 닫힌다는 뜻이고, 그건 etch stop 이어야 한다. */
  const halfOpen = 31;                       // 화면 기본 CD 500nm 의 반폭(px)
  const d = 62;                              // 막 두께(px)
  const bottom = halfOpen - p.taperRatio * d;
  if (bottom <= 0 && !p.etchStop) {
    geom.push(`테이퍼가 트렌치를 닫는데 etch stop 이 아님 (${c.target} P=${c.pressure} CHF3=${c.gas.CHF3} HBr=${c.gas.HBr}) 바닥반폭=${bottom.toFixed(1)}px`);
  }
}


/* ─────────── 화면에서 실제로 만질 수 있는 공간 ───────────
   위 검사는 예전 파라미터 공간(압력 30~200, 파워 100~800)을 뽑는다. 그런데 지금
   화면의 두 모드는 4~80 mTorr 에서 소스와 바이어스를 따로 돌린다. 학생이 실제로
   만들 수 있는 레시피를 뽑아서, **화면에 뜨는 값 전부**가 성립하는지 본다. */
const MODE_SPACE = {
  게이트: {
    type: 'icp', target: 'Si', film: 200, under: 2,
    r: { source: [250, 1500], bias: [20, 250], pressure: [4, 60], cd: [30, 250], time: [10, 300] },
    g: { Cl2: [0, 200], HBr: [0, 200], O2: [0, 200] },
  },
  콘택: {
    type: 'dfccp', target: 'SiO2', film: 500, under: 60,
    r: { source: [300, 1500], bias: [300, 3000], pressure: [20, 80], cd: [40, 200], time: [30, 600] },
    g: { C4F8: [0, 200], CHF3: [0, 200], Ar: [0, 200], O2: [0, 200] },
  },
};
const between = ([lo, hi]) => lo + rnd() * (hi - lo);
const modeFails = new Map();
const mfail = (rule, tag) => {
  if (!modeFails.has(rule)) modeFails.set(rule, []);
  if (modeFails.get(rule).length < 3) modeFails.get(rule).push(tag);
};

let modeCases = 0;
for (const [mname, M] of Object.entries(MODE_SPACE)) {
  for (let k = 0; k < 10000; k++) {
    modeCases += 1;
    const b = {};
    for (const key of Object.keys(M.r)) b[key] = between(M.r[key]);
    const gas = { Cl2: 0, HBr: 0, CF4: 0, C4F8: 0, CHF3: 0, O2: 0, Ar: 0 };
    for (const key of Object.keys(M.g)) gas[key] = between(M.g[key]);
    const d = { source: b.source, bias: b.bias, type: M.type };
    const tag = `${mname} P=${b.pressure.toFixed(0)} src=${b.source.toFixed(0)} bias=${b.bias.toFixed(0)} `
      + Object.keys(M.g).map((x) => `${x}${gas[x].toFixed(0)}`).join(',');

    const prof = et.calculateProfile(M.target, gas, d, b.pressure);
    const rate = et.calculateEtchRate(M.target, gas, d, b.pressure, half);
    const sel = et.calculateSelectivity(M.target, gas, d, b.pressure, half);
    const uni = et.calculateUniformity(b.pressure, d, gas);
    const plasma = et.sheathCollisionality(b.pressure, d);
    const run = et.simulateEtchRun({
      rate, seconds: b.time, filmThickness: M.film, trenchWidth: b.cd,
      profile: prof, selectivity: sel,
    });

    // 화면에 그대로 뜨는 값들 — 하나라도 NaN 이면 칸이 비거나 "NaN" 이 보인다
    const shown = {
      식각률: rate, 선택비: sel, 균일도: uni, 측벽각: prof.sidewallAngle,
      이방도: prof.anisotropy, 플럭스: plasma.density, 이온에너지: plasma.energy,
      시스비: plasma.ratio, 자유행로: plasma.mfp, 시스두께: plasma.sheath,
      깊이: run.depth, 잔막: run.remainingFilm, 하부층손실: run.underlayerLoss,
      종료식각률: run.endRate,
    };
    for (const [key, v] of Object.entries(shown)) {
      if (!finite(v)) mfail(`화면 값 ${key} 가 유한하지 않다`, tag);
      if (v < 0) mfail(`화면 값 ${key} 가 음수`, tag);
    }

    // 지도 좌표 — log10 이 들어가므로 밀도가 0 이면 -Infinity 가 된다
    if (!(plasma.density > 0) || !finite(Math.log10(plasma.density))) {
      mfail('이온 지도 x 좌표가 정의되지 않는다', tag);
    }

    // 측벽각은 0~90° 안이어야 그림이 그려진다
    if (prof.sidewallAngle <= 0 || prof.sidewallAngle > 90) mfail('측벽각이 0~90° 밖', tag);

    // 판정 이름은 화면이 아는 다섯 중 하나여야 한다
    if (!['none', 'etch-stop', 'isotropic', 'tapered', 'undercut', 'vertical'].includes(prof.profileType)) {
      mfail(`알 수 없는 판정 이름 ${prof.profileType}`, tag);
    }

    // 하부층 예산 — 관통 전에는 하부층이 깎이지 않는다
    if (run.punchThroughTime === null && run.underlayerLoss > 1e-9) mfail('관통 전 하부층 손실', tag);

    // 깊이는 막 + 하부층
    if (Math.abs(run.depth - (run.filmEtched + run.underlayerLoss)) > 1e-9) mfail('깊이 ≠ 막 + 하부층', tag);

    // 식각종이 없으면 식각률도 0 이고 판정도 none
    if (!prof.hasEtchant && (rate > 0 || prof.profileType !== 'none')) {
      mfail('식각종 없는데 식각률/판정이 있음', tag);
    }
    // 식각종이 있는데 식각률이 0 이면 두 함수가 어긋난 것이다 (HBr 이 그랬다)
    if (prof.hasEtchant && rate === 0 && !prof.etchStop) {
      mfail('식각종 있는데 식각률 0 (함수 간 불일치)', tag);
    }

    // 한 노브만 흔들었을 때의 방향 — 교과서 관계가 국소적으로도 성립하는가
    const aBase = prof.anisotropy;
    const aSrc = et.calculateProfile(M.target, gas, { ...d, source: b.source + 200 }, b.pressure).anisotropy;
    if (Math.abs(aSrc - aBase) > 1e-12) mfail('소스가 이방도를 바꿈', tag);
    const sBase = sel;
    const sSrc = et.calculateSelectivity(M.target, gas, { ...d, source: b.source + 200 }, b.pressure, half);
    if (Math.abs(sSrc - sBase) > 1e-12) mfail('소스가 선택비를 바꿈', tag);
    if (prof.hasEtchant) {
      const aBias = et.calculateProfile(M.target, gas, { ...d, bias: b.bias + 100 }, b.pressure).anisotropy;
      if (aBias < aBase - 1e-9) mfail('바이어스↑ 인데 이방도↓', tag);
    }
    const rSrc = et.calculateEtchRate(M.target, gas, { ...d, source: b.source + 200 }, b.pressure, half);
    if (rate > 0 && rSrc < rate - 1e-9) mfail('소스↑ 인데 식각률↓', tag);
  }
}

console.log('\n════ 결과 ════');
if (fails.size === 0) console.log('  불변식 위배: 없음');
for (const [rule, ex] of fails) { console.log(`  ⚠ ${rule} (${ex.length}+ 건)`); ex.forEach((e) => console.log(`      ${e}`)); }
console.log('\n  단조성 위배:', mono.length ? '' : '없음');
[...new Set(mono)].slice(0, 6).forEach((m) => console.log('   ⚠', m));
console.log('\n  화학 상식 위배:', chem.length ? '' : '없음');
[...new Set(chem)].slice(0, 6).forEach((m) => console.log('   ⚠', m));
console.log('\n  형상 자기모순:', geom.length ? '' : '없음');
[...new Set(geom)].slice(0, 4).forEach((m) => console.log('   ⚠', m));

console.log(`\n  모드 공간 ${modeCases.toLocaleString()} 건 (화면에서 만질 수 있는 범위):`,
  modeFails.size === 0 ? '위배 없음' : '');
for (const [rule, ex] of modeFails) {
  console.log(`   ⚠ ${rule}`);
  ex.forEach((e) => console.log(`       ${e}`));
}

const totalFail = fails.size + mono.length + chem.length + geom.length + modeFails.size;
process.exit(totalFail === 0 ? 0 : 1);
