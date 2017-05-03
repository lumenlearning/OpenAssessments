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

    //place JSX between the parens!
    return (
      <div>
        Multi Drop Down Feedback area
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

