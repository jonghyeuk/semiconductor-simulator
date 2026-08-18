/**
 * 원자 스케일 표면 반응 — 이온·라디칼 시너지.
 *
 * 챔버 단면도(EtchingBay)는 500 nm 스케일이다. 이 모듈은 그 아래 1000 배 작은 곳,
 * 즉 Si 표면 한 자리에서 무슨 일이 일어나는지를 다룬다.
 *
 * ── 모델 ──
 * 열(column) 마다 Si 원자가 수직으로 쌓여 있고, 각 열의 최상단 원자 하나가 표면이다.
 * 표면 원자는 염소화 정도 cl (0~4) 을 갖는다. 원자가 제거되면 표면이 한 칸 내려가고
 * cl 은 0 으로 초기화된다 — 새로 드러난 원자는 아직 염소화되지 않았다.
 *
 * 제거 경로가 **세 갈래**이고, 이 셋을 구분해야 시너지가 나온다.
 *
 *   ① 라디칼 흡착   방향성 없는 Cl 이 표면에 닿으면 cl += 1 (최대 4)
 *   ② 자발 탈리     cl == 4 인 원자가 스스로 SiCl₄ 로 떨어진다. 확률이 매우 낮다.
 *                   → 라디칼만 넣었을 때의 느린 식각이 여기서 나온다.
 *   ③ 이온 충격     제거 확률 = physical + chemical · (cl/4)²
 *                   physical 은 순수 스퍼터링, chemical 은 약해진 Si–Cl 결합을 때려
 *                   날리는 화학적 스퍼터링이다. cl 이 0 이면 chemical 항이 통째로
 *                   사라진다 — 이것이 시너지의 정체다.
 *
 * ── 정확도 ──
 * 분자동역학이 아니다. 원자 간 힘을 풀지 않고 **확률만 다룬다.** 확률 계수는
 * Coburn–Winters 가 측정한 상대비를 재현하도록 잡았고, 그 재현 여부는 테스트가 본다
 * (상수를 감으로 잡았다가 시너지가 1.0 배로 나온 적이 있어서 넣은 테스트다).
 *
 * 격자는 실제 Si 결정면 (100)/(111) 이 아니라 정사각 배열이라 결정 방향에 따른
 * 식각 이방성은 담기지 않았다. 이온 에너지·입사각 분포, 표면 전하 축적, 재증착도 없다.
 * 반환되는 "원자/s" 는 이 모델 안에서만 의미가 있는 상대 지표이며, 실제 식각률
 * (nm/min) 로 환산해 인용하면 안 된다.
 */

/** 반응 확률. 하나라도 건드리면 Coburn–Winters 상대비가 깨진다 (테스트가 잡는다). */
export const REACTION = {
  radicalFlux: 2.0,     // 프레임당 도달하는 라디칼 수 (기대값)
  ionFlux: 0.5,         // 프레임당 도달하는 이온 수 — 라디칼보다 훨씬 드물다
  spontaneous: 0.0006,  // cl == 4 인 표면 원자가 스스로 떨어질 확률 (열·프레임당)
  physical: 0.019,      // 순수 물리 스퍼터링 제거 확률 (이온 1 발당)
  chemical: 0.90,       // 화학적 스퍼터링 계수. (cl/4)² 에 곱한다
  strip: 0.35,          // 떼어내지 못한 이온이 표면 Cl 을 흩뜨릴 확률
  maxCl: 4,             // SiCl₄ 까지
};

/**
 * Coburn–Winters 실험 (J. W. Coburn & H. F. Winters,
 * J. Appl. Phys. 50, 3189 (1979)). 값은 논문 그래프에서 읽은 근사치다.
 */
export const COBURN_WINTERS = {
  radicalOnly: 5,   // XeF2 기체만 — 약 5 Å/min
  ionOnly: 2,       // Ar+ 빔만 — 약 2 Å/min
  both: 55,         // 동시 — 약 55 Å/min
  get synergy() {   // 동시 ÷ (각각의 합) = 약 7.9 배
    return this.both / (this.radicalOnly + this.ionOnly);
  },
};

export const MODES = ['radical', 'ion', 'both'];

/** 모드별로 어떤 종을 넣는가. */
export function speciesOf(mode) {
  return { radical: mode !== 'ion', ion: mode !== 'radical' };
}

