"use strict";

import React            from 'react';
import AssessmentActions    from "../../actions/assessment";
import AssessmentStore      from "../../stores/assessment";
import SettingsStore        from "../../stores/settings";
import ItemResult           from "./item_result";

//polyfill trunc
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};

export default class ResultSummary extends React.Component{

  constructor(props, context){
    super(props, context);
    this.stores = [AssessmentStore, SettingsStore];
    this.state = this.getState();
  }

  getState(props, context){
    return {
      assessmentResult : this.props.assessmentResult || AssessmentStore.assessmentResult(),
      outcomes         : this.props.outcomes || AssessmentStore.outcomes(),
      settings         : SettingsStore.current(),
      assessment       : this.props.assessment || AssessmentStore.current()
    }
  }

  getOutcomeLists(styles){
    var lists = {
      positiveList: [],
      negativeList: []
    };
    var sectionIndex = 0;
    var perSecCount = 0;
    var correctCount = 0;
    var correctList = this.state.assessmentResult.correct_list;
    for(var i = 0; i < correctList.length; i++){
      //make sure to check to see if the amount of questions per section is less the ammount chosen per section
      var correct = correctList[i];
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
      return <div key={"positive " + index} title={item.longOutcome}><p style={styles.green}><i className="glyphicon glyphicon-ok" style={styles.green}></i>{" " + item.shortOutcome + " "}<i className="glyphicon glyphicon-info-sign"></i></p></div>;
    });

    var negativeList = lists.negativeList.map((item, index)=>{
      return <div key={"negative " + index}><p>{item.shortOutcome}</p></div>;
    });
    return {
      positiveList: positiveList,
      negativeList: negativeList
    };
  }

  render() {
    var styles = this.props.styles;
    var outcomeLists = this.getOutcomeLists(styles);
    var contentData = {
          goodWork:"Good Work on These Concepts",
          moreToLearn:"There is Still More to Learn",
          focusStudy:"Review these concepts before your last quiz attempt or to prepare for your next performance assessment."
        };

    if(this.state.settings.assessmentKind.toUpperCase() == "SHOW_WHAT_YOU_KNOW"){
      contentData = {
        goodWork: "What You Already Know",
        moreToLearn: "What You Need to Learn",
        focusStudy: "Focus enough study time on these concepts to learn them well."
      };
    }

    return (<div className="row" tabIndex="0" style={styles.wrapperStyle}>

          <div className="col-md-4 col-sm-4 col-xs-4" >
            <h3><strong>Your Score</strong></h3>
            <div style={styles.yourScoreStyle}>
              <h1 style={styles.center}>{Math.trunc(this.state.assessmentResult.score)}%</h1>
            </div>
            Time Spent: {this.props.timeSpent.minutes} mins {this.props.timeSpent.seconds} sec
            <br />
          </div>

          <div className="col-md-4 col-sm-4 col-xs-4" >
            <h3><strong>{contentData.goodWork}</strong></h3>
            <p>You answered questions that covered these concepts correctly.</p>
            {outcomeLists.positiveList}
            <div style={{clear: 'both'}}></div>
          </div>

          <div className="col-md-4 col-sm-4 col-xs-4" >
            <h3 style={styles.improveScoreStyle}><strong>{contentData.moreToLearn}<i styleclassName="glyphicon glyphicon-warning-sign" ></i></strong></h3>
            <p>{contentData.focusStudy}</p>
            {outcomeLists.negativeList}
          </div>

        </div>)
  }

}
