"use strict";
import theme from "./lumen_learning.js";

export default {
  btnQuestion:{
    whiteSpace: theme.btnQuestionWhiteSpace,
    background: theme.btnBackground,
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
  btnQuestionCorrect: {
    background: theme.btnCorrectBackground,
    border: theme.btnCorrectBorder,
  },
  btnQuestionIncorrect: {
    background: theme.btnIncorrectBackground,
    border: theme.btnIncorrectBorder,
  },
  btnQuestionNeutral: {
    background: theme.btnNeutralBackground,
    border: theme.btnNeutralBorder,
  },
  btnLabel: {
    marginBottom: 0,
  },
  span: {
    fontWeight: "normal !important",
    marginLeft: "11px"
  },
  externalFeedbackCorrect: {
    backgroundColor: '#f0faed',
    border: '1px solid #108043',
    borderRadius: '5px',
    margin: '5px 0 0',
    padding: '11px',
  },
  externalFeedbackIncorrect: {
    backgroundColor: '#fbeae5',
    border: '1px solid #bf0711',
    borderRadius: '5px',
    margin: '5px 0 0',
    padding: '11px',
  },
  feedbackCorrect: {
    color: "#108043",
  },
  feedbackIncorrect: {
    color: "#bf0711",
  },
  feedbackNeutral: {
    backgroundColor: '#f3f4fa',
    border: '1px solid #5c6ac4',
    borderRadius: '5px',
    color: "#202e78",
    margin: '5px 0 0',
    padding: '11px',
  },
  radioText: {
    color: theme.radioTextColor,
    fontWeight: theme.radioTextFontWeight,
    marginLeft: theme.radioTextMarginLeft,
  },
  checkStyleCorrect: {
    float: "left",
    width: "20px",
    height: "20px",
    marginTop: "12px",
    marginLeft: "-28px",
    cursor: "default"
  },
  checkStyleWrong: {
    float: "left",
    width: "20px",
    height: "20px",
    marginTop: "12px",
    marginLeft: "-28px",
    cursor: "default"
  }
}
