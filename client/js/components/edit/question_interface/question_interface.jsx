"use strict";

import React         from "react";
import Style         from "./css/style.js";
import BaseComponent from '../../base_component.jsx';

//Components
import OutcomeSelector      from './outcome_selector.jsx';
import QuestionMaterial     from './question_material.jsx';
import AnswerOptionFeedback from './answer_option_feedback.jsx';

export default class QuestionInterface extends BaseComponent{

  constructor(props, state) {
    super(props, state);
    this._bind("handleMaterialChange", "handleAnswerChange", "handleFeedbackChange");

    this.state = {
      question: this.props.question || {},
    }
  }

  componentWillMount() {

  }

  handleMaterialChange(e) {
    this.setState({
      question: {
        material: e.target.getContent()
      }
    });
  }

  handleAnswerChange(e, index) {
    this.setState({
      answers: {
        [index]: {
          material: e.target.getContent()
        }
      }
    });
    // console.log("answer updating? ", this.state.answers[index].material)
  }

  handleFeedbackChange(e, index) {
    this.setState({
      answers: {
        [index]: {
          feedback: e.target.getContent()
        }
      }
    });
    // console.log("feedback updating? ", this.state.answers[index].feedback)
  }

  render() {
    let outcomes = this.props.outcomes;
    let question = this.props.question;
    let style    = Style.styles();

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>
          <OutcomeSelector outcomes={outcomes} />
          <QuestionMaterial
            material={question.material}
            onChange={this.handleMaterialChange} />
          <AnswerOptionFeedback
            answers={question.answers}
            handleAnswerChange={this.handleAnswerChange}
            handleFeedbackChange={this.handleFeedbackChange} />
        </div>
      </div>
    );
  }

}
