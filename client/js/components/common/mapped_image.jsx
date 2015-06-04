"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';

export default class MappedImage extends React.Component{

	render(){
		var str = "mappedImg" + this.props.item.id;
		var mapName = "#" + str;
		var coordStr = this.props.item.coordinates.toString();

		return(
			<div>
				<img src={this.props.item.material} width={this.props.item.width} height={this.props.item.height}
						 alt={str} useMap={mapName} />
				<map name={str}>
					<area shape="rect" coords={coordStr} onClick={()=>{}} />
				</map>
			</div>
		)
	}
};
MappedImage.propTypes = {
	item: React.PropTypes.object.isRequired
};