"use strict";

import React                         from 'react';
import Style                         from './css/style';
import {Accordion, AccordionSection} from './accordion/accordion.js';
import OutcomeSection                from './outcome_section/outcome_section.jsx';

export default class Edit extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {
      moduleName: "Macroeconomics",
      moduleInstructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam varius enim ut dapibus congue. Duis ante justo, mollis quis neque ut, tempus mollis diam. Ut commodo quis neque ut sollicitudin. Aenean molestie tristique blandit. Quisque id orci in sem porttitor condimentum. Praesent nulla diam, sodales a sagittis non, malesuada non elit. Duis consectetur varius ligula, vitae dignissim nunc ultrices vitae. Morbi leo tortor, scelerisque in euismod id, scelerisque faucibus nunc. Ut lacinia tincidunt urna id tincidunt. Nulla sapien sem, molestie pulvinar pellentesque in, dignissim sed mi. In eleifend eu nisl id tincidunt. Fusce imperdiet mollis sollicitudin.",
      enablingOutcomes:[
        {
          shortTitle: 'Enabling Outcome1 Short Title',
          longTitle: 'Enabling Outcome1 Long Title of Longing and Longly Sentences',
          quizTypes:[
            {
              type: 'Show What You Know',
              questions:[
                {
                  title: "What is a question?",
                  answers:[
                    {
                      correct: true,
                      option: "You just asked one.",
                      feedback: "Correct! Well done, it seems you know what a question is"
                    },

                  ],
                  hint: "NO HINT FOR YOU",
                  thirdLvlOutcome: {}
                },
              ]
            },
            {
              type: 'Self Check',
              questions:[
                {
                  title: "Why is a raven like a writing desk?",
                  answers:[
                    {
                      correct: true,
                      option: "You've gone mad.  But it's okay.  We're all mad here...",
                      feedback: "Correct! Well done, you seem to know stuff!"
                    },

                  ],
                  hint: "Ravens aren't like writing desks. Rather, writing desks are like ravens.",
                  thirdLvlOutcome: {}
                },
              ]
            },
            {
              type: 'Quiz',
              questions:[
                {
                  title: "Are you a wizard?",
                  answers:[
                    {
                      correct: true,
                      option: "Yes.",
                      feedback: "Correct!  You're a wizard 'arry!"
                    },

                  ],
                  hint: "If you've talked to snakes recently, then yes.",
                  thirdLvlOutcome: {}
                },
              ]
            },
          ],
        },
        {
          shortTitle: 'Enabling Outcome2 Short Title',
          longTitle: 'Enabling Outcome2 Long Title of Longing and Longly Sentences',
          quizTypes:[
            {
              type: 'Show What You Know',
              questions:[
                {
                  title: "What is a question?",
                  answers:[
                    {
                      correct: true,
                      option: "You just asked one.",
                      feedback: "Correct! Well done, it seems you know what a question is"
                    },

                  ],
                  hint: "NO HINT FOR YOU",
                  thirdLvlOutcome: {}
                },
              ]
            },
            {
              type: 'Self Check',
              questions:[
                {
                  title: "Why is a raven like a writing desk?",
                  answers:[
                    {
                      correct: true,
                      option: "You've gone mad.  But it's okay.  We're all mad here...",
                      feedback: "Correct! Well done, you seem to know stuff!"
                    },

                  ],
                  hint: "Ravens aren't like writing desks. Rather, writing desks are like ravens.",
                  thirdLvlOutcome: {}
                },
              ]
            },
            {
              type: 'Quiz',
              questions:[
                {
                  title: "Are you a wizard?",
                  answers:[
                    {
                      correct: true,
                      option: "Yes.",
                      feedback: "Correct!  You're a wizard 'arry!"
                    },

                  ],
                  hint: "If you've talked to snakes recently, then yes.",
                  thirdLvlOutcome: {}
                },
              ]
            },
          ],
        },

      ]
    }
  }

  componentWillMount(){
    //when component will mount, grab data from the editQuiz store
  }

  render(){
    let enablingOutcomeSections = this.state.enablingOutcomes;
    let style = Style.styles();

    return (
      <div style={{padding:"15px"}}>
        <h1>Question Bank for {this.state.moduleName} Module</h1>
        <p>
          {this.state.moduleInstructions}
        </p>
        <div style={{margin:"0 15px"}}>
          <Accordion showAll={false} hTag={'h2'} dividers={false}>
            {enablingOutcomeSections.map((section, index) => {
                return (
                  <OutcomeSection section={section} key={index} />
                )
              })}
          </Accordion>
        </div>
      </div>
    );
  }

  /*CUSTOM HANDLER FUNCTIONS*/

  /*CUSTOM FUNCTIONS*/
};

module.export = Edit;
