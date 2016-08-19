"use strict";

import React         from "react";
import BaseComponent from '../base_component.jsx';
import Style         from './css/style';

export default class ValidationMessages extends BaseComponent {

  constructor(props, state) {
    super(props, state);
    this._bind('hasMessages', 'errorMessages', 'warningMessages')
  }

  errorMessages(style) {
    if (!this.props.errorMessages || this.props.errorMessages.length < 1) {
      return '';
    }

    return <div className="eqHeader" style={style.errorHeader}>
      <div>
        <img src="/assets/stop.png" alt="Stop"/>
      </div>
      <div style={{paddingLeft:'10px'}}>
        Correct the following in order to save:
        <ul style={{listStyleType:'-'}}>
          {this.props.errorMessages.map((message, i)=> {
            return <li key={"msg_" + i}>{message}</li>
          })}
        </ul>
      </div>
    </div>
  }

  warningMessages(style) {
    if (!this.props.needsSaving && (!this.props.warningMessages || this.props.warningMessages.length < 1)) {
      return '';
    }

    return <div className="eqHeader" style={style.warningHeader}>
      <div>
        <img src="/assets/warning-32.png" alt="Warning"/>
      </div>
      <div style={{paddingLeft:'10px'}}>
        Warning, please correct the following issue(s):
        <ul style={{listStyleType:'circle'}}>
          <li>You have unsaved changes.</li>
          {this.props.warningMessages.map((message, i)=> {
            return <li key={"msg_" + i}>{message}</li>
          })}
        </ul>
      </div>
    </div>
  }

  hasMessages() {
    return (this.props.warningMessages && this.props.warningMessages.length > 0) || (this.props.errorMessages && this.props.errorMessages.length > 0)
  }
  render() {
    if (!this.hasMessages() && !this.props.needsSaving) {
      return <div />;
    }

    let style = Style.styles();

    return (
        <div>
          {this.warningMessages(style)}
          {this.errorMessages(style)}
        </div>
    );
  }

}
