# OEA Models and Such

## Models

- **Assessment** - This is the main model for all the quizzes. It holds the `kind` of quiz it is: `summative`, `show_what_you_know`, `formative`, `practice`. The `kind` determines many things like styles while taking the quiz and what AssessmentXml to use.
  - **AssessmentXml** - This holds QTI for the Assessment. And assessment has at least 2 of these as the current version of the quiz. One that has the answers included in the QTI (`kind` = `formative`), and one that doesn't have the answers in the QTI (`kind` = `summative`). This is because the QTI is send to the client and a savvy learner could look at it and figure out the answers.
  - **AssessmentSetting** - There are lots of settings available for a quiz and they are held in this model. Since there can technically be more than one per Assessment, use `Assessment#default_settings` to fetch the appropriate one. (though our assessments _should_ only have one setting) 
- **User** - A User is created from an LTI Launch. All quiz attempts are mapped to that User via its LTI `user_id`. The User has a bunch of Devise properties enforced, but Lumen doesn't actually use those.
  - **ExternalIdentifier** - This actually holds the LTI `user_id`. This is meant to handle the case that a User could "log in" via LTI or direct username and password. Lumen doesn't use the direct log in functionality.
  - **LtiLaunch** - Stores all the LTI information for a launch. This could be considered as a User session. It also holds the LTI information necessary for the grade write-back to the LMS.
- **UserAssessment** - This ties a User to their attempts on a specific Assessment. So it holds how many attempts they've used and other info.
- **AssessmentResult** - Each attempt has a bunch of data like score and answers and whether the grade was written to the LMS. This model holds all that and references the UserAssessment and User.
  - **Progress** - For _summative_ quizzes only, this holds a User's answers while taking the quiz. This is to help in situations where a User might not finish a quiz. It references one AssessmentResult.
- **LtiCredential** - This holds the LTI keys and secrets.


## Controllers

- **LtiBaseController** - Where LTI launches are validated and Users/ExternalIdentifiers are found or created.
- **AssessmentsController** - All LTI launches for quizzes hit this controller at `#show`. It preps the Assessment, its AssessmentSettings, and finds or creates a UserAssessment as needed.  
  - **app/views/assessments/_assessment_setup.html.erb** - This is used by `show.html.erb` to load all the AssessmentSettings into `window.DEFAULT_SETTINGS` for the Javascript client to use.
  - **AssessmentsController#edit** - The LTI endpoint for quiz editing. In addition to the usual LTI validation this checks the permissions of the user to make sure they can edit the quiz.
- **Api::AssessmentsController#show** - When a user clicks "start quiz" in the UI, it does an XHR call to this endpoint. It verifies the user and its attempts to make sure it can access the quiz, and decides whether to return QTI with or without answers included based on the settings. It also increments the User's attempt count in the UserAssessment if applicable. It also creates an AssessmentResult to use during the quiz to store the Progress.  
- **Api::AssessmentsController#json_update** - This is used by the quiz edit UI to update a quiz. The JSON it receives is converted to QTI to be saves as a new AssessmentXml version for the Assessment. And yes, lol at json-xml conversion. :)
- **Api::AssessmentsController#copy** - The endpoint used by Goldilocks to copy a quiz. 
- **Api::GradesController#create** - This is that a quiz is submitted to for grading. It stores the score and other info in the AssessmentResult and marks it as `pendingLtiOutcome` if it's summative meaning it needs to send the grade to the LMS. The response is used in the UI for the results page seen by the user. 
- **Api::AssessmentResultsController#log_progress** - Used during the quiz to hold all the answers chosen so far in the quiz.
- **Api::AssessmentResultsController#send_lti_outcome** - Sadness: Because OEA doesn't have background jobs, this endpoint is hit by the client to send the grade to the LMS in an XHR call that the UI is not waiting on so that it doesn't disrupt the user's interactions. _But_, there is a background process running that looks for AssessmentResults that need to be sent to the LMS and that'll catch ones that are missed every minute. This is only relevant for summative quizzes.
- **Api::AssessmentResultsController#send_results_to_analytics** - Sadness:  Because OEA doesn't have background jobs, this endpoint is hit by the client to send the results to the "analytics service", which means Goldilock's `ServiceApi::QuizAttemptsController#create` endpoint. This is what drives the study plan, and happens for all quiz types.
- **Api::LtiCredentialsController** - Used by Lumen Admin to manage LtiCredentials in OEA. Only usable by a JWT with scope `AuthToken::FULL_SERVICE_API_ACCESS` 


### Controller Authentication/Authorization

API endpoints pull a JWT token out of the `Authorization` header and parse out who the User and LtiLaunch are. Then use that info to decide permissions.

When an Admin/Teacher comes, they get an extra value in the JWT `AuthToken::ADMIN_SCOPES` which is an array of LTI `context_id` that this user is an admin for. This is what allows them to see quiz results for UserAssessments in that `context_id`

Similarly, when doing an Edit LTI Launch, the `edit_id` they can edit is stored in the JWT in `AuthToken::EDIT_ID_SCOPE`


## Editing

For a Waymaker book, all courses share the same quizzes in OEA. So as we make updates to those, they're available to everyone. 

But when a faculty/admin goes to edit a quiz in Waymaker, it will use the OEA API to make a copy of that quiz just for that course. (or more accurately, for that EditId)

In Goldilocks `Lti::StudyItemLtiController#launch_study_item_edit` it checks if the quiz has already been edited, and if not it'll make a copy via the API, setting the `external_edit_id` on an Assessment to scope it. 



## Javascript Client

Lives in `client/`. It's mostly treated as a completely separate application, its only interactions with Rails are 2 rake tasks to run webpack, and to use some of the images assets provided by the rails app.

todo: Talk about the structure of the client app. 


## OHM Questions

These are a special question type. We wanted to be able to use OHM questions along with all the outcome alignments and smooth Waymaker integration, but not have to load a whole OHM quiz.

So, OHM questions are embedded in an IFrame, and use a shared key/secret to sign JWTs with the results of grading a question in OHM.



## Embedding in PBJ with `user_id`

When a practice quiz is embedded in a page it is not via an LTI so the context/user information needs to be sent as query parameters.
The `external_user_id` and `external_context_id` are then passed to Goldilocks to process the QuizAttempt.

```
src="https://assessments.lumenlearning.com/assessments/load?
src_url=https%3A%2F%2Fassessments.lumenlearning.com%2Fapi%2Fassessments%2F4803.xml
&results_end_point=https%3A%2F%2Fassessments.lumenlearning.com%2Fapi
&assessment_id=4803
&confidence_levels=true
&style=lumen_learning
&assessment_kind=formative
&external_user_id=1d59ddbce40747fd7c9664c7c08e24017b8b734c
&external_context_id=a65a2ab6785771b7072d6d2b0ad5cecde4b84774
&iframe_resize_id=oea_assessment"
```


