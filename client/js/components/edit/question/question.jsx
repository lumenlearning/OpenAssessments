"use strict";

import React                          from 'react';
import _                              from 'lodash';
import BaseComponent                  from '../../base_component.jsx';
import Style                          from './css/style';
import {Accordion, AccordionSection}  from '../accordion/accordion.js';
import ReviewAssessmentActions        from "../../../actions/review_assessment";
import ReviewAssessmentStore          from "../../../stores/review_assessment";
import SettingsStore                  from '../../../stores/settings.js';
import Tooltip                        from '../../common/tooltip/tooltip.jsx';

import OutcomeSection                 from '../outcome_section/outcome_section.jsx';
import QuestionBlock                  from '../question_block/question_block.jsx';
import QuestionInterface              from '../question_interface/question_interface.jsx';
import ValidationMessages             from './../validation_messages.jsx';

export default class Question extends BaseComponent{

  constructor(props, context) {
    super(props, context);
    this.state = this.getState();

    //Rebindings
    this._bind("toggleEdit", "handleDuplicate", "handleDelete", "handleHoverStates");
     this._bind( "handleDoneEditing",
                "handleCorrectChange",
                "handleMaterialChange",
                "handleAnswerChange",
                "handleFeedbackChange",
                "handleAddOption",
                "handleOutcomeChange",
                'handleAnswerRemoval');
  }//constructor

  getState(){
    return {
      question: this.props.question || {},
      minimize: false,
      dirty: this.props.question.material == "", // mark new questions as dirty
      hover:{
        "copy": false,
        "edit": false,
        "delete": false
      }
    };
  }

  render(){
    let question  = this.props.question;
    let outcomes  = this.props.outcomes;
    let style     = Style.styles();
    let delHover  = this.state.hover.delete;
    let copyHover = this.state.hover.copy;
    let Content   = question.inDraft ? QuestionInterface : QuestionBlock;
    var state_text = '';
    var headerStyle = style.questionHeader;

    if(question.inDraft) {
      state_text = question.isNew ? "(New)" : "(In Draft)";
      headerStyle = style.draftHeader;
    } else if(question.edited){
      state_text = "(Edited)";
      headerStyle = style.editedHeader;
    }

    console.log("QUESTION:", question);
    return (
      <li style={style.questionItem} >
        <div className="questionHeader" style={headerStyle}>
          <div className="questionShortName" style={style.questionShortName} >
            <Tooltip message={`${question.outcome.longOutcome ? question.outcome.longOutcome : "Please Select an Outcome"}`}
                     position='top-right'
              >
              {`${question.outcome.shortOutcome ? `Outcome: ${question.outcome.shortOutcome}` : ""} ${state_text}`}
            </Tooltip>
          </div>
          <div className="questionToolbar" style={style.questionToolbar}>
            <Tooltip message='Duplicate Question' position='top-left'>
            <img className='questionToolBtns'
                 style={_.merge({}, style.questionToolBtns, {backgroundColor: copyHover ? '#31708f' : 'transparent'})}
                 src="/assets/copy-64-white.png"
                 onClick={this.handleDuplicate}
                 onMouseOver={this.handleHoverStates}
                 onMouseLeave={this.handleHoverStates}
                 data-hovertype="copy"
                 alt="Duplicate"
              />
            </Tooltip>
            {this.editQuestionButton(question, style)}
            <Tooltip message='Delete Question' position='top-left'>
            <img className='questionToolBtns'
                 style={_.merge({}, style.questionToolBtns, {backgroundColor: delHover ? '#bb5432' : 'transparent'})}
                 src="/assets/trash-64-white.png"
                 onClick={this.handleDelete}
                 onMouseOver={this.handleHoverStates}
                 onMouseLeave={this.handleHoverStates}
                 data-hovertype='delete'
                 alt="Delete"
              />
            </Tooltip>
          </div>
        </div>
        <ValidationMessages errorMessages={question.errorMessages} />
        <div className="questionContent">
          <Content
              question={question}
              outcomes={outcomes}
              handleAnswerChange={this.handleAnswerChange}
              handleFeedbackChange={this.handleFeedbackChange}
              handleCorrectChange={this.handleCorrectChange}
              handleAddOption={this.handleAddOption}
              handleAnswerRemoval={this.handleAnswerRemoval}
              handleMaterialChange={this.handleMaterialChange}
              handleOutcomeChange={this.handleOutcomeChange}
              handleDoneEditing={this.handleDoneEditing}
              handleQuestionTypeChange={this.handleQuestionTypeChange}
          />
        </div>
      </li>
    );
  }

