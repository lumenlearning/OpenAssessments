"use strict";

import React                          from 'react';
import BaseComponent                  from '../base_component.jsx';
import Style                          from './css/style';

export default class Tooltip extends BaseComponent{

  constructor(props, context) {
    super(props, context);

    this.state = {
      hover: false,
      message: this.props.message
    };
  }

  componentWillMount(){
    //when component will mount, grab data from the editQuiz store
  }

  componentWillReceiveProps(nProps, nState){
      if(nProps !== this.props){
        this.setState(nProps);
      }
  }

  render(){



  }

  /*CUSTOM HANDLER FUNCTIONS*/
  toggleHover(e){
    this.setState({
      hover: true
    });
  }

  /*CUSTOM HELPER FUNCTIONS*/
  static getPosition(position){
    switch(position){
      case 'top-left':
        return {};

        break;
      case 'top':
        return {};

        break;
      case 'top-right':
        return {};

        break;
      case 'right':
        return {};

        break;
      case 'bottom-right':
        return {};

        break;
      case 'bottom':
        return {};

        break;
      case 'bottom-left':
        return {};

        break;
      case 'left':
        return {};

        break;
    }
  }
};

Tooltip.propTypes = {
  message: React.PropTypes.string,
  position: React.PropTypes.string
}

Tooltip.defaultProps = {
  message: 'Your Tooltip Message Goes Here',
  position: 'top'
}

