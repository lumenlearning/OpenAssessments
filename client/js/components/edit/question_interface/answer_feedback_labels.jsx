'use strict'

import React from 'react';
import Style from './css/style.js';

export default class AnswerFeedbackLabels extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    let style = Style.styles();

    return(
      <div style={style.ofLabelBlock}>
        <div style={style.emptyCell}></div>
        <div style={style.optionLabelBlock}>
          <div style={style.label}>Answer Option</div>
        </div>
        <div style={style.feedbackLabelBlock}>
          <div style={style.label}>Feedback</div>
        </div>
      </div>
    )
  }

}
