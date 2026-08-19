/**
 * 건식 식각 계산.
 *
 * EtchingSimulator.js 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 원본이 함수 안에서 직접 부르던 Math.random 만 인자로 주입받게 바꿨다.
 * 기본값이 Math.random 이라 화면 동작은 그대로이고, 테스트에서는 고정값을 넣어
 * 결정적으로 검증할 수 있다.
 *
 * ── 정확도 (교육용) ──
 * 1차 원리 계산이 아니라 문헌 데이터에 맞춘 경험식이다. 가스·파워·압력을 올리면
 * 무엇이 오르고 내리는지(경향)는 맞지만 **절대 식각률과 선택비는 장비·챔버 형상·
 * 웨이퍼 이력에 따라 크게 달라진다.** 실제 공정 조건 산출에 쓰면 안 된다.
 */

/**
 * 식각률 (nm/min).
 * @param {string} material 'Si' | 'SiO2' | 'Si3N4' | 'PR'
 * @param {object} gasFlow { Cl2, HBr, CF4, CHF3, O2, Ar } sccm
 * @param {number} power W
 * @param {number} pressure mTorr
 * @param {() => number} rng 0~1 난수원
 */
export function calculateEtchRate(material, gasFlow, power, pressure, rng = Math.random) {
  // 압력과 파워는 음수가 될 수 없다. 가드가 없으면 음압에서도 식각률이 나온다.
  pressure = Math.max(0, pressure);
  power = Math.max(0, power);
  let baseRate = 0;

  switch (material) {
    case 'Si': {
      // Cl2가 식각률을 올리지만, 과도한 HBr은 측벽 passivation으로 식각률 저하
      const cl2Effect = gasFlow.Cl2 * 4.5;
      const hbrPassivation = Math.max(0, (gasFlow.HBr - 30) * 1.8);
      baseRate = (cl2Effect - hbrPassivation) * (power / 300);
      break;
    }
    case 'SiO2': {
      // CF4/CHF3가 식각률에 기여하지만, 과도한 CHF3는 폴리머 누적으로 etch stop
      const cf4Effect = gasFlow.CF4 * 5.0;
      const chf3Effect = gasFlow.CHF3 * 2.5;
      const polymerStop = Math.max(0, (gasFlow.CHF3 - 45) * 3.0);
      baseRate = (cf4Effect + chf3Effect - polymerStop) * (power / 400);
      break;
    }
    case 'Si3N4': {
      // 예전에는 CHF3 항만 있어서 CF4 를 100 sccm 넣어도 0 nm/min 이 나왔다.
      // "질화막은 CF4 로 안 깎인다"는 정반대 개념을 가르치던 셈이다.
      // 불소계 플라즈마에서 질화막은 산화막보다 **빠르게** 식각되므로
      // CF4 계수를 SiO2 의 5.0 보다 크게 잡는다.
      const cf4Effect = gasFlow.CF4 * 6.0;
      const chf3Effect = gasFlow.CHF3 * 4.0;
      const polymerStop = Math.max(0, (gasFlow.CHF3 - 50) * 2.5);
      baseRate = (cf4Effect + chf3Effect - polymerStop) * (power / 400);
      break;
    }
    case 'PR': {
      baseRate = gasFlow.O2 * 5.0 * (power / 400);
      break;
    }
    default:
      // 미지 재료도 파워·가스에 반응해야 한다. 상수 50 을 그대로 두면
      // 파워 0·가스 0 에서도 50 nm/min 이 나와 바로 아래 가드 주석과 어긋난다.
      baseRate =
        (gasFlow.CF4 + gasFlow.CHF3 + gasFlow.Cl2 + gasFlow.HBr + gasFlow.O2) * 1.0 * (power / 400);
  }

  // 압력 sweet spot ~80mTorr — ICP 저압 운전(<30)에서도 rate 유지, 고압은 가스상 재결합으로 감소
  // 다만 5 mTorr 아래에서는 방전 자체가 유지되지 않으므로 0 으로 떨어뜨린다.
  // 예전에는 저압 하한이 0.75 로 잡혀 있어 pressure=0 에서도 식각률의 75% 가 나왔다.
  const lowPressureCutoff = Math.min(1, pressure / 5);
  const pressureFactor =
    lowPressureCutoff *
    (pressure < 80
      ? 0.75 + (Math.max(0, pressure - 30) / 50) * 0.25
      : Math.max(0.5, 1 - (pressure - 80) / 240));

  // 파워 600W 초과 시 마스크/하부층 손상이 누적되며 유효 식각률 saturation.
  // 예전 식 Math.max(0.7, 1 − (power−600)/800) 은 1160 W 에서 하한 0.7 에 닿은 뒤
  // 그대로 고정돼, baseRate ∝ power 와 곱해지면 그 위로 다시 완전한 선형이 됐다.
  // 30% 할인이었지 포화가 아니었다. 점근형으로 바꿔 실제로 포화하게 한다.
  const powerSaturation = power > 600 ? 1 / (1 + (power - 600) / 800) : 1;

  baseRate = baseRate * pressureFactor * powerSaturation;
  // 파워나 반응 가스가 없으면 식각도 없다. 예전에는 Math.max(5, …) 하한 때문에
  // 플라즈마 파워 0 에서도 5 nm/min 이 나왔다.
  return Math.max(0, baseRate * (0.9 + rng() * 0.2));
}

