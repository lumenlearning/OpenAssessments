"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class CheckBox extends React.Component{
  
  answerSelected(){
    AssessmentActions.answerSelected(this.props.item.id);
  }

  render(){
    return (
      <div className="btn btn-block btn-question">
        <label>
          <input type="checkbox" name={this.props.name} onClick={()=>{ this.answerSelected() }}/>
          {this.props.item.material}
        </label>
      </div>
    );
  }
}

CheckBox.propTypes = { 
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired
};
