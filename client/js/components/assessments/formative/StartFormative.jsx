"use strict";

// Dependencies
import React from "react";

// Formative Assessment Start Page
export default class StartFormative extends React.Component {
  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.formative}>
        <div className="row"></div>
        <div className="row" style={styles.checkDiv}>
          <div className="col-md-10 col-sm-9">
            <h4 style={styles.h4}>{this.props.title}</h4>
          </div>
          <div className="col-md-2 col-sm-3">
            {this.props.startButton}
          </div>
        </div>
     </div>
    );
  }

  getStyles() {
    return {
      checkDiv: {
        backgroundColor: this.props.theme.primaryBackgroundColor,
        margin: "20px 0px 0px 0px"
      },
      formative: {
        padding: "0px",
        marginTop: "-20px"
      },
      h4: {
        color: "white"
      }
    };
  }
}
