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

  handleAnswerChange(e, index) {
    this.setState({
      answers: {
        [index]: {
          material: e.target.getContent()
        }
      }
    });
    // console.log("answer updating? ", this.state.answers[index].material)
  }

  handleFeedbackChange(e, index) {
    this.setState({
      answers: {
        [index]: {
          feedback: e.target.getContent()
        }
      }
    });
    // console.log("feedback updating? ", this.state.answers[index].feedback)
  }

  render() {
    let style = Style.styles();

    return (
      <div style={style.block}>
        <AnswerFeedbackLabels />
        {this.props.answers.map((answer, index) => {

          return (
            <div key={index} style={style.answerRow}>
              <div style={style.emptyCell}>
                <Checkbox key={index} isCorrect={answer.isCorrect} />
              </div>
              <div style={style.answerOptionBlock}>
                <AnswerOption
                  key={index}
                  answerMaterial={answer.material}
                  onChange={(event) => this.handleAnswerChange(event, index)}
                  />
              </div>
              <div style={style.feedbackBlock}>
                <Feedback
                  key={index}
                  feedback={answer.feedback}
                  onChange={(event) => this.handleFeedbackChange(event, index)}
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
  handleAddOption(){

  }

}
