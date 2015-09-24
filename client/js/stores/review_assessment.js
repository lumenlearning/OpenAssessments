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

var _assessmentResult = null;
var _assessmentResultState = NOT_LOADED;

function parseAssessmentResult(result){
  _assessmentResult = JSON.parse(result);
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

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action){

    case Constants.REVIEW_ASSESSMENT_LOAD_PENDING:
      _assessmentState = LOADING;
      break;

    case Constants.REVIEW_ASSESSMENT_LOADED:

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
              _items = Assessment.getItems(_assessment.sections, -1);
            } else {
              _items = _assessment.sections[0].items
            }
            _outcomes = Assessment.loadOutcomes(_assessment);
          }
          _assessmentState = LOADED;
        }
      }
      break;

    case Constants.REVIEW_RESULT_LOAD_PENDING:
      _assessmentResultState = LOADING;
      break;

    case Constants.REVIEW_RESULT_LOADED:
        parseAssessmentResult(payload.data.text);
      _assessmentResultState = LOADED;

      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  ReviewAssessmentStore.emitChange();

  return true;

});


export default ReviewAssessmentStore;

