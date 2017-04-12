import $   from 'jquery';
import _   from 'lodash';

export default class Qti{

  static parseSections(xml){

    var fromXml = (xml) => {
      xml = $(xml);
      var items = this.parseItems(xml);
      return {
        id       : xml.attr('ident'),
        standard : 'qti',
        outcome  : items[0] ? items[0].outcome : {},
        items    : items
      };
    };

    // Not all QTI files have sections. If we don't find one we build a default one to contain the items from the QTI file.
    var buildDefault = (xml) => {
      return {
        id       : 'default',
        standard : 'qti',
        items    : this.parseItems(xml)
      };
    };

    return this.listFromXml(xml, 'section', fromXml, buildDefault);

  }

  static parseOutcome(item){
    item = $(item);
    var fields = item.find("qtimetadatafield");
    var outcome = {
      shortOutcome: "",
      longOutcome: "",
      outcomeGuid: ""
    };
    for (var i = fields.length - 1; i >= 0; i--) {
      if($(fields[i]).find("fieldlabel").text() == "outcome_guid"){
        outcome.outcomeGuid = $(fields[i]).find("fieldentry").text()
      }
      if($(fields[i]).find("fieldlabel").text() == "outcome_long_title"){
        outcome.longOutcome = $(fields[i]).find("fieldentry").text()
      }
      if($(fields[i]).find("fieldlabel").text() == "outcome_short_title"){
        outcome.shortOutcome = $(fields[i]).find("fieldentry").text()
      }
    }
    return outcome;
  }

  static parseItems(xml){

    var fromXml = (xml_raw) => {
      xml = $(xml_raw);

      var objectives = xml.find('objectives matref').map((index, item) => {
        return $(item).attr('linkrefid');
      });

      var item = {
        id         : xml.attr('ident'),
        title      : xml.attr('title'),
        objectives : objectives,
        outcome   : this.parseOutcome(xml),
        material   : this.material(xml),
        timeSpent  : 0
      };

      $.each(xml.find('itemmetadata > qtimetadata > qtimetadatafield'), function(i, x){
        item[$(x).find('fieldlabel').text()] = $(x).find('fieldentry').text();
      });

      if(xml.find('itemmetadata > qmd_itemtype').text() === 'Multiple Choice'){
        item.question_type = 'multiple_choice_question';
      }

      if(item.question_type == 'multiple_dropdowns_question'){
        //debugger;
        item.dropdowns = this.parseMultiDropdownAnswers(xml);
        // item.correct = this.parseMultiDropdownCorrect(xml);
      }
      else {
        item.answers = this.parseAnswers(xml);
        item.correct = this.parseCorrect(xml);
      }

      if(item.question_type == 'mom_embed'){
        item.momEmbed = {};
        item.momEmbed.questionId = xml.find("material mat_extension mom_question_id").text();
        item.momEmbed.embedUrl = xml.find("material mat_extension mom_embed_url").text();
        item.momEmbed.jwt = xml.find("material mat_extension mom_jwt").text();
        item.momEmbed.domain = xml.find("material mat_extension mom_domain").text();
        item.momEmbed.iframeHeight = null;
        item.material = "";
      }

      var response_grp = xml.find('response_grp');
      if(response_grp){
        if(response_grp.attr('rcardinality') === 'Multiple'){
          item.question_type = 'drag_and_drop';
        }
      }

      this.markCorrectAnswers(item);
      
      return item;
    };

    return this.listFromXml(xml, 'item', fromXml);

  }
  
  static parseMultiDropdownAnswers(xml) {
    let answers = new Object();

    $.each(xml.find('presentation > response_lid'), (i, x_raw) => {
      let x = $(x_raw);
      let key = $(x.find('material > mattext')[0]).text();

      answers[key] = x.find('render_choice > response_label').map((j, resLabel_raw) => {
        let resLabel = $(resLabel_raw);
        return ({
          value: resLabel.attr('ident'),
          name: resLabel.find('material > mattext').text()
        });
      }).toArray(); //make sure array not jquery object.
    });
    
    return answers;
  }//parseMultiDropdownAnswers

