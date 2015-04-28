"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";

export default {

  loadAssessment(settings){
    
    Dispatcher.dispatch({ action: Constants.ASSESSMENT_LOAD_PENDING });

    if(settings.offline && settings.srcData){
      Dispatcher.dispatch({ action: Constants.ASSESSMENT_LOADED, data: settings.srcData });
    } else {
      Api.get(settings, Constants.ASSESSMENT_LOADED, settings.srcUrl);
    }
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
        src_url          : srcUrl
      }
    };
    Api.post(settings, Constants.ASSESSMENT_VIEWED, '/api/assessment_results', body);
  }
  
};