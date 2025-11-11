import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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

const DopingProcessSimulator = () => {
  // State management
  const [activeTab, setActiveTab] = useState('theory');
  
  // Diffusion states
  const [diffProcessType, setDiffProcessType] = useState('predeposition');
  const [diffDopantType, setDiffDopantType] = useState('phosphorus');
  const [diffTemperature, setDiffTemperature] = useState(1000);
  const [diffTime, setDiffTime] = useState(30);
  const [diffSurfaceConc, setDiffSurfaceConc] = useState(1e20);
  const [diffBackgroundConc, setDiffBackgroundConc] = useState(1e15);
  
  // Implantation states
  const [implDopantType, setImplDopantType] = useState('phosphorus');
  const [implEnergy, setImplEnergy] = useState(50);
  const [implDose, setImplDose] = useState(1e15);
  const [implTilt, setImplTilt] = useState(7);
  const [implAnnealing, setImplAnnealing] = useState(false);
  const [annealTemp, setAnnealTemp] = useState(900);
  const [annealTime, setAnnealTime] = useState(30);
  
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
    phosphorus: { 
      name: 'Phosphorus (P)', 
      nameKo: '인',
      type: 'n-type', 
      Qd: 3.66, 
      D0: 3.85, 
      color: '#ef4444',
      mass: 31
    },
    boron: { 
      name: 'Boron (B)', 
      nameKo: '붕소',
      type: 'p-type', 
      Qd: 3.69, 
      D0: 0.76, 
      color: '#3b82f6',
      mass: 11
    },
    arsenic: { 
      name: 'Arsenic (As)', 
      nameKo: '비소',
      type: 'n-type', 
      Qd: 4.08, 
      D0: 0.32, 
      color: '#8b5cf6',
      mass: 75
    }
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

  // Calculate Rp and DeltaRp for implantation (simplified LSS theory)
  const calculateImplantParams = (energy, dopant) => {
    const mass = dopantProperties[dopant].mass;
    // Simplified empirical formulas for Si
    const Rp = (energy / 3.0) * Math.pow(mass / 28, -0.6); // nm
    const deltaRp = Rp * 0.4; // Approximate straggle
    return { Rp: Rp * 1e-3, deltaRp: deltaRp * 1e-3 }; // Convert to μm
  };

  // Calculate diffusion profile
  const calculateDiffusionProfile = (currentTime) => {
    const D = calculateDiffusionCoefficient(diffTemperature, diffDopantType);
    const t = currentTime * 60;
    const profile = [];
    const maxDepth = 5;
    const points = 100;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * maxDepth * 1e-4;
      let concentration;

      if (diffProcessType === 'predeposition') {
        const erfcArg = x / (2 * Math.sqrt(D * t));
        concentration = diffSurfaceConc * erfc(erfcArg);
      } else {
        const Q = diffSurfaceConc * Math.sqrt(Math.PI * D * 30 * 60);
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
    const maxDepth = Math.min(5, Rp + 4 * deltaRp);
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
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">제1법칙 (정상 상태)</p>
                    <p className="font-mono text-lg text-blue-700 mb-2">J = -D · (∂C/∂x)</p>
                    <p className="text-sm text-gray-700">
                      <strong>의미:</strong> 확산 플럭스(J)는 농도 기울기에 비례합니다.<br/>
                      높은 농도에서 낮은 농도로 흐름이 발생합니다.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-2">제2법칙 (비정상 상태)</p>
                    <p className="font-mono text-lg text-purple-700 mb-2">∂C/∂t = D · (∂²C/∂x²)</p>
                    <p className="text-sm text-gray-700">
                      <strong>의미:</strong> 시간에 따른 농도 변화를 설명합니다.<br/>
                      반도체 공정에서 실제 사용되는 방정식입니다.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-semibold text-green-900 mb-2">확산 계수 (D)</p>
                    <p className="font-mono text-lg text-green-700 mb-2">D = D₀ · exp(-Qd/kT)</p>
                    <p className="text-sm text-gray-700">
                      <strong>온도 의존성:</strong> 온도가 올라가면 D가 지수적으로 증가<br/>
                      → 고온에서 확산이 빠르게 진행됩니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5">
                <h3 className="font-bold text-gray-800 mb-3">🔥 Diffusion Furnace 구조</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <svg viewBox="0 0 700 400" className="w-full">
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
              <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📥</span>
                  Pre-deposition (정원 확산)
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-800"><strong>조건:</strong> 표면에 무한한 도펀트 공급</p>
                  <p className="font-mono text-purple-700 bg-white p-2 rounded">C(x,t) = C₀ · erfc(x/2√Dt)</p>
                  <p className="text-gray-700">
                    • 표면 농도(C₀)는 일정<br/>
                    • 짧은 시간 (15-60분)<br/>
                    • 목적: 높은 표면 농도 확보
                  </p>
                </div>
              </div>
              
              <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📤</span>
                  Drive-in (제한 확산)
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-800"><strong>조건:</strong> 고정된 도즈(Q), 가스 차단</p>
                  <p className="font-mono text-orange-700 bg-white p-2 rounded">C(x,t) = Q/√πDt · exp(-x²/4Dt)</p>
                  <p className="text-gray-700">
                    • 표면 농도는 시간에 따라 감소<br/>
                    • 긴 시간 (수 시간)<br/>
                    • 목적: 깊은 접합 형성, 재분포
                  </p>
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

          {/* Diffusion Furnace Schematic */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">확산 공정 Furnace 개략도</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <svg viewBox="0 0 900 500" style={{ width: '100%', height: '500px', backgroundColor: '#f8f9fa' }}>
                {/* Background */}
                <rect width="900" height="500" fill="#f8f9fa" />

                {/* Gas Input Lines */}
                {/* O2 Line */}
                <line x1="50" y1="180" x2="180" y2="180" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="180" x2="180" y2="190" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="190" x2="270" y2="190" stroke="#333" strokeWidth="3" />

                {/* N2 Line */}
                <line x1="50" y1="240" x2="180" y2="240" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="240" x2="180" y2="210" stroke="#333" strokeWidth="3" />
                <line x1="180" y1="210" x2="270" y2="210" stroke="#333" strokeWidth="3" />

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
                <polygon points="200,195 215,200 200,205" fill="#333" />

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
            <div className="bg-white rounded-lg p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">⚙️ Ion Implantation 장치 구성도</h3>
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-b from-gray-50 to-gray-100">
                <svg viewBox="0 0 800 300" className="w-full">
                  {/* Ion Source */}
                  <rect x="20" y="100" width="80" height="100" fill="#ef4444" stroke="#991b1b" strokeWidth="2" rx="5"/>
                  <text x="35" y="140" fontSize="12" fill="white" fontWeight="bold">Ion Source</text>
                  <text x="30" y="160" fontSize="10" fill="white">이온원</text>
                  <text x="25" y="180" fontSize="9" fill="#fef2f2">BF₃, PH₃, As</text>
                  
                  {/* Plasma effect */}
                  <circle cx="60" cy="130" r="3" fill="#fbbf24" opacity="0.8"/>
                  <circle cx="55" cy="145" r="2" fill="#fbbf24" opacity="0.6"/>
                  <circle cx="70" cy="140" r="2.5" fill="#fbbf24" opacity="0.7"/>
                  
                  {/* Extraction */}
                  <line x1="100" y1="150" x2="160" y2="150" stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrow1)"/>
                  <defs>
                    <marker id="arrow1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                    </marker>
                  </defs>
                  <text x="110" y="140" fontSize="10" fill="#1f2937">Extraction</text>
                  
                  {/* Mass Separator (Magnet) */}
                  <path d="M 160 100 L 240 100 Q 260 100 260 120 L 260 180 Q 260 200 240 200 L 160 200 Z" 
                        fill="#8b5cf6" stroke="#5b21b6" strokeWidth="2"/>
                  <text x="170" y="140" fontSize="12" fill="white" fontWeight="bold">Mass</text>
                  <text x="165" y="155" fontSize="12" fill="white" fontWeight="bold">Separator</text>
                  <text x="170" y="175" fontSize="10" fill="#ede9fe">질량 분리</text>
                  
                  {/* Magnet poles */}
                  <text x="165" y="90" fontSize="20" fill="#dc2626">N</text>
                  <text x="165" y="225" fontSize="20" fill="#2563eb">S</text>
                  
                  {/* Curved beam path */}
                  <path d="M 260 150 Q 280 130 310 130" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="5,3"/>
                  <circle cx="310" cy="130" r="3" fill="#3b82f6"/>
                  <text x="270" y="120" fontSize="9" fill="#6b7280">Unwanted ions</text>
                  
                  <path d="M 260 150 Q 290 150 320 150" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrow2)"/>
                  <defs>
                    <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
                    </marker>
                  </defs>
                  <text x="270" y="170" fontSize="9" fill="#15803d" fontWeight="bold">Selected ions</text>
                  
                  {/* Accelerator */}
                  <rect x="320" y="120" width="100" height="60" fill="#f59e0b" stroke="#b45309" strokeWidth="2" rx="5"/>
                  <text x="335" y="145" fontSize="12" fill="white" fontWeight="bold">Accelerator</text>
                  <text x="345" y="165" fontSize="10" fill="white">가속관</text>
                  
                  {/* Acceleration stages */}
                  <line x1="340" y1="130" x2="340" y2="170" stroke="white" strokeWidth="2"/>
                  <line x1="360" y1="130" x2="360" y2="170" stroke="white" strokeWidth="2"/>
                  <line x1="380" y1="130" x2="380" y2="170" stroke="white" strokeWidth="2"/>
                  <line x1="400" y1="130" x2="400" y2="170" stroke="white" strokeWidth="2"/>
                  
                  <text x="325" y="195" fontSize="9" fill="#92400e">10-400 keV</text>
                  
                  {/* Beam after acceleration */}
                  <line x1="420" y1="150" x2="480" y2="150" stroke="#22c55e" strokeWidth="5" markerEnd="url(#arrow3)"/>
                  <defs>
                    <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
                    </marker>
                  </defs>
                  
                  {/* Scanner */}
                  <rect x="480" y="120" width="80" height="60" fill="#06b6d4" stroke="#0e7490" strokeWidth="2" rx="5"/>
                  <text x="495" y="145" fontSize="12" fill="white" fontWeight="bold">Scanner</text>
                  <text x="495" y="165" fontSize="10" fill="white">스캐너</text>
                  
                  {/* Scanning motion */}
                  <path d="M 510 135 L 530 125 L 550 135" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M 510 155 L 530 165 L 550 155" stroke="white" strokeWidth="2" fill="none"/>
                  
                  {/* Scattered beam */}
                  <line x1="560" y1="140" x2="620" y2="120" stroke="#22c55e" strokeWidth="3" opacity="0.7"/>
                  <line x1="560" y1="150" x2="620" y2="150" stroke="#22c55e" strokeWidth="4"/>
                  <line x1="560" y1="160" x2="620" y2="180" stroke="#22c55e" strokeWidth="3" opacity="0.7"/>
                  
                  <circle cx="620" cy="120" r="2" fill="#22c55e"/>
                  <circle cx="620" cy="150" r="2" fill="#22c55e"/>
                  <circle cx="620" cy="180" r="2" fill="#22c55e"/>
                  
                  {/* Wafer Chamber */}
                  <rect x="620" y="80" width="150" height="140" fill="#475569" stroke="#1e293b" strokeWidth="2" rx="5"/>
                  <text x="640" y="105" fontSize="12" fill="white" fontWeight="bold">Wafer Chamber</text>
                  <text x="655" y="125" fontSize="10" fill="#cbd5e1">웨이퍼 챔버</text>
                  
                  {/* Wafer */}
                  <ellipse cx="695" cy="165" rx="40" ry="35" fill="#64748b" stroke="#334155" strokeWidth="2"/>
                  <ellipse cx="695" cy="162" rx="38" ry="33" fill="#94a3b8"/>
                  
                  {/* Tilt angle */}
                  <line x1="695" y1="130" x2="695" y2="200" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2"/>
                  <line x1="695" y1="165" x2="675" y2="145" stroke="#334155" strokeWidth="2"/>
                  <path d="M 685 155 Q 690 160 695 160" stroke="#ef4444" strokeWidth="2" fill="none"/>
                  <text x="665" y="155" fontSize="9" fill="#ef4444" fontWeight="bold">7°</text>
                  
                  {/* Ion implantation effect */}
                  <circle cx="680" cy="165" r="2" fill="#22c55e" opacity="0.8"/>
                  <circle cx="690" cy="170" r="1.5" fill="#22c55e" opacity="0.7"/>
                  <circle cx="700" cy="168" r="1.5" fill="#22c55e" opacity="0.7"/>
                  <circle cx="695" cy="175" r="1" fill="#22c55e" opacity="0.6"/>
                  
                  <text x="640" y="210" fontSize="9" fill="#cbd5e1">Vacuum: 10⁻⁵ ~ 10⁻⁶ Torr</text>
                </svg>
              </div>
              
              <div className="grid md:grid-cols-5 gap-3 text-sm mt-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="font-bold text-red-900 mb-1">1️⃣ Ion Source</p>
                  <p className="text-xs text-gray-700">가스를 플라즈마화하여 이온 생성</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="font-bold text-purple-900 mb-1">2️⃣ Mass Separator</p>
                  <p className="text-xs text-gray-700">자기장으로 원하는 이온만 선택</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="font-bold text-orange-900 mb-1">3️⃣ Accelerator</p>
                  <p className="text-xs text-gray-700">고전압으로 이온 가속 (에너지 제어)</p>
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                  <p className="font-bold text-cyan-900 mb-1">4️⃣ Scanner</p>
                  <p className="text-xs text-gray-700">빔을 스캔하여 웨이퍼 전체 주입</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                  <p className="font-bold text-gray-900 mb-1">5️⃣ Chamber</p>
                  <p className="text-xs text-gray-700">진공 상태에서 웨이퍼 고정</p>
                </div>
              </div>
            </div>

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

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">이온 주입 시뮬레이터</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  도펀트 종류
                </label>
                <select
                  value={implDopantType}
                  onChange={(e) => setImplDopantType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(dopantProperties).map(([key, prop]) => (
                    <option key={key} value={key}>
                      {prop.nameKo} ({prop.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-orange-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-orange-800">
                  에너지: {implEnergy} keV
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={implEnergy}
                  onChange={(e) => setImplEnergy(Number(e.target.value))}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 keV</span>
                  <span>200 keV</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-purple-800">
                  도즈: {(implDose).toExponential(1)} ions/cm²
                </label>
                <input
                  type="range"
                  min="12"
                  max="16"
                  step="0.1"
                  value={Math.log10(implDose)}
                  onChange={(e) => setImplDose(Math.pow(10, Number(e.target.value)))}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-purple"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10¹²</span>
                  <span>10¹⁶</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-indigo-200 shadow-sm">
                <label className="block text-sm font-medium mb-2 text-indigo-800">
                  경사각 (Tilt): {implTilt}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={implTilt}
                  onChange={(e) => setImplTilt(Number(e.target.value))}
                  className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-indigo"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°</span>
                  <span>15°</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={implAnnealing}
                    onChange={(e) => setImplAnnealing(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Annealing (열처리) 적용
                </label>
                {implAnnealing && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="p-2 bg-white rounded border-2 border-red-200">
                      <label className="block text-xs font-medium text-red-800 mb-1">
                        온도: {annealTemp}°C
                      </label>
                      <input
                        type="range"
                        min="700"
                        max="1100"
                        step="50"
                        value={annealTemp}
                        onChange={(e) => setAnnealTemp(Number(e.target.value))}
                        className="w-full h-4 rounded-lg appearance-none cursor-pointer slider-thumb-red"
                      />
                    </div>
                    <div className="p-2 bg-white rounded border-2 border-blue-200">
                      <label className="block text-xs font-medium text-blue-800 mb-1">
                        시간: {annealTime}분
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        step="5"
                        value={annealTime}
                        onChange={(e) => setAnnealTime(Number(e.target.value))}
                        className="w-full h-4 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              이온 주입 프로파일 (Implantation Profile)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={calculateImplantationProfile()}>
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
                  stroke={dopantProperties[implDopantType].color}
                  strokeWidth={3}
                  dot={false}
                  name={implAnnealing ? "Annealing 후" : "As-implanted"}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">주입 결과</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">투영 거리 (Rp)</div>
                <div className="text-2xl font-bold text-orange-600">
                  {calculateImplantParams(implEnergy, implDopantType).Rp.toFixed(3)}
                </div>
                <div className="text-xs text-gray-500">μm</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">스트래글 (ΔRp)</div>
                <div className="text-2xl font-bold text-red-600">
                  {calculateImplantParams(implEnergy, implDopantType).deltaRp.toFixed(3)}
                </div>
                <div className="text-xs text-gray-500">μm</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">도즈 (Φ)</div>
                <div className="text-2xl font-bold text-purple-600">
                  {(implDose).toExponential(1)}
                </div>
                <div className="text-xs text-gray-500">ions/cm²</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">피크 농도</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const { deltaRp } = calculateImplantParams(implEnergy, implDopantType);
                    const peakConc = implDose / (Math.sqrt(2 * Math.PI) * deltaRp * 1e-4);
                    return peakConc.toExponential(1);
                  })()}
                </div>
                <div className="text-xs text-gray-500">/cm³</div>
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
