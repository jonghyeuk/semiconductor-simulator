#!/usr/bin/env node
// 시뮬레이터 GEO 가이드 HTML 자동 생성 스크립트
// 사용법: npm run build-guides

const fs = require('fs');
const path = require('path');
const { simulators, learningPath, guideDomain, mainPlatformUrl } = require('./guide-data');

const outputDir = path.join(__dirname, '..', 'public', 'guide');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 학습 경로에서 이전/다음 시뮬레이터 찾기
function getNavigation(id) {
  const idx = learningPath.indexOf(id);
  const prev = idx > 0 ? simulators.find(s => s.id === learningPath[idx - 1]) : null;
  const next = idx < learningPath.length - 1 ? simulators.find(s => s.id === learningPath[idx + 1]) : null;
  return { prev, next };
}

// 관련 시뮬레이터 정보 가져오기
function getRelated(ids) {
  return ids.map(id => simulators.find(s => s.id === id)).filter(Boolean);
}

// 공통 CSS
const commonCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; line-height: 1.7; background: #f8f9fa; }
  a { color: #1976d2; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .container { max-width: 860px; margin: 0 auto; padding: 0 24px; }
  header { background: #fff; border-bottom: 1px solid #e0e0e0; padding: 16px 0; }
  header .container { display: flex; justify-content: space-between; align-items: center; }
  header h1 { font-size: 18px; font-weight: 700; }
  header h1 a { color: #1a1a1a; }
  header nav a { font-size: 14px; margin-left: 20px; color: #555; }
  header nav a:hover { color: #1976d2; }
  .breadcrumb { font-size: 13px; color: #888; padding: 12px 0; }
  .breadcrumb a { color: #888; }
  .hero { background: #fff; border-bottom: 1px solid #e0e0e0; padding: 48px 0 40px; }
  .hero .icon { font-size: 48px; margin-bottom: 12px; }
  .hero h2 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
  .hero .summary { font-size: 17px; color: #555; max-width: 640px; }
  .badge { display: inline-block; font-size: 12px; padding: 3px 10px; border-radius: 12px; font-weight: 600; }
  main { padding: 40px 0 60px; }
  section { background: #fff; border-radius: 12px; border: 1px solid #e0e0e0; padding: 32px; margin-bottom: 24px; }
  section h3 { font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #f0f0f0; }
  section ul { padding-left: 20px; }
  section li { margin-bottom: 8px; }
  .context-box { background: #f0f7ff; border-left: 4px solid #1976d2; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 15px; color: #333; }
  .demo-scope { background: #f0faf0; border-left: 4px solid #4caf50; padding: 16px 20px; border-radius: 0 8px 8px 0; }
  .full-version { background: #fff8e1; border-left: 4px solid #ff9800; padding: 16px 20px; border-radius: 0 8px 8px 0; }
  .cta-box { text-align: center; padding: 40px 32px; background: linear-gradient(135deg, #1976d2, #1565c0); color: #fff; border-radius: 12px; margin: 32px 0; }
  .cta-box h3 { color: #fff; border: none; margin-bottom: 12px; }
  .cta-box p { color: rgba(255,255,255,0.85); margin-bottom: 20px; }
  .cta-btn { display: inline-block; padding: 12px 32px; background: #fff; color: #1976d2; border-radius: 8px; font-weight: 700; font-size: 15px; }
  .cta-btn:hover { text-decoration: none; background: #f5f5f5; }
  .cta-btn-outline { display: inline-block; padding: 12px 32px; border: 2px solid #fff; color: #fff; border-radius: 8px; font-weight: 700; font-size: 15px; margin-left: 12px; }
  .cta-btn-outline:hover { text-decoration: none; background: rgba(255,255,255,0.1); }
  .nav-bottom { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; border-top: 1px solid #e0e0e0; margin-top: 20px; }
  .nav-bottom a { font-size: 14px; }
  .nav-prev::before { content: '← '; }
  .nav-next::after { content: ' →'; }
  .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .related-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; transition: box-shadow 0.2s; }
  .related-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-decoration: none; }
  .related-card .r-icon { font-size: 28px; margin-bottom: 8px; }
  .related-card .r-name { font-weight: 700; font-size: 15px; color: #1a1a1a; }
  .related-card .r-desc { font-size: 13px; color: #777; margin-top: 4px; }
  footer { background: #fff; border-top: 1px solid #e0e0e0; padding: 32px 0; text-align: center; font-size: 13px; color: #999; }
  footer a { color: #999; }
  .path-list { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
  .path-item { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid #e0e0e0; color: #555; }
  .path-item.current { background: #1976d2; color: #fff; border-color: #1976d2; }
  .path-item a { color: inherit; }
  .index-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 24px 0; }
  .index-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; transition: box-shadow 0.2s, transform 0.2s; }
  .index-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); text-decoration: none; }
  .index-card .i-icon { font-size: 36px; margin-bottom: 8px; }
  .index-card .i-name { font-weight: 700; font-size: 17px; color: #1a1a1a; margin-bottom: 6px; }
  .index-card .i-summary { font-size: 14px; color: #666; line-height: 1.5; }
  .index-card .i-level { font-size: 12px; color: #999; margin-top: 10px; }
  @media (max-width: 640px) { .hero h2 { font-size: 24px; } section { padding: 24px 16px; } .cta-btn-outline { margin-left: 0; margin-top: 8px; } }
`;

// 개별 시뮬레이터 가이드 HTML 생성
function buildSimulatorPage(sim) {
  const { prev, next } = getNavigation(sim.id);
  const related = getRelated(sim.relatedIds);
  const simAppId = sim.id === 'packaging' ? 'metallization-eds-packaging' : sim.id === 'lithography' ? 'lithograph' : sim.id === 'plasma' ? 'plasma' : sim.id;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sim.name} - 반도체 공정 시뮬레이터 | SemiFabAI</title>
  <meta name="description" content="${sim.summary}">
  <meta name="keywords" content="${sim.keywords.join(', ')}">
  <meta property="og:title" content="${sim.name} - 반도체 공정 시뮬레이터">
  <meta property="og:description" content="${sim.summary}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${guideDomain}/guide/${sim.id}.html">
  <link rel="canonical" href="${guideDomain}/guide/${sim.id}.html">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "${sim.name}",
    "description": "${sim.summary}",
    "educationalLevel": "${sim.targetLevel}",
    "learningResourceType": "Interactive Simulation",
    "datePublished": "${new Date().toISOString().split('T')[0]}",
    "dateModified": "${new Date().toISOString().split('T')[0]}",
    "about": {
      "@type": "Thing",
      "name": "${sim.shortName}",
      "description": "${sim.description.replace(/"/g, '\\"')}"
    },
    "isPartOf": {
      "@type": "Course",
      "name": "반도체 공정 시뮬레이터",
      "url": "${guideDomain}/guide/",
      "provider": {
        "@type": "Organization",
        "name": "SemiFabAI",
        "url": "${mainPlatformUrl}"
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "SemiFabAI",
      "url": "${mainPlatformUrl}"
    },
    "inLanguage": "ko",
    "keywords": "${sim.keywords.join(', ')}"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "홈", "item": "${guideDomain}/"},
      {"@type": "ListItem", "position": 2, "name": "가이드", "item": "${guideDomain}/guide/"},
      {"@type": "ListItem", "position": 3, "name": "${sim.shortName}", "item": "${guideDomain}/guide/${sim.id}.html"}
    ]
  }
  </script>
  <style>${commonCSS}</style>
</head>
<body>
  <header>
    <div class="container">
      <h1><a href="${guideDomain}">반도체 공정 시뮬레이터</a></h1>
      <nav>
        <a href="./index.html">전체 가이드</a>
        <a href="${mainPlatformUrl}">정식 버전</a>
      </nav>
    </div>
  </header>

  <div class="container">
    <div class="breadcrumb">
      <a href="./index.html">가이드</a> &gt; ${sim.shortName}
    </div>
  </div>

  <div class="hero">
    <div class="container">
      <div class="icon">${sim.icon}</div>
      <h2>${sim.name}</h2>
      <p class="summary">${sim.summary}</p>
      <div style="margin-top: 16px;">
        <span class="badge" style="background: ${sim.color}; color: #fff;">${sim.targetLevel}</span>
      </div>
    </div>
  </div>

  <main>
    <div class="container">

      <section>
        <h3>이 시뮬레이터는 무엇인가</h3>
        <p>${sim.description}</p>
        <div class="context-box">
          <strong>공정 흐름에서의 위치:</strong> ${sim.processContext}
        </div>
      </section>

      <section>
        <h3>무엇을 배울 수 있나</h3>
        <ul>
          ${sim.learningObjectives.map(obj => `<li>${obj}</li>`).join('\n          ')}
        </ul>
      </section>

      <section>
        <h3>학습 경로</h3>
        <p>반도체 8대 공정 순서에 따른 학습 경로입니다. 순서대로 학습하면 공정 간 연관성을 이해하는 데 효과적입니다.</p>
        <div class="path-list">
          ${learningPath.map(pid => {
            const ps = simulators.find(s => s.id === pid);
            if (!ps) return '';
            if (pid === sim.id) return `<span class="path-item current">${ps.icon} ${ps.shortName}</span>`;
            return `<a href="./${pid}.html" class="path-item">${ps.icon} ${ps.shortName}</a>`;
          }).join('\n          ')}
        </div>
      </section>

      <section>
        <h3>데모에서 체험 가능한 기능</h3>
        <div class="demo-scope">
          ${sim.demoScope}
        </div>
      </section>

      <section>
        <h3>정식 버전에서 확장되는 기능</h3>
        <div class="full-version">
          ${sim.fullVersionExtras}
        </div>
        <p style="margin-top: 12px; font-size: 14px; color: #888;">정식 버전에서는 100개 이상의 시뮬레이터와 심화 학습 콘텐츠를 제공합니다.</p>
      </section>

      <div class="cta-box">
        <h3>직접 체험해 보세요</h3>
        <p>${sim.shortName} 시뮬레이터를 지금 바로 사용해 볼 수 있습니다.</p>
        <a href="${guideDomain}/?sim=${simAppId}" class="cta-btn">${sim.shortName} 체험하기</a>
        <a href="${mainPlatformUrl}" class="cta-btn-outline">정식 버전 알아보기</a>
      </div>

      ${related.length > 0 ? `
      <section>
        <h3>관련 시뮬레이터</h3>
        <div class="related-grid">
          ${related.map(r => `
          <a href="./${r.id}.html" class="related-card">
            <div class="r-icon">${r.icon}</div>
            <div class="r-name">${r.shortName}</div>
            <div class="r-desc">${r.summary.substring(0, 60)}…</div>
          </a>`).join('')}
        </div>
      </section>` : ''}

      <div class="nav-bottom">
        <div>${prev ? `<a href="./${prev.id}.html" class="nav-prev">${prev.shortName}</a>` : ''}</div>
        <a href="./index.html">전체 목록</a>
        <div>${next ? `<a href="./${next.id}.html" class="nav-next">${next.shortName}</a>` : ''}</div>
      </div>

    </div>
  </main>

  <footer>
    <div class="container">
      <p>반도체 공정 시뮬레이터 데모 | <a href="${mainPlatformUrl}">SemiFabAI 정식 버전</a></p>
      <p style="margin-top: 8px;">교육 목적의 인터랙티브 시뮬레이터 플랫폼</p>
    </div>
  </footer>
</body>
</html>`;
}

// 인덱스 페이지 생성
function buildIndexPage() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>반도체 공정 시뮬레이터 가이드 - 반도체 8대 공정 학습 | SemiFabAI</title>
  <meta name="description" content="반도체 8대 공정(진공, 세정, 산화, 리소그래피, 플라즈마, 식각, 증착, 이온주입, 배선·패키징)을 인터랙티브 시뮬레이터로 학습하세요. 입문부터 고급까지, 실무 중심 반도체 교육 플랫폼.">
  <meta name="keywords" content="반도체 공정, 반도체 시뮬레이터, 반도체 교육, 8대 공정, semiconductor process, fab simulation, SemiFabAI">
  <meta property="og:title" content="반도체 공정 시뮬레이터 가이드 | SemiFabAI">
  <meta property="og:description" content="반도체 8대 공정을 인터랙티브 시뮬레이터로 학습하세요.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${guideDomain}/guide/">
  <link rel="canonical" href="${guideDomain}/guide/">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "반도체 공정 시뮬레이터",
    "description": "반도체 8대 공정(진공, 세정, 산화, 리소그래피, 플라즈마, 식각, 증착, 이온주입, 배선·패키징)을 인터랙티브 시뮬레이터로 학습하는 교육 플랫폼",
    "provider": {
      "@type": "Organization",
      "name": "SemiFabAI",
      "url": "${mainPlatformUrl}"
    },
    "inLanguage": "ko",
    "datePublished": "${new Date().toISOString().split('T')[0]}",
    "dateModified": "${new Date().toISOString().split('T')[0]}",
    "numberOfCredits": ${simulators.length},
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "자기주도 학습"
    }
  }
  </script>
  <style>${commonCSS}</style>
</head>
<body>
  <header>
    <div class="container">
      <h1><a href="${guideDomain}">반도체 공정 시뮬레이터</a></h1>
      <nav>
        <a href="${guideDomain}/">데모 체험</a>
        <a href="${mainPlatformUrl}">정식 버전</a>
      </nav>
    </div>
  </header>

  <div class="hero" style="padding: 56px 0 48px;">
    <div class="container">
      <h2>반도체 8대 공정 시뮬레이터 가이드</h2>
      <p class="summary">진공부터 패키징까지, 반도체 제조의 핵심 공정을 인터랙티브 시뮬레이터로 체험하고 학습하세요. 입문자부터 현직 엔지니어까지 활용할 수 있는 실무 중심 교육 플랫폼입니다.</p>
    </div>
  </div>

  <main>
    <div class="container">

      <section>
        <h3>추천 학습 경로</h3>
        <p>반도체 FAB의 실제 공정 순서에 맞춰 설계된 학습 경로입니다. 순서대로 진행하면 각 공정이 왜 필요하고, 어떻게 연결되는지 자연스럽게 이해할 수 있습니다.</p>
        <div class="path-list" style="margin-top: 16px;">
          ${learningPath.map((pid, i) => {
            const ps = simulators.find(s => s.id === pid);
            if (!ps) return '';
            return `<a href="./${pid}.html" class="path-item">${i + 1}. ${ps.icon} ${ps.shortName}</a>`;
          }).join('\n          ')}
        </div>
      </section>

      <section>
        <h3>전체 시뮬레이터 (${simulators.length}개)</h3>
        <div class="index-grid">
          ${simulators.map(sim => `
          <a href="./${sim.id}.html" class="index-card">
            <div class="i-icon">${sim.icon}</div>
            <div class="i-name">${sim.shortName}</div>
            <div class="i-summary">${sim.summary}</div>
            <div class="i-level">${sim.targetLevel}</div>
          </a>`).join('')}
        </div>
      </section>

      <section>
        <h3>이 플랫폼은 누구를 위한 건가요?</h3>
        <ul>
          <li><strong>반도체 전공 학생</strong> — 교과서로만 배우던 공정을 시각적으로 체험하며 이해도를 높일 수 있습니다</li>
          <li><strong>반도체 업계 신입 엔지니어</strong> — 실제 장비를 다루기 전에 공정 파라미터의 영향을 안전하게 실험할 수 있습니다</li>
          <li><strong>타 분야에서 반도체로 전환하는 분</strong> — 기초 개념부터 단계별로 학습할 수 있는 가이드를 제공합니다</li>
          <li><strong>반도체 교육 담당자</strong> — 강의 보조 자료로 시뮬레이터를 활용할 수 있습니다</li>
        </ul>
      </section>

      <section>
        <h3>데모와 정식 버전의 차이</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          <thead>
            <tr style="border-bottom: 2px solid #e0e0e0;">
              <th style="text-align: left; padding: 10px 12px; font-size: 14px;">항목</th>
              <th style="text-align: center; padding: 10px 12px; font-size: 14px;">데모</th>
              <th style="text-align: center; padding: 10px 12px; font-size: 14px;">정식 버전</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 12px; font-size: 14px;">시뮬레이터 수</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">${simulators.length}개 (핵심 공정)</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">100개+</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 12px; font-size: 14px;">학습 콘텐츠</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">기본 이론 + 시뮬레이션</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">심화 이론 + 실무 시나리오</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 12px; font-size: 14px;">파라미터 범위</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">기본 범위</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">실제 장비 기반 확장</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 12px; font-size: 14px;">평가 시스템</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">기초 퀴즈</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">단계별 인증 평가</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-size: 14px;">학습 추적</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">—</td>
              <td style="text-align: center; padding: 10px 12px; font-size: 14px;">진도율, 성취도 대시보드</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="cta-box">
        <h3>반도체 공정, 직접 체험해 보세요</h3>
        <p>시뮬레이터를 통해 반도체 8대 공정의 핵심 원리를 인터랙티브하게 학습할 수 있습니다.</p>
        <a href="${guideDomain}/" class="cta-btn">데모 시작하기</a>
        <a href="${mainPlatformUrl}" class="cta-btn-outline">정식 버전 알아보기</a>
      </div>

    </div>
  </main>

  <footer>
    <div class="container">
      <p>반도체 공정 시뮬레이터 데모 | <a href="${mainPlatformUrl}">SemiFabAI 정식 버전</a></p>
      <p style="margin-top: 8px;">교육 목적의 인터랙티브 시뮬레이터 플랫폼</p>
    </div>
  </footer>
</body>
</html>`;
}

// 생성 실행
console.log('🔨 GEO 가이드 페이지 생성 시작...\n');

// 인덱스 페이지
fs.writeFileSync(path.join(outputDir, 'index.html'), buildIndexPage());
console.log('  ✅ guide/index.html');

// 개별 시뮬레이터 페이지
simulators.forEach(sim => {
  fs.writeFileSync(path.join(outputDir, `${sim.id}.html`), buildSimulatorPage(sim));
  console.log(`  ✅ guide/${sim.id}.html`);
});

console.log(`\n🎉 완료! ${simulators.length + 1}개 HTML 생성 → public/guide/`);
