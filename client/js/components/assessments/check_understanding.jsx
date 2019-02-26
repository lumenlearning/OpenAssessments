"use strict";

// Dependencies
import React from "react";
import $ from "jquery";
// Actions
import AssessmentActions from "../../actions/assessment";
// Subcomponents
import AttemptOverview from "./feature/AttemptOverview.jsx";
import AttemptTime from "./feature/AttemptTime.jsx";
import StudySummary from "./feature/StudySummary.jsx";
import QuizTip from "./feature/QuizTip.jsx";

// Check Understanding Component
export default class CheckUnderstanding extends React.Component{

  render() {
    let styles = this.getStyles(this.props, this.context.theme);

    return (
      <div className="assessment-container" style={styles.assessmentContainer}>
        {this.renderTeacherOptions(styles)}
        {this.renderContent(styles)}
      </div>
    );
  }

  renderTeacherOptions(styles) {
    if (this.canManage()) {
      return (
        <div className="teacher-options-wrapper" style={styles.teacherOptionsWrapper}>
          <button
            style={styles.teacherOption}
            >
              Student Experience
          </button>
          <button
            onClick={()=>{this.previewAttempt()}}
            style={styles.teacherOption}
            >
              Answer Key
          </button>
          <button
            onClick={()=>{this.manageAttempts()}}
            style={styles.teacherOption}
            >
              Manage Quiz Attempts
          </button>
        </div>
      );
    }
  }

  renderContent(styles) {
    let content = "There was an error, contact your teacher.";

    switch (this.props.assessmentKind.toUpperCase()) {
      case "SUMMATIVE":
        content = this.getSummative(this.context.theme, styles, this.props);
        break;
      case "SHOW_WHAT_YOU_KNOW":
        content = this.getSwyk(styles);
        break;
      case "FORMATIVE":
        content = this.getFormative(styles);
        break;
    }

    return content;
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
          onClick={() => {this.start(this.props.eid, this.props.assessmentId, this.context)}}
          >
            {this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW" ? "Start Pre-test" : "Start Quiz"}
        </button>
      </div>
    );
  }

  renderStudyButton(styles) {
    //
    // TODO: onClick, return user to study plan
    //
    return (
      <div className="study-more-button-wrapper" style={styles.studyButtonWrapper}>
        <button
          style={styles.startButton}
          className="btn btn-info"
          >
            Study More
        </button>
      </div>
    );
  }

