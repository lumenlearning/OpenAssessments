"use strict";
import defines from "./defines";

export default {
  primaryBackgroundColor: defines.lumenDarkGreen,
  titleBarBackgroundColor: defines.lightgray,
  progressBarColor: defines.lumenSeafoam,
  progressBarHeight: "10px",
  // assessmentContainerBoxShadow: "1px 4px 4px 4px rgba(0,0,0,0.2)",
  // assessmentContainerBorderRadius: "4px",
  headerBackgroundColor: defines.white,

  fullQuestionBackgroundColor: "#f5f5f5",
  checkUnderstandingBackgroundColor: defines.white,
  panelHeadingBackgroundColor: defines.white,
  panelBoxShadow: "0 0 0 rgba(0,0,0,0.0)",
  panelBorder: null,
  panelBorderRadius: null,
  panelBorderColor: "transparent",
  panelMarginBottom: "-30px",
  confidenceButtonBackgroundColor: defines.lumenBlue + " !important",
  maybeBackgroundColor: defines.lumenRed + " !important",
  maybeColor: defines.white,
  probablyBackgroundColor: defines.lumenBlue + " !important",
  probablyColor: defines.white,
  probablyWidth: "130px",
  definitelyBackgroundColor: defines.lumenSeafoam + " !important",
  definitelyColor: defines.white,
  confidenceWrapperBackgroundColor: defines.lightergray,
  confidenceWrapperWidth: "650px",
  confidenceWrapperMargin: "10px 20px",
  navigationWrapperMargin: "0 0 0 36px",
  confidenceFeedbackWrapperMargin: "1.5em 0 2em 38px",
  nextButtonBackgroundColor: defines.lumenBlue + " !important",
  previousButtonBackgroundColor: defines.lumenBlue + " !important",

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
  incorrectBackgroundColor: "#fef4f4",
  correctBorder: "1px solid rgb(113, 184, 137)",
  correctColor:  "rgb(113, 184, 137)",
  incorrectBorder: "1px solid #ad4646",
  incorrectColor: "#ad4646",
  partialBorder: "1px solid #c05717",
  partialBackgroundColor: "rgba(200, 133, 51, .2)",
  partialColor: "#c05717",
  outcomesBackgroundColor: "#f4f6f8",
  questionTextColor: "#212b36",
  questionTextFontSize: "16px",
  questionTextFontWeight: "normal",
  questionTextPadding: "1.25em 1em",

  // Selection button questions
  btnBackground: "#fafafa",
  btnQuestionBorder: "1px solid #c4c4c4",
  btnQuestionBorderRadius: "5px",

  btnCorrectBackground: "#f0faed",
  btnCorrectBorder: "1px solid #108043",

  btnIncorrectBackground: "#fbeae5",
  btnIncorrectBorder: "1px solid #bf0711",

  btnNeutralBackground: "#f3f4fa",
  btnNeutralBorder: "1px solid #5c6ac4",
}
