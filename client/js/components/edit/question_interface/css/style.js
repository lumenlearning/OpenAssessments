export default new class Style {
  constructor() {

    this.style = {
      qiContent: {
        fontSize: "18px"
      },
      qiContentBlock: {
        padding: "15px 40px 40px"
      },
      qBlock: {
        width: "100%",
        paddingBottom: "30px"
      },
      label: {
        fontWeight: "bold",
      },
      textArea: {
        width: "100%",
        marginTop: "5px",
        padding: "15px",
        borderRadius: "3px"
      },
      ofLabelBlock: {
        width: "100%",
        marginBottom: "-5px"
      },
      emptyCell: {
        display: "inline-block",
        width: "4%",
        height: "100%",
        verticalAlign: "middle"
      },
      optionLabelBlock: {
        display: "inline-block",
        width: "48%",
        padding: "5px 0px 0px 10px"
      },
      feedbackLabelBlock: {
        display: "inline-block",
        width: "48%"
      },
      answerRow: {
        display: "block",
        width: "100%",
        height: "100px"
      },
      answerOptionBlock: {
        display: "inline-block",
        width: "48%",
        padding: "5px 10px"
      },
      feedbackBlock: {
        display: "inline-block",
        width: "48%",
        padding: "5px 0"
      },
      block: {
        paddingBottom: "20px"
      },
      hintBlock: {
        display:"inline-block",
        width: "100%",
        paddingBottom: "10px"
      },
      hintLabel: {
        width: "100%",
        fontWeight: "bold"
      },
      buttonDiv: {
        textAlign: "center"
      },
      checkCircle: {
        width: "32px",
        height: "32px",
        // margin: "50% auto",
        border: "2px solid #CCC", //#868686
        borderRadius: "100%"
      },
      checkHover: {
        width: "28px",
        height: "28px",
        marginBottom: "2px",
        borderRadius: "100%"
      },
      outcomeSelect: {
        fontSize: "16px",
        fontWeight: "normal",
        border: "1px solid",
        backgroundColor: "#fff"
      }
    };

  }

  styles() {
    return this.style;
  }

  createStyle(name, value) {
    if (typeof this.style[name] === 'undefined') {

      this.style[name] = value;

      return true;
    }
    else {
      return false;
    }
  }

  updateStyle(name, value) {
    if (typeof this.style[name] !== 'undefined') {
      this.style[name] = value;

      return true;
    }
    else {
      return false;
    }
  }
}
