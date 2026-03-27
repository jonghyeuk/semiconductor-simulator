# 다음 세션 작업 목록

## 현재 상태 요약
- 데모 레포: `jonghyeuk/semiconductor-simulator`
- GEO 가이드 시스템 구축 완료 (1단계: 시뮬레이터별 가이드 10페이지)
- 데모 잠금 시스템 구축 완료 (Deposition 4개 탭 잠금)
- 탭 오버레이로 선택된 카드의 탭만 표시 (Plasma/종합평가는 예외)
- 사이드바 시뮬레이터 목록 비활성화 (대시보드 복귀 + 하단 링크만 활성)

---

## 작업 1: 탭별 가이드 문서 생성 (2단계)

### 배경
현재 가이드는 시뮬레이터 단위(vacuum.html, cleaning.html 등) 9개 + 인덱스 1개 = 10페이지.
각 시뮬레이터 안에 6~8개 탭이 있는데, 탭별 문서는 아직 없음.
탭별 가이드를 만들면 GEO 페이지가 50~60개로 늘어남 → GEO 효과 대폭 강화.

### 구현 방법
1. `scripts/guide-data.js`에 각 시뮬레이터의 탭별 메타데이터 추가
   - 탭 ID, 이름, 설명, 학습 포인트, 키워드 등
2. `scripts/build-guides.js` 확장
   - 시뮬레이터별 서브 디렉토리 생성 (예: `public/guide/vacuum/pumping.html`)
   - 탭별 가이드 HTML 자동 생성
3. 각 탭별 가이드의 CTA는 해당 탭으로 직접 연결
   - 예: `/?sim=vacuum&tab=pumping-simulation`
4. `public/sitemap.xml`에 새 URL 추가
5. `npm run build-guides` 실행 후 커밋

### 참고: 탭 데이터 위치
- `src/components/MatrixDashboard.js`의 `matrixData` 배열에 모든 시뮬레이터와 탭 정보가 있음
- 각 탭에는 id, name, icon, tier, type, coreReason 등의 필드가 있음

### 참고: 현재 파일 구조
```
scripts/
  guide-data.js       ← 시뮬레이터 GEO 메타데이터 (여기에 탭별 데이터 추가)
  build-guides.js     ← HTML 생성 스크립트 (탭별 템플릿 추가)
  GUIDE-HOWTO.md      ← 관리 절차 문서

public/guide/
  index.html           ← 전체 시뮬레이터 목록 + 학습 경로
  vacuum.html          ← Vacuum 가이드 (현재 시뮬레이터 단위)
  cleaning.html
  ...

  # 2단계에서 추가될 구조:
  vacuum/
    pumping.html       ← 펌핑 시뮬레이션 탭 가이드
    performance.html   ← 성능 특성 곡선 탭 가이드
    ...
```

---

## 작업 2: 습식 세정 그래프 수정

### 문제
`src/simulators/CleaningSimulator.js`의 습식 세정(wet-cleaning) 탭에서
시간에 따른 제거 효율 그래프가 항상 동일한 결과를 보여줌.
시간 파라미터를 바꿔도 그래프가 변하지 않는 버그.

### 수정 방법
- `CleaningSimulator.js`에서 습식 세정 탭의 그래프 렌더링 로직 확인
- 시간 파라미터가 실제로 그래프 데이터에 반영되는지 추적
- 데이터 생성 함수가 파라미터를 받지 않거나, 하드코딩된 값을 사용하고 있을 가능성

---

## 작업 3: 나머지 모듈 잠금 설정

### 배경
현재 잠금된 탭 (App.js의 LOCKED_TABS):
- deposition:pvd-sputtering
- deposition:cvd-thermal
- deposition:cvd-pecvd
- deposition:ald

### 할 일
사용자가 추가로 잠글 탭을 알려주면:
1. `src/App.js`의 `LOCKED_TABS` Set에 `시뮬레이터ID:탭ID` 추가
2. `src/components/MatrixDashboard.js`의 해당 탭에 `locked: true` 추가
3. BEST 카드는 "미리보기" 태그, 핵심 실습 카드도 "미리보기" 태그로 변경됨

### 잠금 동작
- 잠긴 탭 클릭 → 시뮬레이터 화면 보이되 반투명 오버레이 + "정식 버전에서 체험할 수 있습니다" CTA
- "데모 첫 화면으로" 버튼 → 매트릭스 대시보드 복귀
- 사이드바 시뮬레이터 목록 비활성 (대시보드 버튼 + 하단 정식버전/관리자만 활성)

---

## 참고: 현재 탭 오버레이 예외 설정 (App.js)

```js
const TAB_OVERLAY = {
  'plasma':                   { top: 80, height: 52 },  // 타이틀 아래부터 탭만
  'plasma-ii':                { top: 80, height: 52 },  // 타이틀 아래부터 탭만
  'comprehensive-assessment': { top: 0, height: 0 },    // 오버레이 없음
};
const DEFAULT_TAB_OVERLAY = { top: 0, height: 58 };      // 나머지: 상단 58px
```

Plasma I/II는 타이틀 섹션이 별도로 있어서 탭 위치가 다름.
종합평가는 탭 바 없어서 오버레이 미적용.

---

## 참고: 본 플랫폼 연결

`scripts/LINK-GUIDE-FOR-MAIN-PLATFORM.md`에 본 플랫폼 담당자용 연결 가이드 있음.
본 플랫폼(kr.semifabai.com)에서 데모 가이드 URL을 링크하면 양쪽 GEO 강화됨.
데모 → 본 플랫폼 CTA는 이미 모든 가이드 페이지에 포함.
