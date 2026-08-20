/**
 * 교과서 대조 — 이 모델이 건식 식각 교과서의 서술을 재현하는가.
 *
 * 앞선 검사들과 목적이 다르다.
 *   verify-physics    문헌 앵커 몇 점의 **값**이 맞는가
 *   stress-etching    조건과 무관하게 성립해야 할 **불변식**이 깨지지 않는가
 *   여기               교과서가 말하는 **관계**가 화면의 조절 범위 안에서 성립하는가
 *
 * "관계" 로 한정한 것이 핵심이다. 이 모델은 경험식이라 절대값은 장비마다 달라지지만,
 * 학생이 배워야 할 것은 "무엇을 올리면 무엇이 어떻게 되는가" 다. 그것이 틀리면
 * 데모로서 실패고, 그것이 맞으면 절대값이 몇 % 어긋나도 교육용으로는 성립한다.
 *
 * 각 항목은 **화면에서 실제로 돌릴 수 있는 범위** 안에서만 검사한다. 범위 밖에서
 * 성립하는지는 학생이 볼 수 없으므로 묻지 않는다.
 *
 *   node scripts/verify-textbook.mjs
 */
import * as et from '../src/physics/etching.js';

const half = () => 0.5;
const G = (o) => ({ Cl2: 0, HBr: 0, CF4: 0, C4F8: 0, CHF3: 0, O2: 0, Ar: 0, ...o });

/* EtchingBay.jsx 의 MODES 와 같은 값. 화면에서 열려 있는 범위가 검사 구간이다. */
const MODES = {
  게이트: {
    type: 'icp', target: 'Si', film: 200, under: 2,
    base: { source: 850, bias: 120, pressure: 8, cd: 90, time: 60 },
    gas: { Cl2: 70, HBr: 120, O2: 5 },
    range: { source: [250, 1500], bias: [20, 250], pressure: [4, 60], cd: [30, 250], time: [10, 300] },
    gasRange: { Cl2: [0, 200], HBr: [0, 200], O2: [0, 200] },
  },
  콘택: {
    type: 'dfccp', target: 'SiO2', film: 500, under: 60,
    base: { source: 300, bias: 500, pressure: 20, cd: 60, time: 300 },
    gas: { C4F8: 30, CHF3: 5, Ar: 60, O2: 8 },
    range: { source: [300, 1500], bias: [300, 3000], pressure: [20, 80], cd: [40, 200], time: [30, 600] },
    gasRange: { C4F8: [0, 200], CHF3: [0, 200], Ar: [0, 200], O2: [0, 200] },
  },
};

/** 한 파라미터만 흔들면서 나머지는 모드 기본값으로 고정한 표본들. */
function sweep(M, knob, n = 25) {
  const [lo, hi] = M.range[knob] || M.gasRange[knob];
  const out = [];
  for (let i = 0; i <= n; i++) {
    const v = lo + ((hi - lo) * i) / n;
    const b = { ...M.base };
    const gas = { ...M.gas };
    if (knob in M.base) b[knob] = v;
    else gas[knob] = v;
    const d = { source: b.source, bias: b.bias, type: M.type };
    const g = G(gas);
    const prof = et.calculateProfile(M.target, g, d, b.pressure);
    const rate = et.calculateEtchRate(M.target, g, d, b.pressure, half);
    out.push({
      v,
      rate,
      sel: et.calculateSelectivity(M.target, g, d, b.pressure, half),
      uni: et.calculateUniformity(b.pressure, d, g),
      prof,
      plasma: et.sheathCollisionality(b.pressure, d),
      run: et.simulateEtchRun({
        rate, seconds: b.time, filmThickness: M.film,
        trenchWidth: b.cd, profile: prof, selectivity: et.calculateSelectivity(M.target, g, d, b.pressure, half),
      }),
    });
  }
  return out;
}

/* 단조성 판정. 잡음 없는 결정론적 모델이므로 엄격하게 본다.
   pick 으로 뽑은 값이 전 구간에서 오르기만/내리기만 하는지 확인한다. */
const trend = (rows, pick) => {
  let up = true, down = true;
  for (let i = 1; i < rows.length; i++) {
    const a = pick(rows[i - 1]), b = pick(rows[i]);
    if (b < a - 1e-9) up = false;
    if (b > a + 1e-9) down = false;
  }
  return up && down ? 'flat' : up ? 'up' : down ? 'down' : 'mixed';
};

const results = [];
const check = (claim, where, pass, detail) =>
  results.push({ claim, where, pass, detail });

/* ─────────────────────── 교과서 서술 ─────────────────────── */