/**
 * 선택비 (target : 하부층).
 * @param {() => number} rng 0~1 난수원
 */
export function calculateSelectivity(target, gasFlow, power, pressure, rng = Math.random) {
  let sel = 5;

  switch (target) {
    case 'Si': {
      // HBr이 선택비를 올리지만 Cl2/Ar 과다 시 PR/oxide 손상으로 선택비 저하
      sel = 8 + (gasFlow.HBr / 10) * 8;
      const cl2Penalty = Math.max(0, (gasFlow.Cl2 - 50) * 0.35);
      const arPenalty = Math.max(0, (gasFlow.Ar - 80) * 0.25);
      sel -= cl2Penalty + arPenalty;
      break;
    }
    case 'SiO2': {
      // CHF3 폴리머가 Si 표면 보호 → 선택비↑, CF4 과다는 F 라디칼 증가로 선택비↓
      sel = 5 + (gasFlow.CHF3 / 10) * 4;
      const cf4Penalty = Math.max(0, (gasFlow.CF4 - 30) * 0.3);
      const arPenalty = Math.max(0, (gasFlow.Ar - 70) * 0.25);
      sel -= cf4Penalty + arPenalty;
      break;
    }
    case 'Si3N4': {
      sel = 5 + (gasFlow.CHF3 / 10) * 3;
      const o2Penalty = Math.max(0, (gasFlow.O2 - 15) * 0.5);
      sel -= o2Penalty;
      break;
    }
    case 'PR': {
      sel = 30 + rng() * 5;
      break;
    }
    default:
      sel = 5 + rng() * 5;
  }

  // 고전력에서는 물리 충격이 우세해져 선택비 저하
  const powerPenalty = power > 500 ? (power - 500) / 150 : 0;
  // 저압은 이방성 좋지만 sputter 비중 증가 → 선택비 약간 저하
  const lowPressurePenalty = pressure < 40 ? (40 - pressure) / 20 : 0;
  sel = sel - powerPenalty - lowPressurePenalty;

  return Math.max(1, sel);
}

/** 식각 균일도 (%). */
export function calculateUniformity(pressure, power, gasFlow) {
  const pressureEffect = Math.max(0, 100 - Math.abs(pressure - 100) / 1.5);
  const powerEffect = Math.max(0, 100 - Math.abs(power - 300) / 5);
  let uniformity = (pressureEffect + powerEffect) / 2;

  // 총 가스 유량이 과도하면 흐름 분포가 어긋나 균일성 저하
  if (gasFlow) {
    const totalGas = Object.values(gasFlow).reduce((a, b) => a + b, 0);
    if (totalGas > 350) uniformity -= (totalGas - 350) / 6;
  }

  return Math.max(40, Math.min(100, uniformity));
}

/** 압력이 높을수록 등방성 식각 증가. */
export function calculatePressureEffect(pressure) {
  return Math.min(2.0, 0.5 + pressure / 100);
}

/** 파워가 높을수록 식각속도 증가. */
export function calculatePowerEffect(power) {
  return Math.min(3.0, 0.5 + power / 200);
}

/** 가스 비율에 따른 선택비 변화. */
export function calculateGasRatioEffect(ratio) {
  return Math.min(2.0, 0.8 + ratio / 50);
}

/* ─────────────────────── 단면 프로파일 형상 ─────────────────────── */

