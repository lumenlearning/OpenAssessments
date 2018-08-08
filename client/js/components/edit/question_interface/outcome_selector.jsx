'use strict'

import React from 'react';
import _     from 'lodash';
import Style from './css/style.js';

export default class OutcomeSelector extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let selectedOutcome = _.find(this.props.outcomes, { 'outcomeGuid': e.target.value });
    this.props.onChange(selectedOutcome);
  }

  render() {
    let style = Style.styles();

    return (
      <div style={{paddingBottom: "30px", display: 'flex', justifyContent:'space-between'}}>
        <label for="outcome-select" >
          <span style={style.label}>Outcome </span>
          <select
            id="outcome-select"
            name="outcome-select"
            style={style.outcomeSelect}
            defaultValue={this.props.isNew ? "select-an-outcome" : this.props.selectedOutcome.outcomeGuid}
            onChange={this.handleChange}
            >
            <option disabled="disabled" value={"select-an-outcome"}>Select an outcome</option>
            {this.props.outcomes.map((outcome, index) => {
                return (
                  <option key={index} index={index} value={outcome.outcomeGuid}>{outcome.longOutcome}</option>
                )
              })}
          </select>
        </label>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }

}
