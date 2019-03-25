"use strict";

// Dependencies
import React from "react";

// SWYK Assessment Start Page
export default class StartSwyk extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.swyk}>
        <div style={styles.swykInfoGroup}>
          <h2 style={styles.h2}>Take this pre-test to see what you already know about the concepts in this section.</h2>
          <div style={styles.text}>The pre-test does not count toward your grade, but will help you plan where to focus</div>
          <div>your time and effort as you study.</div>
        </div>
        {this.props.startButton}
      </div>
    );
  }

  getStyles() {
    return {
      h2: {
        fontSize: "20px",
        lineHeight: "1.4",
        color: "#212b36"
      },
      text: {
        color: "#555555"
      },
      swyk: {
        margin: "45px 0"
      },
      swykInfoGroup: {
        marginBottom: "30px"
      }
    }
  }
}
