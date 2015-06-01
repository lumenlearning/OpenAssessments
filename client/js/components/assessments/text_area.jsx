"use strict";

import React			from 'react';

export default class TextField extends React.Component{

	render(){
		return(
			<div>
				<textarea className="form-control" rows="4"></textarea>
			</div>
		);
	}
}