import React, {Component} from 'react';
import Constants from '../../../constants.js';
//import any other dependencies here.

export default class QuestionTypeSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    //rebindings for custom methods go here.
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;
    let questionTypes = Constants.QUESTION_TYPES;

    return (
      <select value={!!question.question_type ? question.question_type : null} onChange={this.props.handleQuestionTypeChange}>
        {questionTypes.map((type) => {
          return <option value={type.value} >{type.name}</option>
        })}
      </select>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
}//end QuestionTypeSelector class

QuestionTypeSelector.propTypes = {};

