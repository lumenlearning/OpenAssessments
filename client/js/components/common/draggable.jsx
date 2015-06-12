"use strict";

import React								from 'react';
import AssessmentActions		from '../../actions/assessment';

export default class Draggable extends React.Component{

	allowDrop(ev) {
		ev.preventDefault();
	}

	drop(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		document.getElementById(data).removeAttribute('style');
		ev.target.appendChild(document.getElementById(data));
	}

	drag(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
		var rect = ev.target.getBoundingClientRect();
		ev.currentTarget.setAttribute('offsetX', (event.clientX - rect.left).toString());
		ev.currentTarget.setAttribute('offsetY', (event.clientY - rect.top).toString());
	}

	render(){
		//TODO move style out of here, maybe
		var draggableStyle = {
			float: 'left',
			margin: '10px',
			padding: '10px',
			border: '1px solid #aaaaaa',
			display: 'inline',
			zIndex: '2'
		};
		var id = "zone" + this.props.item.id;


		return (
			<div className="dropZone" id={id} onDrop={(e)=>{this.drop(e)}} onDragOver={(e)=>{document.getElementById(id).hasChildNodes() ? e.stopPropagation() : this.allowDrop(e)}} style={draggableStyle}>
				<div className="draggable" draggable="true" onDragOver={(e)=>{e.stopPropagation()}} onDrop={(e)=>{e.stopPropagation()}} onDragStart={(e)=>{this.drag(e)}}
						 id={this.props.item.id + this._reactInternalInstance._rootNodeID} width="88" height="31">
					{this.props.item.label}
				</div>
			</div>
		)
	}
}
Draggable.propTypes={
	item: React.PropTypes.object.isRequired
};