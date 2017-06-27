"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import Assessment     from "../models/assessment";
import SettingsStore  from "./settings";
import _              from "lodash";

const INVALID = -1;
const NOT_LOADED = 0;
const LOADING = 1;
const LOADED = 2;

var _assessment = null;
var _kind = null;
var _assessmentXml = null;
var _items = [];
var _outcomes = [];
var _assessmentState = NOT_LOADED;
var _selectedAnswerIds = [];
var _studentAnswers = [];
var _dirty = false;
var _errorMessages = [];
var _warningMessages = [];
var _inDraftOriginals = {};

var _assessmentResult = null;
var _assessmentResultState = NOT_LOADED;

function parseAssessmentResult(result){
  _assessmentResult = JSON.parse(result);
}

function loadAssessment(payload){
  _dirty = false;
  _errorMessages = [];
  _warningMessages = [];
  _assessmentState = INVALID;
  if(payload.data.text){
    var text = payload.data.text.trim();
    if(text.length > 0){
      _assessment = Assessment.parseAssessment(SettingsStore.current(), text);
      _kind = SettingsStore.current().assessmentKind.toLowerCase();
      _assessmentXml = text;
      if( _assessment &&
        _assessment.sections &&
        _assessment.sections[0] &&
        _assessment.sections[0].items){
        if(_assessment.standard == "qti"){
          _items = Assessment.getItems(_assessment.sections, -1, false);
        } else {
          _items = _assessment.sections[0].items
        }
        _outcomes = Assessment.loadOutcomes(_assessment);
      }
      _assessmentState = LOADED;
    }
  }

}

function outcomeNameFromGuid(guid) {
  let outcome = _.find(_outcomes, {outcomeGuid: guid});
  return outcome ? outcome.shortOutcome : "";
}

function holdIt(){
  return "If you leave your changes won't be saved."
}

function validateAssessment() {
  _errorMessages = [];
  _warningMessages = [];

  if(_items.length == 0){
    // only for self-checks?
    _errorMessages.push("There must be at least one question in this assessment. We recommend providing more than one question so that your students have multiple practice opportunities.");
  }

  let sectionCount = SettingsStore.current().perSec;
  if (sectionCount) {
    let outcomeCounts = {};
    _outcomes.forEach((o)=>{ outcomeCounts[o.outcomeGuid] = 0 });
    _items.forEach((item)=>{
      if(item.outcome){
        outcomeCounts[item.outcome.outcomeGuid]++;
      }
    });


    _.forEach(outcomeCounts, (count, guid)=>{
      if(count == 0){
        if(ReviewAssessmentStore.isFormative()) {
          _warningMessages.push('Outcome "' + outcomeNameFromGuid(guid) + '" will be removed unless you add a question(s) aligned to this outcome.');
        } else {
          _warningMessages.push('Outcome "' + outcomeNameFromGuid(guid) + '" will be removed unless you add ' + sectionCount + " question(s) aligned to this outcome.");
        }
      } else if ( count < sectionCount && !ReviewAssessmentStore.isFormative() ){
        _errorMessages.push('The outcome "' + outcomeNameFromGuid(guid) + '" has only ' + count + ' question(s); add ' + (sectionCount - count) + ' question(s) to keep outcome or delete all questions to remove outcome.');
      }
    });
  }

  if(_dirty){
    window.onbeforeunload = holdIt;
  }
}

function validateQuestion(question){
  switch (question.question_type) {
    case 'multiple_choice_question':
    case 'multiple_answers_question':
      return validateMultiChoiceQuestion(question);
    break;
    case 'essay_question':
      return validateEssayQuestion(question);
    break;
    case 'mom_embed':
      return validateMomQuestion(question);
    break;
    case 'multiple_dropdowns_question':
      return validateMDDQuestion(question);
    break;
  }
}

function validateMomQuestion(question){
  question.isValid = true;
  question.errorMessages = [];

  if(!!question.momEmbed.questionId && !(question.momEmbed.questionId > 0)){
    question.isValid = false;
    question.errorMessages.push("please enter a My Open Math Embedable Question Id. It should be an integer greater than 0")
  }

  return question;
}

