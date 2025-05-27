# Browser Crash Fix Guide 🔧

## 🚨 Problem Identified

Your Playwright tests are crashing with a **browser segmentation fault** (`SEGV_ACCERR`). This is a browser process crash, not a test logic issue.

## 🔧 Immediate Fixes

### 1. Update Playwright Configuration

Replace your `playwright.config.ts` with the simplified version I provided. The key changes:

**❌ Problematic flags (removed):**

```typescript
"--disable-web-security", "--disable-features=VizDisplayCompositor", "--disable-setuid-sandbox";
```

**✅ Stable flags (keeping only essential):**

```typescript
"--no-sandbox", "--disable-dev-shm-usage";
```

### 2. Test Browser Stability First

Run this minimal test to verify browser launching works:

```bash
# Create the minimal test
touch tests/e2e/browser-stability.spec.ts
```

Copy the "Minimal Browser Test" content and run:

```bash
npx playwright test tests/e2e/browser-stability.spec.ts --headed
```

## 🔍 Troubleshooting Steps

### Step 1: Test Different Browsers

```bash
# Test with Firefox (usually more stable)
npx playwright test tests/e2e/browser-stability.spec.ts --project=firefox --headed

# Test with WebKit
npx playwright test tests/e2e/browser-stability.spec.ts --project=webkit --headed

# Test with Chromium (if others work)
npx playwright test tests/e2e/browser-stability.spec.ts --project=chromium --headed
```

### Step 2: Update Playwright

```bash
# Update to latest version
npm install --save-dev @playwright/test@latest

# Reinstall browsers
npx playwright install
```

### Step 3: System-Specific Fixes

#### macOS (Your System):

```bash
# Clear Playwright cache
rm -rf ~/Library/Caches/ms-playwright

# Reinstall browsers
npx playwright install chromium

# If still crashing, try with Rosetta (if on Apple Silicon):
arch -x86_64 npx playwright test
```

#### Memory Issues:

```bash
# Check available memory
vm_stat

# Close other applications
# Restart your machine if needed
```

## 🎯 Alternative Configurations

### Option 1: Headless Only (Most Stable)

```typescript
// In playwright.config.ts
use: {
  headless: true, // Force headless mode
  // ... other options
}
```

### Option 2: Different Browser Binary

```typescript
projects: [
  {
    name: "chromium",
    use: {
      ...devices["Desktop Chrome"],
      launchOptions: {
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // Use system Chrome
      },
    },
  },
];
```

### Option 3: Slower, More Stable Config

```typescript
use: {
  actionTimeout: 30000,
  navigationTimeout: 60000,
  launchOptions: {
    slowMo: 50, // Slow down operations
    timeout: 60000
  }
}
```

## 🚀 Quick Resolution Steps

### 1. First, Try the Minimal Test

```bash
# Use the updated config and run minimal test
npx playwright test tests/e2e/browser-stability.spec.ts --project=firefox --headed
```

### 2. If Firefox Works, Use Firefox for Development

```bash
# Run your auth tests with Firefox
npx playwright test tests/e2e/auth-validation.spec.ts --project=firefox --headed
```

### 3. Fix Chromium Issues Later

Once you confirm your tests work with Firefox, you can troubleshoot Chromium specifically.

## 🔄 Testing Workflow

### Immediate Steps:

1. **Update config** → Use simplified browser flags
2. **Test stability** → Run minimal browser test
3. **Use Firefox** → More stable for development
4. **Run auth tests** → Verify your actual functionality works

### Commands:

```bash
# 1. Test browser stability
npx playwright test tests/e2e/browser-stability.spec.ts --project=firefox

# 2. If that works, test authentication
npx playwright test tests/e2e/auth-validation.spec.ts --project=firefox --headed

# 3. Once auth works, test main functionality
npx playwright test tests/e2e/codecell-auth.spec.ts --project=firefox --headed
```

## 🎯 Expected Results

### ✅ Success:

```
🚀 Testing browser launch: firefox
✅ Browser launched successfully
✅ Successfully loaded: http://localhost:3000
📄 Page title: Pennant
📸 Screenshot saved for firefox
```

### 🔧 Still Crashing:

If Firefox also crashes, the issue might be:

- System-level (restart machine)
- Node.js version incompatibility
- Playwright installation corruption

### Next Steps After Stability:

Once browsers launch successfully:

1. Your auth tests should work
2. You can debug login flow properly
3. Focus on test logic instead of browser crashes

## 💡 Tips

- **Use Firefox for development** - More stable than Chromium
- **Run headless in CI** - More reliable for automation
- **Use system Chrome** if Playwright's Chromium keeps crashing
- **Always test browser stability first** before complex test logic

The key is getting **any browser working first**, then you can focus on your authentication and test functionality!
