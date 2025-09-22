# 반도체 공정 시뮬레이터

> 교육용 반도체 공정 시뮬레이터 플랫폼 - 모듈화된 아키텍처와 자동배포

## 🚀 프로젝트 개요

반도체 제조 공정을 체험할 수 있는 교육용 시뮬레이터입니다. 각 공정별로 독립적인 시뮬레이터를 개발하고 통합 포털을 통해 접근할 수 있는 확장 가능한 구조로 설계되었습니다.

### 주요 특징

- **모듈화 아키텍처**: 각 시뮬레이터 독립 개발 가능
- **자동 등록 시스템**: 새 시뮬레이터 자동 감지 및 메뉴 생성
- **GitHub Actions 자동배포**: PR 미리보기 & 프로덕션 배포
- **Firebase 정적 호스팅**: 빠른 글로벌 배포
- **반응형 디자인**: 모바일부터 데스크톱까지 지원

## 📁 프로젝트 구조

```
semiconductor-simulator/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # 공통 컴포넌트
│   │   ├── MainPortal.js   # 사이드바 포털
│   │   └── SimulatorTemplate.js
│   ├── simulators/          # 시뮬레이터 모듈들
│   │   ├── VacuumSimulator.js     # ✅ 완성
│   │   ├── CleaningSimulator.js   # 🔧 개발예정
│   │   ├── EtchingSimulator.js    # 🔧 개발예정
│   │   ├── DepositionSimulator.js # 🔧 개발예정
│   │   └── ...
│   ├── utils/
│   │   └── simulatorRegistry.js   # 자동 등록 시스템
│   ├── styles/
│   │   └── index.css
│   ├── App.js              # 메인 애플리케이션
│   └── index.js            # React 진입점
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 자동배포
├── package.json
├── firebase.json           # Firebase 호스팅 설정
├── .firebaserc            # Firebase 프로젝트 설정
├── tailwind.config.js     # Tailwind CSS 설정
└── README.md
```

## 🛠 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/semiconductor-simulator.git
cd semiconductor-simulator
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속

### 4. 빌드

```bash
npm run build
```

## 🔧 새 시뮬레이터 개발 가이드

### 1. 시뮬레이터 파일 생성

`src/simulators/` 폴더에 새 파일을 생성합니다:

```javascript
// src/simulators/CleaningSimulator.js
import React, { useState } from 'react';

const CleaningSimulator = () => {
  const [activeTab, setActiveTab] = useState('rca-cleaning');
  
  const tabs = [
    { id: 'rca-cleaning', name: 'RCA 세정', icon: '🧽' },
    { id: 'surface-analysis', name: '표면 분석', icon: '🔬' },
    // 추가 탭들...
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* 탭 네비게이션 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* 시뮬레이터 컨텐츠 */}
          {activeTab === 'rca-cleaning' && (
            <div>RCA 세정 시뮬레이션 컨텐츠</div>
          )}
          {/* 다른 탭들... */}
        </div>
      </div>
    </div>
  );
};

export default CleaningSimulator;
```

### 2. Registry에 등록

`src/utils/simulatorRegistry.js`의 `initializeSimulators()` 메서드에 새 시뮬레이터를 등록:

```javascript
// CleaningSimulator import 추가
import CleaningSimulator from '../simulators/CleaningSimulator';

// initializeSimulators 메서드 내에서
this.register({
  id: 'cleaning',
  name: '웨이퍼 세정',
  icon: '🧽',
  description: 'RCA 세정 및 표면 처리',
  component: CleaningSimulator, // 컴포넌트 연결
  available: true,              // true로 변경
  category: 'process',
  order: 2,
  metadata: {
    version: '1.0.0',
    lastUpdated: '2025-01-01',
    features: [
      'RCA-1/RCA-2 공정',
      '화학적 세정 메커니즘',
      '오염물질 제거 효과',
      '세정액 농도 최적화'
    ]
  }
});
```

### 3. 자동 반영

개발 서버를 재시작하면 사이드바에 새 시뮬레이터가 자동으로 나타납니다!

## 🚀 배포 가이드

### Firebase 초기 설정

1. Firebase 프로젝트 생성
```bash
firebase login
firebase init hosting
```

2. 프로젝트 ID 수정
`.firebaserc` 파일에서 프로젝트 ID를 실제 Firebase 프로젝트 ID로 변경

### GitHub Actions 설정

1. Firebase 서비스 계정 키 생성
2. GitHub Repository Secrets에 추가:
   - `FIREBASE_SERVICE_ACCOUNT`: Firebase 서비스 계정 JSON
   - `FIREBASE_PROJECT_ID`: Firebase 프로젝트 ID

