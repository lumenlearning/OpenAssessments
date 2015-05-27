"use strict";

import React              from 'react';
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import QtiMultipleChoice  from "./qti_multiple_choice";
import QtiTrueFalse       from "./qti_true_false";
import QtiTextOnly       from "./qti_text_only.jsx";

export default class Item extends BaseComponent{
  nextButtonClicked(){
    AssessmentActions.nextQuestion();
  }

  previousButtonClicked(){
    AssessmentActions.previousQuestion();
  }

  render() {
    var item = "";
    var result = "";


    if(this.props.messageIndex == -1){
      result =  <div className="check_answer_result">
                  <p></p>
                </div>;
    }
    else if(this.props.messageIndex == 0){
      result =  <div className="check_answer_result">
                  <p>Incorrect</p>
                </div>;
    }
    else {
      result =  <div className="check_answer_result">
                  <p>Correct</p>
                </div>;
    }

    switch(this.props.question.question_type){
      case 'multiple_choice_question':
        item = <QtiMultipleChoice items={this.props.question.answers} />;
        break;
      case 'true_false_question':
        item = <QtiTrueFalse items={this.props.question.answers} />;
        break;
      case 'text_only_question':
        item = <QtiTextOnly items={this.props.question} />;
        break;
      // case 'edx_drag_and_drop':
      //   item = this.checkEdXDragAndDrop();
      //   break;
      // case 'edx_numerical_input':
      //   item = this.checkEdXNumeric();
      //   break;
      // case 'edx_text_input':
      //   item = this.checkEdXMultipleChoice();
      //   break;
      // case 'edx_dropdown':
      //   item = this.checkEdXMultipleChoice();
      //   break;
      // case 'edx_multiple_choice':
      //   item = this.checkEdXMultipleChoice();
      //   break;
    }

    var prevButtonClassName = "btn btn-prev-item " + ((this.props.currentIndex > 0) ? "" : "disabled");
    var nextButtonClassName = "btn btn-next-item " + ((this.props.currentIndex < this.props.questionCount - 1) ? "" : "disabled");
    var currentIndex = this.props.currentIndex + 1;

    var material = (
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.question.material
            }}></div>
          );

    return (
      <div className="assessment_container">
        <div className="question">
          <div className="header">
            <span className="counter">{currentIndex} of {this.props.questionCount}</span>
            <p>{this.props.question.title}</p>
          </div>
          <form className="edit_item">
            <div className="full_question">
              <div className="inner_question">
                <div className="question_text">
                  {material}
                </div>
                {item}
              </div>
              {result}
              <div className="lower_level">
                <input type="button" className="btn btn-check-answer" value="Check Answer" onClick={() => { AssessmentActions.checkAnswer(); }}/>
              </div>
            </div>
          </form>
          <div className="nav_buttons">
            <button className={prevButtonClassName} onClick={() => { this.previousButtonClicked() }}>
              <i className="glyphicon glyphicon-chevron-left"></i> <span>Previous</span>
            </button>
            <button className={nextButtonClassName} onClick={() => { this.nextButtonClicked() }}>
              <span>Next</span> <i className="glyphicon glyphicon-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

}

Item.propTypes = { 
  question         : React.PropTypes.object.isRequired,
  currentIndex     : React.PropTypes.number.isRequired,
  settings         : React.PropTypes.object.isRequired,
  questionCount    : React.PropTypes.number.isRequired,
  messageIndex     : React.PropTypes.number.isRequired
};
