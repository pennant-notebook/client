import type { ElementHandle, Page } from "@playwright/test";

export const AUTH_CREDENTIALS = {
  username: "testing",
  password: "123456",
};

/**
 * Login to the application
 */
export const loginUser = async (
  page: Page,
  baseUrl: string = "http://localhost:3000"
): Promise<boolean> => {
  console.log("🔐 Attempting to log in user...");

  try {
    // First, check if we're already logged in
    const isLoggedIn = await checkIfLoggedIn(page);
    if (isLoggedIn) {
      console.log("✅ User is already logged in");
      return true;
    }

    const loginPaths = [`${baseUrl}/auth`, baseUrl];

    for (const loginPath of loginPaths) {
      console.log(`🔍 Trying login path: ${loginPath}`);

      try {
        await page.goto(loginPath, { waitUntil: "networkidle", timeout: 10000 });

        // Look for login form elements
        const loginSuccess = await attemptLogin(page);
        if (loginSuccess) {
          console.log(`✅ Successfully logged in via ${loginPath}`);
          return true;
        }
      } catch (error) {
        console.log(`❌ Login attempt failed for ${loginPath}:`, error);
      }
    }

    // If no dedicated login page, try the main page
    console.log("🔍 Trying login from main page...");
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    const mainPageLogin = await attemptLogin(page);
    if (mainPageLogin) {
      console.log("✅ Successfully logged in from main page");
      return true;
    }

    console.log("❌ All login attempts failed");
    return false;
  } catch (error) {
    console.log("❌ Login process failed:", error);
    return false;
  }
};

/**
 * Check if user is already logged in
 */
export const checkIfLoggedIn = async (page: Page): Promise<boolean> => {
  try {
    const loggedInIndicators = [
      ".avatar",
      '[class*="avatar"]',
      ".user-menu",
      '[href*="logout"]',
      '[data-test*="logout"]',
    ];

    for (const indicator of loggedInIndicators) {
      try {
        const element = await page.waitForSelector(indicator, { timeout: 1000 }); // Reduced timeout
        if (element && (await element.isVisible())) {
          console.log(`✅ Found login indicator: ${indicator}`);
          return true;
        }
      } catch (error) {
        // Continue checking other indicators
      }
    }

    const logInButtons = await page.$('button:has-text("Log In"), a:has-text("Log In")');
    if (!logInButtons) {
      console.log("❌ No 'Log In' buttons found");
      return false;
    }

    if (logInButtons) {
      console.log('✅ No "Log In" buttons found - likely logged in');
      return true;
    }

    // If we see the "Log In" button, we're probably not logged in
    console.log('❌ Found "Log In" button - not logged in');
    return false;
  } catch (error) {
    console.log("Could not determine login status:", error);
    return false;
  }
};

/**
 * Attempt to login using various form strategies
 */
export const attemptLogin = async (page: Page): Promise<boolean> => {
  try {
    // Strategy 1: Look for "Sign In" button on main page (from screenshot)
    const signInButtons = ['button:has-text("Log In")', 'a:has-text("Log In")'];

    for (const selector of signInButtons) {
      try {
        const button = await page.waitForSelector(selector, { timeout: 2000 });
        if (button && (await button.isVisible())) {
          console.log(`Found Log In button: ${selector}`);
          await button.click();

          // Wait for auth page to load
          await page.waitForTimeout(3000);
          console.log(`After clicking Log In, current URL: ${page.url()}`);

          // Now try to fill the login form
          const loginSuccess = await fillLoginForm(page);
          if (loginSuccess) {
            return true;
          }
        }
      } catch (error) {
        // Continue to next button
      }
    }

    // Strategy 2: Look for existing login form on current page
    return await fillLoginForm(page);
  } catch (error) {
    console.log("Login attempt failed:", error);
    return false;
  }
};

/**
 * Fill in login form with credentials
 */
