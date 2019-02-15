"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import _              from "lodash";

var _user_assessments = [];
var _user_attempts = [];
var _currentContextId = null;

function loadUserAssessments(data){
  _user_assessments = JSON.parse(data);
}

function updateUserAssessment(data){
  var ua = JSON.parse(data);
  var index = _.findIndex(_user_assessments, 'id', ua.id);
  if(index > -1){
    _user_assessments[index] = ua;
  }
}

function loadUserAttempts(data){
  let json_data = JSON.parse(data);

  if (json_data.attempts) {
    _user_attempts = json_data.attempts;
  }
}

// Extend User Store with EventEmitter to add eventing capabilities
var UserAssessmentStore = assign({}, StoreCommon, {

  // Return the accounts
  current(){
    return _user_assessments;
  },

  currentAttempts(){
    return _user_attempts;
  },

  userAssessmentById(id){
    return _.find(_user_assessments, function (ua) {
      return ua.id == id;
    });
  },

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;

  switch(action){

    case Constants.USER_ASSESSMENTS_LOADED:
      loadUserAssessments(payload.data.text);

      break;
    case Constants.USER_ATTEMPTS_LOADED:
      loadUserAttempts(payload.data.text);

      break;
    case Constants.USER_ASSESSMENTS_UPDATED:
      updateUserAssessment(payload.data.text);

      break;
    case Constants.USER_ASSESSMENTS_LOADING:

      _currentContextId = payload.payload;
      break;

    default:
      return true;
  }
  // If action was responded to, emit change event
  UserAssessmentStore.emitChange();

  return true;

});

export default UserAssessmentStore;
