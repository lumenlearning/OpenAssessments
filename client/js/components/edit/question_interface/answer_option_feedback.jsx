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
          let answerFeedbackBlock = windowWidth <= 1000 ? {display: "block", width: "100%"} : {display: "table-cell", width: "50%"};
          let answerMargin        = windowWidth <= 1000 ? {marginBottom: "10px"} : {marginRight: "10px"};
          let answerLabelSmall    = windowWidth <= 1000 ? (<div style={style.label}>Answer Option</div>) : null;
          let feedbackLabelSmall  = windowWidth <= 1000 ? (<div style={style.label}>Feedback</div>) : null;
          let hr                  = windowWidth <= 1000 ? (<hr style={{margin: "10px 0 20px", borderTop: "1px dotted #868686"}}/>) : (<hr style={{margin: "0 0 25px", borderTop: "1px dotted #868686"}}/>)

          return (
            <div key={index} style={{}}>
              <div style={{display: "table", width: "100%"}}>
                <div style={{display: "table-cell", minWidth: "50px", height: "100%", verticalAlign: "middle"}}>
                  <Checkbox
                    key={index}
                    isCorrect={answer.isCorrect} />
                </div>
                <div style={{display: "table-cell", width: "100%", verticalAlign: "top"}}>
                  <div style={{display: "table", width: "100%", marginBottom: "25px"}}>
                    <div style={answerFeedbackBlock}>
                      <div style={answerMargin}>
                        {answerLabelSmall}
                        <AnswerOption
                          key={index}
                          answerMaterial={answer.material}
                          onChange={this.props.handleAnswerChange}
                          />
                      </div>
                    </div>
                    <div style={answerFeedbackBlock}>
                      {feedbackLabelSmall}
                      <Feedback
                        key={index}
                        feedback={answer.feedback}
                        onChange={this.props.handleFeedbackChange}
                        />
                    </div>
                  </div>
                </div>
              </div>
              {hr}
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
