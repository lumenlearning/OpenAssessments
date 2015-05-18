import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UsersList           from './users_list';

describe('user_data', function() {

  it("renders the users list", function() {
    var result = TestUtils.renderIntoDocument(<UsersList />);
    expect(React.findDOMNode(result).textContent).toContain("Users");
  });
  
});