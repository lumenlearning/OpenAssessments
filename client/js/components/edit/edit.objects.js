var module = {
  moduleName: "Question bank for (Module Name) Module",
  enablingOutcomes:[
    {
      shortTitle: 'short outcome title',
      longTitle: 'this is a longer title for the outcome because it has more characters',
      quizTypes:[
        {
          type: 'Show What You Know',
          questions: [
            {
              title: "What is a question?",
              answers:[
                {
                  correct: true,
                  option: "You just asked one.",
                  feedback: "Correct! Well done, it seems you know what a question is"
                },
                //... more answers ...
              ],
              hint: "NO HINT FOR YOU",
              thirdLvlOutcome: {} //... unknown
            },
            //... more questions ...
          ]
        },
        {
          type: "Quiz",
          questions: []
        },
        {
          type: 'self check',
          questions: []
        }
      ]
    },
    //... more outcomes....
  ]
}

// /outcomes/123
// /outcomes/123?includes[]=sub_outcomes

// /banks/:id?include_outcomes

var outcomes = {
  outcome: {
    short_title:'',
    long_title:'',
    guid: '',
    parent_guid: '',
    sub_outcomes: [123,455,667,788]
  },
  outcomes:[
    {
      short_title:'',
      long_title:'',
      guid: '',
      parent_guid: '',
      bank_types: ['self_check', 'swyk', 'quiz']
    },
    {
      short_title:'',
      long_title:'',
      guid: '',
      parent_guid: '',
      bank_types: ['self_check', 'swyk', 'quiz']
    }
  ]
};


// /banks/:id/questions/:id  # for pusing / modifying specific questions
// /banks/:id/outcomes/:guid/questions/:bank_type  #for getting questions related to a bank.

var question = {
  guid: '',
  outcome_guid: '',
  questions: [
    {
      title: "What is a question?",
      answers: [
        {
          correct: true,
          option: "You just asked one.",
          feedback: "Correct! Well done, it seems you know what a question is"
        },
        //... more answers ...
      ],
      hint: "NO HINT FOR YOU",
      thirdLvlOutcome: {}
      //... unknown
    },
    //... more questions ...
  ]
};

let quizObj = {
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