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
      <div style={style.block}>
        <AnswerFeedbackLabels />

        {this.props.answers.map((answer, index) => {
          return (
            <div style={style.answerRow}>
              <div style={style.emptyCell}>
                <Checkbox isCorrect={answer.isCorrect} />
              </div>
              <div style={style.answerOptionBlock}>
                <AnswerOption answerMaterial={answer.material} />
              </div>
              <div style={style.feedbackBlock}>
                <Feedback feedback={answer.feedback} />
              </div>
            </div>
          );
        })}

        <div style={style.buttonDiv}>
          <button>Add Option</button>
        </div>
      </div>
    )
  }//render

  /*CUSTOM HANDLERS*/
  handleAddOption(){

  }

}
