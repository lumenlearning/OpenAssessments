"use strict";

import React from 'react';

export default class Edit extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      module: {}
    };

    //rebindings
  }

  componentWillMount(){
    //when component will mount, grab data from the editQuiz store
  }

  render(){
    return (
      <div className='quizEditor' >
        <p>Hellow!!!</p>
      </div>
    );
  }

  /*CUSTOM HANDLER FUNCTIONS*/

  /*CUSTOM FUNCTIONS*/
};

module.export = Edit;