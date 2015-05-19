"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _user = {};

// log the user in
function login(payload){
  _user.email = payload.data.body.email;
  _user.loggedIn = true;
  _user.displayName = payload.data.body.displayName;
  // We get a JWT back.
  var jwt = payload.data.body.jwt_token;
  localStorage.setItem('jwt', jwt);
}

// Register
function register(user){
  _user.email = user.email;
  _user.loggedIn = true;
  _user.displayName = user.displayName;
}

function loadUserFromSettings(payload) {
  _user.email = payload.data.email;
  _user.loggedIn = payload.data.loggedIn;
  _user.displayName = payload.data.displayName;
}

// Extend User Store with EventEmitter to add eventing capabilities
var UserStore = assign({}, StoreCommon, {

  // Return current user
  current(){
    return _user;
  },

  loggedIn(){
    return _user.loggedIn;
  },

  jwt(){
    return localStorage.getItem('jwt');
  },

});

// Register callback with Dispatcher
Dispatcher.register((payload) => {
  var action = payload.action;

  switch(action){

    // Respond to LOGIN action
    case Constants.LOGIN:
      login(payload);
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

