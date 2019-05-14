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
      let that = this;
      this.props.selectQuestion(this.props.index, function(){
        that.props.toggle();
      });
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
    var tabIndex = this.props.expanded ? "0" : null
    var material = "";

      /**
       * Note on dangerouslySetInnerHTML Usage
       *
       * It is generally not a good idea to use dangerouslySetInnerHTML because it
       * may expose applications to XSS attacks. We are opting to use it here and
       * and in other places in the code base because the assessment content is
       * is stored in (and returned from) the DB as XML, which limits our options
       * in how we can handle assessment "material" on the frontend.
       *
       * READ: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
       */
      material = (<div
                  dangerouslySetInnerHTML={{
                    __html: this.props.question.material
                  }}>
                  </div> )
    return (
      <div tabIndex={tabIndex} style={styles.li} key={"li" + this.props.index} onKeyPress={(e)=>{if(e.keyCode = 13) this.selectQuestion()}} onClick={()=>{this.selectQuestion()}} onMouseEnter={()=>{this.mouseOver()}} onMouseLeave={()=>{this.mouseOut()}}>
        <h5>Question {this.props.index + 1}</h5>
        <span>{material}</span>
      </div>);
  }
}

ProgressListItem.propTypes = {
 selectQuestion   : React.PropTypes.func.isRequired,
};

ProgressListItem.contextTypes = {
  theme: React.PropTypes.object
}
