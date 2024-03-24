/**
 * PHP Blog to AI Scrapper.
 * Dan23Stack on github
 * This program is designed to take old php blogs and convert them into raw text files
 * or convert them into alpha format for use of training loras on ai.
 */

const globalParams = require('./globalsParams.json');
const pageScraper = require('./pageScraper');
const fs = require('fs');
async function scrapeAll(browserInstance){
	let browser;
	let scrapedData = {};
	let storys = {};
	try{
		browser = await browserInstance;

		scrapedData['Links'] = await pageScraper.linkScraper(globalParams,browser);
		storys['storys'] = await pageScraper.pageChapterScraper(globalParams,browser,scrapedData['Links']);
        
		await browser.close(); 

	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}finally{
		fs.writeFile("links.json", JSON.stringify(scrapedData), 'utf8', function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The data has been scraped and saved successfully! View it at './data.json'");
		});
		let text = await convertToText(storys['storys']);
		fs.writeFile("storysText.txt", text, 'utf8', function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The data has been scraped and saved successfully! View it at './storysText.json'");
		});

		let alpaca = await convertToAlpaca(globalParams,storys['storys']);
		fs.writeFile("alpaca.json", JSON.stringify(alpaca), 'utf8', function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The data has been scraped and saved successfully! View it at './alpaca.json'");
		});
	}
}

async function convertToText(data){
	let text = "";
	for (let i = 0; i < data.length; i++){
		let story = data[i];
		for(let k = 0; k < story.length; k++){
			text += story[k];
		}
	}
	return text;
}

async function convertToAlpaca(globals,data){
	let al = [];
	let ins = globals['ins'];
	
	for (let i=0; i < data.length; i++){
		let story = data[i];
		for(let k = 0; k < story.length; k++){
			let t = {"input": story[k], "instruction": ins, "output": ""};
			al.push(t);
		}
	}
	return al;
}

module.exports = (browserInstance) => scrapeAll(browserInstance)