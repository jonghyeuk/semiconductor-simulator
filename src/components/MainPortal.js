import React from 'react';
import { simulatorRegistry } from '../utils/simulatorRegistry';

const MainPortal = ({ activeSimulator, onSimulatorChange }) => {
  const simulators = simulatorRegistry.getAllSimulators();
  
  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          반도체 공정 시뮬레이터
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          v1.1 | 교육용 시뮬레이터
        </p>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="mt-4">
        {simulators.map((simulator) => (
          <div
            key={simulator.id}
            onClick={() => simulator.available && onSimulatorChange(simulator.id)}
            className={`px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors ${
              activeSimulator === simulator.id && simulator.available
                ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' 
                : simulator.available
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-400 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">{simulator.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{simulator.name}</div>
                {!simulator.available && (
                  <div className="text-xs text-gray-400 mt-1">준비중</div>
                )}
                {simulator.available && (
                  <div className="text-xs text-gray-500 mt-1">
                    {simulator.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MainPortal;