  start(eid, assessmentId, context) {
    AssessmentActions.start(eid, assessmentId, this.props.externalContextId);
    AssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, $("#srcData").text());
    context.router.transitionTo("assessment");
  }

  manageAttempts() {
    this.context.router.transitionTo("attempts", {contextId: this.props.externalContextId, assessmentId: this.props.assessmentId});
  }

  previewAttempt() {
    this.context.router.transitionTo("teacher-preview", {contextId: this.props.externalContextId, assessmentId: this.props.assessmentId});
  }

  getSummative(theme, styles, props) {
    // If we shouldn't show attempts, bail.
    if (!theme.shouldShowAttempts) {
      return;
    }

    // If there are no more quiz attempts available and user == student, render
    // the Max Attempts screen.
    if (props.userAttempts >= props.maxAttempts && props.ltiRole !== "admin") {
      this.renderMaxAttempts(styles);
    }

    // If this is an LTI Launch and above conditions were not met, return the
    // Start Summative Assessment screen.
    if (this.props.isLti) {
      return (
        <div className="start-wrapper">
          <div className="start-header-wrapper" style={styles.headerWrapper}>
            <h2 style={styles.quizTitle}>{`${this.props.title} Quiz`}</h2>
            <p style={styles.quizSubtitle}>{`Attempt ${this.props.userAttempts + 1} of ${this.props.maxAttempts}`}</p>
          </div>

          <div className="start-body-wrapper">
            {this.renderAttemptsFeedback(styles)}
          </div>

          <div className="start-footer-wrapper" style={styles.footerWrapper}>
            <div className="start-footer-text">
              <p style={styles.footerHeading}>{`Start attempt ${this.props.userAttempts + 1} of ${this.props.maxAttempts}`}</p>
              <p style={styles.footerSubheading}>The highest score of all completed attempts will be recorded as your grade</p>
            </div>
            <div className="start-study-button-wrapper" style={styles.startStudyButtonsWrapper}>
              {this.renderStartButton(styles)}
              {this.renderStudyButton(styles)}
            </div>
          </div>
        </div>
      );
    }
  }

  renderAttemptsFeedback() {
    if (this.props.assessmentAttempts && this.props.assessmentAttempts.length > 0) {
      return (
        this.props.assessmentAttempts.map((attempt, key) => {
          return (
            <AttemptOverview
              key={key}
              attempt={attempt}
              />
          )}
        )
      );
    } else {
      return (
        <QuizTip attempts={this.props.assessmentAttempts} />
      );
    }
  }

  renderAttemptTime(attemptIndex) {
    // if quiz attempts have been made, render time attempted
    if (this.props.assessmentAttempts.length > 0 && this.props.assessmentAttempts[attemptIndex]) {
      return (
        <AttemptTime
          time={this.props.assessmentAttempts[0] ? this.props.assessmentAttempts[0].created_at : null}
          />
      );
    }
  }

  renderStudySummary(attemptIndex) {
    let styles = this.getStyles;

    if (this.props.assessmentAttempts.length > 0 && this.props.assessmentAttempts[attemptIndex]) {
      return (
        <div style={styles.metaTableCellContent}>
          <StudySummary />
        </div>
      );
    }
  }

  renderMaxAttempts(styles) {
    return (
      <div style={styles.attemptsContainer}>
        <div style={{...styles.attempts, ...{border: null}}}>
          <h1>Oops!</h1>
          <h3>You have already taken this quiz the maximum number of times</h3>
        </div>
        <h4><u>TIPS:</u></h4>
        <div style={styles.tips}>
          <ul>
            <li>{"Right now you can do three things to make sure you are ready for the next performance assessment: review the material in this module, use the self-checks to see if you're getting it, and ask your peers or instructor for help if you need it."}</li>
            <li>{"In the future, allow enough time between your first and last quiz attempts to get help from your instructor before the last attempt!"}</li>
          </ul>
        </div>
      </div>
    );
  }

  getSwyk(styles) {
    return (
      <div style={styles.swyk}>
        <div style={styles.swykInfoGroup}>
          <h2 style={styles.h2}>Take this pre-test to see what you already know about the concepts in this section.</h2>
          <div style={{color: "#555555"}}>The pre-test does not count toward your grade, but will help you plan where to focus</div>
          <div>your time and effort as you study.</div>
        </div>
        {this.renderStartButton(styles)}
      </div>
    );
  }

  canManage() {
    return (
      this.props.assessmentKind.toUpperCase() === "SUMMATIVE" &&
      this.props.ltiRole === "admin" &&
      this.props.isLti
    );
  }

  getFormative(styles) {
    return (
      <div style={styles.formative}>
        <div className="row"></div>
        <div className="row" style={styles.checkDiv}>
          <div className="col-md-10 col-sm-9">
            <h4 style={styles.h4}>{this.props.title}</h4>
          </div>
          <div className="col-md-2 col-sm-3">
            <button
              style={{...styles.startButton, ...styles.checkUnderstandingButton}}
              className="btn btn-info"
              onClick={()=>{this.start(this.props.eid, this.props.assessmentId, this.context)}}
              >
                Start Quiz
            </button>
          </div>
        </div>
     </div>
   );
  }

  getStyles(props, theme) {
    return {
      assessmentContainer:{
        marginTop: "0px"
      },
      header: {
        backgroundColor: theme.headerBackgroundColor
      },
      startButton: {
        margin: "5px 5px 5px -5px",
        height: "36px",
        minWidth: "97px",
        backgroundColor: "#1e74d1 !important",
        border: "#004c9f"
      },
      checkUnderstandingButton: {
        backgroundColor: theme.maybeBackgroundColor
      },
      fullQuestion:{
        backgroundColor: theme.checkUnderstandingBackgroundColor,
        padding: "20px"
      },
      headerWrapper: {
        borderBottom: "1px solid #c4cdd5",
        padding: "20px 0"
      },
      quizTitle: {
        color: "#212b36",
        fontSize: "20px",
        lineHeight: "28px",
        margin: "0 0 4px 0"
      },
      quizSubtitle: {
        color: "#637381",
        fontSize: "14px",
        margin: 0
      },
      buttonWrapper: {
        textAlign: props.assessmentKind.toUpperCase() !== "SUMMATIVE" ? "left" : "right"
      },
      footerWrapper: {
        marginTop: "20px"
      },
      footerHeading: {
        color: "#212b36",
        fontSize: "20px",
        marginBottom: "4px"
      },
      footerSubheading: {
        color: "#637381",
        fontSize: "14px"
      },
      startStudyButtonsWrapper: {
        display: "flex",
        flexDirection: "row"
      },
      studyButtonWrapper: {
        marginLeft: "8px"
      },
      teacherOptionsWrapper: {

      },
      teacherOption: {
        border:"transparent",
        backgroundColor:"#fff",
        color:"#212b36",
        margin: "20px 17px 20px 0",
        padding: 0,
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: "bold"
      },
      attempts:{
        margin: "20px auto",
        width: "300px",
        border: "1px solid black",
        borderRadius: "4px",
        textAlign: "center"
      },
      tips:{
        paddingLeft: "-20px !important",
        margin: "20px auto",
        width: "300px",
        textAlign: "start",
      },
      attemptsContainer: {
        textAlign: "center"
      },
      swyk: {
        margin: "45px 0"
      },
      swykInfoGroup: {
        marginBottom: "30px"
      },
      h2: {
        fontSize: "20px",
        lineHeight: "1.4",
        color: "#212b36"
      },
      icon: {
        height: "62px",
        width: "62px",
        fontColor: theme.primaryBackgroundColor
      },
      formative: {
        padding: "0px",
        marginTop: "-20px"
      },
      data: {
        marginTop: "-5px"
      },
      checkDiv: {
        backgroundColor: theme.primaryBackgroundColor,
        margin: "20px 0px 0px 0px"
      },
      selfCheck: {
        fontSize: "140%"
      },
      h4: {
        color: "white"
      },
      images: {
        greenQuizIcon: "greenQuizIcon",
      }
    }
  }
}

CheckUnderstanding.propTypes = {
  name: React.PropTypes.string.isRequired
};

CheckUnderstanding.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func,
};
