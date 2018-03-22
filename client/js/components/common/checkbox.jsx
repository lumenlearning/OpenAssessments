"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import Styles             from "../../themes/selection.js";

const styles = Styles;

export default class CheckBox extends React.Component{


  answerSelected(){
    AssessmentActions.answerSelected(this.props.item);
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

  optionFlagStatus(){
    let label = "Correct Answer that was ";
    let optionFlag;

    if (this.props.showAsCorrect && this.props.checked) {
      label += this.checkedStatus() ? "chosen" : "not chosen";
      optionFlag = <img src="/assets/correct.png" className="correctIndicator" aria-label={label} style={styles.checkStyleCorrect} />;
    } else if (this.props.showAsCorrect && !this.props.checked) {
      optionFlag = <img src="/assets/incorrect.png" alt="" className="wrongIndicator" style={styles.checkStyleWrong} aria-label="Wrong answer that was not chosen" />;
    } else if (!this.props.showAsCorrect && this.props.checked) {
      optionFlag = <img src="/assets/incorrect.png" alt="" className="wrongIndicator" style={styles.checkStyleWrong} aria-label="Wrong answer that was chosen" />;
    }

    return optionFlag;
  }

  answerFeedback() {
    let feedback = "";
    let feedbackStyles = {};

    if (this.props.showAsCorrect && this.props.checked) {
      feedback = "Answered Correctly";
      feedbackStyles = styles.feedbackCorrect;
    } else if (this.props.showAsCorrect && !this.props.checked) {
      feedback = "Not selected, but correct";
      feedbackStyles = styles.feedbackIncorrect;
    } else if (!this.props.showAsCorrect && this.props.checked) {
      feedback = "Selected, but incorrect";
      feedbackStyles = styles.feedbackIncorrect;
    }

    return <div style={feedbackStyles}>{feedback}</div>
  }

  // answerFeedbackMarkup(){
  //   return { __html: this.props.answerFeedback }
  // }

  render(){

    var btnQuestionStyles = styles.btnQuestion;

    if(this.props.showAsCorrect && this.props.checked) {
      btnQuestionStyles = {...styles.btnQuestion, ...styles.btnQuestionCorrect};
    } else if (this.props.showAsCorrect && !this.props.checked) {
      btnQuestionStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
    } else if (!this.props.showAsCorrect && this.props.checked) {
      btnQuestionStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
    }

    return (
      <div>
        {this.optionFlagStatus()}
        <div className="btn btn-block btn-question" style={btnQuestionStyles}>
          <label style={{marginBottom: 0}}>
            <input type="checkbox" defaultChecked={this.checkedStatus()} disabled={this.props.isDisabled} name={this.props.name} onClick={()=>{ this.answerSelected() }}/>
            <span style={styles.span} dangerouslySetInnerHTML={{__html: this.props.item.material}}/>
          </label>
          {this.answerFeedback()}
        </div>
      </div>
    );
  }
}

CheckBox.propTypes = {
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired
};

CheckBox.contextTypes = {
  theme: React.PropTypes.object
};
