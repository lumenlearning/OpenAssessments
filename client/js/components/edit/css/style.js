export default new class Style {
  constructor() {

    this.style = {
      //styles go here
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
