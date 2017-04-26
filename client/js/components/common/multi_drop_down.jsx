import React from 'react';
import BaseComponent from '../base_component.jsx';
import AssessmentActions from '../../actions/assessment.js';
//import any other dependencies here.

export default class MultiDropDown extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ariaAnswersLabels:{

      }
    };

    //rebindings for custom methods go here.
    this.findAndReplace = this.findAndReplace.bind(this);
    this.handleShortcodeChange = this.handleShortcodeChange.bind(this);
  }

  componentWillUpdate(){
    this.removeListeners(); //new DOM injection on update, remove old listeners.
  }

  render() {
    let question = this.findAndReplace();
    let questionResult = this.findAndReplace(true);
    let theme = this.context.theme;
    let questionText = {
      fontSize: theme.questionTextFontSize,
      fontWeight: theme.questionTextFontWeight,
      padding: theme.questionTextNoLPadding,
    };

    return (
      <div>
        <div tabIndex="0" dangerouslySetInnerHTML={{__html: question}} style={questionText} />
        <div style={{position: 'absolute', left: '-10000px', top: 'auto', height: '1px', width: '1px', overflow: 'hidden'}} tabIndex="0" role="group" aria-label="Review your answer" >
          <div id="question_result_container" dangerouslySetInnerHTML={{__html: questionResult}} />
        </div>
      </div>
    );
  }

  componentDidUpdate(){
    this.addListeners();
  }

  componentDidMount(){
    this.addListeners();
  }

  componentWillUnmount(){
    this.removeListeners();
  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
  findAndReplace(noSelect = false){
    var i = 1;
    let string = this.props.item.material;
    let shortcodes = Object.keys(this.props.item.dropdowns);
    let answers = this.props.item.dropdowns;
    let re = new RegExp(`\\[${shortcodes.join('\\]|\\[')}\\]`, 'gi'); //turn array of shortcodes into a regex
    let answerCheck = '';

    return string.replace(re, (match) => {
      let str = `"blank ${i}"`;
      let re = new RegExp('\\[|\\]', 'g');
      let nMatch = match.replace(re, ''); //from '[shortcode]' to 'shortcode'
      let options = answers[nMatch].map((answer) => {
        return `<option ${this.state[nMatch] === answer.value ? "selected" : ""} value=${answer.value}>${answer.name}</option>`;
      });

      //check for selected answers
      if (typeof this.props.selectedAnswers !== 'undefined') {
        let selAnswer = this.props.selectedAnswers.find((selectedAnswer) => {
          return selectedAnswer.dropdown_id === nMatch;
        });

        let correctAnswer = this.props.item.correct.find((correctAns) => {
          return correctAns.name === nMatch;
        });

        let checkboxWrapper = `
          height: 100%;
          margin-left: 10px;
          vertical-align: text-top;
          font-size: 12px;
          display: flex;
        `;
        let checkboxStyle = `
          border-radius: 50%;
          align-self: center;
        `;
        let plusStyle = `
          border-radius: 50%;
          background-color: #e0542b;
          transform: rotate(45deg);
          align-self: center;
        `;

        if(selAnswer.chosen_answer_id === correctAnswer.value){
          answerCheck = (
            `<span style="display:inline-block;">
              <span style=${`"color:#6fb88a;${checkboxWrapper}"`} >
                <img 
                  width="20px"
                  height="20px"
                  src="/assets/checkbox-48.png"
                  style="${checkboxStyle}"
                  alt="image to indicate the correct option was chosen" 
                  /> (${i})
              </span>
            </span>`
          );
        }
        else{
          answerCheck = (
            `<span style="display:inline-block;">
              <span style=${`"color:#e0542b;${checkboxWrapper}"`} >
                <img 
                  width="20px"
                  height="20px"
                  src="/assets/plus-52.png"
                  style="${plusStyle}"
                  alt="image to indicate the incorrect option was chosen" 
                /> (${i})
              </span>
            </span>`
          );
        }

      }

      //Aria goodness
      let ariaLabel = this.state.ariaAnswersLabels[nMatch] ? `"${this.state.ariaAnswersLabels[nMatch]}"` : str;

      i++;

      if(noSelect){ //replace with values instead of <select /> boxes if true.
        return str
      }

      return (
        `<span style="display:inline-block" >
          <span style="display:flex">
            <select 
              name="${nMatch}" 
              id="dropdown_${nMatch}" 
              aria-label=${ariaLabel}
            >
              <option ${!this.state[nMatch] ? "selected" : ""} disabled aria-label="select ${nMatch} choice" value="null">[Select]</option>
              ${options}
            </select>
            ${answerCheck}
          </span>
        </span>`
      );
    });
  }

  addListeners() {
    let shortcodes = Object.keys(this.props.item.dropdowns);

    shortcodes.forEach((shortcode, i) => {
      document.getElementById(`dropdown_${shortcode}`).addEventListener('change', this.handleShortcodeChange);
    });
  }//addListeners

  removeListeners(){
    let shortcodes = Object.keys(this.props.item.dropdowns);

    shortcodes.forEach((shortcode, i) => {
      document.getElementById(`dropdown_${shortcode}`).removeEventListener('change', this.handleShortcodeChange);
    });
  }//removeListeners

  handleShortcodeChange(e){
    let stateClone = {...this.state};

    stateClone.ariaAnswersLabels[e.target.name] = e.target.options[e.target.options.selectedIndex].text;
    stateClone[e.target.name] = e.target.value;

    this.setState(stateClone);

    AssessmentActions.answerSelected({
      "dropdown_id": e.target.name,
      "chosen_answer_id": e.target.value
    });
  }//handleShortcodeChange

}//end MultiDropDown class

MultiDropDown.propTypes = {};

MultiDropDown.contextTypes = {
  theme: React.PropTypes.object
}


