"use strict";

import React         from "react";
import Validator     from "validator";
import UserActions   from "../../actions/user";
import _             from "lodash";
import assign        from "object-assign";
import UserStore     from "../../stores/user";
import BaseComponent from "../base_component";
import { Link }      from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";


export default class Login extends BaseComponent {

  constructor(props, context){
    super(props, context);

    this.stores = [UserStore];
    this.state = this.getState();

    this._bind("handleLogin", "validateAll", "validate", "validateEmail");
    if(this.state.loggedIn) {
      context.router.transitionTo("dashboard");
    }
  }

  getState() {
    return {
      loggedIn: UserStore.loggedIn(),
      validations: {}
    };
  }

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
  }

  validateAll(){
    return _.every([
      this.validateEmail()
    ], (v)=> { return v; });
  }

  validate(isValid, invalidState, emptyState){
    if(!isValid){
      this.setState(assign(this.state.validations, invalidState));
    } else {
      this.setState(assign(this.state.validations, emptyState));
    }
    return isValid;
  }

  validateEmail(e){
    return this.validate(
      Validator.isEmail(this.refs.email.getValue()),
      { email: "Invalid email" },
      { email: "" }
    );
  }

  getStyles() {
    return {
      paper: {
        backgroundColor: "white",
        width: "345px",
        margin: "auto"
      },

      container: {
        marginTop: "10px",
        margin: "auto"
      }
    };
  }

  render(){
    return (<div className="login-screen">
      <Paper className="login-paper">
        <form action="/login" method="post" onSubmit={(e) => this.handleLogin(e)}>
          <h4>Login</h4>

          <TextField hintText="johndoe@example.com" floatingLabelText="Email" ref="email" onBlur={this.validateEmail} errorText={this.state.validations.email} />
          <TextField type="password" hintText="******" floatingLabelText="Password" ref="password" />
          <Link to="register">Create Account</Link>

          <Button className="login-button" label="Login" primary={true} />
        </form>
      </Paper>

      <div className="button-example-container">
        <Button className="auth-button" linkButton={true} href="/auth/facebook" secondary={true}>
          <Icon className="icon-facebook example-button-icon"/>
          <span className="mui-raised-button-label example-icon-button-label">Facebook</span>
        </Button>
      </div>

      <div className="button-example-container">
        <Button className="auth-button" linkButton={true} href="/auth/twitter" secondary={true}>
          <Icon className="icon-twitter example-button-icon"/>
          <span className="mui-raised-button-label example-icon-button-label">Twitter</span>
        </Button>
      </div>

      <div className="button-example-container">
        <Button className="auth-button" linkButton={true} href="/auth/google" secondary={true}>
          <Icon className="icon-google example-button-icon"/>
          <span className="mui-raised-button-label example-icon-button-label">Google+</span>
        </Button>
      </div>

    </div>);
  }

}

// Login.contextTypes = {
//   router: React.PropTypes.func
// };
