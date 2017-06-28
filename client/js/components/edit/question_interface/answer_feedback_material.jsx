'use strict'

import React                from 'react';
import Style                from './css/style.js';
import AnswerFeedbackLabels from './answer_feedback_labels.jsx';
import AnswerFeedbackRow    from './answer_feedback_row.jsx';
import AnswerOption         from './answer_option.jsx';
import Feedback             from './feedback.jsx';
import Checkbox             from './check_box.jsx';

export default class AnswerFeedbackMaterial extends React.Component{

  constructor(props, state) {
    super(props, state)

    this.handleResize = this.handleResize.bind(this);

    this.state = {
      answers: this.props.answers,
      windowWidth: window.innerWidth
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(e) {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  renderLabelsLarge() {
    let windowWidth = this.state.windowWidth;

    if (windowWidth <= 1000) {
      return;
    } else {
      return(<AnswerFeedbackLabels />);
    }
  }

  render() {
    let style = Style.styles();
    let windowWidth = this.state.windowWidth;

    return (
      <div>
        {this.renderLabelsLarge()}

        {this.props.answers.map((answer, index) => {
          return (
            <AnswerFeedbackRow
              key={answer.id}
              index={index}
              answer={answer.material}
              feedback={answer.feedback}
              isCorrect={answer.isCorrect}
              handleAnswerChange={this.props.handleAnswerChange}
              handleFeedbackChange={this.props.handleFeedbackChange}
              handleCorrectChange={this.props.handleCorrectChange}
              handleAnswerRemoval={this.props.handleAnswerRemoval}
              />
          )
        })}

        <div style={style.buttonDiv}>
          <button onClick={this.props.handleAddOption}>Add Option</button>
        </div>
      </div>
    )
  }
}
