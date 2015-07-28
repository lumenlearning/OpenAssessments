"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import QueryString    from '../utils/query_string';
import Utils          from '../utils/utils';
import $              from 'jquery';

var _settings = {};
var _errors = {};

function srcData(){
  var data = $('#srcData').html();
  if(data === undefined){
    return null;
  }
  var result = Utils.htmlDecodeWithRoot(data);
  if($(result).length == 1){ // We ended up with an empty <root> element. Try returning the raw result
    result = data;
  }
  result = result.trim();
  result = result.replace('<![CDATA[', '');
  result = result.replace('<!--[CDATA[', '');
  if(result.slice(-3) == ']]>'){
    result = result.slice(0,-3);
  }
  return result;
}

function loadSettings(defaultSettings){
  _errors = {};

  defaultSettings = defaultSettings || {};
  var bestValue = function(settings_prop, params_prop, default_prop){
    return defaultSettings[settings_prop] || QueryString.params()[params_prop] || default_prop;
  };

  var jwt = (defaultSettings.jwt && defaultSettings.jwt.length) ? defaultSettings.jwt : null;
  if(jwt!==null) {
    localStorage.setItem('jwt', jwt);
  } else {
    localStorage.removeItem('jwt');
  }

    var enableStart = bestValue('enableStart', 'enable_start', false);
    enableStart = (enableStart == true || enableStart == 'true');

  _settings = {
    apiUrl             : bestValue('apiUrl', 'api_url', '/'),
    srcUrl             : bestValue('srcUrl', 'src_url'),
    srcData            : srcData(), 
    offline            : bestValue('offline', 'offline', false),
    assessmentId       : bestValue('assessmentId', 'assessment_id'),
    eId                : bestValue('eId', 'eid'),
    kind               : bestValue('kind', 'kind', 'formative'),
    externalUserId     : bestValue('externalUserId', 'external_user_id'),
    keywords           : bestValue('keywords', 'keywords'),
    resultsEndPoint    : bestValue('resultsEndPoint', 'results_end_point', 'http  ://localhost  :4200/api'),
    confidenceLevels   : bestValue('confidenceLevels', 'confidence_levels', false),
    enableStart        : enableStart,
    style              : bestValue('style', 'style', null),
    perSec             : parseInt(defaultSettings.per_sec),
    csrfToken          : defaultSettings.csrfToken || null,
    allowedAttempts    : defaultSettings.allowed_attempts,
    userAttempts       : bestValue("user_attempts","userAttempts", 0),
    lisUserId          : defaultSettings.lis_user_id,
    lisResultSourceDid : defaultSettings.lis_result_source_did,
    lisOutcomeServiceUrl: defaultSettings.lis_outcome_service_url,
    isLti              : defaultSettings.isLti,
    assessmentKind     : defaultSettings.assessmentKind
  };

  if(!_settings.srcUrl && !_settings.offline){
    _errors.srcUrl = "No src_url specified: specify a src_url in the url query params.";
  }

}


// Extend Message Store with EventEmitter to add eventing capabilities
var SettingsStore = assign({}, StoreCommon, {

  // Return current messages
  current(){
    return _settings;
  },

  errors(){
    return _errors;
  }

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {

  switch(payload.action){

    case Constants.SETTINGS_LOAD:
      loadSettings(payload.data);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  SettingsStore.emitChange();

  return true;

});

export default SettingsStore;

