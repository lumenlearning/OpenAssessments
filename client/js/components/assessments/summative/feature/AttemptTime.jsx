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
    let formattedTime = `${theDate.getHours() > 12 ? theDate.getHours() - 12 : theDate.getHours()}:${theDate.getMinutes()}`;
    let timeSuffix = `${theDate.getHours() >= 12 ? 'pm' : 'am' }`

    return `${formattedDate}, ${formattedTime} ${timeSuffix}`;
  }

  getStyles() {
    return {
      date: {
        color: "#637381",
        fontSize: "12px",
        margin: "4px 0 0"
      }
    }
  }
}
