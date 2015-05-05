"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";
export default {

  changeMainTab(payload){
    Dispatcher.dispatch({ action: Constants.CHANGE_MAIN_TAB_PENDING, mainTab: payload.text });
  },

  getUserData(payload){
    Dispatcher.dispatch({action: Constants.LOADING_USER_DATA, userList: payload.userList});
  },

  getCurrentSelectedUser(payload){
    console.log(payload.currentSelectedUser);
    Dispatcher.dispatch({action: Constants.LOADING_SELECTED_USER_DATA, currentSelectedUser: payload.currentSelectedUser});
  }

};