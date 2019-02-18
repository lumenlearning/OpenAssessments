"use strict";

import React from 'react';

export default class StudySummary extends React.Component {

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.componentWrapper}>
        <div style={styles.tableColumn}>
          <div style={styles.columnHeaderOne}>
            <h3 style={styles.columnHeader}>Recommended Studying</h3>
          </div>
          <div style={styles.listWrapper}>
            <ul style={styles.list}>
              <li style={styles.item}>
                <p style={styles.itemTitle}>The Evolution of Psychology</p>
                <p style={styles.itemCorrect}>0 of 2 correct</p>
              </li>
              <li style={styles.item}>
                <p style={styles.itemTitle}>Careers in Psychology</p>
                <p style={styles.itemCorrect}>1 of 2 correct</p>
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.tableColumn}>
          <div style={styles.columnHeaderTwo}>
            <h3 style={styles.columnHeader}>Mastered Concepts</h3>
          </div>
          <div style={styles.listWrapper}>
            <ul style={styles.list}>
              <li style={styles.item}>
                <p>Psychological Foundations</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  getStyles() {
    return {
      componentWrapper: {
        display: "flex",
        flexDirection: "row"
      },
      tableColumn: {
        width: "50%",
        marginRight: "2px"
      },
      columnHeaderOne: {
        borderBottom: "2px solid #ad4646"
      },
      columnHeaderTwo: {
        borderBottom: "2px solid #108043"
      },
      columnHeader: {
        fontSize: "14px",
        fontWeight: "bold",
        margin: "12px 0"
      },
      listWrapper: {
        margin: "12px 0 24px"
      },
      list: {
        listStyle: "none",
        padding: 0
      },
      item: {
        marginBottom: "20px"
      },
      itemTitle: {
        margin: "0 0 4px 0"
      },
      itemCorrect: {
        color: "#637381",
        fontSize: "12px",
        margin: 0
      }
    }
  }
}
