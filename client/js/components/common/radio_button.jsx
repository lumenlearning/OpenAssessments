"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";

export default class RadioButton extends React.Component{
  
  answerSelected(){
    AssessmentActions.answerSelected(this.props.item);
  }

  render(){
    var checked = (this.props.item.id == AssessmentStore.studentAnswers()) ? "true" : null;

    return (
      <div className="btn btn-block btn-question">
        <label>
          <input type="radio" defaultChecked={checked} name={this.props.name} onClick={()=>{ this.answerSelected() }}/>
          {this.props.item.material}
        </label>
      </div>
    );
  }
}

RadioButton.propTypes = { 
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired
};
