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
var _items = [];
var _assessmentResult = null;
var _assessmentState = NOT_LOADED;
var _startedAt;
var _selectedConfidenceLevel = 0;

var _sectionIndex = 0;
var _itemIndex = 0;

function parseAssessmentResult(result){
  _assessmentResult = JSON.parse(result);
}

function checkAnswer(){
  Assessment.checkAnswer(selectedConfidenceLevel);
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
          _assessmentState = LOADED;
          _assessment = Assessment.parseAssessment(payload.settings, payload.data.text);
          if( _assessment && 
              _assessment.sections && 
              _assessment.sections[_sectionIndex] &&
              _assessment.sections[_sectionIndex].items){
            _items = _assessment.sections[_sectionIndex].items;
          }
        }
      }
      break;

    case Constants.ASSESSMENT_CHECK_ANSWER:
      checkAnswer();
      break;

    case Constants.ASSESSMENT_START:
      _startedAt = Utils.currentTime();
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
      if(_itemIndex < _items.length - 1) 
        _itemIndex++;
      break;

    case Constants.ASSESSMENT_PREVIOUS_QUESTION:
      if(_itemIndex > 0)
        _itemIndex--;
      break;


    default:
      return true;
  }

  // If action was responded to, emit change event
  AssessmentStore.emitChange();

  return true;

});


export default AssessmentStore;

