"use strict";

import React							from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class Option extends React.Component{

  answerSelected(){
    //AssessmentActions.answerSelected(this.props.item.id);
  }

  getStyles(theme){
    return {

    }
  }

  render(){
    var styles = this.getStyles(this.context.theme)
    
    var materialItems = this.props.item.material.map((mat) =>{
          return <option value={mat} name={this.props.name}>{mat}</option>;
    });

    return(
      <div>
		    <select onChange={()=>{this.answerSelected()}}>
          {materialItems}
        </select>
      </div>
    );
  }
}
Option.propTypes = {
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired
};