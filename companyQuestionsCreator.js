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
exports.companyQuestionsCreator = (async ()=>{

    var browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo : 30,
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
     async function userSelectedCompanyName(){
        await inquirer.prompt([
            {
                type: 'checkbox-plus',
                name: 'cbType',
                message: 'Select Company',
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
            //User selected Nothing
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
                
                 companyLevel();
                 function companyLevel(){

                         inquirer.prompt([
                        {
                            type:"list",
                            name:"lType",
                            message:chalk.bold(`Select Any ${chalk.bold.red('ONE')}`),
                            choices:["Select Different LEVEL for Each Company","EASY LEVEL Question For All Selected Company","MEDIUM LEVEL Question For All Selected Company","HARD LEVEL for Question For All Selected Company","Other Option","Exit"],
                        }
                    ]).then((answer)=>{

                        let userSelectedAnswer = answer.lType;
                        var selectedLevel;
                        
                        if(userSelectedAnswer=="Select Different LEVEL for Each Company"){
                            
                            createCompanyQuestions(selectedCompanyArr,selectedLevel);
                        
                        }
                        else if(userSelectedAnswer=="EASY LEVEL Question For All Selected Company" || userSelectedAnswer=="MEDIUM LEVEL Question For All Selected Company" || userSelectedAnswer =="HARD LEVEL for Question For All Selected Company" ){
                            
                            if(userSelectedAnswer.includes("EASY")){selectedLevel = "Easy"}
                            else if(userSelectedAnswer.includes("MEDIUM")){selectedLevel = "Medium"}
                            else if(userSelectedAnswer.includes("HARD")){selectedLevel = "Hard"}
                            createCompanyQuestions(selectedCompanyArr,selectedLevel);
                         //   console.log(chalk.bold.yellow("congratulations your work For Question Finding is Done"));
                          //  console.log(chalk.bold.yellow("Thank You For Using threeFinder"));

                        }
                        else if(userSelectedAnswer=="Other Option"){

                            inquirer.prompt([
                                {

                                type:"list",
                                name:"lType",
                                message:chalk.bold(`Select Any ${chalk.red('One')}`),
                                choices:["Cancel This Option","Go Back","Go To Main Menu(ThreeFinder)","Exit"],
                                    
                                }
                                ]).then((answer)=>{
                                    let userSelectedAnswer = answer.lType;
                                    if(userSelectedAnswer=="Cancel This Option"){ companyLevel();}
                                    else if(userSelectedAnswer=="Go Back"){ userSelectedCompanyName();}
                                    //else if(userSelectedAnswer=="Go To Main Menu(ThreeFinder)"){/*ThreeFinderMenu();*/}
                                    else if(userSelectedAnswer=="Exit"){process.exit(0);}
                                });
                        }

                    });
                }
            }

            async function createCompanyQuestions(selectedCompanyArr,selectedLevel){
                //var gPage=gPage;
                var selectedLevelArr=[];
                for(i=0;i<selectedCompanyArr.length;i++){

                   var singleCompany = selectedCompanyArr[i];
                    if(selectedLevel==undefined){
                        /* This Function Handle -> Level Loop for Each different company
                         await is waiting for another await function*/
                       await decideLevel();
                       async function decideLevel(){
                            await  inquirer.prompt([
                                {
                                    type:"checkbox",
                                    name:"cbType",
                                    message:chalk.bold(`${chalk.red(singleCompany)} Select Any ${chalk.red("ONE") } From Given 'OPTIONS' Or You Can Also Select ${chalk.red("Multiple 'OPTIONS'")}`),
                                    choices:["Easy","Medium","Hard"],
                                }
                            ]).then(async (ans)=>{
                                selectedLevelArr = ans.cbType;
                                if(selectedLevelArr.length==0){ 
                                    await  decideLevel();
                                }
                            });
                       }                     
                  }else if(selectedLevel!=undefined){
                      selectedLevelArr[0]=selectedLevel;
                  }
                  for(let j=0;j<selectedLevelArr.length;j++){

                    var singleLevel = selectedLevelArr[j];

                    await gPage.goto("https://practice.geeksforgeeks.org/company/"+singleCompany+"/");
                    await gPage.waitForSelector(".panel-title")
                    await gPage.click(".panel-group .panel [href='#collapse1']")


                    if(singleLevel == "Easy"){ 
                        await gPage.waitForSelector("[name='difficulty[]'][value='0']");
                        await  gPage.click("[name='difficulty[]'][value='0']");
                    }
                    else if(singleLevel == "Medium"){
                        await gPage.waitForSelector("[name='difficulty[]'][value='1']");
                        await gPage.click("[name='difficulty[]'][value='1']");
                    }
                    else if(singleLevel == "Hard"){
                        await gPage.waitForSelector("[name='difficulty[]'][value='2']");
                        await gPage.click("[name='difficulty[]'][value='2']");
                    }
                    await gPage.waitForTimeout(600);
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
                            await folderCheck(singleLevel,companyQuestionArr,singleCompany);
                            console.log(chalk.bold.yellow(`Congratulations QuestionsPDF For ${singleCompany}  ${singleLevel} Level has been Created` ));
                        }else{
                            console.log(chalk.bold.yellow(`GFG HAS ${chalk.red('NULL')} Questions For ${singleCompany} : ${singleLevel} : Questions`));
                        }
                    }

                }
            }

            //Require For PDF CREATE

            //---------------------------//

            function folderCheck(singleLevel,companyQuestionArr,singleCompany){
                let folderPath = "./threeFinder_Downloads/"+singleCompany+"_Questions"
                if (fs.existsSync(folderPath)) {
                    pdfCreate(folderPath,singleLevel,companyQuestionArr,singleCompany);
                }else {
                    fs.mkdirSync(folderPath,{ recursive: true });
                    pdfCreate(folderPath,singleLevel,companyQuestionArr,singleCompany);
                }
            };

            //------------------------//
            function pdfCreate(folderPath,singleLevel,companyQuestionArr,singleCompany){
                const doc = new PDFDocument;
                doc.pipe(fs.createWriteStream(folderPath+"/"+singleCompany+"_"+singleLevel+"_Questions"+'.pdf'))
                    
                    doc.fontSize(22);
                    doc.text(`${singleCompany} : Questions : ${singleLevel}`);
                    doc.fontSize(18);
                    doc.list(companyQuestionArr);
                
                doc.end()
            }
            //-----------------------//

            async function scrollToBottom() {
                const distance = 60;
                while (await gPage.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
                await gPage.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
                await gPage.waitForTimeout(500);
                }
            }

            //---------------------//
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
        });
    }
})