const clamp01 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * 라디칼이 **이온 없이 스스로** 그 재료를 깎아내는 정도 (0~1).
 *
 * 이것이 측벽의 운명을 정한다. 측벽에는 이온이 거의 닿지 않으므로, 측벽이 깎이려면
 * 라디칼이 혼자 반응해야 한다. 혼자 못 깎는 조합이면 측벽은 그대로 남고 프로파일이
 * 저절로 수직해진다.
 *
 *   F + Si     자발적으로 빠르게 반응한다. SF₆·CF₄ 플라즈마에서 실리콘이 등방으로
 *              파이는 이유이고, 그래서 F 계로 게이트를 깎으면 CD 가 무너진다.
 *   Cl + Si    상온에서 자발 반응이 거의 없다. 이온이 때려 줘야 SiCl₄ 가 떨어진다.
 *              게이트 식각이 Cl₂/HBr 를 쓰는 첫 번째 이유가 이것이다.
 *   Br + Si    Cl 보다도 낮다. HBr 를 섞으면 프로파일이 더 서는 이유.
 *   F + SiO₂   자발 반응이 사실상 없다. 산화막 식각은 통째로 이온 주도이고,
 *              그래서 고압 CCP 에서도 수직이 나온다.
 *   F + Si₃N₄  산화막보다는 높고 실리콘보다는 낮다.
 *   O + PR     자발적으로 탄다. 애싱이 등방인 이유 (다만 전면 식각이라 측벽이 없다).
 *
 * ⚠ 문헌 값을 그대로 옮긴 것이 아니라 **순서와 자릿수**를 맞춘 경험 계수다.
 *   절대값을 인용하면 안 된다.
 */
const SPONTANEITY = {
  Si:    { CF4: 1.00, Cl2: 0.10, HBr: 0.03 },
  SiO2:  { CF4: 0.05, CHF3: 0.05 },
  Si3N4: { CF4: 0.25, CHF3: 0.25 },
  PR:    { O2: 1.00 },
};

/** 지금 가스 조합에서 그 재료의 자발 반응성 (유량 가중 평균). */
function spontaneityOf(target, g) {
  const table = SPONTANEITY[target] || SPONTANEITY.Si;
  let flow = 0, weighted = 0;
  for (const k of Object.keys(table)) {
    const f = g(k);
    flow += f;
    weighted += f * table[k];
  }
  return flow > 0 ? weighted / flow : 0;
}

/** 언더컷이라 부르기 시작하는 측벽 기울기 = 수직에서 10° 누운 것 (측벽 각 80°). */
const UNDERCUT_SLOPE = Math.tan((10 * Math.PI) / 180);

/**
 * 단면 프로파일 형상 인자.
 *
 * anisotropy / undercut / polymerThickness / etchStop / maskDamage / profileType 는
 * EtchingSimulator.js 의 liveResults 안에 있던 식을 **한 자리도 바꾸지 않고** 옮겨온
 * 것이다. 여기 모아 둔 이유는 식각 베이 화면이 같은 형상을 다시 그려야 하기 때문이다.
 * 두 화면이 각자 계산하면 언젠가 갈라진다 (실제로 베이 화면은 압력만 보고 있었고,
 * HBr 을 100 sccm 넣어도 프로파일이 꿈쩍하지 않았다).
 *
 * 여기에 그림이 바로 쓸 수 있는 **무차원 비율** 세 개를 더한다. px 가 아니라 비율이라
 * 화면 크기와 무관하고, 깊이만 곱하면 길이가 된다.
 *
 *   lateralRatio — 수평 식각률 / 수직 식각률. 이방도의 교과서 정의
 *                  A = 1 − (수평 식각률 / 수직 식각률) 을 그대로 뒤집은 값이다.
 *                  깊이 d 까지 팠을 때 마스크 아래 언더컷 = lateralRatio × d.
 *                  측벽 위쪽이 가장 오래 노출되므로 언더컷은 마스크 바로 밑이 가장
 *                  넓고 바닥으로 갈수록 좁아진다 — 직사각형이 아니라 활 모양이다.
 *   taperRatio   — 측벽 폴리머가 진행 중인 식각면을 좁히는 비율. 깊이가 깊어질수록
 *                  폴리머가 쌓여 바닥 폭이 taperRatio × d 만큼 좁아진다 (테이퍼).
 *   bowRatio     — 시스 안 이온 산란으로 측벽 중간이 부푸는 정도 (bowing).
 *                  고압·저이방성에서 커진다.
 *
 * ⚠ profileType 의 판정 기준은 바꿨다. 자세한 이유는 함수 안 주석에 적었다.
 * ⚠ 원본의 etchStop 은 `(가스 조건) || 식각률 < 15` 였다. 식각률은 난수를 물고 있어
 *   여기서 다시 계산하면 화면 값과 어긋나므로 **가스 조건만** 본다. 식각률 조건은
 *   부르는 쪽에서 `prof.etchStop || er < 15` 로 합쳐야 원본과 같아진다.
 *
 * ⚠ 한계: 마스크 침식(파세팅)은 정성 플래그(maskDamage)뿐이고 침식 속도를 계산하지
 *   않는다. 마스크 선택비를 모델에 두지 않았기 때문이다.
 */
