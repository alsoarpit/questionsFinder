//Requires..
const fs = require('fs');
const CFonts = require('cfonts');
const center = require('center-align');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const PDFDocument = require('pdfkit');
const doc = require('pdfkit');
const { list } = require('pdfkit');
var fuzzy = require('fuzzy');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

// exports.topicWiseQuestion =
 (async ()=>{

    var browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo : 30,
    });
    let pagesArr = await browser.pages();
    var gPage=pagesArr[0];
    await gPage.goto("https://practice.geeksforgeeks.org/explore/?page=1");
    await gPage.waitForSelector("[id='moreCompanies']");
    await gPage.click("[id='moreCompanies']");
    //await gPage.waitForSelector(".well.table.whiteBgColor .text-center a b");
})();