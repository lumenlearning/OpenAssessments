"use strict";

export default{

  getStyles(theme, isFormative=false){
    return {
      assessment: {
        padding: 0,
        backgroundColor: theme.assessmentBackground,
      },
      progressStyle: {
        width:"100%"
      },
      wrapperStyle:{
        width: "100%",
        position: "relative",
        maxHeight: "300px",
        overflowY: "auto"
      },
      yourScoreStyle: {
        backgroundColor: theme.definitelyBackgroundColor,
        color: "#fff",
        borderRadius: "4px",
        textAlign: "center",
        padding: "10px 20px 20px 20px"
      },
      improveScoreStyle:{
        color: "#AD4646"
      },
      green: {
        color: "#458B00"
      },
      assessmentContainer:{
        marginTop: "0px",
        padding: "0 16px",
        boxShadow: isFormative ? "" : theme.assessmentContainerBoxShadow,
        borderRadius: theme.assessmentContainerBorderRadius
      },
      resultsStyle: {
        padding: "20px 15px"
      },
      formative: {
        padding: "5",
        marginTop: "0px",

      },
      icon: {
        height: "62px",
        width: "62px",
      },
      data: {
        marginTop: "-5px"
      },
      selfCheck: {
        fontSize: "140%"
      },
      outcomes: {
        backgroundColor: "rgba(204, 204, 204, .2)",
      },
      row: {
        padding: "15px",

      },
      outcomeContainer: {
        textAlign: "center"
      },
      outcomeIcon: {
        width: "100px",
        height: "100px",
        marginTop: "80px"
      },
      header: {
        // position: "absolute",
        borderTop: "2px solid #003136",
        borderBottom: "1px solid #c4cdd5",
        top: "0px",
        left: "0px",
        padding: "22px 40px 22px 16px",
        fontSize: "20px",
        fontWeight: "400",
        color: "#212b36",
        lineHeight: "1.4",
        width: "100%"
      },
      headerWrapper: {
        borderBottom: "1px solid #c4cdd5",
        padding: "20px 0"
      },
      quizTitle: {
        color: "#212b36",
        fontSize: "20px",
        lineHeight: "28px",
        margin: "0 0 4px 0"
      },
      answerKeyLabel: {
        color: "#212b36",
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "30px",
        marginLeft: "-15px",
        marginTop: "-15px"
      },
      resultList: {
        width: "90%",
        margin: "auto",
        overflowY: "hidden",
      },
      resultListInner: {
        float: "left",
        marginTop: "20px",
        fontWeight: "bold"
      },
      resultOutcome: {
        textAlign: "left"
      },
      retakeButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.probablyBackgroundColor,
        color: theme.definitelyColor,
      },
      jumpButton: {
        marginTop: "10px",
        width: theme.definitelyWidth,
        backgroundColor: theme.submitBackgroundColor,
        color: theme.definitelyColor,
      },
        exitButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.primaryBackgroundColor,
        color: theme.definitelyColor,
        marginLeft: "15px"
      },
      buttonsDiv: {
        paddingTop: "20px",
        paddingBottom: "50px"
      },
      titleBar: {
        borderBottom: "2px solid #003136",
        padding: "22px 40px 22px 16px",
        fontFamily: "Arial",
        fontSize: "28px",
        fontWeight: "400",
        color: "#212b36",
        lineHeight: "1.4"
      },
      warningStyle: {
        width: "100%",
        padding:  "20px",
        backgroundColor: theme.maybeBackgroundColor,
        borderRadius: "4px",
        marginTop: "30px",
        color: "white",
        fontWeight: "bold",
        fontSize: "130%"
      }
    }
  }
}
