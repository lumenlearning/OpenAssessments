"use strict()";

import React from 'react';
import Store from '../../stores/assessment';

export default React.createClass({

  getInitialState: function() {
    return {
      messages: [],
      isGraded: false
    };
  },

  render(){
    var messages = '';
    if (this.props.item.messages.length) {

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

    if (this.props.item.isGraded) {
      solution = (<div className="panel-footer text-center">
                    <div className="solution">
                      {this.props.item.solution}
                    </div>
                  </div>);
    }

    return (
      <div className="panel-messages-container panel panel-default">
        <div className="panel-heading text-center">
          {this.props.item.title}
          {messages}
        </div>
        <div className="panel-body">
          {this.props.item.question}
        </div>
        {solution}
      </div>
    );
  }


});
