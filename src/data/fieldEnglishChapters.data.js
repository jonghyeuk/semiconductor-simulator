/* AUTO-GENERATED from 15-week syllabus (multi-agent authored). Do not hand-edit; regenerate. */
export const CONTENT_CHAPTERS = [
 {
  "id": "w1",
  "title": "1주 · 오리엔테이션 · 기본 용어",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "첫 출근 — 반도체 라인에 서다",
    "text": "여러분은 오늘 반도체 공장(Fab)에 첫 출근했다. 방진복을 입고 클린룸에 들어서자 커다란 은색 장비들이 줄지어 있다. 선임이 다가와 영어로 말한다. **\"This is the etch chamber. Check the vacuum before you load the wafer.\"** 무슨 뜻인지 몰라 당황했다. 이 과목은 바로 이런 순간, 현장에서 실제로 쓰는 **직무 영어**를 익히기 위한 것이다. 장비(Equipment), 알람(Alarm), 설계 검증(DRC/LVS), 보고서(Report)까지 12주 동안 하나씩 배운다."
   },
   {
    "type": "read",
    "title": "이 과목은 무엇을 배우나",
    "intro": "교과목 개요",
    "paras": [
     "이 과목은 반도체 현장에서 실제로 쓰이는 영어를 다룬다. 문법 시험용 영어가 아니라, 장비 화면(HMI)에 뜨는 문장, 매뉴얼 지시문, 외국인 엔지니어와의 짧은 대화처럼 '바로 써먹는' 영어다.",
     "반도체 직무는 크게 세 갈래로 나뉜다. 첫째 장비·공정(Equipment/Process) 직무는 장비를 운전하고 공정을 관리한다. 둘째 설계(Design) 직무는 회로와 레이아웃을 그리고 검증한다. 셋째 품질·분석 직무는 불량을 찾고 보고서를 쓴다. 어느 직무든 영어 용어와 문장을 피할 수 없다.",
     "매주 우리는 짧은 이론(read)으로 개념을 잡고, 용어(glossary)를 외우고, 실제 매뉴얼 문장(manual)을 해석하고, 시뮬레이터(sim)로 장비를 조작해 본다. 오늘 1주차는 첫날인 만큼 각 분야를 넓게 맛본다."
    ]
   },
   {
    "type": "read",
    "title": "반도체가 만들어지는 과정 한눈에",
    "paras": [
     "반도체 칩은 얇고 둥근 실리콘 판인 웨이퍼(Wafer) 위에 수백 번의 공정을 반복해 만든다. 대표적인 공정 두 가지가 증착(Deposition)과 식각(Etch)이다.",
     "증착은 웨이퍼 표면에 얇은 막(Layer)을 새로 입히는 것이고, 식각은 필요 없는 부분을 깎아 내는 것이다. 마치 도화지에 물감을 칠하고(증착), 필요 없는 곳을 지우개로 지우는(식각) 것과 비슷하다.",
     "이 모든 공정은 챔버(Chamber)라는 밀폐된 방 안에서 진행된다. 챔버 안은 대부분 진공(Vacuum) 상태로 유지되며, 어떤 가스를 얼마나 넣고 온도·시간을 어떻게 줄지는 레시피(Recipe)라는 설정값으로 정해진다."
    ]
   },
   {
    "type": "glossary",
    "title": "기본 용어 6개 — 공정과 장비",
    "intro": "오늘 반드시 외울 핵심 용어",
    "items": [
     {
      "en": "Wafer",
      "ko": "웨이퍼",
      "d": "칩을 만드는 얇고 둥근 실리콘 판.",
      "ex": "Load the wafer into the chamber."
     },
     {
      "en": "Chamber",
      "ko": "챔버",
      "d": "공정이 진행되는 밀폐된 방.",
      "ex": "The chamber is under vacuum."
     },
     {
      "en": "Vacuum",
      "ko": "진공",
      "d": "공기를 빼낸 저압 상태.",
      "ex": "Check the vacuum level before you start."
     },
     {
      "en": "Recipe",
      "ko": "레시피",
      "d": "공정 조건을 담은 설정값.",
      "ex": "Load recipe number 3 for this lot."
     },
     {
      "en": "Process",
      "ko": "공정",
      "d": "웨이퍼를 가공하는 하나의 단계.",
      "ex": "The etch process takes 60 seconds."
     },
     {
      "en": "Etch",
      "ko": "식각",
      "d": "표면을 깎아 내는 공정.",
      "ex": "The etch step removes the oxide layer."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 퀴즈 1",
    "intro": "방금 배운 용어를 확인하자.",
    "questions": [
     {
      "prompt": "“Wafer”의 뜻은?",
      "opts": [
       "웨이퍼(실리콘 판)",
       "챔버",
       "진공"
      ],
      "ans": 0
     },
     {
      "prompt": "“Vacuum”의 뜻은?",
      "opts": [
       "레시피",
       "진공",
       "식각"
      ],
      "ans": 1
     },
     {
      "prompt": "표면을 깎아 내는 공정을 뜻하는 단어는?",
      "opts": [
       "Deposition",
       "Recipe",
       "Etch"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "glossary",
    "title": "기본 용어 6개 — 조금 더",
    "items": [
     {
      "en": "Deposition",
      "ko": "증착",
      "d": "표면에 얇은 막을 입히는 공정.",
      "ex": "The deposition step adds a thin film."
     },
     {
      "en": "Layer",
      "ko": "레이어/막",
      "d": "웨이퍼 위에 쌓인 얇은 층.",
      "ex": "This layer is 100 nanometers thick."
     },
     {
      "en": "Gas",
      "ko": "가스",
      "d": "공정에 쓰이는 반응 기체.",
      "ex": "The gas flows into the chamber."
     },
     {
      "en": "Load",
      "ko": "로드(투입)",
      "d": "웨이퍼를 장비에 넣는 것.",
      "ex": "Load the wafer, then close the door."
     },
     {
      "en": "Unload",
      "ko": "언로드(반출)",
      "d": "웨이퍼를 장비에서 꺼내는 것.",
      "ex": "Unload the wafer after the process ends."
     },
     {
      "en": "Equipment",
      "ko": "장비",
      "d": "공정을 수행하는 기계.",
      "ex": "This equipment runs the etch process."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 퀴즈 2",
    "questions": [
     {
      "prompt": "“Deposition”의 뜻은?",
      "opts": [
       "증착(막 입히기)",
       "식각",
       "언로드"
      ],
      "ans": 0
     },
     {
      "prompt": "웨이퍼를 장비에 '넣는' 동작을 뜻하는 단어는?",
      "opts": [
       "Unload",
       "Load",
       "Layer"
      ],
      "ans": 1
     },
     {
      "prompt": "“Equipment”의 뜻은?",
      "opts": [
       "가스",
       "레이어",
       "장비"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "acr",
    "title": "약어 — 첫날 맛보기",
    "items": [
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "장비 조작 화면(사람-기계 인터페이스)"
     },
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사(설계 검증)"
     },
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃-회로도 비교 검증"
     },
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비(정기 점검)"
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파(플라스마 발생에 사용)"
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 문장 읽기",
    "mtitle": "MANUAL · Chamber Loading Procedure",
    "paras": [
     "Before you start, **check the vacuum level** on the HMI screen.",
     "Open the load door and **place the wafer** on the stage.",
     "Close the door and **select the recipe** for this process.",
     "Press START. The system will pump the chamber to vacuum.",
     "When the process ends, **unload the wafer** and record the result."
    ]
   },
   {
    "type": "quiz",
    "title": "매뉴얼 해석 퀴즈",
    "intro": "위 매뉴얼 문장의 뜻을 골라라.",
    "questions": [
     {
      "prompt": "“Check the vacuum level on the HMI screen.” 의 뜻은?",
      "opts": [
       "HMI 화면에서 진공 수준을 확인하라",
       "웨이퍼를 꺼내라",
       "레시피를 삭제하라"
      ],
      "ans": 0
     },
     {
      "prompt": "“Select the recipe for this process.” 의 뜻은?",
      "opts": [
       "문을 열어라",
       "이 공정에 맞는 레시피를 선택하라",
       "장비를 끄라"
      ],
      "ans": 1
     },
     {
      "prompt": "“Unload the wafer and record the result.” 의 뜻은?",
      "opts": [
       "웨이퍼를 투입하라",
       "가스를 넣어라",
       "웨이퍼를 꺼내고 결과를 기록하라"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 장비 구성도 살펴보기",
    "which": "partDiagram",
    "intro": "장비 구성도에서 각 부품을 클릭해 이름과 역할을 확인하자. 챔버, 로드락, 펌프, 가스 라인이 어디에 있는지 눈으로 익힌다. 영어 명칭과 위치를 함께 기억하는 것이 목표다."
   },
   {
    "type": "sim",
    "title": "실습 — 식각 챔버 라벨 그림",
    "which": "chamber",
    "intro": "식각 장비(Etch Chamber)의 각 부위에 영어 라벨을 붙여 보자. Wafer, Chamber, Vacuum pump, Gas inlet, RF electrode 위치를 확인하고, 오늘 배운 용어가 실제 장비 어디에 해당하는지 연결한다."
   },
   {
    "type": "read",
    "title": "각 분야 맛보기 — 장비·알람·DRC·LVS·보고",
    "intro": "앞으로 배울 분야를 한 장으로 훑어 본다.",
    "paras": [
     "장비(Equipment): 현장에서는 HMI 화면을 보며 웨이퍼를 로드하고 레시피를 선택한다. 화면 버튼과 상태 표시는 대부분 영어다. 예: LOAD, START, IDLE, RUN.",
     "알람(Alarm): 장비에 문제가 생기면 영어 알람 메시지가 뜬다. 예: \"Vacuum error. Check the pump.\" 이 문장을 빠르게 읽고 무엇을 점검할지 판단하는 것이 실무 능력이다.",
     "설계 검증(DRC/LVS): 칩을 설계하면 규칙 위반이 없는지 검사한다. DRC(Design Rule Check)는 선폭·간격 같은 물리 규칙을, LVS(Layout Versus Schematic)는 그린 레이아웃이 회로도와 같은지를 확인한다.",
     "보고(Report): 하루 작업이 끝나면 영문 보고서를 쓴다. 예: \"Lot A123 passed. No defects found.\" 짧고 명확하게 결과를 전달하는 문장을 배운다."
    ]
   },
   {
    "type": "quiz",
    "title": "분야 이해 퀴즈",
    "questions": [
     {
      "prompt": "장비에 문제가 생겼을 때 화면에 뜨는 영어 경고 메시지를 무엇이라 하나?",
      "opts": [
       "Recipe",
       "Alarm",
       "Wafer"
      ],
      "ans": 1
     },
     {
      "prompt": "설계한 레이아웃이 회로도와 같은지 비교하는 검증은?",
      "opts": [
       "LVS",
       "PM",
       "HMI"
      ],
      "ans": 0
     },
     {
      "prompt": "선폭·간격 같은 물리 설계 규칙을 검사하는 것은?",
      "opts": [
       "Report",
       "DRC",
       "Vacuum"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "read",
    "title": "로그와 알람 문장 읽는 법",
    "paras": [
     "장비 로그(Log)는 장비가 스스로 기록하는 작업 일지다. 시간과 상태가 짧은 영어로 남는다. 예: \"10:05 Wafer loaded / 10:06 Vacuum OK / 10:07 Process start.\"",
     "알람 문장은 보통 '무엇이 잘못됐는가 + 무엇을 하라'의 구조다. 예: \"Vacuum error. Check the pump.\" 앞부분이 문제, 뒷부분이 조치다. 이 구조만 알아도 대부분의 알람을 해석할 수 있다.",
     "실무 팁: 모르는 단어가 있어도 error, check, close, open, start, stop 같은 핵심 동사와 명사만 잡으면 무엇을 해야 할지 감이 온다."
    ]
   },
   {
    "type": "quiz",
    "title": "로그·알람 해석 퀴즈",
    "questions": [
     {
      "prompt": "로그 “Vacuum OK” 는 무슨 뜻인가?",
      "opts": [
       "진공 상태 정상",
       "진공 오류",
       "웨이퍼 없음"
      ],
      "ans": 0
     },
     {
      "prompt": "알람 “Vacuum error. Check the pump.” 에서 '조치'에 해당하는 부분은?",
      "opts": [
       "Vacuum error",
       "Check the pump",
       "둘 다 아니다"
      ],
      "ans": 1
     },
     {
      "prompt": "로그 “Wafer loaded” 는 무슨 뜻인가?",
      "opts": [
       "웨이퍼가 투입됨",
       "웨이퍼가 깨짐",
       "공정이 끝남"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "선임 엔지니어가 챔버 상태를 확인하라고 한다. 무엇을 먼저 봐야 하는지 묻고 싶다.",
      "q": {
       "en": "What should I check before I load the wafer?",
       "ko": "웨이퍼를 넣기 전에 무엇을 확인해야 하나요?"
      },
      "a": {
       "en": "Check the vacuum level on the HMI first.",
       "ko": "먼저 HMI에서 진공 수준을 확인하세요."
      }
     },
     {
      "sit": "어떤 레시피를 선택해야 할지 몰라 물어본다.",
      "q": {
       "en": "Which recipe should I use for this wafer?",
       "ko": "이 웨이퍼에는 어떤 레시피를 써야 하나요?"
      },
      "a": {
       "en": "Use recipe number 3 for the etch process.",
       "ko": "식각 공정에는 3번 레시피를 쓰세요."
      }
     },
     {
      "sit": "장비 화면에 알람이 떠서 상황을 설명하려 한다.",
      "q": {
       "en": "There is a vacuum error. What should I do?",
       "ko": "진공 오류가 떴어요. 어떻게 해야 하나요?"
      },
      "a": {
       "en": "Stop the process and check the pump.",
       "ko": "공정을 멈추고 펌프를 확인하세요."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "반도체 직무 영어는 시험용이 아니라 현장에서 바로 쓰는 실무 영어다.",
     "핵심 용어: wafer, chamber, vacuum, recipe, process, etch, deposition, layer, load/unload.",
     "앞으로 배울 분야: 장비(HMI), 알람, DRC/LVS(설계 검증), 보고서. 알람 문장은 '문제 + 조치' 구조로 읽는다."
    ],
    "done": "**1주 완료 ✓** — 첫날 기본 용어와 각 분야 맛보기를 마쳤다."
   }
  ]
 },
 {
  "id": "w2",
  "title": "2주 · 장비 구성요소",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "현장 이야기 — 장비 앞에 처음 서다",
    "text": "입사 첫 주, 선배가 식각 장비 앞으로 데려간다. **\"이게 Chamber, 위에 붙은 게 Turbo Pump, 옆에 Gate Valve.\"** 영어 이름이 쏟아진다. 매뉴얼도 전부 영어다. 부품 이름을 모르면 알람이 떠도 어디를 봐야 할지 알 수 없다. 이번 주는 장비의 **주요 구성요소(Main Components)** 이름과 역할을, 영어로 익힌다."
   },
   {
    "type": "read",
    "title": "장비는 어떻게 이루어져 있나",
    "intro": "반도체 공정 장비는 여러 부품이 모여 하나의 시스템을 이룬다.",
    "paras": [
     "웨이퍼를 가공하는 공간이 **Chamber(챔버)** 다. 그 안을 진공으로 만들기 위해 **Pump(펌프)** 가 공기를 빨아낸다. 특히 높은 진공에는 초고속으로 도는 **Turbo Pump(터보 펌프)** 를 쓴다.",
     "챔버와 펌프, 가스 라인 사이는 **Valve(밸브)** 로 열고 닫는다. 큰 통로를 막는 문 같은 밸브가 **Gate Valve(게이트 밸브)** 다.",
     "공정에 쓰는 가스는 **Gas Line(가스 라인)** 을 따라 들어오는데, 그 양을 정밀하게 조절하는 부품이 **MFC** 다. 플라즈마를 만들려면 **RF Generator(RF 제너레이터)** 가 고주파 전력을 공급한다. 웨이퍼는 **Wafer Chuck(웨이퍼 척)** 위에 고정된다."
    ]
   },
   {
    "type": "read",
    "title": "왜 부품 이름을 영어로 알아야 하나",
    "intro": "현장 매뉴얼과 화면, 로그는 대부분 영어다.",
    "paras": [
     "장비를 만든 회사가 외국계이거나, 반도체 표준 용어가 영어로 굳어져 있어서 부품 이름은 거의 영어 그대로 쓴다. **한국어로 번역하지 않고 그냥 'Chamber', 'Chuck' 이라고 부른다.**",
     "그래서 영어 이름을 모르면 선배의 지시도, 매뉴얼의 경고문도 이해하기 어렵다. 이번 주 목표는 6개 핵심 부품의 이름과 역할을 영어로 정확히 익히는 것이다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "items": [
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량 유량 제어기 (가스 양 조절)"
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "무선 주파수(고주파)"
     },
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeter per Minute",
      "ko": "표준 분당 유량 단위"
     },
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 핵심 부품 (1)",
    "intro": "부품 이름을 영어로 익히자.",
    "items": [
     {
      "en": "Chamber",
      "ko": "챔버",
      "d": "웨이퍼를 가공하는 밀폐된 공간.",
      "ex": "The wafer is loaded into the chamber."
     },
     {
      "en": "Turbo Pump",
      "ko": "터보 펌프",
      "d": "초고속 회전으로 높은 진공을 만드는 펌프.",
      "ex": "The turbo pump creates high vacuum."
     },
     {
      "en": "Gate Valve",
      "ko": "게이트 밸브",
      "d": "챔버와 펌프 사이 큰 통로를 여닫는 밸브.",
      "ex": "Close the gate valve before venting."
     },
     {
      "en": "Gas Line",
      "ko": "가스 라인",
      "d": "공정 가스가 흐르는 배관.",
      "ex": "Check the gas line for leaks."
     },
     {
      "en": "MFC",
      "ko": "엠에프씨",
      "d": "가스 유량을 정밀하게 제어하는 부품.",
      "ex": "The MFC controls the gas flow rate."
     },
     {
      "en": "Wafer Chuck",
      "ko": "웨이퍼 척",
      "d": "웨이퍼를 고정하는 받침대.",
      "ex": "The wafer sits on the chuck."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 부품 이름 (1)",
    "intro": "방금 배운 용어를 확인하자.",
    "questions": [
     {
      "prompt": "웨이퍼를 가공하는 밀폐 공간은?",
      "opts": [
       "Chamber",
       "Gas Line",
       "Turbo Pump"
      ],
      "ans": 0
     },
     {
      "prompt": "높은 진공을 만드는 부품은?",
      "opts": [
       "Gate Valve",
       "Turbo Pump",
       "Wafer Chuck"
      ],
      "ans": 1
     },
     {
      "prompt": "가스 유량을 조절하는 부품 약어는?",
      "opts": [
       "RF",
       "PM",
       "MFC"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 핵심 부품 (2)",
    "intro": "전력과 진공 관련 용어를 더 익히자.",
    "items": [
     {
      "en": "RF Generator",
      "ko": "RF 제너레이터",
      "d": "플라즈마를 만드는 고주파 전력을 공급한다.",
      "ex": "The RF generator supplies power to the plasma."
     },
     {
      "en": "Vacuum",
      "ko": "진공",
      "d": "공기를 빼낸 낮은 압력 상태.",
      "ex": "The chamber is under vacuum."
     },
     {
      "en": "Pump",
      "ko": "펌프",
      "d": "챔버 안 공기를 빨아내는 장치.",
      "ex": "The pump removes air from the chamber."
     },
     {
      "en": "Valve",
      "ko": "밸브",
      "d": "유체나 가스 통로를 열고 닫는 부품.",
      "ex": "Open the valve slowly."
     },
     {
      "en": "Flow Rate",
      "ko": "유량",
      "d": "단위 시간당 흐르는 가스의 양(sccm).",
      "ex": "Set the flow rate to 50 sccm."
     },
     {
      "en": "Leak",
      "ko": "누설",
      "d": "가스나 진공이 새는 현상.",
      "ex": "We found a small leak in the line."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 부품 이름 (2)",
    "questions": [
     {
      "prompt": "\"RF Generator\"의 역할은?",
      "opts": [
       "웨이퍼 고정",
       "플라즈마용 고주파 전력 공급",
       "가스 배출"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Leak\"의 뜻은?",
      "opts": [
       "누설(샘)",
       "진공",
       "유량"
      ],
      "ans": 0
     },
     {
      "prompt": "유량 단위 \"sccm\"이 나타내는 것은?",
      "opts": [
       "압력",
       "온도",
       "가스 유량"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 구성도에서 부품 찾기",
    "which": "partDiagram",
    "intro": "가상 장비 구성도에서 각 부품을 클릭해 영어 이름과 역할을 확인하세요. Chamber, Turbo Pump, Gate Valve, MFC(Gas Line), RF Generator, Wafer Chuck 을 하나씩 눌러 위치를 익힙니다."
   },
   {
    "type": "manual",
    "title": "매뉴얼 — Main Components",
    "mtitle": "MANUAL · 3. Main Components",
    "paras": [
     "**3.1 Chamber** — The chamber holds the wafer during the process. Keep it under vacuum before starting.",
     "**3.2 Turbo Pump** — The turbo pump creates high vacuum. Do not stop it while the gate valve is open.",
     "**3.3 Gate Valve** — The gate valve connects the chamber and the pump. **Close it before venting the chamber.**",
     "**3.4 Gas Line (MFC)** — Each gas line has an MFC (Mass Flow Controller). It sets the flow rate in sccm.",
     "**3.5 RF Generator** — The RF generator supplies power to create the plasma. Check the cable before use.",
     "**3.6 Wafer Chuck** — The wafer chuck holds the wafer in place during the process."
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 — Safety Notes",
    "mtitle": "MANUAL · 4. Safety Notes",
    "paras": [
     "**Warning:** Never open the chamber while it is under vacuum.",
     "**Caution:** Check the RF cable connection before turning on the RF generator.",
     "Always **close the gate valve** before you vent the chamber.",
     "If you see an alarm, **stop the process** and call the equipment engineer."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 매뉴얼 해석",
    "intro": "위 영어 매뉴얼 문장의 뜻을 골라보자.",
    "questions": [
     {
      "prompt": "\"Close it before venting the chamber.\" 의 지시는?",
      "opts": [
       "챔버 벤트 전에 게이트 밸브를 닫아라",
       "챔버를 열어라",
       "펌프를 꺼라"
      ],
      "ans": 0
     },
     {
      "prompt": "\"It sets the flow rate in sccm.\" 에서 It 이 가리키는 것은?",
      "opts": [
       "Chamber",
       "MFC",
       "RF Generator"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Do not stop it while the gate valve is open.\" 의 뜻은?",
      "opts": [
       "게이트 밸브가 열려 있을 때 터보 펌프를 멈추지 마라",
       "게이트 밸브를 항상 열어둬라",
       "펌프를 자주 멈춰라"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 계기판 읽기",
    "which": "devicePanel",
    "intro": "LED 상태등과 진동 계기판을 보며 장비 상태를 읽으세요. 초록 LED(Ready), 빨강 LED(Alarm), 펌프 진동(Vibration) 수치를 영어 라벨과 함께 확인합니다."
   },
   {
    "type": "sim",
    "title": "실습 — 식각 장비 라벨 익히기",
    "which": "chamber",
    "intro": "식각 장비 단면 그림에서 Chamber, Wafer Chuck, Gas Line, RF Generator 등 부품 라벨을 영어로 확인하며 위치를 다시 한번 정리하세요."
   },
   {
    "type": "read",
    "title": "장비 로그와 상태 표시 읽기",
    "intro": "장비는 상태를 영어로 화면과 로그에 표시한다.",
    "paras": [
     "정상 대기 상태는 **Ready** 또는 **Idle** 로 표시된다. 공정이 도는 중이면 **Running** 이나 **Processing** 이 뜬다.",
     "문제가 생기면 로그에 **Alarm** 이나 **Fault** 가 기록된다. 예를 들어 \"Gate valve not closed\" 는 게이트 밸브가 닫히지 않았다는 뜻이고, \"MFC flow error\" 는 가스 유량 제어에 문제가 생겼다는 뜻이다.",
     "부품 이름을 알면 로그 한 줄만 봐도 어느 부품을 봐야 하는지 바로 알 수 있다. **부품 이름 = 문제 위치의 열쇠** 다."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 로그 해석",
    "questions": [
     {
      "prompt": "로그에 \"Gate valve not closed\" 가 떴다. 어디를 봐야 하나?",
      "opts": [
       "게이트 밸브",
       "RF 제너레이터",
       "웨이퍼 척"
      ],
      "ans": 0
     },
     {
      "prompt": "\"MFC flow error\" 는 무엇의 문제인가?",
      "opts": [
       "가스 유량 제어",
       "진공 펌프 회전",
       "챔버 온도"
      ],
      "ans": 0
     },
     {
      "prompt": "정상 대기 상태를 나타내는 표시는?",
      "opts": [
       "Fault",
       "Ready",
       "Alarm"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "외국인 엔지니어에게 진공이 안 잡히는 원인을 물어본다.",
      "q": {
       "en": "The chamber is not reaching vacuum. Is the turbo pump running?",
       "ko": "챔버 진공이 안 잡혀요. 터보 펌프 돌고 있나요?"
      },
      "a": {
       "en": "Yes, but check the gate valve. It may not be fully open.",
       "ko": "네, 하지만 게이트 밸브를 확인하세요. 완전히 안 열렸을 수 있어요."
      }
     },
     {
      "sit": "가스 유량이 이상해서 부품 이름을 확인한다.",
      "q": {
       "en": "The gas flow looks unstable. Which MFC controls this line?",
       "ko": "가스 유량이 불안정해 보여요. 이 라인은 어느 MFC가 제어하죠?"
      },
      "a": {
       "en": "The MFC number two. Set it to 50 sccm and watch the reading.",
       "ko": "2번 MFC예요. 50 sccm으로 맞추고 값을 지켜보세요."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "장비 핵심 부품: Chamber, Turbo Pump, Gate Valve, Gas Line(MFC), RF Generator, Wafer Chuck.",
     "매뉴얼의 Main Components 섹션에서 각 부품의 영어 이름과 지시문을 읽을 수 있다.",
     "부품 이름을 알면 영어 로그·알람에서 문제 위치를 바로 찾을 수 있다.",
     "MFC=가스 유량 제어(sccm), RF=플라즈마용 고주파 전력."
    ],
    "done": "**2주 완료 ✓** — 장비 구성요소의 영어 이름과 역할을 익혔다."
   }
  ]
 },
 {
  "id": "w3",
  "title": "3주 · 운전 절차",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "새벽 교대, 장비를 깨우다",
    "text": "새벽 6시 교대 시간. 선배가 너에게 말한다. \"오늘은 네가 장비 **시동(start-up)** 을 해봐.\" 화면에는 영어로 된 버튼들이 줄지어 있다. **Load**, **Pump Down**, **Start Gas**, **Ignite**, **Process**. 순서를 틀리면 알람이 뜨거나 웨이퍼가 깨진다. 선배가 건네준 종이는 **SOP(Standard Operating Procedure, 작업절차서)**. \"영어로 적혀 있지만, 순서만 지키면 돼. 한 줄씩 읽고 그대로 누르면 된다.\" 오늘 너는 장비를 **순서대로** 운전하는 법을 배운다."
   },
   {
    "type": "read",
    "title": "운전 절차란 무엇인가",
    "intro": "장비는 정해진 순서로만 켜고 끈다.",
    "paras": [
     "반도체 장비는 아무 버튼이나 누른다고 동작하지 않는다. **정해진 순서(sequence)** 를 따라야 한다. 예를 들어 챔버(chamber) 안에 가스가 남아 있는데 갑자기 문을 열면 위험하다. 그래서 웨이퍼를 넣고(load), 공기를 빼고(pump down/evacuate), 가스를 넣고(start gas/purge), 점화(ignite)한 뒤 공정(process)을 진행하고, 끝나면 다시 가스를 빼고(vent) 문을 여는 순서를 지킨다.",
     "이 순서를 글로 적어 놓은 문서가 **SOP(작업절차서)** 다. 현장의 SOP는 대부분 영어로 되어 있다. 그래서 실무자는 load, transfer, evacuate, purge, vent, ignite, stop 같은 **작업지시 동사**를 정확히 읽을 수 있어야 한다. 이번 주는 이 동사들과, 시동·정지 순서를 익힌다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "items": [
     {
      "ab": "SOP",
      "full": "Standard Operating Procedure",
      "ko": "표준 작업절차서"
     },
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "작업자-장비 조작 화면"
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파(플라즈마 점화에 사용)"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "가스 유량 조절기"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 운전 동사 (1)",
    "intro": "작업지시에 자주 나오는 동사들이다.",
    "items": [
     {
      "en": "Load",
      "ko": "로드(넣다)",
      "d": "웨이퍼를 챔버 안으로 넣는 동작.",
      "ex": "Load the wafer into the chamber."
     },
     {
      "en": "Transfer",
      "ko": "이송하다",
      "d": "웨이퍼를 한 위치에서 다른 위치로 옮김.",
      "ex": "Transfer the wafer to the process chamber."
     },
     {
      "en": "Evacuate",
      "ko": "배기하다",
      "d": "챔버 안의 공기를 빼내 진공을 만듦.",
      "ex": "Evacuate the chamber before starting."
     },
     {
      "en": "Pump down",
      "ko": "펌프 다운",
      "d": "펌프로 압력을 낮추는 것. evacuate 와 비슷.",
      "ex": "Pump down to base pressure."
     },
     {
      "en": "Purge",
      "ko": "퍼지(치환)",
      "d": "가스를 흘려 챔버 안을 깨끗이 씻어냄.",
      "ex": "Purge the line with nitrogen."
     },
     {
      "en": "Vent",
      "ko": "벤트(대기 개방)",
      "d": "챔버를 대기압으로 되돌림. 문을 열기 전 단계.",
      "ex": "Vent the chamber to atmosphere."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 운전 동사 (1)",
    "questions": [
     {
      "prompt": "“Load the wafer” 의 뜻은?",
      "opts": [
       "웨이퍼를 넣다",
       "웨이퍼를 꺼내다",
       "웨이퍼를 검사하다"
      ],
      "ans": 0
     },
     {
      "prompt": "챔버 안의 공기를 빼내 진공을 만드는 동작은?",
      "opts": [
       "Purge",
       "Evacuate",
       "Transfer"
      ],
      "ans": 1
     },
     {
      "prompt": "문을 열기 전에 챔버를 대기압으로 되돌리는 것은?",
      "opts": [
       "Vent",
       "Ignite",
       "Load"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 운전 동사 (2)",
    "items": [
     {
      "en": "Ignite",
      "ko": "점화하다",
      "d": "RF 전력으로 플라즈마에 불을 붙임.",
      "ex": "Ignite the plasma with RF power."
     },
     {
      "en": "Process",
      "ko": "공정 진행",
      "d": "실제 식각·증착 등 공정을 실행함.",
      "ex": "Start the process recipe."
     },
     {
      "en": "Stop",
      "ko": "정지하다",
      "d": "동작을 멈춤. 비상 시에도 사용.",
      "ex": "Stop the process immediately."
     },
     {
      "en": "Start-up",
      "ko": "시동",
      "d": "장비를 켜고 운전 상태로 만드는 절차.",
      "ex": "Follow the start-up sequence."
     },
     {
      "en": "Shutdown",
      "ko": "정지 절차",
      "d": "장비를 안전하게 끄는 절차.",
      "ex": "Begin the shutdown sequence."
     },
     {
      "en": "Sequence",
      "ko": "순서",
      "d": "정해진 작업 순서.",
      "ex": "Do not skip any step in the sequence."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 운전 동사 (2)",
    "questions": [
     {
      "prompt": "“Ignite the plasma” 는 무엇을 하라는 뜻?",
      "opts": [
       "플라즈마를 끄다",
       "플라즈마를 점화하다",
       "플라즈마를 배기하다"
      ],
      "ans": 1
     },
     {
      "prompt": "“Stop the process immediately” 의 뜻은?",
      "opts": [
       "공정을 즉시 멈춰라",
       "공정을 천천히 시작해라",
       "공정을 반복해라"
      ],
      "ans": 0
     },
     {
      "prompt": "장비를 안전하게 끄는 절차를 뜻하는 단어는?",
      "opts": [
       "Start-up",
       "Shutdown",
       "Load"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "read",
    "title": "시동 순서 — Load에서 Process까지",
    "intro": "이 5단계 순서를 외우면 대부분의 장비를 운전할 수 있다.",
    "paras": [
     "1) **Load** — 웨이퍼를 챔버에 넣는다. 2) **Pump Down** — 챔버 안 공기를 빼서 진공을 만든다(evacuate). 3) **Start Gas** — 공정 가스를 흘려보낸다. MFC가 유량을 sccm 단위로 조절한다. 4) **Ignite** — RF 전력을 걸어 플라즈마를 점화한다. 5) **Process** — 정해진 레시피(recipe)로 공정을 진행한다.",
     "공정이 끝나면 반대로 정지한다. 가스를 끄고(gas off), 플라즈마를 끄고, 챔버를 **vent** 해서 대기압으로 만든 뒤 웨이퍼를 꺼낸다(unload). 순서를 건너뛰면(skip) 알람이 뜨고 장비가 멈춘다. 그래서 SOP의 한 줄 한 줄을 그대로 따르는 것이 중요하다."
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 읽기 — Start-up Procedure",
    "mtitle": "MANUAL · Equipment Start-up Sequence",
    "paras": [
     "**Step 1.** Load the wafer into the load port.",
     "**Step 2.** Pump down the chamber to base pressure.",
     "**Step 3.** Start the process gas. Check the MFC flow reading.",
     "**Step 4.** Ignite the plasma using RF power.",
     "**Step 5.** Run the process recipe. Monitor pressure and temperature.",
     "**Note:** Do not open the chamber before vent is complete."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 매뉴얼 해석",
    "questions": [
     {
      "prompt": "Step 2 “Pump down the chamber” 는 무엇을 하라는 것?",
      "opts": [
       "챔버에 가스를 채워라",
       "챔버를 진공으로 만들어라",
       "챔버 문을 열어라"
      ],
      "ans": 1
     },
     {
      "prompt": "“Do not open the chamber before vent is complete” 의 뜻은?",
      "opts": [
       "벤트가 끝나기 전에 챔버를 열지 마라",
       "벤트 전에 챔버를 열어라",
       "벤트를 하지 마라"
      ],
      "ans": 0
     },
     {
      "prompt": "Step 4에서 플라즈마 점화에 사용하는 전력은?",
      "opts": [
       "DC power",
       "RF power",
       "USB power"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 계기판 읽기",
    "which": "devicePanel",
    "intro": "LED와 진동 계기판을 보며 장비 상태를 확인하자. RUN, STANDBY, ALARM 같은 영어 상태 표시를 읽고, 지금 장비가 어느 단계에 있는지 판단해 보라."
   },
   {
    "type": "sim",
    "title": "실습 — 순서대로 장비 운전하기",
    "which": "equipment",
    "intro": "가상 장비 HMI를 순서대로 조작한다. Load → Pump Down → Start Gas → Ignite → Process 순서로 버튼을 눌러 시동 절차를 완료하라. 순서를 건너뛰면 알람이 뜬다. 완료 후 Log 메뉴를 열어 영어 로그를 읽어 보자."
   },
   {
    "type": "read",
    "title": "Log 메뉴 영어 읽기",
    "intro": "장비는 모든 동작을 영어 로그로 기록한다.",
    "paras": [
     "장비의 **Log(로그)** 메뉴에는 방금 한 동작이 시간 순서로 기록된다. 예: `Wafer loaded`, `Pump down started`, `Gas flow ON`, `Plasma ignited`, `Process complete`. 앞의 동사만 알면 무슨 일이 있었는지 바로 읽을 수 있다.",
     "문제가 생기면 로그에 **경고(warning)** 나 **오류(error)** 가 남는다. 예: `Error: pump down failed`(펌프 다운 실패), `Warning: gas flow low`(가스 유량 낮음). 이런 줄을 읽고 어느 단계에서 멈췄는지 파악하는 것이 실무자의 기본 능력이다."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 로그·오류 해석",
    "questions": [
     {
      "prompt": "로그에 “Plasma ignited” 가 보인다. 무슨 뜻?",
      "opts": [
       "플라즈마가 점화되었다",
       "플라즈마가 꺼졌다",
       "플라즈마 오류"
      ],
      "ans": 0
     },
     {
      "prompt": "“Error: pump down failed” 는 어느 단계 문제인가?",
      "opts": [
       "가스 점화 단계",
       "펌프 다운(배기) 단계",
       "웨이퍼 로드 단계"
      ],
      "ans": 1
     },
     {
      "prompt": "“Warning: gas flow low” 의 뜻은?",
      "opts": [
       "가스 유량이 낮다",
       "가스 유량이 정상이다",
       "가스를 껐다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 읽기 — Shutdown Procedure",
    "mtitle": "MANUAL · Equipment Shutdown Sequence",
    "paras": [
     "**Step 1.** Stop the process recipe.",
     "**Step 2.** Turn off the RF power. Confirm the plasma is off.",
     "**Step 3.** Turn off the process gas. Purge the line with nitrogen.",
     "**Step 4.** Vent the chamber to atmosphere.",
     "**Step 5.** Unload the wafer from the chamber.",
     "**Note:** Follow each step in order. Do not skip any step."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 정지 순서",
    "questions": [
     {
      "prompt": "Shutdown에서 가장 먼저 하는 것은?",
      "opts": [
       "웨이퍼 언로드",
       "공정 레시피 정지",
       "챔버 벤트"
      ],
      "ans": 1
     },
     {
      "prompt": "Step 3 “Purge the line with nitrogen” 의 뜻은?",
      "opts": [
       "질소로 배관을 치환한다",
       "질소 가스를 점화한다",
       "배관을 진공으로 만든다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "외국인 엔지니어가 시동 순서를 물어본다.",
      "q": {
       "en": "What is the first step of the start-up sequence?",
       "ko": "시동 순서의 첫 단계는 무엇인가요?"
      },
      "a": {
       "en": "First, load the wafer. Then pump down the chamber.",
       "ko": "먼저 웨이퍼를 넣고, 그다음 챔버를 배기합니다."
      }
     },
     {
      "sit": "장비가 점화 단계에서 멈췄다. 상황을 설명한다.",
      "q": {
       "en": "The equipment stopped. What does the log say?",
       "ko": "장비가 멈췄어요. 로그에 뭐라고 나오나요?"
      },
      "a": {
       "en": "The log shows “Error: plasma ignition failed.” I will check the RF power.",
       "ko": "로그에 '플라즈마 점화 실패' 오류가 있습니다. RF 전력을 확인하겠습니다."
      }
     },
     {
      "sit": "공정이 끝난 뒤 다음 절차를 확인한다.",
      "q": {
       "en": "The process is complete. Can I open the chamber now?",
       "ko": "공정이 끝났어요. 지금 챔버를 열어도 되나요?"
      },
      "a": {
       "en": "Not yet. Vent the chamber first, then you can open it.",
       "ko": "아직요. 먼저 챔버를 벤트한 뒤에 열 수 있습니다."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 상황 대응",
    "questions": [
     {
      "prompt": "공정이 끝났다. 챔버를 열기 전에 반드시 해야 할 것은?",
      "opts": [
       "Ignite",
       "Vent",
       "Load"
      ],
      "ans": 1
     },
     {
      "prompt": "동료가 “Skip the pump down step” 이라고 하면?",
      "opts": [
       "안전하니 그렇게 한다",
       "순서를 건너뛰면 위험하다고 알린다",
       "가스를 더 넣는다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "운전 동사: load, transfer, evacuate/pump down, purge, vent, ignite, process, stop 를 익혔다.",
     "시동 순서 Load → Pump Down → Start Gas → Ignite → Process 를 장비 HMI로 직접 조작했다.",
     "SOP(작업절차서)와 Log 메뉴의 영어 문장, 오류(Error)·경고(Warning) 줄을 읽는 법을 배웠다."
    ],
    "done": "**3주 완료 ✓** — 이제 영어 SOP 순서대로 장비를 운전할 수 있다."
   }
  ]
 },
 {
  "id": "w4",
  "title": "4주 · 진공·가스 로그",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "새벽 3시, 챔버 압력이 안 맞는다",
    "text": "새벽 근무 중, 식각 장비의 **base pressure** 가 목표보다 높게 뜬다. 화면에는 **set point** 5 mTorr 인데 **actual value** 는 12 mTorr. 옆에는 가스 **flow rate** 가 흔들린다. 외국인 엔지니어가 다가와 묻는다. \"Is the leak rate normal?\" 나는 계기판(**devicePanel**)의 값을 읽고, **로그(Log)** 를 확인해서 **set point 와 actual 을 비교**해야 한다. 이번 주는 진공·가스 공급 장치의 상태와 로그를 영어로 읽는 법을 배운다."
   },
   {
    "type": "read",
    "title": "진공·가스 로그란?",
    "intro": "반도체 공정은 대부분 진공에서 이뤄진다. 그래서 압력과 가스 흐름을 항상 감시한다.",
    "paras": [
     "**진공(vacuum)** 은 챔버 안의 공기를 빼서 압력을 아주 낮춘 상태다. 압력이 낮을수록 오염 입자가 줄고, 가스 반응이 정확해진다. 그래서 장비는 목표 압력에 도달할 때까지 펌프로 공기를 빼낸다.",
     "**가스 공급 장치** 는 공정에 필요한 가스를 정해진 양만큼 흘려보낸다. 이때 흐르는 양을 **flow rate(유량)** 라고 하고, 단위는 보통 sccm 을 쓴다.",
     "장비는 이 값들을 계속 기록(Log)한다. 우리가 할 일은 로그와 계기판의 값을 읽고, 목표값(set point)과 실제값(actual value)이 맞는지 비교하는 것이다."
    ]
   },
   {
    "type": "acr",
    "title": "약어 · 이번 주 핵심",
    "items": [
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeter per Minute",
      "ko": "분당 표준 세제곱센티미터 (가스 유량 단위)"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량 유량 제어기 (가스 유량을 조절하는 장치)"
     },
     {
      "ab": "SP",
      "full": "Set Point",
      "ko": "목표값 (설정한 값)"
     },
     {
      "ab": "PV",
      "full": "Process Value / Actual Value",
      "ko": "실제값 (현재 측정된 값)"
     },
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "사람이 장비를 조작하는 화면·계기판"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 · 압력과 진공",
    "intro": "압력 관련 용어를 먼저 익힌다.",
    "items": [
     {
      "en": "Pressure",
      "ko": "압력",
      "d": "챔버 안 기체가 벽을 누르는 힘. 낮을수록 진공.",
      "ex": "The chamber pressure is too high."
     },
     {
      "en": "Base pressure",
      "ko": "기저 압력",
      "d": "가스를 넣기 전, 펌프로 뽑아낸 가장 낮은 압력.",
      "ex": "Wait until the base pressure is reached."
     },
     {
      "en": "Vacuum",
      "ko": "진공",
      "d": "공기를 빼내 압력을 아주 낮춘 상태.",
      "ex": "The pump creates a high vacuum."
     },
     {
      "en": "Leakage",
      "ko": "누설, 새는 것",
      "d": "챔버 틈으로 공기가 새어 들어오는 것.",
      "ex": "A small leakage raises the pressure."
     },
     {
      "en": "Leak rate",
      "ko": "누설률",
      "d": "얼마나 빠르게 새는지를 나타내는 값.",
      "ex": "The leak rate is within the limit."
     },
     {
      "en": "Torr / mTorr",
      "ko": "토르 / 밀리토르",
      "d": "압력 단위. mTorr 는 1/1000 Torr.",
      "ex": "The base pressure is 5 mTorr."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 · 압력 용어",
    "intro": "방금 배운 용어를 확인한다.",
    "questions": [
     {
      "prompt": "\"Base pressure\" 의 뜻은?",
      "opts": [
       "가스를 넣기 전 도달하는 가장 낮은 압력",
       "가스 유량",
       "챔버 온도"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Leakage\" 는 무슨 뜻인가?",
      "opts": [
       "누설(공기가 새어 들어옴)",
       "밸브를 여는 것",
       "압력을 높이는 것"
      ],
      "ans": 0
     },
     {
      "prompt": "압력이 낮을수록 진공은 어떻게 되는가?",
      "opts": [
       "더 좋은(높은) 진공이 된다",
       "진공이 사라진다",
       "관계없다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 · 가스와 제어값",
    "intro": "가스 유량과 제어 관련 용어다.",
    "items": [
     {
      "en": "Flow rate",
      "ko": "유량",
      "d": "가스가 흐르는 양. 단위는 보통 sccm.",
      "ex": "Set the flow rate to 50 sccm."
     },
     {
      "en": "sccm",
      "ko": "표준 유량 단위",
      "d": "분당 흐르는 표준 세제곱센티미터.",
      "ex": "The Ar flow is 20 sccm."
     },
     {
      "en": "Set point",
      "ko": "목표값",
      "d": "우리가 설정한 값(원하는 값).",
      "ex": "The set point is 5 mTorr."
     },
     {
      "en": "Actual value",
      "ko": "실제값",
      "d": "지금 실제로 측정된 값.",
      "ex": "The actual value is 12 mTorr."
     },
     {
      "en": "Mass Flow Controller (MFC)",
      "ko": "질량 유량 제어기",
      "d": "가스 유량을 정확히 조절하는 장치.",
      "ex": "The MFC controls the gas flow."
     },
     {
      "en": "Valve",
      "ko": "밸브",
      "d": "가스나 진공 통로를 열고 닫는 부품.",
      "ex": "Open the gas valve slowly."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 · 가스와 제어값",
    "questions": [
     {
      "prompt": "가스 유량(flow rate)의 단위로 자주 쓰는 것은?",
      "opts": [
       "sccm",
       "mTorr",
       "℃"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Set point\" 와 \"Actual value\" 의 차이는?",
      "opts": [
       "설정한 목표값 vs 실제 측정값",
       "둘 다 온도 단위",
       "차이 없음"
      ],
      "ans": 0
     },
     {
      "prompt": "MFC(Mass Flow Controller)의 역할은?",
      "opts": [
       "가스 유량을 조절한다",
       "압력을 표시만 한다",
       "챔버를 청소한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 · 진공 시작 절차",
    "mtitle": "MANUAL · Vacuum Pump-Down Procedure",
    "paras": [
     "1. Close the vent valve before pumping.",
     "2. Start the pump and **wait until the base pressure is reached**.",
     "3. Check that the **actual value** matches the **set point**.",
     "4. If the pressure does not drop, **check for leakage**.",
     "5. Set the gas **flow rate** to the value in the recipe (for example, 50 sccm)."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 · 매뉴얼 해석",
    "intro": "위 영어 매뉴얼을 읽고 답하라.",
    "questions": [
     {
      "prompt": "\"Wait until the base pressure is reached\" 의 뜻은?",
      "opts": [
       "기저 압력에 도달할 때까지 기다려라",
       "펌프를 꺼라",
       "가스를 넣어라"
      ],
      "ans": 0
     },
     {
      "prompt": "압력이 안 떨어지면 무엇을 확인하라고 했나?",
      "opts": [
       "누설(leakage)",
       "온도",
       "전원 색깔"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Set the flow rate to 50 sccm\" 은 무슨 지시인가?",
      "opts": [
       "유량을 50 sccm 으로 맞춰라",
       "압력을 50 으로 올려라",
       "밸브를 50번 열어라"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 · 장비 구성도 살펴보기",
    "which": "partDiagram",
    "intro": "진공·가스 공급 장치의 구성도를 클릭하며 pump, valve, MFC, chamber 위치를 확인한다. 각 부품이 압력·유량에 어떤 역할을 하는지 익힌다."
   },
   {
    "type": "sim",
    "title": "실습 · 계기판 값 읽기",
    "which": "devicePanel",
    "intro": "devicePanel 계기판을 보고 pressure, flow rate 값을 읽어보자. LED 색과 숫자를 함께 확인한다. 초록 LED 는 정상, 빨강은 이상 신호다."
   },
   {
    "type": "sim",
    "title": "실습 · 장비 HMI 로그 조작",
    "which": "equipment",
    "intro": "가상 장비 HMI 화면에서 set point 를 설정하고, actual value 와 로그(Log)를 비교해 보자. 값이 목표에 도달하는지 관찰한다."
   },
   {
    "type": "read",
    "title": "set point vs actual value 비교하기",
    "intro": "로그 해석의 핵심은 목표값과 실제값을 비교하는 것이다.",
    "paras": [
     "**set point(SP)** 는 우리가 원하는 값이고, **actual value(PV)** 는 지금 실제 값이다. 정상이라면 두 값이 거의 같아야 한다.",
     "예를 들어 SP=5 mTorr 인데 actual=12 mTorr 라면, 압력이 목표보다 높다는 뜻이다. 이는 진공이 부족하거나 **누설(leakage)** 이 있을 수 있다는 신호다.",
     "가스도 마찬가지다. SP=50 sccm 인데 actual=30 sccm 이면 가스가 부족하게 흐르고 있다. MFC 고장이나 밸브 문제를 의심할 수 있다. 로그에서 두 값의 차이(deviation)를 항상 확인하자."
    ]
   },
   {
    "type": "read",
    "title": "로그와 오류 메시지 읽기",
    "intro": "로그에는 짧은 영어 메시지가 자주 나온다.",
    "paras": [
     "\"Base pressure not reached\" 는 기저 압력에 도달하지 못했다는 뜻이다. 펌프나 누설을 확인해야 한다.",
     "\"Gas flow out of range\" 는 가스 유량이 정상 범위를 벗어났다는 뜻이다. MFC 나 밸브를 점검한다.",
     "\"Leak detected\" 는 누설이 감지되었다는 경고다. 챔버 문이나 오링(O-ring) 을 확인한다. 로그의 시간(time stamp)도 함께 보면 언제 문제가 생겼는지 알 수 있다."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 · 로그·오류 해석",
    "questions": [
     {
      "prompt": "로그에 \"Base pressure not reached\" 가 떴다. 무슨 뜻인가?",
      "opts": [
       "기저 압력에 도달 못함 → 펌프·누설 확인",
       "압력이 정상임",
       "가스가 너무 많음"
      ],
      "ans": 0
     },
     {
      "prompt": "SP=50 sccm 인데 actual=30 sccm 이면?",
      "opts": [
       "가스가 목표보다 적게 흐름",
       "가스가 목표보다 많이 흐름",
       "정상 상태"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Leak detected\" 를 보면 먼저 확인할 것은?",
      "opts": [
       "챔버 문·오링(누설 지점)",
       "화면 밝기",
       "가스 이름"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 · 로그 확인 절차",
    "mtitle": "MANUAL · Checking the Vacuum & Gas Log",
    "paras": [
     "1. Open the log screen on the HMI.",
     "2. **Compare the set point and the actual value** for pressure and gas flow.",
     "3. If the deviation is large, record the time and the value.",
     "4. Check the log message, for example **Leak detected** or **Gas flow out of range**.",
     "5. Report the abnormal value to the shift engineer."
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "외국인 엔지니어가 압력 상태를 묻는다.",
      "q": {
       "en": "What is the actual pressure now?",
       "ko": "지금 실제 압력이 얼마인가요?"
      },
      "a": {
       "en": "The actual value is 12 mTorr, but the set point is 5 mTorr.",
       "ko": "실제값은 12 mTorr 인데, 목표값은 5 mTorr 입니다."
      }
     },
     {
      "sit": "누설이 의심될 때 상황을 설명한다.",
      "q": {
       "en": "Why is the base pressure so high?",
       "ko": "왜 기저 압력이 이렇게 높죠?"
      },
      "a": {
       "en": "I think there is a small leakage. I will check the O-ring.",
       "ko": "작은 누설이 있는 것 같아요. 오링을 확인하겠습니다."
      }
     },
     {
      "sit": "가스 유량을 확인해 달라는 요청.",
      "q": {
       "en": "Can you check the gas flow rate?",
       "ko": "가스 유량을 확인해 줄래요?"
      },
      "a": {
       "en": "Sure. The flow rate is 50 sccm, same as the set point.",
       "ko": "네. 유량은 50 sccm 으로, 목표값과 같습니다."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 · 의사소통 표현",
    "questions": [
     {
      "prompt": "\"What is the actual pressure now?\" 는 무엇을 묻는가?",
      "opts": [
       "지금 실제 압력이 얼마인지",
       "펌프 이름이 뭔지",
       "온도가 몇 도인지"
      ],
      "ans": 0
     },
     {
      "prompt": "\"I will check the O-ring.\" 의 뜻은?",
      "opts": [
       "오링을 확인하겠습니다",
       "장비를 끄겠습니다",
       "가스를 켜겠습니다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "진공·가스 로그의 핵심 값: pressure, base pressure, flow rate(sccm), leakage.",
     "set point(목표값)와 actual value(실제값)를 항상 비교한다 — 차이가 크면 이상 신호.",
     "devicePanel 로 계기판(LED·숫자)을 읽고, equipment HMI 로그로 값 변화를 확인한다.",
     "오류 메시지: Base pressure not reached / Gas flow out of range / Leak detected 를 해석할 수 있다."
    ],
    "done": "**4주 완료 ✓** — 이제 진공·가스 로그를 영어로 읽고 set point 와 actual 을 비교할 수 있다."
   }
  ]
 },
 {
  "id": "w5",
  "title": "5주 · 플라즈마 장비",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "야간 근무 중 알람이 울렸다",
    "text": "새벽 2시, 식각(Etch) 라인에서 근무 중이다. 갑자기 장비 화면이 붉게 바뀌며 **RF-204 High Reflected Power** 라는 영문 알람이 뜬다. 플라즈마가 제대로 켜지지 않고, 전력이 챔버로 들어가지 못하고 되돌아오는(반사되는) 상태다. 외국인 엔지니어가 다가와 묻는다. \"What does the alarm say?\" 이때 **RF power, matching, reflected power** 같은 단어를 알아야 상황을 정확히 전달할 수 있다. 이번 주는 플라즈마 장비의 운전 변수와 경고 메시지를 익힌다."
   },
   {
    "type": "read",
    "title": "플라즈마 장비란?",
    "intro": "이번 주 핵심 개념을 먼저 잡아보자.",
    "paras": [
     "반도체 식각(Etch) 공정은 **플라즈마(plasma)** 를 이용한다. 챔버(chamber) 안에 가스를 넣고 강한 고주파 전기를 걸면, 가스가 이온과 전자로 쪼개지며 빛나는 플라즈마 상태가 된다. 이 플라즈마가 웨이퍼 표면을 깎아낸다.",
     "플라즈마를 만들려면 **RF(Radio Frequency, 고주파) power** 가 필요하다. RF 발생기(RF generator)가 전력을 만들어 챔버로 보낸다. 이 전력이 챔버로 잘 들어가려면 **matching(임피던스 정합)** 이 맞아야 한다. 정합이 어긋나면 전력이 챔버로 들어가지 못하고 발생기 쪽으로 되돌아온다.",
     "챔버로 실제 들어가는 전력을 **forward power(순방향 전력)**, 되돌아오는 전력을 **reflected power(반사 전력)** 라고 부른다. 정상 상태에서는 forward 는 높고 reflected 는 거의 0 이어야 한다. reflected power 가 높으면 비정상이다."
    ]
   },
   {
    "type": "read",
    "title": "정상과 비정상 — 반사파를 보라",
    "paras": [
     "**plasma ignition(플라즈마 점화)** 은 플라즈마가 처음 켜지는 순간이다. RF power 를 걸면 순간적으로 가스가 방전되며 플라즈마가 생긴다. 점화에 실패하면 공정이 시작조차 되지 않는다.",
     "정상 운전에서는 matching 이 자동으로 조정되어 reflected power 가 낮게 유지된다. 그러나 챔버 오염, 가스 이상, 부품 문제가 생기면 정합이 깨지고 **reflected power 가 높아진다**. 이때 장비는 **RF-204 같은 반사파 경고 알람**을 띄운다.",
     "현장에서는 이 알람을 보고 \"forward 는 정상인데 reflected 가 튀었다\" 처럼 영어로 상황을 보고할 수 있어야 한다. 이번 주 실습에서 직접 알람을 재현하고 챔버 그림에서 RF 와 plasma 위치를 확인한다."
    ]
   },
   {
    "type": "acr",
    "title": "약어 풀어보기",
    "items": [
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파 (플라즈마를 만드는 전기 에너지)"
     },
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "장비 조작 화면(사람-기계 인터페이스)"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량 유량 제어기(가스량 조절)"
     },
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeter per Minute",
      "ko": "분당 표준 cc, 가스 유량 단위"
     },
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1/2)",
    "intro": "플라즈마 장비에서 매일 쓰는 단어다.",
    "items": [
     {
      "en": "RF power",
      "ko": "고주파 전력",
      "d": "플라즈마를 만드는 고주파 전기 에너지.",
      "ex": "Set the RF power to 500 watts."
     },
     {
      "en": "Forward power",
      "ko": "순방향 전력",
      "d": "발생기에서 챔버로 실제 들어가는 전력.",
      "ex": "Forward power is stable at 500 watts."
     },
     {
      "en": "Reflected power",
      "ko": "반사 전력",
      "d": "챔버로 못 들어가고 되돌아오는 전력. 낮아야 정상.",
      "ex": "Reflected power is too high right now."
     },
     {
      "en": "Matching",
      "ko": "임피던스 정합",
      "d": "전력이 챔버로 잘 들어가도록 맞춰주는 조정.",
      "ex": "The matching unit is tuning automatically."
     },
     {
      "en": "Plasma ignition",
      "ko": "플라즈마 점화",
      "d": "플라즈마가 처음 켜지는 순간.",
      "ex": "Plasma ignition failed on the first try."
     },
     {
      "en": "Chamber",
      "ko": "챔버",
      "d": "플라즈마로 웨이퍼를 처리하는 밀폐 공간.",
      "ex": "Do not open the chamber during the process."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 (1/2)",
    "intro": "방금 배운 용어를 골라보자.",
    "questions": [
     {
      "prompt": "“Reflected power”의 뜻은?",
      "opts": [
       "순방향 전력",
       "반사 전력",
       "가스 유량"
      ],
      "ans": 1
     },
     {
      "prompt": "정상 운전에서 낮게 유지되어야 하는 값은?",
      "opts": [
       "Forward power",
       "Reflected power",
       "RF power"
      ],
      "ans": 1
     },
     {
      "prompt": "“Plasma ignition”은 무엇인가?",
      "opts": [
       "플라즈마 점화",
       "챔버 청소",
       "가스 차단"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2/2)",
    "items": [
     {
      "en": "RF generator",
      "ko": "RF 발생기",
      "d": "고주파 전력을 만들어내는 장치.",
      "ex": "The RF generator is on standby."
     },
     {
      "en": "Alarm",
      "ko": "알람 / 경고",
      "d": "장비가 이상 상태를 알리는 신호.",
      "ex": "An alarm popped up on the HMI."
     },
     {
      "en": "Fault",
      "ko": "결함 / 고장",
      "d": "장비가 멈추거나 이상이 생긴 상태.",
      "ex": "The tool went down with an RF fault."
     },
     {
      "en": "Ignite",
      "ko": "점화하다",
      "d": "플라즈마를 켜다.",
      "ex": "The plasma did not ignite."
     },
     {
      "en": "Tune",
      "ko": "튜닝하다 / 맞추다",
      "d": "matching 을 조정하다.",
      "ex": "The matcher needs to tune again."
     },
     {
      "en": "Recipe",
      "ko": "레시피",
      "d": "공정 조건을 담은 설정값 묶음.",
      "ex": "Load the etch recipe first."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 (2/2)",
    "questions": [
     {
      "prompt": "“RF generator”가 하는 일은?",
      "opts": [
       "가스 공급",
       "고주파 전력 생성",
       "웨이퍼 이송"
      ],
      "ans": 1
     },
     {
      "prompt": "“The plasma did not ignite.” 의 뜻은?",
      "opts": [
       "플라즈마가 점화되지 않았다",
       "플라즈마가 꺼졌다",
       "플라즈마가 너무 강했다"
      ],
      "ans": 0
     },
     {
      "prompt": "“Fault”의 뜻으로 가장 알맞은 것은?",
      "opts": [
       "정상",
       "결함/고장",
       "청소"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "manual",
    "title": "영문 매뉴얼 읽기",
    "mtitle": "MANUAL · RF Plasma Operation",
    "paras": [
     "Before starting, make sure the **forward power** reaches the set point and the **reflected power** stays below 10 watts.",
     "If the plasma does not **ignite** within 3 seconds, the tool will raise an alarm and stop.",
     "When **reflected power** is high, the **matching** unit will try to tune automatically.",
     "If the alarm **RF-204 High Reflected Power** does not clear, stop the process and call the equipment engineer."
    ]
   },
   {
    "type": "quiz",
    "title": "매뉴얼 해석",
    "intro": "위 매뉴얼 문장을 이해했는지 확인하자.",
    "questions": [
     {
      "prompt": "매뉴얼에서 reflected power 는 몇 watt 아래로 유지해야 하나?",
      "opts": [
       "10 watts 아래",
       "500 watts 아래",
       "제한 없음"
      ],
      "ans": 0
     },
     {
      "prompt": "플라즈마가 3초 안에 점화되지 않으면?",
      "opts": [
       "그냥 계속 진행",
       "알람 후 장비 정지",
       "전력 자동 상승"
      ],
      "ans": 1
     },
     {
      "prompt": "RF-204 알람이 사라지지 않으면 무엇을 해야 하나?",
      "opts": [
       "공정 정지 후 엔지니어 호출",
       "챔버 즉시 개방",
       "가스 유량 최대"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "그림으로 이해 — 챔버 속 RF와 플라즈마 위치",
    "which": "chamber",
    "intro": "식각 챔버 그림에서 RF 전극, 플라즈마 발생 영역, 웨이퍼 위치를 라벨로 확인하세요. RF power 가 어디로 들어가고 plasma 가 어디서 생기는지 눈으로 익힙니다."
   },
   {
    "type": "sim",
    "title": "계기판 읽기 — Forward / Reflected 값",
    "which": "devicePanel",
    "intro": "장비 계기판(LED·게이지)에서 forward power 와 reflected power 값을 읽어보세요. 정상일 때 두 값이 어떻게 표시되는지 관찰합니다."
   },
   {
    "type": "sim",
    "title": "핵심 실습 — RF-204 반사파 알람 재현",
    "which": "equipment",
    "intro": "가상 장비 HMI 에서 Inject Fault 버튼으로 'RF-204 High Reflected Power' 상황을 만들어 보세요. reflected power 가 치솟고 알람이 뜨는 것을 확인하고, 로그(log)에 남는 영문 메시지를 읽어봅니다."
   },
   {
    "type": "read",
    "title": "로그와 알람 메시지 해석",
    "intro": "실습에서 본 로그를 읽어보자.",
    "paras": [
     "장비 로그에는 이런 영문이 남는다: **[ALARM] RF-204 High Reflected Power** / **Forward: 500W  Reflected: 180W** / **Matching failed to tune**. 이 세 줄만 읽어도 상황을 알 수 있다.",
     "Forward 500W 는 정상이지만 Reflected 180W 는 매우 높다. 즉 전력이 챔버로 못 들어가고 되돌아온다는 뜻이다. Matching 이 자동 조정에 실패했다는 문장도 함께 뜬다.",
     "현장 보고는 짧게: \"RF-204 alarm. Reflected power is high. Matching failed.\" 원인이 확인되면 챔버 오염, 부품 이상 등을 점검한다. 급하면 공정을 멈추고 엔지니어를 호출한다."
    ]
   },
   {
    "type": "quiz",
    "title": "로그 해석 퀴즈",
    "questions": [
     {
      "prompt": "로그에 Forward 500W, Reflected 180W 가 보인다. 상태는?",
      "opts": [
       "정상",
       "반사파가 높은 비정상",
       "전력 부족"
      ],
      "ans": 1
     },
     {
      "prompt": "“Matching failed to tune” 의 뜻은?",
      "opts": [
       "정합 조정에 실패했다",
       "가스가 부족하다",
       "웨이퍼가 깨졌다"
      ],
      "ans": 0
     },
     {
      "prompt": "RF-204 는 어떤 종류의 알람인가?",
      "opts": [
       "온도 경고",
       "반사 전력 경고",
       "도어 열림 경고"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "알람이 떴을 때 엔지니어가 상황을 묻는다.",
      "q": {
       "en": "What does the alarm say?",
       "ko": "알람에 뭐라고 떠 있어요?"
      },
      "a": {
       "en": "It says RF-204, high reflected power.",
       "ko": "RF-204, 반사 전력이 높다고 떠 있어요."
      }
     },
     {
      "sit": "엔지니어가 순방향/반사 전력 값을 확인한다.",
      "q": {
       "en": "How much is the reflected power now?",
       "ko": "지금 반사 전력이 얼마예요?"
      },
      "a": {
       "en": "Forward is 500 watts, but reflected is about 180 watts.",
       "ko": "순방향은 500와트인데 반사가 약 180와트예요."
      }
     },
     {
      "sit": "다음 조치를 결정한다.",
      "q": {
       "en": "Did the matching try to tune?",
       "ko": "매칭이 튜닝을 시도했나요?"
      },
      "a": {
       "en": "Yes, but it failed. I stopped the process and I am calling you.",
       "ko": "네, 그런데 실패했어요. 공정을 멈추고 지금 연락드려요."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "의사소통 확인",
    "questions": [
     {
      "prompt": "“How much is the reflected power now?” 는 무엇을 묻는가?",
      "opts": [
       "현재 반사 전력 값",
       "챔버 온도",
       "가스 종류"
      ],
      "ans": 0
     },
     {
      "prompt": "반사 전력이 높다고 말할 때 알맞은 문장은?",
      "opts": [
       "Reflected power is high.",
       "The door is open.",
       "The gas is empty."
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "플라즈마 장비는 RF power 로 챔버 안에 플라즈마를 만들어 웨이퍼를 식각한다.",
     "Forward power 는 높고 Reflected power 는 낮아야 정상 — matching 이 정합을 맞춘다.",
     "Reflected power 가 높으면 RF-204 같은 반사파 알람이 뜬다. 로그를 읽고 \"Reflected is high, matching failed\" 처럼 영어로 보고할 수 있다."
    ],
    "done": "**5주 완료 ✓** — 플라즈마 운전 변수와 반사파 알람을 영어로 다룰 수 있다."
   }
  ]
 },
 {
  "id": "w6",
  "title": "6주 · 알람과 조치",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "새벽 3시, 알람이 울렸다",
    "text": "야간 근무 중인 김 사원. 갑자기 장비 화면이 붉게 변하며 **ALARM**이 뜬다. 화면에는 영어로 **VAC-101 Chamber vacuum failure**라고 적혀 있다. 옆 장비는 노란색 **WARNING**만 깜빡이고, 또 다른 장비는 **INTERLOCK**이 걸려 문이 열리지 않는다. 김 사원은 침착하게 알람 메시지를 읽는다. **알람의 색과 단어를 읽을 줄 알면, 무엇을 먼저 해야 할지 알 수 있다.** 오늘 우리는 영문 알람을 해석하고 올바른 조치를 고르는 법을 배운다."
   },
   {
    "type": "read",
    "title": "알람이란 무엇인가",
    "intro": "반도체 장비는 문제가 생기면 사람에게 신호를 보낸다.",
    "paras": [
     "반도체 장비는 스스로 상태를 감시(monitoring)한다. 진공, 가스 유량, 온도, RF 전력 같은 값이 정상 범위를 벗어나면 장비는 화면과 소리로 **알람(alarm)**을 띄운다. 알람은 '지금 문제가 있으니 확인하라'는 장비의 메시지다.",
     "알람에는 등급이 있다. 가벼운 것은 **경고(warning)**로 노란색, 심각한 것은 **알람(alarm)**으로 빨간색으로 표시되는 경우가 많다. 안전이나 장비 보호를 위해 동작을 강제로 멈추는 것은 **인터록(interlock)**이라고 한다.",
     "현장 장비의 화면(HMI)과 로그는 대부분 영어다. 그래서 알람 메시지를 빠르고 정확하게 읽는 능력이 곧 실무 능력이다. 이번 주는 자주 나오는 다섯 단어 alarm, warning, interlock, timeout, failure를 중심으로 배운다."
    ]
   },
   {
    "type": "read",
    "title": "알람 메시지 읽는 순서",
    "paras": [
     "좋은 알람 메시지는 보통 세 부분으로 되어 있다. 첫째 **어디서(장치 ID, 예: VAC-101)**, 둘째 **무엇이(항목, 예: chamber vacuum)**, 셋째 **어떻게(상태, 예: failure/timeout)**. 이 순서대로 읽으면 원인을 빠르게 짐작할 수 있다.",
     "예를 들어 **'RF-204 RF power reflected high'**는 'RF-204 장치의 RF 전력 반사가 높다'는 뜻이다. 어디서=RF-204, 무엇이=RF power, 어떻게=reflected high. 이렇게 끊어 읽으면 낯선 영어도 어렵지 않다.",
     "메시지를 읽었으면 다음은 **조치(action)**다. 알람 종류에 따라 확인(check), 재시도(retry), 리셋(reset), 사람 호출(call/escalate)이 달라진다. 잘못된 조치는 장비를 더 망가뜨릴 수 있으니, 원인을 먼저 이해하는 것이 핵심이다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "items": [
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "사람-기계 인터페이스(장비 조작 화면)"
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파(플라즈마 생성에 쓰는 전력)"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량 유량 제어기(가스 유량 조절)"
     },
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비"
     },
     {
      "ab": "EDS",
      "full": "Emergency Down Switch",
      "ko": "비상 정지 스위치"
     },
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeter per Minute",
      "ko": "분당 표준 cc(가스 유량 단위)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어",
    "intro": "이번 주 알람을 읽는 데 꼭 필요한 6개 단어.",
    "items": [
     {
      "en": "Alarm",
      "ko": "알람",
      "d": "심각한 이상. 보통 빨간색, 즉시 조치가 필요함.",
      "ex": "An alarm went off on the etch tool."
     },
     {
      "en": "Warning",
      "ko": "경고",
      "d": "가벼운 이상. 보통 노란색, 곧 확인이 필요함.",
      "ex": "This is only a warning, not an alarm."
     },
     {
      "en": "Interlock",
      "ko": "인터록",
      "d": "안전을 위해 동작을 강제로 막는 잠금.",
      "ex": "The door interlock stopped the process."
     },
     {
      "en": "Timeout",
      "ko": "타임아웃",
      "d": "정해진 시간 안에 동작이 끝나지 않음.",
      "ex": "The pump-down timed out after 60 seconds."
     },
     {
      "en": "Failure",
      "ko": "고장/실패",
      "d": "동작이 정상적으로 이루어지지 않음.",
      "ex": "The message shows a vacuum failure."
     },
     {
      "en": "Reset",
      "ko": "리셋",
      "d": "알람을 지우고 장비 상태를 초기화함.",
      "ex": "Please reset the alarm after the check."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 퀴즈 (1)",
    "intro": "방금 배운 6개 단어를 확인해 보자.",
    "questions": [
     {
      "prompt": "빨간색으로 뜨며 즉시 조치가 필요한 심각한 이상은?",
      "opts": [
       "Warning",
       "Alarm",
       "Reset"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Timeout\"의 뜻으로 알맞은 것은?",
      "opts": [
       "가스 유량",
       "정해진 시간 안에 동작이 끝나지 않음",
       "문이 잠김"
      ],
      "ans": 1
     },
     {
      "prompt": "안전을 위해 장비 동작을 강제로 막는 것은?",
      "opts": [
       "Interlock",
       "Warning",
       "Failure"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "장치·현상 용어",
    "intro": "알람 메시지에 자주 등장하는 장치와 현상.",
    "items": [
     {
      "en": "Vacuum",
      "ko": "진공",
      "d": "챔버 안 공기를 빼낸 낮은 압력 상태.",
      "ex": "Chamber vacuum is out of range."
     },
     {
      "en": "Chamber",
      "ko": "챔버",
      "d": "공정이 실제로 일어나는 밀폐 공간.",
      "ex": "Open the chamber only when it is safe."
     },
     {
      "en": "Gas flow",
      "ko": "가스 유량",
      "d": "챔버로 들어가는 가스의 양.",
      "ex": "The gas flow dropped below the setpoint."
     },
     {
      "en": "Reflected power",
      "ko": "반사 전력",
      "d": "RF에서 되돌아 나온 전력. 높으면 이상.",
      "ex": "Reflected power is too high on RF-204."
     },
     {
      "en": "Setpoint",
      "ko": "설정값",
      "d": "목표로 정해 둔 기준 값.",
      "ex": "The reading is far from the setpoint."
     },
     {
      "en": "Leak",
      "ko": "누설/새는 것",
      "d": "가스나 공기가 원치 않게 새는 현상.",
      "ex": "A small leak caused the vacuum failure."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 퀴즈 (2)",
    "questions": [
     {
      "prompt": "\"Reflected power is too high\"는 무슨 뜻인가?",
      "opts": [
       "가스 유량이 낮다",
       "반사 전력이 너무 높다",
       "진공이 정상이다"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Setpoint\"의 뜻은?",
      "opts": [
       "목표로 정해 둔 기준 값",
       "챔버 문",
       "리셋 버튼"
      ],
      "ans": 0
     },
     {
      "prompt": "진공 실패의 흔한 원인이 될 수 있는 것은?",
      "opts": [
       "Leak(누설)",
       "Reset(리셋)",
       "Warning(경고)"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 — 알람 대응 절차",
    "mtitle": "MANUAL · Alarm Response Procedure",
    "paras": [
     "**1. Read the alarm message** carefully. Check the device ID, the item, and the status word.",
     "**2. Do not reset immediately.** First find out why the alarm came up.",
     "**3. For a warning,** check the value and keep watching. The tool may keep running.",
     "**4. For an alarm or interlock,** the tool stops. Make the area safe before you open anything.",
     "**5. If you are not sure,** call the shift leader. Never bypass an interlock by yourself."
    ]
   },
   {
    "type": "quiz",
    "title": "매뉴얼 해석 퀴즈",
    "intro": "위 영어 매뉴얼을 바르게 이해했는지 확인.",
    "questions": [
     {
      "prompt": "\"Do not reset immediately\"가 말하는 것은?",
      "opts": [
       "즉시 리셋하라",
       "바로 리셋하지 말고 원인을 먼저 찾아라",
       "장비를 꺼라"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Never bypass an interlock by yourself\"의 뜻은?",
      "opts": [
       "인터록을 혼자 무시하고 넘기지 마라",
       "인터록을 리셋하라",
       "인터록을 켜라"
      ],
      "ans": 0
     },
     {
      "prompt": "warning일 때 매뉴얼이 권하는 행동은?",
      "opts": [
       "즉시 챔버를 열어라",
       "값을 확인하고 계속 지켜봐라",
       "조장을 부르지 마라"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 계기판으로 상태 읽기",
    "which": "devicePanel",
    "intro": "LED 색과 진동 계기판을 보고 정상/경고/알람 상태를 구분해 보자. 빨간 LED는 alarm, 노란 LED는 warning을 뜻한다. 각 계기의 바늘이 설정값(setpoint)을 벗어났는지 관찰하라."
   },
   {
    "type": "read",
    "title": "3가지 대표 알람 케이스",
    "intro": "이번 실습에서 다룰 세 장치를 미리 살펴보자.",
    "paras": [
     "**VAC-101 (진공 계통):** 'Chamber vacuum failure'. 챔버 진공이 목표에 도달하지 못함. 흔한 원인은 도어 누설(leak)이나 진공 펌프 문제. 조치는 도어 밀폐 확인 후 pump-down 재시도, 계속되면 정비 호출.",
     "**RF-204 (RF 전력 계통):** 'RF power reflected high'. RF 반사 전력이 높음. 흔한 원인은 매칭(matching) 불량이나 챔버 압력 이상. 조치는 매칭 확인 및 압력 확인, 필요 시 RF 재기동.",
     "**GAS-330 (가스 계통):** 'Gas flow timeout'. MFC(질량 유량 제어기)가 설정 유량에 시간 내 도달하지 못함. 흔한 원인은 가스 라인 막힘이나 MFC 이상. 조치는 라인·밸브 확인 후 재시도, 반복되면 MFC 점검."
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 영문 알람 해석과 조치 선택",
    "which": "alarm",
    "intro": "VAC-101, RF-204, GAS-330 세 케이스의 가상 알람이 영어로 뜬다. 각 메시지를 읽고 (1) 어느 장치인지, (2) 원인이 무엇인지, (3) 올바른 조치가 무엇인지 객관식으로 고르면 자동 채점된다. 매뉴얼의 '바로 리셋하지 말 것' 원칙을 기억하며 풀어 보자."
   },
   {
    "type": "sim",
    "title": "실습 — 알람 로그 확인",
    "which": "equipment",
    "intro": "가상 장비 HMI에서 알람 로그(alarm log)를 열어 시간순으로 어떤 알람이 떴는지 확인해 보자. 어떤 장치가 먼저 알람을 냈는지, 경고(warning)가 알람(alarm)으로 커졌는지 순서를 읽는 연습이다."
   },
   {
    "type": "read",
    "title": "로그와 오류 메시지 읽기",
    "intro": "알람 로그는 문제 해결의 단서다.",
    "paras": [
     "알람 로그에는 시간(time), 장치(device), 메시지(message), 등급(level)이 함께 기록된다. 예: '03:12 VAC-101 Chamber vacuum failure ALARM'. 시간 순서를 보면 문제가 어디서 시작됐는지 알 수 있다.",
     "가끔 여러 알람이 연달아 뜬다. 이때는 **가장 먼저 뜬 알람(root alarm)**이 진짜 원인인 경우가 많다. 뒤따라 온 알람은 그 결과일 수 있다. 그래서 로그를 위에서 아래로 시간순으로 읽는 습관이 중요하다.",
     "메시지에 자주 나오는 표현: 'out of range'(범위 벗어남), 'below setpoint'(설정값 미만), 'timed out'(시간 초과), 'not responding'(응답 없음). 이 표현을 알아두면 낯선 알람도 뜻을 짐작할 수 있다."
    ]
   },
   {
    "type": "quiz",
    "title": "로그 해석 퀴즈",
    "questions": [
     {
      "prompt": "\"Gas flow timed out\"가 뜻하는 것은?",
      "opts": [
       "가스 유량이 시간 내 목표에 도달하지 못함",
       "가스가 정상이다",
       "챔버가 열렸다"
      ],
      "ans": 0
     },
     {
      "prompt": "여러 알람이 연달아 떴을 때 진짜 원인일 가능성이 큰 것은?",
      "opts": [
       "가장 마지막에 뜬 알람",
       "가장 먼저 뜬 알람(root alarm)",
       "노란색 warning만"
      ],
      "ans": 1
     },
     {
      "prompt": "\"MFC not responding\"의 뜻으로 알맞은 것은?",
      "opts": [
       "MFC가 응답하지 않는다",
       "MFC가 정상이다",
       "MFC를 리셋했다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "VAC-101에 진공 실패 알람이 떠서 외국인 엔지니어에게 상황을 알린다.",
      "q": {
       "en": "VAC-101 shows a chamber vacuum failure. Should I reset it now?",
       "ko": "VAC-101에 챔버 진공 실패가 떴어요. 지금 리셋할까요?"
      },
      "a": {
       "en": "No, don't reset yet. Check the door seal first, then retry the pump-down.",
       "ko": "아니요, 아직 리셋하지 마세요. 먼저 도어 밀폐를 확인하고 pump-down을 다시 시도하세요."
      }
     },
     {
      "sit": "RF-204의 반사 전력이 높다는 알람을 설명한다.",
      "q": {
       "en": "The reflected power on RF-204 is too high. What should I check?",
       "ko": "RF-204의 반사 전력이 너무 높아요. 무엇을 확인해야 하나요?"
      },
      "a": {
       "en": "Check the matching and the chamber pressure. If it stays high, call maintenance.",
       "ko": "매칭과 챔버 압력을 확인하세요. 계속 높으면 정비를 부르세요."
      }
     },
     {
      "sit": "GAS-330의 가스 유량 타임아웃 알람을 보고 도움을 요청한다.",
      "q": {
       "en": "GAS-330 has a gas flow timeout. Is it safe to keep running?",
       "ko": "GAS-330에 가스 유량 타임아웃이 떴어요. 계속 돌려도 안전한가요?"
      },
      "a": {
       "en": "Stop the recipe and check the gas line and valve. Then retry the flow.",
       "ko": "레시피를 멈추고 가스 라인과 밸브를 확인하세요. 그런 다음 유량을 다시 시도하세요."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "종합 조치 퀴즈",
    "intro": "케이스별 올바른 조치를 골라 보자.",
    "questions": [
     {
      "prompt": "VAC-101 'Chamber vacuum failure'의 첫 조치로 알맞은 것은?",
      "opts": [
       "바로 알람 리셋",
       "도어 밀폐 확인 후 pump-down 재시도",
       "인터록 무시"
      ],
      "ans": 1
     },
     {
      "prompt": "RF-204 'reflected power high'의 흔한 원인은?",
      "opts": [
       "매칭 불량·압력 이상",
       "가스 라인 막힘",
       "도어 열림"
      ],
      "ans": 0
     },
     {
      "prompt": "인터록이 걸려 문이 안 열릴 때 올바른 태도는?",
      "opts": [
       "혼자 강제로 우회한다",
       "안전을 확인하고 필요 시 조장을 부른다",
       "그냥 리셋한다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "알람 메시지는 '어디서-무엇이-어떻게' 순서로 끊어 읽는다. (예: RF-204 / RF power / reflected high)",
     "등급을 구분한다: warning(노랑, 지켜봄) < alarm(빨강, 즉시 조치) / interlock(강제 정지, 혼자 우회 금지).",
     "핵심 케이스: VAC-101 진공 실패→도어·펌프 확인, RF-204 반사 전력 높음→매칭·압력 확인, GAS-330 유량 타임아웃→가스 라인·MFC 확인. 원인을 먼저 파악하고 조치한다."
    ],
    "done": "**6주 완료 ✓** — 영문 알람을 읽고 원인과 조치를 스스로 고를 수 있다."
   }
  ]
 },
 {
  "id": "w7",
  "title": "7주 · 유지보수(PM)",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "월요일 아침, PM 데이",
    "text": "오늘은 식각 장비의 **정기 유지보수(PM)** 날이다. 팀 리더가 영어로 된 **maintenance manual(유지보수 매뉴얼)** 과 **checklist(점검표)** 를 건넨다. \"Please **inspect** the chamber, **clean** the electrode, and **replace** the O-ring.\" 신입인 너는 매뉴얼의 동사 하나하나가 곧 손으로 해야 할 작업이라는 걸 깨닫는다. **inspect, clean, replace, calibrate, tighten** — 이 다섯 단어를 정확히 알아야 실수 없이 PM을 끝낼 수 있다."
   },
   {
    "type": "read",
    "title": "PM이란 무엇인가",
    "intro": "고장 나기 전에 미리 관리하는 것",
    "paras": [
     "PM은 **Preventive Maintenance(예방 유지보수)** 의 약자다. 장비가 고장 나서 멈추기 전에, 정해진 주기(daily, weekly, monthly)마다 미리 점검하고 부품을 관리하는 활동을 말한다.",
     "반도체 공장은 장비가 하루라도 멈추면 큰 손실이 난다. 그래서 계획된 시간에 미리 청소하고, 교체하고, 조정해서 **unplanned downtime(계획에 없던 가동 중단)** 을 막는다.",
     "PM 작업은 대부분 영문 매뉴얼과 점검표를 보고 진행한다. 각 항목 옆에 체크(✓)를 하거나 측정값을 적고, 마지막에 서명(sign)한다. 그래서 매뉴얼에 자주 나오는 동사들을 아는 것이 실무의 시작이다."
    ]
   },
   {
    "type": "read",
    "title": "PM 매뉴얼의 핵심 동사 5개",
    "paras": [
     "**inspect** — 눈으로 확인하고 점검한다. (예: 챔버 내부에 손상이 있는지 inspect)",
     "**clean** — 오염물이나 잔류물을 청소한다. (예: 전극(electrode)을 clean)",
     "**replace** — 오래되거나 손상된 부품을 새것으로 교체한다. (예: O-ring을 replace)",
     "**calibrate** — 계측기나 센서를 표준값에 맞게 조정·교정한다. (예: MFC를 calibrate)",
     "**tighten** — 볼트나 피팅을 단단히 조인다. (예: 느슨한 bolt를 tighten)"
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "items": [
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 유지보수"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량 유량 제어기"
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "무선 주파수(고주파)"
     },
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "사람-기계 인터페이스(조작 화면)"
     },
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeter per Minute",
      "ko": "분당 표준 세제곱센티미터(가스 유량 단위)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — PM 작업 동사",
    "intro": "매뉴얼에 가장 자주 나오는 동사들",
    "items": [
     {
      "en": "inspect",
      "ko": "점검하다",
      "d": "눈이나 도구로 상태를 확인함",
      "ex": "Inspect the chamber for damage before starting."
     },
     {
      "en": "clean",
      "ko": "청소하다",
      "d": "잔류물이나 오염을 제거함",
      "ex": "Clean the electrode with a lint-free wipe."
     },
     {
      "en": "replace",
      "ko": "교체하다",
      "d": "낡은 부품을 새것으로 바꿈",
      "ex": "Replace the O-ring every three months."
     },
     {
      "en": "calibrate",
      "ko": "교정하다",
      "d": "센서·계측기를 표준값에 맞춤",
      "ex": "Calibrate the MFC to 100 sccm."
     },
     {
      "en": "tighten",
      "ko": "조이다",
      "d": "볼트·피팅을 단단히 잠금",
      "ex": "Tighten all bolts to the correct torque."
     },
     {
      "en": "checklist",
      "ko": "점검표",
      "d": "확인할 항목을 나열한 표",
      "ex": "Follow each item on the PM checklist."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 동사 뜻",
    "intro": "PM 동사의 뜻을 골라라.",
    "questions": [
     {
      "prompt": "“replace”의 뜻은?",
      "opts": [
       "교체하다",
       "점검하다",
       "조이다"
      ],
      "ans": 0
     },
     {
      "prompt": "“calibrate”의 뜻은?",
      "opts": [
       "청소하다",
       "교정하다",
       "교체하다"
      ],
      "ans": 1
     },
     {
      "prompt": "“tighten”의 뜻은?",
      "opts": [
       "느슨하게 하다",
       "조이다",
       "점검하다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — PM 부품·대상",
    "intro": "점검하고 교체하는 대상들",
    "items": [
     {
      "en": "O-ring",
      "ko": "오링",
      "d": "진공 밀봉용 고무 링",
      "ex": "The O-ring keeps the chamber under vacuum."
     },
     {
      "en": "electrode",
      "ko": "전극",
      "d": "플라즈마를 만드는 금속판",
      "ex": "Clean the electrode after every 100 wafers."
     },
     {
      "en": "filter",
      "ko": "필터",
      "d": "가스나 액체의 오염을 걸러냄",
      "ex": "Replace the filter if it looks dirty."
     },
     {
      "en": "bolt",
      "ko": "볼트",
      "d": "부품을 고정하는 나사",
      "ex": "Check that no bolt is loose."
     },
     {
      "en": "gasket",
      "ko": "개스킷",
      "d": "이음새를 밀봉하는 부품",
      "ex": "A worn gasket can cause a leak."
     },
     {
      "en": "spare part",
      "ko": "예비 부품",
      "d": "교체용으로 준비된 부품",
      "ex": "Keep spare parts ready before the PM."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 부품 이름",
    "questions": [
     {
      "prompt": "“O-ring”의 역할은?",
      "opts": [
       "플라즈마 생성",
       "진공 밀봉",
       "가스 유량 측정"
      ],
      "ans": 1
     },
     {
      "prompt": "“electrode”의 뜻은?",
      "opts": [
       "전극",
       "필터",
       "개스킷"
      ],
      "ans": 0
     },
     {
      "prompt": "느슨한지 확인해야 하는 “bolt”는?",
      "opts": [
       "볼트",
       "오링",
       "전극"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "PM 매뉴얼 발췌 (1)",
    "mtitle": "MANUAL · Monthly PM — Etch Chamber",
    "paras": [
     "**Step 1.** Turn off the RF power and vent the chamber before you start.",
     "**Step 2.** **Inspect** the chamber wall and electrode for cracks or residue.",
     "**Step 3.** **Clean** the electrode surface with a lint-free wipe and IPA.",
     "**Step 4.** **Replace** the O-ring and gasket with new spare parts.",
     "**Step 5.** **Tighten** all bolts to the specified torque, then close the chamber."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 매뉴얼 해석 (1)",
    "intro": "위 매뉴얼을 읽고 답하라.",
    "questions": [
     {
      "prompt": "Step 1에서 시작 전에 해야 하는 일은?",
      "opts": [
       "RF 전원을 끄고 챔버를 벤트한다",
       "전극을 청소한다",
       "볼트를 조인다"
      ],
      "ans": 0
     },
     {
      "prompt": "Step 3에서 전극을 청소할 때 쓰는 것은?",
      "opts": [
       "물걸레",
       "보풀 없는 와이프와 IPA",
       "새 볼트"
      ],
      "ans": 1
     },
     {
      "prompt": "“Replace the O-ring”은 무슨 뜻?",
      "opts": [
       "오링을 점검하라",
       "오링을 교체하라",
       "오링을 조여라"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "manual",
    "title": "PM 매뉴얼 발췌 (2)",
    "mtitle": "MANUAL · Calibration & Sign-off",
    "paras": [
     "**Calibrate** the MFC and set the gas flow to **100 sccm**.",
     "Check the reading on the HMI screen. It must be within **±2%** of the target.",
     "If the reading is out of range, adjust and calibrate again.",
     "Record each result on the checklist and **sign** the PM sheet when done.",
     "**Note:** Do not skip any item. An unchecked item means the PM is not complete."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 매뉴얼 해석 (2)",
    "questions": [
     {
      "prompt": "MFC의 가스 유량을 얼마로 맞추라고 했나?",
      "opts": [
       "10 sccm",
       "100 sccm",
       "1000 sccm"
      ],
      "ans": 1
     },
     {
      "prompt": "HMI 화면의 값은 목표값의 몇 % 이내여야 하나?",
      "opts": [
       "±2%",
       "±20%",
       "±0.2%"
      ],
      "ans": 0
     },
     {
      "prompt": "PM이 끝나면 마지막에 해야 하는 일은?",
      "opts": [
       "전원을 켠다",
       "점검표에 서명한다",
       "챔버를 연다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 식각 장비 구성도",
    "which": "chamber",
    "intro": "PM 대상인 식각 장비의 각 부위를 눌러 영어 라벨(electrode, chamber wall, O-ring 등)을 확인하라. 어느 부위를 inspect/clean/replace 하는지 위치를 익힌다."
   },
   {
    "type": "sim",
    "title": "실습 — PM 점검표 작성",
    "which": "pm",
    "intro": "영문 PM 점검표를 직접 채워본다. 각 항목(Inspect chamber, Clean electrode, Replace O-ring, Calibrate MFC, Tighten bolts)을 순서대로 확인하고 체크(✓)한 뒤, 측정값을 입력하고 마지막에 sign 한다."
   },
   {
    "type": "sim",
    "title": "실습 — 계기판 상태 확인",
    "which": "devicePanel",
    "intro": "PM 후 장비를 켜고 LED와 진동 계기판을 확인한다. 초록불(normal)과 정상 진동값이 나오는지 보고, 이상이 있으면 다시 점검한다."
   },
   {
    "type": "read",
    "title": "PM 로그와 이상 항목 해석",
    "intro": "점검표에 남는 기록 읽기",
    "paras": [
     "PM이 끝나면 각 항목의 상태를 로그에 남긴다. 보통 **OK / Done / Pass** 는 정상, **NG(No Good) / Fail / Out of range** 는 이상을 뜻한다.",
     "예를 들어 점검표에 \"O-ring: **replaced**\", \"Electrode: **cleaned**\", \"MFC: **calibrated, 100 sccm, OK**\" 처럼 과거형 동사로 완료를 표시한다.",
     "이상이 있으면 \"MFC reading **out of range**, needs recalibration\" 처럼 짧게 문제를 적고, 담당자에게 보고한다. 이렇게 남긴 기록은 다음 PM 때 참고 자료가 된다."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 로그 해석",
    "questions": [
     {
      "prompt": "점검표의 “NG”는 무슨 뜻?",
      "opts": [
       "정상",
       "이상(No Good)",
       "다음 주차"
      ],
      "ans": 1
     },
     {
      "prompt": "“O-ring: replaced”의 뜻은?",
      "opts": [
       "오링을 교체했다",
       "오링을 점검할 예정이다",
       "오링이 정상이다"
      ],
      "ans": 0
     },
     {
      "prompt": "“MFC reading out of range”는 무슨 상황?",
      "opts": [
       "측정값이 정상 범위를 벗어남",
       "측정값이 완벽함",
       "측정을 안 함"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "PM을 시작하기 전에 무엇부터 해야 하는지 확인한다.",
      "q": {
       "en": "What should I inspect first before the PM?",
       "ko": "PM 전에 무엇을 먼저 점검해야 하나요?"
      },
      "a": {
       "en": "Inspect the chamber and electrode for any damage first.",
       "ko": "먼저 챔버와 전극에 손상이 있는지 점검하세요."
      }
     },
     {
      "sit": "O-ring을 교체해야 하는지 묻는다.",
      "q": {
       "en": "Do I need to replace the O-ring today?",
       "ko": "오늘 오링을 교체해야 하나요?"
      },
      "a": {
       "en": "Yes, replace it and tighten all the bolts after.",
       "ko": "네, 교체하고 나서 볼트를 전부 조이세요."
      }
     },
     {
      "sit": "MFC 측정값이 범위를 벗어났다고 보고한다.",
      "q": {
       "en": "The MFC reading is out of range. What should I do?",
       "ko": "MFC 측정값이 범위를 벗어났어요. 어떻게 할까요?"
      },
      "a": {
       "en": "Calibrate it again and check the reading on the HMI.",
       "ko": "다시 교정하고 HMI에서 값을 확인하세요."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 대화 표현",
    "questions": [
     {
      "prompt": "“Do I need to replace the O-ring?”의 뜻은?",
      "opts": [
       "오링을 교체해야 하나요?",
       "오링을 청소했나요?",
       "오링이 어디 있나요?"
      ],
      "ans": 0
     },
     {
      "prompt": "“Calibrate it again.”의 뜻은?",
      "opts": [
       "다시 교정하세요",
       "다시 청소하세요",
       "다시 조이세요"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "PM은 Preventive Maintenance, 고장 전에 미리 하는 예방 유지보수다.",
     "핵심 동사 5개: inspect(점검) · clean(청소) · replace(교체) · calibrate(교정) · tighten(조이기).",
     "영문 점검표는 각 항목을 확인·기록하고 마지막에 서명(sign)한다. OK는 정상, NG/out of range는 이상."
    ],
    "done": "**7주 완료 ✓** — 이제 영문 PM 매뉴얼과 점검표를 읽고 작업 순서를 따라갈 수 있다."
   }
  ]
 },
 {
  "id": "w8",
  "title": "8주 · 중간고사",
  "kind": "평가",
  "slides": [
   {
    "type": "story",
    "icon": "📝",
    "title": "중간고사 안내",
    "text": "1~7주에 배운 **장비 구성 · 운전 절차 · 로그 값 · 알람 해석**을 확인합니다. 영어 문장과 용어를 읽고 답하세요."
   },
   {
    "type": "quiz",
    "title": "① 장비 구성요소",
    "intro": "부품의 영어 이름·기능을 확인합니다.",
    "questions": [
     {
      "prompt": "Which part evacuates the chamber to vacuum?",
      "opts": [
       "Turbo pump",
       "RF generator",
       "MFC"
      ],
      "ans": 0
     },
     {
      "prompt": "The MFC (Mass Flow Controller) controls the ___.",
      "opts": [
       "gas flow",
       "RF power",
       "temperature"
      ],
      "ans": 0
     },
     {
      "prompt": "“Wafer chuck” 의 역할은?",
      "opts": [
       "웨이퍼를 고정·지지",
       "가스를 배기",
       "전력을 공급"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "quiz",
    "title": "② 운전 절차",
    "intro": "운전 동사와 순서를 확인합니다.",
    "questions": [
     {
      "prompt": "“Evacuate the chamber” 의 뜻은?",
      "opts": [
       "챔버를 배기하라",
       "챔버를 열어라",
       "가스를 넣어라"
      ],
      "ans": 0
     },
     {
      "prompt": "올바른 운전 순서는?",
      "opts": [
       "Load → Pump down → Ignite",
       "Ignite → Load → Vent",
       "Vent → Load → Pump down"
      ],
      "ans": 0
     },
     {
      "prompt": "“Vent” 는 무엇인가?",
      "opts": [
       "챔버를 대기압으로 되돌림",
       "진공으로 배기",
       "가스를 점화"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "quiz",
    "title": "③ 로그·값 읽기",
    "intro": "계기 값과 로그 문장을 해석합니다.",
    "questions": [
     {
      "prompt": "“set point” 와 “actual value” 의 차이는?",
      "opts": [
       "목표값 vs 실측값",
       "실측값 vs 목표값",
       "최대 vs 최소"
      ],
      "ans": 0
     },
     {
      "prompt": "“Base pressure reached.” 의 뜻은?",
      "opts": [
       "기준 압력에 도달했다",
       "압력이 초과했다",
       "누설이 생겼다"
      ],
      "ans": 0
     },
     {
      "prompt": "“Gas flow is 50 sccm and stable.” 는?",
      "opts": [
       "유량 50 sccm, 안정적",
       "유량이 0",
       "가스 누설"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "quiz",
    "title": "④ 알람·조치",
    "intro": "알람을 읽고 조치를 고릅니다.",
    "questions": [
     {
      "prompt": "“Process stopped by the interlock.” 의 뜻은?",
      "opts": [
       "인터록으로 공정이 멈췄다",
       "공정이 정상 완료됐다",
       "공정을 재시작했다"
      ],
      "ans": 0
     },
     {
      "prompt": "High reflected power(반사파 높음) → 먼저 점검할 것은?",
      "opts": [
       "pressure & matching",
       "wafer size",
       "room light"
      ],
      "ans": 0
     },
     {
      "prompt": "“Chamber pressure is above the allowable limit.” → 어느 계통?",
      "opts": [
       "진공(vacuum)",
       "RF",
       "조명"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "중간고사 정리",
    "points": [
     "장비 구성 · 운전 · 로그 · 알람 영어를 점검했다.",
     "9주부터는 디자인(Layer·DRC·LVS)으로 넘어간다."
    ],
    "done": "**중간고사 완료 ✓**"
   }
  ]
 },
 {
  "id": "w9",
  "title": "9주 · Layer 용어",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "레이아웃 회의실에서",
    "text": "월요일 아침, 외국인 레이아웃 엔지니어가 화면에 칩 도면을 띄우고 말한다. \"Let's check the **Well** and **Active** layers first.\" 신입인 너는 색깔별로 겹쳐진 도형들을 보며 각 층이 무슨 뜻인지 몰라 당황한다. 반도체 칩은 **Layer(층)** 를 하나씩 쌓아 만든다. 각 Layer 는 공정 한 단계의 결과이고, 그 결과를 그림으로 그린 것이 **Layout(레이아웃)** 이다. 오늘은 웨이퍼 **단면도**를 보며 Well, Active, Poly, Implant, Contact, Metal 같은 핵심 Layer 영어 이름을 익힌다."
   },
   {
    "type": "read",
    "title": "공정과 레이아웃의 관계",
    "intro": "레이아웃은 공정을 그림으로 지시하는 설계도다.",
    "paras": [
     "반도체 칩은 웨이퍼 위에 여러 층(Layer)을 순서대로 쌓아 만든다. 각 층은 특정 공정 한 단계의 결과다. 예를 들어 이온을 주입하면 Implant 층이 생기고, 금속을 배선하면 Metal 층이 생긴다.",
     "설계자는 각 층을 어디에, 어떤 모양으로 만들지 컴퓨터 화면에 색깔 도형으로 그린다. 이 도형 모음이 레이아웃(Layout)이다. 즉 레이아웃은 '공정에게 내리는 그림 명령서'라고 볼 수 있다.",
     "레이아웃의 한 Layer 는 공정의 한 마스크(Mask) 또는 한 단계와 짝을 이룬다. 그래서 레이아웃 색을 보면 그 자리에 어떤 공정 결과가 만들어지는지 알 수 있다. 단면도(Cross-section)로 보면 이 관계가 훨씬 쉽게 이해된다."
    ]
   },
   {
    "type": "read",
    "title": "단면도로 보는 Layer 순서",
    "intro": "아래에서 위로 쌓이는 순서를 기억하자.",
    "paras": [
     "가장 아래는 실리콘 기판(Substrate)이다. 그 안에 넓게 도핑된 영역이 Well 이다. Well 위에서 실제로 전류가 흐르는 소자 영역이 Active 다.",
     "Active 위를 가로지르는 게이트 배선이 Poly(폴리실리콘)다. Poly 양옆으로 이온을 넣은 영역이 Implant(소스/드레인)다.",
     "그 위에 절연막을 덮고, 아래 소자와 위 금속을 연결하는 작은 구멍이 Contact 다. 맨 위에 배선으로 깔리는 금속층이 Metal 이다. 정리하면 Substrate → Well → Active → Poly → Implant → Contact → Metal 순으로 이해하면 된다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "items": [
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사"
     },
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃과 회로도 비교"
     },
     {
      "ab": "GDS",
      "full": "Graphic Data System",
      "ko": "레이아웃 도면 파일 형식"
     },
     {
      "ab": "STI",
      "full": "Shallow Trench Isolation",
      "ko": "얕은 트렌치 소자 분리"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 Layer 용어 (1)",
    "intro": "단면도 아래쪽 층부터 익히자.",
    "items": [
     {
      "en": "Substrate",
      "ko": "기판",
      "d": "칩의 바탕이 되는 실리콘 웨이퍼 몸체.",
      "ex": "All layers are built on the silicon substrate."
     },
     {
      "en": "Well",
      "ko": "웰",
      "d": "기판 안에 넓게 도핑한 영역. 소자의 바탕이 된다.",
      "ex": "The transistor sits inside an N-well."
     },
     {
      "en": "Active",
      "ko": "액티브",
      "d": "실제로 전류가 흐르는 소자 활성 영역.",
      "ex": "Draw the active area for each transistor."
     },
     {
      "en": "Poly",
      "ko": "폴리(게이트)",
      "d": "폴리실리콘 게이트 배선. Active 위를 지난다.",
      "ex": "The poly line forms the gate."
     },
     {
      "en": "Implant",
      "ko": "임플란트",
      "d": "이온을 주입해 만든 소스/드레인 영역.",
      "ex": "The implant mask defines source and drain."
     },
     {
      "en": "Layer",
      "ko": "레이어(층)",
      "d": "레이아웃과 공정에서의 한 층.",
      "ex": "Each layer has its own color."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "방금 배운 용어를 확인하자.",
    "questions": [
     {
      "prompt": "“Well”의 뜻은?",
      "opts": [
       "기판 안에 넓게 도핑한 영역(웰)",
       "금속 배선",
       "게이트 절연막"
      ],
      "ans": 0
     },
     {
      "prompt": "“Active”가 가리키는 것은?",
      "opts": [
       "전류가 흐르는 소자 활성 영역",
       "칩 포장 재료",
       "냉각수 배관"
      ],
      "ans": 0
     },
     {
      "prompt": "“Poly line forms the gate.” 에서 Poly 는?",
      "opts": [
       "폴리실리콘 게이트 배선",
       "금속 패드",
       "실리콘 기판"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 Layer 용어 (2)",
    "intro": "단면도 위쪽 층으로 올라가자.",
    "items": [
     {
      "en": "Contact",
      "ko": "콘택트",
      "d": "아래 소자와 위 금속을 잇는 작은 연결 구멍.",
      "ex": "Place a contact to connect poly and metal."
     },
     {
      "en": "Metal",
      "ko": "메탈",
      "d": "칩 위쪽에 깔리는 금속 배선층.",
      "ex": "Metal 1 routes the signal to the pad."
     },
     {
      "en": "Via",
      "ko": "비아",
      "d": "위아래 두 금속층을 잇는 연결 구멍.",
      "ex": "A via connects metal 1 and metal 2."
     },
     {
      "en": "Cross-section",
      "ko": "단면도",
      "d": "층이 쌓인 모습을 옆에서 자른 그림.",
      "ex": "Look at the cross-section to see the stack."
     },
     {
      "en": "Mask",
      "ko": "마스크",
      "d": "각 Layer 모양을 새긴 공정용 판.",
      "ex": "Each layer needs its own mask."
     },
     {
      "en": "Layout",
      "ko": "레이아웃",
      "d": "각 Layer 를 색 도형으로 그린 설계도.",
      "ex": "Open the layout and check the layers."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "questions": [
     {
      "prompt": "“Contact”의 역할은?",
      "opts": [
       "아래 소자와 위 금속을 잇는 연결 구멍",
       "웨이퍼를 자르는 칼",
       "챔버 압력 조절"
      ],
      "ans": 0
     },
     {
      "prompt": "“Metal 1 routes the signal.” 에서 Metal 은?",
      "opts": [
       "금속 배선층",
       "이온 주입 영역",
       "게이트 절연막"
      ],
      "ans": 0
     },
     {
      "prompt": "두 금속층을 위아래로 잇는 구멍은?",
      "opts": [
       "Via",
       "Well",
       "Active"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 읽기 — Layer 스택",
    "mtitle": "MANUAL · Layer Stack Description",
    "paras": [
     "The device is built layer by layer on the **substrate**.",
     "First, the **well** is doped into the substrate.",
     "The **active** area defines where the transistor works.",
     "A **poly** line crosses the active area to form the gate.",
     "**Implant** regions on both sides become the source and drain.",
     "**Contacts** connect the device to the first **metal** layer above."
    ]
   },
   {
    "type": "quiz",
    "title": "매뉴얼 해석 퀴즈",
    "intro": "위 매뉴얼 문장을 이해했는지 확인하자.",
    "questions": [
     {
      "prompt": "“The well is doped into the substrate.” 의 뜻은?",
      "opts": [
       "웰은 기판 안에 도핑된다",
       "웰은 기판 위에 붙인다",
       "웰은 금속으로 만든다"
      ],
      "ans": 0
     },
     {
      "prompt": "“A poly line crosses the active area to form the gate.” 의 뜻은?",
      "opts": [
       "폴리 배선이 액티브 영역을 가로질러 게이트를 만든다",
       "금속이 웰을 덮는다",
       "콘택트가 기판을 뚫는다"
      ],
      "ans": 0
     },
     {
      "prompt": "“Implant regions become the source and drain.” 에서 Implant 영역은 무엇이 되나?",
      "opts": [
       "소스와 드레인",
       "게이트 절연막",
       "금속 패드"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 단면도에서 Layer 이름 찾기",
    "which": "layer",
    "intro": "웨이퍼 단면도가 나온다. Substrate, Well, Active, Poly, Implant, Contact, Metal 의 위치를 눈으로 확인하고, 각 층의 영어 이름표를 클릭해 맞춰 보자."
   },
   {
    "type": "read",
    "title": "레이아웃 색과 공정 결과",
    "intro": "레이아웃 색은 곧 공정 단계다.",
    "paras": [
     "레이아웃 화면에서 각 Layer 는 서로 다른 색으로 표시된다. 예를 들어 Active 는 녹색, Poly 는 빨강, Metal 은 파랑처럼 팀마다 색 규칙이 정해져 있다.",
     "설계자가 어떤 자리에 Poly 도형을 그리면, 실제 공정에서 그 자리에 폴리실리콘 게이트가 만들어진다. Contact 도형을 그리면 그 자리에 연결 구멍이 뚫린다. 즉 레이아웃의 도형 하나하나가 공정 결과 하나하나와 대응한다.",
     "그래서 레이아웃을 잘못 그리면(예: Contact 가 Metal 밖으로 나가면) 실제 칩에서 연결이 끊긴다. 이런 실수를 미리 잡기 위해 DRC(Design Rule Check, 디자인 규칙 검사)와 LVS(Layout Versus Schematic, 레이아웃과 회로도 비교)를 돌린다."
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 디자인 규칙 오류 찾기",
    "which": "drc",
    "intro": "간단한 레이아웃에서 DRC(디자인 규칙 검사) 오류를 찾아보자. Contact 가 Metal 밖으로 나가거나 층 간격이 너무 좁은 곳을 클릭해 오류를 표시하고, 영문 오류 메시지를 읽어 보자."
   },
   {
    "type": "read",
    "title": "DRC 오류 메시지 읽기",
    "intro": "실무 영문 오류 메시지는 짧고 정해진 형식이다.",
    "paras": [
     "DRC 를 돌리면 영어 오류 메시지가 목록으로 나온다. 보통 '어느 Layer 가 / 무슨 규칙을 / 얼마나' 어겼는지 알려 준다. 예: \"Metal to metal spacing is too small.\" 은 금속과 금속 사이 간격이 규칙보다 좁다는 뜻이다.",
     "\"Contact not covered by metal.\" 은 콘택트가 금속에 덮이지 않았다는 뜻으로, 연결이 끊길 수 있는 위험한 오류다. \"Poly width below minimum.\" 은 폴리 배선 폭이 최소값보다 작다는 뜻이다.",
     "이런 메시지에서 핵심은 Layer 이름(Metal, Contact, Poly)과 규칙 단어(spacing 간격, width 폭, overlap 겹침)다. 이 두 가지만 잡으면 오류 위치와 원인을 빠르게 이해할 수 있다."
    ]
   },
   {
    "type": "quiz",
    "title": "오류 해석 퀴즈",
    "questions": [
     {
      "prompt": "“Contact not covered by metal.” 의 뜻은?",
      "opts": [
       "콘택트가 금속에 덮이지 않았다",
       "금속이 너무 두껍다",
       "콘택트가 너무 많다"
      ],
      "ans": 0
     },
     {
      "prompt": "“Metal to metal spacing is too small.” 에서 문제는?",
      "opts": [
       "금속 사이 간격이 너무 좁다",
       "금속 두께가 얇다",
       "금속 색이 틀렸다"
      ],
      "ans": 0
     },
     {
      "prompt": "“Poly width below minimum.” 의 뜻은?",
      "opts": [
       "폴리 폭이 최소값보다 작다",
       "폴리가 너무 길다",
       "폴리가 없다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 레이아웃과 회로도 비교(LVS)",
    "which": "lvs",
    "intro": "LVS(Layout Versus Schematic)는 그린 레이아웃이 원래 회로도와 같은지 비교한다. 각 소자의 Poly(게이트), Implant(소스/드레인), Metal(배선) 연결을 확인하고, 회로도와 다른 부분을 찾아보자."
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "단면도를 함께 보며 층 이름을 물어볼 때",
      "q": {
       "en": "Which layer is right above the active area?",
       "ko": "액티브 영역 바로 위는 어떤 층인가요?"
      },
      "a": {
       "en": "That is the poly layer. It forms the gate.",
       "ko": "그건 폴리 층이에요. 게이트를 만들죠."
      }
     },
     {
      "sit": "레이아웃 색이 무슨 공정인지 물을 때",
      "q": {
       "en": "What does the blue layer mean here?",
       "ko": "여기서 파란 층은 무슨 뜻인가요?"
      },
      "a": {
       "en": "Blue is metal 1. It routes the signals.",
       "ko": "파랑은 메탈1이에요. 신호를 배선하죠."
      }
     },
     {
      "sit": "DRC 오류를 함께 확인할 때",
      "q": {
       "en": "Why is this contact flagged as an error?",
       "ko": "이 콘택트는 왜 오류로 표시됐나요?"
      },
      "a": {
       "en": "The contact is not fully covered by metal.",
       "ko": "콘택트가 금속에 완전히 덮이지 않았어요."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "마무리 퀴즈",
    "questions": [
     {
      "prompt": "칩을 만들 때 각 Layer 는 무엇의 결과인가?",
      "opts": [
       "공정 한 단계의 결과",
       "포장 단계의 결과",
       "검사 단계의 결과"
      ],
      "ans": 0
     },
     {
      "prompt": "레이아웃(Layout)이란?",
      "opts": [
       "각 Layer 를 색 도형으로 그린 설계도",
       "완성된 칩 사진",
       "장비 점검표"
      ],
      "ans": 0
     },
     {
      "prompt": "단면도에서 맨 위에 배선으로 깔리는 층은?",
      "opts": [
       "Metal",
       "Well",
       "Substrate"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "칩은 Substrate → Well → Active → Poly → Implant → Contact → Metal 순으로 층(Layer)을 쌓아 만든다.",
     "각 Layer 는 공정 한 단계의 결과이고, 레이아웃(Layout)은 그 층들을 색 도형으로 그린 설계도다.",
     "DRC(디자인 규칙 검사)와 LVS(레이아웃-회로도 비교)로 레이아웃 오류를 미리 잡는다. 영문 오류는 Layer 이름 + 규칙 단어(spacing, width, overlap)로 읽는다."
    ],
    "done": "**9주 완료 ✓** — 단면도로 Well·Active·Poly·Implant·Contact·Metal 영어 이름을 익혔다."
   }
  ]
 },
 {
  "id": "w10",
  "title": "10주 · Design Rule",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "레이아웃이 자꾸 반려된다",
    "text": "신입 엔지니어 지훈은 레이아웃 파일을 넘겼는데 **DRC(Design Rule Check)** 에서 수백 개의 에러가 떴다. 리더는 영어로 된 리포트를 보여주며 말했다. \"This line is too **narrow**. The **spacing** here is below **minimum**.\" 지훈은 규칙집(rule deck)의 영어 문장을 제대로 읽지 못해 어디를 고쳐야 할지 몰랐다. **Design Rule 영어 문장**만 읽을 수 있어도 절반은 해결된다는 걸 그날 배웠다."
   },
   {
    "type": "read",
    "title": "Design Rule 이란?",
    "intro": "칩을 만들 때 지켜야 하는 '치수 약속'입니다.",
    "paras": [
     "**Design Rule(디자인 규칙)** 은 반도체 레이아웃에서 각 패턴이 지켜야 하는 최소·최대 치수를 정한 규칙입니다. 선은 얼마나 굵어야 하는지, 두 패턴은 얼마나 떨어져야 하는지 등을 숫자로 정합니다.",
     "이 규칙을 어기면 공정에서 패턴이 제대로 안 만들어지거나 두 배선이 붙어버려(short) 불량이 납니다. 그래서 레이아웃을 넘기기 전에 **DRC(Design Rule Check)** 라는 자동 검사를 돌려 규칙 위반을 찾습니다.",
     "규칙은 보통 영어 한 문장으로 쓰여 있습니다. 예: \"Metal1 width must be at least 0.10 um.\" 핵심 단어 몇 개만 알면 대부분 해석됩니다."
    ]
   },
   {
    "type": "read",
    "title": "6가지 핵심 규칙 단어",
    "intro": "이 단어들이 규칙 문장의 90%를 차지합니다.",
    "paras": [
     "**width(폭)**: 패턴 하나의 굵기. **spacing(간격)**: 서로 다른 두 패턴 사이의 거리. **overlap(겹침)**: 두 층이 겹쳐야 하는 양.",
     "**enclosure(감쌈)**: 한 층이 다른 층을 얼마나 둘러싸야 하는지 (예: via를 metal이 감싸는 양). **minimum(최소)**: 이보다 작으면 안 됨. **maximum(최대)**: 이보다 크면 안 됨.",
     "문장 패턴은 거의 정해져 있습니다: \"[층 이름] [규칙 단어] must be at least/at most [숫자] um.\" — at least는 최소, at most는 최대를 뜻합니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "items": [
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사"
     },
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃-회로도 비교"
     },
     {
      "ab": "GDS",
      "full": "Graphic Design System",
      "ko": "레이아웃 파일 형식"
     },
     {
      "ab": "um",
      "full": "micrometer",
      "ko": "마이크로미터(치수 단위)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 규칙 단어",
    "intro": "규칙집에서 매일 만나는 단어들입니다.",
    "items": [
     {
      "en": "Width",
      "ko": "폭",
      "d": "패턴 하나의 굵기.",
      "ex": "The metal width must be at least 0.10 um."
     },
     {
      "en": "Spacing",
      "ko": "간격",
      "d": "두 패턴 사이의 거리.",
      "ex": "Keep the spacing between two lines above 0.12 um."
     },
     {
      "en": "Overlap",
      "ko": "겹침",
      "d": "두 층이 겹쳐야 하는 양.",
      "ex": "The overlap of poly and active must be 0.06 um."
     },
     {
      "en": "Enclosure",
      "ko": "감쌈",
      "d": "한 층이 다른 층을 둘러싸는 양.",
      "ex": "Metal must have 0.03 um enclosure around each via."
     },
     {
      "en": "Minimum",
      "ko": "최소",
      "d": "이보다 작으면 위반.",
      "ex": "This width is below the minimum value."
     },
     {
      "en": "Maximum",
      "ko": "최대",
      "d": "이보다 크면 위반.",
      "ex": "The pattern must not exceed the maximum width."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 규칙 단어 1",
    "questions": [
     {
      "prompt": "\"Spacing\"의 뜻은?",
      "opts": [
       "폭",
       "간격",
       "겹침"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Width\"의 뜻은?",
      "opts": [
       "폭",
       "간격",
       "감쌈"
      ],
      "ans": 0
     },
     {
      "prompt": "\"minimum\"의 뜻은?",
      "opts": [
       "최대",
       "평균",
       "최소"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 규칙 단어 2",
    "questions": [
     {
      "prompt": "\"Enclosure\"의 뜻은?",
      "opts": [
       "감쌈",
       "간격",
       "폭"
      ],
      "ans": 0
     },
     {
      "prompt": "\"at least 0.10 um\"의 의미는?",
      "opts": [
       "최대 0.10 um",
       "최소 0.10 um",
       "정확히 0.10 um만"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Overlap\"은 무엇에 대한 규칙인가?",
      "opts": [
       "두 층이 겹치는 양",
       "선 하나의 굵기",
       "두 선 사이 거리"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 규칙 문장 표현",
    "intro": "규칙 문장을 만드는 연결 표현입니다.",
    "items": [
     {
      "en": "at least",
      "ko": "최소 ~ 이상",
      "d": "이 값보다 크거나 같아야 함.",
      "ex": "The width must be at least 0.10 um."
     },
     {
      "en": "at most",
      "ko": "최대 ~ 이하",
      "d": "이 값보다 작거나 같아야 함.",
      "ex": "The width must be at most 5.0 um."
     },
     {
      "en": "exceed",
      "ko": "초과하다",
      "d": "정해진 값을 넘다.",
      "ex": "The line must not exceed the maximum width."
     },
     {
      "en": "below",
      "ko": "~ 아래로",
      "d": "기준보다 작은 상태.",
      "ex": "This spacing is below the minimum."
     },
     {
      "en": "above",
      "ko": "~ 위로",
      "d": "기준보다 큰 상태.",
      "ex": "Keep the spacing above 0.12 um."
     },
     {
      "en": "violation",
      "ko": "위반",
      "d": "규칙을 어긴 것.",
      "ex": "The report shows three violations."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 문장 표현",
    "questions": [
     {
      "prompt": "\"at most 5.0 um\"의 뜻은?",
      "opts": [
       "최소 5.0 um",
       "최대 5.0 um",
       "정확히 5.0 um"
      ],
      "ans": 1
     },
     {
      "prompt": "\"must not exceed\"의 뜻은?",
      "opts": [
       "넘어도 된다",
       "넘으면 안 된다",
       "같아야 한다"
      ],
      "ans": 1
     },
     {
      "prompt": "\"violation\"의 뜻은?",
      "opts": [
       "위반",
       "검사",
       "허가"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 — 가상 규칙집(Rule Deck)",
    "mtitle": "MANUAL · Design Rule Deck (Layer M1)",
    "paras": [
     "Rule M1.W.1: The **width** of Metal1 must be **at least** 0.10 um.",
     "Rule M1.S.1: The **spacing** between two Metal1 lines must be **at least** 0.12 um.",
     "Rule V1.EN.1: Metal1 must have an **enclosure** of **at least** 0.03 um around each via.",
     "Rule PO.OV.1: The **overlap** of poly over active must be **at least** 0.06 um.",
     "Rule M1.W.2: The width of any Metal1 line must **not exceed** the **maximum** of 5.0 um."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 규칙집 해석",
    "intro": "위 규칙집을 보고 답하세요.",
    "questions": [
     {
      "prompt": "Rule M1.W.1 에 따르면 Metal1 폭은 최소 몇 um?",
      "opts": [
       "0.03 um",
       "0.10 um",
       "0.12 um"
      ],
      "ans": 1
     },
     {
      "prompt": "Rule M1.S.1 은 무엇에 대한 규칙인가?",
      "opts": [
       "폭",
       "간격",
       "겹침"
      ],
      "ans": 1
     },
     {
      "prompt": "\"must not exceed the maximum of 5.0 um\"의 의미는?",
      "opts": [
       "5.0 um보다 커도 된다",
       "5.0 um를 넘으면 안 된다",
       "5.0 um보다 작으면 안 된다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 웨이퍼 단면으로 층 이해",
    "which": "layer",
    "intro": "규칙은 각 층(Layer)마다 다릅니다. 웨이퍼 단면 그림에서 Metal, Via, Poly, Active 층을 클릭해 어떤 층에 어떤 규칙이 붙는지 확인하세요."
   },
   {
    "type": "sim",
    "title": "실습 — DRC 로 width / spacing 확인",
    "which": "drc",
    "intro": "핵심 실습입니다. DRC(디자인 규칙 검사) 화면에서 선의 width(폭)와 두 선 사이의 spacing(간격)을 조절해 보세요. 규칙보다 작으면 빨간 에러가 뜹니다. 'Metal1 width < 0.10 um' 과 'Spacing < 0.12 um' 에러를 각각 만들어 보고, 값을 늘려 에러를 없애 보세요."
   },
   {
    "type": "read",
    "title": "DRC 에러 로그 읽기",
    "intro": "DRC 결과는 영어 로그로 나옵니다.",
    "paras": [
     "DRC를 돌리면 위반한 규칙마다 한 줄씩 에러가 출력됩니다. 예: \"ERROR M1.W.1: Metal1 width 0.08 um is below minimum 0.10 um.\" — 어느 규칙(M1.W.1)을, 어디서, 얼마만큼 어겼는지 알려줍니다.",
     "핵심은 세 가지를 찾는 것입니다: 규칙 이름(rule name), 측정값(measured value), 그리고 required 최소/최대값. \"below minimum\"이면 값을 키우고, \"exceeds maximum\"이면 값을 줄여야 합니다.",
     "에러가 0개가 되면 \"DRC clean\" 이라고 표시됩니다. 이 상태가 되어야 레이아웃을 다음 단계로 넘길 수 있습니다."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 에러 로그 해석",
    "questions": [
     {
      "prompt": "\"width 0.08 um is below minimum 0.10 um\" — 어떻게 고쳐야 하나?",
      "opts": [
       "폭을 더 넓힌다",
       "폭을 더 좁힌다",
       "간격을 줄인다"
      ],
      "ans": 0
     },
     {
      "prompt": "\"DRC clean\"의 뜻은?",
      "opts": [
       "에러가 남아있다",
       "규칙 위반이 없다",
       "검사를 안 했다"
      ],
      "ans": 1
     },
     {
      "prompt": "\"exceeds maximum\" 에러는 값을 어떻게?",
      "opts": [
       "줄여야 한다",
       "그대로 둔다",
       "키워야 한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — DRC 결과 영문 리포트 읽기",
    "which": "report",
    "intro": "DRC 검사가 끝나면 영어 리포트가 나옵니다. 리포트에서 규칙 이름(rule name), 위반 개수(violations), below minimum / exceeds maximum 표현을 찾아 어느 규칙을 어떻게 고칠지 정리해 보세요."
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "DRC 에러가 무슨 뜻인지 물어볼 때",
      "q": {
       "en": "What does this DRC error mean?",
       "ko": "이 DRC 에러가 무슨 뜻인가요?"
      },
      "a": {
       "en": "The metal width is below the minimum. You need to make the line wider.",
       "ko": "메탈 폭이 최소값보다 작아요. 선을 더 넓혀야 합니다."
      }
     },
     {
      "sit": "간격 규칙을 확인할 때",
      "q": {
       "en": "What is the minimum spacing for Metal1?",
       "ko": "Metal1의 최소 간격은 얼마인가요?"
      },
      "a": {
       "en": "It must be at least 0.12 um between two lines.",
       "ko": "두 선 사이가 최소 0.12 um는 되어야 합니다."
      }
     },
     {
      "sit": "수정 후 결과를 알릴 때",
      "q": {
       "en": "Is the layout DRC clean now?",
       "ko": "이제 레이아웃이 DRC clean 인가요?"
      },
      "a": {
       "en": "Yes, all errors are fixed. There are zero violations.",
       "ko": "네, 모든 에러를 고쳤어요. 위반이 0개입니다."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 의사소통 표현",
    "questions": [
     {
      "prompt": "\"You need to make the line wider.\"의 뜻은?",
      "opts": [
       "선을 더 넓혀야 한다",
       "선을 더 좁혀야 한다",
       "선을 지워야 한다"
      ],
      "ans": 0
     },
     {
      "prompt": "\"There are zero violations.\"의 뜻은?",
      "opts": [
       "위반이 많다",
       "위반이 없다",
       "검사 중이다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "Design Rule 은 패턴이 지켜야 하는 최소·최대 치수 약속이고, DRC 로 위반을 자동 검사한다.",
     "핵심 규칙 단어 6개: width(폭), spacing(간격), overlap(겹침), enclosure(감쌈), minimum(최소), maximum(최대).",
     "규칙 문장 패턴 \"must be at least/at most … um\" 과 에러 로그 \"below minimum / exceeds maximum\" 만 읽으면 어디를 고칠지 알 수 있다."
    ],
    "done": "**10주 완료 ✓** — Design Rule 영어 문장과 DRC 에러를 읽고 고칠 수 있다."
   }
  ]
 },
 {
  "id": "w11",
  "title": "11주 · 패턴 배치",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "레이아웃 방에서 생긴 일",
    "text": "신입 엔지니어 지수는 오늘 처음으로 **디자인 툴(design tool)**로 패턴을 그린다. 사각형 하나를 놓고 **선폭(width)**과 **간격(spacing)**을 대충 맞췄더니, 화면에 빨간 표시가 떴다. 옆자리 외국인 선배가 말한다. \"You have a **DRC violation**. The spacing is too small.\" 지수는 슬라이더를 조금씩 움직여 간격을 넓혔고, 빨간 표시가 사라졌다. 규칙(rule)을 지키면 초록, 어기면 빨강. 오늘은 **패턴 배치와 Design Rule** 이야기다."
   },
   {
    "type": "read",
    "title": "패턴 배치란 무엇인가",
    "intro": "레이아웃(layout)은 칩 위에 그릴 도면이다.",
    "paras": [
     "반도체 칩은 여러 층(layer)으로 만들어진다. 각 층에는 금속선, 절연막, 배선 같은 패턴(pattern)이 그려진다. 우리는 디자인 툴에서 먼저 어떤 층(layer)에 그릴지 고르고, 사각형(rectangle) 같은 도형을 배치해서 회로 모양을 만든다.",
     "패턴을 그릴 때 두 가지 값이 가장 중요하다. 하나는 선폭(width) 즉 선이 얼마나 두꺼운가이고, 다른 하나는 간격(spacing) 즉 선과 선 사이가 얼마나 떨어져 있는가이다. 이 값들이 공정에서 만들 수 있는 최소 크기보다 작으면 칩이 제대로 만들어지지 않는다.",
     "그래서 회사마다 최소 선폭, 최소 간격 같은 규칙을 정해 둔다. 이 규칙을 Design Rule(디자인 규칙)이라 부르고, 도면이 규칙을 지키는지 자동으로 검사하는 것을 DRC(Design Rule Check)라 한다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "items": [
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사"
     },
     {
      "ab": "CAD",
      "full": "Computer-Aided Design",
      "ko": "컴퓨터 지원 설계"
     },
     {
      "ab": "GDS",
      "full": "Graphic Data System",
      "ko": "레이아웃 도면 파일 형식"
     },
     {
      "ab": "µm",
      "full": "micrometer",
      "ko": "마이크로미터(0.001mm)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어",
    "intro": "패턴 배치에서 자주 쓰는 영어 단어다.",
    "items": [
     {
      "en": "Layer",
      "ko": "레이어(층)",
      "d": "패턴을 그리는 하나의 층.",
      "ex": "Select the metal layer first."
     },
     {
      "en": "Pattern",
      "ko": "패턴",
      "d": "층 위에 그린 도형 모양.",
      "ex": "This pattern has a DRC error."
     },
     {
      "en": "Width",
      "ko": "선폭",
      "d": "선이나 도형의 두께.",
      "ex": "The line width is too small."
     },
     {
      "en": "Spacing",
      "ko": "간격",
      "d": "패턴과 패턴 사이 거리.",
      "ex": "Increase the spacing between the lines."
     },
     {
      "en": "Rectangle",
      "ko": "사각형",
      "d": "레이아웃에서 가장 기본 도형.",
      "ex": "Draw a rectangle on this layer."
     },
     {
      "en": "Violation",
      "ko": "위반(오류)",
      "d": "규칙을 어긴 상태.",
      "ex": "The tool found two violations."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 퀴즈 (1)",
    "intro": "방금 배운 단어를 확인해 보자.",
    "questions": [
     {
      "prompt": "“Spacing”의 뜻은?",
      "opts": [
       "선폭",
       "간격",
       "층"
      ],
      "ans": 1
     },
     {
      "prompt": "“Width”의 뜻은?",
      "opts": [
       "선폭",
       "사각형",
       "위반"
      ],
      "ans": 0
     },
     {
      "prompt": "규칙을 어긴 상태를 뜻하는 단어는?",
      "opts": [
       "Layer",
       "Pattern",
       "Violation"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "read",
    "title": "정상 패턴 vs 오류 패턴",
    "intro": "규칙을 지킨 것과 어긴 것은 무엇이 다른가.",
    "paras": [
     "정상(pass) 패턴은 선폭이 최소값 이상이고, 간격도 최소값 이상이다. 툴은 이런 패턴을 초록색이나 통과 표시로 보여준다.",
     "오류(violation) 패턴은 선폭이 너무 얇거나, 간격이 너무 좁은 경우다. 예를 들어 최소 간격이 0.20µm인데 실제 간격이 0.10µm이면 spacing violation이 뜬다. 툴은 이 부분을 빨간색으로 강조한다.",
     "현장에서는 슬라이더나 숫자를 조금씩 바꿔 가며 빨간 표시가 사라질 때까지 조정한다. 이렇게 규칙에 맞게 고치는 일을 fix 또는 clean up 이라고 한다."
    ]
   },
   {
    "type": "glossary",
    "title": "용어 (심화)",
    "intro": "검사 결과를 읽을 때 쓰는 표현이다.",
    "items": [
     {
      "en": "Design Rule",
      "ko": "디자인 규칙",
      "d": "만들 수 있는 최소 크기 규칙.",
      "ex": "Check the design rule for spacing."
     },
     {
      "en": "Minimum",
      "ko": "최소값",
      "d": "허용되는 가장 작은 값.",
      "ex": "The minimum width is 0.15 micrometers."
     },
     {
      "en": "Pass",
      "ko": "통과",
      "d": "규칙을 만족한 상태.",
      "ex": "All patterns pass the DRC."
     },
     {
      "en": "Error / Violation",
      "ko": "오류/위반",
      "d": "규칙을 어긴 결과.",
      "ex": "The report shows one spacing error."
     },
     {
      "en": "Highlight",
      "ko": "강조 표시",
      "d": "문제 부분을 색으로 보여줌.",
      "ex": "The tool highlights the error in red."
     },
     {
      "en": "Fix",
      "ko": "수정하다",
      "d": "오류를 고치는 것.",
      "ex": "Fix the violation and run DRC again."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 퀴즈 (2)",
    "questions": [
     {
      "prompt": "“Minimum width”의 뜻은?",
      "opts": [
       "최대 간격",
       "최소 선폭",
       "평균 두께"
      ],
      "ans": 1
     },
     {
      "prompt": "DRC를 다시 실행할 때 쓰는 표현은?",
      "opts": [
       "run DRC again",
       "close the tool",
       "print the chip"
      ],
      "ans": 0
     },
     {
      "prompt": "모든 패턴이 규칙을 만족하면?",
      "opts": [
       "Violation",
       "Pass",
       "Error"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 읽기",
    "mtitle": "MANUAL · Design Rule Check",
    "paras": [
     "**Step 1.** Select the layer before drawing any pattern.",
     "**Step 2.** Draw a rectangle and set the **width** and **spacing** values.",
     "**Step 3.** The minimum spacing is **0.20 µm**. The minimum width is **0.15 µm**.",
     "**Step 4.** Run the **DRC**. Red marks show **violations**.",
     "**Step 5.** Adjust the values until all patterns **pass**, then save the layout."
    ]
   },
   {
    "type": "quiz",
    "title": "매뉴얼 해석 퀴즈",
    "intro": "위 매뉴얼을 다시 보고 답해 보자.",
    "questions": [
     {
      "prompt": "매뉴얼에서 최소 간격(minimum spacing)은?",
      "opts": [
       "0.15 µm",
       "0.20 µm",
       "2.0 µm"
      ],
      "ans": 1
     },
     {
      "prompt": "“Red marks show violations.”의 뜻은?",
      "opts": [
       "빨간 표시는 위반을 나타낸다",
       "빨간 표시는 통과를 뜻한다",
       "빨간 표시는 저장 완료다"
      ],
      "ans": 0
     },
     {
      "prompt": "패턴을 그리기 전에 가장 먼저 할 일은?",
      "opts": [
       "DRC 실행",
       "레이어 선택",
       "레이아웃 저장"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "read",
    "title": "슬라이더로 값 조절하기",
    "intro": "실습 전에 조작 방법을 익히자.",
    "paras": [
     "디자인 툴에서는 숫자를 직접 입력하기도 하지만, 실습에서는 슬라이더(slider)를 좌우로 움직여 선폭과 간격을 바꾼다. 슬라이더를 오른쪽으로 밀면 값이 커지고, 왼쪽으로 밀면 값이 작아진다.",
     "값을 최소값(minimum) 아래로 내리면 툴이 곧바로 빨간 위반 표시를 보여준다. 다시 최소값 이상으로 올리면 초록 통과로 바뀐다. 이렇게 실시간으로 변하는 결과를 보며 규칙의 의미를 몸으로 익힐 수 있다."
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 웨이퍼 단면 레이어 살펴보기",
    "which": "layer",
    "intro": "패턴은 여러 층(layer) 위에 그려진다. 웨이퍼 단면 그림에서 각 층의 영어 이름을 클릭해 확인하고, 어느 층에 패턴을 그릴지 감을 잡아 보자."
   },
   {
    "type": "sim",
    "title": "실습 — DRC 슬라이더로 정상/위반 비교",
    "which": "drc",
    "intro": "핵심 실습이다. 슬라이더로 선폭(width)과 간격(spacing)을 조절해 보자. 값을 최소값보다 작게 하면 빨간 위반(violation) 표시가 뜨고, 최소값 이상으로 넓히면 초록 통과(pass)로 바뀐다. 정상 패턴과 오류 패턴이 어떻게 다른지 직접 비교해 보라."
   },
   {
    "type": "read",
    "title": "DRC 결과 로그 읽기",
    "intro": "검사가 끝나면 영어 결과 메시지가 나온다.",
    "paras": [
     "DRC를 실행하면 결과 창에 짧은 영어 메시지가 뜬다. 예: \"DRC finished. 2 violations found.\" 이는 검사가 끝났고 위반이 2개 발견됐다는 뜻이다.",
     "각 위반에는 종류가 붙는다. \"Spacing violation: 0.10 µm (min 0.20 µm)\"는 간격이 0.10인데 최소는 0.20이라 부족하다는 뜻이다. \"Width violation\"이면 선폭이 부족한 것이다.",
     "모두 고치면 \"0 violations found. DRC clean.\"이 뜬다. clean은 오류가 하나도 없다는 실무 표현이다."
    ]
   },
   {
    "type": "quiz",
    "title": "로그 해석 퀴즈",
    "questions": [
     {
      "prompt": "“2 violations found.”의 뜻은?",
      "opts": [
       "위반 2개 발견",
       "패턴 2개 저장",
       "레이어 2개 추가"
      ],
      "ans": 0
     },
     {
      "prompt": "“DRC clean.”이 뜻하는 것은?",
      "opts": [
       "오류가 하나도 없음",
       "툴이 꺼짐",
       "간격이 0"
      ],
      "ans": 0
     },
     {
      "prompt": "“Spacing violation: 0.10 µm (min 0.20 µm)”은 무슨 문제인가?",
      "opts": [
       "간격이 최소보다 좁다",
       "선폭이 최대보다 크다",
       "레이어가 없다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "내 패턴에 빨간 표시가 떠서 선배에게 원인을 묻는다.",
      "q": {
       "en": "Why does this pattern have a DRC violation?",
       "ko": "이 패턴에 왜 DRC 위반이 떴나요?"
      },
      "a": {
       "en": "The spacing is too small. Increase it above 0.20 micrometers.",
       "ko": "간격이 너무 좁아요. 0.20µm 이상으로 넓히세요."
      }
     },
     {
      "sit": "값을 고친 뒤 다시 검사해도 되는지 확인한다.",
      "q": {
       "en": "I fixed the width. Should I run the DRC again?",
       "ko": "선폭을 고쳤어요. DRC를 다시 실행할까요?"
      },
      "a": {
       "en": "Yes, run it again and check if it is clean.",
       "ko": "네, 다시 실행해서 오류가 없는지 확인하세요."
      }
     },
     {
      "sit": "어느 레이어에 그려야 하는지 묻는다.",
      "q": {
       "en": "Which layer should I draw this pattern on?",
       "ko": "이 패턴을 어느 레이어에 그려야 하나요?"
      },
      "a": {
       "en": "Use the metal layer. Select it before you start.",
       "ko": "메탈 레이어를 쓰세요. 시작 전에 선택하세요."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "의사소통 표현 퀴즈",
    "questions": [
     {
      "prompt": "“Increase the spacing.”의 뜻은?",
      "opts": [
       "간격을 넓혀라",
       "간격을 좁혀라",
       "선폭을 지워라"
      ],
      "ans": 0
     },
     {
      "prompt": "“Which layer should I draw this on?”은 무엇을 묻는가?",
      "opts": [
       "어느 레이어에 그리나요",
       "언제 저장하나요",
       "누가 검사하나요"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "패턴 배치는 레이어(layer)를 먼저 고르고 사각형을 놓는 것으로 시작한다.",
     "선폭(width)과 간격(spacing)이 최소값 이상이어야 규칙을 통과(pass)한다.",
     "DRC(Design Rule Check)는 위반(violation)을 빨간색으로 알려주고, 슬라이더로 값을 조절해 clean 상태로 만든다."
    ],
    "done": "**11주 완료 ✓** — 규칙을 지키면 초록, 어기면 빨강. 슬라이더로 정상/위반을 직접 비교했다."
   }
  ]
 },
 {
  "id": "w12",
  "title": "12주 · DRC 오류",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "밤샘 마감, 빨간 오류 3,000개",
    "text": "레이아웃 설계가 끝나고 마스크 제작으로 넘기기 직전, 자동 검사 프로그램을 돌리자 화면이 온통 빨갛게 물들었다. **DRC(Design Rule Check)** 로그에는 영어로 된 오류 메시지가 3,000줄. 팀장이 다가와 묻는다. \"**minimum width** violation 이 몇 개고, 어디서 났는지 정리해줄래?\" 오류 메시지를 못 읽으면 어디를 고쳐야 할지도 알 수 없다. 오늘은 이 **영문 DRC 로그를 읽고 오류 위치와 수정 방향**을 찾는 법을 배운다."
   },
   {
    "type": "read",
    "title": "DRC 가 뭐예요?",
    "intro": "반도체 설계의 마지막 관문",
    "paras": [
     "DRC 는 Design Rule Check, 즉 **디자인 규칙 검사**다. 반도체 회로를 그림(레이아웃)으로 그린 뒤, 그 그림이 공장에서 실제로 만들 수 있는 규칙을 지켰는지 컴퓨터가 자동으로 검사하는 과정이다.",
     "공장마다 '선은 최소 이만큼 굵어야 한다', '두 선 사이는 최소 이만큼 떨어져야 한다' 같은 규칙(rule)이 정해져 있다. 이 규칙을 어기면 실제로 칩을 만들 때 선이 끊기거나 서로 붙어 합선이 난다.",
     "규칙을 어긴 부분을 **violation(위반)** 이라고 부르고, DRC 프로그램은 위반이 난 위치와 종류를 영어 로그로 뽑아준다. 실무자는 이 로그를 읽고 어디를, 어떻게 고칠지 판단해야 한다."
    ]
   },
   {
    "type": "read",
    "title": "대표적인 4가지 오류 종류",
    "paras": [
     "**Minimum width (최소 선폭)**: 선이나 도형이 규칙보다 얇을 때 난다. 너무 얇으면 실제 제작 시 끊어질 위험이 있다. 수정은 도형을 규칙 이상으로 넓혀준다.",
     "**Insufficient spacing (간격 부족)**: 두 도형 사이 간격이 규칙보다 좁을 때 난다. 너무 붙어 있으면 합선(short)이 날 수 있다. 수정은 도형을 서로 더 벌린다.",
     "**Enclosure error (덮임 부족)**: 아래층 도형(예: contact)을 위층 금속이 규칙만큼 충분히 덮지 못할 때 난다. 덮임이 부족하면 층 연결이 불안정하다. 수정은 위층 도형을 더 크게 키워 감싸준다.",
     "이 세 가지가 현장 DRC 로그에서 가장 자주 보이는 오류다. 로그에는 오류 종류와 함께 좌표(coordinate)와 규칙 값(required value)이 같이 나온다."
    ]
   },
   {
    "type": "acr",
    "title": "약어 정리",
    "items": [
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사"
     },
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃-회로도 비교 검사"
     },
     {
      "ab": "GDS",
      "full": "Graphic Data System",
      "ko": "레이아웃 도면 파일 형식"
     },
     {
      "ab": "min",
      "full": "Minimum",
      "ko": "최소"
     },
     {
      "ab": "coord",
      "full": "Coordinate",
      "ko": "좌표"
     },
     {
      "ab": "µm",
      "full": "Micrometer",
      "ko": "마이크로미터(백만분의 1미터)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1)",
    "intro": "DRC 로그에 자주 나오는 단어",
    "items": [
     {
      "en": "Violation",
      "ko": "위반",
      "d": "디자인 규칙을 어긴 오류 하나.",
      "ex": "The DRC report shows 12 violations."
     },
     {
      "en": "Design rule",
      "ko": "디자인 규칙",
      "d": "공장이 정한 제작 규칙.",
      "ex": "This layer must follow the design rule."
     },
     {
      "en": "Minimum width",
      "ko": "최소 선폭",
      "d": "선/도형이 가져야 할 최소 굵기.",
      "ex": "The metal line is below the minimum width."
     },
     {
      "en": "Spacing",
      "ko": "간격",
      "d": "두 도형 사이의 거리.",
      "ex": "The spacing between two lines is too small."
     },
     {
      "en": "Enclosure",
      "ko": "덮임",
      "d": "위층이 아래층을 감싸는 정도.",
      "ex": "The metal must have enough enclosure over the contact."
     },
     {
      "en": "Coordinate",
      "ko": "좌표",
      "d": "오류가 난 위치 (x, y).",
      "ex": "The violation is at coordinate (120, 340)."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 (1)",
    "questions": [
     {
      "prompt": "“Violation”의 뜻은?",
      "opts": [
       "위반(규칙 오류)",
       "간격",
       "덮임"
      ],
      "ans": 0
     },
     {
      "prompt": "“Minimum width”의 뜻은?",
      "opts": [
       "최대 간격",
       "최소 선폭",
       "좌표"
      ],
      "ans": 1
     },
     {
      "prompt": "“Coordinate”가 로그에서 알려주는 것은?",
      "opts": [
       "오류 종류",
       "오류가 난 위치",
       "규칙 이름"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2)",
    "intro": "오류 해석·수정에 쓰는 단어",
    "items": [
     {
      "en": "Insufficient",
      "ko": "부족한",
      "d": "필요한 값에 못 미침.",
      "ex": "The spacing is insufficient here."
     },
     {
      "en": "Short",
      "ko": "합선",
      "d": "떨어져야 할 두 선이 붙어 전기가 새는 것.",
      "ex": "Small spacing can cause a short."
     },
     {
      "en": "Required value",
      "ko": "요구 값",
      "d": "규칙이 정한 최소 수치.",
      "ex": "The required value is 0.10 µm."
     },
     {
      "en": "Fix",
      "ko": "수정하다",
      "d": "오류를 고치는 것.",
      "ex": "Please fix the width violation."
     },
     {
      "en": "Layer",
      "ko": "층(레이어)",
      "d": "레이아웃의 각 재료 층.",
      "ex": "This violation is on the metal 1 layer."
     },
     {
      "en": "Clean",
      "ko": "오류 없음",
      "d": "위반이 하나도 없는 상태.",
      "ex": "The layout is DRC clean now."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 (2)",
    "questions": [
     {
      "prompt": "“Insufficient spacing”의 뜻은?",
      "opts": [
       "간격 부족",
       "선폭 초과",
       "층 오류"
      ],
      "ans": 0
     },
     {
      "prompt": "간격이 너무 좁으면 생길 수 있는 문제는?",
      "opts": [
       "합선(short)",
       "덮임 증가",
       "선폭 증가"
      ],
      "ans": 0
     },
     {
      "prompt": "“DRC clean”의 뜻은?",
      "opts": [
       "오류가 하나도 없음",
       "오류가 많음",
       "검사 안 함"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 — DRC 실행 절차",
    "mtitle": "MANUAL · Running a DRC Check",
    "paras": [
     "1. Load the layout (GDS) file into the DRC tool.",
     "2. Select the correct **rule deck** for this process.",
     "3. Click **Run** to start the check.",
     "4. Open the **violation report** when the run is finished.",
     "5. Each line shows the **rule name**, the **layer**, and the **coordinate**.",
     "6. Fix every violation, then run the check again until the layout is **DRC clean**."
    ]
   },
   {
    "type": "quiz",
    "title": "매뉴얼 해석 확인",
    "intro": "위 영어 절차를 읽고 답하세요.",
    "questions": [
     {
      "prompt": "“Select the correct rule deck” 는 무슨 뜻?",
      "opts": [
       "올바른 규칙 세트를 고른다",
       "장비 전원을 끈다",
       "파일을 삭제한다"
      ],
      "ans": 0
     },
     {
      "prompt": "검사가 끝난 뒤 무엇을 열어야 하나?",
      "opts": [
       "violation report(위반 보고서)",
       "온도 그래프",
       "출하 라벨"
      ],
      "ans": 0
     },
     {
      "prompt": "언제까지 오류를 고치고 재검사하나?",
      "opts": [
       "DRC clean 될 때까지",
       "1번만 하면 끝",
       "합선이 날 때까지"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 웨이퍼 단면 층 확인",
    "which": "layer",
    "intro": "DRC 오류는 각 층(layer)에서 난다. 웨이퍼 단면 그림에서 metal, contact 등 층 이름을 클릭해 어느 층에서 enclosure, spacing 오류가 생기는지 감을 잡아보세요."
   },
   {
    "type": "read",
    "title": "영문 DRC 로그, 이렇게 읽는다",
    "intro": "로그 한 줄에는 정보가 다 들어있다",
    "paras": [
     "예시 로그: **ERROR: Metal1 minimum width violation at (120, 340). Required 0.10 µm, found 0.07 µm.**",
     "해석: metal1 층에서 최소 선폭 위반이 (120, 340) 위치에서 발생. 규칙은 0.10µm 인데 실제는 0.07µm 밖에 안 된다. → 수정 방향: 그 선을 0.10µm 이상으로 넓힌다.",
     "또 다른 예: **ERROR: Metal2 spacing violation at (55, 210). Required 0.12 µm, found 0.08 µm.** → metal2 두 도형 간격이 좁다. 수정: 도형을 서로 더 벌린다.",
     "핵심은 세 가지를 찾는 것: (1) 오류 종류(width/spacing/enclosure), (2) 위치(coordinate), (3) 규칙 값과 실제 값의 차이. 이 세 가지를 알면 수정 방향이 자동으로 나온다."
    ]
   },
   {
    "type": "quiz",
    "title": "로그 해석 확인",
    "intro": "로그: ERROR: Metal1 minimum width violation at (120, 340). Required 0.10 µm, found 0.07 µm.",
    "questions": [
     {
      "prompt": "이 오류의 종류는?",
      "opts": [
       "최소 선폭 위반",
       "간격 부족",
       "덮임 부족"
      ],
      "ans": 0
     },
     {
      "prompt": "오류가 난 위치는?",
      "opts": [
       "(0, 0)",
       "(120, 340)",
       "(0.10, 0.07)"
      ],
      "ans": 1
     },
     {
      "prompt": "올바른 수정 방향은?",
      "opts": [
       "선을 0.10 µm 이상으로 넓힌다",
       "선을 더 얇게 만든다",
       "선을 삭제한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — DRC 오류 찾고 수정하기",
    "which": "drc",
    "intro": "가상 레이아웃에서 DRC 를 실행하세요. 영문 violation 로그를 읽고 minimum width, insufficient spacing, enclosure error 를 하나씩 클릭해 오류 위치를 찾은 뒤, 규칙 값에 맞게 도형을 수정해 'DRC clean' 을 만들어 보세요."
   },
   {
    "type": "quiz",
    "title": "수정 방향 판단",
    "questions": [
     {
      "prompt": "Enclosure error 의 올바른 수정 방향은?",
      "opts": [
       "위층 금속을 더 크게 키워 아래층을 덮는다",
       "아래층을 삭제한다",
       "간격을 좁힌다"
      ],
      "ans": 0
     },
     {
      "prompt": "Insufficient spacing 은 어떻게 고치나?",
      "opts": [
       "두 도형을 더 벌린다",
       "두 도형을 붙인다",
       "선을 얇게 한다"
      ],
      "ans": 0
     },
     {
      "prompt": "모든 오류를 고친 뒤 마지막에 할 일은?",
      "opts": [
       "DRC 를 다시 실행해 clean 확인",
       "바로 출하",
       "로그를 삭제"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "DRC 로그를 받았는데 오류 종류가 무엇인지 물어볼 때",
      "q": {
       "en": "What type of violation is this?",
       "ko": "이건 어떤 종류의 위반인가요?"
      },
      "a": {
       "en": "It is a minimum width violation on metal 1.",
       "ko": "metal 1 층의 최소 선폭 위반입니다."
      }
     },
     {
      "sit": "오류 위치를 확인하고 싶을 때",
      "q": {
       "en": "Where is the violation located?",
       "ko": "위반은 어디에 있나요?"
      },
      "a": {
       "en": "It is at coordinate (120, 340).",
       "ko": "좌표 (120, 340) 에 있습니다."
      }
     },
     {
      "sit": "수정 방향을 확인하고 싶을 때",
      "q": {
       "en": "How should I fix the spacing error?",
       "ko": "간격 오류는 어떻게 고쳐야 하나요?"
      },
      "a": {
       "en": "Move the two lines apart to meet the required value.",
       "ko": "규칙 값을 맞추도록 두 선을 서로 벌리세요."
      }
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 — 보고 문장",
    "mtitle": "MANUAL · Reporting DRC Results",
    "paras": [
     "The layout has **3 violations** in total.",
     "There are 2 minimum width errors and 1 spacing error.",
     "All violations are on the **metal 1 layer**.",
     "I fixed the errors and the layout is now **DRC clean**."
    ]
   },
   {
    "type": "quiz",
    "title": "보고 문장 확인",
    "questions": [
     {
      "prompt": "“The layout is now DRC clean” 의 뜻은?",
      "opts": [
       "이제 오류가 하나도 없다",
       "오류가 3개 있다",
       "검사를 아직 안 했다"
      ],
      "ans": 0
     },
     {
      "prompt": "“There are 2 minimum width errors” 는?",
      "opts": [
       "최소 선폭 오류 2개가 있다",
       "간격 오류 2개가 있다",
       "덮임 오류 2개가 있다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "DRC(Design Rule Check)는 레이아웃이 제작 규칙을 지켰는지 검사하는 마지막 관문이다.",
     "대표 오류 3종: minimum width(선폭 부족), insufficient spacing(간격 부족), enclosure error(덮임 부족).",
     "영문 로그에서 오류 종류·위치(coordinate)·규칙 값을 읽으면 수정 방향이 나온다. 다 고치면 'DRC clean'."
    ],
    "done": "**12주 완료 ✓** — 영문 DRC violation 로그를 읽고 오류를 찾아 수정할 수 있다."
   }
  ]
 },
 {
  "id": "w13",
  "title": "13주 · LVS 검증",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "레이아웃이 회로도와 다르다?",
    "text": "설계팀이 완성한 칩 레이아웃을 파운드리로 넘기기 전, 검증 엔지니어 지훈은 마지막 관문인 **LVS** 검사를 돌린다. 화면에 빨간 글씨로 **mismatch**가 뜬다. 회로도(schematic)에는 있어야 할 트랜지스터 하나가 레이아웃에서 사라졌다는 뜻이다. 외국인 리드 엔지니어가 다가와 묻는다. \"**Missing device** or **wrong connection**?\" 지훈은 로그를 열어 어떤 **net**이 잘못 연결됐는지 하나씩 짚어야 한다. 레이아웃이 회로도와 **정확히 일치**해야만 칩이 설계대로 동작한다."
   },
   {
    "type": "read",
    "title": "LVS란 무엇인가",
    "intro": "이번 주 핵심 개념을 먼저 잡자.",
    "paras": [
     "LVS는 Layout Versus Schematic, 즉 '레이아웃 대 회로도 비교' 검사다. 우리가 그린 레이아웃(layout)이 원래 설계한 회로도(schematic)와 소자와 연결까지 똑같은지 자동으로 대조하는 과정이다.",
     "지난 주에 배운 DRC(Design Rule Check)가 '규칙을 지켰는가'를 본다면, LVS는 '설계 의도대로 연결됐는가'를 본다. DRC를 통과해도 트랜지스터가 엉뚱한 net에 붙어 있으면 칩은 오작동한다. 그래서 두 검사는 짝을 이룬다.",
     "LVS 도구는 레이아웃에서 소자(device)와 배선(net)을 추출해 회로도와 하나씩 맞춘다. 완벽히 같으면 'MATCH', 다르면 'MISMATCH'로 결과를 낸다. 실무에서는 mismatch가 뜬 위치를 로그에서 찾아 원인을 판단하는 일이 대부분이다."
    ]
   },
   {
    "type": "read",
    "title": "대표적인 비교 오류 3가지",
    "paras": [
     "첫째, missing device(누락 소자). 회로도에는 있는데 레이아웃에는 그려지지 않은 소자다. 트랜지스터나 저항 하나를 빼먹으면 이 오류가 뜬다.",
     "둘째, incorrect connection(잘못된 연결). 소자는 다 있는데 배선이 엉뚱한 net에 붙은 경우다. 예를 들어 게이트가 VDD 대신 GND에 연결되면 회로 동작이 완전히 달라진다.",
     "셋째, extra device / short(추가 소자·단락). 회로도에 없는 소자가 더 있거나, 서로 다른 net이 붙어버린 단락(short)이다. 실무 로그에서는 이 세 가지가 가장 자주 보인다."
    ]
   },
   {
    "type": "acr",
    "title": "약어 정리",
    "items": [
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃 대 회로도 비교 검사"
     },
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사"
     },
     {
      "ab": "GDS",
      "full": "Graphic Data System",
      "ko": "레이아웃 도면 파일 형식"
     },
     {
      "ab": "VDD",
      "full": "Voltage Drain Drain",
      "ko": "전원 전압(플러스 전원)"
     },
     {
      "ab": "GND",
      "full": "Ground",
      "ko": "접지(0V 기준)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어",
    "intro": "LVS 로그에서 매일 보는 단어들이다.",
    "items": [
     {
      "en": "Layout",
      "ko": "레이아웃",
      "d": "칩을 실제로 그린 물리적 도면.",
      "ex": "Please check the layout again."
     },
     {
      "en": "Schematic",
      "ko": "회로도",
      "d": "소자와 연결을 나타낸 설계 원본.",
      "ex": "The schematic shows two transistors."
     },
     {
      "en": "Mismatch",
      "ko": "불일치",
      "d": "레이아웃과 회로도가 다른 상태.",
      "ex": "LVS reported a mismatch."
     },
     {
      "en": "Missing device",
      "ko": "누락 소자",
      "d": "회로도엔 있으나 레이아웃에 없는 소자.",
      "ex": "There is a missing device in the layout."
     },
     {
      "en": "Incorrect connection",
      "ko": "잘못된 연결",
      "d": "배선이 틀린 net에 붙은 상태.",
      "ex": "This is an incorrect connection."
     },
     {
      "en": "Net",
      "ko": "네트",
      "d": "서로 연결된 배선 하나의 이름.",
      "ex": "Net VDD is not connected."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 1",
    "questions": [
     {
      "prompt": "\"Layout\"의 뜻은?",
      "opts": [
       "회로도",
       "레이아웃(물리 도면)",
       "네트"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Schematic\"의 뜻은?",
      "opts": [
       "회로도(설계 원본)",
       "레이아웃",
       "불일치"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Mismatch\"의 뜻은?",
      "opts": [
       "일치",
       "불일치",
       "연결"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 2",
    "questions": [
     {
      "prompt": "\"Missing device\"는 무엇을 뜻하나?",
      "opts": [
       "소자가 더 있음",
       "회로도엔 있는데 레이아웃에 없는 소자",
       "배선이 짧음"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Net\"의 뜻은?",
      "opts": [
       "소자 이름",
       "서로 연결된 배선 하나",
       "칩 크기"
      ],
      "ans": 1
     },
     {
      "prompt": "게이트가 VDD 대신 GND에 붙었다면 이것은?",
      "opts": [
       "missing device",
       "incorrect connection",
       "match"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "로그에 자주 쓰는 표현",
    "intro": "LVS 결과 화면에서 반복되는 단어들이다.",
    "items": [
     {
      "en": "Match",
      "ko": "일치",
      "d": "레이아웃과 회로도가 같음.",
      "ex": "The result is a clean match."
     },
     {
      "en": "Short",
      "ko": "단락",
      "d": "떨어져야 할 두 net이 붙음.",
      "ex": "There is a short between VDD and GND."
     },
     {
      "en": "Open",
      "ko": "단선",
      "d": "이어져야 할 배선이 끊김.",
      "ex": "This net has an open."
     },
     {
      "en": "Extra device",
      "ko": "추가 소자",
      "d": "회로도에 없는 소자가 더 있음.",
      "ex": "LVS found an extra device."
     },
     {
      "en": "Netlist",
      "ko": "넷리스트",
      "d": "소자와 연결을 적은 목록.",
      "ex": "Load the schematic netlist first."
     },
     {
      "en": "Extract",
      "ko": "추출",
      "d": "레이아웃에서 소자·net을 뽑아냄.",
      "ex": "The tool extracts the layout."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "용어 확인 3",
    "questions": [
     {
      "prompt": "\"Short\"의 뜻은?",
      "opts": [
       "단선",
       "단락(붙음)",
       "일치"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Open\"의 뜻은?",
      "opts": [
       "단선(끊김)",
       "추가 소자",
       "추출"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Extra device\"의 뜻은?",
      "opts": [
       "누락 소자",
       "회로도에 없는 소자가 더 있음",
       "일치"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "read",
    "title": "왜 LVS가 중요한가",
    "paras": [
     "레이아웃이 회로도와 조금만 달라도 칩은 설계자가 의도한 대로 동작하지 않는다. 트랜지스터 하나가 빠지거나 배선 하나가 엉뚱하게 붙으면, 완성된 칩은 그대로 불량이 된다.",
     "웨이퍼 한 장을 만드는 데는 수많은 공정과 큰 비용이 든다. 그래서 파운드리로 넘기기 전 LVS로 '설계 원본과 100% 같은가'를 반드시 확인한다. LVS 통과는 양산으로 가는 마지막 승인 도장과 같다.",
     "검증 엔지니어의 일은 오류를 없애는 것이 아니라, 오류의 위치와 유형을 정확히 찾아 설계팀에 전달하는 것이다. missing device인지 incorrect connection인지 구분하는 능력이 실무의 핵심이다."
    ]
   },
   {
    "type": "manual",
    "title": "영문 매뉴얼 — LVS 실행",
    "mtitle": "MANUAL · Running LVS Check",
    "paras": [
     "Step 1. Load the **layout** (GDS) and the **schematic** netlist.",
     "Step 2. Run the LVS engine. It extracts devices and **nets** from the layout.",
     "Step 3. The tool compares them with the schematic and reports **MATCH** or **MISMATCH**.",
     "Step 4. If a **mismatch** is found, open the error log. Check for a **missing device** or an **incorrect connection**.",
     "Step 5. Fix the layout and run LVS again until the result is **MATCH**."
    ]
   },
   {
    "type": "quiz",
    "title": "매뉴얼 해석 확인",
    "intro": "위 매뉴얼을 읽고 답하라.",
    "questions": [
     {
      "prompt": "LVS 엔진이 layout에서 추출하는 것은?",
      "opts": [
       "색깔과 온도",
       "devices와 nets(소자와 배선)",
       "가격"
      ],
      "ans": 1
     },
     {
      "prompt": "결과가 MISMATCH일 때 가장 먼저 할 일은?",
      "opts": [
       "칩을 출하한다",
       "에러 로그를 연다",
       "장비를 끈다"
      ],
      "ans": 1
     },
     {
      "prompt": "언제까지 LVS를 반복하나?",
      "opts": [
       "MATCH가 나올 때까지",
       "MISMATCH가 나올 때까지",
       "한 번만"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 레이아웃 vs 회로도 그림 보기",
    "which": "lvs",
    "intro": "화면의 왼쪽 레이아웃과 오른쪽 회로도를 나란히 비교하라. 두 그림에서 소자(device)와 net이 서로 어떻게 대응되는지 클릭해서 확인한다."
   },
   {
    "type": "sim",
    "title": "실습 — missing device / incorrect connection 판단",
    "which": "lvs",
    "intro": "LVS 로그에 뜬 오류를 하나씩 열어 보고, 그 오류가 '누락 소자(missing device)'인지 '잘못된 연결(incorrect connection)'인지 판단해 분류하라. 회로도에 있는 소자가 레이아웃에 안 보이면 missing device, 배선이 다른 net에 붙어 있으면 incorrect connection이다."
   },
   {
    "type": "read",
    "title": "LVS 로그 읽는 법",
    "intro": "실무 로그는 짧은 영어 문장으로 원인을 알려준다.",
    "paras": [
     "\"Device M3 missing in layout.\" 는 회로도의 트랜지스터 M3가 레이아웃에 없다는 뜻이다. 즉 missing device 오류다. 설계자가 소자 하나를 배치하지 않았을 때 나온다.",
     "\"Net VDD connected to GND.\" 는 원래 따로여야 할 두 net이 붙었다는 뜻으로, incorrect connection(단락)이다. 배선을 잘못 그렸을 때 나온다.",
     "로그의 마지막 줄에는 보통 'Total mismatches: 2' 처럼 오류 개수가 나온다. 이 숫자가 0이 되어야 검증이 끝난다. 엔지니어는 오류 유형별로 원인을 나눠 설계팀에 전달한다."
    ]
   },
   {
    "type": "quiz",
    "title": "로그 해석 확인",
    "questions": [
     {
      "prompt": "\"Device M3 missing in layout.\" 는 어떤 오류인가?",
      "opts": [
       "missing device",
       "incorrect connection",
       "match"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Net VDD connected to GND.\" 는 어떤 오류인가?",
      "opts": [
       "missing device",
       "incorrect connection(단락)",
       "정상"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Total mismatches: 0\" 이 뜻하는 것은?",
      "opts": [
       "오류가 없다(검증 통과)",
       "오류가 많다",
       "장비 고장"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "리드 엔지니어가 LVS 결과를 묻는다.",
      "q": {
       "en": "What does the LVS log say?",
       "ko": "LVS 로그에 뭐라고 나와요?"
      },
      "a": {
       "en": "There is one missing device, M3, in the layout.",
       "ko": "레이아웃에 소자 M3 하나가 누락됐습니다."
      }
     },
     {
      "sit": "오류 유형을 확인한다.",
      "q": {
       "en": "Is it a missing device or an incorrect connection?",
       "ko": "누락 소자인가요, 잘못된 연결인가요?"
      },
      "a": {
       "en": "It is an incorrect connection. Net VDD is shorted to GND.",
       "ko": "잘못된 연결입니다. VDD가 GND와 단락됐습니다."
      }
     },
     {
      "sit": "재검사 여부를 보고한다.",
      "q": {
       "en": "Did the layout match the schematic after the fix?",
       "ko": "수정 후 레이아웃이 회로도와 일치했나요?"
      },
      "a": {
       "en": "Yes. Total mismatches is zero now.",
       "ko": "네. 이제 불일치가 0입니다."
      }
     }
    ]
   },
   {
    "type": "quiz",
    "title": "종합 확인",
    "questions": [
     {
      "prompt": "LVS가 비교하는 두 대상은?",
      "opts": [
       "layout과 schematic",
       "온도와 압력",
       "가격과 수율"
      ],
      "ans": 0
     },
     {
      "prompt": "DRC와 LVS의 차이로 맞는 것은?",
      "opts": [
       "둘 다 규칙만 본다",
       "DRC는 규칙, LVS는 연결 일치를 본다",
       "차이 없다"
      ],
      "ans": 1
     },
     {
      "prompt": "검증이 끝났다고 볼 수 있는 결과는?",
      "opts": [
       "MISMATCH",
       "MATCH(불일치 0)",
       "빨간 경고"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "LVS는 layout(레이아웃)과 schematic(회로도)이 소자·연결까지 같은지 비교한다.",
     "대표 오류는 mismatch, missing device, incorrect connection이며 net 단위로 원인을 찾는다.",
     "로그 문장을 읽고 오류 유형을 판단해 MATCH(불일치 0)가 될 때까지 수정·재검사한다."
    ],
    "done": "**13주 완료 ✓** — 이제 LVS 로그를 읽고 missing device와 incorrect connection을 구분할 수 있다."
   }
  ]
 },
 {
  "id": "w14",
  "title": "14주 · 종합 현장 보고",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "새벽 3시, 라인이 멈췄다",
    "text": "야간 근무 중 식각 장비 한 대에서 알람이 울렸다. **챔버 압력(chamber pressure)** 이 튀고 **RF 파워(RF power)** 도 흔들린다. 다음 로트의 웨이퍼를 검사하니 식각된 선의 폭이 이상하게 좁아져 **DRC(Design Rule Check)** 에서 width 오류가 잔뜩 떴다. 반장이 말한다. \"장비, 공정, 디자인 정보를 다 모아서 **영문 보고서(English report)** 로 정리해줘. 해외 본사에 올려야 해.\" 오늘은 그동안 배운 걸 전부 합쳐 하나의 사건을 처음부터 끝까지 보고하는 날이다."
   },
   {
    "type": "read",
    "title": "이번 주가 하는 일: 정보를 하나로 연결하기",
    "intro": "지금까지 장비, 알람, 공정, 디자인을 따로따로 배웠다. 현장에서는 이 정보들이 하나의 사슬로 이어진다.",
    "paras": [
     "사건은 보통 이렇게 연결된다. **장비 이상**(압력·RF 흔들림)이 먼저 생기고, 그 결과 **식각 결과가 비정상**(선폭이 좁거나 넓어짐)이 된다. 그러면 디자인 규칙 검사인 **DRC** 에서 width(선폭) 오류가 나온다. 우리는 이 결과에서 거꾸로 거슬러 올라가 **원인(cause)** 을 찾고 **조치(action)** 를 정한다.",
     "이렇게 여러 정보를 모아서 하나의 이야기로 만드는 것을 '종합 분석'이라고 한다. 엔지니어의 핵심 업무다. 단순히 '고장났다'가 아니라, 무엇이 → 무엇을 → 어떻게 만들었는지 순서대로 설명해야 한다.",
     "마지막 결과물은 **영문 보고서**다. 국제 현장에서 통하는 표준 형식은 다섯 칸이다: **Problem**(문제), **Observed**(관찰), **Cause**(원인), **Action**(조치), **Result**(결과). 이번 주에는 이 다섯 칸을 채우는 연습을 한다."
    ]
   },
   {
    "type": "acr",
    "title": "약어 정리",
    "items": [
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사 — 레이아웃이 규칙(선폭·간격)을 지켰는지 확인"
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파 — 플라스마를 만드는 전력"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "가스 유량 조절기"
     },
     {
      "ab": "sccm",
      "full": "standard cubic centimeter per minute",
      "ko": "가스 유량 단위(분당 표준 cc)"
     },
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "사람이 장비를 조작하는 화면"
     }
    ]
   },
   {
    "type": "read",
    "title": "다섯 칸 보고서 형식 이해하기",
    "intro": "Problem / Observed / Cause / Action / Result. 각 칸이 무엇을 담는지 익히자.",
    "paras": [
     "**Problem(문제)**: 무슨 일이 생겼는지 한 줄로. 예: 식각 선폭이 규격보다 좁음. **Observed(관찰)**: 계기판·로그·검사에서 실제로 본 수치. 예: 압력 흔들림, RF 반사파 증가, DRC width 오류 12건.",
     "**Cause(원인)**: 왜 그랬는지. 예: 챔버 압력 불안정으로 플라스마가 약해져 식각량 부족. **Action(조치)**: 무엇을 했는지. 예: MFC 점검, 챔버 클리닝, RF 매칭 재조정.",
     "**Result(결과)**: 조치 후 어떻게 됐는지. 예: 압력 안정, 재측정 시 선폭 정상, DRC 통과. 이 다섯 칸만 채우면 누가 읽어도 사건을 이해할 수 있다."
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 장비·공정",
    "intro": "이번 사건에 나오는 핵심 단어들.",
    "items": [
     {
      "en": "Chamber pressure",
      "ko": "챔버 압력",
      "d": "식각이 일어나는 챔버 안의 압력. 흔들리면 식각이 불안정해진다.",
      "ex": "The chamber pressure was unstable during the run."
     },
     {
      "en": "RF power",
      "ko": "RF 파워",
      "d": "플라스마를 만드는 고주파 전력.",
      "ex": "The RF power dropped for a few seconds."
     },
     {
      "en": "Etch",
      "ko": "식각",
      "d": "필요 없는 층을 깎아내는 공정.",
      "ex": "The etch result was out of spec."
     },
     {
      "en": "Linewidth",
      "ko": "선폭",
      "d": "패턴 선의 폭. 좁거나 넓으면 불량.",
      "ex": "The linewidth was smaller than the target."
     },
     {
      "en": "Out of spec",
      "ko": "규격 이탈",
      "d": "허용 범위를 벗어난 상태.",
      "ex": "Two wafers were out of spec."
     },
     {
      "en": "Root cause",
      "ko": "근본 원인",
      "d": "문제를 일으킨 진짜 원인.",
      "ex": "We found the root cause of the failure."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 용어 확인",
    "questions": [
     {
      "prompt": "\"Chamber pressure\"의 뜻은?",
      "opts": [
       "챔버 압력",
       "챔버 온도",
       "챔버 문"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Out of spec\"의 뜻은?",
      "opts": [
       "규격 이탈",
       "규격 통과",
       "검사 완료"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Root cause\"의 뜻은?",
      "opts": [
       "근본 원인",
       "임시 조치",
       "최종 결과"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Linewidth\"의 뜻은?",
      "opts": [
       "선폭",
       "선 길이",
       "선 색깔"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "용어 — 보고서 다섯 칸",
    "intro": "영문 보고서 제목으로 그대로 쓰는 단어들.",
    "items": [
     {
      "en": "Problem",
      "ko": "문제",
      "d": "무엇이 잘못되었는가 한 줄.",
      "ex": "Problem: etched linewidth is too narrow."
     },
     {
      "en": "Observed",
      "ko": "관찰",
      "d": "실제로 본 수치·현상.",
      "ex": "Observed: pressure spikes and 12 DRC width errors."
     },
     {
      "en": "Cause",
      "ko": "원인",
      "d": "문제가 생긴 이유.",
      "ex": "Cause: unstable chamber pressure weakened the plasma."
     },
     {
      "en": "Action",
      "ko": "조치",
      "d": "해결하려고 한 일.",
      "ex": "Action: cleaned the chamber and re-tuned RF matching."
     },
     {
      "en": "Result",
      "ko": "결과",
      "d": "조치 후 상태.",
      "ex": "Result: pressure stable, DRC passed."
     },
     {
      "en": "Report",
      "ko": "보고서",
      "d": "위 내용을 정리한 문서.",
      "ex": "Please submit the report to headquarters."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 다섯 칸 짝 맞추기",
    "intro": "각 문장이 어느 칸에 들어갈까?",
    "questions": [
     {
      "prompt": "\"We cleaned the chamber and re-tuned the RF.\" 는 어느 칸?",
      "opts": [
       "Action(조치)",
       "Problem(문제)",
       "Result(결과)"
      ],
      "ans": 0
     },
     {
      "prompt": "\"The linewidth is 20% smaller than target.\" 는 어느 칸?",
      "opts": [
       "Problem(문제)",
       "Action(조치)",
       "Cause(원인)"
      ],
      "ans": 0
     },
     {
      "prompt": "\"After the fix, DRC passed with no errors.\" 는 어느 칸?",
      "opts": [
       "Result(결과)",
       "Observed(관찰)",
       "Cause(원인)"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Unstable pressure weakened the plasma.\" 는 어느 칸?",
      "opts": [
       "Cause(원인)",
       "Result(결과)",
       "Problem(문제)"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 — 장비 이상 대응 절차",
    "mtitle": "MANUAL · Etch Tool Abnormal Response",
    "paras": [
     "**Step 1.** If the chamber pressure is unstable, put the tool on **hold** and stop the next lot.",
     "**Step 2.** Check the **RF power** and the reflected power on the HMI screen.",
     "**Step 3.** Inspect the **MFC** gas flow (in sccm) and clean the chamber if needed.",
     "**Step 4.** Run a test wafer and **measure the linewidth**.",
     "**Step 5.** If the etch result is normal and **DRC passes**, release the tool and write a report."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 매뉴얼 해석",
    "questions": [
     {
      "prompt": "압력이 불안정하면 매뉴얼이 처음 하라는 것은?",
      "opts": [
       "장비를 hold하고 다음 로트를 멈춘다",
       "즉시 라인을 재가동한다",
       "보고서부터 쓴다"
      ],
      "ans": 0
     },
     {
      "prompt": "\"measure the linewidth\"는 무엇을 하라는 뜻?",
      "opts": [
       "선폭을 측정하라",
       "압력을 올려라",
       "가스를 잠가라"
      ],
      "ans": 0
     },
     {
      "prompt": "장비를 release(재가동) 하는 조건은?",
      "opts": [
       "식각이 정상이고 DRC를 통과할 때",
       "알람이 울릴 때",
       "RF가 흔들릴 때"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 장비 HMI에서 이상 확인하기",
    "which": "equipment",
    "intro": "가상 장비 화면(HMI)을 열어 챔버 압력과 RF 파워 값을 확인하고, 이상 구간의 로그를 읽어보세요. 어떤 값이 규격을 벗어났는지 찾아 메모합니다. (약어: HMI = Human Machine Interface, 사람이 장비를 조작하는 화면)"
   },
   {
    "type": "sim",
    "title": "실습 — DRC 선폭 오류 확인하기",
    "which": "drc",
    "intro": "디자인 규칙 검사(DRC) 화면에서 식각 결과 레이아웃을 검사하세요. width(선폭) 규칙을 위반한 곳이 빨갛게 표시됩니다. 오류가 몇 건인지, 어느 선이 규격보다 좁은지 확인해 보고서의 Observed 칸에 쓸 수치를 모읍니다."
   },
   {
    "type": "read",
    "title": "로그와 오류를 하나로 연결하기",
    "intro": "장비 로그, 식각 결과, DRC 오류를 한 줄의 원인 사슬로 이어보자.",
    "paras": [
     "장비 로그: 03:12에 chamber pressure spike(압력 튐), 03:12~03:14 RF reflected power 증가. → 식각 결과: 해당 시간에 처리된 웨이퍼의 선폭이 목표보다 좁음(under-etch 아님, 오히려 과식각 또는 부족 — 데이터로 확인). → DRC: width minimum 규칙 위반 12건.",
     "이 세 가지를 이으면 이렇게 말할 수 있다: \"압력이 튀면서 플라스마가 불안정해졌고(원인), 그 시간대 웨이퍼의 선폭이 규격을 벗어나(관찰), DRC에서 width 오류로 잡혔다(문제).\"",
     "보고서를 쓸 때는 이 순서를 거꾸로 뒤집어 Problem부터 적는다. 읽는 사람은 결론을 먼저 보고 싶어 하기 때문이다. 원인 사슬을 알면 다섯 칸을 술술 채울 수 있다."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 원인 사슬 이해",
    "questions": [
     {
      "prompt": "이번 사건에서 가장 먼저 생긴 일은?",
      "opts": [
       "챔버 압력·RF 이상",
       "DRC width 오류",
       "보고서 제출"
      ],
      "ans": 0
     },
     {
      "prompt": "DRC width 오류는 무엇의 '결과'인가?",
      "opts": [
       "식각 선폭이 비정상이 된 것",
       "가스 교체",
       "정상 생산"
      ],
      "ans": 0
     },
     {
      "prompt": "보고서에서 가장 먼저 적는 칸은?",
      "opts": [
       "Problem",
       "Result",
       "Action"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "title": "매뉴얼 — 보고서 예문",
    "mtitle": "MANUAL · Sample Report Sentences",
    "paras": [
     "**Problem:** Etched linewidth was out of spec on Lot A-27.",
     "**Observed:** Chamber pressure spiked at 03:12, RF reflected power rose, and DRC showed **12 width errors**.",
     "**Cause:** Unstable chamber pressure weakened the plasma, so the etch was not uniform.",
     "**Action:** Placed the tool on hold, cleaned the chamber, checked the MFC, and re-tuned RF matching.",
     "**Result:** Pressure became stable, the test wafer linewidth was normal, and **DRC passed** with no errors."
    ]
   },
   {
    "type": "quiz",
    "title": "퀴즈 — 보고서 예문 해석",
    "questions": [
     {
      "prompt": "\"DRC showed 12 width errors\" 의 뜻은?",
      "opts": [
       "DRC에서 선폭 오류 12건이 나왔다",
       "12개 웨이퍼가 정상이다",
       "12분간 검사했다"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Placed the tool on hold\" 의 뜻은?",
      "opts": [
       "장비를 정지(대기) 상태로 두었다",
       "장비를 폐기했다",
       "장비를 판매했다"
      ],
      "ans": 0
     },
     {
      "prompt": "\"DRC passed with no errors\" 는 어떤 상태?",
      "opts": [
       "오류 없이 검사 통과",
       "오류가 남아있음",
       "검사를 못함"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "title": "실습 — 영문 종합 보고서 작성",
    "which": "report",
    "intro": "report 시뮬레이터에서 Problem / Observed / Cause / Action / Result 다섯 칸을 채워 영문 보고서를 완성하세요. 앞의 equipment 실습(압력·RF)과 drc 실습(width 오류)에서 모은 정보를 근거로 각 칸에 알맞은 영어 문장을 골라 넣습니다. 완성된 보고서를 소리 내어 읽어보면 발표 연습도 됩니다."
   },
   {
    "type": "comm",
    "title": "의사소통 코너 — 외국인 엔지니어와",
    "items": [
     {
      "sit": "본사 엔지니어가 이번 식각 불량의 원인을 묻는다.",
      "q": {
       "en": "What was the root cause of the linewidth problem?",
       "ko": "선폭 문제의 근본 원인이 무엇이었나요?"
      },
      "a": {
       "en": "The chamber pressure was unstable, so the plasma got weak and the etch was out of spec.",
       "ko": "챔버 압력이 불안정해서 플라스마가 약해졌고 식각이 규격을 벗어났습니다."
      }
     },
     {
      "sit": "본사에서 조치 결과를 확인한다.",
      "q": {
       "en": "Did the DRC pass after your action?",
       "ko": "조치 후 DRC를 통과했나요?"
      },
      "a": {
       "en": "Yes. After cleaning the chamber and re-tuning the RF, the linewidth was normal and DRC passed.",
       "ko": "네. 챔버를 청소하고 RF를 재조정한 뒤 선폭이 정상이 되었고 DRC를 통과했습니다."
      }
     },
     {
      "sit": "보고서 제출 방법을 묻는다.",
      "q": {
       "en": "Where should I send the report?",
       "ko": "보고서를 어디로 보내면 되나요?"
      },
      "a": {
       "en": "Please send the report to headquarters by email today.",
       "ko": "오늘 이메일로 본사에 보고서를 보내 주세요."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "사건은 사슬로 이어진다: 장비 이상(압력·RF) → 식각 비정상 → DRC width 오류. 결과에서 원인으로 거슬러 올라가 규명한다.",
     "영문 보고서는 다섯 칸: Problem / Observed / Cause / Action / Result. Problem(결론)부터 적는다.",
     "equipment로 장비 값을 확인하고, drc로 오류를 세고, report로 다섯 칸을 채워 영어로 보고한다.",
     "핵심 표현: out of spec(규격 이탈), root cause(근본 원인), on hold(정지), DRC passed(검사 통과)."
    ],
    "done": "**14주 완료 ✓** — 장비·공정·디자인을 하나로 묶어 영문 현장 보고서를 완성했다."
   }
  ]
 },
 {
  "id": "w15",
  "title": "15주 · 기말고사",
  "kind": "평가",
  "slides": [
   {
    "type": "story",
    "icon": "🎓",
    "title": "기말고사 안내",
    "text": "장비·공정·디자인 전체를 종합합니다. **로그 · 매뉴얼 · Design Rule · DRC/LVS 오류**를 읽고 답하세요."
   },
   {
    "type": "quiz",
    "title": "① 장비·운전·알람 종합",
    "intro": "전반부 내용을 확인합니다.",
    "questions": [
     {
      "prompt": "“Ignite the plasma.” 의 뜻은?",
      "opts": [
       "플라즈마를 점화하라",
       "가스를 잠가라",
       "챔버를 열어라"
      ],
      "ans": 0
     },
     {
      "prompt": "“reflected power” 는 무엇인가?",
      "opts": [
       "매칭 불량으로 되돌아오는 RF 전력",
       "공급되는 전력",
       "챔버 온도"
      ],
      "ans": 0
     },
     {
      "prompt": "“Replace the pump oil.” 는 어떤 활동인가?",
      "opts": [
       "유지보수(PM)",
       "운전",
       "설계"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "quiz",
    "title": "② Layer · Design Rule",
    "intro": "디자인 기본 용어를 확인합니다.",
    "questions": [
     {
      "prompt": "Layer “Metal” 은 무엇인가?",
      "opts": [
       "금속 배선",
       "게이트",
       "기판"
      ],
      "ans": 0
     },
     {
      "prompt": "Design Rule 의 “spacing” 은?",
      "opts": [
       "패턴 사이 간격",
       "패턴의 폭",
       "겹침"
      ],
      "ans": 0
     },
     {
      "prompt": "“enclosure” 의 뜻은?",
      "opts": [
       "한 레이어가 다른 레이어를 감싸는 양",
       "최소 폭",
       "누설"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "quiz",
    "title": "③ DRC 오류",
    "intro": "영문 DRC 오류를 해석합니다.",
    "questions": [
     {
      "prompt": "DRC = ?",
      "opts": [
       "Design Rule Check",
       "Data Read Check",
       "Device Run Control"
      ],
      "ans": 0
     },
     {
      "prompt": "“METAL1.SPACING violation” 의 뜻은?",
      "opts": [
       "Metal1 간격 규칙 위반",
       "선폭 정상",
       "소자 누락"
      ],
      "ans": 0
     },
     {
      "prompt": "“insufficient spacing” 은?",
      "opts": [
       "간격이 부족하다",
       "간격이 넓다",
       "폭이 크다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "quiz",
    "title": "④ LVS 검증",
    "intro": "영문 LVS 오류를 해석합니다.",
    "questions": [
     {
      "prompt": "LVS = ?",
      "opts": [
       "Layout Versus Schematic",
       "Low Voltage System",
       "Layer Verify Step"
      ],
      "ans": 0
     },
     {
      "prompt": "“Missing device in the layout.” 는 어떤 오류?",
      "opts": [
       "레이아웃에 소자가 빠짐",
       "간격 위반",
       "진공 이상"
      ],
      "ans": 0
     },
     {
      "prompt": "“incorrect connection” 의 뜻은?",
      "opts": [
       "배선이 회로도와 다름",
       "소자가 중복됨",
       "색이 틀림"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "wrap",
    "title": "수료 — 이 과정을 마치며",
    "points": [
     "장비 운전·로그·알람 → 디자인 규칙·DRC·LVS → 종합 보고까지 마쳤다.",
     "이제 현장 영어를 읽고 → 판단하고 → 보고할 수 있다."
    ],
    "done": "🎓 **기말고사 완료 · 전 과정 수료!**"
   }
  ]
 }
];
