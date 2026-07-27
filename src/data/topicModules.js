/**
 * topicModules.js — 서고(주제 자료실) 데이터 엔트리 (규격 v1 ①)
 * ---------------------------------------------------------------------------
 * 이 파일은 "책 1권 = 주제 모듈"의 메타·목차·연결 정보를 담는다.
 * 서고 호스트(TopicLibrary)가 있으면 이 배열을 읽어 책장에 꽂는다.
 * 이 레포에는 서고 인프라가 없어도, 아래 엔트리는 규격을 만족하는 drop-in 원본이다.
 *
 * 연결 키:
 *   - sims[].id  == simulatorRegistry 의 id  ('field-english')
 *   - deck 경로  == public/topic-decks/ 의 HTML 파일 경로
 */

export const TOPIC_CHAPTERS = [
  {
    id: 'topic.fieldEnglish',
    title: '반도체 현장 실무영어',
    category: 'assessment',            // 5분야 enum: foundation|process|equipment|analysis|deviceIndustry|assessment
    processStage: null, stageOrder: null,
    equipment: ['Plasma Etcher', 'Vacuum System', 'Design Rule / DRC / LVS'],
    level: 'basic',
    estMinutes: 60,
    objectives: [
      '가상 장비 매뉴얼과 조작 화면의 영문을 읽고 순서대로 운전할 수 있다.',
      '영문 Alarm/Log를 해석해 이상 장치·원인·조치를 판단할 수 있다.',
      'DRC/LVS 영문 오류 메시지를 읽고 위치와 수정 방향을 설명할 수 있다.',
      '장비·공정·디자인 정보를 종합해 영문 현장 보고서를 작성할 수 있다.',
    ],
    // ★ 책장 호버 '연관 구름'에 뜨는 핵심 개념 (4~5개 권장)
    keyConcepts: ['Equipment English', 'Alarm & Log', 'DRC violation', 'LVS mismatch', 'Field report'],

    // ② 시뮬 링크 — 한 컴포넌트(field-english)의 5개 개념을 mount 로 쪼개 목차 개별 항목으로 노출
    sims: [
      { id: 'field-english', label: '⓪ 강의 개요 (Course Map)', teachTip: '강의자용 한눈에 보기: 4단계 루프·장비/디자인 축·평가', mount: { initialTheme: 'overview', hideOtherTabs: true } },
      { id: 'field-english', label: '① 가상 장비 조작 (Equipment HMI)', teachTip: '메뉴를 클릭해 영문 상태를 읽고 순서대로 운전', mount: { initialTheme: 'equipment', hideOtherTabs: true } },
      { id: 'field-english', label: '② 알람·로그 해석 (Alarm & Log)', teachTip: '영문 알람을 읽고 이상 장치·원인·조치 선택', mount: { initialTheme: 'alarm', hideOtherTabs: true } },
      { id: 'field-english', label: '③ DRC 오류 해석 (Design Rule Check)', teachTip: 'Width/Spacing을 조절하고 영문 violation 로그 해석', mount: { initialTheme: 'drc', hideOtherTabs: true } },
      { id: 'field-english', label: '④ LVS 비교 (Layout vs Schematic)', teachTip: 'mismatch 영문 메시지로 missing/incorrect 판단', mount: { initialTheme: 'lvs', hideOtherTabs: true } },
      { id: 'field-english', label: '⑤ 영문 현장 보고 (Field Report)', teachTip: 'Problem/Observed/Cause/Action/Result 영어로 작성', mount: { initialTheme: 'report', hideOtherTabs: true } },
    ],

    // 교과서 데크 — 3수준 자동 탐색(.intro/.standard/.pro)
    deck: '/topic-decks/field-english.html',
    tiered: true,
    body: [],
    fieldTip: '디자인 툴 사용법이 아니라 "영문을 읽고 판단하는" 훈련. 매주 4단계 루프를 반복한다.',
    prerequisites: [],
    sourceRefs: { day: [14], script: 'field-english-course' },
  },
];

export default TOPIC_CHAPTERS;
