import { defineConfig, devices } from '@playwright/test';

// 빌드된 정적 사이트(dist/)를 astro preview로 띄워 실제 배포본과 같은 결과물을 검사한다.
// 먼저 빌드가 필요하다 (`npm run test:e2e`가 함께 실행).
const PORT = 4322;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
