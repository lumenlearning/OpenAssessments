"use strict";

import React from 'react';

export default class QuizTip extends React.Component {

  render() {
    let styles = this.props.postIt ? this.getPostItStyles() : this.getVanillaStyles();

    return (
      <div style={styles.componentWrapper}>
        <div style={styles.headingWrapper}>
          <img style={styles.tipIcon} src="/assets/Icon@2x.png" alt="" />
          <h3 style={styles.heading}>Quiz Tip</h3>
        </div>
        {this.getStudyTip(styles)}
      </div>
    );
  }

  getStudyTip(styles) {
    return (
      <div style={styles.bodyTextWrapper}>
        <p style={styles.bodyText}>
          <b>Did you know,</b> if you take your first quiz attempt early you'll have
          plenty of time to study and improve your grade on your second
          attempt?
        </p>
      </div>
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
    }
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
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: 0,
        marginBottom: 0
      },
      bodyText: {
        color: "#212b36",
        fontSize: "20px"
      }
    }
  }
}