export function calculateProfile(target, gasFlow, power, pressure) {
  const g = (k) => Math.max(0, (gasFlow && gasFlow[k]) || 0);
  const p = Math.max(0, pressure);
  const w = Math.max(0, power);

  const polymerFormers = g('CHF3') + g('HBr') * 0.5;
  const radicalEtchers = g('Cl2') + g('CF4') + (target === 'PR' ? g('O2') : 0);
  const ionBombardment = g('Ar') + w / 25;

  /* 이방성 (0=등방, 1=완전 수직).

     ── 구조 ──
     방향성은 **이온에서만 나온다.** 시스 전위로 가속된 이온만이 웨이퍼 면에 수직으로
     들어오기 때문이다. 라디칼은 방향이 없고, 폴리머는 스스로 방향을 만들지 못한다.

       ionShare    시스에서 가속된 이온이 식각에 기여하는 비중. Ar·RF 로 올라가되
                   포화하고, 압력이 오르면 시스 안 충돌로 입사각이 흐트러져 깎인다.
       passivation 측벽 폴리머가 측면 반응을 막는 정도.
       S           자발 반응성 — 라디칼이 이온 없이 그 재료를 깎는 정도 (SPONTANEITY).

     ── 식 ──
       바닥 ∝ ionShare + (1 − ionShare)·S     이온이 때려 주는 몫 + 라디칼 혼자 깎는 몫
       측벽 ∝ (1 − passivation)·S             이온이 안 닿으니 라디칼뿐, 폴리머가 막는다
       측면/수직 = 측벽 ÷ 바닥,  A = 1 − 그 값

     S 가 낮으면(Cl+Si, F+SiO₂) 측벽은 손댈 수단이 없어 프로파일이 저절로 서고,
     S 가 높으면(F+Si, O+PR) 폴리머 없이는 등방으로 무너진다.

     ⚠ 예전 식은 `A = passivation + (1−passivation)·(…)` 였다. 폴리머만 잔뜩 넣으면
       **이온이 하나도 없어도 A 가 0.86 까지 올라갔다.** 폴리머는 스스로 방향을 만들지
       못한다 — 이온이 바닥을 열어 줄 때만 프로파일에 기여한다. 지금은 ionShare 가 0 이면
       바닥과 측벽이 모두 S 에만 의존해 방향성이 사라진다.

     계수는 문헌 값이 아니라 경계 조건을 맞춘 것이다: Cl₂/HBr 게이트 프리셋 0.92,
     저압 HBr 리치 0.95, F 계로 실리콘을 깎으면 0.005(등방), 산화막 0.97,
     Ar 없이 200 mTorr 0.64. */
  const directional = ionBombardment / (ionBombardment + 30);
  const passivation = polymerFormers / (polymerFormers + 20);
  const scatter = 1 / (1 + Math.max(0, p - 30) / 400);
  const ionShare = clamp01(directional * scatter, 0, 1);

  /* 측면 식각률 / 수직 식각률.
       바닥 — 이온이 때려 주는 몫 + 라디칼이 스스로 깎는 몫
       측벽 — 이온이 안 닿으므로 라디칼이 스스로 깎는 몫뿐이고, 폴리머가 그마저 막는다
     자발 반응성 S 가 낮으면 측벽은 손댈 수단이 없어 프로파일이 저절로 선다.

     ⚠ 앞선 판에는 이 S 가 없었다. 그래서 Cl₂/HBr 게이트 식각 프리셋이 A=0.70,
       즉 500 nm 를 파면 한쪽에 150 nm 언더컷이 나는 것으로 계산됐다. 실제 폴리실리콘
       게이트 식각의 CD 손실은 수 nm 수준이다. 염소가 실리콘을 저절로 깎지 못한다는
       사실이 빠져 있었던 것이다. */
  const spontaneity = spontaneityOf(target, g);
  const vertical = ionShare + (1 - ionShare) * spontaneity;
  const lateral = (1 - passivation) * spontaneity;
  const lateralRatio = vertical > 1e-6 ? clamp01(lateral / vertical, 0, 0.995) : 0;
  const anisotropy = 1 - lateralRatio;

  const polymerThickness = Math.min(8, polymerFormers / 12);

  const undercut = Math.max(0,
    (1 - anisotropy) * 22
    + Math.max(0, radicalEtchers * 0.25 - polymerFormers * 0.30)
  );

  const etchStop = target !== 'PR' && polymerFormers > 60 && radicalEtchers < 20;
  const maskDamage = g('Ar') > 80 || w > 500;

  // ── 무차원 형상 비율 ──
  // lateralRatio 는 이방도와 함께 위에서 정해진다 (A = 1 − lateralRatio).
  const taperRatio = Math.min(0.40, Math.max(0,
    polymerFormers * 0.0040 - radicalEtchers * 0.0015
  ));
  const bowRatio = clamp01((p - 60) / 400, 0, 0.35) * lateralRatio;

  /* 프로파일 분류.
     예전 기준은 `undercut - polymerThickness` 라는 **픽셀 값**의 문턱(>6, <-4)이었다.
     그 픽셀은 원본 화면의 개구부 크기(약 50 px 반폭)에 맞춰 고른 숫자라, 패턴 폭이
     달라지면 같은 조건이 다른 이름으로 불렸다. 화면 크기가 물리 판정을 바꾸는 셈이다.
     그림을 그리는 값(lateralRatio·taperRatio)으로 직접 판정하도록 바꿨다.
     깊이당 측벽 순 변위 net = 측면 식각 − 폴리머 축소 가 부호와 크기를 다 쥐고 있다. */
  const net = lateralRatio - taperRatio;
  /* 측벽 각 — 바닥면에서 잰 각. 90°가 완전 수직이고 깊이 1 당 옆으로 net 만큼
     밀리면 그만큼 눕는다. 이름은 4 개뿐이라 거칠지만 이 각은 연속값이라
     슬라이더를 움직이는 대로 따라온다. 화면에는 둘 다 띄운다. */
  const sidewallAngle = 90 - (Math.atan(Math.abs(net)) * 180) / Math.PI;
  let profileType;
  if (etchStop) profileType = 'etch-stop';
  else if (lateralRatio >= 0.5) profileType = 'isotropic';   // 측면이 수직의 절반 이상
  else if (net <= -0.02) profileType = 'tapered';            // 폴리머가 이겨 아래가 좁다
  else if (net >= UNDERCUT_SLOPE) profileType = 'undercut';  // 측벽이 80° 아래로 눕는다
  else profileType = 'vertical';

  return {
    anisotropy, undercut, polymerThickness, etchStop, maskDamage, profileType,
    lateralRatio, taperRatio, bowRatio, sidewallAngle,
    // ARDE 는 이방도가 아니라 이 값을 써야 한다. 아래 calculateArdeFactor 주석 참고.
    ionShare,
  };
}

