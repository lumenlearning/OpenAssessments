"use strict";

import React              from 'react';
import AssessmentStore    from "../../stores/assessment";
import SettingsStore      from "../../stores/settings";
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import ItemResult         from "./item_result";
import $                  from "jquery";

export default class AssessmentResult extends BaseComponent{

  constructor(props, context){
    super(props, context);
    this._bind("getItemResults", "getStyles", "getOutcomeLists", "getContent", "getFormativeContent", "retake");
    this.stores = [AssessmentStore, SettingsStore];
    this.state = this.getState();
  }

  getState(props, context){

    return {
      assessmentResult : AssessmentStore.assessmentResult(),
      timeSpent        : AssessmentStore.timeSpent(),
      questions        : AssessmentStore.allQuestions(),
      outcomes         : AssessmentStore.outcomes(),
      settings         : SettingsStore.current(),
      assessment       : AssessmentStore.current(),
    }
  }

  retake(){
    AssessmentActions.retakeAssessment();
    this.context.router.transitionTo("assessment");
  }

  jump(e){
    e.preventDefault();
    $('iframe, html, body').animate({
    scrollTop: $(document.getElementById("questionsStart")).offset().top
    }, 500);
  }

  onResize(){
    console.log(this.state)
  }

  getStyles(theme){

    return {
      assessment: {
        padding: theme.assessmentPadding,
        backgroundColor: theme.assessmentBackground,
      },
      progressStyle: {
        width:"100%"
      },
      wrapperStyle:{
        width: "100%",
        position: "relative"
      },
      yourScoreStyle: {
        backgroundColor: theme.definitelyBackgroundColor,
        color: "#fff",
        borderRadius: "25px",
        textAlign: "center",
        padding: "10px 20px 20px 20px"
      },
      improveScoreStyle:{
        color: "#f00"
      },
      green: {
        color: "#458B00"
      },
      assessmentContainer:{
        marginTop: "70px",
        boxShadow: theme.assessmentContainerBoxShadow,
        borderRadius: theme.assessmentContainerBorderRadius,
        padding: "20px"
      },
      resultsStyle: {
        padding: "20px"
      },
      formative: {
        padding: "0px 30px 20px 30px",
        marginTop: "0px",

      },
      icon: {
        height: "62px",
        width: "62px",
      },
      data: {
        marginTop: "-5px"
      },
      selfCheck: {
        fontSize: "140%"
      },
      outcomes: {
        backgroundColor: "rgba(204, 204, 204, .2)",

      },
      row: {
        padding: "15px",

      },
      outcomeContainer: {
        textAlign: "center",
        marginTop: "70px"
      },
      outcomeIcon: {
        width: "100px",
        height: "100px",
        marginTop: "80px"
      },
      header: {
        padding: "15px",
        backgroundColor: theme.probablyBackgroundColor,
        position: "absolute",
        top: "0px",
        left: "0px",
        fontSize: "140%",
        color: "white",
        width: "100%"
      },
      resultList: {
        width: "50%",
        margin: "auto",
        overflowY: "hidden",
      },
      resultOutcome: {
        textAlign: "left"
      },
      retakeButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor,
        color: theme.definitelyColor,
        marginBottom: "10px"
      },
      jumpButton: {
        marginTop: "10px",
        width: theme.definitelyWidth,
        backgroundColor: theme.submitBackgroundColor,
        color: theme.definitelyColor,
      },
        exitButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.probablyBackgroundColor,
        color: theme.definitelyColor,
        marginLeft: "15px"
      },
      buttonsDiv: {
        marginTop: "20px",
        marginBottom: "50px"
      },
      titleBar: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.probablyBackgroundColor,
        color: "white",
        fontSize: "130%",
        //fontWeight: "bold"
      },
      warningStyle: {
        width: "100%",
        padding:  "20px",
        backgroundColor: theme.maybeBackgroundColor,
        borderRadius: "4px",
        marginTop: "30px",
        color: "white",
        fontWeight: "bold",
        fontSize: "130%"
      }
    }
  }

  getItemResults(){
    return this.state.questions.map((question, index)=>{
      return <ItemResult question={question} isCorrect={this.state.assessmentResult.correct_list[index]} confidence={this.state.assessmentResult.confidence_level_list[index]}/>;
    })
  }

  getOutcomeLists(styles){
    var lists = {
      positiveList: [],
      negativeList: [],
    };
    var sectionIndex = 0;
    var perSecCount = 0;
    var correctCount = 0;
    var correctList = this.state.assessmentResult.correct_list;
    for(var i = 0; i < correctList.length; i++){
      //make sure to check to see if the amount of questions per section is less the ammount chosen per section
      var correct = correctList[i]
      perSecCount++;

      if(!correct || correct == "partial"){
        lists.negativeList.push(this.state.outcomes[sectionIndex]);
        i += (this.state.settings.perSec - perSecCount);
        sectionIndex++;
        perSecCount = 0;
        continue;
      } else {
        correctCount++;
        if(correctCount == this.state.settings.perSec || correctCount == this.state.assessment.sections[sectionIndex + 1].items.length){
          lists.positiveList.push(this.state.outcomes[sectionIndex]);
          correctCount = 0;
        }
      }

      if(perSecCount == this.state.settings.perSec || perSecCount == this.state.assessment.sections[sectionIndex + 1].items.length){
        sectionIndex++;
        correctCount = 0;
        perSecCount = 0;
      }
    }

    var positiveList = lists.positiveList.map((item, index)=>{
      return <div key={"positive " + index}><p style={styles.green}><i className="glyphicon glyphicon-ok" style={styles.green}></i>{item.shortOutcome}</p></div>;
    });

    var negativeList = lists.negativeList.map((item, index)=>{
      return <div key={"negative " + index}><p>{item.shortOutcome}</p></div>;
    });
    return {
      positiveList: positiveList,
      negativeList: negativeList
    };
  }
  // for sumative and swyk assessments
  getContent(styles, itemResults, outcomeLists, contentData){

    var errors = "";

    if(this.state.assessmentResult.errors && this.state.assessmentResult.errors.length > 0){
      errors =  <div className="row">
                  <div className="col-md-12">
                    <div style={styles.warningStyle}>
                      This quiz was not setup correctly. Contact your instructor.
                    </div>
                  </div>
                </div>
    }

    return (<div style={styles.assessment}>
      <div style={styles.assessmentContainer}>
        <div style={styles.titleBar}>{this.state.assessment ? this.state.assessment.title : ""}</div>
        {errors}
        <div className="row" style={styles.wrapperStyle}>

          <div className="col-md-4" >
            <h3><strong>Your Score</strong></h3>
            <div style={styles.yourScoreStyle}>
              <h1 style={styles.center}>{Math.trunc(this.state.assessmentResult.score)}%</h1>
            </div>
            Time Spent: {this.state.timeSpent.minutes} mins {this.state.timeSpent.seconds} sec
            <br />
            <button className="btn btn-check-answer" style={styles.jumpButton}  onClick={(e)=>{this.jump(e)}}>Jump To Questions</button>
          </div>

          <div className="col-md-4" >
            <h3><strong>{contentData.goodWork}</strong></h3>
            <p>You answered questions that covered these concepts correctly.</p>
            {outcomeLists.positiveList}
            <div style={{clear: 'both'}}></div>
          </div>

          <div className="col-md-4" >
            <h3 style={styles.improveScoreStyle}><strong>{contentData.moreToLearn}<i styleclassName="glyphicon glyphicon-warning-sign" ></i></strong></h3>
            <p>{contentData.focusStudy}</p>
            {outcomeLists.negativeList}
          </div>

        </div>
        <hr />
        <div id="questionsStart" style={styles.resultsStyle}>
          {itemResults}
        </div>

      </div>
    </div>)
  }

  // this will be used only when the assessment kind is formative
  getFormativeContent(styles, OutcomeLists){
    var score = Math.trunc(this.state.assessmentResult.score);
    var image = "";
    var feedback = "";
    var head = "";
    if(score == 100){
      head = <h4 style={{color: this.context.theme.probablyBackgroundColor}}>{"Looks like you're getting it!"}</h4>
      feedback = "You're ready to move on to the next section.";
      image = <img style={styles.outcomeIcon} src={this.state.settings.images.CheckMark_svg} />
    } else if (score > 75){
      head = <h4 >{"You're making progress!"}</h4>
      feedback = "You can learn more if you review before moving on.";
      image = <img style={styles.outcomeIcon} src={this.state.settings.images.Books_svg} />;
    } else {
      head = <h4>{"Needs Work!"}</h4>
      feedback = "You can learn more if you review before moving on.";
      image = <img style={styles.outcomeIcon} src={this.state.settings.images.PersonWithBook_svg} />;
    }

    var results = this.state.questions.map((question, index)=>{
      var color = this.state.assessmentResult.correct_list[index] ? this.context.theme.probablyBackgroundColor : this.context.theme.maybeBackgroundColor;
      var message = this.state.assessmentResult.correct_list[index] ? "Correct" : "Incorrect";
      var confidenceColor;
      if(this.state.assessmentResult.correct_list[index] == "partial"){
        color = this.context.theme.partialColor;
        message = "Partially Correct"
      }
      if (this.state.assessmentResult.confidence_level_list[index] == "Just A Guess"){
        confidenceColor = this.context.theme.maybeBackgroundColor;
      } else if (this.state.assessmentResult.confidence_level_list[index] == "Pretty Sure"){
        confidenceColor = this.context.theme.probablyBackgroundColor;
      } else {
        confidenceColor = this.context.theme.definitelyBackgroundColor;
      }
      return <div key={"result-"+index}>
              <div style={styles.resultList}>
                <div><div style={{color: color, float: "left"}}>Question {index+1} -- {message}</div><div style={{color: confidenceColor, float: "right"}}>{this.state.assessmentResult.confidence_level_list[index]}</div></div>
              </div>
              <div style={{...styles.resultList, ...styles.resultOutcome}}>
                <div style={{width: "70%"}}>{this.state.questions[index].outcomes.longOutcome}</div>
              </div>
            </div>
    });

    return <div style={styles.assessment}>
            <div style={styles.assessmentContainer}>
              <div style={styles.formative}>
                <div className="row" style={styles.row}>
                  <div className="col-md-12 col-lg-12" style={styles.outcomes}>
                    <div style={styles.header}>2.1 Excersize 2</div>
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
  }

  render(){
    var styles = this.getStyles(this.context.theme);
    var content = "There has been an error, contact your system administrator.";
    var contentData = {
          goodWork:"Good Work on These Concepts",
          moreToLearn:"There is Still More to Learn",
          focusStudy:"Review these concepts before your last quiz attempt or to prepare for your next performance assessment."
        }

    if(this.state.settings.assessmentKind.toUpperCase() == "SHOW_WHAT_YOU_KNOW"){
      contentData = {
        goodWork: "What You Already Know",
        moreToLearn: "What You Need to Learn",
        focusStudy: "Focus enough study time on these concepts to learn them well."
      }
    }

    if(this.state.assessmentResult == null){
      return <div />
    }

    var itemResults = this.getItemResults();
    var outcomeLists = this.getOutcomeLists(styles);
    var content = <div/>;

    if(this.state.settings.assessmentKind.toUpperCase() == "FORMATIVE"){
      content = this.getFormativeContent(styles, outcomeLists);
    } else {
      content = this.getContent(styles, itemResults, outcomeLists, contentData);
    }
    return  <div>
              {content}
            </div>
  }
}

AssessmentResult.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func
}

