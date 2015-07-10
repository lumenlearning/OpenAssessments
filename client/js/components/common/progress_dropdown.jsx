"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import BaseComponent      from "../base_component";
export default class ProgressDropdown extends BaseComponent{
  
  constructor(props, context){
    super(props, context);
    this._bind("navButtonClicked");

  }

  answerSelected(){
    AssessmentActions.answerSelected(this.props.item);
  }

  navButtonClicked(){
    if(this.state && this.state.expanded){
      this.setState({expanded: !this.state.expanded})
    } else {
      this.setState({expanded: true});
    }
    
  }

  getStyles(theme, expanded){
    return {
      dropdownStyle: {
        overflow: "hidden",
        height: expanded ? "200px" : "0px",
        backgroundColor: "white",
        transition: "all 0.4s",
        borderRadius: "4px",
        boxShadow: expanded ? theme.assessmentContainerBoxShadow : "",
        position: "absolute",
        top: "65px",
        left: "82px",
        width: "calc(100% - 103px)",
        zIndex: "10",
        listStyleType: "none"
      },
      dropdownButton: {
        width: "calc(100% - 62px)",
        textAlign: "start",
        hover: "none !important",
        padding: "5px",
        dislpay: "inline-block",
        marginLeft: "10px"
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
        dislay: "inline-block"
      },
      li: {
        borderBottom: "1px solid grey"
      }

    }
  }
  render(){
    var expanded = (this.state && this.state.expanded);
    var styles = this.getStyles(this.context.theme, expanded);
    var questions = this.props.questions.map((question, index)=>{
      return(  
              <li style={styles.li} key={"li" + index}>
                <h5>Question {index + 1}</h5>
                <a href="#">{question.material}</a>
              </li>)
    })
    return (
      <span >
        <img style={styles.icon}src={require("../../../../app/assets/fonts/ProgressIcon.svg")} />
        <button style={styles.dropdownButton} className="btn btn-default dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="true" onClick={()=>{this.navButtonClicked()}}>
          <div>Progress</div>
          <span><b>You are on question {this.props.currentQuestion} of {this.props.questionCount}</b></span>
          <span style={styles.caret} className="caret"></span>
        </button>
        <ul style={styles.dropdownStyle}aria-labelledby="dropdownMenu1">
          {questions}
        </ul>
      </span>
    );
  }
}

ProgressDropdown.propTypes = { 

};

ProgressDropdown.contextTypes = {
  theme: React.PropTypes.object
}