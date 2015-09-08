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
    this._bind["checkCompletion", "getStyles"];
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
      outcomes             : AssessmentStore.outcomes()
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

  getStyles(theme){
    var minWidth = this.state.settings.assessmentKind.toUpperCase()  == "FORMATIVE" ? "480px" : "635px";
    return {
      progressBar: {
        backgroundColor: theme.progressBarColor,
        height: theme.progressBarHeight,
      },
      progressDiv: {
        height: theme.progressBarHeight
      },
      assessment: {
        padding: this.state.settings.assessmentKind.toUpperCase()  == "FORMATIVE" ? "" : theme.assessmentPadding,
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
    // } else if(this.state.showStart){
    //     content         = <CheckUnderstanding
    //     title           = {this.state.assessment.title}
    //     name            = {this.state.question.name}
    //     maxAttempts     = {this.state.settings.allowedAttempts}
    //     userAttempts    = {this.state.settings.userAttempts}
    //     eid             = {this.state.settings.lisUserId}
    //     isLti           = {this.state.settings.isLti}
    //     assessmentId    = {this.state.assessment.assessmentId}
    //     assessmentKind  = {this.state.settings.assessmentKind}
    //     primaryOutcome  = {this.state.outcomes[0]}
    //     ltiRole         = {this.state.settings.ltiRole}
    //     icon            = {this.state.settings.images.QuizIcon_svg}/>;
    //     progressBar     = <div style={styles.progressContainer}>
    //                         {progressText}
    //                         <ProgressDropdown disabled={true} questions={this.state.allQuestions} currentQuestion={this.state.currentIndex + 1} questionCount={this.state.questionCount} />
    //                       </div>;

    // } 
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
        outcomes         = {this.state.outcomes}/>;
        progressBar      =  <div style={styles.progressContainer}>
                              {progressText}
                              <ProgressDropdown settings={this.state.settings} questions={this.state.allQuestions} currentQuestion={this.state.currentIndex + 1} questionCount={this.state.questionCount} />
                            </div>;
    // TODO figure out when to mark an item as viewed. assessmentResult must be valid before this call is made.
      // AssessmentActions.itemViewed(this.state.settings, this.state.assessment, this.state.assessmentResult);
    }

    var percentCompleted = this.checkProgress(this.state.currentIndex, this.state.questionCount);
    var progressStyle = {width:percentCompleted+"%"};
    var progressText = "";
    var quizType = this.state.settings.assessmentKind.toUpperCase() === "SUMMATIVE" ? "Quiz" : "Show What You Know";
    var titleBar = this.state.settings.assessmentKind.toUpperCase() === "FORMATIVE" ?  "" : <div style={styles.titleBar}>{this.state.assessment ? this.state.assessment.title : ""}</div>;
    if(this.state.assessment){
      progressText = this.context.theme.shouldShowProgressText ? <div><b>{this.state.assessment.title + " Progress"}</b>{" - You are on question " + (this.state.currentIndex + 1) + " of " + this.state.questionCount}</div> : "";
    }
    progressBar = this.state.settings.assessmentKind.toUpperCase() === "FORMATIVE" ? "" : progressBar;
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

}

Assessment.contextTypes = {
  router: React.PropTypes.func,
  theme: React.PropTypes.object,
};