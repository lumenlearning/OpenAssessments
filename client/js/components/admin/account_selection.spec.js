import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import AccountSelection   from './account_selection';

describe('account_selection', function() {
  
  
  it('renders account selection page', function() {
    var result = TestUtils.renderIntoDocument(<AccountSelection />);
    expect(result.getDOMNode().textContent).toContain("Accounts");
  });

});