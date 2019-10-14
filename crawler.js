const puppeteer = require('puppeteer');
const fs = require('fs');

function getFileName(folder, url) {
    let path = url.replace('https://www.', '').replace(/[/\\?%*:|"<>]/g, '-');
    path = path.split(".").join("-");
    return `${folder}/${path}.json`;
}

async function crawl(urls, folder) {
    const browser = await puppeteer.launch({
        headless: false
    });

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

        fs.writeFile(getFileName(folder, url), jsonLinks, function (err, result) {
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

module.exports = {
    crawl,
    getEntrypoints
}