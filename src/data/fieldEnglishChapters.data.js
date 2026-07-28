/* AUTO-GENERATED — 반도체 현장 실무영어 chapter content (deepened + fab-register enrich). Do not hand-edit. */
export const CONTENT_CHAPTERS = [
 {
  "id": "w1",
  "title": "오리엔테이션 · 기본 용어",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "첫 출근 · 화면 앞에 서다",
    "text": "입사 첫날, 선배가 당신을 장비 앞으로 데려간다. 눈앞의 큰 화면(**HMI, Human-Machine Interface**)에는 온통 영어다. **CHAMBER A — IDLE**, **PRESS START TO BEGIN CYCLE**, 그리고 빨간 글씨로 **INTERLOCK ACTIVE**. 선배가 묻는다. \"지금 이 장비, 돌려도 되는 상태야?\" 신입에게 필요한 영어는 '작문'도, 유창한 회화도 아니다. 화면 한 줄, 매뉴얼 한 문장을 **정확히 읽어내는(read)** 힘이다. 사실 입사에 영어 점수가 필수인 건 아니다. 하지만 이 '읽는 힘'은 나중에 **정비·설비 엔지니어**로, 나아가 외국계 장비사로 올라갈수록 커리어의 무기가 된다. 오늘은 그 첫걸음으로, 장비와 화면 전반에 두루 쓰이는 기초 용어와 '화면 읽는 법'을 넓게 살펴본다."
   },
   {
    "type": "read",
    "title": "왜 '현장 영어'인가 — 쓰기가 아니라 판단",
    "intro": "이 수업의 목표는 영어를 '작성'하는 것이 아니라, 이미 영어로 쓰인 정보를 정확히 '읽고 판단'하는 것이다.",
    "paras": [
     "반도체 장비의 대부분은 미국·일본·유럽 제조사가 만든다. 그래서 화면 글자, 버튼 이름, 경고문, **operating manual**이 모두 영어로 고정되어 있다. 한국어 번역본이 있어도, 실제 화면과 로그(log)는 영어 원문이 기준이다.",
     "현장에서 영어를 잘못 읽으면 곧바로 사고로 이어진다. **DO NOT OPEN**(열지 마시오)를 **DO OPEN**으로 착각하거나, **HIGH VACUUM**(고진공) 상태에서 문을 열면 장비 손상·안전사고가 난다. 즉 영어 읽기는 안전 그 자체다.",
     "우리가 연습할 문장은 대부분 **imperative(명령문)**·**short label(짧은 라벨)**·**warning note(경고문)** 형태다. 문학적 영어가 아니라, 짧고 반복되는 실무 영어이므로 패턴만 익히면 빠르게 강해진다.",
     "따라서 이 수업은 문법 시험이나 영작문이 아니다. '이 영어가 무슨 뜻인가', '지금 눌러도 되는가', '이 경고는 무엇을 금지하는가'를 판단하는 **reading & judging** 훈련이다."
    ]
   },
   {
    "type": "read",
    "title": "영어는 어디에서 나타나는가 — 세 곳",
    "intro": "현장에서 영어를 만나는 통로는 크게 세 가지다. 각각 성격이 다르므로 읽는 방식도 다르다.",
    "paras": [
     "첫째, **HMI/GUI 화면**. 장비를 조작하는 터치스크린이다. 여기엔 **status(상태)**, **buttons(버튼)**, **alarms(경보)**가 짧은 영어 단어로 표시된다. 예: **RUN**, **IDLE**, **ABORT**, **PROCESSING…**. 한 단어의 뜻이 곧 장비의 현재 상태다.",
     "둘째, **operating manual / SOP(Standard Operating Procedure)**. 장비를 어떻게 켜고, 어떻게 웨이퍼를 넣고, 문제가 나면 어떻게 하는지 단계별로 적힌 문서다. 대부분 번호가 붙은 **step-by-step imperative** 문장이다.",
     "셋째, **work instruction(작업 지시문)**. 반장·엔지니어가 붙여 놓은 그날그날의 지시다. 예: **Run PM on Tool 3 before shift end.** 짧지만 '누가·무엇을·언제'가 압축되어 있어 정확한 해석이 중요하다.",
     "세 통로 모두 공통 어휘를 공유한다. 그래서 오늘 배우는 기초 용어 하나가 화면·매뉴얼·지시문 세 곳에서 동시에 통한다. 기초 용어를 넓게 깔아두는 것이 오늘의 목적이다."
    ]
   },
   {
    "type": "read",
    "title": "HMI 화면의 구조 읽기",
    "intro": "낯선 장비 화면도 구조는 비슷하다. 어디에 무엇이 있는지 '틀'을 알면 처음 보는 화면도 읽을 수 있다.",
    "paras": [
     "화면 상단(top bar)에는 보통 **tool ID**와 **current status**가 있다. 예: **TOOL EQP-204 | STATUS: IDLE**. 여기만 봐도 '이 장비가 지금 놀고 있는지, 돌고 있는지'를 안다.",
     "가운데(main view)에는 장비 내부를 본뜬 그림, 즉 **schematic/diagram**이 있다. **chamber**, **valve**, **pump** 같은 부품이 그림으로 표시되고, 각 부품 옆에 실시간 숫자(온도·압력)가 뜬다.",
     "숫자에는 두 가지가 있다. **setpoint(목표값)**과 **actual/PV(현재값, Process Value)**. 예: **Temp SP 250°C / PV 248°C**. 둘의 차이를 읽으면 장비가 목표에 도달했는지 판단할 수 있다.",
     "하단(bottom/footer)에는 조작 버튼과 **alarm banner(경보 띠)**가 있다. 색이 중요하다. 보통 **green=normal**, **yellow=warning**, **red=alarm/fault**. 색과 영어 라벨을 함께 읽는 습관이 필요하다.",
     "정리하면 '상단=무엇/무슨 상태, 가운데=어디가 어떤 값, 하단=무엇을 눌러 무엇을 막는가'. 이 세 질문으로 어떤 화면이든 스캔하라."
    ]
   },
   {
    "type": "read",
    "title": "숫자 · 단위 · 상태 표시 읽기",
    "intro": "현장 영어의 절반은 단어가 아니라 '숫자와 단위'다. 단위를 오독하면 판단 전체가 틀어진다.",
    "paras": [
     "온도는 **°C**, 압력은 **Torr / mTorr / Pa**, 유량(가스량)은 **sccm(standard cubic centimeter per minute)**, 전력은 **W(watt)**, 고주파는 **MHz**로 표시된다. 단위를 먼저 확인한 뒤 숫자를 읽어야 한다.",
     "진공 상태는 숫자로도, 라벨로도 나온다. **ATM(대기압)**, **rough vacuum**, **high vacuum**. 예: **1.0E-6 Torr** 같은 지수 표기는 '10의 마이너스 6승 Torr = 아주 높은 진공'을 뜻한다.",
     "상태 라벨은 대개 대문자 한 단어다. **IDLE(대기)**, **RUN/PROCESSING(진행중)**, **DONE/COMPLETE(완료)**, **ABORT(중단)**, **FAULT/ERROR(고장)**. 이 단어만으로 '지금 개입해도 되는가'를 판단한다.",
     "타이밍 표현도 자주 나온다. **elapsed time(경과 시간)**, **remaining(남은 시간)**, **cycle time(1회 처리 시간)**. 예: **REMAINING 00:45** = 45초 남음.",
     "숫자 색·깜빡임도 정보다. 값이 **out of range(범위 이탈)**면 빨간색으로 바뀌거나 깜빡인다. 숫자+단위+색을 한 세트로 읽는 것이 프로의 습관이다."
    ]
   },
   {
    "type": "read",
    "title": "현장 영어의 진짜 문체 — 완전문장이 아니다",
    "intro": "교과서 영어와 현장 영어는 '문체(register)'가 다르다. 현장은 짧고 딱딱하다. 이 문체에 익숙해지는 것이 핵심이다.",
    "paras": [
     "화면 버튼·명령은 **한 단어 동사**다. 완전한 문장이 아니라 **Pump / Vent / Purge / Abort / Accept / Reset** 처럼 딱 떨어진다. '가스를 배출하시겠습니까?'가 아니라 그냥 **Purge**.",
     "알람은 문장이 아니라 **상태 조각(status fragment)**으로 뜬다. \"The pressure is not correct\"가 아니라 **Pressure out of spec**, \"There is a problem with the interlock\"가 아니라 **Interlock not satisfied**.",
     "숫자는 항상 **단위와 붙어서** 나온다. **0.1 Torr**, **50 sccm**, **13.56 MHz**, **1500 W**. 값만 읽지 말고 단위까지 한 세트로 읽어야 판단이 된다.",
     "기록(로그)은 **주어를 생략한 과거형**이다. \"I found a leak and I replaced the o-ring\"가 아니라 **Found leak, replaced O-ring, tool back up**. 짧게 끊어 읽는 연습이 필요하다.",
     "정리: 현장 영어 = **짧은 명령형 + 상태 조각 + 숫자·단위 + 끊어진 과거형 로그**. 예쁜 완전문장을 기대하지 말 것. 이 딱딱함 자체가 현장의 표준이다."
    ]
   },
   {
    "type": "read",
    "title": "영어 작업 지시문(imperative) 문장 구조",
    "intro": "매뉴얼과 지시문의 문장은 거의 다 명령문이다. 명령문의 뼈대를 알면 빠르고 정확하게 읽힌다.",
    "paras": [
     "명령문은 주어(you)를 생략하고 **동사로 시작**한다. 예: **Press START.**, **Close the door.**, **Check the pressure.** 첫 단어(동사)가 '무엇을 하라'는 지시의 핵심이다.",
     "금지·경고는 **DO NOT / NEVER / DO NOT ...**로 시작한다. 예: **Do not open the chamber during processing.** 'Do not' 뒤의 동사를 반드시 확인하라 — 그것이 하면 안 되는 행동이다.",
     "조건은 **If / When / Before / After / Until**로 붙는다. 예: **Before opening, vent the chamber to ATM.** '먼저 무엇을 한 뒤에' 라는 순서를 이 접속사가 알려준다.",
     "주의 등급은 단어로 구분된다. **NOTE(참고)** < **CAUTION(주의, 경미한 손상)** < **WARNING(경고, 부상 위험)** < **DANGER(위험, 즉각적 위험)**. 등급 단어를 먼저 보고 긴장도를 조절하라.",
     "지시문엔 대상이 짧게 온다. 예: **Run PM on Tool 3.** = 'Tool 3에 대해 PM(예방정비)을 실시하라'. '동사 + 대상 + 조건'의 3조각으로 끊어 읽는 연습을 하자."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "현장 영어는 약어 천지다. 오늘은 화면·매뉴얼·지시문에서 가장 자주 마주치는 기본 약어를 넓게 익힌다.",
    "items": [
     {
      "ab": "HMI",
      "full": "Human-Machine Interface",
      "ko": "사람이 장비를 조작하는 화면/조작부. GUI라고도 부른다."
     },
     {
      "ab": "SOP",
      "full": "Standard Operating Procedure",
      "ko": "표준 작업 절차서. 단계별 지시가 적힌 문서."
     },
     {
      "ab": "FOUP",
      "full": "Front Opening Unified Pod",
      "ko": "웨이퍼를 담아 옮기는 밀폐 용기(카세트)."
     },
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비. 고장 전에 주기적으로 하는 점검·청소."
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파. 플라즈마를 만드는 데 쓰는 전력."
     },
     {
      "ab": "ESD",
      "full": "Electrostatic Discharge",
      "ko": "정전기 방전. 웨이퍼·소자를 망가뜨리는 위험 요소."
     },
     {
      "ab": "EMO",
      "full": "Emergency Off",
      "ko": "비상 정지. 누르면 장비 전원을 즉시 차단하는 버튼."
     },
     {
      "ab": "PV",
      "full": "Process Value",
      "ko": "현재 측정값(실제값). 목표값(setpoint)과 짝을 이룬다."
     }
    ]
   },
   {
    "type": "glossary",
    "title": "기초 용어 (1) 장비 · 구성",
    "intro": "장비의 '몸'을 이루는 부품·구성 용어. 화면 그림(schematic)과 매뉴얼에 그림·라벨로 계속 등장한다.",
    "items": [
     {
      "en": "Tool",
      "ko": "장비",
      "d": "반도체 공정을 수행하는 한 대의 설비 전체를 부르는 현장 표현.",
      "ex": "Tool EQP-204 is down for PM."
     },
     {
      "en": "Chamber",
      "ko": "챔버(반응실)",
      "d": "웨이퍼가 실제로 공정 처리되는 밀폐된 내부 공간.",
      "ex": "Load the wafer into the chamber and close the door."
     },
     {
      "en": "Module",
      "ko": "모듈",
      "d": "장비를 이루는 기능 단위(예: 이송 모듈, 공정 모듈).",
      "ex": "The transfer module moves wafers between chambers."
     },
     {
      "en": "Load Port",
      "ko": "로드 포트",
      "d": "FOUP(웨이퍼 용기)를 장비에 올려놓는 자리.",
      "ex": "Place the FOUP on Load Port 1 until it clicks."
     },
     {
      "en": "Wafer",
      "ko": "웨이퍼",
      "d": "반도체 소자를 만드는 얇고 둥근 실리콘 판.",
      "ex": "Do not touch the wafer surface with bare hands."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "아래 영어 표시/문장의 '뜻'을 고르시오. (읽고 판단하기)",
    "questions": [
     {
      "prompt": "화면에 'Tool EQP-204 is down.' 이라고 떴다. 무슨 뜻인가?",
      "opts": [
       "장비가 아래층에 있다",
       "장비가 멈춰 있다(가동 불가/정지 상태)",
       "장비 가격이 내렸다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Load the wafer into the chamber.' 에서 지시하는 동작은?",
      "opts": [
       "웨이퍼를 챔버 안에 넣어라",
       "챔버를 웨이퍼 위에 올려라",
       "웨이퍼를 챔버 밖으로 꺼내라"
      ],
      "ans": 0
     },
     {
      "prompt": "'Place the FOUP on Load Port 1.' 에서 FOUP은 무엇인가?",
      "opts": [
       "장비를 끄는 버튼",
       "웨이퍼를 담아 옮기는 밀폐 용기",
       "청소 도구"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "기초 용어 (2) 상태 · 제어 · HMI 버튼",
    "intro": "화면에서 '지금 무엇을 해도 되는가'를 판단하게 해주는 상태·제어 용어. HMI 버튼과 상태 라벨의 핵심이다.",
    "items": [
     {
      "en": "Idle",
      "ko": "대기(유휴)",
      "d": "장비가 켜져 있으나 아무 공정도 하지 않는 상태.",
      "ex": "The tool is idle and ready to start."
     },
     {
      "en": "Interlock",
      "ko": "인터록(안전 연동)",
      "d": "위험 조건이면 동작을 막는 안전 잠금. 걸려 있으면 시작이 안 된다.",
      "ex": "The door interlock is active; the tool will not start."
     },
     {
      "en": "Abort",
      "ko": "중단",
      "d": "진행 중인 공정을 즉시 멈추는 명령/버튼.",
      "ex": "Press ABORT to stop the current cycle immediately."
     },
     {
      "en": "Acknowledge",
      "ko": "확인(경보 수신 처리)",
      "d": "발생한 경보를 '봤다'고 처리해 표시를 정리하는 조작.",
      "ex": "Acknowledge the alarm before you continue."
     },
     {
      "en": "Recipe",
      "ko": "레시피(공정 조건 세트)",
      "d": "온도·압력·시간 등 공정 조건을 묶어 저장한 설정.",
      "ex": "Select the correct recipe before starting the run."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "intro": "화면/버튼의 영어를 읽고 올바른 판단을 고르시오.",
    "questions": [
     {
      "prompt": "'The door interlock is active; the tool will not start.' 상황을 옳게 판단한 것은?",
      "opts": [
       "문 안전 잠금이 걸려서 지금은 시작되지 않는다",
       "문이 자동으로 열린다",
       "인터록이 있어 더 빨리 시작된다"
      ],
      "ans": 0
     },
     {
      "prompt": "공정 도중 문제가 생겨 즉시 멈춰야 한다. 눌러야 할 버튼은?",
      "opts": [
       "IDLE",
       "ABORT",
       "RECIPE"
      ],
      "ans": 1
     },
     {
      "prompt": "'The tool is idle and ready to start.' 이 화면이 뜻하는 것은?",
      "opts": [
       "장비가 고장 났다",
       "장비가 대기 상태라 시작할 수 있다",
       "장비가 이미 돌고 있다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "장비 상태어 — 현장 표준(SEMI E10)",
    "intro": "장비의 '지금 상태'는 대시보드·인계 로그에 표준 단어로 뜬다. IDLE/RUN 만으로는 부족하다.",
    "items": [
     {
      "en": "Productive",
      "ko": "생산 중",
      "d": "실제로 웨이퍼를 처리하며 돈을 버는 상태.",
      "ex": "The tool is productive and running lots."
     },
     {
      "en": "Standby",
      "ko": "대기",
      "d": "켜져 있고 정상이지만 지금은 일을 안 하는 상태.",
      "ex": "The tool is in standby, ready for the next lot."
     },
     {
      "en": "Engineering",
      "ko": "엔지니어링(시험) 모드",
      "d": "정상 생산이 아니라 시험·평가 목적으로 쓰는 상태.",
      "ex": "Chamber B is in engineering mode for a test run."
     },
     {
      "en": "Scheduled Down",
      "ko": "계획 정지",
      "d": "예방 정비(PM)처럼 미리 잡아둔 정지.",
      "ex": "The tool is scheduled down for PM this morning."
     },
     {
      "en": "Unscheduled Down",
      "ko": "비계획 정지",
      "d": "고장·이상으로 갑자기 멈춘 정지.",
      "ex": "Etcher 3 is unscheduled down after an RF fault."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 — 장비 상태어",
    "intro": "대시보드/인계 로그의 상태 단어를 읽고 판단하시오.",
    "questions": [
     {
      "prompt": "인계 로그에 'Tool scheduled down for PM.' 무슨 뜻인가?",
      "opts": [
       "예방 정비를 위해 미리 잡아둔 정지 상태",
       "고장으로 갑자기 멈춤",
       "정상 생산 중"
      ],
      "ans": 0
     },
     {
      "prompt": "'Unscheduled down' 과 'Scheduled down' 의 차이는?",
      "opts": [
       "둘 다 같은 뜻",
       "Unscheduled=고장 등 갑작스런 정지, Scheduled=미리 계획된 정지",
       "Unscheduled가 더 안전한 상태"
      ],
      "ans": 1
     },
     {
      "prompt": "'The tool is in standby.' 가 뜻하는 것은?",
      "opts": [
       "장비가 고장났다",
       "켜져 있고 정상이지만 지금은 일하지 않는 대기 상태",
       "웨이퍼를 처리하는 중"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "기초 용어 (3) 공정 · 계측 · 안전",
    "intro": "공정 조건과 진공·가스, 안전을 다루는 용어. 숫자·단위와 함께 화면에 뜨는 값들의 이름이다.",
    "items": [
     {
      "en": "Setpoint",
      "ko": "설정값(목표값)",
      "d": "장비가 도달하려는 목표 수치(온도·압력 등).",
      "ex": "The temperature setpoint is 250°C."
     },
     {
      "en": "Flow Rate",
      "ko": "유량",
      "d": "가스가 흐르는 양. 보통 sccm 단위로 표시.",
      "ex": "Set the gas flow rate to 100 sccm."
     },
     {
      "en": "Pressure",
      "ko": "압력",
      "d": "챔버 내부의 압력. Torr/mTorr/Pa 단위로 표시.",
      "ex": "Check that the chamber pressure is below 5 mTorr."
     },
     {
      "en": "Vent",
      "ko": "벤트(대기압 복귀)",
      "d": "진공 챔버에 기체를 넣어 대기압으로 되돌리는 것. 문 열기 전 필수.",
      "ex": "Vent the chamber to ATM before opening the door."
     },
     {
      "en": "Purge",
      "ko": "퍼지(치환/불어내기)",
      "d": "불활성 가스로 내부의 잔류 가스를 밀어내는 것.",
      "ex": "Purge the line with N2 for 30 seconds."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3)",
    "intro": "매뉴얼 문장을 읽고 뜻/순서를 판단하시오.",
    "questions": [
     {
      "prompt": "'Vent the chamber to ATM before opening the door.' 올바른 순서는?",
      "opts": [
       "문을 먼저 열고 벤트한다",
       "벤트로 대기압을 만든 뒤 문을 연다",
       "문을 열 필요가 없다"
      ],
      "ans": 1
     },
     {
      "prompt": "'The temperature setpoint is 250°C.' 에서 250°C는 무엇인가?",
      "opts": [
       "현재 측정된 실제 온도",
       "장비가 도달하려는 목표 온도",
       "최대 허용 압력"
      ],
      "ans": 1
     },
     {
      "prompt": "'Check that the chamber pressure is below 5 mTorr.' 는 무엇을 확인하라는 것인가?",
      "opts": [
       "챔버 압력이 5 mTorr보다 낮은지 확인",
       "챔버 온도가 5도인지 확인",
       "가스 유량이 5 sccm인지 확인"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "OPERATING PROCEDURE — WAFER LOADING",
    "paras": [
     "1. Verify that the tool status shows IDLE before you begin.",
     "1. 시작 전에 장비 상태가 IDLE(대기)로 표시되는지 확인하라. — 다른 상태면 아직 개입하면 안 된다.",
     "2. Place the FOUP on the load port and wait for the clamp to lock.",
     "2. FOUP을 로드 포트에 올리고 클램프가 잠길 때까지 기다려라. — '기다려라'가 지시의 핵심.",
     "3. On the HMI, select the correct recipe for this lot.",
     "3. HMI에서 이 로트(lot)에 맞는 올바른 recipe를 선택하라. — 잘못된 레시피 선택은 공정 불량으로 직결된다.",
     "4. Press START. The status will change to PROCESSING.",
     "4. START를 눌러라. 상태가 PROCESSING(진행중)으로 바뀐다. — 상태 변화로 정상 시작을 확인.",
     "5. Do not open the chamber door while the tool is PROCESSING.",
     "5. 장비가 PROCESSING인 동안에는 챔버 문을 열지 마라. — 'Do not open'은 절대 금지."
    ]
   },
   {
    "type": "manual",
    "mtitle": "SAFETY — WARNINGS & CAUTIONS",
    "paras": [
     "WARNING: High voltage present. Do not remove the RF cover during operation.",
     "경고: 고전압이 흐른다. 가동 중에는 RF 커버를 제거하지 마라. — WARNING은 '부상 위험' 등급.",
     "CAUTION: Wear ESD wrist strap before handling any wafer.",
     "주의: 웨이퍼를 다루기 전 ESD(정전기) 손목 밴드를 착용하라. — 정전기가 소자를 파괴한다.",
     "DANGER: In an emergency, press the EMO button to cut all power immediately.",
     "위험: 비상시 EMO 버튼을 눌러 모든 전원을 즉시 차단하라. — DANGER는 최고 등급, 즉각 조치.",
     "NOTE: If the chamber is under high vacuum, vent to ATM before opening.",
     "참고: 챔버가 고진공 상태면 열기 전에 대기압(ATM)으로 벤트하라. — 순서를 지키지 않으면 장비 손상."
    ]
   },
   {
    "type": "manual",
    "mtitle": "HMI SCREEN GUIDE — STATUS & ALARMS",
    "paras": [
     "The top bar shows the Tool ID and the current status (IDLE, RUN, or FAULT).",
     "상단 바에는 Tool ID와 현재 상태(IDLE, RUN, FAULT)가 표시된다. — 화면을 볼 때 여기부터 읽어라.",
     "A green banner means normal. A red banner means an active alarm.",
     "초록색 띠는 정상, 빨간색 띠는 활성 경보를 뜻한다. — 색이 곧 1차 신호다.",
     "When an alarm appears, read the alarm text and press ACK to acknowledge it.",
     "경보가 뜨면 경보 문구를 읽고 ACK를 눌러 확인 처리하라. — 원인 파악이 먼저, 그다음 ACK.",
     "If PV differs greatly from the setpoint, notify the process engineer.",
     "현재값(PV)이 설정값(setpoint)과 크게 다르면 공정 엔지니어에게 알려라. — 임의 조작 금지, 보고가 원칙."
    ]
   },
   {
    "type": "sim",
    "which": "partDiagram",
    "intro": "아래는 장비의 주요 부품이 영어 라벨과 함께 표시된 부품 도해(part diagram)다. 각 부품을 눌러 영어 이름과 뜻을 확인해 보자. chamber, load port, module, valve, pump 같은 오늘 배운 용어가 화면 그림에서 실제로 어디를 가리키는지 눈으로 익히는 것이 목표다. '이 라벨이 장비의 어느 부분인가'를 스스로 짚어 보라."
   },
   {
    "type": "sim",
    "which": "chamber",
    "intro": "아래는 챔버(chamber) 내부 상태를 보여주는 모의 HMI 화면이다. status 라벨(IDLE/PROCESSING), pressure와 temperature의 setpoint·PV, 그리고 alarm 색을 직접 바꿔 보며 '지금 문을 열어도 되는가', '지금 시작해도 되는가'를 판단해 보자. 진공 상태에서 vent 없이 문을 열면 어떤 경고가 뜨는지도 확인해 보라."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "외국인 엔지니어가 장비 상태를 물어본다",
      "q": {
       "en": "Is Tool EQP-204 idle right now? I need to run a test.",
       "ko": "지금 EQP-204 장비 대기 상태인가요? 테스트를 돌려야 해서요."
      },
      "a": {
       "en": "Yes, it shows IDLE on the HMI. It's ready to start.",
       "ko": "네, HMI에 IDLE로 떠 있어요. 시작할 수 있는 상태입니다."
      }
     },
     {
      "sit": "빨간 경보가 떠 있다",
      "q": {
       "en": "There's a red alarm banner. What does it say?",
       "ko": "빨간 경보 띠가 떠 있네요. 뭐라고 적혀 있나요?"
      },
      "a": {
       "en": "It says 'DOOR INTERLOCK ACTIVE.' The door isn't fully closed, so it won't start.",
       "ko": "'DOOR INTERLOCK ACTIVE'라고 되어 있어요. 문이 완전히 안 닫혀서 시작이 안 됩니다."
      }
     },
     {
      "sit": "챔버 문을 열려고 한다",
      "q": {
       "en": "Can I open the chamber now to check the wafer?",
       "ko": "지금 챔버를 열어서 웨이퍼를 확인해도 될까요?"
      },
      "a": {
       "en": "Not yet. The chamber is under vacuum. We have to vent it to ATM first.",
       "ko": "아직 안 돼요. 챔버가 진공 상태예요. 먼저 대기압으로 벤트해야 합니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "오늘의 정리",
    "points": [
     "현장 영어의 목표는 작문이 아니라 **읽고 판단하기(read & judge)** — 안전과 직결된다.",
     "영어는 **HMI 화면**, **operating manual/SOP**, **work instruction** 세 곳에서 공통 어휘로 나타난다.",
     "화면은 '상단=상태, 가운데=부품/값(setpoint vs PV), 하단=버튼/경보 색'의 틀로 읽는다.",
     "상태 라벨(**IDLE/RUN/ABORT/FAULT**)과 경고 등급(**NOTE<CAUTION<WARNING<DANGER**)만 알아도 판단력이 생긴다.",
     "명령문은 **동사로 시작**, 금지는 **Do not**, 순서는 **before/after/until** 로 읽는다.",
     "핵심 기초 용어 15개(Tool·Chamber·Interlock·Setpoint·Vent 등)와 약어(HMI·FOUP·PM·RF·ESD·EMO)를 확보했다."
    ],
    "done": "1주차 완료! 이제 낯선 영어 화면을 봐도 **'지금 무엇을, 왜, 눌러도 되는가'**를 스스로 묻고 읽어낼 첫 도구를 갖췄습니다. 다음 주부터 장비별로 더 깊이 들어갑니다."
   }
  ]
 },
 {
  "id": "w2",
  "title": "장비 구성요소",
  "slides": [
   {
    "type": "story",
    "icon": "🏭",
    "title": "새 장비 앞에 선 첫날",
    "text": "당신은 오늘 처음으로 식각(**etch**) 장비 앞에 배정되었습니다. 선배 엔지니어가 장비 문을 열자 은색 원통, 굵은 파이프, 반짝이는 밸브들이 눈에 들어옵니다. 선배는 손으로 각 부분을 가리키며 영어로 말합니다. \"This is the **chamber**, and below it is the **turbo pump**. Watch the **gate valve** — never open it under atmosphere.\" 화면(**HMI**)에는 **Chamber Pressure**, **Pump Speed**, **MFC Flow**, **RF Power** 같은 영어 단어가 실시간으로 바뀝니다. 한국어 설명서는 어디에도 없습니다. 모든 부품 이름, 모든 경고문, 모든 버튼이 영어입니다. 부품 이름을 영어로 읽고 그 역할을 이해하는 순간, 당신은 비로소 이 장비를 '다룰' 수 있게 됩니다. 오늘 우리는 식각·증착 장비의 핵심 구성요소 7가지 — **Chamber**, **Pump**, **Gate Valve**, **Gas Line**, **MFC**, **RF Generator**, **Wafer Chuck** — 를 영어 이름과 역할, 그리고 매뉴얼·화면에서의 표기법으로 배웁니다."
   },
   {
    "type": "read",
    "title": "왜 진공이 필요한가: Chamber의 존재 이유",
    "intro": "식각·증착 공정은 대부분 진공(**vacuum**) 상태의 밀폐 공간 안에서 일어납니다. 그 공간이 바로 **chamber**입니다.",
    "paras": [
     "**Chamber(챔버, 반응실)**는 웨이퍼가 실제로 공정을 받는 밀폐 금속 용기입니다. 매뉴얼에서는 흔히 **process chamber** 또는 **reaction chamber**라고 표기하며, 웨이퍼를 넣고 빼는 옆방을 **load lock chamber**라고 부릅니다.",
     "왜 진공인가? 공기 중의 산소·수분·먼지 분자가 웨이퍼 표면에 붙으면 반응이 오염됩니다. 그래서 챔버를 **base pressure(기저 압력)** 수준까지 비운 뒤 공정 가스만 정확히 넣습니다. 화면에서 **Chamber Pressure**가 **1.0E-6 Torr**처럼 지수 표기로 보이면 '매우 낮은 압력 = 좋은 진공'이라는 뜻입니다.",
     "챔버 벽은 보통 알루미늄(**aluminum**)에 특수 코팅을 하며, 플라즈마에 노출되는 소모성 부품을 **chamber liner** 또는 **consumable parts**라고 합니다. 매뉴얼의 **PM(Preventive Maintenance)** 항목에서 자주 등장합니다.",
     "챔버 상태를 나타내는 영어 표기를 반드시 구분하세요: **Vented(대기압 노출됨)**, **Pumping(배기 중)**, **Base Pressure Reached(기저 압력 도달)**, **Process Ready(공정 준비 완료)**. 이 단어를 잘못 읽으면 대기압 상태에서 밸브를 여는 사고로 이어질 수 있습니다.",
     "챔버 벽 온도도 중요합니다. 화면의 **Wall Temp** 또는 **Chamber Temp**는 부산물(**by-product**)이 벽에 응축되지 않도록 일정하게 유지되어야 하며, 낮으면 **flaking(박리)** 파티클 문제가 생깁니다."
    ]
   },
   {
    "type": "read",
    "title": "배기계 (1): Turbo Pump와 Roughing Pump",
    "intro": "챔버를 진공으로 만드는 장치가 펌프(**pump**)입니다. 식각 장비는 보통 두 종류의 펌프를 직렬로 사용합니다.",
    "paras": [
     "**Roughing pump(러핑 펌프, 저진공 펌프)**는 대기압(760 Torr)에서 시작해 챔버를 대략 mTorr 수준까지 초벌로 비웁니다. 매뉴얼에서는 **dry pump** 또는 **backing pump**라는 이름으로도 나옵니다.",
     "**Turbo pump(터보 펌프, Turbomolecular pump)**는 러핑 펌프가 만든 진공을 이어받아 고진공(**high vacuum**)까지 끌어내립니다. 내부의 수만 rpm으로 도는 날개(**rotor blades**)가 가스 분자를 쳐내는 원리입니다. 화면의 **Turbo Speed 100% / 27,000 rpm**이 정상 회전 표시입니다.",
     "순서가 생명입니다. 터보 펌프는 반드시 러핑 펌프로 **foreline(배기 배관)** 쪽 압력을 충분히 낮춘 뒤에만 가속(**spin up**)해야 합니다. 대기압에서 터보를 돌리면 날개가 손상됩니다. 매뉴얼의 경고문 **Do NOT start the turbo pump against atmosphere**가 이 뜻입니다.",
     "펌프 상태 영어 표기: **Spinning Up(가속 중)**, **At Speed / Normal(정상 속도)**, **Spinning Down(감속 중)**, **Fault(고장)**. **Pump Fault** 알람이 뜨면 즉시 공정을 멈추고(**abort**) 보고해야 합니다.",
     "펌프에서 나온 배기 가스는 유해할 수 있어 **abatement / scrubber(배기가스 처리장치)**를 거쳐 처리됩니다. 매뉴얼에서 **exhaust** 관련 항목과 함께 자주 언급됩니다."
    ]
   },
   {
    "type": "read",
    "title": "배기계 (2): Gate Valve와 Foreline",
    "intro": "펌프와 챔버 사이에는 진공을 지키는 관문, 게이트 밸브(**gate valve**)가 있습니다.",
    "paras": [
     "**Gate valve(게이트 밸브)**는 챔버와 터보 펌프 사이를 여닫는 큰 판형 밸브입니다. 열면(**Open**) 챔버가 펌프에 연결되어 배기되고, 닫으면(**Close/Closed**) 챔버가 펌프로부터 격리(**isolate**)됩니다.",
     "밸브 상태를 화면에서 정확히 읽어야 합니다: **Open**, **Closed**, **Opening/Closing(동작 중)**, **Interlocked(인터록으로 잠김)**. **Interlocked**는 안전 조건이 맞지 않아 밸브가 움직이지 않도록 소프트웨어가 막고 있다는 뜻입니다.",
     "**Throttle valve(스로틀 밸브)**는 게이트 밸브와 유사하지만 '얼마나' 여는지를 조절해 챔버 압력을 원하는 값으로 제어하는 밸브입니다. 화면에서 **Throttle Position 45%**처럼 백분율로 표시되며 **pressure control** 항목과 함께 나옵니다.",
     "**Foreline(포어라인)**은 터보 펌프 출구와 러핑 펌프를 잇는 배관입니다. 매뉴얼의 **Foreline Pressure** 값이 높으면 러핑 펌프 성능 저하나 배관 막힘을 의심합니다.",
     "핵심 안전 규칙: 챔버가 **Vented(대기압)** 상태일 때 게이트 밸브를 열면 대기가 터보 펌프로 밀려들어 파손됩니다. 그래서 대부분의 장비는 **interlock(인터록, 안전 연동)** 으로 이를 물리적·소프트웨어적으로 차단합니다."
    ]
   },
   {
    "type": "read",
    "title": "가스 공급계: Gas Line과 MFC",
    "intro": "공정에 필요한 반응 가스는 정확한 유량으로 챔버에 들어가야 합니다. 그 통로가 가스 라인(**gas line**), 유량을 재는 장치가 **MFC**입니다.",
    "paras": [
     "**Gas line(가스 라인)**은 가스 실린더에서 챔버까지 이어지는 배관입니다. 여러 가스가 각각의 라인으로 오다가 챔버 직전에 합쳐지며, 매뉴얼에서는 각 라인을 **Gas 1, Gas 2** 또는 **Ar line, CF4 line**처럼 가스 이름으로 부릅니다.",
     "**MFC(Mass Flow Controller, 질량 유량 제어기)**는 각 가스가 초당 몇 sccm(**standard cubic centimeter per minute**) 흐르는지 정밀하게 제어합니다. 화면에서 **MFC1 Set 50 sccm / Actual 49.8 sccm**처럼 설정값(**Setpoint**)과 실제값(**Actual/Readback**)이 나란히 표시됩니다.",
     "설정값과 실제값의 차이가 크면 문제 신호입니다. **MFC not following setpoint**나 **Flow Alarm**은 라인 막힘, 가스 부족, MFC 고장을 의미할 수 있습니다.",
     "가스 라인을 열고 닫는 밸브를 **isolation valve** 또는 **pneumatic valve**라 하며, 화면에서 각 가스별로 **On/Off** 상태로 나타납니다. 공정 전후 라인에 남은 가스를 불활성 가스로 밀어내는 동작을 **purge(퍼지)**라고 합니다.",
     "**showerhead(샤워헤드)**는 챔버 상부에서 가스를 웨이퍼 위로 고르게 뿌려주는 다공성 전극판입니다. 증착·식각의 균일도(**uniformity**)를 좌우하는 핵심 부품으로 매뉴얼 PM 항목에 자주 등장합니다.",
     "안전상 독성·가연성 가스는 **toxic gas**, **flammable gas**로 표기되며, 관련 경고문에는 항상 **PPE(개인 보호구)** 착용과 **gas detector** 확인이 함께 나옵니다."
    ]
   },
   {
    "type": "read",
    "title": "플라즈마와 웨이퍼: RF Generator와 Wafer Chuck",
    "intro": "식각·플라즈마 증착은 가스를 플라즈마(**plasma**) 상태로 만들어 반응시킵니다. 그 에너지원이 **RF generator**, 웨이퍼를 붙잡는 판이 **wafer chuck**입니다.",
    "paras": [
     "**RF generator(RF 발생기)**는 고주파(**Radio Frequency**, 흔히 13.56 MHz) 전력을 챔버 전극에 공급해 가스를 이온화(**ionize**)하여 플라즈마를 만듭니다. 화면의 **RF Power 500 W**, **Forward Power**, **Reflected Power**가 핵심 표시값입니다.",
     "**Forward power(전방 전력)**는 챔버로 보낸 전력, **Reflected power(반사 전력)**는 챔버가 받아들이지 못하고 되돌아온 전력입니다. 반사 전력이 높으면 에너지가 낭비되고 발생기가 손상될 수 있어, **matching network(매칭 네트워크, 정합기)**가 이를 최소화하도록 자동 조정합니다.",
     "화면에서 **Reflected Power < 5 W**면 정상, 값이 크게 튀면 **matching fault**나 플라즈마 불안정(**plasma unstable**)을 의심합니다.",
     "**Wafer chuck(웨이퍼 척, 웨이퍼 받침)**은 공정 중 웨이퍼를 고정하는 판입니다. 정전기 힘으로 붙잡는 것을 **ESC(Electrostatic Chuck, 정전 척)**라 하며, 화면에서 **Chuck Clamp On/Off**로 표시됩니다.",
     "웨이퍼는 플라즈마 때문에 뜨거워지므로 척 뒷면으로 헬륨을 흘려 온도를 식힙니다. 이를 **backside gas** 또는 **He backside cooling**이라 하며 **Backside Pressure / He Flow** 값으로 관리합니다.",
     "안전: 플라즈마 공정 중에는 고전압·고주파가 흐르므로 매뉴얼에 **RF ON**, **High Voltage** 경고와 함께 챔버 문을 열지 말라는 지시가 반드시 붙습니다."
    ]
   },
   {
    "type": "read",
    "title": "매뉴얼과 HMI 화면에서 부품 읽는 법",
    "intro": "같은 부품도 매뉴얼(문서)과 HMI(화면)에서 표기가 다를 수 있습니다. 현장에서 헷갈리지 않도록 표기 습관을 익힙니다.",
    "paras": [
     "부품 이름은 화면에서 **약어**로 줄어드는 경우가 많습니다. Mass Flow Controller → **MFC**, Electrostatic Chuck → **ESC**, Gate Valve → **GV**, Turbo Pump → **TMP** 또는 **Turbo**. 약어를 원래 이름과 연결해 기억해야 합니다.",
     "상태(status)는 보통 색과 영어 단어로 함께 표시됩니다. 초록 **Ready/Normal**, 노랑 **Warning**, 빨강 **Alarm/Fault/Error**. 단어를 못 읽으면 색만으로 판단하게 되어 위험합니다.",
     "값에는 항상 **단위(unit)**가 붙습니다. 압력은 **Torr / mTorr / Pa**, 유량은 **sccm / slm**, 전력은 **W(watt)**, 온도는 **degC**, 속도는 **rpm / %**. 숫자만 보지 말고 단위까지 함께 읽는 습관이 중요합니다.",
     "동작을 지시하는 버튼은 명령형 동사입니다: **Pump / Vent / Purge / Open / Close / Start / Abort / Reset**. 이들은 곧바로 장비를 움직이므로 뜻을 정확히 알아야 합니다.",
     "매뉴얼 문장은 대부분 명령문(**imperative**)으로 시작합니다. 'Verify...', 'Ensure...', 'Do not...', 'Confirm...'로 시작하는 문장은 '반드시 확인/금지'의 안전 지시라는 신호입니다.",
     "정리하면, 현장에서 부품을 다룬다는 것은 결국 '부품의 영어 이름 + 상태 단어 + 값과 단위 + 명령 동사'를 한눈에 읽어내는 능력입니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "이번 장에서 반드시 알아야 할 장비 부품·화면 약어입니다. 원래 영어 이름과 함께 익히세요.",
    "items": [
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량 유량 제어기 — 가스 유량을 정밀 제어"
     },
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파 — 플라즈마 생성용 전력(보통 13.56 MHz)"
     },
     {
      "ab": "ESC",
      "full": "Electrostatic Chuck",
      "ko": "정전 척 — 정전기 힘으로 웨이퍼 고정"
     },
     {
      "ab": "GV",
      "full": "Gate Valve",
      "ko": "게이트 밸브 — 챔버와 펌프 사이를 여닫음"
     },
     {
      "ab": "TMP",
      "full": "Turbomolecular Pump",
      "ko": "터보 펌프 — 고진공 배기"
     },
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "운전 화면 — 장비 상태 표시·조작 인터페이스"
     },
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비 — 소모성 부품 교체 등 정기 점검"
     },
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeter per Minute",
      "ko": "표준 유량 단위 — 분당 표준 세제곱센티미터"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1): 챔버와 배기계",
    "intro": "챔버와 진공 배기 계통의 핵심 부품 영어 이름입니다. 예문을 소리 내어 읽어 보세요.",
    "items": [
     {
      "en": "chamber",
      "ko": "챔버, 반응실",
      "d": "웨이퍼가 공정을 받는 밀폐 진공 용기",
      "ex": "The process chamber must reach base pressure before starting the recipe."
     },
     {
      "en": "turbo pump",
      "ko": "터보 펌프",
      "d": "고속 회전 날개로 고진공을 만드는 펌프",
      "ex": "Wait until the turbo pump is at full speed before opening the gate valve."
     },
     {
      "en": "roughing pump",
      "ko": "러핑 펌프, 저진공 펌프",
      "d": "대기압에서 챔버를 초벌로 배기하는 펌프",
      "ex": "The roughing pump pulls the chamber down to the milliTorr range."
     },
     {
      "en": "gate valve",
      "ko": "게이트 밸브",
      "d": "챔버와 펌프 사이를 여닫아 진공을 격리하는 밸브",
      "ex": "Never open the gate valve while the chamber is vented."
     },
     {
      "en": "foreline",
      "ko": "포어라인, 배기 배관",
      "d": "터보 펌프 출구와 러핑 펌프를 잇는 배관",
      "ex": "A high foreline pressure may indicate a clogged exhaust line."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "다음 영어 표현의 의미를 고르세요.",
    "questions": [
     {
      "prompt": "화면에 'Chamber Pressure: Base Pressure Reached'가 떴습니다. 무슨 뜻일까요?",
      "opts": [
       "챔버가 기저 압력(충분한 진공)에 도달했다",
       "챔버 압력이 너무 높아 경고 상태다",
       "챔버 문이 열려 대기압이다"
      ],
      "ans": 0
     },
     {
      "prompt": "매뉴얼 문장 'Never open the gate valve while the chamber is vented.'가 금지하는 상황은?",
      "opts": [
       "챔버가 진공일 때 밸브를 여는 것",
       "챔버가 대기압일 때 게이트 밸브를 여는 것",
       "펌프가 정상 속도일 때 밸브를 여는 것"
      ],
      "ans": 1
     },
     {
      "prompt": "'The turbo pump is spinning up.'의 의미는?",
      "opts": [
       "터보 펌프가 고장났다",
       "터보 펌프가 정지했다",
       "터보 펌프가 가속(회전 상승) 중이다"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2): 가스 공급과 플라즈마",
    "intro": "가스 공급계와 RF 관련 부품 용어입니다. 값·단위 표현에도 주목하세요.",
    "items": [
     {
      "en": "gas line",
      "ko": "가스 라인",
      "d": "가스 실린더에서 챔버까지 이어지는 배관",
      "ex": "Purge the gas line with argon before switching process gases."
     },
     {
      "en": "MFC (Mass Flow Controller)",
      "ko": "질량 유량 제어기",
      "d": "가스 유량을 sccm 단위로 정밀 제어하는 장치",
      "ex": "MFC1 is set to 50 sccm but the actual flow reads 30 sccm."
     },
     {
      "en": "RF generator",
      "ko": "RF 발생기",
      "d": "고주파 전력을 공급해 플라즈마를 생성하는 장치",
      "ex": "The RF generator output is set to 500 watts of forward power."
     },
     {
      "en": "matching network",
      "ko": "매칭 네트워크, 정합기",
      "d": "반사 전력을 최소화하도록 임피던스를 맞추는 회로",
      "ex": "The matching network automatically tunes to keep reflected power low."
     },
     {
      "en": "showerhead",
      "ko": "샤워헤드",
      "d": "가스를 웨이퍼 위로 고르게 분사하는 다공성 전극판",
      "ex": "Inspect the showerhead for clogged holes during preventive maintenance."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "intro": "다음 화면·매뉴얼 표현의 의미를 고르세요.",
    "questions": [
     {
      "prompt": "화면에 'MFC1 Set 50 sccm / Actual 30 sccm'가 보입니다. 무엇을 의심해야 할까요?",
      "opts": [
       "설정값과 실제 유량이 다르므로 라인 막힘·가스 부족 등 문제 가능",
       "완전히 정상이며 아무 조치도 필요 없다",
       "RF 전력이 너무 높다는 뜻이다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Reflected Power' 값이 크게 높아졌습니다. 무슨 의미일까요?",
      "opts": [
       "챔버로 전력이 잘 전달되고 있다",
       "전력이 되돌아와 낭비·손상 위험이 있다(정합 이상 가능)",
       "가스 유량이 정상이라는 뜻이다"
      ],
      "ans": 1
     },
     {
      "prompt": "매뉴얼의 'Purge the gas line with argon.'에서 purge의 의미는?",
      "opts": [
       "가스 라인을 새 가스로 교체 설치하라",
       "불활성 가스로 라인 안의 잔류 가스를 밀어내라",
       "가스 라인을 완전히 막아라"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3): 웨이퍼 척과 압력 제어",
    "intro": "웨이퍼 고정·냉각과 압력 제어 관련 용어입니다.",
    "items": [
     {
      "en": "wafer chuck",
      "ko": "웨이퍼 척",
      "d": "공정 중 웨이퍼를 고정하는 받침판",
      "ex": "Confirm the wafer chuck clamp is ON before igniting the plasma."
     },
     {
      "en": "electrostatic chuck (ESC)",
      "ko": "정전 척",
      "d": "정전기 힘으로 웨이퍼를 붙잡는 척",
      "ex": "The electrostatic chuck holds the wafer flat during the etch step."
     },
     {
      "en": "backside gas",
      "ko": "백사이드 가스(헬륨 냉각)",
      "d": "척 뒷면에 헬륨을 흘려 웨이퍼를 냉각하는 방식",
      "ex": "Backside gas pressure is low, which may cause wafer overheating."
     },
     {
      "en": "throttle valve",
      "ko": "스로틀 밸브",
      "d": "여는 정도를 조절해 챔버 압력을 제어하는 밸브",
      "ex": "The throttle valve moves to 45% to hold the chamber at 20 mTorr."
     },
     {
      "en": "interlock",
      "ko": "인터록, 안전 연동",
      "d": "안전 조건이 안 맞으면 동작을 막는 보호 기능",
      "ex": "The gate valve is interlocked because the chamber is still vented."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3)",
    "intro": "다음 표현의 의미를 고르세요.",
    "questions": [
     {
      "prompt": "화면에 'Gate Valve: Interlocked'가 표시됩니다. 무슨 뜻일까요?",
      "opts": [
       "게이트 밸브가 완전히 열려 있다",
       "안전 조건 불충족으로 밸브 동작이 막혀 있다",
       "게이트 밸브가 고장나 교체가 필요하다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Backside gas pressure is low.'라는 알람의 실질적 위험은?",
      "opts": [
       "웨이퍼 냉각이 부족해 과열될 수 있다",
       "챔버 진공이 너무 좋아진다",
       "RF 전력이 자동으로 올라간다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Confirm the chuck clamp is ON before igniting the plasma.'가 지시하는 순서는?",
      "opts": [
       "플라즈마를 켠 뒤 척을 잡아라",
       "척으로 웨이퍼를 고정한 것을 확인한 뒤 플라즈마를 켜라",
       "척과 플라즈마는 순서가 상관없다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "OPERATING PROCEDURE — CHAMBER PUMP-DOWN",
    "paras": [
     "1. Confirm the chamber door is fully closed and the seal is clean.",
     "1. 챔버 문이 완전히 닫혔는지, 실링면(seal)이 깨끗한지 확인한다.",
     "2. Verify the roughing pump is running and the foreline pressure is stable.",
     "2. 러핑 펌프가 작동 중이고 포어라인 압력이 안정적인지 확인한다.",
     "3. Press PUMP to begin evacuating the chamber to milliTorr range.",
     "3. PUMP 버튼을 눌러 챔버를 mTorr 수준까지 배기하기 시작한다.",
     "4. Do NOT start the turbo pump against atmosphere. Wait until the foreline pressure is below the crossover setpoint.",
     "4. 대기압 상태에서 터보 펌프를 가동하지 말 것. 포어라인 압력이 교차(crossover) 설정값 아래로 내려갈 때까지 기다린다.",
     "5. When the turbo pump reaches full speed, the gate valve may open automatically.",
     "5. 터보 펌프가 정상 속도에 도달하면 게이트 밸브가 자동으로 열릴 수 있다.",
     "6. Wait for the status to change to 'Base Pressure Reached' before loading the recipe.",
     "6. 상태가 'Base Pressure Reached'로 바뀐 뒤에 레시피를 불러온다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "WORK INSTRUCTION — GAS LINE & MFC CHECK",
    "paras": [
     "Ensure all gas isolation valves are closed before opening the manual cylinder valve.",
     "실린더 수동 밸브를 열기 전에 모든 가스 차단(isolation) 밸브가 닫혀 있는지 확인한다.",
     "Set each MFC to its recipe setpoint and confirm the actual (readback) value matches within tolerance.",
     "각 MFC를 레시피 설정값으로 맞추고, 실제값(readback)이 허용 오차 내에서 일치하는지 확인한다.",
     "If the MFC does not follow its setpoint, check for a clogged line or an empty gas cylinder.",
     "MFC가 설정값을 따라가지 못하면 라인 막힘이나 가스 실린더 소진을 점검한다.",
     "After the process, purge the gas lines with the inert gas for the specified time.",
     "공정 종료 후 지정된 시간 동안 불활성 가스로 가스 라인을 퍼지한다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "SAFETY NOTES — RF & VACUUM HAZARDS",
    "paras": [
     "WARNING: High voltage and RF energy are present when RF power is ON. Do not open the chamber lid.",
     "경고: RF 전원이 켜져 있을 때는 고전압과 RF 에너지가 존재한다. 챔버 뚜껑을 열지 말 것.",
     "CAUTION: Never open the gate valve while the chamber is vented. This can destroy the turbo pump.",
     "주의: 챔버가 대기압(vented)일 때 게이트 밸브를 열지 말 것. 터보 펌프가 파손될 수 있다.",
     "NOTE: Some process gases are toxic or flammable. Verify the gas detector is active and wear required PPE.",
     "참고: 일부 공정 가스는 독성·가연성이다. 가스 감지기가 작동 중인지 확인하고 필수 보호구(PPE)를 착용한다.",
     "If any Alarm or Fault appears, abort the process and notify the equipment engineer immediately.",
     "Alarm 또는 Fault가 뜨면 공정을 중단(abort)하고 즉시 장비 엔지니어에게 알린다."
    ]
   },
   {
    "type": "sim",
    "which": "partDiagram",
    "intro": "아래 부품 다이어그램에서 식각·증착 장비의 구성요소들이 어떻게 배치되는지 살펴보세요. Chamber, Turbo Pump, Gate Valve, Gas Line, MFC, RF Generator, Wafer Chuck의 영어 이름과 위치를 하나씩 클릭해 확인하고, 가스가 들어오는 경로(위쪽 showerhead)와 배기되는 경로(아래쪽 gate valve → turbo pump)의 방향을 머릿속으로 그려 보세요."
   },
   {
    "type": "sim",
    "which": "devicePanel",
    "intro": "아래는 실제 장비의 HMI 운전 화면을 본뜬 패널입니다. Chamber Pressure, Turbo Speed, MFC Set/Actual, RF Forward/Reflected Power, Chuck Clamp 같은 영어 표시값을 직접 읽어 보세요. 값과 단위(Torr, sccm, W, rpm, %)를 함께 확인하고, 초록 Normal · 노랑 Warning · 빨강 Alarm 상태 단어가 무엇을 뜻하는지 판단하는 연습을 하세요."
   },
   {
    "type": "sim",
    "which": "chamber",
    "intro": "아래 챔버 시뮬레이션에서 pump-down 절차를 순서대로 따라해 보세요. 먼저 챔버가 Vented 상태임을 확인하고, PUMP를 눌러 배기하며 Chamber Pressure가 낮아지는 것을 관찰하세요. 터보 펌프가 At Speed가 된 뒤 Gate Valve가 열리고 'Base Pressure Reached'가 표시될 때까지 각 단계의 영어 상태 표기가 어떻게 바뀌는지 읽어 보세요. 대기압에서 게이트 밸브를 열면 왜 위험한지도 함께 떠올리세요."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "외국인 엔지니어가 챔버 압력이 안 떨어진다며 도움을 요청한다.",
      "q": {
       "en": "The chamber pressure isn't going down. Can you check the roughing pump for me?",
       "ko": "챔버 압력이 안 떨어져요. 러핑 펌프 좀 확인해 줄래요?"
      },
      "a": {
       "en": "Sure. The roughing pump is running, but the foreline pressure looks high. There may be a leak or a clogged line.",
       "ko": "네. 러핑 펌프는 돌고 있는데 포어라인 압력이 높아 보여요. 누설이나 라인 막힘일 수 있어요."
      }
     },
     {
      "sit": "엔지니어가 게이트 밸브가 열리지 않는다고 말한다.",
      "q": {
       "en": "The gate valve won't open. The screen just says 'Interlocked.' What does that mean?",
       "ko": "게이트 밸브가 안 열려요. 화면에 그냥 'Interlocked'라고만 떠요. 무슨 뜻이죠?"
      },
      "a": {
       "en": "It means the safety condition isn't met. The chamber is still vented, so the interlock blocks the valve to protect the turbo pump.",
       "ko": "안전 조건이 안 맞는다는 뜻이에요. 챔버가 아직 대기압이라서, 터보 펌프를 보호하려고 인터록이 밸브를 막고 있어요."
      }
     },
     {
      "sit": "RF 전력의 반사 전력이 높아 엔지니어가 원인을 묻는다.",
      "q": {
       "en": "The reflected power keeps spiking. Do you know why?",
       "ko": "반사 전력이 계속 치솟아요. 이유를 알아요?"
      },
      "a": {
       "en": "The matching network may not be tuning well, or the plasma is unstable. Let's check the RF power and the matching status first.",
       "ko": "매칭 네트워크가 정합을 잘 못 잡거나 플라즈마가 불안정한 것 같아요. 먼저 RF 전력과 매칭 상태부터 확인해 봐요."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리 및 마무리",
    "points": [
     "식각·증착 장비의 7대 구성요소: **Chamber(반응실)**, **Turbo/Roughing Pump(펌프)**, **Gate Valve(게이트 밸브)**, **Gas Line(가스 라인)**, **MFC(질량 유량 제어기)**, **RF Generator(RF 발생기)**, **Wafer Chuck(웨이퍼 척)**.",
     "챔버는 진공이 있어야 청정 공정이 가능하며, 화면의 **Vented / Pumping / Base Pressure Reached** 상태 단어를 정확히 읽어야 한다.",
     "터보 펌프는 반드시 러핑 펌프로 초벌 배기한 뒤 가동하며, **대기압에서 게이트 밸브를 열면 절대 안 된다(interlock의 이유)**.",
     "가스는 **MFC**가 sccm 단위로 제어하고, **Setpoint와 Actual 값 차이**는 문제 신호다.",
     "**RF Forward/Reflected Power**와 **matching network**, 그리고 **wafer chuck·ESC·backside gas**의 역할을 이해했다.",
     "부품은 화면에서 **약어·상태 단어·값과 단위·명령 동사**로 나타나며, 이를 함께 읽는 것이 현장 실무의 핵심이다."
    ],
    "done": "수고했습니다. 이제 당신은 장비 앞에서 **부품의 영어 이름을 읽고 그 역할과 상태를 판단**할 수 있습니다. 다음 시간에는 이 부품들이 실제 공정 레시피 안에서 어떻게 움직이는지 배웁니다. **You can now read the machine — not just look at it.**"
   }
  ]
 },
 {
  "id": "w3",
  "title": "운전 절차",
  "slides": [
   {
    "type": "story",
    "icon": "🕹️",
    "title": "초록불이 켜지기 전에는 손대지 마라",
    "text": "야간 근무 첫날, 선배가 장비 앞에서 말한다. \"화면에 **READY** 초록불 뜨기 전에는 절대 **START** 누르지 마.\" 신입은 웨이퍼 카세트를 **load port**에 올리고 **START**를 눌렀다. 장비는 곧바로 **pump down**을 시작했고, 압력계 숫자가 빠르게 떨어졌다. 하지만 아직 **base pressure**에 도달하지 못했는데 **transfer valve**를 열려고 하자, 화면에 붉은 글씨로 **INTERLOCK: base pressure not reached** 가 떴다. 선배가 웃으며 말한다. \"장비는 영어로 너한테 계속 말을 걸어. **load, evacuate, pump down, purge, vent, start, stop, unload** — 이 명령어들과 상태 표시만 정확히 읽으면, 절차는 반쯤 끝난 거야.\" 오늘 우리는 장비가 화면과 매뉴얼로 건네는 그 영어를 읽고, 지금 어떤 상태인지 스스로 판단하는 법을 배운다."
   },
   {
    "type": "read",
    "title": "운전 절차란 무엇인가 — 전체 시퀀스 읽기",
    "intro": "장비 운전은 정해진 순서(sequence)를 따라 진행됩니다. 각 단계가 영어 명령어 한 단어로 표시되므로, 순서와 의미를 함께 이해해야 합니다.",
    "paras": [
     "반도체 공정 장비의 기본 흐름은 대개 **load → evacuate(pump down) → process → purge → vent → unload** 순서로 진행됩니다. 각 단계는 화면에서 영어 동사 하나로 표시되므로, 이 여섯~여덟 단어가 사실상 '운전 절차의 목차'입니다.",
     "**load**는 웨이퍼(또는 카세트)를 장비 안으로 넣는 단계이고, **unload**는 공정이 끝난 뒤 다시 꺼내는 단계입니다. 화면 버튼이 **LOAD / UNLOAD**로 구분되어 있어, 눌러야 할 방향을 반드시 확인해야 합니다.",
     "**evacuate**와 **pump down**은 사실상 같은 뜻으로, 챔버 안의 공기를 빼내 진공을 만드는 단계입니다. 매뉴얼에 따라 **Evacuate the chamber** 또는 **Pump down the load lock**처럼 표현이 달라질 뿐, 하는 일은 같습니다.",
     "공정이 끝나면 **purge**(질소로 내부 가스 치환)와 **vent**(대기압으로 되돌림)를 거쳐야 문을 안전하게 열 수 있습니다. 이 순서를 건너뛰면 위험하거나 장비가 **interlock**으로 막힙니다.",
     "**start**와 **stop**은 시퀀스 전체를 시작/정지시키는 상위 명령입니다. 화면의 **START** 버튼은 '준비가 끝났으니 순서대로 진행하라', **STOP**은 '지금 진행 중인 동작을 멈춰라'를 의미합니다.",
     "핵심은 '지금 장비가 시퀀스의 어느 단계에 있는가'를 화면 영어로 읽어내는 것입니다. 단계 이름을 모르면 다음에 무엇을 눌러야 하는지 판단할 수 없습니다."
    ]
   },
   {
    "type": "read",
    "title": "진공 만들기 — pump down / evacuate 의 물리적 의미",
    "intro": "왜 챔버를 진공으로 만드는지, 그리고 화면의 압력 숫자를 어떻게 읽는지 이해하면 절차 판단이 쉬워집니다.",
    "paras": [
     "대부분의 반도체 공정은 진공(**vacuum**)에서 진행됩니다. 공기 중 산소·수분·먼지가 웨이퍼 표면을 오염시키거나 반응을 방해하기 때문에, **pump down**으로 이런 잔류 기체를 제거해야 합니다.",
     "**pump down**은 보통 두 단계로 나뉩니다. 먼저 러핑 펌프로 대기압에서 중간 진공까지 내리는 **rough vacuum** 단계, 그다음 터보/크라이오 펌프로 고진공까지 내리는 **high vacuum** 단계입니다. 화면에서 압력이 급격히 떨어지다가 천천히 내려가는 구간이 이 전환점입니다.",
     "압력 단위는 주로 **Torr**, **mTorr**, 또는 **Pa**로 표시됩니다. 예를 들어 **760 Torr**는 대기압, **5.0E-6 Torr**는 고진공을 뜻합니다. 지수 표기 **E-6**은 '×10의 -6승'이므로 숫자가 작을수록 진공도가 높습니다.",
     "장비가 도달할 수 있는 가장 낮은 안정 압력을 **base pressure**라고 합니다. 공정을 시작하려면 이 **base pressure**에 도달해야 하며, 그렇지 않으면 오염이나 공정 불량이 발생합니다.",
     "화면에는 흔히 **Pumping...**, **Evacuating...**, 또는 진행 막대(progress bar)가 표시됩니다. 이 표시는 '아직 진공 만드는 중이니 기다려라'는 뜻이며, 이때 밸브를 강제로 열면 안 됩니다.",
     "압력이 목표값 근처에서 더 이상 내려가지 않고 멈추면(예: **leak**이나 배기 이상), 화면에 **base pressure not reached**나 경고가 뜹니다. 이 영어를 읽고 '지금 시작하면 안 된다'고 판단할 수 있어야 합니다."
    ]
   },
   {
    "type": "read",
    "title": "purge 와 vent — 가스 치환과 안전",
    "intro": "공정이 끝난 뒤 문을 열기까지의 절차입니다. purge와 vent를 혼동하면 위험하므로 정확히 구분합니다.",
    "paras": [
     "**purge**는 챔버 안에 남은 공정 가스(독성·가연성일 수 있음)를 질소(**N2**) 같은 불활성 가스로 밀어내 치환하는 단계입니다. 매뉴얼에 **Purge the chamber with N2**처럼 나옵니다.",
     "**vent**는 진공 상태의 챔버를 다시 대기압(**atmosphere**)으로 되돌리는 단계입니다. 진공 상태에서는 문이 압력차로 열리지 않으므로, **vent**로 압력을 맞춰야 안전하게 개방할 수 있습니다.",
     "순서가 중요합니다. 보통 **purge**로 위험 가스를 먼저 제거한 뒤 **vent**로 대기압을 만듭니다. 이 순서를 바꾸면 유해 가스가 작업 공간으로 새어 나올 수 있습니다.",
     "화면에는 **Venting to atmosphere...** 또는 **N2 purge in progress**가 표시되며, 완료되면 **Vent complete** 또는 **Door unlocked** 같은 메시지가 뜹니다. 이 완료 표시를 확인한 뒤에만 문을 엽니다.",
     "펌프가 아직 돌고 있을 때 **vent**하면 펌프 손상이나 오일 역류가 생길 수 있으므로, 매뉴얼의 **Never vent while the pump is running** 같은 경고문을 반드시 읽고 지켜야 합니다.",
     "**vent** 후에는 압력계(**gauge**)가 대기압(약 **760 Torr**)을 가리키는지 눈으로 확인하는 것이 마지막 판단 기준입니다. 숫자와 화면 메시지가 일치해야 안전합니다."
    ]
   },
   {
    "type": "read",
    "title": "READY 상태와 base pressure — '지금 시작해도 되는가' 판단",
    "intro": "운전 절차에서 가장 중요한 판단은 '시작 가능 상태인지'를 읽는 것입니다. 이 판단 기준을 정리합니다.",
    "paras": [
     "장비가 공정을 시작할 준비가 되면 화면에 **READY** 표시가 뜨거나 상태 램프가 초록색으로 바뀝니다. 이 **READY**는 여러 조건이 모두 충족됐다는 종합 신호입니다.",
     "**READY**가 뜨려면 보통 ① **base pressure** 도달, ② 온도·유량 등 **setpoint** 도달, ③ 문·밸브의 **interlock** 해제, ④ 이전 단계 정상 완료가 모두 만족되어야 합니다. 하나라도 어긋나면 **NOT READY**로 남습니다.",
     "**base pressure**에 도달했는지는 압력 숫자로 판단합니다. 예를 들어 목표가 **< 5.0E-6 Torr**인데 화면이 **2.0E-4 Torr**를 가리키면, 아직 두 자릿수 이상 높으므로 '아직 준비 안 됨'입니다.",
     "장비가 대기 중이지만 공정 중은 아닌 상태를 **idle** 또는 **standby**라고 표시합니다. **idle**은 '문제는 없지만 아직 START 전'이라는 뜻으로, **READY**와는 다릅니다.",
     "**START** 버튼이 회색(비활성)으로 흐려져 있으면 아직 조건이 안 맞은 것입니다. 버튼이 활성화되고 **READY**가 초록불일 때만 실제로 시작할 수 있습니다.",
     "정리하면, 작업자는 '숫자(**base pressure/setpoint**) + 상태표시(**READY/interlock**) + 버튼 활성 여부'를 함께 읽고 나서 시작 여부를 판단해야 합니다. 하나만 보고 판단하면 오조작으로 이어집니다."
    ]
   },
   {
    "type": "read",
    "title": "명령문(imperative) 읽기 — 작업 지시문의 문법",
    "intro": "매뉴얼과 작업 지시서(work instruction)는 대부분 명령문입니다. 명령문의 형태를 알면 '무엇을 하라는지'가 즉시 보입니다.",
    "paras": [
     "작업 지시문은 주어 없이 동사로 시작하는 **imperative(명령문)** 형태가 기본입니다. 예: **Load the cassette.** / **Press START.** / **Pump down the chamber.** — 앞에 'You'가 생략된 '~하라'는 지시입니다.",
     "금지·주의는 부정 명령문으로 표현됩니다. **Do not open the door.**(문을 열지 마라), **Never vent while pumping.**(배기 중 벤트 금지). **Do not / Never**로 시작하면 '하면 안 되는 것'이므로 특히 주의해서 읽습니다.",
     "확인을 요구하는 동사도 자주 나옵니다. **Ensure ~**, **Verify ~**, **Confirm ~**, **Check ~**는 모두 '~인지 반드시 확인하라'는 뜻입니다. 예: **Verify the gauge reads atmospheric pressure.**",
     "조건은 **If ~, (then) ...** 구조로 옵니다. 예: **If the sequence stalls, press STOP.**(시퀀스가 멈추면 STOP을 눌러라). **If / When / Before / After**로 시작하는 부분은 '언제 그 동작을 하는가'를 알려줍니다.",
     "경고 등급 단어의 세기를 구분해야 합니다. **NOTE**(참고) < **CAUTION**(주의, 경미한 손상 가능) < **WARNING**(경고, 부상 위험) < **DANGER**(위험, 심각·치명적). 등급이 높을수록 반드시 그대로 따릅니다.",
     "순서 지시에는 번호와 **then / next / after that**가 함께 쓰입니다. **Purge with N2, then vent to atmosphere.** 처럼 **then**의 앞뒤 순서를 뒤바꾸지 않도록 읽습니다."
    ]
   },
   {
    "type": "read",
    "title": "HMI / GUI 화면 텍스트 읽기",
    "intro": "장비의 상태는 대부분 영어 화면(HMI/GUI)으로 표시됩니다. 버튼·표시등·메시지의 영어를 유형별로 익힙니다.",
    "paras": [
     "화면의 조작 버튼은 동사 한두 단어입니다: **START / STOP / LOAD / UNLOAD / PUMP / VENT / PURGE / ABORT**. 버튼이 진하면 활성(누를 수 있음), 흐리면 비활성(지금은 못 누름)을 뜻합니다.",
     "상태 표시등(status lamp)의 색은 관례가 있습니다. 초록 = **READY / RUNNING(정상)**, 노랑 = **IDLE / STANDBY / WARNING(대기·주의)**, 빨강 = **ALARM / FAULT / STOP(이상·정지)**. 색과 영어 단어를 함께 읽습니다.",
     "진행 중 상태는 현재진행형 또는 '...'으로 표시됩니다: **Pumping...**, **Evacuating...**, **Venting...**, **Processing...**. 이 표시가 있으면 '동작 중이니 기다려라'는 의미입니다.",
     "확인을 요구하는 팝업(**prompt**)이 뜹니다: **Confirm to continue?** 또는 **Are you sure you want to vent?** — 여기서 **OK/Yes**는 진행, **Cancel/No**는 취소입니다. 내용을 읽지 않고 누르면 안 됩니다.",
     "수치 표시는 보통 **현재값(actual)**과 **목표값(setpoint)**이 나란히 나옵니다. 예: **Pressure: 8.0E-5 / SP 5.0E-6 Torr**. 왼쪽이 지금, 오른쪽이 도달해야 할 값입니다.",
     "이상 메시지는 짧은 영어 코드/문장으로 뜹니다: **INTERLOCK ACTIVE**, **BASE PRESSURE NOT REACHED**, **DOOR OPEN**, **GAS FLOW LOW**. 이 문장을 그대로 읽고 원인을 판단하는 것이 현장 영어의 핵심 능력입니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "화면과 매뉴얼에 자주 등장하는 약어입니다. 뜻을 알아야 상태를 즉시 판단할 수 있습니다.",
    "items": [
     {
      "ab": "HMI",
      "full": "Human Machine Interface",
      "ko": "작업자-장비 조작 화면(터치패널 등)"
     },
     {
      "ab": "GUI",
      "full": "Graphical User Interface",
      "ko": "그래픽 사용자 인터페이스 화면"
     },
     {
      "ab": "LL",
      "full": "Load Lock",
      "ko": "로드락 — 진공을 유지한 채 웨이퍼를 넣고 빼는 중간 챔버"
     },
     {
      "ab": "N2",
      "full": "Nitrogen",
      "ko": "질소 — purge/vent에 쓰이는 불활성 가스"
     },
     {
      "ab": "SP",
      "full": "Set Point",
      "ko": "설정값(목표값) — 도달해야 할 압력·온도·유량"
     },
     {
      "ab": "PV",
      "full": "Process Value",
      "ko": "현재값 — 실제 측정된 값"
     },
     {
      "ab": "EMO",
      "full": "Emergency Off",
      "ko": "비상 정지 — 즉시 전원을 차단하는 버튼"
     },
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비 — 장비 정지 후 점검·교체"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 운전 명령어 (1)",
    "intro": "장비 화면과 매뉴얼에서 가장 자주 누르고 읽는 기본 동사입니다.",
    "items": [
     {
      "en": "load",
      "ko": "로드하다(넣다)",
      "d": "웨이퍼나 카세트를 장비 안으로 넣는 동작",
      "ex": "Load the wafer cassette onto the load port."
     },
     {
      "en": "unload",
      "ko": "언로드하다(꺼내다)",
      "d": "공정이 끝난 웨이퍼를 장비에서 꺼내는 동작",
      "ex": "After processing, unload the wafers from the chamber."
     },
     {
      "en": "evacuate",
      "ko": "배기하다(진공을 만들다)",
      "d": "챔버 안의 공기를 빼내 진공 상태로 만드는 것",
      "ex": "Evacuate the chamber before starting the process."
     },
     {
      "en": "pump down",
      "ko": "펌프로 진공을 내리다",
      "d": "펌프를 돌려 챔버 압력을 낮추는 배기 동작(evacuate와 동의)",
      "ex": "Pump down the load lock until it reaches base pressure."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 문제 (1)",
    "intro": "화면·매뉴얼의 영어 명령을 올바르게 해석하세요.",
    "questions": [
     {
      "prompt": "매뉴얼에 'Pump down the chamber.'라고 되어 있습니다. 무엇을 하라는 뜻입니까?",
      "opts": [
       "챔버 안의 공기를 빼내 진공을 만들라",
       "챔버에 가스를 채우라",
       "챔버 문을 열라"
      ],
      "ans": 0
     },
     {
      "prompt": "'Unload the wafers'는 어떤 동작입니까?",
      "opts": [
       "웨이퍼를 장비에 넣는다",
       "웨이퍼를 장비에서 꺼낸다",
       "웨이퍼를 세척한다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Evacuate'와 사실상 같은 뜻으로 쓰이는 표현은?",
      "opts": [
       "Vent",
       "Purge",
       "Pump down"
      ],
      "ans": 2
     }
    ]
   },
   {
    "type": "glossary",
    "title": "가스·압력 관련 용어 (2)",
    "intro": "진공을 만들고 다시 대기압으로 돌리는 과정에서 반드시 구분해야 할 용어입니다.",
    "items": [
     {
      "en": "purge",
      "ko": "퍼지(가스 치환)",
      "d": "챔버 내 잔류 가스를 질소 등 불활성 가스로 밀어내 치환하는 것",
      "ex": "Purge the chamber with N2 before venting."
     },
     {
      "en": "vent",
      "ko": "벤트(대기압 복귀)",
      "d": "진공 챔버를 다시 대기압으로 되돌려 문을 열 수 있게 하는 것",
      "ex": "Vent the chamber to atmosphere before opening the door."
     },
     {
      "en": "base pressure",
      "ko": "도달 진공도(기저 압력)",
      "d": "장비가 도달할 수 있는 가장 낮은 안정 압력; 공정 시작 기준",
      "ex": "Wait until the chamber reaches base pressure of 5.0E-6 Torr."
     },
     {
      "en": "vacuum",
      "ko": "진공",
      "d": "대기압보다 낮게 기체를 제거한 상태",
      "ex": "The process must run under high vacuum."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 문제 (2)",
    "intro": "다음 영어 표현의 의미를 고르세요.",
    "questions": [
     {
      "prompt": "'Purge the chamber with N2, then vent to atmosphere.' 올바른 순서 해석은?",
      "opts": [
       "먼저 대기압으로 벤트한 뒤 질소로 퍼지한다",
       "먼저 질소로 퍼지한 뒤 대기압으로 벤트한다",
       "퍼지와 벤트를 동시에 한다"
      ],
      "ans": 1
     },
     {
      "prompt": "화면에 'base pressure not reached'가 떴습니다. 지금 상황은?",
      "opts": [
       "목표 진공도에 아직 도달하지 못했다",
       "이미 진공이 완성되어 시작 가능하다",
       "가스 공급이 완료되었다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Vent to atmosphere'는 챔버를 어떤 상태로 만드는 것입니까?",
      "opts": [
       "더 높은 진공으로 배기한다",
       "대기압으로 되돌린다",
       "온도를 올린다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "제어·상태 용어 (3)",
    "intro": "시퀀스를 시작·정지시키고 상태를 판단할 때 읽는 단어입니다.",
    "items": [
     {
      "en": "start",
      "ko": "시작(시퀀스 개시)",
      "d": "준비 완료 후 운전 시퀀스를 순서대로 진행시키는 상위 명령",
      "ex": "Press START to begin the automatic sequence."
     },
     {
      "en": "stop",
      "ko": "정지",
      "d": "진행 중인 동작을 멈추는 명령(비상정지와는 구분)",
      "ex": "If the sequence stalls, press STOP and notify the engineer."
     },
     {
      "en": "ready",
      "ko": "준비 완료 상태",
      "d": "모든 조건이 충족되어 공정을 시작할 수 있는 상태",
      "ex": "Do not start until the READY indicator turns green."
     },
     {
      "en": "interlock",
      "ko": "인터록(안전 잠금)",
      "d": "안전 조건이 안 맞으면 동작을 강제로 막는 보호 장치",
      "ex": "The transfer valve is blocked by an interlock until base pressure is reached."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 문제 (3)",
    "intro": "상태 표시를 읽고 올바르게 판단하세요.",
    "questions": [
     {
      "prompt": "화면에 'READY' 초록불이 아직 켜지지 않았습니다. 올바른 행동은?",
      "opts": [
       "바로 START를 눌러 공정을 시작한다",
       "조건이 충족될 때까지 기다린 뒤 시작한다",
       "문을 열고 웨이퍼를 꺼낸다"
      ],
      "ans": 1
     },
     {
      "prompt": "'INTERLOCK ACTIVE' 메시지의 의미로 맞는 것은?",
      "opts": [
       "안전 조건 미충족으로 동작이 잠겨 있다",
       "정비가 완료되었다",
       "공정이 정상 종료되었다"
      ],
      "ans": 0
     },
     {
      "prompt": "매뉴얼의 'If the sequence stalls, press STOP.'는 언제 STOP을 누르라는 뜻입니까?",
      "opts": [
       "시퀀스가 멈추거나 진행되지 않을 때",
       "공정이 정상적으로 끝났을 때",
       "웨이퍼를 넣기 전에 항상"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "화면·계기 용어 (4)",
    "intro": "HMI 화면의 숫자·팝업·계기를 읽을 때 필요한 용어입니다.",
    "items": [
     {
      "en": "setpoint",
      "ko": "설정값(목표값)",
      "d": "장비가 도달해야 할 목표 압력·온도·유량 값",
      "ex": "The pressure setpoint is 5.0E-6 Torr."
     },
     {
      "en": "gauge",
      "ko": "게이지(계기)",
      "d": "압력 등을 측정해 숫자로 보여주는 계기",
      "ex": "Verify the gauge reads atmospheric pressure before opening the door."
     },
     {
      "en": "abort",
      "ko": "중단(강제 취소)",
      "d": "진행 중인 동작을 즉시 취소하는 것",
      "ex": "Press ABORT to cancel the current sequence."
     },
     {
      "en": "confirm",
      "ko": "확인(진행 승인)",
      "d": "팝업에서 동작을 계속할지 승인하는 것",
      "ex": "The screen asks: Confirm to continue? Press OK to proceed."
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "OPERATING PROCEDURE — STARTUP SEQUENCE",
    "paras": [
     "1. Load the wafer cassette onto the load port and confirm the carrier is properly seated.",
     "웨이퍼 카세트를 로드 포트에 올리고, 캐리어가 제대로 안착되었는지 확인하라. (load = 넣기, confirm = 확인)",
     "2. Press START to begin the automatic evacuation sequence.",
     "START를 눌러 자동 배기 시퀀스를 시작하라. (evacuation = pump down 과 동일)",
     "3. Pump down the load lock until the chamber reaches base pressure (< 5.0E-6 Torr).",
     "챔버가 base pressure(5.0×10⁻⁶ Torr 미만)에 도달할 때까지 로드락을 배기하라. 숫자가 목표값 아래로 내려가야 한다.",
     "4. Wait for the READY indicator to turn green before proceeding.",
     "다음 단계로 넘어가기 전에 READY 표시등이 초록으로 바뀔 때까지 기다려라. (READY = 시작 가능 상태)",
     "5. Do NOT open the transfer valve until base pressure is achieved.",
     "base pressure에 도달하기 전에는 트랜스퍼 밸브를 열지 마라. (Do NOT = 금지, 인터록으로 막힐 수 있음)"
    ]
   },
   {
    "type": "manual",
    "mtitle": "SHUTDOWN & VENT — NOTES AND WARNINGS",
    "paras": [
     "To unload the wafers, first purge the chamber with N2, then vent to atmosphere.",
     "웨이퍼를 꺼내려면, 먼저 질소(N2)로 챔버를 퍼지한 뒤 대기압으로 벤트하라. 순서를 지켜야 한다.",
     "NOTE: Purging replaces residual process gas with inert N2 before the chamber is vented.",
     "참고: 퍼지는 벤트 전에 잔류 공정 가스를 불활성 질소로 치환하는 과정이다. (NOTE = 참고 수준)",
     "WARNING: Never vent the chamber while the vacuum pump is still running.",
     "경고: 진공 펌프가 아직 돌고 있는 동안에는 절대로 챔버를 벤트하지 마라. 펌프 손상·역류 위험. (WARNING = 부상/손상 위험)",
     "CAUTION: Verify the gauge reads atmospheric pressure before opening the door.",
     "주의: 문을 열기 전에 게이지가 대기압을 가리키는지 확인하라. (CAUTION = 주의)",
     "If the sequence stalls or an alarm appears, press STOP and notify the shift engineer.",
     "시퀀스가 멈추거나 알람이 뜨면, STOP을 누르고 교대 엔지니어에게 알려라. (스스로 임의 조작하지 말 것)"
    ]
   },
   {
    "type": "sim",
    "which": "devicePanel",
    "intro": "아래 조작 패널(device panel) 시뮬레이터에서 실제 HMI처럼 버튼과 상태 표시를 조작해 보세요. START, PUMP, PURGE, VENT, STOP 버튼의 영어와 압력 숫자, READY 표시등을 함께 보면서 '지금 눌러도 되는 버튼은 무엇인지'를 판단하는 연습을 합니다. base pressure에 도달하기 전에는 다음 단계 버튼이 흐리게(비활성) 표시되는 것을 직접 확인하세요."
   },
   {
    "type": "sim",
    "which": "equipment",
    "intro": "아래 장비(equipment) 시뮬레이터에서 load → pump down → base pressure 도달 → READY → process → purge → vent → unload 의 전체 운전 절차를 순서대로 실행해 보세요. 각 단계에서 화면에 뜨는 영어 메시지(Pumping..., base pressure reached, Venting..., Door unlocked 등)를 읽고, 지금 장비가 시퀀스의 어느 단계에 있는지 스스로 말해 보는 것이 목표입니다."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "외국인 엔지니어가 챔버가 시작 가능한 진공에 도달했는지 묻는다.",
      "q": {
       "en": "Can you check if the chamber has reached base pressure yet?",
       "ko": "챔버가 base pressure에 도달했는지 확인해 줄래요?"
      },
      "a": {
       "en": "Not yet. The gauge still reads 2.0E-4 Torr, so it is still pumping down.",
       "ko": "아직요. 게이지가 아직 2.0×10⁻⁴ Torr를 가리켜서, 아직 배기 중입니다."
      }
     },
     {
      "sit": "엔지니어가 공정을 시작해도 되는지 확인한다.",
      "q": {
       "en": "Is the tool ready to start the process now?",
       "ko": "지금 장비가 공정을 시작할 준비가 됐나요?"
      },
      "a": {
       "en": "Yes. The READY lamp is green and base pressure is stable, so we can press START.",
       "ko": "네. READY 램프가 초록이고 base pressure도 안정적이라, START를 눌러도 됩니다."
      }
     },
     {
      "sit": "웨이퍼를 꺼내기 전, 벤트 절차를 확인한다.",
      "q": {
       "en": "Before we unload, did you purge the chamber first?",
       "ko": "언로드하기 전에, 챔버를 먼저 퍼지했나요?"
      },
      "a": {
       "en": "Yes, I purged with N2 first, then vented to atmosphere. The gauge now reads 760 Torr.",
       "ko": "네, 먼저 N2로 퍼지한 뒤 대기압으로 벤트했습니다. 지금 게이지는 760 Torr를 가리킵니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리 — 운전 절차 영어 읽기",
    "points": [
     "운전 시퀀스의 뼈대: **load → evacuate(pump down) → process → purge → vent → unload**. 각 단계는 영어 동사 하나로 표시된다.",
     "**pump down / evacuate**는 진공 만들기, **purge**는 질소 가스 치환, **vent**는 대기압 복귀. purge 먼저, vent 나중 순서를 지킨다.",
     "시작 판단 3요소: 숫자(**base pressure / setpoint**) + 상태표시(**READY / interlock**) + 버튼 활성 여부를 함께 읽는다.",
     "작업 지시문은 명령문이다. **Do not / Never**는 금지, **Verify / Ensure / Confirm**은 확인, **NOTE < CAUTION < WARNING < DANGER** 순으로 경고가 강해진다.",
     "화면 메시지 **base pressure not reached / INTERLOCK ACTIVE / Venting... / Door unlocked** 를 그대로 읽고 현재 상태를 판단하는 것이 현장 영어의 핵심이다."
    ],
    "done": "이제 여러분은 장비가 화면과 매뉴얼로 건네는 영어를 읽고, **START를 눌러도 되는지 스스로 판단**할 수 있습니다. 초록불이 켜지기 전에는 손대지 않는다 — 그 판단이 곧 안전입니다. **수고하셨습니다!**"
   }
  ]
 },
 {
  "id": "w4",
  "title": "진공·가스 로그",
  "slides": [
   {
    "type": "story",
    "icon": "🌀",
    "title": "새벽 3시, 챔버 압력이 흔들린다",
    "text": "야간 근무 중인 신입 기술자 민준. 담당하는 식각(etch) 장비의 HMI 화면에 노란 경고가 뜬다. **Chamber Pressure: 12.4 mTorr (SP 10.0)** 그리고 그 아래 **UNSTABLE**. 옆에는 가스 라인 로그가 흐른다. **Ar Flow: 48 sccm / SP 50 sccm — OUT OF RANGE**. 민준은 순간 얼어붙는다. 이 숫자들이 정상인지, 지금 라인을 멈춰야 하는지 판단해야 한다. 값을 '읽는' 것과 '정상/이상을 판단하는' 것은 다르다. 오늘 우리는 **vacuum & gas log**를 읽고, **set point**와 **actual value**의 차이를 해석하고, **stable/unstable**, **out of range** 같은 상태어를 근거로 정상과 이상을 가려내는 법을 배운다."
   },
   {
    "type": "read",
    "title": "왜 진공과 가스를 로그로 감시하는가",
    "intro": "반도체 공정은 대부분 저압(진공) 환경에서 진행되며, 압력과 유량이 결과를 결정합니다.",
    "paras": [
     "박막 증착(deposition)과 식각(etch)은 챔버 내부를 **vacuum** 상태로 만든 뒤 정해진 **process pressure**에서 진행됩니다. 압력이 조금만 달라져도 막의 두께·균일도(uniformity)가 흔들립니다.",
     "공정 가스는 정확한 비율과 양으로 들어가야 하므로 **MFC (Mass Flow Controller)**가 유량을 제어하고, 그 값이 로그에 **flow rate**로 기록됩니다.",
     "장비는 목표값인 **set point (SP)**와 실제 측정값인 **actual value (PV, process value)**를 나란히 보여줍니다. 두 값의 차이(**deviation**)가 정상 판단의 핵심 단서입니다.",
     "로그는 단순한 숫자 나열이 아니라 시간에 따른 **trend**입니다. 값이 **stable**하게 유지되는지, 아니면 **drift**하거나 **spike**가 있는지를 봐야 합니다.",
     "HMI/GUI 화면과 영문 매뉴얼은 이 상태를 영어 단어로 표시합니다: **STABLE / UNSTABLE / OUT OF RANGE / IN RANGE / OK / ALARM**. 이 단어를 못 읽으면 값을 봐도 판단할 수 없습니다."
    ]
   },
   {
    "type": "read",
    "title": "압력 단위와 유량 단위 읽기",
    "intro": "로그의 숫자는 반드시 단위와 함께 읽어야 의미가 생깁니다.",
    "paras": [
     "압력 단위 **Torr**와 **mTorr**: 1 Torr = 1000 mTorr입니다. 공정 압력은 보통 mTorr 단위이며, 예: **10 mTorr**는 0.010 Torr입니다. 단위를 착각하면 1000배 차이가 납니다.",
     "참고로 대기압은 약 **760 Torr**이고, 진공 공정은 그보다 훨씬 낮은 mTorr 영역에서 이뤄집니다. 낮을수록 '더 강한 진공(high vacuum)'입니다.",
     "유량 단위 **sccm (standard cubic centimeters per minute)**: 표준 조건에서 1분당 흘러가는 가스 부피입니다. 예: **Ar 50 sccm**은 아르곤이 분당 50 표준 cc로 흐른다는 뜻입니다.",
     "큰 유량은 **slm (standard liters per minute)**로도 표기됩니다. 1 slm = 1000 sccm. 로그에서 단위가 sccm인지 slm인지 먼저 확인하세요.",
     "로그에서 값과 단위, 그리고 SP/PV 위치를 함께 읽는 습관이 중요합니다. 예: **Pressure PV 9.8 mTorr / SP 10.0 mTorr** → 목표 10에 거의 도달, 정상 범위."
    ]
   },
   {
    "type": "read",
    "title": "정상과 이상, 무엇으로 판단하는가",
    "intro": "판단은 감이 아니라 로그가 주는 명시적 신호로 합니다.",
    "paras": [
     "**Set point vs actual value**: 실제값이 목표값 근처에서 허용 오차(**tolerance**) 안에 있으면 정상입니다. 예: SP 50 sccm, PV 49 sccm은 보통 정상, PV 30 sccm은 이상입니다.",
     "**Deviation(편차)**이 허용 범위를 넘으면 장비는 **OUT OF RANGE** 또는 **DEVIATION ALARM**을 띄웁니다. 이는 '값이 목표에서 너무 벗어났다'는 명확한 이상 신호입니다.",
     "**STABLE vs UNSTABLE**: 값이 시간에 따라 일정하면 stable, 위아래로 요동치면 unstable입니다. UNSTABLE은 누설(**leak**), MFC 이상, 밸브 문제의 초기 징후일 수 있습니다.",
     "**Warning vs Alarm**: 색으로도 구분됩니다. 보통 노랑=**warning**(주의), 빨강=**alarm/interlock**(즉시 조치·정지). 색과 단어를 함께 읽어야 대응 수준을 압니다.",
     "판단 순서: (1) 단위 확인 → (2) SP와 PV 비교 → (3) 상태어(STABLE/OUT OF RANGE 등) 확인 → (4) 색/알람 등급 확인. 이 순서를 지키면 새벽 3시에도 흔들리지 않습니다."
    ]
   },
   {
    "type": "read",
    "title": "로그를 시간 흐름으로 읽기 (trend)",
    "intro": "한 순간의 값보다 시간에 따른 변화가 이상을 더 빨리 알려줍니다.",
    "paras": [
     "로그에는 **timestamp**(시각)가 함께 찍힙니다. 예: **03:12:04 Pressure 10.1 mTorr STABLE**. 언제 이상이 시작됐는지 추적하려면 시각을 함께 봐야 합니다.",
     "**Ramp**: 값이 목표까지 서서히 올라가거나 내려가는 정상 구간입니다. 램프 중에는 SP와 PV가 다른 것이 정상일 수 있습니다.",
     "**Settling**: 값이 목표에 도달해 안정되는 과정입니다. settling이 끝나 **STABLE**이 되기 전에는 공정을 시작하지 않습니다.",
     "**Spike**와 **drift**는 다릅니다. spike는 순간 급등, drift는 서서히 벗어남입니다. 로그 트렌드를 보면 둘을 구분해 원인을 좁힐 수 있습니다.",
     "정상 로그는 SP 근처에서 PV가 평평하게 STABLE로 유지됩니다. 이상 로그는 편차 확대, UNSTABLE, OUT OF RANGE, 색 변화가 시간 순으로 나타납니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "진공·가스 로그 화면에서 자주 나오는 약어입니다.",
    "items": [
     {
      "ab": "SP",
      "full": "Set Point",
      "ko": "목표값 (설정값)"
     },
     {
      "ab": "PV",
      "full": "Process Value",
      "ko": "실제 측정값 (actual value)"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량 유량 제어기 (가스 유량 제어)"
     },
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeters per Minute",
      "ko": "표준 분당 세제곱센티미터 (유량 단위)"
     },
     {
      "ab": "slm",
      "full": "Standard Liters per Minute",
      "ko": "표준 분당 리터 (1 slm = 1000 sccm)"
     },
     {
      "ab": "OOR",
      "full": "Out Of Range",
      "ko": "허용 범위 벗어남 (이상)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1) — 값과 상태",
    "intro": "로그의 숫자와 상태를 읽는 데 꼭 필요한 용어입니다.",
    "items": [
     {
      "en": "set point",
      "ko": "설정값·목표값",
      "d": "장비가 도달하려는 목표 수치.",
      "ex": "The pressure set point for this recipe is 10 mTorr."
     },
     {
      "en": "actual value",
      "ko": "실제 측정값",
      "d": "센서가 지금 재고 있는 현재 값 (PV).",
      "ex": "The actual value is 9.8 mTorr, close to the set point."
     },
     {
      "en": "deviation",
      "ko": "편차",
      "d": "목표값과 실제값의 차이.",
      "ex": "A large deviation from the set point triggers an alarm."
     },
     {
      "en": "stable",
      "ko": "안정된",
      "d": "값이 시간에 따라 일정하게 유지되는 상태.",
      "ex": "The flow is stable at 50 sccm."
     },
     {
      "en": "unstable",
      "ko": "불안정한",
      "d": "값이 요동쳐 일정하지 않은 상태.",
      "ex": "The chamber pressure is unstable and keeps fluctuating."
     },
     {
      "en": "out of range",
      "ko": "범위 초과",
      "d": "허용 범위를 벗어난 이상 상태.",
      "ex": "Warning: gas flow is out of range."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "영어 로그 표현의 의미를 고르세요.",
    "questions": [
     {
      "prompt": "화면에 'Actual value: 9.8 mTorr (SP 10.0)'가 보입니다. 무슨 뜻인가요?",
      "opts": [
       "목표는 10.0 mTorr이고 지금 측정값은 9.8 mTorr로 거의 도달했다",
       "목표가 9.8 mTorr로 낮아졌다",
       "압력이 10배 초과되었다"
      ],
      "ans": 0
     },
     {
      "prompt": "'The flow is stable at 50 sccm.' 이 문장의 의미는?",
      "opts": [
       "유량이 50 sccm에서 안정적으로 유지되고 있다",
       "유량이 50 sccm에서 요동치고 있다",
       "유량을 50 sccm으로 올려야 한다"
      ],
      "ans": 0
     },
     {
      "prompt": "로그에 'OUT OF RANGE'가 표시되면?",
      "opts": [
       "값이 허용 범위를 벗어난 이상 상태",
       "값이 정상 범위 안에 있음",
       "장비가 꺼져 있음"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2) — 압력·유량·진공",
    "intro": "단위와 진공 관련 용어입니다.",
    "items": [
     {
      "en": "pressure",
      "ko": "압력",
      "d": "챔버 내부의 압력, 보통 Torr/mTorr로 표시.",
      "ex": "Chamber pressure dropped to 8 mTorr."
     },
     {
      "en": "flow rate",
      "ko": "유량",
      "d": "단위 시간당 흐르는 가스의 양, sccm/slm.",
      "ex": "Set the Ar flow rate to 50 sccm."
     },
     {
      "en": "vacuum",
      "ko": "진공",
      "d": "대기압보다 훨씬 낮은 저압 상태.",
      "ex": "Wait until the chamber reaches vacuum before starting."
     },
     {
      "en": "leak",
      "ko": "누설",
      "d": "밀폐가 깨져 공기가 새어 들어오는 현상.",
      "ex": "An unstable pressure may indicate a leak."
     },
     {
      "en": "tolerance",
      "ko": "허용 오차",
      "d": "정상으로 인정되는 편차의 한계.",
      "ex": "The flow is within tolerance of the set point."
     },
     {
      "en": "drift",
      "ko": "드리프트·서서히 변함",
      "d": "값이 시간에 따라 천천히 벗어나는 현상.",
      "ex": "The pressure reading shows a slow upward drift."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "intro": "단위와 판단을 확인하세요.",
    "questions": [
     {
      "prompt": "1 Torr는 몇 mTorr인가요?",
      "opts": [
       "1000 mTorr",
       "10 mTorr",
       "100 mTorr"
      ],
      "ans": 0
     },
     {
      "prompt": "'sccm'은 무엇을 나타내는 단위인가요?",
      "opts": [
       "가스 유량 (분당 표준 부피)",
       "압력",
       "온도"
      ],
      "ans": 0
     },
     {
      "prompt": "SP 50 sccm인데 PV가 30 sccm이고 'OUT OF RANGE' 경고가 떠 있습니다. 올바른 해석은?",
      "opts": [
       "실제 유량이 목표보다 크게 부족한 이상 상태",
       "유량이 목표보다 높은 정상 상태",
       "단위가 잘못 표시된 것일 뿐 정상"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3) — 경보와 조치",
    "intro": "이상 신호를 등급으로 구분하는 용어입니다.",
    "items": [
     {
      "en": "warning",
      "ko": "주의·경고",
      "d": "주의가 필요하나 즉시 정지는 아닌 상태 (보통 노랑).",
      "ex": "A warning appears when the value nears its limit."
     },
     {
      "en": "alarm",
      "ko": "경보",
      "d": "즉시 조치가 필요한 이상 상태 (보통 빨강).",
      "ex": "A pressure alarm stopped the process automatically."
     },
     {
      "en": "interlock",
      "ko": "인터록·안전 정지",
      "d": "위험 조건에서 장비를 자동으로 멈추는 안전 장치.",
      "ex": "The safety interlock shut down the chamber."
     },
     {
      "en": "in range",
      "ko": "범위 내",
      "d": "허용 범위 안에 있는 정상 상태.",
      "ex": "All gas flows are in range."
     },
     {
      "en": "spike",
      "ko": "스파이크·순간 급등",
      "d": "값이 순간적으로 크게 튀는 현상.",
      "ex": "A sudden pressure spike was logged at 03:12."
     },
     {
      "en": "base pressure",
      "ko": "기준 압력·도달 진공",
      "d": "공정 전 챔버가 도달해야 하는 낮은 초기 압력.",
      "ex": "Confirm the chamber has reached base pressure."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3)",
    "intro": "경보 등급과 상태어를 해석하세요.",
    "questions": [
     {
      "prompt": "화면이 빨간색으로 'ALARM'을 표시하고 있습니다. 노란색 'WARNING'과 비교하면?",
      "opts": [
       "ALARM은 즉시 조치·정지가 필요한 더 높은 등급이다",
       "ALARM은 WARNING보다 덜 위급하다",
       "둘은 완전히 같은 의미다"
      ],
      "ans": 0
     },
     {
      "prompt": "'All gas flows are in range.' 의 의미는?",
      "opts": [
       "모든 가스 유량이 정상 범위 안에 있다",
       "모든 가스 유량이 범위를 벗어났다",
       "가스 라인이 닫혀 있다"
      ],
      "ans": 0
     },
     {
      "prompt": "로그에 '03:12 Pressure spike 45 mTorr'가 찍혔습니다. 무슨 뜻인가요?",
      "opts": [
       "03시 12분에 압력이 순간적으로 45 mTorr까지 튀었다",
       "압력이 03시 12분부터 안정되었다",
       "목표 압력이 45 mTorr로 바뀌었다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "OPERATING PROCEDURE — VACUUM & GAS LOG CHECK",
    "paras": [
     "Before starting the process, confirm that the chamber pressure has reached the base pressure and reads STABLE.",
     "공정 시작 전, 챔버 압력이 기준 압력(base pressure)에 도달했고 STABLE로 표시되는지 확인하세요.",
     "Verify that each gas flow actual value is within tolerance of its set point.",
     "각 가스 유량의 실제값(PV)이 설정값(SP)의 허용 오차 안에 있는지 확인하세요.",
     "NOTE: A deviation greater than 10% of the set point will be logged as OUT OF RANGE.",
     "참고: 설정값의 10%를 초과하는 편차는 OUT OF RANGE로 기록됩니다.",
     "If the pressure reading is UNSTABLE for more than 30 seconds, do not start the recipe.",
     "압력이 30초 이상 UNSTABLE 상태이면 레시피를 시작하지 마세요.",
     "WARNING: A pressure alarm may indicate a leak. Notify the equipment engineer and do not override the interlock.",
     "경고: 압력 경보는 누설의 신호일 수 있습니다. 장비 엔지니어에게 알리고 인터록을 임의로 해제하지 마세요.",
     "Record the set point, actual value, and status for each line in the shift log.",
     "각 라인의 설정값, 실제값, 상태를 교대 로그(shift log)에 기록하세요."
    ]
   },
   {
    "type": "manual",
    "mtitle": "ALARM RESPONSE — GAS FLOW OUT OF RANGE",
    "paras": [
     "When a gas flow reads OUT OF RANGE, first check whether the value is above or below the set point.",
     "가스 유량이 OUT OF RANGE로 표시되면, 먼저 값이 설정값보다 높은지 낮은지 확인하세요.",
     "A reading far below the set point often means the gas line is starved or the MFC is faulty.",
     "설정값보다 크게 낮은 값은 가스 공급 부족 또는 MFC 고장을 의미하는 경우가 많습니다.",
     "Do NOT reset the alarm until the actual value returns to within tolerance.",
     "실제값이 허용 오차 안으로 돌아오기 전에는 경보를 리셋하지 마세요.",
     "If the value does not recover, place the tool on hold and escalate to the shift leader.",
     "값이 회복되지 않으면 장비를 홀드(hold) 상태로 두고 교대 책임자에게 보고하세요."
    ]
   },
   {
    "type": "sim",
    "which": "partDiagram",
    "intro": "아래 다이어그램은 진공·가스 라인의 구성을 보여줍니다. 챔버(chamber), 진공 펌프(pump), MFC(가스 유량 제어기), 압력 게이지(pressure gauge)가 어떻게 연결되어 압력과 유량이 로그로 기록되는지 각 부분의 영어 명칭을 짚어가며 확인해 보세요."
   },
   {
    "type": "sim",
    "which": "devicePanel",
    "intro": "아래는 HMI 상태 패널입니다. SP와 PV 값, 그리고 STABLE / UNSTABLE / OUT OF RANGE / IN RANGE 같은 상태 표시를 직접 읽어 보세요. 값과 상태어, 색(노랑=warning, 빨강=alarm)을 함께 보고 각 라인이 정상인지 이상인지 판단하는 연습을 하세요."
   },
   {
    "type": "sim",
    "which": "equipment",
    "intro": "아래 장비 시뮬레이터에서 압력과 가스 유량을 조절해 보세요. set point를 바꾸면 actual value가 어떻게 따라오는지, 편차가 커지면 언제 OUT OF RANGE와 알람이 뜨는지, 값이 요동칠 때 UNSTABLE 표시가 어떻게 나타나는지 직접 관찰하며 정상/이상 판단 기준을 몸에 익히세요."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "외국인 공정 엔지니어가 새벽 근무 중 로그 상태를 묻는다",
      "q": {
       "en": "The chamber pressure looks a bit off. What does the log say right now?",
       "ko": "챔버 압력이 좀 이상해 보여요. 지금 로그에 뭐라고 나와요?"
      },
      "a": {
       "en": "The pressure PV is 12.4 mTorr, but the set point is 10.0. It shows UNSTABLE.",
       "ko": "압력 실제값이 12.4 mTorr인데 설정값은 10.0이에요. UNSTABLE로 표시돼요."
      }
     },
     {
      "sit": "엔지니어가 가스 유량 상태를 확인한다",
      "q": {
       "en": "And the gas flows? Are they all within tolerance of their set points?",
       "ko": "가스 유량은요? 전부 설정값 허용 오차 안에 있나요?"
      },
      "a": {
       "en": "Ar is 48 sccm against a 50 sccm set point, and it is flagged OUT OF RANGE.",
       "ko": "아르곤이 설정값 50 sccm 대비 48 sccm이고, OUT OF RANGE로 표시돼 있어요."
      }
     },
     {
      "sit": "조치 방향을 정한다",
      "q": {
       "en": "Okay, do not start the recipe. Is there any red alarm or just a warning?",
       "ko": "알겠어요, 레시피 시작하지 마세요. 빨간 알람인가요, 아니면 경고뿐인가요?"
      },
      "a": {
       "en": "It is a yellow warning now, no interlock yet. I will hold the line and log the values.",
       "ko": "지금은 노란 경고이고 아직 인터록은 없어요. 라인을 대기시키고 값을 로그에 기록할게요."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "오늘의 정리",
    "points": [
     "진공·가스 로그는 **set point(SP)**와 **actual value(PV)**를 비교해 읽는다.",
     "압력 단위 **Torr / mTorr**(1 Torr = 1000 mTorr), 유량 단위 **sccm / slm**(1 slm = 1000 sccm)을 먼저 확인한다.",
     "상태어 **STABLE / UNSTABLE / IN RANGE / OUT OF RANGE**가 정상·이상 판단의 핵심 근거다.",
     "편차(**deviation**)가 허용 오차(**tolerance**)를 넘으면 이상이며, **warning(노랑)**과 **alarm(빨강)**으로 대응 등급이 나뉜다.",
     "판단 순서: 단위 → SP vs PV → 상태어 → 색/알람 등급."
    ],
    "done": "이제 새벽 3시에도 로그를 보고 **정상인지 이상인지 스스로 판단**할 수 있습니다. 수고했습니다!"
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (4) — 로그 화면 표현",
    "intro": "로그와 HMI 화면에서 바로 마주치는 추가 표현입니다.",
    "items": [
     {
      "en": "reading",
      "ko": "측정치·읽힌 값",
      "d": "센서가 표시하는 현재 수치.",
      "ex": "The gauge reading is 9.9 mTorr."
     },
     {
      "en": "fluctuate",
      "ko": "요동치다",
      "d": "값이 위아래로 계속 변하다.",
      "ex": "The pressure keeps fluctuating around the set point."
     },
     {
      "en": "hold",
      "ko": "홀드·대기",
      "d": "장비를 잠시 멈추고 대기시키는 상태.",
      "ex": "Place the tool on hold until the pressure recovers."
     },
     {
      "en": "recover",
      "ko": "회복하다",
      "d": "값이 다시 정상 범위로 돌아오다.",
      "ex": "Wait for the flow to recover to the set point."
     },
     {
      "en": "escalate",
      "ko": "상위 보고하다",
      "d": "해결되지 않은 문제를 책임자에게 알리다.",
      "ex": "Escalate to the shift leader if the alarm continues."
     }
    ]
   }
  ]
 },
 {
  "id": "w5",
  "title": "플라즈마 장비",
  "slides": [
   {
    "type": "story",
    "icon": "⚡",
    "title": "플라즈마가 켜지지 않는 새벽",
    "text": "새벽 3시, 식각(etch) 라인의 플라즈마 장비 앞에 선 지원이. 레시피를 시작했지만 웨이퍼 처리가 멈춰 있다. HMI 화면에는 **RF Power: 800 W** 라고 떠 있지만 그 아래 **Reflected: 210 W** 가 빨갛게 깜빡인다. 선배가 다가와 한마디 한다. \"**The plasma didn't ignite** — look at the **reflected power**, the **match** isn't tuned.\" 지원이는 이 문장을 읽고 무엇을 봐야 하는지 알아야 한다. 오늘 우리는 **RF power**, **forward/reflected power**, **matching network**, **impedance** 같은 화면 속 영어가 실제로 무엇을 뜻하는지, 그리고 반사파(reflected power) 값이 왜 중요한지를 읽고 판단하는 법을 배운다."
   },
   {
    "type": "read",
    "title": "플라즈마와 RF Power의 원리",
    "intro": "플라즈마 장비는 가스에 고주파 전력을 걸어 이온화된 상태(플라즈마)를 만든다. 화면의 영어를 읽으려면 먼저 무엇이 일어나는지 알아야 한다.",
    "paras": [
     "플라즈마는 챔버(chamber) 안의 가스에 강한 전기 에너지를 가해 전자와 이온으로 쪼개진 상태다. 이 에너지를 공급하는 것이 **RF power (Radio Frequency power)** 이며, 보통 **13.56 MHz** 같은 고주파를 사용한다.",
     "화면에서 **RF Power** 또는 **Forward Power** 는 장비가 챔버 쪽으로 내보내는 전력(W, watt)을 뜻한다. 예를 들어 **Forward Power: 800 W** 는 발생기(generator)가 800와트를 밀어내고 있다는 의미다.",
     "전력이 실제로 플라즈마에 전달되어야 식각이나 증착 반응이 일어난다. 즉 **RF power** 는 단순한 숫자가 아니라 공정 반응의 세기를 결정하는 핵심 파라미터다.",
     "화면에서 자주 보이는 **RF ON / RF OFF** 는 고주파 전력의 인가 여부를 나타낸다. **RF ON** 상태에서 값이 정상 범위여야 정상 처리 중이라는 뜻이다.",
     "전력이 너무 낮으면 플라즈마가 **ignite**(점화)되지 않고, 너무 높으면 웨이퍼 손상이나 아크(arc)가 발생할 수 있어 항상 화면 값을 레시피(recipe) 설정값과 비교해 읽는다."
    ]
   },
   {
    "type": "read",
    "title": "Forward Power와 Reflected Power",
    "intro": "현장에서 가장 중요한 판단은 '나간 전력'과 '되돌아온 전력'을 구분해 읽는 것이다. 반사파의 의미가 이 슬라이드의 핵심이다.",
    "paras": [
     "**Forward Power** 는 발생기에서 챔버(부하) 쪽으로 나가는 전력이고, **Reflected Power** 는 부하에 흡수되지 못하고 발생기 쪽으로 되돌아온 전력이다. 화면에는 보통 두 값이 나란히 표시된다.",
     "이상적인 상태에서는 **Reflected Power ≈ 0 W** 여야 한다. 나간 전력이 전부 플라즈마에 전달됐다는 뜻이기 때문이다. 반사파가 크면 그만큼 전력이 낭비되고 공정이 불안정해진다.",
     "실제로 전달된 전력은 **Delivered Power = Forward − Reflected** 로 계산된다. 화면에 **Fwd 800 W / Ref 200 W** 라면 실제 플라즈마에 들어간 전력은 약 600 W다.",
     "**Reflected Power** 가 높다는 것은 **impedance mismatch**(임피던스 부정합)를 의미한다. 즉 발생기와 챔버의 전기적 조건이 맞지 않아 전력이 튕겨 나오는 상태다.",
     "높은 반사파는 발생기 자체를 손상시킬 수 있어 장비는 **High Reflected Power** 알람을 띄우고 스스로 **RF OFF** 될 수 있다. 그래서 화면의 **Reflected** 값이 빨갛게 뜨면 즉시 확인해야 한다.",
     "현장 판단 규칙: **Forward** 는 목표값 근처, **Reflected** 는 가능한 한 0에 가깝게 — 이 두 조건이 동시에 맞아야 '정상'이라고 읽는다."
    ]
   },
   {
    "type": "read",
    "title": "Matching Network와 Impedance",
    "intro": "반사파를 0으로 만드는 장치가 매칭 네트워크다. 임피던스라는 개념을 알면 화면의 tune 값들이 읽힌다.",
    "paras": [
     "**Impedance** 는 고주파 전력에 대한 회로의 '저항 성분'으로, 단위는 옴(Ω)이다. RF 발생기는 보통 **50 Ω** 로 설계되어 있고, 플라즈마 챔버의 임피던스는 공정 조건에 따라 계속 변한다.",
     "발생기의 50 Ω 과 챔버의 임피던스가 다르면 전력이 반사된다. 이 둘을 맞춰 주는 장치가 **matching network** (또는 **matchbox**, **matching unit**)다.",
     "매칭 네트워크 안에는 값을 조절하는 두 개의 가변 커패시터(variable capacitor)가 있고, 화면에는 보통 **Load** 와 **Tune** 두 위치 값이 % 또는 스텝(step)으로 표시된다.",
     "장비가 이 커패시터를 자동으로 움직여 반사파를 최소로 만드는 동작을 **auto tune** 또는 **impedance matching** 이라 한다. 화면의 **Tuning...** 표시는 지금 매칭을 맞추는 중이라는 뜻이다.",
     "**Match Position: Load 45% / Tune 62%** 같은 값이 매번 크게 튀거나 한쪽 끝(0% 또는 100%)에 붙어 있으면 매칭이 제대로 잡히지 못한 상태(**match at limit**)로, 반사파가 높게 남는다.",
     "즉 **matching network** 의 역할은 한 줄로: '챔버 임피던스를 50 Ω 으로 맞춰 **reflected power** 를 0에 가깝게 만든다'이다."
    ]
   },
   {
    "type": "read",
    "title": "Ignite와 Tune: 플라즈마 켜는 순서",
    "intro": "실제 절차에서 쓰이는 동사들 — ignite, strike, tune, stabilize — 를 순서로 이해하면 매뉴얼과 알람이 그대로 읽힌다.",
    "paras": [
     "**ignite the plasma** (또는 **strike the plasma**)는 '플라즈마를 점화한다'는 뜻으로, 가스를 넣고 RF 전력을 인가해 처음 방전을 일으키는 단계다. 화면에 **Plasma ON / Plasma detected** 가 뜨면 점화 성공이다.",
     "점화 직후에는 임피던스가 급격히 변하므로 반사파가 잠깐 튄다. 이때 **matching network** 가 **tune**(맞춤) 동작을 하며 반사파를 끌어내린다. 화면 순서는 대개 **RF ON → Igniting → Tuning → Stable** 이다.",
     "**tune** 은 '반사파가 최소가 되도록 매칭 값을 조정한다'는 뜻이다. **stabilize** 는 값이 안정되어 공정이 정상 진행되는 상태를 가리킨다.",
     "점화가 실패하면 **Failed to ignite** / **No plasma** 알람이 뜬다. 원인은 가스 유량 부족, 압력(pressure) 이상, 전력 부족, 매칭 불량 등이며 화면의 다른 값들과 함께 읽어 원인을 좁힌다.",
     "정상 사이클을 영어 흐름으로 외워 두면 좋다: **Set gas flow → Set pressure → RF ON → Ignite → Auto tune → Reflected drops to ~0 → Stable → Process runs.**",
     "현장에서 '**tune 이 안 잡힌다**'는 말은 곧 '반사파가 안 떨어진다', 즉 매칭 문제라는 뜻으로 통용된다."
    ]
   },
   {
    "type": "read",
    "title": "HMI 화면 값 읽는 법",
    "intro": "이론을 실제 화면에 대입해 보자. 같은 화면이라도 어떤 값을 짝지어 읽느냐가 판단을 좌우한다.",
    "paras": [
     "화면 값은 항상 짝으로 읽는다: **Forward** 는 **Reflected** 와 함께, **Setpoint(SP)** 는 **Process Value(PV)** 와 함께. 예: **RF SP 1000 W / PV 995 W** 면 목표와 실제가 거의 같아 정상이다.",
     "**SP (Setpoint)** 는 우리가 설정한 목표값, **PV / Actual** 는 지금 측정되는 실제값이다. 둘의 차이가 크면 장비가 목표를 못 따라가고 있다는 신호다.",
     "색과 상태 텍스트도 정보다. **Reflected** 값이 초록/흰색이면 정상, 빨강 + **HIGH** 면 경고. **Match: AUTO** 는 자동 조정, **Match: MANUAL / HOLD** 는 수동 고정 상태를 뜻한다.",
     "단위를 반드시 확인한다: 전력은 **W (watt)**, 임피던스는 **Ω (ohm)**, 매칭 위치는 **% 또는 step**, 주파수는 **MHz**. 단위를 놓치면 값의 크기를 오판한다.",
     "정상 판단 체크: (1) **Forward ≈ Setpoint**, (2) **Reflected ≈ 0**, (3) **Match** 값이 양 끝단에 붙어 있지 않음, (4) 상태 텍스트가 **Stable / RUN**. 이 네 가지가 맞으면 '읽어서 정상'이라고 보고할 수 있다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "플라즈마 장비 화면과 매뉴얼에 반복되는 약어들이다. 뜻을 알면 화면이 문장으로 읽힌다.",
    "items": [
     {
      "ab": "RF",
      "full": "Radio Frequency",
      "ko": "고주파 — 플라즈마를 만드는 전력의 주파수"
     },
     {
      "ab": "Fwd",
      "full": "Forward Power",
      "ko": "발생기가 챔버로 내보내는 전력"
     },
     {
      "ab": "Ref",
      "full": "Reflected Power",
      "ko": "부하에서 되돌아온 전력(반사파)"
     },
     {
      "ab": "W",
      "full": "Watt",
      "ko": "전력의 단위"
     },
     {
      "ab": "SP",
      "full": "Setpoint",
      "ko": "설정 목표값"
     },
     {
      "ab": "PV",
      "full": "Process Value",
      "ko": "현재 측정 실제값"
     },
     {
      "ab": "MHz",
      "full": "Megahertz",
      "ko": "주파수 단위 (예: 13.56 MHz)"
     },
     {
      "ab": "VSWR",
      "full": "Voltage Standing Wave Ratio",
      "ko": "정재파비 — 정합 상태를 나타내는 값"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 1 — 전력",
    "intro": "전력과 관련된 화면 용어. 각 예문은 실제 화면/보고에서 쓰이는 형태다.",
    "items": [
     {
      "en": "RF power",
      "ko": "고주파 전력",
      "d": "플라즈마를 발생·유지시키는 고주파 전기 에너지.",
      "ex": "Set the RF power to 1000 watts before igniting the plasma."
     },
     {
      "en": "forward power",
      "ko": "전진(순방향) 전력",
      "d": "발생기에서 챔버 쪽으로 나가는 전력.",
      "ex": "The forward power is holding steady at its setpoint."
     },
     {
      "en": "reflected power",
      "ko": "반사 전력(반사파)",
      "d": "부하에 흡수되지 못하고 되돌아온 전력.",
      "ex": "Reflected power is above 200 W, so the match is not tuned."
     },
     {
      "en": "delivered power",
      "ko": "전달 전력",
      "d": "실제로 플라즈마에 전달된 전력 (forward − reflected).",
      "ex": "Delivered power dropped because reflected power went up."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 1",
    "intro": "화면 문장을 읽고 뜻을 고르시오.",
    "questions": [
     {
      "prompt": "\"Reflected power is above 200 W.\" 이 화면 메시지의 의미는?",
      "opts": [
       "전력이 정상적으로 플라즈마에 전달되고 있다",
       "전력의 상당 부분이 되돌아오고 있어 정합이 안 맞는 상태다",
       "발생기가 200 W만 출력하도록 설정되었다"
      ],
      "ans": 1
     },
     {
      "prompt": "\"Delivered power = Forward − Reflected\" 라는 식에서, Forward 800 W, Reflected 200 W 일 때 실제 전달 전력은?",
      "opts": [
       "약 600 W",
       "약 1000 W",
       "약 200 W"
      ],
      "ans": 0
     },
     {
      "prompt": "정상 상태에서 화면의 Reflected Power 값은 어떠해야 하는가?",
      "opts": [
       "Forward Power와 같아야 한다",
       "가능한 한 0 W에 가까워야 한다",
       "항상 높을수록 좋다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 2 — 정합과 임피던스",
    "intro": "매칭 네트워크와 임피던스 관련 용어. 화면의 Tune/Load 값과 연결해 이해하자.",
    "items": [
     {
      "en": "matching network",
      "ko": "정합 회로",
      "d": "챔버 임피던스를 발생기(50 Ω)에 맞춰 반사파를 줄이는 장치.",
      "ex": "The matching network moves the capacitors to minimize reflected power."
     },
     {
      "en": "impedance",
      "ko": "임피던스",
      "d": "고주파에 대한 회로의 저항 성분(Ω).",
      "ex": "The chamber impedance changes as the plasma conditions change."
     },
     {
      "en": "impedance mismatch",
      "ko": "임피던스 부정합",
      "d": "발생기와 부하의 임피던스가 달라 전력이 반사되는 상태.",
      "ex": "An impedance mismatch causes high reflected power."
     },
     {
      "en": "auto tune",
      "ko": "자동 정합",
      "d": "장비가 매칭 값을 스스로 조정해 반사파를 최소화하는 동작.",
      "ex": "Leave the match in auto tune so it corrects the reflected power automatically."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 2",
    "intro": "용어의 의미를 판단하시오.",
    "questions": [
     {
      "prompt": "\"matching network\"의 주된 역할은 무엇인가?",
      "opts": [
       "가스 유량을 조절한다",
       "임피던스를 맞춰 반사파를 최소로 만든다",
       "웨이퍼 온도를 낮춘다"
      ],
      "ans": 1
     },
     {
      "prompt": "\"An impedance mismatch causes high reflected power.\" 문장이 뜻하는 인과관계는?",
      "opts": [
       "임피던스가 안 맞으면 반사파가 높아진다",
       "반사파가 높으면 전력이 자동으로 꺼진다",
       "임피던스가 맞으면 플라즈마가 꺼진다"
      ],
      "ans": 0
     },
     {
      "prompt": "화면에 \"Match: AUTO\"라고 떠 있다면?",
      "opts": [
       "매칭을 수동으로 고정한 상태다",
       "장비가 매칭 값을 스스로 조정 중인 상태다",
       "매칭 회로가 고장 난 상태다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 3 — 점화 동작",
    "intro": "플라즈마를 켜고 안정화하는 절차 동사들. 매뉴얼 명령문에 그대로 등장한다.",
    "items": [
     {
      "en": "ignite (the plasma)",
      "ko": "점화하다",
      "d": "가스에 RF를 걸어 플라즈마 방전을 처음 일으키다.",
      "ex": "The system will ignite the plasma once the pressure is stable."
     },
     {
      "en": "strike",
      "ko": "(플라즈마를) 발생시키다",
      "d": "ignite와 같은 의미로 최초 방전을 일으키다.",
      "ex": "The plasma failed to strike, so check the gas flow."
     },
     {
      "en": "tune",
      "ko": "정합을 맞추다",
      "d": "반사파가 최소가 되도록 매칭을 조정하다.",
      "ex": "Wait for the match to tune before starting the process."
     },
     {
      "en": "stabilize",
      "ko": "안정화되다",
      "d": "전력·반사파 값이 안정되어 공정이 정상 진행되다.",
      "ex": "Once the readings stabilize, the recipe step will proceed."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 3",
    "intro": "절차 문장을 읽고 뜻을 고르시오.",
    "questions": [
     {
      "prompt": "\"The plasma failed to strike.\" 화면 알람의 의미는?",
      "opts": [
       "플라즈마가 점화되지 않았다",
       "플라즈마가 너무 강하게 켜졌다",
       "웨이퍼가 파손되었다"
      ],
      "ans": 0
     },
     {
      "prompt": "\"Wait for the match to tune before starting the process.\" 이 지시가 요구하는 행동은?",
      "opts": [
       "즉시 공정을 시작하라",
       "매칭이 정합을 맞출 때까지 기다린 뒤 공정을 시작하라",
       "매칭을 수동으로 꺼라"
      ],
      "ans": 1
     },
     {
      "prompt": "정상 점화 순서로 알맞은 것은?",
      "opts": [
       "RF ON → Ignite → Auto tune → Stable",
       "Stable → RF OFF → Ignite → Tune",
       "Reflected HIGH → Ignite → RF OFF"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 4 — 화면 상태",
    "intro": "화면 값을 짝지어 읽을 때 필요한 상태·단위 용어.",
    "items": [
     {
      "en": "setpoint",
      "ko": "설정값",
      "d": "장비에 설정한 목표 파라미터 값.",
      "ex": "The forward power reached its setpoint of 1000 W."
     },
     {
      "en": "process value",
      "ko": "실제값",
      "d": "현재 측정되는 실제 파라미터 값.",
      "ex": "The process value is close to the setpoint, so it is normal."
     },
     {
      "en": "VSWR",
      "ko": "정재파비",
      "d": "정합 정도를 나타내는 비율, 1.0에 가까울수록 좋다.",
      "ex": "A VSWR near 1.0 means almost no reflected power."
     },
     {
      "en": "match at limit",
      "ko": "정합 한계 도달",
      "d": "매칭 커패시터가 끝단에 붙어 더 조정할 수 없는 상태.",
      "ex": "The match is at limit, so it cannot reduce the reflected power."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 4",
    "intro": "화면 값 판단.",
    "questions": [
     {
      "prompt": "\"RF SP 1000 W / PV 995 W\" 를 어떻게 읽어야 하는가?",
      "opts": [
       "목표 1000 W에 실제 995 W로 거의 일치 — 정상",
       "목표와 실제가 크게 달라 이상",
       "발생기가 고장 나 값이 뜨지 않음"
      ],
      "ans": 0
     },
     {
      "prompt": "\"The match is at limit\" 상태가 문제인 이유는?",
      "opts": [
       "매칭이 더 조정할 수 없어 반사파를 못 줄인다",
       "매칭이 완벽하게 맞았다는 뜻이다",
       "전력이 자동으로 올라간다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "OPERATING PROCEDURE — PLASMA IGNITION",
    "paras": [
     "1. Confirm that the process gas flow and chamber pressure have reached their setpoints before applying RF power.",
     "1. RF 전력을 인가하기 전에 공정 가스 유량과 챔버 압력이 설정값에 도달했는지 확인한다.",
     "2. Turn RF power ON and allow the system to ignite the plasma automatically.",
     "2. RF 전력을 ON 하고 시스템이 자동으로 플라즈마를 점화하도록 둔다.",
     "3. Keep the matching network in AUTO mode so it can tune and minimize reflected power.",
     "3. 매칭 네트워크를 AUTO 모드로 유지하여 정합을 맞추고 반사파를 최소화하게 한다.",
     "4. Verify that reflected power drops to nearly 0 W and the readings stabilize.",
     "4. 반사파가 거의 0 W까지 떨어지고 값들이 안정화되는지 확인한다.",
     "5. If the plasma fails to ignite, do NOT increase the RF power repeatedly; check gas flow, pressure, and the match position first.",
     "5. 플라즈마가 점화되지 않으면 RF 전력을 반복해서 올리지 말고, 먼저 가스 유량·압력·매칭 위치를 점검한다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "WARNING — HIGH REFLECTED POWER",
    "paras": [
     "WARNING: Sustained high reflected power can damage the RF generator and its output components.",
     "경고: 반사파가 높은 상태가 지속되면 RF 발생기와 출력 부품이 손상될 수 있다.",
     "If the reflected power exceeds the alarm limit, the generator will automatically turn RF OFF to protect itself.",
     "반사파가 알람 한계를 초과하면 발생기는 자기 보호를 위해 자동으로 RF를 OFF 한다.",
     "NOTE: A reflected power alarm usually indicates an impedance mismatch or a match unit stuck at limit.",
     "참고: 반사파 알람은 대개 임피던스 부정합 또는 매칭 유닛이 한계에 걸린 상태를 나타낸다.",
     "Do not restart the RF power until the cause of the mismatch has been identified and cleared.",
     "부정합의 원인을 확인하고 해소하기 전에는 RF 전력을 다시 켜지 않는다."
    ]
   },
   {
    "type": "sim",
    "which": "chamber",
    "intro": "아래 챔버 시뮬레이터에서 가스와 압력을 설정한 뒤 RF를 인가해 플라즈마가 점화되는 과정을 관찰하세요. 화면의 Forward / Reflected 값이 어떻게 변하는지, 그리고 언제 'Stable' 상태가 되는지 눈으로 확인하는 것이 목표입니다."
   },
   {
    "type": "sim",
    "which": "devicePanel",
    "intro": "이 장치 패널에서 RF Power의 Setpoint와 Process Value, 그리고 Reflected Power 값을 직접 읽어 보세요. Reflected 값이 빨갛게 변할 때 무엇이 '정상'이고 무엇이 '경고'인지 판단하는 연습입니다. 값의 단위(W)도 함께 확인하세요."
   },
   {
    "type": "sim",
    "which": "equipment",
    "intro": "장비 전체 화면에서 매칭 네트워크(Match: AUTO)의 Load / Tune 위치 값을 관찰하세요. Auto tune이 동작하면서 Reflected가 0에 가까워지는 흐름과, 매칭이 한계(at limit)에 걸렸을 때 반사파가 남는 상황을 비교해 읽어 보세요."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "새벽 교대, 외국인 엔지니어가 반사파 알람을 함께 보며 묻는다.",
      "q": {
       "en": "The reflected power is over 200 watts. Can you read me the forward power and the match position?",
       "ko": "반사파가 200와트를 넘었어요. 전진 전력과 매칭 위치 값을 읽어 줄래요?"
      },
      "a": {
       "en": "Forward is 800 watts, and the match shows Load 12 percent, Tune 98 percent — it looks like it's at limit.",
       "ko": "전진 전력은 800와트이고, 매칭은 Load 12%, Tune 98%입니다 — 한계에 걸린 것 같아요."
      }
     },
     {
      "sit": "엔지니어가 원인을 좁히려 한다.",
      "q": {
       "en": "So the plasma ignited but the match can't tune it. Did the chamber pressure reach its setpoint?",
       "ko": "그럼 플라즈마는 점화됐는데 매칭이 못 맞추는 거네요. 챔버 압력은 설정값에 도달했나요?"
      },
      "a": {
       "en": "The pressure setpoint is 50 millitorr, but the process value is only 30 — it hasn't reached the setpoint.",
       "ko": "압력 설정값은 50밀리토르인데 실제값은 30뿐입니다 — 설정값에 도달하지 못했어요."
      }
     },
     {
      "sit": "조치를 결정한다.",
      "q": {
       "en": "Good catch. Turn RF off first, then let the pressure stabilize before we ignite again.",
       "ko": "잘 봤어요. 먼저 RF를 끄고, 다시 점화하기 전에 압력을 안정화시킵시다."
      },
      "a": {
       "en": "Understood. I'll turn RF off now and wait for the pressure to reach setpoint before igniting.",
       "ko": "알겠습니다. 지금 RF를 끄고 압력이 설정값에 도달할 때까지 기다린 뒤 점화하겠습니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "**RF power (Forward Power)** 는 발생기가 챔버로 내보내는 전력, **Reflected Power** 는 되돌아온 전력이며 정상에서는 0에 가까워야 한다.",
     "실제 전달 전력은 **Delivered = Forward − Reflected** — 반사파가 크면 전력이 낭비되고 발생기가 손상될 수 있다.",
     "**Matching network** 는 챔버 **impedance** 를 50 Ω에 맞춰 반사파를 줄인다. **Match: AUTO**, **auto tune**, **at limit** 을 읽을 수 있어야 한다.",
     "점화 흐름: **RF ON → Ignite → Tune → Reflected ≈ 0 → Stable**. **Failed to ignite / High reflected** 알람은 가스·압력·매칭부터 점검한다.",
     "화면은 항상 짝으로 읽는다: **SP vs PV**, **Forward vs Reflected**, 그리고 단위(**W, Ω, MHz, %**)를 확인한다."
    ],
    "done": "이제 플라즈마 장비 화면에서 **반사파(reflected power)** 의 의미를 읽고 정상/경고를 스스로 판단할 수 있습니다. **잘 하셨습니다!**"
   }
  ]
 },
 {
  "id": "w6",
  "title": "알람과 조치",
  "slides": [
   {
    "type": "story",
    "icon": "🚨",
    "title": "빨간 램프가 켜졌다",
    "text": "새벽 3시, 식각(etch) 장비의 타워 램프가 초록에서 빨강으로 바뀌고 로봇이 멈춘다. HMI 화면에는 붉은 글씨로 **ALARM: RF POWER FAILURE — Reflected power exceeded limit**이 떠 있다. 신입 기술자 지훈은 반사적으로 **RESET** 버튼에 손을 뻗었지만, 사수가 말린다. \"먼저 읽어. **alarm**인지 **warning**인지, **interlock**이 걸린 건지부터 봐야 해.\" 화면 아래에는 작은 글씨로 **INTERLOCK ACTIVE — Chamber door open**도 함께 떠 있었다. 만약 지훈이 그냥 리셋을 눌렀다면, 도어가 열린 채로 공정이 재개되어 위험한 상황이 벌어졌을 것이다. 이 장에서 우리는 화면과 매뉴얼에 뜨는 영어 알람 문장을 **읽고**, 무엇을 **먼저** 할지 **판단**하는 법을 배운다. 현장에서 영어는 쓰는 것이 아니라 정확히 읽고 조치를 결정하는 도구다."
   },
   {
    "type": "read",
    "title": "알람이란 무엇인가 — 장비가 보내는 신호",
    "intro": "알람은 장비가 \"정상 범위를 벗어났다\"고 사람에게 알리는 표준화된 메시지다.",
    "paras": [
     "**Alarm(알람)**은 공정 값이나 장비 상태가 미리 정해진 허용 범위(limit)를 벗어났을 때 자동으로 발생한다. 대부분의 장비는 알람이 뜨는 순간 공정을 **stop(정지)**하거나 **hold(대기)** 상태로 전환한다.",
     "화면에서 알람은 보통 **빨간색(red)** 텍스트와 타워 램프로 표시되고, 각 알람에는 고유한 **alarm code(알람 코드)**와 한 줄짜리 영어 **message(메시지)**가 붙는다. 예: **ALM-1203: Chamber pressure out of range**.",
     "알람은 원인과 시간이 기록되는 **alarm log / alarm history(알람 이력)**에 남는다. 기술자는 코드와 발생 시각(**timestamp**)을 읽어 나중에 엔지니어에게 정확히 보고할 수 있어야 한다.",
     "중요한 점: 알람 메시지는 \"무엇이 잘못됐는지\"를 알려줄 뿐, \"눌러도 되는지\"를 말해주지 않는다. 그래서 기술자의 **판단(judgement)**이 필요하다 — 읽고, 종류를 구분하고, 안전 조건을 확인한 뒤 조치한다.",
     "알람의 심각도는 색과 단어로 구분된다. **information / warning / alarm / critical(interlock)** 순으로 위험도가 올라가며, 단어 하나가 \"지금 멈춰라\"인지 \"곧 문제될 수 있다\"인지를 결정한다."
    ]
   },
   {
    "type": "read",
    "title": "Alarm vs Warning vs Interlock — 세 단어의 차이",
    "intro": "가장 먼저 구분해야 할 세 단어. 이 구분이 조치의 순서를 결정한다.",
    "paras": [
     "**Warning(경고)**는 아직 공정을 멈추지는 않지만 \"이대로 가면 곧 알람\"이라는 예고다. 예: **WARNING: Chamber temperature approaching upper limit**. 보통 노란색(yellow)으로 표시되며, 기술자는 상황을 관찰하고 원인을 미리 조치할 수 있다.",
     "**Alarm(알람)**은 실제로 한계를 벗어나 공정이 정지된 상태다. 예: **ALARM: Gas flow below setpoint**. 원인을 확인하고 조치한 뒤 **reset**해야 재개할 수 있다.",
     "**Interlock(인터록)**은 안전/설비 보호를 위한 강제 잠금이다. 도어 열림, 압력 이상, EMO 눌림 같은 **안전 조건(safety condition)**이 만족되지 않으면 장비가 절대 동작하지 못하게 막는다. 예: **INTERLOCK: Chamber door open**.",
     "핵심 차이: 일반 알람은 원인을 없애면 리셋되지만, **인터록은 안전 조건 자체를 물리적으로 해소하기 전에는 절대 리셋되지 않으며, 억지로 리셋하려 해서는 안 된다.** 화면의 **INTERLOCK ACTIVE**는 \"사람이 다칠 수 있다\"는 최고 우선순위 신호다.",
     "따라서 여러 메시지가 동시에 뜨면 읽는 순서는 항상 **interlock → alarm → warning**이다. 가장 위험한 것부터 읽고, 안전 조건을 먼저 확인한다."
    ]
   },
   {
    "type": "read",
    "title": "Timeout · Failure · Abort — 실패의 종류를 읽기",
    "intro": "알람 문장에 자주 등장하는 세 가지 실패 유형. 원인이 다르면 조치도 다르다.",
    "paras": [
     "**Timeout(타임아웃)**은 어떤 단계가 정해진 시간 안에 완료되지 않았을 때 발생한다. 예: **TIMEOUT: Vacuum not reached within 120 s**. 이는 밸브, 펌프, 누설(leak) 등 \"완료를 막는 원인\"이 있음을 뜻하므로, 단순 리셋이 아니라 원인 점검이 필요하다.",
     "**Failure / Fault(실패·고장)**는 부품이나 신호 자체가 정상 응답을 하지 못한 상태다. 예: **RF POWER FAILURE**, **PUMP FAULT**. 하드웨어 문제일 가능성이 높아 대개 엔지니어 호출 대상이다.",
     "**Abort(중단)**는 진행 중이던 공정이나 동작이 도중에 강제로 취소된 것이다. 예: **PROCESS ABORTED by interlock**. \"누가/무엇이\" 중단시켰는지(by ~)를 읽는 것이 원인 파악의 핵심이다.",
     "이 단어들은 종종 한 문장에 겹쳐 나온다. 예: **Step aborted due to pump-down timeout** — \"펌프다운 타임아웃 때문에 스텝이 중단됨\". 각 단어를 분해해 읽으면 원인 사슬(cause chain)이 보인다.",
     "판단 요령: **timeout**은 대기·재시도로 회복될 때가 있지만, **failure/fault**는 하드웨어 조치가 필요하고, **abort**는 무엇이 트리거(trigger)했는지를 먼저 찾아야 한다. 문장의 동사와 명사를 정확히 읽는 것이 곧 조치의 방향이다."
    ]
   },
   {
    "type": "read",
    "title": "Reset · Recovery — 되돌리기 전에 확인할 것",
    "intro": "알람을 지우고 장비를 정상으로 되돌리는 절차. 순서를 지키지 않으면 위험하다.",
    "paras": [
     "**Acknowledge(ACK, 확인)**는 \"이 알람을 봤다\"고 시스템에 알리는 첫 동작이다. ACK를 눌러도 원인이 사라지는 것은 아니며, 단지 알람음/깜빡임을 멈추고 이력에 확인 시각을 남긴다.",
     "**Reset(리셋)**은 알람 상태를 해제하고 장비를 **IDLE/READY** 상태로 되돌리는 동작이다. 반드시 **원인을 해소(clear the cause)한 뒤에만** 눌러야 한다. 원인이 남은 채 리셋하면 같은 알람이 즉시 다시 뜨거나, 인터록이라면 위험을 초래한다.",
     "**Recovery(복구)**는 정지 지점에서 공정을 안전하게 재개하거나 초기 상태로 되돌리는 전체 과정을 말한다. 화면의 **Recovery** 메뉴는 보통 단계별(step-by-step) 안내를 제공한다.",
     "표준 순서는 대개 이렇다: (1) 메시지 **읽기(read)** → (2) 안전/인터록 조건 **확인(verify)** → (3) 원인 **조치(clear)** → (4) **ACK** → (5) **RESET** → (6) 상태가 **READY**인지 **확인** → (7) 재개(resume) 또는 엔지니어 보고.",
     "**Override(강제 해제)**는 인터록이나 안전 조건을 사람이 임의로 무시하는 기능으로, 권한이 있는 엔지니어만 사용해야 한다. 매뉴얼에 **Do NOT override**라고 적혀 있으면 절대 눌러서는 안 된다."
    ]
   },
   {
    "type": "read",
    "title": "화면(HMI)에서 알람 읽기 — 어디를 보나",
    "intro": "실제 장비 GUI에서 알람 정보는 정해진 위치와 형식으로 표시된다.",
    "paras": [
     "**Status bar(상태 표시줄)**: 화면 상단 또는 하단에 장비 상태가 영어 한 단어로 뜬다 — **RUN / IDLE / READY / HOLD / DOWN / ALARM**. 이 단어만 봐도 지금 장비가 돌 수 있는지 없는지를 알 수 있다.",
     "**Alarm banner(알람 배너)**: 붉은 띠에 **code + message + timestamp**가 표시된다. 형식은 보통 **[ALM-1203] 03:14:07 Chamber pressure out of range**처럼 코드-시각-문장 순이다.",
     "**Active vs History(현재 vs 이력)**: **Active alarms**는 아직 해소되지 않아 지금 조치가 필요한 알람이고, **Alarm history**는 지나간 기록이다. 조치할 때는 반드시 **Active** 목록을 먼저 본다.",
     "**Severity color(심각도 색)**: 대부분 빨강=alarm/critical, 노랑=warning, 파랑/회색=information. 색과 단어를 함께 읽어 우선순위를 정한다.",
     "**Help / Guidance 링크**: 알람을 누르면 **Probable cause(추정 원인)**와 **Recommended action(권장 조치)** 영어 설명이 나오는 장비가 많다. 이 두 항목을 읽는 습관이 오조작을 막는다.",
     "정리하면, 기술자는 화면에서 항상 이 순서로 눈을 움직인다: 상태 단어 → 인터록 여부 → 알람 코드/문장 → 추정 원인 → 권장 조치. 읽는 순서가 곧 안전이다."
    ]
   },
   {
    "type": "read",
    "title": "알람은 '문장'이 아니라 '상태 조각'이다",
    "intro": "실제 알람 배너는 예의 바른 문장이 아니라, 원인·상태를 압축한 짧은 조각이다. 이 형태에 익숙해져야 빨리 판단한다.",
    "paras": [
     "실제 배너 예시: **Interlock not satisfied**(인터록 조건 미충족), **Chamber pressure out of spec**(챔버 압력 규격 이탈), **Reflected power high — Process abort**(반사파 높음 → 공정 중단), **Water flow low — Warning**(냉각수 유량 낮음, 경고).",
     "알람에는 **심각도 등급**이 붙는다(SECS/GEM 표준). **personal safety**(인명 안전) > **equipment safety**(장비 안전) > **parameter control**(공정 파라미터) > **others**. 등급 단어를 먼저 보고 긴장도를 정한다.",
     "색으로도 등급을 준다. 보통 **Blue = Warning**(주의), **Red = Process abort / Fault**(중단·고장). 색과 텍스트를 함께 읽는다.",
     "알람을 지우는 동작도 딱딱한 동사다: **Accept / Acknowledge**(확인해 로그에 남김), **Silence**(경보음만 끔), **Reset**(원인 해소 후 해제). 'Acknowledge'는 문제 해결이 아니라 그냥 '봤음'이다.",
     "핵심: 알람을 완전문장으로 기대하지 말고 **[대상] + [상태/문제] + [조치]** 조각으로 끊어 읽어라. 예: **APC valve / stuck / abort**."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "알람 화면과 매뉴얼에서 반복적으로 만나는 핵심 약어들이다.",
    "items": [
     {
      "ab": "ALM",
      "full": "Alarm",
      "ko": "알람 — 정상 범위를 벗어나 발생하는 경보"
     },
     {
      "ab": "WARN",
      "full": "Warning",
      "ko": "경고 — 아직 정지 전이지만 주의가 필요한 상태"
     },
     {
      "ab": "INTLK",
      "full": "Interlock",
      "ko": "인터록 — 안전 조건 미충족 시 강제 잠금"
     },
     {
      "ab": "EMO",
      "full": "Emergency Off",
      "ko": "비상 정지 — 눌리면 즉시 전원/동작 차단"
     },
     {
      "ab": "ACK",
      "full": "Acknowledge",
      "ko": "알람 확인 — \"봤음\"을 시스템에 등록"
     },
     {
      "ab": "RST",
      "full": "Reset",
      "ko": "리셋 — 원인 해소 후 알람 상태 해제"
     },
     {
      "ab": "FDC",
      "full": "Fault Detection and Classification",
      "ko": "이상 감지·분류 시스템 — 실패 원인을 자동 분류"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 어휘 (1) — 알람의 상태어",
    "intro": "알람 문장의 뼈대가 되는 상태·심각도 단어들이다.",
    "items": [
     {
      "en": "Alarm",
      "ko": "알람, 경보",
      "d": "허용 범위를 벗어나 발생하며 보통 장비를 정지시키는 경보",
      "ex": "An alarm was triggered when the chamber pressure exceeded the limit."
     },
     {
      "en": "Warning",
      "ko": "경고",
      "d": "정지 전 단계로, 곧 문제가 될 수 있음을 미리 알리는 신호",
      "ex": "The screen shows a warning that the gas supply is running low."
     },
     {
      "en": "Interlock",
      "ko": "인터록, 안전 잠금",
      "d": "안전 조건이 만족되지 않으면 동작을 강제로 막는 보호 기능",
      "ex": "The interlock will not release until the chamber door is closed."
     },
     {
      "en": "Fault",
      "ko": "고장, 이상",
      "d": "부품이나 신호가 정상 응답을 하지 못하는 상태",
      "ex": "A pump fault stopped the tool during pump-down."
     },
     {
      "en": "Abort",
      "ko": "중단, 강제 취소",
      "d": "진행 중이던 동작이나 공정이 도중에 취소되는 것",
      "ex": "The process was aborted by the safety interlock."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "다음 영어 표현의 의미를 고르시오.",
    "questions": [
     {
      "prompt": "화면에 'INTERLOCK: Chamber door open'이 떠 있다. 무슨 뜻인가?",
      "opts": [
       "챔버 도어가 열려 있어 안전 잠금이 걸렸다 — 도어를 닫기 전에는 동작하지 않는다",
       "챔버 도어를 열라는 작업 지시다",
       "도어 센서를 교체할 시간이라는 정기 점검 알림이다"
      ],
      "ans": 0
     },
     {
      "prompt": "'The process was aborted by the safety interlock.'의 의미는?",
      "opts": [
       "공정이 정상적으로 완료되었다",
       "안전 인터록에 의해 공정이 도중에 강제 취소되었다",
       "공정을 다시 시작하라는 뜻이다"
      ],
      "ans": 1
     },
     {
      "prompt": "노란색 'WARNING: Gas supply running low'가 뜬 상태다. 지금 상황은?",
      "opts": [
       "장비가 이미 정지되어 즉시 리셋해야 한다",
       "정지는 아니지만 가스가 부족해지고 있어 곧 알람이 될 수 있다",
       "가스 공급이 완전히 차단되어 위험하다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 어휘 (2) — 조치 동작어",
    "intro": "알람에 대응할 때 버튼과 매뉴얼에 등장하는 동사들이다.",
    "items": [
     {
      "en": "Reset",
      "ko": "리셋, 초기화",
      "d": "원인을 해소한 뒤 알람 상태를 해제하고 장비를 대기로 되돌림",
      "ex": "Do not press reset until the root cause has been cleared."
     },
     {
      "en": "Acknowledge (ACK)",
      "ko": "확인 처리",
      "d": "알람을 봤다고 시스템에 등록해 경보음/깜빡임을 멈춤",
      "ex": "Press ACK to acknowledge the alarm before resetting the tool."
     },
     {
      "en": "Clear",
      "ko": "해소하다, 지우다",
      "d": "알람의 원인을 없애거나 메시지를 제거하는 것",
      "ex": "Clear the blockage in the exhaust line, then reset the alarm."
     },
     {
      "en": "Recover / Recovery",
      "ko": "복구(하다)",
      "d": "정지된 장비를 안전하게 정상 상태로 되돌리는 과정",
      "ex": "Follow the recovery steps shown on the HMI to return the tool to idle."
     },
     {
      "en": "Override",
      "ko": "강제 해제, 무시",
      "d": "안전 조건이나 인터록을 사람이 임의로 무시하는 기능(권한 필요)",
      "ex": "Never override an active interlock without engineer approval."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "intro": "다음 매뉴얼 문장을 읽고 올바른 조치를 고르시오.",
    "questions": [
     {
      "prompt": "매뉴얼: 'Do NOT press RESET until the root cause has been identified and cleared.' 올바른 행동은?",
      "opts": [
       "알람이 뜨면 즉시 리셋부터 누른다",
       "원인을 찾아 해소한 뒤에만 리셋을 누른다",
       "리셋 버튼을 절대 사용하지 않는다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Press ACK to acknowledge the alarm.'에서 ACK를 누르면 일어나는 일은?",
      "opts": [
       "알람 원인이 자동으로 제거된다",
       "알람을 확인 처리하여 경보음/깜빡임을 멈추지만 원인은 그대로다",
       "장비가 즉시 공정을 재개한다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Never override an active interlock without engineer approval.'의 뜻은?",
      "opts": [
       "인터록은 언제든 자유롭게 강제 해제해도 된다",
       "엔지니어 승인 없이는 작동 중인 인터록을 강제 해제하지 말라",
       "인터록이 뜨면 즉시 엔지니어가 리셋한다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 어휘 (3) — 원인과 현상어",
    "intro": "알람 문장에서 \"왜 발생했는가\"를 설명하는 단어들이다.",
    "items": [
     {
      "en": "Timeout",
      "ko": "시간 초과",
      "d": "정해진 시간 안에 단계가 완료되지 않아 발생하는 알람",
      "ex": "A timeout alarm means the step did not finish within the allowed time."
     },
     {
      "en": "Sensor",
      "ko": "센서",
      "d": "온도·압력·유량 등을 측정해 알람 판단의 근거가 되는 소자",
      "ex": "The pressure sensor reading dropped below the setpoint."
     },
     {
      "en": "Threshold / Limit",
      "ko": "임계값, 한계",
      "d": "이 값을 넘으면 알람이 발생하는 기준선",
      "ex": "Reflected power exceeded the threshold and triggered the alarm."
     },
     {
      "en": "Trip",
      "ko": "차단 동작, 트립",
      "d": "보호 장치가 작동해 전원이나 동작을 끊는 것",
      "ex": "The high-temperature trip shut down the heater automatically."
     },
     {
      "en": "Latch",
      "ko": "래치, 상태 유지",
      "d": "리셋 전까지 알람 상태가 그대로 유지되도록 붙잡아 두는 것",
      "ex": "The alarm is latched, so it stays active until you reset it manually."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3)",
    "intro": "다음 알람 문장의 의미를 정확히 해석하시오.",
    "questions": [
     {
      "prompt": "'TIMEOUT: Vacuum not reached within 120 s'의 의미는?",
      "opts": [
       "120초 안에 진공에 도달하지 못해 시간 초과 알람이 발생했다",
       "진공이 120초 동안 정상 유지되었다",
       "120초 후 자동으로 공정이 완료된다"
      ],
      "ans": 0
     },
     {
      "prompt": "'The alarm is latched.'가 뜻하는 바는?",
      "opts": [
       "알람이 잠시 후 자동으로 사라진다",
       "수동으로 리셋하기 전까지 알람 상태가 계속 유지된다",
       "알람이 이미 해제되었다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Reflected power exceeded the threshold.'에서 무슨 일이 일어났나?",
      "opts": [
       "반사 전력이 기준 한계값을 넘었다",
       "반사 전력이 정상 범위 안에 들어왔다",
       "전력 센서를 교체해야 한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 어휘 (4) — 실제 알람 배너 표현(청크)",
    "intro": "낱단어가 아니라, 배너에 그대로 뜨는 '덩어리 표현(청크)'으로 익히자.",
    "items": [
     {
      "en": "out of spec (OOS)",
      "ko": "규격 이탈",
      "d": "값이 허용 범위를 벗어남.",
      "ex": "Chamber pressure is out of spec."
     },
     {
      "en": "interlock not satisfied",
      "ko": "인터록 미충족",
      "d": "안전 조건이 안 맞아 동작이 막힘.",
      "ex": "The tool won't start: interlock not satisfied."
     },
     {
      "en": "reflected power high",
      "ko": "반사파 높음",
      "d": "매칭 불량으로 RF가 되돌아옴 → 흔히 abort.",
      "ex": "Reflected power high — check the matching network."
     },
     {
      "en": "process abort",
      "ko": "공정 중단",
      "d": "심각 알람으로 공정을 즉시 멈춤.",
      "ex": "Reflected power high triggered a process abort."
     },
     {
      "en": "water flow low",
      "ko": "냉각수 유량 낮음",
      "d": "냉각 부족 경고. 보통 Warning 등급.",
      "ex": "Water flow low — do not ignite the plasma."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "종합 판단 퀴즈",
    "intro": "여러 메시지가 동시에 떴을 때 '무엇을 먼저' 할지 판단하시오.",
    "questions": [
     {
      "prompt": "화면에 'INTERLOCK: Chamber door open'과 'ALARM: RF power failure'가 동시에 떠 있다. 가장 먼저 할 일은?",
      "opts": [
       "바로 RESET을 눌러 둘 다 지운다",
       "인터록부터 확인해 도어를 닫는 등 안전 조건을 먼저 해소한다",
       "RF 파워 케이블을 즉시 교체한다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Step aborted due to pump-down timeout'을 읽었다. 원인 사슬로 옳은 것은?",
      "opts": [
       "펌프다운이 시간 초과되어 그 결과 스텝이 중단되었다",
       "스텝을 일부러 중단시켜 펌프를 껐다",
       "타임아웃이 스텝 완료를 알리는 정상 신호다"
      ],
      "ans": 0
     },
     {
      "prompt": "조치 후 재개 전, 상태 표시줄에서 반드시 확인해야 할 단어는?",
      "opts": [
       "상태가 READY(또는 IDLE)인지 확인한다",
       "상태가 ALARM인 채로 바로 RUN 시킨다",
       "상태 단어는 무시하고 로트를 투입한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "ALARM RESPONSE PROCEDURE",
    "paras": [
     "When an alarm is triggered, the equipment stops automatically and the alarm lamp turns red.",
     "알람이 발생하면 장비는 자동으로 정지하고 타워 램프가 빨간색으로 바뀐다. 이때 당황하지 말고 화면을 먼저 읽는다.",
     "Read the alarm code and message on the HMI before taking any action.",
     "어떤 조치를 하기 전에 반드시 HMI에 표시된 알람 코드와 메시지를 먼저 읽는다. 읽는 것이 첫 번째 조치다.",
     "Check whether an interlock is active. If so, resolve the safety condition first.",
     "인터록이 활성 상태인지 확인한다. 활성이라면 도어 닫기 등 안전 조건을 가장 먼저 해소한다.",
     "Do NOT press RESET until the root cause has been identified and cleared.",
     "근본 원인을 찾아 해소하기 전에는 RESET을 누르지 않는다. 원인이 남아 있으면 같은 알람이 다시 발생한다.",
     "WARNING: Resetting an active interlock may cause serious injury or equipment damage.",
     "경고: 활성 상태의 인터록을 강제로 리셋하면 중대한 부상이나 장비 손상을 일으킬 수 있다.",
     "If the alarm cannot be cleared, record the alarm code and contact the equipment engineer.",
     "알람이 해소되지 않으면 알람 코드를 기록하고 장비 엔지니어에게 연락한다. 임의 판단으로 계속 시도하지 않는다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "INTERLOCK CLEAR & RECOVERY",
    "paras": [
     "An interlock prevents the process from starting while a safety condition is not satisfied.",
     "인터록은 안전 조건이 만족되지 않는 동안 공정이 시작되지 못하도록 막는다. 이는 오작동이 아니라 정상적인 보호 동작이다.",
     "Verify that all doors are closed and the chamber pressure is within range before clearing the interlock.",
     "인터록을 해제하기 전에 모든 도어가 닫혀 있고 챔버 압력이 정상 범위 안에 있는지 확인한다.",
     "Press ACK to acknowledge the alarm, then press RESET to return the tool to IDLE.",
     "ACK를 눌러 알람을 확인 처리한 뒤, RESET을 눌러 장비를 IDLE 상태로 되돌린다. 순서를 지킨다.",
     "NOTE: A timeout alarm indicates that a step did not complete within the allowed time.",
     "참고: 타임아웃 알람은 어떤 스텝이 허용 시간 안에 완료되지 못했음을 뜻한다. 밸브·펌프·누설 여부를 점검한다.",
     "After recovery, confirm that the tool status shows READY before resuming the lot.",
     "복구 후에는 로트를 재개하기 전에 장비 상태가 READY로 표시되는지 확인한다. 상태 확인 없이 재개하지 않는다."
    ]
   },
   {
    "type": "sim",
    "which": "devicePanel",
    "intro": "아래 장치 패널에서 상태 표시줄의 영어 단어(RUN / IDLE / READY / HOLD / ALARM 등)와 램프 색을 관찰하세요. 지금 장비가 동작 가능한 상태인지, 정지 상태인지를 화면 단어만 보고 판단하는 연습입니다."
   },
   {
    "type": "sim",
    "which": "alarm",
    "intro": "알람 시뮬레이터입니다. 알람 코드와 영어 메시지를 읽고, interlock인지 timeout인지 failure인지 종류를 먼저 구분한 뒤, ACK → 원인 확인 → RESET의 순서로 조치해 보세요. 원인을 해소하지 않고 RESET을 누르면 어떻게 되는지도 확인하세요."
   },
   {
    "type": "sim",
    "which": "equipment",
    "intro": "장비 전체 화면 시뮬레이터입니다. 인터록과 알람이 동시에 뜬 상황에서 무엇을 먼저 처리해야 하는지(interlock → alarm → warning 순) 판단하고, 복구 후 상태가 READY로 돌아오는지 끝까지 확인하세요."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "야간 근무 중 식각 장비에 알람이 떠서 외국인 엔지니어에게 상황을 전화로 확인한다.",
      "q": {
       "en": "What does the alarm say on the screen right now?",
       "ko": "지금 화면에 알람이 뭐라고 떠 있나요?"
      },
      "a": {
       "en": "It shows ALM-1203, RF power failure, and there is also an active interlock: chamber door open.",
       "ko": "ALM-1203, RF 파워 페일러가 떠 있고, 인터록도 활성입니다 — 챔버 도어 열림입니다."
      }
     },
     {
      "sit": "엔지니어가 조치 순서를 지시한다.",
      "q": {
       "en": "Okay, do not reset yet. Close the door first and tell me the tool status.",
       "ko": "알겠어요, 아직 리셋하지 마세요. 도어부터 닫고 장비 상태를 알려주세요."
      },
      "a": {
       "en": "The door is closed now and the interlock is cleared. The status changed to IDLE.",
       "ko": "도어를 닫았고 인터록이 해제됐습니다. 상태가 IDLE로 바뀌었어요."
      }
     },
     {
      "sit": "RF 실패 알람이 리셋되지 않아 보고한다.",
      "q": {
       "en": "Try to acknowledge and reset. Does the RF alarm clear?",
       "ko": "확인 처리하고 리셋해 보세요. RF 알람이 지워지나요?"
      },
      "a": {
       "en": "No, the RF power failure is still latched after reset. I recorded the code; please check the hardware.",
       "ko": "아니요, 리셋 후에도 RF 파워 페일러가 계속 래치돼 있습니다. 코드는 기록해 뒀으니 하드웨어를 확인해 주세요."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리 — 읽고, 구분하고, 판단하라",
    "points": [
     "알람은 항상 **읽는 것**이 첫 조치다: 코드 → 메시지 → 추정 원인 → 권장 조치 순으로 화면을 본다.",
     "**Warning**은 예고, **Alarm**은 정지, **Interlock**은 안전 잠금 — 단어 하나가 위험도와 조치 순서를 결정한다.",
     "여러 메시지가 겹치면 언제나 **interlock → alarm → warning** 순으로, 안전 조건을 가장 먼저 해소한다.",
     "**Timeout / Failure(Fault) / Abort**를 구분해 원인 사슬을 읽고, **원인을 해소한 뒤에만 ACK → RESET**한다.",
     "복구 후에는 상태 표시줄이 **READY / IDLE**인지 확인하고 재개하며, 해소되지 않으면 코드를 기록해 엔지니어에게 보고한다."
    ],
    "done": "이제 여러분은 영어 알람 문장을 읽고 **무엇을 먼저 할지 스스로 판단**할 수 있습니다. 현장에서 빨간 램프가 켜져도, 손이 아니라 **눈**이 먼저 움직이세요. **Read first, then act.**"
   }
  ]
 },
 {
  "id": "w7",
  "title": "유지보수(PM)",
  "slides": [
   {
    "type": "story",
    "icon": "🔧",
    "title": "정비의 아침: 오늘 이 장비는 'DOWN'이다",
    "text": "야간 근무를 마친 지훈은 교대 전 HMI 화면에서 붉은 글씨를 본다. **PM DUE** — 오늘 이 식각(etch) 장비의 예방 정비(**Preventive Maintenance**) 기한이다. 화면 하단에는 상태가 **TOOL DOWN**으로 바뀌어 있고, 옆에는 **Work Order #4471**이 떠 있다. 선임 기술자가 태블릿을 건네며 말한다. \"Follow the **PM checklist**. **Inspect** the O-ring, **clean** the chamber wall, **replace** the pump oil, and **calibrate** the MFC.\" 지훈이 받은 체크리스트는 전부 영어 명령문이다. **Inspect / Clean / Replace / Calibrate / Tighten / Lubricate** — 이 여섯 개의 동사가 오늘 하루를 지배할 것이다. 그는 먼저 **LOTO**(잠금·표찰)를 걸어 장비의 위험 에너지를 차단한다. 챔버를 열자 **O-ring**에 미세한 균열이 보인다. 체크리스트에는 이렇게 적혀 있다: *Replace the O-ring if any damage is found.* 지훈은 새 O-ring에 **vacuum grease**를 얇게 바르고(lubricate), 볼트를 **star pattern**으로 규정 토크에 맞춰 조인다(tighten). 정비의 핵심은 손재주가 아니라 **영어 지시문을 정확히 읽고 판단하는 능력**이다. 한 줄을 잘못 읽으면 진공 누설(**vacuum leak**)로 이어진다."
   },
   {
    "type": "read",
    "title": "예방 정비(PM)란 무엇이며, 왜 영어로 되어 있는가",
    "intro": "PM은 '고장 난 뒤 고치는' 것이 아니라 '고장 나기 전에 정기적으로 손보는' 정비입니다. 반도체 팹의 장비 대부분은 해외 제조사(Applied Materials, Lam, TEL 등) 제품이므로, PM 문서와 화면 텍스트는 거의 전부 영어입니다.",
    "paras": [
     "**Preventive Maintenance (PM)** 는 정해진 주기마다 부품을 점검·청소·교체하여 예기치 못한 고장(**unplanned downtime**)을 막는 정비입니다. 반대 개념은 고장 후 수리하는 **Corrective Maintenance(사후 정비)** 입니다.",
     "PM은 주기(**interval**)로 관리됩니다. 화면에는 상태가 **PM DUE**(기한 도래), **OVERDUE**(기한 초과), **DONE**(완료)로 표시됩니다. **OVERDUE**가 뜨면 그 장비는 규정상 가동을 멈추고 **TOOL DOWN** 상태가 됩니다.",
     "실제 작업은 **PM checklist(정비 체크리스트)** 로 진행됩니다. 각 줄은 **Inspect / Clean / Replace / Calibrate / Tighten / Lubricate** 같은 명령형 동사로 시작하고, 기술자는 각 항목을 **Pass / Fail** 로 표시합니다.",
     "대부분의 팹은 **CMMS(Computerized Maintenance Management System)** 로 정비 이력을 관리합니다. 기술자는 측정값을 **CMMS log**에 기록하고, 끝나면 **Work Order(작업 지시서)** 를 닫습니다(*close the work order*).",
     "PM의 목적은 단순 청소가 아니라 **공정 안정성** 유지입니다. 챔버 벽의 폴리머, 열화된 O-ring, 오염된 펌프 오일은 모두 **파티클 증가·진공 누설·유량 오차**로 이어져 웨이퍼 수율을 떨어뜨립니다.",
     "즉 이 수업의 핵심은 도구 설계가 아니라 **영어 체크리스트와 HMI 문구를 정확히 읽고, 합격/불합격을 판단하는 것**입니다."
    ]
   },
   {
    "type": "read",
    "title": "체크리스트 6대 동사: 무엇을 하라는 명령인가",
    "intro": "PM 체크리스트의 모든 줄은 동사로 시작합니다. 이 여섯 개 동사의 뜻을 헷갈리면 엉뚱한 작업을 하게 됩니다. 각 동사가 실제로 어떤 물리적 행동을 지시하는지 정리합니다.",
    "paras": [
     "**Inspect (점검하다)** — 부품을 눈·손·계측기로 확인합니다. 예: *Inspect the O-ring for cracks and particles.* '교체'가 아니라 '상태 확인'입니다. 이상이 없으면 다음 단계로 넘어갑니다.",
     "**Clean (청소하다)** — 오염물·폴리머·파티클을 제거합니다. 예: *Clean the chamber wall with IPA-dampened wipes.* 보통 **lint-free wipe(보풀 없는 와이프)** 와 **IPA(이소프로필알코올)** 를 사용합니다.",
     "**Replace (교체하다)** — 소모품이나 손상 부품을 새것으로 바꿉니다. 예: *Replace the pump oil.* **Clean(청소)** 과 혼동하면 안 됩니다 — Replace는 반드시 새 부품으로 바꾸라는 뜻입니다.",
     "**Calibrate (교정하다)** — 계측기의 값을 기준기에 맞춰 보정합니다. 예: *Calibrate the MFC against the reference flow meter.* 흔히 **zero(영점)** 를 먼저 맞춥니다.",
     "**Tighten (조이다)** — 볼트·피팅을 규정 토크로 조입니다. 예: *Tighten the bolts to 8 N·m in a star pattern.* 너무 세게 조이면(**over-tighten**) 세라믹 부품이 깨질 수 있습니다.",
     "**Lubricate (윤활하다)** — O-ring이나 이동 부위에 그리스를 얇게 바릅니다. 예: *Lightly lubricate the new O-ring with vacuum grease.* '얇게(lightly)'가 핵심 — 과도하면 오히려 파티클 원인이 됩니다."
    ]
   },
   {
    "type": "read",
    "title": "PM 대상 부품과 소모품: O-ring, pump oil, chamber wall, MFC/gauge",
    "intro": "체크리스트에 반복해서 등장하는 네 가지 핵심 부품·소모품입니다. 각각이 왜 정비 대상인지, 문제가 생기면 무슨 증상이 나타나는지 이해하면 영어 문장의 뜻이 명확해집니다.",
    "paras": [
     "**O-ring(오링)** — 챔버 뚜껑·플랜지의 진공 실링(seal)입니다. 균열·변형·이물질이 있으면 **vacuum leak(진공 누설)** 이 생겨 **base pressure(도달 진공도)** 가 올라갑니다. PM 때 **inspect → (손상 시) replace → lubricate** 순서로 다룹니다.",
     "**Pump oil(펌프 오일)** — 러핑 펌프(rough/roughing pump)의 윤활·밀봉 오일입니다. 색이 어두워지거나 **sight glass(점검창)** 의 **MIN line** 아래로 내려가면 교체합니다. 예: *Replace the pump oil when it turns dark.*",
     "**Chamber wall(챔버 벽)** — 공정 중 폴리머·부산물이 쌓입니다. 방치하면 벗겨져 파티클(particle)이 됩니다. **wet clean(습식 세정)** 이나 와이프로 제거합니다. 예: *Remove polymer buildup from the chamber wall.*",
     "**MFC (Mass Flow Controller, 질량유량제어기)** — 공정 가스 유량을 **sccm** 단위로 제어합니다. 오차가 커지면 공정이 틀어지므로 정기적으로 **calibrate** 합니다. 화면에 *setpoint 50 / actual 0 sccm* 처럼 표시됩니다.",
     "**Gauge(진공 게이지)** — 챔버 압력을 측정합니다(예: Pirani, 이온 게이지). **zero(영점)** 확인과 **base pressure** 검증이 PM 항목에 포함됩니다. 예: *Check the gauge zero.*",
     "핵심: 이 네 부품은 서로 연결되어 있습니다 — O-ring 누설이나 게이지 오차는 결국 **진공 불량**으로, MFC 오차는 **유량 불량**으로, 챔버 벽 오염은 **파티클 불량**으로 나타납니다."
    ]
   },
   {
    "type": "read",
    "title": "측정과 규격 판단: torque, leak rate, base pressure, out of spec",
    "intro": "PM은 단순 작업이 아니라 '측정하고 규격(spec)과 비교해 합격/불합격을 판단'하는 일입니다. 영어 화면·체크리스트에 나오는 수치와 판정 문구를 읽는 법입니다.",
    "paras": [
     "**Torque spec(토크 규격)** — 볼트를 조이는 힘의 규정값입니다. 단위는 **N·m(뉴턴미터)**. 예: *Tighten to 8 N·m.* 규격보다 세게 조이면 부품 손상, 약하게 조이면 누설이 생깁니다. 보통 **star pattern(별 모양 순서)** 으로 균일하게 조입니다.",
     "**Leak check / leak rate(누설 검사 / 누설률)** — 진공 밀봉이 제대로 됐는지 확인합니다. 흔히 **helium leak check(헬륨 누설 검사)** 를 하며, **leak rate**가 규격보다 크면 실링(O-ring) 재점검이 필요합니다.",
     "**Base pressure(도달 진공도)** — 가스를 넣지 않은 상태에서 도달하는 최저 압력입니다. 단위는 **mTorr / Torr**. 예: *Verify base pressure reaches 5 mTorr.* 값이 규격보다 높으면 누설·오염을 의심합니다.",
     "**Setpoint vs Actual(설정값 대 실제값)** — HMI에서 유량·온도·압력은 목표(setpoint)와 실제(actual)가 나란히 표시됩니다. 예: *MFC1 flow 0 sccm (setpoint 50)* → 설정은 50인데 실제 0이므로 **가스가 흐르지 않는 이상 상태**입니다.",
     "**판정 문구** — 각 항목 결과는 **Pass / Fail**, **OK / NG(No Good)**, 또는 **In Spec / Out of Spec** 로 표시됩니다. **Out of Spec** 은 '규격을 벗어남 — 조치 필요'라는 뜻입니다.",
     "따라서 좋은 기술자는 '값을 읽는 것'을 넘어, 그 값이 **limit(한계)** 안에 있는지 즉시 판단합니다. 예: *Base pressure 12 mTorr (limit 5 mTorr)* → 한계 초과, 불합격."
    ]
   },
   {
    "type": "read",
    "title": "HMI·체크리스트 화면 영어 읽기: 상태·단위·기록",
    "intro": "정비 중에는 종이 체크리스트뿐 아니라 장비 HMI(터치스크린) 문구도 읽어야 합니다. 자주 나오는 상태 표시, 단위, 기록 관련 표현을 정리합니다.",
    "paras": [
     "**상태(status) 표시** — **TOOL UP**(가동 가능) / **TOOL DOWN**(가동 중지) / **PM DUE**(정비 기한) / **OVERDUE**(기한 초과) / **IN PROGRESS**(작업 중) / **DONE**(완료). 붉은색은 대개 이상·중지를 의미합니다.",
     "**단위(units)** — 유량은 **sccm**, 압력은 **Torr / mTorr / Pa**, 토크는 **N·m**, 온도는 **°C**. 단위를 잘못 읽으면 판단이 완전히 틀어집니다(예: 5 mTorr ≠ 5 Torr).",
     "**지시 문구** — *Confirm*, *Verify*, *Record*, *Do not operate*, *Remove before servicing* 등 명령·주의 표현이 자주 나옵니다. 특히 **Do not(하지 마라)** 로 시작하는 줄은 안전·손상 방지 경고이므로 반드시 지켜야 합니다.",
     "**기록(logging)** — *Record the reading in the CMMS log*(측정값을 정비 시스템에 기록), *Sign off each step*(각 단계에 서명), *Close the work order*(작업 지시 종료). 정비는 '기록으로 끝난다'는 점을 기억하세요.",
     "**경고 단계** — 문서의 **NOTE**(참고) < **CAUTION**(주의, 장비 손상 가능) < **WARNING**(경고, 인명 위험) < **DANGER**(위험, 즉각적 인명 위험) 순으로 위험도가 올라갑니다.",
     "요약: 화면 한 줄을 읽을 때 ①동사(무엇을), ②대상(어디에), ③수치·단위(얼마나), ④판정(합격 여부)의 네 가지를 순서대로 파악하는 습관을 들이면 실수를 크게 줄일 수 있습니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "PM 문서와 HMI 화면에서 반복적으로 마주치는 핵심 약어입니다.",
    "items": [
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방 정비 — 고장 전 정기 점검·교체"
     },
     {
      "ab": "MFC",
      "full": "Mass Flow Controller",
      "ko": "질량유량제어기 — 가스 유량을 sccm으로 제어"
     },
     {
      "ab": "LOTO",
      "full": "Lockout / Tagout",
      "ko": "잠금·표찰 — 위험 에너지 차단 안전 절차"
     },
     {
      "ab": "PPE",
      "full": "Personal Protective Equipment",
      "ko": "개인 보호구 — 장갑·보안경·마스크 등"
     },
     {
      "ab": "CMMS",
      "full": "Computerized Maintenance Management System",
      "ko": "전산 정비 관리 시스템 — 정비 이력·작업지시 관리"
     },
     {
      "ab": "sccm",
      "full": "Standard Cubic Centimeter per Minute",
      "ko": "표준 유량 단위 — 가스 흐름량"
     },
     {
      "ab": "N·m",
      "full": "Newton-meter",
      "ko": "토크(조임 힘) 단위"
     },
     {
      "ab": "IPA",
      "full": "Isopropyl Alcohol",
      "ko": "이소프로필알코올 — 챔버 세정용 용제"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1) — 체크리스트 동작 동사",
    "intro": "PM 체크리스트의 모든 줄을 시작하는 여섯 개 동사입니다. 실제 영어 예문과 함께 익힙니다.",
    "items": [
     {
      "en": "inspect",
      "ko": "점검하다",
      "d": "눈·손·계측기로 상태를 확인하는 것 (교체 아님)",
      "ex": "Inspect the O-ring for cracks, particles, or deformation before reassembly."
     },
     {
      "en": "clean",
      "ko": "청소하다",
      "d": "오염물·폴리머·파티클을 제거하는 것",
      "ex": "Clean the chamber wall with IPA-dampened lint-free wipes; do not spray solvent directly."
     },
     {
      "en": "replace",
      "ko": "교체하다",
      "d": "소모품·손상 부품을 새것으로 바꾸는 것",
      "ex": "Replace the pump oil when it turns dark or drops below the MIN line."
     },
     {
      "en": "calibrate",
      "ko": "교정하다",
      "d": "계측기 값을 기준기에 맞춰 보정하는 것",
      "ex": "Calibrate the MFC against the reference flow meter and record the zero offset."
     },
     {
      "en": "tighten",
      "ko": "조이다",
      "d": "볼트·피팅을 규정 토크로 조이는 것",
      "ex": "Tighten all chamber bolts to 8 N·m in a star pattern; do not over-tighten."
     },
     {
      "en": "lubricate",
      "ko": "윤활하다",
      "d": "O-ring·이동부에 그리스를 얇게 바르는 것",
      "ex": "Lightly lubricate the new O-ring with vacuum grease before installation."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1) — 동작 동사 해석",
    "intro": "영어 체크리스트 줄을 읽고 그 의미를 고르세요.",
    "questions": [
     {
      "prompt": "체크리스트에 'Replace the O-ring if any damage is found.' 라고 적혀 있다. 무엇을 하라는 뜻인가?",
      "opts": [
       "손상이 있으면 O-ring을 새것으로 교체한다",
       "O-ring을 청소만 하고 다시 쓴다",
       "O-ring 위치만 확인한다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Tighten the bolts to 8 N·m in a star pattern.' 의 의미로 맞는 것은?",
      "opts": [
       "볼트를 규정 토크 8 N·m로, 별 모양 순서로 조인다",
       "볼트 8개를 아무 순서로 푼다",
       "볼트를 8분간 그대로 둔다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Lightly lubricate the new O-ring with vacuum grease.' 는 무엇을 지시하는가?",
      "opts": [
       "새 O-ring에 진공 그리스를 얇게 바른다",
       "O-ring을 제거해 폐기한다",
       "O-ring의 무게를 측정한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2) — PM 대상 부품·소모품",
    "intro": "정비 대상으로 반복 등장하는 부품과 소모품입니다.",
    "items": [
     {
      "en": "O-ring",
      "ko": "오링(진공 실링)",
      "d": "챔버 밀봉용 고무 링 — 손상 시 진공 누설 유발",
      "ex": "A damaged O-ring will cause a vacuum leak and rising base pressure."
     },
     {
      "en": "pump oil",
      "ko": "펌프 오일",
      "d": "러핑 펌프의 윤활·밀봉 오일 — 오염 시 교체",
      "ex": "Check the pump oil level through the sight glass every week."
     },
     {
      "en": "chamber wall",
      "ko": "챔버 벽",
      "d": "공정 부산물이 쌓이는 챔버 내벽 — 세정 대상",
      "ex": "Remove polymer buildup from the chamber wall during the wet clean."
     },
     {
      "en": "MFC",
      "ko": "질량유량제어기",
      "d": "공정 가스 유량을 sccm으로 제어하는 장치",
      "ex": "The MFC regulates the process gas flow in sccm and must be calibrated periodically."
     },
     {
      "en": "gauge",
      "ko": "진공 게이지",
      "d": "챔버 압력을 측정하는 계측기",
      "ex": "The Pirani gauge reads the chamber pressure in the rough vacuum range."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2) — 부품·화면 해석",
    "intro": "부품 상태와 HMI 문구를 해석하세요.",
    "questions": [
     {
      "prompt": "HMI에 'MFC1 flow: 0 sccm (setpoint 50)' 가 표시된다. 어떤 상태인가?",
      "opts": [
       "설정값은 50인데 실제 유량이 0 — 가스가 흐르지 않는 이상 상태",
       "유량이 정상 범위",
       "MFC 교정이 방금 완료됨"
      ],
      "ans": 0
     },
     {
      "prompt": "'Check the pump oil level through the sight glass.' 는 무엇을 하라는 지시인가?",
      "opts": [
       "점검창으로 펌프 오일 레벨을 확인한다",
       "펌프 전체를 교체한다",
       "오일을 무조건 새로 주입한다"
      ],
      "ans": 0
     },
     {
      "prompt": "'A damaged O-ring will cause a vacuum leak.' 의 의미는?",
      "opts": [
       "손상된 O-ring이 진공 누설을 유발한다",
       "O-ring이 챔버 압력을 높여 준다",
       "O-ring이 가스 유량을 제어한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3) — 측정·규격·판정",
    "intro": "측정값을 규격과 비교해 합격/불합격을 판단할 때 쓰는 표현입니다.",
    "items": [
     {
      "en": "torque spec",
      "ko": "토크 규격",
      "d": "볼트 조임 힘의 규정값 (단위 N·m)",
      "ex": "Follow the torque spec; over-tightening can crack the ceramic part."
     },
     {
      "en": "leak rate",
      "ko": "누설률",
      "d": "진공 누설의 크기 — 헬륨 누설 검사로 측정",
      "ex": "Perform a helium leak check; the leak rate must be below the specified limit."
     },
     {
      "en": "base pressure",
      "ko": "도달 진공도",
      "d": "가스 없이 도달하는 최저 압력 (mTorr/Torr)",
      "ex": "Verify that the base pressure reaches 5 mTorr before releasing the tool."
     },
     {
      "en": "out of spec",
      "ko": "규격 이탈",
      "d": "측정값이 규격 범위를 벗어남 — 조치 필요",
      "ex": "Mark the item Fail and note any out-of-spec reading in the log."
     },
     {
      "en": "overdue",
      "ko": "기한 초과",
      "d": "예정된 정비 기한이 지난 상태 — 즉시 수행 필요",
      "ex": "The chamber PM is overdue, so the tool stays down until it is completed."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3) — 규격·판정 해석",
    "intro": "화면의 수치와 판정 문구를 읽고 올바르게 판단하세요.",
    "questions": [
     {
      "prompt": "체크리스트 항목 결과가 'Out of Spec' 으로 표시되었다. 어떤 뜻인가?",
      "opts": [
       "측정값이 규격 범위를 벗어남 — 조치가 필요하다",
       "정상 범위 안에 있다",
       "측정을 아직 하지 않았다"
      ],
      "ans": 0
     },
     {
      "prompt": "화면에 'Base pressure: 12 mTorr (limit 5 mTorr)' 라고 뜬다. 어떻게 판단해야 하는가?",
      "opts": [
       "기준 5 mTorr보다 높음 — 불합격, 누설·오염 의심",
       "정상, 합격 처리한다",
       "진공이 너무 강하니 압력을 낮춘다"
      ],
      "ans": 0
     },
     {
      "prompt": "장비 PM 상태가 'OVERDUE' 로 표시된다. 의미는?",
      "opts": [
       "예정 정비 기한이 지났음 — 즉시 수행해야 한다",
       "정비가 이미 완료되었다",
       "정비 예정일보다 아직 이르다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "PREVENTIVE MAINTENANCE CHECKLIST — VACUUM CHAMBER",
    "paras": [
     "1. Inspect the main chamber O-ring for cracks, particles, and permanent deformation.",
     "해설: 챔버 메인 O-ring에 균열·이물질·영구 변형이 있는지 점검하라. (Inspect = 확인만, 교체 아님)",
     "2. Clean the chamber wall and showerhead using lint-free wipes dampened with IPA.",
     "해설: 보풀 없는 와이프에 IPA를 적셔 챔버 벽과 샤워헤드를 청소하라. 용제를 직접 분사하지 말 것.",
     "3. Replace the O-ring if any damage is found. Do not reuse a used O-ring.",
     "해설: 손상이 발견되면 O-ring을 교체하라. 사용했던 O-ring을 재사용하지 말 것.",
     "4. Lightly apply vacuum grease to the new O-ring before installation.",
     "해설: 설치 전 새 O-ring에 진공 그리스를 얇게 바르라. ('lightly' = 얇게가 핵심)",
     "5. Tighten all chamber bolts to the specified torque (8 N·m) in a star pattern.",
     "해설: 모든 챔버 볼트를 규정 토크 8 N·m로, 별 모양 순서로 조여 압력을 고르게 분산하라.",
     "6. Mark each step Pass / Fail and record any out-of-spec value in the CMMS log.",
     "해설: 각 단계를 합격/불합격으로 표시하고, 규격 이탈 값은 CMMS 기록에 남겨라."
    ]
   },
   {
    "type": "manual",
    "mtitle": "SAFETY — LOCKOUT / TAGOUT (LOTO)",
    "paras": [
     "WARNING: Hazardous energy present. Perform LOTO before opening the chamber.",
     "해설: 경고 — 위험 에너지가 있음. 챔버를 열기 전에 반드시 LOTO(잠금·표찰)를 수행하라.",
     "Shut off and lock the RF, gas, and vacuum supplies, then attach your personal tag.",
     "해설: RF·가스·진공 공급을 차단하고 잠근 뒤, 본인 이름표(개인 표찰)를 부착하라.",
     "Do not operate the tool until all locks and tags are removed by the assigned technician.",
     "해설: 담당 기술자가 모든 잠금과 표찰을 제거하기 전에는 장비를 절대 가동하지 말라.",
     "NOTE: Verify the zero-energy state before starting any maintenance work.",
     "해설: 참고 — 정비 작업을 시작하기 전 '무에너지 상태(zero-energy)'를 반드시 확인하라."
    ]
   },
   {
    "type": "manual",
    "mtitle": "MFC / GAUGE CALIBRATION PROCEDURE",
    "paras": [
     "1. Zero the MFC with no gas flow. The display should read 0 sccm.",
     "해설: 가스 흐름이 없는 상태에서 MFC 영점을 맞춰라. 표시값이 0 sccm이어야 한다.",
     "2. Calibrate the MFC against the reference flow meter at 20%, 50%, and 100% of full scale.",
     "해설: 기준 유량계에 맞춰 풀스케일의 20%, 50%, 100% 지점에서 MFC를 교정하라.",
     "3. If the deviation exceeds ±1% of full scale, recalibrate or replace the MFC.",
     "해설: 편차가 풀스케일의 ±1%를 넘으면 MFC를 재교정하거나 교체하라.",
     "4. Check the vacuum gauge zero and verify the base pressure reaches 5 mTorr.",
     "해설: 진공 게이지 영점을 확인하고, 도달 진공도가 5 mTorr에 도달하는지 검증하라.",
     "5. Record all readings in the CMMS maintenance log and close the work order.",
     "해설: 모든 측정값을 CMMS 정비 기록에 남기고 작업 지시서를 종료하라."
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (4) — 매뉴얼 문장 독해",
    "intro": "위 영어 매뉴얼 문장을 정확히 읽었는지 확인합니다.",
    "questions": [
     {
      "prompt": "매뉴얼: 'Do not operate the tool until all locks and tags are removed.' 언제 장비를 가동할 수 있는가?",
      "opts": [
       "모든 잠금과 표찰(LOTO)이 제거된 후에만",
       "언제든지 가동해도 된다",
       "잠금을 건 상태에서 가동한다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Tighten the bolts in a star pattern.' — 별 모양 순서로 조이는 이유로 가장 적절한 것은?",
      "opts": [
       "압력을 고르게 분산해 실링을 균일하게 하기 위해",
       "그냥 더 빨리 조이려고",
       "조이는 순서는 아무 의미가 없다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Record all readings in the CMMS maintenance log.' 는 무엇을 하라는 것인가?",
      "opts": [
       "모든 측정값을 정비 관리 시스템 기록에 남긴다",
       "측정을 생략한다",
       "이전 기록 값을 삭제한다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "which": "chamber",
    "intro": "아래 챔버 단면 시뮬레이션에서 PM 대상 부위를 직접 눌러 확인해 보세요. **O-ring**, **chamber wall**, **pump oil**, **gauge/MFC** 위치를 찾아, 각 부위에 어떤 동작(Inspect / Clean / Replace / Calibrate)이 필요한지 영어 라벨과 연결해 보는 것이 목표입니다. 진공 누설이 생기면 어느 부위(특히 O-ring)를 먼저 의심해야 하는지 확인하세요."
   },
   {
    "type": "sim",
    "which": "pm",
    "intro": "이번에는 실제 **PM checklist**를 순서대로 진행하는 시뮬레이션입니다. 각 항목의 영어 지시문을 읽고 알맞은 동작을 선택한 뒤, 측정값이 규격 안(**In Spec**)인지 밖(**Out of Spec**)인지 판정하여 **Pass / Fail**을 표시하세요. 마지막에 모든 값을 기록하고 **work order**를 닫는 흐름까지 경험하는 것이 목표입니다."
   },
   {
    "type": "sim",
    "which": "devicePanel",
    "intro": "마지막으로 장비 HMI 패널을 읽는 연습입니다. 화면의 **status**(TOOL DOWN / PM DUE / OVERDUE), **setpoint vs actual**, 단위(**sccm / mTorr / N·m**)를 보고 현재 장비 상태를 판단하세요. 예: base pressure가 limit을 넘었는지, MFC 실제 유량이 setpoint와 맞는지 확인해, '지금 이 장비를 가동해도 되는가?'를 스스로 판정해 보세요."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "해외 엔지니어가 O-ring 교체 여부를 확인한다",
      "q": {
       "en": "Did you inspect the O-ring before you reinstalled the chamber lid?",
       "ko": "챔버 뚜껑을 다시 조립하기 전에 O-ring을 점검했나요?"
      },
      "a": {
       "en": "Yes, I inspected it. There was a small crack, so I replaced it with a new one and applied a light coat of vacuum grease.",
       "ko": "네, 점검했습니다. 미세한 균열이 있어서 새것으로 교체하고 진공 그리스를 얇게 발랐습니다."
      }
     },
     {
      "sit": "도달 진공도가 높아 누설을 의심한다",
      "q": {
       "en": "The base pressure is still high. Can you run a helium leak check?",
       "ko": "도달 진공도가 아직 높네요. 헬륨 누설 검사를 돌려 주겠어요?"
      },
      "a": {
       "en": "Sure. I'll run the leak check now. If the leak rate is out of spec, I'll re-tighten the bolts to the torque spec.",
       "ko": "네. 지금 누설 검사를 하겠습니다. 누설률이 규격을 벗어나면 볼트를 규정 토크로 다시 조이겠습니다."
      }
     },
     {
      "sit": "PM 마무리와 기록을 지시한다",
      "q": {
       "en": "Please record everything in the CMMS log and let me know when the PM is done.",
       "ko": "모든 내용을 CMMS 기록에 남기고, PM이 끝나면 알려 주세요."
      },
      "a": {
       "en": "Understood. I'll log all the readings and close the work order once the tool passes base pressure.",
       "ko": "알겠습니다. 모든 측정값을 기록하고, 장비가 도달 진공도를 통과하면 작업 지시서를 닫겠습니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "마무리 — 오늘 배운 것",
    "points": [
     "**PM(Preventive Maintenance)** 은 고장 전 정기 정비이며, 상태는 **PM DUE / OVERDUE / DONE**, 장비는 **TOOL UP / DOWN** 으로 표시된다.",
     "체크리스트 6대 동사: **Inspect(점검) / Clean(청소) / Replace(교체) / Calibrate(교정) / Tighten(조임) / Lubricate(윤활)** — 뜻을 정확히 구분하라.",
     "핵심 부품: **O-ring, pump oil, chamber wall, MFC, gauge** — 각 문제는 진공 누설·유량 오차·파티클로 이어진다.",
     "측정·판정: **torque spec(N·m), leak rate, base pressure(mTorr), setpoint vs actual**, 그리고 **Pass/Fail · In Spec/Out of Spec** 로 합격 여부를 판단한다.",
     "안전 최우선: 챔버를 열기 전 **LOTO** 로 위험 에너지를 차단하고, **Do not / WARNING** 문구는 반드시 지킨다.",
     "정비는 기록으로 끝난다 — **Record the readings in the CMMS log** 하고 **close the work order**."
    ],
    "done": "이제 여러분은 영어 **PM checklist**와 HMI 화면을 읽고, 각 항목의 **동작·대상·수치·판정**을 스스로 해석할 수 있습니다. **Read it, judge it, log it.** 현장에서 이 세 단계를 기억하세요!"
   }
  ]
 },
 {
  "id": "w8",
  "title": "중간 점검",
  "kind": "평가",
  "slides": [
   {
    "type": "story",
    "icon": "📝",
    "title": "중간 점검 안내",
    "text": "앞 챕터(CH 1~7)에서 배운 **장비 구성 · 운전 절차 · 로그 값 · 알람 해석**을 확인합니다. 영어 문장과 용어를 읽고 답하세요."
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
    "title": "중간 점검 정리",
    "points": [
     "장비 구성 · 운전 · 로그 · 알람 영어를 점검했다.",
     "다음 챕터(CH 9)부터는 디자인(Layer·DRC·LVS)으로 넘어간다."
    ],
    "done": "**중간 점검 완료 ✓**"
   }
  ]
 },
 {
  "id": "w9",
  "title": "Layer 용어",
  "slides": [
   {
    "type": "story",
    "icon": "🧱",
    "title": "층으로 읽는 반도체",
    "text": "신입 기술자 지훈은 첫 출근날, 엔지니어가 모니터에 띄운 소자 **cross-section** 그림 앞에서 멈칫했다. 화면 맨 아래엔 회색 **substrate (Si)**, 그 위로 **well**, **active**, 빨간 **poly (gate)**, 그리고 위쪽 굵은 선들에는 **metal**이라 적혀 있었다. 선배가 물었다. \"This layer here — what is it?\" 지훈은 순간 당황했지만, 곧 깨달았다. 반도체는 결국 **bottom-up** 으로 층층이 쌓인 구조이고, 화면과 매뉴얼의 영어 단어는 각각 그 '층(**layer**)'의 이름일 뿐이라는 것을. 아래에서 위로 **substrate → well → active → poly → contact → metal** 순서만 머릿속에 넣으면, 낯선 영어 화면도 '지도'처럼 읽을 수 있다. 오늘 수업의 목표는 바로 이 층 이름을 영어로 '읽고 판단'하는 것이다."
   },
   {
    "type": "read",
    "title": "소자 단면과 적층 순서 (아래→위)",
    "intro": "반도체 소자를 옆에서 자른 단면(**cross-section**)으로 보면, 아래에서 위로 정해진 순서대로 층이 쌓입니다.",
    "paras": [
     "소자는 **cross-section** 으로 보면 아래에서 위로 층층이 쌓인 구조입니다. 순서는 **substrate (Si)** → **well** → **active** → **gate (poly)** → **contact / via** → **metal (interconnect)** 이며, 이 **bottom-up stack** 을 외워두면 모든 화면 용어의 '위치'를 알 수 있습니다.",
     "맨 아래층인 **substrate** 는 순수 실리콘 **wafer** 본체입니다. 모든 소자가 이 위에 만들어지므로 '바닥'이자 기준면(reference plane)이 됩니다.",
     "각 층은 도면(**layout**)에서는 서로 다른 색의 **layer** 로 그려지고, 실제 소자에서는 물리적으로 쌓인 박막(thin film)이 됩니다. 즉 화면의 **layer** = 실물의 한 층입니다.",
     "매뉴얼과 HMI 화면에서 **\"Metal 1\"**, **\"poly\"**, **\"active\"** 같은 단어는 이 적층 순서 중 특정 층을 가리키는 이름입니다. 순서를 알면 낯선 영어 단어도 '어느 높이의 층인지'로 해석할 수 있습니다.",
     "공정 관점에서는 아래쪽(**substrate ~ contact**)을 **FEOL (Front-End-Of-Line)**, 위쪽 배선(**metal / via**)을 **BEOL (Back-End-Of-Line)** 이라 부르며, 적층 순서가 곧 공정 순서와 대응됩니다."
    ]
   },
   {
    "type": "read",
    "title": "맨 아래층: substrate · well · active",
    "intro": "소자의 뿌리에 해당하는 세 층입니다. 트랜지스터가 '어디에, 어떤 극성으로' 만들어질지를 결정합니다.",
    "paras": [
     "**substrate** 는 소자의 기반이 되는 실리콘 몸체입니다. 화면 라벨로 **\"Sub\"**, **\"Si substrate\"**, **\"P-sub\"** 등으로 나타나며, 보통 P형(P-type) 실리콘을 씁니다.",
     "**well** 은 **substrate** 안에 만드는 넓은 도핑 영역입니다. **N-well** 은 PMOS 트랜지스터를, **P-well** 은 NMOS 트랜지스터를 담는 '방(pocket)' 역할을 합니다. 화면의 **\"NW\" / \"PW\"** 가 이것입니다.",
     "**active** (또는 **active area**, **OD**)는 트랜지스터가 실제로 동작하는 영역입니다. 이 영역 밖은 **field oxide / STI** 로 절연되어 소자끼리 서로 간섭하지 않게 격리(isolation)됩니다.",
     "즉 순서상 **substrate** 위에 **well** 을 만들고, 그 안에 **active** 영역을 정의합니다. **active** 영역 안에서 **source**, **drain**, 채널(channel)이 형성됩니다.",
     "매뉴얼에서 **\"Define the active region inside the well\"** 같은 문장을 만나면, '웰 안에 소자 동작 영역을 잡는다'는 뜻으로 읽으면 됩니다."
    ]
   },
   {
    "type": "read",
    "title": "게이트층: poly · gate oxide · source/drain",
    "intro": "트랜지스터의 '스위치'를 이루는 핵심 층들입니다. 이 부분 영어 용어가 화면·매뉴얼에 가장 자주 등장합니다.",
    "paras": [
     "**gate** 는 트랜지스터를 켜고 끄는 전극입니다. 재료로 폴리실리콘을 쓰기 때문에 화면·도면에서는 흔히 **poly** 라는 층 이름으로 표시됩니다. 즉 **\"poly\" = gate layer** 로 이해하면 됩니다.",
     "**gate** 와 **active** 사이에는 아주 얇은 절연막인 **gate oxide (GOX)** 가 있습니다. 두께가 나노미터 수준이라 품질 관리가 매우 중요하며, 매뉴얼에 **\"gate oxide thickness\"** 스펙이 자주 나옵니다.",
     "**gate** 양옆의 **active** 영역이 각각 **source** 와 **drain** 이 됩니다. 전류가 **source → channel → drain** 으로 흐르며, 이 흐름을 **gate** 전압이 제어합니다.",
     "적층 순서로 보면 **active** 위에 **gate oxide**, 그 위에 **poly (gate)** 가 올라갑니다. 따라서 단면도에서 **poly** 는 **active** 보다 한 층 위에 그려집니다.",
     "HMI/매뉴얼 표현 예: **\"Inspect the poly gate for bridging\"** → '폴리 게이트가 서로 붙었는지(단락) 검사하라'. **\"S/D implant\"** → source/drain 도핑 주입 공정을 뜻합니다."
    ]
   },
   {
    "type": "read",
    "title": "배선층: contact · via · metal (interconnect)",
    "intro": "소자를 만든 뒤, 각 부분을 전기적으로 연결하는 위층 배선 구조입니다.",
    "paras": [
     "**contact** 는 아래쪽 소자(**active / poly**)와 첫 번째 금속층을 세로로 이어주는 연결 기둥(plug)입니다. 화면 라벨 **\"CO\" / \"CONT\"** 가 이것입니다.",
     "**metal (interconnect)** 은 소자들을 가로로 연결하는 전선입니다. 여러 층으로 쌓이며 아래부터 **Metal 1 (M1)**, **Metal 2 (M2)** … 순으로 번호가 커집니다. 번호가 클수록 더 위층입니다.",
     "**via** 는 금속층과 금속층 사이(예: **M1 ↔ M2**)를 세로로 잇는 연결입니다. **contact** 는 '소자↔금속', **via** 는 '금속↔금속' 연결이라는 점이 핵심 차이입니다.",
     "금속층 사이의 절연막은 **ILD (Inter-Layer Dielectric)** / **IMD** 라 부르며, 서로 다른 배선이 합선되지 않도록 막아줍니다.",
     "적층 순서 정리: **… active/poly → contact → M1 → via → M2 → via → M3 …** 로, 위로 갈수록 배선이 굵어지고 전원(power)·신호(signal) 배선을 나눠 담습니다.",
     "매뉴얼 표현 예: **\"Route the signal on Metal 2 and drop a via to Metal 1\"** → '신호를 M2로 배선하고 via로 M1에 연결하라'."
    ]
   },
   {
    "type": "read",
    "title": "화면·매뉴얼에서 layer 용어 읽는 법",
    "intro": "현장에서는 이 층 이름들이 도면 색상, HMI 라벨, 검사 리포트 형태로 계속 등장합니다. 읽는 규칙을 정리합니다.",
    "paras": [
     "레이아웃 툴/검사 화면에서 각 **layer** 는 색과 이름표로 구분됩니다. 예: **active(초록), poly(빨강), contact(검정 점), metal(파랑)**. 색만 봐도 어느 층인지 판단할 수 있어야 합니다.",
     "층 이름은 보통 대문자 약어로 표시됩니다: **OD/AA = active**, **PO/GT = poly gate**, **CO = contact**, **M1/M2 = metal**, **VIA/V1 = via**, **NW/PW = well**. 약어를 층 위치로 변환해 읽으세요.",
     "검사 리포트의 **\"Layer: METAL1, Defect: bridge\"** 같은 문장은 '금속1 층에서 다리처럼 붙는 결함 발견'을 뜻합니다. 즉 **layer 이름 + 결함(defect) 유형** 조합으로 읽습니다.",
     "**cross-section** 이미지(SEM 단면 사진)에서는 아래→위 순서가 그대로 보입니다. 층 두께(thickness)와 정렬(alignment)을 눈으로 확인하는 것이 기술자의 주요 판단 업무입니다.",
     "정렬 관련 표현 **\"contact not landed on active\"** → '컨택이 액티브 위에 제대로 안 닿음(오정렬)'. 이런 문장을 즉시 뜻으로 읽어 불량 여부를 판단해야 합니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "레이어·단면 관련 화면과 문서에서 자주 보이는 약어입니다.",
    "items": [
     {
      "ab": "STI",
      "full": "Shallow Trench Isolation",
      "ko": "얕은 트렌치 소자 격리 (active 사이를 절연)"
     },
     {
      "ab": "GOX",
      "full": "Gate Oxide",
      "ko": "게이트 산화막 (gate와 active 사이 얇은 절연막)"
     },
     {
      "ab": "S/D",
      "full": "Source/Drain",
      "ko": "소스/드레인 (전류 입출력 영역)"
     },
     {
      "ab": "M1",
      "full": "Metal 1",
      "ko": "첫 번째 금속 배선층 (가장 아래 금속)"
     },
     {
      "ab": "ILD",
      "full": "Inter-Layer Dielectric",
      "ko": "층간 절연막 (금속층 사이 절연)"
     },
     {
      "ab": "OD",
      "full": "Oxide Definition",
      "ko": "액티브(active) 영역을 정의하는 레이어 이름"
     },
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "설계 규칙 위반 검사 (선폭·간격 등)"
     },
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃과 회로도 일치 검증"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1) 바닥층",
    "intro": "소자의 뿌리를 이루는 아래쪽 층 이름입니다.",
    "items": [
     {
      "en": "substrate",
      "ko": "기판",
      "d": "소자가 만들어지는 바닥 실리콘 몸체 (맨 아래층).",
      "ex": "All devices are built on top of the silicon substrate."
     },
     {
      "en": "wafer",
      "ko": "웨이퍼",
      "d": "얇고 둥근 실리콘 판; substrate의 실물 형태.",
      "ex": "The wafer is loaded into the chamber before processing."
     },
     {
      "en": "well",
      "ko": "웰",
      "d": "substrate 안에 만든 넓은 도핑 영역; 트랜지스터를 담는 방.",
      "ex": "PMOS transistors are placed inside the N-well."
     },
     {
      "en": "active area",
      "ko": "활성 영역",
      "d": "트랜지스터가 실제로 동작하는 영역 (OD/AA).",
      "ex": "Define the active area inside the well before the gate step."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (1)",
    "intro": "영어 층 이름의 뜻을 골라 보세요.",
    "questions": [
     {
      "prompt": "화면에 'Si substrate'라고 표시되어 있습니다. 무엇을 뜻하나요?",
      "opts": [
       "소자가 올라가는 맨 아래 실리콘 기판",
       "가장 위쪽 금속 배선층",
       "게이트 절연막"
      ],
      "ans": 0
     },
     {
      "prompt": "'PMOS transistors are placed inside the N-well.' 이 문장에서 N-well의 역할은?",
      "opts": [
       "금속 배선을 연결하는 통로",
       "PMOS 트랜지스터를 담는 도핑 영역",
       "웨이퍼를 고정하는 지지대"
      ],
      "ans": 1
     },
     {
      "prompt": "리포트에 'active area not defined'라고 나왔습니다. 의미는?",
      "opts": [
       "금속층이 너무 두껍다",
       "트랜지스터 동작 영역이 지정되지 않았다",
       "웨이퍼가 뒤집혀 있다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2) 게이트층",
    "intro": "트랜지스터의 스위치를 이루는 층 이름입니다.",
    "items": [
     {
      "en": "gate",
      "ko": "게이트",
      "d": "트랜지스터를 켜고 끄는 제어 전극.",
      "ex": "The voltage on the gate controls the current flow."
     },
     {
      "en": "poly (polysilicon)",
      "ko": "폴리실리콘",
      "d": "gate를 만드는 재료; 화면에서 gate 층 이름으로 쓰임.",
      "ex": "Inspect the poly line for any bridging defect."
     },
     {
      "en": "gate oxide",
      "ko": "게이트 산화막",
      "d": "gate와 active 사이의 매우 얇은 절연막 (GOX).",
      "ex": "The gate oxide thickness must stay within spec."
     },
     {
      "en": "source / drain",
      "ko": "소스 / 드레인",
      "d": "gate 양옆의 전류 입력·출력 영역.",
      "ex": "Current flows from the source through the channel to the drain."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (2)",
    "intro": "게이트층 용어의 뜻을 판단해 보세요.",
    "questions": [
     {
      "prompt": "도면에서 'poly' 층은 실제로 무엇을 가리키나요?",
      "opts": [
       "소스/드레인 도핑 영역",
       "폴리실리콘으로 만든 게이트 층",
       "금속 배선층"
      ],
      "ans": 1
     },
     {
      "prompt": "'The gate oxide thickness must stay within spec.' 무엇을 관리하라는 뜻인가요?",
      "opts": [
       "게이트 절연막의 두께",
       "웨이퍼의 지름",
       "금속 배선의 개수"
      ],
      "ans": 0
     },
     {
      "prompt": "적층 순서상 poly(gate)는 어느 층 바로 위에 놓이나요?",
      "opts": [
       "Metal 2 위",
       "active(+gate oxide) 위",
       "substrate 아래"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3) 배선층",
    "intro": "소자를 연결하는 위쪽 배선 구조 용어입니다.",
    "items": [
     {
      "en": "contact",
      "ko": "컨택",
      "d": "소자(active/poly)와 첫 금속층을 잇는 세로 연결.",
      "ex": "The contact must land properly on the active area."
     },
     {
      "en": "via",
      "ko": "비아",
      "d": "금속층과 금속층 사이(M1↔M2)를 잇는 세로 연결.",
      "ex": "Drop a via to connect Metal 2 down to Metal 1."
     },
     {
      "en": "metal (interconnect)",
      "ko": "금속 배선",
      "d": "소자들을 가로로 잇는 전선; M1, M2…로 적층.",
      "ex": "Route the power line on the top metal layer."
     },
     {
      "en": "field oxide / STI",
      "ko": "필드 산화막 / 소자격리",
      "d": "active 영역 사이를 절연해 소자를 격리하는 산화막.",
      "ex": "STI isolates one active area from the next."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (3)",
    "intro": "배선층 용어를 정확히 구분해 보세요.",
    "questions": [
     {
      "prompt": "contact와 via의 차이를 바르게 설명한 것은?",
      "opts": [
       "contact는 소자↔금속, via는 금속↔금속 연결",
       "둘 다 금속을 가로로 잇는 전선",
       "contact는 절연막, via는 도핑 영역"
      ],
      "ans": 0
     },
     {
      "prompt": "'Route the power line on the top metal layer.' 어디에 전원 배선을 하라는 뜻인가요?",
      "opts": [
       "가장 아래 substrate에",
       "가장 위쪽 금속층에",
       "게이트 산화막 안에"
      ],
      "ans": 1
     },
     {
      "prompt": "적층에서 M1과 M2 중 더 위층은?",
      "opts": [
       "M1이 더 위",
       "M2가 더 위",
       "항상 같은 높이"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (4) 도면·판독",
    "intro": "층을 표현하고 검사할 때 쓰는 개념 용어입니다.",
    "items": [
     {
      "en": "layer",
      "ko": "레이어",
      "d": "도면에서 한 공정층을 나타내는 색·이름 단위.",
      "ex": "This defect is on the Metal 1 layer."
     },
     {
      "en": "cross-section",
      "ko": "단면",
      "d": "소자를 옆에서 잘라 본 적층 구조 그림/사진.",
      "ex": "Check the layer stack in the cross-section image."
     },
     {
      "en": "layout",
      "ko": "레이아웃",
      "d": "위에서 내려다본 각 층의 평면 도면.",
      "ex": "Open the layout and highlight the poly layer."
     },
     {
      "en": "alignment",
      "ko": "정렬",
      "d": "위아래 층이 정확히 겹쳐 놓였는지의 상태.",
      "ex": "The contact shows poor alignment to the active area."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (4)",
    "intro": "판독용 용어의 뜻을 골라 보세요.",
    "questions": [
     {
      "prompt": "'Check the layer stack in the cross-section image.' 무엇을 확인하라는 뜻인가요?",
      "opts": [
       "웨이퍼의 무게",
       "단면에서 층이 쌓인 순서와 상태",
       "장비의 온도"
      ],
      "ans": 1
     },
     {
      "prompt": "검사 리포트 'Layer: METAL1, Defect: bridge'의 의미는?",
      "opts": [
       "금속1 층에서 배선이 서로 붙은 결함",
       "게이트 산화막이 너무 얇음",
       "웰이 잘못 도핑됨"
      ],
      "ans": 0
     },
     {
      "prompt": "'The contact shows poor alignment to the active area.' 판단으로 옳은 것은?",
      "opts": [
       "정상이므로 통과",
       "컨택이 액티브에 제대로 안 맞아 불량 가능성",
       "금속층 두께 문제"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "CROSS-SECTION LAYER STACK (BOTTOM-UP)",
    "paras": [
     "Layer 1 (bottom): Silicon substrate (P-type). This is the base for all devices.",
     "맨 아래층: P형 실리콘 기판(substrate). 모든 소자의 바닥이 됩니다.",
     "Layer 2: N-well / P-well formed in the substrate to hold the transistors.",
     "2층: 트랜지스터를 담기 위해 기판 안에 만든 N-웰/P-웰.",
     "Layer 3: Active area, isolated from neighbors by STI (field oxide).",
     "3층: 액티브 영역. 옆 소자와는 STI(필드 산화막)로 격리됩니다.",
     "Layer 4: Gate oxide, then poly gate on top of the active area.",
     "4층: 게이트 산화막 위에 폴리(게이트)가 액티브 영역 위로 올라갑니다.",
     "Layer 5: Contacts connect source/drain and poly up to Metal 1.",
     "5층: 컨택이 소스/드레인과 폴리를 금속1(M1)까지 위로 연결합니다.",
     "Layer 6 and above: Metal layers (M1, M2 …) linked by vias.",
     "6층 이상: 금속층(M1, M2 …)들이 비아(via)로 서로 연결됩니다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "LAYER INSPECTION WORK INSTRUCTION",
    "paras": [
     "STEP 1. Open the cross-section SEM image and identify each layer bottom-up.",
     "1단계: 단면 SEM 이미지를 열고 각 층을 아래에서 위로 식별하십시오.",
     "STEP 2. Verify that every contact has landed fully on the active area.",
     "2단계: 모든 컨택이 액티브 영역 위에 완전히 안착했는지 확인하십시오.",
     "NOTE: A contact not landed on active is an alignment defect. Reject the lot.",
     "참고: 액티브에 안착하지 못한 컨택은 정렬 불량입니다. 해당 로트를 불합격 처리하십시오.",
     "STEP 3. Measure the gate oxide thickness and confirm it is within spec.",
     "3단계: 게이트 산화막 두께를 측정하고 규격 이내인지 확인하십시오.",
     "WARNING: Do not touch the poly gate line; bridging between gates causes a short.",
     "경고: 폴리 게이트 라인을 건드리지 마십시오. 게이트 간 브리징은 단락을 유발합니다.",
     "STEP 4. Record the layer name and defect type for any anomaly found.",
     "4단계: 발견된 이상에 대해 레이어 이름과 결함 유형을 기록하십시오."
    ]
   },
   {
    "type": "sim",
    "which": "layer",
    "intro": "아래 인터랙티브 화면에서 소자 단면의 각 층을 아래에서 위로 하나씩 눌러 보세요. **substrate → well → active → gate oxide → poly → contact → metal** 순서로 쌓이는 것을 확인하고, 각 층의 영어 이름과 위치를 눈으로 익히세요. 순서를 외우는 것이 목표입니다."
   },
   {
    "type": "sim",
    "which": "drc",
    "intro": "이번에는 **DRC (Design Rule Check)** 화면입니다. 레이어 간 최소 간격·선폭 규칙을 위반한 부분을 찾아 보세요. **\"spacing violation\"**, **\"width violation\"** 같은 영어 결과 문구가 무슨 뜻인지 읽고, 어느 **layer** 에서 문제가 났는지 판단하는 연습입니다."
   },
   {
    "type": "sim",
    "which": "lvs",
    "intro": "마지막으로 **LVS (Layout Versus Schematic)** 화면입니다. 레이아웃의 층 연결(**contact/via/metal**)이 회로도와 일치하는지 비교합니다. **\"MATCH\"** 와 **\"MISMATCH\"** 결과를 읽고, 불일치가 어느 연결에서 났는지 해석해 보세요."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "외국인 엔지니어가 단면 SEM 이미지를 함께 보며 층을 확인합니다.",
      "q": {
       "en": "This red line here — which layer is it?",
       "ko": "여기 이 빨간 선, 어느 레이어인가요?"
      },
      "a": {
       "en": "That is the poly gate, right above the active area.",
       "ko": "그건 폴리 게이트입니다. 액티브 영역 바로 위쪽이에요."
      }
     },
     {
      "sit": "엔지니어가 컨택 정렬 상태를 묻습니다.",
      "q": {
       "en": "Did the contact land properly on the active area?",
       "ko": "컨택이 액티브 영역 위에 제대로 안착했나요?"
      },
      "a": {
       "en": "No, it is slightly off. This looks like an alignment defect.",
       "ko": "아니요, 살짝 어긋났습니다. 정렬 불량으로 보입니다."
      }
     },
     {
      "sit": "배선층에 대해 확인합니다.",
      "q": {
       "en": "Which metal layer is the power line routed on?",
       "ko": "전원 배선은 어느 금속층에 되어 있나요?"
      },
      "a": {
       "en": "It is on Metal 2, connected down to Metal 1 by a via.",
       "ko": "메탈2에 있고, 비아로 메탈1까지 연결되어 있습니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "소자는 **cross-section** 으로 아래→위 적층: **substrate → well → active → gate oxide → poly → contact → metal**.",
     "화면·도면의 **layer** 이름은 곧 실물 층의 위치다: **OD=active, PO=poly, CO=contact, M1/M2=metal, NW/PW=well**.",
     "**contact** 는 소자↔금속, **via** 는 금속↔금속 연결. **M** 번호가 클수록 더 위층.",
     "매뉴얼·리포트는 **layer 이름 + 결함/상태** 로 읽는다: 예 **'contact not landed on active' = 정렬 불량**.",
     "**DRC** 는 설계 규칙 위반, **LVS** 는 레이아웃-회로도 일치 검증. 결과 문구(violation/MATCH/MISMATCH)를 뜻으로 판단한다."
    ],
    "done": "이제 낯선 영어 단면·HMI 화면도 **아래→위 층 순서**로 읽고 판단할 수 있습니다. **Layer 용어**, 완료!"
   }
  ]
 },
 {
  "id": "w10",
  "title": "Design Rule",
  "slides": [
   {
    "type": "story",
    "icon": "📐",
    "title": "현장 이야기: 0.02um이 만든 재작업",
    "text": "신입 공정 기술자 지훈은 마스크 레이아웃 검증 화면 앞에 앉았다. 화면 오른쪽에는 영어로 된 표 하나가 떠 있었다. **Design Rule Table**. 표에는 **Rule**, **Layer**, **Min Width**, **Min Spacing** 같은 영어 항목과 함께 숫자들이 um 단위로 빼곡히 적혀 있었다. 선배가 물었다. \"이 metal 라인 하나, 폭이 **0.18um**인데 룰은 **min width 0.20um**이야. 이거 통과야, 아니야?\" 지훈은 잠깐 멈칫했다. 값은 읽었지만, 영어 항목이 무엇을 요구하는지 정확히 몰랐다. 결국 이 한 줄을 잘못 읽어 **DRC violation**이 그대로 넘어갔고, 마스크는 재작업(rework) 대상이 되었다. 현장에서 영어 **Design Rule**을 '읽고 판단'하는 힘은, 설계 실력이 아니라 안전과 수율의 문제였다."
   },
   {
    "type": "read",
    "title": "Design Rule이란 무엇인가",
    "intro": "디자인 규칙은 '만들 수 있는 도형'의 최소 조건을 정한 약속입니다.",
    "paras": [
     "**Design Rule**은 공정 장비가 실제로 재현할 수 있는 도형의 기하학적 한계를 규정한 규칙 모음입니다. 화면과 문서에서는 흔히 **design rules** 또는 **DR**로 표기됩니다.",
     "각 규칙은 보통 **layer**(층), **rule name**(규칙 이름), **symbol/기호**, **value**(값), **description**(설명)으로 이루어진 표(**Design Rule Table**) 형태로 제공됩니다.",
     "값의 단위는 대부분 **micron(um)** 또는 **nanometer(nm)**입니다. 화면에 `0.20 um` 또는 `200 nm`처럼 표기되며, 두 값이 같은 크기임을 즉시 환산해 읽을 수 있어야 합니다.",
     "규칙의 목적은 **manufacturability**(제조 가능성)입니다. 너무 가늘거나 너무 가까운 패턴은 노광·식각에서 끊기거나 붙어(short) 불량이 됩니다. 즉 규칙은 '수율(yield)을 지키는 최소 안전선'입니다.",
     "기술자의 핵심 임무는 도형을 '그리는' 것이 아니라, 측정된 값(**measured value**)이 규칙 값(**rule value**)을 **satisfy**(만족)하는지 **pass/fail**을 판단하는 것입니다."
    ]
   },
   {
    "type": "read",
    "title": "핵심 규칙 5종: Width · Spacing · Overlap · Enclosure · Extension",
    "intro": "현장 표에서 가장 자주 보는 다섯 가지 규칙 유형입니다.",
    "paras": [
     "**Minimum Width (min width)**: 한 도형이 가질 수 있는 가장 얇은 폭입니다. `Metal1 min width = 0.20 um`이면 폭이 0.20um보다 작으면 **violation**입니다. 너무 가늘면 라인이 끊어져(open) 전기가 통하지 않습니다.",
     "**Minimum Spacing (min spacing)**: 같은 층의 서로 다른 두 도형 사이의 최소 간격입니다. 간격이 규칙보다 좁으면 두 배선이 붙어 **short**(단락)가 납니다. 화면에서는 `spacing`, `space`, `S`로 표기됩니다.",
     "**Overlap**: 두 층이 서로 겹쳐야 하는 최소 겹침량입니다. 예를 들어 via와 metal은 반드시 일정 넓이 이상 겹쳐야 접촉(contact)이 안정적으로 형성됩니다.",
     "**Enclosure**: 한 층이 다른 층을 '감싸는' 최소 여유입니다. `Metal enclosure of via = 0.05 um`은 via 둘레를 metal이 사방 0.05um 이상 덮어야 한다는 뜻입니다. 정렬 오차(misalignment)를 견디게 해줍니다.",
     "**Extension**: 한 도형이 경계를 넘어 뻗어야 하는 최소 길이입니다. gate가 active 영역 밖으로 충분히 뻗어야(poly extension) 누설을 막습니다.",
     "이 다섯 규칙은 각각 **min**(최소) 조건인지 **max**(최대) 조건인지 반드시 확인해야 합니다. min은 '이보다 크면 OK', max는 '이보다 작으면 OK'로 판단 방향이 정반대입니다."
    ]
   },
   {
    "type": "read",
    "title": "규칙 표(Design Rule Table) 읽는 법",
    "intro": "표의 열(column) 이름과 기호를 정확히 해석해야 판단이 흔들리지 않습니다.",
    "paras": [
     "**Rule / Rule Name** 열: 규칙의 식별자입니다. 흔히 `M1.W.1`, `V1.E.2`처럼 '층.유형.번호'로 코드화됩니다. `W`=width, `S`=space, `E`=enclosure/extension, `O`=overlap을 뜻하는 경우가 많습니다.",
     "**Layer** 열: 규칙이 적용되는 층입니다. `POLY`, `ACTIVE`, `METAL1(M1)`, `VIA1(V1)`, `CONTACT(CO)` 등이 자주 등장합니다.",
     "**Symbol** 열: `≥`(이상), `≤`(이하), `=`(정확히)로 판단 방향을 알려줍니다. `Min Width ≥ 0.20`은 '0.20 이상이어야 통과'라는 뜻입니다.",
     "**Value / Min / Max** 열: 기준 수치입니다. `Min` 열의 값은 하한선, `Max` 열의 값은 상한선입니다. 두 값이 함께 있으면 '범위(range)' 규칙입니다.",
     "**Description** 열: 규칙의 영어 설명 문장입니다. 예: `Minimum spacing between two Metal1 lines`. 이 문장을 읽고 '무엇과 무엇 사이'의 규칙인지 파악하는 것이 핵심입니다.",
     "판단 절차: (1) 어떤 layer인지 확인 → (2) rule type(width/spacing/…)을 확인 → (3) symbol로 방향 확인 → (4) 측정값과 비교해 **pass** 또는 **fail** 결정."
    ]
   },
   {
    "type": "read",
    "title": "판단 실습의 사고 흐름과 단위 함정",
    "intro": "값을 읽는 것과 '만족 여부를 판단'하는 것은 다른 능력입니다.",
    "paras": [
     "측정값 비교의 기본 문장: `measured 0.18 um < min 0.20 um → FAIL`. 부등호의 방향과 규칙이 min인지 max인지를 함께 봐야 합니다.",
     "단위 함정 1 — **um vs nm**: `0.20 um`과 `200 nm`은 같은 값입니다. 화면마다 단위가 다르므로 `1 um = 1000 nm` 환산을 항상 염두에 둬야 합니다.",
     "단위 함정 2 — **소수점 자리**: `0.020 um`과 `0.20 um`은 10배 차이입니다. 현장 화면의 작은 글씨에서 이 자리 실수가 실제 rework를 부릅니다.",
     "**Waived / Waiver**: 일부 violation은 검토 후 '예외 승인'되어 무시됩니다. 리포트에서 `waived`로 표시된 항목은 실제 fail이 아닐 수 있으니 상태(status)를 함께 읽어야 합니다.",
     "**Error vs Warning**: DRC 리포트는 심각도를 나눕니다. `error`는 반드시 수정, `warning`은 검토 후 판단입니다. 색상(빨강/노랑)과 함께 영어 라벨을 확인하세요.",
     "최종 산출물은 언제나 하나의 영어 판정어입니다: **PASS**(clean) 또는 **FAIL**(violation). 이 한 단어를 정확히 도출하는 것이 이 수업의 목표입니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "디자인 규칙 화면과 리포트에서 반복 등장하는 약어입니다.",
    "items": [
     {
      "ab": "DR",
      "full": "Design Rule",
      "ko": "디자인 규칙, 제조 가능성을 위한 도형 규칙"
     },
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "디자인 규칙 검사(위반 자동 검출)"
     },
     {
      "ab": "W",
      "full": "Width",
      "ko": "폭(주로 min width 규칙 기호)"
     },
     {
      "ab": "S",
      "full": "Space / Spacing",
      "ko": "간격(주로 min spacing 규칙 기호)"
     },
     {
      "ab": "ENC",
      "full": "Enclosure",
      "ko": "감쌈 여유(층이 다른 층을 덮는 양)"
     },
     {
      "ab": "EXT",
      "full": "Extension",
      "ko": "뻗음(경계를 넘어 연장되는 길이)"
     },
     {
      "ab": "M1",
      "full": "Metal 1",
      "ko": "1번 금속 배선층"
     },
     {
      "ab": "V1",
      "full": "Via 1",
      "ko": "1번 비아(층간 연결 구멍)"
     },
     {
      "ab": "um",
      "full": "Micron (Micrometer)",
      "ko": "마이크론, 1um = 1000nm"
     },
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃-회로 일치 검증(DRC와 함께 자주 언급)"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1) 규칙 유형",
    "intro": "규칙 표의 rule type을 나타내는 영어 용어입니다.",
    "items": [
     {
      "en": "minimum width",
      "ko": "최소 폭",
      "d": "도형이 가질 수 있는 가장 얇은 폭 하한선",
      "ex": "The metal line must meet the minimum width of 0.20 um."
     },
     {
      "en": "minimum spacing",
      "ko": "최소 간격",
      "d": "같은 층 두 도형 사이 최소 거리 하한선",
      "ex": "Check the minimum spacing between two adjacent Metal1 lines."
     },
     {
      "en": "overlap",
      "ko": "겹침",
      "d": "두 층이 서로 겹쳐야 하는 최소 넓이",
      "ex": "The via must have sufficient overlap with the metal above it."
     },
     {
      "en": "enclosure",
      "ko": "감쌈 여유",
      "d": "한 층이 다른 층을 사방으로 덮는 최소 여유",
      "ex": "Metal enclosure of the via must be at least 0.05 um on all sides."
     },
     {
      "en": "extension",
      "ko": "연장",
      "d": "도형이 경계를 넘어 뻗어야 하는 최소 길이",
      "ex": "The poly extension beyond the active area must not be smaller than 0.10 um."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "영어 규칙 항목의 뜻을 고르세요.",
    "questions": [
     {
      "prompt": "'Minimum spacing between two Metal1 lines'가 규정하는 것은?",
      "opts": [
       "한 metal 라인의 최소 폭",
       "서로 다른 두 metal 라인 사이의 최소 간격",
       "metal과 via의 겹침량"
      ],
      "ans": 1
     },
     {
      "prompt": "'Metal enclosure of via = 0.05 um'의 의미로 맞는 것은?",
      "opts": [
       "via가 metal보다 0.05um 커야 한다",
       "metal이 via를 사방 0.05um 이상 감싸야 한다",
       "via 간 간격이 0.05um여야 한다"
      ],
      "ans": 1
     },
     {
      "prompt": "규칙이 'Min Width ≥ 0.20 um'이고 측정값이 0.18 um일 때 판정은?",
      "opts": [
       "PASS (통과)",
       "FAIL (위반)",
       "판정 불가"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2) 판단·단위",
    "intro": "만족 여부를 판단할 때 쓰는 영어 표현입니다.",
    "items": [
     {
      "en": "satisfy / meet",
      "ko": "만족하다",
      "d": "측정값이 규칙 조건을 충족함",
      "ex": "This line satisfies the minimum width rule."
     },
     {
      "en": "violation",
      "ko": "위반",
      "d": "규칙을 어긴 상태, 수정 대상",
      "ex": "The DRC found one spacing violation in the layout."
     },
     {
      "en": "minimum",
      "ko": "최소값(하한)",
      "d": "이 값 이상이어야 통과하는 기준",
      "ex": "The minimum contact size is 0.16 um."
     },
     {
      "en": "maximum",
      "ko": "최대값(상한)",
      "d": "이 값 이하여야 통과하는 기준",
      "ex": "The maximum metal width in this layer is 10 um."
     },
     {
      "en": "micron (um)",
      "ko": "마이크론",
      "d": "길이 단위, 1um = 1000nm",
      "ex": "All values in this table are given in microns (um)."
     },
     {
      "en": "measured value",
      "ko": "측정값",
      "d": "실제 도형에서 측정된 수치",
      "ex": "Compare the measured value with the rule value to decide pass or fail."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "intro": "단위와 판단 방향을 정확히 읽으세요.",
    "questions": [
     {
      "prompt": "화면에 규칙이 '200 nm'로, 측정값이 '0.20 um'로 표기됐다. 두 값의 관계는?",
      "opts": [
       "측정값이 더 크다",
       "측정값이 더 작다",
       "두 값은 같다"
      ],
      "ans": 2
     },
     {
      "prompt": "'maximum metal width = 10 um' 규칙에서 측정값 12 um는?",
      "opts": [
       "PASS",
       "FAIL",
       "waived"
      ],
      "ans": 1
     },
     {
      "prompt": "리포트 항목 상태가 'waived'로 표시되어 있다면 그 뜻은?",
      "opts": [
       "검토 후 예외 승인되어 무시됨",
       "즉시 수정해야 하는 심각한 오류",
       "측정에 실패한 항목"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3) 층·표 항목",
    "intro": "규칙 표의 열과 층 이름을 읽는 용어입니다.",
    "items": [
     {
      "en": "layer",
      "ko": "층",
      "d": "규칙이 적용되는 마스크 층",
      "ex": "Select the METAL1 layer to view its width rules."
     },
     {
      "en": "rule value",
      "ko": "규칙 값",
      "d": "표에 명시된 기준 수치",
      "ex": "The rule value for this spacing is 0.22 um."
     },
     {
      "en": "description",
      "ko": "설명",
      "d": "규칙을 풀어 쓴 영어 문장",
      "ex": "Read the description column to know what the rule checks."
     },
     {
      "en": "active area",
      "ko": "활성 영역",
      "d": "트랜지스터가 형성되는 영역",
      "ex": "The gate poly must extend beyond the active area."
     },
     {
      "en": "via",
      "ko": "비아",
      "d": "금속 층간을 잇는 연결 구멍",
      "ex": "Each via must be enclosed by metal on all sides."
     },
     {
      "en": "contact",
      "ko": "콘택",
      "d": "실리콘과 금속을 잇는 하부 연결",
      "ex": "The contact size must not be smaller than the minimum."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3)",
    "intro": "표 항목과 판정 문장을 해석하세요.",
    "questions": [
     {
      "prompt": "규칙 코드 'M1.S.1'에서 가운데 'S'가 가장 뜻할 가능성이 높은 것은?",
      "opts": [
       "Size",
       "Spacing",
       "Symbol"
      ],
      "ans": 1
     },
     {
      "prompt": "'The gate poly must extend beyond the active area.'가 요구하는 규칙 유형은?",
      "opts": [
       "extension (연장)",
       "spacing (간격)",
       "overlap (겹침)"
      ],
      "ans": 0
     },
     {
      "prompt": "판정 문장 'measured 0.25 um ≥ min 0.22 um'의 결과는?",
      "opts": [
       "PASS",
       "FAIL",
       "warning"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (4) 리포트·상태",
    "intro": "DRC 리포트 화면에서 상태를 읽는 용어입니다.",
    "items": [
     {
      "en": "DRC clean",
      "ko": "위반 없음",
      "d": "모든 규칙을 통과한 깨끗한 상태",
      "ex": "The layout is DRC clean and ready for release."
     },
     {
      "en": "error",
      "ko": "오류(필수 수정)",
      "d": "반드시 고쳐야 하는 심각한 위반",
      "ex": "There are 3 errors that must be fixed before tape-out."
     },
     {
      "en": "warning",
      "ko": "경고(검토 요망)",
      "d": "수정 여부를 검토해야 하는 항목",
      "ex": "This warning may be waived after review."
     },
     {
      "en": "pass / fail",
      "ko": "통과 / 실패",
      "d": "규칙 만족 여부의 최종 판정",
      "ex": "Mark each rule as pass or fail in the report."
     },
     {
      "en": "waiver",
      "ko": "예외 승인",
      "d": "위반이지만 검토 후 허용된 상태",
      "ex": "A waiver was approved for this density violation."
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "DESIGN RULE CHECK - OPERATING PROCEDURE",
    "paras": [
     "1. Load the layout and select the technology rule deck before running the check.",
     "1. 검사를 실행하기 전에 레이아웃을 불러오고 공정 룰 덱(rule deck)을 선택합니다.",
     "2. Verify that all measured values are displayed in microns (um).",
     "2. 모든 측정값이 마이크론(um) 단위로 표시되는지 확인합니다. (단위 혼동 방지)",
     "3. Run DRC and review each violation in the report by layer and rule name.",
     "3. DRC를 실행하고, 리포트의 각 위반을 layer와 rule name 기준으로 검토합니다.",
     "NOTE: A rule marked 'min' passes only when the measured value is greater than or equal to the rule value.",
     "참고: 'min' 규칙은 측정값이 규칙 값 이상일 때만 통과합니다. (부등호 방향 주의)",
     "WARNING: Do not release a layout that still contains errors. Warnings must be reviewed before waiver.",
     "경고: error가 남아 있는 레이아웃은 배포(release)하지 마십시오. warning은 예외 승인 전에 반드시 검토합니다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "WORK INSTRUCTION - JUDGING A RULE TABLE",
    "paras": [
     "Step 1: Identify the layer and rule type (width, spacing, enclosure) from the table.",
     "1단계: 표에서 layer와 규칙 유형(폭/간격/감쌈)을 먼저 파악합니다.",
     "Step 2: Read the symbol column to confirm the direction ( >= for minimum, <= for maximum ).",
     "2단계: symbol 열을 읽어 판단 방향을 확인합니다 (최소는 >=, 최대는 <=).",
     "Step 3: Compare the measured value against the rule value and record PASS or FAIL.",
     "3단계: 측정값을 규칙 값과 비교하여 PASS 또는 FAIL을 기록합니다.",
     "CAUTION: 0.020 um and 0.20 um differ by ten times. Always check the decimal point.",
     "주의: 0.020 um과 0.20 um은 10배 차이입니다. 소수점 자리를 항상 확인하십시오."
    ]
   },
   {
    "type": "sim",
    "which": "layer",
    "intro": "아래 시뮬레이터에서 각 마스크 층(POLY, ACTIVE, METAL1, VIA1 등)을 켜고 끄며, 어떤 영어 층 이름이 어떤 도형에 해당하는지 눈으로 확인해 보세요. 층을 선택하면 그 층에 적용되는 규칙 항목이 강조됩니다. 층 이름의 영어 표기와 약어(M1, V1 등)를 함께 읽어 익히는 것이 목표입니다."
   },
   {
    "type": "sim",
    "which": "drc",
    "intro": "이번에는 실제 도형에 DRC를 돌려 봅니다. 도형의 width와 spacing 값을 바꿔 가며, 화면의 Design Rule Table 값과 비교해 PASS/FAIL이 어떻게 바뀌는지 직접 판단해 보세요. 위반이 발생하면 어떤 영어 규칙 이름(min width, min spacing 등)으로 표시되는지 확인하는 것이 핵심입니다."
   },
   {
    "type": "sim",
    "which": "report",
    "intro": "마지막으로 DRC 리포트 화면을 읽습니다. error / warning / waived 상태와 각 위반의 layer, rule name, measured value를 표에서 찾아, 각 항목이 실제로 수정 대상인지 예외인지 영어 상태 라벨을 보고 판단해 보세요. 'DRC clean'이 되려면 무엇을 고쳐야 하는지 스스로 결론 내리는 연습입니다."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "외국인 엔지니어가 규칙 표를 함께 보며 판단을 묻는다",
      "q": {
       "en": "This Metal1 line is measured at 0.18 um. The rule says minimum width 0.20 um. Does it pass?",
       "ko": "이 Metal1 라인이 0.18um으로 측정됐어요. 규칙은 최소 폭 0.20um이고요. 통과인가요?"
      },
      "a": {
       "en": "No, it fails. 0.18 is less than the minimum of 0.20, so it is a width violation.",
       "ko": "아니요, 실패입니다. 0.18은 최소값 0.20보다 작으므로 폭 위반입니다."
      }
     },
     {
      "sit": "리포트에 waived 항목이 보인다",
      "q": {
       "en": "There is a spacing item here marked 'waived'. Do we need to fix it now?",
       "ko": "여기 'waived'로 표시된 간격 항목이 있어요. 지금 수정해야 하나요?"
      },
      "a": {
       "en": "No, it was already reviewed and approved as a waiver, so we can leave it as is.",
       "ko": "아니요, 이미 검토 후 예외 승인된 항목이라 그대로 두어도 됩니다."
      }
     },
     {
      "sit": "배포 전 최종 확인",
      "q": {
       "en": "Can we release this layout? Is it DRC clean?",
       "ko": "이 레이아웃 배포해도 될까요? DRC clean 상태인가요?"
      },
      "a": {
       "en": "Not yet. There are still two errors on the VIA1 enclosure rule. Let me fix them first.",
       "ko": "아직요. VIA1 enclosure 규칙에 error가 두 개 남아 있어요. 먼저 그것부터 고치겠습니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리: 규칙을 읽고 판단하는 힘",
    "points": [
     "**Design Rule**은 제조 가능성을 지키는 최소 안전선이며, **layer / rule / value / description** 열로 된 표로 제공된다.",
     "핵심 규칙 5종: **min width**, **min spacing**, **overlap**, **enclosure**, **extension** — 각각 min/max 방향을 반드시 확인한다.",
     "판단 절차: layer 확인 → rule type 확인 → **symbol(≥/≤)** 방향 확인 → **measured value**와 **rule value** 비교 → **PASS/FAIL** 결정.",
     "단위 함정 주의: **1 um = 1000 nm**, 그리고 소수점 자리(0.020 vs 0.20)를 항상 확인한다.",
     "리포트는 **error / warning / waived** 상태로 심각도를 구분한다. **DRC clean**이 되어야 배포(release)할 수 있다."
    ],
    "done": "이제 여러분은 영어 **Design Rule Table**을 읽고 **PASS/FAIL**을 스스로 판단할 수 있습니다. **0.02um의 실수가 rework를 부른다** — 값이 아니라 '판단'을 읽어내는 기술자가 되었습니다."
   }
  ]
 },
 {
  "id": "w11",
  "title": "패턴 배치",
  "slides": [
   {
    "type": "story",
    "icon": "📐",
    "title": "도면대로 놓였는가?",
    "text": "신입 기술자 민수는 포토 공정 앞에서 영어로 된 **layout** 배치 지시서를 받는다. 화면에는 여러 색의 **layer**가 겹쳐 있고, 지시서에는 'Place the metal pattern on **layer** M1, keep **minimum spacing** 0.5 μm'라고 적혀 있다. 민수의 일은 새 패턴을 그리는 것이 아니라, 이미 배치된 패턴이 **line width**와 **spacing** 규칙에 맞는지 **읽고 판단**하는 것이다. 한 곳이라도 **alignment**가 틀어지거나 두 패턴이 **overlap**되면, 웨이퍼 수백 장이 불량이 된다. 오늘 민수가 배워야 할 것은 영어 배치 지시문을 정확히 해석하고, 화면의 **grid** 위 수치가 규칙을 위반하는지 눈으로 잡아내는 능력이다."
   },
   {
    "type": "read",
    "title": "패턴 배치란 무엇인가",
    "intro": "패턴 배치(layout placement)는 각 층의 도형을 정해진 위치·크기·간격 규칙에 맞게 놓는 작업이다.",
    "paras": [
     "반도체 소자는 여러 층(**layer**)의 패턴이 위아래로 쌓여 만들어진다. 각 **layer**는 실제 공정에서 하나의 **mask**(포토 마스크)에 대응하며, 화면에서는 서로 다른 색으로 표시된다.",
     "**Layout**은 이 층들을 위에서 내려다본 평면도이다. 현장 기술자는 보통 이 **layout**을 직접 그리기보다, 배치가 규칙에 맞는지 **읽고 확인(review/verify)**하는 역할을 맡는다.",
     "배치의 핵심 판단 기준은 네 가지다: 선의 굵기(**line width**), 도형 사이 간격(**spacing**), 층 정렬(**alignment**), 그리고 겹침(**overlap**) 여부.",
     "지시서에는 항상 수치 규칙이 붙는다. 예: 'Keep **line width** ≥ 0.25 μm'. 이 문장은 '선 굵기를 0.25 마이크로미터 이상으로 유지하라'는 뜻이며, 이보다 얇으면 위반이다.",
     "HMI/GUI 화면 하단에는 보통 **coordinate**(좌표)와 **grid** 값이 표시된다. 이 숫자를 읽어야 패턴이 규칙 안에 있는지 즉시 판단할 수 있다."
    ]
   },
   {
    "type": "read",
    "title": "선폭·간격·피치의 물리적 의미",
    "intro": "line width, spacing, pitch는 소자 성능과 수율을 직접 결정하는 치수 규칙이다.",
    "paras": [
     "**Line width**(선폭)는 도형 한 개의 굵기다. 너무 얇으면 식각·현상 중에 끊기고(**open**), 전기가 흐르지 못한다. 그래서 규칙은 항상 최소값을 정한다: **minimum line width**.",
     "**Spacing**(간격)은 이웃한 두 패턴 사이의 빈 거리다. 너무 좁으면 두 배선이 붙어 합선(**short**)되므로, **minimum spacing** 규칙이 존재한다.",
     "**Pitch**(피치)는 '선폭 + 간격'을 합한 반복 주기다. 화면 규칙에 'Pitch = 0.5 μm'라고 나오면, 한 선의 중심에서 다음 선의 중심까지 거리가 0.5 μm라는 뜻이다.",
     "이 세 값 중 가장 작고 중요한 치수를 **critical dimension (CD)**라 부른다. 공정 관리에서 CD가 규격을 벗어나면 즉시 알람이 뜬다.",
     "영어 지시문에서 '≥'는 '이상', '≤'는 '이하', 'min'은 최소, 'max'는 최대를 뜻한다. 예: 'Spacing shall be **no less than** 0.3 μm'는 '간격은 0.3 μm 미만이면 안 된다'는 규칙이다."
    ]
   },
   {
    "type": "read",
    "title": "정렬·겹침·오정렬을 판단하기",
    "intro": "층과 층 사이의 정렬(alignment)과 겹침(overlap)은 배치 판단의 핵심이다.",
    "paras": [
     "**Alignment**(정렬)는 위층 패턴이 아래층 패턴에 정확히 맞춰졌는지를 뜻한다. 두 층의 위치 어긋남 정도를 **overlay error**(오버레이 오차) 또는 **misalignment**라고 한다.",
     "정렬을 돕기 위해 웨이퍼에는 **alignment mark** 또는 **registration mark**라는 십자·박스 모양 기준점이 새겨진다. 장비는 이 마크를 보고 층을 맞춘다.",
     "**Overlap**(겹침)은 두 도형이 서로 포개지는 것이다. 의도된 겹침(예: **contact**이 배선 위에 놓임)은 정상이지만, 규칙에 없는 겹침은 불량이다.",
     "지시문 예: 'The via must **fully overlap** the underlying metal by at least 0.05 μm.' — 비아가 아래 금속을 최소 0.05 μm 감싸며 완전히 겹쳐야 한다는 뜻. 이 감싸는 여유를 **enclosure**라고 한다.",
     "화면에서 위반이 발생하면 보통 빨간색 하이라이트와 함께 'Overlap violation' 또는 'Misalignment detected' 같은 영어 메시지가 뜬다. 이 문구를 읽고 즉시 원인을 파악해야 한다."
    ]
   },
   {
    "type": "read",
    "title": "그리드·스냅·좌표 읽기",
    "intro": "모든 배치는 격자(grid) 위에서 이루어지며, 좌표를 읽는 것이 판단의 출발점이다.",
    "paras": [
     "**Grid**(격자)는 화면에 깔린 보이지 않는 눈금이다. 모든 패턴의 꼭짓점은 이 **grid** 위 점에 놓여야 하며, 이 최소 눈금 간격을 **grid resolution** 또는 **manufacturing grid**라 한다.",
     "**Snap**은 도형을 가장 가까운 **grid** 점에 자동으로 붙이는 기능이다. 'Snap to grid' 옵션이 켜져 있으면 좌표가 항상 눈금값의 정수배가 된다.",
     "화면 좌표는 보통 (X, Y)로 표시된다. 원점을 **origin**이라 하며, 'Set **origin** to (0,0)'는 기준점을 좌하단으로 잡으라는 뜻이다.",
     "좌표를 읽으면 치수를 직접 계산할 수 있다. 두 선의 X좌표가 각각 1.0과 1.4라면 중심 간 거리는 0.4 μm이고, 규칙이 'pitch ≥ 0.5'라면 이는 위반이다.",
     "GUI 상태바의 'X: 1.400  Y: 0.800  Grid: 0.005' 같은 표시는 '현재 커서 좌표와 격자 해상도'를 알려준다. 이 값을 규칙과 대조하는 것이 현장 판단의 기본이다."
    ]
   },
   {
    "type": "read",
    "title": "영어는 화면 어디에 나타나는가",
    "intro": "배치 영어는 지시서뿐 아니라 HMI/GUI 곳곳에 짧은 문구로 등장한다.",
    "paras": [
     "메뉴·버튼: 'Move', 'Align', 'Distribute', 'Snap to Grid', 'Check Rules' — 배치 조작 명령들이다.",
     "레이어 패널: 각 층 옆에 'M1', 'M2', 'VIA', 'POLY' 같은 층 이름과 표시/숨김(**visible/hidden**), 잠금(**lock**) 상태가 영어로 나온다.",
     "규칙 결과창(**DRC report**): 위반 항목이 'Spacing < 0.3 μm', 'Width violation', 'Off-grid vertex' 처럼 짧은 영어로 나열된다.",
     "경고 팝업: 'WARNING: Two patterns on the same layer overlap.' 같은 완전한 문장으로 뜨기도 한다. 대문자 WARNING/CAUTION은 즉시 확인이 필요한 신호다.",
     "이 모든 영어는 '작성'이 아니라 '해석'의 대상이다. 짧은 명사구와 부등호를 빠르게 읽어 규칙 위반 여부를 판단하는 훈련이 이 수업의 목표다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "배치·규칙 검증에서 자주 쓰이는 약어들이다.",
    "items": [
     {
      "ab": "CD",
      "full": "Critical Dimension",
      "ko": "임계 치수 — 패턴에서 가장 작고 중요한 선폭/간격"
     },
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "설계 규칙 검사 — 배치가 규칙을 지키는지 자동 검사"
     },
     {
      "ab": "LW",
      "full": "Line Width",
      "ko": "선폭 — 도형 하나의 굵기"
     },
     {
      "ab": "OVL",
      "full": "Overlay",
      "ko": "오버레이 — 층과 층 사이 정렬 오차"
     },
     {
      "ab": "GDS",
      "full": "Graphic Data System",
      "ko": "레이아웃 도형 데이터를 담는 표준 파일 형식"
     },
     {
      "ab": "μm",
      "full": "Micrometer",
      "ko": "마이크로미터 — 100만분의 1 m, 배치 치수의 기본 단위"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1) 층과 패턴",
    "intro": "배치의 기본 단위인 층과 패턴 관련 용어다.",
    "items": [
     {
      "en": "layer",
      "ko": "층",
      "d": "패턴이 놓이는 하나의 공정 층. 화면에서 색으로 구분된다.",
      "ex": "Place the wiring on layer M1, not on M2."
     },
     {
      "en": "mask",
      "ko": "마스크",
      "d": "각 층 패턴을 웨이퍼에 옮기는 포토 원판.",
      "ex": "Each layer corresponds to one photo mask."
     },
     {
      "en": "pattern",
      "ko": "패턴",
      "d": "층 위에 그려진 개별 도형(선, 사각형 등).",
      "ex": "This pattern is too narrow; it may break during etch."
     },
     {
      "en": "layout",
      "ko": "레이아웃/배치도",
      "d": "여러 층을 위에서 본 평면 배치도.",
      "ex": "Open the layout and check the top metal layer."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (1)",
    "intro": "다음 영어 표현의 뜻을 고르시오.",
    "questions": [
     {
      "prompt": "화면에 'Each layer corresponds to one mask.'라고 표시되었다. 무슨 뜻인가?",
      "opts": [
       "각 층은 하나의 마스크에 대응한다",
       "각 마스크는 여러 층을 덮는다",
       "층과 마스크는 관련이 없다"
      ],
      "ans": 0
     },
     {
      "prompt": "지시서의 'Place the wiring on layer M1'은 무엇을 지시하는가?",
      "opts": [
       "배선을 M1 층에 놓아라",
       "M1 층을 삭제하라",
       "배선의 굵기를 M1로 하라"
      ],
      "ans": 0
     },
     {
      "prompt": "'This pattern is too narrow'라는 경고의 의미로 가장 알맞은 것은?",
      "opts": [
       "이 패턴은 너무 넓다",
       "이 패턴은 너무 좁다(가늘다)",
       "이 패턴은 위치가 틀렸다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2) 치수",
    "intro": "선폭·간격 등 수치 규칙에 쓰이는 용어다.",
    "items": [
     {
      "en": "line width",
      "ko": "선폭",
      "d": "도형 한 개의 굵기. 너무 얇으면 끊긴다.",
      "ex": "The minimum line width on this layer is 0.25 μm."
     },
     {
      "en": "spacing",
      "ko": "간격",
      "d": "이웃한 두 패턴 사이의 빈 거리. 너무 좁으면 합선된다.",
      "ex": "Keep the spacing between metal lines at least 0.3 μm."
     },
     {
      "en": "pitch",
      "ko": "피치",
      "d": "선폭과 간격을 합한 반복 주기(중심 간 거리).",
      "ex": "The line pitch is fixed at 0.5 μm."
     },
     {
      "en": "critical dimension",
      "ko": "임계 치수(CD)",
      "d": "패턴에서 가장 작고 중요한 치수. 수율을 좌우한다.",
      "ex": "The critical dimension must stay within ±10%."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (2)",
    "intro": "부등호와 치수 규칙을 정확히 해석하시오.",
    "questions": [
     {
      "prompt": "규칙에 'Spacing shall be no less than 0.3 μm'라고 적혀 있다. 올바른 해석은?",
      "opts": [
       "간격은 0.3 μm를 넘으면 안 된다",
       "간격은 0.3 μm 미만이면 안 된다(0.3 이상)",
       "간격은 정확히 0.3 μm여야 한다"
      ],
      "ans": 1
     },
     {
      "prompt": "'The line pitch is fixed at 0.5 μm.' 여기서 pitch가 뜻하는 것은?",
      "opts": [
       "선폭만의 값",
       "선폭 + 간격의 반복 주기",
       "간격만의 값"
      ],
      "ans": 1
     },
     {
      "prompt": "'Minimum line width = 0.25 μm'인데 화면 패턴의 선폭이 0.20 μm이다. 판단은?",
      "opts": [
       "규칙 위반 (너무 가늘다)",
       "규칙 만족",
       "간격 규칙과 무관"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3) 정렬과 겹침",
    "intro": "층 정렬과 겹침 판단에 쓰이는 용어다.",
    "items": [
     {
      "en": "alignment",
      "ko": "정렬",
      "d": "위층 패턴이 아래층에 정확히 맞춰진 상태.",
      "ex": "Check the alignment between the via and the metal below."
     },
     {
      "en": "overlay",
      "ko": "오버레이(정렬 오차)",
      "d": "층과 층 사이의 위치 어긋남 정도.",
      "ex": "The overlay error is within the allowed limit."
     },
     {
      "en": "registration mark",
      "ko": "정렬 기준 마크",
      "d": "층을 맞추기 위해 웨이퍼에 새긴 기준점.",
      "ex": "The tool reads the registration mark to align the layers."
     },
     {
      "en": "overlap",
      "ko": "겹침",
      "d": "두 도형이 서로 포개진 상태. 규칙 없는 겹침은 불량.",
      "ex": "The via must fully overlap the underlying metal."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (3)",
    "intro": "정렬·겹침 관련 영어 메시지를 해석하시오.",
    "questions": [
     {
      "prompt": "DRC 결과에 'Misalignment detected'가 떴다. 무슨 뜻인가?",
      "opts": [
       "정렬 오차가 발견되었다",
       "정렬이 완벽하다",
       "선폭이 초과되었다"
      ],
      "ans": 0
     },
     {
      "prompt": "'The via must fully overlap the underlying metal by at least 0.05 μm.' 요구 사항은?",
      "opts": [
       "비아가 금속과 절대 겹치면 안 된다",
       "비아가 아래 금속을 최소 0.05 μm 감싸며 완전히 겹쳐야 한다",
       "비아 간격을 0.05 μm로 하라"
      ],
      "ans": 1
     },
     {
      "prompt": "경고 'Two patterns on the same layer overlap.'의 의미는?",
      "opts": [
       "같은 층의 두 패턴이 겹쳐 있다",
       "두 패턴이 서로 다른 층에 있다",
       "두 패턴의 간격이 넓다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (4) 격자와 규칙",
    "intro": "격자·좌표·설계 규칙 관련 용어다.",
    "items": [
     {
      "en": "grid",
      "ko": "격자",
      "d": "화면의 눈금. 모든 꼭짓점이 이 위에 놓여야 한다.",
      "ex": "All vertices must sit on the manufacturing grid."
     },
     {
      "en": "snap",
      "ko": "스냅",
      "d": "도형을 가장 가까운 격자 점에 자동으로 붙이는 기능.",
      "ex": "Turn on Snap to Grid before moving the pattern."
     },
     {
      "en": "design rule",
      "ko": "설계 규칙",
      "d": "선폭·간격 등 배치가 지켜야 할 수치 규칙 모음.",
      "ex": "This layout must pass all design rules."
     },
     {
      "en": "clearance",
      "ko": "이격 거리",
      "d": "서로 다른 물체 사이에 확보해야 하는 최소 여유 간격.",
      "ex": "Maintain enough clearance between the via and the edge."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 (4)",
    "intro": "격자·규칙 관련 화면 표현을 해석하시오.",
    "questions": [
     {
      "prompt": "DRC 결과에 'Off-grid vertex'가 표시되었다. 무슨 뜻인가?",
      "opts": [
       "꼭짓점이 격자 위에 있다",
       "꼭짓점이 격자에서 벗어나 있다",
       "격자 간격을 넓혀야 한다"
      ],
      "ans": 1
     },
     {
      "prompt": "'This layout must pass all design rules.'는 무엇을 요구하는가?",
      "opts": [
       "레이아웃이 모든 설계 규칙을 통과해야 한다",
       "설계 규칙을 새로 만들어야 한다",
       "레이아웃을 삭제해야 한다"
      ],
      "ans": 0
     },
     {
      "prompt": "상태바에 'X: 1.400  Y: 0.800  Grid: 0.005'가 보인다. 'Grid: 0.005'의 의미는?",
      "opts": [
       "패턴의 선폭이 0.005",
       "격자 최소 눈금 간격이 0.005 μm",
       "간격 규칙이 0.005"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "LAYOUT PLACEMENT PROCEDURE",
    "paras": [
     "1. Open the layout file and confirm the active layer shown in the layer panel.",
     "레이아웃 파일을 열고, 레이어 패널에 표시된 활성 층(active layer)이 맞는지 확인한다.",
     "2. Enable 'Snap to Grid' before moving or placing any pattern.",
     "패턴을 옮기거나 놓기 전에 'Snap to Grid'(격자 스냅)를 반드시 켠다.",
     "3. Verify that each line width is no less than the minimum value listed in the rule table.",
     "각 선폭이 규칙 표에 적힌 최소값 이상인지 확인한다. ('no less than' = 이상)",
     "4. Ensure the spacing between adjacent patterns on the same layer meets the minimum spacing rule.",
     "같은 층의 이웃한 패턴 사이 간격이 최소 간격 규칙을 만족하는지 확인한다.",
     "5. NOTE: Vias must fully overlap the metal below; check the enclosure value on all four sides.",
     "참고: 비아는 아래 금속을 완전히 감싸야 한다. 네 방향 모두 감싸는 여유(enclosure) 값을 확인한다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "DESIGN RULE CHECK (DRC) — READING THE REPORT",
    "paras": [
     "Run 'Check Rules' to generate the DRC report before releasing the layer.",
     "층을 넘기기 전에 'Check Rules'를 실행해 DRC 리포트를 생성한다.",
     "Each line lists the rule name, the measured value, and the location.",
     "각 줄에는 규칙 이름, 측정값, 위치가 표시된다.",
     "Example entry: 'Spacing violation: 0.22 μm (min 0.30 μm) at (1.40, 0.80)'.",
     "예시 항목: '간격 위반: 0.22 μm (최소 0.30 μm), 위치 (1.40, 0.80)' — 측정값이 최소값보다 작아 위반이다.",
     "WARNING: Do not release a layer while any red 'violation' entry remains in the report.",
     "경고: 리포트에 빨간색 'violation'(위반) 항목이 하나라도 남아 있으면 층을 넘기지 말 것.",
     "If a violation is a known exception, mark it as 'waived' only with supervisor approval.",
     "위반이 이미 알려진 예외라면, 반드시 감독자 승인 하에만 'waived'(면제)로 표시한다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "CAUTION NOTES ON PLACEMENT",
    "paras": [
     "CAUTION: Two patterns on the same layer must never overlap unless the rule allows it.",
     "주의: 같은 층의 두 패턴은 규칙이 허용하지 않는 한 절대 겹쳐서는 안 된다.",
     "Keep sufficient clearance between any pattern and the chip boundary.",
     "모든 패턴과 칩 경계 사이에 충분한 이격 거리(clearance)를 유지한다.",
     "Do not place any vertex off the manufacturing grid; off-grid points cause fabrication errors.",
     "어떤 꼭짓점도 제조 격자를 벗어나게 두지 말 것. 격자를 벗어난 점은 제조 오류를 일으킨다.",
     "After any move, re-run the rule check to confirm the layout still passes.",
     "패턴을 옮긴 뒤에는 반드시 규칙 검사를 다시 실행해 레이아웃이 여전히 통과하는지 확인한다."
    ]
   },
   {
    "type": "sim",
    "which": "layer",
    "intro": "아래 시뮬레이터에서 여러 layer를 켜고 끄며(visible/hidden) 각 층의 패턴이 어떻게 겹쳐 보이는지 관찰하세요. M1, M2, VIA 층을 하나씩 표시해 보고, 어느 층 위에 어떤 패턴이 놓였는지, 비아가 아래 금속을 제대로 감싸고 있는지(overlap/enclosure) 눈으로 판단해 보세요. 레이어 이름과 상태 표시가 모두 영어로 나오므로, 화면의 영어 라벨을 읽는 연습도 함께 하세요."
   },
   {
    "type": "sim",
    "which": "drc",
    "intro": "아래 DRC 시뮬레이터에서 'Check Rules'를 실행해 규칙 위반을 찾아보세요. 리포트에 뜨는 'Spacing violation', 'Width violation', 'Off-grid vertex' 같은 영어 항목을 읽고, 측정값과 최소 규칙값(min)을 비교해 어떤 패턴이 왜 위반인지 판단하세요. 위반 위치 좌표 (X, Y)를 화면에서 찾아 확인하고, 위반이 모두 사라져 'No violations'가 뜰 때까지 배치를 점검하세요."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "외국인 엔지니어가 배치 검토 결과를 묻는다.",
      "q": {
       "en": "Did the M1 layer pass the design rule check?",
       "ko": "M1 층이 설계 규칙 검사를 통과했나요?"
      },
      "a": {
       "en": "Not yet. There is one spacing violation at (1.40, 0.80): 0.22 μm, below the 0.30 μm minimum.",
       "ko": "아직요. (1.40, 0.80) 위치에 간격 위반이 하나 있습니다. 0.22 μm로 최소 0.30 μm보다 작습니다."
      }
     },
     {
      "sit": "엔지니어가 비아 배치를 확인해 달라고 한다.",
      "q": {
       "en": "Can you confirm the via fully overlaps the metal below?",
       "ko": "비아가 아래 금속을 완전히 감싸는지 확인해 줄 수 있나요?"
      },
      "a": {
       "en": "Yes. The enclosure is 0.06 μm on all four sides, which meets the 0.05 μm rule.",
       "ko": "네. 네 방향 모두 감싸는 여유가 0.06 μm로, 0.05 μm 규칙을 만족합니다."
      }
     },
     {
      "sit": "엔지니어가 위반 항목 처리를 지시한다.",
      "q": {
       "en": "Please fix the off-grid vertex before you release the layer.",
       "ko": "층을 넘기기 전에 격자를 벗어난 꼭짓점을 수정해 주세요."
      },
      "a": {
       "en": "Understood. I will snap it back to the grid and re-run the rule check.",
       "ko": "알겠습니다. 격자에 다시 스냅한 뒤 규칙 검사를 다시 돌리겠습니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "패턴 배치는 **layer**, **line width**, **spacing**, **alignment**, **overlap**, **grid** 여섯 축으로 판단한다.",
     "부등호 해석이 핵심이다: **no less than**(이상), **min/max**, ≥/≤ 를 정확히 읽어야 위반을 잡는다.",
     "**DRC report**의 영어 항목(Spacing violation, Width violation, Off-grid vertex)을 측정값 vs 최소값으로 대조해 판단한다.",
     "**Snap to Grid**를 켜고, 모든 꼭짓점을 격자 위에 두며, 이동 후 반드시 규칙 검사를 재실행한다.",
     "빨간 **violation** 항목이 남으면 층을 넘기지 않으며, 예외는 감독자 승인 하에만 **waived** 처리한다."
    ],
    "done": "이제 영어 배치 지시문과 화면 규칙을 읽고 **규칙 위반 여부를 스스로 판단**할 수 있습니다. 수고하셨습니다!"
   }
  ]
 },
 {
  "id": "w12",
  "title": "DRC 오류",
  "slides": [
   {
    "type": "story",
    "icon": "📐",
    "title": "빨간 마커가 뜬 화면",
    "text": "야간 근무 중, 신입 기술자 지훈은 레이아웃 검증 장비의 HMI 화면 앞에 앉아 있다. 방금 돌린 검사 결과 창에 붉은 글씨가 잔뜩 떴다. 화면 상단에는 **DRC RESULTS**, 그 아래로 **SPACING violation: 15 errors**, **WIDTH violation: 3 errors**, 그리고 노란색으로 **2 warnings**라는 줄이 보인다. 각 줄 끝에는 **insufficient spacing (min 0.14um)** 같은 짧은 영어 문장과 좌표가 붙어 있다. 지훈은 이 영어가 '무엇이 잘못되었는지'를 말해준다는 것을 안다. **error**는 반드시 고쳐야 하는 규칙 위반이고, **warning**은 확인이 필요한 경고다. 이 화면을 정확히 읽어내는 것이 오늘 그의 임무다. 선임은 말했다. \"메시지를 못 읽으면 멀쩡한 칩을 버리거나, 불량을 그냥 넘긴다.\" 오늘 우리는 이 붉은 줄들을 하나씩 해독한다."
   },
   {
    "type": "read",
    "title": "DRC란 무엇인가",
    "intro": "DRC는 설계된 레이아웃이 공정에서 실제로 만들 수 있는지 규칙과 대조해 검사하는 절차다.",
    "paras": [
     "**DRC (Design Rule Check)**는 칩 레이아웃의 도형(선, 사각형, 홀)이 공정에서 정한 최소 치수·간격 규칙을 지키는지 자동으로 검사하는 단계다. 위반이 있으면 그 위치를 **violation**으로 표시한다.",
     "각 공정 노드(예: 28nm, 14nm)는 리소그래피·식각의 한계 때문에 **minimum width**(최소 선폭)와 **minimum spacing**(최소 간격) 같은 물리적 한계를 가진다. DRC는 이 한계를 숫자 규칙으로 바꿔 검사한다.",
     "검사 기준의 묶음을 **rule deck** 또는 **runset**이라 부르며, 화면에는 보통 `Loaded rule deck: N28_M1.drc` 처럼 어떤 규칙 세트를 썼는지 표시된다.",
     "DRC를 통과하지 못한 도형은 실제 웨이퍼에서 **short**(붙어야 안 될 것이 붙음)나 **open**(끊어짐), 패턴 불량으로 이어질 수 있다. 그래서 현장에서는 '규칙 위반'을 '잠재 불량'으로 읽는다.",
     "결과는 사람이 읽는 리포트(텍스트)와, 레이아웃 위에 겹쳐 보이는 그래픽 마커(색깔 도형) 두 형태로 나온다. 기술자는 두 가지를 연결해 판단한다."
    ]
   },
   {
    "type": "read",
    "title": "왜 규칙이 존재하는가 — 물리적 의미",
    "intro": "DRC 규칙은 자의적인 숫자가 아니라 실제 공정의 한계에서 나온다.",
    "paras": [
     "**minimum spacing**이 존재하는 이유: 두 배선이 너무 가까우면 식각·증착 공정에서 사이가 메워져 **short**(단락)가 나거나, 전기적으로 서로 간섭(**bridge**)한다.",
     "**minimum width**가 존재하는 이유: 선이 너무 얇으면 식각 때 그 부분이 끊어져 **open**(단선)가 되거나, 저항이 커져 발열·신호 지연을 일으킨다.",
     "즉 숫자 규칙은 '수율(yield)을 지키기 위한 안전 여유'다. 규칙을 어기면 바로 불량이 아니더라도 불량 확률이 크게 오른다.",
     "그래서 리포트의 **required / min** 값은 협상 대상이 아니라 공정이 보장하는 최소선이다. 기술자가 임의로 낮추지 않는다.",
     "이 때문에 화면의 **error**는 '보기 싫은 것'이 아니라 '이대로 만들면 칩이 죽을 수 있다'는 물리적 경고로 읽어야 한다."
    ]
   },
   {
    "type": "read",
    "title": "SPACING violation — 간격이 부족하다",
    "intro": "가장 흔한 오류. 두 도형 사이가 규칙보다 가까울 때 뜬다.",
    "paras": [
     "**SPACING violation**은 서로 다른(또는 같은) 도형 사이의 거리가 정해진 **minimum spacing**보다 작을 때 발생한다. 메시지 예: **insufficient spacing between metal lines (measured 0.10um, required 0.14um)**.",
     "리포트에서 핵심 숫자는 두 개다. **measured**(실제 측정된 값)와 **required / min**(규칙이 요구하는 최소값). measured < required 이면 위반이다.",
     "화면 문구가 **insufficient spacing**, **spacing < min**, **space violation** 등으로 다양하게 표현되어도 의미는 모두 '간격이 최소 기준에 못 미친다'로 같다.",
     "같은 layer 안에서 나는 간격 위반은 보통 배선이 너무 촘촘한 것이고, 다른 layer 사이 위반은 정렬·겹침 규칙(enclosure/overlap)과 함께 봐야 한다.",
     "화면에서 해당 줄을 클릭하면 두 도형 사이의 가장 가까운 지점이 **highlight marker**로 표시되어, 어느 모서리가 문제인지 보인다."
    ]
   },
   {
    "type": "read",
    "title": "WIDTH violation — 선이 너무 얇다",
    "intro": "도형 자체의 폭이 최소 기준보다 좁을 때 발생하는 오류다.",
    "paras": [
     "**WIDTH violation**은 한 도형(주로 금속 배선)의 폭이 **minimum width**보다 작을 때 뜬다. 메시지 예: **metal width below minimum (measured 0.08um, min 0.10um)**.",
     "SPACING이 '도형과 도형 사이'를 보는 반면, WIDTH는 '한 도형의 안쪽 폭'을 본다. 이 차이를 구분하는 것이 리포트 해석의 기본이다.",
     "화면 표현은 **width < min**, **minimum width violation**, **narrow metal** 등으로 나오지만 모두 '폭이 최소 기준 미달'을 뜻한다.",
     "간혹 **notch**(도형 가장자리가 살짝 파인 부분)나 짧은 돌출부에서 국소적으로 폭이 줄어 WIDTH 위반이 잡히기도 한다. 이때는 좌표를 확대해 어느 지점인지 확인한다.",
     "선폭이 규칙보다 얇으면 실제 공정에서 그 부분이 끊기거나(**open**) 저항이 급격히 커져 신호가 약해질 수 있다. 즉 '얇음 = 끊길 위험'이다."
    ]
   },
   {
    "type": "read",
    "title": "error 와 warning — 심각도 읽기",
    "intro": "모든 위반이 같은 무게는 아니다. 영어 심각도 표시를 정확히 구분해야 한다.",
    "paras": [
     "**error**는 반드시 수정해야 하는 규칙 위반이다. error가 남아 있으면 다음 공정(테이프아웃, 마스크 제작)으로 넘길 수 없다. 화면에서 보통 빨간색으로 표시된다.",
     "**warning**은 규칙을 어긴 것은 아니지만 확인이 필요한 항목이다. 예: 권장 간격 미달, 예외 규칙 적용 구간. 보통 노란색이며 '검토 후 판단'을 뜻한다.",
     "리포트 요약 줄은 대개 `Errors: 18  Warnings: 2  Info: 5` 형태다. **Info**(정보)는 조치가 아니라 참고용 메시지다.",
     "현장 판단 원칙: **error = must fix**, **warning = review**, **info = note**. 이 세 단계를 혼동하면 멀쩡한 설계를 붙잡거나 위험한 위반을 방치하게 된다.",
     "일부 장비는 심각도를 **severity: high / medium / low** 나 **critical / minor**로도 표기한다. 색과 단어를 함께 보고 우선순위를 정한다."
    ]
   },
   {
    "type": "read",
    "title": "DRC 리포트와 HMI 화면 읽기",
    "intro": "텍스트 리포트의 구조와, 그것이 화면 위에 어떻게 그려지는지 연결한다.",
    "paras": [
     "리포트 한 줄의 전형적 구조: **[severity] rule_name : description @ (x, y) layer**. 예: `ERROR SP1.2 : insufficient spacing (0.11 < 0.14) @ (12.40, 8.66) METAL1`.",
     "**rule_name / rule ID** (예: SP1.2, W3.1)는 어떤 규칙을 어겼는지 가리키는 코드다. SP는 spacing, W는 width 계열임을 관례적으로 알 수 있다.",
     "괄호 안의 좌표 **(x, y)**는 위반이 발생한 정확한 위치다. HMI에서 그 줄을 클릭하면 레이아웃이 해당 좌표로 **zoom to violation** 되어 붉은 마커가 보인다.",
     "화면에서 위반은 보통 색으로 구분된다: 빨강 = **error**, 노랑 = **warning**, 표시된 도형에는 **highlight marker**가 겹쳐 그려진다. 색과 텍스트를 반드시 함께 읽는다.",
     "상단 요약 패널의 총계(Total errors/warnings)와 하단 리스트의 개별 줄은 연결되어 있다. 총계가 0이 되어야 **DRC clean**(무결) 상태다.",
     "리포트를 저장할 때 파일명은 흔히 `top_drc.rpt`, `drc_summary.txt` 형태다. 재검사 후에는 **before/after** 개수를 비교해 조치 효과를 확인한다."
    ]
   },
   {
    "type": "read",
    "title": "오류 대응 워크플로우 — 현장 판단",
    "intro": "리포트를 읽은 뒤 어떤 순서로 판단하고 움직이는지 정리한다.",
    "paras": [
     "1단계: 요약 줄의 **Errors / Warnings** 총계를 먼저 본다. Errors가 0이 아니면 절대 다음 공정으로 보내지 않는다.",
     "2단계: **severity**(심각도)로 정렬해 error를 위로 올리고, 같은 **rule ID**(예: SP1.2)가 반복되는지 본다. 반복 규칙은 보통 한 가지 원인에서 비롯된다.",
     "3단계: 각 오류의 **(x, y)** 좌표로 확대해 문제 도형을 눈으로 확인하고, **measured**와 **min** 값을 비교해 얼마나 모자람는지 파악한다.",
     "4단계: warning은 원인을 검토해 면제(**waive**) 가능한지 판단하고, 면제하려면 선임의 승인(**sign-off**)을 받는다.",
     "5단계: 수정 후 DRC를 다시 돌려 **before/after** 개수를 비교하고, 총계가 0(**DRC clean**)이 되었는지 확인한다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "DRC 리포트와 검증 장비 화면에서 반복되는 약어들이다.",
    "items": [
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "설계 규칙 검사 — 레이아웃이 공정 규칙을 지키는지 검사"
     },
     {
      "ab": "DR",
      "full": "Design Rule",
      "ko": "설계 규칙 — 최소 폭·간격 등 공정이 정한 규칙"
     },
     {
      "ab": "SP",
      "full": "Spacing (rule prefix)",
      "ko": "간격 규칙 계열을 뜻하는 규칙 ID 접두사"
     },
     {
      "ab": "W",
      "full": "Width (rule prefix)",
      "ko": "선폭 규칙 계열을 뜻하는 규칙 ID 접두사"
     },
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃과 회로도 일치 검사 (DRC와 짝을 이루는 검증)"
     },
     {
      "ab": "GDS",
      "full": "Graphic Data System",
      "ko": "레이아웃 도형을 담는 표준 파일 형식 (GDSII)"
     },
     {
      "ab": "HMI",
      "full": "Human-Machine Interface",
      "ko": "작업자용 조작 화면"
     },
     {
      "ab": "min",
      "full": "minimum",
      "ko": "최소값 — 규칙이 요구하는 하한선"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1) — 검사와 위반",
    "intro": "DRC 화면에서 가장 먼저 만나는 기본 단어들이다.",
    "items": [
     {
      "en": "Design Rule Check (DRC)",
      "ko": "설계 규칙 검사",
      "d": "레이아웃이 공정 규칙을 지키는지 자동 검사하는 단계.",
      "ex": "Run DRC before sending the layout to the mask shop."
     },
     {
      "en": "violation",
      "ko": "위반(사항)",
      "d": "규칙을 어긴 지점. 리포트의 각 오류 항목.",
      "ex": "The report shows 15 spacing violations on METAL1."
     },
     {
      "en": "rule deck",
      "ko": "규칙 세트 파일",
      "d": "공정 규칙들을 모아둔 검사 기준 파일(runset).",
      "ex": "Load the correct rule deck for the 28nm process."
     },
     {
      "en": "clean",
      "ko": "무결(위반 없음)",
      "d": "오류가 하나도 없는 통과 상태.",
      "ex": "The block is DRC clean, zero errors remaining."
     },
     {
      "en": "flag",
      "ko": "표시하다/걸리다",
      "d": "검사기가 위반으로 지적함.",
      "ex": "The tool flagged three shapes as too narrow."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "화면 문구의 의미를 고르시오.",
    "questions": [
     {
      "prompt": "화면에 'DRC clean, 0 errors' 라고 떴다. 무슨 뜻인가?",
      "opts": [
       "규칙 위반이 하나도 없어 통과했다",
       "검사를 아직 시작하지 않았다",
       "오류가 너무 많아 검사가 멈췄다"
      ],
      "ans": 0
     },
     {
      "prompt": "'The tool flagged three shapes.' 에서 flagged의 의미는?",
      "opts": [
       "세 도형을 삭제했다",
       "세 도형을 위반으로 표시했다",
       "세 도형을 저장했다"
      ],
      "ans": 1
     },
     {
      "prompt": "리포트에 'Loaded rule deck: N28_M1.drc' 가 보인다. 이 줄이 알려주는 것은?",
      "opts": [
       "오류의 좌표",
       "사용된 검사 규칙 세트",
       "웨이퍼 온도"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2) — 간격과 폭",
    "intro": "SPACING과 WIDTH 위반을 읽는 데 꼭 필요한 단어들이다.",
    "items": [
     {
      "en": "spacing",
      "ko": "간격",
      "d": "두 도형 사이의 거리.",
      "ex": "Increase the spacing between these two metal lines."
     },
     {
      "en": "minimum spacing",
      "ko": "최소 간격",
      "d": "규칙이 허용하는 가장 가까운 거리.",
      "ex": "This gap is below the minimum spacing of 0.14um."
     },
     {
      "en": "insufficient spacing",
      "ko": "간격 부족",
      "d": "간격이 최소 기준에 못 미치는 상태.",
      "ex": "Error: insufficient spacing between contacts."
     },
     {
      "en": "width",
      "ko": "폭/선폭",
      "d": "한 도형의 안쪽 폭.",
      "ex": "The measured width is 0.08um, below the limit."
     },
     {
      "en": "minimum width",
      "ko": "최소 선폭",
      "d": "도형이 가질 수 있는 가장 작은 폭.",
      "ex": "Any line thinner than the minimum width will be flagged."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "intro": "다음 영어 오류 메시지의 뜻을 고르시오.",
    "questions": [
     {
      "prompt": "'SPACING violation: insufficient spacing (0.10 < 0.14)' 의 의미는?",
      "opts": [
       "선폭이 규칙보다 넓다",
       "두 도형 사이 간격이 최소 기준보다 좁다",
       "온도가 너무 낮다"
      ],
      "ans": 1
     },
     {
      "prompt": "'metal width below minimum (0.08um, min 0.10um)' 은 무엇을 말하는가?",
      "opts": [
       "금속 선의 폭이 최소 기준보다 얇다",
       "금속 선의 간격이 넓다",
       "금속층이 누락되었다"
      ],
      "ans": 0
     },
     {
      "prompt": "리포트 한 줄에 'measured 0.11, required 0.14' 가 있다. 위반인가?",
      "opts": [
       "아니다, measured가 더 크다",
       "그렇다, measured가 required보다 작다",
       "알 수 없다"
      ],
      "ans": 1
     },
     {
      "prompt": "WIDTH violation과 SPACING violation의 차이는?",
      "opts": [
       "WIDTH는 한 도형의 폭, SPACING은 도형 사이 거리",
       "둘은 완전히 같은 말이다",
       "WIDTH는 온도, SPACING은 압력"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3) — 심각도와 리포트",
    "intro": "리포트의 심각도와 위치 정보를 읽는 단어들이다.",
    "items": [
     {
      "en": "error",
      "ko": "오류(필수 수정)",
      "d": "반드시 고쳐야 하는 규칙 위반.",
      "ex": "You must fix every error before tape-out."
     },
     {
      "en": "warning",
      "ko": "경고(검토 필요)",
      "d": "위반은 아니나 확인이 필요한 항목.",
      "ex": "This warning can be waived after review."
     },
     {
      "en": "severity",
      "ko": "심각도",
      "d": "위반의 중요도 등급(high/low 등).",
      "ex": "Sort the results by severity, highest first."
     },
     {
      "en": "coordinate",
      "ko": "좌표",
      "d": "위반이 난 위치를 나타내는 (x, y) 값.",
      "ex": "Double-click the coordinate to zoom to the violation."
     },
     {
      "en": "layer",
      "ko": "레이어(층)",
      "d": "위반이 발생한 마스크 층 이름.",
      "ex": "The violation is on layer METAL1."
     },
     {
      "en": "highlight marker",
      "ko": "강조 표시",
      "d": "레이아웃 위에 위반 위치를 색으로 겹쳐 표시한 것.",
      "ex": "The red highlight marker shows where the lines are too close."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3)",
    "intro": "심각도와 대응을 판단하시오.",
    "questions": [
     {
      "prompt": "요약에 'Errors: 4  Warnings: 2' 가 보인다. 다음 공정으로 넘어가려면?",
      "opts": [
       "warning 2개만 지우면 된다",
       "error 4개를 모두 수정해야 한다",
       "아무것도 안 해도 된다"
      ],
      "ans": 1
     },
     {
      "prompt": "'This warning can be waived after review.' 의 뜻은?",
      "opts": [
       "이 경고는 무조건 오류다",
       "검토 후 이 경고는 예외 처리(면제)될 수 있다",
       "이 경고는 자동 삭제된다"
      ],
      "ans": 1
     },
     {
      "prompt": "'@ (12.40, 8.66) METAL1' 이 알려주는 것 두 가지는?",
      "opts": [
       "위반의 좌표와 레이어",
       "온도와 압력",
       "규칙 파일명과 날짜"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "DRC RESULTS REPORT (excerpt)",
    "paras": [
     "SUMMARY: Errors: 18   Warnings: 2   Info: 5   Status: NOT CLEAN",
     "요약 줄: 오류 18, 경고 2, 정보 5, 상태는 '무결 아님(NOT CLEAN)'. error가 남아 있으므로 통과가 아니다.",
     "ERROR  SP1.2 : insufficient spacing (measured 0.11, required 0.14) @ (12.40, 8.66) METAL1",
     "오류 SP1.2: 간격 부족. 측정 0.11 < 요구 0.14, 위치 (12.40, 8.66), 레이어 METAL1. 반드시 수정.",
     "ERROR  W3.1 : metal width below minimum (measured 0.08, min 0.10) @ (30.15, 4.02) METAL2",
     "오류 W3.1: 선폭이 최소 미달. 측정 0.08 < 최소 0.10, 위치 (30.15, 4.02), 레이어 METAL2.",
     "WARNING  SP2.0 : recommended spacing not met (0.16 < 0.18); may be waived after review",
     "경고 SP2.0: 권장 간격 미달(0.16 < 0.18). 규칙 위반은 아니며 검토 후 예외 처리 가능."
    ]
   },
   {
    "type": "manual",
    "mtitle": "OPERATING PROCEDURE — REVIEWING DRC ERRORS",
    "paras": [
     "1. Open the DRC results and check the SUMMARY line for the total error and warning count.",
     "1. DRC 결과를 열고 요약 줄에서 오류·경고 총 개수를 먼저 확인한다.",
     "2. Sort the results by severity so that all ERROR items appear at the top of the list.",
     "2. 심각도 순으로 정렬해 모든 ERROR 항목이 목록 위쪽에 오도록 한다.",
     "3. Double-click each error to zoom to its coordinate; the violating shapes are shown with a red highlight marker.",
     "3. 각 오류를 더블클릭해 좌표로 확대한다. 위반 도형은 빨간 강조 표시로 나타난다.",
     "NOTE: Do NOT proceed to tape-out while any ERROR remains. Warnings must be reviewed but may be waived with sign-off.",
     "주의: ERROR가 하나라도 남아 있으면 테이프아웃으로 진행하지 말 것. 경고는 검토 대상이며 승인 시 면제 가능.",
     "WARNING: Loading the wrong rule deck will report false results. Always confirm the process node before running DRC.",
     "경고: 잘못된 규칙 세트를 불러오면 결과가 틀린다. DRC 실행 전 반드시 공정 노드를 확인한다."
    ]
   },
   {
    "type": "sim",
    "which": "layer",
    "intro": "먼저 레이어(층)의 개념을 익힙니다. DRC 위반은 항상 'METAL1', 'METAL2' 같은 특정 layer에서 발생합니다. 아래 인터랙티브 화면에서 각 레이어를 켜고 끄며 도형이 어느 층에 있는지, 리포트의 layer 이름과 화면 색이 어떻게 대응되는지 확인하세요."
   },
   {
    "type": "sim",
    "which": "drc",
    "intro": "이제 실제 DRC 검사를 실행해 봅니다. 아래 시뮬레이터에서 도형의 간격과 폭을 조정하며 검사를 돌리고, 화면에 뜨는 SPACING violation / WIDTH violation 메시지와 error/warning 개수를 읽어 보세요. measured 값과 min 값을 비교해 왜 위반이 났는지 스스로 판단하는 것이 목표입니다."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "해외 엔지니어가 방금 나온 DRC 리포트를 함께 보며 상태를 묻는다.",
      "q": {
       "en": "Is the block clean, or do we still have errors?",
       "ko": "이 블록 무결 상태예요, 아니면 아직 오류가 남았나요?"
      },
      "a": {
       "en": "Not clean yet. There are 18 errors, mostly spacing violations on METAL1.",
       "ko": "아직 무결 아니에요. 오류가 18개고, 대부분 METAL1의 간격 위반입니다."
      }
     },
     {
      "sit": "엔지니어가 특정 오류의 원인을 확인하려 한다.",
      "q": {
       "en": "This one says 'insufficient spacing, 0.11 versus 0.14'. What does that mean here?",
       "ko": "이건 'insufficient spacing, 0.11 대 0.14'라고 나오는데, 여기서 무슨 뜻이죠?"
      },
      "a": {
       "en": "The two metal lines are 0.11 micron apart, but the minimum spacing is 0.14. It is too close.",
       "ko": "두 금속 배선 간격이 0.11um인데 최소 간격은 0.14예요. 너무 가깝습니다."
      }
     },
     {
      "sit": "노란색 경고 항목을 어떻게 처리할지 상의한다.",
      "q": {
       "en": "And the two yellow warnings — do we have to fix them before tape-out?",
       "ko": "그리고 노란 경고 두 개는요, 테이프아웃 전에 꼭 고쳐야 하나요?"
      },
      "a": {
       "en": "No, those are warnings, not errors. We can waive them after a review and sign-off.",
       "ko": "아니요, 그건 경고지 오류가 아니에요. 검토와 승인 후 면제할 수 있습니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "**DRC (Design Rule Check)**는 레이아웃이 공정 규칙(최소 폭·간격)을 지키는지 검사하고, 위반을 **violation**으로 표시한다.",
     "**SPACING violation** = 도형 사이 간격이 **minimum spacing**보다 좁음(**insufficient spacing**). **WIDTH violation** = 도형 폭이 **minimum width**보다 얇음.",
     "리포트 판단은 **measured vs required/min** 비교로 한다: measured가 min보다 작으면 위반.",
     "심각도: **error = 반드시 수정**, **warning = 검토 후 판단(면제 가능)**, **info = 참고**. **clean**은 오류 0인 통과 상태.",
     "리포트 한 줄 = [severity] rule_ID : description @ (x, y) layer. 좌표와 layer로 화면의 **highlight marker** 위치를 찾는다."
    ],
    "done": "이제 붉은 줄이 뜬 DRC 화면을 보고 **무엇이, 어디서, 얼마나 심각하게** 위반됐는지 영어 그대로 읽어낼 수 있습니다. **error는 반드시 고치고, warning은 검토하라** — 이것이 현장 판단의 기본입니다."
   }
  ]
 },
 {
  "id": "w13",
  "title": "LVS 검증",
  "slides": [
   {
    "type": "story",
    "icon": "🔍",
    "title": "도면과 실제가 다르면?",
    "text": "야간 근무 중 후배 기술자가 화면을 보다가 당신을 부릅니다. 검증 리포트 맨 위에 빨간 글씨로 **LVS FAILED** 라고 떠 있습니다. 그 아래에는 **1 mismatch, 2 missing devices, 1 short**. 후배가 묻습니다. \"선배님, 이거 레이아웃을 잘못 그린 건가요, 아니면 회로도가 틀린 건가요?\" 당신은 침착하게 설명합니다. **LVS(Layout Versus Schematic)** 는 설계자가 그린 **schematic**(회로도)과 실제로 그려진 **layout**(레이아웃)이 전기적으로 똑같은지를 자동으로 비교하는 검증입니다. 두 개를 각각 **netlist**(넷리스트)로 뽑아서 소자 하나하나, 연결선 하나하나를 대조합니다. **match** 가 뜨면 통과, **mismatch** 가 뜨면 어딘가 다르다는 뜻이죠. 현장에서 우리가 읽어야 할 것은 바로 이 영문 리포트입니다. 어느 소자가 빠졌는지(**missing**), 어디가 붙어버렸는지(**short**), 어디가 끊어졌는지(**open**) — 영어 한 줄을 정확히 읽어내는 것이 오늘의 목표입니다."
   },
   {
    "type": "read",
    "title": "LVS란 무엇인가",
    "intro": "LVS는 '내가 그린 그림'과 '내가 의도한 회로'가 같은지 확인하는 검증입니다.",
    "paras": [
     "**LVS = Layout Versus Schematic**. 이름 그대로 **layout**(실제 배치된 도형)과 **schematic**(설계자가 의도한 회로도)을 서로(**Versus**) 비교하는 검증입니다. 화면에는 보통 **Compare Layout vs. Schematic** 또는 **LVS Run** 이라는 메뉴로 나타납니다.",
     "비교의 핵심은 도형을 직접 보는 게 아니라 **netlist**(넷리스트)로 변환해서 대조한다는 점입니다. 넷리스트는 '어떤 소자가, 어떤 핀끼리, 어떤 선(**net**)으로 연결되어 있는가'를 글자로 적어놓은 목록입니다.",
     "레이아웃에서는 **layout extraction**(레이아웃 추출) 과정을 통해 실제 그려진 도형에서 자동으로 넷리스트를 뽑아냅니다. 화면 로그에 **Extracting devices...**, **Building connectivity...** 같은 영문이 흘러갑니다.",
     "두 넷리스트가 완전히 같으면 리포트에 **LVS clean** 또는 **Match** 가 표시되고, 하나라도 다르면 **Mismatch** 와 함께 오류 목록이 나옵니다. 우리가 현장에서 읽어야 하는 것이 바로 이 오류 목록입니다.",
     "LVS가 검증하는 것은 '모양'이 아니라 '**connectivity**(연결 관계)'입니다. 선이 예쁘게 그려졌는지가 아니라, 전기적으로 같은 회로인지를 봅니다. 그래서 오류 메시지도 대부분 '무엇이 무엇에 잘못 연결/미연결되었다'는 문장입니다."
    ]
   },
   {
    "type": "read",
    "title": "검증 흐름 속에서의 LVS",
    "intro": "LVS는 혼자 돌아가지 않습니다. DRC·LVS·PEX로 이어지는 검증 흐름의 한 단계입니다.",
    "paras": [
     "먼저 **DRC(Design Rule Check)** 가 돌아갑니다. 이것은 선 간격·폭 같은 '물리적 규칙'을 지켰는지 보는 검사로, '그릴 수 있는 모양인가'를 판단합니다. LVS와는 별개의 검증입니다.",
     "DRC가 통과해도 **LVS** 는 따로 해야 합니다. DRC는 '잘 그렸다'만 보지, '설계 의도와 같은 회로인가'는 보지 않기 때문입니다. 모양은 규칙을 지켰어도 엉뚱한 net에 연결될 수 있습니다.",
     "현장 화면에서는 보통 **DRC → LVS → PEX** 순서로 버튼이 배치되어 있고, 각각 **Clean / Errors** 상태를 표시합니다. LVS가 clean이 되어야 다음 단계로 넘어갑니다.",
     "**PEX(Parasitic Extraction)** 는 LVS가 통과된 뒤 기생 저항·기생 용량을 뽑아내는 후속 단계입니다. LVS가 틀리면 PEX 결과도 믿을 수 없으므로, LVS clean이 전제 조건입니다.",
     "정리하면 **DRC = 모양 검사, LVS = 연결 검사, PEX = 성능 예측**입니다. 현장에서 \"LVS 못 넘어가서 PEX 못 돌린다\"는 말은 이 순서 때문입니다."
    ]
   },
   {
    "type": "read",
    "title": "LVS 오류의 종류를 읽는 법",
    "intro": "영문 리포트에 반복적으로 등장하는 오류 유형은 정해져 있습니다. 유형만 알면 절반은 읽은 것입니다.",
    "paras": [
     "**Missing device**(누락 소자): schematic에는 있는데 layout에는 없는 소자입니다. 리포트에는 **Device in schematic but not in layout** 형태로 나옵니다. 설계자가 의도한 트랜지스터를 레이아웃에서 안 그렸다는 뜻입니다.",
     "**Extra device**(잉여 소자): 반대로 layout에는 있는데 schematic에는 없는 소자입니다. **Device in layout but not in schematic** — 필요 없는 소자를 실수로 더 그린 경우입니다.",
     "**Incorrect connection**(잘못된 연결): 소자는 맞는데 연결된 **net**(노드)이 다른 경우입니다. **Net mismatch** 또는 **terminal connected to wrong net** 처럼 표시됩니다. 트랜지스터의 게이트가 엉뚱한 선에 붙은 상황이죠.",
     "**Short**(단락): 원래 떨어져 있어야 할 두 개의 net이 하나로 붙어버린 것입니다. 리포트의 **Nets shorted together** 또는 **Short between VDD and VSS** 같은 문장은 매우 위험한 신호입니다. 전원-접지 단락은 소자 파손으로 이어집니다.",
     "**Open**(단선): 원래 하나로 이어져야 할 net이 중간에 끊어진 것입니다. **Open net** 또는 **Net is not fully connected** 로 나타나며, 신호가 목적지까지 도달하지 못합니다.",
     "정리하면 소자 개수 문제는 **missing/extra device**, 연결 문제는 **incorrect connection/short/open** 입니다. 리포트를 읽을 때 '개수 이야기인가, 연결 이야기인가'부터 구분하면 원인 파악이 빨라집니다."
    ]
   },
   {
    "type": "read",
    "title": "화면과 리포트에서 오류가 보이는 방식",
    "intro": "LVS 결과는 텍스트 리포트와 GUI 하이라이트, 두 가지 형태로 함께 제공됩니다.",
    "paras": [
     "리포트 최상단에는 항상 총평이 한 줄로 뜹니다. **LVS PASSED / LVS FAILED**, 또는 **Layout matches schematic / Layout does NOT match schematic**. 이 한 줄로 통과 여부를 즉시 판단합니다.",
     "그 아래 **Summary**(요약) 표에는 유형별 개수가 나옵니다. 예: **Unmatched devices: 2**, **Unmatched nets: 1**, **Property errors: 0**. **Unmatched** 는 '짝을 못 찾은' 이라는 뜻으로 mismatch의 구체적 표현입니다.",
     "GUI에서는 문제 지점을 색으로 강조합니다. **Highlight errors** 버튼을 누르면 short난 net이 빨간색, open난 net이 노란색으로 레이아웃 위에 표시됩니다. 화면 안내문 **Click an error to zoom to location** 을 따라가면 됩니다.",
     "각 오류에는 위치 정보가 붙습니다. **at (X, Y)** 좌표나 **on net CLK**, **device M12** 처럼 어느 소자·어느 선인지 지목합니다. 이 식별자를 설계자에게 그대로 전달하면 소통이 정확해집니다.",
     "마지막으로 **Cross-probing**(크로스 프로빙) 기능은 리포트의 오류를 클릭하면 schematic과 layout에서 같은 지점을 동시에 띄워줍니다. 안내문 **Select in schematic and layout** 를 이해하면 원인을 눈으로 대조할 수 있습니다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "LVS 검증 화면과 리포트에서 반복되는 핵심 약어입니다.",
    "items": [
     {
      "ab": "LVS",
      "full": "Layout Versus Schematic",
      "ko": "레이아웃과 회로도 비교 검증"
     },
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "설계 규칙 검사 (LVS와 함께 도는 검증)"
     },
     {
      "ab": "ERC",
      "full": "Electrical Rule Check",
      "ko": "전기 규칙 검사 (short/open 등 전기 오류 점검)"
     },
     {
      "ab": "PEX",
      "full": "Parasitic Extraction",
      "ko": "기생 성분 추출 (LVS 후속 단계)"
     },
     {
      "ab": "VDD",
      "full": "Voltage Drain-Drain",
      "ko": "양(+) 전원 전압 노드"
     },
     {
      "ab": "VSS",
      "full": "Voltage Source-Source",
      "ko": "접지(0V) 노드"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (1) — 비교의 대상",
    "intro": "무엇과 무엇을 비교하는지, 그 재료가 되는 용어들입니다.",
    "items": [
     {
      "en": "netlist",
      "ko": "넷리스트",
      "d": "소자와 연결 관계를 글자로 적은 목록",
      "ex": "The tool converts the layout into a netlist before comparison."
     },
     {
      "en": "schematic",
      "ko": "회로도",
      "d": "설계자가 의도한 회로의 원본 도면",
      "ex": "This device exists in the schematic but not in the layout."
     },
     {
      "en": "layout",
      "ko": "레이아웃",
      "d": "실제 마스크로 그려진 물리적 배치",
      "ex": "LVS extracts a netlist from the layout automatically."
     },
     {
      "en": "device",
      "ko": "소자",
      "d": "트랜지스터·저항 등 회로의 개별 부품",
      "ex": "Two devices could not be matched between the two netlists."
     },
     {
      "en": "net",
      "ko": "노드/배선",
      "d": "전기적으로 같은 하나의 연결선",
      "ex": "The signal net CLK is not fully connected."
     },
     {
      "en": "connectivity",
      "ko": "연결 관계",
      "d": "소자들이 어떤 선으로 이어져 있는가",
      "ex": "LVS checks connectivity, not the shape of the wires."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (1)",
    "intro": "리포트 문장의 의미를 해석해 보세요.",
    "questions": [
     {
      "prompt": "리포트에 'Device in schematic but not in layout' 이 뜨면 무슨 뜻인가?",
      "opts": [
       "회로도에는 있으나 레이아웃에 그려지지 않은 누락 소자(missing device)",
       "레이아웃에 잘못 추가된 잉여 소자(extra device)",
       "두 배선이 붙어버린 단락(short)"
      ],
      "ans": 0
     },
     {
      "prompt": "'LVS checks connectivity' 에서 connectivity가 의미하는 것은?",
      "opts": [
       "도형의 모양과 크기",
       "소자들이 어떤 선으로 연결되어 있는가",
       "칩의 소비 전력"
      ],
      "ans": 1
     },
     {
      "prompt": "화면에 'Extracting devices...' 로그가 흐른다. 지금 진행 중인 작업은?",
      "opts": [
       "레이아웃에서 소자를 뽑아 넷리스트를 만드는 중",
       "회로도를 인쇄하는 중",
       "전원을 차단하는 중"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (2) — 결과와 판정",
    "intro": "비교 결과가 어떻게 표현되는지에 관한 용어들입니다.",
    "items": [
     {
      "en": "match",
      "ko": "일치",
      "d": "두 넷리스트가 전기적으로 동일함",
      "ex": "The layout matches the schematic. LVS passed."
     },
     {
      "en": "mismatch",
      "ko": "불일치",
      "d": "두 넷리스트가 어딘가 다름",
      "ex": "A net mismatch was found on the output node."
     },
     {
      "en": "unmatched",
      "ko": "짝을 못 찾음",
      "d": "대응되는 상대를 찾지 못한 소자/노드",
      "ex": "There are 2 unmatched devices in the summary."
     },
     {
      "en": "missing device",
      "ko": "누락 소자",
      "d": "회로도엔 있으나 레이아웃엔 없는 소자",
      "ex": "A missing device means it was not drawn in the layout."
     },
     {
      "en": "extra device",
      "ko": "잉여 소자",
      "d": "레이아웃엔 있으나 회로도엔 없는 소자",
      "ex": "Please delete the extra device that is not in the schematic."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (2)",
    "intro": "판정 관련 영어 표현을 해석해 보세요.",
    "questions": [
     {
      "prompt": "Summary에 'Unmatched nets: 1' 이라고 적혀 있다. 무슨 의미인가?",
      "opts": [
       "모든 배선이 정상 연결되었다",
       "대응되는 짝을 찾지 못한 배선이 1개 있다",
       "배선을 1개 새로 추가해야 한다"
      ],
      "ans": 1
     },
     {
      "prompt": "'The layout matches the schematic' 을 현장 판정으로 옮기면?",
      "opts": [
       "LVS 통과 — 레이아웃과 회로도가 동일함",
       "LVS 실패 — 재작업 필요",
       "검증이 아직 시작되지 않음"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (3) — 연결 오류",
    "intro": "가장 자주 마주치고, 가장 위험한 연결 관련 오류 용어입니다.",
    "items": [
     {
      "en": "short",
      "ko": "단락",
      "d": "떨어져야 할 두 net이 하나로 붙음",
      "ex": "Warning: a short between VDD and VSS was detected."
     },
     {
      "en": "open",
      "ko": "단선",
      "d": "이어져야 할 net이 중간에 끊김",
      "ex": "This net is open; the signal cannot reach the input."
     },
     {
      "en": "incorrect connection",
      "ko": "잘못된 연결",
      "d": "소자가 엉뚱한 net에 연결됨",
      "ex": "The gate is connected to the wrong net."
     },
     {
      "en": "terminal",
      "ko": "단자/핀",
      "d": "소자에서 배선이 붙는 접점",
      "ex": "This terminal is connected to the wrong net."
     },
     {
      "en": "highlight",
      "ko": "강조 표시",
      "d": "오류 지점을 색으로 표시함",
      "ex": "Click Highlight errors to see the short in red."
     },
     {
      "en": "re-run",
      "ko": "재실행",
      "d": "수정 후 검증을 다시 돌림",
      "ex": "Fix the error and re-run LVS until it is clean."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (3)",
    "intro": "연결 오류 문장을 해석해 보세요.",
    "questions": [
     {
      "prompt": "'A short between VDD and VSS was detected' 가 위험한 이유는?",
      "opts": [
       "전원과 접지가 붙어 과전류·소자 파손으로 이어질 수 있어서",
       "단순히 색이 예쁘지 않아서",
       "검증 시간이 길어져서"
      ],
      "ans": 0
     },
     {
      "prompt": "'This net is open' 이 뜻하는 상태는?",
      "opts": [
       "배선이 끊겨 신호가 목적지에 도달하지 못함",
       "배선이 정상적으로 연결됨",
       "배선이 두 개로 붙어버림"
      ],
      "ans": 0
     },
     {
      "prompt": "'The gate is connected to the wrong net' 은 어떤 오류 유형인가?",
      "opts": [
       "incorrect connection (잘못된 연결)",
       "missing device (누락 소자)",
       "extra device (잉여 소자)"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "핵심 용어 (4) — 진행과 마무리",
    "intro": "검증을 돌리고 마무리하는 단계에서 쓰는 용어들입니다.",
    "items": [
     {
      "en": "run",
      "ko": "실행",
      "d": "검증을 한 번 돌리는 동작",
      "ex": "Click Run to start the LVS comparison."
     },
     {
      "en": "clean",
      "ko": "오류 없음",
      "d": "오류가 하나도 없는 상태",
      "ex": "Re-run until the report is LVS clean."
     },
     {
      "en": "summary",
      "ko": "요약",
      "d": "오류를 유형별로 몰아 보여주는 칸",
      "ex": "Read the summary section of the report first."
     },
     {
      "en": "cross-probing",
      "ko": "크로스 프로빙",
      "d": "리포트-도면을 연동해 같은 지점 표시",
      "ex": "Use cross-probing to find the net in both views."
     },
     {
      "en": "tape out",
      "ko": "최종 제출",
      "d": "설계를 제조 단계로 넘기는 것",
      "ex": "Do not tape out until LVS is clean."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "확인 퀴즈 (4)",
    "intro": "진행·마무리 표현을 해석해 보세요.",
    "questions": [
     {
      "prompt": "'Re-run until the report is LVS clean' 이 지시하는 행동은?",
      "opts": [
       "오류가 0이 될 때까지 수정 후 검증을 반복한다",
       "한 번만 돌리고 끝낸다",
       "리포트를 삭제한다"
      ],
      "ans": 0
     },
     {
      "prompt": "'Do not tape out until LVS is clean' 의 의미는?",
      "opts": [
       "LVS 오류가 남은 채로 제조 단계로 넘기지 말라",
       "LVS를 건너뛰고 바로 제조하라",
       "clean이면 검증을 멈춰라"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "LVS VERIFICATION PROCEDURE",
    "paras": [
     "1. Load both the schematic netlist and the layout view before starting the run.",
     "1. 실행 전에 회로도 넷리스트와 레이아웃 뷰를 모두 불러옵니다.",
     "2. Select Verify > LVS and click Run to begin the comparison.",
     "2. Verify > LVS 메뉴를 선택하고 Run을 눌러 비교를 시작합니다.",
     "3. Wait until the status bar shows LVS PASSED or LVS FAILED.",
     "3. 상태 표시줄에 LVS PASSED 또는 LVS FAILED가 나올 때까지 기다립니다.",
     "4. If the run fails, open the report and read the Summary section first.",
     "4. 실패하면 리포트를 열고 Summary(요약) 항목부터 읽습니다.",
     "NOTE: A device shown 'in schematic but not in layout' is a missing device.",
     "참고: '회로도엔 있으나 레이아웃엔 없음'으로 표시된 소자는 누락 소자입니다.",
     "WARNING: Do NOT tape out the design while any short or open remains unresolved.",
     "경고: short(단락)나 open(단선)이 해결되지 않은 상태로 절대 최종 제출(tape out)하지 마십시오."
    ]
   },
   {
    "type": "manual",
    "mtitle": "READING THE LVS ERROR REPORT",
    "paras": [
     "Summary: Unmatched devices = 2, Unmatched nets = 1, Property errors = 0.",
     "요약: 짝을 못 찾은 소자 2개, 짝을 못 찾은 배선 1개, 속성 오류 0개.",
     "Error 1: Device M12 exists in layout but not in schematic (extra device).",
     "오류 1: 소자 M12가 레이아웃엔 있으나 회로도엔 없음 (잉여 소자).",
     "Error 2: Terminal 'gate' of M7 is connected to net N4; expected net CLK.",
     "오류 2: M7의 게이트 단자가 N4에 연결됨; 원래는 CLK에 연결되어야 함 (잘못된 연결).",
     "Error 3: Net VOUT is open; two segments are not joined.",
     "오류 3: 배선 VOUT가 끊겨 있음; 두 구간이 이어지지 않음 (단선).",
     "Action: Fix each error, then re-run LVS until the report shows LVS clean.",
     "조치: 각 오류를 수정한 뒤, 리포트가 LVS clean으로 나올 때까지 LVS를 다시 실행합니다."
    ]
   },
   {
    "type": "sim",
    "which": "lvs",
    "intro": "아래 시뮬레이터에서 schematic 넷리스트와 layout 넷리스트를 나란히 비교해 보세요. 각 소자와 net을 짝지어 가며 어디서 mismatch가 발생하는지 직접 찾아보고, 화면의 영문 판정(LVS PASSED / FAILED)을 소리 내어 읽어 봅니다."
   },
   {
    "type": "sim",
    "which": "lvs",
    "intro": "이번에는 오류가 포함된 케이스입니다. missing device, short, open 중 어떤 유형인지 영문 오류 메시지를 읽고 분류해 보세요. 오류를 수정한 뒤 다시 실행하여 리포트가 LVS clean으로 바뀌는지 확인합니다."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "해외 설계 엔지니어가 LVS 리포트를 함께 검토하며 상황을 확인한다.",
      "q": {
       "en": "The report says two devices are unmatched. Can you tell which side they are on?",
       "ko": "리포트에 소자 2개가 짝을 못 찾았다고 나오네요. 어느 쪽에 있는 건지 알려줄 수 있나요?"
      },
      "a": {
       "en": "One is a missing device in the layout, and the other is an extra device not in the schematic.",
       "ko": "하나는 레이아웃에서 누락된 소자이고, 다른 하나는 회로도에 없는 잉여 소자입니다."
      }
     },
     {
      "sit": "엔지니어가 가장 위험한 오류부터 확인하려 한다.",
      "q": {
       "en": "Is there any short or open in the power nets? That's my top priority.",
       "ko": "전원 배선에 단락이나 단선이 있나요? 그게 제일 급합니다."
      },
      "a": {
       "en": "Yes, there is a short between VDD and VSS. I highlighted it in red on the layout.",
       "ko": "네, VDD와 VSS 사이에 단락이 있습니다. 레이아웃에서 빨간색으로 강조해 두었습니다."
      }
     },
     {
      "sit": "수정 후 재검증 계획을 공유한다.",
      "q": {
       "en": "Okay, please fix the wrong connection first, then re-run and send me the result.",
       "ko": "좋아요, 잘못된 연결부터 고치고 다시 돌린 뒤 결과를 보내주세요."
      },
      "a": {
       "en": "Understood. I will re-run LVS and let you know when the report is clean.",
       "ko": "알겠습니다. LVS를 다시 실행하고 리포트가 clean으로 나오면 알려드리겠습니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "정리",
    "points": [
     "**LVS(Layout Versus Schematic)** 는 layout과 schematic을 각각 **netlist**로 뽑아 전기적 동일성을 비교하는 검증이다.",
     "판정은 한 줄로 나온다: **LVS PASSED / Match** 는 통과, **LVS FAILED / Mismatch** 는 재작업.",
     "소자 개수 문제는 **missing device / extra device**, 연결 문제는 **incorrect connection / short / open** 으로 구분해 읽는다.",
     "**short**(VDD-VSS 단락)와 **open**(배선 단선)은 가장 위험하며 해결 전 tape out 금지.",
     "검증 흐름은 **DRC(모양) → LVS(연결) → PEX(성능)** 이며, LVS clean이어야 다음 단계로 간다.",
     "리포트는 **Summary → Error 목록 → 위치(net/device 식별자)** 순으로 읽고, GUI의 **Highlight errors** 로 위치를 확인한다."
    ],
    "done": "이제 영문 LVS 리포트에서 **어떤 오류가 어디서** 났는지 스스로 읽어낼 수 있습니다. **한 줄의 영어를 정확히 읽는 힘**이 현장의 판단력입니다."
   }
  ]
 },
 {
  "id": "w14",
  "title": "종합 현장 보고",
  "slides": [
   {
    "type": "story",
    "icon": "📋",
    "title": "야간 근무 인계, 영어 리포트 한 장",
    "text": "새벽 6시, 야간조가 끝나고 인계 시간이다. 선임이 태블릿에 뜬 영어 **shift report** 한 장을 건네며 말한다. \"이거 3분 안에 읽고, 라인 상태 요약해서 주간조 반장한테 구두로 보고해줘.\" 화면에는 이런 문장이 있다. **Problem:** Chamber A pressure spiked to 12 mTorr during etch step 3. **Cause:** APC throttle valve stuck at 40%. **Action:** Aborted lot, switched to Chamber B, notified equipment engineer. **Result:** Lot recovered, chamber A placed **DOWN** pending PM. 당신이 할 일은 영작이 아니다. 이 **problem–cause–action–result** 4단 구조를 정확히 읽어내고, '지금 A 챔버는 정지 상태, B로 우회, 로트는 살렸다'를 한 문장으로 요약·판단하는 것이다. 오늘은 장비부터 디자인 검증까지 현장 전체를 아우르는 영어 보고문을 읽고, 무슨 일이 일어났고 지금 무엇을 해야 하는지 판단하는 훈련을 한다."
   },
   {
    "type": "read",
    "title": "현장 보고의 뼈대: Problem–Cause–Action–Result",
    "intro": "영어 현장 보고문은 대부분 4단 구조를 따른다. 이 순서를 알면 낯선 문장도 '어디를 읽어야 할지' 바로 잡힌다.",
    "paras": [
     "**Problem (문제)**: 무엇이 잘못됐는지. 보통 **abnormal**, **spiked**, **failed**, **out of spec**, **alarm triggered** 같은 단어가 신호다. 예: *Wafer scratch detected on lot #A231.* '무엇이/어디서/얼마나'를 먼저 잡는다.",
     "**Cause (원인)**: 왜 그 문제가 생겼는지. **due to**, **caused by**, **root cause**, **traced to** 뒤에 원인이 온다. 예: *Root cause traced to worn robot arm gripper.* 원인이 '확정(confirmed)'인지 '추정(suspected)'인지 단어로 구분해야 한다.",
     "**Action (조치)**: 실제로 무엇을 했는지. 과거형 동사가 줄줄이 온다 — **aborted**, **replaced**, **notified**, **rebooted**, **isolated**. 예: *Replaced gripper and re-qualified the tool.* 조치가 '임시(temporary fix)'인지 '영구(permanent)'인지가 핵심.",
     "**Result (결과)**: 조치 후 상태. **recovered**, **back to normal**, **still down**, **pending PM** 등. 예: *Tool back UP, monitoring for 24h.* 결과 문장이 곧 '지금 현재 상태'이므로, 구두 보고에서 가장 먼저 말해야 할 정보다.",
     "이 4단은 화면 **HMI** 이벤트 로그, 종이 **work instruction**, 이메일 **8D report** 어디서나 반복된다. 순서가 뒤섞여 있어도 각 문장을 P/C/A/R 중 어디에 속하는지 분류하며 읽으면 요약이 쉬워진다."
    ]
   },
   {
    "type": "read",
    "title": "상태·심각도를 나타내는 영어 신호어",
    "intro": "보고문에서 '지금 얼마나 심각한가'는 몇 개의 정해진 단어로 표현된다. 이 단어들의 강도 차이를 읽어야 올바르게 판단한다.",
    "paras": [
     "장비 상태는 세 단계로 압축된다. **UP** (정상 가동 가능), **DOWN** (정지, 생산 불가), **IDLE** (가동 가능하지만 대기 중). 보고문에서 *Tool is DOWN*을 보면 '생산 중단'이라는 뜻이며 즉시 위로 전달해야 한다.",
     "심각도(severity)는 보통 **Critical > Major > Minor** 순. **Critical**은 라인 정지·안전 위험, **Minor**는 모니터링만 하면 되는 수준. *Minor alarm, no action required*와 *Critical fault, line stopped*는 대응 자체가 다르다.",
     "조치의 성격을 구분하는 짝: **temporary fix / workaround** (임시 우회) vs **permanent fix / root-cause fix** (근본 해결). *Applied a temporary workaround*라고 쓰여 있으면 '문제가 아직 남아 있다'는 뜻으로 읽어야 한다.",
     "후속 필요를 알리는 표현: **pending** (~대기 중), **follow-up required**, **needs PM**, **escalated to engineer**. *Pending PM*은 '예방정비 전까지는 못 돌린다'는 강한 제약이다.",
     "확실성의 정도: **confirmed** (확인됨) / **suspected**, **likely** (추정) / **under investigation** (조사 중). 원인이 **suspected**면 아직 확정이 아니므로 '원인 미상' 취지로 보고해야 정확하다.",
     "이 신호어들은 HMI 상단 배너, 알람 팝업, 리포트 헤더에 색상(빨강=Critical)과 함께 뜨는 경우가 많다. 단어와 색을 함께 읽으면 오판을 줄인다."
    ]
   },
   {
    "type": "read",
    "title": "장비·공정·디자인을 아우르는 종합 보고",
    "intro": "종합 현장 보고는 장비 고장 하나만 다루지 않는다. 공정 이상, 검사 결과, 심지어 디자인 규칙 위반까지 같은 틀로 묶인다.",
    "paras": [
     "장비 측(equipment): 알람, 인터록, 밸브·로봇 고장 등이 **Problem**이 되고, 부품 교체·챔버 전환이 **Action**이 된다. HMI 로그가 1차 근거다.",
     "공정 측(process): SPC 관리도 이탈, 두께 드리프트, 파티클 급증(**particle excursion**) 등이 Problem으로 잡히며, 보통 **yield loss**(수율 손실)와 연결된다.",
     "검사·디자인 측(design/inspection): **DRC**(Design Rule Check) 위반, 레이아웃 간격 오류, 마스크 결함 등이 보고된다. 이때도 '위반 내용–원인–수정–재검증 결과'로 서술된다.",
     "세 측 모두 결국 같은 **P–C–A–R** 구조이므로, 분야가 바뀜어도 읽는 방법은 동일하다. 단어만 분야별로 다를 뿐이다.",
     "또한 각 보고에는 **impact**(영향 범위: 몇 로트, 몇 장)와 **follow-up owner**(후속 담당: 장비/공정/설계 엔지니어)가 명시된다. 구두 보고 시 이 둘을 빼면 반드시 되묻는다."
    ]
   },
   {
    "type": "read",
    "title": "교대 인수인계 로그 — 짧게 끊어 쓴 과거형",
    "intro": "보고의 실제 형태는 매끈한 문장이 아니라 '인수인계 로그(passdown)'다. 주어를 빼고 과거형으로 짧게 끊는다.",
    "paras": [
     "실제 passdown 예: **Found leak on Chamber B, replaced O-ring, tool back up.** (B챔버 누설 발견 → O-링 교체 → 장비 재가동). 'I found... and then I replaced...'로 풀어 쓰지 않는다.",
     "아직 안 끝난 일은 이렇게: **Etcher 3 still down, waiting on the part, escalated to the vendor.** (3호기 여전히 정지, 부품 대기 중, 벤더에 에스컬레이션).",
     "자주 쓰는 **덩어리 표현(청크)**: **tool is down / back up**(장비 정지/재가동), **waiting on the part**(부품 대기), **out of spec**(규격 이탈), **no trouble found (NTF)**(이상 없음), **placed down pending PM**(PM까지 정지 처리).",
     "읽을 때는 **[무엇을 발견 → 무엇을 조치 → 지금 상태]** 세 조각으로 끊는다. 이 순서가 곧 problem–action–status 다.",
     "핵심: passdown은 '잘 쓴 영어'가 목표가 아니라 **다음 근무자가 3초 안에 상태를 파악**하게 하는 것. 그래서 짧고 딱딱하다. 그 형태를 읽어내는 게 이 챕터의 실전 능력이다."
    ]
   },
   {
    "type": "acr",
    "title": "약어",
    "intro": "현장 보고문과 화면에서 반복적으로 마주치는 핵심 약어. 뜻을 모르면 문장 전체를 오해한다.",
    "items": [
     {
      "ab": "PM",
      "full": "Preventive Maintenance",
      "ko": "예방정비. 고장 전에 계획적으로 하는 정비. 'pending PM'=정비 대기."
     },
     {
      "ab": "OOS",
      "full": "Out Of Spec",
      "ko": "규격 이탈. 측정값이 허용 범위를 벗어남."
     },
     {
      "ab": "RCA",
      "full": "Root Cause Analysis",
      "ko": "근본 원인 분석. 재발 방지를 위한 원인 규명."
     },
     {
      "ab": "ECN",
      "full": "Engineering Change Notice",
      "ko": "설계·공정 변경 통지."
     },
     {
      "ab": "DRC",
      "full": "Design Rule Check",
      "ko": "설계 규칙 검사. 레이아웃이 제조 규칙을 지키는지 자동 검증."
     },
     {
      "ab": "SPC",
      "full": "Statistical Process Control",
      "ko": "통계적 공정 관리. 관리도로 공정 이상 감지."
     },
     {
      "ab": "CAPA",
      "full": "Corrective And Preventive Action",
      "ko": "시정 및 예방 조치. 문제 재발 방지 조치."
     },
     {
      "ab": "ETA",
      "full": "Estimated Time of Arrival",
      "ko": "예상 완료/도착 시각. 복구 ETA 등."
     },
     {
      "ab": "WO",
      "full": "Work Order",
      "ko": "작업 지시(서) — 정비·수리 요청 건"
     },
     {
      "ab": "NTF",
      "full": "No Trouble Found",
      "ko": "이상 없음 — 점검했으나 문제 재현 안 됨"
     },
     {
      "ab": "N/G",
      "full": "No Good",
      "ko": "불량 — 판정 실패"
     }
    ]
   },
   {
    "type": "glossary",
    "title": "보고 동사·상태 어휘 (1)",
    "intro": "Action과 Result 문장의 핵심이 되는 동사와 상태 표현. 읽고 뜻을 즉시 떠올릴 수 있어야 한다.",
    "items": [
     {
      "en": "abort",
      "ko": "중단하다",
      "d": "진행 중인 공정·로트를 도중에 강제로 멈춤.",
      "ex": "The operator aborted the lot when the pressure alarm triggered."
     },
     {
      "en": "isolate",
      "ko": "격리하다",
      "d": "문제 장비·구간을 라인에서 분리해 영향 차단.",
      "ex": "We isolated Chamber A to prevent further wafer damage."
     },
     {
      "en": "escalate",
      "ko": "상위 보고하다",
      "d": "현장에서 해결 못 할 때 엔지니어·관리자에게 올림.",
      "ex": "The issue was escalated to the equipment engineer at 3 AM."
     },
     {
      "en": "recover",
      "ko": "복구되다",
      "d": "장비·로트가 정상 상태로 돌아옴.",
      "ex": "The lot recovered after switching to the backup chamber."
     },
     {
      "en": "quarantine",
      "ko": "보류/격리 처리하다",
      "d": "의심 웨이퍼·로트를 사용 보류로 잡아둠.",
      "ex": "All wafers from the affected lot were quarantined for review."
     },
     {
      "en": "downtime",
      "ko": "정지 시간",
      "d": "장비가 생산하지 못한 시간.",
      "ex": "Total downtime for the tool was 2.5 hours."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "읽고 판단하기 (1)",
    "intro": "보고 문장의 뜻을 정확히 해석하세요. 영작이 아니라 '무슨 뜻인가'를 고릅니다.",
    "questions": [
     {
      "prompt": "보고문에 'Tool is DOWN, pending PM'이라고 적혀 있다. 무슨 뜻인가?",
      "opts": [
       "장비는 정상 가동 중이며 정비가 필요 없다",
       "장비가 정지 상태이고 예방정비 전까지는 돌릴 수 없다",
       "장비가 대기 상태이며 곧 자동 복구된다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Root cause traced to a worn robot gripper'에서 원인의 성격은?",
      "opts": [
       "원인이 아직 조사 중이라 확정되지 않았다",
       "원인이 마모된 로봇 그리퍼로 확인·확정되었다",
       "원인이 소프트웨어 오류로 추정된다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Applied a temporary workaround'라고 되어 있으면 어떻게 판단해야 하나?",
      "opts": [
       "근본 문제가 완전히 해결되었다",
       "문제가 아직 남아 있고 임시로 우회했을 뿐이다",
       "장비를 폐기하기로 결정했다"
      ],
      "ans": 1
     }
    ]
   },
   {
    "type": "glossary",
    "title": "보고 동사·상태 어휘 (2)",
    "intro": "Problem과 Cause 문장에서 자주 나오는 표현. 이상 현상과 원인을 나타내는 말들이다.",
    "items": [
     {
      "en": "spike",
      "ko": "급등(하다)",
      "d": "값이 짧은 시간에 비정상적으로 치솟음.",
      "ex": "The chamber pressure spiked to 12 mTorr during the etch step."
     },
     {
      "en": "drift",
      "ko": "서서히 변동하다",
      "d": "값이 천천히 규격에서 벗어나는 경향.",
      "ex": "The film thickness slowly drifted out of spec over three lots."
     },
     {
      "en": "trigger",
      "ko": "발동시키다",
      "d": "알람·인터록을 작동하게 만듦.",
      "ex": "A door-open condition triggered the safety interlock."
     },
     {
      "en": "interlock",
      "ko": "인터록(안전 연동)",
      "d": "안전 조건이 안 맞으면 동작을 막는 잠금 장치.",
      "ex": "The interlock prevented the tool from starting with the lid open."
     },
     {
      "en": "defect",
      "ko": "결함",
      "d": "웨이퍼·패턴의 불량 지점.",
      "ex": "Inline inspection found 14 defects on the wafer surface."
     },
     {
      "en": "yield loss",
      "ko": "수율 손실",
      "d": "불량으로 인해 정상 칩 비율이 떨어짐.",
      "ex": "The particle excursion caused a 3% yield loss on that lot."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "읽고 판단하기 (2)",
    "intro": "다음 영어 표현이 현장에서 뜻하는 바를 고르세요.",
    "questions": [
     {
      "prompt": "'The film thickness drifted out of spec over three lots.' 어떤 상황인가?",
      "opts": [
       "두께가 한 번에 급등해 즉시 알람이 울렸다",
       "두께가 세 로트에 걸쳐 서서히 규격을 벗어났다",
       "두께가 항상 규격 안에서 안정적이었다"
      ],
      "ans": 1
     },
     {
      "prompt": "'A door-open condition triggered the safety interlock.'의 의미는?",
      "opts": [
       "문이 열린 상태가 안전 잠금을 작동시켜 동작을 막았다",
       "안전 잠금을 해제하기 위해 일부러 문을 열었다",
       "문이 닫혀 있어서 알람이 꺼졌다"
      ],
      "ans": 0
     },
     {
      "prompt": "구두 보고 시, Result 문장 'Lot recovered, tool back UP, monitoring 24h'에서 반장에게 가장 먼저 전할 핵심은?",
      "opts": [
       "로트는 살았고 장비는 다시 정상 가동, 24시간 모니터링 중",
       "장비를 폐기하고 로트를 스크랩했다",
       "원인 조사를 아직 시작하지 못했다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "보고서 구조·화면 어휘 (3)",
    "intro": "보고서의 틀과 HMI 화면에서 직접 마주치는 표현. 구조를 알면 어느 칸을 읽어야 할지 바로 보인다.",
    "items": [
     {
      "en": "handover",
      "ko": "인계/인수인계",
      "d": "교대 시 이전 조가 다음 조에게 상황을 넘김.",
      "ex": "Please read the handover notes before you start your shift."
     },
     {
      "en": "impact",
      "ko": "영향 범위",
      "d": "문제가 몇 로트·몇 장에 영향을 줍는지.",
      "ex": "Impact: two lots affected, about 50 wafers on hold."
     },
     {
      "en": "status",
      "ko": "상태",
      "d": "지금 장비·로트가 어떤 상태인지.",
      "ex": "Current status: Chamber A DOWN, Chamber B running normally."
     },
     {
      "en": "follow-up",
      "ko": "후속 조치",
      "d": "이후에 누가 무엇을 더 해야 하는지.",
      "ex": "Follow-up: equipment engineer to complete PM by 12:00."
     },
     {
      "en": "on hold",
      "ko": "보류 중",
      "d": "진행을 멈추고 대기시켜 둔 상태.",
      "ex": "The lot is on hold until the inspection result comes back."
     },
     {
      "en": "acknowledge",
      "ko": "(알람을) 확인하다",
      "d": "HMI에서 알람을 읽었다고 확인 처리함.",
      "ex": "The operator must acknowledge the alarm before resuming the run."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "읽고 판단하기 (3)",
    "intro": "보고서 항목과 화면 메시지를 올바르게 해석하세요.",
    "questions": [
     {
      "prompt": "보고서에 'Impact: two lots affected, ~50 wafers on hold'이 있다. 무슨 뜻인가?",
      "opts": [
       "두 로트, 약 50장이 영향을 받아 보류 중이다",
       "두 로트가 이미 폐기되었다",
       "50장이 모두 정상 출하되었다"
      ],
      "ans": 0
     },
     {
      "prompt": "HMI에 'Acknowledge alarm before resuming'이라고 뜨면 작업자는?",
      "opts": [
       "알람을 무시하고 바로 재가동한다",
       "재가동 전에 알람을 확인 처리해야 한다",
       "장비를 꿄야 한다"
      ],
      "ans": 1
     },
     {
      "prompt": "'Follow-up: equipment engineer to complete PM by 12:00'의 뜻은?",
      "opts": [
       "12시까지 장비 엔지니어가 예방정비를 끝내야 한다",
       "12시에 생산을 중단해야 한다",
       "예방정비가 이미 끝났다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "glossary",
    "title": "설계·검증(DRC) 관련 어휘 (4)",
    "intro": "디자인 룰 체크와 검증 화면에서 나오는 영어. 장비가 아닌 '설계' 상황 보고도 같은 구조로 읽는다.",
    "items": [
     {
      "en": "violation",
      "ko": "규칙 위반",
      "d": "레이아웃이 제조 규칙(design rule)을 어긴 지점.",
      "ex": "The DRC report shows 8 spacing violations in the layout."
     },
     {
      "en": "spacing",
      "ko": "간격",
      "d": "패턴 사이의 최소 거리 규칙.",
      "ex": "Minimum metal spacing must be at least 0.10 um."
     },
     {
      "en": "clean (DRC clean)",
      "ko": "위반 없음",
      "d": "검사 결과 오류가 하나도 없는 상태.",
      "ex": "After the fix, the layout came back DRC clean."
     },
     {
      "en": "waive",
      "ko": "예외 처리하다",
      "d": "검토 후 특정 위반을 의도된 것으로 인정해 넘김.",
      "ex": "The two known violations were waived with reviewer approval."
     },
     {
      "en": "layer",
      "ko": "레이어(층)",
      "d": "마스크/공정 단계별 설계 층.",
      "ex": "The violation is on the metal-1 layer, not poly."
     },
     {
      "en": "re-run",
      "ko": "재실행",
      "d": "수정 후 검사를 다시 돌림.",
      "ex": "Please re-run the DRC after applying the spacing fix."
     }
    ]
   },
   {
    "type": "quiz",
    "title": "읽고 판단하기 (4)",
    "intro": "DRC·검증 화면의 영어 메시지를 올바르게 해석하세요.",
    "questions": [
     {
      "prompt": "'The layout came back DRC clean.'의 뜻은?",
      "opts": [
       "검사 결과 위반이 하나도 없다",
       "검사에서 위반이 8개 나왔다",
       "레이아웃을 지워야 한다"
      ],
      "ans": 0
     },
     {
      "prompt": "'The two known violations were waived with reviewer approval.' 어떻게 읽나?",
      "opts": [
       "두 위반이 심각해서 작업이 중단됐다",
       "알려진 두 위반은 검토자 승인으로 예외 처리됐다",
       "두 위반이 자동으로 수정됐다"
      ],
      "ans": 1
     },
     {
      "prompt": "검증 보고서에 'Please re-run the DRC after applying the spacing fix'라고 있다. 다음 할 일은?",
      "opts": [
       "간격 수정을 적용한 뒤 DRC를 다시 돌린다",
       "수정 없이 그대로 출하한다",
       "간격을 더 줄인다"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "manual",
    "mtitle": "SHIFT HANDOVER REPORT — READING GUIDE",
    "paras": [
     "PROBLEM: During night shift, Chamber A chamber pressure spiked above 10 mTorr and the process alarm triggered on etch step 3.",
     "문제: 야간조 중 A 챔버 압력이 10 mTorr를 초과해 급등했고, 식각 3단계에서 공정 알람이 발동했다.",
     "CAUSE: Root cause traced to the APC throttle valve stuck at 40% open. Confirmed by valve position log.",
     "원인: 근본 원인은 APC 스로틀 밸브가 40% 개방 상태로 고착된 것으로, 밸브 위치 로그로 확인됨(추정이 아닌 확정).",
     "ACTION: Aborted the running lot, isolated Chamber A, rerouted the lot to Chamber B, and escalated to the equipment engineer.",
     "조치: 진행 로트 중단, A 챔버 격리, 로트를 B 챔버로 우회, 장비 엔지니어에게 상위 보고함.",
     "RESULT: Lot recovered with no wafer loss. Chamber A placed DOWN, pending PM. ETA to recovery: 6 hours.",
     "결과: 로트는 웨이퍼 손실 없이 복구됨. A 챔버는 DOWN 상태로 예방정비 대기, 복구 예상 6시간."
    ]
   },
   {
    "type": "manual",
    "mtitle": "WORK INSTRUCTION — WHEN YOU RECEIVE A DOWN REPORT",
    "paras": [
     "NOTE: A tool marked DOWN must not be run until an engineer clears it, even if the alarm has cleared on the HMI.",
     "주의: DOWN으로 표시된 장비는 HMI에서 알람이 사라졌더라도 엔지니어가 해제(clear)하기 전까지 가동하면 안 된다.",
     "Verify the current tool state on the HMI status banner before reporting to the next shift.",
     "다음 조에 보고하기 전에 HMI 상태 배너에서 현재 장비 상태를 반드시 확인한다.",
     "If the report says 'temporary workaround applied', treat the tool as still at risk and inform the incoming operator.",
     "보고문에 'temporary workaround applied'라고 있으면 장비가 여전히 위험 상태라고 보고 다음 작업자에게 알린다.",
     "WARNING: Do NOT release any quarantined lot back to production without written engineering approval.",
     "경고: 보류(quarantine) 처리된 로트는 서면 엔지니어링 승인 없이 절대 생산으로 되돌리지 않는다."
    ]
   },
   {
    "type": "manual",
    "mtitle": "NIGHT SHIFT PASSDOWN LOG (raw)",
    "paras": [
     "EQP-204 (Etcher 3): Unscheduled down at 02:10. RF fault, reflected power high. NTF after re-tune. Tool back up 03:05. Watch reflected power.",
     "EQP-204(3호기): 02:10 비계획 정지. RF 고장, 반사파 높음. 재매칭 후 이상 없음(NTF). 03:05 재가동. 반사파 계속 주시할 것.",
     "EQP-118 (CVD B): Chamber pressure out of spec during lot 7. Aborted lot, switched to Chamber A. Placed down pending PM.",
     "EQP-118(CVD B): 로트 7 중 챔버 압력 규격 이탈(OOS). 로트 중단, A챔버로 우회. PM까지 정지 처리.",
     "Open items: Etcher 5 waiting on the part (turbo pump), ETA tomorrow AM. WO #4471 still open. Escalated to vendor.",
     "미결 항목: 5호기 부품(터보펌프) 대기, 예상 도착(ETA) 내일 오전. 작업지시(WO) #4471 미결. 벤더 에스컬레이션.",
     "NOTE: Read every line as [what was found] -> [what was done] -> [current status]. Confirm any tool marked 'down' before you start it.",
     "참고: 각 줄을 [발견]->[조치]->[현재 상태]로 끊어 읽을 것. 'down'으로 표시된 장비는 가동 전 반드시 상태를 확인하라."
    ]
   },
   {
    "type": "quiz",
    "title": "인수인계 로그 읽기 — 판단",
    "intro": "위 passdown 로그 표현을 읽고 뜻을 고르시오.",
    "questions": [
     {
      "prompt": "'Etcher 3 still down, waiting on the part.' 무슨 상태인가?",
      "opts": [
       "3호기 정상 가동 중",
       "3호기 여전히 정지, 부품 기다리는 중",
       "3호기 부품 교체 완료"
      ],
      "ans": 1
     },
     {
      "prompt": "'NTF after re-tune' 의 뜻은?",
      "opts": [
       "재매칭 후에도 고장",
       "재매칭 후 이상 없음(문제 재현 안 됨)",
       "새 부품으로 교체함"
      ],
      "ans": 1
     },
     {
      "prompt": "'Placed down pending PM' 이 뜻하는 것은?",
      "opts": [
       "PM(예방정비)까지 정지 상태로 둠",
       "PM을 취소함",
       "즉시 재가동함"
      ],
      "ans": 0
     },
     {
      "prompt": "passdown 로그를 읽는 올바른 3조각 순서는?",
      "opts": [
       "[발견] -> [조치] -> [현재 상태]",
       "[결론] -> [원인] -> [인사]",
       "[가격] -> [수량] -> [날짜]"
      ],
      "ans": 0
     }
    ]
   },
   {
    "type": "sim",
    "which": "equipment",
    "intro": "아래 장비 HMI 화면을 열어보세요. 화면 상단의 상태 배너(UP/DOWN/IDLE)와 알람 로그의 영어 문장을 읽고, 이 장비가 지금 '가동 가능한지'를 판단하는 연습입니다. 특히 Problem·Cause·Action이 로그 어디에 나타나는지 찾아보세요."
   },
   {
    "type": "sim",
    "which": "drc",
    "intro": "아래 DRC(Design Rule Check) 결과 화면을 살펴보세요. 디자인 검증 단계에서 나오는 영어 위반 메시지(violation)를 읽고, 어떤 것이 Critical이고 어떤 것이 Minor인지, 그리고 보고문의 Problem 항목으로 무엇을 써 넣을지 판단하는 연습입니다. 장비뿐 아니라 설계 검증 상황도 같은 P–C–A–R 구조로 보고됩니다."
   },
   {
    "type": "sim",
    "which": "report",
    "intro": "아래 종합 보고서 화면에서 Problem / Cause / Action / Result 4개 칸에 흩어진 영어 문장을 읽고, 각 문장을 올바른 칸으로 분류한 뒤 전체 상황을 한 문장으로 요약해 보세요. 이것이 오늘 배운 것을 실제 구두 보고로 옮기는 마지막 통합 훈련입니다."
   },
   {
    "type": "comm",
    "items": [
     {
      "sit": "새벽에 라인에 온 외국인 장비 엔지니어가 인계 상황을 묻는다.",
      "q": {
       "en": "I just got in. Can you give me a quick summary of what happened on Chamber A tonight?",
       "ko": "방금 도착했어요. 오늘 밤 A 챔버에 무슨 일이 있었는지 짧게 요약해줄래요?"
      },
      "a": {
       "en": "Sure. Pressure spiked on etch step 3, the throttle valve was stuck, we aborted the lot and rerouted it to Chamber B. The lot is fine. Chamber A is DOWN, pending PM.",
       "ko": "네. 식각 3단계에서 압력이 급등했고, 스로틀 밸브가 고착돼서 로트를 중단하고 B 챔버로 우회했어요. 로트는 정상입니다. A 챔버는 DOWN, 정비 대기 상태예요."
      }
     },
     {
      "sit": "엔지니어가 원인이 확정된 것인지 확인하려 한다.",
      "q": {
       "en": "Is the root cause confirmed, or is it still just suspected?",
       "ko": "근본 원인이 확정된 건가요, 아니면 아직 추정인가요?"
      },
      "a": {
       "en": "It's confirmed. The valve position log shows it stuck at 40%. It's in the report under 'Cause'.",
       "ko": "확정입니다. 밸브 위치 로그에 40%로 고착된 게 나와요. 보고서 'Cause' 항목에 적혀 있어요."
      }
     },
     {
      "sit": "엔지니어가 후속 조치와 복구 예상 시간을 묻는다.",
      "q": {
       "en": "Got it. Anything pending on my side, and what's the ETA to bring the tool back up?",
       "ko": "알겠어요. 제가 처리할 미결 사항이 있나요, 그리고 장비 복구 예상 시간은요?"
      },
      "a": {
       "en": "The tool needs PM before it can run again. It was escalated to you at 3 AM, and the report lists an ETA of about six hours.",
       "ko": "장비는 재가동 전에 PM이 필요합니다. 새벽 3시에 엔지니어님께 상위 보고됐고, 보고서상 복구 예상은 약 6시간입니다."
      }
     }
    ]
   },
   {
    "type": "wrap",
    "title": "마무리: 읽고, 분류하고, 한 문장으로",
    "points": [
     "모든 현장 보고는 **Problem – Cause – Action – Result** 4단으로 읽으면 요약이 쉬워진다.",
     "상태어 **UP / DOWN / IDLE**, 심각도 **Critical / Major / Minor**, 확실성 **confirmed / suspected**를 정확히 구분한다.",
     "**temporary workaround**와 **pending PM**은 '문제가 남아 있다'는 강한 신호로 읽는다.",
     "구두 보고는 **Result(현재 상태)**를 가장 먼저 말하고, 이어서 원인·조치·후속을 붙인다.",
     "장비 HMI, DRC 검증, 종합 보고서 모두 같은 P–C–A–R 구조를 공유한다 — 영작이 아니라 정확한 읽기·판단이 핵심이다."
    ],
    "done": "이제 낯선 영어 보고문 한 장을 받아도 **무슨 일이 있었고, 지금 라인이 어떤 상태인지**를 3분 안에 읽고 판단해 구두로 보고할 수 있다. 수고했다!"
   }
  ]
 },
 {
  "id": "w15",
  "title": "종합 점검",
  "kind": "평가",
  "slides": [
   {
    "type": "story",
    "icon": "🎓",
    "title": "종합 점검 안내",
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
    "done": "🎓 **종합 점검 완료 · 전 과정 수료!**"
   }
  ]
 }
];
