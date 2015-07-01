"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class CheckUnderstanding extends React.Component{

  start(){
    AssessmentActions.start();
  }

  getStyles(theme){
    return {
      assessmentContainer:{
        marginTop: "70px",
        boxShadow: theme.assessmentContainerBoxShadow, 
        borderRadius: theme.assessmentContainerBorderRadius
      },
      header: {
        backgroundColor: theme.headerBackgroundColor
      },
      startButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor
      },
      fullQuestion:{
        backgroundColor: theme.fullQuestionBackgroundColor
      },
    }
  }

  getAttempts(theme){

  }

  render() {
    var styles = this.getStyles(this.context.theme);
    var attempts = this.getAttempts(this.context.theme);
    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        <div className="question">
          <div className="header" style={styles.header}>
            <p>{this.props.name}</p>
          </div>
          <div className="full_question" style={styles.fullQuestion}>
            <div className="enable_start">
              <button className="btn btn-info" onClick={()=>{this.start()}}>Start Quiz</button>
            </div>
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
