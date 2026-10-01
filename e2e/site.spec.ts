import { test, expect } from '@playwright/test';
import { PAGES, WIDTHS } from './pages';

test.describe('모든 페이지', () => {
  for (const path of PAGES) {
    test(`${path} — 열리고 공통 요소가 있다`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeAttached();
      await expect(page.locator('footer')).toContainText('AI');
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
      expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(/og\.png$/);
    });
  }

  test('페이지 제목이 서로 다르다', async ({ page }) => {
    const titles = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(PAGES.length);
  });

  test('제목 계층이 순서를 건너뛰지 않는다', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const levels = await page.$$eval('main h1, main h2, main h3, main h4', (els) =>
        els.filter((e) => (e as HTMLElement).offsetParent !== null).map((e) => Number(e.tagName[1])),
      );
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1], `${path}: h${levels[i - 1]} 다음에 h${levels[i]}`).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe('반응형 — 가로 스크롤 없음', () => {
  for (const width of WIDTHS) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} @${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe('링크 연결', () => {
  test('홈 문제 카드 3개가 각 프로젝트 페이지로 이동한다', async ({ page }) => {
    for (const [i, slug] of ['fly-and-speak', 'smart-boarding', 'ad-attention'].entries()) {
      await page.goto('/');
      await expect(page.locator('.problem .card__link')).toHaveCount(3);
      await page.locator('.problem .card__link').nth(i).click();
      await expect(page).toHaveURL(new RegExp(`/projects/${slug}/?$`));
      await expect(page.locator('#overview')).toBeVisible();
    }
  });

  test('가치 카드의 모든 사례 링크가 프로젝트의 실제 수정 사례로 이동한다', async ({ page }) => {
    await page.goto('/approach');
    await expect(page.locator('.value')).toHaveCount(5);
    const hrefs = await page.$$eval('.case-link', (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
    expect(hrefs.length).toBeGreaterThanOrEqual(5);
    for (const href of hrefs) {
      await page.goto(href);
      const target = page.locator(`[id="${decodeURIComponent(href.split('#')[1])}"]`);
      await expect(target, href).toBeVisible();
      await expect(target, href).toHaveClass(/case/);
    }
  });

  test('프로젝트의 가치 태그가 해당 가치 카드를 펼친 채로 연다', async ({ page }) => {
    await page.goto('/projects/fly-and-speak');
    await page.locator('#case-fly-offline .value-link').first().click();
    await expect(page).toHaveURL(/\/approach\/?#responsibility$/);
    await expect(page.locator('#responsibility [data-value-toggle]')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#responsibility-cases')).toBeVisible();
  });

  test('사이트 안의 모든 링크가 열린다', async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
      hrefs.forEach((h) => seen.add(h.split('#')[0]));
    }
    for (const href of seen) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test('아카이브 기록 3개가 3줄 요약과 펼쳐보기를 갖는다', async ({ page }) => {
    await page.goto('/archive');
    const records = page.locator('.record');
    await expect(records).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const r = records.nth(i);
      await expect(r.locator('dt')).toHaveText(['관찰', '해석', '설계 시사점']);
      await r.locator('summary').click();
      await expect(r.locator('.record__body')).toBeVisible();
    }
  });
});
