import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import QTITrueFalse       from './qti_true_false';

describe('qti true false', function() {

  var items = [
    {
      id: 1,
      name: "QTI True False",
      material: "The true false choice label"
    },
    {
      id: 2,
      name: "QTI True false 2",
      material: "The true false choice label 2"
    }
  ];
  var result = TestUtils.renderIntoDocument(<QTITrueFalse items={items} />);

  it('renders the radio button label', function() {
    expect(React.findDOMNode(result).textContent).toContain(items[0].material);
  });

  it('renders input attributes', function() {
    expect(React.findDOMNode(result).childNodes[0].childNodes[0].childNodes[0].attributes.name.value).toContain(items[0].name);
  });

});