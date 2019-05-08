"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import Styles             from "../../themes/selection.js";

const styles = Styles;

export default class CheckBox extends React.Component {
  render() {
    let btnLabelStyles = this.props.showAsCorrect !== null ? {...styles.btnLabel, ...{cursor: "default", padding: "11px 11px 6px"}} : {...styles.btnLabel, ...{cursor: "pointer", padding: "11px 11px 6px"}};

    return (
      <div>
        {this.renderAnswerIndicator()}
        <div className="btn btn-block btn-question" style={this.getBtnQuestionStyles()}>
          <label style={btnLabelStyles}>
            <span style={{display: "table-cell"}}>
              <input
                style={{margin: 0}}
                type="checkbox"
                defaultChecked={this.checkedStatus()}
                disabled={this.props.isDisabled}
                name={this.props.name}
                onClick={() => { this.answerSelected(); }} />
            </span>
            <span style={{display: "table-cell", paddingLeft: "11px", fontWeight: "normal"}} dangerouslySetInnerHTML={{__html: this.props.item.material}}/>
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
    } else if (this.shouldShowAnswerFeedback()) {
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

  getBtnQuestionStyles() {
    let qStyles = styles.btnQuestion;

    if (this.shouldShowAnswerFeedback()) {
      if(this.selectedCorrectAnswer()) {
        qStyles = {...qStyles, ...styles.btnQuestionCorrect};
      } else if (this.unselectedCorrectAnswer()) {
        qStyles = {...qStyles, ...styles.btnQuestionIncorrect};
      } else if (this.selectedIncorrectAnswer()) {
        qStyles = {...qStyles, ...styles.btnQuestionIncorrect};
      }
    }

    return qStyles;
  }

  checkedStatus() {
    let checked = null;

    if(this.props.checked === true) {
      checked = true;
    } else if (this.props.checked === false) {
      checked = false;
    } else if (!this.props.isDisabled) {
      checked = (AssessmentStore.studentAnswers() && AssessmentStore.studentAnswers().indexOf(this.props.item.id) > -1) ? true : null;
    }

    return checked;
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
    return this.isFormative() || this.isPractice();
  }

  isFormative() {
    return this.props.assessmentKind.toUpperCase() === "FORMATIVE";
  }

  isPractice() {
    return this.props.assessmentKind.toUpperCase() === "PRACTICE";
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

  // unused, but here for completeness
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
