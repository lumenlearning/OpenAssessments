"use strict";

import React			from 'react';
import Option		from './../common/option.jsx';

export default class EdxDropDown extends React.Component{

	render(){
		debugger;
		var items = this.props.items.map((item) => {
			return <Option item={item} name="answer-option"/>;
		});
		return <select>{items}</select>;
	}
}
EdxDropDown.propTypes = {
	items: React.PropTypes.array.isRequired
};
