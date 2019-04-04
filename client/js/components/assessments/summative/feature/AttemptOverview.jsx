"use strict";
// Dependencies
import _ from "lodash";
import React from "react";
// Subcomponents
import QuizTip from "./QuizTip";

// Attempt Overview Subcomponent
export default class AttemptOverview extends React.Component {
  constructor() {
    super();

    this.state = {
      windowWidth: window.innerWidth
    }

    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  render() {
    let styles = this.getStyles();

    return (
      <div className="attempt-overview-wrapper" style={styles.outerWrapper}>
        <p style={styles.attemptHeading} tabIndex="0">
          Attempt {this.props.attempt.assessment_result_attempt + 1}
        </p>
        <div style={styles.innerWrapper}>
          {this.getScore(styles)}
          {this.getQuizTipAttemptFeedback(styles)}
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize() {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  getScore(styles) {
    if (this.props.attempt.assessment_result_score !== null) {
      return (
        <div style={styles.scoreContainer}>
          <p style={styles.score} tabIndex="0">
            {`${this.props.attempt.assessment_result_score}%`}
          </p>
          {this.getRecordedGradeFlag(styles)}
        </div>
      );
    } else {
      return (
        <div className="no-score-available" style={styles.noScoreAvailable}>
          <p style={styles.score} tabIndex="0">NA</p>
          <div style={styles.notSubmittedWrapper} tabIndex="0">
            <div className="not-submitted-wrapper">
              <p style={styles.notSubmittedText}><b>Quiz started but not submitted</b></p>
            </div>
            <div className="not-submitted-description-wrapper">
              <p style={styles.notSubmittedText}>
                Once a quiz has been started it counts towards your total number
                of quiz attempts available.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  getRecordedGradeFlag(styles) {
    if (this.props.highScoreAttempt) {
      return (
        <span style={styles.recordedGradeFlag} tabIndex="0">
          <img style={styles.recordedCheck} src="/assets/Check@2x.png" />
          Score recorded as grade
        </span>
      );
    }
  }

  getQuizTipAttemptFeedback(styles) {
    // if this is the most recent quiz attempt result, and the attempt
    // is a completed one, show feedback.
    if (this.props.mostRecentAttempt && this.props.attempt.assessment_result_score !== null) {
      return (
        <div className="attempt-feedback-wrapper" style={styles.attemptFeedbackWrapper}>
          <QuizTip
            attempts={null}
            userId={this.props.attempt.user_id}
            postIt={true}
            />
          <div className="attempt-feedback" style={styles.attemptFeedback}>
            {this.getFeedback("negative", styles)}
            {this.getFeedback("positive", styles)}
          </div>
        </div>
      );
    }
  }

  getFeedback(feedbackType, styles) {
    if (this.hasPopulatedNegativeFeedbackList() && !this.isPositiveFeedback(feedbackType)) {
      return (
        <div className="recommended-studying" style={styles.negativeFeedbackBox}>
          <div style={styles.feedbackBoxHeadingWrapper}>
            <img src="/assets/Recommended_Studying_Icon@2x.png" style={styles.feedbackIcons} />
            <p style={styles.feedbackTitle} tabIndex="0">
              Recommended Studying
            </p>
          </div>
          <ul style={styles.feedbackList}>
            {this.getReviewOutcomeList(feedbackType, styles)}
          </ul>
        </div>
      );
    } else if (this.hasPopulatedPositiveFeedbackList() && this.isPositiveFeedback(feedbackType)) {
      return (
        <div className="mastered-concepts" style={styles.positiveFeedbackBox}>
          <div style={styles.feedbackBoxHeadingWrapper}>
            <img src="/assets/Mastered_Concepts_Icon@2x.png" style={styles.feedbackIcons} />
            <p style={styles.feedbackTitle} tabIndex="0">
              Mastered Concepts
            </p>
          </div>
          <ul style={styles.feedbackList}>
            {this.getReviewOutcomeList(feedbackType, styles)}
          </ul>
        </div>
      );
    }
  }

  hasPopulatedNegativeFeedbackList() {
    return this.props.studyAndMasteryFeedback.negativeList.length > 0 ? true : false;
  }

  hasPopulatedPositiveFeedbackList() {
    return this.props.studyAndMasteryFeedback.positiveList.length > 0 ? true : false;
  }

  isPositiveFeedback(feedbackType) {
    if (feedbackType === "negative") {
      return false;
    } else if (feedbackType === "positive") {
      return true;
    }
  }

  getReviewOutcomeList(feedbackType, styles) {
    if ("negative" === feedbackType) {
      return (
        this.props.studyAndMasteryFeedback.negativeList.map((feedback, index) => {
          return (
            <li style={styles.outcomeItem} key={index}>
              <p style={styles.outcomeTitle} tabIndex="0">{feedback.shortOutcome}</p>
              <div style={styles.outcomeDetails} tabIndex="0">
                <div style={styles.dotsContainer}>{this.getIndicatorDots(feedback, styles)}</div>
                <p style={styles.correctPerOutcome}>
                  {`${this.correctPerOutcome(feedback)} of ${this.totalPerOutcome(feedback)} answers correct`}
                </p>
              </div>
            </li>
          );
        })
      );
    } else if ("positive" === feedbackType) {
      return (
        this.props.studyAndMasteryFeedback.positiveList.map((feedback, index) => {
          return (
            <li style={styles.outcomeItem} key={index}>
              <p style={styles.outcomeTitle} tabIndex="0">{feedback.shortOutcome}</p>
              <div style={styles.outcomeDetails} tabIndex="0">
                <div style={styles.dotsContainer}>{this.getIndicatorDots(feedback, styles)}</div>
                <p style={styles.correctPerOutcome}>
                  {`${this.correctPerOutcome(feedback)} of ${this.totalPerOutcome(feedback)} answers correct`}
                </p>
              </div>
            </li>
          );
        })
      );
    }
  }

  getIndicatorDots(feedback, styles) {
    let correct = this.correctPerOutcome(feedback);
    let total = this.totalPerOutcome(feedback);

    let dots = [];

    _.times(correct, () => {
      dots.push(<span style={styles.correctDot}></span>);
    });

    _.times(total - correct, () => {
      dots.push(<span style={styles.incorrectDot}></span>);
    });

    return dots;
  }

  correctPerOutcome(feedback) {
    let correct = 0;

    if (this.props.attempt.assessment_result_items.length > 0) {
      this.props.attempt.assessment_result_items.forEach((item) => {
        if (item.outcome_guid === feedback.outcomeGuid && item.score === 1) {
          correct += 1;
        }
      });
    }

    return correct;
  }

  totalPerOutcome(feedback) {
    let total = 0;

    if (this.props.attempt.assessment_result_items.length > 0) {
      this.props.attempt.assessment_result_items.forEach((item) => {
        if (item.outcome_guid === feedback.outcomeGuid) {
          total += 1;
        }
      });
    }

    return total;
  }

  getStyles() {
    return {
      outerWrapper: {
        borderBottom: "1px solid #c4cdd5",
        padding: "40px 0"
      },
      attemptHeading: {
        color: "#212b36",
        display: "inline-block",
        fontSize: "14px",
        marginBottom: "8px"
      },
      scoreContainer: {
        display: "flex",
        alignItems: "center"
      },
      score: {
        color: "#212b36",
        display: "inline-block",
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "8px"
      },
      recordedGradeFlag: {
        color: "#637381",
        fontSize: "12px",
        marginBottom: "8px",
        marginLeft: "14px"
      },
      recordedCheck: {
        height: "8px",
        marginRight: "8px",
        width: "8px"
      },
      noScoreAvailable: {
        marginBottom: "8px"
      },
      notSubmittedWrapper: {
        color: "#ad4646",
        fontSize: "14px"
      },
      notSubmittedText: {
        display: "inline-block",
        marginBottom: 0
      },
      attemptFeedbackWrapper: {
        display: "flex",
        flexDirection: this.state.windowWidth <= 1225 ? "column-reverse" : "row"
      },
      attemptFeedback: {
        borderRadius: "3px",
        boxShadow: this.state.windowWidth <= 1225 ? "none" : "0 1px 3px 0 rgba(63, 63, 68, 0.15), 0 0 0 1px rgba(63, 63, 68, 0.05)",
        display: "flex",
        flexDirection: this.state.windowWidth <= 1225 ? "column" : "row"
      },
      negativeFeedbackBox: {
        borderRight: this.state.windowWidth <= 1225 ? "none" : "1px solid #dfe3e8",
        borderBottom: this.state.windowWidth <= 1225 ? "1px solid #dfe3e8" : "none",
        padding: this.state.windowWidth <= 1225 ? "45px 0" : "45px 40px",
        width: "365px"
      },
      positiveFeedbackBox: {
        padding: this.state.windowWidth <= 1225 ? "45px 0" : "45px 40px",
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
        flexDirection: "row",
        marginBottom: "14px"
      },
      feedbackList: {
        listStyleType: "none",
        margin: 0,
        padding: 0
      },
      outcomeItem: {
        marginBottom: "20px"
      },
      outcomeTitle: {
        color: "#212b36",
        fontSize: "14px",
        margin: "0 0 4px"
      },
      outcomeDetails: {
        display: "flex",
        alignItems: "center"
      },
      correctPerOutcome: {
        color: "#637381",
        fontSize: "12px",
        margin: 0
      },
      dotsContainer: {
        display: "flex",
        alignItems: "center",
        marginRight: "7px"
      },
      correctDot: {
        backgroundColor: "#9ac0ea",
        border: "solid 2px #1e74d1",
        borderRadius: "6px",
        display: "block",
        height: "12px",
        marginRight: "4px",
        width: "12px"
      },
      incorrectDot: {
        backgroundColor: "#fff",
        border: "solid 2px #1e74d1",
        borderRadius: "6px",
        display: "block",
        height: "12px",
        marginRight: "4px",
        width: "12px"
      }
    };
  }
}
