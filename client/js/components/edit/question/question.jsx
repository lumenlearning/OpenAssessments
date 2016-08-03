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
      editMode: false,
      minimize: false,
      hover:{
        "copy": false,
        "edit": false,
        "delete": false
      }
    };
  }

  componentWillMount(){
    if(this.props.question.id.includes('newQuestion')){
      this.setState({
        editMode: true
      });
    }
  }

  componentWillReceiveProps(nProps, nState){
    let state = {};
    if(nProps.question !== this.props.question){
      state.question = nProps.question
    }
    if(nProps.question.id.includes('newQuestion')){
      state.editMode = true;
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
    let Content   = this.state.editMode ? QuestionInterface : QuestionBlock;

    return (
      <li style={style.questionItem} >
        <div className="questionHeader" style={style.questionHeader}>
          <div className="questionShortName" style={style.questionShortName} >
            <Tooltip message={question.outcomes.longOutcome}
                     position='top-right'
              >
              Outcome: {question.outcomes.shortOutcome}
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
                 style={_.merge({}, style.questionToolBtns, {backgroundColor: editHover || this.state.editMode ? '#31708f' : 'transparent'})}
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

    if(this.state.editMode){
      //Save Question to store here.
    }

    this.setState({
      editMode: !this.state.editMode
    });
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
