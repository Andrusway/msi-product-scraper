const { chromium } = require("playwright");

const URL =
  "https://us-store.msi.com/Motherboards/Intel-Platform-Motherboard/INTEL-Z890/MAG-Z890-TOMAHAWK-WIFI";

async function scrape() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("Opening page...");

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);

  console.log("Page loaded!");
}

scrape();
