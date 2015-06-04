"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class Matching extends React.Component{

  answerSelected(){
    AssessmentActions.answerSelected(this.props.item.id);
  }



  render(){
    var items = this.props.item.material.split(",");
    var materialItems = items.map((mat) =>{
      return <option value={mat} name={this.props.name}>{mat}</option>;
    });

    return(
      <div>
        {this.props.item.matchMaterial}
        <select>
          {materialItems}
        </select>
      </div>
    );
  }
}
Matching.propTypes = {
  item: React.PropTypes.object.isRequired
};