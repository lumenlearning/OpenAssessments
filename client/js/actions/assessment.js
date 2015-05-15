"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";

export default {

  loadLocalAssessment(settings, srcData){
    Dispatcher.dispatch({ 
      action: Constants.ASSESSMENT_LOADED,
      settings: settings,
      data: {
        text: srcData
      }
    });
  },

  loadAssessment(srcUrl){
    Dispatcher.dispatch({ action: Constants.ASSESSMENT_LOAD_PENDING });
    Api.get(settings, Constants.ASSESSMENT_LOADED, srcUrl);
  },

  assessmentViewed(settings, srcUrl, assessment){
    return;
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
        src_url          : srcUrl
      }
    };
    Api.post(settings, Constants.ASSESSMENT_VIEWED, '/api/assessment_results', body);
  }
  
};