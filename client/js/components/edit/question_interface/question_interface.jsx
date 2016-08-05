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
      dirty: false
    }
  }

  componentWillMount() {

  }

  handleDoneEditing(e){
    // todo: validations
    // todo: set question_type based on count of correct answers

    if(this.state.dirty){
      ReviewAssessmentActions.updateAssessmentQuestion(this.state.question);
    } else {
      ReviewAssessmentActions.stopEditingQuestion(this.state.question);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps != this.props){
      this.setState({
        question: nextProps.question,
        dirty: false
      });
    }
  }


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

  render() {
    let question = this.state.question;
    let style    = Style.styles();

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>
          <button onClick={this.handleDoneEditing}>Done Editing</button>
          <OutcomeSelector
            outcomes={this.props.outcomes}
            selectedOutcome={question.outcome}
            onChange={this.handleOutcomeChange} />
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

}
