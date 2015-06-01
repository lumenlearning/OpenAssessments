"use strict";

import React			from 'react';
import Option		from './../common/option.jsx';

export default class EdxDropDown extends React.Component{

	render(){
		var answers = this.props.items.toArray();
		var items = answers.map((item) => {
			var materialItems = item.material.map((mats) =>{
					return <Option item={mats} name="answer-option"/>;
				});
				return materialItems;
		});
		return <select>{items}</select>;
	}
}
EdxDropDown.propTypes = {
	items: React.PropTypes.array.isRequired
};
