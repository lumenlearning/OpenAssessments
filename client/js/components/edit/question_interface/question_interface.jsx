"use strict";

import React from "react";
import Checkbox from './check_box.jsx';
import Style from "./css/style.js";

export default class QuestionInterface extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {
      question: this.props.question || {}
    }
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;
    let style    = Style.styles();

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>

          {/* QUESTION */}
          <div style={style.qBlock}>
            <div style={style.qLabel}>Question</div>
            <textarea style={style.textArea} name="question" id="question" rows="3">
              {question.material}
            </textarea>
          </div>

          {/* ANSWER OPTION / FEEDBACK */}
          <div style={style.block}>
            <div style={style.ofLabelBlock}>
              <div style={style.emptyCell}></div>
              <div style={style.optionLabelBlock}>
                <div style={style.optionLabel}>Answer Option</div>
              </div>
              <div style={style.feedbackLabelBlock}>
                <div style={style.feedbackLabel}>Feedback</div>
              </div>
            </div>

            {this.props.question.answers.map((answer, index) => {
              return (
                <div style={style.answerRow}>
                  <div style={style.emptyCell}>
                    <Checkbox isCorrect={answer.isCorrect} />
                  </div>
                  <div style={style.answerOptionBlock}>
                    <textarea style={style.textArea} name="answerOption" id="answerOption" rows="3">{answer.material}</textarea>
                  </div>
                  <div style={style.feedbackBlock}>
                    <textarea style={style.textArea} name="feedback" id="feedback" rows="3">{answer.feedback}</textarea>
                  </div>
                </div>
              );
            })}
            <div style={style.buttonDiv}>
              <button>Add Option</button>
            </div>
          </div>
        </div>

      </div>
    )

  }//render

  /*CUSTOM HANDLERS*/
  handleAddOption(){

  }

}
