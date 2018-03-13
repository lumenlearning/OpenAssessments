"use strict";

import React                from 'react';
import AssessmentActions    from "../../actions/assessment";
import AssessmentStore      from "../../stores/assessment";
import Styles               from "../../themes/selection.js";
import CommunicationHandler from "../../utils/communication_handler";
import BaseComponent        from "../base_component";

const styles = Styles;

export default class MomEmbed extends BaseComponent {

  constructor(props, context) {
    super(props);
    this._bind("messageHandler", "gradeQuestion");
  }

  render() {
    var embedUrl = this.props.item.momEmbed.embedUrl;
    let redisplayJWT = Array.isArray(this.props.redisplayJWT) ? this.props.redisplayJWT[0] : this.props.redisplayJWT;

    if(redisplayJWT) {
      embedUrl += "&jwt=" + redisplayJWT;
    } else if(this.props.item.momEmbed.jwt){
      embedUrl += "&jwt=" + this.props.item.momEmbed.jwt;
    }

    var height = 150;
    if(this.props.item.momEmbed.iframeHeight){
      height = this.props.item.momEmbed.iframeHeight;
    } else if (this.state.iframeHeight){
      height = this.state.iframeHeight;
    }

    return (
        <div>
          <iframe ref="momframe" src={embedUrl} height={height} frameborder="0" width="100%" style={{border: 'none'}}></iframe>
        </div>
    );
  }

  gradeQuestion(callback=null){
    this.setState({
      doneGradingCallback: callback
    });

    this.refs.momframe.getDOMNode().contentWindow.postMessage('submit', '*');
  }

  questionId() {
    return this.props.item.momEmbed.questionId;
  }

  componentWillReceiveProps(nextProps){
    // todo: only register if not displaying an answer already
    if(nextProps.registerGradingCallback){
      nextProps.registerGradingCallback(this.gradeQuestion)
    }
  }

  componentWillMount() {
    this.setState({
      iframeHeight: null,
      doneGradingCallback: null
    });

    // todo: only register if not displaying an answer already
    if(this.props.registerGradingCallback){
      this.props.registerGradingCallback(this.gradeQuestion)
    }
    //update iframe height when getting msg from iframe src.
    window.addEventListener('message', this.messageHandler);//addEventListener
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('message', this.messageHandler);
  }

  resizeIframe(newSize) {
    let height = newSize + 'px';
    this.setState({
      iframeHeight: newSize
    });
  }

  messageHandler(e) {
    if (!e.origin.match(/https?:\/\/www\.myopenmath\.com|https?:\/\/ohm\.lumenlearning\.com|https?:\/\/ohm\.ludev\.team/)) {
      return;
    }

    try {
      var message = JSON.parse(e.data);

      switch (message.subject) {
        case 'lti.frameResize':
          if (message.frame_id == "OEAembedq-" + this.questionId()) {
            this.resizeIframe(message.height + 10);
          }
          break;
        case 'lti.ext.mom.updateScore':
          if (message.id == this.questionId()) {
            var data = {score: message.score, jwt: message.jwt, iframeHeight: this.state.iframeHeight};
            AssessmentActions.answerSelected(data);
            if(!!this.state.doneGradingCallback && typeof this.state.doneGradingCallback == 'function'){
              this.state.doneGradingCallback();
            }
          }
          break;
      }

    } catch (err) {
      console.log('invalid message received from ', e.origin, e.data);
      console.log(err);
    }
  }
}

MomEmbed.propTypes = {
  item: React.PropTypes.object.isRequired,
  registerGradingCallback: React.PropTypes.func.optional
};

MomEmbed.contextTypes = {
  theme: React.PropTypes.object
};
