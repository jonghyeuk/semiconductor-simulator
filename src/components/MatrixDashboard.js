import React, { useState } from 'react';

// 콘텐츠 유형 태그
const contentTypes = {
  simulation: { label: '시뮬레이션', color: 'bg-red-500 text-white', textColor: 'text-red-600' },
  theory: { label: '이론', color: 'bg-slate-400 text-white', textColor: 'text-slate-500' },
  experiment: { label: '실험', color: 'bg-emerald-500 text-white', textColor: 'text-emerald-600' },
  quiz: { label: '평가', color: 'bg-violet-500 text-white', textColor: 'text-violet-600' },
  overview: { label: '개요', color: 'bg-sky-400 text-white', textColor: 'text-sky-500' },
  analysis: { label: '분석', color: 'bg-amber-500 text-white', textColor: 'text-amber-600' },
  troubleshooting: { label: '트러블슈팅', color: 'bg-gray-500 text-white', textColor: 'text-gray-500' },
  guide: { label: '가이드', color: 'bg-teal-500 text-white', textColor: 'text-teal-600' },
};

// 전체 매트릭스 데이터
// type: 콘텐츠 유형 (simulation/theory/experiment/quiz/overview/analysis/troubleshooting/guide)
// coreReason: 핵심 추천 이유 (core tier만)
const matrixData = [
  {
    id: 'vacuum',
    name: 'Vacuum 기초',
    icon: '⚡',
    color: '#1976d2',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic', type: 'theory' },
      { id: 'pumping-simulation', name: '펌핑 시뮬레이션', icon: '⚡', tier: 'core', type: 'simulation', best: true, coreReason: '진공 형성 과정을 직접 조작하며 이해' },
      { id: 'performance-analysis', name: '성능 특성 곡선', icon: '📊', tier: 'core', type: 'simulation', coreReason: '펌프 특성을 곡선으로 읽는 눈을 키움' },
      { id: 'process-control', name: '압력 세팅 실험', icon: '🔧', tier: 'basic', type: 'experiment' },
      { id: 'conductance-relation', name: 'Conductance', icon: '🔄', tier: 'advanced', type: 'analysis' },
      { id: 'pipe-design', name: '배관 설계', icon: '🏗️', tier: 'advanced', type: 'simulation' },
      { id: 'troubleshooting', name: '트러블슈팅', icon: '🔧', tier: 'advanced', type: 'troubleshooting' },
      { id: 'quiz', name: '퀴즈', icon: '🎯', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'cleaning',
    name: '웨이퍼 세정',
    icon: '🧽',
    color: '#4caf50',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic', type: 'theory' },
      { id: 'overview', name: '세정 공정 개요', icon: '🔄', tier: 'basic', type: 'overview' },
      { id: 'wet-cleaning', name: '습식 세정', icon: '💧', tier: 'core', type: 'simulation', coreReason: 'RCA 세정 흐름을 단계별로 시각 확인' },
      { id: 'dry-cleaning', name: '건식 세정', icon: '⚡', tier: 'core', type: 'simulation', coreReason: '건식/습식 차이를 눈으로 비교하며 체득' },
      { id: 'ultrasonic', name: '초음파 세정', icon: '🌊', tier: 'basic', type: 'experiment' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'oxidation',
    name: 'Oxidation',
    icon: '🔥',
    color: '#ff5722',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic', type: 'theory' },
      { id: 'overview', name: '산화 공정 개요', icon: '🔥', tier: 'basic', type: 'overview' },
      { id: 'thermal', name: '열산화 실험', icon: '🌡️', tier: 'core', type: 'simulation', coreReason: '온도/시간을 바꾸며 산화막 성장 원리 체득' },
      { id: 'analysis', name: '산화 영향 인자', icon: '📊', tier: 'core', type: 'analysis', coreReason: 'Deal-Grove 모델이 왜 중요한지 직접 확인' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic', type: 'quiz' },
      { id: 'troubleshooting', name: '트러블슈팅', icon: '🔧', tier: 'advanced', type: 'troubleshooting' },
    ]
  },
  {
    id: 'lithograph',
    name: 'Lithography',
    icon: '💡',
    color: '#9c27b0',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic', type: 'theory' },
      { id: 'overview1', name: '공정 개요 1', icon: '📋', tier: 'basic', type: 'overview' },
      { id: 'overview2', name: '공정 개요 2', icon: '📷', tier: 'basic', type: 'overview' },
      { id: 'process', name: 'PR Coating', icon: '⚙️', tier: 'core', type: 'simulation', coreReason: 'RPM을 직접 바꾸며 코팅 균일도를 느낌' },
      { id: 'exposure', name: '노광 방식 비교', icon: '💡', tier: 'core', type: 'simulation', coreReason: 'DUV vs EUV 해상도 차이를 눈으로 확인' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'plasma',
    name: 'Plasma I',
    icon: '⚡',
    color: '#2196f3',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic', type: 'theory' },
      { id: 'plasma-basics', name: '플라즈마 기본', icon: '⚡', tier: 'core', type: 'simulation', coreReason: '전자-이온 충돌이 만드는 플라즈마를 체감' },
      { id: 'plasma-principle1', name: '발생원리 1', icon: '🔬', tier: 'core', type: 'simulation', best: true, coreReason: '파션커브를 조작하며 방전 조건을 이해' },
      { id: 'plasma-principle2', name: '발생원리 2', icon: '📈', tier: 'basic', type: 'theory' },
      { id: 'rf-matching', name: 'RF 매칭', icon: '📡', tier: 'advanced', type: 'analysis' },
      { id: 'system-structure', name: 'CCP 구조', icon: '🏗️', tier: 'advanced', type: 'analysis' },
    ]
  },
  {
    id: 'plasma-ii',
    name: 'Plasma II',
    icon: '🔬',
    color: '#3f51b5',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic', type: 'theory' },
      { id: 'system-structure-icp', name: 'ICP 구조', icon: '🔬', tier: 'core', type: 'simulation', coreReason: 'ICP 4단계를 따라가며 유도결합 원리 습득' },
      { id: 'etching-process', name: '식각 공정', icon: '⚙️', tier: 'core', type: 'simulation', coreReason: 'Ion+Radical Synergy가 왜 중요한지 체험' },
      { id: 'deposition-process', name: '증착 공정', icon: '🏗️', tier: 'basic', type: 'theory' },
      { id: 'equipment-application', name: '장비 응용', icon: '🏭', tier: 'advanced', type: 'guide' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'etching',
    name: 'Etching',
    icon: '⚗️',
    color: '#607d8b',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic', type: 'theory' },
      { id: 'overview', name: '식각 공정 개요', icon: '📋', tier: 'basic', type: 'overview' },
      { id: 'etch-elements', name: '식각 요소', icon: '🔬', tier: 'core', type: 'experiment', coreReason: 'RIE 가스 조건 차이를 비교하며 체험' },
      { id: 'process', name: '식각 원리', icon: '🧪', tier: 'core', type: 'simulation', coreReason: '3D로 실리콘이 깎이는 과정을 눈으로 확인' },
      { id: 'analysis', name: 'Si식각메커니즘', icon: '📊', tier: 'core', type: 'simulation', best: true, coreReason: 'Si 표면에서 일어나는 식각 반응을 단계별로 이해' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'deposition',
    name: 'Deposition',
    icon: '📦',
    color: '#795548',
    tabs: [
      { id: 'theory', name: '개요', icon: '📚', tier: 'basic', type: 'overview' },
      { id: 'pvd-evap', name: 'PVD (증발)', icon: '🔥', tier: 'core', type: 'simulation', best: true, coreReason: '증발 분자가 기판에 닿는 과정을 3D로 체험' },
      { id: 'pvd-sputtering', name: 'PVD (스퍼터링)', icon: '🎯', tier: 'core', type: 'simulation', best: true, coreReason: '아르곤 이온 충돌 → 박막 형성을 시각 확인', locked: true },
      { id: 'cvd-thermal', name: 'CVD (Thermal)', icon: '🌡️', tier: 'core', type: 'simulation', best: true, coreReason: '고온 열분해로 박막이 쌓이는 메커니즘을 체득', locked: true },
      { id: 'cvd-pecvd', name: 'PECVD', icon: '⚡', tier: 'advanced', type: 'simulation', locked: true },
      { id: 'ald', name: 'ALD', icon: '⚛️', tier: 'core', type: 'simulation', best: true, coreReason: '원자 한 층씩 쌓는 ALD 사이클을 직접 돌려봄', locked: true },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'implantation',
    name: 'Implantation',
    icon: '⚛️',
    color: '#3f51b5',
    tabs: [
      { id: 'theory', name: '이론', icon: '📖', tier: 'basic', type: 'theory' },
      { id: 'diffusion', name: '확산 공정', icon: '📈', tier: 'core', type: 'simulation', coreReason: '온도/시간에 따른 도펀트 확산 패턴을 읽음' },
      { id: 'implantation', name: '이온 주입', icon: '🎯', tier: 'core', type: 'simulation', coreReason: '에너지/도즈를 바꾸며 프로파일 변화를 체득' },
      { id: 'comparison', name: '공정 비교', icon: '🔄', tier: 'basic', type: 'analysis' },
      { id: 'temperature', name: 'Annealing 효과', icon: '🌡️', tier: 'core', type: 'simulation', best: true, coreReason: '어닐링 온도가 결정 회복에 미치는 영향을 확인' },
      { id: 'rta', name: 'RTA', icon: '⚙️', tier: 'core', type: 'simulation', best: true, coreReason: '급속 열처리로 도펀트 활성화 과정을 체험' },
      { id: 'application', name: '적용 가이드', icon: '💡', tier: 'advanced', type: 'guide' },
      { id: 'quiz', name: '퀴즈', icon: '🏆', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'metallization-eds-packaging',
    name: '배선검사패키징',
    icon: '🔌',
    color: '#ff9800',
    tabs: [
      { id: 'overview', name: '개요', icon: '📚', tier: 'basic', type: 'overview' },
      { id: 'metallization', name: '금속배선', icon: '🔌', tier: 'core', type: 'simulation', coreReason: '다층 배선이 왜 필요한지 구조로 이해' },
      { id: 'damascene', name: 'Damascene', icon: '⚙️', tier: 'core', type: 'simulation', coreReason: 'Single vs Dual 공정 차이를 단계별 확인' },
      { id: 'eds', name: 'EDS', icon: '🔍', tier: 'basic', type: 'experiment' },
      { id: 'packaging', name: '패키징', icon: '📦', tier: 'basic', type: 'theory' },
      { id: 'bonding', name: '본딩', icon: '🔗', tier: 'advanced', type: 'analysis' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic', type: 'quiz' },
    ]
  },
  {
    id: 'comprehensive-assessment',
    name: '종합평가',
    icon: '🏆',
    color: '#e91e63',
    tabs: [
      { id: 'basic', name: '기초 평가', icon: '📝', tier: 'core', type: 'quiz', coreReason: '내가 8대공정을 얼마나 이해했는지 점검' },
      { id: 'advanced', name: '심화 평가', icon: '🏆', tier: 'advanced', type: 'quiz' },
    ]
  },
];

// 데이터 추출 헬퍼
const getAllCards = (tier) => {
  const cards = [];
  matrixData.forEach(process => {
    process.tabs.forEach(tab => {
      if (!tier || tab.tier === tier) {
        cards.push({ ...tab, processId: process.id, processName: process.name, processIcon: process.icon, processColor: process.color });
      }
    });
  });
  return cards;
};

const MatrixDashboard = ({ onNavigate }) => {
  const [showLockedTooltip, setShowLockedTooltip] = useState(null);

  const allCoreCards = getAllCards('core');
  const bestCards = allCoreCards.filter(c => c.best);
  const coreCards = allCoreCards.filter(c => !c.best);
  const basicCards = getAllCards('basic');
  const advancedCards = getAllCards('advanced');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ====== 상단 안내 배너 ====== */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-6 py-4 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                추천 시뮬레이션부터 체험해보세요
              </h1>
              <p className="text-sm text-orange-100 mt-0.5">
                반도체 8대공정 | 직접 조작하는 인터랙티브 시뮬레이터 {bestCards.length + coreCards.length + basicCards.length + advancedCards.length}개
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-300 animate-pulse"></span>
              핵심 {bestCards.length + coreCards.length}개
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              기본 {basicCards.length}개
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              🔒 고급 {advancedCards.length}개
            </span>
          </div>
        </div>
      </div>

      {/* ====== 메인 콘텐츠 ====== */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-10">

          {/* ====== BEST 대표작 (최상단) ====== */}
          {bestCards.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-xl shadow-lg animate-pulse-slow">
                  <span className="text-lg">🏆</span>
                  <span className="font-extrabold tracking-tight">BEST — 처음이라면 여기부터</span>
                </div>
                <span className="text-sm text-orange-600 font-medium">
                  가장 많이 체험하는 입문 시뮬레이션
                </span>
                <div className="flex-1 h-px bg-orange-300"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {bestCards.map((card, idx) => (
                  <button
                    key={`${card.processId}-${card.id}`}
                    onClick={() => onNavigate(card.processId, card.id)}
                    className="group relative flex flex-col p-5 rounded-2xl border-2 border-orange-400 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 shadow-lg shadow-orange-200 ring-2 ring-orange-300/60 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-300 text-left min-h-[160px]"
                  >
                    {/* BEST + 순위 뱃지 */}
                    <div className="absolute -top-3 -left-2 flex items-center gap-1">
                      <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md">
                        🏆 BEST {bestCards.length > 1 ? `#${idx + 1}` : ''}
                      </span>
                      {card.locked ? (
                        <span className="px-2 py-1 text-[10px] font-bold rounded-lg bg-gray-100 text-gray-500">
                          미리보기
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-[10px] font-bold rounded-lg bg-orange-100 text-orange-700">
                          입문 추천
                        </span>
                      )}
                    </div>

                    {/* 콘텐츠 유형 태그 */}
                    <div className="flex items-center justify-end mb-3 mt-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${contentTypes[card.type].color}`}>
                        {contentTypes[card.type].label}
                      </span>
                    </div>

                    {/* 아이콘 + 이름 (크게) */}
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-4xl flex-shrink-0">{card.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold leading-tight" style={{ color: card.processColor }}>
                          {card.processName}
                        </div>
                        <div className="text-lg font-extrabold text-gray-900 leading-tight mt-0.5">
                          {card.name}
                        </div>
                      </div>
                    </div>

                    {/* 경험 설명 */}
                    {card.coreReason && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <p className="text-sm text-orange-800 font-medium leading-snug">
                          👉 {card.coreReason}
                        </p>
                      </div>
                    )}

                    {/* 화살표 */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold">체험하기</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ====== 섹션 1: 🔥 핵심 실습 ====== */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-md">
                <span className="text-lg">🔥</span>
                <span className="font-bold">핵심 실습</span>
              </div>
              <span className="text-sm text-orange-600 font-medium">
                — 직접 조작하며 원리를 체험하세요
              </span>
              <div className="flex-1 h-px bg-orange-200"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {coreCards.map((card) => (
                <button
                  key={`${card.processId}-${card.id}`}
                  onClick={() => onNavigate(card.processId, card.id)}
                  className="group relative flex flex-col p-4 rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 via-white to-red-50 shadow-md shadow-orange-100 ring-2 ring-orange-200/50 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200 text-left min-h-[130px]"
                >
                  {/* 콘텐츠 유형 태그 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${contentTypes[card.type].color}`}>
                      {contentTypes[card.type].label}
                    </span>
                    {card.locked ? (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        미리보기
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded">
                        🔥 핵심
                      </span>
                    )}
                  </div>

                  {/* 아이콘 + 이름 */}
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-2xl flex-shrink-0">{card.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium leading-tight" style={{ color: card.processColor }}>
                        {card.processName}
                      </div>
                      <div className="text-sm font-bold text-gray-800 leading-tight mt-0.5">
                        {card.name}
                      </div>
                    </div>
                  </div>

                  {/* 추천 이유 */}
                  {card.coreReason && (
                    <div className="mt-2 pt-2 border-t border-orange-200/50">
                      <p className="text-[11px] text-orange-700 leading-snug">
                        👉 {card.coreReason}
                      </p>
                    </div>
                  )}

                  {/* Hover 화살표 */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ====== 섹션 2: 🧪 체험 / 기본 ====== */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl shadow-sm">
                <span className="text-lg">🧪</span>
                <span className="font-bold">체험 / 기본</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">
                — 이론 학습과 기초 실험
              </span>
              <div className="flex-1 h-px bg-blue-200"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {basicCards.map((card) => (
                <button
                  key={`${card.processId}-${card.id}`}
                  onClick={() => onNavigate(card.processId, card.id)}
                  className="group relative flex flex-col p-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-white shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300 text-left min-h-[100px]"
                >
                  {/* 콘텐츠 유형 태그 */}
                  <span className={`self-start px-1.5 py-0.5 text-[9px] font-bold rounded ${contentTypes[card.type].color} mb-1.5`}>
                    {contentTypes[card.type].label}
                  </span>

                  {/* 아이콘 + 이름 */}
                  <div className="flex items-start gap-1.5 flex-1">
                    <span className="text-xl flex-shrink-0">{card.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium leading-tight" style={{ color: card.processColor }}>
                        {card.processName}
                      </div>
                      <div className="text-xs font-bold text-gray-700 leading-tight mt-0.5">
                        {card.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ====== 섹션 3: 🔒 고급 기능 (잠금) ====== */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-xl shadow-sm">
                <span className="text-lg">🔒</span>
                <span className="font-bold">고급 / 확장</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                — 정식 버전에서 이용 가능합니다
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {advancedCards.map((card) => {
                const cellKey = `${card.processId}-${card.id}`;
                return (
                  <div
                    key={cellKey}
                    className="group relative flex flex-col p-3 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm cursor-not-allowed select-none min-h-[100px] opacity-60 hover:opacity-80 transition-all duration-200"
                    onClick={() => setShowLockedTooltip(showLockedTooltip === cellKey ? null : cellKey)}
                  >
                    {/* 잠금 오버레이 */}
                    <div className="absolute inset-0 rounded-xl bg-gray-900/5 flex items-center justify-center z-10">
                      {showLockedTooltip === cellKey && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20">
                          정식 버전에서 이용 가능합니다
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>

                    {/* 콘텐츠 유형 태그 */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gray-300 text-gray-600">
                        {contentTypes[card.type].label}
                      </span>
                      <span className="text-sm">🔒</span>
                    </div>

                    {/* 아이콘 + 이름 */}
                    <div className="flex items-start gap-1.5 flex-1">
                      <span className="text-xl flex-shrink-0 grayscale">{card.icon}</span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-gray-400 leading-tight">
                          {card.processName}
                        </div>
                        <div className="text-xs font-bold text-gray-500 leading-tight mt-0.5">
                          {card.name}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ====== 3센터 예고 블록 ====== */}
          <section>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6">
              {/* 상단 안내 문구 */}
              <div className="text-center mb-6">
                <p className="text-sm text-slate-500 mb-1">
                  이 데모는 Education Center의 핵심 실습을 먼저 체험하는 버전입니다
                </p>
                <p className="text-xs text-slate-400">
                  전체 플랫폼은 3개의 학습 센터로 구성됩니다
                </p>
              </div>

              {/* 3센터 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Education Center - 활성 */}
                <div className="relative rounded-xl border-2 border-teal-400 bg-gradient-to-br from-teal-50 to-cyan-50 p-5 shadow-md ring-2 ring-teal-200/50">
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-bold bg-teal-500 text-white rounded-full shadow-sm">
                    지금 체험 중
                  </span>
                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center text-white text-xl shadow-sm">
                      🎓
                    </div>
                    <div>
                      <h4 className="font-bold text-teal-900">Education Center</h4>
                      <p className="text-[11px] text-teal-600">반도체 8대공정 기초 학습</p>
                    </div>
                  </div>
                  <p className="text-xs text-teal-700 leading-relaxed">
                    핵심 실습과 이론 학습을 통해 반도체 공정의 원리를 이해합니다
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 text-[9px] bg-teal-100 text-teal-700 rounded font-medium">Vacuum</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-teal-100 text-teal-700 rounded font-medium">Cleaning</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-teal-100 text-teal-700 rounded font-medium">Oxidation</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-teal-100 text-teal-700 rounded font-medium">Lithography</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-teal-100 text-teal-700 rounded font-medium">+6 more</span>
                  </div>
                </div>

                {/* Training Center - 잠금 */}
                <div className="relative rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 p-5 opacity-60">
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-bold bg-gray-400 text-white rounded-full shadow-sm">
                    🔒 정식 버전
                  </span>
                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center text-white text-xl shadow-sm grayscale-[30%]">
                      🏭
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-600">Virtual Training Center</h4>
                      <p className="text-[11px] text-gray-400">실제 장비 운용형 실습</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    실제 반도체 장비를 가상으로 운용하며 실전 감각을 훈련합니다
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">LPCVD</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">PECVD</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">Sputtering</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">Evaporator</span>
                  </div>
                </div>

                {/* Plasma Lab - 잠금 */}
                <div className="relative rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50/50 to-red-50/50 p-5 opacity-60">
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-bold bg-gray-400 text-white rounded-full shadow-sm">
                    🔒 정식 버전
                  </span>
                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white text-xl shadow-sm grayscale-[30%]">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-600">Plasma Advanced Lab</h4>
                      <p className="text-[11px] text-gray-400">고급 플라즈마 분석</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    RF-DC 특성, IEDF 분석, 고급 플라즈마 물리를 심화 탐구합니다
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">RF/DC</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">IEDF</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">ICP/CCP</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-400 rounded font-medium">Matching</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 공정 가이드 문서 ====== */}
          <section className="pb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="text-center md:text-left">
                  <h3 className="text-base font-bold text-gray-800 mb-1">
                    반도체 8대 공정 학습 가이드
                  </h3>
                  <p className="text-gray-500 text-sm">
                    각 시뮬레이터의 학습 목표, 공정 개요, 추천 학습 경로를 확인하세요
                  </p>
                </div>
                <a
                  href="/guide/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm"
                >
                  <span>가이드 보기</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* ====== CTA: 전체 플랫폼 유도 ====== */}
          <section className="pb-8">
            <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-white mb-1">
                    Education / Training / Plasma — 전체 센터 이용
                  </h3>
                  <p className="text-slate-400 text-sm">
                    접속 코드 등록 후 3개 학습 센터와 {advancedCards.length}개 고급 콘텐츠에 입장할 수 있습니다
                  </p>
                </div>
                <a
                  href="https://kr.semifabai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <span>전체 플랫폼 보기</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default MatrixDashboard;
