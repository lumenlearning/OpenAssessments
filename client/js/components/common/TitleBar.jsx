"use strict";

// Dependencies
import React from "react";

export default class TitleBar extends React.Component {
  render() {
    let styles = this.getStyles();

    return (
      <div className="assessment-header" style={styles.titleBar}>
        <h1 style={styles.title} tabIndex="0">
          {this.getTitle()}
        </h1>
      </div>
    );
  }

  getTitle() {
    if (this.isSwyk()) {
      return this.props.title;
    }
  }

  isSwyk() {
    return this.props.assessmentKind && this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW";
  }

  getStyles() {
    return {
      titleBar: {
        borderBottom: "2px solid #003136",
        height: this.isSwyk() ? "auto" : 0, 
        padding: this.isSwyk() ? "0 40px 22px 0" : 0
      },
      title: {
        color: "#212b36",
        display: "inline-block",
        fontFamily: "Arial",
        fontSize: "28px",
        fontWeight: "400",
        lineHeight: "1.4",
        marginTop: 0
      }
    };
  }
}
