"use strict";
// Dependencies
import React from "react";
// Subcomponents
import QuizTip from "./QuizTip";

// Attempt Overview Subcomponent
export default class AttemptOverview extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div className="attempt-overview-wrapper" style={styles.outerWrapper}>
        <p style={styles.attemptHeading}>Attempt {this.props.attempt.assessment_result_attempt + 1}</p>
        <div style={styles.innerWrapper}>
          {this.getScore(styles)}
          {this.getQuizTipAttemptFeedback(styles)}
        </div>
      </div>
    );
  }

  getScore(styles) {
    if (this.props.attempt.assessment_result_score) {
      return (
        <p style={styles.score}>
          {`${this.props.attempt.assessment_result_score}%`}
        </p>
      );
    } else {
      return (
        <div className="no-score-available" style={styles.noScoreAvailable}>
          <p style={styles.score}>NA</p>
          <div style={styles.notSubmittedWrapper}>
            <p style={styles.notSubmittedText}><b>Quiz started but not submitted</b></p>
            <p style={styles.notSubmittedText}>
              Once a quiz has been started it counts towards your total number
              of quiz attempts available.
            </p>
          </div>
        </div>
      )
    }
  }

  getQuizTipAttemptFeedback(styles) {
    // if this is the most recent quiz attempt result, show feedback.
    if (this.props.mostRecentAttempt) {
      return (
        <div className="attempt-feedback-wrapper" style={styles.attemptFeedbackWrapper}>
          <QuizTip attempts={null} postIt={true} />

          <div className="attempt-feedback" style={styles.attemptFeedback}>
            <div className="recommended-studying" style={styles.feedbackBox1}>
              <img src="" />
              <p style={styles.feedbackTitle}>Recommended Studying</p>
              <ul>
                <li>The Evolution of Psychology</li>
                <li>Contemporary Fields in Psychology</li>
              </ul>
            </div>
            <div className="mastered-concepts" style={styles.feedbackBox2}>
              <img src="" />
              <p style={styles.feedbackTitle}>Mastered Concepts</p>
                <ul>
                  <li>Psychology Foundations</li>
                </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  getStyles() {
    return {
      outerWrapper: {
        borderBottom: "1px solid #c4cdd5",
        padding: "40px 0"
      },
      attemptHeading: {
        color: "#212b36",
        fontSize: "14px",
        marginBottom: "8px"
      },
      score: {
        color: "#212b36",
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "8px"
      },
      noScoreAvailable: {
        marginBottom: "8px"
      },
      notSubmittedWrapper: {
        color: "#ad4646",
        fontSize: "14px"
      },
      notSubmittedText: {
        marginBottom: 0
      },
      attemptFeedbackWrapper: {
        display: "flex",
        flexDirection: "row"
      },
      attemptFeedback: {
        borderRadius: "3px",
        boxShadow: "0 1px 3px 0 rgba(63, 63, 68, 0.15), 0 0 0 1px rgba(63, 63, 68, 0.05)",
        display: "flex",
        flexDirection: "row",
      },
      feedbackBox1: {
        borderRight: "1px solid #dfe3e8",
        padding: "45px 40px",
        width: "365px"
      },
      feedbackBox2: {
        padding: "45px 40px",
        width: "365px"
      },
      feedbackTitle: {
        color: "#212b36",
        fontSize: "16px",
        fontWeight: "bold"
      }
    }
  }
}