  static parseCorrect(xml){
    var respconditions = xml.find("respcondition");
    var correctAnswers = [];
    for (var i=0; i<respconditions.length; i++){
      var condition = $(respconditions[i]);
      if(condition.find('setvar').text() != '0'){
        var answer = {
          id: condition.find('conditionvar > varequal').text(),
          value: condition.find('setvar').text()
        };
        if(answer.id == ""){
          answer.id = condition.find('conditionvar > and > varequal').map((index, condition) => {
            condition = $(condition);
            return condition.text();
          });
          answer.id = answer.id.toArray();
        }
        correctAnswers.push(answer);
      }
    }
    return correctAnswers;
  }

  static parseAnswers(xml){

    var fromXml = (xml) => {
      xml = $(xml);
      return {
        id: xml.attr('ident'),
        material: this.buildMaterial(xml.find('material').children()),
        isCorrect: false,
        feedback: null
      };
    };

    return this.listFromXml(xml, 'response_lid > render_choice > response_label', fromXml);
  }

  static markCorrectAnswers(item){
    if(item.question_type == 'multiple_choice_question' || item.question_type == 'multiple_answers_question'){
      item.correct.forEach(function(correct){
        var ids = [].concat( correct.id );
        ids.forEach(function(id){
          var ans = _.find(item.answers, {id : id.toString()});
          if(ans !== undefined){
            ans.isCorrect = true;
          }
        });
      });
    }

    return item
  }

  // Process nodes based on QTI spec here:
  // http://www.imsglobal.org/question/qtiv1p2/imsqti_litev1p2.html#1404782
  static buildMaterial(nodes){
    var result = '';
    $.each(nodes, function(i, item){
      var parsedItem = $(item);
      switch(item.nodeName.toLowerCase()){
        case 'mattext':
          // TODO both mattext and matemtext have a number of attributes that can be used to display the contents
          result += parsedItem.text();
          break;
        case 'matemtext':
          // TODO figure out how to 'emphasize' text
          result += parsedItem.text();
          break;
        case 'matimage':
          result += '<img src="' + parsedItem.attr('uri') + '"';
          if(parsedItem.attr('label')) { result += 'alt="' + parsedItem.attr('label') + '"';   }
          if(parsedItem.attr('width')) { result += 'width="' + parsedItem.attr('width') + '"'; }
          if(parsedItem.attr('height')){ result += 'height="' + parsedItem.attr('height') + '"'; }
          result += ' />';
          break;
        case 'matref':
          var linkrefid = $(item).attr('linkrefid');
          // TODO figure out how to look up material based on linkrefid
          break;
      }
    });

    return result;
  }

  static listFromXml(xml, selector, fromXml, buildDefault){
    xml = $(xml);
    var list = xml.find(selector).map((i, x) => {
      return fromXml(x);
    }).toArray(); // Make sure we have a normal javascript array not a jquery array.
    if(list.length <= 0 && buildDefault){
      list = [buildDefault(xml)];
    }
    return list;
  }

  // //////////////////////////////////////////////////////////
  // Item related functionality
  //
  static buildResponseGroup(node){
    // TODO this is an incomplete attempt to build a drag and drop
    // question type based on the drag_and_drop.xml in seeds/qti
    return this.buildMaterial($(node).find('material').children());
  }

  static material(xml){

    var material = xml.find('presentation > material').children();
    if(material.length > 0){
      return Qti.buildMaterial(material);
    }

    var flow = xml.find('presentation > flow');
    if(flow.length > 0){
      return Qti.reduceFlow(flow);
    }

  }

  static reduceFlow(flow){
    var result = '';
    $.each(flow.children(), function(i, node){
      if(node.nodeName.toLowerCase() === 'flow'){
        result += Qti.buildMaterial($(node).find('material').children());
      } else if(node.nodeName.toLowerCase() === 'response_grp'){
        result += Qti.buildResponseGroup(node);
      }
    });
    return result;
  }

}
