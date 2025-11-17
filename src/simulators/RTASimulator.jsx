import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Settings, Info, AlertTriangle, CheckCircle } from 'lucide-react';

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
  const canvasRef = useRef(null);

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
    const timeConstants = [2.0, 3.0, 3.0, 4.0, 4.0, 5.0];

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
            setIsPaused(false);
            setProcessStage('Complete');
            setLampPower([0, 0, 0, 0, 0, 0]);
            setProcessLog(prev => [...prev, `✅ 공정 완료! 총 시간: ${newTime.toFixed(1)}초`, '🔄 시뮬레이터 초기화됨']);
            setTimeout(() => {
              setCurrentTime(0);
              setCurrentTemp(25);
              setTempHistory([]);
              setProcessStage('Ready');
              setZoneTemps([25, 25, 25, 25, 25, 25]);
              setZoneSetpoints([25, 25, 25, 25, 25, 25]);
              setPyrometer(25);
              setWaferStress(0);
            }, 2000);
            return newTime;
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
    setIsRunning(true);
    setIsPaused(false);
    setZoneTemps([25, 25, 25, 25, 25, 25]);
    setZoneSetpoints([25, 25, 25, 25, 25, 25]);
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
              <status.icon className={`h-5 w-5 ${status.status === 'danger' ? 'text-red-500' : status.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`} />
              <div className="text-sm font-medium">{status.msg}</div>
            </div>
            <div className="text-sm mt-1">웨이퍼 스트레스: {waferStress.toFixed(1)}%</div>
          </div>
        </div>

        {/* Rest of the component continues... */}
        <div className="text-center py-20 text-gray-500">
          <p>RTA 시뮬레이터 UI - 전체 구현 필요</p>
          <p className="text-sm mt-2">제어 패널, 장비 다이어그램, 온도 프로파일 차트 등</p>
        </div>
      </div>
    </div>
  );
};

export default RTASimulator;
