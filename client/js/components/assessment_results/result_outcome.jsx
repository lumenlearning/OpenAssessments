"use strict";

import React          from 'react';

export default class ResultOutcome extends React.Component{
  
  getStyles(props, theme){

    return {
      resultOutcome: {
        marginRight: "5px",
        backgroundColor: "whitesmoke",
        color: "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "5px 15px 5px 15px",
      },
      probably:{
        marginRight: "5px",
        backgroundColor: props.level == "Pretty Sure" ? theme.probablyBackgroundColor : "transparent",
        color: "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "5px 30px 5px 30px",
      },
      definitely: {
        marginRight: "5px",
        backgroundColor: props.level == "Very Sure" ? theme.definitelyBackgroundColor : "transparent",
        color: "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "20px",
      },
      h5: {
        marginBottom: "25px"
      }
    };
  }

  renderText() {
    if (this.props.correct === true) {
      return "Covers this concept:"
    } else if (this.props.correct === "teacher_preview") {
      return "Learning outcome:"
    } else {
      return "Review this concept:"
    }
  }

  render() {
    var styles = this.getStyles(this.props, this.context.theme)
    return (
      <div tabIndex="0">
        <div style={styles.resultOutcome}>
          <div>{this.renderText()}</div>
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