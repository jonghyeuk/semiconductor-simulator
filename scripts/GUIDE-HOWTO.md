# GEO 가이드 페이지 관리 가이드

## 개요

`public/guide/` 디렉토리의 정적 HTML 페이지는 AI/검색엔진 크롤러가 읽을 수 있는 GEO(Generative Engine Optimization) 자산입니다. 사용자가 직접 방문하는 SPA와는 별개로 동작하며, 기존 앱 코드에 영향을 주지 않습니다.

## 파일 구조

```
scripts/
  guide-data.js       ← 시뮬레이터 GEO 메타데이터 (이 파일만 수정)
  build-guides.js     ← HTML 생성 스크립트 (수정 불필요)
  GUIDE-HOWTO.md      ← 이 문서

public/guide/
  index.html           ← 전체 시뮬레이터 목록 + 학습 경로
  vacuum.html          ← 개별 가이드 (자동 생성)
  cleaning.html
  ...
```

## 시뮬레이터 추가 시 절차

### 1. `scripts/guide-data.js` 에 데이터 추가

`simulators` 배열에 새 항목을 추가합니다.

```js
{
  id: 'new-simulator',           // 고유 ID (HTML 파일명이 됨)
  name: '시뮬레이터 전체 이름',      // 문서 제목
  shortName: '짧은 이름',          // 네비게이션, 카드에 표시
  icon: '🔧',                     // 이모지 아이콘
  color: '#ff5722',               // 테마 색상 (hex)
  summary: '한두 문장 요약',         // meta description에 사용
  description: '상세 설명 단락',     // 본문에 표시
  learningObjectives: [           // 학습 목표 3~5개
    '목표 1',
    '목표 2',
    '목표 3'
  ],
  targetLevel: '입문~중급',         // 대상 수준
  demoScope: '데모에서 체험 가능한 기능 설명',
  fullVersionExtras: '정식 버전에서 확장되는 기능 설명',
  keywords: ['키워드1', '키워드2'], // SEO/GEO 키워드
  relatedIds: ['vacuum', 'etching'], // 관련 시뮬레이터 ID
  processContext: '공정 흐름에서의 위치 설명'
}
```

### 2. 학습 경로에 추가 (선택)

같은 파일의 `learningPath` 배열에 ID를 넣으면 학습 경로 네비게이션에 포함됩니다.

```js
const learningPath = [
  'vacuum', 'cleaning', 'oxidation', 'lithography',
  'plasma', 'etching', 'deposition', 'implantation',
  'new-simulator', 'packaging'  // ← 원하는 위치에 삽입
];
```

### 3. HTML 생성

```bash
npm run build-guides
```

이 명령 하나로 `public/guide/` 아래 모든 HTML이 재생성됩니다.

## 각 HTML에 포함되는 항목

| 항목 | 용도 |
|------|------|
| JSON-LD 구조화 데이터 | AI/검색엔진이 문서 유형(LearningResource)을 인식 |
| Open Graph 태그 | 소셜 공유 시 미리보기 |
| meta description, keywords | 검색 노출 |
| 공정 설명 + 학습 목표 | GEO 텍스트층 (핵심) |
| 학습 경로 네비게이션 | 이전/다음 공정 연결 (문서 간 연계) |
| 관련 시뮬레이터 링크 | 문서 간 상호 연결 |
| 데모 범위 vs 정식 버전 | 전환 유도 |
| CTA 버튼 | 데모 체험 / 정식 버전 링크 |

## 주의사항

- `public/guide/*.html` 파일을 직접 수정하지 마세요. 스크립트 재실행 시 덮어씁니다.
- 내용을 바꾸려면 `guide-data.js`만 수정하세요.
- `build-guides.js`는 HTML 템플릿입니다. 디자인/구조를 바꿀 때만 수정합니다.
- 도메인 변경 시 `guide-data.js` 상단의 `guideDomain`, `mainPlatformUrl`을 수정하세요.
