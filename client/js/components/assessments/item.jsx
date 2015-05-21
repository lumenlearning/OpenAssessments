"use strict";

import React              from 'react';
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import QtiMultipleChoice  from "./qti_multiple_choice";

export default class Item extends BaseComponent{
  
  next(){
    AssessmentActions.nextQuestion();
  }

  previous(){
    AssessmentActions.previousQuestion();
  }

  render() {

    var item = "";
    var result = "";

    if(false){
      result = <div className="check_answer_result">
                <p></p>
              </div>;
    }

    switch(this.props.question.question_type){
      case 'multiple_choice_question':
        item = <QtiMultipleChoice />;
        break;
      // case 'drag_and_drop':
      //   item = this.checkEdXDragAndDrop();
      //   break;
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

    return (
      <div className="assessment_container">
        <div className="question">
          <div className="header">
            <span className="counter">{this.props.currentIndex} of {this.props.questionCount}</span>
            <p>{this.props.question.name}</p>
          </div>
          <form className="edit_item">
            <div className="full_question">
              <div className="inner_question">
                <div className="question_text">
                  Question goes here
                </div>
                {item}
              </div>
              {result}
              <div className="lower_level">
                <input className="btn btn-check-answer" type="submit" value="Check Answer" />
              </div>
            </div>
          </form>
          <div className="nav_buttons">
            <button className="btn btn-prev-item disabled" onClick={this.next}>
              <i className="glyphicon glyphicon-chevron-left"></i> <span>Previous</span>
            </button>
            <button className="btn btn-next-item" onClick={this.previous}>
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
  questionCount    : React.PropTypes.number.isRequired
};
