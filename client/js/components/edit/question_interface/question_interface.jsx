"use strict";

import React from "react";
import Style from "./css/style.js";

//Components
import OutcomeSelector      from './outcome_selector.jsx';
import QuestionMaterial     from './question_material.jsx';
import AnswerOptionFeedback from './answer_option_feedback.jsx';

export default class QuestionInterface extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {
      question: this.props.question || {},
    }
  }

  componentWillMount() {

  }

  render() {
    let outcomes = this.props.outcomes;
    let question = this.props.question;
    let style    = Style.styles();

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>
          <OutcomeSelector outcomes={outcomes} />
          <QuestionMaterial material={question.material} />
          <AnswerOptionFeedback answers={question.answers} />
        </div>
      </div>
    );
  }

}