for (const [name, M] of Object.entries(MODES)) {
  const gasKeys = Object.keys(M.gasRange);
  const polymerGas = name === '게이트' ? 'HBr' : 'C4F8';
  const etchGas = name === '게이트' ? 'Cl2' : 'C4F8';

  // ① 파워를 올리면 식각률이 오른다
  {
    const s = sweep(M, 'source');
    check('① 소스 파워↑ → 식각률↑', name, trend(s, (r) => r.rate) === 'up',
      `${s[0].rate.toFixed(0)} → ${s.at(-1).rate.toFixed(0)} nm/min`);
  }

  // ② 이온 에너지(바이어스)를 올리면 이방성이 오른다
  {
    const s = sweep(M, 'bias');
    check('② 바이어스↑ → 이방도↑', name, trend(s, (r) => r.prof.anisotropy) === 'up',
      `A ${s[0].prof.anisotropy.toFixed(3)} → ${s.at(-1).prof.anisotropy.toFixed(3)}`);
  }

  // ③ 이온 에너지를 올리면 선택비가 떨어진다 (물리 스퍼터가 우세해진다)
  {
    const s = sweep(M, 'bias');
    const t = trend(s, (r) => r.sel);
    check('③ 바이어스↑ → 선택비↓', name, t === 'down' || t === 'flat',
      `${s[0].sel.toFixed(1)} → ${s.at(-1).sel.toFixed(1)} : 1${t === 'flat' ? ' (문턱 아래라 변화 없음)' : ''}`);
  }

  // ④ 소스는 이온을 많이 보낼 뿐 곧게 만들지 않는다 (이방도 불변)
  {
    const s = sweep(M, 'source');
    check('④ 소스↑ → 이방도 불변 (많이 ≠ 세게)', name,
      trend(s, (r) => r.prof.anisotropy) === 'flat',
      `A ${s[0].prof.anisotropy.toFixed(3)} → ${s.at(-1).prof.anisotropy.toFixed(3)}`);
  }

  // ⑤ 압력을 올리면 시스 충돌이 늘어 이방성이 떨어진다
  {
    const s = sweep(M, 'pressure');
    check('⑤ 압력↑ → 이방도↓', name, trend(s, (r) => r.prof.anisotropy) === 'down',
      `A ${s[0].prof.anisotropy.toFixed(3)} → ${s.at(-1).prof.anisotropy.toFixed(3)}`);
  }

  // ⑥ 압력을 올리면 시스 충돌도가 커진다
  {
    const s = sweep(M, 'pressure');
    check('⑥ 압력↑ → 시스 충돌도 s/λ↑', name, trend(s, (r) => r.plasma.ratio) === 'up',
      `s/λ ${s[0].plasma.ratio.toFixed(2)} → ${s.at(-1).plasma.ratio.toFixed(2)}`);
  }

  // ⑦ 폴리머 가스를 올리면 이방성이 오른다 (측벽 보호)
  {
    const s = sweep(M, polymerGas).filter((r) => r.prof.hasEtchant && r.rate > 0);
    check(`⑦ ${polymerGas}↑ → 이방도↑ (측벽 폴리머)`, name,
      s.length > 2 && trend(s, (r) => r.prof.anisotropy) === 'up',
      `A ${s[0]?.prof.anisotropy.toFixed(3)} → ${s.at(-1)?.prof.anisotropy.toFixed(3)}`);
  }

  // ⑧ 패시베이션 가스는 정점을 갖는다 — 처음엔 돕고, 과하면 식각을 누른다
  {
    const s = sweep(M, polymerGas);
    const peak = s.reduce((a, b) => (b.rate > a.rate ? b : a));
    const [lo, hi] = M.gasRange[polymerGas];
    const interior = peak.v > lo + 1e-9 && peak.v < hi - 1e-9;
    check(`⑧ ${polymerGas} 은 정점을 갖는다 (돕다가 누른다)`, name,
      interior && s.at(-1).rate < peak.rate * 0.9,
      `정점 ${peak.v.toFixed(0)} sccm ${peak.rate.toFixed(0)} → 끝단 ${s.at(-1).rate.toFixed(0)} nm/min`);
  }

  // ⑧-2 패시베이션 가스를 올리면 선택비가 오른다
  {
    const s = sweep(M, polymerGas).filter((r) => r.rate > 0);
    check(`⑧-2 ${polymerGas}↑ → 선택비↑`, name,
      trend(s, (r) => r.sel) === 'up',
      `${s[0].sel.toFixed(1)} → ${s.at(-1).sel.toFixed(1)} : 1`);
  }

  // ⑨ 시간이 깊이를 정한다 — 관통 전까지 선형
  {
    const d = { source: M.base.source, bias: M.base.bias, type: M.type };
    const g = G(M.gas);
    const prof = et.calculateProfile(M.target, g, d, M.base.pressure);
    const rate = et.calculateEtchRate(M.target, g, d, M.base.pressure, half);
    const sel = et.calculateSelectivity(M.target, g, d, M.base.pressure, half);
    const at = (sec) => et.simulateEtchRun({
      rate, seconds: sec, filmThickness: M.film, trenchWidth: Infinity, profile: prof, selectivity: sel,
    }).depth;
    // 종횡비 효과를 뺀 상태(trenchWidth=Infinity)에서 깊이는 시간에 비례해야 한다
    /* 관통 뒤에는 하부층으로 넘어가 기울기가 선택비만큼 꺾인다. 선형은 관통 **전**
       구간의 서술이므로, 막을 다 뚫는 시간의 1/4·1/2 지점에서 본다. */
    const punchT = et.simulateEtchRun({
      rate, seconds: 1e6, filmThickness: M.film, trenchWidth: Infinity, profile: prof, selectivity: sel,
    }).punchThroughTime;
    const t1 = punchT / 4, t2 = punchT / 2;
    const d1 = at(t1), d2 = at(t2);
    check('⑨ 깊이 = 식각률 × 시간 (관통 전, ARDE 없이)', name,
      Math.abs(d2 - 2 * d1) < 0.01 * d2,
      `${t1.toFixed(1)}s ${d1.toFixed(1)} nm · ${t2.toFixed(1)}s ${d2.toFixed(1)} nm (관통 ${punchT.toFixed(1)}s)`);
  }

  // ⑩ 종횡비가 커지면 식각이 느려진다 (ARDE / RIE lag)
  {
    const s = sweep(M, 'cd');
    // CD 를 넓히면 종횡비가 작아지므로 종료 식각률이 올라야 한다
    check('⑩ CD↑ (종횡비↓) → 종료 식각률↑ · ARDE', name,
      trend(s, (r) => r.run.endRate) === 'up',
      `CD ${s[0].v.toFixed(0)}nm ${s[0].run.endRate.toFixed(0)} → CD ${s.at(-1).v.toFixed(0)}nm ${s.at(-1).run.endRate.toFixed(0)} nm/min`);
  }

  // ⑪ 선택비 × 하부층 두께 = 오버에치 여유
  {
    const d = { source: M.base.source, bias: M.base.bias, type: M.type };
    const g = G(M.gas);
    const prof = et.calculateProfile(M.target, g, d, M.base.pressure);
    const rate = et.calculateEtchRate(M.target, g, d, M.base.pressure, half);
    const sel = et.calculateSelectivity(M.target, g, d, M.base.pressure, half);
    // 하부층을 정확히 다 깎는 데 걸리는 오버에치 시간을 이분법으로 찾는다
    const loss = (sec) => et.simulateEtchRun({
      rate, seconds: sec, filmThickness: M.film, trenchWidth: Infinity, profile: prof, selectivity: sel,
    }).underlayerLoss;
    let lo = 0, hi = 20000;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (loss(mid) < M.under) lo = mid; else hi = mid;
    }
    const punch = et.simulateEtchRun({
      rate, seconds: 20000, filmThickness: M.film, trenchWidth: Infinity, profile: prof, selectivity: sel,
    }).punchThroughTime;
    const overSec = lo - punch;
    // 이론값: 하부층두께 ÷ (식각률/선택비)
    const theory = M.under / (rate / sel / 60);
    check('⑪ 오버에치 여유 = 하부층두께 × 선택비 ÷ 식각률', name,
      Math.abs(overSec - theory) / theory < 0.02,
      `실측 ${overSec.toFixed(1)}s · 이론 ${theory.toFixed(1)}s (선택비 ${sel.toFixed(1)}:1, 하부층 ${M.under}nm)`);
  }

  // ⑫ 이방도의 정의 — A = 1 − (측면 식각률 / 수직 식각률)
  {
    const s = sweep(M, 'bias');
    check('⑫ A = 1 − 측면/수직 (정의 일관)', name,
      s.every((r) => Math.abs(r.prof.anisotropy - (1 - r.prof.lateralRatio)) < 1e-12),
      '전 구간 일치');
  }

  // ⑬ 균일도가 운전 창 안에서 실용 범위에 있다
  {
    const s = sweep(M, 'pressure');
    const inWin = s.filter((r) => r.v <= (name === '게이트' ? 12 : 47));
    check('⑬ 표준 공정 창에서 균일도 ≥ 80%', name,
      inWin.every((r) => r.uni >= 80),
      `${Math.min(...inWin.map((r) => r.uni)).toFixed(0)}~${Math.max(...inWin.map((r) => r.uni)).toFixed(0)}%`);
  }

  // ⑭ 가스가 없으면 식각도 없다
  {
    const d = { source: M.base.source, bias: M.base.bias, type: M.type };
    const p = et.calculateProfile(M.target, G({ Ar: 50 }), d, M.base.pressure);
    check('⑭ 식각종이 없으면 식각이 없다', name,
      !p.hasEtchant && p.profileType === 'none'
      && et.calculateEtchRate(M.target, G({ Ar: 50 }), d, M.base.pressure, half) === 0,
      `판정 "${p.profileType}"`);
  }

  // ⑭-2 식각종이 있으면 식각률도 있어야 한다 (두 함수가 어긋나지 않는가)
  {
    const d = { source: M.base.source, bias: M.base.bias, type: M.type };
    const bad = [];
    for (const k of Object.keys(M.gasRange)) {
      /* 가스를 하나씩만 흘려 본다. 프로파일이 "식각된다" 는데 식각률이 0 이면
         두 함수가 서로 다른 말을 하는 것이다 — 실제로 HBr 이 그랬다. */
      const g = G({ [k]: 100 });
      const p = et.calculateProfile(M.target, g, d, M.base.pressure);
      const r = et.calculateEtchRate(M.target, g, d, M.base.pressure, half);
      if (p.hasEtchant && r <= 0) bad.push(`${k} 단독: 판정 "${p.profileType}" 인데 0 nm/min`);
    }
    check('⑭-2 식각종이 있으면 식각률도 있다 (함수 간 일관)', name,
      bad.length === 0, bad.length ? bad.join(' · ') : '단독 가스 전부 일관');
  }

  void gasKeys; void etchGas;
}

