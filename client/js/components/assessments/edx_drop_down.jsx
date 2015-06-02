"use strict";

import React			from 'react';
import Option		from './../common/option.jsx';

export default class EdxDropDown extends React.Component{

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
					return <Option item={item} name="answer-option"/>;
		});

		return (
      <div className="panel-messages-container panel panel-default">
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
EdxDropDown.propTypes = {
	items: React.PropTypes.array.isRequired
};
