const puppeteer = require('puppeteer');
const fs = require('fs');
const lineReader = require('line-reader');

function getFileName(url) {
    let path = url.replace('https://www.', '').replace(/[/\\?%*:|"<>]/g, '-');
    path = path.split(".").join("-");
    return `hrefs/${path}.json`;
}

async function getPageHrefs(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    let links = [];

    let hrefs = await page.$$eval('a', as => as.map(a => a.href));
    hrefs.forEach(function (link) {
        if (!links.includes(link) && !link.includes("javascript:void(0)") && link != "") {
            links.push(link)
        }
    });

    await browser.close();

    let jsonLinks = await JSON.stringify(links);

    fs.writeFile(getFileName(url), jsonLinks, function (err, result) {
        if (err) console.log('error', err);
    });
}

async function crawler(entryPoints) {

    let links = [];

    entryPoints.forEach(async function (url) {
        let newLinks = await getPageHrefs(url);

        links = links.concat(newLinks);

    })

    return links;

}

function getEntrypoints(){
    return fs.readFileSync("entrypoints.txt", 'utf-8')
    .split('\r')
    .join('')
    .split('\n')
    .filter(Boolean);
}

let entrypoints = getEntrypoints()

crawler(entrypoints);