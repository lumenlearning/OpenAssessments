"use strict";

import React from 'react';

export default class AttemptOverview extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div className="attempt-overview-wrapper" style={styles.outerWrapper}>
        <p style={styles.attemptHeading}>Attempt {this.props.attempt.assessment_result_attempt + 1}</p>
        {this.getScore(styles)}
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
      }
    }
  }
}
