"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import Draggable				from './draggable';

export default class DropZone extends React.Component{

	render() {
		return(
			<div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)">

			</div>
		)
	}
};
