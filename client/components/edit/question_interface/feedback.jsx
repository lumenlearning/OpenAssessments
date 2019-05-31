'use strict'

import React     from 'react';
import Style     from './css/style.js';
import SimpleRCE from './simple_rce.jsx';

export default class Feedback extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      feedback: this.props.feedback
    }
  }

  config() {
    return({
      toolbar: false,
      statusbar: false,
      menubar: false,
      elementpath: false
    })
  }

  render() {
    let style    = Style.styles();
    let feedback = this.state.feedback;

    return(
      <SimpleRCE
        content={feedback}
        config={"simple"}
        onChange={(event) => this.props.onChange(event, this.props.index)}
        />
    );
  }

}
