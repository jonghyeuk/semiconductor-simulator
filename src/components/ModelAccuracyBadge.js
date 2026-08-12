import React, { useState, useEffect, useRef } from 'react';
import { MODEL_ACCURACY } from '../data/modelAccuracy';

/**
 * 계산값이 교육용 모델에서 나온 것임을 알리는 배지.
 *
 * 화면을 어지럽히지 않는 게 1순위라, 평소에는 작은 알약 하나로만 있고
 * 눌렀을 때만 해당 시뮬레이터의 구체적인 한계를 펼친다.
 * App.js 한 곳에 붙어 모든 시뮬레이터에 적용되므로 시뮬레이터 파일은 건드리지 않는다.
 *
 * 물리 계산이 없는 시뮬레이터(영어 학습·이송 교재·종합평가)에는 뜨지 않는다.
 *
 * variant:
 *   'floating' — 데스크톱. 우하단에 떠 있다.
 *   'inline'   — 모바일. 상단 헤더 안에 들어간다.
 *                일부 시뮬레이터가 모바일에서 가로로 넘쳐서, right 기준 fixed 요소는
 *                화면 밖으로 밀려난다. 그래서 모바일은 왼쪽 기준으로 붙인다.
 */
const ModelAccuracyBadge = ({ simulatorId, variant = 'floating' }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const info = MODEL_ACCURACY[simulatorId];
  const isInline = variant === 'inline';

  // 시뮬레이터를 바꾸면 열려 있던 패널은 닫는다.
  useEffect(() => setOpen(false), [simulatorId]);

  // 바깥 클릭 · ESC 로 닫기
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!info) return null;

  const panel = (
    <div
      role="dialog"
      aria-label="계산값 정확도 안내"
      className={
        isInline
          ? 'fixed left-2 top-12 z-50 w-80 max-w-[calc(100%-1rem)] max-h-[70vh] overflow-y-auto rounded-xl border border-amber-200 bg-white p-4 shadow-xl'
          : 'mb-2 w-[22rem] max-h-[60vh] overflow-y-auto rounded-xl border border-amber-200 bg-white p-4 shadow-xl'
      }
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-amber-900">교육용 모델 안내</h4>
        <button
          onClick={() => setOpen(false)}
          aria-label="닫기"
          className="-mt-1 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-gray-700">
        이 화면의 숫자는 <strong>교육용 모델</strong>이 계산한 값입니다.{' '}
        <strong className="text-amber-800">실제 장비의 계측값과 다릅니다.</strong> 공정 변수 사이의
        관계와 경향을 익히는 용도이며, 실제 공정 조건 산출이나 장비 판단에 그대로 쓰지 마세요.
      </p>

      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">계산 근거</p>
      <p className="mb-3 text-xs text-gray-600">{info.basis}</p>

      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        이 시뮬레이터의 한계
      </p>
      <ul className="space-y-1.5">
        {info.points.map((point, i) => (
          <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-gray-700">
            <span className="mt-[3px] text-amber-400">•</span>
            <span dangerouslySetInnerHTML={{ __html: renderEmphasis(point) }} />
          </li>
        ))}
      </ul>
    </div>
  );

  const pill = (
    <button
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      title="이 화면의 숫자는 교육용 모델값입니다"
      className={`flex items-center gap-1 rounded-full border font-medium shadow-sm transition-colors ${
        isInline ? 'px-2 py-0.5 text-[10px]' : 'gap-1.5 px-2.5 py-1 text-[11px]'
      } ${
        open
          ? 'border-amber-300 bg-amber-100 text-amber-900'
          : 'border-gray-200 bg-white/85 text-gray-500 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800'
      }`}
    >
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
      </svg>
      교육용 모델
    </button>
  );

  if (isInline) {
    return (
      <span ref={wrapRef} className="shrink-0">
        {pill}
        {open && panel}
      </span>
    );
  }

  return (
    <div ref={wrapRef} className="fixed bottom-3 right-3 z-40 hidden md:block print:hidden">
      {open && panel}
      {pill}
    </div>
  );
};

/** 문구 안의 **강조** 만 굵게. 다른 HTML 은 그대로 이스케이프한다. */
function renderEmphasis(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-800">$1</strong>');
}

export default ModelAccuracyBadge;
