"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import Utils          from "../utils/utils";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import Assessment     from "../models/assessment";
import SettingsStore  from "./settings";
import EdX            from "../models/edx";
import _              from "lodash";
const INVALID = -1;
const NOT_LOADED = 0;
const LOADING = 1;
const LOADED = 2;
const READY = 3;
const STARTED = 4;

var _assessment = null;
var _assessmentXml = null;
var _items = [];
var _assessmentResult = null;
var _assessmentState = NOT_LOADED;
var _startedAt;
var _finishedAt
var _selectedConfidenceLevel = 0;
var _selectedAnswerIds = [];
var _answerMessageIndex = -1;
var _sectionIndex = 0;
var _itemIndex = 0;
var _studentAnswers = [];

function parseAssessmentResult(result){
  _assessmentResult = JSON.parse(result);
}

function checkAnswer(){
  if(_selectedAnswerIds !== null){
    return Assessment.checkAnswer(_items[_itemIndex], _selectedAnswerIds);
  } else{ 
    return null;
  }
}

function selectAnswer(item){
  if(_items[_itemIndex].question_type == "multiple_choice_question"){
    _selectedAnswerIds = item.id;
  } else if (_items[_itemIndex].question_type == "multiple_answers_question"){
    if(_selectedAnswerIds.indexOf(item.id) > -1){
      _selectedAnswerIds.splice(_selectedAnswerIds.indexOf(item.id), 1);
    } else {
    _selectedAnswerIds.push(item.id);
    }
  } else if (_items[_itemIndex].question_type == "matching_question"){
    updateMatchingAnswer(item);
  } 
}

function updateMatchingAnswer(item){
  for (var i = 0; i < _selectedAnswerIds.length; i++){
    if(_selectedAnswerIds[i] && _selectedAnswerIds[i].answerNumber == item.answerNumber){
      _selectedAnswerIds[i] = item;
      return;
    }
  }
  var index = parseInt(item.answerNumber.replace("answer-", ""));

 _selectedAnswerIds[index] = item;

}

function setUpStudentAnswers(numOfQuestions){
  for (var i = 0; i < numOfQuestions; i++){
    _studentAnswers[i] = [];
  }
}

function clearStore(){
  _assessment = null;
  _assessmentXml = null;
  _items = [];
  _assessmentResult = null;
  _assessmentState = NO_LOADED;
  _startedAt;
  _selectedConfidenceLevel = 0;
  _selectedAnswerIds = [];
  _answerMessageIndex = -1;
  _sectionIndex = 0;
  _itemIndex = 0;
  _studentAnswers = [];
}

function calculateTime(start, end){
  return end - start;
};

function getItems(sections, perSec){
  var items = []
  if(!perSec || perSec <= 0){
    return sections[0].items
  } 

  for(var i=1; i<sections.length; i++){
    var count = perSec > sections[i].items.length ? sections[i].items.length : perSec;
    for(var j=0; j < count; j++){
      items.push(_.sample(sections[i].items));
    }
  }
  return items;
}

