"use strict";

import React          from 'react';

export default class ResultOutcome extends React.Component{
  
  getStyles(props, theme){

    return {
      resultOutcome: {
        marginRight: "5px",
        backgroundColor: "whitesmoke",
        color: props.level == "Just A Guess" ? "white" : "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "5px 15px 5px 15px",
      },
      probably:{
        marginRight: "5px",
        backgroundColor: props.level == "Pretty Sure" ? theme.probablyBackgroundColor : "transparent",
        color: props.level == "Pretty Sure" ? "white" : "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "5px 30px 5px 30px",
      },
      definitely: {
        marginRight: "5px",
        backgroundColor: props.level == "Very Sure" ? theme.definitelyBackgroundColor : "transparent",
        color: props.level == "Very Sure" ? "white" : "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "20px",
      },
      h5: {
        marginBottom: "25px"
      }
    };
  }
  render() {
    var styles = this.getStyles(this.props, this.context.theme)
    var text = this.props.correct === true ? "Covers this concept:" : "Review this concept:";
    console.log(this.props.outcomes)
    return (
      <div>
        <div style={styles.resultOutcome}>
          <div>{text}</div>
          <h5><b>{this.props.outcomes.shortOutcome}</b></h5>
          <div>{this.props.outcomes.longOutcome}</div>
        </div>
      </div>

    );
  }

}

ResultOutcome.contextTypes = {
  theme: React.PropTypes.object
}

ResultOutcome.propTypes = {
  level: React.PropTypes.string.isRequired
}