"use strict";

import React from "react";
import Style from "../css/style.js";

export default class QuestionInterface extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {}
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;
    let style    = Style.styles();

    return (
      <div style={{border: "1px solid rgba(0,0,0,0.2)", borderRadius: "5px"}}>
        <div style={{display: "block", height: "40px", width: "100%", padding: "7px", backgroundColor: "#939393"}}>
          <p style={{marginTop: "2px", color: "white"}}>Add Question</p>
        </div>
        <div style={{padding: "15px"}}>
          <div>
            <div>Question:</div>
            <div>Which of the follow is a vegetable?</div>
          </div>
          <table>
            <thead>
              <th>Correct</th>
              <th>Answer Option</th>
              <th>Feedback</th>
            </thead>
            <tbody>
              <tr>
                <td><input type="radio" /></td>
                <td>potato</td>
                <td>Correct! A potato is an edible part of a plant in tuber form and is a vegetable.</td>
              </tr>
              <tr>
                <td><input type="radio" /></td>
                <td>tomato</td>
                <td>Incorrect. Many people mistakenly think a tomato is a vegetable. However, because a tomato is the fertilized ovary of a tomato plant and contains seeds, it is a fruit.</td>
              </tr>
              <tr>
                <td><input type="radio" /></td>
                <td>apple</td>
                <td>Incorrect. An apple is the fertilized ovary that comes from an apple tree and contains seeds.</td>
              </tr>
            </tbody>
          </table>
          <button> Add Option</button>
          <div>
            <div>Hint</div>
            <div>A fruit is the fertilized ovary from a flower that contains seeds of the plant.</div>
          </div>
          <button>Add Hint</button>
        </div>
      </div>
    )

  }

}
