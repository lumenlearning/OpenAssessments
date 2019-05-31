//ACTIONS
"use strict";

import Constants   from   "../constants";
import Api         from   "./api";
import Dispatcher  from   "../dispatcher";

export default {
  loadQuizQuestions(outcomeGuid, bank_type){
    var url = `/outcome/${outcomeGuid}/`
    Api.get();
  },

  updateQuizQuestion(outcomeGuid, question){
    Api.put()
  },

  addQuizQuestion(outcomeGuid){
    Api.post()
  },

  delQuizQuestion(outcomeGuid, questionGuid){
    Api.del()
  }

}