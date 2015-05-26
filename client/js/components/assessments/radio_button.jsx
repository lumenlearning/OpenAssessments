"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class RadioButton extends React.Component{
  
  answerSelected(){
    AssessmentActions.answerSelected(this.props.item.id);
  }

  render(){
    return (
      <div className="btn btn-block btn-question">
        <label className="radio">
          <input type="radio" value={this.props.item.id} name={this.props.item.name} onClick={()=>{ this.answerSelected() }}/>
          {this.props.item.material}
        </label>
      </div>
    );
  }
}
