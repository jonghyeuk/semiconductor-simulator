/**
 * 식각 관련 화면을 단일 HTML 한 장으로 묶는다 — 검토용.
 *
 * 목적은 하나다. 저장소를 받거나 빌드를 돌리지 않고도 **링크 하나로** 새 화면들을
 * 눈으로 확인하는 것. 디자인·내용 검토용이고 배포물이 아니다.
 *
 * 중요: 화면 소스를 여기서 다시 쓰지 않는다. src 의 컴포넌트와 물리 모듈을
 * **그대로 읽어서** 트랜스파일한다. 따라서 앱에서 보는 것과 이 HTML 이 보여 주는
 * 것이 어긋날 수 없다. 컴포넌트를 고치면 이 스크립트를 다시 돌리면 된다.
 *
 * build-etching-bay-standalone.mjs 와 같은 방식인데, 화면을 둘 이상 담기 위해
 * 카드마다 IIFE 로 스코프를 격리한다. EtchingBay 와 EtchingBasics 는 둘 다
 * 모듈 최상위에 `clamp` 를 선언하고 있어서, 한 스코프에 그냥 이어 붙이면 충돌한다.
 *
 *   node scripts/build-etching-preview.mjs [출력경로]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { transformSync } from '@babel/core';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const out = process.argv[2] || resolve(root, 'build', 'etching-preview.html');

const read = (p) => readFileSync(resolve(root, p), 'utf8');
const require_ = (name) => resolve(root, 'node_modules', name);

/* ── 모듈 경계 제거 ──
   번들러 없이 <script> 하나에 밀어 넣으므로 import/export 를 걷어낸다. */
const stripExports = (src) =>
  src
    .replace(/^export\s+function/gm, 'function')
    .replace(/^export\s+const/gm, 'const')
    .replace(/^export\s+default\s+function/m, 'function');

const stripImports = (src) =>
  src
    .replace(/^import\s+React[\s\S]*?from\s+'react';\s*$/m, '')
    .replace(/^import\s*\{[\s\S]*?\}\s*from\s*'\.\.\/physics\/[a-zA-Z]+';\s*$/m, '');

/* ── 담을 화면들 ── */
const CARDS = [
  {
    id: 'basics',
    name: '식각 기초',
    sub: '이온·라디칼 시너지 · 원자 스케일',
    physics: ['src/physics/surfaceReaction.js'],
    component: 'src/simulators/EtchingBasics.jsx',
    fn: 'EtchingBasics',
    // 앱에서는 카드 컨테이너가 스크롤을 잡아 준다. 여기엔 없으므로 직접 준다.
    wrap: { overflowY: 'auto' },
  },
  {
    id: 'bay',
    name: '식각 프로파일',
    sub: '장비 화면 · 챔버 단면 + 원자 스케일 인셋',
    physics: ['src/physics/etching.js'],
    component: 'src/simulators/EtchingBay.jsx',
    fn: 'EtchingBay',
    wrap: { display: 'flex', flexDirection: 'column' },
  },
];

const bodies = CARDS.map((c) => {
  const physics = c.physics.map((p) => stripExports(read(p))).join('\n\n');
  const component = stripExports(stripImports(read(c.component)));
  return `
/* ───── ${c.name} ───── */
(function(){
  ${physics}

  ${component}

  window.__cards.${c.id} = ${c.fn};
})();
`;
}).join('\n');

