"use strict";

import React         from "react";
import Style         from "./css/style.js";
import BaseComponent from '../../base_component.jsx';
import Checkbox      from './check_box.jsx';
import SimpleRCE     from './simple_rce.jsx';

export default class QuestionInterface extends BaseComponent{

  constructor(props, state) {
    super(props, state);
  }

  render() {
    let material = this.props.material;
    let style    = Style.styles();

    return (
      <div style={style.qBlock}>
        <div style={style.label}>Question</div>
        <SimpleRCE
          content={this.props.material}
          config="basic"
          onChange={this.props.onChange}
          />
      </div>
    )

  }

}
