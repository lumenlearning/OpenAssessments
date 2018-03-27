"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import Styles             from "../../themes/selection.js";

const styles = Styles;

export default class CheckBox extends React.Component{

  render() {
    let btnQuestionStyles = this.getBtnQuestionStyles();

    return (
      <div>
        {this.renderAnswerIndicator()}
        <div className="btn btn-block btn-question" style={btnQuestionStyles}>
          <label style={{marginBottom: 0}}>
            <input type="checkbox" defaultChecked={this.checkedStatus()} disabled={this.props.isDisabled} name={this.props.name} onClick={()=>{ this.answerSelected() }}/>
            <span style={styles.span} dangerouslySetInnerHTML={{__html: this.props.item.material}}/>
          </label>
          {this.props.assessmentKind === 'formative' || this.props.assessmentKind === 'practice' ? this.answerFeedback() : ''}
        </div>
      </div>
    );
  }

  renderAnswerIndicator() {
    let indicator;

    // this is an answer key page
    if (!this.props.assessmentKind && this.props.isDisabled) {
      if (this.props.showAsCorrect) {
        indicator = <img src="/assets/correct.png" className="correctIndicator" aria-label="Correct Answer" alt="Icon indicating the correct answer" style={styles.checkStyleCorrect} />;
      }
    // else this is a quiz page
    } else if ((this.props.assessmentKind === 'formative' || this.props.assessmentKind === 'practice')) {
      if (this.props.showAsCorrect === true && this.props.checked === true) {
        indicator = <img src="/assets/correct.png" className="correctIndicator" aria-label="Correct Answer that was chosen" alt="Icon indicating that a correct answer was chosen" style={styles.checkStyleCorrect} />;
      } else if (this.props.showAsCorrect === true && this.props.checked === false) {
        indicator = <img src="/assets/correct.png" className="correctIndicator" aria-label="Correct Answer that was not chosen" alt="Icon indicating that a correct answer was not chosen" style={styles.checkStyleCorrect} />;
      } else if (this.props.showAsCorrect === false && this.props.checked === true) {
        indicator = <img src="/assets/incorrect.png" className="wrongIndicator" aria-label="Wrong answer that was chosen" alt="Icon indicating that a wrong answer was chosen" style={styles.checkStyleWrong} />;
      } else if (this.props.showAsCorrect === false && this.props.checked === false) {
        // do nothing
      }
    }

    return indicator;
  }

  getBtnQuestionStyles() {
    let qStyles = styles.btnQuestion;

    // this is a quiz page
    if ((this.props.assessmentKind === 'formative' || this.props.assessmentKind === 'practice')) {
      if(this.props.showAsCorrect === true && this.props.checked === true) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionCorrect};
      } else if (this.props.showAsCorrect === true && this.props.checked === false) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
      } else if (this.props.showAsCorrect === false && this.props.checked === true) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
      } else if (this.props.showAsCorrect === false && this.props.checked === false) {
        // do nothing
      }
    }

    return qStyles;
  }

  checkedStatus() {
    let checked = null;
    let optionFlag = null;

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
    let feedback = '';
    let feedbackStyles = {margin: 0};

    if (this.props.assessmentKind === 'formative' || this.props.assessmentKind === 'practice') {
      if (this.props.showAsCorrect === true && this.props.checked === true) {
        feedback = 'Answered Correctly';
        feedbackStyles = styles.feedbackCorrect;
      } else if (this.props.showAsCorrect === true && this.props.checked === false) {
        feedback = 'Not selected, but correct';
        feedbackStyles = styles.feedbackIncorrect;
      } else if (this.props.showAsCorrect === false && this.props.checked === true) {
        feedback = 'Selected, but incorrect';
        feedbackStyles = styles.feedbackIncorrect;
      } else if (this.props.showAsCorrect === false && this.props.checked === false) {
        // do nothing
      }
    }

    return <div className="check_answer_result" style={feedbackStyles}>{feedback}</div>
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
