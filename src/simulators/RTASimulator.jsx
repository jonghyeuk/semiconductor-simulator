import React, { useState, useEffect, useRef } from 'react';

// Icon components (inline SVG)
const Play = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const Pause = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);

const Square = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12"/>
  </svg>
);

const Settings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Info = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const AlertTriangle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const RTASimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTemp, setCurrentTemp] = useState(25);
  const [targetTemp, setTargetTemp] = useState(1000);
  const [rampRate, setRampRate] = useState(50);
  const [processTime, setProcessTime] = useState(30);
  const [gasFlow, setGasFlow] = useState('N2');
  const [pressure, setPressure] = useState(1013);
  const [lampPower, setLampPower] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneSetpoints, setZoneSetpoints] = useState([25, 25, 25, 25, 25, 25]);
  const [zoneTemps, setZoneTemps] = useState([25, 25, 25, 25, 25, 25]);
  const [processStage, setProcessStage] = useState('Ready');
  const [pyrometer, setPyrometer] = useState(25);
  const [tempHistory, setTempHistory] = useState([]);
  const [processLog, setProcessLog] = useState([]);
  const [waferStress, setWaferStress] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState('');

  const intervalRef = useRef(null);

  // Process applications
  const applications = {
    'dopant_activation': { temp: 1050, time: 10, ramp: 100, gas: 'N2' },
    'silicide_formation': { temp: 450, time: 60, ramp: 30, gas: 'Ar' },
    'implant_anneal': { temp: 1100, time: 5, ramp: 200, gas: 'N2' },
    'thermal_oxidation': { temp: 900, time: 120, ramp: 25, gas: 'O2' },
    'spike_anneal': { temp: 1100, time: 0.1, ramp: 300, gas: 'N2' }
  };

  // Temperature profile calculation
  const calculateTempProfile = (time) => {
    const gasStabilizationTime = 10;
    const totalRampUpTime = (targetTemp - 25) / rampRate;
    const rampDownTime = (targetTemp - 25) / (rampRate * 0.3);

    if (time <= gasStabilizationTime) {
      return 25;
    } else if (time <= gasStabilizationTime + totalRampUpTime) {
      const rampTime = time - gasStabilizationTime;
      return 25 + (rampRate * rampTime);
    } else if (time <= gasStabilizationTime + totalRampUpTime + processTime) {
      return targetTemp;
    } else if (time <= gasStabilizationTime + totalRampUpTime + processTime + rampDownTime) {
      const coolTime = time - (gasStabilizationTime + totalRampUpTime + processTime);
      const coolProgress = coolTime / rampDownTime;
      return targetTemp - (targetTemp - 25) * Math.pow(coolProgress, 0.7);
    } else {
      return 25;
    }
  };

  // Zone thermal lag simulation
  const updateZoneTemperatures = (globalSetpoint, deltaTime) => {
    const timeConstants = [0.5, 0.75, 0.75, 1.0, 1.0, 1.25];

    const newSetpoints = zoneSetpoints.map((_, idx) => {
      const powerFactor = lampPower[idx] / 100;
      const positionOffset = idx === 0 ? 0 : (idx < 3 ? 2 : idx < 5 ? 5 : 8);
      return Math.max(25, globalSetpoint - positionOffset + (powerFactor * 10));
    });

    setZoneSetpoints(newSetpoints);

    const newZoneTemps = zoneTemps.map((currentTemp, idx) => {
      const setpoint = newSetpoints[idx];
      const timeConstant = timeConstants[idx];
      const tempChange = (setpoint - currentTemp) / timeConstant * deltaTime;
      return currentTemp + tempChange;
    });

    setZoneTemps(newZoneTemps);
    return newZoneTemps.reduce((sum, temp) => sum + temp, 0) / newZoneTemps.length;
  };

  const updateLampPowers = (currentTemp, targetTemp, stage) => {
    const tempError = targetTemp - currentTemp;
    const maxPower = 100;

    let basePower = 0;

    if (stage === 'Gas Stabilization') {
      basePower = 15;
    } else if (stage === 'Rapid Ramp Up') {
      basePower = Math.min(maxPower, Math.max(70, 85 + (tempError / 50) * 15));
    } else if (stage === 'Process Hold') {
      basePower = Math.min(maxPower, Math.max(20, 40 + (tempError / 10) * 20));
    } else if (stage === 'Cool Down') {
      basePower = Math.max(0, 10 + tempError * 0.05);
    } else {
      basePower = 0;
    }

    const newPowers = [
      basePower * 1.0,
      basePower * 0.95,
      basePower * 0.95,
      basePower * 0.90,
      basePower * 0.90,
      basePower * 0.85
    ];

    setLampPower(newPowers);

    const rampStress = Math.abs(rampRate) * 0.02;
    const tempGradientStress = Math.abs(tempError) * 0.05;
    const totalStress = rampStress + tempGradientStress;
    setWaferStress(Math.min(100, totalStress));
  };

  // Process control logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          const idealTemp = calculateTempProfile(newTime);
          const actualTemp = updateZoneTemperatures(idealTemp, 0.1);

          setCurrentTemp(actualTemp);
          setPyrometer(actualTemp + (Math.random() - 0.5) * 2);

          const gasStabilizationTime = 10;
          const totalRampTime = (targetTemp - 25) / rampRate;
          let newStage = '';

          if (newTime <= gasStabilizationTime) {
            newStage = 'Gas Stabilization';
          } else if (newTime <= gasStabilizationTime + totalRampTime) {
            newStage = 'Rapid Ramp Up';
          } else if (newTime <= gasStabilizationTime + totalRampTime + processTime) {
            newStage = 'Process Hold';
          } else {
            newStage = 'Cool Down';
          }

          if (newStage !== processStage) {
            if (newStage === 'Rapid Ramp Up') {
              setProcessLog(prev => [...prev, `🔥 급속 승온 시작! ${rampRate}°C/s로 가열 중...`]);
            } else if (newStage === 'Process Hold') {
              setProcessLog(prev => [...prev, `🎯 목표온도 도달! ${targetTemp}°C 유지 시작`]);
            } else if (newStage === 'Cool Down') {
              setProcessLog(prev => [...prev, `❄️ 냉각 시작 - 열충격 방지 제어냉각`]);
            }
          }

          setProcessStage(newStage);

          if (newStage === 'Rapid Ramp Up' && newTime % 2 < 0.1) {
            const rampProgress = ((newTime - gasStabilizationTime) / totalRampTime * 100).toFixed(0);
            const maxDeviation = Math.max(...zoneTemps.map((temp, idx) => Math.abs(temp - zoneSetpoints[idx])));
            setProcessLog(prev => [...prev,
              `🌡️ 승온 진행: ${actualTemp.toFixed(0)}°C (${rampProgress}% 완료)`,
              `📊 Zone 편차: 최대 ±${maxDeviation.toFixed(1)}°C`
            ]);
          }

          if (newStage === 'Process Hold' && newTime % 5 < 0.1) {
            const tempRange = Math.max(...zoneTemps) - Math.min(...zoneTemps);
            setProcessLog(prev => [...prev,
              `🎯 온도 유지: ${actualTemp.toFixed(1)}°C, Zone 범위: ${tempRange.toFixed(1)}°C`
            ]);
          }

          updateLampPowers(actualTemp, idealTemp, newStage);

          setTempHistory(prev => {
            const newHistory = [...prev, { time: newTime, temp: actualTemp, setpoint: idealTemp }];
            return newHistory.slice(-300);
          });

          const totalTime = gasStabilizationTime + totalRampTime + processTime + (targetTemp - 25) / (rampRate * 0.3);
          if (newTime >= totalTime) {
            setIsRunning(false);
            setProcessStage('Complete');
            setProcessLog(prev => [...prev, `✅ 공정 완료! 총 시간: ${newTime.toFixed(1)}초`]);
          }

          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, targetTemp, rampRate, processTime, processStage, zoneTemps, zoneSetpoints, lampPower]);

  const startProcess = () => {
    // 모든 상태 초기화 (Complete 상태에서 다시 시작할 수 있도록)
    setCurrentTime(0);
    setCurrentTemp(25);
    setTempHistory([]);
    setProcessStage('Gas Stabilization');
    setPyrometer(25);
    setWaferStress(0);
    setIsRunning(true);
    setIsPaused(false);
    setZoneTemps([25, 25, 25, 25, 25, 25]);
    setZoneSetpoints([25, 25, 25, 25, 25, 25]);
    setLampPower([0, 0, 0, 0, 0, 0]);
    setProcessLog([
      `🚀 RTA 공정 시작!`,
      `📋 레시피: 목표온도 ${targetTemp}°C, 승온률 ${rampRate}°C/s, 유지시간 ${processTime}s`,
      `💨 가스 안정화 시작 (${gasFlow} 분위기)`,
      `🌡️ Zone별 온도 센서 활성화`
    ]);
    updateLampPowers(25, targetTemp, 'Gas Stabilization');
  };

  const pauseProcess = () => {
    setIsPaused(!isPaused);
    setProcessLog(prev => [...prev, `⏸️ 공정 ${isPaused ? '재개됨' : '일시정지됨'}`]);
  };

  const stopProcess = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentTime(0);
    setCurrentTemp(25);
    setTempHistory([]);
    setProcessStage('Ready');
    setLampPower([0, 0, 0, 0, 0, 0]);
    setZoneTemps([25, 25, 25, 25, 25, 25]);
    setZoneSetpoints([25, 25, 25, 25, 25, 25]);
    setProcessLog(prev => [...prev, '⏹️ 공정 정지됨']);
  };

  const loadApplication = (appKey) => {
    const app = applications[appKey];
    setTargetTemp(app.temp);
    setProcessTime(app.time);
    setRampRate(app.ramp);
    setGasFlow(app.gas);
    setSelectedRecipe(appKey);
    setProcessLog(prev => [...prev, `📝 ${appKey.replace('_', ' ')} 레시피 로드됨`]);
  };

  const getProcessStatus = () => {
    if (waferStress > 80) return { status: 'danger', icon: AlertTriangle, msg: 'High wafer stress detected' };
    if (waferStress > 60) return { status: 'warning', icon: AlertTriangle, msg: 'Moderate wafer stress' };
    return { status: 'good', icon: CheckCircle, msg: 'Process normal' };
  };

  const status = getProcessStatus();
  const StatusIcon = status.icon;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">RTA 시뮬레이터</h1>
        <p className="text-gray-600 mb-4">Rapid Thermal Annealing - 반도체 급속 열처리 공정 시뮬레이션</p>

        {/* Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">현재 온도</div>
            <div className="text-2xl font-bold text-blue-800">{currentTemp.toFixed(1)}°C</div>
            {isRunning && (
              <div className="text-xs text-blue-600 mt-1">
                {processStage === 'Rapid Ramp Up' ?
                  `🔥 +${rampRate}°C/s 급속가열` :
                  processStage === 'Process Hold' ?
                  `🎯 목표온도 유지` :
                  processStage === 'Cool Down' ?
                  `❄️ 냉각 중` :
                  `💨 가스 안정화`
                }
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">공정 시간</div>
            <div className="text-2xl font-bold text-green-800">{currentTime.toFixed(1)}s</div>
            {isRunning && (
              <div className="text-xs text-green-600 mt-1">
                {processStage === 'Gas Stabilization' ? `안정화 ${(10-currentTime).toFixed(0)}s 남음` :
                 processStage === 'Rapid Ramp Up' ? `승온 진행중...` :
                 processStage === 'Process Hold' ? `유지 중` : `냉각 중`}
              </div>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">공정 단계</div>
            <div className="text-lg font-bold text-purple-800">{processStage}</div>
            {isRunning && processStage === 'Rapid Ramp Up' && (
              <div className="text-xs text-purple-600 mt-1">
                🚀 {rampRate}°C/s로 가열중
              </div>
            )}
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">온도 차이</div>
            <div className="text-lg font-bold text-orange-800">
              {isRunning ? `${(targetTemp - currentTemp).toFixed(0)}°C` : '-'}
            </div>
            {isRunning && (
              <div className="text-xs text-orange-600 mt-1">
                목표온도까지 잔여
              </div>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Zone 편차</div>
            <div className="text-lg font-bold text-purple-800">
              {isRunning ? `±${Math.max(...zoneTemps.map((temp, idx) => Math.abs(temp - zoneSetpoints[idx]))).toFixed(1)}°C` : '-'}
            </div>
            {isRunning && (
              <div className="text-xs text-purple-600 mt-1">
                최대 설정편차
              </div>
            )}
          </div>

          <div className={`p-4 rounded-lg ${status.status === 'danger' ? 'bg-red-50' : status.status === 'warning' ? 'bg-yellow-50' : 'bg-green-50'}`}>
            <div className="flex items-center space-x-2">
              <StatusIcon className={`h-5 w-5 ${status.status === 'danger' ? 'text-red-500' : status.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`} />
              <div className="text-sm font-medium">{status.msg}</div>
            </div>
            <div className="text-sm mt-1">웨이퍼 스트레스: {waferStress.toFixed(1)}%</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Control Panel */}
          <div className="bg-gray-50 p-4 rounded-lg lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              공정 제어
            </h2>

            {/* Quick Recipes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quick Recipes</label>
              <select
                onChange={(e) => e.target.value && loadApplication(e.target.value)}
                className="w-full p-2 border rounded-lg"
                value={selectedRecipe}
              >
                <option value="">레시피 선택...</option>
                <option value="dopant_activation">도펀트 활성화</option>
                <option value="silicide_formation">실리사이드 형성</option>
                <option value="implant_anneal">이온주입 어닐링</option>
                <option value="thermal_oxidation">열 산화</option>
                <option value="spike_anneal">스파이크 어닐링</option>
              </select>
              {selectedRecipe && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  📝 선택된 레시피: {selectedRecipe.replace('_', ' ')}
                </div>
              )}
            </div>

            {/* Parameter Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">목표 온도 (°C)</label>
                <input
                  type="number"
                  value={targetTemp}
                  onChange={(e) => setTargetTemp(Number(e.target.value))}
                  min="200"
                  max="1250"
                  className="w-full p-2 border rounded-lg"
                  disabled={isRunning}
                />
                <div className="text-xs text-gray-500 mt-1">범위: 200-1250°C</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">승온률 (°C/s)</label>
                <input
                  type="number"
                  value={rampRate}
                  onChange={(e) => setRampRate(Number(e.target.value))}
                  min="10"
                  max="400"
                  className="w-full p-2 border rounded-lg"
                  disabled={isRunning}
                />
                <div className="text-xs text-gray-500 mt-1">범위: 10-400°C/s</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">공정 시간 (s)</label>
                <input
                  type="number"
                  value={processTime}
                  onChange={(e) => setProcessTime(Number(e.target.value))}
                  min="1"
                  max="300"
                  className="w-full p-2 border rounded-lg"
                  disabled={isRunning}
                />
                <div className="text-xs text-gray-500 mt-1">범위: 1-300s</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">분위기 가스</label>
                <select
                  value={gasFlow}
                  onChange={(e) => setGasFlow(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  disabled={isRunning}
                >
                  <option value="N2">질소 (N₂)</option>
                  <option value="Ar">아르곤 (Ar)</option>
                  <option value="O2">산소 (O₂)</option>
                  <option value="H2">수소 (H₂)</option>
                  <option value="Vacuum">진공</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">압력 (mTorr)</label>
                <input
                  type="number"
                  value={pressure}
                  onChange={(e) => setPressure(Number(e.target.value))}
                  min="1"
                  max="760000"
                  className="w-full p-2 border rounded-lg"
                  disabled={isRunning}
                />
                <div className="text-xs text-gray-500 mt-1">1 mTorr - 760 Torr</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-2 mt-6">
              {!isRunning ? (
                <button
                  onClick={startProcess}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-green-600"
                >
                  <Play className="h-4 w-4 mr-1" />
                  시작
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseProcess}
                    className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-yellow-600"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    {isPaused ? '재개' : '일시정지'}
                  </button>
                  <button
                    onClick={stopProcess}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-red-600"
                  >
                    <Square className="h-4 w-4 mr-1" />
                    정지
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Equipment Diagram - 크게 */}
          <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
            <h2 className="text-xl font-semibold mb-3">장비 구성도</h2>
            <div className="border rounded-lg bg-white p-4">
              <svg width="100%" height="500" viewBox="0 0 750 320" style={{ backgroundColor: 'white' }}>

                    {/* Main outer frame with rounded corners */}
                    <rect x="20" y="20" width="710" height="280" rx="15" ry="15" fill="none" stroke="black" strokeWidth="4" />

                    {/* Top row of lamps (13 lamps) - with power-based colors */}
                    {(() => {
                      const topLampPositions = [
                        { cx: 105, zone: 5, label: 'Z6' },
                        { cx: 150, zone: 5, label: 'Z6' },
                        { cx: 195, zone: 3, label: 'Z4' },
                        { cx: 240, zone: 2, label: 'Z3' },
                        { cx: 285, zone: 1, label: 'Z2' },
                        { cx: 330, zone: 0, label: 'Z1' },
                        { cx: 375, zone: 0, label: 'Z1' },
                        { cx: 420, zone: 0, label: 'Z1' },
                        { cx: 465, zone: 1, label: 'Z2' },
                        { cx: 510, zone: 2, label: 'Z3' },
                        { cx: 555, zone: 3, label: 'Z4' },
                        { cx: 600, zone: 4, label: 'Z5' },
                        { cx: 645, zone: 4, label: 'Z5' }
                      ];

                      return topLampPositions.map((lamp, idx) => {
                        const intensity = lampPower[lamp.zone] / 100;
                        const power = lampPower[lamp.zone];

                        let lampColor = '#666';
                        let glowColor = 'rgba(255, 255, 255, 0)';
                        let textColor = '#333';

                        if (intensity > 0) {
                          if (power <= 20) {
                            lampColor = `rgb(${120 + power * 2}, ${60 + power * 1}, 0)`;
                            glowColor = `rgba(255, 100, 0, ${0.3 + intensity * 0.4})`;
                            textColor = '#FFaa00';
                          } else if (power <= 40) {
                            lampColor = `rgb(${160 + power * 1.5}, ${80 + power * 1.5}, 0)`;
                            glowColor = `rgba(255, 120, 0, ${0.4 + intensity * 0.4})`;
                            textColor = '#FF8800';
                          } else if (power <= 60) {
                            lampColor = `rgb(${180 + power * 1.25}, ${60 + power * 1}, 0)`;
                            glowColor = `rgba(255, 140, 0, ${0.5 + intensity * 0.4})`;
                            textColor = '#FF6600';
                          } else if (power <= 80) {
                            lampColor = `rgb(${200 + power * 0.7}, ${40 + power * 0.5}, 0)`;
                            glowColor = `rgba(255, 160, 20, ${0.6 + intensity * 0.4})`;
                            textColor = '#FF4400';
                          } else {
                            lampColor = `rgb(${220 + power * 0.35}, ${20 + power * 0.3}, ${(power - 80) * 2})`;
                            glowColor = `rgba(255, 180, 40, ${0.7 + intensity * 0.3})`;
                            textColor = '#FF2200';
                          }
                        }

                        return (
                          <g key={`top-${idx}`}>
                            {intensity > 0 && (
                              <circle cx={lamp.cx} cy="66" r="20" fill={glowColor} />
                            )}
                            {intensity > 0.6 && (
                              <circle cx={lamp.cx} cy="66" r="17" fill={`rgba(255, ${200 - power}, ${100 - power}, ${0.4 + intensity * 0.3})`} />
                            )}
                            <circle cx={lamp.cx} cy="66" r="15" fill={lampColor} stroke="black" strokeWidth="2" />
                            <text x={lamp.cx} y="94" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="bold" fill="black">{lamp.label}</text>
                          </g>
                        );
                      });
                    })()}

                    {/* Central process chamber */}
                    <rect x="80" y="106" width="590" height="80" rx="8" ry="8" fill="#F8F9FA" stroke="black" strokeWidth="2" />
                    <rect x="90" y="116" width="570" height="60" rx="5" ry="5" fill="none" stroke="black" strokeWidth="2" />

                    {/* Wafer with temperature color */}
                    {(() => {
                      const waferTemp = (currentTemp - 25) / 1200;
                      const waferColor = `rgb(${Math.min(255, 100 + waferTemp * 155)}, ${Math.max(50, 200 - waferTemp * 150)}, ${Math.max(50, 200 - waferTemp * 150)})`;

                      return (
                        <>
                          <line x1="125" y1="146" x2="625" y2="146" stroke={waferColor} strokeWidth="8" />
                          {isRunning && (
                            <>
                              <rect x="350" y="135" width="50" height="22" rx="3" fill="rgba(0, 0, 0, 0.8)" />
                              <text x="375" y="150" textAnchor="middle" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="bold" fill="white">
                                {currentTemp.toFixed(0)}°C
                              </text>
                            </>
                          )}
                        </>
                      );
                    })()}

                    {/* IR Pyrometer */}
                    <line x1="625" y1="146" x2="660" y2="146" stroke="#FF6B35" strokeWidth="3" />
                    <rect x="660" y="140" width="15" height="12" fill="#666" stroke="black" strokeWidth="1" />
                    <text x="680" y="150" fontSize="8" fontFamily="Arial, sans-serif" fill="#FF6B35" fontWeight="bold">
                      IR: {isRunning ? `${pyrometer.toFixed(0)}°C` : 'OFF'}
                    </text>

                    {/* Bottom lamps */}
                    {(() => {
                      const bottomLampPositions = [
                        { cx: 105, zone: 5, label: 'Z6' },
                        { cx: 150, zone: 5, label: 'Z6' },
                        { cx: 195, zone: 3, label: 'Z4' },
                        { cx: 240, zone: 2, label: 'Z3' },
                        { cx: 285, zone: 1, label: 'Z2' },
                        { cx: 330, zone: 0, label: 'Z1' },
                        { cx: 375, zone: 0, label: 'Z1' },
                        { cx: 420, zone: 0, label: 'Z1' },
                        { cx: 465, zone: 1, label: 'Z2' },
                        { cx: 510, zone: 2, label: 'Z3' },
                        { cx: 555, zone: 3, label: 'Z4' },
                        { cx: 600, zone: 4, label: 'Z5' },
                        { cx: 645, zone: 4, label: 'Z5' }
                      ];

                      return bottomLampPositions.map((lamp, idx) => {
                        const intensity = lampPower[lamp.zone] / 100;
                        const power = lampPower[lamp.zone];

                        let lampColor = '#666';
                        let glowColor = 'rgba(255, 255, 255, 0)';

                        if (intensity > 0) {
                          if (power <= 20) {
                            lampColor = `rgb(${120 + power * 2}, ${60 + power * 1}, 0)`;
                            glowColor = `rgba(255, 100, 0, ${0.3 + intensity * 0.4})`;
                          } else if (power <= 40) {
                            lampColor = `rgb(${160 + power * 1.5}, ${80 + power * 1.5}, 0)`;
                            glowColor = `rgba(255, 120, 0, ${0.4 + intensity * 0.4})`;
                          } else if (power <= 60) {
                            lampColor = `rgb(${180 + power * 1.25}, ${60 + power * 1}, 0)`;
                            glowColor = `rgba(255, 140, 0, ${0.5 + intensity * 0.4})`;
                          } else if (power <= 80) {
                            lampColor = `rgb(${200 + power * 0.7}, ${40 + power * 0.5}, 0)`;
                            glowColor = `rgba(255, 160, 20, ${0.6 + intensity * 0.4})`;
                          } else {
                            lampColor = `rgb(${220 + power * 0.35}, ${20 + power * 0.3}, ${(power - 80) * 2})`;
                            glowColor = `rgba(255, 180, 40, ${0.7 + intensity * 0.3})`;
                          }
                        }

                        return (
                          <g key={`bottom-${idx}`}>
                            {intensity > 0 && (
                              <circle cx={lamp.cx} cy="246" r="20" fill={glowColor} />
                            )}
                            {intensity > 0.6 && (
                              <circle cx={lamp.cx} cy="246" r="17" fill={`rgba(255, ${200 - power}, ${100 - power}, ${0.4 + intensity * 0.3})`} />
                            )}
                            <circle cx={lamp.cx} cy="246" r="15" fill={lampColor} stroke="black" strokeWidth="2" />
                            <text x={lamp.cx} y="274" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="bold" fill="black">{lamp.label}</text>
                            {isRunning && intensity > 0 && (
                              <text x={lamp.cx} y="220" textAnchor="middle" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="bold" fill="black">
                                {power.toFixed(0)}%
                              </text>
                            )}
                          </g>
                        );
                      });
                    })()}

                    {/* Process stage indicator */}
                    {isRunning && (
                      <text x="375" y="40" textAnchor="middle" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="bold"
                            fill={processStage === 'Rapid Ramp Up' ? '#FF8800' :
                                 processStage === 'Process Hold' ? '#FF4444' :
                                 processStage === 'Cool Down' ? '#4A90E2' : '#10B981'}>
                        {processStage}
                      </text>
                    )}

                    {/* Legend */}
                    <text x="40" y="50" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="bold" fill="black">Upper Halogen Lamps</text>
                    <text x="40" y="290" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="bold" fill="black">Lower Halogen Lamps</text>

                  </svg>
                </div>
          </div>

          {/* Real-time Process Log */}
          <div className="bg-gray-50 p-4 rounded-lg lg:col-span-1">
            <h2 className="text-xl font-semibold mb-3">실시간 공정 로그</h2>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs h-[450px] overflow-y-auto">
                  {processLog.length === 0 ? (
                    <div className="text-gray-500">
                      <div className="animate-pulse">RTA 시뮬레이터 준비완료...</div>
                      <div className="mt-1 text-xs">공정을 시작하면 실시간 로그가 표시됩니다</div>
                    </div>
                  ) : (
                    processLog.slice(-15).map((log, idx) => (
                      <div key={idx} className="mb-1 flex items-start">
                        <span className="text-gray-500 text-xs mr-2 mt-0.5 flex-shrink-0">
                          [{new Date().toLocaleTimeString()}]
                        </span>
                        <span className="flex-1">{log}</span>
                      </div>
                    ))
                  )}
                  {isRunning && (
                    <div className="mt-2 text-yellow-400 animate-pulse">
                      ▶ 공정 실행 중... ({processStage})
                    </div>
                  )}
                </div>
          </div>
        </div>

        {/* 하단: 온도 프로파일과 Zone 모니터 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* Temperature Profile Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">실시간 온도 프로파일</h2>
          <div className="h-[576px] relative">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#EF4444', stopOpacity: 0.8}} />
                  <stop offset="50%" style={{stopColor: '#F59E0B', stopOpacity: 0.8}} />
                  <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 0.8}} />
                </linearGradient>
              </defs>

              {/* Background Grid */}
              <g stroke="#E5E7EB" strokeWidth="1">
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <line key={`h${i}`} x1="40" y1={54 + i * 63} x2="472" y2={54 + i * 63} />
                ))}
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <line key={`v${i}`} x1={40 + i * 72} y1="54" x2={40 + i * 72} y2="432" />
                ))}
              </g>

              {(() => {
                const gasStabilizationTime = 10;
                const totalRampTime = (targetTemp - 25) / rampRate;
                const rampDownTime = (targetTemp - 25) / (rampRate * 0.3);
                const totalTime = gasStabilizationTime + totalRampTime + processTime + rampDownTime;

                const theoreticalProfile = [];
                const steps = 200;
                for (let i = 0; i <= steps; i++) {
                  const time = (i / steps) * totalTime;
                  const temp = calculateTempProfile(time);
                  theoreticalProfile.push({
                    time: time,
                    temp: temp,
                    x: 40 + (time / totalTime) * 432,
                    y: 432 - ((temp - 25) / (Math.max(targetTemp, 1000) - 25 + 100)) * 378
                  });
                }

                return (
                  <>
                    {/* Phase backgrounds */}
                    <rect x="40" y="54" width={(gasStabilizationTime / totalTime) * 432} height="378" fill="rgba(34, 197, 94, 0.1)" />
                    <rect x={40 + (gasStabilizationTime / totalTime) * 432} y="54" width={(totalRampTime / totalTime) * 432} height="378" fill="rgba(239, 68, 68, 0.1)" />
                    <rect x={40 + ((gasStabilizationTime + totalRampTime) / totalTime) * 432} y="54" width={(processTime / totalTime) * 432} height="378" fill="rgba(245, 158, 11, 0.1)" />
                    <rect x={40 + ((gasStabilizationTime + totalRampTime + processTime) / totalTime) * 432} y="54" width={(rampDownTime / totalTime) * 432} height="378" fill="rgba(59, 130, 246, 0.1)" />

                    {/* Theoretical profile */}
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      strokeLinecap="round"
                      points={theoreticalProfile.map(point => `${point.x},${point.y}`).join(' ')}
                    />

                    {/* Actual temperature */}
                    {tempHistory.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="url(#tempGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        points={tempHistory.map((point) => {
                          const x = 40 + (point.time / totalTime) * 432;
                          const y = 432 - ((point.temp - 25) / (Math.max(targetTemp, 1000) - 25 + 100)) * 378;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    )}

                    {/* Target line */}
                    <line
                      x1="40"
                      y1={432 - ((targetTemp - 25) / (Math.max(targetTemp, 1000) - 25 + 100)) * 378}
                      x2="472"
                      y2={432 - ((targetTemp - 25) / (Math.max(targetTemp, 1000) - 25 + 100)) * 378}
                      stroke="#6B7280"
                      strokeWidth="1"
                      strokeDasharray="8,4"
                    />

                    {/* Current position */}
                    {isRunning && tempHistory.length > 0 && (
                      <>
                        <line
                          x1={40 + (currentTime / totalTime) * 432}
                          y1="54"
                          x2={40 + (currentTime / totalTime) * 432}
                          y2="432"
                          stroke="#FF0000"
                          strokeWidth="2"
                          strokeDasharray="2,2"
                        />
                        <circle
                          cx={40 + (currentTime / totalTime) * 432}
                          cy={432 - ((currentTemp - 25) / (Math.max(targetTemp, 1000) - 25 + 100)) * 378}
                          r="5"
                          fill="#EF4444"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      </>
                    )}

                    {/* Phase labels */}
                    <text x={40 + (gasStabilizationTime / totalTime) * 432 / 2} y="45" fontSize="8" textAnchor="middle" fill="#059669">Gas Stab</text>
                    <text x={40 + (gasStabilizationTime / totalTime) * 432 + (totalRampTime / totalTime) * 432 / 2} y="45" fontSize="8" textAnchor="middle" fill="#DC2626">Ramp</text>
                    <text x={40 + ((gasStabilizationTime + totalRampTime) / totalTime) * 432 + (processTime / totalTime) * 432 / 2} y="45" fontSize="8" textAnchor="middle" fill="#D97706">Hold</text>
                    <text x={40 + ((gasStabilizationTime + totalRampTime + processTime) / totalTime) * 432 + (rampDownTime / totalTime) * 432 / 2} y="45" fontSize="8" textAnchor="middle" fill="#2563EB">Cool</text>

                    {/* Axis labels */}
                    <text x="40" y="468" fontSize="10" textAnchor="middle" fill="#6B7280">0s</text>
                    <text x="256" y="468" fontSize="10" textAnchor="middle" fill="#6B7280">{(totalTime/2).toFixed(0)}s</text>
                    <text x="472" y="468" fontSize="10" textAnchor="middle" fill="#6B7280">{totalTime.toFixed(0)}s</text>
                  </>
                );
              })()}

              {/* Y-axis */}
              <text x="35" y="63" fontSize="10" textAnchor="end" fill="#6B7280">{Math.max(targetTemp, 1000) + 75}°C</text>
              <text x="35" y="189" fontSize="10" textAnchor="end" fill="#6B7280">{Math.round((Math.max(targetTemp, 1000) + 75) * 0.66)}°C</text>
              <text x="35" y="315" fontSize="10" textAnchor="end" fill="#6B7280">{Math.round((Math.max(targetTemp, 1000) + 75) * 0.33)}°C</text>
              <text x="35" y="441" fontSize="10" textAnchor="end" fill="#6B7280">25°C</text>
            </svg>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-green-500 mr-2" style={{borderStyle: 'dashed'}}></div>
              <span>예상 프로파일</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-red-500 mr-2"></div>
              <span>실제 온도</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span>현재 위치</span>
            </div>
          </div>
          </div>

          {/* Zone Temperature Monitor */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">🌡️ Zone별 온도 모니터</h2>
            <div className="bg-black p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-sm">
                {zoneTemps.map((temp, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-600 rounded p-2">
                    <div className="text-green-400 font-mono text-center text-lg font-bold">Z{idx + 1}</div>
                    <div className="text-center mt-2">
                      <div className="text-xs text-gray-400">설정온도</div>
                      <div className="text-yellow-400 font-bold">{zoneSetpoints[idx].toFixed(0)}°C</div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-xs text-gray-400">실제온도</div>
                      <div className={`font-bold text-lg ${
                        Math.abs(temp - zoneSetpoints[idx]) > 5 ? 'text-red-400' :
                        Math.abs(temp - zoneSetpoints[idx]) > 2 ? 'text-orange-400' :
                        'text-green-400'
                      }`}>
                        {temp.toFixed(0)}°C
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-xs text-gray-400">램프파워</div>
                      <span className={`text-sm font-bold ${
                        lampPower[idx] > 70 ? 'text-red-400' :
                        lampPower[idx] > 40 ? 'text-orange-400' :
                        'text-gray-500'
                      }`}>
                        {lampPower[idx].toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-400 text-center border-t border-gray-600 pt-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span>설정온도</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span>실제온도</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span>램프파워</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Information */}
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            RTA 공정 특성
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium text-blue-800 mb-2">📈 RTA 프로파일 특성</div>
              <div className="text-blue-700">
                • <strong>Gas 안정화</strong>: 25°C에서 가스 흐름 안정화<br/>
                • <strong>급속 승온</strong>: 100°C/s 이상 빠른 온도 상승<br/>
                • <strong>온도 유지</strong>: 목표온도에서 정확한 시간 제어<br/>
                • <strong>제어 냉각</strong>: 열충격 방지를 위한 점진적 냉각
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded">
              <div className="font-medium text-yellow-800 mb-2">⏱️ Zone별 열전달 지연</div>
              <div className="text-yellow-700">
                • <strong>중앙 Zone 1</strong>: 응답시간 0.5초 (가장 빠름)<br/>
                • <strong>가장자리 Zone 6</strong>: 응답시간 1.25초 (가장 느림)<br/>
                • <strong>온도 균일성</strong>: Zone별 차등 제어로 확보
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded">
              <div className="font-medium text-green-800 mb-2">🔧 장비 구성</div>
              <div className="text-green-700">
                • <strong>상하부 할로겐 램프</strong>: 6개 Zone 독립 제어<br/>
                • <strong>IR 파이로미터</strong>: 비접촉 실시간 온도 측정<br/>
                • <strong>쿼츠 윈도우</strong>: 균등한 열전달과 빠른 응답
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded">
              <div className="font-medium text-purple-800 mb-2">🎯 컨트롤 정밀도</div>
              <div className="text-purple-700">
                • <strong>급속 변화 구간</strong>: Ramp/Cool 시 실제값과 설정값 차이 발생 가능<br/>
                • <strong>장비 특성 반영</strong>: 챔버 열용량과 램프 응답성에 따른 지연<br/>
                • <strong>튜닝 포인트</strong>: 초벌/양산 시 장비 최적화의 핵심 지표
              </div>
            </div>

            <div className="bg-red-50 p-3 rounded">
              <div className="font-medium text-red-800 mb-2">⚠️ 실제 공정 영향</div>
              <div className="text-red-700">
                • <strong>Hold 구간 중요성</strong>: 온도 유지 불안정 시 도핑 프로파일 변화<br/>
                • <strong>소자 특성 영향</strong>: 오버슈트/드리프트는 전기적 특성에 직접 영향<br/>
                • <strong>현재 시뮬레이션</strong>: Hold 구간에서 약간의 온도 변동 재현
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded">
              <div className="font-medium text-indigo-800 mb-2">📊 데이터 신뢰도</div>
              <div className="text-indigo-700">
                • <strong>오차 패턴 분석</strong>: 예상값 vs 실제값 차이의 주기적 경향 파악<br/>
                • <strong>설비 보정</strong>: 반복되는 오차 패턴으로 장비 캘리브레이션<br/>
                • <strong>공정 개선</strong>: 데이터 기반 레시피 최적화 가능
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTASimulator;
