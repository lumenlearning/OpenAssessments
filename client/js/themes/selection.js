"use strict";
import theme from "./base";

export default {
  btnQuestion:{
    whiteSpace: theme.btnQuestionWhiteSpace,
    background: "transparent",
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
  },
  radioText: {
    color: theme.radioTextColor,
    fontWeight: theme.radioTextFontWeight,
    marginLeft: theme.radioTextMarginLeft,
  },
  checkStyleCorrect: {
    float: "left",
    color: "white",
    fontSize: ".9em",
    backgroundColor: "#4EAA59",
    width: "26px",
    height: "22px",
    paddingTop: "2px",
    paddingLeft: "8px",
    marginTop: "2px",
    marginLeft: "-30px",
    borderRadius: "4px",
    cursor: "default"
  },
  checkStyleWrong: {
    float: "left",
    color: "white",
    fontSize: ".8em",
    backgroundColor: "#C3092B",
    width: "26px",
    height: "22px",
    paddingTop: "3px",
    paddingLeft: "9px",
    marginTop: "2px",
    marginLeft: "-30px",
    borderRadius: "4px",
    cursor: "default"
  }
}
