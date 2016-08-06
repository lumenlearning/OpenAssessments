"use strict";

import React                  from "react";
import _                      from "lodash";
import Style                  from "./css/style.js";
import BaseComponent          from '../../base_component.jsx';
import ReviewAssessmentActions from "../../../actions/review_assessment";

//Components
import OutcomeSelector        from './outcome_selector.jsx';
import QuestionMaterial       from './question_material.jsx';
import AnswerFeedbackMaterial from './answer_feedback_material.jsx';

export default class QuestionInterface extends BaseComponent{

  constructor(props, state) {
    super(props, state);
    this._bind("handleDoneEditing", "handleMaterialChange", "handleAnswerChange", "handleFeedbackChange", "handleAddOption", "handleOutcomeChange");

    this.state = {
      question: this.props.question || {},
      dirty: this.props.question.material == "" // mark new questions as dirty
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps != this.props){
      var dirty = false;
      if(nextProps.question.validationMessage && !nextProps.question.validationMessage.is_valid){
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
            handleAddOption={this.handleAddOption} />
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

  handleFeedbackChange(e, index) {
    let question = _.clone(this.state.question, true);
    let answer = question.answers[index];
    answer.feedback = e.target.getContent();

    this.setState({question: question, dirty: true});
  }

  handleAddOption(e) {
    let question = _.clone(this.state.question, true);
    let answerObj = {
      id: String((Math.random() * 100) * Math.random()),
      material: '',
      isCorrect: false,
      feedback: null
    };
    question.answers.push(answerObj);

    this.setState({question: question, dirty: true});
  }

  handleDoneEditing(e){
    if(this.state.dirty){
      ReviewAssessmentActions.updateAssessmentQuestion(this.state.question);
    } else {
      ReviewAssessmentActions.stopEditingQuestion(this.state.question);
    }
  }
}
