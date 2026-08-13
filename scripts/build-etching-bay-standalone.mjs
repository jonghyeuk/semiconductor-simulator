/**
 * 식각 베이 화면을 단일 HTML 파일로 묶는다.
 *
 * 목적은 딱 하나 — 저장소를 받거나 빌드를 돌리지 않고도 링크 하나로 화면을 보게 하는 것이다.
 * 디자인 검토용이고, 배포물이 아니다.
 *
 * 중요: 화면 소스를 여기서 다시 쓰지 않는다. src/simulators/EtchingBay.jsx 와
 * src/physics/etching.js 를 **그대로 읽어서** 트랜스파일한다. 따라서 앱에서 보는 것과
 * 이 HTML 이 보여 주는 것이 어긋날 수 없다. 컴포넌트를 고치면 이 스크립트를 다시 돌리면 된다.
 *
 *   node scripts/build-etching-bay-standalone.mjs [출력경로]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { transformSync } from '@babel/core';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const out = process.argv[2] || resolve(root, 'build', 'etching-bay.html');

const read = (p) => readFileSync(resolve(root, p), 'utf8');

/* ── 1. 소스 읽기 ── */
const physicsSrc = read('src/physics/etching.js');
const componentSrc = read('src/simulators/EtchingBay.jsx');

/* ── 2. 모듈 경계 제거 ──
   번들러 없이 <script> 하나에 밀어 넣으므로 import/export 를 걷어낸다.
   물리 함수는 전역 스코프에 그대로 두고, 컴포넌트가 이름으로 집어 쓴다. */

const physicsBody = physicsSrc.replace(/^export\s+function/gm, 'function');

let componentBody = componentSrc
  // React 훅은 아래에서 구조분해로 꺼내 쓴다
  .replace(/^import\s+React[\s\S]*?from\s+'react';\s*$/m, '')
  // 물리 import 는 위에서 전역으로 깔았으므로 제거
  .replace(/^import\s*\{[\s\S]*?\}\s*from\s*'\.\.\/physics\/etching';\s*$/m, '')
  .replace(/^export\s+default\s+function\s+EtchingBay/m, 'function EtchingBay');

/* ── 3. JSX 트랜스파일 ── */
const transpile = (code, filename) =>
  transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    presets: [
      [require_('@babel/preset-react'), { runtime: 'classic' }],
      [require_('@babel/preset-env'), { targets: { chrome: '90', safari: '15' }, modules: false }],
    ],
  }).code;

// ESM 안에서 preset 경로를 해석하기 위한 얇은 헬퍼
function require_(name) {
  return resolve(root, 'node_modules', name);
}

const appJs = transpile(
  `
${physicsBody}

const { useState, useEffect, useRef, useCallback, useMemo } = React;

${componentBody}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(Shell, null)
);
`,
  'etching-bay-standalone.js'
);

/* ── 4. React 런타임 인라인 ──
   Artifact 는 외부 호스트 요청을 CSP 로 막으므로 CDN 을 쓸 수 없다. */
const react = read('node_modules/react/umd/react.production.min.js');
const reactDom = read('node_modules/react-dom/umd/react-dom.production.min.js');

/* ── 5. 껍데기 ──
   앱에서는 App.js 의 flex 컨테이너가 높이를 잡아 준다. 여기엔 그 컨테이너가 없으므로
   같은 역할을 하는 래퍼(Shell)를 만들어 컴포넌트를 그대로 감싼다. */
const shellJs = `
function Shell(){
  return React.createElement(
    'div',
    { style:{ position:'fixed', inset:0, display:'flex', flexDirection:'column' } },
    React.createElement(EtchingBay, null)
  );
}
`;

const html = `<title>식각 베이 RIE-2400</title>
<style>
  html,body{margin:0;padding:0;height:100%;background:#141210;}
  #root{height:100%;display:flex;flex-direction:column;}
  .eb-standalone-note{
    position:fixed; left:50%; bottom:14px; transform:translateX(-50%); z-index:60;
    font:11px/1.4 ui-monospace,Menlo,Consolas,monospace; letter-spacing:.06em;
    color:#7A7260; background:rgba(28,26,21,.92); border:1px solid #332F27;
    padding:5px 12px; border-radius:3px; pointer-events:none; white-space:nowrap;
  }
  @media (max-width:900px){ .eb-standalone-note{display:none;} }
</style>

<div id="root"></div>
<div class="eb-standalone-note">디자인 검토용 프로토타입 · 숫자는 교육용 모델값</div>

<script>${react}</script>
<script>${reactDom}</script>
<script>
${shellJs}
${appJs}
</script>
`;

writeFileSync(out, html, 'utf8');
console.log(`${out} · ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
