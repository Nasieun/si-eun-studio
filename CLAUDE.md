# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Korean-language UX portfolio site ("시은의 경험 설계실") built with Astro (static output), React islands for interactive demos, and MDX content. Requirements live in `PRD_STEP_01.md`–`PRD_STEP_03.md`; each step was built and committed separately. UI copy is Korean, 해요체.

## Commands

```bash
npm run dev       # http://localhost:4321
npm run build     # static site → dist/
npm run preview
npm run check     # astro check (types + content schema)
```

Deployment: push to `main` → `.github/workflows/deploy.yml` builds and deploys to GitHub Pages. The workflow passes `BASE_PATH` (`/<repo>`) and `SITE_URL`; locally both default to root.

## Architecture

- **Base path**: the site is served under `/<repo>/` on GitHub Pages. Every internal link or asset path must go through `url()` from `src/lib/url.ts` (also usable in React demos via `import.meta.env.BASE_URL`). Hard-coded `/foo` links break in production. Verify with `BASE_PATH=/x npm run build` and grep `dist/`.
- **Design tokens**: `src/styles/tokens.css` (CSS variables, mobile values by default, PC values at ≥1024px). Shared component classes (`.card`, `.card__link`, `.btn`, `.tab`, `.badge`, `.compare`, `.explain`, `.hotspot`, `.device`) are in `src/styles/global.css`. Accent colors (`--accent-blue`, `--accent-lavender`) are backgrounds only, never text color.
- **Projects**: `src/content/projects/<slug>.mdx` → `/projects/<slug>` via `src/pages/projects/[slug].astro`. Frontmatter schema is in `src/content.config.ts`; `order` drives home cards, list order and prev/next.
- **Site-wide data**: nav, contacts, about copy, AI notice in `src/data/site.ts`.
- **Placeholders**: unknown facts are never invented. They render through `<Todo>` (`src/components/Todo.astro`) or `TODO` comments. Don't publish fabricated metrics or user-test results (PRD rule); unmeasured improvements must be marked as 개선 가설.

## Conventions

- Accessibility is a requirement, not polish: 44px touch targets, visible focus, `aria-selected`/`aria-expanded`/`aria-pressed` on tabs and toggles, `aria-live` for demo state, `prefers-reduced-motion` respected (tokens zero out durations).
- Breakpoints: mobile <768 (1 column, hamburger), tablet 768–1023 (2 columns), PC ≥1024 (3 columns, max 1200px).
- On Windows Git Bash, prefix commands that pass `/paths` as arguments with `MSYS_NO_PATHCONV=1`.
