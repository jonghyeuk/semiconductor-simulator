import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Icon components
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
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
  </svg>
);

const VacuumSimulator = ({ initialTab }) => {
  // 탭 상태
  const [activeTab, setActiveTab] = useState(initialTab || 'theory');
  const [selectedModel, setSelectedModel] = useState(2); // 모델 2가 기본값
  const [targetPressure, setTargetPressure] = useState(5); // 목표 압력 (슬라이더로 설정)

  // Theory tab state
  const [theoryStep, setTheoryStep] = useState(0);
  const [isTheoryPlaying, setIsTheoryPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showDetailedTheory, setShowDetailedTheory] = useState(false);
  
  // 기존 상태들
  const [pumpingSpeed, setPumpingSpeed] = useState(1800);
  const [gasFlowRate, setGasFlowRate] = useState(10);
  const [fixedPressure, setFixedPressure] = useState(5e-5);
  const [gateValveOpening, setGateValveOpening] = useState(100);
  const [chamberVolume, setChamberVolume] = useState(100);
  
  // 새로운 TMP 시뮬레이션 상태들
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationPressure, setAnimationPressure] = useState(760);
  const [animationSpeed, setAnimationSpeed] = useState(250);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [apcValveOpen, setApcValveOpen] = useState(false);
  const [forelineValveOpen, setForelineValveOpen] = useState(false);
  const [roughingValveOpen, setRoughingValveOpen] = useState(false);
  const [turboSpeed, setTurboSpeed] = useState(0);
  const [forelinePressure, setForelinePressure] = useState(760);
  const [currentPhase, setCurrentPhase] = useState('준비');
  const [turboStartTime, setTurboStartTime] = useState(null);
  const [valveSwitchTime, setValveSwitchTime] = useState(null);

  // 수동 모드 상태들
  const [isManualMode, setIsManualMode] = useState(false);
  const [tmpOn, setTmpOn] = useState(false);
  const [manualStep, setManualStep] = useState(0);
  const [logMessages, setLogMessages] = useState([]);
  const [stepCompleted, setStepCompleted] = useState([false, false, false, false, false, false]);
  const prevPressureRef = React.useRef(760);
  
  // 새 탭용 상태들
  const [gasLoad, setGasLoad] = useState(7.5); // Q (Torr·L/s) - mbar에서 변환
  const [systemPumpingSpeed, setSystemPumpingSpeed] = useState(500); // S (L/s)
  const [resultPressure, setResultPressure] = useState(0.015); // P (Torr) - mbar에서 변환
  
  // 배관 설계 상태들
  const [pipeLength, setPipeLength] = useState(100); // cm
  const [pipeDiameter, setPipeDiameter] = useState(10); // cm
  const [pipeType, setPipeType] = useState('straight'); // straight, elbow, spiral
  const [calculatedConductance, setCalculatedConductance] = useState(1000); // L/s
  const [effectivePumpingSpeed, setEffectivePumpingSpeed] = useState(400); // L/s
  
  // 퀴즈 상태들
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // 트러블슈팅 상태들
  const [troubleScenario, setTroubleScenario] = useState(1);
  const [troubleStarted, setTroubleStarted] = useState(false);
  const [troubleTriggered, setTroubleTriggered] = useState(false);
  const [troubleLogMessages, setTroubleLogMessages] = useState([]);
  const [troubleElapsedTime, setTroubleElapsedTime] = useState(0);
  const [troublePressure, setTroublePressure] = useState(1e-5);
  const [troubleTurboSpeed, setTroubleTurboSpeed] = useState(300);
  const [troubleApcOpen, setTroubleApcOpen] = useState(true);
  const [troubleFvOpen, setTroubleFvOpen] = useState(true);
  const [troubleRvOpen, setTroubleRvOpen] = useState(false);
  const [troubleTmpOn, setTroubleTmpOn] = useState(true);
  const [troubleSuccess, setTroubleSuccess] = useState(false);
  const [troubleFailed, setTroubleFailed] = useState(false);
  const [tmpTemperature, setTmpTemperature] = useState(55);
  const [dryPumpCurrent, setDryPumpCurrent] = useState(15);
  const [dryPumpExhaust, setDryPumpExhaust] = useState(100);
  const [dryPumpOn, setDryPumpOn] = useState(true);
  const [scenario2Step, setScenario2Step] = useState(0);
  const [gasLineN2, setGasLineN2] = useState(true);
  const [gasLineAr, setGasLineAr] = useState(true);
  const [gasLineO2, setGasLineO2] = useState(true);
  const [gasLineMain, setGasLineMain] = useState(true);
  const [leakSource, setLeakSource] = useState('Ar');
  const [troubleSituationText, setTroubleSituationText] = useState('');
  const [rfOn, setRfOn] = useState(true);
  const [rfPower, setRfPower] = useState(300);
  const [matcherTemp, setMatcherTemp] = useState(45);
  const [sih4Flow, setSih4Flow] = useState(100);
  const [nh3Flow, setNh3Flow] = useState(200);
  const [n2Flow, setN2Flow] = useState(500);
  const [gasSupplyMain, setGasSupplyMain] = useState(true);
  const [sih4Valve, setSih4Valve] = useState(true);
  const [rfBreaker, setRfBreaker] = useState(true);
  const [matcherSmoke, setMatcherSmoke] = useState(0);
  const [scenario4Step, setScenario4Step] = useState(0);
  const [evacuating, setEvacuating] = useState(false);
  const [scenario4Warnings, setScenario4Warnings] = useState([]);
  const [scenario4VacuumTouched, setScenario4VacuumTouched] = useState(false);
  const [scenario5Phase, setScenario5Phase] = useState('roughing');
  const [scenario5FaultLocation, setScenario5FaultLocation] = useState('bellows');
  const [scenario5Checked, setScenario5Checked] = useState({ bellows: false, oring: false, clamp: false, fvSeal: false });
  const [scenario5Found, setScenario5Found] = useState(false);
  const [troubleForelinePressure, setTroubleForelinePressure] = useState(0.01);
  const [scenario5BackflowWarning, setScenario5BackflowWarning] = useState(false);
  const [situationIndex, setSituationIndex] = useState(0);
  const [showSituation, setShowSituation] = useState(false);

  // 탭 정의
  const tabs = [
    { id: 'theory', name: '이론', icon: '🎬' },
    { id: 'pumping-simulation', name: '실시간 펌핑 시뮬레이션', icon: '⚡' },
    { id: 'performance-analysis', name: '성능 특성 곡선 분석', icon: '📊' },
    { id: 'process-control', name: '공정 압력 세팅 실험', icon: '🔧' },
    { id: 'conductance-relation', name: 'Conductance & 압력 관계', icon: '🔄' },
    { id: 'pipe-design', name: '배관 설계 최적화', icon: '🏗️' },
    { id: 'troubleshooting', name: '트러블슈팅', icon: '🔧' },
    { id: 'quiz', name: '진공 기술 퀴즈', icon: '🎯' }
  ];
  
  // 퀴즈 문제 데이터
  const quizQuestions = [
    {
      id: 1,
      category: "펌핑 시뮬레이션",
      question: "진공 펌핑 과정에서 760 Torr에서 1 Torr까지 도달하는 구간을 무엇이라고 하는가?",
      options: [
        "초기 배기 단계",
        "중진공 형성 단계", 
        "고진공 도달 단계",
        "포화점 접근 단계"
      ],
      correct: 0,
      explanation: "760 Torr(대기압)에서 1 Torr까지는 빠른 압력 감소가 일어나는 초기 배기 단계입니다."
    },
    {
      id: 2,
      category: "펌핑 시뮬레이션",
      question: "100L 챔버에서 20 mTorr 포화점에 도달하는데 시간이 오래 걸리는 주된 이유는?",
      options: [
        "챔버 벽면에서의 가스 방출",
        "펌프의 기계적 마모",
        "전력 공급 불안정",
        "온도 변화"
      ],
      correct: 0,
      explanation: "진공이 깊어질수록 챔버 벽면에서 흡착되었던 가스들이 서서히 방출되어 포화점을 형성합니다."
    },
    {
      id: 3,
      category: "성능 분석",
      question: "펌프 성능 특성 곡선에서 5 Torr 근처에서 최대 배기속도를 보이는 이유는?",
      options: [
        "이 압력에서 펌프 효율이 최적화됨",
        "가스 분자의 평균 자유 행정이 최적값을 가짐",
        "펌프 내부 온도가 안정화됨",
        "전기적 소비 전력이 최소화됨"
      ],
      correct: 1,
      explanation: "중진공 영역에서 가스 분자의 평균 자유 행정이 펌프 구조에 최적화되어 최대 성능을 발휘합니다."
    },
    {
      id: 4,
      category: "성능 분석",
      question: "1000L 챔버에 모델 2(중형) 펌프 사용 시 760→1 Torr 도달시간이 20분을 초과한다면?",
      options: [
        "정상 범위이므로 그대로 사용",
        "더 큰 용량의 펌프로 교체 필요",
        "펌프를 2대 병렬 연결",
        "챔버 체적을 줄임"
      ],
      correct: 1,
      explanation: "20분 초과는 펌프 용량 부족을 의미하므로 더 큰 모델로 교체가 필요합니다."
    },
    {
      id: 5,
      category: "공정 제어",
      question: "반도체 공정에서 공정 가스 유량이 5000 sccm을 초과할 때 주의해야 할 점은?",
      options: [
        "가스 비용 증가",
        "펌프 과부하 및 압력 급상승 위험",
        "전력 소비량 증가",
        "가스 순도 저하"
      ],
      correct: 1,
      explanation: "과도한 가스 유량은 펌프의 배기 한계를 초과하여 시스템 압력이 급상승할 수 있습니다."
    },
    {
      id: 6,
      category: "공정 제어",
      question: "터보분자펌프(TMP) 시스템에서 게이트 밸브의 주요 역할은?",
      options: [
        "가스 온도 조절",
        "컨덕턴스 제어를 통한 펌핑 속도 조절",
        "진공도 측정",
        "가스 순도 향상"
      ],
      correct: 1,
      explanation: "게이트 밸브는 배관의 컨덕턴스를 조절하여 효과적인 펌핑 속도를 제어하는 역할을 합니다."
    },
    {
      id: 7,
      category: "Conductance",
      question: "Q = P × S 공식에서 Q를 7.5 Torr·L/s로 고정하고 S를 500 L/s에서 1000 L/s로 증가시키면 압력 P는?",
      options: [
        "2배 증가",
        "2배 감소", 
        "4배 증가",
        "변화 없음"
      ],
      correct: 1,
      explanation: "P = Q/S 이므로 S가 2배 증가하면 P는 1/2로 감소합니다. (0.015 Torr → 0.0075 Torr)"
    },
    {
      id: 8,
      category: "Conductance",
      question: "배관 직경을 10cm에서 20cm로 증가시켰을 때 Conductance는 약 몇 배 증가하는가?",
      options: [
        "2배",
        "4배",
        "8배", 
        "16배"
      ],
      correct: 3,
      explanation: "Conductance는 직경의 4제곱에 비례하므로 직경이 2배가 되면 2⁴ = 16배 증가합니다."
    },
    {
      id: 9,
      category: "배관 설계",
      question: "같은 길이와 직경일 때 Conductance가 가장 높은 배관 형태는?",
      options: [
        "스파이럴형",
        "엘보형",
        "직관형",
        "모두 동일"
      ],
      correct: 2,
      explanation: "직관형 배관이 가장 높은 Conductance를 가지며, 엘보형, 스파이럴형 순으로 감소합니다."
    },
    {
      id: 10,
      category: "통합 응용",
      question: "반도체 공정에서 10⁻⁶ Torr 진공도가 필요한데 현재 10⁻³ Torr만 달성된다면 우선적으로 검토해야 할 사항은?",
      options: [
        "가스 유량 증가",
        "배관 길이 연장",
        "펌프 업그레이드 및 배관 최적화",
        "온도 상승"
      ],
      correct: 2,
      explanation: "3자리수 진공도 향상을 위해서는 펌프 성능 향상과 배관 Conductance 최적화가 필요합니다."
    }
  ];

  // Theory steps for opening animation
  const theorySteps = [
    {
      title: "🎯 진공(Vacuum)이란?",
      content: "반도체 공정에서 불순물과 오염을 제거하기 위해 **대기압보다 낮은 압력 상태**를 만드는 핵심 기술입니다.\n\n" +
               "마치 완벽하게 깨끗한 수술실처럼, **진공 환경**은 원자 단위의 정밀 작업을 가능하게 합니다.\n\n" +
               "**압력 범위**:\n" +
               "• 대기압: 760 Torr (1 atm)\n" +
               "• 저진공: 760~1 Torr\n" +
               "• 중진공: 1~10⁻³ Torr\n" +
               "• 고진공: 10⁻³~10⁻⁹ Torr\n" +
               "• 초고진공: < 10⁻⁻⁹ Torr\n\n" +
               "💡 **핵심**: 진공도가 높을수록 불순물 농도가 낮아져 고품질 반도체 제조가 가능합니다!",
      highlight: "진공 없이는 7nm 이하 초미세 반도체를 만들 수 없습니다. 단 1개의 불순물 원자도 치명적입니다!",
      icon: "🎯"
    },
    {
      title: "⚙️ 진공은 어떻게 만들까?",
      content: "**1단계: Roughing Pump (조진공 펌프)**\n" +
               "대기압(760 Torr) → 10⁻³ Torr까지 빠르게 배기\n" +
               "• 회전식 베인 펌프 (Rotary Vane Pump)\n" +
               "• 기계적 피스톤 방식으로 가스 압축 배출\n\n" +
               "**2단계: High Vacuum Pump (고진공 펌프)**\n" +
               "10⁻³ Torr → 10⁻⁹ Torr까지 극한 진공 달성\n" +
               "• Turbo Molecular Pump (TMP): 초고속 회전 블레이드로 분자 운동량 전달\n" +
               "• Cryo Pump: 극저온(-200°C)에서 기체 분자를 직접 응축 포집\n\n" +
               "**3단계: 압력 제어**\n" +
               "• APC (Auto Pressure Controller): 공정 압력 정밀 유지\n" +
               "• Gate Valve: 컨덕턴스 조절로 펌핑 속도 제어\n\n" +
               "🔬 **실제 공정**: 에칭 공정은 수십 mTorr, 증착 공정은 10⁻⁶ Torr 수준의 초고진공 필요!",
      highlight: "TMP는 분당 60,000회 회전하며 분자 하나하나를 밀어내는 기계의 극한입니다!",
      icon: "⚙️"
    },
    {
      title: "🚀 진공 기술은 왜 중요할까?",
      content: "**1970년대: 기초 진공 시대**\n" +
               "마이크로미터(μm) 공정 → 10⁻⁵ Torr 수준의 진공\n" +
               "간단한 회전 펌프만으로 충분\n\n" +
               "**2000년대: 나노 공정 진입**\n" +
               "90nm → 32nm 공정 → 10⁻⁷ Torr 초고진공 필수\n" +
               "TMP + Cryo Pump 조합, Load Lock 시스템 도입\n\n" +
               "**2020년대: 극한 진공의 시대**\n" +
               "3nm EUV 공정 → **10⁻⁹ Torr 이하 극한 진공**\n" +
               "• EUV 노광: 진공 없이 13.5nm 파장 빛이 흡수됨\n" +
               "• 원자층 증착(ALD): 단 1개 원자층씩 쌓기 위해 완벽한 진공 필요\n" +
               "• 이온 주입: 불순물 원자의 정밀한 궤적 제어를 위한 무충돌 환경\n\n" +
               "📈 **놀라운 발전**: 50년간 진공도 **1만 배 이상** 향상! (10⁻⁵ → 10⁻⁹ Torr)\n\n" +
               "💰 **비용**: 최첨단 진공 시스템은 장비 가격의 30% 차지 (수십억 원)",
      highlight: "무어의 법칙을 지탱하는 숨은 영웅! 진공 기술의 발전 = 반도체 미세화의 역사",
      icon: "🚀"
    },
    {
      title: "🏭 진공은 어디에 쓰일까?",
      content: "**1. 박막 증착 (Thin Film Deposition)**\n" +
               "• CVD (Chemical Vapor Deposition): 수십 mTorr에서 화학 반응\n" +
               "• PVD (Physical Vapor Deposition): 10⁻⁶ Torr에서 금속 증착\n" +
               "• ALD (Atomic Layer Deposition): 초정밀 단원자층 증착\n\n" +
               "**2. 플라즈마 에칭 (Plasma Etching)**\n" +
               "• RIE (Reactive Ion Etching): 10~100 mTorr에서 이온 충격\n" +
               "• ICP (Inductively Coupled Plasma): 수 mTorr 고밀도 플라즈마\n\n" +
               "**3. 이온 주입 (Ion Implantation)**\n" +
               "• 10⁻⁶ Torr 초고진공에서 불순물 이온을 정확히 주입\n" +
               "• 무충돌 환경으로 정밀한 도핑 깊이 제어\n\n" +
               "**4. EUV 노광 (EUV Lithography)**\n" +
               "• 13.5nm 극자외선은 공기 중에서 흡수 → 완전 진공 필수\n" +
               "• 광학계 전체를 10⁻⁸ Torr 이하 진공 유지\n\n" +
               "**5. 검사 및 분석 (Inspection & Metrology)**\n" +
               "• SEM (Scanning Electron Microscope): 전자빔 관찰\n" +
               "• SIMS (Secondary Ion Mass Spectroscopy): 성분 분석",
      highlight: "반도체 제조 전 공정의 70% 이상이 진공 환경에서 진행됩니다!",
      icon: "🏭"
    },
    {
      title: "📚 이 시뮬레이터로 무엇을 배울까?",
      content: "**'실시간 펌핑 시뮬레이션' 탭**\n" +
               "✅ Roughing Pump와 TMP의 2단계 펌핑 과정 체험\n" +
               "✅ 760 Torr → 10⁻⁹ Torr까지 압력 변화 실시간 관찰\n" +
               "✅ Foreline, Gate Valve, APC 밸브 동작 원리 이해\n\n" +
               "**'성능 특성 곡선 분석' 탭**\n" +
               "✅ 4가지 펌프 모델별 배기 속도 특성 비교\n" +
               "✅ 압력 구간별 최적 펌핑 속도 찾기\n" +
               "✅ Q = S × P 관계식 시각화\n\n" +
               "**'공정 압력 세팅 실험' 탭**\n" +
               "✅ 실제 공정에서 목표 압력 달성 실습\n" +
               "✅ APC를 이용한 정밀 압력 제어 체험\n" +
               "✅ 펌핑 속도와 가스 유량의 균형점 찾기\n\n" +
               "**'Conductance & 압력 관계' 탭**\n" +
               "✅ Q = S × P 공식 이해 (가스 부하, 배기 속도, 압력)\n" +
               "✅ 실시간 슬라이더 조작으로 변수 관계 파악\n\n" +
               "**'배관 설계 최적화' 탭**\n" +
               "✅ 배관 길이, 직경, 형상에 따른 컨덕턴스 변화\n" +
               "✅ 실효 배기 속도 계산: 1/Seff = 1/Spump + 1/C\n" +
               "✅ 최적 배관 설계로 펌핑 효율 극대화\n\n" +
               "**'진공 기술 퀴즈' 탭**\n" +
               "✅ 학습한 내용 종합 테스트\n" +
               "✅ 실무 엔지니어 수준의 진공 지식 검증",
      highlight: "이론과 실습을 모두 경험하며 진공 전문가로 성장하세요! 각 탭을 순서대로 학습하면 완벽합니다.",
      icon: "📚"
    }
  ];

  // 4개 모델의 성능 곡선 데이터
  const pumpModels = {
    1: { // 소형 모델
      name: "모델 1 (소형)",
      maxSpeed: 900,
      color: "#8e24aa",
      data: [
        { pressure: 0.02, speed: 50 }, { pressure: 0.05, speed: 75 },
        { pressure: 0.1, speed: 125 }, { pressure: 0.2, speed: 200 },
        { pressure: 0.5, speed: 350 }, { pressure: 1.0, speed: 550 }, 
        { pressure: 2.0, speed: 725 }, { pressure: 3.0, speed: 825 },
        { pressure: 5.0, speed: 900 }, { pressure: 7.0, speed: 890 },
        { pressure: 10, speed: 860 }, { pressure: 15, speed: 810 },
        { pressure: 25, speed: 740 }, { pressure: 50, speed: 600 },
        { pressure: 100, speed: 450 }, { pressure: 200, speed: 325 },
        { pressure: 300, speed: 250 }, { pressure: 400, speed: 200 },
        { pressure: 500, speed: 175 }, { pressure: 600, speed: 150 },
        { pressure: 700, speed: 135 }, { pressure: 760, speed: 125 }
      ]
    },
    2: { // 중형 모델 (기존)
      name: "모델 2 (중형)",
      maxSpeed: 1800,
      color: "#1976d2",
      data: [
        { pressure: 0.02, speed: 100 }, { pressure: 0.05, speed: 150 },
        { pressure: 0.1, speed: 250 }, { pressure: 0.2, speed: 400 },
        { pressure: 0.5, speed: 700 }, { pressure: 1.0, speed: 1100 }, 
        { pressure: 2.0, speed: 1450 }, { pressure: 3.0, speed: 1650 },
        { pressure: 5.0, speed: 1800 }, { pressure: 7.0, speed: 1780 },
        { pressure: 10, speed: 1720 }, { pressure: 15, speed: 1620 },
        { pressure: 25, speed: 1480 }, { pressure: 50, speed: 1200 },
        { pressure: 100, speed: 900 }, { pressure: 200, speed: 650 },
        { pressure: 300, speed: 500 }, { pressure: 400, speed: 400 },
        { pressure: 500, speed: 350 }, { pressure: 600, speed: 300 },
        { pressure: 700, speed: 270 }, { pressure: 760, speed: 250 }
      ]
    },
    3: { // 대형 모델
      name: "모델 3 (대형)",
      maxSpeed: 3600,
      color: "#388e3c",
      data: [
        { pressure: 0.02, speed: 200 }, { pressure: 0.05, speed: 300 },
        { pressure: 0.1, speed: 500 }, { pressure: 0.2, speed: 800 },
        { pressure: 0.5, speed: 1400 }, { pressure: 1.0, speed: 2200 }, 
        { pressure: 2.0, speed: 2900 }, { pressure: 3.0, speed: 3300 },
        { pressure: 5.0, speed: 3600 }, { pressure: 7.0, speed: 3560 },
        { pressure: 10, speed: 3440 }, { pressure: 15, speed: 3240 },
        { pressure: 25, speed: 2960 }, { pressure: 50, speed: 2400 },
        { pressure: 100, speed: 1800 }, { pressure: 200, speed: 1300 },
        { pressure: 300, speed: 1000 }, { pressure: 400, speed: 800 },
        { pressure: 500, speed: 700 }, { pressure: 600, speed: 600 },
        { pressure: 700, speed: 540 }, { pressure: 760, speed: 500 }
      ]
    },
    4: { // 초대형 모델
      name: "모델 4 (초대형)",
      maxSpeed: 7200,
      color: "#d32f2f",
      data: [
        { pressure: 0.02, speed: 400 }, { pressure: 0.05, speed: 600 },
        { pressure: 0.1, speed: 1000 }, { pressure: 0.2, speed: 1600 },
        { pressure: 0.5, speed: 2800 }, { pressure: 1.0, speed: 4400 }, 
        { pressure: 2.0, speed: 5800 }, { pressure: 3.0, speed: 6600 },
        { pressure: 5.0, speed: 7200 }, { pressure: 7.0, speed: 7120 },
        { pressure: 10, speed: 6880 }, { pressure: 15, speed: 6480 },
        { pressure: 25, speed: 5920 }, { pressure: 50, speed: 4800 },
        { pressure: 100, speed: 3600 }, { pressure: 200, speed: 2600 },
        { pressure: 300, speed: 2000 }, { pressure: 400, speed: 1600 },
        { pressure: 500, speed: 1400 }, { pressure: 600, speed: 1200 },
        { pressure: 700, speed: 1080 }, { pressure: 760, speed: 1000 }
      ]
    }
  };
  
  // 모든 모델 데이터를 차트용으로 변환
  const allModelData = Object.keys(pumpModels).reduce((acc, modelKey) => {
    pumpModels[modelKey].data.forEach(point => {
      const existingPoint = acc.find(p => p.pressure === point.pressure);
      if (existingPoint) {
        existingPoint[`model${modelKey}`] = point.speed;
      } else {
        acc.push({
          pressure: point.pressure,
          [`model${modelKey}`]: point.speed
        });
      }
    });
    return acc;
  }, []);
  
  // 헬퍼 함수들
  const calculateTurboSpeed = (pressure) => {
    if (pressure <= 1e-6) return 300;
    if (pressure <= 1e-5) return 300;
    if (pressure <= 1e-4) return 295;
    if (pressure <= 1e-3) return 280;
    if (pressure <= 1e-2) return 250;
    if (pressure <= 1e-1) return 180;
    if (pressure <= 1) return 80;
    return 20;
  };
  
  const convertSccmToTorrLs = (sccm) => sccm * 0.00950;
  
  const calculatePumpingSpeed = (pressure, modelNumber = selectedModel) => {
    const model = pumpModels[Math.round(modelNumber)];
    if (!model) return 250;
    
    if (pressure <= 0.02) return model.data[0].speed;
    if (pressure >= 760) return model.data[model.data.length - 1].speed;
    
    const logPressure = Math.log10(pressure);
    
    for (let i = 0; i < model.data.length - 1; i++) {
      const current = model.data[i];
      const next = model.data[i + 1];
      
      if (logPressure >= Math.log10(current.pressure) && logPressure <= Math.log10(next.pressure)) {
        const ratio = (logPressure - Math.log10(current.pressure)) / (Math.log10(next.pressure) - Math.log10(current.pressure));
        return current.speed + (next.speed - current.speed) * ratio;
      }
    }
    
    return model.maxSpeed / 2;
  };
  
  const pressureToSliderValue = (pressure) => {
    const minLog = Math.log10(0.02);
    const maxLog = Math.log10(760);
    const currentLog = Math.log10(pressure);
    return ((currentLog - minLog) / (maxLog - minLog)) * 100;
  };
  
  const calculatePumpingTime = (volume, initialPressure, finalPressure, pumpSpeed) => {
    if (finalPressure <= 0.02) finalPressure = 0.02;
    if (initialPressure <= finalPressure) return 0;
    const timeInMinutes = (volume * Math.log(initialPressure / finalPressure)) / (pumpSpeed * 60 / 1000);
    return timeInMinutes;
  };
  
  const getPumpEfficiencyAssessment = () => {
    const pumpingTimeTo1Torr = calculatePumpingTime(chamberVolume, 760, 1, pumpingSpeed);
    
    if (pumpingTimeTo1Torr > 20) {
      return {
        status: 'very-slow',
        message: '매우 느림 - 펌프 용량 부족',
        color: 'text-red-600 bg-red-50 border-red-200',
        time: pumpingTimeTo1Torr
      };
    } else if (pumpingTimeTo1Torr > 10) {
      return {
        status: 'somewhat-slow',
        message: '다소 느림 - 펌핑 시간 과다',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        time: pumpingTimeTo1Torr
      };
    } else {
      return {
        status: 'good',
        message: '양호 - 적절한 펌핑 속도',
        color: 'text-green-600 bg-green-50 border-green-200',
        time: pumpingTimeTo1Torr
      };
    }
  };
  
  const getVacuumStage = (pressure) => {
    if (pressure > 100) return '대기압/초기배기';
    if (pressure > 1) return '저진공';
    if (pressure > 1e-3) return '중진공';
    if (pressure > 1e-6) return '고진공';
    return '초고진공';
  };
  
  const getVacuumLevel = () => {
    if (targetPressure >= 100) return '대기압/고압 (Atmospheric)';
    if (targetPressure >= 1) return '저진공 (Rough Vacuum)';
    if (targetPressure >= 1e-3) return '중진공 (Medium Vacuum)';
    if (targetPressure >= 1e-6) return '고진공 (High Vacuum)';
    return '초고진공 (Ultra High Vacuum)';
  };
  
  const getFixedVacuumLevel = () => {
    if (fixedPressure >= 100) return '대기압/고압';
    if (fixedPressure >= 1) return '저진공';
    if (fixedPressure >= 1e-3) return '중진공';
    if (fixedPressure >= 1e-6) return '고진공';
    return '초고진공';
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Conductance 계산 함수들
  const calculateConductance = (diameter, length, pipeType) => {
    // 기본 원통형 배관의 conductance (L/s)
    const D = diameter; // cm
    const L = length; // cm
    let baseConductance = 3.27e-2 * Math.pow(D, 4) / L;
    
    // 배관 타입별 보정 계수
    switch(pipeType) {
      case 'straight':
        return baseConductance * 1000; // L/s로 변환
      case 'elbow':
        return baseConductance * 0.7 * 1000; // 엘보로 인한 손실
      case 'spiral':
        return baseConductance * 0.4 * 1000; // 스파이럴로 인한 큰 손실
      default:
        return baseConductance * 1000;
    }
  };
  
  const calculateEffectivePumpingSpeed = (pumpSpeed, conductance) => {
    // 1/S_eff = 1/S_pump + 1/C
    return (pumpSpeed * conductance) / (pumpSpeed + conductance);
  };
  
  const getPipeTypeDescription = (type) => {
    switch(type) {
      case 'straight': return '직관형 (높은 Conductance)';
      case 'elbow': return '엘보형 (중간 Conductance)';
      case 'spiral': return '스파이럴형 (낮은 Conductance)';
      default: return '직관형';
    }
  };
  
  const getPressureColor = (pressure) => {
    if (pressure > 0.1) return '#ffcdd2'; // 빨강 (높은 압력)
    if (pressure > 0.01) return '#fff3e0'; // 오렌지 (중간 압력)
    if (pressure > 0.001) return '#e8f5e8'; // 연녹색 (낮은 압력)
    return '#e3f2fd'; // 파랑 (매우 낮은 압력)
  };

  // Theory animation effect
  useEffect(() => {
    if (!isTheoryPlaying) {
      setTypedText('');
      return;
    }

    const currentStepContent = theorySteps[theoryStep].content;
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= currentStepContent.length) {
        setTypedText(currentStepContent.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [theoryStep, isTheoryPlaying]);

  // Theory control functions
  const startTheoryAnimation = () => {
    setIsTheoryPlaying(true);
    setTheoryStep(0);
  };

  const stopTheoryAnimation = () => {
    setIsTheoryPlaying(false);
    setTheoryStep(0);
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

  // useEffect들
  useEffect(() => {
    const speed = calculatePumpingSpeed(targetPressure, selectedModel);
    setPumpingSpeed(Math.round(speed));
  }, [targetPressure, selectedModel]);
  
  useEffect(() => {
    const gasLoadRate = convertSccmToTorrLs(gasFlowRate);
    const baseSpeed = calculateTurboSpeed(fixedPressure);
    const valveEfficiency = Math.pow(gateValveOpening / 100, 1.5);
    const effectiveSpeed = baseSpeed * valveEfficiency;
    const newPressure = gasLoadRate / Math.max(effectiveSpeed, 1);
    setFixedPressure(newPressure);
  }, [gasFlowRate, gateValveOpening]);

  // TMP 시뮬레이션 useEffect (자동 모드에서만)
  useEffect(() => {
    // 자동 모드에서만 실행 - 수동 모드에서는 완전히 무시
    if (!isPlaying || isManualMode) return;

    const interval = setInterval(() => {
      setElapsedTime(prevTime => {
        const newTime = prevTime + 0.1;
        const scaleFactor = chamberVolume / 100;

        let newPressure = animationPressure;
        let newTurboSpeed = turboSpeed;
        let newForelinePressure = forelinePressure;
        let phase = currentPhase;

        // 자동 모드 시퀀스
        // Phase 1: 준비 단계
        if (newTime < 5) {
          phase = '준비 중...';
          setRoughingValveOpen(false);
          setApcValveOpen(false);
          setForelineValveOpen(false);
          newTurboSpeed = 0;
        }
        // Phase 2: 러핑 밸브 개방
        else if (newTime < 5.5) {
          phase = '러핑 밸브 개방';
          setRoughingValveOpen(true);
          setApcValveOpen(false);
          setForelineValveOpen(false);
        }
        // Phase 3: 러핑 펌프로 저진공 생성 (0.05 Torr까지)
        else if (animationPressure > 0.05) {
          phase = '저진공 생성 중 (러핑 펌프)';
          const roughingTime = newTime - 5.5;
          newPressure = Math.max(0.05, 760 * Math.exp(-(roughingTime) / (3 * scaleFactor)));
          newForelinePressure = newPressure;

          setRoughingValveOpen(true);
          setApcValveOpen(false);
          setForelineValveOpen(false);
          newTurboSpeed = 0;
        }
        // Phase 4: 0.05 Torr 도달 후 즉시 밸브 전환 및 TMP 시작
        else if (animationPressure <= 0.05) {
          if (valveSwitchTime === null) {
            setValveSwitchTime(newTime);
          }

          const switchDuration = newTime - (valveSwitchTime || newTime);

          if (switchDuration < 0.5) {
            phase = '밸브 전환 중... (러핑→TMP)';
            setRoughingValveOpen(false);
            setApcValveOpen(false);
            setForelineValveOpen(false);
            newTurboSpeed = 0;
            newPressure = animationPressure;
            newForelinePressure = animationPressure;
          }
          else {
            phase = '터보 펌프 운전 중';
            setRoughingValveOpen(false);
            setApcValveOpen(true);
            setForelineValveOpen(true);

            if (turboStartTime === null) {
              setTurboStartTime(newTime);
            }

            const turboTime = newTime - (turboStartTime || newTime);
            newTurboSpeed = Math.min(300, turboTime * 25);

            if (newTurboSpeed > 20) {
              newPressure = Math.max(1e-6, 0.05 * Math.exp(-turboTime / (8 * scaleFactor)));
            } else {
              newPressure = Math.max(0.01, animationPressure * 0.995);
            }

            newForelinePressure = Math.max(0.05, newPressure * 30);
          }
        }

        setAnimationPressure(newPressure);
        setAnimationSpeed(Math.round(calculatePumpingSpeed(newPressure)));
        setTurboSpeed(newTurboSpeed);
        setForelinePressure(newForelinePressure);
        setCurrentPhase(phase);

        return newTime;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, isManualMode, chamberVolume, animationPressure, currentPhase, turboSpeed, forelinePressure, valveSwitchTime, turboStartTime]);

  // 수동 모드 시뮬레이션 useEffect
  useEffect(() => {
    if (!isPlaying || !isManualMode) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 0.1);

      const scale = chamberVolume / 100;

      setAnimationPressure(prev => {
        let newP = prev;

        // 케이스 1: R/V만 열림 (러핑 펌프 배기) - 속도 향상
        if (roughingValveOpen && !apcValveOpen) {
          if (prev > 0.05) {
            newP = prev * Math.exp(-0.12 / scale);
          }
          setForelinePressure(prev);
        }
        // 케이스 2: APC + F/V + TMP 모두 ON (TMP 고진공 배기)
        else if (apcValveOpen && forelineValveOpen && tmpOn) {
          setTurboSpeed(ts => Math.min(300, ts + 3));
          if (turboSpeed > 30 && prev > 1e-7) {
            newP = prev * Math.exp(-0.015 / scale);
          }
          setForelinePressure(Math.max(0.01, newP * 50));
        }
        // 케이스 3: APC 열림 + TMP OFF = 역류! (포라인 고진공 → 챔버로)
        else if (apcValveOpen && !tmpOn) {
          // 포라인이 챔버보다 진공이 높으면 역류 (압력 평형으로 수렴)
          if (forelinePressure < prev) {
            const avgPressure = (prev + forelinePressure) / 2;
            newP = prev * 0.95 + avgPressure * 0.05; // 챔버 압력 하강
            setForelinePressure(fp => fp * 0.95 + avgPressure * 0.05); // 포라인 압력 상승
          }
          setTurboSpeed(ts => Math.max(0, ts - 3)); // TMP 감속
        }
        // 케이스 4: F/V만 열림 (TMP 없이) - 드라이펌프가 포라인 펌핑
        else if (forelineValveOpen && !apcValveOpen && !tmpOn) {
          // 포라인만 펌핑 (챔버는 영향 없음)
          setForelinePressure(fp => Math.max(0.01, fp * 0.95));
          setTurboSpeed(ts => Math.max(0, ts - 2));
        }
        // 케이스 5: TMP ON but F/V 닫힘 (위험 - 압력 정체)
        else if (tmpOn && !forelineValveOpen) {
          setTurboSpeed(ts => Math.min(100, ts + 1));
        }
        // 케이스 6: 아무것도 안함 (미세 누설로 압력 상승)
        else {
          newP = Math.min(760, prev * 1.0005);
          if (!tmpOn) setTurboSpeed(ts => Math.max(0, ts - 5));
        }

        return Math.max(1e-8, Math.min(760, newP));
      });

      setAnimationSpeed(Math.round(calculatePumpingSpeed(animationPressure)));
      setCurrentPhase(getManualPhase());
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isManualMode, roughingValveOpen, apcValveOpen, forelineValveOpen, tmpOn, turboSpeed, chamberVolume, animationPressure]);

  // 수동 모드 단계 체크 useEffect
  useEffect(() => {
    if (!isManualMode || !isPlaying) return;

    const currentStepData = manualSteps[manualStep];
    if (!currentStepData) return;

    const isConditionMet = currentStepData.check();

    if (isConditionMet && !stepCompleted[manualStep]) {
      const newCompleted = [...stepCompleted];
      newCompleted[manualStep] = true;
      setStepCompleted(newCompleted);

      if (manualStep === 0) addLog("✓ R/V 열림 - 러핑 펌프 배기 시작", "success");
      else if (manualStep === 1) addLog(`✓ 저진공 도달: ${animationPressure.toFixed(2)} Torr`, "success");
      else if (manualStep === 2) addLog("✓ 밸브 전환 완료 - TMP 경로 준비", "success");
      else if (manualStep === 3) addLog("✓ F/V 열림 - 포라인 경로 확보", "success");
      else if (manualStep === 4) addLog("✓ TMP 가동 시작 - 고진공 생성 중", "success");
      else if (manualStep === 5) addLog("🎉 축하합니다! 목표 진공도 달성!", "complete");

      if (manualStep < 5) {
        setManualStep(prev => prev + 1);
      }
    }
  }, [isManualMode, isPlaying, manualStep, roughingValveOpen, apcValveOpen, forelineValveOpen, tmpOn, animationPressure, stepCompleted]);

  // 압력 변화 로그 - 특정 압력 통과 시에만
  useEffect(() => {
    if (!isManualMode || !isPlaying) return;
    const prev = prevPressureRef.current;
    const curr = animationPressure;

    if (prev > 100 && curr <= 100) addLog("📍 압력 100 Torr 통과", "info");
    if (prev > 10 && curr <= 10) addLog("📍 압력 10 Torr 통과", "info");
    if (prev > 1 && curr <= 1) addLog("📍 1 Torr - 저진공 영역 진입", "info");
    if (prev > 0.1 && curr <= 0.1) addLog("📍 0.1 Torr 도달", "info");
    if (prev > 0.001 && curr <= 0.001) addLog("📍 10⁻³ Torr - 중진공 영역", "info");
    if (prev > 1e-5 && curr <= 1e-5) addLog("📍 10⁻⁵ Torr - 고진공 영역!", "info");

    prevPressureRef.current = curr;
  }, [animationPressure, isManualMode, isPlaying]);
  
  // Q=P×S 관계 계산
  useEffect(() => {
    const pressure = gasLoad / systemPumpingSpeed; // P = Q/S
    setResultPressure(pressure);
  }, [gasLoad, systemPumpingSpeed]);
  
  // 배관 설계 계산
  useEffect(() => {
    const conductance = calculateConductance(pipeDiameter, pipeLength, pipeType);
    setCalculatedConductance(conductance);
    
    const pumpSpeed = 1000; // 기본 펌프 속도 1000 L/s
    const effSpeed = calculateEffectivePumpingSpeed(pumpSpeed, conductance);
    setEffectivePumpingSpeed(effSpeed);
  }, [pipeDiameter, pipeLength, pipeType]);
  
  // 이벤트 핸들러들
  const handleModelChange = (e) => {
    const value = parseFloat(e.target.value);
    setSelectedModel(value);
  };
  
  const handleTargetPressureChange = (e) => {
    const sliderValue = parseFloat(e.target.value);
    const minLog = Math.log10(0.02);
    const maxLog = Math.log10(760);
    const logValue = minLog + (sliderValue / 100) * (maxLog - minLog);
    const pressure = Math.pow(10, logValue);
    setTargetPressure(pressure);
  };
  
  const handleGasFlowChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setGasFlowRate(value);
  };
  
  const handleGateValveChange = (e) => {
    const value = parseFloat(e.target.value);
    setGateValveOpening(value);
  };
  
  const handleChamberVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setChamberVolume(value);
  };
  
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleReset = () => {
    setIsPlaying(false);
    setAnimationPressure(760);
    setAnimationSpeed(250);
    setElapsedTime(0);
    setTurboSpeed(0);
    setForelinePressure(760);
    setApcValveOpen(false);
    setForelineValveOpen(false);
    setRoughingValveOpen(false);
    setCurrentPhase('준비');
    setTurboStartTime(null);
    setValveSwitchTime(null);
    // 수동 모드 리셋
    setTmpOn(false);
    setManualStep(0);
    setLogMessages([]);
    setStepCompleted([false, false, false, false, false, false]);
    prevPressureRef.current = 760;
  };

  // 수동 모드 단계 정의
  const manualSteps = [
    { id: 0, instruction: "🚀 R/V (Roughing Valve)를 열어 초기 배기를 시작하세요.", action: "R/V OPEN", check: () => roughingValveOpen === true },
    { id: 1, instruction: "⏳ 압력이 0.1 Torr 이하가 될 때까지 기다리세요...", action: "WAIT (≤0.1 Torr)", check: () => animationPressure <= 0.1 },
    { id: 2, instruction: "✅ 저진공 도달! R/V를 닫고 APC 밸브를 여세요.", action: "R/V CLOSE → APC OPEN", check: () => roughingValveOpen === false && apcValveOpen === true },
    { id: 3, instruction: "🔧 F/V (Foreline Valve)를 열어 TMP 배기 경로를 확보하세요.", action: "F/V OPEN", check: () => forelineValveOpen === true },
    { id: 4, instruction: "⚡ TMP를 켜서 고진공을 생성하세요!", action: "TMP ON", check: () => tmpOn === true },
    { id: 5, instruction: "🎯 목표: 10⁻⁵ Torr 이하 도달!", action: "COMPLETE", check: () => animationPressure <= 1e-5 }
  ];

  // 로그 추가 함수
  const addLog = (msg, type = 'info') => {
    const time = formatTime(elapsedTime);
    setLogMessages(prev => [...prev.slice(-15), { time, msg, type, id: Date.now() }]);
  };

  // 수동 모드 밸브 조작 핸들러
  const handleValveWithWarning = (valveName, newState, setterFn) => {
    // 인터락 체크: R/V와 F/V 동시 개방 금지
    if (valveName === 'R/V' && newState && forelineValveOpen) {
      addLog("🚫 인터락: R/V와 F/V 동시 개방 불가!", "error");
      return; // 동작 차단
    }
    if (valveName === 'F/V' && newState && roughingValveOpen) {
      addLog("🚫 인터락: F/V와 R/V 동시 개방 불가!", "error");
      return; // 동작 차단
    }

    setterFn(newState);
    addLog(`${valveName} ${newState ? 'OPEN' : 'CLOSE'}`, 'action');

    // 경고 체크
    if (valveName === 'TMP' && newState && !forelineValveOpen) {
      addLog("⚠️ 경고: F/V가 닫힌 상태에서 TMP ON!", "error");
    }
    if (valveName === 'TMP' && newState && animationPressure > 1) {
      addLog("⚠️ 주의: 압력이 높습니다 (>1 Torr)", "warning");
    }
    if (valveName === 'R/V' && newState && apcValveOpen) {
      addLog("⚠️ 주의: APC와 R/V 동시 개방", "warning");
    }
    if (valveName === 'APC' && newState && roughingValveOpen) {
      addLog("⚠️ 주의: R/V와 APC 동시 개방", "warning");
    }
    // APC 열 때 TMP가 안 돌고 있으면 역류 경고
    if (valveName === 'APC' && newState && !tmpOn && forelinePressure < animationPressure) {
      addLog("⚠️ 위험: 포라인 고진공이 챔버로 역류합니다!", "error");
    }
  };

  // 수동 모드 현재 상태 표시
  const getManualPhase = () => {
    if (!roughingValveOpen && !apcValveOpen && !tmpOn && !forelineValveOpen) return '⏸️ 대기 중 - 밸브를 조작하세요';
    if (roughingValveOpen && !apcValveOpen) return '🔄 러핑 펌프 배기 중';
    if (apcValveOpen && forelineValveOpen && tmpOn && turboSpeed > 50) return '🚀 TMP 고진공 생성 중';
    if (apcValveOpen && forelineValveOpen && tmpOn) return '⚡ TMP 가속 중...';
    if (tmpOn && !forelineValveOpen) return '⚠️ 경고: F/V 닫힘!';
    // 역류 상태
    if (apcValveOpen && !tmpOn && forelinePressure < animationPressure) return '🔴 역류 중! 포라인→챔버';
    if (apcValveOpen && !tmpOn) return '⚠️ APC 열림 - TMP 없이 위험!';
    // F/V만 열린 상태 (안전)
    if (forelineValveOpen && !apcValveOpen && !tmpOn) return '✅ 포라인 펌핑 중 (안전)';
    if (apcValveOpen && !forelineValveOpen) return '⏳ F/V를 여세요';
    return '⏸️ 대기 중';
  };
  
  // 새로운 이벤트 핸들러들
  const handleGasLoadChange = (e) => {
    const value = parseFloat(e.target.value);
    setGasLoad(value);
  };
  
  const handleSystemPumpingSpeedChange = (e) => {
    const value = parseFloat(e.target.value);
    setSystemPumpingSpeed(value);
  };
  
  const handlePipeLengthChange = (e) => {
    const value = parseFloat(e.target.value);
    setPipeLength(value);
  };
  
  const handlePipeDiameterChange = (e) => {
    const value = parseFloat(e.target.value);
    setPipeDiameter(value);
  };
  
  const handlePipeTypeChange = (e) => {
    setPipeType(e.target.value);
  };
  
  // 퀴즈 이벤트 핸들러들
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };
  
  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    const newUserAnswers = [...userAnswers, {
      questionId: quizQuestions[currentQuestion].id,
      selectedAnswer,
      correct: isCorrect
    }];
    setUserAnswers(newUserAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setUserAnswers([]);
  };
  
  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return '우수! 진공 기술 전문가 수준입니다! 🏆';
    if (percentage >= 80) return '양호! 진공 기술을 잘 이해하고 있습니다! 👍';
    if (percentage >= 60) return '보통! 조금 더 학습하면 완벽해집니다! 📚';
    return '부족! 시뮬레이터를 다시 체험해보세요! 💪';
  };

  // 트러블슈팅 시나리오 데이터
  const troubleSituationMessages = {
    1: ["🏭 정상 가동 중... 챔버 압력 10⁻⁵ Torr 유지","⚙️ TMP 정상 회전 중 (60,000 RPM)","🌡️ 갑자기 TMP 온도가 상승하기 시작합니다!","⚠️ 경고: TMP 온도 85°C! 정상 범위(60°C) 초과!","🚨 즉시 조치가 필요합니다! 과열 시 베어링 손상 위험!"],
    2: ["🏭 정상 가동 중... 챔버 압력 10⁻⁵ Torr 유지","⚡ 드라이펌프 전류 모니터링 중...","📈 이상 감지! 드라이펌프 전류가 42A로 급상승! (정상: 15A)","📊 배기량이 180%로 비정상 상승, TMP RPM 소폭 하락 관찰","🚨 드라이펌프 모터 과부하! 순서대로 셧다운 필요!"],
    3: ["🏭 펌핑 시작... 목표 압력 10⁻⁶ Torr","⏳ 10분 경과... 압력이 5×10⁻⁴ Torr에서 정체","🤔 이상하다... TMP는 정상인데 왜 진공이 안 올라가지?","🔍 가스라인 VCR 피팅 어딘가에서 누설 의심!","💡 O2, Ar, N2 밸브를 하나씩 닫아 원인을 찾아보세요!"],
    4: ["🏭 PECVD SiN 증착 공정 진행 중...","⚡ RF 13.56MHz 300W 인가, SiH4 + NH3 + N2 가스 흐르는 중","🔥 뭔가 탄 냄새가 난다! Matcher 쪽에서!","😱 타는 냄새 점점 강해짐! 연기 보임!","🚨 EMO 버튼을 눌렀는데... 안 눌린다?! 고장!","☠️ SiH4(실란) 계속 흐르는 중! 자연발화 위험! 수동 셧다운 필요!"],
    5: ["🏭 챔버 러핑 펌핑 중...","✅ R/V 열고 러핑 중... 760 Torr → 8×10⁻³ Torr 도달!","⚙️ 좋아, TMP 가속 시작... 60,000 RPM 정상 도달","🔄 이제 포라인으로 전환하자. R/V 닫고, F/V 열고...","😕 어? TMP 정상인데 압력이 5×10⁻⁴에서 안 내려가네?","🤔 러핑은 멀쩡했는데... 포라인 라인 어딘가 문제인가?","🔍 F/V와 DRY 펌프 사이를 점검해보자!"]
  };

  const troubleScenarios = {
    1: { name: "TMP 과열 경고", icon: "🌡️", color: "from-orange-500 to-red-600", description: "TMP 온도 상승! 안전 셧다운 필요", isDetective: false },
    2: { name: "드라이펌프 전류 이상", icon: "⚡", color: "from-yellow-500 to-orange-600", description: "드라이펌프 전류 급상승! 순서대로 셧다운", isDetective: false },
    3: { name: "가스라인 피팅 누설", icon: "🔍", color: "from-blue-500 to-purple-600", description: "VCR 피팅 누설! 라인별로 원인 파악", isDetective: true },
    4: { name: "공정 중 탄냄새 발생", icon: "🔥", color: "from-red-600 to-red-900", description: "Matcher에서 탄냄새! EMO 고장! 수동 대응!", isDetective: false, critical: true },
    5: { name: "포라인 배관 이상", icon: "🔧", color: "from-cyan-500 to-blue-700", description: "러핑 OK, 포라인 전환 후 안됨! 배관 점검", isDetective: true }
  };

  const handleTroubleStart = () => {
    setTroubleStarted(true);
    setTroubleTriggered(false);
    setTroubleLogMessages([]);
    setTroubleElapsedTime(0);
    setTroubleTurboSpeed(300);
    setTroubleApcOpen(true);
    setTroubleFvOpen(true);
    setTroubleRvOpen(false);
    setTroubleTmpOn(true);
    setTroubleSuccess(false);
    setTroubleFailed(false);
    setTmpTemperature(55);
    setDryPumpCurrent(15);
    setDryPumpExhaust(100);
    setDryPumpOn(true);
    setScenario2Step(0);
    setGasLineN2(true);
    setGasLineAr(true);
    setGasLineO2(true);
    setGasLineMain(true);
    setTroubleSituationText('');
    setSituationIndex(0);
    setShowSituation(true);
    setLeakSource(['N2','Ar','O2'][Math.floor(Math.random()*3)]);
    setTroublePressure(troubleScenario === 3 ? 5e-4 : troubleScenario === 4 ? 1.5 : 1e-5);
    setRfOn(true);
    setRfPower(300);
    setMatcherTemp(45);
    setSih4Flow(100);
    setNh3Flow(200);
    setN2Flow(500);
    setGasSupplyMain(true);
    setSih4Valve(true);
    setRfBreaker(true);
    setMatcherSmoke(0);
    setScenario4Step(0);
    setEvacuating(false);
    setScenario4Warnings([]);
    setScenario4VacuumTouched(false);
    setScenario5Phase('roughing');
    setScenario5FaultLocation(['bellows','oring','clamp'][Math.floor(Math.random()*3)]);
    setScenario5Checked({ bellows: false, oring: false, clamp: false, fvSeal: false });
    setScenario5Found(false);
    setTroubleForelinePressure(0.01);
    setScenario5BackflowWarning(false);
    if (troubleScenario === 5) {
      setTroubleRvOpen(true);
      setTroubleFvOpen(false);
      setTroublePressure(8e-3);
    }
  };

  const handleTroubleReset = () => {
    setTroubleStarted(false);
    setTroubleTriggered(false);
    setTroubleLogMessages([]);
    setTroubleSuccess(false);
    setTroubleFailed(false);
    setShowSituation(false);
    setTroubleSituationText('');
    setSituationIndex(0);
  };

  const addScenario4Warning = (msg) => {
    setScenario4Warnings(prev => [...prev.slice(-4), { msg, id: Date.now() }]);
  };

  const handleVacuumButtonInScenario4 = (buttonName) => {
    if (troubleScenario === 4 && troubleTriggered && !troubleSuccess) {
      setScenario4VacuumTouched(true);
      if (buttonName === 'APC' && troubleApcOpen) {
        addScenario4Warning(`⚠️ APC 닫으면 안됨! 챔버 내 SiH4 배기 불가!`);
      } else if (buttonName === 'APC' && !troubleApcOpen) {
        addScenario4Warning(`✓ APC 다시 열었습니다. 배기 유지!`);
      } else if (buttonName === 'TMP') {
        addScenario4Warning(`⚠️ TMP는 건드리지 마세요! 지금은 RF/가스가 우선!`);
      } else if (buttonName === 'FV') {
        addScenario4Warning(`⚠️ F/V 조작 불필요! 배기 라인 유지하세요!`);
      } else if (buttonName === 'RV') {
        addScenario4Warning(`⚠️ R/V는 지금 필요없습니다!`);
      } else if (buttonName === 'DRY') {
        addScenario4Warning(`⚠️ 드라이펌프는 계속 가동! 끄면 배기 안됨!`);
      }
    }
  };

  const isTroublePumping = troubleStarted && troubleTmpOn && troubleApcOpen && troubleFvOpen;

  // 트러블슈팅 상황 텍스트 타이핑 효과
  useEffect(() => {
    if (!troubleStarted || !showSituation) return;
    const messages = troubleSituationMessages[troubleScenario];
    if (!messages) return;
    const currentFullText = messages.slice(0, situationIndex + 1).join('\n');
    if (troubleSituationText.length < currentFullText.length) {
      const timer = setTimeout(() => setTroubleSituationText(currentFullText.slice(0, troubleSituationText.length + 1)), 30);
      return () => clearTimeout(timer);
    } else if (situationIndex < messages.length - 1) {
      const timer = setTimeout(() => setSituationIndex(prev => prev + 1), 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setTroubleTriggered(true);
        if (troubleScenario === 1) setTmpTemperature(85);
        if (troubleScenario === 2) { setDryPumpCurrent(42); setDryPumpExhaust(180); setTroubleTurboSpeed(280); }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [troubleStarted, showSituation, troubleSituationText, situationIndex, troubleScenario]);

  // 트러블슈팅 시뮬레이션 메인 로직
  useEffect(() => {
    if (!troubleStarted || !troubleTriggered) return;
    const interval = setInterval(() => {
      setTroubleElapsedTime(prev => prev + 0.1);
      if (troubleSuccess || troubleFailed) return;

      // 시나리오 1: TMP 과열
      if (troubleScenario === 1) {
        if (troubleTmpOn) setTmpTemperature(prev => Math.min(130, prev + 0.8));
        else { setTmpTemperature(prev => Math.max(55, prev - 0.3)); setTroubleTurboSpeed(prev => Math.max(0, prev - 2)); }
        if (tmpTemperature > 120) setTroubleFailed(true);
        if (!troubleApcOpen && !troubleTmpOn) setTroubleSuccess(true);
      }

      // 시나리오 2: 드라이펌프 과전류
      if (troubleScenario === 2) {
        if (dryPumpOn) { setDryPumpCurrent(prev => Math.min(60, prev + 0.1)); setDryPumpExhaust(prev => Math.min(250, prev + 0.5)); }
        if (!troubleTmpOn) setTroubleTurboSpeed(prev => Math.max(0, prev - 2));
        if (dryPumpCurrent > 55) setTroubleFailed(true);
        if (scenario2Step === 0 && !troubleFvOpen) setScenario2Step(1);
        if (scenario2Step === 1 && !dryPumpOn) setScenario2Step(2);
        if (scenario2Step === 2 && !troubleTmpOn) setScenario2Step(3);
        if (scenario2Step === 3 && !troubleApcOpen) setTroubleSuccess(true);
      }

      // 시나리오 3: 가스 누설
      if (troubleScenario === 3) {
        const mainClosed = !gasLineMain;
        const n2Closed = !gasLineN2 || mainClosed;
        const arClosed = !gasLineAr || mainClosed;
        const o2Closed = !gasLineO2 || mainClosed;
        const hasLeak = (leakSource==='N2' && !n2Closed) || (leakSource==='Ar' && !arClosed) || (leakSource==='O2' && !o2Closed);
        if (hasLeak) setTroublePressure(prev => prev + (5e-4 - prev) * 0.1);
        else setTroublePressure(prev => Math.max(1e-7, prev * 0.92));
      }

      // 시나리오 4: Matcher 아크
      if (troubleScenario === 4) {
        if (rfOn && rfBreaker) {
          setMatcherTemp(prev => Math.min(250, prev + 1.5));
          setMatcherSmoke(prev => Math.min(100, prev + 0.8));
        } else {
          setMatcherTemp(prev => Math.max(45, prev - 0.5));
          setMatcherSmoke(prev => Math.max(0, prev - 1));
        }
        if (!gasSupplyMain || !sih4Valve) {
          setSih4Flow(prev => Math.max(0, prev - 20));
          setNh3Flow(prev => Math.max(0, prev - 40));
          setN2Flow(prev => Math.max(0, prev - 100));
        }
        if (evacuating && sih4Flow === 0) {
          setTroublePressure(prev => Math.max(0.01, prev * 0.9));
        }
        if (matcherTemp >= 240) setTroubleFailed(true);
        if (scenario4Step === 0 && !rfBreaker) setScenario4Step(1);
        if (scenario4Step === 1 && (!gasSupplyMain || !sih4Valve)) setScenario4Step(2);
        if (scenario4Step === 2 && sih4Flow === 0 && matcherTemp < 100) setScenario4Step(3);
        if (scenario4Step === 3) setTroubleSuccess(true);
      }

      // 시나리오 5: 포라인 배관
      if (troubleScenario === 5) {
        if (troubleRvOpen && !troubleFvOpen) {
          setScenario5Phase('roughing');
          setScenario5BackflowWarning(false);
          setTroublePressure(prev => Math.max(8e-3, prev * 0.95));
        } else if (!troubleRvOpen && troubleFvOpen) {
          setScenario5Phase('foreline');
          setScenario5BackflowWarning(false);
          if (!scenario5Found) {
            if (troublePressure > 5e-4) {
              setTroublePressure(prev => Math.max(5e-4, prev * 0.92));
            } else {
              setTroublePressure(prev => 5e-4 + (Math.random() - 0.5) * 1e-5);
            }
          } else {
            setTroublePressure(prev => Math.max(1e-6, prev * 0.9));
            if (troublePressure < 1e-5) setTroubleSuccess(true);
          }
        } else if (troubleRvOpen && troubleFvOpen) {
          setScenario5Phase('switching');
          setScenario5BackflowWarning(true);
          setTroublePressure(prev => Math.min(0.5, prev * 1.15));
        } else {
          setScenario5Phase('switching');
          setScenario5BackflowWarning(false);
          setTroublePressure(prev => Math.min(0.1, prev * 1.02));
        }
        if (troubleFvOpen && troubleTmpOn) {
          setTroubleForelinePressure(prev => scenario5Found ? Math.max(0.001, prev * 0.95) : 0.05 + Math.random() * 0.02);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [troubleStarted, troubleTriggered, troubleScenario, troubleTmpOn, troubleFvOpen, troubleApcOpen, troubleRvOpen, troubleSuccess, troubleFailed, tmpTemperature, dryPumpCurrent, dryPumpOn, scenario2Step, gasLineN2, gasLineAr, gasLineO2, gasLineMain, leakSource, rfOn, rfBreaker, gasSupplyMain, sih4Valve, sih4Flow, matcherTemp, scenario4Step, evacuating, scenario5Found, troublePressure]);

  // SVG diagrams for each theory step
  const getTheorySVG = (step) => {
    switch(step) {
      case 0: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="vac_bg0" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#vac_bg0)" rx="12"/>
          <text x="200" y="30" textAnchor="middle" fill="#fbbf24" fontSize="17" fontWeight="bold">진공 압력 범위</text>
          <rect x="20" y="48" width="360" height="40" rx="6" fill="rgba(239,68,68,0.15)" stroke="#ef4444"/>
          <text x="30" y="72" fill="#fca5a5" fontSize="14" fontWeight="bold">대기압</text>
          <text x="200" y="72" textAnchor="middle" fill="#e2e8f0" fontSize="13">760 Torr (1 atm)</text>
          <text x="200" y="100" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="20" y="108" width="360" height="40" rx="6" fill="rgba(251,146,60,0.15)" stroke="#fb923c"/>
          <text x="30" y="132" fill="#fdba74" fontSize="14" fontWeight="bold">저진공</text>
          <text x="200" y="132" textAnchor="middle" fill="#e2e8f0" fontSize="13">760 ~ 1 Torr</text>
          <text x="200" y="160" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="20" y="168" width="360" height="40" rx="6" fill="rgba(59,130,246,0.15)" stroke="#3b82f6"/>
          <text x="30" y="192" fill="#93c5fd" fontSize="14" fontWeight="bold">중진공</text>
          <text x="200" y="192" textAnchor="middle" fill="#e2e8f0" fontSize="13">1 ~ 10⁻³ Torr</text>
          <text x="200" y="220" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="20" y="228" width="360" height="40" rx="6" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6"/>
          <text x="30" y="252" fill="#c4b5fd" fontSize="14" fontWeight="bold">고진공</text>
          <text x="200" y="252" textAnchor="middle" fill="#e2e8f0" fontSize="13">10⁻³ ~ 10⁻⁹ Torr</text>
          <text x="370" y="252" textAnchor="end" fill="#c4b5fd" fontSize="11">⭐ 반도체</text>
          <text x="200" y="280" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="20" y="288" width="360" height="40" rx="6" fill="rgba(34,211,238,0.15)" stroke="#22d3ee"/>
          <text x="30" y="312" fill="#67e8f9" fontSize="14" fontWeight="bold">초고진공</text>
          <text x="200" y="312" textAnchor="middle" fill="#e2e8f0" fontSize="13">{'<'} 10⁻⁹ Torr</text>
          <text x="370" y="312" textAnchor="end" fill="#67e8f9" fontSize="11">⭐ EUV</text>
        </svg>
      );
      case 1: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="vac_bg1" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#vac_bg1)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">2단계 진공 펌핑 시스템</text>
          <rect x="30" y="42" width="150" height="110" rx="8" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="105" y="62" textAnchor="middle" fill="#fdba74" fontSize="14" fontWeight="bold">1단계: Roughing</text>
          <rect x="55" y="72" width="100" height="40" rx="6" fill="#1e293b" stroke="#fb923c"/>
          <text x="105" y="90" textAnchor="middle" fill="#fdba74" fontSize="11">Rotary Vane</text>
          <text x="105" y="105" textAnchor="middle" fill="#fdba74" fontSize="11">Pump</text>
          <text x="105" y="130" textAnchor="middle" fill="#e2e8f0" fontSize="11">760 → 10⁻³ Torr</text>
          <text x="105" y="145" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="bold">빠른 배기</text>
          <text x="200" y="100" fill="#fbbf24" fontSize="20" textAnchor="middle">→</text>
          <rect x="220" y="42" width="150" height="110" rx="8" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="295" y="62" textAnchor="middle" fill="#c4b5fd" fontSize="14" fontWeight="bold">2단계: High Vac</text>
          <rect x="245" y="72" width="100" height="40" rx="6" fill="#1e293b" stroke="#8b5cf6"/>
          <text x="295" y="90" textAnchor="middle" fill="#c4b5fd" fontSize="11">Turbo Molecular</text>
          <text x="295" y="105" textAnchor="middle" fill="#c4b5fd" fontSize="11">Pump (TMP)</text>
          <text x="295" y="130" textAnchor="middle" fill="#e2e8f0" fontSize="11">10⁻³ → 10⁻⁹ Torr</text>
          <text x="295" y="145" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">극한 진공</text>
          <rect x="30" y="165" width="340" height="65" rx="8" fill="rgba(34,197,94,0.15)" stroke="#22c55e"/>
          <text x="200" y="185" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="bold">3단계: 압력 제어</text>
          <text x="200" y="205" textAnchor="middle" fill="#e2e8f0" fontSize="12">APC (Auto Pressure Controller) + Gate Valve</text>
          <text x="200" y="222" textAnchor="middle" fill="#86efac" fontSize="12">공정 압력 정밀 유지</text>
          <rect x="30" y="245" width="340" height="82" rx="8" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4"/>
          <text x="200" y="268" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">펌프 비교</text>
          <text x="40" y="290" fill="#fdba74" fontSize="12">🔧 Rotary: 기계적 압축 → 빠르지만 한계 있음</text>
          <text x="40" y="310" fill="#c4b5fd" fontSize="12">🚀 TMP: 60,000 RPM 회전 → 분자 운동량 전달</text>
        </svg>
      );
      case 2: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="vac_bg2" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#vac_bg2)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">진공 기술 발전 역사</text>
          <line x1="80" y1="45" x2="80" y2="270" stroke="#475569" strokeWidth="2"/>
          <circle cx="80" cy="65" r="8" fill="#fb923c" stroke="#fdba74" strokeWidth="2"/>
          <text x="100" y="60" fill="#fdba74" fontSize="14" fontWeight="bold">1970년대</text>
          <text x="100" y="78" fill="#e2e8f0" fontSize="12">μm 공정 · 10⁻⁵ Torr · 회전 펌프</text>
          <rect x="100" y="84" width="80" height="4" rx="2" fill="#fb923c" opacity="0.4"/>
          <circle cx="80" cy="120" r="8" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
          <text x="100" y="115" fill="#93c5fd" fontSize="14" fontWeight="bold">2000년대</text>
          <text x="100" y="133" fill="#e2e8f0" fontSize="12">90→32nm · 10⁻⁷ Torr · TMP+Cryo</text>
          <rect x="100" y="139" width="180" height="4" rx="2" fill="#3b82f6" opacity="0.4"/>
          <circle cx="80" cy="175" r="8" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2"/>
          <text x="100" y="170" fill="#c4b5fd" fontSize="14" fontWeight="bold">2020년대</text>
          <text x="100" y="188" fill="#e2e8f0" fontSize="12">3nm EUV · 10⁻⁹ Torr · 극한 진공</text>
          <rect x="100" y="194" width="290" height="4" rx="2" fill="#8b5cf6" opacity="0.4"/>
          <rect x="30" y="215" width="340" height="55" rx="8" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="0.5"/>
          <text x="200" y="235" textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="bold">핵심 응용</text>
          <text x="40" y="255" fill="#e2e8f0" fontSize="12">EUV 노광 | 원자층 증착(ALD) | 이온 주입</text>
          <rect x="30" y="280" width="340" height="48" rx="8" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4"/>
          <text x="200" y="300" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">📈 50년간 진공도 1만 배↑</text>
          <text x="200" y="320" textAnchor="middle" fill="#e2e8f0" fontSize="12">💰 진공 시스템 = 장비 가격의 30% (수십억 원)</text>
        </svg>
      );
      case 3: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="vac_bg3" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#vac_bg3)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">진공 응용 분야</text>
          <circle cx="200" cy="170" r="38" fill="rgba(14,165,233,0.3)" stroke="#0ea5e9" strokeWidth="2"/>
          <text x="200" y="166" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">진공</text>
          <text x="200" y="182" textAnchor="middle" fill="#7dd3fc" fontSize="11">Vacuum</text>
          <line x1="170" y1="140" x2="85" y2="68" stroke="#f87171" strokeWidth="1.5"/>
          <rect x="15" y="42" width="130" height="42" rx="6" fill="rgba(239,68,68,0.15)" stroke="#f87171"/>
          <text x="80" y="60" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="bold">1. 박막 증착</text>
          <text x="80" y="76" textAnchor="middle" fill="#e2e8f0" fontSize="10">CVD, PVD, ALD</text>
          <line x1="230" y1="140" x2="315" y2="68" stroke="#60a5fa" strokeWidth="1.5"/>
          <rect x="255" y="42" width="130" height="42" rx="6" fill="rgba(59,130,246,0.15)" stroke="#60a5fa"/>
          <text x="320" y="60" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="bold">2. 플라즈마 에칭</text>
          <text x="320" y="76" textAnchor="middle" fill="#e2e8f0" fontSize="10">RIE, ICP</text>
          <line x1="162" y1="170" x2="70" y2="170" stroke="#4ade80" strokeWidth="1.5"/>
          <rect x="5" y="149" width="120" height="42" rx="6" fill="rgba(34,197,94,0.15)" stroke="#4ade80"/>
          <text x="65" y="167" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="bold">3. 이온 주입</text>
          <text x="65" y="183" textAnchor="middle" fill="#e2e8f0" fontSize="10">10⁻⁶ Torr</text>
          <line x1="238" y1="170" x2="330" y2="170" stroke="#fbbf24" strokeWidth="1.5"/>
          <rect x="275" y="149" width="120" height="42" rx="6" fill="rgba(251,191,36,0.15)" stroke="#fbbf24"/>
          <text x="335" y="167" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="bold">4. EUV 노광</text>
          <text x="335" y="183" textAnchor="middle" fill="#e2e8f0" fontSize="10">10⁻⁸ Torr↓</text>
          <line x1="200" y1="208" x2="200" y2="275" stroke="#c084fc" strokeWidth="1.5"/>
          <rect x="115" y="278" width="170" height="42" rx="6" fill="rgba(192,132,252,0.15)" stroke="#c084fc"/>
          <text x="200" y="296" textAnchor="middle" fill="#d8b4fe" fontSize="13" fontWeight="bold">5. 검사/분석</text>
          <text x="200" y="312" textAnchor="middle" fill="#e2e8f0" fontSize="10">SEM, SIMS</text>
        </svg>
      );
      case 4: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="vac_bg4" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#vac_bg4)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">시뮬레이터 학습 로드맵</text>
          <rect x="25" y="42" width="350" height="42" rx="8" fill="rgba(59,130,246,0.15)" stroke="#3b82f6"/>
          <circle cx="50" cy="63" r="14" fill="#3b82f6" opacity="0.8"/><text x="50" y="68" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">1</text>
          <text x="74" y="58" fill="#93c5fd" fontSize="13" fontWeight="bold">실시간 펌핑 시뮬레이션</text>
          <text x="74" y="74" fill="#cbd5e1" fontSize="10">760→10⁻⁹ Torr 압력 변화 체험</text>
          <text x="200" y="95" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="25" y="100" width="350" height="42" rx="8" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6"/>
          <circle cx="50" cy="121" r="14" fill="#8b5cf6" opacity="0.8"/><text x="50" y="126" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">2</text>
          <text x="74" y="116" fill="#c4b5fd" fontSize="13" fontWeight="bold">성능 특성 곡선 분석</text>
          <text x="74" y="132" fill="#cbd5e1" fontSize="10">4가지 펌프 모델 비교</text>
          <text x="200" y="153" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="25" y="158" width="350" height="42" rx="8" fill="rgba(249,115,22,0.15)" stroke="#f97316"/>
          <circle cx="50" cy="179" r="14" fill="#f97316" opacity="0.8"/><text x="50" y="184" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">3</text>
          <text x="74" y="174" fill="#fdba74" fontSize="13" fontWeight="bold">공정 압력 세팅 실험</text>
          <text x="74" y="190" fill="#cbd5e1" fontSize="10">APC 정밀 압력 제어</text>
          <text x="200" y="211" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="25" y="216" width="350" height="42" rx="8" fill="rgba(236,72,153,0.15)" stroke="#ec4899"/>
          <circle cx="50" cy="237" r="14" fill="#ec4899" opacity="0.8"/><text x="50" y="242" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">4</text>
          <text x="74" y="232" fill="#f9a8d4" fontSize="13" fontWeight="bold">Conductance & 압력 관계</text>
          <text x="74" y="248" fill="#cbd5e1" fontSize="10">Q = S × P 실시간 시각화</text>
          <text x="200" y="269" textAnchor="middle" fill="#fbbf24" fontSize="14">▼</text>
          <rect x="25" y="274" width="350" height="42" rx="8" fill="rgba(34,197,94,0.15)" stroke="#22c55e"/>
          <circle cx="50" cy="295" r="14" fill="#22c55e" opacity="0.8"/><text x="50" y="300" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">5</text>
          <text x="74" y="290" fill="#86efac" fontSize="13" fontWeight="bold">배관 설계 최적화</text>
          <text x="74" y="306" fill="#cbd5e1" fontSize="10">1/Seff = 1/Spump + 1/C</text>
        </svg>
      );
      default: return null;
    }
  };

  // Theory Tab Component
  const TheoryTab = () => (
    <div className="space-y-6">
      {!showDetailedTheory ? (
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-2xl p-8 text-white min-h-[600px] flex flex-col">
          {!isTheoryPlaying ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-4xl font-bold mb-4">진공 시스템 시뮬레이터</h2>
              <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                반도체 공정의 핵심, 진공 기술의 세계로 초대합니다!<br/>
                <span className="text-yellow-300 font-bold">5단계 스토리텔링</span>으로 쉽고 재미있게 배워보세요!
              </p>
              <button
                onClick={startTheoryAnimation}
                className="mt-8 bg-white text-blue-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3"
              >
                <PlayIcon />
                시작하기
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-100">
                    진행률: {Math.round(((theoryStep + 1) / theorySteps.length) * 100)}%
                  </span>
                  <span className="text-sm font-medium text-blue-100">
                    {theoryStep + 1} / {theorySteps.length}
                  </span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-300 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((theoryStep + 1) / theorySteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Content - Two Column Layout */}
              <div className="flex-1 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-6 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{theorySteps[theoryStep].icon}</span>
                  <h3 className="text-2xl font-bold text-yellow-300">{theorySteps[theoryStep].title}</h3>
                </div>

                <div className="flex gap-5">
                  {/* Left: SVG Diagram */}
                  <div className="w-1/2 flex-shrink-0">
                    {getTheorySVG(theoryStep)}
                  </div>

                  {/* Right: Text Content */}
                  <div className="w-1/2 overflow-y-auto max-h-[450px]">
                    <div className="text-base leading-relaxed mb-4 whitespace-pre-line">
                      {typedText}
                      {typedText.length < theorySteps[theoryStep].content.length && (
                        <span className="inline-block w-1 h-5 bg-yellow-300 ml-1 animate-pulse" />
                      )}
                    </div>

                    {typedText.length === theorySteps[theoryStep].content.length && (
                      <div className="mt-4 p-3 bg-yellow-400 bg-opacity-20 border-l-4 border-yellow-300 rounded">
                        <p className="text-yellow-100 font-medium text-sm">
                          💡 {theorySteps[theoryStep].highlight}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={stopTheoryAnimation}
                  className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <PauseIcon />
                  처음으로
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={prevTheoryStep}
                    disabled={theoryStep === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      theoryStep === 0
                        ? 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                        : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                    }`}
                  >
                    ← 이전
                  </button>

                  {theoryStep < theorySteps.length - 1 ? (
                    <button
                      onClick={nextTheoryStep}
                      className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      다음 →
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowDetailedTheory(true)}
                      className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <LightbulbIcon />
                      상세 이론 보기
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">진공 기술 상세 이론</h2>
            <button
              onClick={() => setShowDetailedTheory(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← 애니메이션으로 돌아가기
            </button>
          </div>

          <div className="space-y-8">
            {theorySteps.map((step, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{step.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                  {step.content}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    💡 {step.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* 상단 탭 네비게이션 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Theory Tab */}
          {activeTab === 'theory' && <TheoryTab />}

          {/* 테마 1: 실시간 펌핑 시뮬레이션 */}
          {activeTab === 'pumping-simulation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white rounded-lg p-4 border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-indigo-800">DRY PUMP WITH TMP 시뮬레이션</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${!isManualMode ? 'font-bold text-blue-600' : 'text-gray-500'}`}>자동</span>
                    <button onClick={() => {
                      setIsManualMode(!isManualMode);
                      handleReset();
                    }}
                      className={`w-12 h-6 rounded-full transition-colors ${isManualMode ? 'bg-green-500' : 'bg-blue-500'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isManualMode ? 'translate-x-6' : 'translate-x-0.5'}`}/>
                    </button>
                    <span className={`text-sm ${isManualMode ? 'font-bold text-green-600' : 'text-gray-500'}`}>수동</span>
                  </div>
                </div>

                {/* 모드 설명 */}
                <div className={`mb-3 p-3 rounded-lg text-sm ${isManualMode ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                  {isManualMode ? (
                    <div className="text-green-800">
                      <span className="font-bold">🎮 수동 모드:</span> 실제 장비처럼 밸브를 직접 조작해보세요!
                      <span className="block mt-1 text-green-600">왜? → 진공 펌핑의 순서와 원리를 몸으로 익히기 위해. 잘못된 순서로 밸브를 열면 경고가 나옵니다.</span>
                    </div>
                  ) : (
                    <div className="text-blue-800">
                      <span className="font-bold">🤖 자동 모드:</span> 시스템이 최적의 순서로 자동 운전합니다.
                      <span className="block mt-1 text-blue-600">왜? → 전체 펌핑 과정을 한눈에 관찰하고 압력 변화 패턴을 이해하기 위해.</span>
                    </div>
                  )}
                </div>

                <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-2">
                  <svg width="100%" height="480" viewBox="0 0 500 480" className="max-w-xl mx-auto">
                    {/* 배경 그리드 */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ddd" strokeWidth="0.5"/>
                      </pattern>
                      <linearGradient id="chamberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a8e6cf"/>
                        <stop offset="100%" stopColor="#88d8b0"/>
                      </linearGradient>
                      <linearGradient id="tmpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffeaa7"/>
                        <stop offset="100%" stopColor="#fdcb6e"/>
                      </linearGradient>
                      <linearGradient id="dryPumpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fd79a8"/>
                        <stop offset="100%" stopColor="#e84393"/>
                      </linearGradient>
                      {/* TMP 블레이드 그라데이션 */}
                      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffeaa7"/>
                        <stop offset="50%" stopColor="#fdcb6e"/>
                        <stop offset="100%" stopColor="#e17055"/>
                      </linearGradient>
                      {/* 가스 입자 그라데이션 */}
                      <radialGradient id="gasParticle" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#74b9ff"/>
                        <stop offset="100%" stopColor="#0984e3"/>
                      </radialGradient>
                      <radialGradient id="gasParticleGreen" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#55efc4"/>
                        <stop offset="100%" stopColor="#00b894"/>
                      </radialGradient>
                    </defs>
                    <rect width="500" height="480" fill="url(#grid)"/>
                    {/* === CHAMBER === */}
                    <g>
                      <rect x="125" y="20" width="250" height="100" rx="8" fill="url(#chamberGrad)" stroke="#2d3436" strokeWidth="3"/>
                      <rect x="135" y="30" width="230" height="80" rx="4" fill="#fff" fillOpacity="0.3"/>
                      <ellipse cx="250" cy="90" rx="60" ry="8" fill="#636e72"/>
                      <ellipse cx="250" cy="88" rx="55" ry="6" fill="#b2bec3"/>
                      <rect x="180" y="35" width="140" height="12" rx="2" fill="#74b9ff"/>
                      {[...Array(10)].map((_, i) => <circle key={i} cx={190 + i * 14} cy="41" r="2" fill="#0984e3"/>)}
                      <text x="250" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2d3436">PROCESS CHAMBER</text>
                      <rect x="300" y="70" width="70" height="25" rx="4" fill="#2d3436"/>
                      <text x="335" y="88" textAnchor="middle" fontSize="11" fill="#00ff00" fontFamily="monospace">
                        {animationPressure >= 1 ? animationPressure.toFixed(1) : animationPressure.toExponential(1)}
                      </text>
                    </g>

                    {/* 메인 배관 (Chamber → APC) */}
                    <rect x="240" y="120" width="20" height="25" fill="#636e72"/>

                    {/* === APC VALVE === */}
                    <g>
                      <rect x="200" y="145" width="100" height="40" rx="4" fill={apcValveOpen ? "#00b894" : "#d63031"} stroke="#2d3436" strokeWidth="2"/>
                      <rect x="210" y="155" width="80" height="20" rx="2" fill="#fff" fillOpacity="0.2"/>
                      <text x="250" y="170" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">APC VALVE</text>
                      <rect x="215" y="175" width="70" height="6" rx="2" fill="#2d3436"/>
                      <rect x="215" y="175" width={apcValveOpen ? 70 : 0} height="6" rx="2" fill="#55efc4"/>
                      <text x="320" y="165" fontSize="10" fill="#636e72">{apcValveOpen ? "OPEN 100%" : "CLOSED"}</text>
                    </g>

                    {/* 배관 (APC → TMP) */}
                    <rect x="240" y="185" width="20" height="20" fill="#636e72"/>

                    {/* === TMP (Turbo Molecular Pump) === */}
                    <g>
                      <rect x="150" y="205" width="200" height="100" rx="6" fill="url(#tmpGrad)" stroke="#2d3436" strokeWidth="3"/>
                      <rect x="160" y="215" width="180" height="80" rx="4" fill="#fff" fillOpacity="0.3"/>
                      <text x="250" y="232" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2d3436">TURBO MOLECULAR PUMP</text>

                      {/* TMP 외부 케이싱 */}
                      <circle cx="250" cy="270" r="38" fill="#0a0a15" stroke="#2d3436" strokeWidth="3"/>
                      <circle cx="250" cy="270" r="34" fill="#1a1a2e" stroke="#16213e" strokeWidth="2"/>

                      {/* TMP 블레이드 - 다중 레이어 터빈 */}
                      <g transform="translate(250, 270)">
                        {/* 외부 블레이드 레이어 (8개) */}
                        <g>
                          {(isManualMode ? tmpOn : (isPlaying && apcValveOpen && turboSpeed > 0)) && (
                            <animateTransform attributeName="transform" type="rotate" from="0" to="360"
                              dur={turboSpeed > 100 ? "0.05s" : turboSpeed > 50 ? "0.1s" : "0.3s"} repeatCount="indefinite"/>
                          )}
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                            <path key={angle}
                              d={`M 0 0 L 8 -28 Q 12 -30 10 -26 L 4 -8 Z`}
                              transform={`rotate(${angle})`}
                              fill="url(#bladeGrad)"
                              stroke="#c9a227"
                              strokeWidth="0.5"
                            />
                          ))}
                        </g>

                        {/* 내부 블레이드 레이어 (6개) - 반대 방향 */}
                        <g>
                          {(isManualMode ? tmpOn : (isPlaying && apcValveOpen && turboSpeed > 0)) && (
                            <animateTransform attributeName="transform" type="rotate" from="360" to="0"
                              dur={turboSpeed > 100 ? "0.07s" : turboSpeed > 50 ? "0.14s" : "0.4s"} repeatCount="indefinite"/>
                          )}
                          {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <path key={angle}
                              d={`M 0 0 L 5 -18 Q 8 -20 6 -16 L 3 -5 Z`}
                              transform={`rotate(${angle})`}
                              fill="#e0b030"
                              stroke="#b8960f"
                              strokeWidth="0.5"
                            />
                          ))}
                        </g>

                        {/* 중심 허브 */}
                        <circle r="8" fill="#2d3436" stroke="#1a1a2e" strokeWidth="2"/>
                        <circle r="4" fill={(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) ? "#00ff00" : "#636e72"}>
                          {(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) && (
                            <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite"/>
                          )}
                        </circle>
                      </g>

                      {/* RPM/Speed 디스플레이 */}
                      <text x="365" y="240" fontSize="10" fill="#636e72">RPM</text>
                      <text x="365" y="255" fontSize="12" fill="#2d3436" fontWeight="bold">{(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) ? Math.round(turboSpeed * 200) : 0}</text>
                      <text x="365" y="275" fontSize="10" fill="#636e72">Speed</text>
                      <text x="365" y="290" fontSize="12" fill="#2d3436" fontWeight="bold">{Math.round(turboSpeed)} L/s</text>

                      {/* ON/OFF 인디케이터 */}
                      <circle cx="170" cy="290" r="8" fill={(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) ? "#00b894" : "#636e72"} stroke="#2d3436" strokeWidth="1">
                        {(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) && (
                          <animate attributeName="fill" values="#00b894;#55efc4;#00b894" dur="1s" repeatCount="indefinite"/>
                        )}
                      </circle>
                      <text x="182" y="294" fontSize="10" fill="#2d3436" fontWeight="bold">{(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) ? "ON" : "OFF"}</text>
                    </g>

                    {/* 배관 (TMP → Foreline Valve) */}
                    <rect x="240" y="305" width="20" height="15" fill="#636e72"/>

                    {/* === FORELINE VALVE === */}
                    <g>
                      <rect x="215" y="320" width="70" height="35" rx="4" fill={forelineValveOpen ? "#00b894" : "#d63031"} stroke="#2d3436" strokeWidth="2"/>
                      <text x="250" y="342" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">F/V</text>
                      <text x="300" y="340" fontSize="10" fill="#636e72">{forelineValveOpen ? "OPEN" : "CLOSED"}</text>
                    </g>

                    {/* 배관 (Foreline → Dry Pump) */}
                    <rect x="240" y="355" width="20" height="25" fill="#636e72"/>

                    {/* === ROUGHING LINE (좌측) === */}
                    <g>
                      <path d="M 125 70 L 80 70 L 80 200" fill="none" stroke="#636e72" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="55" y="200" width="50" height="40" rx="4" fill={roughingValveOpen ? "#00b894" : "#d63031"} stroke="#2d3436" strokeWidth="2"/>
                      <text x="80" y="225" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">R/V</text>
                      <text x="15" y="225" fontSize="9" fill="#636e72">{roughingValveOpen ? "OPEN" : "CLOSED"}</text>
                      <path d="M 80 240 L 80 410 L 150 410" fill="none" stroke="#636e72" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>

                    {/* === DRY PUMP === */}
                    <g>
                      <rect x="150" y="380" width="200" height="90" rx="8" fill="url(#dryPumpGrad)" stroke="#2d3436" strokeWidth="3"/>
                      <rect x="160" y="390" width="180" height="70" rx="4" fill="#fff" fillOpacity="0.2"/>
                      <text x="250" y="415" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">DRY PUMP</text>
                      <text x="250" y="432" textAnchor="middle" fontSize="11" fill="white">Edwards nXDS Series</text>
                      <circle cx="200" cy="450" r="12" fill="#2d3436"/>
                      {(roughingValveOpen || (forelineValveOpen && (isManualMode ? tmpOn : (isPlaying && apcValveOpen)))) && isPlaying && (
                        <g transform="translate(200, 450)">
                          <animateTransform attributeName="transform" type="rotate" values="0;360" dur="0.3s" repeatCount="indefinite"/>
                          <line x1="-8" y1="0" x2="8" y2="0" stroke="#fd79a8" strokeWidth="3"/>
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#fd79a8" strokeWidth="3"/>
                        </g>
                      )}
                      <text x="250" y="455" fontSize="10" fill="white">{animationSpeed} m³/h</text>
                      <rect x="350" y="415" width="30" height="20" fill="#636e72"/>
                      <text x="400" y="430" fontSize="10" fill="#636e72">→ Exhaust</text>
                    </g>

                    {/* === FORELINE PRESSURE GAUGE === */}
                    <g>
                      <circle cx="300" cy="375" r="20" fill="#2d3436" stroke="#636e72" strokeWidth="2"/>
                      <circle cx="300" cy="375" r="15" fill="#1a1a2e"/>
                      <text x="300" y="373" textAnchor="middle" fontSize="8" fill="#00ff00" fontFamily="monospace">
                        {forelinePressure >= 1 ? forelinePressure.toFixed(1) : forelinePressure.toFixed(2)}
                      </text>
                      <text x="300" y="383" textAnchor="middle" fontSize="6" fill="#00ff00">Torr</text>
                      <text x="335" y="380" fontSize="9" fill="#636e72">Foreline</text>
                    </g>
                        
                    {/* === 플로우 애니메이션 - 러핑 라인 (다중 입자) === */}
                    {isPlaying && roughingValveOpen && !apcValveOpen && (
                      <g>
                        {/* 챔버 내 가스 분자들 */}
                        {[...Array(8)].map((_, i) => (
                          <circle key={`chamber-gas-${i}`} r={2 + Math.random()} fill="url(#gasParticle)" opacity={0.7}>
                            <animateMotion
                              dur={`${1.5 + i * 0.2}s`}
                              repeatCount="indefinite"
                              begin={`${i * 0.15}s`}
                              path="M 180 60 Q 200 50 220 65 Q 250 80 280 60 Q 300 45 320 70 Q 340 90 300 85 Q 260 75 220 85 Q 180 95 180 60"
                            />
                          </circle>
                        ))}
                        {/* 러핑 라인으로 빠져나가는 입자들 */}
                        {[...Array(12)].map((_, i) => (
                          <circle key={`roughing-${i}`} r={3 - i * 0.15} fill="url(#gasParticle)" opacity={0.8 - i * 0.03}>
                            <animateMotion
                              dur={`${1.8 + i * 0.1}s`}
                              repeatCount="indefinite"
                              begin={`${i * 0.15}s`}
                              path="M 125 70 L 80 70 L 80 200 L 80 410 L 200 410"
                            />
                          </circle>
                        ))}
                        {/* 드라이펌프로 들어가는 입자들 */}
                        {[...Array(6)].map((_, i) => (
                          <circle key={`dry-pump-${i}`} r={2} fill="#fd79a8" opacity={0.6}>
                            <animateMotion
                              dur="0.8s"
                              repeatCount="indefinite"
                              begin={`${i * 0.13}s`}
                              path="M 200 410 L 250 420 L 250 450"
                            />
                          </circle>
                        ))}
                      </g>
                    )}

                    {/* === 플로우 애니메이션 - TMP 라인 (다중 입자) === */}
                    {isPlaying && apcValveOpen && forelineValveOpen && (isManualMode ? tmpOn : true) && turboSpeed > 50 && (
                      <g>
                        {/* 챔버에서 APC로 빠져나가는 입자들 */}
                        {[...Array(10)].map((_, i) => (
                          <circle key={`apc-flow-${i}`} r={2.5 - i * 0.1} fill="url(#gasParticleGreen)" opacity={0.8}>
                            <animateMotion
                              dur={`${0.6 + i * 0.05}s`}
                              repeatCount="indefinite"
                              begin={`${i * 0.06}s`}
                              path="M 250 100 L 250 145 L 250 165"
                            />
                          </circle>
                        ))}
                        {/* TMP 통과하는 입자들 (빠른 속도) */}
                        {[...Array(15)].map((_, i) => (
                          <circle key={`tmp-flow-${i}`} r={2} fill="url(#gasParticleGreen)" opacity={0.9 - i * 0.03}>
                            <animateMotion
                              dur={`${0.4 + i * 0.02}s`}
                              repeatCount="indefinite"
                              begin={`${i * 0.027}s`}
                              path="M 250 185 L 250 250 L 250 305"
                            />
                          </circle>
                        ))}
                        {/* 포라인으로 빠져나가는 입자들 */}
                        {[...Array(8)].map((_, i) => (
                          <circle key={`foreline-flow-${i}`} r={2} fill="#55efc4" opacity={0.7}>
                            <animateMotion
                              dur={`${0.5 + i * 0.05}s`}
                              repeatCount="indefinite"
                              begin={`${i * 0.06}s`}
                              path="M 250 355 L 250 410 L 250 440"
                            />
                          </circle>
                        ))}
                      </g>
                    )}

                    {/* === 챔버 내 잔류 가스 분자 (압력에 따라 밀도 변화) === */}
                    {isPlaying && animationPressure > 0.001 && (
                      <g>
                        {[...Array(Math.min(20, Math.ceil(Math.log10(animationPressure + 1) * 5 + 10)))].map((_, i) => (
                          <circle
                            key={`residual-${i}`}
                            r={1.5}
                            fill="#74b9ff"
                            opacity={0.4}
                          >
                            <animateMotion
                              dur={`${2 + (i % 5) * 0.5}s`}
                              repeatCount="indefinite"
                              begin={`${(i * 0.3) % 2}s`}
                              path={`M ${150 + (i * 17) % 200} ${40 + (i * 13) % 60} Q ${180 + (i * 23) % 140} ${50 + (i * 7) % 50} ${160 + (i * 19) % 180} ${35 + (i * 11) % 70} T ${150 + (i * 17) % 200} ${40 + (i * 13) % 60}`}
                            />
                          </circle>
                        ))}
                      </g>
                    )}
                  </svg>

                  {/* 상태 표시 오버레이 */}
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white px-3 py-1 rounded text-sm font-mono">
                    {formatTime(elapsedTime)} | {currentPhase}
                  </div>
                  <div className="absolute top-2 right-2 bg-gray-800 text-green-400 px-3 py-1 rounded text-sm font-mono">
                    {getVacuumStage(animationPressure)}
                  </div>
                </div>

                {/* 컨트롤 패널 */}
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  {isManualMode ? (
                    <div className="space-y-3">
                      {/* 현재 단계 지시사항 */}
                      <div className={`p-3 rounded-lg border-2 ${manualStep === 5 && stepCompleted[5] ? 'bg-green-900 border-green-500' : 'bg-blue-900 border-blue-500'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">STEP {manualStep + 1}/6</span>
                          {stepCompleted[manualStep] && <span className="text-green-400">✓</span>}
                        </div>
                        <p className="text-white text-sm">{manualSteps[manualStep]?.instruction}</p>
                        {manualStep === 1 && (
                          <div className="mt-2 bg-black/30 rounded p-2">
                            <div className="flex justify-between text-xs text-gray-300">
                              <span>현재: {animationPressure.toFixed(2)} Torr</span>
                              <span>목표: 0.1 Torr</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                              <div className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.max(0, Math.min(100, (1 - Math.log10(animationPressure) / Math.log10(760)) * 100))}%` }}/>
                            </div>
                          </div>
                        )}
                        {manualStep === 5 && !stepCompleted[5] && (
                          <div className="mt-2 bg-black/30 rounded p-2">
                            <div className="flex justify-between text-xs text-gray-300">
                              <span>현재: {animationPressure.toExponential(1)} Torr</span>
                              <span>목표: 10⁻⁵ Torr</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                              <div className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.max(0, Math.min(100, (5 + Math.log10(animationPressure)) / 5 * 100))}%` }}/>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 제어 버튼 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button onClick={() => handleValveWithWarning('R/V', !roughingValveOpen, setRoughingValveOpen)}
                          disabled={!isPlaying}
                          className={`p-3 rounded-lg font-bold text-sm transition relative ${roughingValveOpen ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'} ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
                          R/V {roughingValveOpen ? 'OPEN' : 'CLOSE'}
                          {manualStep === 0 && !stepCompleted[0] && isPlaying && <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"/>}
                          {manualStep === 2 && roughingValveOpen && isPlaying && <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"/>}
                        </button>
                        <button onClick={() => handleValveWithWarning('APC', !apcValveOpen, setApcValveOpen)}
                          disabled={!isPlaying}
                          className={`p-3 rounded-lg font-bold text-sm transition relative ${apcValveOpen ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'} ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
                          APC {apcValveOpen ? 'OPEN' : 'CLOSE'}
                          {manualStep === 2 && !apcValveOpen && !roughingValveOpen && isPlaying && <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"/>}
                        </button>
                        <button onClick={() => handleValveWithWarning('F/V', !forelineValveOpen, setForelineValveOpen)}
                          disabled={!isPlaying}
                          className={`p-3 rounded-lg font-bold text-sm transition relative ${forelineValveOpen ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'} ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
                          F/V {forelineValveOpen ? 'OPEN' : 'CLOSE'}
                          {manualStep === 3 && !stepCompleted[3] && isPlaying && <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"/>}
                        </button>
                        <button onClick={() => handleValveWithWarning('TMP', !tmpOn, setTmpOn)}
                          disabled={!isPlaying}
                          className={`p-3 rounded-lg font-bold text-sm transition relative ${tmpOn ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-300'} ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
                          TMP {tmpOn ? 'ON' : 'OFF'}
                          {manualStep === 4 && !stepCompleted[4] && isPlaying && <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"/>}
                        </button>
                      </div>

                      {/* 시작/리셋 버튼 */}
                      <div className="flex gap-2">
                        <button onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying) addLog("시뮬레이션 시작", "system"); }}
                          className={`flex-1 py-2 rounded font-bold ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                          {isPlaying ? '⏸️ 일시정지' : '▶️ 시뮬레이션 시작'}
                        </button>
                        <button onClick={handleReset} className="px-4 py-2 bg-gray-500 text-white rounded font-bold">🔄</button>
                      </div>

                      {/* 경고 메시지 */}
                      {tmpOn && !forelineValveOpen && (
                        <div className="bg-red-500 text-white p-2 rounded text-sm animate-pulse">
                          ⚠️ 경고: TMP 작동 중 F/V가 닫혀있습니다! 과열 위험!
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center gap-4">
                      <button onClick={handlePlayPause}
                        className={`px-8 py-3 rounded-lg font-bold text-lg ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {isPlaying ? '⏸️ 정지' : '▶️ 자동 시퀀스 시작'}
                      </button>
                      <button onClick={handleReset} className="px-6 py-3 bg-gray-500 text-white rounded-lg font-bold">🔄 리셋</button>
                    </div>
                  )}
                </div>
              </div>

              {/* 우측 패널 */}
              <div className="space-y-4">
                {/* 로그 창 - 수동모드에서만 표시 */}
                {isManualMode && (
                  <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="bg-gray-800 px-3 py-2 border-b border-gray-700 flex justify-between items-center">
                      <span className="text-green-400 font-mono text-sm">📟 System Log</span>
                      <span className="text-gray-500 text-xs">{logMessages.length} messages</span>
                    </div>
                    <div className="h-48 overflow-y-auto p-2 font-mono text-xs space-y-1">
                      {logMessages.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">시뮬레이션을 시작하면 로그가 표시됩니다</p>
                      ) : (
                        logMessages.map((log) => (
                          <div key={log.id} className={`flex gap-2 ${
                            log.type === 'error' ? 'text-red-400' :
                            log.type === 'warning' ? 'text-yellow-400' :
                            log.type === 'success' ? 'text-green-400' :
                            log.type === 'complete' ? 'text-cyan-400 font-bold' :
                            log.type === 'action' ? 'text-blue-400' :
                            'text-gray-400'
                          }`}>
                            <span className="text-gray-600">[{log.time}]</span>
                            <span>{log.msg}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 단계 진행 표시 - 수동모드에서만 */}
                {isManualMode && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-3 text-gray-800">📋 진행 상황</h4>
                    <div className="space-y-2">
                      {manualSteps.map((step, idx) => (
                        <div key={step.id} className={`flex items-center gap-2 p-2 rounded text-sm ${
                          idx === manualStep ? 'bg-blue-100 border border-blue-300' :
                          stepCompleted[idx] ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            stepCompleted[idx] ? 'bg-green-500 text-white' :
                            idx === manualStep ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {stepCompleted[idx] ? '✓' : idx + 1}
                          </span>
                          <span className={`flex-1 ${stepCompleted[idx] ? 'text-green-700' : idx === manualStep ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
                            {step.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-bold mb-3 text-gray-800">📊 실시간 모니터링</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span>챔버 압력</span>
                      <span className="font-mono font-bold text-blue-600">
                        {animationPressure >= 1 ? animationPressure.toFixed(1) : animationPressure.toExponential(2)} Torr
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-50 rounded">
                      <span>TMP 속도</span>
                      <span className="font-mono font-bold text-orange-600">{Math.round(turboSpeed)} L/s</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span>Foreline 압력</span>
                      <span className="font-mono font-bold text-purple-600">
                        {forelinePressure >= 1 ? forelinePressure.toFixed(1) : forelinePressure.toFixed(2)} Torr
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>진공 단계</span>
                      <span className="font-bold text-green-600">{getVacuumStage(animationPressure)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-bold mb-3 text-gray-800">🎛️ 밸브 상태</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={`p-2 rounded text-center ${roughingValveOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      R/V: {roughingValveOpen ? 'OPEN' : 'CLOSE'}
                    </div>
                    <div className={`p-2 rounded text-center ${apcValveOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      APC: {apcValveOpen ? 'OPEN' : 'CLOSE'}
                    </div>
                    <div className={`p-2 rounded text-center ${forelineValveOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      F/V: {forelineValveOpen ? 'OPEN' : 'CLOSE'}
                    </div>
                    <div className={`p-2 rounded text-center ${(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                      TMP: {(isManualMode ? tmpOn : (isPlaying && apcValveOpen)) ? 'ON' : 'OFF'}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-bold mb-2 text-gray-800">⚙️ 챔버 설정</h4>
                  <label className="text-sm text-gray-600">체적 (L)</label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    value={chamberVolume}
                    onChange={handleChamberVolumeChange}
                    className="w-full h-3 bg-gradient-to-r from-indigo-200 to-purple-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-indigo-400"
                  />
                  <p className="text-center font-bold text-indigo-600 mt-1">{chamberVolume} L</p>
                </div>
              </div>
            </div>
          )}

          {/* 테마 2: 성능 특성 곡선 분석 */}
          {activeTab === 'performance-analysis' && (
            <div className="space-y-8">
              {/* 제목 */}
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <h2 className="text-2xl font-bold mb-4 text-emerald-800">성능 특성 곡선 분석</h2>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">목적과 이유</h4>
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    <strong>왜 성능 곡선을 분석해야 하는가?</strong><br/>
                    진공펌프를 선택하고 운전할 때 가장 중요한 데이터가 성능 특성 곡선입니다. 
                    단순히 "강력한 펌프"가 아니라 "어떤 압력에서 최적 성능을 내는 펌프"인지 파악해야 
                    효율적인 시스템 설계와 운전이 가능합니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 왼쪽: 차트와 조건 설정 */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 성능 곡선 그래프 */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">성능 특성 곡선</h3>
                    
                    <div className="h-80 relative">
                      {/* A사 펌프사양 라벨 */}
                      <div className="absolute top-2 left-2 bg-white border border-gray-300 rounded-lg p-2 z-10 shadow-sm">
                        <p className="text-sm font-bold text-gray-800">A사 펌프사양</p>
                        <p className="text-xs text-gray-600">최대: {pumpModels[Math.round(selectedModel)]?.maxSpeed} m³/h</p>
                      </div>
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={allModelData} 
                          margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
                          className="cursor-default"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="pressure" 
                            scale="log" 
                            domain={[0.02, 760]}
                            type="number"
                            tickCount={8}
                            label={{ value: '압력 (Torr) - 로그스케일', position: 'insideBottom', offset: -15 }}
                            tickFormatter={(value) => {
                              if (value >= 100) return `${value}`;
                              if (value >= 1) return `${value.toFixed(1)}`;
                              if (value >= 0.1) return `${value.toFixed(1)}`;
                              return `${value.toFixed(2)}`;
                            }}
                          />
                          <YAxis 
                            domain={[0, 8000]}
                            label={{ value: '배기속도 (m³/h)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value, name) => [
                              `${Math.round(value)} m³/h`,
                              name === 'model1' ? '모델 1 (소형)' :
                              name === 'model2' ? '모델 2 (중형)' :
                              name === 'model3' ? '모델 3 (대형)' :
                              name === 'model4' ? '모델 4 (초대형)' : name
                            ]}
                            labelFormatter={(value) => `압력: ${value} Torr`}
                          />
                          
                          {/* 4개 모델의 성능 곡선 */}
                          <Line 
                            type="monotone" 
                            dataKey="model1" 
                            stroke={pumpModels[1].color}
                            strokeWidth={selectedModel >= 1 && selectedModel < 1.5 ? 4 : 2}
                            dot={false}
                            name="모델 1"
                            opacity={selectedModel >= 1 && selectedModel < 1.5 ? 1 : 0.5}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="model2" 
                            stroke={pumpModels[2].color}
                            strokeWidth={selectedModel >= 1.5 && selectedModel < 2.5 ? 4 : 2}
                            dot={false}
                            name="모델 2"
                            opacity={selectedModel >= 1.5 && selectedModel < 2.5 ? 1 : 0.5}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="model3" 
                            stroke={pumpModels[3].color}
                            strokeWidth={selectedModel >= 2.5 && selectedModel < 3.5 ? 4 : 2}
                            dot={false}
                            name="모델 3"
                            opacity={selectedModel >= 2.5 && selectedModel < 3.5 ? 1 : 0.5}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="model4" 
                            stroke={pumpModels[4].color}
                            strokeWidth={selectedModel >= 3.5 && selectedModel <= 4 ? 4 : 2}
                            dot={false}
                            name="모델 4"
                            opacity={selectedModel >= 3.5 && selectedModel <= 4 ? 1 : 0.5}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      
                      {/* X축 위에 목표 압력 표시 */}
                      <div className="absolute inset-0 pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[{ pressure: targetPressure, xAxisMarker: 0 }]} margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
                            <XAxis dataKey="pressure" scale="log" domain={[0.02, 760]} type="number" hide />
                            <YAxis domain={[0, 8000]} hide />
                            <Line
                              type="monotone"
                              dataKey="xAxisMarker"
                              stroke="transparent"
                              strokeWidth={0}
                              dot={{ 
                                fill: '#dc2626', 
                                stroke: '#ffffff',
                                strokeWidth: 3, 
                                r: 8, 
                                fillOpacity: 0.9,
                                className: 'animate-pulse'
                              }}
                              isAnimationActive={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* 조건 설정 - 차트 바로 아래 */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3">펌프 조건 설정</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">목표 압력 설정 (Torr)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.5"
                          value={pressureToSliderValue(targetPressure)}
                          onChange={handleTargetPressureChange}
                          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pressureToSliderValue(targetPressure)}%, #e5e7eb ${pressureToSliderValue(targetPressure)}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>20mT</span>
                          <span>760T</span>
                        </div>
                        <div className="text-center mt-2">
                          <span className="font-bold text-red-600">
                            {targetPressure >= 100 ? targetPressure.toFixed(0) : 
                             targetPressure >= 1 ? targetPressure.toFixed(1) : 
                             targetPressure.toFixed(3)} Torr
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">챔버 체적 조정 (L)</label>
                        <input
                          type="range"
                          min="10"
                          max="1000"
                          step="10"
                          value={chamberVolume}
                          onChange={handleChamberVolumeChange}
                          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(chamberVolume - 10) / (1000 - 10) * 100}%, #e5e7eb ${(chamberVolume - 10) / (1000 - 10) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10L</span>
                          <span>1000L</span>
                        </div>
                        <div className="text-center mt-2">
                          <span className="font-bold text-indigo-600">{chamberVolume}L</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">A사 펌프 모델 선택</label>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          step="0.1"
                          value={selectedModel}
                          onChange={handleModelChange}
                          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(selectedModel - 1) / (4 - 1) * 100}%, #e5e7eb ${(selectedModel - 1) / (4 - 1) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>모델1</span>
                          <span>모델4</span>
                        </div>
                        <div className="text-center mt-2">
                          <span className="font-bold text-purple-600">
                            {pumpModels[Math.round(selectedModel)]?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 펌프 실용성 평가 */}
                    {(() => {
                      const assessment = getPumpEfficiencyAssessment();
                      return (
                        <div className={`mt-4 p-3 rounded border ${assessment.color}`}>
                          <h5 className="font-semibold mb-1">{assessment.message}</h5>
                          <div className="text-sm space-y-1">
                            <p>760 Torr → 1 Torr 도달시간: <strong>{assessment.time.toFixed(1)}분</strong></p>
                            <p>760 Torr → 20 mTorr 도달시간: <strong>{calculatePumpingTime(chamberVolume, 760, 0.02, pumpingSpeed).toFixed(1)}분</strong></p>
                            {assessment.status === 'very-slow' && (
                              <p className="text-xs">💡 더 큰 펌프나 다단계 펌핑 시스템 필요</p>
                            )}
                            {assessment.status === 'good' && (
                              <p className="text-xs">💡 이 펌프는 이 챔버에 최적입니다</p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 성능 곡선 해석 */}
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>빨간 점: 목표 압력 위치 (X축 위에 표시)</p>
                      <p>굵은 선: 현재 선택된 모델 (다른 모델들은 반투명)</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">성능 곡선 해석</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>X축 (압력):</strong> 진공챔버 안의 목표 압력</p>
                        <p><strong>Y축 (배기속도):</strong> 해당 압력에서 펌프의 최대 성능</p>
                        <p><strong>모델 비교:</strong> 더 큰 모델일수록 높은 배기속도</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">모델 선택 가이드</h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p><strong>소형 챔버(~100L):</strong> 모델 1-2 적합</p>
                        <p><strong>중형 챔버(100-500L):</strong> 모델 2-3 적합</p>
                        <p><strong>대형 챔버(500L+):</strong> 모델 3-4 적합</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 오른쪽: 상태 정보 */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-semibold mb-3">현재 상태</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">선택 모델:</span> 
                        <span className="ml-2 font-bold text-purple-600">
                          {pumpModels[Math.round(selectedModel)]?.name}
                        </span></p>
                      <p><span className="font-medium">목표 압력:</span> 
                        <span className="ml-2 font-bold text-blue-600">
                          {targetPressure >= 100 ? targetPressure.toFixed(0) : 
                           targetPressure >= 1 ? targetPressure.toFixed(1) : 
                           targetPressure.toFixed(3)} Torr
                        </span></p>
                      <p><span className="font-medium">배기속도:</span> 
                        <span className="ml-2 font-bold text-green-600">{pumpingSpeed} m³/h</span></p>
                      <p><span className="font-medium">진공도:</span> 
                        <span className="ml-2 font-semibold text-orange-600">{getVacuumLevel()}</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">모델 비교</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• <strong>모델 1:</strong> 최대 {pumpModels[1].maxSpeed} m³/h (소형 챔버용)</p>
                      <p>• <strong>모델 2:</strong> 최대 {pumpModels[2].maxSpeed} m³/h (표준형)</p>
                      <p>• <strong>모델 3:</strong> 최대 {pumpModels[3].maxSpeed} m³/h (대형 챔버용)</p>
                      <p>• <strong>모델 4:</strong> 최대 {pumpModels[4].maxSpeed} m³/h (초대형)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 더 생각해보기 섹션 */}
              <div className="lg:col-span-3 mt-8 bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">더 생각해보기</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-700 mb-2">토론 주제 1: 비용 대비 성능 최적화</h4>
                    <p className="text-emerald-600 mb-2">
                      A사의 4개 펌프 모델 중에서 500L 챔버용으로 선택해야 한다면, 
                      단순히 성능만이 아닌 구매비용, 운영비용, 유지보수비용을 종합적으로 고려한 
                      경제성 분석 기준을 제시하고 최적 모델을 선택하는 논리를 설명해보세요.
                    </p>
                    <p className="text-xs text-emerald-500">
                      힌트: 초기투자비, 전력비용, 교체주기, 가동률 등을 고려해보세요.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-700 mb-2">토론 주제 2: 다단계 펌핑 시스템 설계</h4>
                    <p className="text-emerald-600 mb-2">
                      단일 펌프로는 달성하기 어려운 초고진공(10⁻⁹ Torr)이 필요한 연구용 장비에서 
                      로터리 펌프 + 터보 펌프 + 이온 펌프의 3단계 시스템을 구성할 때, 
                      각 단계별 역할과 최적 연결 순서, 압력 범위를 설계해보세요.
                    </p>
                    <p className="text-xs text-emerald-500">
                      힌트: 각 펌프의 작동 압력 범위와 특성을 고려해보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 테마 3: 공정 압력 세팅 실험 */}
          {activeTab === 'process-control' && (
            <div className="space-y-8">
              {/* 제목 */}
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">공정 압력 세팅 실험</h2>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">목적과 이유</h4>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    <strong>왜 공정 압력 제어가 중요한가?</strong><br/>
                    실제 산업 공정에서는 단순히 진공을 만드는 것이 아니라, 특정 압력을 정밀하게 유지해야 합니다. 
                    반도체, 디스플레이, 코팅 공정 등에서 가스 유량과 압력의 관계를 이해하고 제어할 수 있어야 
                    품질 좋은 제품을 생산할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 왼쪽: 시스템 도식과 제어 */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 공정 시스템 개략도 */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">공정 시스템 개략도</h3>
                    <div className="flex justify-center">
                      <svg width="900" height="320" viewBox="0 0 900 320" className="border border-gray-300 bg-gray-50 rounded">
                        {/* 가스 공급 라인들 */}
                        <g>
                          {/* Ar 가스 */}
                          <rect x="30" y="40" width="60" height="35" fill="#e8f5e8" stroke="#4caf50" strokeWidth="2" rx="3"/>
                          <text x="60" y="55" textAnchor="middle" className="text-xs font-semibold">Ar Gas</text>
                          <text x="60" y="68" textAnchor="middle" className="text-xs">99.999%</text>
                          
                          {/* N2 가스 */}
                          <rect x="30" y="85" width="60" height="35" fill="#e8f5e8" stroke="#4caf50" strokeWidth="2" rx="3"/>
                          <text x="60" y="100" textAnchor="middle" className="text-xs font-semibold">N₂ Gas</text>
                          <text x="60" y="113" textAnchor="middle" className="text-xs">99.999%</text>
                          
                          {/* 가스 연결선 */}
                          <line x1="90" y1="57" x2="120" y2="57" stroke="#4caf50" strokeWidth="3"/>
                          <line x1="90" y1="102" x2="120" y2="102" stroke="#4caf50" strokeWidth="3"/>
                          <line x1="120" y1="57" x2="120" y2="80" stroke="#4caf50" strokeWidth="3"/>
                          <line x1="120" y1="102" x2="120" y2="80" stroke="#4caf50" strokeWidth="3"/>
                          <line x1="120" y1="80" x2="150" y2="80" stroke="#4caf50" strokeWidth="3"/>
                        </g>
                        
                        {/* MFC (Mass Flow Controller) */}
                        <g>
                          <rect x="150" y="60" width="70" height="40" fill="#fff3e0" stroke="#ff9800" strokeWidth="2" rx="3"/>
                          <text x="185" y="80" textAnchor="middle" className="text-xs font-semibold">MFC</text>
                          <circle cx="165" cy="90" r="3" fill="#ff9800"/>
                          <circle cx="205" cy="90" r="3" fill="#ff9800"/>
                        </g>
                        
                        {/* 가스 주입 라인 */}
                        <line x1="220" y1="80" x2="280" y2="80" stroke="#4caf50" strokeWidth="4"/>
                        <polygon points="275,75 285,80 275,85" fill="#4caf50"/>
                        
                        {/* 메인 진공 챔버 */}
                        <g>
                          <rect x="300" y="40" width="180" height="140" fill="#f5f5f5" stroke="#1976d2" strokeWidth="4" rx="8"/>
                          <rect x="310" y="50" width="160" height="120" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" rx="5"/>
                          
                          {/* 챔버 내부 기판 홀더 */}
                          <rect x="350" y="130" width="80" height="15" fill="#757575" stroke="#424242" strokeWidth="1" rx="2"/>
                          <text x="390" y="142" textAnchor="middle" className="text-xs">Substrate</text>
                          
                          {/* 가스 주입구 (샤워헤드) */}
                          <rect x="350" y="55" width="80" height="8" fill="#ff9800" stroke="#e65100" strokeWidth="1" rx="1"/>
                          <circle cx="360" cy="59" r="1" fill="#e65100"/>
                          <circle cx="370" cy="59" r="1" fill="#e65100"/>
                          <circle cx="380" cy="59" r="1" fill="#e65100"/>
                          <circle cx="390" cy="59" r="1" fill="#e65100"/>
                          <circle cx="400" cy="59" r="1" fill="#e65100"/>
                          <circle cx="410" cy="59" r="1" fill="#e65100"/>
                          <circle cx="420" cy="59" r="1" fill="#e65100"/>
                          
                          {/* 가스 연결선 (외부에서 샤워헤드로) */}
                          <line x1="285" y1="80" x2="350" y2="59" stroke="#4caf50" strokeWidth="3"/>
                        </g>
                        
                        {/* 바레트론 게이지 */}
                        <g>
                          <circle cx="420" cy="190" r="15" fill="#f8f9fa" stroke="#6c757d" strokeWidth="2"/>
                          <text x="420" y="187" textAnchor="middle" className="text-xs font-semibold">바레트론</text>
                          <text x="420" y="197" textAnchor="middle" className="text-xs">게이지</text>
                          <line x1="420" y1="175" x2="420" y2="180" stroke="#6c757d" strokeWidth="2"/>
                          <line x1="420" y1="175" x2="400" y2="170" stroke="#6c757d" strokeWidth="1"/>
                        </g>
                        
                        {/* 게이트 밸브 */}
                        <g>
                          <rect x="520" y="95" width="60" height="30" fill="#f5f5f5" stroke="#424242" strokeWidth="3" rx="3"/>
                          <g transform={`translate(550, 110)`}>
                            <circle cx="0" cy="0" r="10" fill="#757575" stroke="#424242" strokeWidth="2"/>
                            <line 
                              x1="0" y1="0" 
                              x2={10 * Math.cos((gateValveOpening / 100) * Math.PI / 2 - Math.PI / 2)} 
                              y2={10 * Math.sin((gateValveOpening / 100) * Math.PI / 2 - Math.PI / 2)} 
                              stroke="#424242" strokeWidth="2"
                            />
                          </g>
                          <text x="550" y="85" textAnchor="middle" className="text-xs font-semibold">Gate Valve</text>
                          <text x="550" y="145" textAnchor="middle" className="text-xs text-purple-600 font-bold">
                            {gateValveOpening.toFixed(0)}% Open
                          </text>
                        </g>
                        
                        {/* 터보분자펌프 (TMP) */}
                        <g>
                          <rect x="620" y="70" width="80" height="80" fill="#fff3e0" stroke="#f57c00" strokeWidth="3" rx="5"/>
                          <circle cx="660" cy="110" r="25" fill="none" stroke="#f57c00" strokeWidth="2"/>
                          
                          {/* 터보 블레이드 표현 */}
                          <line x1="645" y1="95" x2="675" y2="125" stroke="#f57c00" strokeWidth="2"/>
                          <line x1="675" y1="95" x2="645" y2="125" stroke="#f57c00" strokeWidth="2"/>
                          <line x1="660" y1="85" x2="660" y2="135" stroke="#f57c00" strokeWidth="2"/>
                          <line x1="635" y1="110" x2="685" y2="110" stroke="#f57c00" strokeWidth="2"/>
                          
                          <text x="660" y="60" textAnchor="middle" className="text-xs font-semibold">TMP</text>
                          <text x="660" y="165" textAnchor="middle" className="text-xs">24,000 rpm</text>
                        </g>
                        
                        {/* 로터리 펌프 (Dry Pump) */}
                        <g>
                          <rect x="740" y="110" width="80" height="60" fill="#fce4ec" stroke="#e91e63" strokeWidth="3" rx="5"/>
                          <ellipse cx="780" cy="140" rx="25" ry="15" fill="none" stroke="#e91e63" strokeWidth="2"/>
                          
                          {/* 로터 표현 */}
                          <ellipse cx="780" cy="140" rx="15" ry="8" fill="#e91e63" opacity="0.3"/>
                          <circle cx="780" cy="140" r="3" fill="#e91e63"/>
                          
                          <text x="780" y="100" textAnchor="middle" className="text-xs font-semibold">Dry Pump</text>
                          <text x="780" y="185" textAnchor="middle" className="text-xs">Edwards nXDS</text>
                        </g>
                        
                        {/* 대기 방출 */}
                        <g>
                          <line x1="820" y1="140" x2="860" y2="140" stroke="#666" strokeWidth="4"/>
                          <polygon points="860,135 870,140 860,145" fill="#666"/>
                          <text x="875" y="145" className="text-xs font-semibold">Exhaust</text>
                        </g>
                        
                        {/* 배관 연결들 */}
                        <line x1="480" y1="110" x2="520" y2="110" stroke="#666" strokeWidth="6"/>
                        <line x1="580" y1="110" x2="620" y2="110" stroke="#666" strokeWidth="6"/>
                        <line x1="700" y1="110" x2="720" y2="110" stroke="#666" strokeWidth="4"/>
                        <line x1="720" y1="110" x2="740" y2="140" stroke="#666" strokeWidth="4"/>
                        
                        {/* 압력 정보 박스들 */}
                        <g>
                          {/* 챔버 압력 정보 */}
                          <rect x="320" y="200" width="140" height="50" fill="#ffffff" stroke="#1976d2" strokeWidth="1" rx="3"/>
                          <text x="390" y="215" textAnchor="middle" className="text-xs font-semibold text-blue-800">Main Chamber</text>
                          <text x="390" y="228" textAnchor="middle" className="text-xs">Volume: {chamberVolume}L</text>
                          <text x="390" y="241" textAnchor="middle" className="text-xs text-blue-600 font-bold">
                            Process: {(fixedPressure * 1000).toFixed(1)} mTorr
                          </text>
                          
                          {/* MFC 정보 */}
                          <rect x="140" y="25" width="90" height="30" fill="#ffffff" stroke="#ff9800" strokeWidth="1" rx="3"/>
                          <text x="185" y="38" textAnchor="middle" className="text-xs font-semibold text-orange-800">Gas Flow</text>
                          <text x="185" y="50" textAnchor="middle" className="text-xs text-orange-600 font-bold">
                            {gasFlowRate.toFixed(1)} sccm
                          </text>
                          
                          {/* TMP 정보 */}
                          <rect x="610" y="25" width="100" height="30" fill="#ffffff" stroke="#f57c00" strokeWidth="1" rx="3"/>
                          <text x="660" y="38" textAnchor="middle" className="text-xs font-semibold text-orange-800">TMP Speed</text>
                          <text x="660" y="50" textAnchor="middle" className="text-xs text-orange-600 font-bold">
                            {Math.round(calculateTurboSpeed(fixedPressure) * (gateValveOpening / 100))} L/s
                          </text>
                          
                          {/* Dry Pump 정보 */}
                          <rect x="730" y="70" width="100" height="30" fill="#ffffff" stroke="#e91e63" strokeWidth="1" rx="3"/>
                          <text x="780" y="83" textAnchor="middle" className="text-xs font-semibold text-pink-800">Backing Pump</text>
                          <text x="780" y="95" textAnchor="middle" className="text-xs text-pink-600 font-bold">
                            20 m³/h
                          </text>
                        </g>
                        
                        {/* 압력 그라디언트 표시 */}
                        <g>
                          <text x="390" y="280" textAnchor="middle" className="text-xs text-gray-600">
                            Base Vacuum: 5.0×10⁻⁵ Torr
                          </text>
                          <text x="660" y="280" textAnchor="middle" className="text-xs text-gray-600">
                            Foreline: ~1 mTorr
                          </text>
                          <text x="780" y="280" textAnchor="middle" className="text-xs text-gray-600">
                            Outlet: Atmospheric
                          </text>
                        </g>
                        
                        {/* 화살표들 */}
                        <polygon points="275,75 285,80 275,85" fill="#4caf50"/>
                        <polygon points="510,105 520,110 510,115" fill="#666"/>
                        <polygon points="610,105 620,110 610,115" fill="#666"/>
                        <polygon points="730,105 740,110 730,115" fill="#666"/>
                      </svg>
                    </div>
                  </div>

                  {/* 공정 조건 설정 - 도식 바로 아래 */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3">공정 조건 설정</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">공정 가스 유량 (sccm)</label>
                        <input
                          type="number"
                          min="1"
                          max="10000"
                          step="1"
                          value={gasFlowRate}
                          onChange={handleGasFlowChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">게이트 밸브 개도 (%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={gateValveOpening}
                          onChange={handleGateValveChange}
                          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${gateValveOpening}%, #e5e7eb ${gateValveOpening}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="text-center mt-2">
                          <span className="font-bold text-purple-600">{gateValveOpening}% 개방</span>
                        </div>
                      </div>
                    </div>

                    {/* 경고 시스템 */}
                    {gasFlowRate > 5000 && (
                      <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <h5 className="font-semibold text-red-800 mb-2">⚠️ 위험 경고!</h5>
                        <div className="text-sm text-red-700">
                          <p><strong>과도한 가스 유량 ({gasFlowRate} sccm)</strong></p>
                          <p>• 펌프 과부하 위험</p>
                          <p>• 시스템 압력 급상승</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 시스템 구성 설명 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-1">Gas Supply</h4>
                      <p className="text-green-700">MFC로 정밀 유량 제어</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-1">Process Chamber</h4>
                      <p className="text-blue-700">바레트론 게이지로 압력 모니터링</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-1">TMP System</h4>
                      <p className="text-orange-700">게이트 밸브로 컨덕턴스 제어</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded border border-pink-200">
                      <h4 className="font-semibold text-pink-800 mb-1">Backing Pump</h4>
                      <p className="text-pink-700">TMP의 배압 펌프 역할</p>
                    </div>
                  </div>
                </div>
                
                {/* 오른쪽: 모니터링 */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border-2 border-blue-200">
                    <h4 className="font-semibold mb-3 text-blue-800">공정 모니터링</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">공정 가스 유량:</span> 
                        <span className="ml-2 font-bold text-red-600">{gasFlowRate.toFixed(1)} sccm</span></p>
                      <p><span className="font-medium">게이트 밸브 개도:</span> 
                        <span className="ml-2 font-bold text-purple-600">{gateValveOpening.toFixed(0)}%</span></p>
                      <p><span className="font-medium">공정 압력:</span> 
                        <span className="ml-2 font-bold text-blue-600">{(fixedPressure * 1000).toFixed(1)} mTorr</span></p>
                      <p><span className="font-medium">효과적 배기속도:</span> 
                        <span className="ml-2 font-bold text-green-600">
                          {Math.round(calculateTurboSpeed(fixedPressure) * (gateValveOpening / 100))} L/s
                        </span></p>
                      <p><span className="font-medium">공정 상태:</span> 
                        <span className="ml-2 font-semibold text-green-600">
                          베이스 진공 → {getFixedVacuumLevel()} (공정진공)
                        </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2">공정 제어 포인트</h4>
                    <div className="text-sm text-indigo-700 space-y-1">
                      <p>• MFC로 가스 유량 정밀 제어</p>
                      <p>• 게이트 밸브로 펌핑 속도 조절</p>
                      <p>• 바레트론 게이지로 실시간 모니터링</p>
                      <p>• 안정적인 공정 압력 유지</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 더 생각해보기 섹션 */}
              <div className="lg:col-span-3 mt-8 bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">더 생각해보기</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-amber-700 mb-2">토론 주제 1: 공정 안정성과 압력 제어</h4>
                    <p className="text-amber-600 mb-2">
                      반도체 증착 공정에서 목표 압력 5 mTorr에서 ±0.1 mTorr 이내로 유지해야 하는데, 
                      외부 환경 변화(온도, 습도, 전력 변동)와 장비 노화에 대응하는 
                      능동적 압력 제어 시스템을 설계한다면 어떤 요소들을 고려해야 할까요?
                    </p>
                    <p className="text-xs text-amber-500">
                      힌트: 피드백 제어, 예측 제어, 센서 정확도, 응답 시간 등을 고려해보세요.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-amber-700 mb-2">토론 주제 2: 예방정비 전략 수립</h4>
                    <p className="text-amber-600 mb-2">
                      24시간 연속 운전하는 생산라인에서 펌프 시스템의 예방정비 주기와 방법을 결정해야 합니다. 
                      생산 중단 최소화와 장비 신뢰성 확보를 동시에 만족하는 
                      데이터 기반 예방정비 전략을 수립해보세요.
                    </p>
                    <p className="text-xs text-amber-500">
                      힌트: 진동 모니터링, 온도 추이, 펌핑 성능 변화, 비용 분석 등을 고려해보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 테마 4: Conductance & 압력 관계 실험 */}
          {activeTab === 'conductance-relation' && (
            <div className="space-y-8">
              {/* 제목 */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h2 className="text-2xl font-bold mb-4 text-purple-800">Conductance & 압력 관계 실험</h2>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">목적과 이유</h4>
                  <p className="text-purple-700 text-sm leading-relaxed">
                    <strong>왜 Q=P×S 관계를 이해해야 하는가?</strong><br/>
                    진공 시스템에서 가장 기본이 되는 공식입니다. 가스 로드(Q), 압력(P), 펌핑 속도(S)의 관계를 
                    이해하면 원하는 압력을 얻기 위해 어떤 조건을 조절해야 하는지 직관적으로 알 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 왼쪽: Q=P×S 시각화와 설정 */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Q=P×S 시각화 */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Q = P × S 관계 시각화</h3>
                    
                    <div className="flex justify-center mb-6">
                      <svg width="600" height="320" viewBox="0 0 600 320" className="border border-gray-300 bg-gray-50 rounded">
                        {/* 공식 표시 */}
                        <text x="300" y="40" textAnchor="middle" className="text-2xl font-bold fill-blue-600">
                          Q = P × S
                        </text>
                        
                        {/* 가스 로드 박스와 바 */}
                        <rect x="50" y="80" width="120" height="80" fill="#e8f5e8" stroke="#4caf50" strokeWidth="3" rx="10"/>
                        <text x="110" y="100" textAnchor="middle" className="text-sm font-semibold">Gas Flow</text>
                        <text x="110" y="115" textAnchor="middle" className="text-lg font-bold text-green-600">Q</text>
                        <text x="110" y="135" textAnchor="middle" className="text-sm">{Math.round(gasLoad / 0.00950)} sccm</text>
                        <text x="110" y="150" textAnchor="middle" className="text-xs">({gasLoad.toFixed(1)} Torr·L/s)</text>
                        
                        {/* Q 값 표시 바 */}
                        <rect x="180" y="80" width="15" height="80" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" rx="2"/>
                        <rect 
                          x="182" 
                          y={160 - (gasLoad / 76 * 78)} 
                          width="11" 
                          height={gasLoad / 76 * 78} 
                          fill="#4caf50" 
                          rx="1"
                        />
                        
                        {/* 등호 */}
                        <text x="215" y="125" textAnchor="middle" className="text-2xl font-bold">=</text>
                        
                        {/* 압력 박스와 바 */}
                        <rect 
                          x="245" y="80" width="100" height="80" 
                          fill={getPressureColor(resultPressure)} 
                          stroke="#1976d2" strokeWidth="3" rx="10"
                        />
                        <text x="295" y="100" textAnchor="middle" className="text-sm font-semibold">Pressure</text>
                        <text x="295" y="115" textAnchor="middle" className="text-lg font-bold text-blue-600">P</text>
                        <text x="295" y="135" textAnchor="middle" className="text-sm">
                          {resultPressure >= 0.001 ? resultPressure.toFixed(3) : resultPressure.toExponential(2)}
                        </text>
                        <text x="295" y="150" textAnchor="middle" className="text-xs">Torr</text>
                        
                        {/* P 값 표시 바 */}
                        <rect x="355" y="80" width="15" height="80" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" rx="2"/>
                        <rect 
                          x="357" 
                          y={160 - Math.min(resultPressure * 800, 78)} 
                          width="11" 
                          height={Math.min(resultPressure * 800, 78)} 
                          fill="#1976d2" 
                          rx="1"
                        />
                        
                        {/* 곱하기 */}
                        <text x="390" y="125" textAnchor="middle" className="text-2xl font-bold">×</text>
                        
                        {/* 펌핑 속도 박스와 바 */}
                        <rect x="420" y="80" width="120" height="80" fill="#fff3e0" stroke="#f57c00" strokeWidth="3" rx="10"/>
                        <text x="480" y="100" textAnchor="middle" className="text-sm font-semibold">Pumping Speed</text>
                        <text x="480" y="115" textAnchor="middle" className="text-lg font-bold text-orange-600">S</text>
                        <text x="480" y="135" textAnchor="middle" className="text-sm">{systemPumpingSpeed}</text>
                        <text x="480" y="150" textAnchor="middle" className="text-xs">L/s</text>
                        
                        {/* S 값 표시 바 */}
                        <rect x="550" y="80" width="15" height="80" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" rx="2"/>
                        <rect 
                          x="552" 
                          y={160 - (systemPumpingSpeed / 2000 * 78)} 
                          width="11" 
                          height={systemPumpingSpeed / 2000 * 78} 
                          fill="#f57c00" 
                          rx="1"
                        />
                        
                        {/* 화살표와 설명 */}
                        <g>
                          <path d="M 110 180 Q 110 200 110 220" stroke="#4caf50" strokeWidth="2" fill="none"/>
                          <text x="110" y="240" textAnchor="middle" className="text-xs text-green-700">가스 발생량</text>
                          <text x="110" y="255" textAnchor="middle" className="text-xs text-green-700">↑증가 = 압력↑</text>
                        </g>
                        
                        <g>
                          <path d="M 450 180 Q 450 200 450 220" stroke="#f57c00" strokeWidth="2" fill="none"/>
                          <text x="450" y="240" textAnchor="middle" className="text-xs text-orange-700">펌프 성능</text>
                          <text x="450" y="255" textAnchor="middle" className="text-xs text-orange-700">↑증가 = 압력↓</text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* 실험 조건 설정 - 시각화 바로 아래 */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3">실험 조건 설정</h3>
                    
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Q = P × S에서 Q의 의미</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Q (가스 로드)</strong> = 시스템에 들어오는 총 가스량</p>
                        <p>• <strong>가스 유량 (sccm)</strong>: MFC로 주입하는 가스량</p>
                        <p>• <strong>변환:</strong> 1 sccm = 0.0095 Torr·L/s</p>
                        <p>• 가스 유량이 클수록 → Q 증가 → 압력 상승</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">가스 유량 (sccm)</label>
                        <input
                          type="range"
                          min="100"
                          max="8000"
                          step="50"
                          value={Math.round(gasLoad / 0.00950)}
                          onChange={(e) => setGasLoad(parseFloat(e.target.value) * 0.00950)}
                          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #4caf50 0%, #4caf50 ${(Math.round(gasLoad / 0.00950) - 100) / (8000 - 100) * 100}%, #e5e7eb ${(Math.round(gasLoad / 0.00950) - 100) / (8000 - 100) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>100</span>
                          <span>4000</span>
                          <span>8000</span>
                        </div>
                        <div className="text-center mt-2">
                          <span className="font-bold text-green-600">{Math.round(gasLoad / 0.00950)} sccm</span>
                          <span className="text-xs text-gray-500 ml-2">({gasLoad.toFixed(1)} Torr·L/s)</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">펌핑 속도 S (L/s)</label>
                        <input
                          type="range"
                          min="100"
                          max="2000"
                          step="50"
                          value={systemPumpingSpeed}
                          onChange={handleSystemPumpingSpeedChange}
                          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #f57c00 0%, #f57c00 ${(systemPumpingSpeed - 100) / (2000 - 100) * 100}%, #e5e7eb ${(systemPumpingSpeed - 100) / (2000 - 100) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>100</span>
                          <span>1000</span>
                          <span>2000</span>
                        </div>
                        <div className="text-center mt-2">
                          <span className="font-bold text-orange-600">{systemPumpingSpeed} L/s</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 압력 제어 방법 */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">압력 제어 방법</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-blue-700 mb-1">압력을 낮추려면:</p>
                        <p className="text-blue-600">• 가스 로드(Q) 감소</p>
                        <p className="text-blue-600">• 펌핑 속도(S) 증가</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700 mb-1">압력이 높아지는 경우:</p>
                        <p className="text-blue-600">• 가스 누설 발생</p>
                        <p className="text-blue-600">• 펌프 성능 저하</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 오른쪽: 계산 결과와 가이드 */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border-2 border-blue-200">
                    <h4 className="font-semibold mb-3 text-blue-800">계산 결과</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">가스 유량 (Q):</span> 
                        <span className="ml-2 font-bold text-green-600">{Math.round(gasLoad / 0.00950)} sccm</span>
                        <span className="text-xs text-gray-500 ml-1">({gasLoad.toFixed(1)} Torr·L/s)</span></p>
                      <p><span className="font-medium">펌핑 속도 (S):</span> 
                        <span className="ml-2 font-bold text-orange-600">{systemPumpingSpeed} L/s</span></p>
                      <p><span className="font-medium">결과 압력 (P):</span> 
                        <span className="ml-2 font-bold text-blue-600">
                          {resultPressure >= 0.001 ? resultPressure.toFixed(3) : resultPressure.toExponential(2)} Torr
                        </span></p>
                      <p><span className="font-medium">진공도:</span> 
                        <span className="ml-2 font-semibold text-purple-600">
                          {resultPressure > 0.075 ? '저진공' : 
                           resultPressure > 0.0075 ? '중진공' : 
                           resultPressure > 0.00075 ? '고진공' : '초고진공'}
                        </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">실험 가이드</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>• Q 슬라이더로 가스 발생량 조절</p>
                      <p>• S 슬라이더로 펌프 성능 조절</p>
                      <p>• 압력 박스 색상 변화 관찰</p>
                      <p>• 목표: 원하는 압력 달성</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">실제 응용</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>• 반도체: 10⁻⁶ Torr 필요</p>
                      <p>• 코팅: 10⁻³ Torr 필요</p>
                      <p>• 식품포장: 10⁻¹ Torr 필요</p>
                      <p>• 각 용도별 최적 조건 실험</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 더 생각해보기 섹션 */}
              <div className="lg:col-span-3 mt-8 bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">더 생각해보기</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-purple-700 mb-2">토론 주제 1: Q=P×S 공식의 실무 적용 한계</h4>
                    <p className="text-purple-600 mb-2">
                      Q=P×S 공식은 정상상태에서만 성립합니다. 
                      실제 공정에서 가스 유량이 급변하거나 펌프가 갑자기 정지했을 때 
                      압력 변화를 예측하고 대응하는 방법을 제시해보세요. 
                      또한 이 공식이 적용되지 않는 상황들을 분석해보세요.
                    </p>
                    <p className="text-xs text-purple-500">
                      힌트: 과도상태, 챔버 체적 효과, 비선형 현상, 시간 지연 등을 고려해보세요.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-purple-700 mb-2">토론 주제 2: 시스템 성능 향상 전략</h4>
                    <p className="text-purple-600 mb-2">
                      현재 Q=15 Torr·L/s, S=500 L/s로 P=0.03 Torr를 달성하고 있는 시스템에서 
                      목표 압력 0.003 Torr(10배 향상)를 달성해야 합니다. 
                      Q 감소, S 증가, 또는 두 방법의 조합 중 어떤 접근이 가장 효과적이고 경제적일지 
                      구체적인 수치와 근거를 제시하여 분석해보세요.
                    </p>
                    <p className="text-xs text-purple-500">
                      힌트: 펌프 교체 비용, 가스 제어 정밀도, 기술적 한계 등을 고려해보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 테마 5: 배관 설계 최적화 실험 */}
          {activeTab === 'pipe-design' && (
            <div className="space-y-8">
              {/* 제목 */}
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h2 className="text-2xl font-bold mb-4 text-cyan-800">배관 설계 최적화 실험</h2>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-cyan-800 mb-2">목적과 이유</h4>
                  <p className="text-cyan-700 text-sm leading-relaxed">
                    <strong>왜 배관 설계가 중요한가?</strong><br/>
                    아무리 좋은 펌프를 사용해도 배관이 잘못 설계되면 성능이 크게 떨어집니다. 
                    Conductance는 배관의 "가스 전도도"를 나타내며, 이를 최적화하면 같은 펌프로도 
                    훨씬 좋은 진공을 얻을 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 왼쪽: 배관 시각화와 설계 설정 */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 배관 시각화 */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">배관 설계 및 Conductance 분석</h3>
                    
                    <div className="flex justify-center mb-6">
                      <svg width="700" height="400" viewBox="0 0 700 400" className="border border-gray-300 bg-gray-50 rounded">
                        {/* 챔버 */}
                        <rect x="50" y="150" width="120" height="100" fill="#e3f2fd" stroke="#1976d2" strokeWidth="3" rx="10"/>
                        <text x="110" y="140" textAnchor="middle" className="text-sm font-semibold">Chamber</text>
                        <text x="110" y="195" textAnchor="middle" className="text-sm font-bold">P₁</text>
                        <text x="110" y="210" textAnchor="middle" className="text-xs">1×10⁻⁵ mbar</text>
                        
                        {/* 배관 렌더링 - 직경에 따라 두께 변경 */}
                        {pipeType === 'straight' && (
                          <g>
                            <rect 
                              x="170" 
                              y={200 - (pipeDiameter / 2)} 
                              width="320" 
                              height={pipeDiameter} 
                              fill="#e0e0e0" rx="2"
                            />
                            <text x="330" y="130" textAnchor="middle" className="text-sm font-semibold">직관형 배관</text>
                            <text x="330" y="270" textAnchor="middle" className="text-sm font-bold text-blue-600">
                              길이: {pipeLength} cm, 직경: {pipeDiameter} cm
                            </text>
                          </g>
                        )}
                        
                        {pipeType === 'elbow' && (
                          <g>
                            {/* 엘보형 배관 - 곡선으로 부드럽게 연결 */}
                            <path
                              d={`M 170 200 
                                 L 270 200 
                                 Q 290 200 290 180 
                                 L 290 170 
                                 Q 290 150 310 150 
                                 L 390 150 
                                 Q 410 150 410 170 
                                 L 410 180 
                                 Q 410 200 430 200 
                                 L 490 200`}
                              stroke="#e0e0e0"
                              fill="none"
                              strokeWidth={pipeDiameter}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <text x="330" y="130" textAnchor="middle" className="text-sm font-semibold">엘보형 배관</text>
                            <text x="330" y="270" textAnchor="middle" className="text-sm font-bold text-blue-600">
                              길이: {pipeLength} cm, 직경: {pipeDiameter} cm
                            </text>
                          </g>
                        )}
                        
                        {pipeType === 'spiral' && (
                          <g>
                            {/* 스파이럴형 배관 - 사각형 루프 형태로 곡선 처리 */}
                            <path
                              d={`M 170 200 
                                 L 250 200 
                                 Q 270 200 270 180 
                                 L 270 140 
                                 Q 270 120 290 120 
                                 L 370 120 
                                 Q 390 120 390 140 
                                 L 390 220 
                                 Q 390 240 370 240 
                                 L 330 240 
                                 Q 310 240 310 220 
                                 L 310 160 
                                 Q 310 140 330 140 
                                 L 350 140 
                                 Q 370 140 370 160 
                                 L 370 200 
                                 L 490 200`}
                              stroke="#e0e0e0"
                              fill="none"
                              strokeWidth={pipeDiameter}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            <text x="330" y="110" textAnchor="middle" className="text-sm font-semibold">스파이럴형 배관</text>
                            <text x="330" y="290" textAnchor="middle" className="text-sm font-bold text-blue-600">
                              길이: 고정, 직경: {pipeDiameter} cm
                            </text>
                          </g>
                        )}
                        
                        {/* 펌프 */}
                        <rect x="500" y="160" width="100" height="80" fill="#fff3e0" stroke="#f57c00" strokeWidth="3" rx="10"/>
                        <circle cx="550" cy="200" r="20" fill="none" stroke="#f57c00" strokeWidth="2"/>
                        <text x="550" y="150" textAnchor="middle" className="text-sm font-semibold">Pump</text>
                        <text x="550" y="195" textAnchor="middle" className="text-sm font-bold">S₀</text>
                        <text x="550" y="210" textAnchor="middle" className="text-xs">1000 L/s</text>
                        <text x="550" y="260" textAnchor="middle" className="text-xs">효과적 속도:</text>
                        <text x="550" y="275" textAnchor="middle" className="text-xs font-bold text-green-600">
                          {effectivePumpingSpeed.toFixed(0)} L/s
                        </text>
                        
                        {/* 배관 정보 박스 */}
                        <rect x="200" y="20" width="300" height="70" fill="white" stroke="#666" strokeWidth="1" rx="5"/>
                        <text x="350" y="40" textAnchor="middle" className="text-sm font-semibold">배관 정보</text>
                        <text x="220" y="60" className="text-xs">길이: {pipeLength} cm</text>
                        <text x="320" y="60" className="text-xs">직경: {pipeDiameter} cm</text>
                        <text x="420" y="60" className="text-xs">타입: {getPipeTypeDescription(pipeType)}</text>
                        <text x="220" y="75" className="text-xs font-bold text-blue-600">
                          Conductance: {calculatedConductance.toFixed(0)} L/s
                        </text>
                        
                        {/* 공식 표시 */}
                        <text x="350" y="340" textAnchor="middle" className="text-sm font-bold">
                          1/S_eff = 1/S₀ + 1/C
                        </text>
                        <text x="350" y="360" textAnchor="middle" className="text-xs">
                          S_eff: 효과적 펌핑속도, S₀: 펌프 속도, C: Conductance
                        </text>
                        
                        {/* 화살표 */}
                        <polygon points="170,195 180,200 170,205" fill="#666"/>
                        <polygon points="490,195 500,200 490,205" fill="#666"/>
                      </svg>
                    </div>
                  </div>

                  {/* 배관 설계 설정 - 시각화 바로 아래 */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3">배관 설계 설정</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">배관 길이 (cm)</label>
                        <input
                          type="range"
                          min="50"
                          max="300"
                          step="10"
                          value={pipeLength}
                          onChange={handlePipeLengthChange}
                          disabled={pipeType !== 'straight'}
                          className={`w-full h-2 rounded-lg cursor-pointer ${
                            pipeType !== 'straight' 
                              ? 'bg-gray-100 cursor-not-allowed' 
                              : 'bg-gray-200'
                          }`}
                          style={pipeType === 'straight' ? {
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(pipeLength - 50) / (300 - 50) * 100}%, #e5e7eb ${(pipeLength - 50) / (300 - 50) * 100}%, #e5e7eb 100%)`
                          } : {}}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50cm</span>
                          <span>300cm</span>
                        </div>
                        <div className="text-center mt-2">
                          <span className={`font-bold ${
                            pipeType !== 'straight' ? 'text-gray-400' : 'text-blue-600'
                          }`}>
                            {pipeType === 'straight' ? `${pipeLength} cm` : '고정길이'}
                          </span>
                        </div>
                        {pipeType !== 'straight' && (
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {pipeType === 'elbow' ? '엘보형' : '스파이럴형'}은 길이 고정
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">배관 직경 (cm)</label>
                        <input
                          type="range"
                          min="2"
                          max="20"
                          step="1"
                          value={pipeDiameter}
                          onChange={handlePipeDiameterChange}
                          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #4caf50 0%, #4caf50 ${(pipeDiameter - 2) / (20 - 2) * 100}%, #e5e7eb ${(pipeDiameter - 2) / (20 - 2) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>2cm</span>
                          <span>20cm</span>
                        </div>
                        <div className="text-center mt-2">
                          <span className="font-bold text-green-600">{pipeDiameter} cm</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">배관 형태</label>
                        <select
                          value={pipeType}
                          onChange={handlePipeTypeChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="straight">직관형 (Straight)</option>
                          <option value="elbow">엘보형 (Elbow)</option>
                          <option value="spiral">스파이럴형 (Spiral)</option>
                        </select>
                        <div className="text-center mt-2">
                          <span className="font-bold text-purple-600">{getPipeTypeDescription(pipeType)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 배관 형태 비교 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-1">직관형 배관</h4>
                      <p className="text-blue-700">• 가장 높은 Conductance</p>
                      <p className="text-blue-700">• 설치 공간 많이 필요</p>
                      <p className="text-blue-700">• 성능 손실 최소</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-1">엘보형 배관</h4>
                      <p className="text-orange-700">• 중간 수준의 Conductance</p>
                      <p className="text-orange-700">• 공간 활용 효율적</p>
                      <p className="text-orange-700">• 적당한 성능 손실</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-1">스파이럴형 배관</h4>
                      <p className="text-red-700">• 가장 낮은 Conductance</p>
                      <p className="text-red-700">• 공간 절약 극대화</p>
                      <p className="text-red-700">• 성능 손실 최대</p>
                    </div>
                  </div>
                </div>
                
                {/* 오른쪽: 성능 분석과 가이드 */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border-2 border-cyan-200">
                    <h4 className="font-semibold mb-3 text-cyan-800">성능 분석</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">배관 길이:</span> 
                        <span className="ml-2 font-bold text-blue-600">{pipeLength} cm</span></p>
                      <p><span className="font-medium">배관 직경:</span> 
                        <span className="ml-2 font-bold text-green-600">{pipeDiameter} cm</span></p>
                      <p><span className="font-medium">배관 형태:</span> 
                        <span className="ml-2 font-bold text-purple-600">{getPipeTypeDescription(pipeType)}</span></p>
                      <p><span className="font-medium">Conductance:</span> 
                        <span className="ml-2 font-bold text-orange-600">{calculatedConductance.toFixed(0)} L/s</span></p>
                      <p><span className="font-medium">효과적 펌핑속도:</span> 
                        <span className="ml-2 font-bold text-red-600">{effectivePumpingSpeed.toFixed(0)} L/s</span></p>
                      <p><span className="font-medium">성능 손실:</span> 
                        <span className="ml-2 font-bold text-gray-600">
                          {((1000 - effectivePumpingSpeed) / 1000 * 100).toFixed(1)}%
                        </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">설계 가이드라인</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>• 직경 2배 → Conductance 16배↑</p>
                      <p>• 길이 2배 → Conductance 2배↓</p>
                      <p>• 직관 > 엘보 > 스파이럴</p>
                      <p>• 짧고 굵게 설계하자!</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">최적화 팁</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>• 성능 손실 20% 이하 목표</p>
                      <p>• 공간 제약 고려</p>
                      <p>• 청소 및 유지보수 용이성</p>
                      <p>• 진동 및 열팽창 고려</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 더 생각해보기 섹션 */}
              <div className="lg:col-span-3 mt-8 bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-semibold text-cyan-800 mb-4">더 생각해보기</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-cyan-700 mb-2">토론 주제 1: 설계 제약조건과 최적화 트레이드오프</h4>
                    <p className="text-cyan-600 mb-2">
                      신축 건물의 3층에서 지하 1층으로 이어지는 진공 배관을 설계해야 합니다. 
                      건축 구조상 배관 경로에 제약이 있고, 유지보수용 접근성, 진동 차단, 열팽창 보상, 
                      그리고 Conductance 최적화를 모두 고려해야 할 때 어떤 우선순위와 타협점을 설정하시겠습니까?
                    </p>
                    <p className="text-xs text-cyan-500">
                      힌트: 안전성, 경제성, 성능, 유지보수성의 균형을 고려해보세요.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-cyan-700 mb-2">토론 주제 2: 생산 현장 배관 업그레이드 전략</h4>
                    <p className="text-cyan-600 mb-2">
                      기존 생산라인에서 스파이럴형 배관(성능 손실 60%)을 직관형으로 교체하여 
                      성능을 향상시키려고 합니다. 하지만 생산 중단 비용이 시간당 1억원이고, 
                      배관 교체에 3일이 필요합니다. 이런 상황에서 업그레이드 결정을 위한 
                      경제성 분석 방법과 대안을 제시해보세요.
                    </p>
                    <p className="text-xs text-cyan-500">
                      힌트: ROI 계산, 단계적 교체, 임시 우회 배관, 예비 시스템 등을 고려해보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 테마 6: 진공 기술 퀴즈 */}
          {activeTab === 'quiz' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-800">진공 기술 퀴즈</h2>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">학습 성과 확인</h4>
                  <p className="text-purple-700 text-sm leading-relaxed">
                    5개 테마에서 학습한 내용을 바탕으로 한 퀴즈입니다. 
                    실무에서 활용할 수 있는 진공 기술 지식을 점검해보세요.
                  </p>
                </div>
              </div>

              {!quizCompleted ? (
                <div className="bg-white p-8 rounded-lg border shadow-lg">
                  {/* 진행률 표시 */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        문제 {currentQuestion + 1} / {quizQuestions.length}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        점수: {score} / {quizQuestions.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 카테고리 표시 */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {quizQuestions[currentQuestion].category}
                    </span>
                  </div>

                  {/* 문제 */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {quizQuestions[currentQuestion].question}
                    </h3>
                    
                    {/* 선택지 */}
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showResult}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            showResult
                              ? index === quizQuestions[currentQuestion].correct
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : index === selectedAnswer && selectedAnswer !== quizQuestions[currentQuestion].correct
                                ? 'border-red-500 bg-red-50 text-red-800'
                                : 'border-gray-200 bg-gray-50 text-gray-600'
                              : selectedAnswer === index
                              ? 'border-purple-500 bg-purple-50 text-purple-800'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                          }`}
                        >
                          <span className="font-medium mr-3">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 결과 표시 */}
                  {showResult && (
                    <div className={`p-4 rounded-lg border-l-4 mb-6 ${
                      selectedAnswer === quizQuestions[currentQuestion].correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}>
                      <div className="flex items-center mb-2">
                        <span className={`text-lg font-bold ${
                          selectedAnswer === quizQuestions[currentQuestion].correct
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {selectedAnswer === quizQuestions[currentQuestion].correct ? '정답!' : '오답!'}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        selectedAnswer === quizQuestions[currentQuestion].correct
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        {quizQuestions[currentQuestion].explanation}
                      </p>
                    </div>
                  )}

                  {/* 다음 버튼 */}
                  <div className="flex justify-center">
                    {!showResult ? (
                      <button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswer === null}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                          selectedAnswer !== null
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {currentQuestion === quizQuestions.length - 1 ? '결과 보기' : '다음 문제'}
                      </button>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-600 mb-2">
                          {currentQuestion === quizQuestions.length - 1 ? '결과를 확인하는 중...' : '다음 문제로 넘어갑니다...'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 퀴즈 완료 화면 */
                <div className="bg-white p-8 rounded-lg border shadow-lg text-center">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">
                      {score >= 8 ? '🏆' : score >= 6 ? '👍' : '📚'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">퀴즈 완료!</h3>
                    <p className={`text-xl font-semibold ${getScoreColor()}`}>
                      {score} / {quizQuestions.length} 점 ({((score / quizQuestions.length) * 100).toFixed(0)}%)
                    </p>
                    <p className="text-gray-600 mt-2">
                      {getScoreMessage()}
                    </p>
                  </div>

                  {/* 상세 결과 */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">카테고리별 결과</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['펌핑 시뮬레이션', '성능 분석', '공정 제어', 'Conductance'].map((category) => {
                        const categoryQuestions = quizQuestions.filter(q => q.category.includes(category) || 
                          (category === '공정 제어' && q.category.includes('공정')) ||
                          (category === 'Conductance' && (q.category.includes('Conductance') || q.category.includes('배관')))
                        );
                        const categoryScore = userAnswers.filter(answer => {
                          const question = quizQuestions.find(q => q.id === answer.questionId);
                          return question && (question.category.includes(category) || 
                            (category === '공정 제어' && question.category.includes('공정')) ||
                            (category === 'Conductance' && (question.category.includes('Conductance') || question.category.includes('배관')))
                          ) && answer.correct;
                        }).length;
                        
                        return (
                          <div key={category} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-800">{category}</p>
                            <p className="text-sm text-gray-600">
                              {categoryScore} / {categoryQuestions.length} 정답
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 다시 시작 버튼 */}
                  <div className="space-y-4">
                    <button
                      onClick={resetQuiz}
                      className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                    >
                      다시 도전하기
                    </button>
                    <p className="text-sm text-gray-500">
                      틀린 문제가 있다면 해당 시뮬레이션 탭에서 다시 학습해보세요!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 트러블슈팅 탭 */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">
              {!troubleStarted ? (
                <div className="bg-white rounded-lg p-6 shadow">
                  <h2 className="text-xl font-bold mb-4">🚨 트러블 시나리오 선택</h2>
                  <p className="text-gray-600 mb-4">실제 현장에서 발생할 수 있는 트러블 상황을 체험하고 대응 방법을 학습하세요!</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {Object.entries(troubleScenarios).map(([id, s]) => (
                      <button key={id} onClick={() => setTroubleScenario(Number(id))}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${troubleScenario === Number(id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{s.icon}</span>
                          <span className="font-bold">{s.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{s.description}</p>
                        {s.isDetective && <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">🔍 탐정모드</span>}
                        {s.critical && <span className="inline-block mt-2 ml-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">⚠️ 위험</span>}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleTroubleStart} className={`w-full py-4 rounded-lg font-bold text-xl text-white bg-gradient-to-r ${troubleScenarios[troubleScenario].color} hover:opacity-90`}>
                    🚨 시나리오 시작
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">{troubleScenarios[troubleScenario].icon} {troubleScenarios[troubleScenario].name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-200 px-2 py-1 rounded">{formatTime(troubleElapsedTime)}</span>
                        {isTroublePumping && <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">🔄 배기중</span>}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2 mb-4">
                      <svg viewBox="0 0 500 450" className="w-full max-w-lg mx-auto">
                        <defs>
                          <linearGradient id="tChamber" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#a8e6cf"/><stop offset="100%" stopColor="#88d8b0"/></linearGradient>
                          <linearGradient id="tTmp" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffeaa7"/><stop offset="100%" stopColor="#fdcb6e"/></linearGradient>
                          <linearGradient id="tDry" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fd79a8"/><stop offset="100%" stopColor="#e84393"/></linearGradient>
                        </defs>

                        {/* 시나리오 3: 가스박스 */}
                        {troubleScenario === 3 && (
                          <g>
                            <rect x="380" y="15" width="115" height="130" rx="4" fill="#2a2a3e" stroke="#555" strokeWidth="2"/>
                            <text x="440" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#aaa">GAS BOX</text>
                            <rect x="455" y="40" width="35" height="18" rx="2" fill="#ef4444"/><text x="472" y="52" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">O2</text>
                            <rect x="428" y="42" width="22" height="14" rx="2" fill={gasLineO2?"#22c55e":"#666"} stroke="#333"/><text x="439" y="52" textAnchor="middle" fontSize="6" fill="white">{gasLineO2?"O":"C"}</text>
                            <rect x="455" y="62" width="35" height="18" rx="2" fill="#8b5cf6"/><text x="472" y="74" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Ar</text>
                            <rect x="428" y="64" width="22" height="14" rx="2" fill={gasLineAr?"#22c55e":"#666"} stroke="#333"/><text x="439" y="74" textAnchor="middle" fontSize="6" fill="white">{gasLineAr?"O":"C"}</text>
                            <rect x="455" y="84" width="35" height="18" rx="2" fill="#3b82f6"/><text x="472" y="96" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">N2</text>
                            <rect x="428" y="86" width="22" height="14" rx="2" fill={gasLineN2?"#22c55e":"#666"} stroke="#333"/><text x="439" y="96" textAnchor="middle" fontSize="6" fill="white">{gasLineN2?"O":"C"}</text>
                            <rect x="385" y="60" width="15" height="22" rx="3" fill={gasLineMain?"#f59e0b":"#666"} stroke="#333" strokeWidth="2"/><text x="392" y="74" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">{gasLineMain?"O":"C"}</text>
                            <text x="392" y="90" textAnchor="middle" fontSize="6" fill="#f59e0b">MAIN</text>
                          </g>
                        )}

                        {/* 시나리오 4: RF/Matcher */}
                        {troubleScenario === 4 && (
                          <g>
                            <rect x="20" y="20" width="80" height="50" rx="4" fill={rfBreaker?"#dc2626":"#374151"} stroke="#555" strokeWidth="2"/>
                            <text x="60" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">RF GEN</text>
                            <text x="60" y="62" textAnchor="middle" fontSize="9" fill={rfBreaker?"#fef08a":"#666"}>{rfBreaker?`${rfPower}W`:"OFF"}</text>
                            <rect x="100" y="80" width="60" height="45" rx="4" fill={matcherTemp>100?"#991b1b":"#1e3a5f"} stroke={matcherTemp>80?"#ef4444":"#555"} strokeWidth="2"/>
                            {matcherSmoke > 20 && <ellipse cx="130" cy="75" rx="15" ry="8" fill="#888" opacity={matcherSmoke/100}><animate attributeName="cy" values="75;60;45" dur="2s" repeatCount="indefinite"/></ellipse>}
                            <text x="130" y="98" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">MATCHER</text>
                            <text x="130" y="110" textAnchor="middle" fontSize="7" fill={matcherTemp>100?"#fef08a":"#aaa"}>🌡️{matcherTemp.toFixed(0)}°C</text>
                            <circle cx="50" cy="400" r="25" fill="#7f1d1d" stroke="#991b1b" strokeWidth="3"/>
                            <text x="50" y="395" textAnchor="middle" fontSize="7" fill="#fca5a5">EMO</text>
                            <text x="50" y="408" textAnchor="middle" fontSize="8" fill="#fca5a5">고장!</text>
                            <line x1="30" y1="380" x2="70" y2="420" stroke="#ef4444" strokeWidth="3"/>
                            <line x1="70" y1="380" x2="30" y2="420" stroke="#ef4444" strokeWidth="3"/>
                          </g>
                        )}

                        {/* 챔버 */}
                        <rect x="155" y="20" width="200" height="80" rx="6" fill="url(#tChamber)" stroke="#2d3436" strokeWidth="2"/>
                        <text x="255" y="45" textAnchor="middle" fontSize="12" fontWeight="bold">CHAMBER</text>
                        <rect x="290" y="50" width="55" height="22" rx="3" fill="#1a1a2e"/>
                        <text x="318" y="65" textAnchor="middle" fontSize="9" fill={troublePressure>1e-3?"#ff6b6b":"#00ff00"} fontFamily="monospace">
                          {troublePressure>=1?troublePressure.toFixed(1):troublePressure.toExponential(1)}
                        </text>

                        {/* APC */}
                        <rect x="245" y="100" width="20" height="25" fill="#636e72"/>
                        <rect x="205" y="125" width="100" height="32" rx="4" fill={troubleApcOpen?"#00b894":"#d63031"} stroke="#2d3436" strokeWidth="2"/>
                        <text x="255" y="145" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">APC {troubleApcOpen?"OPEN":"CLOSE"}</text>
                        <rect x="245" y="157" width="20" height="23" fill="#636e72"/>

                        {/* TMP */}
                        <rect x="175" y="180" width="160" height="85" rx="6" fill="url(#tTmp)" stroke="#2d3436" strokeWidth="2"/>
                        <text x="255" y="200" textAnchor="middle" fontSize="11" fontWeight="bold">TMP</text>
                        <circle cx="255" cy="232" r="28" fill="#1a1a2e" stroke="#333" strokeWidth="2"/>
                        <circle cx="255" cy="232" r="22" fill="#2d3436"/>
                        <g>{troubleTurboSpeed > 5 && <animateTransform attributeName="transform" type="rotate" from="0 255 232" to="360 255 232" dur={troubleTurboSpeed>250?"0.05s":troubleTurboSpeed>150?"0.1s":"0.3s"} repeatCount="indefinite"/>}{[0,45,90,135,180,225,270,315].map((a,i) => (<line key={i} x1="255" y1="232" x2={255+Math.cos(a*Math.PI/180)*18} y2={232+Math.sin(a*Math.PI/180)*18} stroke="#fdcb6e" strokeWidth="3" strokeLinecap="round"/>))}</g>
                        <circle cx="255" cy="232" r="5" fill={troubleTmpOn?"#00ff00":"#666"}/>
                        <text x="345" y="210" fontSize="8" fill="#666">{Math.round(troubleTurboSpeed*200)} RPM</text>
                        {troubleScenario===1 && <text x="345" y="234" fontSize="8" fill={tmpTemperature>80?"#d63031":"#27ae60"}>🌡️{tmpTemperature.toFixed(0)}°C</text>}

                        {/* F/V */}
                        <rect x="245" y="265" width="20" height="20" fill="#636e72"/>
                        <rect x="210" y="285" width="90" height="28" rx="4" fill={troubleFvOpen?"#00b894":"#d63031"} stroke="#2d3436" strokeWidth="2"/>
                        <text x="255" y="303" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">F/V {troubleFvOpen?"OPEN":"CLOSE"}</text>
                        <rect x="245" y="313" width="20" height="22" fill="#636e72"/>

                        {/* R/V 라인 */}
                        <path d="M 155 55 L 105 55 L 105 165" stroke="#636e72" strokeWidth="14" fill="none" strokeLinecap="round"/>
                        <rect x="80" y="165" width="50" height="28" rx="4" fill={troubleRvOpen?"#00b894":"#d63031"} stroke="#2d3436" strokeWidth="2"/>
                        <text x="105" y="183" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">R/V</text>
                        <path d="M 105 193 L 105 375 L 175 375" stroke="#636e72" strokeWidth="14" fill="none" strokeLinecap="round"/>

                        {/* DRY PUMP */}
                        <rect x="175" y="335" width="160" height="55" rx="6" fill="url(#tDry)" stroke="#2d3436" strokeWidth="2"/>
                        <text x="255" y="360" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">DRY PUMP</text>
                        <text x="255" y="378" textAnchor="middle" fontSize="8" fill="white">{troubleScenario===2 ? `⚡${dryPumpCurrent.toFixed(0)}A | ${dryPumpOn?"ON":"OFF"}` : "정상 15A"}</text>

                        {/* 성공/실패 오버레이 */}
                        {troubleSuccess && troubleScenario !== 3 && <g><rect x="150" y="180" width="200" height="60" rx="8" fill="rgba(34,197,94,0.95)"/><text x="250" y="218" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">🎉 성공!</text></g>}
                        {troubleFailed && <g><rect x="150" y="180" width="200" height="60" rx="8" fill="rgba(239,68,68,0.95)"/><text x="250" y="218" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">❌ 실패!</text></g>}
                      </svg>
                    </div>

                    {/* 상황 브리핑 */}
                    {showSituation && (
                      <div className="bg-gray-900 rounded-lg p-4 mb-4 border-2 border-yellow-500">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-400 font-bold">📋 상황 브리핑</span>
                          {!troubleTriggered && <span className="animate-pulse text-yellow-400">●</span>}
                          {troubleTriggered && <span className="text-green-400 text-sm">✓ 조치 가능</span>}
                        </div>
                        <div className="font-mono text-sm text-green-400 whitespace-pre-line min-h-24">
                          {troubleSituationText}{!troubleTriggered && <span className="animate-pulse">▌</span>}
                        </div>
                      </div>
                    )}

                    {/* 시나리오별 컨트롤 패널 */}
                    {troubleTriggered && !troubleSuccess && !troubleFailed && (
                      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                        {/* 시나리오 3: 가스라인 */}
                        {troubleScenario === 3 && (
                          <div className="space-y-3">
                            <div className="text-white text-sm mb-2">🔧 가스라인 공압밸브 제어</div>
                            <div className="grid grid-cols-4 gap-2">
                              <button onClick={() => setGasLineO2(!gasLineO2)} className={`p-3 rounded font-bold text-sm ${gasLineO2?'bg-red-500':'bg-gray-600'} text-white`}>O2<br/><span className="text-xs">{gasLineO2?'OPEN':'CLOSE'}</span></button>
                              <button onClick={() => setGasLineAr(!gasLineAr)} className={`p-3 rounded font-bold text-sm ${gasLineAr?'bg-purple-500':'bg-gray-600'} text-white`}>Ar<br/><span className="text-xs">{gasLineAr?'OPEN':'CLOSE'}</span></button>
                              <button onClick={() => setGasLineN2(!gasLineN2)} className={`p-3 rounded font-bold text-sm ${gasLineN2?'bg-blue-500':'bg-gray-600'} text-white`}>N2<br/><span className="text-xs">{gasLineN2?'OPEN':'CLOSE'}</span></button>
                              <button onClick={() => setGasLineMain(!gasLineMain)} className={`p-3 rounded font-bold text-sm ${gasLineMain?'bg-yellow-500':'bg-gray-600'} text-white border-2 ${gasLineMain?'border-yellow-300':'border-gray-500'}`}>MAIN<br/><span className="text-xs">{gasLineMain?'OPEN':'CLOSE'}</span></button>
                            </div>
                            <div className="bg-gray-700 rounded p-3">
                              <div className="text-yellow-400 text-xs mb-2">📊 압력 변화 관찰</div>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-800 rounded p-2">
                                  <div className="text-xs text-gray-400">현재 압력</div>
                                  <div className={`text-lg font-mono font-bold ${troublePressure < 1e-5 ? 'text-green-400' : troublePressure < 1e-4 ? 'text-yellow-400' : 'text-red-400'}`}>{troublePressure.toExponential(1)} Torr</div>
                                </div>
                                <div className="text-2xl">{troublePressure < 1e-5 ? '📉' : troublePressure > 4e-4 ? '📈' : '➡️'}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 시나리오 4: Matcher 화재 */}
                        {troubleScenario === 4 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-red-400 font-bold animate-pulse">🔥 긴급상황! 수동 셧다운 필요!</div>
                            <div className="bg-red-900/50 rounded p-3 border border-red-500">
                              <div className="text-yellow-300 text-xs mb-2">⚠️ 조치 순서</div>
                              <div className="text-white text-sm space-y-1">
                                <div className={scenario4Step >= 1 ? 'text-green-400' : ''}>1️⃣ RF 차단기 OFF {scenario4Step >= 1 && '✓'}</div>
                                <div className={scenario4Step >= 2 ? 'text-green-400' : ''}>2️⃣ 가스 메인 or SiH4 밸브 차단 {scenario4Step >= 2 && '✓'}</div>
                                <div className={scenario4Step >= 3 ? 'text-green-400' : ''}>3️⃣ N2 퍼지 & 배기 확인 {scenario4Step >= 3 && '✓'}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => setRfBreaker(!rfBreaker)} className={`p-4 rounded font-bold ${rfBreaker?'bg-red-600 animate-pulse':'bg-gray-600'} text-white border-2 border-yellow-400`}>
                                ⚡ RF 차단기<br/><span className="text-xs">{rfBreaker?'ON':'OFF ✓'}</span>
                              </button>
                              <button onClick={() => setGasSupplyMain(!gasSupplyMain)} className={`p-4 rounded font-bold ${gasSupplyMain?'bg-orange-600':'bg-gray-600'} text-white`}>
                                🔧 가스 메인<br/><span className="text-xs">{gasSupplyMain?'OPEN':'CLOSE ✓'}</span>
                              </button>
                              <button onClick={() => setSih4Valve(!sih4Valve)} className={`p-4 rounded font-bold ${sih4Valve?'bg-yellow-600':'bg-gray-600'} text-white`}>
                                ☠️ SiH4 밸브<br/><span className="text-xs">{sih4Valve?'OPEN':'CLOSE ✓'}</span>
                              </button>
                              <button onClick={() => setEvacuating(!evacuating)} className={`p-4 rounded font-bold ${evacuating?'bg-blue-600':'bg-gray-600'} text-white`}>
                                💨 배기/퍼지<br/><span className="text-xs">{evacuating?'진행중':'시작'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 시나리오 5: 포라인 */}
                        {troubleScenario === 5 && (
                          <div className="space-y-3">
                            <div className={`p-3 rounded font-bold text-center ${scenario5BackflowWarning ? 'bg-red-600 animate-pulse' : scenario5Phase === 'roughing' ? 'bg-blue-600' : scenario5Phase === 'foreline' ? (scenario5Found ? 'bg-green-600' : 'bg-orange-600') : 'bg-yellow-600'} text-white`}>
                              {scenario5BackflowWarning && '🚨 역류 위험! R/V와 F/V 동시 개방!'}
                              {!scenario5BackflowWarning && scenario5Phase === 'roughing' && '📍 러핑 모드 - 정상 배기 중'}
                              {!scenario5BackflowWarning && scenario5Phase === 'foreline' && (scenario5Found ? '✅ 포라인 모드 - 문제 해결됨!' : '⚠️ 포라인 모드 - 압력 정체!')}
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <button onClick={() => setTroubleRvOpen(!troubleRvOpen)} className={`p-3 rounded font-bold ${troubleRvOpen?'bg-green-500':'bg-gray-600'} text-white`}>R/V<br/><span className="text-xs">{troubleRvOpen?'OPEN':'CLOSE'}</span></button>
                              <button onClick={() => setTroubleApcOpen(!troubleApcOpen)} className={`p-3 rounded font-bold ${troubleApcOpen?'bg-green-500':'bg-gray-600'} text-white`}>APC<br/><span className="text-xs">{troubleApcOpen?'OPEN':'CLOSE'}</span></button>
                              <button onClick={() => setTroubleFvOpen(!troubleFvOpen)} className={`p-3 rounded font-bold ${troubleFvOpen?'bg-green-500':'bg-gray-600'} text-white`}>F/V<br/><span className="text-xs">{troubleFvOpen?'OPEN':'CLOSE'}</span></button>
                              <button onClick={() => setTroubleTmpOn(!troubleTmpOn)} className={`p-3 rounded font-bold ${troubleTmpOn?'bg-orange-500':'bg-gray-600'} text-white`}>TMP<br/><span className="text-xs">{troubleTmpOn?'ON':'OFF'}</span></button>
                            </div>
                            {scenario5Phase === 'foreline' && !scenario5Found && (
                              <div className="bg-red-900/30 rounded p-3 border border-red-500">
                                <div className="text-red-300 text-sm mb-2">🔍 F/V ~ DRY 사이 배관 점검</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <button onClick={() => { setScenario5Checked(prev => ({...prev, bellows: true})); if (scenario5FaultLocation === 'bellows') setScenario5Found(true); }} className={`p-3 rounded text-sm ${scenario5Checked.bellows ? (scenario5FaultLocation==='bellows'?'bg-green-600':'bg-gray-500') : 'bg-cyan-700'} text-white`}>🔧 벨로우즈<br/><span className="text-xs">{scenario5Checked.bellows ? (scenario5FaultLocation==='bellows'?'⚠️ 크랙!':'이상없음') : '점검'}</span></button>
                                  <button onClick={() => { setScenario5Checked(prev => ({...prev, oring: true})); if (scenario5FaultLocation === 'oring') setScenario5Found(true); }} className={`p-3 rounded text-sm ${scenario5Checked.oring ? (scenario5FaultLocation==='oring'?'bg-green-600':'bg-gray-500') : 'bg-cyan-700'} text-white`}>⭕ O-ring<br/><span className="text-xs">{scenario5Checked.oring ? (scenario5FaultLocation==='oring'?'⚠️ 손상!':'이상없음') : '점검'}</span></button>
                                  <button onClick={() => { setScenario5Checked(prev => ({...prev, clamp: true})); if (scenario5FaultLocation === 'clamp') setScenario5Found(true); }} className={`p-3 rounded text-sm ${scenario5Checked.clamp ? (scenario5FaultLocation==='clamp'?'bg-green-600':'bg-gray-500') : 'bg-cyan-700'} text-white`}>🔩 클램프<br/><span className="text-xs">{scenario5Checked.clamp ? (scenario5FaultLocation==='clamp'?'⚠️ 헐거움!':'이상없음') : '점검'}</span></button>
                                  <button onClick={() => setScenario5Checked(prev => ({...prev, fvSeal: true}))} className={`p-3 rounded text-sm ${scenario5Checked.fvSeal ? 'bg-gray-500' : 'bg-cyan-700'} text-white`}>🚪 F/V 씰<br/><span className="text-xs">{scenario5Checked.fvSeal ? '이상없음' : '점검'}</span></button>
                                </div>
                              </div>
                            )}
                            {scenario5Found && <div className="bg-green-900/30 rounded p-3 border border-green-500"><div className="text-green-300 font-bold">✅ 원인 발견! 수리 중...</div></div>}
                          </div>
                        )}

                        {/* 시나리오 1, 2: 기본 밸브 컨트롤 */}
                        {(troubleScenario === 1 || troubleScenario === 2) && (
                          <div className={`grid ${troubleScenario===2?'grid-cols-5':'grid-cols-4'} gap-2`}>
                            <button onClick={() => setTroubleRvOpen(!troubleRvOpen)} className={`p-3 rounded font-bold ${troubleRvOpen?'bg-green-500':'bg-gray-600'} text-white`}>R/V</button>
                            <button onClick={() => setTroubleApcOpen(!troubleApcOpen)} className={`p-3 rounded font-bold ${troubleApcOpen?'bg-green-500':'bg-gray-600'} text-white`}>APC</button>
                            <button onClick={() => setTroubleFvOpen(!troubleFvOpen)} className={`p-3 rounded font-bold ${troubleFvOpen?'bg-green-500':'bg-gray-600'} text-white`}>F/V</button>
                            <button onClick={() => setTroubleTmpOn(!troubleTmpOn)} className={`p-3 rounded font-bold ${troubleTmpOn?'bg-orange-500':'bg-gray-600'} text-white`}>TMP</button>
                            {troubleScenario === 2 && <button onClick={() => setDryPumpOn(!dryPumpOn)} className={`p-3 rounded font-bold ${dryPumpOn?'bg-pink-500':'bg-gray-600'} text-white`}>DRY</button>}
                          </div>
                        )}
                      </div>
                    )}

                    <button onClick={handleTroubleReset} className="mt-4 w-full py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600">🔄 시나리오 선택으로</button>
                  </div>

                  {/* 우측 상태 패널 */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow">
                      <h3 className="font-bold mb-3">📊 실시간 상태</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>챔버 압력</span><span className="font-mono">{troublePressure>=1?troublePressure.toFixed(1):troublePressure.toExponential(1)} Torr</span></div>
                        <div className="flex justify-between"><span>TMP 속도</span><span>{Math.round(troubleTurboSpeed)} L/s</span></div>
                        {troubleScenario===1 && <div className="flex justify-between"><span>TMP 온도</span><span className={tmpTemperature>80?'text-red-600 font-bold':''}>{tmpTemperature.toFixed(0)}°C</span></div>}
                        {troubleScenario===2 && <div className="flex justify-between"><span>드라이 전류</span><span className={dryPumpCurrent>40?'text-red-600 font-bold':''}>{dryPumpCurrent.toFixed(0)}A</span></div>}
                        {troubleScenario===4 && <div className="flex justify-between"><span>Matcher 온도</span><span className={matcherTemp>100?'text-red-600 font-bold':''}>{matcherTemp.toFixed(0)}°C</span></div>}
                        {troubleScenario===4 && <div className="flex justify-between"><span>SiH4 유량</span><span className={sih4Flow>0?'text-red-600':'text-green-600'}>{sih4Flow.toFixed(0)} sccm</span></div>}
                        {troubleScenario===5 && <div className="flex justify-between"><span>모드</span><span>{scenario5Phase==='roughing'?'러핑':scenario5Phase==='foreline'?'포라인':'전환중'}</span></div>}
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h3 className="font-bold text-yellow-800 mb-2">💡 힌트</h3>
                      <p className="text-sm text-yellow-700">
                        {troubleScenario===1 && "APC 닫아 챔버 격리 → TMP OFF!"}
                        {troubleScenario===2 && "① F/V 닫기 → ② 드라이 OFF → ③ TMP OFF → ④ APC 닫기"}
                        {troubleScenario===3 && "밸브를 하나씩 닫아보며 압력 변화를 관찰하세요!"}
                        {troubleScenario===4 && "① RF 차단기 먼저! ② 가스 차단 ③ 배기/퍼지"}
                        {troubleScenario===5 && "러핑 OK → 포라인 NG? F/V~DRY 사이 점검!"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacuumSimulator;