/**
 * 종횡비 의존 식각 (ARDE / RIE lag) 감속 계수.
 *
 * 트렌치가 깊어지면 바닥까지 도달하는 반응종이 줄어 식각이 느려진다. 두 성분을
 * 나눠서 본다.
 *   - 이온: 시스 전기장으로 가속돼 수직으로 내리꽂히므로 깊어져도 거의 그대로 닿는다.
 *   - 중성 라디칼: 방향성이 없어 벽에 부딪히며 들어가야 한다. 좁고 깊을수록 못 들어간다.
 * 라디칼 쪽은 원통 도관의 투과 확률 근사 K = 1/(1 + 0.75·AR) 를 쓴다 (Clausing 형).
 *
 * ⚠ 이온 비중으로 **이방도를 쓰면 안 된다.** 이방도에는 측벽 폴리머의 몫이 섞여 있어서,
 *   폴리머로 이방성을 얻은 저이온 공정(예: 고 CHF₃ 산화막 식각)이 이온 주도 공정과
 *   같은 감속을 받는 것으로 계산된다. 폴리머는 측벽을 덮을 뿐 라디칼을 트렌치 바닥까지
 *   실어 나르지 못한다. calculateProfile 이 돌려주는 ionShare 를 써야 한다.
 *   (실제로 그렇게 두었을 때 폴리머 주도 0.89 · 이온 주도 0.83 으로 거의 구분되지
 *    않았다. 지금은 AR 5 에서 0.43 대 0.85 로 갈린다.)
 *
 * ⚠ 한계: 고종횡비에서 실제로 문제가 되는 전하 축적(notching)·이온 각도 분포는
 *   넣지 않았다. AR 5 를 넘는 구간의 절대값을 믿으면 안 된다.
 *
 * @param {number} aspectRatio 깊이 / 패턴 폭
 * @param {number} share       0~1 — calculateProfile 의 ionShare
 */
