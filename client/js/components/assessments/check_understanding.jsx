"use strict";

// Dependencies
import React from "react";
import $ from "jquery";
// Actions
import AssessmentActions from "../../actions/assessment";
// Subcomponents
import MaxAttempts from "./summative/maxAttempts";
import StartFormative from "./formative/StartFormative";
import StartSummative from "./summative/StartSummative";
import StartSwyk from "./swyk/StartSwyk";
import TeacherOptions from "./teacher_options/TeacherOptions";
// Utils
import CommHandler from "../../utils/communication_handler";

// Check Understanding Component
export default class CheckUnderstanding extends React.Component{

  render() {
    let styles = this.getStyles(this.props, this.context.theme);

    return (
      <div className="assessment-container" style={styles.assessmentContainer}>
        {this.renderTeacherOptions()}
        {this.renderContent(styles)}
      </div>
    );
  }

  renderTeacherOptions() {
    if (this.props.assessmentKind.toUpperCase() === "SUMMATIVE" &&
        this.props.ltiRole === "admin" &&
        this.props.isLti) {
      return (
        <TeacherOptions
          assessmentId={this.props.assessmentId}
          context={this.context}
          externalContextId={this.props.externalContextId}
          />
      );
    }
  }

  renderContent(styles) {
    let content = "There was an error, contact your teacher.";

    switch (this.props.assessmentKind.toUpperCase()) {
      case "SUMMATIVE":
        content = this.getStartSummative(this.context.theme, styles, this.props);
        break;
      case "SHOW_WHAT_YOU_KNOW":
        content = this.getStartSwyk(styles);
        break;
      case "FORMATIVE":
        content = this.getStartFormative(this.context.theme, styles);
        break;
    }

    return content;
  }

  getStartSummative(theme, styles, props) {
    // If we shouldn't show attempts, bail.
    if (!theme.shouldShowAttempts) {
      return;
    }

    // If there are no more quiz attempts available and user == student, render
    // the Max Attempts screen.
    if (props.userAttempts >= props.maxAttempts && props.ltiRole !== "admin") {
      return <MaxAttempts />;
    }

    // If this is an LTI Launch and above conditions were not met, return the
    // Start Summative Assessment screen.
    if (this.props.isLti) {
      return (
        <StartSummative
          assessmentAttempts={this.props.assessmentAttempts}
          assessmentAttemptsOutcomes={this.props.assessmentAttemptsOutcomes}
          studyAndMasteryFeedback={this.props.studyAndMasteryFeedback}
          maxAttempts={this.props.maxAttempts}
          title={this.props.title}
          startButton={this.renderStartButton(styles)}
          studyButton={this.renderStudyButton(styles)}
          userAttempts={this.props.userAttempts + 1}
          />
      );
    }
  }

  getStartSwyk(styles) {
    return <StartSwyk startButton={this.renderStartButton(styles)} />;
  }

  getStartFormative(theme, styles) {
    return (
      <StartFormative
        theme={theme}
        title={this.props.title}
        startButton={this.renderStartButton(styles)}
        />
    );
  }

  renderStartButton(styles) {
    // If this is a summative assessment, max attempts have been reached, and
    // user has LTI Role of 'Admin', bail
    if (this.props.userAttempts >= this.props.maxAttempts &&
        this.props.assessmentKind.toUpperCase() === "SUMMATIVE" &&
        this.props.ltiRole !== "admin") {
      return;
    }

    // if this is a formative assessment, bail
    if (this.props.assessmentKind.toUpperCase() === "FORMATIVE") {
      return;
    }

    return (
      <div className="start-assessment-button-wrapper" style={styles.buttonWrapper}>
        <button
          style={styles.startButton}
          className="btn btn-info"
          onClick={() => {this.startAssessment(this.props.eid, this.props.assessmentId, this.context)}}
          >
            {this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW" ? "Start Pre-test" : "Start Quiz"}
        </button>
      </div>
    );
  }

  startAssessment(eid, assessmentId, context) {
    // if student should be pestered to go back and study, render wait/WAIT!...
    // TODO: Add an appropriate condition to case off of.
    if (this.props.assessmentKind.toUpperCase() === "SUMMATIVE") {
      this.props.showModal();
    // otherwise, load the assessment.
    } else {
      AssessmentActions.start(eid, assessmentId, this.props.externalContextId);
      AssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, $("#srcData").text());
      context.router.transitionTo("assessment");
    }
  }

  renderStudyButton(styles) {
    return (
      <div className="study-more-button-wrapper" style={styles.studyButtonWrapper}>
        <button
          style={styles.startButton}
          className="btn btn-info"
          onClick={()=>{CommHandler.navigateHome()}}
          >
            Study More
        </button>
      </div>
    );
  }

  getStyles(props, theme) {
    return {
      assessmentContainer:{
        marginTop: "0px"
      },
      startButton: {
        margin: "5px 5px 5px -5px",
        height: "36px",
        minWidth: "97px",
        backgroundColor: "#1e74d1 !important",
        border: "#004c9f"
      },
      buttonWrapper: {
        textAlign: props.assessmentKind.toUpperCase() !== "SUMMATIVE" ? "left" : "right"
      },
      studyButtonWrapper: {
        marginLeft: "8px"
      }
    }
  }
}

CheckUnderstanding.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func,
};
