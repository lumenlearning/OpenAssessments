import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import Checkbox           from './checkbox';

describe('checkbox', function() {

  var item = {
    id: 1,
    material: "checkbox label"
  };
  var result = TestUtils.renderIntoDocument(<Checkbox item={item} name="answer-radio" />);

  it('renders the checkbox label', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.material);
  });

  it('renders input attributes', function() {
    expect(React.findDOMNode(result).childNodes[0].childNodes[0].attributes.name.value).toContain("answer-radio");
  });

});
