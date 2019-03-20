"use strict";

// Dependencies
import React from "react";
import $ from "jquery";
// Actions
import AssessmentActions from "../../actions/assessment";
// Subcomponents
import StartFormative from "./formative/StartFormative";
import StartSummative from "./summative/StartSummative";
import StartSwyk from "./swyk/StartSwyk";
import TeacherOptions from "./teacher_options/TeacherOptions";
import WaitModal from "./summative/feature/WaitModal.jsx";
// Utils
import CommHandler from "../../utils/communication_handler";

// Check Understanding Component
export default class CheckUnderstanding extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false
    }

    this.waitOrStart = this.waitOrStart.bind(this);
  }

  render() {
    let styles = this.getStyles(this.props, this.context.theme);

    return (
      <div className="assessment-container" style={styles.assessmentContainer}>
        {this.renderWaitModal()}
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

    // If this is an LTI Launch and above conditions were not met, return the
    // Start Summative Assessment screen.
    if (this.props.isLti) {
      return (
        <StartSummative
          assessmentAttempts={this.props.assessmentAttempts}
          assessmentAttemptsOutcomes={this.props.assessmentAttemptsOutcomes}
          studyAndMasteryFeedback={this.props.studyAndMasteryFeedback}
          maxAttempts={this.props.maxAttempts}
          maxAttemptsReached={this.maxAttemptsReached()}
          title={this.props.title}
          startButton={this.renderStartButton(styles)}
          studyButton={this.renderStudyButton(styles)}
          userAttempts={this.props.userAttempts + 1}
          />
      );
    }
  }

  maxAttemptsReached() {
    // if the user's number of attempts are equal to or more than the max number
    // of attempts allowed, and the user isn't an admin, return true.
    return this.props.userAttempts >= this.props.maxAttempts && this.props.ltiRole !== "admin";
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
          onClick={this.waitOrStart}
          >
            {this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW" ? "Start Pre-test" : "Start Quiz"}
        </button>
      </div>
    );
  }

  waitOrStart() {
    // if this is a summative assessment...
    if (this.props.assessmentKind.toUpperCase() === "SUMMATIVE") {
      // if the user id ends in a number greater than three and
      // if it hasn't been at least 5 minutes since their last attempt
      // then pester the user with wait modal.
      if (this.calculateUserIdLastDigitLastAttempt() > 3 &&
          this.calculateTimeSinceLastAttempt() <= 5) {
            this.showWaitModal();
      // otherwise, start the assessment attempt
      } else {
        this.startAssessment(
          this.props.eid,
          this.props.assessmentId,
          this.context
        );
      }
    //  otherwise, start the assessment attempt
    } else {
      this.startAssessment(
        this.props.eid,
        this.props.assessmentId,
        this.context
      );
    }
  }

  /**
   * A/B Testing
   *
   * Casing off of last digit of the User Id to determine what verbage to use in
   * the body of the wait modal.
   *
   * 0-3: The modal shouldn't appear at all
   * 4-6: Content set 1
   * 7-9: Content set 2
   */
  getWaitModalBodyText() {
    let userIdLastDigit = this.calculateUserIdLastDigitLastAttempt();
    let bodyText = "";

    switch (userIdLastDigit) {
      case "0":
      case "1":
      case "2":
      case "3":
        break;
      case "4":
      case "5":
      case "6":
        bodyText = "content set 1";
        break;
      case "7":
      case "8":
      case "9":
        bodyText = "content set 2";
        break;
      default:
        bodyText = "Are you sure you'd like to start the quiz now, or would you like to study for longer to try to improve your grade?";
    }

    return bodyText;
  }

  calculateTimeSinceLastAttempt() {
    if (this.props.assessmentAttempts && this.props.assessmentAttempts.length > 0) {
      let now = new Date();
      let attemptTimeStamp = (new Date(this.props.assessmentAttempts[this.props.assessmentAttempts.length - 1].assessment_result_created_at)).getTime();
      let nowTimeStamp = now.getTime();

      let differenceInMilliseconds = Math.abs(attemptTimeStamp - nowTimeStamp);
      let differenceInMinutes = Math.floor((differenceInMilliseconds / 1000) / 60);

      return differenceInMinutes;
    }
  }

  calculateUserIdLastDigitLastAttempt() {
    if (this.props.assessmentAttempts && this.props.assessmentAttempts.length > 0) {
      return this.props.assessmentAttempts[this.props.assessmentAttempts.length - 1].user_id.toString().split("").pop();
    }
  }

  renderWaitModal() {
    let bodyContent = this.getWaitModalBodyText();

    if (this.state.showModal && bodyContent !== "") {
      return (
        <WaitModal
          bodyContent={bodyContent}
          hideModal={() => this.hideWaitModal()}
          showModal={() => this.showWaitModal()}
          startAssessment={() => this.startAssessment(
            this.props.eid,
            this.props.assessmentId,
            this.context
          )}
          />
      );
    }
  }

  startAssessment(eid, assessmentId, context) {
    AssessmentActions.start(eid, assessmentId, this.props.externalContextId);
    AssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, $("#srcData").text());
    context.router.transitionTo("assessment");
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

  showWaitModal() {
    this.setState({showModal: true});
  }

  hideWaitModal() {
    this.setState({showModal: false});
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
