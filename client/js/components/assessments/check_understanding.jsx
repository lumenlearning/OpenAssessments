"use strict";
// Dependencies
import React from "react";
import $ from "jquery";
// Actions
import AssessmentActions from "../../actions/assessment";

export default class CheckUnderstanding extends React.Component{
  render() {
    let styles = this.getStyles(this.props, this.context.theme);
    let buttonText = "Start Quiz";
    let content = "There was an error, contact your teacher.";

    if (this.props.assessmentKind.toUpperCase() === "SUMMATIVE") {
      content = this.getAttempts(this.context.theme, styles, this.props);
    } else if (this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW") {
      content = this.getSWYK(styles);
      buttonText = "Start Pre-test";
    } else if (this.props.assessmentKind.toUpperCase() === "FORMATIVE") {
      content = this.getFormative(styles);
    }

    let startButton = (
      <div style={styles.buttonWrapper}>
        <button
          style={styles.startButton}
          className="btn btn-info"
          onClick={()=>{this.start(this.props.eid, this.props.assessmentId, this.context)}}
          >
            {buttonText}
        </button>
      </div>
    );

    if (this.props.userAttempts >= this.props.maxAttempts && this.props.assessmentKind.toUpperCase() === "SUMMATIVE" && this.props.ltiRole !== "admin") {
      startButton = "";
    }

    if (this.props.assessmentKind.toUpperCase() === "FORMATIVE") {
      startButton = "";
    }

    let teacherOptions = null;

    if (this.canManage()) {
      teacherOptions = (
        <div style={styles.buttonGroup}>
          <button
            className="btn btn-sm"
            onClick={()=>{this.manageAttempts()}}
            style={styles.teacherButton}
            >
              Manage Quiz Attempts
          </button>
          <button
            className="btn btn-sm"
            onClick={()=>{this.previewAttempt()}}
            style={styles.teacherButton}
            >
              Answer Key
          </button>
        </div>
      );
    }

    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        {teacherOptions}
        <div className="question">
          <div className="header" style={styles.header}>
            <p>{this.props.name}</p>
          </div>
          <div className="full_question" style={styles.fullQuestion}>
            {content}
            {startButton}
          </div>
        </div>
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
        backgroundColor: "#1e74d1 !important",
        border: "transparent"
      },
      checkUnderstandingButton: {
        backgroundColor: theme.maybeBackgroundColor
      },
      fullQuestion:{
        backgroundColor: theme.checkUnderstandingBackgroundColor,
        padding: "20px"
      },
      buttonGroup: {
        textAlign: props.assessmentKind.toUpperCase() !== "SUMMATIVE" ? "left" : "center",
        background: "#e9e9e9",
        borderBottom: "2px solid #e3e3e3"
      },
      buttonWrapper: {
        textAlign: props.assessmentKind.toUpperCase() !== "SUMMATIVE" ? "left" : "center"
      },
      teacherButton: {
        border:"transparent",
        backgroundColor:"#3299bb",
        color:"#fff",
        minWidth: "150px",
        margin: "3px 2px"
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
        marginBottom: "25px",
        marginTop: "-25px"
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

  getAttempts(theme, styles, props) {
    if (!theme.shouldShowAttempts) {
      return;
    }

    if (props.userAttempts >= props.maxAttempts && props.ltiRole !== "admin") {
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

    let attempt = "";

    // right now only 2 attempts are allowed or other things will break
    switch (props.userAttempts+1) {
      case 1:
        attempt = "1st";
        break;
      case 2:
        attempt = "2nd";
        break;
      default: "1st";
    }

    let attemptStructure = (
      <div style={styles.attemptsContainer}>
        <div> You can take this quiz twice. Your highest score will count as your grade. Don't wait until the last minute to take the quiz - take the quiz early so you'll have plenty of time to study and improve your grade on your second attempt.</div>
          <div style={styles.attempts}>
          <h4>Attempt</h4>
          <h1>{this.props.userAttempts + 1}</h1>
          <h3>of {this.props.maxAttempts}</h3>
          <p>This is your {attempt} attempt for this quiz</p>
        </div>
      </div>
    );

    if (!this.props.isLti) {
      attemptStructure = "";
    }
  }

  getSWYK(styles) {
    return (
      <div style={styles.swyk}>
        <h2 style={styles.h2}>Take this pre-test to see what you already know about the concepts in this section.</h2>
        <div style={{color: "#555555"}}>The pre-test does not count toward your grade, but will help you plan where to focus</div>
        <div>your time and effort as you study.</div>
      </div>
    );
  }

  canManage() {
    return (
      this.props.assessmentKind.toUpperCase() === "SUMMATIVE" && this.props.ltiRole === "admin" && this.props.isLti
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
}

CheckUnderstanding.propTypes = {
  name: React.PropTypes.string.isRequired
};

CheckUnderstanding.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func,
};
