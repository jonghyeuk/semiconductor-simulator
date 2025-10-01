import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const OxidationSimulator = () => {
  const [activeTab, setActiveTab] = useState('overview');
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

  const [simOrientation, setSimOrientation] = useState('100');
  const [simDopingLevel, setSimDopingLevel] = useState(0);
  const [simInitialOxide, setSimInitialOxide] = useState(0);
  const [simTemperature, setSimTemperature] = useState(1000);
  const [simPressure, setSimPressure] = useState(1);
  const [showSimResult, setShowSimResult] = useState(false);

  const tabs = [
    { id: 'overview', name: '산화 공정 개요', icon: '🔥' },
    { id: 'thermal', name: '열산화 실험', icon: '🌡️' },
    { id: 'analysis', name: '산화 영향 인자', icon: '📊' },
    { id: 'quiz', name: '산화 평가', icon: '📝' }
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

  const renderTabContent = () => {
    switch (activeTab) {
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
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">O₂: {gasFlows.O2} sccm</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={gasFlows.O2}
                        onChange={(e) => setGasFlows({...gasFlows, O2: Number(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">H₂O: {gasFlows.H2O} sccm</label>
                      <input
                        type="range"
                        min="0"
                        max="300"
                        step="10"
                        value={gasFlows.H2O}
                        onChange={(e) => setGasFlows({...gasFlows, H2O: Number(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">H₂: {gasFlows.H2} sccm</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={gasFlows.H2}
                        onChange={(e) => setGasFlows({...gasFlows, H2: Number(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">N₂: {gasFlows.N2} sccm</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={gasFlows.N2}
                        onChange={(e) => setGasFlows({...gasFlows, N2: Number(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">HCl: {gasFlows.HCl} sccm</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={gasFlows.HCl}
                        onChange={(e) => setGasFlows({...gasFlows, HCl: Number(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">장비 제어</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">온도: {temperature}°C</label>
                      <input
                        type="range"
                        min="800"
                        max="1200"
                        step="25"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">시간: {time}분</label>
                      <input
                        type="range"
                        min="10"
                        max="180"
                        step="10"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="w-full"
                      />
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
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
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
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Boron 도핑 농도: {simDopingLevel}×10¹⁸ cm⁻³
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={simDopingLevel}
                      onChange={(e) => setSimDopingLevel(Number(e.target.value))}
                      className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>무도핑</span>
                      <span>고농도</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
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
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      초기 산화막 두께: {simInitialOxide} nm
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={simInitialOxide}
                      onChange={(e) => setSimInitialOxide(Number(e.target.value))}
                      className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0 nm</span>
                      <span>100 nm</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      온도: {simTemperature}°C
                    </label>
                    <input
                      type="range"
                      min="900"
                      max="1200"
                      step="50"
                      value={simTemperature}
                      onChange={(e) => setSimTemperature(Number(e.target.value))}
                      className="w-full h-3 bg-red-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      압력: {simPressure.toFixed(1)} atm
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.5"
                      value={simPressure}
                      onChange={(e) => setSimPressure(Number(e.target.value))}
                      className="w-full h-3 bg-purple-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">조합 효과:</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {calculateTempPressureRate(simTemperature, simPressure).toFixed(2)}x
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowSimResult(true)}
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
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

      default:
        return <div>탭을 선택해주세요.</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
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
