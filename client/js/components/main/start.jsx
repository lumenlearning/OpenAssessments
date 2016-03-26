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
import $                  from "jquery";
import CommHandler        from "../../utils/communication_handler";
import FullPostNav        from "../post_nav/full_post_nav.jsx";

export default class Start extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this.stores = [AssessmentStore, SettingsStore];
    this._bind["checkCompletion", "getStyles"];
    this.state = this.getState(context);
    this.context = context;
  }

  getState(context){
    var showStart = SettingsStore.current().enableStart && !AssessmentStore.isStarted();
    if(!showStart){
          AssessmentActions.start(SettingsStore.current().eId, SettingsStore.current().assessmentId, SettingsStore.current().externalContextId);
          AssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, $('#srcData').text());
          context.router.transitionTo("assessment");
    }
    return {
      showStart            : showStart,
      questionCount        : AssessmentStore.questionCount(),
      settings             : SettingsStore.current(),
    }
  }

  componentDidMount(){
    super.componentDidMount();
    if(this.state.isLoaded){
      // Trigger action to indicate the assessment was viewed
      AssessmentActions.assessmentViewed(this.state.settings, this.state.assessment);
    }
    CommHandler.sendSize();
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
    var styles = this.getStyles(this.context.theme)
    var content;
    var progressBar;
    var titleBar;

    if(this.state.showStart){
        content         = <CheckUnderstanding
        title           = {this.state.settings.assessmentTitle}
        maxAttempts     = {this.state.settings.allowedAttempts}
        userAttempts    = {this.state.settings.userAttempts}
        eid             = {this.state.settings.lisUserId}
        userId          = {this.state.settings.userId}
        isLti           = {this.state.settings.isLti}
        assessmentId    = {this.state.settings.assessmentId}
        assessmentKind  = {this.state.settings.assessmentKind}
        ltiRole         = {this.state.settings.ltiRole}
        externalContextId = {this.state.settings.externalContextId}
        accountId       = {this.state.settings.accountId}
        icon            = {this.state.settings.images.QuizIcon_svg}/>;
        progressBar     = <div style={styles.progressContainer}>
                            <ProgressDropdown disabled={true} settings={this.state.settings} questions={this.state.allQuestions} currentQuestion={this.state.currentIndex + 1} questionCount={this.state.questionCount} />
                          </div>;

    }
    var quizType = this.state.settings.assessmentKind.toUpperCase() === "SUMMATIVE" ? "Quiz" : "Show What You Know";
    var titleBar = this.state.settings.assessmentKind.toUpperCase() === "FORMATIVE" ?  "" : <div style={styles.titleBar}>{this.state.settings ? this.state.settings.assessmentTitle : ""}</div>;
    progressBar = this.state.settings.assessmentKind.toUpperCase() === "FORMATIVE" ? "" : progressBar;

    return <div className="assessment" style={styles.assessment}>
      {titleBar}
      {progressBar}
      <div className="section_list">
        <div className="section_container">
          {content}
        </div>
      </div>
      <FullPostNav/>
    </div>;
  }

}

Start.contextTypes = {
  router: React.PropTypes.func,
  theme: React.PropTypes.object,
};