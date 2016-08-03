'use strict'

import React     from 'react';
import Style     from './css/style.js';
import SimpleRCE from './simple_rce.jsx';
// import TinyMCE from 'react-tinymce';

export default class AnswerOption extends React.Component{

  constructor(props) {
    super(props)

    this.state = {
      answerMaterial: this.props.answerMaterial
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
    });
  }

  render() {
    let style    = Style.styles();
    let material = this.state.answerMaterial;

    return(
      <SimpleRCE
        content={material}
        config={this.config()}
        onChange={this.props.onChange}
        />
    );
  }

}
