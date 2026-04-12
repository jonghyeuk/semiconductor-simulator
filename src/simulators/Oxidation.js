import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

// Simple icon components
const PlayIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
  </svg>
);

const OxidationSimulator = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'theory');
  const [temperature, setTemperature] = useState(1000);
  const [time, setTime] = useState(60);
  const [pressure, setPressure] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  
  const [gasFlows, setGasFlows] = useState({
    O2: 0,
    H2O: 0,
    H2: 0,
    N2: 100,
    HCl: 0
  });
  const [processMode, setProcessMode] = useState('standby');
  const [furnaceLoaded, setFurnaceLoaded] = useState(false);
  const [heaterOn, setHeaterOn] = useState(false);
  
  const [oxideThickness, setOxideThickness] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  const [stress, setStress] = useState(0);
  const [refractiveIndex, setRefractiveIndex] = useState(1.46);
  
  const [animatedThickness, setAnimatedThickness] = useState(10);
  const [temperatureBlink, setTemperatureBlink] = useState(true);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Theory opening animation states
  const [theoryStep, setTheoryStep] = useState(0);
  const [isTheoryPlaying, setIsTheoryPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showDetailedTheory, setShowDetailedTheory] = useState(false);

  const [simOrientation, setSimOrientation] = useState('100');
  const [simDopingLevel, setSimDopingLevel] = useState(0);
  const [simInitialOxide, setSimInitialOxide] = useState(0);
  const [simTemperature, setSimTemperature] = useState(1000);
  const [simPressure, setSimPressure] = useState(1);
  const [showSimResult, setShowSimResult] = useState(false);

  // Troubleshooting states
  const [troubleActiveScenario, setTroubleActiveScenario] = useState(1);
  const [troubleIsStarted, setTroubleIsStarted] = useState(false);
  const [troubleIsTriggered, setTroubleIsTriggered] = useState(false);
  const [troubleElapsedTime, setTroubleElapsedTime] = useState(0);
  const [troubleIsSuccess, setTroubleIsSuccess] = useState(false);
  const [troubleIsFailed, setTroubleIsFailed] = useState(false);

  const [troubleSituationText, setTroubleSituationText] = useState('');
  const [troubleSituationIndex, setTroubleSituationIndex] = useState(0);
  const [troubleShowSituation, setTroubleShowSituation] = useState(false);

  const [troubleZoneTemps, setTroubleZoneTemps] = useState([1000, 1000, 1000, 1000, 1000, 1000]);
  const [troubleZoneCurrents, setTroubleZoneCurrents] = useState([45, 45, 45, 45, 45, 45]);
  const [troubleGasFlows, setTroubleGasFlows] = useState({ O2: 100, N2: 200, H2: 50 });
  const [troubleChamberPressure, setTroubleChamberPressure] = useState(0.005);
  const [troubleWaferLoaded, setTroubleWaferLoaded] = useState(true);

  const [troubleHeaterZones, setTroubleHeaterZones] = useState([true, true, true, true, true, true]);

  const [troubleAutoGasInterlock, setTroubleAutoGasInterlock] = useState(true);
  const [troubleMfcValves, setTroubleMfcValves] = useState({ O2: true, N2: true, H2: true });
  const [troubleManualValves, setTroubleManualValves] = useState({ O2: true, N2: true, H2: true });
  const [troubleTotalGasValve, setTroubleTotalGasValve] = useState(true);
  const [troublePumpRunning, setTroublePumpRunning] = useState(true);
  const [troubleExhaustValve, setTroubleExhaustValve] = useState(true);
  const [troublePumpRepaired, setTroublePumpRepaired] = useState(false);

  const [troubleScenario1Step, setTroubleScenario1Step] = useState(0);
  const [troubleOverheatingZone, setTroubleOverheatingZone] = useState(2);

  const [troubleScenario2FaultZone, setTroubleScenario2FaultZone] = useState(0);
  const [troubleScenario2OpenedBoxes, setTroubleScenario2OpenedBoxes] = useState([false, false, false, false, false, false]);
  const [troubleScenario2Found, setTroubleScenario2Found] = useState(false);
  const [troubleScenario2Repaired, setTroubleScenario2Repaired] = useState(false);
  const [troubleUniformity, setTroubleUniformity] = useState(85);
  const [troubleNormalCurrent, setTroubleNormalCurrent] = useState(45);
  const [troubleFaultCurrent, setTroubleFaultCurrent] = useState(0);

  const [troubleScenario3Step, setTroubleScenario3Step] = useState(0);
  const [troubleScenario3Warnings, setTroubleScenario3Warnings] = useState([]);
  const [troubleTriedMfc, setTroubleTriedMfc] = useState({ O2: false, N2: false, H2: false });

  const tabs = [
    { id: 'theory', name: '이론', icon: '🎬' },
    { id: 'overview', name: '산화 공정 개요', icon: '🔥' },
    { id: 'thermal', name: '열산화 실험', icon: '🌡️' },
    { id: 'analysis', name: '산화 영향 인자', icon: '📊' },
    { id: 'quiz', name: '산화 평가', icon: '📝' },
    { id: 'troubleshooting', name: '트러블슈팅', icon: '🔧' }
  ];

  const calculateOxideGrowth = (temp, time, atm, gasFlowRate = 100) => {
    const tempK = temp + 273.15;
    let B, A;
    
    if (atm === 'dry') {
      const B0 = 3.0e7;
      const Ea = 1.23;
      B = B0 * Math.exp(-Ea / (8.617e-5 * tempK));
      A = 165 * Math.exp(-2.0 / (8.617e-5 * tempK));
    } else {
      const B0 = 7.7e7;
      const Ea = 0.78;
      B = B0 * Math.exp(-Ea / (8.617e-5 * tempK));
      A = 226 * Math.exp(-2.0 / (8.617e-5 * tempK));
    }
    
    const flowFactor = 0.5 + (gasFlowRate / 100) * 0.5;
    const timeHours = time / 60;
    const discriminant = A * A + 4 * B * timeHours;
    let thickness = (-A + Math.sqrt(discriminant)) / 2;
    thickness = thickness * flowFactor;
    
    return Math.max(0, Math.min(thickness, 1000));
  };

  const calculateOrientationRate = (orientation) => {
    const rates = { '100': 1.0, '110': 1.25, '111': 1.68 };
    return rates[orientation] || 1.0;
  };

  const calculateDopingRate = (dopingLevel) => {
    if (dopingLevel === 0) return 1.0;
    return 1.0 + (dopingLevel / 10) * 2.0;
  };

  const calculateInitialOxideRate = (initialThickness) => {
    if (initialThickness === 0) return 1.0;
    return 1.0 / (1.0 + initialThickness / 100);
  };

  const calculateTempPressureRate = (temp, pressure) => {
    const tempBase = 1000;
    const tempEffect = Math.exp(-1.23 / (8.617e-5 * (temp + 273.15))) / 
                       Math.exp(-1.23 / (8.617e-5 * (tempBase + 273.15)));
    const pressureEffect = pressure;
    return tempEffect * pressureEffect;
  };

  const calculateTotalSimRate = () => {
    const orientationEffect = calculateOrientationRate(simOrientation);
    const dopingEffect = calculateDopingRate(simDopingLevel);
    const initialOxideEffect = calculateInitialOxideRate(simInitialOxide);
    const tempPressureEffect = calculateTempPressureRate(simTemperature, simPressure);
    
    return orientationEffect * dopingEffect * initialOxideEffect * tempPressureEffect;
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    
    const oxidationType = (processMode === 'wet' || processMode === 'pyrogenic') ? 'wet' : 'dry';
    
    let effectiveGasFlow = 0;
    if (oxidationType === 'wet') {
      effectiveGasFlow = gasFlows.H2O;
      if (processMode === 'pyrogenic') {
        effectiveGasFlow = Math.min(gasFlows.H2 * 2, gasFlows.O2);
      }
    } else {
      effectiveGasFlow = gasFlows.O2;
    }
    
    if (effectiveGasFlow === 0) {
      alert('경고: 산화 가스 플로우가 0입니다. 가스를 공급해주세요.');
      setIsSimulating(false);
      return;
    }
    
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          
          const thickness = calculateOxideGrowth(temperature, time, oxidationType, effectiveGasFlow);
          setOxideThickness(thickness);
          setGrowthRate(thickness / time);
          
          const thermalMismatch = (temperature - 25) * 2.3e-6;
          setStress(-300 * thermalMismatch * thickness);
          
          const densityFactor = Math.min(thickness / 100, 1);
          setRefractiveIndex(1.46 + 0.02 * densityFactor);
          
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const generateGrowthData = () => {
    const data = [];
    for (let temp = 800; temp <= 1200; temp += 50) {
      const dryThickness = calculateOxideGrowth(temp, 60, 'dry', 100);
      const wetThickness = calculateOxideGrowth(temp, 60, 'wet', 150);
      data.push({
        temperature: temp,
        dry: dryThickness,
        wet: wetThickness
      });
    }
    return data;
  };

  const generateTimeData = () => {
    const data = [];
    const oxidationType = (processMode === 'wet' || processMode === 'pyrogenic') ? 'wet' : 'dry';
    
    let effectiveGasFlow = 100;
    if (oxidationType === 'wet') {
      effectiveGasFlow = gasFlows.H2O > 0 ? gasFlows.H2O : 100;
      if (processMode === 'pyrogenic') {
        effectiveGasFlow = Math.min(gasFlows.H2 * 2, gasFlows.O2);
      }
    } else {
      effectiveGasFlow = gasFlows.O2 > 0 ? gasFlows.O2 : 100;
    }
    
    for (let t = 10; t <= 180; t += 10) {
      const thickness = calculateOxideGrowth(temperature, t, oxidationType, effectiveGasFlow);
      data.push({
        time: t,
        thickness: thickness,
        rate: thickness / t
      });
    }
    return data;
  };

  // Theory opening steps
  const theorySteps = [
    {
      title: "🎯 산화(Oxidation)란?",
      content: "실리콘 웨이퍼 표면에 산소를 반응시켜 SiO₂(이산화규소) 절연막을 형성하는 핵심 공정입니다.\n\n" +
               "마치 철이 녹슬어 산화철(Fe₂O₃)을 만드는 것처럼, 실리콘도 고온에서 산소와 반응하여 산화막을 형성합니다.\n\n" +
               "💡 **놀라운 특성**: SiO₂는 자연계에서 가장 안정적인 절연체 중 하나!\n" +
               "   • 절연파괴 전압: **1,000만 V/cm** 이상\n" +
               "   • Si와의 계면 결함 밀도: **10¹⁰ /cm²** 수준\n" +
               "   • 열팽창 계수가 Si와 거의 동일 → 열적 스트레스 최소화\n\n" +
               "산화막은 트랜지스터의 게이트 절연막, 소자 간 격리, 확산 마스크, 패시베이션층 등 반도체 공정 전반에 사용됩니다.",
      highlight: "반도체 산업의 근간! SiO₂ 없이는 현대 전자기기가 불가능합니다.",
      icon: "🎯"
    },
    {
      title: "🔬 건식 vs 습식 산화",
      content: "산화 방법은 사용하는 산화제에 따라 크게 두 가지로 나뉩니다.\n\n" +
               "**1️⃣ 건식 산화(Dry Oxidation)**\n" +
               "   • 반응식: Si + O₂ → SiO₂\n" +
               "   • 온도: **900~1,200°C**\n" +
               "   • 성장 속도: **느림** (10~100 nm/hr)\n" +
               "   • 막질: **치밀하고 높은 품질** → 게이트 산화막에 사용\n" +
               "   • 특징: 결함 밀도가 낮고 절연 특성 우수\n\n" +
               "**2️⃣ 습식 산화(Wet Oxidation)**\n" +
               "   • 반응식: Si + 2H₂O → SiO₂ + 2H₂\n" +
               "   • 온도: **900~1,100°C**\n" +
               "   • 성장 속도: **빠름** (100~500 nm/hr, 건식의 **5~10배**)\n" +
               "   • 막질: 다소 성김 → 필드 산화막, 두꺼운 절연막에 사용\n" +
               "   • 특징: 빠른 성장이 필요한 경우 사용\n\n" +
               "💧 **Pyrogenic 산화**: H₂ + O₂ → H₂O (고순도 수증기 생성)",
      highlight: "용도에 따라 선택! 게이트 산화막은 건식, 두꺼운 절연막은 습식",
      icon: "🔬"
    },
    {
      title: "📈 Deal-Grove 모델과 산화 이론",
      content: "1965년 Bruce Deal과 Andrew Grove가 확립한 산화 성장 이론입니다.\n\n" +
               "**🔬 산화 메커니즘 (3단계)**\n\n" +
               "1️⃣ **산화제 확산** (O₂ 또는 H₂O)\n" +
               "   • 가스 상태 → 산화막 표면으로 확산\n" +
               "   • 확산 속도는 압력과 온도에 의존\n\n" +
               "2️⃣ **산화막 내부 확산**\n" +
               "   • 산화막을 통과하여 Si/SiO₂ 계면으로 이동\n" +
               "   • **속도 제한 단계** → 두꺼워질수록 느려짐\n\n" +
               "3️⃣ **계면 반응**\n" +
               "   • Si와 O₂(또는 H₂O)의 화학 반응\n" +
               "   • Si가 소모되며 산화막 형성\n\n" +
               "**📐 Deal-Grove 방정식**\n" +
               "```\n" +
               "x² + Ax = B(t + τ)\n" +
               "```\n" +
               "x: 산화막 두께, t: 시간\n" +
               "A: 선형 속도 상수 (계면 반응 속도)\n" +
               "B: 포물선 속도 상수 (확산 속도)\n\n" +
               "🌡️ **온도 의존성**: Arrhenius 법칙\n" +
               "   • 온도 **100°C 상승** → 성장 속도 **2~3배** 증가\n" +
               "   • 활성화 에너지: **Ea = 1.23 eV** (건식), **0.78 eV** (습식)",
      highlight: "반도체 공정의 정량적 예측을 가능케 한 획기적 모델!",
      icon: "📈"
    },
    {
      title: "🏭 실제 산업 응용",
      content: "산화 공정은 반도체 제조의 **가장 기본적이면서도 중요한** 단계입니다.\n\n" +
               "**🖥️ Logic 소자 (CPU/GPU)**\n" +
               "   • **게이트 산화막**: 2~10 nm 초박막 (건식)\n" +
               "   • 최신 3nm 공정: **High-k** 물질과 결합 (HfO₂)\n" +
               "   • Intel, TSMC, Samsung 핵심 공정\n\n" +
               "**💾 메모리 소자**\n" +
               "   • **ONO 구조** (Oxide-Nitride-Oxide): Flash 메모리\n" +
               "   • **터널 산화막**: 8~10 nm (전하 터널링 제어)\n" +
               "   • **STI**(Shallow Trench Isolation): 300~500 nm (습식)\n\n" +
               "**📱 파워 반도체**\n" +
               "   • **두꺼운 산화막**: 50~100 nm (절연 및 패시베이션)\n" +
               "   • SiC 산화: 차세대 전기차용 파워 소자\n\n" +
               "**🌐 MEMS/센서**\n" +
               "   • 희생층(sacrificial layer) 공정\n" +
               "   • 보호막 및 구조층\n\n" +
               "**🔧 엔지니어의 역할**\n" +
               "   • 온도, 시간, 분위기 최적화로 목표 두께 달성\n" +
               "   • 균일도(Uniformity) **±1% 이내** 관리\n" +
               "   • 결함 밀도 최소화 → 수율 향상",
      highlight: "반도체 공정의 시작과 끝! 모든 소자에 필수적입니다.",
      icon: "🏭"
    },
    {
      title: "🎓 이 시뮬레이터로 배우는 내용",
      content: "Deal-Grove 이론을 실제로 체험하며 산화 공정을 완벽히 이해할 수 있습니다.\n\n" +
               "**📚 각 탭별 학습 목표**\n\n" +
               "1️⃣ **개요(Overview)**: 산화 공정의 기초와 핵심 개념\n" +
               "   • 산화막의 역할과 중요성\n" +
               "   • 건식 vs 습식 비교\n\n" +
               "2️⃣ **열산화 실험(Thermal)**: 장비 조작 시뮬레이션\n" +
               "   • 온도, 시간, 분위기 설정\n" +
               "   • 실시간 산화막 성장 관찰\n" +
               "   • Deal-Grove 곡선 확인\n\n" +
               "3️⃣ **산화 영향 인자(Analysis)**: 파라미터 효과 분석\n" +
               "   • **결정 방향**: (100), (110), (111)에 따른 성장 속도 차이\n" +
               "   • **도핑 농도**: 불순물이 산화 속도에 미치는 영향\n" +
               "   • **초기 산화막**: 성장 초기 특성 (linear regime)\n" +
               "   • **온도와 압력**: 활성화 에너지의 실제 효과\n\n" +
               "4️⃣ **평가(Quiz)**: 학습 내용 점검\n\n" +
               "**💡 학습 방법**\n" +
               "   ① 이론 먼저 읽고 → ② 시뮬레이터로 실습\n" +
               "   ③ 조건 변경하며 결과 관찰 → ④ 그래프로 경향성 파악\n\n" +
               "**🎯 학습 목표**\n" +
               "   • Deal-Grove 모델 완벽 이해\n" +
               "   • 건식/습식 산화 특성 비교\n" +
               "   • 실무 엔지니어처럼 최적 조건 도출!",
      highlight: "지금 바로 열산화 퍼니스(Furnace)를 가동해 보세요! 🔥",
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
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [isTheoryPlaying, theoryStep]);

  // Theory control functions
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

  const quizQuestions = [
    {
      question: "열산화에서 Deal-Grove 모델의 주요 매개변수는?",
      options: ["온도와 시간", "압력과 유량", "전력과 주파수", "농도와 pH"],
      correct: 0
    },
    {
      question: "습식 산화와 건식 산화의 주요 차이점은?",
      options: ["온도", "성장 속도", "압력", "전기적 특성"],
      correct: 1
    },
    {
      question: "산화막의 압축 응력의 주요 원인은?",
      options: ["불순물", "온도 차이", "밀도 차이", "두께"],
      correct: 2
    },
    {
      question: "실리콘 산화막의 굴절률은 대략?",
      options: ["1.0", "1.46", "2.1", "3.4"],
      correct: 1
    },
    {
      question: "실리콘의 결정면 중 산화 속도가 가장 빠른 면은?",
      options: ["{100} 면", "{110} 면", "{111} 면", "모두 동일"],
      correct: 2
    },
    {
      question: "Boron(붕소) 도핑이 산화 속도에 미치는 영향은?",
      options: ["산화 속도 감소", "산화 속도 증가", "영향 없음", "산화막 품질만 영향"],
      correct: 1
    },
    {
      question: "초기 산화막이 두꺼울수록 추가 산화 속도는?",
      options: ["빨라진다", "느려진다", "변화없다", "일정하게 유지"],
      correct: 1
    },
    {
      question: "1100°C 건식 산화 1시간 후 예상되는 산화막 두께는?",
      options: ["약 5nm", "약 30nm", "약 100nm", "약 300nm"],
      correct: 1
    },
    {
      question: "습식 산화가 건식 산화보다 빠른 주된 이유는?",
      options: ["온도가 더 높아서", "H₂O의 확산 계수가 O₂보다 커서", "압력이 더 높아서", "촉매 효과 때문에"],
      correct: 1
    },
    {
      question: "산화 공정에서 HCl을 첨가하는 주된 목적은?",
      options: ["산화 속도 증가", "금속 불순물 제거", "산화막 두께 감소", "전기적 특성 개선"],
      correct: 1
    }
  ];

  useEffect(() => {
    const growthInterval = setInterval(() => {
      setAnimatedThickness(prev => {
        const newThickness = prev + 2;
        return newThickness > 50 ? 10 : newThickness;
      });
    }, 150);
    return () => clearInterval(growthInterval);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setTemperatureBlink(prev => !prev);
    }, 800);
    return () => clearInterval(blinkInterval);
  }, []);

  const submitAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct.toString()) {
      setScore(score + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  // Troubleshooting scenarios data
  const troubleScenarios = {
    1: {
      name: "히팅존 과열",
      icon: "🔥",
      color: "from-orange-500 to-red-600",
      description: "Zone 온도가 급상승 중! 순서대로 긴급 조치 필요",
      isDetective: false
    },
    2: {
      name: "TC 센서 오류",
      icon: "🔍",
      color: "from-blue-500 to-purple-600",
      description: "산화막 불균일 - 모든 Zone 정상 표시인데 뭔가 이상하다?",
      isDetective: true
    },
    3: {
      name: "펌프 고장 + 인터락 실패",
      icon: "⚡",
      color: "from-yellow-500 to-orange-600",
      description: "펌프 정지했는데 가스 인터락이 작동 안 함! 수동 차단 필요!",
      isDetective: false
    }
  };

  const troubleSituationMessages = {
    1: [
      "🏭 열산화 공정 정상 진행 중...",
      "📊 Zone1~6 온도: 1000°C 균일 유지",
      "⚠️ 경고! Zone TC(열전대) 이상 감지!",
      "🔥 온도 급상승! 1050°C 초과!",
      "🚨 긴급 조치가 필요합니다!"
    ],
    2: [
      "🏭 산화 공정 완료, 웨이퍼 측정 중...",
      "📊 막두께 측정 결과... 불균일 발생!",
      "🤔 이상하다... 모든 Zone이 1000°C 표시인데?",
      "💭 TC 센서가 잘못된 값을 읽고 있나?",
      "🔧 컨트롤 박스를 열어 실제 전류를 확인하세요!"
    ],
    3: [
      "🏭 Pyrogenic 산화 공정 진행 중...",
      "⚡ H₂/O₂/N₂ 가스 공급 중...",
      "🔔 펌프 이상 경보! 배기펌프 정지!",
      "⚠️ 배기밸브 자동 차단됨...",
      "🚨 그런데 가스가 계속 나온다?! 인터락 고장!",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "📋 복구 지령:",
      "  1️⃣ 가스 밸브 모두 차단 (수동밸브 or 토탈밸브)",
      "  2️⃣ 펌프 수리",
      "  3️⃣ 배기밸브 열고 진공 배기",
      "  4️⃣ 챔버 내 잔류가스 제거 (5×10⁻³ Torr 이하)"
    ]
  };

  const formatTroublePressure = (p) => {
    if (p < 0.01) return p.toExponential(1) + ' Torr';
    if (p < 1) return p.toFixed(3) + ' Torr';
    return p.toFixed(0) + ' Torr';
  };

  const formatTroubleTime = (s) => `${Math.floor(s/60)}:${(Math.floor(s%60)).toString().padStart(2,'0')}`;

  const addTroubleWarning = (msg) => {
    setTroubleScenario3Warnings(prev => [...prev.slice(-3), { msg, id: Date.now() }]);
  };

  const getTroubleActualGasFlow = (gas) => {
    if (!troubleTotalGasValve) return 0;
    if (!troubleManualValves[gas]) return 0;
    if (!troubleMfcValves[gas]) return 0;
    return troubleGasFlows[gas];
  };

  const getTroubleTotalGasSupply = () => {
    return getTroubleActualGasFlow('O2') + getTroubleActualGasFlow('N2') + getTroubleActualGasFlow('H2');
  };

  const handleTroubleStart = () => {
    setTroubleIsStarted(true);
    setTroubleIsTriggered(false);
    setTroubleElapsedTime(0);
    setTroubleIsSuccess(false);
    setTroubleIsFailed(false);
    setTroubleSituationText('');
    setTroubleSituationIndex(0);
    setTroubleShowSituation(true);

    setTroubleZoneTemps([1000, 1000, 1000, 1000, 1000, 1000]);
    setTroubleGasFlows({ O2: 100, N2: 200, H2: 50 });
    setTroubleChamberPressure(0.005);
    setTroubleWaferLoaded(true);

    setTroubleHeaterZones([true, true, true, true, true, true]);
    setTroubleAutoGasInterlock(true);
    setTroubleMfcValves({ O2: true, N2: true, H2: true });
    setTroubleManualValves({ O2: true, N2: true, H2: true });
    setTroubleTotalGasValve(true);
    setTroublePumpRunning(true);
    setTroubleExhaustValve(true);
    setTroublePumpRepaired(false);

    setTroubleScenario1Step(0);
    setTroubleOverheatingZone(Math.floor(Math.random() * 6));

    const faultZone = Math.floor(Math.random() * 6);
    setTroubleScenario2FaultZone(faultZone);
    setTroubleScenario2OpenedBoxes([false, false, false, false, false, false]);
    setTroubleScenario2Found(false);
    setTroubleScenario2Repaired(false);
    setTroubleUniformity(85);

    const normalA = 43 + Math.random() * 6;
    setTroubleNormalCurrent(normalA);
    const isTooHigh = Math.random() > 0.5;
    const faultA = isTooHigh ? (65 + Math.random() * 10) : (15 + Math.random() * 10);
    setTroubleFaultCurrent(faultA);

    const currents = [0,1,2,3,4,5].map(i =>
      i === faultZone ? faultA : (normalA + (Math.random() - 0.5) * 4)
    );
    setTroubleZoneCurrents(currents);

    setTroubleScenario3Step(0);
    setTroubleScenario3Warnings([]);
    setTroubleTriedMfc({ O2: false, N2: false, H2: false });
  };

  const handleTroubleReset = () => {
    setTroubleIsStarted(false);
    setTroubleIsTriggered(false);
    setTroubleIsSuccess(false);
    setTroubleIsFailed(false);
    setTroubleShowSituation(false);
    setTroubleSituationText('');
    setTroubleSituationIndex(0);
  };

  const openTroubleControlBox = (zoneIndex) => {
    setTroubleScenario2OpenedBoxes(prev => {
      const newOpened = [...prev];
      newOpened[zoneIndex] = true;
      return newOpened;
    });
  };

  const replaceTroubleTC = (zoneIndex) => {
    if (zoneIndex === troubleScenario2FaultZone) {
      setTroubleScenario2Found(true);
      setTroubleScenario2Repaired(true);
      setTroubleZoneCurrents(prev => prev.map((c, i) =>
        i === zoneIndex ? troubleNormalCurrent : c
      ));
    }
  };

  const tryTroubleMfcValve = (gas) => {
    setTroubleTriedMfc(prev => ({ ...prev, [gas]: true }));
    addTroubleWarning(`⚠️ ${gas} MFC 밸브 응답 없음! 솔레노이드 고장!`);
  };

  const toggleTroubleManualValve = (gas) => {
    setTroubleManualValves(prev => ({ ...prev, [gas]: !prev[gas] }));
    if (troubleManualValves[gas]) {
      addTroubleWarning(`✓ ${gas} 수동밸브 차단 완료`);
    }
  };

  const repairTroublePump = () => {
    if (troubleScenario3Step >= 1) {
      setTroublePumpRepaired(true);
    } else {
      addTroubleWarning('⚠️ 가스를 먼저 차단하세요! 위험합니다!');
    }
  };

  const openTroubleExhaustValve = () => {
    if (troublePumpRunning) {
      setTroubleExhaustValve(true);
    } else {
      addTroubleWarning('⚠️ 펌프가 정지 상태입니다!');
    }
  };

  const isTroubleCurrentAbnormal = (current) => current > 60 || current < 30;

  // Troubleshooting typing effect
  useEffect(() => {
    if (!troubleIsStarted || !troubleShowSituation) return;

    const messages = troubleSituationMessages[troubleActiveScenario];
    if (!messages) return;

    const currentFullText = messages.slice(0, troubleSituationIndex + 1).join('\n');

    if (troubleSituationText.length < currentFullText.length) {
      const timer = setTimeout(() => {
        setTroubleSituationText(currentFullText.slice(0, troubleSituationText.length + 1));
      }, 25);
      return () => clearTimeout(timer);
    } else if (troubleSituationIndex < messages.length - 1) {
      const timer = setTimeout(() => {
        setTroubleSituationIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setTroubleIsTriggered(true);
        if (troubleActiveScenario === 1) {
          setTroubleZoneTemps(prev => prev.map((t, i) => i === troubleOverheatingZone ? 1050 : t));
        }
        if (troubleActiveScenario === 3) {
          setTroublePumpRunning(false);
          setTroubleExhaustValve(false);
          setTroubleAutoGasInterlock(false);
          setTroubleChamberPressure(100);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [troubleIsStarted, troubleShowSituation, troubleSituationText, troubleSituationIndex, troubleActiveScenario, troubleOverheatingZone]);

  // Troubleshooting main simulation loop
  useEffect(() => {
    if (!troubleIsStarted || !troubleIsTriggered) return;

    const interval = setInterval(() => {
      setTroubleElapsedTime(prev => prev + 0.1);

      if (troubleIsSuccess || troubleIsFailed) return;

      // Scenario 1: Heater zone overheating
      if (troubleActiveScenario === 1) {
        setTroubleZoneTemps(prev => prev.map((t, i) => {
          if (i === troubleOverheatingZone) {
            if (!troubleHeaterZones[i]) return Math.max(800, t - 5);
            return Math.min(1200, t + 2);
          }
          if (!troubleHeaterZones[i]) return Math.max(25, t - 3);
          return t;
        }));

        if (troubleZoneTemps[troubleOverheatingZone] >= 1200) setTroubleIsFailed(true);

        if (troubleScenario1Step === 0 && !troubleHeaterZones[troubleOverheatingZone]) setTroubleScenario1Step(1);
        if (troubleScenario1Step === 1 && troubleManualValves.N2 && troubleGasFlows.N2 >= 300) setTroubleScenario1Step(2);
        if (troubleScenario1Step === 2 && troubleZoneTemps[troubleOverheatingZone] <= 900) setTroubleScenario1Step(3);
        if (troubleScenario1Step === 3) setTroubleIsSuccess(true);
      }

      // Scenario 2: TC error
      if (troubleActiveScenario === 2) {
        if (!troubleScenario2Repaired) {
          setTroubleUniformity(85);
          if (troubleElapsedTime > 300) setTroubleIsFailed(true);
        } else {
          setTroubleUniformity(prev => Math.min(98, prev + 0.3));
          if (troubleUniformity >= 95) setTroubleIsSuccess(true);
        }
      }

      // Scenario 3: Pump failure + interlock failure
      if (troubleActiveScenario === 3) {
        const gasSupply = getTroubleTotalGasSupply();

        if (!troubleExhaustValve && gasSupply > 0) {
          setTroubleChamberPressure(prev => Math.min(2000, prev + gasSupply * 0.015));
        } else if (troubleExhaustValve && troublePumpRunning) {
          setTroubleChamberPressure(prev => Math.max(760, prev - 8));
        }

        if (troubleChamberPressure >= 2000) setTroubleIsFailed(true);

        if (troubleScenario3Step === 0 && gasSupply === 0) {
          setTroubleScenario3Step(1);
        }
        if (troubleScenario3Step === 1 && troublePumpRepaired) {
          setTroublePumpRunning(true);
          setTroubleScenario3Step(2);
        }
        if (troubleScenario3Step === 2 && troubleExhaustValve) {
          setTroubleScenario3Step(3);
        }
        if (troubleScenario3Step === 3 && getTroubleActualGasFlow('N2') > 0 &&
            getTroubleActualGasFlow('O2') === 0 && getTroubleActualGasFlow('H2') === 0 &&
            troubleChamberPressure <= 780) {
          setTroubleIsSuccess(true);
        }
      }

    }, 100);

    return () => clearInterval(interval);
  }, [troubleIsStarted, troubleIsTriggered, troubleActiveScenario, troubleHeaterZones, troubleManualValves, troubleMfcValves,
      troubleTotalGasValve, troubleGasFlows, troubleZoneTemps, troubleOverheatingZone, troubleChamberPressure,
      troubleExhaustValve, troublePumpRunning, troubleIsSuccess, troubleIsFailed, troubleScenario1Step,
      troubleScenario2Repaired, troubleScenario3Step, troublePumpRepaired, troubleElapsedTime, troubleUniformity]);

  // SVG diagrams for each theory step
  const getTheorySVG = (step) => {
    switch(step) {
      case 0: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="ox_bg0" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#7c2d12"/><stop offset="100%" stopColor="#431407"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#ox_bg0)" rx="12"/>
          <text x="200" y="30" textAnchor="middle" fill="#fbbf24" fontSize="17" fontWeight="bold">열산화 공정 개요</text>
          <rect x="30" y="50" width="140" height="100" rx="8" fill="rgba(59,130,246,0.2)" stroke="#3b82f6"/>
          <text x="100" y="72" textAnchor="middle" fill="#93c5fd" fontSize="14" fontWeight="bold">Si 웨이퍼</text>
          <rect x="50" y="80" width="100" height="50" rx="4" fill="#475569"/>
          <text x="100" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="12">Silicon</text>
          <text x="200" y="100" fill="#fbbf24" fontSize="22" textAnchor="middle">+  O₂</text>
          <text x="200" y="118" fill="#fbbf24" fontSize="16" textAnchor="middle">→</text>
          <rect x="230" y="50" width="140" height="100" rx="8" fill="rgba(251,146,60,0.2)" stroke="#fb923c"/>
          <text x="300" y="72" textAnchor="middle" fill="#fdba74" fontSize="14" fontWeight="bold">SiO₂ 산화막</text>
          <rect x="250" y="105" width="100" height="25" rx="3" fill="#f97316" opacity="0.6"/>
          <text x="300" y="122" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">SiO₂</text>
          <rect x="250" y="80" width="100" height="25" rx="3" fill="#475569"/>
          <text x="300" y="97" textAnchor="middle" fill="#e2e8f0" fontSize="11">Si</text>
          <text x="200" y="174" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">🔥 고온 (900~1200°C)</text>
          <rect x="20" y="195" width="360" height="130" rx="8" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4"/>
          <text x="200" y="218" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">SiO₂ 특성</text>
          <text x="35" y="242" fill="#e2e8f0" fontSize="13">⚡ 절연파괴 전압: 1,000만 V/cm 이상</text>
          <text x="35" y="262" fill="#e2e8f0" fontSize="13">🔗 Si와 계면 결함 밀도: 10¹⁰/cm²</text>
          <text x="35" y="282" fill="#e2e8f0" fontSize="13">🌡️ 열팽창 계수 Si와 유사 → 스트레스 ↓</text>
          <text x="35" y="302" fill="#e2e8f0" fontSize="13">🛡️ 게이트 절연막, 소자 격리, 패시베이션</text>
        </svg>
      );
      case 1: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="ox_bg1" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#7c2d12"/><stop offset="100%" stopColor="#431407"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#ox_bg1)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">건식 vs 습식 산화 비교</text>
          <rect x="15" y="40" width="175" height="175" rx="8" fill="rgba(59,130,246,0.12)" stroke="#3b82f6"/>
          <text x="102" y="62" textAnchor="middle" fill="#93c5fd" fontSize="15" fontWeight="bold">🔵 건식 산화</text>
          <text x="102" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="12">Si + O₂ → SiO₂</text>
          <text x="30" y="105" fill="#cbd5e1" fontSize="12">🌡️ 900~1,200°C</text>
          <text x="30" y="125" fill="#cbd5e1" fontSize="12">⏱️ 느림 (10~100 nm/hr)</text>
          <text x="30" y="145" fill="#cbd5e1" fontSize="12">✨ 치밀·고품질</text>
          <text x="30" y="165" fill="#93c5fd" fontSize="12" fontWeight="bold">→ 게이트 산화막</text>
          <rect x="30" y="178" width="145" height="20" rx="4" fill="#3b82f6" opacity="0.3"/>
          <rect x="30" y="178" width="30" height="20" rx="4" fill="#3b82f6" opacity="0.7"/>
          <text x="102" y="193" textAnchor="middle" fill="#93c5fd" fontSize="10">성장 속도 느림</text>
          <rect x="210" y="40" width="175" height="175" rx="8" fill="rgba(239,68,68,0.12)" stroke="#ef4444"/>
          <text x="297" y="62" textAnchor="middle" fill="#fca5a5" fontSize="15" fontWeight="bold">🔴 습식 산화</text>
          <text x="297" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="12">Si + 2H₂O → SiO₂ + 2H₂</text>
          <text x="225" y="105" fill="#cbd5e1" fontSize="12">🌡️ 900~1,100°C</text>
          <text x="225" y="125" fill="#cbd5e1" fontSize="12">⏱️ 빠름 (5~10배)</text>
          <text x="225" y="145" fill="#cbd5e1" fontSize="12">📦 다소 성김</text>
          <text x="225" y="165" fill="#fca5a5" fontSize="12" fontWeight="bold">→ 필드 산화막</text>
          <rect x="225" y="178" width="145" height="20" rx="4" fill="#ef4444" opacity="0.3"/>
          <rect x="225" y="178" width="120" height="20" rx="4" fill="#ef4444" opacity="0.7"/>
          <text x="297" y="193" textAnchor="middle" fill="#fca5a5" fontSize="10">성장 속도 빠름</text>
          <rect x="20" y="230" width="360" height="98" rx="8" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="0.5"/>
          <text x="200" y="252" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">용도별 선택 기준</text>
          <text x="35" y="274" fill="#93c5fd" fontSize="13">🔵 게이트 산화막 (2~10nm) → 건식</text>
          <text x="35" y="296" fill="#fca5a5" fontSize="13">🔴 두꺼운 절연막 (300~500nm) → 습식</text>
          <text x="35" y="318" fill="#d8b4fe" fontSize="13">🟣 Pyrogenic: H₂+O₂→H₂O (고순도)</text>
        </svg>
      );
      case 2: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="ox_bg2" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#7c2d12"/><stop offset="100%" stopColor="#431407"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#ox_bg2)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">Deal-Grove 산화 모델</text>
          <text x="200" y="58" textAnchor="middle" fill="#c084fc" fontSize="14" fontWeight="bold">x² + Ax = B(t + τ)</text>
          <rect x="20" y="72" width="110" height="90" rx="8" fill="rgba(59,130,246,0.15)" stroke="#3b82f6"/>
          <text x="75" y="92" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="bold">1단계</text>
          <text x="75" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="11">산화제 확산</text>
          <text x="75" y="128" textAnchor="middle" fill="#e2e8f0" fontSize="11">O₂ → 표면</text>
          <text x="75" y="146" textAnchor="middle" fill="#60a5fa" fontSize="18">☁️→</text>
          <text x="148" y="120" fill="#fbbf24" fontSize="16">→</text>
          <rect x="160" y="72" width="110" height="90" rx="8" fill="rgba(168,85,247,0.15)" stroke="#a855f7"/>
          <text x="215" y="92" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">2단계</text>
          <text x="215" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="11">막 내부 확산</text>
          <text x="215" y="128" textAnchor="middle" fill="#e2e8f0" fontSize="11">SiO₂ 통과</text>
          <text x="215" y="146" textAnchor="middle" fill="#a855f7" fontSize="14">⏳ 속도제한</text>
          <text x="288" y="120" fill="#fbbf24" fontSize="16">→</text>
          <rect x="300" y="72" width="85" height="90" rx="8" fill="rgba(239,68,68,0.15)" stroke="#ef4444"/>
          <text x="342" y="92" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="bold">3단계</text>
          <text x="342" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="11">계면 반응</text>
          <text x="342" y="128" textAnchor="middle" fill="#e2e8f0" fontSize="11">Si+O₂</text>
          <text x="342" y="146" textAnchor="middle" fill="#ef4444" fontSize="14">🔥</text>
          <rect x="20" y="178" width="360" height="70" rx="8" fill="rgba(255,255,255,0.05)"/>
          <line x1="40" y1="230" x2="360" y2="230" stroke="#475569" strokeWidth="1"/>
          <line x1="40" y1="195" x2="40" y2="235" stroke="#475569" strokeWidth="1"/>
          <text x="35" y="192" textAnchor="end" fill="#cbd5e1" fontSize="10">두께</text>
          <text x="200" y="244" textAnchor="middle" fill="#cbd5e1" fontSize="10">시간</text>
          <path d="M 45 228 Q 100 220 160 210 Q 250 198 355 192" fill="none" stroke="#f97316" strokeWidth="2.5"/>
          <text x="90" y="218" fill="#93c5fd" fontSize="10">선형 영역</text>
          <text x="280" y="198" fill="#fca5a5" fontSize="10">포물선 영역</text>
          <rect x="20" y="258" width="360" height="72" rx="8" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4"/>
          <text x="200" y="280" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">핵심 파라미터</text>
          <text x="35" y="300" fill="#e2e8f0" fontSize="12">A: 선형 속도 상수 (계면 반응) | B: 포물선 속도 상수 (확산)</text>
          <text x="35" y="320" fill="#e2e8f0" fontSize="12">🌡️ 온도 100°C↑ → 성장 속도 2~3배↑ (Arrhenius)</text>
        </svg>
      );
      case 3: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="ox_bg3" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#7c2d12"/><stop offset="100%" stopColor="#431407"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#ox_bg3)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">산화 공정 산업 응용</text>
          <rect x="15" y="42" width="175" height="68" rx="8" fill="rgba(59,130,246,0.15)" stroke="#3b82f6"/>
          <text x="102" y="62" textAnchor="middle" fill="#93c5fd" fontSize="14" fontWeight="bold">🖥️ Logic (CPU/GPU)</text>
          <text x="102" y="80" textAnchor="middle" fill="#e2e8f0" fontSize="11">게이트 산화막 2~10nm</text>
          <text x="102" y="96" textAnchor="middle" fill="#e2e8f0" fontSize="11">3nm: High-k (HfO₂)</text>
          <rect x="210" y="42" width="175" height="68" rx="8" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6"/>
          <text x="297" y="62" textAnchor="middle" fill="#c4b5fd" fontSize="14" fontWeight="bold">💾 메모리</text>
          <text x="297" y="80" textAnchor="middle" fill="#e2e8f0" fontSize="11">ONO구조 (Flash)</text>
          <text x="297" y="96" textAnchor="middle" fill="#e2e8f0" fontSize="11">터널 산화막 8~10nm</text>
          <rect x="15" y="122" width="175" height="68" rx="8" fill="rgba(34,197,94,0.15)" stroke="#22c55e"/>
          <text x="102" y="142" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="bold">📱 파워 반도체</text>
          <text x="102" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="11">두꺼운 산화막 50~100nm</text>
          <text x="102" y="176" textAnchor="middle" fill="#e2e8f0" fontSize="11">SiC 차세대 전기차</text>
          <rect x="210" y="122" width="175" height="68" rx="8" fill="rgba(236,72,153,0.15)" stroke="#ec4899"/>
          <text x="297" y="142" textAnchor="middle" fill="#f9a8d4" fontSize="14" fontWeight="bold">🌐 MEMS/센서</text>
          <text x="297" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="11">희생층 공정</text>
          <text x="297" y="176" textAnchor="middle" fill="#e2e8f0" fontSize="11">보호막·구조층</text>
          <rect x="15" y="205" width="370" height="125" rx="8" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4"/>
          <text x="200" y="228" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">🔧 엔지니어 핵심 관리 항목</text>
          <rect x="35" y="240" width="330" height="25" rx="4" fill="rgba(59,130,246,0.1)"/>
          <text x="200" y="257" textAnchor="middle" fill="#93c5fd" fontSize="13">온도·시간·분위기 최적화 → 목표 두께 달성</text>
          <rect x="35" y="272" width="330" height="25" rx="4" fill="rgba(34,197,94,0.1)"/>
          <text x="200" y="289" textAnchor="middle" fill="#86efac" fontSize="13">균일도(Uniformity) ±1% 이내 관리</text>
          <rect x="35" y="304" width="330" height="20" rx="4" fill="rgba(239,68,68,0.1)"/>
          <text x="200" y="319" textAnchor="middle" fill="#fca5a5" fontSize="13">결함 밀도 최소화 → 수율 향상</text>
        </svg>
      );
      case 4: return (
        <svg viewBox="0 0 400 340" className="w-full h-auto rounded-lg">
          <defs>
            <linearGradient id="ox_bg4" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#7c2d12"/><stop offset="100%" stopColor="#431407"/>
            </linearGradient>
          </defs>
          <rect width="400" height="340" fill="url(#ox_bg4)" rx="12"/>
          <text x="200" y="28" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">시뮬레이터 학습 로드맵</text>
          <rect x="30" y="44" width="340" height="55" rx="8" fill="rgba(59,130,246,0.15)" stroke="#3b82f6"/>
          <circle cx="58" cy="71" r="16" fill="#3b82f6" opacity="0.8"/><text x="58" y="76" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
          <text x="84" y="65" fill="#93c5fd" fontSize="13" fontWeight="bold">개요 (Overview)</text>
          <text x="84" y="82" fill="#cbd5e1" fontSize="11">산화 기초, 건식 vs 습식 비교</text>
          <text x="200" y="112" textAnchor="middle" fill="#fbbf24" fontSize="16">▼</text>
          <rect x="30" y="118" width="340" height="55" rx="8" fill="rgba(249,115,22,0.15)" stroke="#f97316"/>
          <circle cx="58" cy="145" r="16" fill="#f97316" opacity="0.8"/><text x="58" y="150" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
          <text x="84" y="139" fill="#fdba74" fontSize="13" fontWeight="bold">열산화 실험 (Thermal)</text>
          <text x="84" y="156" fill="#cbd5e1" fontSize="11">온도·시간 설정, 실시간 성장 관찰</text>
          <text x="200" y="186" textAnchor="middle" fill="#fbbf24" fontSize="16">▼</text>
          <rect x="30" y="192" width="340" height="55" rx="8" fill="rgba(168,85,247,0.15)" stroke="#a855f7"/>
          <circle cx="58" cy="219" r="16" fill="#a855f7" opacity="0.8"/><text x="58" y="224" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
          <text x="84" y="213" fill="#c4b5fd" fontSize="13" fontWeight="bold">산화 영향 인자 (Analysis)</text>
          <text x="84" y="230" fill="#cbd5e1" fontSize="11">결정방향, 도핑, 온도·압력 효과</text>
          <text x="200" y="260" textAnchor="middle" fill="#fbbf24" fontSize="16">▼</text>
          <rect x="30" y="266" width="340" height="55" rx="8" fill="rgba(34,197,94,0.15)" stroke="#22c55e"/>
          <circle cx="58" cy="293" r="16" fill="#22c55e" opacity="0.8"/><text x="58" y="298" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">4</text>
          <text x="84" y="287" fill="#86efac" fontSize="13" fontWeight="bold">평가 (Quiz)</text>
          <text x="84" y="304" fill="#cbd5e1" fontSize="11">학습 내용 점검 및 평가</text>
        </svg>
      );
      default: return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theory':
        return (
          <div className="space-y-6">
            {!showDetailedTheory ? (
              <div className="bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 rounded-xl shadow-2xl p-8 text-white min-h-[600px] flex flex-col">
                {!isTheoryPlaying ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="text-6xl mb-4">🎬</div>
                    <h2 className="text-4xl font-bold mb-4">
                      열산화 공정 시뮬레이터
                    </h2>
                    <p className="text-xl text-orange-100 max-w-2xl leading-relaxed">
                      SiO₂ 절연막 형성의 과학! Deal-Grove 모델의 세계로 초대합니다.<br/>
                      <span className="text-yellow-300 font-bold">5단계 스토리텔링</span>으로 쉽고 재미있게 배워보세요!
                    </p>
                    <button
                      onClick={startTheoryAnimation}
                      className="flex items-center gap-3 px-8 py-4 bg-white text-orange-600 rounded-full hover:bg-yellow-50 transition-all text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 mt-8"
                    >
                      <PlayIcon />
                      시작하기
                    </button>
                    <p className="text-sm text-orange-200 mt-4">
                      ⏱️ 약 3분 소요 • 📚 5단계 학습 • 🔥 열산화의 모든 것
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">
                          Step {theoryStep + 1} / {theorySteps.length}
                        </span>
                        <span className="text-sm text-orange-200">
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

                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6 overflow-y-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-5xl">{theorySteps[theoryStep].icon}</span>
                        <h3 className="text-2xl font-bold">
                          {theorySteps[theoryStep].title}
                        </h3>
                      </div>

                      <div className="flex gap-5">
                        {/* Left: SVG Diagram */}
                        <div className="w-1/2 flex-shrink-0">
                          {getTheorySVG(theoryStep)}
                        </div>

                        {/* Right: Text Content */}
                        <div className="w-1/2 overflow-y-auto max-h-[450px]">
                          <div className="text-base leading-relaxed whitespace-pre-line mb-4 font-medium">
                            {typedText}
                            {typedText.length < theorySteps[theoryStep].content.length && (
                              <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse" />
                            )}
                          </div>

                          {typedText.length >= theorySteps[theoryStep].content.length && (
                            <div className="mt-4 p-3 bg-yellow-400/20 border-2 border-yellow-300 rounded-lg transition-all duration-500 opacity-100">
                              <div className="flex items-start gap-2 text-yellow-300">
                                <LightbulbIcon />
                                <p className="text-yellow-100 font-semibold text-sm">
                                  {theorySteps[theoryStep].highlight}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                          className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-yellow-50 transition-all font-semibold shadow-lg"
                        >
                          다음 →
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('overview')}
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
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <button
                  onClick={() => setShowDetailedTheory(false)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-4"
                >
                  ← 오프닝으로 돌아가기
                </button>
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold mb-4">상세 이론</h3>
                  <p>상세 이론 내용이 여기에 들어갑니다.</p>
                </div>
              </div>
            )}

            {!isTheoryPlaying && !showDetailedTheory && (
              <div className="text-center">
                <button
                  onClick={() => setShowDetailedTheory(true)}
                  className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-50 transition-all font-semibold shadow-lg border-2 border-orange-600"
                >
                  📚 상세 이론 보기
                </button>
              </div>
            )}
          </div>
        );

      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-800 mb-4">🔥 열산화 공정이란?</h3>
              <p className="text-gray-700 leading-relaxed">
                열산화는 실리콘 웨이퍼를 고온(800-1200°C)에서 산소나 수증기와 반응시켜 
                실리콘 표면에 이산화실리콘(SiO₂) 층을 형성하는 공정입니다. 
                이 산화막은 절연층, 확산 마스크, 패시베이션 층 등으로 활용됩니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">산화 반응 메커니즘</h4>
              <div className="flex justify-center">
                <svg width="600" height="300" viewBox="0 0 600 300">
                  <rect x="50" y="200" width="500" height="80" fill="#4a5568" />
                  <text x="300" y="245" textAnchor="middle" fill="white" className="text-sm font-semibold">
                    Silicon Substrate
                  </text>
                  
                  <rect 
                    x="50" 
                    y={200 - animatedThickness} 
                    width="500" 
                    height={animatedThickness} 
                    fill="#60a5fa" 
                    fillOpacity="0.7"
                    style={{ transition: 'all 0.15s ease-in-out' }}
                  />
                  <text 
                    x="300" 
                    y={200 - animatedThickness/2 + 5} 
                    textAnchor="middle" 
                    fill="white" 
                    className="text-sm font-semibold"
                  >
                    SiO₂ Layer
                  </text>
                  
                  {[...Array(8)].map((_, i) => (
                    <g key={i}>
                      <circle cx={100 + i * 60} cy={80} r="8" fill="#3b82f6" />
                      <circle cx={110 + i * 60} cy={80} r="8" fill="#3b82f6" />
                      <text x={105 + i * 60} y={85} textAnchor="middle" fill="white" className="text-xs">
                        O₂
                      </text>
                    </g>
                  ))}
                  
                  <path d="M 300 120 L 300 140" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                    </marker>
                  </defs>
                  
                  <text 
                    x="520" 
                    y="30" 
                    className={`text-lg font-bold transition-opacity duration-300 ${
                      temperatureBlink ? 'fill-red-600 opacity-100' : 'fill-red-400 opacity-60'
                    }`}
                  >
                    {temperature}°C
                  </text>
                  
                  {temperatureBlink && (
                    <>
                      <circle cx="480" cy="25" r="3" fill="#ff6b6b" fillOpacity="0.6" />
                      <circle cx="490" cy="35" r="2" fill="#ff8e8e" fillOpacity="0.4" />
                      <circle cx="500" cy="20" r="2.5" fill="#ff6b6b" fillOpacity="0.5" />
                    </>
                  )}
                </svg>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">📐 Deal-Grove 모델</h4>
              <p className="text-gray-700 mb-4">
                산화막 성장은 Deal-Grove 모델로 설명됩니다:
              </p>
              <div className="bg-white p-4 rounded-lg font-mono text-center">
                x² + Ax = B(t + τ)
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>x:</strong> 산화막 두께<br/>
                  <strong>A:</strong> 선형 속도 상수
                </div>
                <div>
                  <strong>B:</strong> 포물선 속도 상수<br/>
                  <strong>t:</strong> 산화 시간
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
              <h4 className="text-lg font-semibold text-yellow-800 mb-4">🤔 왜 SiO₂가 계속 자라지 않는가?</h4>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">1. 산화 속도의 감소 (Deal-Grove 핵심)</h5>
                  <p className="text-sm text-gray-700">
                    산화막이 두꺼워질수록 산소가 실리콘 표면까지 도달하기 어려워집니다. 
                    Deal-Grove 모델의 <strong>포물선 법칙 (x² ∝ t)</strong>이 이를 설명하며, 
                    초기 선형 성장에서 점차 확산 제한 성장으로 전환됩니다.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">2. 확산 제한 (Diffusion Limited)</h5>
                  <p className="text-sm text-gray-700">
                    O₂나 H₂O가 SiO₂를 통과해 Si 표면에 도달해야 하는데, 이 확산이 성장률을 결정합니다. 
                    <strong>습식 산화(B/A ≈ 100)</strong>가 <strong>건식 산화(B/A ≈ 10)</strong>보다 빠른 이유도 
                    H₂O의 더 나은 확산 특성 때문입니다.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">3. 온도와 시간의 영향</h5>
                  <p className="text-sm text-gray-700">
                    Deal-Grove 상수 A, B는 <strong>아레니우스 관계(e^(-Ea/kT))</strong>를 따릅니다. 
                    고온에서는 성장이 빨라지지만, 과도한 온도는 실리콘 손상이나 부반응을 야기할 수 있어 
                    공정적으로 제한됩니다.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">4. 산화막의 응력 (Stress Limitation)</h5>
                  <p className="text-sm text-gray-700">
                    SiO₂는 Si보다 부피가 2.27배 크기 때문에 압축 응력이 발생합니다. 
                    두께가 증가할수록 응력이 누적되어 균열이나 결함이 생길 수 있어서, 
                    <strong>실용적 두께 한계(보통 1-2μm)</strong>가 존재합니다.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800 mb-4">
                  <strong>💡 Deal-Grove 모델의 통찰:</strong> 
                  산화막 성장은 <strong>표면 반응 제한 → 확산 제한</strong>으로 전환되며, 
                  이는 모델의 선형항(A)에서 포물선항(B)으로의 전환을 의미합니다. 
                  따라서 무한 성장이 아닌 <strong>자기 제한적 성장</strong>이 이루어집니다.
                </p>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-3">🧮 Deal-Grove 모델 수식 전개</h6>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-center">
                      <div className="font-mono bg-blue-50 p-2 rounded">
                        x² + Ax = Bt
                      </div>
                    </div>
                    
                    <div className="text-center text-gray-600">
                      ↓ 이차방정식 해법 적용
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="font-mono bg-blue-50 p-2 rounded">
                        x = (-A + √(A² + 4Bt)) / 2
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                        <div className="font-semibold text-green-800">초기 성장 (t ≪ A²/4B)</div>
                        <div className="text-xs text-green-700 mt-1">A² ≫ 4Bt 일 때</div>
                        <div className="font-mono text-sm mt-2">
                          √(A² + 4Bt) ≈ A + 2Bt/A
                        </div>
                        <div className="font-mono text-sm text-green-800 mt-1">
                          ∴ x ≈ <span className="bg-green-200 px-1 rounded">Bt/A</span> (선형)
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                        <div className="font-semibold text-orange-800">후기 성장 (t ≫ A²/4B)</div>
                        <div className="text-xs text-orange-700 mt-1">4Bt ≫ A² 일 때</div>
                        <div className="font-mono text-sm mt-2">
                          √(A² + 4Bt) ≈ 2√(Bt)
                        </div>
                        <div className="font-mono text-sm text-orange-800 mt-1">
                          ∴ x ≈ <span className="bg-orange-200 px-1 rounded">√(Bt)</span> (포물선)
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4 p-3 bg-gray-100 rounded">
                      <div className="text-sm font-semibold text-gray-800">
                        전환점: t* = A²/(4B)
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        이 시점을 기준으로 성장 메커니즘이 바뀝니다
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'thermal':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-800 mb-4">🏭 수평형 열산화 장비 시뮬레이션</h3>
              <p className="text-gray-700">
                실제 산화 장비를 조작하여 Wet/Dry oxidation 공정을 체험해보세요.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">공정 모드 선택</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => {
                    setProcessMode('dry');
                    setGasFlows({...gasFlows, O2: 100, H2O: 0, H2: 0});
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    processMode === 'dry' 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <h5 className="font-semibold text-green-800">Dry Oxidation</h5>
                  <p className="text-sm text-gray-600 mt-1">Si + O₂ → SiO₂</p>
                  <p className="text-xs text-gray-500 mt-2">고품질, 얇은 막, 느린 성장</p>
                </button>
                
                <button
                  onClick={() => {
                    setProcessMode('wet');
                    setGasFlows({...gasFlows, O2: 0, H2O: 150, H2: 0});
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    processMode === 'wet' 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h5 className="font-semibold text-blue-800">Wet Oxidation</h5>
                  <p className="text-sm text-gray-600 mt-1">Si + 2H₂O → SiO₂ + 2H₂</p>
                  <p className="text-xs text-gray-500 mt-2">빠른 성장, 두꺼운 막, 직접 수증기</p>
                </button>
                
                <button
                  onClick={() => {
                    setProcessMode('pyrogenic');
                    setGasFlows({...gasFlows, O2: 100, H2O: 0, H2: 50});
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    processMode === 'pyrogenic' 
                      ? 'border-purple-400 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <h5 className="font-semibold text-purple-800">Pyrogenic Wet</h5>
                  <p className="text-sm text-gray-600 mt-1">H₂ + O₂ → H₂O (in-situ)</p>
                  <p className="text-xs text-gray-500 mt-2">현장 수증기 생성, 초고순도</p>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">현재 활성 반응</h4>
              <div className="p-4 rounded-lg border-2 border-dashed">
                {processMode === 'dry' && (
                  <div className="text-center">
                    <div className="font-mono text-lg text-green-800">Si (solid) + O₂ (gas) → SiO₂ (solid)</div>
                    <p className="text-sm text-gray-600 mt-2">건식 산화: 순수 산소 가스 사용</p>
                  </div>
                )}
                {processMode === 'wet' && (
                  <div className="text-center">
                    <div className="font-mono text-lg text-blue-800">Si (solid) + 2H₂O (gas) → SiO₂ (solid) + 2H₂ (gas)</div>
                    <p className="text-sm text-gray-600 mt-2">습식 산화: 직접 수증기 공급</p>
                  </div>
                )}
                {processMode === 'pyrogenic' && (
                  <div className="text-center">
                    <div className="font-mono text-lg text-purple-800">
                      H₂ + ½O₂ → H₂O<br/>
                      Si + 2H₂O → SiO₂ + 2H₂
                    </div>
                    <p className="text-sm text-gray-600 mt-2">열분해 습식: 현장에서 수증기 생성</p>
                  </div>
                )}
                {processMode === 'standby' && (
                  <div className="text-center text-gray-500">
                    <div className="font-mono text-lg">공정 모드를 선택하세요</div>
                    <p className="text-sm mt-2">N₂ 퍼지 상태</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">수평형 열산화 장비 (Dry와 Wet 공용)</h4>
              
              <div className="flex justify-center mb-6">
                <svg width="800" height="400" viewBox="0 0 800 400">
                  <g>
                    <rect x="20" y="50" width="25" height="80" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
                    <text x="32" y="45" textAnchor="middle" className="text-xs font-bold">HCl</text>
                    <text x="32" y="145" textAnchor="middle" className="text-xs">{gasFlows.HCl}</text>
                    
                    <rect x="60" y="50" width="25" height="80" fill="#6b7280" stroke="#374151" strokeWidth="2" />
                    <text x="72" y="45" textAnchor="middle" className="text-xs font-bold">N₂</text>
                    <text x="72" y="145" textAnchor="middle" className="text-xs">{gasFlows.N2}</text>
                    
                    <rect x="100" y="50" width="25" height="80" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
                    <text x="112" y="45" textAnchor="middle" className="text-xs font-bold">O₂</text>
                    <text x="112" y="145" textAnchor="middle" className="text-xs">{gasFlows.O2}</text>
                    
                    <rect x="140" y="50" width="25" height="80" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
                    <text x="152" y="45" textAnchor="middle" className="text-xs font-bold">H₂O</text>
                    <text x="152" y="145" textAnchor="middle" className="text-xs">{gasFlows.H2O}</text>
                    
                    <rect x="180" y="50" width="25" height="80" fill="#10b981" stroke="#047857" strokeWidth="2" />
                    <text x="192" y="45" textAnchor="middle" className="text-xs font-bold">H₂</text>
                    <text x="192" y="145" textAnchor="middle" className="text-xs">{gasFlows.H2}</text>
                  </g>

                  <g stroke="#4b5563" strokeWidth="3" fill="none">
                    <path d="M 32 130 L 32 170 L 250 170" />
                    <path d="M 72 130 L 72 170" />
                    <path d="M 112 130 L 112 170" />
                    <path d="M 152 130 L 152 170" />
                    <path d="M 192 130 L 192 170" />
                  </g>

                  <g>
                    <rect x="250" y="115" width="133" height="30" fill={heaterOn ? "#dc2626" : "#9ca3af"} />
                    <text x="316" y="133" textAnchor="middle" fill="white" className="text-xs font-semibold">Heat Zone1</text>
                    
                    <rect x="383" y="115" width="134" height="30" fill={heaterOn ? "#dc2626" : "#9ca3af"} />
                    <text x="450" y="133" textAnchor="middle" fill="white" className="text-xs font-semibold">Heat Zone2</text>
                    
                    <rect x="517" y="115" width="133" height="30" fill={heaterOn ? "#dc2626" : "#9ca3af"} />
                    <text x="583" y="133" textAnchor="middle" fill="white" className="text-xs font-semibold">Heat Zone3</text>
                    
                    <rect x="250" y="260" width="133" height="30" fill={heaterOn ? "#dc2626" : "#9ca3af"} />
                    <text x="316" y="278" textAnchor="middle" fill="white" className="text-xs font-semibold">Heat Zone4</text>
                    
                    <rect x="383" y="260" width="134" height="30" fill={heaterOn ? "#dc2626" : "#9ca3af"} />
                    <text x="450" y="278" textAnchor="middle" fill="white" className="text-xs font-semibold">Heat Zone5</text>
                    
                    <rect x="517" y="260" width="133" height="30" fill={heaterOn ? "#dc2626" : "#9ca3af"} />
                    <text x="583" y="278" textAnchor="middle" fill="white" className="text-xs font-semibold">Heat Zone6</text>
                  </g>

                  <rect x="250" y="160" width="400" height="80" fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" fillOpacity="0.3" />
                  <text x="450" y="175" textAnchor="middle" className="text-sm font-semibold">Quartz Tube</text>

                  {furnaceLoaded && (
                    <g>
                      <rect x="350" y="210" width="200" height="10" fill="#8b5cf6" />
                      <text x="450" y="205" textAnchor="middle" className="text-xs">Quartz Boat</text>
                      
                      {[...Array(8)].map((_, i) => (
                        <g key={i}>
                          <rect x={370 + i * 20} y="195" width="3" height="15" fill="#4a5568" />
                          <rect x={370 + i * 20} y="195" width="3" height={oxideThickness/10} fill="#60a5fa" />
                        </g>
                      ))}
                    </g>
                  )}

                  {(gasFlows.O2 > 0 || gasFlows.H2O > 0 || gasFlows.H2 > 0) && (
                    <g>
                      {[...Array(5)].map((_, i) => (
                        <circle 
                          key={i} 
                          cx={280 + i * 40} 
                          cy={200} 
                          r="2" 
                          fill={
                            processMode === 'wet' ? '#06b6d4' :
                            processMode === 'dry' ? '#3b82f6' :
                            processMode === 'pyrogenic' ? '#8b5cf6' : '#6b7280'
                          }
                          fillOpacity="0.8" 
                        />
                      ))}
                    </g>
                  )}

                  <rect x="670" y="180" width="60" height="40" fill="#d1d5db" stroke="#6b7280" strokeWidth="2" />
                  <text x="700" y="175" textAnchor="middle" className="text-xs">Exhaust</text>
                  <path d="M 650 200 L 670 200" stroke="#4b5563" strokeWidth="3" />

                  <text 
                    x="450" 
                    y="290" 
                    textAnchor="middle" 
                    className={`text-lg font-bold ${heaterOn ? 'fill-red-600' : 'fill-gray-400'}`}
                  >
                    {heaterOn ? `${temperature}°C` : 'Heater OFF'}
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">가스 플로우 제어 (sccm)</h5>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                      <label className="block text-sm font-medium mb-2 text-blue-800">O₂: {gasFlows.O2} sccm</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="10"
                          value={gasFlows.O2}
                          onChange={(e) => setGasFlows({...gasFlows, O2: Number(e.target.value)})}
                          className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${gasFlows.O2/200*100}%, #dbeafe ${gasFlows.O2/200*100}%, #dbeafe 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>200</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border-2 border-cyan-200 shadow-sm">
                      <label className="block text-sm font-medium mb-2 text-cyan-800">H₂O: {gasFlows.H2O} sccm</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="300"
                          step="10"
                          value={gasFlows.H2O}
                          onChange={(e) => setGasFlows({...gasFlows, H2O: Number(e.target.value)})}
                          className="w-full h-3 bg-cyan-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${gasFlows.H2O/300*100}%, #cffafe ${gasFlows.H2O/300*100}%, #cffafe 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>300</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                      <label className="block text-sm font-medium mb-2 text-green-800">H₂: {gasFlows.H2} sccm</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={gasFlows.H2}
                          onChange={(e) => setGasFlows({...gasFlows, H2: Number(e.target.value)})}
                          className="w-full h-3 bg-green-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${gasFlows.H2/100*100}%, #dcfce7 ${gasFlows.H2/100*100}%, #dcfce7 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                      <label className="block text-sm font-medium mb-2 text-gray-800">N₂: {gasFlows.N2} sccm</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="50"
                          max="500"
                          step="10"
                          value={gasFlows.N2}
                          onChange={(e) => setGasFlows({...gasFlows, N2: Number(e.target.value)})}
                          className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${(gasFlows.N2-50)/450*100}%, #f3f4f6 ${(gasFlows.N2-50)/450*100}%, #f3f4f6 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50</span>
                          <span>500</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border-2 border-yellow-200 shadow-sm">
                      <label className="block text-sm font-medium mb-2 text-yellow-800">HCl: {gasFlows.HCl} sccm</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={gasFlows.HCl}
                          onChange={(e) => setGasFlows({...gasFlows, HCl: Number(e.target.value)})}
                          className="w-full h-3 bg-yellow-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${gasFlows.HCl/50*100}%, #fef3c7 ${gasFlows.HCl/50*100}%, #fef3c7 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">장비 제어</h5>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border-2 border-red-200 shadow-sm">
                      <label className="block text-sm font-medium mb-2 text-red-800">온도: {temperature}°C</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="800"
                          max="1200"
                          step="25"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="w-full h-4 bg-red-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(temperature-800)/400*100}%, #fecaca ${(temperature-800)/400*100}%, #fecaca 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>800°C</span>
                          <span>1200°C</span>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          temperature >= 1100 ? 'bg-red-100 text-red-800' :
                          temperature >= 1000 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {temperature >= 1100 ? '고온' : temperature >= 1000 ? '중온' : '저온'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                      <label className="block text-sm font-medium mb-2 text-blue-800">시간: {time}분</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="10"
                          max="180"
                          step="10"
                          value={time}
                          onChange={(e) => setTime(Number(e.target.value))}
                          className="w-full h-4 bg-blue-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(time-10)/170*100}%, #dbeafe ${(time-10)/170*100}%, #dbeafe 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10분</span>
                          <span>180분</span>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          time >= 120 ? 'bg-blue-100 text-blue-800' :
                          time >= 60 ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {time >= 120 ? '장시간' : time >= 60 ? '중간' : '단시간'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFurnaceLoaded(!furnaceLoaded)}
                        className={`flex-1 py-2 px-3 rounded text-sm ${
                          furnaceLoaded 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {furnaceLoaded ? '웨이퍼 로딩됨' : '웨이퍼 로딩'}
                      </button>
                      
                      <button
                        onClick={() => setHeaterOn(!heaterOn)}
                        className={`flex-1 py-2 px-3 rounded text-sm ${
                          heaterOn 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {heaterOn ? 'Heater ON' : 'Heater OFF'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">공정 상태</h5>
                  
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>공정 모드:</strong>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                        processMode === 'wet' 
                          ? 'bg-blue-100 text-blue-800' 
                          : processMode === 'dry'
                            ? 'bg-green-100 text-green-800'
                            : processMode === 'pyrogenic'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                        {processMode === 'wet' 
                          ? 'Wet Oxidation (H₂O)' 
                          : processMode === 'dry'
                            ? 'Dry Oxidation (O₂)'
                            : processMode === 'pyrogenic'
                              ? 'Pyrogenic Wet (H₂+O₂)'
                              : 'Standby'}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <strong>예상 두께:</strong> {(() => {
                        const oxidationType = processMode === 'wet' || processMode === 'pyrogenic' ? 'wet' : 'dry';
                        let effectiveGasFlow = 100;
                        if (oxidationType === 'wet') {
                          effectiveGasFlow = gasFlows.H2O > 0 ? gasFlows.H2O : 100;
                          if (processMode === 'pyrogenic') {
                            effectiveGasFlow = Math.min(gasFlows.H2 * 2, gasFlows.O2);
                          }
                        } else {
                          effectiveGasFlow = gasFlows.O2 > 0 ? gasFlows.O2 : 100;
                        }
                        return calculateOxideGrowth(temperature, time, oxidationType, effectiveGasFlow).toFixed(1);
                      })()} nm
                    </div>
                    
                    <div className="text-sm">
                      <strong>활성 가스:</strong> 
                      {gasFlows.O2 > 0 && <span className="ml-1 text-blue-600">O₂</span>}
                      {gasFlows.H2O > 0 && <span className="ml-1 text-cyan-600">H₂O</span>}
                      {gasFlows.H2 > 0 && <span className="ml-1 text-green-600">H₂</span>}
                      {gasFlows.HCl > 0 && <span className="ml-1 text-yellow-600">HCl</span>}
                    </div>
                    
                    <div className="text-sm">
                      <strong>HCl 효과:</strong> {gasFlows.HCl > 0 ? '불순물 제거 활성' : '비활성'}
                    </div>

                    <button
                      onClick={runSimulation}
                      disabled={isSimulating || !furnaceLoaded || !heaterOn || processMode === 'standby'}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      {isSimulating ? '공정 진행중...' : '산화 공정 시작'}
                    </button>

                    {isSimulating && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-100"
                          style={{ width: `${simulationProgress}%` }}
                        />
                      </div>
                    )}

                    {oxideThickness > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <h6 className="font-semibold mb-3 text-sm">실험 결과</h6>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>산화막 두께:</span>
                            <span className="font-semibold text-blue-600">{oxideThickness.toFixed(1)} nm</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>성장률:</span>
                            <span className="font-semibold text-green-600">{growthRate.toFixed(2)} nm/min</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>공정 조건:</span>
                            <span className="font-semibold text-purple-600">
                              {temperature}°C, {time}분
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>산화 방식:</span>
                            <span className="font-semibold text-orange-600">
                              {processMode === 'wet' ? 'Wet (H₂O)' :
                               processMode === 'dry' ? 'Dry (O₂)' :
                               processMode === 'pyrogenic' ? 'Pyrogenic' : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">가스별 역할</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800">O₂ (산소)</h5>
                  <p className="text-sm text-gray-700">건식 산화의 주요 반응 가스. 순수 산소로 고품질 산화막 형성</p>
                </div>
                
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <h5 className="font-semibold text-cyan-800">H₂O (수증기)</h5>
                  <p className="text-sm text-gray-700">습식 산화의 직접 공급 가스. 빠른 성장률, 두꺼운 막 형성</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800">H₂ (수소)</h5>
                  <p className="text-sm text-gray-700">O₂와 함께 현장에서 수증기 생성. 열분해 습식 산화용</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-800">N₂ (질소)</h5>
                  <p className="text-sm text-gray-700">불활성 가스로 퍼지, 온도 안정화, 웨이퍼 보호 역할</p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h5 className="font-semibold text-yellow-800">HCl (염화수소)</h5>
                  <p className="text-sm text-gray-700">금속 불순물을 휘발성 염화물로 제거하여 고품질 게이트 산화막 형성</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">📊 산화 영향 인자 분석</h3>
              <p className="text-gray-700 leading-relaxed">
                산화막 성장 속도에 영향을 미치는 핵심 인자들을 조절하여 
                최적의 공정 조건을 찾아보세요.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">1. 결정립 방향 (Crystal Orientation)</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700">
                      <strong>{'{111}'} 면은 실리콘 결합수가 많아</strong> 산소가 실리콘과 만나기 쉬우므로, 
                      {'{111}'} 면에서 {'{100}'} 면보다 산화 속도가 더 빠릅니다.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">결정면 선택:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['100', '110', '111'].map(orientation => (
                        <button
                          key={orientation}
                          onClick={() => setSimOrientation(orientation)}
                          className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                            simOrientation === orientation
                              ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-lg font-mono">({orientation})</div>
                          <div className="text-xs mt-1">{calculateOrientationRate(orientation).toFixed(2)}x</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <svg width="350" height="250" viewBox="0 0 350 250">
                    <rect x="50" y="180" width="250" height="50" fill="#4a5568" />
                    <text x="175" y="210" textAnchor="middle" fill="white" className="text-sm font-semibold">
                      Silicon ({simOrientation})
                    </text>
                    
                    <rect 
                      x="50" 
                      y={180 - calculateOrientationRate(simOrientation) * 40} 
                      width="250" 
                      height={calculateOrientationRate(simOrientation) * 40} 
                      fill="#60a5fa" 
                      fillOpacity="0.7"
                    />
                    <text 
                      x="175" 
                      y={180 - calculateOrientationRate(simOrientation) * 20} 
                      textAnchor="middle" 
                      fill="white" 
                      className="text-sm font-semibold"
                    >
                      SiO₂
                    </text>
                    
                    {[...Array(Math.floor(calculateOrientationRate(simOrientation) * 5))].map((_, i) => (
                      <g key={i}>
                        <circle cx={80 + i * 40} cy={100} r="6" fill="#3b82f6" />
                        <circle cx={90 + i * 40} cy={100} r="6" fill="#3b82f6" />
                        <text x={85 + i * 40} y={105} textAnchor="middle" fill="white" className="text-xs">O₂</text>
                      </g>
                    ))}
                    
                    <text x="175" y="30" textAnchor="middle" className="text-xl font-bold fill-blue-600">
                      산화 속도: {calculateOrientationRate(simOrientation).toFixed(2)}x
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">2. 도펀트 (Dopant) 효과</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-700">
                      <strong>p-type 불순물인 Boron</strong>은 산화 속도를 증가시킵니다. 
                      도펀트 농도가 높을수록 vacancy 형성이 증가하여 산소 확산이 촉진됩니다.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border-2 border-yellow-200 shadow-sm">
                      <label className="block text-sm font-medium text-yellow-800 mb-3">
                        Boron 도핑 농도: {simDopingLevel}×10¹⁸ cm⁻³
                      </label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={simDopingLevel}
                          onChange={(e) => setSimDopingLevel(Number(e.target.value))}
                          className="w-full h-4 bg-yellow-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${simDopingLevel/10*100}%, #fef3c7 ${simDopingLevel/10*100}%, #fef3c7 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>무도핑</span>
                          <span>고농도</span>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          simDopingLevel >= 7 ? 'bg-red-100 text-red-800' :
                          simDopingLevel >= 4 ? 'bg-orange-100 text-orange-800' :
                          simDopingLevel > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {simDopingLevel >= 7 ? '고농도 도핑' : 
                           simDopingLevel >= 4 ? '중농도 도핑' :
                           simDopingLevel > 0 ? '저농도 도핑' : '무도핑'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">산화 속도 변화:</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {calculateDopingRate(simDopingLevel).toFixed(2)}x
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <svg width="350" height="250" viewBox="0 0 350 250">
                    <rect x="50" y="180" width="250" height="50" fill="#4a5568" />
                    <text x="175" y="205" textAnchor="middle" fill="white" className="text-xs">
                      B-doped Silicon
                    </text>
                    
                    {[...Array(simDopingLevel * 3)].map((_, i) => (
                      <circle 
                        key={i} 
                        cx={60 + (i % 15) * 16} 
                        cy={185 + Math.floor(i / 15) * 12} 
                        r="2" 
                        fill="#f59e0b" 
                      />
                    ))}
                    
                    <rect 
                      x="50" 
                      y={180 - calculateDopingRate(simDopingLevel) * 35} 
                      width="250" 
                      height={calculateDopingRate(simDopingLevel) * 35} 
                      fill="#60a5fa" 
                      fillOpacity="0.7"
                    />
                    
                    {[...Array(Math.floor(simDopingLevel * 2))].map((_, i) => (
                      <circle 
                        key={i} 
                        cx={70 + (i % 12) * 20} 
                        cy={150 + Math.floor(i / 12) * 15} 
                        r="3" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        strokeDasharray="2,2"
                      />
                    ))}
                    
                    <text x="175" y="30" textAnchor="middle" className="text-xl font-bold fill-yellow-600">
                      Boron 효과: {calculateDopingRate(simDopingLevel).toFixed(2)}x
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">3. 초기 산화막 두께 효과</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm text-gray-700">
                      <strong>초기 산화막이 얇을수록</strong> 산화 속도가 빠르며, 
                      막이 두꺼워질수록 산소의 확산 거리가 증가하여 성장 속도가 느려집니다.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                      <label className="block text-sm font-medium text-green-800 mb-3">
                        초기 산화막 두께: {simInitialOxide} nm
                      </label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={simInitialOxide}
                          onChange={(e) => setSimInitialOxide(Number(e.target.value))}
                          className="w-full h-4 bg-green-100 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${simInitialOxide/100*100}%, #dcfce7 ${simInitialOxide/100*100}%, #dcfce7 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0 nm</span>
                          <span>100 nm</span>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          simInitialOxide >= 60 ? 'bg-red-100 text-red-800' :
                          simInitialOxide >= 30 ? 'bg-orange-100 text-orange-800' :
                          simInitialOxide > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {simInitialOxide >= 60 ? '두꺼운 막' : 
                           simInitialOxide >= 30 ? '중간 막' :
                           simInitialOxide > 0 ? '얇은 막' : '신선한 표면'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">성장 속도:</div>
                      <div className="text-2xl font-bold text-green-600">
                        {calculateInitialOxideRate(simInitialOxide).toFixed(2)}x
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <svg width="350" height="250" viewBox="0 0 350 250">
                    <rect x="50" y="200" width="250" height="30" fill="#4a5568" />
                    <text x="175" y="220" textAnchor="middle" fill="white" className="text-xs">Silicon</text>
                    
                    {simInitialOxide > 0 && (
                      <rect 
                        x="50" 
                        y={200 - simInitialOxide * 0.8} 
                        width="250" 
                        height={simInitialOxide * 0.8} 
                        fill="#93c5fd" 
                        fillOpacity="0.6"
                      />
                    )}
                    
                    <rect 
                      x="50" 
                      y={200 - simInitialOxide * 0.8 - calculateInitialOxideRate(simInitialOxide) * 60} 
                      width="250" 
                      height={calculateInitialOxideRate(simInitialOxide) * 60} 
                      fill="#3b82f6" 
                      fillOpacity="0.8"
                    />
                    <text 
                      x="175" 
                      y={200 - simInitialOxide * 0.8 - calculateInitialOxideRate(simInitialOxide) * 30} 
                      textAnchor="middle" 
                      fill="white" 
                      className="text-xs font-semibold"
                    >
                      새 성장층
                    </text>
                    
                    {simInitialOxide > 0 && (
                      <>
                        <line 
                          x1="310" 
                          y1={200 - simInitialOxide * 0.8} 
                          x2="310" 
                          y2="200" 
                          stroke="#ef4444" 
                          strokeWidth="2" 
                          strokeDasharray="4,4"
                        />
                        <text x="320" y={200 - simInitialOxide * 0.4} className="text-xs fill-red-600">
                          확산 거리
                        </text>
                      </>
                    )}
                    
                    <text x="175" y="30" textAnchor="middle" className="text-xl font-bold fill-green-600">
                      성장 속도: {calculateInitialOxideRate(simInitialOxide).toFixed(2)}x
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">4. 온도와 압력의 상호보완 관계</h4>
              
              <div className="mb-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>온도와 압력은 상호 보완적인 관계</strong>를 가집니다. 
                  소자 손상을 최소화하면서 원하는 성장 속도를 얻기 위해 
                  이들 인자들의 적절한 조합을 찾는 것이 <strong>공정 최적화의 핵심</strong>입니다.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-red-200 shadow-sm">
                    <label className="block text-sm font-medium text-red-800 mb-3">
                      온도: {simTemperature}°C
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="900"
                        max="1200"
                        step="50"
                        value={simTemperature}
                        onChange={(e) => setSimTemperature(Number(e.target.value))}
                        className="w-full h-4 bg-red-100 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(simTemperature-900)/300*100}%, #fecaca ${(simTemperature-900)/300*100}%, #fecaca 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>900°C</span>
                        <span>1200°C</span>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        simTemperature >= 1100 ? 'bg-red-100 text-red-800' :
                        simTemperature >= 1000 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {simTemperature >= 1100 ? '고온' : simTemperature >= 1000 ? '중온' : '저온'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                    <label className="block text-sm font-medium text-purple-800 mb-3">
                      압력: {simPressure.toFixed(1)} atm
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={simPressure}
                        onChange={(e) => setSimPressure(Number(e.target.value))}
                        className="w-full h-4 bg-purple-100 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(simPressure-0.5)/2.5*100}%, #e9d5ff ${(simPressure-0.5)/2.5*100}%, #e9d5ff 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.5 atm</span>
                        <span>3.0 atm</span>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        simPressure >= 2.5 ? 'bg-purple-100 text-purple-800' :
                        simPressure >= 1.5 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {simPressure >= 2.5 ? '고압' : simPressure >= 1.5 ? '중압' : '저압'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">조합 효과:</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {calculateTempPressureRate(simTemperature, simPressure).toFixed(2)}x
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowSimResult(true)}
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-md"
                  >
                    전체 통합 효과 계산
                  </button>
                </div>
                
                <div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={Array.from({length: 7}, (_, i) => {
                      const temp = 900 + i * 50;
                      return {
                        temp,
                        '1atm': calculateTempPressureRate(temp, 1),
                        '2atm': calculateTempPressureRate(temp, 2),
                        '3atm': calculateTempPressureRate(temp, 3)
                      };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="temp" label={{ value: '온도 (°C)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: '상대 속도', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="1atm" stroke="#8b5cf6" strokeWidth={2} name="1 atm" />
                      <Line type="monotone" dataKey="2atm" stroke="#6366f1" strokeWidth={2} name="2 atm" />
                      <Line type="monotone" dataKey="3atm" stroke="#3b82f6" strokeWidth={2} name="3 atm" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {showSimResult && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg shadow-lg border-2 border-purple-300">
                <h4 className="text-xl font-bold text-purple-800 mb-4">🎯 통합 산화 속도 계산</h4>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-xs text-gray-600">결정면 방향</div>
                    <div className="text-lg font-bold text-blue-600">
                      {calculateOrientationRate(simOrientation).toFixed(2)}x
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-xs text-gray-600">Boron 도핑</div>
                    <div className="text-lg font-bold text-yellow-600">
                      {calculateDopingRate(simDopingLevel).toFixed(2)}x
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-xs text-gray-600">초기 산화막</div>
                    <div className="text-lg font-bold text-green-600">
                      {calculateInitialOxideRate(simInitialOxide).toFixed(2)}x
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-xs text-gray-600">온도+압력</div>
                    <div className="text-lg font-bold text-purple-600">
                      {calculateTempPressureRate(simTemperature, simPressure).toFixed(2)}x
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-2">최종 통합 산화 속도</div>
                  <div className="text-5xl font-bold text-purple-700 mb-2">
                    {calculateTotalSimRate().toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-500">
                    (기준 조건 대비)
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSimResult(false)}
                  className="mt-4 w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  닫기
                </button>
              </div>
            )}

            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
              <h4 className="text-lg font-semibold text-amber-800 mb-3">💡 공정 최적화 가이드</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>고속 성장</strong>: {'{111}'} 면 + 고농도 도핑 + 고온/고압</p>
                <p>• <strong>고품질 막</strong>: {'{100}'} 면 + 저농도 도핑 + 중온</p>
                <p>• <strong>균일성 중시</strong>: 초기 산화막 최소화 + 안정적 온도 제어</p>
                <p>• <strong>소자 보호</strong>: 온도 낮추고 압력으로 보완</p>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-purple-800 mb-4">📝 산화 공정 평가</h3>
              <p className="text-gray-700">
                학습한 내용을 바탕으로 퀴즈를 풀어보세요.
              </p>
            </div>

            {!showResults ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      문제 {currentQuestion + 1} / {quizQuestions.length}
                    </span>
                    <span className="text-sm font-medium text-purple-600">
                      점수: {score} / {quizQuestions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {quizQuestions[currentQuestion].question}
                  </h4>
                  
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
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
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {currentQuestion < quizQuestions.length - 1 ? '다음 문제' : '결과 보기'}
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h4 className="text-2xl font-bold mb-4">퀴즈 완료!</h4>
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  {score} / {quizQuestions.length}
                </div>
                <div className="text-lg mb-6">
                  정답률: {((score / quizQuestions.length) * 100).toFixed(0)}%
                </div>
                
                <div className="text-left mb-6">
                  <h5 className="font-semibold mb-3">성과 평가:</h5>
                  {score === quizQuestions.length && (
                    <p className="text-green-600">완벽해요! 산화 공정을 완전히 이해했습니다.</p>
                  )}
                  {score >= quizQuestions.length * 0.8 && score < quizQuestions.length && (
                    <p className="text-blue-600">우수해요! 대부분의 개념을 잘 이해했습니다.</p>
                  )}
                  {score >= quizQuestions.length * 0.6 && score < quizQuestions.length * 0.8 && (
                    <p className="text-yellow-600">보통이에요. 몇 가지 개념을 더 복습해보세요.</p>
                  )}
                  {score < quizQuestions.length * 0.6 && (
                    <p className="text-red-600">더 학습이 필요해요. 이론 부분을 다시 확인해보세요.</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer('');
                    setScore(0);
                    setShowResults(false);
                  }}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700"
                >
                  다시 도전하기
                </button>
              </div>
            )}
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="min-h-screen bg-gray-900 text-white p-3 rounded-lg">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-xl font-bold mb-3 text-orange-400">🔧 열산화 장비 트러블슈팅 시뮬레이터</h1>

              {!troubleIsStarted ? (
                <div className="bg-gray-800 rounded-lg p-5 shadow-xl">
                  <h2 className="text-lg font-bold mb-3 text-yellow-400">🚨 트러블 시나리오 선택</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    {Object.entries(troubleScenarios).map(([id, s]) => (
                      <button
                        key={id}
                        onClick={() => setTroubleActiveScenario(Number(id))}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          troubleActiveScenario === Number(id)
                            ? 'border-orange-500 bg-orange-900/30'
                            : 'border-gray-600 hover:border-gray-400 bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{s.icon}</span>
                          <span className="font-bold">{s.name}</span>
                        </div>
                        <p className="text-xs text-gray-300">{s.description}</p>
                        {s.isDetective && (
                          <span className="inline-block mt-1 text-xs bg-purple-600 px-2 py-0.5 rounded">🔍 탐정모드</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleTroubleStart}
                    className={`w-full py-3 rounded-lg font-bold text-lg text-white bg-gradient-to-r ${troubleScenarios[troubleActiveScenario].color}`}
                  >
                    🚨 시나리오 시작
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2 bg-gray-800 rounded-lg p-3 shadow-xl">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-base font-bold text-orange-400">
                        {troubleScenarios[troubleActiveScenario].icon} {troubleScenarios[troubleActiveScenario].name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded font-mono">⏱️ {formatTroubleTime(troubleElapsedTime)}</span>
                        {troubleIsTriggered && !troubleIsSuccess && !troubleIsFailed && (
                          <span className="text-xs bg-red-600 px-2 py-1 rounded animate-pulse">⚠️ 이상</span>
                        )}
                      </div>
                    </div>

                    {/* SVG */}
                    <div className="bg-gray-900 rounded-lg p-2 mb-3">
                      <svg viewBox="0 0 700 340" className="w-full">
                        <defs>
                          <linearGradient id="troubleTubeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#374151"/>
                            <stop offset="50%" stopColor="#1f2937"/>
                            <stop offset="100%" stopColor="#374151"/>
                          </linearGradient>
                        </defs>

                        {/* Gas supply system */}
                        <g>
                          {/* Total gas valve */}
                          <rect x="10" y="20" width="40" height="25" rx="3" fill={troubleTotalGasValve ? "#166534" : "#7f1d1d"} stroke="#4b5563" strokeWidth="1"/>
                          <text x="30" y="30" textAnchor="middle" fontSize="7" fill="white">TOTAL</text>
                          <text x="30" y="40" textAnchor="middle" fontSize="6" fill="white">{troubleTotalGasValve ? 'OPEN' : 'CLOSE'}</text>

                          {/* Main gas line */}
                          <path d="M 50 32 L 70 32" stroke={troubleTotalGasValve ? "#4ade80" : "#6b7280"} strokeWidth="3"/>

                          {/* Individual gas lines */}
                          {[
                            { gas: 'O2', x: 70, color: '#3b82f6', label: 'O₂' },
                            { gas: 'N2', x: 120, color: '#6b7280', label: 'N₂' },
                            { gas: 'H2', x: 170, color: '#22c55e', label: 'H₂' }
                          ].map(({ gas, x, color, label }) => (
                            <g key={gas}>
                              {/* Manual valve */}
                              <rect x={x} y="15" width="30" height="18" rx="2"
                                fill={troubleManualValves[gas] ? "#374151" : "#7f1d1d"}
                                stroke={troubleManualValves[gas] ? "#6b7280" : "#ef4444"} strokeWidth="1"/>
                              <text x={x+15} y="22" textAnchor="middle" fontSize="6" fill="#9ca3af">수동</text>
                              <text x={x+15} y="30" textAnchor="middle" fontSize="5" fill="white">
                                {troubleManualValves[gas] ? 'OPEN' : 'CLOSE'}
                              </text>

                              {/* MFC */}
                              <rect x={x} y="38" width="30" height="22" rx="2" fill={color} stroke="#4b5563" strokeWidth="1"/>
                              <text x={x+15} y="47" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{label}</text>
                              <text x={x+15} y="56" textAnchor="middle" fontSize="6" fill="white">{troubleGasFlows[gas]}</text>

                              {/* MFC outlet valve */}
                              <rect x={x} y="65" width="30" height="15" rx="2"
                                fill={troubleMfcValves[gas] ? "#166534" : "#7f1d1d"}
                                stroke={troubleActiveScenario === 3 && !troubleAutoGasInterlock ? "#ef4444" : "#4b5563"} strokeWidth="1"/>
                              <text x={x+15} y="75" textAnchor="middle" fontSize="5" fill="white">
                                {troubleMfcValves[gas] ? 'OPEN' : 'CLOSE'}
                              </text>
                              {troubleActiveScenario === 3 && !troubleAutoGasInterlock && troubleMfcValves[gas] && (
                                <text x={x+15} y="88" textAnchor="middle" fontSize="6" fill="#ef4444" className="animate-pulse">고장!</text>
                              )}

                              {/* Gas flow indicator */}
                              <path d={`M ${x+15} 80 L ${x+15} 95 L 160 95`}
                                stroke={getTroubleActualGasFlow(gas) > 0 ? color : "#374151"}
                                strokeWidth="2" fill="none" strokeDasharray={getTroubleActualGasFlow(gas) > 0 ? "none" : "3,3"}/>
                            </g>
                          ))}
                        </g>

                        {/* Furnace */}
                        <rect x="150" y="105" width="380" height="130" rx="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>

                        {/* Heating zones (top) */}
                        {[0, 1, 2].map(i => (
                          <g key={`top-${i}`}>
                            <rect
                              x={165 + i * 125} y={112} width="110" height="22" rx="3"
                              fill={troubleActiveScenario === 2 ? "#ea580c" : troubleHeaterZones[i] ? (troubleZoneTemps[i] > 1100 ? "#dc2626" : "#ea580c") : "#374151"}
                              className={troubleActiveScenario !== 2 && troubleHeaterZones[i] && troubleZoneTemps[i] > 1050 ? "animate-pulse" : ""}
                            />
                            <text x={220 + i * 125} y={127} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
                              Z{i + 1}: {troubleActiveScenario === 2 ? "1000" : troubleZoneTemps[i].toFixed(0)}°C
                            </text>
                          </g>
                        ))}

                        {/* Quartz tube */}
                        <rect x="160" y="140" width="360" height="50" rx="5" fill="url(#troubleTubeGrad)" fillOpacity="0.5" stroke="#6b7280" strokeWidth="1"/>
                        <text x="340" y="158" textAnchor="middle" fontSize="10" fill="#9ca3af">Quartz Tube</text>
                        <text x="340" y="175" textAnchor="middle" fontSize="11"
                          fill={troubleChamberPressure > 1500 ? "#ef4444" : troubleChamberPressure > 100 ? "#fbbf24" : "#60a5fa"} fontWeight="bold">
                          {formatTroublePressure(troubleChamberPressure)}
                        </text>

                        {/* Wafer */}
                        {troubleWaferLoaded && (
                          <g>
                            <rect x="240" y="178" width="160" height="10" rx="2" fill="#8b5cf6"/>
                            {[...Array(8)].map((_, i) => (
                              <rect key={i} x={250 + i * 18} y={172} width="2" height="8" fill="#a78bfa"/>
                            ))}
                          </g>
                        )}

                        {/* Heating zones (bottom) */}
                        {[3, 4, 5].map(i => (
                          <g key={`bottom-${i}`}>
                            <rect
                              x={165 + (i - 3) * 125} y={198} width="110" height="22" rx="3"
                              fill={troubleActiveScenario === 2 ? "#ea580c" : troubleHeaterZones[i] ? (troubleZoneTemps[i] > 1100 ? "#dc2626" : "#ea580c") : "#374151"}
                            />
                            <text x={220 + (i - 3) * 125} y={213} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
                              Z{i + 1}: {troubleActiveScenario === 2 ? "1000" : troubleZoneTemps[i].toFixed(0)}°C
                            </text>
                          </g>
                        ))}

                        {/* Exhaust system */}
                        <path d="M 530 165 L 560 165 L 560 270 L 590 270"
                          stroke={troubleExhaustValve ? "#4b5563" : "#7f1d1d"} strokeWidth="3" fill="none"/>

                        <g>
                          <rect x="555" y="250" width="35" height="40" rx="3"
                            fill={troubleExhaustValve ? "#374151" : "#7f1d1d"}
                            stroke={troubleExhaustValve ? "#6b7280" : "#ef4444"} strokeWidth="1"/>
                          <text x="572" y="265" textAnchor="middle" fontSize="7" fill="white">배기</text>
                          <text x="572" y="278" textAnchor="middle" fontSize="6" fill={troubleExhaustValve ? "#4ade80" : "#ef4444"}>
                            {troubleExhaustValve ? 'OPEN' : 'CLOSE'}
                          </text>
                        </g>

                        <g>
                          <rect x="600" y="245" width="55" height="50" rx="4"
                            fill={troublePumpRunning ? "#1e40af" : "#7f1d1d"}
                            stroke={troublePumpRunning ? "#3b82f6" : "#ef4444"} strokeWidth="2"/>
                          <text x="627" y="265" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">PUMP</text>
                          <text x="627" y="280" textAnchor="middle" fontSize="8" fill={troublePumpRunning ? "#4ade80" : "#ef4444"}>
                            {troublePumpRunning ? "RUN" : "STOP"}
                          </text>
                          {!troublePumpRunning && <text x="627" y="305" textAnchor="middle" fontSize="8" fill="#ef4444">⚠️ 고장</text>}
                        </g>

                        {/* Status display */}
                        {troubleActiveScenario === 2 && troubleIsTriggered && (
                          <g>
                            <rect x="540" y="110" width="80" height="30" rx="3" fill={troubleUniformity < 90 ? "#7f1d1d" : "#166534"} stroke="#4b5563"/>
                            <text x="580" y="122" textAnchor="middle" fontSize="8" fill="#fbbf24">균일도</text>
                            <text x="580" y="135" textAnchor="middle" fontSize="11" fill={troubleUniformity >= 95 ? "#4ade80" : "#ef4444"} fontWeight="bold">
                              {troubleUniformity.toFixed(1)}%
                            </text>
                          </g>
                        )}

                        {troubleActiveScenario === 3 && troubleIsTriggered && (
                          <g>
                            <rect x="540" y="110" width="80" height="30" rx="3"
                              fill={troubleChamberPressure > 1500 ? "#7f1d1d" : troubleChamberPressure > 1000 ? "#854d0e" : "#1e3a8a"} stroke="#4b5563"/>
                            <text x="580" y="122" textAnchor="middle" fontSize="8" fill="#fbbf24">압력</text>
                            <text x="580" y="135" textAnchor="middle" fontSize="11"
                              fill={troubleChamberPressure > 1500 ? "#ef4444" : "#60a5fa"} fontWeight="bold">
                              {formatTroublePressure(troubleChamberPressure)}
                            </text>
                          </g>
                        )}

                        {/* Success/Fail */}
                        {troubleIsSuccess && (
                          <g>
                            <rect x="180" y="135" width="280" height="70" rx="8" fill="rgba(34,197,94,0.95)"/>
                            <text x="320" y="168" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">🎉 트러블 해결!</text>
                            <text x="320" y="190" textAnchor="middle" fontSize="10" fill="white">소요 시간: {formatTroubleTime(troubleElapsedTime)}</text>
                          </g>
                        )}
                        {troubleIsFailed && (
                          <g>
                            <rect x="180" y="135" width="280" height="70" rx="8" fill="rgba(220,38,38,0.95)"/>
                            <text x="320" y="168" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">
                              {troubleActiveScenario === 3 ? "💥 챔버 손상!" : troubleActiveScenario === 2 ? "⏰ 시간 초과!" : "❌ 장비 손상!"}
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* Situation briefing */}
                    {troubleShowSituation && (
                      <div className="bg-gray-950 rounded p-3 mb-3 border border-yellow-500">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-400 font-bold text-sm">📋 상황 브리핑</span>
                          {troubleIsTriggered && <span className="text-green-400 text-xs">✓ 조치 가능</span>}
                        </div>
                        <div className="font-mono text-xs text-green-400 whitespace-pre-line min-h-20">
                          {troubleSituationText}
                          {!troubleIsTriggered && <span className="animate-pulse">▌</span>}
                        </div>
                      </div>
                    )}

                    {/* Control panel */}
                    {troubleIsTriggered && !troubleIsSuccess && !troubleIsFailed && (
                      <div className="bg-gray-950 rounded p-3 space-y-3">

                        {/* Scenario 1 */}
                        {troubleActiveScenario === 1 && (
                          <>
                            <div className="bg-red-900/50 rounded p-2 border border-red-500">
                              <div className="text-yellow-300 text-xs mb-1">⚠️ 긴급 조치</div>
                              <div className="text-white text-xs space-y-0.5">
                                <div className={troubleScenario1Step >= 1 ? 'text-green-400' : ''}>1. Zone{troubleOverheatingZone + 1} 히터 OFF {troubleScenario1Step >= 1 && '✓'}</div>
                                <div className={troubleScenario1Step >= 2 ? 'text-green-400' : ''}>2. N₂ 300+ sccm {troubleScenario1Step >= 2 && '✓'}</div>
                                <div className={troubleScenario1Step >= 3 ? 'text-green-400' : ''}>3. 온도 900°C 이하 {troubleScenario1Step >= 3 && '✓'}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-6 gap-1">
                              {troubleHeaterZones.map((on, i) => (
                                <button key={i}
                                  onClick={() => setTroubleHeaterZones(prev => prev.map((v, idx) => idx === i ? !v : v))}
                                  className={`p-1.5 rounded text-xs font-bold ${on ? (troubleZoneTemps[i] > 1050 ? 'bg-red-600 animate-pulse' : 'bg-orange-600') : 'bg-gray-600'} text-white`}
                                >
                                  Z{i + 1} {on ? 'ON' : 'OFF'}
                                </button>
                              ))}
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">N₂: {troubleGasFlows.N2} sccm</div>
                              <input type="range" min="100" max="500" step="50" value={troubleGasFlows.N2}
                                onChange={(e) => setTroubleGasFlows(prev => ({ ...prev, N2: Number(e.target.value) }))}
                                className="w-full h-2"
                              />
                            </div>
                          </>
                        )}

                        {/* Scenario 2 */}
                        {troubleActiveScenario === 2 && (
                          <>
                            <div className="bg-blue-900/50 rounded p-2 border border-blue-500">
                              <div className="text-cyan-300 text-xs">🔍 TC 오류: 전류값으로 고장 Zone 찾기</div>
                              <div className="text-[10px] text-gray-400">정상: 43~49A / 이상: {"<30A 또는 >60A"}</div>
                            </div>
                            {!troubleScenario2Found ? (
                              <div className="grid grid-cols-3 gap-2">
                                {[0,1,2,3,4,5].map(i => (
                                  <div key={i} className="bg-gray-800 rounded p-2 border border-gray-600">
                                    <div className="text-center text-xs font-bold text-gray-300 mb-1">Zone {i+1}</div>
                                    {!troubleScenario2OpenedBoxes[i] ? (
                                      <button onClick={() => openTroubleControlBox(i)}
                                        className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs">📦 박스 열기</button>
                                    ) : (
                                      <div className="space-y-1">
                                        <div className={`text-center py-1 rounded ${isTroubleCurrentAbnormal(troubleZoneCurrents[i]) ? 'bg-red-900 border border-red-500' : 'bg-green-900'}`}>
                                          <div className={`text-base font-mono font-bold ${isTroubleCurrentAbnormal(troubleZoneCurrents[i]) ? 'text-red-400' : 'text-green-400'}`}>
                                            {troubleZoneCurrents[i].toFixed(1)}A
                                          </div>
                                          {isTroubleCurrentAbnormal(troubleZoneCurrents[i]) && <div className="text-[10px] text-red-300">⚠️ 이상!</div>}
                                        </div>
                                        {isTroubleCurrentAbnormal(troubleZoneCurrents[i]) && (
                                          <button onClick={() => replaceTroubleTC(i)}
                                            className="w-full py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-bold">🔧 TC 교체</button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-green-900/50 rounded p-3 border border-green-500">
                                <div className="text-green-300 font-bold">✅ TC 교체 완료!</div>
                                <p className="text-sm text-white">Zone{troubleScenario2FaultZone + 1} 수리됨. 균일도: {troubleUniformity.toFixed(1)}%</p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Scenario 3 */}
                        {troubleActiveScenario === 3 && (
                          <>
                            <div className="bg-red-900/50 rounded p-2 border border-red-500">
                              <div className="text-yellow-300 text-xs font-bold mb-1">🚨 인터락 실패! 수동 조치 필요!</div>
                              <div className="text-white text-[10px] space-y-0.5">
                                <div className={troubleScenario3Step >= 1 ? 'text-green-400' : ''}>1. 가스 밸브 모두 차단 {troubleScenario3Step >= 1 && '✓'}</div>
                                <div className={troubleScenario3Step >= 2 ? 'text-green-400' : ''}>2. 펌프 수리 {troubleScenario3Step >= 2 && '✓'}</div>
                                <div className={troubleScenario3Step >= 3 ? 'text-green-400' : ''}>3. 배기밸브 열기 {troubleScenario3Step >= 3 && '✓'}</div>
                                <div className={troubleChamberPressure <= 0.01 ? 'text-green-400' : ''}>4. 진공 배기 (5×10⁻³ Torr 이하) - 현재: {formatTroublePressure(troubleChamberPressure)}</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {/* Gas control */}
                              <div className="bg-gray-800 p-2 rounded">
                                <div className="text-xs text-gray-400 mb-2">가스 밸브 (위→아래: 수동→MFC)</div>

                                {/* Total valve */}
                                <button onClick={() => setTroubleTotalGasValve(!troubleTotalGasValve)}
                                  className={`w-full mb-2 py-1.5 rounded text-xs font-bold ${troubleTotalGasValve ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                                  TOTAL GAS {troubleTotalGasValve ? 'OPEN' : 'CLOSED'}
                                </button>

                                <div className="grid grid-cols-3 gap-1">
                                  {['O2', 'N2', 'H2'].map(gas => (
                                    <div key={gas} className="space-y-1">
                                      <div className="text-center text-[10px] text-gray-400">{gas}</div>
                                      {/* Manual valve */}
                                      <button onClick={() => toggleTroubleManualValve(gas)}
                                        className={`w-full py-1 rounded text-[10px] ${troubleManualValves[gas] ? 'bg-gray-600' : 'bg-red-700'}`}>
                                        수동 {troubleManualValves[gas] ? 'O' : 'X'}
                                      </button>
                                      {/* MFC valve (broken) */}
                                      <button onClick={() => tryTroubleMfcValve(gas)}
                                        disabled={troubleTriedMfc[gas]}
                                        className={`w-full py-1 rounded text-[10px] ${
                                          troubleTriedMfc[gas] ? 'bg-red-900 text-red-400' : 'bg-yellow-700'
                                        }`}>
                                        MFC {troubleTriedMfc[gas] ? '고장!' : '시도'}
                                      </button>
                                      {/* Actual flow */}
                                      <div className={`text-center text-[10px] font-mono ${getTroubleActualGasFlow(gas) > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                                        {getTroubleActualGasFlow(gas)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Pump/Exhaust */}
                              <div className="bg-gray-800 p-2 rounded">
                                <div className="text-xs text-gray-400 mb-2">펌프 / 배기</div>
                                <button onClick={repairTroublePump} disabled={troublePumpRepaired}
                                  className={`w-full mb-2 py-2 rounded text-xs font-bold ${troublePumpRepaired ? 'bg-green-700' : 'bg-yellow-600 hover:bg-yellow-500'}`}>
                                  🔧 펌프 {troublePumpRepaired ? '수리완료' : '수리'}
                                </button>
                                <button onClick={openTroubleExhaustValve} disabled={troubleExhaustValve}
                                  className={`w-full py-2 rounded text-xs font-bold ${troubleExhaustValve ? 'bg-green-700' : 'bg-purple-600 hover:bg-purple-500'}`}>
                                  🚪 배기밸브 {troubleExhaustValve ? 'OPEN' : 'CLOSED'}
                                </button>

                                {/* Pressure bar */}
                                <div className="mt-2">
                                  <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>압력</span>
                                    <span className={troubleChamberPressure > 1500 ? 'text-red-400' : troubleChamberPressure <= 0.01 ? 'text-green-400' : 'text-yellow-400'}>
                                      {formatTroublePressure(troubleChamberPressure)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded h-2 mt-1">
                                    <div className={`h-2 rounded transition-all ${
                                      troubleChamberPressure > 1500 ? 'bg-red-500' :
                                      troubleChamberPressure > 100 ? 'bg-yellow-500' :
                                      troubleChamberPressure > 0.01 ? 'bg-blue-500' : 'bg-green-500'
                                    }`}
                                      style={{ width: `${Math.max(Math.min((Math.log10(troubleChamberPressure + 0.001) + 3) / 6.3 * 100, 100), 2)}%` }}/>
                                  </div>
                                  <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
                                    <span>10⁻³</span>
                                    <span>1</span>
                                    <span>760</span>
                                    <span>2000</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {troubleScenario3Warnings.length > 0 && (
                              <div className="bg-gray-800 rounded p-2 border border-yellow-600 max-h-20 overflow-y-auto">
                                {troubleScenario3Warnings.map(w => (
                                  <div key={w.id} className="text-xs text-yellow-200">{w.msg}</div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <button onClick={handleTroubleReset} className="mt-3 w-full py-2 bg-gray-600 rounded font-bold hover:bg-gray-500 text-sm">
                      🔄 시나리오 선택으로
                    </button>
                  </div>

                  {/* Right side status */}
                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded p-3">
                      <h3 className="font-bold mb-2 text-cyan-400 text-sm">📊 실시간 상태</h3>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">압력</span>
                          <span className={`font-mono ${troubleChamberPressure > 100 ? 'text-red-400' : 'text-cyan-400'}`}>{formatTroublePressure(troubleChamberPressure)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">펌프</span>
                          <span className={`font-mono ${troublePumpRunning ? 'text-green-400' : 'text-red-400'}`}>{troublePumpRunning ? 'RUN' : 'STOP'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">배기밸브</span>
                          <span className={`font-mono ${troubleExhaustValve ? 'text-green-400' : 'text-red-400'}`}>{troubleExhaustValve ? 'OPEN' : 'CLOSED'}</span>
                        </div>
                        <hr className="border-gray-700 my-1"/>
                        <div className="text-[10px] text-gray-500">가스 공급량 (sccm)</div>
                        <div className="grid grid-cols-3 gap-1 text-xs">
                          {['O2', 'N2', 'H2'].map(gas => (
                            <div key={gas} className={`text-center p-1 rounded ${getTroubleActualGasFlow(gas) > 0 ? 'bg-green-900' : 'bg-gray-700'}`}>
                              {gas}: {getTroubleActualGasFlow(gas)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-900/30 rounded p-3 border border-yellow-600">
                      <h3 className="font-bold text-yellow-400 mb-1 text-sm">💡 힌트</h3>
                      <p className="text-xs text-yellow-100">
                        {troubleActiveScenario === 1 && `Zone${troubleOverheatingZone + 1} 히터 OFF → N₂ 퍼지 증가`}
                        {troubleActiveScenario === 2 && "전류가 비정상(< 30A 또는 > 60A)인 Zone을 찾으세요"}
                        {troubleActiveScenario === 3 && "MFC 밸브가 고장! 수동밸브나 토탈밸브로 가스 차단 후 진공 배기!"}
                      </p>
                    </div>

                    {troubleActiveScenario === 3 && troubleIsTriggered && (
                      <div className="bg-purple-900/30 rounded p-3 border border-purple-600">
                        <h3 className="font-bold text-purple-400 mb-1 text-sm">📚 가스 제어 계층</h3>
                        <p className="text-[10px] text-purple-200">
                          <strong>토탈밸브</strong> → <strong>수동밸브</strong> → <strong>MFC</strong> → <strong>MFC출구밸브</strong><br/><br/>
                          MFC 출구밸브(솔레노이드)가 고장나면 수동밸브나 토탈밸브로 차단해야 합니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>탭을 선택해주세요.</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
      
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-800 shadow-sm'
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
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OxidationSimulator;
