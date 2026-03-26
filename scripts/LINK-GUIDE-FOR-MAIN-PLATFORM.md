# 본 플랫폼 ↔ 데모 연결 가이드

## 개요

데모 사이트(`demo.semifabai.com`)에 GEO 최적화된 정적 가이드 페이지가 생성되었습니다.
본 플랫폼(`kr.semifabai.com`)에서 이 가이드 페이지들을 링크로 연결하면 양쪽 GEO/SEO 효과가 강화됩니다.

## 데모 가이드 URL 목록

| 페이지 | URL |
|--------|-----|
| 전체 가이드 (인덱스) | `https://demo.semifabai.com/guide/` |
| Vacuum 기초 | `https://demo.semifabai.com/guide/vacuum.html` |
| 웨이퍼 세정 | `https://demo.semifabai.com/guide/cleaning.html` |
| Oxidation | `https://demo.semifabai.com/guide/oxidation.html` |
| Lithography | `https://demo.semifabai.com/guide/lithography.html` |
| Plasma | `https://demo.semifabai.com/guide/plasma.html` |
| Etching | `https://demo.semifabai.com/guide/etching.html` |
| Deposition | `https://demo.semifabai.com/guide/deposition.html` |
| Implantation | `https://demo.semifabai.com/guide/implantation.html` |
| 배선검사패키징 | `https://demo.semifabai.com/guide/packaging.html` |

## 연결 방법

### 1. 블로그/문서에서 연결 (가장 중요)

본 플랫폼에 반도체 공정 관련 글이 있을 때, 본문 중 적절한 위치에 데모 가이드 링크를 추가합니다.

**예시:**

```html
<!-- 진공 관련 글에서 -->
<a href="https://demo.semifabai.com/guide/vacuum.html">
  데모에서 진공 펌핑 시뮬레이션 체험하기 →
</a>

<!-- 식각 관련 글에서 -->
<a href="https://demo.semifabai.com/guide/etching.html">
  데모에서 3D 식각 시뮬레이션 체험하기 →
</a>
```

### 2. 센터/허브 페이지에서 연결

교육 센터나 시뮬레이터 목록 페이지가 있다면, 데모 가이드 인덱스를 링크합니다.

```html
<a href="https://demo.semifabai.com/guide/">
  무료 데모 시뮬레이터 가이드 보기 →
</a>
```

### 3. 네비게이션/푸터에서 연결 (선택)

사이트 전역 네비게이션이나 푸터에 데모 링크가 있다면, 가이드 인덱스로 연결합니다.

```html
<a href="https://demo.semifabai.com/guide/">무료 체험</a>
```

## 연결 시 유의사항

- 링크 텍스트에 **공정 이름**을 포함하세요 (예: "진공 시뮬레이터 체험" O, "여기 클릭" X)
- 가능하면 **본문 맥락 안에서** 자연스럽게 연결하세요 (별도 배너보다 효과적)
- 데모 가이드는 지속적으로 추가됩니다. 새 가이드가 추가되면 공유드리겠습니다

## 반대 방향 (데모 → 본 플랫폼)

이미 처리되어 있습니다. 각 가이드 페이지에 "정식 버전 알아보기" CTA가 `kr.semifabai.com`으로 연결됩니다.
