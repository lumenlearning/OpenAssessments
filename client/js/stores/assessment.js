"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import Utils          from "../utils/utils";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import Assessment     from "../models/assessment";

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
var _selectedConfidenceLevel = 0;
var _selectedAnswerId = null;
var _answerMessageIndex = -1;
var _sectionIndex = 0;
var _itemIndex = 0;

function parseAssessmentResult(result){
  _assessmentResult = JSON.parse(result);
}

function checkAnswer(){
  if(_selectedAnswerId !== null)
    return Assessment.checkAnswer(_assessmentXml, _selectedAnswerId, _selectedConfidenceLevel, _items[_itemIndex].question_type);
  else 
    return null;
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
    return _selectedAnswerId;
  },

  answerMessageIndex(){
    return _answerMessageIndex;
  }

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
          _assessment = Assessment.parseAssessment(payload.settings, text);
          _assessmentXml = text;
          if( _assessment && 
              _assessment.sections && 
              _assessment.sections[_sectionIndex] &&
              _assessment.sections[_sectionIndex].items){
            _items = _assessment.sections[_sectionIndex].items;
          }
          _assessmentState = LOADED;
        
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
      _startedAt = Utils.currentTime();
      _assessmentState = STARTED;
      break;

    case Constants.ASSESSMENT_VIEWED:
      if(payload.data.text && payload.data.text.length > 0){
        _assessmentResult = parseAssessmentResult(payload.data.text);
        _assessmentState = READY;
        _assessmentViewed = true;
      }
      break;

    case Constants.ASSESSMENT_NEXT_QUESTION:
      // Will need to advance sections and items.
      if(_itemIndex < _items.length - 1){ 
        _itemIndex++;
        _selectedAnswerId = null;
        _answerMessageIndex = -1;  
      }
      break;

    case Constants.ASSESSMENT_PREVIOUS_QUESTION:
      if(_itemIndex > 0){
        _itemIndex--;
        _selectedAnswerId = null;
        _answerMessageIndex = -1;
      }
      break;

    case Constants.ANSWER_SELECTED:
        _selectedAnswerId = payload.selectedAnswerId;
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  AssessmentStore.emitChange();

  return true;

});


export default AssessmentStore;

