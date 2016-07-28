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
    console.log("DEFAULT SETTINGS:", window.DEFAULT_SETTINGS);


    this.state = {
      question: this.props.question || null,
      editMode: false,
      minimize: false,
      hover:{
        "copy": false,
        "edit": false,
        "delete": false,
      }
    };

    //Rebindings
    this.toggleEdit       = this.toggleEdit.bind(this);
    this.handleDuplicate   = this.handleDuplicate.bind(this);
    this.handleDelete     = this.handleDelete.bind(this);
  }//constructor

  componentWillMount(){
    //when component will mount, grab data from the editQuiz store
  }

  render(){
    let question = this.state.question;
    let style = Style.styles();

    let Content = this.state.editMode ? QuestionInterface : QuestionBlock;

    console.log("TO BE OR NOT TO BE:", this.state.question);

    return (
      <li style={style.questionItem} >
        <div className="questionHeader" style={style.questionHeader}>
          <div className="questionToolbar" style={style.questionToolbar}>
            <img className='questionToolBtns'
                 style={style.questionToolBtns}
                 src="/assets/copy-64-white.png"
                 onClick={this.handleDuplicate}
                 onMouseIn={}
                 onMouseOut={}
                 title='Duplicate'
                 alt="Duplicate"
              />
            <img className='questionToolBtns'
                 style={style.questionToolBtns}
                 src="/assets/pencil-64-white.png"
                 onClick={this.toggleEdit}
                 title='Edit'
                 alt="Edit"
              />
            <img className='questionToolBtns'
                 style={style.questionToolBtns}
                 src="/assets/trash-64-white.png"
                 onClick={this.handleDelete}
                 onMouseIn={}
                 onMouseOut={}
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

  }

  handleDelete(e){

  }


  /*CUSTOM FUNCTIONS*/
};

