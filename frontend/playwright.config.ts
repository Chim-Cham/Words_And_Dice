import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const uiTestDir = defineBddConfig({
  features: "e2e/ui/features/**/*.feature",
  steps: ["e2e/ui/steps/**/*.ts", "e2e/ui/pages/**/*.ts"],
  outputDir: ".features-gen/ui",
});

export default defineConfig({
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["list"], ["html", { open: "on-failure" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "ui",
      testDir: uiTestDir,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "frontend-tests",
      testDir: "./frontend-tests",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
