"use strict";

import React                from "react";
import RadioButton          from "../common/radio_button";
import TextArea             from "../common/text_area";
import CheckBox             from "../common/checkbox";
import Matching             from "../common/matching";
import MomEmbed             from "../common/mom_embed";
import MultiDropDown        from '../common/multi_drop_down'
import CommunicationHandler from "../../utils/communication_handler";

export default class UniversalInput extends React.Component{

  constructor(){
    super();
    CommunicationHandler.init();
  }

  componentDidMount(){
    CommunicationHandler.sendSizeThrottled();
    CommunicationHandler.hideLMSNavigation();
  }

  componentDidUpdate(){
    CommunicationHandler.sendSizeThrottled();
  }

  getStyles(props, theme){
    return {
      panel: {
        position: theme.panelPosition,
        marginBottom: theme.panelMarginBottom,
        backgroundColor: "transparent",//props.isResult ? "transparent" : theme.panelBackgroundColor,
        border: theme.panelBorder,
        borderRadius: theme.panelBorderRadius,
        boxShadow: theme.panelBoxShadow,
        borderColor: theme.panelBorderColor,
      },
      panelHeading: {
        padding: theme.panelHeadingPadding,
        borderBottom: theme.panelHeadingBorderBottom,
        borderTopRightRadius: theme.panelHeadingBorderTopRightRadius,
        borderTopLeftRadius: theme.panelHeadingBorderTopLeftRadius,
        textAlign: theme.panelHeadingTextAlign,
        backgroundColor: "transparent" //props.isResult ? "transparent" : theme.panelHeadingBackgroundColor,
      },
      panelBody: {
        padding: theme.panelBodyPadding,
        marginTop: "-20px",
      },
      visuallyHidden: {
        position: "absolute !important",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(1px, 1px, 1px, 1px)",
        whiteSpace: "nowrap"
      }
    }
  }

  wasChosen(id){
    if( this.props.chosen ){
      return this.props.chosen.indexOf(id) > -1
    }else{
      return null;
    }
  }

  showAsCorrect(id){
    if( this.props.correctAnswers && this.props.correctAnswers[0] && this.props.correctAnswers[0].id){
      return this.props.correctAnswers[0].id.indexOf(id) > -1
    }else{
      return null;
    }
  }

  answerFeedback(id){
    if( this.props.answerFeedback && this.props.answerFeedback[id] ){
      return this.props.answerFeedback[id];
    } else {
      return null
    }
  }

  renderMessages(item) {
    if(item.messages){
      var renderedMessages = item.messages.map(function(message){
        return (<li>{message}</li>);
      });
      return (<div className="panel-messages alert alert-danger" role="alert">
        <ul>
          {renderedMessages}
        </ul>
      </div>);
    } else {
      return null;
    }
  }

  renderSolution(item) {
    /**
    * Note on dangerouslySetInnerHTML Usage
    *
    * It is generally not a good idea to use dangerouslySetInnerHTML because it
    * may expose applications to XSS attacks. We are opting to use it here and
    * and in other places in the code base because the assessment content is
    * is stored in (and returned from) the DB as XML, which limits our options
    * in how we can handle assessment "material" on the frontend.
    *
    * READ: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
    */
    if (item.isGraded && item.solution) {
      return (<div className="panel-footer text-center">
        <div dangerouslySetInnerHTML={{ __html: item.solution }}></div>
      </div>);
    } else {
      return "";
    }
  }

  renderDefaultReviewPrompt(styles) {
    if (this.props.isResult) {
      return (<div style={styles.visuallyHidden}>Your selection has been evaluated.</div>);
    } else {
      return "";
    }
  }

  determineItemsClassName(item, styles) {
    if (item.question_type === "multiple_dropdowns_question") {
      return { style: styles.panelBody };
    } else {
      return { className: "panel-body", style: styles.panelBody };
    }
  }

