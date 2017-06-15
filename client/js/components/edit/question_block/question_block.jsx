"use strict";

import React        from "react";
import Style        from "./css/style.js";
import Expandable   from '../../common/expandable_dropdown/expandable_dropdown.jsx';
import CommunicationHandler from "../../../utils/communication_handler";

import MultiChoiceNAnswerFeedback from './question_types/multi_choice_and_multi_answer.jsx';
import EssayQuestionFeedback from './question_types/essay_question.jsx';
import MultiDropdownFeedback from './question_types/multi_dropdown.jsx';
import MomEmbed from './question_types/mom_embed.jsx';

export default class QuestionBlock extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.handleResize = this.handleResize.bind(this);

    this.state = {
      windowWidth: window.innerWidth
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    CommunicationHandler.sendSizeThrottled();
    window.addEventListener('resize', this.handleResize);
  }

  render() {
    let question    = this.props.question;
    let style       = Style.styles();
    let feedbackContent = this.determineFeedbackContent();

    return (
      <div style={style.qbContent}>
        <div style={style.qbContentHead}>
          <p style={style.qbQuestion} dangerouslySetInnerHTML={this.constructor.createMarkup(question.material)} />
        </div>

        {feedbackContent}

      </div>
    )

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(e) {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  determineFeedbackContent() {
    let question    = this.props.question;
    let windowWidth = this.props.windowWidth;
    let type = question.question_type;
    let feedbackContent;

    switch (type) {
      case "essay_question":
        feedbackContent = <EssayQuestionFeedback question={question} windowWidth={windowWidth} />;
      break;
      case "multiple_dropdowns_question":
        feedbackContent = <MultiDropdownFeedback question={question} windowWidth={windowWidth} />;
      break;
      case 'mom_embed':
        feedbackContent = <MomEmbed question={question} windowWidth={windowWidth} />;
      break;
      default:
        feedbackContent = <MultiChoiceNAnswerFeedback question={question} windowWidth={windowWidth} />;
      break;
    }

    return feedbackContent;
  }//determineFeedbackContent

  static createMarkup(data) {
    return {__html: data};
  }

}
