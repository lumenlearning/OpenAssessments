"use strict";

import React from 'react';

export default class FeedbackPill extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let styles = this.getStyles();

    return (
      <span style={styles.pill}>
        {this.getFeedback(this.props.score)}
      </span>
    );
  }

  getFeedback(score) {
    if (100 === score) {
      return 'Good Work';
    } else {
      return 'Needs Work';
    }
  }

  getStyles() {
    return {
      pill: {
        backgroundColor: 100 === this.props.score ? "#108043" : "#c05717",
        borderRadius: "19.5px",
        color: "#fff",
        fontSize: "12px",
        height: "28px",
        marginRight: "33px",
        padding: "6px 13px",
        width: "97px"
      }
    }
  }
}
