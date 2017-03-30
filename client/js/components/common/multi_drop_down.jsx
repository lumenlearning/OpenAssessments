import React, {Component} from 'react';
import htmlParser from 'htmlparser';
//import any other dependencies here.

export default class MultiDropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    //rebindings for custom methods go here.
  }

  render() {
    let question = this.splitByShortCodes();
    //console.log(question);
    console.log(this.props.item.material.search());

    //place JSX between the parens!
    return (
      <div>
        <p dangerouslySetInnerHTML={{__html: question}} />
      </div>
    );
  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================

  renderDropDown(index) {
    let answers = this.props.item.answers[index];

    console.log("DROPDOWN ANSWERS", answers);
    return (
      <select name="" id="">
        {answers.map((answer, i) => {
          return (
            <option value={answer.value}>
              {answer.name}
            </option>
          )
        })}
      </select>
    )
    
  }//renderDropDown

  splitByShortCodes() {
    let item = this.props.item;
    let regex = /\[[^\]]*\]\n?|\n/;

    return item.material.split(regex).map((questionPart, i, array) => {
      if (array.length == i + 1) {
       return questionPart;
      }

      return questionPart + this.renderDropDown(i);
    });
  }//replaceShortCodes

  recursiveHTMLsplit(){
    let material = this.props.item.material;
    let regex = /<[^>]*>/;

    return item.material.split(regex).map((questionPart, i) => {

    });
  }

  parseHTML() {
    
  }//parseHTML

  handleParse(error, dom) {

  }//handleParse

}//end MultiDropDown class

MultiDropDown.propTypes = {};

