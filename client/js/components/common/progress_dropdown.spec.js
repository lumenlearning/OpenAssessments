import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import ProgressDropdown        from './progress_dropdown';
import StubContext        from "../../../specs_support/stub_context";

describe('progress dropdown', function() {
  var questions=[{material: "question 1"},{material: "question 2"}, {material: "question 3"}]
  var Subject = new StubContext(ProgressDropdown, {questions: questions});
  var result = TestUtils.renderIntoDocument(<Subject />);
  it('renders the progress dropdown label', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.material);
  });

  it('renders input attributes', function() {
    expect(React.findDOMNode(result).childNodes[0].childNodes[0].attributes.name.value).toContain("answer-radio");
  });

  it('calls the answerSelected function on click', () => {
    spyOn(result, "answerSelected");
    var radio = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    TestUtils.Simulate.click(radio);
    expect(result.answerSelected).toHaveBeenCalled();
  });

});