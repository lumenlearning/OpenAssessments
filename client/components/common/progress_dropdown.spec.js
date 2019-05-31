import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import ProgressDropdown        from './progress_dropdown';
import StubContext        from "../../../specs_support/stub_context";

describe('progress dropdown', function() {
  var questions=[{material: "question 1"},{material: "question 2"}, {material: "question 3"}]
  var settings = {images: {}}
  var Subject = new StubContext(ProgressDropdown, {questions: questions, settings: settings});
  var result = TestUtils.renderIntoDocument(<Subject />);

  it('renders the progress dropdown labels', function() {
    expect(React.findDOMNode(result).textContent).toContain(questions[0].material);
  });

});