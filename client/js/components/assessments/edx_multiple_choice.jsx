"use strict";

import React        from "react";

export default class EdxMultipleChoice extends React.Component{
  render(){
    var messages = '';
    var solution = '';
    var question = '';

    if(this.props.item.messages.length){
      var renderedMessages = this.props.item.messages.map(function(message){
        return <li>{message}</li>;
      });
      messages =  <div className="panel-messages alert alert-danger" role="alert">
                    <ul>
                      {renderedMessages}
                    </ul>
                  </div>;
    }

    if(this.props.item.isGraded) {
      solution =  <div className="solution">
                    {this.props.item.solution}
                  </div>;
    }



    return  <div className="panel-messages-container panel panel-default">
              <div className="panel-heading text-center">
                {this.props.item.title}
                {messages}
              </div>
              <div className="panel-body">
                {this.props.item.question}
              </div>
              <div className="panel-footer text-center">
                {solution}
              </div>
            </div>
  }
}

EdxMultipleChoice.propTypes = {
  item: React.PropTypes.object.isRequired
};
