"use strict";

import React    from "react";
import Style    from "./css/style.js";
import BaseComponent from '../../base_component.jsx';
import Checkbox from './check_box.jsx';
import SimpleRCE  from './simple_rce';

export default class QuestionInterface extends BaseComponent{

  constructor(props, state) {
    super(props, state);
  }

  // Don't update because we don't want SimpleRCE to get a new instance
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    let material = this.props.material;
    let style    = Style.styles();

    return (
      <div style={style.qBlock}>
        <div style={style.label}>Question</div>
        <SimpleRCE material={this.props.material} onChange={this.props.onChange}/>
      </div>
    )

  }//render

}
