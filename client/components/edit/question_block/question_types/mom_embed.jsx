import React, {Component} from 'react';
//import any other dependencies here.

export default class MomEmbed extends Component {
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
      <div style={{padding:'0px 20px 20px 20px'}}>
        <h3><strong>OHM Question ID:</strong> {this.props.question.momEmbed.questionId}</h3>
      </div>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
}//end MomEmbed class

MomEmbed.propTypes = {};

