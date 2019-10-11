const puppeteer = require('puppeteer');
const fs = require('fs');
const lineReader = require('line-reader');

function getFileName(url) {
    let path = url.replace('https://www.', '').replace(/[/\\?%*:|"<>]/g, '-');
    path = path.split(".").join("-");
    return `hrefs/${path}.json`;
}

async function generateUrlsToCrawl(urls) {
    const browser = await puppeteer.launch();

    let links = [];

    urls.forEach(async url => {
        let page = await browser.newPage();
        await page.goto(url);

        let hrefs = await page.$$eval('a', as => as.map(a => a.href));
        hrefs.forEach(function (link) {
            if (!links.includes(link) && !link.includes("javascript:void(0)") && link != "") {
                links.push(link)
            }
        });

        let jsonLinks = await JSON.stringify(links);

        fs.writeFile(getFileName(url), jsonLinks, function (err, result) {
            if (err) console.log('error', err);
        });

        await page.close();

    });
}

function getEntrypoints() {
    return fs.readFileSync("entrypoints.txt", 'utf-8')
        .split('\r')
        .join('')
        .split('\n')
        .filter(Boolean);
}

let entrypoints = getEntrypoints()

generateUrlsToCrawl(entrypoints);