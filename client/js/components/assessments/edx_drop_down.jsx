"use strict";

import React			from 'react';
import Option		from './../common/option.jsx';

export default class EdxDropDown extends React.Component{

	render(){
		var items = this.props.items.map((item) => {
					return <Option item={item} name="answer-option"/>;
		});
		return <div>{items}</div>;
	}
}
EdxDropDown.propTypes = {
	items: React.PropTypes.array.isRequired
};