  editQuestionButton(question, style) {
      let editHover = this.state.hover.edit;
    if (ReviewAssessmentStore.editableQuestionType(question.question_type)) {

      return <Tooltip message={question.inDraft ? 'Cancel Editing' : 'Edit Question'} position='top-left'>
        <img className='questionToolBtns'
             style={_.merge({}, style.questionToolBtns, {backgroundColor: editHover || question.inDraft ? '#31708f' : 'transparent'})}
             src={`/assets/${question.inDraft ? 'close' : 'pencil-64-white'}.png`}
             onClick={this.toggleEdit}
             onMouseOver={this.handleHoverStates}
             onMouseLeave={this.handleHoverStates}
             data-hovertype="edit"
             alt="Edit"
        />
      </Tooltip>
    } else {
      return <Tooltip message="This question type isn't currently editable." position='top-left'>
        <img className='questionToolBtns'
             style={_.merge({}, style.questionToolBtns, {cursor: "help", border: "none", borderRadius: ""})}
             src={`/assets/warning-32-yellow.png`}
             data-hovertype="edit"
             alt="Editing not enabled for this question type."
        />
      </Tooltip>
    }
  }

  /*CUSTOM HANDLER FUNCTIONS*/
  toggleEdit(e){
    if (this.props.question.inDraft) {
      if(this.props.question.isNew){
        ReviewAssessmentActions.deleteAssessmentQuestion(this.props.question);
      } else {
        ReviewAssessmentActions.cancelEditingQuestion(this.props.question);
      }
    } else {
      ReviewAssessmentActions.startEditingQuestion(this.props.question);
    }
  }

  handleDuplicate(e){
    let question = _.clone(this.props.question, true);

    question.newId =  question.id + Math.random();

    ReviewAssessmentActions.addAssessmentQuestion(question, 'duplicate');
  }

  handleDelete(e){
    let confirmDelete = confirm("Are you sure you want to delete this question?");
    if (confirmDelete) {
      ReviewAssessmentActions.deleteAssessmentQuestion(this.props.question);
    }
  }

  handleHoverStates(e){
    let hoverState = this.state.hover;
    let eventType = e.type;
    let hoverType = e.target.dataset.hovertype;
    let hoverStatus;

    switch(eventType){
      case 'mouseover':
        hoverStatus = true;
      break;

      case 'mouseleave':
        hoverStatus = false;
      break;
    }

    hoverState[hoverType] = hoverStatus;

    this.setState({
      hover: hoverState
    });
  }

  /*CUSTOM EVENT HANDLERS*/
  handleOutcomeChange(newOutcome) {
    let question = _.clone(this.props.question, true);
    question.outcome = newOutcome;

    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }

  handleMaterialChange(e) {
    let question = _.clone(this.props.question, true);
    question.material = e.target.getContent();

    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }

  handleAnswerChange(e, index) {
    let question = _.clone(this.props.question, true);
    let answer = question.answers[index];
    answer.material = e.target.getContent();

    //do regex to get all the shortcodes for the dropdowns here?


    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }

  handleAnswerRemoval(index){
    let question = _.clone(this.props.question, true);
    question.answers.splice(index, 1);

    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }

  handleFeedbackChange(e, index) { //TODO: this method will need to change to accomodate different question types.
    let question = _.clone(this.props.question, true);
    let answer = question.answers[index];
    answer.feedback = e.target.getContent();

    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }

  handleCorrectChange(index, isCorrect) { //TODO: this method will need to change to accomodate different question types.
    let question = _.clone(this.props.question, true);
    let answer = question.answers[index];
    answer.isCorrect = isCorrect;
    question.question_type = 'multiple_choice_question';

    let correctCount = _.sum(question.answers, function(a) { return a.isCorrect ? 1 : 0; });
    if(correctCount > 1){
      question.question_type = 'multiple_answers_question';
    }

    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }

  handleQuestionTypeChange(e) {
    let question = _.clone(this.props.question, true);
    let question_type = e.target.value;

    question.question_type = question_type;

    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }//handleQuestionTypeChange

  handleAddOption(e, options) {
    let question = _.clone(this.props.question, true);

    switch (question.question_type) {

      case 'multiple_choice_question':
      case 'multiple_answers_question':
        let answerObj = ReviewAssessmentStore.blankNewAnswer();
        question.answers.push(answerObj);
      break;
      case 'multiple_dropdowns_question':
        let newDropdownOption = ReviewAssessmentStore.blankNewDropdown();
        question.dropdowns[options.dropdownId].push(newDropdownOption);
      break;
    }


    ReviewAssessmentActions.updateAssessmentQuestion(question, false);
  }

  handleDoneEditing(e){
    // if () {
    //
    // }

    ReviewAssessmentActions.updateAssessmentQuestion(this.props.question);
  }
};
