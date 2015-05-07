"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";
export default {

  loadAccounts(){
    Dispatcher.dispatch({action: Constants.ACCOUNTS_LOADING});
    Api.get(Constants.ACCOUNTS_LOADED, "admin/accounts/");
  },

  loadUsers(accountId, page){
    if(!page){
      page = 1;
    }
    var perPage = 100;
    Dispatcher.dispatch({action: Constants.USERS_LOADING});
    Api.get(Constants.USERS_LOADED, "admin/accounts/" + accountId + "/users?page=" + page + "&per_page=" + perPage);
  },

  changeMainTab(payload){
    Dispatcher.dispatch({ action: Constants.CHANGE_MAIN_TAB_PENDING, mainTab: payload.text });
  },

  getUserData(payload){
    Dispatcher.dispatch({action: Constants.LOADING_USER_DATA, userList: payload.userList});
  },

  setCurrentSelectedUser(payload){
    Dispatcher.dispatch({action: Constants.LOADING_SELECTED_USER_DATA, currentSelectedUser: payload.currentSelectedUser});
  },

  updateUser(accountID, userID, payload){
    Dispatcher.dispatch({action: Constants.USER_UPDATING});
    Api.put(Constants.USER_UPDATED, "admin/accounts/"+ accountID + "/users/"+userID+ "?user[name]=" + payload.newName + "&user[email]=" + payload.newEmail + "&user[role]" + payload.newRole);
  },

  deleteUser(){

  }, 

};