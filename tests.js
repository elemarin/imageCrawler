const fs = require('fs');
let links = [];

let files = fs.readdirSync("hrefs");

files.forEach( file => {
    links = links.concat(JSON.parse(fs.readFileSync(`hrefs/${file}`, "utf-8")));
})


console.log('Size:', links.length);