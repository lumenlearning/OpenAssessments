"use strict";

import React                from 'react';
import AssessmentStore      from "../../stores/assessment";
import SettingsStore        from "../../stores/settings";
import BaseComponent        from "../base_component";
import AssessmentActions    from "../../actions/assessment";
import FormativeResult      from "./formative_result.jsx";
import SummativeResult      from "./summative_result.jsx";
import ResultStyles         from "./result_styles.js";
import CommunicationHandler from "../../utils/communication_handler";

export default class AssessmentResult extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this._bind("getStyles");
    this.stores = [AssessmentStore, SettingsStore];
    this.state = this.getState();
    this.sendLtiOutcome();
    this.sendAnalytics();
  }

  getState(props, context){

    return {
      assessmentResult : AssessmentStore.assessmentResult(),
      timeSpent        : AssessmentStore.timeSpent(),
      questions        : AssessmentStore.allQuestions(),
      outcomes         : AssessmentStore.outcomes(),
      settings         : SettingsStore.current(),
      assessment       : AssessmentStore.current()
    }
  }

  sendAnalytics(){
    if(this.state.assessmentResult && this.state.assessmentResult.assessment_results_id) {
      AssessmentActions.assessmentPostAnalytics(this.state.assessmentResult.assessment_results_id, this.state.settings.externalUserId, this.state.settings.externalContextId);
    }
  }
  sendLtiOutcome(){
    if(this.isSummative() && this.state.assessmentResult.assessment_results_id){
      AssessmentActions.assessmentPostLtiOutcome(this.state.assessmentResult.assessment_results_id);
    }
  }

  componentDidMount(){
    CommunicationHandler.sendSize();
    CommunicationHandler.showLMSNavigation();
  }

  isSummative(){
    return this.state.settings.assessmentKind.toUpperCase() == "SUMMATIVE";
  }

  isFormative(){
    return this.state.settings.assessmentKind.toUpperCase()  == "FORMATIVE";
  }

  getStyles(theme){
    return ResultStyles.getStyles(theme, this.isFormative())
  }

  render(){
    var styles = this.getStyles(this.context.theme);

    if(this.state.assessmentResult == null){
      return <div />
    }

    if(this.isFormative()){
      return <FormativeResult
          assessmentResult={this.state.assessmentResult}
          settings={this.state.settings}
          questions={this.state.questions}
          assessment={this.state.assessment}
          styles={styles}
          context={this.context}
          />
    } else {
      return <SummativeResult
          styles={styles}
          timeSpent={this.state.timeSpent}
          context={this.context}
          isSummative={this.isSummative()}
        />
    }
  }
}

AssessmentResult.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func
};

