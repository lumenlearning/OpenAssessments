"use strict";

import React                          from 'react';
import BaseComponent                  from '../../base_component.jsx';
import Style                          from './css/style';
import {Accordion, AccordionSection}  from '../accordion/accordion.js';
import ReviewAssessmentActions        from "../../../actions/review_assessment";
import ReviewAssessmentStore          from "../../../stores/review_assessment";
import SettingsStore                  from '../../../stores/settings.js';

import OutcomeSection                 from '../outcome_section/outcome_section.jsx';
import QuestionBlock                  from '../question_block/question_block.jsx';
import QuestionInterface              from '../question_interface/question_interface.jsx';

export default class Question extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.state = {
      question: this.props.question || null,
      editMode: false,
      minimize: false,
      hover:{
        "copy": false,
        "edit": false,
        "delete": false
      }
    };

    //Rebindings
    this.toggleEdit         = this.toggleEdit.bind(this);
    this.handleDuplicate    = this.handleDuplicate.bind(this);
    this.handleDelete       = this.handleDelete.bind(this);
    this.handleHoverStates  = this.handleHoverStates.bind(this);

  }//constructor

  componentWillMount(){
    //when component will mount, grab data from the editQuiz store
  }

  render(){
    let question  = this.state.question;
    let style     = Style.styles();
    let delHover  = this.state.hover.delete;
    let copyHover = this.state.hover.copy;
    let editHover = this.state.hover.edit;

    let Content = this.state.editMode ? QuestionInterface : QuestionBlock;

    return (
      <li style={style.questionItem} >
        <div className="questionHeader" style={style.questionHeader}>
          <div className="questionToolbar" style={style.questionToolbar}>
            <img className='questionToolBtns'
                 style={_.merge({}, style.questionToolBtns, {backgroundColor: copyHover ? '#31708f' : 'transparent'})}
                 src="/assets/copy-64-white.png"
                 onClick={this.handleDuplicate}
                 onMouseOver={this.handleHoverStates}
                 onMouseLeave={this.handleHoverStates}
                 data-hovertype="copy"
                 title='Duplicate'
                 alt="Duplicate"
              />
            <img className='questionToolBtns'
                 style={_.merge({}, style.questionToolBtns, {backgroundColor: editHover || this.state.editMode ? '#31708f' : 'transparent'})}
                 src="/assets/pencil-64-white.png"
                 onClick={this.toggleEdit}
                 onMouseOver={this.handleHoverStates}
                 onMouseLeave={this.handleHoverStates}
                 data-hovertype="edit"
                 title='Edit'
                 alt="Edit"
              />
            <img className='questionToolBtns'
                 style={_.merge({}, style.questionToolBtns, {backgroundColor: delHover ? '#bb5432' : 'transparent'})}
                 src="/assets/trash-64-white.png"
                 onClick={this.handleDelete}
                 onMouseOver={this.handleHoverStates}
                 onMouseLeave={this.handleHoverStates}
                 data-hovertype='delete'
                 title='Delete'
                 alt="Delete"
              />
          </div>
        </div>
        <div className="questionContent">
          <Content question={question}/>
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
console.log("DUPLICATE", e);
  }

  handleDelete(e){
console.log("DELETE", e);
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
        hoverStatus = false
      break;
    }

    hoverState[hoverType] = hoverStatus;

    this.setState({
      hover: hoverState
    });
  }

  /*CUSTOM FUNCTIONS*/
};

