"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";

export default class RadioButton extends React.Component{
  
  answerSelected(){
    AssessmentActions.answerSelected(this.props.item);
  }

  getStyles(props, theme){
    return {
      btnQuestion:{
        whiteSpace: theme.btnQuestionWhiteSpace,
        background: "transparent",//props.isDisabled? "transparent" : theme.btnQuestionBackground,
        color: theme.btnQuestionColor,
        textAlign: theme.btnQuestionTextAlign,
        padding: theme.btnQuestionPadding,
        marginBottom: theme.btnQuestionMarginBottom,
        display: theme.btnQuestionDisplay,
        width: theme.btnQuestionWidth,
        verticalAlign: theme.btnQuestionVerticalAlign,
        fontWeight: theme.btnQuestionFontWeight,
        touchAction: theme.btnQuestionTouchAction,
        cursor: theme.btnQuestionCursor,
        border: theme.btnQuestionBorder,
        fontSize: theme.btnQuestionFontSize,
        lineHeight: theme.btnQuestionLineHeight,
        borderRadius: theme.btnQuestionBorderRadius
      },

      radioText: {
        color: theme.radioTextColor,
        fontWeight: theme.radioTextFontWeight,
        marginLeft: theme.radioTextMarginLeft,
      }
    }
  }
  render(){
    var styles = this.getStyles(this.props, this.context.theme)
    var checked = (this.props.item.id == AssessmentStore.studentAnswers()) ? "true" : null;
    var radio = !this.props.isDisabled ? <input type="radio" defaultChecked={checked} name={this.props.name} onClick={()=>{ this.answerSelected() }}/> : <input type="radio" disabled="true" name={this.props.name} onClick={()=>{ this.answerSelected() }}/>;
    return (
      
      <div className="btn btn-block btn-question" style={styles.btnQuestion}>
        <label>
          {radio}
          <span className="radio-text" style={styles.radioText}>{this.props.item.material}</span>
        </label>
      </div>
    );
  }
}

RadioButton.propTypes = { 
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired,
  isDisabled: React.PropTypes.bool
};

RadioButton.contextTypes = {
  theme: React.PropTypes.object
}