"use strict";
// Dependencies
import React from "react";
// Components
import BaseComponent from "../base_component";
import UniversalInput from "./universal_input";
import FormativeHeader from "./formativeHeader";
// Actions
import AssessmentActions from "../../actions/assessment";
// Stores
import AssessmentStore from "../../stores/assessment";

export default class Item extends BaseComponent {
  constructor() {
    super();

    this._bind(
      "getConfidenceLevels",
      "inputOrReview",
      "confidenceLevelClicked",
      "submitAssessment",
      "checkAnswerButton",
      "checkAnswerButtonClicked",
      "nextButtonClicked",
      "previousButtonClicked",
      "getPreviousButton",
      "getNextButton",
      "getStyles",
      "clearShowMessage",
      "mustAnswerMessage",
      "getResultsButton"
    );
  }

  render() {
    let styles = this.getStyles(this.context.theme);

    return (
      <div className="assessment-container" style={styles.assessmentContainer}>
        <div className="question">
          <div style={styles.formativePadding}>

            <form className="edit_item">
              <div className="full_question" style={styles.fullQuestion}>
                {this.formativeHeader()}
                {this.simpleProgress(styles)}
                <main
                    className="inner_question"
                    style={styles.innerQuestion}>
                  <div aria-live="polite">
                    { this.newQuestionNotification(styles) }
                  </div>
                  <h2 style={styles.visuallyHidden} tabIndex="-1">Assessment Text</h2>
                  <div
                    className="question_text"
                    style={this.props.question.question_type !== "multiple_dropdowns_question" ? styles.questionText : {}} >
                      {this.questionDirections(styles)}
                      {this.questionContent()}
                  </div>
                  {this.inputOrReview(styles)}
                  <div>
                    {this.getConfidenceLevels(this.props.confidenceLevels, styles)}
                    {this.checkAnswerButton(styles)}
                    {this.getNavigationButtons(styles)}
                    {this.submitAssessmentButton(styles)}
                    {this.getWarning(this.state, this.props.questionCount, this.props.currentIndex, styles)}
                    {this.mustAnswerMessage(styles)}
                  </div>
                </main>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }

  isSelfCheckResult() {
    return this.props.answerMessage && AssessmentStore.isFormative();
  }

  isPracticeResult() {
    return this.props.answerMessage && AssessmentStore.isPractice();
  }

  shouldForceFeedbackFocus() {
    return this.state &&
      this.state.forceFeedbackFocus &&
      (this.isSelfCheckResult() || this.isPracticeResult());
  }

  hasFeedbackRef() {
    return this.feedbackRef && this.feedbackRef.getDOMNode();
  }

  componentDidUpdate() {
   if (this.shouldForceFeedbackFocus()) {
      if (this.hasFeedbackRef() && !AssessmentStore.isPractice()) {
        // focus on the top component
        this.feedbackRef.getDOMNode().focus();
      }
      this.setState({ forceFeedbackFocus: false });
    }
  }

  mustAnswerMessage(styles) {
    if (this.state && this.state.showMessage) {
      return (
        <div style={styles.warning}>
          You must select an answer before continuing.
        </div>
      );
    }
  }

  nextButtonClicked(e) {
    e.preventDefault();

    this.setState({ unAnsweredQuestions: null });
    this.props.nextQuestion(this.clearShowMessage);
  }

  previousButtonClicked(e) {
    e.preventDefault();

    this.setState({ unAnsweredQuestions: null });
    this.props.previousQuestion(this.clearShowMessage);
  }

  clearShowMessage() {
    this.setState({ showMessage: false });
  }

  confidenceLevelClicked(e, val, currentIndex) {
    e.preventDefault();
    let that = this;

    this.props.selectQuestion(this.props.currentIndex, () => {
      // if an answer has been selected
      if (AssessmentStore.hasSelectedAnswerForCurrent()) {
        AssessmentActions.selectConfidenceLevel(val, currentIndex);

        // if this is the last question and it's a formative assessment
        if (that.props.currentIndex === that.props.questionCount - 1 &&
            AssessmentStore.isFormative()) {
          that.props.checkAnswer(that.props.currentIndex);
        // otherwise, this is not the last question and/or it's not formative
        } else {
          that.clearShowMessage();
          that.props.checkAnswer(that.props.currentIndex);
        }
        that.setState({ forceFeedbackFocus: true });
      // if an answer hasn't been selected
      } else {
        that.setState({ showMessage: true });
      }
    });
  }

  checkAnswerButtonClicked(e) {
    e && e.preventDefault();
    let that = this;

    this.props.selectQuestion(this.props.currentIndex, () => {
      // if an answer has been selected
      if (AssessmentStore.hasSelectedAnswerForCurrent()) {
        that.setState({ showMessage: false });
        that.props.checkAnswer(that.props.currentIndex);

        // If it's a practice quiz submit the full quiz when they've checked all
        // the answers
        if (AssessmentStore.isPractice() && Item.checkCompletion() === true) {
          that.submitAssessment();
        }
      } else {
        that.setState({ showMessage: true });
      }
    });
  }

  submitAssessmentButtonClicked(e) {
    e && e.preventDefault();
    this.props.selectQuestion(this.props.currentIndex, this.submitAssessment);
  }

  submitAssessment() {
    let complete = Item.checkCompletion();

    if (complete === true) {
      window.onbeforeunload = null;

      AssessmentActions.submitAssessment(
        this.props.assessment.id,
        this.props.assessment.assessmentId,
        this.props.allQuestions,
        AssessmentStore.allStudentAnswers(),
        this.props.settings,
        this.props.outcomes
      );
    } else {
      this.setState({ unAnsweredQuestions: complete });
    }
  }

  static checkCompletion() {
    let questionsNotAnswered = AssessmentStore.unansweredQuestions();

    // if there are any unanswered questions, return them
    if (questionsNotAnswered.length > 0) {
      return questionsNotAnswered;
    } else {
      return true;
    }
  }

  getWarning(state, questionCount, questionIndex, styles) {
    if (state &&
        state.unAnsweredQuestions &&
        state.unAnsweredQuestions.length > 0 &&
        questionIndex + 1 === questionCount) {
      return (
        <div style={styles.warning}>
          <i className="glyphicon glyphicon-exclamation-sign"></i> You left question(s) {state.unAnsweredQuestions.join()} blank. Use the "Progress" drop-down menu at the top to go back and answer the question(s), then come back and submit.
        </div>
      );
    }
  }

  getConfidenceLevels(showLevels, styles) {
    // if the question has been answered
    if (this.props.question.confidenceLevel) {
      return (
        <div className="confidence_feedback_wrapper" style={styles.confidenceFeedbackWrapper}>
          <p>
            Your confidence level in answering this question was: <strong>{`${this.props.question.confidenceLevel}`}</strong>.
          </p>
          {this.getConfidenceNavButton(styles)}
        </div>
      );
    }

    // if this is a formative assessment, show the confidence level buttons
    if (AssessmentStore.isFormative()) {
      return (
        <div className="confidence_wrapper" style={styles.confidenceWrapper}>
          <div style={styles.confidenceTitle}>
            How sure are you of your answer?
          </div>
          <input
            type="button"
            style={styles.maybeButton}
            className="btn btn-check-answer"
            value="Just A Guess"
            onClick={(e) => { this.confidenceLevelClicked(e, "Just A Guess", this.props.currentIndex); }}
            />
          <input
            type="button"
            style={{...styles.margin, ...styles.probablyButton}}
            className="btn btn-check-answer"
            value="Pretty Sure"
            onClick={(e) => { this.confidenceLevelClicked(e, "Pretty Sure", this.props.currentIndex); }}
            />
          <input
            type="button"
            style={{...styles.margin, ...styles.definitelyButton}}
            className="btn btn-check-answer"
            value="Very Sure"
            onClick={(e) => { this.confidenceLevelClicked(e, "Very Sure", this.props.currentIndex); }}
            />
        </div>
      );
    }
  }

  getConfidenceNavButton(styles) {
    if (this.props.currentIndex === this.props.questionCount - 1) {
      return this.getResultsButton(styles);
    } else {
      return this.getNextButton(styles);
    }
  }

  getResultsButton(styles) {
    return (
      <input
        type="button"
        style={{...styles.definitelyButton}}
        className="btn btn-check-answer"
        value="Show Results"
        onClick={(e) => { this.submitAssessment(); }}
        />
    );
  }

  getNavigationButtons(styles) {
    let assessmentKind = this.props.settings.assessmentKind ? this.props.settings.assessmentKind : null;

    if (this.oneQuestionAssessment()) {
      return;
    }

    if (!AssessmentStore.isFormative()) {
      return (
        <div className="navigationBtnWrapper" style={styles.navigationWrapper}>
          {this.getPreviousButton(styles)}
          {this.getNextButton(styles)}
        </div>
      );
    }
  }

  oneQuestionAssessment() {
    return this.props.questionCount === 1 ? true : false;
  }

  getNextButton(styles) {
    let disabled = (this.props.currentIndex === this.props.questionCount - 1) ? "disabled" : "";

    // if this is a formative assessment
    if (AssessmentStore.isFormative()) {
      return (
        <button
          className={"btn btn-next-item " + disabled}
          style={styles.nextButton}
          onClick={(e) => { this.nextButtonClicked(e); }}
          >
          Next Question
        </button>
      );
    } else {
      return (
        <button
          className={"btn btn-next-item " + disabled}
          style={styles.nextButton}
          onClick={(e) => { this.nextButtonClicked(e); }}
          >
            Next
        </button>
      );
    }
  }

  getPreviousButton(styles) {
    let disabled = this.props.currentIndex > 0 ? "" : "disabled";

    return (
      <button
        className={"btn btn-previous-item " + disabled}
        style={styles.previousButton}
        onClick={(e) => { this.previousButtonClicked(e); }}
        >
          Previous
      </button>);
  }

  getGeneralFeedbackMarkup(answer) {
    return { __html: answer.feedback }
  }

  questionDirections(styles) {
    // If this is a practice assessment, bail
    if (AssessmentStore.isPractice()) {
      return;
    }

    // if this is a multiple answer question
    if (this.props.question.question_type === "multiple_answers_question") {
      return (
        <div style={styles.chooseText}>Select all correct answers</div>
      );
    }

    // if this is a multiple dropdown question
    if (this.props.question.question_type === "multiple_dropdowns_question") {
      return (
        <div style={styles.chooseText}>Choose the best answer in each dropdown</div>
      );
    }
  }

  questionContent() {
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
    if (this.props.question.question_type !== 'multiple_dropdowns_question') {
      return (
        <div
          id="question-content"
          dangerouslySetInnerHTML={{ __html: this.props.question.material }}
          />
      );
    }
  }

  inputOrReview(styles) {
    if (!this.isSelfCheckResult() && !this.isPracticeResult()) {
      return (
        <UniversalInput
          item={this.props.question}
          isResult={false}
          chosen={this.props.studentAnswer}
          assessmentKind={this.props.settings.assessmentKind}
          registerGradingCallback={this.props.registerGradingCallback}
          shouldFocusForFeedback={false}
          />
      );
    } else {
      let answerFeedback = {};

      if (this.props.answerMessage && this.props.answerMessage.answerFeedback) {
        answerFeedback = this.props.answerMessage.answerFeedback;
      }

      return (
        <UniversalInput
          item={this.props.question}
          isResult={true}
          chosen={this.props.studentAnswer}
          assessmentKind={this.props.settings.assessmentKind}
          correctAnswers={this.props.question.correct}
          answerFeedback={answerFeedback}
          completed={Item.checkCompletion()}
          setFeedbackRef={this.setFeedbackRef.bind(this)}
          shouldFocusForFeedback={this.state.forceFeedbackFocus}
        />
      );
    }
  }

  submitAssessmentButton(styles) {
    if (AssessmentStore.isFormative() ||
        AssessmentStore.isPractice() ||
        (this.props.currentIndex !== this.props.questionCount - 1)) {
      return;
    }

    if (this.props.showAnswers) {
      if (this.props.currentIndex === this.props.questionCount - 1 &&
          Item.checkCompletion() === true &&
          AssessmentStore.hasSubmittedCurrent()) {
        return (
          <div style={styles.submitAssessmentButtonDiv}>
            <button
              className="btn btn-check-answer"
              style={styles.submitAssessmentButton}
              onClick={(e) => { this.submitAssessmentButtonClicked(e) }}
              >
                Submit
              </button>
          </div>
        );
      }
    } else {
      return (
        <div style={styles.submitAssessmentButtonDiv}>
          <button
            className="btn btn-check-answer"
            style={styles.submitAssessmentButton}
            onClick={(e) => { this.submitAssessmentButtonClicked(e) }}
            >
              Submit
          </button>
        </div>
      );
    }
  }

  checkAnswerButton(styles) {
    if (!AssessmentStore.isPractice()) {
      return;
    }

    let showingResult = this.props.answerMessage && AssessmentStore.hasSelectedAnswerForCurrent();

    return (
      <div style={styles.checkAnswerButtonDiv}>
        <button
          className="btn btn-check-answer"
          style={styles.checkAnswerButton}
          onClick={(e) => { this.checkAnswerButtonClicked(e) }}
          disabled={showingResult}
          >
            Check Answer
        </button>
      </div>
    );
  }

  formativeHeader() {
    if (AssessmentStore.isFormative()) {
      return (
        <FormativeHeader
          assessmentTitle={this.props.assessment.title}
          />
      );
    }
  }

  // Check if we need to display the counter in the top right
  simpleProgress(styles) {
    if (this.props.questionCount > 1 && AssessmentStore.isPractice()) {
      return (
        <span
          style={styles.counter}
          aria-label={`You are on question ${this.props.currentIndex + 1} of ${this.props.questionCount}`}
          >
            {this.props.currentIndex + 1} of {this.props.questionCount}
        </span>
      );
    }
  }

  setFeedbackRef(ref) {
    this.feedbackRef = ref;
  }

  newQuestionNotification(styles) {
    if (this.props.newQuestion) {
      const currQuestion = this.props.currentIndex + 1;
      const message = `New question is available. You are on question ${currQuestion} of ${this.props.questionCount}. Navigate to the assement text heading to read the question.`;
      return (<div style={styles.visuallyHidden}>{message}</div>);
    } else {
      return "";
    }
  }

  getStyles(theme) {
    let navMargin = "-35px 650px 0 0";

    if (this.props.settings.confidenceLevels) {
      navMargin = "-75px 20px 0 0";
    }

    let extraPadding = AssessmentStore.isFormative() ? "20px" : "";

    return {
      formativePadding: {
        padding: 0
      },
      assessmentContainer: {
        marginTop: "0px",
        borderRadius: theme.assessmentContainerBorderRadius
      },
      fullQuestion: {
        backgroundColor: AssessmentStore.isFormative() || AssessmentStore.isPractice() ? theme.fullQuestionBackgroundColor : "#fff",
        paddingBottom: "20px",
      },
      innerQuestion: {
        maxWidth: "650px",
      },
      questionText: {
        color: theme.questionTextColor,
        fontSize: theme.questionTextFontSize,
        fontWeight: theme.questionTextFontWeight,
        padding: theme.questionTextPadding
      },
      "questionText:focus": {
        outline: "none"
      },
      nextButton: {
        backgroundColor: theme.nextButtonBackgroundColor,
        color: theme.probablyColor,
        width: theme.probablyWidth,
        padding: "8px !important",
        margin: theme.nextButtonMargin,
      },
      previousButton: {
        backgroundColor: theme.previousButtonBackgroundColor,
        marginRight: "8px",
        color: theme.probablyColor,
        width: theme.probablyWidth,
        padding: "8px !important",
      },
      maybeButton: {
        width: theme.maybeWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.maybeColor,
        padding: "8px !important",
      },
      probablyButton: {
        width: theme.probablyWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.probablyColor,
        padding: "8px !important",
      },
      definitelyButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.definitelyColor,
        padding: "8px !important",
      },
      submitAssessmentButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.definitelyColor,
      },
      checkAnswerButton: {
        width: theme.probablyWidth,
        backgroundColor: theme.confidenceButtonBackgroundColor,
        color: theme.definitelyColor,
      },
      confidenceWrapper: {
        border: theme.confidenceWrapperBorder,
        borderRadius: theme.confidenceWrapperBorderRadius,
        width: theme.confidenceWrapperWidth,
        height: theme.confidenceWrapperHeight,
        padding: theme.confidenceWrapperPadding,
        backgroundColor: theme.confidenceWrapperBackgroundColor,
      },
      confidenceTitle: {
        marginBottom: "10px"
      },
      confidenceFeedbackWrapper: {
        border: theme.confidenceFeedbackWrapperBorder,
        borderRadius: theme.confidenceFeedbackWrapperBorderRadius,
        width: theme.confidenceFeedbackWrapperWidth,
        height: theme.confidenceFeedbackWrapperHeight,
        padding: theme.confidenceFeedbackWrapperPadding,
        margin: theme.confidenceFeedbackWrapperMargin,
        backgroundColor: theme.confidenceFeedbackWrapperBackgroundColor,
      },
      navigationWrapper: {
        height: theme.confidenceWrapperHeight,
        margin: theme.navigationWrapperMargin,
        marginTop: "30px",
        marginRight: "18px",
        backgroundColor: theme.confidenceWrapperBackgroundColor,
        display: "inline-block"
      },
      margin: {
       marginLeft: "5px"
      },
      navButtons: {
        margin: navMargin
      },
      submitAssessmentButtonDiv: {
        display: "inline-block",
        paddingLeft: "18px",
        borderLeft: "1px solid #c4cdd5"
      },
      checkAnswerButtonDiv: {
        margin: "25px 0 1em 17px",
      },
      warning: {
        margin: theme.confidenceWrapperMargin,
        border: "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: theme.maybeBackgroundColor,
        color: theme.maybeColor,
        padding: "8px 8px !important"
      },
      footer: {
        borderTop: "1px solid gray",
        borderBottom: "5px solid " + theme.footerBackgroundColor,
        position: "absolute",
        left: "0px",
        bottom: "1px",
        marginTop: "20px",
        width: "100%",
        height: theme.footerHeight,
        backgroundColor: theme.footerBackgroundColor,
      },
      footerPrev: {
        height: theme.footerHeight,
        width: "100px",
        float: "left",
      },
      footerNext: {
        height: theme.footerHeight,
        width: "100px",
        float: "right"
      },
      icon: {
        height: "62px",
        width: "62px",
        fontColor: theme.primaryBackgroundColor
      },
      data: {
        marginTop: "-5px"
      },
      selfCheck: {
        fontSize: "140%"
      },
      h4: {
        color: "#fff",
        fontWeight: "bold",
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: "normal",
        letterSpacing: "0px"
      },
      chooseText: {
        color: "#637381",
        fontWeight: "600",
        paddingBottom: "17px"
      },
      counter: {
        color: 'black',
        float: "right"
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
} // end item class

Item.propTypes = {
  question : React.PropTypes.object.isRequired,
  currentIndex : React.PropTypes.number.isRequired,
  questionCount : React.PropTypes.number.isRequired,
  answerMessage : React.PropTypes.object,
  confidenceLevels : React.PropTypes.bool.isRequired,
  outcomes : React.PropTypes.object,
  previousQuestion : React.PropTypes.func.isRequired,
  nextQuestion : React.PropTypes.func.isRequired,
  selectQuestion : React.PropTypes.func.isRequired,
  registerGradingCallback : React.PropTypes.func.isRequired
};

Item.contextTypes = {
  theme: React.PropTypes.object
};
