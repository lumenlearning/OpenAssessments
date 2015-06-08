"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import DropZone						from './drop_zone';
import Draggable					from './draggable'

export default class DragAndDrop extends React.Component{

	render(){
		var drags = this.props.item.draggables.toArray();
		var zones = drags.map((item)=>{
			return (
				<div>
					<DropZone item={item} />
			  	<Draggable item = {item} />
				</div>
			)
		});

		if(this.props.item.type == 'key'){

		}

		return(
			<div>
				<img src={this.props.item.img} alt="Drag and Drop image" />
				{zones}
			</div>
		)
	}
};