"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";
import AssessmentStore    from "../../stores/assessment";

export default class CheckBox extends React.Component{
  
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
      span: {
        fontWeight: "normal !important",
        marginLeft: "5px"
      }
    }
  }

  render(){
    var styles = this.getStyles(this.props, this.context.theme);
    var checked = null;
    if( this.props.checked === true ) {
      checked = "true";
    } else if ( this.props.checked === false ){
      checked = false;
    } else if ( !this.props.isDisabled ) {
      checked = (AssessmentStore.studentAnswers() && AssessmentStore.studentAnswers().indexOf(this.props.item.id) > -1) ? "true" : null;
    }
    var checkBox = <input type="checkbox" defaultChecked={checked} disabled={this.props.isDisabled} name={this.props.name} onClick={()=>{ this.answerSelected() }}/>;

    return (
      <div className="btn btn-block btn-question" style={styles.btnQuestion}>
        <label>
          {checkBox}
          <span style={styles.span}>{this.props.item.material}</span>
        </label>
      </div>
    );
  }
}

CheckBox.propTypes = { 
  item: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired
};

CheckBox.contextTypes = {
  theme: React.PropTypes.object
};
