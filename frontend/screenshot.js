const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a typical desktop size
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  await page.screenshot({ path: 'landing.png', fullPage: true });
  
  await browser.close();
})();
