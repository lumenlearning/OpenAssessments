# Edit Route Components and API Docs

## API:
Below is the currently proposed structure of the JSON object returned from the API when given
a specific module. The API will be able to be broken in peices, but this is the full object

```javascript
{
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
```
###Keys:
  * **moduleName**:
    * `type:` String
    * `purpose:` Contains the Name for the course module and is used as a title header for the Edit page.
    * `children:` none
  * **enablingOutcomes**:
    * `type:` Array
    * `purpose:` Contains a list of all of the Enabling outcomes and their respective quiz data.
    * `children:` Array of Objects
      * **shortTitle**:
        * `type:` String
        * `purpose:` Holds the shortened value of LongTitle and is the Enabling Outcome Short name
        * `children:` none
      * **longTitle**:
        * `type:`  String
        * `purpose:` Holds the full length value of the enabling outcome name
        * `children:` none
      * **quizTypes**:
        * `type:` Array
        * `purpose:` Holds the array of quiz type objects (ie. show what you know, self check, and quiz)
        * `children:` Array of Objects
          * **type**:
            * `type:` String
            * `purpose:` Contains the name for the specific quiz type section (ie. "Show What you Know")
            * `children:` none
          * **questions**:
            * `type:`  Array
            * `purpose:` Contains a list of of each quiz object related to the specific quiz type section for this Enabling Outcome.
            * `children:` Array of Objects
              * `Quiz Object:`
                * **title**:  
                  * `type:` String
                  * `purpose:`Holds the value of the Quiz question
                  * `children:` none
                * **hint**:
                  * `type:` String
                  * `purpose:` Holds the value of any Hint that might or might not be available for the question
                  * `children:` none
                * **answers**:
                  * `type:` Array
                  * `purpose:` Contains a list of each answer object for the related question.
                  * `children:` Array of Objects
                    * **correct**:
                      * `type:` Boolean
                      * `purpose:` Determines if this question is counted as a correct answer.
                      * `children:` none
                    * **option**:
                      * `type:` String
                      * `purpose:` Contains the string value of the answer to that question
                      * `children:` none
                    * **feedback**:
                      * `type:` String
                      * `purpose:` Contains the string to display when the answer is selected.
                      * `children:` none
                    * **thirdLevelOutcome**: Currently an Unknown property, but once more Information is fleshed out we can determine the object structure.
                            
## Components:

### edit.jsx
This Component is the Entry point Component for the Quiz Editing route

* **State**:
  * 'module':
    * `type`: Object
    * `purpose`: contains the module data returned from the API. 
* **Props**: N/A (currently)

### outcomeSection.jsx
This Component

* **State**: N/A (currently)
* **Props**:
  * 'title':
    * `type:` String
    * `purpose` the value of 'title' determines the title content on the outcome section accordion
  * 'children'
    * `type:` Component
    * `purpose:` the value of 'children' holds the sub-components being passed into the outcome accordion.

### quizType.jsx

* **State**: N/A (currently)
* **Props**:
  * 'title'
    * `type:` String
    * `purpose:` the value of 'title' will display what quiz type is being used ie. "Show What You Know"
  * 'children'
    * `type:` Component
    * `purpose:` 'children' holds the sub-components being passed into each quiz types. ie iterating through each question and showing the question block.

### questionBlock.jsx

* **State**:
    * 'question'
      * `type:` Object
      * `purpose:` this holds the question object passed into the component via props.
* **Props**:
    * 'question'
      * `type:` Object
      * `purpose:` the quiz question object to be passed into the component and stored in state.
    * 'afterQuestionEdit'
      * `type:` Function
      * `purpose:` this function fires after any part of the quiz object has been edited inside the component. it receives the question object as an argument.