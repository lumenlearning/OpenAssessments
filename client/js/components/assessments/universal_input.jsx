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

  render() {
    let styles = this.getStyles(this.props, this.context.theme);
    let item = this.props.item;
    let messages = "";
    let solution = "";
    let visuallyHiddenReviewPrompt = null;
    let items = "";

    if(item.messages){
      var renderedMessages = item.messages.map(function(message){
       return (<li>{message}</li>);
      });
      messages = (<div className="panel-messages alert alert-danger" role="alert">
                   <ul>
                     {renderedMessages}
                   </ul>
                 </div>);
    }

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
      solution = (<div className="panel-footer text-center">
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.solution
                  }}>
                </div>
               </div>);
    }
    if (this.props.isResult) {
      visuallyHiddenReviewPrompt = (<div style={styles.visuallyHidden}>
        Your selection has been evaluated.  Please navigate forward to receive feedback.
      </div>);
    }

    switch(item.question_type){
      case "multiple_choice_question":
      case "true_false_question":
        items = this.renderMultipleChoiceQuestion(item, styles);
        visuallyHiddenReviewPrompt = this.renderReviewPromptForMultipleChoiceQuestion(item);
        break;
      case "matching_question":
        items = <Matching assessmentKind={this.props.assessmentKind} isDisabled={this.props.isResult}  item={item} name="answer-option"/>;
        break;
      case "essay_question":
        items = <TextArea assessmentKind={this.props.assessmentKind} completed={this.props.completed} isDisabled={this.props.isResult} key="textarea_essay_input" item={item} initialText={this.props.chosen} />;
        break;
      case "multiple_answers_question":
        items = this.renderMultipleAnswersQuestion(item, styles);
        break;
      case "mom_embed":
        items = <MomEmbed assessmentKind={this.props.assessmentKind} key={item.id} item={item} redisplayJWT={this.props.chosen ? this.props.chosen : null} registerGradingCallback={this.props.registerGradingCallback} />;
        break;
      case 'multiple_dropdowns_question':
        items = <MultiDropDown assessmentKind={this.props.assessmentKind} isResult={this.props.isResult} key={item.id} item={item} selectedAnswers={this.props.chosen} selectCorrectAnswer={this.props.correctAnswers && this.props.correctAnswers.length > 0} />;
        visuallyHiddenReviewPrompt = this.renderReviewPromptForMultiDropDownQuestion(item, this.props.chosen);
      break;
    }

    return (
      <div className="panel-messages-container panel panel-default" style={styles.panel}>
        <div className="panel-heading text-center" style={styles.panelHeading}>
          { messages }
        </div>
        <div
          className={item.question_type === "multiple_dropdowns_question" ? "" : "panel-body"}
          style={styles.panelBody}
          >
          { items }
        </div>
        <div>
          { solution }
        </div>
        <div aria-live="polite" style={styles.visuallyHidden}>
          { visuallyHiddenReviewPrompt }
        </div>
      </div>
    );
  }

  renderMultipleChoiceQuestion(item, styles) {
    let answers = item.answers.map((answer, index) => {
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

  renderReviewPromptForMultipleChoiceQuestion(item) {
    if (this.props.isResult) {
      const chosenAnswers = item.answers.filter((answer) => {
        return this.wasChosen(answer.id);
      });
      if (chosenAnswers.length > 0) {
        const chosenAnswer = chosenAnswers[0];
        const isCorrectMessage = (this.showAsCorrect(chosenAnswer.id))
          ? "correct"
          : "incorrect";
        return (<div>
          The question has been evaluated.  Your choice is { isCorrectMessage }.  You selected:
          <div dangerouslySetInnerHTML={ { __html: chosenAnswer.material } }/> .
          <div dangerouslySetInnerHTML={ { __html: this.answerFeedback(chosenAnswer.id) } }/>
        </div>);
        return null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  renderMultipleAnswersQuestion(item, styles) {
    let answers = item.answers.map((answer, index) => {
      return (
        <CheckBox
          assessmentKind={this.props.assessmentKind}
          isDisabled={this.props.isResult}
          key={item.id + "_" + answer.id}
          id={item.id + "_" + answer.id}
          item={answer} name="answer-check"
          checked={this.wasChosen(answer.id)}
          showAsCorrect={this.showAsCorrect(answer.id)}
          answerFeedback={this.answerFeedback(answer.id)}
          index={index}
          visuallyHiddenStyle={styles.visuallyHidden}
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

  renderReviewPromptForMultiDropDownQuestion(item, chosenAnswers) {
    if (this.props.isResult && chosenAnswers && chosenAnswers.length > 0) {
        let correctCount = 0;
        const dropdownFeedbacks = chosenAnswers.map((ca, i) => {
          const dropDownChoices = item.dropdowns[ca.dropdown_id];
          const answerInfo = dropDownChoices.find((choice) => choice.value === ca.chosen_answer_id);

          if (!answerInfo) {
            return null;
          } else {
            if (answerInfo.isCorrect) {
              correctCount += 1;
            }
            const feedback = (answerInfo.feedback) ? ` Feedback: ${answerInfo.feedback}` : "";
            return `Selection ${i + 1} - ${answerInfo.name} - ${answerInfo.isCorrect ? " correct" : " incorrect"}.${feedback}`;
          }
        });
        let summaryMessage = "Question answer correct.";
        if (correctCount === 0) {
          summaryMessage = "Question answer incorrect.";
        } else if (correctCount < Object.keys(item.dropdowns).length) {
          summaryMessage = "Question answer partially correct.";
        }
        const feedback = `${summaryMessage} You selected: ${dropdownFeedbacks.filter((msg) => msg !==  null).join("\n")}`;
        return (<div dangerouslySetInnerHTML={ { __html: feedback } }/>);
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
