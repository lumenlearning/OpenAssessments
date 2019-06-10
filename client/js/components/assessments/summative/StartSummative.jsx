"use strict";

// Dependencies
import React from "react";
// Subcomponents
import AttemptOverview from "./feature/AttemptOverview";
import QuizTip from "./feature/QuizTip";
// Utilities
import CommHandler from "../../../utils/communication_handler";

// Summative Assessment Start Page
export default class StartSummative extends React.Component {
  constructor(props, context) {
    super(props, context);

    CommHandler.init();
  }

  render() {
    let styles = this.getStyles();

    return (
      <div className="start-wrapper">
        <div className="start-header-wrapper" style={styles.headerWrapper}>
          <div className="quiz-title-wrapper">
            <h2 style={styles.quizTitle} tabIndex="0">
              {`${this.props.title} Quiz`}
            </h2>
          </div>
          <div className="quiz-subtitle-wrapper">
            {this.maxAttemptsReachedHeader(styles)}
          </div>
        </div>

        <div className="start-body-wrapper">
          {this.renderAttemptsFeedback()}
        </div>

        {this.maxAttemptsReachedFooter(styles)}
      </div>
    );
  }

  componentDidMount() {
    CommHandler.sendSizeThrottled();
    CommHandler.showLMSNavigation();
}

  renderAttemptsFeedback() {
    // if there are assessment attempts to map over ...
    if (this.props.assessmentAttempts && this.props.assessmentAttempts.length > 0) {
      // map over each attempt and render attempt overview.
      return (
        this.props.assessmentAttempts.map((attempt, index) => {
          return (
            <AttemptOverview
              attempt={attempt}
              assessmentAttemptsOutcomes={this.props.assessmentAttemptsOutcomes}
              highScoreAttempt={this.highestScoreAttempt() === attempt.assessment_result_id ? true : false}
              index={index}
              key={index}
              mostRecentAttempt={index === this.props.assessmentAttempts.length - 1 ? true : false}
              studyAndMasteryFeedback={this.props.studyAndMasteryFeedback}
              />
          );
        })
      );
    // otherwise, this is the first attempt, show the quiz tip.
    } else {
      return (
        <QuizTip
          attempts={this.props.assessmentAttempts}
          userId={null}
          postIt={false}
          />
      );
    }
  }

  maxAttemptsReachedHeader(styles) {
    if (this.props.maxAttemptsReached) {
      return (
        <p style={styles.noAttemptsAvailable} tabIndex="0">
          No quiz attempts available
        </p>
      );
    } else {
      return (
        <p style={styles.quizSubtitle} tabIndex="0">
          {`Attempt ${this.props.attemptsCount} of ${this.props.maxAttempts}`}
        </p>
      );
    }
  }

  maxAttemptsReachedFooter(styles) {
    if (this.props.maxAttemptsReached) {
      return (
        <div className="start-footer-wrapper" style={styles.footerWrapper}>
          <p style={styles.noAttemptsAvailable} tabIndex="0">
            No quiz attempts available
          </p>
        </div>
      );
    } else {
      return (
        <div className="start-footer-wrapper" style={styles.footerWrapper}>
          <div className="start-footer-text">
            <div className="footer-heading-wrapper">
              <p style={styles.footerHeading} tabIndex="0">
                {`Start attempt ${this.props.attemptsCount} of ${this.props.maxAttempts}`}
              </p>
            </div>
            <div className="footer-subheading-wrapper">
              <p style={styles.footerSubheading} tabIndex="0">
                The highest score of all completed attempts will be recorded as your grade
              </p>
            </div>
          </div>
          <div className="start-study-button-wrapper" style={styles.startStudyButtonsWrapper}>
            {this.props.startButton}
          </div>
        </div>
      );
    }
  }

  highestScoreAttempt() {
    let highScore = 0;
    let highScoreAttemptId = null;

    if (this.props.assessmentAttempts && this.props.assessmentAttempts.length > 0) {
      this.props.assessmentAttempts.forEach((attempt) => {
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
        display: "inline-block",
        fontSize: "20px",
        lineHeight: "28px",
        margin: "0 0 4px 0"
      },
      quizSubtitle: {
        color: "#637381",
        display: "inline-block",
        fontSize: "14px",
        margin: 0
      },
      footerWrapper: {
        marginTop: "20px"
      },
      footerHeading: {
        color: "#212b36",
        display: "inline-block",
        fontSize: "20px",
        marginBottom: "4px"
      },
      footerSubheading: {
        color: "#637381",
        display: "inline-block",
        fontSize: "14px"
      },
      startStudyButtonsWrapper: {
        display: "flex",
        flexDirection: "row"
      },
      noAttemptsAvailable: {
        color: "#ad4646",
        display: "inline-block"
      }
    };
  }
}
