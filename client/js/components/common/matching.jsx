"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";

export default class Matching extends React.Component{

  answerSelected(e, key){
    var target = e.target.parentNode.firstChild.textContent;
    var selectedAnswer = e.currentTarget.value;
    var answerNumber = e.currentTarget.name;
    var item = {
      id: target,
      selectedAnswer: selectedAnswer,
      answerNumber: answerNumber,
      item: this.props.item
    }

    AssessmentActions.answerSelected(item);
  }



  render(){
    var items = [];
    var material = [];
    var materialName = [];
    for(var i = 0; i < this.props.item.answers.length; i++){
      if(i%this.props.item.correct.length==0){
        materialName.push(this.props.item.answers[i].matchMaterial)
      }
    }
    for(var i = 0; i < this.props.item.correct.length; i++){
      var item = {
        id: this.props.item.correct[i].id,
        material: '',
        answers: []
      }
      for(var j =0; j < this.props.item.answers.length/this.props.item.correct.length; j++){
        item.material = this.props.item.answers[j].matchMaterial;
        item.answers.push(this.props.item.answers[j]);
      }
      items.push(item);
    }
    var materialItems = items.map((item, index)=>{
      var ref = "answer-" + index;
      return <div>{materialName[index]}<select key={ref}name={ref} onChange={(e, key) => {this.answerSelected(e, key)}}><option key={"defualt-option-key" + index} selected={null}>[Select Answer]</option>{
        item.answers.map((answer, i)=>{
          var selected; 
          var key = ref + "-option-" + i;
          if(AssessmentStore.studentAnswers()[index])
            selected = (AssessmentStore.studentAnswers()[index].selectedAnswer.trim() == answer.material.trim());
          return <option key={key} selected={selected}>{answer.material.trim()}</option>
      })}</select></div>
    })
    return(
      <div>
        {materialItems}
      </div>
    );
  }
}
Matching.propTypes = {
  item: React.PropTypes.object.isRequired
};