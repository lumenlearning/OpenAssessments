import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UsersList           from './users_list';

xdescribe('users_list', function() {

it("renders the users list", function() {
    var params = {accountId: 1};
    var result = TestUtils.renderIntoDocument(<UsersList params={params}/>);
    expect(React.findDOMNode(result).textContent).toContain("Users");
  });
  
});