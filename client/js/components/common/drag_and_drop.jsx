"use strict";

import React							from 'react';
import AssessmentActions	from '../../actions/assessment';

export default class DragAndDrop extends React.Component{

	render(){
		if(this.props.item.type == 'key'){

		}
		return(
			<img src={this.props.item.img} alt="Drag and Drop image" />
		)
	}
};