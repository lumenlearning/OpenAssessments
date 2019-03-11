"use strict";
// Dependencies
import React from 'react';
// Actions
import ReviewAssessmentActions from "../../actions/review_assessment";
// Stores
import ReviewAssessmentStore from "../../stores/review_assessment";
import SettingsStore from "../../stores/settings";
// Subcomponents
import BaseComponent from "../base_component";
import TeacherOptions from "../assessments/teacher_options/TeacherOptions";
import ItemResult from "./item_result";
// Styles/Scripts
import ResultStyles from "./result_styles.js";
import CommunicationHandler from "../../utils/communication_handler";

export default class TeacherPreview extends BaseComponent{
  constructor(props, context) {
    super(props, context);

    this.stores = [ReviewAssessmentStore];
    ReviewAssessmentActions.loadAssessmentXmlForReview(window.DEFAULT_SETTINGS, props.params.assessmentId);

    this.state = this.getState();
  }

  getState() {
    return {
      questions: ReviewAssessmentStore.allQuestions(),
      outcomes: ReviewAssessmentStore.outcomes(),
      settings: SettingsStore.current(),
      assessment: ReviewAssessmentStore.current()
    }
  }


  render() {
    let styles = this.getStyles(this.context.theme);
    let itemResults = this.getItemResults();

    return (
      <div style={styles.assessment}>
        <div style={styles.assessmentContainer}>
          <div className="assessment-header" style={styles.titleBar}>
            {this.state.settings ? this.state.settings.assessmentTitle : ""}
          </div>
          <TeacherOptions
            assessmentId={this.props.assessmentId}
            context={this.context}
            externalContextId={this.props.externalContextId}
            />
          <div className="start-header-wrapper" style={styles.headerWrapper}>
            <h2 style={styles.quizTitle}>{this.state.settings ? this.state.settings.assessmentTitle : ""}</h2>
          </div>
          <div id="questionsStart" style={styles.resultsStyle}>
            <p style={styles.answerKeyLabel}>Answer Key</p>
            {itemResults}
          </div>
        </div>
      </div>
    );
  }

  getStyles(theme) {
    return ResultStyles.getStyles(theme)
  }

  getItemResults() {
    return ReviewAssessmentStore.allQuestions().map((question, index) => {
      return (
        <ItemResult
          key={index}
          question={question}
          isCorrect={"teacher_preview"}
          index={index}
          confidence={"teacher_preview"}
          chosen={[]}
          correctAnswers={question.correct}
          />
      );
    });
  }
}

TeacherPreview.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func
};

module.export = TeacherPreview;
