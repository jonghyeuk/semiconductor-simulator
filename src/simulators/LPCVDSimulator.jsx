import React, { useState, useEffect, useRef, useCallback } from 'react';

// CSS styles for animations
const styles = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  .value-changing {
    animation: pulse 0.5s ease-in-out;
  }

  .alert-slide-in {
    animation: slideIn 0.3s ease-out;
  }
`;

const LPCVDSimulator = () => {
  // State variables
  const [currentMode, setCurrentMode] = useState('SiO2');
  const [isRunning, setIsRunning] = useState(false);
  const [depositionThickness, setDepositionThickness] = useState(0);
  const [molecules, setMolecules] = useState([]);
  const [valuesChanged, setValuesChanged] = useState(false);
  const [gases, setGases] = useState({
    SiH4: { on: false, flow: 100 },
    O2: { on: false, flow: 200 },
    NH3: { on: false, flow: 200 },
    SiH2Cl2: { on: false, flow: 80 },
    H2: { on: false, flow: 300 },
    N2: { on: false, flow: 500 }
  });
  const [zones, setZones] = useState([
    { id: 1, on: false, target: 400, current: 25 },
    { id: 2, on: false, target: 450, current: 25 },
    { id: 3, on: false, target: 480, current: 25 },
    { id: 4, on: false, target: 500, current: 25 }
  ]);
  const [species, setSpecies] = useState({
    'SiH₄': 0, 'Si': 0, 'O₂': 0, 'SiO₂': 0,
    'NH₃': 0, 'Si₃N₄': 0
  });
  const [processResults, setProcessResults] = useState({
    refractiveIndex: 1.46,
    density: 2.2,
    stressLevel: 0,
    stress: 0,
    siNRatio: 0.75,
    conductivity: 0,
    grainSize: 0,
    crystallinity: 0,
    uniformity: 100
  });
  const [processAlert, setProcessAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const animationRef = useRef(null);

  const modes = {
    SiO2: {
      name: 'SiO₂',
      temps: [400, 450, 480, 500],
      gases: ['SiH4', 'O2', 'N2'],
      color: '#3498db',
      guide: {
        title: 'SiO₂ 증착 실험',
        objective: 'O₂/SiH₄ 비율에 따른 박막 특성 변화 관찰',
        instructions: [
          '1. O₂ 유량을 변경하며 굴절률(Refractive Index) 변화 확인',
          '2. 최적 비율: O₂/SiH₄ = 2:1 ~ 4:1',
          '3. 산소 과다 → 화학양론 SiO₂, 낮은 굴절률 (n≈1.46)',
          '4. 산소 부족 → Si-rich, 높은 굴절률 (n≈1.7~2.0)'
        ],
        warning: '⚠️ 온도 불균일 시 두께 편차 발생 (±5%)'
      },
      properties: ['refractiveIndex', 'density', 'stressLevel']
    },
    SiN: {
      name: 'Si₃N₄',
      temps: [700, 730, 750, 780],
      gases: ['SiH2Cl2', 'NH3', 'N2'],
      color: '#e74c3c',
      guide: {
        title: 'Si₃N₄ 증착 실험',
        objective: 'NH₃/SiH₂Cl₂ 비율에 따른 스트레스 제어',
        instructions: [
          '1. NH₃ 유량 조절로 Si/N 비율 제어',
          '2. 최적 비율: NH₃/SiH₂Cl₂ ≈ 5:1',
          '3. 암모니아 과다 → 인장 응력 증가',
          '4. 암모니아 부족 → 압축 응력, Si 과잉'
        ],
        warning: '⚠️ 고온 공정: Zone간 ±20°C 편차 주의'
      },
      properties: ['stress', 'siNRatio', 'density']
    },
    PolySi: {
      name: 'Poly-Si',
      temps: [580, 610, 630, 650],
      gases: ['SiH4', 'H2', 'N2'],
      color: '#9b59b6',
      guide: {
        title: 'Poly-Si 증착 실험',
        objective: '온도에 따른 결정화도 및 전도도 제어',
        instructions: [
          '1. 증착 온도가 결정 크기 결정 (580-650°C)',
          '2. H₂ 첨가로 비정질→다결정 전환 촉진',
          '3. 고온(>620°C) → 큰 결정립, 높은 전도도',
          '4. 저온(<600°C) → 작은 결정립, 낮은 전도도'
        ],
        warning: '⚠️ 온도 균일도가 전도도에 직접 영향'
      },
      properties: ['conductivity', 'grainSize', 'crystallinity']
    }
  };

  const labels = {
    refractiveIndex: '굴절률 (n)',
    density: '밀도 (g/cm³)',
    stressLevel: '응력 레벨',
    stress: '응력 (MPa)',
    siNRatio: 'Si/N 비율',
    conductivity: '전도도 (S/cm)',
    grainSize: '결정립 크기 (nm)',
    crystallinity: '결정화도 (%)',
    uniformity: '균일도 (%)'
  };

  const showProcessAlertMsg = useCallback((message) => {
    setProcessAlert(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }, []);

  // Trigger value-changing animation
  const triggerValueChange = useCallback(() => {
    setValuesChanged(true);
    setTimeout(() => setValuesChanged(false), 500);
  }, []);

  const updateProcessResults = useCallback(() => {
    let changed = false;

    setProcessResults(prev => {
      const newResults = { ...prev };

      // SiO2 mode
      if (currentMode === 'SiO2' && gases.SiH4 && gases.O2) {
        const o2Ratio = gases.O2.flow / Math.max(gases.SiH4.flow, 1);
        let newRI;
        if (o2Ratio >= 2) {
          newRI = 1.46 + (o2Ratio - 2) * 0.01;
        } else {
          newRI = 1.46 + (2 - o2Ratio) * 0.2;
        }
        const calcRI = Math.min(2.0, Math.max(1.46, newRI));
        if (Math.abs(calcRI - prev.refractiveIndex) > 0.001) changed = true;
        newResults.refractiveIndex = calcRI;
        newResults.density = 2.2 + Math.min(o2Ratio / 10, 0.1);

        if (!gases.SiH4.on) {
          newResults.refractiveIndex = 0;
          newResults.stressLevel = 0;
        } else if (!gases.O2.on) {
          newResults.refractiveIndex = 3.5;
          newResults.stressLevel = 100;
        }
      }

      // SiN mode
      if (currentMode === 'SiN' && gases.SiH2Cl2 && gases.NH3) {
        const nh3Ratio = gases.NH3.flow / Math.max(gases.SiH2Cl2.flow, 1);
        const newStress = (nh3Ratio - 5) * 50;
        if (Math.abs(newStress - prev.stress) > 5) changed = true;
        newResults.stress = newStress;
        newResults.siNRatio = Math.max(0.5, Math.min(1.0, 0.75 - (nh3Ratio - 5) * 0.05));

        if (nh3Ratio < 3) {
          newResults.siNRatio = 0.9;
          newResults.density = 2.5;
        }

        if (!gases.SiH2Cl2.on || !gases.NH3.on) {
          newResults.stress = 200;
        }
      }

      // PolySi mode
      if (currentMode === 'PolySi') {
        const avgTemp = zones.reduce((s, z) => s + z.current, 0) / 4;
        const newConductivity = Math.max(0, (avgTemp - 580) / 100);
        if (Math.abs(newConductivity - prev.conductivity) > 0.1) changed = true;
        newResults.conductivity = newConductivity;
        newResults.grainSize = Math.max(0, (avgTemp - 580) * 2);
        newResults.crystallinity = Math.min(100, Math.max(0, (avgTemp - 580) / 0.7));

        if (gases.H2 && gases.H2.flow < 150) {
          newResults.crystallinity *= 0.7;
          newResults.conductivity *= 0.6;
        }

        if (!gases.SiH4.on) {
          newResults.conductivity = 0;
          newResults.crystallinity = 0;
        }
      }

      // Uniformity calculation
      const activeZones = zones.filter(z => z.on);
      if (activeZones.length > 0) {
        const zoneDiff = Math.max(...activeZones.map(z => Math.abs(z.current - z.target)));
        const tempRange = Math.max(...activeZones.map(z => z.current)) -
                        Math.min(...activeZones.map(z => z.current));
        const newUniformity = Math.max(85, 100 - zoneDiff / 5 - tempRange / 10);
        if (Math.abs(newUniformity - prev.uniformity) > 1) changed = true;
        newResults.uniformity = newUniformity;
      } else {
        newResults.uniformity = 0;
      }

      if (activeZones.length < 4 && activeZones.length > 0) {
        newResults.uniformity *= 0.8;
      }

      return newResults;
    });

    if (changed) {
      triggerValueChange();
    }
  }, [currentMode, gases, zones, triggerValueChange]);

  const setMode = (mode) => {
    setCurrentMode(mode);
    const modeTemps = modes[mode].temps;
    setZones(prev => prev.map((zone, idx) => ({
      ...zone,
      target: modeTemps[idx]
    })));
    setDepositionThickness(0);
    setSpecies({
      'SiH₄': 0, 'Si': 0, 'O₂': 0, 'SiO₂': 0,
      'NH₃': 0, 'Si₃N₄': 0
    });
  };

  const toggleGas = (gasName) => {
    setGases(prev => ({
      ...prev,
      [gasName]: { ...prev[gasName], on: !prev[gasName].on }
    }));
    if (isRunning) {
      showProcessAlertMsg(`⚠️ ${gasName} ${!gases[gasName].on ? 'ON' : 'OFF'} - 공정 결과 변화 중`);
    }
  };

  const updateGasFlow = (gasName, value) => {
    const oldFlow = gases[gasName].flow;
    setGases(prev => ({
      ...prev,
      [gasName]: { ...prev[gasName], flow: parseFloat(value) }
    }));
    if (isRunning && Math.abs(oldFlow - parseFloat(value)) > 10) {
      showProcessAlertMsg(`📊 ${gasName} 유량 변경: ${value} sccm`);
    }
  };

  const toggleZone = (zoneId) => {
    setZones(prev => prev.map(z =>
      z.id === zoneId ? { ...z, on: !z.on } : z
    ));
    if (isRunning) {
      const zone = zones.find(z => z.id === zoneId);
      showProcessAlertMsg(`🔥 Zone ${zoneId} ${!zone.on ? 'ON' : 'OFF'} - 균일도 영향`);
    }
  };

  const toggleSimulation = () => {
    if (!isRunning) {
      // Turn on all zones and required gases
      setZones(prev => prev.map(z => ({ ...z, on: true })));
      const requiredGases = modes[currentMode].gases;
      setGases(prev => {
        const newGases = { ...prev };
        requiredGases.forEach(gasName => {
          if (newGases[gasName]) {
            newGases[gasName] = { ...newGases[gasName], on: true };
          }
        });
        return newGases;
      });
    }
    setIsRunning(!isRunning);
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      return;
    }

    animationRef.current = setInterval(() => {
      // Update zone temperatures
      setZones(prev => prev.map(zone => {
        if (zone.on) {
          const diff = zone.target - zone.current;
          return {
            ...zone,
            current: zone.current + (diff > 0 ? Math.min(5, diff) : Math.max(-5, diff))
          };
        }
        return zone;
      }));

      // Generate molecules
      const activeGases = Object.entries(gases).filter(([_, g]) => g.on);
      if (activeGases.length > 0 && Math.random() > 0.1) {
        const newMolecules = [];
        for (let i = 0; i < 5; i++) {
          newMolecules.push({
            id: Date.now() + Math.random(),
            x: 260 + Math.random() * 280,
            y: 55 + Math.random() * 50,
            vx: (Math.random() - 0.5) * 2,
            vy: 3 + Math.random() * 2,
            size: 1.5 + Math.random()
          });
        }
        setMolecules(prev => [...prev, ...newMolecules]);
      }

      // Move molecules
      setMolecules(prev => {
        return prev.map(mol => {
          let newX = mol.x + mol.vx;
          let newY = mol.y + mol.vy;
          let newVx = mol.vx;

          if (newX < 255 || newX > 545) {
            newVx = -mol.vx;
            newX = mol.x;
          }

          if (mol.y > 750) {
            const pumpX = 400;
            const dx = pumpX - mol.x;
            newVx = dx * 0.1;
          }

          return { ...mol, x: newX, y: newY, vx: newVx };
        }).filter(mol => {
          if (mol.y >= 860 && mol.x >= 350 && mol.x <= 450) {
            return false;
          }
          return mol.y < 890;
        });
      });

      // Deposition calculation
      setZones(currentZones => {
        const avgTemp = currentZones.reduce((s, z) => s + z.current, 0) / 4;
        const activeGasCount = Object.values(gases).filter(g => g.on).length;

        if (avgTemp > 300 && activeGasCount > 0) {
          const rate = (avgTemp - 300) / 100 * activeGasCount * 0.01;
          setDepositionThickness(prev => prev + rate);

          setSpecies(prev => {
            const newSpecies = { ...prev };
            if (currentMode === 'SiO2' && gases.SiH4.on && gases.O2.on) {
              newSpecies['SiO₂'] = Math.min(100, prev['SiO₂'] + rate * 2);
            } else if (currentMode === 'SiN' && gases.SiH2Cl2.on && gases.NH3.on) {
              newSpecies['Si₃N₄'] = Math.min(100, prev['Si₃N₄'] + rate * 2);
            } else if (currentMode === 'PolySi' && gases.SiH4.on) {
              newSpecies['Si'] = Math.min(100, prev['Si'] + rate * 2);
            }
            return newSpecies;
          });
        }

        return currentZones;
      });

      updateProcessResults();
    }, 50);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isRunning, gases, currentMode, updateProcessResults]);

  const getResultColor = (prop, value) => {
    if (prop === 'uniformity') {
      if (value >= 95) return '#00ff88';
      if (value >= 90) return '#ffd93d';
      return '#ff6b6b';
    }
    if (prop === 'stress') {
      if (Math.abs(value) < 50) return '#00ff88';
      if (Math.abs(value) < 100) return '#ffd93d';
      return '#ff6b6b';
    }
    if (prop === 'refractiveIndex') {
      const diff = Math.abs(value - 1.46);
      if (diff < 0.05) return '#00ff88';
      if (diff < 0.15) return '#ffd93d';
      return '#ff6b6b';
    }
    if (prop === 'siNRatio') {
      if (value > 0.72 && value < 0.78) return '#00ff88';
      if (value > 0.65 && value < 0.85) return '#ffd93d';
      return '#ff6b6b';
    }
    return '#00ff88';
  };

  const avgTemp = Math.round(zones.reduce((s, z) => s + z.current, 0) / 4);
  const modeGases = modes[currentMode].gases;
  const guide = modes[currentMode].guide;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      padding: '20px',
      minHeight: '100%'
    }}>
      {/* Inject CSS styles */}
      <style>{styles}</style>

      {/* Alert */}
      {showAlert && (
        <div className="alert-slide-in" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 107, 107, 0.95)',
          color: '#fff',
          padding: '15px 20px',
          borderRadius: '10px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          {processAlert}
        </div>
      )}

      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5em',
          color: '#00ff88',
          textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
          marginBottom: '30px'
        }}>
          🔬 LPCVD Interactive Simulator
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 320px',
          gap: '20px'
        }}>
          {/* Left Panel - Controls */}
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            border: '2px solid #4a5568',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '1.3em',
              color: '#00ff88',
              marginBottom: '20px',
              borderBottom: '2px solid #4a5568',
              paddingBottom: '10px'
            }}>
              ⚙️ Controls
            </div>

            <h3 style={{ color: '#a8dadc', marginBottom: '10px' }}>공정 모드</h3>
            {Object.entries(modes).map(([mode, config]) => (
              <button
                key={mode}
                onClick={() => setMode(mode)}
                style={{
                  width: '100%',
                  padding: '15px',
                  marginBottom: '10px',
                  border: '2px solid #4a5568',
                  borderRadius: '10px',
                  background: currentMode === mode ? '#00ff88' : '#2d3748',
                  color: currentMode === mode ? '#1a202c' : '#fff',
                  fontWeight: currentMode === mode ? 'bold' : 'normal',
                  fontSize: '1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {config.name} Deposition<br/>
                <small style={{ opacity: 0.8 }}>{config.temps[3]}°C</small>
              </button>
            ))}

            <h3 style={{ color: '#a8dadc', margin: '20px 0 10px' }}>가스 제어</h3>
            {Object.keys(gases)
              .filter(gas => modeGases.includes(gas))
              .map(gas => (
                <div key={gas} style={{
                  background: 'rgba(45, 55, 72, 0.8)',
                  padding: '12px',
                  marginBottom: '12px',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <strong>{gas}</strong>
                    <button
                      onClick={() => toggleGas(gas)}
                      style={{
                        padding: '6px 16px',
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9em',
                        background: gases[gas].on ? '#00ff88' : '#e53e3e',
                        color: gases[gas].on ? '#1a202c' : '#fff'
                      }}
                    >
                      {gases[gas].on ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontSize: '0.85em', color: '#a0aec0' }}>
                      Flow: {gases[gas].flow} sccm
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={gases[gas].flow}
                      onChange={(e) => updateGasFlow(gas, e.target.value)}
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: '#4a5568',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              ))}

            <h3 style={{ color: '#a8dadc', margin: '20px 0 10px' }}>히팅 존</h3>
            {zones.map(zone => (
              <div
                key={zone.id}
                style={{
                  background: 'rgba(45, 55, 72, 0.8)',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${['#ff6b6b', '#ff8c42', '#ffa726', '#ffd93d'][zone.id - 1]}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Zone {zone.id}</span>
                  <button
                    onClick={() => toggleZone(zone.id)}
                    style={{
                      padding: '6px 16px',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9em',
                      background: zone.on ? '#00ff88' : '#e53e3e',
                      color: zone.on ? '#1a202c' : '#fff'
                    }}
                  >
                    {zone.on ? 'ON' : 'OFF'}
                  </button>
                </div>
                <div style={{ marginTop: '5px', fontFamily: 'monospace', fontSize: '1.1em' }}>
                  {Math.round(zone.current)}°C / {zone.target}°C
                </div>
              </div>
            ))}

            <button
              onClick={toggleSimulation}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '1.2em',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                marginTop: '20px',
                background: isRunning ? '#e53e3e' : '#00ff88',
                color: isRunning ? '#fff' : '#1a202c'
              }}
            >
              {isRunning ? '⏸️ STOP PROCESS' : '▶️ START PROCESS'}
            </button>
          </div>

          {/* Center Panel - Chamber View */}
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            border: '2px solid #4a5568',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '1.3em',
              color: '#00ff88',
              marginBottom: '20px',
              borderBottom: '2px solid #4a5568',
              paddingBottom: '10px'
            }}>
              🔬 Chamber View
            </div>
            <svg viewBox="0 0 800 900" style={{
              width: '100%',
              height: '800px',
              background: 'rgba(26, 32, 44, 0.5)',
              borderRadius: '15px'
            }}>
              <defs>
                <filter id="lampGlow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Heating lamps */}
              {zones.map((zone, idx) => {
                const yPos = 120 + idx * 180;
                const lampColor = zone.on
                  ? `rgba(255, ${100 - zone.current/10}, 0, ${zone.current / zone.target})`
                  : '#4a4a4a';

                return (
                  <g key={zone.id}>
                    {/* Left lamp */}
                    <rect
                      x="180" y={yPos} width="50" height="140" rx="25"
                      fill={lampColor} stroke="#2d3748" strokeWidth="2"
                      filter={zone.on ? 'url(#lampGlow)' : 'none'}
                    />
                    <text
                      x="205" y={yPos + 75} textAnchor="middle"
                      fontSize="14" fontWeight="bold" fill="#fff"
                    >
                      {Math.round(zone.current)}°C
                    </text>

                    {/* Right lamp */}
                    <rect
                      x="570" y={yPos} width="50" height="140" rx="25"
                      fill={lampColor} stroke="#2d3748" strokeWidth="2"
                      filter={zone.on ? 'url(#lampGlow)' : 'none'}
                    />
                    <text
                      x="595" y={yPos + 75} textAnchor="middle"
                      fontSize="12" fontWeight="bold" fill="#fff"
                    >
                      Z{zone.id}
                    </text>
                  </g>
                );
              })}

              {/* Quartz tube */}
              <rect
                x="250" y="50" width="300" height="800"
                fill="rgba(232, 244, 248, 0.2)"
                stroke="#a0d8ef" strokeWidth="3" rx="20"
              />

              {/* Wafer boat rods */}
              <rect x="340" y="100" width="8" height="750" fill="#708090" rx="4" />
              <rect x="452" y="100" width="8" height="750" fill="#708090" rx="4" />

              {/* Wafers */}
              {Array.from({ length: 17 }, (_, idx) => {
                const y = 120 + idx * 38;
                const filmThickness = Math.min(depositionThickness / 5, 8);
                const filmOpacity = Math.min(depositionThickness / 100, 0.9);

                return (
                  <g key={idx}>
                    <ellipse
                      cx="400" cy={y} rx="80" ry="3"
                      fill="#3498db" stroke="#2874a6" strokeWidth="1"
                    />
                    {depositionThickness > 0 && (
                      <>
                        <ellipse
                          cx="400" cy={y - filmThickness / 2 - 1}
                          rx="80" ry={filmThickness}
                          fill={modes[currentMode].color}
                          opacity={filmOpacity}
                          stroke={modes[currentMode].color}
                          strokeWidth="0.5"
                        />
                        <ellipse
                          cx="400" cy={y - filmThickness - 1}
                          rx="78" ry={Math.max(filmThickness * 0.3, 1)}
                          fill="rgba(255, 255, 255, 0.3)"
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Gas molecules */}
              {molecules.map(mol => (
                <circle
                  key={mol.id}
                  cx={mol.x} cy={mol.y} r={mol.size || 2}
                  fill={modes[currentMode].color} opacity="0.6"
                />
              ))}

              {/* Gas inlet */}
              <rect x="350" y="20" width="100" height="30" fill="#65737e" rx="5" />
              <text x="400" y="40" textAnchor="middle" fill="#00ff88" fontSize="12" fontWeight="bold">
                GAS IN
              </text>

              {Object.values(gases).some(g => g.on) && (
                <>
                  <path d="M 390 48 L 390 58" stroke="#00ff88" strokeWidth="2" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite"/>
                  </path>
                  <path d="M 400 48 L 400 58" stroke="#00ff88" strokeWidth="2" opacity="0.6">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
                  </path>
                  <path d="M 410 48 L 410 58" stroke="#00ff88" strokeWidth="2" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite"/>
                  </path>
                </>
              )}

              {/* Gas outlet */}
              <rect x="350" y="860" width="100" height="30" fill="#65737e" rx="5" />
              <text x="400" y="880" textAnchor="middle" fill="#ff4757" fontSize="12" fontWeight="bold">
                PUMP OUT
              </text>

              {Object.values(gases).some(g => g.on) && (
                <>
                  <path d="M 390 852 L 390 862" stroke="#ff4757" strokeWidth="2" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite"/>
                  </path>
                  <path d="M 400 852 L 400 862" stroke="#ff4757" strokeWidth="2" opacity="0.6">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
                  </path>
                  <path d="M 410 852 L 410 862" stroke="#ff4757" strokeWidth="2" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite"/>
                  </path>
                </>
              )}
            </svg>
          </div>

          {/* Right Panel - Monitor */}
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            border: '2px solid #4a5568',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '1.3em',
              color: '#00ff88',
              marginBottom: '20px',
              borderBottom: '2px solid #4a5568',
              paddingBottom: '10px'
            }}>
              📊 Monitor
            </div>

            {/* Experiment Guide */}
            <div style={{
              background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '10px' }}>
                🧪 실험 가이드
              </h4>
              <div style={{
                background: 'rgba(0, 255, 136, 0.05)',
                padding: '12px',
                borderRadius: '8px',
                borderLeft: '3px solid #00ff88'
              }}>
                <div style={{ fontWeight: 'bold', color: '#00ff88', marginBottom: '8px' }}>
                  {guide.title}
                </div>
                <div style={{ color: '#a8dadc', fontSize: '0.85em', marginBottom: '8px' }}>
                  <strong>목표:</strong> {guide.objective}
                </div>
                {guide.instructions.map((inst, idx) => (
                  <div key={idx} style={{ color: '#cbd5e0', fontSize: '0.85em', margin: '4px 0' }}>
                    {inst}
                  </div>
                ))}
                <div style={{
                  marginTop: '10px',
                  padding: '8px',
                  background: 'rgba(255, 107, 107, 0.1)',
                  borderRadius: '5px',
                  fontSize: '0.85em',
                  color: '#ff6b6b'
                }}>
                  {guide.warning}
                </div>
              </div>
            </div>

            {/* Process Results */}
            <div style={{
              background: '#1a202c',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '10px' }}>
                📈 공정 결과
              </h4>
              {modes[currentMode].properties.map(prop => (
                <div key={prop} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px',
                  background: 'rgba(45, 55, 72, 0.6)',
                  borderRadius: '5px',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#a8dadc' }}>{labels[prop]}</span>
                  <span
                    className={valuesChanged ? 'value-changing' : ''}
                    style={{
                      color: getResultColor(prop, processResults[prop]),
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}
                  >
                    {processResults[prop].toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
                background: 'rgba(45, 55, 72, 0.6)',
                borderRadius: '5px',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#a8dadc' }}>{labels.uniformity}</span>
                <span
                  className={valuesChanged ? 'value-changing' : ''}
                  style={{
                    color: getResultColor('uniformity', processResults.uniformity),
                    fontWeight: 'bold',
                    fontFamily: 'monospace'
                  }}
                >
                  {processResults.uniformity.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Deposition Thickness */}
            <div style={{
              background: '#1a202c',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '10px' }}>
                증착 두께
              </h4>
              <div style={{
                fontSize: '2.5em',
                fontWeight: 'bold',
                color: '#ffd93d',
                textAlign: 'center',
                fontFamily: 'monospace'
              }}>
                {depositionThickness.toFixed(1)} nm
              </div>
            </div>

            {/* Species Display */}
            <div style={{
              background: '#1a202c',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>화학종 분포</h4>
              {Object.entries(species)
                .filter(([_, val]) => val > 0)
                .map(([name, value]) => (
                  <div key={name} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    background: 'rgba(45, 55, 72, 0.6)',
                    borderRadius: '5px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontFamily: 'monospace' }}>{name}</span>
                    <div style={{
                      flex: 1,
                      height: '20px',
                      background: '#2d3748',
                      borderRadius: '10px',
                      margin: '0 10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${value}%`,
                        height: '100%',
                        background: modes[currentMode].color,
                        borderRadius: '10px',
                        transition: 'width 0.5s'
                      }} />
                    </div>
                    <span>{Math.round(value)}%</span>
                  </div>
                ))}
              {Object.values(species).every(v => v === 0) && (
                <div style={{ textAlign: 'center', color: '#718096' }}>
                  No active species
                </div>
              )}
            </div>

            {/* Process Info */}
            <div style={{
              background: '#1a202c',
              padding: '15px',
              borderRadius: '10px'
            }}>
              <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>공정 정보</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Material:</span>
                <span style={{ fontWeight: 'bold' }}>{modes[currentMode].name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Avg Temp:</span>
                <span>{avgTemp}°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Pressure:</span>
                <span>0.8 Torr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div style={{
          maxWidth: '1600px',
          margin: '30px auto',
          padding: '25px',
          background: 'rgba(26, 32, 44, 0.95)',
          border: '2px solid #4a5568',
          borderRadius: '15px'
        }}>
          <h2 style={{
            color: '#00ff88',
            textAlign: 'center',
            marginBottom: '25px',
            fontSize: '1.8em'
          }}>
            📚 왜 공정 모드마다 온도가 다를까요?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {/* SiO2 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #3498db'
            }}>
              <h3 style={{ color: '#3498db', marginBottom: '15px', fontSize: '1.3em', textAlign: 'center' }}>
                🔵 SiO₂ (400-500°C)
              </h3>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#5dade2', marginBottom: '8px' }}>💨 주요 반응:</div>
                <code style={{ color: '#e8e8e8', fontSize: '0.95em' }}>SiH₄ + O₂ → SiO₂ + 2H₂</code>
              </div>
              <div style={{ lineHeight: 1.8, color: '#cbd5e0', fontSize: '0.95em' }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#5dade2' }}>🌡️ 낮은 온도의 이유:</strong><br/>
                  실레인(SiH₄)은 <span style={{ color: '#00ff88' }}>열적으로 매우 불안정</span>한 가스입니다.
                  산소(O₂)와 함께 있으면 <span style={{ color: '#ffd93d' }}>400°C만 되어도 쉽게 분해</span>되어
                  SiO₂를 형성합니다.
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#5dade2' }}>⚗️ 분해 메커니즘:</strong><br/>
                  • 400°C: SiH₄의 Si-H 결합이 끊어지기 시작<br/>
                  • O₂와 즉시 반응하여 Si-O 결합 형성<br/>
                  • 산소가 반응을 촉진하는 역할
                </p>
                <div style={{
                  background: 'rgba(52, 152, 219, 0.15)',
                  padding: '10px',
                  borderRadius: '6px',
                  marginTop: '12px'
                }}>
                  <strong style={{ color: '#3498db' }}>💡 온도 영향:</strong><br/>
                  <span style={{ fontSize: '0.9em' }}>
                    • 너무 낮으면 (&lt;350°C): 반응 느림<br/>
                    • 적정 온도 (400-500°C): 균일한 막질<br/>
                    • 너무 높으면 (&gt;600°C): 입자 형성, 거친 표면
                  </span>
                </div>
              </div>
            </div>

            {/* Si3N4 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.05) 100%)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #e74c3c'
            }}>
              <h3 style={{ color: '#e74c3c', marginBottom: '15px', fontSize: '1.3em', textAlign: 'center' }}>
                🔴 Si₃N₄ (700-780°C)
              </h3>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#ff6b6b', marginBottom: '8px' }}>💨 주요 반응:</div>
                <code style={{ color: '#e8e8e8', fontSize: '0.85em' }}>3SiH₂Cl₂ + 4NH₃ → Si₃N₄ + 6HCl + 6H₂</code>
              </div>
              <div style={{ lineHeight: 1.8, color: '#cbd5e0', fontSize: '0.95em' }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#ff6b6b' }}>🌡️ 높은 온도가 필요한 이유:</strong><br/>
                  디클로로실레인(SiH₂Cl₂)과 암모니아(NH₃)의 반응은
                  <span style={{ color: '#ffd93d' }}> Si-Cl과 N-H 결합을 끊고</span>
                  <span style={{ color: '#00ff88' }}> 강한 Si-N 결합을 만들어야</span> 합니다.
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#ff6b6b' }}>⚗️ 분해 메커니즘:</strong><br/>
                  • 700°C: Si-Cl 결합 분해 시작 (강한 결합)<br/>
                  • NH₃도 N-H 분해로 활성 N 생성<br/>
                  • Si와 N이 만나 <span style={{ color: '#00ff88' }}>매우 안정한 Si₃N₄</span> 형성<br/>
                  • HCl, H₂는 부산물로 배출
                </p>
                <div style={{
                  background: 'rgba(231, 76, 60, 0.15)',
                  padding: '10px',
                  borderRadius: '6px',
                  marginTop: '12px'
                }}>
                  <strong style={{ color: '#e74c3c' }}>💡 온도 영향:</strong><br/>
                  <span style={{ fontSize: '0.9em' }}>
                    • 너무 낮으면 (&lt;650°C): 미반응 가스 증가<br/>
                    • 적정 온도 (700-780°C): 치밀한 질화막<br/>
                    • 온도↑ → 응력↑ (열팽창 계수 차이)
                  </span>
                </div>
              </div>
            </div>

            {/* Poly-Si */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(155, 89, 182, 0.05) 100%)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #9b59b6'
            }}>
              <h3 style={{ color: '#9b59b6', marginBottom: '15px', fontSize: '1.3em', textAlign: 'center' }}>
                🟣 Poly-Si (580-650°C)
              </h3>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#c39bd3', marginBottom: '8px' }}>💨 주요 반응:</div>
                <code style={{ color: '#e8e8e8', fontSize: '0.95em' }}>SiH₄ → Si + 2H₂</code>
              </div>
              <div style={{ lineHeight: 1.8, color: '#cbd5e0', fontSize: '0.95em' }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#c39bd3' }}>🌡️ 중간 온도의 이유:</strong><br/>
                  산소 없이 <span style={{ color: '#ffd93d' }}>SiH₄만 열분해</span>하여
                  순수 실리콘을 얻습니다. 온도에 따라
                  <span style={{ color: '#00ff88' }}> 결정 구조가 결정</span>됩니다!
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#c39bd3' }}>⚗️ 분해 메커니즘:</strong><br/>
                  • 580°C: SiH₄ → SiH₂ → Si (순차 분해)<br/>
                  • H₂는 기체로 배출<br/>
                  • 증착된 Si 원자들이 <span style={{ color: '#00ff88' }}>결정화</span><br/>
                  • 온도↑ → 결정립(grain) 크기↑
                </p>
                <div style={{
                  background: 'rgba(155, 89, 182, 0.15)',
                  padding: '10px',
                  borderRadius: '6px',
                  marginTop: '12px'
                }}>
                  <strong style={{ color: '#9b59b6' }}>💡 온도 영향:</strong><br/>
                  <span style={{ fontSize: '0.9em' }}>
                    • 낮은 온도 (&lt;580°C): 비정질(a-Si), 낮은 전도도<br/>
                    • 중간 온도 (580-650°C): 다결정, 적당한 전도도<br/>
                    • 높은 온도 (&gt;650°C): 큰 결정립, 높은 전도도
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Summary */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px solid #00ff88'
          }}>
            <h3 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '15px', fontSize: '1.4em' }}>
              ⭐ 핵심 요약: 활성화 에너지(Activation Energy)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              color: '#e2e8f0',
              fontSize: '0.95em',
              lineHeight: 1.7
            }}>
              <div>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#00ff88' }}>🔬 화학 반응의 기본 원리:</strong><br/>
                  모든 화학 반응은 <span style={{ color: '#ffd93d' }}>"활성화 에너지"</span>라는
                  에너지 장벽을 넘어야 일어납니다. 온도를 높이면 분자들의 운동 에너지가
                  증가하여 이 장벽을 넘을 확률이 높아집니다.
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#00ff88' }}>📊 결합 에너지 비교:</strong><br/>
                  • Si-H 결합: <span style={{ color: '#5dade2' }}>약함 (323 kJ/mol)</span> → 낮은 온도 OK<br/>
                  • Si-Cl 결합: <span style={{ color: '#ff6b6b' }}>강함 (467 kJ/mol)</span> → 높은 온도 필요<br/>
                  • Si-N 결합: <span style={{ color: '#00ff88' }}>매우 강함 (439 kJ/mol)</span> → 고온 필요
                </p>
              </div>
              <div>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#00ff88' }}>⚖️ 온도 선택의 균형:</strong><br/>
                  • <span style={{ color: '#ff6b6b' }}>너무 낮으면</span>: 반응 느림, 미반응 가스 증가<br/>
                  • <span style={{ color: '#00ff88' }}>최적 온도</span>: 균일한 증착, 좋은 막질<br/>
                  • <span style={{ color: '#ffd93d' }}>너무 높으면</span>: 기상 반응, 입자 생성, 응력 증가
                </p>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #00ff88'
                }}>
                  <strong style={{ color: '#00ff88' }}>💡 실무 팁:</strong><br/>
                  LPCVD 공정에서는 <span style={{ color: '#ffd93d' }}>각 가스의 분해 온도</span>에 맞춰
                  공정 온도를 설정합니다. 이것이 공정 모드마다 온도가 다른 근본적인 이유입니다!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPCVDSimulator;
