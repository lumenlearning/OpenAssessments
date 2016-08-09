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

function validateAssessment() {
  _errorMessages = [];
  _warningMessages = [];

  if(_dirty){
    _warningMessages.push("You have unsaved changes.");
  }

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
        _warningMessages.push('Outcome "' + outcomeNameFromGuid(guid) + '" will be removed unless you add ' + sectionCount + " question(s) aligned to this outcome.");
      } else if ( count < sectionCount ){
        _errorMessages.push('The outcome "' + outcomeNameFromGuid(guid) + '" has only ' + count + ' question(s); add ' + (sectionCount - count) + ' question(s) to keep outcome or delete all questions to remove outcome.');
      }
    });
  }

  if(_.findIndex(_items, {inDraft: true}) >= 0){
   _errorMessages.push('You have questions in draft mode; press "Done Editing" to finish editing or cancel changes.');
  }
}

function validateQuestion(question){
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

// Extend User Store with EventEmitter to add eventing capabilities
var ReviewAssessmentStore = assign({}, StoreCommon, {

  current(){
    return _assessment;
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
  blankNewQuestion(){
    return {
      id: String((Math.random() * 100) * Math.random()),
      material: '',
      isCorrect: false,
      feedback: null
    }
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
      break;

    case Constants.UPDATE_ASSESSMENT_QUESTION:
      var question = payload.data;
      validateQuestion(question);

      if (question.isValid) {
        question.edited = true;
        question.inDraft = false;
        question.errorMessages = [];
        _dirty = true;
        _inDraftOriginals[question.id] = null;
      }

      var index = _.findIndex(_items, {id: question.id});
      if (index >= 0) {
        _items[index] = question;
      }

      if (question.isValid) {
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
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  ReviewAssessmentStore.emitChange();

  return true;

});


export default ReviewAssessmentStore;

