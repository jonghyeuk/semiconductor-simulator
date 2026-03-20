import React, { useState, useEffect, useRef, useMemo } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

// 플라즈마 파티클 애니메이션 (왼쪽 패널)
const PlasmaAnimation = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 300;
    const H = canvas.height = 500;

    // 파티클 초기화
    const types = [
      { color: '#60A5FA', size: 2, count: 40, label: 'e⁻' },    // 전자 (파랑)
      { color: '#F87171', size: 3.5, count: 25, label: 'Ar⁺' }, // 이온 (빨강)
      { color: '#9CA3AF', size: 2.5, count: 20, label: 'Ar' },  // 중성 (회색)
    ];

    particlesRef.current = types.flatMap(t =>
      Array.from({ length: t.count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: t.color,
        size: t.size + Math.random() * 1,
        glow: t.label === 'e⁻',
      }))
    );

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.fillRect(0, 0, W, H);

      particlesRef.current.forEach(p => {
        // 브라운 운동
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy += (Math.random() - 0.5) * 0.3;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 3) { p.vx = (p.vx / speed) * 3; p.vy = (p.vy / speed) * 3; }

        p.x += p.vx;
        p.y += p.vy;

        // 경계 반사
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        p.x = Math.max(0, Math.min(W, p.x));
        p.y = Math.max(0, Math.min(H, p.y));

        // 글로우 효과
        if (p.glow) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    // 초기 배경
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, W, H);
    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="rounded-lg opacity-80" style={{ width: 300, height: 500 }} />
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-blue-300/70 font-mono">Plasma Simulation</p>
        <div className="flex justify-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> e⁻
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Ar⁺
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> Ar
          </span>
        </div>
      </div>
    </div>
  );
};

