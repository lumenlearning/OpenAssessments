import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Loading            from './loading';

describe('loading', function() {
  
  var result = TestUtils.renderIntoDocument(<Loading />);

  it('renders a loading assessment message', function() {
    expect(result.getDOMNode().textContent).toContain("Loading Assessment");
  });
  
});