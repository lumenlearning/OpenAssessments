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
      question: this.props.question || {},
    }
  }

  componentWillMount() {

  }

  handleOutcomeChange(e) {
    let outcomeGuid = _.clone(this.state.question.outcomeGuid, true);
    outcomeGuid = e.target.value;
    console.log("ouch guid", outcomeGuid)

    this.setState({
      question: {
        outcomeGuid: outcomeGuid
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
    // console.log("answer updating? ", this.state.answers[index].material)
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
    // console.log("feedback updating? ", this.state.answers[index].feedback)
  }

  handleAddOption(e) {
    let answers   = _.clone(this.state.question.answers, true);
    let answerObj = {
      id: String((Math.random() * 100) * Math.random()),
      material: '',
      isCorrect: false,
      feedback: null
    }
    answers.push(answerObj);

    this.setState({
      question: {
        answers: answers
      }
    });
  }

  render() {
    let outcomes = this.props.outcomes;
    let question = this.state.question;
    let style    = Style.styles();
console.log("quest props lol:", this.props)
    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>
          <OutcomeSelector
            outcomes={outcomes}
            handleOutcomeChange={this.handleOutcomeChange} />
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
