import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VacuumSimulator = () => {
  // 탭 상태
  const [activeTab, setActiveTab] = useState('pumping-simulation');
  const [selectedModel, setSelectedModel] = useState(2); // 모델 2가 기본값
  const [targetPressure, setTargetPressure] = useState(5); // 목표 압력 (슬라이더로 설정)
  
  // 기존 상태들
  const [pumpingSpeed, setPumpingSpeed] = useState(1800);
  const [gasFlowRate, setGasFlowRate] = useState(10);
  const [fixedPressure, setFixedPressure] = useState(5e-5);
  const [gateValveOpening, setGateValveOpening] = useState(100);
  const [chamberVolume, setChamberVolume] = useState(100);
  
  // 애니메이션 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationPressure, setAnimationPressure] = useState(760);
  const [animationSpeed, setAnimationSpeed] = useState(250);
  const [elapsedTime, setElapsedTime] = useState(0);
  
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
  
  // 탭 정의
  const tabs = [
    { id: 'pumping-simulation', name: '실시간 펌핑 시뮬레이션', icon: '⚡' },
    { id: 'performance-analysis', name: '성능 특성 곡선 분석', icon: '📊' },
    { id: 'process-control', name: '공정 압력 세팅 실험', icon: '🔧' },
    { id: 'conductance-relation', name: 'Conductance & 압력 관계', icon: '🔄' },
    { id: 'pipe-design', name: '배관 설계 최적화', icon: '🏗️' },
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
  
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 0.1;
          const scaleFactor = chamberVolume / 100;
          const totalTime = 300 * scaleFactor;
          const phase1Time = 30 * scaleFactor;
          const phase2Time = 120 * scaleFactor;
          
          let newPressure;
          if (newTime < phase1Time) {
            newPressure = 760 * Math.exp(-newTime / (8 * scaleFactor)) + 1;
          } else if (newTime < phase2Time) {
            newPressure = 1 * Math.exp(-(newTime - phase1Time) / (25 * scaleFactor)) + 0.01;
          } else {
            const targetPressure = 0.02;
            newPressure = Math.max(targetPressure, 0.01 * Math.exp(-(newTime - phase2Time) / (60 * scaleFactor)) + targetPressure);
          }
          
          setAnimationPressure(newPressure);
          setAnimationSpeed(Math.round(calculatePumpingSpeed(newPressure, 2)));
          
          if (newTime >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, chamberVolume]);
  
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

  return (
    <div className="flex-1 flex flex-col">
      {/* 상단 탭 네비게이션 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
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
          {/* 테마 1: 실시간 펌핑 시뮬레이션 */}
          {activeTab === 'pumping-simulation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              {/* 왼쪽: 제목과 시뮬레이션 */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <h2 className="text-2xl font-bold mb-4 text-indigo-800">실시간 펌핑 시뮬레이션</h2>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">목적과 이유</h4>
                    <p className="text-indigo-700 text-sm leading-relaxed">
                      <strong>왜 이 시뮬레이션이 필요한가?</strong><br/>
                      진공펌프의 펌핑 과정은 실제로는 수 분에서 수 시간에 걸쳐 일어나는 현상입니다. 
                      이론적으로만 배우기 어려운 "시간에 따른 압력 변화", "펌프 성능 변화", "포화점 도달" 등의 
                      개념을 시각적으로 체험할 수 있게 합니다.
                    </p>
                  </div>
                </div>
                
                {/* 시뮬레이션 개략도 */}
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex justify-center mb-4">
                    <svg width="700" height="220" viewBox="0 0 700 220" className="border border-gray-300 bg-white rounded">
                      <rect 
                        x="50" y="80" width="150" height="80" 
                        fill={animationPressure > 100 ? "#ffcdd2" : animationPressure > 1 ? "#fff3e0" : animationPressure > 1e-3 ? "#e8f5e8" : "#e3f2fd"} 
                        stroke="#1976d2" strokeWidth="3" rx="10"
                      />
                      
                      <text x="125" y="70" textAnchor="middle" className="text-sm font-semibold">진공 챔버</text>
                      <text x="125" y="185" textAnchor="middle" className="text-xs">체적: {chamberVolume}L</text>
                      <text x="125" y="200" textAnchor="middle" className="text-xs">압력:</text>
                      <text x="125" y="215" textAnchor="middle" className="text-xs text-blue-600 font-bold">
                        {animationPressure >= 1 ? animationPressure.toFixed(1) : animationPressure.toExponential(2)} Torr
                      </text>
                      
                      {/* 분자 시각화 */}
                      {Array.from({length: Math.min(25, Math.max(2, Math.floor(animationPressure / 5)))}).map((_, i) => {
                        const baseCount = animationPressure <= 0.1 ? 2 : 0;
                        const dynamicCount = animationPressure > 0.1 ? Math.floor(animationPressure / 5) : 0;
                        
                        if (i >= baseCount + dynamicCount) return null;
                        
                        const isStuckMolecule = i < baseCount && animationPressure <= 0.1;
                        const animationClass = isStuckMolecule ? "" : (isPlaying ? "animate-pulse" : "");
                        
                        return (
                          <circle 
                            key={i}
                            cx={70 + (i % 6) * 20} 
                            cy={100 + Math.floor(i / 6) * 15} 
                            r={isStuckMolecule ? "2.5" : "2"} 
                            fill={isStuckMolecule ? "#d32f2f" : "#666"}
                            className={animationClass}
                            style={{ opacity: isStuckMolecule ? 0.8 : 1 }}
                          />
                        );
                      })}
                      
                      {/* 배관 */}
                      <line x1="200" y1="120" x2="280" y2="120" stroke="#666" strokeWidth="8"/>
                      {isPlaying && (
                        <line x1="200" y1="120" x2="280" y2="120" stroke="#4fc3f7" strokeWidth="4">
                          <animate attributeName="stroke-dasharray" values="0,20;20,0;0,20" dur="1s" repeatCount="indefinite"/>
                        </line>
                      )}
                      
                      {/* 진공펌프 */}
                      <rect x="280" y="90" width="100" height="60" fill="#fff3e0" stroke="#f57c00" strokeWidth="3" rx="5"/>
                      <circle cx="330" cy="120" r="15" fill="none" stroke="#f57c00" strokeWidth="2">
                        {isPlaying && (
                          <animateTransform 
                            attributeName="transform" 
                            type="rotate" 
                            values="0 330 120;360 330 120" 
                            dur={`${Math.max(0.5, 2 - animationSpeed / 1000)}s`} 
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                      <text x="330" y="80" textAnchor="middle" className="text-sm font-semibold">진공펌프</text>
                      <text x="330" y="175" textAnchor="middle" className="text-xs">
                        배기속도: {animationSpeed} m³/h
                      </text>
                      
                      {/* 배기 */}
                      <line x1="380" y1="120" x2="430" y2="120" stroke="#666" strokeWidth="8"/>
                      <polygon points="430,110 450,120 430,130" fill="#666"/>
                      {isPlaying && (
                        <circle cx="460" cy="120" r="3" fill="#4fc3f7" opacity="0.7">
                          <animate attributeName="cx" values="460;500;460" dur="0.8s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" repeatCount="indefinite"/>
                        </circle>
                      )}
                      
                      {/* 시간 표시 */}
                      <text x="350" y="30" textAnchor="middle" className="text-lg font-bold text-purple-600">
                        {formatTime(elapsedTime)}
                      </text>
                    </svg>
                  </div>
                  
                  {/* 컨트롤 버튼 */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className={`px-6 py-2 rounded-md font-semibold ${
                        isPlaying 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isPlaying ? '⏸️ 정지' : '▶️ 재생'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-semibold"
                    >
                      🔄 리셋
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 오른쪽: 모니터링 패널 */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-gray-800">실시간 모니터링</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">경과 시간:</span>
                      <span className="ml-2 font-bold text-purple-600">{formatTime(elapsedTime)}</span></p>
                    <p><span className="font-medium">현재 압력:</span>
                      <span className="ml-2 font-bold text-blue-600">
                        {animationPressure >= 1 ? animationPressure.toFixed(1) : animationPressure.toExponential(2)} Torr
                      </span></p>
                    <p><span className="font-medium">배기속도:</span>
                      <span className="ml-2 font-bold text-green-600">{animationSpeed} m³/h</span></p>
                    <p><span className="font-medium">진공단계:</span>
                      <span className="ml-2 font-bold text-orange-600">{getVacuumStage(animationPressure)}</span></p>
                    <p><span className="font-medium">챔버 크기:</span>
                      <span className="ml-2 font-bold text-indigo-600">{chamberVolume}L</span></p>
                    <p><span className="font-medium">예상 완료시간:</span>
                      <span className="ml-2 font-bold text-red-600">{Math.round(300 * chamberVolume / 100 / 60)}분</span></p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">펌핑 특성 ({chamberVolume}L 챔버)</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>• <strong>0-{Math.round(30 * chamberVolume / 100)}초:</strong> 빠른 초기 배기 (760→1 Torr)</p>
                    <p>• <strong>{Math.round(30 * chamberVolume / 100)}-{Math.round(120 * chamberVolume / 100)}초:</strong> 중진공 형성 (1→0.01 Torr)</p>
                    <p>• <strong>{Math.round(120 * chamberVolume / 100)}초+:</strong> 포화점 접근 (→20 mTorr)</p>
                    <p>• <strong>{Math.round(300 * chamberVolume / 100 / 60)}분:</strong> 시뮬레이션 완료</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">관찰 포인트</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• 초기: 빠른 압력 감소</p>
                    <p>• 중간: 배기속도 변화</p>
                    <p>• 후반: 20 mTorr 포화점 도달</p>
                    <p>• 챔버 색상 변화 주목!</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-3">챔버 크기 조정</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">챔버 체적 (L)</label>
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
                      <span>500L</span>
                      <span>1000L</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="font-bold text-indigo-600">{chamberVolume}L</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 더 생각해보기 섹션 */}
              <div className="lg:col-span-3 mt-8 bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">더 생각해보기</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-700 mb-2">토론 주제 1: 펌핑 시간 최적화 전략</h4>
                    <p className="text-emerald-600 mb-2">
                      1000L 대형 챔버에서 760 Torr → 1 Torr 도달시간이 30분이 걸린다면, 
                      시간을 15분으로 단축하기 위한 현실적인 방법들을 제시하고 각각의 장단점을 분석해보세요.
                    </p>
                    <p className="text-xs text-emerald-500">
                      힌트: 펌프 교체, 병렬 연결, 예열, 배관 최적화 등을 고려해보세요.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-700 mb-2">토론 주제 2: 포화점 문제 해결</h4>
                    <p className="text-emerald-600 mb-2">
                      시뮬레이션에서 20 mTorr 포화점에 도달한 후 더 이상 압력이 내려가지 않습니다. 
                      실제 산업 현장에서 이런 상황이 발생했을 때 원인을 찾고 해결하는 체계적인 접근 방법을 설명해보세요.
                    </p>
                    <p className="text-xs text-emerald-500">
                      힌트: 가스 방출원, 누설, 펌프 한계, 측정 오차 등을 고려해보세요.
                    </p>
                  </div>
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
        </div>
      </div>
    </div>
  );
};

export default VacuumSimulator;
