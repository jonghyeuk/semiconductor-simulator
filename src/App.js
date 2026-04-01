import React, { useState, useEffect, useRef } from 'react';
import MainPortal from './components/MainPortal';
import MatrixDashboard from './components/MatrixDashboard';
import EmailGate from './components/EmailGate';
import AdminPage from './components/AdminPage';
import { simulatorRegistry } from './utils/simulatorRegistry';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './utils/firebase';

// 잠금 탭 정의 (시뮬레이터:탭)
const LOCKED_TABS = new Set([
  'deposition:pvd-sputtering',
  'deposition:cvd-thermal',
  'deposition:cvd-pecvd',
  'deposition:ald',
]);

// 시뮬레이터별 탭 오버레이 위치 (top: 타이틀 아래부터, height: 탭 바 높이)
// height: 0 → 오버레이 안 씌움 (탭 전환 허용)
const TAB_OVERLAY = {
  'plasma':                   { top: 80, height: 52 },
  'plasma-ii':                { top: 80, height: 52 },
  'comprehensive-assessment': { top: 0, height: 0 },
};
const DEFAULT_TAB_OVERLAY = { top: 0, height: 58 };

const App = () => {
  const [activeSimulator, setActiveSimulator] = useState(null); // null = 매트릭스 대시보드
  const [activeTab, setActiveTab] = useState(null);
  const [emailVerified, setEmailVerified] = useState(
    () => !!localStorage.getItem('simulator_email')
  );
  const [showAdmin, setShowAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sessionStart = useRef(Date.now());

  // URL에 ?admin 붙으면 관리자 페이지 표시
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin')) {
      setShowAdmin(true);
    }
    // ?sim=vacuum 등으로 특정 시뮬레이터 바로 열기
    const simParam = params.get('sim');
    if (simParam && simulatorRegistry.getSimulator(simParam)) {
      setActiveSimulator(simParam);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // 체류시간 기록 (페이지 떠날 때)
  useEffect(() => {
    if (!emailVerified) return;

    const recordDuration = () => {
      const seconds = Math.round((Date.now() - sessionStart.current) / 1000);
      const email = localStorage.getItem('simulator_email');
      if (!email) return;

      navigator.sendBeacon?.(
        `https://firestore.googleapis.com/v1/projects/${
          process.env.REACT_APP_FIREBASE_PROJECT_ID || 'semiconductor-edu-simul'
        }/databases/(default)/documents/sessions`,
        JSON.stringify({
          fields: {
            email: { stringValue: email },
            durationSeconds: { integerValue: String(seconds) },
            endedAt: { timestampValue: new Date().toISOString() },
          },
        })
      );
    };

    window.addEventListener('beforeunload', recordDuration);
    return () => window.removeEventListener('beforeunload', recordDuration);
  }, [emailVerified]);

  // 매트릭스에서 카드 클릭 시 해당 시뮬레이터+탭으로 이동
  const handleMatrixNavigate = (simulatorId, tabId) => {
    setActiveSimulator(simulatorId);
    setActiveTab(tabId);
  };

  // 사이드바에서 시뮬레이터 클릭 시
  const handleSimulatorChange = (simulatorId) => {
    setActiveSimulator(simulatorId);
    setActiveTab(null); // 탭 리셋
  };

  // 현재 활성화된 시뮬레이터 컴포넌트 가져오기
  const CurrentSimulator = activeSimulator
    ? simulatorRegistry.getSimulator(activeSimulator)
    : null;

  // 현재 잠금 상태인지
  const isLocked = LOCKED_TABS.has(`${activeSimulator}:${activeTab}`);

  // 매트릭스 대시보드 모드
  if (!activeSimulator) {
    return (
      <>
        {!emailVerified && <EmailGate onComplete={() => setEmailVerified(true)} />}
        {showAdmin && <AdminPage onClose={() => setShowAdmin(false)} />}
        <MatrixDashboard onNavigate={handleMatrixNavigate} />
      </>
    );
  }

  return (
    <>
      {!emailVerified && <EmailGate onComplete={() => setEmailVerified(true)} />}

      {showAdmin && <AdminPage onClose={() => setShowAdmin(false)} />}

      <div className="flex h-screen bg-gray-100">
        {/* 모바일 상단 헤더바 */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 flex items-center px-3 py-2 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-2 text-sm font-bold text-gray-800 truncate">
            {simulatorRegistry.getSimulatorInfo(activeSimulator)?.icon}{' '}
            {simulatorRegistry.getSimulatorInfo(activeSimulator)?.name}
          </span>
        </div>

        {/* 좌측 사이드바 */}
        <div className="relative hidden md:block">
          <MainPortal
            activeSimulator={activeSimulator}
            onSimulatorChange={handleSimulatorChange}
            onAdminClick={() => setShowAdmin(true)}
            onBackToDashboard={() => setActiveSimulator(null)}
            isOpen={true}
            onClose={() => {}}
          />
          {/* 사이드바 시뮬레이터 목록 비활성화 (헤더+대시보드 버튼, 하단 정식버전/관리자 제외) */}
          <div className="absolute left-0 right-0 z-40" style={{ top: '105px', bottom: '56px', backgroundColor: 'rgba(255,255,255,0.5)' }}>
          </div>
        </div>

        {/* 모바일 사이드바 (오버레이) */}
        <div className="md:hidden">
          <MainPortal
            activeSimulator={activeSimulator}
            onSimulatorChange={handleSimulatorChange}
            onAdminClick={() => setShowAdmin(true)}
            onBackToDashboard={() => { setActiveSimulator(null); setSidebarOpen(false); }}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col relative pt-12 md:pt-0">
          {CurrentSimulator ? (
            <>
              <CurrentSimulator initialTab={activeTab} />
              {/* 탭 네비게이션 비활성화 오버레이 (타이틀은 보이고, 탭 바만 덮음) */}
              {activeTab && (() => {
                const overlay = TAB_OVERLAY[activeSimulator] || DEFAULT_TAB_OVERLAY;
                if (overlay.height === 0) return null;
                return (
                  <div className="absolute left-0 right-0 z-40 bg-white hidden md:block" style={{ top: `${overlay.top}px`, height: `${overlay.height}px` }}>
                  </div>
                );
              })()}
              {/* 잠금 오버레이 */}
              {LOCKED_TABS.has(`${activeSimulator}:${activeTab}`) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center"
                     style={{ backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(2px)' }}>
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center mx-4">
                    <div className="text-5xl mb-4">🔬</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      정식 버전에서 체험할 수 있습니다
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                      이 시뮬레이션의 전체 기능은 정식 버전에서 이용 가능합니다.<br/>
                      100개 이상의 시뮬레이터와 심화 학습 콘텐츠를 만나보세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="https://kr.semifabai.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        정식 버전 알아보기
                      </a>
                      <button
                        onClick={() => { setActiveSimulator(null); setActiveTab(null); }}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                      >
                        데모 첫 화면으로
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
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
    </>
  );
};

export default App;
