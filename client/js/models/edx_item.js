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
        edXMaterial : "",
        answers  : [],
        isGraded: true 
      };
      item.question_type = EdX.questionType(xml);
      var answers = EdXItem.parseAnswers(xml, item.question_type);
      if(answers)
        item.answers = answers.toArray();
      var explanation = EdXItem.parseExplanation(xml);
      if(explanation)
        item.solution = explanation;
      var material = EdXItem.parseMaterial(xml, item.question_type);
      if(material)
        item.edXMaterial = material;
      return item;
    } else {
      return null;
    }
  }

  static parseExplanation(xml){
    var solution = xml.find('solution');
    return solution.html();
  }

  static parseMaterial(xml, questionType){
    var contents = xml;
    contents.find('solution').remove();
    contents.find('stringresponse').remove();
    contents.find('customresponse').remove();
    contents.find('draggable').remove();
    contents.find('answer').remove();
    contents.find('drag_and_drop_input').remove();
    contents.find('multiplechoiceresponse').remove();
    contents.find('imageresponse').remove();
    contents.find('numericalresponse').parent().remove();
    var contentHtml = contents.html();
    return contentHtml;
    
  }

  static parseDraggables(item){
    item = $(item);
    var draggables = item.find('draggable').map((index, draggable)=>{
      return {
        id: draggable.getAttribute('id'),
        label: draggable.getAttribute('label')
      }
    });
    return draggables;
  }

  static parseTargets(item){

  }

  static parseRectCoords(item) {
    item = $(item);
    var rectangle = item.attr('rectangle');
    rectangle.replace(/([()])+/g, "");
    rectangle.replace(/([-])+/g, ",");
    var coordArr = rectangle.split(',');
    return coordArr;
  }

  static parseDraggableAnswers(item){
    item = $(item);
    item.find('answer').map((index, answer) => {
      var content = answer.textContent;
      var startIndex = content.indexOf("{");
      var endIndex = content.indexOf("}") + 1;
      var subContent = content.substring(startIndex, endIndex);
      return subContent

    });
  }

  static parseAnswers(xml, questionType){
    var answers;
    if(questionType == "edx_numerical_input"){
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
      answers = xml.find('optionresponse').map((index, item) =>{
        var matStr = item.getElementsByTagName('optioninput')[0].getAttribute('options').replace(/[()']/g, "");
        var matArr = matStr.split(",");
        
        return{
          id       : index,
          material : matArr,
          xml      : item,
          correct  : item.getElementsByTagName("optioninput")[0].getAttribute('correct')
        }
      });

    } else if(questionType == "edx_text_input"){
      answers = xml.find('stringresponse').map((index, item) => {
        return {
          id: index,
          material: item.children[0].getAttribute('label'),
          xml: item,
          correct: item.getAttribute('answer')
        }
      });
    } else if(questionType == "edx_drag_and_drop"){
      answers = xml.find('customresponse').map((index, item) => {
        var draggables = EdXItem.parseDraggables(item);
        var targets = EdXItem.parseTargets(item);
        var correctAnswer = EdXItem.parseDraggableAnswers(item);
        return {
          id: index,
          img: item.getAttribute('img'),
          draggables: draggables,
          targets: targets,
          correct: correctAnswer
        }
      })
    } else if (questionType == "edx_image_mapped_input") {
      answers = xml.find('imageinput').map((index, item) => {
        var coords = EdXItem.parseRectCoords(item);
        return{
          id: index,
          material: item.getAttribute('src'),
          width: item.getAttribute('width'),
          height: item.getAttribute('height'),
          coordinates: coords
        }
      })
    }
    return answers;
  }


}
