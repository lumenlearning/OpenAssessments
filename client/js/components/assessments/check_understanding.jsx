"use strict";

// Dependencies
import React from "react";
import $ from "jquery";
// Actions
import AssessmentActions from "../../actions/assessment";
// Subcomponents
import AttemptTime from "./feature/AttemptTime.jsx";
import FeedbackPill from "./feature/FeedbackPill.jsx";
import StudyTip from "./feature/StudyTip.jsx";

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
      <div className="start-assessment-wrapper" style={styles.buttonWrapper}>
        <button
          style={styles.startButton}
          className="btn btn-info"
          onClick={()=>{this.start(this.props.eid, this.props.assessmentId, this.context)}}
          >
            {this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW" ? "Start Pre-test" : "Start Quiz"}
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
    if (!theme.shouldShowAttempts) {
      return;
    }

    // If there are no more quiz attempts available and user is a student
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
    switch (props.userAttempts + 1) {
      case 1:
        attempt = "1st";
        break;
      case 2:
        attempt = "2nd";
        break;
      default: "1st";
    }

    if (this.props.isLti) {
      return (
        <div className="assessment-meta-wrapper" style={styles.metaWrapper}>
          <div className="assessment-meta-header" style={styles.metaHeader}>
            <div className="assessment-meta-heading" style={styles.metaTitle}>
              <h2 style={styles.metaTitle}>{this.props.title}</h2>
              <p style={styles.metaSubtitle}>{`Attempts Possible: ${this.props.userAttempts + 1} of ${this.props.maxAttempts}`}</p>
            </div>
            {this.renderStartButton(styles)}
          </div>
          <StudyTip
            attempts={this.props.attemptsData}
            />
          <div className="assessment-meta-table">
            <div className="assessment-meta-table-heading" style={styles.metaTableHeaderWrapper}>
              <h3 style={styles.metaTableHeading}>Quiz Scores</h3>
            </div>

            <div className="assessment-meta-table-row" style={styles.metaTableRow}>
              <div style={styles.metaTableCell}>
                <p style={styles.metaTableCellContent}>Attempt 1</p>
                <AttemptTime
                  time={this.props.attemptsData[0] ? this.props.attemptsData[0].created_at : null}
                  />
              </div>
              <div style={styles.metaTableCell}>
                <FeedbackPill
                  score={this.props.attemptsData[0] ? this.props.attemptsData[0].score : null}
                  />
                <span style={styles.theScore}>{this.getScore(0)}</span>
              </div>
            </div>

            <div className="assessment-meta-table-row" style={styles.metaTableRow}>
              <div style={styles.metaTableCell}>
                <p style={styles.metaTableCellContent}>Attempt 2</p>
                <AttemptTime
                  time={this.props.attemptsData[1] ? this.props.attemptsData[1].created_at : null}
                  />
              </div>
              <div style={styles.metaTableCell}>
                <FeedbackPill
                  score={this.props.attemptsData[1] ? this.props.attemptsData[1].score : null}
                  />
                <span style={styles.theScore}>{this.getScore(1)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  getScore(attemptIndex) {
    if (this.props.attemptsData[attemptIndex]) {
      return `${this.props.attemptsData[attemptIndex]['score']}%`;
    } else {
      return "No score yet";
    }
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
      teacherOptionsWrapper: {

      },
      metaHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0 20px 0"
      },
      metaTitle: {
        fontSize: "20px",
        lineHeight: "28px",
        margin: "0, 0, 4px, 0"
      },
      metaSubtitle: {
        color: "#637381",
        fontSize: "14px",
        margin: 0
      },
      metaTableHeaderWrapper: {
        borderBottom: "1px solid #c4cdd5",
        borderTop: "2px solid #212b36",
      },
      metaTableHeading: {
        margin: "20px 0",
        fontSize: "16px",
        fontWeight: "bold"
      },
      metaTableRow: {
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #c4cdd5"
      },
      metaTableCell: {
        padding: "20px 0",
        minWidth: "150px"
      },
      metaTableCellContent: {
        margin: 0
      },
      theScore: {
        fontWeight: "bold"
      },
      buttonWrapper: {
        textAlign: props.assessmentKind.toUpperCase() !== "SUMMATIVE" ? "left" : "right"
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
