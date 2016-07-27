export default new class Style {
  constructor() {

    this.style = {
      //styles go here
      questionItem: {
        border: "1px solid rgba(0,0,0,0.2)",
        borderRadius: "5px",
        marginTop: "15px",
      },
      questionHeader:{
        backgroundColor: '#3299bb',
        height: '28px'
      },
      questionToolbar:{
        position: 'absolute',
        display: 'inline-block',
        right: '45px',
        cursor: 'pointer'
      },
      questionToolBtns:{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: 'white',
        padding: '2px',
        margin: '0px 2px'
      },
      questionContent: {}

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