### 자동배포 워크플로우

- **PR 생성시**: Firebase Preview Channel에 미리보기 배포
- **main 브랜치 Push시**: Firebase 프로덕션에 자동 배포
- **빌드 실패시**: 자동으로 배포 중단

## 📊 현재 개발 현황

| 시뮬레이터 | 상태 | 진행률 | 예상 완료 |
|-----------|------|-------|----------|
| Vacuum 기초 | ✅ 완성 | 100% | 완료 |
| 웨이퍼 세정 | 🔧 개발중 | 0% | 2025-02-01 |
| Oxidation | 📋 계획중 | 0% | 2025-02-15 |
| Lithograph | 📋 계획중 | 0% | 2025-03-01 |
| Etching | 📋 계획중 | 0% | 2025-03-15 |
| Deposition | 📋 계획중 | 0% | 2025-04-01 |
| Implantation | 📋 계획중 | 0% | 2025-04-15 |
| 검사계측 | 📋 계획중 | 0% | 2025-05-01 |
| 패키징 | 📋 계획중 | 0% | 2025-05-15 |

## 🎯 개발 컨벤션

### 시뮬레이터 메타데이터

모든 시뮬레이터는 다음 메타데이터를 포함해야 합니다:

```javascript
{
  id: 'unique-identifier',           // 고유 식별자
  name: '사용자에게 보이는 이름',      // 사이드바 표시명
  icon: '🔬',                       // 이모지 아이콘
  description: '간단한 설명',        // 툴팁 및 설명
  component: ComponentName,          // React 컴포넌트
  available: true/false,            // 사용 가능 여부
  category: 'process',              // 카테고리
  order: 1,                         // 정렬 순서
  metadata: {                       // 상세 메타데이터
    version: '1.0.0',
    features: [...],
    lastUpdated: '2025-01-01'
  }
}
```

### 탭 구조 패턴

모든 시뮬레이터는 일관된 탭 구조를 따릅니다:

```javascript
const tabs = [
  { id: 'simulation', name: '시뮬레이션', icon: '⚡' },
  { id: 'analysis', name: '결과 분석', icon: '📊' },
  { id: 'optimization', name: '최적화', icon: '🔧' },
  { id: 'quiz', name: '퀴즈', icon: '🎯' }
];
```

### 상태 관리 가이드

```javascript
// 기본 상태 구조
const [activeTab, setActiveTab] = useState('simulation');
const [isPlaying, setIsPlaying] = useState(false);
const [parameters, setParameters] = useState({
  // 공정별 파라미터들
});
```

## 🤝 기여 가이드

1. **Fork** 프로젝트
2. **Feature 브랜치** 생성: `git checkout -b feature/cleaning-simulator`
3. **커밋**: `git commit -m "Add: 웨이퍼 세정 시뮬레이터 기본 구조"`
4. **Push**: `git push origin feature/cleaning-simulator`
5. **Pull Request** 생성

### 커밋 메시지 컨벤션

```
Add: 새로운 기능 추가
Fix: 버그 수정
Update: 기존 기능 개선
Remove: 기능 제거
Docs: 문서 수정
Style: 코드 스타일 수정
Refactor: 코드 리팩토링
Test: 테스트 코드
```

## 📚 기술 스택

- **Frontend**: React 18, Tailwind CSS
- **Charts**: Recharts
- **Build**: Create React App
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions
- **Development**: Node.js 18+

## 🎨 디자인 시스템

### 색상 팔레트

```css
/* 시뮬레이터별 테마 색상 */
--vacuum: #1976d2;
--cleaning: #4caf50;
--oxidation: #ff5722;
--lithography: #9c27b0;
--etching: #607d8b;

/* 진공도별 색상 */
--pressure-atmospheric: #ffcdd2;
--pressure-low: #fff3e0;
--pressure-medium: #e8f5e8;
--pressure-high: #e3f2fd;
```

### 컴포넌트 클래스

```css
.simulator-card      /* 카드 스타일 */
.simulator-tab       /* 탭 기본 스타일 */
.simulator-tab-active /* 활성 탭 */
.pressure-indicator  /* 압력 표시기 */
```

## 📄 라이선스

MIT License - 교육용 목적으로 자유롭게 사용 가능

## 📞 연락처

- **개발팀**: Semiconductor Simulator Team
- **Issues**: [GitHub Issues](https://github.com/your-username/semiconductor-simulator/issues)
- **Email**: simulator@example.com

---

**Happy Simulating! 🚀**
