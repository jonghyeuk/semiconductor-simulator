import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';

const PlasmaSimulator = () => {
  const [activeTheme, setActiveTheme] = useState('plasma-basics');
  const [gasPressure, setGasPressure] = useState(1.0);
  const [plasmaEnergy, setPlasmaEnergy] = useState(100);
  const [electronTemp, setElectronTemp] = useState(3.0);
  const [ionTemp, setIonTemp] = useState(0.03);
  const [electronDensity, setElectronDensity] = useState(1e11);
  const [basicGasPressure, setBasicGasPressure] = useState(3.0);
  const [basicPlasmaEnergy, setBasicPlasmaEnergy] = useState(150);
  const [pressure, setPressure] = useState(1.0);
  const [distance, setDistance] = useState(1.0);
  const [gasType, setGasType] = useState('argon');
  const [frequency, setFrequency] = useState(13.56);
  const [inductance, setInductance] = useState(100);
  const [capacitance, setCapacitance] = useState(100);
  const [rfPower, setRfPower] = useState(100);
  const [loadImpedance, setLoadImpedance] = useState(50);
  const [systemType, setSystemType] = useState('CCP');
  const [electrodeArea, setElectrodeArea] = useState(314);
  const [electrodeGap, setElectrodeGap] = useState(5);

  const themes = [
    { id: 'plasma-basics', name: '플라즈마 기본 특성', icon: '⚡', color: 'blue' },
    { id: 'plasma-principle1', name: '플라즈마 발생원리1', icon: '🔬', color: 'indigo' },
    { id: 'plasma-principle2', name: '플라즈마 발생원리2', icon: '📈', color: 'violet' },
    { id: 'rf-matching', name: 'RF 및 매칭', icon: '📡', color: 'green' },
    { id: 'system-structure', name: '시스템 구조(CCP)', icon: '🏗️', color: 'purple' }
  ];

  // 이온화율 계산 함수
  // 참고: 태양의 핵 이온화율 = 100%
  // 반도체 공정용 플라즈마 이온화율 = <0.001% (매우 낮은 편)
  // Strong Plasma (고밀도 플라즈마) = ~0.001% 수준
  const calculateBasicIonizationDegree = () => {
    const optimalPressure = 3.0;
    const pressureFactor = Math.exp(-Math.pow((basicGasPressure - optimalPressure) / 2, 2));
    const energyFactor = basicPlasmaEnergy / (basicPlasmaEnergy + 50);
    return (pressureFactor * energyFactor * 0.0018).toFixed(4);
  };

  const calculateBasicPlasmaGenerationProbability = () => {
    const optimalPressure = 3.0;
    const pressureFactor = Math.exp(-Math.pow((basicGasPressure - optimalPressure) / 2, 2));
    const energyFactor = basicPlasmaEnergy / (basicPlasmaEnergy + 50);
    return (pressureFactor * energyFactor * 100).toFixed(1);
  };

  const getBasicPlasmaState = () => {
    const probability = parseFloat(calculateBasicPlasmaGenerationProbability());
    if (probability < 30) return { status: 'OFF', description: 'No Plasma', color: '#dc2626', ionizationRate: 0 };
    else if (probability < 70) return { status: 'ON', description: 'Weak Plasma', color: '#f59e0b', ionizationRate: parseFloat(calculateBasicIonizationDegree()) };
    else return { status: 'ON', description: 'Strong Plasma', color: '#10b981', ionizationRate: parseFloat(calculateBasicIonizationDegree()) };
  };

  const generateBasicPressureData = () => {
    const data = [];
    for (let i = 0; i < 15; i++) {
      const p = 0.5 + i * 0.5;
      const optimalPressure = 3.0;
      const pressureFactor = Math.exp(-Math.pow((p - optimalPressure) / 2, 2));
      const energyFactor = basicPlasmaEnergy / (basicPlasmaEnergy + 50);
      const density = pressureFactor * energyFactor * 20;
      data.push({ pressure: p.toFixed(1), density: Math.max(0.1, density).toFixed(1) });
    }
    return data;
  };

  const calculateBreakdownVoltage = (p, d) => {
    const pd = p * d;
    if (pd < 0.1 || pd > 100) return null;
    const gasData = {
      argon: [{ pd: 0.1, voltage: 4000 }, { pd: 0.3, voltage: 500 }, { pd: 0.5, voltage: 300 }, { pd: 1.0, voltage: 200 }, { pd: 2.0, voltage: 280 }, { pd: 5.0, voltage: 400 }, { pd: 10, voltage: 500 }, { pd: 20, voltage: 1200 }, { pd: 50, voltage: 3000 }, { pd: 100, voltage: 4000 }],
      air: [{ pd: 0.1, voltage: 5000 }, { pd: 0.3, voltage: 700 }, { pd: 0.5, voltage: 400 }, { pd: 1.0, voltage: 350 }, { pd: 2.0, voltage: 450 }, { pd: 5.0, voltage: 700 }, { pd: 10, voltage: 800 }, { pd: 20, voltage: 1800 }, { pd: 50, voltage: 4500 }, { pd: 100, voltage: 5000 }],
      helium: [{ pd: 0.1, voltage: 6000 }, { pd: 0.3, voltage: 1000 }, { pd: 0.5, voltage: 600 }, { pd: 1.0, voltage: 400 }, { pd: 2.0, voltage: 500 }, { pd: 5.0, voltage: 800 }, { pd: 10, voltage: 1000 }, { pd: 20, voltage: 2000 }, { pd: 50, voltage: 4800 }, { pd: 100, voltage: 6000 }],
      nitrogen: [{ pd: 0.1, voltage: 4500 }, { pd: 0.3, voltage: 600 }, { pd: 0.5, voltage: 350 }, { pd: 1.0, voltage: 250 }, { pd: 2.0, voltage: 320 }, { pd: 5.0, voltage: 500 }, { pd: 10, voltage: 650 }, { pd: 20, voltage: 1400 }, { pd: 50, voltage: 3500 }, { pd: 100, voltage: 4500 }],
      neon: [{ pd: 0.1, voltage: 5500 }, { pd: 0.3, voltage: 800 }, { pd: 0.5, voltage: 450 }, { pd: 1.0, voltage: 300 }, { pd: 2.0, voltage: 380 }, { pd: 5.0, voltage: 600 }, { pd: 10, voltage: 750 }, { pd: 20, voltage: 1600 }, { pd: 50, voltage: 4000 }, { pd: 100, voltage: 5500 }]
    };
    const data = gasData[gasType] || gasData.argon;
    for (let i = 0; i < data.length - 1; i++) {
      if (pd >= data[i].pd && pd <= data[i + 1].pd) {
        const ratio = (pd - data[i].pd) / (data[i + 1].pd - data[i].pd);
        return data[i].voltage + ratio * (data[i + 1].voltage - data[i].voltage);
      }
    }
    return data[data.length - 1].voltage;
  };

  const findMinimumBreakdownPoint = () => {
    const minPoints = { argon: { pd: 1.0, voltage: 200 }, air: { pd: 1.0, voltage: 350 }, helium: { pd: 1.0, voltage: 400 }, nitrogen: { pd: 1.0, voltage: 250 }, neon: { pd: 1.0, voltage: 300 } };
    return minPoints[gasType] || minPoints.argon;
  };

  const generatePaschenData = () => {
    const data = [];
    const pdValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0, 10, 15, 20, 30, 50, 80, 100];
    for (const pd of pdValues) {
      const voltage = calculateBreakdownVoltage(pd, 1.0);
      if (voltage !== null) data.push({ pd: pd.toString(), voltage: Math.round(voltage).toString() });
    }
    return data;
  };

  const getTownsendInfo = (pd) => {
    let alpha;
    if (pd < 0.5) alpha = pd * 20;
    else if (pd <= 2.0) alpha = 10 + (pd - 0.5) * 20;
    else alpha = 40 * Math.exp(-(pd-2)/3);
    const isOptimal = pd >= 0.7 && pd <= 1.5;
    return { alpha: alpha.toFixed(1), isOptimal: isOptimal, efficiency: isOptimal ? "최적" : pd < 0.7 ? "부족" : "과다" };
  };

  const calculateInputImpedance = () => {
    const omega = 2 * Math.PI * frequency * 1e6;
    const L = inductance * 1e-9;
    const C = capacitance * 1e-12;
    const XL = omega * L; // 인덕터 리액턴스
    const XC = 1 / (omega * C); // 캐패시터 리액턴스
    
    // L-type 매칭: 직렬 L, 병렬 C 가정
    // Z_parallel = (loadImpedance * (-jXC)) / (loadImpedance - jXC)
    const Z_load = loadImpedance;
    
    // 병렬 C와 부하의 합성 임피던스 (간단화)
    const Z_parallel_real = (Z_load * XC * XC) / (Z_load * Z_load + XC * XC);
    const Z_parallel_imag = -(Z_load * Z_load * XC) / (Z_load * Z_load + XC * XC);
    
    // 직렬 L 추가
    const Z_in_imag = XL + Z_parallel_imag;
    
    // 입력 임피던스 크기
    const Z_in = Math.sqrt(Z_parallel_real * Z_parallel_real + Z_in_imag * Z_in_imag);
    
    return Z_in.toFixed(1);
  };

  const calculateOptimalLC = () => {
    const f = frequency * 1e6;
    const omega = 2 * Math.PI * f;
    const Z_load = loadImpedance;
    const Z_source = 50;
    
    if (Z_load > Z_source) {
      // 직렬 L, 병렬 C 구조
      const Q = Math.sqrt(Z_load / Z_source - 1);
      const X_L = Q * Z_source;
      const X_C = Z_load / Q;
      
      return {
        L: ((X_L / omega) * 1e9).toFixed(0), // nH
        C: ((1 / (omega * X_C)) * 1e12).toFixed(0), // pF
        type: 'L-type (직렬L-병렬C)'
      };
    } else {
      // 병렬 C, 직렬 L 구조 (역순)
      const Q = Math.sqrt(Z_source / Z_load - 1);
      const X_C = Z_source / Q;
      const X_L = Q * Z_load;
      
      return {
        L: ((X_L / omega) * 1e9).toFixed(0), // nH
        C: ((1 / (omega * X_C)) * 1e12).toFixed(0), // pF
        type: 'L-type (병렬C-직렬L)'
      };
    }
  };

  const calculateReflectedPower = () => {
    const Z_in = parseFloat(calculateInputImpedance());
    const impedanceMismatch = Math.abs(Z_in - 50) / 50;
    return (rfPower * Math.pow(impedanceMismatch, 2)).toFixed(1);
  };

  const applyAutoMatching = () => {
    const optimal = calculateOptimalLC();
    setInductance(parseInt(optimal.L));
    setCapacitance(parseInt(optimal.C));
  };

  function PlasmaVisualization() {
    const plasmaState = getBasicPlasmaState();
    const [particles, setParticles] = useState([]);
    const [animationId, setAnimationId] = useState(null);

    // 초기 입자 생성
    useEffect(() => {
      let baseParticles = Math.floor(basicGasPressure * 10);

      // 실제 이온화율은 매우 낮지만 (0.0018%), 시각화를 위해 입자 수는 별도 계산
      // Weak Plasma: 적은 수의 이온/전자
      // Strong Plasma: 더 많은 이온/전자
      let ionParticles;
      if (plasmaState.description === 'Strong Plasma') {
        baseParticles = Math.floor(baseParticles * 2); // 전체 입자 증가
        ionParticles = Math.floor(baseParticles * 0.3); // Strong: 30% 정도 이온화
      } else if (plasmaState.description === 'Weak Plasma') {
        ionParticles = Math.floor(baseParticles * 0.15); // Weak: 15% 정도 이온화
      } else {
        ionParticles = 0; // No Plasma: 이온 없음
      }

      const remainingNeutrals = baseParticles - ionParticles;
      
      const newParticles = [];
      
      // 중성 입자
      for (let i = 0; i < remainingNeutrals; i++) {
        newParticles.push({
          id: i,
          type: 'neutral',
          x: Math.random() * 300 + 25,
          y: Math.random() * 200 + 25,
          vx: (Math.random() - 0.5) * 2.5, // 속도 증가: 1.0 → 2.5
          vy: (Math.random() - 0.5) * 2.5,
          color: '#9CA3AF',
          size: 3
        });
      }
      
      // 이온 (빨간색)
      for (let i = 0; i < ionParticles; i++) {
        newParticles.push({
          id: remainingNeutrals + i,
          type: 'ion',
          x: Math.random() * 300 + 25,
          y: Math.random() * 200 + 25,
          vx: (Math.random() - 0.5) * 2.5, // 속도 증가
          vy: (Math.random() - 0.5) * 2.5,
          color: '#EF4444',
          size: 4
        });
      }
      
      // 전자 (파란색)
      for (let i = 0; i < ionParticles; i++) {
        newParticles.push({
          id: remainingNeutrals + ionParticles + i,
          type: 'electron',
          x: Math.random() * 300 + 25,
          y: Math.random() * 200 + 25,
          vx: (Math.random() - 0.5) * 2.5, // 속도 증가
          vy: (Math.random() - 0.5) * 2.5,
          color: '#3B82F6',
          size: 2
        });
      }
      
      setParticles(newParticles);
    }, [basicGasPressure, basicPlasmaEnergy, plasmaState.description]);

    // 애니메이션 루프 - 모든 입자가 동일한 브라운 운동
    useEffect(() => {
      const animate = () => {
        setParticles(prevParticles => 
          prevParticles.map(particle => {
            let newX = particle.x + particle.vx;
            let newY = particle.y + particle.vy;
            let newVx = particle.vx;
            let newVy = particle.vy;

            // 경계 충돌 처리 (모든 입자 동일)
            if (newX <= 25 || newX >= 325) {
              newVx = -newVx * 0.9;
              newX = Math.max(25, Math.min(325, newX));
            }
            if (newY <= 25 || newY >= 225) {
              newVy = -newVy * 0.9;
              newY = Math.max(25, Math.min(225, newY));
            }

            // 모든 입자에 동일한 브라운 운동 적용
            newVx += (Math.random() - 0.5) * 0.15; // 브라운 운동 증가: 0.05 → 0.15
            newVy += (Math.random() - 0.5) * 0.15;
            
            // 모든 입자의 속도를 동일하게 제한
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > 3.5) { // 최대 속도 증가: 1.5 → 3.5
              newVx = (newVx / speed) * 3.5;
              newVy = (newVy / speed) * 3.5;
            }

            return {
              ...particle,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy
            };
          })
        );

        const id = requestAnimationFrame(animate);
        setAnimationId(id);
      };

      const id = requestAnimationFrame(animate);
      setAnimationId(id);

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [particles.length]);

    // 컴포넌트 언마운트 시 애니메이션 정리
    useEffect(() => {
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [animationId]);

    // 플라즈마 상태에 따른 시각적 효과 (입자 수에 따른 색상 농도)
    const getBackgroundClass = () => {
      if (plasmaState.description === 'Strong Plasma') {
        return 'bg-gradient-to-br from-purple-900 via-blue-900 to-red-900'; // 이온+전자 많아서 진한 색
      } else if (plasmaState.description === 'Weak Plasma') {
        return 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700'; // 이온+전자 적어서 연한 색
      } else {
        return 'bg-black'; // OFF 상태 - 중성입자만
      }
    };

    return (
      <div className={`border-2 border-gray-300 rounded-lg ${getBackgroundClass()} relative`} style={{width: '350px', height: '250px'}}>
        <svg width="350" height="250">
          {particles.map(particle => (
            <circle 
              key={particle.id} 
              cx={particle.x} 
              cy={particle.y} 
              r={particle.size} 
              fill={particle.color}
              opacity={plasmaState.description === 'Strong Plasma' ? 0.8 : 0.9} // Strong일 때 약간 투명하게 중첩 효과
            />
          ))}
          
          {/* Strong Plasma일 때만 전체적인 글로우 효과 */}
          {plasmaState.description === 'Strong Plasma' && (
            <>
              <defs>
                <radialGradient id="plasmaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style={{stopColor: '#8B5CF6', stopOpacity: 0.1}} />
                  <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 0}} />
                </radialGradient>
              </defs>
              <circle cx="175" cy="125" r="100" fill="url(#plasmaGlow)" />
            </>
          )}
        </svg>
        
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
          <div className="flex items-center mb-1"><div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div><span>중성</span></div>
          <div className="flex items-center mb-1"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div><span>이온</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div><span>전자</span></div>
        </div>
        
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
          <div>총 입자: {particles.length}</div>
          <div>이온화도: {calculateBasicIonizationDegree()}%</div>
          <div className="text-green-400 text-xs mt-1">● 가스 브라운 운동</div>
          {plasmaState.description === 'Strong Plasma' && <div className="text-yellow-400 font-bold">고밀도 플라즈마!</div>}
        </div>
      </div>
    );
  }

  function PaschenSchematic() {
    const baseDistance = 60;
    const maxDistance = 120;
    const actualDistance = baseDistance + (distance - 0.1) * (maxDistance - baseDistance) / 4.9;
    const particleCount = Math.floor(pressure * 8);
    const currentPD = pressure * distance;
    const townsendInfo = getTownsendInfo(currentPD);
    const minPoint = findMinimumBreakdownPoint();
    
    return (
      <div className="space-y-6">
        {/* 상단: 가스 종류와 pd 표시 */}
        <div className="text-center">
          <div className="text-xl font-bold mb-2">
            <span className="text-red-600">{gasType === 'argon' ? 'Ar' : gasType === 'air' ? 'Air' : gasType === 'helium' ? 'He' : gasType === 'nitrogen' ? 'N₂' : gasType === 'neon' ? 'Ne' : 'Ar'}</span>
            <span className="text-gray-800 ml-2">pd = {currentPD.toFixed(2)} Torr·cm</span>
            <span className="text-gray-600 ml-4 text-base">P = {pressure} Torr, d = {distance} cm</span>
          </div>
        </div>

        {/* 방전 조건 제어 박스 - 맨 앞으로 */}
        <div className="bg-violet-50 border-2 border-violet-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-violet-800 text-center mb-6">방전 조건 제어</h3>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* 압력 제어 */}
            <div>
              <label className="block text-base font-bold text-violet-800 mb-3">압력: {pressure} Torr</label>
              <input 
                type="range" 
                min="0.1" 
                max="10" 
                step="0.1" 
                value={pressure} 
                onChange={(e) => setPressure(parseFloat(e.target.value))} 
                className="w-full h-4 bg-gradient-to-r from-green-200 to-violet-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-violet-400 slider-thumb-violet"
              />
              <div className="flex justify-between text-sm text-violet-700 mt-2">
                <span>0.1</span><span>2.5</span><span>5.0</span><span>7.5</span><span>10</span>
              </div>
              <div className="mt-3 text-sm text-violet-700">
                <div>압력이 낮으면: 입자가 적어 충돌 확률 감소</div>
                <div>압력이 높으면: 자유경로가 짧아져 가속 어려움</div>
              </div>
            </div>

            {/* 거리 제어 */}
            <div>
              <label className="block text-base font-bold text-violet-800 mb-3">전극간 거리: {distance} cm</label>
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1" 
                value={distance} 
                onChange={(e) => setDistance(parseFloat(e.target.value))} 
                className="w-full h-4 bg-gradient-to-r from-pink-200 to-purple-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-purple-400 slider-thumb-purple"
              />
              <div className="flex justify-between text-sm text-purple-700 mt-2">
                <span>0.1</span><span>1.3</span><span>2.5</span><span>3.8</span><span>5.0</span>
              </div>
              <div className="mt-3 text-sm text-purple-700">
                <div>거리가 짧으면: 전기장 강하지만 가속 거리 부족</div>
                <div>거리가 길면: 가속 거리 충분하지만 전기장 약함</div>
              </div>
            </div>
          </div>

          {/* pd 값과 항복전압 표시 */}
          <div className="bg-white rounded-lg p-4 border-2 border-violet-400 text-center shadow-inner">
            <span className="text-xl font-bold text-violet-800">pd = {currentPD.toFixed(2)} Torr·cm</span>
            {calculateBreakdownVoltage(pressure, distance) !== null && 
              <span className="text-lg text-gray-700 ml-6">항복전압: {Math.round(calculateBreakdownVoltage(pressure, distance))} V</span>
            }
          </div>
        </div>

        {/* 메인 분석 영역 */}
        <div className="grid grid-cols-12 gap-6">
          {/* 방전 조건 */}
          <div className="col-span-3">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-400 h-full">
              <h3 className="text-blue-800 font-bold text-lg mb-4 text-center">방전 조건</h3>
              <div className="space-y-3">
                <div className="text-blue-700">pd 값: <span className="font-bold">{currentPD.toFixed(2)} Torr·cm</span></div>
                <div className="text-blue-700">입자 밀도: <span className="font-bold">{particleCount}개</span></div>
                <div>이온화 효율: <span className={`font-bold ${townsendInfo.isOptimal ? "text-green-600" : "text-red-600"}`}>{townsendInfo.efficiency}</span></div>
                <div className="text-blue-700">α ≈ <span className="font-bold">{townsendInfo.alpha} cm⁻¹</span></div>
              </div>
            </div>
          </div>
          
          {/* 중앙 그림 */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg p-4 border-2 border-gray-300 h-full">
              {/* 관찰 포인트 */}
              <div className="mb-4 text-center">
                <div className="text-sm font-bold text-green-700 mb-2">관찰 포인트:</div>
                <div className="text-xs text-green-600 space-y-1">
                  <div>• pd ≈ 1.0 Torr·cm에서 최적 방전</div>
                  <div>• 전자 사태 현상 확인</div>
                  <div>• Townsend 계수(α) 변화</div>
                </div>
              </div>
              
              <svg width="100%" height="200" viewBox={`0 0 ${Math.max(300, actualDistance + 150)} 200`}>
                {/* 양극 */}
                <rect x="50" y="40" width="25" height="120" fill="#dc2626" rx="4"/>
                <text x="30" y="105" fill="#dc2626" fontSize="24" fontWeight="bold">+</text>
                <text x="25" y="180" fill="#dc2626" fontSize="16" fontWeight="bold">양극</text>
                
                {/* 음극 */}
                <rect x={75 + actualDistance} y="40" width="25" height="120" fill="#2563eb" rx="4"/>
                <text x={110 + actualDistance} y="105" fill="#2563eb" fontSize="24" fontWeight="bold">−</text>
                <text x={95 + actualDistance} y="180" fill="#2563eb" fontSize="16" fontWeight="bold">음극</text>
                
                {/* 전기장 화살표 */}
                {Array.from({length: 6}, (_, i) => {
                  const y = 60 + i * 16;
                  const startX = 80;
                  const endX = 70 + actualDistance;
                  return (
                    <g key={i}>
                      <line x1={startX} y1={y} x2={endX} y2={y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="8,4" />
                      <polygon points={`${endX},${y-4} ${endX},${y+4} ${endX+8},${y}`} fill="#f59e0b" />
                    </g>
                  );
                })}
                
                {/* 전기장 표시 */}
                <text x={75 + actualDistance/2} y="30" textAnchor="middle" fontSize="14" fill="#f59e0b" fontWeight="bold">전기장 E</text>
              </svg>
            </div>
          </div>
          
          {/* 항복 전압 */}
          <div className="col-span-3">
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-400 h-full">
              <h3 className="text-red-800 font-bold text-lg mb-4 text-center">항복 전압</h3>
              {calculateBreakdownVoltage(pressure, distance) !== null ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{Math.round(calculateBreakdownVoltage(pressure, distance))} V</div>
                  </div>
                  <div className="text-red-700">최소값: <span className="font-bold text-green-600">{Math.round(minPoint.voltage)} V</span></div>
                  <div className="text-red-700">최적 pd: <span className="font-bold text-green-600">{minPoint.pd} Torr·cm</span></div>
                  <div className="text-red-700 font-bold">{gasType.toUpperCase()} 가스</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600 mb-2">범위 초과!</div>
                  <div className="text-red-600 text-sm">pd: 0.1~100 범위로 조정</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단: pd 영역별 설명 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-bold text-blue-800 mb-2">낮은 pd 영역</h4>
            <div className="text-sm text-blue-700">
              <div>압력 적어 충돌 확률 → 높은 전압 필요</div>
              <div className="font-mono text-xs mt-1">0.1 ~ 0.8</div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 className="font-bold text-green-800 mb-2">최적 pd 영역</h4>
            <div className="text-sm text-green-700">
              <div>이온화 효율 최대 → 최소 전압으로 방전</div>
              <div className="font-mono text-xs mt-1">0.8 ~ 3.0</div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-bold text-red-800 mb-2">높은 pd 영역</h4>
            <div className="text-sm text-red-700">
              <div>입자 많아 자유경로 짧음 → 높은 전압 필요</div>
              <div className="font-mono text-xs mt-1">3.0 ~ 100</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        /* 슬라이더 커스텀 스타일 */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        /* 슬라이더 썸(손잡이) 기본 스타일 - 항상 보이도록 */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          border: 3px solid white;
          position: relative;
          z-index: 10;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          border: 3px solid white;
          background: inherit;
          position: relative;
          z-index: 10;
        }
        
        /* 호버 효과 */
        input[type="range"]:hover::-webkit-slider-thumb {
          transform: scale(1.15);
          box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }
        
        input[type="range"]:hover::-moz-range-thumb {
          transform: scale(1.15);
          box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }
        
        /* 색상별 썸 스타일 - 기본 상태에서도 보임 */
        .slider-thumb-indigo::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #6366f1, #4f46e5);
        }
        .slider-thumb-orange::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #f97316, #ea580c);
        }
        .slider-thumb-blue::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #3b82f6, #2563eb);
        }
        .slider-thumb-purple::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #a855f7, #9333ea);
        }
        .slider-thumb-violet::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #8b5cf6, #7c3aed);
        }
        .slider-thumb-green::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #10b981, #059669);
        }
        .slider-thumb-teal::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #14b8a6, #0d9488);
        }
        .slider-thumb-red::-webkit-slider-thumb { 
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }
        
        .slider-thumb-indigo::-moz-range-thumb { 
          background: linear-gradient(45deg, #6366f1, #4f46e5);
        }
        .slider-thumb-orange::-moz-range-thumb { 
          background: linear-gradient(45deg, #f97316, #ea580c);
        }
        .slider-thumb-blue::-moz-range-thumb { 
          background: linear-gradient(45deg, #3b82f6, #2563eb);
        }
        .slider-thumb-purple::-moz-range-thumb { 
          background: linear-gradient(45deg, #a855f7, #9333ea);
        }
        .slider-thumb-violet::-moz-range-thumb { 
          background: linear-gradient(45deg, #8b5cf6, #7c3aed);
        }
        .slider-thumb-green::-moz-range-thumb { 
          background: linear-gradient(45deg, #10b981, #059669);
        }
        .slider-thumb-teal::-moz-range-thumb { 
          background: linear-gradient(45deg, #14b8a6, #0d9488);
        }
        .slider-thumb-red::-moz-range-thumb { 
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }
        
        /* 활성 상태 */
        input[type="range"]:active::-webkit-slider-thumb {
          transform: scale(1.25);
          box-shadow: 0 8px 16px rgba(0,0,0,0.5);
        }
        
        input[type="range"]:active::-moz-range-thumb {
          transform: scale(1.25);
          box-shadow: 0 8px 16px rgba(0,0,0,0.5);
        }
        
        /* 포커스 상태 */
        input[type="range"]:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
          border-radius: 12px;
        }
        
        /* 슬라이더 트랙 강화 */
        input[type="range"]::-webkit-slider-track {
          border-radius: 8px;
          height: 16px;
        }
        
        input[type="range"]::-moz-range-track {
          border-radius: 8px;
          height: 16px;
        }
      `}</style>
      
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">플라즈마 공정 교육 시뮬레이터</h1>
            <div className="text-sm text-gray-500">Interactive Learning System</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {themes.map((theme, index) => (
              <button key={theme.id} onClick={() => setActiveTheme(theme.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTheme === theme.id ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                <span className="text-lg">{theme.icon}</span>
                <span>{index + 1}. {theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {activeTheme === 'plasma-basics' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">⚡ 플라즈마 기본 특성 이해</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><h3 className="font-semibold text-blue-800 mb-2">학습 목표</h3><ul className="space-y-1 text-blue-700"><li>• 물질의 4번째 상태로서의 플라즈마 이해</li><li>• 이온화와 재결합 과정의 동적 평형</li><li>• 플라즈마의 전도성과 외부 제어 가능성</li></ul></div>
                <div><h3 className="font-semibold text-blue-800 mb-2">핵심 개념</h3><ul className="space-y-1 text-blue-700"><li>• 에너지 공급에 따른 물질 상태 변화</li><li>• 발광 현상과 가스별 색상 차이</li><li>• 반도체 공정 및 다양한 산업 응용</li></ul></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">물질의 4가지 상태</h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border"><div className="text-3xl mb-2">🧊</div><div className="font-bold text-blue-800">고체</div><div className="text-xs text-blue-600 mt-1">분자간 결합 강함</div></div>
                <div className="text-center p-4 bg-green-50 rounded-lg border"><div className="text-3xl mb-2">💧</div><div className="font-bold text-green-800">액체</div><div className="text-xs text-green-600 mt-1">분자 운동 증가</div></div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border"><div className="text-3xl mb-2">💨</div><div className="font-bold text-orange-800">기체</div><div className="text-xs text-orange-600 mt-1">분자 자유 운동</div></div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border"><div className="text-3xl mb-2">⚡</div><div className="font-bold text-purple-800">플라즈마</div><div className="text-xs text-purple-600 mt-1">이온화된 기체</div></div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center"><div className="text-sm text-gray-600">에너지 증가</div><div className="flex items-center space-x-2 mt-2"><span>🔥</span><span className="text-red-500">→</span><span>🔥🔥</span><span className="text-red-500">→</span><span>🔥🔥🔥</span><span className="text-red-500">→</span><span>⚡⚡⚡</span></div></div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg"><h4 className="font-semibold text-purple-800 mb-2">플라즈마란?</h4><p className="text-purple-700">기체에 충분한 에너지를 가하면 원자에서 전자가 떨어져 나와 <strong>이온(+)</strong>과 <strong>전자(-)</strong>로 분리됩니다. 이렇게 이온화된 기체를 <strong>플라즈마</strong>라고 하며, 물질의 4번째 상태입니다.</p></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">이온화와 재결합의 동적 평형</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400"><h4 className="font-semibold text-red-800 mb-2">🔥 이온화 (Ionization)</h4><div className="text-red-700 text-sm"><div className="font-mono bg-white p-2 rounded mb-2">원자 + 에너지 → 이온⁺ + 전자⁻</div><p>전기 에너지가 원자에 전달되어 전자를 떼어냅니다.</p></div></div>
                  <div className="text-center"><div className="text-2xl">⇅</div><div className="text-sm text-gray-600">동적 평형</div></div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"><h4 className="font-semibold text-blue-800 mb-2">🔄 재결합 (Recombination)</h4><div className="text-blue-700 text-sm"><div className="font-mono bg-white p-2 rounded mb-2">이온⁺ + 전자⁻ → 원자 + 빛</div><p>이온과 전자가 다시 결합하면서 에너지를 빛으로 방출합니다.</p></div></div>
                </div>
                <div className="mt-4 bg-yellow-50 p-3 rounded-lg"><div className="text-yellow-800 text-sm"><strong>💡 핵심:</strong> 플라즈마 상태를 유지하려면 지속적인 에너지 공급이 필요합니다. 에너지 공급이 중단되면 재결합이 우세해져 플라즈마가 꺼집니다.</div></div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">반도체 공정용 플라즈마 가스별 발광 색상</h3>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-800 text-sm">
                    <strong>색상 결정 원리:</strong> 가스 분자가 이온화되며 특정 파장의 빛을 방출하기 때문에, 가스마다 고유한 색을 띠게 됩니다. 
                    색상은 가스 종류, 압력, 전력 등 조건에 따라 달라집니다.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-red-600 rounded-full"></div>
                      <div>
                        <div className="font-medium text-purple-800">아르곤 (Ar)</div>
                        <div className="text-xs text-purple-600">보라색 또는 짙은 붉은색</div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-700 font-medium">범용 플라즈마 가스</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-white to-cyan-200 rounded-full border border-cyan-300"></div>
                      <div>
                        <div className="font-medium text-blue-800">산소 (O₂)</div>
                        <div className="text-xs text-blue-600">옅은 흰색 또는 푸른빛 흰색</div>
                      </div>
                    </div>
                    <div className="text-xs text-blue-700 font-medium">애싱, 산화막 공정</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-100 to-pink-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
                      <div>
                        <div className="font-medium text-pink-800">수소 (H₂)</div>
                        <div className="text-xs text-pink-600">분홍색 또는 붉은빛 분홍색</div>
                      </div>
                    </div>
                    <div className="text-xs text-pink-700 font-medium">환원 공정</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-100 to-yellow-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-yellow-400 rounded-full"></div>
                      <div>
                        <div className="font-medium text-indigo-800">질소 (N₂)</div>
                        <div className="text-xs text-indigo-600">보라색~붉은색~노란색</div>
                      </div>
                    </div>
                    <div className="text-xs text-indigo-700 font-medium">질화막 공정</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-100 to-blue-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-cyan-800">사불화탄소 (CF₄)</div>
                        <div className="text-xs text-cyan-600">푸른색</div>
                      </div>
                    </div>
                    <div className="text-xs text-cyan-700 font-medium">식각 가스</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-100 to-orange-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"></div>
                      <div>
                        <div className="font-medium text-red-800">네온 (Ne)</div>
                        <div className="text-xs text-red-600">벽돌색 붉은색</div>
                      </div>
                    </div>
                    <div className="text-xs text-red-700 font-medium">희가스 공정</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-100 to-purple-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-purple-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-red-800">헬륨 (He)</div>
                        <div className="text-xs text-red-600">붉은색~보라색</div>
                      </div>
                    </div>
                    <div className="text-xs text-red-700 font-medium">청정 공정</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-100 to-cyan-50 p-3 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full"></div>
                      <div>
                        <div className="font-medium text-teal-800">육불화황 (SF₆)</div>
                        <div className="text-xs text-teal-600">옅은 푸른색</div>
                      </div>
                    </div>
                    <div className="text-xs text-teal-700 font-medium">절연체 식각</div>
                  </div>
                </div>
                
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-semibold text-yellow-800 mb-2">🔍 공정 모니터링</h4>
                    <p className="text-yellow-700 text-sm">
                      플라즈마 색상 변화를 통해 공정 상태를 실시간 모니터링할 수 있습니다. 
                      색상이 예상과 다르면 가스 유입, 압력 변화, 오염 등을 의심해볼 수 있습니다.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ 오염 감지 사례</h4>
                    <p className="text-red-700 text-sm">
                      <strong>예시:</strong> 산소 플라즈마 공정 중 분홍빛이나 보라빛이 감지되면 
                      공기(질소)가 챔버로 유입되었음을 짐작할 수 있습니다.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 bg-purple-50 p-3 rounded-lg">
                  <div className="text-purple-800 text-sm">
                    <strong>🌈 실제 공정에서:</strong> 엔지니어들은 플라즈마 색상을 육안으로 관찰하여 
                    공정 안정성을 판단합니다. 각 가스의 고유 색상을 알고 있으면 챔버 내 상황을 
                    즉시 파악할 수 있어 공정 제어에 매우 유용합니다.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">전도성 기체로서의 플라즈마</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg"><h4 className="font-semibold text-blue-800 mb-2">⚡ 전기 전도성</h4><ul className="text-blue-700 text-sm space-y-1"><li>• 이온(+)과 전자(-)가 자유롭게 움직임</li><li>• 전기가 통하는 기체 상태</li><li>• 금속처럼 전도성을 가짐</li></ul></div>
                <div className="bg-green-50 p-4 rounded-lg"><h4 className="font-semibold text-green-800 mb-2">🎯 외부 제어 가능</h4><ul className="text-green-700 text-sm space-y-1"><li>• 외부 전극으로 입자 운동 유도</li><li>• 자기장으로 플라즈마 모양 제어</li><li>• 정밀한 에너지 및 방향 제어</li></ul></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">플라즈마의 다양한 응용 분야</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border"><h4 className="font-semibold text-blue-800 mb-2">🔬 반도체 공정</h4><ul className="text-blue-700 text-sm space-y-1"><li>• 웨이퍼 식각 (Etching)</li><li>• 박막 증착 (Deposition)</li><li>• 표면 청정화</li><li>• 이온 주입</li></ul></div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border"><h4 className="font-semibold text-purple-800 mb-2">📺 디스플레이 기술</h4><ul className="text-purple-700 text-sm space-y-1"><li>• PDP (Plasma Display Panel)</li><li>• 형광등 및 네온사인</li><li>• LED 제조 공정</li><li>• OLED 제조</li></ul></div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border"><h4 className="font-semibold text-green-800 mb-2">🔬 분석 및 연구</h4><ul className="text-green-700 text-sm space-y-1"><li>• 질량 분석법 (MS)</li><li>• 원소 분석 (ICP)</li><li>• 핵융합 연구</li><li>• 우주 추진 시스템</li></ul></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">🔍 더 알아보기: PDP 기술과 물질 분석</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border"><h4 className="font-semibold text-indigo-800 mb-3">📺 PDP (Plasma Display Panel)</h4><div className="space-y-2 text-indigo-700 text-sm"><p><strong>원리:</strong> 각 픽셀마다 소형 플라즈마를 만들어 형광체를 발광시킵니다.</p><p><strong>장점:</strong> 대화면, 넓은 시야각, 빠른 응답속도</p><p><strong>특징:</strong> RGB 형광체와 플라즈마의 UV 방출을 이용</p><p><strong>현재:</strong> LCD/OLED에 밀려 생산 중단되었지만, 플라즈마 응용의 대표 사례</p></div></div>
                <div className="bg-white p-4 rounded-lg border"><h4 className="font-semibold text-indigo-800 mb-3">🔬 플라즈마 물질 분석</h4><div className="space-y-2 text-indigo-700 text-sm"><p><strong>ICP-MS:</strong> 유도결합 플라즈마 질량분석법으로 극미량 원소 검출</p><p><strong>원리:</strong> 플라즈마로 시료를 완전 이온화하여 원소별 질량 측정</p><p><strong>응용:</strong> 환경오염 측정, 식품 안전, 의학 진단</p><p><strong>장점:</strong> ppt(조분의 1) 수준까지 검출 가능한 초고감도</p></div></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4">💭 생각해보기</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">🤔 질문 1: 에너지와 상태변화</h4><p className="text-purple-600">얼음을 녹이는데 필요한 에너지와 플라즈마를 만드는데 필요한 에너지, 어느 쪽이 더 클까요? 그리고 왜 플라즈마는 에너지 공급을 중단하면 바로 꺼질까요?</p></div>
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">🌈 질문 2: 색상과 에너지</h4><p className="text-purple-600">네온사인이 가스 종류에 따라 다른 색을 내는 이유는 무엇일까요? 같은 전압을 가해도 왜 가스마다 다른 색이 나올까요?</p></div>
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">⚡ 질문 3: 전도성과 제어</h4><p className="text-purple-600">플라즈마가 전기를 통한다면, 번개도 플라즈마일까요? 반도체 공정에서 플라즈마를 어떻게 정밀하게 제어할 수 있을까요?</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTheme === 'plasma-principle1' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">🔬 플라즈마 발생원리 1</h2>
              <p className="text-indigo-700 mb-2">압력과 에너지의 상호작용을 통한 플라즈마 생성 원리를 학습합니다.</p>
              <div className="text-sm text-indigo-600 bg-indigo-100 rounded-lg p-3"><strong>주안점:</strong> ✓ 최적 압력 구간(3mTorr) 확인 ✓ 에너지-압력 상호보완 관계 ✓ 이온화도 실시간 변화 ✓ 플라즈마 상태 전환 과정</div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">플라즈마 입자 상태</h3>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-indigo-700 leading-relaxed">
                    반도체 공정용 플라즈마의 이온화율은 <span className="font-bold text-indigo-900">&lt;0.001%</span> 정도로 매우 낮습니다.
                    <br/>
                    <span className="text-xs text-indigo-600 mt-1 inline-block">참고: 태양 핵의 이온화율은 100%</span>
                  </p>
                </div>
                <div className="flex justify-center mb-4 space-x-4">
                  <PlasmaVisualization />
                  <div className="bg-black rounded-lg border-2 border-gray-600 p-4" style={{width: '200px', height: '250px'}}>
                    <div className="text-center h-full flex flex-col justify-center">
                      <div className="text-xs text-gray-400 mb-2 font-mono">PLASMA STATUS</div>
                      <div className="text-2xl font-mono font-bold mb-3" style={{ color: getBasicPlasmaState().color }}>{getBasicPlasmaState().status}</div>
                      <div className="text-sm text-gray-300 mb-4 font-mono">{getBasicPlasmaState().description}</div>
                      <div className="border-t border-gray-600 pt-3 mt-3">
                        <div className="text-xs text-gray-400 mb-1 font-mono">IONIZATION RATE</div>
                        <div className="text-xl font-mono font-bold" style={{ color: getBasicPlasmaState().status === 'OFF' ? '#dc2626' : '#10b981' }}>{getBasicPlasmaState().ionizationRate.toFixed(4)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">플라즈마 생성 조건</h3>
                <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-indigo-800 mb-3">가스 압력: {basicGasPressure} mTorr</label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="0.5" 
                          max="8" 
                          step="0.1" 
                          value={basicGasPressure} 
                          onChange={(e) => setBasicGasPressure(parseFloat(e.target.value))} 
                          className="w-full h-4 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-indigo-400 slider-thumb-indigo"
                        />
                        <div className="flex justify-between text-xs text-indigo-700 mt-1 font-medium">
                          <span>0.5</span><span>2.0</span><span>4.0</span><span>6.0</span><span>8.0</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-indigo-800 mb-3">전기 에너지: {basicPlasmaEnergy} W</label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="50" 
                          max="300" 
                          step="10" 
                          value={basicPlasmaEnergy} 
                          onChange={(e) => setBasicPlasmaEnergy(parseInt(e.target.value))} 
                          className="w-full h-4 bg-gradient-to-r from-orange-200 to-red-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-orange-400 slider-thumb-orange"
                        />
                        <div className="flex justify-between text-xs text-orange-700 mt-1 font-medium">
                          <span>50W</span><span>100W</span><span>150W</span><span>200W</span><span>250W</span><span>300W</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex"><div className="flex-shrink-0"><span className="text-yellow-600 font-bold text-sm">⚠️ 주의사항</span></div><div className="ml-3"><div className="text-sm text-yellow-800 space-y-2"><p><strong>교육용 시뮬레이션:</strong> 이 도구는 플라즈마 발생 원리의 <strong>개념 이해</strong>를 위한 단순화된 모델입니다.</p><p><strong>실제와 차이:</strong> 실제 플라즈마 공정은 온도, 유량, 챔버 형태, 전극 재질 등 수십 가지 변수가 복합적으로 작용합니다.</p><p><strong>결과의 한계:</strong> 여기서 보이는 수치와 현상은 <strong>상대적 경향성</strong>을 나타내는 예시로, 실제 공정 조건과는 다를 수 있습니다.</p><p><strong>학습 목표:</strong> 압력과 에너지의 <strong>상호작용 원리</strong>와 최적 조건의 <strong>개념</strong>을 이해하는 것이 목적입니다.</p></div></div></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">압력에 따른 플라즈마 밀도 변화 (에너지: {basicPlasmaEnergy}W)</h3>
              <div className="relative" style={{height: '400px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateBasicPressureData()} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pressure" label={{ value: '압력 (mTorr)', position: 'insideBottom', offset: -5 }} />
                    <YAxis domain={[0, 20]} label={{ value: '밀도 (×10¹⁰ cm⁻³)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <ReferenceLine x={basicGasPressure.toFixed(1)} stroke="#dc2626" strokeWidth={3} strokeDasharray="5 5" label={{ value: `현재: ${basicGasPressure} mTorr`, position: "topRight", fill: "#dc2626", fontSize: 12, fontWeight: "bold" }} />
                    <Line type="monotone" dataKey="density" stroke={getBasicPlasmaState().status === 'OFF' ? '#9CA3AF' : '#2563eb'} strokeWidth={3} name="플라즈마 밀도" dot={{ fill: getBasicPlasmaState().status === 'OFF' ? '#9CA3AF' : '#2563eb', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                {getBasicPlasmaState().status === 'OFF' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="bg-white bg-opacity-90 px-6 py-3 rounded-lg border-2 border-gray-400 shadow-lg"><div className="text-2xl font-bold text-gray-600">No Plasma</div></div></div>}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">🔬 플라즈마란 무엇인가?</h3>
              <div className="space-y-4 text-green-700">
                <p><strong>간단히 말하면:</strong> 플라즈마는 기체에 강한 전기를 가해서 원자들을 이온(+)과 전자(-)로 쪼갠 상태입니다. 마치 얼음→물→수증기처럼, 고체→액체→기체→플라즈마 순서로 물질의 상태가 변합니다.</p>
                <p><strong>압력이 중요한 이유:</strong> 너무 낮으면 원자가 적어서 전자가 충돌할 대상이 부족하고, 너무 높으면 원자가 너무 많아서 전자가 제대로 움직일 수 없습니다. 3mTorr 정도가 딱 좋은 균형점입니다.</p>
                <p><strong>에너지는 왜 필요할까?:</strong> 원자에서 전자를 떼어내려면 힘이 필요합니다. 아르곤의 경우 15.8eV라는 에너지가 필요한데, 전기 에너지가 높을수록 더 많은 원자를 이온화시킬 수 있습니다.</p>
                <p><strong>실제 활용:</strong> 반도체 공정에서는 이런 플라즈마로 웨이퍼를 깎거나(에칭) 코팅(증착)합니다. 조건을 정확히 맞춰야 원하는 결과를 얻을 수 있어서 이런 시뮬레이션이 중요합니다.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4">💭 직접 해보기</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">🎯 실습 1: 최적 조건 찾기</h4><p className="text-purple-600">압력과 에너지 슬라이더를 움직여서 가장 높은 이온화도를 얻는 조건을 찾아보세요. 3mTorr 근처에서 최적의 플라즈마가 생성되는 이유를 생각해보세요.</p></div>
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">🔧 실습 2: 조건 변화 관찰</h4><p className="text-purple-600">압력을 극단적으로 높이거나 낮춰보세요. 플라즈마 상태가 어떻게 변하나요? 에너지만으로는 낮은 압력에서의 문제를 해결할 수 없는 이유를 관찰해보세요.</p></div>
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">💡 실습 3: 실제 응용</h4><p className="text-purple-600">반도체 공정에서는 균일한 플라즈마가 중요합니다. 어떤 조건에서 가장 안정적이고 강한 플라즈마를 얻을 수 있는지 찾아보세요.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTheme === 'plasma-principle2' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-violet-900 mb-4">📈 플라즈마 발생원리 2 - 파션커브</h2>
              <p className="text-violet-700 mb-2">가스 방전에서 압력×거리(pd)에 따른 항복전압의 관계를 학습합니다.</p>
              <div className="text-sm text-violet-600 bg-violet-100 rounded-lg p-3"><strong>핵심 개념:</strong> ✓ pd값은 방전 특성을 결정하는 핵심 변수 ✓ U자형 커브의 최저점 = 최적 방전 조건 ✓ Townsend 계수와의 관계</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-violet-800 mb-4">전극간 가스 방전 시스템</h3>
              <PaschenSchematic />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-violet-800 mb-4">파션커브 ({gasType === 'argon' ? 'Argon' : gasType === 'air' ? 'Air' : gasType === 'helium' ? 'Helium' : gasType === 'nitrogen' ? 'Nitrogen' : gasType === 'neon' ? 'Neon' : 'Unknown'} 가스) - U자형 특성</h3>
              <div style={{height: '400px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generatePaschenData()} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pd" type="number" scale="log" domain={[0.1, 100]} label={{ value: 'pd (Torr·cm)', position: 'insideBottom', offset: -5 }} />
                    <YAxis domain={[100, 5000]} type="number" label={{ value: '항복전압 (V)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    {calculateBreakdownVoltage(pressure, distance) !== null && <ReferenceLine x={(pressure * distance)} stroke="#dc2626" strokeWidth={3} strokeDasharray="5 5" label={{ value: `현재: ${(pressure * distance).toFixed(1)} Torr·cm`, position: "topRight", fill: "#dc2626", fontSize: 12, fontWeight: "bold" }} />}
                    <ReferenceLine x={findMinimumBreakdownPoint().pd} stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" label={{ value: `최적: ${findMinimumBreakdownPoint().pd} Torr·cm`, position: "topLeft", fill: "#059669", fontSize: 11, fontWeight: "bold" }} />
                    <Line type="monotone" dataKey="voltage" stroke={gasType === 'argon' ? '#dc2626' : gasType === 'air' ? '#2563eb' : gasType === 'helium' ? '#9333ea' : gasType === 'nitrogen' ? '#16a34a' : gasType === 'neon' ? '#ea580c' : '#dc2626'} strokeWidth={3} name="항복전압" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-violet-800 mb-4">파션커브 조건 설정</h3>
                <div className="bg-violet-50 border-2 border-violet-300 rounded-lg p-4">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-violet-800 mb-3">방전 가스 종류</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['argon', 'air', 'helium', 'nitrogen', 'neon'].map(gas => (
                          <label key={gas} className="flex items-center p-3 border-2 rounded-lg hover:bg-violet-100 cursor-pointer transition-colors duration-200 border-violet-300 bg-white shadow-sm">
                            <input 
                              type="radio" 
                              name="gasType" 
                              value={gas} 
                              checked={gasType === gas} 
                              onChange={(e) => setGasType(e.target.value)} 
                              className="mr-3 w-4 h-4 text-violet-600 border-2 border-violet-400"
                            />
                            <span className="text-violet-700 font-semibold">
                              {gas === 'argon' ? 'Argon (Ar)' : gas === 'air' ? 'Air' : gas === 'helium' ? 'Helium (He)' : gas === 'nitrogen' ? 'Nitrogen (N₂)' : 'Neon (Ne)'}
                            </span>
                            <span className="text-xs text-violet-500 ml-2">
                              {gas === 'argon' ? '- 15.8eV' : gas === 'air' ? '- 혼합' : gas === 'helium' ? '- 24.5eV' : gas === 'nitrogen' ? '- 14.5eV' : '- 15.7eV'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-violet-800 mb-3">압력: {pressure} Torr</label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="0.1" 
                          max="10" 
                          step="0.1" 
                          value={pressure} 
                          onChange={(e) => setPressure(parseFloat(e.target.value))} 
                          className="w-full h-4 bg-gradient-to-r from-green-200 to-violet-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-violet-400 slider-thumb-violet"
                        />
                        <div className="flex justify-between text-xs text-violet-700 mt-1 font-medium">
                          <span>0.1</span><span>2.5</span><span>5.0</span><span>7.5</span><span>10</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-violet-800 mb-3">전극간 거리: {distance} cm</label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="0.1" 
                          max="5" 
                          step="0.1" 
                          value={distance} 
                          onChange={(e) => setDistance(parseFloat(e.target.value))} 
                          className="w-full h-4 bg-gradient-to-r from-pink-200 to-purple-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-purple-400 slider-thumb-purple"
                        />
                        <div className="flex justify-between text-xs text-purple-700 mt-1 font-medium">
                          <span>0.1</span><span>1.3</span><span>2.5</span><span>3.8</span><span>5.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                      <div className="text-sm font-bold text-gray-800 mb-2">현재 조건</div>
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="font-semibold">pd 값: <span className="text-violet-800">{(pressure * distance).toFixed(2)} Torr·cm</span></div>
                        {calculateBreakdownVoltage(pressure, distance) !== null ? 
                          <div className="font-semibold">항복전압: <span className="text-green-700">{Math.round(calculateBreakdownVoltage(pressure, distance))} V</span></div> : 
                          <div className="text-red-600 font-bold">⚠️ 범위 초과 (0.1-100 Torr·cm)</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-violet-800 mb-4">파션 법칙</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="bg-violet-50 p-4 rounded-lg"><div className="font-mono text-center text-lg font-bold text-violet-800 mb-2">실제 파션커브 데이터</div><div className="text-xs text-violet-600 text-center">{gasType === 'argon' && 'Argon: pd=1에서 최소 200V (이온화: 15.8eV)'}{gasType === 'air' && 'Air: pd=1에서 최소 350V (혼합가스)'}{gasType === 'helium' && 'Helium: pd=1에서 최소 400V (이온화: 24.5eV)'}{gasType === 'nitrogen' && 'Nitrogen: pd=1에서 최소 250V (이온화: 14.5eV)'}{gasType === 'neon' && 'Neon: pd=1에서 최소 300V (이온화: 15.7eV)'}</div></div>
                  <div><strong>이온화 에너지와 항복전압:</strong> 각 가스의 이온화 에너지가 다르므로 같은 조건에서도 방전을 시작하는데 필요한 전압이 다릅니다. He(24.5eV)가 가장 높고, N₂(14.5eV)가 가장 낮습니다.</div>
                  <div><strong>가스 선택의 실제 고려사항:</strong> 공정 목적에 따라 가스를 선택합니다. Ar은 범용적이고 안정적이며, He는 청정 공정에, N₂는 질화공정에 주로 사용됩니다.</div>
                  <div><strong>U자 곡선 비교:</strong> 모든 가스가 비슷한 U자 형태를 보이지만, 최소값의 위치와 전압이 다릅니다. 이는 각 가스의 물리적 특성 차이 때문입니다.</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4">🔬 전자 사태(electron avalanche) 현상</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 text-purple-700">
                  <div><strong>전자 하나가 여러 개로:</strong> 전자 1개가 1cm 움직이면서 몇 개의 새로운 전자를 만들어내는지를 α(알파)라고 합니다.</div>
                  <div><strong>연쇄반응:</strong> 새로 만들어진 전자들도 또 다른 전자들을 만들어서, 마치 눈사태처럼 전자가 급격히 늘어납니다.</div>
                  <div><strong>방전이 계속되려면:</strong> 충분한 전자가 계속 만들어져야 플라즈마가 꺼지지 않고 유지됩니다.</div>
                </div>
                <div className="bg-white p-4 rounded-lg"><div className="text-sm font-medium text-gray-700 mb-2">현재 조건에서의 추정값</div><div className="space-y-1 text-sm"><div>pd: {(pressure * distance).toFixed(2)} Torr·cm</div><div>α: {getTownsendInfo(pressure * distance).alpha} cm⁻¹</div><div className={`font-bold ${getTownsendInfo(pressure * distance).isOptimal ? 'text-green-600' : 'text-red-600'}`}>효율: {getTownsendInfo(pressure * distance).efficiency}</div><div className="text-xs text-gray-500 mt-2">{getTownsendInfo(pressure * distance).isOptimal ? "👍 전자 증폭이 활발해서 안정적인 플라즈마를 만들 수 있습니다" : "⚠️ 조건을 조정해서 pd값을 1 근처로 맞춰보세요"}</div></div></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4">💭 직접 해보기</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">🎯 실습 1: 최적 조건 찾기</h4><p className="text-purple-600">압력과 거리 슬라이더를 움직여서 "최적!" 마크가 나타나는 조건을 찾아보세요. pd값이 1.0 Torr·cm 근처일 때 항복전압이 가장 낮아집니다. 실제 공장에서도 이렇게 최적 조건을 찾아서 사용합니다.</p></div>
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">🔧 실습 2: 조건 변화 관찰</h4><p className="text-purple-600">압력을 0.1에서 10까지, 거리를 0.1에서 5까지 극단적으로 바꿔보세요. 항복전압이 어떻게 변하나요? 너무 높거나 낮으면 플라즈마를 만들기 어려워지는 이유를 생각해보세요.</p></div>
                <div className="bg-white p-4 rounded-lg border border-purple-200"><h4 className="font-semibold text-purple-700 mb-2">💡 실습 3: 실제 응용</h4><p className="text-purple-600">만약 당신이 반도체 공장의 엔지니어라면, 전력 소비를 줄이기 위해 어떤 조건을 선택하겠나요? 항복전압이 낮을수록 전력이 적게 드니까, 파션커브의 최저점을 활용하는 것이 경제적입니다.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTheme === 'rf-matching' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-green-900 mb-4">📡 RF 및 매칭 네트워크</h2>
              <p className="text-green-700 mb-2">RF 파워서플라이와 플라즈마 부하 간의 매칭 메커니즘을 학습합니다.</p>
              <div className="text-sm text-green-600 bg-green-100 rounded-lg p-3"><strong>학습 목표:</strong> RF 파워서플라이와 플라즈마 부하 간의 매칭 메커니즘을 이해하고, 최적의 전력 전달을 위한 임피던스 조정 원리를 습득합니다.</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-green-800 mb-4">매칭 네트워크의 이해</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg"><h4 className="font-semibold text-green-800 mb-2">🔌 매칭 네트워크란?</h4><p className="text-green-700">파워서플라이에서 플라즈마로 에너지를 전달하는 <strong>중간다리 역할</strong>을 하는 장치로, <strong>매칭박스(Matching Box)</strong>라고도 부릅니다.</p></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"><h4 className="font-semibold text-blue-800 mb-2">전력 공급 방식</h4><ul className="text-blue-700 text-sm space-y-1"><li>• <strong>RF Power:</strong> 고주파 교류전원</li><li>• <strong>DC Power:</strong> 직류전원</li><li className="text-blue-600 font-medium">※ 본 시뮬레이터는 RF Power만 다룹니다</li></ul></div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400"><h4 className="font-semibold text-yellow-800 mb-2">50Ω 임피던스 매칭</h4><p className="text-yellow-700 text-sm">RF 파워서플라이는 표준 50Ω 출력을 가지므로, 매칭박스 내부 회로(L, C)로 임피던스를 50Ω에 맞춰야 합니다.</p></div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400"><h4 className="font-semibold text-orange-800 mb-2">💡 쉬운 비유</h4><p className="text-orange-700">주유소에서 <strong>딱 맞는 주유구 크기</strong>로 연료를 넣는 것과 같습니다. 크기가 맞지 않으면 연료가 새거나 제대로 들어가지 않듯이, 임피던스가 맞지 않으면 전력이 반사되어 효율이 떨어집니다.</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-green-800 mb-4">RF 매칭 네트워크 개념</h3>
              
              {/* 컨트롤 패널을 SVG 위쪽에 별도로 배치 */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded-lg">
                  <h4 className="text-sm font-bold text-blue-800 mb-2 text-center">🎛️ RF 주파수</h4>
                  <label className="block text-xs font-bold text-blue-900 mb-2">주파수: {frequency} MHz</label>
                  <div className="relative">
                    <input 
                      type="range" 
                      min="0.4" 
                      max="100" 
                      step="0.1" 
                      value={frequency} 
                      onChange={(e) => setFrequency(parseFloat(e.target.value))} 
                      className="w-full h-4 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-blue-400 slider-thumb-blue"
                    />
                    <div className="flex justify-between text-xs text-blue-700 mt-1 font-medium">
                      <span>0.4</span>
                      <span className="font-bold">13.56</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-2 border-green-400 p-3 rounded-lg">
                  <h4 className="text-sm font-bold text-green-800 mb-2 text-center">⚙️ 매칭 네트워크</h4>
                  <div className="mb-3">
                    <label className="block text-xs font-bold text-green-900 mb-2">인덕턴스: {inductance} nH</label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="10" 
                        value={inductance} 
                        onChange={(e) => setInductance(parseInt(e.target.value))} 
                        className="w-full h-3 bg-gradient-to-r from-green-200 to-emerald-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-green-400 slider-thumb-green"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-bold text-green-900 mb-2">캐패시턴스: {capacitance} pF</label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="10" 
                        value={capacitance} 
                        onChange={(e) => setCapacitance(parseInt(e.target.value))} 
                        className="w-full h-3 bg-gradient-to-r from-teal-200 to-green-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-teal-400 slider-thumb-teal"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={applyAutoMatching} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-2 rounded-lg shadow-md transition-colors duration-200 border-2 border-green-500"
                  >
                    🎯 자동 매칭
                  </button>
                </div>
                
                <div className="bg-red-100 border-2 border-red-400 p-3 rounded-lg">
                  <h4 className="text-sm font-bold text-red-800 mb-2 text-center">🎯 플라즈마 부하</h4>
                  <label className="block text-xs font-bold text-red-900 mb-2">부하 임피던스: {loadImpedance} Ω</label>
                  <div className="relative mb-3">
                    <input 
                      type="range" 
                      min="10" 
                      max="200" 
                      step="1" 
                      value={loadImpedance} 
                      onChange={(e) => setLoadImpedance(parseInt(e.target.value))} 
                      className="w-full h-4 bg-gradient-to-r from-red-200 to-pink-300 rounded-lg appearance-none cursor-pointer shadow-inner border-2 border-red-400 slider-thumb-red"
                    />
                    <div className="flex justify-between text-xs text-red-700 mt-1 font-medium">
                      <span>10</span><span>50</span><span>100</span><span>150</span><span>200</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-red-300">
                    <div className="text-xs text-red-800 space-y-2">
                      <div className="font-semibold text-red-900 mb-2">부하 임피던스란?</div>
                      <div>플라즈마는 생성 방식(ICP, CCP 등)에 따라 전기적 성분이 달라집니다.</div>
                      <div>이를 전기적 임피던스로 환산하면 <strong>부하 임피던스</strong>가 됩니다.</div>
                      <div className="mt-2 pt-2 border-t border-red-200">
                        <div className="font-semibold text-red-900">매칭 설계:</div>
                        <div>챔버와 소스전극의 하드웨어 정보로 매칭네트워크를 완벽한 역설계도 가능합니다.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <svg width="100%" height="600" viewBox="0 0 800 600">
                  {/* RF Generator */}
                  <rect x="40" y="240" width="120" height="100" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" rx="8"/>
                  <text x="100" y="275" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">RF Generator</text>
                  <text x="100" y="300" textAnchor="middle" fontSize="14" fill="white">{frequency} MHz</text>
                  <text x="100" y="320" textAnchor="middle" fontSize="14" fill="white">50Ω 고정</text>

                  {/* Connection line 1 */}
                  <line x1="160" y1="290" x2="240" y2="290" stroke="#374151" strokeWidth="4"/>

                  {/* Matching Box */}
                  <rect x="240" y="180" width="200" height="220" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="10,5"/>
                  <text x="340" y="160" textAnchor="middle" fontSize="20" fill="#059669" fontWeight="bold">매칭박스 (조율기)</text>
                  
                  {/* Inductor */}
                  <g transform="translate(280,250)">
                    <path d="M0,0 Q12,-20 24,0 Q36,20 48,0 Q60,-20 72,0 Q84,20 96,0" fill="none" stroke="#059669" strokeWidth="4"/>
                    <text x="48" y="-35" textAnchor="middle" fontSize="16" fill="#059669" fontWeight="bold">L: {inductance}nH</text>
                  </g>
                  
                  {/* Capacitor */}
                  <g transform="translate(300,310)">
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#059669" strokeWidth="4"/>
                    <line x1="28" y1="0" x2="48" y2="0" stroke="#059669" strokeWidth="4"/>
                    <line x1="20" y1="-20" x2="20" y2="20" stroke="#059669" strokeWidth="4"/>
                    <line x1="28" y1="-20" x2="28" y2="20" stroke="#059669" strokeWidth="4"/>
                    <text x="24" y="50" textAnchor="middle" fontSize="16" fill="#059669" fontWeight="bold">C: {capacitance}pF</text>
                  </g>

                  {/* Output label */}
                  <rect x="250" y="135" width="180" height="35" fill="#059669" rx="6"/>
                  <text x="340" y="158" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">출력: 50Ω 목표</text>

                  {/* Input Impedance label */}
                  <rect x="250" y="90" width="180" height="35" fill={Math.abs(parseFloat(calculateInputImpedance()) - 50) < 5 ? '#10b981' : '#f59e0b'} rx="6"/>
                  <text x="340" y="113" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">입력 임피던스: {calculateInputImpedance()}Ω</text>

                  {/* Connection line 2 */}
                  <line x1="440" y1="290" x2="500" y2="290" stroke="#374151" strokeWidth="4"/>

                  {/* Power Meter */}
                  <rect x="500" y="265" width="140" height="50" fill="#f59e0b" stroke="#d97706" strokeWidth="3" rx="8"/>
                  <text x="570" y="293" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">전력 측정기</text>
                  <text x="570" y="345" textAnchor="middle" fontSize="14" fill="#d97706" fontWeight="bold">효율: {(100 - (parseFloat(calculateReflectedPower()) / rfPower * 100)).toFixed(1)}%</text>

                  {/* Connection line 3 */}
                  <line x1="640" y1="290" x2="680" y2="290" stroke="#374151" strokeWidth="4"/>

                  {/* Plasma Load */}
                  <ellipse cx="730" cy="290" rx="30" ry="60" fill="#ef4444" stroke="#dc2626" strokeWidth="4"/>
                  <text x="730" y="275" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">플라즈마</text>
                  <text x="730" y="295" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">부하</text>
                </svg>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-900 text-sm leading-relaxed">
                  <strong>매칭의 원리:</strong> 플라즈마의 부하 임피던스와 RF 파워(50Ω) 간의 임피던스를 맞추기 위해 매칭네트워크가 필요합니다. 
                  매칭네트워크 안에는 <strong>인덕턴스(L)</strong>와 <strong>캐패시턴스(C)</strong>가 있습니다. 
                  플라즈마가 어떤 조건(압력, 가스 종류, 파워 등)으로 생성되느냐에 따라 부하 임피던스가 달라지면, 
                  매칭박스 내의 L과 C 값을 조정하여 RF 파워가 보는 입력 임피던스를 50Ω으로 맞춰야 합니다.
                </p>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="text-green-900 font-bold mb-3">시뮬레이터 사용 방법</h4>
                <div className="space-y-2 text-green-800 text-sm">
                  <div className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span><strong>부하 임피던스</strong>를 설정하세요 (플라즈마 부하 슬라이더 조정)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span><strong>매칭네트워크 내 인덕턴스(L)와 캐패시턴스(C)</strong>를 움직여서 입력 임피던스가 50Ω에 맞춰보세요</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span><strong>"자동 매칭" 버튼</strong>을 눌러 최적값을 확인하고 전달 효율이 높아지는 것을 관찰하세요</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-3">현재 매칭 상태</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-600">입력 임피던스:</span><div className="font-semibold text-green-900">{calculateInputImpedance()} Ω</div></div>
                    <div><span className="text-gray-600">반사 전력:</span><div className="font-semibold text-green-900">{calculateReflectedPower()} W</div></div>
                    <div><span className="text-gray-600">전달 효율:</span><div className="font-semibold text-green-900">{(100 - (parseFloat(calculateReflectedPower()) / rfPower * 100)).toFixed(1)}%</div></div>
                    <div><span className="text-gray-600">VSWR:</span><div className="font-semibold text-green-900">{(1 + Math.sqrt(parseFloat(calculateReflectedPower()) / rfPower) / (1 - Math.sqrt(parseFloat(calculateReflectedPower()) / rfPower))).toFixed(2)}</div></div>
                  </div>
                  <div className={`mt-3 p-2 rounded text-center font-bold ${Math.abs(parseFloat(calculateInputImpedance()) - 50) < 5 ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
                    {Math.abs(parseFloat(calculateInputImpedance()) - 50) < 5 ? '✓ 최적 매칭!' : '⚠ 매칭 필요'}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-3">최적 L, C 값 ({frequency} MHz, {loadImpedance}Ω 부하)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">최적 인덕턴스:</span>
                      <span className="font-semibold text-blue-900">{calculateOptimalLC().L} nH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">최적 캐패시턴스:</span>
                      <span className="font-semibold text-blue-900">{calculateOptimalLC().C} pF</span>
                    </div>
                    <div className="mt-2 p-2 bg-blue-100 rounded text-xs">
                      <strong>토폴로지:</strong> {calculateOptimalLC().type}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-900"><strong>💡 핵심 원리:</strong> 부하 임피던스({loadImpedance}Ω)를 50Ω으로 변환하기 위해 L과 C 값이 계산됩니다. 주파수({frequency}MHz)나 부하가 변하면 최적 L, C 값도 함께 변합니다. "자동 매칭" 버튼을 누르면 최적값으로 설정됩니다.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-green-800 mb-4">💡 시뮬레이터 사용 방법</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">1단계: 조건 설정</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• <strong>RF 주파수</strong>: 파워 발생기의 주파수 (보통 13.56 MHz 사용)</li>
                    <li>• <strong>부하 임피던스</strong>: 플라즈마의 임피던스 (공정 조건에 따라 변함)</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2">2단계: 매칭 조정</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• <strong>수동 조정</strong>: L과 C 슬라이더를 움직여서 입력 임피던스가 50Ω에 가까워지도록 조정</li>
                    <li>• <strong>자동 매칭</strong>: "자동 매칭" 버튼을 눌러 최적의 L, C 값으로 즉시 설정</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-900 mb-2">3단계: 결과 확인</h4>
                  <ul className="text-purple-800 text-sm space-y-1">
                    <li>• <strong>입력 임피던스</strong>: 50Ω에 가까울수록 좋음</li>
                    <li>• <strong>전달 효율</strong>: 100%에 가까울수록 전력 손실이 적음</li>
                    <li>• <strong>반사 전력</strong>: 0W에 가까울수록 좋음</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🎯 매칭(Matching)이란?</h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-3">쉬운 비유: 물 호스 연결</h4>
                  <p className="text-orange-800 text-sm mb-2">
                    정원에 물을 주려고 수도꼭지에 호스를 연결한다고 생각해봅시다:
                  </p>
                  <ul className="text-orange-700 text-sm space-y-2 ml-4">
                    <li>• <strong>호스 크기가 딱 맞으면</strong> → 물이 100% 효율로 흐릅니다 ✓</li>
                    <li>• <strong>호스가 너무 크거나 작으면</strong> → 물이 새거나 압력이 떨어집니다 ✗</li>
                  </ul>
                  <p className="text-orange-800 text-sm mt-2">
                    RF 매칭도 마찬가지입니다. 파워 발생기(50Ω)와 플라즈마 부하의 "크기"를 딱 맞춰야 전력이 100% 전달됩니다.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-3">왜 매칭이 중요한가?</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border-l-4 border-red-400">
                      <div className="font-semibold text-red-800 mb-1">매칭이 잘 안되면 (예: 입력 임피던스 100Ω)</div>
                      <ul className="text-red-700 text-sm space-y-1">
                        <li>• 전력의 일부가 반사되어 되돌아옴</li>
                        <li>• 플라즈마에 전달되는 실제 전력 감소</li>
                        <li>• 공정 불안정, 속도 저하</li>
                        <li>• 장비 손상 가능성 증가</li>
                        <li>• 전기료 낭비</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-400">
                      <div className="font-semibold text-green-800 mb-1">매칭이 잘 되면 (입력 임피던스 50Ω)</div>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• 전력의 거의 100%가 플라즈마로 전달</li>
                        <li>• 반사파 최소화</li>
                        <li>• 안정적이고 균일한 공정</li>
                        <li>• 장비 보호</li>
                        <li>• 에너지 효율 극대화</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">매칭 네트워크(L과 C)의 역할</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    플라즈마의 임피던스는 공정 조건(압력, 가스, 파워)에 따라 계속 변합니다. 
                    매칭 네트워크는 <strong>인덕터(L)와 캐패시터(C)를 조정</strong>하여 
                    어떤 플라즈마 조건에서도 RF 발생기가 보는 임피던스를 50Ω으로 만듭니다.
                  </p>
                  <div className="bg-white p-3 rounded">
                    <div className="text-blue-900 font-semibold mb-2">실제 예시:</div>
                    <div className="text-blue-800 text-sm space-y-2">
                      <div className="flex items-center">
                        <span className="w-32">부하 100Ω일 때:</span>
                        <span className="flex-1">→ L과 C를 특정 값으로 조정 → 입력 임피던스 50Ω</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32">부하 150Ω로 변경:</span>
                        <span className="flex-1">→ L과 C를 다시 조정 → 입력 임피던스 50Ω 유지</span>
                      </div>
                      <div className="mt-2 text-xs text-blue-600 italic">
                        이것이 "자동 매칭" 시스템이 하는 일입니다. 실시간으로 L과 C를 조정하여 항상 50Ω을 유지합니다.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-400">
                  <h4 className="font-semibold text-green-900 mb-3">핵심 요약</h4>
                  <div className="space-y-2 text-green-800 text-sm">
                    <p><strong>1.</strong> RF 파워 발생기는 항상 50Ω 출력을 가짐</p>
                    <p><strong>2.</strong> 플라즈마 부하 임피던스는 공정에 따라 다름 (예: 30~200Ω)</p>
                    <p><strong>3.</strong> 매칭 네트워크가 L과 C로 임피던스를 변환 → 발생기가 보는 값 = 50Ω</p>
                    <p><strong>4.</strong> 매칭 성공 = 전력 전달 효율 거의 100%</p>
                    <p><strong>5.</strong> 매칭 실패 = 전력 반사, 공정 불안정, 장비 손상</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTheme === 'system-structure' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">🏗️ CCP 플라즈마 시스템 구조</h2>
              <p className="text-purple-700">용량결합 플라즈마(CCP) 시스템의 구조와 동작 원리를 학습합니다.</p>
              <div className="text-sm text-purple-600 bg-purple-100 rounded-lg p-3 mt-2">
                <strong>학습 포인트:</strong> Self-bias 개념, RIE/Plasma Mode 차이, CCP의 특성과 한계점
              </div>
            </div>

            {/* 시스템 구조 비교 */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 1. 간단한 CCP 구조 (Image 1) */}
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">1. CCP 기본 구조</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <svg width="100%" height="300" viewBox="0 0 400 300">
                    {/* 챔버 외곽 (위로 이동) */}
                    <rect x="80" y="40" width="240" height="140" fill="none" stroke="#374151" strokeWidth="4" rx="8"/>
                    
                    {/* 상부 전극 */}
                    <rect x="100" y="60" width="200" height="15" fill="#6b7280" stroke="#374151" strokeWidth="2"/>
                    
                    {/* 웨이퍼 */}
                    <rect x="150" y="140" width="100" height="8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
                    <text x="280" y="135" fontSize="12" fill="#f59e0b" fontWeight="bold">Wafer</text>
                    
                    {/* 하부 전극 */}
                    <rect x="100" y="150" width="200" height="15" fill="#6b7280" stroke="#374151" strokeWidth="2"/>
                    
                    {/* 접지 기호 (상부) */}
                    <line x1="200" y1="60" x2="200" y2="30" stroke="#374151" strokeWidth="3"/>
                    <line x1="190" y1="30" x2="210" y2="30" stroke="#374151" strokeWidth="3"/>
                    <line x1="194" y1="25" x2="206" y2="25" stroke="#374151" strokeWidth="2"/>
                    <line x1="198" y1="20" x2="202" y2="20" stroke="#374151" strokeWidth="2"/>
                    
                    {/* 플라즈마 영역 */}
                    <ellipse cx="200" cy="110" rx="80" ry="30" fill="#a855f7" opacity="0.3"/>
                    <text x="200" y="115" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">Plasma</text>
                    
                    {/* RF 소스 (사인파) */}
                    <circle cx="200" cy="230" r="18" fill="none" stroke="#374151" strokeWidth="2"/>
                    <path d="M185,230 Q192,220 200,230 Q208,240 215,230" fill="none" stroke="#374151" strokeWidth="2"/>
                    
                    {/* RF 소스 라벨 */}
                    <text x="200" y="280" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">RF Power</text>
                    <text x="200" y="295" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="bold">13.56 MHz</text>
                    <text x="200" y="310" textAnchor="middle" fontSize="10" fill="#374151">Capacitive Coupling</text>
                    
                    {/* RF 연결선 (챔버 외부에서 하부 전극으로) */}
                    <line x1="200" y1="165" x2="200" y2="212" stroke="#374151" strokeWidth="3"/>
                    
                    {/* 접지 기호 (RF 소스) */}
                    <line x1="200" y1="250" x2="200" y2="260" stroke="#374151" strokeWidth="2"/>
                    <line x1="195" y1="260" x2="205" y2="260" stroke="#374151" strokeWidth="2"/>
                    <line x1="197" y1="263" x2="203" y2="263" stroke="#374151" strokeWidth="1"/>
                    <line x1="199" y1="266" x2="201" y2="266" stroke="#374151" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>특징:</strong> 평행한 두 전극 사이에 RF 전압을 인가하여 플라즈마를 생성합니다. 
                    하부 전극에 웨이퍼를 위치시키고 RF 파워를 공급합니다.
                  </p>
                </div>
              </div>

              {/* 2. 상세한 CCP 구조 (Image 2) */}
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">2. CCP 상세 구조</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <svg width="100%" height="300" viewBox="0 0 400 300">
                    {/* 챔버 */}
                    <rect x="80" y="100" width="240" height="140" fill="none" stroke="#dc2626" strokeWidth="3"/>
                    
                    {/* 가스 시스템 - 우측 상단 */}
                    {/* 가스통 3개 */}
                    <rect x="350" y="30" width="15" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" rx="3"/>
                    <text x="357" y="25" fontSize="12" fill="#374151" fontWeight="bold">CF4</text>
                    <rect x="370" y="30" width="15" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" rx="3"/>
                    <text x="378" y="25" fontSize="12" fill="#374151" fontWeight="bold">Ar</text>
                    <rect x="390" y="30" width="15" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" rx="3"/>
                    <text x="397" y="25" fontSize="12" fill="#374151" fontWeight="bold">O2</text>
                    
                    {/* 가스밸브 3개 */}
                    <circle cx="357" cy="80" r="5" fill="white" stroke="#374151" strokeWidth="2"/>
                    <line x1="354" y1="77" x2="360" y2="83" stroke="#374151" strokeWidth="2"/>
                    <circle cx="377" cy="80" r="5" fill="white" stroke="#374151" strokeWidth="2"/>
                    <line x1="374" y1="77" x2="380" y2="83" stroke="#374151" strokeWidth="2"/>
                    <circle cx="397" cy="80" r="5" fill="white" stroke="#374151" strokeWidth="2"/>
                    <line x1="394" y1="77" x2="400" y2="83" stroke="#374151" strokeWidth="2"/>
                    
                    {/* MFC 3개 */}
                    <rect x="350" y="95" width="15" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
                    <text x="352" y="103" fontSize="8" fill="#374151">MFC</text>
                    <rect x="370" y="95" width="15" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
                    <text x="372" y="103" fontSize="8" fill="#374151">MFC</text>
                    <rect x="390" y="95" width="15" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
                    <text x="392" y="103" fontSize="8" fill="#374151">MFC</text>
                    
                    {/* 가스라인 연결 */}
                    <line x1="357" y1="70" x2="357" y2="75" stroke="#10b981" strokeWidth="2"/>
                    <line x1="377" y1="70" x2="377" y2="75" stroke="#10b981" strokeWidth="2"/>
                    <line x1="397" y1="70" x2="397" y2="75" stroke="#10b981" strokeWidth="2"/>
                    
                    <line x1="357" y1="85" x2="357" y2="95" stroke="#10b981" strokeWidth="2"/>
                    <line x1="377" y1="85" x2="377" y2="95" stroke="#10b981" strokeWidth="2"/>
                    <line x1="397" y1="85" x2="397" y2="95" stroke="#10b981" strokeWidth="2"/>
                    
                    <line x1="357" y1="105" x2="357" y2="115" stroke="#10b981" strokeWidth="2"/>
                    <line x1="377" y1="105" x2="377" y2="115" stroke="#10b981" strokeWidth="2"/>
                    <line x1="397" y1="105" x2="397" y2="115" stroke="#10b981" strokeWidth="2"/>
                    
                    {/* 합류점 */}
                    <line x1="357" y1="115" x2="377" y2="115" stroke="#10b981" strokeWidth="2"/>
                    <line x1="377" y1="115" x2="397" y2="115" stroke="#10b981" strokeWidth="2"/>
                    
                    {/* 샤워헤드로 연결 */}
                    <line x1="377" y1="115" x2="280" y2="115" stroke="#10b981" strokeWidth="2"/>
                    <line x1="280" y1="115" x2="280" y2="127" stroke="#10b981" strokeWidth="2"/>
                    <polygon points="277,125 283,125 280,130" fill="#10b981"/>
                    
                    {/* 플라즈마 샤워 헤드 - 상부 전극 (진한회색) */}
                    <rect x="120" y="120" width="160" height="8" fill="#6b7280" stroke="#374151" strokeWidth="2"/>
                    {/* 플라즈마 샤워 헤드 - 하부 (파란색) */}
                    <rect x="120" y="128" width="160" height="7" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"/>
                    
                    {/* 접지 기호 (상부 전극 위) */}
                    <line x1="200" y1="120" x2="200" y2="85" stroke="#374151" strokeWidth="3"/>
                    <line x1="190" y1="85" x2="210" y2="85" stroke="#374151" strokeWidth="3"/>
                    <line x1="194" y1="80" x2="206" y2="80" stroke="#374151" strokeWidth="2"/>
                    <line x1="198" y1="75" x2="202" y2="75" stroke="#374151" strokeWidth="2"/>
                    
                    <text x="300" y="110" fontSize="13" fill="#2563eb" fontWeight="bold">Plasma</text>
                    <text x="300" y="125" fontSize="13" fill="#2563eb" fontWeight="bold">shower</text>
                    <text x="310" y="140" fontSize="13" fill="#2563eb" fontWeight="bold">head</text>
                    
                    {/* 플라즈마 */}
                    <rect x="120" y="135" width="160" height="70" fill="#a855f7" opacity="0.6"/>
                    <text x="200" y="175" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">Plasma</text>
                    
                    {/* 하부 플레이트 */}
                    <rect x="120" y="210" width="160" height="15" fill="#6b7280" stroke="#374151" strokeWidth="2"/>
                    
                    {/* RF 파워 소스 */}
                    <circle cx="120" cy="270" r="15" fill="none" stroke="#dc2626" strokeWidth="2"/>
                    <path d="M108,270 Q114,263 120,270 Q126,277 132,270" fill="none" stroke="#dc2626" strokeWidth="2"/>
                    <text x="50" y="275" fontSize="13" fill="#dc2626" fontWeight="bold">RF</text>
                    <text x="45" y="290" fontSize="13" fill="#dc2626" fontWeight="bold">power</text>
                    <text x="45" y="305" fontSize="13" fill="#dc2626" fontWeight="bold">source</text>
                    
                    {/* 접지 (RF 소스) */}
                    <line x1="120" y1="290" x2="120" y2="295" stroke="#374151" strokeWidth="2"/>
                    <line x1="115" y1="295" x2="125" y2="295" stroke="#374151" strokeWidth="2"/>
                    <line x1="117" y1="298" x2="123" y2="298" stroke="#374151" strokeWidth="1"/>
                    
                    {/* RF 연결선 */}
                    <line x1="135" y1="270" x2="200" y2="270" stroke="#dc2626" strokeWidth="3"/>
                    <line x1="200" y1="270" x2="200" y2="225" stroke="#dc2626" strokeWidth="3"/>
                    
                    {/* Reaction chamber 라벨 */}
                    <text x="350" y="160" fontSize="13" fill="#dc2626" fontWeight="bold">Reaction</text>
                    <text x="350" y="175" fontSize="13" fill="#dc2626" fontWeight="bold">chamber</text>
                  </svg>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>완전한 시스템:</strong> 가스 주입, 플라즈마 샤워헤드, RF 파워, 진공 펌프를 포함한 
                    실제 CCP 장비의 구조입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Self-bias와 CCP 모드 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Self-bias 개념과 CCP 동작 모드</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-800 mb-2">Self-bias란?</h4>
                  <p className="text-yellow-700 text-sm">
                    CCP에서 두 전극의 크기가 다르면, 작은 전극에 더 큰 음전압이 걸리는 현상입니다. 
                    이를 이용해 웨이퍼 위치에 따라 다른 공정 모드를 구현할 수 있습니다.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                    <h4 className="font-semibold text-red-800 mb-3">RIE Mode (Reactive Ion Etch)</h4>
                    <div className="space-y-2 text-red-700 text-sm">
                      <div><strong>압력:</strong> 10-100 mTorr (낮음)</div>
                      <div><strong>웨이퍼 위치:</strong> 작은 전극 (큰 음전위)</div>
                      <div><strong>특징:</strong> 강한 이온 충돌 (Ion bombardment)</div>
                      <div><strong>결과:</strong> High Anisotropic, Fair Selectivity</div>
                      <div><strong>용도:</strong> Dry Etching</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <h4 className="font-semibold text-green-800 mb-3">Plasma Mode</h4>
                    <div className="space-y-2 text-green-700 text-sm">
                      <div><strong>압력:</strong> >100 mTorr (높음)</div>
                      <div><strong>웨이퍼 위치:</strong> 큰 전극 (작은 음전위)</div>
                      <div><strong>특징:</strong> 약한 이온 충돌, 라디칼 확산</div>
                      <div><strong>결과:</strong> Isotropic Profile</div>
                      <div><strong>용도:</strong> PECVD, PR Strip (Ashing)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CCP의 한계와 ICP 필요성 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-red-800 mb-4">CCP의 한계점</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3">문제점 1: 독립 제어 불가</h4>
                  <div className="space-y-2 text-red-700 text-sm">
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-red-500 rounded mr-2"></span>
                      <span>RF Power ↑ → Ion 밀도 ↑ (좋음)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-red-500 rounded mr-2"></span>
                      <span>RF Power ↑ → Ion Energy ↑ (나쁨)</span>
                    </div>
                    <p className="mt-2 font-medium">이온 밀도와 이온 에너지를 독립적으로 조절할 수 없음</p>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3">문제점 2: 저압에서 플라즈마 불가</h4>
                  <div className="space-y-2 text-red-700 text-sm">
                    <div>• 압력 ↓ → MFP ↑ → Vertical Profile (좋음)</div>
                    <div>• 압력 ↓ → 기체 입자수 ↓ → 플라즈마 형성 불가 (나쁨)</div>
                    <p className="mt-2 font-medium">수 mTorr 압력에서 플라즈마 유지 어려움</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">해결책: ICP (Inductively Coupled Plasma)</h4>
                <p className="text-blue-700 text-sm">
                  낮은 Ion Energy + 높은 Ion 밀도 + 저압에서도 안정적인 플라즈마 형성이 가능한 ICP 기술이 개발되었습니다.
                </p>
              </div>
            </div>

            {/* CCP 특성 요약 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4">🔍 CCP vs ICP: 각각의 장점과 적용 분야</h3>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-2">💡 기술 선택의 핵심: 목적에 맞는 도구</h4>
                <p className="text-blue-700 text-sm">
                  CCP와 ICP는 각각 고유한 강점을 가진 기술입니다. "더 좋은" 기술이 아니라 
                  <strong>공정 요구사항에 맞는</strong> 기술을 선택하는 것이 중요합니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-3">🏆 CCP가 여전히 선호되는 이유</h4>
                  <ul className="text-green-700 text-sm space-y-2">
                    <li>• <strong>비용 효율성:</strong> 장비 가격 1/2~1/3 수준</li>
                    <li>• <strong>대면적 처리:</strong> 대형 디스플레이, 태양전지 패널</li>
                    <li>• <strong>성숙한 기술:</strong> 30년+ 축적된 노하우</li>
                    <li>• <strong>안정성:</strong> 단순한 구조로 고장률 낮음</li>
                    <li>• <strong>균일도:</strong> 웨이퍼 전체에 일정한 공정</li>
                    <li>• <strong>유지보수:</strong> 간단한 구조로 정비 용이</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-3">🚀 ICP의 고유 장점</h4>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li>• <strong>독립 제어:</strong> 밀도와 에너지 분리</li>
                    <li>• <strong>고밀도 플라즈마:</strong> 10배 높은 밀도</li>
                    <li>• <strong>저압 동작:</strong> 정밀한 이방성 식각</li>
                    <li>• <strong>고속 공정:</strong> 3~5배 빠른 식각률</li>
                    <li>• <strong>정밀 제어:</strong> 나노급 공정 대응</li>
                    <li>• <strong>손상 최소화:</strong> 낮은 이온 에너지</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-purple-800 mb-3">🔧 실제 산업에서의 선택 기준</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-semibold text-green-800 mb-2">CCP를 선택하는 경우</h5>
                    <ul className="text-green-700 text-xs space-y-1">
                      <li>• <strong>Ashing 공정:</strong> PR 제거, 잔류물 청소</li>
                      <li>• <strong>PECVD:</strong> 절연막, 보호막 증착</li>
                      <li>• <strong>대면적 기판:</strong> LCD, OLED 패널</li>
                      <li>• <strong>일반 식각:</strong> 극한 성능 불필요</li>
                      <li>• <strong>대량 생산:</strong> 비용 민감한 제품</li>
                      <li>• <strong>기존 라인:</strong> 레거시 장비 활용</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-semibold text-blue-800 mb-2">ICP를 선택하는 경우</h5>
                    <ul className="text-blue-700 text-xs space-y-1">
                      <li>• <strong>첨단 반도체:</strong> 7nm 이하 공정</li>
                      <li>• <strong>Deep Trench:</strong> DRAM, 3D NAND</li>
                      <li>• <strong>고속 공정:</strong> 처리량 최우선</li>
                      <li>• <strong>정밀 식각:</strong> 고선택비 요구</li>
                      <li>• <strong>R&D:</strong> 새로운 공정 개발</li>
                      <li>• <strong>고부가가치:</strong> 성능 > 비용</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2">📊 시장 현황: 둘 다 성장 중</h4>
                <p className="text-orange-700 text-sm">
                  전 세계 반도체 장비 시장에서 CCP는 여전히 <strong>40% 이상</strong>의 점유율을 차지하고 있습니다. 
                  특히 메모리, 디스플레이, 태양전지 분야에서는 CCP가 주력 기술로 사용되며, 
                  ICP는 주로 첨단 로직 반도체에서 활용됩니다. <strong>서로 다른 영역에서 공존하며 발전</strong>하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlasmaSimulator;
