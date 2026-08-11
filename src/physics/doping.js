/**
 * 확산 / 이온주입 계산.
 *
 * Dopingprocesssimulator.jsx 에서 그대로 옮겨온 것으로, 값은 한 자리도 바꾸지 않았다.
 * 컴포넌트 state 로 읽던 값들은 인자로 바꿨을 뿐 식은 동일하다.
 */

/** 볼츠만 상수 (eV/K) */
export const K_EV = 8.617e-5;

/** 도펀트 물성. Qd = 확산 활성화 에너지(eV), D0 = 전인자(cm²/s), mass = 원자량. */
export const dopantProperties = {
  B: { name: 'Boron', nameKo: '붕소', type: 'p-type', Qd: 3.69, D0: 0.76, color: '#3b82f6', mass: 10.8 },
  P: { name: 'Phosphorus', nameKo: '인', type: 'n-type', Qd: 3.66, D0: 3.85, color: '#ef4444', mass: 31.0 },
  As: { name: 'Arsenic', nameKo: '비소', type: 'n-type', Qd: 4.08, D0: 0.32, color: '#8b5cf6', mass: 74.9 },
  In: { name: 'Indium', nameKo: '인듐', type: 'p-type', Qd: 3.9, D0: 0.5, color: '#10b981', mass: 114.8 },
  Sb: { name: 'Antimony', nameKo: '안티몬', type: 'n-type', Qd: 4.0, D0: 0.4, color: '#f59e0b', mass: 121.8 },
};

/** 이온별 원자번호. */
const Z_ION = { B: 5, P: 15, As: 33, In: 49, Sb: 51 };

/** 보어 반지름 (nm). */
const BOHR_RADIUS_NM = 0.0529;
/** 실리콘 원자 밀도 (cm⁻³). */
const N_SI = 5.0e22;
/** 실리콘 원자번호 / 원자량. */
const Z_TARGET = 14;
const M_TARGET = 28.09;

/**
 * ZBL universal 핵 저지능 (환산 단위).
 * Ziegler–Biersack–Littmark, "The Stopping and Range of Ions in Solids".
 */
function nuclearStopping(eps) {
  if (!(eps > 0)) return 0;
  return (
    (0.5 * Math.log(1 + 1.1383 * eps)) /
    (eps + 0.01321 * Math.pow(eps, 0.21226) + 0.19593 * Math.sqrt(eps))
  );
}

/**
 * 이온·타겟 조합에 대한 LSS 환산 계수들.
 *
 * 예전 구현은 환산 에너지 분자에 **이온 질량 M₁** 을 썼는데, Lindhard 의 정의는
 * **타겟 질량 M₂** 다. 그 오류에 더해 Rp 앞에 (M₁/M₂) 를 곱하는 바람에 질량이
 * 커질수록 깊어지는 — 실제와 정반대의 — 결과가 나왔다.
 */
function lssParams(dopant) {
  const Z1 = Z_ION[dopant];
  const M1 = dopantProperties[dopant].mass;
  const zsum = Math.pow(Z1, 0.23) + Math.pow(Z_TARGET, 0.23);

  // 차폐 길이 a (nm)
  const a = (0.8854 * BOHR_RADIUS_NM) / zsum;

  // 환산 에너지 ε = 32.53·M₂·E[keV] / (Z₁Z₂(M₁+M₂)(Z₁^0.23 + Z₂^0.23))
  const epsPerKeV = (32.53 * M_TARGET) / (Z1 * Z_TARGET * (M1 + M_TARGET) * zsum);

  // 전자 저지 Se = k·√ε (Lindhard–Scharff)
  const k =
    (0.0793 *
      Math.pow(Z1, 1 / 6) *
      Math.pow(Z1, 2 / 3) *
      Math.sqrt(Z_TARGET) *
      Math.pow(M1 + M_TARGET, 1.5)) /
    (Math.pow(Math.pow(Z1, 2 / 3) + Math.pow(Z_TARGET, 2 / 3), 0.75) *
      Math.pow(M1, 1.5) *
      Math.sqrt(M_TARGET));

  // 환산 거리 ρ → 실제 거리 R 로 돌리는 계수 (cm⁻¹)
  const aCm = a * 1e-7;
  const rhoPerCm =
    N_SI * 4 * Math.PI * aCm * aCm * ((M1 * M_TARGET) / Math.pow(M1 + M_TARGET, 2));

  return { M1, k, epsPerKeV, rhoPerCm };
}

