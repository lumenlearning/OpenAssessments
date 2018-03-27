"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import Styles             from "../../themes/selection.js";

const styles = Styles;

export default class RadioButton extends React.Component{

  render() {
    let btnQuestionStyles = this.getBtnQuestionStyles();

    return (
      <div>
        {this.renderAnswerIndicator()}
        <div className="btn btn-block btn-question" style={btnQuestionStyles}>
          <label style={styles.btnLabel}>
            <input type="radio" defaultChecked={this.checkedStatus()} disabled={this.props.isDisabled} name={this.props.name} onClick={() => {this.answerSelected()}} />
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
    } else if (this.props.assessmentKind === 'formative' || this.props.assessmentKind === 'practice') {
      if (this.props.showAsCorrect === true && this.checkedStatus()) {
        indicator = <img src="/assets/correct.png" className="correctIndicator" aria-label="Correct Answer" alt="Icon indicating the correct answer was chosen" style={styles.checkStyleCorrect} />;
      } else if (this.props.showAsCorrect === false && this.checkedStatus()) {
        indicator = <img src="/assets/incorrect.png" className="wrongIndicator" aria-label="Wrong answer that was chosen" alt="Icon indicating the wrong answer was chosen" style={styles.checkStyleWrong} />;
      }
    }

    return indicator;
  }

  getBtnQuestionStyles() {
    let qStyles = styles.btnQuestion;

    // this is a quiz page
    if (this.props.assessmentKind === 'formative' || this.props.assessmentKind === 'practice') {
      if (this.props.showAsCorrect === true && this.checkedStatus()) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionCorrect};
      } else if (this.props.showAsCorrect === false && this.checkedStatus()) {
        qStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
      }
    }

    return qStyles;
  }

  checkedStatus(){
    var checked = null;
    var optionFlag = null;
    if( this.props.checked === true ) {
      checked = "true";
    } else if ( this.props.checked === false ){
      checked = false;
    } else if ( !this.props.isDisabled ) {
      checked = (AssessmentStore.studentAnswers() && AssessmentStore.studentAnswers().indexOf(this.props.item.id) > -1) ? "true" : null;
    }
    return checked;
  }

  answerFeedback() {
    var feedbackStyles = {};

    if (this.props.showAsCorrect) {
      feedbackStyles = styles.feedbackCorrect;
    } else if (!this.props.showAsCorrect) {
      feedbackStyles = styles.feedbackIncorrect;
    }

    if (this.props.answerFeedback) {
      return <div className="check_answer_result" style={feedbackStyles} dangerouslySetInnerHTML={ this.answerFeedbackMarkup() } />
    } else {
      if (!this.props.showAsCorrect && this.props.checked) {
        return <div className="check_answer_result" style={feedbackStyles}>Incorrect</div>;
      } else {
        return '';
      }
    }
  }

  answerFeedbackMarkup(){
    return { __html: this.props.answerFeedback }
  }


  answerSelected(){
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
