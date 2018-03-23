"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import Styles             from "../../themes/selection.js";

const styles = Styles;

export default class RadioButton extends React.Component{

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
    var label = "Correct Answer that was ";
    var optionFlag;

    if (this.props.assessmentKind === "formative") {
      if(this.props.showAsCorrect){
        label += this.checkedStatus() ? "chosen" : "not chosen";
        optionFlag = <img src="/assets/correct.png" className="correctIndicator" aria-label={label} style={styles.checkStyleCorrect} />;
      } else if (this.props.showAsCorrect === false && this.checkedStatus()){
        optionFlag = <img src="/assets/incorrect.png" alt="" className="wrongIndicator" style={styles.checkStyleWrong} aria-label="Wrong answer that was chosen" />;
      }
    }

    return optionFlag;
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
        return "";
      }
    }
  }

  answerFeedbackMarkup(){
    return { __html: this.props.answerFeedback }
  }

  render(){
    var checked = null;
    var optionFlag = null;

    if( this.props.checked === true ) {
      checked = "true";
    } else if ( this.props.checked === false ){
      checked = false;
    } else if ( !this.props.isDisabled ) {
      checked = (AssessmentStore.studentAnswers() && AssessmentStore.studentAnswers().indexOf(this.props.item.id) > -1) ? "true" : null;
    }

    var radio = <input type="radio" defaultChecked={checked} disabled={this.props.isDisabled} name={this.props.name} onClick={()=>{ this.answerSelected() }}/>;

    var btnQuestionStyles = styles.btnQuestion;

    if (this.props.assessmentKind === "formative") {
      if(this.props.showAsCorrect){
        btnQuestionStyles = {...styles.btnQuestion, ...styles.btnQuestionCorrect};
        var label = "Correct Answer that was ";
        label += checked ? "chosen" : "not chosen";
        optionFlag = <img src="/assets/correct.png" className="correctIndicator" aria-label={label} style={styles.checkStyleCorrect} />;
      } else if (this.props.showAsCorrect === false && checked){
        btnQuestionStyles = {...styles.btnQuestion, ...styles.btnQuestionIncorrect};
        optionFlag = <img src="/assets/incorrect.png" alt="" className="wrongIndicator" style={styles.checkStyleWrong} aria-label="Wrong answer that was chosen" />;
      }
    }

    return (
      <div>
        {this.optionFlagStatus()}
        <div className="btn btn-block btn-question" style={btnQuestionStyles}>
          <label style={styles.btnLabel}>
            <input type="radio" defaultChecked={this.checkedStatus()} disabled={this.props.isDisabled} name={this.props.name} onClick={()=>{ this.answerSelected() }}/>
            <span style={styles.span} dangerouslySetInnerHTML={{__html: this.props.item.material}}/>
          </label>
          {this.props.assessmentKind === "formative" ? this.answerFeedback() : ""}
        </div>
      </div>
    );
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
