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

    this.setState({
      activeTab: !!this.props.question && !!this.props.question.dropdowns ? Object.keys(this.props.question.dropdowns)[0] : null
    });
  }

  componentWillReceiveProps(nProps, nState) {
    if(!(!!this.state.activeTab)){
      this.setState({
        activeTab: !!nProps.question && !!nProps.question.dropdowns ? Object.keys(nProps.question.dropdowns)[0] : null
      });
    }
  }//componentWillReceiveProps

  render() {
    let style = Style.styles();
    let question = this.props.question;
    let dropdowns = !!question && !!question.dropdowns ? Object.keys(question.dropdowns) : [];
    let activeTab = this.state.activeTab;

    if(dropdowns.length === 0) return <p><strong>Add dropdowns to your question text by putting a word in brackets like this: <span style={{fontFamily: 'monospace'}}>[dropdown1]</span></strong></p>;
    //place JSX between the parens!
    return (
      <div>
        <div className="tabArea" style={style.mddTabArea}>
            {dropdowns.map((dropdown, i) => {
              return (
                <div key={`ddTab-${dropdown}`} onClick={()=>this.handleActiveTab(dropdown)} style={{...style.mddFeedbackTab, ...(activeTab === dropdown ? style.mddFeedbackTabActive : {})}} >
                  {dropdown}
                </div>
              )
            })}
        </div>
        <div className="tabContent" style={style.mddTabContent} >
          <div style={{fontWeight: 'bold', display: 'flex', justifyContent: 'space-around'}} >
            <p>Answers</p>
            <p>Feedback</p>
          </div>
          {
            dropdowns.map((dropdownKey) => {
              if(!!activeTab && activeTab == dropdownKey){
                return question.dropdowns[dropdownKey].map((dropdown) => {
                  if(!!dropdown) {
                    return (
                      <AnswerFeedbackRow
                        key={dropdown.value}
                        index={{key: dropdownKey, dropdown: dropdown.value}}
                        answer={dropdown.name}
                        feedback={this.checkForFeedback(dropdown, dropdownKey)}
                        isCorrect={this.checkIfCorrect(dropdown, dropdownKey)}
                        handleAnswerChange={this.props.handleAnswerChange}
                        handleFeedbackChange={this.props.handleFeedbackChange}
                        handleCorrectChange={this.props.handleCorrectChange}
                        handleAddOption={this.props.handleAddOption}
                        handleAnswerRemoval={this.props.handleAnswerRemoval}
                      />
                    )
                  }
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

  checkIfCorrect(dropdown, key) {
    let question = this.props.question;
    let isCorrect = false;

    console.log('check if correct', dropdown, question);

    //if dropdown.isCorrect is undefined.
      //check if dropdown.value is in question.correct array. return boolean
    if(!(!!dropdown.isCorrect)){
      if(!!question.correct && question.correct.findIndex((correct) => {return correct.value == dropdown.value && correct.name == key}) > -1) isCorrect = true;
    }
    else{
      isCorrect = dropdown.isCorrect;
    }

    return isCorrect
  }//checkIfCorrect

  checkForFeedback(dropdown, key){
    let question = this.props.question;
    let feedback = '';

    if(!(!!dropdown.feedback)){
      if(!!question.feedback && !!question.feedback[key+dropdown.value]) feedback = question.feedback[key+dropdown.value];
      else feedback = null;
    }
    else{
      feedback = dropdown.feedback;
    }

    return feedback;
  }//checkForFeedback
}//end MDDAnswerFeedbackMaterial class

MDDAnswerFeedbackMaterial.propTypes = {
  answers: React.PropTypes.object,
  handleAnswerChange: React.PropTypes.func,
  handleFeedbackChange: React.PropTypes.func,
  handleCorrectChange: React.PropTypes.func,
  handleAddOption: React.PropTypes.func,
  handleAnswerRemoval: React.PropTypes.func
};

