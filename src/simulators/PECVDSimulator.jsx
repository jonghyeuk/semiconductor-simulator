import React, { useState, useEffect, useRef } from 'react';

const PECVDSimulator = () => {
  const [depositionThickness, setDepositionThickness] = useState(0);
  const [dissociationCount, setDissociationCount] = useState(0);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [rfPowerOn, setRfPowerOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  // 공정 선택
  const [selectedProcess, setSelectedProcess] = useState('SiO2'); // 'a-Si', 'SiNx', 'SiO2'

  // 시나리오 모드 (SiO2 전용)
  const [activeScenario, setActiveScenario] = useState('scenario1'); // scenario1, scenario2

  // 시나리오1: 굴절률 맞추기 - N2O/SiH4 비율 조절
  const [gasRatio, setGasRatio] = useState(14); // N2O/SiH4 ratio (5~25)
  const [showRefractiveIndex, setShowRefractiveIndex] = useState(false);

  // 시나리오2: 온도 비교
  const [temperature, setTemperature] = useState(350); // 200~450°C

  // 공정별 프리셋
  const processPresets = {
    'a-Si': {
      name: 'a-Si (비정질 실리콘)',
      color: '#888888',
      gases: { silane: 30, hydrogen: 200, ammonia: 0, nitrousoxide: 0 },
      pressure: 1000,
      temperature: 250,
      power: 20
    },
    'SiNx': {
      name: 'SiNx (질화규소)',
      color: '#4488ff',
      gases: { silane: 10, hydrogen: 0, ammonia: 80, nitrousoxide: 0 },
      pressure: 300,
      temperature: 350,
      power: 20
    },
    'SiO2': {
      name: 'SiO₂ (산화규소)',
      color: '#ff6666',
      gases: { silane: 50, hydrogen: 0, ammonia: 0, nitrousoxide: 710 },
      pressure: 1000,
      temperature: 350,
      power: 20
    }
  };

  // 계산된 굴절률 (N2O/SiH4 비율에 따라)
  const calculateRefractiveIndex = (ratio) => {
    // 실제 데이터 기반 근사:
    // ratio 5 → n ≈ 1.55 (Si-rich)
    // ratio 14 → n ≈ 1.46 (stoichiometric)
    // ratio 25 → n ≈ 1.44 (O-rich, 하지만 증착률 급감)
    if (ratio < 10) return 1.55 - (ratio - 5) * 0.012;
    if (ratio < 14) return 1.49 - (ratio - 10) * 0.0075;
    if (ratio <= 18) return 1.46 - (ratio - 14) * 0.003;
    return 1.448 - (ratio - 18) * 0.001;
  };

  // 온도에 따른 H 함량 계산
  const calculateHydrogenContent = (temp) => {
    // 200°C → ~25%, 350°C → ~12%, 450°C → ~5%
    return Math.max(5, 35 - temp * 0.07);
  };

  // 온도에 따른 막 밀도 (상대값)
  const calculateFilmDensity = (temp) => {
    // 200°C → 80%, 350°C → 95%, 450°C → 100%
    return Math.min(100, 60 + temp * 0.1);
  };

  const [gasFlows, setGasFlows] = useState({ silane: 50, hydrogen: 0, ammonia: 0, nitrousoxide: 710 });
  const [processPressure, setProcessPressure] = useState(1000);
  const [substrateTemp, setSubstrateTemp] = useState(350);
  const [rfPower, setRfPower] = useState(20);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameId = useRef(null);
  const timeRef = useRef(0);
  const plasmaZoneRef = useRef(null);
  const moleculesRef = useRef([]);
  const fragmentsRef = useRef([]);
  const electronsRef = useRef([]);
  const depositedAtomsRef = useRef([]);
  const rfPowerOnRef = useRef(false);
  const gasFlowsRef = useRef(gasFlows);
  const cameraStateRef = useRef({ distance: 22, angle: { x: 0.3, y: 0 } });
  const gasRatioRef = useRef(gasRatio);
  const temperatureRef = useRef(temperature);
  const selectedProcessRef = useRef(selectedProcess);

  useEffect(() => { rfPowerOnRef.current = rfPowerOn; }, [rfPowerOn]);
  useEffect(() => { gasFlowsRef.current = gasFlows; }, [gasFlows]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { gasRatioRef.current = gasRatio; }, [gasRatio]);
  useEffect(() => { temperatureRef.current = temperature; }, [temperature]);
  useEffect(() => { selectedProcessRef.current = selectedProcess; }, [selectedProcess]);

  // 공정 선택 변경 시 가스 유량 업데이트
  useEffect(() => {
    if (selectedProcess === 'SiO2') {
      const silane = 50;
      const n2o = Math.round(silane * gasRatio);
      setGasFlows({ silane, hydrogen: 0, ammonia: 0, nitrousoxide: n2o });
    } else {
      setGasFlows(processPresets[selectedProcess].gases);
    }
  }, [selectedProcess, gasRatio]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setThreeLoaded(true);
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const createMolecule = (type, position, THREE) => {
    if (!THREE || !sceneRef.current) return null;
    const group = new THREE.Group();
    group.position.copy(position);

    const atomColors = { Si: 0x8B7355, H: 0xFFFFFF, N: 0x3333FF, O: 0xFF3333 };
    const atomSizes = { Si: 0.25, H: 0.12, N: 0.22, O: 0.2 };

    const createAtom = (color, size, pos) => {
      const geo = new THREE.SphereGeometry(size, 12, 12);
      const mat = new THREE.MeshPhongMaterial({ color, shininess: 80 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      return mesh;
    };

    const createBond = (start, end) => {
      const dir = new THREE.Vector3().subVectors(end, start);
      const len = dir.length();
      const geo = new THREE.CylinderGeometry(0.03, 0.03, len, 6);
      const mat = new THREE.MeshPhongMaterial({ color: 0x666666 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(start.clone().add(dir.clone().multiplyScalar(0.5)));
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return mesh;
    };

    const bondLen = 0.35;
    const atoms = [];
    const bonds = [];

    if (type === 'SiH4') {
      const siPos = new THREE.Vector3(0, 0, 0);
      const si = createAtom(atomColors.Si, atomSizes.Si, siPos);
      atoms.push({ mesh: si, type: 'Si', localPos: siPos.clone() });
      group.add(si);
      const tetrahedral = [
        new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(bondLen),
        new THREE.Vector3(-1, -1, 1).normalize().multiplyScalar(bondLen),
        new THREE.Vector3(-1, 1, -1).normalize().multiplyScalar(bondLen),
        new THREE.Vector3(1, -1, -1).normalize().multiplyScalar(bondLen)
      ];
      tetrahedral.forEach((pos) => {
        const h = createAtom(atomColors.H, atomSizes.H, pos);
        atoms.push({ mesh: h, type: 'H', localPos: pos.clone() });
        group.add(h);
        const bond = createBond(siPos, pos);
        bonds.push(bond);
        group.add(bond);
      });
    } else if (type === 'N2O') {
      const positions = [new THREE.Vector3(-bondLen, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(bondLen, 0, 0)];
      const n1 = createAtom(atomColors.N, atomSizes.N, positions[0]);
      const n2 = createAtom(atomColors.N, atomSizes.N, positions[1]);
      const o = createAtom(atomColors.O, atomSizes.O, positions[2]);
      atoms.push({ mesh: n1, type: 'N', localPos: positions[0].clone() });
      atoms.push({ mesh: n2, type: 'N', localPos: positions[1].clone() });
      atoms.push({ mesh: o, type: 'O', localPos: positions[2].clone() });
      group.add(n1, n2, o);
      bonds.push(createBond(positions[0], positions[1]));
      bonds.push(createBond(positions[1], positions[2]));
      bonds.forEach(b => group.add(b));
    } else if (type === 'H2') {
      const h1Pos = new THREE.Vector3(-bondLen * 0.4, 0, 0);
      const h2Pos = new THREE.Vector3(bondLen * 0.4, 0, 0);
      const h1 = createAtom(atomColors.H, atomSizes.H, h1Pos);
      const h2 = createAtom(atomColors.H, atomSizes.H, h2Pos);
      atoms.push({ mesh: h1, type: 'H', localPos: h1Pos.clone() });
      atoms.push({ mesh: h2, type: 'H', localPos: h2Pos.clone() });
      group.add(h1, h2);
      const bond = createBond(h1Pos, h2Pos);
      bonds.push(bond);
      group.add(bond);
    } else if (type === 'NH3') {
      const nPos = new THREE.Vector3(0, 0, 0);
      const n = createAtom(atomColors.N, atomSizes.N, nPos);
      atoms.push({ mesh: n, type: 'N', localPos: nPos.clone() });
      group.add(n);
      const hPositions = [
        new THREE.Vector3(0, -bondLen, 0),
        new THREE.Vector3(bondLen * 0.87, bondLen * 0.5, 0),
        new THREE.Vector3(-bondLen * 0.87, bondLen * 0.5, 0)
      ];
      hPositions.forEach((pos) => {
        const h = createAtom(atomColors.H, atomSizes.H, pos);
        atoms.push({ mesh: h, type: 'H', localPos: pos.clone() });
        group.add(h);
        const bond = createBond(nPos, pos);
        bonds.push(bond);
        group.add(bond);
      });
    }

    group.userData = {
      type, atoms, bonds,
      velocity: new THREE.Vector3((Math.random()-0.5)*0.01, -0.04, (Math.random()-0.5)*0.01),
      rotationSpeed: new THREE.Vector3((Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02),
      dissociating: false, dissociateProgress: 0
    };

    sceneRef.current.add(group);
    return group;
  };

  const createElectron = (position, THREE) => {
    if (!THREE || !sceneRef.current) return;
    const geo = new THREE.SphereGeometry(0.04, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 });
    const electron = new THREE.Mesh(geo, mat);
    electron.position.copy(position);
    electron.userData = {
      velocity: new THREE.Vector3((Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2),
      life: 50 + Math.random() * 30
    };
    sceneRef.current.add(electron);
    electronsRef.current.push(electron);
  };

  const createFragment = (atomType, position, velocity, THREE) => {
    if (!THREE || !sceneRef.current) return;
    const group = new THREE.Group();
    group.position.copy(position);

    const colors = { Si: 0x8B7355, H: 0xFFFFFF, N: 0x4444FF, O: 0xFF4444 };
    const sizes = { Si: 0.25, H: 0.1, N: 0.22, O: 0.2 };

    if (['Si', 'H', 'N', 'O'].includes(atomType)) {
      const geo = new THREE.SphereGeometry(sizes[atomType], 12, 12);
      const mat = new THREE.MeshPhongMaterial({ color: colors[atomType] });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      const isRadical = (atomType === 'Si') || (atomType === 'O');
      group.userData = { type: atomType, velocity: velocity.clone(), isRadical };
    } else {
      const hCount = atomType === 'SiH' ? 1 : atomType === 'SiH2' ? 2 : 3;
      const siGeo = new THREE.SphereGeometry(0.22, 12, 12);
      const siMat = new THREE.MeshPhongMaterial({ color: 0x8B7355 });
      const si = new THREE.Mesh(siGeo, siMat);
      group.add(si);
      for (let i = 0; i < hCount; i++) {
        const ang = (i / hCount) * Math.PI * 2;
        const hGeo = new THREE.SphereGeometry(0.08, 6, 6);
        const hMat = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const h = new THREE.Mesh(hGeo, hMat);
        h.position.set(Math.cos(ang) * 0.28, -0.12, Math.sin(ang) * 0.28);
        group.add(h);
      }
      group.userData = { type: atomType, velocity: velocity.clone(), isRadical: true };
    }

    group.userData.rotationSpeed = new THREE.Vector3((Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08);
    sceneRef.current.add(group);
    fragmentsRef.current.push(group);
  };

  const initializeScene = () => {
    if (!window.THREE || !mountRef.current) return;
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080810);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 15, 5);
    scene.add(dirLight);

    // Showerhead
    const showerhead = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.5, 32), new THREE.MeshPhongMaterial({ color: 0x333333 }));
    showerhead.position.y = 10;
    scene.add(showerhead);

    for (let ring = 0; ring < 10; ring++) {
      const radius = (ring + 1) * 0.6;
      const holes = Math.max(6, Math.floor(radius * 8));
      for (let i = 0; i < holes; i++) {
        const ang = (i / holes) * Math.PI * 2;
        const x = Math.cos(ang) * radius, z = Math.sin(ang) * radius;
        if (Math.sqrt(x*x + z*z) < 6.5) {
          const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8), new THREE.MeshPhongMaterial({ color: 0x111111 }));
          hole.position.set(x, 10, z);
          scene.add(hole);
        }
      }
    }

    // Plasma zone
    const plasmaZone = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 5.5, 4, 32, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x8844ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    );
    plasmaZone.position.y = 5;
    scene.add(plasmaZone);
    plasmaZoneRef.current = plasmaZone;

    // Wafer
    const wafer = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.3, 64), new THREE.MeshPhongMaterial({ color: 0x404040, shininess: 100 }));
    wafer.position.y = 0;
    scene.add(wafer);

    // Chamber
    const chamber = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 20, 32, 1, true),
      new THREE.MeshPhongMaterial({ color: 0x1a3a6a, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    );
    chamber.position.y = 5;
    scene.add(chamber);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    let isDragging = false, lastMouse = { x: 0, y: 0 };
    renderer.domElement.addEventListener('wheel', e => { e.preventDefault(); cameraStateRef.current.distance = Math.max(10, Math.min(50, cameraStateRef.current.distance + e.deltaY * 0.02)); });
    renderer.domElement.addEventListener('mousedown', e => { isDragging = true; lastMouse = { x: e.clientX, y: e.clientY }; });
    renderer.domElement.addEventListener('mousemove', e => {
      if (!isDragging) return;
      cameraStateRef.current.angle.y += (e.clientX - lastMouse.x) * 0.01;
      cameraStateRef.current.angle.x = Math.max(-1, Math.min(1.2, cameraStateRef.current.angle.x + (e.clientY - lastMouse.y) * 0.01));
      lastMouse = { x: e.clientX, y: e.clientY };
    });
    renderer.domElement.addEventListener('mouseup', () => { isDragging = false; });

    const depositAtom = (x, z, atomType) => {
      const y = 0.16 + depositedAtomsRef.current.length * 0.0015;
      const colors = { Si: 0x8B7355, N: 0x3333FF, O: 0xFF3333 };

      if (atomType === 'SiO2') {
        const group = new THREE.Group();
        const siGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const siMat = new THREE.MeshPhongMaterial({ color: colors.Si });
        const si = new THREE.Mesh(siGeo, siMat);
        group.add(si);
        const oGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const oMat = new THREE.MeshPhongMaterial({ color: colors.O });
        const o1 = new THREE.Mesh(oGeo, oMat);
        const o2 = new THREE.Mesh(oGeo, oMat);
        o1.position.set(-0.25, 0, 0);
        o2.position.set(0.25, 0, 0);
        group.add(o1, o2);
        group.position.set(x, Math.min(y, 3), z);
        group.rotation.y = Math.random() * Math.PI * 2;
        scene.add(group);
        depositedAtomsRef.current.push(group);
        setDepositionThickness(prev => prev + 0.015);
      } else if (atomType === 'SiOx') {
        const group = new THREE.Group();
        const siGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const siMat = new THREE.MeshPhongMaterial({ color: colors.Si });
        const si = new THREE.Mesh(siGeo, siMat);
        group.add(si);
        const oGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const oMat = new THREE.MeshPhongMaterial({ color: colors.O });
        const o = new THREE.Mesh(oGeo, oMat);
        o.position.set(0.22, 0, 0);
        group.add(o);
        group.position.set(x, Math.min(y, 3), z);
        group.rotation.y = Math.random() * Math.PI * 2;
        scene.add(group);
        depositedAtomsRef.current.push(group);
        setDepositionThickness(prev => prev + 0.012);
      } else if (atomType === 'a-Si') {
        // 비정질 실리콘 - Si 원자만
        const siGeo = new THREE.SphereGeometry(0.22, 8, 8);
        const siMat = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const si = new THREE.Mesh(siGeo, siMat);
        si.position.set(x, Math.min(y, 3), z);
        scene.add(si);
        depositedAtomsRef.current.push(si);
        setDepositionThickness(prev => prev + 0.018);
      } else if (atomType === 'SiNx') {
        // 질화규소 - Si + N
        const group = new THREE.Group();
        const siGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const siMat = new THREE.MeshPhongMaterial({ color: colors.Si });
        const si = new THREE.Mesh(siGeo, siMat);
        group.add(si);
        const nGeo = new THREE.SphereGeometry(0.16, 8, 8);
        const nMat = new THREE.MeshPhongMaterial({ color: colors.N });
        const n1 = new THREE.Mesh(nGeo, nMat);
        n1.position.set(0.22, 0.1, 0);
        group.add(n1);
        if (Math.random() > 0.3) {
          const n2 = new THREE.Mesh(nGeo, nMat);
          n2.position.set(-0.15, -0.15, 0.1);
          group.add(n2);
        }
        group.position.set(x, Math.min(y, 3), z);
        group.rotation.y = Math.random() * Math.PI * 2;
        scene.add(group);
        depositedAtomsRef.current.push(group);
        setDepositionThickness(prev => prev + 0.014);
      }
    };

    const animate = () => {
      frameId.current = requestAnimationFrame(animate);

      if (isPausedRef.current) {
        const { distance, angle } = cameraStateRef.current;
        camera.position.set(
          Math.cos(angle.y) * Math.cos(angle.x) * distance,
          Math.sin(angle.x) * distance + 5,
          Math.sin(angle.y) * Math.cos(angle.x) * distance
        );
        camera.lookAt(0, 4, 0);
        renderer.render(scene, camera);
        return;
      }

      timeRef.current += 0.016;

      const flows = gasFlowsRef.current;
      const totalFlow = flows.silane + flows.nitrousoxide + flows.hydrogen + flows.ammonia;
      const process = selectedProcessRef.current;

      // Spawn molecules - 공정별로 다른 가스
      if (totalFlow > 0 && Math.random() < 0.3) {
        let type = 'SiH4';
        const r = Math.sqrt(Math.random()) * 6;
        const ang = Math.random() * Math.PI * 2;
        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;

        if (process === 'SiO2') {
          const ratio = gasRatioRef.current;
          type = Math.random() < (1 / (ratio + 1)) ? 'SiH4' : 'N2O';
        } else if (process === 'a-Si') {
          // SiH4:H2 = 30:200 비율
          type = Math.random() < 0.13 ? 'SiH4' : 'H2';
        } else if (process === 'SiNx') {
          // SiH4:NH3 = 10:80 비율
          type = Math.random() < 0.11 ? 'SiH4' : 'NH3';
        }

        const mol = createMolecule(type, new THREE.Vector3(x, 9.7, z), THREE);
        if (mol) moleculesRef.current.push(mol);
      }

      // Electrons in plasma
      if (rfPowerOnRef.current && totalFlow > 0 && Math.random() < 0.1) {
        const ang = Math.random() * Math.PI * 2, r = Math.random() * 4;
        createElectron(new THREE.Vector3(Math.cos(ang)*r, 3 + Math.random()*4, Math.sin(ang)*r), THREE);
      }

      const surfaceY = 0.16 + depositedAtomsRef.current.length * 0.0008 + 0.05;

      // Update molecules
      moleculesRef.current = moleculesRef.current.filter(mol => {
        if (!mol.userData) return false;

        mol.position.add(mol.userData.velocity);
        mol.rotation.x += mol.userData.rotationSpeed.x;
        mol.rotation.y += mol.userData.rotationSpeed.y;
        mol.rotation.z += mol.userData.rotationSpeed.z;

        // Plasma dissociation
        if (mol.position.y < 7.5 && mol.position.y > 2.5) {
          const dist = Math.sqrt(mol.position.x**2 + mol.position.z**2);
          if (dist < 5.5 && rfPowerOnRef.current) {
            if (!mol.userData.dissociating && Math.random() < 0.06) {
              mol.userData.dissociating = true;
              for (let i = 0; i < 3; i++) {
                createElectron(mol.position.clone().add(new THREE.Vector3((Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3)), THREE);
              }
            }

            if (mol.userData.dissociating) {
              mol.userData.dissociateProgress += 0.04;
              mol.userData.atoms.forEach((atomData, i) => {
                if (i > 0) {
                  const dir = atomData.localPos.clone().normalize();
                  atomData.mesh.position.add(dir.multiplyScalar(0.015));
                }
              });
              mol.userData.bonds.forEach(bond => {
                bond.material.opacity = Math.max(0, 1 - mol.userData.dissociateProgress);
                bond.material.transparent = true;
              });

              if (mol.userData.dissociateProgress >= 1) {
                const pos = mol.position.clone();
                const vel = mol.userData.velocity.clone();
                const type = mol.userData.type;
                setDissociationCount(p => p + 1);

                // 증착 위치
                const depR = Math.sqrt(Math.random()) * 5.5;
                const depAng = Math.random() * Math.PI * 2;
                const depX = Math.cos(depAng) * depR;
                const depZ = Math.sin(depAng) * depR;

                // 공정별 증착
                if (process === 'SiO2') {
                  const ratio = gasRatioRef.current;
                  if (type === 'N2O') {
                    const stoichProb = Math.min(0.95, ratio / 20);
                    depositAtom(depX, depZ, Math.random() < stoichProb ? 'SiO2' : 'SiOx');
                  }
                } else if (process === 'a-Si') {
                  if (type === 'SiH4') {
                    depositAtom(depX, depZ, 'a-Si');
                  }
                } else if (process === 'SiNx') {
                  if (type === 'SiH4' || type === 'NH3') {
                    depositAtom(depX, depZ, 'SiNx');
                  }
                }

                // 분해 조각 생성
                if (type === 'SiH4') {
                  const frags = ['Si', 'SiH', 'SiH2', 'SiH3'];
                  const chosen = frags[Math.floor(Math.random() * frags.length)];
                  const hCount = chosen === 'Si' ? 4 : chosen === 'SiH' ? 3 : chosen === 'SiH2' ? 2 : 1;
                  createFragment(chosen, pos, vel.clone().add(new THREE.Vector3(0, -0.01, 0)), THREE);
                  for (let i = 0; i < hCount; i++) createFragment('H', pos.clone(), new THREE.Vector3((Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08), THREE);
                } else if (type === 'N2O') {
                  createFragment('N', pos.clone(), vel.clone().add(new THREE.Vector3(-0.02, -0.02, 0)), THREE);
                  createFragment('N', pos.clone(), vel.clone().add(new THREE.Vector3(0, -0.02, 0)), THREE);
                  createFragment('O', pos.clone(), vel.clone().add(new THREE.Vector3(0.02, -0.02, 0)), THREE);
                } else if (type === 'H2') {
                  createFragment('H', pos.clone(), vel.clone().add(new THREE.Vector3(-0.02, -0.02, 0)), THREE);
                  createFragment('H', pos.clone(), vel.clone().add(new THREE.Vector3(0.02, -0.02, 0)), THREE);
                } else if (type === 'NH3') {
                  createFragment('N', pos.clone(), vel.clone().add(new THREE.Vector3(0, -0.02, 0)), THREE);
                  for (let i = 0; i < 3; i++) createFragment('H', pos.clone(), new THREE.Vector3((Math.random()-0.5)*0.06, (Math.random()-0.5)*0.06, (Math.random()-0.5)*0.06), THREE);
                }

                scene.remove(mol);
                mol.traverse(c => { c.geometry?.dispose(); c.material?.dispose(); });
                return false;
              }
            }
          }
        }

        // Wafer collision
        const dist = Math.sqrt(mol.position.x**2 + mol.position.z**2);
        if (mol.position.y <= surfaceY && dist <= 6) {
          mol.position.y = surfaceY;
          mol.userData.velocity.y = 0;
          const pushDir = Math.atan2(mol.position.z, mol.position.x);
          mol.userData.velocity.x = Math.cos(pushDir) * 0.025;
          mol.userData.velocity.z = Math.sin(pushDir) * 0.025;
        }
        if (dist > 6 && mol.position.y <= surfaceY) {
          mol.userData.velocity.y = -0.05;
        }

        if (mol.position.y < -5 || dist > 12) {
          scene.remove(mol);
          mol.traverse(c => { c.geometry?.dispose(); c.material?.dispose(); });
          return false;
        }
        return true;
      });

      // Update fragments
      fragmentsRef.current = fragmentsRef.current.filter(frag => {
        frag.position.add(frag.userData.velocity);
        if (frag.userData.rotationSpeed) {
          frag.rotation.x += frag.userData.rotationSpeed.x;
          frag.rotation.y += frag.userData.rotationSpeed.y;
        }
        frag.userData.velocity.y -= 0.0006;

        const dist = Math.sqrt(frag.position.x**2 + frag.position.z**2);
        if (frag.position.y <= surfaceY && dist <= 6) {
          if (frag.userData.isRadical) {
            scene.remove(frag);
            frag.traverse(c => { c.geometry?.dispose(); c.material?.dispose(); });
            return false;
          }
          frag.position.y = surfaceY;
          frag.userData.velocity.y = 0;
          const pushDir = Math.atan2(frag.position.z, frag.position.x);
          frag.userData.velocity.x = Math.cos(pushDir) * 0.02;
          frag.userData.velocity.z = Math.sin(pushDir) * 0.02;
        }
        if (dist > 6) frag.userData.velocity.y = -0.05;

        if (frag.position.y < -5 || dist > 12) {
          scene.remove(frag);
          frag.traverse(c => { c.geometry?.dispose(); c.material?.dispose(); });
          return false;
        }
        return true;
      });

      // Update electrons
      electronsRef.current = electronsRef.current.filter(e => {
        e.position.add(e.userData.velocity);
        e.userData.velocity.multiplyScalar(0.96);
        e.userData.life--;
        if (e.position.y < 3 || e.position.y > 7) e.userData.velocity.y *= -0.8;
        const dist = Math.sqrt(e.position.x**2 + e.position.z**2);
        if (dist > 5) { e.userData.velocity.x *= -0.8; e.userData.velocity.z *= -0.8; }
        if (e.userData.life <= 0) {
          scene.remove(e);
          e.geometry.dispose();
          e.material.dispose();
          return false;
        }
        e.material.opacity = Math.min(0.9, e.userData.life / 25);
        return true;
      });

      // Plasma glow
      if (plasmaZoneRef.current) {
        if (rfPowerOnRef.current && totalFlow > 0) {
          plasmaZoneRef.current.material.opacity = 0.12 + Math.sin(timeRef.current * 5) * 0.04;
          plasmaZoneRef.current.material.color.setHex(0xff66ff);
        } else {
          plasmaZoneRef.current.material.opacity = 0.03;
          plasmaZoneRef.current.material.color.setHex(0x443366);
        }
      }

      const { distance, angle } = cameraStateRef.current;
      camera.position.set(
        Math.cos(angle.y) * Math.cos(angle.x) * distance,
        Math.sin(angle.x) * distance + 5,
        Math.sin(angle.y) * Math.cos(angle.x) * distance
      );
      camera.lookAt(0, 4, 0);
      renderer.render(scene, camera);
    };
    animate();
  };

  const handleReset = () => {
    [...moleculesRef.current, ...fragmentsRef.current, ...electronsRef.current, ...depositedAtomsRef.current].forEach(m => {
      sceneRef.current?.remove(m);
      m.traverse?.(c => { c.geometry?.dispose(); c.material?.dispose(); });
    });
    moleculesRef.current = [];
    fragmentsRef.current = [];
    electronsRef.current = [];
    depositedAtomsRef.current = [];
    setRfPowerOn(false);
    setIsPaused(false);
    setDepositionThickness(0);
    setDissociationCount(0);
    setShowRefractiveIndex(false);
  };

  const handleMeasureRI = () => {
    setIsPaused(true);
    setRfPowerOn(false);
    setShowRefractiveIndex(true);
  };

  useEffect(() => {
    if (threeLoaded) {
      initializeScene();
      const handleResize = () => {
        if (mountRef.current && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => {
        if (frameId.current) cancelAnimationFrame(frameId.current);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [threeLoaded]);

  if (!threeLoaded) return <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white text-xl">로딩 중...</div>;

  const currentRI = calculateRefractiveIndex(gasRatio);
  const currentH = calculateHydrogenContent(temperature);
  const currentDensity = calculateFilmDensity(temperature);
  const isRIGood = Math.abs(currentRI - 1.46) < 0.02;

  return (
    <div className="w-full bg-gray-900">
      {/* 슬라이더 스타일 */}
      <style>{`
        input[type="range"].slider-pecvd {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        input[type="range"].slider-pecvd::-webkit-slider-runnable-track {
          background: #fecaca;
          height: 12px;
          border-radius: 6px;
          border: 3px solid #dc2626;
        }
        input[type="range"].slider-pecvd::-moz-range-track {
          background: #fecaca;
          height: 12px;
          border-radius: 6px;
          border: 3px solid #dc2626;
        }
        input[type="range"].slider-pecvd::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -8px;
          background: linear-gradient(145deg, #ef4444, #dc2626);
          height: 28px;
          width: 28px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 3px 8px rgba(220, 38, 38, 0.6);
          cursor: pointer;
        }
        input[type="range"].slider-pecvd::-moz-range-thumb {
          background: linear-gradient(145deg, #ef4444, #dc2626);
          height: 24px;
          width: 24px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 3px 8px rgba(220, 38, 38, 0.6);
          cursor: pointer;
        }
        input[type="range"].slider-pecvd:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.8);
        }

        input[type="range"].slider-temp {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        input[type="range"].slider-temp::-webkit-slider-runnable-track {
          background: linear-gradient(to right, #bfdbfe, #fecaca);
          height: 12px;
          border-radius: 6px;
          border: 3px solid #f97316;
        }
        input[type="range"].slider-temp::-moz-range-track {
          background: linear-gradient(to right, #bfdbfe, #fecaca);
          height: 12px;
          border-radius: 6px;
          border: 3px solid #f97316;
        }
        input[type="range"].slider-temp::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -8px;
          background: linear-gradient(145deg, #fb923c, #ea580c);
          height: 28px;
          width: 28px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 3px 8px rgba(234, 88, 12, 0.6);
          cursor: pointer;
        }
        input[type="range"].slider-temp::-moz-range-thumb {
          background: linear-gradient(145deg, #fb923c, #ea580c);
          height: 24px;
          width: 24px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 3px 8px rgba(234, 88, 12, 0.6);
          cursor: pointer;
        }
      `}</style>

      {/* 시뮬레이터 영역 */}
      <div className="h-screen flex flex-col">
        <div className="bg-gray-800 border-b border-gray-700 p-3">
          <h1 className="text-xl font-bold text-white">🔬 PECVD 3D 분자 시뮬레이터</h1>
          <p className="text-gray-400 text-xs">플라즈마 화학 기상 증착 공정을 3D로 시각화합니다</p>
        </div>

        {/* 공정 선택 */}
        <div className="bg-gray-800 border-b border-gray-600 p-2 flex gap-2">
          <span className="text-gray-400 text-sm py-2 px-2">공정 선택:</span>
          <button
            onClick={() => { setSelectedProcess('a-Si'); handleReset(); }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              selectedProcess === 'a-Si'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            a-Si
          </button>
          <button
            onClick={() => { setSelectedProcess('SiNx'); handleReset(); }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              selectedProcess === 'SiNx'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            SiNx
          </button>
          <button
            onClick={() => { setSelectedProcess('SiO2'); handleReset(); }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              selectedProcess === 'SiO2'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            SiO₂
          </button>
        </div>

        {/* 시나리오 탭 (SiO2 전용) */}
        {selectedProcess === 'SiO2' && (
          <div className="bg-gray-800 border-b border-gray-600 p-2 flex gap-2">
            <button
              onClick={() => { setActiveScenario('scenario1'); handleReset(); setGasRatio(14); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                activeScenario === 'scenario1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📊 시나리오1: 굴절률 맞추기
            </button>
            <button
              onClick={() => { setActiveScenario('scenario2'); handleReset(); setTemperature(350); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                activeScenario === 'scenario2'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🌡️ 시나리오2: 저온 vs 고온
            </button>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative bg-black">
            <div ref={mountRef} className="w-full h-full" />

            {/* 증착 정보 */}
            <div className="absolute bottom-3 left-3 bg-gray-800/95 rounded-lg p-3 backdrop-blur">
              <div className="text-xs text-gray-400">증착 두께</div>
              <div className="text-2xl font-bold text-yellow-400">{depositionThickness.toFixed(1)} nm</div>
              <div className="text-xs text-gray-400 mt-1">분해: <span className="text-purple-400">{dissociationCount}</span></div>
            </div>

            {/* 굴절률 측정 결과 팝업 */}
            {showRefractiveIndex && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="bg-gray-800 rounded-xl p-6 border-2 border-blue-500 max-w-md">
                  <h3 className="text-xl font-bold text-white mb-4">📊 굴절률 측정 결과</h3>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold mb-2" style={{ color: isRIGood ? '#22c55e' : '#ef4444' }}>
                      n = {currentRI.toFixed(3)}
                    </div>
                    <div className="text-gray-400">목표: n = 1.460 ± 0.02</div>
                  </div>

                  {isRIGood ? (
                    <div className="bg-green-900/50 border border-green-500 rounded-lg p-3 mb-4">
                      <div className="text-green-400 font-bold">✅ 성공!</div>
                      <div className="text-green-300 text-sm">이상적인 화학양론적 SiO₂ 막입니다.</div>
                    </div>
                  ) : currentRI > 1.48 ? (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4">
                      <div className="text-red-400 font-bold">⚠️ Si-rich 막</div>
                      <div className="text-red-300 text-sm">N₂O 비율을 높여보세요. 산소가 부족합니다.</div>
                    </div>
                  ) : (
                    <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-3 mb-4">
                      <div className="text-yellow-400 font-bold">⚠️ O-rich 막</div>
                      <div className="text-yellow-300 text-sm">N₂O 비율이 너무 높습니다. 증착률이 낮아집니다.</div>
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mb-4">
                    현재 설정: N₂O/SiH₄ = {gasRatio}:1
                  </div>

                  <button
                    onClick={() => setShowRefractiveIndex(false)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}

            {/* 범례 */}
            <div className="absolute bottom-3 right-3 bg-gray-800/95 rounded-lg p-2 backdrop-blur text-xs">
              <div className="text-gray-400 mb-1">범례</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2"><span className="text-yellow-700">●</span><span className="text-gray-300">Si</span></div>
                <div className="flex items-center gap-2"><span className="text-white">●</span><span className="text-gray-300">H</span></div>
                <div className="flex items-center gap-2"><span className="text-blue-500">●</span><span className="text-gray-300">N</span></div>
                <div className="flex items-center gap-2"><span className="text-red-500">●</span><span className="text-gray-300">O</span></div>
                <div className="flex items-center gap-2"><span className="text-cyan-400">●</span><span className="text-gray-300">e⁻</span></div>
              </div>
            </div>
          </div>

          {/* 사이드 패널 */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto p-3 space-y-3">

            {/* a-Si 공정 */}
            {selectedProcess === 'a-Si' && (
              <>
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-500">
                  <h3 className="font-bold text-gray-200 mb-2">🔬 a-Si 비정질 실리콘</h3>
                  <p className="text-gray-400 text-sm">
                    SiH₄ + H₂ → a-Si:H<br/>
                    태양전지, TFT에 사용
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 text-xs">
                  <h4 className="text-sm font-bold text-white mb-2">가스 유량</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded">
                      <div className="text-gray-400">SiH₄</div>
                      <div className="text-cyan-400 font-bold">{gasFlows.silane} sccm</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded">
                      <div className="text-gray-400">H₂</div>
                      <div className="text-cyan-400 font-bold">{gasFlows.hydrogen} sccm</div>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400">
                    온도: <span className="text-yellow-400 font-bold">{processPresets['a-Si'].temperature}°C</span>
                  </div>
                </div>
              </>
            )}

            {/* SiNx 공정 */}
            {selectedProcess === 'SiNx' && (
              <>
                <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-500">
                  <h3 className="font-bold text-blue-300 mb-2">🔬 SiNx 질화규소</h3>
                  <p className="text-gray-300 text-sm">
                    SiH₄ + NH₃ → SiNx:H<br/>
                    패시베이션, 절연막에 사용
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 text-xs">
                  <h4 className="text-sm font-bold text-white mb-2">가스 유량</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded">
                      <div className="text-gray-400">SiH₄</div>
                      <div className="text-cyan-400 font-bold">{gasFlows.silane} sccm</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded">
                      <div className="text-gray-400">NH₃</div>
                      <div className="text-cyan-400 font-bold">{gasFlows.ammonia} sccm</div>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400">
                    NH₃/SiH₄ 비율: <span className="text-blue-400 font-bold">8:1</span>
                  </div>
                </div>
              </>
            )}

            {/* 시나리오1: 굴절률 맞추기 (SiO2 전용) */}
            {selectedProcess === 'SiO2' && activeScenario === 'scenario1' && (
              <>
                <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-500">
                  <h3 className="font-bold text-blue-300 mb-2">🎯 미션: 굴절률 맞추기</h3>
                  <p className="text-gray-300 text-sm">
                    N₂O/SiH₄ 가스 비율을 조절하여<br/>
                    <span className="text-yellow-400 font-bold">굴절률 n = 1.46 ± 0.02</span>를 달성하세요!
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <label className="block text-sm font-bold mb-3 text-red-400">
                    🧪 N₂O / SiH₄ 비율: {gasRatio}:1
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={gasRatio}
                    onChange={(e) => setGasRatio(parseInt(e.target.value))}
                    className="w-full slider-pecvd"
                    disabled={rfPowerOn}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>5:1 (Si-rich)</span>
                    <span className="text-green-400">14:1</span>
                    <span>25:1 (O-rich)</span>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded">
                      <div className="text-gray-400">SiH₄</div>
                      <div className="text-cyan-400 font-bold">{gasFlows.silane} sccm</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded">
                      <div className="text-gray-400">N₂O</div>
                      <div className="text-cyan-400 font-bold">{gasFlows.nitrousoxide} sccm</div>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400">
                    예상 굴절률: <span className={`font-bold ${isRIGood ? 'text-green-400' : 'text-yellow-400'}`}>
                      n ≈ {currentRI.toFixed(3)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* 시나리오2: 온도 비교 (SiO2 전용) */}
            {selectedProcess === 'SiO2' && activeScenario === 'scenario2' && (
              <>
                <div className="bg-orange-900/50 rounded-lg p-4 border border-orange-500">
                  <h3 className="font-bold text-orange-300 mb-2">🌡️ 미션: 온도 영향 관찰</h3>
                  <p className="text-gray-300 text-sm">
                    온도를 변경하면서<br/>
                    <span className="text-yellow-400 font-bold">수소 함량과 막 밀도</span>의 변화를 관찰하세요!
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <label className="block text-sm font-bold mb-3 text-orange-400">
                    🌡️ 기판 온도: {temperature}°C
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="450"
                    step="10"
                    value={temperature}
                    onChange={(e) => setTemperature(parseInt(e.target.value))}
                    className="w-full slider-temp"
                    disabled={rfPowerOn}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>200°C (저온)</span>
                    <span>450°C (고온)</span>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                  <h4 className="text-sm font-bold text-white mb-2">📊 막 특성 예측</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">수소 함량 (H%)</span>
                        <span className={`font-bold ${currentH > 15 ? 'text-red-400' : 'text-green-400'}`}>
                          {currentH.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${currentH > 15 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${currentH * 3}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">막 밀도</span>
                        <span className={`font-bold ${currentDensity > 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {currentDensity.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${currentDensity > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${currentDensity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-3 border text-xs ${
                  temperature < 280 ? 'bg-blue-900/30 border-blue-500' :
                  temperature > 400 ? 'bg-red-900/30 border-red-500' :
                  'bg-green-900/30 border-green-500'
                }`}>
                  {temperature < 280 ? (
                    <>
                      <div className="font-bold text-blue-400">❄️ 저온 공정</div>
                      <div className="text-blue-200 mt-1">
                        • H 함량 높음 → 버블 위험<br/>
                        • 막 밀도 낮음 → 약한 절연<br/>
                        • 장점: 열손상 방지
                      </div>
                    </>
                  ) : temperature > 400 ? (
                    <>
                      <div className="font-bold text-red-400">🔥 고온 공정</div>
                      <div className="text-red-200 mt-1">
                        • H 함량 낮음 → 안정적<br/>
                        • 막 밀도 높음 → 우수한 절연<br/>
                        • 단점: 열손상 가능
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-green-400">✅ 최적 온도 범위</div>
                      <div className="text-green-200 mt-1">
                        • 적절한 H 함량<br/>
                        • 좋은 막 밀도<br/>
                        • 열손상과 품질 균형
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* 공통 컨트롤 */}
            <button
              onClick={() => setRfPowerOn(!rfPowerOn)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                rfPowerOn
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-green-600 text-white hover:bg-green-500'
              }`}
            >
              {rfPowerOn ? '⚡ RF OFF' : '⚡ RF ON - 증착 시작'}
            </button>

            {selectedProcess === 'SiO2' && activeScenario === 'scenario1' && (
              <button
                onClick={handleMeasureRI}
                disabled={depositionThickness < 5}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                  depositionThickness < 5
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-500'
                }`}
              >
                {depositionThickness < 5 ? '📊 5nm 이상 증착 필요' : '📊 굴절률 측정하기'}
              </button>
            )}

            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                isPaused
                  ? 'bg-blue-600 text-white'
                  : 'bg-yellow-600 text-white hover:bg-yellow-500'
              }`}
            >
              {isPaused ? '▶️ 재생' : '⏸️ 정지'}
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm"
            >
              🔄 리셋
            </button>
          </div>
        </div>
      </div>

      {/* 교육 설명 섹션 (SiO2 전용) */}
      {selectedProcess === 'SiO2' && (
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📚 SiO₂ PECVD 공정 학습 가이드</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 시나리오1 설명 */}
          <div className="bg-gray-900 rounded-lg p-4 border border-blue-800">
            <h3 className="text-blue-400 font-bold mb-3 text-lg">📊 시나리오1: 굴절률과 가스 비율</h3>
            <div className="text-gray-300 text-sm space-y-3">
              <p>
                <span className="text-yellow-400 font-bold">왜 N₂O/SiH₄ 비율이 14:1인가요?</span><br/>
                이론적으로 SiO₂를 만들려면 N₂O 2개가 필요합니다 (2:1).<br/>
                하지만 N₂O는 <span className="text-red-400">분해율이 매우 낮아서</span> 실제로는 14:1 이상이 필요합니다.
              </p>
              <div className="bg-black/30 p-3 rounded">
                <div className="font-mono text-xs">
                  <div className="text-cyan-400">SiH₄ + 2N₂O → SiO₂ + 2N₂ + 2H₂</div>
                  <div className="text-gray-500 mt-1">이론 비율: 2:1</div>
                  <div className="text-yellow-400 mt-1">실제 필요: 14:1 (N₂O 분해율 ~15%)</div>
                </div>
              </div>
              <p>
                <span className="text-green-400 font-bold">굴절률로 막 조성 판단:</span>
              </p>
              <ul className="list-disc ml-4 text-xs space-y-1">
                <li><span className="text-red-400">n {">"} 1.50</span>: Si-rich (산소 부족) → N₂O 증가 필요</li>
                <li><span className="text-green-400">n ≈ 1.46</span>: 화학양론적 SiO₂ (최적)</li>
                <li><span className="text-blue-400">n {"<"} 1.45</span>: O-rich → 증착률 급감</li>
              </ul>
            </div>
          </div>

          {/* 시나리오2 설명 */}
          <div className="bg-gray-900 rounded-lg p-4 border border-orange-800">
            <h3 className="text-orange-400 font-bold mb-3 text-lg">🌡️ 시나리오2: 온도의 영향</h3>
            <div className="text-gray-300 text-sm space-y-3">
              <p>
                <span className="text-yellow-400 font-bold">PECVD 막에는 수소(H)가 포함됩니다</span><br/>
                SiH₄ 분해 시 모든 H가 제거되지 않고 막에 남습니다.<br/>
                이 수소 함량이 막의 품질을 결정합니다.
              </p>
              <div className="bg-black/30 p-3 rounded text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="text-left">온도</th>
                      <th className="text-center">H 함량</th>
                      <th className="text-center">막 밀도</th>
                      <th className="text-right">특징</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    <tr>
                      <td className="text-blue-400">200°C</td>
                      <td className="text-center text-red-400">~25%</td>
                      <td className="text-center text-yellow-400">낮음</td>
                      <td className="text-right text-xs">버블 위험</td>
                    </tr>
                    <tr>
                      <td className="text-green-400">350°C</td>
                      <td className="text-center text-green-400">~12%</td>
                      <td className="text-center text-green-400">적정</td>
                      <td className="text-right text-xs">일반 공정</td>
                    </tr>
                    <tr>
                      <td className="text-red-400">450°C</td>
                      <td className="text-center text-green-400">~5%</td>
                      <td className="text-center text-green-400">높음</td>
                      <td className="text-right text-xs">열손상 주의</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <span className="text-red-400 font-bold">수소가 왜 문제인가요?</span><br/>
                후속 고온 공정에서 H₂ 가스가 발생 → 버블(bubble) 형성 → 막 박리
              </p>
            </div>
          </div>
        </div>

        {/* 핵심 요약 */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4 border border-purple-500">
          <h3 className="text-purple-300 font-bold mb-2">💡 핵심 요약</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-blue-400 font-bold">가스 비율:</span>
              <ul className="ml-4 mt-1 text-xs">
                <li>• N₂O/SiH₄ ≈ 14:1 → 굴절률 n = 1.46</li>
                <li>• 비율 낮으면 Si-rich, 높으면 O-rich</li>
                <li>• 굴절률로 막 조성 모니터링 가능</li>
              </ul>
            </div>
            <div>
              <span className="text-orange-400 font-bold">온도:</span>
              <ul className="ml-4 mt-1 text-xs">
                <li>• 높을수록 H 함량↓, 밀도↑, 품질↑</li>
                <li>• 하지만 기판/소자 열손상 위험</li>
                <li>• 일반적으로 300~400°C 사용</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PECVDSimulator;
