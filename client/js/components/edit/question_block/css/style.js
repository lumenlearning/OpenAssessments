export default new class Style {
  constructor() {

    this.style = {
      //styles go here
      qbContent:{},
      qbContentHead: {
        padding: "15px"
      },
      qbQuestion:{
        fontSize: '18px'
      },
      qbAnswerTable:{
        margin: '0px auto 15px',
        fontSize: '18px',
        width: '90%'
      },
      qbColHead:{
        fontWeight: 'bold',
        paddingBottom: '10px'
      },
      qbColImg: {
        width:'2%',
        minWidth: '32px',
      },
      qbColAnswer: {
        width: '40%',
        //display: 'inline-block'
      },
      qbAnswerWrap:{
        //width: '90%',
        border: '1px solid',
        padding: '10px',
        marginRight: '15px',
        minHeight: '75px'
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
