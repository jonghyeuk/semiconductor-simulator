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

// Atom component
const Atom = ({ x, y, element, size = 8 }) => {
  const colors = {
    'Al': '#C0C0C0',
    'Ar+': '#FF6B6B',
    'Cu': '#FFA500',
    'Si': '#4ECDC4',
    'H': '#FFFFFF',
    'O': '#FF4757',
  };

  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      fill={colors[element] || '#888888'}
      stroke="#333"
      strokeWidth={element.includes('+') ? 2 : 1}
    />
  );
};

const DepositionSimulator = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [isSimulating, setIsSimulating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [theoryStep, setTheoryStep] = useState(0);
  const [isTheoryPlaying, setIsTheoryPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [vaporAtoms, setVaporAtoms] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // 이론 가이드 스텝들
  const theorySteps = [
    {
      icon: '🎯',
      title: '반도체 증착의 세계에 오신 것을 환영합니다!',
      content: '반도체 제조에서 증착(Deposition)은 웨이퍼 위에 얇은 막을 형성하는 핵심 공정입니다.\n\n오늘 우리는 다섯 가지 주요 증착 방법의 분자 수준 메커니즘을 탐험해보겠습니다:\n\n• PVD Evaporation - 열 증발법\n• PVD Sputtering - 스퍼터링법\n• CVD Thermal - 열 화학기상증착\n• CVD PECVD - 플라즈마 보조 화학기상증착\n• ALD - 원자층 증착',
      highlight: '각 방법마다 고유한 물리/화학적 원리가 있습니다.',
    },
    {
      icon: '🔥',
      title: 'PVD Evaporation: 열의 힘',
      content: '열 증발법은 마치 물을 끓여서 수증기를 만드는 것과 같은 원리입니다.\n\n🔥 전자빔이나 저항 가열로 알루미늄 소스를 1200-1500°C로 가열합니다\n⚛️ 열에너지를 받은 Al 원자들이 증발하여 기화됩니다\n📏 진공 중에서 직선으로 날아가 기판에 도달합니다\n❄️ 차가운 기판에서 응축되어 막을 형성합니다',
      highlight: '증발 원자는 직선으로만 이동 → Line-of-sight 특성',
    },
    {
      icon: '🎯',
      title: 'PVD Sputtering: 충돌의 과학',
      content: 'PVD 스퍼터링은 마치 당구공의 충돌과 같은 원리입니다.\n\n⚡ 고에너지 아르곤 이온(Ar+)이 타겟을 때립니다\n💥 운동량이 전달되어 타겟 원자들이 "튕겨져" 나옵니다\n🎯 이 원자들이 웨이퍼에 도달하여 막을 형성합니다\n🧲 마그네트론을 사용하여 플라즈마 효율을 높입니다',
      highlight: '스퍼터링 수율 = 방출된 원자 수 / 입사 이온 수',
    },
    {
      icon: '🌡️',
      title: 'Thermal CVD: 순수 열의 화학반응',
      content: '열 CVD는 전통적인 요리와 비슷합니다. 고온에서 재료를 "익혀서" 새로운 물질을 만듭니다.\n\n🔥 챔버를 600-1000°C 고온으로 가열합니다\n🧪 SiH₄ 가스가 열에너지만으로 분해됩니다\n⚛️ 분해된 실리콘 원자가 웨이퍼 표면에서 막을 형성합니다',
      highlight: '고온 필수 → 매우 높은 막질, 하지만 열 손상 위험',
    },
    {
      icon: '⚡',
      title: 'PECVD: 플라즈마의 마법',
      content: 'PECVD는 마치 전자레인지 요리 같습니다. 고에너지 전자로 "분자를 흔들어서" 저온에서도 반응시킵니다.\n\n⚡ RF 파워(13.56 MHz)로 플라즈마를 생성합니다\n💫 고에너지 전자가 SiH₄ 분자와 충돌합니다\n🌡️ 200-400°C 저온에서도 활발한 반응이 일어납니다',
      highlight: '저온 공정 → 열 손상 방지, 라디칼 화학',
    },
    {
      icon: '⚛️',
      title: 'ALD: 원자 수준의 정밀함',
      content: 'ALD는 레고 블록을 하나씩 쌓는 것과 같습니다. 매우 정교하고 정확합니다.\n\n🔄 4단계 사이클을 반복합니다:\n1️⃣ 전구체 A 주입 → 표면 흡착\n2️⃣ 퍼지 → 잔여물 제거\n3️⃣ 전구체 B 주입 → 화학반응\n4️⃣ 퍼지 → 부산물 제거',
      highlight: '1 사이클 = 정확히 1 원자층 (0.5-2 Ångström)',
    },
  ];

  // 퀴즈 문제
  const quizQuestions = [
    {
      question: "PVD 증발법과 스퍼터링법의 가장 큰 차이점은?",
      options: [
        "증발법은 화학반응, 스퍼터링은 물리반응",
        "증발법은 열에너지, 스퍼터링은 운동량 전달",
        "증발법은 저온, 스퍼터링은 고온",
        "증발법은 느림, 스퍼터링은 빠름"
      ],
      correct: 1
    },
    {
      question: "Thermal CVD와 PECVD의 주요 차이점은?",
      options: [
        "Thermal CVD는 저온, PECVD는 고온",
        "Thermal CVD는 순수 열에너지, PECVD는 플라즈마 에너지",
        "Thermal CVD는 빠름, PECVD는 느림",
        "Thermal CVD는 물리반응, PECVD는 화학반응"
      ],
      correct: 1
    },
    {
      question: "ALD의 자기제한적(Self-limiting) 특성의 의미는?",
      options: [
        "반응이 저절로 멈춘다",
        "한 사이클에 정확히 1원자층만 증착된다",
        "온도가 자동으로 조절된다",
        "압력이 일정하게 유지된다"
      ],
      correct: 1
    },
  ];

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

  // 타이핑 애니메이션
  useEffect(() => {
    if (!isTheoryPlaying) return;

    const content = theorySteps[theoryStep]?.content || '';
    setTypedText('');

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= content.length) {
        setTypedText(content.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [theoryStep, isTheoryPlaying]);

  // PVD 증발 원자 생성
  useEffect(() => {
    if (isSimulating && activeTab === 'pvd-evap' && animationStep % 20 === 0) {
      const newAtom = {
        id: Date.now(),
        x: 180 + Math.random() * 40,
        y: 220,
        element: 'Al',
        startTime: animationStep
      };
      setVaporAtoms(prev => [...prev, newAtom].slice(-15));
    }
  }, [isSimulating, animationStep, activeTab]);

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
    setVaporAtoms([]);
  };

  const startTheoryAnimation = () => {
    setIsTheoryPlaying(true);
    setTheoryStep(0);
  };

  const stopTheoryAnimation = () => {
    setIsTheoryPlaying(false);
  };

  const nextTheoryStep = () => {
    if (theoryStep < theorySteps.length - 1) {
      setTheoryStep(theoryStep + 1);
    }
  };

  const prevTheoryStep = () => {
    if (theoryStep > 0) {
      setTheoryStep(theoryStep - 1);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion]?.correct?.toString()) {
      setScore(score + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  const renderTheoryTab = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-br from-blue-600 via-purple-500 to-pink-600 rounded-xl shadow-2xl p-8 text-white min-h-[600px] flex flex-col">
        {!isTheoryPlaying ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="text-6xl mb-4">🔬⚛️</div>
            <h2 className="text-4xl font-bold mb-4">
              반도체 증착공정 분자 시뮬레이터
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
              PVD, CVD, ALD의 분자 수준 메커니즘을 시각적으로 학습하세요!<br/>
              <span className="text-yellow-300 font-bold">단계별 가이드</span>로 쉽고 재미있게!
            </p>
            <button
              onClick={startTheoryAnimation}
              className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-yellow-50 transition-all text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 mt-8"
            >
              <PlayIcon />
              가이드 시작하기
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
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

            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{theorySteps[theoryStep]?.icon}</span>
                <h3 className="text-2xl font-bold">
                  {theorySteps[theoryStep]?.title}
                </h3>
              </div>

              <div className="text-lg leading-relaxed whitespace-pre-line mb-6 font-medium">
                {typedText}
                {typedText.length < (theorySteps[theoryStep]?.content?.length || 0) && (
                  <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse" />
                )}
              </div>

              {typedText.length >= (theorySteps[theoryStep]?.content?.length || 0) && theorySteps[theoryStep]?.highlight && (
                <div className="mt-6 p-4 bg-yellow-400/20 border-2 border-yellow-300 rounded-lg transition-all duration-500 opacity-100">
                  <div className="flex items-start gap-2 text-yellow-300">
                    <LightbulbIcon />
                    <p className="text-yellow-100 font-semibold">
                      {theorySteps[theoryStep].highlight}
                    </p>
                  </div>
                </div>
              )}
            </div>

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
                <PauseIcon />
                일시정지
              </button>

              {theoryStep < theorySteps.length - 1 ? (
                <button
                  onClick={nextTheoryStep}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-yellow-50 transition-all font-semibold shadow-lg"
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('pvd-evap')}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-300 transition-all font-semibold shadow-lg"
                >
                  시뮬레이션 시작 🔥
                </button>
              )}
            </div>
          </div>
        )}
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
        <h3 className="text-lg font-semibold mb-4">⚛️ 증발 메커니즘 시뮬레이션</h3>
        <div className="w-full h-80 bg-gradient-to-b from-gray-800 to-black rounded-lg border-4 border-gray-600 overflow-hidden relative">
          <svg className="w-full h-full">
            {/* 기판 (상단) */}
            <rect x="120" y="100" width="160" height="20" fill="#4ECDC4" />
            <text x="200" y="95" textAnchor="middle" fill="white" fontSize="12">Substrate (기판)</text>

            {/* 증발 소스 (하단) */}
            <rect x="160" y="240" width="80" height="30" fill="#C0C0C0" />
            <text x="200" y="285" textAnchor="middle" fill="white" fontSize="12">Al Source</text>

            {/* 전자빔/히터 */}
            <rect x="170" y="275" width="60" height="8" fill="#FF6B6B" opacity={isSimulating ? "0.8" : "0.3"}>
              {isSimulating && <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />}
            </rect>
            <text x="200" y="295" textAnchor="middle" fill="#FFD700" fontSize="10">E-beam Heater</text>

            {/* 증발된 원자들 */}
            {vaporAtoms.map((atom) => {
              const age = animationStep - atom.startTime;
              const currentY = atom.y - age * 1.5;
              const currentX = atom.x + (Math.random() - 0.5) * age * 0.3;

              if (currentY < 120) return null;

              return (
                <g key={atom.id}>
                  <Atom x={currentX} y={currentY} element={atom.element} size={6} />
                  <line
                    x1={atom.x}
                    y1={atom.y}
                    x2={currentX}
                    y2={currentY}
                    stroke="#C0C0C0"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </g>
              );
            })}

            {/* 증발 효과 */}
            {isSimulating && (
              <g>
                {[...Array(6)].map((_, i) => (
                  <circle
                    key={i}
                    cx={170 + i * 12}
                    cy={245}
                    r="4"
                    fill="#FFD700"
                    opacity="0.7"
                  >
                    <animate attributeName="cy" values="245;220;245" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                  </circle>
                ))}
              </g>
            )}

            {/* 온도 표시 */}
            <text x="200" y="320" textAnchor="middle" fill="#FF6B6B" fontSize="14" fontWeight="bold">
              {isSimulating ? "1200-1500°C" : "RT"}
            </text>
          </svg>

          <div className="absolute top-4 left-4 text-white text-xs">
            <div>🔥 열 증발: Al 소스 가열 → 기화</div>
            <div>⚛️ 직선 이동: 가스 분자의 자유 비행</div>
            <div>🎯 기판 증착: 응축 및 막 성장</div>
            <div>📏 Line-of-sight: 그림자 효과</div>
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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">🔥 증발 메커니즘</h4>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1️⃣ 가열: 전자빔/저항으로 소스 재료 가열</li>
            <li>2️⃣ 증발: 원자들이 열에너지로 기화</li>
            <li>3️⃣ 확산: 진공 중에서 직선 비행</li>
            <li>4️⃣ 충돌: 기판 표면에 원자 충돌</li>
            <li>5️⃣ 흡착: 표면에 원자 흡착 및 확산</li>
            <li>6️⃣ 성장: 핵생성 및 막 성장</li>
          </ol>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">📊 주요 특성</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-medium">증착속도</div>
              <div className="text-green-600">빠름</div>
            </div>
            <div>
              <div className="font-medium">Step Coverage</div>
              <div className="text-red-600">제한적</div>
            </div>
            <div>
              <div className="font-medium">막질</div>
              <div className="text-blue-600">치밀함</div>
            </div>
            <div>
              <div className="font-medium">진공도</div>
              <div className="text-purple-600">고진공</div>
            </div>
          </div>
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">⚛️ 스퍼터링 메커니즘</h3>
        <div className="bg-gray-100 rounded-lg p-8">
          <div className="text-center">
            <div className="inline-block animate-pulse text-6xl mb-4">🎯</div>
            <p className="text-gray-600">Ar+ 이온이 타겟을 충돌하여 원자를 방출합니다</p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-100 p-3 rounded text-center">
              <div className="font-bold text-blue-800">Ar+ 이온</div>
              <div className="text-xs">100-300 eV</div>
            </div>
            <div className="bg-orange-100 p-3 rounded text-center">
              <div className="font-bold text-orange-800">타겟 충돌</div>
              <div className="text-xs">운동량 전달</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded text-center">
              <div className="font-bold text-yellow-800">원자 방출</div>
              <div className="text-xs">~2 atoms/ion</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🔄 스퍼터링 메커니즘</h4>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1️⃣ 이온화: Ar → Ar+ + e-</li>
            <li>2️⃣ 가속: 전기장에서 이온 가속</li>
            <li>3️⃣ 충돌: 타겟 표면 운동량 전달</li>
            <li>4️⃣ 방출: 타겟 원자 기체상 방출</li>
            <li>5️⃣ 수송: 진공 챔버 내 이동</li>
            <li>6️⃣ 증착: 웨이퍼 표면 응축</li>
          </ol>
        </div>

        <div className="bg-cyan-50 p-4 rounded-lg">
          <h4 className="font-semibold text-cyan-800 mb-2">⚖️ 증발법과의 비교</h4>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-green-600">장점:</span>
              <ul className="ml-4 list-disc text-xs">
                <li>합금 조성 유지 가능</li>
                <li>다양한 재료 증착</li>
                <li>더 나은 Step Coverage</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-orange-600">단점:</span>
              <ul className="ml-4 list-disc text-xs">
                <li>더 복잡한 시스템</li>
                <li>플라즈마 손상 가능성</li>
              </ul>
            </div>
          </div>
        </div>
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🔥 열분해 메커니즘</h3>
        <div className="bg-red-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🌡️</div>
            <div className="font-mono text-xl font-bold text-red-800">SiH₄ → Si + 2H₂</div>
            <div className="text-sm text-gray-600 mt-2">600-1000°C</div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="bg-white p-2 rounded text-center">
              <div className="font-bold">가열</div>
              <div>챔버 고온</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-bold">분해</div>
              <div>열에너지</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-bold">확산</div>
              <div>표면 이동</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-bold">성장</div>
              <div>막 형성</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">📊 주요 특성</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-medium">온도</div>
              <div className="text-red-600">고온</div>
            </div>
            <div>
              <div className="font-medium">막질</div>
              <div className="text-green-600">매우 우수</div>
            </div>
            <div>
              <div className="font-medium">Step Coverage</div>
              <div className="text-green-600">우수</div>
            </div>
            <div>
              <div className="font-medium">증착속도</div>
              <div className="text-blue-600">중간</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚖️ 장단점</h4>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-green-600">장점:</span>
              <ul className="ml-4 list-disc text-xs">
                <li>매우 높은 막질과 순도</li>
                <li>우수한 Step Coverage</li>
                <li>안정적이고 재현성 좋음</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-red-600">단점:</span>
              <ul className="ml-4 list-disc text-xs">
                <li>고온으로 인한 열 손상</li>
                <li>느린 증착속도</li>
                <li>높은 에너지 소모</li>
              </ul>
            </div>
          </div>
        </div>
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">⚡ 플라즈마 활성화</h3>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⚡</div>
            <div className="font-mono text-xl font-bold text-purple-800">e⁻ + SiH₄ → SiH₃• + H•</div>
            <div className="text-sm text-gray-600 mt-2">200-400°C (저온)</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded text-center">
              <div className="font-bold text-blue-600">RF 파워</div>
              <div>13.56 MHz</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-bold text-purple-600">플라즈마</div>
              <div>전자 충돌</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-bold text-green-600">라디칼</div>
              <div>고반응성</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-2">📊 주요 특성</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-medium">온도</div>
              <div className="text-green-600">저온</div>
            </div>
            <div>
              <div className="font-medium">증착속도</div>
              <div className="text-green-600">빠름</div>
            </div>
            <div>
              <div className="font-medium">Step Coverage</div>
              <div className="text-orange-600">보통</div>
            </div>
            <div>
              <div className="font-medium">막질</div>
              <div className="text-blue-600">우수</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">⚖️ Thermal CVD와 비교</h4>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-green-600">PECVD 장점:</span>
              <ul className="ml-4 list-disc text-xs">
                <li>저온 공정 (열 손상 방지)</li>
                <li>빠른 증착속도</li>
                <li>이온 충격으로 막질 개선</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-red-600">PECVD 단점:</span>
              <ul className="ml-4 list-disc text-xs">
                <li>복잡한 시스템</li>
                <li>플라즈마 손상 가능성</li>
                <li>수소 혼입</li>
              </ul>
            </div>
          </div>
        </div>
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🔄 ALD 4단계 사이클</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-100 rounded">
            <span className="font-bold text-blue-600 mr-3">1️⃣</span>
            <div>
              <div className="font-medium">전구체 A 주입</div>
              <div className="text-xs">TMA (Al(CH₃)₃) → 표면 -OH와 반응</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-100 rounded">
            <span className="font-bold text-gray-600 mr-3">2️⃣</span>
            <div>
              <div className="font-medium">퍼지 (Purge)</div>
              <div className="text-xs">N₂ 가스로 잔여 TMA와 부산물 제거</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-red-100 rounded">
            <span className="font-bold text-red-600 mr-3">3️⃣</span>
            <div>
              <div className="font-medium">전구체 B 주입</div>
              <div className="text-xs">H₂O → Al-CH₃와 반응하여 Al₂O₃ 형성</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-100 rounded">
            <span className="font-bold text-gray-600 mr-3">4️⃣</span>
            <div>
              <div className="font-medium">퍼지 (Purge)</div>
              <div className="text-xs">N₂ 가스로 H₂O와 CH₄ 부산물 제거</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">🎯 자기제한적 특성</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 포화 흡착: 표면 사이트 완전 채워짐</li>
            <li>• 정밀 제어: 1 사이클 = 1 원자층</li>
            <li>• 재현성: 매번 동일한 두께</li>
            <li>• 균일성: 복잡한 3D 구조도 균일</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">📊 성능 비교</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-medium">Step Coverage</div>
              <div className="text-green-600">거의 완벽</div>
            </div>
            <div>
              <div className="font-medium">막두께 제어</div>
              <div className="text-green-600">Ångström 단위</div>
            </div>
            <div>
              <div className="font-medium">균일도</div>
              <div className="text-green-600">±1% 이내</div>
            </div>
            <div>
              <div className="font-medium">증착속도</div>
              <div className="text-red-600">느림</div>
            </div>
          </div>
        </div>
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

      {!showResults ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                문제 {currentQuestion + 1} / {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-amber-600">
                점수: {score} / {quizQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">
              {quizQuestions[currentQuestion]?.question}
            </h4>

            <div className="space-y-3">
              {quizQuestions[currentQuestion]?.options?.map((option, index) => (
                <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={index.toString()}
                    checked={selectedAnswer === index.toString()}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion < quizQuestions.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h4 className="text-2xl font-bold mb-4">퀴즈 완료!</h4>
          <div className="text-4xl font-bold text-amber-600 mb-4">
            {score} / {quizQuestions.length}
          </div>
          <div className="text-lg mb-6">
            정답률: {((score / quizQuestions.length) * 100).toFixed(0)}%
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-left">
            <h5 className="font-semibold mb-2 text-center">📚 학습 요약</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🔥 <strong>PVD 증발:</strong> 열에너지로 상변화, 직선 비행</li>
              <li>🎯 <strong>PVD 스퍼터링:</strong> 운동량 전달로 원자 방출</li>
              <li>🌡️ <strong>Thermal CVD:</strong> 순수 열에너지로 화학분해</li>
              <li>⚡ <strong>PECVD:</strong> 플라즈마 에너지로 저온 반응</li>
              <li>⚛️ <strong>ALD:</strong> 자기제한적 반응으로 원자층 제어</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer('');
              setScore(0);
              setShowResults(false);
            }}
            className="bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700"
          >
            다시 도전하기
          </button>
        </div>
      )}
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
