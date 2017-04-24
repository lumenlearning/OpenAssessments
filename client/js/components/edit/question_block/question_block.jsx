"use strict";

import React        from "react";
import Style        from "./css/style.js";
import Expandable   from '../../common/expandable_dropdown/expandable_dropdown.jsx';
import CommunicationHandler from "../../../utils/communication_handler";

export default class QuestionBlock extends React.Component{

  constructor(props, state) {
    super(props, state);

    this.handleResize = this.handleResize.bind(this);

    this.state = {
      windowWidth: window.innerWidth
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    CommunicationHandler.sendSize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(e) {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

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

  render() {
    let question    = this.props.question;
    let windowWidth = this.state.windowWidth;
    let style       = Style.styles();
    let labels      = windowWidth < 1001 ? null : this.renderLabels();
    return (
      <div style={style.qbContent}>
        <div style={style.qbContentHead}>
          <p style={style.qbQuestion} dangerouslySetInnerHTML={this.constructor.createMarkup(question.material)} />
        </div>
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
                  let answerMaterial      = answer.material ? (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={this.constructor.createMarkup(answer.material)} />) : (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={this.constructor.createMarkup("&nbsp;")} />);
                  let feedbackMaterial    = answer.feedback ? (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={this.constructor.createMarkup(answer.feedback)} />) : (<div style={_.merge(answerFeedback, style.qbTblCell)} dangerouslySetInnerHTML={this.constructor.createMarkup("&nbsp;")} />);

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
      </div>
    )

  }

  static createMarkup(data) {
    return {__html: data};
  }

}
