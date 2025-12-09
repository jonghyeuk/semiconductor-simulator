import React, { useState, useEffect, useRef } from 'react';

const PECVDSimulator = () => {
  const [depositionThickness, setDepositionThickness] = useState(0);
  const [dissociationCount, setDissociationCount] = useState(0);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [rfPowerOn, setRfPowerOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  const processPresets = {
    'a-Si': {
      name: 'a-Si (비정질 실리콘)',
      color: '#888888',
      gases: { silane: 30, hydrogen: 200, ammonia: 0, nitrousoxide: 0 },
      pressure: 1000,  // 1 Torr = 1000 mTorr
      temperature: 250,
      power: 20
    },
    'SiNx': {
      name: 'SiNx (질화규소)',
      color: '#4488ff',
      gases: { silane: 10, hydrogen: 0, ammonia: 80, nitrousoxide: 0 },  // NH3/SiH4 = 8:1
      pressure: 300,   // 0.3 Torr
      temperature: 350,
      power: 20
    },
    'SiO2': {
      name: 'SiO₂ (산화규소)',
      color: '#ff6666',
      gases: { silane: 50, hydrogen: 0, ammonia: 0, nitrousoxide: 710 },  // N2O/SiH4 ≈ 14:1
      pressure: 1000,  // 1 Torr
      temperature: 350,
      power: 20
    }
  };

  const [gasFlows, setGasFlows] = useState({ silane: 0, hydrogen: 0, ammonia: 0, nitrousoxide: 0 });
  const [processPressure, setProcessPressure] = useState(10);
  const [substrateTemp, setSubstrateTemp] = useState(350);
  const [rfPower, setRfPower] = useState(300);

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
  const depositLayerRef = useRef(0);
  const lastDepositTimeRef = useRef(0);
  const rfPowerOnRef = useRef(false);
  const gasFlowsRef = useRef(gasFlows);
  const cameraStateRef = useRef({ distance: 22, angle: { x: 0.3, y: 0 } });
  const selectedProcessRef = useRef(null);

  useEffect(() => { rfPowerOnRef.current = rfPowerOn; }, [rfPowerOn]);
  useEffect(() => { gasFlowsRef.current = gasFlows; }, [gasFlows]);
  useEffect(() => { selectedProcessRef.current = selectedProcess; }, [selectedProcess]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const selectProcess = (key) => {
    const preset = processPresets[key];
    setSelectedProcess(key);
    setGasFlows(preset.gases);
    setProcessPressure(preset.pressure);
    setSubstrateTemp(preset.temperature);
    setRfPower(preset.power);
    setRfPowerOn(false);
    setDepositionThickness(0);
    setDissociationCount(0);
  };

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
    } else if (type === 'H2') {
      const pos1 = new THREE.Vector3(-0.15, 0, 0);
      const pos2 = new THREE.Vector3(0.15, 0, 0);
      const h1 = createAtom(atomColors.H, atomSizes.H, pos1);
      const h2 = createAtom(atomColors.H, atomSizes.H, pos2);
      atoms.push({ mesh: h1, type: 'H', localPos: pos1.clone() });
      atoms.push({ mesh: h2, type: 'H', localPos: pos2.clone() });
      group.add(h1, h2);
      const bond = createBond(pos1, pos2);
      bonds.push(bond);
      group.add(bond);
    } else if (type === 'NH3') {
      const nPos = new THREE.Vector3(0, 0, 0);
      const n = createAtom(atomColors.N, atomSizes.N, nPos);
      atoms.push({ mesh: n, type: 'N', localPos: nPos.clone() });
      group.add(n);
      const angles = [0, 2.094, 4.189];
      angles.forEach(ang => {
        const pos = new THREE.Vector3(Math.cos(ang) * bondLen * 0.9, -bondLen * 0.5, Math.sin(ang) * bondLen * 0.9);
        const h = createAtom(atomColors.H, atomSizes.H, pos);
        atoms.push({ mesh: h, type: 'H', localPos: pos.clone() });
        group.add(h);
        const bond = createBond(nPos, pos);
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
      // N은 SiNx 공정에서만 라디칼, SiO2에서는 그냥 흘러감
      // O는 SiO2 공정에서만 라디칼
      const isRadical = (atomType === 'Si') ||
                        (atomType === 'N' && selectedProcessRef.current === 'SiNx') ||
                        (atomType === 'O' && selectedProcessRef.current === 'SiO2');
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
        // SiO2 분자 형태로 증착 (Si 하나 + O 두개)
        const group = new THREE.Group();

        // Si 중심
        const siGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const siMat = new THREE.MeshPhongMaterial({ color: colors.Si });
        const si = new THREE.Mesh(siGeo, siMat);
        group.add(si);

        // O 두 개
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
        // SiOx (Si + O 하나)
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
      } else if (atomType === 'SiN') {
        // SiN (Si + N)
        const group = new THREE.Group();

        const siGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const siMat = new THREE.MeshPhongMaterial({ color: colors.Si });
        const si = new THREE.Mesh(siGeo, siMat);
        group.add(si);

        const nGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const nMat = new THREE.MeshPhongMaterial({ color: colors.N });
        const n = new THREE.Mesh(nGeo, nMat);
        n.position.set(0.23, 0, 0);
        group.add(n);

        group.position.set(x, Math.min(y, 3), z);
        group.rotation.y = Math.random() * Math.PI * 2;
        scene.add(group);
        depositedAtomsRef.current.push(group);
        setDepositionThickness(prev => prev + 0.012);
      } else {
        // 단일 원자 (a-Si)
        const geo = new THREE.SphereGeometry(0.2, 8, 8);
        const mat = new THREE.MeshPhongMaterial({ color: colors[atomType] || 0x8B7355 });
        const atom = new THREE.Mesh(geo, mat);
        atom.position.set(x, Math.min(y, 3), z);
        scene.add(atom);
        depositedAtomsRef.current.push(atom);
        setDepositionThickness(prev => prev + 0.01);
      }
    };

    const animate = () => {
      frameId.current = requestAnimationFrame(animate);

      // 정지 상태면 렌더링만 하고 업데이트 안 함
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
      const totalFlow = flows.silane + flows.hydrogen + flows.ammonia + flows.nitrousoxide;

      // Spawn molecules from showerhead - 균일 분포
      if (totalFlow > 0 && Math.random() < totalFlow / 100) {
        const types = [];
        if (flows.silane > 0) for (let i = 0; i < flows.silane/25; i++) types.push('SiH4');
        if (flows.hydrogen > 0) for (let i = 0; i < flows.hydrogen/25; i++) types.push('H2');
        if (flows.ammonia > 0) for (let i = 0; i < flows.ammonia/25; i++) types.push('NH3');
        if (flows.nitrousoxide > 0) for (let i = 0; i < flows.nitrousoxide/25; i++) types.push('N2O');
        if (types.length > 0) {
          const type = types[Math.floor(Math.random() * types.length)];
          // 균일한 원형 분포
          const r = Math.sqrt(Math.random()) * 6;
          const ang = Math.random() * Math.PI * 2;
          const x = Math.cos(ang) * r;
          const z = Math.sin(ang) * r;
          const mol = createMolecule(type, new THREE.Vector3(x, 9.7, z), THREE);
          if (mol) moleculesRef.current.push(mol);
        }
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

                // 분해 시 웨이퍼 전체에 균일하게 증착 (은근슬쩍)
                const process = selectedProcessRef.current;
                const depR = Math.sqrt(Math.random()) * 5.5;
                const depAng = Math.random() * Math.PI * 2;
                const depX = Math.cos(depAng) * depR;
                const depZ = Math.sin(depAng) * depR;

                if (type === 'SiH4') {
                  if (process === 'a-Si') {
                    depositAtom(depX, depZ, 'Si');
                    // a-Si는 추가로 더 증착
                    if (Math.random() < 0.5) {
                      const depR2 = Math.sqrt(Math.random()) * 5.5;
                      const depAng2 = Math.random() * Math.PI * 2;
                      depositAtom(Math.cos(depAng2) * depR2, Math.sin(depAng2) * depR2, 'Si');
                      const depR3 = Math.sqrt(Math.random()) * 5.5;
                      const depAng3 = Math.random() * Math.PI * 2;
                      depositAtom(Math.cos(depAng3) * depR3, Math.sin(depAng3) * depR3, 'Si');
                    }
                  }
                } else if (type === 'NH3' && process === 'SiNx') {
                  // SiNx: SiH4 분해 시 SiN 증착
                  depositAtom(depX, depZ, 'SiN');
                } else if (type === 'N2O' && process === 'SiO2') {
                  // SiO2: N2O 분해 시 SiO2 증착
                  depositAtom(depX, depZ, Math.random() < 0.8 ? 'SiO2' : 'SiOx');
                }

                if (type === 'SiH4') {
                  const frags = ['Si', 'SiH', 'SiH2', 'SiH3'];
                  const chosen = frags[Math.floor(Math.random() * frags.length)];
                  const hCount = chosen === 'Si' ? 4 : chosen === 'SiH' ? 3 : chosen === 'SiH2' ? 2 : 1;
                  createFragment(chosen, pos, vel.clone().add(new THREE.Vector3(0, -0.01, 0)), THREE);
                  for (let i = 0; i < hCount; i++) createFragment('H', pos.clone(), new THREE.Vector3((Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08), THREE);
                } else if (type === 'H2') {
                  createFragment('H', pos.clone(), new THREE.Vector3(-0.04, 0, 0), THREE);
                  createFragment('H', pos.clone(), new THREE.Vector3(0.04, 0, 0), THREE);
                } else if (type === 'NH3') {
                  createFragment('N', pos, vel, THREE);
                  for (let i = 0; i < 3; i++) createFragment('H', pos.clone(), new THREE.Vector3((Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08, (Math.random()-0.5)*0.08), THREE);
                } else if (type === 'N2O') {
                  createFragment('N', pos.clone(), vel.clone().add(new THREE.Vector3(-0.02, -0.02, 0)), THREE);
                  createFragment('N', pos.clone(), vel.clone().add(new THREE.Vector3(0, -0.02, 0)), THREE);
                  createFragment('O', pos.clone(), vel.clone().add(new THREE.Vector3(0.02, -0.02, 0)), THREE);
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
            // 라디칼은 흡수됨 (이미 분해 시 증착했으므로 여기선 그냥 사라짐)
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
    depositLayerRef.current = 0;
    lastDepositTimeRef.current = 0;
    setSelectedProcess(null);
    setRfPowerOn(false);
    setIsPaused(false);
    setDepositionThickness(0);
    setDissociationCount(0);
    setGasFlows({ silane: 0, hydrogen: 0, ammonia: 0, nitrousoxide: 0 });
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

  const totalFlow = gasFlows.silane + gasFlows.hydrogen + gasFlows.ammonia + gasFlows.nitrousoxide;

  return (
    <div className="w-full bg-gray-900">
      {/* 시뮬레이터 영역 - 화면 전체 높이 */}
      <div className="h-screen flex flex-col">
        <div className="bg-gray-800 border-b border-gray-700 p-3">
          <h1 className="text-xl font-bold text-white">🔬 PECVD 분자 시뮬레이터</h1>
          <p className="text-gray-400 text-xs">RF OFF: 분자가 그대로 흘러내림 | RF ON: 플라즈마에서 분해 → Si 박막 증착</p>
        </div>

        <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-black">
          <div ref={mountRef} className="w-full h-full" />

          <div className="absolute top-3 left-3 right-3 flex justify-center">
            <div className="bg-gray-800/95 rounded-lg p-2 backdrop-blur flex gap-2">
              {Object.entries(processPresets).map(([key, preset]) => (
                <button key={key} onClick={() => selectProcess(key)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedProcess === key ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.color }} />
                    <span>{key}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 bg-gray-800/95 rounded-lg p-3 backdrop-blur">
            <div className="text-xs text-gray-400">증착 두께</div>
            <div className="text-2xl font-bold text-yellow-400">{depositionThickness.toFixed(1)} nm</div>
            <div className="text-xs text-gray-400 mt-1">분해: <span className="text-purple-400">{dissociationCount}</span></div>
          </div>

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

        <div className="w-72 bg-gray-800 border-l border-gray-700 overflow-y-auto p-3 space-y-3">
          {selectedProcess && (
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-3 border border-indigo-500">
              <h2 className="font-bold text-white mb-2">{processPresets[selectedProcess].name}</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/40 p-2 rounded"><div className="text-gray-400">압력</div><div className="text-cyan-400 font-bold">{processPressure} mTorr</div></div>
                <div className="bg-black/40 p-2 rounded"><div className="text-gray-400">온도</div><div className="text-orange-400 font-bold">{substrateTemp}°C</div></div>
                <div className="bg-black/40 p-2 rounded"><div className="text-gray-400">RF Power</div><div className="text-yellow-400 font-bold">{rfPower}W</div></div>
                <div className="bg-black/40 p-2 rounded"><div className="text-gray-400">총 유량</div><div className="text-green-400 font-bold">{totalFlow} sccm</div></div>
              </div>
              <div className="mt-2 bg-black/30 rounded p-2 text-xs">
                <div className="text-gray-400 mb-1">가스 조성</div>
                {gasFlows.silane > 0 && <div className="flex justify-between"><span className="text-white">SiH₄</span><span className="text-blue-300">{gasFlows.silane} sccm</span></div>}
                {gasFlows.hydrogen > 0 && <div className="flex justify-between"><span className="text-white">H₂</span><span className="text-blue-300">{gasFlows.hydrogen} sccm</span></div>}
                {gasFlows.ammonia > 0 && <div className="flex justify-between"><span className="text-white">NH₃</span><span className="text-blue-300">{gasFlows.ammonia} sccm</span></div>}
                {gasFlows.nitrousoxide > 0 && <div className="flex justify-between"><span className="text-white">N₂O</span><span className="text-blue-300">{gasFlows.nitrousoxide} sccm</span></div>}
              </div>
            </div>
          )}

          <button onClick={() => setRfPowerOn(!rfPowerOn)} disabled={!selectedProcess}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${!selectedProcess ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : rfPowerOn ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white hover:bg-green-500'}`}>
            {!selectedProcess ? '공정 선택 필요' : rfPowerOn ? '⚡ RF OFF' : '⚡ RF ON'}
          </button>

          <button onClick={() => setIsPaused(!isPaused)} disabled={!selectedProcess}
            className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${!selectedProcess ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : isPaused ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white hover:bg-yellow-500'}`}>
            {isPaused ? '▶️ 재생' : '⏸️ 정지'}
          </button>

          <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 text-xs">
            <h3 className="font-bold text-white mb-2">공정 상태</h3>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-400">가스</span><span className={totalFlow > 0 ? 'text-green-400' : 'text-gray-500'}>{totalFlow > 0 ? '● 주입중' : '○ 없음'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">플라즈마</span><span className={rfPowerOn ? 'text-purple-400' : 'text-gray-500'}>{rfPowerOn ? '● ON' : '○ OFF'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">증착</span><span className={rfPowerOn && totalFlow > 0 ? 'text-yellow-400' : 'text-gray-500'}>{rfPowerOn && totalFlow > 0 ? '● 진행' : '○ 정지'}</span></div>
            </div>
          </div>

          <button onClick={handleReset} className="w-full py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm">🔄 리셋</button>

          {!selectedProcess && (
            <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-500/50 text-center">
              <div className="text-3xl mb-2">👆</div>
              <div className="text-blue-200 text-sm">상단에서 공정 선택</div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* PECVD 공정 설명 섹션 - 시뮬레이터 아래 별도 영역 */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📚 PECVD 공정 이해하기</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 박막 명명법 */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
            <h3 className="text-yellow-400 font-bold mb-2 text-sm">🏷️ 박막 명명법</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>
                <span className="text-cyan-300 font-bold">a-Si</span>: 'a'는 amorphous(비정질)의 약자입니다. 결정 구조가 없는 무질서한 실리콘 박막을 의미하며, PECVD의 저온 공정 특성상 결정화가 일어나지 않아 비정질 구조가 형성됩니다.
              </p>
              <p>
                <span className="text-cyan-300 font-bold">SiNx</span>: 화학양론적 Si₃N₄가 아닌 이유는 PECVD 공정에서 Si:N 비율을 정확히 3:4로 맞추기 어렵기 때문입니다. 공정 조건에 따라 Si-rich 또는 N-rich 막이 형성되므로 'x'로 가변 조성을 표현합니다.
              </p>
              <p>
                <span className="text-cyan-300 font-bold">SiO₂</span>: 실제로는 SiOx로 표기하기도 하며, N₂O/SiH₄ 비율에 따라 산소 함량이 달라집니다. 이상적인 SiO₂ 조성을 위해서는 높은 N₂O 비율(10:1 이상)이 필요합니다.
              </p>
            </div>
          </div>

          {/* 장점 */}
          <div className="bg-gray-900 rounded-lg p-4 border border-green-800">
            <h3 className="text-green-400 font-bold mb-2 text-sm">✅ PECVD의 장점</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• <span className="text-white font-medium">저온 공정</span>: 200~400°C에서 증착 가능 (열산화 900°C+ 대비 절반 이하)</li>
              <li>• <span className="text-white font-medium">다양한 박막</span>: 가스 조합만 바꿔 SiO₂, SiNx, a-Si 등 다양한 막 증착</li>
              <li>• <span className="text-white font-medium">조성 제어</span>: 가스 비율 조절로 막의 특성(응력, 굴절률, 유전율) 튜닝 가능</li>
              <li>• <span className="text-white font-medium">높은 증착률</span>: 플라즈마 에너지로 반응 활성화 → 빠른 성막 (수십~수백 nm/min)</li>
              <li>• <span className="text-white font-medium">대면적 균일성</span>: 샤워헤드 구조로 300mm 이상 대형 기판 처리 가능</li>
              <li>• <span className="text-white font-medium">단순한 원리</span>: 원하는 가스를 넣고 플라즈마로 분해하면 박막 형성!</li>
            </ul>
          </div>

          {/* 공정의 어려움 */}
          <div className="bg-gray-900 rounded-lg p-4 border border-red-800">
            <h3 className="text-red-400 font-bold mb-2 text-sm">⚠️ 공정의 어려움</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• <span className="text-white font-medium">균일도 확보</span>: 플라즈마 밀도, 가스 분포, 온도 균일성을 동시에 제어해야 함</li>
              <li>• <span className="text-white font-medium">조성 일정성</span>: 가스 비율의 미세한 변화 → 막질 급변 (굴절률, 응력 변화)</li>
              <li>• <span className="text-white font-medium">파티클 문제</span>:
                <span className="text-gray-400 block ml-3">- 과도한 가스 유량 → 기상 반응으로 분말(powder) 생성</span>
                <span className="text-gray-400 block ml-3">- 챔버벽 박리 → 웨이퍼 오염 및 수율 저하</span>
                <span className="text-gray-400 block ml-3">- 샤워헤드 구멍 막힘 → 불균일 증착</span>
              </li>
              <li>• <span className="text-white font-medium">펌프 손상</span>: SiH₄ 분해물이 펌프에 축적 → 오일 오염, 펌프 수명 단축</li>
              <li>• <span className="text-white font-medium">플라즈마 불안정</span>: 압력/파워 설정 오류 → 아킹(arcing), 불균일 플라즈마</li>
              <li>• <span className="text-white font-medium">수소 함량</span>: PECVD 막은 H 함량이 높아 후속 열처리 시 버블 발생 가능</li>
            </ul>
          </div>

          {/* 공정 변수 영향 */}
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-800">
            <h3 className="text-purple-400 font-bold mb-2 text-sm">🔬 공정 변수의 영향</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p><span className="text-yellow-300">RF 파워 ↑</span> → 분해율 ↑, 증착률 ↑, 막 밀도 ↑, 하지만 기판 손상 위험 ↑</p>
              <p><span className="text-yellow-300">압력 ↑</span> → 증착률 ↑, 하지만 균일도 ↓, 파티클 위험 ↑</p>
              <p><span className="text-yellow-300">온도 ↑</span> → H 함량 ↓, 막질 ↑, 하지만 기판/소자 손상 위험 ↑</p>
              <p><span className="text-yellow-300">가스비 변화</span> → 조성비 변화 (Si-rich ↔ N/O-rich)</p>
            </div>
            <div className="mt-3 bg-blue-900/30 rounded p-2 border border-blue-500/30">
              <p className="text-blue-200 text-xs">
                💡 PECVD는 "가스를 넣고 플라즈마로 분해하면 쉽게 원하는 박막을 만들 수 있다"는 장점이 있지만, 이는 모든 공정 변수가 최적화되었을 때의 이야기입니다. 실제로는 수많은 변수들의 복잡한 상호작용을 이해하고 정밀하게 제어해야 하는 고난도 공정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PECVDSimulator;
