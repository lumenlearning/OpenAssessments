"use strict";

import React from 'react';
import AssessmentActions  from "../../actions/assessment";
import Assessment         from "../../stores/assessment";

export default React.createClass({
  
  getInitialState(){
    var assessment = Assessment.current();

    if(assessment == null){
      // Trigger action to load assessment
      AssessmentActions.loadAssessment(this.props.settings);
    }

    return {
      assessment: assessment
    }

  },

  componentDidMount(){
    if(this.state.assessment){
      // Trigger action to indicate the assessment was viewed
      AssessmentActions.assessmentViewed(this.props.settings, this.state.assessment);  
    }
  },

  render(){
    return <div className="assessment">
      <div className="section_list">
        <div className="section_container">
          <div id="enable_start" className="hide">
            <div className="panel panel-primary">
              <div className="header">
                Question 1
              </div>
              <div className="enable_start">
                <button className="btn btn-info">Check Your Understanding</button>
              </div>
            </div>
          </div>
          <div className="assessment_container">
            <div className="question">
              <div className="header">
                <span className="counter">1 of 10</span>
                <p>Question 1</p>
              </div>
              <form className="edit_item">
                <div className="full_question">
                  <div className="inner_question">
                    <div className="question_text">
                      Question goes here
                    </div>
                    <div>
                      <div>
                        <div className="btn btn-block btn-question">
                          <label className="radio">
                            <input name="response" type="radio" value="4868" /> Response 1
                          </label>
                        </div>
                        <div className="btn btn-block btn-question">
                          <label className="radio">
                            <input name="response" type="radio" value="4868" /> Response 2
                          </label>
                        </div>
                        <div className="btn btn-block btn-question">
                          <label className="radio">
                            <input name="response" type="radio" value="4868" /> Response 3
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="check_answer_result">
                    <p></p>
                  </div>
                  <div className="lower_level">
                    <input className="btn btn-check-answer" type="submit" value="Check Answer" />
                  </div>
                </div>
              </form>
              <div className="nav_buttons">
                <button className="btn btn-prev-item disabled"><i className="glyphicon glyphicon-chevron-left"></i> <span>Previous</span></button>
                <button className="btn btn-next-item"><span>Next</span> <i className="glyphicon glyphicon-chevron-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
});
