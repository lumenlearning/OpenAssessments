"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";
export default {

  loadUserAssessments(contextId, assessmentId){
    Dispatcher.dispatch({action: Constants.USER_ASSESSMENTS_LOADING, payload: contextId});
    Api.get(Constants.USER_ASSESSMENTS_LOADED, "api/user_assessments?context_id=" + contextId + "&assessment_id=" + assessmentId);
  },

  updateUserAssessment(id, payload){
    Dispatcher.dispatch({action: Constants.USER_ASSESSMENTS_UPDATING});
    Api.put(Constants.USER_ASSESSMENTS_UPDATED, "api/user_assessments/" + id + "/update_attempts", payload);
  },

};