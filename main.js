const fs = require('fs');
const crawler = require('./crawler');

let links = [];



function getURLsFromEntryPoints() {
    let entryPoints = crawler.getEntrypoints();

    crawler.crawl(entryPoints, "entryPointLinks");
}



function crawlURLsFromEntryPoints() {
    //Get all file names from the href/ folder
    let files = fs.readdirSync("entryPointLinks");

    //Read the list from each file and concatenate it
    files.forEach(file => {
        links = links.concat(JSON.parse(fs.readFileSync(`entryPointLinks/${file}`, "utf-8")));
    })

    console.log("Unfiltered set: ", links.length);


    //remove duplicates from the list 
    let filteredLinks = [...new Set(links)];
    
    console.log("filtered set: ", filteredLinks.length);

    crawler.crawl(filteredLinks, "urlsToCrawl");
}


//Step 1 - create the files to crawl from the entry points
getURLsFromEntryPoints();

//Step 2 - crawl those files, and generate more files, which we will use to gather images from
// crawlURLsFromEntryPoints();
