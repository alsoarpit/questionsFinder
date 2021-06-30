`--unhandled-rejections=strict`
const fs = require('fs');
const chalk = require('chalk');
const center = require('center-align');
const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const doc = require('pdfkit');
const { list } = require('pdfkit');

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
    await gPage.waitForTimeout(1100);
    await gPage.click('#headlessui-listbox-button-13');
    await gPage.waitForTimeout(500);
    await gPage.evaluate(()=>{   
            let a = document.querySelectorAll('[class="text-label-1 dark:text-dark-label-1 cursor-default select-none relative h-8 py-1.5 pl-2 pr-9"]');        
            a[1].click();
    });
    
    await gPage.waitForTimeout(3000);
    let ansObj = await gPage.evaluate(()=>{
        let aTag = document.querySelectorAll('.ant-table-tbody .flex.items-center .overflow-hidden a');
        let questionArr = [];
        let linkArr = []
        //--------------------------------------------------------/
        let i1=0;
        for(let i=1;i<aTag.length;i++){
            questionArr[i1] = aTag[i].innerText;
            linkArr[i1] = "https://leetcode.com"+(aTag[i].getAttribute("href"));
            i1++;
        }
        // ----------------------------------------------------------------//
        let acceptanceArr =[];
        let levelArr =[];
        let acceptanceLevel = document.querySelectorAll('.ant-table-tbody [class="ant-table-row ant-table-row-level-0 even:bg-overlay-3 dark:even:bg-dark-overlay-1 odd:bg-overlay-1 dark:odd:bg-dark-overlay-3"] [class="ant-table-cell ant-table-cell-ellipsis"][class="ant-table-cell ant-table-cell-ellipsis"]>span');
        let i2=0;
        for(let i=0; i<acceptanceLevel.length;i++){
            acceptanceArr [i2]=acceptanceLevel[i].innerText;
            i2++;
            i++;
        }
        let i3=0
        for(let j=1; j<acceptanceLevel.length;j++){
            levelArr[i3]=acceptanceLevel[j].innerText;
            i3++;
            j++;
        }
        //---------------------shift first element --------------------//
        acceptanceArr.shift();
        levelArr.shift();
        
        return {linkArr,questionArr,acceptanceArr,levelArr};
    });
        var linkArr = ansObj.linkArr;
        var questionArr = ansObj.questionArr;
        var acceptanceArr = ansObj.acceptanceArr;
        var levelArr = ansObj.levelArr;
      await  folderCheck();
      console.log(chalk.bold.yellow(`Congratulations leetCode Top 100 Liked Questions PDF has been Created` ));
      console.log(center((chalk.bgRedBright.bold.black("\n Thank You For Using questionsFinder ")),122));
    function folderCheck(){
        let folderPath = "./questionsFinder_Downloads/leetCodeTop100LikedQuestions_Questions"
        if (fs.existsSync(folderPath)) {
            pdfCreate(folderPath,questionArr,linkArr,acceptanceArr,levelArr);
        }else {
            fs.mkdirSync(folderPath,{ recursive: true });
            pdfCreate(folderPath,questionArr,linkArr,acceptanceArr,levelArr);
        }
    };
    function pdfCreate(folderPath,questionArr,linkArr,acceptanceArr,levelArr){
        const doc = new PDFDocument;
        doc.pipe(fs.createWriteStream(folderPath+"/leetCodeTop100LikedQuestions_Questions.pdf"))     
            doc.font('./fonts/CascadiaCode-Bold.otf')
                .fontSize(22)
                .text(`LeetCode Top 100 Liked Questions`)
            doc.moveDown();
            doc.font('./fonts/CascadiaCode.ttf')
                .fontSize(18)
                for(let i = 0; i <questionArr.length;i++){
                    doc.text(`${questionArr[i]} : acceptance : ${acceptanceArr[i]} : Level ${levelArr[i]}`,{
                        link:linkArr[i],
                    }).moveDown(1.5)
                
                }        
        doc.end()
    }
}
module.exports ={top100LikedQuestions}