  render() {
    let styles = this.getStyles(this.props, this.context.theme);
    let item = this.props.item;
    const messages = this.renderMessages(item);
    const solution = this.renderSolution(item);
    let visuallyHiddenReviewPrompt = null;
    let items = "";

    switch(item.question_type){
      case "multiple_choice_question":
      case "true_false_question":
        items = this.renderMultipleChoiceQuestion(item, styles);
        visuallyHiddenReviewPrompt = this.renderReviewPromptForMultipleChoiceQuestion(item);
        break;
      case "matching_question":
        items = <Matching assessmentKind={this.props.assessmentKind} isDisabled={this.props.isResult}  item={item} name="answer-option"/>;
        visuallyHiddenReviewPrompt = this.renderDefaultReviewPrompt(styles);
        break;
      case "essay_question":
        items = <TextArea assessmentKind={this.props.assessmentKind} completed={this.props.completed} isDisabled={this.props.isResult} key="textarea_essay_input" item={item} initialText={this.props.chosen} />;
        visuallyHiddenReviewPrompt = "";
        break;
      case "multiple_answers_question":
        items = this.renderMultipleAnswersQuestion(item, styles);
        visuallyHiddenReviewPrompt = this.renderReviewPromptForMultipleAnswersQuestion(item);
        break;
      case "mom_embed":
        items = <MomEmbed assessmentKind={this.props.assessmentKind} key={item.id} item={item} redisplayJWT={this.props.chosen ? this.props.chosen : null} registerGradingCallback={this.props.registerGradingCallback} />;
        visuallyHiddenReviewPrompt = this.renderDefaultReviewPrompt(styles);
        break;
      case 'multiple_dropdowns_question':
        items = <MultiDropDown assessmentKind={this.props.assessmentKind} isResult={this.props.isResult} key={item.id} item={item} selectedAnswers={this.props.chosen} selectCorrectAnswer={this.props.correctAnswers && this.props.correctAnswers.length > 0} shouldFocusForFeedback={this.props.shouldFocusForFeedback} />;
        visuallyHiddenReviewPrompt = this.renderReviewPromptForMultiDropDownQuestion(item, this.props.chosen);
      break;
    }

    const itemsStyles = this.determineItemsClassName(item, styles);

    return (
      <div className="panel-messages-container panel panel-default" style={styles.panel}>
        <div aria-live="polite" style={styles.visuallyHidden}>
          { visuallyHiddenReviewPrompt }
        </div>
        <div className="panel-heading text-center" style={styles.panelHeading}>
          { messages }
        </div>
        <div {...itemsStyles}>
          { items }
        </div>
        <div>
          { solution }
        </div>
      </div>
    );
  }

  renderMultipleChoiceQuestion(item, styles) {
    let refAdded = false;
    let answers = item.answers.map((answer, index) => {
      const showsFeedback = (!refAdded && this.props.isResult && (this.wasChosen(answer.id) || this.answerFeedback(answer.id)));
      if (showsFeedback) {
        refAdded = true;
      }
      return (
        <RadioButton
          assessmentKind={this.props.assessmentKind}
          isDisabled={this.props.isResult}
          key={item.id + "_" + answer.id}
          id={item.id + "_" + answer.id}
          item={answer}
          name="answer-radio"
          checked={this.wasChosen(answer.id)}
          showAsCorrect={this.showAsCorrect(answer.id)}
          answerFeedback={this.answerFeedback(answer.id)}
          addRef={showsFeedback}
          setRef={this.props.setFeedbackRef}
          />
      );
    });

    return (
      <fieldset>
        <legend style={styles.visuallyHidden}>Multiple Choice Question</legend>
        { answers }
      </fieldset>
    );
  }

  renderCorrectResponsePrompt() {
    return (<div>The question has been evaluated. Your choice is correct.</div>);
  }

  renderIncorrectResponsePrompt() {
    return (<div>The question has been evaluated. Your choice is incorrect.</div>);
  }

