import $                  from 'jquery';
import React              from 'react';
import Utils              from '../utils/utils';
import Qti                from './qti';
import AssessmentActions  from "../actions/assessment";

export default class Assessment{

  static parseAssessment(settings, data){
    var xml = $(data);
    var assessmentXml   = xml.find('assessment').addBack('assessment');
    var questestinterop = xml.find('questestinterop').addBack('questestinterop');
    var sequential      = xml.find('sequential').addBack('sequential');
    if(assessmentXml.length > 0 || questestinterop.length > 0){
      return this.parseQti(settings.assessmentId, assessmentXml, xml);
    } else{
      return {
        error: "Open Assessments could not find valid QTI. Nothing will be rendered. Please verify that your XML meets one of these standards."
      };
    }
  }

  static parseQti(assessmentId, assessmentXml, xml){
    var assessment = {
      id: assessmentXml.attr('ident'),
      title: assessmentXml.attr('title'),
      standard: 'qti',
      assessmentId: assessmentId,
      outcomes: [],
      skills: []
    };
    assessment.objectives = xml.find('assessment > objectives matref').map((index, item) => {
      return $(item).attr('linkrefid');
    });
    assessment.sections = Qti.parseSections(xml);

    // Get all the unique outcomes from the items
    var outcome_map = {};
    for (var i = 1; i < assessment.sections.length; i++) {
      for (var j = 0; j < assessment.sections[i].items.length; j++) {
        var item = assessment.sections[i].items[j];
        if(item.outcome){
          outcome_map[item.outcome.outcomeGuid] = item.outcome;
        }
      }
    }

    var skill_map = {};
    for (var i = 1; i < assessment.sections.length; i++) {
      for (var j = 0; j < assessment.sections[i].items.length; j++) {
        var item = assessment.sections[i].items[j];
        if(item.skill){
            skill_map[item.skill.skillGuid] = item.skill;
        }
      }
    }

    assessment.outcomes = _.values(outcome_map);
    assessment.skills = _.values(skill_map);

    return assessment;
  }

  static getItems(sections, perSec, shuffle=true) {

    var items = [];
    if (!perSec || perSec <= 0) {
      for (var i = 1; i < sections.length; i++) {
        for (var j = 0; j < sections[i].items.length; j++) {
          var item = sections[i].items[j];

          item.answers = shuffle ? _.shuffle(item.answers) : item.answers;
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
          item.answers = shuffle ? _.shuffle(item.answers) : item.answers;
          items.push(item);
        }
      }
    }
    return items;
  }

  static loadOutcomes(assessment) {
    if(assessment.outcomes){
      return assessment.outcomes;
    } else {
      var outcomes = assessment.sections.map((section)=> {
        if (section.outcome != "root section") {
          return section.outcome;
        }
      });
      assessment.outcomes = _.drop(outcomes);
      return assessment.outcomes;
    }
  }

  static loadSkills(assessment) {
    if(assessment.skills){
      return assessment.skills;
    } else {
      var skills = assessment.sections.map((section)=> {
        if (section.skill != "root section") {
          return section.skill;
        }
      });
    }
  }

  static checkAnswer(item, selectedAnswers){
    var results;
    switch(item.question_type){
      case 'multiple_choice_question':
        results = this.checkMultipleChoiceAnswer(item, selectedAnswers);
        break;
      case 'multiple_answers_question':
        results = this.checkMultipleAnswerAnswer(item, selectedAnswers);
        break;
      case 'essay_question':
        results = this.checkEssayAnswer(item, selectedAnswers);
        break;
      case 'matching_question':
        results = this.checkMatchingAnswer(item, selectedAnswers);
        break;
      case 'multiple_dropdowns_question':
        results = this.checkDropdownAnswers(item, selectedAnswers);
        break;
    }

    return results;
  }

