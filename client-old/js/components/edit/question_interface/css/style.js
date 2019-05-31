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
        // paddingBottom: "0.25em",
        paddingRight: "0.25em"
      },
      textArea: {
        width: "100%",
        marginTop: "5px",
        padding: "15px",
        borderRadius: "3px"
      },
      ofLabelBlock: {
        display: "table",
        width: "100%",
        marginBottom: "-5px"
      },
      emptyCell: {
        display: "table-cell",
        width: "60px",
        height: "100%",
        verticalAlign: "top"
      },
      optionLabelBlock: {
        display: "inline-block",
        width: "50%"
      },
      feedbackLabelBlock: {
        display: "inline-block",
        width: "50%"
      },
      answerRow: {
        display: "block",
        width: "100%"
      },
      answerOptionBlock: {
        display: "inline-block",
        width: "48%",
        padding: "5px 10px",
        verticalAlign: "top"
      },
      feedbackBlock: {
        display: "inline-block",
        width: "48%",
        padding: "5px 0"
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
        textAlign: "center",
        marginTop: "20px"
      },
      checkCircle: {
        width: "32px",
        height: "32px",
        border: "2px solid #CCC", //#868686
        borderRadius: "100%"
      },
      checkHover: {
        width: "28px",
        height: "28px",
        marginBottom: "4px",
        borderRadius: "100%"
      },
      outcomeSelect: {
        fontSize: "16px",
        fontWeight: "normal",
        backgroundColor: "#fff",
        maxWidth: "950px"
      },
      delBtn: {
        border: '2px solid #D00000',
        width: '32px',
        height: '32px',
        display: 'block',
        margin: '0 auto',
        padding: '2px 3px 2px 2px',
        borderRadius: '50%',
        cursor: 'pointer',
      },
      delBtnIcon:{
        width: '23px',
        height: '23px',
        marginBottom: '8px'
      },
      warningImg:{
        width: '17px',
        height: '17px',
        marginBottom: "4px"
      },

      //MDD Feedack Styles
      mddFeedbackTab:{
        padding: '10px',
        //border: '1px solid black',
        borderRadius: '5px 5px 0px 0px',
        marginRight: '2px',
        borderBottom: 'none',
        backgroundColor: '#3299bb',
        color: 'white',
        cursor: 'pointer'
      },
      mddFeedbackTabActive: {
        backgroundColor: '#0fafe2',
        textDecoration: 'underline'
      },
      mddTabContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '10px',
        border: '1px solid #c1c1c1',
      },
      mddTabArea: {
        display: 'flex',
        overflowX: 'scroll',
      },
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
