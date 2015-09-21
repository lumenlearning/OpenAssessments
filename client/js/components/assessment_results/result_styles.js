"use strict";

export default{

  getStyles(theme, isFormative=false){
    return {
      assessment: {
        padding: isFormative ? "" : theme.assessmentPadding,
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
        color: "#f00"
      },
      green: {
        color: "#458B00"
      },
      assessmentContainer:{
        marginTop: isFormative ? "0px" : "70px",
        boxShadow: isFormative ? "" : theme.assessmentContainerBoxShadow,
        borderRadius: theme.assessmentContainerBorderRadius,
        padding: "20px"
      },
      resultsStyle: {
        padding: "20px"
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
        textAlign: "center",
        marginTop: "70px"
      },
      outcomeIcon: {
        width: "100px",
        height: "100px",
        marginTop: "80px"
      },
      header: {
        padding: "15px",
        backgroundColor: theme.primaryBackgroundColor,
        position: "absolute",
        top: "0px",
        left: "0px",
        fontSize: "140%",
        color: "white",
        width: "100%"
      },
      resultList: {
        width: "90%",
        margin: "auto",
        overflowY: "hidden",
      },
      resultOutcome: {
        textAlign: "left"
      },
      retakeButton: {
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor,
        color: theme.definitelyColor,
        marginBottom: "10px"
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
        marginTop: "20px",
        marginBottom: "50px"
      },
      titleBar: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.primaryBackgroundColor,
        color: "white",
        fontSize: "130%",
        //fontWeight: "bold"
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