"use strict";

import React			from 'react';

export default class TextField extends React.Component{
	render(){ //Placeholder, I want a canvas text block here
		return(
			<div >
				<textarea class="form-control" rows="3"></textarea>
			</div>
		);
	}
}