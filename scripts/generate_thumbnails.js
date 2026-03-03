// const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));
const noimage_urls = urls.filter((project)=>!project.image && project.demo);

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  for (const { title, url } of noimage_urls) {
    const name = encodeURIComponent(title);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `thumbnails/${name}.png`, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log(`✓ ${name}`);
    await page.close();
  }

  await browser.close();
})();