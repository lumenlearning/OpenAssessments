"use strict";

import React from 'react';

export default React.createClass({
  
  render(){
    return (
      <div class="btn btn-block btn-question">
        <label class="radio">
          <input type="radio" value={this.props.item.id} name={this.props.item.name} />
          {this.props.item.material}
        </label>
      </div>
    );
  }

});




