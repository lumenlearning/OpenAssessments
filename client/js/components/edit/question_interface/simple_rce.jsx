"use strict";

import React         from "react";
import BaseComponent from '../../base_component.jsx';
import TinyMCE       from 'react-tinymce';

export default class SimpleRCE extends BaseComponent {

  constructor(props, state) {
    super(props, state);
  }

  // Don't update because we don't want SimpleRCE to get a new instance
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  config() {
    let config = this.props.config;

    if (config === "simple") {
      return({
        toolbar: false,
        menubar: false,
        statusbar: false,
        elementpath: false
      });
    } else if (config === "basic") {
      return({
        toolbar: 'undo redo | fontsizeselect bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | table bullist numlist link image | code',
        plugins: 'table, code',
        menubar: false,
        statusbar: true,
        elementpath: false,
        content_css: '/assets/themes/lumen.css.scss'
      });
    } else {
      return({
        menubar: true,
        statusbar: true,
        elementpath: true
      });
    }
  }

  render() {
    return (
      <TinyMCE
        content={this.props.content}
        config={this.config()}
        onChange={this.props.onChange}
      />
    )

  }

}
