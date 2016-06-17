"use strict";

import React from "react";

export default class QuestionBlock extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {}
  }

  render() {

    return (
      <div>
        {this.props.quiz.questions.map((question, index) => {
          return (
            <div>
              <p>{question.title}</p>
            </div>
          )
        })}
      </div>
    )
    
  }

}
