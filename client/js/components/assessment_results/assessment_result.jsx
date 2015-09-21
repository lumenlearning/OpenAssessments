"use strict";

import React                from 'react';
import AssessmentStore      from "../../stores/assessment";
import SettingsStore        from "../../stores/settings";
import BaseComponent        from "../base_component";
import AssessmentActions    from "../../actions/assessment";
import FormativeResult      from "./formative_result.jsx";
import SummativeResult      from "./summative_result.jsx";
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
  }

  isSummative(){
    return this.state.settings.assessmentKind.toUpperCase() == "SUMMATIVE";
  }

  isFormative(){
    return this.state.settings.assessmentKind.toUpperCase()  == "FORMATIVE";
  }

  render(){
    var styles = this.getStyles(this.context.theme);

    if(this.state.assessmentResult == null){
      return <div />
    }

    var content = <div/>;

    if(this.isFormative()){
      content = <FormativeResult
          assessmentResult={this.state.assessmentResult}
          settings={this.state.settings}
          questions={this.state.questions}
          assessment={this.state.assessment}
          styles={styles}
          context={this.context}
          />
    } else {
      content = <SummativeResult
          styles={styles}
          timeSpent={this.state.timeSpent}
          context={this.context}
          isSummative={this.isSummative()}
        />
    }
    return  <div>
              {content}
            </div>
  }

  getStyles(theme){

    return {
      assessment: {
        padding: this.isFormative() ? "" : theme.assessmentPadding,
        backgroundColor: theme.assessmentBackground,
      },
      progressStyle: {
        width:"100%"
      },
      wrapperStyle:{
        width: "100%",
        position: "relative",
        maxHeight: "300px",
        overflowY: "auto"
      },
      yourScoreStyle: {
        backgroundColor: theme.definitelyBackgroundColor,
        color: "#fff",
        borderRadius: "4px",
        textAlign: "center",
        padding: "10px 20px 20px 20px"
      },
      improveScoreStyle:{
        color: "#f00"
      },
      green: {
        color: "#458B00"
      },
      assessmentContainer:{
        marginTop: this.isFormative() ? "0px" : "70px",
        boxShadow: this.isFormative() ? "" : theme.assessmentContainerBoxShadow,
        borderRadius: theme.assessmentContainerBorderRadius,
        padding: "20px"
      },
      resultsStyle: {
        padding: "20px"
      },
      formative: {
        padding: "5",
        marginTop: "0px",

      },
      icon: {
        height: "62px",
        width: "62px",
      },
      data: {
        marginTop: "-5px"
      },
      selfCheck: {
        fontSize: "140%"
      },
      outcomes: {
        backgroundColor: "rgba(204, 204, 204, .2)",

      },
      row: {
        padding: "15px",

      },
      outcomeContainer: {
        textAlign: "center",
        marginTop: "70px"
      },
      outcomeIcon: {
        width: "100px",
        height: "100px",
        marginTop: "80px"
      },
      header: {
        padding: "15px",
        backgroundColor: theme.primaryBackgroundColor,
        position: "absolute",
        top: "0px",
        left: "0px",
        fontSize: "140%",
        color: "white",
        width: "100%"
      },
      resultList: {
        width: "90%",
        margin: "auto",
        overflowY: "hidden",
      },
      resultOutcome: {
        textAlign: "left"
      },
      retakeButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor,
        color: theme.definitelyColor,
        marginBottom: "10px"
      },
      jumpButton: {
        marginTop: "10px",
        width: theme.definitelyWidth,
        backgroundColor: theme.submitBackgroundColor,
        color: theme.definitelyColor,
      },
        exitButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.primaryBackgroundColor,
        color: theme.definitelyColor,
        marginLeft: "15px"
      },
      buttonsDiv: {
        marginTop: "20px",
        marginBottom: "50px"
      },
      titleBar: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.primaryBackgroundColor,
        color: "white",
        fontSize: "130%",
        //fontWeight: "bold"
      },
      warningStyle: {
        width: "100%",
        padding:  "20px",
        backgroundColor: theme.maybeBackgroundColor,
        borderRadius: "4px",
        marginTop: "30px",
        color: "white",
        fontWeight: "bold",
        fontSize: "130%"
      }
    }
  }
}

AssessmentResult.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func
};

