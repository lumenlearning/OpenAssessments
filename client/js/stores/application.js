"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

let _application = {};

// Extend Application Store with EventEmitter to add eventing capabilities
let ApplicationStore = assign({}, StoreCommon, {

  // Return current tab
  currentMainTab(){
    return _application.mainTab;
  }

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  let action = payload.action;
  
  switch(action){

    case Constants.CHANGE_MAIN_TAB_PENDING:
      _application.mainTab = payload.mainTab
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  ApplicationStore.emitChange();

  return true;

});

export default ApplicationStore;

