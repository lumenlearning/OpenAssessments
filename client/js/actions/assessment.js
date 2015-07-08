"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";

export default {

  loadAssessment(settings, srcData){
    
    if(srcData){
      srcData = srcData.trim();
      if(srcData.length > 0){
        Dispatcher.dispatch({ 
          action: Constants.ASSESSMENT_LOADED,
          settings: settings,
          data: {
            text: srcData
          }
        });
        return;
      }
    }

    Dispatcher.dispatch({ action: Constants.ASSESSMENT_LOAD_PENDING });
    Api.get(Constants.ASSESSMENT_LOADED, settings.srcUrl);
  },

  start(eid, assessmentId){
    Dispatcher.dispatch({action: Constants.ASSESSMENT_START})
    Api.put(Constants.ASSESSMENT_START, "/api/user_assessments/"+eid, {assessmentId: assessmentId})
  },

  edXLoadSection(section){
    Dispatcher.dispatch({action: Constants.EDX_LOAD_SECTION, section: section});
  },

  clearStore(){
    Dispatcher.dispatch({action: Constants.CLEAR_STORE});
  },

  edXLoadItem(item){
    Dispatcher.dispatch({action: Constants.EDX_LOAD_ITEM, item: item});
  },

  edXLoadAssessment(assessment){
    Dispatcher.dispatch({action: Constants.EDX_LOAD_ASSESSMENT, assessment: assessment});
  },

  answerSelected(item){
    Dispatcher.dispatch({action: Constants.ANSWER_SELECTED, item: item});
  },

  checkAnswer(){
    Dispatcher.dispatch({ action: Constants.ASSESSMENT_CHECK_ANSWER });
  },

  selectConfidenceLevel(level){
    Dispatcher.dispatch({action: Constants.LEVEL_SELECTED, level: level});
  },
  
  submitAssessment(identifier, assessmentId, questions, studentAnswers, settings){
    Dispatcher.dispatch({action: Constants.ASSESSMENT_SUBMITTED})
    var body = {
      itemToGrade: {
        questions    : questions,
        answers      : studentAnswers,
        assessmentId : assessmentId,
        identifier   : identifier,
        settings     : settings
      }
    }
    Api.post(Constants.ASSESSMENT_GRADED,'/api/grades', body);
  },

  nextQuestion(){
    Dispatcher.dispatch({ action: Constants.ASSESSMENT_NEXT_QUESTION });
  },

  previousQuestion(){
    Dispatcher.dispatch({ action: Constants.ASSESSMENT_PREVIOUS_QUESTION });
  },
  
  assessmentViewed(settings, assessment){
    var body = {
      assessment_result : {
        offline          : settings.offline,
        assessment_id    : settings.assessmentId,
        identifier       : assessment.id,
        eId              : settings.eId,
        external_user_id : settings.externalUserId,
        resultsEndPoint  : settings.resultsEndPoint,
        keywords         : settings.keywords,
        objectives       : assessment.objectives,
        src_url          : settings.srcUrl
      }
    };
    Api.post(Constants.ASSESSMENT_VIEWED, '/api/assessment_results', body);
  },

  itemViewed(settings, assessment, assessment_result){
    var body = {
      item_result : {
        offline              : settings.offline,
        assessment_result_id : assessment_result.id,
        assessment_id        : settings.assessmentId,
        identifier           : assessment.id,
        eId                  : settings.eId,
        external_user_id     : settings.externalUserId,
        resultsEndPoint      : settings.resultsEndPoint,
        keywords             : settings.keywords,
        objectives           : assessment.objectives,
        src_url              : settings.srcUrl
      }
    };
    Api.post(Constants.ASSESSMENT_VIEWED, '/api/item_results', body);
  }
  
};