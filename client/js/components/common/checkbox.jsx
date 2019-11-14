"use strict";

import React from "react";
import AssessmentActions from "../../actions/assessment";
import AssessmentStore from "../../stores/assessment";
import Styles from "../../themes/selection.js";

const styles = Styles;

export default class CheckBox extends React.Component {
  render() {
    let btnQuestionStyles = this.getBtnQuestionStyles();
    let btnLabelStyles = this.getBtnLabelStyles();

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
      style: { margin: 0, position: "absolute" },
      type: "checkbox",
      defaultChecked: this.props.checked,
      name: this.props.name,
      id: this.props.id,
      onClick: () => { this.answerSelected(); }
    };
    if (this.selectedCorrectAnswer()) {
      inputProps["aria-invalid"] = false;
      inputProps["aria-describedby"] = this.feedbackId();
    } else if (this.unselectedCorrectAnswer() || this.selectedIncorrectAnswer()) {
      inputProps["aria-invalid"] = true;
      inputProps["aria-describedby"] = this.feedbackId();
    }
    if (this.props.addRef) {
      inputProps["ref"] = (node) => {
        this.props.setRef(node);
      };
    }
    return (
      <div className="checkbox-wrapper">
        {this.renderAnswerIndicator()}
        <div className="btn btn-block btn-question" style={btnQuestionStyles}>
          <label htmlFor={inputProps["id"]} style={btnLabelStyles}>
            <input { ...inputProps }/>
            <span
              style={{display:"inline-block", paddingLeft:"25px"}}
              dangerouslySetInnerHTML={{__html: this.props.item.material}}
              />
          </label>
          <div>
            {this.answerFeedback()}
          </div>
        </div>
      </div>
    );
  }

  feedbackId() {
    return this.props.id + "Hint";
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
          alt="Correct"
          style={styles.checkStyleCorrect}
          />
      );
    } else if (this.unselectedCorrectAnswer()) {
      return (
        <img
          src="/assets/correct.png"
          className="correctIndicator"
          alt="Correct but not Selected"
          style={styles.checkStyleCorrect}
          />
      );
    } else if (this.selectedIncorrectAnswer()) {
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

  getBtnQuestionStyles() {
    let qStyles = { ...styles.btnQuestion };

    if (this.shouldShowAnswerFeedback()) {
      if (this.selectedCorrectAnswer()) {
        qStyles =  {...styles.btnQuestion, ...styles.btnQuestionCorrect};
      } else if (this.unselectedCorrectAnswer()) {
        qStyles =  {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
      } else if (this.selectedIncorrectAnswer()) {
        qStyles =  {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
      } else {
        qStyles =  {...styles.btnQuestion};
      }
    }

    return qStyles;
  }

  getBtnLabelStyles() {
    let lStyles = {...styles.btnLabel, ...{display: "block", padding: "11px 11px 6px"} };

    if (this.props.showAsCorrect !== null) {
      lStyles = {...styles.btnLabel, ...{cursor: "default", display: "block", fontWeight: "normal", padding: "11px 11px 6px"}};
    } else {
      lStyles = {...styles.btnLabel, ...{cursor: "pointer", display: "block", fontWeight: "normal", padding: "11px 11px 6px"}};
    }

    return lStyles;
  }
  
  answerFeedback() {
    if (this.shouldShowAnswerFeedback()) {
      let feedback = this.getFeedback();

      return (
        <div id={this.feedbackId()} className="check_answer_result" style={feedback.styles}>{feedback.text}</div>
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
