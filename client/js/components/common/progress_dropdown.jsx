"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import BaseComponent      from "../base_component";
import ProgressListItem   from "./progress_list_item";

export default class ProgressDropdown extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this._bind("navButtonClicked", "getStyles", "handleKeyDown");
  }

  navButtonClicked(e){
    if(this.state && this.state.expanded){
      this.setState({expanded: !this.state.expanded})
    } else {
      this.setState({expanded: true});
    }
  }

  selectQuestion(e,index){
    console.log(index);
    }

  handleKeyDown(e) {
    // on escape toggle menu closed
    if (e.keyCode === 27) {
      this.setState({expanded: false});
    }
  }

  mouseOver(e){
    e.preventDefault()
    console.log(e)
    e.target.style.backgroundColor = "grey";
    e.target.style.color = "white";
  }

  mouseOut(e){
    console.log(e)
    e.target.style.backgroundColor = "white";
    e.target.style.color = "black";
  }

  getStyles(theme, expanded){
    var expHeight = this.props.questions && this.props.questions.length < 3 ? "" + (this.props.questions.length * (228 / 3)) + "px" : "228px"
    return {
      dropdownStyle: {
        overflow: expanded ? "scroll" : "hidden",
        display: expanded ? "block" : "none",
        height: expanded ? expHeight : "0px",
        backgroundColor: "white",
        transition: "all 0.4s",
        boxShadow: expanded ? theme.progressDropdownBoxShadow : "",
        position: "absolute",
        top: "63px",
        left: "82px",
        width: "calc(100% - 102px)",
        zIndex: "10",
        listStyleType: "none"
      },
      dropdownButton: {
        width: "calc(100% - 62px)",
        textAlign: "start",
        padding: "5px",
        dislpay: "inline-block",
        marginLeft: "10px",
        backgroundColor: "white !important",
        borderRadius: "0px",
        boxShadow: theme.progressDropdownBoxShadow,
      },
      caret: {
        float: "right"
      },
      container: {
        display: "inline-block",
      },
      icon: {
        height: "52px",
        width: "52px",
        display: "inline-block"
      },
      li: {
        borderBottom: "1px solid grey",
        padding: "10px",
        cursor: "pointer",
        zIndex: "10"
      },
      h5: {
        backgroundColor: "transparent",
        color: "inherit"
      }

    }
  }

  generateProgressText() {
    return this.props.disabled ? <b>There are {this.props.questionCount} questions</b> : <b>You are on question {this.props.currentQuestion} of {this.props.questionCount}</b>;
  }

  render(){
    var expanded = (this.state && this.state.expanded);
    var styles = this.getStyles(this.context.theme, expanded);
    var questions = this.props.questions && this.props.questions.map((question, index) => {
      return <ProgressListItem key={"list-item"+index} question={question} expanded={this.state && this.state.expanded} index={index} toggle={this.navButtonClicked} selectQuestion={this.props.selectQuestion}/>
    });
    var text = this.generateProgressText();
    return (
      <span onKeyDown={(e) => { this.handleKeyDown(e); }}>
        <img style={styles.icon}src={this.props.settings.images.ProgressIcon_svg} />
        <button id="focus" style={styles.dropdownButton} className="btn" type="button" aria-haspopup="true" aria-controls="questionsMenu" aria-expanded={expanded ? true : false} onClick={(e) => { if(!this.props.disabled) { this.navButtonClicked(e); }}}>
          <div>Progress</div>
          <span>{text}</span>
          <span style={styles.caret} className="caret"></span>
        </button>
        <div style={styles.dropdownStyle} id="questionsMenu" role="menu" aria-labelledby="focus">
          {questions}
        </div>
      </span>
    );
  }
}

ProgressDropdown.propTypes = {
  selectQuestion   : React.PropTypes.func.isRequired
};

ProgressDropdown.contextTypes = {
  theme: React.PropTypes.object
}
