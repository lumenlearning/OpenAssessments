"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';
import DropZone						from './drop_zone';
import Draggable					from './draggable';
import DropZoneIndex			from './drop_zone_index';

export default class DragAndDrop extends React.Component{

	render(){
		var id = "dragDrop" + this.props.item.id;

		var dragDropStyle = {
			position: 'relative',
			display: 'block',
			clear: 'both'
		};

		var banks = this.props.item.draggables.map((item, index)=>{
			return (
				<Draggable key={"Bank"+index} item={item} />
			)
		});

		if(this.props.item.type == 'key'){
			var zones = this.props.item.targets.map((item, index)=>{
				return(
						<DropZone key={"dropZone"+index} item={item} />
					)
			});
			return(
				<div>

					<div id={id} style={dragDropStyle}>
						<img src={this.props.item.img} alt="Drag and Drop image" />
						{zones}
					</div>
					<div >
						{banks}
					</div>
				</div>
			)
		}
		else if (this.props.item.type == 'index'){
			return (
				<div style={dragDropStyle}>
					<DropZoneIndex item={this.props.item}/>
					{banks}

				</div>
		);
		}
		else{
			return <p>Error: Type undefined</p>
		}
	}
};

DragAndDrop.propTypes = {
	item: React.PropTypes.object.isRequired
};