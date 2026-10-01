// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages 프로젝트 페이지는 https://<아이디>.github.io/<저장소이름>/ 아래에서 열린다.
// 배포 워크플로가 SITE_URL·BASE_PATH를 넘겨주고, 로컬에서는 루트(/)로 동작한다.
const site = process.env.SITE_URL || 'https://nasieun.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // 첫 화면을 막는 CSS 요청을 없애기 위해 CSS를 HTML에 넣는다 (모바일 LCP)
  build: { inlineStylesheets: 'always' },
  integrations: [react(), mdx(), sitemap()],
});
