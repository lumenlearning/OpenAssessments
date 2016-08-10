"use strict";

import React from "react";
import _     from "lodash";
import Style from "./css/style.js";

export default class DeleteBtn extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };

    //REBINDINGS
    this.toggleHover = this.toggleHover.bind(this);
  }

  render() {
    let style = Style.styles();

    return (
      <div>
        <div style={this.btnHoverStyles()}>
          <img
            style={style.delBtnIcon}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={()=> this.props.handleAnswerRemoval(this.props.index)}
            src="/assets/trash-64.png"
            alt="Remove This Question"
            />
        </div>
      </div>
    )
  }

  /*EVENT HANDLERS*/
  toggleHover(e){
    this.setState({
      hover: e.type == 'mouseenter' || e.type == 'mouseover'
    });
  }

  /*CUSTOM FUNCTIONS*/
  btnHoverStyles(){
    let style = Style.styles();
    let hover = this.state.hover;
    let hoverStyles = {
      backgroundColor: '#FFB8B8'
    };

    return _.merge({}, style.delBtn, hover ? hoverStyles : {});
  }

}
