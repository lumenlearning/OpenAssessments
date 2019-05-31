"use strict";

import React			from 'react';

export default class TextField extends React.Component{

	render(){
		return(
			<div>
			  {this.props.item.material}
				<input type="text" className="form-control" />
			</div>
		);
	}
}
TextField.propTypes = {
	item : React.PropTypes.object.isRequired
};