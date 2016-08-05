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

export default class Question extends BaseComponent{

  constructor(props, context) {
    super(props, context);
    this.state = this.getState();

    //Rebindings
    this._bind("toggleEdit", "handleDuplicate", "handleDelete", "handleHoverStates");
  }//constructor

  getState(){
    return {
      question: this.props.question || null,
      minimize: false,
      hover:{
        "copy": false,
        "edit": false,
        "delete": false
      }
    };
  }

  componentWillMount(){
  }

  componentWillReceiveProps(nProps, nState){
    let state = {};
    if(nProps.question !== this.props.question){
      state.question = nProps.question
    }
    this.setState(state);
  }

  render(){
    let question  = this.state.question;
    let outcomes  = this.props.outcomes;
    let style     = Style.styles();
    let delHover  = this.state.hover.delete;
    let copyHover = this.state.hover.copy;
    let editHover = this.state.hover.edit;
    let Content   = question.inDraft ? QuestionInterface : QuestionBlock;
    var state_text = '';
    var headerStyle = style.questionHeader;
    if(question.inDraft) {
      state_text = " (In Draft)";
      headerStyle = style.draftHeader;
    } else if(question.edited){
      state_text = " (Edited)";
      headerStyle = style.editedHeader;
    }

    return (
      <li style={style.questionItem} >
        <div className="questionHeader" style={headerStyle}>
          <div className="questionShortName" style={style.questionShortName} >
            <Tooltip message={question.outcome.longOutcome}
                     position='top-right'
              >
              Outcome: {question.outcome.shortOutcome}
              {state_text}
            </Tooltip>
          </div>
          <div className="questionToolbar" style={style.questionToolbar}>
            <Tooltip message='Duplicate Quiz' position='top-left'>
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
            <Tooltip message='Edit Quiz' position='top-left'>
            <img className='questionToolBtns'
                 style={_.merge({}, style.questionToolBtns, {backgroundColor: editHover || question.inDraft ? '#31708f' : 'transparent'})}
                 src="/assets/pencil-64-white.png"
                 onClick={this.toggleEdit}
                 onMouseOver={this.handleHoverStates}
                 onMouseLeave={this.handleHoverStates}
                 data-hovertype="edit"
                 alt="Edit"
              />
            </Tooltip>
            <Tooltip message='Delete Quiz' position='top-left'>
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
        <div className="questionContent">
          <Content question={question} outcomes={outcomes} />
        </div>
      </li>
    );
  }

  /*CUSTOM HANDLER FUNCTIONS*/
  toggleEdit(e){
    if (this.state.question.inDraft) {
      ReviewAssessmentActions.stopEditingQuestion(this.state.question);
    } else {
      ReviewAssessmentActions.startEditingQuestion(this.state.question);
    }
  }

  handleDuplicate(e){
    let question = _.clone(this.state.question, true);

    question.newId =  question.id + Math.random();

    ReviewAssessmentActions.addAssessmentQuestion(question, 'duplicate');
  }

  handleDelete(e){
    ReviewAssessmentActions.deleteAssessmentQuestion(this.state.question);
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

  /*CUSTOM FUNCTIONS*/
};
