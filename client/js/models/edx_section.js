import $ from "jquery";

export default class EdXSection{

  static fromEdX(id, url, res){
    var xml = $(res.text || res.xhr.responseText).find('vertical').addBack('vertical');
    return {
      'id': id,
      'url': url,
      'standard': 'edX',
      'xml': xml
    }
  }
}

