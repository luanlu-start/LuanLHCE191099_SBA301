import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.js",
  use: {
    baseURL: "http://127.0.0.1:5187",
    browserName: "chromium",
    channel: "msedge",
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5187 --strictPort",
    url: "http://127.0.0.1:5187",
    reuseExistingServer: false,
    timeout: 30000,
  },
  reporter: "list",
});
