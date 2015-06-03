import $            from 'jquery';
import Utils        from '../utils/utils';
import Request      from "superagent";

export default class Edx {

  // ////////////////////////////////////////////////////
  // Problem (Item) functionality
  //
  static buildProblemMaterial(xml){
    if(this.questionType(xml) == 'edx_numerical_input'){
      return null; // Numeric input will handle all question rendering
    }
    if(this.questionType(xml) == 'edx_multiple_choice'){
      return null; // Multiple choice will handle all question rendering
    }
    var contents = $('<div>').append(xml.html());
    contents.find('solution').remove();
    contents.find('stringresponse').remove();
    contents.find('customresponse').remove();
    contents.find('draggable').remove();
    contents.find('answer').remove();
    contents.find('drag_and_drop_input').remove();
    return contents.html();
  }

  static answersFromProblem(xml, klass, question_type){
    var list = Ember.A();
    var responses = xml.find('customresponse');
    if(responses.length > 0){
      $.each(xml.find('customresponse'), function(i, x){
        list.push(klass.fromEdX(Utils.makeId(), x, question_type));
      });
    } else {
      list.push(klass.fromEdX(Utils.makeId(), xml, question_type));
    }
    return list;
  }

  static questionType(xml){

    if(xml.find('drag_and_drop_input').length > 0){
      return 'edx_drag_and_drop';
    } else if(xml.find('numericalresponse').length > 0){
      return 'edx_numerical_input';
    } else if(xml.find('multiplechoiceresponse').length > 0){
      return 'edx_multiple_choice';
    } else if(xml.find('optionresponse').length > 0){
      return 'edx_dropdown';
    } else if(xml.find('stringresponse').length > 0){
      return 'edx_text_input';
    } else if(xml.find('imageresponse').length > 0){
      return 'edx_image_mapped_input';
    }

  }

  static crawlEdX(children, baseUrl, settings, callback){
    $.each(children, function(i, child){
      var id = $(child).attr('url_name');
      if(id === undefined){ // Data is embedded in the document
        id = $(child).attr('id') || Utils.makeId();
        return callback(id, null, child);
      }
      var url = baseUrl + id + '.xml';
      if(settings.offline){
        var data = Utils.htmlDecodeWithRoot($('#' + id).html());
        callback(id, url, data);
      } else {
        this.makeAjax(url, function(data){
          callback(id, url, data);
        }.bind(this));
      }
    }.bind(this));
  }

  // Not all edX nodes will have a url_name or a valid id in which case we have 
  // no way to identify them in the idPlaceholders method. This method can be called to
  // ensure the child nodes have a valid id that can be used to identify them later on.
  static ensureIds(prefix, children){
    return $(children).map((i, child) => {
      var id = this.getId(child);
      if(!id){
        $(child).attr('id', prefix + i);
      }
      return child;
    });
  }

  // The children are loaded asyncronously but need to be ordered
  // the same way every time. Create placeholders that can later be used
  // to correctly order the children after their promises return.
  static idPlaceholders(children){
    return $(children).map((i, child) => {
      return this.getId(child);
    });
  }

  static getId(child){
    return $(child).attr('url_name') || $(child).attr('id');
  }

  // Find and set obj in the arrayProxy. This searches arrayProxy for an id
  // that matches the obj's id and replaces it with the obj.
  static findAndSetObject(arrayProxy, obj){
    var idx = arrayProxy.indexOf(obj.get('id'));
    if(idx >= 0){
      arrayProxy.removeAt(idx);
      arrayProxy.insertAt(idx, obj);
      return true;
    } else {
      return false;
    }
  }

  static makeAjax(url, callback, retried){
    var promise = Request.get(url)
    .end(function(err, res){
      callback(res);
    }.bind(this), function(result){
      if(!retried && Utils.getLocation(url).hostname != Utils.getLocation(location.href).hostname){
        this.makeAjax('/proxy?url=' + encodeURI(url), callback, true)
      } else {
        console.log(result.statusText);
        this.trigger('error');
      }
    }.bind(this));
    return promise;
  }

}