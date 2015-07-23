"use strict";

import React           from 'react';
import TestUtils       from 'react/lib/ReactTestUtils';
import CreateUserForm    from './create_user_form';
import SettingsActions from '../../actions/settings';
import StubContext     from '../../../specs_support/stub_context';

describe('create_user_form', function() {
  helpStubAjax(SettingsActions);

  var Subject;
  var result;
  var component;

  beforeEach(()=>{
    Subject = StubContext(CreateUserForm, { accountId: "1"});
    result = TestUtils.renderIntoDocument(<Subject />);
    component = result.refs.originalComponent;
    component.show();
  });

  it("renders the form to edit the users", ()=>{
    expect(React.findDOMNode(component).textContent).toContain("CREATE NEW USER");
  });

  afterEach(()=>{
    React.unmountComponentAtNode(React.findDOMNode(result).parentNode)
  });
});
