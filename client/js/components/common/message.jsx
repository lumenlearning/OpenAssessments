"use strict";

import React          from 'react';

export default class Message extends React.Component{
  
  render() {
    return (
      <li>
        {this.props.children}
      </li>
    );
  }

}

Message.propTypes={
  children: React.PropTypes.node
};
