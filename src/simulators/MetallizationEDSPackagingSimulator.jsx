import React, { useState, useEffect, Fragment } from 'react';

const MetallizationEDSPackagingSimulator = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // 개요 탭 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  // 금속배선 상태
  const [metalType, setMetalType] = useState('copper');
  const [metalLayers, setMetalLayers] = useState(6);
  const [currentDensity, setCurrentDensity] = useState(1.0);

  // Damascene 상태
  const [damasceneType, setDamasceneType] = useState('dual');
  const [barrierMaterial, setBarrierMaterial] = useState('TaN/Ta');
  const [lineWidth, setLineWidth] = useState(45);
  const [cmpProgress, setCmpProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [damasceneStep, setDamasceneStep] = useState(0);

  // EDS 상태
  const [edsStep, setEdsStep] = useState(-1);
  const [probeType, setProbeType] = useState('mems');
  const [testTemp, setTestTemp] = useState('room');
  const [yieldRate, setYieldRate] = useState(92);
  const [totalDies, setTotalDies] = useState(500);
  const [waferMapData, setWaferMapData] = useState([]);
  const [edsAnimating, setEdsAnimating] = useState(false);

  // 패키징 상태
  const [packageType, setPackageType] = useState('bga');
  const [packageView, setPackageView] = useState('basic');

  // 본딩 상태
  const [bondingMethod, setBondingMethod] = useState('wire');
  const [wireCount, setWireCount] = useState(256);
  const [pitchSize, setPitchSize] = useState(150);

  // 퀴즈 상태
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);

  // 개요 씬 데이터
  const overviewScenes = [
    {
      title: "🔌 BEOL (Back-End-Of-Line)",
      content: "트랜지스터(FEOL) 제작 후, 수십억 개의 소자를 연결하는 금속 배선을 형성합니다. 현대 반도체는 10층 이상의 다층 금속 배선을 사용하며, 구리(Cu) Damascene 공정이 표준입니다.",
      highlight: "금속배선"
    },
    {
      title: "⚙️ Damascene 공정",
      content: "구리는 식각이 어려워 '먼저 파고, 채우는' Damascene 방식을 사용합니다. 트렌치/비아 식각 → 배리어 증착 → Cu 시드 → 전기도금 → CMP 평탄화 순서로 진행됩니다.",
      highlight: "Damascene"
    },
    {
      title: "🔍 EDS (Electrical Die Sorting)",
      content: "웨이퍼 레벨에서 각 칩의 전기적 특성을 검사합니다. 프로브 카드로 패드에 접촉하여 양품/불량을 선별하고, 수선 가능한 칩은 레이저로 복구합니다. 후공정 비용 절감의 핵심입니다.",
      highlight: "EDS"
    },
    {
      title: "📦 패키징 (Packaging)",
      content: "다이싱으로 개별 칩을 분리한 후, 외부와 전기적 연결을 형성합니다. Wire Bonding, Flip Chip 등의 본딩 기술과 함께 EMC 몰딩으로 보호합니다.",
      highlight: "패키징"
    },
    {
      title: "🚀 첨단 패키징 (2.5D/3D)",
      content: "무어의 법칙 한계를 극복하기 위해 수직 적층 기술이 발전합니다. 2.5D는 인터포저 위에 칩렛을 배치하고, 3D는 TSV로 다이를 직접 적층합니다. HBM, CoWoS가 대표적입니다.",
      highlight: "첨단"
    }
  ];

  // 타이핑 애니메이션
  useEffect(() => {
    if (isPlaying && currentScene < overviewScenes.length) {
      const scene = overviewScenes[currentScene];
      const fullText = scene.content;

      if (charIndex < fullText.length) {
        const timer = setTimeout(() => {
          setDisplayedText(fullText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 25);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          if (currentScene < overviewScenes.length - 1) {
            setCurrentScene(currentScene + 1);
            setCharIndex(0);
            setDisplayedText('');
          } else {
            setIsPlaying(false);
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isPlaying, currentScene, charIndex]);

  // CMP 애니메이션
  useEffect(() => {
    if (isProcessing && cmpProgress < 100) {
      const timer = setTimeout(() => setCmpProgress(prev => Math.min(prev + 2, 100)), 50);
      return () => clearTimeout(timer);
    }
    if (cmpProgress >= 100) {
      setIsProcessing(false);
      setDamasceneStep(4);
    }
  }, [isProcessing, cmpProgress]);

  // 웨이퍼 맵 생성
  useEffect(() => {
    const generateWaferMap = () => {
      const dies = [];
      const goodCount = Math.floor(totalDies * yieldRate / 100);
      const repairCount = Math.floor((totalDies - goodCount) * 0.3);
      for (let i = 0; i < totalDies; i++) {
        if (i < goodCount) dies.push('good');
        else if (i < goodCount + repairCount) dies.push('repair');
        else dies.push('fail');
      }
      for (let i = dies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dies[i], dies[j]] = [dies[j], dies[i]];
      }
      setWaferMapData(dies);
    };
    generateWaferMap();
  }, [yieldRate, totalDies]);

  const tabs = [
    { id: 'overview', name: '개요', icon: '📚' },
    { id: 'metallization', name: '금속배선', icon: '🔌' },
    { id: 'damascene', name: 'Damascene', icon: '⚙️' },
    { id: 'eds', name: 'EDS', icon: '🔍' },
    { id: 'packaging', name: '패키징', icon: '📦' },
    { id: 'bonding', name: '본딩', icon: '🔗' },
    { id: 'quiz', name: '평가', icon: '📝' }
  ];

  const metalProperties = {
    aluminum: { resistivity: 2.65, em: 'Low', melting: 660, mtf: 0.3, color: '#C0C0C0', name: 'Al' },
    copper: { resistivity: 1.68, em: 'High', melting: 1085, mtf: 1.0, color: '#B87333', name: 'Cu' },
    tungsten: { resistivity: 5.6, em: 'Very High', melting: 3422, mtf: 3.0, color: '#708090', name: 'W' },
    cobalt: { resistivity: 6.24, em: 'High', melting: 1495, mtf: 1.5, color: '#0047AB', name: 'Co' }
  };

  const edsSteps = [
    { name: 'ET Test', desc: '전기적 특성', detail: 'DC 전압/전류 측정', icon: '⚡' },
    { name: 'WBI', desc: 'Wafer Burn-In', detail: '가속 스트레스', icon: '🔥' },
    { name: 'Hot/Cold', desc: '온도별 테스트', detail: '-40°C ~ 125°C', icon: '🌡️' },
    { name: 'Repair', desc: '불량 칩 수선', detail: '레이저 리페어', icon: '🔧' },
    { name: 'Inking', desc: '불량 표시', detail: '데이터 매핑', icon: '✓' }
  ];

  const packageTypes = {
    dip: { name: 'DIP', pins: '8-64', pitch: '2.54mm', type: 'Through-hole', era: '1970s' },
    qfp: { name: 'QFP', pins: '32-304', pitch: '0.4-1.0mm', type: 'SMD', era: '1980s' },
    bga: { name: 'BGA', pins: '100-2500', pitch: '0.3-1.27mm', type: 'SMD', era: '1990s' },
    csp: { name: 'CSP', pins: '50-500', pitch: '0.4-0.8mm', type: 'WLP', era: '2000s' },
    fcbga: { name: 'FC-BGA', pins: '500-5000+', pitch: '0.15-0.4mm', type: 'Flip Chip', era: '2010s' }
  };

  const quizQuestions = [
    { q: "구리가 알루미늄을 대체한 주요 이유는?", opts: ["낮은 가격", "낮은 저항률", "쉬운 식각", "낮은 녹는점"], ans: 1, exp: "Cu는 Al보다 저항률이 약 37% 낮아 RC 지연을 크게 줄입니다." },
    { q: "Damascene 공정에서 CMP의 역할은?", opts: ["트렌치 식각", "배리어 증착", "과잉 금속 제거", "시드층 형성"], ans: 2, exp: "CMP는 과잉 Cu를 제거하고 표면을 평탄화합니다." },
    { q: "TaN/Ta 배리어층의 주요 역할은?", opts: ["전도성 향상", "Cu 확산 방지", "열전도 향상", "접착력 감소"], ans: 1, exp: "Cu가 Si/SiO₂로 확산되면 소자 특성이 열화되므로 배리어가 필수입니다." },
    { q: "EDS 공정의 주요 목적이 아닌 것은?", opts: ["양품/불량 선별", "수선 가능 칩 양품화", "공정 피드백 (Fab)", "웨이퍼 두께 감소"], ans: 3, exp: "웨이퍼 두께 감소는 Back Grinding 공정입니다." },
    { q: "프로브 카드의 역할은?", opts: ["웨이퍼 절단", "칩-테스터 연결", "열 방출", "패키지 성형"], ans: 1, exp: "프로브 카드는 칩 패드와 테스터를 전기적으로 연결합니다." },
    { q: "Hot/Cold Test의 목적은?", opts: ["속도 향상", "온도 의존 불량 검출", "프로브 수명 연장", "전력 감소"], ans: 1, exp: "특정 온도에서만 나타나는 불량을 검출합니다." },
    { q: "Flip Chip의 장점이 아닌 것은?", opts: ["낮은 인덕턴스", "높은 I/O 밀도", "낮은 초기 비용", "우수한 열방출"], ans: 2, exp: "Flip Chip은 범프 형성 등으로 초기 비용이 높습니다." },
    { q: "2.5D 패키징의 핵심 요소는?", opts: ["금선", "인터포저", "EMC", "리드프레임"], ans: 1, exp: "2.5D는 실리콘 인터포저 위에 칩렛을 배치합니다." },
    { q: "TSV의 역할은?", opts: ["평면 배선", "수직 전기 연결", "열 차단", "EMI 차폐"], ans: 1, exp: "TSV(Through-Silicon Via)는 실리콘을 관통하는 수직 연결입니다." },
    { q: "Electromigration 저항성이 가장 높은 금속은?", opts: ["Al", "Cu", "W", "Au"], ans: 2, exp: "텅스텐(W)은 높은 녹는점으로 EM 저항성이 가장 우수합니다." }
  ];

  const startOverview = () => {
    setIsPlaying(true);
    setCurrentScene(0);
    setCharIndex(0);
    setDisplayedText('');
  };

  const startCMPProcess = () => {
    setDamasceneStep(0);
    setCmpProgress(0);
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setDamasceneStep(step);
      if (step === 3) {
        clearInterval(stepInterval);
        setIsProcessing(true);
      }
    }, 800);
  };

  const runEDSSimulation = () => {
    setEdsStep(-1);
    setEdsAnimating(true);
    let step = 0;
    const interval = setInterval(() => {
      setEdsStep(step);
      step++;
      if (step >= 5) {
        clearInterval(interval);
        setEdsAnimating(false);
      }
    }, 1200);
  };

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
    if (index === quizQuestions[currentQuestion].ans) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setAnswers([]);
  };

  // 계산 함수들
  const calcResistance = () => {
    const rho = metalProperties[metalType].resistivity;
    const length = 1000; // nm
    const area = lineWidth * lineWidth;
    return ((rho * 1e-8 * length * 1e-9) / (area * 1e-18) * 1000).toFixed(2);
  };

  const calcMTF = () => {
    const A = metalProperties[metalType].mtf;
    const Ea = metalType === 'copper' ? 0.9 : 0.7;
    const T = 373; // 100°C in K
    const k = 8.617e-5;
    const j = currentDensity;
    return (A * Math.exp(Ea / (k * T)) / (j * j) * 1e-6).toFixed(1);
  };

  // 개요 탭 렌더링
  const renderOverviewTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-600 via-green-500 to-blue-600 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-1">🔌 금속배선 & 🔍 EDS & 📦 패키징</h2>
        <p className="text-sm opacity-90">반도체 8대 공정: BEOL → 검사 → 후공정</p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700">📖 공정 개요</h3>
          <button
            onClick={startOverview}
            disabled={isPlaying}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              isPlaying ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isPlaying ? '재생 중...' : '▶ 재생'}
          </button>
        </div>

        {isPlaying || displayedText ? (
          <div className="bg-gray-900 rounded-lg p-4 min-h-[150px]">
            <div className="text-amber-400 font-bold mb-2">{overviewScenes[currentScene]?.title}</div>
            <p className="text-gray-200 text-sm leading-relaxed">
              {displayedText}
              <span className="animate-pulse">|</span>
            </p>
            <div className="flex gap-1 mt-4">
              {overviewScenes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${i <= currentScene ? 'bg-amber-500' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
            ▶ 버튼을 눌러 공정 개요를 확인하세요
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-3 rounded-lg border">
        <h3 className="font-bold mb-2 text-sm">📊 공정 흐름</h3>
        <div className="flex flex-wrap gap-1 text-xs justify-center items-center">
          {['FEOL', 'M1~Mn', 'Passiv', 'EDS', 'B/G', 'Dicing', 'Bond', 'Mold', 'Test'].map((s, i) => (
            <Fragment key={i}>
              <span className={`px-2 py-1 rounded font-medium ${
                i < 3 ? 'bg-amber-200 text-amber-800' :
                i === 3 ? 'bg-green-200 text-green-800' :
                'bg-blue-200 text-blue-800'
              }`}>{s}</span>
              {i < 8 && <span className="text-gray-400">→</span>}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: '🔌', name: '금속배선', desc: 'Cu Damascene', color: 'amber' },
          { icon: '🔍', name: 'EDS', desc: '웨이퍼 검사', color: 'green' },
          { icon: '📦', name: '패키징', desc: '2.5D/3D IC', color: 'blue' }
        ].map((item, i) => (
          <div key={i} className={`bg-${item.color}-50 border border-${item.color}-300 p-3 rounded-lg text-center`}
               style={{ backgroundColor: i === 0 ? '#fffbeb' : i === 1 ? '#f0fdf4' : '#eff6ff' }}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-bold text-sm">{item.name}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { v: '10+', l: 'Metal Layers' },
          { v: '<20nm', l: 'Min. Pitch' },
          { v: '>95%', l: 'Yield Target' },
          { v: '5000+', l: 'I/O Count' }
        ].map((m, i) => (
          <div key={i} className="bg-white border p-2 rounded text-center">
            <div className="text-lg font-bold text-blue-600">{m.v}</div>
            <div className="text-xs text-gray-500">{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // 금속배선 탭
  const renderMetallizationTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">⚡ 금속배선 (Metallization)</h2>
        <p className="text-sm opacity-90">BEOL: 트랜지스터 연결 다층 배선 형성</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Object.entries(metalProperties).map(([metal, props]) => (
          <button
            key={metal}
            onClick={() => setMetalType(metal)}
            className={`p-2 rounded-lg border-2 text-center transition ${
              metalType === metal ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: props.color }} />
            <div className="font-bold text-xs">{props.name}</div>
            <div className="text-xs text-gray-500">{props.resistivity}μΩ·cm</div>
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm">Metal Layers: {metalLayers}</span>
          <input
            type="range"
            min="4"
            max="15"
            value={metalLayers}
            onChange={(e) => setMetalLayers(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
        <svg viewBox="0 0 300 160" className="w-full h-36 bg-gray-900 rounded">
          <rect x="20" y="130" width="260" height="25" fill="#4A5568" />
          <text x="150" y="147" textAnchor="middle" fill="#A0AEC0" fontSize="8">Si Substrate</text>
          <rect x="20" y="115" width="260" height="15" fill="#2D3748" />
          <text x="150" y="126" textAnchor="middle" fill="#718096" fontSize="6">Transistors (FEOL)</text>

          {Array.from({ length: Math.min(metalLayers, 10) }).map((_, i) => {
            const layerHeight = Math.min(80 / metalLayers, 12);
            const y = 105 - i * (layerHeight + 2);
            const isGlobal = i >= metalLayers - 2;
            const wireWidth = isGlobal ? 12 : 6 + i * 0.5;

            return (
              <g key={i}>
                <rect x="20" y={y - layerHeight} width="260" height={layerHeight} fill="#1A202C" stroke="#2D3748" strokeWidth="0.5" />
                {[45, 85, 125, 165, 205, 245].map((x, j) => (
                  <rect
                    key={j}
                    x={x - wireWidth / 2}
                    y={y - layerHeight + 2}
                    width={wireWidth}
                    height={layerHeight - 4}
                    fill={metalProperties[metalType].color}
                    opacity={0.9}
                  />
                ))}
                <text x="12" y={y - layerHeight / 2 + 2} fontSize="5" fill="#A0AEC0">M{i + 1}</text>
              </g>
            );
          })}

          <text x="285" y="30" fontSize="6" fill="#68D391" textAnchor="end">← Global (Wide)</text>
          <text x="285" y="100" fontSize="6" fill="#FC8181" textAnchor="end">← Local (Fine)</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <h4 className="font-bold text-sm mb-2 text-amber-700">📊 배선 특성</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>저항률 (ρ)</span>
              <span className="font-bold">{metalProperties[metalType].resistivity} μΩ·cm</span>
            </div>
            <div className="flex justify-between">
              <span>녹는점</span>
              <span className="font-bold">{metalProperties[metalType].melting}°C</span>
            </div>
            <div className="flex justify-between">
              <span>EM 저항성</span>
              <span className="font-bold">{metalProperties[metalType].em}</span>
            </div>
            <div className="flex justify-between">
              <span>Line Resistance</span>
              <span className="font-bold text-amber-600">{calcResistance()} mΩ</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <h4 className="font-bold text-sm mb-2 text-red-700">⚠️ Electromigration</h4>
          <div className="mb-2">
            <div className="text-xs text-gray-500">전류밀도 (MA/cm²)</div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={currentDensity}
              onChange={(e) => setCurrentDensity(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-center font-bold">{currentDensity.toFixed(1)}</div>
          </div>
          <div className="text-xs bg-red-50 p-2 rounded">
            <strong>MTF:</strong> {calcMTF()} years
            <div className="text-gray-500 mt-1">J↑ → MTF↓ (J² 반비례)</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
        <h4 className="font-bold text-sm mb-2">💡 더 생각해보기</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• Cu가 Al을 대체한 이유는? (저항률, RC delay)</li>
          <li>• 왜 Cu는 직접 식각하지 않고 Damascene을 쓸까?</li>
          <li>• Global vs Local 배선의 폭이 다른 이유는?</li>
          <li>• EM을 줄이는 설계 방법은? (폭, 합금, 배리어)</li>
        </ul>
      </div>
    </div>
  );

  // Damascene 탭
  const renderDamasceneTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">⚙️ Damascene 공정</h2>
        <p className="text-sm opacity-90">Cu 배선: 먼저 파고 채우는 Additive 방식</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {['single', 'dual'].map((type) => (
          <button
            key={type}
            onClick={() => setDamasceneType(type)}
            className={`p-3 rounded-lg border-2 transition ${
              damasceneType === type ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <div className="font-bold capitalize">{type} Damascene</div>
            <div className="text-xs text-gray-500">
              {type === 'single' ? 'Via와 Trench 별도 공정' : 'Via + Trench 동시 형성'}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm">Line Width: {lineWidth}nm</span>
          <span className="text-xs px-2 py-1 bg-orange-100 rounded">
            {lineWidth <= 14 ? '3nm' : lineWidth <= 28 ? '7nm' : lineWidth <= 45 ? '14nm' : '28nm+'} node
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="180"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-4 gap-1 mb-2">
        {['TaN', 'Ta', 'TaN/Ta', 'TiN'].map((b) => (
          <button
            key={b}
            onClick={() => setBarrierMaterial(b)}
            className={`p-2 rounded text-xs font-medium transition ${
              barrierMaterial === b ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-3">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-sm">🔄 Dual Damascene 공정</h4>
          <button
            onClick={startCMPProcess}
            disabled={isProcessing}
            className={`px-3 py-1.5 rounded font-bold text-sm ${
              isProcessing ? 'bg-gray-300' : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isProcessing ? '진행중...' : '▶ 시작'}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-1 mb-3">
          {['Via/Trench', 'Barrier', 'Cu Seed', 'ECP Fill', 'CMP'].map((step, i) => (
            <div
              key={i}
              className={`p-2 rounded text-center text-xs transition ${
                i <= damasceneStep ? 'bg-orange-500 text-white' : 'bg-gray-100'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <svg viewBox="0 0 300 100" className="w-full h-24 bg-gray-100 rounded">
          <rect x="0" y="70" width="300" height="30" fill="#4A5568" />
          <rect x="0" y="50" width="300" height="20" fill="#718096" />

          {damasceneStep >= 0 && (
            <>
              <rect x="40" y="20" width="40" height="50" fill="#1A202C" />
              <rect x="120" y="20" width="40" height="50" fill="#1A202C" />
              <rect x="200" y="20" width="40" height="50" fill="#1A202C" />
              <rect x="55" y="50" width="10" height="20" fill="#1A202C" />
              <rect x="135" y="50" width="10" height="20" fill="#1A202C" />
              <rect x="215" y="50" width="10" height="20" fill="#1A202C" />
            </>
          )}

          {damasceneStep >= 1 && (
            <>
              <rect x="40" y="20" width="40" height="50" fill="none" stroke="#6366F1" strokeWidth="3" />
              <rect x="120" y="20" width="40" height="50" fill="none" stroke="#6366F1" strokeWidth="3" />
              <rect x="200" y="20" width="40" height="50" fill="none" stroke="#6366F1" strokeWidth="3" />
            </>
          )}

          {damasceneStep >= 2 && (
            <>
              <rect x="43" y="23" width="34" height="44" fill="none" stroke="#B87333" strokeWidth="2" />
              <rect x="123" y="23" width="34" height="44" fill="none" stroke="#B87333" strokeWidth="2" />
              <rect x="203" y="23" width="34" height="44" fill="none" stroke="#B87333" strokeWidth="2" />
            </>
          )}

          {damasceneStep >= 3 && (
            <>
              <rect x="43" y="23" width="34" height="44" fill="#B87333" />
              <rect x="123" y="23" width="34" height="44" fill="#B87333" />
              <rect x="203" y="23" width="34" height="44" fill="#B87333" />
              {damasceneStep === 3 && (
                <rect x="0" y="0" width="300" height="20" fill="#B87333" opacity="0.5" />
              )}
            </>
          )}

          {damasceneStep >= 4 && (
            <rect x="0" y="0" width="300" height="20" fill="#E2E8F0" />
          )}

          <text x="150" y="90" textAnchor="middle" fill="white" fontSize="8">Lower Metal / ILD</text>
        </svg>

        {isProcessing && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs">CMP Progress:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${cmpProgress}%` }}
                />
              </div>
              <span className="text-xs font-bold">{cmpProgress}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
        <h4 className="font-bold text-sm mb-2">💡 더 생각해보기</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• Cu를 직접 RIE로 식각하지 않는 이유는?</li>
          <li>• Dual이 Single보다 유리한 점은? (공정 단축)</li>
          <li>• 배리어 두께가 너무 두꺼우면 생기는 문제는?</li>
          <li>• CMP 후 Cu dishing/erosion 문제는?</li>
        </ul>
      </div>
    </div>
  );

  // EDS 탭
  const renderEDSTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">🔍 EDS (Electrical Die Sorting)</h2>
        <p className="text-sm opacity-90">웨이퍼 레벨 전기적 검사 및 양품 선별</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <h3 className="font-bold text-sm mb-2 text-green-700">🎯 EDS 목적</h3>
          <ul className="text-xs space-y-1">
            <li className="flex items-center gap-1"><span className="text-green-500">✓</span> 양품/불량 선별</li>
            <li className="flex items-center gap-1"><span className="text-green-500">✓</span> 수선 가능 칩 양품화</li>
            <li className="flex items-center gap-1"><span className="text-green-500">✓</span> 공정 피드백 (Fab)</li>
            <li className="flex items-center gap-1"><span className="text-green-500">✓</span> 후공정 비용 절감</li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <h3 className="font-bold text-sm mb-2 text-green-700">🔌 프로브 카드</h3>
          <div className="space-y-1">
            {[
              { id: 'cantilever', name: 'Cantilever', app: 'LCD Driver' },
              { id: 'vertical', name: 'Vertical', app: 'Logic/SoC' },
              { id: 'mems', name: 'MEMS', app: 'DRAM/CIS' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setProbeType(p.id)}
                className={`w-full p-1.5 rounded text-xs text-left transition ${
                  probeType === p.id ? 'bg-green-100 border-green-500 border' : 'bg-gray-50 border border-transparent'
                }`}
              >
                <span className="font-bold">{p.name}</span>
                <span className="text-gray-500"> - {p.app}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm">📋 EDS 5단계</h3>
          <button
            onClick={runEDSSimulation}
            disabled={edsAnimating}
            className={`px-3 py-1.5 rounded font-bold text-sm ${
              edsAnimating ? 'bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            ▶ 시작
          </button>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {edsSteps.map((step, i) => (
            <div
              key={i}
              className={`p-2 rounded text-center transition ${
                i <= edsStep ? 'bg-green-500 text-white' : 'bg-gray-100'
              }`}
            >
              <div className="text-lg mb-1">{step.icon}</div>
              <div className="text-xs font-bold leading-tight">{step.name}</div>
              <div className="text-xs opacity-75">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h3 className="font-bold text-sm mb-2">📊 수율 시뮬레이터</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>전체 다이</span>
              <span>{totalDies}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={totalDies}
              onChange={(e) => setTotalDies(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>수율</span>
              <span>{yieldRate}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              value={yieldRate}
              onChange={(e) => setYieldRate(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-100 p-2 rounded">
            <div className="text-xl font-bold text-green-700">{Math.floor(totalDies * yieldRate / 100)}</div>
            <div className="text-xs text-green-600">양품 (Good)</div>
          </div>
          <div className="bg-yellow-100 p-2 rounded">
            <div className="text-xl font-bold text-yellow-700">
              {Math.floor(totalDies * (100 - yieldRate) / 100 * 0.3)}
            </div>
            <div className="text-xs text-yellow-600">수선 (Repair)</div>
          </div>
          <div className="bg-red-100 p-2 rounded">
            <div className="text-xl font-bold text-red-700">
              {Math.floor(totalDies * (100 - yieldRate) / 100 * 0.7)}
            </div>
            <div className="text-xs text-red-600">불량 (Fail)</div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h3 className="font-bold text-sm mb-2">🗺️ 웨이퍼 맵</h3>
        <div className="flex gap-4 items-center">
          <svg viewBox="0 0 120 120" className="w-32 h-32">
            <circle cx="60" cy="60" r="55" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
            <line x1="60" y1="110" x2="60" y2="115" stroke="#666" strokeWidth="4" />
            {waferMapData.slice(0, 150).map((status, i) => {
              const cols = 12;
              const row = Math.floor(i / cols);
              const col = i % cols;
              const x = 12 + col * 8;
              const y = 12 + row * 8;
              const dist = Math.sqrt((x + 3 - 60) ** 2 + (y + 3 - 60) ** 2);
              if (dist > 50) return null;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width="6"
                  height="6"
                  rx="1"
                  fill={status === 'good' ? '#22c55e' : status === 'repair' ? '#eab308' : '#ef4444'}
                />
              );
            })}
          </svg>
          <div className="flex-1 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>양품 (Pass)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span>수선가능 (Repairable)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span>불량 (Fail)</span>
            </div>
            <div className="mt-3 p-2 bg-gray-50 rounded text-center">
              <strong>Yield</strong> = Good / Total × 100%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'cold', t: '-40°C', n: 'Cold Test' },
          { id: 'room', t: '25°C', n: 'Room Temp' },
          { id: 'hot', t: '125°C', n: 'Hot Test' }
        ].map((temp) => (
          <button
            key={temp.id}
            onClick={() => setTestTemp(temp.id)}
            className={`p-2 rounded border-2 text-center transition ${
              testTemp === temp.id ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-lg font-bold">{temp.t}</div>
            <div className="text-xs">{temp.n}</div>
          </button>
        ))}
      </div>

      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
        <h4 className="font-bold text-sm mb-2">💡 더 생각해보기</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• EDS를 하지 않으면 어떤 비용 손실이?</li>
          <li>• Hot/Cold Test로 검출하는 불량 유형은?</li>
          <li>• MEMS 프로브가 미세 피치에 유리한 이유는?</li>
          <li>• Wafer Map 데이터의 활용 방법은?</li>
        </ul>
      </div>
    </div>
  );

  // 패키징 탭
  const renderPackagingTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">📦 패키징 (Packaging)</h2>
        <p className="text-sm opacity-90">다이 보호, 외부 전기 연결, 열 방출</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setPackageView('basic')}
          className={`flex-1 py-2 rounded font-bold text-sm transition ${
            packageView === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          📦 기존 패키지
        </button>
        <button
          onClick={() => setPackageView('advanced')}
          className={`flex-1 py-2 rounded font-bold text-sm transition ${
            packageView === 'advanced' ? 'bg-indigo-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          🚀 첨단 패키징
        </button>
      </div>

      {packageView === 'basic' ? (
        <>
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(packageTypes).map(([key, pkg]) => (
              <button
                key={key}
                onClick={() => setPackageType(key)}
                className={`p-2 rounded border-2 text-center transition ${
                  packageType === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-bold text-xs">{pkg.name}</div>
                <div className="text-xs text-gray-400">{pkg.era}</div>
              </button>
            ))}
          </div>

          <div className="bg-white border rounded-lg p-3">
            <h3 className="font-bold text-sm mb-2">{packageTypes[packageType].name} 구조</h3>
            <svg viewBox="0 0 200 120" className="w-full h-28 bg-gray-900 rounded">
              {packageType === 'bga' && (
                <>
                  <rect x="40" y="20" width="120" height="45" fill="#2D3748" rx="3" />
                  <rect x="50" y="25" width="100" height="35" fill="#1A202C" />
                  <text x="100" y="47" textAnchor="middle" fill="#A0AEC0" fontSize="8">Die</text>
                  {Array.from({ length: 4 }).map((_, i) =>
                    Array.from({ length: 8 }).map((_, j) => (
                      <circle key={`${i}-${j}`} cx={52 + j * 14} cy={75 + i * 11} r="4" fill="#B8860B" />
                    ))
                  )}
                  <text x="100" y="118" textAnchor="middle" fill="#718096" fontSize="7">BGA (Ball Grid Array)</text>
                </>
              )}
              {packageType === 'fcbga' && (
                <>
                  <rect x="30" y="15" width="140" height="30" fill="#1A202C" rx="2" />
                  <text x="100" y="35" textAnchor="middle" fill="#B87333" fontSize="7">Flip Chip Die</text>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <circle key={i} cx={45 + i * 15} cy="48" r="2" fill="#B87333" />
                  ))}
                  <rect x="30" y="50" width="140" height="25" fill="#2d5a27" rx="2" />
                  <text x="100" y="67" textAnchor="middle" fill="#A0AEC0" fontSize="6">Substrate</text>
                  {Array.from({ length: 3 }).map((_, i) =>
                    Array.from({ length: 8 }).map((_, j) => (
                      <circle key={`${i}-${j}`} cx={45 + j * 15} cy={85 + i * 11} r="4" fill="#B8860B" />
                    ))
                  )}
                </>
              )}
              {packageType === 'dip' && (
                <>
                  <rect x="50" y="35" width="100" height="50" fill="#1A202C" rx="5" />
                  <text x="100" y="65" textAnchor="middle" fill="#A0AEC0" fontSize="8">DIP</text>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Fragment key={i}>
                      <rect x={58 + i * 12} y="85" width="3" height="20" fill="#B8860B" />
                      <rect x={58 + i * 12} y="15" width="3" height="20" fill="#B8860B" />
                    </Fragment>
                  ))}
                </>
              )}
              {packageType === 'qfp' && (
                <>
                  <rect x="55" y="30" width="90" height="60" fill="#1A202C" rx="3" />
                  <text x="100" y="65" textAnchor="middle" fill="#A0AEC0" fontSize="8">QFP</text>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Fragment key={i}>
                      <rect x={62 + i * 9} y="90" width="2" height="15" fill="#B8860B" />
                      <rect x={62 + i * 9} y="15" width="2" height="15" fill="#B8860B" />
                      <rect x="40" y={37 + i * 6} width="15" height="2" fill="#B8860B" />
                      <rect x="145" y={37 + i * 6} width="15" height="2" fill="#B8860B" />
                    </Fragment>
                  ))}
                </>
              )}
              {packageType === 'csp' && (
                <>
                  <rect x="60" y="25" width="80" height="45" fill="#1A202C" rx="2" />
                  <text x="100" y="52" textAnchor="middle" fill="#A0AEC0" fontSize="8">CSP</text>
                  {Array.from({ length: 3 }).map((_, i) =>
                    Array.from({ length: 6 }).map((_, j) => (
                      <circle key={`${i}-${j}`} cx={70 + j * 12} cy={80 + i * 12} r="4" fill="#B8860B" />
                    ))
                  )}
                </>
              )}
            </svg>
            <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
              <div className="bg-gray-100 p-1.5 rounded text-center">
                <div className="text-gray-500">핀 수</div>
                <div className="font-bold">{packageTypes[packageType].pins}</div>
              </div>
              <div className="bg-gray-100 p-1.5 rounded text-center">
                <div className="text-gray-500">피치</div>
                <div className="font-bold">{packageTypes[packageType].pitch}</div>
              </div>
              <div className="bg-gray-100 p-1.5 rounded text-center">
                <div className="text-gray-500">타입</div>
                <div className="font-bold">{packageTypes[packageType].type}</div>
              </div>
              <div className="bg-gray-100 p-1.5 rounded text-center">
                <div className="text-gray-500">시대</div>
                <div className="font-bold">{packageTypes[packageType].era}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '📐', name: '2.5D', desc: '인터포저', tech: 'CoWoS/EMIB' },
              { icon: '🏗️', name: '3D IC', desc: '수직 적층', tech: 'HBM/Foveros' },
              { icon: '🌐', name: 'FOWLP', desc: 'RDL 확장', tech: 'InFO/eWLB' }
            ].map((p, i) => (
              <div key={i} className="bg-white border-2 border-indigo-200 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="font-bold text-sm">{p.name}</div>
                <div className="text-xs text-gray-500">{p.desc}</div>
                <div className="text-xs text-indigo-600 font-medium mt-1">{p.tech}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-lg p-3">
            <h3 className="font-bold text-sm mb-2">2.5D vs 3D 비교</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xs font-bold text-indigo-700 mb-1">2.5D (Side-by-Side)</div>
                <svg viewBox="0 0 120 70" className="w-full h-16 bg-gray-900 rounded">
                  <rect x="10" y="50" width="100" height="15" fill="#2d5a27" />
                  <text x="60" y="61" textAnchor="middle" fill="#A0AEC0" fontSize="5">Substrate</text>
                  <rect x="15" y="30" width="90" height="18" fill="#6366F1" />
                  <text x="60" y="42" textAnchor="middle" fill="white" fontSize="5">Si Interposer</text>
                  <rect x="20" y="10" width="25" height="18" fill="#1A202C" />
                  <rect x="50" y="12" width="20" height="16" fill="#374151" />
                  <rect x="75" y="12" width="25" height="16" fill="#374151" />
                  <text x="32" y="22" textAnchor="middle" fill="#F59E0B" fontSize="4">CPU</text>
                  <text x="60" y="22" textAnchor="middle" fill="#A0AEC0" fontSize="4">HBM</text>
                  <text x="87" y="22" textAnchor="middle" fill="#A0AEC0" fontSize="4">HBM</text>
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-purple-700 mb-1">3D (Stacked)</div>
                <svg viewBox="0 0 120 70" className="w-full h-16 bg-gray-900 rounded">
                  <rect x="35" y="50" width="50" height="15" fill="#1A202C" />
                  <rect x="35" y="35" width="50" height="13" fill="#374151" />
                  <rect x="35" y="22" width="50" height="11" fill="#4B5563" />
                  <rect x="35" y="10" width="50" height="10" fill="#6B7280" />
                  {[45, 55, 65, 75].map((x, i) => (
                    <rect key={i} x={x} y="10" width="2" height="55" fill="#B8860B" />
                  ))}
                  <text x="60" y="58" textAnchor="middle" fill="#A0AEC0" fontSize="4">Base Die</text>
                  <text x="85" y="35" fill="#10B981" fontSize="4">TSV</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { i: '🕳️', n: 'TSV', d: '수직 Via' },
              { i: '🔀', n: 'RDL', d: '재배선층' },
              { i: '🤝', n: 'Hybrid', d: 'Cu-Cu 본딩' },
              { i: '🧱', n: 'Chiplet', d: '모듈화' }
            ].map((t, i) => (
              <div key={i} className="bg-indigo-50 p-2 rounded text-center border border-indigo-200">
                <div className="text-xl">{t.i}</div>
                <div className="font-bold text-xs">{t.n}</div>
                <div className="text-xs text-gray-500">{t.d}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h4 className="font-bold text-sm mb-2">💡 더 생각해보기</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• BGA가 QFP를 대체한 이유는? (I/O 밀도, 열방출)</li>
          <li>• 2.5D에서 인터포저의 역할은?</li>
          <li>• HBM이 3D 적층을 사용하는 이유는?</li>
          <li>• Chiplet 아키텍처의 장점은?</li>
        </ul>
      </div>
    </div>
  );

  // 본딩 탭
  const renderBondingTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">🔗 본딩 기술 (Bonding)</h2>
        <p className="text-sm opacity-90">다이-패키지 전기적 연결 형성</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setBondingMethod('wire')}
          className={`p-4 rounded-lg border-2 text-center transition ${
            bondingMethod === 'wire' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="text-3xl mb-1">〰️</div>
          <div className="font-bold">Wire Bonding</div>
          <div className="text-xs text-gray-500">Au/Cu/Al Wire</div>
        </button>
        <button
          onClick={() => setBondingMethod('flip')}
          className={`p-4 rounded-lg border-2 text-center transition ${
            bondingMethod === 'flip' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="text-3xl mb-1">🔄</div>
          <div className="font-bold">Flip Chip</div>
          <div className="text-xs text-gray-500">Solder/Cu Bump</div>
        </button>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h3 className="font-bold text-sm mb-2">
          {bondingMethod === 'wire' ? '〰️ Wire Bonding' : '🔄 Flip Chip'} 구조
        </h3>
        <svg viewBox="0 0 240 110" className="w-full h-24 bg-gray-900 rounded">
          {bondingMethod === 'wire' ? (
            <>
              <rect x="20" y="70" width="200" height="30" fill="#2d5a27" />
              <text x="120" y="90" textAnchor="middle" fill="#A0AEC0" fontSize="7">Substrate (PCB)</text>
              <rect x="70" y="35" width="100" height="35" fill="#4A5568" rx="2" />
              <rect x="75" y="38" width="90" height="29" fill="#1A202C" />
              <text x="120" y="57" textAnchor="middle" fill="#A0AEC0" fontSize="7">Die (Face Up)</text>

              {[85, 105, 125, 145, 155].map((x, i) => (
                <rect key={i} x={x} y="63" width="5" height="4" fill="#FFD700" />
              ))}

              {[30, 55, 185, 210].map((x, i) => (
                <rect key={i} x={x} y="70" width="8" height="4" fill="#FFD700" />
              ))}

              <path d="M87,63 Q55,35 34,70" stroke="#FFD700" strokeWidth="1.5" fill="none" />
              <path d="M107,63 Q80,40 59,70" stroke="#FFD700" strokeWidth="1.5" fill="none" />
              <path d="M147,63 Q165,40 189,70" stroke="#FFD700" strokeWidth="1.5" fill="none" />
              <path d="M157,63 Q185,35 214,70" stroke="#FFD700" strokeWidth="1.5" fill="none" />

              <text x="120" y="20" textAnchor="middle" fill="#F59E0B" fontSize="6">Ball-Wedge Bonding</text>
            </>
          ) : (
            <>
              <rect x="20" y="60" width="200" height="40" fill="#2d5a27" />
              <text x="120" y="85" textAnchor="middle" fill="#A0AEC0" fontSize="7">Substrate</text>

              <rect x="50" y="15" width="140" height="35" fill="#4A5568" rx="2" />
              <rect x="55" y="18" width="130" height="29" fill="#1A202C" />
              <text x="120" y="37" textAnchor="middle" fill="#A0AEC0" fontSize="7">Die (Face Down)</text>

              {[70, 95, 120, 145, 170].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="50" r="5" fill="#B8860B" />
                  <circle cx={x} cy="60" r="5" fill="#B8860B" />
                  <rect x={x - 3} y="50" width="6" height="10" fill="#B8860B" />
                </g>
              ))}

              <rect x="50" y="50" width="140" height="10" fill="#4299E1" opacity="0.4" />
              <text x="120" y="58" textAnchor="middle" fill="#2B6CB0" fontSize="5">Underfill (CTE 매칭)</text>

              <text x="120" y="105" textAnchor="middle" fill="#B87333" fontSize="6">C4 Solder Bumps</text>
            </>
          )}
        </svg>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-purple-700">📊 Wire vs Flip Chip 비교</h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left p-1.5">특성</th>
              <th className="p-1.5 text-center">Wire Bonding</th>
              <th className="p-1.5 text-center">Flip Chip</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-1.5">I/O 밀도</td>
              <td className="p-1.5 text-center">낮음 (주변부)</td>
              <td className="p-1.5 text-center text-green-600 font-bold">높음 (Area)</td>
            </tr>
            <tr className="border-b">
              <td className="p-1.5">인덕턴스</td>
              <td className="p-1.5 text-center">높음 (2-5nH)</td>
              <td className="p-1.5 text-center text-green-600 font-bold">낮음 (0.1nH)</td>
            </tr>
            <tr className="border-b">
              <td className="p-1.5">열방출</td>
              <td className="p-1.5 text-center">기판 통해</td>
              <td className="p-1.5 text-center text-green-600 font-bold">직접 (히트싱크)</td>
            </tr>
            <tr className="border-b">
              <td className="p-1.5">비용</td>
              <td className="p-1.5 text-center text-green-600 font-bold">낮음</td>
              <td className="p-1.5 text-center">높음</td>
            </tr>
            <tr>
              <td className="p-1.5">용도</td>
              <td className="p-1.5 text-center">Memory, LED</td>
              <td className="p-1.5 text-center">CPU, GPU, HPC</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">I/O Count</div>
          <input
            type="range"
            min="64"
            max="2048"
            step="64"
            value={wireCount}
            onChange={(e) => setWireCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-xl font-bold text-purple-700">{wireCount}</div>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Pitch (μm)</div>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={pitchSize}
            onChange={(e) => setPitchSize(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-xl font-bold text-pink-700">{pitchSize}</div>
        </div>
      </div>

      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
        <h4 className="font-bold text-sm mb-2">💡 더 생각해보기</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• Wire Bonding에서 Au→Cu로 전환한 이유는?</li>
          <li>• Flip Chip에서 Underfill의 역할은?</li>
          <li>• 고주파 소자에 Flip Chip이 필수인 이유는?</li>
          <li>• Hybrid Bonding (Cu-Cu)의 장점은?</li>
        </ul>
      </div>
    </div>
  );

  // 퀴즈 탭
  const renderQuizTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">📝 평가 퀴즈</h2>
        <p className="text-sm opacity-90">10문제 | 금속배선, EDS, 패키징</p>
      </div>

      {!quizCompleted ? (
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">문제 {currentQuestion + 1} / 10</span>
            <span className="text-sm font-bold text-emerald-600">점수: {score} / {currentQuestion + (showResult ? 1 : 0)}</span>
          </div>

          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestion + 1) * 10}%` }}
            />
          </div>

          <h3 className="font-bold mb-3 text-gray-800">
            Q{currentQuestion + 1}. {quizQuestions[currentQuestion].q}
          </h3>

          <div className="space-y-2">
            {quizQuestions[currentQuestion].opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswerSelect(i)}
                disabled={showResult}
                className={`w-full p-3 rounded-lg border-2 text-left text-sm transition ${
                  showResult
                    ? i === quizQuestions[currentQuestion].ans
                      ? 'border-emerald-500 bg-emerald-50'
                      : i === selectedAnswer
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
                {showResult && i === quizQuestions[currentQuestion].ans && (
                  <span className="ml-2 text-emerald-600">✓ 정답</span>
                )}
              </button>
            ))}
          </div>

          {showResult && (
            <>
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                selectedAnswer === quizQuestions[currentQuestion].ans
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <strong>해설:</strong> {quizQuestions[currentQuestion].exp}
              </div>
              <button
                onClick={nextQuestion}
                className="mt-3 w-full py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition"
              >
                {currentQuestion < 9 ? '다음 문제 →' : '결과 보기'}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">
            {score >= 9 ? '🏆' : score >= 7 ? '🎉' : score >= 5 ? '👍' : '📚'}
          </div>
          <div className="text-4xl font-bold text-emerald-600 mb-2">{score} / 10</div>
          <div className="text-lg text-gray-600 mb-4">
            {score >= 9 ? '훌륭합니다! 완벽에 가깝습니다!' :
             score >= 7 ? '잘하셨습니다! 조금만 더 복습하세요.' :
             score >= 5 ? '보통입니다. 복습이 필요합니다.' :
             '더 열심히 공부하세요!'}
          </div>

          <div className="grid grid-cols-5 gap-1 mb-4">
            {answers.map((ans, i) => (
              <div
                key={i}
                className={`p-2 rounded text-xs font-bold ${
                  ans === quizQuestions[i].ans ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                Q{i + 1}: {ans === quizQuestions[i].ans ? '○' : '✕'}
              </div>
            ))}
          </div>

          <button
            onClick={resetQuiz}
            className="px-8 py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition"
          >
            🔄 다시 도전
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'metallization': return renderMetallizationTab();
      case 'damascene': return renderDamasceneTab();
      case 'eds': return renderEDSTab();
      case 'packaging': return renderPackagingTab();
      case 'bonding': return renderBondingTab();
      case 'quiz': return renderQuizTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <div className="bg-gradient-to-r from-amber-600 via-green-600 to-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">🔌 금속배선 & 🔍 EDS & 📦 패키징 시뮬레이터</h1>
        <p className="text-sm text-center opacity-90 mt-1">반도체 BEOL → 검사 → 후공정 통합 교육</p>
      </div>

      <div className="flex flex-wrap gap-1 p-2 bg-white shadow">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 via-green-500 to-blue-500 text-white shadow'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="p-4">
        {renderContent()}
      </div>

      <div className="text-center text-xs text-gray-400 py-4">
        © 반도체 공정 교육 시뮬레이터 v1.0
      </div>
    </div>
  );
};

export default MetallizationEDSPackagingSimulator;
