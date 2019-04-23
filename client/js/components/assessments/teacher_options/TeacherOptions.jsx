"use strict";

// Dependencies
import React from "react";

// Teacher Options Subcomponent
export default class TeacherOptions extends React.Component {
  constructor() {
    super();

    this.state = {
      hover: null,
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
          onMouseEnter={() => this.setState({ hover: "start" })}
          onMouseLeave={() => this.setState({ hover: null })}
          style={this.state.hover === "start" ? styles.teacherOptionHover : styles.teacherOption}>
          Student Experience
        </button>
        <button
          onClick={() => { this.changeContext("teacher-preview"); }}
          onMouseEnter={() => this.setState({ hover: "teacher-preview" })}
          onMouseLeave={() => this.setState({ hover: null })}
          style={this.state.hover === "teacher-preview" ? styles.teacherOptionHover : styles.teacherOption}
          >
            Answer Key
        </button>
        <button
          onClick={() => { this.changeContext("attempts"); }}
          onMouseEnter={() => this.setState({ hover: "attempts" })}
          onMouseLeave={() => this.setState({ hover: null })}
          style={this.state.hover === "attempts" ? styles.teacherOptionHover : styles.teacherOption}
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
      teacherOptionHover: {
        border:"transparent",
        backgroundColor:"#fff",
        color:"#1e74d1",
        textDecoration: "underline",
        margin: this.responsiveTeacherOptionMargin(500),
        padding: 0,
        textAlign: this.responsiveTeacherOptionTextAlign(500),
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: "bold"
      },
      teacherOption: {
        border:"transparent",
        backgroundColor:"#fff",
        color:"#212b36",
        textDecoration: "underline",
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
