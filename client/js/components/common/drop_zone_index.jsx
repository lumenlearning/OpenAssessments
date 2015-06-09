"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import Draggable				from './draggable';

export default class DropZone extends React.Component{

	constructor(){
		super();
		this.x = 0;
		this.y = 0;
	}

	allowDrop(ev) {
		ev.preventDefault();
		this.x = event.clientX;
		this.y = event.clientY;
		console.log(ev.clientX, + ' ' + ev.clientY);
	}

	drop(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		ev.currentTarget.appendChild(document.getElementById(data));
		document.getElementById(data).setAttribute('style', 'top:'+this.y+'; left:'+this.x+'; position: fixed; ');
	}


	render() {
		//TODO move style out of here, maybe
		var dropZoneIndexStyle = {
			border: '1px solid #aaaaaa',
			position: 'relative'
		};
		var dropZoneImageStyle={
			zIndex: '-1'
		};
		var id = "zone" + this.props.item.id;

		return(
			<div id={id} onDrop={(e)=>{this.drop(e)}} onDragOver={(e)=>{this.allowDrop(e)}} style ={dropZoneIndexStyle}>
				<img src={this.props.item.img} alt="Drag and Drop image" style={dropZoneImageStyle} />
			</div>
		)
	}
};
DropZone.propTypes = {
	item: React.PropTypes.object.isRequired
};