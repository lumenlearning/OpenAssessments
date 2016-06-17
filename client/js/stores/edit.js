//STORE
'use strict';

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import Utils          from "../utils/utils";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _module = null; //the var that holds the store data.

var EditStore = assign({}, StoreCommon, {

});

Dispatcher.register((payload)=>{
  var action = payload.action;

  switch (action){
    case Constants.EDIT_QUIZ_LOAD:

    break;
  }

});

export default EditStore;