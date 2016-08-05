"use strict";

import React                  from "react";
import _                      from "lodash";
import Style                  from "./css/style.js";
import BaseComponent          from '../../base_component.jsx';

//Components
import OutcomeSelector        from './outcome_selector.jsx';
import QuestionMaterial       from './question_material.jsx';
import AnswerFeedbackMaterial from './answer_feedback_material.jsx';

export default class QuestionInterface extends BaseComponent{

  constructor(props, state) {
    super(props, state);
    this._bind("handleMaterialChange", "handleAnswerChange", "handleFeedbackChange", "handleAddOption", "handleOutcomeChange");

    this.state = {
      question: this.props.question || {}
    }
  }

  componentWillMount() {

  }

  handleOutcomeChange(newOutcome) {
    let question = _.clone(this.state.question, true);
    question.outcome = newOutcome;

    this.setState({question: question});
  }

  handleMaterialChange(e) {
    let question = _.clone(this.state.question, true);
    question.material = e.target.getContent();

    this.setState({question: question});
  }

  handleAnswerChange(e, index) {
    let question = _.clone(this.state.question, true);
    let answer = question.answers[index];
    answer.material = e.target.getContent();

    this.setState({question: question});
  }

  handleFeedbackChange(e, index) {
    let question = _.clone(this.state.question, true);
    let answer = question.answers[index];
    answer.feedback = e.target.getContent();

    this.setState({question: question});
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

    this.setState({question: question});
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
