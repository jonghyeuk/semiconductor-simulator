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
  const [difficulty, setDifficulty] = useState('상');

  const themes = [
    { id: 'system-structure-icp', name: '시스템 구조(ICP)', icon: '🔬', color: 'indigo' },
    { id: 'etching-process', name: '식각 공정(기본)', icon: '⚙️', color: 'orange' },
    { id: 'deposition-process', name: '증착 공정(기본)', icon: '🏗️', color: 'teal' },
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
      <style>{`
        /* 녹색 슬라이더 스타일 */
        .slider-thumb-green {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-green::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 10px;
          border: 2px solid #047857;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-green::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #10b981);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-green::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-green::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 10px;
          border: 2px solid #047857;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-green::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #10b981);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 빨간색 슬라이더 스타일 */
        .slider-thumb-red {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-red::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-radius: 10px;
          border: 2px solid #b91c1c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-red::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-red::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-red::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-radius: 10px;
          border: 2px solid #b91c1c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-red::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 오렌지색 슬라이더 스타일 */
        .slider-thumb-orange {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-orange::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #ea580c, #f97316);
          border-radius: 10px;
          border: 2px solid #c2410c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-orange::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ea580c, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-orange::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-orange::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #ea580c, #f97316);
          border-radius: 10px;
          border: 2px solid #c2410c;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-orange::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ea580c, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 파란색 슬라이더 스타일 */
        .slider-thumb-blue {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-blue::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 10px;
          border: 2px solid #1d4ed8;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-blue::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-blue::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-blue::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 10px;
          border: 2px solid #1d4ed8;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-blue::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        /* 보라색 슬라이더 스타일 */
        .slider-thumb-purple {
          position: relative;
          z-index: 10;
        }
        .slider-thumb-purple::-webkit-slider-runnable-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border-radius: 10px;
          border: 2px solid #6d28d9;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-purple::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          position: relative;
          top: -2px;
        }
        .slider-thumb-purple::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider-thumb-purple::-moz-range-track {
          width: 100%;
          height: 20px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border-radius: 10px;
          border: 2px solid #6d28d9;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb-purple::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
      `}</style>
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">플라즈마 공정 교육 시뮬레이터 II</h1>
            <div className="text-sm text-gray-500">Advanced Learning System</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6">
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

      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-6">
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
                  <div className="bg-green-300 p-5 rounded-xl border-4 border-green-700 hover:border-green-800 transition-all shadow-lg">
                    <label className="block text-sm font-medium text-green-900 mb-3">
                      <span className="flex items-center justify-between">
                        <span className="font-bold">Source RF Power (플라즈마 밀도 제어)</span>
                        <span className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                          {(rfPower * 2).toFixed(0)} W
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="50" 
                        max="500" 
                        step="10" 
                        value={rfPower * 2} 
                        onChange={(e) => setRfPower(parseInt(e.target.value) / 2)} 
                        className="w-full h-5 bg-green-400 rounded-lg appearance-none cursor-pointer slider-thumb-green hover:bg-green-500 focus:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-600 focus:ring-opacity-50"
                      />
                      <div className="flex justify-between text-sm text-green-800 mt-2 font-medium">
                        <span>50W</span>
                        <span className="text-green-900 font-bold">⟵ 드래그하여 조정 ⟶</span>
                        <span>500W</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-300 p-5 rounded-xl border-4 border-red-700 hover:border-red-800 transition-all shadow-lg">
                    <label className="block text-sm font-medium text-red-900 mb-3">
                      <span className="flex items-center justify-between">
                        <span className="font-bold">Bias RF Power (이온 에너지 제어)</span>
                        <span className="bg-red-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                          {etchPower} W
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="0" 
                        max="300" 
                        step="10" 
                        value={etchPower} 
                        onChange={(e) => setEtchPower(parseInt(e.target.value))} 
                        className="w-full h-5 bg-red-400 rounded-lg appearance-none cursor-pointer slider-thumb-red hover:bg-red-500 focus:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-50"
                      />
                      <div className="flex justify-between text-sm text-red-800 mt-2 font-medium">
                        <span>0W</span>
                        <span className="text-red-900 font-bold">⟵ 드래그하여 조정 ⟶</span>
                        <span>300W</span>
                      </div>
                    </div>
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
                        data={[
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
                        ]}
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
                        {etchGasType === 'XeF2' && '순수 화학반응 - 낮은 속도, 높은 선택비'}
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
                  </div>
                </div>
              </div>
            </div>

            {/* 공정 조건 최적화 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">공정 조건 최적화</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-orange-200 p-4 rounded-lg border-2 border-orange-600 hover:border-orange-700 transition-all shadow-md">
                    <label className="block text-sm font-medium text-orange-900 mb-3">
                      <span className="flex items-center justify-between">
                        <span>RF 파워</span>
                        <span className="bg-orange-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {etchPower} W
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="50" 
                        max="500" 
                        step="10" 
                        value={etchPower} 
                        onChange={(e) => setEtchPower(parseInt(e.target.value))} 
                        className="w-full h-4 bg-orange-300 rounded-lg appearance-none cursor-pointer slider-thumb-orange hover:bg-orange-400 focus:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                      />
                      <div className="flex justify-between text-xs text-orange-700 mt-1">
                        <span>50W</span>
                        <span className="text-orange-900 font-medium">드래그하여 조정</span>
                        <span>500W</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-200 p-4 rounded-lg border-2 border-blue-600 hover:border-blue-700 transition-all shadow-md">
                    <label className="block text-sm font-medium text-blue-900 mb-3">
                      <span className="flex items-center justify-between">
                        <span>압력</span>
                        <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {etchPressure} mTorr
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        step="1" 
                        value={etchPressure} 
                        onChange={(e) => setEtchPressure(parseInt(e.target.value))} 
                        className="w-full h-4 bg-blue-300 rounded-lg appearance-none cursor-pointer slider-thumb-blue hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      />
                      <div className="flex justify-between text-xs text-blue-700 mt-1">
                        <span>1 mTorr</span>
                        <span className="text-blue-900 font-medium">드래그하여 조정</span>
                        <span>100 mTorr</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-200 p-4 rounded-lg border-2 border-gray-600 shadow-md">
                    <label className="block text-sm font-medium text-gray-800 mb-3">공정 가스</label>
                    <select 
                      value={etchGasType === 'XeF2' || etchGasType === 'Synergy' || etchGasType === 'Ar' ? 'CF4' : etchGasType} 
                      onChange={(e) => setEtchGasType(e.target.value)} 
                      className="w-full p-3 border-2 border-gray-600 rounded-lg focus:border-gray-800 focus:outline-none bg-white cursor-pointer hover:border-gray-700 transition-all"
                    >
                      <option value="CF4">CF₄ (실리콘 식각)</option>
                      <option value="Cl2">Cl₂ (금속 식각)</option>
                      <option value="O2">O₂ (유기물 제거)</option>
                    </select>
                  </div>
                  
                  <div className="bg-purple-200 p-4 rounded-lg border-2 border-purple-600 hover:border-purple-700 transition-all shadow-md">
                    <label className="block text-sm font-medium text-purple-900 mb-3">
                      <span className="flex items-center justify-between">
                        <span>패턴 밀도</span>
                        <span className="bg-purple-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {patternDensity}%
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5" 
                        value={patternDensity} 
                        onChange={(e) => setPatternDensity(parseInt(e.target.value))} 
                        className="w-full h-4 bg-purple-300 rounded-lg appearance-none cursor-pointer slider-thumb-purple hover:bg-purple-400 focus:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                      />
                      <div className="flex justify-between text-xs text-purple-700 mt-1">
                        <span>0%</span>
                        <span className="text-purple-900 font-medium">드래그하여 조정</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
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

            {/* 주요 식각가스와 재료별 공정 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">주요 식각가스와 재료별 공정</h3>
              <p className="text-gray-600 mb-6">다양한 재료에 따른 최적 식각가스 조합과 공정 조건을 학습합니다.</p>
              
              {/* 실리콘 계열 */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">🔷</span>
                  실리콘 계열 재료
                </h4>
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h5 className="font-semibold text-blue-900 mb-2">Si (실리콘)</h5>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div><strong>주요가스:</strong> CF₄, CHF₃, SF₆</div>
                      <div><strong>반응생성물:</strong> SiF₄ (휘발성)</div>
                      <div><strong>특징:</strong> 높은 식각률, 우수한 선택비</div>
                      <div><strong>응용:</strong> MEMS, 트렌치, Via</div>
                      <div className="mt-2 text-xs bg-blue-200 p-2 rounded">
                        Si + 4F → SiF₄ ↑
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-500">
                    <h5 className="font-semibold text-cyan-900 mb-2">SiO₂ (실리콘 산화막)</h5>
                    <div className="text-sm text-cyan-800 space-y-1">
                      <div><strong>주요가스:</strong> CHF₃, C₄F₈, CF₄/H₂</div>
                      <div><strong>반응생성물:</strong> SiF₄, CO, H₂O</div>
                      <div><strong>특징:</strong> 폴리머 형성으로 선택비 향상</div>
                      <div><strong>응용:</strong> Gate 산화막, STI, IMD</div>
                      <div className="mt-2 text-xs bg-cyan-200 p-2 rounded">
                        SiO₂ + CHF₃ → SiF₄ + CO + H₂O
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                    <h5 className="font-semibold text-indigo-900 mb-2">Si₃N₄ (실리콘 질화막)</h5>
                    <div className="text-sm text-indigo-800 space-y-1">
                      <div><strong>주요가스:</strong> CHF₃/O₂, CF₄/O₂</div>
                      <div><strong>반응생성물:</strong> SiF₄, N₂, CO</div>
                      <div><strong>특징:</strong> O₂ 첨가로 질소 결합 절단</div>
                      <div><strong>응용:</strong> 절연막, 스페이서, 하드마스크</div>
                      <div className="mt-2 text-xs bg-indigo-200 p-2 rounded">
                        Si₃N₄ + CF₄ + O₂ → SiF₄ + N₂ + CO
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 금속 계열 */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-red-800 mb-4 flex items-center">
                  <span className="bg-red-100 p-2 rounded-lg mr-3">⚡</span>
                  금속 계열 재료
                </h4>
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <h5 className="font-semibold text-red-900 mb-2">Al (알루미늄)</h5>
                    <div className="text-sm text-red-800 space-y-1">
                      <div><strong>주요가스:</strong> Cl₂, BCl₃, BCl₃/Cl₂</div>
                      <div><strong>반응생성물:</strong> AlCl₃ (휘발성)</div>
                      <div><strong>특징:</strong> BCl₃가 Al₂O₃ 제거에 효과적</div>
                      <div><strong>응용:</strong> 배선, 패드, 전극</div>
                      <div className="mt-2 text-xs bg-red-200 p-2 rounded">
                        Al + 3Cl → AlCl₃ ↑
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h5 className="font-semibold text-orange-900 mb-2">Cu (구리)</h5>
                    <div className="text-sm text-orange-800 space-y-1">
                      <div><strong>주요가스:</strong> Ar, Ar/H₂, Ar/N₂</div>
                      <div><strong>반응생성물:</strong> 물리적 스퍼터링</div>
                      <div><strong>특징:</strong> 주로 물리적 식각, 낮은 휘발성</div>
                      <div><strong>응용:</strong> 배선, Via, 범프</div>
                      <div className="mt-2 text-xs bg-orange-200 p-2 rounded">
                        Physical Sputtering Process
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h5 className="font-semibold text-yellow-900 mb-2">W (텅스텐)</h5>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <div><strong>주요가스:</strong> CF₄, SF₆, NF₃</div>
                      <div><strong>반응생성물:</strong> WF₆ (휘발성)</div>
                      <div><strong>특징:</strong> 고온에서 높은 식각률</div>
                      <div><strong>응용:</strong> Via 플러그, 배리어</div>
                      <div className="mt-2 text-xs bg-yellow-200 p-2 rounded">
                        W + 6F → WF₆ ↑
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 유기물 및 기타 재료 */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-green-800 mb-4 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">🧪</span>
                  유기물 및 기타 재료
                </h4>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-900 mb-2">Photoresist (포토레지스트)</h5>
                    <div className="text-sm text-green-800 space-y-1">
                      <div><strong>주요가스:</strong> O₂, O₂/CF₄, O₂/Ar</div>
                      <div><strong>반응생성물:</strong> CO₂, H₂O (완전 산화)</div>
                      <div><strong>특징:</strong> 산소 라디칼에 의한 완전 제거</div>
                      <div><strong>응용:</strong> 애싱(Ashing), 스트립</div>
                      <div className="mt-2 text-xs bg-green-200 p-2 rounded">
                        (C₈H₈)ₙ + O₂ → CO₂ + H₂O
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <h5 className="font-semibold text-purple-900 mb-2">Poly-Si (폴리실리콘)</h5>
                    <div className="text-sm text-purple-800 space-y-1">
                      <div><strong>주요가스:</strong> HBr/Cl₂, HBr/O₂</div>
                      <div><strong>반응생성물:</strong> SiBr₄, SiCl₄</div>
                      <div><strong>특징:</strong> 할로겐 혼합으로 프로파일 제어</div>
                      <div><strong>응용:</strong> Gate 전극, 저항</div>
                      <div className="mt-2 text-xs bg-purple-200 p-2 rounded">
                        Si + HBr + Cl₂ → SiBr₄ + SiCl₄
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 공정 조건 요약 테이블 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">재료별 최적 공정 조건 요약</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left">재료</th>
                        <th className="px-3 py-2 text-center">주요 가스</th>
                        <th className="px-3 py-2 text-center">압력 (mTorr)</th>
                        <th className="px-3 py-2 text-center">온도 (°C)</th>
                        <th className="px-3 py-2 text-center">특징</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      <tr>
                        <td className="px-3 py-2 font-medium">Si</td>
                        <td className="px-3 py-2 text-center">CF₄/CHF₃</td>
                        <td className="px-3 py-2 text-center">5-50</td>
                        <td className="px-3 py-2 text-center">0-80</td>
                        <td className="px-3 py-2 text-center">고속, 고선택비</td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="px-3 py-2 font-medium">SiO₂</td>
                        <td className="px-3 py-2 text-center">CHF₃/C₄F₈</td>
                        <td className="px-3 py-2 text-center">10-100</td>
                        <td className="px-3 py-2 text-center">20-60</td>
                        <td className="px-3 py-2 text-center">폴리머 형성</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium">Al</td>
                        <td className="px-3 py-2 text-center">BCl₃/Cl₂</td>
                        <td className="px-3 py-2 text-center">2-20</td>
                        <td className="px-3 py-2 text-center">40-80</td>
                        <td className="px-3 py-2 text-center">산화막 제거</td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="px-3 py-2 font-medium">PR</td>
                        <td className="px-3 py-2 text-center">O₂</td>
                        <td className="px-3 py-2 text-center">100-1000</td>
                        <td className="px-3 py-2 text-center">150-250</td>
                        <td className="px-3 py-2 text-center">완전 산화</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTheme === 'deposition-process' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border">
              <h2 className="text-2xl font-bold text-teal-900 mb-4">🏗️ PECVD 플라즈마 증착 공정</h2>
              <p className="text-teal-700 mb-2">플라즈마 강화 화학 기상 증착(PECVD)의 원리와 특성을 학습합니다.</p>
              <div className="text-sm text-teal-600 bg-teal-100 rounded-lg p-3">
                <strong>핵심 학습:</strong> 저온 증착 원리, CCP vs ICP 증착 특성, 스텝 커버리지, 응용 분야
              </div>
            </div>

            {/* PECVD 소개 및 원리 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">PECVD (Plasma Enhanced Chemical Vapor Deposition)</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="bg-teal-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-teal-900 mb-2">정의 및 원리</h4>
                    <p className="text-teal-800 text-sm leading-relaxed">
                      PECVD는 플라즈마 강화 화학 기상 증착으로, 플라즈마 에너지를 이용해 저온에서 박막을 형성하는 기술입니다. 
                      플라즈마를 통해 소스 가스를 활성화시켜 <strong>400°C 이하</strong>의 낮은 온도에서도 고품질 박막 증착이 가능합니다.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">기본 반응 메커니즘</h4>
                    <div className="text-blue-800 text-sm space-y-2">
                      <div>1. 소스 가스 → 플라즈마 활성화 → 라디칼 생성</div>
                      <div>2. 활성 라디칼 → 기판 표면 흡착</div>
                      <div>3. 표면 반응 → 박막 성장</div>
                      <div>4. 반응 부산물 → 배기로 제거</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">PECVD vs 기존 CVD</h4>
                    <div className="text-yellow-800 text-sm space-y-1">
                      <div><strong>기존 CVD:</strong> 고온(600-1000°C) 필요</div>
                      <div><strong>PECVD:</strong> 저온(200-400°C) 가능</div>
                      <div><strong>장점:</strong> 열 손상 방지, 빠른 증착</div>
                      <div><strong>단점:</strong> 불순물 증가, 스텝 커버리지 저하</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">CCP 타입 PECVD 장비 구조</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <svg width="100%" height="300" viewBox="0 0 400 300">
                      {/* 챔버 */}
                      <rect x="80" y="100" width="240" height="140" fill="none" stroke="#dc2626" strokeWidth="3"/>
                      
                      {/* 가스 시스템 - 우측 상단 */}
                      {/* 가스통 3개 */}
                      <rect x="350" y="30" width="15" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" rx="3"/>
                      <text x="355" y="25" fontSize="11" fill="#374151" fontWeight="bold">SiH4</text>
                      <rect x="370" y="30" width="15" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" rx="3"/>
                      <text x="378" y="25" fontSize="12" fill="#374151" fontWeight="bold">Ar</text>
                      <rect x="390" y="30" width="15" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" rx="3"/>
                      <text x="397" y="25" fontSize="12" fill="#374151" fontWeight="bold">O2</text>
                      
                      {/* 가스밸브 3개 */}
                      <circle cx="357" cy="80" r="5" fill="white" stroke="#374151" strokeWidth="2"/>
                      <line x1="354" y1="77" x2="360" y2="83" stroke="#374151" strokeWidth="2"/>
                      <circle cx="377" cy="80" r="5" fill="white" stroke="#374151" strokeWidth="2"/>
                      <line x1="374" y1="77" x2="380" y2="83" stroke="#374151" strokeWidth="2"/>
                      <circle cx="397" cy="80" r="5" fill="white" stroke="#374151" strokeWidth="2"/>
                      <line x1="394" y1="77" x2="400" y2="83" stroke="#374151" strokeWidth="2"/>
                      
                      {/* MFC 3개 */}
                      <rect x="350" y="95" width="15" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
                      <text x="352" y="103" fontSize="8" fill="#374151">MFC</text>
                      <rect x="370" y="95" width="15" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
                      <text x="372" y="103" fontSize="8" fill="#374151">MFC</text>
                      <rect x="390" y="95" width="15" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
                      <text x="392" y="103" fontSize="8" fill="#374151">MFC</text>
                      
                      {/* 가스라인 연결 */}
                      <line x1="357" y1="70" x2="357" y2="75" stroke="#10b981" strokeWidth="2"/>
                      <line x1="377" y1="70" x2="377" y2="75" stroke="#10b981" strokeWidth="2"/>
                      <line x1="397" y1="70" x2="397" y2="75" stroke="#10b981" strokeWidth="2"/>
                      
                      <line x1="357" y1="85" x2="357" y2="95" stroke="#10b981" strokeWidth="2"/>
                      <line x1="377" y1="85" x2="377" y2="95" stroke="#10b981" strokeWidth="2"/>
                      <line x1="397" y1="85" x2="397" y2="95" stroke="#10b981" strokeWidth="2"/>
                      
                      <line x1="357" y1="105" x2="357" y2="115" stroke="#10b981" strokeWidth="2"/>
                      <line x1="377" y1="105" x2="377" y2="115" stroke="#10b981" strokeWidth="2"/>
                      <line x1="397" y1="105" x2="397" y2="115" stroke="#10b981" strokeWidth="2"/>
                      
                      {/* 합류점 */}
                      <line x1="357" y1="115" x2="377" y2="115" stroke="#10b981" strokeWidth="2"/>
                      <line x1="377" y1="115" x2="397" y2="115" stroke="#10b981" strokeWidth="2"/>
                      
                      {/* 샤워헤드로 연결 */}
                      <line x1="377" y1="115" x2="280" y2="115" stroke="#10b981" strokeWidth="2"/>
                      <line x1="280" y1="115" x2="280" y2="127" stroke="#10b981" strokeWidth="2"/>
                      <polygon points="277,125 283,125 280,130" fill="#10b981"/>
                      
                      {/* 플라즈마 샤워 헤드 - 상부 전극 (진한회색) */}
                      <rect x="120" y="120" width="160" height="8" fill="#6b7280" stroke="#374151" strokeWidth="2"/>
                      {/* 플라즈마 샤워 헤드 - 하부 (파란색) */}
                      <rect x="120" y="128" width="160" height="7" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"/>
                      
                      {/* RF 파워 소스 - 상부로 이동 */}
                      <circle cx="120" cy="50" r="15" fill="none" stroke="#dc2626" strokeWidth="2"/>
                      <path d="M108,50 Q114,43 120,50 Q126,57 132,50" fill="none" stroke="#dc2626" strokeWidth="2"/>
                      <text x="50" y="45" fontSize="13" fill="#dc2626" fontWeight="bold">RF</text>
                      <text x="45" y="60" fontSize="13" fill="#dc2626" fontWeight="bold">power</text>
                      <text x="45" y="75" fontSize="13" fill="#dc2626" fontWeight="bold">source</text>
                      
                      {/* RF 연결선 - 상부 전극으로 연결 */}
                      <line x1="135" y1="50" x2="200" y2="50" stroke="#dc2626" strokeWidth="3"/>
                      <line x1="200" y1="50" x2="200" y2="120" stroke="#dc2626" strokeWidth="3"/>
                      
                      <text x="300" y="110" fontSize="13" fill="#2563eb" fontWeight="bold">Plasma</text>
                      <text x="300" y="125" fontSize="13" fill="#2563eb" fontWeight="bold">shower</text>
                      <text x="310" y="140" fontSize="13" fill="#2563eb" fontWeight="bold">head</text>
                      
                      {/* 플라즈마 */}
                      <rect x="120" y="135" width="160" height="70" fill="#a855f7" opacity="0.6"/>
                      <text x="200" y="175" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">Plasma</text>
                      
                      {/* 하부 플레이트 */}
                      <rect x="120" y="210" width="160" height="15" fill="#6b7280" stroke="#374151" strokeWidth="2"/>
                      
                      {/* 접지 기호 (하부 전극) */}
                      <line x1="200" y1="225" x2="200" y2="250" stroke="#374151" strokeWidth="3"/>
                      <line x1="190" y1="250" x2="210" y2="250" stroke="#374151" strokeWidth="3"/>
                      <line x1="194" y1="255" x2="206" y2="255" stroke="#374151" strokeWidth="2"/>
                      <line x1="198" y1="260" x2="202" y2="260" stroke="#374151" strokeWidth="2"/>
                      
                      {/* Reaction chamber 라벨 */}
                      <text x="350" y="160" fontSize="13" fill="#dc2626" fontWeight="bold">Reaction</text>
                      <text x="350" y="175" fontSize="13" fill="#dc2626" fontWeight="bold">chamber</text>
                    </svg>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      <strong>동작 원리:</strong> 진공 챔버와 여러된 배관을 통해 펌프로 배기되고, 
                      가스는 유량의 정밀한 제어를 위한 MFC를 거나 Shower Head를 통해 챔버 내부로 공급되고
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 장점과 단점 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">PECVD의 장점과 단점</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">✅</span>
                    주요 장점
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-semibold text-green-900 mb-2">저온 증착 (400°C 이하)</h5>
                      <p className="text-green-800 text-sm">
                        플라즈마를 이용해 소스 가스를 활성화시키므로 비교적 낮은 온도에서 증착이 가능합니다. 
                        이는 열로 인한 손상을 줄일 수 있습니다.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-semibold text-blue-900 mb-2">빠른 증착 속도</h5>
                      <p className="text-blue-800 text-sm">
                        소스 가스의 분해 속도가 매우 빨라 공정 시간을 단축할 수 있습니다. 
                        일반적으로 100-1000 Å/min의 높은 증착률을 보입니다.
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h5 className="font-semibold text-purple-900 mb-2">낮은 기판 온도</h5>
                      <p className="text-purple-800 text-sm">
                        고온에 민감한 기판(유기물, 플라스틱 등)에도 박막을 형성할 수 있어 
                        응용 범위가 넓습니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                    <span className="bg-red-100 p-2 rounded-lg mr-3">⚠️</span>
                    주요 단점
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                      <h5 className="font-semibold text-red-900 mb-2">낮은 스텝 커버리지</h5>
                      <p className="text-red-800 text-sm">
                        평탄한 표면에는 잘 증착되지만, 굴곡이나 복잡한 구조에서는 균일한 증착이 어렵습니다. 
                        특히 고종횡비 구조에서 문제가 됩니다.
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <h5 className="font-semibold text-orange-900 mb-2">불순물 함유</h5>
                      <p className="text-orange-800 text-sm">
                        플라즈마 사용으로 인해 수소, 탄소 등의 불순물이 박막에 포함될 수 있어 
                        전기적, 기계적 특성에 영향을 줍니다.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
                      <h5 className="font-semibold text-gray-900 mb-2">장비 크기 제한</h5>
                      <p className="text-gray-800 text-sm">
                        진공 챔버 크기에 따라 처리할 수 있는 기판 크기가 제한적이며, 
                        대면적 증착 시 균일도 확보가 어렵습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 주요 활용 분야 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">PECVD 주요 활용 분야</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">📱</span>
                    OLED 디스플레이
                  </h4>
                  <div className="space-y-2 text-blue-700 text-sm">
                    <div><strong>TFE:</strong> 박막 봉지(Thin Film Encapsulation)</div>
                    <div><strong>보호막:</strong> 수분/산소 차단막</div>
                    <div><strong>절연막:</strong> 층간 절연막</div>
                    <div><strong>특징:</strong> 플렉서블 기판에 적합</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">💻</span>
                    반도체 공정
                  </h4>
                  <div className="space-y-2 text-green-700 text-sm">
                    <div><strong>SiO₂:</strong> 게이트 절연막, IMD</div>
                    <div><strong>SiNₓ:</strong> 패시베이션, 하드마스크</div>
                    <div><strong>SiON:</strong> 저유전 절연막</div>
                    <div><strong>특징:</strong> 저온으로 열 손상 방지</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🔧</span>
                    전자 부품
                  </h4>
                  <div className="space-y-2 text-purple-700 text-sm">
                    <div><strong>보호막:</strong> 표면 보호 코팅</div>
                    <div><strong>절연막:</strong> 전기적 절연</div>
                    <div><strong>기능막:</strong> 반사방지막, 필터</div>
                    <div><strong>특징:</strong> 다양한 재료에 적용</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 재료별 PECVD 공정 조건 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">재료별 PECVD 공정 조건</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-teal-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">증착 재료</th>
                      <th className="px-4 py-3 text-center font-semibold">소스 가스</th>
                      <th className="px-4 py-3 text-center font-semibold">온도 (°C)</th>
                      <th className="px-4 py-3 text-center font-semibold">압력 (mTorr)</th>
                      <th className="px-4 py-3 text-center font-semibold">증착률 (Å/min)</th>
                      <th className="px-4 py-3 text-center font-semibold">주요 응용</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">SiO₂</td>
                      <td className="px-4 py-3 text-center">SiH₄ + N₂O</td>
                      <td className="px-4 py-3 text-center">300-400</td>
                      <td className="px-4 py-3 text-center">500-2000</td>
                      <td className="px-4 py-3 text-center">100-500</td>
                      <td className="px-4 py-3 text-center">절연막, IMD</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium">SiNₓ</td>
                      <td className="px-4 py-3 text-center">SiH₄ + NH₃</td>
                      <td className="px-4 py-3 text-center">250-350</td>
                      <td className="px-4 py-3 text-center">200-1000</td>
                      <td className="px-4 py-3 text-center">50-200</td>
                      <td className="px-4 py-3 text-center">패시베이션, 하드마스크</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">SiON</td>
                      <td className="px-4 py-3 text-center">SiH₄ + N₂O + NH₃</td>
                      <td className="px-4 py-3 text-center">300-400</td>
                      <td className="px-4 py-3 text-center">300-1500</td>
                      <td className="px-4 py-3 text-center">80-300</td>
                      <td className="px-4 py-3 text-center">저유전 절연막</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium">a-Si</td>
                      <td className="px-4 py-3 text-center">SiH₄</td>
                      <td className="px-4 py-3 text-center">200-300</td>
                      <td className="px-4 py-3 text-center">100-500</td>
                      <td className="px-4 py-3 text-center">50-200</td>
                      <td className="px-4 py-3 text-center">TFT, 태양전지</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">DLC</td>
                      <td className="px-4 py-3 text-center">C₂H₂, CH₄</td>
                      <td className="px-4 py-3 text-center">100-200</td>
                      <td className="px-4 py-3 text-center">10-100</td>
                      <td className="px-4 py-3 text-center">10-100</td>
                      <td className="px-4 py-3 text-center">보호막, 코팅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                <h4 className="font-semibold text-teal-900 mb-2">공정 최적화 포인트</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-teal-800">
                  <div>
                    <strong>온도 제어:</strong> 기판 손상 방지와 반응성 균형
                  </div>
                  <div>
                    <strong>압력 조절:</strong> 증착률과 균일도 최적화
                  </div>
                  <div>
                    <strong>RF 파워:</strong> 플라즈마 밀도와 이온 손상 제어
                  </div>
                  <div>
                    <strong>가스비 조절:</strong> 박막 특성(스토이키오메트리) 제어
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PlasmaSimulatorII;
