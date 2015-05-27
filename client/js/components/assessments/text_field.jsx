"use strict";

import React			from 'react';

export default class TextField extends React.Component{
	render(){ //Placeholder, I want a canvas text block here
		return(
			<div >
				<input type="text" value="PlaceHolder" />
			</div>
		);
	}
}