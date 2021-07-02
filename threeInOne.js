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
const ora = require('ora');
const spinner = ora();
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

 exports.threeInOne = async function main(){
     try{
        spinner.spinner = "arc"
        spinner.color = 'yellow';
        spinner.text = 'Loading... GFG Company Names';
        spinner.start();
        var browser = await puppeteer.launch({
            headless:false,
            defaultViewport: null,
            args: ["--start-maximized"],
            slowMo : 120,
        });
        let pagesArr = await browser.pages();
        var gPage=pagesArr[0];
        await gPage.goto("https://practice.geeksforgeeks.org/company-tags/");
        await gPage.waitForSelector(".well.table.whiteBgColor .text-center a b");
        var allCompanyNameArr = await gPage.evaluate(()=>{

            let allCompanyName = document.querySelectorAll(
            ".well.table.whiteBgColor .text-center a b"
            );
            let allCompanyNameArr =[];
            for(let i=0;i<allCompanyName.length;i++){
                allCompanyNameArr[i] = allCompanyName[i].innerText;
            }
            return allCompanyNameArr;
        });
        spinner.stop().clear();
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
                                spinner.text =`Loading... GFG ${singleCompany} : Topics `;
                                spinner.start();
                                await gPage.goto("https://practice.geeksforgeeks.org/company/"+singleCompany+"/");
                        
                                var topicArr = await gPage.evaluate(async() => {
                     
                                        await document.querySelector('[href="#collapse4"] .panel-title').click();
                                        await document.querySelector('#moreCategories').click()
                                        await new Promise(function(resolve) {setTimeout(resolve, 500)});
                    
                                        let topic = await document.querySelectorAll('.checkbox.row.display-flex.company-modal input');
                                        
                                        let topicArr = [];
                                        for(i=0;i<topic.length;i++){
                                            topicArr[i] = topic[i].getAttribute('value');
                        
                                        }
                                        return topicArr;
                                });
                                
                                spinner.stop().clear();
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
                 
                                var  selectedTopicOptions;
                                await allTopicORSingleWise();
                                    async function allTopicORSingleWise(){
                                        
                                       let ans = await inquirer.prompt([
                                            {
                                                type:"list",
                                                name:"lType",
                                                message:chalk.bold(`For ${chalk.yellow(singleCompany)} - Select Any ${chalk.red('ONE')}`),
                                                choices:["Company Topic Question Pdf - Topic Separately","Company Topic Question Pdf - Topic Combine","Select Topic Again","Exit"],

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
                                                    var userSelectedLevelOptions; 
                                                     await levelOptions();
                                                     async function levelOptions(){
                                                        let ans = await inquirer.prompt([
                                                            
                                                            {
                                                                type:"list",
                                                                name:"lType",
                                                                message:chalk.bold(`For ${chalk.yellow(singleCompany)} - Select Any ${chalk.red('ONE')}`),
                                                                choices:[`Select Different Level For each Topic For ${singleCompany}`,
                                                                    `Without Level (Random) For ${singleCompany}`,
                                                                    `Easy Level For All Topics For ${singleCompany}`,
                                                                    `Medium Level For All Topics For ${singleCompany}`,
                                                                    `Hard Level For All Topics For ${singleCompany}`,
                                                                    "Exit"],
                                                            }

                                                        ]);
                                                        if(ans.lType==`Hard Level For All Topics For ${singleCompany}`){
                                                             userSelectedLevelOptions = "Hard";
                                                         }
                                                        else if(ans.lType==`Easy Level For All Topics For ${singleCompany}`){
                                                            userSelectedLevelOptions ="Easy";
                                                        }
                                                        else if(ans.lType==`Medium Level For All Topics For ${singleCompany}`){
                                                            userSelectedLevelOptions ="Medium";
                                                        }else if(ans.lType==`Without Level (Random) For ${singleCompany}`){
                                                            userSelectedLevelOptions ="Without";
                                                        }else if(ans.lType==`Select Different Level For each Topic For ${singleCompany}`){
                                                            userSelectedLevelOptions="eachTime";
                                                        }
                                            
                                                     }
                                                    ///working here
                                                     
                                                     await threeInOneCreator(gPage,singleCompany,selectedTopic,userSelectedLevelOptions,selectedTopicOptions);
                                                    //
                                                    

                                }else if(selectedTopicOptions=="Company Topic Question Pdf - Topic Combine"){
                                        
                                    var userSelectedLevelOptions; 
                                    await levelOptions();
                                    async function levelOptions(){
                                       let ans = await inquirer.prompt([
                                           
                                           {
                                               type:"list",
                                               name:"lType",
                                               message:chalk.bold(`For ${chalk.yellow(singleCompany)} - Select Any ${chalk.red('ONE')}`),
                                               choices:[`Select Different Level For Topic For ${singleCompany}`,
                                                   `Without Level (Random) For ${singleCompany}`,
                                                   "Exit"],
                                           }

                                       ]);

                                        if(ans.lType==`Without Level (Random) For ${singleCompany}`){
                                            userSelectedLevelOptions ="Without";
                                        }
                                        else if(ans.lType==`Select Different Level For Topic For ${singleCompany}`){
                                            userSelectedLevelOptions="eachTime";
                                        }
                           
                                    }
                                   ///working here
                                    
                                    await threeInOneCreator(gPage,singleCompany,selectedTopic,userSelectedLevelOptions,selectedTopicOptions);
                                   //

                                }

                            }
                            console.log(center((chalk.bgRedBright.bold.black("\n Thank You For Using questionsFinder ")),122));
                        }
                    }
                })
                
            }
        }catch(e) {
            spinner.fail(chalk.bold.yellow("Please Check Your Internet Connection Or 'RESTART' - questionsFinder"))
        }
}