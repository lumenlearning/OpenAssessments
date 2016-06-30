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