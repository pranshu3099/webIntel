const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

async function fetchWithAxios(url) {
  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/102.0.0.0 Safari/537.36",
    },
  });
  return cheerio.load(response?.data);
}

async function fetchWithPuppeteer(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/102.0.0.0 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
  const html = await page.content();
  await browser.close();
  return cheerio.load(html);
}

async function tryCheerio(url) {
  try {
    return await fetchWithAxios(url);
  } catch (err) {
    // fallback to puppeteer
    try {
      return await fetchWithPuppeteer(url);
    } catch (e) {
      throw new Error(`Both axios and puppeteer failed: ${e.message}`);
    }
  }
}

module.exports = { tryCheerio };
