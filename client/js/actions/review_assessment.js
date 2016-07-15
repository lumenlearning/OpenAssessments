"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";

export default {

  loadAssessment(settings){
    Dispatcher.dispatch({ action: Constants.REVIEW_ASSESSMENT_LOAD_PENDING });
    console.log("SRC URL:", settings.srcUrl);
    var url = settings.srcUrl;
    if(url.indexOf("?") > -1) {
      url = url+ "&for_review=1"
    } else {
      url = url+ "?for_review=1"
    }
    Api.get(Constants.REVIEW_ASSESSMENT_LOADED, url);
  },

  loadAssessmentResult(assessmentId, resultId){
    Dispatcher.dispatch({ action: Constants.REVIEW_RESULT_LOAD_PENDING });
    Api.get(Constants.REVIEW_RESULT_LOADED, "/api/assessments/" + assessmentId + "/results/" + resultId);
  },

  addAssessmentQuestion(question){
    Dispatcher.dispatch({action: Constants.ADD_ASSSESSMENT_QUESTION, data: question});
  },

  updateAssessmentQuestion(question){
    Dispatcher.dispatch({action: Constants.UPDATE_ASSESSMENT_QUESTION, data: question});
  },

  saveAssessment(assessment){
    var saveAsessmentUrl = '';
    Api.put(Constants.SAVE_ASSESSMENT, saveAsessmentUrl, assessment)
  }

};

let AssessmentSchema = {
  answers: [
    {
      id: '',
      matchMaterial: 'the question that is correct',
      material: 'the question that is associated with ID key'
    },
    //{...}
  ],
  correct: [
    {
      id: '',
      value: '100' //???
    }
  ],
  assessmentId: '',
  id: '',
  material: 'This is the question field',
  objectives: {}, // ??,
  outcome_guid: '',
  outcome_long_title: '',
  outcome_short_title: '',
  outcomes:{},
  question_type: 'multiple_answers_selection',
  timeSpent: 0,
  title: ''
}