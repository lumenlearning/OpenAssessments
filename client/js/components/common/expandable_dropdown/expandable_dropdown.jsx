"use strict";

import React from "react";
import Style from "./css/style.js";

export default class ExpandableDropDown extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.state = {
      expanded: this.props.isExpanded || false,
      mounted: false
    };

    this.toggleExpand   = this.toggleExpand.bind(this);
    this.findMaxHeight  = this.findMaxHeight.bind(this);
  }


  render() {
    console.log("IS EXPANDED:", this.state.expanded);
    let style         = Style.styles();
    let status        = this.state.expanded ? "Minimize" : "Expand";
    let contentStyle;

    if(this.props.isExpanded && !this.state.mounted){
      contentStyle = style.expandableContent;
    }
    else if((this.state.expanded || this.props.isExpanded) && this.state.mounted){
      contentStyle = _.merge({}, style.expandableContent, {maxHeight: this.findMaxHeight()});
    }
    else{
      contentStyle = style.expandableContent;
    }

//console.log('EXPANDABLE MAX HEIGHT:', this.findMaxHeight());
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

  componentDidMount(){
    this.setState({
      mounted: true
    });
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

ExpandableDropDown.propTypes = {
  isExpanded: React.PropTypes.bool
}
