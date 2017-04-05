import React, {Component} from 'react';
import AssessmentActions from '../../actions/assessment.js';
//import any other dependencies here.

export default class MultiDropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    //rebindings for custom methods go here.
    this.findAndReplace = this.findAndReplace.bind(this);
  }

  render() {
    let question = this.findAndReplace();

    //place JSX between the parens!
    return (
      <div>
        <p dangerouslySetInnerHTML={{__html: question}} />
      </div>
    );
  }

  componentDidUpdate(){

  }

  componentDidMount(){
    this.addListeners();
  }

  componentWillUnmount(){
    this.removeListeners();
  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
  findAndReplace(){
    let string = this.props.item.material;
    let shortcodes = Object.keys(this.props.item.dropdowns);
    let answers = this.props.item.dropdowns;
    let re = new RegExp(`\\[${shortcodes.join('\\]|\\[')}\\]`, 'gi'); //turn array of shortcodes into a regex

    return string.replace(re, (match) => {
      let re = new RegExp('\\[|\\]', 'g');
      let nMatch = match.replace(re, ''); //from '[shortcode]' to 'shortcode'
      let options = answers[nMatch].map((answer) => {
        return `<option value=${answer.value}>${answer.name}</option>`;
      });

      return `<select name="${nMatch}" id="dropdown_${nMatch}">${options}</select>`;
    });
  }

  addListeners() {
    let shortcodes = Object.keys(this.props.item.dropdowns);

    shortcodes.forEach((shortcode, i) => {
      document.getElementById(`dropdown_${shortcode}`).addEventListener('change', this.handleShortcodeChange);
    });
  }//addListeners

  removeListeners(){
    let shortcodes = Object.keys(this.props.item.dropdowns);

    shortcodes.forEach((shortcode, i) => {
      document.getElementById(`dropdown_${shortcode}`).removeEventListener('change', this.handleShortcodeChange);
    });
  }//removeListeners

  handleShortcodeChange(e){
    //alert(`THIS IS A CHANGE! name:${e.target.name} and value:${e.target.value}`);

    AssessmentActions.answerSelected({
      "dropdown_id": e.target.name,
      "chosen_answer_id": e.target.value
    });

  }//handleShortcodeChange

}//end MultiDropDown class

MultiDropDown.propTypes = {};

