"use strict";

import React                          from 'react';
import _                              from 'lodash';
import BaseComponent                  from '../base_component.jsx';
import Style                          from './css/style';
import Expandable                     from '../admin/expandable';

export default class Instructions extends BaseComponent{

  constructor(props, context) {
    super(props, context);

    //Rebindings
    this._bind();
  }//constructor

render() {
    console.log("rendering instructions", this.props.settings.assessmentKind);
    if(true){
      return <div>
            <p>This quiz is designed to assess students on the following learning outcomes:
[list learning outcomes]</p>
            <ul>
                <li>When a student takes a quiz, they receive 2 questions for each outcome.</li>
                <li>This bank must contain a minimum of 2 questions for each outcome covered.</li>
                <li>You may delete an outcome from this quiz by removing all questions aligned to that outcome.</li>
                <li>When adding or editing questions, be sure to confirm the question content is covered in the course material provided in the study plan tile associated with the learning outcome.</li>
                <li>So that students may use Self Checks and Show What You Know to assess whether they are prepared for the quiz, similar questions are included on all three assessment types. If you edit this quiz, we recommend making similar edits to Show What You Know and Self Checks.</li>
            </ul>
        </div>
    }
    else if(false && this.props.settings.assessmentKind == "formative"){
      return <p>formative</p>
    }
    else if (true &&this.props.settings.assessmentKind == "swyk"){
        return <p>swyk</p>
    }
    else return <p>hi</p>
}

  }
