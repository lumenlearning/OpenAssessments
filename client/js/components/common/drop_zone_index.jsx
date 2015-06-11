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
	}

	drop(ev) {
		ev.preventDefault();
		var rect = ev.target.getBoundingClientRect();
		var data = ev.dataTransfer.getData("text");
		var obj = document.getElementById(data);
		ev.currentTarget.appendChild(obj);
		document.getElementById(data).setAttribute('style', 'position:absolute; top:'+
			((this.y-rect.top) - Number(obj.getAttribute('offsetY')))+'px; left:'+
			((this.x-rect.left) - Number(obj.getAttribute('offsetX')))+'px; ');
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