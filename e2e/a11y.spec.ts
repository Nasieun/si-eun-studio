import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES, waitForIslands } from './pages';

// WCAG 2.2 AA 자동 점검 (PRD STEP 03 · 3.2). 자동 도구가 잡지 못하는 부분은 keyboard.spec.ts와 수동 점검으로 보완한다.
for (const path of PAGES) {
  for (const width of [360, 1280]) {
    test(`axe ${path} @${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await waitForIslands(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(
        serious.map((v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`),
      ).toEqual([]);
    });
  }
}
