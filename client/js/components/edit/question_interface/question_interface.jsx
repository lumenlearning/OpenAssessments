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
    this.setState({
      question: {
        outcomes: newOutcome
      }
    });
  }

  handleMaterialChange(e) {
    this.setState({
      question: {
        material: e.target.getContent()
      }
    });
  }

  handleAnswerChange(e, index) {
    let answers     = _.clone(this.state.question.answers, true);
    let answer      = answers[index];
    answer.material = e.target.getContent();

    this.setState({
      question: {
        answers: answers
      }
    });
  }

  handleFeedbackChange(e, index) {
    let answers     = _.clone(this.state.question.answers, true);
    let answer      = answers[index];
    answer.feedback = e.target.getContent();

    this.setState({
      question: {
        answers: answers
      }
    });
  }

  handleAddOption(e) {
    let answers   = _.clone(this.state.question.answers, true);
    let answerObj = {
      id: String((Math.random() * 100) * Math.random()),
      material: '',
      isCorrect: false,
      feedback: null
    };
    answers.push(answerObj);

    this.setState({
      question: {
        answers: answers
      }
    });
  }

  render() {
    let question = this.state.question;
    let style    = Style.styles();

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>
          <OutcomeSelector
            outcomes={this.props.outcomes}
            selectedOutcome={question.outcomes}
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
