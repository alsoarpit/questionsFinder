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

exports.threeInOneCreator = async function (gPage,singleCompany,notPerfectSelectedTopic,userSelectedLevelOptions,selectedTopicOptions){
        
    let  selectedTopic = []; // ' selectedTopic ' this upper notation is added because 
    //it was creating error while  selecting topicName - because its having space
    for(let i = 0; i <notPerfectSelectedTopic.length; i++){
        selectedTopic[i] ='"'+notPerfectSelectedTopic[i]+'"';
    }
  
    if(selectedTopicOptions=="Company Topic Question Pdf - Topic Separately"){
        for(let i = 0; i <selectedTopic.length; i++){
                var singleTopic = selectedTopic[i];
                await gPage.goto("https://practice.geeksforgeeks.org/company/"+singleCompany+"/");
                await gPage.evaluate(async(singleTopic) => {                 

                    await  setTimeout(async() =>{
                            await document.querySelector('[href="#collapse4"] .panel-title').click();
                        },1000)
                    await  setTimeout(async() =>{  
                        await document.querySelector('#moreCategories').click()
                        },1000)
                    
                    await  setTimeout(async() =>{  
                                await document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${singleTopic}]`).click();

                    },1000)

                    await setTimeout(async() =>{
                        await document.querySelector('#selectCategoryModal .modal-body [class="close"]').click();
                    },2000)
            
                },singleTopic);

                var globalLevel=[];
                console.log(userSelectedLevelOptions);
                if(userSelectedLevelOptions=="eachTime"){
                        await decideLevel();
                        async function decideLevel(){
                            let ans = await  inquirer.prompt([
                                {
                                    type:"checkbox",
                                    name:"cbType",
                                    message:chalk.bold(`For ${chalk.red(singleCompany)} -  You Can Also Select ${chalk.red("Multiple")}'LEVEL'`),
                                    choices:["Easy","Medium","Hard"],
                                }
                            ]);
                            globalLevel= ans.cbType;
                            if(globalLevel.length==0){
                                console.log(chalk.yellow(`Oops! Selected Nothing`))
                                await  decideLevel();
                            } 
                        } 
                }
                else if(userSelectedLevelOptions=="Hard"){
                    globalLevel[0]="Hard"

                }
                else if(userSelectedLevelOptions=="Easy"){
                    globalLevel[0]="Easy"
                }
                else if(userSelectedLevelOptions=="Medium"){
                    globalLevel[0]="Medium"
                }
                else if(userSelectedLevelOptions=="Without"){
                    globalLevel[0]="Without"
                }

                console.log(globalLevel);
                

        }

    }else if(selectedTopicOptions=="Company Topic Question Pdf - Topic Combine"){
        await gPage.goto("https://practice.geeksforgeeks.org/company/"+singleCompany+"/");
        await gPage.evaluate(async(selectedTopic) => {                 
            
                await setTimeout(async() =>{
                    await document.querySelector('[href="#collapse4"] .panel-title').click();
                },1000);
                await setTimeout(async() =>{
                    await document.querySelector('#moreCategories').click();
                },1000);
                await setTimeout(async() =>{
                    for(let i = 0; i <selectedTopic.length; i++){
                        setTimeout(async() =>{
                            await document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${selectedTopic[i]}]`).click();
                        },1000)
                    }
                },1000);

                await setTimeout(async() =>{
                    await document.querySelector('#selectCategoryModal .modal-body [class="close"]').click();
                },2000);

            
            },selectedTopic);
            var globalLevel=[];
                console.log(userSelectedLevelOptions);
                if(userSelectedLevelOptions=="eachTime"){
                        await decideLevel();
                        async function decideLevel(){
                            let ans = await  inquirer.prompt([
                                {
                                    type:"checkbox",
                                    name:"cbType",
                                    message:chalk.bold(`For ${chalk.red(singleCompany)} -  You Can Also Select ${chalk.red("Multiple")}'LEVEL'`),
                                    choices:["Easy","Medium","Hard"],
                                }
                            ]);
                            globalLevel= ans.cbType;
                            if(globalLevel.length==0){
                                console.log(chalk.yellow(`Oops! Selected Nothing`))
                                await  decideLevel();
                            } 
                        } 
                }
                else if(userSelectedLevelOptions=="Hard"){
                    globalLevel[0]="Hard"

                }
                else if(userSelectedLevelOptions=="Easy"){
                    globalLevel[0]="Easy"
                }
                else if(userSelectedLevelOptions=="Medium"){
                    globalLevel[0]="Medium"
                }
                else if(userSelectedLevelOptions=="Without"){
                    globalLevel[0]="Without"
                }

                console.log(globalLevel);
                
    }
    
}