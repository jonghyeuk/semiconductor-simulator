# 검증 게이트

빌드가 통과해도 **숫자가 틀린 것**은 잡히지 않는다. 이 문서는 이 레포에 붙인
검증 장치와, 그걸 붙이면서 실제로 나온 물리 오류를 정리한 것이다.

## 한 줄로 돌리기

```bash
npm run verify
```

`lint` → `lint:physics` → `verify:extraction` → `test` → `build` 순으로 돌고,
하나라도 실패하면 배포하지 않는다. CI(`.github/workflows/deploy.yml`)도 이걸 관문으로 쓴다.

| 스크립트 | 잡는 것 |
|---|---|
| `npm run lint` | 에러 0 유지 (case 블록 변수 누출, `==` 등). 기존 경고 187건은 상한으로 묶어 둠 |
| `npm run lint:physics` | `src/physics`, `scripts` 는 경고 0 |
| `npm run verify:extraction` | 계산 로직을 모듈로 옮기면서 숫자가 안 바뀌었는지 (114,478개 대조) |
| `npm run test` | 물리 성질 검증 (253개) |
| `npm run verify:guides` | 리팩터링이 정적 가이드 HTML을 바꿨는지 (55페이지) |

가이드 대조는 리팩터링할 때만 쓴다:

```bash
npm run verify:guides:snapshot   # 변경 전
npm run build-guides             # 변경 후 재생성
npm run verify:guides            # 차이 보고
```

## 구조

계산식은 컴포넌트에서 `src/physics/` 로 뽑아냈다. 컴포넌트는 state 를 묶어 넘기는
얇은 래퍼만 남긴다.

```
src/physics/
  oxidation.js    doping.js     vacuum.js
  plasma.js       etching.js    lithography.js
  pecvd.js        rta.js        cleaning.js
  __tests__/      # 모듈별 성질 테스트
```

원칙:

- 순수 함수. 랜덤은 인자로 주입받고 기본값을 `Math.random` 으로 둔다
  (화면 동작은 그대로, 테스트는 결정적).
- 스냅샷 테스트 금지. `expect(x).toBe(0.0234)` 대신 "온도가 오르면 두꺼워진다",
  "시간을 4배 하면 두께가 2배(포물선)" 같은 성질을 검증한다.

## 발견된 물리 오류 7건

전부 빌드는 멀쩡히 통과하던 것들이다. **계산식은 고치지 않았다** — 고치면 사용자에게
보이는 숫자가 바뀌므로 판단이 필요하다. 대신 올바른 기댓값을 `it.fails` 로 남겨
뒀다. 테스트는 지금 통과 상태이고, 누군가 계산식을 고치는 순간 실패로 바뀌어 알림이 된다.

### ① 열산화: Deal-Grove 선형 영역이 사라짐

`src/physics/oxidation.js` — `calculateOxideGrowth`

```js
A = 165 * Math.exp(-2.0 / (K_EV * tempK));   // 부호가 뒤집힘
```

`A` 는 `B` 와 `B/A` 의 비이므로 지수가 `1.23 − 2.0 = −0.77 eV`, 즉
`A ∝ exp(+0.77/kT)` 여야 한다. 지금은 1000°C 에서 `A ≈ 2e-6 nm` 로 사실상 0이 되어
두께식이 모든 시간에서 `x = √(Bt)` — **순수 포물선**이 된다.

| | 1분→4분 두께비 | dry 1000°C 60분 |
|---|---|---|
| 현재 | 2.000 (포물선) | 20.1 nm |
| 문헌 | 3.899 (거의 선형) | 54.2 nm |

고온일수록 오차가 커진다 (1100°C dry 는 문헌 대비 0.26배).

### ② 이온주입: 질량에 따른 비정 순서가 뒤집힘

`src/physics/doping.js` — `calculateImplantParams`

앞의 `(m/28.1)` 인자가 질량에 선형으로 커져서 `ε^0.8` 이 줄어드는 것보다 빠르다.
무거운 이온일수록 **깊게** 박히는 것으로 계산된다.

| 50 keV | B | P | As |
|---|---|---|---|
| 현재 | 66 nm | 119 nm | 184 nm |
| 문헌 | 160 nm | 62 nm | 33 nm |

실제로는 무거운 이온일수록 핵 저지능이 커서 얕게 박힌다. 순서가 정반대다.
`ΔRp/Rp` 도 이온·에너지와 무관하게 0.5 로 고정돼 있다 (문헌 0.25~0.3).

### ③ 진공: 배기 시간이 1000배

`src/physics/vacuum.js` — `calculatePumpingTime`

```js
(volume * Math.log(initialPressure / finalPressure)) / (pumpSpeed * 60 / 1000)
```

분모의 `/1000` 은 부피가 m³ 일 때 붙는 환산인데, UI 는 `{chamberVolume} L` 로 표시한다.
100 L 챔버 + 250 L/s 펌프로 760 → 1 Torr 배기가 실제 2.7초인데 화면엔 **44.2분**으로 뜬다.

파급: `getPumpEfficiencyAssessment` 가 10분/20분을 임계값으로 쓰므로 정상적인 펌프가
전부 "매우 느림 - 펌프 용량 부족" 으로 판정된다.

### ④ 진공: 분자류 영역인데 점성류 식

`src/physics/vacuum.js` — `calculateConductance`

