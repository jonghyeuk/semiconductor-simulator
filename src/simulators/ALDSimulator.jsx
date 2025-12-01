import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ALDSimulator = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const waferRef = useRef(null);
  const moleculesRef = useRef([]);
  const depositionSitesRef = useRef([]);
  const animationIdRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPulseOn, setIsPulseOn] = useState(false);
  const [depositedCount, setDepositedCount] = useState(0);
  const [reactedCount, setReactedCount] = useState(0);
  const [totalSites, setTotalSites] = useState(0);
  const [pulseStartTime, setPulseStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalThickness, setTotalThickness] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [cycleTimePosition, setCycleTimePosition] = useState(0);

  const depositedMoleculesRef = useRef([]);
  const isRunningRef = useRef(false);
  const currentLayerRef = useRef(0);
  const cycleStartTimeRef = useRef(0);

  // Wafer settings
  const WAFER_RADIUS = 5;
  const WAFER_HEIGHT = 0.3;
  const GRID_SPACING = 0.4;
  const MOLECULE_RADIUS = 0.15;
  const THICKNESS_PER_CYCLE = 0.1; // nm per cycle

  // Simulation timing
  const STEP1_DURATION = 6000;
  const STEP2_DURATION = 2500;
  const STEP3_DURATION = 6000;
  const STEP4_DURATION = 2500;

  const SPAWN_INTERVAL = 10;
  const SPAWN_COUNT_BLUE = 5;
  const SPAWN_COUNT_RED = 5;
  const SPAWN_COUNT_GRAY = 3;

  const spawnIntervalRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Wafer
    const waferGeometry = new THREE.CylinderGeometry(
      WAFER_RADIUS,
      WAFER_RADIUS,
      WAFER_HEIGHT,
      64
    );
    const waferMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      shininess: 100,
      specular: 0x444444
    });
    const wafer = new THREE.Mesh(waferGeometry, waferMaterial);
    wafer.receiveShadow = true;
    wafer.castShadow = true;
    scene.add(wafer);
    waferRef.current = wafer;

    // Create deposition sites
    createDepositionSites(scene);

    // Grid helper
    const gridHelper = new THREE.GridHelper(15, 15, 0x444444, 0x222222);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Camera rotation
      const time = Date.now() * 0.0005;
      camera.position.x = Math.cos(time) * 10;
      camera.position.z = Math.sin(time) * 10;
      camera.lookAt(0, 0, 0);

      // Update molecules
      updateMolecules();

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create deposition sites on wafer surface
  const createDepositionSites = (scene) => {
    const sites = [];
    const waferTop = WAFER_HEIGHT / 2;

    for (let x = -WAFER_RADIUS; x <= WAFER_RADIUS; x += GRID_SPACING) {
      for (let z = -WAFER_RADIUS; z <= WAFER_RADIUS; z += GRID_SPACING) {
        const distance = Math.sqrt(x * x + z * z);
        if (distance <= WAFER_RADIUS - 0.2) {
          const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
          const dotMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
          });
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          dot.position.set(x, waferTop + 0.01, z);
          scene.add(dot);

          sites.push({
            x,
            y: waferTop,
            z,
            occupied: false,
            reacted: false,
            marker: dot
          });
        }
      }
    }
    depositionSitesRef.current = sites;
    setTotalSites(sites.length);
  };

  // Spawn molecule
  const spawnMolecule = (type = 'blue') => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    if (type !== 'gray') {
      if (type === 'blue') {
        const occupiedCount = depositionSitesRef.current.filter(site => site.occupied).length;
        if (occupiedCount >= depositionSitesRef.current.length) {
          if (spawnIntervalRef.current) {
            clearInterval(spawnIntervalRef.current);
            spawnIntervalRef.current = null;
          }
          return;
        }
      }

      if (type === 'red') {
        const reactableCount = depositionSitesRef.current.filter(site => site.occupied && !site.reacted).length;
        if (reactableCount === 0) {
          if (spawnIntervalRef.current) {
            clearInterval(spawnIntervalRef.current);
            spawnIntervalRef.current = null;
          }
          return;
        }
      }
    }

    const count = type === 'gray' ? 2 : 3;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * WAFER_RADIUS;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 10 + Math.random() * 2;

      let color, emissive;
      switch(type) {
        case 'blue':
          color = 0x3b5998;
          emissive = 0x1e3a8a;
          break;
        case 'red':
          color = 0xff4444;
          emissive = 0xaa0000;
          break;
        case 'gray':
          color = 0x999999;
          emissive = 0x555555;
          break;
        default:
          color = 0x3b5998;
          emissive = 0x1e3a8a;
      }

      const moleculeGeometry = new THREE.SphereGeometry(MOLECULE_RADIUS, 16, 16);
      const moleculeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: emissive,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: type === 'gray',
        opacity: type === 'gray' ? 0.6 : 1.0
      });
      const molecule = new THREE.Mesh(moleculeGeometry, moleculeMaterial);
      molecule.position.set(x, y, z);
      molecule.castShadow = true;
      scene.add(molecule);

      moleculesRef.current.push({
        mesh: molecule,
        type: type,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          -0.15 - Math.random() * 0.08,
          (Math.random() - 0.5) * 0.015
        ),
        active: true,
        deposited: false,
        checked: false,
        onSurface: false
      });
    }
  };

  // Update molecules
  const updateMolecules = () => {
    const molecules = moleculesRef.current;
    const sites = depositionSitesRef.current;
    let newDepositedCount = 0;
    let newReactedCount = 0;

    molecules.forEach((molecule) => {
      if (!molecule.active) return;

      molecule.mesh.position.add(molecule.velocity);

      const waferTop = WAFER_HEIGHT / 2;
      const currentSurfaceHeight = waferTop + (currentLayerRef.current * MOLECULE_RADIUS * 2.5);

      const distanceFromCenter = Math.sqrt(
        molecule.mesh.position.x * molecule.mesh.position.x +
        molecule.mesh.position.z * molecule.mesh.position.z
      );

      if (distanceFromCenter <= WAFER_RADIUS &&
          molecule.mesh.position.y <= currentSurfaceHeight + MOLECULE_RADIUS &&
          !molecule.deposited) {

        molecule.mesh.position.y = currentSurfaceHeight + MOLECULE_RADIUS;

        if (!molecule.checked) {
          molecule.checked = true;

          if (molecule.type === 'blue') {
            let closestSite = null;
            let minDistance = Infinity;

            sites.forEach((site) => {
              if (!site.occupied) {
                const dx = molecule.mesh.position.x - site.x;
                const dz = molecule.mesh.position.z - site.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < minDistance && distance < GRID_SPACING * 1.5) {
                  minDistance = distance;
                  closestSite = site;
                }
              }
            });

            if (closestSite) {
              molecule.mesh.position.set(
                closestSite.x,
                currentSurfaceHeight + MOLECULE_RADIUS,
                closestSite.z
              );
              molecule.deposited = true;
              molecule.velocity.set(0, 0, 0);
              closestSite.occupied = true;

              newDepositedCount++;
            } else {
              const radialDirection = new THREE.Vector3(
                molecule.mesh.position.x,
                0,
                molecule.mesh.position.z
              ).normalize();

              const flowSpeed = 0.25;
              molecule.velocity.set(
                radialDirection.x * flowSpeed,
                0,
                radialDirection.z * flowSpeed
              );
              molecule.onSurface = true;
            }

          } else if (molecule.type === 'red') {
            let closestSite = null;
            let minDistance = Infinity;

            sites.forEach((site) => {
              if (site.occupied && !site.reacted) {
                const dx = molecule.mesh.position.x - site.x;
                const dz = molecule.mesh.position.z - site.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < minDistance && distance < GRID_SPACING * 1.5) {
                  minDistance = distance;
                  closestSite = site;
                }
              }
            });

            if (closestSite) {
              molecule.mesh.position.set(
                closestSite.x,
                currentSurfaceHeight + MOLECULE_RADIUS * 3,
                closestSite.z
              );
              molecule.deposited = true;
              molecule.velocity.set(0, 0, 0);
              closestSite.reacted = true;

              newReactedCount++;
            } else {
              const radialDirection = new THREE.Vector3(
                molecule.mesh.position.x,
                0,
                molecule.mesh.position.z
              ).normalize();

              const flowSpeed = 0.25;
              molecule.velocity.set(
                radialDirection.x * flowSpeed,
                0,
                radialDirection.z * flowSpeed
              );
              molecule.onSurface = true;
            }

          } else if (molecule.type === 'gray') {
            const radialDirection = new THREE.Vector3(
              molecule.mesh.position.x,
              0,
              molecule.mesh.position.z
            ).normalize();

            const flowSpeed = 0.25;
            molecule.velocity.set(
              radialDirection.x * flowSpeed,
              0,
              radialDirection.z * flowSpeed
            );
            molecule.onSurface = true;
          }
        } else if (molecule.onSurface) {
          molecule.mesh.position.y = currentSurfaceHeight + MOLECULE_RADIUS;
        }
      }

      if (molecule.onSurface && distanceFromCenter > WAFER_RADIUS) {
        molecule.velocity.y = -0.2;
        molecule.onSurface = false;
      }

      if (molecule.mesh.position.y < -10 ||
          Math.abs(molecule.mesh.position.x) > 20 ||
          Math.abs(molecule.mesh.position.z) > 20) {
        molecule.active = false;
        sceneRef.current.remove(molecule.mesh);
      }
    });

    if (newDepositedCount > 0) {
      setDepositedCount((prev) => prev + newDepositedCount);
    }
    if (newReactedCount > 0) {
      setReactedCount((prev) => prev + newReactedCount);
    }
  };

  // Start cycle
  const startCycle = () => {
    if (!isRunning) {
      setIsRunning(true);
      isRunningRef.current = true;
      startStep(1);
    }
  };

  // Stop cycle
  const stopCycle = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    setIsPulseOn(false);
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
  };

  // Start each step
  const startStep = (stepNumber) => {
    if (!isRunningRef.current) return;

    setCurrentStep(stepNumber);
    setIsPulseOn(true);
    setPulseStartTime(Date.now());

    let duration, nextStep;

    switch(stepNumber) {
      case 1:
        duration = STEP1_DURATION;
        nextStep = 2;
        cycleStartTimeRef.current = Date.now();
        setDepositedCount(0);
        setReactedCount(0);
        spawnIntervalRef.current = setInterval(() => {
          for (let i = 0; i < SPAWN_COUNT_BLUE; i++) {
            spawnMolecule('blue');
          }
        }, SPAWN_INTERVAL);
        break;

      case 2:
        duration = STEP2_DURATION;
        nextStep = 3;
        spawnIntervalRef.current = setInterval(() => {
          for (let i = 0; i < SPAWN_COUNT_GRAY; i++) {
            spawnMolecule('gray');
          }
        }, SPAWN_INTERVAL * 2);
        break;

      case 3:
        duration = STEP3_DURATION;
        nextStep = 4;
        spawnIntervalRef.current = setInterval(() => {
          for (let i = 0; i < SPAWN_COUNT_RED; i++) {
            spawnMolecule('red');
          }
        }, SPAWN_INTERVAL);
        break;

      case 4:
        duration = STEP4_DURATION;
        nextStep = 1;
        spawnIntervalRef.current = setInterval(() => {
          for (let i = 0; i < SPAWN_COUNT_GRAY; i++) {
            spawnMolecule('gray');
          }
        }, SPAWN_INTERVAL * 2);
        break;

      default:
        return;
    }

    setTimeout(() => {
      setIsPulseOn(false);
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }

      if (stepNumber === 4) {
        moleculesRef.current = moleculesRef.current.filter((molecule) => {
          if (!molecule.deposited) {
            sceneRef.current.remove(molecule.mesh);
            return false;
          }
          return true;
        });

        depositionSitesRef.current.forEach((site) => {
          site.occupied = false;
          site.reacted = false;
        });

        setCycleCount((prev) => prev + 1);
        setTotalThickness((prev) => prev + THICKNESS_PER_CYCLE);
        setCurrentLayer((prev) => {
          const newLayer = prev + 1;
          currentLayerRef.current = newLayer;
          return newLayer;
        });
      }

      if (isRunningRef.current && nextStep) {
        startStep(nextStep);
      }
    }, duration);
  };

  // Reset
  const resetSimulation = () => {
    moleculesRef.current.forEach((molecule) => {
      if (sceneRef.current && molecule.mesh) {
        sceneRef.current.remove(molecule.mesh);
      }
    });
    moleculesRef.current = [];
    depositedMoleculesRef.current = [];

    depositionSitesRef.current.forEach((site) => {
      site.occupied = false;
      site.reacted = false;
      site.marker.material.opacity = 0.3;
    });

    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }

    setCurrentStep(0);
    setIsPulseOn(false);
    setDepositedCount(0);
    setReactedCount(0);
    setElapsedTime(0);
    setIsRunning(false);
    isRunningRef.current = false;
    setCycleCount(0);
    setTotalThickness(0);
    setCurrentLayer(0);
    currentLayerRef.current = 0;
  };

  // Update elapsed time and cycle time position for graph
  useEffect(() => {
    let interval;
    if (isPulseOn && currentStep >= 1 && currentStep <= 4) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - pulseStartTime);
        // Update cycle time position for the timing graph
        const totalCycleDuration = STEP1_DURATION + STEP2_DURATION + STEP3_DURATION + STEP4_DURATION;
        const cycleElapsed = Date.now() - cycleStartTimeRef.current;
        const normalizedTime = Math.min(cycleElapsed / totalCycleDuration, 1);
        setCycleTimePosition(normalizedTime);
      }, 50); // Update more frequently for smoother animation
    } else {
      setElapsedTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPulseOn, pulseStartTime, currentStep]);

  const getStepName = (step) => {
    switch(step) {
      case 1: return 'Step 1: Source A';
      case 2: return 'Step 2: Purge';
      case 3: return 'Step 3: Reactant B';
      case 4: return 'Step 4: Purge';
      default: return 'Standby';
    }
  };

  return (
    <div className="w-full h-full flex bg-gray-900">
      {/* 3D Viewport */}
      <div className="flex-1 relative" ref={mountRef}>
        {/* Pulse Timing Graph - 왼쪽 상단 오버레이 */}
        <div className="absolute top-2 left-2 bg-black/80 p-2 rounded border border-gray-600">
          <div className="text-gray-300 font-bold text-xs mb-1">Pulse Timing Graph</div>
          <svg width="280" height="130" viewBox="0 0 240 130" className="bg-black/50 rounded">
            {/* X축 시간 눈금 */}
            <line x1="50" y1="115" x2="230" y2="115" stroke="#444" strokeWidth="1" />
            <text x="50" y="125" fill="#888" fontSize="8" textAnchor="middle">0</text>
            <text x="95" y="125" fill="#888" fontSize="8" textAnchor="middle">0.5</text>
            <text x="122" y="125" fill="#888" fontSize="8" textAnchor="middle">0.8</text>
            <text x="167" y="125" fill="#888" fontSize="8" textAnchor="middle">1.3</text>
            <text x="194" y="125" fill="#888" fontSize="8" textAnchor="middle">1.6</text>
            <text x="220" y="125" fill="#888" fontSize="8" textAnchor="middle">s</text>

            {/* Y축 신호 라벨 */}
            <text x="45" y="22" fill="#3b82f6" fontSize="8" textAnchor="end">Source A</text>
            <text x="45" y="42" fill="#9ca3af" fontSize="8" textAnchor="end">Purge 1</text>
            <text x="45" y="67" fill="#ef4444" fontSize="8" textAnchor="end">Reactant B</text>
            <text x="45" y="92" fill="#9ca3af" fontSize="8" textAnchor="end">Purge 2</text>

            {/* 타이밍 펄스 그래프 - Step 1 (Source A): 0 ~ 0.5초 */}
            <path
              d="M 50 27 L 50 12 L 95 12 L 95 27 L 230 27"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />

            {/* 타이밍 펄스 그래프 - Step 2 (Purge 1): 0.5 ~ 0.8초 */}
            <path
              d="M 50 47 L 95 47 L 95 32 L 122 32 L 122 47 L 230 47"
              stroke="#9ca3af"
              strokeWidth="2"
              fill="none"
            />

            {/* 타이밍 펄스 그래프 - Step 3 (Reactant B): 0.8 ~ 1.3초 */}
            <path
              d="M 50 72 L 122 72 L 122 57 L 167 57 L 167 72 L 230 72"
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
            />

            {/* 타이밍 펄스 그래프 - Step 4 (Purge 2): 1.3 ~ 1.6초 */}
            <path
              d="M 50 97 L 167 97 L 167 82 L 194 82 L 194 97 L 230 97"
              stroke="#9ca3af"
              strokeWidth="2"
              fill="none"
            />

            {/* 현재 시간 표시 (세로 선) - moving time indicator */}
            {isRunning && (
              <>
                <line
                  x1={50 + cycleTimePosition * 144}
                  y1="5"
                  x2={50 + cycleTimePosition * 144}
                  y2="110"
                  stroke="#00ff00"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
                <circle cx={50 + cycleTimePosition * 144} cy="5" r="3" fill="#00ff00" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-64 bg-gray-800 p-3 overflow-y-auto text-sm flex flex-col">
        {/* Title */}
        <div className="mb-3 p-2 bg-cyan-900/50 rounded border border-cyan-500">
          <div className="text-cyan-300 font-bold text-xs">ALD Simulator</div>
          <div className="text-gray-400 text-xs mt-1">Atomic Layer Deposition</div>
        </div>

        {/* Current Step */}
        <div className="mb-2 p-2 bg-gray-900 rounded">
          <div className="text-gray-400 text-xs">Current Step:</div>
          <div className="text-cyan-400 font-bold">{getStepName(currentStep)}</div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={isRunning ? stopCycle : startCycle}
            className={`flex-1 py-2 rounded font-bold text-sm ${isRunning ? 'bg-red-600' : 'bg-green-600'} text-white`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded font-bold text-sm bg-yellow-600 text-white"
          >
            Reset
          </button>
        </div>

        {/* Deposition Info */}
        <div className="mb-3 p-2 bg-cyan-900/30 rounded border border-cyan-500/50">
          <div className="text-cyan-300 font-bold text-xs mb-2">Deposition Info</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Cycles:</span>
              <span className="text-cyan-400 font-bold">{cycleCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Thickness:</span>
              <span className="text-cyan-400 font-bold">{totalThickness.toFixed(2)} nm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Per Cycle:</span>
              <span className="text-gray-500">{THICKNESS_PER_CYCLE} nm</span>
            </div>
          </div>
        </div>

        {/* Adsorbed Molecules */}
        <div className="mb-3 p-2 bg-blue-900/30 rounded border border-blue-500/50">
          <div className="text-blue-300 font-bold text-xs mb-1">Adsorbed (Blue)</div>
          <div className="text-blue-400 font-bold text-lg">{depositedCount} / {totalSites}</div>
          <div className="text-gray-500 text-xs">
            ({totalSites > 0 ? ((depositedCount / totalSites) * 100).toFixed(1) : 0}% coverage)
          </div>
        </div>

        {/* Reacted Molecules */}
        <div className="mb-3 p-2 bg-red-900/30 rounded border border-red-500/50">
          <div className="text-red-300 font-bold text-xs mb-1">Reacted (Red)</div>
          <div className="text-red-400 font-bold text-lg">{reactedCount} / {depositedCount}</div>
          <div className="text-gray-500 text-xs">
            ({depositedCount > 0 ? ((reactedCount / depositedCount) * 100).toFixed(1) : 0}% reacted)
          </div>
        </div>

        {/* Legend */}
        <div className="p-2 bg-gray-900 rounded text-xs">
          <div className="text-gray-300 font-bold mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <span className="text-gray-400">Adsorption sites</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-gray-400">Source A (TMA)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-gray-400">Purge gas (N2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-400">Reactant B (H2O)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ALDSimulator;
