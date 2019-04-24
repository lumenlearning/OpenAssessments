"use strict";

import React from 'react';
import AssessmentActions from "../../actions/assessment";

//polyfill trunc
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};

export default class FormativeResult extends React.Component{

  retake(){
    AssessmentActions.retakeAssessment();
    this.props.context.router.transitionTo("start");
  }

  render() {
    var score = Math.trunc(this.props.assessmentResult.score);
    var image = "";
    var feedback = "";
    var head = "";
    var styles = this.props.styles;

    if(score == 100){
      head = <p style={{color: "#212b36", fontSize: "18px", fontWeight: 500, marginTop: "32px"}}>Looks like you're getting it</p>;
      feedback = "You're ready to move on to the next section.";
      image = <img style={styles.outcomeIcon} src={"/assets/onTrack@2x.png"} />;
    } else if (score > 75){
      head = <p style={{color: "#212b36", fontSize: "18px", fontWeight: 500, marginTop: "32px"}}>You're making progress</p>;
      feedback = "You can learn more if you review before moving on.";
      image = <img style={styles.outcomeIcon} src={"/assets/goodWork@2x.png"} />;
    } else {
      head = <p style={{color: "#212b36", fontSize: "18px", fontWeight: 500, marginTop: "32px"}}>Needs Work</p>;
      feedback = "Make sure to review and learn the material before moving on.";
      image = <img style={{maxWidth: "247px", marginTop: "49px"}} src={"/assets/needsWork@2x.png"} />;
    }

    var results = this.props.questions.map((question, index)=>{
      var color = this.props.assessmentResult.correct_list[index] ? this.props.context.theme.definitelyBackgroundColor : this.props.context.theme.maybeBackgroundColor;
      var message = this.props.assessmentResult.correct_list[index] ? "Correct" : "Incorrect";
      var confidenceColor;
      if(this.props.assessmentResult.correct_list[index] == "partial"){
        color = this.props.context.theme.partialColor;
        message = "Partially Correct"
      }
      if (this.props.assessmentResult.confidence_level_list[index] == "Just A Guess"){
        confidenceColor = this.props.context.theme.maybeBackgroundColor;
      } else if (this.props.assessmentResult.confidence_level_list[index] == "Pretty Sure"){
        confidenceColor = this.props.context.theme.probablyBackgroundColor;
      } else {
        confidenceColor = this.props.context.theme.definitelyBackgroundColor;
      }

      var material = this.checkQuestionMaterial(index);

      return (
        <div key={"result-" + index}>
          <div style={styles.resultList}>
            <div>
              <div style={{color, ...styles.resultListInner}}>
                Question {index + 1} &mdash; {message}
              </div>
              <div style={{color: confidenceColor, float: "right", marginTop: "20px"}}>
                {this.props.assessmentResult.confidence_level_list[index]}
              </div>
            </div>
          </div>
          <div style={{...styles.resultList, ...styles.resultOutcome}}>
            <div style={{width: "70%"}}>{material}</div>
          </div>
        </div>
      )
    });

    return (
      <div style={styles.assessment}>
        <div style={styles.assessmentContainer}>
          <div style={styles.outcomes}>
            <div style={styles.header}>{this.props.assessment ? this.props.assessment.title : ""}</div>
            <div style={styles.outcomeContainer}>
              {image}
              {head}
              <p style={{color: "#637381", fontSize: "14px", fontWeight: "normal"}}>{feedback}</p>
              <div>{results}</div>
              <div style={styles.buttonsDiv}>
                <button
                  className="btn btn-check-answer"
                  style={styles.retakeButton}
                  onClick={(e) => { this.retake(); }}
                  >
                    Retake Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  checkQuestionMaterial(index) {
    let question = this.props.questions[index];
    let chosenAnswers = this.props.assessmentResult.lti_params.itemToGrade.answers[index];
    let material = question.material;

    if(question.question_type == 'multiple_dropdowns_question') {
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


        return `<strong>${chosenAnswerVal}</strong>`;

      });
    }

    return (
      <div dangerouslySetInnerHTML={{__html: material}} />
    );

  }//checkQuestionMaterial

}
