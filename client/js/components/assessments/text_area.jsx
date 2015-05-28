"use strict";

import React			from 'react';

export default class TextField extends React.Component{

	render(){ //Placeholder, I want a canvas text block here
		return(
			<div>
				<textarea className="form-control" rows="4"></textarea>
			</div>
		);
	}
}