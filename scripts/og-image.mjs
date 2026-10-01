// 공유 미리보기 이미지(1200×630) 생성: node scripts/og-image.mjs → public/og.png
// 문구나 색을 바꿨을 때만 다시 실행하면 된다. (Playwright Chromium 필요: npx playwright install chromium)
import { chromium } from '@playwright/test';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>
  body{margin:0;width:1200px;height:630px;background:#f7f8fa;font-family:'Pretendard Variable',sans-serif;color:#20344a;display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box;position:relative;overflow:hidden}
  .en{font-size:22px;font-weight:700;letter-spacing:.28em}
  h1{font-size:60px;line-height:1.35;margin:28px 0 24px;letter-spacing:-.02em}
  p{font-size:26px;color:#4a5d72;margin:0}
  .b{position:absolute;right:-80px;top:-80px;width:360px;height:360px;border-radius:50%;background:#a9cbea;opacity:.7}
  .l{position:absolute;right:120px;bottom:-140px;width:300px;height:300px;border-radius:50%;background:#c7bfe8;opacity:.7}
</style></head><body><div class="b"></div><div class="l"></div>
<div class="en">SI EUN EXPERIENCE STUDIO</div>
<h1>사람이 느끼는 작은 불편을 발견하고,<br>더 나은 경험을 설계합니다.</h1>
<p>시은의 경험 설계실 · UX·서비스 기획 포트폴리오</p></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png 생성 완료');
