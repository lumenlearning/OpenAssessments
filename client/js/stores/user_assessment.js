"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import _              from "lodash";

var _user_assessments = [];
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

// Extend User Store with EventEmitter to add eventing capabilities
var UserAssessmentStore = assign({}, StoreCommon, {

  // Return the accounts
  current(){
    return _user_assessments;
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

