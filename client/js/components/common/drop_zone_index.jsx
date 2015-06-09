"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import Draggable				from './draggable';

export default class DropZone extends React.Component{

	allowDrop(ev) {
		ev.preventDefault();
		console.log('You can drop here');
	}

	drop(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		ev.target.appendChild(document.getElementById(data));
	}


	render() {
		//TODO move style out of here, maybe
		var divStyle = {
			//position: 'absolute',
			//float: 'left',
			//display: 'inline',
			border: '1px solid #aaaaaa'
		};
		var id = "zone" + this.props.item.id;

		return(
			<div className="ClassyAsFu" id={id} onDrop={(e)=>{this.drop(e)}} onDragOver={(e)=>{this.allowDrop(e)}} style ={divStyle}>
				<img src={this.props.item.img} alt="Drag and Drop image" />
			</div>
		)
	}
};
DropZone.propTypes = {
	item: React.PropTypes.object.isRequired
};