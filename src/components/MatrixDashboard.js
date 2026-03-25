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
      { id: 'pvd-sputtering', name: 'PVD (스퍼터링)', icon: '🎯', tier: 'core', type: 'simulation', best: true, coreReason: '아르곤 이온 충돌 → 박막 형성을 시각 확인' },
      { id: 'cvd-thermal', name: 'CVD (Thermal)', icon: '🌡️', tier: 'core', type: 'simulation', best: true, coreReason: '고온 열분해로 박막이 쌓이는 메커니즘을 체득' },
      { id: 'cvd-pecvd', name: 'PECVD', icon: '⚡', tier: 'advanced', type: 'simulation' },
      { id: 'ald', name: 'ALD', icon: '⚛️', tier: 'core', type: 'simulation', best: true, coreReason: '원자 한 층씩 쌓는 ALD 사이클을 직접 돌려봄' },
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
                      <span className="px-2 py-1 text-[10px] font-bold rounded-lg bg-orange-100 text-orange-700">
                        입문 추천
                      </span>
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

          {/* ====== 섹션 1: 🔥 핵심 시뮬레이션 ====== */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-md">
                <span className="text-lg">🔥</span>
                <span className="font-bold">핵심 시뮬레이션</span>
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
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded">
                      🔥 핵심
                    </span>
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

          {/* ====== CTA: 정식 버전 유도 ====== */}
          <section className="pb-8">
            <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 text-center shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🔓</span>
                <h3 className="text-lg font-bold text-white">
                  고급 기능을 포함한 전체 시뮬레이션을 체험하세요
                </h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Conductance 분석, 배관 설계, RF 매칭, PECVD, ALD, RTA 등 {advancedCards.length}개 고급 콘텐츠가 포함됩니다
              </p>
              <a
                href="https://kr.semifabai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span>전체 기능 보기</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default MatrixDashboard;
