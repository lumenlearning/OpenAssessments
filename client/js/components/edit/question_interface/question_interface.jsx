"use strict";

import React from "react";
import Style from "../css/style.js";

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
      <div style={{border: "1px solid rgba(0,0,0,0.2)", borderRadius: "5px"}}>
        <div style={{display: "block", height: "40px", width: "100%", padding: "7px", backgroundColor: "#939393"}}>
          <div className="questionType">
            {/*choose between different types of questions*/}
          </div>
          <div className="outcomePicker">
            {/*Associate different outcomes to the question*/}
          </div>
        </div>
        <div style={{padding: "15px"}}>
          <div>
            <div>Question:</div>
            <div><textarea name="" id="" cols="30" rows="10">{/*Question goes here*/}</textarea></div>
          </div>
          <table>
            <thead>
              <th></th>
              <th>Answer Option</th>
              <th>Feedback</th>
            </thead>
            <tbody>
              {this.props.question.answers.map((answer, index)=>{
                return (
                  <tr>
                    <td><input type="radio" /></td>
                    <td><textarea name="answerOption" id="" cols="30" rows="10">{/*Answer Goes here*/}</textarea></td>
                    <td><textarea name="" id="" cols="30" rows="10">{/*Feedback goes here*/}</textarea></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button> Add Option</button>
          <div>
            <div>Hint</div>
            <div><textarea name="" id="" cols="30" rows="10">{/*Text Area goes here*/}</textarea></div>
          </div>
          <button>Add Hint</button>
        </div>
      </div>
    )

  }//render

  /*CUSTOM HANDLERS*/
  handleAddOption(){

  }

}
