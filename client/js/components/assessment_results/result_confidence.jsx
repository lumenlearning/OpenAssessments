"use strict";

import React          from 'react';

export default class ResultConfidence extends React.Component{
  
  getStyles(props, theme){

    return {
      maybe: {
        marginRight: "5px",
        display: "inline-block",
        backgroundColor: props.level == "Just A Guess" ? theme.maybeBackgroundColor : "transparent",
        color: props.level == "Just A Guess" ? "white" : "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "5px 30px 5px 30px",
      },
      probably:{
        display: "inline-block",
        marginRight: "5px",
        backgroundColor: props.level == "Pretty Sure" ? theme.probablyBackgroundColor : "transparent",
        color: props.level == "Pretty Sure" ? "white" : "black",
        border: props.isCorrect ? "none" : "1px solid rgba(0,0,0,0.2)",
        borderRadius : "4px",
        padding: "5px 30px 5px 30px",
      },
      definitely: {
        display: "inline-block",
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
    var styles = this.getStyles(this.props, this.context.theme);

    return (
      <div >
        <h5 style={styles.h5} tabIndex="0" aria-label={"Your confidence level was " + this.props.level}>Your confidence level</h5>
        <div>
          <div style={styles.maybe}>Just A Guess</div>
          <div style={styles.probably}>Pretty Sure</div>
          <div style={styles.definitely}>Very Sure</div>
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