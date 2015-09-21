"use strict";

import React            from 'react';
import AssessmentActions    from "../../actions/assessment";
import AssessmentStore      from "../../stores/assessment";
import SettingsStore        from "../../stores/settings";
import ItemResult           from "./item_result";
import ResultSummary        from "./result_summary.jsx";

export default class SummativeResult extends React.Component{

  constructor(props, context){
    super(props, context);
    this.stores = [AssessmentStore, SettingsStore];
    this.state = this.getState();
  }

  getState(props, context){
    return {
      assessmentResult : AssessmentStore.assessmentResult(),
      questions        : AssessmentStore.allQuestions(),
      settings         : SettingsStore.current(),
      assessment       : AssessmentStore.current()
    }
  }

  getItemResults(){
    return this.state.questions.map((question, index)=>{
      return <ItemResult question={question} isCorrect={this.state.assessmentResult.correct_list[index]} index={index} confidence={this.state.assessmentResult.confidence_level_list[index]}/>;
    })
  }

  render() {

    var errors = "";
    var styles = this.props.styles;
    var itemResults = this.getItemResults();

    if(this.state.assessmentResult.errors && this.state.assessmentResult.errors.length > 0){
      errors =  <div className="row">
                  <div className="col-md-12">
                    <div style={styles.warningStyle}>
                      This quiz was not setup correctly. Contact your instructor.
                    </div>
                  </div>
                </div>
    }

    var quizType = this.props.isSummative ? "Quiz" : "Show What You Know";

    return (<div style={styles.assessment}>
      <div style={styles.assessmentContainer}>
        <div style={styles.titleBar}>{quizType}: {this.state.assessment ? this.state.assessment.title : ""}</div>
        {errors}

        <ResultSummary styles={styles} timeSpent={this.props.timeSpent}/>

        <hr />

        <div id="questionsStart" style={styles.resultsStyle}>
          {itemResults}
        </div>

      </div>
    </div>)
  }

}
