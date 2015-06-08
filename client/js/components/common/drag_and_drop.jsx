"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import DropZone						from './drop_zone';
import Draggable					from './draggable'

export default class DragAndDrop extends React.Component{

	render(){
		var id = "dragDrop" + this.props.item.id;

		var dragDropStyle = {
			position: 'relative'
		};
		var imgStyle = {
			position: 'absolute',
			top: '0',
			right: '0'
		};
		var bankStyle = {
			display: 'block'
		};

		var drags = this.props.item.draggables.toArray();
		var banks = drags.map((item, index)=>{
			return (
				<Draggable alan={"Bank"+index} item={item} />
			)
		});

		var zones;
		if(this.props.item.type == 'key'){
			var targets = this.props.item.targets.toArray();
			zones = targets.map((item, index)=>{
				return(
						<DropZone key={"dropZone"+index} item={item} />
					)
			});
		}

		return(
			<div style={bankStyle}>

				<div id={id} style={dragDropStyle}>
					<img src={this.props.item.img} alt="Drag and Drop image" />
					{zones}
				</div>
				<div >
					{banks}
				</div>
				<hr />
				<hr />
				<hr />
				<hr />
				<hr />
				<hr />
			</div>
		)
	}
};