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



exports.topicWiseQuestionCreator = async function(gPage,singleTopic,selectedTopic,userSelectedLevelOptions){
    var singleTopicPdf = singleTopic.trim();
    var singleTopic = "'"+singleTopic+"'";
    console.log(singleTopicPdf);
    console.log(singleTopic);

    var globalLevel=[];
                    if(userSelectedLevelOptions=="eachTime"){
                            await decideLevel();
                            async function decideLevel(){
                                let ans = await  inquirer.prompt([
                                                                        
                                    {
                                        type:"checkbox",
                                        name:"cbType",
                                        message:chalk.bold(`${chalk.red(singleTopicPdf)} -  You Can Also Select ${chalk.red("Multiple")}'LEVEL'`),
                                        choices:["Easy","Medium","Hard"],
                                    }

                                ]);
                                globalLevel= ans.cbType;
                                if(globalLevel.length==0){
                                    console.log(chalk.yellow(`Oops! Selected Nothing`))
                                    await  decideLevel();
                                } 
                            } 
                    }else if(userSelectedLevelOptions=="Hard"){
                        globalLevel[0]="Hard";
                    }else if(userSelectedLevelOptions=="Easy"){
                        globalLevel[0]="Easy";
                    }else if(userSelectedLevelOptions=="Medium"){
                        globalLevel[0]="Medium";
                    }else if(userSelectedLevelOptions=="Without"){
                        globalLevel[0]="WithoutLevel";
                    }
        console.log(globalLevel);
}