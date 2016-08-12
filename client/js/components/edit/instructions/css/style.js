export default new class Style {
  constructor() {

    this.style = {
      //styles go here
      textList:{
          listStyleType: 'none',
          paddingLeft: '5px',
          lineHeight: '2.0',
          fontSize: '14px'
      },
      textItems:{
          padding: '2px',
          lineHeight: '1.25'
      }
  };
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
  }
