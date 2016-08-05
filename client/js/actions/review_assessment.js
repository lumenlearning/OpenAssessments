"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";
import ReviewAssessmentStore    from "../stores/review_assessment";

export default {

  loadAssessment(settings, assessmentId=null, forEdit=false){
    Dispatcher.dispatch({ action: Constants.REVIEW_ASSESSMENT_LOAD_PENDING });
    var url = null;

    if(settings.srcUrl){
      url = settings.srcUrl;
    } else if(assessmentId) {
      url = settings.apiUrl + "api/assessments/" + assessmentId + ".xml";
    }

    let param = forEdit ? "for_edit" : "for_review";
    if(url.indexOf("?") > -1) {
      url = url+ "&" + param + "=1";
    } else {
      url = url+ "?" + param + "=1";
    }
    Api.get(Constants.REVIEW_ASSESSMENT_LOADED, url);
  },

  loadAssessmentResult(assessmentId, resultId){
    Dispatcher.dispatch({ action: Constants.REVIEW_RESULT_LOAD_PENDING });
    Api.get(Constants.REVIEW_RESULT_LOADED, "/api/assessments/" + assessmentId + "/results/" + resultId);
  },

  addAssessmentQuestion(question, location){
    Dispatcher.dispatch({action: Constants.ADD_ASSSESSMENT_QUESTION, data: question, location: location});
  },

  updateAssessmentQuestion(question){
    Dispatcher.dispatch({action: Constants.UPDATE_ASSESSMENT_QUESTION, data: question});
  },

  deleteAssessmentQuestion(question){
    Dispatcher.dispatch({action: Constants.DELETE_ASSESSMENT_QUESTION, data: question});
  },

  startEditingQuestion(question){
    Dispatcher.dispatch({action: Constants.START_EDITING_QUESTION, data: question});
  },

  stopEditingQuestion(question){
    Dispatcher.dispatch({action: Constants.STOP_EDITING_QUESTION, data: question});
  },

  saveAssessment(assessment){
    // Only return the relevant item and answer information.
    let items = ReviewAssessmentStore.allQuestions().map(function(item){
      let answers = item.answers.map(function(ans){
        return {
          id: ans.id,
          material: ans.material,
          isCorrect: ans.isCorrect
        }
      });
      return {
        id: item.id,
        title: item.title,
        question_type: item.question_type,
        material: item.material,
        answers: answers,
        //correct: item.correct,
        outcome: item.outcome,
        mom_embed: item.momEmbed
      }
    });

    let updateParams = {
      assessment: {
        title: assessment.title,
        ident: assessment.id,
        assessmentId: assessment.assessmentId,
        standard: assessment.standard,
        items: items
      }
    };

    Api.put(Constants.SAVE_ASSESSMENT, 'api/assessments/' + assessment.assessmentId + '/edit', updateParams);
  }

};
