import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Login              from '../../../js/components/admin/login';
import Utils              from '../../../specs_support/utils';

describe ('login', function(){
    var login;
    var textFields;

    beforeEach(function(){
        login = TestUtils.renderIntoDocument(<Login />);
        textFields = TestUtils.scryRenderedDOMComponentsWithClass(login, 'mui-text-field');

        spyOn(login, 'handleLogin');  //http://jasmine.github.io/2.3/introduction.html   Spies
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

    //it('Calls the handleLogin method', function(){
    //    Utils.findTextField(textFields, 'email');
    //
    //    expect(login.handleLogin()).toHaveBeenCalled();
    //});

});
