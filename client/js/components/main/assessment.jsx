"use strict";

import React              from 'react';
import AssessmentStore    from "../../stores/assessment";
import SettingsStore      from "../../stores/settings";
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import Loading            from "../assessments/loading";
import Item               from "../assessments/item";
import ProgressDropdown   from "../common/progress_dropdown";
import CommunicationHandler from "../../utils/communication_handler";
import TitleBar from "../common/TitleBar";

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
      gradingCallback      : null,
      newQuestion          : false
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.newQuestion) { // if last render caught newQuestion, then we've focused, so reset
      this.setState({newQuestion: false});
    }
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
        this.setState({questionSelected: true});
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
        this.setState({newQuestion: true});
      });
    } else {
      AssessmentActions.previousQuestion();
      if (finishedCallback) {
        finishedCallback();
      }
      Assessment.newQuestionMessages();
      this.setState({newQuestion: true});
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
        this.setState({newQuestion: true});
      });
    } else {
      AssessmentActions.nextQuestion();
      if (finishedCallback) {
        finishedCallback();
      }
      Assessment.newQuestionMessages();
      this.setState({newQuestion: true});
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
        newQuestion      = {this.state.newQuestion}
      />;
    }

    var percentCompleted = this.checkProgress(this.state.currentIndex, this.state.questionCount);
    var progressStyle = {width:percentCompleted+"%"};
    var progressText = "";
    var quizType = AssessmentStore.isSummative() ? "Quiz" : "Show What You Know";
    if(this.state.assessment){
      progressText = this.context.theme.shouldShowProgressText ? <div><b>{this.state.assessment.title + " Progress"}</b>{" - You are on question " + (this.state.currentIndex + 1) + " of " + this.state.questionCount}</div> : "";
    }

    return <div className="assessment" style={styles.assessment}>
      {this.renderTitleBar()}
      {this.renderProgressBar(styles)}
      <div className="section_list">
        <div className="section_container">
          {content}
        </div>
      </div>
    </div>;
  }

  renderTitleBar() {
    if (AssessmentStore.isFormative() || AssessmentStore.isPractice()) {
      return;
    } else {
      return (
        <TitleBar
          title={this.state.assessment ? this.state.assessment.title : ""}
          assessmentKind={this.state.settings.assessmentKind}
          assessmentLoaded={this.state.isLoaded}
          />
      );
    }
  }

  renderProgressBar(styles) {
    if (AssessmentStore.isFormative() || AssessmentStore.isPractice()) {
      return;
    } else {
      return (
        <div style={styles.progressContainer}>
          {this.getProgressText()}
          <ProgressDropdown
            settings={this.state.settings}
            questions={this.state.allQuestions}
            currentQuestion={this.state.currentIndex + 1}
            questionCount={this.state.questionCount}
            selectQuestion={this.selectQuestion}
            />
        </div>
      );
    }
  }

  getProgressText() {
    if (this.state.assessment && this.context.theme.shouldShowProgressText) {
      return (
        <div>
          <b>{`${this.state.assessment.title} Progress`}</b>{` - You are on question ${this.state.currentIndex + 1} of ${this.state.questionCount}`}
        </div>
      );
    }
  }

  getStyles(theme){
    var minWidth = "320px";

    return {
      progressBar: {
        backgroundColor: theme.progressBarColor,
        height: theme.progressBarHeight,
      },
      progressDiv: {
        height: theme.progressBarHeight
      },
      assessment: {
        padding: 0,
        backgroundColor: theme.assessmentBackground,
        minWidth: minWidth
      },
      progressContainer: {
        padding: "10px 20px 10px 20px",
        left: "0px",
        top: "44px",
        width: "100%",
        minWidth: minWidth,
        backgroundColor: theme.titleBarBackgroundColor,
      }
    }
  }
}

Assessment.contextTypes = {
  router: React.PropTypes.func,
  theme: React.PropTypes.object,
};
