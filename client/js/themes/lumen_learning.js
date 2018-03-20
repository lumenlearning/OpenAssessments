"use strict";
import defines from "./defines";

export default {
  primaryBackgroundColor: defines.lumenDarkGreen,
  titleBarBackgroundColor: defines.lightgray,
  progressBarColor: defines.lumenSeafoam,
  progressBarHeight: "10px",
  assessmentContainerBoxShadow: "1px 4px 4px 4px rgba(0,0,0,0.2)",
  assessmentContainerBorderRadius: "4px",
  headerBackgroundColor: defines.white,

  fullQuestionBackgroundColor: '#f5f5f5',
  panelHeadingBackgroundColor: defines.white,
  panelBoxShadow: "0 0 0 rgba(0,0,0,0.0)",
  panelBorder: null,
  panelBorderRadius: null,
  panelBorderColor: "transparent",
  panelMarginBottom: "-30px",
  maybeBackgroundColor: defines.newLumenBlue + " !important",
  maybeColor: defines.white,
  probablyBackgroundColor: defines.newLumenBlue + " !important",
  probablyColor: defines.white,
  probablyWidth: '130px',
  definitelyBackgroundColor: defines.newLumenBlue + " !important",
  definitelyColor: defines.white,
  confidenceWrapperBackgroundColor: defines.lightergray,
  confidenceWrapperWidth: '650px',
  navigationWrapperMargin: '0 0 0 36px',
  confidenceFeedbackWrapperMargin: '1.5em 0 2em 38px',
  nextButtonBackgroundColor: defines.newLumenBlue + " !important",
  previousButtonBackgroundColor: defines.newLumenBlue + " !important",

  assessmentPadding: "20px",
  assessmentBackground: defines.white,

  progressDropdownBoxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)",

  shouldShowAttempts: true,
  shouldShowProgressText: false,
  shouldShowCounter: false,
  shouldShowNextPrevious: false,
  shouldShowFooter: false,

  correctBackgroundColor: "rgba(113, 184, 137, 0.2)",
  submitBackgroundColor: "#9B59B6",
  incorrectBackgroundColor: "rgba(207, 0, 0, 0.2)",
  correctBorder: "1px solid rgb(113, 184, 137)",
  correctColor:  "rgb(113, 184, 137)",
  incorrectBorder: "1px solid rgb(207, 0, 0)",
  incorrectColor: "rgb(207, 0, 0)",
  partialBorder: "1px solid rgb(200, 133, 51)",
  partialBackgroundColor: "rgba(200, 133, 51, .2)",
  partialColor: "rgb(200, 133, 51)",
  outcomesBackgroundColor: "rgba(204, 204, 204, .2)",
  questionTextColor: '#212b36',
  questionTextFontSize: '16px',
  questionTextFontWeight: 'normal',
  questionTextPadding: '1.25em 1em',

  // Selection button questions
  btnBackground: '#fafafa',
  btnQuestionBorder: '1px solid #c4c4c4',
  btnQuestionBorderRadius: '5px',
  btnQuestionPadding: '11px',

  btnCorrectBackground: '#f0faed',
  btnCorrectBorder: '1px solid #108043',

  btnIncorrectBackground: '#fbeae5',
  btnIncorrectBorder: '1px solid #bf0711',
}
