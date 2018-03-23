"use strict";

import React                from "react";
import RadioButton          from "../common/radio_button";
import Option               from "../common/option";
import TextField            from "../common/text_field";
import TextArea             from "../common/text_area";
import CheckBox             from "../common/checkbox";
import Matching             from "../common/matching";
import MomEmbed             from "../common/mom_embed";
import MultiDropDown        from '../common/multi_drop_down'
import CommunicationHandler from "../../utils/communication_handler";
import AssessmentStore      from "../../stores/assessment";

export default class UniversalInput extends React.Component{

  constructor(){
    super();
    CommunicationHandler.init();
  }

  componentDidMount(){
    CommunicationHandler.sendSizeThrottled();
    CommunicationHandler.hideLMSNavigation();
  }

  componentDidUpdate(){
    CommunicationHandler.sendSizeThrottled();
  }

  getStyles(props, theme){
    return {
      panel: {
        position: theme.panelPosition,
        marginBottom: theme.panelMarginBottom,
        backgroundColor: "transparent",//props.isResult ? "transparent" : theme.panelBackgroundColor,
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
        backgroundColor: "transparent" //props.isResult ? "transparent" : theme.panelHeadingBackgroundColor,
      },
      panelBody: {
        padding: theme.panelBodyPadding,
        marginTop: "-20px",
      }
    }
  }

  wasChosen(id){
    if( this.props.chosen ){
      return this.props.chosen.indexOf(id) > -1
    }else{
      return null;
    }
  }

  showAsCorrect(id){
    if( this.props.correctAnswers && this.props.correctAnswers[0] && this.props.correctAnswers[0].id){
      return this.props.correctAnswers[0].id.indexOf(id) > -1
    }else{
      return null;
    }
  }

  answerFeedback(id){
    if( this.props.answerFeedback && this.props.answerFeedback[id] ){
      return this.props.answerFeedback[id];
    } else {
      return null
    }
  }

  render(){
    var styles = this.getStyles(this.props, this.context.theme)
    var item = this.props.item;
    var assessmentResult = AssessmentStore.assessmentResult();
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
      case "multiple_choice_question":
      case "true_false_question":
        items = item.answers.map((answer) => {
          return <RadioButton assessmentKind={this.props.assessmentKind} isDisabled={this.props.isResult} key={item.id + "_" + answer.id} item={answer} name="answer-radio" checked={this.wasChosen(answer.id)}  showAsCorrect={this.showAsCorrect(answer.id)} answerFeedback={this.answerFeedback(answer.id)} />;
        });
        break;
      case "matching_question":
        items = <Matching assessmentKind={this.props.assessmentKind} isDisabled={this.props.isResult}  item={item} name="answer-option"/>;
        break;
      case "essay_question":
        items = <TextArea assessmentKind={this.props.assessmentKind} isDisabled={this.props.isResult} key="textarea_essay_input" item={item} initialText={this.props.chosen} />;
        break;
      case "multiple_answers_question":
        items = item.answers.map((answer) => {
          return <CheckBox assessmentKind={this.props.assessmentKind} isDisabled={this.props.isResult} key={item.id + "_" + answer.id} item={answer} name="answer-check" checked={this.wasChosen(answer.id)} showAsCorrect={this.showAsCorrect(answer.id)} answerFeedback={this.answerFeedback(answer.id)} />;
        });
        break;
      case "mom_embed":
        items = <MomEmbed assessmentKind={this.props.assessmentKind} key={item.id} item={item} redisplayJWT={this.props.chosen ? this.props.chosen : null} registerGradingCallback={this.props.registerGradingCallback} />;
        break;
      case 'multiple_dropdowns_question':
        items = <MultiDropDown assessmentKind={this.props.assessmentKind} isResult={this.props.isResult} key={item.id} item={item} selectedAnswers={this.props.chosen} selectCorrectAnswer={this.props.correctAnswers && this.props.correctAnswers.length > 0} />;
      break;
    }


    return (<div className="panel-messages-container panel panel-default" style={styles.panel}>
              <div className="panel-heading text-center" style={styles.panelHeading}>
                {/*{item.title}*/}
                {messages}
              </div>
              <div className={item.question_type === 'multiple_dropdowns_question' ? "" : "panel-body"}
                   style={styles.panelBody}
              >
                {items}
              </div>
              {solution}
            </div>

           );
  }
}
UniversalInput.propTypes = {
  item: React.PropTypes.object.isRequired,
  isResult: React.PropTypes.bool,
  registerGradingCallback: React.PropTypes.func.optional
};

UniversalInput.contextTypes = {
  theme: React.PropTypes.object
};
