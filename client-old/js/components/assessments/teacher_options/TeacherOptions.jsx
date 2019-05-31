"use strict";

// Dependencies
import React from "react";

// Teacher Options Subcomponent
export default class TeacherOptions extends React.Component {
  constructor(props) {
    super(props);

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
          Student View
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
        backgroundImage: "linear-gradient(to bottom, #f9fafb, #f9fafb), linear-gradient(to bottom, rgba(33, 43, 54, 0.06), rgba(33, 43, 54, 0.12))",
        borderColor: "#919eab",
        borderRadius: "3px",
        boxShadow: "0 1px 0 0 rgba(33, 43, 54, 0.08)",
        color:"#212b36",
        margin: this.responsiveTeacherOptionMargin(500),
        padding: "8px 16px",
        textAlign: "center",
        fontSize: "14px"
      },
      teacherOption: {
        backgroundImage: "linear-gradient(to bottom, #f9fafb, #f9fafb), linear-gradient(to bottom, rgba(33, 43, 54, 0), rgba(33, 43, 54, 0.04))",
        borderColor: "#c4cdd5",
        borderRadius: "3px",
        boxShadow: "0 1px 0 0 rgba(33, 43, 54, 0.08), inset 0 1px 0 1px rgba(255, 255, 255, 0.08)",
        color: "#212b36",
        margin: this.responsiveTeacherOptionMargin(500),
        padding: "8px 16px",
        textAlign: "center",
        fontSize: "14px"
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
    return this.state.windowWidth <= breakPoint ? "4px 0" : "20px 8px 20px 0";
  }
}
