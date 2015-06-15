import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Assessment         from './assessment';

describe('assessment', function() {
  var result;

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(<Assessment/>);
  });
  afterEach(() => {
    result.remove();
    result = null;
  });
  it('renders the assessment', function(){
    var content = React.findDOMNode(result).textContent;
    expect(content.length > 0).toBe(true);
  });
});