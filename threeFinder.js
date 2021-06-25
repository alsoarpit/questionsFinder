// "REQUIRERS"
const CFonts = require('cfonts');
const center = require('center-align');
const chalk = require('chalk');
const inquirer = require('inquirer');
const puppeteer = require('puppeteer');
// const {topicWiseQuestion} = require('./topicWiseQuestion');
//const {threeInOne} = require('./threeInOne');
const { companyQuestionsCreator } = require('./companyQuestionsCreator');


  // const threeFinderMenu =
    threeFinderMenu();
     function threeFinderMenu(){
      CFonts.say("WELCOME TO - 3 FINDER", {
          font: 'tiny',                 // define the font face
          align: 'center',              // define text alignment
          colors: ['yellowBright'], // define all colors
          background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
          letterSpacing: 1,           // define letter spacing
          lineHeight: 1,              // define the line height
          space: true,                // define if the output text should have empty lines on top and on the bottom
          maxLength: '0',             // define how many character can be on one line
          gradient: false,            // define your two gradient colors
          independentGradient: false, // define if you want to recalculate the gradient for each new line
          transitionGradient: false,  // define if this is a transition between colors directly
          env: 'node'                 // define the environment CFonts is being executed in
      });
  
      console.log(center((chalk.bgYellowBright.bold.black("The art is at your fingertips!!")),169));

        inquirer.prompt([
              {
                  type:"list",
                  name:"lType",
                  message:chalk.bold(`Select Any ${chalk.red.bold("'ONE'")}`),
                  choices:["Question's Finder","Hospital Finder","Route Finder","Exit"],
              }
          ]).then((answer)=>{
  
                let userSelectedAnswer =  answer.lType;
                
                if(userSelectedAnswer == "Question's Finder"){
                    
                        questionFinder();
                        function questionFinder(){

                            inquirer.prompt([
                                {
                                    type:"list",
                                    name:"lType",
                                    message:chalk.bold(`Select Any ${chalk.red('ONE')}`),
                                    choices:["Company Related Question's GFG","Topic Wise Question's GFG","Company - Topic - Level (3 in 'ONE')","LeetCode Question Level Wise","Other Option","Exit"],
                                }
                            ]).then((answer)=>{

                                let userSelectedAnswer = answer.lType;
                                if(userSelectedAnswer=="Company Related Question's GFG"){
                                    companyQuestionsCreator();
                                }
                                else if(userSelectedAnswer=="Topic Wise Question's GFG"){
                                      //topicWiseQuestion();
                                }
                                else if(userSelectedAnswer=="Company - Topic - Level (3 in 'ONE')"){
/**--------Working Here-----*/       threeInOne();
                                }
                                else if(userSelectedAnswer=="LeetCode Question Level Wise"){}
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
                                            if(userSelectedAnswer=="Cancel This Option"){questionFinder();}
                                            else if(userSelectedAnswer=="Go Back"){threeFinderMenu();}
                                            else if(userSelectedAnswer=="Go To Main Menu(ThreeFinder)"){threeFinderMenu();}
                                            else if(userSelectedAnswer=="Exit"){process.exit(0);}
                                        });

                                }else if(userSelectedAnswer=="Exit"){process.exit(0);}
                            });

                        }
                }
                else if(userSelectedAnswer == "Hospital Finder"){
                
                }
                else if(userSelectedAnswer=="Route Finder"){
    
                }
                else if(userSelectedAnswer=="Exit"){
                    process.exit(0);
                }
                
            });
    }