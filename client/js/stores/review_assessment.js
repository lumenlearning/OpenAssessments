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
  //assessmentResult(){
  //  return _assessmentResult;
  //},
  assessmentResult(){
   //return {"score":20.833333333333336,"feedback":"Study Harder","correct_list":[false,false,"partial",true,false,false,true,false,false,false,false,false],"confidence_level_list":["Just A Guess","Pretty Sure","Very Sure","Just A Guess","Pretty Sure","Very Sure","Just A Guess","Pretty Sure","Very Sure","Just A Guess","Very Sure","Pretty Sure"],"lti_params":{"itemToGrade":{"questions":[{"id":"6832","confidenceLevel":"Just A Guess","timeSpent":2363,"startTime":1442857207791,"outcome_guid":"5e567170-4a58-4cda-9e8d-be04c46f0b53"},{"id":"322","confidenceLevel":"Pretty Sure","timeSpent":2183,"startTime":1442857210154,"outcome_guid":"5e567170-4a58-4cda-9e8d-be04c46f0b53"},{"id":"1629","confidenceLevel":"Very Sure","timeSpent":1784,"startTime":1442857212337,"outcome_guid":"d89c6da2-c2f8-439f-8e17-953c2f9cedd0"},{"id":"4756","confidenceLevel":"Just A Guess","timeSpent":1728,"startTime":1442857214121,"outcome_guid":"d89c6da2-c2f8-439f-8e17-953c2f9cedd0"},{"id":"101","confidenceLevel":"Pretty Sure","timeSpent":1744,"startTime":1442857215849,"outcome_guid":"666533f1-148b-4d55-aad9-971263bed104"},{"id":"6603","confidenceLevel":"Very Sure","timeSpent":1872,"startTime":1442857217593,"outcome_guid":"666533f1-148b-4d55-aad9-971263bed104"},{"id":"7114","confidenceLevel":"Just A Guess","timeSpent":1639,"startTime":1442857219465,"outcome_guid":"4f64fa8e-3d03-4be9-b9f4-494ee54a8cf5"},{"id":"4188","confidenceLevel":"Pretty Sure","timeSpent":1552,"startTime":1442857221104,"outcome_guid":"4f64fa8e-3d03-4be9-b9f4-494ee54a8cf5"},{"id":"8281","confidenceLevel":"Very Sure","timeSpent":1785,"startTime":1442857222656,"outcome_guid":"04b78a88-521d-4da1-b074-5dfe612d32be"},{"id":"7264","confidenceLevel":"Just A Guess","timeSpent":1831,"startTime":1442857224441,"outcome_guid":"04b78a88-521d-4da1-b074-5dfe612d32be"},{"id":"1892","confidenceLevel":"Very Sure","timeSpent":2216,"startTime":1442857226272,"outcome_guid":"bf5da1c4-dc5c-44ab-bcc0-52ef2179b024"},{"id":"189","confidenceLevel":"Pretty Sure","timeSpent":6722,"startTime":1442857228488,"outcome_guid":"bf5da1c4-dc5c-44ab-bcc0-52ef2179b024"}],"answers":[["2801"],["1576"],["4357"],["5582"],["2712"],["3801"],["2988"],["4216"],["9"],["1054"],["6114"],["1561"]],"assessmentId":"140","identifier":"i6b0e7b0448284dedb6bf426627bfb5eb_summative","settings":{"externalUserId":"1d59ddbce40747fd7c9664c7c08e24017b8b734c","userAttempts":65,"srcUrl":"http://localhost:3001/api/assessments/140.xml","lisResultSourceDid":"","lisOutcomeServiceUrl":"https://lumen.instructure.com/api/lti/v1/tools/24481/grade_passback","lisUserId":"1d59ddbce40747fd7c9664c7c08e24017b8b734c","isLti":true,"ltiRole":"admin","assessmentKind":"summative","accountId":"1"}},"controller":"api/grades","action":"create","grade":{"itemToGrade":{"questions":[{"id":"6832","confidenceLevel":"Just A Guess","timeSpent":2363,"startTime":1442857207791,"outcome_guid":"5e567170-4a58-4cda-9e8d-be04c46f0b53"},{"id":"322","confidenceLevel":"Pretty Sure","timeSpent":2183,"startTime":1442857210154,"outcome_guid":"5e567170-4a58-4cda-9e8d-be04c46f0b53"},{"id":"1629","confidenceLevel":"Very Sure","timeSpent":1784,"startTime":1442857212337,"outcome_guid":"d89c6da2-c2f8-439f-8e17-953c2f9cedd0"},{"id":"4756","confidenceLevel":"Just A Guess","timeSpent":1728,"startTime":1442857214121,"outcome_guid":"d89c6da2-c2f8-439f-8e17-953c2f9cedd0"},{"id":"101","confidenceLevel":"Pretty Sure","timeSpent":1744,"startTime":1442857215849,"outcome_guid":"666533f1-148b-4d55-aad9-971263bed104"},{"id":"6603","confidenceLevel":"Very Sure","timeSpent":1872,"startTime":1442857217593,"outcome_guid":"666533f1-148b-4d55-aad9-971263bed104"},{"id":"7114","confidenceLevel":"Just A Guess","timeSpent":1639,"startTime":1442857219465,"outcome_guid":"4f64fa8e-3d03-4be9-b9f4-494ee54a8cf5"},{"id":"4188","confidenceLevel":"Pretty Sure","timeSpent":1552,"startTime":1442857221104,"outcome_guid":"4f64fa8e-3d03-4be9-b9f4-494ee54a8cf5"},{"id":"8281","confidenceLevel":"Very Sure","timeSpent":1785,"startTime":1442857222656,"outcome_guid":"04b78a88-521d-4da1-b074-5dfe612d32be"},{"id":"7264","confidenceLevel":"Just A Guess","timeSpent":1831,"startTime":1442857224441,"outcome_guid":"04b78a88-521d-4da1-b074-5dfe612d32be"},{"id":"1892","confidenceLevel":"Very Sure","timeSpent":2216,"startTime":1442857226272,"outcome_guid":"bf5da1c4-dc5c-44ab-bcc0-52ef2179b024"},{"id":"189","confidenceLevel":"Pretty Sure","timeSpent":6722,"startTime":1442857228488,"outcome_guid":"bf5da1c4-dc5c-44ab-bcc0-52ef2179b024"}],"answers":[["2801"],["1576"],["4357"],["5582"],["2712"],["3801"],["2988"],["4216"],["9"],["1054"],["6114"],["1561"]],"assessmentId":"140","identifier":"i6b0e7b0448284dedb6bf426627bfb5eb_summative","settings":{"externalUserId":"1d59ddbce40747fd7c9664c7c08e24017b8b734c","userAttempts":65,"srcUrl":"http://localhost:3001/api/assessments/140.xml","lisResultSourceDid":"","lisOutcomeServiceUrl":"https://lumen.instructure.com/api/lti/v1/tools/24481/grade_passback","lisUserId":"1d59ddbce40747fd7c9664c7c08e24017b8b734c","isLti":true,"ltiRole":"admin","assessmentKind":"summative","accountId":"1"}}}},"assessment_results_id":218}
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

