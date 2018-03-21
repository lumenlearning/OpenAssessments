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
  feedbackCorrect: {
    color: "#108043"
  },
  feedbackIncorrect: {
    color: "#bf0711"
  },
  feedbackNeutral: {
    backgroundColor: '#f3f4fa',
    border: '1px solid #5c6ac4',
    color: "#202e78",
    borderRadius: '5px',
    padding: '11px',
    margin: '5px 0 0',
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
