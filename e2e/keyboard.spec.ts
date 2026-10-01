import { test, expect } from '@playwright/test';
import { waitForIslands } from './pages';

test('모바일 메뉴를 키보드로 열고 Esc로 닫는다', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/about');
  const toggle = page.getByRole('button', { name: '메뉴' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const current = page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '소개' });
  await expect(current).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('본문 바로가기 링크가 첫 Tab에 나타난다', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
});

test('홈 문제 카드를 Tab + Enter로 연다', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => document.activeElement?.closest('.problem') != null)) break;
  }
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/fly-and-speak\/?$/);
});

test('가치 카드를 키보드로 펼치고 접는다', async ({ page }) => {
  await page.goto('/approach');
  const btn = page.locator('#passion [data-value-toggle]');
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#passion-cases')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#passion-cases')).toBeHidden();
});

test('FLY&SPEAK 학습 흐름을 키보드만으로 끝까지 진행한다', async ({ page }) => {
  await page.goto('/projects/fly-and-speak');
  await waitForIslands(page);
  const demo = page.locator('.demo-block').first();
  const press = async (name: RegExp | string) => {
    await demo.getByRole('button', { name }).focus();
    await page.keyboard.press('Enter');
  };
  await press(/승무원에게 요청하기/);
  await press('역할극 시작하기');
  await press(/Could I have some water/);
  await press('다음 대화');
  await press(/blanket/);
  await press('연습 마치기');
  await expect(demo.getByRole('heading', { name: /연습 완료/ })).toBeFocused();
  await press('다른 상황 해보기');
  await expect(demo.getByRole('heading', { name: /어떤 상황/ })).toBeVisible();
});

test('홈 화면 전후 비교: 영역 버튼이 강조 상태와 설명 패널을 바꾼다', async ({ page }) => {
  await page.goto('/projects/fly-and-speak');
  await waitForIslands(page);
  const demo = page.locator('.demo-block').nth(1);
  const btn = demo.getByRole('button', { name: '기내 환경 반영' });
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.locator('.explain')).toContainText('와이파이');
  await expect(demo.locator('.explain')).toContainText('개선 가설');
});

test('승차 시뮬레이션: 방향키로 단계를 바꾸고 접점 설명을 연다', async ({ page }) => {
  await page.goto('/projects/smart-boarding');
  await waitForIslands(page);
  const demo = page.locator('.demo-block').first();
  await demo.getByRole('tab', { selected: true }).focus();
  await page.keyboard.press('ArrowRight');
  const arriving = demo.getByRole('tab', { name: /버스 도착/ });
  await expect(arriving).toHaveAttribute('aria-selected', 'true');
  await expect(arriving).toBeFocused();
  await demo.locator('.touch-list').getByRole('button', { name: /기사석 패널/ }).focus();
  await page.keyboard.press('Enter');
  await expect(demo.locator('.explain')).toContainText('누구에게');
  await expect(demo.getByRole('button', { name: /자동 재생/ })).toHaveAttribute('aria-pressed', 'false');
});

test('핫스팟 비교: 사례 탭·토글·목록을 키보드로 조작한다', async ({ page }) => {
  await page.goto('/projects/ad-attention');
  await waitForIslands(page);
  const demo = page.locator('.demo-block').first();
  await demo.getByRole('tab', { selected: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(demo.getByRole('tab', { name: /무신사/ })).toHaveAttribute('aria-selected', 'true');
  await demo.getByRole('button', { name: '개선 제안' }).focus();
  await page.keyboard.press('Enter');
  const item = demo.locator('.hs-list button').first();
  await item.focus();
  await page.keyboard.press('Enter');
  await expect(item).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.locator('.explain')).toContainText('개선 가설');
});

test('360px에서 데모 버튼의 터치 영역이 44px 이상이다', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/projects/fly-and-speak', '/projects/smart-boarding', '/projects/ad-attention']) {
    await page.goto(path);
    await waitForIslands(page);
    const small = await page.$$eval('.demo-block button', (bs) =>
      bs
        .filter((b) => (b as HTMLElement).offsetParent !== null)
        .map((b) => ({ t: b.textContent?.trim(), h: Math.round(b.getBoundingClientRect().height) }))
        .filter((b) => b.h < 44),
    );
    expect(small, path).toEqual([]);
  }
});
