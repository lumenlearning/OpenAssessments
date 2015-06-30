"use strict";

import React              from 'react';
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import UniversalInput     from "./universal_input";


export default class Item extends BaseComponent{
  constructor(){
    super();
    this._bind("getConfidenceLevels", "confidenceLevelClicked", "getPreviousButton", "getNextButton");
  }

  nextButtonClicked(){
    AssessmentActions.nextQuestion();
  }

  previousButtonClicked(){
    AssessmentActions.previousQuestion();
  }

  confidenceLevelClicked(e){
    e.preventDefault()
    AssessmentActions.selectConfidenceLevel(e.target.value);
    AssessmentActions.nextQuestion(); 
  }

  getStyles(theme){
    return {
      assessmentContainer:{
        boxShadow: theme.assessmentContainerBoxShadow
      },
      header: {
        backgroundColor: theme.headerBackgroundColor
      },
      fullQuestion:{
        backgroundColor: theme.fullQuestionBackgroundColor
      },
      questionText: {
        fontSize: theme.questionTextFontSize,
        fontWeight: theme.questionTextFontWeight,
        padding: theme.questionTextPadding,
      },
      nextButton: {
        backgroundColor: theme.nextButtonBackgroundColor
      },
      previousButton: {
        backgroundColor: theme.previousButtonBackgroundColor
      },
      maybeButton: {
        width: theme.maybeWidth,
        backgroundColor: theme.maybeBackgroundColor,
        color: theme.maybeColor,
      },
      probablyButton: {
        width: theme.probablyWidth,
        backgroundColor: theme.probablyBackgroundColor,
        color: theme.probablyColor,
      },
      definitelyButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor,
        color: theme.definitelyColor,
      },
      confidenceWrapper: {
        border: theme.confidenceWrapperBorder,
        borderRadius: theme.confidenceWrapperBorderRadius,
        width: theme.confidenceWrapperWidth,
        height: theme.confidenceWrapperHeight,
        padding: theme.confidenceWrapperPadding,
        margin: theme.confidenceWrapperMargin,
        backgroundColor: theme.confidenceWrapperBackgroundColor,
      },
      margin: {
       marginLeft: "5px"
      },
      navButtons: {
        position: "relative",
        float: "right"
      }
    }
  }

  getConfidenceLevels(level, styles){
    if(level){
      var levelMessage = <div style={{marginBottom: "10px"}}><b>Choose your confidence level to go to the next question.</b></div>;
      return    (<div className="confidence_wrapper" style={styles.confidenceWrapper}>
                  {levelMessage}
                  <input type="button" style={styles.maybeButton}className="btn btn-check-answer" value="Just A Guess" onClick={(e) => { this.confidenceLevelClicked(e) }}/>
                  <input type="button" style={{...styles.margin, ...styles.probablyButton}} className="btn btn-check-answer" value="Pretty Sure" onClick={(e) => { this.confidenceLevelClicked(e) }}/>
                  <input type="button" style={{...styles.margin, ...styles.definitelyButton}} className="btn btn-check-answer" value="Very Sure" onClick={(e) => { this.confidenceLevelClicked(e) }}/>
                </div>
                );
    } else {
      return <div className="lower_level"><input type="button" className="btn btn-check-answer" value="Check Answer" onClick={() => { AssessmentActions.checkAnswer()}}/></div>
    }
  }

  getNextButton(styles){
    var nextButton = "";
    var nextButtonClassName = "btn btn-next-item " + ((this.props.currentIndex < this.props.questionCount - 1) ? "" : "disabled");
    if(!this.context.theme.shouldShowNextPrevious){
      return nextButton;
    }
    nextButton =(<button className={nextButtonClassName} style={styles.nextButton} onClick={() => { this.nextButtonClicked() }}>
                    <span>Next</span> <i className="glyphicon glyphicon-chevron-right"></i>
                  </button>);
    return nextButton;
  }

  getPreviousButton(styles){
    var previousButton = "";
    var prevButtonClassName = "btn btn-prev-item " + ((this.props.currentIndex > 0) ? "" : "disabled");
    if(!this.context.theme.shouldShowNextPrevious){
      return previousButton;
    }
    previousButton =(<button className={prevButtonClassName} style={styles.previousButton} onClick={() => { this.previousButtonClicked() }}>
                    <i className="glyphicon glyphicon-chevron-left"></i><span>Previous</span> 
                  </button>);
    return previousButton;
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
    var styles = this.getStyles(this.context.theme);
    var result = this.getResult(this.props.messageIndex);
    var buttons = this.getConfidenceLevels(this.props.confidenceLevels, styles);
    
    
    
    // Get the confidence Level
    
    var nextButton = this.getNextButton(styles);
    var previousButton = this.getPreviousButton(styles);

    //Check if we need to display the counter in the top right
    var counter = "";

    if(this.context.theme.shouldShowCounter){
      counter = <span className="counter">{this.props.currentIndex + 1} of {this.props.questionCount}</span>
    }

    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        <div className="question">
          <div className="header" style={styles.header}>
            {counter}
            <p>{this.props.question.title}</p>
          </div>
          <form className="edit_item">
            <div className="full_question" style={styles.fullQuestion}>
              <div className="inner_question">
                <div className="question_text" style={styles.questionText}>
                  <div
                    dangerouslySetInnerHTML={{
                  __html: this.props.question.material
                  }}>
                  </div>
                </div>
                <UniversalInput item={this.props.question} />
              </div>
              {result}
              {buttons}
            </div>
          </form>
          <div className="nav_buttons">
            {previousButton}
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

Item.contextTypes = {
  theme: React.PropTypes.object
}
