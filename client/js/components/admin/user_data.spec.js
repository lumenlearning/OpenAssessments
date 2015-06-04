"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UserData           from './user_data';
import StubContext  from '../../../specs_support/stub_context';

describe('user_data', function() {

  var user = {
    userID: 1,
    accountID: 1,
    name: "Joe Jones",
    email: "joe@example.com",
    role: 1
  };

  it("renders the user's name", function() {
    var Subject = StubContext(UserData, { user: user });
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result).textContent).toContain(`Name: ${user.name}`);
  });
  
});