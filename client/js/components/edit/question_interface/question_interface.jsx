"use strict";

import React                  from "react";
import _                      from "lodash";
import Style                  from "./css/style.js";
import BaseComponent          from '../../base_component.jsx';
import ReviewAssessmentActions from "../../../actions/review_assessment";
import ReviewAssessmentStore  from "../../../stores/review_assessment";

//Components
import OutcomeSelector        from './outcome_selector.jsx';
import QuestionMaterial       from './question_material.jsx';
import AnswerFeedbackMaterial from './answer_feedback_material.jsx';

export default class QuestionInterface extends BaseComponent{

  constructor(props, state) {
    super(props, state);
    this._bind( "handleDoneEditing",
                "handleCorrectChange",
                "handleMaterialChange",
                "handleAnswerChange",
                "handleFeedbackChange",
                "handleAddOption",
                "handleOutcomeChange",
                'handleAnswerRemoval');

    this.state = {
      question: this.props.question || {},
      dirty: this.props.question.material == "" // mark new questions as dirty
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps != this.props){
      var dirty = false;
      if(nextProps.question.hasOwnProperty("isValid") && !nextProps.question.isValid){
        dirty = true
      }
      this.setState({
        question: nextProps.question,
        dirty: dirty
      });
    }
  }

  render() {
    let question = this.state.question;
    let style    = Style.styles();

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>

          <OutcomeSelector
            outcomes={this.props.outcomes}
            selectedOutcome={question.outcome}
            onChange={this.handleOutcomeChange}
          >
            <button className='btn' onClick={this.handleDoneEditing} style={{ fontSize: '16px'}}>Done Editing</button>
          </OutcomeSelector>
          <QuestionMaterial
            material={question.material}
            onChange={this.handleMaterialChange} />
          <AnswerFeedbackMaterial
            answers={question.answers}
            handleAnswerChange={this.handleAnswerChange}
            handleFeedbackChange={this.handleFeedbackChange}
            handleCorrectChange={this.handleCorrectChange}
            handleAddOption={this.handleAddOption}
            handleAnswerRemoval={this.handleAnswerRemoval}
            />
        </div>
      </div>
    );
  }


  /*CUSTOM EVENT HANDLERS*/
  handleOutcomeChange(newOutcome) {
    let question = _.clone(this.state.question, true);
    question.outcome = newOutcome;

    this.setState({question: question, dirty: true});
  }

  handleMaterialChange(e) {
    let question = _.clone(this.state.question, true);
    question.material = e.target.getContent();

    this.setState({question: question, dirty: true});
  }

  handleAnswerChange(e, index) {
    let question = _.clone(this.state.question, true);
    let answer = question.answers[index];
    answer.material = e.target.getContent();

    this.setState({question: question, dirty: true});
  }

  handleAnswerRemoval(index){
    let question = _.clone(this.state.question, true);

    question.answers.splice(index, 1);

    this.setState({
      question: question,
      dirty: true
    });
  }

  handleFeedbackChange(e, index) {
    let question = _.clone(this.state.question, true);
    let answer = question.answers[index];
    answer.feedback = e.target.getContent();

    this.setState({question: question, dirty: true});
  }

  handleCorrectChange(index, isCorrect) {
    let question = _.clone(this.state.question, true);
    let answer = question.answers[index];
    answer.isCorrect = isCorrect;
    question.question_type = 'multiple_choice_question';

    let correctCount = _.sum(question.answers, function(a) { return a.isCorrect ? 1 : 0; });
    if(correctCount > 1){
      question.question_type = 'multiple_answers_question';
    }

    this.setState({question: question, dirty: true});
  }


  handleAddOption(e) {
    let question = _.clone(this.state.question, true);
    let answerObj = ReviewAssessmentStore.blankNewQuestion();
    question.answers.push(answerObj);

    this.setState({question: question, dirty: true});
  }

  handleDoneEditing(e){
    if(this.state.dirty){
      ReviewAssessmentActions.updateAssessmentQuestion(this.state.question);
    } else {
      ReviewAssessmentActions.cancelEditingQuestion(this.state.question);
    }
  }
}
