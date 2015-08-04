"use strict";
import defines from "./defines";

export default {
  // QUESTION TEXT
  questionTextFontSize: "18px",
  questionTextFontWeight: "bold",
  questionTextPadding: "0 0 14px 4px",

  // ASSESSMENT
  assessmentPadding: "0px",
  assessmentBackground: "transparent",

  // TITLE BAR
  titleBarBackgroundColor: "transparent",

  //ASSESSMENT CONTAINER
  assessmentContainerBoxShadow: null,
  assessmentContainerBorderRadius: null,
  // HEADER
  headerBackgroundColor: defines.blue,

  // PROGRESS BAR
  progressBarColor: "#337ab7",
  progressBarBackground: "whitesmoke",
  progressBarHeight: "20px",

  // BUTTONS (background must have important)
  nextButtonBackgroundColor: "#3299bb !important",
  previousButtonBackgroundColor: "#3299bb !important",
  checkAnswerButtonBackgroundColor: "buttonface",

  responseTextColor: defines.textColor,

  // FULL QUESTION
  fullQuestionBackgroundColor: defines.lightgray,

  // PANEL
  //panelBorderColor: "#dddddd",
  panelPosition: "relative",
  panelMarginBottom: "20px",
  panelBackgroundColor: "white",
  panelBorder: "1px solid transparent",
  panelBorderRadius: "4px",
  panelBoxShadow: "0 1px 1px rgba(0,0,0,0.5)",
  panelBorderColor: "#dddddd",

  // PANEL HEADING
  panelHeadingPadding: "10px 15px",
  panelHeadingBorderBottom: "1px solid transparent",
  panelHeadingBorderTopRightRadius: "3px",
  panelHeadingBorderTopLeftRadius: "3px",
  panelHeadingTextAlign: "center",
  panelHeadingBackgoundColor: defines.lightgray,

  //PANEL BODY
  panelBodyPadding: "15px",

  //BUTTON QUESTION
  btnQuestionWhiteSpace: "normal",
  btnQuestionBackground: defines.white,
  btnQuestionColor: defines.black,
  btnQuestionTextAlign: "left",
  btnQuestionPadding: "0",
  btnQuestionMarginBottom: "5px",
  btnQuestionDisplay: "block",
  btnQuestionWidth: "100%",
  btnQuestionVerticalAlign: "middle",
  btnQuestionFontWeight: "normal",
  btnQuestionTouchAction: "manipulation",
  btnQuestionCursor: "pointer",
  btnQuestionBorder: "1px solid transparent",
  btnQuestionFontSize: "14px",
  btnQuestionLineHeight: "1.42857143",
  btnQuestionBorderRadius: "4px",

  // RADIO BUTTON TEXT
  radioTextMarginLeft: "5px",
  radioTextFontWeight: "bold",
  radioTextColor: defines.black,

  // CONFIDENCE WRAPPER
  confidenceWrapperBorder: "1px solid transparent",
  confidenceWrapperBorderRadius: "5px",
  confidenceWrapperWidth: "510px",
  confidenceWrapperHeight: "auto",
  confidenceWrapperPadding: "20px",
  confidenceWrapperMargin: "20px",
  confidenceWrapperBackgroundColor: null,

  //MAYBE BUTTON
  maybeWidth: "150px",
  maybeBackgroundColor: defines.buttonFace + " !important",
  maybeColor: defines.textGrey,

  //PROBABLY BUTTON
  probablyWidth: "150px",
  probablyBackgroundColor: defines.buttonFace + " !important",
  probablyColor: defines.textGrey,

  // DEFINITELY BUTTON
  definitelyWidth: "150px",
  definitelyBackgroundColor: defines.buttonFace + " !important",
  definitelyColor: defines.textGrey,

  //SUBMIT BUTTON
  submitBackgroundColor: defines.buttonFace + " !important",

  // FOOTER
  footerHeight: "60px",
  footerBackgroundColor: defines.lightgray,

  // NOT STYLES BUT VARIABLES
  shouldShowProgressText: false,
  shouldShowCounter: true,
  shouldShowNextPrevious: true,
  shouldShowAttempts: false,
  shouldShowFooter: false,


}