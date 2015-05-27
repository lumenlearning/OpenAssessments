"use strict";

import React        from "react";
import RadioButton  from "./radio_button";

export default class QtiMultipleChoice extends React.Component{

  render(){
    var items = this.props.items.map((item) => {
      return <RadioButton item={item} name="answer-radio"/>;
    });

    return <div>{items}</div>;
  }
}
