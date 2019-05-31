"use strict";
// Dependencies
import React from "react";
// Components
import BaseComponent from "../base_component";
import UniversalInput from "./universal_input";

export default class FormativeHeader extends BaseComponent {
  render() {
    let styles = this.getStyles();

    return(
      <div style={styles.header}>
        <h1 style={styles.h1}>
          {this.props.assessmentTitle}
        </h1>
      </div>
    );
  }

  getStyles(theme) {
    return (
      {
        h1: {
          fontSize: "20px",
          margin: 0
        },
        header: {
          borderTop: "2px solid #003136",
          borderBottom: "1px solid #c4cdd5",
          padding: "22px 40px 22px 16px",
          fontSize: "20px",
          fontWeight: "400",
          color: "#212b36",
          lineHeight: "1.4"
        },
      }
    );
  }
}
