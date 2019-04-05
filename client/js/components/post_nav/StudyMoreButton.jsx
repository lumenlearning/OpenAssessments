"use strict";
// Dependencies
import React from "react";
// Subcomponents
import BaseComponent from "../base_component";
// Stores
import SettingsStore from "../../stores/settings";
// Utils
import CommHandler from "../../utils/communication_handler";

// Study More Button Class
export default class StudyMoreButton extends BaseComponent {
  render() {
    let styles = this.getStyles();

    return (
      <div className="study-button-wrapper">
        <button
          className="lti-nav-btn"
          id="study-more"
          style={styles.button}
          onClick={() => { CommHandler.navigateHome(); }}
          >
            Study More
        </button>
      </div>
    );
  }

  getStyles() {
    return {
      button: {
        backgroundColor: "#1e74d1 !important",
        border: "#004c9f",
        borderRadius: "4px",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "normal",
        height: "36px",
        margin: "5px",
        minWidth: "97px",
        padding: "6px 12px",
        width: "auto"
      }
    };
  }
};

module.export = StudyMoreButton;
