import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Item               from './item';

describe('loading', function() {
  
  var result = TestUtils.renderIntoDocument(<Item />);

  it('renders an item', function() {
    expect(result.getDOMNode().textContent).toContain("Item Assessment");
  });
  
});