"use strict";

import React              from 'react';
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import UniversalInput     from "./universal_input";
import AssessmentStore    from "../../stores/assessment";


export default class Item extends BaseComponent{
  constructor(){
    super();
    this._bind("getConfidenceLevels", "confidenceLevelClicked","submit", "nextButtonClicked", "previousButtonClicked", "getPreviousButton", "getNextButton", "getStyles", "clearShowMessage");
  }

  nextButtonClicked(e){
    e.preventDefault();
    this.setState({unAnsweredQuestions: null});
    this.props.nextQuestion(this.clearShowMessage);
  }

  previousButtonClicked(e){
    e.preventDefault();
    this.setState({unAnsweredQuestions: null});
    this.props.previousQuestion(this.clearShowMessage);
  }

  clearShowMessage(){
    this.setState({showMessage: false});
  }

  confidenceLevelClicked(e, val, currentIndex){
    e.preventDefault();

    let that = this;
    this.props.selectQuestion(this.props.currentIndex, function(){
      if(AssessmentStore.hasAnsweredCurrent()){
        AssessmentActions.selectConfidenceLevel(val, currentIndex);
        if(that.props.currentIndex == that.props.questionCount - 1 && that.props.settings.assessmentKind.toUpperCase() == "FORMATIVE"){
          that.submit();
        } else {
          AssessmentActions.nextQuestion();
          that.clearShowMessage();
        }
      } else {
        that.setState({showMessage: true});
      }
      if(document.getElementById("focus")){document.getElementById("focus").focus();}
    });
  }

  submitButtonClicked(e){
    e && e.preventDefault();
    this.props.selectQuestion(this.props.currentIndex, this.submit);
  }

  submit(){
      var complete = Item.checkCompletion();
      if(complete === true){
        window.onbeforeunload = null;
        AssessmentActions.submitAssessment(this.props.assessment.id, this.props.assessment.assessmentId, this.props.allQuestions, AssessmentStore.allStudentAnswers(), this.props.settings, this.props.outcomes);
      }
      else {
        this.setState({unAnsweredQuestions: complete});
      }
  }

  static checkCompletion(){
    var questionsNotAnswered = [];
    var answers = AssessmentStore.allStudentAnswers();
    for (var i = 0; i < answers.length; i++) {
      if(answers[i] == null || answers[i].length == 0){

        questionsNotAnswered.push(i+1);
      }
    }
    if(questionsNotAnswered.length > 0){
      return questionsNotAnswered;
    }
    return true;
  }

