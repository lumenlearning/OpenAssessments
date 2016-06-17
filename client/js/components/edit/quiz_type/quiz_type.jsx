"use strict";

import React         from "react";
import QuestionBlock from "../question_block/question_block.jsx";

export default class QuizTypeSection extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {}
  }

  render() {

    return (
      <div>
        {this.props.section.quizTypes.map((quiz, index) => {
          return (
            <div>
              <p>{quiz.type}</p>
              <QuestionBlock quiz={quiz} />
            </div>
          )
        })}
      </div>
    )

  }

}
