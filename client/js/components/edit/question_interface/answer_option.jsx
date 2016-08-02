'use strict'

import React from 'react';
import Style from './css/style.js';

export default class AnswerOption extends React.Component{

  constructor(props) {
    super(props)

    this.state = {
      answerMaterial: this.props.answerMaterial
    }
  }

  handleChange(e) {
    this.setState({
      answerMaterial: e.target.value
    });
  }

  render() {
    let style    = Style.styles();
    let material = this.state.answerMaterial;

    return(
      <textarea
        style={style.textArea}
        name="answerOption"
        id="answerOption"
        onChange={this.handleChange}
        >
          {material}
      </textarea>
    );
  }

}
