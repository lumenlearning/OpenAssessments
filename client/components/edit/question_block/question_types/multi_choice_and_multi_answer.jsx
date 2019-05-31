import React, {Component} from 'react';
import Style from '../css/style.js';
//import any other dependencies here.

export default class MultiChoiceNAnswerFeedback extends Component {
  constructor(props) {
    super(props);

    //rebindings for custom methods go here.
  }

  componentWillMount() {

  }

  render() {
    let question    = this.props.question;
    let windowWidth = this.props.windowWidth;
    let style       = Style.styles();
    let labels      = windowWidth < 1001 ? null : this.renderLabels();

    //place JSX between the parens!
    return (
      <div style={style.qbAnswerTable}>
        {labels}
        <div style={style.qbTblContent} >
          {
            question.answers.map((answer, i)=>{
              let img = null;
              let answerFeedbackBlock = windowWidth <= 1000 ? {display: "table", width: "100%", borderSpacing: "0 10px"} : {display: "table", width: "100%", borderSpacing: "10px 8px"};
              let answerFeedback      = windowWidth <= 1000 ? {display: "block", width: "100%", marginBottom: "20px"} : {display: "table-cell", width: "50%"};
              let answerLabelSmall    = windowWidth <= 1000 ? (<div style={_.merge({paddingBottom: "0.25em"}, style.label)}>Answer</div>) : null;
              let feedbackLabelSmall  = windowWidth <= 1000 ? (<div style={_.merge({paddingBottom: "0.25em"}, style.label)}>Feedback</div>) : null;
              let hr                  = windowWidth <= 1000 ? (<hr style={{margin: "10px 0 10px", borderTop: "1px dotted #868686"}}/>) : null;

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
              let answerMaterial      = answer.material ? (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={{__html:answer.material}} />) : (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={{__html:"&nbsp;"}} />);
              let feedbackMaterial    = answer.feedback ? (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={{__html:answer.feedback}} />) : (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={{__html:"&nbsp;"}} />);

              if(answer.isCorrect){
                img = (<img style={style.checkOrExit} src="/assets/checkbox-48.png" alt="This Answer is Correct"/>);
              }
              return (
                <div key={i}>
                  <div style={{display: "table", width: "100%"}} >
                    <div style={{display: "table-cell", minWidth: "50px", height: "100%", verticalAlign: "middle"}} >
                      {img}
                    </div>
                    <div style={{display: "table-cell", width: "100%", verticalAlign: "top"}}>
                      <div style={answerFeedbackBlock}>
                        {answerLabelSmall}
                        {answerMaterial}
                        {feedbackLabelSmall}
                        {feedbackMaterial}
                      </div>
                    </div>
                  </div>
                  {hr}
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }

  componentWillUnmount() {

  }

  //========================================================================
  // PLACE CUSTOM METHODS AND HANDLERS BELOW HERE
  //========================================================================
  renderLabels() {
    let style = Style.styles();

    return (
      <div style={{display: "table", width: "100%"}}>
        <div style={style.emptyCell}></div>
        <div style={_.merge(style.labelBlock, style.label)}>Answers</div>
        <div style={_.merge(style.labelBlock, style.label)}>Feedback</div>
      </div>
    );
  }

}//end MultiChoiceNAnswerFeedback class

// MultiChoiceNAnswerFeedback.propTypes = {
//   question: React.PropTypes.object.isRequired,
//   windowWidth: React.PropTypes.object.isRequired
// };
