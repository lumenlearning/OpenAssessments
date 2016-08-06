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
var _validationMessages = [];
var _inDraftOriginals = {};

var _assessmentResult = null;
var _assessmentResultState = NOT_LOADED;

function parseAssessmentResult(result){
  _assessmentResult = JSON.parse(result);
}

function loadAssessment(payload){
  _dirty = false;
  _validationMessages = [];
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

function validateQuestion(question, preValidateOnly=false){
  let duplicateArr = [];
  let hasDuplicates = false;
  let hasCorrect = false;
  let validationMsg = {
    questionId: question.id,
    isValid: true,
    messages: []
  };

  //check if questions are blank
  if(!question.material.match(/\S/)){
    validationMsg.isValid = false;
    validationMsg.messages.push('You must enter question text to finish editing this question.');
  }

  //ensure that outcome is selected
  if(question.outcome.outcomeGuid == ''){
    validationMsg.isValid = false;
    validationMsg.messages.push('You must select an outcome to finish editing this question.');
  }

  //ensure that question has minimum number of answers.
  if(question.answers.length < 2){
    validationMsg.isValid = false;
    validationMsg.messages.push("You need at least 2 answers to save your question");
  }

  //answer validations
  if (_.findIndex(question.answers, {isCorrect: true}) == -1) {
    validationMsg.isValid = false;
    validationMsg.messages.push('You must indicate the correct answer choice(s) to finish editing this question.');
  }

  if (_.findIndex(question.answers, {material: ''}) >= 0 ) {
    validationMsg.isValid = false;
    validationMsg.messages.push('Your answers must not be blank. Please enter answer text to finish editing this question.');
  }

  question.answers.forEach((answer, index, array)=>{
    //check if answers are duplicate
    if(duplicateArr.indexOf(answer.material.trim()) !== -1 && !hasDuplicates){
      hasDuplicates = true;

      validationMsg.isValid = false;
      validationMsg.messages.push(`You can't have two answers with the same text.`);
    }

    duplicateArr.push(answer.material.trim());
  });//each

  if (!preValidateOnly) {
    //append or add validation message to _validationMessages array
    var index = _.findIndex(_validationMessages, {id: validationMsg.id});
    if (index >= 0) {
      _validationMessages[index] = validationMsg;
    } else {
      _validationMessages.push(validationMsg);
    }
  }

  question.validationMessage = validationMsg;
  return validationMsg;
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
  validationMessages(){
    return _validationMessages;
  },
  validateQuestions(){
    _validationMessages = [];
    if(SettingsStore.current().perSec){
      // todo: for each outcome,
      // if question count > 0 && < perSec, add warning you need at least perSec (also can't save quiz)
      // if count == 0, add warning outcome will be removed
      _validationMessages.push("You need at least " + SettingsStore.current().perSec);
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
            _items.splice(index+1, 0, nQuestion);
          }
        });
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
      validateQuestion(question, true);

      if (question.validationMessage.isValid) {
        question.edited = true;
        question.inDraft = false;
        question.validationMessage = null;
        _dirty = true;
        _inDraftOriginals[question.id] = null;
      }

      var index = _.findIndex(_items, {id: question.id});
      if (index >= 0) {
        _items[index] = question;
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

