"use strict";

import React         from "react";
import BaseComponent from '../base_component.jsx';
import Style         from './css/style';

import ReviewAssessmentActions        from "../../actions/review_assessment";
import ReviewAssessmentStore          from "../../stores/review_assessment";
import CommunicationHandler           from "../../utils/communication_handler";

export default class EditButtons extends BaseComponent {

  constructor(props, state) {
    super(props, state);
    this._bind('handlePostMessageHomeNav', 'questionLblStyle', 'btnAreaStyle');
  }


  render() {
    let style = Style.styles();

    return (
        <div className="eqNewQuestion" style={_.merge({}, style.eqNewQuestion, this.btnAreaStyle())}>
          <label for="save_quiz" style={_.merge({}, style.addQuestionLbl, this.questionLblStyle())}>
            <button name='save_quiz' className='btn btn-sm' onClick={this.props.handleSaveAssessment} style={_.merge({}, style.addQuestionBtn, this.btnStyle())}>
              <img style={_.merge({}, style.addQuestionImg, this.btnIconStyle())} src="/assets/upload.png" alt="Save Assessment"/>
            </button>
            Save Assessment
          </label>
          <label for="add_question" style={_.merge({}, style.addQuestionLbl, this.questionLblStyle())}>
            <button name='add_question' className='btn btn-sm' onClick={()=>this.handleAddQuestion(this.props.newQuestionLocation)} style={_.merge({}, style.addQuestionBtn, this.btnStyle())}>
              <img style={_.merge({}, style.addQuestionImg, this.btnIconStyle())} src="/assets/plus.png" alt="Add Question"/>
            </button>
            Add Question
          </label>
          <label for="studyplan" style={_.merge({}, style.addQuestionLbl, this.questionLblStyle())}>
            {this.props.windowWidth >= 600 ? 'Study Plan' : ''}
            <button name='studyplan' className='btn btn-sm' onClick={this.handlePostMessageHomeNav} style={_.merge({}, style.addQuestionBtn, this.btnStyle())}>
              <img style={_.merge({}, style.addQuestionImg, this.btnIconStyle())} src="/assets/return.png" alt="Study Plan"/>
            </button>
            {this.props.windowWidth < 600 ? 'Study Plan' : ''}

          </label>
        </div>

    );
  }

  btnAreaStyle(){
    let styles = {};
    if(this.props.windowWidth <= 600){
      styles = {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        margin: '20px auto 0px'
      }
    }

    return styles;
  }

  questionLblStyle(){
    let styles = {};
    if(this.props.windowWidth <= 1000){
      styles = {
        // marginLeft: '30%',
        // width: '40%'
        fontSize: '16px'
      }
    }

    return styles;
  }

  btnStyle(){
    let styles = {};
    if(this.props.windowWidth <= 1000){
      styles = {
        width: '38px',
        height: '38px'
      }
    }

    return styles;
  }

  btnIconStyle(){
    let styles = {};
    if(this.props.windowWidth <= 1000){
      styles = {
        width: '30px',
        height: '30px'
      }
    }

    return styles;
  }

  handleAddQuestion(placement) {
    ReviewAssessmentActions.addNewAssessmentQuestion(placement);
  }

  handlePostMessageHomeNav(e) {
    if (ReviewAssessmentStore.isDirty()) {
      var r = confirm("If you leave your changes won't be saved.");
      if (r == true) {
        CommunicationHandler.navigateHome();
      }
    } else {
      CommunicationHandler.navigateHome();
    }
  }

}