  getStyles(theme){
    var navMargin = "-35px 650px 0 0";
    if(this.props.settings.confidenceLevels)
      navMargin = "-75px 20px 0 0";
    return {
      assessmentContainer:{
        marginTop: this.props.settings.assessmentKind.toUpperCase() == "FORMATIVE" ?  "0px" : "100px",
        boxShadow: this.props.settings.assessmentKind.toUpperCase() == "FORMATIVE" ?  "" : theme.assessmentContainerBoxShadow,
        borderRadius: theme.assessmentContainerBorderRadius
      },
      header: {
        backgroundColor: theme.headerBackgroundColor
      },
      fullQuestion:{
        backgroundColor: this.props.settings.assessmentKind.toUpperCase() == "FORMATIVE" ? theme.outcomesBackgroundColor : theme.fullQuestionBackgroundColor,
        paddingBottom: "20px",
      },
      questionText: {
        fontSize: theme.questionTextFontSize,
        fontWeight: theme.questionTextFontWeight,
        padding: theme.questionTextPadding,
      },
      nextButton: {
        backgroundColor: theme.nextButtonBackgroundColor,
        color: theme.probablyColor,
        width: theme.probablyWidth,
      },
      previousButton: {
        backgroundColor: theme.previousButtonBackgroundColor,
        marginRight: "20px",
        color: theme.probablyColor,
        width: theme.probablyWidth,
      },
      maybeButton: {
        width: theme.maybeWidth,
        backgroundColor: theme.maybeBackgroundColor,
        color: theme.maybeColor,
      },
      probablyButton: {
        width: theme.probablyWidth,
        backgroundColor: theme.probablyBackgroundColor,
        color: theme.probablyColor,
      },
      definitelyButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor,
        color: theme.definitelyColor,
      },
      submitButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.submitBackgroundColor,
        color: theme.definitelyColor,

      },
      confidenceWrapper: {
        border: theme.confidenceWrapperBorder,
        borderRadius: theme.confidenceWrapperBorderRadius,
        width: theme.confidenceWrapperWidth,
        height: theme.confidenceWrapperHeight,
        padding: theme.confidenceWrapperPadding,
        margin: theme.confidenceWrapperMargin,
        backgroundColor: theme.confidenceWrapperBackgroundColor,
      },
      navigationWrapper: {
        border: theme.confidenceWrapperBorder,
        borderRadius: theme.confidenceWrapperBorderRadius,
        width: "300px",
        height: theme.confidenceWrapperHeight,
        padding: theme.confidenceWrapperPadding,
        margin: theme.confidenceWrapperMargin,
        backgroundColor: theme.confidenceWrapperBackgroundColor,
      },
      margin: {
       marginLeft: "5px"
      },
      navButtons: {
        margin: navMargin
      },
      submitButtonDiv: {
        marginLeft: "20px",
        marginTop: "86px"
      },
      warning: {
        margin: theme.confidenceWrapperMargin,
        border: "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: theme.maybeBackgroundColor,
        color: theme.maybeColor,
        padding: "8px 8px !important"
      },
      footer: {
        borderTop: "1px solid gray",
        borderBottom: "5px solid " + theme.footerBackgroundColor,
        position: "absolute",
        left: "0px",
        bottom: "1px",
        marginTop: "20px",
        width: "100%",
        height: theme.footerHeight,
        backgroundColor: theme.footerBackgroundColor,
      },
      footerPrev: {
        height: theme.footerHeight,
        width: "100px",
        float: "left",
      },
      footerNext: {
        height: theme.footerHeight,
        width: "100px",
        float: "right"
      },
      icon: {
        height: "62px",
        width: "62px",
        fontColor: theme.primaryBackgroundColor
      },
      data: {
        marginTop: "-5px"
      },
      selfCheck: {
        fontSize: "140%"
      },
      checkDiv: {
        backgroundColor: theme.primaryBackgroundColor,
        margin: "20px 0px 0px 0px"
      },
      h4: {
        color: "white"
      },
      chooseText: {
        color: "grey",
        fontSize: "90%",
        paddingBottom: "20px"
      }
    }
  }
  getFooterNav(theme, styles){
    if(theme.shouldShowFooter){
      return  <div style={styles.footer}>
                <button style={styles.footerPrev} onClick={()=>{this.previousButtonClicked()}}>
                <i className="glyphicon glyphicon-chevron-left"></i>
                Previous
                </button>
                <button style={styles.footerNext} onClick={()=>{this.nextButtonClicked()}}>
                Next
                <i className="glyphicon glyphicon-chevron-right"></i>
                </button>
              </div>
    }

    return "";
  }

  getWarning(state, questionCount, questionIndex, styles){
    if(state && state.unAnsweredQuestions && state.unAnsweredQuestions.length > 0 && questionIndex + 1 == questionCount){
      return <div style={styles.warning}><i className="glyphicon glyphicon-exclamation-sign"></i> You left question(s) {state.unAnsweredQuestions.join()} blank. Use the "Progress" drop-down menu at the top to go back and answer the question(s), then come back and submit.</div>
    }

    return "";
  }

  getConfidenceLevels(level, styles){
    if(level){
      var levelMessage = <div style={{marginBottom: "10px"}}><b>How sure are you of your answer? Click below to move forward.</b></div>;
      return    (<div className="confidence_wrapper" style={styles.confidenceWrapper}>
                  {levelMessage}
                  <input type="button" style={styles.maybeButton}className="btn btn-check-answer" value="Just A Guess" onClick={(e) => { this.confidenceLevelClicked(e, "Just A Guess", this.props.currentIndex) }}/>
                  <input type="button" style={{...styles.margin, ...styles.probablyButton}} className="btn btn-check-answer" value="Pretty Sure" onClick={(e) => { this.confidenceLevelClicked(e, "Pretty Sure", this.props.currentIndex) }}/>
                  <input type="button" style={{...styles.margin, ...styles.definitelyButton}} className="btn btn-check-answer" value="Very Sure" onClick={(e) => { this.confidenceLevelClicked(e, "Very Sure", this.props.currentIndex) }}/>
                </div>
                );
    } /*else {
      return <div className="lower_level"><input type="button" className="btn btn-check-answer" value="Check Answer" onClick={() => { AssessmentActions.checkAnswer()}}/></div>
    }*/
  }

  getNavigationButtons(styles) {
    if (!this.context.theme.shouldShowNextPrevious && this.props.confidenceLevels) {
      return "";
    }

    return <div className="confidence_wrapper" style={styles.navigationWrapper}>
      {this.getPreviousButton(styles)}
      {this.getNextButton(styles)}
    </div>
  }

  getNextButton(styles) {
    var disabled = (this.props.currentIndex == this.props.questionCount - 1) ? "disabled" : "";
    return (
        <button className={"btn btn-next-item " + disabled} style={styles.nextButton} onClick={(e) => { this.nextButtonClicked(e) }}>
          <span>Next</span> <i className="glyphicon glyphicon-chevron-right"></i>
        </button>);
  }

  getPreviousButton(styles) {
    var prevButtonClassName = "btn btn-prev-item " + ((this.props.currentIndex > 0) ? "" : "disabled");
    return (
        <button className={prevButtonClassName} style={styles.previousButton} onClick={(e) => { this.previousButtonClicked(e) }}>
          <i className="glyphicon glyphicon-chevron-left"></i><span>Previous</span>
        </button>);
  }


  getResult(index){
    var result;

    if(index == -1){
      result =  <div className="check_answer_result">
                  <p></p>
                </div>;
    }
    else if(index == 0){
      result =  <div className="check_answer_result">
                  <p>Incorrect</p>
                </div>;
    }
    else {
      result =  <div className="check_answer_result">
                  <p>Correct</p>
                </div>;
    }

    return result;
  }

  questionDirections(styles){
    if(this.props.question.question_type == "multiple_answers_question"){
      return <div style={styles.chooseText}>Choose <b>ALL</b> that apply.</div>;
    } else if(this.props.question.question_type == "multiple_choice_question" ||
        this.props.question.question_type == "true_false_question"){
      return <div style={styles.chooseText}>Choose the <b>BEST</b> answer.</div>;
    } else {
      return "";
    }
  }


  render() {
    var styles = this.getStyles(this.context.theme);
    var unAnsweredWarning = this.getWarning(this.state,  this.props.questionCount, this.props.currentIndex, styles);
    var result = this.getResult(this.props.messageIndex);
    var must_answer_message = this.state && this.state.showMessage ? <div style={styles.warning}>You must select an answer before continuing.</div> : "";
    var confidenceButtons = this.getConfidenceLevels(this.props.confidenceLevels, styles);
    var submitButton = (this.props.currentIndex == this.props.questionCount - 1) ? <button className="btn btn-check-answer" style={styles.submitButton}  onClick={(e)=>{this.submitButtonClicked(e)}}>Submit</button> : "";
    var footer = this.getFooterNav(this.context.theme, styles);
    var navigationDiv = this.getNavigationButtons(styles);

    //Check if we need to display the counter in the top right
    var counter = "";

    if(this.context.theme.shouldShowCounter){
      counter = <span className="counter">{this.props.currentIndex + 1} of {this.props.questionCount}</span>
    }
    var formativeHeader = "";
    if(this.props.settings.assessmentKind.toUpperCase() == "FORMATIVE"){
      formativeHeader =
          <div>
            <div className="row">
            </div>
            <div className="row" style={styles.checkDiv}>
              <div className="col-md-10">
                <h4 style={styles.h4}>{this.props.assessment.title}</h4>
              </div>
              <div className="col-md-2">
              </div>
            </div>
          </div>
    }

    var formativeStyle = this.props.settings.assessmentKind.toUpperCase() == "FORMATIVE" ? {padding: "20px"} : {};
    var submitButtonDiv =  <div style={styles.submitButtonDiv}>
                          {submitButton}
                        </div>;

    if(this.props.settings.confidenceLevels  && this.props.settings.assessmentKind.toUpperCase() == "FORMATIVE"){
      submitButtonDiv = ""
    }

    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        <div className="question">
          <div className="header" style={styles.header}>
                {counter}
            <p>{this.props.question.title}</p>
          </div>
          <div style={formativeStyle}>
            {formativeHeader}
            <form className="edit_item">
              <div className="full_question" tabIndex="0" style={styles.fullQuestion}>
                <div className="inner_question">
                  <div className="question_text" style={styles.questionText}>
                    {this.questionDirections(styles)}
                    <div
                      dangerouslySetInnerHTML={{
                    __html: this.props.question.material
                    }}>
                    </div>
                  </div>
                  <UniversalInput item={this.props.question} isResult={false} registerGradingCallback={this.props.registerGradingCallback}/>
                </div>
                <div className="row">
                  <div className="col-md-5 col-sm-6 col-xs-8" >
                    {result}
                    {confidenceButtons}
                    {navigationDiv}
                    {unAnsweredWarning}
                    {must_answer_message}
                  </div>
                  <div className="col-md-7 col-sm-6 col-xs-4">
                    {submitButtonDiv}
                  </div>
                </div>
              </div>
            </form>
          </div>
          {footer}
        </div>
      </div>
    );
  }

}

Item.propTypes = {
  question         : React.PropTypes.object.isRequired,
  currentIndex     : React.PropTypes.number.isRequired,
  questionCount    : React.PropTypes.number.isRequired,
  messageIndex     : React.PropTypes.number.isRequired,
  confidenceLevels : React.PropTypes.bool.isRequired,
  outcomes         : React.PropTypes.object,
  previousQuestion : React.PropTypes.func.isRequired,
  nextQuestion     : React.PropTypes.func.isRequired,
  selectQuestion   : React.PropTypes.func.isRequired,
  registerGradingCallback : React.PropTypes.func.isRequired
};

Item.contextTypes = {
  theme: React.PropTypes.object
};
