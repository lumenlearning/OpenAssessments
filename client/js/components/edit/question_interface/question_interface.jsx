"use strict";

import React from "react";
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

    console.log("WHAT DID YOU SAY?", question);

    return (
      <div style={style.qiContent}>
        <div style={style.qiContentBlock}>

          {/* QUESTION */}
          <div style={style.qBlock}>
            <div style={style.qLabel}>Question</div>
            <textarea style={style.textArea} name="question" id="question" rows="3">
              {/*Question goes here*/}
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
                    <input type="checkbox" />
                  </div>
                  <div style={style.answerOptionBlock}>
                    <textarea style={style.textArea} name="answerOption" id="answerOption" rows="3">{/*Answer Goes here*/}</textarea>
                  </div>
                  <div style={styleFeedbackBlock}>
                    <textarea style={style.textArea} name="feedback" id="feedback" rows="3">{/*Feedback goes here*/}</textarea>
                  </div>
                </div>
              );
            })}
            <div style={style.buttonDiv}>
              <button>Add Option</button>
            </div>
          </div>

          {/* HINT */}
          <div style={style.block}>
            <div style={style.hintBlock}>
              <div style={style.hintLabel}>Hint</div>
                <textarea style={style.textArea} name="hint" id="hint" rows="3">{/*Text Area goes here*/}</textarea>
            </div>
            <div style={style.buttonDiv}>
              <button>Add Hint</button>
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
