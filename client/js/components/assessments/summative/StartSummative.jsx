"use strict";

// Dependencies
import React from "react";
// Subcomponents
import AttemptOverview from "./feature/AttemptOverview";
import AttemptTime from "./feature/AttemptTime";
import QuizTip from "./feature/QuizTip";

// Summative Assessment Start Page
export default class StartSummative extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div className="start-wrapper">
        <div className="start-header-wrapper" style={styles.headerWrapper}>
          <h2 style={styles.quizTitle}>{`${this.props.title} Quiz`}</h2>
          <p style={styles.quizSubtitle}>{`Attempt ${this.props.userAttempts} of ${this.props.maxAttempts}`}</p>
        </div>

        <div className="start-body-wrapper">
          {this.renderAttemptsFeedback()}
        </div>

        <div className="start-footer-wrapper" style={styles.footerWrapper}>
          <div className="start-footer-text">
            <p style={styles.footerHeading}>{`Start attempt ${this.props.userAttempts} of ${this.props.maxAttempts}`}</p>
            <p style={styles.footerSubheading}>The highest score of all completed attempts will be recorded as your grade</p>
          </div>
          <div className="start-study-button-wrapper" style={styles.startStudyButtonsWrapper}>
            {this.props.startButton}
            {this.props.studyButton}
          </div>
        </div>
      </div>
    );
  }

  renderAttemptsFeedback() {
    // if there are assessment attempts to map over ...
    if (this.props.assessmentAttempts && this.props.assessmentAttempts.length > 0) {

      // map over each attempt and render attempt overview.
      return (
        this.props.assessmentAttempts.map((attempt, key) => {
          return (
            <AttemptOverview
              attempt={attempt}
              assessmentAttemptsOutcomes={this.props.assessmentAttemptsOutcomes}
              highScoreAttempt={this.highestScoreAttempt() === attempt.assessment_result_id ? true : false}
              key={key}
              mostRecentAttempt={attempt.assessment_result_attempt === this.props.assessmentAttempts.length - 1 ? true : false}
              studyAndMasteryFeedback={this.props.studyAndMasteryFeedback}
              />
          )}
        )
      );
    // otherwise, this is the first attempt, show the quiz tip.
    } else {
      return (
        <QuizTip
          attempts={this.props.assessmentAttempts}
          postIt={false}
          />
      );
    }
  }

  highestScoreAttempt() {
    let highScore = 0;
    let highScoreAttemptId = null;

    if (this.props.assessmentAttempts && this.props.assessmentAttempts.length > 0) {
      this.props.assessmentAttempts.forEach((attempt, key) => {
        if (attempt.assessment_result_score > highScore) {
          highScore = attempt.assessment_result_score;
          highScoreAttemptId = attempt.assessment_result_id;
        }
      });
    }

    return highScoreAttemptId;
  }

  getStyles() {
    return {
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
      }
    }
  }
}

StartSummative.propTypes = {
  assessmentAttempts: React.PropTypes.Array,
  maxAttempts: React.PropTypes.Number,
  title: React.PropTypes.String,
  startButton: React.PropTypes.func,
  studyButton: React.PropTypes.func,
  userAttempts: React.PropTypes.Number
};
