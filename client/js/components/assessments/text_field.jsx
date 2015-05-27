"use strict";

import React			from 'react';

export default class TextField extends React.Component{

	render(){
		return(
			<div >
				<input type="text" value={this.props.item.id} name={this.props.item.name} />
			</div>
		);
	}
}