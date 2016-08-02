"use strict";

import React    from "react";
import BaseComponent from '../../base_component.jsx';
import TinyMCE  from 'react-tinymce';

export default class SimpleRCE extends BaseComponent {

  constructor(props, state) {
    super(props, state);
  }

  render() {
    return (
        <TinyMCE
            content={this.props.material}
            config={{
          plugins: '',
          toolbar: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist link image',
          menubar: '',
          //statusbar: false,
          elementpath: false
        }}
            onChange={this.props.onChange}
        />
    )

  }

}
