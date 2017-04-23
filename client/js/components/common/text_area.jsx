"use strict";

import React			        from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";

export default class TextArea extends React.Component{
  constructor(props) {
    super(props);

  }//constructor

	render(){
		return(
			<div>
				<textarea
          className="form-control"
          rows="4"
          placeholder="Write your essay response here"
          onChange={(e) => AssessmentActions.answerSelected(e.target.value)}
          defaultValue={this.props.initialText}
        />
			</div>
		);
	}

  handleChange(e) {

  }//handleChange

}