# WebIntel - Company Data Discovery CLI Tool

**WebIntel** is a Node.js-based command-line tool designed to help you discover companies based on a search query and extract key information like company name, website, email, and phone numbers. It combines search engine queries, intelligent scraping, and optional enhancements to produce structured outputs in both JSON and CSV formats.

---

## ✅ Features Implemented

The following core and optional features have been implemented:

### 🔹 Core Features

- Accepts a search query (e.g., "frontend developer startups in India")
- Uses [SerpAPI](https://serpapi.com/) (Google engine) to extract company URLs
- Validates and deduplicates URLs
- Scrapes each site for:
  - Company Name (`<title>`)
  - Email addresses (via regex)
  - Phone numbers (via regex)

### 🔹 Optional A – Data Extraction Enhancements

- Navigates to internal pages like `/contact`, `/about`, and `/team` to extract deeper data

### 🔹 Optional B – Usability Enhancements

- Real-time progress bar using `cli-progress`
- Outputs data to both `output.json` and `output.csv`
- Pagination support using `start` parameter to go beyond 10 results

---

## 📊 2. Data Extraction Level Demonstrated

We chose to implement and demonstrate:

- ✅ **Basic Level:** Extracting information from the homepage using cheerio and regex
- ✅ **Medium Level:** Visiting internal pages (e.g., `/contact`, `/about`) to extract more complete information
- ❌ **Advanced Level:** (e.g., form-filling, scraping behind logins, PDF parsing) is out of scope

---

## 🧪 3. How to Set Up and Run the Tool

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/webintel.git
cd webintel
```

### Step 2: Install dependencies

`npm install`

### Step 3: Run the CLI tool

` node index.js`

#### you will be prompted too

- Enter a search query (e.g., "AI startups in India")

- Choose the number of companies to scrape (e.g., 10, 20, 30)

### Step 3: View your output

- output.json: Raw structured JSON output

- output.csv: Spreadsheet-friendly data file```

## Design Decisions & Assumptions

- Search Engine: Used SerpAPI with Google as the backend for high-quality and realistic search results.

- Scraping Strategy: Primary method is axios for fast scraping; fallback is puppeteer for JavaScript-heavy pages.

- URL Filtering: StackExchange, Reddit, Medium, and other non-company sites are filtered out before scraping.

- Contact Pages: Up to two internal links (contact/about/team) are visited per site to enrich data.

- Email/Phone Clean-up: Whitespace, duplicates, and invalid formats are removed to ensure clean output.

- Pagination: start parameter used to pull up to 100 results for broader coverage.

- Timeouts: Network requests have a timeout to avoid hanging on slow websites.

- Deduplication: Final output is deduplicated and limited to the top n results specified by the user.

## Dependencies Used

- axios – Makes HTTP requests

- cheerio – Parses and traverses HTML (like jQuery)

- puppeteer – For scraping sites that need JS rendering

- cli-progress – Displays a scraping progress bar

- csv-writer – Exports data into CSV format

- inquirer – Collects interactive input from the user
