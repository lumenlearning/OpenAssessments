//STORE
'use strict';

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import Utils          from "../utils/utils";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _module = null; //the var that holds the store data.

var EditStore = assign({}, StoreCommon, {
  setStore(data){
    _module = data;
  },

  delOutcome(data){
    var outcomeGuid = data.outcome.guid;
    var outcomes    = _module.outcomes;

    outcomes.forEach((outcome, index)=>{
      if(outcome.guid === outcomeGuid){
        outcomes.splice(index, 1);
      }
    });
  }

});

Dispatcher.register((payload)=>{
  var action = payload.action;

  switch (action){
    case Constants.EDIT_ASSESSMENT_LOAD:
      EditStore.setStore(payload.data);
      break;

    case Constants.EDIT_ASSESSMENT_DEL_OUTCOME:
      EditStore.delOutcome(payload.data);
      break;
  }

  EditStore.emitChange();

});

export default EditStore;