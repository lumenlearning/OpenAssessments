"use strict";

import React from 'react';

export default class WaitModal extends React.Component {

  constructor(props) {
    super(props);

    this.escFunction = this.escFunction.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.background}>
        <div style={styles.container}>
          <div style={styles.titleBar}>
            <h1 style={styles.titleHeader}>Wait!</h1>
            <img
              style={styles.close}
              src="/assets/x_to_close_light.png"
              data-expandable-status={"disabled"}
              onClick={() => {this.props.hideModal()}}
              />
          </div>
          <div style={styles.body}>
            <p style={styles.bodyText}>
              {this.props.bodyContent}
            </p>
          </div>
          <div style={styles.footer}>
            <div style={styles.buttonGroup}>
              <button
                style={styles.startButton}
                onClick={() => this.props.startAssessment()}
                >
                  Start Quiz
                </button>
              <button
                style={styles.studyButton}
                onClick={() => this.props.studyMore()}
                >
                  Study More
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.hideModal();
    }
  }

  getStyles() {
    return {
      background: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        height: "100%",
        left: 0,
        overflow: "auto",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: "2"
      },
      container: {
        backgroundColor: "#fff",
        borderRadius: "6px",
        boxShadow: "0 2px 16px 0 rgba(33, 43, 54, 0.08), 0 31px 41px 0 rgba(33, 43, 54, 0.2)",
        margin: "12% auto",
        maxWidth: "620px",
        minHeight: "311px"
      },
      titleBar: {
        position: "relative",
        padding: "40px",
        borderBottom: "1px solid #ccc"
      },
      titleHeader: {
        fontSize: "20px",
        fontWeight: 600,
        margin: 0
      },
      close: {
        position: "absolute",
        top: "50px",
        right: "50px",
        width: "15px",
        height: "15px",
        cursor: "pointer"
      },
      body: {
        padding: "40px"
      },
      bodyText: {
        fontSize: "14px",
        color: "#212b36"
      },
      footer: {
        padding: "10px 40px 40px"
      },
      buttonGroup: {
        display: "flex",
        justifyContent: "flex-end"
      },
      startButton: {
        color: "#fff",
        backgroundColor: "#1E72CD",
        border: "1px solid #004C9F",
        borderRadius: "3px",
        marginBottom: 0,
        padding: "10px 0.75rem",
        fontSize: "14px",
        fontWeight: "400",
        height: "40px",
        minWidth: "97px"
      },
      studyButton: {
        marginLeft: "8px",
        color: "#fff",
        backgroundColor: "#1E72CD",
        border: "1px solid #004C9F",
        borderRadius: "3px",
        marginBottom: 0,
        padding: "10px 0.75rem",
        fontSize: "14px",
        fontWeight: "400",
        height: "40px",
        minWidth: "97px"
      }
    }
  }
}
