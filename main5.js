const puppeteer = require('puppeteer');
// const fs = require('fs/promises');
const fs = require("fs");
const readline = require("readline");
const console = require('console');
const stream = fs.createReadStream("sentences.txt");
const rl = readline.createInterface({ input: stream });
let data = [];
 
rl.on("line", (row) => {
    data.push(row);
});
 
rl.on("close", () => {
    //  console.log(data);
    (async () => {
        let sentiment = []
        console.log(data.length);
        for(let i=0;i<data.length;i++){
        console.log(i);
        let singlesentiment = []
        const browser = await puppeteer.launch({headless:true,args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto('https://sindhinlp.com/sentiment.php',{waitUntil: 'networkidle2'},);
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
        singlesentiment.push(p[0])
        singlesentiment.push(n[0])
        sentiment.push(singlesentiment)  
        await browser.close();
        }
        const file = fs.createWriteStream('array.txt');
        file.on('error', (err) => {
        /* error handling */
        });
        sentiment.forEach((v) => {
        file.write(v.join(', ') + '\n');
        });
        file.end();
    })();
})

  