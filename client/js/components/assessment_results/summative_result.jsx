"use strict";

import React            from 'react';
import AssessmentActions    from "../../actions/assessment";
import AssessmentStore      from "../../stores/assessment";
import ReviewAssessmentStore from "../../stores/review_assessment";
import SettingsStore        from "../../stores/settings";
import ItemResult           from "./item_result";
import ResultSummary        from "./result_summary.jsx";
import StudyPlanButton      from "../post_nav/study_plan_button.jsx";

export default class SummativeResult extends React.Component{

  constructor(props, context){
    super(props, context);
    this.stores = [AssessmentStore, SettingsStore];
    this.state = this.getState();
  }

  getState(props, context){
    return {
      assessmentResult : this.props.assessmentResult || AssessmentStore.assessmentResult(),
      questions        : this.props.questions || AssessmentStore.allQuestions(),
      settings         : SettingsStore.current(),
      assessment       : this.props.assessment || AssessmentStore.current()
    }
  }

  getItemResults(){
    if(this.props.questionResponses){
      return this.props.questionResponses.map((qr, index)=>{
        let question = ReviewAssessmentStore.itemByIdent(qr.ident);
        if(question === undefined){
          return <p>Question was removed.</p>
        } else {
          return <ItemResult key={index}
                             question={question}
                             isCorrect={qr.correct}
                             index={index}
                             confidence={qr.confidence_level}
                             chosen={qr.responses_chosen}
                             correctAnswers={question.correct}/>;
        }
      });

    } else {
      return this.state.questions.map((question, index)=>{
        return <ItemResult key={index} question={question} isCorrect={this.state.assessmentResult.correct_list[index]} index={index} confidence={this.state.assessmentResult.confidence_level_list[index]}/>;
      })

    }
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

        <ResultSummary
            styles={styles}
            timeSpent={this.props.timeSpent}
            assessmentResult={this.state.assessmentResult}
            assessment={this.state.assessment}
            outcomes={this.props.outcomes}
            user={this.props.user}
            questionResponses={this.props.questionResponses}/>

        <StudyPlanButton/>

        <hr />

        <div id="questionsStart" style={styles.resultsStyle}>
          {itemResults}
        </div>

      </div>
    </div>)
  }

}
