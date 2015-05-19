import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Login              from '../../../js/components/admin/login';
import Utils              from '../../../specs_support/utils';

describe ('Admin login', function(){
  var login;
  var textFields;
  var form;
  var button;

  beforeEach(function(){
    login = TestUtils.renderIntoDocument(<Login />);
    textFields = TestUtils.scryRenderedDOMComponentsWithClass(login, 'mui-text-field');
    form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
    button = TestUtils.findRenderedDOMComponentWithClass(login, 'login-button');
  });

  it('Renders the login component', function(){
    expect(login).toBeDefined();

    var email = Utils.findTextField(textFields, 'email');
    expect(email).toBeDefined();

    var password = Utils.findTextField(textFields, 'password');
    expect(password).toBeDefined();
  });

  it('outputs a validation error if no email is provided', function(){
    var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
    TestUtils.Simulate.submit(form);

    var email = Utils.findTextField(textFields, 'email');
    expect(email.getDOMNode().className).toContain('mui-has-error');
    expect(email.getDOMNode().textContent).toContain('Invalid email');
  });

  describe('the form is submitted', function(){

    beforeEach(function(){
      spyOn(login, 'handleLogin');

    });

    it('It calls the handleLogin method', function(){ //The submit has to be called twice, for reasons unknown
      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);
      expect(login.handleLogin).toHaveBeenCalled();
    });

    xit('It calls the handleLogin method when the submit button is clicked', function(){
      TestUtils.Simulate.click(button);
      expect(login.handleLogin).toHaveBeenCalled();
    });
  });

});
