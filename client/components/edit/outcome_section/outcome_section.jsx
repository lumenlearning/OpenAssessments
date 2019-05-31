"use strict";

import React                         from 'react';
import Style                         from '../css/style.js';
import AccordionSection from "../accordion/accordionSection.jsx";
import QuizType                      from '../quiz_type/quiz_type.jsx';

export default class OutcomeSection extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {}
  }

  componentWillMount() {

  }

  render() {
    let section = this.props.section;
    let style   = Style.styles();

    return (
      <AccordionSection key={this.props.reactKey} title={section.shortTitle}>
        <div style={style.titleBar}>
          <div style={{"display": "table-cell", "width": "90%", "verticalAlign": "middle"}}>
            <p style={style.heading}>Outcome: {section.longTitle}</p>
          </div>
          <div style={{"display": "table-cell", "width": "10%"}}>
            <button style={style.deleteButton} className="btn btn-sm">Delete Outcome</button>
          </div>
        </div>
        {section.quizTypes.map((quizType, index) => {
          return (
            <QuizType type={quizType} key={index} />
          )
        })}
        <br/>
      </AccordionSection>
    )
  }

}
