'use strict'

import React   from 'react';
import Style   from './css/style.js';
import TinyMCE from 'react-tinymce';

export default class Feedback extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      feedback: this.props.feedback
    }
  }

  // Don't update because we don't want SimpleRCE to get a new instance
  shouldComponentUpdate(nextProps, nextState) {
    return false;
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
      <TinyMCE
          content={feedback}
          config={this.config()}
          onChange={this.props.onChange}
      />
    );
  }

}
