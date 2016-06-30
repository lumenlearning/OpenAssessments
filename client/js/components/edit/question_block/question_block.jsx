"use strict";

import React from "react";
import Style from "../css/style.js";

export default class QuestionBlock extends React.Component{

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
          <button style={{float: "right"}}>&lt;3</button>
        </div>
        <div style={{padding: "15px"}}>
          <p>{question.title}</p>
        </div>
      </div>
    )

  }

}
