import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';

const PlasmaSimulatorII = () => {
  const [activeTheme, setActiveTheme] = useState('system-structure-icp');
  const [etchPower, setEtchPower] = useState(200);
  const [etchPressure, setEtchPressure] = useState(10);
  const [etchGasType, setEtchGasType] = useState('CF4');
  const [substrateTemp, setSubstrateTemp] = useState(20);
  const [patternDensity, setPatternDensity] = useState(50);
  const [icpRfOn, setIcpRfOn] = useState(true);
  const [electronAngle, setElectronAngle] = useState(0);
  const [systemType, setSystemType] = useState('ICP');
  const [electrodeArea, setElectrodeArea] = useState(314);
  const [electrodeGap, setElectrodeGap] = useState(5);
  const [rfPower, setRfPower] = useState(100);
  const [icpStep, setIcpStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // 퀴즈 관련 상태
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('상'); // 난이도 상태 추가

  const themes = [
    { id: 'system-structure-icp', name: '시스템 구조(ICP)', icon: '🔬', color: 'indigo' },
    { id: 'etching-process', name: '식각 공정', icon: '⚙️', color: 'orange' },
    { id: 'equipment-application', name: '장비 응용', icon: '🏭', color: 'red' },
    { id: 'quiz', name: '개념 확인 퀴즈', icon: '📝', color: 'green' }
  ];

  // 각 단계별 설명 텍스트
  const stepDescriptions = {
    1: [
      "RF 파워 공급기에서 13.56MHz의 고주파 교류 전류를 코일에 공급합니다.",
      "코일 도선을 따라 흐르는 교류 전류는 시간에 따라 방향이 바뀝니다.", 
      "이 전류가 플라즈마 생성의 첫 번째 단계인 에너지 공급원 역할을 합니다.",
      "코일의 형태와 전류의 크기가 플라즈마 특성을 결정하는 중요한 요소입니다."
    ],
    2: [
      "교류 전류에 의해 코일 주변에 시간에 따라 변하는 자기장이 생성됩니다.",
      "패러데이 법칙에 의해 시변 자기장은 챔버 내부에 원형 전기장을 유도합니다.",
      "자기력선은 코일을 중심으로 동심원 형태로 퍼져나가며 균일한 분포를 형성합니다.",
      "이 유도된 전기장이 전자들을 가속시키는 핵심 메커니즘입니다."
    ],
    3: [
      "자기장 내에서 전자들은 로렌츠 힘을 받아 원형 궤도 운동을 시작합니다.",
      "이러한 원형 운동을 자이로모션(Cyclotron Motion)이라고 부릅니다.",
      "직선 운동 대신 원형 궤도로 움직이면서 전자의 이동 경로가 크게 늘어납니다.",
      "긴 이동 경로로 인해 전자와 중성 원자의 충돌 확률이 극적으로 증가합니다."
    ],
    4: [
      "에너지가 충분히 증가한 전자가 중성 원자와 충돌하여 이온화를 일으킵니다.",
      "충돌 시 원자에서 전자가 떨어져 나와 양이온과 자유전자가 생성됩니다.",
      "새로 생성된 전자들도 자이로모션을 하며 연쇄적인 이온화 반응을 유발합니다.",
      "이러한 과정으로 고밀도 플라즈마가 형성되어 안정적으로 유지됩니다."
    ]
  };

  // 퀴즈 문제 데이터 - 난이도별로 구분
  const quizQuestions = {
    하: [
      // 하급 난이도 - 하드웨어 문제 (7문제)
      {
        id: 1,
        category: "하드웨어",
        question: "ICP는 무엇의 약자인가요?",
        options: [
          "Inductively Coupled Plasma",
          "Ion Collision Process",
          "Integrated Circuit Processing", 
          "Internal Chamber Pressure"
        ],
        correct: 0,
        explanation: "ICP는 Inductively Coupled Plasma(유도결합 플라즈마)의 약자입니다. 코일에 의한 유도결합으로 플라즈마를 생성하는 방식입니다."
      },
      {
        id: 2,
        category: "하드웨어",
        question: "CCP 방식에서 플라즈마 생성에 주로 사용되는 것은?",
        options: [
          "자기장",
          "전기장",
          "중력장",
          "온도"
        ],
        correct: 1,
        explanation: "CCP(Capacitively Coupled Plasma)는 용량결합 플라즈마로, 평행한 전극 사이의 전기장을 이용하여 플라즈마를 생성합니다."
      },
      {
        id: 3,
        category: "하드웨어",
        question: "플라즈마 상태에서 전자의 운동 특성은?",
        options: [
          "직선 운동만 함",
          "정지 상태",
          "빠르고 활발한 운동",
          "아주 느린 운동"
        ],
        correct: 2,
        explanation: "플라즈마 상태에서 전자는 높은 에너지를 가지고 빠르고 활발하게 움직입니다. 이로 인해 이온화가 지속적으로 일어납니다."
      },
      {
        id: 4,
        category: "하드웨어",
        question: "RF 파워의 주파수로 가장 일반적으로 사용되는 것은?",
        options: [
          "13.56 MHz",
          "60 Hz",
          "2.45 GHz",
          "100 MHz"
        ],
        correct: 0,
        explanation: "13.56MHz는 ISM 밴드에 할당된 주파수로, 플라즈마 장비에서 가장 널리 사용되는 RF 주파수입니다."
      },
      {
        id: 5,
        category: "하드웨어",
        question: "ICP에서 Source RF의 주요 역할은?",
        options: [
          "이온 에너지 제어",
          "플라즈마 밀도 제어",
          "온도 제어",
          "압력 제어"
        ],
        correct: 1,
        explanation: "ICP의 Source RF는 플라즈마 생성과 밀도 제어를 담당합니다. Bias RF와 독립적으로 제어 가능한 것이 ICP의 큰 장점입니다."
      },
      {
        id: 6,
        category: "하드웨어",
        question: "플라즈마에서 이온화율이란?",
        options: [
          "전체 원자 중 이온화된 원자의 비율",
          "온도의 변화율",
          "압력의 변화율",
          "가스 유량의 비율"
        ],
        correct: 0,
        explanation: "이온화율은 전체 원자(또는 분자) 중에서 이온화되어 이온과 전자로 분리된 입자들의 비율을 나타냅니다."
      },
      {
        id: 7,
        category: "하드웨어",
        question: "ECR 플라즈마에서 사용하는 마이크로파 주파수는?",
        options: [
          "13.56 MHz",
          "2.45 GHz",
          "60 Hz",
          "100 MHz"
        ],
        correct: 1,
        explanation: "ECR(Electron Cyclotron Resonance) 플라즈마는 2.45GHz 마이크로파를 사용하여 전자 사이클로트론 공명을 일으킵니다."
      },
      // 하급 난이도 - 공정 문제 (3문제)
      {
        id: 8,
        category: "공정",
        question: "드라이 에칭의 가장 큰 장점은?",
        options: [
          "저렴한 비용",
          "높은 이방성",
          "빠른 처리 시간",
          "간단한 장비"
        ],
        correct: 1,
        explanation: "드라이 에칭의 가장 큰 장점은 높은 이방성(anisotropy)입니다. 이를 통해 정밀한 패턴을 수직으로 식각할 수 있습니다."
      },
      {
        id: 9,
        category: "공정",
        question: "실리콘 에칭에 주로 사용되는 가스는?",
        options: [
          "O₂",
          "N₂",
          "CF₄",
          "Ar"
        ],
        correct: 2,
        explanation: "CF₄는 실리콘 에칭에 가장 널리 사용되는 가스입니다. F 라디칼이 실리콘과 반응하여 휘발성인 SiF₄를 만듭니다."
      },
      {
        id: 10,
        category: "공정",
        question: "포토레지스트 제거(애싱)에 주로 사용하는 가스는?",
        options: [
          "CF₄",
          "Cl₂",
          "O₂",
          "SF₆"
        ],
        correct: 2,
        explanation: "O₂는 포토레지스트(유기물) 제거에 가장 효과적인 가스입니다. 산소 라디칼이 유기물을 CO₂와 H₂O로 산화 분해합니다."
      }
    ],
    중: [
      // 중급 난이도 - 하드웨어 문제 (7문제)
      {
        id: 11,
        category: "하드웨어",
        question: "ICP와 CCP의 가장 중요한 차이점은?",
        options: [
          "사용하는 가스의 종류",
          "플라즈마 생성 방식과 독립적 제어 가능성",
          "챔버의 크기",
          "전극의 개수"
        ],
        correct: 1,
        explanation: "ICP는 유도결합(자기장), CCP는 용량결합(전기장)으로 플라즈마를 생성하며, ICP는 플라즈마 밀도와 이온 에너지를 독립적으로 제어할 수 있습니다."
      },
      {
        id: 12,
        category: "하드웨어",
        question: "플라즈마 밀도가 증가할 때 일반적으로 나타나는 현상은?",
        options: [
          "Self-bias 전압 증가",
          "Self-bias 전압 감소",
          "이온 에너지 증가",
          "식각률 감소"
        ],
        correct: 1,
        explanation: "플라즈마 밀도가 증가하면 전자 온도가 감소하고, 이는 플라즈마 전위를 낮춰 Self-bias 전압을 감소시킵니다."
      },
      {
        id: 13,
        category: "하드웨어",
        question: "자이로모션(Cyclotron Motion)이 플라즈마에서 중요한 이유는?",
        options: [
          "전자의 속도를 줄여주기 때문",
          "전자의 이동 경로를 늘려 충돌 확률을 높이기 때문",
          "이온의 운동을 멈추게 하기 때문",
          "온도를 낮춰주기 때문"
        ],
        correct: 1,
        explanation: "자이로모션은 전자가 자기장에서 나선형 궤도를 그리며 이동하게 하여, 직선 이동보다 경로가 길어져 중성 원자와의 충돌 확률을 크게 증가시킵니다."
      },
      {
        id: 14,
        category: "하드웨어",
        question: "임피던스 매칭이 필요한 이유는?",
        options: [
          "전력 전달 효율을 최대화하기 위해",
          "가스 온도를 조절하기 위해",
          "챔버 압력을 유지하기 위해",
          "플라즈마 색깔을 바꾸기 위해"
        ],
        correct: 0,
        explanation: "임피던스 매칭은 RF 전원과 플라즈마 부하 사이의 임피던스를 맞춰 반사를 최소화하고 전력 전달 효율을 최대화하기 위해 필요합니다."
      },
      {
        id: 15,
        category: "하드웨어",
        question: "높은 종횡비(HAR) 구조 에칭에서 가장 중요한 요소는?",
        options: [
          "높은 압력",
          "낮은 압력과 방향성 있는 이온 충돌",
          "높은 온도",
          "많은 가스 유량"
        ],
        correct: 1,
        explanation: "HAR 구조에서는 이온이 구멍 바닥까지 직진하여 도달해야 하므로, 낮은 압력(긴 평균자유행로)과 방향성 있는 이온 충돌이 핵심입니다."
      },
      {
        id: 16,
        category: "하드웨어",
        question: "플라즈마에서 Sheath란?",
        options: [
          "플라즈마와 벽면 사이의 전기장 영역",
          "가스 공급 라인",
          "진공 펌프",
          "RF 코일"
        ],
        correct: 0,
        explanation: "Sheath는 플라즈마와 벽면(또는 전극) 사이에 형성되는 얇은 전기장 영역으로, 이온을 가속시키는 역할을 합니다."
      },
      {
        id: 17,
        category: "하드웨어",
        question: "RIE lag 현상이란?",
        options: [
          "좁은 패턴이 넓은 패턴보다 느리게 식각되는 현상",
          "온도가 올라가는 현상",
          "압력이 떨어지는 현상",
          "가스가 부족한 현상"
        ],
        correct: 0,
        explanation: "RIE lag는 좁은 패턴에서 반응 생성물의 배출이 어려워 식각률이 감소하는 현상으로, 고종횡비 구조에서 주요 문제가 됩니다."
      },
      // 중급 난이도 - 공정 문제 (3문제)
      {
        id: 18,
        category: "공정",
        question: "Synergy Effect가 나타나는 조건은?",
        options: [
          "화학 반응만 있을 때",
          "물리 반응만 있을 때",
          "화학 반응과 물리 반응이 동시에 일어날 때",
          "온도가 아주 높을 때"
        ],
        correct: 2,
        explanation: "Synergy Effect는 이온 충돌(물리적)과 라디칼 반응(화학적)이 동시에 일어날 때 나타나며, 각각의 합보다 훨씬 큰 효과를 보입니다."
      },
      {
        id: 19,
        category: "공정",
        question: "식각 선택비를 향상시키는 방법은?",
        options: [
          "물리적 식각 비율 증가",
          "화학적 식각 비율 증가와 온도 최적화",
          "압력을 최대한 높임",
          "RF 파워를 최대한 높임"
        ],
        correct: 1,
        explanation: "선택비 향상을 위해서는 화학적 반응의 차이를 이용하고, 반응 활성화를 위한 적절한 온도 조건을 찾는 것이 중요합니다."
      },
      {
        id: 20,
        category: "공정",
        question: "알루미늄 에칭에서 BCl₃가 Cl₂보다 선호되는 이유는?",
        options: [
          "더 저렴하기 때문",
          "Al₂O₃ 자연산화막 제거 능력이 뛰어나기 때문",
          "더 안전하기 때문",
          "더 빠르기 때문"
        ],
        correct: 1,
        explanation: "BCl₃는 강한 Lewis 산으로 알루미늄 표면의 자연산화막(Al₂O₃)을 효과적으로 제거할 수 있어 더 선호됩니다."
      }
    ],
    상: [
      // 상급 난이도 - 하드웨어 문제 (7문제) - 기존 코드의 문제들 사용
      {
        id: 21,
        category: "하드웨어",
        question: "ICP 시스템에서 Source RF를 450W에서 900W로 증가시켰을 때, 플라즈마 밀도는 4배 증가했지만 식각률은 2배만 증가했다. 이 현상의 가장 타당한 설명은?",
        options: [
          "가스 해리율이 포화상태에 도달하여 추가적인 라디칼 생성이 제한됨",
          "높은 플라즈마 밀도로 인한 이온-전자 재결합률 증가와 Self-bias 전압 감소가 복합적으로 작용",
          "RF 커플링 효율이 감소하여 실제 파워 전달이 선형적이지 않음",
          "챔버 벽면에서의 라디칼 손실이 증가하여 유효 라디칼 농도가 제한됨"
        ],
        correct: 1,
        explanation: "플라즈마 밀도 증가로 인해 ①이온-전자 재결합률이 증가하여 유효 이온 농도가 감소하고, ②Self-bias 전압이 감소하여 이온 에너지가 낮아져 물리적 식각 효율이 떨어집니다. 이 두 효과가 복합적으로 작용하여 식각률 증가가 플라즈마 밀도 증가에 비해 제한적으로 나타납니다."
      },
      {
        id: 22,
        category: "하드웨어", 
        question: "동일한 ICP 장비에서 200mm 웨이퍼 대비 300mm 웨이퍼 공정 시 균일도가 악화되는 주된 이유를 물리적 관점에서 분석한 것은?",
        options: [
          "스킨 깊이(Skin depth) 대비 웨이퍼 직경 증가로 인한 RF 전자기장 분포의 불균일성 심화",
          "가스 유량 증가에 따른 레이놀즈 수 변화로 인한 난류 유동 패턴 발생", 
          "더 큰 면적으로 인한 단순한 열 분포 불균일",
          "웨이퍼 무게 증가에 따른 정전척 힘의 불균일한 분포"
        ],
        correct: 0,
        explanation: "13.56MHz RF에서 스킨 깊이는 수 cm 정도입니다. 300mm 웨이퍼는 200mm 대비 반지름이 1.5배 증가하여 가장자리에서 RF 전자기장 강도가 중앙 대비 현저히 감소합니다. 이로 인해 플라즈마 밀도 분포가 불균일해져 식각률과 균일도가 악화됩니다."
      },
      {
        id: 23,
        category: "하드웨어",
        question: "고종횡비(HAR) Via 식각에서 RIE lag 현상을 최소화하기 위한 최적 전략은?",
        options: [
          "압력을 높여 평균자유행로(MFP)를 감소시켜 이온의 방향성을 향상",
          "압력을 낮춰 MFP를 증가시키고, 동시에 측벽 보호를 위한 폴리머 형성 가스 비율 최적화",
          "RF 파워를 최대한 높여 이온 플럭스를 증가시킴",
          "기판 온도를 높여 화학적 반응성을 증대시킴"
        ],
        correct: 1,
        explanation: "HAR Via에서는 이온의 직진성이 핵심입니다. 압력을 낮춰 MFP > Via depth가 되도록 하여 이온의 산란을 최소화해야 합니다. 동시에 C₄F₈ 등의 폴리머 형성 가스를 적절히 첨가하여 측벽을 보호하면서 바닥면만 선택적으로 식각하는 Bosch 공정 등을 활용해야 합니다."
      },
      {
        id: 24,
        category: "하드웨어",
        question: "플라즈마 임피던스 매칭에서 Load 임피던스가 50Ω에서 25+j15Ω로 변했을 때의 주요 영향은?",
        options: [
          "반사파 증가로 인한 전력 전달 효율 저하",
          "플라즈마 안정성 향상",
          "이온 에너지 증가",
          "가스 해리율 향상"
        ],
        correct: 0,
        explanation: "임피던스 불일치로 인해 반사계수가 증가하여 전력 전달 효율이 저하되고, 정재파가 발생하여 플라즈마 안정성과 공정 재현성에 악영향을 미칩니다."
      },
      {
        id: 25,
        category: "하드웨어",
        question: "ECR 시스템에서 2.45GHz 마이크로파 사용 시 전자 사이클로트론 공명 조건의 핵심 장점은?",
        options: [
          "전자 온도 상승으로 인한 해리도 증가하지만 이온화 효율은 감소",
          "전자 온도는 낮지만 이온화 효율과 플라즈마 밀도가 최대화됨",
          "고에너지 전자 생성으로 스퍼터링 수율 증가",
          "이온 사이클로트론 공명으로 인한 이온 가속 효과"
        ],
        correct: 1,
        explanation: "ECR에서는 공명을 통한 효율적 에너지 전달로 전자 온도를 높이지 않으면서도 높은 이온화율을 달성할 수 있어 고밀도, 저손상 플라즈마를 구현할 수 있습니다."
      },
      {
        id: 26,
        category: "하드웨어",
        question: "ICP 코일 설계에서 나선형(helical) 코일 대비 평면형(planar) 코일의 장단점 분석이 올바른 것은?",
        options: [
          "평면형이 나선형보다 높은 커플링 효율을 가지지만 균일도는 떨어짐",
          "나선형이 축방향 자기장으로 인해 더 높은 플라즈마 밀도를 생성하지만 제작비용이 높음",
          "평면형은 제작이 용이하고 균일도가 우수하지만 커플링 효율과 최대 플라즈마 밀도는 나선형보다 낮음",
          "두 방식 모두 물리적 원리가 동일하여 성능 차이는 미미함"
        ],
        correct: 2,
        explanation: "평면형 코일은 제작이 간단하고 반지름 방향 균일도가 우수하지만, 나선형 대비 코일-플라즈마 간 결합 계수가 낮아 같은 파워에서 낮은 플라즈마 밀도를 가집니다. 나선형은 축방향 자기장 성분이 강해 더 효율적인 유도결합을 제공하지만 3차원적 권선으로 인한 제작 복잡성과 균일도 제어의 어려움이 있습니다."
      },
      {
        id: 27,
        category: "하드웨어",
        question: "첨단 공정에서 요구되는 원자층 정밀도 제어를 위한 플라즈마 기술의 핵심 요소는?",
        options: [
          "고밀도 플라즈마를 이용한 고속 처리",
          "펄스 플라즈마와 표면 포화 반응의 조합",
          "높은 RF 파워를 이용한 물리적 스퍼터링",
          "연속 플라즈마를 이용한 안정적 공정"
        ],
        correct: 1,
        explanation: "원자층 정밀도를 위해서는 ALE(Atomic Layer Etching) 기술이 필요하며, 이는 펄스 플라즈마를 이용해 표면을 화학적으로 개질한 후 물리적으로 제거하는 자기제한적(self-limiting) 반응을 활용합니다."
      },
      // 상급 난이도 - 공정 문제 (3문제)
      {
        id: 28,
        category: "공정",
        question: "Si 식각에서 CF₄/O₂ 플라즈마 조성비가 85:15에서 70:30으로 변경되었을 때, F/O 라디칼 비율 변화가 식각 특성에 미치는 영향을 분석한 결과는?",
        options: [
          "F 라디칼 농도 감소로 인한 화학적 식각률 감소가 주된 요인",
          "O 라디칼 증가로 인한 SiOxFy 중간생성물 형성이 식각률을 저해하는 주된 요인",
          "O₂ 증가로 인한 CO, CO₂ 생성이 F 라디칼 소모를 가속화하여 유효 F 농도가 감소", 
          "O 라디칼의 Si 표면 산화막 형성으로 인한 식각 억제와 F 라디칼 소모 증가가 복합적으로 작용"
        ],
        correct: 3,
        explanation: "O₂ 비율 증가 시 ①O 라디칼이 Si 표면에 SiO₂ 산화막을 형성하여 F 라디칼의 접근을 방해하고, ②CF₄ + O → COF₂ + F 반응으로 일부 F가 소모되며, ③형성된 SiO₂는 Si보다 낮은 식각률을 가져 전체적인 식각률이 감소합니다. 이는 선택비 향상에는 도움이 되지만 식각률에는 부정적 영향을 미칩니다."
      },
      {
        id: 29,
        category: "공정",
        question: "Al 식각에서 Cl₂/BCl₃/Ar = 60:30:10 조건 대비 40:40:20 조건으로 변경했을 때의 식각 특성 변화 예측은?",
        options: [
          "BCl₃ 증가로 인한 더 강한 Lewis 산성으로 Al₂O₃ 제거 효율 향상, Ar 증가로 물리적 식각 기여도 증가",
          "Cl₂ 감소로 인한 화학적 식각률 감소가 주된 변화",
          "전체적인 식각률은 유사하지만 이방성만 증가", 
          "BCl₃의 B 성분이 Al 표면에 보론 도핑을 일으켜 전기적 특성 변화"
        ],
        correct: 0,
        explanation: "BCl₃는 Cl₂보다 강한 Lewis 산으로 Al 표면의 자연산화막(Al₂O₃) 제거에 더 효과적입니다. BCl₃ 비율 증가는 산화막 관통능력을 향상시키고, Ar 비율 증가는 물리적 스퍼터링을 강화하여 전체적인 식각률과 이방성을 동시에 개선합니다. 단, 과도한 물리적 식각은 언더컷을 유발할 수 있어 최적화가 필요합니다."
      },
      {
        id: 30,
        category: "공정",
        question: "유기 Low-k 유전체(k=2.5) 식각에서 기존 SiO₂ 공정(CF₄/CHF₃)을 그대로 적용했을 때 발생하는 문제와 해결방안은?",
        options: [
          "단순히 파워를 낮춰 손상을 줄이면 해결됨",
          "F 라디칼이 유기 결합을 과도하게 공격하여 k값 상승과 기계적 강도 저하를 유발하므로, He/H₂ 희석을 통한 라디칼 농도 제어 필요",
          "CHF₃의 폴리머가 유기물과 반응하여 잔류물을 형성하므로 O₂ 첨가가 필요",
          "유기물의 낮은 열전도율로 인한 열 손상이 주 문제이므로 냉각 강화만 필요"
        ],
        correct: 1,
        explanation: "유기 Low-k 재료는 Si-O 백본에 -CH₃ 등 유기기가 결합된 구조입니다. 과도한 F 라디칼은 Si-C 결합을 파괴하여 ①유기기 탈리로 인한 k값 상승(밀도 증가), ②기계적 강도 저하, ③잔류 플루오르 incorporation을 야기합니다. He/H₂ 희석을 통해 F 라디칼 농도를 제어하고, 저온/저파워 조건으로 손상을 최소화해야 합니다."
      }
    ]
  };

  // 타이핑 애니메이션 효과
  useEffect(() => {
    if (!autoPlay || !stepDescriptions[icpStep]) return;
    
    setIsTyping(true);
    setTypingText('');
    
    const fullText = stepDescriptions[icpStep].join(' ');
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypingText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // 타이핑 완료 후 3초 대기 후 다음 단계
        setTimeout(() => {
          if (autoPlay) {
            setIcpStep(prev => prev < 4 ? prev + 1 : 1);
          }
        }, 3000);
      }
    }, 50); // 50ms마다 한 글자씩
    
    return () => clearInterval(typingInterval);
  }, [icpStep, autoPlay]);

  // 타이핑 진행률 계산
  const getTypingProgress = () => {
    if (!autoPlay || !stepDescriptions[icpStep]) return 1;
    const fullText = stepDescriptions[icpStep].join(' ');
    return fullText.length > 0 ? typingText.length / fullText.length : 0;
  };

  // ICP 애니메이션 효과 - 단계별 진행
  useEffect(() => {
    if (icpStep >= 3) {
      const interval = setInterval(() => {
        setElectronAngle(prev => (prev + 15) % 360);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [icpStep]);

  const calculateEtchRate = () => {
    const gasFactors = { 'CF4': 1.0, 'Cl2': 1.2, 'Ar': 0.3, 'O2': 0.8 };
    const gasFactor = gasFactors[etchGasType] || 1.0;
    const tempFactor = 1 + (substrateTemp - 20) * 0.01;
    const densityFactor = 1 - (patternDensity / 100) * 0.3;
    const baseRate = Math.pow(etchPower / 100, 0.5) * Math.pow(etchPressure / 10, 0.3);
    return (baseRate * gasFactor * tempFactor * densityFactor * 100).toFixed(0);
  };

  const calculateSelectivity = () => {
    const gasSelectivity = { 'CF4': 15, 'Cl2': 8, 'Ar': 2, 'O2': 25 };
    const baseSelectivity = gasSelectivity[etchGasType] || 10;
    const powerEffect = 1 - (etchPower - 100) / 1000;
    return (baseSelectivity * Math.max(0.2, powerEffect)).toFixed(1);
  };

  const generatePlasmaDistribution = () => {
    return Array.from({ length: 20 }, (_, i) => {
      const position = i * (electrodeGap / 19);
      let density = 1.0;
      if (systemType === 'CCP') {
        const distFromCenter = Math.abs(position - electrodeGap / 2);
        density = 0.5 + 0.5 * Math.exp(-distFromCenter);
      } else if (systemType === 'ICP') {
        density = 0.8 + 0.2 * Math.sin((position / electrodeGap) * Math.PI);
      }
      const potential = systemType === 'CCP' ? 20 * Math.sin((position / electrodeGap) * Math.PI) : 5 + 2 * Math.sin((position / electrodeGap) * 2 * Math.PI);
      return { position: position.toFixed(1), density: (density * 1e11 / 1e11).toFixed(2), potential: potential.toFixed(1) };
    });
  };

  const generateEtchingComparison = () => {
    const equipments = ['Barrel', 'CCP', 'RIE', 'ICP', 'ECR'];
    const rates = { 'Barrel': 20, 'CCP': 50, 'RIE': 80, 'ICP': 150, 'ECR': 120 };
    return equipments.map(eq => ({ equipment: eq, etchRate: rates[eq] }));
  };

  // 퀴즈 관련 함수들
  const getCurrentQuestions = () => {
    return quizQuestions[difficulty] || [];
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestions = getCurrentQuestions();
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    const currentQuestions = getCurrentQuestions();
    currentQuestions.forEach(question => {
      if (userAnswers[question.id] === question.correct) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    resetQuiz();
    setQuizStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">플라즈마 공정 교육 시뮬레이터 II - 고급 모듈</h1>
            <div className="text-sm text-gray-500">Advanced Learning System</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {themes.map((theme, index) => (
              <button key={theme.id} onClick={() => setActiveTheme(theme.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTheme === theme.id ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                <span className="text-lg">{theme.icon}</span>
                <span>{index + 1}. {theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTheme === 'system-structure-icp' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">🔬 ICP 플라즈마 시스템 구조</h2>
              <p className="text-indigo-700">유도결합 플라즈마(ICP) 시스템의 구조와 동작 원리를 학습합니다.</p>
              <div className="text-sm text-indigo-600 bg-indigo-100 rounded-lg p-3 mt-2">
                <strong>학습 포인트:</strong> 유도결합 원리, 독립적 제어의 중요성, CCP 대비 우수성
              </div>
            </div>

            {/* ICP 구조들 */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* ICP 자기장 원리 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-green-800 mb-4">1. ICP 유도결합 원리 - 4단계 프로세스</h3>
                
                {/* 단계 컨트롤 */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map(step => (
                      <button
                        key={step}
                        onClick={() => setIcpStep(step)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          icpStep === step 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {step}단계
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      autoPlay 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {autoPlay ? '자동재생 중지' : '자동재생 시작'}
                  </button>
                </div>

                {/* 현재 단계 설명 - 타이핑 애니메이션 */}
                <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 min-h-[120px]">
                  <div className="font-semibold text-green-800 mb-2">
                    {icpStep === 1 && "1단계: RF 코일에 전류 공급"}
                    {icpStep === 2 && "2단계: 시변 자기장 생성"}
                    {icpStep === 3 && "3단계: 전자의 자이로모션"}
                    {icpStep === 4 && "4단계: 이온화 과정"}
                  </div>
                  <div className="text-green-700 text-sm leading-relaxed">
                    {autoPlay ? (
                      <div>
                        {typingText}
                        {isTyping && <span className="animate-pulse bg-green-600 w-2 h-4 inline-block ml-1"></span>}
                      </div>
                    ) : (
                      <div>
                        {stepDescriptions[icpStep]?.map((line, index) => (
                          <div key={index} className="mb-1">{line}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <svg width="100%" height="400" viewBox="0 0 500 400">
                    {(() => {
                      const progress = autoPlay ? getTypingProgress() : 1;
                      
                      return (
                        <>
                          {/* RF 코일 (상단) - 항상 표시 */}
                          <ellipse cx="250" cy="80" rx="100" ry="25" fill="none" stroke="#059669" strokeWidth="4"/>
                          
                          {/* 1단계: RF 전류 표시 */}
                          {icpStep >= 1 && (
                            <>
                              <text x="250" y="45" textAnchor="middle" fontSize="14" fill="#059669" fontWeight="bold" 
                                    opacity={autoPlay && icpStep === 1 ? Math.min(1, progress * 3) : 1}>
                                RF Coil
                              </text>
                              {/* 전류 방향 화살표 - 코일을 따라 9시에서 12시 방향 */}
                              <path d="M150,80 Q175,65 200,58 Q225,55 250,55" fill="none" stroke="#dc2626" strokeWidth="3" markerEnd="url(#arrowRed)"
                                    opacity={autoPlay && icpStep === 1 ? Math.max(0, Math.min(1, (progress - 0.3) * 3)) : 1}/>
                              <text x="120" y="60" fontSize="12" fill="#dc2626" fontWeight="bold"
                                    opacity={autoPlay && icpStep === 1 ? Math.max(0, Math.min(1, (progress - 0.6) * 3)) : 1}>
                                RF Current
                              </text>
                              
                              <defs>
                                <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                                  <polygon points="0,0 8,4 0,8" fill="#dc2626"/>
                                </marker>
                              </defs>
                            </>
                          )}
                          
                          {/* 2단계: 자기장 라인 */}
                          {icpStep >= 2 && (
                            <>
                              {/* 자기력선 (동심원) - 순차적으로 나타남 */}
                              <circle cx="250" cy="200" r="40" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, progress * 4)) : 1}/>
                              <circle cx="250" cy="200" r="70" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.25) * 4)) : 1}/>
                              <circle cx="250" cy="200" r="100" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.5) * 4)) : 1}/>
                              
                              {/* 자기장 방향 표시 */}
                              <text x="260" y="145" fontSize="12" fill="#7c3aed" fontWeight="bold"
                                    opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.4) * 3)) : 1}>
                                B-field
                              </text>
                              
                              {/* 자기장 점들 */}
                              <circle cx="220" cy="170" r="2" fill="#7c3aed"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.6) * 5)) : 1}/>
                              <circle cx="280" cy="170" r="2" fill="#7c3aed"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.65) * 5)) : 1}/>
                              <circle cx="250" cy="240" r="2" fill="#7c3aed"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.7) * 5)) : 1}/>
                              <circle cx="190" cy="200" r="2" fill="#7c3aed"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.75) * 5)) : 1}/>
                              <circle cx="310" cy="200" r="2" fill="#7c3aed"
                                      opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.8) * 5)) : 1}/>
                              
                              {/* 자기장 강도 표시 */}
                              <line x1="180" y1="130" x2="180" y2="150" stroke="#7c3aed" strokeWidth="3"
                                    opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.85) * 10)) : 1}/>
                              <line x1="220" y1="130" x2="220" y2="150" stroke="#7c3aed" strokeWidth="3"
                                    opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.87) * 10)) : 1}/>
                              <line x1="280" y1="130" x2="280" y2="150" stroke="#7c3aed" strokeWidth="3"
                                    opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.89) * 10)) : 1}/>
                              <line x1="320" y1="130" x2="320" y2="150" stroke="#7c3aed" strokeWidth="3"
                                    opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.91) * 10)) : 1}/>
                              
                              {/* 화살표들 */}
                              <polygon points="177,147 183,147 180,157" fill="#7c3aed"
                                       opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.93) * 20)) : 1}/>
                              <polygon points="217,147 223,147 220,157" fill="#7c3aed"
                                       opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.94) * 20)) : 1}/>
                              <polygon points="277,147 283,147 280,157" fill="#7c3aed"
                                       opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.95) * 20)) : 1}/>
                              <polygon points="317,147 323,147 320,157" fill="#7c3aed"
                                       opacity={autoPlay && icpStep === 2 ? Math.max(0, Math.min(1, (progress - 0.96) * 20)) : 1}/>
                            </>
                          )}
                          
                          {/* 3단계: 전자의 자이로모션 */}
                          {icpStep >= 3 && (
                            <>
                              {/* 전자들의 원형 궤도 - 순차적으로 나타남 */}
                              <circle cx="220" cy="180" r="15" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2,2"
                                      opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, progress * 5)) : 1}/>
                              <circle cx="280" cy="220" r="15" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2,2"
                                      opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, (progress - 0.2) * 5)) : 1}/>
                              <circle cx="250" cy="200" r="15" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2,2"
                                      opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, (progress - 0.4) * 5)) : 1}/>
                              
                              {/* 움직이는 전자들 - 궤도가 나타난 후 */}
                              {(autoPlay && icpStep === 3 && progress > 0.6) || (!autoPlay) ? (
                                <>
                                  <circle 
                                    cx={220 + 15 * Math.cos(electronAngle * Math.PI / 180)} 
                                    cy={180 + 15 * Math.sin(electronAngle * Math.PI / 180)} 
                                    r="3" 
                                    fill="#3b82f6"
                                    opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, (progress - 0.6) * 5)) : 1}
                                  />
                                  <circle 
                                    cx={280 + 15 * Math.cos((electronAngle + 120) * Math.PI / 180)} 
                                    cy={220 + 15 * Math.sin((electronAngle + 120) * Math.PI / 180)} 
                                    r="3" 
                                    fill="#3b82f6"
                                    opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, (progress - 0.7) * 5)) : 1}
                                  />
                                  <circle 
                                    cx={250 + 15 * Math.cos((electronAngle + 240) * Math.PI / 180)} 
                                    cy={200 + 15 * Math.sin((electronAngle + 240) * Math.PI / 180)} 
                                    r="3" 
                                    fill="#3b82f6"
                                    opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, (progress - 0.8) * 5)) : 1}
                                  />
                                </>
                              ) : null}
                              
                              <text x="320" y="185" fontSize="12" fill="#3b82f6" fontWeight="bold"
                                    opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, (progress - 0.5) * 3)) : 1}>
                                e⁻ 자이로모션
                              </text>
                              
                              {/* 자이로모션 설명 화살표 */}
                              <path 
                                d={`M ${250 + 15 * Math.cos((electronAngle + 240) * Math.PI / 180)} ${200 + 15 * Math.sin((electronAngle + 240) * Math.PI / 180)} Q 290 210 320 185`} 
                                fill="none" 
                                stroke="#3b82f6" 
                                strokeWidth="1" 
                                strokeDasharray="2,2"
                                opacity={autoPlay && icpStep === 3 ? Math.max(0, Math.min(1, (progress - 0.9) * 10)) : 1}
                              />
                            </>
                          )}
                          
                          {/* 4단계: 이온화 과정 */}
                          {icpStep >= 4 && (
                            <>
                              {/* 중성 원자들 - 순차적으로 나타남 */}
                              <circle cx="200" cy="160" r="4" fill="#9ca3af" 
                                      opacity={autoPlay && icpStep === 4 ? Math.max(0, Math.min(1, progress * 4)) : 0.8}/>
                              <circle cx="270" cy="250" r="4" fill="#9ca3af" 
                                      opacity={autoPlay && icpStep === 4 ? Math.max(0, Math.min(1, (progress - 0.15) * 4)) : 0.8}/>
                              <circle cx="290" cy="180" r="4" fill="#9ca3af" 
                                      opacity={autoPlay && icpStep === 4 ? Math.max(0, Math.min(1, (progress - 0.3) * 4)) : 0.8}/>
                              <circle cx="210" cy="230" r="4" fill="#9ca3af" 
                                      opacity={autoPlay && icpStep === 4 ? Math.max(0, Math.min(1, (progress - 0.45) * 4)) : 0.8}/>
                              
                              {/* 충돌 표시 - 중성원자 후 */}
                              <g opacity={autoPlay && icpStep === 4 ? Math.max(0, Math.min(0.7, (progress - 0.6) * 3)) : 0.7}>
                                <circle cx="200" cy="160" r="8" fill="none" stroke="#fbbf24" strokeWidth="2"/>
                                <circle cx="270" cy="250" r="8" fill="none" stroke="#fbbf24" strokeWidth="2"/>
                                <text x="170" y="145" fontSize="10" fill="#fbbf24" fontWeight="bold">충돌!</text>
                              </g>
                              
                              {/* 이온화 결과 - 이온과 전자 - 충돌 후 */}
                              {(autoPlay && icpStep === 4 && progress > 0.8) || (!autoPlay) ? (
                                <>
                                  <circle cx="195" cy="155" r="3" fill="#ef4444"/>
                                  <text x="185" y="150" fontSize="8" fill="#ef4444">+</text>
                                  <circle cx="205" cy="165" r="2" fill="#3b82f6"/>
                                  <text x="200" y="160" fontSize="8" fill="#3b82f6">-</text>
                                  
                                  <circle cx="275" cy="245" r="3" fill="#ef4444"/>
                                  <text x="270" y="240" fontSize="8" fill="#ef4444">+</text>
                                  <circle cx="265" cy="255" r="2" fill="#3b82f6"/>
                                  <text x="260" y="250" fontSize="8" fill="#3b82f6">-</text>
                                </>
                              ) : null}
                              
                              <text x="350" y="280" fontSize="12" fill="#ef4444" fontWeight="bold"
                                    opacity={autoPlay && icpStep === 4 ? Math.max(0, Math.min(1, (progress - 0.7) * 5)) : 1}>
                                이온화!
                              </text>
                              <text x="340" y="295" fontSize="10" fill="#374151"
                                    opacity={autoPlay && icpStep === 4 ? Math.max(0, Math.min(1, (progress - 0.85) * 10)) : 1}>
                                중성원자 → 이온⁺ + 전자⁻
                              </text>
                            </>
                          )}
                          
                          {/* 챔버 경계 - 항상 표시 */}
                          <rect x="150" y="120" width="200" height="200" fill="none" stroke="#374151" strokeWidth="2" strokeDasharray="5,5"/>
                          <text x="360" y="135" fontSize="10" fill="#374151">플라즈마 챔버</text>
                        </>
                      );
                    })()}
                  </svg>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>핵심 원리:</strong> ICP는 RF 코일의 시변 자기장이 전자의 자이로모션을 유도하여 
                    효율적인 이온화를 달성하는 방식입니다. 전자의 궤도가 길어져 충돌 확률이 높아집니다.
                  </p>
                </div>
              </div>

              {/* ICP 실제 구조 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-green-800 mb-4">2. ICP 실제 구조</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <svg width="100%" height="300" viewBox="0 0 400 300">
                    {/* Source RF */}
                    <circle cx="80" cy="60" r="15" fill="none" stroke="#059669" strokeWidth="2"/>
                    <path d="M68,60 Q74,53 80,60 Q86,67 92,60" fill="none" stroke="#059669" strokeWidth="2"/>
                    <text x="30" y="30" fontSize="12" fill="#059669" fontWeight="bold">Source RF</text>
                    
                    {/* 유도 코일들 */}
                    <text x="150" y="40" fontSize="12" fill="#059669" fontWeight="bold">Inductive coils</text>
                    <circle cx="140" cy="60" r="3" fill="#059669"/>
                    <circle cx="160" cy="60" r="3" fill="#059669"/>
                    <circle cx="180" cy="60" r="3" fill="#059669"/>
                    <circle cx="220" cy="60" r="3" fill="#059669"/>
                    <circle cx="240" cy="60" r="3" fill="#059669"/>
                    <circle cx="260" cy="60" r="3" fill="#059669"/>
                    
                    {/* 세라믹 커버 */}
                    <rect x="120" y="80" width="160" height="10" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" rx="5"/>
                    <text x="290" y="70" fontSize="10" fill="#3b82f6" fontWeight="bold">Ceramic</text>
                    <text x="295" y="85" fontSize="10" fill="#3b82f6" fontWeight="bold">cover</text>
                    
                    {/* 챔버 */}
                    <rect x="100" y="90" width="200" height="120" fill="none" stroke="#374151" strokeWidth="3"/>
                    <text x="40" y="150" fontSize="12" fill="#374151" fontWeight="bold">Chamber</text>
                    <text x="50" y="165" fontSize="12" fill="#374151" fontWeight="bold">body</text>
                    
                    {/* 챔버 체적 정보 */}
                    <text x="310" y="105" fontSize="10" fill="#374151" fontWeight="bold">체적: 3.8L</text>
                    <text x="310" y="118" fontSize="9" fill="#666">∅200×120mm</text>
                    <text x="310" y="130" fontSize="9" fill="#666">π×10²×12cm</text>
                    
                    {/* 플라즈마 */}
                    <ellipse cx="200" cy="130" rx="60" ry="20" fill="#f97316" opacity="0.7"/>
                    <text x="200" y="135" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">Plasma</text>
                    
                    {/* 웨이퍼 */}
                    <rect x="170" y="180" width="60" height="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1"/>
                    <text x="300" y="185" fontSize="10" fill="#3b82f6" fontWeight="bold">Wafer</text>
                    
                    {/* E-chuck */}
                    <rect x="150" y="190" width="100" height="15" fill="#374151"/>
                    <text x="40" y="200" fontSize="12" fill="#374151" fontWeight="bold">E-chuck</text>
                    
                    {/* Helium */}
                    <line x1="200" y1="205" x2="200" y2="230" stroke="#10b981" strokeWidth="2"/>
                    <text x="160" y="245" fontSize="12" fill="#10b981" fontWeight="bold">Helium</text>
                    
                    {/* Bias RF */}
                    <circle cx="300" cy="250" r="15" fill="none" stroke="#dc2626" strokeWidth="2"/>
                    <path d="M288,250 Q294,243 300,250 Q306,257 312,250" fill="none" stroke="#dc2626" strokeWidth="2"/>
                    <text x="320" y="245" fontSize="12" fill="#dc2626" fontWeight="bold">Bias RF</text>
                    
                    {/* 연결선들 */}
                    <line x1="80" y1="75" x2="80" y2="100" stroke="#059669" strokeWidth="2"/>
                    <line x1="80" y1="100" x2="140" y2="100" stroke="#059669" strokeWidth="2"/>
                    <line x1="140" y1="100" x2="140" y2="63" stroke="#059669" strokeWidth="2"/>
                    
                    <line x1="285" y1="250" x2="250" y2="250" stroke="#dc2626" strokeWidth="2"/>
                    <line x1="250" y1="250" x2="250" y2="205" stroke="#dc2626" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>핵심 특징:</strong> Source RF (플라즈마 생성)와 Bias RF (이온 에너지 제어)가 
                    독립적으로 분리되어 있어 정밀한 제어가 가능합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 독립적 제어 시뮬레이션 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">ICP의 핵심: 독립적 제어</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Source RF Power: {(rfPower * 2).toFixed(0)} W (플라즈마 밀도 제어)
                    </label>
                    <input 
                      type="range" 
                      min="50" 
                      max="500" 
                      step="10" 
                      value={rfPower * 2} 
                      onChange={(e) => setRfPower(parseInt(e.target.value) / 2)} 
                      className="w-full h-3 bg-green-200 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Bias RF Power: {etchPower} W (이온 에너지 제어)
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="300" 
                      step="10" 
                      value={etchPower} 
                      onChange={(e) => setEtchPower(parseInt(e.target.value))} 
                      className="w-full h-3 bg-red-200 rounded-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">플라즈마 밀도</div>
                      <div className="text-xl font-bold text-green-700">
                        {(5e9 * Math.pow(rfPower * 2 / 100, 2.0)).toExponential(1)} cm⁻³
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">이온 에너지</div>
                      <div className="text-xl font-bold text-red-700">
                        {(etchPower * 0.3 + 10 - (rfPower * 2 - 200) * 0.05).toFixed(0)} eV
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Self Bias Voltage</div>
                      <div className="text-xl font-bold text-purple-700">
                        -{(15 * Math.sqrt(etchPower / 10)).toFixed(0)} V
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">ICP의 장점</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• <strong>독립 제어:</strong> 플라즈마 밀도 ↔ 이온 에너지</li>
                      <li>• <strong>고밀도 플라즈마:</strong> 10¹¹~10¹² cm⁻³</li>
                      <li>• <strong>저압 동작:</strong> 0.5~50 mTorr</li>
                      <li>• <strong>높은 식각률:</strong> CCP 대비 3~5배</li>
                      <li>• <strong>낮은 손상:</strong> 이온 에너지 최적화</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">실시간 공정 결과</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>식각률: <span className="font-bold text-blue-600">
                        {(Math.pow(rfPower * 2 / 100, 0.6) * Math.pow(etchPower / 100, 0.4) * 150).toFixed(0)} Å/min
                      </span></div>
                      <div>이온화율: <span className="font-bold text-green-600">
                        {(Math.pow(rfPower * 2 / 500, 0.5) * 0.1).toFixed(3)}
                      </span></div>
                      <div>선택비: <span className="font-bold text-purple-600">
                        {(15 - etchPower / 50).toFixed(1)}:1
                      </span></div>
                      <div>균일도: <span className="font-bold text-orange-600">
                        {(98 - Math.abs(rfPower - 100) / 10).toFixed(1)}%
                      </span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 플라즈마 밀도와 바이어스의 관계 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">플라즈마 밀도와 바이어스의 반비례 관계</h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-800 mb-3">물리적 메커니즘</h4>
                    <div className="space-y-2 text-blue-700 text-sm">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        <span>플라즈마 밀도 ↑ → 전자 온도 ↓</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        <span>전자 온도 ↓ → 플라즈마 전위 ↓</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        <span>플라즈마 전위 ↓ → 바이어스 전압 ↓</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                      <strong>핵심:</strong> 같은 에너지를 더 많은 입자가 나눠가지면 개별 입자의 에너지가 감소
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-800 mb-3">쉬운 비유: 물의 압력과 분산</h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border-l-2 border-red-400">
                        <div className="font-medium text-red-700 mb-1">CCP (낮은 밀도)</div>
                        <div className="text-red-600 text-sm">좁은 호스 → 높은 압력 → 강한 충격</div>
                      </div>
                      <div className="bg-white p-3 rounded border-l-2 border-green-400">
                        <div className="font-medium text-green-700 mb-1">ICP (높은 밀도)</div>
                        <div className="text-green-600 text-sm">넓은 샤워헤드 → 분산된 압력 → 부드러운 충격</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-800 mb-3">실제 공정에서의 장점</h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded">
                        <div className="font-medium text-purple-700 mb-1">데미지 최소화</div>
                        <div className="text-purple-600 text-sm">이온 에너지 감소로 기판 손상 방지</div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="font-medium text-purple-700 mb-1">선택적 식각</div>
                        <div className="text-purple-600 text-sm">원하지 않는 물질의 손상 최소화</div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="font-medium text-purple-700 mb-1">표면 품질</div>
                        <div className="text-purple-600 text-sm">매끄럽고 정밀한 식각면 확보</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-800 mb-3">CCP vs ICP 비교</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="text-orange-700 font-medium">압력</span>
                        <span className="text-orange-600">CCP: 높음 → ICP: 낮음</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="text-orange-700 font-medium">밀도</span>
                        <span className="text-orange-600">CCP: 낮음 → ICP: 높음</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="text-orange-700 font-medium">이온 충격</span>
                        <span className="text-orange-600">CCP: 강함 → ICP: 부드러움</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-800">
                      <strong>결론:</strong> ICP는 "강하면서도 부드러운" 공정 구현
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-300">
                <h4 className="font-semibold text-indigo-800 mb-2">시뮬레이터에서 확인해보세요!</h4>
                <p className="text-indigo-700 text-sm">
                  Source RF를 450W 이상으로 올려서 고밀도 플라즈마를 만들어보세요. 
                  같은 Bias RF에서도 상대적으로 낮은 Self Bias Voltage와 이온 에너지를 확인할 수 있습니다.
                  이것이 바로 ICP가 정밀한 반도체 공정에서 선호되는 이유입니다.
                </p>
              </div>
            </div>

            {/* 비교 표 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">CCP vs ICP 시스템 비교</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">특성</th>
                      <th className="px-4 py-3 text-center font-semibold text-blue-900">CCP</th>
                      <th className="px-4 py-3 text-center font-semibold text-green-900">ICP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">플라즈마 생성 방식</td>
                      <td className="px-4 py-3 text-center text-blue-800">용량결합 (전기장)</td>
                      <td className="px-4 py-3 text-center text-green-800">유도결합 (자기장)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium">플라즈마 밀도 (cm⁻³)</td>
                      <td className="px-4 py-3 text-center text-blue-800">10⁹ ~ 10¹¹</td>
                      <td className="px-4 py-3 text-center text-green-800">10¹⁰ ~ 10¹²</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">작동 압력 (mTorr)</td>
                      <td className="px-4 py-3 text-center text-blue-800">50 ~ 1000</td>
                      <td className="px-4 py-3 text-center text-green-800">0.5 ~ 50</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium">이온화율</td>
                      <td className="px-4 py-3 text-center text-blue-800">10⁻⁶ ~ 10⁻³</td>
                      <td className="px-4 py-3 text-center text-green-800">10⁻⁴ ~ 10⁻¹</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">독립적 제어</td>
                      <td className="px-4 py-3 text-center text-red-600">불가능</td>
                      <td className="px-4 py-3 text-center text-green-600">가능</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium">구조 복잡도</td>
                      <td className="px-4 py-3 text-center text-blue-800">단순</td>
                      <td className="px-4 py-3 text-center text-green-800">복잡</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 추가로 생각해보기 */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🤔 추가로 생각해보기</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-2">토의 주제 1</h4>
                  <p className="text-blue-700 text-sm">
                    <strong>ICP의 독립적 제어가 완벽할까?</strong><br/>
                    Source RF와 Bias RF가 정말 완전히 독립적일까요? 실제로는 어떤 상호작용이 있을 수 있는지, 
                    그리고 이런 상호작용이 공정에 미치는 영향을 토의해보세요.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-2">토의 주제 2</h4>
                  <p className="text-green-700 text-sm">
                    <strong>고밀도 플라즈마의 양면성</strong><br/>
                    ICP의 고밀도 플라즈마는 장점만 있을까요? 높은 플라즈마 밀도로 인해 발생할 수 있는 
                    부작용이나 한계점은 무엇인지 생각해보세요.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-2">토의 주제 3</h4>
                  <p className="text-purple-700 text-sm">
                    <strong>비용 대비 효과 분석</strong><br/>
                    ICP 장비는 CCP보다 비싸고 복잡합니다. 어떤 상황에서 ICP의 고성능이 
                    추가 비용을 정당화할 수 있는지 구체적인 예를 들어 토의해보세요.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">토의 주제 4</h4>
                  <p className="text-orange-700 text-sm">
                    <strong>차세대 플라즈마 기술</strong><br/>
                    ICP 기술이 계속 발전한다면, 10년 후에는 어떤 모습일까요? 
                    원자층 식각(ALE)이나 AI 제어 같은 신기술과 어떻게 융합될 수 있을지 상상해보세요.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>💡 토의 팁:</strong> 각 주제에 대해 찬반 의견을 나누어 토론하거나, 
                  실제 산업 현장의 사례를 조사해서 발표해보세요. 이론과 실무의 차이점을 
                  찾아보는 것도 좋은 학습 방법입니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTheme === 'quiz' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-green-900 mb-4">📝 플라즈마 공정 개념 확인 퀴즈</h2>
              <p className="text-green-700 mb-2">지금까지 학습한 플라즈마 공정 내용을 퀴즈를 통해 확인해보세요.</p>
              <div className="text-sm text-green-600 bg-green-100 rounded-lg p-3">
                <strong>구성:</strong> 각 난이도별 하드웨어 7문제 + 공정 3문제 = 총 10문제씩 (4지선다형)
              </div>
            </div>

            {!quizStarted && !showResults && (
              <div className="bg-white rounded-xl shadow-lg p-8 border text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">퀴즈를 시작하시겠습니까?</h3>
                
                {/* 난이도 선택 */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-700 mb-4">난이도 선택:</h4>
                  <div className="flex justify-center space-x-4">
                    {['하', '중', '상'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          difficulty === level
                            ? level === '하' ? 'bg-blue-500 text-white' :
                              level === '중' ? 'bg-yellow-500 text-white' :
                              'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {level}급
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    {difficulty === '하' && '기본 개념과 용어 정의 (입문자)'}
                    {difficulty === '중' && '기본 원리 이해와 간단한 응용 (중급자)'}
                    {difficulty === '상' && '복합적 현상 분석과 실무 적용 (고급자)'}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">하드웨어 문제 (7문제)</h4>
                    <ul className="text-blue-700 text-sm text-left space-y-1">
                      {difficulty === '하' && (
                        <>
                          <li>• ICP, CCP, ECR 기본 개념</li>
                          <li>• 플라즈마 기본 용어</li>
                          <li>• 장비별 특징</li>
                        </>
                      )}
                      {difficulty === '중' && (
                        <>
                          <li>• ICP vs CCP 차이점</li>
                          <li>• 플라즈마 밀도와 이온 에너지</li>
                          <li>• 자이로모션과 임피던스 매칭</li>
                        </>
                      )}
                      {difficulty === '상' && (
                        <>
                          <li>• 복합적 현상 분석</li>
                          <li>• 웨이퍼 크기 변화 영향</li>
                          <li>• HAR Via 문제 해결</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">공정 문제 (3문제)</h4>
                    <ul className="text-orange-700 text-sm text-left space-y-1">
                      {difficulty === '하' && (
                        <>
                          <li>• 드라이 에칭 기본 개념</li>
                          <li>• 기본 가스 종류</li>
                          <li>• 애싱 공정</li>
                        </>
                      )}
                      {difficulty === '중' && (
                        <>
                          <li>• 가스 혼합 효과</li>
                          <li>• Synergy Effect</li>
                          <li>• 재료별 식각 특성</li>
                        </>
                      )}
                      {difficulty === '상' && (
                        <>
                          <li>• 복합 가스 상호작용</li>
                          <li>• Low-k 재료 손상</li>
                          <li>• 공정 최적화 전략</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={startQuiz}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {difficulty}급 퀴즈 시작하기
                </button>
              </div>
            )}

            {quizStarted && !showResults && getCurrentQuestions().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    문제 {currentQuestion + 1} / {getCurrentQuestions().length}
                  </h3>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      getCurrentQuestions()[currentQuestion]?.category === '하드웨어' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {getCurrentQuestions()[currentQuestion]?.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      difficulty === '하' ? 'bg-blue-100 text-blue-800' :
                      difficulty === '중' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {difficulty}급
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {getCurrentQuestions()[currentQuestion]?.question}
                  </h4>
                  
                  <div className="space-y-3">
                    {getCurrentQuestions()[currentQuestion]?.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(getCurrentQuestions()[currentQuestion].id, index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          userAnswers[getCurrentQuestions()[currentQuestion].id] === index
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                        }`}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </button>
                    )) || []}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    진행률: {Math.round(((currentQuestion + 1) / getCurrentQuestions().length) * 100)}%
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    disabled={userAnswers[getCurrentQuestions()[currentQuestion]?.id] === undefined}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      userAnswers[getCurrentQuestions()[currentQuestion]?.id] !== undefined
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestion === getCurrentQuestions().length - 1 ? '결과 확인' : '다음 문제'}
                  </button>
                </div>
              </div>
            )}

            {showResults && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">퀴즈 완료!</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${
                    difficulty === '하' ? 'bg-blue-100 text-blue-800' :
                    difficulty === '중' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {difficulty}급 난이도
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    <span className="text-green-600">{calculateScore()}</span>
                    <span className="text-gray-400">/{getCurrentQuestions().length}</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    정답률: {Math.round((calculateScore() / getCurrentQuestions().length) * 100)}%
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      다시 풀기
                    </button>
                    <button
                      onClick={() => {
                        resetQuiz();
                        setDifficulty(difficulty === '하' ? '중' : difficulty === '중' ? '상' : '하');
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {difficulty === '하' ? '중급' : difficulty === '중' ? '상급' : '하급'} 도전
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">정답 및 해설</h4>
                  <div className="space-y-6">
                    {getCurrentQuestions().map((question, index) => (
                      <div key={question.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900">
                            {index + 1}. {question.question}
                          </h5>
                          <span className={`ml-4 px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                            userAnswers[question.id] === question.correct
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userAnswers[question.id] === question.correct ? '정답' : '오답'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>정답:</strong> {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                        </div>
                        {userAnswers[question.id] !== question.correct && (
                          <div className="text-sm text-red-600 mb-2">
                            <strong>선택한 답:</strong> {userAnswers[question.id] !== undefined ? 
                              `${String.fromCharCode(65 + userAnswers[question.id])}. ${question.options[userAnswers[question.id]]}` 
                              : '미선택'}
                          </div>
                        )}
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          <strong>해설:</strong> {question.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTheme === 'etching-process' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-orange-900 mb-4">⚙️ 플라즈마 식각 원리 및 공정 변수</h2>
              <p className="text-orange-700 mb-2">플라즈마 식각의 핵심인 Synergy Effect와 다양한 공정 변수들을 학습합니다.</p>
              <div className="text-sm text-orange-600 bg-orange-100 rounded-lg p-3"><strong>핵심 학습:</strong> 화학반응 + 물리반응 = 상승효과, 공정 변수 최적화, 장비별 식각 특성</div>
            </div>

            {/* Synergy Effect 시뮬레이션 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Synergy Effect 실험 시뮬레이션</h3>
              
              {/* 실험 조건 선택 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">실험 조건 선택:</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setEtchGasType('XeF2')}
                    className={`p-4 rounded-lg border-2 transition-all ${etchGasType === 'XeF2' ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="font-bold">XeF2 gas only</div>
                    <div className="text-sm mt-1">화학반응만</div>
                    <div className="text-xs mt-1">Isotropic, High Selectivity</div>
                  </button>
                  
                  <button 
                    onClick={() => setEtchGasType('Synergy')}
                    className={`p-4 rounded-lg border-2 transition-all ${etchGasType === 'Synergy' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="font-bold">Ar+ + XeF2</div>
                    <div className="text-sm mt-1">화학+물리 상승효과</div>
                    <div className="text-xs mt-1">High Rate, Good Profile</div>
                  </button>
                  
                  <button 
                    onClick={() => setEtchGasType('Ar')}
                    className={`p-4 rounded-lg border-2 transition-all ${etchGasType === 'Ar' ? 'bg-purple-100 border-purple-500 text-purple-800' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="font-bold">Ar+ ion only</div>
                    <div className="text-sm mt-1">물리반응만</div>
                    <div className="text-xs mt-1">Anisotropic, Low Selectivity</div>
                  </button>
                </div>
              </div>

              {/* 실험 결과 그래프 */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">실시간 식각률 그래프</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={(() => {
                          const baseData = [
                            {time: 0, rate: 0.5},
                            {time: 100, rate: 0.5},
                            {time: 150, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 7.0 : 0.1},
                            {time: 200, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 7.0 : 3.0},
                            {time: 300, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 6.5 : 3.0},
                            {time: 400, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 6.2 : 2.8},
                            {time: 500, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 6.0 : 2.5},
                            {time: 600, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 5.8 : 2.2},
                            {time: 650, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 3.0 : 2.0},
                            {time: 700, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 2.0 : 1.5},
                            {time: 750, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 0.8 : 0.8},
                            {time: 800, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 0.5 : 0.5},
                            {time: 900, rate: etchGasType === 'XeF2' ? 0.5 : etchGasType === 'Synergy' ? 0.5 : 0.5}
                          ];
                          return baseData;
                        })()}
                        margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="time" 
                          label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                          domain={[0, 900]}
                        />
                        <YAxis 
                          domain={[0, 8]} 
                          label={{ value: 'Si etch rate (nm/min)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip formatter={(value) => [`${value} nm/min`, 'Etch Rate']} />
                        
                        {/* 단계별 구분선 */}
                        <ReferenceLine x={150} stroke="#3b82f6" strokeDasharray="3 3" />
                        <ReferenceLine x={650} stroke="#10b981" strokeDasharray="3 3" />
                        
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke={etchGasType === 'XeF2' ? '#3b82f6' : etchGasType === 'Synergy' ? '#10b981' : '#9333ea'} 
                          strokeWidth={4} 
                          name="식각률"
                          dot={{ fill: etchGasType === 'XeF2' ? '#3b82f6' : etchGasType === 'Synergy' ? '#10b981' : '#9333ea', strokeWidth: 2, r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* 단계 표시 */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <div className="font-bold text-blue-800">0-150s</div>
                      <div className="text-blue-600">XeF₂ gas only</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <div className="font-bold text-green-800">150-650s</div>
                      <div className="text-green-600">Ar⁺ + XeF₂</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded text-center">
                      <div className="font-bold text-purple-800">650-900s</div>
                      <div className="text-purple-600">Ar⁺ ion only</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">현재 조건 분석</h4>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${
                      etchGasType === 'XeF2' ? 'bg-blue-50 border-blue-300' : 
                      etchGasType === 'Synergy' ? 'bg-green-50 border-green-300' : 
                      'bg-purple-50 border-purple-300'
                    }`}>
                      <div className={`font-bold text-lg ${
                        etchGasType === 'XeF2' ? 'text-blue-800' : 
                        etchGasType === 'Synergy' ? 'text-green-800' : 
                        'text-purple-800'
                      }`}>
                        현재 식각률: {
                          etchGasType === 'XeF2' ? '0.5' : 
                          etchGasType === 'Synergy' ? '7.0' : 
                          '3.0'
                        } nm/min
                      </div>
                      <div className={`text-sm mt-2 ${
                        etchGasType === 'XeF2' ? 'text-blue-700' : 
                        etchGasType === 'Synergy' ? 'text-green-700' : 
                        'text-purple-700'
                      }`}>
                        {etchGasType === 'Synergy' && (
                          <div>
                            <strong>상승 효과:</strong> Ar⁺ 이온이 Si 표면의 결합을 약화시키고, XeF₂가 이를 
                            효과적으로 제거합니다. 두 효과가 합쳐져 14배 이상의 식각률 증가를 보입니다!
                          </div>
                        )}
                        {etchGasType === 'Ar' && (
                          <div>
                            <strong>물리 반응:</strong> Ar⁺ 이온이 Si 원자를 물리적으로 스퍼터링합니다. 
                            이방성은 우수하지만 선택비가 낮고 손상을 유발할 수 있습니다.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600">Profile</div>
                        <div className="font-bold text-gray-800">
                          {etchGasType === 'XeF2' ? 'Isotropic' : 
                           etchGasType === 'Synergy' ? 'Anisotropic' : 
                           'Highly Anisotropic'}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-gray-600">Selectivity</div>
                        <div className="font-bold text-gray-800">
                          {etchGasType === 'XeF2' ? 'Excellent' : 
                           etchGasType === 'Synergy' ? 'Good' : 
                           'Poor'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 식각 메커니즘 비교 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">식각 메커니즘 상세 비교</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-3">화학 식각 (Chemical)</h4>
                  <div className="space-y-2 text-blue-700 text-sm">
                    <div><strong>메커니즘:</strong> 라디칼 + 표면 → 휘발성 화합물</div>
                    <div><strong>특징:</strong> 높은 선택비, 등방성</div>
                    <div><strong>장점:</strong> 표면 손상 최소화</div>
                    <div><strong>단점:</strong> 낮은 식각률, 패턴 왜곡</div>
                    <div><strong>예시:</strong> XeF₂ + Si → SiF₄ + Xe</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-3">상승 효과 (Synergy)</h4>
                  <div className="space-y-2 text-green-700 text-sm">
                    <div><strong>메커니즘:</strong> 이온이 결합 약화 → 라디칼이 제거</div>
                    <div><strong>특징:</strong> 매우 높은 식각률</div>
                    <div><strong>장점:</strong> 속도↑, 이방성↑, 선택비 양호</div>
                    <div><strong>단점:</strong> 복잡한 제어 필요</div>
                    <div><strong>효과:</strong> 1 + 1 = 14 (상승효과!)</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-3">물리 식각 (Physical)</h4>
                  <div className="space-y-2 text-purple-700 text-sm">
                    <div><strong>메커니즘:</strong> 이온 충돌로 원자 방출</div>
                    <div><strong>특징:</strong> 높은 이방성, 낮은 선택비</div>
                    <div><strong>장점:</strong> 방향성 우수</div>
                    <div><strong>단점:</strong> 표면 손상, 재증착</div>
                    <div><strong>예시:</strong> Ar⁺ + Si → Si + Ar</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 실제 공정 조건 시뮬레이션 */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">공정 조건 최적화</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RF 파워: {etchPower} W</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="500" 
                      step="10" 
                      value={etchPower} 
                      onChange={(e) => setEtchPower(parseInt(e.target.value))} 
                      className="w-full h-2 bg-orange-200 rounded-lg" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">압력: {etchPressure} mTorr</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      step="1" 
                      value={etchPressure} 
                      onChange={(e) => setEtchPressure(parseInt(e.target.value))} 
                      className="w-full h-2 bg-orange-200 rounded-lg" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">공정 가스</label>
                    <select 
                      value={etchGasType === 'XeF2' || etchGasType === 'Synergy' || etchGasType === 'Ar' ? 'CF4' : etchGasType} 
                      onChange={(e) => setEtchGasType(e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="CF4">CF₄ (실리콘 식각)</option>
                      <option value="Cl2">Cl₂ (금속 식각)</option>
                      <option value="O2">O₂ (유기물 제거)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">패턴 밀도: {patternDensity}%</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5" 
                      value={patternDensity} 
                      onChange={(e) => setPatternDensity(parseInt(e.target.value))} 
                      className="w-full h-2 bg-orange-200 rounded-lg" 
                    />
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-3">실시간 공정 결과</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">식각률:</span>
                      <div className="font-semibold text-orange-900">{calculateEtchRate()} Å/min</div>
                    </div>
                    <div>
                      <span className="text-gray-600">선택비:</span>
                      <div className="font-semibold text-orange-900">{calculateSelectivity()}:1</div>
                    </div>
                    <div>
                      <span className="text-gray-600">균일도:</span>
                      <div className="font-semibold text-orange-900">{(95 - Math.abs(etchPower - 200)/10 - Math.abs(etchPressure - 10)/2).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">이방성:</span>
                      <div className="font-semibold text-orange-900">{(Math.min(95, etchPower/5 + 60 - etchPressure/2)).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 식각 대상 물질별 상세 조건 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">식각 대상 물질별 상세 메커니즘 및 조건</h3>
              
              {/* 실리콘 계열 */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">💎</span>
                  실리콘 계열 물질
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-blue-300">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="border border-blue-300 px-3 py-2 text-left">물질</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">에칭 가스</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">플라즈마 분해산물</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">에칭 메커니즘</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">휘발성 생성물</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-blue-300 px-3 py-2 font-medium">Si (실리콘)</td>
                        <td className="border border-blue-300 px-3 py-2">CF₄, SF₆</td>
                        <td className="border border-blue-300 px-3 py-2">F*, CF₃*, CF₂*</td>
                        <td className="border border-blue-300 px-3 py-2">F 라디칼이 Si-Si 결합을 공격하여 Si-F 결합 형성</td>
                        <td className="border border-blue-300 px-3 py-2">SiF₄ (기체)</td>
                      </tr>
                      <tr className="bg-blue-25">
                        <td className="border border-blue-300 px-3 py-2 font-medium">SiO₂ (이산화실리콘)</td>
                        <td className="border border-blue-300 px-3 py-2">CHF₃, C₄F₈</td>
                        <td className="border border-blue-300 px-3 py-2">F*, CF₂*, CHF₂*</td>
                        <td className="border border-blue-300 px-3 py-2">F가 Si-O를 공격, CF₂가 폴리머층 형성으로 선택비 향상</td>
                        <td className="border border-blue-300 px-3 py-2">SiF₄ + CO₂ + H₂O</td>
                      </tr>
                      <tr>
                        <td className="border border-blue-300 px-3 py-2 font-medium">Si₃N₄ (질화실리콘)</td>
                        <td className="border border-blue-300 px-3 py-2">CF₄/O₂, NF₃</td>
                        <td className="border border-blue-300 px-3 py-2">F*, O*, CF₃*</td>
                        <td className="border border-blue-300 px-3 py-2">F가 Si-N 결합 공격, O가 N 제거 촉진</td>
                        <td className="border border-blue-300 px-3 py-2">SiF₄ + N₂ + NOₓ</td>
                      </tr>
                      <tr className="bg-blue-25">
                        <td className="border border-blue-300 px-3 py-2 font-medium">Poly-Si (폴리실리콘)</td>
                        <td className="border border-blue-300 px-3 py-2">Cl₂/HBr, SF₆</td>
                        <td className="border border-blue-300 px-3 py-2">Cl*, Br*, F*</td>
                        <td className="border border-blue-300 px-3 py-2">할로겐이 결정립계 우선 공격하여 선택적 제거</td>
                        <td className="border border-blue-300 px-3 py-2">SiCl₄, SiBr₄, SiF₄</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 금속 계열 */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">⚡</span>
                  금속 계열 물질
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-green-300">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="border border-green-300 px-3 py-2 text-left">물질</th>
                        <th className="border border-green-300 px-3 py-2 text-left">에칭 가스</th>
                        <th className="border border-green-300 px-3 py-2 text-left">플라즈마 분해산물</th>
                        <th className="border border-green-300 px-3 py-2 text-left">에칭 메커니즘</th>
                        <th className="border border-green-300 px-3 py-2 text-left">휘발성 생성물</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-green-300 px-3 py-2 font-medium">Al (알루미늄)</td>
                        <td className="border border-green-300 px-3 py-2">Cl₂/BCl₃</td>
                        <td className="border border-green-300 px-3 py-2">Cl*, BCl₂*</td>
                        <td className="border border-green-300 px-3 py-2">Cl이 Al 산화막 관통 후 Al-Cl 결합 형성</td>
                        <td className="border border-green-300 px-3 py-2">AlCl₃ (승화성)</td>
                      </tr>
                      <tr className="bg-green-25">
                        <td className="border border-green-300 px-3 py-2 font-medium">Ti (티타늄)</td>
                        <td className="border border-green-300 px-3 py-2">Cl₂/SF₆</td>
                        <td className="border border-green-300 px-3 py-2">Cl*, F*, S*</td>
                        <td className="border border-green-300 px-3 py-2">고온에서 TiCl₄ 형성, F가 산화막 제거 촉진</td>
                        <td className="border border-green-300 px-3 py-2">TiCl₄, TiF₄</td>
                      </tr>
                      <tr>
                        <td className="border border-green-300 px-3 py-2 font-medium">W (텅스텐)</td>
                        <td className="border border-green-300 px-3 py-2">SF₆, NF₃</td>
                        <td className="border border-green-300 px-3 py-2">F*, SF₅*</td>
                        <td className="border border-green-300 px-3 py-2">상온에서도 WF₆ 형성 가능 (특수성)</td>
                        <td className="border border-green-300 px-3 py-2">WF₆ (상온 기체)</td>
                      </tr>
                      <tr className="bg-green-25">
                        <td className="border border-green-300 px-3 py-2 font-medium">Cu (구리)</td>
                        <td className="border border-green-300 px-3 py-2">Cl₂/Ar (저온)</td>
                        <td className="border border-green-300 px-3 py-2">Cl*, Ar⁺</td>
                        <td className="border border-green-300 px-3 py-2">CuCl₂ 형성 후 물리적 스퍼터링으로 제거</td>
                        <td className="border border-green-300 px-3 py-2">CuCl₂ (낮은 휘발성)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 유기물 계열 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">🧬</span>
                  유기물 계열 물질
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-purple-300">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="border border-purple-300 px-3 py-2 text-left">물질</th>
                        <th className="border border-purple-300 px-3 py-2 text-left">에칭 가스</th>
                        <th className="border border-purple-300 px-3 py-2 text-left">플라즈마 분해산물</th>
                        <th className="border border-purple-300 px-3 py-2 text-left">에칭 메커니즘</th>
                        <th className="border border-purple-300 px-3 py-2 text-left">휘발성 생성물</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-purple-300 px-3 py-2 font-medium">PR (포토레지스트)</td>
                        <td className="border border-purple-300 px-3 py-2">O₂/N₂</td>
                        <td className="border border-purple-300 px-3 py-2">O*, O₂*, OH*</td>
                        <td className="border border-purple-300 px-3 py-2">O 라디칼이 C-C, C-H 결합을 산화 분해</td>
                        <td className="border border-purple-300 px-3 py-2">CO₂ + H₂O + N₂</td>
                      </tr>
                      <tr className="bg-purple-25">
                        <td className="border border-purple-300 px-3 py-2 font-medium">Polymer (중합체)</td>
                        <td className="border border-purple-300 px-3 py-2">O₂/CF₄</td>
                        <td className="border border-purple-300 px-3 py-2">O*, F*, CF₃*</td>
                        <td className="border border-purple-300 px-3 py-2">O가 탄소 골격 파괴, F가 불소 함유 폴리머 공격</td>
                        <td className="border border-purple-300 px-3 py-2">CO₂ + H₂O + HF</td>
                      </tr>
                      <tr>
                        <td className="border border-purple-300 px-3 py-2 font-medium">Carbon (탄소막)</td>
                        <td className="border border-purple-300 px-3 py-2">O₂/H₂</td>
                        <td className="border border-purple-300 px-3 py-2">O*, H*, OH*</td>
                        <td className="border border-purple-300 px-3 py-2">H가 탄소 활성화, O가 산화반응 촉진</td>
                        <td className="border border-purple-300 px-3 py-2">CO₂ + H₂O + CH₄</td>
                      </tr>
                      <tr className="bg-purple-25">
                        <td className="border border-purple-300 px-3 py-2 font-medium">PI (폴리이미드)</td>
                        <td className="border border-purple-300 px-3 py-2">O₂/CF₄/Ar</td>
                        <td className="border border-purple-300 px-3 py-2">O*, F*, Ar⁺</td>
                        <td className="border border-purple-300 px-3 py-2">내열성 강해 물리+화학 병행, Ar로 표면 활성화</td>
                        <td className="border border-purple-300 px-3 py-2">CO₂ + H₂O + NOₓ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                <h5 className="font-semibold text-amber-800 mb-2">핵심 포인트</h5>
                <div className="grid md:grid-cols-3 gap-4 text-amber-700 text-sm">
                  <div>
                    <strong>실리콘 계열:</strong> 플루오르(F) 기반 화학 반응이 핵심. SiF₄가 상온에서 기체라는 점이 중요
                  </div>
                  <div>
                    <strong>금속 계열:</strong> 온도 의존성 높음. 휘발성 생성물의 증기압이 식각률 결정
                  </div>
                  <div>
                    <strong>유기물 계열:</strong> 산소(O) 기반 산화 반응. 완전 분해로 잔류물 없는 제거 가능
                  </div>
                </div>
              </div>
            </div>

            {/* 공정 최적화 가이드 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-4">공정 최적화 실무 가이드</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-orange-800 mb-2">식각률 향상 방법</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• RF 파워 증가 (이온 밀도 ↑)</li>
                      <li>• 적절한 가스 유량 비율 최적화</li>
                      <li>• 압력 조절 (MFP vs 밀도 균형)</li>
                      <li>• 기판 온도 조절 (반응 활성화)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-orange-800 mb-2">선택비 개선 방법</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• 화학적 식각 비율 증가</li>
                      <li>• 기판 온도 최적화</li>
                      <li>• 가스 혼합비 정밀 제어</li>
                      <li>• 폴리머 형성 조건 활용</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-orange-800 mb-2">이방성 향상 방법</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• 압력 낮춤 (MFP 증가)</li>
                      <li>• RF 파워 적절히 증가</li>
                      <li>• 측벽 보호막 형성 가스 추가</li>
                      <li>• 바이어스 전압 최적화</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-orange-800 mb-2">균일도 개선 방법</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• 가스 분배 시스템 최적화</li>
                      <li>• 전극 간격 및 형태 조정</li>
                      <li>• 온도 분포 균일화</li>
                      <li>• 플라즈마 밀도 분포 제어</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTheme === 'equipment-application' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-red-900 mb-4">🏭 플라즈마 장비 종류 및 응용</h2>
              <p className="text-red-700 mb-2">다양한 플라즈마 장비의 특성과 산업 응용 분야를 학습합니다.</p>
              <div className="text-sm text-red-600 bg-red-100 rounded-lg p-3"><strong>학습 포인트:</strong> 장비별 특성 비교, 응용 분야별 최적 장비 선택, 미래 기술 동향</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-red-800 mb-6">플라즈마 장비 특성 비교</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">장비 타입</th>
                      <th className="px-4 py-3 text-center font-semibold">플라즈마 밀도</th>
                      <th className="px-4 py-3 text-center font-semibold">이방성</th>
                      <th className="px-4 py-3 text-center font-semibold">균일도</th>
                      <th className="px-4 py-3 text-center font-semibold">주요 응용</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">CCP (평행평판)</td>
                      <td className="px-4 py-3 text-center">중간</td>
                      <td className="px-4 py-3 text-center">중간</td>
                      <td className="px-4 py-3 text-center">높음</td>
                      <td className="px-4 py-3 text-center">일반 식각</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium">RIE</td>
                      <td className="px-4 py-3 text-center">중간</td>
                      <td className="px-4 py-3 text-center">높음</td>
                      <td className="px-4 py-3 text-center">높음</td>
                      <td className="px-4 py-3 text-center">미세패턴 식각</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">ICP</td>
                      <td className="px-4 py-3 text-center">매우 높음</td>
                      <td className="px-4 py-3 text-center">매우 높음</td>
                      <td className="px-4 py-3 text-center">매우 높음</td>
                      <td className="px-4 py-3 text-center">고속 정밀 식각</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium">ECR</td>
                      <td className="px-4 py-3 text-center">높음</td>
                      <td className="px-4 py-3 text-center">높음</td>
                      <td className="px-4 py-3 text-center">높음</td>
                      <td className="px-4 py-3 text-center">정밀 식각</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 산업별 응용 분야 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-red-800 mb-4">산업별 플라즈마 응용 분야</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">💻</span>
                    반도체 제조
                  </h4>
                  <div className="space-y-2 text-blue-700 text-sm">
                    <div><strong>식각:</strong> Via, Trench, Gate 형성</div>
                    <div><strong>증착:</strong> PECVD, 절연막/금속막</div>
                    <div><strong>세정:</strong> 웨이퍼 표면 처리</div>
                    <div><strong>애싱:</strong> PR 제거, 잔류물 제거</div>
                    <div><strong>장비:</strong> ICP, RIE, CCP</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">📱</span>
                    디스플레이
                  </h4>
                  <div className="space-y-2 text-green-700 text-sm">
                    <div><strong>FPD:</strong> TFT-LCD, OLED 제조</div>
                    <div><strong>식각:</strong> ITO, 금속 배선</div>
                    <div><strong>증착:</strong> 유기막, 보호막</div>
                    <div><strong>세정:</strong> 기판 청정화</div>
                    <div><strong>장비:</strong> 대면적 CCP, ICP</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🏭</span>
                    산업 소재
                  </h4>
                  <div className="space-y-2 text-purple-700 text-sm">
                    <div><strong>표면처리:</strong> 내마모성, 내식성</div>
                    <div><strong>코팅:</strong> 하드코팅, DLC</div>
                    <div><strong>접착성:</strong> 플라스틱 표면 개질</div>
                    <div><strong>세정:</strong> 정밀 부품 청정화</div>
                    <div><strong>장비:</strong> 대기압 플라즈마, CCP</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🏥</span>
                    의료/바이오
                  </h4>
                  <div className="space-y-2 text-orange-700 text-sm">
                    <div><strong>멸균:</strong> 의료기기, 포장재</div>
                    <div><strong>표면개질:</strong> 생체적합성 향상</div>
                    <div><strong>상처치료:</strong> 콜드 플라즈마</div>
                    <div><strong>진단:</strong> 바이오칩, 센서</div>
                    <div><strong>장비:</strong> 저온 플라즈마, 대기압</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🌱</span>
                    환경/에너지
                  </h4>
                  <div className="space-y-2 text-cyan-700 text-sm">
                    <div><strong>대기정화:</strong> VOC, NOx 분해</div>
                    <div><strong>수처리:</strong> 오염물질 분해</div>
                    <div><strong>태양전지:</strong> Si 식각, 텍스처링</div>
                    <div><strong>연료전지:</strong> 전극 제조</div>
                    <div><strong>장비:</strong> DBD, 마이크로파</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🔬</span>
                    분석/연구
                  </h4>
                  <div className="space-y-2 text-yellow-700 text-sm">
                    <div><strong>ICP-MS:</strong> 극미량 원소 분석</div>
                    <div><strong>ICP-OES:</strong> 원소 정량 분석</div>
                    <div><strong>플라즈마 CVD:</strong> 나노소재 합성</div>
                    <div><strong>핵융합:</strong> 토카막, 플라즈마 물리</div>
                    <div><strong>장비:</strong> 분석용 ICP, 연구용 장치</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 장비 선택 가이드 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-red-800 mb-4">응용 목적별 최적 장비 선택 가이드</h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">🎯 고정밀 미세 가공</h4>
                    <div className="space-y-2 text-blue-700 text-sm">
                      <div><strong>요구사항:</strong> 높은 이방성, 정밀 치수 제어</div>
                      <div><strong>추천 장비:</strong> ICP, RIE</div>
                      <div><strong>핵심 파라미터:</strong> 저압, 고 RF 파워</div>
                      <div><strong>응용 예:</strong> 반도체 Via, TSV, MEMS</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">🏭 대량 생산</h4>
                    <div className="space-y-2 text-green-700 text-sm">
                      <div><strong>요구사항:</strong> 높은 처리량, 균일도</div>
                      <div><strong>추천 장비:</strong> 대면적 CCP, ICP</div>
                      <div><strong>핵심 파라미터:</strong> 최적화된 처리 시간</div>
                      <div><strong>응용 예:</strong> PR Ashing, 세정</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">🔬 고선택비 요구</h4>
                    <div className="space-y-2 text-purple-700 text-sm">
                      <div><strong>요구사항:</strong> 특정 물질만 선택적 제거</div>
                      <div><strong>추천 장비:</strong> RIE, 저온 플라즈마</div>
                      <div><strong>핵심 파라미터:</strong> 화학적 식각 최적화</div>
                      <div><strong>응용 예:</strong> 게이트 식각, 다층막 구조</div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-3">⚡ 고속 처리</h4>
                    <div className="space-y-2 text-orange-700 text-sm">
                      <div><strong>요구사항:</strong> 빠른 공정 시간</div>
                      <div><strong>추천 장비:</strong> ICP, ECR</div>
                      <div><strong>핵심 파라미터:</strong> 고밀도 플라즈마</div>
                      <div><strong>응용 예:</strong> 두꺼운 막 식각, 대량 생산</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 미래 기술 동향 */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">🚀 플라즈마 기술의 미래 동향</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                      <span className="mr-2">🔬</span>
                      차세대 반도체 공정
                    </h4>
                    <ul className="text-indigo-700 text-sm space-y-1">
                      <li>• 3D NAND: 100+ 층 적층 구조</li>
                      <li>• EUV 리소그래피 후 공정</li>
                      <li>• 원자층 식각 (ALE)</li>
                      <li>• 2nm 이하 공정 대응</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                      <span className="mr-2">🌍</span>
                      환경 친화적 공정
                    </h4>
                    <ul className="text-indigo-700 text-sm space-y-1">
                      <li>• 친환경 가스 개발</li>
                      <li>• 저온 공정 기술</li>
                      <li>• 폐가스 재활용</li>
                      <li>• 에너지 효율 향상</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                      <span className="mr-2">🤖</span>
                      AI/머신러닝 융합
                    </h4>
                    <ul className="text-indigo-700 text-sm space-y-1">
                      <li>• 실시간 공정 최적화</li>
                      <li>• 예측 유지보수</li>
                      <li>• 자동화된 레시피 개발</li>
                      <li>• 디지털 트윈</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                      <span className="mr-2">🔮</span>
                      신개념 플라즈마
                    </h4>
                    <ul className="text-indigo-700 text-sm space-y-1">
                      <li>• 대기압 플라즈마 확산</li>
                      <li>• 마이크로 플라즈마 어레이</li>
                      <li>• 펄스 플라즈마 기술</li>
                      <li>• 복합 에너지원 활용</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 실무 적용 팁 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">💡 실무 적용 팁</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-yellow-800 mb-2">장비 선택 시</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• 공정 요구사항 명확화</li>
                    <li>• 처리량 vs 성능 트레이드오프</li>
                    <li>• 유지보수 비용 고려</li>
                    <li>• 확장 가능성 검토</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-yellow-800 mb-2">공정 개발 시</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• 단계별 최적화 접근</li>
                    <li>• DOE 활용한 체계적 실험</li>
                    <li>• 실시간 모니터링 구축</li>
                    <li>• 재현성 확보 최우선</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-yellow-800 mb-2">문제 해결 시</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• 근본 원인 분석</li>
                    <li>• 다중 변수 체크</li>
                    <li>• 이력 데이터 활용</li>
                    <li>• 전문가 협업</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlasmaSimulatorII;GasType === 'XeF2' && '순수 화학반응 - 낮은 속도, 높은 선택비'}
                        {etchGasType === 'Synergy' && '상승효과 - 최고 속도, 균형잡힌 특성'}
                        {etchGasType === 'Ar' && '순수 물리반응 - 중간 속도, 높은 이방성'}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">메커니즘 설명</h5>
                      <div className="text-sm text-gray-700">
                        {etchGasType === 'XeF2' && (
                          <div>
                            <strong>화학 반응:</strong> XeF₂ 라디칼이 Si와 화학적으로 결합하여 SiF₄를 형성합니다. 
                            선택비는 우수하지만 속도가 느리고 등방성 식각이 발생합니다.
                          </div>
                        )}
                        {etch
