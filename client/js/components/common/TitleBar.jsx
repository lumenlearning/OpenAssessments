"use strict";

// Dependencies
import React from "react";

export default class TitleBar extends React.Component {
  render() {
    let styles = this.getStyles();

    return (
      <div className="assessment-header" style={styles.titleBar}>
        <h1 style={styles.title} tabIndex="0">{this.props.title}</h1>
      </div>
    );
  }

  getStyles() {
    return {
      titleBar: {
        borderBottom: "2px solid #003136",
        padding: "22px 40px 22px 0"
      },
      title: {
        color: "#212b36",
        display: "inline-block",
        fontFamily: "Arial",
        fontSize: "28px",
        fontWeight: "400",
        lineHeight: "1.4"
      }
    }
  }
}
