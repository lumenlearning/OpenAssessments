"use strict";

import React                from "react";
import RadioButton          from "../common/radio_button";
import Option               from "../common/option";
import TextField            from "../common/text_field";
import TextArea             from "../common/text_area";
import CheckBox             from "../common/checkbox";
import MappedImage          from "../common/mapped_image";
import Matching             from "../common/matching";
import DragAndDrop          from "../common/drag_and_drop";
import CommunicationHandler from "../../utils/communication_handler";

export default class UniversalInput extends React.Component{

  constructor(){
    super();
    CommunicationHandler.init();
  }

  componentDidMount(){
    CommunicationHandler.sendSize();
  }

  componentDidUpdate(){
    CommunicationHandler.sendSize();
  }

  getStyles(theme){
    return {
      panel: {
        position: theme.panelPosition,
        marginBottom: theme.panelMarginBottom,
        backgroundColor: theme.panelBackgroundColor,
        border: theme.panelBorder,
        borderRadius: theme.panelBorderRadius,
        boxShadow: theme.panelBoxShadow,
        borderColor: theme.panelBorderColor,
      },
      panelHeading: {
        padding: theme.panelHeadingPadding,
        borderBottom: theme.panelHeadingBorderBottom,
        borderTopRightRadius: theme.panelHeadingBorderTopRightRadius,
        borderTopLeftRadius: theme.panelHeadingBorderTopLeftRadius,
        textAlign: theme.panelHeadingTextAlign,
        backgroundColor: theme.panelHeadingBackgroundColor,
      },
      panelBody: {
        padding: theme.panelBodyPadding
      }
    }
  }
  render(){
    var styles = this.getStyles(this.context.theme)
    var item = this.props.item;
    var messages = '';
    var solution = '';
    var items = '';

    if(item.messages){
      var renderedMessages = item.messages.map(function(message){
       return (<li>{message}</li>);
      });
      messages = (<div className="panel-messages alert alert-danger" role="alert">
                   <ul>
                     {renderedMessages}
                   </ul>
                 </div>);
    }

    if(item.isGraded && item.solution){
      solution = (<div className="panel-footer text-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.solution
                    }}>
                  </div>
                 </div>);
    }

    switch(item.question_type){
      case "edx_multiple_choice":
      case "multiple_choice_question":
      case "true_false_question":
        items = item.answers.map((answer) => {
          return <RadioButton key={item.id + "_" + answer.id} item={answer} name="answer-radio"/>;
        });
        break;
      case "edx_dropdown":
        items = item.answers.map((answer) => {
          return <Option key={item.id + "_" + answer.id} item={answer} name="answer-option"/>;
        });
        break;
      case "matching_question":
        items = <Matching item={item} name="answer-option"/>;
        break;
      case "edx_numerical_input":
      case "edx_text_input":
        items = item.answers.map((answer) => {
          return <TextField key={item.id + "_" + answer.id} item={answer} name="answer-text"/>;
        });
        break;
      case "text_only_question":
        items = <TextArea />;
        break;
      case "multiple_answers_question":
        items = item.answers.map((answer) => {
          return <CheckBox key={item.id + "_" + answer.id} item={answer} name="answer-check"/>;
        });
        break;
      case "edx_image_mapped_input":
        items = item.answers.map((answer)=>{
          return <MappedImage key={item.id + "_" + answer.id} item={answer} />;
        });
        break;
      case"edx_drag_and_drop":
        items = item.answers.map((answer)=>{
          return <DragAndDrop key={item.id + "_" + answer.id} item={answer} />
        });
        break;
    }


    var material = '';
    if(item.edXMaterial){
      material = ( <div
                    dangerouslySetInnerHTML={{
                      __html: item.edXMaterial
                    }}>
                  </div> )
    }
    return (<div className="panel-messages-container panel panel-default" style={styles.panel}>
              <div className="panel-heading text-center" style={styles.panelHeading}>
                {item.title}
                {messages}
              </div>
              <div className="panel-body" style={styles.panelBody}>
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

UniversalInput.contextTypes = {
  theme: React.PropTypes.object
};