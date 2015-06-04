import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import Matching           from './matching';

describe('matching', function() {

  var item = {
    id: 1,
    material: "test,test2,test3",
    matchMaterial: "salad"
  };
  var result = TestUtils.renderIntoDocument(<Matching item={item} name="answer-option" />);

  it('renders the dropdown items', function() {
    expect(React.findDOMNode(result).textContent).toContain("test");
    expect(React.findDOMNode(result).textContent).toContain("test2");
    expect(React.findDOMNode(result).textContent).toContain("test3");
    expect(React.findDOMNode(result).textContent).toContain("salad");
  });

});