"use strict";

import React        from "react";
import Validator    from "validator";
import UserActions  from "../../actions/user";
import _            from "lodash";
import assign       from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";

export default React.createClass({

  getInitialState(){
    return {
      validations: {}
    };
  },

  handleLogin(e){
    e.preventDefault();
    if(this.validateAll()){
      UserActions.login({
        user: {
          email: this.refs.email.getValue(),
          password: this.refs.password.getValue()
        }
      });
    }
  },

  validateAll(){
    return _.every([
      this.validateEmail()
    ], (v)=> { return v; });
  },

  validate(isValid, invalidState, emptyState){
    if(!isValid){
      this.setState(assign(this.state.validations, invalidState));
    } else {
      this.setState(assign(this.state.validations, emptyState));
    }
    return isValid;
  },

  validateEmail(e){
    return this.validate(
      Validator.isEmail(this.refs.email.getValue()),
      { email: "Invalid email" },
      { email: "" }
    );
  },

  render: function(){
    return (<div className="login-screen">
      <Paper className="login-paper">
        <form action="/users/sign_in" method="post" onSubmit={this.handleLogin}>
          <h4>Admin Login</h4>

          <TextField hintText="johndoe@example.com" floatingLabelText="Email" ref="email" onBlur={this.validateEmail} errorText={this.state.validations.email} />
          <TextField type="password" hintText="******" floatingLabelText="Password" ref="password" />


          <FlatButton className="login-button" label="Login" primary={true} />
        </form>
      </Paper>

    </div>);
  }
});
