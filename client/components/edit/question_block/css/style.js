export default new class Style {
  constructor() {


    this.style = {
      //styles go here
      qbContent:{},
      qbContentHead: {
        padding: "15px",
        fontSize: '24px'
      },
      qbQuestion:{
        fontSize: '24px'
      },
      qbAnswerTable:{
        display: 'table',
        fontSize: '18px',
        width: '100%',
        minWidth: '277px', //45px(margins)+32px(smallCell)+(100px(mainCells)*2)
        padding: "15px 40px 40px"
      },
      qbTblHead:{
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 'bold',
      },
      qbHeadItem:{
        width: '40%',
        minWidth: '100px',
        display: 'inline-block',
        marginLeft: '15px',
        padding: '0px',

      },
      qbTblContent:{

      },
      // qbTblRow:{
      //   width:'100%',
      //   display: 'flex',
      //   justifyContent: 'center',
      //   alignItems: 'stretch',
      //   margin: '5px 0px 20px'
      // },
      // qbTblCell:{
      //   width: '40%',
      //   minWidth: '100px',
      //   display: 'inline-block',
      //   marginLeft: '15px',
      //   padding: '15px',
      //   border: '1px solid',
      //   borderRadius: '3px',
      // },
      qbTblCell:{
        padding: '15px',
        border: '1px solid',
        borderRadius: '3px',
      },
      label: {
        fontWeight: "bold",
        // paddingBottom: "0.25em",
        paddingRight: "0.25em"
      },
      labelBlock: {
        display: "inline-block",
        width: "50%"
      },
      emptyCell: {
        display: "table-cell",
        width: "60px",
        height: "100%",
        verticalAlign: "top"
      },
      qbSm:{
        display: 'flex',
        alignItems: 'center',
        width: '32px',
        minWidth: '32px',
        margin: '0px',
        border: 'none',
        padding: '0px'
      },
      checkOrExit:{
        width:'32px',
        height: '32px',
        borderRadius: '100%'
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
