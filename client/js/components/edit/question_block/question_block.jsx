"use strict";

import React        from "react";
import Style        from "./css/style.js";
import Expandable   from '../../common/expandable_dropdown/expandable_dropdown.jsx';

export default class QuestionBlock extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {
      question: this.props.question || null
    }
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;
    let style    = Style.styles();

    return (
      <div style={style.qbContent}>
        <div style={style.qbContentHead}>
          <p style={style.qbQuestion} dangerouslySetInnerHTML={this.constructor.createMarkup(question.material)} />
        </div>
        <Expandable>
          <table style={style.qbAnswerTable} >
            <thead>
              <tr>
                <td></td>
                <td style={style.qbColHead} >Answer</td>
                <td style={style.qbColHead} >Feedback</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={style.qbColImg} >
                  {"X"}
                </td>
                <td style={style.qbColAnswer} >
                  <p style={style.qbAnswerWrap} disabled>
                      {"Aliquam animi autem culpa dicta doloremque ea eius error explicabo inventore ipsam iusto modinemo pariatur perferendis placeat quae quia quibusdam quidem, quos sed sequi similique ullam velveniam voluptatibus?"}
                  </p>
                </td>
                <td style={style.qbColAnswer} >
                  <p style={style.qbAnswerWrap} disabled>
                      {"Feedback value"}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </Expandable>
      </div>
    )

  }

  static createMarkup(data) {
    return {__html: data};
  }

}