// RTA 온도 그래프 + 스퍼터링 애니메이션 (오른쪽 패널)
const RTAAnimation = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 온도 프로파일 생성 (Ramp → Hold → Cool)
  const getTemp = (t) => {
    if (t < 50) return 25 + (t / 50) * 975;          // Ramp up
    if (t < 120) return 1000 + Math.sin(t * 0.1) * 5; // Hold (미세 흔들림)
    if (t < 180) return 1000 - ((t - 120) / 60) * 975; // Cool down
    return 25;
  };

  const graphPoints = useMemo(() => {
    const pts = [];
    const count = Math.min(time, 199);
    for (let i = 0; i <= count; i++) {
      const x = 30 + (i / 200) * 240;
      const y = 180 - (getTemp(i) / 1100) * 160;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [time]);

  const currentTemp = getTemp(time);
  const currentX = 30 + (time / 200) * 240;
  const currentY = 180 - (currentTemp / 1100) * 160;

  // 스퍼터링 파티클들
  const sputterParticles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (Math.PI / 6) + (Math.random() * Math.PI * 2 / 3);
      const speed = 0.5 + Math.random() * 1.5;
      const phase = (time * 3 + i * 30) % 100;
      return {
        id: i,
        x: 150 + Math.cos(angle) * phase * speed * 0.8,
        y: 340 - Math.abs(Math.sin(angle)) * phase * speed * 0.6,
        opacity: Math.max(0, 1 - phase / 80),
        size: 2 + Math.random() * 2,
      };
    });
  }, [time]);

  return (
    <div className="relative h-full flex flex-col items-center justify-center gap-4">
      {/* RTA 온도 그래프 */}
      <div className="relative">
        <svg width="300" height="200" className="opacity-80">
          <defs>
            <linearGradient id="tempGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* 그리드 */}
          {[200, 400, 600, 800, 1000].map(temp => {
            const y = 180 - (temp / 1100) * 160;
            return (
              <g key={temp}>
                <line x1="30" y1={y} x2="270" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                <text x="26" y={y + 3} fill="#64748B" fontSize="8" textAnchor="end">{temp}</text>
              </g>
            );
          })}

          {/* 시간축 */}
          <line x1="30" y1="180" x2="270" y2="180" stroke="#475569" strokeWidth="0.5" />
          <text x="150" y="196" fill="#64748B" fontSize="8" textAnchor="middle">Time (s)</text>
          <text x="8" y="100" fill="#64748B" fontSize="8" textAnchor="middle" transform="rotate(-90, 8, 100)">Temp (°C)</text>

          {/* 목표 온도 점선 */}
          <line x1="30" y1={180 - (1000 / 1100) * 160} x2="270" y2={180 - (1000 / 1100) * 160} stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.5" />

          {/* 영역 채우기 */}
          {graphPoints && (
            <polygon
              points={`30,180 ${graphPoints} ${currentX},180`}
              fill="url(#areaGrad)"
            />
          )}

          {/* 온도 커브 */}
          <polyline fill="none" stroke="url(#tempGrad)" strokeWidth="2.5" strokeLinecap="round" points={graphPoints} />

          {/* 현재 포인트 */}
          <circle cx={currentX} cy={currentY} r="4" fill="#EF4444" stroke="#fff" strokeWidth="1.5">
            <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
          </circle>

          {/* 현재 온도 표시 */}
          <rect x={currentX - 20} y={currentY - 18} width="40" height="14" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
          <text x={currentX} y={currentY - 8} fill="#F87171" fontSize="8" textAnchor="middle" fontFamily="monospace">
            {Math.round(currentTemp)}°C
          </text>
        </svg>
        <p className="text-xs text-orange-300/70 font-mono text-center mt-1">RTA Temperature Profile</p>
      </div>

      {/* 스퍼터링 시각화 */}
      <div className="relative">
        <svg width="300" height="200" className="opacity-80">
          {/* 타겟 (상단) */}
          <rect x="100" y="20" width="100" height="12" rx="2" fill="#6B7280" stroke="#9CA3AF" strokeWidth="0.5" />
          <text x="150" y="15" fill="#9CA3AF" fontSize="8" textAnchor="middle">Target (Al)</text>

          {/* 자기장 라인 */}
          {[0, 1, 2].map(i => (
            <ellipse
              key={i}
              cx="150"
              cy="35"
              rx={30 + i * 15}
              ry={8 + i * 4}
              fill="none"
              stroke="#818CF8"
              strokeWidth="0.5"
              opacity={0.3 - i * 0.08}
              strokeDasharray="3,5"
            >
              <animateTransform attributeName="transform" type="rotate" values={`0 150 35;${i % 2 === 0 ? 360 : -360} 150 35`} dur={`${6 + i * 2}s`} repeatCount="indefinite" />
            </ellipse>
          ))}

          {/* Ar⁺ 이온 충돌 */}
          {[0, 1, 2].map(i => {
            const x = 120 + i * 30;
            const phase = (time * 2 + i * 33) % 60;
            const y = 50 + phase * 0.5;
            return phase < 50 ? (
              <g key={`ion-${i}`}>
                <circle cx={x} cy={32 - (phase < 12 ? phase : 0)} r="3" fill="#F87171" opacity={phase < 12 ? 0.8 : 0} />
                {phase >= 12 && phase < 15 && (
                  <circle cx={x} cy="32" r={phase - 10} fill="none" stroke="#FCD34D" strokeWidth="1" opacity={0.6} />
                )}
              </g>
            ) : null;
          })}

          {/* 스퍼터된 원자 */}
          {sputterParticles.map(p => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.size} fill="#C0C0C0" opacity={p.opacity}>
              <animate attributeName="opacity" values={`${p.opacity};${p.opacity * 0.5};${p.opacity}`} dur="0.8s" repeatCount="indefinite" />
            </circle>
          ))}

          {/* 웨이퍼 (하단) */}
          <rect x="80" y="170" width="140" height="8" rx="2" fill="#4ECDC4" stroke="#2DD4BF" strokeWidth="0.5" />
          {/* 증착된 막 */}
          <rect x="80" y="166" width="140" height="4" rx="1" fill="#C0C0C0" opacity="0.6" />
          <text x="150" y="192" fill="#9CA3AF" fontSize="8" textAnchor="middle">Wafer (Si)</text>

          {/* 플라즈마 글로우 */}
          <ellipse cx="150" cy="90" rx="60" ry="30" fill="#818CF8" opacity="0.06">
            <animate attributeName="opacity" values="0.04;0.08;0.04" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </svg>
        <p className="text-xs text-purple-300/70 font-mono text-center mt-1">PVD Sputtering</p>
      </div>
    </div>
  );
};

const EmailGate = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'visitors'), {
        email: email.trim(),
        marketingConsent,
        visitedAt: serverTimestamp(),
        userAgent: navigator.userAgent,
      });

      localStorage.setItem('simulator_email', email.trim());
      onComplete();
    } catch (err) {
      console.error('Error saving email:', err);
      localStorage.setItem('simulator_email', email.trim());
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      {/* 왼쪽 패널 - 플라즈마 */}
      <div className="hidden lg:flex w-80 h-full items-center justify-center">
        <PlasmaAnimation />
      </div>

      {/* 중앙 폼 */}
      <div className="flex-shrink-0 mx-4 lg:mx-8">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-white/20">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">⚛️</div>
            <h2 className="text-lg font-bold text-gray-800">
              반도체 8대공정 시뮬레이터
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Demo Version</p>
            <p className="text-sm text-gray-500 mt-3">
              시작하려면 이메일을 입력해주세요
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />

            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}

            <label className="flex items-start mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 mr-2 rounded"
              />
              <span className="text-xs text-gray-500">
                교육 관련 소식을 보내드릴 수 있습니다.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '처리 중...' : '시작하기'}
            </button>
          </form>
        </div>
      </div>

      {/* 오른쪽 패널 - RTA + 스퍼터링 */}
      <div className="hidden lg:flex w-80 h-full items-center justify-center">
        <RTAAnimation />
      </div>
    </div>
  );
};

export default EmailGate;
