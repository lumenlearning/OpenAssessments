"use strict";

import React from "react";

export default class QuizTip extends React.Component {
  render() {
    let styles = this.props.postIt ? this.getPostItStyles() : this.getVanillaStyles();
    return (
      <div style={styles.componentWrapper}>
        <div style={styles.headingWrapper}>
          <img style={styles.tipIcon} src="/assets/Icon@2x.png" alt="" />
          <h3 style={styles.heading} tabIndex="0">Quiz Tip</h3>
        </div>
        <div style={styles.bodyTextWrapper}>
          {this.props.userId ? this.getQuizTipPostIt(styles) : this.getQuizTip(styles)}
        </div>
      </div>
    );
  }

  /**
   * A/B Testing (Quiz Tip "Pre-Attempt")
   *
   * Casing off of last digit of the User Id to determine what verbiage to use in
   * the body of the quiz tip.
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
  getQuizTipPostIt(styles) {
    let userIdLastDigit = this.props.userId.toString().split("").pop();
    let quizTipV1 = ["4", "5"];
    let quizTipV2 = ["6", "7"];
    let quizTipV3 = ["8" ,"9"];

    if (quizTipV1.includes(userIdLastDigit)) {
      return (
        <p style={styles.bodyText} tabIndex="0">
          <b>Did you know?</b> Students who review the material under
          Recommended Studying increase their second quiz score by about 10% per
          five pages reviewed.
        </p>
      );
    } else if (quizTipV2.includes(userIdLastDigit)) {
      return (
        <p style={styles.bodyText} tabIndex="0">
          <b>Did you know?</b> Students who review the material under
          Recommended Studying increase their second quiz score by about 10% per
          20 minutes spent reviewing.
        </p>
      );
    } else if (quizTipV3.includes(userIdLastDigit)) {
      return (
        <p style={styles.bodyText} tabIndex="0">
          <b>Did you know?</b> Many students review the material under
          Recommended Studying before taking their second quiz attempt. Their
          quiz scores improve by over 10%.
        </p>
      );
    }
  }

  /**
   * Quiz Tip "Pre-Attempt"
   *
   * Shows only when the user is about to start their first attempt for a given
   * end-of-module assessment.
   */
  getQuizTip(styles) {
    return (
      <p style={styles.bodyText} tabIndex="0">
        <b>Did you know?</b> If you take your first quiz attempt early you'll
        have plenty of time to study and improve your grade on your second
        attempt.
      </p>
    );
  }

  getVanillaStyles() {
    return {
      componentWrapper: {
        padding: "40px 0",
        borderBottom: "1px solid #c4cdd5"
      },
      headingWrapper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        marginBottom: "20px"
      },
      tipIcon: {
        height: "20px",
        marginRight: "10px",
        width: "20px"
      },
      heading: {
        color: "#212b36",
        display: "inline-block",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: 0,
        marginBottom: 0
      },
      bodyTextWrapper: {
        maxWidth: "600px"
      },
      bodyText: {
        color: "#212b36",
        fontSize: "20px"
      }
    };
  }

  getPostItStyles() {
    return {
      componentWrapper: {
        backgroundColor: "#ffef99",
        marginRight: "25px",
        padding: "30px 33px",
        width: "350px"
      },
      headingWrapper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        marginBottom: "20px"
      },
      tipIcon: {
        height: "20px",
        marginRight: "10px",
        width: "20px"
      },
      heading: {
        color: "#212b36",
        display: "inline-block",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: 0,
        marginBottom: 0
      },
      bodyText: {
        color: "#212b36",
        fontSize: "18px"
      }
    };
  }
}
