'use strict'

import React                from 'react';
import Style                from './css/style.js';
import AnswerFeedbackLabels from './answer_feedback_labels.jsx';
import AnswerOption         from './answer_option.jsx';
import Feedback             from './feedback.jsx';
import Checkbox             from './check_box.jsx';

export default class AnswerOptionFeedback extends React.Component{

  constructor(props, state) {
    super(props, state)

    this.state = {
      answers: this.props.answers
    }
  }

  render() {
    let style = Style.styles();

    return (
      <div>
        <AnswerFeedbackLabels />
        {this.props.answers.map((answer, index) => {

          return (
            <div key={index} style={style.answerRow}>
              <div style={style.emptyCell}>
                <Checkbox
                  key={index}
                  isCorrect={answer.isCorrect} />
              </div>
              <div style={style.answerOptionBlock}>
                <AnswerOption
                  key={index}
                  answerMaterial={answer.material}
                  onChange={this.props.handleAnswerChange}
                  />
              </div>
              <div style={style.feedbackBlock}>
                <Feedback
                  key={index}
                  feedback={answer.feedback}
                  onChange={this.props.handleFeedbackChange}
                  />
              </div>
            </div>
          );
        })}

        <div style={style.buttonDiv}>
          <button>Add Option</button>
        </div>
      </div>
    )
  }

  /*CUSTOM HANDLERS*/
  // handleAddOption(){
  //
  // }

}
