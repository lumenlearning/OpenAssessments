"use strict";

import React                  from "react";
import _                      from "lodash";
import Style                  from "./css/style.js";
import BaseComponent          from '../../base_component.jsx';
import ReviewAssessmentActions from "../../../actions/review_assessment";
import ReviewAssessmentStore  from "../../../stores/review_assessment";

//Components
import OutcomeSelector        from './outcome_selector.jsx';
import QuestionMaterial       from './question_material.jsx';
import QuestionTypeSelector   from './question_type_selector.jsx';
import AnswerFeedbackMaterial from './answer_feedback_material.jsx';
import EssayAnswerFeedbackMaterial from './essay_feedback_material.jsx';
import MDDAnswerFeedbackMaterial from './mdd_feedback_material.jsx';
import MomEmbedFeedbackMaterial from './mom_embed_feedback_material.jsx';

export default class QuestionInterface extends BaseComponent{

  constructor(props, state) {
    super(props, state);
  }

  render() {
    let question = this.props.question;
    let style    = Style.styles();

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>

          <OutcomeSelector
            outcomes={this.props.outcomes}
            selectedOutcome={question.outcome}
            onChange={this.props.handleOutcomeChange}
            isNew={question.isNew}
          >
            <button className='btn' onClick={this.props.handleDoneEditing} style={{ fontSize: '16px'}}>Done Editing</button>
          </OutcomeSelector>
          <QuestionTypeSelector question={this.props.question} handleQuestionTypeChange={this.props.handleQuestionTypeChange} />
          {question.question_type !== 'mom_embed' ? <QuestionMaterial material={question.material} onChange={this.props.handleMaterialChange} onKeyup={this.props.handleMaterialChange} /> : null}
          {/*ensures a type has been selected before allowing feedback to be changed.*/}
          {!!question.question_type ? this.answerFeedbackMaterial() : null}
        </div>
      </div>
    );
  }//render

  answerFeedbackMaterial() {
    let question = this.props.question;
    let type = question.question_type;
    let feedbackMaterial = null;

    switch (type) {
      case "essay_question":
        feedbackMaterial = (
          <EssayAnswerFeedbackMaterial
            key={question.id}
            answers={question.answers}
            feedback={question.feedback}
            handleFeedbackChange={this.props.handleFeedbackChange}
          />
        );
      break;
      case "multiple_dropdowns_question":
        feedbackMaterial = (
          <MDDAnswerFeedbackMaterial
            key={question.id}
            answers={question.answers}
            question={question}
            handleAnswerChange={this.props.handleAnswerChange}
            handleFeedbackChange={this.props.handleFeedbackChange}
            handleCorrectChange={this.props.handleCorrectChange}
            handleAddOption={this.props.handleAddOption}
            handleAnswerRemoval={this.props.handleAnswerRemoval}
          />
        );
      break;
      case "mom_embed":
        feedbackMaterial = (
          <MomEmbedFeedbackMaterial
            key={question.id}
            answers={question.answers}
            question={question}
            handleAnswerChange={this.props.handleAnswerChange}
          />
        );
      break;
      default:
        feedbackMaterial = (
          <AnswerFeedbackMaterial
            key={question.id}
            answers={!!question.answers ? question.answers : []}
            handleAnswerChange={this.props.handleAnswerChange}
            handleFeedbackChange={this.props.handleFeedbackChange}
            handleCorrectChange={this.props.handleCorrectChange}
            handleAddOption={this.props.handleAddOption}
            handleAnswerRemoval={this.props.handleAnswerRemoval}
          />
        );
      break;
    }

    return feedbackMaterial;
  }//answerFeedbackMaterial
}
