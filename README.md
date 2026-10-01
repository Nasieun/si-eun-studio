# 시은의 경험 설계실 — SI EUN EXPERIENCE STUDIO

> 사람이 느끼는 작은 불편을 발견하고, 더 나은 경험을 설계합니다.

관찰에서 시작해 서비스와 화면으로 구체화한 작업을 소개하는 포트폴리오 웹사이트입니다.
설계 문서: `PRD_STEP_01.md`, `PRD_STEP_02.md`, `PRD_STEP_03.md`

## 빠르게 실행하기

```bash
npm install
npx playwright install chromium   # E2E 테스트용 브라우저 (최초 1회)

npm run dev       # 개발 서버  http://localhost:4321 (웹폰트 서브셋은 빌드 때 만들어져서 개발 서버에선 시스템 글꼴)
npm run build     # dist/ 에 정적 사이트 생성 + 쓰인 글자만 담은 Pretendard 서브셋 생성
npm run preview   # 빌드 결과를 http://localhost:4321 에서 확인
npm run check     # 타입·콘텐츠 스키마 검사
npm run test:e2e  # 빌드 후 Playwright E2E (링크·반응형·axe 접근성·키보드)
npx playwright test e2e/keyboard.spec.ts -g "승차"   # 테스트 하나만
npm run og        # 공유 미리보기 이미지 public/og.png 다시 만들기
```

## GitHub Pages로 실행하기

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 타입 검사 → 정적 빌드 → E2E 테스트 → (통과하면) GitHub Pages 배포를 차례로 실행합니다.
배포 주소는 `https://<아이디>.github.io/<저장소이름>/` 입니다.

처음 한 번은 저장소의 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 두어야 합니다.

저장소 하위 경로(`/<저장소이름>`)는 워크플로가 `BASE_PATH` 환경 변수로 넘겨줍니다. 로컬에서 배포본과 같은 경로로 확인하려면:

```bash
BASE_PATH=/저장소이름 npm run build && npm run preview
```

## 단계별 진행

| 단계 | 범위 | 상태 |
| --- | --- | --- |
| STEP 01 | 정보 구조, 디자인 토큰, 공통 레이아웃, 홈, 소개 | 완료 |
| STEP 02 | 프로젝트 상세 3개, 인터랙티브 데모 3종 | 완료 |
| STEP 03 | 나의 설계 방식, 관찰과 탐구, 품질 점검, 출시 | 완료 (배포 대기) |

## 채워야 할 내용

실제 자료가 없는 자리는 화면에 점선 상자 `〔작성 필요〕`로 보이고, 코드에서는 `<Todo` 또는 `TODO`로 찾을 수 있습니다.

```bash
grep -rn "Todo\|TODO" src
```

- `src/data/site.ts` — 공개할 이메일·링크드인, 실제 사용한 도구(`verified`), 이력서 PDF
- `src/content/projects/*.mdx` — 작업 기간·개인/팀·진행 상태(frontmatter의 `null`), 관찰 기록, 실제 수정 과정
  - `status`: `완료` / `시안 단계` / `검증 예정` (영어 `completed` / `draft` / `planned`도 가능)
  - `team`: `개인`(또는 `personal`, `1`), 팀이면 인원 숫자(`4` → “팀 (4명)”) 또는 자유 문구
- `src/data/demos/*.ts` — 데모 문구(기내 상황·역할극 대본, 승차 단계별 접점 역할, 핫스팟 설명)는 PRD 구조에 맞춘 **예시 초안**입니다
- `src/data/values.ts` — 가치–사례 연결(PRD STEP 03 · 1.3 표)은 STEP 02 사례로 만든 초안
- `src/content/archive/*.md` — 기록 3개의 요약은 초안(`draft: true`), 본문·논문 서지 정보 필요. 원문 공개 허락을 받으면 `files`에 추가
- 대표 이미지: `src/components/ProjectThumb.astro`의 도식을 실제 결과 시안 이미지로 교체

## 프로젝트 페이지 구조

`src/content/projects/<slug>.mdx` 하나가 `/projects/<slug>` 한 페이지입니다. 개요(1)는 frontmatter로 자동 생성되고, 본문은 `<Section id="problem|evidence|decisions|experience|before-after|learned">` 순서로 씁니다.

| 컴포넌트 | 용도 |
| --- | --- |
| `Evidence` | 관찰과 근거 카드 |
| `Decision` | 선택 vs 검토한 대안 + 이유 |
| `DemoBlock` | 데모 + 항상 보이는 텍스트 요약 |
| `Case` | 개선 전후 사례 — `id`가 공유·가치 카드용 앵커 |
| `Hypothesis` | 측정하지 않은 개선안의 ‘개선 가설’ (변경·예상 효과·확인 방법) |

## 관찰과 탐구에 기록 추가하기

`src/content/archive/<이름>.md` 파일 하나를 추가하면 카드가 하나 생깁니다. 필수 frontmatter: `title`, `kind`(보고서 / 논문 분석 / 콘텐츠 제작), `order`, `observed`, `interpreted`, `implication`. 스키마는 `src/content.config.ts`에 있습니다.

## 품질 점검 결과 (로컬, 출시 전)

- E2E 43개 통과: 8개 URL, 360·768·1280px 가로 스크롤 없음, axe WCAG 2.2 AA 심각 위반 0, 키보드만으로 메뉴·카드·데모 3종 조작, 가치 카드 → 수정 사례 앵커, 사이트 내부 링크
- Lighthouse(모바일, localhost): 성능 97~100, 접근성·권장사항·SEO 100
- 아직 하지 않은 것: 사용 테스트(지인 3~5명), 카카오톡·슬랙 공유 미리보기 확인, 실제 배포 주소에서 Lighthouse 재측정
