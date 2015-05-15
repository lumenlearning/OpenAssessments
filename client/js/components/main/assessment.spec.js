import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Assessment         from './assessment';

describe('assessment', function() {
  it('renders the assessment', function(){
    var result = TestUtils.renderIntoDocument(<Assessment/>);
    var content = React.findDOMNode(result).textContent;
    expect(content.length > 0).toBe(true);
  });
});