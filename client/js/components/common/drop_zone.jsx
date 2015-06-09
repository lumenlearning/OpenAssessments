"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import DropLabels					from './drop_labels';

export default class DropZone extends React.Component{
		//function allowDrop(ev) {
		//	ev.preventDefault();
		//}
		//
		//function drag(ev) {
		//	ev.dataTransfer.setData("text", ev.target.id);
		//}
		//
		//function drop(ev) {
		//	ev.preventDefault();
		//	var data = ev.dataTransfer.getData("text");
		//	ev.target.appendChild(document.getElementById(data));
		//}

	render() {
		return(
			<div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)">
				<span class="label label-default" draggable="true" ondragstart="drag(event)">{this.props.label}</span>
			</div>
		)
	}
};
