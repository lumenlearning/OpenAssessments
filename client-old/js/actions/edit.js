//ACTIONS
"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";

export default {
  getQuizQuestions(){
    Api.get(Constants.EDIT_ASSESSMENT_LOAD)
  },

  delOutcome(outcomeGuid){
    var apiURL = `/outcomes/${outcomeGuid}`;
    Api.put(Constants.EDIT_ASSESSMENT_DEL_OUTCOME, apiURL);
  }

}
