const { chromium, Browser, Page } = require("playwright");
const os = require("os");
const path = require("path");

// global vars for active browser and page
// (hacky)
let browser: typeof Browser | null = null;
let page: typeof Page | null = null;
let ready = false;

export const screenshot = async (): Promise<string | null> => {
  if (!ready) {
    console.log("[chromium] Not ready for screenshot");
    return null;
  }
  console.log("[chromium] Taking screenshot...");
  const screenshotPath = path.join("../../../screenshots/current.png");
  await page.screenshot({ path: screenshotPath });
  console.log(`[chromium] Screenshot saved to ${screenshotPath}`);
  return screenshotPath;
};

export const initChromium = async () => {
  if (ready) return;
  if (browser && page) return;

  browser = await chromium.launch();
  page = await browser.newPage();

  // wait for server to come up
  // retry loop until successful
  while (true) {
    try {
      const response = await page.goto("http://localhost:3000");
      if (response && response.status() === 200) {
        console.log("[chromium] viewer ready for screenshot");
        ready = true;
        break;
      }
      console.log(`[chromium] Got status ${response?.status()}, retrying...`);
    } catch (error) {
      console.log("[chromium] Failed to connect, retrying...", error);
    }

    // Wait 2 seconds before retrying
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};
