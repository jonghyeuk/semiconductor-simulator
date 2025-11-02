import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import * as THREE from 'three';

// ============================================================
// SiliconEtchingSimulator Component (Three.js 3D Simulator)
// ============================================================


const SiliconEtchingSimulator = () => {
  const [gasType, setGasType] = useState('fluorine');
  const [isRunning, setIsRunning] = useState(false);
  const [etchDepth, setEtchDepth] = useState(0);
  const [particleCount, setParticleCount] = useState(0);
  const [dissociationCount, setDissociationCount] = useState(0);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameId = useRef(null);
  const gasMoleculesRef = useRef([]);
  const radicalsRef = useRef([]);
  const byproductsRef = useRef([]);
  const siliconRef = useRef(null);
  const plasmaZoneRef = useRef(null);
  const timeRef = useRef(0);
  const isRunningRef = useRef(false);
  const dissociatingMoleculesRef = useRef([]); // 분해 중인 분자들
  const gasTypeRef = useRef(gasType); // gasType을 ref로도 추적
  const siAtomsRef = useRef([]); // Si 원자 배열 추적

  const gasProperties = {
    fluorine: {
      name: 'SF₆ (육불화황)',
      moleculeColor: 0x99cc66, // 황록색
      radicalColor: 0x66ff66, // 밝은 녹색 라디칼
      radical: 'F*',
      radicalCount: 6, // SF6 → 6F
      speed: 0.12,
      reactivity: 0.9,
      isotropic: true,
      byproduct: 'SiF₄',
      byproductColor: 0x88ffcc,
      dissociationFormula: 'SF₆ → S + 6F*',
      reactionFormula: 'Si(s) + 4F* → SiF₄(g)',
      description: '빠른 등방성 식각, 높은 휘발성',
      structure: 'octahedral' // SF6는 팔면체 구조
    },
    cf4: {
      name: 'CF₄ (사불화탄소)',
      moleculeColor: 0x555555, // 어두운 회색 (탄소)
      radicalColor: 0x66ff66, // 밝은 녹색 라디칼
      radical: 'F*',
      radicalCount: 4, // CF4 → 4F
      speed: 0.10,
      reactivity: 0.75,
      isotropic: true,
      byproduct: 'SiF₄',
      byproductColor: 0x88ffcc,
      dissociationFormula: 'CF₄ → C + 4F*',
      reactionFormula: 'Si(s) + 4F* → SiF₄(g)',
      description: '중간 속도 등방성 식각, 안정적',
      structure: 'tetrahedral' // CF4는 사면체 구조
    },
    chlorine: {
      name: 'Cl₂ (염소)',
      moleculeColor: 0x44dd44, // 녹색 (염소)
      radicalColor: 0x66ff66, // 밝은 녹색 라디칼
      radical: 'Cl*',
      radicalCount: 2, // Cl2 → 2Cl
      speed: 0.06,
      reactivity: 0.6,
      isotropic: false,
      byproduct: 'SiCl₄',
      byproductColor: 0xaaffaa,
      dissociationFormula: 'Cl₂ → 2Cl*',
      reactionFormula: 'Si(s) + 4Cl* → SiCl₄(g)',
      description: '느린 이방성 식각, 수직 방향성',
      structure: 'diatomic' // Cl2는 2원자 분자
    },
    bromine: {
      name: 'HBr (브롬화수소)',
      moleculeColor: 0x8b4513, // 밤색 (브롬)
      radicalColor: 0xaa6633, // 밝은 밤색 라디칼
      radical: 'Br*',
      radicalCount: 1, // HBr → H + Br
      speed: 0.08,
      reactivity: 0.7,
      isotropic: false,
      byproduct: 'SiBr₄',
      byproductColor: 0xddaa77,
      dissociationFormula: 'HBr → H + Br*',
      reactionFormula: 'Si(s) + 4Br* → SiBr₄(g)',
      description: '중간 속도, 깊은 트렌치 식각',
      structure: 'diatomic' // HBr은 2원자 분자
    }
  };

  const initializeScene = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(18, 12, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(10, 15, 5);
    scene.add(directionalLight);

    // Plasma zone (glowing area where dissociation happens)
    const plasmaGeometry = new THREE.CylinderGeometry(5, 5, 3.5, 32); // 웨이퍼보다 약간 작게
    const plasmaMaterial = new THREE.MeshPhongMaterial({
      color: 0x6644ff,
      transparent: true,
      opacity: 0.12, // 투명도 감소
      emissive: 0x6644ff,
      emissiveIntensity: 0.2
    });
    const plasmaZone = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    plasmaZone.position.y = 4;
    scene.add(plasmaZone);
    plasmaZoneRef.current = plasmaZone;

    // Add plasma glow effect
    const glowGeometry = new THREE.SphereGeometry(6, 32, 32); // 크기 조정
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x8866ff,
      transparent: true,
      opacity: 0.03 // 투명도 감소: 0.05 -> 0.03
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 4;
    scene.add(glow);

    // Silicon wafer (원형 웨이퍼)
    const siliconGeometry = new THREE.CylinderGeometry(6, 6, 0.3, 64);
    const siliconMaterial = new THREE.MeshPhongMaterial({
      color: 0x505050,
      shininess: 120,
      specular: 0x888888,
      metalness: 0.3
    });
    const silicon = new THREE.Mesh(siliconGeometry, siliconMaterial);
    silicon.position.y = 0;
    scene.add(silicon);
    siliconRef.current = silicon;

    // Si 원자 격자 배열 (웨이퍼 표면) - 원자들이 서로 붙어있음
    const atomSize = 0.09; // 크기 줄임: 화면 비율 맞추기
    const spacing = 0.18; // 간격: 원자 지름(0.18)과 같게 -> 딱 붙어있음
    const gridSize = 64; // 더 많은 원자로 빽빽하게
    const atomGeometry = new THREE.SphereGeometry(atomSize, 10, 10); // 폴리곤 줄임
    const atomMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888, // 밝은 은색
      emissive: 0x555555,
      emissiveIntensity: 0.2,
      metalness: 0.5,
      shininess: 60
    });

    const atomsGroup = new THREE.Group();
    const siAtoms = []; // Si 원자들을 배열에 저장

    for (let i = -gridSize/2; i <= gridSize/2; i++) {
      for (let j = -gridSize/2; j <= gridSize/2; j++) {
        const x = i * spacing;
        const z = j * spacing;
        const distFromCenter = Math.sqrt(x * x + z * z);

        // 원형 웨이퍼 내부에만 배치
        if (distFromCenter <= 5.8) {
          const atom = new THREE.Mesh(atomGeometry, atomMaterial);
          atom.position.set(x, 0.15, z);
          atom.userData = {
            type: 'siAtom',
            active: true,
            worldPosition: new THREE.Vector3() // 월드 좌표 저장용
          };
          atomsGroup.add(atom);
          siAtoms.push(atom); // 배열에 추가
        }
      }
    }
    silicon.add(atomsGroup);
    siAtomsRef.current = siAtoms; // ref에 저장

    // "Si wafer" 라벨을 위한 스프라이트
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    // 배경 박스
    context.fillStyle = 'rgba(40, 40, 60, 0.85)';
    context.fillRect(10, 10, 492, 108);

    // 테두리
    context.strokeStyle = 'rgba(100, 150, 255, 0.9)';
    context.lineWidth = 4;
    context.strokeRect(10, 10, 492, 108);

    // 텍스트
    context.fillStyle = '#ffffff';
    context.font = 'Bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Si wafer', 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(8.5, 0, 0);
    sprite.scale.set(4, 1, 1);
    scene.add(sprite);

    // Chamber walls (transparent)
    const chamberGeometry = new THREE.CylinderGeometry(7, 7, 25, 32, 1, true);
    const chamberMaterial = new THREE.MeshPhongMaterial({
      color: 0x2244aa,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });
    const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    chamber.position.y = 5;
    scene.add(chamber);

    // Grid helper
    const gridHelper = new THREE.GridHelper(25, 25, 0x333333, 0x1a1a1a);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate);

      if (isRunningRef.current) {
        updateParticles();
        timeRef.current += 0.016;

        // Rotate silicon wafer
        if (siliconRef.current) {
          siliconRef.current.rotation.y += 0.006; // 원형 웨이퍼에 맞게 약간 느리게
        }

        // Pulse plasma zone
        if (plasmaZoneRef.current) {
          const pulse = Math.sin(timeRef.current * 3) * 0.03 + 0.12; // 펄스 감소
          plasmaZoneRef.current.material.opacity = pulse;
        }
      }

      // Rotate camera
      const time = Date.now() * 0.0001;
      camera.position.x = Math.cos(time) * 18;
      camera.position.z = Math.sin(time) * 18;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };
    animate();
  };

  // Create gas molecule with proper molecular structure
  const createGasMolecule = () => {
    const currentGasType = gasTypeRef.current; // ref에서 최신 값 가져오기
    const props = gasProperties[currentGasType];
    const moleculeGroup = new THREE.Group();

    if (props.structure === 'octahedral') {
      // SF6: 중심에 S(황), 주변에 F(불소) 6개
      // 중심 황 원자 (노란색)
      const sGeometry = new THREE.SphereGeometry(0.20, 16, 16);
      const sMaterial = new THREE.MeshPhongMaterial({
        color: 0xffdd00,
        emissive: 0xccaa00,
        emissiveIntensity: 0.3
      });
      const sulfur = new THREE.Mesh(sGeometry, sMaterial);
      moleculeGroup.add(sulfur);

      // 6개의 불소 원자 (팔면체 꼭짓점) - 밝은 녹색
      const fPositions = [
        [0.4, 0, 0], [-0.4, 0, 0],
        [0, 0.4, 0], [0, -0.4, 0],
        [0, 0, 0.4], [0, 0, -0.4]
      ];

      fPositions.forEach(pos => {
        const fGeometry = new THREE.SphereGeometry(0.12, 12, 12);
        const fMaterial = new THREE.MeshPhongMaterial({
          color: 0x66ff66,
          emissive: 0x44dd44,
          emissiveIntensity: 0.4
        });
        const fluorine = new THREE.Mesh(fGeometry, fMaterial);
        fluorine.position.set(...pos);

        // 결합선
        const bondGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
        const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
        const bond = new THREE.Mesh(bondGeometry, bondMaterial);
        bond.position.set(pos[0]/2, pos[1]/2, pos[2]/2);

        if (pos[0] !== 0) bond.rotation.z = Math.PI / 2;
        if (pos[2] !== 0) bond.rotation.x = Math.PI / 2;

        moleculeGroup.add(fluorine);
        moleculeGroup.add(bond);
      });

    } else if (props.structure === 'tetrahedral') {
      // CF4: 중심에 C(탄소), 주변에 F(불소) 4개 (사면체)
      // 중심 탄소 원자 (어두운 회색/검은색)
      const cGeometry = new THREE.SphereGeometry(0.16, 16, 16);
      const cMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a2a2a, // 어두운 회색
        emissive: 0x1a1a1a,
        emissiveIntensity: 0.2
      });
      const carbon = new THREE.Mesh(cGeometry, cMaterial);
      moleculeGroup.add(carbon);

      // 4개의 불소 원자 (사면체 꼭짓점) - 밝은 녹색
      const fPositions = [
        [0.3, 0.3, 0.3],
        [-0.3, -0.3, 0.3],
        [-0.3, 0.3, -0.3],
        [0.3, -0.3, -0.3]
      ];

      fPositions.forEach(pos => {
        const fGeometry = new THREE.SphereGeometry(0.12, 12, 12);
        const fMaterial = new THREE.MeshPhongMaterial({
          color: 0x66ff66,
          emissive: 0x44dd44,
          emissiveIntensity: 0.4
        });
        const fluorine = new THREE.Mesh(fGeometry, fMaterial);
        fluorine.position.set(...pos);

        // 결합선
        const bondGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
        const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
        const bond = new THREE.Mesh(bondGeometry, bondMaterial);
        bond.position.set(pos[0]/2, pos[1]/2, pos[2]/2);

        // 결합선 방향 조정
        const direction = new THREE.Vector3(...pos).normalize();
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(axis, direction);
        bond.quaternion.copy(quaternion);

        moleculeGroup.add(fluorine);
        moleculeGroup.add(bond);
      });

    } else if (props.structure === 'diatomic') {
      // Cl2 또는 HBr: 2원자 분자

      if (currentGasType === 'chlorine') {
        // Cl2: 두 개의 동일한 녹색 Cl 원자
        const clSize = 0.18;
        const clColor = 0x44dd44; // 녹색

        // 첫 번째 Cl 원자
        const cl1Geometry = new THREE.SphereGeometry(clSize, 16, 16);
        const cl1Material = new THREE.MeshPhongMaterial({
          color: clColor,
          emissive: clColor,
          emissiveIntensity: 0.4
        });
        const cl1 = new THREE.Mesh(cl1Geometry, cl1Material);
        cl1.position.set(-0.25, 0, 0);
        moleculeGroup.add(cl1);

        // 두 번째 Cl 원자
        const cl2Geometry = new THREE.SphereGeometry(clSize, 16, 16);
        const cl2Material = new THREE.MeshPhongMaterial({
          color: clColor,
          emissive: clColor,
          emissiveIntensity: 0.4
        });
        const cl2 = new THREE.Mesh(cl2Geometry, cl2Material);
        cl2.position.set(0.25, 0, 0);
        moleculeGroup.add(cl2);

        // 결합선
        const bondGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
        const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const bond = new THREE.Mesh(bondGeometry, bondMaterial);
        bond.rotation.z = Math.PI / 2;
        moleculeGroup.add(bond);

      } else if (currentGasType === 'bromine') {
        // HBr: H (작고 흰색) + Br (크고 밤색)

        // 수소 원자 (작고 밝은 흰색)
        const hGeometry = new THREE.SphereGeometry(0.10, 16, 16);
        const hMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0xeeeeee,
          emissiveIntensity: 0.4
        });
        const hydrogen = new THREE.Mesh(hGeometry, hMaterial);
        hydrogen.position.set(-0.22, 0, 0);
        moleculeGroup.add(hydrogen);

        // 브롬 원자 (크고 밤색)
        const brGeometry = new THREE.SphereGeometry(0.18, 16, 16);
        const brMaterial = new THREE.MeshPhongMaterial({
          color: 0x8b4513, // 밤색
          emissive: 0x6b3410,
          emissiveIntensity: 0.3
        });
        const bromine = new THREE.Mesh(brGeometry, brMaterial);
        bromine.position.set(0.22, 0, 0);
        moleculeGroup.add(bromine);

        // 결합선
        const bondGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.44, 8);
        const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const bond = new THREE.Mesh(bondGeometry, bondMaterial);
        bond.rotation.z = Math.PI / 2;
        moleculeGroup.add(bond);
      }
    }

    // Random position above silicon (원형 영역 내)
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 2.5; // 웨이퍼 반지름보다 작게
    moleculeGroup.position.x = Math.cos(angle) * radius;
    moleculeGroup.position.y = 12 + Math.random() * 3;
    moleculeGroup.position.z = Math.sin(angle) * radius;

    moleculeGroup.userData = {
      velocity: new THREE.Vector3(0, -0.05, 0), // 속도 감소: 0.08 -> 0.05
      type: 'molecule',
      active: true,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03
      }
    };

    sceneRef.current.add(moleculeGroup);
    gasMoleculesRef.current.push(moleculeGroup);
  };

  // Dissociate molecule into radicals in plasma zone - with animation
  const startDissociation = (molecule) => {
    const currentGasType = gasTypeRef.current; // ref에서 최신 값 가져오기
    const props = gasProperties[currentGasType];

    molecule.userData.dissociating = true;
    molecule.userData.dissociationProgress = 0;
    molecule.userData.dissociationType = props.structure;
    molecule.userData.gasType = currentGasType; // 분자에 가스 타입 저장

    dissociatingMoleculesRef.current.push(molecule);
  };

  // Complete dissociation and create radicals
  const completeDissociation = (molecule) => {
    const currentGasType = molecule.userData.gasType || gasTypeRef.current; // 저장된 타입 사용
    const props = gasProperties[currentGasType];
    const position = molecule.position.clone();

    if (props.structure === 'octahedral') {
      // SF6 → S + 6F*
      // 1. Create S atom (sulfur byproduct - moves away slowly)
      const sGeometry = new THREE.SphereGeometry(0.14, 16, 16);
      const sMaterial = new THREE.MeshPhongMaterial({
        color: 0xffdd00,
        emissive: 0xccaa00,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const sulfur = new THREE.Mesh(sGeometry, sMaterial);
      sulfur.position.copy(position);
      sulfur.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.04, // 수평 움직임
          0.03, // 위로 천천히 배출
          (Math.random() - 0.5) * 0.04
        ),
        type: 'byproduct',
        lifetime: 120 // 더 오래 보임
      };
      sceneRef.current.add(sulfur);
      byproductsRef.current.push(sulfur);

      // 2. Create 6 F* radicals (spread in octahedral directions)
      const fDirections = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
      ];

      fDirections.forEach((dir, i) => {
        const geometry = new THREE.SphereGeometry(0.10, 12, 12);
        const material = new THREE.MeshPhongMaterial({
          color: props.radicalColor,
          emissive: props.radicalColor,
          emissiveIntensity: 0.7
        });
        const radical = new THREE.Mesh(geometry, material);

        radical.position.copy(position);
        radical.position.x += dir[0] * 0.3;
        radical.position.y += dir[1] * 0.3;
        radical.position.z += dir[2] * 0.3;

        // F* radicals - 초기에 퍼지다가 주로 아래로
        radical.userData = {
          velocity: new THREE.Vector3(
            dir[0] * 0.03, // 수평 퍼짐 감소
            -0.06 + dir[1] * 0.01, // 주로 아래로
            dir[2] * 0.03
          ),
          type: 'radical',
          active: true,
          lifetime: 200
        };

        sceneRef.current.add(radical);
        radicalsRef.current.push(radical);
      });

    } else if (props.structure === 'tetrahedral') {
      // CF4 → C + 4F*
      // 1. Create C atom (carbon byproduct - moves away slowly)
      const cGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const cMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a2a2a, // 어두운 회색
        emissive: 0x1a1a1a,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.8
      });
      const carbon = new THREE.Mesh(cGeometry, cMaterial);
      carbon.position.copy(position);
      carbon.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.04, // 수평 움직임
          0.03, // 위로 천천히 배출
          (Math.random() - 0.5) * 0.04
        ),
        type: 'byproduct',
        lifetime: 120 // 더 오래 보임
      };
      sceneRef.current.add(carbon);
      byproductsRef.current.push(carbon);

      // 2. Create 4 F* radicals (spread in tetrahedral directions)
      const fDirections = [
        [1, 1, 1], [-1, -1, 1],
        [-1, 1, -1], [1, -1, -1]
      ];

      fDirections.forEach((dir, i) => {
        const geometry = new THREE.SphereGeometry(0.10, 12, 12);
        const material = new THREE.MeshPhongMaterial({
          color: props.radicalColor,
          emissive: props.radicalColor,
          emissiveIntensity: 0.7
        });
        const radical = new THREE.Mesh(geometry, material);

        // 방향 정규화
        const dirLength = Math.sqrt(dir[0]**2 + dir[1]**2 + dir[2]**2);
        const normDir = dir.map(d => d / dirLength);

        radical.position.copy(position);
        radical.position.x += normDir[0] * 0.3;
        radical.position.y += normDir[1] * 0.3;
        radical.position.z += normDir[2] * 0.3;

        // F* radicals - 초기에 퍼지다가 주로 아래로
        radical.userData = {
          velocity: new THREE.Vector3(
            normDir[0] * 0.03, // 수평 퍼짐
            -0.06 + normDir[1] * 0.01, // 주로 아래로
            normDir[2] * 0.03
          ),
          type: 'radical',
          active: true,
          lifetime: 200
        };

        sceneRef.current.add(radical);
        radicalsRef.current.push(radical);
      });

    } else if (props.structure === 'diatomic') {
      if (currentGasType === 'chlorine') {
        // Cl2 → 2Cl* (녹색 두 개가 각각 분리되어 바닥으로)
        for (let i = 0; i < 2; i++) {
          const geometry = new THREE.SphereGeometry(0.13, 12, 12);
          const material = new THREE.MeshPhongMaterial({
            color: props.radicalColor,
            emissive: props.radicalColor,
            emissiveIntensity: 0.7
          });
          const radical = new THREE.Mesh(geometry, material);

          const direction = i === 0 ? -1 : 1;
          radical.position.copy(position);
          radical.position.x += direction * 0.3;

          // 라디칼이 아래로 떨어짐
          radical.userData = {
            velocity: new THREE.Vector3(
              direction * 0.03, // 약간의 수평 퍼짐
              -0.06, // 주로 아래로
              (Math.random() - 0.5) * 0.02
            ),
            type: 'radical',
            active: true,
            lifetime: 200
          };

          sceneRef.current.add(radical);
          radicalsRef.current.push(radical);
        }

      } else if (currentGasType === 'bromine') {
        // HBr → H + Br* (흰색 H는 배출, 밤색 Br은 아래로)

        // 1. Create H atom (hydrogen - moves away)
        const hGeometry = new THREE.SphereGeometry(0.07, 12, 12);
        const hMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0xdddddd,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.85
        });
        const hydrogen = new THREE.Mesh(hGeometry, hMaterial);
        hydrogen.position.copy(position);
        hydrogen.position.x -= 0.25;
        hydrogen.userData = {
          velocity: new THREE.Vector3(
            -0.12, // 왼쪽으로 빠르게 배출
            0.05, // 약간 위로
            (Math.random() - 0.5) * 0.08
          ),
          type: 'byproduct',
          lifetime: 90
        };
        sceneRef.current.add(hydrogen);
        byproductsRef.current.push(hydrogen);

        // 2. Create Br* radical (밤색, 아래로 떨어짐)
        const geometry = new THREE.SphereGeometry(0.13, 12, 12);
        const material = new THREE.MeshPhongMaterial({
          color: props.radicalColor,
          emissive: props.radicalColor,
          emissiveIntensity: 0.7
        });
        const radical = new THREE.Mesh(geometry, material);

        radical.position.copy(position);
        radical.position.x += 0.25;

        // 라디칼이 아래로 떨어짐
        radical.userData = {
          velocity: new THREE.Vector3(
            0.02, // 약간 오른쪽
            -0.06, // 주로 아래로
            (Math.random() - 0.5) * 0.02
          ),
          type: 'radical',
          active: true,
          lifetime: 200
        };

        sceneRef.current.add(radical);
        radicalsRef.current.push(radical);
      }
    }

    setDissociationCount(prev => prev + 1);
  };

  // 가장 가까운 Si 원자 찾기
  const findNearestSiAtom = (position) => {
    let nearestAtom = null;
    let minDistance = Infinity;

    for (const atom of siAtomsRef.current) {
      if (!atom.userData.active) continue; // 이미 제거된 원자는 건너뛰기

      // 월드 좌표 업데이트
      atom.getWorldPosition(atom.userData.worldPosition);
      const worldPos = atom.userData.worldPosition;

      // 2D 거리로 계산 (x, z 평면)
      const distance = Math.sqrt(
        (worldPos.x - position.x) ** 2 +
        (worldPos.z - position.z) ** 2
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestAtom = atom;
      }
    }

    // 너무 멀면 null 반환 (식각 범위 내에 있어야 함)
    if (minDistance > 0.3) return null;

    return nearestAtom;
  };

  // Create byproduct (SiF4, SiCl4, SiBr4) from surface reaction - Si 원자 제거
  const createByproduct = (position, siAtom = null) => {
    const currentGasType = gasTypeRef.current;
    const props = gasProperties[currentGasType];

    // Si 원자가 지정되면 그 위치에서, 아니면 주어진 위치에서 생성
    let byproductPosition = position.clone();
    if (siAtom && siAtom.userData.active) {
      siAtom.getWorldPosition(siAtom.userData.worldPosition);
      byproductPosition = siAtom.userData.worldPosition.clone();

      // Si 원자 제거 (식각!)
      siAtom.userData.active = false;
      siAtom.visible = false;
    }

    // 부산물 분자 그룹 생성 (중심에 Si, 주변에 4개의 F/Cl/Br)
    const byproductGroup = new THREE.Group();

    // 중심 Si 원자 (진한 회색)
    const siGeometry = new THREE.SphereGeometry(0.09, 12, 12);
    const siMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888, // 밝은 은색
      emissive: 0x555555,
      emissiveIntensity: 0.3
    });
    const siCenter = new THREE.Mesh(siGeometry, siMaterial);
    byproductGroup.add(siCenter);

    // 4개의 F/Cl/Br 원자 (사면체 구조)
    const radicalPositions = [
      [0.15, 0.15, 0.15],
      [-0.15, -0.15, 0.15],
      [-0.15, 0.15, -0.15],
      [0.15, -0.15, -0.15]
    ];

    // 라디칼 색상 결정
    let radicalColor = props.radicalColor;
    if (currentGasType === 'bromine') {
      radicalColor = 0xaa6633; // 밤색 Br
    } else if (currentGasType === 'chlorine') {
      radicalColor = 0x66ff66; // 녹색 Cl
    } else {
      radicalColor = 0x66ff66; // 녹색 F
    }

    radicalPositions.forEach(pos => {
      const radicalGeometry = new THREE.SphereGeometry(0.07, 10, 10);
      const radicalMaterial = new THREE.MeshPhongMaterial({
        color: radicalColor,
        emissive: radicalColor,
        emissiveIntensity: 0.4
      });
      const radical = new THREE.Mesh(radicalGeometry, radicalMaterial);
      radical.position.set(...pos);

      // 결합선
      const bondGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 6);
      const bondMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.6
      });
      const bond = new THREE.Mesh(bondGeometry, bondMaterial);
      bond.position.set(pos[0]/2, pos[1]/2, pos[2]/2);

      // 결합선 방향 조정
      const direction = new THREE.Vector3(...pos).normalize();
      const axis = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(axis, direction);
      bond.quaternion.copy(quaternion);

      byproductGroup.add(radical);
      byproductGroup.add(bond);
    });

    byproductGroup.position.copy(byproductPosition);
    byproductGroup.position.y = Math.max(byproductPosition.y, 0.4);

    byproductGroup.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        0.10 + Math.random() * 0.05,
        (Math.random() - 0.5) * 0.05
      ),
      rotation: new THREE.Vector3(
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08
      ),
      lifetime: 150,
      type: 'byproduct'
    };

    sceneRef.current.add(byproductGroup);
    byproductsRef.current.push(byproductGroup);
    setParticleCount(prev => prev + 1);

    // Create small flash effect at reaction site (Si 원자 위치)
    const flashGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff88,
      transparent: true,
      opacity: 0.5
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.copy(byproductPosition);
    flash.position.y = Math.max(byproductPosition.y, 0.25);
    sceneRef.current.add(flash);

    // Animate and remove flash
    let flashLife = 10;
    const flashInterval = setInterval(() => {
      flashLife--;
      flash.scale.multiplyScalar(1.2);
      flash.material.opacity = flashLife / 10;
      if (flashLife <= 0) {
        sceneRef.current.remove(flash);
        flash.geometry.dispose();
        flash.material.dispose();
        clearInterval(flashInterval);
      }
    }, 30);
  };

  const updateParticles = () => {
    const currentGasType = gasTypeRef.current; // ref에서 최신 값 가져오기
    const props = gasProperties[currentGasType];

    // Update dissociating molecules (animation)
    for (let i = dissociatingMoleculesRef.current.length - 1; i >= 0; i--) {
      const molecule = dissociatingMoleculesRef.current[i];

      if (!molecule.userData.dissociating) continue;

      molecule.userData.dissociationProgress += 0.018; // 분해 속도 조금 빠르게
      const progress = molecule.userData.dissociationProgress;

      // Animate the dissociation based on gas type
      if (molecule.userData.dissociationType === 'octahedral') {
        // SF6: 불소들이 황에서 멀어지며 아래로
        molecule.children.forEach((child, idx) => {
          if (child.isMesh && idx > 0 && idx % 2 === 1) { // 불소 원자들
            const scale = 1 + progress * 2.5; // 더 멀리 퍼짐
            const originalPos = child.userData.originalPos || child.position.clone();
            if (!child.userData.originalPos) child.userData.originalPos = originalPos.clone();

            child.position.x = originalPos.x * scale;
            child.position.y = originalPos.y * scale - progress * 0.4; // 아래로도 이동
            child.position.z = originalPos.z * scale;
          }
        });

      } else if (molecule.userData.dissociationType === 'tetrahedral') {
        // CF4: 불소들이 탄소에서 멀어지며 아래로 (사면체)
        molecule.children.forEach((child, idx) => {
          if (child.isMesh && idx > 0 && idx % 2 === 1) { // 불소 원자들
            const scale = 1 + progress * 2.5; // 더 멀리 퍼짐
            const originalPos = child.userData.originalPos || child.position.clone();
            if (!child.userData.originalPos) child.userData.originalPos = originalPos.clone();

            child.position.x = originalPos.x * scale;
            child.position.y = originalPos.y * scale - progress * 0.4; // 아래로도 이동
            child.position.z = originalPos.z * scale;
          }
        });

      } else if (molecule.userData.dissociationType === 'diatomic') {
        // Cl2 or HBr: 두 원자가 좌우로 멀어짐
        molecule.children.forEach((child, idx) => {
          if (child.isMesh && idx < 2) { // 두 원자
            const originalPos = child.userData.originalPos || child.position.clone();
            if (!child.userData.originalPos) child.userData.originalPos = originalPos.clone();

            const direction = originalPos.x > 0 ? 1 : -1;
            child.position.x = originalPos.x + direction * progress * 0.8; // 더 멀리 분리
            child.position.y = originalPos.y - progress * 0.3; // 약간 아래로
          }
        });
      }

      // 결합선 페이드 아웃
      molecule.children.forEach((child) => {
        if (child.isMesh && child.geometry.type === 'CylinderGeometry') {
          child.material.opacity = Math.max(0, 1 - progress * 2);
          child.material.transparent = true;
        }
      });

      // 분해 완료
      if (progress >= 1.0) {
        completeDissociation(molecule);

        // Remove from scene
        sceneRef.current.remove(molecule);
        const molIdx = gasMoleculesRef.current.indexOf(molecule);
        if (molIdx > -1) gasMoleculesRef.current.splice(molIdx, 1);

        molecule.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });

        dissociatingMoleculesRef.current.splice(i, 1);
      }
    }

    // Update gas molecules
    for (let i = gasMoleculesRef.current.length - 1; i >= 0; i--) {
      const molecule = gasMoleculesRef.current[i];

      if (!molecule.userData.active) continue;

      // Slow down when dissociating
      if (molecule.userData.dissociating) {
        molecule.userData.velocity.y *= 0.95; // 분해 중에는 천천히
      }

      molecule.position.add(molecule.userData.velocity);

      // Rotate molecule
      if (molecule.userData.rotationSpeed && !molecule.userData.dissociating) {
        molecule.rotation.x += molecule.userData.rotationSpeed.x;
        molecule.rotation.y += molecule.userData.rotationSpeed.y;
        molecule.rotation.z += molecule.userData.rotationSpeed.z;
      }

      // Check if in plasma zone (y between 2 and 6)
      if (molecule.position.y <= 6 && molecule.position.y >= 2 && molecule.userData.active) {
        const distFromCenter = Math.sqrt(
          molecule.position.x ** 2 + molecule.position.z ** 2
        );

        if (distFromCenter < 5) { // 플라즈마 영역 반지름
          // Start dissociation animation
          if (!molecule.userData.dissociating) {
            startDissociation(molecule);
          }
        }
      }

      // Remove if goes too low without dissociating
      if (molecule.position.y < 0) {
        sceneRef.current.remove(molecule);
        gasMoleculesRef.current.splice(i, 1);

        molecule.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }
    }

    // Update radicals
    for (let i = radicalsRef.current.length - 1; i >= 0; i--) {
      const radical = radicalsRef.current[i];

      if (!radical.userData.active) continue;

      // Gradually direct radicals toward silicon surface
      radical.userData.velocity.y -= 0.001; // 중력 더 감소 - 이미 초기 속도가 아래로 향함
      radical.position.add(radical.userData.velocity);
      radical.userData.lifetime--;

      // Check collision with silicon surface
      if (radical.position.y <= 0.3) {
        const distFromCenter = Math.sqrt(
          radical.position.x ** 2 + radical.position.z ** 2
        );

        if (distFromCenter < 6) { // 원형 웨이퍼 반지름
          // Reaction occurs based on reactivity
          if (Math.random() < props.reactivity) {
            // 가장 가까운 Si 원자 찾기
            const nearestSiAtom = findNearestSiAtom(radical.position);

            if (nearestSiAtom) {
              // Si 원자를 뜯어내서 부산물 생성 (실제 식각!)
              createByproduct(radical.position.clone(), nearestSiAtom);

              // Etching effect
              const etchAmount = props.isotropic ? 0.003 : 0.002;
              setEtchDepth(prev => prev + etchAmount);
            }
          }

          radical.userData.active = false;
          sceneRef.current.remove(radical);
          radicalsRef.current.splice(i, 1);
          radical.geometry.dispose();
          radical.material.dispose();
        }
      }

      // Remove old radicals
      if (radical.userData.lifetime <= 0 || radical.position.y < -2) {
        sceneRef.current.remove(radical);
        radicalsRef.current.splice(i, 1);
        radical.geometry.dispose();
        radical.material.dispose();
      }
    }

    // Update byproducts (volatile, moving upward or away)
    for (let i = byproductsRef.current.length - 1; i >= 0; i--) {
      const byproduct = byproductsRef.current[i];

      byproduct.position.add(byproduct.userData.velocity);

      // Rotate the entire byproduct group
      if (byproduct.userData.rotation) {
        byproduct.rotation.x += byproduct.userData.rotation.x;
        byproduct.rotation.y += byproduct.userData.rotation.y;
        byproduct.rotation.z += byproduct.userData.rotation.z;
      }

      byproduct.userData.lifetime--;

      // Fade out - Group의 모든 children에 적용
      const opacity = byproduct.userData.lifetime / 150;
      byproduct.traverse((child) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });

      // Remove when far away or lifetime expired
      if (byproduct.userData.lifetime <= 0 || byproduct.position.y > 20 || byproduct.position.y < -5) {
        sceneRef.current.remove(byproduct);
        byproductsRef.current.splice(i, 1);

        // Dispose all geometries and materials in the group
        byproduct.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }
    }

    // Update silicon appearance based on etch depth
    if (siliconRef.current) {
      const scale = 1 - Math.min(etchDepth * 0.3, 0.5);
      siliconRef.current.scale.set(1, scale, 1); // 수평은 유지, 수직만 축소

      // Change color slightly (darker as etching progresses)
      const colorIntensity = Math.max(0.2, 1 - etchDepth * 0.5);
      siliconRef.current.material.color.setRGB(
        colorIntensity * 0.314,
        colorIntensity * 0.314,
        colorIntensity * 0.314
      );
    }

    // Spawn new gas molecules
    if (isRunningRef.current && Math.random() < 0.12) { // 생성 빈도 더 감소: 0.15 -> 0.12
      createGasMolecule();
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    isRunningRef.current = true;
  };

  const handleStop = () => {
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const handleReset = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    setEtchDepth(0);
    setParticleCount(0);
    setDissociationCount(0);
    timeRef.current = 0;

    // Clear all particles
    [...gasMoleculesRef.current, ...radicalsRef.current, ...byproductsRef.current, ...dissociatingMoleculesRef.current].forEach(p => {
      sceneRef.current.remove(p);
      p.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });

    gasMoleculesRef.current = [];
    radicalsRef.current = [];
    byproductsRef.current = [];
    dissociatingMoleculesRef.current = [];

    // Si 원자 복원
    siAtomsRef.current.forEach(atom => {
      atom.userData.active = true;
      atom.visible = true;
    });

    // Reset silicon
    if (siliconRef.current) {
      siliconRef.current.scale.set(1, 1, 1);
      siliconRef.current.position.y = 0;
      siliconRef.current.material.color.setRGB(0.314, 0.314, 0.314);
    }
  };

  const handleGasChange = (newGasType) => {
    handleReset();
    setGasType(newGasType);
    gasTypeRef.current = newGasType; // ref도 즉시 업데이트

    // Si 원자 복원
    siAtomsRef.current.forEach(atom => {
      atom.userData.active = true;
      atom.visible = true;
    });
  };

  useEffect(() => {
    initializeScene();

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    gasTypeRef.current = gasType;
  }, [gasType]);

  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentProps = gasProperties[gasType];

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-white mb-2">🔬 실리콘 플라즈마 식각 공정 시뮬레이터</h1>
        <p className="text-gray-400 text-sm">가스 분해 → 라디칼 반응 → 휘발성 부산물 생성 과정의 실시간 시각화</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <div ref={mountRef} className="w-full h-full" />

          {/* Process Flow Info */}
          <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-95 rounded-lg p-4 text-white max-w-md">
            <h3 className="font-bold text-lg mb-3">{currentProps.name}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-blue-400 font-semibold">① 플라즈마 분해:</span>
                <div className="font-mono text-xs mt-1 bg-gray-900 p-2 rounded">
                  {currentProps.dissociationFormula}
                </div>
                {gasType === 'fluorine' && (
                  <div className="text-xs text-gray-400 mt-1">→ 황(S) 원자는 배출, 6개 F* 라디칼은 식각</div>
                )}
                {gasType === 'cf4' && (
                  <div className="text-xs text-gray-400 mt-1">→ 탄소(C) 원자는 배출, 4개 F* 라디칼은 식각</div>
                )}
                {gasType === 'chlorine' && (
                  <div className="text-xs text-gray-400 mt-1">→ 2개 Cl* 라디칼로 분리</div>
                )}
                {gasType === 'bromine' && (
                  <div className="text-xs text-gray-400 mt-1">→ 수소(H)는 배출, Br* 라디칼은 식각</div>
                )}
              </div>
              <div>
                <span className="text-green-400 font-semibold">② 표면 반응:</span>
                <div className="font-mono text-xs mt-1 bg-gray-900 p-2 rounded">
                  {currentProps.reactionFormula}
                </div>
                <div className="text-xs text-gray-400 mt-1">→ Si 원자가 웨이퍼에서 제거됨 (식각!)</div>
              </div>
              <div>
                <span className="text-purple-400 font-semibold">③ 부산물:</span>
                <span className="ml-2 font-mono">{currentProps.byproduct}</span>
                <span className="text-gray-400 text-xs ml-2">(휘발성, 위로 배출)</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-95 rounded-lg p-4 text-white min-w-52">
            <h3 className="font-bold mb-3">📊 공정 통계</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">가스 분해:</span>
                <span className="font-mono text-blue-400">{dissociationCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">부산물 생성:</span>
                <span className="font-mono text-green-400">{particleCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">식각 깊이:</span>
                <span className="font-mono text-yellow-400">{(etchDepth * 100).toFixed(1)} nm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">식각률:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  currentProps.isotropic ? 'bg-yellow-600' : 'bg-blue-600'
                }`}>
                  {currentProps.isotropic ? '등방성' : '이방성'}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-95 rounded-lg p-4 text-white">
            <h3 className="font-bold mb-3 text-sm">🎨 범례</h3>
            <div className="space-y-2 text-xs">
              {gasType === 'fluorine' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-6 flex items-center justify-center">
                      <div className="absolute w-5 h-5 rounded-full bg-yellow-400"></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{left: '0px', top: '50%', transform: 'translateY(-50%)'}}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{right: '0px', top: '50%', transform: 'translateY(-50%)'}}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{left: '50%', top: '0px', transform: 'translateX(-50%)'}}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{left: '50%', bottom: '0px', transform: 'translateX(-50%)'}}></div>
                    </div>
                    <span>SF₆ 분자 (황 중심 + 6개 불소)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                    <span>황(S) 원자 → 배출</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span>불소(F*) 라디칼 → 식각</span>
                  </div>
                </>
              )}
              {gasType === 'cf4' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-6 flex items-center justify-center">
                      <div className="absolute w-4 h-4 rounded-full" style={{ backgroundColor: '#2a2a2a' }}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{left: '2px', top: '2px'}}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{right: '2px', top: '2px'}}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{left: '2px', bottom: '2px'}}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-400" style={{right: '2px', bottom: '2px'}}></div>
                    </div>
                    <span>CF₄ 분자 (탄소 중심 + 4개 불소)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#2a2a2a' }}></div>
                    <span>탄소(C) 원자 → 배출</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span>불소(F*) 라디칼 → 식각</span>
                  </div>
                </>
              )}
              {gasType === 'chlorine' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-green-500"></div>
                      <div className="w-1 h-0.5 bg-gray-400"></div>
                      <div className="w-5 h-5 rounded-full bg-green-500"></div>
                    </div>
                    <span>Cl₂ 분자 (2개 녹색 염소)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    <span>염소(Cl*) 라디칼 → 식각</span>
                  </div>
                </>
              )}
              {gasType === 'bromine' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                      <div className="w-1 h-0.5 bg-gray-400"></div>
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#8b4513' }}></div>
                    </div>
                    <span>HBr 분자 (흰색 H + 밤색 Br)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <span>수소(H) 원자 → 배출</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#aa6633' }}></div>
                    <span>브롬(Br*) 라디칼 → 식각</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-600">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-blue-600 rounded"></div>
                <span>플라즈마 영역 (분해 구역)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-2 bg-gray-600 rounded-full"></div>
                <span>Si 웨이퍼 (원형, 회전 중)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#888888' }}></div>
                <span>Si 원자 (식각되며 제거됨)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#888888' }}></div>
                  {gasType === 'bromine' ? (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#aa6633' }}></div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  )}
                </div>
                <span>{currentProps.byproduct} (Si + {gasType === 'fluorine' || gasType === 'cf4' ? 'F' : gasType === 'chlorine' ? 'Cl' : 'Br'})</span>
              </div>
            </div>
          </div>

          {/* Process Steps Indicator */}
          <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-95 rounded-lg p-3 text-white">
            <h3 className="font-bold mb-2 text-xs">⚙️ 공정 단계</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">▼</span>
                <span>가스 분자 주입</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">⚡</span>
                <span>플라즈마 분해</span>
              </div>
              {gasType === 'fluorine' && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">◉</span>
                  <span>S 원자 배출</span>
                </div>
              )}
              {gasType === 'cf4' && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">◉</span>
                  <span>C 원자 배출</span>
                </div>
              )}
              {gasType === 'bromine' && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">◉</span>
                  <span>H 원자 배출</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-green-400">→</span>
                <span>라디칼 확산</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">✱</span>
                <span>Si 원자 제거 (식각!)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">▲</span>
                <span>{currentProps.byproduct} 배출</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">🎛️ 제어 패널</h2>

          {/* Gas Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              식각 가스 선택
            </label>
            <div className="space-y-2">
              {Object.entries(gasProperties).map(([key, props]) => (
                <button
                  key={key}
                  onClick={() => handleGasChange(key)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    gasType === key
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-semibold">{props.name}</div>
                  <div className="text-xs mt-1 opacity-80">
                    {props.radical} → {props.byproduct}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              공정 제어
            </label>
            <div className="space-y-2">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold shadow-lg"
              >
                ▶ 식각 시작
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                ⏸ 일시 정지
              </button>
              <button
                onClick={handleReset}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                ⟳ 리셋
              </button>
            </div>
          </div>

          {/* Process Characteristics */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-white mb-3">📈 공정 특성</h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div>
                <div className="flex justify-between mb-1">
                  <span>반응성</span>
                  <span>{(currentProps.reactivity * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${currentProps.reactivity * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>라디칼 생성</span>
                  <span>×{currentProps.radicalCount}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(currentProps.radicalCount / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Reaction Mechanism */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">⚗️ 반응 메커니즘</h3>
            <div className="text-xs text-gray-300 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>가스 분자가 플라즈마 영역 진입</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">2.</span>
                {gasType === 'fluorine' && <span>SF₆ → S + 6F* (황과 불소 분리)</span>}
                {gasType === 'cf4' && <span>CF₄ → C + 4F* (탄소와 불소 분리)</span>}
                {gasType === 'chlorine' && <span>Cl₂ → 2Cl* (염소 분자 분리)</span>}
                {gasType === 'bromine' && <span>HBr → H + Br* (수소와 브롬 분리)</span>}
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 font-bold">3.</span>
                <span>{currentProps.radical} 라디칼이 실리콘으로 확산</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">4.</span>
                <span>Si 원자가 표면에서 제거됨 (식각!)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">5.</span>
                <span>{currentProps.byproduct} 부산물이 위로 배출</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Main EtchSimulator Component (Tabbed Interface)
// ============================================================

const EtchSimulator = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: '식각 공정 개요', icon: '📋', color: 'blue' },
    { id: 'etch-elements', name: '식각 요소', icon: '🔬', color: 'indigo' },
    { id: 'process', name: '식각 원리', icon: '⚗️', color: 'violet' },
    { id: 'analysis', name: 'Si식각메커니즘', icon: '🧪', color: 'purple' },
    { id: 'quiz', name: '식각 평가', icon: '📝', color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⚗️ Etching Simulator</h1>
          <p className="text-gray-600">건식/습식 식각 공정 시뮬레이터</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">식각 공정 개요</h2>

            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">식각(Etching)이란?</h3>
                <p className="text-gray-700 leading-relaxed">
                  식각은 반도체 제조 공정에서 불필요한 물질을 선택적으로 제거하는 핵심 공정입니다.
                  포토리소그래피로 형성된 패턴을 기반으로 노출된 영역의 물질을 화학적 또는 물리적 방법으로 제거합니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">🧪 습식 식각 (Wet Etching)</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong>원리:</strong> 액체 화학 용액을 사용하여 화학 반응으로 물질 제거</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong>특징:</strong> 등방성(isotropic) 식각, 언더컷 발생</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong>장점:</strong> 저비용, 높은 선택비, 대면적 처리 가능</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong>단점:</strong> 미세 패턴 제어 어려움, 방향성 제어 불가</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong>응용:</strong> 실리콘 식각(KOH, TMAH), 산화막 식각(HF, BOE)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">⚡ 건식 식각 (Dry Etching)</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>원리:</strong> 플라즈마를 이용한 화학적/물리적 식각</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>특징:</strong> 이방성(anisotropic) 식각, 수직 프로파일</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>장점:</strong> 미세 패턴 제어 우수, 방향성 제어 가능</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>단점:</strong> 고비용, 낮은 선택비 가능성, 플라즈마 손상</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>응용:</strong> RIE, ICP, CCP를 이용한 실리콘/금속/절연막 식각</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">식각 공정의 핵심 파라미터</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-blue-700 mb-2">📏 식각률 (Etch Rate)</h4>
                    <p className="text-xs text-gray-600">단위 시간당 제거되는 물질의 두께 (Å/min, nm/min)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-green-700 mb-2">🎯 선택비 (Selectivity)</h4>
                    <p className="text-xs text-gray-600">목표 물질과 다른 물질의 식각률 비율</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-purple-700 mb-2">📐 이방성 (Anisotropy)</h4>
                    <p className="text-xs text-gray-600">수직/수평 식각률 비율, 프로파일 제어</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 반도체 공정에서의 식각의 중요성</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">1.</span>
                    <span><strong>패턴 전사:</strong> 포토리소그래피로 형성된 패턴을 하부 물질층에 전사</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">2.</span>
                    <span><strong>미세화:</strong> 나노미터 수준의 미세 패턴 형성 (10nm 이하 공정)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">3.</span>
                    <span><strong>3D 구조:</strong> FinFET, GAA 등 3차원 트랜지스터 구조 형성</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">4.</span>
                    <span><strong>층간 연결:</strong> 컨택홀, 비아홀 형성으로 다층 배선 연결</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'etch-elements' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">식각 요소 및 메커니즘</h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4">건식 식각의 3가지 주요 메커니즘</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-bold text-purple-700 mb-3 text-center">⚛️ 물리적 식각</h4>
                    <p className="text-sm text-gray-700 mb-3"><strong>스퍼터링 (Sputtering)</strong></p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• 고에너지 이온의 물리적 충격</li>
                      <li>• 운동량 전달로 원자 탈착</li>
                      <li>• 방향성 우수, 선택비 낮음</li>
                      <li>• Ar⁺ 이온 사용</li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-bold text-green-700 mb-3 text-center">🧪 화학적 식각</h4>
                    <p className="text-sm text-gray-700 mb-3"><strong>라디칼 반응</strong></p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• 활성 라디칼의 화학 반응</li>
                      <li>• 휘발성 부산물 생성</li>
                      <li>• 선택비 우수, 등방성</li>
                      <li>• F*, Cl* 라디칼 사용</li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-bold text-indigo-700 mb-3 text-center">⚡ 이온 증강 식각</h4>
                    <p className="text-sm text-gray-700 mb-3"><strong>RIE (Reactive Ion Etching)</strong></p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• 물리적 + 화학적 시너지</li>
                      <li>• 이온이 반응 활성화</li>
                      <li>• 방향성 + 선택비 균형</li>
                      <li>• 가장 일반적인 방법</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">주요 식각 가스 및 응용</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">가스</th>
                        <th className="px-4 py-3 text-left font-semibold">화학식</th>
                        <th className="px-4 py-3 text-left font-semibold">주요 라디칼</th>
                        <th className="px-4 py-3 text-left font-semibold">식각 대상</th>
                        <th className="px-4 py-3 text-left font-semibold">특징</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">육불화황</td>
                        <td className="px-4 py-3">SF₆</td>
                        <td className="px-4 py-3">F*</td>
                        <td className="px-4 py-3">Si, SiO₂</td>
                        <td className="px-4 py-3 text-xs">높은 식각률, 등방성</td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">사불화탄소</td>
                        <td className="px-4 py-3">CF₄</td>
                        <td className="px-4 py-3">F*, CF₃*</td>
                        <td className="px-4 py-3">Si, SiO₂</td>
                        <td className="px-4 py-3 text-xs">안정적, 중간 속도</td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">염소</td>
                        <td className="px-4 py-3">Cl₂</td>
                        <td className="px-4 py-3">Cl*</td>
                        <td className="px-4 py-3">Si, 금속</td>
                        <td className="px-4 py-3 text-xs">이방성 우수</td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">브롬화수소</td>
                        <td className="px-4 py-3">HBr</td>
                        <td className="px-4 py-3">Br*, H*</td>
                        <td className="px-4 py-3">Si, Poly-Si</td>
                        <td className="px-4 py-3 text-xs">깊은 트렌치, 고선택비</td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">산소</td>
                        <td className="px-4 py-3">O₂</td>
                        <td className="px-4 py-3">O*</td>
                        <td className="px-4 py-3">Photoresist, 유기물</td>
                        <td className="px-4 py-3 text-xs">애싱(Ashing) 공정</td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">삼불화질소</td>
                        <td className="px-4 py-3">NF₃</td>
                        <td className="px-4 py-3">F*, N*</td>
                        <td className="px-4 py-3">챔버 클리닝</td>
                        <td className="px-4 py-3 text-xs">강력한 산화제</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 선택비 (Selectivity)</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    선택비 = (목표 물질 식각률) / (다른 물질 식각률)
                  </p>
                  <div className="bg-white p-4 rounded text-xs space-y-2">
                    <div><strong>예시:</strong> Si 식각 시 SiO₂ 선택비 = 50:1</div>
                    <div>→ Si는 500nm/min, SiO₂는 10nm/min 식각</div>
                    <div className="text-green-600 font-semibold mt-2">선택비가 높을수록 정밀한 공정 제어 가능</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">📐 이방성 지수</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    A = 1 - (수평 식각률 / 수직 식각률)
                  </p>
                  <div className="bg-white p-4 rounded text-xs space-y-2">
                    <div><strong>A = 0:</strong> 완전 등방성 (Wet etching)</div>
                    <div><strong>A = 1:</strong> 완전 이방성 (Ideal RIE)</div>
                    <div><strong>A = 0.5-0.9:</strong> 일반적인 플라즈마 식각</div>
                    <div className="text-purple-600 font-semibold mt-2">미세 패턴일수록 높은 이방성 필요</div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ 식각 공정의 주요 문제점</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-red-700 mb-2">1. 마이크로로딩 효과</h4>
                    <p className="text-xs text-gray-700">패턴 밀도에 따라 식각률이 달라지는 현상</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-700 mb-2">2. ARDE 효과</h4>
                    <p className="text-xs text-gray-700">Aspect Ratio에 따른 식각률 의존성</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-700 mb-2">3. 플라즈마 손상</h4>
                    <p className="text-xs text-gray-700">고에너지 이온에 의한 결정 구조 손상</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-700 mb-2">4. 프로파일 제어</h4>
                    <p className="text-xs text-gray-700">보잉, 언더컷, 거칠기 등의 문제</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">식각 원리 및 반응 메커니즘</h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">플라즈마 식각의 단계별 프로세스</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-2">가스 주입 및 플라즈마 생성</h4>
                      <p className="text-sm text-gray-700">
                        반응기 내부로 식각 가스(SF₆, CF₄, Cl₂ 등)를 주입하고, RF 전력을 인가하여 플라즈마를 생성합니다.
                        전자가 가스 분자와 충돌하여 이온화가 발생하며, 양이온과 활성 라디칼이 생성됩니다.
                      </p>
                      <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                        <strong>예:</strong> SF₆ + e⁻ → SF₅⁺ + F* + 2e⁻
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-purple-900 mb-2">분자 해리 및 라디칼 생성</h4>
                      <p className="text-sm text-gray-700">
                        플라즈마 내에서 전자 충돌에 의해 가스 분자가 분해되어 활성 라디칼이 생성됩니다.
                        이 라디칼들은 전기적으로 중성이지만 화학적으로 매우 활성이 높습니다.
                      </p>
                      <div className="mt-2 text-xs bg-purple-50 p-2 rounded">
                        <strong>예:</strong> CF₄ → C + 4F* (불소 라디칼 생성)
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 mb-2">웨이퍼 표면으로 확산</h4>
                      <p className="text-sm text-gray-700">
                        생성된 이온과 라디칼이 웨이퍼 표면으로 이동합니다. 이온은 전기장에 의해 가속되어 방향성을 가지며,
                        라디칼은 농도 구배에 따라 확산으로 이동합니다.
                      </p>
                      <div className="mt-2 text-xs bg-green-50 p-2 rounded">
                        이온: 수직 입사 (방향성) / 라디칼: 등방성 확산
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-yellow-900 mb-2">표면 흡착 및 반응</h4>
                      <p className="text-sm text-gray-700">
                        라디칼이 실리콘 표면에 흡착되고, 이온 충격에 의해 반응이 활성화됩니다.
                        이온의 운동 에너지가 화학 반응의 활성화 에너지를 낮추어 식각을 촉진합니다.
                      </p>
                      <div className="mt-2 text-xs bg-yellow-50 p-2 rounded">
                        <strong>표면 반응:</strong> Si(s) + 4F*(ads) → SiF₄(g)
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg">5</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-900 mb-2">부산물 생성 및 배출</h4>
                      <p className="text-sm text-gray-700">
                        식각 반응의 결과로 휘발성 부산물(SiF₄, SiCl₄ 등)이 생성됩니다.
                        이 부산물들은 기체 상태로 표면에서 탈착되어 진공 펌프를 통해 배출됩니다.
                      </p>
                      <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                        부산물의 휘발성이 식각률과 선택비를 결정하는 핵심 요소
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">식각 반응 에너지 다이어그램</h3>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <div className="text-center text-sm font-semibold text-gray-700 mb-4">
                      Si + F* → SiF₄ 반응 경로
                    </div>
                    <div className="relative h-48 bg-gradient-to-b from-blue-50 to-white rounded-lg p-4 border border-blue-200">
                      <div className="absolute top-8 left-8 text-xs">
                        <div className="font-bold">Si + F*</div>
                        <div className="text-gray-600">(반응물)</div>
                      </div>
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-red-100 border-2 border-red-400 rounded px-3 py-1 text-xs font-bold">
                          활성화 에너지
                        </div>
                        <div className="text-xs text-center text-gray-600 mt-1">이온 충격으로 감소!</div>
                      </div>
                      <div className="absolute bottom-8 right-8 text-xs text-right">
                        <div className="font-bold">SiF₄↑</div>
                        <div className="text-gray-600">(휘발성 생성물)</div>
                      </div>
                      <svg className="absolute inset-0 w-full h-full" style={{pointerEvents: 'none'}}>
                        <path d="M 60 140 Q 150 40, 240 120 Q 280 140, 320 160"
                              stroke="#2563eb" strokeWidth="3" fill="none"
                              markerEnd="url(#arrowhead)"/>
                        <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb"/>
                          </marker>
                        </defs>
                      </svg>
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      ⚡ 이온 충격 에너지가 활성화 에너지를 낮추어 반응을 촉진합니다
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">⚡ 이온의 역할</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">1.</span>
                      <span><strong>방향성 제공:</strong> 전기장에 의해 수직으로 가속되어 이방성 식각 구현</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">2.</span>
                      <span><strong>반응 활성화:</strong> 운동 에너지로 화학 반응의 활성화 에너지 감소</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">3.</span>
                      <span><strong>물리적 제거:</strong> 스퍼터링으로 직접 원자 탈착 (보조적 역할)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">4.</span>
                      <span><strong>억제층 제거:</strong> 측벽의 보호막을 선택적으로 제거</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🧪 라디칼의 역할</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">1.</span>
                      <span><strong>화학 반응:</strong> 실리콘과 직접 반응하여 휘발성 화합물 생성</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">2.</span>
                      <span><strong>선택비 향상:</strong> 특정 물질에 대한 화학적 선택성 제공</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">3.</span>
                      <span><strong>식각률 증가:</strong> 높은 라디칼 농도로 빠른 식각 가능</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">4.</span>
                      <span><strong>표면 개질:</strong> 측벽에 보호층 형성 (폴리머 증착)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">🎯 RIE의 시너지 효과</h3>
                <p className="text-sm text-gray-700 mb-4">
                  반응성 이온 식각(RIE)은 화학적 식각과 물리적 식각의 장점을 결합하여 높은 이방성과 적절한 선택비를 동시에 달성합니다.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="font-bold text-red-700 mb-2">순수 화학 식각</div>
                    <div className="text-gray-600">• 등방성 (A=0)</div>
                    <div className="text-gray-600">• 높은 선택비</div>
                    <div className="text-gray-600">• 언더컷 발생</div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded shadow-sm border-2 border-purple-400">
                    <div className="font-bold text-purple-900 mb-2">⚡ RIE (최적)</div>
                    <div className="text-gray-700">• 이방성 (A=0.7-0.9)</div>
                    <div className="text-gray-700">• 적절한 선택비</div>
                    <div className="text-gray-700">• 수직 프로파일</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="font-bold text-blue-700 mb-2">순수 물리 식각</div>
                    <div className="text-gray-600">• 이방성 (A=1)</div>
                    <div className="text-gray-600">• 낮은 선택비</div>
                    <div className="text-gray-600">• 표면 손상</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Si 식각 메커니즘 3D 시뮬레이션</h2>

            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                실리콘 식각 과정을 3D로 시각화합니다. 다양한 식각 가스를 선택하여 가스 분자의 플라즈마 영역 진입,
                분해를 통한 라디칼 생성, 실리콘 표면 반응, 그리고 휘발성 부산물 배출까지의 전체 프로세스를 실시간으로 관찰할 수 있습니다.
              </p>
            </div>

            <SiliconEtchingSimulator />

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">📊 시뮬레이션 관찰 포인트</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>가스 종류에 따른 분자 구조 차이 (팔면체, 사면체, 2원자)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>플라즈마 영역에서 분자 해리 현상</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>라디칼의 실리콘 표면으로의 확산 과정</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Si 원자 제거에 따른 식각 깊이 증가</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>휘발성 부산물(SiF₄, SiCl₄ 등)의 위로 배출</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">🔬 가스별 특성 비교</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="font-bold text-green-700">SF₆: 가장 빠른 식각</div>
                    <div className="text-xs text-gray-600">6개의 F 라디칼 생성, 높은 반응성</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="font-bold text-gray-700">CF₄: 안정적인 식각</div>
                    <div className="text-xs text-gray-600">4개의 F 라디칼, 중간 속도</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="font-bold text-blue-700">Cl₂: 이방성 우수</div>
                    <div className="text-xs text-gray-600">2개의 Cl 라디칼, 방향성 제어</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="font-bold text-orange-700">HBr: 깊은 트렌치</div>
                    <div className="text-xs text-gray-600">Br 라디칼, 고선택비</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">식각 공정 이해도 평가</h2>

            <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-5 rounded-r-lg">
              <h3 className="font-semibold text-green-900 mb-2">📝 학습 내용 확인</h3>
              <p className="text-sm text-gray-700">
                앞서 학습한 식각 공정의 원리, 메커니즘, 가스 종류와 특성 등을 이해했는지 확인하는 문제들입니다.
              </p>
            </div>

            <div className="space-y-6">
              <QuizSection
                number={1}
                question="습식 식각과 건식 식각의 가장 큰 차이점은 무엇인가요?"
                options={[
                  "식각 속도의 차이",
                  "식각 방향성 (등방성 vs 이방성)",
                  "사용하는 화학물질의 종류",
                  "온도 조건"
                ]}
                correctAnswer={1}
                explanation="습식 식각은 등방성(isotropic)으로 모든 방향으로 균일하게 식각되며, 건식 식각은 이방성(anisotropic)으로 수직 방향으로 선택적 식각이 가능합니다."
              />

              <QuizSection
                number={2}
                question="RIE(Reactive Ion Etching)에서 '이온'의 주요 역할이 아닌 것은?"
                options={[
                  "반응의 방향성 제공",
                  "화학 반응 활성화 에너지 감소",
                  "휘발성 부산물 생성",
                  "물리적 스퍼터링"
                ]}
                correctAnswer={2}
                explanation="휘발성 부산물 생성은 라디칼의 화학 반응에 의한 것입니다. 이온은 방향성 제공, 반응 활성화, 물리적 스퍼터링 역할을 합니다."
              />

              <QuizSection
                number={3}
                question="SF₆ 가스가 플라즈마에서 분해될 때 생성되는 활성 라디칼은?"
                options={[
                  "Cl*",
                  "F*",
                  "O*",
                  "Br*"
                ]}
                correctAnswer={1}
                explanation="SF₆ → S + 6F* 반응으로 불소(F) 라디칼이 생성됩니다. 이 F 라디칼이 실리콘과 반응하여 SiF₄ 부산물을 생성합니다."
              />

              <QuizSection
                number={4}
                question="선택비(Selectivity) 50:1이 의미하는 것은?"
                options={[
                  "목표 물질이 50배 빠르게 식각됨",
                  "50개의 라디칼이 필요함",
                  "50초 동안 식각함",
                  "50% 효율로 식각됨"
                ]}
                correctAnswer={0}
                explanation="선택비는 목표 물질과 다른 물질의 식각률 비율입니다. 50:1은 목표 물질이 다른 물질보다 50배 빠르게 식각된다는 의미입니다."
              />

              <QuizSection
                number={5}
                question="이방성 지수(Anisotropy) A=1일 때의 의미는?"
                options={[
                  "완전 등방성 식각",
                  "완전 이방성 식각 (수직 방향만)",
                  "50% 등방성, 50% 이방성",
                  "식각이 일어나지 않음"
                ]}
                correctAnswer={1}
                explanation="A = 1 - (수평/수직) 식에서 A=1은 수평 식각이 0이라는 의미로, 완전히 수직 방향으로만 식각되는 이상적인 이방성 식각입니다."
              />

              <QuizSection
                number={6}
                question="실리콘 식각에서 생성된 SiF₄ 부산물의 중요한 특성은?"
                options={[
                  "고체 상태로 표면에 쌓임",
                  "휘발성으로 기체 상태로 배출됨",
                  "액체 상태로 용해됨",
                  "플라즈마를 생성함"
                ]}
                correctAnswer={1}
                explanation="SiF₄는 휘발성(volatile) 화합물로 기체 상태로 표면에서 쉽게 탈착되어 진공 펌프로 배출됩니다. 이 휘발성이 식각 진행에 매우 중요합니다."
              />

              <QuizSection
                number={7}
                question="플라즈마 식각 공정에서 라디칼의 이동 방식은?"
                options={[
                  "전기장에 의해 직선으로 가속",
                  "농도 구배에 따른 확산",
                  "중력에 의해 낙하",
                  "자기장을 따라 회전"
                ]}
                correctAnswer={1}
                explanation="라디칼은 전기적으로 중성이므로 전기장의 영향을 받지 않고, 농도 구배(concentration gradient)에 따라 확산으로 이동합니다."
              />

              <QuizSection
                number={8}
                question="ARDE 효과가 가리키는 것은?"
                options={[
                  "Aspect Ratio Dependent Etching - 종횡비에 따른 식각률 변화",
                  "Advanced Radical Distribution Effect - 라디칼 분포 효과",
                  "Anisotropic Rate Differential Etching - 이방성 차등 식각",
                  "Automatic Reaction Detection Equipment - 자동 반응 검출"
                ]}
                correctAnswer={0}
                explanation="ARDE는 Aspect Ratio Dependent Etching으로, 홀이나 트렌치의 깊이/폭 비율(종횡비)에 따라 식각률이 달라지는 현상을 의미합니다."
              />

              <QuizSection
                number={9}
                question="CF₄ 가스가 플라즈마에서 분해될 때 생성되는 라디칼의 개수는?"
                options={[
                  "1개 (1F)",
                  "2개 (2F)",
                  "4개 (4F)",
                  "6개 (6F)"
                ]}
                correctAnswer={2}
                explanation="CF₄ → C + 4F* 반응으로 4개의 불소 라디칼이 생성됩니다. SF₆는 6개, Cl₂는 2개의 라디칼을 생성합니다."
              />

              <QuizSection
                number={10}
                question="미세 패턴 형성에 가장 적합한 식각 방법은?"
                options={[
                  "습식 식각 (Wet Etching)",
                  "등방성 플라즈마 식각",
                  "이방성 RIE",
                  "화학적 용해"
                ]}
                correctAnswer={2}
                explanation="미세 패턴은 수직 프로파일과 정밀한 치수 제어가 필요하므로, 이방성(anisotropic)이 높은 RIE(Reactive Ion Etching)가 가장 적합합니다."
              />
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 학습 완료!</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                모든 문제를 풀어보셨나요? 식각 공정은 반도체 제조에서 패턴을 형성하는 핵심 공정입니다.
                습식/건식 식각의 차이, RIE의 원리, 다양한 식각 가스의 특성, 그리고 선택비와 이방성의 개념을 잘 이해하셨기를 바랍니다.
                3D 시뮬레이션을 통해 실제 식각 메커니즘을 시각적으로 확인하면서 더욱 깊이 있는 학습이 되셨기를 바랍니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Quiz Section Component
const QuizSection = ({ number, question, options, correctAnswer, explanation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">
        <span className="text-blue-600">Q{number}.</span> {question}
      </h3>
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showExplanation}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              selectedAnswer === index
                ? index === correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-900'
                  : 'bg-red-100 border-red-500 text-red-900'
                : showExplanation && index === correctAnswer
                ? 'bg-green-50 border-green-400'
                : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span className="font-medium mr-2">{index + 1}.</span>
            {option}
            {showExplanation && index === correctAnswer && (
              <span className="float-right text-green-600">✓</span>
            )}
            {selectedAnswer === index && index !== correctAnswer && (
              <span className="float-right text-red-600">✗</span>
            )}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-start gap-2">
            <span className="text-lg">{isCorrect ? '✅' : '💡'}</span>
            <div>
              <div className="font-semibold text-sm mb-1">
                {isCorrect ? '정답입니다!' : '정답: ' + options[correctAnswer]}
              </div>
              <div className="text-sm text-gray-700">{explanation}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtchSimulator;
