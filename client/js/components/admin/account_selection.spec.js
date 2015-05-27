"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import AccountSelection   from './account_selection';
import StubRouterContext  from '../../../specs_support/stub_router_context'; 

xdescribe('account_selection', function() {
  // TO RUN MORE TESTS YOU WILL HAVE TO SIMULATE LOGGING IN

  it('renders account selection page', function() {
    localStorage.setItem('jwt', "asdfasdfasf");
    var Subject = StubRouterContext(AccountSelection, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(result.getDOMNode().textContent).toContain("Account");
    localStorage.removeItem('jwt');
  });

  it('does not render the page if you are not logged in', function() {
    var Subject = StubRouterContext(AccountSelection, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(result.getDOMNode().textContent).not.toContain("Account");
  });

});