import React, {Component} from 'react';
import Style from '../css/style.js';
//import any other dependencies here.

export default class EssayQuestionFeedback extends Component {
  constructor(props) {
    super(props);

    //rebindings for custom methods go here.
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;
    let style = Style.styles();
    let feedbackMaterial    = question.feedback ? (<div style={style.qbTblCell} dangerouslySetInnerHTML={{__html:question.feedback.general_fb}} />) : (<div style={style.qbTblCell} dangerouslySetInnerHTML={{__html:"&nbsp;"}} />);

    //place JSX between the parens!
    return (
      <div style={{padding: '0 15px 15px 15px'}} >
        <div style={{padding: '10px 0'}}>
          <div style={{...style.label, ...{fontSize:'18px'}}}>Feedback</div>
        </div>
        <div style={{width:'100%'}}>
          <div style={{width: '100%'}} >
            {feedbackMaterial}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
}//end EssayQuestionFeedback class

EssayQuestionFeedback.propTypes = {
  question: React.PropTypes.object.isRequired,
  windowWidth: React.PropTypes.object.isRequired
};

