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
		ev.target.appendChild(document.getElementById(data));
		console.log(data);
	}

	drag(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
		console.log('im being drug');
	}

	render(){
		//TODO move style out of here, maybe
		var divStyle = {
			float: 'left',
			margin: '10px',
			padding: '10px',
			border: '1px solid #aaaaaa',
			diplay: 'inline'
		};
		var id = "zone" + this.props.item.id;


		return (
			<div id={id} onDrop={(e)=>{this.drop(e)}} onDragOver={(e)=>{this.allowDrop(e)}} style={divStyle}>
				<div draggable="true" onDragStart={(e)=>{this.drag(e)}} id={this.props.item.id + this._reactInternalInstance._rootNodeID} width="88" height="31"> {this.props.item.label} </div>
			</div>
		)
	}
}
Draggable.propTypes={
	item: React.PropTypes.object.isRequired
};