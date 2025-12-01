import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const EvaporatorSimulator = () => {
  const mountRef = useRef(null);
  const isPowerOnRef = useRef(false);
  const ionEnergyRef = useRef(50);
  const zoomRef = useRef(18);
  const cameraAngleRef = useRef(0);
  const isRotatingRef = useRef(true);
  const modeRef = useRef('ebeam'); // 'ebeam' or 'thermal'

  const [isPowerOn, setIsPowerOn] = useState(false);
  const [ionEnergy, setIonEnergy] = useState(50);
  const [depositedCount, setDepositedCount] = useState(0);
  const [zoom, setZoom] = useState(18);
  const [isRotating, setIsRotating] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mode, setMode] = useState('ebeam');
  const [analysisData, setAnalysisData] = useState({
    porosity: 0,
    avgThickness: 0,
    uniformity: 0,
    voidCount: 0
  });

  useEffect(() => { isRotatingRef.current = isRotating; }, [isRotating]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const handleWheel = (e) => {
      e.preventDefault();
      const newZoom = Math.max(8, Math.min(40, zoomRef.current + e.deltaY * 0.01));
      setZoom(newZoom);
      zoomRef.current = newZoom;
    };
    mountRef.current.addEventListener('wheel', handleWheel, { passive: false });

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const targetRadius = 1.2;
    const targetLayers = 3;
    const atomSpacing = 0.15;
    const atomRadius = 0.05;
    const targetBaseY = -2.5;

    // ==================== E-BEAM SOURCE ====================
    const ebeamSourceX = -2.5;

    // E-beam Crucible
    const crucibleMat = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.9 });
    const crucibleOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(targetRadius * 1.1, targetRadius * 1.2, 1.2, 16, 1, true),
      crucibleMat
    );
    crucibleOuter.position.set(ebeamSourceX, targetBaseY - 0.3, 0);
    scene.add(crucibleOuter);

    const crucibleBottom = new THREE.Mesh(
      new THREE.CylinderGeometry(targetRadius * 1.2, targetRadius * 1.2, 0.15, 16),
      crucibleMat
    );
    crucibleBottom.position.set(ebeamSourceX, targetBaseY - 0.85, 0);
    scene.add(crucibleBottom);

    // E-beam target atoms (blue)
    const atomGeometry = new THREE.SphereGeometry(atomRadius, 3, 3);
    const targetGridSize = Math.ceil(targetRadius / atomSpacing);

    let totalEbeamAtoms = 0;
    for (let layer = 0; layer < targetLayers; layer++) {
      for (let i = -targetGridSize; i <= targetGridSize; i++) {
        for (let j = -targetGridSize; j <= targetGridSize; j++) {
          const x = j * atomSpacing, z = i * atomSpacing;
          if (Math.sqrt(x * x + z * z) <= targetRadius * 0.9) totalEbeamAtoms++;
        }
      }
    }

    const ebeamAtoms = new THREE.InstancedMesh(atomGeometry, new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.8 }), totalEbeamAtoms);
    let ebeamAtomIndex = 0;
    const dummy = new THREE.Object3D();

    for (let layer = 0; layer < targetLayers; layer++) {
      const brightness = 0.5 + (layer / targetLayers) * 0.5;
      const color = new THREE.Color(0.2 * brightness, 0.4 * brightness, 1.0 * brightness);

      for (let i = -targetGridSize; i <= targetGridSize; i++) {
        for (let j = -targetGridSize; j <= targetGridSize; j++) {
          const x = j * atomSpacing, z = i * atomSpacing;
          if (Math.sqrt(x * x + z * z) <= targetRadius * 0.9) {
            dummy.position.set(ebeamSourceX + x, targetBaseY - layer * atomSpacing * 0.8, z);
            dummy.updateMatrix();
            ebeamAtoms.setMatrixAt(ebeamAtomIndex, dummy.matrix);
            ebeamAtoms.setColorAt(ebeamAtomIndex++, color);
          }
        }
      }
    }
    ebeamAtoms.instanceMatrix.needsUpdate = true;
    ebeamAtoms.instanceColor.needsUpdate = true;
    scene.add(ebeamAtoms);

    // E-BEAM GUN
    const gunX = ebeamSourceX + targetRadius * 1.5 + 1.0;
    const gunY = targetBaseY - 1.5;
    const gunBody = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), new THREE.MeshBasicMaterial({ color: 0x444444 }));
    gunBody.position.set(gunX, gunY, 0);
    scene.add(gunBody);

    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0x666666 }));
    nozzle.position.set(gunX, gunY + 0.6, 0);
    scene.add(nozzle);

    // ELECTRON BEAM PATH
    const beamStart = { x: gunX, y: gunY + 0.8, z: 0 };
    const beamEnd = { x: ebeamSourceX, y: targetBaseY, z: 0 };
    const cp1 = { x: gunX, y: gunY + 2.5, z: 0 };
    const cp2 = { x: ebeamSourceX + 1.0, y: targetBaseY + 1, z: 0 };

    const calculateBezier = (t) => {
      const mt = 1 - t, mt2 = mt * mt, mt3 = mt2 * mt, t2 = t * t, t3 = t2 * t;
      return {
        x: mt3 * beamStart.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * beamEnd.x,
        y: mt3 * beamStart.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * beamEnd.y,
        z: 0
      };
    };

    const beamPoints = Array.from({length: 31}, (_, i) => {
      const p = calculateBezier(i / 30);
      return new THREE.Vector3(p.x, p.y, p.z);
    });

    const beamLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(beamPoints),
      new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 })
    );
    scene.add(beamLine);

    // ELECTRONS
    const electrons = Array.from({length: 10}, (_, i) => {
      const e = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 3, 3),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
      );
      e.userData = { t: i / 10, speed: 0.01 + Math.random() * 0.01 };
      e.visible = false;
      scene.add(e);
      return e;
    });

    // E-beam HOTSPOT
    const ebeamHotSpot = new THREE.Mesh(
      new THREE.CylinderGeometry(targetRadius * 0.4, targetRadius * 0.4, 0.1, 12),
      new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.8 })
    );
    ebeamHotSpot.position.set(ebeamSourceX, targetBaseY, 0);
    ebeamHotSpot.visible = false;
    scene.add(ebeamHotSpot);

    // ==================== THERMAL EVAPORATOR ====================
    const thermalSourceX = 2.5;
    const thermalSourceZ = 0;

    // Thermal boat (resistance heating)
    const boatLength = 2.5;
    const boatWidth = 1.2;
    const boatMat = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.9 });

    // Boat base
    const thermalBoatBase = new THREE.Mesh(
      new THREE.BoxGeometry(boatLength, 0.15, boatWidth),
      boatMat
    );
    thermalBoatBase.position.set(thermalSourceX, targetBaseY - 0.4, thermalSourceZ);
    scene.add(thermalBoatBase);

    // Boat walls
    const thermalBoatWall1 = new THREE.Mesh(
      new THREE.BoxGeometry(boatLength, 0.4, 0.1),
      boatMat
    );
    thermalBoatWall1.position.set(thermalSourceX, targetBaseY - 0.15, thermalSourceZ + boatWidth/2);
    scene.add(thermalBoatWall1);

    const thermalBoatWall2 = new THREE.Mesh(
      new THREE.BoxGeometry(boatLength, 0.4, 0.1),
      boatMat
    );
    thermalBoatWall2.position.set(thermalSourceX, targetBaseY - 0.15, thermalSourceZ - boatWidth/2);
    scene.add(thermalBoatWall2);

    // Electrode connections
    const electrodeMat = new THREE.MeshBasicMaterial({ color: 0xcc8833 });
    const electrode1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, boatWidth + 0.4), electrodeMat);
    electrode1.position.set(thermalSourceX - boatLength/2 - 0.15, targetBaseY - 0.3, thermalSourceZ);
    scene.add(electrode1);

    const electrode2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, boatWidth + 0.4), electrodeMat);
    electrode2.position.set(thermalSourceX + boatLength/2 + 0.15, targetBaseY - 0.3, thermalSourceZ);
    scene.add(electrode2);

    // Thermal source atoms (blue, changes to red when heated)
    const thermalAtomCount = 80;
    const thermalAtoms = [];
    const thermalAtomGeo = new THREE.SphereGeometry(0.08, 4, 4);

    for (let i = 0; i < thermalAtomCount; i++) {
      const atom = new THREE.Mesh(
        thermalAtomGeo,
        new THREE.MeshBasicMaterial({ color: 0x4488ff })
      );
      const x = thermalSourceX + (Math.random() - 0.5) * (boatLength - 0.4);
      const y = targetBaseY - 0.25 + Math.random() * 0.3;
      const z = thermalSourceZ + (Math.random() - 0.5) * (boatWidth - 0.3);
      atom.position.set(x, y, z);
      atom.userData.baseY = y;
      atom.userData.originalColor = 0x4488ff;
      scene.add(atom);
      thermalAtoms.push(atom);
    }

    // Thermal boat glow
    const thermalGlow = new THREE.Mesh(
      new THREE.BoxGeometry(boatLength - 0.2, 0.05, boatWidth - 0.2),
      new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0 })
    );
    thermalGlow.position.set(thermalSourceX, targetBaseY - 0.3, thermalSourceZ);
    scene.add(thermalGlow);

    // ==================== SUBSTRATE (Wafer - 2x size) ====================
    const substrateRadius = targetRadius * 2.4;
    const substrate = new THREE.Mesh(
      new THREE.CylinderGeometry(substrateRadius, substrateRadius, 0.3, 24),
      new THREE.MeshBasicMaterial({ color: 0x666666 })
    );
    substrate.position.set(0, 2.5, 0);
    scene.add(substrate);

    // ==================== Deposition variables ====================
    const sputteredAtoms = [];
    const depositedGrains = [];
    const crossSectionGrains = [];
    const voidMeshes = [];

    let frameCount = 0, localDeposited = 0;
    let ebeamHeatingLevel = 0;
    let thermalHeatingLevel = 0;
    let isAnalyzingMode = false;
    let currentFilmHeight = 0;

    let cameraTransition = 0;
    let cutTransition = 0;
    const normalCameraY = 0;
    const analysisCameraY = 2.2;
    const analysisCameraDistance = 3.5;

    const sharedSputterGeo = new THREE.SphereGeometry(0.1, 4, 4);
    const smallGrainGeo = new THREE.SphereGeometry(0.022, 4, 4);

    const waferRadius = substrateRadius;
    const filmBaseY = 2.5 - 0.15;

    // Grid-based film system
    const grainSpacing = 0.05;
    const filmGridSize = Math.ceil((waferRadius * 2) / grainSpacing);
    const layerHeight = 0.028;

    const filmGrid = [];
    let currentLayer = 0;

    const createEmptyLayer = () => {
      const layer = [];
      for (let x = 0; x < filmGridSize; x++) {
        layer[x] = [];
        for (let z = 0; z < filmGridSize; z++) {
          layer[x][z] = false;
        }
      }
      return layer;
    };

    const isInWafer = (gx, gz) => {
      const wx = (gx - filmGridSize/2) * grainSpacing;
      const wz = (gz - filmGridSize/2) * grainSpacing;
      return Math.sqrt(wx*wx + wz*wz) <= waferRadius * 0.92;
    };

    const availableCells = [];
    let totalCellsInWafer = 0;
    let filledCount = 0;

    const initGrid = () => {
      filmGrid.length = 0;
      filmGrid.push(createEmptyLayer());
      currentLayer = 0;

      availableCells.length = 0;
      for (let gx = 0; gx < filmGridSize; gx++) {
        for (let gz = 0; gz < filmGridSize; gz++) {
          if (isInWafer(gx, gz)) {
            availableCells.push({gx, gz});
          }
        }
      }
      totalCellsInWafer = availableCells.length;
      filledCount = 0;
      for (let i = availableCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
      }
    };

    const gridToWorld = (gx, gz, layer) => {
      const wx = (gx - filmGridSize/2) * grainSpacing;
      const wz = (gz - filmGridSize/2) * grainSpacing;
      const wy = filmBaseY - layer * layerHeight;
      return {x: wx, y: wy, z: wz};
    };

    const prepareNextLayer = () => {
      currentLayer++;
      filmGrid.push(createEmptyLayer());
      filledCount = 0;

      availableCells.length = 0;
      for (let gx = 0; gx < filmGridSize; gx++) {
        for (let gz = 0; gz < filmGridSize; gz++) {
          if (isInWafer(gx, gz)) {
            availableCells.push({gx, gz});
          }
        }
      }
      for (let i = availableCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
      }
    };

    initGrid();

    const resetDeposition = () => {
      isPowerOnRef.current = false;
      setIsPowerOn(false);

      if (isAnalyzingMode) {
        crossSectionGrains.forEach(g => scene.remove(g));
        crossSectionGrains.length = 0;
        voidMeshes.forEach(v => scene.remove(v));
        voidMeshes.length = 0;
        isAnalyzingMode = false;
        setIsAnalyzing(false);
      }
      cameraTransition = 0;
      cutTransition = 0;

      substrate.visible = true;

      depositedGrains.forEach(g => scene.remove(g));
      depositedGrains.length = 0;

      sputteredAtoms.forEach(a => scene.remove(a));
      sputteredAtoms.length = 0;

      localDeposited = 0;
      currentFilmHeight = 0;
      setDepositedCount(0);

      ebeamHeatingLevel = 0;
      thermalHeatingLevel = 0;
      ebeamHotSpot.visible = false;
      thermalGlow.material.opacity = 0;
      beamLine.material.opacity = 0.2;
      electrons.forEach(e => e.visible = false);

      thermalAtoms.forEach(a => {
        a.material.color.setHex(0x4488ff);
        a.position.y = a.userData.baseY;
      });

      initGrid();
    };

    const depositGrains = () => {
      const grainsToAdd = 5 + Math.floor(Math.random() * 4);

      for (let i = 0; i < grainsToAdd; i++) {
        if (filledCount >= totalCellsInWafer * 0.8) {
          prepareNextLayer();
        }

        if (availableCells.length === 0) continue;

        const pos = availableCells.pop();
        const {gx, gz} = pos;

        filmGrid[currentLayer][gx][gz] = true;
        filledCount++;

        const worldPos = gridToWorld(gx, gz, currentLayer);
        const ox = (Math.random() - 0.5) * grainSpacing * 0.3;
        const oz = (Math.random() - 0.5) * grainSpacing * 0.3;
        const oy = (Math.random() - 0.5) * layerHeight * 0.2;

        const brightness = 0.35 + Math.random() * 0.25 + currentLayer * 0.04;
        const color = new THREE.Color(
          0.12 * brightness,
          0.4 * brightness,
          0.95 * brightness
        );

        const grain = new THREE.Mesh(smallGrainGeo, new THREE.MeshBasicMaterial({ color }));
        grain.position.set(worldPos.x + ox, worldPos.y + oy, worldPos.z + oz);
        grain.userData.originalX = worldPos.x + ox;
        grain.userData.layer = currentLayer;

        scene.add(grain);
        depositedGrains.push(grain);
      }

      currentFilmHeight = (currentLayer + 1) * layerHeight;
      localDeposited++;
    };

    const createCrossSection = () => {
      crossSectionGrains.forEach(g => scene.remove(g));
      crossSectionGrains.length = 0;
      voidMeshes.forEach(v => scene.remove(v));
      voidMeshes.length = 0;

      if (depositedGrains.length < 50) return;

      const grainSize = 0.018;
      const grainGeo = new THREE.SphereGeometry(grainSize, 5, 5);

      const numLayers = Math.max(1, currentLayer + 1);
      const columnSpacing = 0.04;

      let voidCount = 0;

      for (let z = -waferRadius * 0.95; z <= waferRadius * 0.95; z += columnSpacing) {
        const columnHeight = numLayers - Math.floor(Math.random() * Math.min(2, numLayers));
        const columnOffset = (Math.random() - 0.5) * 0.008;

        for (let layer = 0; layer < columnHeight; layer++) {
          const y = filmBaseY - layer * layerHeight;

          const grainsInColumn = 2 + Math.floor(Math.random() * 2);
          for (let g = 0; g < grainsInColumn; g++) {
            const gx = columnOffset + (Math.random() - 0.5) * 0.02;
            const gz = z + (Math.random() - 0.5) * 0.018;
            const gy = y - (Math.random() - 0.5) * 0.012;

            const brightness = 0.28 + Math.random() * 0.32 + layer * 0.04;
            const color = new THREE.Color(
              0.1 * brightness,
              0.38 * brightness,
              1.0 * brightness
            );

            const grain = new THREE.Mesh(grainGeo, new THREE.MeshBasicMaterial({ color }));
            grain.position.set(gx, gy, gz);
            grain.visible = false;

            scene.add(grain);
            crossSectionGrains.push(grain);
          }
        }

        if (numLayers >= 2 && Math.random() > 0.35) {
          const voidY = filmBaseY - Math.random() * (columnHeight - 1) * layerHeight;
          const voidHeight = layerHeight * (0.7 + Math.random() * 0.9);
          const voidWidth = columnSpacing * 0.32;

          const voidGeo = new THREE.BoxGeometry(0.025, voidHeight, voidWidth);
          const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
          const voidMesh = new THREE.Mesh(voidGeo, voidMat);
          voidMesh.position.set(0, voidY - voidHeight/2, z + columnSpacing/2);
          voidMesh.visible = false;

          scene.add(voidMesh);
          voidMeshes.push(voidMesh);
          voidCount++;
        }
      }

      const avgThickness = (numLayers * layerHeight * 1000).toFixed(1);
      const porosity = Math.round(15 + Math.random() * 15);
      const uniformity = Math.round(10 + Math.random() * 15);

      setAnalysisData({
        porosity: porosity,
        avgThickness: avgThickness,
        uniformity: uniformity,
        voidCount: voidCount
      });
    };

    const cleanupAnalysisMode = () => {
      crossSectionGrains.forEach(g => scene.remove(g));
      crossSectionGrains.length = 0;
      voidMeshes.forEach(v => scene.remove(v));
      voidMeshes.length = 0;
    };

    const handleReset = () => resetDeposition();

    const handleAnalysis = () => {
      if (isAnalyzingMode) {
        cleanupAnalysisMode();
        substrate.visible = true;
        depositedGrains.forEach(g => g.visible = true);
        sputteredAtoms.forEach(a => a.visible = true);

        isAnalyzingMode = false;
        cameraTransition = 1;
        cutTransition = 1;
        setIsAnalyzing(false);
      } else {
        isPowerOnRef.current = false;
        setIsPowerOn(false);

        sputteredAtoms.forEach(a => a.visible = false);

        createCrossSection();

        isAnalyzingMode = true;
        cameraTransition = 0;
        cutTransition = 0;
        setIsAnalyzing(true);
      }
    };

    window.addEventListener('resetDeposition', handleReset);
    window.addEventListener('toggleAnalysis', handleAnalysis);

    // E-beam evaporation
    const evaporateEbeam = () => {
      const r = Math.random() * targetRadius * 0.4;
      const a = Math.random() * Math.PI * 2;
      const count = Math.floor(1 + ionEnergyRef.current / 100 + Math.random() * 0.5);

      for (let i = 0; i < count; i++) {
        const atom = new THREE.Mesh(sharedSputterGeo, new THREE.MeshBasicMaterial({ color: 0x4488ff }));
        atom.position.set(
          ebeamSourceX + Math.cos(a) * r + (Math.random()-0.5)*0.2,
          targetBaseY,
          Math.sin(a) * r + (Math.random()-0.5)*0.2
        );
        atom.userData = {
          vy: 0.03 + Math.random() * 0.03,
          vx: (0 - ebeamSourceX) * 0.005 + (Math.random()-0.5) * 0.02,
          vz: (Math.random()-0.5) * 0.02,
          gravity: 0.002
        };
        scene.add(atom);
        sputteredAtoms.push(atom);
      }
    };

    // Thermal evaporation
    const evaporateThermal = () => {
      const count = Math.floor(1 + ionEnergyRef.current / 80 + Math.random() * 0.5);

      for (let i = 0; i < count; i++) {
        const atom = new THREE.Mesh(sharedSputterGeo, new THREE.MeshBasicMaterial({ color: 0xff6644 }));
        atom.position.set(
          thermalSourceX + (Math.random()-0.5) * (boatLength - 0.5),
          targetBaseY,
          thermalSourceZ + (Math.random()-0.5) * (boatWidth - 0.4)
        );
        atom.userData = {
          vy: 0.03 + Math.random() * 0.025,
          vx: (0 - thermalSourceX) * 0.004 + (Math.random()-0.5) * 0.015,
          vz: (Math.random()-0.5) * 0.015,
          gravity: 0.002
        };
        scene.add(atom);
        sputteredAtoms.push(atom);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

      if (isAnalyzingMode) {
        cameraTransition = Math.min(1, cameraTransition + 0.02);
        const camEase = easeInOut(cameraTransition);

        const currentDistance = zoomRef.current + (analysisCameraDistance - zoomRef.current) * camEase;
        const currentY = normalCameraY + (analysisCameraY - normalCameraY) * camEase;

        if (isRotatingRef.current) cameraAngleRef.current += 0.002;

        camera.position.set(
          currentDistance * Math.cos(cameraAngleRef.current),
          currentY,
          currentDistance * Math.sin(cameraAngleRef.current)
        );
        camera.lookAt(0, 2.3, 0);

        if (cameraTransition > 0.5) substrate.visible = false;

        if (cameraTransition > 0.7) {
          cutTransition = Math.min(1, cutTransition + 0.03);

          depositedGrains.forEach(g => {
            if (g.userData.originalX > 0.01) g.visible = false;
          });

          if (cutTransition > 0.3) {
            crossSectionGrains.forEach(g => g.visible = true);
            voidMeshes.forEach(v => v.visible = true);
          }
        }

      } else {
        if (cameraTransition > 0 || cutTransition > 0) {
          if (cutTransition > 0) {
            cutTransition = Math.max(0, cutTransition - 0.05);

            if (cutTransition < 0.5) {
              crossSectionGrains.forEach(g => g.visible = false);
              voidMeshes.forEach(v => v.visible = false);
            }
            if (cutTransition < 0.2) depositedGrains.forEach(g => g.visible = true);
          }

          if (cutTransition <= 0) {
            substrate.visible = true;
            cameraTransition = Math.max(0, cameraTransition - 0.03);
          }

          const camEase = easeInOut(cameraTransition);
          const currentDistance = zoomRef.current + (analysisCameraDistance - zoomRef.current) * camEase;
          const currentY = normalCameraY + (analysisCameraY - normalCameraY) * camEase;

          if (isRotatingRef.current) cameraAngleRef.current += 0.005;

          camera.position.set(
            currentDistance * Math.cos(cameraAngleRef.current),
            currentY,
            currentDistance * Math.sin(cameraAngleRef.current)
          );
          camera.lookAt(0, cameraTransition > 0.3 ? 2.3 : 0, 0);
        } else {
          if (isRotatingRef.current) cameraAngleRef.current += 0.005;
          camera.position.set(
            zoomRef.current * Math.cos(cameraAngleRef.current),
            normalCameraY,
            zoomRef.current * Math.sin(cameraAngleRef.current)
          );
          camera.lookAt(0, 0, 0);
        }
      }

      // Power ON
      if (isPowerOnRef.current && !isAnalyzingMode) {
        frameCount++;
        const eField = ionEnergyRef.current / 100;

        if (modeRef.current === 'ebeam') {
          // E-beam mode
          ebeamHeatingLevel = Math.min(1, ebeamHeatingLevel + 0.005 * (0.5 + eField * 0.5));
          thermalHeatingLevel = Math.max(0, thermalHeatingLevel - 0.01);

          electrons.forEach(e => {
            e.visible = true;
            e.userData.t = (e.userData.t + e.userData.speed) % 1;
            const p = calculateBezier(e.userData.t);
            e.position.set(p.x, p.y, p.z);
          });

          ebeamHotSpot.visible = ebeamHeatingLevel > 0.1;
          ebeamHotSpot.material.opacity = ebeamHeatingLevel * 0.8;
          beamLine.material.opacity = 0.2 + eField * 0.3;

          // Thermal deactivated
          thermalGlow.material.opacity = 0;
          thermalAtoms.forEach(a => a.material.color.setHex(0x4488ff));

          if (ebeamHeatingLevel >= 0.7 && frameCount % Math.max(1, Math.floor(4 - eField * 3)) === 0) {
            evaporateEbeam();
          }

        } else {
          // Thermal mode
          thermalHeatingLevel = Math.min(1, thermalHeatingLevel + 0.008 * (0.5 + eField * 0.5));
          ebeamHeatingLevel = Math.max(0, ebeamHeatingLevel - 0.01);

          electrons.forEach(e => e.visible = false);
          ebeamHotSpot.visible = false;
          beamLine.material.opacity = 0.1;

          // Boat glow
          thermalGlow.material.opacity = thermalHeatingLevel * 0.7;

          // Thermal atoms color change (blue -> red)
          thermalAtoms.forEach(a => {
            const r = 0.27 + thermalHeatingLevel * 0.73;
            const g = 0.53 - thermalHeatingLevel * 0.33;
            const b = 1.0 - thermalHeatingLevel * 0.75;
            a.material.color.setRGB(r, g, b);
            // Slight vibration effect
            if (thermalHeatingLevel > 0.5) {
              a.position.y = a.userData.baseY + (Math.random() - 0.5) * 0.02 * thermalHeatingLevel;
            }
          });

          if (thermalHeatingLevel >= 0.6 && frameCount % Math.max(1, Math.floor(5 - eField * 3)) === 0) {
            evaporateThermal();
          }
        }

        while (sputteredAtoms.length > 300 + eField * 50) scene.remove(sputteredAtoms.shift());

        for (let i = sputteredAtoms.length - 1; i >= 0; i--) {
          const a = sputteredAtoms[i];
          a.userData.vy += a.userData.gravity;
          a.position.y += a.userData.vy;
          a.position.x += a.userData.vx || 0;
          a.position.z += a.userData.vz || 0;

          const dist = Math.sqrt(a.position.x ** 2 + a.position.z ** 2);

          if (a.position.y >= 2.2) {
            if (dist <= waferRadius && depositedGrains.length < 20000) {
              depositGrains();
            }
            scene.remove(a);
            sputteredAtoms.splice(i, 1);
          } else if (dist > 8 || a.position.y > 10) {
            scene.remove(a);
            sputteredAtoms.splice(i, 1);
          }
        }
        if (frameCount % 20 === 0) setDepositedCount(localDeposited);

      } else {
        // Power OFF
        ebeamHeatingLevel = Math.max(0, ebeamHeatingLevel - 0.008);
        thermalHeatingLevel = Math.max(0, thermalHeatingLevel - 0.008);

        ebeamHotSpot.visible = ebeamHeatingLevel > 0.1;
        ebeamHotSpot.material.opacity = ebeamHeatingLevel * 0.8;
        beamLine.material.opacity = 0.2;
        electrons.forEach(e => e.visible = false);

        thermalGlow.material.opacity = thermalHeatingLevel * 0.7;
        thermalAtoms.forEach(a => {
          const r = 0.27 + thermalHeatingLevel * 0.73;
          const g = 0.53 - thermalHeatingLevel * 0.33;
          const b = 1.0 - thermalHeatingLevel * 0.75;
          a.material.color.setRGB(r, g, b);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resetDeposition', handleReset);
      window.removeEventListener('toggleAnalysis', handleAnalysis);
      if (mountRef.current) {
        mountRef.current.removeEventListener('wheel', handleWheel);
        if (renderer.domElement.parentNode === mountRef.current) mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* 3D Viewport and Control Panel */}
      <div className="flex-1 flex" style={{ minHeight: '500px' }}>
        {/* 3D Viewport */}
        <div className="flex-1 relative" ref={mountRef}>
          {/* Mode indicator overlay */}
          <div className="absolute top-2 left-2 bg-black/50 px-3 py-1 rounded text-white text-sm">
            {mode === 'ebeam' ? 'E-beam Evaporator' : 'Thermal Evaporator'}
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-56 bg-gray-800 p-3 overflow-y-auto text-sm flex flex-col">
          {/* Mode selection */}
          <div className="mb-3 p-2 bg-indigo-900 rounded">
            <div className="text-indigo-300 font-bold text-xs mb-2">Mode</div>
            <div className="flex gap-1">
              <button
                onClick={() => { setMode('ebeam'); modeRef.current = 'ebeam'; }}
                className={`flex-1 py-2 rounded font-bold text-xs ${mode === 'ebeam' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                E-beam
              </button>
              <button
                onClick={() => { setMode('thermal'); modeRef.current = 'thermal'; }}
                className={`flex-1 py-2 rounded font-bold text-xs ${mode === 'thermal' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                Thermal
              </button>
            </div>
          </div>

          {/* Status display */}
          <div className="mb-2 p-2 bg-gray-900 rounded">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Power:</span>
              <span className={isPowerOn ? 'text-red-400 font-bold' : 'text-gray-500'}>{isPowerOn ? 'ON' : 'OFF'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Deposited:</span>
              <span className="text-blue-400 font-bold">{depositedCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Layer:</span>
              <span className="text-cyan-400 font-bold">{Math.floor(depositedCount / 20) + 1}</span>
            </div>
          </div>

          <button onClick={() => { setIsPowerOn(!isPowerOn); isPowerOnRef.current = !isPowerOn; }}
            className={`w-full py-2 rounded font-bold mb-2 text-sm ${isPowerOn ? 'bg-red-600' : 'bg-green-600'} text-white`}>
            Power {isPowerOn ? 'OFF' : 'ON'}
          </button>

          <button onClick={() => window.dispatchEvent(new Event('resetDeposition'))}
            className="w-full py-1.5 rounded font-bold mb-2 text-sm bg-yellow-600 text-white">
            Reset
          </button>

          <button onClick={() => window.dispatchEvent(new Event('toggleAnalysis'))}
            disabled={depositedCount < 10}
            className={`w-full py-1.5 rounded font-bold mb-2 text-sm ${isAnalyzing ? 'bg-cyan-600' : 'bg-indigo-600'} text-white disabled:opacity-50`}>
            {isAnalyzing ? 'Back to Simulation' : 'Cross-Section View'}
          </button>

          {isAnalyzing && (
            <div className="mb-2 p-2 bg-cyan-900/50 rounded border border-cyan-500 text-xs">
              <h3 className="text-cyan-300 font-bold mb-1">Analysis Result</h3>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-gray-300">Porosity:</span><span className="text-red-400 font-bold">{analysisData.porosity}%</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Voids:</span><span className="text-yellow-400 font-bold">{analysisData.voidCount}</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Avg Thickness:</span><span className="text-green-400 font-bold">{analysisData.avgThickness}nm</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Non-uniformity:</span><span className="text-orange-400 font-bold">+/-{analysisData.uniformity}%</span></div>
              </div>
            </div>
          )}

          <div className="mb-2 p-2 bg-purple-900 rounded">
            <button onClick={() => setIsRotating(!isRotating)}
              className={`w-full py-1 rounded font-bold text-xs mb-1 ${isRotating ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
              {isRotating ? 'Rotating' : 'Fixed'}
            </button>
            <div className="flex gap-1">
              <button onClick={() => { const z = Math.max(8, zoom-3); setZoom(z); zoomRef.current = z; }} className="flex-1 py-1 bg-green-700 text-white rounded text-xs">Zoom In</button>
              <button onClick={() => { const z = Math.min(40, zoom+3); setZoom(z); zoomRef.current = z; }} className="flex-1 py-1 bg-blue-700 text-white rounded text-xs">Zoom Out</button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs mb-1">
              {mode === 'ebeam' ? 'E-beam Current' : 'DC Current'}: {ionEnergy}%
            </label>
            <input type="range" min="20" max="100" value={ionEnergy} onChange={(e) => { setIonEnergy(+e.target.value); ionEnergyRef.current = +e.target.value; }} className="w-full h-2" />
          </div>

          {/* Mode description */}
          <div className="mt-3 p-2 bg-gray-900 rounded text-xs">
            {mode === 'ebeam' ? (
              <>
                <div className="text-cyan-400 font-bold mb-1">E-beam Mode</div>
                <p className="text-gray-400">Electron beam locally heats target for evaporation. Suitable for high melting point metals.</p>
              </>
            ) : (
              <>
                <div className="text-orange-400 font-bold mb-1">Thermal Mode</div>
                <p className="text-gray-400">DC current resistively heats boat for evaporation. Simple and economical.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaporatorSimulator;
