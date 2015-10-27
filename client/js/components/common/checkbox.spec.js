import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import Checkbox           from './checkbox';
import StubContext        from '../../../specs_support/stub_context';

describe('checkbox', function() {

  var item = {
    id: 1,
    material: "checkbox label"
  };
  var Content = StubContext(Checkbox, {item: item, name: "answer-radio"});
  var result = TestUtils.renderIntoDocument(<Content />);

  it('renders the checkbox label', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.material);
  });

  it('renders input attributes', function() {
    expect(React.findDOMNode(result).childNodes[0].childNodes[0].childNodes[0].attributes.name.value).toContain("answer-radio");
  });

  it('calls the answerSelected function when clicked', () => {
    spyOn(result.originalComponent(), "answerSelected");
    var checkbox = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    TestUtils.Simulate.click(checkbox);
    expect(result.originalComponent().answerSelected).toHaveBeenCalled();
  });

});
