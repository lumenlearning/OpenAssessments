import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import AccountSelection   from './account_selection';
import StubRouterContext  from '../../../specs_support/stub_router_context'; 

describe('account_selection', function() {
  // TO RUN MORE TESTS YOU WILL HAVE TO SIMULATE LOGGING IN
  beforeEach(function(){
    localStorage.setItem('jwt', "asdfasdfasf");
  });

  it('renders account selection page', function() {
    var Subject = StubRouterContext(AccountSelection, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(result.getDOMNode().textContent).toContain("Account");
    localStorage.removeItem('jwt');
  });

});