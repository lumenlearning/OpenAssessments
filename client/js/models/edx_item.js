import EdX from "./edx";
import $   from "jquery";

export default class EdXItem{

  static fromEdX(id, url, xml){
    xml = $(xml.text).find('problem').addBack('problem');
    if(xml.length > 0){
      var attrs = {
        'id': id,
        'url': url,
        'title': xml.attr('display_name'),
        'xml': xml,
        'standard': 'edX'
      };

      attrs.question_type = EdX.questionType(xml);

      return attrs;
    } else {
      return null;
    }
  }

}
