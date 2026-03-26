// GEO 가이드 페이지용 시뮬레이터 메타데이터
// 이 파일을 수정하고 npm run build-guides 실행하면 HTML 자동 생성

const guideDomain = 'https://demo.semifabai.com';
const mainPlatformUrl = 'https://kr.semifabai.com';

const simulators = [
  {
    id: 'vacuum',
    name: 'Vacuum 기초 시뮬레이터',
    shortName: 'Vacuum 기초',
    icon: '⚡',
    color: '#1976d2',
    summary: '반도체 공정의 기본이 되는 진공 시스템의 원리와 펌핑 메커니즘을 인터랙티브 시뮬레이션으로 학습합니다.',
    description: '진공(Vacuum)은 반도체 제조의 거의 모든 공정에서 필수적인 환경 조건입니다. CVD, PVD, 식각, 이온주입 등 대부분의 공정이 진공 상태에서 이루어지며, 진공도에 따라 공정 품질이 크게 달라집니다. 이 시뮬레이터에서는 진공 펌프의 동작 원리, 펌핑 속도와 도달 압력의 관계, 배관 설계가 진공 성능에 미치는 영향 등을 직접 조작하며 학습할 수 있습니다.',
    learningObjectives: [
      '진공의 정의와 반도체 공정에서의 중요성 이해',
      '로터리 펌프, 터보 펌프 등 진공 펌프의 동작 원리 학습',
      '펌핑 속도, 도달 압력, 가스 부하의 관계 파악',
      'Conductance와 배관 설계가 진공 성능에 미치는 영향 분석',
      '공정별 요구 진공도(저진공~초고진공) 이해'
    ],
    targetLevel: '입문~중급 (반도체 공정 초보자도 가능)',
    demoScope: '실시간 펌핑 시뮬레이션, 성능 특성 곡선 분석, 압력 세팅 실험, Conductance 계산, 배관 설계 최적화, 퀴즈',
    fullVersionExtras: '다중 펌프 조합 시뮬레이션, 리크 테스트 시나리오, 실제 장비 파라미터 기반 시뮬레이션, 공정 연계 진공 설계',
    keywords: ['진공 시뮬레이터', '반도체 진공', 'vacuum pump', '펌핑 시뮬레이션', '터보 펌프', '로터리 펌프', 'conductance', '반도체 교육'],
    relatedIds: ['cleaning', 'plasma'],
    processContext: '진공은 세정 이후 거의 모든 공정(산화, 증착, 식각, 이온주입)의 전제 조건이 됩니다.'
  },
  {
    id: 'cleaning',
    name: '웨이퍼 세정 시뮬레이터',
    shortName: '웨이퍼 세정',
    icon: '🧽',
    color: '#4caf50',
    summary: 'RCA 세정법을 중심으로 습식·건식 세정 공정의 원리와 오염 제거 메커니즘을 시각적으로 학습합니다.',
    description: '웨이퍼 세정(Cleaning)은 반도체 공정의 첫 번째 단계이자 각 공정 사이에 반복적으로 수행되는 핵심 공정입니다. 미세한 파티클, 유기물, 금속 오염, 자연 산화막 등을 제거하지 않으면 후속 공정의 품질이 크게 저하됩니다. 이 시뮬레이터에서는 SC-1, SC-2, DHF 등 RCA 세정의 각 단계별 화학 반응과 제거 메커니즘, 초음파 세정의 캐비테이션 효과 등을 시각적으로 체험합니다.',
    learningObjectives: [
      'RCA 세정법(SC-1, SC-2, DHF)의 각 단계별 역할 이해',
      '습식 세정과 건식 세정의 차이점 및 적용 분야 비교',
      '파티클, 유기물, 금속 오염의 제거 메커니즘 학습',
      '초음파 세정의 캐비테이션 원리 이해',
      '세정 공정이 후속 공정 품질에 미치는 영향 파악'
    ],
    targetLevel: '입문~중급',
    demoScope: '세정 공정 개요, 습식 세정 실시간 시뮬레이션, 건식 세정 비교, 초음파 캐비테이션 시각화, 웨이퍼 단면 시각화, 퀴즈',
    fullVersionExtras: '오염 유형별 맞춤 세정 레시피 설계, 세정 효율 정량 분석, 공정 간 세정 최적화, 실제 세정 장비 파라미터',
    keywords: ['웨이퍼 세정', 'RCA 세정', 'SC-1', 'SC-2', '습식 세정', '건식 세정', '반도체 세정 공정', '초음파 세정'],
    relatedIds: ['vacuum', 'oxidation'],
    processContext: '세정은 모든 공정의 시작점이며, 산화·증착·리소그래피 전에 필수적으로 수행됩니다.'
  },
  {
    id: 'oxidation',
    name: 'Oxidation 시뮬레이터',
    shortName: 'Oxidation',
    icon: '🔥',
    color: '#ff5722',
    summary: '열산화 공정의 원리와 Deal-Grove 모델을 기반으로 산화막 성장을 시뮬레이션합니다.',
    description: '산화(Oxidation)는 실리콘 웨이퍼 표면에 SiO₂ 절연막을 형성하는 공정으로, 게이트 절연막, 소자 분리, 표면 보호 등 다양한 목적으로 사용됩니다. 건식 산화(Dry Oxidation)는 얇고 치밀한 막을, 습식 산화(Wet Oxidation)는 빠르게 두꺼운 막을 형성합니다. 이 시뮬레이터에서는 온도, 시간, 산화 방식에 따른 산화막 두께 변화를 Deal-Grove 모델 기반으로 직접 실험하고 분석합니다.',
    learningObjectives: [
      '건식 산화와 습식 산화의 차이점과 적용 분야 이해',
      'Deal-Grove 모델의 선형/포물선 영역 개념 학습',
      '온도·시간·분위기가 산화막 두께에 미치는 영향 분석',
      '게이트 산화막의 품질 요구사항 이해',
      '산화 공정의 트러블슈팅 능력 배양'
    ],
    targetLevel: '중급',
    demoScope: '산화 공정 개요, 열산화 실험 시뮬레이션, Deal-Grove 모델 기반 산화 영향 인자 분석, 트러블슈팅, 퀴즈',
    fullVersionExtras: '다층 산화막 시뮬레이션, LOCOS/STI 소자 분리 공정, 고유전율 물질(High-k) 비교, 실제 레시피 기반 실험',
    keywords: ['산화 공정', 'thermal oxidation', 'Deal-Grove 모델', '게이트 산화막', 'SiO2', '건식 산화', '습식 산화', '반도체 산화'],
    relatedIds: ['cleaning', 'lithography'],
    processContext: '산화는 세정 후 수행되며, 형성된 산화막은 리소그래피에서 패턴을 전사할 기판이 됩니다.'
  },
  {
    id: 'lithography',
    name: 'Lithography 시뮬레이터',
    shortName: 'Lithography',
    icon: '💡',
    color: '#9c27b0',
    summary: '포토리소그래피 8단계 공정과 PR 코팅, DUV/EUV 노광 기술을 인터랙티브하게 학습합니다.',
    description: '리소그래피(Lithography)는 마스크에 그려진 회로 패턴을 웨이퍼 위의 감광제(PR)에 전사하는 공정입니다. 반도체 미세화의 핵심 기술로, DUV(193nm)에서 EUV(13.5nm)로의 발전이 현재 진행 중입니다. 이 시뮬레이터에서는 PR 코팅의 RPM 최적화, DUV와 EUV 노광 방식 비교, Stepper와 Scanner 시스템의 차이, PSM 마스크 기술 등을 체험합니다.',
    learningObjectives: [
      '포토리소그래피 8단계(HMDS~현상) 공정 흐름 이해',
      'PR 코팅 시 RPM, 점도, 시간이 균일도에 미치는 영향 체험',
      'DUV와 EUV 노광 기술의 원리 및 해상도 차이 비교',
      'Stepper와 Scanner 시스템의 동작 방식 차이 이해',
      'PSM(위상 반전 마스크) 기술의 진화 과정 학습'
    ],
    targetLevel: '중급',
    demoScope: '8단계 공정 설명, PR Coating RPM 시뮬레이션, DUV/EUV 노광 비교, Stepper vs Scanner, PSM 마스크, 퀴즈',
    fullVersionExtras: 'OPC(광근접 보정) 시뮬레이션, 다중 패터닝(SADP/SAQP), 오버레이 정밀도 분석, EUV 펠리클 설계',
    keywords: ['리소그래피', '포토리소그래피', 'EUV', 'DUV', 'PR 코팅', '노광 공정', '반도체 패터닝', 'photolithography'],
    relatedIds: ['oxidation', 'plasma'],
    processContext: '리소그래피로 만든 PR 패턴은 이후 식각 공정에서 마스크 역할을 하여 회로를 형성합니다.'
  },
  {
    id: 'plasma',
    name: 'Plasma 시뮬레이터',
    shortName: 'Plasma',
    icon: '⚡',
    color: '#2196f3',
    summary: 'CCP/ICP 플라즈마 시스템의 발생 원리, RF 매칭, Synergy Effect를 시뮬레이션으로 학습합니다.',
    description: '플라즈마(Plasma)는 반도체 식각과 증착 공정의 핵심 기술입니다. 가스에 RF 전력을 인가하면 전자-분자 충돌에 의해 이온화가 일어나 플라즈마가 생성됩니다. CCP(용량결합)와 ICP(유도결합) 방식은 각각 다른 특성을 가지며, 이온 에너지와 라디칼 밀도의 조합(Synergy Effect)이 공정 품질을 결정합니다. 이 시뮬레이터에서는 Plasma I(CCP, 파션커브, RF 매칭)과 Plasma II(ICP, Synergy Effect, 산업 응용)를 통해 플라즈마 물리를 체계적으로 학습합니다.',
    learningObjectives: [
      '플라즈마의 정의와 전자-이온 충돌 메커니즘 이해',
      '파션 커브(Paschen Curve)를 통한 방전 조건 학습',
      'CCP와 ICP 시스템의 구조적 차이와 특성 비교',
      'RF 매칭 네트워크의 역할과 임피던스 정합 원리',
      'Ion과 Radical의 Synergy Effect가 식각 품질에 미치는 영향'
    ],
    targetLevel: '중급~고급',
    demoScope: 'Plasma I: 플라즈마 기본, 파션커브, RF 매칭, CCP 구조 / Plasma II: ICP 4단계 프로세스, Synergy Effect 실험, 식각 메커니즘, 산업 응용, 퀴즈 30문제',
    fullVersionExtras: '다주파수 플라즈마 시뮬레이션, 플라즈마 진단(OES, Langmuir Probe), 실제 레시피 기반 공정 설계, APC(Advanced Process Control)',
    keywords: ['플라즈마', 'CCP', 'ICP', 'RF 매칭', '파션커브', 'Synergy Effect', '반도체 플라즈마', 'plasma etching'],
    relatedIds: ['lithography', 'etching'],
    processContext: '플라즈마는 식각과 증착의 에너지원으로, 리소그래피 이후 패턴을 실제 물질에 전사하는 핵심 기술입니다.'
  },
  {
    id: 'etching',
    name: 'Etching 시뮬레이터',
    shortName: 'Etching',
    icon: '⚗️',
    color: '#e91e63',
    summary: '건식·습식 식각의 원리와 선택비, 이방성 개념을 3D 시뮬레이션으로 학습합니다.',
    description: '식각(Etching)은 리소그래피로 정의된 패턴을 실제 박막에 전사하는 공정입니다. 습식 식각은 화학 용액으로 등방성 식각을, 건식 식각은 플라즈마를 이용해 이방성(수직) 식각을 수행합니다. 현대 반도체 제조에서는 미세 패턴 구현을 위해 RIE(반응성 이온 식각)가 주로 사용됩니다. 이 시뮬레이터에서는 다양한 식각 가스(SF₆, CF₄, Cl₂, HBr)의 특성 비교, 선택비와 이방성 개념, 3D 실리콘 식각 시각화를 체험합니다.',
    learningObjectives: [
      '습식 식각과 건식 식각의 원리 및 차이점 이해',
      '선택비(Selectivity)와 이방성(Anisotropy) 개념 학습',
      'RIE 메커니즘과 플라즈마 식각 단계별 프로세스 이해',
      '식각 가스 종류(SF₆, CF₄, Cl₂, HBr)별 특성 비교',
      '식각 프로파일(수직, 테이퍼, 언더컷)에 영향을 주는 인자 분석'
    ],
    targetLevel: '중급',
    demoScope: '식각 공정 개요, 습식/건식 식각 메커니즘, 플라즈마 식각 프로세스, 3D 실리콘 식각 시뮬레이션(Three.js), 식각 가스 비교, 퀴즈',
    fullVersionExtras: 'HAR(High Aspect Ratio) 식각 시뮬레이션, ALE(Atomic Layer Etching), 식각 프로파일 최적화, 실제 레시피 설계',
    keywords: ['식각 공정', 'dry etching', 'wet etching', 'RIE', '선택비', '이방성', '반도체 식각', 'plasma etching'],
    relatedIds: ['plasma', 'deposition'],
    processContext: '식각은 플라즈마 기술을 활용하여 리소그래피 패턴을 물질에 전사하며, 이후 증착으로 새로운 층을 형성합니다.'
  },
  {
    id: 'deposition',
    name: 'Deposition 시뮬레이터',
    shortName: 'Deposition',
    icon: '📦',
    color: '#ff9800',
    summary: 'PVD, CVD, ALD 등 박막 증착 기술의 원리와 분자 거동을 시각적으로 학습합니다.',
    description: '증착(Deposition)은 웨이퍼 위에 절연막, 금속막, 배리어막 등의 박막을 형성하는 공정입니다. PVD(물리기상증착)는 증발이나 스퍼터링으로, CVD(화학기상증착)는 가스 화학 반응으로, ALD(원자층증착)는 자기 제한적 표면 반응으로 박막을 형성합니다. 각 기술은 두께 균일성, 단차 피복성, 증착 속도 등에서 고유한 장단점을 가집니다. 이 시뮬레이터에서는 각 증착 방식의 분자 수준 메커니즘을 시각화하고 비교 분석합니다.',
    learningObjectives: [
      'PVD(증발, 스퍼터링)의 물리적 증착 메커니즘 이해',
      'Thermal CVD와 PECVD의 화학 반응 원리 비교',
      'ALD의 자기 제한적 성장(Self-limiting Growth) 원리 학습',
      '단차 피복성(Step Coverage)과 증착 방식의 관계 파악',
      '공정 목적에 따른 최적 증착 기술 선택 기준 이해'
    ],
    targetLevel: '중급',
    demoScope: '증착 공정 개요, PVD 증발 분자 시뮬레이션, 스퍼터링 3D 시각화, Thermal CVD, PECVD, ALD 사이클 시뮬레이션, 퀴즈',
    fullVersionExtras: '다층 박막 설계, MOCVD/LPCVD 공정 시뮬레이션, 막질 분석(XRD, XRF), 실제 레시피 기반 증착 최적화',
    keywords: ['박막 증착', 'PVD', 'CVD', 'ALD', '스퍼터링', 'PECVD', '반도체 증착', 'thin film deposition'],
    relatedIds: ['etching', 'implantation'],
    processContext: '증착은 식각으로 패턴이 형성된 후 새로운 기능층(절연막, 금속막 등)을 형성하며, 이후 이온주입이나 배선 공정으로 이어집니다.'
  },
  {
    id: 'implantation',
    name: 'Implantation 시뮬레이터',
    shortName: 'Implantation',
    icon: '⚛️',
    color: '#00bcd4',
    summary: '이온주입과 확산 공정의 원리, Gaussian 프로파일, LSS 이론을 시뮬레이션으로 학습합니다.',
    description: '이온주입(Implantation)은 불순물 이온을 가속하여 실리콘 내부에 주입하는 도핑 공정입니다. 주입 에너지로 깊이를, 도즈량(Dose)으로 농도를 정밀하게 제어할 수 있어 현대 반도체 제조의 표준 도핑 방법입니다. 주입 후에는 어닐링(열처리)을 통해 격자 손상을 회복하고 불순물을 활성화합니다. 이 시뮬레이터에서는 에너지, 도즈에 따른 Gaussian 분포 프로파일, LSS 이론 기반 계산, 확산 공정 비교 등을 실험합니다.',
    learningObjectives: [
      '이온주입의 원리와 확산 도핑과의 차이 이해',
      '주입 에너지, 도즈량, 틸트 각도의 역할 학습',
      'Gaussian 분포 프로파일과 Rp(투사 비정) 개념 이해',
      'LSS(Lindhard-Scharff-Schiøtt) 이론의 기초 학습',
      '어닐링을 통한 격자 회복 및 불순물 활성화 과정 이해'
    ],
    targetLevel: '중급~고급',
    demoScope: '도핑 공정 5단계 이론, 이온주입 프로파일 시뮬레이션, 확산 공정 시뮬레이션, 어닐링 과정, 도즈/에너지 최적화, 퀴즈',
    fullVersionExtras: 'SIMS 프로파일 분석, 채널링 효과 시뮬레이션, 고에너지 주입(MeV), 다단계 주입 설계',
    keywords: ['이온주입', 'ion implantation', '도핑', 'Gaussian 프로파일', 'LSS 이론', '어닐링', '반도체 도핑', 'diffusion'],
    relatedIds: ['deposition', 'packaging'],
    processContext: '이온주입은 트랜지스터의 소스/드레인/채널 도핑에 사용되며, 이후 배선 공정으로 소자를 연결합니다.'
  },
  {
    id: 'packaging',
    name: '배선·검사·패키징 시뮬레이터',
    shortName: '배선검사패키징',
    icon: '🔌',
    color: '#607d8b',
    summary: '금속배선(Damascene), EDS 검사, 첨단 패키징(CoWoS, HBM) 기술을 시각적으로 학습합니다.',
    description: '반도체 후공정(Back-End)은 금속배선(Metallization), 전기적 검사(EDS), 패키징(Packaging)으로 구성됩니다. 금속배선은 Damascene 공정으로 Cu 다층 배선을 형성하고, EDS는 웨이퍼 상태에서 각 다이의 전기적 특성을 검사합니다. 패키징은 다이를 외부와 연결하고 보호하는 공정으로, 2.5D/3D 패키징(CoWoS, HBM, TSV)이 첨단 반도체의 핵심 기술로 부상하고 있습니다.',
    learningObjectives: [
      'Single/Dual Damascene 공정의 차이와 Cu 배선 형성 원리 이해',
      'EDS(Electrical Die Sorting) 5단계 검사 프로세스 학습',
      '웨이퍼 맵과 수율(Yield) 분석 방법 이해',
      '패키징 유형(DIP, QFP, BGA, CSP, FC-BGA) 비교',
      '2.5D/3D 첨단 패키징(CoWoS, HBM, TSV) 기술 학습'
    ],
    targetLevel: '중급~고급',
    demoScope: '다층 배선 구조 시각화, Damascene 시뮬레이션, EDS 5단계, 웨이퍼 맵 수율 시뮬레이션, 패키징 비교, 2.5D/3D 패키징, Wire Bonding vs Flip Chip, 퀴즈',
    fullVersionExtras: 'RC 지연 분석, EM(Electromigration) 시뮬레이션, 실제 수율 데이터 분석, 패키지 열 시뮬레이션',
    keywords: ['금속배선', 'Damascene', 'EDS', '반도체 패키징', 'CoWoS', 'HBM', 'TSV', '2.5D 패키징', '반도체 후공정'],
    relatedIds: ['implantation', 'vacuum'],
    processContext: '배선·검사·패키징은 반도체 제조의 마지막 단계이며, 완성된 칩은 다시 진공 장비 등에서 활용됩니다.'
  }
];

// 학습 경로 (반도체 공정 순서)
const learningPath = [
  'vacuum', 'cleaning', 'oxidation', 'lithography',
  'plasma', 'etching', 'deposition', 'implantation', 'packaging'
];

module.exports = { simulators, learningPath, guideDomain, mainPlatformUrl };
