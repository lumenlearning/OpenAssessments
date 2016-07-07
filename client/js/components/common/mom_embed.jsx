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
    this._bind("messageHandler", "clickyclick");
  }

  render() {
    var embed = this.state.embedUrl;
    if(this.state.previousAnswer && this.state.previousAnswer.embedUrl){
      embed = this.state.previousAnswer.embedUrl;
    }

    return (
        <div>
          <iframe ref="momframe" src={embed} height={this.state.iframeHeight} frameborder="0" width="100%" style={{border: 'none'}}></iframe>
          <div onClick={()=>{this.clickyclick()}}>Click</div>
        </div>
    );
  }

  clickyclick() {
    this.refs.momframe.getDOMNode().contentWindow.postMessage('submit', '*');
  }

  questionId() {
    return this.props.item.momEmbed.momQuestionId;
  }

  componentWillMount() {
    this.setState({
      embedUrl: this.props.item.momEmbed.momEmbedUrl,
      previousAnswer: AssessmentStore.studentAnswers(),
      iframeHeight: 50
    });

    //update iframe height when getting msg from iframe src.
    window.addEventListener('message', this.messageHandler);//addEventListener
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageHandler);
  }

  resizeIframe(newSize) {
    let height = newSize + 'px';
    this.setState({
      iframeHeight: newSize
    });
  }

  messageHandler(e) {
    //if (!e.origin.match(/https?:\/\/www.myopenmath.com/)) {
    //  return;
    //}

    try {
      var message = JSON.parse(e.data);

      switch (message.subject) {
        case 'lti.frameResize':
          this.resizeIframe(message.height);
          break;
        case 'lti.ext.mom.updateScore':
            var newUrl = this.props.item.momEmbed.momEmbedUrl + "&redisplay=" + message.redisplay;
            var data = {embedUrl: newUrl, score: message.score, jwt: message.jwt};
            this.setState({previousAnswer: data});
            AssessmentActions.answerSelected(data);
          break;
      }

    } catch (err) {
      console.log('invalid message received from ', e.origin);
    }
  }
}

MomEmbed.propTypes = {
  item: React.PropTypes.object.isRequired,
};

MomEmbed.contextTypes = {
  theme: React.PropTypes.object
};