function validateMultiChoiceQuestion(question){
  let duplicateArr = [];
  let hasDuplicates = false;
  question.isValid = true;
  question.errorMessages = [];

  //check if questions are blank
  if(!question.material.match(/\S/)){
    question.isValid = false;
    question.errorMessages.push('You must enter question text to finish editing this question.');
  }

  //ensure that outcome is selected
  if(!question.outcome || question.outcome.outcomeGuid == ''){
    question.isValid = false;
    question.errorMessages.push('You must select an outcome to finish editing this question.');
  }

  if(question.question_type != 'multiple_choice_question' && question.question_type != 'multiple_answers_question' ){
    question.isValid = false;
    question.errorMessages.push('You must select question type.');
  }

  //ensure that question has minimum number of answers.
  if(question.answers.length < 2){
    question.isValid = false;
    question.errorMessages.push("You need at least 2 answers to save your question");
  }

  //answer validations
  if (_.findIndex(question.answers, {isCorrect: true}) == -1) {
    question.isValid = false;
    question.errorMessages.push('You must indicate the correct answer choice(s) to finish editing this question.');
  }

  if (_.findIndex(question.answers, {material: ''}) >= 0 ) {
    question.isValid = false;
    question.errorMessages.push('Your answers must not be blank. Please enter answer text to finish editing this question.');
  }

  question.answers.forEach((answer, index, array)=>{
    //check if answers are duplicate
    if(duplicateArr.indexOf(answer.material.trim()) !== -1 && !hasDuplicates){
      hasDuplicates = true;

      question.isValid = false;
      question.errorMessages.push('Each answer option must be unique.');
    }

    duplicateArr.push(answer.material.trim());
  });//each

  return question;
}

function validateMDDQuestion(question){
  let dropDownKeys = Object.keys(question.dropdowns);
  let re = new RegExp('\\[(.*?)\\]', 'gi');
  let dropdownMatches = question.material.match(re);
  let dropdowns = dropdownMatches.map((dropdown) => {
    let re = new RegExp('\\[|\\]', 'g');
    return dropdown.replace(re, '');
  });
  question.isValid = true;
  question.errorMessages = [];

  if(question.outcome === "" || typeof question.outcome !== 'object'){
    question.isValid = false;
    question.errorMessages.push('You must select an outcome to finish editing the question')
  }

  //check if question is blank
  if(!question.material.match(/\S/)){
    question.isValid = false;
    question.errorMessages.push('You must enter question text to finish editing this question.');
  }

  dropdowns.sort().forEach((ddKey, i, ddArray) => {
    if(ddKey === ddArray[i + 1]){
      question.isValid = false;
      question.errorMessages.push(`All drop down shortcodes MUST be unique.`);
    }
  });


  dropDownKeys.forEach((ddKey, i) => {

    let correctIndex = question.dropdowns[ddKey].findIndex((element, j) => {
      return element.isCorrect === true;
    });

    let correctObj = !!question.correct ? question.correct.findIndex((element, j) => {
      return element.name === ddKey
    }) : -1;

    let blankAnswers = question.dropdowns[ddKey].findIndex((element, j) => {
      return element.name.match(/\S/);
    });

    //check if all dropdowns have a correct answer
    if (correctIndex === -1 && correctObj === -1) {
      question.isValid = false;
      question.errorMessages.push(`You must select a correct answer for ${ddKey} dropdown.`);
    }

    //check if any dropdown answers are blank
    if(blankAnswers === -1){
      question.isValid = false;
      question.errorMessages.push(`You must enter answer text for all options in ${ddKey} dropdown.`);
    }

    //check if all dropdowns have at least two options.
    if(question.dropdowns[ddKey].length < 2){
      question.isValid = false;
      question.errorMessages.push(`You must have at least two options for each dropdown.`);
    }

  });

  return question

}

function validateEssayQuestion(question){
  question.isValid = true;
  question.errorMessages = [];

  if(question.material.length === 0) {
    question.isValid = false;
    question.errorMessages.push("Please add question text to your essay question.");
  };

  return question
}

