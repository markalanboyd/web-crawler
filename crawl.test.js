const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl");

const testURLs = [
    "https://blog.boot.dev/path/",
    "https://blog.boot.dev/path",
    "http://blog.boot.dev/path/",
    "http://BLOG.boot.dev/path/",
];

const targetURL = "blog.boot.dev/path";

for (url of testURLs) {
    test(`Testing ${url} equal to ${targetURL}`, () => {
        expect(normalizeURL(url)).toStrictEqual(targetURL);
    });
}

// const testHTML = [
//     `<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a></body></html>`,
//     `<html><body><a href="https://www.example.com/"><span>Visit</span> <strong>Example</strong></a></body></html>`,
//     `<html><body><a href="https://www.site1.com">Site 1</a> <a>Just Text</a> <a href="https://www.site2.com/">Site 2</a></body></html>`,
//     `<html><body><a href="https://help.example.com" target="_blank">Help Center</a></body></html>`,
// ];

const absoluteCase = {
    html: `<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a></body></html>`,
    baseURL: `https://blog.boot.dev/`,
    expected: [`https://blog.boot.dev/`],
};
test(`Test absolute link`, () => {
    expect(
        getURLsFromHTML(absoluteCase.html, absoluteCase.baseURL)
    ).toStrictEqual(absoluteCase.expected);
});

const multipleCase = {
    html: `<html><body><a href="https://www.ex.com/1"></a><a href="https://www.ex.com/2"></a></body></html>`,
    baseURL: `https://www.ex.com/`,
    expected: [`https://www.ex.com/1`, `https://www.ex.com/2`],
};
test(`Test multiple links`, () => {
    expect(
        getURLsFromHTML(multipleCase.html, multipleCase.baseURL)
    ).toStrictEqual(multipleCase.expected);
});

const relativeCase = {
    html: `<html><body><a href="/home"><span>Go to Boot.dev</span></a></body></html>`,
    baseURL: `https://blog.boot.dev/`,
    expected: [`https://blog.boot.dev/home`],
};
test(`Test relative link`, () => {
    expect(
        getURLsFromHTML(relativeCase.html, relativeCase.baseURL)
    ).toStrictEqual(relativeCase.expected);
});

const brokenCase = {
    html: `<a href="://invalid.url">Broken Link</a>`,
    baseURL: `https://blog.boot.dev/`,
    expected: [],
};
test(`Test broken link`, () => {
    expect(getURLsFromHTML(brokenCase.html, brokenCase.baseURL)).toStrictEqual(
        brokenCase.expected
    );
});
