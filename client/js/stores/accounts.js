"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _accounts = [];
var _users = [];

function loadAccounts(data){
  //console.log(data);
  var accountList = JSON.parse(data);
  // translates the data into a format material ui can understand;
  for(var i=0; i< accountList.length; i++){
    var s = "" + i;
    _accounts[i] = {payload: s, text: accountList[i].name, id: accountList[i].id };
  }
}

function loadUsers(data){
  console.log("DO I GET CALLED");
  var userList = JSON.parse(data);
  // translates the data into a format material ui can understand;
  for(var i=0; i< userList.length; i++){
    var s = "" + i;
    _users[i] = {payload: s, text: userList[i].name};
  }
}

// Extend User Store with EventEmitter to add eventing capabilities
var AccountsStore = assign({}, StoreCommon, {

  // Return current user
  currentAccounts(){
    return _accounts;
  },
  currentUsers(){
    return _users;
  }

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action){

    case Constants.ACCOUNTS_LOADED:
      //console.log(payload.data);
      loadAccounts(payload.data.text);
      break;
    case Constants.USERS_LOADED:
      console.log(payload.data);
      loadUsers(payload.data.text);
    break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  AccountsStore.emitChange();

  return true;

});

export default AccountsStore;

