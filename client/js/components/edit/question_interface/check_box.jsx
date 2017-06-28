"use strict";

import React from "react";
import _     from "lodash";
import Style from "./css/style.js";

export default class Checkbox extends React.Component{

  constructor(props) {
    super(props);
    this.toggleHover  = this.toggleHover.bind(this);
    this.toggleActive = this.toggleActive.bind(this);

    this.state = {
      hover: false
    }
  }

  toggleHover() {
    let hover = !this.state.hover;

    this.setState({
      hover: hover
    });
  }

  hoverColor() {
    let checkCircle;
    let style = Style.styles();

    if (this.props.isCorrect) {
      checkCircle = _.merge(style.checkHover, {opacity: "1"});
    } else if (this.state.hover) {
      checkCircle = _.merge(style.checkHover, {opacity: "0.5"});
    } else {
      checkCircle = _.merge(style.checkHover, {opacity: "0"});
    }

    return checkCircle;
  }

  toggleActive() {
    console.log('toggle active');
    this.props.handleCorrectChange(this.props.index, !this.props.isCorrect);
  }

  activeBorder() {
    let style = Style.styles();
    let border;

    if (this.props.isCorrect) {
      border = _.merge(style.checkCircle, {border: "2px solid #868686"});
    } else {
      border = _.merge(style.checkCircle, {border: "2px solid #CCC"});
    }

    return border;
  }

  render() {
    let style = Style.styles();

    return (
      <div>
        <div style={this.activeBorder()}>
          <img
            style={this.hoverColor()}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={this.toggleActive}
            src="/assets/checkbox-48.png" alt="This Answer is Correct"
            />
        </div>
      </div>
    )

  }

}
