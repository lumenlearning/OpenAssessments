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
          {this.getQuizTip(styles)}
        </div>
      </div>
    );
  }

  /**
   * A/B Testing Quiz Tip Language
   *
   * Casing off of last digit of the User Id
   */
  getQuizTip(styles) {
    let userIdLastDigit = this.props.userId ? this.props.userId.toString().split("").pop() : "";

    switch (userIdLastDigit) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
        return (
          <p style={styles.bodyText} tabIndex="0">
            Test Group 1
          </p>
        );
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        return (
          <p style={styles.bodyText} tabIndex="0">
            Test Group 2
          </p>
        );
      default:
        return (
          <p style={styles.bodyText} tabIndex="0">
            <b>Did you know,</b> if you take your first quiz attempt early you'll have
            plenty of time to study and improve your grade on your second
            attempt?
          </p>
        );
    }
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
        marginRight: "31px",
        padding: "40px 43px",
        width: "364px"
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
        fontSize: "20px"
      }
    };
  }
}
