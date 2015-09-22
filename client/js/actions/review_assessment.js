"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";

export default {

  loadAssessment(settings){
    Dispatcher.dispatch({ action: Constants.REVIEW_ASSESSMENT_LOAD_PENDING });
    Api.get(Constants.REVIEW_ASSESSMENT_LOADED, settings.srcUrl + "?for_review=1");
  },

  loadAssessmentResult(assessmentId, resultId){
    Dispatcher.dispatch({ action: Constants.REVIEW_RESULT_LOAD_PENDING });
    Api.get(Constants.REVIEW_RESULT_LOADED, "/api/assessments/" + assessmentId + "/results/" + resultId);
  }

};