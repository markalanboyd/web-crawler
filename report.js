module.exports = { printReport };

function printReport(pages) {
    const sortedPages = sortPages(pages);
    console.log(`\n----------\n`);
    for (const [link, count] of sortedPages) {
        console.log(`Found ${link}: ${count} times`);
    }
}

function sortPages(pages) {
    return Object.entries(pages).sort((a, b) => b[1] - a[1]);
}
