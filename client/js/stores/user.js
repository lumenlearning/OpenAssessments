"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _user = {};

// log the user in
function login(email, password){
  return true;
}

// Register
function register(user){
  return true; 
}

// Extend User Store with EventEmitter to add eventing capabilities
var UserStore = assign({}, StoreCommon, {

  // Return current user
  current(){
    return _user;
  },

  loggedIn(){
    return _user.email !== undefined;
  },

  token(){
    return _user.token;
  }

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action){

    // Respond to LOGIN action
    case Constants.LOGIN:
      login(payload.email, payload.password);
      break;

    // Respond to REGISTER action
    case Constants.REGISTER:
      register(payload.user);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  UserStore.emitChange();

  return true;

});

export default UserStore;