// Extend User Store with EventEmitter to add eventing capabilities
var AssessmentStore = assign({}, StoreCommon, {

  current(){
    return _assessment;
  },

  assessmentResult(){
    return _assessmentResult;
  },

  isReady(){
    return _assessmentState >= READY;
  },

  isLoaded(){
    return _assessmentState >= LOADED;
  },

  isStarted(){
    return _assessmentState >= STARTED;
  },

  isLoading(){
    return _assessmentState == LOADING;
  },

  currentQuestion(){
    return _items[_itemIndex] || {};
  },

  currentIndex(){
    return _itemIndex;
  },

  questionCount(){
    return _items.length;
  },

  selectedAnswerId(){
    return _selectedAnswerIds;
  },

  answerMessageIndex(){
    return _answerMessageIndex;
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

  timeSpent(){
    var time = _finishedAt - _startedAt;
    var minutes = Math.floor(time/1000/60);
    time -= minutes*1000*60
    var seconds = Math.floor(time/1000);
    return {
      minutes: minutes,
      seconds: seconds
    }
  },

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action){

    case Constants.ASSESSMENT_LOAD_PENDING:
      _assessmentState = LOADING;
      break;

    case Constants.ASSESSMENT_LOADED:
      _assessmentState = INVALID;
      if(payload.data.text){
        var text = payload.data.text.trim();
        if(text.length > 0){
          _assessment = Assessment.parseAssessment(SettingsStore.current(), text);
          _assessmentXml = text;
          if( _assessment && 
              _assessment.sections && 
              _assessment.sections[_sectionIndex] &&
              _assessment.sections[_sectionIndex].items){
            if(_assessment.standard == "qti"){
              _items = getItems(_assessment.sections, SettingsStore.current().perSec);
            } else {
              _items = _assessment.sections[_sectionIndex].items
            }
            setUpStudentAnswers(_items.length)
          }
          _assessmentState = LOADED;
          if(!_startedAt && !SettingsStore.current().enableStart){
            // set the start time for the assessment and the first question (only qti)
            if(_items[0])
            _items[0].startTime = Utils.currentTime()
            _startedAt = Utils.currentTime();
          }
        }
      }
      break;

    case Constants.ASSESSMENT_CHECK_ANSWER:
      var answer = checkAnswer();
      if(answer != null && answer.correct)
        _answerMessageIndex = 1;
      else if (answer != null && !answer.correct)
        _answerMessageIndex = 0;
      break;

    case Constants.ASSESSMENT_START:
      if(!_startedAt){
        // set the start time for the assessment and the first question
        _items[0].startTime = Utils.currentTime()
        _startedAt = Utils.currentTime();
      }
      _assessmentState = STARTED;
      break;

    case Constants.ASSESSMENT_VIEWED:
      if(payload.data.text && payload.data.text.length > 0){
        _assessmentResult = parseAssessmentResult(payload.data.text);
        _assessmentState = READY;
      }
      break;

    case Constants.ASSESSMENT_NEXT_QUESTION:
      // Will need to advance sections and items.
      if(_itemIndex < _items.length - 1){
        _items[_itemIndex].timeSpent += calculateTime(_items[_itemIndex].startTime, Utils.currentTime()); 
        _studentAnswers[_itemIndex] = _selectedAnswerIds;
        _itemIndex++;
        _items[_itemIndex].startTime = Utils.currentTime();
        _selectedAnswerIds = _studentAnswers[_itemIndex];
        _answerMessageIndex = -1;  
      } 
      break;

    case Constants.ASSESSMENT_PREVIOUS_QUESTION:
      if(_itemIndex > 0){
        _items[_itemIndex].timeSpent += calculateTime(_items[_itemIndex].startTime, Utils.currentTime());
        _studentAnswers[_itemIndex] = _selectedAnswerIds;
        _itemIndex--;
        _items[_itemIndex].startTime = Utils.currentTime();
        _selectedAnswerIds = _studentAnswers[_itemIndex];
        _answerMessageIndex = -1;
      }
      break;

    case Constants.ANSWER_SELECTED:
      selectAnswer(payload.item);
      break;

    case Constants.EDX_LOAD_SECTION:
      if(_assessment){
        //EdX.findAndSetObject(_assessment.sections, payload.item);
      }
      break;

    case Constants.EDX_LOAD_ITEM:
        _items.push(payload.item);
      break;

    case Constants.ASSESSMENT_GRADED:
      
      parseAssessmentResult(payload.data.text);
      break;
    case Constants.ASSESSMENT_SUBMITTED:
      _items[_itemIndex].timeSpent += calculateTime(_items[_itemIndex].startTime, Utils.currentTime());
      _finishedAt = Utils.currentTime(); 
      break;

    case Constants.CLEAR_STORE:
      clearStore();
      break;
    case Constants.LEVEL_SELECTED:
      _items[_itemIndex].confidenceLevel = payload.level;
      // if(SettingsStore.current().kind == "formative"){
      //   var answer = checkAnswer();
      //   if(answer != null && answer.correct)
      //     _answerMessageIndex = 1;
      //   else if (answer != null && !answer.correct)
      //     _answerMessageIndex = 0;
      
      // }
      break;
    default:
      return true;
  }

  // If action was responded to, emit change event
  AssessmentStore.emitChange();

  return true;

});


export default AssessmentStore;

