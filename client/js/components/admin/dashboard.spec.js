import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import DashBoard          from './dashboard';

describe('dashboard', function() {
  it('renders a not found message', function() {
 
    var result = TestUtils.renderIntoDocument(<NotFound/>);
    expect(result.getDOMNode().textContent).toContain("Client Info");

  });
});