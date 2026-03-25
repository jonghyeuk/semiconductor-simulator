import React, { useState, useEffect } from 'react';
import SputteringSimulator from './SputteringSimulator';
import EvaporatorSimulator from './EvaporatorSimulator';
import ALDSimulator from './ALDSimulator';
import PECVDSimulator from './PECVDSimulator';
import LPCVDSimulator from './LPCVDSimulator';

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

const DepositionSimulator = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'theory');
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
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg">
        <h1 className="text-xl font-bold text-white">진공 증착 장치 시뮬레이터 (Evaporator)</h1>
        <p className="text-blue-200 text-sm">E-beam 또는 Thermal 방식으로 소스 물질 증발 → 기판에 박막 증착</p>
      </div>

      {/* 3D Simulator */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ height: '600px' }}>
        <EvaporatorSimulator />
      </div>

      {/* Experiment Guide */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2">
          진공 증착 장치 (Evaporator) 실험 지침서
        </h2>

        {/* Two mode comparison */}
        <div className="mb-8 bg-gray-800 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">두 가지 증착 모드</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cyan-900/30 p-4 rounded-lg border border-cyan-500">
              <h4 className="text-lg font-bold text-cyan-300 mb-2">E-beam Evaporator</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 전자빔으로 타겟 <span className="text-red-400">국부 가열</span></li>
                <li>• 270° 자기장 편향 (Gun 보호)</li>
                <li>• <span className="text-cyan-400">고융점 금속</span> 증착 가능 (W, Ta, Mo)</li>
                <li>• 고순도 박막 (도가니 오염 최소)</li>
                <li>• X-ray 발생 주의</li>
              </ul>
            </div>

            <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-500">
              <h4 className="text-lg font-bold text-orange-300 mb-2">Thermal Evaporator</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• DC 전류로 보트 <span className="text-orange-400">저항 가열</span></li>
                <li>• 간단한 구조, 경제적</li>
                <li>• <span className="text-orange-400">저융점 금속</span> (Al, Au, Ag, Cu)</li>
                <li>• 유기물 증착 (OLED)</li>
                <li>• 보트 수명 제한</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step-by-step guide */}
        <div className="mb-8 bg-blue-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-blue-300 mb-4">시뮬레이터 따라하기</h3>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500">
              <div className="flex items-start gap-3">
                <span className="bg-indigo-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 0</span>
                <div>
                  <div className="font-bold text-indigo-300 text-lg">모드 선택</div>
                  <p className="text-gray-300 mt-1">E-beam 또는 Thermal 모드 선택 (왼쪽: E-beam 도가니, 오른쪽: Thermal 보트)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm">Step 1</span>
                <div>
                  <div className="font-bold text-yellow-300 text-lg">전원 ON</div>
                  <p className="text-gray-300 mt-1">
                    E-beam: 노란색 전자들이 곡선으로 이동<br/>
                    Thermal: 보트가 빨갛게 가열되며 원자 색상 변화
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-start gap-3">
                <span className="bg-orange-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 2</span>
                <div>
                  <div className="font-bold text-orange-300 text-lg">가열 대기</div>
                  <p className="text-gray-300 mt-1">소스가 충분히 가열될 때까지 대기 (2~3초)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 3</span>
                <div>
                  <div className="font-bold text-blue-300 text-lg">증착 관찰</div>
                  <p className="text-gray-300 mt-1">
                    원자가 기판(위쪽 큰 웨이퍼)에 랜덤하게 증착되는 과정 관찰
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-start gap-3">
                <span className="bg-purple-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 4</span>
                <div>
                  <div className="font-bold text-purple-300 text-lg">박막 단면 관찰</div>
                  <p className="text-gray-300 mt-1">버튼 클릭 → Columnar 구조와 Void 관찰</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* E-beam principle */}
        <div className="mb-8 bg-indigo-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-300 mb-4">E-beam 증착의 원리</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-yellow-300 mb-2">1. 전자빔 생성</h4>
              <p className="text-gray-300 text-sm">
                텅스텐 필라멘트에서 <span className="text-yellow-400">열전자 방출</span>로 전자 생성.
                고전압(5~10kV)으로 전자를 가속시킴.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-cyan-300 mb-2">2. 자기장 편향</h4>
              <p className="text-gray-300 text-sm">
                <span className="text-cyan-400">270° 자기장 편향</span>으로 전자빔을 휘어서 타겟에 조사.
                E-gun이 증발물로 오염되는 것을 방지.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-red-300 mb-2">3. 국부 가열</h4>
              <p className="text-gray-300 text-sm">
                전자 운동에너지 → 열에너지 변환. 타겟 표면이
                <span className="text-red-400"> 수천 °C</span>까지 국부 가열되어 증발.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-blue-300 mb-2">4. Line-of-Sight 증착</h4>
              <p className="text-gray-300 text-sm">
                증발된 원자가 <span className="text-blue-400">직선으로</span> 이동하여 기판에 도달.
                고진공(10^-6 Torr 이하)에서 Mean Free Path 확보.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-green-300 mb-2">주요 공정 파라미터</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-green-400 font-bold">전자빔 전류</div>
                <div className="text-gray-400">50~500 mA</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-green-400 font-bold">가속 전압</div>
                <div className="text-gray-400">5~10 kV</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-green-400 font-bold">진공도</div>
                <div className="text-gray-400">10^-6~10^-7 Torr</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-green-400 font-bold">증착률</div>
                <div className="text-gray-400">1~100 A/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Thermal Evaporator principle */}
        <div className="mb-8 bg-orange-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-orange-300 mb-4">Thermal Evaporator 원리</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-orange-300 mb-2">1. 저항 가열</h4>
              <p className="text-gray-300 text-sm">
                텅스텐, 몰리브덴 또는 탄탈럼 보트에 <span className="text-orange-400">DC 전류</span>를 흘려
                줄 열(Joule Heating)로 가열. P = I^2R
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-yellow-300 mb-2">2. 소스 증발</h4>
              <p className="text-gray-300 text-sm">
                보트 위의 소스 물질이 가열되어 <span className="text-yellow-400">증기압</span>에 도달하면 증발.
                저융점 금속(Al, Au, Ag)에 적합.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-green-300 mb-2">3. 장점</h4>
              <p className="text-gray-300 text-sm">
                구조 간단, 저비용, 유지보수 용이.
                <span className="text-green-400"> 유기물 증착</span>(OLED)에 널리 사용.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-red-300 mb-2">4. 단점</h4>
              <p className="text-gray-300 text-sm">
                보트 수명 제한, <span className="text-red-400">고융점 금속 불가</span>,
                보트-소스 반응 가능성, 온도 제어 어려움.
              </p>
            </div>
          </div>
        </div>

        {/* Safety notes */}
        <div className="mb-8 bg-yellow-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-300 mb-4">장비 운용 시 유의사항</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="text-lg font-bold text-red-300 mb-2">안전 주의</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 고전압(~10kV) 감전 위험</li>
                <li>• E-beam: X-ray 발생 → 차폐 필수</li>
                <li>• 고온 부품 화상 주의</li>
                <li>• 진공 파손 시 내파 위험</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="text-lg font-bold text-yellow-300 mb-2">공정 전 체크</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Base pressure 확인 (10^-6 Torr)</li>
                <li>• 소스 물질 충분량 확인</li>
                <li>• 셔터 동작 테스트</li>
                <li>• 기판 온도 안정화</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="text-lg font-bold text-blue-300 mb-2">품질 관리</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• QCM으로 실시간 두께 모니터링</li>
                <li>• 증착률 일정하게 유지</li>
                <li>• 기판 회전으로 균일도 확보</li>
                <li>• 정기적 도가니/보트 교체</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Columnar structure problem */}
        <div className="mb-8 bg-red-900/30 p-5 rounded-lg border-2 border-red-500">
          <h3 className="text-xl font-bold text-red-300 mb-4">Columnar Structure + Void 문제 (핵심!)</h3>

          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-bold text-yellow-300 mb-3">왜 Columnar 구조가 생기나?</h4>
            <p className="text-gray-300 mb-3">
              Evaporation은 <span className="text-blue-400 font-bold">Line-of-Sight 증착</span>이므로,
              원자가 직선으로 날아와 먼저 쌓인 원자 뒤에 <span className="text-red-400 font-bold">그림자(Shadow)</span>가 생김.
              이로 인해 세로 기둥(Column)이 형성되고, 기둥 사이에 빈 공간(Void)이 발생.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-900/50 p-3 rounded border border-red-500">
              <span className="text-red-300 font-bold">전기적 문제</span>
              <p className="text-gray-300 mt-1">저항 증가, Electromigration 취약</p>
            </div>
            <div className="bg-red-900/50 p-3 rounded border border-red-500">
              <span className="text-red-300 font-bold">기계적 문제</span>
              <p className="text-gray-300 mt-1">인장 응력, 크랙, 박리</p>
            </div>
            <div className="bg-red-900/50 p-3 rounded border border-red-500">
              <span className="text-red-300 font-bold">화학적 문제</span>
              <p className="text-gray-300 mt-1">Void로 수분/산소 침투</p>
            </div>
            <div className="bg-red-900/50 p-3 rounded border border-red-500">
              <span className="text-red-300 font-bold">Step Coverage</span>
              <p className="text-gray-300 mt-1">측벽 코팅 불량, 단선 위험</p>
            </div>
          </div>
        </div>

        {/* Suitable applications */}
        <div className="bg-green-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-green-300 mb-4">Evaporator 적합 분야</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">🔬</div>
              <div className="text-green-400 font-bold">R&D / 연구</div>
              <p className="text-gray-400 text-xs mt-1">빠른 재료 평가</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">🔭</div>
              <div className="text-green-400 font-bold">광학 코팅</div>
              <p className="text-gray-400 text-xs mt-1">렌즈, 거울, AR</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">📺</div>
              <div className="text-green-400 font-bold">OLED</div>
              <p className="text-gray-400 text-xs mt-1">유기물 증착</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-green-400 font-bold">고순도 금속</div>
              <p className="text-gray-400 text-xs mt-1">Au, Ag, Al</p>
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
          🎯 PVD (Sputtering) - 마그네트론 스퍼터링
        </h2>
        <p className="text-gray-700 text-lg">
          고에너지 Ar⁺ 이온으로 타겟을 충돌시켜 원자를 물리적으로 방출(스퍼터)시켜 웨이퍼에 증착시키는 방법입니다.
          마그네트론을 사용하여 플라즈마 밀도를 높이고 타겟 근처에 전자를 가두어 효율을 극대화합니다.
        </p>
      </div>

      {/* 3D 시뮬레이터 */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ height: '800px' }}>
        <SputteringSimulator />
      </div>

      {/* 한글 실습 가이드 */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
          <span className="mr-3">🧪</span>
          실습 가이드
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-start">
              <span className="text-2xl mr-3">1️⃣</span>
              <div>
                <h4 className="font-bold text-green-700 mb-1">플라즈마 켜기</h4>
                <p className="text-gray-700">
                  <strong>POWER 버튼</strong>을 눌러서 플라즈마를 켜보세요.
                  주황색 플라즈마 영역과 파란색(전자), 주황색(Ar⁺ 이온), 회색(Ar 중성) 입자들이 나타납니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start">
              <span className="text-2xl mr-3">2️⃣</span>
              <div>
                <h4 className="font-bold text-blue-700 mb-1">이온 에너지 조절</h4>
                <p className="text-gray-700">
                  <strong>⚡ Ion Energy 슬라이더</strong>를 조절하여 Ar⁺ 이온의 충돌 에너지를 변경해보세요.
                  에너지가 높을수록 이온 속도가 빨라지고 스퍼터링 수율(yield)이 증가합니다.
                  타겟에서 더 많은 파란색 원자들이 튀어나오는 것을 관찰하세요.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-start">
              <span className="text-2xl mr-3">3️⃣</span>
              <div>
                <h4 className="font-bold text-purple-700 mb-1">자기장 세기 조절</h4>
                <p className="text-gray-700">
                  <strong>🧲 B-Field 슬라이더</strong>를 조절하여 자기장 세기를 변경해보세요.
                  자기장이 강할수록 전자가 타겟 근처에 더 오래 갇혀서 플라즈마 밀도가 증가하고,
                  더 많은 Ar⁺ 이온이 생성됩니다. 하늘색 자기장 라인의 밝기 변화를 확인하세요.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-start">
              <span className="text-2xl mr-3">4️⃣</span>
              <div>
                <h4 className="font-bold text-orange-700 mb-1">카메라 각도 변경</h4>
                <p className="text-gray-700">
                  <strong>Substrate / Bottom↑ / Top↓ 버튼</strong>으로 카메라 모드를 전환해보세요.
                  <br />
                  • <strong>Substrate</strong>: 웨이퍼를 측면에서 관찰
                  <br />
                  • <strong>Bottom↑</strong>: 웨이퍼 아래에서 위를 올려다봄 (타겟의 erosion track 관찰에 최적)
                  <br />
                  • <strong>Top↓</strong>: 타겟 위에서 아래를 내려다봄
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
            <div className="flex items-start">
              <span className="text-2xl mr-3">5️⃣</span>
              <div>
                <h4 className="font-bold text-red-700 mb-1">Erosion Track (링 패턴) 관찰</h4>
                <p className="text-gray-700">
                  <strong>Bottom↑ 뷰</strong>로 전환한 후, 타겟이 깎이는 모습을 관찰해보세요.
                  8개의 S극(파란 자석)이 만드는 원 모양을 따라 도넛/링 형태로 타겟이 집중적으로 깎입니다.
                  이것이 마그네트론 스퍼터링의 특징적인 <strong>racetrack erosion</strong> 패턴입니다.
                  타겟 원자가 한 층 완전히 깎이면 자동으로 새 층이 위에 생성됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-start">
              <span className="text-2xl mr-3">6️⃣</span>
              <div>
                <h4 className="font-bold text-yellow-700 mb-1">최대 파라미터 실험</h4>
                <p className="text-gray-700">
                  <strong>Ion Energy</strong>와 <strong>B-Field</strong>를 모두 <strong>최대(100%)</strong>로 올려보세요!
                  매우 집중적이고 빠른 스퍼터링이 일어나며, 웨이퍼에 증착되는 원자(Deposited) 개수가 빠르게 증가하는 것을 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500">
            <div className="flex items-start">
              <span className="text-2xl mr-3">7️⃣</span>
              <div>
                <h4 className="font-bold text-indigo-700 mb-1">줌 및 회전 조절</h4>
                <p className="text-gray-700">
                  <strong>마우스 휠</strong>로 줌 인/아웃하거나 <strong>➕/➖ 버튼</strong>을 사용하세요.
                  <strong>🔄 Rotate / ⏸️ Fixed 버튼</strong>으로 자동 회전을 켜거나 끌 수 있습니다.
                  고정 모드에서 특정 각도를 자세히 관찰해보세요.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border-2 border-green-400">
            <div className="flex items-start">
              <span className="text-3xl mr-3">💡</span>
              <div>
                <h4 className="font-bold text-green-800 mb-2">핵심 관찰 포인트</h4>
                <ul className="text-gray-800 space-y-1 text-sm">
                  <li>• <strong>N극(빨강, 중앙)</strong>과 <strong>S극(진한 파랑, 8개 원형 배치)</strong>가 만드는 폐쇄 자기장</li>
                  <li>• <strong>Ar⁺ 이온(주황색 구)</strong>이 타겟 표면에 충돌하는 순간</li>
                  <li>• <strong>스퍼터된 타겟 원자(파란 구)</strong>가 중력으로 웨이퍼에 낙하</li>
                  <li>• <strong>웨이퍼 표면</strong>에 작은 파란 점들이 쌓여서 막이 형성되는 과정</li>
                  <li>• <strong>Erosion track</strong>: S극 원을 따라 도넛 형태로 타겟이 집중 깎임</li>
                  <li>• 파라미터 변화에 따른 증착 속도(Deposited 카운트) 차이</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이론 요약 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🔄 스퍼터링 메커니즘</h4>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1️⃣ 이온화: Ar → Ar⁺ + e⁻ (플라즈마)</li>
            <li>2️⃣ 가속: 전기장에서 Ar⁺ 이온 가속</li>
            <li>3️⃣ 충돌: 타겟 표면에 운동량 전달</li>
            <li>4️⃣ 방출: 타겟 원자 기체상 방출 (스퍼터)</li>
            <li>5️⃣ 수송: 진공 챔버 내 직선/확산 이동</li>
            <li>6️⃣ 증착: 웨이퍼 표면 응축 및 막 형성</li>
          </ol>
        </div>

        <div className="bg-cyan-50 p-4 rounded-lg">
          <h4 className="font-semibold text-cyan-800 mb-2">🧲 마그네트론의 역할</h4>
          <div className="text-sm space-y-2 text-gray-700">
            <p>
              <strong>N극(중앙)</strong>과 <strong>S극(링)</strong>이 만드는 자기장이
              전자를 타겟 근처에 가두어 플라즈마 밀도를 10~100배 증가시킵니다.
            </p>
            <p className="text-xs space-y-1">
              <div>✓ 전자가 나선 운동으로 타겟 근처에 머무름</div>
              <div>✓ Ar 중성 원자와 충돌 확률 증가</div>
              <div>✓ 더 많은 Ar⁺ 이온 생성</div>
              <div>✓ 스퍼터링 효율 대폭 증가</div>
              <div>✓ S극 원을 따라 erosion track 형성</div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThermalCVDTab = () => (
    <div className="w-full">
      <LPCVDSimulator />
    </div>
  );

  const renderPECVDTab = () => (
    <div className="w-full">
      <PECVDSimulator />
    </div>
  );

  const renderALDTab = () => (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 rounded-lg">
        <h1 className="text-xl font-bold text-white">ALD (Atomic Layer Deposition) 시뮬레이터</h1>
        <p className="text-purple-200 text-sm">자기제한적 표면반응을 통한 원자층 단위 정밀 증착</p>
      </div>

      {/* 3D Simulator */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ height: '550px' }}>
        <ALDSimulator />
      </div>

      {/* Experiment Guide */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-purple-500 pb-2">
          ALD 시뮬레이터 관전 포인트 및 실험 가이드
        </h2>

        {/* Key Observation Points */}
        <div className="mb-8 bg-purple-900/40 p-5 rounded-lg border-2 border-purple-500">
          <h3 className="text-xl font-bold text-purple-300 mb-4">핵심 관전 포인트</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="text-blue-300 font-bold mb-2">1. 자기제한적 흡착 (Self-Limiting)</h4>
              <p className="text-gray-300 text-sm">
                <span className="text-blue-400 font-bold">파란색 분자(Source A)</span>가 웨이퍼에 떨어질 때,
                <span className="text-yellow-400"> 빈 자리(초록점)</span>에만 흡착되는 것을 관찰하세요.
                이미 차 있는 자리에 떨어진 분자는 <span className="text-red-400">표면을 따라 흘러나감</span>니다.
                이것이 ALD의 핵심 - <span className="text-cyan-400 font-bold">"더 이상 붙을 곳이 없으면 멈춘다"</span>
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="text-red-300 font-bold mb-2">2. 선택적 반응</h4>
              <p className="text-gray-300 text-sm">
                <span className="text-red-400 font-bold">빨간색 분자(Reactant B)</span>는
                <span className="text-blue-400"> 파란색 분자가 있는 자리</span>에서만 반응합니다.
                빈 웨이퍼 표면에 떨어지면 반응하지 않고 흘러나갑니다.
                이것이 <span className="text-cyan-400 font-bold">"화학적 선택성"</span>입니다.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-500">
              <h4 className="text-gray-300 font-bold mb-2">3. 퍼지(Purge)의 역할</h4>
              <p className="text-gray-300 text-sm">
                <span className="text-gray-400 font-bold">회색 가스(N2)</span>가 웨이퍼 위를 쓸면서
                <span className="text-yellow-400"> 반응하지 못한 잔여 분자들을 제거</span>합니다.
                이 과정이 없으면 다음 단계에서 <span className="text-red-400">기체상 반응(CVD처럼)</span>이 일어납니다.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-cyan-500">
              <h4 className="text-cyan-300 font-bold mb-2">4. 층간 누적</h4>
              <p className="text-gray-300 text-sm">
                사이클이 반복될 때마다 <span className="text-cyan-400 font-bold">파란-빨간 층이 쌓이는</span> 것을 관찰하세요.
                각 사이클은 정확히 <span className="text-green-400">~0.1nm</span>씩 두께가 증가합니다.
                10사이클 = 1nm, 100사이클 = 10nm!
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-step Guide */}
        <div className="mb-8 bg-blue-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-blue-300 mb-4">시뮬레이터 따라하기</h3>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 0</span>
                <div>
                  <div className="font-bold text-green-300 text-lg">Start 버튼 클릭</div>
                  <p className="text-gray-300 mt-1">시뮬레이션이 자동으로 4단계 사이클을 반복합니다.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 1</span>
                <div>
                  <div className="font-bold text-blue-300 text-lg">Source A 주입 (파란색)</div>
                  <p className="text-gray-300 mt-1">
                    TMA (트리메틸알루미늄) 분자가 위에서 떨어집니다.<br/>
                    <span className="text-yellow-400">관찰:</span> 웨이퍼의 -OH 표면과 반응하여 흡착.
                    흡착된 분자는 <span className="text-blue-400">파란색</span>으로 고정됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-500">
              <div className="flex items-start gap-3">
                <span className="bg-gray-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 2</span>
                <div>
                  <div className="font-bold text-gray-300 text-lg">Purge (회색)</div>
                  <p className="text-gray-300 mt-1">
                    N2 가스로 챔버를 청소합니다.<br/>
                    <span className="text-yellow-400">관찰:</span> 흡착되지 못한 TMA와 반응 부산물(CH4)이
                    <span className="text-gray-400"> 웨이퍼 가장자리로 쓸려나갑니다.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 3</span>
                <div>
                  <div className="font-bold text-red-300 text-lg">Reactant B 주입 (빨간색)</div>
                  <p className="text-gray-300 mt-1">
                    H2O (물) 분자가 위에서 떨어집니다.<br/>
                    <span className="text-yellow-400">관찰:</span> TMA의 -CH3 그룹과 반응하여 Al-O 결합 형성.
                    <span className="text-red-400"> 빨간색</span> 분자가 파란색 위에 쌓입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-500">
              <div className="flex items-start gap-3">
                <span className="bg-gray-500 text-white font-bold px-3 py-1 rounded-full text-sm">Step 4</span>
                <div>
                  <div className="font-bold text-gray-300 text-lg">Purge (회색)</div>
                  <p className="text-gray-300 mt-1">
                    다시 N2 가스로 청소합니다.<br/>
                    <span className="text-yellow-400">관찰:</span> 미반응 H2O와 부산물(CH4)이 제거됩니다.
                    1 사이클 완료! 표면에 <span className="text-cyan-400">~0.1nm Al2O3</span> 형성.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why ALD is Special */}
        <div className="mb-8 bg-cyan-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-cyan-300 mb-4">왜 ALD가 특별한가?</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-green-300 mb-2">CVD와의 차이점</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-red-400">CVD:</span>
                  <span>두 가스가 <span className="text-red-400">동시에</span> 들어감 → 기체상에서 반응 → 불균일</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">ALD:</span>
                  <span>두 가스가 <span className="text-green-400">번갈아</span> 들어감 → 표면에서만 반응 → 균일</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-yellow-300 mb-2">Self-Limiting의 의미</h4>
              <p className="text-gray-300 text-sm">
                시간을 더 오래 줘도, 가스를 더 많이 줘도,
                <span className="text-yellow-400 font-bold"> "딱 1층만"</span> 쌓입니다.
                표면의 반응 사이트가 모두 채워지면 더 이상 반응이 일어나지 않기 때문입니다.
                이것이 <span className="text-cyan-400">원자층 단위 제어</span>의 비밀입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Chemical Reaction */}
        <div className="mb-8 bg-indigo-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-300 mb-4">Al2O3 ALD 화학 반응</h3>

          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
            <div className="mb-4">
              <div className="text-blue-400 mb-1">Step 1: TMA 흡착</div>
              <div className="text-gray-300">Surface-OH + Al(CH3)3 → Surface-O-Al(CH3)2 + CH4 </div>
            </div>
            <div>
              <div className="text-red-400 mb-1">Step 3: H2O 반응</div>
              <div className="text-gray-300">Surface-O-Al(CH3)2 + H2O → Surface-O-Al-OH + CH4 </div>
            </div>
          </div>

          <div className="mt-4 text-gray-400 text-sm">
            결과: 2Al(CH3)3 + 3H2O → Al2O3 + 6CH4
            <br/>
            <span className="text-cyan-400">Growth Per Cycle (GPC): ~0.1 nm/cycle @ 200-300°C</span>
          </div>
        </div>

        {/* Applications */}
        <div className="mb-8 bg-green-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-green-300 mb-4">ALD 적용 분야</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">🔌</div>
              <div className="text-green-400 font-bold">High-k Gate</div>
              <p className="text-gray-400 text-xs mt-1">HfO2, ZrO2</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">🔋</div>
              <div className="text-green-400 font-bold">배터리</div>
              <p className="text-gray-400 text-xs mt-1">보호막 코팅</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">💡</div>
              <div className="text-green-400 font-bold">LED/OLED</div>
              <p className="text-gray-400 text-xs mt-1">패시베이션</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-3xl mb-2">🏔️</div>
              <div className="text-green-400 font-bold">3D NAND</div>
              <p className="text-gray-400 text-xs mt-1">초고 종횡비</p>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-yellow-900/30 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-300 mb-4">ALD 성능 요약</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-yellow-400 font-bold mb-1">Step Coverage</div>
              <div className="text-green-400 text-lg font-bold">~100%</div>
              <p className="text-gray-500 text-xs">어떤 구조도 균일</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-yellow-400 font-bold mb-1">두께 제어</div>
              <div className="text-green-400 text-lg font-bold">0.1nm</div>
              <p className="text-gray-500 text-xs">원자층 단위</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-yellow-400 font-bold mb-1">균일도</div>
              <div className="text-green-400 text-lg font-bold">+/-1%</div>
              <p className="text-gray-500 text-xs">300mm 웨이퍼</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-yellow-400 font-bold mb-1">증착 속도</div>
              <div className="text-red-400 text-lg font-bold">느림</div>
              <p className="text-gray-500 text-xs">~1nm/min</p>
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
