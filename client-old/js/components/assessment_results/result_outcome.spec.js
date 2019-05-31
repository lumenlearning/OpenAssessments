import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import ResultOutcome      from './result_outcome';
import StubContext        from "../../../specs_support/stub_context";

describe('result outcome', function() {
  
  var outcomes = {
    longOutcome: "Long",
    shortOutcome: "Short"
  };
  var Subject = new StubContext(ResultOutcome, {level: "Just A Guess", outcomes: outcomes, correct: true});
  var result = TestUtils.renderIntoDocument(<Subject />);

  it('renders the outcome', function() {
    expect(React.findDOMNode(result).textContent).toContain("ShortLong");
  });

});