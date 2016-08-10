export default new class Style {
  constructor() {

    this.style = {
      //styles go here
      'tooltipWrapper':{
      },
      'tooltip':{
        position: 'fixed',
        backgroundColor: '#333333',
        color: 'white',
        padding: '15px',
        fontSize: '18px'
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
