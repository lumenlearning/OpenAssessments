import EdX from "./edx";
import $   from "jquery";

export default class EdXItem{

  static fromEdX(id, url, xml){
    xml = $(xml.text).find('problem').addBack('problem');
    if(xml.length > 0){
      var item = {
        id       : id,
        url      : url,
        title    : xml.attr('display_name'),
        xml      : xml,
        standard : 'edX',
        material : xml.find('choicegroup').attr('label'),
        answers  : [] 
      };
      item.answers = EdXItem.parseAnswers(xml);
      item.question_type = EdX.questionType(xml);

      return item;
    } else {
      return null;
    }
  }

  static parseAnswers(xml){
    var answers = xml.find('choice').map((index, item) => {
      return {
        id       : index,
        material : item.textContent,
        xml      : item,
        correct  : item.getAttribute("correct")
      };
    });
    return answers;
  }

}
