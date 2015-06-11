"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import Draggable				from './draggable';

export default class DropZone extends React.Component{

	allowDrop(ev) {
		ev.preventDefault();
	}

	drop(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		ev.target.appendChild(document.getElementById(data));
	}


	render() {
		//TODO move style out of here, maybe
		var divStyle = {
			position: 'absolute',
			width: this.props.item.width.toString(),
			height: this.props.item.height.toString(),
			top: this.props.item.yPos.toString(),
			left: this.props.item.xPos.toString(),
			border: '1px solid #aaaaaa'
		};
		var id = "zone" + this.props.item.id;


		return(
			<div className="dropZone" id={id} onDrop={(e)=>{
			if(!(this.props.item.onePerTarget && document.getElementById(id).hasChildNodes())) this.drop(e);
			}} onDragOver={(e)=>{
			  if(!(this.props.item.onePerTarget && document.getElementById(id).hasChildNodes())) this.allowDrop(e);
			}} style ={divStyle}></div>
		)
	}
};
DropZone.propTypes = {
	item: React.PropTypes.object.isRequired
};
