"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";

export default class CheckBox extends React.Component{
  
  answerSelected(){
    AssessmentActions.answerSelected(this.props.item);
  }

  render(){
    var checked = (AssessmentStore.studentAnswers() && AssessmentStore.studentAnswers().indexOf(this.props.item.id) > -1) ? "true" : null;
    return (
      <div className="btn btn-block btn-question">
        <label>
          <input type="checkbox" defaultChecked={checked} name={this.props.name} onClick={()=>{ this.answerSelected() }}/>
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
