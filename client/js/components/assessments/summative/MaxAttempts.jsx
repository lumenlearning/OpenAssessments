"use strict";

// Dependencies
import React from "react";

// Summative Maximum Attempts Start Page
export default class MaxAttempts extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.attemptsContainer}>
        <div style={{...styles.attempts, ...{border: null}}}>
          <h1>Oops!</h1>
          <h3>You have already taken this quiz the maximum number of times</h3>
        </div>
        <h4><u>TIPS:</u></h4>
        <div style={styles.tips}>
          <ul>
            <li>{"Right now you can do three things to make sure you are ready for the next performance assessment: review the material in this module, use the self-checks to see if you're getting it, and ask your peers or instructor for help if you need it."}</li>
            <li>{"In the future, allow enough time between your first and last quiz attempts to get help from your instructor before the last attempt!"}</li>
          </ul>
        </div>
      </div>
    );
  }

  getStyles() {
    return {
      attemptsContainer: {
        textAlign: "center"
      },
      attempts:{
        margin: "20px auto",
        width: "300px",
        border: "1px solid black",
        borderRadius: "4px",
        textAlign: "center"
      },
      tips:{
        paddingLeft: "-20px !important",
        margin: "20px auto",
        width: "300px",
        textAlign: "start",
      }
    }
  }
}
