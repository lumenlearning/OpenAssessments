import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import NotFound           from './not_found';

describe('not_found', function() {
  it('renders a not found message', function() {
 
    var result = TestUtils.renderIntoDocument(<NotFound/>);
    expect(React.findDOMNode(result).textContent).toEqual('Not Found');

  });
});