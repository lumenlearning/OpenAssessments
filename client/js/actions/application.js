"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";

export default {

  changeMainTab(payload){
    Dispatcher.dispatch({ action: Constants.CHANGE_MAIN_TAB_PENDING, mainTab: payload.text });
  },

  getClientData(payload){
    Dispatcher.dispatch({action: Constants.LOADING_CLIENT_DATA, clientList: payload.clientList});
  },

  getUserData(payload){
    Dispatcher.dispatch({action: Constants.LOADING_USER_DATA, userList: payload.userList});
  }

};