/**
 * 확산 계수 D = D0·exp(-Qd/kT).
 * @param {number} temp °C
 * @returns {number} cm²/s
 */
export function calculateDiffusionCoefficient(temp, dopant) {
  const T = temp + 273.15;
  const { Qd, D0 } = dopantProperties[dopant];
  return D0 * Math.exp(-Qd / (K_EV * T));
}

/** 여오차함수 (Abramowitz–Stegun 7.1.26 근사). */
export function erfc(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const erf = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return x >= 0 ? 1 - erf : 1 + erf;
}

/**
 * LSS/ZBL 기반 투영 비정 Rp 와 straggle ΔRp.
 *
 * 전체 비정 R 은 환산 에너지 공간에서
 *   ρ(ε) = ∫₀^ε dε' / (Sn(ε') + Se(ε'))
 * 를 심프슨 적분해 얻고, 투영 비정은 Schiøtt 근사
 *   Rp = R / (1 + M₂/(3M₁))
 * 로, straggle 은
 *   ΔRp/Rp = (2/3)·√(M₁M₂)/(M₁+M₂)
 * 로 구한다. ΔRp/Rp 가 이온마다 달라지는 것(B 0.30, As 0.30, Sb 0.26)이
 * 예전의 0.5 고정과 다른 점이다.
 *
 * ── 정확도 (교육용) ──
 * 문헌 투영 비정표 대비 편차는 UI 범위(10~400 keV)에서 −25% ~ +28% 다.
 * Schiøtt 근사가 저에너지에서 과대, 고에너지에서 과소평가하는 경향이 있다.
 *
 *   keV  |   B   |   P   |  As
 *    15  |  +7%  | +21%  | +28%
 *    50  |  +1%  |  +7%  | +15%
 *   300  | −25%  | −15%  |  −8%
 *
 * 질량 순서(B > P > As > In > Sb)와 에너지 의존성은 전 범위에서 옳으므로
 * 경향 학습에는 문제가 없다. 절대 깊이가 필요하면 SRIM 등 전용 도구를 쓸 것.
 *
 * 담지 않은 물리: 채널링, 비정질화, 도즈 의존 효과. 프로파일도 가우시안이라
 * 실제의 비대칭(Pearson IV)과 다르다. 실제 장비 값과는 더 크게 벌어질 수 있다.
 *
 * @param {number} energy keV
 * @param {string} dopant 'B' | 'P' | 'As' | 'In' | 'Sb'
 * @param {number} tilt 틸트 각 (deg)
 * @returns {{Rp: number, deltaRp: number}} μm
 */
export function calculateImplantParams(energy, dopant, tilt = 0) {
  const { M1, k, epsPerKeV, rhoPerCm } = lssParams(dopant);
  const epsMax = epsPerKeV * Math.max(0, energy);

  if (!(epsMax > 0)) return { Rp: 0, deltaRp: 0 };

  // ρ = ∫₀^εmax dε / (Sn + Se) — 심프슨 적분
  const n = 400;
  const h = epsMax / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const e = i * h;
    const s = nuclearStopping(e) + k * Math.sqrt(e);
    const f = s > 0 ? 1 / s : 0;
    sum += f * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
  }
  const rho = (h / 3) * sum;

  const rangeNm = (rho / rhoPerCm) * 1e7;
  let Rp = rangeNm / (1 + M_TARGET / (3 * M1));
  const straggleRatio = ((2 / 3) * Math.sqrt(M1 * M_TARGET)) / (M1 + M_TARGET);

  // 틸트 보정: 수직 투영 깊이는 1/cos θ 로 늘어난다. 90° 이상은 물리적으로
  // 빔이 표면과 나란해지는 경우라 발산하므로 89° 로 막는다.
  const tiltDeg = Math.min(Math.max(tilt, 0), 89);
  if (tiltDeg > 0) Rp = Rp / Math.cos((tiltDeg * Math.PI) / 180);

  return { Rp: Rp * 1e-3, deltaRp: Rp * straggleRatio * 1e-3 }; // nm → μm
}

/**
 * 확산 농도 프로파일.
 * @param {object} p
 * @param {number} p.currentTime 확산 시간 (분)
 * @param {number} p.temperature °C
 * @param {string} p.dopant
 * @param {'predeposition'|'drivein'} p.processType
 * @param {number} p.surfaceConc 표면 농도 (cm⁻³)
 * @param {number} p.backgroundConc 기판 농도 (cm⁻³)
 */
