import $     from 'jquery';
import Utils from '../utils/utils';

export default {

  // ////////////////////////////////////////////////////
  // Problem (Item) functionality
  //
  buildProblemMaterial: function(xml){
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
  },

  answersFromProblem: function(xml, klass, question_type){
    var list = Ember.A();
    var responses = xml.find('customresponse');
    if(responses.length > 0){
      $.each(xml.find('customresponse'), function(i, x){
        list.pushObject(klass.fromEdX(Utils.makeId(), x, question_type));
      });
    } else {
      list.pushObject(klass.fromEdX(Utils.makeId(), xml, question_type));
    }
    return list;
  },

  questionType: function(xml){

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
    }

  },

  crawlEdX: function(children, baseUrl, callback){
    var promises = [];
    $.each(children, function(i, child){
      var id = $(child).attr('url_name');
      if(id === undefined){ // Data is embedded in the document
        id = $(child).attr('id') || Utils.makeId();
        return callback(id, null, child);
      }
      var url = baseUrl + id + '.xml';
      if(this.get('offline')){
        var data = Utils.htmlDecodeWithRoot($('#' + id).html());
        callback(id, url, data);
      } else {
        var promise = this.makeAjax(url, function(data){
          callback(id, url, data);
        }.bind(this));
        promises.push(promise);
      }
    }.bind(this));
    return promises;
  },

  // Not all edX nodes will have a url_name or a valid id in which case we have 
  // no way to identify them in the padArray method. This method can be called to
  // ensure the child nodes have a valid id that can be used to identify them later on.
  ensureIds: function(prefix, children){
    $.each(children, function(i, child){
      var id = $(child).attr('url_name') || $(child).attr('id');
      if(!id){
        $(child).attr('id', prefix + i);
      }
    });
  },

  // The children are loaded asyncronously but need to be ordered
  // the same way every time. Create placeholders that can later be used
  // to correctly order the children after their promises return.
  padArray: function(arrayProxy, children){
    $.each(children, function(i, child){
      var id = $(child).attr('url_name') || $(child).attr('id');
      arrayProxy.pushObject(id);
    }.bind(this));
  },

  // Find and set obj in the arrayProxy. This searches arrayProxy for an id
  // that matches the obj's id and replaces it with the obj.
  findAndSetObject: function(arrayProxy, obj){
    var idx = arrayProxy.indexOf(obj.get('id'));
    if(idx >= 0){
      arrayProxy.removeAt(idx);
      arrayProxy.insertAt(idx, obj);
      return true;
    } else {
      return false;
    }
  },

  makeAjax: function(url, callback, retried){
    var promise = ajax.request(url);
    promise.then(function(data){
      callback(data);
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

};