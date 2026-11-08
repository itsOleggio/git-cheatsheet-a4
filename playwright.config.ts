import { defineConfig } from '@playwright/test';

const port = 4173;

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: 'tests/visual/baseline/{arg}{ext}',
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${port}/git-cheatsheet-a4/`,
    viewport: { width: 900, height: 1300 },
    deviceScaleFactor: 2,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,
      threshold: 0,
      animations: 'disabled',
      caret: 'hide',
      scale: 'device',
    },
  },
  webServer: {
    command: `npm run build && npm run preview -- --port ${port} --strictPort`,
    url: `http://localhost:${port}/git-cheatsheet-a4/`,
    reuseExistingServer: false,
  },
});
