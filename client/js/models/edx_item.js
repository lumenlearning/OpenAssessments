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
      item.question_type = EdX.questionType(xml);
      item.answers = EdXItem.parseAnswers(xml, item.question_type);

      return item;
    } else {
      return null;
    }
  }

  static parseAnswers(xml, questionType){
    var answers;
    if(questionType == "edx_numerical_input"){
      // TODO implement numerical input answers
      
      answers = xml.find('numericalresponse').map((index, item) => {
        return {
          id       : index,
          material : item.getElementsByTagName("formulaequationinput")[0].getAttribute("label"),
          xml      : item,
          correct  : item.getAttribute("answer") 
        };
      });
    } else if (questionType == "edx_multiple_choice"){
      answers = xml.find('choice').map((index, item) => {
        return {
          id       : index,
          material : item.textContent,
          xml      : item,
          correct  : item.getAttribute("correct")
        };
      });
    } else if(questionType == "edx_dropdown"){

    } else if(questionType == "edx_text_input"){
      
    } else if(questionType == "edx_drag_and_drop"){
      
    }
    return answers;
  }

}
