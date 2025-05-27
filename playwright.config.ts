import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

// Safe environment variable access
const getEnvVar = (name: string): string | undefined => {
  try {
    return typeof process !== "undefined" && process.env ? process.env[name] : undefined;
  } catch {
    return undefined;
  }
};

const isCI = !!getEnvVar("CI");
const devServer = getEnvVar("DEVSERVER");
const nodeEnv = getEnvVar("NODE_ENV") || "development";
const runInDocker = getEnvVar("RUN_IN_DOCKER");

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  /* Maximum time one test can run for. */
  timeout: isCI ? 60 * 1000 : 45 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     */
    timeout: isCI ? 10000 : 8000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only - increased retries for flaky tests */
  retries: isCI ? 3 : 1,
  /* Opt out of parallel tests on CI for more stability */
  workers: isCI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI
    ? [
        ["line"],
        [
          "html",
          {
            open: "never",
            outputFolder: "playwright-report",
          },
        ],
        ["github"],
      ]
    : [
        ["line"],
        [
          "html",
          {
            open: "on-failure",
            outputFolder: "playwright-report",
          },
        ],
      ],
  /* Shared settings for all the projects below. */
  use: {
    /* Maximum time each action such as `click()` can take. */
    actionTimeout: isCI ? 15000 : 10000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. */
    trace: "on-first-retry",

    /* Take screenshot on failure */
    screenshot: "only-on-failure",

    /* Record video on failure */
    video: "retain-on-failure",

    /* Navigation timeout */
    navigationTimeout: isCI ? 30000 : 20000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Simplified launch options for better stability
        launchOptions: {
          // Remove potentially problematic flags that can cause crashes
          args: [
            "--no-sandbox", // Keep only essential flags
            "--disable-dev-shm-usage", // Prevent shared memory issues
          ],
        },
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",

  /* Run your local dev server before starting the tests */
  webServer: {
    command: devServer ? "npm run dev" : "npm run build && npm run start",
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !isCI,
    stdout: "ignore",
    stderr: "pipe",
  },

  /* Test-specific settings */
  testIgnore: ["**/*.skip.spec.ts", "**/*.wip.spec.ts"],

  /* Metadata for better reporting */
  metadata: {
    "test-environment": nodeEnv,
    ci: isCI ? "true" : "false",
    docker: runInDocker || "false",
  },
};

export default config;
