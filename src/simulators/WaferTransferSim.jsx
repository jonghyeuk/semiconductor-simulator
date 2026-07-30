import React from 'react';

/**
 * 웨이퍼 이송 로봇/센서 시뮬레이터 (서고 자료실용 래퍼)
 * 규격서 ③ prop 계약 준수. 실체는 public/topic-sims/wafer-transfer-sim.html.
 *
 * mount 예)
 *   { id:'waferTransfer', label:'Pick & Place', mount:{ initialChapter:5, hideOtherTabs:true } }
 */
export default function WaferTransferSim({
  hideTabBar = false,     // 자료실에서 true 로 들어옴 (내부 탭바가 없으므로 미사용)
  controlledTab,          // 상위 탭 (본 시뮬은 단일 뷰라 미사용)
  onTabChange,            // 미사용
  initialTab,             // 서고 카드에서 넘어오는 탭 id ('chapters' 또는 'ch5' 형태 허용)
  initialChapter,         // 1~15. 특정 챕터로 진입
  initialUnit,            // (별칭) initialChapter 와 동일
  initialWeek,            // (별칭) initialChapter 와 동일
  initialTheme,           // 'week5' 형태도 허용 (레지스트리 관례 호환)
  hideOtherTabs = false,  // true 면 챕터 선택 바를 숨겨 그 챕터만 노출
  deckPath = '/topic-decks/wafer-transfer.html', // 시뮬 안 '교재' 버튼이 열 데크
}) {
  // 'ch5' · 'chapter5' · 'unit5' · 'week5' 형태의 문자열에서 챕터 번호를 뽑아낸다.
  const parseChapter = (v) =>
    typeof v === 'string' && /^(?:ch|chapter|unit|week)(\d+)$/.test(v)
      ? Number(v.replace(/^(?:ch|chapter|unit|week)/, ''))
      : undefined;

  const wk =
    initialChapter ??
    initialUnit ??
    initialWeek ??
    parseChapter(initialTab) ??
    parseChapter(initialTheme);

  const params = new URLSearchParams();
  if (wk) params.set('ch', String(wk));
  if (hideOtherTabs) params.set('lock', '1');
  if (deckPath) params.set('deck', deckPath);
  const qs = params.toString();
  const src = `/topic-sims/wafer-transfer-sim.html${qs ? `?${qs}` : ''}`;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 560, display: 'flex' }}>
      <iframe
        src={src}
        title="웨이퍼 이송 로봇·센서 시뮬레이터"
        style={{ flex: 1, width: '100%', border: 0, borderRadius: 12, display: 'block', background: '#0b141c' }}
        allow="fullscreen"
      />
    </div>
  );
}
