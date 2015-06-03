"use strict";

import React        from "react";
import RadioButton  from "../common/radio_button";
import Option       from "../common/option";
import TextField    from "../common/text_field";
import TextArea     from "../common/text_area";
import CheckBox     from "../common/checkbox";

export default class UniversalInput extends React.Component{

  render(){
    var messages = '';
    if (this.props.item.messages) {
    
      var renderedMessages = this.props.item.messages.map(function(message){
       return (<li>{message}</li>);
      });

      messages =  (<div className="panel-messages alert alert-danger" role="alert">
                   <ul>
                     {renderedMessages}
                   </ul>
                 </div>);
    }

    var solution = '';

    if (this.props.item.isGraded && this.props.item.solution) {
      solution = (<div className="panel-footer text-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.item.solution
                    }}>
                  </div>
                 </div>);
    }

    var items = '';
    if(this.props.item.question_type == "edx_multiple_choice" || this.props.item.question_type == "multiple_choice_question" || this.props.item.question_type == "true_false_question"){
      items = this.props.item.answers.map((item) => {
        return <RadioButton item={item} name="answer-radio"/>;
      });
    } else if(this.props.item.question_type == "edx_dropdown"){
      items = this.props.item.answers.map((item) => {
        return <Option item={item} name="answer-option"/>;
      });
    }
    else if(this.props.item.question_type == "edx_numerical_input" || this.props.item.question_type == "edx_text_input"){
      items = this.props.item.answers.map((item) => {
        return <TextField item={item} name="answer-text"/>;
      });
    } else if(this.props.item.question_type == "text_only_question"){
      items = <TextArea />;
    } else if(this.props.item.question_type == "multiple_answers_question"){
      items = this.props.item.answers.map((item) => {
        return <CheckBox item={item} name="answer-check"/>;
      });
    } else if (this.props.item.question_type == "edx_image_mapped_input"){
      items =
    }

    var material = '';
    if(this.props.item.edXMaterial){
      material = ( <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.item.edXMaterial
                    }}>
                  </div> )
    }
    return (<div className="panel-messages-container panel panel-default">
              <div className="panel-heading text-center">
                {this.props.item.title}
                {messages}
              </div>
              <div className="panel-body">
                {material}
                {items}  
              </div>
              {solution}
            </div>

           );
  }
}
UniversalInput.propTypes = {
  item: React.PropTypes.object.isRequired
};