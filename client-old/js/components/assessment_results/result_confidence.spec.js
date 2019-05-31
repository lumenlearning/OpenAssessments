import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import ResultConfidence   from './result_confidence';
import StubContext        from "../../../specs_support/stub_context";

describe('result confidence', function() {
  var Subject = new StubContext(ResultConfidence, {level: "Just A Guess"});
  var result = TestUtils.renderIntoDocument(<Subject />);

  it('renders the confidence levels', function() {
    expect(React.findDOMNode(result).textContent).toContain("Just A Guess");
  });

});