'use strict'

import React from 'react';
import Style from './css/style.js';

export default class Feedback extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      feedback: this.props.feedback
    }
  }

  handleChange(e) {
    this.setState({
      feedback: e.target.value
    });
  }

  render() {
    let style    = Style.styles();
    let feedback = this.state.feedback;

    return(
      <textarea
        style={style.textArea}
        name="feedback"
        id="feedback"
        onChange={this.handleChange}
        >
          {feedback}
      </textarea>
    );
  }

}
