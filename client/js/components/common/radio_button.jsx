"use strict";

import React from "react";
import AssessmentActions from "../../actions/assessment";
import AssessmentStore from "../../stores/assessment";
import Styles from "../../themes/selection.js";

const styles = Styles;

export default class RadioButton extends React.Component {
  render() {
    let btnQuestionStyles = this.getBtnQuestionStyles();

    return (
      <div>
        {this.renderAnswerIndicator()}
        <div className="btn btn-block btn-question" style={btnQuestionStyles}>
          <label style={this.getButtonLabelStyles()}>
            <span style={{display: "table-cell"}}>
              <input type="radio" defaultChecked={this.checkedStatus()} disabled={this.props.isDisabled} name={this.props.name} onClick={() => { this.answerSelected(); }} />
            </span>
            <span style={{display: "table-cell", paddingLeft: "11px", fontWeight: "normal"}} dangerouslySetInnerHTML={{__html: this.props.item.material}}/>
          </label>
          {this.isQuizPage() ? this.answerFeedback() : ""}
        </div>
      </div>
    );
  }

  getBtnQuestionStyles() {
    let qStyles = styles.btnQuestion;

    if (this.isQuizPage()) {
      if (this.showCorrectAndChecked()) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionCorrect};
      } else if (this.showIncorrectAndChecked()) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
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

  renderAnswerIndicator() {
    if (this.isAnswerPage()) {
      return this.getAnswerPageIndicator();
    }

    if (this.isQuizPage()) {
      return this.getQuizPageIndicator();
    }
  }

  isAnswerPage() {
    return !this.props.assessmentKind && this.props.isDisabled && this.props.showAsCorrect ? true : false;
  }

  isQuizPage() {
    return this.props.assessmentKind === "formative" || this.props.assessmentKind === "practice" ? true : false;
  }

  showCorrectAndChecked() {
    return this.props.showAsCorrect === true && this.props.checked === true ? true : false;
  }

  showIncorrectAndChecked() {
    return this.props.showAsCorrect === false && this.props.checked === true ? true : false;
  }

  getQuizPageIndicator() {
    if (this.showCorrectAndChecked()) {
      return (
        <img
          src="/assets/correct.png"
          className="correctIndicator"
          aria-label="Correct Answer"
          alt="Icon indicating the correct answer was chosen"
          style={styles.checkStyleCorrect}
          />
      );
    } else if (this.showIncorrectAndChecked()) {
      return (
        <img
          src="/assets/incorrect.png"
          className="wrongIndicator"
          aria-label="Wrong answer that was chosen"
          alt="Icon indicating the wrong answer was chosen"
          style={styles.checkStyleWrong}
          />
      );
    }
  }

  getAnswerPageIndicator() {
    return (
      <img
        src="/assets/correct.png"
        className="correctIndicator"
        aria-label="Correct Answer"
        alt="Icon indicating the correct answer"
        style={styles.checkStyleCorrect}
        />
    );
  }

  checkedStatus() {
    if (!this.props.isDisabled) {
      return AssessmentStore.studentAnswers() && AssessmentStore.studentAnswers().indexOf(this.props.item.id) > -1 ? true : null;
    } else {
      return this.props.checked;
    }
  }

  answerFeedback() {
    if (this.props.answerFeedback) {
      return (
        <div
          className="check_answer_result"
          style={this.getFeedbackStyles()}
          dangerouslySetInnerHTML={this.answerFeedbackMarkup()}
          />
      );
    }

    if (this.showIncorrectAndChecked()) {
      return (
        <div className="check_answer_result" style={this.getFeedbackStyles()}>
          Incorrect
        </div>
      );
    }

    if (this.showCorrectAndChecked()) {
      return (
        <div className="check_answer_result" style={this.getFeedbackStyles()}>
          Correct
        </div>
      )
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
