const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    browserName: 'chromium',
    trace: 'on-first-retry',
  },
});
