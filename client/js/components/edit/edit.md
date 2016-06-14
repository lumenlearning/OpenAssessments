# Edit Route Components and API Docs

## API:
Below is the currently proposed structure of the JSON object returned from the API when given
a specific module. The API will be able to be broken in peices, but this is the full object

```javascript
{
  moduleName: "Question bank for (Module Name) Module",
  enablingOutcomes:[
    {
      selfCheck:[
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
      ],
      quiz: [], //Identical to selfCheck,
      swyk: []  //Identical to selfCheck,
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
      * **selfCheck**:
        * `type:`  Array        
        * `purpose:` Contains a list of of each quiz object related to the selfCheck section for this Enabling Outcome.
        * `children:` Array of Objects
          * `Quiz Object:` **SEE Quiz Object Below**
      * **quiz**:
        * `type:`  Array
        * `purpose:` Contains a list of of each quiz object related to the quiz section for this Enabling Outcome.
        * `children:` Array of Objects
          * `Quiz Object:` **SEE Quiz Object Below**
      * **swyk**:
        * `type:`  Array
        * `purpose:` Contains a list of of each quiz object related to the Show What you Know section for this Enabling Outcome.
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