"use strict";

import React from 'react';
import BaseComponent      from "../base_component";
import CommHandler from "../../utils/communication_handler";
import SettingsStore      from "../../stores/settings";

export default class StudyPlanButton extends BaseComponent {
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

    return <div style={{marginTop : '10px'}}>
      <button className="lti-nav-btn" id="study-plan" style={{width : 'initial'}} onClick={()=>{CommHandler.navigateHome()}}>
        View updated study plan
      </button>
    </div>
  }
};

module.export = StudyPlanButton;
