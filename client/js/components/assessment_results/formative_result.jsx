"use strict";
// Dependencies
import React from "react";
// Actions
import AssessmentActions from "../../actions/assessment";
// Utilities
import CommHandler from "../../utils/communication_handler";

//polyfill trunc
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};

export default class FormativeResult extends React.Component {
  constructor(props, context) {
    super(props, context);

    CommHandler.init();
  }

  render() {
    let styles = this.props.styles;
    let resultFeedback = this.getResultFeedback(styles);

    return (
      <div style={styles.assessment}>
        <div style={styles.assessmentContainer}>
          <div style={styles.outcomes}>
            <header role="banner" style={styles.header} tabIndex="0">
              {this.getTitle()}
            </header>
            <main role="main" style={styles.outcomeContainer}>
              <img style={resultFeedback.imageStyle} src={resultFeedback.imageSrc} role="presentation" />
              <h1 style={styles.formativeResultHeader} tabIndex="0" ref="resultHeader">
                {resultFeedback.header}
              </h1>
              <p style={styles.formativeResultFeedback} tabIndex="0">
                {resultFeedback.feedback}
              </p>

              {this.renderResultsTable(styles)}

              <div style={styles.buttonsDiv}>
                <button
                  className="btn btn-check-answer"
                  style={styles.retakeButton}
                  onClick={(e) => { this.retake(); }}
                  >
                    Retake Quiz
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    CommHandler.sendSizeThrottled();
    CommHandler.showLMSNavigation();

    if (this.refs.resultHeader) {
      React.findDOMNode(this.refs.resultHeader).focus();
    }
  }

  renderResultsTable(styles) {
    return (
      this.props.questions.map((question, index) => {
        let confidenceFeedback = this.confidenceFeedback(index);
        let questionFeedback = this.questionFeedback(index);

        return (
          <div key={"result-" + index}>
            <div style={styles.resultList}>
              <div>
                <div style={{color: questionFeedback.color, ...styles.resultListInner}} tabIndex="0">
                  Question {index + 1} &mdash; {questionFeedback.message}
                </div>

                <div style={{color: confidenceFeedback, float: "right", marginTop: "20px"}} tabIndex="0">
                  {this.props.assessmentResult.confidence_level_list[parseInt(index)]}
                </div>
              </div>
            </div>

            <div style={{...styles.resultList, ...styles.resultOutcome}}>
              <div style={{width: "70%"}}>
                {this.checkQuestionMaterial(index)}
              </div>
            </div>
          </div>
        );
      })
    );
  }

  getResultFeedback(styles) {
    let score = this.getScore();
    let feedback = "";
    let header = "";
    let imageSrc = "";
    let imageStyle = styles.outcomeIcon;

    if (score === 100) {
      feedback = "You're ready to move on to the next section.";
      header = "Looks like you're getting it";
      imageSrc = "/assets/onTrack@2x.png";
    } else if (score > 75) {
      feedback = "You can learn more if you review before moving on.";
      header = "You're making progress";
      imageSrc = "/assets/goodWork@2x.png";
    } else {
      feedback = "Make sure to review and learn the material before moving on.";
      header = "Needs Work";
      imageSrc = "/assets/needsWork@2x.png";
      imageStyle = { maxWidth: "247px", marginTop: "49px" };
    }

    return {
      feedback,
      header,
      imageSrc,
      imageStyle
    };
  }

  getScore() {
    return Math.trunc(this.props.assessmentResult.score);
  }

  getTitle() {
    return this.props.assessment ? this.props.assessment.title : "";
  }

  confidenceFeedback(index) {
    let confidenceColor;

    if (this.props.assessmentResult.confidence_level_list[parseInt(index)] === "Just A Guess") {
      confidenceColor = this.props.context.theme.maybeBackgroundColor;
    } else if (this.props.assessmentResult.confidence_level_list[parseInt(index)] === "Pretty Sure") {
      confidenceColor = this.props.context.theme.probablyBackgroundColor;
    } else {
      confidenceColor = this.props.context.theme.definitelyBackgroundColor;
    }

    return confidenceColor;
  }

  questionFeedback(index) {
    let color;
    let message;

    if (this.props.assessmentResult.correct_list[parseInt(index)] === "partial") {
      color = this.props.context.theme.partialColor;
      message = "Partially Correct";
    } else if (this.props.assessmentResult.correct_list[parseInt(index)]) {
      color = this.props.context.theme.definitelyBackgroundColor;
      message = "Correct";
    } else {
      color = this.props.context.theme.maybeBackgroundColor;
      message = "Incorrect";
    }

    return {
      color,
      message
    };
  }

  checkQuestionMaterial(index) {
    let question = this.props.questions[index];
    let chosenAnswers = this.props.assessmentResult.lti_params.itemToGrade.answers[index];
    let material = question.material;

    if (question.question_type === "multiple_dropdowns_question") {
      let shortcodes = Object.keys(question.dropdowns);
      let re = new RegExp(`\\[${shortcodes.join('\\]|\\[')}\\]`, 'gi');

      material = material.replace(re, (shortcode) => {
        let re = new RegExp('\\[|\\]', 'g');
        let nShortcode = shortcode.replace(re, ''); //from '[shortcode]' to 'shortcode'
        let answerId = chosenAnswers.find((answer) => {
          return answer.dropdown_id === nShortcode;
        }).chosen_answer_id;
        let chosenAnswerVal = question.dropdowns[nShortcode].find((dropdown) => {
          return dropdown.value === answerId;
        }).name;

        return (
          <strong>{chosenAnswerVal}</strong>
        );
      });
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
    return (
      <div dangerouslySetInnerHTML={{__html: material}} tabIndex="0" />
    );
  }

  retake() {
    AssessmentActions.retakeAssessment();
    this.props.context.router.transitionTo("start");
  }
}
