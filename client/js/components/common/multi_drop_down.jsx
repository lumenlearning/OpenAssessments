import React, {Component} from 'react';
import AssessmentActions from '../../actions/assessment.js';
//import any other dependencies here.

export default class MultiDropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ariaAnswersLabels:{

      }
    };

    //rebindings for custom methods go here.
    this.findAndReplace = this.findAndReplace.bind(this);
    this.handleShortcodeChange = this.handleShortcodeChange.bind(this);
  }

  componentWillUpdate(){
    this.removeListeners(); //new DOM injection on update, remove old listeners.
  }

  render() {
    let question = this.findAndReplace();
    let questionResult = this.findAndReplace(true);

    //place JSX between the parens!
    return (
      <div>
        <div tabIndex="0" dangerouslySetInnerHTML={{__html: question}} />
        <br />
        <br />
        <hr aria-hidden='true' />

        <div tabIndex="0" role="dialog" aria-labelledbby="question_result_header" aria-describedby="question_result_container" >
          <h5 id="question_result_header">Question Result:</h5>
          <div id="question_result_container" dangerouslySetInnerHTML={{__html: questionResult}} />
        </div>
      </div>
    );
  }

  componentDidUpdate(){
    this.addListeners();
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
  findAndReplace(noSelect = false){
    let string = this.props.item.material;
    let shortcodes = Object.keys(this.props.item.dropdowns);
    let answers = this.props.item.dropdowns;
    let re = new RegExp(`\\[${shortcodes.join('\\]|\\[')}\\]`, 'gi'); //turn array of shortcodes into a regex

    return string.replace(re, (match) => {
      let re = new RegExp('\\[|\\]', 'g');
      let nMatch = match.replace(re, ''); //from '[shortcode]' to 'shortcode'
      let options = answers[nMatch].map((answer) => {
        return `<option ${this.state[nMatch] === answer.value ? "selected" : ""} value=${answer.value}>${answer.name}</option>`;
      });

      let ariaLabel = this.state.ariaAnswersLabels[nMatch] ? `"${this.state.ariaAnswersLabels[nMatch]}"` : `"${nMatch} choice goes here"`;

      if(noSelect){
        if(this.state.ariaAnswersLabels[nMatch]){
          return this.state.ariaAnswersLabels[nMatch];
        }
        else{
          return match;
        }
      }

      return (
        `<select 
           name="${nMatch}" 
           id="dropdown_${nMatch}" 
           aria-label=${ariaLabel}
         >
            <option ${!this.state[nMatch] ? "selected" : ""} disabled aria-label="select ${nMatch} choice" value="null">Pick one</option>
            ${options}
        </select>`
      );
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
    let stateClone = {...this.state};

    stateClone.ariaAnswersLabels[e.target.name] = e.target.options[e.target.options.selectedIndex].text;
    stateClone[e.target.name] = e.target.value;

    this.setState(stateClone);

    AssessmentActions.answerSelected({
      "dropdown_id": e.target.name,
      "chosen_answer_id": e.target.value
    });
  }//handleShortcodeChange

}//end MultiDropDown class

MultiDropDown.propTypes = {};


