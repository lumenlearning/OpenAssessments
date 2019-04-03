"use strict";

// Dependencies
import React from "react";

export default class TitleBar extends React.Component {
  render() {
    let styles = this.getStyles();

    return (
      <div className="assessment-header" style={styles.titleBar}>
        {this.props.title}
      </div>
    );
  }

  getStyles() {
    return {
      titleBar: {
        borderBottom: "2px solid #003136",
        padding: "22px 40px 22px 0",
        fontFamily: "Arial",
        fontSize: "28px",
        fontWeight: "400",
        color: "#212b36",
        lineHeight: "1.4"
      }
    }
  }
}
