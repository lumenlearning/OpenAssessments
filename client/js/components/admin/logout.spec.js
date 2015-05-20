import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Logout             from './logout';
import StubRouterContext  from '../../../specs_support/stub_router_context'; 
describe('logout', function() {
  
  it("renders the logout page", function() {
    var Subject = StubRouterContext(Logout, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(result.getDOMNode().textContent).toContain("One Moment");
  });
  
});