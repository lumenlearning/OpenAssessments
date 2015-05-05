"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";
export default {

  loadAccounts(){
    Dispatcher.dispatch({action: Constants.ACCOUNTS_LOADING});
    Api.get(Constants.ACCOUNTS_LOADED, "admin/accounts/");
  }

};