"use strict";

import React								from 'react';
import AssessmentActions		from '../../actions/assessment';

export default class Draggable extends React.Component{

	render(){

		//TODO move style out of here, maybe
		var divStyle = {
			float: 'left',
			width: '100px',
			height: '35px',
			margin: '10px',
			padding: '10px',
			border: '1px solid #aaaaaa'
		};
		var id = "zone" + this.props.item.id;

		function allowDrop(ev) {
			ev.preventDefault();
		}

		function drop(ev) {
			ev.preventDefault();
			var data = ev.dataTransfer.getData("text");
			ev.target.appendChild(document.getElementById(data));
		}

		function drag(ev) {
			ev.dataTransfer.setData("text", ev.target.id);
		}

		return (
			<div id={id} ondrop="drop(event)" ondragover="allowDrop(event)" style ={divStyle}>
				<div draggable="true" ondragstart="drag(event)" id={this.props.item.id} width="88" height="31"> {this.props.item.label} </div>
			</div>
		)
	}
}
Draggable.propTypes={
	item: React.PropTypes.object.isRequired
};