  static checkDropdownAnswers(item, selectedAnswers){
    let answerFeedback = {};
    let score = 0;
    let correct = false;

    let feedback = selectedAnswers.map((selAnswer, i) => {
      let color = "";

      //build score
      item.correct.find((correctAns) => {
        if(correctAns.name == selAnswer.dropdown_id && correctAns.value === selAnswer.chosen_answer_id){
          color = '#6fb88a';
          score = score + (1/item.correct.length);
          return true;
        }
        else if(correctAns.name == selAnswer.dropdown_id && correctAns.value !== selAnswer.chosen_answer_id){
          color = '#e0542b';
          return false;
        }
      });

      let feedback = '<div>(' + (i + 1) + ') ' + item.feedback[`${selAnswer.dropdown_id}${selAnswer.chosen_answer_id}`] + '</div>';
      if(typeof item.feedback[`${selAnswer.dropdown_id}${selAnswer.chosen_answer_id}`] === 'undefined'){
        return null;
      }
      return <p style={{color: color}} tabIndex="0" dangerouslySetInnerHTML={ {__html: feedback} } />;
    });

    if(score >= 1){
      correct = true;
    }

    return {
        feedback: feedback,
        answerFeedback: answerFeedback,
        score: score,
        correct: correct
      };
  }

  static checkMultipleChoiceAnswer(item, selectedAnswerId){
    var score = "0";
    var correct = false;
    var answerFeedback = {};
    if (item.feedback[selectedAnswerId]) {
      answerFeedback[selectedAnswerId] = item.feedback[selectedAnswerId]
    }

    if(selectedAnswerId == item.correct[0].id){
      correct = true;
      score = item.correct[0].score;
    }
    return {
      feedback: item.feedback["general_fb"],
      answerFeedback: answerFeedback,
      score: score,
      correct: correct
    };
  }

  static checkMultipleAnswerAnswer(item, selectedAnswerId) {
    var numOfAnswers = item.correct[0].id.length;
    var numOfCorrectAnswers = 0;
    var numOfInCorrectAnswers = 0;
    var answerFeedback = {};

    for (var i = 0; i < selectedAnswerId.length; i++) {
      let answerID = selectedAnswerId[i];
      if(item.feedback[answerID]){
        answerFeedback[answerID] = item.feedback[answerID];
      }

      let correct = false;
      for (var j = 0; j < numOfAnswers; j++) {
        if (answerID == item.correct[0].id[j]) {
          correct = true;
          break;
        }
      }
      if (correct) {
        numOfCorrectAnswers++;
      } else {
        numOfInCorrectAnswers++;
      }
    }

    if (numOfInCorrectAnswers == 0 && numOfAnswers == numOfCorrectAnswers) {
      return {
        feedback: item.feedback["general_fb"],
        answerFeedback: answerFeedback,
        score: 100,
        correct: true
      };
    } else if (numOfCorrectAnswers > 0) {
      return {
        feedback: item.feedback["general_fb"],
        answerFeedback: answerFeedback,
        score: numOfCorrectAnswers,
        correct: false
      };
    } else {
      return {
        feedback: item.feedback["general_fb"],
        answerFeedback: answerFeedback,
        score: 0,
        correct: false
      };
    }

  }

  static checkEssayAnswer(item, response) {
    if (response.length > 0) {
      return {
        correct: true,
        score: 100,
        feedback_only: true,
        feedback: item.feedback["general_fb"],
        allowResubmit: true
      }
    } else {
      return {
        correct: false,
        score: 0,
        feedback_only: true,
        feedback: "Please enter a response.",
        allowResubmit: true
      }
    }
  }

  static checkMatchingAnswer(item, selectedAnswerId){
    var feedback = ""; // implement feedback
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
      feedback: feedback,
      score: score,
      correct: correct
    };


  }

}

    // var score = 0; // TODO we should get var names and types from the QTI. For now we just use the default 'score'
    // var feedback = [];
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
    //         if(feedback.indexOf(result) === -1){
    //           feedback.push(result);
    //         }
    //       }
    //     }
    //   }

    //   if(correct){
    //     return {
    //       feedback: feedback,
    //       score: score,
    //       correct: correct
    //     };
    //   }
    //   //if(condition.attr('continue') === 'No'){ return false; }
    // }
