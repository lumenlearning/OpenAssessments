"use strict";

import React from 'react';
import BaseComponent      from "../base_component";
import CommunicationHandler from "../../utils/communication_handler";
import SettingsStore      from "../../stores/settings";

export default class FullPostNav extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.stores = [SettingsStore];
    this.state = {
      display: SettingsStore.current().showPostMessageNav
    };
  }

  render() {
    if (!this.state.display || self == top) {
      return <div></div>;
    }

    return <div className="lti-bottom-nav-buttons">
        <button className="lti-nav-btn" id="lti-prev" onClick={()=>{CommunicationHandler.navigatePrevious()}}><span className="lti-btn-arrow">&#10094;</span><span className="lti-btn-text">Previous</span></button>
        <button className="lti-nav-btn" id="lti-next" onClick={()=>{CommunicationHandler.navigateNext()}}><span className="lti-btn-text">Next</span><span className="lti-btn-arrow">&#10095;</span></button>
        <button className="lti-nav-btn" id="study-plan" onClick={()=>{CommunicationHandler.navigateHome()}}>Study Plan</button>
      </div>
  }
};

module.export = FullPostNav;
