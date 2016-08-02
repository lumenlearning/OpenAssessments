"use strict";

import React    from "react";
import Style    from "./css/style.js";
import Checkbox from './check_box.jsx';

export default class QuestionInterface extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {
      material: this.props.material
    }
  }

  handleChange(e) {
    this.setState({
      material: e.target.value
    });
  }

  render() {
    let material = this.state.material;
    let style    = Style.styles();

    return (
      <div style={style.qBlock}>
        <div style={style.label}>Question</div>
        <textarea style={style.textArea} name="question" id="question" rows="3" onChange={this.handleChange}>
          {material}
        </textarea>
      </div>
    )

  }//render

}
