"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import Assessment     from "../models/assessment";

var _assessment = null;
var _assessmentIsLoading = false;

// Extend User Store with EventEmitter to add eventing capabilities
var AssessmentStore = assign({}, StoreCommon, {

  current(){
    return _assessment;
  },

  isLoading(){
    return _assessmentIsLoading;
  }

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action){

    // Respond to ASSESSMENT_LOAD_PENDING action
    case Constants.ASSESSMENT_LOAD_PENDING:
      _assessmentIsLoading = true;
      break;

    // Respond to ASSESSMENT_LOADED action
    case Constants.ASSESSMENT_LOADED:
      _assessmentIsLoading = false;
      _assessment = Assessment.parseAssessment(payload.settings, payload.data.text);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  AssessmentStore.emitChange();

  return true;

});


export default AssessmentStore;

