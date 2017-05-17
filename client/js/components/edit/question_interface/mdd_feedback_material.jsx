import React, {Component} from 'react';
import Style from './css/style.js';
import AnswerFeedbackRow from './answer_feedback_row.jsx';
//import any other dependencies here.

export default class MDDAnswerFeedbackMaterial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: null
    };

    //rebindings for custom methods go here.
  }

  componentWillMount() {

  }

  render() {
    let style = Style.styles()
    let question = this.props.question;
    let dropdowns = Object.keys(question.dropdowns);
    let activeTab = this.state.activeTab;

    //place JSX between the parens!
    return (
      <div>
        <div className="tabArea">
          {dropdowns.map((dropdown, i) => {
            return (
              <div onClick={()=>this.handleActiveTab(dropdown)} style={`mddFeedbackTab ${activeTab === dropdown ? 'mddFeedbackTabActive' : ''}`} >
                {dropdown}
              </div>
            )
          })}
        </div>
        <div className="tabContent">
          {
            dropdowns.map((dropdownKey) => {
              if(!!activeTab && activeTab == dropdownKey){
                return question.dropdowns[dropdownKey].map((dropdown) => {
                  return (
                    <AnswerFeedbackRow
                      key={question.id}
                      answers={question.answers}
                      handleAnswerChange={this.props.handleAnswerChange}
                      handleFeedbackChange={this.props.handleFeedbackChange}
                      handleCorrectChange={this.props.handleCorrectChange}
                      handleAddOption={this.props.handleAddOption}
                      handleAnswerRemoval={this.props.handleAnswerRemoval}
                    />
                  )
                });
              }
            })
          }
          <div style={style.buttonDiv}>
            <button onClick={(e)=> this.props.handleAddOption(e, {dropdownId: activeTab})}>Add Option</button>
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
  handleActiveTab(dropdown) {
    this.setState({
      activeTab: dropdown
    })
  }//handleActiveTab
}//end MDDAnswerFeedbackMaterial class

MDDAnswerFeedbackMaterial.propTypes = {
  answers: React.PropTypes.object,
  handleAnswerChange: React.PropTypes.func,
  handleFeedbackChange: React.PropTypes.func,
  handleCorrectChange: React.PropTypes.func,
  handleAddOption: React.PropTypes.func,
  handleAnswerRemoval: React.PropTypes.func
};

