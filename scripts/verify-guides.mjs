/**
 * 가이드 정적 산출물 대조 (리팩터링 안전망).
 *
 * build-guides 로 생성되는 public/guide/**.html 은 리팩터링으로 조용히 바뀌기 쉽다.
 * 이 스크립트는 현재 산출물의 스냅샷을 찍어 두고, 재생성 후 달라진 항목을 세어 준다.
 *
 * 사용법:
 *   node scripts/verify-guides.mjs snapshot   # 변경 전 스냅샷 저장
 *   npm run build-guides                      # 리팩터링 후 재생성
 *   node scripts/verify-guides.mjs compare    # 차이 보고 (차이 있으면 exit 1)
 *
 * 비교 항목: 본문 텍스트, title/description/canonical, JSON-LD, 링크 목록,
 *            h1~h6 구조, img 의 src 와 alt.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const GUIDE_DIR = 'public/guide';
const SNAP_PATH = 'scripts/.guide-snapshot.json';

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const stripTags = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const allMatches = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

/** 첫 캡처 그룹을 꺼내고, 매치가 없으면 빈 문자열을 준다. */
const capture = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : '';
};

function fingerprint(html) {
  return {
    text: stripTags(html),
    title: capture(html, /<title[^>]*>([\s\S]*?)<\/title>/i).trim(),
    description: capture(html, /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i),
    canonical: capture(html, /<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i),
    // build-guides 가 datePublished/dateModified 에 빌드 당일 날짜를 박으므로
    // 그대로 비교하면 매번 전 페이지가 "달라짐" 으로 뜬다. 날짜만 정규화한다.
    jsonLd: allMatches(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi).map((s) =>
      s
        .replace(/"(datePublished|dateModified)":\s*"[^"]*"/g, '"$1":"<BUILD_DATE>"')
        .replace(/\s+/g, ' ')
        .trim()
    ),
    links: allMatches(html, /<a\b[^>]*\shref=["']([^"']*)["']/gi),
    headings: [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(
      (m) => `${m[1]}:${stripTags(m[2])}`
    ),
    images: [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => {
      const tag = m[0];
      const src = capture(tag, /\ssrc=["']([^"']*)["']/i);
      const alt = capture(tag, /\salt=["']([^"']*)["']/i);
      return `${src}|${alt}`;
    }),
  };
}

function collect() {
  if (!existsSync(GUIDE_DIR)) {
    console.error(`${GUIDE_DIR} 가 없습니다. 먼저 npm run build-guides 를 실행하세요.`);
    process.exit(1);
  }
  const out = {};
  for (const file of walk(GUIDE_DIR).sort()) {
    out[relative(GUIDE_DIR, file)] = fingerprint(readFileSync(file, 'utf8'));
  }
  return out;
}

const mode = process.argv[2];

if (mode === 'snapshot') {
  const snap = collect();
  mkdirSync('scripts', { recursive: true });
  writeFileSync(SNAP_PATH, JSON.stringify(snap, null, 2));
  console.log(`\n스냅샷 저장: ${Object.keys(snap).length} 페이지 → ${SNAP_PATH}\n`);
  process.exit(0);
}

if (mode === 'compare') {
  if (!existsSync(SNAP_PATH)) {
    console.error(`스냅샷이 없습니다. 먼저 'node scripts/verify-guides.mjs snapshot' 을 실행하세요.`);
    process.exit(1);
  }
  const before = JSON.parse(readFileSync(SNAP_PATH, 'utf8'));
  const after = collect();

  const pages = new Set([...Object.keys(before), ...Object.keys(after)]);
  const FIELDS = ['text', 'title', 'description', 'canonical', 'jsonLd', 'links', 'headings', 'images'];
  let diffs = 0;
  const details = [];

  for (const page of [...pages].sort()) {
    if (!after[page]) {
      diffs++;
      details.push(`  - ${page}: 사라짐`);
      continue;
    }
    if (!before[page]) {
      diffs++;
      details.push(`  - ${page}: 새로 생김`);
      continue;
    }
    for (const f of FIELDS) {
      if (JSON.stringify(before[page][f]) !== JSON.stringify(after[page][f])) {
        diffs++;
        details.push(`  - ${page} [${f}] 달라짐`);
      }
    }
  }

  console.log('');
  console.log('가이드 산출물 대조');
  console.log('─'.repeat(46));
  console.log(`  페이지 수   : ${Object.keys(after).length} 개`);
  console.log(`  비교 항목   : ${FIELDS.length} 종 × 페이지`);
  console.log(`  차이        : ${diffs} 건`);
  if (details.length) {
    console.log('');
    details.slice(0, 40).forEach((d) => console.log(d));
  }
  console.log('');
  process.exit(diffs === 0 ? 0 : 1);
}

console.error("사용법: node scripts/verify-guides.mjs <snapshot|compare>");
process.exit(1);