/* ─────────── 모드를 가로지르는 서술 ─────────── */

// ⑮ 불소는 실리콘을 저절로 깎는다(등방), 염소는 이온이 있어야 깎는다(이방)
{
  const d = { source: 850, bias: 120, type: 'icp' };
  const f = et.calculateProfile('Si', G({ CF4: 60 }), d, 8);
  const cl = et.calculateProfile('Si', G({ Cl2: 60, HBr: 120 }), d, 8);
  check('⑮ F+Si 는 등방, Cl+Si 는 이방', '공통',
    f.profileType === 'isotropic' && cl.profileType === 'vertical',
    `CF₄ ${f.sidewallAngle.toFixed(0)}° "${f.profileType}" · Cl₂/HBr ${cl.sidewallAngle.toFixed(0)}° "${cl.profileType}"`);
}

// ⑯ ICP 는 무충돌 시스, CCP 는 충돌 시스 — 도전막 식각이 ICP 로 간 이유
{
  const icp = et.sheathCollisionality(8, { source: 850, bias: 120, type: 'icp' });
  let ccpMin = Infinity;
  for (let p = 30; p <= 200; p += 5) {
    for (let w = 100; w <= 800; w += 50) {
      ccpMin = Math.min(ccpMin, et.sheathCollisionality(p, w).ratio);
    }
  }
  check('⑯ ICP 무충돌(s/λ<1) · CCP 는 전 구간 충돌', '공통',
    icp.ratio < 1 && ccpMin > 1,
    `ICP ${icp.ratio.toFixed(2)} · CCP 최소 ${ccpMin.toFixed(2)}`);
}

