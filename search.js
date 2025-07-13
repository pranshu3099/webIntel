const axios = require("axios");
const validUrl = require("valid-url");

function looksLikeCompany(url) {
  const blacklist = [
    "quora.com",
    "reddit.com",
    "stackexchange.com",
    "stackoverflow.com",
    "medium.com",
  ];
  return (
    validUrl.isUri(url) &&
    !blacklist.some((bad) => url.includes(bad)) &&
    (url.includes(".com") || url.includes(".in"))
  );
}

async function searchGoogleViaSerpAPI(query, apiKey, maxResults = 30) {
  const urls = new Set();

  for (let start = 0; urls.size < maxResults && start < 100; start += 10) {
    try {
      const response = await axios.get("https://serpapi.com/search", {
        params: {
          engine: "google",
          q: query,
          api_key: apiKey,
          start: start,
          num: 10,
        },
      });

      const results = response.data.organic_results || [];

      results.forEach((r) => {
        if (r.link && looksLikeCompany(r.link)) {
          urls.add(r.link);
        }
      });

      // Stop if we didn’t get 10 new results (end of search)
      if (results.length < 10) break;
    } catch (error) {
      console.error(`🔁 Page ${start}: Search failed: ${error.message}`);
      break;
    }
  }

  return Array.from(urls).slice(0, maxResults);
}

module.exports = { searchGoogleViaSerpAPI };
