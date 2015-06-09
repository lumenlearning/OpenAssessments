"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";
import _                  from "lodash";

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

  getResponses(item){
    var responses = [];
    for(var i = 0; i < item.correct.length; i++){
      var response = {
        id: item.correct[i].id,
        material: '',
        answers: []
      }
      for(var j =0; j < item.answers.length/item.correct.length; j++){
        response.material = item.answers[j].matchMaterial;
        response.answers.push(item.answers[j]);
      }
      responses.push(response);
    }
    return responses;
  }

  getMaterialNames(){
    return _.chain(this.props.item.answers)
    .map((answer, i) => {
      return answer.matchMaterial;
    })
    .uniq()
    .value();
  }

  render(){
    var responses = this.getResponses(this.props.item);
    var materialNames = this.getMaterialNames();
    
    var materialItems = responses.map((item, index)=>{
      var name = "answer-" + index;
      var ref = "answer-" + item.id;
      
      var answers = (AssessmentStore.studentAnswers()) ? AssessmentStore.studentAnswers()[index] : {selectedAnswer: ""};
      var selectedAnswer;
      var options = item.answers.map((answer, i)=>{
        if(answers && (answers.selectedAnswer.trim() == answer.material.trim())){
          selectedAnswer = answers.selectedAnswer.trim();
        }
        return <option key={ref + "-option-" + i} value={answer.material.trim()}>{answer.material.trim()}</option>
      });
      return <div>
        {materialNames[index]}
        <select key={ref} name={name} value={selectedAnswer} onChange={(e, key) => {this.answerSelected(e, key)}}>
          <option key={"default-option-key" + index} selected={null}>[Select Answer]</option>
          { options }
        </select>
      </div>;
    });

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