// ⑰ 게이트는 이온 많이·약하게, 콘택은 적게·세게
{
  const gate = et.sheathCollisionality(8, { source: 850, bias: 120, type: 'icp' });
  const cont = et.sheathCollisionality(20, { source: 300, bias: 500, type: 'dfccp' });
  check('⑰ 게이트 = 플럭스↑·에너지↓ / 콘택 = 플럭스↓·에너지↑', '공통',
    gate.density > cont.density && gate.energy < cont.energy,
    `게이트 ${gate.density.toExponential(1)} · ${gate.energy.toFixed(0)}eV | 콘택 ${cont.density.toExponential(1)} · ${cont.energy.toFixed(0)}eV`);
}

// ⑱ 산화막은 Si–O 결합 때문에 실리콘보다 높은 이온 에너지를 요구한다 → 콘택 바이어스가 크다
{
  const gateBias = MODES.게이트.base.bias, contBias = MODES.콘택.base.bias;
  check('⑱ 콘택 바이어스 > 게이트 바이어스', '공통', contBias > gateBias * 3,
    `${gateBias} W vs ${contBias} W`);
}

/* ─────────────────────── 보고 ─────────────────────── */

console.log('■ 교과서 대조 — 화면에서 돌릴 수 있는 범위 안에서만 검사\n');
let fail = 0;
let lastClaim = '';
for (const r of results) {
  if (r.claim !== lastClaim) { console.log(''); lastClaim = r.claim; }
  if (!r.pass) fail += 1;
  console.log(`  ${r.pass ? '✓' : '✗'} ${r.claim}`.padEnd(52) + `[${r.where}] ${r.detail}`);
}
console.log(`\n${'─'.repeat(72)}`);
console.log(fail === 0
  ? `  ${results.length} 개 서술 전부 재현됨`
  : `  ⚠ ${fail} / ${results.length} 개 서술이 재현되지 않음`);
process.exit(fail === 0 ? 0 : 1);
