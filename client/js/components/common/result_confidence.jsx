"use strict";

import React          from 'react';
import UniversalInput from '../assessments/universal_input';

export default class ResultConfidence extends React.Component{
  
  getStyles(props, theme){
    console.log(props.level)
    return {
      maybe: {
        marginRight: "5px",
        backgroundColor: props.level == "Just A Guess" ? theme.maybeBackgroundColor : "transparent",
        color: props.level == "Just A Guess" ? "white" : "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "5px 30px 5px 30px",
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
        padding: "5px 30px 5px 30px",
      },
      h5: {
        marginBottom: "25px"
      }
    };
  }
  render() {
    var styles = this.getStyles(this.props, this.context.theme)
    console.log(styles)
    return (
      <div>
        <h5 style={styles.h5}>Your confidence level</h5>
        <div className="confidence_wrapper" style={styles.confidenceWrapper}>
          <span style={styles.maybe}>Just A Guess</span>
          <span style={styles.probably}>Pretty Sure</span>
          <span style={styles.definitely}>Very Sure</span>
        </div>
      </div>

    );
  }

}

ResultConfidence.contextTypes = {
  theme: React.PropTypes.object
}

ResultConfidence.propTypes = {
  level: React.PropTypes.string.isRequired
}