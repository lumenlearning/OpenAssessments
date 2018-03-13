"use strict";

import React              from 'react';
import AssessmentStore    from "../../stores/assessment";
import SettingsStore      from "../../stores/settings";
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import Loading            from "../assessments/loading";
import CheckUnderstanding from "../assessments/check_understanding";
import Item               from "../assessments/item";
import ProgressDropdown   from "../common/progress_dropdown";
import CommunicationHandler from "../../utils/communication_handler";

export default class Assessment extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this.stores = [AssessmentStore, SettingsStore];
    this._bind("getStyles", "registerGradingCallback","selectQuestion", "nextQuestion", "previousQuestion");
    this.state = this.getState(context);
    this.context = context;
    CommunicationHandler.init();
  }

  getState(props, context){
    var showStart = SettingsStore.current().enableStart && !AssessmentStore.isStarted();
    if(AssessmentStore.assessmentResult() != null && !AssessmentStore.isPractice() ){
      context.router.transitionTo("assessment-result");
    } else if(AssessmentStore.assessmentResult() != null && AssessmentStore.isPractice() ){
      if(!AssessmentStore.hasPostedAnalytics() && AssessmentStore.assessmentResult().assessment_results_id) {
        AssessmentActions.assessmentPostAnalytics(AssessmentStore.assessmentResult().assessment_results_id, this.state.settings.externalUserId, this.state.settings.externalContextId);
      }
    }
    return {
      assessment           : AssessmentStore.current(),
      isLoaded             : AssessmentStore.isLoaded(),
      isSubmitted          : AssessmentStore.isSubmitted(),
      question             : AssessmentStore.currentQuestion(),
      currentIndex         : AssessmentStore.currentIndex(),
      questionCount        : AssessmentStore.questionCount(),
      assessmentResult     : AssessmentStore.assessmentResult(),
      showStart            : showStart,
      settings             : SettingsStore.current(),
      answerMessage        : AssessmentStore.answerMessage(),
      studentAnswers       : AssessmentStore.allStudentAnswers(),
      studentAnswer        : AssessmentStore.studentAnswers(),
      allQuestions         : AssessmentStore.allQuestions(),
      outcomes             : AssessmentStore.outcomes(),
      gradingCallback      : null
    }
  }

  componentDidMount(){
    super.componentDidMount();
    if(this.state.isLoaded){
      // Trigger action to indicate the assessment was viewed
      //AssessmentActions.assessmentViewed(this.state.settings, this.state.assessment);
    }
    window.addEventListener('load', this.materialLoaded);
  }

  componentWillUnmount(){
    window.removeEventListener('load', this.materialLoaded)
  }

  materialLoaded() {
    CommunicationHandler.sendSize();
  }
  static newQuestionMessages(){
    CommunicationHandler.sendSizeThrottled();
    CommunicationHandler.scrollParentToTopThrottled();
    if(document.getElementById("focus")){document.getElementById("focus").focus();}
  }

  popup(){
    return "Don’t leave!\n If you leave now your quiz won't be scored, but it will still count as an attempt.\n\n If you want to skip a question or return to a previous question, stay on this quiz and then use the \"Progress\" drop-down menu";
  }


  checkProgress(current, total){
    return Math.floor(current/total * 100);
  }

  registerGradingCallback(callback){
    if (this.state.gradingCallback) {
    } else {
      this.setState({
        gradingCallback: callback
      });
    }
  }

  selectQuestion(qid, finishedCallback=null) {
    if (this.state.gradingCallback) {
      let callback = this.state.gradingCallback;
      this.setState({gradingCallback: null});
      callback(()=>{
        AssessmentActions.selectQuestion(qid);
        if(finishedCallback){
          finishedCallback();
        }
        Assessment.newQuestionMessages();
      });
    } else {
      AssessmentActions.selectQuestion(qid);
      if (finishedCallback) {
        finishedCallback();
      }
      Assessment.newQuestionMessages();
    }
  }

  checkAnswer(qid) {
    AssessmentActions.checkAnswer(qid);
  }

  previousQuestion(finishedCallback=null) {
    if (this.state.gradingCallback) {
      let callback = this.state.gradingCallback;
      this.setState({gradingCallback: null});
      callback(function(){
        AssessmentActions.previousQuestion();
        if (finishedCallback) {
          finishedCallback();
        }
        Assessment.newQuestionMessages();
      });
    } else {
      AssessmentActions.previousQuestion();
      if (finishedCallback) {
        finishedCallback();
      }
      Assessment.newQuestionMessages();
    }
  }

  nextQuestion(finishedCallback = null) {
    if (this.state.gradingCallback) {
      let callback = this.state.gradingCallback;
      this.setState({gradingCallback: null});
      callback(function () {
        AssessmentActions.nextQuestion();
        if (finishedCallback) {
          finishedCallback();
        }
        Assessment.newQuestionMessages();
      });
    } else {
      AssessmentActions.nextQuestion();
      if (finishedCallback) {
        finishedCallback();
      }
      Assessment.newQuestionMessages();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.currentIndex != nextState.currentIndex) return true;

    return !this.state ||
        !((!nextState.gradingCallback && this.state.gradingCallback) ||
        (nextState.gradingCallback && !this.state.gradingCallback));
  }

  resetAnswerMessages() {
    AssessmentStore.resetAnswerMessages();
  }

  render(){
    window.onbeforeunload = this.popup;
    if(AssessmentStore.assessmentResult() != null || this.state.settings.assessmentKind.toUpperCase() != "SUMMATIVE"){
      window.onbeforeunload = null;
    }
    var styles = this.getStyles(this.context.theme)
    var content;
    var progressBar;
    var titleBar;
    if(!this.state.isLoaded || (this.state.isSubmitted && !AssessmentStore.isPractice() )){
      content = <Loading />;
     }else {
      content = <Item
        question         = {this.state.question}
        assessment       = {this.state.assessment}
        currentIndex     = {this.state.currentIndex}
        settings         = {this.state.settings}
        questionCount    = {this.state.questionCount}
        assessmentResult = {this.state.assessmentResult}
        answerMessage     = {this.state.answerMessage}
        allQuestions     = {this.state.allQuestions}
        studentAnswers   = {this.state.studentAnswers}
        studentAnswer   = {this.state.studentAnswer}
        confidenceLevels = {this.state.settings.confidenceLevels}
        previousQuestion = {this.previousQuestion}
        nextQuestion     = {this.nextQuestion}
        selectQuestion   = {this.selectQuestion}
        checkAnswer      = {this.checkAnswer}
        registerGradingCallback = {this.registerGradingCallback}
        outcomes         = {this.state.outcomes}
        resetAnswerMessages = {this.resetAnswerMessages}
        showAnswers = {this.state.settings.showAnswers}
      />;

      progressBar = <div style={styles.progressContainer}>
        {progressText}
        <ProgressDropdown settings={this.state.settings} questions={this.state.allQuestions} currentQuestion={this.state.currentIndex + 1} questionCount={this.state.questionCount} selectQuestion={this.selectQuestion}/>
      </div>;
    }

    var percentCompleted = this.checkProgress(this.state.currentIndex, this.state.questionCount);
    var progressStyle = {width:percentCompleted+"%"};
    var progressText = "";
    var quizType = AssessmentStore.isSummative() ? "Quiz" : "Show What You Know";
    var titleBar = <div style={styles.titleBar}>{this.state.assessment ? this.state.assessment.title : ""}</div>;
    if(this.state.assessment){
      progressText = this.context.theme.shouldShowProgressText ? <div><b>{this.state.assessment.title + " Progress"}</b>{" - You are on question " + (this.state.currentIndex + 1) + " of " + this.state.questionCount}</div> : "";
    }

    if (AssessmentStore.isFormative() ||
        AssessmentStore.isPractice()) {
      progressBar = "";
      titleBar = "";
    }

    return <div className="assessment" style={styles.assessment}>
      {titleBar}
      {progressBar}
      <div className="section_list">
        <div className="section_container">
          {content}
        </div>
      </div>
    </div>;
  }



  getStyles(theme){
    var minWidth = "635px";
    var padding = theme.assessmentPadding;
    if (AssessmentStore.isFormative() ||
        AssessmentStore.isPractice()) {
      padding = "";
      minWidth = "480px";
    }

    return {
      progressBar: {
        backgroundColor: theme.progressBarColor,
        height: theme.progressBarHeight,
      },
      progressDiv: {
        height: theme.progressBarHeight
      },
      assessment: {
        padding: padding,
        backgroundColor: theme.assessmentBackground,
        minWidth: minWidth
      },
      progressContainer: {
        padding: "10px 20px 10px 20px",
        position: "absolute",
        left: "0px",
        top: "44px",
        width: "100%",
        minWidth: minWidth,
        backgroundColor: theme.titleBarBackgroundColor,
      },
      titleBar: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.primaryBackgroundColor,
        color: "white",
        fontSize: "130%",
        minWidth: minWidth,
        //fontWeight: "bold"
      }
    }
  }

}

Assessment.contextTypes = {
  router: React.PropTypes.func,
  theme: React.PropTypes.object,
};