// Extend User Store with EventEmitter to add eventing capabilities
var ReviewAssessmentStore = assign({}, StoreCommon, {

  current(){
    if(_assessmentState >= LOADED){
      return _assessment;
    } else {
      return null;
    }
  },
  assessmentResult(){
    if(_assessmentResultState == LOADED){
      return _assessmentResult;
    } else {
      return null;
    }
  },
  isReady(){
    return _assessmentState >= READY;
  },
  isLoaded(){
    return _assessmentState >= LOADED;
  },
  isLoading(){
    return _assessmentState == LOADING;
  },
  isResultLoaded(){
    return _assessmentResultState == LOADED;
  },
  questionCount(){
    if(_items && _items.length > 0)return _items.length;
    if(SettingsStore.current().questionCount) return SettingsStore.current().questionCount;
    return SettingsStore.current().sectionCount * SettingsStore.current().perSec;
  },
  studentAnswers(){
    return _studentAnswers[_itemIndex];
  },
  allStudentAnswers(){
    return _studentAnswers;
  },
  allQuestions(){
    return _items;
  },
  itemByIdent(ident){
    return _.find(_items, 'id', ident)
  },
  outcomes(){
    return _outcomes;
  },
  timeSpent(){
    return {
      minutes: 1,
      seconds: 4
    };
  },
  isDirty(){
    return _dirty;
  },
  inDraft(){
    return _.findIndex(_items, {inDraft: true}) >= 0
  },
  errorMessages(){
    return _errorMessages;
  },
  warningMessages(){
    return _warningMessages;
  },
  canBeSaved(){
    validateAssessment();
    return _errorMessages.count == 0;
  },
  blankNewAnswer(){
    return {
      id: String((Math.random() * 100) * Math.random()),
      material: '',
      isCorrect: false,
      feedback: null
    }
  },
  blankNewDropdownOption(){
    return {
      name: '',
      value: String((Math.random() * 100) * Math.random()),
      feedback: null,
      isCorrect: false
    }
  },
  blankNewMomEmbeddedQuestion(){
    return {
      "momEmbed": {
        "questionId": null, // This is the value bound to the input on edit
        "domain": "www.myopenmath.com", // this is default, new questions just use this
        "iframeHeight": null
      },
    }
  },
  kind(){
    return _kind;
  },
  isSummative(){
    return _kind == "summative";
  },
  isFormative(){
    return _kind == "formative";
  },
  isSwyk(){
    return _kind == "swyk";
  },
  isPractice(){
    return _kind == "practice";
  },
  editableQuestionType(type){
     let isEditable = false;

     //add question types here to allow them to be editable.
     switch(type){
       case 'multiple_choice_question':
         isEditable = true;
       break;
       case 'multiple_answers_question':
         isEditable = true;
       break;
       case 'essay_question':
         isEditable = true;
       break;
       case 'mom_embed':
         isEditable = true;
       break;
       case 'multiple_dropdowns_question':
         isEditable = true;
       break;
     }

     return isEditable;

    return type == 'multiple_choice_question' || type == 'multiple_answers_question';
  }
});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action){

    case Constants.REVIEW_ASSESSMENT_LOAD_PENDING:
      _assessmentState = LOADING;
      break;

    case Constants.REVIEW_ASSESSMENT_LOADED:

      loadAssessment(payload);
      window.onbeforeunload = null;
      break;

    case Constants.REVIEW_RESULT_LOAD_PENDING:
      _assessmentResultState = LOADING;
      break;

    case Constants.REVIEW_RESULT_LOADED:
      parseAssessmentResult(payload.data.text);
      _assessmentResultState = LOADED;

      break;

    case Constants.ADD_ASSSESSMENT_QUESTION:
      var question = payload.data;
      var location = payload.location;
      
      if(location == 'top'){
        _items.unshift(question);
      }
      else if(location == 'bottom'){
        _items.push(question);
      }
      else if(location == 'duplicate'){
        _items.forEach((item, index)=>{
          if(item.id === question.id){
            let nQuestion = _.clone(question, true);
            nQuestion.id = nQuestion.newId;
            nQuestion.edited = true;
            _items.splice(index+1, 0, nQuestion);
          }
        });
        validateAssessment();
      }
      _dirty = true;

      break;

    case Constants.START_EDITING_QUESTION:
      var item = _.find(_items, {id: payload.data.id});
      if (item) {
        _inDraftOriginals[item.id] = _.clone(item, true);
        item.inDraft = true;
      }
      break;

    case Constants.CANCEL_EDITING_QUESTION:
      var index = _.findIndex(_items, {id: payload.data.id});
      if (index >= 0 && _inDraftOriginals[payload.data.id]) {
        _items[index] = _inDraftOriginals[payload.data.id];
        _inDraftOriginals[payload.data.id] = null;
      }
      validateAssessment();
      break;

    case Constants.UPDATE_ASSESSMENT_QUESTION:
      var question = payload.data;
      if (payload.validate) {
        validateQuestion(question);

        if (question.isValid) {
          question.edited = true;
          question.inDraft = false;
          question.errorMessages = [];
          question.isNew = false;
          _dirty = true;
          _inDraftOriginals[question.id] = null;
        }

      }

      var index = _.findIndex(_items, {id: question.id});
      if (index >= 0) {
        _items[index] = question;
      }

      if (payload.validate && question.isValid) {
        validateAssessment();
      }

      break;

    case Constants.DELETE_ASSESSMENT_QUESTION:
      var id = payload.data.id;

      _items.forEach((item, index)=>{
        if(item.id === id){
          _items.splice(index, 1);
        }
      });

      _dirty = true;
      validateAssessment();

      break;

    case Constants.VALIDATE_ASSESSMENT_QUESTIONS:
      let questions = payload.data;

      questions.forEach((question)=>{
        validateQuestion(question);
      });

      break;

    case Constants.VALIDATE_ASSESSMENT_QUESTION:
      validateQuestion(payload.data);

      break;

    case Constants.SAVE_ASSESSMENT:
      loadAssessment(payload);
      window.onbeforeunload = null;
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  ReviewAssessmentStore.emitChange();

  return true;

});


export default ReviewAssessmentStore;

