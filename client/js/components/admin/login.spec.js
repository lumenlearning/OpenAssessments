import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Login              from '../../../js/components/admin/login';
import Utils              from '../../../specs_support/utils';

describe ('Admin login', function(){
  var login;
  var textFields;
  var form;

  beforeEach(function(){
    login = TestUtils.renderIntoDocument(<Login />);
    textFields = TestUtils.scryRenderedDOMComponentsWithClass(login, 'mui-text-field');
    form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
  });

  it('Renders the login component', function(){
    expect(login).toBeDefined();

    var email = Utils.findTextField(textFields, 'email');
    expect(email).toBeDefined();

    var password = Utils.findTextField(textFields, 'password');
    expect(password).toBeDefined();
  });

  it('outputs a validation error if no email is provided', function(){
    TestUtils.Simulate.submit(form);

    var email = Utils.findTextField(textFields, 'email');
    expect(email.getDOMNode().className).toContain('mui-has-error');
    expect(email.getDOMNode().textContent).toContain('Invalid email');
  });

  xit('It submits the form when the Login button is pressed', function(){
    var submitSpy = jasmine.createSpy('submitSpy');
    var container = document.createElement('div');
    var instance = React.render(<Login />, container);
    var button = instance.getDOMNode('submit-button');
    container.addEventListener('onSubmit', submitSpy, false);
    TestUtils.Simulate.click(button);
    expect(submitSpy).toHaveBeenCalled();
    container.removeEventListener('onSubmit', submitSpy, false);
  });

  it('It calls the handleLogin method when the form is submitted', function(){ //The submit has to be called twice, for reasons unknown
    spyOn(login, 'handleLogin');
    TestUtils.Simulate.submit(form);
    TestUtils.Simulate.submit(form);
    expect(login.handleLogin).toHaveBeenCalled();
  });

  xit('It calls the handleLogin method with an email address in the form', function(){  //Trying to figure out double submit issue
    spyOn(login, 'handleLogin');
    var email = Utils.findTextField(textFields, 'email');
    email.getDOMNode().value = 'johndoe@example.com';
    TestUtils.Simulate.submit(form);
    //TestUtils.Simulate.submit(form);
    expect(login.handleLogin).toHaveBeenCalled();
  });

  it('It calls the validateEmail when the form is submitted', function(){
    spyOn(login, 'validateEmail');
    TestUtils.Simulate.submit(form);
    expect(login.validateEmail).toHaveBeenCalled();
  });

  it('It calls the validateEmail method with an email address in the form', function(){
    spyOn(login, 'validateEmail');
    var email = Utils.findTextField(textFields, 'email');
    email.getDOMNode().value = 'johndoe@example.com';
    TestUtils.Simulate.submit(form);
    expect(login.validateEmail).toHaveBeenCalled();
  });
});

