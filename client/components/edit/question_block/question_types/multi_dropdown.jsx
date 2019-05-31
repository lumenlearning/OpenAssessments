import React, {Component} from 'react';
import Style from '../css/style.js';
import _ from 'lodash';
//import any other dependencies here.

export default class MultiDropdownFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    //rebindings for custom methods go here.
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;
    let style = Style.styles();
    let windowWidth = this.props.windowWidth

    //place JSX between the parens!
    return (
      <div>
        {Object.keys(question.dropdowns).map((key, i) => {
          return (
            <div style={style.qbAnswerTable}>
              <h3>{key}</h3>
              <div style={{display: "table", width: "100%"}}>
                <div style={style.emptyCell}></div>
                <div style={_.merge(style.labelBlock, style.label)}>Answers</div>
                <div style={_.merge(style.labelBlock, style.label)}>Feedback</div>
              </div>
              <div style={style.qbTblContent} >
                {question.dropdowns[key].map((dropdown, i) => {
                  let img = null;
                  let answerFeedbackBlock = windowWidth <= 1000 ? {display: "table", width: "100%", borderSpacing: "0 10px"} : {display: "table", width: "100%", borderSpacing: "10px 8px"};
                  let answerFeedback      = windowWidth <= 1000 ? {display: "block", width: "100%", marginBottom: "20px"} : {display: "table-cell", width: "50%"};
                  let feedback = !!dropdown.feedback ? dropdown.feedback : !!question.feedback ? question.feedback[key+dropdown.value] : null;
                  let correctIndex = question.correct.findIndex((correctDropdown) => {
                    return dropdown.value === correctDropdown.value && key === correctDropdown.name;
                  });

                  if(correctIndex >= 0){
                    img = (<img style={style.checkOrExit} src="/assets/checkbox-48.png" alt="This Answer is Correct"/>);
                  }

                  /**
                   * Note on dangerouslySetInnerHTML Usage
                   *
                   * It is generally not a good idea to use dangerouslySetInnerHTML because it
                   * may expose applications to XSS attacks. We are opting to use it here and
                   * and in other places in the code base because the assessment content is
                   * is stored in (and returned from) the DB as XML, which limits our options
                   * in how we can handle assessment "material" on the frontend.
                   *
                   * READ: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
                   */
                  return (
                    <div style={{display: "table", width: "100%"}} >
                      <div style={{display: "table-cell", minWidth: "50px", height: "100%", verticalAlign: "middle"}} >
                        {img}
                      </div>
                      <div style={{display: "table-cell", width: "100%", verticalAlign: "top"}}>
                        <div style={answerFeedbackBlock}>
                          <div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={{__html:dropdown.name}} />
                          <div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={{__html:feedback}} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
}//end MultiDropdownFeedback class

// MultiDropdownFeedback.propTypes = {
//   question: React.PropTypes.object.isRequired,
//   windowWidth: React.PropTypes.object.isRequired
// };
