"use strict";

import React from "react";
import BaseComponent from "../base_component";
import CommHandler from "../../utils/communication_handler";
import SettingsStore from "../../stores/settings";

export default class StudyMoreButton extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this.stores = [SettingsStore];

    this.state = {
      display: SettingsStore.current().showPostMessageNav
    };
  }

  render() {
    // if (!this.state.display || self == top) {
    //   return <div></div>;
    // }

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
