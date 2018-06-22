# Quiz Types

OEA has 4 quiz types: and a bunch of quiz settings.

Assessment Types:

- **summative** - These are _graded_ quizzes used by Waymaker. They ensure secure grading and closer tracking of a user's progress through the quiz. The results page shows every question and whether the user got it right/wrong.
- **show_what_you_know** AKA **swyk** - The pre-tests. Looks similar to the summative quizzes, and the results page is the same too. 
- **formative** - These are the self-checks at the end of each Waymaker outcome. Usually 3-5 questions. The results page is much more concise than the summative/swyk.
- **practice** - These are embedded withing the text content of Waymaker _and_ Candela courses. They are usually 1 question, but can be many. There is no results page, and showing feedback is always enabled. 

Assessment Settings:

- **allowed_attempts** - Usually only used for summative quizzes, and that uses 2. 
- **style** - Should always be `lumen_learning`
- **per_sec** - How many questions to pull from each QTI `section` when generating the quiz for the current attempt. A `section` is usually a bucket of questions for an enabling outcome. 
- **confidence_levels** - Whether to show the confidence level buttons instead of the next/previous buttons
- **enable_start** -  Whether to show a screen with a start button on it instead of just loading the first question of the quiz.
- **mode** -  which mode, `practice', `formative`, the quiz should use.
- **show_answers** - whether to show the answer to a question after its answered. (not on the results page)



## Default settings for types:

### Summative
```
  settings = AssessmentSetting.where(assessment_id: id).first
  settings.assessment_id = id
  settings.per_sec = 2
  settings.allowed_attempts = 2
  settings.style = 'lumen_learning'
  settings.enable_start = true
  settings.confidence_levels = false
  settings.save!
```

### SWYK

```
  settings = AssessmentSetting.where(assessment_id: id).first
  settings.assessment_id = id
  settings.per_sec = 1
  settings.allowed_attempts = 1
  settings.style = 'lumen_learning'
  settings.enable_start = true
  settings.confidence_levels = true
  settings.save!
```

### Formative (Self-Checks)

```
  settings = AssessmentSetting.where(assessment_id: id).first
  settings.assessment_id = id
  settings.per_sec = 3
  settings.style = 'lumen_learning'
  settings.enable_start = false
  settings.confidence_levels = true
  settings.mode = 'formative'
  settings.show_answers = true
  settings.save!
```


### Practice

```
  settings = AssessmentSetting.where(assessment_id: id).first
  settings.assessment_id = id
  settings.style = 'lumen_learning'
  settings.enable_start = false
  settings.confidence_levels = false
  settings.mode = 'practice'
  settings.show_answers = true
  settings.save!
```

