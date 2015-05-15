"use strict";

import React                from "react";
import AccountStore         from "../../stores/accounts";

export default React.createClass({

  getInitialState(){
    debugger;
    return {
      account: AccountStore.accountById(this.props.params.accountId)
    }
  },

  render(){

    return (<div>{this.state.account.name}Salad</div>);
  }

});
