"use strict";

import React                          from 'react';
import _                              from 'lodash';
import BaseComponent                  from '../../base_component.jsx';
import Expandable                     from '../../common/expandable_dropdown/expandable_dropdown.jsx';
import Style                         from '../css/style.js';


export default class Instructions extends BaseComponent{

  constructor(props, context) {
    super(props, context);

    //Rebindings
    this._bind();
  }//constructor

getInstructionType(this.props.settings.assessmentKind){
    if(true || this.props.settings.assessmentKind == "summative"){
        return (
            <ul>
                <li>This quiz is designed to assess students on the following learning outcomes:
    [list learning outcomes]</li>
                <li>When a student takes a quiz, they receive 2 questions for each outcome.</li>
                <li>This bank must contain a minimum of 2 questions for each outcome covered.</li>
                <li>You may delete an outcome from this quiz by removing all questions aligned to that outcome.</li>
                <li>When adding or editing questions, be sure to confirm the question content is covered in the course material provided in the study plan tile associated with the learning outcome.</li>
                <li>So that students may use Self Checks and Show What You Know to assess whether they are prepared for the quiz, similar questions are included on all three assessment types. If you edit this quiz, we recommend making similar edits to Show What You Know and Self Checks.</li>
            </ul>
        )
    }
    else if(false && this.props.settings.assessmentKind == "formative"){
        return (
            <ul>
                <li>This bank must contain a minimum of 1 question. We recommend providing more than one question so that your students have multiple practice opportunities.</li>
                <li>When adding or editing questions, be sure to confirm the question content is covered in the course material provided in the study plan tile associated with the learning outcome.</li>
                <li>So that students may use Self Checks and Show What You Know to assess whether they are prepared for the quiz, similar questions are included on all three assessment types. If you edit this quiz, we recommend making similar edits to Show What You Know and Self Checks.</li>
            </ul>
        )
    }
    else if (false || this.props.settings.assessmentKind == "swyk"){
        return (
            <ul>
                <li>This Show What You Know (SWYK) assessment is designed to allow students to test their prior knowledge on the following learning outcomes:
[list learning outcomes]</li>
                <li>When a student takes a SWYK, they receive 1 question for each outcome.</li>
                <li>This bank must contain a minimum of 1 question for each outcome covered.</li>
                <li>You may delete an outcome from this SWYK by removing all questions aligned to that outcome.</li>
                <li>When adding or editing questions, be sure to confirm the question content is covered in the course material provided in the study plan tile associated with the learning outcome.</li>
                <li>So that students may use Self Checks and Show What You Know to assess whether they are prepared for the quiz, similar questions are included on all three assessment types. If you edit this SWYK, we recommend making similar edits to the Self Checks and the quiz.</li>
            </ul>
        )
    }
    else {
        return woops
    }
}

render() {
    let style   = Style.styles();
    console.log("rendering instructions", this.props.settings.assessmentKind);
      return <div>
          <div style={{marginLeft: "15px"}}>Instructions</div>
      <Expandable>
        <div style={{border: "1px solid rgba(0,0,0,0.2)", borderRadius: "5px"}}>
            <div style={{margin: "10px"}}>
                getInstructionType();
            </div>
        </div>
        </Expandable>
    }