/** 표면 초기화. cols 개의 열, 전부 깨끗한 Si. */
export function createSurface(cols) {
  return {
    cols,
    top: new Int16Array(cols),   // 각 열에서 제거된 원자 수
    cl: new Uint8Array(cols),    // 표면 원자의 염소화 정도
    scrolled: 0,                 // 시야 밖으로 밀어낸 원자층 수
    removed: 0,                  // 제거한 원자 총 수
  };
}

/** 포아송 근사 — 기대값 n 에서 이번 프레임에 몇 개를 낼지 정한다. */
export function drawCount(n, rng = Math.random) {
  let out = Math.floor(n);
  if (rng() < n - out) out += 1;
  return out;
}

/** ① 라디칼 흡착. 이미 SiCl₄ 면 더 붙지 않는다. */
export function adsorb(s, col) {
  if (s.cl[col] < REACTION.maxCl) s.cl[col] += 1;
}

/** 원자 하나를 제거한다. 표면이 한 칸 내려가고 염소화는 초기화된다. */
export function removeAtom(s, col) {
  s.top[col] += 1;
  s.cl[col] = 0;
  s.removed += 1;
}

/**
 * ③ 이온 충격. 제거했으면 true.
 * 떼어내지 못해도 표면 Cl 을 흩뜨릴 수 있다 — 이온은 결합을 만들지 않는다.
 */
export function ionStrike(s, col, rng = Math.random) {
  const chem = REACTION.chemical * Math.pow(s.cl[col] / REACTION.maxCl, 2);
  if (rng() < REACTION.physical + chem) {
    removeAtom(s, col);
    return true;
  }
  if (s.cl[col] > 0 && rng() < REACTION.strip) s.cl[col] -= 1;
  return false;
}

/**
 * ② 자발 탈리. 완전히 염소화된 표면 원자만 대상이다.
 * @returns 이번 프레임에 스스로 떨어진 열 번호들
 */
export function desorbSpontaneous(s, rng = Math.random) {
  const out = [];
  for (let c = 0; c < s.cols; c++) {
    if (s.cl[c] >= REACTION.maxCl && rng() < REACTION.spontaneous) {
      removeAtom(s, c);
      out.push(c);
    }
  }
  return out;
}

/**
 * 표면이 시야 아래로 내려갔으면 격자를 한 층 끌어올린다.
 * 되감으면 식각이 리셋된 것처럼 보이므로, 깊이는 scrolled 에 누적한다.
 * @returns 끌어올렸으면 true
 */
export function scrollIfSunk(s) {
  let minTop = Infinity;
  for (let c = 0; c < s.cols; c++) if (s.top[c] < minTop) minTop = s.top[c];
  if (minTop < 1) return false;
  for (let c = 0; c < s.cols; c++) s.top[c] -= 1;
  s.scrolled += 1;
  return true;
}

/** 표면 전체의 염소화 비율 (0~1). */
export function chlorination(s) {
  let sum = 0;
  for (let c = 0; c < s.cols; c++) sum += s.cl[c];
  return sum / (s.cols * REACTION.maxCl);
}

/** 식각 깊이 (원자층). 시야 밖으로 밀어낸 층 + 현재 평균 깊이. */
export function depthLayers(s) {
  let sum = 0;
  for (let c = 0; c < s.cols; c++) sum += s.top[c];
  return s.scrolled + sum / s.cols;
}

/**
 * 화면 없이 반응만 돌린다. 테스트와 상수 조정에 쓴다.
 *
 * 입자의 비행 시간은 넣지 않았다. 비행은 도달 시각을 미룰 뿐 정상상태 도달률을
 * 바꾸지 않으므로, 여기서 나온 비율은 화면에서 관측되는 비율과 같다.
 *
 * @returns {{rate:number, removed:number, chlorination:number}} rate 는 원자/s
 */
export function simulateSurface({ mode, seconds, cols = 40, fps = 60, rng = Math.random }) {
  const s = createSurface(cols);
  const use = speciesOf(mode);
  const frames = Math.round(seconds * fps);

  for (let f = 0; f < frames; f++) {
    if (use.radical) {
      const n = drawCount(REACTION.radicalFlux, rng);
      for (let i = 0; i < n; i++) adsorb(s, Math.floor(rng() * cols));
    }
    if (use.ion) {
      const n = drawCount(REACTION.ionFlux, rng);
      for (let i = 0; i < n; i++) ionStrike(s, Math.floor(rng() * cols), rng);
    }
    desorbSpontaneous(s, rng);
  }

  return {
    rate: s.removed / seconds,
    removed: s.removed,
    chlorination: chlorination(s),
  };
}
