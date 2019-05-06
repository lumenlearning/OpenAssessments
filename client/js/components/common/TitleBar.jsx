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
    if (this.shouldRenderTitle()) {
      return this.props.title;
    }
  }

  shouldRenderTitle() {
    return this.isSwyk() || (this.isSummative() && this.props.assessmentLoaded);
  }

  isSwyk() {
    return this.props.assessmentKind && this.props.assessmentKind.toUpperCase() === "SHOW_WHAT_YOU_KNOW";
  }

  isSummative() {
    return this.props.assessmentKind && this.props.assessmentKind.toUpperCase() === "SUMMATIVE";
  }

  getStyles() {
    return {
      titleBar: {
        borderBottom: "2px solid #003136",
        height: this.shouldRenderTitle() ? "auto" : 0,
        padding: this.shouldRenderTitle() ? "0 40px 12px 16px" : 0
      },
      title: {
        color: "#212b36",
        display: "inline-block",
        fontFamily: "Arial",
        fontSize: "20px",
        fontWeight: "400",
        lineHeight: "1.4"
      }
    };
  }
}
