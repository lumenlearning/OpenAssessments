"use strict";

import React			        from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import Styles             from "../../themes/selection.js";

const styles = Styles;

export default class TextArea extends React.Component{
  constructor(props) {
    super(props);

  }//constructor

  answerFeedback() {
    return (
      <div className="check_answer_result" style={styles.feedbackNeutral}>
        Sorry there's no feedback for this question, please reach out to your teacher with any questions.
      </div>
    );
  }

	render(){
		return(
			<div>
				<textarea
          className="form-control"
          rows="4"
          placeholder="Write your essay response here"
          onChange={(e) => AssessmentActions.answerSelected(e.target.value)}
          defaultValue={this.props.initialText}
					disabled={this.props.isDisabled}
        />
      {this.props.item.confidenceLevel ? this.answerFeedback() : ""}
			</div>
		);
	}

  handleChange(e) {

  }//handleChange

}
