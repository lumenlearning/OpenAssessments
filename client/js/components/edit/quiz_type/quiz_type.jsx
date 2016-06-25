"use strict";

import React         from "react";
import QuestionBlock from "../question_block/question_block.jsx";
import QuestionInterface from "../question_interface/question_interface.jsx";

export default class QuizTypeSection extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {}
  }

  componentWillMount() {

  }

  render() {
    let quizType = this.props.type;

    return (
      <div style={{margin: "15px", padding: "15px", border: "1px solid rgba(0,0,0,0.2)", borderRadius: "5px"}}>
        <p style={{fontSize: "16px", fontWeight: "bold"}}>{quizType.type}</p>
        {quizType.questions.map((question, index) => {
          return (
            <QuestionBlock question={question} key={index} />
          )
        })}
        <br/>
        <QuestionInterface />
      </div>
    )

  }

}
