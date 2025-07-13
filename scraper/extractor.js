const { tryCheerio } = require("./fetcher");
const { URL } = require("url");

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,5}\)?[-.\s]?)?[\d\s]{6,12}/g;

function clean(matches) {
  return [...new Set(matches)]
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function findContactLikeLinks($, baseUrl) {
  const links = [];
  $("a").each((_, el) => {
    const text = $(el).text().toLowerCase();
    const href = $(el).attr("href");
    if (
      href &&
      (text.includes("contact") ||
        text.includes("about") ||
        text.includes("team"))
    ) {
      try {
        const fullUrl = href.startsWith("http")
          ? href
          : new URL(href, baseUrl).href;
        links.push(fullUrl);
      } catch (e) {
        console.log(`error: ${e.message}`);
      }
    }
  });

  return [...new Set(links)];
}

async function extractDataFromPage($, url) {
  const companyName = $("title").text().trim() || "Not Found";
  const text = $("body").text();
  const emails = clean(text.match(EMAIL_REGEX) || []);
  const phoneNumbers = clean(text.match(PHONE_REGEX) || []);

  return { companyName, websiteURL: url, emails, phoneNumbers };
}

async function scrapeWebsite(url) {
  try {
    const $ = await tryCheerio(url);
    const mainData = await extractDataFromPage($, url);

    const contactLinks = findContactLikeLinks($, url);
    const secondaryResults = [];

    for (const link of contactLinks.slice(0, 2)) {
      try {
        const $sub = await tryCheerio(link);
        const subData = await extractDataFromPage($sub, link);
        secondaryResults.push(subData);
      } catch (_) {}
    }

    // Merge emails and phones
    for (const sub of secondaryResults) {
      mainData.emails.push(...sub.emails);
      mainData.phoneNumbers.push(...sub.phoneNumbers);
    }

    mainData.emails = clean(mainData.emails);
    mainData.phoneNumbers = clean(mainData.phoneNumbers);

    return mainData;
  } catch (error) {
    return {
      companyName: "error fetching data",
      websiteURL: url,
      emails: [],
      phoneNumbers: [],
      err: error.message,
    };
  }
}

module.exports = { scrapeWebsite };
