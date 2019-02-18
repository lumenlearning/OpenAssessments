"use strict";

import React from 'react';

export default class StudyTip extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.wrapper}>
        <div style={styles.headingWrapper}>
          <img style={styles.tipIcon} src="/assets/Icon@2x.png" alt="" />
          <h3 style={styles.heading}>Study Tip</h3>
        </div>
        <p style={styles.bodyText}>
          Don't wait until the last minute to take the quiz - take the quiz
          early so you'll have plenty of time to study and improve your grade
          on your second attempt.
        </p>
      </div>
    );
  }

  getStyles() {
    return {
      headingWrapper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        marginBottom: "14px"
      },
      tipIcon: {
        height: "20px",
        marginRight: "8px",
        width: "20px"
      },
      heading: {
        fontSize: "12px",
        fontWeight: "bold",
        marginTop: 0,
        marginBottom: 0,
        textTransform: "uppercase"
      },
      bodyText: {
        fontSize: "24px",
        maxWidth: "629px"
      },
      wrapper: {
        borderTop: "1px solid #c4cdd5",
        padding: "80px 0"
      }
    }
  }
}
