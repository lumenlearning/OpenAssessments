"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import DropZone						from './drop_zone';
import Draggable					from './draggable'

export default class DragAndDrop extends React.Component{

	render(){
		var drags = this.props.item.draggables.toArray();
		var banks = drags.map((item)=>{
			return (
				<div>
					<Draggable item={item} />
				</div>
			)
		});

		var zones;
		if(this.props.item.type == 'key'){

		}

		return(
			<div>
				<img src={this.props.item.img} alt="Drag and Drop image" />
				{banks}
			</div>
		)
	}
};