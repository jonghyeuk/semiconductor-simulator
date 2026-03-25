import React, { useState } from 'react';

// 전체 매트릭스 데이터: 공정(행) × 탭(열)
// tier: 'core' = 🔥핵심/추천, 'basic' = 🧪체험/기본, 'advanced' = 🔒고급/확장
const matrixData = [
  {
    id: 'vacuum',
    name: 'Vacuum 기초',
    icon: '⚡',
    color: '#1976d2',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic' },
      { id: 'pumping-simulation', name: '펌핑 시뮬레이션', icon: '⚡', tier: 'core' },
      { id: 'performance-analysis', name: '성능 특성 곡선', icon: '📊', tier: 'core' },
      { id: 'process-control', name: '압력 세팅 실험', icon: '🔧', tier: 'basic' },
      { id: 'conductance-relation', name: 'Conductance', icon: '🔄', tier: 'advanced' },
      { id: 'pipe-design', name: '배관 설계', icon: '🏗️', tier: 'advanced' },
      { id: 'troubleshooting', name: '트러블슈팅', icon: '🔧', tier: 'advanced' },
      { id: 'quiz', name: '퀴즈', icon: '🎯', tier: 'basic' },
    ]
  },
  {
    id: 'cleaning',
    name: '웨이퍼 세정',
    icon: '🧽',
    color: '#4caf50',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic' },
      { id: 'overview', name: '세정 공정 개요', icon: '🔄', tier: 'basic' },
      { id: 'wet-cleaning', name: '습식 세정', icon: '💧', tier: 'core' },
      { id: 'dry-cleaning', name: '건식 세정', icon: '⚡', tier: 'core' },
      { id: 'ultrasonic', name: '초음파 세정', icon: '🌊', tier: 'basic' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic' },
    ]
  },
  {
    id: 'oxidation',
    name: 'Oxidation',
    icon: '🔥',
    color: '#ff5722',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic' },
      { id: 'overview', name: '산화 공정 개요', icon: '🔥', tier: 'basic' },
      { id: 'thermal', name: '열산화 실험', icon: '🌡️', tier: 'core' },
      { id: 'analysis', name: '산화 영향 인자', icon: '📊', tier: 'core' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic' },
      { id: 'troubleshooting', name: '트러블슈팅', icon: '🔧', tier: 'advanced' },
    ]
  },
  {
    id: 'lithograph',
    name: 'Lithography',
    icon: '💡',
    color: '#9c27b0',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic' },
      { id: 'overview1', name: '공정 개요 1', icon: '📋', tier: 'basic' },
      { id: 'overview2', name: '공정 개요 2', icon: '📷', tier: 'basic' },
      { id: 'process', name: 'PR Coating', icon: '⚙️', tier: 'core' },
      { id: 'exposure', name: '노광 방식 비교', icon: '💡', tier: 'core' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic' },
    ]
  },
  {
    id: 'plasma',
    name: 'Plasma I',
    icon: '⚡',
    color: '#2196f3',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic' },
      { id: 'plasma-basics', name: '플라즈마 기본', icon: '⚡', tier: 'core' },
      { id: 'plasma-principle1', name: '발생원리 1', icon: '🔬', tier: 'core' },
      { id: 'plasma-principle2', name: '발생원리 2', icon: '📈', tier: 'basic' },
      { id: 'rf-matching', name: 'RF 매칭', icon: '📡', tier: 'advanced' },
      { id: 'system-structure', name: 'CCP 구조', icon: '🏗️', tier: 'advanced' },
    ]
  },
  {
    id: 'plasma-ii',
    name: 'Plasma II',
    icon: '🔬',
    color: '#3f51b5',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic' },
      { id: 'system-structure-icp', name: 'ICP 구조', icon: '🔬', tier: 'core' },
      { id: 'etching-process', name: '식각 공정', icon: '⚙️', tier: 'core' },
      { id: 'deposition-process', name: '증착 공정', icon: '🏗️', tier: 'basic' },
      { id: 'equipment-application', name: '장비 응용', icon: '🏭', tier: 'advanced' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic' },
    ]
  },
  {
    id: 'etching',
    name: 'Etching',
    icon: '⚗️',
    color: '#607d8b',
    tabs: [
      { id: 'theory', name: '이론', icon: '🎬', tier: 'basic' },
      { id: 'overview', name: '식각 공정 개요', icon: '📋', tier: 'basic' },
      { id: 'etch-elements', name: '식각 요소', icon: '🔬', tier: 'core' },
      { id: 'process', name: '식각 원리', icon: '🧪', tier: 'core' },
      { id: 'analysis', name: 'Si식각메커니즘', icon: '📊', tier: 'advanced' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic' },
    ]
  },
  {
    id: 'deposition',
    name: 'Deposition',
    icon: '📦',
    color: '#795548',
    tabs: [
      { id: 'theory', name: '개요', icon: '📚', tier: 'basic' },
      { id: 'pvd-evap', name: 'PVD (증발)', icon: '🔥', tier: 'core' },
      { id: 'pvd-sputtering', name: 'PVD (스퍼터링)', icon: '🎯', tier: 'core' },
      { id: 'cvd-thermal', name: 'CVD (Thermal)', icon: '🌡️', tier: 'basic' },
      { id: 'cvd-pecvd', name: 'PECVD', icon: '⚡', tier: 'advanced' },
      { id: 'ald', name: 'ALD', icon: '⚛️', tier: 'advanced' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic' },
    ]
  },
  {
    id: 'implantation',
    name: 'Implantation',
    icon: '⚛️',
    color: '#3f51b5',
    tabs: [
      { id: 'theory', name: '이론', icon: '📖', tier: 'basic' },
      { id: 'diffusion', name: '확산 공정', icon: '📈', tier: 'core' },
      { id: 'implantation', name: '이온 주입', icon: '🎯', tier: 'core' },
      { id: 'comparison', name: '공정 비교', icon: '🔄', tier: 'basic' },
      { id: 'temperature', name: 'Annealing', icon: '🌡️', tier: 'basic' },
      { id: 'rta', name: 'RTA', icon: '⚙️', tier: 'advanced' },
      { id: 'application', name: '적용 가이드', icon: '💡', tier: 'advanced' },
      { id: 'quiz', name: '퀴즈', icon: '🏆', tier: 'basic' },
    ]
  },
  {
    id: 'metallization-eds-packaging',
    name: '배선검사패키징',
    icon: '🔌',
    color: '#ff9800',
    tabs: [
      { id: 'overview', name: '개요', icon: '📚', tier: 'basic' },
      { id: 'metallization', name: '금속배선', icon: '🔌', tier: 'core' },
      { id: 'damascene', name: 'Damascene', icon: '⚙️', tier: 'core' },
      { id: 'eds', name: 'EDS', icon: '🔍', tier: 'basic' },
      { id: 'packaging', name: '패키징', icon: '📦', tier: 'basic' },
      { id: 'bonding', name: '본딩', icon: '🔗', tier: 'advanced' },
      { id: 'quiz', name: '퀴즈', icon: '📝', tier: 'basic' },
    ]
  },
  {
    id: 'comprehensive-assessment',
    name: '종합평가',
    icon: '🏆',
    color: '#e91e63',
    tabs: [
      { id: 'basic', name: '기초 평가', icon: '📝', tier: 'core' },
      { id: 'advanced', name: '심화 평가', icon: '🏆', tier: 'advanced' },
    ]
  },
];

// 티어별 스타일 설정
const tierStyles = {
  core: {
    border: 'border-orange-300',
    bg: 'bg-gradient-to-br from-orange-50 to-red-50',
    hoverBg: 'hover:from-orange-100 hover:to-red-100',
    badge: 'bg-orange-500 text-white',
    badgeText: '추천',
    shadow: 'shadow-md shadow-orange-100',
    hoverShadow: 'hover:shadow-lg hover:shadow-orange-200',
    ring: 'ring-2 ring-orange-200',
  },
  basic: {
    border: 'border-blue-200',
    bg: 'bg-gradient-to-br from-blue-50 to-gray-50',
    hoverBg: 'hover:from-blue-100 hover:to-gray-100',
    badge: 'bg-blue-400 text-white',
    badgeText: '기본',
    shadow: 'shadow-sm',
    hoverShadow: 'hover:shadow-md',
    ring: '',
  },
  advanced: {
    border: 'border-gray-200',
    bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
    hoverBg: 'hover:from-gray-100 hover:to-gray-150',
    badge: 'bg-gray-400 text-white',
    badgeText: '고급',
    shadow: 'shadow-sm',
    hoverShadow: 'hover:shadow-md',
    ring: '',
    opacity: 'opacity-70 hover:opacity-100',
  },
};

const MatrixDashboard = ({ onNavigate }) => {
  const [filterTier, setFilterTier] = useState('all');
  const [hoveredCell, setHoveredCell] = useState(null);

  const filteredData = matrixData.map(process => ({
    ...process,
    tabs: filterTier === 'all'
      ? process.tabs
      : process.tabs.filter(tab => tab.tier === filterTier)
  }));

  // 전체 셀 수 계산
  const totalCells = matrixData.reduce((sum, p) => sum + p.tabs.length, 0);
  const coreCells = matrixData.reduce((sum, p) => sum + p.tabs.filter(t => t.tier === 'core').length, 0);
  const basicCells = matrixData.reduce((sum, p) => sum + p.tabs.filter(t => t.tier === 'basic').length, 0);
  const advancedCells = matrixData.reduce((sum, p) => sum + p.tabs.filter(t => t.tier === 'advanced').length, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              반도체 8대공정 학습 매트릭스
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              공정별 학습 콘텐츠를 한눈에 보고 원하는 항목을 클릭하세요 — 총 {totalCells}개 콘텐츠
            </p>
          </div>

          {/* 필터 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTier('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterTier === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체 ({totalCells})
            </button>
            <button
              onClick={() => setFilterTier('core')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                filterTier === 'core'
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <span>🔥</span> 핵심 ({coreCells})
            </button>
            <button
              onClick={() => setFilterTier('basic')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                filterTier === 'basic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <span>🧪</span> 체험 ({basicCells})
            </button>
            <button
              onClick={() => setFilterTier('advanced')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                filterTier === 'advanced'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>🔒</span> 고급 ({advancedCells})
            </button>
          </div>
        </div>
      </div>

      {/* 매트릭스 그리드 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4 max-w-7xl mx-auto">
          {filteredData.map((process) => (
            process.tabs.length > 0 && (
              <div key={process.id} className="group">
                {/* 공정 행 헤더 */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-bold min-w-[160px]"
                    style={{ backgroundColor: process.color }}
                  >
                    <span className="text-lg">{process.icon}</span>
                    <span>{process.name}</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-400">{process.tabs.length}개</span>
                </div>

                {/* 탭 카드 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 pl-2">
                  {process.tabs.map((tab) => {
                    const style = tierStyles[tab.tier];
                    const cellKey = `${process.id}-${tab.id}`;
                    const isHovered = hoveredCell === cellKey;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => onNavigate(process.id, tab.id)}
                        onMouseEnter={() => setHoveredCell(cellKey)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`
                          relative flex flex-col items-center justify-center
                          p-3 rounded-xl border-2 cursor-pointer
                          transition-all duration-200 ease-out
                          ${style.border} ${style.bg} ${style.hoverBg}
                          ${style.shadow} ${style.hoverShadow}
                          ${style.ring || ''}
                          ${style.opacity || ''}
                          ${isHovered ? 'scale-105 -translate-y-1' : ''}
                          min-h-[100px]
                        `}
                      >
                        {/* 티어 뱃지 */}
                        {tab.tier === 'core' && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-500 text-white shadow-sm">
                            🔥 추천
                          </span>
                        )}
                        {tab.tier === 'advanced' && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-400 text-white shadow-sm">
                            🔒
                          </span>
                        )}

                        {/* 아이콘 */}
                        <span className="text-2xl mb-1.5">{tab.icon}</span>

                        {/* 공정명-탭명 */}
                        <div className="text-center">
                          <div className="text-[11px] font-medium text-gray-400 leading-tight">
                            {process.name}
                          </div>
                          <div className="text-xs font-bold text-gray-700 leading-tight mt-0.5">
                            {tab.name}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>

        {/* 범례 */}
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300"></div>
              <span>🔥 핵심 / 추천 — 무조건 클릭!</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-blue-200"></div>
              <span>🧪 체험 / 기본</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 opacity-70"></div>
              <span>🔒 고급 / 확장</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixDashboard;
