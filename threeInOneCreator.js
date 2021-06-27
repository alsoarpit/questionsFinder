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
                    await  setTimeout(() =>{  
                        document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${selectedTopic[i]}]`).click();
                    },1000)
            
                },singleTopic);
                var globalLevel ;
                if(userSelectedLevelOptions=="Without"){}
                else if(userSelectedLevelOptions=="Hard"){globalLevel="Hard"}
                else if(userSelectedLevelOptions=="Easy"){globalLevel="Easy"}
                else if(userSelectedLevelOptions=="Medium"){globalLevel="Medium"}
                else if(userSelectedLevelOptions=="Random"){
                    await globalLevelSelector();
                    async function globalLevelSelector(){
                        let ans = await inquirer.prompt([
                            {
                                
                            }
                        ])
                    }
                }


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
                        setTimeout(() =>{
                            document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${selectedTopic[i]}]`).click();
                        },3000)
                    }
                },1000);

            
            },selectedTopic);
    }
    
}