export const fillLoginForm = async (page: Page): Promise<boolean> => {
  try {
    console.log("🔍 Looking for username/email field...");

    // Updated selectors based on actual auth form DOM structure
    const usernameSelectors = [
      'input.ant-input[placeholder*="Username"]', // Actual class and placeholder from DOM
      'input[placeholder="Username or Email"]', // Exact placeholder from DOM
      'input[placeholder*="Username"]',
      'input[placeholder*="Email"]',
      'input[name="username"]',
      'input[name="email"]',
      'input[type="email"]',
      'input[placeholder*="username"]',
      'input[placeholder*="email"]',
      '[data-test*="username"]',
      '[data-test*="email"]',
      "#username",
      "#email",
      // Generic input fields (the form might not have specific names)
      'form input[type="text"]:first-of-type',
      'form input:not([type="password"]):first-of-type',
    ];

    let usernameField: ElementHandle<SVGElement | HTMLElement> | null = null;
    for (const selector of usernameSelectors) {
      try {
        const field = await page.waitForSelector(selector, { timeout: 2000 });
        if (field && (await field.isVisible())) {
          usernameField = field;
          console.log(`✅ Found username field: ${selector}`);
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    if (!usernameField) {
      console.log("❌ No username field found");
      return false;
    }

    console.log("🔍 Looking for password field...");

    // Password field selectors - updated based on actual DOM
    const passwordSelectors = [
      'input.ant-input[type="password"]', // Actual class from DOM
      'input[type="password"]',
      'input[placeholder*="Password"]',
      'input[name="password"]',
      '[data-test*="password"]',
      "#password",
    ];

    let passwordField: ElementHandle<SVGElement | HTMLElement> | null = null;
    for (const selector of passwordSelectors) {
      try {
        const field = await page.waitForSelector(selector, { timeout: 2000 });
        if (field && (await field.isVisible())) {
          passwordField = field;
          console.log(`✅ Found password field: ${selector}`);
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    if (!passwordField) {
      console.log("❌ No password field found");
      return false;
    }

    // Fill in the credentials
    console.log("📝 Filling in credentials...");
    await usernameField.fill(AUTH_CREDENTIALS.username);
    await passwordField.fill(AUTH_CREDENTIALS.password);

    // Find and click submit button - updated based on actual DOM structure
    const submitSelectors = [
      "button._authButton_ymm8q_130", // Actual button class from DOM
      'button:has-text("Log In")',
      'button:has-text("Sign In")',
      'button:has-text("Login")',
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Submit")',
      '[data-test*="submit"]',
      '[data-test*="login"]',
      // Generic form button
      "form button",
    ];

    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const button = await page.waitForSelector(selector, { timeout: 2000 });
        if (button && (await button.isVisible()) && (await button.isEnabled())) {
          console.log(`🚀 Clicking submit button: ${selector}`);
          await button.click();
          submitted = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    if (!submitted) {
      console.log("⌨️ No submit button found, trying Enter key");
      await passwordField.press("Enter");
    }

    // Wait for login to complete
    console.log("⏳ Waiting for login to complete...");
    await page.waitForTimeout(5000); // Increased timeout

    // Check if login was successful
    const loginSuccess = await checkIfLoggedIn(page);

    if (loginSuccess) {
      console.log("✅ Login successful!");
      return true;
    } else {
      console.log("❌ Login may have failed - checking for error messages");

      // Check for error messages
      const errorSelectors = [
        ".error",
        ".alert-error",
        '[class*="error"]',
        ".message",
        '[data-test*="error"]',
        ".text-red-500", // Tailwind error classes
        ".text-danger",
      ];

      for (const selector of errorSelectors) {
        try {
          const errorElement = await page.$(selector);
          if (errorElement) {
            const errorText = await errorElement.innerText();
            console.log(`❌ Error message found: ${errorText}`);
          }
        } catch (error) {
          // Continue checking
        }
      }

      return false;
    }
  } catch (error) {
    console.log("❌ Error filling login form:", error);
    return false;
  }
};

/**
 * Navigate to notebook with authentication
 */
export const navigateToAuthenticatedNotebook = async (
  page: Page,
  notebookUrl: string,
  maxRetries: number = 3
): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(
      `📓 Attempting to navigate to notebook (attempt ${attempt}/${maxRetries}): ${notebookUrl}`
    );

    try {
      await page.goto(notebookUrl, { waitUntil: "networkidle", timeout: 20000 });

      // Check if we were redirected to login (indicates auth required)
      const currentUrl = page.url();
      if (
        currentUrl.includes("auth") ||
        currentUrl.includes("login") ||
        currentUrl.includes("signin")
      ) {
        console.log("🔐 Redirected to login, attempting authentication...");
        const loginSuccess = await loginUser(page);

        if (loginSuccess) {
          console.log("✅ Login successful, retrying notebook navigation...");
          await page.goto(notebookUrl, { waitUntil: "networkidle", timeout: 20000 });
        } else {
          console.log("❌ Login failed, cannot access notebook");
          continue;
        }
      }

      // Verify we're on the right page
      const pageTitle = await page.title();
      const bodyContent = await page.textContent("body");

      console.log(`📄 Page loaded - Title: "${pageTitle}", URL: ${page.url()}`);

      // Check for signs this is a notebook page
      const isNotebookPage =
        pageTitle.toLowerCase().includes("notebook") ||
        pageTitle.toLowerCase().includes("code") ||
        bodyContent?.includes("Code") ||
        bodyContent?.includes("Markdown") ||
        (await page.$('[data-test*="code"]')) !== null ||
        (await page.$(".code-cell")) !== null ||
        (await page.$('button:has-text("+ Code")')) !== null;

      if (isNotebookPage) {
        console.log("✅ Successfully navigated to notebook page");
        return true;
      } else {
        console.log("⚠️ Page loaded but doesn't appear to be a notebook");
        if (attempt < maxRetries) {
          await page.waitForTimeout(2000);
          continue;
        }
      }
    } catch (error) {
      console.log(`❌ Navigation attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await page.waitForTimeout(2000);
        continue;
      }
    }
  }

  console.log("❌ Failed to navigate to notebook after all attempts");
  return false;
};
