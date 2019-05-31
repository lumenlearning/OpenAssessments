import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import ProgressListItem   from './progress_list_item';
import StubContext        from "../../../specs_support/stub_context";

describe('Progress list item', function() {
  var question = {
    material: "Hello World"
  };

  var index = 0;
  var toggle = ()=>{};
  var Subject = new StubContext(ProgressListItem, {question: question, index: index, toggle: toggle});
  var result = TestUtils.renderIntoDocument(<Subject />);

  it('renders the progress list item', function() {
    expect(React.findDOMNode(result).textContent).toContain("Hello World");
  });

});