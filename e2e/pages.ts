import type { Page } from '@playwright/test';

/** 사이트의 모든 페이지 (PRD STEP 01 · 5장 URL 표) */
export const PAGES = [
  '/',
  '/projects',
  '/projects/fly-and-speak',
  '/projects/smart-boarding',
  '/projects/ad-attention',
  '/approach',
  '/archive',
  '/about',
] as const;

export const WIDTHS = [360, 768, 1280] as const;

/** client:visible 로 붙는 React 데모가 상호작용 가능해질 때까지 기다린다 */
export async function waitForIslands(page: Page) {
  // client:visible 은 화면에 보여야 붙으므로 데모를 한 번씩 화면에 지나가게 한다
  for (const island of await page.locator('astro-island').all()) {
    await island.scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() =>
    [...document.querySelectorAll('astro-island')].every((el) => !el.hasAttribute('ssr')),
  );
}
