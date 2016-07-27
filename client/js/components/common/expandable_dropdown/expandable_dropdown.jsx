"use strict";

import React from "react";
import Style from "./css/style.js";

export default class QuestionBlock extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {
      expanded: this.props.isExpanded || false
    }

    this.toggleExpand   = this.toggleExpand.bind(this);
    this.findMaxHeight  = this.findMaxHeight.bind(this);
  }

  componentWillMount() {

  }

  render() {
    let style         = Style.styles();
    let contentStyle  = this.state.expanded ?  _.merge({}, style.expandableContent, {maxHeight: this.findMaxHeight()}) : style.expandableContent;
    let status        = this.state.expanded ? "Minimize" : "Expand";

    this.state.expanded ? console.log('scroll height:', this.findMaxHeight()) : console.log('nun');

    return (
      <div style={style.expandable}>
        <div style={contentStyle} ref={'expandableContent'} >
          {this.props.children}
        </div>
        <div style={style.expandableBtn} onClick={this.toggleExpand} >
          <p style={style.expandableTxt} >Click to {status}</p>
        </div>
      </div>
    )

  }

  /*EVENT HANDLERS*/
  toggleExpand(){
    this.setState({
      expanded: !this.state.expanded
    })
  }


  /*CUSTOM FUNCTIONS*/
  findMaxHeight(){
    let content = this.refs.expandableContent.getDOMNode();

    console.log("REFS:", this.refs);
    console.log("CONTENT:", content);

    return content.scrollHeight+'px';
  }

}
