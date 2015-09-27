"use strict";

import React                   from 'react';
import BaseComponent           from "../base_component";
import SettingsStore           from "../../stores/settings";
import ReviewAssessmentActions from "../../actions/review_assessment";
import ReviewAssessmentStore   from "../../stores/review_assessment";
import SummativeResult         from "./summative_result.jsx";
import ResultStyles            from "./result_styles.js";
import CommunicationHandler    from "../../utils/communication_handler";

export default class TeacherReview extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this.stores = [ReviewAssessmentStore];
    if(!ReviewAssessmentStore.isLoaded() && !ReviewAssessmentStore.isLoading()){
      ReviewAssessmentActions.loadAssessment(window.DEFAULT_SETTINGS);
    }
    ReviewAssessmentActions.loadAssessmentResult(props.params.assessmentId, props.params.attempdId);
    this.state = this.getState();
  }

  getState(){
    return {
      assessmentResult : ReviewAssessmentStore.assessmentResult(),
      timeSpent        : ReviewAssessmentStore.timeSpent(),
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

  render(){
    if(this.state.assessmentResult == null){
      return <div>Loading.</div>
    }


    return <SummativeResult
        styles={this.getStyles(this.context.theme)}
        context={this.context}
        isSummative={this.isSummative()}
        assessmentResult={this.state.assessmentResult}
        assessment={this.state.assessment}
        outcomes={this.state.outcomes}
        questionResponses={this.state.assessmentResult.question_responses}
        user={this.state.assessmentResult.user}
        />
  }
}

TeacherReview.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func
};

module.export = TeacherReview;