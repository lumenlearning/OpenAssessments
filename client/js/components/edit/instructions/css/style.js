export default new class Style {
  constructor() {

    this.style = {
      //styles go here
      textList = {
          listStyleType: 'none',
          paddingLeft: '5px',
          lineHeight: '10'
      },
      textItems = {
          
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
