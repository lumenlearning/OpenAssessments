import QueryString    from './query_string';
import Utils          from './utils';
import $              from 'jquery';

function srcData(){
  var data = $('#srcData').html();
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

function bestValue(settings_prop, params_prop, default_prop){
	var globals = {};
	if(window.OEA_SETTINGS){
		globals = window.OEA_SETTINGS;
	}
  return globals[settings_prop] || QueryString.params()[params_prop] || default_prop;
}

export default {

  load(){

    var style = bestValue('style', 'style', null);
    if(style && style.indexOf('.css') < 0){
      style = '/assets/themes/' + style + '.css?body=1';
      $('head').append('<link href="' + style + '" media="all" rel="stylesheet">');
    }
        
    var settings = {
      apiUrl: bestValue('apiUrl', 'api_url', '/'),
      srcUrl: bestValue('srcUrl', 'src_url'),
      srcData: srcData,
      offline: bestValue('offline', 'offline', false),
      assessmentId: bestValue('assessmentId', 'assessment_id'),
      eId: bestValue('eId', 'eid'),
      externalUserId: bestValue('externalUserId', 'external_user_id'),
      keywords: bestValue('keywords', 'keywords'),
      resultsEndPoint: bestValue('resultsEndPoint', 'results_end_point', 'http://localhost:4200/api'),
      confidenceLevels: bestValue('confidenceLevels', 'confidence_levels', false),
      enableStart: bestValue('enableStart', 'enable_start', false),
      style: style
    };

    if(!settings.srcUrl && !settings.offline){
      throw new Error("No src_url specified: specify a src_url in the url query params.");
    }

    return settings;
  }

}