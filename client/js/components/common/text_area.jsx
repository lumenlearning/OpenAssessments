"use strict";

import React from 'react';
import AssessmentActions from "../../actions/assessment";
import AssessmentStore from "../../stores/assessment";
import Styles from "../../themes/selection.js";

const styles = Styles;

export default class TextArea extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Write your essay response here"
          onChange={(e) => AssessmentActions.answerSelected(e.target.value)}
          defaultValue={this.props.initialText}
          disabled={this.props.isDisabled}
          />
          {this.answerFeedback()}
      </div>
    );
  }

  answerFeedback() {
    if ((this.isFormative()) || this.isPractice() && this.props.completed) {
      return (
        <div className="check_answer_result" style={styles.feedbackNeutral}>
          <span dangerouslySetInnerHTML={this.renderCustomFeedback(this.props.item.feedback.general_fb)}></span>
        </div>
      );
    }
  }

  isFormative() {
    return this.props.assessmentKind === "formative" && this.props.item.confidenceLevel ? true : false;
  }

  isPractice() {
    return this.props.assessmentKind === "practice" && typeof this.props.initialText === "string" ? true : false;
  }

  renderCustomFeedback(markup) {
    if (markup !== null) {
      return {__html: markup};
    } else {
      return {__html: "Sorry there's no feedback for this question, please reach out to your teacher with any questions."};
    }
  }
}
