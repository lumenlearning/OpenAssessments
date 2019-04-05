"use strict";

// Dependencies
import React from "react";

export default class TitleBar extends React.Component {
  render() {
    let styles = this.getStyles();

    return (
      <div className="assessment-header" style={styles.titleBar}></div>
    );
  }

  getStyles() {
    return {
      titleBar: {
        borderBottom: "2px solid #003136",
        padding: 0
      }
    };
  }
}
