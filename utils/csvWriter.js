const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

async function writeToCSV(results, filePath = "output.csv") {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "companyName", title: "Company Name" },
      { id: "websiteURL", title: "Website URL" },
      { id: "emails", title: "Emails" },
      { id: "phoneNumbers", title: "Phone Numbers" },
    ],
  });
  // Format emails/phones as comma-separated strings

  const formattedResults = results.map((r) => ({
    ...r,
    emails: r.emails.join(", "),
    phoneNumbers: r.phoneNumbers.join(", "),
  }));

  await csvWriter.writeRecords(formattedResults);
  console.log(`\n✅ CSV exported to ${filePath}`);
}

module.exports = { writeToCSV };
