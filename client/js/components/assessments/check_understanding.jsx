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
    if (this.shouldNotRenderStartButton()) {
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

  shouldNotRenderStartButton() {
    // If this is a summative assessment, max attempts have been reached, and
    // user has LTI Role of 'Admin', OR if this is a formative assessment, bail.
    if ((this.isSummative() && this.maxAttemptsReached()) ||
         this.isFormative()) {
      return true;
    }
  }

  isSummative() {
    return this.props.assessmentKind.toUpperCase() === "SUMMATIVE" ? true : false;
  }

  isFormative() {
    return this.props.assessmentKind.toUpperCase() === "FORMATIVE" ? true : false;
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
   * A/B Testing (Modal)
   *
   * Casing off of last digit of the User Id to determine what verbiage to use in
   * the body of the wait modal.
   *
   * 0, 1 - No quiz tip, no modal
   * 2, 3 - No quiz tip, yes modal
   * 4    - v1 quiz tip, no modal
   * 5    - v1 quiz tip, yes modal
   * 6    - v2 quiz tip, no modal
   * 7    - v2 quiz tip, yes modal
   * 8    - v3 quiz tip, no modal
   * 9    - v3 quiz tip, yes modal
   */
  getWaitModalBodyText() {
    let userIdLastDigit = this.calculateUserIdLastDigitLastAttempt();
    let noModalGroup = ["0", "1", "4", "6", "8"];
    let modalGroup = ["2", "3", "5", "7", "9"];
    let bodyText = "";

    if (modalGroup.includes(userIdLastDigit)) {
      bodyText = "Remember - students who take time to review the material under Recommended Studying do over 10% better on their second quiz attempt on average.";
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
    let bodyContent1 = "You finished your first quiz attempt less than five minutes ago!"
    let bodyContent2 = this.getWaitModalBodyText();

    if (this.state.showModal && bodyContent2 !== "") {
      return (
        <WaitModal
          bodyContent1={bodyContent1}
          bodyContent2={bodyContent2}
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
        margin: "5px 5px 5px 0px",
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
