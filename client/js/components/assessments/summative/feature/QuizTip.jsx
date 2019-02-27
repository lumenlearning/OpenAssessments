"use strict";

import React from 'react';

export default class QuizTip extends React.Component {

  render() {
    let styles = this.getStyles();

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
    // if (this.props.attempts && this.props.attempts.length > 0) {
    //   return (
    //     <div style={styles.bodyTextWrapper}>
    //       <p style={styles.bodyText}>
    //         Did you know, students who study 20 minutes between quiz attempts do
    //         an average of 30% better?
    //       </p>
    //       <p>
    //         Given your score on your last quiz attempt, consider studying for a
    //         bit before starting your next quiz attempt
    //       </p>
    //     </div>
    //   );
    // } else {
      return (
        <div style={styles.bodyTextWrapper}>
          <p style={styles.bodyText}>
            <b>Did you know,</b> if you take your first quiz attempt early you'll have
            plenty of time to study and improve your grade on your second
            attempt?
          </p>
        </div>
      );
    // }
  }

  getStyles() {
    return {
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
      },
      componentWrapper: {
        padding: "40px 0",
        borderBottom: "1px solid #c4cdd5"
      }
    }
  }
}
