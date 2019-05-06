import React from "react";
import BaseComponent from "../base_component.jsx";
import AssessmentActions from "../../actions/assessment.js";
import Styles from "../../themes/selection.js";

const styles = Styles;

export default class MultiDropDown extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ariaAnswersLabels: {}
    };

    this.findAndReplace = this.findAndReplace.bind(this);
    this.handleShortcodeChange = this.handleShortcodeChange.bind(this);
    this.answerCheckMarks = this.answerCheckMarks.bind(this);
    this.answerOptions = this.answerOptions.bind(this);
    this.answerFeedback = this.answerFeedback.bind(this);
    this.correctAnswers = this.correctAnswers.bind(this);
  }

  componentWillUpdate() {
    this.removeListeners();
  }

  render() {
    return (
      <div>
        <div
          tabIndex="0"
          dangerouslySetInnerHTML={{__html: this.findAndReplace()}}
          />
        <div
          style={this.getReviewAnswerStyle()}
          tabIndex="0"
          role="group"
          aria-label="Review your answer"
          >
            <div
              id="question_result_container"
              dangerouslySetInnerHTML={{__html: this.findAndReplace(true)}}
              />
        </div>
        {this.props.isResult ? this.answerFeedback() : ""}
      </div>
    );
  }

  componentDidUpdate() {
    this.addListeners();
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }


  findAndReplace(noSelect = false) {
    let i = 0;
    let re = new RegExp(`\\[${Object.keys(this.props.item.dropdowns).join("\\]|\\[")}\\]`, "gi");

    return this.props.item.material.replace(re, (match) => {
      let str = `"blank ${i}"`;
      let nMatch = match.replace(new RegExp("\\[|\\]", "g"), ""); //from '[shortcode]' to 'shortcode'
      let correctAnswer = this.props.item.correct.find((correctAns) => {
        return correctAns.name === nMatch;
      });

      i++;

      let disabled = "";
      let cursorNotAllowed = "";

      // Disable dropdowns if this is the results page or if confidence levels have been selected
      if (this.props.isResult || typeof this.props.item.confidenceLevel !== "undefined") {
        disabled = "disabled";
        cursorNotAllowed = "cursor: not-allowed";
      }

      return (
        `<span style="display:inline-block" >
          <span style="display:flex">
            <select
              name="${nMatch}"
              id="dropdown_${nMatch}"
              aria-label=${this.getAriaAnswerLabel(nMatch, str)}
              ${disabled}
              style="${cursorNotAllowed}"
            >
              <option ${!this.state[nMatch] ? "selected" : ""} disabled aria-label="select ${nMatch} choice" value="null">[Select]</option>
              ${this.answerOptions(correctAnswer, nMatch)}
            </select>
            ${this.answerCheckMarks(correctAnswer, nMatch, i)}
          </span>
        </span>`
      );
    });
  }

  getAriaAnswerLabel(nMatch, str) {
    return this.state.ariaAnswersLabels[nMatch] ? this.state.ariaAnswersLabels[nMatch] : str;
  }

  getReviewAnswerStyle() {
    return {
      position: "absolute",
      left: "-10000px",
      top: "auto",
      height: "1px",
      width: "1px",
      overflow: "hidden"
    }
  }

  answerOptions(correctAnswer, nMatch) {
    return this.props.item.dropdowns[nMatch].map((answer) => {
      let selected = "";
      let disabled = "";

      if (!!this.props.selectedAnswers && this.props.selectedAnswers.length > 0) {
        let selectedAnswer = this.props.selectedAnswers.find((selAnswer) => {
          return selAnswer.dropdown_id === nMatch;
        });

        if (selectedAnswer && selectedAnswer.chosen_answer_id === answer.value) {
          selected = "selected";
        }
      } else if (this.state[nMatch] === answer.value) {
        selected = "selected";
      }

      // if this is NOT a formative/practice assessment and this is the answer
      // key page, select/show the correct answers
      if (this.props.assessmentKind !== "formative" &&
          this.props.assessmentKind !== "practice" &&
          this.props.selectCorrectAnswer &&
          answer.isCorrect) {
        selected = "selected";
      }

      if ((this.props.isResult && !!correctAnswer) && correctAnswer.value !== answer.value) disabled = "disabled";

      return `<option ${selected} ${disabled} value=${answer.value}>${answer.name}</option>`;
    });
  }

  answerCheckMarks(correctAnswer, nMatch, i) {
    let item = this.props.item;
    let answerCheck = '';
    let selAnswer = null;

    if (this.props.isResult && !!correctAnswer && !!this.props.selectedAnswers && this.props.selectedAnswers.length > 0) {
      selAnswer = this.props.selectedAnswers.find((selectedAnswer) => {
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
      }

    }

    return answerCheck;
  }

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
    let correctResponse;

    return selectedAnswers.map((answer, i) => {
      let answerId = answer.dropdown_id + answer.chosen_answer_id;

      if (answerId.indexOf(feedback)) {
        let feedbackStyles = {};

        if (correctAnswers.includes(answerId)) {
          correctResponse = true;
          feedbackStyles = {...styles.feedbackCorrect, ...styles.externalFeedbackCorrect};
        } else {
          correctResponse = false;
          feedbackStyles = {...styles.feedbackIncorrect, ...styles.externalFeedbackIncorrect};
        }

        return (
          <div
            className="check_answer_result"
            style={feedbackStyles}
            dangerouslySetInnerHTML={this.answerFeedbackMarkup(i, feedback[answerId], correctResponse)}
            />
        );
      }
    });
  }

  answerFeedbackMarkup(i, feedback, correctResponse) {
    if (typeof feedback === "undefined") {
      if (correctResponse) {
        return { __html: `(${i + 1}) Correct` }
      } else {
        return { __html: `(${i + 1}) Incorrect` }
      }
    }

    return { __html: `(${i + 1}) ` + feedback };
  }

  addListeners() {
    let shortcodes = Object.keys(this.props.item.dropdowns);

    shortcodes.forEach((shortcode, i) => {
      document.getElementById(`dropdown_${shortcode}`).addEventListener("change", this.handleShortcodeChange);
    });
  }

  removeListeners() {
    let shortcodes = Object.keys(this.props.item.dropdowns);

    shortcodes.forEach((shortcode, i) => {
      document.getElementById(`dropdown_${shortcode}`).removeEventListener("change", this.handleShortcodeChange);
    });
  }

  handleShortcodeChange(e) {
    let stateClone = {...this.state};

    stateClone.ariaAnswersLabels[e.target.name] = e.target.options[e.target.options.selectedIndex].text;
    stateClone[e.target.name] = e.target.value;

    this.setState(stateClone);

    AssessmentActions.answerSelected({
      "dropdown_id": e.target.name,
      "chosen_answer_id": e.target.value
    });
  }
}

MultiDropDown.propTypes = {};

MultiDropDown.contextTypes = {
  theme: React.PropTypes.object
};
