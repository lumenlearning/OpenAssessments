"use strict";

import React    from "react";
import BaseComponent from '../../base_component.jsx';
import TinyMCE  from 'react-tinymce';

export default class SimpleRCE extends BaseComponent {

  constructor(props, state) {
    super(props, state);
  }

  config() {
    if (this.props.config) {
      return({
        menubar: this.props.config.menubar,
        statusbar: this.props.config.statusbar,
        toolbar: this.props.config.toolbar,
        elementpath: this.props.config.elementpath
      });
    } else {
      return ({
        menubar: false,
        statusbar: false,
        toolbar: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist link image',
        elementpath: false
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
