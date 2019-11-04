"use strict";

import React from "react";
import AssessmentActions from "../../actions/assessment";
import AssessmentStore from "../../stores/assessment";
import Styles from "../../themes/selection.js";

const styles = Styles;

export default class RadioButton extends React.Component {
  render() {
    let btnQuestionStyles = this.getBtnQuestionStyles();

    /**
     * Note on dangerouslySetInnerHTML Usage
     *
     * It is generally not a good idea to use dangerouslySetInnerHTML because it
     * may expose applications to XSS attacks. We are opting to use it here and
     * and in other places in the code base because the assessment content is
     * is stored in (and returned from) the DB as XML, which limits our options
     * in how we can handle assessment "material" on the frontend.
     *
     * READ: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
     */
    const inputProps = {
      type: "radio",
      defaultChecked: this.checkedStatus(),
      disabled: this.props.isDisabled,
      name: this.props.name,
      id: this.props.id,
      style: { float:"left",position:"absolute" },
      onClick: () => { this.answerSelected(); }
    };
    if (this.showIncorrectAndChecked()) {
      inputProps["aria-invalid"] = true;
      inputProps["aria-describedby"] = this.feedbackId();
    } else if (this.showCorrectAndChecked()) {
      inputProps["aria-invalid"] = false;
      inputProps["aria-describedby"] = this.feedbackId();
    }
    if (this.props.addRef) {
      inputProps["ref"] = (node) => {
        this.props.setRef(node);
      };
    }
    return (
      <div>
        {this.renderAnswerIndicator()}
        <div>
          <label className="btn btn-block btn-question" style={btnQuestionStyles}>
            <input {...inputProps} />
            <span style={{display:"inline-block",paddingLeft:"25px",fontWeight:"normal"}}
                dangerouslySetInnerHTML={{__html: this.props.item.material}}>
            </span>
          </label>
          <div>
            {this.isQuizPage() ? this.answerFeedback() : ""}
          </div>
        </div>
      </div>
    );
  }

  getBtnQuestionStyles() {
    let qStyles = { ...styles.btnQuestion, padding: "11px 11px 6px" };

    if (this.isQuizPage()) {
      if (this.showCorrectAndChecked()) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionCorrect, padding: "11px 11px 6px"};
      } else if (this.showIncorrectAndChecked()) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect, padding: "11px 11px 6px"};
      }
    }

    return qStyles;
  }

  getButtonLabelStyles() {
    if (this.props.showAsCorrect !== null) {
      return (
        {...styles.btnLabel, ...{cursor: "default", padding: "11px 11px 6px"}}
      );
    } else {
      return (
        {...styles.btnLabel, ...{cursor: "pointer", padding: "11px 11px 6px"}}
      );
    }
  }

  isQuizPage() {
    return this.props.assessmentKind === "formative" || this.props.assessmentKind === "practice";
  }

  showCorrectAndChecked() {
    return this.props.showAsCorrect === true && this.props.checked === true;
  }

  showIncorrectAndChecked() {
    return this.props.showAsCorrect === false && this.props.checked === true;
  }

  showCorrectAnswerIcon() {
    return this.props.showAsCorrect === true;
  }

  renderAnswerIndicator() {
    if (this.showCorrectAnswerIcon()) {
      return (
        <img
          src="/assets/correct.png"
          className="correctIndicator"
          alt="Correct"
          style={styles.checkStyleCorrect}
          />
      );
    } else if (this.showIncorrectAndChecked()) {
      return (
        <img
          src="/assets/incorrect.png"
          className="wrongIndicator"
          alt="Incorrect"
          style={styles.checkStyleWrong}
          />
      );
    }
  }

  checkedStatus() {
    if (!this.props.isDisabled) {
      return AssessmentStore.studentAnswers() && AssessmentStore.studentAnswers().indexOf(this.props.item.id) > -1 ? true : null;
    } else {
      return this.props.checked;
    }
  }

  feedbackId() {
    return this.props.id + "Hint";
  }

  answerFeedback() {
    /**
     * Note on dangerouslySetInnerHTML Usage
     *
     * It is generally not a good idea to use dangerouslySetInnerHTML because it
     * may expose applications to XSS attacks. We are opting to use it here and
     * and in other places in the code base because the assessment content is
     * is stored in (and returned from) the DB as XML, which limits our options
     * in how we can handle assessment "material" on the frontend.
     *
     * READ: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
     */
    if (this.props.answerFeedback) {
      return (
        <div
          id={this.feedbackId()}
          className="check_answer_result"
          style={this.getFeedbackStyles()}
          dangerouslySetInnerHTML={this.answerFeedbackMarkup()}
          />
      );
    }

    if (this.showIncorrectAndChecked()) {
      return (
        <div id={this.feedbackId()}  className="check_answer_result" style={this.getFeedbackStyles()}>
          Incorrect
        </div>
      );
    }

    if (this.showCorrectAndChecked()) {
      return (
        <div id={this.feedbackId()}  className="check_answer_result" style={this.getFeedbackStyles()}>
          Correct
        </div>
      );
    }
  }

  getFeedbackStyles() {
    if (this.props.showAsCorrect === true) {
      return styles.feedbackCorrect;
    }

    if (this.props.showAsCorrect === false) {
      return styles.feedbackIncorrect;
    }
  }

  answerFeedbackMarkup() {
    return { __html: this.props.answerFeedback }
  }


  answerSelected() {
    AssessmentActions.answerSelected(this.props.item);
  }
}

RadioButton.propTypes = {
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired,
  isDisabled: React.PropTypes.bool
};

RadioButton.contextTypes = {
  theme: React.PropTypes.object
}
