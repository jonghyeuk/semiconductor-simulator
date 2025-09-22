import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 개발 환경에서 시뮬레이터 개발 상태 로깅
if (process.env.NODE_ENV === 'development') {
  import('./utils/simulatorRegistry').then(({ devUtils }) => {
    devUtils.logDevProgress();
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 성능 측정 (선택적)
// reportWebVitals(console.log);
