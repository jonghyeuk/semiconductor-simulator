import React, { useState } from 'react';
import MainPortal from './components/MainPortal';
import { simulatorRegistry } from './utils/simulatorRegistry';

const App = () => {
  const [activeSimulator, setActiveSimulator] = useState('vacuum');
  
  // 현재 활성화된 시뮬레이터 컴포넌트 가져오기
  const CurrentSimulator = simulatorRegistry.getSimulator(activeSimulator);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 좌측 사이드바 */}
      <MainPortal 
        activeSimulator={activeSimulator}
        onSimulatorChange={setActiveSimulator}
      />
      
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {CurrentSimulator ? (
          <CurrentSimulator />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                시뮬레이터를 준비 중입니다
              </h2>
              <p className="text-gray-600">
                선택하신 시뮬레이터가 곧 준비됩니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
