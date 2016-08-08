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
      Correct the following in order to save.
      <ul>
        {this.props.errorMessages.map((message, i)=> {
          return <li key={"msg_" + i}>{message}</li>
        })}
      </ul>
    </div>
  }

  warningMessages(style) {
    if (!this.props.warningMessages || this.props.warningMessages.length < 1) {
      return '';
    }

    return <div className="eqHeader" style={style.warningHeader}>
      <ul>
        {this.props.warningMessages.map((message, i)=> {
          return <li key={"msg_" + i}>{message}</li>
        })}
      </ul>
    </div>
  }

  hasMessages() {
    return (this.props.warningMessages && this.props.warningMessages.length > 0) || (this.props.errorMessages && this.props.errorMessages.length > 0)
  }
  render() {
    if (!this.hasMessages()) {
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
