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
import AnswerFeedbackMaterial from './answer_feedback_material.jsx';

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
          <QuestionMaterial
            material={question.material}
            onChange={this.props.handleMaterialChange} />
          <AnswerFeedbackMaterial
            key={question.id}
            answers={question.answers}
            handleAnswerChange={this.props.handleAnswerChange}
            handleFeedbackChange={this.props.handleFeedbackChange}
            handleCorrectChange={this.props.handleCorrectChange}
            handleAddOption={this.props.handleAddOption}
            handleAnswerRemoval={this.props.handleAnswerRemoval}
            />
        </div>
      </div>
    );
  }
}
