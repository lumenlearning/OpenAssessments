import React from 'react';
import BaseComponent from '../base_component.jsx';
import AssessmentActions from '../../actions/assessment.js';
import Styles from "../../themes/selection.js";
//import any other dependencies here.

const styles = Styles;

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
    this.answerCheckMarks = this.answerCheckMarks.bind(this);
    this.answerOptions = this.answerOptions.bind(this);
    this.answerFeedback = this.answerFeedback.bind(this);
    this.correctAnswers = this.correctAnswers.bind(this);
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
        {this.answerFeedback()}
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
    var i = 0;
    let item = this.props.item;
    let string = item.material;
    let shortcodes = Object.keys(this.props.item.dropdowns);
    let answers = this.props.item.dropdowns;
    let re = new RegExp(`\\[${shortcodes.join('\\]|\\[')}\\]`, 'gi'); //turn array of shortcodes into a regex

    return string.replace(re, (match) => {
      let str = `"blank ${i}"`;
      let re = new RegExp('\\[|\\]', 'g');
      let nMatch = match.replace(re, ''); //from '[shortcode]' to 'shortcode'
      let correctAnswer = item.correct.find((correctAns) => {
        return correctAns.name === nMatch;
      });
      let options = this.answerOptions(correctAnswer, nMatch);

      //Aria goodness
      let ariaLabel = this.state.ariaAnswersLabels[nMatch] ? `"${this.state.ariaAnswersLabels[nMatch]}"` : str;

      i++;

      if(noSelect){ //replace with values instead of <select /> boxes if true.
        return ariaLabel;
      }

      return (
        `<span style="display:inline-block" >
          <span style="display:flex">
            <select
              name="${nMatch}"
              id="dropdown_${nMatch}"
              aria-label=${ariaLabel}
              ${this.props.item.confidenceLevel !== undefined ? "disabled" : ""}
              style="${this.props.item.confidenceLevel !== undefined ? "cursor: not-allowed" : ""}"
            >
              <option ${!this.state[nMatch] ? "selected" : ""} disabled aria-label="select ${nMatch} choice" value="null">[Select]</option>
              ${options}
            </select>
            ${this.answerCheckMarks(correctAnswer, nMatch, i)}
          </span>
        </span>`
      );
    });
  }//findAndReplace

  answerOptions(correctAnswer, nMatch) {
    return this.props.item.dropdowns[nMatch].map((answer) => {
      let selected = "";
      let disabled = "";

      if (!!this.props.selectedAnswers && this.props.selectedAnswers.length > 0) {
        let selectedAnswer = this.props.selectedAnswers.find((selAnswer) => {
          return selAnswer.dropdown_id === nMatch;
        });

        if(selectedAnswer && selectedAnswer.chosen_answer_id === answer.value){
          selected = 'selected';
        }
      }
      else if(this.state[nMatch] === answer.value){
        selected = "selected";
      }

      if((this.props.isResult && !!correctAnswer) && correctAnswer.value !== answer.value) disabled = "disabled";

      return `<option ${selected} ${disabled} value=${answer.value} >${answer.name}</option>`;
    });
  }//correctAnswers

  answerCheckMarks(correctAnswer, nMatch, i) {
    let item = this.props.item;
    let answerCheck = '';

    if (this.props.isResult && !!correctAnswer && !!this.props.selectedAnswers && this.props.selectedAnswers.length > 0) {
      let selAnswer = this.props.selectedAnswers.find((selectedAnswer) => {
        return selectedAnswer.dropdown_id === nMatch;
      });

      let correctAnswerChosen = selAnswer.chosen_answer_id === correctAnswer.value;

      let checkboxWrapper = `
          color: ${correctAnswerChosen ? styles.feedbackCorrect.color : styles.feedbackIncorrect.color};
          height: 100%;
          margin-left: 5px;
          font-size: 14px;
          display: flex;
          align-items: center;
        `;
      let correctStyle = `
          align-self: center;
          margin-right: 5px;
        `;
      let incorrectStyle = `
          align-self: center;
          margin-right: 5px;
        `;


      if(!!selAnswer && (!!correctAnswer && selAnswer.chosen_answer_id === correctAnswer.value)){
        answerCheck = (
          `<span
                style="display:inline-block;"
                tabindex="0"
                aria-label="Correct: ${item.feedback[correctAnswer.name+correctAnswer.value]}"
            >
              <span style=${`"${checkboxWrapper}"`} >
                <img
                  width="20px"
                  height="20px"
                  src="/assets/correct.png"
                  style="${correctStyle}"
                  alt="image to indicate the correct option was chosen"
                  /> (${i})
              </span>
            </span>`
        );
      }
      else{
        answerCheck = (
          `<span
                style="display:inline-block;"
                tabindex="0"
                aria-label="Wrong: ${item.feedback[correctAnswer.name+correctAnswer.value]}"
            >
              <span style=${`"${checkboxWrapper}"`} >
                <img
                  width="20px"
                  height="20px"
                  src="/assets/incorrect.png"
                  style="${incorrectStyle}"
                  alt="image to indicate the incorrect option was chosen"
                /> (${i})
              </span>
            </span>`
        );
      }//else

    }

    return answerCheck;
  }//answerCheck

  correctAnswers() {
    let result = [];

    this.props.item.correct.forEach((correctAns) => {
      result.push(correctAns.name + correctAns.value);
    });

    return result;
  }

  answerFeedback() {
    let selectedAnswers = this.props.selectedAnswers;
    let feedback = this.props.item.feedback;
    let correctAnswers = this.correctAnswers();

    return selectedAnswers.map((answer, i) => {
      let answerId = answer.dropdown_id + answer.chosen_answer_id;

      if (answerId.indexOf(feedback)) {
        let feedbackStyles = {};

        if (correctAnswers.includes(answerId)) {
          feedbackStyles = {...styles.feedbackCorrect, ...styles.externalFeedbackCorrect};
        } else {
          feedbackStyles = {...styles.feedbackIncorrect, ...styles.externalFeedbackIncorrect};
        }

        return (
          <div className="check_answer_result" style={feedbackStyles} dangerouslySetInnerHTML={ this.answerFeedbackMarkup(i, feedback[answerId]) }></div>
        );
      }
    });
  }

  answerFeedbackMarkup(i, feedback) {
    return { __html: `(${i + 1}) ` + feedback }
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
