"use strict";

import React from "react";
import Style from "./css/style.js";
import cb from 'material-ui/lib/checkbox.js';

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
    let style         = Style.styles();
    let status        = this.state.expanded ? "Minimize" : "Expand";
    let contentStyle  = this.expansionController();

    //expander controller

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

    return content.scrollHeight+'px';
  }

  expansionController(){
    let style         = Style.styles();
    let expandedProp  = this.props.isExpanded;
    let expandedState = this.state.expanded;
    let mounted       = this.state.mounted;

    if(expandedProp && !mounted){
      return style.expandableContent;
    }
    else if((expandedState || expandedProp) && mounted){
      return _.merge({}, style.expandableContent, {maxHeight: this.findMaxHeight()});
    }
    else{
      return style.expandableContent;
    }
  }//expansionController

}

ExpandableDropDown.propTypes = {
  isExpanded: React.PropTypes.bool
};