const shell = `
function Shell(){
  var tabs = ${JSON.stringify(CARDS.map(({ id, name, sub, wrap }) => ({ id, name, sub, wrap })))};
  var s = useState(tabs[0].id);
  var active = s[0], setActive = s[1];
  var cur = tabs.filter(function(t){ return t.id === active; })[0];
  var Card = window.__cards[active];

  return React.createElement('div', { className: 'pv-root' },
    React.createElement('div', { className: 'pv-bar' },
      React.createElement('span', { className: 'pv-title' }, '식각 화면 검토'),
      React.createElement('div', { className: 'pv-tabs' },
        tabs.map(function(t){
          return React.createElement('button', {
            key: t.id,
            type: 'button',
            className: 'pv-tab' + (t.id === active ? ' is-on' : ''),
            onClick: function(){ setActive(t.id); }
          },
            React.createElement('span', { className: 'pv-tab-n' }, t.name),
            React.createElement('span', { className: 'pv-tab-s' }, t.sub)
          );
        })
      )
    ),
    React.createElement('div', { className: 'pv-stage', style: cur.wrap, key: active },
      React.createElement(Card, null)
    )
  );
}
`;

/* ── JSX/최신 문법 트랜스파일 ── */
const appJs = transformSync(
  `
window.__cards = {};

var _R = React;
var useState = _R.useState, useEffect = _R.useEffect, useRef = _R.useRef,
    useCallback = _R.useCallback, useMemo = _R.useMemo;

${bodies}

${shell}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(Shell, null)
);
`,
  {
    filename: 'etching-preview.js',
    babelrc: false,
    configFile: false,
    presets: [
      [require_('@babel/preset-react'), { runtime: 'classic' }],
      [require_('@babel/preset-env'), { targets: { chrome: '90', safari: '15' }, modules: false }],
    ],
  }
).code;

/* ── React 런타임 인라인 ──
   Artifact 는 외부 호스트 요청을 CSP 로 막으므로 CDN 을 쓸 수 없다. */
const react = read('node_modules/react/umd/react.production.min.js');
const reactDom = read('node_modules/react-dom/umd/react-dom.production.min.js');

const html = `<title>식각 화면 검토</title>
<style>
  html,body{margin:0;padding:0;height:100%;background:#14120C;}
  #root{height:100%;}
  .pv-root{position:fixed;inset:0;display:flex;flex-direction:column;background:#14120C;}

  .pv-bar{
    display:flex;align-items:stretch;gap:18px;flex-wrap:wrap;
    padding:0 16px;border-bottom:1px solid #3B362C;background:#1C1913;flex:0 0 auto;
  }
  .pv-title{
    align-self:center;font:600 12px/1 ui-monospace,Menlo,Consolas,monospace;
    letter-spacing:.14em;text-transform:uppercase;color:#8A8069;padding:14px 0;
  }
  .pv-tabs{display:flex;gap:1px;background:#2A261C;margin-left:auto;}
  .pv-tab{
    appearance:none;border:0;border-bottom:2px solid transparent;background:#1C1913;
    color:#A69B7F;text-align:left;padding:9px 16px;cursor:pointer;
    font-family:'Pretendard','Apple SD Gothic Neo',system-ui,sans-serif;
    transition:background 140ms ease,color 140ms ease;
  }
  .pv-tab:hover{background:#241F16;color:#D8CFB4;}
  .pv-tab.is-on{background:#241F16;color:#D8CFB4;border-bottom-color:#F0C464;}
  .pv-tab-n{display:block;font-size:13px;font-weight:600;}
  .pv-tab-s{display:block;font-size:10.5px;color:#8A8069;margin-top:1px;}

  .pv-stage{flex:1;min-height:0;}
  .pv-note{
    position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:60;
    font:11px/1.4 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.05em;
    color:#7A7260;background:rgba(28,26,21,.92);border:1px solid #332F27;
    padding:5px 12px;border-radius:3px;pointer-events:none;white-space:nowrap;
  }
  @media (max-width:820px){
    .pv-note{display:none;}
    .pv-tabs{margin-left:0;width:100%;}
    .pv-tab{flex:1;}
  }
</style>

<div id="root"></div>
<div class="pv-note">저장소 소스를 그대로 묶은 검토용 빌드 · 숫자는 교육용 모델값</div>

<script>${react}</script>
<script>${reactDom}</script>
<script>${appJs}</script>
`;

writeFileSync(out, html, 'utf8');
console.log(`${out} · ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
