const puppeteer = require('puppeteer');
const fs = require('fs');
const { slugify } = require('./utils');

const urls = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));
const noimage_urls = urls.filter((project)=>!project.image && project.demo);

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  for (const { title, demo } of noimage_urls) {
    console.log("Screenshoting ", demo);
    const name = slugify(title);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(demo, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `thumbnails/${name}.png`, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log(`✓ ${name}`);
    await page.close();
  }

  await browser.close();
})();