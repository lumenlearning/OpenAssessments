import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import Matching           from './matching';

describe('matching', function() {

  var item = {
    id: 1,
    material: "matching",
    answers: [{
      id: "0",
      matchMaterial: "test",
      material: "match this",
    },
    {
      id: "1",
      matchMaterial: "test",
      material: "match this also",
    }],
    correct: [{
      id: "0",
    }]
  };
  var result = TestUtils.renderIntoDocument(<Matching item={item} name="answer-option" />);

  it('renders the dropdown items', function() {
    expect(React.findDOMNode(result).textContent).toContain("test");
    expect(React.findDOMNode(result).textContent).toContain("match this");
    expect(React.findDOMNode(result).textContent).toContain("match this also");
  
  });

  it('calls the answerSelected function when change', () => {
    spyOn(result, "answerSelected");
    var select = TestUtils.findRenderedDOMComponentWithTag(result, 'select');
    TestUtils.Simulate.change(select);
    expect(result.answerSelected).toHaveBeenCalled();
  });

});