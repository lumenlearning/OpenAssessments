import $                  from 'jquery';
import Utils              from '../utils/utils';
import EdX                from './edx';
import Qti                from './qti';
import EdXSection         from './edx_section';
import EdXItem            from './edx_item';
import AssessmentActions  from "../actions/assessment";

export default class Assessment{

  static parseAssessment(settings, data){
    var xml = $(data);
    var assessmentXml   = xml.find('assessment').addBack('assessment');
    var questestinterop = xml.find('questestinterop').addBack('questestinterop');
    var sequential      = xml.find('sequential').addBack('sequential');
    if(assessmentXml.length > 0 || questestinterop.length > 0){
      return this.parseQti(settings.assessmentId, assessmentXml, xml);
    } else if(sequential.length > 0){
      return this.parseEdX(settings, sequential);
    } else{
      return {
        error: "Open Assessments could not find valid QTI or EdX XML. Nothing will be rendered. Please verify that your XML meets one of these standards."
      };
    }
  }

  static parseQti(assessmentId, assessmentXml, xml){
    var assessment = {
      id           : assessmentXml.attr('ident'),
      title        : assessmentXml.attr('title'),
      standard     : 'qti',
      assessmentId : assessmentId,
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

    // Add ids for the sections before returning the assessment so that we can order them
    assessment.sections = EdX.idPlaceholders(
      EdX.ensureIds('edx_sequential_', sequential.children()) // Ensure every child has an id
    );

    var baseUrl = url.substr(0, url.indexOf('sequential'));
    EdX.crawlEdX(sequential.children(), baseUrl + 'vertical/', settings, function(id, url, res){
      var section = EdXSection.fromEdX(id, url, res);
      var children = section.xml.children();
      section.items = EdX.idPlaceholders(
        EdX.ensureIds('edx_item_', children) // Ensure every child has an id
      );
      AssessmentActions.edXLoadSection(section);
      EdX.crawlEdX(children, baseUrl + 'problem/', settings, function(id, url, res){
        var item = EdXItem.fromEdX(id, url, res);
        AssessmentActions.edXLoadItem(item);
      }.bind(this));

    }.bind(this));
    return assessment;
  }

  static getItems(sections, perSec) {

    var items = [];
    if (!perSec || perSec <= 0) {
      for (var i = 1; i < sections.length; i++) {
        for (var j = 0; j < sections[i].items.length; j++) {
          var item = sections[i].items[j];

          //todo: do this based on assessment setting
          item.answers = _.shuffle(item.answers);
          items.push(item);
        }
      }
    } else {
      for (var i = 1; i < sections.length; i++) {
        var count = perSec > sections[i].items.length ? sections[i].items.length : perSec;
        for (var j = 0; j < count; j++) {
          var item = sections[i].items[j];
          for (var k = 0; k < items.length; k++) {
            if (item.id == items[k].id) {
              console.error("two items have the same id.");
            }
          }
          //todo: do this based on assessment setting
          item.answers = _.shuffle(item.answers);
          items.push(item);
        }
      }
    }
    return items;
  }

  static loadOutcomes(assessment) {
    var outcomes = assessment.sections.map((section)=> {
      if (section.outcome != "root section") {
        return section.outcome;
      }
    });
    outcomes = _.drop(outcomes);
    return outcomes;
  }

  static checkAnswer(item, selectedAnswers){
    // TODO implement checkAnswer, checkMultipleChoiceAnswer, and all other answer related methods.
    // There's still quite a bit of the ember code left. We'll need to pass values to this 
    // method rather than call things like settings.get. ItemResult.create should be moved to an action and use api.js
    var results;
    switch(item.question_type){
      case 'multiple_choice_question':
        results = this.checkMultipleChoiceAnswer(item, selectedAnswers);
        break;
      case 'multiple_answers_question':
        results = this.checkMultipleAnswerAnswer(item, selectedAnswers);
        break;
      case 'matching_question':
        results = this.checkMatchingAnswer(item, selectedAnswers);
        break;
      case 'edx_drag_and_drop':
        results = this.checkEdXDragAndDrop(item);
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

  static checkMultipleChoiceAnswer(item, selectedAnswerId){
    var feedbacks = "";
    var score = "0";
    var correct = false;
    if(selectedAnswerId == item.correct[0].id){
      correct = true;
      score = item.correct[0].score;
    }
    return {
      feedbacks: feedbacks,
      score: score,
      correct: correct
    };
  }

  static checkMultipleAnswerAnswer(item, selectedAnswerId){
    var feedbacks = ""; // implement feedbacks
    var score = "0";
    var numOfAnswers = item.correct[0].id.length;
    var numOfCorrectAnswers = 0;
    var correct = false;

    // if they selected the right amount of answers then check if they are the right answers
    if(selectedAnswerId.length == numOfAnswers){      
      for(var i = 0; i < selectedAnswerId.length; i++){
        for(var j = 0; j < numOfAnswers; j++){
          if(selectedAnswerId[i] == item.correct[0].id[j]){
            numOfCorrectAnswers++;
          }
        }
      }
      if(numOfAnswers == numOfCorrectAnswers){
        correct = true;
        score = "100";
      }
      return {
        feedbacks: feedbacks,
        score: score,
        correct: correct
      };
    }

    // if they selected to few or to many then return incorrect
    return {
        feedbacks: feedbacks,
        score: score,
        correct: correct
    };
  }

  static checkMatchingAnswer(item, selectedAnswerId){
    var feedbacks = ""; // implement feedbacks
    var score = "0";
    var numOfAnswers = item.correct.length
    var numOfCorrectAnswers = 0;
    var correct = false;
    // if they didnt match all of the answers then return false.
    if(item.correct.length > selectedAnswerId.length){
      return false;
    }

    for(var i = 0; i < numOfAnswers; i++){
      for (var j = 0; j < item.answers.length; j++){
        if(item.correct[i].id == item.answers[j].id){
          for(var k = 0; k < selectedAnswerId.length; k++){
            if(selectedAnswerId[k].answerNumber == "answer-" + i){
              if(selectedAnswerId[k].selectedAnswer.trim() == item.answers[j].material.trim()){
                numOfCorrectAnswers++;
              }
            }
          }
          break;
        }
      }
    }
    if(numOfCorrectAnswers == numOfAnswers){
      correct = true;
      score = "100";
    }

    return {
      feedbacks: feedbacks,
      score: score,
      correct: correct
    };


  }

  static checkEdXDragAndDrop(item){
    item.answers.map((item)=>{
      var correct = item.correct;
      if(item.type == 'key'){

      }
    });
    //debugger;
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

    // var score = 0; // TODO we should get var names and types from the QTI. For now we just use the default 'score'
    // var feedbacks = [];
    // var correct = false;
    // var respconditions = xml.find('respcondition');
    // for (var i =0; i<respconditions.length; i++){
    //   var condition = respconditions[i];
    //   condition = $(condition);
    //   var conditionMet = false;

    //   if(condition.find('conditionvar > varequal').length){
    //     var varequal = condition.find('conditionvar > varequal');

    //     if(varequal.text() === selectedAnswerId){
    //       conditionMet = true;
    //     }
    //   } else if(condition.find('conditionvar > unanswered').length){
    //     if(selectedAnswerId === null){
    //       conditionMet = true;
    //     }
    //   } else if(condition.find('conditionvar > not').length){
    //     if(condition.find('conditionvar > not > varequal').length){
    //       if(selectedAnswerId !== condition.find('conditionvar > not > varequal').text()){
    //         conditionMet = true;
    //       }
    //     } else if(condition.find('conditionvar > not > unanswered').length) {
    //       if(selectedAnswerId !== null){
    //         conditionMet = true;
    //       }
    //     }
    //   }

    //   if(conditionMet){
    //     var setvar = condition.find('setvar');
    //     if(setvar.length > 0){
    //       var setvarVal = parseFloat(setvar.text(), 10);
    //       if(setvarVal > 0){
    //         correct = true;
    //         var action = setvar.attr('action');
    //         if(action === 'Add'){
    //           score += setvarVal;
    //         } else if(action === 'Set'){
    //           score = setvarVal;
    //         }
    //       }
    //     }
    //     var feedbackId = condition.find('displayfeedback').attr('linkrefid');
    //     if(feedbackId){
    //       var feedback = xml.find('itemfeedback[ident="' + feedbackId + '"]');
    //       if(feedback && feedback.attr('view') && feedback.attr('view').length === 0 ||
    //         feedback.attr('view') === 'All' ||
    //         feedback.attr('view') === 'Candidate' ){  //All, Administrator, AdminAuthority, Assessor, Author, Candidate, InvigilatorProctor, Psychometrician, Scorer, Tutor
    //         var result = Qti.buildMaterial(feedback.find('material').children());
    //         if(feedbacks.indexOf(result) === -1){
    //           feedbacks.push(result);
    //         }
    //       }
    //     }
    //   }

    //   if(correct){
    //     return {
    //       feedbacks: feedbacks,
    //       score: score,
    //       correct: correct
    //     };
    //   }
    //   //if(condition.attr('continue') === 'No'){ return false; }
    // }
