'use strict'

import React from 'react';
import _     from 'lodash';
import Style from './css/style.js';

export default class OutcomeSelector extends React.Component{

  constructor(props, state) {
    super(props, state)

    this.handleChange = this.handleChange.bind(this);

    this.state = this.getState();
  }

  getState() {
    let outcomes = this.props.outcomes;
    let selectedValue = outcomes[0].outcomeGuid;

    return ({
      outcomes: outcomes,
      selectedValue: selectedValue
    })
  }

  handleChange(e) {
    let selectedOption = e.target.value;

    this.setState({
      selectedValue: selectedOption
    });
  }

  render() {
    let outcomes      = this.props.outcomes;
    let selectedValue = this.state.selectedValue;
    let style         = Style.styles();

    console.log("state:", this.state)
    console.log("state outcomes:",this.state.outcomes)
    console.log("select value:",this.state.selectedValue);

    let selectOptions = outcomes.map((outcome, index) => {
      return (
        <option key={index} index={index} value={outcome.outcomeGuid}>{outcome.shortOutcome}</option>
      )
    });

    return (
      <div style={{paddingBottom: "30px"}}>
        <label for="outcome-select">
          <span style={style.label}>Outcome </span>
          <select
            id="outcome-select"
            name="outcome-select"
            style={style.outcomeSelect}
            value={selectedValue}
            onChange={(event) => this.props.handleOutcomeChange(event)}
            >
              {selectOptions}
          </select>
        </label>
      </div>
    )
  }

}
