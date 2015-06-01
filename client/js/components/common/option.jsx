"use strict";

import React							from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class Option extends React.Component{

	answerSelected(){
		AssessmentActions.answerSelected(this.props.item.id);
	}
	render(){
			return(
			<div>
					<option value={this.props.item} onClick={()=>{ this.answerSelected() }} >{this.props.item}</option>
			</div>
		);
	}
}
Option.propTypes = {
	item: React.PropTypes.object.isRequired
};