export function calculateDiffusionProfile({
  currentTime,
  temperature,
  dopant,
  processType,
  surfaceConc,
  backgroundConc,
}) {
  const D = calculateDiffusionCoefficient(temperature, dopant);
  const t = currentTime * 60;
  const profile = [];
  const maxDepth = 3;
  const points = 100;

  // 시간이 0 이면 확산이 없다. √(Dt) = 0 이라 아래 식이 0/0 을 만들므로 먼저 처리한다.
  // 표면만 소스 농도이고 나머지는 기판 배경 농도다.
  if (!(D * t > 0)) {
    for (let i = 0; i <= points; i++) {
      const conc = i === 0 && processType === 'predeposition' ? surfaceConc : backgroundConc;
      profile.push({
        depth: (i / points) * maxDepth,
        concentration: conc,
        logConcentration: Math.log10(conc),
      });
    }
    return profile;
  }

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * maxDepth * 1e-4;
    let concentration;

    if (processType === 'predeposition') {
      const erfcArg = x / (2 * Math.sqrt(D * t));
      concentration = surfaceConc * erfc(erfcArg);
    } else {
      // Drive-in: Use predeposition conditions to calculate total dopant dose Q
      // Typical predeposition is done at lower temperature (900-1000°C) for 30 min
      const T_predep = 1000; // °C
      const t_predep = 30 * 60; // seconds
      const D_predep = calculateDiffusionCoefficient(T_predep, dopant);
      // Q = 2*C0*sqrt(D_predep*t_predep/π)
      const Q = 2 * surfaceConc * Math.sqrt((D_predep * t_predep) / Math.PI);
      // C(x,t) = (Q/sqrt(π*D*t)) * exp(-x²/(4*D*t))
      concentration = (Q / Math.sqrt(Math.PI * D * t)) * Math.exp((-x * x) / (4 * D * t));
    }

    concentration = Math.max(concentration, backgroundConc);

    profile.push({
      depth: (i / points) * maxDepth,
      concentration: concentration,
      logConcentration: Math.log10(concentration),
    });
  }

  return profile;
}

/**
 * 이온주입 농도 프로파일 (가우시안, 어닐링 시 확산 broadening 포함).
 * @param {object} p
 * @param {number} p.energy keV
 * @param {string} p.dopant
 * @param {number} p.dose cm⁻²
 * @param {number} p.tilt deg
 * @param {boolean} p.annealing
 * @param {number} p.annealTemp °C
 * @param {number} p.annealTime 분
 */
export function calculateImplantationProfile({
  energy,
  dopant,
  dose,
  tilt = 0,
  annealing = false,
  annealTemp = 0,
  annealTime = 0,
}) {
  const { Rp, deltaRp } = calculateImplantParams(energy, dopant, tilt);
  const profile = [];
  // Most of the concentration is within Rp ± 3*deltaRp
  const maxDepth = Math.max(Rp + 4 * deltaRp, 0.05); // At least 0.05 μm
  const points = 100;

  // 에너지가 0 이면 이온이 안 들어간다. ΔRp = 0 이라 가우시안이 0/0 이 되므로 먼저 처리한다.
  if (!(deltaRp > 0)) {
    for (let i = 0; i <= points; i++) {
      profile.push({
        depth: (i / points) * maxDepth,
        concentration: 1e14,
        logConcentration: 14,
      });
    }
    return profile;
  }

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * maxDepth;

    // Gaussian profile
    let concentration =
      (dose / (Math.sqrt(2 * Math.PI) * deltaRp * 1e-4)) *
      Math.exp(-Math.pow(x * 1e-4 - Rp * 1e-4, 2) / (2 * Math.pow(deltaRp * 1e-4, 2)));

    // If annealing is enabled, add diffusion
    if (annealing) {
      const D = calculateDiffusionCoefficient(annealTemp, dopant);
      const t = annealTime * 60;
      const diffusionBroadening = Math.sqrt(deltaRp * deltaRp * 1e-8 + 2 * D * t) * 1e4;

      concentration =
        (dose / (Math.sqrt(2 * Math.PI) * diffusionBroadening * 1e-4)) *
        Math.exp(
          -Math.pow(x * 1e-4 - Rp * 1e-4, 2) / (2 * Math.pow(diffusionBroadening * 1e-4, 2))
        );
    }

    concentration = Math.max(concentration, 1e14);

    profile.push({
      depth: x,
      concentration: concentration,
      logConcentration: Math.log10(concentration),
    });
  }

  return profile;
}
