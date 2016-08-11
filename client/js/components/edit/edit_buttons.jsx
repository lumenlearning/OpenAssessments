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
            <button name='save_quiz' className='btn btn-sm' onClick={this.props.handleSaveAssessment} style={style.addQuestionBtn}>
              <img style={style.addQuestionImg} src="/assets/upload.png" alt="Save Assessment"/>
            </button>
            Save Assessment
          </label>
          <label for="add_question" style={_.merge({}, style.addQuestionLbl, this.questionLblStyle())}>
            <button name='add_question' className='btn btn-sm' onClick={()=>this.handleAddQuestion(this.props.newQuestionLocation)} style={style.addQuestionBtn}>
              <img style={style.addQuestionImg} src="/assets/plus-52.png" alt="Add Question"/>
            </button>
            Add Question
          </label>
          <label for="studyplan" style={_.merge({}, style.addQuestionLbl, this.questionLblStyle())}>
            {this.props.windowWidth > 1000 ? 'Study Plan' : ''}
            <button name='studyplan' className='btn btn-sm' onClick={this.handlePostMessageHomeNav} style={style.addQuestionBtn}>
              <img style={_.merge({}, style.addQuestionImg, {width:'32px', height:'32px'})} src="/assets/return.png" alt="Study Plan"/>
            </button>
            {this.props.windowWidth < 1000 ? 'Study Plan' : ''}

          </label>
        </div>

    );
  }
  
  btnAreaStyle(){
    let styles = {};
    if(this.props.windowWidth <= 1000){
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
        marginLeft: '30%',
        width: '40%'
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
