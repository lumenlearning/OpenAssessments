export default new class Style {
  constructor() {

    this.style = {
      //styles go here
      editQuizWrapper:{

      },
      eqHeader:{
        backgroundColor:'#71B889',
        padding: '0px 40px'
      },
      errorHeader:{
        display: 'flex',
        backgroundColor:'#FFF7EF',
        borderStyle: 'solid',
        borderColor: '#C51700',
        borderRadius: '5px',
        borderWidth: '1px',
        borderLeftWidth: '10px',
        padding: '0px 20px',
        margin: '5px'
      },
      warningHeader:{
        display: 'flex',
        backgroundColor:'#FFF7DF',
        borderStyle: 'solid',
        borderColor: '#e09600',
        borderRadius: '5px',
        borderWidth: '1px',
        borderLeftWidth: '10px',
        padding: '0px 20px',
        margin: '5px'
      },
      eqTitle:{
        display: 'inline-block'
      },
      eqH2Title:{
        color: 'white'
      },
      eqNewQuestion:{
        width: '100%',
        margin: '15px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0px 40px'
      },
      addQuestionLbl:{
        fontSize: '18px',
        cursor: 'pointer',
        display: 'inline-block',
      },
      addQuestionBtn:{
        width: '48px',
        height: '48px',
        border:'transparent',
        borderRadius: '50%',
        backgroundColor:'#3299bb',
        color:'#fff',
        padding: '0px',
        margin:'0px 10px',
        outline: 'none'
      },
      addQuestionImg:{
        width: '38px',
        height: '38px',
        alignContent: 'center'
      },
      saveAssessmentBtn:{
        width: '48px',
        height: '48px',
        border:'transparent',
        borderRadius: '50%',
        backgroundColor:'#3299bb',
        color:'black',
        padding: '0px',
        margin:'0px 10px',
        outline: 'none'
      },

      heading: {
        "marginLeft": "10px",
        "marginBottom": "0",
        "verticalAlign": "middle",
        "width": "90%",
        "color": "white",
        "fontSize": "18px",
        "textOverflow": "ellipsis",
        "whiteSpace": "nowrap",
        "overflow": "hidden"
      },
      deleteButton: {
        "margin": "5px",
        "color": "white",
        "backgroundColor": "#CF0000"
      },
      titleBar: {
        "display": "table",
        "height": "40px",
        "width": "100%",
        "backgroundColor": "#71B889"
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
