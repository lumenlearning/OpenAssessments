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
import EditButtons                    from "./edit_buttons.jsx"
import Instructions                   from "./instructions/instructions.jsx";

export default class Edit extends BaseComponent{

  constructor(props, context) {
    super(props, context);
    this.stores = [ReviewAssessmentStore];
    this._bind("handleSaveAssessment", 'handleResize');

    if(!ReviewAssessmentStore.isLoaded() && !ReviewAssessmentStore.isLoading()){
      ReviewAssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, this.props.params["assessmentId"], true);
    }

    this.state = this.getState();
    CommunicationHandler.init();
  }

  getState(){
    let assessment = ReviewAssessmentStore.current();
    if(assessment && !assessment.assessmentId){
      assessment.assessmentId = this.props.params["assessmentId"];
    }
    return {
      questions        : ReviewAssessmentStore.allQuestions(),
      outcomes         : ReviewAssessmentStore.outcomes(),
      skills           : ReviewAssessmentStore.skills(),
      settings         : SettingsStore.current(),
      assessment       : ReviewAssessmentStore.current(),
      needsSaving      : ReviewAssessmentStore.isDirty(),
      errorMessages    : ReviewAssessmentStore.errorMessages(),
      warningMessages  : ReviewAssessmentStore.warningMessages(),
      loaded           : ReviewAssessmentStore.isLoaded(),
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
    CommunicationHandler.sendSizeThrottled();
  }

  render(){
    let style = Style.styles();
    let bottomButtons = this.state.questions.length > 0 ? <EditButtons newQuestionLocation="bottom" handleSaveAssessment={this.handleSaveAssessment} windowWidth={this.state.windowWidth} /> : '';

    return (
      <div className="editQuizWrapper" style={style.editQuizWrapper}>
        <ValidationMessages errorMessages={this.state.errorMessages} warningMessages={this.state.warningMessages} needsSaving={this.state.needsSaving} />
        <EditButtons newQuestionLocation="top" handleSaveAssessment={this.handleSaveAssessment} windowWidth={this.state.windowWidth} />
        <div style={{paddingLeft: '40px', paddingRight: '40px'}}>
        <Instructions settings={this.state.settings}/>
        </div>
        <ul className="eqContent" style={{listStyleType: 'none', paddingTop: '5px', paddingRight:'40px', paddingBottom:'40px', paddingLeft: '40px'}}>
          {this.displayQuestions()}
        </ul>
        {bottomButtons}
      </div>
    );
  }

  /*CUSTOM HANDLER FUNCTIONS*/
  handleSaveAssessment(e) {
    if (ReviewAssessmentStore.inDraft()){
      alert('You have questions in draft mode; press "Done Editing" to finish editing or cancel changes.');
    } else if (this.state.errorMessages.length > 0) {
      alert("You must resolve the errors before saving.");
    } else if (this.state.warningMessages.length > 0) {
      var message = "Are you sure? ";
      this.state.warningMessages.forEach((m)=> { message = message + "\n" + m });

      var r = confirm(message);
      if (r == true) {
        ReviewAssessmentActions.saveAssessment(this.state.assessment);
      }
    } else if(this.state.needsSaving) {
      ReviewAssessmentActions.saveAssessment(this.state.assessment);
    }
  }

  /*CUSTOM FUNCTIONS*/
  displayQuestions(){

    if(this.state.questions.length !== 0){
      return this.state.questions.map((question, index)=>{
        return (
          <Question key={question.id + index} question={question} outcomes={this.state.outcomes}/>
        )
      });
    }
    else if(this.state.loaded){
      let noteStyle = {
        fontSize: '24px',
        border: '1px solid',
        padding: '15px'
      };
      let btnStyle = _.merge({}, Style.styles().addQuestionBtn, {borderRadius: '0', fontSize: '24px', padding: '0px 15px', margin:'0px', width: 'inherit'});
      return (<li style={noteStyle}>Please click <button style={btnStyle} className='btn btn-sm' onClick={()=>this.handleAddQuestion("top")} >Here</button> to create a quiz question. :)</li>)
    }
  }

  handleAddQuestion(placement) {
    ReviewAssessmentActions.addNewAssessmentQuestion(placement);
  }

};

module.export = Edit;
