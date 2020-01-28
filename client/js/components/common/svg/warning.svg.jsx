import React, {Component} from "react";

export default class WarningSvg extends Component{
  constructor(props){
    super(props);

  }

  render(){
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24"
           width={this.props.width}
           height={this.props.height}
           aria-hidden="true"
           role="img">
        <g
          fill={this.props.color}
          fill-rule="evenodd">
          <path
            d="M9.4 3.5l-8.2 14A3 3 0 0 0 3.7 22h16.6a3 3 0 0 0 2.5-4.5l-8.2-14a3 3 0 0 0-5.2 0zm3.1.6l.4.4 8.2 14a1 1 0 0 1-.8 1.5H3.7a1 1 0 0 1-.8-1.5l8.2-14a1 1 0 0 1 1.4-.4z"/>
          <path
            d="M12 17a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-9c.6 0 1 .4 1 1v6a1 1 0 0 1-2 0V9c0-.6.4-1 1-1z"/>
        </g>
      </svg>
    );
  }
}
