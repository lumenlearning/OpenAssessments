"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import _              from "lodash";

var _accounts = [];
var _users = [];

function loadAccounts(data){
  //console.log(data);
  _accounts = JSON.parse(data);
  // translates the data into a format material ui can understand;
 
}

function loadUsers(data){
  _users = JSON.parse(data);
}

// Extend User Store with EventEmitter to add eventing capabilities
var AccountsStore = assign({}, StoreCommon, {

  // Return the accounts
  current(){
    return _accounts;
  },

  // Return current users
  currentUsers(){
    return _users;
  },
  
  accountById(id){
    var account =  _.find(_accounts, function(account){
      return account.id == id;
    });
    //debugger;
  return account;
  }

});
 
// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action){

    case Constants.ACCOUNTS_LOADED:
      loadAccounts(payload.data.text);

      break;
    case Constants.USERS_LOADED:
      loadUsers(payload.data.text);

      break;
    case Constants.USERS_UPDATED:
      // UPDATE THE USERS LIST AND SUCH
      console.log(payload.data.text);
      break;
    case Constants.RESET_USERS:
      // reset the users list to prepare for a different account
      _users = [];
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  AccountsStore.emitChange();
  
  return true;

});

export default AccountsStore;

