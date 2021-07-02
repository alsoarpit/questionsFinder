//Requires..
const fs = require('fs');
const CFonts = require('cfonts');
const center = require('center-align');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const PDFDocument = require('pdfkit');
const doc = require('pdfkit');
const { list, formText } = require('pdfkit');
var fuzzy = require('fuzzy');
const ora = require('ora');
const spinner = ora();


inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

 exports.topicWiseQuestion =(async ()=>{
    try{
    var browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo : 120,
    });
    let pagesArr = await browser.pages();
    var gPage=pagesArr[0];
    spinner.spinner = "arc"
	spinner.color = 'yellow';
    spinner.text = 'Loading... GFG Topics';
    spinner.start();
    await gPage.goto("https://practice.geeksforgeeks.org/explore/?page=1");
    await gPage.waitForSelector("[id='moreCompanies']");
    await gPage.click("[id='moreCompanies']");
            var topicArr = await gPage.evaluate(async() => {
                await document.querySelector('[href="#collapse4"] .panel-title').click();
                await new Promise(function(resolve) {setTimeout(resolve, 500)});
                let topic = await document.querySelectorAll('.checkbox.row.display-flex.company-modal input');
                let topicArr = [];
                for(i=0;i<topic.length;i++){
                    topicArr[i] = topic[i].getAttribute('value');

                }
                return topicArr;
            });
            var  selectedTopic;
            spinner.stop().clear();
            await userSelectedTopic();
                    async function userSelectedTopic(){
                    let ans =  await inquirer.prompt([
                            {
                                type: 'checkbox-plus',
                                name: 'cbType',
                                message: chalk.bold(`${chalk.bold.red('Select  Any Topic')} - You Can Also Select ${chalk.red.bold('Multiple')} Topic`),
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
                    selectedTopic =ans.cbType;  
                    if((ans.cbType).length==0) {

                        let ans = await inquirer.prompt([
                            {
                                type:"list",
                                name:"lType",
                                message:chalk.bold(`${chalk.yellow('OOPS!! Selected Nothing')} Select Any ${chalk.bold.red('ONE')}`),
                                choices:["Select Company Again","Exit"],
                            }
                        ]);

                        if(ans.lType=="Exit"){process.exit(0);}
                        else if(ans.lType=="Select Company Again"){ await userSelectedTopic();}
                    }
                }
                
                var  selectedTopicOptions;
                await allTopicORSingleWise();
                    async function allTopicORSingleWise(){
                        
                       let ans = await inquirer.prompt([
                            {
                                type:"list",
                                name:"lType",
                                message:chalk.bold(`Select Any ${chalk.red('ONE')} For Selected Topics`),
                                choices:["Topic Question Pdf - Topic Separately","Topic Question Pdf - Topic Combine","Select Topic Again","Exit"],

                            }
                        ]);
                        
                         selectedTopicOptions = ans.lType;
                        if(selectedTopicOptions.length==0){
                            await allTopicORSingleWise();
                        }else if(selectedTopicOptions=="Select Topic Again"){
                             await userSelectedTopic();
                             await allTopicORSingleWise();
                        }else if(selectedTopicOptions=="Exit"){process.exit(0);}
       
                    }//loop_Over_allTopicORSingleWise


            if(selectedTopicOptions=="Topic Question Pdf - Topic Separately"){

                
               for(let i=0;i<selectedTopic.length;i++){
                    var singleTopic = selectedTopic[i];

                        var userSelectedLevelOptions; 
                        await levelOptions();
                        async function levelOptions(){
                            let ans = await inquirer.prompt([
                                
                                {
                                    type:"list",
                                    name:"lType",
                                    message:chalk.bold(`For ${chalk.yellow(singleTopic)} - Select Any ${chalk.red('ONE')}`),
                                    choices:[`Select Different Level For ${singleTopic}`,
                                        `Without Level (Random) For ${singleTopic}`,
                                        "Exit"],
                                }

                            ]);
                            if(ans.lType==`Without Level (Random) For ${singleTopic}`){
                                userSelectedLevelOptions ="Without";
                            }else if(ans.lType==`Select Different Level For ${singleTopic}`){
                                userSelectedLevelOptions="eachTime";
                            }
                        }

                        var globalLevel=[];

                            if(userSelectedLevelOptions=="eachTime"){
                                    await decideLevel();
                                    async function decideLevel(){
                                        let ans = await  inquirer.prompt([
                                                                                
                                            {
                                                type:"checkbox",
                                                name:"cbType",
                                                message:chalk.bold(`${chalk.red(singleTopic)} -  You Can Also Select ${chalk.red("Multiple")}'LEVEL'`),
                                                choices:["Easy","Medium","Hard"],
                                            }

                                        ]);
                                        globalLevel= ans.cbType;
                                        if(globalLevel.length==0){
                                            console.log(chalk.yellow(`Oops! Selected Nothing`))
                                            await  decideLevel();
                                        } 
                                    } 
                            }else if(userSelectedLevelOptions=="Without"){
                                globalLevel[0]="WithoutLevel";
                            }
                            
                        for(let i=0; i < globalLevel.length; i++){
                            var singleLevel = globalLevel[i];
                            spinner.text = `Creating Pdf For ${singleTopic} : ${singleLevel}`;
                            spinner.start();
                            await gPage.goto("https://practice.geeksforgeeks.org/explore/?page=1");

                            await gPage.waitForSelector("[id='moreCompanies']");
                                let clickSelectedTopics = "'"+singleTopic+"'";
                                await gPage.evaluate(async(clickSelectedTopics) => {                 

                                    await  setTimeout(async() =>{
                                            await document.querySelector('[href="#collapse4"] .panel-title').click();
                                        },1000);
    
                                    await  setTimeout(async() =>{  
                                        await document.querySelector('#moreCategories').click()
                                        },1000);
                                    
                                    await  setTimeout(async() =>{  
                                                await document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${clickSelectedTopics}]`).click();
                                    },1000);
    
                                    await setTimeout(async() =>{
                                        await document.querySelector('#selectCategoryModal .modal-body [class="close"]').click();
                                    },2000);
                            
                                },clickSelectedTopics);

                                await gPage.waitForTimeout(2000);

                                    if(globalLevel[i] =="Easy"){ 
                                        await gPage.evaluate( ()=>{
                                            setTimeout(() =>{
                                                document.querySelector('.panel-body[href="#collapse1"]').click();
                                            },1000);
                                            setTimeout(() =>{
                                                document.querySelector("[name='difficulty[]'][value='0']").click();
                                            },1000);
                                        });
                                    }else if(globalLevel[i] =="Medium"){

                                        await gPage.evaluate( ()=>{
                                            setTimeout(()=>{
                                                document.querySelector('.panel-body[href="#collapse1"]').click();
                                            },1000);
                                            setTimeout(()=>{
                                                document.querySelector("[name='difficulty[]'][value='1']").click();
                                            },1000);
                                        });
                                    }else if(globalLevel[i] =="Hard"){
                                        await gPage.evaluate(  ()=>{
                                            setTimeout(()=>{
                                                document.querySelector('.panel-body[href="#collapse1"]').click();
                                            },1000);
                                            setTimeout(()=>{
                                                document.querySelector("[name='difficulty[]'][value='2']").click();
                                            },1000);
                                        });
                                    }else if(globalLevel[i]=="WithoutLevel"){
                                        await gPage.waitForTimeout(2000);
                                    }  
                                
                                    await gPage.waitForTimeout(3000);

                                    await scrollToBottom();  
                                    let questionLinkObj = await gPage.evaluate(()=>{
                            
                                        let allCpyQues = document.querySelectorAll(
                                                ".panel.problem-block div>span"
                                        );
                                        let allCpyQuesLink = document.querySelectorAll('a[style="position: absolute;top: 0;left: 0;height: 100%;width: 100%;z-index:1;pointer:cursor;"]');
                                        let allCompanyQuestionArr=[];
                                        let allCompanyQuestionLinkArr=[];
                                        // cant Do Direct Because its not ARR its Type of Arr :-
            
                                        for(let i=0;i<allCpyQues.length;i++){
                                            allCompanyQuestionArr[i] = allCpyQues[i].innerHTML;
                                            allCompanyQuestionLinkArr[i] = allCpyQuesLink[i].getAttribute('href');
                                        }
                                        
                                        return {allCompanyQuestionArr,allCompanyQuestionLinkArr}
                                        
                                    });
                                    let questionArr = questionLinkObj.allCompanyQuestionArr;
                                    let questionLinkArr = questionLinkObj.allCompanyQuestionLinkArr;

                                    if(questionArr.length!=0){
                                        await folderCheck(singleLevel,questionArr,singleTopic,questionLinkArr);
                                        spinner.succeed(chalk.bold.yellow(`Congratulations QuestionsPDF And Link For : ${singleTopic} : ${singleLevel} Level has been Created` ))
                                        
                                    }else{
                                        spinner.warn(chalk.bold.yellow(`GFG HAS ${chalk.red('NULL')} Questions For : ${singleTopic} :${singleLevel} : Questions`));
                                    }  

                        }

               }

        }else if(selectedTopicOptions=="Topic Question Pdf - Topic Combine"){

                var clickSelectedTopic = [];
                var singlePdfString ="";

                for(let i = 0; i < selectedTopic.length;i++){
                    singlePdfString += selectedTopic[i]+"_";
                    clickSelectedTopic[i] = "'"+selectedTopic[i]+"'";
                }
                var userSelectedLevelOptions;
                await levelOptions();
                async function levelOptions(){
                let ans = await inquirer.prompt([

                    {
                    type:"list",
                    name:"lType",
                    message:chalk.bold(`For ${chalk.yellow(singlePdfString)} - Select Any ${chalk.red('ONE')}`),
                    choices:[`Select Different Level For Selected Topic`,
                        `Without Level (Random) For Selected Topic`,
                        "Exit"],
                    }

                ]);

                    if(ans.lType==`Select Different Level For Selected Topic`){
                    userSelectedLevelOptions ="eachTime";
                    }
                    else if(ans.lType==`Without Level (Random) For Selected Topic`){
                    userSelectedLevelOptions="Without";
                    }else if(ans.lType=="Exit"){process.exit(0);}

                }
                var globalLevel=[];
                
                if(userSelectedLevelOptions=="eachTime"){
                    await decideLevel();
                    async function decideLevel(){
                        let ans = await  inquirer.prompt([
                                                                
                            {
                                type:"checkbox",
                                name:"cbType",
                                message:chalk.bold(`${chalk.red(singlePdfString)} -  You Can Also Select ${chalk.red("Multiple")}'LEVEL'`),
                                choices:["Easy","Medium","Hard"],
                            }

                        ]);
                        globalLevel= ans.cbType;
                        if(globalLevel.length==0){
                            console.log(chalk.yellow(`Oops! Selected Nothing`))
                            await  decideLevel();
                        }
                    } 
            }else if(userSelectedLevelOptions=="Without"){
                globalLevel[0]="WithoutLevel";
            }


            for(let i=0;i<globalLevel.length; i++){

                let singleLevel = globalLevel[i];
                spinner.spinner = "arc"
                spinner.color = 'yellow';
                spinner.text = `Creating... Combine Pdf : ${singlePdfString}`;
                spinner.start();
                await gPage.goto("https://practice.geeksforgeeks.org/explore/?page=1");

                    await gPage.evaluate((clickSelectedTopic) => {                 
                                        
                            setTimeout(() =>{
                                document.querySelector('[href="#collapse4"] .panel-title').click();
                        },1000);
                            setTimeout(() =>{
                                document.querySelector('#moreCategories').click();
                        },1000);
                            setTimeout(() =>{
                            for(let i = 0; i <clickSelectedTopic.length; i++){
                                setTimeout(() =>{
                                        document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${clickSelectedTopic[i]}]`).click();
                                },1000)
                            }
                        },2000);
                        
                        setTimeout(() =>{
                                document.querySelector('#selectCategoryModal .modal-body [class="close"]').click();
                        },2000);
                        
                    },clickSelectedTopic);

                    await gPage.waitForTimeout(3000);

                        if(globalLevel[i] =="Easy"){
                            await gPage.evaluate( ()=>{
                                setTimeout(() =>{
                                    document.querySelector('.panel-body[href="#collapse1"]').click();
                                },1000);
                                setTimeout(() =>{
                                    document.querySelector("[name='difficulty[]'][value='0']").click();
                                },1000);
                            });
                        }else if(globalLevel[i] =="Medium"){

                            await gPage.evaluate( ()=>{
                                setTimeout(()=>{
                                    document.querySelector('.panel-body[href="#collapse1"]').click();
                                },1000);
                                setTimeout(()=>{
                                    document.querySelector("[name='difficulty[]'][value='1']").click();
                                },1000);
                            });
                        }else if(globalLevel[i] =="Hard"){
                            await gPage.evaluate(  ()=>{
                                setTimeout(()=>{
                                    document.querySelector('.panel-body[href="#collapse1"]').click();
                                },1000);
                                setTimeout(()=>{
                                    document.querySelector("[name='difficulty[]'][value='2']").click();
                                },1000);
                            });
                        }
                        else if(globalLevel[i]=="WithoutLevel"){
                            await gPage.waitForTimeout(1000);
                        }  

                        await scrollToBottom();
                        await gPage.waitForTimeout(2000);
                         
                        let questionLinkObj = await gPage.evaluate(()=>{
                            
                            let allCpyQues = document.querySelectorAll(
                                    ".panel.problem-block div>span"
                            );
                            let allCpyQuesLink = document.querySelectorAll('a[style="position: absolute;top: 0;left: 0;height: 100%;width: 100%;z-index:1;pointer:cursor;"]');
                            let allCompanyQuestionArr=[];
                            let allCompanyQuestionLinkArr=[];
                            // cant Do Direct Because its not ARR its Type of Arr :-

                            for(let i=0;i<allCpyQues.length;i++){
                                allCompanyQuestionArr[i] = allCpyQues[i].innerHTML;
                                allCompanyQuestionLinkArr[i] = allCpyQuesLink[i].getAttribute('href');
                            }
                            
                            return {allCompanyQuestionArr,allCompanyQuestionLinkArr}
                            
                        });
                        let questionArr = questionLinkObj.allCompanyQuestionArr;
                        let questionLinkArr = questionLinkObj.allCompanyQuestionLinkArr;

                        if(questionArr.length!=0){
                            await folderCheck(singleLevel,questionArr,singlePdfString,questionLinkArr);
                            spinner.succeed(chalk.bold.yellow(`Congratulations QuestionsPDF And Link For : Combine : ${singleLevel} Level has been Created` ))
   
                        }else{
                            spinner.warn(chalk.bold.yellow(`GFG HAS ${chalk.red('NULL')} Questions For : Combine :${singleLevel} : Questions`));
      
                        }  

            }
        }

        console.log(center((chalk.bgRedBright.bold.black("\n Thank You For Using questionsFinder ")),122));

    function folderCheck(singleLevel,questionArr,singleTopic,questionLinkArr){
        let folderPath = "./questionsFinder_Downloads/topicWise/"+singleTopic+"_Questions"
        if (fs.existsSync(folderPath)) {
            pdfCreate(folderPath,singleLevel,questionArr,singleTopic,questionLinkArr);
        }else {
            fs.mkdirSync(folderPath,{ recursive: true });
            pdfCreate(folderPath,singleLevel,questionArr,singleTopic,questionLinkArr);
        }
    };

    //------------------------pdfCreate------------------------//
    function pdfCreate(folderPath,singleLevel,questionArr,singleTopic,questionLinkArr){
        const doc = new PDFDocument;

        doc.pipe(fs.createWriteStream(folderPath+"/"+singleTopic+"_"+singleLevel+"_Questions"+'.pdf'))
            
            doc.font('./fonts/CascadiaCode-Bold.otf')
                .fontSize(22)
                .text(`Questions : ${singleTopic} : ${singleLevel} : GFG`)
            doc.moveDown();
            doc.font('./fonts/CascadiaCode.ttf')
                .fontSize(18)
                for(let i = 0; i <questionArr.length;i++){
                
                    doc.text(`${Number(i)+1}. ${questionArr[i]}`,{
                        link:questionLinkArr[i],
                    })
                    .moveDown(1.1);
                }
        doc.end()
    }

    //--------------------------------scrollDown--------------------------------//
    async function scrollToBottom() {
        const distance = 60;
        while (await gPage.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
        await gPage.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
        await gPage.waitForTimeout(500);
        }
    }

    }catch(e) {
        spinner.fail(chalk.bold.yellow("Please Check Your Internet Connection Or 'RESTART' - questionsFinder"))
    }
        
});