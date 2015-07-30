"use strict";

import React              from 'react';
import AssessmentStore    from "../../stores/assessment";
import SettingsStore      from "../../stores/settings";
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import ItemResult         from "./item_result";

export default class AssessmentResult extends BaseComponent{
 
  constructor(props, context){
    super(props, context);
    this._bind("getItemResults", "getStyles", "getOutcomeLists", "getContent");
    this.stores = [AssessmentStore, SettingsStore];
    this.state = this.getState();
  }

  getState(){
    return {
      assessmentResult : AssessmentStore.assessmentResult(),
      timeSpent        : AssessmentStore.timeSpent(),
      questions        : AssessmentStore.allQuestions(),
      outcomes         : AssessmentStore.outcomes(),
      settings         : SettingsStore.current(),
      assessment       : AssessmentStore.current(),  
    }
  }

  getStyles(theme){
    return {
      assessment: {
        padding: theme.assessmentPadding,
        backgroundColor: theme.assessmentBackground,
      },
      progressStyle: {
        width:"100%"
      },
      wrapperStyle:{
        width: "100%",
        position: "relative"
      },
      yourScoreStyle: {
        backgroundColor: theme.definitelyBackgroundColor,
        color: "#fff",
        borderRadius: "25px",
        textAlign: "center",
        padding: "2%"
      },
      improveScoreStyle:{
        color: "#f00"
      },
      green: {
        color: "#458B00"
      },
      assessmentContainer:{
        marginTop: "70px",
        boxShadow: theme.assessmentContainerBoxShadow, 
        borderRadius: theme.assessmentContainerBorderRadius,
        padding: "20px"
      },
      resultsStyle: {
        padding: "20px"
      },
      formative: {
        padding: "0px 30px 20px 30px",
        marginTop: "0px"
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
    }
  }

  getItemResults(){
    return this.state.questions.map((question, index)=>{
      return <ItemResult question={question} isCorrect={this.state.assessmentResult.correct_list[index]} confidence={this.state.assessmentResult.confidence_level_list[index]}/>;
    })
  }

  getOutcomeLists(styles){
    var lists = {
      positiveList: [],
      negativeList: [],
    };
    var sectionIndex = 0;
    var perSecCount = 0;
    var correctCount = 0;
    var correctList = this.state.assessmentResult.correct_list;
    for(var i = 0; i < correctList.length; i++){
      //make sure to check to see if the amount of questions per section is less the ammount chosen per section
      var correct = correctList[i]
      perSecCount++;

      if(!correct || correct == "partial"){
        lists.negativeList.push(this.state.outcomes[sectionIndex]);
        i += (this.state.settings.perSec - perSecCount);
        sectionIndex++;
        perSecCount = 0;
        continue;
      } else {
        correctCount++;
        if(correctCount == this.state.settings.perSec || correctCount == this.state.assessment.sections[sectionIndex + 1].items.length){
          lists.positiveList.push(this.state.outcomes[sectionIndex]);
          correctCount = 0;
        }
      }

      if(perSecCount == this.state.settings.perSec || perSecCount == this.state.assessment.sections[sectionIndex + 1].items.length){
        sectionIndex++;
        correctCount = 0;
        perSecCount = 0;
      }
    }

    var positiveList = lists.positiveList.map((item, index)=>{
      return <div key={"positive " + index}><p style={styles.green}><i className="glyphicon glyphicon-ok" style={styles.green}></i>{item.shortOutcome}</p></div>;
    });

    var negativeList = lists.negativeList.map((item, index)=>{
      return <div key={"negative " + index}><p>{item.shortOutcome}</p></div>;
    });
    return {
      positiveList: positiveList,
      negativeList: negativeList
    };
  }

  getContent(styles, itemResults, OutcomeLists){
    return (<div style={styles.assessment}>
      <div style={styles.assessmentContainer}>
        <div className="row" style={styles.wrapperStyle}>

          <div className="col-md-4" >
            <h3><strong>Your Quiz Results</strong></h3>
            <div style={styles.yourScoreStyle}>
              <h5 style={styles.center}>Your Score</h5>
              <h1 style={styles.center}>{Math.trunc(this.state.assessmentResult.score)}%</h1>
            </div>
            Time Spent: {this.state.timeSpent.minutes} mins {this.state.timeSpent.seconds} sec
            <br />
            Attempts
          </div>

          <div className="col-md-4" >
            <h3><strong>Good Work On These Concepts</strong></h3>
            <p>You answered questions that covered these concepts correctly.</p>
            {outcomeLists.positiveList}
            <div style={{clear: 'both'}}></div>
          </div>

          <div className="col-md-4" >
            <h3 style={styles.improveScoreStyle}><strong>There is still more to learn<i styleclassName="glyphicon glyphicon-warning-sign" ></i></strong></h3>
            <p>You can retake this quiz in 1 hour - plenty of time to review these sections!</p>
            {outcomeLists.negativeList}
          </div>

        </div>
        <hr />
        <div style={styles.resultsStyle}>
          {itemResults}
        </div>
      </div>
    </div>)
  }
  getFormativeContent(styles, OutcomeLists){
    return <div style={styles.assessment}>
        <div style={styles.assessmentContainer}>
          <div style={styles.formative}>
            <div className="row">
              <div className="col-md-1"><img style={styles.icon} src={require("../../../../app/assets/fonts/ProgressIcon.svg")} /></div>
              <div className="col-md-10" style={styles.data}>
                <div>PRIMARY OUTCOME TITLE</div>
                <div style={styles.selfCheck}><b>Self-Check</b></div>
                <div>{this.state.outcomes[0].longOutcome}</div>
              </div>
            </div>
            <hr />
            <div className="row">
            </div>
          </div>
        </div>
      </div>
  }

  render(){
    var styles = this.getStyles(this.context.theme); 
    var itemResults = this.getItemResults();
    var outcomeLists = this.getOutcomeLists(styles);
    var content = <div />;
    if(this.state.settings.assessmentKind.toUpperCase() == "FORMATIVE"){
      content = this.getFormativeContent(styles, outcomeLists);
    } else {
      content = this.getContent(styles, itemResults, outcomeLists);
    }
    return content;

  }
}

AssessmentResult.contextTypes = {
  theme: React.PropTypes.object,
}