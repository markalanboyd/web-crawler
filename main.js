const { argv } = require("node:process");
const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
    if (argv.length < 3) {
        console.error("missing URL to crawl");
        return;
    }
    if (argv.length > 3) {
        console.error("too many arguments");
        return;
    }

    const baseURL = process.argv[2];

    let pages = {};
    pages = await crawlPage(baseURL, baseURL, pages);
    printReport(pages);
}

main();
