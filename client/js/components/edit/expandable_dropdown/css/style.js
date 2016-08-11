export default new class Style {
  constructor() {

    this.style = {
      //styles go here
      expandable:{},
      expandableBtn:{
        cursor: 'pointer',
        marginTop: '15px'
      },
      expandableTxt:{
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '14px',
        marginBottom: '0px',
        color: '#3299BB'

      },
      expandableContent:{
        overflow: 'hidden',
        maxHeight: '0px',
        transition: 'max-height .3s ease',
        padding: '5px 0px 0px 0px'
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
