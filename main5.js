const puppeteer = require('puppeteer');
// const fs = require('fs/promises');
const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream("sentences.txt");
const rl = readline.createInterface({ input: stream });
let data = [];
 
rl.on("line", (row) => {
    data.push(row);
});
 
rl.on("close", () => {
    console.log(data);
});

  (async () => {
    let sentiment = []
    for(let i=0;i<3;i++){
    let singlesentiment = []
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto('https://sindhinlp.com/sentiment.php',{waitUntil: 'networkidle2'});
    await page.type(".mytextarea",data[i]);
    await page.click("#submit")
    await page.waitForSelector('b')
    // console.log(page.url())
    // await page.on('requestfinished',()=>{
        let p = await page.$$eval(".text-warning",
        elements=> elements.map(item=>item.textContent))
        let n = await page.$$eval(".text-success",
        elements=> elements.map(item=>item.textContent))
        // })
    // console.log(p)
    // console.log(n)
    singlesentiment.push(p[0])
    singlesentiment.push(n[0])
    sentiment.push(singlesentiment)  
    await browser.close();
    }
    console.log(sentiment)
})();