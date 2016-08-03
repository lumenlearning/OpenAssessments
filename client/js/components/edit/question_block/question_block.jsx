"use strict";

import React        from "react";
import Style        from "./css/style.js";
import Expandable   from '../../common/expandable_dropdown/expandable_dropdown.jsx';

export default class QuestionBlock extends React.Component{

  constructor(props, state) {
    super(props, state);
  }

  componentWillMount() {

  }

  render() {
    let question = this.props.question;
    let style    = Style.styles();

    return (
      <div style={style.qbContent}>
        <div style={style.qbContentHead}>
          <p style={style.qbQuestion} dangerouslySetInnerHTML={this.constructor.createMarkup(question.material)} />
        </div>
        <Expandable>
          <div style={style.qbAnswerTable}>
            <div style={style.qbTblHead} >
              <div style={_.merge({}, style.qbHeadItem, style.qbSm)} ></div>
              <div style={style.qbHeadItem} >Answers</div>
              <div style={style.qbHeadItem} >Feedback</div>
            </div>
            <div style={style.qbTblContent} >
              {
                question.answers.map((answer, i)=>{
                  let img = null;
                  if(answer.isCorrect){
                    img = (<img style={style.checkOrExit} src="/assets/checkbox-48.png" alt="This Answer is Correct"/>);
                  }

                  return (
                    <div key={i} style={style.qbTblRow} >
                      <div style={_.merge({}, style.qbTblCell, style.qbSm)} >
                        {img}
                      </div>
                      <div style={style.qbTblCell} dangerouslySetInnerHTML={this.constructor.createMarkup(answer.material)} />
                      <div style={style.qbTblCell} dangerouslySetInnerHTML={this.constructor.createMarkup("Answer Feedback")} />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Expandable>
      </div>
    )

  }

  static createMarkup(data) {
    return {__html: data};
  }

}
