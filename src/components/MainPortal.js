import React from 'react';
import { simulatorRegistry } from '../utils/simulatorRegistry';

// 모바일용 축약 이름
const mobileNames = {
  'vacuum': 'Vacuum',
  'cleaning': '세정',
  'oxidation': 'Oxidation',
  'lithograph': 'Litho',
  'plasma': 'Plasma I',
  'plasma-ii': 'Plasma II',
  'etching': 'Etching',
  'deposition': 'Deposition',
  'implantation': 'Implant',
  'metallization-eds-packaging': '배선/패키징',
  'comprehensive-assessment': '종합평가',
};

const MainPortal = ({ activeSimulator, onSimulatorChange, onAdminClick, onBackToDashboard, isOpen, onClose }) => {
  const simulators = simulatorRegistry.getAllSimulators();

  return (
    <>
      {/* 모바일 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-auto
      `}>
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                <span className="hidden sm:inline">반도체 공정 시뮬레이터</span>
                <span className="sm:hidden">반도체 시뮬레이터</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                v1.1 | 교육용 시뮬레이터
              </p>
            </div>
            {/* 모바일 닫기 버튼 */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {onBackToDashboard && (
            <button
              onClick={() => { onBackToDashboard(); onClose?.(); }}
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              <span>◀</span>
              <span>매트릭스 대시보드</span>
            </button>
          )}
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          {simulators.map((simulator) => (
            <div
              key={simulator.id}
              onClick={() => {
                if (simulator.available) {
                  onSimulatorChange(simulator.id);
                  onClose?.();
                }
              }}
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
                  {/* 데스크탑: 원래 이름, 모바일: 축약 이름 */}
                  <div className="font-medium">
                    <span className="hidden md:inline">{simulator.name}</span>
                    <span className="md:hidden">{mobileNames[simulator.id] || simulator.name}</span>
                  </div>
                  {!simulator.available && (
                    <div className="text-xs text-gray-400 mt-1">준비중</div>
                  )}
                  {simulator.available && (
                    <div className="text-xs text-gray-500 mt-1 hidden md:block">
                      {simulator.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* 하단 링크 */}
        <div className="p-3 border-t border-gray-200 flex items-center justify-between">
          <a
            href="https://kr.semifabai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="mr-1.5">→</span>
            정식 버전 바로가기
          </a>
          <button
            onClick={onAdminClick}
            className="text-gray-300 hover:text-gray-500 transition-colors"
            title="관리자"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPortal;
