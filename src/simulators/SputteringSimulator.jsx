import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function SputteringSimulator() {
  const mountRef = useRef(null);
  const isPowerOnRef = useRef(false);
  const ionEnergyRef = useRef(50);
  const magneticFieldRef = useRef(50);
  const zoomRef = useRef(22);
  const cameraAngleRef = useRef(0);
  const isRotatingRef = useRef(true);
  const cameraModeRef = useRef(1);

  const [isPowerOn, setIsPowerOn] = useState(false);
  const [ionEnergy, setIonEnergy] = useState(50);
  const [magneticField, setMagneticField] = useState(50);
  const [depositedCount, setDepositedCount] = useState(0);
  const [zoom, setZoom] = useState(22);
  const [cameraMode, setCameraMode] = useState(1);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => { isRotatingRef.current = isRotating; }, [isRotating]);
  useEffect(() => { cameraModeRef.current = cameraMode; }, [cameraMode]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const handleWheel = (e) => {
      e.preventDefault();
      const newZoom = Math.max(12, Math.min(40, zoomRef.current + e.deltaY * 0.01));
      setZoom(newZoom);
      zoomRef.current = newZoom;
    };
    mountRef.current.addEventListener('wheel', handleWheel, { passive: false });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const targetRadius = 4;
    const targetLayers = 4;
    const atomSpacing = 0.15; // 0.25→0.15 더 촘촘하게
    const atomRadius = 0.05;
    const targetBaseY = 5;
    const targetHeight = targetLayers * atomSpacing * 0.8;
    const targetTopY = targetBaseY + targetHeight;
    const magnetRad = targetRadius * 0.7; // S극들이 만드는 원 반경 (erosion track)

    // ===== 타겟을 감싸는 챔버 (반투명 실린더 + 테두리) =====
    const chamberRadius = targetRadius * 1.05;
    const chamberBottom = targetBaseY + 0.5;
    const chamberTop = targetTopY + 0.3;
    const chamberH = chamberTop - chamberBottom;

    const chamberGeo = new THREE.CylinderGeometry(chamberRadius, chamberRadius, chamberH, 16, 1, true); // 32→16
    const chamberMat = new THREE.MeshBasicMaterial({
      color: 0x4488cc,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.set(0, chamberBottom + chamberH / 2, 0);
    chamber.renderOrder = 1;
    scene.add(chamber);

    const numLines = 12; // 16→12
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const x = Math.cos(angle) * chamberRadius;
      const z = Math.sin(angle) * chamberRadius;
      const points = [
        new THREE.Vector3(x, chamberBottom, z),
        new THREE.Vector3(x, chamberTop, z)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.4 });
      scene.add(new THREE.Line(lineGeo, lineMat));
    }

    const topCirclePoints = [];
    for (let i = 0; i <= 32; i++) { // 64→32
      const angle = (i / 32) * Math.PI * 2;
      topCirclePoints.push(new THREE.Vector3(Math.cos(angle) * chamberRadius, chamberTop, Math.sin(angle) * chamberRadius));
    }
    const topCircleGeo = new THREE.BufferGeometry().setFromPoints(topCirclePoints);
    const circleMat = new THREE.LineBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Line(topCircleGeo, circleMat));

    const bottomCirclePoints = [];
    for (let i = 0; i <= 32; i++) { // 64→32
      const angle = (i / 32) * Math.PI * 2;
      bottomCirclePoints.push(new THREE.Vector3(Math.cos(angle) * chamberRadius, chamberBottom, Math.sin(angle) * chamberRadius));
    }
    const bottomCircleGeo = new THREE.BufferGeometry().setFromPoints(bottomCirclePoints);
    scene.add(new THREE.Line(bottomCircleGeo, circleMat));

    // ===== TARGET ATOMS (InstancedMesh로 최적화 + 자동 재생성) =====
    const atomGeometry = new THREE.SphereGeometry(atomRadius, 4, 4);
    const gridSize = Math.ceil(targetRadius / atomSpacing);
    const targetAtomData = []; // 원자 데이터만 저장

    // Erosion track 반경 (S극들이 만드는 원)
    const erosionRadius = magnetRad;
    const erosionWidth = 0.5; // 더 좁은 링 패턴

    // 층별 원자 개수 추적
    let currentTopLayer = targetLayers - 1;
    const removedCountPerLayer = {}; // 층별 제거된 원자 수
    let atomsInOneLayer = 0; // 한 층당 원자 수

    // 전체 원자 개수 계산
    let totalAtoms = 0;
    for (let layer = 0; layer < targetLayers; layer++) {
      let layerCount = 0;
      for (let i = -gridSize; i <= gridSize; i++) {
        for (let j = -gridSize; j <= gridSize; j++) {
          const x = j * atomSpacing;
          const z = i * atomSpacing;
          const dist = Math.sqrt(x * x + z * z);
          if (dist <= targetRadius * 0.9) {
            totalAtoms++;
            layerCount++;
          }
        }
      }
      if (layer === 0) atomsInOneLayer = layerCount;
    }

    // InstancedMesh 생성
    const instancedAtomMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.8
    });
    const instancedAtoms = new THREE.InstancedMesh(
      atomGeometry,
      instancedAtomMaterial,
      totalAtoms
    );

    let atomIndex = 0;
    const dummy = new THREE.Object3D();

    for (let layer = 0; layer < targetLayers; layer++) {
      const brightness = 0.5 + (layer / targetLayers) * 0.5;
      const color = new THREE.Color(0.2 * brightness, 0.4 * brightness, 1.0 * brightness);
      removedCountPerLayer[layer] = 0;

      for (let i = -gridSize; i <= gridSize; i++) {
        for (let j = -gridSize; j <= gridSize; j++) {
          const x = j * atomSpacing;
          const z = i * atomSpacing;
          const dist = Math.sqrt(x * x + z * z);

          if (dist <= targetRadius * 0.9) {
            const y = targetBaseY + layer * atomSpacing * 0.8;

            dummy.position.set(x, y, z);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            instancedAtoms.setMatrixAt(atomIndex, dummy.matrix);
            instancedAtoms.setColorAt(atomIndex, color);

            targetAtomData.push({
              index: atomIndex,
              layer: layer,
              originalLayer: layer, // 원래 층 저장 (리셋용)
              x: x,
              z: z,
              active: true
            });

            atomIndex++;
          }
        }
      }
    }

    instancedAtoms.instanceMatrix.needsUpdate = true;
    instancedAtoms.instanceColor.needsUpdate = true;
    scene.add(instancedAtoms);

    // 특정 층의 원자들을 새로운 맨 위층으로 재생성
    const regenerateLayer = (oldLayer) => {
      currentTopLayer++;
      const newY = targetBaseY + (currentTopLayer % targetLayers) * atomSpacing * 0.8 + targetLayers * atomSpacing * 0.8;
      const brightness = 0.7 + Math.random() * 0.3;
      const color = new THREE.Color(0.2 * brightness, 0.4 * brightness, 1.0 * brightness);

      for (const atomData of targetAtomData) {
        if (atomData.layer === oldLayer && !atomData.active) {
          atomData.layer = currentTopLayer;
          atomData.active = true;

          dummy.position.set(atomData.x, newY, atomData.z);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          instancedAtoms.setMatrixAt(atomData.index, dummy.matrix);
          instancedAtoms.setColorAt(atomData.index, color);
        }
      }
      removedCountPerLayer[oldLayer] = 0;
      removedCountPerLayer[currentTopLayer] = 0;
      instancedAtoms.instanceMatrix.needsUpdate = true;
      instancedAtoms.instanceColor.needsUpdate = true;
    };

    // 특정 위치에서 가장 아래층(표면) 원자 찾기
    const findSurfaceAtom = (hitX, hitZ) => {
      const searchRadius = 0.25; // 더 정밀한 검색
      let surfaceAtom = null;
      let minLayer = Infinity;

      for (const atomData of targetAtomData) {
        if (!atomData.active) continue;
        if (atomData.layer >= minLayer) continue;

        const dx = atomData.x - hitX;
        const dz = atomData.z - hitZ;
        if (Math.abs(dx) > searchRadius || Math.abs(dz) > searchRadius) continue;

        const distSq = dx*dx + dz*dz;
        if (distSq < searchRadius * searchRadius) {
          if (atomData.layer < minLayer) {
            minLayer = atomData.layer;
            surfaceAtom = atomData;
          }
        }
      }

      return surfaceAtom;
    };

    // Erosion track 근처인지 확인 (S극 원 주변)
    const isNearErosionTrack = (x, z) => {
      const dist = Math.sqrt(x*x + z*z);
      return Math.abs(dist - erosionRadius) < erosionWidth;
    };

    // ===== MAGNETS =====
    const magnetY = targetTopY + 0.5;

    const nGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16); // 24→16
    const nMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const nPole = new THREE.Mesh(nGeo, nMat);
    nPole.position.set(0, magnetY, 0);
    scene.add(nPole);

    const sGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.8, 16); // 24→16
    const sMat = new THREE.MeshBasicMaterial({ color: 0x000066 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const sPole = new THREE.Mesh(sGeo, sMat);
      sPole.position.set(Math.cos(angle) * magnetRad, magnetY, Math.sin(angle) * magnetRad);
      scene.add(sPole);
    }

    // ===== MAGNETIC FIELD LINES =====
    const fieldLines = [];
    const fieldDepth = targetHeight + 0.5; // 타겟 두께 + 약간
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const pts = [];
      for (let t = 0; t <= 15; t++) {
        const p = t / 15;
        pts.push(new THREE.Vector3(
          Math.cos(angle) * magnetRad * p,
          magnetY - Math.sin(p * Math.PI) * fieldDepth,
          Math.sin(angle) * magnetRad * p
        ));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      fieldLines.push(line);
    }

    // ===== SUBSTRATE =====
    const subGeo = new THREE.CylinderGeometry(targetRadius * 1.2, targetRadius * 1.2, 0.3, 16); // 24→16
    const subMat = new THREE.MeshBasicMaterial({ color: 0x666666 });
    const substrate = new THREE.Mesh(subGeo, subMat);
    substrate.position.set(0, -5, 0);
    scene.add(substrate);

    // ===== PLASMA =====
    const plasmaGeo = new THREE.CylinderGeometry(targetRadius * 0.9, targetRadius * 0.9, 1.5, 16); // 24→16
    const plasmaMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.25, depthWrite: false });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.position.set(0, targetBaseY - 0.75, 0); // 타겟 바로 아래
    plasma.visible = false;
    scene.add(plasma);

    // 플라즈마 입자: 전자(파란), Ar⁺이온(주황), Ar중성(회색)
    const pCount = 80; // 120→80으로 추가 감소
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const pType = []; // 입자 타입 저장
    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * targetRadius * 0.8;
      pPos[i*3] = Math.cos(a) * r;
      pPos[i*3+1] = targetBaseY - 1.5 + Math.random() * 1.5; // 타겟 바로 아래
      pPos[i*3+2] = Math.sin(a) * r;
      const t = Math.random();
      if (t < 0.35) {
        // 전자 (e⁻) - 밝은 파란색
        pCol[i*3]=0.3; pCol[i*3+1]=0.6; pCol[i*3+2]=1.0;
        pType.push('electron');
      } else if (t < 0.65) {
        // Ar⁺ 이온 - 주황색
        pCol[i*3]=1.0; pCol[i*3+1]=0.5; pCol[i*3+2]=0.0;
        pType.push('arion');
      } else {
        // Ar 중성 - 회색
        pCol[i*3]=0.5; pCol[i*3+1]=0.5; pCol[i*3+2]=0.5;
        pType.push('arneutral');
      }
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.9 });
    const plasmaPoints = new THREE.Points(pGeo, pMat);
    plasmaPoints.visible = false;
    scene.add(plasmaPoints);

    const arIons = [];
    const sputteredAtoms = [];
    const depositedAtoms = [];
    let frameCount = 0;
    let localDeposited = 0;

    // 공유 geometry (재사용) - 세그먼트 최소화
    const sharedIonGeo = new THREE.SphereGeometry(0.15, 5, 5); // 6→5
    const sharedSputterGeo = new THREE.SphereGeometry(0.1, 5, 5); // 6→5
    const sharedDepositGeo = new THREE.SphereGeometry(0.08, 4, 4);

    // 리셋 함수
    const resetDeposition = () => {
      // 증착된 원자들 모두 제거
      depositedAtoms.forEach(atom => scene.remove(atom));
      depositedAtoms.length = 0;
      localDeposited = 0;
      setDepositedCount(0);

      // 낙하 중인 스퍼터 원자들 제거
      sputteredAtoms.forEach(atom => scene.remove(atom));
      sputteredAtoms.length = 0;

      // Ar+ 이온들 제거
      arIons.forEach(ion => scene.remove(ion));
      arIons.length = 0;

      // 타겟 원자 원래 상태로 복원
      currentTopLayer = targetLayers - 1;
      for (let i = 0; i < targetLayers; i++) {
        removedCountPerLayer[i] = 0;
      }

      for (const atomData of targetAtomData) {
        const origLayer = atomData.originalLayer;
        atomData.layer = origLayer;
        atomData.active = true;

        const y = targetBaseY + origLayer * atomSpacing * 0.8;
        const brightness = 0.5 + (origLayer / targetLayers) * 0.5;
        const color = new THREE.Color(0.2 * brightness, 0.4 * brightness, 1.0 * brightness);

        dummy.position.set(atomData.x, y, atomData.z);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        instancedAtoms.setMatrixAt(atomData.index, dummy.matrix);
        instancedAtoms.setColorAt(atomData.index, color);
      }
      instancedAtoms.instanceMatrix.needsUpdate = true;
      instancedAtoms.instanceColor.needsUpdate = true;
    };

    // 리셋 이벤트 리스너 등록
    window.addEventListener('resetDeposition', resetDeposition);

    // Ar⁺ 이온 생성 - erosion track (S극 원) 근처에서 집중 생성
    const createIon = () => {
      const m = new THREE.MeshBasicMaterial({ color: 0xff8800 });
      const ion = new THREE.Mesh(sharedIonGeo, m);

      // 90% 확률로 S극 원(racetrack) 위에서 생성 - 도넛 형태
      let r, a;
      if (Math.random() < 0.9) {
        // S극들이 만드는 원 위 (erosion track = donut/ring shape)
        r = erosionRadius + (Math.random() - 0.5) * erosionWidth * 0.8;
        a = Math.random() * Math.PI * 2;
      } else {
        // 10%는 전체 영역 (가운데, 바깥쪽도 약간)
        r = Math.random() * targetRadius * 0.8;
        a = Math.random() * Math.PI * 2;
      }

      ion.position.set(Math.cos(a)*r, targetBaseY - 1.0 + Math.random() * 0.8, Math.sin(a)*r);
      ion.userData.vy = 0.05 + 0.1 * (ionEnergyRef.current / 100);
      scene.add(ion);
      arIons.push(ion);
    };

    // 타겟 원자 제거 및 스퍼터된 원자 생성
    const sputterAtom = (hitX, hitZ) => {
      const surfaceAtom = findSurfaceAtom(hitX, hitZ);
      if (!surfaceAtom) return;

      const removedLayer = surfaceAtom.layer;

      // 타겟에서 원자 제거
      surfaceAtom.active = false;
      dummy.position.set(0, 0, 0);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      instancedAtoms.setMatrixAt(surfaceAtom.index, dummy.matrix);
      instancedAtoms.instanceMatrix.needsUpdate = true;

      // 해당 층의 제거된 원자 수 증가
      if (!removedCountPerLayer[removedLayer]) removedCountPerLayer[removedLayer] = 0;
      removedCountPerLayer[removedLayer]++;

      // 한 층이 완전히 깎이면 새 층 생성
      if (removedCountPerLayer[removedLayer] >= atomsInOneLayer) {
        regenerateLayer(removedLayer);
      }

      const atomX = surfaceAtom.x;
      const atomZ = surfaceAtom.z;

      // 스퍼터 개수
      const bFactor = magneticFieldRef.current / 100;
      const eFactor = ionEnergyRef.current / 100;
      const count = Math.floor(1 + 1.5 * bFactor * eFactor + Math.random() * 1);

      for (let i = 0; i < count; i++) {
        const m = new THREE.MeshBasicMaterial({ color: 0x4488ff });
        const atom = new THREE.Mesh(sharedSputterGeo, m);

        atom.position.set(atomX + (Math.random()-0.5)*0.2, targetBaseY, atomZ + (Math.random()-0.5)*0.2);
        atom.userData.vy = -0.03 - Math.random() * 0.03; // 초기 낙하 속도 증가
        atom.userData.gravity = -0.002; // 중력 가속도 증가

        const spreadAngle = Math.random() * Math.PI * 2;
        const spreadDist = Math.random() * 0.03;
        atom.userData.vx = Math.cos(spreadAngle) * spreadDist;
        atom.userData.vz = Math.sin(spreadAngle) * spreadDist;

        scene.add(atom);
        sputteredAtoms.push(atom);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const rad = zoomRef.current;
      if (isRotatingRef.current) cameraAngleRef.current += 0.005;

      if (cameraModeRef.current === 1) {
        camera.position.set(rad * Math.cos(cameraAngleRef.current), 2, rad * Math.sin(cameraAngleRef.current));
        camera.lookAt(0, 0, 0);
      } else if (cameraModeRef.current === 2) {
        camera.position.set(rad * 0.8 * Math.cos(cameraAngleRef.current), -2, rad * 0.8 * Math.sin(cameraAngleRef.current));
        camera.lookAt(0, magnetY, 0);
      } else {
        camera.position.set(rad * 0.1 * Math.cos(cameraAngleRef.current), rad + 10, rad * 0.1 * Math.sin(cameraAngleRef.current));
        camera.lookAt(0, magnetY, 0);
      }

      const fs = magneticFieldRef.current / 100;
      fieldLines.forEach(l => { l.material.opacity = 0.3 + fs * 0.5; });

      plasma.visible = isPowerOnRef.current;
      plasmaPoints.visible = isPowerOnRef.current;

      if (isPowerOnRef.current) {
        // 플라즈마 파티클 업데이트 (2프레임마다)
        if (frameCount % 2 === 0) {
          const pos = plasmaPoints.geometry.attributes.position.array;
          for (let i = 0; i < pCount; i++) {
            pos[i*3] += (Math.random()-0.5)*0.08;
            pos[i*3+1] += (Math.random()-0.5)*0.06;
            pos[i*3+2] += (Math.random()-0.5)*0.08;
            const x = pos[i*3], z = pos[i*3+2];
            const d = Math.sqrt(x*x + z*z);
            if (d > targetRadius*0.85) {
              const ang = Math.atan2(z, x);
              pos[i*3] = Math.cos(ang)*targetRadius*0.8;
              pos[i*3+2] = Math.sin(ang)*targetRadius*0.8;
            }
            if (pos[i*3+1] < targetBaseY - 1.5) pos[i*3+1] = targetBaseY - 1.5;
            if (pos[i*3+1] > targetBaseY) pos[i*3+1] = targetBaseY;
          }
          plasmaPoints.geometry.attributes.position.needsUpdate = true;
        }

        // 플라즈마 밀도 조절 (B-Field에 따라)
        const bField = magneticFieldRef.current / 100;
        plasma.material.opacity = 0.15 + bField * 0.2;
        pMat.opacity = 0.6 + bField * 0.4;

        frameCount++;
        // B-Field와 Ion Energy 모두 반영하여 이온 생성 빈도 증가
        const eField = ionEnergyRef.current / 100;
        const ionInterval = Math.max(1, Math.floor(6 - bField * 3 - eField * 2));
        if (frameCount % ionInterval === 0) createIon();
        // 이온/스퍼터 원자 개수 제한 (라이프타임 증가)
        const maxIons = Math.floor(30 + bField * 30 + eField * 20);
        const maxSputtered = Math.floor(300 + bField * 100 + eField * 100); // 150→500 대폭 증가
        while (arIons.length > maxIons) scene.remove(arIons.shift());
        while (sputteredAtoms.length > maxSputtered) scene.remove(sputteredAtoms.shift());

        for (let i = arIons.length-1; i >= 0; i--) {
          const ion = arIons[i];
          ion.position.y += ion.userData.vy;
          // 타겟 최하층 표면(targetBaseY)에 정확히 도달
          if (ion.position.y >= targetBaseY) {
            sputterAtom(ion.position.x, ion.position.z);
            scene.remove(ion);
            arIons.splice(i, 1);
          }
        }

        for (let i = sputteredAtoms.length-1; i >= 0; i--) {
          const atom = sputteredAtoms[i];

          // 중력 가속도 적용
          atom.userData.vy += atom.userData.gravity || -0.0015;
          atom.position.y += atom.userData.vy;
          atom.position.x += atom.userData.vx || 0;
          atom.position.z += atom.userData.vz || 0;

          // 웨이퍼 반경 체크
          const waferRadius = targetRadius * 1.2;
          const distFromCenter = Math.sqrt(atom.position.x * atom.position.x + atom.position.z * atom.position.z);

          if (atom.position.y <= -4.7) {
            // 웨이퍼 안에 있으면 증착
            if (distFromCenter <= waferRadius) {
              const dm = new THREE.MeshBasicMaterial({ color: 0x4488ff });
              const dep = new THREE.Mesh(sharedDepositGeo, dm);
              dep.position.set(atom.position.x, -4.85, atom.position.z);
              scene.add(dep);
              depositedAtoms.push(dep);
              localDeposited++;
            }
            // 웨이퍼 밖이든 안이든 스퍼터 원자는 제거
            scene.remove(atom);
            sputteredAtoms.splice(i, 1);
          }
          // 너무 멀리 벗어나거나 아래로 떨어지면 제거 (조건 완화)
          else if (distFromCenter > waferRadius * 3 || atom.position.y < -15) {
            scene.remove(atom);
            sputteredAtoms.splice(i, 1);
          }
        }
        if (frameCount % 20 === 0) setDepositedCount(localDeposited);
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
      window.removeEventListener('resetDeposition', resetDeposition);
      if (mountRef.current) {
        mountRef.current.removeEventListener('wheel', handleWheel);
        if (renderer.domElement && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-3">
        <h1 className="text-xl font-bold text-white">⚛️ Magnetron Sputtering</h1>
        <p className="text-blue-200 text-xs">Plasma(e⁻, Ar⁺, Ar) → Ar⁺ bombards target → Sputtered atoms → Wafer</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1" ref={mountRef} />

        <div className="w-72 bg-gray-800 p-3 overflow-y-auto">
          <div className="mb-3 p-3 bg-gray-900 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400 text-sm">Power:</span>
              <span className={`font-bold ${isPowerOn ? 'text-red-400' : 'text-gray-500'}`}>
                {isPowerOn ? '🔴 ON' : '⚫ OFF'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Deposited:</span>
              <span className="font-bold text-blue-400 text-lg">{depositedCount}</span>
            </div>
          </div>

          <button
            onClick={() => { const v = !isPowerOn; setIsPowerOn(v); isPowerOnRef.current = v; }}
            className={`w-full py-3 rounded-lg font-bold mb-3 ${isPowerOn ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-200'}`}
          >
            ⚡ POWER {isPowerOn ? 'OFF' : 'ON'}
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event('resetDeposition'))}
            className="w-full py-2 rounded-lg font-bold mb-3 bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            🔄 RESET ALL
          </button>

          <div className="mb-3 p-2 bg-purple-900 rounded-lg">
            <div className="grid grid-cols-3 gap-1 mb-2">
              <button onClick={() => setCameraMode(1)}
                className={`py-2 rounded font-bold text-xs ${cameraMode === 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                Substrate
              </button>
              <button onClick={() => setCameraMode(2)}
                className={`py-2 rounded font-bold text-xs ${cameraMode === 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                Bottom↑
              </button>
              <button onClick={() => setCameraMode(3)}
                className={`py-2 rounded font-bold text-xs ${cameraMode === 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                Top↓
              </button>
            </div>
            <button onClick={() => setIsRotating(!isRotating)}
              className={`w-full py-2 rounded font-bold text-sm mb-2 ${isRotating ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
              {isRotating ? '🔄 Rotate' : '⏸️ Fixed'}
            </button>
            <div className="flex gap-2">
              <button onClick={() => { const z = Math.max(12, zoom-3); setZoom(z); zoomRef.current = z; }}
                className="flex-1 py-1 bg-green-700 text-white rounded font-bold">➕</button>
              <button onClick={() => { const z = Math.min(40, zoom+3); setZoom(z); zoomRef.current = z; }}
                className="flex-1 py-1 bg-blue-700 text-white rounded font-bold">➖</button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-300 text-sm mb-1">⚡ Ion Energy: {ionEnergy}%</label>
            <input type="range" min="20" max="100" value={ionEnergy}
              onChange={(e) => { setIonEnergy(Number(e.target.value)); ionEnergyRef.current = Number(e.target.value); }}
              className="w-full" />
          </div>

          <div className="mb-3">
            <label className="block text-gray-300 text-sm mb-1">🧲 B-Field: {magneticField}%</label>
            <input type="range" min="0" max="100" value={magneticField}
              onChange={(e) => { setMagneticField(Number(e.target.value)); magneticFieldRef.current = Number(e.target.value); }}
              className="w-full" />
          </div>

          <div className="p-3 bg-gray-900 rounded-lg text-xs">
            <h3 className="text-white font-bold mb-2">🎨 Legend</h3>
            <div className="space-y-1">
              <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div><span className="text-gray-300">N pole (center)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{background:'#000066'}}></div><span className="text-gray-300">S poles (8x)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 mr-2" style={{background:'#00ffff'}}></div><span className="text-gray-300">B-field lines</span></div>
              <div className="flex items-center"><div className="w-3 h-3 mr-2" style={{background:'rgba(68,136,204,0.5)'}}></div><span className="text-gray-300">Target chamber</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{background:'#3366cc'}}></div><span className="text-gray-300">Target atoms (4 layers)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{background:'#4d99ff'}}></div><span className="text-gray-300">e⁻ (electrons)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{background:'#ff8800'}}></div><span className="text-gray-300">Ar⁺ (ions)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{background:'#808080'}}></div><span className="text-gray-300">Ar (neutral)</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{background:'#4488ff'}}></div><span className="text-gray-300">Sputtered → Deposited</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded mr-2" style={{background:'#666666'}}></div><span className="text-gray-300">Substrate (wafer)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
