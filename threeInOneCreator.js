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
       
    let  selectedTopic = [];
    let selectedTopicForPdf = [];
    // ' selectedTopic ' this upper notation is added because 
    //it was creating error while  selecting topicName - because its having space
    for(let i = 0; i <notPerfectSelectedTopic.length; i++){
        selectedTopic[i] ='"'+notPerfectSelectedTopic[i]+'"';
        selectedTopicForPdf[i] = notPerfectSelectedTopic[i].trim();
    }
  
    if(selectedTopicOptions=="Company Topic Question Pdf - Topic Separately"){
        for(let i = 0; i <selectedTopic.length; i++){

                var singleTopic = selectedTopic[i];

                var singleTopicPdf = selectedTopicForPdf[i];

                    var globalLevel=[];
                    if(userSelectedLevelOptions=="eachTime"){
                            await decideLevel();
                            async function decideLevel(){
                                let ans = await  inquirer.prompt([
                                                                        
                                    {
                                        type:"checkbox",
                                        name:"cbType",
                                        message:chalk.bold(`For ${chalk.red(singleCompany)} : ${chalk.red(singleTopicPdf)} -  You Can Also Select ${chalk.red("Multiple")}'LEVEL'`),
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


                    for(let j = 0; j <globalLevel.length;j++){
                            var singleLevel = globalLevel[j];
                            
                            await gPage.goto("https://practice.geeksforgeeks.org/company/"+singleCompany+"/");
                            await gPage.evaluate(async(singleTopic) => {                 

                                await  setTimeout(async() =>{
                                        await document.querySelector('[href="#collapse4"] .panel-title').click();
                                    },1000);

                                await  setTimeout(async() =>{  
                                    await document.querySelector('#moreCategories').click()
                                    },1000);
                                
                                await  setTimeout(async() =>{  
                                            await document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${singleTopic}]`).click();
                                },1000);

                                await setTimeout(async() =>{
                                    await document.querySelector('#selectCategoryModal .modal-body [class="close"]').click();
                                },2000);
                        
                            },singleTopic);

                            await gPage.waitForTimeout(2000);
                                if(globalLevel[j] =="Easy"){ 
                                    await gPage.evaluate( ()=>{
                                         setTimeout(() =>{
                                            document.querySelector('.panel-body[href="#collapse1"]').click();
                                        },1000);
                                         setTimeout(() =>{
                                            document.querySelector("[name='difficulty[]'][value='0']").click();
                                        },1000);
                                    });
                                }else if(globalLevel[j] =="Medium"){

                                    await gPage.evaluate( ()=>{
                                         setTimeout(()=>{
                                            document.querySelector('.panel-body[href="#collapse1"]').click();
                                        },1000);
                                         setTimeout(()=>{
                                            document.querySelector("[name='difficulty[]'][value='1']").click();
                                        },1000);
                                    });
                                }else if(globalLevel[j] =="Hard"){
                                    await gPage.evaluate(  ()=>{
                                         setTimeout(()=>{
                                            document.querySelector('.panel-body[href="#collapse1"]').click();
                                        },1000);
                                         setTimeout(()=>{
                                            document.querySelector("[name='difficulty[]'][value='2']").click();
                                        },1000);
                                    });
                                }else if(globalLevel[j]=="WithoutLevel"){
                                    await gPage.waitForTimeout(2000);
                                }  
                            
                                await gPage.waitForTimeout(3000);

                                await scrollToBottom();

                                    let companyQuestionsArrNotProper = await gPage.evaluate(()=>{
                            
                                        let allCpyQues = document.querySelectorAll(
                                                ".panel-body span"
                                        );
                                        let allCompanyQuestionArr=[];
                                        // cant Do Direct Because its not ARR its Type of Arr :-

                                        for(let i=0;i<allCpyQues.length;i++){
                                            allCompanyQuestionArr[i] = allCpyQues[i].innerHTML;
                                        }
                                        
                                        return allCompanyQuestionArr;
                                        
                                    });
                                    let companyQuestionArr = fixArr(companyQuestionsArrNotProper);

                                    if(companyQuestionArr.length!=0){
                                        await folderCheck(singleLevel,companyQuestionArr,singleCompany,singleTopicPdf);
                                        console.log(chalk.bold.yellow(`Congratulations QuestionsPDF For ${singleCompany} : ${singleTopicPdf} : ${singleLevel} Level has been Created` ));
                                    }else{
                                        console.log(chalk.bold.yellow(`GFG HAS ${chalk.red('NULL')} Questions For ${singleCompany} : ${singleTopicPdf} :${singleLevel} : Questions`));
                                    }       
                    }
        }

    }else if(selectedTopicOptions=="Company Topic Question Pdf - Topic Combine"){
        

                var globalLevel=[];
                var singlePdfString ="";
                        for(let i = 0; i < selectedTopicForPdf.length;i++){
                            singlePdfString += selectedTopicForPdf[i]+"_"
                        }
                    
                if(userSelectedLevelOptions=="eachTime"){

                        await decideLevel();
                        async function decideLevel(){
                            let ans = await  inquirer.prompt([
                                {
                                    type:"checkbox",
                                    name:"cbType",
                                    message:chalk.bold(`For ${chalk.red(singleCompany)} : ${singlePdfString}-  You Can Also Select ${chalk.red("Multiple")}'LEVEL'`),
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
                else if(userSelectedLevelOptions=="Without"){
                    globalLevel[0]="WithoutLevel"
                }

                await gPage.waitForTimeout(2000);
                
                for(let j = 0; j <globalLevel.length; j++){

                    var singleLevel = globalLevel[j];
                    
                    
                    await gPage.goto("https://practice.geeksforgeeks.org/company/"+singleCompany+"/");
                        await gPage.evaluate((selectedTopic) => {                 
                                
                            setTimeout(() =>{
                                document.querySelector('[href="#collapse4"] .panel-title').click();
                        },1000);
                            setTimeout(() =>{
                                document.querySelector('#moreCategories').click();
                        },1000);
                            setTimeout(() =>{
                            for(let i = 0; i <selectedTopic.length; i++){
                                setTimeout(() =>{
                                        document.querySelector(`.checkbox.row.display-flex.company-modal input[value=${selectedTopic[i]}]`).click();
                                },1000)
                            }
                        },2000);
                        
                        setTimeout(() =>{
                                document.querySelector('#selectCategoryModal .modal-body [class="close"]').click();
                        },2000);
                        
                        
                    },selectedTopic);


                    await gPage.waitForTimeout(5000);

                        if(globalLevel[j] =="Easy"){
                            await gPage.evaluate( ()=>{
                                setTimeout(() =>{
                                    document.querySelector('.panel-body[href="#collapse1"]').click();
                                },1000);
                                setTimeout(() =>{
                                    document.querySelector("[name='difficulty[]'][value='0']").click();
                                },1000);
                            });
                        }else if(globalLevel[j] =="Medium"){

                            await gPage.evaluate( ()=>{
                                setTimeout(()=>{
                                    document.querySelector('.panel-body[href="#collapse1"]').click();
                                },1000);
                                setTimeout(()=>{
                                    document.querySelector("[name='difficulty[]'][value='1']").click();
                                },1000);
                            });
                        }else if(globalLevel[j] =="Hard"){
                            await gPage.evaluate(  ()=>{
                                setTimeout(()=>{
                                    document.querySelector('.panel-body[href="#collapse1"]').click();
                                },1000);
                                setTimeout(()=>{
                                    document.querySelector("[name='difficulty[]'][value='2']").click();
                                },1000);
                            });
                        }
                        else if(globalLevel[j]=="WithoutLevel"){
                            await gPage.waitForTimeout(2000);
                        }  
                        
                        await gPage.waitForTimeout(2000);
                        await scrollToBottom();
                        let companyQuestionsArrNotProper = await gPage.evaluate(()=>{
                            
                            let allCpyQues = document.querySelectorAll(
                                    ".panel-body span"
                            );
                            let allCompanyQuestionArr=[];
                            // cant Do Direct Because its not ARR its Type of Arr :-

                            for(let i=0;i<allCpyQues.length;i++){
                                allCompanyQuestionArr[i] = allCpyQues[i].innerHTML;
                            }
                            
                            return allCompanyQuestionArr;
                            
                        });
                        let companyQuestionArr = fixArr(companyQuestionsArrNotProper);
                        
                        
                        if(companyQuestionArr.length!=0){
                            await folderCheck(singleLevel,companyQuestionArr,singleCompany,singlePdfString);
                            console.log(chalk.bold.yellow(`Congratulations QuestionsPDF For ${singleCompany} : ${singlePdfString} : ${singleLevel} Level has been Created` ));
                        }else{
                            console.log(chalk.bold.yellow(`GFG HAS ${chalk.red('NULL')} Questions For ${singleCompany} : ${singlePdfString} :${singleLevel} : Questions`));
                        }   



                }
                
    }//---------------------loop over --------------------------------//
    


        
            //---------------------------//

            function folderCheck(singleLevel,companyQuestionArr,singleCompany,singleTopic){
                let folderPath = "./threeFinder_Downloads/"+singleCompany+"_Questions"
                if (fs.existsSync(folderPath)) {
                    pdfCreate(folderPath,singleLevel,companyQuestionArr,singleCompany,singleTopic);
                }else {
                    fs.mkdirSync(folderPath,{ recursive: true });
                    pdfCreate(folderPath,singleLevel,companyQuestionArr,singleCompany,singleTopic);
                }
            };

            //------------------------//
            function pdfCreate(folderPath,singleLevel,companyQuestionArr,singleCompany,singleTopic){
                const doc = new PDFDocument;
                doc.pipe(fs.createWriteStream(folderPath+"/"+singleCompany+"_"+singleTopic+"_"+singleLevel+"_Questions"+'.pdf'))
                    
                    doc.font('./fonts/CascadiaCode-Bold.otf')
                        .fontSize(22)
                        .text(`${singleCompany} : Questions : ${singleTopic} : ${singleLevel} : GFG`)
                    doc.moveDown();
                    doc.font('./fonts/CascadiaCode.ttf')
                        .fontSize(18)
                        .list(companyQuestionArr,{ listType: 'numbered' })
                doc.end()
            }
            //-----------------------//

            
    //-----------------------//

    async function scrollToBottom() {
        const distance = 60;
        while (await gPage.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
        await gPage.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
        await gPage.waitForTimeout(500);
        }
    }

    //-----------------------//

        function fixArr(Arr){
            let arrLen = Arr.length-1;
            let newArr=[]
            let idx=0;
            for(let i=0;i<=arrLen;i++){
                newArr[idx]=Arr[i];
                idx++;
                i++;
            }
            return newArr;
        }

    //---------------------//



}