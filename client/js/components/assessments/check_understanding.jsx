"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class CheckUnderstanding extends React.Component{

  start(eid, assessmentId){
    AssessmentActions.start(eid, assessmentId);
  }

  getStyles(props, theme){
    return {
      assessmentContainer:{
        marginTop: "30px",
        boxShadow: theme.assessmentContainerBoxShadow, 
        borderRadius: theme.assessmentContainerBorderRadius
      },
      header: {
        backgroundColor: theme.headerBackgroundColor
      },
      startButton: {
        margin: "3px 5px 0px -5px",
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor
      },
      checkUnderstandingButton: {
        backgroundColor: theme.maybeBackgroundColor
      },
      fullQuestion:{
        backgroundColor: theme.fullQuestionBackgroundColor,
        padding: "20px"
      },
      buttonWrapper: {
        textAlign: props.assessmentKind.toUpperCase() != "SUMMATIVE" ? "left" : "center"
      },
      attempts:{
        margin: "20px auto",
        width: "300px",
        border: "1px solid black",
        borderRadius: "4px",
        textAlign: "center"
      },
      tips:{
        paddingLeft: "-20px !important",
        margin: "20px auto",
        width: "300px",
        textAlign: "start",
      },
      attemptsContainer: {
        textAlign: "center"
      },
      swyk: {
        // posistion: "absolute",
        // top: "20px",
        // left: "20px"
        marginBottom: "25px",
        marginTop: "-25px"
      },
      icon: {
        height: "62px",
        width: "62px",
        fontColor: theme.probablyBackgroundColor
      },
      formative: {
        padding: "0px 30px 20px 30px",
        marginTop: "-20px"
      },
      data: {
        marginTop: "-5px"
      },
      checkDiv: {
        backgroundColor: theme.probablyBackgroundColor,
        margin: "20px 0px 0px 0px"
      },
      selfCheck: {
        fontSize: "140%"
      },
      h4: {
        color: "white"
      },
      images: {
        greenQuizIcon: "greenQuizIcon",
      }
    }
  }

  getAttempts(theme, styles, props){
    if(!theme.shouldShowAttempts){
      return "";
    } 
    
    if (props.userAttempts >= props.maxAttempts){
      return (
        <div style={styles.attemptsContainer}> 
          <div style={{...styles.attempts, ...{border: null}}}>
          <h1>Oops!</h1>
          <h3>You have already taken this quiz the maximum number of times</h3>  
        </div>
        <h4><u>TIPS:</u></h4>
        <div style={styles.tips}>
          <ul>
            <li>{"Right now you can do three things to make sure you are ready for the next performance assessment: review the material in this module, use the self-checks to see if you're getting it, and ask your peers or instructor for help if you need it."}</li>
            <li>{"In the future, allow enough time between your first and last quiz attempts to get help from your instructor before the last attempt!"}</li>
          </ul>
        </div>
      </div>
        )
    }
    
    return(
      <div style={styles.attemptsContainer}> 
        <div style={styles.attempts}>
          <h4>Attempt</h4>
          <h1>{this.props.userAttempts + 1}</h1>
          <h3>of {this.props.maxAttempts}</h3>
          <p>This is your 1st attempt for this outcome</p>
        </div>
      </div>)
  }

  getSWYK(styles){
    return  <div style={styles.swyk}>
              <h2>Show What You Know</h2>
              <div>This pre-test can help you decide where to focus your studying and is purely for your< /div>
              <div>information. You will not receive a grade.</div>
            </div>
  }

  getFormative(styles){

    return <div style={styles.formative}>
            <div className="row">
              <div className="col-md-1"><img style={styles.icon} src={this.props.icon} /></div>
              <div className="col-md-10" style={styles.data}>
                <div>PRIMARY OUTCOME TITLE</div>
                <div style={styles.selfCheck}><b>Self-Check</b></div>
                <div>{this.props.primaryOutcome.longOutcome}</div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-12">
                <h5 style={{color: this.context.theme.definitelyBackgroundColor}}>INTRODUCTION</h5>
                <div>Click "Check Your Understanding" to start</div>
              </div>
            </div>
            <div className="row" style={styles.checkDiv}>
              <div className="col-md-10">
                <h4 style={styles.h4}>{this.props.title}</h4>
              </div>
              <div className="col-md-2">
                <button style={{...styles.startButton, ...styles.checkUnderstandingButton}} className="btn btn-info" onClick={()=>{this.start(this.props.eid, this.props.assessmentId)}}>Start Quiz</button>
              </div>
            </div>
           </div>
  }

  render() {
    var styles = this.getStyles(this.props, this.context.theme);

    var content = "There has been an error, contact your system administrator.";
    if(this.props.assessmentKind.toUpperCase() == "SUMMATIVE"){
      content = this.getAttempts(this.context.theme, styles, this.props);
    } else if(this.props.assessmentKind.toUpperCase() == "SHOW_WHAT_YOU_KNOW"){
      content = this.getSWYK(styles);
    } else if(this.props.assessmentKind.toUpperCase() == "FORMATIVE"){
      content = this.getFormative(styles);
    }
    var startButton = (
      <div style={styles.buttonWrapper}>
        <button style={styles.startButton} className="btn btn-info" onClick={()=>{this.start(this.props.eid, this.props.assessmentId)}}>Start Quiz</button>
      </div>)
    if (this.props.userAttempts == this.props.maxAttempts && this.props.assessmentKind.toUpperCase() == "SUMMATIVE"){
      startButton = "";
    }
    if (this.props.assessmentKind.toUpperCase() == "FORMATIVE"){
      startButton = "";
    }
    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        <div className="question">
          <div className="header" style={styles.header}>
            <p>{this.props.name}</p>
          </div>
          <div className="full_question" style={styles.fullQuestion}>
            {content}
            {startButton}
          </div>
        </div>
      </div>
    );
  }

}

CheckUnderstanding.propTypes = {
  name: React.PropTypes.string.isRequired
};

CheckUnderstanding.contextTypes = {
  theme: React.PropTypes.object
};
