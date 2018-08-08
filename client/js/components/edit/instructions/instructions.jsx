"use strict";

import React                          from 'react';
import _                              from 'lodash';
import BaseComponent                  from '../../base_component.jsx';
import Expandable                     from '../expandable_dropdown/expandable_dropdown.jsx';
import Style                          from '../css/style.js';


export default class Instructions extends BaseComponent{

  constructor(props, context) {
    super(props, context);

    //Rebindings
    this._bind();
  }//constructor

getInstructionType(){
    let style   = Style.styles();

    if(this.props.settings.assessmentKind == "summative"){
        return (
            <ul style={style.textList}>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Outcomes.</span> This quiz is designed to assess students on all learning outcomes in this module. Each module typically has 4-6 outcomes, one for each section in the module.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Sub-Outcomes.</span> Each outcome is further broken down into sub-outcomes that represent a single skill or knowledge chunk. Questions are associated with both an outcome and a sub-outcome.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Questions.</span> When a student takes a quiz, they receive 2 questions (selected at random) for each outcome. Accordingly, this bank must contain a minimum of 2 questions for each outcome covered.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Deleting Outcomes.</span> You may delete an outcome from this quiz by removing all questions aligned to that outcome.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Alignment with Content.</span> When adding or editing questions, be sure to confirm the question content is covered in the course material provided in the study plan tile associated with the learning outcome because students who get the question wrong will get feedback encouraging them to review that tile.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Alignment between Assessments.</span> So that students may use Self Checks and Show What You Know to assess whether they are prepared for the quiz, similar questions are included on all three assessment types. If you edit this quiz, we recommend making similar edits to Show What You Know and Self Checks.</li>
            </ul>
        )
    }
    else if(this.props.settings.assessmentKind == "formative"){
        return (
            <ul style={style.textList}>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Outcomes.</span> This Self-Check is designed to help students check their understanding of this learning outcome before moving on to study the next learning outcome.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Questions.</span> This bank must contain a minimum of 1 question. We recommend providing more than one question so that your students have multiple practice opportunities.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Alignment with Content.</span> When adding or editing questions, be sure to confirm the question content is covered in the course material provided in this same study plan tile because students who get the question(s) wrong will get feedback encouraging them to review the tile.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Alignment between Assessments.</span> So that students may use Self Checks and Show What You Know to assess whether they are prepared for the quiz, similar questions are included on all three assessment types. If you edit this Self Check, we recommend making similar edits to Show What You Know and the quiz.</li>
            </ul>
        )
    }
    else if (this.props.settings.assessmentKind == "swyk" || this.props.settings.assessmentKind == "show_what_you_know"){
        return (
            <ul style={{listStyleType: 'none', paddingLeft: '5px', padding: '2px', fontSize: '14px'}}>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Outcomes.</span> This Show What You Know (SWYK) pretest is designed to allow students to test their prior knowledge on all learning outcomes in this module.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Questions.</span> When a student takes a SWYK, they receive 1 question (selected at random) for each outcome. Accordingly, this bank must contain a minimum of 1 question for each outcome that is covered.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Deleting Outcomes.</span> You may delete an outcome from this SWYK by removing all questions aligned to that outcome.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Alignment with Content.</span> When adding or editing questions, be sure to confirm the question content is covered in the course material provided in the study plan tile associated with the learning outcome because students who get the question wrong will get feedback encouraging them to review that tile.</li>
                <li style={style.textItems}> <span style={{fontWeight: 'bold'}}>Alignment between Assessments.</span> So that students may use Self Checks and Show What You Know to assess whether they are prepared for the quiz, similar questions are included on all three assessment types. If you edit this SWYK, we recommend making similar edits to the Self Checks and the quiz.</li>
            </ul>
        )
    }
}

render() {
    let style   = Style.styles();
      return (
          <div>
                <Expandable>
                    <div style={{border: "1px solid rgba(0,0,0,0.2)", borderRadius: "5px"}}>
                        <div style={{margin: "10px"}}>
                                {this.getInstructionType()}
                        </div>
                    </div>
                </Expandable>
          </div>
      )
  }
}
