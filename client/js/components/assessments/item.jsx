"use strict";

import React              from 'react';
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import UniversalInput     from "./universal_input";
import AssessmentStore    from "../../stores/assessment";


export default class Item extends BaseComponent{
  constructor(){
    super();
    this._bind("getConfidenceLevels", "inputOrReview", "confidenceLevelClicked","submitAssessment", "checkAnswerButton", "checkAnswerButtonClicked", "nextButtonClicked", "previousButtonClicked", "getPreviousButton", "getNextButton", "getStyles", "clearShowMessage");
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
      if(AssessmentStore.hasSelectedAnswerForCurrent()){
        AssessmentActions.selectConfidenceLevel(val, currentIndex);
        if(that.props.currentIndex == that.props.questionCount - 1 && that.props.settings.assessmentKind.toUpperCase() == "FORMATIVE"){
          if (that.props.showAnswers) {
            that.props.checkAnswer(that.props.currentIndex);
          } else {
            that.submitAssessment();
          }
        } else {
          if (that.props.showAnswers) {
            that.clearShowMessage();
            that.props.checkAnswer(that.props.currentIndex);
          } else {
            // Else, do the old behavior.
            that.clearShowMessage();
            AssessmentActions.nextQuestion();
          }
        }
      } else {
        that.setState({showMessage: true});
      }
    });
  }

  checkAnswerButtonClicked(e) {
    e && e.preventDefault();
    let that = this;
    this.props.selectQuestion(this.props.currentIndex, function () {
      if (AssessmentStore.hasSelectedAnswerForCurrent()) {
        that.setState({showMessage: false});
        that.props.checkAnswer(that.props.currentIndex);

        // If it's a practice quiz submit the full quiz when they've checked all the answers
        if (AssessmentStore.isPractice() && Item.checkCompletion() === true) {
          that.submitAssessment();
        }
      } else {
        that.setState({showMessage: true});
      }
    });
  }

  submitAssessmentButtonClicked(e){
    e && e.preventDefault();
    this.props.selectQuestion(this.props.currentIndex, this.submitAssessment);
  }

  submitAssessment(){
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
    var questionsNotAnswered = AssessmentStore.unansweredQuestions();
    if(questionsNotAnswered.length > 0){
      return questionsNotAnswered;
    }
    return true;
  }

  getWarning(state, questionCount, questionIndex, styles){
    if(state && state.unAnsweredQuestions && state.unAnsweredQuestions.length > 0 && questionIndex + 1 == questionCount){
      return <div style={styles.warning}><i className="glyphicon glyphicon-exclamation-sign"></i> You left question(s) {state.unAnsweredQuestions.join()} blank. Use the "Progress" drop-down menu at the top to go back and answer the question(s), then come back and submit.</div>
    }

    return "";
  }

  getConfidenceLevels(showLevels, styles){
    if(showLevels){
      if (this.props.showAnswers && this.props.question.confidenceLevel) {
        return (
          <div className="confidence_feedback_wrapper" style={styles.confidenceFeedbackWrapper}>
            <p>Your confidence level in answering this question was: {`${this.props.question.confidenceLevel}`}.</p>
          </div>
        );
      } else {
        var levelMessage = <div tabIndex="0" style={{marginBottom: "10px"}}>How sure are you of your answer?</div>;
        return    (<div className="confidence_wrapper" style={styles.confidenceWrapper}>
                    {levelMessage}
                    <input type="button" style={styles.maybeButton} className="btn btn-check-answer" value="Just A Guess" onClick={(e) => { this.confidenceLevelClicked(e, "Just A Guess", this.props.currentIndex) }}/>
                    <input type="button" style={{...styles.margin, ...styles.probablyButton}} className="btn btn-check-answer" value="Pretty Sure" onClick={(e) => { this.confidenceLevelClicked(e, "Pretty Sure", this.props.currentIndex) }}/>
                    <input type="button" style={{...styles.margin, ...styles.definitelyButton}} className="btn btn-check-answer" value="Very Sure" onClick={(e) => { this.confidenceLevelClicked(e, "Very Sure", this.props.currentIndex) }}/>
                  </div>
                  );
        }
      }
  }

  getNavigationButtons(styles) {
    // if special case ...
    if (this.props.showAnswers) {
      if ( this.props.questionCount == 1 || this.context.theme.shouldShowNextPrevious) {
        return "";
      }
    } else {
      if ( this.props.questionCount == 1 || (!this.context.theme.shouldShowNextPrevious && this.props.confidenceLevels)) {
        return "";
      }
    }

    return <div className="navigationBtnWrapper" style={styles.navigationWrapper}>
      {this.getPreviousButton(styles)}
      {this.getNextButton(styles)}
    </div>
  }

  getNextButton(styles) {
    var disabled = "";

    if (this.props.showAnswers) {
      if (AssessmentStore.hasSubmittedCurrent() && !(this.props.currentIndex == this.props.questionCount - 1)) {
        return (
          <button className={"btn btn-next-item"} style={styles.nextButton} onClick={(e) => { this.nextButtonClicked(e) }}>
            Next Question
          </button>
        );
      }
    } else {
      disabled = (this.props.currentIndex == this.props.questionCount - 1) ? "disabled" : "";

      return (
          <button className={"btn btn-next-item " + disabled} style={styles.nextButton} onClick={(e) => { this.nextButtonClicked(e) }}>
            <span>Next</span> <i className="glyphicon glyphicon-chevron-right"></i>
          </button>);
    }
  }

  getPreviousButton(styles) {
    if (this.props.showAnswers) {
      return "";
    }
    var prevButtonClassName = "btn btn-prev-item " + ((this.props.currentIndex > 0) ? "" : "disabled");
    return (
        <button className={prevButtonClassName} style={styles.previousButton} onClick={(e) => { this.previousButtonClicked(e) }}>
          <i className="glyphicon glyphicon-chevron-left"></i><span>Previous</span>
        </button>);
  }


  // getResult(answer) {
  //   if (answer == null) {
  //     return ""
  //   }
  //   var result = "";
  //   let feedback = "";
  //
  //   if (answer.feedback_only) {
  //   }
  //   else if (answer.correct) {
  //     result = <p style={{color: "#6fb88a" }}>Correct</p>
  //   }
  //   else if (!answer.correct && answer.score > 0) {
  //     result = <p style={{color: "#6fb88a" }}>Partially Correct</p>
  //   }
  //   else if (!answer.correct) {
  //     result = <p style={{color: '#e0542b'}}>Incorrect</p>
  //   }
  //
  //   if(typeof answer.feedback == 'object'){
  //     feedback = answer.feedback.map((feedbackItem) => {
  //       return <p>{feedbackItem}</p>
  //     });
  //   } else {
  //     feedback = <div dangerouslySetInnerHTML={ this.getGeneralFeedbackMarkup(answer) }/>
  //   }
  //
  //   return <div className="check_answer_result">
  //     {result}
  //     {feedback}
  //   </div>
  // }

  getGeneralFeedbackMarkup(answer){
    return { __html: answer.feedback }
  }

  questionDirections(styles){
    if( AssessmentStore.isPractice() ){
      return "";
    }

    if(this.props.question.question_type == "multiple_answers_question"){
      return <div style={styles.chooseText}>Choose all that apply</div>;
    } else if(this.props.question.question_type == "multiple_choice_question" ||
        this.props.question.question_type == "true_false_question"){
      return <div style={styles.chooseText}>Choose the best answer</div>;
    }
    else if (this.props.question.question_type == 'multiple_dropdowns_question') {
      return <div style={styles.chooseText} tabIndex="0">Complete the sentence by choosing the best answer from the dropdown's options</div>
    }
    else {
      return "";
    }
  }

  questionContent() {
    if(this.props.question.question_type !== 'multiple_dropdowns_question'){
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: this.props.question.material
          }}>
        </div>
      )
    }
  }//questionContent


  render() {
    var styles = this.getStyles(this.context.theme);
    var must_answer_message = this.state && this.state.showMessage ? <div style={styles.warning}>You must select an answer before continuing.</div> : "";

    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        <div className="question">
          <div style={styles.formativePadding}>
            {this.formativeHeader(styles)}

            <form className="edit_item" >
              <div className="full_question" style={styles.fullQuestion}>
                {this.simple_progress(styles)}
                <div className="inner_question" style={styles.innerQuestion}>
                  <div className="question_text" style={styles.questionText}>
                    {this.questionDirections(styles)}
                    {this.questionContent()}
                  </div>
                  {this.inputOrReview(styles)}
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-10" >
                    {/*this.props.question.question_type === 'essay_question' ? this.getResult(this.props.answerMessage) : null*/}
                    {this.getConfidenceLevels(this.props.confidenceLevels, styles)}
                    {this.checkAnswerButton(styles)}
                    {this.getNavigationButtons(styles)}
                    {this.getWarning(this.state,  this.props.questionCount, this.props.currentIndex, styles)}
                    {must_answer_message}
                  </div>
                  <div className="col-md-7 col-sm-6 col-xs-4">
                    {this.submitAssessmentButton(styles)}
                  </div>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }

  inputOrReview(styles) {
    if (this.props.answerMessage == null || ( !AssessmentStore.isFormative() && !AssessmentStore.isPractice())) {
      return <UniversalInput
          item={this.props.question}
          isResult={false}
          chosen={this.props.studentAnswer}
          registerGradingCallback={this.props.registerGradingCallback}/>
    } else {
      let answerFeedback = {};
      if( this.props.answerMessage && this.props.answerMessage.answerFeedback ){
        answerFeedback = this.props.answerMessage.answerFeedback
      }

      return <UniversalInput
          item={this.props.question}
          isResult={true}
          chosen={this.props.studentAnswer}
          correctAnswers={this.props.question.correct}
          answerFeedback={answerFeedback}
      />
    }
  }

  submitAssessmentButton(styles) {
    if (this.props.showAnswers) {
      if (this.props.currentIndex == this.props.questionCount - 1 && Item.checkCompletion() === true && AssessmentStore.hasSubmittedCurrent()) {
        return <div style={styles.submitAssessmentButtonDiv}>
          <button className="btn btn-check-answer"
                  style={styles.submitAssessmentButton}
                  onClick={(e) => { this.submitAssessmentButtonClicked(e) }}
          >Submit</button>
        </div>
      } else {
        return "";
      }


    } else {
      if ((AssessmentStore.isFormative() && this.props.confidenceLevels) ||
          (AssessmentStore.isPractice()) ||
          (this.props.currentIndex != this.props.questionCount - 1)) {
        return ""
      }

      return <div style={styles.submitAssessmentButtonDiv}>
        <button className="btn btn-check-answer"
                style={styles.submitAssessmentButton}
                onClick={(e) => { this.submitAssessmentButtonClicked(e) }}
        >Submit</button>
      </div>
    }
  }

  checkAnswerButton(styles) {
    if ( !AssessmentStore.isPractice() ) {
      return ""
    }
    var showingResult = this.props.answerMessage && !this.props.answerMessage.allowResubmit;

    return <div style={styles.checkAnswerButtonDiv}>
      <button className="btn btn-check-answer"
              style={styles.checkAnswerButton}
              onClick={(e) => { this.checkAnswerButtonClicked(e) }}
              disabled={showingResult}
      >Check Answer</button>
    </div>
  }

  formativeHeader(styles) {
    var formativeHeader = "";
    if (AssessmentStore.isFormative()) {
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
    return formativeHeader
  }

  //Check if we need to display the counter in the top right
  simple_progress(styles) {
    if ( this.props.questionCount > 1 && AssessmentStore.isPractice()) {
      return <span style={styles.counter} aria-label={"You are on question " + (this.props.currentIndex + 1) + " of " + this.props.questionCount }>
            {this.props.currentIndex + 1} of {this.props.questionCount}
            </span>
    } else {
      return ""
    }
  }

  getStyles(theme){
    var navMargin = "-35px 650px 0 0";
    if(this.props.settings.confidenceLevels)
      navMargin = "-75px 20px 0 0";

    var marginTop = "100px";
    var boxShadow = theme.assessmentContainerBoxShadow;
    if (AssessmentStore.isFormative() ||
        AssessmentStore.isPractice()) {
      marginTop = "0px";
      boxShadow = "";
    }

    var extraPadding = AssessmentStore.isFormative() ? "20px" : "";

    return {
      formativePadding:{
        padding: extraPadding
      },
      assessmentContainer:{
        marginTop: marginTop,
        boxShadow: boxShadow,
        borderRadius: theme.assessmentContainerBorderRadius
      },
      header: {
        backgroundColor: theme.headerBackgroundColor,
      },
      fullQuestion:{
        backgroundColor: AssessmentStore.isFormative() ? theme.outcomesBackgroundColor : theme.fullQuestionBackgroundColor,
        paddingBottom: "20px",
      },
      innerQuestion: {
        maxWidth: "650px",
      },
      questionText: {
        color: theme.questionTextColor,
        fontSize: theme.questionTextFontSize,
        fontWeight: theme.questionTextFontWeight,
        padding: theme.questionTextPadding,
      },
      nextButton: {
        backgroundColor: theme.nextButtonBackgroundColor,
        color: theme.probablyColor,
        width: theme.probablyWidth,
        padding: "8px !important",
        margin: theme.nextButtonMargin,
      },
      previousButton: {
        backgroundColor: theme.previousButtonBackgroundColor,
        marginRight: "20px",
        color: theme.probablyColor,
        width: theme.probablyWidth,
        padding: "8px !important",
      },
      maybeButton: {
        width: theme.maybeWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.maybeColor,
        padding: "8px !important",
      },
      probablyButton: {
        width: theme.probablyWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.probablyColor,
        padding: "8px !important",
      },
      definitelyButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.definitelyColor,
        padding: "8px !important",
      },
      submitAssessmentButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.submitBackgroundColor,
        color: theme.definitelyColor,

      },
      checkAnswerButton: {
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
      confidenceFeedbackWrapper: {
        border: theme.confidenceFeedbackWrapperBorder,
        borderRadius: theme.confidenceFeedbackWrapperBorderRadius,
        width: theme.confidenceFeedbackWrapperWidth,
        height: theme.confidenceFeedbackWrapperHeight,
        padding: theme.confidenceFeedbackWrapperPadding,
        margin: theme.confidenceFeedbackWrapperMargin,
        backgroundColor: theme.confidenceFeedbackWrapperBackgroundColor,
      },
      navigationWrapper: {
        width: "300px",
        height: theme.confidenceWrapperHeight,
        margin: theme.navigationWrapperMargin,
        backgroundColor: theme.confidenceWrapperBackgroundColor,
      },
      margin: {
       marginLeft: "5px"
      },
      navButtons: {
        margin: navMargin
      },
      submitAssessmentButtonDiv: {
        marginLeft: "20px",
      },
      checkAnswerButtonDiv: {
        marginLeft: "20px",
        marginTop: "20px"
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
        color: "white",
        fontWeight: "bold",
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: "normal",
        letterSpacing: "0px"
      },
      chooseText: {
        color: "#555",
        fontWeight: "600",
        paddingBottom: "17px"
      },
      counter: {
        color: 'black',
        float: "right"
      }

    }
  }

}//item class

Item.propTypes = {
  question         : React.PropTypes.object.isRequired,
  currentIndex     : React.PropTypes.number.isRequired,
  questionCount    : React.PropTypes.number.isRequired,
  answerMessage     : React.PropTypes.object,
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
