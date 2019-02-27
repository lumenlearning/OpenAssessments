"use strict";

// Dependencies
import React from "react";

// Teacher Options Subcomponent
export default class TeacherOptions extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div className="teacher-options-wrapper">
        <button
          onClick={() => { this.changeContext("start") }}
          style={styles.teacherOption}>
          Student Experience
        </button>
        <button
          onClick={() => { this.changeContext("teacher-preview") }}
          style={styles.teacherOption}
          >
            Answer Key
        </button>
        <button
          onClick={() => { this.changeContext("attempts") }}
          style={styles.teacherOption}
          >
            Manage Quiz Attempts
        </button>
      </div>
    );
  }

  changeContext(context) {
    this.props.context.router.transitionTo(
      context,
      {
        contextId: this.props.externalContextId,
        assessmentId: this.props.assessmentId
      }
    );
  }

  getStyles() {
    return {
      teacherOption: {
        border:"transparent",
        backgroundColor:"#fff",
        color:"#212b36",
        margin: "20px 17px 20px 0",
        padding: 0,
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: "bold"
      },
    }
  }
}
