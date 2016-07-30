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
      eqTitle:{
        display: 'inline-block'
      },
      eqH2Title:{
        color: 'white'
      },
      eqNewQuestion:{
        display: 'inline-block',
        float: 'right',
        margin: '15px 0'
      },
      addQuestionBtn:{
        border:'transparent',
        backgroundColor:'#3299bb',
        color:'#fff',
        minWidth:'150px',
        margin:'3px 2px',
      },
      saveAssessmentBtn:{
        border:'transparent',
        backgroundColor:'#CF0000',
        color:'#fff',
        minWidth:'150px',
        margin:'3px 2px',
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
