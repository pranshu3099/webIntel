require("dotenv").config();
const inquirer = require("inquirer");
const { searchGoogleViaSerpAPI } = require("./search");
const { scrapeWebsite } = require("./scraper/extractor");
const { createProgressBar } = require("./scraper/progressBar");
const { writeToCSV } = require("./utils/csvWriter");
const apiKey = process.env.SERP_API_KEY;
const fs = require("fs");

const getScrappedData = async () => {
  try {
    const { query, maxResults } = await inquirer.prompt([
      {
        type: "input",
        name: "query",
        message:
          "Enter your search query (e.g., cloud computing startups in India):",
        validate: (input) => input.length > 3 || "Enter a valid query",
      },
      {
        type: "number",
        name: "maxResults",
        message:
          "How many companies do you want to search for? (e.g., 10, 20, 30)",
        default: 20,
        validate: (input) =>
          (input > 0 && input <= 100) || "Must be between 1 and 100",
      },
    ]);

    console.log("\n Searching Google...");
    const urls = await searchGoogleViaSerpAPI(query, apiKey, maxResults);
    console.log(`\n Scraping ${urls.length} websites...\n`);
    const results = [];
    const progressBar = createProgressBar(urls.length);
    for (const url of urls) {
      console.log(` Scraping: ${url}`);
      const data = await scrapeWebsite(url);
      results.push(data);
      progressBar.increment();
    }
    progressBar.stop();
    fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
    console.log("\n All data saved to output.json");
    await writeToCSV(results);
  } catch (err) {
    console.error("Error:", err.message);
  }
};

getScrappedData();
