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
 * LSS 이론 기반 투영 비정 Rp 와 straggle ΔRp.
 * @param {number} energy keV
 * @param {string} dopant 'B' | 'P' | 'As' | 'In' | 'Sb'
 * @param {number} tilt 틸트 각 (deg)
 * @returns {{Rp: number, deltaRp: number}} μm
 */
export function calculateImplantParams(energy, dopant, tilt = 0) {
  const mass = dopantProperties[dopant].mass;
  const A_target = 28.1; // Si atomic mass
  const Z_target = 14; // Si atomic number
  const Z_ion = Z_ION[dopant];

  // LSS theory: reduced energy
  const epsilon =
    (32.5 * mass * energy) /
    (Z_ion * Z_target * (mass + A_target) * (Math.pow(Z_ion, 0.23) + Math.pow(Z_target, 0.23)));

  // Projected range in nm
  let Rp = (mass / A_target) * Math.pow(epsilon, 0.8) * 100;

  // Apply tilt angle correction
  if (tilt > 0) {
    Rp = Rp / Math.cos((tilt * Math.PI) / 180);
  }

  // Straggle (standard deviation)
  const deltaRp = Rp * 0.5;

  // Ensure minimum values
  Rp = Math.max(Rp, 1);

  return { Rp: Rp * 1e-3, deltaRp: deltaRp * 1e-3 }; // Convert to μm
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
