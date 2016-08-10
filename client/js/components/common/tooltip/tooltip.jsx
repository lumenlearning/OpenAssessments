"use strict";

import React                          from 'react';
import _                              from 'lodash';
import BaseComponent                  from '../../base_component.jsx';
import Style                          from './css/style';

export default class Tooltip extends BaseComponent{

  constructor(props, context) {
    super(props, context);

    this._bind('toggleHover');

    this.state = {
      hover: false,
      message: this.props.message,
      mousePos: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
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
    let style         = Style.styles();
    let children      = this.props.children;
    let tooltipStyle  = this.tooltipStyle();

    return (
      <span style={style.tooltipWrapper}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onMouseMove={this.toggleHover}
      >
        {children}
        <span style={tooltipStyle} ref='tooltip'>
          {this.props.message}
        </span>
      </span>
    )

  }

  /*CUSTOM HANDLER FUNCTIONS*/
  toggleHover(e){
    let tooltip = this.refs.tooltip.getDOMNode();
    let hover;
    if(e.type == 'mouseenter'){
      hover = true;
    }
    else if(e.type == 'mouseleave'){
      hover = false;
    }
    else if(e.type == 'mousemove'){
      hover = true;
    }


    this.setState({
      hover: hover,
      mousePos:{
        x: e.clientX,
        y: e.clientY,
        width: tooltip.offsetWidth,
        height: tooltip.offsetHeight
      }
    });
  }

  /*CUSTOM HELPER FUNCTIONS*/
  tooltipStyle(){
    let style       = Style.styles();
    let visibility  = this.state.hover ? "visible" : "hidden";

    return _.merge({visibility: visibility}, style.tooltip, this.positionStyle(this.props.position), this.props.style || {});
  }

  positionStyle(position){
    let width   = this.state.mousePos.width;
    let height  = this.state.mousePos.height;
    let x       = this.state.mousePos.x;
    let y       = this.state.mousePos.y;

    let positions = {
      'top-left':{
        top: y-(height+10),
        left: x-width-10
      },
      'top':{
        top: y-(height+10),
        left: x-(width/2)
      },
      'top-right':{
        top: y-(height+10),
        left: x+10
      },
      'right': {
        top: y-(height/2),
        left: x+10
      },
      'bottom-right':{
        top: y,
        left: x+10
      },
      'bottom':{
        top: y+15,
        left: x-(width/2)
      },
      'bottom-left':{
        top: y+15,
        left: x-width-10
      },
      'left':{
        top: y-(height/2),
        left: x-width-10
      },
    };

    return positions[position];

  }
};

Tooltip.propTypes = {
  message: React.PropTypes.string,
  position: React.PropTypes.string,
  style: React.PropTypes.object
};

Tooltip.defaultProps = {
  message: 'Your Tooltip Message Goes Here',
  position: 'top',
  style: {}
};

