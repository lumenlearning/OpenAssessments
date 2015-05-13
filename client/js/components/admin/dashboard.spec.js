import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import DashBoard          from './dashboard';

describe('dashboard', function() {
  it('renders the dashboar', function() {
    var result = TestUtils.renderIntoDocument(<DashBoard/>);
    expect(result.getDOMNode().textContent).toContain("Client Info");
  });
});