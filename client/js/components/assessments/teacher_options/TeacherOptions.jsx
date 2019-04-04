"use strict";

// Dependencies
import React from "react";

// Teacher Options Subcomponent
export default class TeacherOptions extends React.Component {
  constructor() {
    super();

    this.state = {
      windowWidth: window.innerWidth
    };

    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener("resize", this.handleWindowResize);
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
    window.removeEventListener("resize", this.handleWindowResize);
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
        flexDirection: this.responsiveFlexDirection(500),
        marginTop: this.responsiveMarginTop(500)
      },
      teacherOption: {
        border:"transparent",
        backgroundColor:"#fff",
        color:"#212b36",
        margin: this.responsiveTeacherOptionMargin(500),
        padding: 0,
        textAlign: this.responsiveTeacherOptionTextAlign(500),
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: "bold"
      }
    };
  }

  responsiveFlexDirection(breakPoint) {
    return this.state.windowWidth <= breakPoint ? "column" : "row";
  }

  responsiveMarginTop(breakPoint) {
    return this.state.windowWidth <= breakPoint ? "6px" : 0;
  }

  responsiveTeacherOptionMargin(breakPoint) {
    return this.state.windowWidth <= breakPoint ? "6px 0" : "20px 17px 20px 0";
  }

  responsiveTeacherOptionTextAlign(breakPoint) {
    return this.state.windowWidth <= breakPoint ? "left" : "center";
  }
}
