const { url } = require("node:url");
const { JSDOM } = require("jsdom");

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
};

function normalizeURL(url) {
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    if (path !== "/" && path.endsWith("/")) {
        path = path.slice(0, -1);
    }
    return urlObj.protocol + "//" + urlObj.host + path;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const links = dom.window.document.querySelectorAll("a");
    const urls = [];
    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href != null) {
            try {
                let url;
                if (href.startsWith("/")) {
                    const path = href.slice(1);
                    url = new URL(path, baseURL);
                } else {
                    url = new URL(href);
                }
                urls.push(url.toString());
            } catch (error) {
                console.error(`Error processing URL: ${error.message}`);
            }
        }
    });
    return urls;
}

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname != currentURLObj.hostname) {
        return pages;
    }
    const normBaseURL = normalizeURL(baseURL);
    const normCurrURL = normalizeURL(currentURL);

    if (normCurrURL in pages) {
        pages[normCurrURL] += 1;
        return pages;
    } else if (normCurrURL != normBaseURL) {
        pages[normCurrURL] = 1;
    }
    let htmlBody;
    try {
        console.log(`crawling ${normCurrURL}`);
        const response = await fetch(normCurrURL);
        const status = response.status;
        const contentType = response.headers.get("content-type");
        if (status >= 400) {
            console.error(`error: ${response.status}: ${response.statusText}`);
            return pages;
        }
        if (!contentType.includes("text/html")) {
            console.error(`error: expected 'text/html' got '${contentType}'`);
            return pages;
        }
        htmlBody = await response.text();
    } catch (error) {
        console.error(`error: ${error.message}`);
        return pages;
    }
    const urls = getURLsFromHTML(htmlBody, baseURL);
    for (const url of urls) {
        const normURL = normalizeURL(url);
        if (normURL != normBaseURL) {
            pages = await crawlPage(baseURL, url, pages);
        }
    }
    return pages;
}
