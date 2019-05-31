import React, {Component} from 'react';
//import any other dependencies here.

export default class MomEmbedFeedbackMaterial extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    //rebindings for custom methods go here.
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;

    //place JSX between the parens!
    return (
      <div>
        <label htmlFor="ohm input">
          <strong>OHM Question ID</strong>
          <input
            name="ohm input"
            type="text"
            defaultValue={!!question.momEmbed ? question.momEmbed.questionId : null}
            onChange={this.props.handleAnswerChange}
            style={{fontWeight: "normal"}}
          />
        </label>
      </div>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
}//end MomEmbedFeedbackMaterial  class

MomEmbedFeedbackMaterial.propTypes = {};

