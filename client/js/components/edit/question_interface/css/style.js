export default new class Style {
  constructor() {

    this.style = {
      qiContent: {
        border: "1px solid rgba(0,0,0,0.2)",
        fontSize: "18px"
      },
      qiContentBlock: {
        padding: "15px 40px 40px"
      },
      qBlock: {
        display:"inline-block",
        width: "100%",
        paddingBottom: "30px"
      },
      qLabel: {
        width: "100%",
        fontWeight: "bold"
      },
      ofLabelBlock: {
        width: "100%",
        marginBottom: "-5px"
      },
      emptyCell: {
        display: "inline-block",
        width: "4%"
      },
      optionLabelBlock: {
        display: "inline-block",
        width: "48%",
        padding: "5px 0px 0px 10px"
      },
      optionLabel: {
        fontWeight: "bold",
      },
      feedbackLabelBlock: {
        display: "inline-block",
        width: "48%"
      },
      feedbackLabel: {
        fontWeight: "bold"
      },
      answerRow: {
        display: "block",
        width: "100%"
      },
      answerOptionBlock: {
        display: "inline-block",
        width: "48%",
        padding: "5px 10px"
      },
      feedbackBlock: {
        display: "inline-block",
        width: "48%"
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
        width: "100%"
      },
      textArea: {
        width: "100%",
        marginTop: "5px",
        padding: "15px",
        border: "1px solid",
        borderRadius: "3px"
      },
      buttonDiv: {
        textAlign: "center"
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
