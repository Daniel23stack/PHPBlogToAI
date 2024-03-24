

const scraperObject ={

    async linkScraper(globals,browser){  
        let page = await browser.newPage();
        await page.goto(globals.url)
        console.log(`Navigating to ${globals.url}...`);

    let allPages = [];        
        console.log('Globals Link Scrapper', globals);
        let pagePromise = (link) => new Promise(async(resolve, reject) => {
                let linkClass = globals['linkClass'];
                let newPage = await browser.newPage();
                await newPage.goto(link);
                await newPage.waitForSelector(linkClass);
                let pageUrls = await newPage.evaluate( (linkClass) => {
                    console.log('pageUrls LinkClass', linkClass);
                    const urlArray = Array.from(document.querySelectorAll(linkClass)).map((link) => link.href);
                    const uniqueUrlArray = [...new Set(urlArray)];
                    return uniqueUrlArray;
                  },linkClass);
                resolve(pageUrls);
                await newPage.close();
        });

        for(let i = 0; i <= globals['phpNavAmount']; i = i + globals['phpNavIncrement']){
            let t = globals['url'] + globals['phpNavigator'] + i;
            let currentPageUrls = await pagePromise(t);
            await allPages.push.apply(allPages,currentPageUrls);
            sleep(5000);
        }

        return allPages;
    
        
    },
    async pageScraper(globals,browser,pageUrl){
      let id = "#" + globals.idContainingContent;
      let page = []
      let pagePromise = (link) => new Promise(async(resolve,reject) =>{
        let newPage = await browser.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector(id);
        let content = await newPage.evaluate((idget)=>{
          let ps = document.getElementById(idget);
          let con = ps.getElementsByTagName("p");
          let storyText = "";

          for(let p = 0; p < con.length; p++){
            storyText += con[p].textContent + "\n";
          }

          return storyText;
        }, globals.idContainingContent)
        resolve(content);
        await newPage.close();
      });
      let s = await pagePromise(pageUrl);
      page.push(s);
      return page;
    },
    async pageChapterScraper(globals,browser,pageUrls){
      console.log('Page Urls:',pageUrls);
      let id = "#" + globals.idContainingContent;
      let storys = [];
      let chapterPromise = (link) => new Promise(async(resolve,reject) =>{
        let newPage = await browser.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector(id);
        let content = await newPage.evaluate((idget)=>{
          let ps = document.getElementById(idget);
          let con = ps.getElementsByTagName("p");
          let storyText = "";

          for(let p = 0; p < con.length; p++){
            storyText += con[p].textContent + "\n";
          }

          return storyText;
        },globals.idContainingContent)
        resolve(content);
        await newPage.close();
      });

      let storyPromise = (link) => new Promise(async(resolve,reject)=>{
        let story =[];
        let newPage =await browser.newPage();
        let id = "#" + globals.idContainingContent;
        await newPage.goto(link);
        await newPage.waitForSelector(id);
        let chaptersExist = await newPage.evaluate((chapter)=>{
          if(document.querySelector(chapter)){
            return true;
          }else{
            return false;
          }
        }, globals.chapterSelector)
        
      if(chaptersExist){
        let chapterNumber = await newPage.evaluate((chapter)=>{
          let s = document.querySelector(chapter);
          let o = s?.options.length;
          return o;
        },globals.chapterSelector)

        for(let i = 1; i <=chapterNumber; i++){
          let newLink = link + globals.chapterOffset + i;
          let chapter = await chapterPromise(newLink);
          await story.push(chapter);
          sleep(5000);
        }
      }else{
          let content = await newPage.evaluate((idget)=>{
            let ps = document.getElementById(idget);
            let con = ps.getElementsByTagName("p");
            let storyText = "";

            for(let p = 0; p < con.length; p++){
              storyText += con[p].textContent + "\n";
            }

            return storyText;
          },globals.idContainingContent);
          await story.push(content);
          sleep(5000);
      }
        resolve(story);
        await newPage.close();
      })
    
      for (let k = 0; k <pageUrls.length; k++){
         let sp = await storyPromise(pageUrls[k]);
         await storys.push(sp);
      }
    return storys;
    }
    
}

async function sleep(ms){
  return new Promise((resolve)=>{
    setTimeout(resolve,ms);
  })
}

module.exports = scraperObject;