"use strict";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _jwt = null;
var _canUseLocal = null;

function canUseLocalStorage() {
  if( _canUseLocal !== null ) return _canUseLocal;

  try {
    localStorage.setItem('oea', 'oea');
    localStorage.removeItem('oea');
    _canUseLocal = true;
  } catch (e) {
    _canUseLocal = false;
  }

  return _canUseLocal;
}

// Extend User Store with EventEmitter to add eventing capabilities
var SessionStore = assign({}, StoreCommon, {

  setJwt(jwt){
    if (canUseLocalStorage()) {
      localStorage.setItem('jwt', jwt);
    } else {
      _jwt = jwt;
    }
  },

  getJwt() {
    if (canUseLocalStorage()) {
      return localStorage.getItem('jwt');
    } else {
      return _jwt;
    }
  },

  clearJwt() {
    if (canUseLocalStorage()) {
      localStorage.removeItem('jwt');
    } else {
      _jwt = null;
    }
  }
});

export default SessionStore;

