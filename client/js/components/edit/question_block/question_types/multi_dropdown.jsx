import React, {Component} from 'react';
//import any other dependencies here.

export default class MultiDropdownFeedback extends Component {
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
        {Object.keys(question.dropdowns).map((key, i) => {
          return question.dropdowns[key].map((dropdown, i) => {
            let correctAnswer = question.correct.find((correctDropdown) => {
              return dropdown.name === correctDropdown.name;
            });

            return (
              <div>
                <div>Answer: </div>
                <div>Feedback: </div>
              </div>
            )
          })
        })}
      </div>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
}//end MultiDropdownFeedback class

MultiDropdownFeedback.propTypes = {
  question: React.PropTypes.object.isRequired,
  windowWidth: React.PropTypes.object.isRequired
};

