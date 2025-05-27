import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  console.log("🚀 Starting global test setup...");

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the development server to be ready
    console.log(`⏳ Waiting for server at ${baseURL} to be ready...`);

    let attempts = 0;
    const maxAttempts = 30;
    let serverReady = false;

    while (attempts < maxAttempts && !serverReady) {
      try {
        await page.goto(baseURL!, { waitUntil: "networkidle", timeout: 5000 });

        // Check if page loaded successfully
        const title = await page.title();
        const bodyText = await page.textContent("body");

        if (title && bodyText && !bodyText.includes("Cannot GET")) {
          serverReady = true;
          console.log(`✅ Server is ready! Page title: "${title}"`);
        } else {
          throw new Error("Server returned error page");
        }
      } catch (error) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} - Server not ready yet...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!serverReady) {
      throw new Error(`❌ Server at ${baseURL} did not become ready after ${maxAttempts} attempts`);
    }

    // Optional: Pre-seed test data or prepare test environment
    await prepareTestEnvironment(page, baseURL!);

    console.log("✅ Global test setup completed successfully");
  } catch (error) {
    console.error("❌ Global test setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function prepareTestEnvironment(page: any, baseURL: string) {
  console.log("🔧 Preparing test environment...");

  try {
    // Check if test documents exist
    const testUrls = [
      `${baseURL}/@testing/9c93ccb1-6154-4a05-a6c8-903d092d2956`, // CodeCell test doc
      `${baseURL}/@testing/46637dd7-a40a-4505-8007-0170e40291c0`, // Alert test doc
    ];

    for (const url of testUrls) {
      try {
        await page.goto(url, { timeout: 10000 });
        const title = await page.title();
        console.log(`📄 Test document accessible: ${url} (title: "${title}")`);
      } catch (error) {
        console.log(`⚠️ Test document not accessible: ${url}`);
        // This is not necessarily a failure - tests should handle fallbacks
      }
    }

    // Check if main app routes work
    const appRoutes = [baseURL, `${baseURL}/editor`, `${baseURL}/notebook`, `${baseURL}/demo`];

    const workingRoutes: string[] = [];

    for (const route of appRoutes) {
      try {
        await page.goto(route, { timeout: 8000 });
        const title = await page.title();
        const hasContent = await page.evaluate(() => {
          return document.body.innerHTML.length > 1000; // Reasonable content check
        });

        if (hasContent) {
          workingRoutes.push(route);
          console.log(`✅ App route working: ${route} (title: "${title}")`);
        }
      } catch (error) {
        console.log(`⚠️ App route not working: ${route}`);
      }
    }

    if (workingRoutes.length === 0) {
      console.log("⚠️ No app routes are working - tests may need to handle this gracefully");
    } else {
      console.log(`✅ Found ${workingRoutes.length} working app routes`);
    }

    // Optional: Initialize any required test data
    await initializeTestData(page, baseURL);
  } catch (error) {
    console.log("⚠️ Test environment preparation had issues:", error);
    // Don't fail setup - tests should be resilient
  }
}

async function initializeTestData(page: any, baseURL: string) {
  try {
    // This is where you might:
    // 1. Create test notebooks/documents if your app supports it
    // 2. Set up authentication tokens
    // 3. Initialize database with test data
    // 4. Clear any previous test artifacts

    console.log("📊 Initializing test data...");

    // Example: Check if app has initialization endpoints
    const initEndpoints = [`${baseURL}/api/test-setup`, `${baseURL}/api/init`, `${baseURL}/health`];

    for (const endpoint of initEndpoints) {
      try {
        const response = await page.goto(endpoint, { timeout: 5000 });
        if (response && response.ok()) {
          console.log(`✅ Initialization endpoint responded: ${endpoint}`);
        }
      } catch (error) {
        // These endpoints probably don't exist - that's fine
      }
    }

    // Example: Set up any required localStorage/sessionStorage
    await page.evaluate(() => {
      // Clear any existing test data
      if (typeof window !== "undefined" && window.localStorage) {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith("test-") || key.startsWith("playwright-")) {
            localStorage.removeItem(key);
          }
        });

        // Set up any required test configuration
        localStorage.setItem("test-mode", "true");
        localStorage.setItem("playwright-test", "active");
      }
    });

    console.log("✅ Test data initialization completed");
  } catch (error) {
    console.log("⚠️ Test data initialization had issues:", error);
    // Non-critical - don't fail setup
  }
}

export default globalSetup;
