"use strict";

import React from "react";
import AssessmentActions from "../../actions/assessment";
import AssessmentStore from "../../stores/assessment";
import Styles from "../../themes/selection.js";

const styles = Styles;

export default class CheckBox extends React.Component {
  render() {
    let btnLabelStyles = this.props.showAsCorrect !== null ? {...styles.btnLabel, ...{cursor: "default", padding: "11px 11px 6px"}} : {...styles.btnLabel, ...{cursor: "pointer", padding: "11px 11px 6px"}};

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
    return (
      <div className="checkbox-wrapper">
        {this.renderAnswerIndicator()}
        <div className="btn btn-block btn-question" style={this.getButtonQuestionStyles()}>
          <label style={btnLabelStyles}>
            <span style={{display: "table-cell"}}>
              <input
                style={{margin: 0}}
                type="checkbox"
                defaultChecked={this.props.checked}
                disabled={this.props.isDisabled}
                name={this.props.name}
                id={this.props.name}
                onClick={() => { this.answerSelected(); }}
              />
            </span>
            <span
              style={{display: "table-cell", paddingLeft: "11px", fontWeight: "normal"}}
              dangerouslySetInnerHTML={{__html: this.props.item.material}}
              />
          </label>
          {this.answerFeedback()}
        </div>
      </div>
    );
  }

  renderAnswerIndicator() {
    if (this.isAnswerKeyPage() && this.props.showAsCorrect) {
      return (
        <img
          src="/assets/correct.png"
          className="correctIndicator"
          aria-label="Correct Answer"
          alt="Icon indicating the correct answer"
          style={styles.checkStyleCorrect}
          />
      );
    } else {
      return this.getAnswerIndicator();
    }
  }

  isAnswerKeyPage() {
    return !this.props.assessmentKind && this.props.isDisabled;
  }

  getAnswerIndicator() {
    if (this.selectedCorrectAnswer()) {
      return (
        <img
          src="/assets/correct.png"
          className="correctIndicator"
          aria-label="Correct Answer that was chosen"
          alt="Icon indicating that a correct answer was chosen"
          style={styles.checkStyleCorrect}
          />
      );
    } else if (this.unselectedCorrectAnswer()) {
      return (
        <img
          src="/assets/correct.png"
          className="correctIndicator"
          aria-label="Correct Answer that was not chosen"
          alt="Icon indicating that a correct answer was not chosen"
          style={styles.checkStyleCorrect}
          />
      );
    } else if (this.selectedIncorrectAnswer()) {
      return (
        <img
          src="/assets/incorrect.png"
          className="wrongIndicator"
          aria-label="Wrong answer that was chosen"
          alt="Icon indicating that a wrong answer was chosen"
          style={styles.checkStyleWrong}
          />
      );
    }
  }

  getButtonQuestionStyles() {
    if (this.shouldShowAnswerFeedback()) {
      return this.getButtonStyles();
    }

    return styles.btnQuestion;
  }

  getButtonStyles() {
    if (this.selectedCorrectAnswer()) {
      return {...styles.btnQuestion, ...styles.btnQuestionCorrect};
    } else if (this.unselectedCorrectAnswer()) {
      return {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
    } else if (this.selectedIncorrectAnswer()) {
      return {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
    } else {
      return styles.btnQuestion;
    }
  }

  answerFeedback() {
    if (this.shouldShowAnswerFeedback()) {
      let feedback = this.getFeedback();

      return (
        <div className="check_answer_result" style={feedback.styles}>{feedback.text}</div>
      );
    }
  }

  shouldShowAnswerFeedback() {
    return AssessmentStore.isFormative() || AssessmentStore.isPractice();
  }

  getFeedback() {
    let feedback = { text: "", styles: { margin: 0 } };

    if (this.selectedCorrectAnswer()) {
      feedback["text"] = "Answered Correctly";
      feedback["styles"] = styles.feedbackCorrect;
    } else if (this.unselectedCorrectAnswer()) {
      feedback["text"] = "Not selected, but correct";
      feedback["styles"] = styles.feedbackIncorrect;
    } else if (this.selectedIncorrectAnswer()) {
      feedback["text"] = "Selected, but incorrect";
      feedback["styles"] = styles.feedbackIncorrect;
    }

    return feedback;
  }

  selectedCorrectAnswer() {
    return this.props.showAsCorrect === true && this.props.checked === true;
  }

  unselectedCorrectAnswer() {
    return this.props.showAsCorrect === true && this.props.checked === false;
  }

  selectedIncorrectAnswer() {
    return this.props.showAsCorrect === false && this.props.checked === true;
  }

  unselectedIncorrectAnswer() {
    return this.props.showAsCorrect === false && this.props.checked === false;
  }

  answerSelected() {
    AssessmentActions.answerSelected(this.props.item);
  }
}

CheckBox.propTypes = {
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired
};

CheckBox.contextTypes = {
  theme: React.PropTypes.object
};
