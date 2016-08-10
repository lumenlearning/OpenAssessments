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
        backgroundColor: '#7C8284',
        height: '40px',
        borderRadius: '4px 4px 0 0'
      },
      editedHeader:{
        backgroundColor: '#71B889',
        height: '40px',
        borderRadius: '4px 4px 0 0'
      },
      draftHeader:{
        backgroundColor: '#3299bb',
        height: '40px',
        borderRadius: '4px 4px 0 0'
      },
      questionShortName:{
        position: 'absolute',
        display: 'inline-block',
        left: '50px',
        color: 'white',
        fontSize: '24px'
      },
      questionToolbar:{
        position: 'absolute',
        display: 'inline-block',
        right: '45px',
        cursor: 'pointer'
      },
      questionToolBtns:{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'transparent', //code also uses #31708f & #bb5432 in event handlers
        padding: '4px',
        margin: '3px 3px',
        border: "1px solid white",
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
