"use strict";

import React								from 'react';
import AssessmentActions		from '../../actions/assessment';

export default class DropLabels extends React.Component{

	render(){
		return (
			<label draggable="true" ondragstart="drag(event)" >{this.props.label}</label>
		)
	}
}
DropLabels.propTypes={
	label: React.PropTypes.string.isRequired
};