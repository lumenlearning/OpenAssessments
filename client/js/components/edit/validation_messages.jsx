"use strict";

import React         from "react";
import BaseComponent from '../base_component.jsx';
import Style         from './css/style';

export default class ValidationMessages extends BaseComponent {

  constructor(props, state) {
    super(props, state);
    this._bind('hasMessages', 'needsSaving', 'messages')
  }

  messages() {
    var validationMessages = [];
    if (this.props.message && !this.props.message.isValid) {
      this.props.message.messages.forEach((text, index)=> {
        validationMessages.push(<p key={"msg_" + index}>{text}</p>);
      });
    }
    if (this.props.messages) {
      this.props.messages.forEach((message, i)=> {
        if (!this.props.message.isValid) {
          message.messages.forEach((text, j)=> {
            validationMessages.push(<p key={"msg_" + i + j}>{text}</p>);
          });
        }
      });
    }

    return validationMessages
  }

  hasMessages() {
    return this.props.needsSaving ||
        (this.props.message && !this.props.message.isValid ) ||
        (this.props.messages && _.findIndex(this.props.messages, {isValid: false}) >= 0)
  }

  needsSaving(style) {
    if (this.props.needsSaving) {
      return <div className="eqTitle" style={style.eqTitle}>
        Quiz needs to be saved.
      </div>
    } else {
      return '';
    }
  }

  render() {
    if (!this.hasMessages()) {
      return <div />;
    }

    let style = Style.styles();

    return (
        <div className="eqHeader" style={style.noticeHeader}>
          {this.needsSaving(style)}
          {this.messages()}
        </div>
    );
  }

}
