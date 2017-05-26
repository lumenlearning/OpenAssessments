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
      activeTab: !!this.props.question ? Object.keys(this.props.question.dropdowns)[0] : null
    });
  }

  render() {
    let style = Style.styles();
    let question = this.props.question;
    let dropdowns = !!question ? Object.keys(question.dropdowns) : [];
    let activeTab = this.state.activeTab;

    console.log("QUESTION!: ", question);
    //place JSX between the parens!
    return (
      <div>
        <div className="tabArea" style={{display: 'flex'}}>
          {dropdowns.map((dropdown, i) => {
            return (
              <div onClick={()=>this.handleActiveTab(dropdown)} style={{...style.mddFeedbackTab, ...(activeTab === dropdown ? style.mddFeedbackTabActive : {})}} >
                {dropdown}
              </div>
            )
          })}
        </div>
        <div className="tabContent" style={style.mddTabContent}>
          <div style={{fontWeight: 'bold', display: 'flex', justifyContent: 'space-around'}}>
            <p>Answers</p>
            <p>Feedback</p>
          </div>
          {
            dropdowns.map((dropdownKey) => {
              if(!!activeTab && activeTab == dropdownKey){
                return question.dropdowns[dropdownKey].map((dropdown) => {
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

    //if dropdown.isCorrect is undefined.
      //check if dropdown.value is in question.correct array. return boolean
    if(!(!!dropdown.isCorrect)){
      if(question.correct.findIndex((correct) => {return correct.value == dropdown.value && correct.name == key}) > -1) isCorrect = true;
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
      if(!!question.feedback[key+dropdown.value]) feedback = question.feedback[key+dropdown.value];
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

