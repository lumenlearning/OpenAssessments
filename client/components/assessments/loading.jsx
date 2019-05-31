"use strict";

import React          from 'react';

export default class Loading extends React.Component{
  
  render() {
    return (
      <div className="container">
        <div className="page-header">
          <div className="panel panel-default">
            <div className="panel-body">
              <p className="alert alert-info">Loading.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

}