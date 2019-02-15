"use strict";

import React from 'react';

export default class AttemptTime extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let styles = this.getStyles();
    return (
      <p style={styles.date}>
        {this.parseDate(this.props.time)}
      </p>
    );
  }

  parseDate(date) {
    let theDate = new Date(Date.parse(date));
    let formattedDate = `${theDate.getMonth()}/${theDate.getDate()}/${theDate.getFullYear()}`;
    let formattedTime = `${theDate.getHours()}:${theDate.getMinutes()}`;

    return `${formattedDate}, ${formattedTime}`;
  }

  getStyles() {
    return {
      date: {
        color: "#637381",
        fontSize: "12px",
        marginTop: "4px"
      }
    }
  }
}
