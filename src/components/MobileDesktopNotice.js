import React, { useState } from 'react';

const MobileDesktopNotice = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="md:hidden bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start gap-3">
      <span className="text-lg flex-shrink-0 mt-0.5">💻</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">
          데스크탑에서 최적 체험
        </p>
        <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
          이 시뮬레이터는 PC/태블릿 환경에 최적화되어 있습니다. 모바일에서는 일부 기능이 제한될 수 있습니다.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-amber-400 hover:text-amber-600 p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default MobileDesktopNotice;
