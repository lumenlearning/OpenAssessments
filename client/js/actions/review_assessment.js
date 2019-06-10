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

  loadAssessmentForStudentReview(settings, assessmentId, userAssessmentId){
    Dispatcher.dispatch({ action: Constants.REVIEW_ASSESSMENT_LOAD_PENDING });
    Api.get(Constants.REVIEW_ATTEMPTED_ASSESSMENTS_LOADED, `api/assessments/${assessmentId}/student_review?uaid=${userAssessmentId}`);
  },

  loadAssessmentXmlForReview(settings, assessmentId, resultId=null){
    Dispatcher.dispatch({ action: Constants.REVIEW_ASSESSMENT_LOAD_PENDING });
    var url = settings.apiUrl + "api/assessments/" + assessmentId + "/review";

    if(resultId){
      url = url + "?assessment_result_id=" + resultId;
    }

    Api.get(Constants.REVIEW_ASSESSMENT_LOADED, url);
  },

  loadAssessmentXmlForStudentReview(settings, assessmentId, resultId=null){
    Dispatcher.dispatch({ action: Constants.REVIEW_ASSESSMENT_LOAD_PENDING });
    var url = settings.apiUrl + "api/assessments/" + assessmentId + "/student_review_xml";

    if(resultId){
      url = url + "?assessment_result_id=" + resultId;
      Dispatcher.dispatch({ action: Constants.CHECK_ASSESSMENT_XML, resultId });
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

  addNewAssessmentQuestion(location="top"){
    let question = {
      id: `newQuestion-${((Math.random() * 100) * (Math.random() * 100))}`, //specifies new and has random num.
      title: 'New Question',
      edited: true,
      inDraft: true,
      isValid: false,
      isNew: true,
      question_type: null,
      material: '',
      //answers: [ReviewAssessmentStore.blankNewAnswer(), ReviewAssessmentStore.blankNewAnswer(), ReviewAssessmentStore.blankNewAnswer()],
      errorMessages: [],
      outcome: '',
      skill: ''
    };
    Dispatcher.dispatch({action: Constants.ADD_ASSSESSMENT_QUESTION, data: question, location: location});
  },

  updateAssessmentQuestion(question, validate=true){
    Dispatcher.dispatch({action: Constants.UPDATE_ASSESSMENT_QUESTION, data: question, validate: validate});
  },

  deleteAssessmentQuestion(question){
    Dispatcher.dispatch({action: Constants.DELETE_ASSESSMENT_QUESTION, data: question});
  },

  startEditingQuestion(question){
    Dispatcher.dispatch({action: Constants.START_EDITING_QUESTION, data: question});
  },

  cancelEditingQuestion(question){
    Dispatcher.dispatch({action: Constants.CANCEL_EDITING_QUESTION, data: question});
  },

  validateQuestion(question){
    Dispatcher.dispatch({action: Constants.VALIDATE_ASSESSMENT_QUESTION, data: question});
  },

  saveAssessment(assessment){
    // Only return the relevant item and answer information.
    let items = ReviewAssessmentStore.allQuestions().map(function(item){
      let answers = null;
      let dropdowns = null;
      let correct = null;
      let feedback = null;

      switch (item.question_type) {

        case 'multiple_choice_question':
        case 'multiple_answers_question':
          answers = item.answers.map(function(ans){
            return {
              id: ans.id,
              material: ans.material,
              isCorrect: ans.isCorrect,
              feedback: ans.feedback
            }
          });
        break;
        case 'essay_question':
          feedback = item.feedback;
        break;
        case 'multiple_dropdowns_question':
          dropdowns = item.dropdowns;
          correct = item.correct;
          feedback = item.feedback;
        break;
      }

      return {
        id: item.id,
        title: item.title,
        question_type: item.question_type,
        material: item.material,
        answers: answers,
        dropdowns: dropdowns,
        correct: correct,
        outcome: item.outcome,
        skill: item.skill,
        mom_embed: item.momEmbed,
        feedback: feedback
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
