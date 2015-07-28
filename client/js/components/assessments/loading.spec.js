import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Loading            from './loading';
import StubContext        from "../../../specs_support/stub_context";

describe('loading', function() {
  
  var Subject = new StubContext(Loading);
  var result = TestUtils.renderIntoDocument(<Subject />);

  it('renders a loading assessment message', function() {
    expect(React.findDOMNode(result).textContent).toContain("Loading Assessment");
  });
  
});