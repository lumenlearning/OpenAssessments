'use strict'

import React     from 'react';
import Style     from './css/style.js';
import SimpleRCE from './simple_rce.jsx';

export default class AnswerOption extends React.Component{

  constructor(props) {
    super(props)

    this.state = {
      answerMaterial: this.props.answerMaterial
    }
  }

  config() {
    return({
      toolbar: false,
      statusbar: false,
      menubar: false,
      elementpath: false
    });
  }

  render() {
    let style    = Style.styles();
    let material = this.state.answerMaterial;

    return(
      <SimpleRCE
        content={material}
        config={"simple"}
        onChange={(event, index) => this.props.onChange(event, index)}
        />
    );
  }

}
