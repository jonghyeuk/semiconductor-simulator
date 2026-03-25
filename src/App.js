import React, { useState, useEffect, useRef } from 'react';
import MainPortal from './components/MainPortal';
import MatrixDashboard from './components/MatrixDashboard';
import EmailGate from './components/EmailGate';
import AdminPage from './components/AdminPage';
import { simulatorRegistry } from './utils/simulatorRegistry';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './utils/firebase';

const App = () => {
  const [activeSimulator, setActiveSimulator] = useState(null); // null = 매트릭스 대시보드
  const [activeTab, setActiveTab] = useState(null);
  const [emailVerified, setEmailVerified] = useState(
    () => !!localStorage.getItem('simulator_email')
  );
  const [showAdmin, setShowAdmin] = useState(false);
  const sessionStart = useRef(Date.now());

  // URL에 ?admin 붙으면 관리자 페이지 표시
  useEffect(() => {
    if (window.location.search.includes('admin')) {
      setShowAdmin(true);
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
        {/* 좌측 사이드바 */}
        <MainPortal
          activeSimulator={activeSimulator}
          onSimulatorChange={handleSimulatorChange}
          onAdminClick={() => setShowAdmin(true)}
          onBackToDashboard={() => setActiveSimulator(null)}
        />

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col">
          {CurrentSimulator ? (
            <CurrentSimulator initialTab={activeTab} />
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
