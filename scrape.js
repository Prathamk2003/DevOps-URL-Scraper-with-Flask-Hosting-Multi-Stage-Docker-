/**
 * Puppeteer scraper - accepts URL via SCRAPE_URL env var or --url= argument.
 * Extracts page title and first heading, writes result to scraped_data.json.
 */

const p = require('puppeteer');
const f = require('fs');
const path = require('path');

function g() {
  // Command-line: --url=https://example.com or -u https://example.com
  const urlArg = process.argv.find((arg) => arg.startsWith('--url='));
  if (urlArg) return urlArg.slice('--url='.length);
  const uIndex = process.argv.indexOf('-u');
  if (uIndex !== -1 && process.argv[uIndex + 1]) return process.argv[uIndex + 1];
  // Environment variable
  if (process.env.SCRAPE_URL) return process.env.SCRAPE_URL;
  return null;
}

async function scrape(url) {
  const b = await p.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote',
    ],
  });

  try {
    const pg = await b.newPage();
    await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const d = await pg.evaluate(() => {
      const h = document.querySelector('h1');
      return {
        url: window.location.href,
        title: document.title || null,
        firstHeading: h ? h.textContent.trim() : null,
        scrapedAt: new Date().toISOString(),
      };
    });

    const out = path.join(__dirname, 'scraped_data.json');
    f.writeFileSync(out, JSON.stringify(d, null, 2), 'utf8');
    console.log('Scraped data written to', out);
    return d;
  } finally {
    await b.close();
  }
}

(async () => {
  const url = g();
  if (!url) {
    console.error('Usage: SCRAPE_URL=<url> node scrape.js   OR   node scrape.js --url=<url>');
    process.exit(1);
  }
  await scrape(url);
})();
