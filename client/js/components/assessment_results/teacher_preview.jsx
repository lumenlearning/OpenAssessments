"use strict";

import React                   from 'react';
import BaseComponent           from "../base_component";
import SettingsStore           from "../../stores/settings";
import ReviewAssessmentActions from "../../actions/review_assessment";
import ReviewAssessmentStore   from "../../stores/review_assessment";
import ResultStyles            from "./result_styles.js";
import CommunicationHandler    from "../../utils/communication_handler";
import ItemResult           from "./item_result";

export default class TeacherPreview extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this.stores = [ReviewAssessmentStore];
    if(!ReviewAssessmentStore.isLoaded() && !ReviewAssessmentStore.isLoading()){
      ReviewAssessmentActions.loadAssessment(window.DEFAULT_SETTINGS);
    }
    this.state = this.getState();
  }

  getState(){
    return {
      questions        : ReviewAssessmentStore.allQuestions(),
      outcomes         : ReviewAssessmentStore.outcomes(),
      settings         : SettingsStore.current(),
      assessment       : ReviewAssessmentStore.current()
    }
  }

  isSummative(){
    return this.state.settings.assessmentKind.toUpperCase() == "SUMMATIVE";
  }

  getStyles(theme){
    return ResultStyles.getStyles(theme)
  }

  getItemResults(){
    //return <p>hi</p>;

    return ReviewAssessmentStore.allQuestions().map((question, index)=>{
        return <ItemResult key={index}
                           question={question}
                           isCorrect={"teacher_preview"}
                           index={index}
                           confidence={"teacher_preview"}
                           chosen={[]}
                           correctAnswers={question.correct}/>;
      });
  }

  render(){
    var styles = this.getStyles(this.context.theme);
    var itemResults = this.getItemResults();

    return (<div style={styles.assessment}>
      <div style={styles.assessmentContainer}>
        <div style={styles.titleBar}>{this.state.assessment ? this.state.assessment.title : ""}</div>

        <div id="questionsStart" style={styles.resultsStyle}>
          {itemResults}
        </div>

      </div>
    </div>)

    //return <SummativeResult
    //    styles={this.getStyles(this.context.theme)}
    //    context={this.context}
    //    isSummative={this.isSummative()}
    //    assessmentResult={this.state.assessmentResult}
    //    assessment={this.state.assessment}
    //    outcomes={this.state.outcomes}
    //    questionResponses={this.state.assessmentResult.question_responses}
    //    user={this.state.assessmentResult.user}
    //    />
  }
}

TeacherPreview.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func
};

module.export = TeacherPreview;