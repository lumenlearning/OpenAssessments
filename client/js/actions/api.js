"use strict";

import Request      from "superagent";
import User         from "../stores/user";
import Constants    from "../constants";
import Dispatcher   from "../dispatcher";

const TIMEOUT = 10000;

var _pendingRequests = {};

function abortPendingRequests(key) {
  if(_pendingRequests[key]) {
    _pendingRequests[key]._callback = function() {};
    _pendingRequests[key].abort();
    _pendingRequests[key] = null;
  }
}

// Get the access token from the user
function token() {
  return User.token();
}

function makeUrl(settings, part) {
  if(part.indexOf("http") >= 0){
    return part;
  } else {
    return settings.apiUrl + part;
  }
}

// GET request with a token param
function get(url) {
  return Request
    .get(url)
    .timeout(TIMEOUT)
    .set('Accept', 'application/json')
    .query({
      authtoken: token()
    });
}

// POST request with a token param
function post(url, body) {
  return Request
    .post(url)
    .send(body)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .query({
      authtoken: token()
    });
}

function dispatch(settings, key, response) {
  Dispatcher.dispatch({
    action: key,
    data: response,
    settings: settings
  });
}

// Dispatch a response based on the server response
function dispatchResponse(settings, key) {
  return function(err, response) {
    if(err && err.timeout === TIMEOUT) {
      dispatch(settings, Constants.TIMEOUT, response);
    } else if(response.status === 400) {
      dispatch(settings, Constants.NOT_AUTHORIZED, response);
    } else if(!response.ok) {
      dispatch(settings, Constants.ERROR, response);
    } else {
      dispatch(settings, key, response);
    }
  };
}

function doRequest(settings, key, url, callback){
  abortPendingRequests(key);
  var request = _pendingRequests[key] = callback(makeUrl(settings, url));
  request.end(dispatchResponse(settings, key));
  return request;
}

export default {

  get(settings, key, url){
    return doRequest(settings, key, url, function(fullUrl){
      return get(fullUrl);
    });
  },

  post(settings, key, url, body){
    return doRequest(settings, key, url, function(fullUrl){
      return post(fullUrl, body);
    });
  }

};
