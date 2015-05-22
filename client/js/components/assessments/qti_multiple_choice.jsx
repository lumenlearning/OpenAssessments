"use strict";

import React        from "react";
import RadioButton  from "./radio_button";

export default React.createClass({

  render(){
    var items = this.props.items.map((item) => {
      return <RadioButton item={item}/>;
    });

    return <div>{items}</div>;
  }
});
