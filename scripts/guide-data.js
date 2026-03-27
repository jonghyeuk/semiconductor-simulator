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
    appId: 'vacuum',
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
    processContext: '진공은 세정 이후 거의 모든 공정(산화, 증착, 식각, 이온주입)의 전제 조건이 됩니다.',
    tabs: [
      {
        id: 'pumping-simulation',
        slug: 'pumping',
        name: '펌핑 시뮬레이션',
        icon: '⚡',
        summary: '진공 펌프의 실시간 펌핑 과정을 시뮬레이션하며 진공 형성 원리를 직접 체험합니다.',
        description: '진공 챔버에서 로터리 펌프와 터보 펌프가 어떻게 기체 분자를 배기하는지 실시간으로 관찰합니다. 펌프 종류, 챔버 체적, 가스 부하량 등의 파라미터를 조절하며 펌핑 속도와 도달 압력의 관계를 직관적으로 이해할 수 있습니다. 시간에 따른 압력 변화 그래프를 통해 펌핑의 지수적 감소 특성도 확인합니다.',
        learningPoints: [
          '로터리 펌프와 터보 펌프의 펌핑 속도 차이 체험',
          '챔버 체적과 가스 부하가 도달 압력에 미치는 영향 확인',
          '시간-압력 곡선의 지수적 감소 패턴 이해',
          '저진공에서 고진공으로의 전환 과정 관찰'
        ],
        keywords: ['펌핑 시뮬레이션', '진공 펌프 원리', '터보 펌프 펌핑', '로터리 펌프 시뮬레이션', '진공 챔버 압력']
      },
      {
        id: 'performance-analysis',
        slug: 'performance',
        name: '성능 특성 곡선',
        icon: '📊',
        summary: '진공 펌프의 성능 특성 곡선을 분석하여 최적 운전 조건을 파악합니다.',
        description: '진공 펌프는 압력 범위에 따라 펌핑 속도가 달라집니다. 이 탭에서는 로터리 펌프, 터보 펌프, 크라이오 펌프 등 다양한 펌프의 성능 특성 곡선(S-P curve)을 비교 분석합니다. 각 펌프의 유효 작동 범위와 최대 효율 영역을 그래프로 확인하고, 공정 요구 조건에 맞는 펌프 선정 기준을 학습합니다.',
        learningPoints: [
          '펌프 종류별 S-P 곡선(펌핑 속도-압력) 특성 비교',
          '각 펌프의 유효 작동 압력 범위 파악',
          '공정 조건에 맞는 최적 펌프 선정 기준 이해',
          '다단 펌핑 시스템의 필요성 인식'
        ],
        keywords: ['진공 펌프 성능', '펌핑 속도 곡선', 'S-P curve', '진공 펌프 비교', '펌프 선정']
      },
      {
        id: 'process-control',
        slug: 'pressure-setting',
        name: '압력 세팅 실험',
        icon: '🔧',
        summary: '공정별 요구 압력을 설정하고 달성하는 과정을 실험합니다.',
        description: '반도체 각 공정은 서로 다른 진공도를 요구합니다. CVD는 수 Torr, PVD 스퍼터링은 mTorr 수준, MBE는 초고진공이 필요합니다. 이 탭에서는 목표 압력을 설정하고 펌프 조합과 밸브 제어를 통해 해당 압력에 도달하는 과정을 실험합니다. 실제 공정 환경에서의 압력 제어 감각을 기를 수 있습니다.',
        learningPoints: [
          '반도체 공정별 요구 진공도(저진공~초고진공) 구분',
          '목표 압력 달성을 위한 펌프 조합 전략 학습',
          '밸브 제어를 통한 압력 미세 조정 체험',
          '압력 측정 게이지(피라니, 이온 게이지 등)의 측정 범위 이해'
        ],
        keywords: ['진공 압력 제어', '공정별 진공도', '압력 세팅', '진공 게이지', '반도체 공정 압력']
      },
      {
        id: 'conductance-relation',
        slug: 'conductance',
        name: 'Conductance 계산',
        icon: '🔄',
        summary: '배관의 컨덕턴스가 진공 시스템 성능에 미치는 영향을 계산하고 분석합니다.',
        description: 'Conductance(컨덕턴스)는 배관이 기체를 얼마나 잘 전달하는지를 나타내는 지표입니다. 아무리 좋은 펌프를 사용해도 배관의 컨덕턴스가 낮으면 실효 펌핑 속도가 크게 떨어집니다. 이 탭에서는 배관 직경, 길이, 형상(직선/엘보/벨로즈)에 따른 컨덕턴스 변화를 계산하고, 직렬/병렬 연결 시 합성 컨덕턴스를 구합니다.',
        learningPoints: [
          '컨덕턴스의 정의와 실효 펌핑 속도(Seff) 관계 이해',
          '배관 직경·길이가 컨덕턴스에 미치는 영향 정량 분석',
          '분자류(molecular flow)와 점성류(viscous flow) 영역의 차이',
          '직렬·병렬 배관의 합성 컨덕턴스 계산'
        ],
        keywords: ['컨덕턴스', 'conductance 계산', '실효 펌핑 속도', '진공 배관', '분자류 점성류']
      },
      {
        id: 'pipe-design',
        slug: 'pipe-design',
        name: '배관 설계',
        icon: '🏗️',
        summary: '진공 배관 시스템을 설계하고 최적화하는 실습을 수행합니다.',
        description: '실제 반도체 FAB에서는 진공 챔버와 펌프 사이의 배관 설계가 전체 시스템 성능을 좌우합니다. 이 탭에서는 배관 경로, 직경, 밸브 배치 등을 직접 설계하고, 설계 결과가 도달 압력과 펌핑 시간에 미치는 영향을 시뮬레이션합니다. 최적 배관 설계를 위한 실무 가이드라인을 체득할 수 있습니다.',
        learningPoints: [
          '배관 경로 설계 시 고려해야 할 핵심 요소 파악',
          '밸브 종류(게이트, 앵글, 버터플라이)별 특성과 적용',
          '배관 설계 변경이 펌핑 시간과 도달 압력에 미치는 영향 확인',
          '실무에서 사용하는 배관 설계 가이드라인 학습'
        ],
        keywords: ['진공 배관 설계', '배관 최적화', '진공 밸브', '진공 시스템 설계', 'vacuum piping']
      },
      {
        id: 'troubleshooting',
        slug: 'troubleshooting',
        name: '트러블슈팅',
        icon: '🔧',
        summary: '진공 시스템의 대표적인 문제 상황을 진단하고 해결하는 능력을 기릅니다.',
        description: '진공 시스템에서 발생하는 리크(leak), 오염, 펌프 성능 저하 등의 문제를 시나리오 기반으로 진단하고 해결합니다. 실제 FAB에서 자주 발생하는 트러블 사례를 바탕으로 체계적인 문제 해결 프로세스를 학습합니다. 리크 탐지 방법, 펌프 성능 점검 절차, 오염원 분석 등 실무 필수 역량을 기를 수 있습니다.',
        learningPoints: [
          '진공 리크의 유형과 탐지 방법(헬륨 리크 테스트 등)',
          '펌프 성능 저하 원인 분석 및 대처 방안',
          '오염원(outgassing, backstreaming) 진단 절차',
          '체계적인 트러블슈팅 프로세스 학습'
        ],
        keywords: ['진공 트러블슈팅', '리크 테스트', '진공 문제 해결', 'outgassing', '진공 유지보수']
      }
    ]
  },
  {
    id: 'cleaning',
    name: '웨이퍼 세정 시뮬레이터',
    shortName: '웨이퍼 세정',
    icon: '🧽',
    color: '#4caf50',
    appId: 'cleaning',
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
    processContext: '세정은 모든 공정의 시작점이며, 산화·증착·리소그래피 전에 필수적으로 수행됩니다.',
    tabs: [
      {
        id: 'overview',
        slug: 'overview',
        name: '세정 공정 개요',
        icon: '🔄',
        summary: '반도체 세정 공정의 전체 흐름과 오염 유형별 제거 원리를 개관합니다.',
        description: '반도체 웨이퍼에는 파티클, 유기물, 금속 이온, 자연 산화막 등 다양한 오염이 존재합니다. 각 오염 유형은 서로 다른 화학적 메커니즘으로 제거해야 합니다. 이 탭에서는 RCA 세정의 전체 흐름(SC-1 → DHF → SC-2)을 단계별로 살펴보고, 각 단계에서 어떤 오염이 왜 제거되는지 화학 반응 수준에서 이해합니다.',
        learningPoints: [
          'RCA 세정 공정의 전체 흐름(SC-1, DHF, SC-2) 파악',
          '오염 유형(파티클, 유기물, 금속, 산화막)별 특성 이해',
          '각 세정 단계의 화학 반응 메커니즘 개관',
          '세정 공정이 수율에 미치는 영향 인식'
        ],
        keywords: ['세정 공정 개요', 'RCA 세정 흐름', '웨이퍼 오염 유형', '반도체 세정 단계', 'SC-1 SC-2 DHF']
      },
      {
        id: 'wet-cleaning',
        slug: 'wet-cleaning',
        name: '습식 세정 시뮬레이션',
        icon: '💧',
        summary: 'SC-1, SC-2, DHF 등 습식 세정 각 단계의 화학 반응과 오염 제거 과정을 실시간 시뮬레이션합니다.',
        description: '습식 세정(Wet Cleaning)은 화학 용액을 사용하여 웨이퍼 표면의 오염을 제거하는 방법입니다. SC-1(NH₄OH/H₂O₂)은 파티클과 유기물을, DHF(희석 HF)는 자연 산화막을, SC-2(HCl/H₂O₂)는 금속 이온을 제거합니다. 이 시뮬레이터에서는 각 용액의 농도, 온도, 처리 시간을 조절하며 제거 효율의 변화를 실시간으로 관찰합니다.',
        learningPoints: [
          'SC-1 용액의 파티클 리프트오프(lift-off) 메커니즘 이해',
          'DHF의 산화막 식각 속도와 농도의 관계 파악',
          'SC-2 용액의 금속 이온 착화(complexation) 반응 학습',
          '용액 온도·농도·시간이 세정 효율에 미치는 영향 실험'
        ],
        keywords: ['습식 세정', 'SC-1 세정', 'SC-2 세정', 'DHF 세정', 'RCA 습식 세정 시뮬레이션']
      },
      {
        id: 'dry-cleaning',
        slug: 'dry-cleaning',
        name: '건식 세정',
        icon: '⚡',
        summary: '플라즈마 기반 건식 세정 기술과 습식 세정과의 차이점을 비교 학습합니다.',
        description: '건식 세정(Dry Cleaning)은 플라즈마나 UV/오존을 이용하여 화학 용액 없이 오염을 제거하는 기술입니다. 미세 패턴 손상 없이 정밀한 세정이 가능하여 첨단 공정에서 활용이 늘어나고 있습니다. 이 탭에서는 건식 세정의 원리를 습식 세정과 비교하고, 각 방식의 장단점과 적용 분야를 체계적으로 정리합니다.',
        learningPoints: [
          '건식 세정(플라즈마, UV/O₃)의 오염 제거 메커니즘 이해',
          '습식 vs 건식 세정의 장단점 비교 분석',
          '미세 패턴에서 건식 세정이 필요한 이유 파악',
          '공정 노드별 습식/건식 세정 적용 전략'
        ],
        keywords: ['건식 세정', '플라즈마 세정', 'UV 오존 세정', '습식 건식 비교', 'dry cleaning semiconductor']
      },
      {
        id: 'ultrasonic',
        slug: 'ultrasonic',
        name: '초음파 세정',
        icon: '🌊',
        summary: '메가소닉/초음파 세정의 캐비테이션 원리와 파티클 제거 효과를 시각화합니다.',
        description: '초음파 세정은 고주파 음파가 세정액에 캐비테이션(공동현상)을 일으켜 미세 버블의 생성과 붕괴로 파티클을 제거하는 기술입니다. 반도체에서는 주로 메가소닉(MHz 대역) 주파수를 사용하여 패턴 손상을 최소화합니다. 이 탭에서는 캐비테이션 버블의 생성·성장·붕괴 과정을 시각적으로 관찰하고, 주파수와 파워가 세정 효과에 미치는 영향을 실험합니다.',
        learningPoints: [
          '캐비테이션(공동현상)의 물리적 원리 이해',
          '초음파(kHz)와 메가소닉(MHz) 주파수 대역의 차이',
          '주파수·파워가 파티클 제거 효율에 미치는 영향',
          '패턴 손상 없는 메가소닉 세정의 장점'
        ],
        keywords: ['초음파 세정', '메가소닉 세정', '캐비테이션', 'megasonic cleaning', '반도체 파티클 제거']
      }
    ]
  },
  {
    id: 'oxidation',
    name: 'Oxidation 시뮬레이터',
    shortName: 'Oxidation',
    icon: '🔥',
    color: '#ff5722',
    appId: 'oxidation',
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
    processContext: '산화는 세정 후 수행되며, 형성된 산화막은 리소그래피에서 패턴을 전사할 기판이 됩니다.',
    tabs: [
      {
        id: 'overview',
        slug: 'overview',
        name: '산화 공정 개요',
        icon: '🔥',
        summary: '열산화 공정의 기본 원리와 건식/습식 산화의 차이를 개관합니다.',
        description: '실리콘 산화는 Si 표면에 산소나 수증기를 공급하여 SiO₂를 성장시키는 공정입니다. 건식 산화(O₂)는 얇고 치밀한 고품질 막을, 습식 산화(H₂O)는 빠르고 두꺼운 막을 형성합니다. 이 탭에서는 산화 퍼니스의 구조, 산화 반응의 화학식, 건식/습식 산화의 특성 비교를 통해 산화 공정의 기초를 다집니다.',
        learningPoints: [
          '열산화 반응(Si + O₂ → SiO₂)의 기본 화학 이해',
          '건식 산화와 습식 산화의 성장 속도 및 막질 차이',
          '산화 퍼니스의 구조와 온도 프로파일',
          '게이트 산화막, 필드 산화막 등 용도별 요구사항'
        ],
        keywords: ['산화 공정 개요', '열산화 원리', '건식 습식 산화', '산화 퍼니스', 'SiO2 성장']
      },
      {
        id: 'thermal',
        slug: 'thermal',
        name: '열산화 실험 시뮬레이션',
        icon: '🌡️',
        summary: '온도, 시간, 산화 방식을 바꾸며 산화막 두께 변화를 실시간으로 실험합니다.',
        description: '산화막 두께는 온도, 시간, 산화 분위기(건식/습식)에 의해 결정됩니다. 이 시뮬레이터에서는 이 세 가지 변수를 자유롭게 조절하며 산화막 성장 과정을 실시간으로 관찰합니다. 높은 온도에서의 빠른 성장, 초기 선형 영역에서 포물선 영역으로의 전환 등 Deal-Grove 모델의 핵심 개념을 직접 체험합니다.',
        learningPoints: [
          '온도 변화에 따른 산화 속도의 지수적 증가 확인',
          '산화 시간에 따른 선형→포물선 성장 전환 관찰',
          '건식/습식 분위기에 따른 산화막 두께 차이 비교',
          '실제 공정 레시피 수준의 파라미터 감각 배양'
        ],
        keywords: ['열산화 시뮬레이션', '산화막 두께 실험', '산화 온도 영향', 'Deal-Grove 실험', '산화막 성장 시뮬레이션']
      },
      {
        id: 'analysis',
        slug: 'analysis',
        name: '산화 영향 인자 분석',
        icon: '📊',
        summary: 'Deal-Grove 모델 기반으로 산화막 성장에 영향을 주는 인자를 정량 분석합니다.',
        description: 'Deal-Grove 모델은 산화막 성장을 선형 속도 상수(B/A)와 포물선 속도 상수(B)로 설명합니다. 이 탭에서는 각 상수가 온도, 압력, 결정 방향 등에 어떻게 의존하는지 그래프로 분석합니다. 초기 산화(thin regime)에서의 보정 계수, 도펀트 농도의 영향 등 심화 내용도 다룹니다.',
        learningPoints: [
          'Deal-Grove 모델의 선형 계수(B/A)와 포물선 계수(B) 의미',
          '온도·압력이 각 계수에 미치는 영향 정량 파악',
          '결정 방향((100) vs (111))에 따른 산화 속도 차이',
          '초기 산화 영역(thin oxide regime)의 특수성 이해'
        ],
        keywords: ['Deal-Grove 모델', '산화 영향 인자', '산화 속도 상수', '산화막 분석', 'oxide growth rate']
      },
      {
        id: 'troubleshooting',
        slug: 'troubleshooting',
        name: '산화 트러블슈팅',
        icon: '🔧',
        summary: '산화 공정에서 발생하는 대표적인 문제 상황을 진단하고 해결합니다.',
        description: '산화 공정에서는 막 두께 불균일, 핀홀(pinhole), 표면 거칠기 증가, 도펀트 재분배 등의 문제가 발생할 수 있습니다. 이 탭에서는 실제 FAB에서 자주 겪는 산화 공정 불량 사례를 시나리오로 제시하고, 원인을 분석하여 해결하는 과정을 연습합니다.',
        learningPoints: [
          '산화막 두께 불균일의 원인(온도 분포, 가스 유량) 분석',
          '핀홀과 표면 결함의 발생 원인 및 방지법',
          '도펀트 재분배(segregation)와 산화 공정의 관계',
          '산화 공정 불량에 대한 체계적 분석 방법'
        ],
        keywords: ['산화 트러블슈팅', '산화막 불량', '핀홀 결함', '도펀트 재분배', '산화 공정 문제']
      }
    ]
  },
  {
    id: 'lithography',
    name: 'Lithography 시뮬레이터',
    shortName: 'Lithography',
    icon: '💡',
    color: '#9c27b0',
    appId: 'lithograph',
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
    processContext: '리소그래피로 만든 PR 패턴은 이후 식각 공정에서 마스크 역할을 하여 회로를 형성합니다.',
    tabs: [
      {
        id: 'overview1',
        slug: 'process-overview',
        name: '포토리소그래피 공정 개요',
        icon: '📋',
        summary: '포토리소그래피 8단계(HMDS~현상) 공정의 전체 흐름을 단계별로 학습합니다.',
        description: '포토리소그래피는 HMDS 처리, PR 도포, 소프트 베이크, 정렬/노광, PEB(Post Exposure Bake), 현상, 하드 베이크, 검사의 8단계로 이루어집니다. 각 단계는 정밀한 조건 제어가 필요하며, 하나의 단계라도 최적화되지 않으면 패턴 불량이 발생합니다. 이 탭에서는 각 단계의 목적, 핵심 파라미터, 공정 윈도우를 순차적으로 학습합니다.',
        learningPoints: [
          'HMDS 처리의 목적(접착력 향상)과 원리',
          'PR 도포부터 현상까지 8단계 공정 흐름 파악',
          '각 단계의 핵심 파라미터와 공정 윈도우 이해',
          'Positive PR과 Negative PR의 차이 및 선택 기준'
        ],
        keywords: ['포토리소그래피 공정', '리소그래피 8단계', 'HMDS', 'PR 도포', '노광 현상 공정']
      },
      {
        id: 'overview2',
        slug: 'equipment-overview',
        name: '노광 장비 개요',
        icon: '📷',
        summary: 'Stepper, Scanner, EUV 장비 등 노광 시스템의 구조와 발전 과정을 학습합니다.',
        description: '노광 장비는 마스크의 패턴을 빛으로 PR에 전사하는 핵심 장비입니다. 초기의 Contact/Proximity 방식에서 Stepper(축소투영), Scanner(스캔 방식)로 발전했으며, 현재 EUV(극자외선) 리소그래피가 최첨단 공정에 도입되고 있습니다. 이 탭에서는 각 노광 방식의 구조와 동작 원리, 해상도 한계를 비교합니다.',
        learningPoints: [
          'Contact → Proximity → Stepper → Scanner 발전 과정',
          'Stepper의 축소투영 방식과 Step & Repeat 동작 원리',
          'Scanner의 슬릿 스캔 방식과 해상도 향상 원리',
          'EUV 광원(13.5nm)의 특수성과 반사형 광학계'
        ],
        keywords: ['노광 장비', 'Stepper Scanner', 'EUV 리소그래피', '노광 시스템', '반도체 노광 장비']
      },
      {
        id: 'process',
        slug: 'pr-coating',
        name: 'PR Coating RPM 시뮬레이션',
        icon: '⚙️',
        summary: 'PR(감광제) 코팅의 RPM, 점도, 시간을 조절하며 막 두께와 균일도를 최적화합니다.',
        description: 'PR 코팅은 스핀 코팅(Spin Coating) 방식으로 이루어지며, RPM(회전 속도), PR 점도, 코팅 시간이 최종 막 두께와 균일도를 결정합니다. 이 시뮬레이터에서는 RPM을 높이면 막이 얇아지고, 점도가 높으면 막이 두꺼워지는 관계를 직접 실험합니다. 웨이퍼 가장자리 효과(edge bead)와 결함 발생 조건도 확인합니다.',
        learningPoints: [
          'RPM과 PR 막 두께의 반비례 관계(t ∝ 1/√RPM) 확인',
          'PR 점도가 막 두께와 균일도에 미치는 영향',
          '스핀 코팅 시 edge bead 발생 메커니즘',
          '최적 코팅 조건(RPM, 시간, 가속도) 탐색 실험'
        ],
        keywords: ['PR 코팅', '스핀 코팅 시뮬레이션', 'RPM 최적화', '감광제 도포', 'spin coating']
      },
      {
        id: 'exposure',
        slug: 'exposure',
        name: 'DUV/EUV 노광 비교',
        icon: '💡',
        summary: 'DUV(193nm)와 EUV(13.5nm) 노광 기술의 해상도와 패터닝 성능을 비교 체험합니다.',
        description: 'DUV(Deep Ultraviolet, 193nm)는 ArF 레이저를 광원으로 사용하며, 액침(immersion) 기술과 다중 패터닝으로 미세화를 추구합니다. EUV(Extreme Ultraviolet, 13.5nm)는 플라즈마 광원에서 발생하는 극자외선을 사용하여 단일 노광으로 미세 패턴을 구현합니다. 이 탭에서는 두 기술의 해상도, CD 균일도, 공정 복잡도를 직접 비교합니다.',
        learningPoints: [
          'DUV ArF 레이저(193nm)의 해상도 한계와 극복 방법',
          'EUV(13.5nm) 광원 생성 원리와 반사형 광학계',
          '해상도 공식(R = k₁·λ/NA)에 따른 성능 비교',
          'DUV 다중 패터닝 vs EUV 단일 노광의 장단점'
        ],
        keywords: ['DUV EUV 비교', 'ArF 노광', 'EUV 리소그래피', '반도체 해상도', '노광 기술 비교']
      }
    ]
  },
  {
    id: 'plasma',
    name: 'Plasma 시뮬레이터',
    shortName: 'Plasma',
    icon: '⚡',
    color: '#2196f3',
    appId: 'plasma',
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
    processContext: '플라즈마는 식각과 증착의 에너지원으로, 리소그래피 이후 패턴을 실제 물질에 전사하는 핵심 기술입니다.',
    tabs: [
      {
        id: 'plasma-basics',
        slug: 'basics',
        name: '플라즈마 기본 개념',
        icon: '⚡',
        appId: 'plasma',
        summary: '플라즈마의 정의, 생성 조건, 전자-이온 충돌 메커니즘을 학습합니다.',
        description: '플라즈마는 기체에 충분한 에너지를 가하면 전자와 이온으로 분리되는 "제4의 물질 상태"입니다. 반도체 공정에서는 RF 전력을 이용해 공정 가스를 이온화시킵니다. 이 탭에서는 플라즈마의 기본 물성(전자 온도, 이온 밀도, 디바이 길이), 생성 메커니즘, 반도체 공정에서의 역할을 체계적으로 정리합니다.',
        learningPoints: [
          '플라즈마의 정의와 제4의 물질 상태 이해',
          '전자-중성 분자 충돌에 의한 이온화 메커니즘',
          '전자 온도, 이온 밀도, 디바이 길이 등 기본 물성',
          '반도체 공정에서 플라즈마가 필요한 이유'
        ],
        keywords: ['플라즈마 기본', '플라즈마 정의', '이온화 메커니즘', '전자 온도', '반도체 플라즈마 기초']
      },
      {
        id: 'plasma-principle1',
        slug: 'paschen-curve',
        name: '파션 커브 시뮬레이션',
        icon: '🔬',
        appId: 'plasma',
        summary: '파션 커브(Paschen Curve)를 조작하며 가스 방전 조건을 이해합니다.',
        description: '파션 커브는 기체의 항복 전압(breakdown voltage)이 압력×거리(pd)의 곱에 따라 어떻게 변하는지를 나타내는 곡선입니다. 최소 항복 전압이 존재하는 특징적인 U자 형태를 가지며, 이를 이해하면 플라즈마 점화 조건을 예측할 수 있습니다. 이 시뮬레이터에서는 가스 종류, 압력, 전극 간격을 바꾸며 파션 커브의 변화를 직접 관찰합니다.',
        learningPoints: [
          '파션 커브의 U자 형태와 최소 항복 전압의 의미',
          '압력×거리(pd)가 방전 조건을 결정하는 원리',
          '가스 종류(Ar, N₂, O₂ 등)별 파션 커브 특성 차이',
          '실제 플라즈마 점화 시 파션 커브의 활용'
        ],
        keywords: ['파션 커브', 'Paschen curve', '가스 방전', '항복 전압', '플라즈마 점화 조건']
      },
      {
        id: 'rf-matching',
        slug: 'rf-matching',
        name: 'RF 매칭 네트워크',
        icon: '📡',
        appId: 'plasma',
        summary: 'RF 전력 전달을 위한 임피던스 매칭 네트워크의 원리를 시뮬레이션합니다.',
        description: 'RF 전력을 플라즈마에 효율적으로 전달하려면 임피던스 매칭이 필수적입니다. 플라즈마의 임피던스는 가변적이므로, L-type 또는 π-type 매칭 네트워크로 실시간 정합을 수행합니다. 이 탭에서는 매칭 네트워크의 L, C 값을 조절하며 반사 전력을 최소화하는 과정을 체험합니다. Smith chart 위에서 임피던스 이동 경로도 시각화합니다.',
        learningPoints: [
          'RF 임피던스 매칭의 필요성(반사 전력 최소화)',
          'L-type 매칭 네트워크의 구조와 동작 원리',
          'Smith chart에서의 임피던스 이동 경로 이해',
          '플라즈마 임피던스 변동에 대한 자동 매칭 개념'
        ],
        keywords: ['RF 매칭', '임피던스 매칭', 'Smith chart', 'RF 전력 전달', '매칭 네트워크']
      },
      {
        id: 'system-structure',
        slug: 'ccp-structure',
        name: 'CCP 시스템 구조',
        icon: '🏗️',
        appId: 'plasma',
        summary: '용량결합 플라즈마(CCP) 시스템의 구조와 동작 특성을 학습합니다.',
        description: 'CCP(Capacitively Coupled Plasma)는 두 평행 전극 사이에 RF 전력을 인가하여 플라즈마를 생성하는 방식입니다. 구조가 단순하고 이온 에너지 제어가 용이하여 식각 공정에 널리 사용됩니다. 이 탭에서는 CCP의 전극 구조, 쉬스(sheath) 형성, DC 자기 바이어스, 이중 주파수(dual frequency) CCP 등을 분석합니다.',
        learningPoints: [
          'CCP의 평행 평판 전극 구조와 플라즈마 생성 원리',
          '쉬스(sheath) 영역의 형성과 이온 가속 메커니즘',
          'DC 자기 바이어스(self-bias)의 발생 원리',
          '단일 주파수 vs 이중 주파수 CCP의 차이'
        ],
        keywords: ['CCP', '용량결합 플라즈마', '평행 평판 전극', 'self-bias', '이중 주파수 CCP']
      },
      {
        id: 'system-structure-icp',
        slug: 'icp-structure',
        name: 'ICP 시스템 구조',
        icon: '🔬',
        appId: 'plasma-ii',
        summary: '유도결합 플라즈마(ICP) 시스템의 4단계 프로세스와 고밀도 플라즈마 특성을 학습합니다.',
        description: 'ICP(Inductively Coupled Plasma)는 코일에 RF 전력을 인가하여 유도 전기장으로 플라즈마를 생성하는 방식입니다. CCP보다 높은 플라즈마 밀도를 달성할 수 있으며, 이온 에너지와 밀도를 독립적으로 제어할 수 있는 장점이 있습니다. 이 탭에서는 ICP의 코일 구조, 전력 결합 메커니즘, 4단계 플라즈마 생성 프로세스를 학습합니다.',
        learningPoints: [
          'ICP 코일 구조(나선형, 평판형)와 유도 전기장 생성',
          '유도결합(H-mode)과 용량결합(E-mode) 모드 전환',
          'ICP 4단계 플라즈마 생성 프로세스 이해',
          'CCP 대비 ICP의 고밀도 플라즈마 장점'
        ],
        keywords: ['ICP', '유도결합 플라즈마', '고밀도 플라즈마', 'ICP 코일', 'H-mode E-mode']
      },
      {
        id: 'etching-process',
        slug: 'synergy-effect',
        name: 'Synergy Effect 실험',
        icon: '⚙️',
        appId: 'plasma-ii',
        summary: 'Ion과 Radical의 시너지 효과가 식각 속도와 프로파일에 미치는 영향을 실험합니다.',
        description: '플라즈마 식각에서는 화학적 식각(Radical)과 물리적 식각(Ion bombardment)이 동시에 작용합니다. 이 두 메커니즘의 조합은 각각 단독으로 작용할 때보다 훨씬 높은 식각 속도를 만들어내는데, 이를 Synergy Effect라 합니다. 이 시뮬레이터에서는 Ion 에너지와 Radical flux를 독립적으로 조절하며 시너지 효과의 크기를 정량적으로 확인합니다.',
        learningPoints: [
          'Chemical etching(Radical)과 Physical etching(Ion)의 차이',
          'Synergy Effect: 1+1 > 2가 되는 메커니즘 이해',
          'Ion 에너지와 Radical flux 비율에 따른 식각 특성 변화',
          'Synergy Effect를 활용한 이방성 식각 프로파일 구현'
        ],
        keywords: ['Synergy Effect', '플라즈마 식각 시너지', 'ion radical 시너지', '이방성 식각', '반도체 식각 메커니즘']
      },
      {
        id: 'equipment-application',
        slug: 'industry-application',
        name: '플라즈마 장비 산업 응용',
        icon: '🏭',
        appId: 'plasma-ii',
        summary: '반도체 산업에서 사용되는 다양한 플라즈마 장비와 응용 분야를 학습합니다.',
        description: '반도체 FAB에서는 공정 목적에 따라 다양한 플라즈마 장비를 사용합니다. 식각에는 CCP/ICP 장비가, CVD에는 PECVD 장비가, 세정에는 플라즈마 애싱 장비가 활용됩니다. 이 탭에서는 각 응용 분야별 플라즈마 장비의 구성, 가스 시스템, 공정 조건, 최신 기술 동향을 종합적으로 학습합니다.',
        learningPoints: [
          '식각용 플라즈마 장비(RIE, ICP-RIE, ECR) 비교',
          'PECVD 장비의 구조와 증착 조건',
          '플라즈마 애싱(ashing)과 표면 처리 장비',
          '최신 플라즈마 장비 기술 동향(ALD, ALE)'
        ],
        keywords: ['플라즈마 장비', '반도체 플라즈마 응용', 'RIE ICP-RIE', 'PECVD 장비', '플라즈마 애싱']
      }
    ]
  },
  {
    id: 'etching',
    name: 'Etching 시뮬레이터',
    shortName: 'Etching',
    icon: '⚗️',
    color: '#e91e63',
    appId: 'etching',
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
    processContext: '식각은 플라즈마 기술을 활용하여 리소그래피 패턴을 물질에 전사하며, 이후 증착으로 새로운 층을 형성합니다.',
    tabs: [
      {
        id: 'overview',
        slug: 'overview',
        name: '식각 공정 개요',
        icon: '📋',
        summary: '식각 공정의 분류와 핵심 개념(선택비, 이방성)을 개관합니다.',
        description: '식각은 원하지 않는 물질을 제거하여 패턴을 형성하는 공정입니다. 크게 습식 식각(Wet Etching)과 건식 식각(Dry Etching)으로 분류되며, 각각 등방성과 이방성이라는 근본적으로 다른 프로파일 특성을 가집니다. 이 탭에서는 식각의 기본 분류, 선택비(Selectivity)와 이방성(Anisotropy)의 정의, 식각 공정이 소자 구조 형성에서 하는 역할을 학습합니다.',
        learningPoints: [
          '습식 식각(등방성)과 건식 식각(이방성)의 기본 분류',
          '선택비(Selectivity) = 대상막 식각률 / 하부막 식각률의 의미',
          '이방성(Anisotropy) = 1 - (횡방향/종방향 식각률)의 의미',
          '공정 노드 미세화에 따른 건식 식각의 필요성'
        ],
        keywords: ['식각 공정 개요', '선택비 이방성', '습식 건식 식각 분류', '반도체 식각 기초', 'etching selectivity']
      },
      {
        id: 'etch-elements',
        slug: 'etch-elements',
        name: '식각 요소 분석',
        icon: '🔬',
        summary: '식각 가스(SF₆, CF₄, Cl₂, HBr)별 특성과 식각 메커니즘을 비교합니다.',
        description: '건식 식각에서 사용하는 가스 종류에 따라 식각 속도, 선택비, 프로파일이 크게 달라집니다. SF₆는 빠른 Si 식각에, CF₄는 SiO₂ 식각에, Cl₂는 Al/Si 식각에, HBr은 높은 선택비의 Si 식각에 주로 사용됩니다. 이 탭에서는 각 가스의 해리 반응, 활성종 생성, 표면 반응 메커니즘을 비교하고 RIE 조건별 최적 가스를 선택하는 기준을 학습합니다.',
        learningPoints: [
          '주요 식각 가스(SF₆, CF₄, Cl₂, HBr)의 특성 비교',
          '각 가스의 해리 반응과 활성종(radical, ion) 생성',
          '가스 혼합비가 식각 선택비와 프로파일에 미치는 영향',
          '대상 물질(Si, SiO₂, Si₃N₄)별 최적 가스 선택 기준'
        ],
        keywords: ['식각 가스', 'SF6 CF4 식각', '식각 가스 비교', 'RIE 가스 선택', '반도체 식각 가스']
      },
      {
        id: 'process',
        slug: 'etch-process',
        name: '3D 식각 시뮬레이션',
        icon: '🧪',
        summary: 'Three.js 기반 3D 시각화로 실리콘 식각 과정을 실시간 관찰합니다.',
        description: '실리콘 식각 과정을 3D로 시각화하여 식각 프로파일의 형성 과정을 직관적으로 이해합니다. 이온 에너지, 가스 유량, 압력 등의 파라미터를 조절하며 수직 프로파일, 테이퍼 프로파일, 보잉(bowing), 언더컷 등 다양한 식각 형상이 만들어지는 과정을 관찰합니다. 실시간 렌더링으로 파라미터 변화에 따른 프로파일 변화를 즉시 확인할 수 있습니다.',
        learningPoints: [
          '식각 프로파일(수직, 테이퍼, 보잉, 언더컷) 형태별 특성',
          '이온 에너지가 이방성에 미치는 영향 시각 확인',
          '가스 유량·압력이 식각 속도와 프로파일에 미치는 영향',
          'Over-etch와 Under-etch의 판별 기준'
        ],
        keywords: ['3D 식각 시뮬레이션', '식각 프로파일', '실리콘 식각 시각화', '보잉 언더컷', 'etch profile simulation']
      },
      {
        id: 'analysis',
        slug: 'si-etch-mechanism',
        name: 'Si 식각 메커니즘',
        icon: '📊',
        summary: '실리콘 표면에서 일어나는 식각 반응을 단계별로 분석합니다.',
        description: '실리콘 식각은 (1) 반응 가스 흡착, (2) 표면 반응, (3) 생성물 탈착의 3단계로 진행됩니다. 불소계 가스(SF₆, CF₄)를 사용할 경우 F radical이 Si 표면에 흡착되어 SiF₄를 형성하고, 이 휘발성 생성물이 표면에서 탈착됩니다. 이 탭에서는 각 단계의 반응 메커니즘, 율속 단계(rate-limiting step), 이온 보조 식각(ion-assisted etching)의 역할을 분석합니다.',
        learningPoints: [
          'Si 식각 3단계(흡착 → 반응 → 탈착) 메커니즘',
          '율속 단계가 식각 특성을 결정하는 원리',
          '이온 보조 식각(ion-assisted etching)의 역할',
          '패시베이션층(passivation layer) 형성과 이방성의 관계'
        ],
        keywords: ['Si 식각 메커니즘', '실리콘 식각 반응', '이온 보조 식각', '패시베이션층', 'silicon etch mechanism']
      }
    ]
  },
  {
    id: 'deposition',
    name: 'Deposition 시뮬레이터',
    shortName: 'Deposition',
    icon: '📦',
    color: '#ff9800',
    appId: 'deposition',
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
    processContext: '증착은 식각으로 패턴이 형성된 후 새로운 기능층(절연막, 금속막 등)을 형성하며, 이후 이온주입이나 배선 공정으로 이어집니다.',
    tabs: [
      {
        id: 'pvd-evap',
        slug: 'pvd-evaporation',
        name: 'PVD 증발 시뮬레이션',
        icon: '🔥',
        summary: '열 증발(Thermal Evaporation) 방식의 분자 거동과 박막 형성 과정을 3D로 체험합니다.',
        description: '열 증발법은 도가니(crucible)에서 물질을 가열하여 증기화시킨 뒤, 증기 분자가 기판에 도달하여 박막을 형성하는 PVD 기술입니다. 이 시뮬레이터에서는 증발 분자의 비행 경로, 기판 위치에 따른 두께 분포, 증발원 온도와 증착 속도의 관계를 시각적으로 관찰합니다. 코사인 법칙에 따른 방향성 분포도 확인합니다.',
        learningPoints: [
          '열 증발법의 기본 원리와 증발원 구조',
          '증발 분자의 코사인 방향 분포(cosine law)',
          '기판 위치에 따른 막 두께 균일도 변화',
          '증발원 온도와 증착 속도의 관계'
        ],
        keywords: ['PVD 증발', 'thermal evaporation', '열 증발법', '증발 분자 시뮬레이션', '박막 증착 PVD']
      },
      {
        id: 'pvd-sputtering',
        slug: 'pvd-sputtering',
        name: 'PVD 스퍼터링',
        icon: '🎯',
        summary: '아르곤 이온 충돌에 의한 스퍼터링 메커니즘과 박막 형성을 3D로 시각화합니다.',
        description: '스퍼터링은 Ar⁺ 이온이 타겟 물질에 충돌하여 원자를 튀어나오게 하고(sputter), 이 원자가 기판에 증착되는 PVD 기술입니다. DC 스퍼터링과 RF 스퍼터링, 마그네트론 스퍼터링 등 다양한 방식이 있습니다. 이 시뮬레이터에서는 이온 충돌 → 원자 방출 → 기판 도달의 전 과정을 3D로 시각화하고, 공정 압력, RF 파워가 증착 특성에 미치는 영향을 실험합니다.',
        learningPoints: [
          '스퍼터링의 물리적 메커니즘(운동량 전달)',
          'DC 스퍼터링과 RF 스퍼터링의 차이',
          '마그네트론 스퍼터링의 자기장 역할',
          '공정 압력·RF 파워에 따른 증착 속도와 막질 변화'
        ],
        keywords: ['스퍼터링', 'PVD sputtering', '마그네트론 스퍼터링', 'RF 스퍼터링', '스퍼터링 시뮬레이션']
      },
      {
        id: 'cvd-thermal',
        slug: 'cvd-thermal',
        name: 'Thermal CVD 시뮬레이션',
        icon: '🌡️',
        summary: '고온 열분해에 의한 화학기상증착(CVD)의 반응 메커니즘을 시뮬레이션합니다.',
        description: 'Thermal CVD는 전구체(precursor) 가스를 고온(400~900°C)으로 가열하여 열분해시키고, 분해된 반응종이 기판 위에서 화학 반응하여 박막을 형성합니다. 이 시뮬레이터에서는 가스 유동, 경계층 형성, 표면 반응, 박막 성장의 전 과정을 시각화합니다. 온도, 압력, 가스 유량이 증착 속도와 균일도에 미치는 영향을 실험합니다.',
        learningPoints: [
          'Thermal CVD의 가스 운반 → 흡착 → 반응 → 탈착 메커니즘',
          '반응 율속(reaction-limited)과 물질 전달 율속(mass-transport-limited) 영역',
          '온도에 따른 증착 속도의 아레니우스 관계',
          'LPCVD vs APCVD의 균일도 차이 원리'
        ],
        keywords: ['Thermal CVD', '화학기상증착', 'LPCVD', 'CVD 반응 메커니즘', '열분해 증착']
      },
      {
        id: 'cvd-pecvd',
        slug: 'pecvd',
        name: 'PECVD 시뮬레이션',
        icon: '⚡',
        summary: '플라즈마 보조 CVD(PECVD)의 저온 증착 원리와 막질 특성을 학습합니다.',
        description: 'PECVD(Plasma Enhanced CVD)는 플라즈마의 에너지를 이용하여 전구체 가스의 분해 온도를 낮추는 기술입니다. 200~400°C의 비교적 낮은 온도에서 증착이 가능하여 금속 배선 위의 절연막 등 온도 제약이 있는 공정에 필수적입니다. 이 시뮬레이터에서는 RF 파워, 가스 조성, 압력이 SiO₂, SiNₓ 막의 증착 속도와 품질에 미치는 영향을 실험합니다.',
        learningPoints: [
          'PECVD의 저온 증착 원리(플라즈마 활성화)',
          'Thermal CVD 대비 PECVD의 장단점 비교',
          'RF 파워·가스 비율이 막질(굴절률, 응력)에 미치는 영향',
          'SiO₂, SiNₓ PECVD 막의 특성과 응용'
        ],
        keywords: ['PECVD', '플라즈마 CVD', '저온 증착', 'PECVD SiO2', 'PECVD 시뮬레이션']
      },
      {
        id: 'ald',
        slug: 'ald',
        name: 'ALD 사이클 시뮬레이션',
        icon: '⚛️',
        summary: '원자층증착(ALD)의 자기 제한적 성장 사이클을 단계별로 체험합니다.',
        description: 'ALD(Atomic Layer Deposition)는 전구체 A 투입 → 퍼지 → 반응제 B 투입 → 퍼지의 4단계 사이클을 반복하여 원자 한 층씩 박막을 성장시키는 기술입니다. 자기 제한적(self-limiting) 표면 반응 덕분에 옹스트롬 수준의 두께 제어가 가능합니다. 이 시뮬레이터에서는 ALD 사이클을 직접 돌려보며 포화 곡선, 성장률(GPC), 온도 윈도우를 관찰합니다.',
        learningPoints: [
          'ALD 4단계 사이클(전구체/퍼지/반응제/퍼지)의 역할',
          '자기 제한적 성장(self-limiting growth)의 원리',
          'GPC(Growth Per Cycle)와 온도 윈도우 개념',
          'ALD의 우수한 단차 피복성(conformality)과 응용'
        ],
        keywords: ['ALD', '원자층증착', 'ALD 사이클', 'self-limiting growth', 'atomic layer deposition']
      }
    ]
  },
  {
    id: 'implantation',
    name: 'Implantation 시뮬레이터',
    shortName: 'Implantation',
    icon: '⚛️',
    color: '#00bcd4',
    appId: 'implantation',
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
    processContext: '이온주입은 트랜지스터의 소스/드레인/채널 도핑에 사용되며, 이후 배선 공정으로 소자를 연결합니다.',
    tabs: [
      {
        id: 'diffusion',
        slug: 'diffusion',
        name: '확산 공정 시뮬레이션',
        icon: '📈',
        summary: '열확산(Thermal Diffusion)에 의한 도펀트 분포 변화를 시뮬레이션합니다.',
        description: '열확산은 고온에서 도펀트 원자가 농도 구배를 따라 이동하는 도핑 방법입니다. Fick의 법칙에 따라 확산 프로파일이 결정되며, 온도와 시간이 핵심 파라미터입니다. 이 시뮬레이터에서는 확산 온도, 시간, 표면 농도를 조절하며 도펀트 프로파일의 변화를 실시간으로 관찰합니다. 일정 표면 농도(predeposition)와 일정 총량(drive-in) 조건을 비교합니다.',
        learningPoints: [
          'Fick의 제1법칙과 제2법칙의 물리적 의미',
          '일정 표면 농도(erfc) vs 일정 총량(Gaussian) 프로파일',
          '확산 온도·시간에 따른 접합 깊이(xj) 변화',
          '도펀트 종류(B, P, As)별 확산 계수 차이'
        ],
        keywords: ['확산 공정', 'thermal diffusion', 'Fick 법칙', '도펀트 확산', '확산 프로파일']
      },
      {
        id: 'implantation',
        slug: 'ion-implantation',
        name: '이온주입 프로파일 시뮬레이션',
        icon: '🎯',
        summary: '주입 에너지와 도즈량을 조절하며 Gaussian 프로파일 변화를 실험합니다.',
        description: '이온주입에서 주입 에너지는 이온의 침투 깊이(Rp, projected range)를, 도즈량(Dose)은 주입 농도를 결정합니다. 이 시뮬레이터에서는 에너지(keV~MeV), 도즈(10¹²~10¹⁶ cm⁻²), 이온 종류(B⁺, P⁺, As⁺)를 선택하며 Gaussian 분포 프로파일이 어떻게 변하는지 실시간으로 확인합니다. ΔRp(straggle)에 따른 분포 폭 변화도 관찰합니다.',
        learningPoints: [
          '주입 에너지와 Rp(투사 비정)의 관계',
          '도즈량이 피크 농도에 미치는 영향',
          'ΔRp(straggle)가 분포 폭을 결정하는 원리',
          '이온 종류(B, P, As)별 질량 차이에 따른 프로파일 차이'
        ],
        keywords: ['이온주입 프로파일', 'Gaussian 분포', 'Rp projected range', '이온주입 시뮬레이션', 'ion implantation profile']
      },
      {
        id: 'comparison',
        slug: 'process-comparison',
        name: '확산 vs 이온주입 비교',
        icon: '🔄',
        summary: '확산 도핑과 이온주입 도핑의 장단점과 적용 분야를 비교 분석합니다.',
        description: '확산과 이온주입은 모두 반도체 도핑 기술이지만, 근본적으로 다른 메커니즘을 가집니다. 확산은 고온 열평형 과정이고, 이온주입은 비평형 물리적 과정입니다. 이 탭에서는 두 기술의 도즈 제어 정밀도, 접합 깊이 제어, 프로파일 형태, 격자 손상, 생산성 등을 체계적으로 비교합니다.',
        learningPoints: [
          '확산과 이온주입의 메커니즘 차이(열평형 vs 비평형)',
          '도즈 제어 정밀도: 이온주입의 우수성',
          '접합 깊이 독립 제어: 이온주입의 장점',
          '현대 반도체에서 이온주입이 주류가 된 이유'
        ],
        keywords: ['확산 이온주입 비교', '도핑 방법 비교', 'diffusion vs implantation', '반도체 도핑 기술', '확산 이온주입 장단점']
      },
      {
        id: 'temperature',
        slug: 'annealing',
        name: 'Annealing 효과 시뮬레이션',
        icon: '🌡️',
        summary: '이온주입 후 어닐링에 의한 격자 회복과 도펀트 활성화를 시뮬레이션합니다.',
        description: '이온주입은 결정격자에 심각한 손상을 유발하며, 어닐링(열처리)을 통해 격자를 회복하고 도펀트를 전기적으로 활성화해야 합니다. 어닐링 온도와 시간에 따라 격자 회복률, 도펀트 활성화율, 확산에 의한 프로파일 변화가 달라집니다. 이 시뮬레이터에서는 어닐링 조건을 조절하며 이 세 가지 효과의 균형을 체험합니다.',
        learningPoints: [
          '이온주입 격자 손상(point defect, amorphization)의 유형',
          '어닐링 온도에 따른 격자 회복 메커니즘(SPE, 재결정)',
          '도펀트 전기적 활성화율과 시트 저항의 관계',
          '과도한 어닐링에 의한 프로파일 확산(broadening) 문제'
        ],
        keywords: ['어닐링', 'annealing 효과', '격자 회복', '도펀트 활성화', '이온주입 어닐링']
      },
      {
        id: 'rta',
        slug: 'rta',
        name: 'RTA(급속 열처리) 시뮬레이션',
        icon: '⚙️',
        summary: '급속 열처리(Rapid Thermal Annealing)로 확산을 억제하며 활성화하는 기술을 체험합니다.',
        description: 'RTA(Rapid Thermal Annealing)는 수 초~수십 초의 짧은 시간에 900~1100°C 고온으로 가열하여, 도펀트 확산은 최소화하면서 활성화는 달성하는 기술입니다. 램프 가열(halogen lamp)로 급속 승온/냉각이 가능합니다. 이 시뮬레이터에서는 RTA 온도, 시간을 조절하며 기존 퍼니스 어닐링과의 프로파일 차이를 비교합니다.',
        learningPoints: [
          'RTA의 급속 승온/냉각 메커니즘(램프 가열)',
          '짧은 열처리 시간으로 확산 억제 + 활성화 달성 원리',
          'RTA vs 퍼니스 어닐링의 프로파일 비교',
          'USJ(Ultra Shallow Junction) 형성에서의 RTA 역할'
        ],
        keywords: ['RTA', '급속 열처리', 'rapid thermal annealing', 'USJ', '이온주입 RTA']
      },
      {
        id: 'application',
        slug: 'application-guide',
        name: '이온주입 적용 가이드',
        icon: '💡',
        summary: '트랜지스터 구조별 이온주입 적용 사례와 최적 조건을 학습합니다.',
        description: 'MOSFET 제조에서 이온주입은 웰(Well) 형성, 채널 도핑(Vth 조절), 소스/드레인 도핑, LDD(Lightly Doped Drain) 형성 등 다양한 목적으로 사용됩니다. 각 용도에 따라 이온 종류, 에너지, 도즈가 다르게 설정됩니다. 이 탭에서는 MOSFET 구조의 각 도핑 영역별 이온주입 조건과 설계 기준을 종합적으로 학습합니다.',
        learningPoints: [
          'MOSFET 구조별 이온주입 적용 영역(Well, 채널, S/D, LDD)',
          '각 영역의 이온 종류, 에너지, 도즈 설정 기준',
          'Vth 조절을 위한 채널 도핑 최적화',
          'LDD 구조의 필요성과 이온주입 조건'
        ],
        keywords: ['이온주입 적용', 'MOSFET 도핑', '채널 도핑', 'LDD 이온주입', '이온주입 가이드']
      }
    ]
  },
  {
    id: 'packaging',
    name: '배선·검사·패키징 시뮬레이터',
    shortName: '배선검사패키징',
    icon: '🔌',
    color: '#607d8b',
    appId: 'metallization-eds-packaging',
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
    processContext: '배선·검사·패키징은 반도체 제조의 마지막 단계이며, 완성된 칩은 다시 진공 장비 등에서 활용됩니다.',
    tabs: [
      {
        id: 'metallization',
        slug: 'metallization',
        name: '금속배선 시뮬레이션',
        icon: '🔌',
        summary: '다층 금속배선의 구조와 Cu 배선 형성 원리를 시각적으로 학습합니다.',
        description: '현대 반도체는 10층 이상의 다층 금속배선(Multi-level Metallization)을 사용합니다. 하위 층은 미세 피치로 로컬 연결을, 상위 층은 굵은 배선으로 글로벌 연결을 담당합니다. Al에서 Cu로의 전환, 배리어 메탈(TaN/Ta)의 역할, CMP에 의한 평탄화 등 배선 공정의 핵심을 3D 구조 시각화로 학습합니다.',
        learningPoints: [
          '다층 금속배선의 계층 구조(M1~M10+) 이해',
          'Al 배선에서 Cu 배선으로의 전환 이유',
          '배리어 메탈(TaN/Ta)과 시드층의 역할',
          'CMP(Chemical Mechanical Polishing)에 의한 평탄화'
        ],
        keywords: ['금속배선', '다층 배선', 'Cu 배선', '배리어 메탈', '반도체 metallization']
      },
      {
        id: 'damascene',
        slug: 'damascene',
        name: 'Damascene 공정 시뮬레이션',
        icon: '⚙️',
        summary: 'Single/Dual Damascene 공정의 단계별 진행 과정을 시뮬레이션합니다.',
        description: 'Damascene 공정은 절연막에 먼저 트렌치(홈)를 식각한 후 Cu를 채우고 CMP로 평탄화하는 배선 형성 방법입니다. Single Damascene은 비아와 배선을 별도로, Dual Damascene은 동시에 형성합니다. 이 시뮬레이터에서는 각 공정 단계(식각 → 배리어/시드 증착 → Cu 전기도금 → CMP)를 순차적으로 체험하며 Dual Damascene의 효율성을 이해합니다.',
        learningPoints: [
          'Single Damascene vs Dual Damascene의 공정 흐름 비교',
          'Via-first와 Trench-first 방식의 차이',
          'Cu 전기도금(Electroplating)의 원리와 void-free 충전',
          'CMP 연마에 의한 Cu 평탄화 메커니즘'
        ],
        keywords: ['Damascene 공정', 'Single Dual Damascene', 'Cu 전기도금', 'CMP 평탄화', '반도체 배선 공정']
      },
      {
        id: 'eds',
        slug: 'eds',
        name: 'EDS 검사 시뮬레이션',
        icon: '🔍',
        summary: 'EDS(Electrical Die Sorting) 5단계 검사 프로세스와 웨이퍼 맵 수율 분석을 체험합니다.',
        description: 'EDS는 웨이퍼 상태에서 각 다이(Die)의 전기적 특성을 검사하여 양품/불량을 판별하는 공정입니다. 프로브 카드로 각 다이의 패드에 접촉하여 Open/Short, 누설전류, 동작 속도 등을 테스트합니다. 이 시뮬레이터에서는 EDS 5단계(Contact Test → Leakage → Function → Speed → Burn-in)를 순차 수행하고 웨이퍼 맵으로 수율을 분석합니다.',
        learningPoints: [
          'EDS 5단계 검사 항목과 각 단계의 목적',
          '프로브 카드(Probe Card)의 구조와 접촉 메커니즘',
          '웨이퍼 맵(Wafer Map) 작성과 수율 분석 방법',
          '불량 패턴(edge, cluster, random)별 원인 추정'
        ],
        keywords: ['EDS 검사', 'Electrical Die Sorting', '웨이퍼 맵', '프로브 카드', '반도체 수율 분석']
      },
      {
        id: 'packaging',
        slug: 'packaging-types',
        name: '패키징 유형 비교',
        icon: '📦',
        summary: '반도체 패키징의 종류(DIP, QFP, BGA, FC-BGA)와 발전 과정을 비교합니다.',
        description: '반도체 패키징은 칩을 외부 회로와 연결하고 물리적으로 보호하는 공정입니다. DIP, QFP 등 초기 패키지에서 BGA, CSP, FC-BGA 등 고밀도 패키지로 발전해 왔습니다. 이 탭에서는 각 패키지 유형의 구조, 핀 수, 열 특성, 전기적 성능을 비교하고, 응용 분야별 최적 패키지 선택 기준을 학습합니다.',
        learningPoints: [
          '패키징 발전 과정(DIP → QFP → BGA → CSP → FC-BGA)',
          '각 패키지의 구조적 특징과 핀 밀도 비교',
          '열 저항(Thermal Resistance)과 방열 설계',
          'Wire Bonding vs Flip Chip 연결 방식 비교'
        ],
        keywords: ['반도체 패키징', '패키지 유형', 'BGA FC-BGA', 'Wire Bonding Flip Chip', '패키지 비교']
      },
      {
        id: 'bonding',
        slug: 'advanced-packaging',
        name: '2.5D/3D 첨단 패키징',
        icon: '🔗',
        summary: 'CoWoS, HBM, TSV 등 첨단 2.5D/3D 패키징 기술을 학습합니다.',
        description: '무어의 법칙 한계를 극복하기 위해 2.5D/3D 패키징이 부상하고 있습니다. TSMC의 CoWoS는 실리콘 인터포저 위에 여러 다이를 횡배치하는 2.5D 기술이고, HBM(High Bandwidth Memory)은 DRAM 다이를 TSV로 수직 적층하는 3D 기술입니다. 이 탭에서는 TSV(Through Silicon Via)의 구조, CoWoS 인터포저, HBM 스택 등 최신 패키징 기술을 시각적으로 학습합니다.',
        learningPoints: [
          'TSV(Through Silicon Via)의 구조와 제조 공정',
          'CoWoS 인터포저의 역할과 2.5D 패키징 구조',
          'HBM의 DRAM 다이 적층과 TSV 연결',
          '2.5D/3D 패키징이 AI/HPC 칩에 필수인 이유'
        ],
        keywords: ['첨단 패키징', 'CoWoS', 'HBM', 'TSV', '2.5D 3D 패키징', '반도체 첨단 패키징']
      }
    ]
  }
];

// 학습 경로 (반도체 공정 순서)
const learningPath = [
  'vacuum', 'cleaning', 'oxidation', 'lithography',
  'plasma', 'etching', 'deposition', 'implantation', 'packaging'
];

module.exports = { simulators, learningPath, guideDomain, mainPlatformUrl };
