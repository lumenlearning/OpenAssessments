"use strict";

import React from 'react';

export default React.createClass({

  render(){
    return (
      <div className="btn btn-block btn-question">
        <label className="radio">
          <input type="radio" value={this.props.item.id} name={this.props.item.name} />
          {this.props.item.material}
        </label>
      </div>
    );
  }
});
