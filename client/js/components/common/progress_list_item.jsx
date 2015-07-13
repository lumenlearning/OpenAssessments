"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import BaseComponent      from "../base_component";

export default class ProgressListItem extends BaseComponent{
  
  constructor(props, context){
    super(props, context);
    this._bind("mouseOver", "mouseOut", "selectQuestion");
  }

  mouseOver(e){
    this.setState({hovered: true});
  }

  mouseOut(e){
    this.setState({hovered: false});
  }

  selectQuestion(){
    if(AssessmentStore.isStarted()){
      AssessmentActions.selectQuestion(this.props.index);
      this.props.toggle();
    }
  }

  getStyles(theme, hovered){
    return {
      li: {
        backgroundColor: hovered ? "grey" : "white",
        color: hovered ? "white" : "black",
        borderBottom: "1px solid grey",
        padding: "10px",
        cursor: "pointer",
        zIndex: "10"
      },
    }
  }
  render(){
    var hovered = (this.state && this.state.hovered);
    var styles = this.getStyles(this.context.theme, hovered);

    return (
      <div style={styles.li} key={"li" + this.props.index} onClick={()=>{this.selectQuestion()}} onMouseEnter={()=>{this.mouseOver()}} onMouseLeave={()=>{this.mouseOut()}}>
        <h5>Question {this.props.index + 1}</h5>
        <span>{this.props.question.material}</span>
      </div>);
  }
}

ProgressListItem.propTypes = { 

};

ProgressListItem.contextTypes = {
  theme: React.PropTypes.object
}