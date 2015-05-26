import $          from 'jquery';
import Utils      from '../utils/utils';
import EdX        from './edx';
import Qti        from './qti';

export default class Assessment{

  static parseAssessment(settings, data){
    var xml = $(data);
    var assessmentXml   = xml.find('assessment').addBack('assessment');
    var questestinterop = xml.find('questestinterop').addBack('questestinterop');
    var sequential      = xml.find('sequential').addBack('sequential');

    if(assessmentXml.length > 0 || questestinterop.length > 0){
      return this.parseQti(assessmentXml, xml);
    } else if(sequential.length > 0){
      return this.parseEdX(settings, sequential);
    } else {
      return {
        error: "Open Assessments could not find valid QTI or EdX XML. Nothing will be rendered. Please verify that your XML meets one of these standards."
      };
    }
  }

  static parseQti(assessmentXml, xml){
    var assessment = {
      id         : assessmentXml.attr('ident'),
      title      : assessmentXml.attr('title'),
      standard   : 'qti'
    };
    assessment.objectives = xml.find('assessment > objectives matref').map((index, item) => {
      return $(item).attr('linkrefid');
    });
    assessment.sections = Qti.parseSections(xml);
    return assessment;
  }

  static parseEdX(settings, sequential){
    var url = settings.srcUrl;
    var id  = url.slice(url.indexOf('sequential')).replace('.xml', '');
    var assessment = {
      id       : id,
      title    : sequential.attr('display_name'),
      standard : 'edX'
    };

    var baseUrl = url.substr(0, url.indexOf('sequential'));

    var seqentialChildren = sequential.children();
    EdX.ensureIds('edx_sequential_', seqentialChildren);
    EdX.padArray(this.get('sections'), seqentialChildren);
    
    var promises = EdX.crawlEdX(sequential.children(), baseUrl + 'vertical/', function(id, url, data){
      var section = EdXSection.fromEdX(id, url, data);

      EdX.findAndSetObject(this.get('sections'), section);

      var children = section.get('xml').children();
      EdX.ensureIds('edx_item_', children);
      EdX.padArray(section.get('items'), children);
      var sectionPromises = EdX.crawlEdX(children, baseUrl + 'problem/', function(id, url, data){
        var item = EdXItem.fromEdX(id, url, data);
        if(item){
          EdX.findAndSetObject(section.get('items'), item);
        }
      }.bind(this));
      if(promises){
        Ember.RSVP.Promise.all(promises.concat(sectionPromises)).then(function(){
          this.trigger('loaded');
        }.bind(this));
      } else {
        this.trigger('loaded');
      }
    }.bind(this));
  }

  static checkAnswer(xml, selectedAnswerId, selectedConfidenceLevel, questionType){
    // TODO implement checkAnswer, checkMultipleChoiceAnswer, and all other answer related methods.
    // There's still quite a bit of the ember code left. We'll need to pass values to this 
    // method rather than call things like settings.get. ItemResult.create should be moved to an action and use api.js
    var assessmentXml = $(xml);
    var results;
    switch(questionType){
      case 'multiple_choice_question':
        results = this.checkMultipleChoiceAnswer(assessmentXml, selectedAnswerId);
        break;
      case 'edx_drag_and_drop':
        results = this.checkEdXDragAndDrop();
        break;
      case 'edx_numerical_input':
        results = this.checkEdXNumeric();
        break;
      case 'edx_multiple_choice':
        results = this.checkEdXMultipleChoice();
        break;
    }

    // var end = Utils.currentTime();
    // var settings = this.get('settings');
    // ItemResult.create({
    //   offline: settings.get('offline'),
    //   assessment_result_id: this.get('controllers.application').get('model').get('assessment_result.id'),
    //   resultsEndPoint: settings.get('resultsEndPoint'),
    //   eId: settings.get('eId'),
    //   external_user_id: settings.get('externalUserId'),
    //   keywords: settings.get('keywords'),
    //   objectives: objectives,
    //   src_url: settings.get('srcUrl'),
    //   identifier: this.get('id'),
    //   session_status: 'final',
    //   time_spent: end - start,
    //   confidence_level: selectedConfidenceLevel,
    //   correct: results.correct,
    //   score: results.score
    // }).save();

    return results;
  }

  static checkMultipleChoiceAnswer(xml, selectedAnswerId){
    var score = 0; // TODO we should get var names and types from the QTI. For now we just use the default 'score'
    var feedbacks = [];
    var correct = false;

    $.each(xml.find('respcondition'), function(i, condition){

      condition = $(condition);
      var conditionMet = false;

      if(condition.find('conditionvar > varequal').length){
        var varequal = condition.find('conditionvar > varequal');
        if(varequal.text() === selectedAnswerId){
          conditionMet = true;
        }
      } else if(condition.find('conditionvar > unanswered').length){
        if(selectedAnswerId === null){
          conditionMet = true;
        }
      } else if(condition.find('conditionvar > not').length){
        if(condition.find('conditionvar > not > varequal').length){
          if(selectedAnswerId !== condition.find('conditionvar > not > varequal').text()){
            conditionMet = true;
          }
        } else if(condition.find('conditionvar > not > unanswered').length) {
          if(selectedAnswerId !== null){
            conditionMet = true;
          }
        }
      }

      if(conditionMet){
        var setvar = condition.find('setvar');
        if(setvar.length > 0){
          var setvarVal = parseFloat(setvar.text(), 10);
          if(setvarVal > 0){
            correct = true;
            var action = setvar.attr('action');
            if(action === 'Add'){
              score += setvarVal;
            } else if(action === 'Set'){
              score = setvarVal;
            }
          }
        }
        var feedbackId = condition.find('displayfeedback').attr('linkrefid');
        if(feedbackId){
          var feedback = xml.find('itemfeedback[ident="' + feedbackId + '"]');
          if(feedback && feedback.attr('view') && feedback.attr('view').length === 0 ||
            feedback.attr('view') === 'All' ||
            feedback.attr('view') === 'Candidate' ){  //All, Administrator, AdminAuthority, Assessor, Author, Candidate, InvigilatorProctor, Psychometrician, Scorer, Tutor
            var result = Qti.buildMaterial(feedback.find('material').children());
            if(feedbacks.indexOf(result) === -1){
              feedbacks.pushObject(result);
            }
          }
        }
      }

      if(condition.attr('continue') === 'No'){ return false; }
    });

    return {
      feedbacks: feedbacks,
      score: score,
      correct: correct
    };

  }

  static checkEdXDragAndDrop(){
    return this.checkEdX();
  }

  static checkEdXNumeric(){
    return this.checkEdX();
  }

  static checkEdXMultipleChoice(){
    return this.checkEdX();
  }

  static checkEdX(){
    var result = {
      feedbacks: [],
      score: 0,
      correct: true
    };
    this.get('answers').forEach(function(answer){
      if(answer.get('graded')){
        answer.set('isGraded', false);
        $.each(answer.get('graded'), function(id, graded){
          if(graded.feedback && graded.feedback.length > 0){
            result.feedbacks.push(graded.feedback);
          }
          result.score += graded.score;
          if(!graded.correct){
            result.correct = false;
          }
        });
        answer.set('isGraded', true);
      } else {
        result.correct = false;
      }
    });
    return result;
  }

}
