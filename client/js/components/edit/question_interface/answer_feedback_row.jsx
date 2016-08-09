'use strict'

import React        from 'react';
import _            from 'lodash';
import Style        from './css/style.js';
import AnswerOption from './answer_option.jsx';
import Feedback     from './feedback.jsx';
import Checkbox     from './check_box.jsx';
import DeleteBtn    from './delete_btn.jsx';

export default class AnswerFeedbackRow extends React.Component{

  constructor(props, state) {
    super(props, state)

    this.handleResize = this.handleResize.bind(this);

    this.state = {
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

  render() {
    let answer              = this.props.answer;
    let index               = this.props.index;
    let style               = Style.styles();
    let windowWidth         = this.state.windowWidth;
    let answerFeedbackBlock = windowWidth <= 1000 ? {display: "table", width: "100%", borderSpacing: "0 10px"} : {display: "table", width: "100%", borderSpacing: "10px"};
    let answerFeedback      = windowWidth <= 1000 ? {display: "block", width: "100%", marginBottom: "10px"} : {display: "table-cell", width: "50%"};
    let answerLabelSmall    = windowWidth <= 1000 ? (<div style={_.merge({paddingBottom: "5px"}, style.label)}>Answer Option</div>) : null;
    let feedbackLabelSmall  = windowWidth <= 1000 ? (<div style={_.merge({paddingBottom: "5px"}, style.label)}>Feedback</div>) : null;
    let hr                  = windowWidth <= 1000 ? (<hr style={{margin: "10px 0 20px", borderTop: "1px dotted #868686"}}/>) : null;

    return (
      <div key={index}>
        <div style={{display: "table", width: "100%"}}>
          <div style={{display: "table-cell", minWidth: "50px", height: "100%", verticalAlign: "middle"}}>
            <Checkbox
              key={index}
              index={index}
              isCorrect={answer.isCorrect}
              handleCorrectChange={this.props.handleCorrectChange}
            />
          </div>
          <div style={{display: "table-cell", width: "100%", verticalAlign: "top"}}>
            <div style={answerFeedbackBlock}>
              {answerLabelSmall}
              <div style={answerFeedback}>
                <AnswerOption
                  style={answerFeedback}
                  index={index}
                  answerMaterial={answer.material}
                  onChange={this.props.handleAnswerChange}
                  />
              </div>
              {feedbackLabelSmall}
              <div style={answerFeedback}>
                <Feedback
                  style={answerFeedback}
                  index={index}
                  feedback={answer.feedback}
                  onChange={this.props.handleFeedbackChange}
                  />
              </div>
              <div style={{display: "table-cell", minWidth: "50px", height: "100%", verticalAlign: "middle"}}>
                <DeleteBtn
                  index={index}
                  handleAnswerRemoval={this.props.handleAnswerRemoval}
                  />
              </div>
            </div>
          </div>
        </div>
        {hr}
      </div>
    );
  }
}
