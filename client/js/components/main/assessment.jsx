"use strict";

import React              from 'react';
import AssessmentStore    from "../../stores/assessment";
import SettingsStore      from "../../stores/settings";
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import Loading            from "../assessments/loading";
import CheckUnderstanding from "../assessments/check_understanding";
import Item               from "../assessments/item";

export default class Assessment extends BaseComponent{
 
  constructor(){
    super();
    this.stores = [AssessmentStore, SettingsStore];
    this.state = this.getState();
  }

  getState(){
    var showStart = SettingsStore.current().enableStart && !AssessmentStore.isStarted();
    return {
      assessment       : AssessmentStore.current(),
      isLoaded         : AssessmentStore.isLoaded(),
      question         : AssessmentStore.currentQuestion(),
      currentIndex     : AssessmentStore.currentIndex(),
      questionCount    : AssessmentStore.questionCount(),
      assessmentResult : AssessmentStore.assessmentResult(),
      showStart        : showStart,
      settings         : SettingsStore.current()
    }
  }

  componentDidMount(){
    super.componentDidMount();
    if(this.state.isLoaded){
      // Trigger action to indicate the assessment was viewed
      AssessmentActions.assessmentViewed(this.state.settings, this.state.assessment);  
    }
  }

  render(){
    var content;

    if(!this.state.isLoaded){
      content = <Loading />;  
    } else if(this.state.showStart){
      content = <CheckUnderstanding name={this.state.question.name} />;
    } else {
      content = <Item 
        question         = {this.state.question}
        currentIndex     = {this.state.currentIndex}
        settings         = {this.state.settings}
        questionCount    = {this.state.questionCount}
        assessmentResult = {this.state.assessmentResult} />;

      // TODO figure out when to mark an item as viewed. assessmentResult must be valid before this call is made.
      // AssessmentActions.itemViewed(this.state.settings, this.state.assessment, this.state.assessmentResult);
    }

    return <div className="assessment">
      <div className="section_list">
        <div className="section_container">
          {content}
        </div>
      </div>
    </div>;
  }

}