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

export default class Assessment extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this.stores = [AssessmentStore, SettingsStore];
    this._bind("getStyles", "registerGradingCallback","selectQuestion", "nextQuestion", "previousQuestion");
    this.state = this.getState(context);
    this.context = context;
  }

  getState(props, context){
    var showStart = SettingsStore.current().enableStart && !AssessmentStore.isStarted();
    if(AssessmentStore.assessmentResult() != null){
      context.router.transitionTo("assessment-result");
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
      messageIndex         : AssessmentStore.answerMessageIndex(),
      studentAnswers       : AssessmentStore.allStudentAnswers(),
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
      callback(function(){
        AssessmentActions.selectQuestion(qid);
        if(finishedCallback){
          finishedCallback();
        }
      });
    } else {
      AssessmentActions.selectQuestion(qid);
      if (finishedCallback) {
        finishedCallback();
      }
    }
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
      });
    } else {
      AssessmentActions.previousQuestion();
      if (finishedCallback) {
        finishedCallback();
      }
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
      });
    } else {
      AssessmentActions.nextQuestion();
      if (finishedCallback) {
        finishedCallback();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.currentIndex != nextState.currentIndex) return true;

    return !this.state ||
        !((!nextState.gradingCallback && this.state.gradingCallback) ||
        (nextState.gradingCallback && !this.state.gradingCallback));
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
    if(!this.state.isLoaded || this.state.isSubmitted){
      content = <Loading />;
     }else {
      content = <Item
        question         = {this.state.question}
        assessment       = {this.state.assessment}
        currentIndex     = {this.state.currentIndex}
        settings         = {this.state.settings}
        questionCount    = {this.state.questionCount}
        assessmentResult = {this.state.assessmentResult}
        messageIndex     = {this.state.messageIndex}
        allQuestions     = {this.state.allQuestions}
        studentAnswers   = {this.state.studentAnswers}
        confidenceLevels = {this.state.settings.confidenceLevels}
        previousQuestion = {this.previousQuestion}
        nextQuestion     = {this.nextQuestion}
        selectQuestion   = {this.selectQuestion}
        registerGradingCallback = {this.registerGradingCallback}
        outcomes         = {this.state.outcomes}
      />;

      progressBar = <div style={styles.progressContainer}>
        {progressText}
        <ProgressDropdown settings={this.state.settings} questions={this.state.allQuestions} currentQuestion={this.state.currentIndex + 1} questionCount={this.state.questionCount} selectQuestion={this.selectQuestion}/>
      </div>;
    }

    var percentCompleted = this.checkProgress(this.state.currentIndex, this.state.questionCount);
    var progressStyle = {width:percentCompleted+"%"};
    var progressText = "";
    var quizType = this.state.settings.assessmentKind.toUpperCase() === "SUMMATIVE" ? "Quiz" : "Show What You Know";
    var titleBar = <div style={styles.titleBar}>{this.state.assessment ? this.state.assessment.title : ""}</div>;
    if(this.state.assessment){
      progressText = this.context.theme.shouldShowProgressText ? <div><b>{this.state.assessment.title + " Progress"}</b>{" - You are on question " + (this.state.currentIndex + 1) + " of " + this.state.questionCount}</div> : "";
    }

    if (this.state.settings.assessmentKind.toUpperCase() == "FORMATIVE" ||
        this.state.settings.assessmentKind.toUpperCase() == "PRACTICE") {
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
    if (this.state.settings.assessmentKind.toUpperCase() == "FORMATIVE" ||
        this.state.settings.assessmentKind.toUpperCase() == "PRACTICE") {
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