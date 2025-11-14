import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Icon components (inline SVG to avoid lucide-react dependency)
const PlayIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
  </svg>
);

const RotateCcwIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
  </svg>
);

const GitCompareIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
  </svg>
);

const TargetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2}/>
    <circle cx="12" cy="12" r="6" strokeWidth={2}/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

const AwardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="6" strokeWidth={2}/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const HelpCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2}/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
  </svg>
);

// Use the icon components
const Play = PlayIcon;
const Pause = PauseIcon;
const Lightbulb = LightbulbIcon;
const RotateCcw = RotateCcwIcon;
const BookOpen = BookOpenIcon;
const AlertCircle = AlertCircleIcon;
const TrendingUp = TrendingUpIcon;
const GitCompare = GitCompareIcon;
const Target = TargetIcon;
const Award = AwardIcon;
const HelpCircle = HelpCircleIcon;
const CheckCircle = CheckCircleIcon;
const XCircle = XCircleIcon;

// Ion Beam System Diagram Component
const IonBeamSystemDiagram = () => {
  const [particles, setParticles] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [scanPosition, setScanPosition] = useState(135); // 웨이퍼 스캔 위치 (135-165로 확장)
  const [scanDirection, setScanDirection] = useState(1); // 1: 아래로, -1: 위로
  const animationRef = useRef();
  const particleIdRef = useRef(0);

  // 파티클 생성 함수 (굵은 빔 시작)
  const createParticle = () => {
    // 이온소스에서는 굵은 빔으로 여러 이온이 동시에 나옴
    const beamWidth = 20; // 빔의 폭
    const yOffset = (Math.random() - 0.5) * beamWidth; // -10 ~ +10 범위

    return {
      id: particleIdRef.current++,
      x: 150, // 이온소스 중앙
      y: 220 + yOffset, // 이온소스에서 y 좌표 분산
      progress: 0, // 전체 경로상의 진행도 (0-100)
      speed: 0.8 + Math.random() * 0.4, // 속도 랜덤
      initialY: 220 + yOffset, // 초기 y 좌표 저장 (집속 계산용)
      active: true
    };
  };

  // 경로상의 위치 계산 함수 (굵은 빔에서 집속 빔으로, 웨이퍼 스캐닝 포함)
  const getPositionOnPath = (progress, particle, currentScanPosition) => {
    const initialYOffset = particle.initialY - 220; // 초기 y 오프셋

    if (progress < 15) {
      // 이온소스에서 수직 상승 (0-15%): 굵은 빔 유지
      const localProgress = progress / 15;
      return {
        x: 150,
        y: particle.initialY - localProgress * 10 // 초기 y 위치에서 10픽셀 상승
      };
    } else if (progress < 40) {
      // 곡선 자석에서 90도 휘어짐 (15-40%): 굵은 빔이 함께 휘어짐
      const localProgress = (progress - 15) / 25;

      if (localProgress < 0.5) {
        // 첫 번째 구간: 수직 부분
        const segmentProgress = localProgress * 2;
        return {
          x: 150,
          y: (particle.initialY - 10) - segmentProgress * 20 + initialYOffset // 굵은 빔 유지
        };
      } else {
        // 곡선 구간: 베지어 곡선으로 휘어짐
        const segmentProgress = (localProgress - 0.5) * 2;
        const t = segmentProgress * 0.8;

        // 기본 곡선 경로
        const baseX = Math.pow(1-t, 2) * 150 + 2*(1-t)*t * 150 + Math.pow(t, 2) * 190;
        const baseY = Math.pow(1-t, 2) * (particle.initialY - 30) + 2*(1-t)*t * 150 + Math.pow(t, 2) * 150;

        if (segmentProgress > 0.8) {
          // 직선 구간으로 변환
          const lineProgress = (segmentProgress - 0.8) / 0.2;
          return {
            x: 190 + lineProgress * 20,
            y: 150 + initialYOffset * (1 - lineProgress * 0.3) // 약간의 집속 시작
          };
        }

        return {
          x: baseX,
          y: baseY + initialYOffset * (1 - t * 0.2) // 곡선에서 약간 집속 시작
        };
      }
    } else {
      // Variable Slit 이후 집속 및 수평 이동 (40-100%)
      const localProgress = (progress - 40) / 60;

      // 전체 수평 거리: 210 -> 720
      let x = 210 + localProgress * 510;
      let y = 150;

      // Variable Slit에서의 집속 효과 (x = 225-240)
      if (x >= 210 && x <= 240) {
        // Variable slit 영역에서 빔 집속 - y 오프셋이 0으로 수렴
        const focusProgress = (x - 210) / 30; // 0에서 1로
        const focusedOffset = initialYOffset * (1 - focusProgress); // 점진적으로 0에 수렴
        y += focusedOffset;

        // 집속 과정에서 약간의 진동
        y += Math.sin((x - 210) / 30 * Math.PI) * Math.abs(initialYOffset) * 0.1;
      } else {
        // Variable Slit 이후는 중심선 기준으로 진행

        // Vertical Scanner 영역에서 수직 진동 효과
        if (x > 470 && x < 510) {
          y += Math.sin((x - 470) * 0.4) * 3;
        }

        // Horizontal Scanner 영역에서 수평 진동 효과
        if (x > 530 && x < 570) {
          y += Math.sin((x - 530) * 0.3) * 4;
        }

        // 웨이퍼 근처에서 스캐닝 효과 (x > 650)
        if (x > 650) {
          // 스캔 위치로 점진적으로 이동
          const scanProgress = Math.min(1, (x - 650) / 70); // 650-720 구간에서 점진적 적용
          const targetY = currentScanPosition || 150; // 현재 스캔 위치
          y = 150 + (targetY - 150) * scanProgress;
        } else if (x > 570) {
          // 스캐너 이후 약간의 굴절 효과
          const deflectionProgress = (x - 570) / 80;
          y += Math.sin(deflectionProgress * Math.PI * 2) * 2;
        }
      }

      return { x, y };
    }
  };

  // 애니메이션 업데이트 (파티클 + 스캔 위치)
  const updateParticles = () => {
    // 스캔 위치 업데이트 (웨이퍼 중앙 위-중앙-중앙 아래 스캔)
    setScanPosition(prev => {
      const newPos = prev + scanDirection * 0.6; // 스캔 속도 조정
      if (newPos >= 165) { // 중앙 아래
        setScanDirection(-1); // 방향 반전 (위로)
        return 165;
      } else if (newPos <= 135) { // 중앙 위
        setScanDirection(1); // 방향 반전 (아래로)
        return 135;
      }
      return newPos;
    });

    setParticles(prev => {
      let updated = prev.map(particle => {
        if (!particle.active) return particle;

        const newProgress = particle.progress + particle.speed;

        if (newProgress >= 100) {
          // 타겟에 도달하면 파티클 제거
          return { ...particle, active: false };
        }

        const position = getPositionOnPath(newProgress, particle, scanPosition);
        return {
          ...particle,
          x: position.x,
          y: position.y,
          progress: newProgress
        };
      });

      // 비활성화된 파티클 제거
      updated = updated.filter(p => p.active);

      // 새 파티클 추가 (굵은 빔 효과를 위해 확률 증가)
      if (Math.random() < 0.4) { // 생성 확률 증가
        updated.push(createParticle());
      }

      return updated;
    });
  };

  // 애니메이션 루프
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        updateParticles();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, scanPosition, scanDirection]);

  // 초기 파티클들 생성 (굵은 빔 효과)
  useEffect(() => {
    const initialParticles = [];
    for (let i = 0; i < 6; i++) { // 파티클 수 증가 (3 -> 6)
      const particle = createParticle();
      particle.progress = i * 15; // 시차를 두고 배치
      const pos = getPositionOnPath(particle.progress, particle, 135); // 초기값으로 135 사용
      particle.x = pos.x;
      particle.y = pos.y;
      initialParticles.push(particle);
    }
    setParticles(initialParticles);
  }, []);

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">⚙️ Ion Beam System Diagram</h3>

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-5 py-2 rounded-lg font-semibold text-white transition-colors ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '일시정지' : '시작'}
        </button>
        <button
          onClick={() => {
            setParticles([]);
            particleIdRef.current = 0;
            setScanPosition(135);
            setScanDirection(1);
          }}
          className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
        >
          초기화
        </button>
      </div>

      <div className="border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-b from-gray-50 to-gray-100 mb-4">
        <svg
          width="100%"
          height="300"
          viewBox="0 0 800 300"
          className="w-full"
          style={{ backgroundColor: 'white' }}
        >
          {/* Background */}
          <defs>
            {/* Hatching pattern for acceleration tube */}
            <pattern id="hatchPattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <path d="M0,8 L8,0" stroke="#4A90E2" strokeWidth="1"/>
              <path d="M0,0 L8,8" stroke="#4A90E2" strokeWidth="1"/>
            </pattern>

            {/* Arrow marker for beam direction */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#E67E22"
                opacity="0.3"
              />
            </marker>

            {/* Gradient for magnet */}
            <linearGradient id="magnetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#95A5A6', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#7F8C8D', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#6C7B7D', stopOpacity: 1 }} />
            </linearGradient>

            {/* Gradient for wafer */}
            <linearGradient id="waferGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#5DADE2', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#3498DB', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2E86AB', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Ion Source (red rectangle) - positioned below the magnet */}
          <rect
            x="120"
            y="220"
            width="60"
            height="60"
            fill="#E74C3C"
            stroke="#C0392B"
            strokeWidth="2"
          />
          <text x="150" y="310" textAnchor="middle" fontSize="12" fontWeight="bold">ION SOURCE</text>

          {/* 90도 휘는 지점의 자석 극 - 작은 직사각형들 */}
          {/* 좌측상단 직사각형 - 135도 회전, 긴 변 확장 */}
          <rect
            x="130"
            y="130"
            width="35"
            height="15"
            fill="#27AE60"
            stroke="#229954"
            strokeWidth="1"
            transform="rotate(135 147.5 137.5)"
          />

          {/* 우측하단 직사각형 - 빔에 더 가깝게 이동, 135도 회전, 긴 변 확장 */}
          <rect
            x="170"
            y="170"
            width="35"
            height="15"
            fill="#27AE60"
            stroke="#229954"
            strokeWidth="1"
            transform="rotate(135 187.5 177.5)"
          />

          {/* Acceleration Tube - combined into single tube */}
          <rect
            x="270"
            y="130"
            width="180"
            height="40"
            fill="url(#hatchPattern)"
            stroke="#2980B9"
            strokeWidth="2"
          />
          <text x="360" y="125" textAnchor="middle" fontSize="10" fontWeight="bold">ACCELERATION TUBE</text>

          {/* Vertical Scanner - positioned in the center of ion beam path like a tube */}
          <rect
            x="470"
            y="140"
            width="40"
            height="20"
            fill="#F39C12"
            stroke="#E67E22"
            strokeWidth="2"
          />
          <text x="490" y="132" textAnchor="middle" fontSize="9" fontWeight="bold">VERTICAL SCANNER</text>

          {/* Horizontal Scanner - separated from vertical scanner, positioned to the right */}
          {/* Upper rectangle */}
          <rect
            x="530"
            y="120"
            width="40"
            height="15"
            fill="#F39C12"
            stroke="#E67E22"
            strokeWidth="2"
          />
          {/* Lower rectangle */}
          <rect
            x="530"
            y="165"
            width="40"
            height="15"
            fill="#F39C12"
            stroke="#E67E22"
            strokeWidth="2"
          />
          <text x="550" y="110" textAnchor="middle" fontSize="9" fontWeight="bold">HORIZONTAL SCANNER</text>

          {/* Variable slit for beam control - positioned after curved analyzer magnet */}
          <rect
            x="225"
            y="140"
            width="15"
            height="20"
            fill="#34495E"
            stroke="#2C3E50"
            strokeWidth="1"
          />
          <text x="232" y="125" textAnchor="middle" fontSize="8">VARIABLE SLIT</text>
          <text x="232" y="135" textAnchor="middle" fontSize="8">FOR BEAM</text>
          <text x="232" y="185" textAnchor="middle" fontSize="8">CONTROL</text>

          {/* Wafer (Target) - side view: thin and long, bigger size */}
          <rect
            x="720"
            y="100"
            width="10"
            height="100"
            fill="url(#waferGradient)"
            stroke="#2980B9"
            strokeWidth="2"
          />

          <text x="745" y="125" textAnchor="start" fontSize="12" fontWeight="bold">WAFER</text>
          <text x="745" y="185" textAnchor="start" fontSize="12" fontWeight="bold">(TARGET)</text>

          {/* Guide path (lighter color) - showing the beam trajectory */}
          {/* Vertical path from ion source */}
          <path
            d="M 150 220 L 150 210"
            stroke="#E67E22"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          {/* Smooth 90-degree curve inside magnet */}
          <path
            d="M 150 210
               L 150 190
               Q 150 150 190 150
               L 210 150"
            stroke="#E67E22"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          {/* Horizontal path after magnet through acceleration tubes and scanners */}
          <path
            d="M 210 150 L 240 150 L 270 150 L 370 150 L 450 150 L 510 150 L 570 150 L 720 150"
            stroke="#E67E22"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            opacity="0.3"
          />

          {/* 이온 파티클들 렌더링 */}
          {particles.map(particle => {
            // 이동 방향에 따른 꼬리 위치 계산
            let tailOffsetX = -8;
            let tailOffsetY = 0;
            let tail2OffsetX = -15;
            let tail2OffsetY = 0;

            if (particle.progress < 15) {
              // 수직 상승 구간 - 꼬리는 아래쪽
              tailOffsetX = 0;
              tailOffsetY = 8;
              tail2OffsetX = 0;
              tail2OffsetY = 15;
            } else if (particle.progress < 40) {
              // 곡선 구간 - 곡선에 따른 꼬리
              const curveProgress = (particle.progress - 15) / 25;
              if (curveProgress < 0.5) {
                // 여전히 수직
                tailOffsetX = 0;
                tailOffsetY = 8;
                tail2OffsetX = 0;
                tail2OffsetY = 15;
              } else {
                // 점진적으로 수평으로 전환
                const angle = curveProgress * Math.PI / 2;
                tailOffsetX = -8 * Math.cos(angle);
                tailOffsetY = 8 * Math.sin(angle);
                tail2OffsetX = -15 * Math.cos(angle);
                tail2OffsetY = 15 * Math.sin(angle);
              }
            }
            // else: 수평 구간은 기본값 사용 (왼쪽 꼬리)

            return (
              <g key={particle.id}>
                {/* 파티클 본체 */}
                <circle
                  cx={particle.x}
                  cy={particle.y}
                  r="3"
                  fill="#FF6B35"
                  stroke="#E55A2B"
                  strokeWidth="1"
                >
                  {/* 파티클 깜빡임 효과 */}
                  <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* 파티클 꼬리 효과 */}
                <circle
                  cx={particle.x + tailOffsetX}
                  cy={particle.y + tailOffsetY}
                  r="2"
                  fill="#FF6B35"
                  opacity="0.5"
                />
                <circle
                  cx={particle.x + tail2OffsetX}
                  cy={particle.y + tail2OffsetY}
                  r="1"
                  fill="#FF6B35"
                  opacity="0.3"
                />

                {/* Variable Slit에서 빔 집속 효과 */}
                {particle.x >= 210 && particle.x <= 240 && (
                  <>
                    {/* 집속 링 효과 */}
                    <circle
                      cx={232} // Variable slit 중심
                      cy={150} // 집속 중심
                      r="8"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="1"
                      opacity="0.4"
                    >
                      <animate
                        attributeName="r"
                        values="5;12;5"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* 파티클 주변 집속 효과 */}
                    <circle
                      cx={particle.x}
                      cy={particle.y}
                      r="4"
                      fill="none"
                      stroke="#00FFFF"
                      strokeWidth="1"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values="2;5;2"
                        dur="0.3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {/* 굵은 빔 구간에서 파티클 연결선 효과 (이온소스와 분석자석 구간) */}
                {particle.progress < 40 && Math.abs(particle.y - 150) > 5 && (
                  <line
                    x1={particle.x - 3}
                    y1={particle.y}
                    x2={particle.x + 3}
                    y2={particle.y}
                    stroke="#FF6B35"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                )}

                {/* 웨이퍼에 도달했을 때 임플란테이션 효과 */}
                {particle.x >= 715 && (
                  <>
                    {/* 충돌 효과 - 스캔 위치에서 발생 */}
                    <circle
                      cx={720}
                      cy={particle.y}
                      r="4"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="2"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="2;8;2"
                        dur="0.2s"
                        repeatCount="1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0;0.8"
                        dur="0.2s"
                        repeatCount="1"
                      />
                    </circle>
                    {/* 스파크 효과 */}
                    <circle
                      cx={718}
                      cy={particle.y - 2}
                      r="1"
                      fill="#FF6B35"
                      opacity="0.6"
                    />
                    <circle
                      cx={718}
                      cy={particle.y + 2}
                      r="1"
                      fill="#FF6B35"
                      opacity="0.6"
                    />
                    {/* 임플란테이션 트레일 효과 */}
                    <line
                      x1={720}
                      y1={particle.y}
                      x2={725}
                      y2={particle.y}
                      stroke="#00FFFF"
                      strokeWidth="1"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.7;0;0.7"
                        dur="0.1s"
                        repeatCount="3"
                      />
                    </line>
                  </>
                )}
                {particle.x >= 225 && particle.x <= 240 && (
                  <circle
                    cx={particle.x}
                    cy={particle.y}
                    r="5"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="1"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      values="3;6;3"
                      dur="0.3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Component Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 border border-red-700 rounded"></div>
          <span className="text-sm font-medium">Ion Source</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-500 border border-gray-700 rounded"></div>
          <span className="text-sm font-medium">Analyzer Magnet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-400 border border-blue-600 rounded"></div>
          <span className="text-sm font-medium">Acceleration Tube</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-400 border border-orange-600 rounded"></div>
          <span className="text-sm font-medium">Beam Scanner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 border border-blue-700 rounded"></div>
          <span className="text-sm font-medium">Wafer Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-orange-500"></div>
          <span className="text-sm font-medium">Ion Beam Path</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-3">📖 이온 주입 장치의 동작 원리</h4>
        <div className="text-sm text-gray-700 leading-relaxed space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-bold text-red-600 min-w-[20px]">1️⃣</span>
            <p><strong>이온 생성:</strong> Ion Source에서 가스(BF₃, PH₃ 등)를 플라즈마 상태로 만들어 다양한 이온들을 생성합니다. 이때 굵은 빔 형태로 여러 이온이 동시에 나옵니다.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-green-600 min-w-[20px]">2️⃣</span>
            <p><strong>질량 분리:</strong> Analyzer Magnet(곡선 자석)을 통과하면서 빔이 90도로 휘어집니다. 이때 원하는 질량의 이온만 선택되고 나머지는 걸러집니다.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-gray-600 min-w-[20px]">3️⃣</span>
            <p><strong>빔 집속:</strong> Variable Slit(슬릿)을 통과하면서 굵었던 빔이 좁고 얇은 빔으로 집속됩니다. 마치 물줄기가 좁은 틈을 통과하는 것과 같습니다.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-blue-600 min-w-[20px]">4️⃣</span>
            <p><strong>이온 가속:</strong> Acceleration Tube(가속관)에서 고전압을 가해 이온에게 높은 에너지를 줍니다. 이 에너지가 이온이 웨이퍼에 침투하는 깊이를 결정합니다.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-orange-600 min-w-[20px]">5️⃣</span>
            <p><strong>빔 스캐닝:</strong> Vertical/Horizontal Scanner가 빔의 방향을 조절하여 웨이퍼 전체 면적에 골고루 이온을 주입합니다. 애니메이션에서 웨이퍼 표면을 위아래로 스캔하는 모습을 볼 수 있습니다.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-purple-600 min-w-[20px]">6️⃣</span>
            <p><strong>이온 주입:</strong> 마지막으로 고속 이온이 웨이퍼 표면에 충돌하여 실리콘 내부로 침투합니다. 충돌 시 빛나는 효과(스파크)를 통해 주입 과정을 확인할 수 있습니다.</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-800 italic">
            💡 위 애니메이션은 실제 반도체 공정에서 사용되는 이온 주입 장치의 물리적 원리를 시각화한 것입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

const DopingProcessSimulator = () => {
  // State management
  const [activeTab, setActiveTab] = useState('theory');

  // Diffusion states
  const [diffProcessType, setDiffProcessType] = useState('predeposition');
  const [diffDopantType, setDiffDopantType] = useState('P');
  const [diffTemperature, setDiffTemperature] = useState(1000);
  const [diffTime, setDiffTime] = useState(30);
  const [diffSurfaceConc, setDiffSurfaceConc] = useState(1e20);
  const [diffBackgroundConc, setDiffBackgroundConc] = useState(1e15);
  
  // Implantation states
  const [implDopantType, setImplDopantType] = useState('B');
  const [implEnergy, setImplEnergy] = useState(50);
  const [implDose, setImplDose] = useState(1e15);
  const [implTilt, setImplTilt] = useState(7);
  const [implAnnealing, setImplAnnealing] = useState(false);
  const [annealTemp, setAnnealTemp] = useState(900);
  const [annealTime, setAnnealTime] = useState(30);
  const [deviceType, setDeviceType] = useState('custom');
  
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  
  // Theory opening animation states
  const [theoryStep, setTheoryStep] = useState(0);
  const [isTheoryPlaying, setIsTheoryPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showDetailedTheory, setShowDetailedTheory] = useState(false);
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Dopant properties
  const dopantProperties = {
    B: {
      name: 'Boron',
      nameKo: '붕소',
      type: 'p-type',
      Qd: 3.69,
      D0: 0.76,
      color: '#3b82f6',
      mass: 10.8
    },
    P: {
      name: 'Phosphorus',
      nameKo: '인',
      type: 'n-type',
      Qd: 3.66,
      D0: 3.85,
      color: '#ef4444',
      mass: 31.0
    },
    As: {
      name: 'Arsenic',
      nameKo: '비소',
      type: 'n-type',
      Qd: 4.08,
      D0: 0.32,
      color: '#8b5cf6',
      mass: 74.9
    },
    In: {
      name: 'Indium',
      nameKo: '인듐',
      type: 'p-type',
      Qd: 3.9,
      D0: 0.5,
      color: '#10b981',
      mass: 114.8
    },
    Sb: {
      name: 'Antimony',
      nameKo: '안티몬',
      type: 'n-type',
      Qd: 4.0,
      D0: 0.4,
      color: '#f59e0b',
      mass: 121.8
    }
  };

  // CMOS device presets for ion implantation
  const devicePresets = {
    custom: { name: '사용자 설정', energy: 50, dose: 1e15, ion: 'B', description: '직접 설정' },
    source_drain: { name: 'Source/Drain', energy: 30, dose: 1e15, ion: 'As', description: '50-200nm 깊이, 고농도' },
    ldd: { name: 'LDD (Lightly Doped Drain)', energy: 15, dose: 5e14, ion: 'P', description: '20-50nm 얕은 깊이, 저농도' },
    channel: { name: 'Channel 도핑', energy: 180, dose: 1e13, ion: 'B', description: '10-30nm 표면 근처, 문턱전압 조절' },
    well: { name: 'Well 도핑', energy: 150, dose: 1e13, ion: 'B', description: '1-3μm 깊이, 소자 분리' },
    halo: { name: 'Halo/Pocket', energy: 45, dose: 1e13, ion: 'In', description: '30-80nm, 펀치스루 방지' }
  };

  // Apply preset function
  const applyPreset = (presetKey) => {
    const preset = devicePresets[presetKey];
    if (preset && presetKey !== 'custom') {
      setImplEnergy(preset.energy);
      setImplDose(preset.dose);
      setImplDopantType(preset.ion);
    }
    setDeviceType(presetKey);
  };

  // Theory opening steps
  const theorySteps = [
    {
      title: "🎯 도핑(Doping)이란?",
      content: "반도체는 순수한 실리콘만으로는 전기가 잘 흐르지 않습니다. 마치 고속도로에 차가 없는 것과 같죠.\n\n" +
               "여기에 불순물을 아주 조금 넣어주면, 전자나 정공이 생겨서 전기가 흐를 수 있게 됩니다. " +
               "이것이 바로 '도핑(Doping)' 공정입니다.\n\n" +
               "💡 핵심: 실리콘 10억 개 중 단 1개만 바꿔도 전기적 특성이 완전히 달라집니다!",
      highlight: "도핑은 반도체의 전기적 특성을 제어하는 가장 핵심적인 공정입니다.",
      icon: "🎯"
    },
    {
      title: "🔬 두 가지 방법: 확산 vs 이온 주입",
      content: "도핑을 하는 방법은 크게 두 가지가 있습니다.\n\n" +
               "1️⃣ 확산(Diffusion): 고온에서 도펀트가 자연스럽게 스며들도록 하는 방법\n" +
               "   • 마치 물에 잉크를 떨어뜨리면 퍼지는 것처럼\n" +
               "   • 1950-1970년대의 주요 방법\n" +
               "   • 온도: 900-1200°C\n\n" +
               "2️⃣ 이온 주입(Ion Implantation): 이온을 고속으로 쏘아서 박아넣는 방법\n" +
               "   • 마치 다트를 던지듯이 정확한 위치에\n" +
               "   • 1980년대부터 현재까지의 표준\n" +
               "   • 정밀한 제어 가능",
      highlight: "현대 반도체는 주로 이온 주입을 사용하지만, 두 방법을 모두 이해하는 것이 중요합니다.",
      icon: "🔬"
    },
    {
      title: "📈 왜 이온 주입으로 바뀌었을까?",
      content: "반도체 기술이 발전하면서 요구사항이 달라졌습니다.\n\n" +
               "초기(~1970년대): 마이크로미터(μm) 단위 → 확산으로 충분\n" +
               "현대(2020년대): 나노미터(nm) 단위 → 정밀 제어 필수!\n\n" +
               "🎯 이온 주입의 핵심 장점:\n" +
               "   • 정확한 dose(개수) 제어 - 몇 개를 넣었는지 정확히 알 수 있음\n" +
               "   • 정확한 깊이 제어 - 에너지로 깊이를 조절\n" +
               "   • 저온 공정 - Photoresist 마스크 사용 가능\n" +
               "   • 재현성 우수 - 공정이 일정함\n\n" +
               "💡 7nm 칩에서 1nm 오차는 치명적입니다. 정밀도가 생명!",
      highlight: "나노미터 시대에는 '대충'이 없습니다. 원자 하나하나가 중요합니다.",
      icon: "📈"
    },
    {
      title: "🏭 실무에서의 중요성",
      content: "도핑 공정은 반도체 제조의 약 30%를 차지하는 핵심 공정입니다.\n\n" +
               "📱 스마트폰 칩(AP): 수십 번의 이온 주입 반복\n" +
               "💾 메모리(DRAM, NAND): 정밀한 도핑으로 셀 특성 제어\n" +
               "🚗 전력반도체(IGBT, SiC): 고온 확산으로 깊은 영역 형성\n\n" +
               "실제 공정 엔지니어는:\n" +
               "   • TCAD 시뮬레이션으로 최적 조건 찾기\n" +
               "   • SIMS로 실제 프로파일 측정 및 검증\n" +
               "   • 공정 조건 미세 조정하여 수율 향상\n\n" +
               "💰 도핑 공정 최적화 → 칩 성능 10% 향상 → 수억 달러 매출 증가!",
      highlight: "이론만으로는 부족합니다. 시뮬레이터로 직접 조건을 바꿔가며 이해해야 합니다.",
      icon: "🏭"
    },
    {
      title: "🎓 이 시뮬레이터로 배울 내용",
      content: "이제 여러분은 실제 엔지니어처럼 도핑 공정을 체험하게 됩니다!\n\n" +
               "📚 배울 내용:\n\n" +
               "1️⃣ 확산 공정 시뮬레이터\n" +
               "   • 온도, 시간에 따른 프로파일 변화\n" +
               "   • Pre-deposition vs Drive-in 비교\n" +
               "   • Fick's Law의 실제 적용\n\n" +
               "2️⃣ 이온 주입 시뮬레이터\n" +
               "   • 에너지, Dose로 프로파일 제어\n" +
               "   • Annealing 효과 확인\n" +
               "   • Gaussian 분포 이해\n\n" +
               "3️⃣ 공정 비교\n" +
               "   • 두 방법의 프로파일 직접 비교\n" +
               "   • 각 공정의 장단점 파악\n" +
               "   • 실무 적용 사례 학습\n\n" +
               "4️⃣ 온도 영향 분석\n" +
               "   • Arrhenius 방정식의 위력\n" +
               "   • RTA vs Furnace annealing\n\n" +
               "5️⃣ 실무 가이드\n" +
               "   • Decision tree로 공정 선택\n" +
               "   • CMOS, Power 소자 적용\n" +
               "   • 산업 트렌드\n\n" +
               "6️⃣ 퀴즈\n" +
               "   • 이해도 점검\n" +
               "   • 핵심 개념 복습",
      highlight: "자, 이제 시작해볼까요? 각 탭을 클릭하여 도핑 공정의 세계로 들어가세요!",
      icon: "🎓"
    }
  ];

  // Typing animation effect for theory
  useEffect(() => {
    if (isTheoryPlaying && theoryStep < theorySteps.length) {
      const fullText = theorySteps[theoryStep].content;
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20); // 20ms per character for smooth typing
      
      return () => clearInterval(typingInterval);
    }
  }, [isTheoryPlaying, theoryStep]);

  const startTheoryAnimation = () => {
    setIsTheoryPlaying(true);
    setTheoryStep(0);
    setTypedText('');
  };

  const stopTheoryAnimation = () => {
    setIsTheoryPlaying(false);
  };

  const nextTheoryStep = () => {
    if (theoryStep < theorySteps.length - 1) {
      setTheoryStep(prev => prev + 1);
      setTypedText('');
    } else {
      setIsTheoryPlaying(false);
    }
  };

  const prevTheoryStep = () => {
    if (theoryStep > 0) {
      setTheoryStep(prev => prev - 1);
      setTypedText('');
    }
  };

  // Calculate diffusion coefficient
  const calculateDiffusionCoefficient = (temp, dopant) => {
    const k = 8.617e-5;
    const T = temp + 273.15;
    const { Qd, D0 } = dopantProperties[dopant];
    return D0 * Math.exp(-Qd / (k * T));
  };

  // Complementary error function
  const erfc = (x) => {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return x >= 0 ? 1 - erf : 1 + erf;
  };

  // Calculate Rp and DeltaRp for implantation (LSS theory)
  const calculateImplantParams = (energy, dopant, tilt = implTilt) => {
    const mass = dopantProperties[dopant].mass;
    const A_target = 28.1; // Si atomic mass
    const Z_target = 14; // Si atomic number
    const Z_ion = dopant === 'B' ? 5 : dopant === 'P' ? 15 : dopant === 'As' ? 33 :
                  dopant === 'In' ? 49 : 51;

    // LSS theory: reduced energy
    const epsilon = 32.5 * mass * energy / (Z_ion * Z_target * (mass + A_target) *
                    (Math.pow(Z_ion, 0.23) + Math.pow(Z_target, 0.23)));

    // Projected range in nm
    let Rp = (mass / A_target) * Math.pow(epsilon, 0.8) * 100;

    // Apply tilt angle correction
    if (tilt > 0) {
      Rp = Rp / Math.cos(tilt * Math.PI / 180);
    }

    // Straggle (standard deviation)
    const deltaRp = Rp * 0.5;

    // Ensure minimum values
    Rp = Math.max(Rp, 1);

    return { Rp: Rp * 1e-3, deltaRp: deltaRp * 1e-3 }; // Convert to μm
  };

  // Calculate diffusion profile
  const calculateDiffusionProfile = (currentTime) => {
    const D = calculateDiffusionCoefficient(diffTemperature, diffDopantType);
    const t = currentTime * 60;
    const profile = [];
    const maxDepth = 3;
    const points = 100;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * maxDepth * 1e-4;
      let concentration;

      if (diffProcessType === 'predeposition') {
        const erfcArg = x / (2 * Math.sqrt(D * t));
        concentration = diffSurfaceConc * erfc(erfcArg);
      } else {
        // Drive-in: Use predeposition conditions to calculate total dopant dose Q
        // Typical predeposition is done at lower temperature (900-1000°C) for 30 min
        const T_predep = 1000; // °C
        const t_predep = 30 * 60; // seconds
        const D_predep = calculateDiffusionCoefficient(T_predep, diffDopantType);
        // Correct formula: Q = 2*C0*sqrt(D_predep*t_predep/π)
        const Q = 2 * diffSurfaceConc * Math.sqrt(D_predep * t_predep / Math.PI);
        // Drive-in profile: C(x,t) = (Q/sqrt(π*D*t)) * exp(-x²/(4*D*t))
        // This always has maximum at surface (x=0) and decreases monotonically with depth
        concentration = (Q / Math.sqrt(Math.PI * D * t)) * Math.exp(-x * x / (4 * D * t));
      }

      concentration = Math.max(concentration, diffBackgroundConc);

      profile.push({
        depth: (i / points) * maxDepth,
        concentration: concentration,
        logConcentration: Math.log10(concentration)
      });
    }

    return profile;
  };

  // Calculate implantation profile
  const calculateImplantationProfile = () => {
    const { Rp, deltaRp } = calculateImplantParams(implEnergy, implDopantType);
    const profile = [];
    // Dynamic x-axis range based on Rp and deltaRp
    // Most of the concentration is within Rp ± 3*deltaRp
    const maxDepth = Math.max((Rp + 4 * deltaRp), 0.05); // At least 0.05 μm
    const points = 100;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * maxDepth;

      // Gaussian profile
      let concentration = (implDose / (Math.sqrt(2 * Math.PI) * deltaRp * 1e-4)) *
                         Math.exp(-Math.pow(x * 1e-4 - Rp * 1e-4, 2) / (2 * Math.pow(deltaRp * 1e-4, 2)));

      // If annealing is enabled, add diffusion
      if (implAnnealing) {
        const D = calculateDiffusionCoefficient(annealTemp, implDopantType);
        const t = annealTime * 60;
        const diffusionBroadening = Math.sqrt(deltaRp * deltaRp * 1e-8 + 2 * D * t) * 1e4;

        concentration = (implDose / (Math.sqrt(2 * Math.PI) * diffusionBroadening * 1e-4)) *
                       Math.exp(-Math.pow(x * 1e-4 - Rp * 1e-4, 2) / (2 * Math.pow(diffusionBroadening * 1e-4, 2)));
      }

      concentration = Math.max(concentration, 1e14);

      profile.push({
        depth: x,
        concentration: concentration,
        logConcentration: Math.log10(concentration)
      });
    }

    return profile;
  };

  // Wafer Cross Section Component for Ion Implantation
  const WaferCrossSection = ({ Rp, deltaRp }) => {
    const waferHeight = 240;  // Reduced from 300
    const waferWidth = 360;   // Reduced from 450
    const maskHeight = 24;    // Reduced from 30
    const surfaceY = 48;      // Reduced from 60
    const scaleMargin = 48;   // Reduced from 60

    const effectiveRp = Rp / Math.cos(implTilt * Math.PI / 180);
    const effectiveDeltaRp = deltaRp / Math.cos(implTilt * Math.PI / 180);
    const maxDisplayDepth = effectiveRp + 3 * effectiveDeltaRp;
    const scale = (waferHeight - surfaceY - 40) / maxDisplayDepth;

    const [isIonAnimating, setIsIonAnimating] = useState(false);
    const [fallingIons, setFallingIons] = useState([]);
    const [settledIons, setSettledIons] = useState([]);
    const animationRef = useRef();

    const getIonSpeed = () => Math.sqrt(implEnergy) * 0.3 + 1;

    const createNewIon = () => {
      const fullWidth = waferWidth + scaleMargin;
      return {
        id: Math.random(),
        x: Math.random() * fullWidth * 0.8 + fullWidth * 0.1,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: getIonSpeed(),
        settled: false,
        blocked: false
      };
    };

    const checkMaskCollision = (ion) => {
      const maskY = surfaceY - maskHeight;
      const openingStart = waferWidth * 0.3 + scaleMargin;
      const openingEnd = waferWidth * 0.7 + scaleMargin;

      if (ion.y >= maskY && ion.y <= surfaceY) {
        if (ion.x < openingStart || ion.x > openingEnd) {
          return true;
        }
      }
      return false;
    };

    const getSettledPosition = (ion) => {
      const openingStart = waferWidth * 0.3 + scaleMargin;
      const openingEnd = waferWidth * 0.7 + scaleMargin;

      if (ion.x >= openingStart && ion.x <= openingEnd) {
        const u1 = Math.random();
        const u2 = Math.random();
        const gaussianRandom = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

        const concentratedSigma = effectiveDeltaRp * 0.7;
        let depth = effectiveRp + gaussianRandom * concentratedSigma;

        if (depth < 0 || depth > maxDisplayDepth) {
          return null;
        }

        const finalY = surfaceY + depth * scale;
        const distanceFromCenter = Math.abs(depth - effectiveRp);
        const concentration = Math.exp(-Math.pow(distanceFromCenter, 2) / (2 * Math.pow(effectiveDeltaRp, 2)));

        let opacity;
        if (distanceFromCenter <= 10) {
          opacity = 0.9;
        } else if (distanceFromCenter <= effectiveDeltaRp * 0.5) {
          opacity = 0.7 + 0.2 * concentration;
        } else {
          opacity = 0.3 + 0.4 * concentration;
        }

        const radius = 0.8 + concentration * 0.8;

        return { x: ion.x, y: finalY, opacity: Math.min(opacity, 1.0), depth: depth, radius: radius };
      }
      return null;
    };

    const updateAnimation = useCallback(() => {
      if (!isIonAnimating) return;

      setFallingIons(prevIons => {
        const updatedIons = [];
        const newSettledIons = [];

        prevIons.forEach(ion => {
          if (ion.settled || ion.blocked) return;

          const newIon = {
            ...ion,
            x: ion.x + ion.vx,
            y: ion.y + ion.vy,
            vy: ion.vy + 0.1
          };

          if (checkMaskCollision(newIon)) {
            newIon.blocked = true;
            return;
          }

          if (newIon.y >= surfaceY) {
            const settledPos = getSettledPosition(newIon);
            if (settledPos) {
              newSettledIons.push(settledPos);
            }
            newIon.settled = true;
            return;
          }

          if (newIon.y > waferHeight + 50 || newIon.x < -50 || newIon.x > waferWidth + scaleMargin + 50) {
            return;
          }

          updatedIons.push(newIon);
        });

        if (Math.random() < 0.8) {
          updatedIons.push(createNewIon());
        }

        if (newSettledIons.length > 0) {
          setSettledIons(prev => [...prev, ...newSettledIons].slice(-1000));
        }

        return updatedIons.slice(-100);
      });

      animationRef.current = requestAnimationFrame(updateAnimation);
    }, [isIonAnimating, implEnergy, effectiveRp, effectiveDeltaRp]);

    const toggleAnimation = () => {
      setIsIonAnimating(prev => !prev);
      if (!isIonAnimating) {
        setSettledIons([]);
        setFallingIons([]);
      }
    };

    useEffect(() => {
      if (isIonAnimating) {
        animationRef.current = requestAnimationFrame(updateAnimation);
      } else if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [isIonAnimating, updateAnimation]);

    const createDepthScale = () => {
      const ticks = [];
      const maxDepthToShow = maxDisplayDepth;

      let interval;
      if (maxDepthToShow <= 100) interval = 20;
      else if (maxDepthToShow <= 500) interval = 50;
      else if (maxDepthToShow <= 1000) interval = 100;
      else interval = 200;

      for (let depth = 0; depth <= maxDepthToShow; depth += interval) {
        const y = surfaceY + depth * scale;
        let label;

        if (depth >= 1000) {
          label = `${(depth / 1000).toFixed(1)}μm`;
        } else {
          label = `${depth}nm`;
        }

        ticks.push({ depth, y, label, isMajor: depth % (interval * 2) === 0 });
      }

      return ticks;
    };

    const staticIonDistribution = useMemo(() => {
      if (isIonAnimating) return [];

      const ions = [];
      const openingStart = waferWidth * 0.3 + scaleMargin;
      const openingEnd = waferWidth * 0.7 + scaleMargin;

      const layers = [
        { center: effectiveRp, sigma: effectiveDeltaRp * 0.3, count: 300, baseOpacity: 0.8 },
        { center: effectiveRp, sigma: effectiveDeltaRp * 0.6, count: 250, baseOpacity: 0.6 },
        { center: effectiveRp, sigma: effectiveDeltaRp * 1.0, count: 200, baseOpacity: 0.4 },
        { center: effectiveRp, sigma: effectiveDeltaRp * 1.5, count: 100, baseOpacity: 0.2 }
      ];

      layers.forEach(layer => {
        let validIons = 0;
        let attempts = 0;
        const maxAttempts = layer.count * 3;

        while (validIons < layer.count && attempts < maxAttempts) {
          const x = openingStart + Math.random() * (openingEnd - openingStart);

          const u1 = Math.random();
          const u2 = Math.random();
          const gaussianRandom = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

          let depth = layer.center + gaussianRandom * layer.sigma;

          if (depth < 0 || depth > maxDisplayDepth) {
            attempts++;
            continue;
          }

          const y = surfaceY + depth * scale;
          const distanceFromCenter = Math.abs(depth - effectiveRp);
          const concentration = Math.exp(-Math.pow(distanceFromCenter, 2) / (2 * Math.pow(effectiveDeltaRp, 2)));

          let opacity = layer.baseOpacity * concentration;

          if (distanceFromCenter <= 10) {
            opacity = Math.max(opacity, 0.9);
          } else if (distanceFromCenter <= effectiveDeltaRp * 0.5) {
            opacity = Math.max(opacity, 0.7);
          }

          const radius = 0.8 + concentration * 0.8;

          ions.push({ x, y, opacity: Math.min(opacity, 1.0), depth, radius, concentration });
          validIons++;
          attempts++;
        }
      });

      return ions;
    }, [isIonAnimating, Rp, deltaRp, implTilt]);

    return (
      <div className="border rounded-lg bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">웨이퍼 횡단면 구조</h3>
          <button
            onClick={toggleAnimation}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isIonAnimating
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isIonAnimating ? '시뮬레이션 정지' : '이온 주입 시작'}
          </button>
        </div>

        <svg width={waferWidth + scaleMargin} height={waferHeight + 40} viewBox={`0 0 ${waferWidth + scaleMargin} ${waferHeight + 40}`}>
          <defs>
            <linearGradient id="substrateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6"/>
              <stop offset="100%" stopColor="#e5e7eb"/>
            </linearGradient>
          </defs>

          {/* Depth scale */}
          <g>
            <line x1={50} y1={surfaceY} x2={50} y2={waferHeight}
                  stroke="#6b7280" strokeWidth="2"/>

            {createDepthScale().map((tick, i) => (
              <g key={i}>
                <line x1={45} y1={tick.y} x2={55} y2={tick.y}
                      stroke="#6b7280" strokeWidth={tick.isMajor ? "2" : "1"}/>
                <text x={40} y={tick.y + 3} textAnchor="end"
                      className={`fill-gray-600 ${tick.isMajor ? 'text-xs font-medium' : 'text-xs'}`}>
                  {tick.label}
                </text>
              </g>
            ))}

            <text x={25} y={surfaceY + (waferHeight - surfaceY)/2} textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium"
                  transform={`rotate(-90, 25, ${surfaceY + (waferHeight - surfaceY)/2})`}>
              깊이
            </text>
          </g>

          {/* Substrate */}
          <rect x={30 + scaleMargin} y={surfaceY} width={waferWidth - 60} height={waferHeight - surfaceY}
                fill="url(#substrateGradient)" stroke="#9ca3af" strokeWidth="1"/>

          {/* Mask structure */}
          <g>
            <rect x={30 + scaleMargin} y={surfaceY - maskHeight} width={waferWidth * 0.3 - 30} height={maskHeight}
                  fill="#4b5563" stroke="#374151" strokeWidth="1"/>
            <rect x={waferWidth * 0.7 + scaleMargin} y={surfaceY - maskHeight} width={waferWidth * 0.3 - 30} height={maskHeight}
                  fill="#4b5563" stroke="#374151" strokeWidth="1"/>

            <text x={waferWidth * 0.15 + scaleMargin} y={surfaceY - maskHeight/2 + 3} textAnchor="middle"
                  className="text-xs fill-white font-medium">Mask</text>
            <text x={waferWidth * 0.85 + scaleMargin} y={surfaceY - maskHeight/2 + 3} textAnchor="middle"
                  className="text-xs fill-white font-medium">Mask</text>
          </g>

          {/* Falling ions */}
          {isIonAnimating && fallingIons.map(ion => (
            <circle key={ion.id}
                   cx={ion.x} cy={ion.y} r="2"
                   fill={dopantProperties[implDopantType].type === 'p-type' ? '#ef4444' : '#3b82f6'}
                   fillOpacity="0.8"/>
          ))}

          {/* Settled or static ions */}
          {(isIonAnimating ? settledIons : staticIonDistribution).map((ion, i) => (
            <circle key={isIonAnimating ? `settled-${i}` : `static-${i}`}
                   cx={ion.x} cy={ion.y}
                   r={ion.radius || 1.2}
                   fill={dopantProperties[implDopantType].type === 'p-type' ? '#dc2626' : '#1e40af'}
                   fillOpacity={ion.opacity || 0.6}/>
          ))}

          {/* Projected range line */}
          <g>
            <line x1={waferWidth * 0.3 + scaleMargin} y1={surfaceY + effectiveRp * scale}
                  x2={waferWidth * 0.7 + scaleMargin} y2={surfaceY + effectiveRp * scale}
                  stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3"/>
            <text x={waferWidth * 0.72 + scaleMargin} y={surfaceY + effectiveRp * scale - 3}
                  className="text-xs fill-red-600 font-medium">
              Rp = {Rp.toFixed(1)} nm
            </text>
          </g>

          {/* Labels */}
          <text x={(waferWidth + scaleMargin)/2} y={waferHeight + 25} textAnchor="middle"
                className="text-sm fill-gray-600 font-medium">Si 기판</text>

          {/* Status */}
          <text x={waferWidth * 0.75 + scaleMargin} y={surfaceY + 20}
                className={`text-xs font-medium ${isIonAnimating ? 'fill-green-600' : 'fill-gray-500'}`}>
            {isIonAnimating ? `이온 주입 진행 중... (${settledIons.length}개 정착)` : '정적 농도 분포'}
          </text>
        </svg>
      </div>
    );
  };

  // Animation effect
  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setAnimationTime(prev => {
          if (prev >= diffTime) {
            setIsAnimating(false);
            return diffTime;
          }
          return prev + diffTime / 50;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAnimating, diffTime]);

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationTime(0);
  };

  // Quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "확산(Diffusion) 공정의 구동력(driving force)은 무엇인가?",
      options: [
        "전기장 (Electric field)",
        "농도 기울기 (Concentration gradient)",
        "온도 차이 (Temperature difference)",
        "압력 차이 (Pressure difference)"
      ],
      correct: 1,
      explanation: "확산은 농도 기울기에 의해 구동됩니다. Fick의 제1법칙: J = -D(∂C/∂x)"
    },
    {
      id: 2,
      question: "이온 주입(Ion Implantation)의 가장 큰 장점은?",
      options: [
        "낮은 공정 비용",
        "빠른 공정 시간",
        "정확한 dose 제어",
        "높은 표면 농도"
      ],
      correct: 2,
      explanation: "이온 주입은 beam current와 시간을 제어하여 정확한 dose(이온 개수)를 주입할 수 있습니다."
    },
    {
      id: 3,
      question: "확산 계수(D)가 온도에 따라 증가하는 이유는?",
      options: [
        "원자의 열운동 에너지 증가",
        "결정 구조의 변화",
        "전자 농도 증가",
        "표면 장력 감소"
      ],
      correct: 0,
      explanation: "Arrhenius 방정식: D = D₀ exp(-Qd/kT)에서 온도가 증가하면 지수항이 커져 확산 계수가 증가합니다."
    },
    {
      id: 4,
      question: "Pre-deposition과 Drive-in을 순차적으로 하는 이유는?",
      options: [
        "공정 시간 단축",
        "높은 표면 농도와 깊은 접합 동시 달성",
        "비용 절감",
        "장비 활용도 증가"
      ],
      correct: 1,
      explanation: "Pre-deposition으로 높은 표면 농도를 만들고, Drive-in으로 원하는 깊이까지 확산시켜 최적의 프로파일을 얻습니다."
    },
    {
      id: 5,
      question: "이온 주입 시 tilt angle을 주는 주된 이유는?",
      options: [
        "주입 속도 향상",
        "Channeling 효과 방지",
        "표면 손상 감소",
        "에너지 효율 증가"
      ],
      correct: 1,
      explanation: "실리콘 결정 구조의 채널을 따라 이온이 비정상적으로 깊이 들어가는 channeling을 방지하기 위해 7° 정도 기울입니다."
    },
    {
      id: 6,
      question: "현대 반도체에서 Implantation을 선호하는 가장 큰 이유는?",
      options: [
        "저온 공정 가능",
        "Photoresist를 마스크로 사용 가능",
        "정확한 도핑 제어",
        "위 모든 이유"
      ],
      correct: 3,
      explanation: "저온 공정(photoresist 손상 없음), 선택적 도핑, 정확한 dose/depth 제어 등 모든 장점 때문에 현대 공정의 표준입니다."
    }
  ];

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const checkQuiz = () => {
    setShowQuizResults(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  const calculateQuizScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  // Comparison data
  const getComparisonData = () => {
    const diffProfile = calculateDiffusionProfile(diffTime);
    const implProfile = calculateImplantationProfile();
    
    // Align depths
    const maxDepth = Math.max(
      diffProfile[diffProfile.length - 1].depth,
      implProfile[implProfile.length - 1].depth
    );
    
    return diffProfile.map((d, idx) => ({
      depth: d.depth,
      diffusion: d.logConcentration,
      implantation: implProfile[idx]?.logConcentration || 14
    }));
  };

  return (
    <div className="flex-1 flex flex-col">
      <style>{`
        /* 빨간색 슬라이더 스타일 (온도) */
        .slider-thumb-red {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-red::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-radius: 10px;
          border: 2px solid #b91c1c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-red::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-red::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-red::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-radius: 10px;
          border: 2px solid #b91c1c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-red::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 파란색 슬라이더 스타일 (시간) */
        .slider-thumb-blue {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-blue::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 10px;
          border: 2px solid #1d4ed8;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-blue::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-blue::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-blue::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 10px;
          border: 2px solid #1d4ed8;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-blue::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 녹색 슬라이더 스타일 (농도) */
        .slider-thumb-green {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-green::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 10px;
          border: 2px solid #047857;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-green::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #10b981);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-green::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-green::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 10px;
          border: 2px solid #047857;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-green::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #10b981);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 보라색 슬라이더 스타일 (배경농도, 도즈) */
        .slider-thumb-purple {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-purple::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border-radius: 10px;
          border: 2px solid #6d28d9;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-purple::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-purple::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-purple::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border-radius: 10px;
          border: 2px solid #6d28d9;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-purple::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 오렌지색 슬라이더 스타일 (에너지) */
        .slider-thumb-orange {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-orange::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #ea580c, #f97316);
          border-radius: 10px;
          border: 2px solid #c2410c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-orange::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ea580c, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-orange::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-orange::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #ea580c, #f97316);
          border-radius: 10px;
          border: 2px solid #c2410c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-orange::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ea580c, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 인디고색 슬라이더 스타일 (경사각) */
        .slider-thumb-indigo {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-indigo::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border-radius: 10px;
          border: 2px solid #4338ca;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-indigo::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-indigo::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-indigo::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border-radius: 10px;
          border: 2px solid #4338ca;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-indigo::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
      `}</style>
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'theory', label: '이론', icon: BookOpen },
            { id: 'diffusion', label: '확산 공정', icon: TrendingUp },
            { id: 'implantation', label: '이온 주입', icon: Target },
            { id: 'comparison', label: '공정 비교', icon: GitCompare },
            { id: 'temperature', label: '온도 영향', icon: AlertCircle },
            { id: 'application', label: '적용 가이드', icon: Lightbulb },
            { id: 'quiz', label: '퀴즈', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Theory Tab - Opening Animation */}
          {activeTab === 'theory' && (
            <div className="space-y-6">
              {/* Main Animation Area */}
              {!showDetailedTheory ? (
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl p-8 text-white min-h-[600px] flex flex-col">
                  {!isTheoryPlaying ? (
                    // Initial welcome screen
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="text-6xl mb-4">🎬</div>
                  <h2 className="text-4xl font-bold mb-4">
                    반도체 도핑공정
                  </h2>
                  <p className="text-xl text-blue-100 max-w-2xl">
                    이 시뮬레이터는 반도체 제조의 핵심 공정인 도핑에 대해 
                    단계별로 설명해드립니다.
                  </p>
                  <button
                    onClick={startTheoryAnimation}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 mt-8"
                  >
                    <Play className="w-8 h-8" />
                    시작하기
                  </button>
                  <p className="text-sm text-blue-200 mt-4">
                    약 3분 소요 • 5단계 스토리텔링
                  </p>
                </div>
              ) : (
                // Animation playing
                <div className="flex-1 flex flex-col">
                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">
                        Step {theoryStep + 1} / {theorySteps.length}
                      </span>
                      <span className="text-sm text-blue-200">
                        {Math.round(((theoryStep + 1) / theorySteps.length) * 100)}% 완료
                      </span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((theoryStep + 1) / theorySteps.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">{theorySteps[theoryStep].icon}</span>
                      <h3 className="text-2xl font-bold">
                        {theorySteps[theoryStep].title}
                      </h3>
                    </div>
                    
                    <div className="text-lg leading-relaxed whitespace-pre-line mb-6 font-medium">
                      {typedText}
                      {typedText.length < theorySteps[theoryStep].content.length && (
                        <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse" />
                      )}
                    </div>

                    {typedText.length >= theorySteps[theoryStep].content.length && (
                      <div className="mt-6 p-4 bg-yellow-400/20 border-2 border-yellow-300 rounded-lg transition-all duration-500 opacity-100">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                          <p className="text-yellow-100 font-semibold">
                            {theorySteps[theoryStep].highlight}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevTheoryStep}
                      disabled={theoryStep === 0}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                        theoryStep === 0
                          ? 'bg-white/20 text-white/50 cursor-not-allowed'
                          : 'bg-white/30 text-white hover:bg-white/40'
                      }`}
                    >
                      ← 이전
                    </button>

                    <button
                      onClick={stopTheoryAnimation}
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-semibold"
                    >
                      <Pause className="w-5 h-5" />
                      일시정지
                    </button>

                    {theoryStep < theorySteps.length - 1 ? (
                      <button
                        onClick={nextTheoryStep}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold shadow-lg"
                      >
                        다음 →
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('diffusion')}
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-all font-semibold shadow-lg animate-pulse"
                      >
                        시뮬레이터 시작! 🚀
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Detailed theory content (기존 내용)
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <button
                onClick={() => setShowDetailedTheory(false)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
              >
                ← 오프닝으로 돌아가기
              </button>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">도핑 공정 상세 이론</h2>
                <p className="text-gray-600">
                  반도체 소자 제작에서 실리콘에 불순물(도펀트)을 주입하여 p-n 접합을 형성하고 전기적 특성을 제어하는 
                  핵심 공정입니다.
                </p>
              </div>

              {/* Diffusion Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  확산 공정 (Diffusion)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-gray-700 mb-2">Fick의 제1법칙 (정상 상태)</h4>
                    <p className="font-mono text-blue-600 text-lg mb-2">J = -D · (∂C/∂x)</p>
                    <p className="text-sm text-gray-600">플럭스는 농도 기울기에 비례</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-gray-700 mb-2">Fick의 제2법칙 (비정상 상태)</h4>
                    <p className="font-mono text-blue-600 text-lg mb-2">∂C/∂t = D · (∂²C/∂x²)</p>
                    <p className="text-sm text-gray-600">시간에 따른 농도 변화</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-gray-700 mb-2">확산 계수 (Diffusion Coefficient)</h4>
                  <p className="font-mono text-purple-600 text-lg mb-2">D = D₀ · exp(-Qd / kT)</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                    <p>• D₀: 선지수 인자 (cm²/s)</p>
                    <p>• Qd: 활성화 에너지 (eV)</p>
                    <p>• k: 볼츠만 상수 (8.617×10⁻⁵ eV/K)</p>
                    <p>• T: 절대 온도 (K)</p>
                  </div>
                </div>
              </div>

              {/* Implantation Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-600" />
                  이온 주입 공정 (Ion Implantation)
                </h3>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">Gaussian 프로파일</h4>
                  <p className="font-mono text-orange-600 text-lg mb-2">
                    C(x) = (Φ/√2πΔRp) · exp[-(x-Rp)²/2ΔRp²]
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                    <p>• Φ: 도즈 (ions/cm²)</p>
                    <p>• Rp: 투영 거리 (평균 깊이)</p>
                    <p>• ΔRp: 스트래글 (표준편차)</p>
                    <p>• Energy로 깊이 제어</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-bold text-sm text-gray-700 mb-1">장점</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>✓ 정확한 dose 제어</li>
                      <li>✓ 저온 공정</li>
                      <li>✓ 임의의 깊이 가능</li>
                      <li>✓ PR 마스크 사용</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-bold text-sm text-gray-700 mb-1">단점</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>✗ 결정 손상 발생</li>
                      <li>✗ Channeling 주의</li>
                      <li>✗ Annealing 필요</li>
                      <li>✗ 높은 장비 비용</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-bold text-sm text-gray-700 mb-1">주요 파라미터</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Dose (Φ)</li>
                      <li>• Energy (keV)</li>
                      <li>• Species (B, P, As)</li>
                      <li>• Tilt angle (7°)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">공정 비교 요약</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left">특성</th>
                        <th className="px-4 py-3 text-left">확산 (Diffusion)</th>
                        <th className="px-4 py-3 text-left">이온 주입 (Implantation)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-semibold">온도</td>
                        <td className="px-4 py-3">고온 (900-1200°C)</td>
                        <td className="px-4 py-3">저온 (상온 가능)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-semibold">Dose 제어</td>
                        <td className="px-4 py-3">상대적으로 어려움</td>
                        <td className="px-4 py-3">매우 정확</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-semibold">프로파일 형태</td>
                        <td className="px-4 py-3">erfc 또는 Gaussian</td>
                        <td className="px-4 py-3">Gaussian</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-semibold">깊이 제어</td>
                        <td className="px-4 py-3">온도/시간 의존</td>
                        <td className="px-4 py-3">에너지로 직접 제어</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 font-semibold">마스크</td>
                        <td className="px-4 py-3">SiO₂, Si₃N₄</td>
                        <td className="px-4 py-3">Photoresist 가능</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold">주요 용도</td>
                        <td className="px-4 py-3">깊은 접합, 오래된 공정</td>
                        <td className="px-4 py-3">현대 반도체 표준</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dopant Table */}
              <div className="bg-yellow-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-3">주요 도펀트 (Dopants)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-yellow-100">
                      <tr>
                        <th className="px-4 py-2 text-left">원소</th>
                        <th className="px-4 py-2 text-left">타입</th>
                        <th className="px-4 py-2 text-left">질량</th>
                        <th className="px-4 py-2 text-left">D₀ (cm²/s)</th>
                        <th className="px-4 py-2 text-left">Qd (eV)</th>
                        <th className="px-4 py-2 text-left">주요 응용</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b">
                        <td className="px-4 py-2 font-semibold text-red-600">Phosphorus (인)</td>
                        <td className="px-4 py-2">n-type</td>
                        <td className="px-4 py-2">31</td>
                        <td className="px-4 py-2">3.85</td>
                        <td className="px-4 py-2">3.66</td>
                        <td className="px-4 py-2">Source/Drain, N-well</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-semibold text-blue-600">Boron (붕소)</td>
                        <td className="px-4 py-2">p-type</td>
                        <td className="px-4 py-2">11</td>
                        <td className="px-4 py-2">0.76</td>
                        <td className="px-4 py-2">3.69</td>
                        <td className="px-4 py-2">Base, P-well</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-semibold text-purple-600">Arsenic (비소)</td>
                        <td className="px-4 py-2">n-type</td>
                        <td className="px-4 py-2">75</td>
                        <td className="px-4 py-2">0.32</td>
                        <td className="px-4 py-2">4.08</td>
                        <td className="px-4 py-2">얕은 접합</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Historical Context */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-3">기술 발전 역사</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-24 flex-shrink-0 font-bold text-green-700">1950-1970년대</div>
                    <div className="text-gray-700">
                      <strong>확산 공정 시대:</strong> 초기 트랜지스터와 IC 제작의 주요 도핑 방법. 
                      고온 furnace에서 가스 분위기로 도펀트 확산.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-24 flex-shrink-0 font-bold text-blue-700">1980년대~</div>
                    <div className="text-gray-700">
                      <strong>이온 주입 시대:</strong> 정밀 제어가 필요한 VLSI 시대 도래. 
                      Photoresist 마스크 사용 가능으로 공정 단순화.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-24 flex-shrink-0 font-bold text-purple-700">2000년대~</div>
                    <div className="text-gray-700">
                      <strong>초미세 공정:</strong> 나노미터 수준의 정밀 도핑. 
                      초저에너지 주입, Plasma doping 등 신기술 등장.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toggle detailed theory button */}
          {!isTheoryPlaying && !showDetailedTheory && (
            <div className="text-center">
              <button
                onClick={() => setShowDetailedTheory(true)}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold shadow-lg"
              >
                📚 상세 이론 보기
              </button>
            </div>
          )}
            </div>
          )}

          {/* Diffusion Simulator Tab */}
          {activeTab === 'diffusion' && (
            <div className="space-y-6">
          {/* Diffusion Theory Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              확산 공정 기초 이론 (Diffusion Fundamentals)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fick's Laws */}
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-bold text-gray-800 mb-3">📐 Fick의 확산 법칙</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-blue-900 mb-2">제1법칙 (정상 상태)</p>
                    <p className="font-mono text-lg text-blue-700 mb-3 bg-white p-2 rounded">J = -D · (∂C/∂x)</p>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>📌 의미:</strong> 확산 플럭스(J)는 농도 기울기에 비례합니다.</p>
                      <div className="bg-white p-2 rounded">
                        <p className="font-semibold text-blue-800 mb-1">변수 설명:</p>
                        <ul className="ml-4 space-y-1">
                          <li><strong>J</strong>: 확산 플럭스 (단위 시간·면적당 이동하는 원자 수)</li>
                          <li><strong>D</strong>: 확산 계수 (확산 속도를 결정하는 상수)</li>
                          <li><strong>∂C/∂x</strong>: 농도 기울기 (위치에 따른 농도 변화율)</li>
                          <li><strong>음수 부호(-)</strong>: 높은 농도 → 낮은 농도 방향으로 확산</li>
                        </ul>
                      </div>
                      <p className="text-blue-800">💡 <em>쉽게 말하면:</em> 물감을 물에 떨어뜨리면 진한 곳에서 옅은 곳으로 퍼지는 것과 같습니다!</p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <p className="font-semibold text-purple-900 mb-2">제2법칙 (비정상 상태)</p>
                    <p className="font-mono text-lg text-purple-700 mb-3 bg-white p-2 rounded">∂C/∂t = D · (∂²C/∂x²)</p>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>📌 의미:</strong> 시간에 따른 농도 변화를 설명합니다.</p>
                      <div className="bg-white p-2 rounded">
                        <p className="font-semibold text-purple-800 mb-1">변수 설명:</p>
                        <ul className="ml-4 space-y-1">
                          <li><strong>∂C/∂t</strong>: 시간에 따른 농도 변화율</li>
                          <li><strong>∂²C/∂x²</strong>: 농도의 2차 미분 (농도 곡률)</li>
                          <li><strong>D</strong>: 확산 계수 (온도에 따라 변함)</li>
                        </ul>
                      </div>
                      <p className="text-purple-800">💡 <em>쉽게 말하면:</em> 시간이 지날수록 도펀트가 실리콘 속으로 얼마나 깊이 들어가는지 계산합니다!</p>
                      <p className="font-semibold text-purple-900">⭐ 반도체 공정에서 실제 사용되는 핵심 방정식입니다!</p>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="font-semibold text-green-900 mb-2">확산 계수 (D)</p>
                    <p className="font-mono text-lg text-green-700 mb-3 bg-white p-2 rounded">D = D₀ · exp(-Qd/kT)</p>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>📌 의미:</strong> 확산 속도는 온도에 따라 지수적으로 변합니다.</p>
                      <div className="bg-white p-2 rounded">
                        <p className="font-semibold text-green-800 mb-1">변수 설명:</p>
                        <ul className="ml-4 space-y-1">
                          <li><strong>D₀</strong>: 확산 상수 (재료와 도펀트에 따라 결정)</li>
                          <li><strong>Qd</strong>: 활성화 에너지 (확산에 필요한 에너지 장벽)</li>
                          <li><strong>k</strong>: 볼츠만 상수 (1.38 × 10⁻²³ J/K)</li>
                          <li><strong>T</strong>: 절대 온도 (Kelvin 단위)</li>
                        </ul>
                      </div>
                      <p className="text-green-800">💡 <em>쉽게 말하면:</em> 온도를 올리면 원자들이 활발해져서 확산이 훨씬 빨라집니다!</p>
                      <p className="font-semibold text-green-900">🔥 예: 900°C → 1000°C로 올리면 확산 속도가 약 3-5배 증가!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5">
                <h3 className="font-bold text-gray-800 mb-3">🔥 Diffusion Furnace 구조</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <svg viewBox="0 0 800 400" className="w-full">
                    <defs>
                      {/* Gradient for tube */}
                      <linearGradient id="tubeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e0e7ff" />
                        <stop offset="50%" stopColor="#c7d2fe" />
                        <stop offset="100%" stopColor="#e0e7ff" />
                      </linearGradient>
                    </defs>

                    {/* Title */}
                    <text x="320" y="85" fontSize="14" fill="#1f2937" fontWeight="bold">Quartz Diffusion Tube</text>

                    {/* O2 Line */}
                    <text x="30" y="340" fontSize="12" fill="#1f2937">O₂</text>
                    <line x1="50" y1="335" x2="50" y2="280" stroke="#374151" strokeWidth="2"/>
                    <line x1="50" y1="280" x2="50" y2="230" stroke="#374151" strokeWidth="2"/>
                    <circle cx="50" cy="255" r="12" fill="none" stroke="#374151" strokeWidth="2"/>
                    <line x1="44" y1="249" x2="56" y2="261" stroke="#374151" strokeWidth="2"/>
                    <rect x="45" y="210" width="10" height="20" fill="white" stroke="#374151" strokeWidth="2"/>
                    <line x1="50" y1="210" x2="50" y2="155" stroke="#374151" strokeWidth="2"/>
                    {/* O2 to tube connection - thick */}
                    <line x1="50" y1="155" x2="270" y2="155" stroke="#374151" strokeWidth="4"/>

                    {/* N2 Line */}
                    <text x="110" y="340" fontSize="12" fill="#1f2937">N₂</text>
                    <line x1="130" y1="335" x2="130" y2="280" stroke="#374151" strokeWidth="2"/>
                    <line x1="130" y1="280" x2="130" y2="230" stroke="#374151" strokeWidth="2"/>
                    <circle cx="130" cy="255" r="12" fill="none" stroke="#374151" strokeWidth="2"/>
                    <line x1="124" y1="249" x2="136" y2="261" stroke="#374151" strokeWidth="2"/>
                    <rect x="125" y="210" width="10" height="20" fill="white" stroke="#374151" strokeWidth="2"/>
                    <line x1="130" y1="210" x2="190" y2="210" stroke="#374151" strokeWidth="2"/>
                    <polygon points="190,210 185,207 185,213" fill="#374151"/>
                    <line x1="190" y1="210" x2="190" y2="155" stroke="#374151" strokeWidth="2"/>
                    {/* N2 to tube connection - thick */}
                    <line x1="190" y1="155" x2="270" y2="155" stroke="#374151" strokeWidth="4"/>

                    {/* Temperature Controlled Bath */}
                    <rect x="160" y="290" width="80" height="60" fill="#7dd3fc" stroke="#0369a1" strokeWidth="2"/>
                    <text x="165" y="365" fontSize="9" fill="#1f2937">Temperature Controlled Bath</text>

                    {/* Liquid Source */}
                    <ellipse cx="200" cy="320" rx="25" ry="20" fill="#fb923c" stroke="#c2410c" strokeWidth="2"/>
                    <rect x="195" y="290" width="10" height="30" fill="#fb923c" stroke="#c2410c" strokeWidth="1"/>
                    <text x="165" y="385" fontSize="9" fill="#1f2937">Liquid Source</text>
                    <line x1="200" y1="290" x2="200" y2="210" stroke="#374151" strokeWidth="2"/>
                    <circle cx="200" cy="250" r="12" fill="none" stroke="#374151" strokeWidth="2"/>
                    <line x1="194" y1="244" x2="206" y2="256" stroke="#374151" strokeWidth="2"/>
                    <line x1="200" y1="210" x2="200" y2="155" stroke="#374151" strokeWidth="2"/>
                    {/* Bath vapor to tube connection - thick */}
                    <line x1="200" y1="155" x2="270" y2="155" stroke="#374151" strokeWidth="4"/>

                    {/* Gas flow arrow */}
                    <polygon points="260,155 255,152 255,158" fill="#374151"/>

                    {/* Main Quartz Tube */}
                    <ellipse cx="300" cy="155" rx="30" ry="50" fill="url(#tubeGradient)" stroke="#374151" strokeWidth="3"/>
                    <rect x="300" y="105" width="300" height="100" fill="url(#tubeGradient)" stroke="#374151" strokeWidth="3"/>
                    <ellipse cx="600" cy="155" rx="30" ry="50" fill="url(#tubeGradient)" stroke="#374151" strokeWidth="3"/>

                    {/* Wafers on carrier boat */}
                    {[350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545].map((x, i) => (
                      <line key={i} x1={x} y1="130" x2={x} y2="180" stroke="#3b82f6" strokeWidth="2"/>
                    ))}
                    
                    {/* Carrier boat */}
                    <rect x="340" y="175" width="220" height="8" fill="#fb923c" stroke="#c2410c" strokeWidth="1"/>
                    <text x="385" y="240" fontSize="11" fill="#1f2937">Wafers on carrier boat</text>
                    <line x1="450" y1="230" x2="450" y2="183" stroke="#374151" strokeWidth="1"/>
                    <polygon points="450,183 447,188 453,188" fill="#374151"/>

                    {/* Connection to Burner Box */}
                    <line x1="630" y1="155" x2="660" y2="155" stroke="#374151" strokeWidth="2"/>
                    
                    {/* Burner Box / Scrubber */}
                    <rect x="660" y="120" width="100" height="70" fill="#fef3c7" stroke="#374151" strokeWidth="2"/>
                    <text x="670" y="150" fontSize="11" fill="#1f2937" fontWeight="bold">Burner Box /</text>
                    <text x="680" y="165" fontSize="11" fill="#1f2937" fontWeight="bold">Scrubber</text>
                    
                    {/* Exhaust */}
                    <text x="700" y="30" fontSize="12" fill="#1f2937" fontWeight="bold">Exhaust</text>
                    <rect x="705" y="35" width="10" height="85" fill="none" stroke="#374151" strokeWidth="2"/>
                    <line x1="710" y1="120" x2="710" y2="155" stroke="#374151" strokeWidth="2"/>

                    {/* Gas flow animation inside tube */}
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <g key={`gas-${i}`}>
                        <circle cx="300" cy="140" r="2.5" fill="#3b82f6" opacity="0.7">
                          <animate attributeName="cx" from="300" to="600" dur="5s" repeatCount="indefinite" begin={`${i * 0.8}s`}/>
                          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.1;0.9;1" dur="5s" repeatCount="indefinite" begin={`${i * 0.8}s`}/>
                        </circle>
                        <circle cx="300" cy="155" r="2.5" fill="#60a5fa" opacity="0.7">
                          <animate attributeName="cx" from="300" to="600" dur="5.5s" repeatCount="indefinite" begin={`${i * 0.9}s`}/>
                          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.1;0.9;1" dur="5.5s" repeatCount="indefinite" begin={`${i * 0.9}s`}/>
                        </circle>
                        <circle cx="300" cy="170" r="2.5" fill="#3b82f6" opacity="0.7">
                          <animate attributeName="cx" from="300" to="600" dur="6s" repeatCount="indefinite" begin={`${i * 1.0}s`}/>
                          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.1;0.9;1" dur="6s" repeatCount="indefinite" begin={`${i * 1.0}s`}/>
                        </circle>
                      </g>
                    ))}
                  </svg>
                </div>
                
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-gray-700"><strong>가스 공급:</strong> O₂, N₂가 Liquid Source를 통과하여 도펀트 증기 운반</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span className="text-gray-700"><strong>Carrier Boat:</strong> 웨이퍼를 수직으로 배치하여 균일한 확산</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 font-bold">•</span>
                    <span className="text-gray-700"><strong>Burner/Scrubber:</strong> 배출 가스를 태우거나 중화하여 안전 처리</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Types Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 shadow-md">
                <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📥</span>
                  Pre-deposition (정원 확산)
                </h4>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-800 bg-white p-2 rounded"><strong>조건:</strong> 표면에 무한한 도펀트 공급 (Constant Source)</p>
                  <p className="font-mono text-purple-700 bg-white p-2 rounded font-semibold">C(x,t) = C₀ · erfc(x/2√Dt)</p>

                  <div className="bg-white p-3 rounded">
                    <p className="font-semibold text-purple-800 mb-2">변수 설명:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li><strong>C(x,t)</strong>: 깊이 x, 시간 t에서의 농도</li>
                      <li><strong>C₀</strong>: 표면 농도 (일정하게 유지됨)</li>
                      <li><strong>erfc</strong>: 여오차함수 (Complementary Error Function)</li>
                      <li><strong>x</strong>: 실리콘 표면으로부터의 깊이</li>
                      <li><strong>D</strong>: 확산 계수, <strong>t</strong>: 확산 시간</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-purple-900"><strong>💡 쉬운 설명:</strong></p>
                    <p className="text-gray-700">도펀트 가스를 계속 공급하면서 표면 농도를 높게 유지합니다. 마치 물에 설탕을 계속 넣으면서 녹이는 것과 비슷합니다!</p>
                  </div>

                  <div className="text-gray-700 bg-white p-2 rounded">
                    <strong>공정 특성:</strong><br/>
                    • 표면 농도(C₀)는 일정하게 유지<br/>
                    • 짧은 시간 (15-60분)<br/>
                    • 낮은 온도 (900-1000°C)<br/>
                    • 목적: 높은 표면 농도 확보
                  </div>
                </div>
              </div>

              <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 shadow-md">
                <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📤</span>
                  Drive-in (제한 확산)
                </h4>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-800 bg-white p-2 rounded"><strong>조건:</strong> 고정된 도즈(Q), 도펀트 가스 차단</p>
                  <p className="font-mono text-orange-700 bg-white p-2 rounded font-semibold">C(x,t) = Q/√πDt · exp(-x²/4Dt)</p>

                  <div className="bg-white p-3 rounded">
                    <p className="font-semibold text-orange-800 mb-2">변수 설명:</p>
                    <ul className="ml-4 space-y-1 text-gray-700">
                      <li><strong>C(x,t)</strong>: 깊이 x, 시간 t에서의 농도</li>
                      <li><strong>Q</strong>: 총 도펀트 도즈 (pre-dep에서 주입된 총량, 일정)</li>
                      <li><strong>exp(-x²/4Dt)</strong>: 가우시안 분포 함수</li>
                      <li><strong>x</strong>: 실리콘 표면으로부터의 깊이</li>
                      <li><strong>D</strong>: 확산 계수, <strong>t</strong>: 확산 시간</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-2 rounded">
                    <p className="text-orange-900"><strong>💡 쉬운 설명:</strong></p>
                    <p className="text-gray-700">Pre-dep에서 주입한 도펀트를 더 깊이 밀어넣습니다. 도펀트 공급을 중단하고 고온에서 가열하면, 표면의 도펀트가 안쪽으로 확산됩니다!</p>
                  </div>

                  <div className="text-gray-700 bg-white p-2 rounded">
                    <strong>공정 특성:</strong><br/>
                    • 표면 농도는 시간에 따라 감소 (1/√t)<br/>
                    • 긴 시간 (수 시간)<br/>
                    • 높은 온도 (1000-1200°C)<br/>
                    • 목적: 깊은 접합 형성, 농도 재분포
                  </div>
                </div>
              </div>
            </div>

            {/* Visual comparison of profiles */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-4 border-2 border-gray-300">
              <h4 className="font-bold text-gray-800 mb-3 text-center">📊 농도 프로파일 비교</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-purple-800 mb-2">Pre-deposition 프로파일</p>
                  <p className="text-sm text-gray-700">• 표면에서 가장 높은 농도 (C₀)<br/>• erfc 함수 형태 (급격한 감소)<br/>• 표면 농도는 일정</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-orange-800 mb-2">Drive-in 프로파일</p>
                  <p className="text-sm text-gray-700">• 표면 농도가 시간에 따라 감소<br/>• 가우시안 분포 형태<br/>• 깊이 방향으로 더 균일하게 분포</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">확산 공정 시뮬레이터</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  공정 타입
                </label>
                <select
                  value={diffProcessType}
                  onChange={(e) => {
                    setDiffProcessType(e.target.value);
                    resetAnimation();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="predeposition">Pre-deposition (정원 확산)</option>
                  <option value="drivein">Drive-in (제한 확산)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  도펀트 종류
                </label>
                <select
                  value={diffDopantType}
                  onChange={(e) => {
                    setDiffDopantType(e.target.value);
                    resetAnimation();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(dopantProperties).map(([key, prop]) => (
                    <option key={key} value={key}>
                      {prop.nameKo} ({prop.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-red-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-red-800">
                  온도: {diffTemperature}°C
                </label>
                <input
                  type="range"
                  min="800"
                  max="1200"
                  step="10"
                  value={diffTemperature}
                  onChange={(e) => {
                    setDiffTemperature(Number(e.target.value));
                    resetAnimation();
                  }}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-red"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>800°C</span>
                  <span>1200°C</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-blue-800">
                  시간: {diffTime} 분
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={diffTime}
                  onChange={(e) => {
                    setDiffTime(Number(e.target.value));
                    resetAnimation();
                  }}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5분</span>
                  <span>120분</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-green-800">
                  표면 농도: {(diffSurfaceConc).toExponential(1)} /cm³
                </label>
                <input
                  type="range"
                  min="18"
                  max="21"
                  step="0.1"
                  value={Math.log10(diffSurfaceConc)}
                  onChange={(e) => {
                    setDiffSurfaceConc(Math.pow(10, Number(e.target.value)));
                    resetAnimation();
                  }}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-green"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10¹⁸</span>
                  <span>10²¹</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-purple-800">
                  배경 농도: {(diffBackgroundConc).toExponential(1)} /cm³
                </label>
                <input
                  type="range"
                  min="14"
                  max="17"
                  step="0.1"
                  value={Math.log10(diffBackgroundConc)}
                  onChange={(e) => {
                    setDiffBackgroundConc(Math.pow(10, Number(e.target.value)));
                    resetAnimation();
                  }}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-purple"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10¹⁴</span>
                  <span>10¹⁷</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                {isAnimating ? (
                  <>
                    <Pause className="w-5 h-5" />
                    일시정지
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    애니메이션
                  </>
                )}
              </button>
              <button
                onClick={resetAnimation}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                초기화
              </button>
              {isAnimating && (
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm font-semibold text-gray-600">
                    진행률: {Math.round((animationTime / diffTime) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              도펀트 농도 프로파일 (Concentration Profile)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={calculateDiffusionProfile(isAnimating ? animationTime : diffTime)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="depth"
                  label={{ value: '깊이 (μm)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: '농도 (log₁₀ /cm³)', angle: -90, position: 'insideLeft' }}
                  domain={[14, 21]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'logConcentration') {
                      return [`10^${value.toFixed(2)} /cm³`, '농도'];
                    }
                    return value;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="logConcentration"
                  stroke={dopantProperties[diffDopantType].color}
                  strokeWidth={3}
                  dot={false}
                  name="농도"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Diffusion Furnace Schematic */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">확산 공정 Furnace 개략도</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '500px', backgroundColor: '#f8f9fa' }}>
                {/* Background */}
                <rect width="1000" height="500" fill="#f8f9fa" />

                {/* Gas Input Lines */}
                {/* O2 Line */}
                <line x1="50" y1="180" x2="180" y2="180" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="180" x2="180" y2="190" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="190" x2="230" y2="190" stroke="#333" strokeWidth="3" />

                {/* N2 Line */}
                <line x1="50" y1="240" x2="180" y2="240" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="240" x2="180" y2="210" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="210" x2="230" y2="210" stroke="#333" strokeWidth="3" />

                {/* Gas Labels */}
                <text x="30" y="185" fontSize="16" fontWeight="bold" textAnchor="middle">O₂</text>
                <text x="30" y="245" fontSize="16" fontWeight="bold" textAnchor="middle">N₂</text>

                {/* Flow Control Valves */}
                <circle cx="120" cy="180" r="15" fill="white" stroke="#333" strokeWidth="2" />
                <path d="M108 168 L132 192 M132 168 L108 192" stroke="#333" strokeWidth="2" />

                <circle cx="120" cy="240" r="15" fill="white" stroke="#333" strokeWidth="2" />
                <path d="M108 228 L132 252 M132 228 L108 252" stroke="#333" strokeWidth="2" />

                <circle cx="230" cy="200" r="15" fill="white" stroke="#333" strokeWidth="2" />
                <path d="M218 188 L242 212 M242 188 L218 212" stroke="#333" strokeWidth="2" />

                {/* Flow Direction Arrows */}
                <polygon points="150,175 165,180 150,185" fill="#333" />
                <polygon points="150,235 165,240 150,245" fill="#333" />
                <polygon points="240,195 255,200 240,205" fill="#333" />

                {/* Quartz Diffusion Tube */}
                <rect x="270" y="150" width="360" height="100" fill="#e6f3ff" stroke="#333" strokeWidth="3" rx="50" ry="50" />

                {/* Heaters above the tube */}
                <circle cx="370" cy="140" r="6" fill="#ff0000" />
                <circle cx="410" cy="140" r="6" fill="#ff0000" />
                <circle cx="450" cy="140" r="6" fill="#ff0000" />
                <circle cx="490" cy="140" r="6" fill="#ff0000" />
                <circle cx="530" cy="140" r="6" fill="#ff0000" />

                {/* Heaters below the tube */}
                <circle cx="370" cy="260" r="6" fill="#ff0000" />
                <circle cx="410" cy="260" r="6" fill="#ff0000" />
                <circle cx="450" cy="260" r="6" fill="#ff0000" />
                <circle cx="490" cy="260" r="6" fill="#ff0000" />
                <circle cx="530" cy="260" r="6" fill="#ff0000" />

                {/* Carrier Boat (long bar under wafers) */}
                <rect x="312" y="205" width="271" height="8" fill="#8B4513" stroke="#333" strokeWidth="1" rx="4" />

                {/* Wafer representations (vertical lines) - 30 wafers */}
                <g stroke="#4472c4" strokeWidth="2">
                  <line x1="317" y1="170" x2="317" y2="205" />
                  <line x1="326" y1="170" x2="326" y2="205" />
                  <line x1="335" y1="170" x2="335" y2="205" />
                  <line x1="344" y1="170" x2="344" y2="205" />
                  <line x1="353" y1="170" x2="353" y2="205" />
                  <line x1="362" y1="170" x2="362" y2="205" />
                  <line x1="371" y1="170" x2="371" y2="205" />
                  <line x1="380" y1="170" x2="380" y2="205" />
                  <line x1="389" y1="170" x2="389" y2="205" />
                  <line x1="398" y1="170" x2="398" y2="205" />
                  <line x1="407" y1="170" x2="407" y2="205" />
                  <line x1="416" y1="170" x2="416" y2="205" />
                  <line x1="425" y1="170" x2="425" y2="205" />
                  <line x1="434" y1="170" x2="434" y2="205" />
                  <line x1="443" y1="170" x2="443" y2="205" />
                  <line x1="452" y1="170" x2="452" y2="205" />
                  <line x1="461" y1="170" x2="461" y2="205" />
                  <line x1="470" y1="170" x2="470" y2="205" />
                  <line x1="479" y1="170" x2="479" y2="205" />
                  <line x1="488" y1="170" x2="488" y2="205" />
                  <line x1="497" y1="170" x2="497" y2="205" />
                  <line x1="506" y1="170" x2="506" y2="205" />
                  <line x1="515" y1="170" x2="515" y2="205" />
                  <line x1="524" y1="170" x2="524" y2="205" />
                  <line x1="533" y1="170" x2="533" y2="205" />
                  <line x1="542" y1="170" x2="542" y2="205" />
                  <line x1="551" y1="170" x2="551" y2="205" />
                  <line x1="560" y1="170" x2="560" y2="205" />
                  <line x1="569" y1="170" x2="569" y2="205" />
                  <line x1="578" y1="170" x2="578" y2="205" />
                </g>

                {/* Tube outlet to Burner Box */}
                <line x1="630" y1="200" x2="680" y2="200" stroke="#333" strokeWidth="3" />

                {/* Burner Box / Scrubber */}
                <rect x="680" y="160" width="80" height="80" fill="#f0f0f0" stroke="#333" strokeWidth="2" />

                {/* Exhaust line */}
                <line x1="720" y1="160" x2="720" y2="50" stroke="#333" strokeWidth="3" />
                <rect x="715" y="40" width="10" height="20" fill="#333" />

                {/* Liquid Source Container */}
                <rect x="180" y="320" width="60" height="60" fill="#e6f3ff" stroke="#333" strokeWidth="2" />

                {/* Liquid Source (orange liquid) */}
                <ellipse cx="210" cy="350" rx="20" ry="15" fill="#ff9933" />

                {/* Temperature Controlled Bath */}
                <rect x="170" y="340" width="80" height="50" fill="#87ceeb" stroke="#333" strokeWidth="2" />

                {/* Vapor line from liquid source */}
                <line x1="210" y1="320" x2="210" y2="270" stroke="#333" strokeWidth="2" />
                <line x1="210" y1="270" x2="180" y2="270" stroke="#333" strokeWidth="2" />
                <line x1="180" y1="270" x2="180" y2="225" stroke="#333" strokeWidth="2" />

                {/* Vapor arrow */}
                <polygon points="175,230 180,220 185,230" fill="#333" />

                {/* Labels */}
                <text x="450" y="110" fontSize="14" fontWeight="bold" textAnchor="middle">Quartz Diffusion Tube</text>
                <text x="450" y="242" fontSize="12" textAnchor="middle">Wafers on carrier boat</text>
                <text x="450" y="280" fontSize="12" fontWeight="bold" textAnchor="middle">Heater Zone</text>
                <text x="720" y="195" fontSize="12" fontWeight="bold" textAnchor="middle">Burner Box /</text>
                <text x="720" y="210" fontSize="12" fontWeight="bold" textAnchor="middle">Scrubber</text>
                <text x="720" y="30" fontSize="12" fontWeight="bold" textAnchor="middle">Exhaust</text>
                <text x="150" y="310" fontSize="12" fontWeight="bold" textAnchor="middle">Liquid Source</text>
                <text x="210" y="405" fontSize="12" fontWeight="bold" textAnchor="middle">Temperature Controlled Bath</text>

                {/* Heat indication for Temperature Controlled Bath */}
                <g stroke="#ff6600" strokeWidth="1" fill="none">
                  <path d="M175 365 Q180 360 185 365 Q190 370 195 365" />
                  <path d="M195 365 Q200 360 205 365 Q210 370 215 365" />
                  <path d="M215 365 Q220 360 225 365 Q230 370 235 365" />
                  <path d="M235 365 Q240 360 245 365" />
                </g>
              </svg>
            </div>
          </div>

          {/* Pre-deposition vs Drive-in: Key Differences */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <GitCompare className="w-6 h-6 text-purple-600" />
              {diffProcessType === 'predeposition' ? 'Pre-deposition' : 'Drive-in'} 공정 - 차이점과 관전 포인트
            </h2>
            
            {diffProcessType === 'predeposition' ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">📥</span>
                    Pre-deposition (정원 확산) 특징
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>• 표면이 일정:</strong> 표면 농도(C₀)가 시간이 지나도 고정되어 있습니다. 계속 도펀트가 공급되기 때문입니다.</p>
                    <p><strong>• 프로파일 형태:</strong> erfc 함수 - 표면에서 급격히 높고 깊이 들어갈수록 완만하게 감소합니다.</p>
                    <p><strong>• 시간 증가 시:</strong> 농도는 더 깊이 침투하지만, 표면 농도는 변하지 않습니다.</p>
                  </div>
                </div>

                <div className="bg-purple-100 rounded-lg p-4">
                  <h3 className="font-bold text-purple-900 mb-2">🎯 관전 포인트</h3>
                  <div className="text-sm text-gray-800 space-y-2">
                    <p><strong>1. 표면 농도 확인:</strong> 그래프 왼쪽 끝(depth=0)이 계속 같은 높이를 유지하는지 보세요.</p>
                    <p><strong>2. 온도 변화 실험:</strong> 온도를 올리면 같은 시간에 더 깊이 들어갑니다. 하지만 표면은 여전히 같은 높이!</p>
                    <p><strong>3. 실무 사용:</strong> 높은 표면 농도가 필요한 Source/Drain 초기 형성, 저항 감소용으로 사용합니다.</p>
                    <p><strong>4. 다음 단계:</strong> Pre-deposition 후 가스를 차단하고 Drive-in을 하면 더 깊고 균일한 접합을 만들 수 있습니다.</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> 시간을 5분 → 30분 → 60분으로 바꿔가며 프로파일이 어떻게 깊어지는지 관찰해보세요. 
                    표면 높이는 그대로이고 오른쪽으로만 확장되는 것을 볼 수 있습니다!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">📤</span>
                    Drive-in (제한 확산) 특징
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>• 표면이 감소:</strong> 표면 농도가 시간에 따라 점점 낮아집니다. 더 이상 도펀트 공급이 없기 때문입니다.</p>
                    <p><strong>• 프로파일 형태:</strong> Gaussian - 종 모양으로 표면과 깊은 곳 모두 낮아지고 중간 어딘가에 피크가 있습니다.</p>
                    <p><strong>• 시간 증가 시:</strong> 더 깊이 확산되지만, 전체적으로 농도가 '희석'되어 퍼집니다.</p>
                  </div>
                </div>

                <div className="bg-orange-100 rounded-lg p-4">
                  <h3 className="font-bold text-orange-900 mb-2">🎯 관전 포인트</h3>
                  <div className="text-sm text-gray-800 space-y-2">
                    <p><strong>1. 표면 하락 확인:</strong> 그래프 왼쪽 끝(depth=0)이 시간이 지날수록 낮아지는지 보세요.</p>
                    <p><strong>2. 총량 보존:</strong> 도펀트 총량(dose)은 일정합니다. 넓게 퍼지면서 희석되는 것뿐입니다.</p>
                    <p><strong>3. 온도와 시간:</strong> 온도를 올리거나 시간을 늘리면 더 깊고 넓게 퍼집니다. 프로파일이 '낮고 넓게' 변합니다.</p>
                    <p><strong>4. 실무 사용:</strong> Pre-deposition으로 만든 얕은 고농도 영역을 깊은 접합으로 재분포시킬 때 사용합니다.</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-900">
                    <strong>💡 Tip:</strong> 시간을 30분 → 60분 → 120분으로 바꿔보세요. 
                    표면이 계속 낮아지면서 오른쪽(깊은 곳)으로 퍼지는 것을 볼 수 있습니다. 마치 잉크가 물에 퍼지듯이!
                  </p>
                </div>
              </div>
            )}

            {/* Practical Usage */}
            <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300">
              <h3 className="font-bold text-gray-900 mb-2">🏭 실무에서는 이렇게 사용합니다</h3>
              <div className="text-sm text-gray-800 space-y-2">
                <p><strong>1단계 (Pre-deposition):</strong> 900-1000°C에서 15-30분 → 표면에 고농도 형성</p>
                <p><strong>2단계 (Drive-in):</strong> 가스 차단 후 1000-1100°C에서 1-2시간 → 깊은 접합 형성</p>
                <p className="text-orange-700 font-semibold">
                  ⚡ 두 공정을 조합하면 "높은 표면 농도 + 깊은 접합"을 동시에 달성할 수 있습니다!
                </p>
              </div>
            </div>
          </div>

          {/* Think More Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">💡 더 생각해보기</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 온도를 100°C 높이면 확산 계수는 몇 배 증가할까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Arrhenius 방정식을 생각해보세요. 지수 함수이므로 선형적으로 증가하지 않습니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 Pre-deposition 후 Drive-in을 하는 이유는?</p>
                <p className="text-sm text-gray-600">
                  힌트: 높은 표면 농도와 깊은 접합을 동시에 얻을 수 있습니다. 프로파일을 비교해보세요.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 실리콘 외 다른 반도체(GaAs, SiC 등)에서도 같은 원리가 적용될까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Fick의 법칙은 보편적이지만, D₀와 Qd는 재료마다 다릅니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 도펀트에 따라 확산 속도가 다른 이유는?</p>
                <p className="text-sm text-gray-600">
                  힌트: 원자의 크기(질량)와 실리콘 결정 구조 내 이동 메커니즘이 다릅니다.
                </p>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Implantation Simulator Tab */}
          {activeTab === 'implantation' && (
            <div className="space-y-6">
          {/* Implantation Theory & Equipment */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-orange-600" />
              이온 주입 장치 및 원리 (Ion Implanter)
            </h2>

            {/* Equipment Diagram */}
            <IonBeamSystemDiagram />

            {/* Theory and Key Concepts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-bold text-gray-800 mb-3">📊 LSS Theory (Gaussian Profile)</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-semibold text-orange-900 mb-2">농도 분포식</p>
                    <p className="font-mono text-sm text-orange-700 mb-2">
                      C(x) = (Φ/√2πΔRp) · exp[-(x-Rp)²/2ΔRp²]
                    </p>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>• <strong>Φ (Dose):</strong> 총 주입된 이온 개수 (ions/cm²)</p>
                      <p>• <strong>Rp (Range):</strong> 평균 침투 깊이 (μm)</p>
                      <p>• <strong>ΔRp (Straggle):</strong> 분산 (표준편차)</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">에너지와 깊이 관계</p>
                    <p className="text-sm text-gray-700">
                      <strong>Rp ∝ E / M⁰·⁶</strong> (근사식)
                    </p>
                    <div className="text-xs text-gray-700 mt-2 space-y-1">
                      <p>• 에너지 ↑ → 깊이 ↑</p>
                      <p>• 질량 ↑ → 깊이 ↓</p>
                      <p>• 예: 100keV B는 As보다 깊이 침투</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5">
                <h3 className="font-bold text-gray-800 mb-3">⚠️ 주요 고려사항</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="font-semibold text-yellow-900 mb-1">Channeling 효과</p>
                    <p className="text-xs text-gray-700">
                      이온이 결정의 채널을 따라 비정상적으로 깊이 침투하는 현상.
                      <strong className="text-red-600"> → Tilt angle 7°로 방지!</strong>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <p className="font-semibold text-red-900 mb-1">결정 손상 (Damage)</p>
                    <p className="text-xs text-gray-700">
                      고속 이온이 Si 원자를 충돌하여 결정 구조 파괴.
                      <strong className="text-blue-600"> → Annealing으로 회복!</strong>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="font-semibold text-green-900 mb-1">Dose 제어</p>
                    <p className="text-xs text-gray-700">
                      Beam current와 시간으로 정확한 개수 제어 가능.
                      <strong className="text-green-600"> → 최대 장점!</strong>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <p className="font-semibold text-purple-900 mb-1">Activation</p>
                    <p className="text-xs text-gray-700">
                      주입된 이온이 격자 위치로 이동하여 전기적 활성 상태로 전환.
                      <strong className="text-orange-600"> → 800-1100°C Annealing</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Panel - Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">이온 주입 시뮬레이터</h2>

              {/* CMOS Device Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">CMOS 소자 타입</label>
                <select
                  value={deviceType}
                  onChange={(e) => applyPreset(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(devicePresets).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.name}
                    </option>
                  ))}
                </select>
                {deviceType !== 'custom' && (
                  <p className="text-xs text-gray-500 mt-1">{devicePresets[deviceType].description}</p>
                )}
              </div>

              {/* Ion Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">이온 종류</label>
                <select
                  value={implDopantType}
                  onChange={(e) => {
                    setImplDopantType(e.target.value);
                    setDeviceType('custom');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(dopantProperties).map(([symbol, props]) => (
                    <option key={symbol} value={symbol}>
                      {symbol} ({props.name}) - {props.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Energy Control */}
              <div className="mb-4 p-3 bg-white rounded-lg border-2 border-orange-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-orange-800">
                  주입 에너지: {implEnergy} keV
                </label>
                <input
                  type="range"
                  min="10"
                  max="400"
                  value={implEnergy}
                  onChange={(e) => {
                    setImplEnergy(Number(e.target.value));
                    setDeviceType('custom');
                  }}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 keV</span>
                  <span>400 keV</span>
                </div>
              </div>

              {/* Dose Control */}
              <div className="mb-4 p-3 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-purple-800">
                  도즈량: {implDose.toExponential(1)} ions/cm²
                </label>
                <input
                  type="range"
                  min="11"
                  max="17"
                  step="0.1"
                  value={Math.log10(implDose)}
                  onChange={(e) => {
                    setImplDose(Math.pow(10, Number(e.target.value)));
                    setDeviceType('custom');
                  }}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-purple"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10¹¹</span>
                  <span>10¹⁷</span>
                </div>
              </div>

              {/* Wafer Tilt Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-1">웨이퍼 기울기 (7° Tilt)</h4>
                <p className="text-xs text-blue-700 mb-2">
                  <strong>채널링 방지:</strong> 이온이 실리콘 결정 격자 사이로 깊숙이 파고드는 현상을 방지하여
                  원하는 깊이에 균일하게 주입되도록 합니다.
                </p>
                <p className="text-xs text-blue-700">
                  <strong>웨이퍼 회전:</strong> PR 패턴이나 3D 구조물에 의한 섀도잉(그림자) 효과를 방지하기 위해
                  실제 공정에서는 웨이퍼를 회전시키며 이온을 주입하여 도핑 균일성을 확보합니다.
                </p>
              </div>

              {/* Calculated Results */}
              <div className="mt-4 p-4 bg-white rounded border">
                <h3 className="font-medium text-gray-800 mb-2">계산 결과</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>투영 거리 (Rp): {(calculateImplantParams(implEnergy, implDopantType).Rp * 1000).toFixed(1)} nm</div>
                  <div>확산도 (ΔRp): {(calculateImplantParams(implEnergy, implDopantType).deltaRp * 1000).toFixed(1)} nm</div>
                  <div>이온 질량: {dopantProperties[implDopantType].mass} amu</div>
                  <div>도핑 타입: {dopantProperties[implDopantType].type}</div>
                  <div>깊이 범위: 0 ~ {(calculateImplantParams(implEnergy, implDopantType).Rp * 4000).toFixed(0)} nm</div>
                </div>
              </div>
            </div>

            {/* Right Panel - Visualizations side by side */}
            <div className="xl:col-span-2 space-y-6">
              {/* Concentration Profile and Wafer Cross Section - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Concentration Profile Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">농도 분포 (선형 스케일)</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={calculateImplantationProfile()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="depth"
                        label={{ value: '깊이 (μm)', position: 'insideBottom', offset: -5 }}
                        tickFormatter={(value) => value.toFixed(2)}
                      />
                      <YAxis
                        label={{ value: '농도 (ions/cm³)', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => value.toExponential(0)}
                      />
                      <Tooltip
                        formatter={(value, name) => [value.toExponential(2), '농도 (ions/cm³)']}
                        labelFormatter={(value) => `깊이: ${(value * 1000).toFixed(0)} nm`}
                      />
                      <Area
                        type="monotone"
                        dataKey="concentration"
                        stroke="#3b82f6"
                        fill="#93c5fd"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Wafer Cross Section */}
                <div>
                  <WaferCrossSection
                    Rp={calculateImplantParams(implEnergy, implDopantType).Rp * 1000}
                    deltaRp={calculateImplantParams(implEnergy, implDopantType).deltaRp * 1000}
                  />
                </div>
              </div>

              {/* Additional Information Sections */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">CMOS 소자별 이온 주입 특성</h3>
                <div className="space-y-3 text-sm text-green-800">
                  <div>
                    <h4 className="font-medium text-green-900">Source/Drain:</h4>
                    <p>50-200nm 깊이, 고농도 (1e15+ ions/cm²), As/P 주로 사용</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">LDD:</h4>
                    <p>20-50nm 얕은 깊이, 저농도, 핫캐리어 효과 억제</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Well 도핑:</h4>
                    <p>1-3μm 깊이, 소자 분리 및 래치업 방지</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Channel 도핑:</h4>
                    <p>10-30nm 표면 근처, 문턱전압 조절</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">이온 주입 공정 정보</h3>
                <div className="grid grid-cols-1 gap-3 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium text-blue-900">깊이 범위:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>얕은 접합: 10-100nm (Channel, LDD)</li>
                      <li>중간 접합: 100nm-1μm (Source/Drain)</li>
                      <li>깊은 접합: 1-10μm (Well, Retrograde)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">주요 특징:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>가우시안 농도 분포</li>
                      <li>에너지↑ → 깊이↑, 질량↑ → 깊이↓</li>
                      <li>7° 기울기: 채널링 효과 방지</li>
                      <li>웨이퍼 회전: 섀도잉 효과 방지</li>
                      <li>마스크로 선택적 도핑</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Points and Observation Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              이온 주입 시뮬레이터 - 관전 포인트
            </h3>
            
            <div className="space-y-4">
              {/* Energy Effect */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  1. 에너지(Energy)와 깊이의 관계
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>• 에너지 ↑ → Rp ↑:</strong> 에너지가 높을수록 이온이 더 깊이 들어갑니다. (Rp ∝ E)</p>
                  <p><strong>• 실험해보세요:</strong> 에너지를 50 keV → 100 keV → 150 keV로 바꿔보세요. 프로파일의 피크가 오른쪽으로 이동합니다.</p>
                  <p className="text-blue-700 font-semibold">🎯 현대 공정에서는 10-50 keV (얕은 접합), 100-400 keV (깊은 well) 사용</p>
                </div>
              </div>

              {/* Dose Effect */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  2. Dose(도즈)와 농도의 관계
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>• Dose ↑ → 피크 농도 ↑:</strong> 더 많이 주입하면 전체 프로파일이 위로 올라갑니다.</p>
                  <p><strong>• 실험해보세요:</strong> Dose를 10¹³ → 10¹⁵ → 10¹⁶으로 바꿔보세요. 프로파일 형태는 같지만 높이만 변합니다.</p>
                  <p className="text-purple-700 font-semibold">🎯 이것이 이온 주입의 최대 장점! 정확한 개수 제어</p>
                </div>
              </div>

              {/* Annealing Effect */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  3. Annealing(열처리)의 효과
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>• Annealing 체크:</strong> 상단에서 "Annealing 적용"을 켜보세요.</p>
                  <p><strong>• 프로파일 변화:</strong> 약간 더 넓고 부드러워집니다. 주입 후 확산이 일어나기 때문입니다.</p>
                  <p><strong>• 온도/시간 영향:</strong> 온도를 높이거나 시간을 늘리면 확산이 더 많이 일어납니다.</p>
                  <p className="text-orange-700 font-semibold">🎯 실무: 900-1000°C RTA로 결정 손상 회복 + 도펀트 활성화</p>
                </div>
              </div>

              {/* Dopant Mass Effect */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">⚖️</span>
                  4. 도펀트 종류(질량)에 따른 차이
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>• 붕소 (B, 질량 11):</strong> 가볍고 작아서 같은 에너지에서 가장 깊이 들어갑니다.</p>
                  <p><strong>• 인 (P, 질량 31):</strong> 중간 질량, 중간 깊이</p>
                  <p><strong>• 비소 (As, 질량 75):</strong> 무거워서 stopping power가 크고 얕게 주입됩니다.</p>
                  <p className="text-green-700 font-semibold">🎯 실험: 같은 에너지(50keV)로 B, P, As를 비교해보세요!</p>
                </div>
              </div>

              {/* Practical Tips */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300">
                <h4 className="font-bold text-gray-900 mb-2">💡 실무 적용 팁</h4>
                <div className="text-sm text-gray-800 space-y-2">
                  <p><strong>• Shallow junction (얕은 접합):</strong> 저에너지 (10-30 keV) + 경량 도펀트(B)</p>
                  <p><strong>• Deep well (깊은 well):</strong> 고에너지 (200-400 keV) + 다단계 주입</p>
                  <p><strong>• Channeling 방지:</strong> Tilt angle 7° 필수 (장비가 자동으로 처리)</p>
                  <p><strong>• Dose 정밀도:</strong> ±1-2% 이내로 재현성 확보 가능</p>
                  <p className="text-red-600 font-semibold">⚠️ 주입 후 반드시 Annealing! 그렇지 않으면 결정 손상으로 누설 전류 발생</p>
                </div>
              </div>
            </div>
          </div>

          {/* Think More Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">💡 더 생각해보기</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 같은 dose를 얻으려면 에너지를 어떻게 조절해야 할까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Dose는 beam current × time으로 결정되며, 에너지와는 독립적입니다. 하지만 깊이는 변합니다!
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 Tilt angle을 0°로 하면 어떤 문제가 발생할까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Channeling으로 인해 일부 이온이 예상보다 훨씬 깊이 들어갑니다. 프로파일에 꼬리(tail)가 생깁니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 무거운 원소(As)와 가벼운 원소(B)의 Rp 차이는?</p>
                <p className="text-sm text-gray-600">
                  힌트: 같은 에너지에서 질량이 클수록 stopping power가 커서 얕게 주입됩니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 Annealing 온도가 너무 높으면 어떤 문제가?</p>
                <p className="text-sm text-gray-600">
                  힌트: 원하지 않는 확산이 발생하여 정밀하게 제어한 프로파일이 변합니다.
                </p>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Comparison Tab */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              확산 vs 이온 주입 비교
            </h2>
            
            {/* Overlay Chart */}
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="depth" 
                  label={{ value: '깊이 (μm)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: '농도 (log₁₀ /cm³)', angle: -90, position: 'insideLeft' }}
                  domain={[14, 21]}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="diffusion" 
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false}
                  name="확산 (Diffusion)"
                />
                <Line 
                  type="monotone" 
                  dataKey="implantation" 
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={false}
                  name="이온 주입 (Implantation)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">상세 비교표</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-purple-100 to-orange-100">
                  <tr>
                    <th className="px-4 py-3 text-left">비교 항목</th>
                    <th className="px-4 py-3 text-left">확산 (Diffusion)</th>
                    <th className="px-4 py-3 text-left">이온 주입 (Implantation)</th>
                    <th className="px-4 py-3 text-left">우위</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">공정 온도</td>
                    <td className="px-4 py-3">900-1200°C (고온)</td>
                    <td className="px-4 py-3">상온 ~ 100°C (저온)</td>
                    <td className="px-4 py-3 text-orange-600 font-semibold">이온 주입</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">Dose 제어</td>
                    <td className="px-4 py-3">간접적 (시간/온도)</td>
                    <td className="px-4 py-3">직접적 (beam current)</td>
                    <td className="px-4 py-3 text-orange-600 font-semibold">이온 주입</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">깊이 제어</td>
                    <td className="px-4 py-3">√Dt 의존</td>
                    <td className="px-4 py-3">에너지로 직접 제어</td>
                    <td className="px-4 py-3 text-orange-600 font-semibold">이온 주입</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">프로파일 형태</td>
                    <td className="px-4 py-3">erfc 또는 Gaussian</td>
                    <td className="px-4 py-3">Gaussian</td>
                    <td className="px-4 py-3 text-gray-600">유사</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">마스크 재료</td>
                    <td className="px-4 py-3">SiO₂, Si₃N₄ (내열)</td>
                    <td className="px-4 py-3">Photoresist 가능</td>
                    <td className="px-4 py-3 text-orange-600 font-semibold">이온 주입</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">공정 시간</td>
                    <td className="px-4 py-3">15분 ~ 수시간</td>
                    <td className="px-4 py-3">수초 ~ 수분</td>
                    <td className="px-4 py-3 text-orange-600 font-semibold">이온 주입</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">결정 손상</td>
                    <td className="px-4 py-3">없음</td>
                    <td className="px-4 py-3">발생 (annealing 필요)</td>
                    <td className="px-4 py-3 text-purple-600 font-semibold">확산</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">표면 농도</td>
                    <td className="px-4 py-3">매우 높음 (고체 용해도)</td>
                    <td className="px-4 py-3">제한적</td>
                    <td className="px-4 py-3 text-purple-600 font-semibold">확산</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">장비 비용</td>
                    <td className="px-4 py-3">낮음 (furnace)</td>
                    <td className="px-4 py-3">높음 (implanter)</td>
                    <td className="px-4 py-3 text-purple-600 font-semibold">확산</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">현대 응용</td>
                    <td className="px-4 py-3">특수 용도</td>
                    <td className="px-4 py-3">표준 공정</td>
                    <td className="px-4 py-3 text-orange-600 font-semibold">이온 주입</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">확산의 장점</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>매우 높은 표면 농도 달성 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>결정 손상 없음</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>낮은 장비 비용</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>대량 생산 적합 (batch processing)</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>주요 적용:</strong> 깊은 well 형성, 고농도 영역, 특수 소자
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">이온 주입의 장점</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>정확한 dose 및 깊이 제어</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>저온 공정 (PR 마스크 사용)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>임의의 깊이 주입 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>재현성 우수</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>주요 적용:</strong> 현대 CMOS 공정의 표준, Source/Drain, LDD
                </p>
              </div>
            </div>
          </div>

          {/* Think More Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">💡 더 생각해보기</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 왜 현대 반도체는 거의 이온 주입만 사용할까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: 나노미터 스케일에서는 정밀도가 생명입니다. 수 nm의 오차도 치명적입니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 확산이 완전히 사라질까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Power 소자, 고전압 소자, 특수 응용에서는 여전히 확산을 사용합니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 두 방법을 조합하면 어떤 장점이 있을까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Implantation으로 정확한 도즈, Annealing(확산)으로 프로파일 최적화
                </p>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Temperature Effect Tab */}
          {activeTab === 'temperature' && (
            <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              온도가 도핑 공정에 미치는 영향
            </h2>
            
            {/* Temperature Comparison Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={[900, 950, 1000, 1050, 1100, 1150, 1200].map(temp => {
                const D = calculateDiffusionCoefficient(temp, diffDopantType);
                return {
                  temperature: temp,
                  diffusionCoeff: D * 1e12,
                  junctionDepth: 2 * Math.sqrt(D * diffTime * 60) * 1e4
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="temperature" 
                  label={{ value: '온도 (°C)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'D (×10⁻¹² cm²/s)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  label={{ value: '접합 깊이 (μm)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="diffusionCoeff" 
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="확산 계수"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="junctionDepth" 
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="접합 깊이"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-3">고온의 영향</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">↑</span>
                  <span>확산 속도 급격히 증가</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">↑</span>
                  <span>접합 깊이 증가</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">↑</span>
                  <span>공정 시간 단축 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">↓</span>
                  <span>제어 정밀도 감소</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-3">저온의 영향</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">↓</span>
                  <span>확산 속도 감소</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">↓</span>
                  <span>얕은 접합 형성</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">↑</span>
                  <span>제어 정밀도 향상</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">↑</span>
                  <span>공정 시간 증가</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-3">최적 온도 선택</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>목표 접합 깊이</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>공정 시간 제약</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>재현성 요구사항</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>다른 공정과의 호환성</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Annealing Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Annealing (열처리)의 역할
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-3">이온 주입 후 Annealing</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-gray-700 mb-1">1. 결정 손상 회복</p>
                    <p className="text-gray-600">
                      이온 충돌로 손상된 Si 결정 구조를 원상 복구
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-gray-700 mb-1">2. 도펀트 활성화</p>
                    <p className="text-gray-600">
                      격자 위치로 이동하여 전기적으로 활성 상태로 전환
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-gray-700 mb-1">3. 프로파일 조정</p>
                    <p className="text-gray-600">
                      약간의 확산으로 더 부드러운 프로파일 형성
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-700 mb-3">Annealing 조건</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-gray-700">RTA (Rapid Thermal Annealing)</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 온도: 900-1100°C<br/>
                      • 시간: 수초 ~ 수십초<br/>
                      • 장점: 최소 확산, 빠른 공정
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-gray-700">Furnace Annealing</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 온도: 800-1000°C<br/>
                      • 시간: 30분 ~ 수시간<br/>
                      • 장점: 완전한 회복, 균일성
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Think More Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">💡 더 생각해보기</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 온도를 50°C 올리면 확산 속도는 약 몇 배 증가할까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Arrhenius 방정식의 지수 함수 특성. 일반적으로 2-3배 정도 증가합니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 왜 RTA가 현대 공정에서 선호될까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: 초미세 공정에서는 원하지 않는 확산을 최소화해야 합니다. 빠른 가열/냉각이 핵심!
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 Annealing 온도가 너무 낮으면?</p>
                <p className="text-sm text-gray-600">
                  힌트: 결정 손상이 완전히 회복되지 않아 누설 전류, 이동도 저하 등의 문제 발생
                </p>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Application Guide Tab */}
          {activeTab === 'application' && (
            <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              실무 적용 가이드
            </h2>
            
            {/* Decision Tree */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">공정 선택 Decision Tree</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="font-bold text-gray-800 mb-2">Q1. 정밀한 dose 제어가 필요한가?</p>
                  <div className="ml-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">YES →</span> <span className="text-blue-600">이온 주입 권장</span>
                      <span className="text-xs text-gray-600 ml-2">(현대 CMOS, Logic 소자)</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">NO →</span> Q2로 이동
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="font-bold text-gray-800 mb-2">Q2. 매우 높은 표면 농도가 필요한가?</p>
                  <div className="ml-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">YES →</span> <span className="text-purple-600">확산 권장</span>
                      <span className="text-xs text-gray-600 ml-2">(Power 소자, 고농도 영역)</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">NO →</span> Q3로 이동
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <p className="font-bold text-gray-800 mb-2">Q3. Photoresist를 마스크로 사용해야 하나?</p>
                  <div className="ml-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">YES →</span> <span className="text-orange-600">이온 주입 필수</span>
                      <span className="text-xs text-gray-600 ml-2">(PR은 고온 불가)</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">NO →</span> Q4로 이동
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <p className="font-bold text-gray-800 mb-2">Q4. 얕은 접합(shallow junction)이 필요한가?</p>
                  <div className="ml-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">YES →</span> <span className="text-green-600">이온 주입 권장</span>
                      <span className="text-xs text-gray-600 ml-2">(저에너지 주입)</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">NO →</span> <span className="text-gray-600">확산도 가능</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Examples */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5">
                <h4 className="text-lg font-bold text-gray-800 mb-3">
                  CMOS 공정 (Logic IC)
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-blue-700">Source/Drain 형성</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 방법: 이온 주입<br/>
                      • 도펀트: As (n), B (p)<br/>
                      • 에너지: 20-50 keV<br/>
                      • 이유: 정밀한 접합 깊이 제어
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-blue-700">Well 형성</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 방법: 고에너지 이온 주입 or 확산<br/>
                      • 도펀트: P (n-well), B (p-well)<br/>
                      • 에너지: 100-400 keV<br/>
                      • 이유: 깊은 영역 형성
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-blue-700">LDD (Lightly Doped Drain)</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 방법: 저에너지 이온 주입<br/>
                      • 도펀트: As, P<br/>
                      • 에너지: 5-20 keV<br/>
                      • 이유: Hot carrier 효과 억제
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5">
                <h4 className="text-lg font-bold text-gray-800 mb-3">
                  Power 소자
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-purple-700">고내압 영역</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 방법: 확산<br/>
                      • 도펀트: P, B<br/>
                      • 온도: 1100-1200°C<br/>
                      • 이유: 깊은 접합, 높은 농도
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-purple-700">IGBT Base 영역</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 방법: 고온 확산<br/>
                      • 도펀트: B<br/>
                      • 시간: 수시간<br/>
                      • 이유: 균일한 고농도 영역
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-purple-700">Epitaxial Layer</p>
                    <p className="text-gray-600 text-xs mt-1">
                      • 방법: 에피 성장 중 in-situ 도핑<br/>
                      • 이유: 정밀한 농도 제어<br/>
                      • 특징: 확산/주입 대안
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">실무 Best Practices</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">✓ DO</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 공정 전 TCAD 시뮬레이션</li>
                  <li>• 온도/시간 정밀 제어</li>
                  <li>• 정기적인 SIMS 측정</li>
                  <li>• Annealing 조건 최적화</li>
                  <li>• 다단계 확산 고려</li>
                  <li>• Dummy 웨이퍼로 테스트</li>
                </ul>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-700 mb-2">✗ DON'T</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 과도한 온도 상승</li>
                  <li>• Channeling 무시</li>
                  <li>• 불충분한 annealing</li>
                  <li>• 프로파일 측정 생략</li>
                  <li>• 마스크 재료 오선택</li>
                  <li>• 급격한 온도 변화</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">⚠️ 주의사항</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 후속 열공정 영향 고려</li>
                  <li>• 다층 구조 상호작용</li>
                  <li>• TED (일시 확산 증가)</li>
                  <li>• Segregation 효과</li>
                  <li>• 표면 상태 관리</li>
                  <li>• 재현성 확보</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Industry Trends */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">산업 동향 (Industry Trends)</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">초미세 공정 (Advanced Node)</p>
                <p className="text-gray-600">
                  7nm 이하 노드에서는 초저에너지 이온 주입, Plasma Doping, Solid Phase Epitaxy 등 
                  신기술이 도입되고 있습니다. 원자층 수준의 정밀도가 요구됩니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">3D 구조 (FinFET, GAA)</p>
                <p className="text-gray-600">
                  입체 구조에서는 모든 면에 균일한 도핑이 필요합니다. Conformal doping 기술과 
                  저온 공정이 핵심입니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">신소재 (SiC, GaN)</p>
                <p className="text-gray-600">
                  차세대 Power 소자용 Wide Bandgap 반도체는 기존 Si와 다른 도핑 조건이 필요합니다. 
                  초고온 공정이나 이온 주입+고온 activation이 사용됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Think More Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">💡 더 생각해보기</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 FinFET에서 왜 conformal doping이 어려울까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: 이온 주입은 직진성을 가지므로 측면, 하부에 도달하기 어렵습니다. Plasma doping 등 새로운 방법 필요.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 SiC의 activation annealing이 1600°C 이상인 이유는?</p>
                <p className="text-sm text-gray-600">
                  힌트: Wide bandgap → 높은 결합 에너지 → 도펀트가 격자 위치로 가기 위해 매우 높은 에너지 필요
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">🤔 미래에는 도핑 공정이 어떻게 변할까요?</p>
                <p className="text-sm text-gray-600">
                  힌트: Atomic Layer Doping, Molecular Layer Doping 등 원자 수준 제어 기술, AI 기반 공정 최적화
                </p>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">이해도 퀴즈</h2>
              </div>
              {showQuizResults && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">점수</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {calculateQuizScore()} / {quizQuestions.length}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <p className="flex-1 font-semibold text-gray-800 pt-1">{q.question}</p>
                  </div>

                  <div className="space-y-2 ml-11">
                    {q.options.map((option, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      const isCorrect = optIdx === q.correct;
                      const showResult = showQuizResults;

                      let bgColor = 'bg-white hover:bg-gray-100';
                      let borderColor = 'border-gray-300';
                      let icon = null;

                      if (showResult) {
                        if (isCorrect) {
                          bgColor = 'bg-green-50';
                          borderColor = 'border-green-500';
                          icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                        } else if (isSelected && !isCorrect) {
                          bgColor = 'bg-red-50';
                          borderColor = 'border-red-500';
                          icon = <XCircle className="w-5 h-5 text-red-600" />;
                        }
                      } else if (isSelected) {
                        bgColor = 'bg-blue-50';
                        borderColor = 'border-blue-500';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !showQuizResults && handleQuizAnswer(q.id, optIdx)}
                          disabled={showQuizResults}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 ${bgColor} ${borderColor} transition-colors ${
                            !showQuizResults && 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{option}</span>
                            {icon}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="mt-4 ml-11 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong>해설:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              {!showQuizResults ? (
                <button
                  onClick={checkQuiz}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  <CheckCircle className="w-5 h-5" />
                  채점하기
                </button>
              ) : (
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  <RotateCcw className="w-5 h-5" />
                  다시 풀기
                </button>
              )}
            </div>

            {showQuizResults && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-3">결과 분석</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">정답률</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {Math.round((calculateQuizScore() / quizQuestions.length) * 100)}%
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">맞은 문제</p>
                    <p className="text-3xl font-bold text-green-600">
                      {calculateQuizScore()}개
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">틀린 문제</p>
                    <p className="text-3xl font-bold text-red-600">
                      {quizQuestions.length - calculateQuizScore()}개
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">평가</p>
                  {calculateQuizScore() === quizQuestions.length && (
                    <p className="text-green-600">
                      🎉 완벽합니다! 도핑 공정을 매우 잘 이해하고 계십니다.
                    </p>
                  )}
                  {calculateQuizScore() >= quizQuestions.length * 0.7 && calculateQuizScore() < quizQuestions.length && (
                    <p className="text-blue-600">
                      👍 잘하셨습니다! 핵심 개념을 잘 파악하고 계십니다.
                    </p>
                  )}
                  {calculateQuizScore() >= quizQuestions.length * 0.4 && calculateQuizScore() < quizQuestions.length * 0.7 && (
                    <p className="text-orange-600">
                      💪 좋습니다! 조금 더 복습하면 완벽하게 이해할 수 있습니다.
                    </p>
                  )}
                  {calculateQuizScore() < quizQuestions.length * 0.4 && (
                    <p className="text-red-600">
                      📚 이론 탭을 다시 한번 학습하시고 시뮬레이터를 활용해보세요.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Study Tips */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              학습 팁
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">📖 복습 방법</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 이론 탭의 핵심 공식 암기</li>
                  <li>• 시뮬레이터로 파라미터 변화 실습</li>
                  <li>• 공정 비교 탭에서 차이점 정리</li>
                  <li>• "더 생각해보기" 질문에 답해보기</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">🎯 실무 준비</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• TCAD 시뮬레이션 툴 학습</li>
                  <li>• SIMS 데이터 해석 연습</li>
                  <li>• 실제 공정 spec sheet 분석</li>
                  <li>• 관련 논문/특허 읽기</li>
                </ul>
              </div>
            </div>
          </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DopingProcessSimulator;