  renderPartiallyCorrectResponsePrompt() {
    return (<div>The question has been evaluated. Your choice is partially correct.</div>);
  }

  renderReviewPromptForMultipleChoiceQuestion(item) {
    if (this.props.isResult) {
      const chosenAnswers = item.answers.filter((answer) => {
        return this.wasChosen(answer.id);
      });
      if (chosenAnswers.length > 0) {
        const chosenAnswer = chosenAnswers[0];
        if (this.showAsCorrect(chosenAnswer.id)) {
          return this.renderCorrectResponsePrompt();
        } else {
          return this.renderIncorrectResponsePrompt();
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  renderMultipleAnswersQuestion(item, styles) {
    let refAdded = false;
    let answers = item.answers.map((answer, index) => {
      const showsFeedback = (!refAdded && this.props.isResult && (this.wasChosen(answer.id) || this.answerFeedback(answer.id)));
      if (showsFeedback) {
        refAdded = true;
      }
      return (
        <CheckBox
          assessmentKind={this.props.assessmentKind}
          isDisabled={this.props.isResult}
          key={item.id + "_" + answer.id}
          id={item.id + "_" + answer.id}
          item={answer}
          name="answer-check"
          checked={this.wasChosen(answer.id)}
          showAsCorrect={this.showAsCorrect(answer.id)}
          answerFeedback={this.answerFeedback(answer.id)}
          index={index}
          visuallyHiddenStyle={styles.visuallyHidden}
          addRef={showsFeedback}
          setRef={this.props.setFeedbackRef}
          />
      );
    });

    return (
      <fieldset>
        <legend style={styles.visuallyHidden}>Select all correct answers</legend>
        { answers }
      </fieldset>
    );
  }

  determineMultiAnswerTotals(item) {
    return (this.props.correctAnswers && this.props.correctAnswers[0])
      ? this.props.correctAnswers[0].id.length
      : -1;
  }

  determineMultiAnswerCorrectCount(item) {
    return item.answers.reduce((sum, answer) => {
      if (this.showAsCorrect(answer.id) && this.wasChosen(answer.id)) {
        return sum + 1;
      } else {
        return sum;
      }
    }, 0);
  }

  renderReviewPromptForMultipleAnswersQuestion(item) {
    const totalToCheck = this.determineMultiAnswerTotals(item);
    const correctCount = this.determineMultiAnswerCorrectCount(item);
    if (correctCount === 0 ) {
      return this.renderIncorrectResponsePrompt();
    } else if (correctCount < totalToCheck) {
      return this.renderPartiallyCorrectResponsePrompt();
    } else {
      return this.renderCorrectResponsePrompt();
    }
  }

  determineDropdownCorrectMessage(item, chosenAnswers) {
    const correctCount = chosenAnswers.reduce((sum, currChosenAnswer, i) => {
      if (currChosenAnswer.chosen_answer_id &&
        this.props.correctAnswers[i] &&
        this.props.correctAnswers[i].value &&
        currChosenAnswer.chosen_answer_id === this.props.correctAnswers[i].value) {
        return sum + 1;
      } else {
        return sum;
      }
    }, 0);
    if (correctCount === 0) {
      return this.renderIncorrectResponsePrompt();
    } else if (correctCount < Object.keys(item.dropdowns).length) {
      return this.renderPartiallyCorrectResponsePrompt();
    } else {
      return this.renderCorrectResponsePrompt();
    }
  }

  renderReviewPromptForMultiDropDownQuestion(item, chosenAnswers) {
    if (this.props.isResult && chosenAnswers && chosenAnswers.length > 0) {
      return this.determineDropdownCorrectMessage(item, chosenAnswers);
    } else {
      return null;
    }
  }
}

UniversalInput.propTypes = {
  item: React.PropTypes.object.isRequired,
  isResult: React.PropTypes.bool,
  registerGradingCallback: React.PropTypes.func.optional
};

UniversalInput.contextTypes = {
  theme: React.PropTypes.object
};
