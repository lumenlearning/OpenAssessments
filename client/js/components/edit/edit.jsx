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
import ValidationMessages             from './validation_messages.jsx';
import CommunicationHandler           from "../../utils/communication_handler";

export default class Edit extends BaseComponent{

  constructor(props, context) {
    super(props, context);
    this.stores = [ReviewAssessmentStore];
    this._bind("handleAddQuestion", "handleSaveAssessment", 'handleResize');

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
      needsSaving      : ReviewAssessmentStore.isDirty(),
      errorMessages    : ReviewAssessmentStore.errorMessages(),
      warningMessages  : ReviewAssessmentStore.warningMessages(),
      windowWidth      : window.innerWidth
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(e) {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  componentDidMount(){
    window.addEventListener('resize', this.handleResize);
    super.componentDidMount();
    CommunicationHandler.sendSize();
  }

  render(){
    let style = Style.styles();
    let windowWidth = this.state.windowWidth;
    let title = typeof this.state.assessment == 'undefined' || this.state.assessment == null ? '' : this.state.assessment.title;

    return (
      <div className="editQuizWrapper" style={style.editQuizWrapper}>
        <div className="eqHeader" style={style.eqHeader} >
          <div className="eqTitle" style={style.eqTitle} >
            <h2 style={style.eqH2Title} >{title}</h2>
          </div>
        </div>
        <ValidationMessages errorMessages={this.state.errorMessages} warningMessages={this.state.warningMessages} />
        <div className="eqNewQuestion" style={_.merge({}, style.eqNewQuestion, {flexDirection: windowWidth <= 1000 ? "column" : 'row'})} >
          <label for="save_quiz" style={style.addQuestionLbl}>
            <button name='save_quiz' className='btn btn-sm' onMouseDown={this.toggleButtonStyle} onMouseUp={this.toggleButtonStyle} onClick={this.handleSaveAssessment} style={style.addQuestionBtn}>
              <img style={style.addQuestionImg} src="/assets/upload.png" alt="Save Assessment"/>
            </button>
            Save Assessment
          </label>
          <label for="add_question" style={style.addQuestionLbl}>
            <button name='add_question' className='btn btn-sm' onMouseDown={this.toggleButtonStyle} onMouseUp={this.toggleButtonStyle} onClick={this.handleAddQuestion} style={style.addQuestionBtn} >
              <img style={style.addQuestionImg} src="/assets/plus-52.png" alt="Add Question"/>
            </button>
            Add Question
          </label>
          <label for="studyplan" style={style.addQuestionLbl}>
            {windowWidth > 1000 ? 'Study Plan' : ''}
            <button name='studyplan' className='btn btn-sm' onMouseDown={this.toggleButtonStyle} onMouseUp={this.toggleButtonStyle} onClick={()=>{CommunicationHandler.navigateHome()}} style={style.addQuestionBtn} >
              <img style={_.merge({}, style.addQuestionImg, {width:'32px', height:'32px'})} src="/assets/return.png" alt="Study Plan"/>
            </button>
            {windowWidth < 1000 ? 'Study Plan' : ''}

          </label>
        </div>
        <ul className="eqContent" style={{listStyleType: 'none', padding:'40px'}}>
          {this.displayQuestions()}
        </ul>
      </div>
    );
  }

  /*CUSTOM HANDLER FUNCTIONS*/
  handleAddQuestion(e){
    let question = {
      id: `newQuestion-${((Math.random() * 100) * (Math.random()*100))}`, //specifies new and has random num.
      title: 'New Question',
      edited: true,
      inDraft: true,
      isValid: false,
      question_type: 'multiple_choice_question',
      material: '',
      answers: [ReviewAssessmentStore.blankNewQuestion(), ReviewAssessmentStore.blankNewQuestion(), ReviewAssessmentStore.blankNewQuestion()],
      errorMessages: [],
      outcome: this.state.outcomes[0]
    };

    ReviewAssessmentActions.addAssessmentQuestion(question, 'top');

  }

  toggleButtonStyle(e){

  }

 handleSaveAssessment(e) {
   // todo validations
   // no inDraft questions, check if enough questions per outcome, etc.
   ReviewAssessmentActions.saveAssessment(this.state.assessment);
 }

  /*CUSTOM FUNCTIONS*/
  displayQuestions(){

    if(this.state.questions.length !== 0){
      return this.state.questions.map((question, index)=>{
        return (
          <Question key={index} question={question} outcomes={this.state.outcomes}/>
        )
      });
    }
    else if(!this.state.newQuestion){
      let noteStyle = {
        fontSize: '24px',
        color: '#CF0000',
        border: '1px solid #CF0000',
        padding: '15px'
      };
      let btnStyle = _.merge({}, Style.styles().addQuestionBtn, {borderRadius: '0', fontSize: '24px', padding: '0px 15px', margin:'0px', width: 'inherit'});
      return (<li style={noteStyle}> You currently don't have any quiz questions. Please click <button style={btnStyle} className='btn btn-sm' onClick={this.handleAddQuestion} >Here</button> to create one :)</li>)
    }
  }
};

module.export = Edit;
