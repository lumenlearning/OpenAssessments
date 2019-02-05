"use strict";

import React            from 'react';
import AssessmentActions    from "../../actions/assessment";

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
      head = <h4 style={{color: this.props.context.theme.definitelyBackgroundColor}}>{"Looks like you're getting it!"}</h4>;
      feedback = "You're ready to move on to the next section.";
      image = <img style={styles.outcomeIcon} src={this.props.settings.images.CheckMark_svg} />;
    } else if (score > 75){
      head = <h4 >{"You're making progress!"}</h4>;
      feedback = "You can learn more if you review before moving on.";
      image = <img style={styles.outcomeIcon} src={this.props.settings.images.Books_svg} />;
    } else {
      head = <h4>{"Needs Work!"}</h4>;
      feedback = "Make sure to review and learn the material before moving on.";
      image = <img style={styles.outcomeIcon} src={this.props.settings.images.PersonWithBook_svg} />;
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
      /*var material = "";
      material = ( <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.questions[index].material
                    }}>
                  </div> )*/

      var material = this.checkQuestionMaterial(index);

      return (
        <div key={"result-"+index}>
          <div style={styles.resultList}>
            <div><div style={{color: color, float: "left"}}>Question {index+1} -- {message}</div><div style={{color: confidenceColor, float: "right"}}>{this.props.assessmentResult.confidence_level_list[index]}</div></div>
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
          <div style={styles.formative}>
            <div className="row" style={styles.row}>
              <div className="col-md-12 col-lg-12" style={styles.outcomes}>
                <div style={styles.header}>{this.props.assessment ? this.props.assessment.title : ""}</div>
                <div style={styles.outcomeContainer}>
                  {image}
                  {head}
                  <div>{feedback}</div>
                  <div>{results}</div>
                  <div style={styles.buttonsDiv}>
                    <button className="btn btn-check-answer" style={styles.retakeButton}  onClick={(e)=>{this.retake()}}>Retake</button>
                  </div>
                </div>
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
