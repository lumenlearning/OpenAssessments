"use strict";

// Dependencies
import React from "react";

// Teacher Options Subcomponent
export default class TeacherOptions extends React.Component {
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
      <div className="teacher-options-wrapper" style={styles.wrapper}>
        <button
          onClick={() => { this.changeContext("start"); }}
          style={styles.teacherOption}>
          Student Experience
        </button>
        <button
          onClick={() => { this.changeContext("teacher-preview"); }}
          style={styles.teacherOption}
          >
            Answer Key
        </button>
        <button
          onClick={() => { this.changeContext("attempts"); }}
          style={styles.teacherOption}
          >
            Manage Quiz Attempts
        </button>
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
      wrapper: {
        display: "flex",
        flexDirection: this.state.windowWidth <= 500 ? "column" : "row",
        marginTop: this.state.windowWidth <= 500 ? "6px" : 0
      },
      teacherOption: {
        border:"transparent",
        backgroundColor:"#fff",
        color:"#212b36",
        margin: this.state.windowWidth <= 500 ? "6px 0" : "20px 17px 20px 0",
        padding: 0,
        textAlign: this.state.windowWidth <= 500 ? "left" : "center",
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: "bold"
      }
    };
  }
}
