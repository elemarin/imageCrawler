const puppeteer = require('puppeteer');
const fs = require ('fs');
const lineReader = require('line-reader');

async function fetchImages(url) {
    let browser = await puppeteer.launch({ headless: true });
    let images = [];
    let page = await browser.newPage();
    await page.goto(url);
    const imgs = await page.$$eval('img[src]', imgs => imgs.map(img => img.getAttribute('src') || img.getAttribute('srcset') || img.getAttribute('data-src') || img.getAttribute('data-srcset')));

    imgs.forEach(async function(imageUrl){
        if(imageUrl.indexOf("nhs-dynamic") > 0){
            images.push(imageUrl);
        }
    })

    let jsonImages = await JSON.stringify(images);


    fs.writeFileSync(getFileName(url), jsonImages, function(){
        if(err){
            console.log(err);
        }
    })
}

lineReader.eachLine('urls', function(url) {
    fetchImages(url);
});

function getFileName(url){
    let path = url.replace('https://www.', '').replace(/[/\\?%*:|"<>]/g, '-');
    path = path.split(".").join("-");
    return `imageURLs/${path}.json`;
}
