"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import DropZone					from './drop_zone';

export default class DragAndDrop extends React.Component{
	//
	//allowDrop(ev) {
	//	ev.preventDefault();
	//}
	//
	//drag(ev) {
	//	ev.dataTransfer.setData("text", ev.target.id);
	//}
	//
	//drop(ev) {
	//	ev.preventDefault();
	//	var data = ev.dataTransfer.getData("text");
	//	ev.target.appendChild(document.getElementById(data));
	//}

	render(){
		//debugger;
		//var item = '';
		var zones = this.props.item.draggables.map((item)=>{
			return <DropZone item={item} />;
		});

		if(this.props.item.type == 'key'){

		}

		return(
			<div>
				<img src={this.props.item.img} alt="Drag and Drop image" />
				{zones};
			</div>
		)
	}
};