import React, { useState, useEffect } from 'react';

// Icon components
const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);

const ResetIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"/>
  </svg>
);

const DepositionSimulator = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [isSimulating, setIsSimulating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // 애니메이션 루프
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setAnimationStep(prev => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const tabs = [
    { id: 'theory', name: '개요', icon: '📚' },
    { id: 'pvd-evap', name: 'PVD (증발)', icon: '🔥' },
    { id: 'pvd-sputtering', name: 'PVD (스퍼터링)', icon: '🎯' },
    { id: 'cvd-thermal', name: 'CVD (Thermal)', icon: '🌡️' },
    { id: 'cvd-pecvd', name: 'CVD (PECVD)', icon: '⚡' },
    { id: 'ald', name: 'ALD', icon: '⚛️' },
    { id: 'quiz', name: '평가', icon: '📝' }
  ];

  const startSimulation = () => {
    setIsSimulating(true);
    setAnimationStep(0);
  };

  const pauseSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setAnimationStep(0);
  };

  const renderTheoryTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-purple-500 to-pink-600 rounded-xl shadow-2xl p-8 text-white min-h-[600px] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="text-6xl mb-4">🔬⚛️</div>
          <h2 className="text-4xl font-bold mb-4">
            반도체 증착공정 분자 시뮬레이터
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
            PVD, CVD, ALD의 분자 수준 메커니즘을 시각적으로 학습하세요!<br/>
            <span className="text-yellow-300 font-bold">단계별 가이드</span>로 쉽고 재미있게!
          </p>
          <div className="mt-8 space-y-4 text-left max-w-xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">🔥 PVD 증발</h3>
              <p className="text-sm">열에너지로 소스를 기화시켜 기판에 증착</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">🎯 PVD 스퍼터링</h3>
              <p className="text-sm">아르곤 이온 충돌로 타겟 원자 방출</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">🌡️ CVD (Thermal/PECVD)</h3>
              <p className="text-sm">화학반응을 통한 박막 형성</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">⚛️ ALD</h3>
              <p className="text-sm">원자층 단위의 정밀한 증착</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPVDEvaporationTab = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-orange-800 mb-4">
          🔥 PVD (Evaporation) - 열 증발법
        </h2>
        <p className="text-gray-700 text-lg">
          타겟 재료를 가열하여 증발시키고, 증발된 원자들이 기판에 직선으로 이동하여 증착되는 방법입니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">⚛️ 증발 메커니즘</h3>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">시뮬레이션 영역</p>
          <div className="mt-4">
            <div className="inline-block animate-bounce text-4xl">🔥</div>
          </div>
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={startSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <PlayIcon />
            시작
          </button>
          <button
            onClick={pauseSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <PauseIcon />
            일시정지
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <ResetIcon />
            리셋
          </button>
        </div>
      </div>
    </div>
  );

  const renderPVDSputteringTab = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          🎯 PVD (Sputtering) - 스퍼터링법
        </h2>
        <p className="text-gray-700 text-lg">
          고에너지 이온으로 타겟을 충돌시켜 원자를 물리적으로 방출시켜 기판에 증착시키는 방법입니다.
        </p>
      </div>
    </div>
  );

  const renderThermalCVDTab = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          🌡️ CVD (Thermal CVD) - 열 화학기상증착
        </h2>
        <p className="text-gray-700 text-lg">
          순수한 열에너지를 이용하여 전구체 가스를 분해하고 기판 표면에서 화학반응을 통해 막을 형성하는 방법입니다.
        </p>
      </div>
    </div>
  );

  const renderPECVDTab = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          ⚡ CVD (PECVD) - 플라즈마 보조 화학기상증착
        </h2>
        <p className="text-gray-700 text-lg">
          플라즈마의 고에너지 전자를 이용하여 저온에서 전구체 가스를 분해하고 화학반응을 촉진하여 막을 형성하는 방법입니다.
        </p>
      </div>
    </div>
  );

  const renderALDTab = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          ⚛️ ALD (Atomic Layer Deposition) - 원자층 증착
        </h2>
        <p className="text-gray-700 text-lg">
          전구체를 순차적으로 주입하여 자기제한적 표면반응을 통해 원자층 단위로 정밀하게 증착하는 방법입니다.
        </p>
      </div>
    </div>
  );

  const renderQuizTab = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-amber-800 mb-4">📝 분자 메커니즘 퀴즈</h3>
        <p className="text-gray-700">
          PVD, CVD, ALD의 분자 수준 메커니즘에 대한 이해도를 확인해보세요.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theory':
        return renderTheoryTab();
      case 'pvd-evap':
        return renderPVDEvaporationTab();
      case 'pvd-sputtering':
        return renderPVDSputteringTab();
      case 'cvd-thermal':
        return renderThermalCVDTab();
      case 'cvd-pecvd':
        return renderPECVDTab();
      case 'ald':
        return renderALDTab();
      case 'quiz':
        return renderQuizTab();
      default:
        return renderTheoryTab();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-sm border border-blue-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DepositionSimulator;
