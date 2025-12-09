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

  // 개요 씬 데이터 (더 자세하고 쉬운 설명)
  const overviewScenes = [
    {
      title: "🔌 BEOL이란? (Back-End-Of-Line)",
      content: "반도체 제조는 크게 두 단계로 나뉩니다. 먼저 FEOL(Front-End)에서 트랜지스터라는 '스위치'를 만들고, 그 다음 BEOL(Back-End)에서 이 스위치들을 '전선'으로 연결합니다.\n\n비유하자면, FEOL은 수십억 개의 전구를 만드는 것이고, BEOL은 이 전구들을 전선으로 연결해서 실제로 불이 켜지게 만드는 작업입니다. 현대 반도체는 10~15층의 금속 배선을 사용하는데, 마치 고층 아파트의 각 층마다 복잡한 배관과 전선이 깔려있는 것과 같습니다.",
      highlight: "BEOL = 트랜지스터 연결 배선 공정"
    },
    {
      title: "🏭 왜 구리(Cu)를 쓸까? - 알루미늄의 한계",
      content: "1990년대까지는 알루미늄(Al)으로 배선을 만들었습니다. 하지만 배선이 점점 가늘어지면서 심각한 문제가 생겼습니다.\n\n첫째, '힐록(Hillock)' 현상 - 알루미늄이 열을 받으면 표면에 작은 돌기가 솟아올라 위층 배선과 합선됩니다. 마치 뜨거운 아스팔트가 부풀어 오르는 것처럼요.\n\n둘째, '일렉트로마이그레이션(EM)' - 전류가 흐르면 알루미늄 원자들이 밀려나며 배선이 끊어집니다. 강물에 모래가 쓸려가는 것과 비슷합니다.\n\n이를 해결하려고 Al에 Si나 Cu를 소량 섞은 합금(Al-Si, Al-Cu)을 썼지만, 결국 저항이 37% 낮은 구리로 완전히 교체되었습니다.",
      highlight: "Cu는 Al보다 저항 37% ↓, EM 저항 10배 ↑"
    },
    {
      title: "⚙️ Damascene 공정이란?",
      content: "구리는 좋은 재료지만, 큰 단점이 있습니다. 플라즈마로 깎아내기(식각)가 매우 어렵습니다! 그래서 완전히 새로운 방식을 개발했는데, 이것이 바로 'Damascene(다마신)' 공정입니다.\n\n다마신의 원리는 간단합니다: '먼저 홈을 파고, 나중에 금속을 채운다'\n\n마치 도장 만들기와 비슷합니다. 나무에 글자를 새기고(홈 파기), 잉크를 바른 후(금속 채우기), 표면을 닦아내면(CMP 연마) 글자만 남습니다.\n\n이 방식 덕분에 구리를 직접 깎을 필요가 없어졌고, 현재 모든 첨단 반도체가 이 공정을 사용합니다.",
      highlight: "Damascene = 홈 파기 → 금속 채우기 → 연마"
    },
    {
      title: "🔍 EDS란? (Electrical Die Sorting)",
      content: "웨이퍼 한 장에는 수백~수천 개의 칩이 있습니다. 이 중에서 불량품을 어떻게 찾을까요? 바로 EDS 검사입니다!\n\nEDS는 '프로브 카드'라는 특수 장치를 사용합니다. 수백~수천 개의 미세한 바늘(프로브)이 칩의 전극 패드에 동시에 접촉하여, 전기 신호를 보내고 응답을 확인합니다.\n\n마치 의사가 청진기로 심장 소리를 듣는 것처럼, 프로브는 칩의 '건강 상태'를 진단합니다. 양품은 통과, 수선 가능한 것은 레이저로 치료(퓨즈 끊기), 완전 불량은 폐기 표시를 합니다.\n\n이 과정이 중요한 이유는? 불량 칩을 미리 걸러내지 않으면, 비싼 패키징 비용이 낭비되기 때문입니다!",
      highlight: "EDS = 칩의 건강검진, 불량 사전 선별"
    },
    {
      title: "📦 패키징이란?",
      content: "웨이퍼에서 잘라낸 칩(다이)은 매우 연약합니다. 먼지 한 톨, 수분 한 방울에도 망가질 수 있죠. 패키징은 이 칩을 보호하고, 외부 회로와 연결하는 '옷 입히기' 과정입니다.\n\n가장 중요한 단계는 '본딩(Bonding)'입니다. 칩의 전극을 기판에 연결하는 방법은 두 가지가 있습니다:\n\n1) Wire Bonding: 금선이나 구리선으로 칩과 기판을 연결 (재봉틀처럼)\n2) Flip Chip: 칩을 뒤집어서 범프(돌기)로 직접 연결 (도장 찍듯이)\n\nFlip Chip이 더 빠르고 신호 품질이 좋아서, 고성능 CPU/GPU에 사용됩니다.",
      highlight: "패키징 = 보호 + 외부 연결 + 열 방출"
    },
    {
      title: "🚀 미래: 2.5D/3D 패키징",
      content: "트랜지스터를 더 작게 만드는 것도 한계에 다다르고 있습니다. 그래서 새로운 방향이 등장했는데, 바로 '쌓기(적층)' 기술입니다!\n\n2.5D 패키징: 여러 칩을 '인터포저'라는 중간 기판 위에 나란히 배치합니다. 마치 도마 위에 여러 재료를 올려놓은 것처럼요. HBM 메모리가 대표적입니다.\n\n3D 패키징: 칩을 아예 위아래로 쌓습니다! 'TSV(Through-Silicon Via)'라는 실리콘을 관통하는 구멍으로 층간 연결합니다. 고층 빌딩의 엘리베이터처럼요.\n\n이 기술 덕분에 작은 면적에 더 많은 기능을 넣을 수 있게 되었습니다.",
      highlight: "2.5D = 나란히 배치, 3D = 위아래 적층"
    }
  ];

  // 타이핑 애니메이션 (자동 진행 없음)
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
      }
      // 타이핑 완료 시 자동 진행 없음 - 사용자가 버튼으로 넘김
    }
  }, [isPlaying, currentScene, charIndex]);

  // 다음 스텝으로 이동
  const nextScene = () => {
    if (currentScene < overviewScenes.length - 1) {
      setCurrentScene(currentScene + 1);
      setCharIndex(0);
      setDisplayedText('');
    }
  };

  // 이전 스텝으로 이동
  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      setCharIndex(0);
      setDisplayedText('');
    }
  };

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
    aluminum: {
      resistivity: 2.65, em: 'Low', melting: 660, mtf: 0.3, color: '#C0C0C0', name: 'Al',
      desc: '1990년대까지 주력 배선 재료. 힐록/EM 문제로 Cu로 교체됨',
      usage: '현재는 최상위 패드층, 본딩 와이어에만 제한적 사용',
      history: 'Al-Si(1%), Al-Cu(0.5%) 합금으로 EM 개선 시도했으나 한계'
    },
    copper: {
      resistivity: 1.68, em: 'High', melting: 1085, mtf: 1.0, color: '#B87333', name: 'Cu',
      desc: '1997년 IBM이 처음 도입. 현재 모든 첨단 반도체의 표준',
      usage: 'M1~최상위층 모든 배선에 사용 (Damascene 공정)',
      history: 'Al 대비 저항 37%↓, EM 수명 10배↑, RC지연 대폭 감소'
    },
    tungsten: {
      resistivity: 5.6, em: 'Very High', melting: 3422, mtf: 3.0, color: '#708090', name: 'W',
      desc: '녹는점 최고! EM에 매우 강함. 저항은 높지만 특수 용도에 필수',
      usage: 'Contact/Via 플러그 (트랜지스터↔M1 연결), 게이트 전극',
      history: 'CVD로 증착. 좁은 홀 채우기에 탁월 (우수한 Step Coverage)'
    },
    cobalt: {
      resistivity: 6.24, em: 'High', melting: 1495, mtf: 1.5, color: '#0047AB', name: 'Co',
      desc: '차세대 미세 배선용. 7nm 이하에서 Cu의 한계 극복 기대',
      usage: 'M0/M1 초미세 배선, Cu 캡핑층(EM 방지), Contact 라이너',
      history: '2017년 인텔 10nm부터 도입. Cu 배리어 두께 줄여 저항 감소'
    }
  };

  // EDS 5단계 - 더 자세한 설명 포함
  const edsSteps = [
    {
      name: 'ET Test',
      desc: '전기적 특성',
      detail: 'DC 전압/전류 측정',
      icon: '⚡',
      fullDesc: '기본 전기 테스트(Electrical Test). 트랜지스터 Vth, 누설전류, 저항, 단락/단선 등을 측정합니다. 가장 기본적인 양품/불량 판정 단계입니다.'
    },
    {
      name: 'WBI',
      desc: 'Wafer Burn-In',
      detail: '가속 스트레스',
      icon: '🔥',
      fullDesc: '고온(85~125°C) + 고전압 스트레스를 가해 초기 불량(Infant Mortality)을 걸러냅니다. 배송 후 바로 고장나는 제품을 미리 제거하는 "욕탕" 테스트입니다.'
    },
    {
      name: 'Hot/Cold',
      desc: '온도별 테스트',
      detail: '-40°C ~ 125°C',
      icon: '🌡️',
      fullDesc: '극한 온도에서 동작 확인. 자동차(-40°C 겨울)부터 서버(125°C 발열)까지 다양한 환경을 시뮬레이션합니다. 온도에 따라 특성이 변하는 칩을 걸러냅니다.'
    },
    {
      name: 'Repair',
      desc: '불량 칩 수선',
      detail: '레이저 리페어',
      icon: '🔧',
      fullDesc: '메모리 칩의 불량 셀을 예비 셀(Redundancy)로 교체합니다. 레이저로 퓨즈를 끊어 회로를 변경합니다. 수율을 5~10% 높이는 핵심 기술입니다.'
    },
    {
      name: 'Inking',
      desc: '불량 표시',
      detail: '데이터 매핑',
      icon: '✓',
      fullDesc: '최종 불량 칩에 잉크 점을 찍거나, 웨이퍼 맵(Wafer Map)에 디지털 기록합니다. 후공정에서 불량 칩을 건너뛰어 비용을 절감합니다.'
    }
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

  // Damascene 수동 네비게이션
  const startDamasceneProcess = () => {
    setDamasceneStep(0);
    setCmpProgress(0);
    setIsProcessing(false);
  };

  const nextDamasceneStep = () => {
    if (damasceneStep < 4) {
      setDamasceneStep(damasceneStep + 1);
    }
  };

  const prevDamasceneStep = () => {
    if (damasceneStep > 0) {
      setDamasceneStep(damasceneStep - 1);
    }
  };

  const resetDamascene = () => {
    setDamasceneStep(-1);
    setCmpProgress(0);
    setIsProcessing(false);
  };

  // EDS 수동 네비게이션
  const startEDSProcess = () => {
    setEdsStep(0);
    setEdsAnimating(false);
  };

  const nextEDSStep = () => {
    if (edsStep < 4) {
      setEdsStep(edsStep + 1);
    }
  };

  const prevEDSStep = () => {
    if (edsStep > 0) {
      setEdsStep(edsStep - 1);
    }
  };

  const resetEDS = () => {
    setEdsStep(-1);
    setEdsAnimating(false);
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
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-600 via-green-500 to-blue-600 rounded-xl shadow-2xl p-8 text-white min-h-[500px] flex flex-col">
        {!isPlaying && !displayedText ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="text-6xl mb-4">🔌🔍📦</div>
            <h2 className="text-3xl font-bold mb-4">
              금속배선 & EDS & 패키징 시뮬레이터
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
              반도체 BEOL 공정부터 검사, 후공정까지<br/>
              <span className="text-yellow-300 font-bold">단계별 가이드</span>로 학습하세요!
            </p>
            <button
              onClick={startOverview}
              className="flex items-center gap-3 px-8 py-4 bg-white text-amber-600 rounded-full hover:bg-yellow-50 transition-all text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 mt-8"
            >
              <span className="text-2xl">▶</span>
              가이드 시작하기
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">
                  Step {currentScene + 1} / {overviewScenes.length}
                </span>
                <span className="text-sm text-blue-200">
                  {Math.round(((currentScene + 1) / overviewScenes.length) * 100)}% 완료
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentScene + 1) / overviewScenes.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">
                {overviewScenes[currentScene]?.title}
              </h3>
              <div className="text-lg leading-relaxed whitespace-pre-line font-medium">
                {displayedText}
                {isPlaying && <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse" />}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={prevScene}
                disabled={currentScene === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentScene === 0
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-white/30 text-white hover:bg-white/40'
                }`}
              >
                ← 이전
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setDisplayedText('');
                  setCurrentScene(0);
                  setCharIndex(0);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm"
              >
                ↺ 처음으로
              </button>

              {currentScene < overviewScenes.length - 1 ? (
                <button
                  onClick={nextScene}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-amber-600 rounded-lg hover:bg-yellow-50 transition-all font-semibold shadow-lg"
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('metallization')}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-300 transition-all font-semibold shadow-lg"
                >
                  시뮬레이션 시작 🔥
                </button>
              )}
            </div>
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

      {/* 금속 선택 버튼 */}
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

      {/* 선택된 금속 상세 설명 */}
      <div className="bg-white border-2 border-amber-300 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
               style={{ backgroundColor: metalProperties[metalType].color }}>
            {metalProperties[metalType].name}
          </div>
          <div>
            <h3 className="font-bold text-lg">{metalType === 'aluminum' ? '알루미늄 (Aluminum)' :
                                               metalType === 'copper' ? '구리 (Copper)' :
                                               metalType === 'tungsten' ? '텅스텐 (Tungsten)' : '코발트 (Cobalt)'}</h3>
            <p className="text-sm text-gray-600">{metalProperties[metalType].desc}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-bold text-amber-700">📍 현재 용도:</span>
            <p className="text-gray-700 mt-1">{metalProperties[metalType].usage}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-bold text-blue-700">📜 역사/특징:</span>
            <p className="text-gray-700 mt-1">{metalProperties[metalType].history}</p>
          </div>
        </div>
      </div>

      {/* 배선 시각화 */}
      <div className="bg-white border rounded-lg p-3">
        <div className="p-3 bg-white rounded-lg border-2 border-red-200 shadow-sm mb-3">
          <label className="block text-sm font-medium mb-2 text-red-800">
            Metal Layers: {metalLayers}층
          </label>
          <input
            type="range"
            min="4"
            max="15"
            value={metalLayers}
            onChange={(e) => setMetalLayers(parseInt(e.target.value))}
            className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-red"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4층</span>
            <span>15층</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-2">※ 최신 첨단 공정은 10~15층의 금속 배선을 사용합니다. 아래층(M1)은 좁고, 위로 갈수록 넓어집니다.</p>
        <svg viewBox="0 0 300 160" className="w-full h-72 bg-gray-900 rounded">
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

          <text x="285" y="30" fontSize="6" fill="#68D391" textAnchor="end">← Global (Wide, 전원/GND)</text>
          <text x="285" y="100" fontSize="6" fill="#FC8181" textAnchor="end">← Local (Fine, 신호선)</text>
        </svg>
        <p className="text-xs text-gray-500 mt-2">💡 <strong>왜 층마다 폭이 다를까?</strong> 아래층은 트랜지스터 직접 연결(신호), 위층은 전원/접지 공급(큰 전류)에 사용되므로 폭이 더 넓습니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 배선 특성 */}
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

        {/* Electromigration + MTF 설명 */}
        <div className="bg-white border rounded-lg p-3">
          <h4 className="font-bold text-sm mb-2 text-red-700">⚠️ Electromigration (EM)</h4>
          <div className="p-3 bg-white rounded-lg border-2 border-blue-200 shadow-sm mb-2">
            <label className="block text-sm font-medium mb-2 text-blue-800">
              전류밀도: {currentDensity.toFixed(1)} MA/cm²
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={currentDensity}
              onChange={(e) => setCurrentDensity(parseFloat(e.target.value))}
              className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5</span>
              <span>3.0</span>
            </div>
          </div>
          <div className="text-xs bg-red-50 p-2 rounded border border-red-200">
            <strong>MTF:</strong> {calcMTF()} years
            <div className="text-gray-500 mt-1">※ MTF(Mean Time to Failure) = 배선이 끊어지기까지 평균 시간</div>
            <div className="text-gray-500">전류↑ → 금속원자 이동↑ → 수명↓ (J² 반비례)</div>
          </div>
        </div>
      </div>

      {/* EM과 힐록 설명 */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-yellow-800">⚡ 왜 알루미늄(Al)을 안 쓰게 되었나?</h4>
        <div className="text-xs text-gray-700 space-y-2">
          <p><strong>1. 힐록(Hillock) 현상:</strong> Al이 열을 받으면 표면에 작은 돌기(언덕)가 솟아올라 위층 배선과 합선됩니다. 뜨거운 아스팔트가 부풀어 오르는 것처럼요.</p>
          <p><strong>2. 일렉트로마이그레이션(EM):</strong> 전류가 흐르면 전자가 Al 원자를 밀어내어 빈 공간(void)이 생기고 결국 단선됩니다. 강물에 모래가 쓸려가는 것과 비슷합니다.</p>
          <p><strong>3. 해결 시도:</strong> Al에 Si(1%)나 Cu(0.5%)를 섞은 합금(Al-Si, Al-Cu)으로 개선했지만, 근본적 한계로 결국 Cu로 완전 교체되었습니다.</p>
        </div>
      </div>

      {/* W, Co 설명 */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-blue-800">🔧 텅스텐(W)과 코발트(Co)는 어디에 쓰일까?</h4>
        <div className="text-xs text-gray-700 space-y-2">
          <p><strong>텅스텐(W):</strong> 저항이 높아 배선에는 부적합하지만, 녹는점이 가장 높아(3422°C) EM에 매우 강합니다. 주로 <strong>Contact/Via 플러그</strong>(트랜지스터↔M1 연결)와 <strong>게이트 전극</strong>에 사용됩니다. CVD로 증착하여 좁은 홀도 잘 채웁니다.</p>
          <p><strong>코발트(Co):</strong> 7nm 이하 미세 공정에서 Cu의 한계를 극복하기 위해 도입되었습니다. M0/M1 <strong>초미세 배선</strong>, Cu 위에 덮는 <strong>캡핑층(EM 방지)</strong>, Contact <strong>라이너</strong> 등에 사용됩니다. 2017년 인텔 10nm부터 적용되기 시작했습니다.</p>
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
        <h4 className="font-bold text-sm mb-2">💡 핵심 정리</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• <strong>Cu(구리)</strong>: 주력 배선 재료. 낮은 저항, Damascene 공정 사용</li>
          <li>• <strong>Al(알루미늄)</strong>: 과거 주력. 현재는 패드/본딩 와이어에만 사용</li>
          <li>• <strong>W(텅스텐)</strong>: Contact/Via 플러그, 게이트 전극</li>
          <li>• <strong>Co(코발트)</strong>: 7nm 이하 미세 배선, Cu 캡핑층</li>
        </ul>
      </div>
    </div>
  );

  // Damascene 공정 단계별 설명
  const damasceneStepDetails = [
    {
      name: 'Via/Trench 형성',
      short: 'Via/Trench',
      desc: '절연체(ILD)에 홈(Trench)과 구멍(Via)을 식각으로 만듭니다.',
      detail: '포토리소그라피로 패턴을 형성하고, RIE(Reactive Ion Etching)로 Low-k 절연막을 식각합니다. Dual Damascene에서는 Via와 Trench를 한 번에 만들어 공정을 단축합니다.'
    },
    {
      name: 'Barrier 증착',
      short: 'Barrier',
      desc: 'Cu가 절연체로 확산되는 것을 막는 얇은 막을 입힙니다.',
      detail: 'TaN/Ta 이중층을 PVD로 증착합니다. TaN은 Cu 확산 방지, Ta는 Cu와의 접착력 향상 역할을 합니다. 막이 너무 두꺼우면 저항이 증가하므로 2~5nm 수준으로 매우 얇게 만듭니다.'
    },
    {
      name: 'Cu Seed 증착',
      short: 'Cu Seed',
      desc: '전기도금(ECP)을 위한 얇은 Cu 씨앗층을 입힙니다.',
      detail: 'PVD로 10~50nm의 얇은 Cu층을 증착합니다. 이 층이 있어야 다음 단계에서 전기도금이 가능합니다. 씨앗층이 균일해야 도금도 균일하게 됩니다.'
    },
    {
      name: 'ECP (전기도금)',
      short: 'ECP Fill',
      desc: '전기도금으로 홈을 Cu로 완전히 채웁니다.',
      detail: 'ECP(Electrochemical Plating)로 Cu를 채웁니다. 바닥부터 빈틈없이 채우는 "Bottom-up filling"이 핵심입니다. 첨가제(억제제, 촉진제, 레벨러)로 채움 품질을 조절합니다.'
    },
    {
      name: 'CMP (평탄화)',
      short: 'CMP',
      desc: '표면의 여분 Cu를 연마하여 평탄하게 만듭니다.',
      detail: 'CMP(Chemical Mechanical Polishing)로 과잉 Cu와 배리어를 제거합니다. 연마 패드와 슬러리(화학약품+연마입자)를 사용합니다. Dishing(Cu 패임)과 Erosion을 최소화하는 것이 과제입니다.'
    }
  ];

  // Damascene 탭
  const renderDamasceneTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">⚙️ Damascene 공정</h2>
        <p className="text-sm opacity-90">Cu 배선: 먼저 파고 채우는 Additive 방식</p>
      </div>

      {/* Damascene 개념 설명 */}
      <div className="bg-white border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-orange-700">🤔 Damascene이란?</h4>
        <p className="text-xs text-gray-700 mb-2">
          <strong>구리(Cu)는 플라즈마 식각이 매우 어렵습니다.</strong> 그래서 완전히 새로운 방식을 개발했습니다:
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-orange-50 p-2 rounded">
          <span className="font-bold">1. 홈 파기</span>
          <span>→</span>
          <span className="font-bold">2. 배리어 입히기</span>
          <span>→</span>
          <span className="font-bold">3. Cu 채우기</span>
          <span>→</span>
          <span className="font-bold">4. 연마(CMP)</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">※ 마치 <strong>도장 만들기</strong>와 비슷합니다: 나무에 글자를 새기고(홈), 잉크를 바른 후(Cu), 표면을 닦아내면(CMP) 글자만 남습니다.</p>
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
              {type === 'single' ? 'Via와 Trench 별도 공정 (단순)' : 'Via + Trench 동시 형성 (효율적)'}
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 bg-white rounded-lg border-2 border-green-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-green-800">Line Width: {lineWidth}nm</label>
          <span className="text-xs px-2 py-1 bg-green-100 rounded">
            {lineWidth <= 14 ? '3nm' : lineWidth <= 28 ? '7nm' : lineWidth <= 45 ? '14nm' : '28nm+'} node
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="180"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-green"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10nm</span>
          <span>180nm</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">※ 배선 폭이 좁을수록 첨단 공정. 7nm 이하에서는 Cu의 저항 증가 문제가 심각해집니다.</p>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-purple-700">🛡️ 배리어 재료 선택</h4>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {['TaN', 'Ta', 'TaN/Ta', 'TiN'].map((b) => (
            <button
              key={b}
              onClick={() => setBarrierMaterial(b)}
              className={`p-2 rounded text-xs font-medium transition ${
                barrierMaterial === b ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          ※ <strong>TaN/Ta 이중층</strong>이 가장 일반적. TaN=Cu 확산 차단, Ta=Cu 접착력 향상. 배리어가 너무 두꺼우면 배선 저항↑
        </p>
      </div>

      <div className="bg-white border-2 border-orange-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-sm">🔄 {damasceneType === 'dual' ? 'Dual' : 'Single'} Damascene 공정 시뮬레이션</h4>
          {damasceneStep < 0 ? (
            <button
              onClick={startDamasceneProcess}
              className="px-4 py-2 rounded font-bold text-sm bg-orange-500 text-white hover:bg-orange-600"
            >
              ▶ 시작
            </button>
          ) : (
            <button
              onClick={resetDamascene}
              className="px-3 py-1.5 rounded font-bold text-xs bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              ↺ 처음으로
            </button>
          )}
        </div>

        {/* 시작 전 안내 */}
        {damasceneStep < 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <p className="text-sm text-gray-600">시작 버튼을 눌러 Damascene 공정을 단계별로 학습하세요</p>
            <p className="text-xs text-gray-400 mt-1">이전/다음 버튼으로 각 단계를 직접 넘길 수 있습니다</p>
          </div>
        )}

        {/* 시작 후 표시 */}
        {damasceneStep >= 0 && (
          <>
            {/* 진행 단계 표시 - 외곽선 추가 */}
            <div className="grid grid-cols-5 gap-1 mb-3">
              {damasceneStepDetails.map((step, i) => (
                <div
                  key={i}
                  onClick={() => setDamasceneStep(i)}
                  className={`p-2 rounded text-center text-xs transition border-2 cursor-pointer ${
                    i === damasceneStep
                      ? 'bg-orange-500 text-white border-orange-600'
                      : i < damasceneStep
                      ? 'bg-orange-200 text-orange-800 border-orange-300'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:border-orange-300'
                  }`}
                >
                  {step.short}
                </div>
              ))}
            </div>

            {/* 진행 바 */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">진행률:</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 border-2 border-gray-300 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all"
                    style={{ width: `${((damasceneStep + 1) / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-orange-600">{Math.round(((damasceneStep + 1) / 5) * 100)}%</span>
              </div>
            </div>

            {/* 현재 단계 설명 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
              <h5 className="font-bold text-sm text-orange-800 mb-1">
                📍 Step {damasceneStep + 1}: {damasceneStepDetails[damasceneStep].name}
              </h5>
              <p className="text-xs text-gray-700 mb-2">{damasceneStepDetails[damasceneStep].desc}</p>
              <p className="text-xs text-gray-600 bg-white p-2 rounded">{damasceneStepDetails[damasceneStep].detail}</p>
            </div>

            {/* 시각화 */}
            <svg viewBox="0 0 300 100" className="w-full h-48 bg-gray-900 rounded border border-gray-300 mb-3">
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
                  <rect x="40" y="20" width="40" height="50" fill="none" stroke="#8B5CF6" strokeWidth="3" />
                  <rect x="120" y="20" width="40" height="50" fill="none" stroke="#8B5CF6" strokeWidth="3" />
                  <rect x="200" y="20" width="40" height="50" fill="none" stroke="#8B5CF6" strokeWidth="3" />
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

              <text x="150" y="90" textAnchor="middle" fill="white" fontSize="8">Lower Metal / ILD (절연층)</text>
            </svg>

            {/* 이전/다음 버튼 */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevDamasceneStep}
                disabled={damasceneStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  damasceneStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← 이전
              </button>

              <span className="text-sm text-gray-500">
                {damasceneStep + 1} / 5
              </span>

              {damasceneStep < 4 ? (
                <button
                  onClick={nextDamasceneStep}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold text-sm"
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={resetDamascene}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold text-sm"
                >
                  완료 ✓
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Single vs Dual 비교 */}
      <div className="bg-gray-50 border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-gray-700">📊 Single vs Dual Damascene</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-2 rounded border">
            <strong className="text-blue-700">Single Damascene:</strong>
            <ul className="mt-1 space-y-1 text-gray-600">
              <li>• Via와 Trench 별도 형성</li>
              <li>• 공정 단순, 초기 기술</li>
              <li>• CMP 2번 필요</li>
            </ul>
          </div>
          <div className="bg-white p-2 rounded border">
            <strong className="text-orange-700">Dual Damascene:</strong>
            <ul className="mt-1 space-y-1 text-gray-600">
              <li>• Via + Trench 동시 형성</li>
              <li>• 공정 단축, 현재 표준</li>
              <li>• CMP 1번으로 충분</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 용어 설명 */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-yellow-800">📖 용어 사전</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <p><strong className="text-orange-700">Via:</strong> 상하층 금속을 연결하는 수직 구멍</p>
            <p><strong className="text-orange-700">Trench:</strong> 배선이 들어갈 수평 홈/도랑</p>
            <p><strong className="text-orange-700">ILD:</strong> Inter-Layer Dielectric, 층간 절연막</p>
            <p><strong className="text-orange-700">Low-k:</strong> 낮은 유전율 절연막 (신호 지연↓)</p>
            <p><strong className="text-orange-700">RIE:</strong> Reactive Ion Etching, 반응성 이온 식각</p>
          </div>
          <div className="space-y-1">
            <p><strong className="text-orange-700">PVD:</strong> Physical Vapor Deposition, 물리적 증착</p>
            <p><strong className="text-orange-700">ECP:</strong> Electrochemical Plating, 전기도금</p>
            <p><strong className="text-orange-700">CMP:</strong> Chemical Mechanical Polishing, 화학기계연마</p>
            <p><strong className="text-orange-700">Dishing:</strong> CMP 후 Cu가 움푹 패이는 현상</p>
            <p><strong className="text-orange-700">Erosion:</strong> CMP 후 절연막이 깎이는 현상</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
        <h4 className="font-bold text-sm mb-2">💡 핵심 포인트</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• <strong>Cu를 직접 식각 안 하는 이유:</strong> Cu 염화물이 비휘발성이라 플라즈마 식각이 안 됨</li>
          <li>• <strong>배리어 역할:</strong> Cu 원자가 Si/SiO₂로 확산되면 소자 특성 파괴</li>
          <li>• <strong>CMP 과제:</strong> Dishing(Cu 패임), Erosion(절연막 손상) 최소화</li>
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

      {/* EDS 개념 설명 */}
      <div className="bg-white border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-green-700">🤔 EDS란?</h4>
        <p className="text-xs text-gray-700 mb-2">
          웨이퍼 한 장에는 수백~수천 개의 칩(다이)이 있습니다. 이 중에서 <strong>불량품을 사전에 걸러내는</strong> 것이 EDS입니다.
        </p>
        <p className="text-xs text-gray-600 bg-green-50 p-2 rounded">
          💡 왜 중요할까요? → 불량 칩을 패키징하면 비용 낭비! 미리 걸러내면 수천만 원 절약됩니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <h3 className="font-bold text-sm mb-2 text-green-700">🎯 EDS의 4가지 목적</h3>
          <ul className="text-xs space-y-1">
            <li className="flex items-start gap-1">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>양품/불량 선별:</strong> 동작하지 않는 칩 제거</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>수선(Repair):</strong> 예비 회로로 교체하여 양품화</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>공정 피드백:</strong> 불량 패턴 분석 → Fab 개선</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>비용 절감:</strong> 불량 칩 패키징 비용 방지</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <h3 className="font-bold text-sm mb-2 text-green-700">🔌 프로브 카드란?</h3>
          <p className="text-xs text-gray-600 mb-2">수백~수천 개의 미세한 바늘(프로브)이 칩의 패드에 동시 접촉하여 전기 신호를 주고받습니다.</p>
          <div className="space-y-1">
            {[
              { id: 'cantilever', name: 'Cantilever', app: 'LCD Driver', desc: '단순 구조, 저비용' },
              { id: 'vertical', name: 'Vertical', app: 'Logic/SoC', desc: '수직형, 고밀도 패드' },
              { id: 'mems', name: 'MEMS', app: 'DRAM/CIS', desc: '초미세 피치, 최첨단' }
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
                <span className="text-gray-400 text-xs ml-1">({p.desc})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-green-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm">📋 EDS 5단계 시뮬레이션</h3>
          {edsStep < 0 ? (
            <button
              onClick={startEDSProcess}
              className="px-4 py-2 rounded font-bold text-sm bg-green-500 text-white hover:bg-green-600"
            >
              ▶ 시작
            </button>
          ) : (
            <button
              onClick={resetEDS}
              className="px-3 py-1.5 rounded font-bold text-xs bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              ↺ 처음으로
            </button>
          )}
        </div>

        {/* 시작 전 안내 */}
        {edsStep < 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm text-gray-600">시작 버튼을 눌러 EDS 검사 단계를 학습하세요</p>
            <p className="text-xs text-gray-400 mt-1">이전/다음 버튼으로 각 단계를 직접 넘길 수 있습니다</p>
          </div>
        )}

        {/* 시작 후 표시 */}
        {edsStep >= 0 && (
          <>
            {/* 진행 단계 표시 */}
            <div className="grid grid-cols-5 gap-1 mb-3">
              {edsSteps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => setEdsStep(i)}
                  className={`p-2 rounded text-center transition border-2 cursor-pointer ${
                    i === edsStep
                      ? 'bg-green-500 text-white border-green-600'
                      : i < edsStep
                      ? 'bg-green-200 text-green-800 border-green-300'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:border-green-300'
                  }`}
                >
                  <div className="text-lg mb-1">{step.icon}</div>
                  <div className="text-xs font-bold leading-tight">{step.name}</div>
                  <div className="text-xs opacity-75">{step.desc}</div>
                </div>
              ))}
            </div>

            {/* 진행 바 */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">진행률:</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 border-2 border-gray-300 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-teal-500 h-full rounded-full transition-all"
                    style={{ width: `${((edsStep + 1) / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-green-600">{Math.round(((edsStep + 1) / 5) * 100)}%</span>
              </div>
            </div>

            {/* 현재 단계 상세 설명 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <h5 className="font-bold text-sm text-green-800 mb-1">
                {edsSteps[edsStep].icon} Step {edsStep + 1}: {edsSteps[edsStep].name}
              </h5>
              <p className="text-xs text-gray-700">{edsSteps[edsStep].fullDesc}</p>
            </div>

            {/* 이전/다음 버튼 */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevEDSStep}
                disabled={edsStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  edsStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← 이전
              </button>

              <span className="text-sm text-gray-500">
                {edsStep + 1} / 5
              </span>

              {edsStep < 4 ? (
                <button
                  onClick={nextEDSStep}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold text-sm"
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={resetEDS}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all font-semibold text-sm"
                >
                  완료 ✓
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* EDS 5단계 상세 설명 카드 */}
      <div className="bg-gray-50 border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-gray-700">📖 EDS 각 단계 상세 설명</h4>
        <div className="space-y-2">
          {edsSteps.map((step, i) => (
            <div key={i} className="bg-white p-2 rounded border text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{step.icon}</span>
                <span className="font-bold text-green-700">{step.name}</span>
                <span className="text-gray-400">- {step.desc}</span>
              </div>
              <p className="text-gray-600 ml-7">{step.fullDesc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h3 className="font-bold text-sm mb-2">📊 수율 시뮬레이터</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 bg-white rounded-lg border-2 border-red-200 shadow-sm">
            <label className="block text-sm font-medium mb-2 text-red-800">
              전체 다이: {totalDies}
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={totalDies}
              onChange={(e) => setTotalDies(parseInt(e.target.value))}
              className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-red"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100</span>
              <span>1000</span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
            <label className="block text-sm font-medium mb-2 text-blue-800">
              수율: {yieldRate}%
            </label>
            <input
              type="range"
              min="70"
              max="99"
              value={yieldRate}
              onChange={(e) => setYieldRate(parseInt(e.target.value))}
              className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>70%</span>
              <span>99%</span>
            </div>
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

      {/* 용어 설명 */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-yellow-800">📖 용어 사전</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <p><strong className="text-green-700">EDS:</strong> Electrical Die Sorting, 전기적 다이 선별</p>
            <p><strong className="text-green-700">Die:</strong> 웨이퍼에서 잘라낸 개별 칩 (=다이)</p>
            <p><strong className="text-green-700">Probe Card:</strong> 칩 패드에 접촉하는 바늘 어레이 장치</p>
            <p><strong className="text-green-700">Pad:</strong> 칩 표면의 전극 접촉 영역</p>
            <p><strong className="text-green-700">Yield:</strong> 수율, 양품 비율 (Good/Total)</p>
            <p><strong className="text-green-700">Fab:</strong> Fabrication, 반도체 제조 공장</p>
          </div>
          <div className="space-y-1">
            <p><strong className="text-green-700">ET:</strong> Electrical Test, 기본 전기 특성 검사</p>
            <p><strong className="text-green-700">WBI:</strong> Wafer Burn-In, 고온 스트레스 테스트</p>
            <p><strong className="text-green-700">MEMS:</strong> Micro-Electro-Mechanical Systems, 초미세 기계 시스템</p>
            <p><strong className="text-green-700">Vth:</strong> Threshold Voltage, 문턱 전압</p>
            <p><strong className="text-green-700">Redundancy:</strong> 예비 회로 (불량 셀 대체용)</p>
            <p><strong className="text-green-700">Wafer Map:</strong> 웨이퍼 상 다이별 양/불량 지도</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
        <h4 className="font-bold text-sm mb-2">💡 핵심 포인트</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• <strong>EDS 안 하면?</strong> 불량 칩도 패키징 → 비용 낭비, 수율 측정 불가</li>
          <li>• <strong>Hot/Cold Test:</strong> 온도 의존 불량(누설전류↑, 타이밍 변화) 검출</li>
          <li>• <strong>MEMS 프로브:</strong> 초미세 피치(40μm↓)에서 정밀 접촉 가능</li>
          <li>• <strong>Wafer Map:</strong> 불량 위치 패턴 분석 → Fab 공정 개선 피드백</li>
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

      {/* 패키징 개념 설명 */}
      <div className="bg-white border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-blue-700">🤔 패키징이란?</h4>
        <p className="text-xs text-gray-700 mb-2">
          웨이퍼에서 잘라낸 <strong>칩(다이)</strong>은 매우 연약합니다. 패키징은 이 칩을 <strong>보호</strong>하고, <strong>외부 회로와 연결</strong>하며, <strong>열을 방출</strong>시키는 '옷 입히기' 과정입니다.
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-lg">🛡️</div>
            <div className="font-bold">보호</div>
            <div className="text-gray-500">먼지, 수분, 충격</div>
          </div>
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-lg">🔌</div>
            <div className="font-bold">전기 연결</div>
            <div className="text-gray-500">칩 ↔ PCB 기판</div>
          </div>
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-lg">🌡️</div>
            <div className="font-bold">열 방출</div>
            <div className="text-gray-500">발열 → 외부 배출</div>
          </div>
        </div>
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
            <svg viewBox="0 0 200 120" className="w-full h-56 bg-gray-900 rounded">
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
                <svg viewBox="0 0 120 70" className="w-full h-32 bg-gray-900 rounded">
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
                <svg viewBox="0 0 120 70" className="w-full h-32 bg-gray-900 rounded">
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

      {/* 용어 설명 - 기존 패키지 */}
      {packageView === 'basic' && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <h4 className="font-bold text-sm mb-2 text-yellow-800">📖 기존 패키지 용어</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <p><strong className="text-blue-700">DIP:</strong> Dual In-line Package, 양쪽에 핀이 있는 직사각형 패키지 (구형, 납땜 삽입형)</p>
              <p><strong className="text-blue-700">QFP:</strong> Quad Flat Package, 네 면에 핀이 있는 평면형 (SMD 방식)</p>
              <p><strong className="text-blue-700">BGA:</strong> Ball Grid Array, 바닥에 솔더볼 격자 배열 (고밀도 I/O)</p>
            </div>
            <div className="space-y-1">
              <p><strong className="text-blue-700">CSP:</strong> Chip Scale Package, 칩 크기와 거의 같은 소형 패키지</p>
              <p><strong className="text-blue-700">FC-BGA:</strong> Flip Chip BGA, 칩을 뒤집어 범프로 연결 (고성능)</p>
              <p><strong className="text-blue-700">SMD:</strong> Surface Mount Device, 표면 실장 (납땜 구멍 불필요)</p>
            </div>
          </div>
        </div>
      )}

      {/* 용어 설명 - 첨단 패키징 */}
      {packageView === 'advanced' && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <h4 className="font-bold text-sm mb-2 text-yellow-800">📖 첨단 패키징 용어</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <p><strong className="text-indigo-700">TSV:</strong> Through-Silicon Via, 실리콘을 관통하는 수직 연결 (3D용)</p>
              <p><strong className="text-indigo-700">RDL:</strong> Re-Distribution Layer, 재배선층 (패드 위치 재배치)</p>
              <p><strong className="text-indigo-700">Interposer:</strong> 칩들 사이 중간 연결 기판 (Si/유기물)</p>
              <p><strong className="text-indigo-700">HBM:</strong> High Bandwidth Memory, 고대역폭 메모리 (DRAM 적층)</p>
              <p><strong className="text-indigo-700">Chiplet:</strong> 기능별로 분리된 작은 칩 (모듈화 설계)</p>
            </div>
            <div className="space-y-1">
              <p><strong className="text-indigo-700">CoWoS:</strong> Chip-on-Wafer-on-Substrate, TSMC의 2.5D 기술</p>
              <p><strong className="text-indigo-700">EMIB:</strong> Embedded Multi-die Interconnect Bridge, 인텔의 2.5D 기술</p>
              <p><strong className="text-indigo-700">Foveros:</strong> 인텔의 3D 적층 기술 (로직+로직 적층)</p>
              <p><strong className="text-indigo-700">InFO:</strong> Integrated Fan-Out, TSMC의 팬아웃 기술</p>
              <p><strong className="text-indigo-700">FOWLP:</strong> Fan-Out Wafer Level Package, 팬아웃 웨이퍼 레벨 패키지</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h4 className="font-bold text-sm mb-2">💡 핵심 포인트</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• <strong>BGA vs QFP:</strong> BGA는 바닥 전체 사용 → I/O 수 10배↑, 열방출↑</li>
          <li>• <strong>2.5D 인터포저:</strong> 고속 칩간 연결 (CPU↔HBM), 미세 배선 가능</li>
          <li>• <strong>HBM 3D 적층:</strong> DRAM 4~12층 적층 → 대역폭 1TB/s↑, 면적↓</li>
          <li>• <strong>Chiplet:</strong> 작은 칩 조합 → 수율↑, 유연한 구성, 비용↓</li>
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

      {/* 본딩 개념 설명 */}
      <div className="bg-white border rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-purple-700">🤔 본딩이란?</h4>
        <p className="text-xs text-gray-700 mb-2">
          칩(다이)의 전극 패드와 패키지 기판을 <strong>전기적으로 연결</strong>하는 핵심 공정입니다.
          마치 <strong>전화선을 집과 전봇대에 연결</strong>하는 것처럼, 칩의 신호가 외부로 나가려면 반드시 본딩이 필요합니다.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs bg-purple-50 p-2 rounded">
          <div>
            <strong>📍 목적:</strong>
            <ul className="mt-1 space-y-0.5 text-gray-600">
              <li>• 전기 신호 전달 (I/O)</li>
              <li>• 전원(VDD) 및 접지(GND) 공급</li>
              <li>• 열 방출 경로 확보</li>
            </ul>
          </div>
          <div>
            <strong>📍 핵심 요구사항:</strong>
            <ul className="mt-1 space-y-0.5 text-gray-600">
              <li>• 낮은 저항 (신호 손실↓)</li>
              <li>• 낮은 인덕턴스 (고주파 성능)</li>
              <li>• 높은 신뢰성 (장기간 동작)</li>
            </ul>
          </div>
        </div>
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
          <div className="text-xs text-gray-500">가는 금속선으로 연결</div>
        </button>
        <button
          onClick={() => setBondingMethod('flip')}
          className={`p-4 rounded-lg border-2 text-center transition ${
            bondingMethod === 'flip' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="text-3xl mb-1">🔄</div>
          <div className="font-bold">Flip Chip</div>
          <div className="text-xs text-gray-500">칩을 뒤집어 범프로 연결</div>
        </button>
      </div>

      {/* 선택된 방식 상세 설명 */}
      <div className="bg-white border-2 border-purple-200 rounded-lg p-3">
        {bondingMethod === 'wire' ? (
          <>
            <h4 className="font-bold text-sm mb-2 text-purple-700">〰️ Wire Bonding 상세</h4>
            <p className="text-xs text-gray-700 mb-2">
              <strong>가는 금속선(직경 15~50μm)</strong>으로 칩 패드와 기판을 연결합니다.
              마치 <strong>재봉틀로 옷감을 꿰매는 것</strong>처럼, 한 올 한 올 연결합니다.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
              <div className="bg-yellow-50 p-2 rounded text-center border">
                <div className="font-bold text-yellow-700">Au (금)</div>
                <div className="text-gray-500">고신뢰성, 고비용</div>
                <div className="text-gray-400">고급 IC, LED</div>
              </div>
              <div className="bg-orange-50 p-2 rounded text-center border">
                <div className="font-bold text-orange-700">Cu (구리)</div>
                <div className="text-gray-500">저비용, 저저항</div>
                <div className="text-gray-400">대량 생산품</div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-center border">
                <div className="font-bold text-gray-700">Al (알루미늄)</div>
                <div className="text-gray-500">초음파 웨지용</div>
                <div className="text-gray-400">파워 IC</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 bg-purple-50 p-2 rounded">
              💡 <strong>Ball-Wedge 방식:</strong> 먼저 볼(공)을 만들어 칩 패드에 붙이고, 와이어를 늘려서 기판에 웨지(쐐기) 형태로 접합합니다.
            </p>
          </>
        ) : (
          <>
            <h4 className="font-bold text-sm mb-2 text-purple-700">🔄 Flip Chip 상세</h4>
            <p className="text-xs text-gray-700 mb-2">
              칩을 <strong>뒤집어서(Face Down)</strong> 패드 위의 <strong>범프(돌기)</strong>로 직접 기판에 접합합니다.
              마치 <strong>도장을 찍듯이</strong> 한 번에 모든 연결이 완성됩니다.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div className="bg-orange-50 p-2 rounded border">
                <div className="font-bold text-orange-700">C4 Solder Bump</div>
                <div className="text-gray-500">솔더(납) 범프, 100μm급</div>
                <div className="text-gray-400">CPU, GPU 표준</div>
              </div>
              <div className="bg-amber-50 p-2 rounded border">
                <div className="font-bold text-amber-700">Cu Pillar</div>
                <div className="text-gray-500">구리 기둥+솔더캡, 40μm급</div>
                <div className="text-gray-400">미세 피치용</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 bg-purple-50 p-2 rounded">
              💡 <strong>Underfill:</strong> 칩과 기판 사이 빈 공간을 에폭시로 채워 열팽창 차이(CTE mismatch)를 완화하고 신뢰성을 높입니다.
            </p>
          </>
        )}
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h3 className="font-bold text-sm mb-2">
          {bondingMethod === 'wire' ? '〰️ Wire Bonding' : '🔄 Flip Chip'} 구조
        </h3>
        <svg viewBox="0 0 240 110" className="w-full h-48 bg-gray-900 rounded">
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
        <div className="p-3 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
          <label className="block text-sm font-medium mb-2 text-blue-800">
            I/O Count: {wireCount}
          </label>
          <input
            type="range"
            min="64"
            max="2048"
            step="64"
            value={wireCount}
            onChange={(e) => setWireCount(parseInt(e.target.value))}
            className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>64</span>
            <span>2048</span>
          </div>
        </div>
        <div className="p-3 bg-white rounded-lg border-2 border-green-200 shadow-sm">
          <label className="block text-sm font-medium mb-2 text-green-800">
            Pitch: {pitchSize}μm
          </label>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={pitchSize}
            onChange={(e) => setPitchSize(parseInt(e.target.value))}
            className="w-full h-5 rounded-lg appearance-none cursor-pointer slider-thumb-green"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>30μm</span>
            <span>300μm</span>
          </div>
        </div>
      </div>

      {/* 용어 설명 */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
        <h4 className="font-bold text-sm mb-2 text-yellow-800">📖 용어 사전</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <p><strong className="text-purple-700">Ball Bonding:</strong> 볼(공) 형태로 칩 패드에 첫 접합</p>
            <p><strong className="text-purple-700">Wedge Bonding:</strong> 쐐기 형태로 기판에 두 번째 접합</p>
            <p><strong className="text-purple-700">Capillary:</strong> 와이어를 안내하는 가는 관 (본딩 도구)</p>
            <p><strong className="text-purple-700">Bump:</strong> 칩 패드 위에 만든 금속 돌기 (Flip Chip용)</p>
            <p><strong className="text-purple-700">C4:</strong> Controlled Collapse Chip Connection (IBM 특허)</p>
          </div>
          <div className="space-y-1">
            <p><strong className="text-purple-700">Underfill:</strong> 칩-기판 사이 채우는 에폭시 (CTE 보완)</p>
            <p><strong className="text-purple-700">CTE:</strong> Coefficient of Thermal Expansion, 열팽창계수</p>
            <p><strong className="text-purple-700">I/O:</strong> Input/Output, 입출력 단자</p>
            <p><strong className="text-purple-700">Pitch:</strong> 패드/범프 간 간격 (미세할수록 고밀도)</p>
            <p><strong className="text-purple-700">Hybrid Bonding:</strong> Cu-Cu 직접 접합 (솔더 없음, 초미세)</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
        <h4 className="font-bold text-sm mb-2">💡 핵심 포인트</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• <strong>Au→Cu 전환:</strong> 금 가격 상승, Cu도 신뢰성 확보됨 (질소 분위기 본딩)</li>
          <li>• <strong>Underfill 역할:</strong> Si(3ppm)와 기판(17ppm)의 열팽창 차이 완충</li>
          <li>• <strong>고주파에 Flip Chip:</strong> 와이어 길이 0 → 인덕턴스↓ → GHz 동작 가능</li>
          <li>• <strong>Hybrid Bonding:</strong> 피치 10μm↓ 가능, HBM/3D IC 핵심 기술</li>
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
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <style>{`
        /* 슬라이더 기본 스타일 */
        input[type="range"].slider-thumb-red,
        input[type="range"].slider-thumb-blue,
        input[type="range"].slider-thumb-green {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        /* 빨간색 슬라이더 트랙 */
        input[type="range"].slider-thumb-red::-webkit-slider-runnable-track {
          background: #fecaca;
          height: 10px;
          border-radius: 5px;
          border: 2px solid #dc2626;
        }
        input[type="range"].slider-thumb-red::-moz-range-track {
          background: #fecaca;
          height: 10px;
          border-radius: 5px;
          border: 2px solid #dc2626;
        }
        input[type="range"].slider-thumb-red::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -7px;
          background: linear-gradient(145deg, #ef4444, #dc2626);
          height: 24px;
          width: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.5);
          cursor: pointer;
        }
        input[type="range"].slider-thumb-red::-moz-range-thumb {
          background: linear-gradient(145deg, #ef4444, #dc2626);
          height: 20px;
          width: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.5);
          cursor: pointer;
        }

        /* 파란색 슬라이더 트랙 */
        input[type="range"].slider-thumb-blue::-webkit-slider-runnable-track {
          background: #bfdbfe;
          height: 10px;
          border-radius: 5px;
          border: 2px solid #2563eb;
        }
        input[type="range"].slider-thumb-blue::-moz-range-track {
          background: #bfdbfe;
          height: 10px;
          border-radius: 5px;
          border: 2px solid #2563eb;
        }
        input[type="range"].slider-thumb-blue::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -7px;
          background: linear-gradient(145deg, #3b82f6, #2563eb);
          height: 24px;
          width: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.5);
          cursor: pointer;
        }
        input[type="range"].slider-thumb-blue::-moz-range-thumb {
          background: linear-gradient(145deg, #3b82f6, #2563eb);
          height: 20px;
          width: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.5);
          cursor: pointer;
        }

        /* 녹색 슬라이더 트랙 */
        input[type="range"].slider-thumb-green::-webkit-slider-runnable-track {
          background: #bbf7d0;
          height: 10px;
          border-radius: 5px;
          border: 2px solid #16a34a;
        }
        input[type="range"].slider-thumb-green::-moz-range-track {
          background: #bbf7d0;
          height: 10px;
          border-radius: 5px;
          border: 2px solid #16a34a;
        }
        input[type="range"].slider-thumb-green::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -7px;
          background: linear-gradient(145deg, #22c55e, #16a34a);
          height: 24px;
          width: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.5);
          cursor: pointer;
        }
        input[type="range"].slider-thumb-green::-moz-range-thumb {
          background: linear-gradient(145deg, #22c55e, #16a34a);
          height: 20px;
          width: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.5);
          cursor: pointer;
        }

        /* 호버 효과 */
        input[type="range"].slider-thumb-red:hover::-webkit-slider-thumb,
        input[type="range"].slider-thumb-blue:hover::-webkit-slider-thumb,
        input[type="range"].slider-thumb-green:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-100 via-green-100 to-blue-100 text-amber-800 shadow-sm border border-amber-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MetallizationEDSPackagingSimulator;