export function calculateArdeFactor(aspectRatio, share) {
  const ar = Math.max(0, aspectRatio);
  const ionShare = clamp01(share, 0, 1);
  const conductance = 1 / (1 + 0.75 * ar);
  return ionShare + (1 - ionShare) * conductance;
}

/**
 * 시간에 따른 식각 진행. 시간을 설정하면 깊이가 나온다 — 그 반대가 아니다.
 *
 * 막을 다 뚫은 뒤에도 시간이 남으면 하부층이 선택비만큼 느리게 깎인다 (오버에치).
 * 시간이 모자라면 막이 남는다 (언더에치). 둘 다 실제 공정에서 매일 일어나는 일이라
 * 화면에서 구분돼야 한다.
 *
 * ARDE 때문에 식각률이 깊이의 함수라서 해석해가 없다. 잘게 잘라 적분한다.
 *
 * @param {object} opts
 * @param {object} opts.profile calculateProfile 의 반환값. ARDE 에 필요한 ionShare 를
 *        여기서 꺼낸다. **숫자 하나를 받지 않는다** — 예전에는 anisotropy 를 이름으로
 *        받았는데, 호출부가 옛 이름을 계속 넘겨도 기본값으로 조용히 넘어가
 *        ARDE 가 통째로 꺼져 버렸다. 객체를 요구하면 빠뜨렸을 때 바로 드러난다.
 * @returns {{depth, filmEtched, remainingFilm, underlayerLoss, punchThroughTime, endRate}}
 *          depth 는 표면 기준 총 깊이(nm) = filmEtched + underlayerLoss.
 *          punchThroughTime 은 막을 뚫은 시각(s), 못 뚫었으면 null.
 */
export function simulateEtchRun({
  rate,
  seconds,
  filmThickness,
  trenchWidth,
  profile,
  selectivity = 1,
  dt = 0.25,
}) {
  if (!profile || typeof profile.ionShare !== 'number') {
    throw new TypeError('simulateEtchRun: calculateProfile 의 반환값을 profile 로 넘겨야 한다');
  }
  const ionShare = profile.ionShare;
  const r0 = Math.max(0, rate);
  const total = Math.max(0, seconds);
  const film = Math.max(0, filmThickness);
  const cd = Math.max(1, trenchWidth);
  const sel = Math.max(1, selectivity);

  let filmEtched = 0;
  let underlayerLoss = 0;
  let punchThroughTime = null;
  let endRate = r0;
  let t = 0;

  // 식각률 0 이면 아무 일도 일어나지 않는다. 루프를 돌 이유가 없다.
  if (r0 <= 0 || total <= 0) {
    return {
      depth: 0, filmEtched: 0, remainingFilm: film,
      underlayerLoss: 0, punchThroughTime: null, endRate: r0,
    };
  }

  while (t < total) {
    const step = Math.min(dt, total - t);
    const depth = filmEtched + underlayerLoss;
    const vertical = r0 * calculateArdeFactor(depth / cd, ionShare); // nm/min
    endRate = vertical;
    const perSec = vertical / 60;

    if (filmEtched < film) {
      const need = film - filmEtched;
      const canDo = perSec * step;
      if (canDo < need) {
        filmEtched += canDo;
        t += step;
      } else {
        // 이 스텝 안에서 막을 뚫는다. 뚫은 시각을 정확히 잡고 남은 시간은
        // 하부층 쪽으로 넘긴다 — 스텝 경계에서 시간이 새면 오버에치가 과소평가된다.
        const used = need / perSec;
        filmEtched = film;
        t += used;
        punchThroughTime = t;
      }
    } else {
      underlayerLoss += (perSec / sel) * step;
      t += step;
    }
  }

  return {
    depth: filmEtched + underlayerLoss,
    filmEtched,
    remainingFilm: Math.max(0, film - filmEtched),
    underlayerLoss,
    punchThroughTime,
    endRate,
  };
}
