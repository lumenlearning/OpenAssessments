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
    // if this is the most recent quiz attempt result, and the attempt
    // is a completed one, show feedback.
    if (this.props.mostRecentAttempt && this.props.attempt.assessment_result_score) {
      return (
        <div className="attempt-feedback-wrapper" style={styles.attemptFeedbackWrapper}>
          <QuizTip attempts={null} postIt={true} />

          <div className="attempt-feedback" style={styles.attemptFeedback}>
            <div className="recommended-studying" style={styles.feedbackBox1}>
              <div style={styles.feedbackBoxHeadingWrapper}>
                <img src="/assets/Recommended_Studying_Icon@2x.png" style={styles.feedbackIcons} />
                <p style={styles.feedbackTitle}>Recommended Studying</p>
              </div>
              <ul style={styles.feedbackList}>
                {this.getReviewOutcomeList("negative", styles)}
              </ul>
            </div>
            <div className="mastered-concepts" style={styles.feedbackBox2}>
              <div style={styles.feedbackBoxHeadingWrapper}>
                <img src="/assets/Mastered_Concepts_Icon@2x.png" style={styles.feedbackIcons} />
                <p style={styles.feedbackTitle}>Mastered Concepts</p>
              </div>
              <ul style={styles.feedbackList}>
                {this.getReviewOutcomeList("positive", styles)}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  getReviewOutcomeList(feedbackType, styles) {
    if ("negative" === feedbackType) {
      return (
        this.props.studyAndMasteryFeedback.negativeList.map((feedback, index) => {
          return (
            <li>{feedback.shortOutcome}</li>
          );
        })
      );
    } else if ("positive" === feedbackType) {
      return (
        this.props.studyAndMasteryFeedback.positiveList.map((feedback, index) => {
          return (
            <li>{feedback.shortOutcome}</li>
          );
        })
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
      },
      feedbackIcons: {
        height: "28px",
        marginBottom: "10px",
        marginRight: "8px",
        width: "28px"
      },
      feedbackBoxHeadingWrapper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row"
      },
      feedbackList: {
        listStyleType: "none",
        padding: 0
      }
    }
  }
}
