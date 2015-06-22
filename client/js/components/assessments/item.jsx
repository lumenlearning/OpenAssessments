"use strict";

import React              from 'react';
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import UniversalInput     from "./universal_input";


export default class Item extends BaseComponent{
  constructor(){
    super();
    this._bind("getButtons", "confidenceLevelClicked");
  }

  nextButtonClicked(){
    AssessmentActions.nextQuestion();
  }

  previousButtonClicked(){
    AssessmentActions.previousQuestion();
  }

  confidenceLevelClicked(e){
    e.preventDefault()
    console.log(e.target.value)
    AssessmentActions.selectConfidenceLevel(e.target.value);
  }

  getStyles(){
    return { 
      margin: {
       marginLeft: "5px"
      }
    }
  }

  getButtons(level, styles, confidence){
    if(level){
      return    (<div className="lower_level"><input type="button" className="btn btn-check-answer" value="Maybe?" onClick={(e) => { this.confidenceLevelClicked(e) }}/>
                <input type="button" style={styles.margin} className="btn btn-check-answer" value="Probably." onClick={(e) => { this.confidenceLevelClicked(e) }}/>
                <input type="button" style={styles.margin} className="btn btn-check-answer" value="Definitely!" onClick={(e) => { this.confidenceLevelClicked(e) }}/>
                </div>
                );
    } else {
      return <div className="lower_level"><input type="button" className="btn btn-check-answer" value="Check Answer" onClick={() => { AssessmentActions.checkAnswer()}}/></div>
    }
  }

  getResult(index){
    var result;

    if(index == -1){
      result =  <div className="check_answer_result">
                  <p></p>
                </div>;
    }
    else if(index == 0){
      result =  <div className="check_answer_result">
                  <p>Incorrect</p>
                </div>;
    }
    else {
      result =  <div className="check_answer_result">
                  <p>Correct</p>
                </div>;
    }

    return result;
  }

  render() {
    console.log(this.props.question.confidenceLevel)
    var styles = this.getStyles()
    var result = this.getResult(this.props.messageIndex);
    var buttons = this.getButtons(this.props.confidenceLevels, styles);
    var prevButtonClassName = "btn btn-prev-item " + ((this.props.currentIndex > 0) ? "" : "disabled");
    var nextButtonClassName = "btn btn-next-item " + ((this.props.currentIndex < this.props.questionCount - 1) ? "" : "disabled");
    
    // Get the confidence Level
    var level = <div className="check_answer_result"><p>{"Select a confidence level to continue."}</p></div>;
    var nextButton = "";
    
    if (this.props.confidenceLevels && this.props.question.confidenceLevel){
      level = <div className="check_answer_result"><p>{'You chose "' + this.props.question.confidenceLevel + '" as your confidence level'}</p></div>;
      nextButton =(<button className={nextButtonClassName} onClick={() => { this.nextButtonClicked() }}>
                    <span>Next</span> <i className="glyphicon glyphicon-chevron-right"></i>
                  </button>)
    } else if(!this.props.confidenceLevels){
      nextButton =(<button className={nextButtonClassName} onClick={() => { this.nextButtonClicked() }}>
                    <span>Next</span> <i className="glyphicon glyphicon-chevron-right"></i>
                  </button>)
      console.log(!this.props.confidencelevels)
      level = "";
    }
    return (
      <div className="assessment_container">
        <div className="question">
          <div className="header">
            <span className="counter">{this.props.currentIndex + 1} of {this.props.questionCount}</span>
            <p>{this.props.question.title}</p>
          </div>
          <form className="edit_item">
            <div className="full_question">
              <div className="inner_question">
                <div className="question_text">
                  <div
                    dangerouslySetInnerHTML={{
                  __html: this.props.question.material
                  }}>
                  </div>
                </div>
                <UniversalInput item={this.props.question} />
              </div>
              {result}
              {level}
              {buttons}
            </div>
          </form>
          <div className="nav_buttons">
            <button className={prevButtonClassName} onClick={() => { this.previousButtonClicked() }}>
              <i className="glyphicon glyphicon-chevron-left"></i> <span>Previous</span>
            </button>
            {nextButton}
          </div>
        </div>
      </div>
    );
  }

}

Item.propTypes = { 
  question         : React.PropTypes.object.isRequired,
  currentIndex     : React.PropTypes.number.isRequired,
  questionCount    : React.PropTypes.number.isRequired,
  messageIndex     : React.PropTypes.number.isRequired,
  confidenceLevels : React.PropTypes.bool.isRequired
};
