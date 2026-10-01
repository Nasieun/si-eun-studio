# 시은의 경험 설계실 — SI EUN EXPERIENCE STUDIO

> 사람이 느끼는 작은 불편을 발견하고, 더 나은 경험을 설계합니다.

관찰에서 시작해 서비스와 화면으로 구체화한 작업을 소개하는 포트폴리오 웹사이트입니다.
설계 문서: `PRD_STEP_01.md`, `PRD_STEP_02.md`, `PRD_STEP_03.md`

## 빠르게 실행하기

```bash
npm install
npm run dev       # 개발 서버  http://localhost:4321
npm run build     # dist/ 에 정적 사이트 생성
npm run preview   # 빌드 결과를 http://localhost:4321 에서 확인
npm run check     # 타입·콘텐츠 스키마 검사
```

## GitHub Pages로 실행하기

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 검사 → 정적 빌드 → GitHub Pages 배포를 차례로 실행합니다.
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
| STEP 02 | 프로젝트 상세 3개, 인터랙티브 데모 3종 | — |
| STEP 03 | 나의 설계 방식, 관찰과 탐구, 품질 점검, 출시 | — |

## 채워야 할 내용

실제 자료가 없는 자리는 화면에 점선 상자 `〔작성 필요〕`로 보이고, 코드에서는 `<Todo` 또는 `TODO`로 찾을 수 있습니다.

```bash
grep -rn "Todo\|TODO" src
```

- `src/data/site.ts` — 공개할 이메일·링크드인, 실제 사용한 도구(`verified`), 이력서 PDF
