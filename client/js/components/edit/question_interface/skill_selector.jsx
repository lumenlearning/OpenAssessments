'use strict';

import React from 'react';
import _     from 'lodash';
import Style from './css/style.js';

export default class SkillSelector extends React.Component {

  constructor(props, state) {
    super(props, state);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let selectedSkill = _.find(this.props.skills, { 'skillGuid': e.target.value });
    this.props.onChange(selectedSkill);
  }

  render() {
    let style = Style.styles();

    return (
      <div style={{paddingBottom: "30px", display: 'flex', justifyContent:'space-between'}}>
        <label for="skill-select" >
          <span style={style.label}>Sub-Outcome </span>
          <select
            id="skill-select"
            name="skill-select"
            style={style.outcomeSelect}
            defaultValue={this.props.isNew ? "select-a-skill" : this.props.selectedSkill.skillGuid}
            onChange={this.handleChange}
            >
            <option disabled="disabled" value={"select-a-skill"}>Select a Skill</option>
            {this.props.skills.map((skill, index) => {
              return (
                <option key={index} index={index} value={skill.skillGuid}>{skill.skillLongOutcome}</option>
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
