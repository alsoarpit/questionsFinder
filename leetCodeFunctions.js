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
const {threeInOneCreator} = require('./threeInOneCreator');
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

async function top100LikedQuestions(){
    var browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo : 100,
    });
    let pagesArr = await browser.pages();
    var gPage=pagesArr[0];
    await gPage.goto("https://leetcode.com/problemset/all/?listId=79h8rn6");
    await gPage.click('#headlessui-listbox-button-13');
    await gPage.waitForTimeout(1000);
    await gPage.evaluate(()=>{
        let a = document.querySelectorAll('[class="text-label-1 dark:text-dark-label-1 cursor-default select-none relative h-8 py-1.5 pl-2 pr-9"]');        
        a[1].click();
    })
    await gPage.waitForTimeout(5000);
    let ansObj = await gPage.evaluate(()=>{

        let aTag = document.querySelectorAll('.ant-table-tbody .flex.items-center .overflow-hidden a');
        let questionArr = [];
        let linkArr = []
        for(let i=0;i<aTag.length;i++){
            questionArr[i] = aTag[i].innerText;
            linkArr[i] = aTag[i].getAttribute("href");
        }
        return {linkArr,questionArr}
    });
    console.log(ansObj);
    
}
top100LikedQuestions();