`C = 3.27e-2 · D⁴ / L · 1000` 은 `D⁴` 의존성(점성류) 인데 압력 항이 없다.
이 시뮬레이터는 터보펌프로 1e-6 Torr 까지 내려가는 분자류 영역을 다루고,
분자류 긴 원통관은 `C ≈ 12.1 · D³ / L` (L/s, cm) 이다.

| D (L=100cm) | 현재 | 분자류 이론 | 배율 |
|---|---|---|---|
| 5 cm | 204 L/s | 15 L/s | 13.5× |
| 10 cm | 3,270 L/s | 121 L/s | 27× |
| 20 cm | 52,320 L/s | 968 L/s | 54× |

거듭제곱이 틀렸으므로 "직경 2배면 conductance 몇 배" 라는 교육적 결론 자체가
잘못 전달된다 (실제 8배, 현재 16배).

### ⑤ 플라즈마: 반사 전력이 입력 전력을 넘음

`src/physics/plasma.js` — `calculateReflectedPower`

```js
const impedanceMismatch = Math.abs(zIn - 50) / 50;   // 분모가 Z₀
```

반사계수는 `Γ = (Z − Z₀)/(Z + Z₀)` 이고 `|Γ| ≤ 1` 이므로 `P_refl ≤ P_in` 이다.
분모를 50 으로 쓰면 `|Z − 50| > 50` 인 순간 **에너지 보존이 깨진다**.

| Z_in (P_in = 1000 W) | 현재 | 올바른 값 |
|---|---|---|
| 100 Ω | 1,000 W | 111 W |
| 150 Ω | 4,000 W | 250 W |
| 200 Ω | 9,000 W | 360 W |

화면의 전달 효율·VSWR 표시가 여기서 파생되므로 함께 어긋난다.

### ⑥ 플라즈마: 자동 매칭이 50 Ω 이하 부하에서 동작 안 함

`calculateOptimalLC` 는 `Z_load < 50` 일 때 회로를 뒤집어 계산하는데,
`calculateInputImpedance` 는 언제나 한 가지 토폴로지만 모델링한다. 두 함수가
서로 다른 회로를 가정한다.

| Z_load | 자동 매칭 후 Z_in |
|---|---|
| 10 Ω | 18.7 Ω (−63%) |
| 25 Ω | 25.0 Ω (−50%) |
| 40 Ω | 35.1 Ω (−30%) |
| **50 Ω (슬라이더 기본값)** | **NaN** (L = C = 0 이 설정됨) |
| 60~200 Ω | 50 Ω ✓ |

슬라이더 범위가 10~200 Ω 이고 기본값이 정확히 50 Ω 이라, 화면에 처음 들어와
"자동 매칭" 을 누르면 바로 NaN 경로를 탄다.

### ⑦ 리소: 스핀 코팅 두께가 회전수를 안 따라감

`src/physics/lithography.js` — `calculateSpinCoatResults`

스핀 코팅의 기본 관계는 `t ∝ ω^(−1/2)` 다. 코드는 구간별 1차식을 쓰고,
2000~4000 rpm 구간은 `1000 + (random() − 0.5) * 20` 이라 **회전수와 무관하다**.

| rpm | 현재 | ω^(−1/2) 기준 |
|---|---|---|
| 1000 | 1100 nm | 1732 nm |
| 2000 | 1000 nm | 1225 nm |
| 4000 | 1000 nm | 866 nm |
| 6000 | 900 nm | 707 nm |

회전수 6배에 두께는 18% 밖에 안 변한다 (실제 2.4배). 2000 rpm 과 4000 rpm 의
기대 두께가 같다.

## 가드가 없는 곳 (UI 로는 대개 도달 불가)

계산식 오류는 아니지만 입력 방어가 없어 NaN/음수/발산이 나오는 지점들이다.
테스트에 현재 동작으로 고정해 뒀으므로, 가드를 넣으면 해당 테스트가 깨져서 알림이 된다.

| 위치 | 조건 | 결과 |
|---|---|---|
| `calculateOxideGrowth` | 음수 시간, 절대영도 이하 | NaN |
| `calculateDiffusionProfile` | 시간 0 | NaN (0/0) |
| `calculateImplantParams` | 틸트 90° | 1e15 μm 급 발산 |
| `calculatePumpingTime` | 펌프 속도 0 | Infinity |
| `calculateConductance` | 길이 0 | Infinity |
| `calculateInputImpedance` | C = 0 | NaN |
| `calculateSpinCoatResults` | 24000 rpm 초과 | 음수 두께 |
| `calculateSiNxRefractiveIndex` | 비율 43 초과 | 굴절률 < 1 |
| `calculateOxideRemovalEfficiency` | 건식 압력 0.5 Torr 초과 | 음수 효율 |
| `stepZoneTemperatures` | dt ≥ 1.0초 | explicit Euler 발산 (현재 dt = 0.1 로 안전) |

## 남은 정리 대상

`npm run lint` 는 현재 에러 0, 경고 187건이다. 경고는 게이트를 통과시키되 상한
(`--max-warnings 200`) 으로 묶어 늘어나지 않게 했다. 내역:

| 규칙 | 건수 | 성격 |
|---|---|---|
| `no-unused-vars` | 154 | 안 쓰는 state/함수. 지우는 건 안전하지만 파일이 커서 별건 |
| `react-hooks/exhaustive-deps` | 33 | Three.js 애니메이션 루프가 많아 의존성 추가가 동작을 바꿀 수 있음 |

두 종류 다 계산값에는 영향이 없다. 특히 `exhaustive-deps` 는 요청 범위 밖에서
렌더 동작을 바꿀 위험이 있어 손대지 않았다.
