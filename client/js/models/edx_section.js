import $ from "jquery";

export default class EdXSection{

  static fromEdX(id, url, xml){
    xml = $(xml.text).find('vertical').addBack('vertical');
    return {
      'id': id,
      'url': url,
      'standard': 'edX',
      'xml': xml
    }
  }
}

