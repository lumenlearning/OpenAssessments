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
    }

    //Rebindings
    this.toggleEdit       = this.toggleEdit.bind(this);
    this.toggleMinimize   = this.toggleMinimize.bind(this);
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
            <img className='questionToolBtns' style={style.questionToolBtns} src="/assets/copy-64.png" alt="Duplicate"/>
            <img className='questionToolBtns' style={style.questionToolBtns} src="/assets/pencil-64.png" alt="Edit"/>
            <img className='questionToolBtns' style={style.questionToolBtns} src="/assets/trash-64.png" alt="Delete"/>
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
    this.setState({
      editMode: !this.state.editMode
    });
  }

  toggleMinimize(e){
    this.setState({
      minimize: !this.state.minimize
    });
  }

  handleDelete(e){

  }


  /*CUSTOM FUNCTIONS*/
};

