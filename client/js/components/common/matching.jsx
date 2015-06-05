"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class Matching extends React.Component{

  answerSelected(e, key){
    console.log(e);
    var target = e.target.parentNode.textContent;
    var selectedAnswer = e.currentTarget.attributes.value;
    var item = {
      id: target,
      selectedAnswer: selectedAnswer,
      item: this.props.item
    }
    debugger;
    AssessmentActions.answerSelected(item);
  }



  render(){

    // var items = this.props.item.material.split(",");
    // var materialItems = items.map((mat) =>{
    //   return <option value={mat} name={this.props.name}>{mat}</option>;
    // });
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
      return <div>{materialName[index]}<select onChange={(e, key) => {this.answerSelected(e, key)}}><option>Select Answer</option>{item.answers.map((answer)=>{
        return <option>{answer.material}</option>
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