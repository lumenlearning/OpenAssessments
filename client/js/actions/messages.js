"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";

export default {

  addMessage(message){
    Dispatcher.dispatch({ 
      action: Constants.ADD_MESSAGE,
      data: message
    });
  }

};