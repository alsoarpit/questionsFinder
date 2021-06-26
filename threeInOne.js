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

// exports.threeInOne = 
main();
async function main(){

        var browser = await puppeteer.launch({
            headless:false,
            defaultViewport: null,
            args: ["--start-maximized"],
            slowMo : 50,
        });
        let pagesArr = await browser.pages();
        var gPage=pagesArr[0];
        await gPage.goto("https://practice.geeksforgeeks.org/company-tags/");
        await gPage.waitForSelector(".well.table.whiteBgColor .text-center a b");
        var allCompanyNameArr = await gPage.evaluate((companyCount)=>{

            let allCompanyName = document.querySelectorAll(
            ".well.table.whiteBgColor .text-center a b"
            );
            let allCompanyNameArr =[];
            for(let i=0;i<allCompanyName.length;i++){
                allCompanyNameArr[i] = allCompanyName[i].innerText;
            }
            return allCompanyNameArr;
        });

        await userSelectedCompanyName();
             function userSelectedCompanyName(){
                     inquirer.prompt([
                    {
                        type: 'checkbox-plus',
                        name: 'cbType',
                        message: chalk.bold(`${chalk.bold.red('Select  Any Company')} - You Can Also Select ${chalk.red.bold('Multiple')} Company`),
                        pageSize: 10,
                        highlight: true,
                        searchable: true,    
                        source: function(answersSoFar, input) {
                        input = input || '';
                            return new Promise(function(resolve) {              
                                var fuzzyResult = fuzzy.filter(input, allCompanyNameArr);       
                                var data = fuzzyResult.map(function(element) {
                                return element.original;
                                });            
                                resolve(data);           
                            });  
                        }
                    }
                ]).then( (answers)=>{
                    var selectedCompanyArr = answers.cbType;
                    if(selectedCompanyArr.length==0){
                         inquirer.prompt([
                            {
                                type:"list",
                                name:"lType",
                                message:chalk.bold(`${chalk.yellow('OOPS!! Selected Nothing')} Select Any ${chalk.bold.red('ONE')}`),
                                choices:["Select Company Again","Exit"],
                            }
                        ]).then((answers)=>{
                            let userSelectedAnswer = answers.lType;
                            if(userSelectedAnswer=="Select Company Again"){ userSelectedCompanyName();}
                            else if(userSelectedAnswer=="Exit"){process.exit(0);}
                        });
                    }else{

                        
                        userSelectedTopic();
                        async function userSelectedTopic(){
                            for(let i=0;i<selectedCompanyArr.length;i++){

                                var singleCompany = selectedCompanyArr[i];

                                await gPage.goto("https://practice.geeksforgeeks.org/company/"+singleCompany+"/");
                        
                                var topicArr = await gPage.evaluate(async() => {
                     
                                        await document.querySelector('[href="#collapse4"] .panel-title').click();
                                        await document.querySelector('#moreCategories').click()
                                        await new Promise(function(resolve) {setTimeout(resolve, 500)});
                                        let topic = await document.querySelectorAll('.checkbox.row.display-flex.company-modal label');
                                        let topicArr = [];
                                        for(i=0;i<topic.length;i++){
                                            topicArr[i] = topic[i].innerText.trim();
                                        }
                                        return topicArr;
                                });

                                var  selectedTopic;
                                await userSelectedTopic();
                                        async function userSelectedTopic(){
                                        let ans =  await inquirer.prompt([
                                                {
                                                    type: 'checkbox-plus',
                                                    name: 'cbType',
                                                    message: chalk.bold(`For ${chalk.yellow(singleCompany)} - ${chalk.bold.red('Select  Any Topic')} - You Can Also Select ${chalk.red.bold('Multiple')} Topic`),
                                                    pageSize: 10,
                                                    highlight: true,
                                                    searchable: true,    
                                                    source: function(answersSoFar, input) {
                                                    input = input || '';
                                                    return new Promise(function(resolve) {              
                                                        var fuzzyResult = fuzzy.filter(input, topicArr);       
                                                        var data = fuzzyResult.map(function(element) {
                                                        return element.original;
                                                        });            
                                                        resolve(data);           
                                                    });  
                                                }
                                            }
                                        ]);
                                        if((ans.cbType).length==0) {
                                            await inquirer.prompt([
                                                {
                                                    type:"list",
                                                    name:"lType",
                                                    message:chalk.bold(`${chalk.yellow('OOPS!! Selected Nothing')} Select Any ${chalk.bold.red('ONE')}`),
                                                    choices:["Select Company Again","Exit"],
                                                }
                                            ]).then( async (answers)=>{
                                                if(answers.lType == "Exit"){process.exit(0);}
                                                await userSelectedTopic();
                                            })
                                        }else if((ans.cbType).length>0){
                                            selectedTopic = ans.cbType;
                                        }
                                    }//function over
                                console.log(selectedTopic);
                                var  selectedTopicOptions;
                                await allTopicORSingleWise();
                                    async function allTopicORSingleWise(){
                                        
                                       let ans = await inquirer.prompt([
                                            {
                                                type:"list",
                                                name:"lType",
                                                message:chalk.bold(`For ${chalk.yellow(singleCompany)} - Select Any ${chalk.red('ONE')}`),
                                                choices:["Company Topic Question Pdf - Topic Separately","Company Topic Question Pdf - Topic Combine","Both Options 1 And 2","Select Topic Again","Exit"],

                                            }
                                        ]);
                                        
                                         selectedTopicOptions = ans.lType;
                                        if(selectedTopicOptions.length==0){
                                            await allTopicORSingleWise();
                                        }else if(selectedTopicOptions=="Select Topic Again"){
                                             await userSelectedTopic();
                                             await allTopicORSingleWise();
                                        }else if(selectedTopicOptions=="Exit"){process.exit(0);}
   
                                            
                                    }
                                    
                                    
                                if(selectedTopicOptions=="Company Topic Question Pdf - Topic Separately"){
                                                     console.log(selectedTopicOptions);
                                                     console.log(selectedTopic);
                                }else if(selectedTopicOptions=="Company Topic Question Pdf - Topic Combine"){
                                        console.log(selectedTopicOptions);
                                        console.log(selectedTopic);
                                }else if(selectedTopicOptions=="Both Options 1 And 2"){
                                    console.log(selectedTopicOptions);
                                    console.log(selectedTopic);
                                }

                            }
                        }
                    }
                })
            }

}