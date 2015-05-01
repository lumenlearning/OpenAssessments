import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import RadioButton        from './radio_button';

describe('radio button', function() {
  
  var item = {
    id: 1,
    name: "Radio Button",
    material: "The radio button label"
  };
  var result = TestUtils.renderIntoDocument(<RadioButton item={item} />);
  
  it('renders the radio button label', function() {
    expect(result.getDOMNode().textContent).toContain(item.material);
  });
  
  it('renders input attributes', function() {
    expect(result.getDOMNode().childNodes[0].childNodes[0].attributes.name.value).toContain(item.name);
  });

});