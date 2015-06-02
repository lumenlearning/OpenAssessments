"use strict";

import React        from "react";
import RadioButton  from "./../common/radio_button";

export default class QtiMultipleChoice extends React.Component{

  render(){
    var messages = '';
    if (this.props.item.messages) {
    
      var renderedMessages = this.props.item.messages.map(function(message){
       return (<li>{message}</li>);
      });

      messages =  (<div className="panel-messages alert alert-danger" role="alert">
                   <ul>
                     {renderedMessages}
                   </ul>
                 </div>);
    }

    var solution = '';

    if (this.props.item.isGraded && this.props.item.solution) {
      solution = (<div className="panel-footer text-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.item.solution
                    }}>
                  </div>
                 </div>);
    }
    var items = this.props.item.answers.map((item) => {
      return <RadioButton item={item} name="answer-radio"/>;
    });

    return (<div className="panel-messages-container panel panel-default">
              <div className="panel-heading text-center">
                {this.props.item.title}
                {messages}
              </div>
              <div className="panel-body">
                {items}
              </div>
              {solution}
            </div>

           );
  }
}
QtiMultipleChoice.propTypes = {
  item: React.PropTypes.array.isRequired
};
