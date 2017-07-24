import React, {Component} from 'react';
import Constants from '../../../constants.js';
import ReviewAssessmentStore from '../../../stores/review_assessment.js';
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
    let AllQuestions = ReviewAssessmentStore.allQuestions();
    let question = this.props.question;
    let questionTypes = Constants.QUESTION_TYPES;
    let hasEssays = AllQuestions.findIndex((question) => {
      return question.question_type == 'essay_question';
    });
    let hasMom = AllQuestions.findIndex((question) => {
      return question.question_type == 'mom_embed';
    });

    return (
      <div>
        <p>Select your question type:</p>
        <select value={!!question.question_type ? question.question_type : null} onChange={this.props.handleQuestionTypeChange} style={{marginBottom: '25px'}}>
          {!!question.question_type ? null : <option value={null} disabled={true} selected={true}>Select Question Type</option>}
          {questionTypes.map((type) => {

            if(hasEssays > -1 && hasMom > -1){
              return <option value={type.value} >{type.name}</option>
            }

            else if((hasEssays === -1 && type.value !== 'essay_question') && hasMom > -1){
              return <option value={type.value} >{type.name}</option>
            }
            else if((hasMom === -1 && type.value !== 'mom_embed') && hasEssays > -1){
              return <option value={type.value} >{type.name}</option>
            }
            else if((hasEssays === -1 && hasMom === -1) && (type.value !== 'essay_question' && type.value !== 'mom_embed')){
              return <option value={type.value} >{type.name}</option>
            }

          })}
        </select>
      </div>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
}//end QuestionTypeSelector class

QuestionTypeSelector.propTypes = {};

