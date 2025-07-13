const cliProgress = require("cli-progress");
function createProgressBar(total) {
  const bar = new cliProgress.SingleBar({
    format: "Scraping [{bar}] {percentage}% | {value}/{total} sites",
    barCompleteChar: "#",
    barIncompleteChar: "-",
    hideCursor: true,
  });
  bar.start(total, 0);
  return bar;
}
module.exports = { createProgressBar };
