"use strict";

import React                          from 'react';
import BaseComponent                  from '../base_component.jsx';
import Style                          from './css/style';
import {Accordion, AccordionSection}  from './accordion/accordion.js';
import ReviewAssessmentActions        from "../../actions/review_assessment";
import ReviewAssessmentStore          from "../../stores/review_assessment";
import SettingsStore                  from '../../stores/settings.js';

import Question                       from './question/question.jsx';
import OutcomeSection                 from './outcome_section/outcome_section.jsx';
import QuestionBlock                  from './question_block/question_block.jsx';
import QuestionInterface              from './question_interface/question_interface.jsx';

export default class Edit extends BaseComponent{

  constructor(props, context) {
    super(props, context);
    this.stores = [ReviewAssessmentStore];
    this._bind("handleAddQuestion", "handleSaveAssessment");

    if(!ReviewAssessmentStore.isLoaded() && !ReviewAssessmentStore.isLoading()){
      ReviewAssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, this.props.params["assessmentId"], true);
    }

    this.state = this.getState();
  }

  getState(){
    let assessment = ReviewAssessmentStore.current();
    if(assessment && !assessment.assessmentId){
      assessment.assessmentId = this.props.params["assessmentId"];
    }
    return {
      questions        : ReviewAssessmentStore.allQuestions(),
      outcomes         : ReviewAssessmentStore.outcomes(),
      settings         : SettingsStore.current(),
      assessment       : ReviewAssessmentStore.current(),
      newQuestion      : false,
    }
  }

  componentWillMount(){
    //when component will mount, grab data from the editQuiz store
  }

  render(){
    let style = Style.styles();

    let title = typeof this.state.assessment == 'undefined' || this.state.assessment == null ? '' : this.state.assessment.title;

    return (
      <div className="editQuizWrapper" style={style.editQuizWrapper}>
        <div className="eqHeader" style={style.eqHeader} >
          <div className="eqTitle" style={style.eqTitle} >
            <h2 style={style.eqH2Title} >{title}</h2>
          </div>
          <div className="eqNewQuestion" style={style.eqNewQuestion} >
            <button className='btn btn-sm' onClick={this.handleAddQuestion} style={style.addQuestionBtn} >Add Question</button>
            <button className='btn btn-sm' onClick={this.handleSaveAssessment} style={style.saveAssessmentBtn} >Save Quiz</button>
          </div>
        </div>
        <ul className="eqContent" style={{listStyleType: 'none', padding:'40px'}}>
          {this.state.questions.map((question, index)=>{

            return (
              <Question question={question} />
            )
          })
          }
        </ul>
      </div>
    );
  }

  /*CUSTOM HANDLER FUNCTIONS*/
  handleAddQuestion(e){
    this.setState({
      newQuestion: true
    });
  }

  handleSaveAssessment(e){
    ReviewAssessmentActions.saveAssessment(this.state.assessment);
  }

  /*CUSTOM FUNCTIONS*/
};

module.export = Edit;
