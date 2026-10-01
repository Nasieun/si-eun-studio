# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Korean-language UX portfolio site ("시은의 경험 설계실") built with Astro (static output), React islands for interactive demos, and MDX content. Requirements live in `PRD_STEP_01.md`–`PRD_STEP_03.md`; each step was built and committed separately. UI copy is Korean, 해요체.

## Commands

```bash
npm run dev       # http://localhost:4321
npm run build     # astro build + scripts/subset-font.mjs (writes dist/fonts/pretendard-subset.woff2)
npm run preview
npm run check     # astro check (types + content schema)
npm run test:e2e  # build, then Playwright against astro preview on :4322
npx playwright test e2e/keyboard.spec.ts -g "<title regex>"   # single test (needs an existing build)
```

Deployment: push to `main` → `.github/workflows/deploy.yml` runs check + build + e2e, then rebuilds with the repo base path and deploys to GitHub Pages. The workflow passes `BASE_PATH` (`/<repo>`) and `SITE_URL`; locally both default to root.

## Architecture

- **Base path**: the site is served under `/<repo>/` on GitHub Pages. Every internal link or asset path must go through `url()` from `src/lib/url.ts` (also usable in React demos via `import.meta.env.BASE_URL`). Hard-coded `/foo` links break in production. Verify with `BASE_PATH=/x npm run build` and grep `dist/`.
- **Design tokens**: `src/styles/tokens.css` (CSS variables, mobile values by default, PC values at ≥1024px). Shared component classes (`.card`, `.card__link`, `.btn`, `.tab`, `.badge`, `.compare`, `.explain`, `.hotspot`, `.device`) are in `src/styles/global.css`. Accent colors (`--accent-blue`, `--accent-lavender`) are backgrounds only, never text color.
- **Projects**: `src/content/projects/<slug>.mdx` → `/projects/<slug>` via `src/pages/projects/[slug].astro`. Frontmatter schema is in `src/content.config.ts`; `order` drives home cards, list order and prev/next.
- **Value ↔ case links**: `src/data/values.ts` points at `<Case id>` anchors in the project MDX; `Case` value badges link back to `/approach#<value-id>`. Renaming a case id breaks the link — e2e `site.spec.ts` catches it.
- **Archive**: `src/content/archive/*.md` → cards on `/archive` (schema in `src/content.config.ts`).
- **Demos**: React islands in `src/components/demos/` (`client:visible`), content in `src/data/demos/*.ts`. Shared a11y primitives (`TabList` with arrow keys, `ToggleGroup` with aria-pressed, `ExplainPanel` with aria-live) are in `shared.tsx`. In tests, call `waitForIslands()` before interacting or clicks are lost before hydration.
- **Font**: Pretendard is self-hosted as a per-build subset with `font-display: optional` (the CDN dynamic subset cost ~20 points of mobile Lighthouse). New characters are picked up automatically on the next build.
- **Site-wide data**: nav, contacts, about copy, AI notice in `src/data/site.ts`.
- **Placeholders**: unknown facts are never invented. They render through `<Todo>` (`src/components/Todo.astro`) or `TODO` comments. Don't publish fabricated metrics or user-test results (PRD rule); unmeasured improvements must be marked as 개선 가설.

## Conventions

- Accessibility is a requirement, not polish: 44px touch targets, visible focus, `aria-selected`/`aria-expanded`/`aria-pressed` on tabs and toggles, `aria-live` for demo state, `prefers-reduced-motion` respected (tokens zero out durations).
- Breakpoints: mobile <768 (1 column, hamburger), tablet 768–1023 (2 columns), PC ≥1024 (3 columns, max 1200px).
- On Windows Git Bash, prefix commands that pass `/paths` as arguments with `MSYS_NO_PATHCONV=1`.
