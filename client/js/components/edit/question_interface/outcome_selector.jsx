'use strict'

import React from 'react';
import Style from './css/style.js';

export default class OutcomeSelector extends React.Component{

  constructor(props) {
    super(props)
  }

  render() {
    let outcomes = this.props.outcomes;
    let style    = Style.styles();

    return (
      <div style={{paddingBottom: "30px"}}>
        <label for="outcome-select">
          <span style={style.label}>Outcome </span>
          <select id="outcome-select" name="outcome-select" style={style.outcomeSelect}>
            {outcomes.map((outcome, index) => {
              return (
                <option key={index} value={outcome.outcomeGuid}>{outcome.shortOutcome}</option>
              )
            })}
          </select>
        </label>
      </div>
    )
  }

}
