"use strict";

import React        from 'react';
import {Link}       from 'react-router';
import UserActions  from "../../actions/user";
import UserStore    from "../../stores/user";

export default React.createClass({
  
  getState(){
    return {
      logoutState: UserStore.logoutStatus()
    }
  },

  getInitialState(){
    UserActions.logout();
    return this.getState();
  },

    // Method to update state based upon store changes
  storeChanged(){
    this.setState(this.getState());
  },

  // Listen for changes in the stores
  componentDidMount(){
    UserStore.addChangeListener(this.storeChanged);

  },

  // Remove change listers from stores
  componentWillUnmount(){
    UserStore.removeChangeListener(this.storeChanged);
  },

  render(){
    var content;
    if(this.state.logoutState == 1){
      return <h3>One Moment</h3>
    } else if (this.state.login == 2) {
      return ( 
        <div>
          <h2>You have successfully logged out</h2>
          <Link to="login">Home</Link>
        </div> 
      )
    } else {
      return <h3>There was an error logging out, please try again</h3>
    }

    return (
      {content}
    )
  }
});