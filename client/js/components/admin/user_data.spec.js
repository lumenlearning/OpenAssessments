import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UserData           from './user_data';

describe('user_data', function() {

  var user = {
    userID: 1,
    accountID: 1,
    name: "Joe Jones",
    email: "joe@example.com",
    role: 1
  };

  it("renders the user's name", function() {
    var result = TestUtils.renderIntoDocument(<UserData user={user} />);
    expect(result.getDOMNode().textContent).toContain(`Name: ${user.name}`);
  });
  
});