"use strict";

// Dependencies
import React from "react";

// Start Button
export default class StartButton extends React.Component {
  constructor() {
    super();

    this.state = {
      hover: false
    }
  }

  render() {
    let styles = this.getStyles();

    return (
      <button
        style={this.state.hover ? styles.startButtonHover : styles.startButton}
        className="btn btn-info"
        onClick={() => this.props.waitOrStart()}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        >
          {this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW" ? "Start Pre-test" : "Start Quiz"}
      </button>
    );
  }

  getStyles() {
    return {
      startButton: {
        margin: "5px 5px 5px 0px",
        height: "36px",
        minWidth: "97px",
        backgroundColor: "#1e74d1 !important",
        border: "solid 1px #004c9f"
      },
      startButtonHover: {
        margin: "5px 5px 5px 0px",
        height: "36px",
        minWidth: "97px",
        backgroundColor: "#0059ba !important",
        border: "solid 1px #004c9f"
      }
    };
  }
}
