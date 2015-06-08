"use strict";

import React								from 'react';
import AssessmentActions		from '../../actions/assessment';

export default class Draggable extends React.Component{

	render(){
		return (
			<div draggable="true" ondragstart="drag(event)" id={this.props.item.id} width="88" height="31"> {this.props.item.label} </div>
		)
	}
}
Draggable.propTypes={
	label: React.PropTypes.string.isRequired
};